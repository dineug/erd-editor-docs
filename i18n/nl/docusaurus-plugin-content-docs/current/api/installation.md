---
sidebar_position: 1
description: Installeer @dineug/erd-editor via npm of een CDN, plaats het custom element, sluit de bestandsdialoogvensters aan en upgrade vanaf 3.x.
---

# Installeren

```sh
npm install @dineug/erd-editor
```

Het pakket is uitsluitend ESM (`"type": "module"`) en bevat alleen de map `dist`.
Er is geen CommonJS-build, dus `require('@dineug/erd-editor')` werkt niet.

De runtime-afhankelijkheden blijven extern, als bare imports die je bundler oplost, ontdubbelt en via tree-shaking inkort.
De shared workers worden als aparte ingangsbestanden onder `dist/workers/` gegenereerd en aangemaakt met `new URL('./…', import.meta.url)`, de schrijfwijze die Vite, webpack 5 en Rspack als worker-ingangspunt bundelen. Zie [Web Workers](#web-workers).
Voor een pagina zonder bundler erachter is er een tweede, zelfstandige build — zie [Scripttag](#script-tag).

## Gebruik {#usage}

```js
import '@dineug/erd-editor';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`<erd-editor>` heeft geen eigen afmetingen. Geef het element (of zijn container) een expliciete breedte en hoogte.
Sinds `4.1.0` is een geopende [Verkenner](../guide/guides/explorer.md) binnen het element vastgezet, links van het ERD-canvas, en maakt hij het canvas smaller in plaats van het te bedekken. Een nieuwe editor start met de Verkenner gesloten.
Het paneel wordt nooit smaller dan `200px` getekend en laat voor het canvas minstens `320px` over, dus in een element dat smaller is dan `520px` wordt een geopende Verkenner pas getekend als het element breder wordt — zie [Naast het canvas](../guide/guides/explorer.md#beside-the-canvas).

`setInitialValue('')` start een nieuw, leeg document. Als je `value` toewijst, wordt een document in plaats daarvan als bewerking geladen, zodat het in de geschiedenis terechtkomt.
Sinds `4.0.0` is `editor.value` het document in de vorm die een bestand bevat, en dat is wat je opslaat. `editor.runtimeValue` is het document zoals de editor het bijhoudt, verwijderde entiteiten inbegrepen: het dient om een medebewerker te initialiseren en gaat nooit naar een bestand — zie [runtimeValue](./erd-editor-element.md#runtimevalue).
Sinds `4.0.0` staat in een nieuw document ook elke [instellingsvergrendeling](../guide/guides/settings.md#lock) aan: het weergavegebied, het tabblad, de taal van de Codegenerator, beide naamnotaties en het type aanhalingstekens. Scrollen, zoomen, van tabblad wisselen of een van die instellingen wijzigen laat `editor.value` zoals het was, en er treedt geen `change` op. Een document dat uit tekst is geladen, behoudt de vergrendelingen die het noemt. Een document dat er geen noemt, zoals elk bestand dat vóór `4.0.0` is opgeslagen, opent met elke vergrendeling aan, op een zoomniveau van 100% en op het ERD-tabblad, ongeacht de weergave en het tabblad die het heeft opgeslagen. De weergave wordt vergrendeld op de oorsprong `0, 0` en opent in plaats daarvan op het diagram als daar niets van het diagram wordt getekend — zie [setInitialValue](./erd-editor-element.md#setinitialvalue).
Zie [ErdEditorElement](./erd-editor-element.md) voor de rest van de API.

### CDN {#cdn}

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor"></script>
```

`esm.run` lost de externe afhankelijkheden van het pakket voor je op, dus dit werkt zonder bundler.
De URL zonder versienummer levert altijd de nieuwste versie. Zet een versie vast — `https://esm.run/@dineug/erd-editor@4.1.0` — als je niet wilt dat een upgrade naar een nieuwe hoofdversie onaangekondigd je pagina bereikt.
`4.0.0` is zelf zo'n upgrade: een pagina die op 3.x moet blijven, zet `@3.10.0` vast — zie [Upgraden vanaf 3.x](#upgrading-from-3x).

### Scripttag {#script-tag}

Sinds `3.6.0` levert het pakket ook een UMD-build met elke afhankelijkheid en elke shared worker in één bestand.
Daar verwijzen de velden `unpkg` en `jsdelivr` naar, dus de kale pakket-URL levert deze build op elk van beide CDN's, en hij definieert `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.1.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Het importeren ervan registreert `<erd-editor>` op dezelfde manier; `window.ErdEditor` bevat de twee bestandscallbacks, `ErdEditor.setExportFileCallback` en `ErdEditor.setImportFileCallback`, en, sinds `3.9.2`, `ErdEditor.createKeyBindingMap`.
De exports-map wijst een bundler nog steeds naar de ES-modules, dus een installatie via npm pikt dit bestand nooit op.

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

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
Alle 25 weergavetalen zitten in het pakket, zowel in de ES-build als in de scripttag-build, dus er is geen taalbestand om te leveren en niets om te registreren. Zonder de kiezer en zonder een aanroep van `setLocale()` verschijnt de editor in het Engels.

Voeg je hier `readonly` toe, dan is bewerken geblokkeerd: een toewijzing aan `value`, een aanroep van `clear()` en elke aanroep van `setSchema*()` — `setSchemaJSON()` en een toevoeging inbegrepen — worden genegeerd, en het event `change` treedt nooit op. Het lezen van `editor.value` en `editor.runtimeValue` werkt nog wel. Laad in plaats daarvan met `setInitialValue()`.

### Server-side rendering {#server-side-rendering}

Het importeren van het pakket registreert het custom element op moduleniveau, dus het heeft een DOM nodig en gooit in Node een fout.
Benader het in Next.js, Nuxt, SvelteKit of Astro via een pad dat alleen op de client wordt uitgevoerd.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

Het importeren van het pakket voegt `erd-editor` toe aan `HTMLElementTagNameMap`, dus het element krijgt zijn type zonder cast.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` wordt geëxporteerd om je eigen variabelen en props te annoteren.
Sinds `4.0.0` exporteert het pakket ook de typen `LocaleCode`, `LocaleOption` en `SchemaSQLOptions` — zie [Ingangspunten](#entry-points). De opties die de methoden `setSchema*()` accepteren, hebben geen geëxporteerde naam; lees ze af van het element, als `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## Syntaxismarkering {#syntax-highlighting}

De panelen Schema SQL en Codegenerator krijgen hun syntaxismarkering van [Shiki](https://shiki.style), in een eigen shared worker, en sinds `4.0.0` geldt dat ook voor de scripts `Before tables` en `After tables` op het tabblad Schema SQL.
Sinds `3.7.0` is er niets te installeren en niets te registreren: de worker wordt aangemaakt de eerste keer dat een codepaneel wordt weergegeven, dus een pagina die er geen opent, haalt de grammatica's nooit op.

| | |
| --- | --- |
| Talen | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Thema's | `github-dark` en `github-light`, volgens het lichte of donkere uiterlijk van de editor |

Dat zijn precies de talen die de panelen genereren: `JPA` wordt gemarkeerd als Java, `SQLAlchemy` als Python, `TypeORM`, `Sequelize`, `Drizzle` en `Zod` als TypeScript, `Doctrine` als PHP, `SeaORM` als Rust, `JSON Schema` als JSON en `DBML` en `AML` als SQL, de dichtstbijzijnde grammatica in de bundel — zie [Codegenerator](../guide/guides/code-generator.md).

De regex-engine is puur JavaScript, dus geen enkel beleid van de host heeft `wasm-unsafe-eval` nodig.
Waar `SharedWorker` ontbreekt — Chrome op Android, Safari vóór 16.4 — wordt de fout gelogd en verschijnt de code als platte tekst; de scripts zijn nog steeds te bewerken.

Upgraden vanaf `3.6.0` of eerder: `@dineug/erd-editor-shiki-worker` wordt niet meer gepubliceerd, en `setGetShikiServiceCallback` is daarmee ook verdwenen.
Verwijder de installatie en de registratie; een pagina die de worker van een CDN laadde, verwijdert ook die tweede `<script>`-tag.

## Web Workers {#web-workers}

De editor voert drie taken uit in `SharedWorker`s: syntaxismarkering, het exporteren van afbeeldingen en de tabelindeling achter [Automatische indeling](../guide/guides/table-related-functions.md#auto-layout), de [stroommodus](../guide/guides/visualization.md#how-flow-is-placed) van het tabblad Visualisatie en, sinds `4.0.0`, de plaatsing van een geïmporteerd schema.
Alle drie zitten in `@dineug/erd-editor`. Geen ervan hoef je zelf in te stellen, maar elk ervan kan door een host worden geblokkeerd.
De worker die de garbage collection van het document uitvoerde, is in `4.0.0` verwijderd, samen met de garbage collection zelf.

| Worker | Zonder de worker |
| --- | --- |
| Syntaxismarkering | De panelen Schema SQL en Codegenerator en de Schema SQL-scripts blijven platte tekst |
| Afbeeldingsexport | De PNG, de SVG, `Copy to clipboard` en het voorbeeld in het dialoogvenster `Export image` worden op de hoofdthread getekend, wat de pagina blokkeert zolang het tekenen duurt |
| Tabelindeling | De indelingen `Flow`, `Tree - vertical` en `Tree - horizontal` van Automatische indeling en de stroommodus van het tabblad Visualisatie eindigen in `Could not place tables`; een import die door Flow wordt geplaatst — een SQL-, GraphQL-, DBML- of AML-bestand via `Import` of `Import and Add`, of een aanroep van `setSchema*()` met `placement: 'auto'` — zet zijn tabellen zonder melding in rijen neer; `Force` en de graafmodus worden niet beïnvloed, omdat ze binnen de editor draaien |

De afbeeldingsexport wacht tien seconden op een antwoord van zijn worker en tekent daarna op de hoofdthread, en de syntaxismarkering laat de code als platte tekst staan zodra zijn worker faalt, dus een host die workers blokkeert, kost prestaties in plaats van functionaliteit.
De tabelindeling is de uitzondering: de engine die een indeling berekent, is groter dan de editor zelf en wordt nooit in hetzelfde proces geladen, dus bij de eerste plaatsing wacht de tabelindeling dertig seconden op zijn worker, en zodra de worker heeft geantwoord, krijgt een indeling zestig seconden om terug te komen.
Als een van beide wachttijden verstrijkt, eindigt de plaatsing zoals zonder de worker. Automatische indeling toont `Placing tables` zodra die start, terwijl de stroommodus en een import die door Flow wordt geplaatst, dit pas tonen wanneer een plaatsing, inclusief het starten van zijn worker, al zes seconden loopt.

In de gebundelde build worden alle drie als bestanden naast het pakket gegenereerd, dus een strikte CSP heeft `worker-src 'self'` nodig — plus `blob:` als je bundler een worker inline opneemt.
In de [scripttag-build](#script-tag) zitten alle drie als `data:`-URL's in het bestand, dus die pagina heeft in plaats daarvan `worker-src data:` nodig.

## Ingangspunten {#entry-points}

Het importeren van `@dineug/erd-editor` registreert `<erd-editor>` als neveneffect. Daarnaast exporteert het pakket het elementtype, twee setters voor callbacks, sinds `3.9.2` de standaardtoetscombinaties met hun typen en sinds `4.0.0` de typen voor de weergavetalen en het type voor de opties van `getSchemaSQL()`.

| Export | Beschrijving |
| --- | --- |
| `ErdEditorElement` (type) | De interface van het element — zie [ErdEditorElement](./erd-editor-element.md). |
| `setExportFileCallback(cb)` | Vervangt de browserdownload, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Vervangt de bestandskiezer van de browser, `({ type, op, accept, mode }) => void`; `mode` sinds `4.0.0`. |
| `createKeyBindingMap()` | Geeft bij elke aanroep de standaardtoetscombinaties terug als een nieuwe `KeyBindingMap` — zie [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (typen) | Een map met toewijzingen, de union van de opdrachtnamen ervan en één toewijzing. |
| `LocaleCode`, `LocaleOption` (typen) | Sinds `4.0.0`. De 25 codes van de weergavetalen en die codes plus `'system'`, wat `setLocale()` accepteert — zie [Weergavetaal](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (type) | Sinds `4.0.0`. De opties `statements` en `header` die `getSchemaSQL()` accepteert — zie [getSchemaSQL](./erd-editor-element.md#getschemasql). |

`@dineug/erd-editor/engine.js` is een tweede ingangspunt. Het draait de documentstore zonder DOM, dus het werkt in een Web Worker — zie [Externe opslag](./advanced/remote-storage.md).
Het exporteert `createReplicationStore` en het type `ReplicationStore`. Sinds `3.10.0` exporteert het ook het type `ReplicationChange`, `{ value: string; changed: boolean }`, dat de listener voor `change` van een replica ontvangt — zie [on@change](./advanced/remote-storage.md#onchange).
Sinds `4.0.0` heeft een `ReplicationStore` ook een `runtimeValue`. Zijn `value` en de waarde die een `change` doorgeeft, zijn de opslagvorm die een bestand bevat, net als bij het element — zie [ReplicationStore](./advanced/remote-storage.md#replicationstore).

Sinds `3.9.1` is er een derde, `@dineug/erd-editor/peer.js`: de headless peer waarmee de [MCP-server](../mcp/introduction.md) een document bewerkt. Dit ingangspunt bestaat voor die server en deze pagina's documenteren het niet.

### Bestandsdialoogvensters {#file-dialogs}

Importeren en exporteren lopen via injecteerbare callbacks, zodat een host zonder bestandsdialoogvenster van de browser — bijvoorbeeld een webview in een IDE — een eigen dialoogvenster kan leveren.
De twee zijn niet symmetrisch: de export geeft je het voltooide bestand, terwijl de import er alleen om vraagt, en je zet de inhoud zelf terug in de editor.

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

De `fileName` die de editor genereert, is `<database name>-<timestamp>` plus de extensie van het bestand, waarbij de tijdstempel de lokale tijd is in de notatie `yyyy-MM-dd'T'HH_mm_ss`. Een lege databasenaam valt terug op `unnamed`.
De exportcallback ontvangt deze bestanden. Sinds `4.0.0` horen de SVG en de bestanden van de Codegenerator erbij, en komt de `.sql` uit `Save file` op het tabblad Schema SQL in plaats van rechtstreeks uit `Export`.

| Bestand | Extensie | `type` van de blob |
| --- | --- | --- |
| De JSON-export | `.erd.json` | `application/json` |
| `Save file` op het tabblad Schema SQL, met de tekst die het tabblad toont — zie [Schema SQL](../guide/guides/schema-sql.md) | `.sql` | geen |
| Het dialoogvenster [Export image](../guide/guides/file-import-export.md#image) | `.png` of `.svg` | `image/png` of `image/svg+xml` |
| `Save file` op het tabblad Codegenerator — zie [Codegenerator](../guide/guides/code-generator.md) | Die van de taal: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` of `.mmd` | geen |

Een host die een handler op basis van de extensie kiest, heeft voor elk van deze bestanden een handler nodig.

Zolang de callbacks niet zijn ingesteld, gebruikt de editor het eigen gedrag van de browser voor downloaden en bestanden kiezen. Geef `null` door om daarnaar terug te keren.

## Browserondersteuning {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ — de ES2022-basislijn waarvoor de gepubliceerde bundels zijn gebouwd.
Er worden geen polyfills meegebundeld. Voeg je eigen polyfills toe als je oudere browsers moet bereiken.

## Upgraden vanaf 3.x {#upgrading-from-3x}

`4.0.0` is een nieuwe hoofdversie. Controleer elk van deze punten wanneer je een pagina van 3.x overzet:

- `editor.value`, de `value` van een replica en de `value` die zijn `change` doorgeeft, zijn de opslagvorm die een bestand bevat: geen verwijderde entiteiten, gemeten breedtes, stapelvolgorde of ankerpunten van relaties. Blijf `value` opslaan en lees die gegevens uit `runtimeValue`; tijdstempels van entiteiten (`meta`) zijn helemaal verdwenen. Initialiseer een medebewerker of een replica die zich bij een lopende sessie aansluit, vanuit de `runtimeValue` van een actieve peer, niet vanuit `value` of het bestand, en sla `runtimeValue` nooit op — zie [value](./erd-editor-element.md#value) en [runtimeValue](./erd-editor-element.md#runtimevalue).
- Instellingsvergrendelingen vervangen `Save Scroll Information` en `Save Zoom Information`. In een nieuw document, en in elk document dat vóór `4.0.0` is opgeslagen, staat elke vergrendeling aan, dus scrollen, zoomen, van tabblad wisselen of een wijziging van de taal van de Codegenerator, een naamnotatie of het type aanhalingstekens laat `value` zoals het was, en er treedt geen `change` op. Een pagina die de weergave via `change` bewaarde, moet `Viewport` (en `Canvas Type` voor het tabblad) ontgrendelen op het tabblad Instellingen, of een document gebruiken waarvan `settings.lockSettings` die bits niet zet — zie [Vergrendeling](../guide/guides/settings.md#lock).
- `settings` heeft geen `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` of `ignoreSaveSettings` meer, en de constanten `SaveSettingType` zijn verdwenen. `settings.lockSettings`, met de bits van `LockSettingType`, neemt de plaats in van `ignoreSaveSettings`, dat `4.0.0` of later leest noch schrijft — zie [Settings](./advanced/schema.md#settings).
- Het [JSON Schema](./advanced/schema.md#json-schema) dat elk bestand in `$schema` noemt, beschrijft nu alleen de opslagvorm en is gesloten: het weigert een bestand dat een eerdere versie heeft opgeslagen, totdat het bij opslaan door `4.0.0` of later wordt herschreven.
- De garbage collection van het document is samen met zijn worker verdwenen, dus een verwijderde entiteit blijft in `runtimeValue` totdat het document de volgende keer vanuit zijn bestand wordt geopend. Er blijven drie shared workers over — zie [Web Workers](#web-workers).
- Houd elke editor en replica in een gedeelde sessie op `4.0.0` of later. Een eerdere versie negeert de nieuwe actietypen: die van tabelgroepen, de functie Kolommen toewijzen, de vergrendelingen en de Schema SQL-scripts — zie [Versies combineren](./advanced/collaborative-editing.md#mixing-releases).
- De importcallback krijgt `mode: 'append'` bij importeren en toevoegen, en een callback moet dat doorgeven. De exportcallback krijgt nu ook `.svg`-bestanden en bestanden van de Codegenerator, en `Export` ▸ `Schema SQL` opent het tabblad Schema SQL in plaats van op te slaan, dus de `.sql` komt alleen nog uit `Save file` op dat tabblad — zie [Bestandsdialoogvensters](#file-dialogs).
- `Delete` en `Backspace` zijn gekoppeld aan de nieuwe `removeSelection`. Zolang de editor de focus heeft buiten een tekstveld, wordt de standaardactie van de toets op elk tabblad geblokkeerd, en op het ERD-tabblad wordt de selectie verwijderd. `KeyBindingName` en `KeyBindingMap` krijgen die erbij, en `setKeyBindingMap({ removeSelection: [] })` laat beide toetsen aan de pagina over — zie [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- `ThemeOptions.appearance` accepteert ook `'system'`, `System` in de themabouwer, dat wordt ingesteld als je `systemDarkMode` inschakelt. `changePresetTheme` meldt `'system'` zolang die waarde is gekozen, dus sla de waarde ongewijzigd op en geef ze terug aan `setPresetTheme`. Als `systemDarkMode` aanstaat, blijft een `setPresetTheme()` met `'light'` of `'dark'` nu staan in plaats van bij de volgende wijziging in het besturingssysteem te worden overschreven — zie [systemDarkMode](./erd-editor-element.md#systemdarkmode) en [changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` `1.0.0`, de VS Code-extensie `4.0.0` of later en de Obsidian- en JetBrains-plug-ins `1.0.0` of later spreken hubprotocol 2. Server `1.0.0` en een eerdere editorversie die agents bedient, of een eerdere server en een van deze editors, weigeren elkaar met `protocolMismatch`, waarbij de kant wordt genoemd die moet worden bijgewerkt — zie [Bijwerken](../mcp/installation.md#updating).
- Een CDN-URL zonder versie levert nu de nieuwste 4.x-versie. Zet `@3.10.0` vast om op 3.x te blijven — zie [CDN](#cdn).
