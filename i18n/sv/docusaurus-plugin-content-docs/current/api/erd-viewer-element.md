---
sidebar_position: 3
description: API:t för elementet erd-viewer – ett skrivskyddat diagram från ett värde eller en src-URL, dess minikarta och kontrollrad, händelserna load och error, teman, visningsspråk, fokus och tangenter, inläsning samt vad det lägger till på en sida.
---

# ErdViewerElement

Sedan `5.0.0` levererar paketet också `<erd-viewer>`, en skrivskyddad vy av ett dokument: en läsare panorerar, zoomar, söker och lyser upp relationer, och ingenting i den redigerar. Den ritar bara ERD-arbetsytan, med sina rullningslister, en [minikarta](#minimap), en [kontrollrad](#controls) och en palett som söker i dokumentet, och har inget verktygsfält, inga flikar, ingen utforskare och ingen snabbmeny.

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Ramen ovan är det här elementet så som erd-editor.io/embed visar det, här med bokhandelsexemplet: klicka på den för att ge den fokus, zooma och sök sedan med tangenterna i [Fokus och tangenter](#focus-and-keys), och se [Bädda in](../guide/guides/embedding.md) för att ramma in ett eget dokument utan kod.

Visaren är ett vanligt `HTMLElement`.  
Dess typdefinition ser ut så här.

```ts
interface ErdViewerElement extends HTMLElement {
  src: string;
  nameView: 'physical' | 'logical' | 'both' | null;
  minimap: boolean;
  controls: boolean;
  value: string;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => Promise<void>;
  setSystemLocale: (locale: string | null) => Promise<void>;
  destroy: () => void;
}
```

Import av `@dineug/erd-editor/erd-viewer.js` definierar `<erd-viewer>` och lämnar `<erd-editor>` odefinierad. Import av paketets rot definierar ingetdera: den exporterar klassen `ErdViewerElement` och `defineErdViewer()`, som definierar taggen där du anropar den, så en sida kan också definiera klassen under en egen tagg – se [Registrera elementen](./installation.md#registering-the-elements).  
Varje ingångspunkt utom `engine.js` och `peer.js` behöver en DOM, den här också, så en sida som renderas på servern importerar den på klienten – se [Rendering på serversidan](./installation.md#server-side-rendering).  
Import av ingångspunkten lägger till `erd-viewer` i `HTMLElementTagNameMap`, så `document.createElement('erd-viewer')` och `document.querySelector('erd-viewer')` får typen `ErdViewerElement` utan typomvandling.

Liksom editorn renderar visaren i en stängd shadow root, så `viewer.shadowRoot` är `null` och sidans stilar läcker varken in eller ut; stila den genom [setTheme](#settheme) och de anpassade egenskaperna `--erd-editor-*`. Flera visare på en sida behåller var och en sitt eget dokument, sin egen vy, sitt eget tema och sitt eget språk.  
`<erd-viewer>` har ingen egen storlek. Ett anpassat element är inline, så ge det `display: block` och en höjd, som ovan. Vyn fyller elementets ruta och följer den när den ändrar storlek, med zoomen bevarad.

`src`, `name-view`, `minimap` och `controls` är dess enda attribut, vart och ett med en egenskap med samma namn, `nameView` för `name-view`. [value](#value) är enbart en egenskap.  
Ett `value`, `src`, `nameView`, `minimap` eller `controls` som sätts på elementet innan dess tagg är definierad, till exempel av ett ramverk som renderar elementet innan ingångspunkten har lästs in, tas upp när taggen har definierats, före de attribut som markuppen gav det. De tas upp i den ordning som sidan först skrev var och en, så det senare av `value` och `src` vinner. Ett `value` som inte innehåller något dokument har då ingen anropare kvar att kasta felet till: det rapporteras som ett ofångat fel, och visaren förblir tom.

Builden för script-taggen, `dist/erd-viewer.umd.js`, innehåller enbart visaren med alla beroenden. Den definierar `<erd-viewer>` och lägger `ErdViewerElement` och `defineErdViewer` på `window.ErdViewer`. En CDN-URL utan sökväg levererar i stället editorns build, så ange filen – se [Script-tagg](./installation.md#script-tag).

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

URL:en till ett dokument som visaren ska hämta och visa. Standardvärdet är `''`, inget.  
Hämtningen är en vanlig `fetch()`, en `GET` utan egna alternativ, så webbläsarens CORS-regler gäller: ett dokument på en annan origin behöver en server som tillåter sidans origin, och cookies skickas bara till sidans egen origin. En relativ URL löses upp mot sidan.  
Svaret måste innehålla ett dokument så som en `.erd.json`-fil gör, lagringsformen som editorns [value](./erd-editor-element.md#value) och varje officiellt värdprogram skriver. Inget annat format läses: en SQL-, GraphQL-, DBML- eller AML-fil misslyckas som text som inte går att tolka.  
Ett dokument som går att tolka landar anpassat till vyn och utlöser [load](#load). En begäran som nätverket eller CORS nekade, ett svar som inte är `ok` eller text som inte går att tolka utlöser [error](#error) och lämnar ett tomt diagram – se [Inläsning](#loading).

Bara den senaste begäran räknas. Ett nytt `src` avbryter hämtningen som fortfarande pågår, så ett långsamt svar landar aldrig över ett senare dokument. Att tilldela [value](#value) avbryter den också, och det gör även att ta bort `src` eller sätta det till `''`, vilket slutar följa det och lämnar det visade dokumentet som det var.  
Vilket av `value` och `src` som sattes sist vinner, genom egenskapen eller attributet lika. Ett `src` som skrivs efter ett `value` hämtas även när det anger samma URL som hämtades förut. Skrivs det igen över det dokument som det redan visar hämtas ingenting.  
Visaren hämtar bara medan den finns på en sida. Att ta ut den avbryter en hämtning som fortfarande pågår, och att sätta tillbaka den hämtar ett `src` som den inte har visat, också ett som misslyckades, aldrig ett som den redan visar.  
`src` är den enda `fetch()` som paketet gör, så en strikt Content Security Policy listar dokumentets origin i `connect-src`.

```js
viewer.src = 'https://example.com/diagrams/shop.erd.json';
// or
viewer.setAttribute('src', 'https://example.com/diagrams/shop.erd.json');
```

```html
<erd-viewer src="https://example.com/diagrams/shop.erd.json"></erd-viewer>
```

## value {#value}

### getter {#getter}

Hämtar det dokument som visas, oavsett om det kom från `src` eller `value`, som en JSON-sträng i den lagringsform som editorns [value](./erd-editor-element.md#value) skriver. Innan något visas är det ett nytt, tomt dokument vars `doc` är `{}`.  
Medan dokumentets [lås](../guide/guides/settings.md#lock) `Viewport` är på, vilket det är i ett nytt dokument, skriver det den zoom och rullning som dokumentet är låst vid, var läsaren än har flyttat vyn. Bara när det låset är av skriver det var vyn står, inklusive den anpassning som en inläsning gör.  
Det skriver den namnvisning som dokumentet har, aldrig den som [nameView](#nameview) eller kontrollraden visar över den, inte ens i ett dokument vars lås `Name View` är av.  
Det returnerar fortfarande dokumentet efter [destroy](#destroy).

```js
const data = viewer.value;
```

### setter {#setter}

Visar ett dokument från dess text, ersätter det som visas och anpassar det till vyn – se [Inläsning](#loading). Det tar den text som en fil eller editorns `value` innehåller.  
Text som inte går att tolka kastar ett fel innan något ändras, och dokumentet som visas stannar kvar: ett `SyntaxError` för text som inte är JSON, ett `TypeError` för JSON som inte innehåller något dokument, som `7`. En tom sträng, eller något som inte är en sträng, visar ett tomt diagram.  
Att tilldela det avbryter en `src`-hämtning som fortfarande pågår och utlöser varken `load` eller `error`.

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

Visar diagrammet i en [namnvisning](../guide/guides/logical-names.md#name-view) över den som dokumentet har: `'physical'` för `Physical Names`, `'logical'` för `Logical Names` eller `'both'` för `Both Names`. `null`, standardvärdet, visar dokumentets egen, och ett attributvärde som inte är något av de tre tolkas som `null`.  
Det gäller över varje dokument som läses in efter det, och [value](#value) skriver aldrig det. Att ta bort attributet går tillbaka till dokumentets egen vy.  
Listan `Name View` på [kontrollraden](#controls) byter också vy, tills nästa dokument landar eller `nameView` nästa gång ändras. Ett byte där skrivs inte heller till `value`.

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

Visar minikartan i det övre högra hörnet, medan dokumentet innehåller en tabell, en visad anteckning eller en visad tabellgrupp. Den är på som standard.  
Den fungerar som editorns: klicka på den för att flytta vyn dit, eller dra dess vyrektangel för att panorera – se [Navigera på arbetsytan](../guide/guides/table-related-functions.md#getting-around-the-canvas). Ett finger på den tillhör sidan tills visaren har fokus.  
Bara `minimap="false"` slår av den. Ett attribut utan värde, vilket annat värde som helst och inget attribut alls lämnar den på.

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

Visar kontrollraden över mitten av arbetsytans nedre kant. Den är på som standard och innehåller, från vänster till höger:

- Zoomen: `Zoom out`, den aktuella zoomen som en procentsats och `Zoom in`. De två knapparna stegar zoomen som zoomtangenterna gör, och ett klick på procentsatsen, `Reset zoom`, sätter tillbaka den på `100%`. Var och en anger sin tangent i sin knappbeskrivning.
- `Fit`, som zoomar och rullar så att hela diagrammet visas i vyn, centrerat.
- `Name View`, en knapp som visar den aktuella visningen och öppnar en lista med `Physical Names`, `Logical Names` och `Both Names` ovanför raden – se [nameView](#nameview).
- Kompassen `Go to content`, som ansluter till radens slut bara medan ingen del av diagrammet finns på skärmen, och tar vyn till den närmaste delen av det.

Raden står från vänster till höger på alla språk.  
Bara `controls="false"` slår av den, med dess kompass och dess lista `Name View`. Ett attribut utan värde, vilket annat värde som helst och inget attribut alls lämnar den på. Utan raden zoomar mushjulet, en nypning och tangenterna fortfarande när visaren har fokus.

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Händelser {#event}

`load` och `error` är de enda två händelserna, och båda rapporterar om `src`. Ingen av dem bubblar, så lyssna på själva elementet.

### load {#load}

Utlöses när dokumentet som `src` anger har hämtats och visats. `event.detail` är `null`.  
Att tilldela `value` utlöser ingen, och det gör inte heller en hämtning som ett senare `src`, ett `value`, att elementet togs ut ur sidan eller [destroy](#destroy) avbröt.

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

Utlöses när hämtningen av `src` misslyckas: nätverket eller CORS nekade begäran, svaret var inte `ok` eller dess text gick inte att tolka. Visaren visar då ett tomt diagram och meddelandet `Couldn't load the diagram` – se [Inläsning](#loading).  
`event.detail` är orsaken: det `TypeError` som `fetch()` avvisas med, ett `Error` som nämner statusen, som `GET /missing.erd.json answered 404 Not Found`, eller tolkarens `SyntaxError` eller `TypeError`.  
En hämtning som något avbröt utlöser ingenting.

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

Anger ett förinställt tema och tar editorns `ThemeOptions` – se [setPresetTheme](./erd-editor-element.md#setpresettheme).  
Visaren startar med `appearance: 'system'`, `grayColor: 'slate'` och `accentColor: 'indigo'`, så från sin första bildruta visar den det ljusa eller mörka utseende som operativsystemet rapporterar, och byter när det ändras. Editorn startar i stället mörk.  
Varje fält tillämpas för sig, så ett partiellt anrop lämnar de andra två som de är. Ett värde som inte är ett av namnen ignoreras, och anropet kastar aldrig ett fel.  
Visaren har inget temaverktyg och ingen `systemDarkMode`, och utlöser ingen händelse för ett tema.

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

Anger det ljusa eller mörka utseende som utseendet `'system'` visar, för en sida med ett eget ljust och mörkt läge. Medan ett är angivet ignoreras operativsystemets ändringar.  
`null`, eller vilket värde som helst utom `'dark'` eller `'light'`, återgår till att följa operativsystemet.  
Medan utseendet är `'light'` eller `'dark'` ändrar det ingenting på skärmen, men värdet behålls och gäller så fort utseendet blir `'system'`. Det utlöser ingenting.

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

Åsidosätter temats token ovanpå det förinställda temat och tar editorns `Theme`-token – se [setTheme](./erd-editor-element.md#settheme).  
Varje anrop ersätter hela överlägget, så skicka `{}` för att gå tillbaka till det förinställda temat. Bara tokennamnen, med strängvärden, behålls, och ett senare `setPresetTheme` byter det förinställda temat under dem medan åsidosättningarna stannar kvar.  
De anpassade CSS-egenskaperna `--erd-editor-*` når också visaren, satta på elementet eller var som helst ovanför det – se [CSS-variabler](./erd-editor-element.md#css-variables). Arbetsytan, som ingen formatmall når, läser dem på nytt när en formatmall i sidans `head` ändras, eller när attributet `class` eller `style` på elementet eller på ett element ovanför det ändras. En regel som läggs till med `insertRule()` ändrar ingen av dessa, så arbetsytan tar upp den vid nästa sådan ändring.

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

Anger visningsspråket: `'system'`, standardvärdet, eller en av de 25 koder som editorns [visningsspråk](./erd-editor-element.md#display-language) listar. Allt annat, som ett kort `'ko'` eller ett värde som inte är en sträng, ignoreras.  
Språket ändrar knappbeskrivningarna på kontrollraden, listan `Name View`, paletten, inläsningsmeddelandena och de ord som diagrammet ritar själv, som `unnamed`. Namn, kommentarer och resten av dokumentet översätts aldrig.

Engelska ingår i visarens ingångspunkt och gäller innan anropet returnerar. Varje annat språk är en egen modul, som din bundler genererar som en chunk bredvid visaren och som visaren hämtar från din bundle första gången en sida ber om det språket, en gång för alla visare på sidan. Tills den har landat fortsätter visaren att visa det språk den visade, engelska i en första bildruta. Om den inte går att läsa in visar visaren engelska, och att be om det språket igen försöker på nytt.  
Builden för [script-taggen](./installation.md#script-tag) innehåller alla 25 språk, så den hämtar inget. En bundle som också innehåller editorn läser in varje språk med editorns chunk – se [Registrera elementen](./installation.md#registering-the-elements).  
Det `Promise` som returneras löses upp när det språket har landat eller har misslyckats med det, och avvisas aldrig. Det språket, eller engelska efter ett misslyckande, gäller då, om inte ett senare anrop bad om ett annat: det senare anropet vinner, i vilken ordning språken än landar.

Hebreiska, arabiska och persiska lägger ut paletten och inläsningsmeddelandena från höger till vänster. Arbetsytan, minikartan, rullningslisterna och kontrollraden med sin kompass förblir från vänster till höger, som editorns arbetsyta – se [Språk som skrivs från höger till vänster](../guide/guides/language-and-theme.md#right-to-left-languages).  
Visaren sätter `lang` och `dir` på sin egen rot inne i den stängda shadow root, aldrig på värdelementet eller sidan.  
Den utlöser ingenting, och visaren har ingen språkväljare och lagrar ingenting.

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

Anger det språk som `'system'` står för, som en BCP 47-tagg, för en sida med en egen språkinställning.  
Taggen trimmas. `null`, en tom sträng eller ett värde som inte är en sträng återgår till sidans språk.  
Det är sidans `<html lang>` och sedan webbläsarens `navigator.languages`, lästa en gång när visaren först ansluts. `'system'` tar det första av dem som visaren har ett språk för, enligt editorns regel i [setSystemLocale](./erd-editor-element.md#setsystemlocale), och engelska när den inte har något av dem. Så en sida vars `<html lang>` anger ett språk som visaren har visar det språket oavsett vad webbläsaren föredrar, och en senare ändring av `lang` eller av webbläsarens språk flyttar ingen visare.  
Det spelar bara roll medan alternativet som gäller är `'system'`, och dess `Promise` löses upp som [setLocale](#setlocale)s.

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

Avslutar visaren för gott. Den tar ned vyn innan den returnerar, oavsett om elementet fortfarande finns på sidan eller togs ut först, avbryter en `src`-hämtning som fortfarande pågår och slutar följa operativsystemets färgschema och sidans stilar.  
En avslutad visare ritar inget mer, hämtar ingenting och ber inte om något språk, inte ens när den läggs till på en sida igen. Att läsa [value](#value) returnerar fortfarande det dokument som den höll.  
Att ta ut elementet ur sidan avslutar det inte: tillbakasatt fortsätter det, och hämtar ett `src` som det inte har visat ännu – se [Inläsning](#loading).

```js
viewer.destroy();
```

## Fokus och tangenter {#focus-and-keys}

En visare tar inget fokus när den monteras, när ett dokument landar eller när dess palett stängs, så den rullar aldrig sidan till sig själv och tar aldrig sidans tangenter.  
Ett klick eller ett tryck på dess arbetsyta ger den fokus utan att rulla sidan, och den är ett stopp för tangenten `Tab`. Till skillnad från editorn har den ingen egen medlem `focus()` eller `blur()`. Ett tryck någon annanstans på sidan tar bort fokus igen.

Tills visaren har fokus behåller sidan mushjulet, som rullar sidan, och en nypning på styrplattan. Ett finger på arbetsytan rullar sidan och panorerar ingenting, och varje tangent når sidan oförhindrad.  
När den har fokus:

- Mushjulet panorerar vyn, och `Shift + Wheel` panorerar den i sidled. Över en anteckning vars text flödar över rullar mushjulet anteckningen.
- `Ctrl + Wheel` (Windows/Linux) eller `⌘ + Wheel` (Mac), en nypning på styrplattan eller två fingrar på en pekskärm zoomar.
- Ett finger panorerar vyn.
- `Ctrl + Plus` och `Ctrl + Minus` (Windows/Linux) eller `⌘ + Plus` och `⌘ + Minus` (Mac) stegar zoomen som knapparna `Zoom in` och `Zoom out` gör, och `Ctrl + 0` (Windows/Linux) eller `⌘ + 0` (Mac) går direkt tillbaka till `100%`, med skärmens mitt kvar där den är.
- `Ctrl + K` (Windows/Linux) eller `⌘ + K` (Mac) öppnar paletten, och `Esc` stänger den.

Det är dess enda tangenter, och de går inte att mappa om. Varje annan tangent når sidan oförhindrad, med fokus eller inte: `Delete`, `Backspace`, `Space`, `Enter`, `Tab`, `Ctrl + A`, `Ctrl + F` och varje tangentkombination som redigerar i editorn.

Paletten söker bara i dokumentet och listar inget kommando. Dess tomma inmatning visar prefixen: `#` söker i tabellerna, `@` i kolumnerna, `:` i kommentarerna och anteckningarna och `?` listar prefixen, som i editorn – se [Söka i diagrammet](../guide/guides/quick-search.md#searching-the-diagram). Ett ord utan prefix visar `No commands match` ovanför de rader som söker efter det i diagrammet.  
Att välja en rad flyttar vyn enligt editorns regel, [Var ett hopp hamnar](../guide/guides/table-related-functions.md#where-a-jump-lands), lämnar zoomen som den är och ritar en kontur runt det som den nådde, framflyttat: tabellen, tabellen som innehåller kolumnen eller kommentaren, eller anteckningen.  
Att välja en rad eller trycka på `Esc` stänger paletten och lämnar fokus utan något element, så nästa mushjulsrullning rullar sidan; klicka på vyn för att ge den mushjulet och tangenterna igen. Medan paletten är öppen rullar mushjulet dess lista, och zoomtangenterna gör ingenting.

Med fokus eller inte panorerar ett drag med huvudmusknappen vyn från var som helst på arbetsytan, också över en tabell. Ett klick eller ett tryck som inte flyttar sig lyser upp relationer: på en tabell lyser det upp den tabellens relationer, på en relationslinje den linjen, och på alla andra ställen, en anteckning inräknad, släcker det ljuset. Ett sådant klick tar också bort den kontur som ett hopp från paletten lämnade. Pekaren som vilar på en tabell lyser upp dess relationer medan den är där.  
Inget tryck markerar, flyttar eller redigerar något. Det finns ingen markering utom konturen från ett hopp, ingen markeringsram, och inget dubbelklick eller `Enter` öppnar en cell.

## Inläsning {#loading}

Medan `src` läses in visar ett meddelande över arbetsytans mitt `Loading diagram` bredvid en snurrande laddare. När en inläsning har misslyckats lyder det `Couldn't load the diagram` bredvid en varningssymbol, tills ett nytt `src` eller ett `value` tar dess plats eller `src` tas bort. Tryck går genom meddelandet till arbetsytan, och det skrivs på visningsspråket, från höger till vänster på ett språk som skrivs så.

Varje dokument som landar, från `src` eller från `value`, anpassas till visarens ruta: zoomas och rullas så att hela diagrammet visas, centrerat, som `Fit` gör, med den zoom och rullning som filen sparade åsidosatta. Ett dokument som lämnas över innan visaren har en storlek, satt innan den finns på en sida eller medan dess ruta är tom, anpassas när den har en. En senare storleksändring behåller zoomen; `Fit` anpassar igen.

Visaren hämtar ett `src` bara medan den finns på en sida. Att ta ut den avbryter en hämtning som fortfarande pågår, och att sätta tillbaka den hämtar ett `src` som den inte har visat, också ett som misslyckades, aldrig ett som den redan visar. En visare som inte behövs längre avslutas med [destroy](#destroy).

## Vad den lägger till på en sida {#what-it-adds-to-a-page}

- Ingen worker. Den startar ingen, så en Content Security Policy behöver inget `worker-src` för den.
- Ingen lagring. Den skriver ingen cookie, ingen `localStorage`, `sessionStorage` eller IndexedDB.
- Två slags begäran: hämtningen av [src](#src), vars origin en strikt policy listar i `connect-src`, och modulen för ett annat visningsspråk än engelska, från din egen bundle – se [setLocale](#setlocale).
- Stilar i konstruerade formatmallar, som en strikt `style-src` släpper igenom. En webbläsare utan konstruerade formatmallar, som Firefox före 101, får `<style>`-element i stället, som behöver `style-src 'unsafe-inline'`.
- Lyssnare på `window`. Import av ingångspunkten lägger till tre under sidans livstid, för `mousedown`, `touchstart` och paketets egen händelse `@dineug/erd-editor/internal-forward-move-start`. Konva, som ritar arbetsytan, sätter `window.Konva` och lägger med sin första stage till lyssnare för mus och pekskärm på `window` och en lyssnare för `visibilitychange` på `document`, som den aldrig tar bort. Editorns ingångspunkt lägger till samma.
- Tills [destroy](#destroy) följer varje visare operativsystemets färgschema och bevakar sidans stilar efter de anpassade egenskaper som [setTheme](#settheme) beskriver.
