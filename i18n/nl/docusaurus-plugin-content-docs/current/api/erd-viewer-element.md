---
sidebar_position: 3
description: De API van het erd-viewer-element — een diagram in alleen-lezenmodus uit een value of een src-URL, zijn minimap en besturingsbalk, de events load en error, thema's, weergavetaal, focus en toetsen, laden, en wat het aan een pagina toevoegt.
---

# ErdViewerElement

Sinds `5.0.0` levert het pakket ook `<erd-viewer>`, een weergave van een document in alleen-lezenmodus: een lezer pant, zoomt, zoekt en laat relaties oplichten, en niets erin bewerkt. Het tekent alleen het ERD-canvas, met zijn schuifbalken, een [minimap](#minimap), een [besturingsbalk](#controls) en een palet dat het document doorzoekt, en heeft geen werkbalk, tabbladen, Verkenner of contextmenu.

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Het frame hierboven is dit element zoals erd-editor.io/embed het toont, hier met het voorbeeld van de boekwinkel: klik erop om de focus te geven, zoom en zoek dan met de toetsen in [Focus en toetsen](#focus-and-keys), en zie [Insluiten](../guide/guides/embedding.md) om zonder code een document van jezelf in een frame te tonen.

De viewer is een normaal `HTMLElement`.  
De typedefinitie is als volgt.

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

Het importeren van `@dineug/erd-editor/erd-viewer.js` definieert `<erd-viewer>` en laat `<erd-editor>` ongedefinieerd. Het importeren van de root van het pakket definieert geen van beide: die exporteert de klasse `ErdViewerElement` en `defineErdViewer()`, die de tag definieert waar je die aanroept, zodat een pagina de klasse ook onder een eigen tag kan definiëren — zie [De elementen registreren](./installation.md#registering-the-elements).  
Elk ingangspunt behalve `engine.js` en `peer.js` heeft een DOM nodig, dit ook, dus een pagina die op de server wordt gerenderd, importeert het op de client — zie [Server-side rendering](./installation.md#server-side-rendering).  
Het importeren van het ingangspunt voegt `erd-viewer` toe aan `HTMLElementTagNameMap`, zodat `document.createElement('erd-viewer')` en `document.querySelector('erd-viewer')` zonder cast als `ErdViewerElement` worden getypeerd.

Net als de editor rendert de viewer in een gesloten shadow root, dus `viewer.shadowRoot` is `null` en paginastijlen lekken niet naar binnen of naar buiten; stijl hem via [setTheme](#settheme) en de aangepaste eigenschappen `--erd-editor-*`. Meerdere viewers op één pagina houden elk hun eigen document, weergave, thema en taal.  
`<erd-viewer>` heeft geen intrinsieke grootte. Een custom element is inline, dus geef het `display: block` en een hoogte, zoals hierboven. De weergave vult het vak van het element en volgt het wanneer het van grootte verandert, met behoud van zijn zoomniveau.

`src`, `name-view`, `minimap` en `controls` zijn de enige attributen, elk met een eigenschap met dezelfde naam, `nameView` voor `name-view`. [value](#value) is alleen een eigenschap.  
Een `value`, `src`, `nameView`, `minimap` of `controls` die op het element is gezet voordat zijn tag is gedefinieerd, bijvoorbeeld door een framework dat het element rendert voordat het ingangspunt is geladen, wordt opgepakt zodra de tag is gedefinieerd, boven de attributen die de markup eraan gaf. Ze worden opgepakt in de volgorde waarin de pagina ze voor het eerst schreef, dus de latere van `value` en `src` wint. Een `value` die geen document bevat, heeft dan geen aanroeper meer om naar te gooien: die wordt gemeld als een onopgevangen fout, en de viewer blijft leeg.

De scripttag-build, `dist/erd-viewer.umd.js`, bevat alleen de viewer met alle afhankelijkheden. Hij definieert `<erd-viewer>` en zet `ErdViewerElement` en `defineErdViewer` op `window.ErdViewer`. Een CDN-URL zonder pad levert in plaats daarvan de build van de editor, dus noem het bestand — zie [Scripttag](./installation.md#script-tag).

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

De URL van een document dat de viewer moet ophalen en tonen. Standaard is dat `''`, geen.  
Het ophalen is een gewone `fetch()`, een `GET` zonder eigen opties, dus de CORS-regels van de browser zijn erop van toepassing: een document op een andere origin vraagt een server die de origin van de pagina toestaat, en cookies gaan alleen naar de eigen origin van de pagina. Een relatieve URL wordt opgelost ten opzichte van de pagina.  
Het antwoord moet een document bevatten zoals een `.erd.json`-bestand dat doet, de opslagvorm die de [value](./erd-editor-element.md#value) van de editor en elke officiële host schrijft. Geen ander formaat wordt gelezen: een SQL-, GraphQL-, DBML- of AML-bestand mislukt als tekst die niet te parseren is.  
Een document dat wordt geparseerd, komt passend in de weergave terecht en verstuurt [load](#load). Een verzoek dat het netwerk of CORS weigerde, een antwoord dat niet `ok` is, of tekst die niet te parseren is, verstuurt [error](#error) en laat een leeg diagram achter — zie [Laden](#loading).

Alleen het laatste verzoek telt. Een nieuwe `src` breekt het nog lopende ophalen af, zodat een traag antwoord nooit over een later document terechtkomt. Het toewijzen van [value](#value) breekt het ook af, en dat doet het verwijderen van `src` of het op `''` zetten ook, wat ophoudt het te volgen en het getoonde document laat zoals het was.  
Welke van `value` en `src` het laatst is ingesteld, wint, via de eigenschap of het attribuut. Een `src` die na een `value` is geschreven, wordt opgehaald, ook wanneer hij de eerder opgehaalde URL noemt. Opnieuw geschreven over het document dat hij al toont, haalt hij niets op.  
De viewer haalt alleen op terwijl hij in een pagina staat. Hem eruit halen breekt een nog lopend ophalen af, en hem terugzetten haalt een `src` op die hij nog niet heeft getoond, een mislukte inbegrepen, nooit een die hij al toont.  
`src` is de enige `fetch()` die het pakket doet, dus een strikt Content Security Policy noemt de origin van het document in `connect-src`.

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

Haalt het getoonde document op, of het nu uit `src` of `value` kwam, als JSON-string in de opslagvorm die de [value](./erd-editor-element.md#value) van de editor schrijft. Voordat er iets wordt getoond, is het een nieuw, leeg document, waarvan `doc` `{}` is.  
Zolang de [vergrendeling](../guide/guides/settings.md#lock) `Viewport` van het document aanstaat, zoals in een nieuw document, schrijft het de zoom en scroll waarop het document is vergrendeld, waar de lezer de weergave ook heen heeft verplaatst. Alleen met die vergrendeling uit schrijft het waar de weergave staat, de passing van een landing inbegrepen.  
Het schrijft de naamweergave die het document bevat, nooit die welke [nameView](#nameview) of de besturingsbalk eroverheen toont, ook in een document waarvan de vergrendeling `Name View` uitstaat.  
Het geeft het document ook na [destroy](#destroy) nog terug.

```js
const data = viewer.value;
```

### setter {#setter}

Toont een document vanuit zijn tekst, vervangt het getoonde en past het in de weergave — zie [Laden](#loading). Het neemt de tekst die een bestand of de `value` van de editor bevat.  
Tekst die niet te parseren is, gooit voordat er iets verandert, en het getoonde document blijft: een `SyntaxError` voor tekst die geen JSON is, een `TypeError` voor JSON die geen document bevat, zoals `7`. Een lege string, of iets wat geen string is, toont een leeg diagram.  
Het toewijzen ervan breekt een nog lopend ophalen van `src` af, en verstuurt noch `load` noch `error`.

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

Toont het diagram in een [naamweergave](../guide/guides/logical-names.md#name-view) boven die welke het document bevat: `'physical'` voor `Physical Names`, `'logical'` voor `Logical Names` of `'both'` voor `Both Names`. `null`, de standaardwaarde, toont die van het document zelf, en een attribuutwaarde anders dan de drie wordt gelezen als `null`.  
Het blijft van kracht boven elk document dat erna wordt geladen, en [value](#value) schrijft het nooit. Het attribuut verwijderen gaat terug naar de eigen weergave van het document.  
De lijst `Name View` op de [besturingsbalk](#controls) wisselt de weergave ook, totdat het volgende document landt of `nameView` weer verandert. Een wissel daar wordt ook niet naar `value` geschreven.

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

Toont de minimap in de rechterbovenhoek, zolang het document een tabel, een getoonde memo of een getoonde tabelgroep bevat. Hij staat standaard aan.  
Hij werkt zoals die van de editor: klik erop om de weergave daarheen te verplaatsen, of sleep zijn viewportrechthoek om te pannen — zie [Navigeren op het canvas](../guide/guides/table-related-functions.md#getting-around-the-canvas). Een vinger erop is van de pagina totdat de viewer de focus heeft.  
Alleen `minimap="false"` zet hem uit. Een attribuut zonder waarde, elke andere waarde en geen attribuut laten hem allemaal aan.

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

Toont de besturingsbalk over het midden van de onderrand van het canvas. Hij staat standaard aan en bevat, van links naar rechts:

- De zoom: `Zoom out`, het huidige zoomniveau als percentage en `Zoom in`. De twee knoppen wijzigen het zoomniveau stapsgewijs zoals de zoomtoetsen doen, en een klik op het percentage, `Reset zoom`, zet het terug op `100%`. Elk noemt zijn toets in zijn knopinfo.
- `Fit`, dat zoomt en scrolt zodat het hele diagram gecentreerd in de weergave past.
- `Name View`, een knop die de geldende weergave noemt en een lijst met `Physical Names`, `Logical Names` en `Both Names` boven de balk opent — zie [nameView](#nameview).
- Het kompas `Go to content`, dat zich alleen aan het einde van de balk voegt zolang niets van het diagram in beeld is, en de weergave naar het dichtstbijzijnde deel ervan brengt.

De balk staat in elke taal van links naar rechts.  
Alleen `controls="false"` zet hem uit, met zijn kompas en zijn lijst `Name View` erbij. Een attribuut zonder waarde, elke andere waarde en geen attribuut laten hem allemaal aan. Zonder de balk zoomen het wiel, een knijpbeweging en de toetsen nog steeds zodra de viewer de focus heeft.

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Event {#event}

`load` en `error` zijn de enige twee events, en beide rapporteren over `src`. Geen van beide borrelt op, dus luister op het element zelf.

### load {#load}

Wordt verstuurd zodra het document dat `src` noemt is opgehaald en getoond. `event.detail` is `null`.  
Het toewijzen van `value` verstuurt er geen, en een ophaalactie die een latere `src`, een `value`, het uit de pagina halen van het element of [destroy](#destroy) heeft afgebroken ook niet.

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

Wordt verstuurd wanneer het ophalen van `src` mislukt: het netwerk of CORS weigerde het verzoek, het antwoord was niet `ok`, of de tekst was niet te parseren. De viewer toont dan een leeg diagram en de melding `Couldn't load the diagram` — zie [Laden](#loading).  
`event.detail` is de oorzaak: de `TypeError` waarmee `fetch()` wordt afgewezen, een `Error` die de status noemt, zoals `GET /missing.erd.json answered 404 Not Found`, of de `SyntaxError` of `TypeError` van de parser.  
Een ophaalactie die iets heeft afgebroken, verstuurt niets.

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

Stelt een vooraf ingesteld thema in en neemt de `ThemeOptions` van de editor — zie [setPresetTheme](./erd-editor-element.md#setpresettheme).  
De viewer begint met `appearance: 'system'`, `grayColor: 'slate'` en `accentColor: 'indigo'`, zodat hij vanaf zijn eerste frame het lichte of donkere uiterlijk toont dat het besturingssysteem meldt, en wisselt wanneer dat verandert. De editor begint in plaats daarvan donker.  
Elk veld wordt los toegepast, dus een gedeeltelijke aanroep laat de andere twee zoals ze zijn. Een waarde die niet een van de namen is, wordt genegeerd, en de aanroep gooit nooit.  
De viewer heeft geen themabouwer en geen `systemDarkMode`, en verstuurt geen event voor een thema.

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

Noemt het lichte of donkere uiterlijk dat het uiterlijk `'system'` toont, voor een pagina met een eigen licht en donker. Zolang er een is genoemd, worden de wijzigingen van het besturingssysteem genegeerd.  
`null`, of een andere waarde dan `'dark'` of `'light'`, gaat terug naar het volgen van het besturingssysteem.  
Zolang het uiterlijk `'light'` of `'dark'` is, verandert het niets op het scherm, maar de waarde wordt bewaard en geldt zodra het uiterlijk `'system'` wordt. Het verstuurt niets.

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

Overschrijft themasleutels bovenop het vooraf ingestelde thema en neemt de `Theme`-sleutels van de editor — zie [setTheme](./erd-editor-element.md#settheme).  
Elke aanroep vervangt de hele overlay, dus geef `{}` door om terug te vallen op het vooraf ingestelde thema. Alleen de sleutelnamen, met stringwaarden, blijven bewaard, en een latere `setPresetTheme` wisselt het vooraf ingestelde thema eronder terwijl de overschrijvingen blijven.  
De CSS-variabelen `--erd-editor-*` bereiken de viewer ook, ingesteld op het element of ergens erboven — zie [CSS-variabelen](./erd-editor-element.md#css-variables). Het canvas, dat geen enkel stylesheet bereikt, leest ze opnieuw wanneer een stylesheet in de `head` van de pagina verandert, of wanneer het attribuut `class` of `style` van het element of van een element erboven verandert. Een regel die met `insertRule()` is toegevoegd, verandert niets van dit alles, dus het canvas pakt hem bij de volgende zulke wijziging op.

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

Stelt de weergavetaal in: `'system'`, de standaardwaarde, of een van de 25 codes die de [Weergavetaal](./erd-editor-element.md#display-language) van de editor noemt. Al het andere, zoals een kale `'ko'` of een waarde die geen string is, wordt genegeerd.  
De taal verandert de knopinfo van de besturingsbalk, de lijst `Name View`, het palet, de laadmeldingen en de woorden die het diagram zelf tekent, zoals `unnamed`. Namen, opmerkingen en de rest van het document worden nooit vertaald.

Engels maakt deel uit van het ingangspunt van de viewer en geldt voordat de aanroep terugkeert. Elke andere taal is een eigen module, die je bundler als chunk naast de viewer uitgeeft en die de viewer uit je bundle ophaalt de eerste keer dat een pagina om die taal vraagt, één keer voor alle viewers van de pagina. Totdat ze binnen is, blijft de viewer de taal tonen die hij toonde, Engels op een eerste frame. Mislukt het laden, dan toont de viewer Engels, en opnieuw om die taal vragen probeert het opnieuw.  
De [scripttag](./installation.md#script-tag)-build bevat alle 25 talen, dus hij haalt er geen op. Een bundle die ook de editor bevat, laadt elke taal met de chunk van de editor — zie [De elementen registreren](./installation.md#registering-the-elements).  
De `Promise` die het teruggeeft, wordt vervuld zodra die taal is binnengekomen of dat niet is gelukt, en wordt nooit afgewezen. Die taal, of Engels na een mislukking, geldt dan, tenzij een latere aanroep om een andere vroeg: de latere aanroep wint, in welke volgorde de talen ook binnenkomen.

Hebreeuws, Arabisch en Perzisch leggen het palet en de laadmeldingen van rechts naar links uit. Het canvas, de minimap, de schuifbalken en de besturingsbalk met zijn kompas blijven van links naar rechts, zoals het canvas van de editor — zie [Talen van rechts naar links](../guide/guides/language-and-theme.md#right-to-left-languages).  
De viewer zet `lang` en `dir` op zijn eigen root binnen de gesloten shadow root, nooit op het hostelement of de pagina.  
Hij verstuurt niets, en de viewer heeft geen taalkiezer en slaat niets op.

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

Noemt de taal waar `'system'` voor staat, als BCP 47-tag, voor een pagina met een eigen taalinstelling.  
De tag wordt getrimd. `null`, een lege string of een waarde die geen string is, gaat terug naar de talen van de pagina.  
Dat zijn de `<html lang>` van de pagina, dan de `navigator.languages` van de browser, één keer gelezen wanneer de viewer voor het eerst verbindt. `'system'` neemt de eerste ervan waarvoor de viewer een taal heeft, volgens de regel van de editor in [setSystemLocale](./erd-editor-element.md#setsystemlocale), en Engels wanneer hij er geen van heeft. Een pagina waarvan `<html lang>` een taal noemt die de viewer heeft, toont dus die taal wat de browser ook verkiest, en een latere wijziging van `lang` of van de talen van de browser verplaatst geen enkele viewer.  
Het doet er alleen toe zolang de geldende optie `'system'` is, en zijn `Promise` wordt vervuld zoals die van [setLocale](#setlocale).

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

Beëindigt de viewer voorgoed. Hij haalt de weergave neer voordat hij terugkeert, of het element nog in de pagina staat of er eerst uit is gehaald, breekt een nog lopend ophalen van `src` af, en houdt op het kleurenschema van het besturingssysteem en de stijlen van de pagina te volgen.  
Een vernietigde viewer tekent niets meer, haalt niets op en vraagt om geen taal, ook wanneer hij opnieuw aan een pagina wordt toegevoegd. [value](#value) lezen geeft nog steeds het document terug dat hij bevatte.  
Het element uit de pagina halen vernietigt het niet: teruggezet gaat het verder, en haalt het een `src` op die het nog niet heeft getoond — zie [Laden](#loading).

```js
viewer.destroy();
```

## Focus en toetsen {#focus-and-keys}

Een viewer neemt geen focus wanneer hij koppelt, wanneer er een document landt of wanneer zijn palet sluit, dus hij scrolt de pagina nooit naar zichzelf en neemt de toetsen van de pagina niet over.  
Een klik of tik op zijn canvas geeft hem de focus zonder de pagina te scrollen, en hij is één stop van de toets `Tab`. Anders dan de editor heeft hij geen eigen lid `focus()` of `blur()`. Een druk ergens anders op de pagina neemt de focus weer weg.

Totdat de viewer de focus heeft, houdt de pagina het wiel, dat de pagina scrolt, en een knijpbeweging op een trackpad. Een vinger op het canvas scrolt de pagina en pant niets, en elke toets bereikt de pagina ongeblokkeerd.  
Zodra hij de focus heeft:

- Het wiel pant de weergave, en `Shift + Wheel` pant hem zijwaarts. Boven een memo waarvan de tekst overloopt, scrolt het wiel de memo.
- `Ctrl + Wheel` (Windows/Linux) of `⌘ + Wheel` (Mac), een knijpbeweging op een trackpad of twee vingers op een aanraakscherm zoomen.
- Een vinger pant de weergave.
- `Ctrl + Plus` en `Ctrl + Minus` (Windows/Linux) of `⌘ + Plus` en `⌘ + Minus` (Mac) wijzigen het zoomniveau stapsgewijs zoals de knoppen `Zoom in` en `Zoom out`, en `Ctrl + 0` (Windows/Linux) of `⌘ + 0` (Mac) gaat direct terug naar `100%`, met het midden van het scherm op zijn plaats.
- `Ctrl + K` (Windows/Linux) of `⌘ + K` (Mac) opent het palet, en `Esc` sluit het.

Dat zijn zijn enige toetsen, en ze kunnen niet opnieuw worden toegewezen. Elke andere toets bereikt de pagina ongeblokkeerd, met of zonder focus: `Delete`, `Backspace`, `Space`, `Enter`, `Tab`, `Ctrl + A`, `Ctrl + F` en elke toetscombinatie die in de editor bewerkt.

Het palet doorzoekt alleen het document en toont geen opdrachten. Zijn lege invoer toont de voorvoegsels: `#` zoekt de tabellen, `@` de kolommen, `:` de opmerkingen en memo's, en `?` toont de voorvoegsels, zoals in de editor — zie [Het diagram doorzoeken](../guide/guides/quick-search.md#searching-the-diagram). Een woord zonder voorvoegsel toont `No commands match` boven de rijen die het diagram ernaar doorzoeken.  
Een rij kiezen verplaatst de weergave volgens de regel van de editor, [Waar een sprong terechtkomt](../guide/guides/table-related-functions.md#where-a-jump-lands), met het zoomniveau ongewijzigd, en omlijnt wat het bereikte, naar voren gebracht: de tabel, de tabel die de kolom of opmerking bevat, of de memo.  
Een rij kiezen of op `Esc` drukken sluit het palet en laat de focus bij geen enkel element, dus het volgende wiel scrolt de pagina; klik op de weergave om hem het wiel en de toetsen weer te geven. Zolang het palet openstaat, scrolt het wiel de lijst ervan, en doen de zoomtoetsen niets.

Met of zonder focus pant een sleepbeweging met de hoofdmuisknop de weergave vanaf elke plek op het canvas, ook over een tabel. Een klik of tik die niet beweegt, laat relaties oplichten: op een tabel de relaties van die tabel; op een relatielijn die lijn; overal anders, een memo inbegrepen, dooft hij het licht. Zo'n klik wist ook de omlijning die een sprong via het palet achterliet. De aanwijzer die op een tabel rust, laat zijn relaties oplichten zolang hij er staat.  
Geen enkele druk selecteert, verplaatst of bewerkt iets. Er is geen selectie behalve de omlijning van een sprong, geen selectiekader, en geen dubbelklik of `Enter` opent een cel.

## Laden {#loading}

Terwijl `src` laadt, staat er over het midden van het canvas een melding `Loading diagram` naast een draaiende lader. Zodra het laden mislukt, staat er `Couldn't load the diagram` naast een waarschuwingsteken, totdat een nieuwe `src` of een `value` de plaats inneemt of `src` wordt verwijderd. Drukken gaat door de melding heen naar het canvas, en ze staat in de weergavetaal, van rechts naar links in een taal van rechts naar links.

Elk document dat landt, uit `src` of uit `value`, wordt in het vak van de viewer gepast: gezoomd en gescrolld zodat het hele diagram gecentreerd past, zoals `Fit` doet, waarbij de zoom en scroll die het bestand opsloeg opzij blijven. Een document dat wordt overgedragen voordat de viewer een grootte heeft, ingesteld voordat hij in een pagina staat of terwijl zijn vak leeg is, wordt gepast zodra hij er een heeft. Een latere grootteverandering behoudt het zoomniveau; `Fit` past opnieuw.

De viewer haalt een `src` alleen op terwijl hij in een pagina staat. Hem eruit halen breekt een nog lopend ophalen af, en hem terugzetten haalt een `src` op die hij nog niet heeft getoond, een mislukte inbegrepen, nooit een die hij al toont. Een viewer die niet meer nodig is, wordt beëindigd met [destroy](#destroy).

## Wat het aan een pagina toevoegt {#what-it-adds-to-a-page}

- Geen worker. Hij start er geen, dus een Content Security Policy heeft er geen `worker-src` voor nodig.
- Geen opslag. Hij schrijft geen cookie, `localStorage`, `sessionStorage` of IndexedDB.
- Twee soorten verzoeken: het ophalen van [src](#src), waarvan een strikt beleid de origin in `connect-src` noemt, en de module van een andere weergavetaal dan Engels, uit je eigen bundle — zie [setLocale](#setlocale).
- Stijlen in constructed stylesheets, die een strikte `style-src` doorlaat. Een browser zonder constructed stylesheets, zoals Firefox vóór 101, krijgt in plaats daarvan `<style>`-elementen, die `style-src 'unsafe-inline'` nodig hebben.
- Listeners op `window`. Het importeren van het ingangspunt voegt er drie toe voor de levensduur van de pagina, voor `mousedown`, `touchstart` en het eigen event `@dineug/erd-editor/internal-forward-move-start` van het pakket. Konva, dat het canvas tekent, zet `window.Konva` en voegt met zijn eerste stage muis- en aanraaklisteners toe aan `window` en een `visibilitychange`-listener aan `document`, die hij nooit verwijdert. Het ingangspunt van de editor voegt dezelfde toe.
- Tot [destroy](#destroy) volgt elke viewer het kleurenschema van het besturingssysteem en let hij op de stijlen van de pagina voor de aangepaste eigenschappen die [setTheme](#settheme) beschrijft.
