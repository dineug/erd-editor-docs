---
sidebar_position: 1
description: Installera @dineug/erd-editor från npm eller ett CDN, registrera elementen för editorn och visaren, koppla in fildialogrutorna och uppgradera från 4.x eller 3.x.
---

# Installera

```sh
npm install @dineug/erd-editor
```

Paketet är enbart ESM (`"type": "module"`) och innehåller bara mappen `dist`.
Det finns ingen CommonJS-build, så `require('@dineug/erd-editor')` fungerar inte.

Det innehåller två anpassade element: `<erd-editor>`, editorn, och, sedan `5.0.0`, `<erd-viewer>`, som visar ett diagram skrivskyddat – se [ErdViewerElement](./erd-viewer-element.md).
Sedan `5.0.0` definierar import av paketets rot ingetdera. Varje element har en egen ingångspunkt som definierar det – se [Registrera elementen](#registering-the-elements).

Paketets körtidsberoenden lämnas externa, som rena importer som din bundler löser upp, deduplicerar och rensar med tree shaking. Sedan `5.0.0` innehåller dess `dist` en fil per modul, så en bundler behåller bara de moduler som en sida når – se [Ingångspunkter](#entry-points).
Dess shared workers genereras som separata ingångsfiler under `dist/workers/` och skapas med `new URL('./…', import.meta.url)`, den skrivform som Vite, webpack 5 och Rspack bundlar som ingångspunkt för en worker. Se [Web Workers](#web-workers).
För en sida utan bundler bakom sig finns två fristående builds – se [Script-tagg](#script-tag).

## Användning {#usage}

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

`@dineug/erd-editor/erd-editor.js` definierar `<erd-editor>` när den importeras. En sida som bara visar ett diagram importerar `@dineug/erd-editor/erd-viewer.js` i stället – se [ErdViewerElement](./erd-viewer-element.md).

`<erd-editor>` har ingen egen storlek. Ge den (eller dess behållare) en uttrycklig bredd och höjd.
Sedan `4.1.0` dockas en öppen [utforskare](../guide/guides/explorer.md) inne i elementet till vänster om ERD-arbetsytan och gör arbetsytan smalare i stället för att täcka den. I en ny editor är den stängd från början.
Panelen ritas aldrig smalare än `200px` och lämnar minst `320px` åt arbetsytan, så i ett element som är smalare än `520px` ritas en öppen utforskare inte förrän elementet blir bredare – se [Bredvid arbetsytan](../guide/guides/explorer.md#beside-the-canvas).

`setInitialValue('')` startar ett nytt, tomt dokument. En tilldelning av `value` läser i stället in ett dokument som en redigering, så det hamnar i ångrahistoriken.
Sedan `4.0.0` är `editor.value` dokumentet i den form som en fil innehåller, och det är det du ska lagra. `editor.runtimeValue` är dokumentet så som editorn håller det, borttagna entiteter inräknade: det initierar en medarbetare och hamnar aldrig i en fil – se [runtimeValue](./erd-editor-element.md#runtimevalue).
Sedan `4.0.0` har ett nytt dokument dessutom alla [inställningslås](../guide/guides/settings.md#lock) påslagna: visningsområdet, fliken, kodgeneratorns språk, båda skiftlägena, typen av citattecken och, sedan `4.2.0`, [namnvisningen](../guide/guides/logical-names.md#name-view). Rullning, zoomning, flikbyte, byte av namnvisning eller en ändring av någon av de andra inställningarna lämnar `editor.value` som det var och utlöser ingen `change`. Ett dokument som läses in från text behåller de lås som det anger. Ett dokument som inte anger några, som varje fil som sparats före `4.0.0`, öppnas med alla lås påslagna, med zoomnivån 100 % och på ERD-fliken, oavsett vilket visningsområde och vilken flik det sparade. Dess visningsområde låses vid origo `0, 0`, och vyn öppnas i stället på diagrammet om ingen del av det ritas där – se [setInitialValue](./erd-editor-element.md#setinitialvalue).
En fil som sparats före `4.2.0` öppnas med namnvisningen låst på `Physical Names`, även en fil där alla andra lås är avslagna. En editor i version `4.0.0` eller `4.1.0` behåller låset för namnvisningen som det är vid en sparning men tappar visningen, så en fil från `4.2.0` som sparats med namnvisningen upplåst förblir upplåst men öppnas igen i `Physical Names`.
Se [ErdEditorElement](./erd-editor-element.md) för resten av API:t.

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

`esm.run` löser upp paketets externa beroenden åt dig, så det här fungerar utan bundler.
Varje ingångspunkt nås med sin sökväg efter versionen: `…/erd-editor.js` definierar editorn och `…/erd-viewer.js` visaren, som hämtar varje visningsspråk utom engelska från CDN:et första gången en sida ber om det. Paketets rena URL, `https://esm.run/@dineug/erd-editor@5.0.0`, levererar roten, som inte definierar något element.
En URL utan version levererar alltid den senaste versionen. Ange en fast version, som ovan, om du inte vill att en uppgradering till en ny huvudversion ska nå din sida utan förvarning.
`5.0.0` är i sig en sådan: en sida som måste stanna på 4.x anger `@4.2.0` – se [Uppgradera från 4.x](#upgrading-from-4x).

`esm.run` levererar shared workers från `cdn.jsdelivr.net`, och en webbläsare startar ingen shared worker från en annan origin än sidans. En editor som läses in på det här sättet körs alltså utan sina workers, som på ett värdprogram som blockerar dem – se [Web Workers](#web-workers). Builden för [script-taggen](#script-tag) bär dem inuti sin fil.

### Script-tagg {#script-tag}

Sedan `3.6.0` levererar paketet också en UMD-build med alla beroenden och alla shared workers i en enda fil, `dist/erd-editor.umd.js`.
Det är den som fälten `unpkg` och `jsdelivr` pekar på, så paketets rena URL på båda CDN-tjänsterna levererar den, och den definierar `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

När den läses in definieras `<erd-editor>`. `window.ErdEditor` innehåller de två callback-funktionerna för filer, `ErdEditor.setExportFileCallback` och `ErdEditor.setImportFileCallback`, sedan `3.9.2` `ErdEditor.createKeyBindingMap`, sedan `4.2.0` `ErdEditor.dictionaryRowChords` – se [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) – och sedan `5.0.0` `ErdEditor.ErdEditorElement` och `ErdEditor.defineErdEditor` – se [Registrera elementen](#registering-the-elements). Den innehåller ingen [toImage](./to-image.md).

Sedan `5.0.0` definierar en andra fil, `dist/erd-viewer.umd.js`, `<erd-viewer>` och lägger `ErdViewerElement` och `defineErdViewer` på `window.ErdViewer`. Den startar ingen worker, innehåller alla 25 visningsspråk och begär ingenting annat än den `src` som den får.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

Ingen av filerna definierar den andras tagg, och var och en lämnar ingen global på sidan utom sin egen och `window.Konva`.
Exports-mappningen hänvisar fortfarande en bundler till ES-modulerna, så en installation från npm får aldrig med någon av filerna.
En sida som inte kan läsa in ett eget skript kan i stället rama in den värdbaserade visaren på erd-editor.io/embed – se [Bädda in](../guide/guides/embedding.md).

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

Sedan `4.0.0` lägger `enable-locale-picker` till väljaren `Display Language` i verktygsfältet och `enable-welcome-screen` välkomstskärmen som ett tomt diagram visar – se [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) och [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
En sida som läser in ett dokument, som [Användning](#usage) gör, slår på `enableWelcomeScreen` först när `setInitialValue()` har läst in det och inte i HTML-koden, så att skärmen aldrig blinkar till över en fil som fortfarande läses in.
Editorn bär alla 25 visningsspråk, i både ES-builden och builden för script-taggen, så det finns ingen språkfil att leverera och ingenting att registrera. Utan väljaren och utan ett anrop till `setLocale()` visar editorn engelska.

Om du lägger till `readonly` här öppnas editorn som en läsare: tilldelning av `value`, anrop till `clear()` och varje anrop till `setSchema*()` – inklusive `setSchemaJSON()` och anrop som lägger till – ignoreras, och händelsen `change` utlöses aldrig. Dess flikar, utforskaren och snabbsökningen finns kvar för läsning, och varje kontroll som skulle redigera diagrammet är borta.
Att läsa `editor.value` och `editor.runtimeValue` fungerar fortfarande, och båda behåller dokumentets egna inställningar: en visningsinställning som läsaren ändrar, som zoomningen eller databasen, stannar på den editorns skärm. Läs in med `setInitialValue()` i stället – se [readonly](./erd-editor-element.md#readonly).

### Rendering på serversidan {#server-side-rendering}

Varje ingångspunkt utom `engine.js` och `peer.js` behöver en DOM, så den kastar ett fel i Node. `erd-editor.js` och `erd-viewer.js` definierar sitt element på modulnivå, och paketets rot, som sedan `5.0.0` inte definierar något, bygger fortfarande båda elementklasserna när den läses in.
I Next.js, Nuxt, SvelteKit eller Astro når du elementets ingångspunkt från en kodväg som bara körs på klienten, och en namngiven import från roten, som `setExportFileCallback` eller `toImage`, från samma kodväg.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

Lägg i utvecklingsläget till ELK-bundlen som editorns layoutworker importerar i Vites förbundling, annars misslyckas de layouter som den workern gör: `Flow`, `Tree - vertical` och `Tree - horizontal` i automatisk layout, flödesläget på fliken Visualisering och en import som placeras med layouten Flow.
Vite 7 och äldre behöver dessutom hålla editorn utanför förbundlingen, eftersom deras förbundling låter workrarnas URL:er peka på filer som den aldrig skriver, så alla tre workers misslyckas. Utelämna den raden `exclude` i Vite 8, där den bara gör att utvecklingsservern hämtar var och en av paketets filer för sig. En produktionsbuild behöver ingen av dem.

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

När `@dineug/erd-editor/erd-editor.js` importeras läggs `erd-editor` till i `HTMLElementTagNameMap`, och `@dineug/erd-editor/erd-viewer.js` lägger till `erd-viewer`, så elementet får sin typ utan typomvandling. Varje import från roten, även enbart av en typ, för med sig båda.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` exporteras för typannotering av dina egna variabler och props. Sedan `5.0.0` är den också elementets klass, och `ErdViewerElement` är visarens gränssnitt och klass – se [Registrera elementen](#registering-the-elements).
Sedan `4.0.0` exporterar paketet också typerna `LocaleCode`, `LocaleOption` och `SchemaSQLOptions`, och sedan `5.0.0` `ToImageOptions` – se [Ingångspunkter](#entry-points). Alternativen som metoderna `setSchema*()` tar emot har inget exporterat namn; hämta dem från elementet, som `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.
Sedan `5.0.0` typar paketets `typesVersions` också varje ingångspunkt för undersökväg under `moduleResolution: "node10"`, som inte läser någon exports-mappning.

## Registrera elementen {#registering-the-elements}

Sedan `5.0.0` definierar paketet en tagg först där en sida ber om det.

| Import | Definierar |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | Ingenting |

Var och en av de två ingångspunkterna definierar sin tagg när den utvärderas och exporterar ingenting, så den importeras för sin effekt, och ingen av dem definierar den andras tagg.
Roten exporterar båda elementklasserna, `ErdEditorElement` och `ErdViewerElement`, samt `defineErdEditor()` och `defineErdViewer()`, som definierar sin tagg där du anropar dem:

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

Ett anrop gör ingenting medan taggen redan har den klassen, så en ingångspunkt och ett define-anrop, eller två define-anrop, kan mötas på en sida. Det kastar ett `Error` som nämner taggen när en annan klass har den, som en andra kopia av paketet som bundlats in på samma sida: `Another element class already defines the custom element name erd-editor`.
Rotens klasser är de som ingångspunkterna definierar, så `customElements.get('erd-editor') === ErdEditorElement` när någon av dem har körts. Tills taggen är definierad skapar `document.createElement('erd-editor')` ett vanligt `HTMLElement` utan något av editorns medlemmar, och `new ErdEditorElement()` kastar ett fel.

För en egen tagg definierar du klassen under den själv och lägger själv till taggen i `HTMLElementTagNameMap`. Gör det i ett fönster som varken läser in det elementets ingångspunkt eller dess [script-tagg](#script-tag)-build och inte anropar någon define-funktion för det, eftersom en klass får ett enda namn per fönster:

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

En bundle som innehåller båda elementen får Vite och Rolldown att varna för en `INEFFECTIVE_DYNAMIC_IMPORT` en gång för varje visningsspråk utom engelska. Visaren läser in vart och ett av dem med en egen `import()`, och editorn importerar alla ordböcker på en gång, så de stannar i editorns chunk och läses in med den. Ingenting misslyckas, och en bundle med enbart visaren behåller varje språk i en egen chunk.

## Syntaxmarkering {#syntax-highlighting}

Panelerna för Schema SQL och kodgeneratorn syntaxmarkeras av [Shiki](https://shiki.style), i en egen shared worker, och sedan `4.0.0` gäller det även skripten `Before tables` och `After tables` på fliken Schema SQL.
Sedan `3.7.0` finns det ingenting att installera och ingenting att registrera: workern skapas första gången en kodpanel renderas, så en sida som inte öppnar någon hämtar aldrig grammatikerna.

| | |
| --- | --- |
| Språk | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Teman | `github-dark` och `github-light`, som följer editorns ljusa eller mörka utseende |

Det är exakt de språk som panelerna producerar: `JPA` markeras som Java, `SQLAlchemy` som Python, `TypeORM`, `Sequelize`, `Drizzle` och `Zod` som TypeScript, `Doctrine` som PHP, `SeaORM` som Rust, `JSON Schema` som JSON samt `DBML` och `AML` som SQL, den närmaste grammatiken som ingår – se [Kodgenerator](../guide/guides/code-generator.md).

Regexmotorn är ren JavaScript, så ingen policy i värdprogrammet behöver `wasm-unsafe-eval`.
Där `SharedWorker` saknas – Chrome på Android före Chrome 148, Safari före 16.4 – loggas felet och koden visas som vanlig text; skripten går fortfarande att redigera.

Uppgradering från `3.6.0` eller tidigare: `@dineug/erd-editor-shiki-worker` publiceras inte längre, och `setGetShikiServiceCallback` har försvunnit med det.
Ta bort installationen och registreringen; en sida som läste in workern från ett CDN tar också bort den andra taggen `<script>`.

## Web Workers {#web-workers}

Editorn kör tre uppgifter i instanser av `SharedWorker`: syntaxmarkering, bildexport och tabellayouten bakom [automatisk layout](../guide/guides/table-related-functions.md#auto-layout), [flödesläget](../guide/guides/visualization.md#how-flow-is-placed) på fliken Visualisering och, sedan `4.0.0`, placeringen av ett importerat schema.
Alla tre följer med i `@dineug/erd-editor`. Ingen av dem behöver du konfigurera, men var och en kan blockeras av ett värdprogram.
Sedan `5.0.0` skapas varje worker i en egen modul, så en bundle bär bara de workers som dess moduler når: en bundle av [toImage](./to-image.md) utan något element bär bara bildexportens worker, och `<erd-viewer>` startar ingen worker alls – se [Ingångspunkter](#entry-points).
Workern som körde dokumentets skräpinsamling togs bort i `4.0.0`, tillsammans med själva skräpinsamlingen.

| Worker | Utan den |
| --- | --- |
| Syntaxmarkering | Panelerna för Schema SQL och kodgeneratorn samt skripten i Schema SQL förblir vanlig text |
| Bildexport | PNG-bilden, SVG-bilden, `Copy to clipboard`, förhandsgranskningen i dialogrutan `Export image` och, sedan `5.0.0`, [toImage()](./to-image.md) ritas på huvudtråden, vilket blockerar sidan medan den ritar |
| Tabellayout | Layouterna `Flow`, `Tree - vertical` och `Tree - horizontal` i automatisk layout och flödesläget på fliken Visualisering slutar med `Could not place tables`; en import som placeras med layouten Flow – en SQL-, GraphQL-, DBML- eller AML-fil från `Import` eller `Import and Add`, eller ett anrop till `setSchema*()` med `placement: 'auto'` – lägger sina tabeller i rader, utan meddelande; `Force` och grafläget påverkas inte, eftersom de körs inne i editorn |

Bildexporten väntar tio sekunder på att dess worker ska svara och ritar sedan på huvudtråden, och syntaxmarkeringen lämnar koden som vanlig text så snart dess worker misslyckas, så ett värdprogram som blockerar workers kostar prestanda snarare än funktion.
Tabellayouten är undantaget: motorn som beräknar en layout är större än själva editorn och läses aldrig in i processen, så den väntar trettio sekunder på sin worker vid den första placeringen, och när workern har svarat ger den en layout sextio sekunder att komma tillbaka.
Om någon av väntetiderna löper ut slutar placeringen som den gör utan workern. Automatisk layout visar `Placing tables` så snart den startar, medan flödesläget och en import som placeras med layouten Flow visar det först när en placering, inklusive starten av dess worker, har pågått i sex sekunder.

Vite, webpack 5 och Rspack genererar workers som filer bredvid dina chunks. esbuild, och Rolldown när det används för sig själv och inte genom Vite, genererar inga, så en sida som de bygger körs utan workers.
Under webpacks experimentella `experiments.outputModule` startar ingen worker, eftersom var och en väntar på en chunk som delats av från den och som ingenting läser in. Behåll webpacks standardutdata, eller sätt `optimization.splitChunks: false`.

### Content Security Policy {#content-security-policy}

En sida under en strikt Content Security Policy behöver de här direktiven för elementen:

- `worker-src 'self'` för den bundlade builden, vars workers är filer bredvid paketet, samt `blob:` där din bundler bäddar in en worker. I builden för [script-taggen](#script-tag) följer alla tre med inuti filen som URL:er av typen `data:`, så den sidan behöver `worker-src data:` i stället. `<erd-viewer>` behöver ingetdera, eftersom den inte startar någon worker.
- Sedan `5.0.0` stilar sig båda elementen med konstruerade formatmallar, som `style-src 'self'` släpper igenom. Editorns kodpaneler färgar fortfarande sin text med `style`-attribut, och förhandsgranskningen i dialogrutan `Export image` är en bild på en URL av typen `blob:`, så editorn behöver också `style-src 'unsafe-inline'` och `img-src blob:` för dem.
- En webbläsare utan konstruerade formatmallar, som Firefox före 101, får `<style>`-element i stället, som behöver `style-src 'unsafe-inline'` för båda elementen.
- `<erd-viewer>` hämtar sin `src`, så den originen läggs i `connect-src` – se [Vad den lägger till på en sida](./erd-viewer-element.md#what-it-adds-to-a-page).

## Ingångspunkter {#entry-points}

Paketet har fem ingångspunkter:

| Ingångspunkt | Vad den är |
| --- | --- |
| `@dineug/erd-editor` | Roten: exporterna nedan. Sedan `5.0.0` definierar den inget element, men den behöver fortfarande en DOM för att läsas in |
| `@dineug/erd-editor/erd-editor.js` | Sedan `5.0.0`. Definierar `<erd-editor>` och exporterar ingenting |
| `@dineug/erd-editor/erd-viewer.js` | Sedan `5.0.0`. Definierar `<erd-viewer>` och exporterar ingenting |
| `@dineug/erd-editor/engine.js` | Dokumentets store utan DOM |
| `@dineug/erd-editor/peer.js` | Sedan `3.9.1`. Den headless deltagare som MCP-servern använder |

Roten exporterar båda elementklasserna och deras define-funktioner, två funktioner som sätter callbacks, sedan `3.9.2` standardtangentkombinationerna med deras typer, sedan `4.0.0` typerna för visningsspråk och typen för alternativen till `getSchemaSQL()`, sedan `4.2.0` tangentkombinationerna för rader på fliken Ordlista och sedan `5.0.0` `toImage`.

| Export | Beskrivning |
| --- | --- |
| `ErdEditorElement` | Elementets gränssnitt – se [ErdEditorElement](./erd-editor-element.md). Sedan `5.0.0` också dess klass, den som `<erd-editor>` definieras som – se [Registrera elementen](#registering-the-elements). |
| `ErdViewerElement` | Sedan `5.0.0`. Visarens gränssnitt och klass – se [ErdViewerElement](./erd-viewer-element.md). |
| `defineErdEditor()`, `defineErdViewer()` | Sedan `5.0.0`. Definierar `<erd-editor>` eller `<erd-viewer>` som sin klass. Ett anrop gör ingenting medan taggen har den klassen, och kastar ett `Error` när en annan klass har den – se [Registrera elementen](#registering-the-elements). |
| `toImage(value, options)` | Sedan `5.0.0`. Ritar ett dokument som en PNG-`Blob` eller en SVG-sträng, med alternativen i dialogrutan `Export image` – se [toImage](./to-image.md). |
| `ToImageOptions` (typ) | Sedan `5.0.0`. Alternativen som `toImage()` tar emot: `format`, `background`, `darkMode` och `scale`. |
| `setExportFileCallback(cb)` | Ersätter webbläsarens nedladdning, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Ersätter webbläsarens filväljare, `({ type, op, accept, mode }) => void`; `mode` sedan `4.0.0`. Sedan `4.2.0` öppnar `Import CSV` på fliken Ordlista webbläsarens filväljare även när en callback är satt – se [Fildialogrutor](#file-dialogs). |
| `createKeyBindingMap()` | Returnerar standardtangentkombinationerna som en ny `KeyBindingMap` vid varje anrop – se [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (typer) | En bindningskarta, unionen av dess kommandonamn och en enskild bindning. |
| `dictionaryRowChords(map)` | Sedan `4.2.0`. Returnerar, som en ny `ShortcutOption[]` vid varje anrop, de tangentkombinationer som rutnätet på fliken [Ordlista](../guide/guides/dictionary.md#adding-and-deleting-rows) infogar och tar bort rader med under den `KeyBindingMap` som du skickar in. Den som infogar rader ovanför, `Alt+Shift+Enter` med standardbindningarna, finns inte i någon bindning – se [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (typer) | Sedan `4.0.0`. De 25 koderna för visningsspråk, och samma koder plus `'system'`, som `setLocale()` tar emot – se [Visningsspråk](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (typ) | Sedan `4.0.0`. Alternativen som `getSchemaSQL()` tar emot: `statements`, `header` och, sedan `4.2.0`, `logicalNameAsComment` – se [getSchemaSQL](./erd-editor-element.md#getschemasql). |

Sedan `5.0.0` innehåller `dist` en icke-minifierad fil per modul, var och en bredvid sin deklaration, och `sideEffects` i `package.json` nämner bara de två taggingångarna och två stubbar som workerfilerna behöver. Så en bundler släpper varje modul som en sida inte når och minifierar en gång:

- En namngiven import från roten, som `setExportFileCallback`, bundlar varken något element eller någon worker.
- `toImage` för med sig bildexportens worker och inget element.
- `erd-editor.js` för med sig editorn och alla tre shared workers.
- `erd-viewer.js` för med sig visaren och ingen worker, med engelska inuti sig och varje annat visningsspråk i en egen chunk, som läses in när en sida ber om det.

`@dineug/erd-editor/engine.js` kör dokumentets store utan DOM, så den fungerar i en Web Worker – se [Fjärrlagring](./advanced/remote-storage.md).
Den exporterar `createReplicationStore` och typen `ReplicationStore`. Sedan `3.10.0` exporterar den också typen `ReplicationChange`, `{ value: string; changed: boolean }`, som en repliks lyssnare för `change` tar emot – se [on@change](./advanced/remote-storage.md#onchange).
Sedan `4.0.0` har en `ReplicationStore` också egenskapen `runtimeValue`. Dess `value` och det värde som en `change` lämnar över är lagringsformen som en fil innehåller, precis som elementets – se [ReplicationStore](./advanced/remote-storage.md#replicationstore).

`@dineug/erd-editor/peer.js` är den headless deltagare som [MCP-servern](../mcp/introduction.md) redigerar ett dokument genom. Den finns för den servern, och de här sidorna dokumenterar den inte.

### Fildialogrutor {#file-dialogs}

Import och export går via injicerbara callbacks, så ett värdprogram utan webbläsarens fildialogruta – till exempel en webview i en IDE – kan tillhandahålla sin egen.
De två är inte symmetriska: exporten ger dig den färdiga filen, medan importen bara ber om en, och du skickar själv in innehållet igen.
Sedan `4.2.0` är `Import CSV` på fliken Ordlista den enda import som aldrig anropar callbacken för import, vars `type` saknar ett värde för CSV. Den öppnar alltid webbläsarens egen filväljare, för `.csv`-filer – se [Importera och exportera CSV](../guide/guides/dictionary.md#importing-and-exporting-csv).

`op` är `set` eller `diff` – en `diff` går till `setDiffValue()`, oavsett `type`. Annars väljer `type` metoden, och `accept` innehåller den typens filändelser, redo att lämnas till en fildialogruta i värdprogrammet.
Sedan `4.0.0` innehåller en `set` värdet `mode: 'append'` när användaren valde [Importera och lägg till](../guide/guides/file-import-export.md#import-and-add), och inget `mode` vid en vanlig import. Skicka det vidare: en callback som utelämnar det ersätter diagrammet som användaren ville lägga till i.

| `type` | `accept` | Metod |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'` lägger ut tabellerna efter deras relationer innan de läggs in, som editorns egen import gör, och gör att anropet returnerar ett Promise. Utan det hamnar de direkt i rader – se [setSchemaSQL](./erd-editor-element.md#setschemasql) och [setSchemaJSON](./erd-editor-element.md#setschemajson).

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

Gör en gren för varje `type` som du hanterar och ignorera resten.
Ett ersättande anrop till `setSchemaJSON()` tömmer, precis som en tilldelning av `value`, dokumentet före tolkningen, så om innehåll som inte är ett `.erd.json`-dokument skickas dit – via en `else` som fångar allt, eller för att en `type` som lagts till senare föll igenom – töms diagrammet i stället för att något importeras.

Värdet `fileName` som editorn genererar är `<database name>-<timestamp>` plus filändelsen, där tidsstämpeln är lokal tid i formatet `yyyy-MM-dd'T'HH_mm_ss`. Om databasnamnet är tomt används `unnamed`. En CSV-fil från ordlistan har bladets namn före filändelsen, som i `<database name>-<timestamp>-words.csv`.
Callbacken för export tar emot de här filerna. Sedan `4.0.0` finns SVG-bilden och kodgeneratorns filer bland dem, och `.sql`-filen kommer från `Save file` på fliken Schema SQL i stället för direkt från `Export`. Sedan `4.2.0` finns även CSV-filen från fliken Ordlista bland dem. [toImage()](./to-image.md) anropar ingen av callbackerna: den lämnar tillbaka sin bild till dig.

| Fil | Filändelse | `type` för Blob |
| --- | --- | --- |
| JSON-exporten | `.erd.json` | `application/json` |
| `Save file` på fliken Schema SQL, med den text som fliken visar – se [Schema SQL](../guide/guides/schema-sql.md) | `.sql` | ingen |
| Dialogrutan [Export image](../guide/guides/file-import-export.md#image) | `.png` eller `.svg` | `image/png` eller `image/svg+xml` |
| `Save file` på fliken Kodgenerator – se [Kodgenerator](../guide/guides/code-generator.md) | Språkets: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` eller `.mmd` | ingen |
| `Export CSV` på fliken Ordlista, med alla rader på det visade bladet, oavsett vad dess sökning listar – se [Importera och exportera CSV](../guide/guides/dictionary.md#importing-and-exporting-csv) | `.csv` | `text/csv` |

Ett värdprogram som väljer hanterare efter filändelse behöver en för var och en av dem.

Om de inte är satta använder editorn webbläsarens eget beteende för nedladdning och filval. Skicka `null` för att återgå till det.

## Webbläsarstöd {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ – den ES2022-baslinje som de publicerade bundlarna byggs mot.
Inga polyfills ingår. Lägg till egna om du behöver nå äldre webbläsare.

## Uppgradera från 4.x {#upgrading-from-4x}

`5.0.0` är en huvudversion. Kontrollera var och en av följande punkter när du flyttar en sida från 4.x:

- `import '@dineug/erd-editor'` definierar inte längre `<erd-editor>`. Importera `@dineug/erd-editor/erd-editor.js` för dess effekt i stället, eller anropa `defineErdEditor()`, och behåll dina namngivna importer från roten som de är. TypeScript flaggar inte en sida som lämnats kvar på den rena importen, eftersom rotens deklarationer fortfarande nämner taggen i `HTMLElementTagNameMap`, men elementet som den skapar är ett vanligt `HTMLElement`, så dess första metodanrop kastar ett `TypeError` – se [Registrera elementen](#registering-the-elements).

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- På ett CDN gäller detsamma för `https://esm.run/@dineug/erd-editor`, som nu levererar roten och inte definierar något: importera `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`. De rena URL:erna på jsDelivr och unpkg levererar fortfarande builden för script-taggen, som definierar `<erd-editor>` som förut. En URL utan version levererar nu den senaste 5.x-versionen; ange `@4.2.0` för att stanna på 4.x – se [CDN](#cdn) och [Script-tagg](#script-tag).
- Roten definierar inget men behöver fortfarande en DOM, så vid rendering på serversidan ligger en namngiven import från den, som `setExportFileCallback`, kvar på den kodväg som bara körs på klienten bredvid elementets ingångspunkt – se [Rendering på serversidan](#server-side-rendering).
- `window.ErdEditor` får `ErdEditorElement` och `defineErdEditor`. Visarens build för script-taggen lägger `ErdViewerElement` och `defineErdViewer` på `window.ErdViewer`, och ingen av globalerna innehåller `toImage`.
- En `readonly` editor öppnas som en läsare. Dess sex flikar, utforskaren, snabbsökningen och närvaron finns kvar, och varje kontroll som skulle redigera diagrammet är borta i stället för inaktiverad: verktygsfältet visar databasens namn som text, fliken Inställningar visar sina inställningar med varje kontroll inaktiverad under etiketten `Read only`, och det flytande verktygsfältet behåller bara zoomen, namnvisningen, zenläget och kompassen, så `Hand` och `Select` är borta och ett drag panorerar. Ett tryck markerar ingenting: den enda markeringen är den kontur som ett hopp från utforskaren eller snabbsökningen lägger runt det som det når, och som ett stilla klick tar bort, och kortkommandona för att markera allt markerar ingenting. Att slå på `readonly` avslutar det som stod öppet, som markeringen, handverktyget, en cellredigerare, ett drag, Map Columns, förhandsvisningen `Force` i Auto Layout och Time Travel, och behåller rullningen, zoomningen, fliken och namnvisningen – se [readonly](./erd-editor-element.md#readonly).
- De inställningar som en `readonly` läsare ändrar stannar på den editorns skärm oavsett vad deras lås anger: rullningen och zoomningen, fliken, namnvisningen, View Option, databasen samt kodgeneratorns språk, skiftlägen och typ av citattecken. `value`, `runtimeValue` och JSON-exporten behåller dokumentets egna, som en 4.x-läsares ändringar kunde nå, och `getSharedStore()` skickar ingen av dem till de andra editorerna. `getSchemaSQL()` utan databassystem skriver den databas som läsaren valde. Att slå av `readonly` sätter tillbaka databasen, kodinställningarna och View Option till dokumentets och lämnar rullningen, zoomningen, fliken och namnvisningen där läsaren lämnade dem.
- Raden `Recalculation table width` på fliken Inställningar är borta. En inläsning och en inklistring anpassar fortfarande varje tabells bredd till dess text.
- I Vite 8 tar du bort `exclude: ['@dineug/erd-editor']` ur `optimizeDeps`, som bara Vite 7 och äldre fortfarande behöver, och behåller ELK-raden `include` – se [Vite](#vite).

## Uppgradera från 3.x {#upgrading-from-3x}

`4.0.0` är en huvudversion. Kontrollera var och en av följande punkter när du flyttar en sida från 3.x, och därefter de i [Uppgradera från 4.x](#upgrading-from-4x) för `5.0.0`:

- `editor.value`, en repliks `value` och det `value` som dess `change` lämnar över är lagringsformen som en fil innehåller: utan borttagna entiteter, uppmätta bredder, staplingsordning eller relationernas fästpunkter. Fortsätt spara `value` och läs de uppgifterna från `runtimeValue`; entiteternas tidsstämplar (`meta`) har tagits bort helt. Initiera en medarbetare eller en replik som ansluter till en pågående session från en körande deltagares `runtimeValue`, inte från `value` eller filen, och spara aldrig `runtimeValue` – se [value](./erd-editor-element.md#value) och [runtimeValue](./erd-editor-element.md#runtimevalue).
- Inställningslås ersätter `Save Scroll Information` och `Save Zoom Information`. Ett nytt dokument, och varje dokument som sparats före `4.0.0`, har alla lås påslagna, så en rullning, en zoomning, ett flikbyte eller en ändring av kodgeneratorns språk, ett skiftläge eller typen av citattecken lämnar `value` som det var och utlöser ingen `change`. En sida som behöll vyn via `change` behöver ha `Viewport` (och `Canvas Type` för fliken) upplåst på fliken Inställningar, eller ett dokument vars `settings.lockSettings` lämnar de bitarna nollställda – se [Lås](../guide/guides/settings.md#lock).
- `settings` har inte längre `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` eller `ignoreSaveSettings`, och konstanterna `SaveSettingType` har tagits bort. `settings.lockSettings`, med bitarna i `LockSettingType`, ersätter `ignoreSaveSettings`, som `4.0.0` eller senare varken läser eller skriver – se [Settings](./advanced/schema.md#settings).
- Det [JSON Schema](./advanced/schema.md#json-schema) som varje fil anger i `$schema` beskriver nu enbart lagringsformen och är stängt: det avvisar en fil som en tidigare version sparade tills en sparning med `4.0.0` eller senare skriver om den.
- Dokumentets skräpinsamling har tagits bort tillsammans med sin worker, så en borttagen entitet ligger kvar i `runtimeValue` tills dokumentet nästa gång öppnas från sin fil. Tre shared workers finns kvar – se [Web Workers](#web-workers).
- Håll alla editorer och repliker i en delad session på `4.0.0` eller senare. En tidigare version ignorerar de nya åtgärdstyperna: de för tabellgrupper, Mappa kolumner, låsen och skripten i Schema SQL – se [Blanda versioner](./advanced/collaborative-editing.md#mixing-releases).
- Callbacken för import får `mode: 'append'` vid Importera och lägg till, vilket en callback måste skicka vidare. Callbacken för export får nu också `.svg`-filer och filer från kodgeneratorn, och `Export` ▸ `Schema SQL` öppnar fliken Schema SQL i stället för att spara, så `.sql`-filen kommer bara från `Save file` på den fliken – se [Fildialogrutor](#file-dialogs).
- `Delete` och `Backspace` är bundna till den nya bindningen `removeSelection`. Medan editorn har fokus utanför ett textfält förhindras tangentens standardåtgärd på alla flikar, och på ERD-fliken tas markeringen bort. `KeyBindingName` och `KeyBindingMap` får den, och `setKeyBindingMap({ removeSelection: [] })` överlåter båda tangenterna till sidan – se [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- `ThemeOptions.appearance` tar också emot `'system'`, alternativet `System` i temaverktyget, som sätts när du slår på `systemDarkMode`. `changePresetTheme` rapporterar `'system'` medan det är valt, så lagra värdet som det är och lämna tillbaka det till `setPresetTheme`. När `systemDarkMode` är på ligger ett anrop till `setPresetTheme()` med `'light'` eller `'dark'` nu kvar i stället för att skrivas över av nästa ändring i operativsystemet – se [systemDarkMode](./erd-editor-element.md#systemdarkmode) och [changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` `1.0.0` eller senare, VS Code-tillägget `4.0.0` eller senare och Obsidian- och JetBrains-pluginen `1.0.0` eller senare talar hubbprotokoll 2. Servern `1.0.0` eller senare och en tidigare editorversion som betjänar agenter, eller en tidigare server och en av de här editorerna, nekar varandra med `protocolMismatch` och anger vilken sida som ska uppdateras – se [Uppdatera](../mcp/installation.md#updating).
- En CDN-URL utan version levererar den senaste versionen, 5.x sedan `5.0.0`. Ange `@3.10.0` för att stanna på 3.x – se [CDN](#cdn).
