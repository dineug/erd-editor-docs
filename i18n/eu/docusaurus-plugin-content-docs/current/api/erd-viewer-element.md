---
sidebar_position: 3
description: "erd-viewer elementuaren APIa: irakurtzeko soilik dagoen diagrama bat value edo src URL batetik, minimapa eta kontrol-barra, load eta error gertaerak, gaiak, bistaratze-hizkuntza, fokua eta teklak, kargatzea, eta orri bati zer gehitzen dion."
---

# ErdViewerElement

`5.0.0` bertsiotik aurrera, paketeak `<erd-viewer>` ere badakar, dokumentu baten irakurtzeko soilik dagoen ikuspegia: irakurle batek diagrama mugitu, zoomarekin handitu, bilatu eta erlazioak piztu ditzake, eta bertan ezerk ez du editatzen. ERD oihala bakarrik marrazten du, bere korritze-barrekin, [minimapa](#minimap), [kontrol-barra](#controls) eta dokumentua bilatzen duen paleta batekin, eta ez du tresna-barrarik, fitxarik, Arakatzailerik ez laster-menurik.

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Goiko markoak elementu hau erakusten du erd-editor.io/embed helbideak erakusten duen bezala, hemen bookstore adibidearekin: egin klik fokuratzeko, eta gero egin zoom eta bilaketa [Fokua eta teklak](#focus-and-keys) atalean zerrendatutako teklekin; zure dokumentu bat koderik gabe txertatzeko, ikus [Txertatzea](../guide/guides/embedding.md).

Ikustailea `HTMLElement` arrunt bat da.  
Haren mota-definizioa honako hau da.

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

`@dineug/erd-editor/erd-viewer.js` inportatzeak `<erd-viewer>` definitzen du eta `<erd-editor>` definitu gabe uzten du. Paketearen erroa inportatzeak ez du bat ere definitzen: `ErdViewerElement` klasea eta `defineErdViewer()` esportatzen ditu, zeinak deitzen duzun tokian definitzen duen etiketa; beraz, orri batek klasea bere etiketa propio baten pean ere defini dezake. Ikus [Elementuak erregistratzea](./installation.md#registering-the-elements).  
`engine.js` eta `peer.js` ez diren sarrera guztiek DOM bat behar dute, hau ere bai; beraz, zerbitzarian errendatutako orri batek bezeroan inportatzen du. Ikus [Zerbitzari aldeko errendatzea](./installation.md#server-side-rendering).  
Sarrera inportatzeak `erd-viewer` gehitzen du `HTMLElementTagNameMap` interfazera; beraz, `document.createElement('erd-viewer')` eta `document.querySelector('erd-viewer')` deiak `ErdViewerElement` motakoak dira mota-bihurketarik gabe.

Editorea bezala, ikustaileak shadow root itxi batean errendatzen du; beraz, `viewer.shadowRoot` `null` da eta orriaren estiloak ez dira barrura ez kanpora iragazten; eman estiloa [setTheme](#settheme) eta `--erd-editor-*` propietate pertsonalizatuen bidez. Orri bateko hainbat ikustailek bakoitzak bere dokumentua, ikuspegia, gaia eta hizkuntza mantentzen ditu.  
`<erd-viewer>` elementuak ez du berezko tamainarik. Elementu pertsonalizatu bat lerrokoa da, beraz eman `display: block` eta altuera bat, goian bezala. Ikuspegiak elementuaren kutxa betetzen du eta hura tamainaz aldatzen den heinean jarraitzen dio, zooma mantenduz.

`src`, `name-view`, `minimap` eta `controls` dira bere atributu bakarrak, bakoitzak izen bereko propietate bat duela, `nameView` `name-view` atributuarentzat. [value](#value) propietate hutsa da.  
Etiketa definitu aurretik elementuan ezarritako `value`, `src`, `nameView`, `minimap` edo `controls` propietate bat, adibidez sarrera kargatu aurretik elementua errendatzen duen esparru batek ezarria, etiketa definitzen denean hartzen da, markaketak eman dizkion atributuen gainetik. Orriak bakoitza lehen aldiz idatzi zuen ordenan hartzen dira; beraz, `value` eta `src` artean azkena irabazten du. Dokumenturik ez duen `value` batek orduan ez du jaurti beharreko deitzailerik: atzemandako errore gisa jakinarazten da, eta ikustailea hutsik geratzen da.

Script etiketako konpilazioak, `dist/erd-viewer.umd.js`, ikustailea bakarrik darama mendekotasun guztiekin. `<erd-viewer>` definitzen du eta `ErdViewerElement` eta `defineErdViewer` `window.ErdViewer` objektuan jartzen ditu. Biderik gabeko CDN URL batek editorearen konpilazioa zerbitzatzen du, beraz izendatu fitxategia. Ikus [Script etiketa](./installation.md#script-tag).

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

Ikustaileak eskuratu eta erakutsi beharreko dokumentu baten URLa. Lehenespenez `''` da, hau da, bat ere ez.  
Eskuratzea `fetch()` arrunt bat da, bere aukera propiorik gabeko `GET` bat; beraz, nabigatzailearen CORS arauek gobernatzen dute: beste jatorri bateko dokumentu batek orriaren jatorria onartzen duen zerbitzari bat behar du, eta cookieak orriaren jatorri propiora soilik doaz. URL erlatibo bat orriaren arabera ebazten da.  
Erantzunak `.erd.json` fitxategi batek duen bezalako dokumentu bat izan behar du, editorearen [value](./erd-editor-element.md#value) propietateak eta ostalari ofizial guztiek idazten duten biltegiratze-forma. Ez da beste formaturik irakurtzen: SQL, GraphQL, DBML edo AML fitxategi batek huts egiten du, analizatzen ez den testu gisa.  
Analizatzen den dokumentu bat ikuspegira doituta kokatzen da eta [load](#load) igortzen du. Sareak edo CORS arauek ukatutako eskaera batek, `ok` ez den erantzun batek edo analizatzen ez den testu batek [error](#error) igortzen du eta diagrama hutsik uzten du. Ikus [Kargatzea](#loading).

Azken eskaerak bakarrik balio du. `src` berri batek oraindik martxan dagoen eskuratzea bertan behera uzten du, eta horrela erantzun geldo batek ez du inoiz geroagoko dokumentu baten gainean ezartzen. [value](#value) esleitzeak ere bertan behera uzten du, eta baita `src` kentzeak edo `''` ezartzeak ere, zeinak jarraitzea uzten duen eta erakutsitako dokumentua dagoen bezala uzten duen.  
`value` eta `src` artean azkenekoz ezarritakoak irabazten du, propietatearen bidez zein atributuaren bidez. `value` baten ondoren idatzitako `src` bat eskuratu egiten da lehen eskuratutako URL bera izendatzen badu ere. Dagoeneko erakusten duen dokumentuaren gainean berriro idatzita, ez du ezer eskuratzen.  
Ikustaileak orri batean dagoen bitartean bakarrik eskuratzen du. Ateratzeak oraindik martxan dagoen eskuratzea bertan behera uzten du, eta berriro jartzeak erakutsi ez duen `src` bat eskuratzen du, huts egindakoa barne, eta inoiz ez dagoeneko erakusten duena.  
`src` paketeak egiten duen `fetch()` bakarra da; beraz, Eduki-segurtasuneko politika zorrotz batek dokumentuaren jatorria `connect-src` direktiban zerrendatzen du.

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

Erakutsitako dokumentua berreskuratzen du, `src` edo `value` bidez etorri dela ere, editorearen [value](./erd-editor-element.md#value) propietateak idazten duen biltegiratze-formako JSON kate gisa. Ezer erakutsi aurretik dokumentu berri eta huts bat da, zeinaren `doc` `{}` den.  
Dokumentuaren `Viewport` [blokeoa](../guide/guides/settings.md#lock) aktibatuta dagoen bitartean, dokumentu berri batean bezala, dokumentua blokeatuta dagoen zooma eta korritzea idazten ditu, irakurleak ikuspegia nonahi mugitu duela ere. Blokeo hori desaktibatuta dagoenean bakarrik idazten du ikuspegia non dagoen, kokatzeak egiten duen doitzea barne.  
Dokumentuak duen Izenen ikuspegia idazten du, inoiz ez [nameView](#nameview) propietateak edo kontrol-barrak haren gainean erakusten duena, `Name View` blokeoa desaktibatuta duen dokumentu batean ere.  
[destroy](#destroy) ondoren ere dokumentua itzultzen du.

```js
const data = viewer.value;
```

### setter {#setter}

Dokumentu bat erakusten du bere testutik, erakutsitakoa ordezkatuz, eta ikuspegira doitzen du. Ikus [Kargatzea](#loading). Fitxategi batek edo editorearen `value` propietateak duen testua hartzen du.  
Analizatzen ez den testuak errore bat jaurtitzen du ezer aldatu aurretik, eta erakutsitako dokumentua geratzen da: `SyntaxError` bat JSON ez den testuarentzat, `TypeError` bat dokumenturik ez duen JSONarentzat, hala nola `7`. Kate huts batek, edo katea ez den ezerk, diagrama huts bat erakusten du.  
Esleitzeak oraindik martxan dagoen `src` eskuratzea bertan behera uzten du, eta ez du `load` ez `error` igortzen.

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

Diagrama [Izenen ikuspegi](../guide/guides/logical-names.md#name-view) batean erakusten du dokumentuak duenaren gainetik: `'physical'` `Physical Names` ikuspegiarentzat, `'logical'` `Logical Names` ikuspegiarentzat, edo `'both'` `Both Names` ikuspegiarentzat. `null`, lehenetsia, dokumentuaren berarena erakusten du, eta hiruetatik kanpoko atributu-balio bat `null` gisa irakurtzen da.  
Ondoren kargatzen den dokumentu guztien gainean indarrean jarraitzen du, eta [value](#value) propietateak ez du inoiz idazten. Atributua kentzeak dokumentuaren berezko ikuspegira itzultzen du.  
[Kontrol-barrako](#controls) `Name View` zerrendak ere ikuspegia aldatzen du, hurrengo dokumentua kokatu arte edo `nameView` hurrengoz aldatu arte. Han egindako aldaketa ere ez da `value` propietatean idazten.

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

Minimapa goiko eskuineko ertzean erakusten du, dokumentuak taula bat, erakutsitako ohar bat edo erakutsitako taula-talde bat duen bitartean. Lehenespenez aktibatuta dago.  
Editorearenak bezala funtzionatzen du: egin klik ikuspegia hara mugitzeko, edo arrastatu bere ikuspegi-laukizuzena mugitzeko. Ikus [Oihalean zehar mugitzea](../guide/guides/table-related-functions.md#getting-around-the-canvas). Hatz bat gainean orriarena da ikustaileak fokua izan arte.  
`minimap="false"` balioak bakarrik desaktibatzen du. Baliorik gabeko atributu batek, beste edozein balio batek eta atributurik ezak aktibatuta uzten dute.

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

Kontrol-barra oihalaren beheko ertzaren erdian erakusten du. Lehenespenez aktibatuta dago, eta ezkerretik eskuinera hauek ditu:

- Zooma: `Zoom out`, uneko zooma ehuneko gisa, eta `Zoom in`. Bi botoiek zooma zoom-teklek bezala aldatzen dute, eta ehunekoan klik egiteak, `Reset zoom`, `100%` baliora itzultzen du. Bakoitzak bere tekla izendatzen du bere argibidean.
- `Fit`, zeinak zoomarekin eta korritzearekin diagrama osoa ikuspegian erakusten duen, zentratuta.
- `Name View`, indarrean dagoen ikuspegia izendatzen duen eta barraren gainean `Physical Names`, `Logical Names` eta `Both Names` zerrenda irekitzen duen botoia. Ikus [nameView](#nameview).
- `Go to content` iparrorratza, barraren amaierari gehitzen zaiona diagramaren ezer pantailan ez dagoen bitartean soilik, eta ikuspegia haren zatirik hurbilenera eramaten duena.

Barra ezkerretik eskuinera dago hizkuntza guztietan.  
`controls="false"` balioak bakarrik desaktibatzen du, bere iparrorratzarekin eta `Name View` zerrendarekin batera. Baliorik gabeko atributu batek, beste edozein balio batek eta atributurik ezak aktibatuta uzten dute. Barrarik gabe, gurpilak, ukitu-keinuak eta teklek zooma egiten dute oraindik ikustaileak fokua duenean.

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Gertaerak {#event}

`load` eta `error` dira bi gertaerak bakarrik, eta biek `src` aipatzen dute. Bietako batek ere ez du burbuilarik egiten; beraz, entzun elementuan bertan.

### load {#load}

`src` elementuak izendatzen duen dokumentua eskuratu eta erakutsi denean igortzen da. `event.detail` `null` da.  
`value` esleitzeak ez du bat ere igortzen, ezta geroagoko `src` batek, `value` batek, elementua orritik ateratzeak edo [destroy](#destroy) metodoak bertan behera utzitako eskuratze batek ere.

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

`src` eskuratzeak huts egiten duenean igortzen da: sareak edo CORS arauek eskaera ukatu dute, erantzuna ez zen `ok`, edo haren testua ez zen analizatu. Ikustaileak orduan diagrama huts bat eta `Couldn't load the diagram` abisua erakusten ditu. Ikus [Kargatzea](#loading).  
`event.detail` kausa da: `fetch()` metodoak baztertzen duen `TypeError`, egoera izendatzen duen `Error` bat, hala nola `GET /missing.erd.json answered 404 Not Found`, edo analizatzailearen `SyntaxError` edo `TypeError`.  
Zerbaitek bertan behera utzitako eskuratze batek ez du ezer igortzen.

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

Aurrez zehaztutako gai bat ezartzen du, editorearen `ThemeOptions` hartuta. Ikus [setPresetTheme](./erd-editor-element.md#setpresettheme).  
Ikustailea `appearance: 'system'`, `grayColor: 'slate'` eta `accentColor: 'indigo'` balioekin hasten da; beraz, lehen markotik sistema eragileak jakinarazten duen argia edo iluna erakusten du, eta hori aldatzen denean aldatzen da. Editorea ilunean hasten da horren ordez.  
Eremu bakoitza bere aldetik aplikatzen da; beraz, dei partzial batek beste biak dauden bezala uzten ditu. Izenetako bat ez den balio bat ez da kontuan hartzen, eta deiak ez du inoiz errorerik jaurtitzen.  
Ikustaileak ez du gai-sortzailerik ez `systemDarkMode` propietaterik, eta ez du gai baterako gertaerarik igortzen.

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

`'system'` itxurak erakusten duen argia edo iluna izendatzen du, bere argi eta ilun propioa duen orri baterako. Bat izendatuta dagoen bitartean, sistema eragilearen aldaketak ez dira kontuan hartzen.  
`null` balioak, edo `'dark'` edo `'light'` ez den beste edozein baliok, sistema eragileari berriro jarraitzera itzultzen du.  
Itxura `'light'` edo `'dark'` den bitartean ez du ezer aldatzen pantailan, baina balioa gordetzen da eta itxura `'system'` bihurtzen den bezain laster aplikatzen da. Ez du ezer igortzen.

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

Gai-tokenak gainidazten ditu aurrez zehaztutako gaiaren gainean, editorearen `Theme` tokenak hartuta. Ikus [setTheme](./erd-editor-element.md#settheme).  
Dei bakoitzak gainjartze osoa ordezten du; beraz, pasatu `{}` aurrez zehaztutako gaira itzultzeko. Token-izenak bakarrik gordetzen dira, kate-balioekin, eta geroagoko `setPresetTheme` batek azpiko gaia aldatzen du gainidazketak mantentzen diren bitartean.  
`--erd-editor-*` CSS propietate pertsonalizatuek ere iristen dute ikustailera, elementuan edo haren gainetik edonon ezarrita. Ikus [CSS aldagaiak](./erd-editor-element.md#css-variables). Oihalak, inongo estilo-orrik iristen ez dena, berriro irakurtzen ditu orriaren `head` elementuko estilo-orri bat aldatzen denean, edo elementuaren edo haren gaineko elementu baten `class` edo `style` atributua aldatzen denean. `insertRule()` bidez gehitutako arau batek ez du horietako bat ere aldatzen; beraz, oihalak hurrengo aldaketa horretan hartzen du.

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

Bistaratze-hizkuntza ezartzen du: `'system'`, lehenetsia, edo editorearen [Bistaratze-hizkuntza](./erd-editor-element.md#display-language) zerrendak ematen dituen 25 kodeetako bat. Beste edozer, hala nola `'ko'` soila edo katea ez den balio bat, ez da kontuan hartzen.  
Hizkuntzak kontrol-barraren argibideak, `Name View` zerrenda, paleta, kargatze-abisuak eta diagramak berak marrazten dituen hitzak aldatzen ditu, hala nola `unnamed`. Izenak, iruzkinak eta dokumentuaren gainerakoa ez dira inoiz itzultzen.

Ingelesa ikustailearen sarreraren parte da eta deiak itzuli baino lehen aplikatzen da. Beste hizkuntza bakoitza bere moduluan dago, zure paketatzaileak ikustailearen ondoko chunk gisa sortzen duena, eta ikustaileak zure bundletik eskuratzen du orri batek hizkuntza hori lehen aldiz eskatzen duenean, orriko ikustaile guztientzat behin. Iritsi arte, ikustaileak erakusten zuen hizkuntza erakusten jarraitzen du, lehen markoan ingelesa. Kargatzeak huts egiten badu, ikustaileak ingelesa erakusten du, eta hizkuntza hori berriro eskatzeak berriro saiatzen da.  
[Script etiketako](./installation.md#script-tag) konpilazioak 25 hizkuntzak ditu; beraz, ez du bat ere eskuratzen. Editorea ere duen bundle batek hizkuntza guztiak kargatzen ditu editorearen chunkarekin. Ikus [Elementuak erregistratzea](./installation.md#registering-the-elements).  
Itzultzen duen `Promise` hizkuntza hori iritsi edo iristeak huts egin duenean ebazten da, eta ez du inoiz baztertzen. Hizkuntza hori, edo ingelesa huts egin ondoren, orduan indarrean dago, geroagoko dei batek beste bat eskatu ez badu: geroagoko deiak irabazten du, hizkuntzak iristen diren ordena edozein dela ere.

Hebreerak, arabierak eta persierak paleta eta kargatze-abisuak eskuinetik ezkerrera antolatzen dituzte. Oihalak, minimapak, korritze-barrek eta kontrol-barrak bere iparrorratzarekin ezkerretik eskuinera geratzen dira, editorearen oihalak bezala. Ikus [Eskuinetik ezkerrera idazten diren hizkuntzak](../guide/guides/language-and-theme.md#right-to-left-languages).  
Ikustaileak `lang` eta `dir` ezartzen ditu shadow root itxiaren barruko bere erroan, inoiz ez ostalari-elementuan edo orrian.  
Ez du ezer igortzen, eta ikustaileak ez du hizkuntza-hautatzailerik eta ez du ezer gordetzen.

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

`'system'` aukerak adierazten duen hizkuntza izendatzen du, BCP 47 etiketa gisa, bere hizkuntza-ezarpen propioa duen orri baterako.  
Etiketa moztu egiten da. `null` balioak, kate huts batek edo katea ez den balio batek orriaren hizkuntzetara itzultzen du.  
Hizkuntza horiek orriaren `<html lang>` dira, eta ondoren nabigatzailearen `navigator.languages`, behin irakurrita, ikustailea lehen aldiz konektatzen denean. `'system'` aukerak ikustaileak hizkuntza bat duen lehenengoa hartzen du, editorearen arauaren arabera, [setSystemLocale](./erd-editor-element.md#setsystemlocale) atalean, eta ingelesa bat ere ez duenean. Beraz, `<html lang>` balioak ikustaileak duen hizkuntza bat izendatzen duen orri batek hizkuntza hori erakusten du nabigatzaileak nahiago duena edozein dela ere, eta `lang` edo nabigatzailearen hizkuntzen geroagoko aldaketa batek ez du ikustailerik mugitzen.  
Indarrean dagoen aukera `'system'` den bitartean bakarrik axola du, eta bere `Promise` objektua [setLocale](#setlocale) metodoarena bezala ebazten da.

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

Ikustailea behin betiko amaitzen du. Ikuspegia itzuli baino lehen kentzen du, elementua oraindik orrian egon ala lehenago atera den, oraindik martxan dagoen `src` eskuratzea bertan behera uzten du, eta sistema eragilearen kolore-eskema eta orriaren estiloak jarraitzeari uzten dio.  
Suntsitutako ikustaile batek ez du ezer gehiago marrazten, ez du ezer eskuratzen, eta ez du hizkuntzarik eskatzen, orri batera berriro gehitu arren. [value](#value) irakurtzeak oraindik duen dokumentua itzultzen du.  
Elementua orritik ateratzeak ez du suntsitzen: berriro jarrita, jarraitzen du, eta oraindik erakutsi ez duen `src` bat eskuratzen du. Ikus [Kargatzea](#loading).

```js
viewer.destroy();
```

## Fokua eta teklak {#focus-and-keys}

Ikustaileak ez du fokurik hartzen muntatzean, dokumentu bat kokatzean edo bere paleta ixtean; beraz, ez du inoiz orria bere buruarengana korritzen ez orriaren teklak hartzen.  
Bere oihalean egindako klik edo ukitu batek orria korritu gabe fokuratzen du, eta `Tab` teklaren geldialdi bat da. Editorea ez bezala, ez du berezko `focus()` edo `blur()` kiderik. Orriko beste edonon egindako sakatze batek fokua kentzen du berriro.

Ikustaileak fokua izan arte, orriak gurpila gordetzen du, orria korritzen duena, eta trackpad-eko pinch keinua ere bai. Oihalean hatz batek orria korritzen du eta ez du ezer mugitzen, eta tekla guztiak prebenitu gabe iristen dira orrira.  
Fokua duenean:

- Gurpilak ikuspegia mugitzen du, eta `Shift + Wheel` aldeetara. Testua gainez egiten duen ohar baten gainean, gurpilak oharra korritzen du.
- `Ctrl + Wheel` (Windows/Linux) edo `⌘ + Wheel` (Mac), trackpad-eko pinch batek edo ukipen-pantailako bi hatzek zooma egiten dute.
- Hatz batek ikuspegia mugitzen du.
- `Ctrl + Plus` eta `Ctrl + Minus` (Windows/Linux) edo `⌘ + Plus` eta `⌘ + Minus` (Mac) teklek zooma `Zoom in` eta `Zoom out` botoiek bezala aldatzen dute, eta `Ctrl + 0` (Windows/Linux) edo `⌘ + 0` (Mac) teklek zuzenean `100%` baliora itzultzen dute, pantailaren erdia dagoen tokian mantenduz.
- `Ctrl + K` (Windows/Linux) edo `⌘ + K` (Mac) teklek paleta irekitzen dute, eta `Esc` teklak ixten du.

Horiek dira bere tekla bakarrak, eta ezin dira birlotu. Beste tekla guztiak prebenitu gabe iristen dira orrira, fokuratuta egon ala ez: `Delete`, `Backspace`, `Space`, `Enter`, `Tab`, `Ctrl + A`, `Ctrl + F` eta editorean editatzen duten konbinazio guztiak.

Paletak dokumentua bakarrik bilatzen du eta ez du komandorik zerrendatzen. Bere sarrera hutsak aurrizkiak erakusten ditu: `#` taulak bilatzen ditu, `@` zutabeak, `:` iruzkinak eta oharrak, eta `?` aurrizkiak zerrendatzen ditu, editorean bezala. Ikus [Diagraman bilatzea](../guide/guides/quick-search.md#searching-the-diagram). Aurrizkirik gabeko hitz batek `No commands match` erakusten du hura diagraman bilatzen duten errenkaden gainean.  
Errenkada bat aukeratzeak ikuspegia editorearen arauaren arabera mugitzen du, [Jauziaren helmuga](../guide/guides/table-related-functions.md#where-a-jump-lands), zooma dagoen bezala utzita, eta iritsi den elementua ingeradaz markatzen du, aurrealdera ekarrita: taula, zutabea edo iruzkina duen taula, edo oharra.  
Errenkada bat aukeratzeak edo `Esc` sakatzeak paleta ixten du eta fokua elementurik gabe uzten du, hurrengo gurpilak orria korritzen duela; egin klik ikuspegian gurpila eta teklak berriro emateko. Paleta irekita dagoen bitartean, gurpilak bere zerrenda korritzen du, eta zoom-teklek ez dute ezer egiten.

Fokuratuta egon ala ez, saguaren botoi nagusiarekin egindako arrastatze batek ikuspegia mugitzen du oihaleko edonondik, baita taula baten gainean ere. Mugitzen ez den klik edo ukitu batek erlazioak pizten ditu: taula batean, taula horren erlazioak; erlazio-lerro batean, lerro hori; beste edonon, ohar bat barne, argia itzaltzen du. Horrelako klik batek paleta-jauzi batek utzitako ingerada ere garbitzen du. Erakuslea taula baten gainean geldi egoteak haren erlazioak pizten ditu bertan dagoen bitartean.  
Ezein sakatzek ez du ezer hautatzen, mugitzen edo editatzen. Ez dago jauzi baten ingerada besteko hautapenik, ez hautapen-koadrorik, eta klik bikoitzak edo `Enter` teklak ez dute gelaxkarik irekitzen.

## Kargatzea {#loading}

`src` kargatzen ari den bitartean, oihalaren erdiko abisu batek `Loading diagram` dio kargatzaile biraka baten ondoan. Karga batek huts egiten duenean, `Couldn't load the diagram` dio abisu-ikur baten ondoan, `src` berri batek edo `value` batek haren lekua hartu arte, edo `src` kendu arte. Sakatzeak abisutik oihalera pasatzen dira, eta bistaratze-hizkuntzan irakurtzen da, eskuinetik ezkerrera hizkuntza horietan.

Kokatzen den dokumentu bakoitza, `src` edo `value` bidez, ikustailearen kutxara doitzen da: zoomarekin eta korritzearekin diagrama osoa erakusten da, zentratuta, `Fit` botoiak bezala, fitxategiak gordetako zooma eta korritzea alde batera utzita. Ikustailea tamaina izan aurretik emandako dokumentu bat, orri batean egon aurretik edo bere kutxa hutsik dagoen bitartean ezarria, tamaina duenean doitzen da. Geroagoko tamaina-aldaketa batek zooma mantentzen du; `Fit` botoiak berriro doitzen du.

Ikustaileak `src` orri batean dagoen bitartean bakarrik eskuratzen du. Ateratzeak oraindik martxan dagoen eskuratzea bertan behera uzten du, eta berriro jartzeak erakutsi ez duen `src` bat eskuratzen du, huts egindakoa barne, eta inoiz ez dagoeneko erakusten duena. Beharrezkoa ez den ikustaile bat [destroy](#destroy) metodoarekin amaitzen da.

## Zer gehitzen dion orri bati {#what-it-adds-to-a-page}

- Workerrik ez. Ez du bat ere abiarazten; beraz, Eduki-segurtasuneko politika batek ez du `worker-src` behar harentzat.
- Biltegiratzerik ez. Ez du cookierik, `localStorage`, `sessionStorage` ez IndexedDB idazten.
- Bi eskaera mota: [src](#src) eskuratzea, zeinaren jatorria politika zorrotz batek `connect-src` direktiban zerrendatzen duen, eta ingelesa ez den bistaratze-hizkuntza baten modulua, zure bundletik. Ikus [setLocale](#setlocale).
- Estiloak eraikitako estilo-orrietan, `style-src` zorrotz batek uzten dituenak pasatzen. Eraikitako estilo-orririk gabeko nabigatzaile batek, hala nola 101 baino lehenagoko Firefoxek, `<style>` elementuak jasotzen ditu horren ordez, eta horiek `style-src 'unsafe-inline'` behar dute.
- `window` objektuko entzuleak. Sarrera inportatzeak hiru gehitzen ditu orriaren bizitzarako, `mousedown`, `touchstart` eta paketearen `@dineug/erd-editor/internal-forward-move-start` gertaera propioarentzat. Oihala marrazten duen Konva-k `window.Konva` ezartzen du eta, bere lehen stage-arekin, sagu- eta ukipen-entzuleak gehitzen ditu `window` objektuari eta `visibilitychange` entzule bat `document` objektuari, inoiz kentzen ez dituenak. Editorearen sarrerak berberak gehitzen ditu.
- [destroy](#destroy) arte, ikustaile bakoitzak sistema eragilearen kolore-eskema jarraitzen du eta orriaren estiloak zaintzen ditu [setTheme](#settheme) atalak deskribatzen dituen propietate pertsonalizatuengatik.
