---
sidebar_position: 1
description: Installeer @dineug/erd-editor via npm of een CDN, registreer de elementen editor en viewer, sluit de bestandsdialoogvensters aan en upgrade vanaf 4.x of 3.x.
---

# Installeren

```sh
npm install @dineug/erd-editor
```

Het pakket is uitsluitend ESM (`"type": "module"`) en bevat alleen de map `dist`.
Er is geen CommonJS-build, dus `require('@dineug/erd-editor')` werkt niet.

Het bevat twee custom elements: `<erd-editor>`, de editor, en, sinds `5.0.0`, `<erd-viewer>`, dat een diagram in alleen-lezenmodus toont — zie [ErdViewerElement](./erd-viewer-element.md).
Sinds `5.0.0` definieert het importeren van de root van het pakket geen van beide. Elk element heeft een eigen ingangspunt dat het definieert — zie [De elementen registreren](#registering-the-elements).

De runtime-afhankelijkheden blijven extern, als bare imports die je bundler oplost, ontdubbelt en via tree-shaking inkort. Sinds `5.0.0` bevat `dist` één bestand per module, zodat een bundler alleen de modules behoudt die een pagina bereikt — zie [Ingangspunten](#entry-points).
De shared workers worden als aparte ingangsbestanden onder `dist/workers/` gegenereerd en aangemaakt met `new URL('./…', import.meta.url)`, de schrijfwijze die Vite, webpack 5 en Rspack als worker-ingangspunt bundelen. Zie [Web Workers](#web-workers).
Voor een pagina zonder bundler erachter zijn er twee zelfstandige builds — zie [Scripttag](#script-tag).

## Gebruik {#usage}

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`@dineug/erd-editor/erd-editor.js` definieert `<erd-editor>` zodra het wordt geïmporteerd. Een pagina die alleen een diagram toont, importeert in plaats daarvan `@dineug/erd-editor/erd-viewer.js` — zie [ErdViewerElement](./erd-viewer-element.md).

`<erd-editor>` heeft geen eigen afmetingen. Geef het element (of zijn container) een expliciete breedte en hoogte.
Sinds `4.1.0` is een geopende [Verkenner](../guide/guides/explorer.md) binnen het element vastgezet, links van het ERD-canvas, en maakt hij het canvas smaller in plaats van het te bedekken. Een nieuwe editor start met de Verkenner gesloten.
Het paneel wordt nooit smaller dan `200px` getekend en laat voor het canvas minstens `320px` over, dus in een element dat smaller is dan `520px` wordt een geopende Verkenner pas getekend als het element breder wordt — zie [Naast het canvas](../guide/guides/explorer.md#beside-the-canvas).

`setInitialValue('')` start een nieuw, leeg document. Als je `value` toewijst, wordt een document in plaats daarvan als bewerking geladen, zodat het in de geschiedenis terechtkomt.
Sinds `4.0.0` is `editor.value` het document in de vorm die een bestand bevat, en dat is wat je opslaat. `editor.runtimeValue` is het document zoals de editor het bijhoudt, verwijderde entiteiten inbegrepen: het dient om een medebewerker te initialiseren en gaat nooit naar een bestand — zie [runtimeValue](./erd-editor-element.md#runtimevalue).
Sinds `4.0.0` staat in een nieuw document ook elke [instellingsvergrendeling](../guide/guides/settings.md#lock) aan: het weergavegebied, het tabblad, de taal van de Codegenerator, beide naamnotaties, het type aanhalingstekens en, sinds `4.2.0`, de [naamweergave](../guide/guides/logical-names.md#name-view). Scrollen, zoomen, van tabblad wisselen, van naamweergave wisselen of een van de andere instellingen wijzigen laat `editor.value` zoals het was, en er treedt geen `change` op. Een document dat uit tekst is geladen, behoudt de vergrendelingen die het noemt. Een document dat er geen noemt, zoals elk bestand dat vóór `4.0.0` is opgeslagen, opent met elke vergrendeling aan, op een zoomniveau van 100% en op het ERD-tabblad, ongeacht het weergavegebied en het tabblad die het heeft opgeslagen. Het weergavegebied wordt vergrendeld op de oorsprong `0, 0`, en de weergave opent in plaats daarvan op het diagram als daar niets van het diagram wordt getekend — zie [setInitialValue](./erd-editor-element.md#setinitialvalue).
Een bestand dat vóór `4.2.0` is opgeslagen, opent met de naamweergave vergrendeld op `Physical Names`, ook een bestand waarin elke andere vergrendeling uitstaat. Een editor van `4.0.0` of `4.1.0` behoudt bij het opslaan de vergrendeling van de naamweergave zoals ze staat, maar laat de weergave zelf vallen, dus een bestand van `4.2.0` dat met ontgrendelde naamweergave is opgeslagen, blijft ontgrendeld maar opent daarna weer in `Physical Names`.
Zie [ErdEditorElement](./erd-editor-element.md) voor de rest van de API.

### CDN {#cdn}

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js"></script>
```

`esm.run` lost de externe afhankelijkheden van het pakket voor je op, dus dit werkt zonder bundler.
Elk ingangspunt bereik je met zijn pad na de versie: `…/erd-editor.js` definieert de editor, en `…/erd-viewer.js` de viewer, die elke weergavetaal behalve Engels van de CDN ophaalt zodra een pagina erom vraagt. De kale pakket-URL, `https://esm.run/@dineug/erd-editor@5.0.0`, levert de root, die geen element definieert.
Een URL zonder versienummer levert altijd de nieuwste versie. Zet een versie vast, zoals hierboven, als je niet wilt dat een upgrade naar een nieuwe hoofdversie onaangekondigd je pagina bereikt.
`5.0.0` is zelf zo'n upgrade: een pagina die op 4.x moet blijven, zet `@4.2.0` vast — zie [Upgraden vanaf 4.x](#upgrading-from-4x).

`esm.run` levert de shared workers vanaf `cdn.jsdelivr.net`, en een browser start geen shared worker vanaf een andere origin dan die van de pagina. Een editor die zo wordt geladen, draait dus zonder zijn workers, zoals op een host die ze blokkeert — zie [Web Workers](#web-workers). De [scripttag](#script-tag)-build bevat ze in zijn bestand.

### Scripttag {#script-tag}

Sinds `3.6.0` levert het pakket ook een UMD-build met elke afhankelijkheid en elke shared worker in één bestand, `dist/erd-editor.umd.js`.
Daar verwijzen de velden `unpkg` en `jsdelivr` naar, dus de kale pakket-URL levert deze build op elk van beide CDN's, en hij definieert `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Het laden ervan definieert `<erd-editor>`. `window.ErdEditor` bevat de twee bestandscallbacks, `ErdEditor.setExportFileCallback` en `ErdEditor.setImportFileCallback`, sinds `3.9.2` `ErdEditor.createKeyBindingMap`, sinds `4.2.0` `ErdEditor.dictionaryRowChords` — zie [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) — en sinds `5.0.0` `ErdEditor.ErdEditorElement` en `ErdEditor.defineErdEditor` — zie [De elementen registreren](#registering-the-elements). Het bevat geen [toImage](./to-image.md).

Sinds `5.0.0` definieert een tweede bestand, `dist/erd-viewer.umd.js`, `<erd-viewer>` en zet het `ErdViewerElement` en `defineErdViewer` op `window.ErdViewer`. Het start geen worker, bevat alle 25 weergavetalen en vraagt niets op behalve de `src` die het krijgt.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

Geen van beide bestanden definieert de tag van het andere, en elk laat op de pagina geen global achter behalve de eigen en `window.Konva`.
De exports-map wijst een bundler nog steeds naar de ES-modules, dus een installatie via npm pikt geen van beide bestanden ooit op.
Een pagina die geen eigen script kan laden, kan in plaats daarvan de gehoste viewer op erd-editor.io/embed in een frame tonen — zie [Insluiten](../guide/guides/embedding.md).

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.querySelector('erd-editor');
</script>
```

```css
erd-editor {
  display: block;
  width: 100%;
  height: 100vh;
}
```

Sinds `4.0.0` voegt `enable-locale-picker` de kiezer `Display Language` aan de werkbalk toe en `enable-welcome-screen` het welkomstscherm dat een leeg diagram toont — zie [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) en [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
Een pagina die een document laadt, zoals [Gebruik](#usage) doet, schakelt `enableWelcomeScreen` pas in wanneer `setInitialValue()` het document heeft geladen en niet in de markup, zodat het scherm nooit even verschijnt boven een bestand dat nog wordt geladen.
De editor bevat alle 25 weergavetalen, zowel in de ES-build als in de scripttag-build, dus er is geen taalbestand om te leveren en niets om te registreren. Zonder de kiezer en zonder een aanroep van `setLocale()` verschijnt de editor in het Engels.

Voeg je hier `readonly` toe, dan opent de editor als lezer: een toewijzing aan `value`, een aanroep van `clear()` en elke aanroep van `setSchema*()` — `setSchemaJSON()` en een toevoeging inbegrepen — worden genegeerd, en het event `change` treedt nooit op. Zijn tabbladen, de Verkenner en Snel zoeken blijven om te lezen, en elk bedieningselement dat het diagram zou bewerken is weg.
Het lezen van `editor.value` en `editor.runtimeValue` werkt nog wel, en beide behouden de eigen instellingen van het document: een weergave-instelling die de lezer wijzigt, zoals de zoom of het databasesysteem, blijft op het scherm van die editor. Laad in plaats daarvan met `setInitialValue()` — zie [readonly](./erd-editor-element.md#readonly).

### Server-side rendering {#server-side-rendering}

Elk ingangspunt behalve `engine.js` en `peer.js` heeft een DOM nodig, dus het gooit in Node een fout. `erd-editor.js` en `erd-viewer.js` definiëren hun element op moduleniveau, en de root van het pakket, die sinds `5.0.0` niets definieert, bouwt bij het laden nog steeds beide elementklassen.
Benader in Next.js, Nuxt, SvelteKit of Astro het ingangspunt van het element via een pad dat alleen op de client wordt uitgevoerd, en een named import uit de root, zoals `setExportFileCallback` of `toImage`, via hetzelfde pad.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

Voeg in ontwikkeling de ELK-bundle die de indelingsworker van de editor importeert toe aan de pre-bundling van Vite, anders mislukken de indelingen die die worker maakt: `Flow`, `Tree - vertical` en `Tree - horizontal` van Automatische indeling, de stroommodus van het tabblad Visualisatie en een import die door Flow wordt geplaatst.
Vite 7 en ouder hebben bovendien de editor buiten de pre-bundling nodig, omdat hun pre-bundle de URL's van de workers naar bestanden wijst die nooit worden geschreven, zodat alle drie de workers mislukken. Laat op Vite 8 die `exclude` weg, die er alleen voor zorgt dat de ontwikkelserver elk bestand van het pakket apart ophaalt. Een productiebuild heeft geen van beide nodig.

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@dineug/erd-editor > elkjs/lib/elk.bundled.js'],
    // Vite 7 and older only:
    // exclude: ['@dineug/erd-editor'],
  },
};
```

### TypeScript {#typescript}

Het importeren van `@dineug/erd-editor/erd-editor.js` voegt `erd-editor` toe aan `HTMLElementTagNameMap`, en `@dineug/erd-editor/erd-viewer.js` voegt `erd-viewer` toe, dus het element krijgt zijn type zonder cast. Elke import uit de root, een alleen-type-import inbegrepen, brengt beide mee.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` wordt geëxporteerd om je eigen variabelen en props te annoteren. Sinds `5.0.0` is het ook de klasse van het element, en `ErdViewerElement` is de interface en klasse van de viewer — zie [De elementen registreren](#registering-the-elements).
Sinds `4.0.0` exporteert het pakket ook de typen `LocaleCode`, `LocaleOption` en `SchemaSQLOptions`, en sinds `5.0.0` `ToImageOptions` — zie [Ingangspunten](#entry-points). De opties die de methoden `setSchema*()` accepteren, hebben geen geëxporteerde naam; lees ze af van het element, als `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.
Sinds `5.0.0` typeert de `typesVersions` van het pakket elk subpad-ingangspunt ook onder `moduleResolution: "node10"`, dat geen exports-map leest.

## De elementen registreren {#registering-the-elements}

Sinds `5.0.0` definieert het pakket een tag alleen waar een pagina erom vraagt.

| Import | Definieert |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | Niets |

Elk van de twee ingangspunten definieert zijn tag zodra het wordt geëvalueerd en exporteert niets, dus je importeert het voor het effect, en geen van beide definieert de tag van het andere.
De root exporteert beide elementklassen, `ErdEditorElement` en `ErdViewerElement`, en `defineErdEditor()` en `defineErdViewer()`, die hun tag definiëren waar je ze aanroept:

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

Een aanroep doet niets zolang de tag die klasse al bevat, dus een ingangspunt en een define-aanroep, of twee define-aanroepen, kunnen op één pagina samenkomen. Hij gooit een `Error` die de tag noemt wanneer een andere klasse hem bevat, zoals een tweede kopie van het pakket die in dezelfde pagina is gebundeld: `Another element class already defines the custom element name erd-editor`.
De klassen van de root zijn die welke de ingangspunten definiëren, dus `customElements.get('erd-editor') === ErdEditorElement` zodra een van beide heeft gedraaid. Totdat de tag is gedefinieerd, maakt `document.createElement('erd-editor')` een gewoon `HTMLElement` zonder een van de leden van de editor, en `new ErdEditorElement()` gooit een fout.

Voor een eigen tag definieer je de klasse zelf onder die tag en voeg je de tag zelf toe aan `HTMLElementTagNameMap`. Doe dat in een window dat noch het ingangspunt van dat element noch zijn [scripttag](#script-tag)-build laadt en er geen define-functie voor aanroept, omdat een klasse per window één naam krijgt:

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

Een bundle die beide elementen bevat, laat Vite en Rolldown één keer per weergavetaal behalve Engels een `INEFFECTIVE_DYNAMIC_IMPORT` melden. De viewer laadt elk daarvan met een eigen `import()`, en de editor importeert elk woordenboek tegelijk, dus ze blijven in de chunk van de editor en laden ermee. Niets mislukt, en een bundle met alleen de viewer houdt elke taal in een eigen chunk.

## Syntaxismarkering {#syntax-highlighting}

De panelen Schema SQL en Codegenerator krijgen hun syntaxismarkering van [Shiki](https://shiki.style), in een eigen shared worker, en sinds `4.0.0` geldt dat ook voor de scripts `Before tables` en `After tables` op het tabblad Schema SQL.
Sinds `3.7.0` is er niets te installeren en niets te registreren: de worker wordt aangemaakt de eerste keer dat een codepaneel wordt weergegeven, dus een pagina die er geen opent, haalt de grammatica's nooit op.

| | |
| --- | --- |
| Talen | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Thema's | `github-dark` en `github-light`, volgens het lichte of donkere uiterlijk van de editor |

Dat zijn precies de talen die de panelen genereren: `JPA` wordt gemarkeerd als Java, `SQLAlchemy` als Python, `TypeORM`, `Sequelize`, `Drizzle` en `Zod` als TypeScript, `Doctrine` als PHP, `SeaORM` als Rust, `JSON Schema` als JSON en `DBML` en `AML` als SQL, de dichtstbijzijnde grammatica in de bundel — zie [Codegenerator](../guide/guides/code-generator.md).

De regex-engine is puur JavaScript, dus geen enkel beleid van de host heeft `wasm-unsafe-eval` nodig.
Waar `SharedWorker` ontbreekt — Chrome op Android vóór Chrome 148, Safari vóór 16.4 — wordt de fout gelogd en verschijnt de code als platte tekst; de scripts zijn nog steeds te bewerken.

Upgraden vanaf `3.6.0` of eerder: `@dineug/erd-editor-shiki-worker` wordt niet meer gepubliceerd, en `setGetShikiServiceCallback` is daarmee ook verdwenen.
Verwijder de installatie en de registratie; een pagina die de worker van een CDN laadde, verwijdert ook die tweede `<script>`-tag.

## Web Workers {#web-workers}

De editor voert drie taken uit in `SharedWorker`s: syntaxismarkering, het exporteren van afbeeldingen en de tabelindeling achter [Automatische indeling](../guide/guides/table-related-functions.md#auto-layout), de [stroommodus](../guide/guides/visualization.md#how-flow-is-placed) van het tabblad Visualisatie en, sinds `4.0.0`, de plaatsing van een geïmporteerd schema.
Alle drie zitten in `@dineug/erd-editor`. Geen ervan hoef je zelf in te stellen, maar elk ervan kan door een host worden geblokkeerd.
Sinds `5.0.0` wordt elke worker aangemaakt in een eigen module, zodat een bundle alleen de workers bevat die zijn modules bereiken: een bundle van [toImage](./to-image.md) en geen element bevat alleen de worker voor de afbeeldingsexport, en `<erd-viewer>` start helemaal geen worker — zie [Ingangspunten](#entry-points).
De worker die de garbage collection van het document uitvoerde, is in `4.0.0` verwijderd, samen met de garbage collection zelf.

| Worker | Zonder de worker |
| --- | --- |
| Syntaxismarkering | De panelen Schema SQL en Codegenerator en de Schema SQL-scripts blijven platte tekst |
| Afbeeldingsexport | De PNG, de SVG, `Copy to clipboard`, het voorbeeld in het dialoogvenster `Export image` en, sinds `5.0.0`, [toImage()](./to-image.md) worden op de hoofdthread getekend, wat de pagina blokkeert zolang het tekenen duurt |
| Tabelindeling | De indelingen `Flow`, `Tree - vertical` en `Tree - horizontal` van Automatische indeling en de stroommodus van het tabblad Visualisatie eindigen in `Could not place tables`; een import die door Flow wordt geplaatst — een SQL-, GraphQL-, DBML- of AML-bestand via `Import` of `Import and Add`, of een aanroep van `setSchema*()` met `placement: 'auto'` — zet zijn tabellen zonder melding in rijen neer; `Force` en de graafmodus worden niet beïnvloed, omdat ze binnen de editor draaien |

De afbeeldingsexport wacht tien seconden op een antwoord van zijn worker en tekent daarna op de hoofdthread, en de syntaxismarkering laat de code als platte tekst staan zodra zijn worker faalt, dus een host die workers blokkeert, kost prestaties in plaats van functionaliteit.
De tabelindeling is de uitzondering: de engine die een indeling berekent, is groter dan de editor zelf en wordt nooit in hetzelfde proces geladen, dus bij de eerste plaatsing wacht de tabelindeling dertig seconden op zijn worker, en zodra de worker heeft geantwoord, krijgt een indeling zestig seconden om terug te komen.
Als een van beide wachttijden verstrijkt, eindigt de plaatsing zoals zonder de worker. Automatische indeling toont `Placing tables` zodra die start, terwijl de stroommodus en een import die door Flow wordt geplaatst, dit pas tonen wanneer een plaatsing, inclusief het starten van zijn worker, al zes seconden loopt.

Vite, webpack 5 en Rspack geven de workers als bestanden naast je chunks uit. esbuild, en Rolldown wanneer het op zichzelf wordt gebruikt in plaats van via Vite, geven er geen uit, dus een pagina die ze bouwen draait zonder de workers.
Onder het experimentele `experiments.outputModule` van webpack start geen enkele worker, omdat elk wacht op een ervan afgesplitste chunk die niets laadt. Houd webpacks standaarduitvoer aan, of stel `optimization.splitChunks: false` in.

### Content Security Policy {#content-security-policy}

Een pagina onder een strikt Content Security Policy heeft deze directives nodig voor de elementen:

- `worker-src 'self'` voor de gebundelde build, waarvan de workers bestanden naast het pakket zijn, plus `blob:` als je bundler een worker inline opneemt. In de [scripttag](#script-tag)-build zitten alle drie als `data:`-URL's in het bestand, dus die pagina heeft in plaats daarvan `worker-src data:` nodig. `<erd-viewer>` heeft geen van beide nodig, omdat hij geen worker start.
- Sinds `5.0.0` stijlen beide elementen zichzelf met constructed stylesheets, die `style-src 'self'` doorlaat. De codepanelen van de editor kleuren hun tekst nog steeds met `style`-attributen, en het voorbeeld in het dialoogvenster `Export image` is een afbeelding op een `blob:`-URL, dus de editor heeft daarvoor ook `style-src 'unsafe-inline'` en `img-src blob:` nodig.
- Een browser zonder constructed stylesheets, zoals Firefox vóór 101, krijgt in plaats daarvan `<style>`-elementen, die voor beide elementen `style-src 'unsafe-inline'` nodig hebben.
- `<erd-viewer>` haalt zijn `src` op, dus die origin hoort in `connect-src` — zie [Wat het aan een pagina toevoegt](./erd-viewer-element.md#what-it-adds-to-a-page).

## Ingangspunten {#entry-points}

Het pakket heeft vijf ingangspunten:

| Ingangspunt | Wat het is |
| --- | --- |
| `@dineug/erd-editor` | De root: de exports hieronder. Sinds `5.0.0` definieert hij geen element, al heeft hij nog een DOM nodig om te laden |
| `@dineug/erd-editor/erd-editor.js` | Sinds `5.0.0`. Definieert `<erd-editor>` en exporteert niets |
| `@dineug/erd-editor/erd-viewer.js` | Sinds `5.0.0`. Definieert `<erd-viewer>` en exporteert niets |
| `@dineug/erd-editor/engine.js` | De documentstore zonder DOM |
| `@dineug/erd-editor/peer.js` | Sinds `3.9.1`. De headless peer van de MCP-server |

De root exporteert beide elementklassen en hun define-functies, twee setters voor callbacks, sinds `3.9.2` de standaardtoetscombinaties met hun typen, sinds `4.0.0` de typen voor de weergavetalen en het type voor de opties van `getSchemaSQL()`, sinds `4.2.0` de toetscombinaties voor de rijen van het tabblad Woordenboek, en sinds `5.0.0` `toImage`.

| Export | Beschrijving |
| --- | --- |
| `ErdEditorElement` | De interface van het element — zie [ErdEditorElement](./erd-editor-element.md). Sinds `5.0.0` ook zijn klasse, die waarmee `<erd-editor>` wordt gedefinieerd — zie [De elementen registreren](#registering-the-elements). |
| `ErdViewerElement` | Sinds `5.0.0`. De interface en klasse van de viewer — zie [ErdViewerElement](./erd-viewer-element.md). |
| `defineErdEditor()`, `defineErdViewer()` | Sinds `5.0.0`. Definiëren `<erd-editor>` of `<erd-viewer>` als zijn klasse. Een aanroep doet niets zolang de tag die klasse bevat, en gooit een `Error` wanneer een andere klasse hem bevat — zie [De elementen registreren](#registering-the-elements). |
| `toImage(value, options)` | Sinds `5.0.0`. Tekent een document als PNG-`Blob` of SVG-string, met de opties van het dialoogvenster `Export image` — zie [toImage](./to-image.md). |
| `ToImageOptions` (type) | Sinds `5.0.0`. De opties die `toImage()` accepteert: `format`, `background`, `darkMode` en `scale`. |
| `setExportFileCallback(cb)` | Vervangt de browserdownload, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Vervangt de bestandskiezer van de browser, `({ type, op, accept, mode }) => void`; `mode` sinds `4.0.0`. Sinds `4.2.0` opent `Import CSV` op het tabblad Woordenboek de bestandskiezer van de browser, ook als er een callback is ingesteld — zie [Bestandsdialoogvensters](#file-dialogs). |
| `createKeyBindingMap()` | Geeft bij elke aanroep de standaardtoetscombinaties terug als een nieuwe `KeyBindingMap` — zie [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (typen) | Een map met toewijzingen, de union van de opdrachtnamen ervan en één toewijzing. |
| `dictionaryRowChords(map)` | Sinds `4.2.0`. Geeft bij elke aanroep als een nieuwe `ShortcutOption[]` de toetscombinaties terug waarmee het raster van het tabblad [Woordenboek](../guide/guides/dictionary.md#adding-and-deleting-rows) rijen invoegt en verwijdert op basis van de `KeyBindingMap` die je doorgeeft. De toetscombinatie die rijen erboven invoegt, met de standaardwaarden `Alt+Shift+Enter`, zit in geen enkele toewijzing — zie [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (typen) | Sinds `4.0.0`. De 25 codes van de weergavetalen en die codes plus `'system'`, wat `setLocale()` accepteert — zie [Weergavetaal](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (type) | Sinds `4.0.0`. De opties die `getSchemaSQL()` accepteert: `statements`, `header` en, sinds `4.2.0`, `logicalNameAsComment` — zie [getSchemaSQL](./erd-editor-element.md#getschemasql). |

Sinds `5.0.0` bevat `dist` één niet-geminificeerd bestand per module, elk met zijn declaratie ernaast, en noemt de `sideEffects` van `package.json` alleen de twee tag-ingangspunten en twee stubs die de workerbestanden nodig hebben. Een bundler laat dus elke module weg die een pagina niet bereikt en minificeert één keer:

- Een named import uit de root, zoals `setExportFileCallback`, bundelt geen van beide elementen en geen worker.
- `toImage` brengt de worker voor de afbeeldingsexport mee en geen element.
- `erd-editor.js` brengt de editor en alle drie de shared workers mee.
- `erd-viewer.js` brengt de viewer mee en geen worker, met Engels erin en elke andere weergavetaal in een eigen chunk, die wordt geladen zodra een pagina erom vraagt.

`@dineug/erd-editor/engine.js` draait de documentstore zonder DOM, dus het werkt in een Web Worker — zie [Externe opslag](./advanced/remote-storage.md).
Het exporteert `createReplicationStore` en het type `ReplicationStore`. Sinds `3.10.0` exporteert het ook het type `ReplicationChange`, `{ value: string; changed: boolean }`, dat de listener voor `change` van een replica ontvangt — zie [on@change](./advanced/remote-storage.md#onchange).
Sinds `4.0.0` heeft een `ReplicationStore` ook een `runtimeValue`. Zijn `value` en de waarde die een `change` doorgeeft, zijn de opslagvorm die een bestand bevat, net als bij het element — zie [ReplicationStore](./advanced/remote-storage.md#replicationstore).

`@dineug/erd-editor/peer.js` is de headless peer waarmee de [MCP-server](../mcp/introduction.md) een document bewerkt. Dit ingangspunt bestaat voor die server en deze pagina's documenteren het niet.

### Bestandsdialoogvensters {#file-dialogs}

Importeren en exporteren lopen via injecteerbare callbacks, zodat een host zonder bestandsdialoogvenster van de browser — bijvoorbeeld een webview in een IDE — een eigen dialoogvenster kan leveren.
De twee zijn niet symmetrisch: de export geeft je het voltooide bestand, terwijl de import er alleen om vraagt, en je zet de inhoud zelf terug in de editor.
Sinds `4.2.0` is `Import CSV` op het tabblad Woordenboek de enige import die nooit de importcallback aanroept, want het `type` van die callback heeft geen waarde voor CSV. Deze import opent altijd de eigen bestandskiezer van de browser, voor `.csv`-bestanden — zie [CSV importeren en exporteren](../guide/guides/dictionary.md#importing-and-exporting-csv).

`op` is `set` of `diff` — een `diff` gaat naar `setDiffValue()`, ongeacht het `type`. Anders kiest `type` de methode, en `accept` bevat de extensies van dat type, klaar om door te geven aan een bestandsdialoogvenster van de host.
Sinds `4.0.0` krijgt een `set` de waarde `mode: 'append'` mee wanneer de gebruiker [Importeren en toevoegen](../guide/guides/file-import-export.md#import-and-add) heeft gekozen, en geen `mode` bij een gewone import. Geef het door: een callback die het weglaat, vervangt het diagram waaraan de gebruiker wilde toevoegen.

| `type` | `accept` | Methode |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'` deelt de tabellen in op basis van hun relaties voordat ze worden neergezet, zoals de editor zelf bij een import doet, en laat de aanroep een Promise teruggeven. Zonder deze optie komen ze meteen in rijen terecht — zie [setSchemaSQL](./erd-editor-element.md#setschemasql) en [setSchemaJSON](./erd-editor-element.md#setschemajson).

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept, mode }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.setSchemaJSON(text, { mode });
  } else if (type === 'sql') {
    editor.setSchemaSQL(text, { placement: 'auto', mode });
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text, { placement: 'auto', mode });
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text, { placement: 'auto', mode });
  } else if (type === 'aml') {
    editor.setSchemaAML(text, { placement: 'auto', mode });
  }
});
```

Vertak op elk `type` dat je afhandelt en negeer de rest.
Een vervangende `setSchemaJSON()` maakt, net als een toewijzing aan `value`, het document leeg voordat er wordt geparseerd, dus als je daar een payload naartoe stuurt die geen `.erd.json`-document is — via een allesvangende `else` of omdat een later toegevoegd `type` daar terechtkwam — wordt het diagram leeggemaakt in plaats van dat er iets wordt geïmporteerd.

De `fileName` die de editor genereert, is `<database name>-<timestamp>` plus de extensie van het bestand, waarbij de tijdstempel de lokale tijd is in de notatie `yyyy-MM-dd'T'HH_mm_ss`. Een lege databasenaam valt terug op `unnamed`. De naam van een CSV-bestand van het Woordenboek bevat vóór de extensie de naam van het blad, zoals in `<database name>-<timestamp>-words.csv`.
De exportcallback ontvangt deze bestanden. Sinds `4.0.0` horen de SVG en de bestanden van de Codegenerator erbij, en komt de `.sql` uit `Save file` op het tabblad Schema SQL in plaats van rechtstreeks uit `Export`. Sinds `4.2.0` hoort ook de CSV van het tabblad Woordenboek erbij. [toImage()](./to-image.md) roept geen van beide callbacks aan: het geeft zijn afbeelding aan jou terug.

| Bestand | Extensie | `type` van de blob |
| --- | --- | --- |
| De JSON-export | `.erd.json` | `application/json` |
| `Save file` op het tabblad Schema SQL, met de tekst die het tabblad toont — zie [Schema SQL](../guide/guides/schema-sql.md) | `.sql` | geen |
| Het dialoogvenster [Export image](../guide/guides/file-import-export.md#image) | `.png` of `.svg` | `image/png` of `image/svg+xml` |
| `Save file` op het tabblad Codegenerator — zie [Codegenerator](../guide/guides/code-generator.md) | Die van de taal: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` of `.mmd` | geen |
| `Export CSV` op het tabblad Woordenboek, met elke rij van het getoonde blad, ongeacht wat de zoekopdracht ervan toont — zie [CSV importeren en exporteren](../guide/guides/dictionary.md#importing-and-exporting-csv) | `.csv` | `text/csv` |

Een host die een handler op basis van de extensie kiest, heeft voor elk van deze bestanden een handler nodig.

Zolang de callbacks niet zijn ingesteld, gebruikt de editor het eigen gedrag van de browser voor downloaden en bestanden kiezen. Geef `null` door om daarnaar terug te keren.

## Browserondersteuning {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ — de ES2022-basislijn waarvoor de gepubliceerde bundels zijn gebouwd.
Er worden geen polyfills meegebundeld. Voeg je eigen polyfills toe als je oudere browsers moet bereiken.

## Upgraden vanaf 4.x {#upgrading-from-4x}

`5.0.0` is een nieuwe hoofdversie. Controleer elk van deze punten wanneer je een pagina van 4.x overzet:

- `import '@dineug/erd-editor'` definieert `<erd-editor>` niet meer. Importeer in plaats daarvan `@dineug/erd-editor/erd-editor.js` voor het effect, of roep `defineErdEditor()` aan, en laat je named imports uit de root zoals ze zijn. TypeScript markeert een pagina die bij de kale import is gebleven niet, omdat de declaraties van de root de tag nog steeds in `HTMLElementTagNameMap` noemen, maar het element dat hij maakt is een gewoon `HTMLElement`, dus zijn eerste methodeaanroep gooit een `TypeError` — zie [De elementen registreren](#registering-the-elements).

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- Op een CDN geldt hetzelfde voor `https://esm.run/@dineug/erd-editor`, dat nu de root levert en niets definieert: importeer `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`. De kale jsDelivr- en unpkg-URL's leveren nog steeds de scripttag-build, die `<erd-editor>` definieert zoals voorheen. Een URL zonder versie levert nu de nieuwste 5.x-versie; zet `@4.2.0` vast om op 4.x te blijven — zie [CDN](#cdn) en [Scripttag](#script-tag).
- De root definieert niets maar heeft nog steeds een DOM nodig, dus bij server-side rendering blijft een named import eruit, zoals `setExportFileCallback`, op het pad dat alleen op de client draait, naast het ingangspunt van het element — zie [Server-side rendering](#server-side-rendering).
- `window.ErdEditor` krijgt `ErdEditorElement` en `defineErdEditor`. De scripttag-build van de viewer zet `ErdViewerElement` en `defineErdViewer` op `window.ErdViewer`, en geen van beide globals bevat `toImage`.
- Een `readonly` editor opent als lezer. Zijn zes tabbladen, de Verkenner, Snel zoeken en aanwezigheid blijven, en elk bedieningselement dat het diagram zou bewerken is weg in plaats van uitgeschakeld: de werkbalk toont de naam van het databasesysteem als tekst, het tabblad Instellingen toont zijn instellingen met elk bedieningselement uitgeschakeld onder een badge `Read only`, en de zwevende werkbalk behoudt alleen de zoom, de naamweergave, de zen-modus en het kompas, dus `Hand` en `Select` zijn weg en een sleepbeweging pant. Een druk selecteert niets: de enige selectie is de omlijning die een sprong vanuit de Verkenner of Snel zoeken rond wat hij bereikt zet, en die een stille klik wist, en de sneltoetsen voor alles selecteren selecteren niets. Het inschakelen van `readonly` beëindigt wat openstond, zoals de selectie, het handgereedschap, een celeditor, een sleepbeweging, Map Columns, het voorbeeld `Force` van Automatische indeling en Tijdreizen, en behoudt het scrollen, het zoomniveau, het tabblad en de naamweergave — zie [readonly](./erd-editor-element.md#readonly).
- De instellingen die een `readonly` lezer wijzigt, blijven op het scherm van die editor wat hun vergrendelingen ook aangeven: het scrollen en zoomen, het tabblad, de naamweergave, View Option, het databasesysteem, en de taal, naamnotaties en het type aanhalingstekens van de Codegenerator. `value`, `runtimeValue` en de JSON-export behouden die van het document zelf, die de wijzigingen van een lezer in 4.x konden bereiken, en `getSharedStore()` stuurt er geen enkele naar de andere editors. `getSchemaSQL()` zonder databasesysteem schrijft voor het databasesysteem dat de lezer koos. Het uitschakelen van `readonly` zet het databasesysteem, de code-instellingen en View Option terug op die van het document, en laat het scrollen, zoomen, het tabblad en de naamweergave waar de lezer ze achterliet.
- De rij `Recalculation table width` van het tabblad Instellingen is weg. Laden en plakken passen de breedte van elke tabel nog steeds aan zijn tekst aan.
- Haal op Vite 8 een `exclude: ['@dineug/erd-editor']` uit `optimizeDeps`, die alleen Vite 7 en ouder nog nodig hebben, en houd de ELK-`include` — zie [Vite](#vite).

## Upgraden vanaf 3.x {#upgrading-from-3x}

`4.0.0` is een nieuwe hoofdversie. Controleer elk van deze punten wanneer je een pagina van 3.x overzet, en daarna die van [Upgraden vanaf 4.x](#upgrading-from-4x) voor `5.0.0`:

- `editor.value`, de `value` van een replica en de `value` die zijn `change` doorgeeft, zijn de opslagvorm die een bestand bevat: geen verwijderde entiteiten, gemeten breedtes, stapelvolgorde of ankerpunten van relaties. Blijf `value` opslaan en lees die gegevens uit `runtimeValue`; tijdstempels van entiteiten (`meta`) zijn helemaal verdwenen. Initialiseer een medebewerker of een replica die zich bij een lopende sessie aansluit, vanuit de `runtimeValue` van een actieve peer, niet vanuit `value` of het bestand, en sla `runtimeValue` nooit op — zie [value](./erd-editor-element.md#value) en [runtimeValue](./erd-editor-element.md#runtimevalue).
- Instellingsvergrendelingen vervangen `Save Scroll Information` en `Save Zoom Information`. In een nieuw document, en in elk document dat vóór `4.0.0` is opgeslagen, staat elke vergrendeling aan, dus scrollen, zoomen, van tabblad wisselen of een wijziging van de taal van de Codegenerator, een naamnotatie of het type aanhalingstekens laat `value` zoals het was, en er treedt geen `change` op. Een pagina die de weergave via `change` bewaarde, moet `Viewport` (en `Canvas Type` voor het tabblad) ontgrendelen op het tabblad Instellingen, of een document gebruiken waarvan `settings.lockSettings` die bits niet zet — zie [Vergrendeling](../guide/guides/settings.md#lock).
- `settings` heeft geen `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` of `ignoreSaveSettings` meer, en de constanten `SaveSettingType` zijn verdwenen. `settings.lockSettings`, met de bits van `LockSettingType`, neemt de plaats in van `ignoreSaveSettings`, dat `4.0.0` of later leest noch schrijft — zie [Settings](./advanced/schema.md#settings).
- Het [JSON Schema](./advanced/schema.md#json-schema) dat elk bestand in `$schema` noemt, beschrijft nu alleen de opslagvorm en is gesloten: het weigert een bestand dat een eerdere versie heeft opgeslagen, totdat het bij opslaan door `4.0.0` of later wordt herschreven.
- De garbage collection van het document is samen met zijn worker verdwenen, dus een verwijderde entiteit blijft in `runtimeValue` totdat het document de volgende keer vanuit zijn bestand wordt geopend. Er blijven drie shared workers over — zie [Web Workers](#web-workers).
- Houd elke editor en replica in een gedeelde sessie op `4.0.0` of later. Een eerdere versie negeert de nieuwe actietypen: die van tabelgroepen, de functie Kolommen toewijzen, de vergrendelingen en de Schema SQL-scripts — zie [Versies combineren](./advanced/collaborative-editing.md#mixing-releases).
- De importcallback krijgt `mode: 'append'` bij importeren en toevoegen, en een callback moet dat doorgeven. De exportcallback krijgt nu ook `.svg`-bestanden en bestanden van de Codegenerator, en `Export` ▸ `Schema SQL` opent het tabblad Schema SQL in plaats van op te slaan, dus de `.sql` komt alleen nog uit `Save file` op dat tabblad — zie [Bestandsdialoogvensters](#file-dialogs).
- `Delete` en `Backspace` zijn gekoppeld aan de nieuwe `removeSelection`. Zolang de editor de focus heeft buiten een tekstveld, wordt de standaardactie van de toets op elk tabblad geblokkeerd, en op het ERD-tabblad wordt de selectie verwijderd. `KeyBindingName` en `KeyBindingMap` krijgen die erbij, en `setKeyBindingMap({ removeSelection: [] })` laat beide toetsen aan de pagina over — zie [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- `ThemeOptions.appearance` accepteert ook `'system'`, `System` in de themabouwer, dat wordt ingesteld als je `systemDarkMode` inschakelt. `changePresetTheme` meldt `'system'` zolang die waarde is gekozen, dus sla de waarde ongewijzigd op en geef ze terug aan `setPresetTheme`. Als `systemDarkMode` aanstaat, blijft een `setPresetTheme()` met `'light'` of `'dark'` nu staan in plaats van bij de volgende wijziging in het besturingssysteem te worden overschreven — zie [systemDarkMode](./erd-editor-element.md#systemdarkmode) en [changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` `1.0.0` of later, de VS Code-extensie `4.0.0` of later en de Obsidian- en JetBrains-plug-ins `1.0.0` of later spreken hubprotocol 2. Server `1.0.0` of later en een eerdere editorversie die agents bedient, of een eerdere server en een van deze editors, weigeren elkaar met `protocolMismatch`, waarbij de kant wordt genoemd die moet worden bijgewerkt — zie [Bijwerken](../mcp/installation.md#updating).
- Een CDN-URL zonder versie levert de nieuwste versie, sinds `5.0.0` 5.x. Zet `@3.10.0` vast om op 3.x te blijven — zie [CDN](#cdn).
