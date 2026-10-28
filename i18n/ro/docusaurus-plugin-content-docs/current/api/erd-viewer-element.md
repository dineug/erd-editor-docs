---
sidebar_position: 3
description: API-ul elementului erd-viewer — o diagramă doar în citire dintr-un value sau dintr-un URL src, minihărta și bara de controale, evenimentele load și error, teme, limba de afișare, focusul și tastele, încărcarea și ce adaugă unei pagini.
---

# ErdViewerElement

Începând cu versiunea `5.0.0`, pachetul livrează și `<erd-viewer>`, o vizualizare doar în citire a unui document: un cititor deplasează pânza, face zoom, caută și luminează relații, iar nimic din ea nu editează. Desenează doar pânza ERD, cu barele ei de derulare, o [minihartă](#minimap), o [bară de controale](#controls) și o paletă care caută în document, și nu are bară de instrumente, file, explorator sau meniu contextual.

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Cadrul de mai sus este acest element așa cum îl arată erd-editor.io/embed, aici cu exemplul bookstore: faceți clic pe el pentru a-i da focus, apoi măriți și căutați cu tastele din [Focus și taste](#focus-and-keys) și consultați [Încorporare](../guide/guides/embedding.md) pentru a încadra fără cod un document al dumneavoastră.

Viewerul este un `HTMLElement` obișnuit.  
Definiția sa de tip este următoarea.

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

Importul `@dineug/erd-editor/erd-viewer.js` definește `<erd-viewer>` și lasă `<erd-editor>` nedefinit. Importul rădăcinii pachetului nu definește niciunul: exportă clasa `ErdViewerElement` și `defineErdViewer()`, care definește eticheta acolo unde o apelați, așa că o pagină poate defini clasa și sub o etichetă proprie (consultați [Înregistrarea elementelor](./installation.md#registering-the-elements)).  
Fiecare punct de intrare în afară de `engine.js` și `peer.js` are nevoie de un DOM, și acesta la fel, așa că o pagină redată pe server îl importă pe client (consultați [Redare pe server](./installation.md#server-side-rendering)).  
Importul punctului de intrare adaugă `erd-viewer` în `HTMLElementTagNameMap`, așa că `document.createElement('erd-viewer')` și `document.querySelector('erd-viewer')` sunt tipizate `ErdViewerElement` fără conversie explicită.

Ca editorul, viewerul se redă într-un shadow root închis, așa că `viewer.shadowRoot` este `null`, iar stilurile paginii nu pătrund înăuntru și nu ies afară; îl stilizați prin [setTheme](#settheme) și prin proprietățile personalizate `--erd-editor-*`. Mai multe viewere pe aceeași pagină își păstrează fiecare propriul document, propria vizualizare, temă și limbă.  
`<erd-viewer>` nu are o dimensiune intrinsecă. Un element personalizat este în linie, așa că dați-i `display: block` și o înălțime, ca mai sus. Vizualizarea umple caseta elementului și o urmează când se redimensionează, păstrându-și zoomul.

`src`, `name-view`, `minimap` și `controls` sunt singurele sale atribute, fiecare cu o proprietate cu același nume, `nameView` pentru `name-view`. [value](#value) este doar o proprietate.  
Un `value`, `src`, `nameView`, `minimap` sau `controls` setat pe element înainte ca eticheta lui să fie definită, de exemplu de un framework care redă elementul înainte să se fi încărcat punctul de intrare, este preluat după ce eticheta este definită, peste atributele date de marcaj. Sunt preluate în ordinea în care pagina le-a scris prima dată, așa că cel mai recent dintre `value` și `src` se impune. Un `value` care nu conține niciun document nu mai are atunci un apelant căruia să-i arunce o excepție: este raportat ca eroare necaptată, iar viewerul rămâne gol.

Versiunea pentru eticheta script, `dist/erd-viewer.umd.js`, conține doar viewerul, cu toate dependențele. Definește `<erd-viewer>` și pune `ErdViewerElement` și `defineErdViewer` pe `window.ErdViewer`. Un URL de CDN fără cale servește în schimb versiunea editorului, așa că numiți fișierul (consultați [Eticheta script](./installation.md#script-tag)).

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

URL-ul unui document pe care viewerul îl preia și îl arată. Implicit este `''`, adică niciunul.  
Preluarea este un `fetch()` simplu, un `GET` fără opțiuni proprii, așa că regulile CORS ale browserului o guvernează: un document de pe altă origine are nevoie de un server care permite originea paginii, iar cookie-urile merg doar la originea proprie a paginii. Un URL relativ se rezolvă față de pagină.  
Răspunsul trebuie să conțină un document așa cum îl conține un fișier `.erd.json`, adică forma de stocare pe care o scriu [value](./erd-editor-element.md#value) al editorului și fiecare gazdă oficială. Niciun alt format nu este citit: un fișier SQL, GraphQL, DBML sau AML eșuează ca text care nu se parsează.  
Un document care se parsează ajunge potrivit la vizualizare și emite [load](#load). O cerere refuzată de rețea sau de CORS, un răspuns care nu este `ok` sau un text care nu se parsează emite [error](#error) și lasă o diagramă goală (consultați [Încărcare](#loading)).

Contează doar ultima cerere. Un `src` nou anulează preluarea încă în desfășurare, așa că un răspuns lent nu ajunge niciodată peste un document ulterior. Atribuirea lui [value](#value) o anulează și ea, la fel și eliminarea lui `src` sau setarea lui la `''`, care încetează să-l urmeze și lasă documentul afișat așa cum era.  
Oricare dintre `value` și `src` a fost setat ultimul se impune, prin proprietate sau prin atribut deopotrivă. Un `src` scris după un `value` este preluat chiar și când numește URL-ul preluat înainte. Scris din nou peste documentul pe care îl afișează deja, nu preia nimic.  
Viewerul preia doar cât timp se află într-o pagină. Scoaterea lui anulează o preluare încă în desfășurare, iar punerea lui la loc preia un `src` pe care nu l-a afișat, inclusiv unul care a eșuat, niciodată unul pe care îl afișează deja.  
`src` este singurul `fetch()` pe care îl face pachetul, așa că o politică strictă de securitate a conținutului (CSP) listează originea documentului în `connect-src`.

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

Returnează documentul afișat, indiferent dacă provine din `src` sau din `value`, ca șir JSON în forma de stocare pe care o scrie [value](./erd-editor-element.md#value) al editorului. Înainte de a se afișa ceva, este un document nou, gol, al cărui `doc` este `{}`.  
Cât timp [blocarea](../guide/guides/settings.md#lock) `Viewport` a documentului este activată, cum este într-un document nou, scrie zoomul și derularea la care este blocat documentul, oriunde a mutat cititorul vizualizarea. Doar cu acea blocare dezactivată scrie unde se află vizualizarea, inclusiv potrivirea pe care o face o aterizare.  
Scrie modul de afișare a numelor pe care îl conține documentul, niciodată pe cel pe care îl arată [nameView](#nameview) sau bara de controale peste el, nici măcar într-un document a cărui blocare `Name View` este dezactivată.  
Returnează documentul și după [destroy](#destroy).

```js
const data = viewer.value;
```

### setter {#setter}

Arată un document din textul său, înlocuindu-l pe cel afișat, și îl potrivește la vizualizare (consultați [Încărcare](#loading)). Primește textul pe care îl conține un fișier sau `value` al editorului.  
Un text care nu se parsează aruncă o excepție înainte să se schimbe ceva, iar documentul afișat rămâne: un `SyntaxError` pentru un text care nu este JSON, un `TypeError` pentru un JSON care nu conține niciun document, de exemplu `7`. Un șir gol sau orice nu este un șir de caractere arată o diagramă goală.  
Atribuirea anulează o preluare `src` încă în desfășurare și nu emite nici `load`, nici `error`.

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

Arată diagrama într-un [mod de afișare a numelor](../guide/guides/logical-names.md#name-view) peste cel pe care îl conține documentul: `'physical'` pentru `Physical Names`, `'logical'` pentru `Logical Names` sau `'both'` pentru `Both Names`. `null`, valoarea implicită, arată modul propriu al documentului, iar o valoare de atribut în afara celor trei se citește ca `null`.  
Rămâne în vigoare peste fiecare document încărcat după el, iar [value](#value) nu îl scrie niciodată. Eliminarea atributului revine la vizualizarea proprie a documentului.  
Lista `Name View` din [bara de controale](#controls) schimbă și ea vizualizarea, până când ajunge următorul document sau până când `nameView` se schimbă din nou. O schimbare de acolo nu se scrie nici ea în `value`.

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

Arată minihărta în colțul din dreapta sus, cât timp documentul conține un tabel, o notă afișată sau un grup de tabele afișat. Este activată implicit.  
Funcționează ca cea a editorului: faceți clic pe ea pentru a muta vizualizarea acolo sau trageți dreptunghiul ei de vizualizare pentru a deplasa pânza (consultați [Deplasarea pe pânză](../guide/guides/table-related-functions.md#getting-around-the-canvas)). Un deget pus pe ea este al paginii până când viewerul are focusul.  
Doar `minimap="false"` o dezactivează. Un atribut fără valoare, orice altă valoare și lipsa atributului o lasă activată.

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

Arată bara de controale deasupra mijlocului marginii de jos a pânzei. Este activată implicit și conține, de la stânga la dreapta:

- Zoomul: `Zoom out`, zoomul curent ca procent și `Zoom in`. Cele două butoane măresc sau micșorează zoomul ca tastele de zoom, iar un clic pe procent, `Reset zoom`, îl readuce la `100%`. Fiecare își numește tasta în sfatul ecran.
- `Fit`, care mărește și derulează astfel încât întreaga diagramă să se vadă în vizualizare, centrată.
- `Name View`, un buton care numește modul activ și deschide deasupra barei o listă cu `Physical Names`, `Logical Names` și `Both Names` (consultați [nameView](#nameview)).
- Busola `Go to content`, care se adaugă la capătul barei doar cât timp nicio parte a diagramei nu este pe ecran și duce vizualizarea la cea mai apropiată parte a ei.

Bara stă de la stânga la dreapta în orice limbă.  
Doar `controls="false"` o dezactivează, odată cu ea și busola și lista ei `Name View`. Un atribut fără valoare, orice altă valoare și lipsa atributului o lasă activată. Fără bară, rotița, o ciupire și tastele măresc în continuare după ce viewerul are focusul.

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Evenimente {#event}

`load` și `error` sunt singurele două evenimente și amândouă raportează despre `src`. Niciunul nu se propagă în sus, așa că ascultați chiar pe element.

### load {#load}

Emis după ce documentul numit de `src` a fost preluat și afișat. `event.detail` este `null`.  
Atribuirea lui `value` nu emite niciunul, la fel nici o preluare pe care a anulat-o un `src` ulterior, un `value`, scoaterea elementului din pagină sau [destroy](#destroy).

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

Emis când preluarea lui `src` eșuează: rețeaua sau CORS a refuzat cererea, răspunsul nu a fost `ok` sau textul lui nu s-a parsat. Viewerul arată atunci o diagramă goală și mesajul `Couldn't load the diagram` (consultați [Încărcare](#loading)).  
`event.detail` este cauza: `TypeError`-ul cu care `fetch()` este respins, un `Error` care numește starea, cum ar fi `GET /missing.erd.json answered 404 Not Found`, sau `SyntaxError`-ul ori `TypeError`-ul parserului.  
O preluare pe care a anulat-o altceva nu emite nimic.

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

Setează o temă presetată, primind `ThemeOptions` ale editorului (consultați [setPresetTheme](./erd-editor-element.md#setpresettheme)).  
Viewerul pornește cu `appearance: 'system'`, `grayColor: 'slate'` și `accentColor: 'indigo'`, așa că de la primul cadru arată modul luminos sau întunecat raportat de sistemul de operare și se schimbă când acesta se schimbă. Editorul pornește în schimb întunecat.  
Fiecare câmp se aplică separat, așa că un apel parțial le lasă pe celelalte două așa cum sunt. O valoare care nu este unul dintre nume este ignorată, iar apelul nu aruncă niciodată o excepție.  
Viewerul nu are configurator de teme și nici `systemDarkMode` și nu emite niciun eveniment pentru o temă.

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

Numește modul luminos sau întunecat pe care îl arată aspectul `'system'`, pentru o pagină cu un mod luminos și unul întunecat proprii. Cât timp unul este numit, schimbările sistemului de operare sunt ignorate.  
`null`, sau orice valoare în afară de `'dark'` sau `'light'`, revine la urmărirea sistemului de operare.  
Cât timp aspectul este `'light'` sau `'dark'`, nu schimbă nimic pe ecran, dar valoarea este păstrată și se aplică de îndată ce aspectul devine `'system'`. Nu emite nimic.

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

Suprascrie token-uri de temă peste presetare, primind token-urile `Theme` ale editorului (consultați [setTheme](./erd-editor-element.md#settheme)).  
Fiecare apel înlocuiește întreaga suprapunere, așa că transmiteți `{}` pentru a reveni la presetare. Sunt păstrate doar numele de token-uri, cu valori șir de caractere, iar un `setPresetTheme` ulterior schimbă presetarea de dedesubt, în timp ce suprascrierile rămân.  
Proprietățile personalizate CSS `--erd-editor-*` ajung și la viewer, setate pe element sau oriunde deasupra lui (consultați [Variabile CSS](./erd-editor-element.md#css-variables)). Pânza, la care nu ajunge nicio foaie de stil, le citește din nou când se schimbă o foaie de stil din `head`-ul paginii sau când se schimbă atributul `class` sau `style` al elementului ori al unui element de deasupra lui. O regulă adăugată cu `insertRule()` nu schimbă nimic din acestea, așa că pânza o preia la următoarea astfel de schimbare.

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

Setează limba de afișare: `'system'`, valoarea implicită, sau unul dintre cele 25 de coduri pe care le listează [Limba de afișare](./erd-editor-element.md#display-language) a editorului. Orice altceva, cum ar fi un simplu `'ko'` sau o valoare care nu este un șir de caractere, este ignorat.  
Limba schimbă sfaturile ecran ale barei de controale, lista `Name View`, paleta, mesajele de încărcare și cuvintele pe care diagrama le desenează singură, cum ar fi `unnamed`. Numele, comentariile și restul documentului nu sunt niciodată traduse.

Engleza face parte din punctul de intrare al viewerului și se aplică înainte ca apelul să returneze. Fiecare altă limbă este un modul propriu, pe care bundlerul dumneavoastră îl emite ca un chunk alături de viewer și pe care viewerul îl preia din bundle prima dată când o pagină cere acea limbă, o singură dată pentru toate viewerele paginii. Până când ajunge, viewerul continuă să arate limba pe care o arăta, engleza la primul cadru. Dacă nu se încarcă, viewerul arată engleza, iar o nouă cerere pentru acea limbă încearcă din nou.  
Versiunea pentru [eticheta script](./installation.md#script-tag) conține toate cele 25 de limbi, așa că nu preia niciuna. Un bundle care conține și editorul încarcă fiecare limbă odată cu chunk-ul editorului (consultați [Înregistrarea elementelor](./installation.md#registering-the-elements)).  
`Promise`-ul pe care îl returnează se rezolvă după ce acea limbă a ajuns sau a eșuat și nu este niciodată respins. Acea limbă, sau engleza după un eșec, este apoi în vigoare, cu excepția cazului în care un apel ulterior a cerut alta: apelul ulterior se impune, în orice ordine ar ajunge limbile.

Ebraica, araba și persana așază paleta și mesajele de încărcare de la dreapta la stânga. Pânza, minihărta, barele de derulare și bara de controale cu busola ei rămân de la stânga la dreapta, ca pânza editorului (consultați [Limbi scrise de la dreapta la stânga](../guide/guides/language-and-theme.md#right-to-left-languages)).  
Viewerul setează `lang` și `dir` pe propria rădăcină din interiorul shadow root-ului închis, niciodată pe elementul gazdă sau pe pagină.  
Nu emite nimic, iar viewerul nu are selector de limbă și nu stochează nimic.

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

Numește limba pe care o reprezintă `'system'`, ca etichetă BCP 47, pentru o pagină cu o setare de limbă proprie.  
Eticheta este curățată de spații. `null`, un șir gol sau o valoare care nu este un șir de caractere revine la limbile paginii.  
Acestea sunt `<html lang>` al paginii, apoi `navigator.languages` al browserului, citite o singură dată, când viewerul se conectează prima dată. `'system'` ia prima dintre ele pentru care viewerul are o limbă, după regula editorului din [setSystemLocale](./erd-editor-element.md#setsystemlocale), și engleza când nu are niciuna dintre ele. Așadar, o pagină al cărei `<html lang>` numește o limbă pe care o are viewerul arată acea limbă indiferent ce preferă browserul, iar o schimbare ulterioară a lui `lang` sau a limbilor browserului nu mută niciun viewer.  
Contează doar cât timp opțiunea în vigoare este `'system'`, iar `Promise`-ul ei se rezolvă ca cel al lui [setLocale](#setlocale).

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

Încheie viewerul definitiv. Desface vizualizarea înainte să returneze, indiferent dacă elementul se mai află în pagină sau a fost scos înainte, anulează o preluare `src` încă în desfășurare și încetează să urmeze schema de culori a sistemului de operare și stilurile paginii.  
Un viewer distrus nu mai desenează nimic, nu mai preia nimic și nu mai cere nicio limbă, chiar și când este adăugat din nou într-o pagină. Citirea lui [value](#value) returnează în continuare documentul pe care îl conținea.  
Scoaterea elementului din pagină nu îl distruge: pus la loc, își continuă activitatea și preia un `src` pe care nu l-a afișat încă (consultați [Încărcare](#loading)).

```js
viewer.destroy();
```

## Focus și taste {#focus-and-keys}

Un viewer nu primește focus când se montează, când ajunge un document sau când i se închide paleta, așa că nu derulează niciodată pagina spre el și nu preia tastele paginii.  
Un clic sau o atingere pe pânza lui îi dă focus fără să deruleze pagina, iar el este o oprire a tastei `Tab`. Spre deosebire de editor, nu are un membru propriu `focus()` sau `blur()`. O apăsare oriunde în altă parte pe pagină îi ia din nou focusul.

Până când viewerul are focusul, pagina păstrează rotița, care derulează pagina, și ciuprirea de pe trackpad. Un deget pe pânză derulează pagina și nu deplasează nimic, iar fiecare tastă ajunge la pagină fără să fie împiedicată.  
Odată ce are focusul:

- Rotița deplasează vizualizarea, iar `Shift + Wheel` o deplasează lateral. Peste o notă al cărei text depășește, rotița derulează nota.
- `Ctrl + Wheel` (Windows/Linux) sau `⌘ + Wheel` (Mac), o ciupire pe trackpad sau două degete pe un ecran tactil măresc.
- Un deget deplasează vizualizarea.
- `Ctrl + Plus` și `Ctrl + Minus` (Windows/Linux) sau `⌘ + Plus` și `⌘ + Minus` (Mac) măresc sau micșorează zoomul ca butoanele `Zoom in` și `Zoom out`, iar `Ctrl + 0` (Windows/Linux) sau `⌘ + 0` (Mac) revine direct la `100%`, păstrând mijlocul ecranului unde este.
- `Ctrl + K` (Windows/Linux) sau `⌘ + K` (Mac) deschide paleta, iar `Esc` o închide.

Acestea sunt singurele sale taste și nu pot fi reasociate. Fiecare altă tastă ajunge la pagină fără să fie împiedicată, cu focus sau fără: `Delete`, `Backspace`, `Space`, `Enter`, `Tab`, `Ctrl + A`, `Ctrl + F` și fiecare combinație care editează în editor.

Paleta caută doar în document și nu listează nicio comandă. Câmpul ei gol arată prefixele: `#` caută în tabele, `@` în coloane, `:` în comentarii și note, iar `?` listează prefixele, ca în editor (consultați [Căutarea în diagramă](../guide/guides/quick-search.md#searching-the-diagram)). Un cuvânt fără prefix arată `No commands match` deasupra rândurilor care caută în diagramă acel cuvânt.  
Alegerea unui rând mută vizualizarea după regula editorului, [Unde ajunge un salt](../guide/guides/table-related-functions.md#where-a-jump-lands), lăsând zoomul așa cum este, și conturează ce a atins, adus în față: tabelul, tabelul care conține coloana sau comentariul, ori nota.  
Alegerea unui rând sau apăsarea pe `Esc` închide paleta și lasă focusul fără niciun element, așa că următoarea mișcare a rotiței derulează pagina; faceți clic pe vizualizare pentru a-i da din nou rotița și tastele. Cât timp paleta este deschisă, rotița derulează lista ei, iar tastele de zoom nu fac nimic.

Cu focus sau fără, o tragere cu butonul principal al mouse-ului deplasează vizualizarea de oriunde de pe pânză, și peste un tabel. Un clic sau o atingere fără mișcare luminează relații: pe un tabel, relațiile acelui tabel; pe o linie de relație, acea linie; oriunde în altă parte, inclusiv pe o notă, stinge lumina. Un astfel de clic șterge și conturul lăsat de un salt din paletă. Cursorul oprit pe un tabel îi luminează relațiile cât timp se află acolo.  
Nicio apăsare nu selectează, nu mută și nu editează nimic. Nu există nicio selecție în afară de conturul unui salt, nicio casetă de selecție și niciun dublu clic sau `Enter` nu deschide o celulă.

## Încărcare {#loading}

Cât timp se încarcă `src`, un mesaj deasupra mijlocului pânzei scrie `Loading diagram` lângă un indicator care se rotește. După ce o încărcare eșuează, scrie `Couldn't load the diagram` lângă un semn de avertizare, până când un `src` nou sau un `value` îi ia locul ori `src` este eliminat. Apăsările trec prin mesaj spre pânză, iar mesajul se citește în limba de afișare, de la dreapta la stânga într-una scrisă astfel.

Fiecare document care ajunge, din `src` sau din `value`, este potrivit la caseta viewerului: mărit și derulat astfel încât întreaga diagramă să se vadă, centrată, ca la `Fit`, lăsând deoparte zoomul și derularea salvate de fișier. Un document predat înainte ca viewerul să aibă o dimensiune, setat înainte să fie într-o pagină sau cât timp caseta lui este goală, este potrivit de îndată ce are una. O redimensionare ulterioară păstrează zoomul; `Fit` potrivește din nou.

Viewerul preia un `src` doar cât timp se află într-o pagină. Scoaterea lui anulează o preluare încă în desfășurare, iar punerea lui la loc preia un `src` pe care nu l-a afișat, inclusiv unul care a eșuat, niciodată unul pe care îl afișează deja. Un viewer care nu mai este necesar se încheie cu [destroy](#destroy).

## Ce adaugă unei pagini {#what-it-adds-to-a-page}

- Niciun worker. Nu pornește niciunul, așa că o politică de securitate a conținutului (CSP) nu are nevoie de `worker-src` pentru el.
- Nicio stocare. Nu scrie niciun cookie, `localStorage`, `sessionStorage` sau IndexedDB.
- Două feluri de cereri: preluarea [src](#src), a cărei origine o listează o politică strictă în `connect-src`, și modulul unei limbi de afișare în afară de engleză, din propriul bundle (consultați [setLocale](#setlocale)).
- Stiluri în foi de stil construite, pe care un `style-src` strict le lasă să treacă. Un browser fără foi de stil construite, cum ar fi Firefox înainte de 101, primește în schimb elemente `<style>`, care necesită `style-src 'unsafe-inline'`.
- Ascultători pe `window`. Importul punctului de intrare adaugă trei pe durata de viață a paginii, pentru `mousedown`, `touchstart` și evenimentul propriu al pachetului `@dineug/erd-editor/internal-forward-move-start`. Konva, care desenează pânza, setează `window.Konva` și, cu prima sa scenă, adaugă ascultători de mouse și de atingere pe `window` și un ascultător `visibilitychange` pe `document`, pe care nu îi elimină niciodată. Punctul de intrare al editorului adaugă aceiași.
- Până la [destroy](#destroy), fiecare viewer urmează schema de culori a sistemului de operare și urmărește stilurile paginii pentru proprietățile personalizate pe care le descrie [setTheme](#settheme).
