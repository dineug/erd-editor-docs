---
sidebar_position: 1
description: Installera @dineug/erd-editor från npm eller ett CDN, montera det anpassade elementet, koppla in fildialogrutorna och uppgradera från 3.x.
---

# Installera

```sh
npm install @dineug/erd-editor
```

Paketet är enbart ESM (`"type": "module"`) och innehåller bara mappen `dist`.
Det finns ingen CommonJS-build, så `require('@dineug/erd-editor')` fungerar inte.

Paketets körtidsberoenden lämnas externa, som rena importer som din bundler löser upp, deduplicerar och rensar med tree shaking.
Dess shared workers genereras som separata ingångsfiler under `dist/workers/` och skapas med `new URL('./…', import.meta.url)`, den skrivform som Vite, webpack 5 och Rspack bundlar som ingångspunkt för en worker. Se [Web Workers](#web-workers).
För en sida utan bundler bakom sig finns en andra, fristående build – se [Script-tagg](#script-tag).

## Användning {#usage}

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
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor"></script>
```

`esm.run` löser upp paketets externa beroenden åt dig, så det här fungerar utan bundler.
URL:en utan version levererar alltid den senaste versionen. Ange en fast version – `https://esm.run/@dineug/erd-editor@4.2.0` – om du inte vill att en uppgradering till en ny huvudversion ska nå din sida utan förvarning.
`4.0.0` är i sig en sådan: en sida som måste stanna på 3.x anger `@3.10.0` – se [Uppgradera från 3.x](#upgrading-from-3x).

### Script-tagg {#script-tag}

Sedan `3.6.0` levererar paketet också en UMD-build med alla beroenden och alla shared workers i en enda fil.
Det är den som fälten `unpkg` och `jsdelivr` pekar på, så paketets rena URL på båda CDN-tjänsterna levererar den, och den definierar `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.2.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

När den importeras registreras `<erd-editor>` på samma sätt; `window.ErdEditor` innehåller de två callback-funktionerna för filer, `ErdEditor.setExportFileCallback` och `ErdEditor.setImportFileCallback`, och sedan `3.9.2` även `ErdEditor.createKeyBindingMap`. Sedan `4.2.0` innehåller `window.ErdEditor` också `ErdEditor.dictionaryRowChords` – se [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords).
Exports-mappningen hänvisar fortfarande en bundler till ES-modulerna, så en installation från npm får aldrig med den här filen.

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

Sedan `4.0.0` lägger `enable-locale-picker` till väljaren `Display Language` i verktygsfältet och `enable-welcome-screen` välkomstskärmen som ett tomt diagram visar – se [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) och [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
En sida som läser in ett dokument, som [Användning](#usage) gör, slår på `enableWelcomeScreen` först när `setInitialValue()` har läst in det och inte i HTML-koden, så att skärmen aldrig blinkar till över en fil som fortfarande läses in.
Alla 25 visningsspråk följer med i paketet, i både ES-builden och builden för script-taggen, så det finns ingen språkfil att leverera och ingenting att registrera. Utan väljaren och utan ett anrop till `setLocale()` visar editorn engelska.

Om du lägger till `readonly` här blockeras redigering: tilldelning av `value`, anrop till `clear()` och varje anrop till `setSchema*()` – inklusive `setSchemaJSON()` och anrop som lägger till – ignoreras, och händelsen `change` utlöses aldrig. Att läsa `editor.value` och `editor.runtimeValue` fungerar fortfarande. Läs in med `setInitialValue()` i stället.

### Rendering på serversidan {#server-side-rendering}

När paketet importeras registreras det anpassade elementet på modulnivå, så det behöver en DOM och kastar ett fel i Node.
I Next.js, Nuxt, SvelteKit eller Astro når du det från en kodväg som bara körs på klienten.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

När paketet importeras läggs `erd-editor` till i `HTMLElementTagNameMap`, så elementet får sin typ utan typomvandling.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` exporteras för typannotering av dina egna variabler och props.
Sedan `4.0.0` exporterar paketet också typerna `LocaleCode`, `LocaleOption` och `SchemaSQLOptions` – se [Ingångspunkter](#entry-points). Alternativen som metoderna `setSchema*()` tar emot har inget exporterat namn; hämta dem från elementet, som `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## Syntaxmarkering {#syntax-highlighting}

Panelerna för Schema SQL och kodgeneratorn syntaxmarkeras av [Shiki](https://shiki.style), i en egen shared worker, och sedan `4.0.0` gäller det även skripten `Before tables` och `After tables` på fliken Schema SQL.
Sedan `3.7.0` finns det ingenting att installera och ingenting att registrera: workern skapas första gången en kodpanel renderas, så en sida som inte öppnar någon hämtar aldrig grammatikerna.

| | |
| --- | --- |
| Språk | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Teman | `github-dark` och `github-light`, som följer editorns ljusa eller mörka utseende |

Det är exakt de språk som panelerna producerar: `JPA` markeras som Java, `SQLAlchemy` som Python, `TypeORM`, `Sequelize`, `Drizzle` och `Zod` som TypeScript, `Doctrine` som PHP, `SeaORM` som Rust, `JSON Schema` som JSON samt `DBML` och `AML` som SQL, den närmaste grammatiken som ingår – se [Kodgenerator](../guide/guides/code-generator.md).

Regexmotorn är ren JavaScript, så ingen policy i värdprogrammet behöver `wasm-unsafe-eval`.
Där `SharedWorker` saknas – Chrome på Android, Safari före 16.4 – loggas felet och koden visas som vanlig text; skripten går fortfarande att redigera.

Uppgradering från `3.6.0` eller tidigare: `@dineug/erd-editor-shiki-worker` publiceras inte längre, och `setGetShikiServiceCallback` har försvunnit med det.
Ta bort installationen och registreringen; en sida som läste in workern från ett CDN tar också bort den andra taggen `<script>`.

## Web Workers {#web-workers}

Editorn kör tre uppgifter i instanser av `SharedWorker`: syntaxmarkering, bildexport och tabellayouten bakom [automatisk layout](../guide/guides/table-related-functions.md#auto-layout), [flödesläget](../guide/guides/visualization.md#how-flow-is-placed) på fliken Visualisering och, sedan `4.0.0`, placeringen av ett importerat schema.
Alla tre följer med i `@dineug/erd-editor`. Ingen av dem behöver du konfigurera, men var och en kan blockeras av ett värdprogram.
Workern som körde dokumentets skräpinsamling togs bort i `4.0.0`, tillsammans med själva skräpinsamlingen.

| Worker | Utan den |
| --- | --- |
| Syntaxmarkering | Panelerna för Schema SQL och kodgeneratorn samt skripten i Schema SQL förblir vanlig text |
| Bildexport | PNG-bilden, SVG-bilden, `Copy to clipboard` och förhandsgranskningen i dialogrutan `Export image` ritas på huvudtråden, vilket blockerar sidan medan den ritar |
| Tabellayout | Layouterna `Flow`, `Tree - vertical` och `Tree - horizontal` i automatisk layout och flödesläget på fliken Visualisering slutar med `Could not place tables`; en import som placeras med layouten Flow – en SQL-, GraphQL-, DBML- eller AML-fil från `Import` eller `Import and Add`, eller ett anrop till `setSchema*()` med `placement: 'auto'` – lägger sina tabeller i rader, utan meddelande; `Force` och grafläget påverkas inte, eftersom de körs inne i editorn |

Bildexporten väntar tio sekunder på att dess worker ska svara och ritar sedan på huvudtråden, och syntaxmarkeringen lämnar koden som vanlig text så snart dess worker misslyckas, så ett värdprogram som blockerar workers kostar prestanda snarare än funktion.
Tabellayouten är undantaget: motorn som beräknar en layout är större än själva editorn och läses aldrig in i processen, så den väntar trettio sekunder på sin worker vid den första placeringen, och när workern har svarat ger den en layout sextio sekunder att komma tillbaka.
Om någon av väntetiderna löper ut slutar placeringen som den gör utan workern. Automatisk layout visar `Placing tables` så snart den startar, medan flödesläget och en import som placeras med layouten Flow visar det först när en placering, inklusive starten av dess worker, har pågått i sex sekunder.

I den bundlade builden genereras alla tre som filer bredvid paketet, så en strikt CSP behöver `worker-src 'self'` – samt `blob:` där din bundler bäddar in en worker.
I builden för [script-taggen](#script-tag) följer alla tre med inuti filen som URL:er av typen `data:`, så den sidan behöver `worker-src data:` i stället.

## Ingångspunkter {#entry-points}

När `@dineug/erd-editor` importeras registreras `<erd-editor>` som en sidoeffekt. Utöver det exporterar paketet elementtypen, två funktioner som sätter callbacks, sedan `3.9.2` standardtangentkombinationerna med deras typer, sedan `4.0.0` typerna för visningsspråk och typen för alternativen till `getSchemaSQL()` och sedan `4.2.0` tangentkombinationerna för rader på fliken Ordlista.

| Export | Beskrivning |
| --- | --- |
| `ErdEditorElement` (typ) | Elementets gränssnitt – se [ErdEditorElement](./erd-editor-element.md). |
| `setExportFileCallback(cb)` | Ersätter webbläsarens nedladdning, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Ersätter webbläsarens filväljare, `({ type, op, accept, mode }) => void`; `mode` sedan `4.0.0`. Sedan `4.2.0` öppnar `Import CSV` på fliken Ordlista webbläsarens filväljare även när en callback är satt – se [Fildialogrutor](#file-dialogs). |
| `createKeyBindingMap()` | Returnerar standardtangentkombinationerna som en ny `KeyBindingMap` vid varje anrop – se [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (typer) | En bindningskarta, unionen av dess kommandonamn och en enskild bindning. |
| `dictionaryRowChords(map)` | Sedan `4.2.0`. Returnerar, som en ny `ShortcutOption[]` vid varje anrop, de tangentkombinationer som rutnätet på fliken [Ordlista](../guide/guides/dictionary.md#adding-and-deleting-rows) infogar och tar bort rader med under den `KeyBindingMap` som du skickar in. Den som infogar rader ovanför, `Alt+Shift+Enter` med standardbindningarna, finns inte i någon bindning – se [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (typer) | Sedan `4.0.0`. De 25 koderna för visningsspråk, och samma koder plus `'system'`, som `setLocale()` tar emot – se [Visningsspråk](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (typ) | Sedan `4.0.0`. Alternativen som `getSchemaSQL()` tar emot: `statements`, `header` och, sedan `4.2.0`, `logicalNameAsComment` – se [getSchemaSQL](./erd-editor-element.md#getschemasql). |

`@dineug/erd-editor/engine.js` är en andra ingångspunkt. Den kör dokumentets store utan DOM, så den fungerar i en Web Worker – se [Fjärrlagring](./advanced/remote-storage.md).
Den exporterar `createReplicationStore` och typen `ReplicationStore`. Sedan `3.10.0` exporterar den också typen `ReplicationChange`, `{ value: string; changed: boolean }`, som en repliks lyssnare för `change` tar emot – se [on@change](./advanced/remote-storage.md#onchange).
Sedan `4.0.0` har en `ReplicationStore` också egenskapen `runtimeValue`. Dess `value` och det värde som en `change` lämnar över är lagringsformen som en fil innehåller, precis som elementets – se [ReplicationStore](./advanced/remote-storage.md#replicationstore).

Sedan `3.9.1` finns en tredje, `@dineug/erd-editor/peer.js`: den headless deltagare som [MCP-servern](../mcp/introduction.md) redigerar ett dokument genom. Den finns för den servern, och de här sidorna dokumenterar den inte.

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
Callbacken för export tar emot de här filerna. Sedan `4.0.0` finns SVG-bilden och kodgeneratorns filer bland dem, och `.sql`-filen kommer från `Save file` på fliken Schema SQL i stället för direkt från `Export`. Sedan `4.2.0` finns även CSV-filen från fliken Ordlista bland dem.

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

## Uppgradera från 3.x {#upgrading-from-3x}

`4.0.0` är en huvudversion. Kontrollera var och en av följande punkter när du flyttar en sida från 3.x:

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
- En CDN-URL utan version levererar nu den senaste 4.x-versionen. Ange `@3.10.0` för att stanna på 3.x – se [CDN](#cdn).
