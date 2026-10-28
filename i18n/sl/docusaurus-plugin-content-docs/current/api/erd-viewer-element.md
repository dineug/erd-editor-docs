---
sidebar_position: 3
description: API elementa erd-viewer – diagram samo za branje iz vrednosti value ali naslova URL src, njegova mini zemljevid in vrstica s kontrolniki, dogodka load in error, teme, jezik prikaza, fokus in tipke, nalaganje ter kaj doda strani.
---

# ErdViewerElement

Od različice `5.0.0` paket vsebuje tudi `<erd-viewer>`, pogled dokumenta samo za branje: bralec premika, povečuje, išče in osvetljuje relacije, nič v njem pa ne ureja. Nariše samo platno ERD s svojimi drsniki, [mini zemljevid](#minimap), [vrstico s kontrolniki](#controls) in paleto, ki išče po dokumentu, nima pa orodne vrstice, zavihkov, raziskovalca ali kontekstnega menija.

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Okvir zgoraj je ta element, kakršnega prikazuje erd-editor.io/embed, tu z vzorcem knjigarne: kliknite nanj, da ga fokusirate, nato povečujte in iščite s tipkami iz razdelka [Fokus in tipke](#focus-and-keys), za okvir z lastnim dokumentom brez kode pa glejte [Vdelava](../guide/guides/embedding.md).

Pregledovalnik je navaden element `HTMLElement`.  
Njegova definicija tipa je naslednja.

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

Uvoz `@dineug/erd-editor/erd-viewer.js` definira `<erd-viewer>` in pusti `<erd-editor>` nedefiniran. Uvoz korena paketa ne definira nobenega: izvaža razred `ErdViewerElement` in `defineErdViewer()`, ki definira oznako tam, kjer ga pokličete, zato lahko stran razred definira tudi pod lastno oznako – glejte razdelek [Registracija elementov](./installation.md#registering-the-elements).  
Vsaka vstopna točka razen `engine.js` in `peer.js` potrebuje DOM, tudi ta, zato stran, upodobljena na strežniku, uvozi to na odjemalcu – glejte razdelek [Upodabljanje na strežniku](./installation.md#server-side-rendering).  
Uvoz vstopne točke doda `erd-viewer` v `HTMLElementTagNameMap`, zato sta `document.createElement('erd-viewer')` in `document.querySelector('erd-viewer')` tipizirana kot `ErdViewerElement` brez pretvorbe.

Tako kot urejevalnik se pregledovalnik upodablja v zaprt senčni koren, zato je `viewer.shadowRoot` enak `null`, slogi strani pa ne uhajajo noter ali ven; oblikujte ga prek [setTheme](#settheme) in lastnih CSS spremenljivk `--erd-editor-*`. Več pregledovalnikov na eni strani ima vsak svoj dokument, pogled, temo in jezik.  
`<erd-viewer>` nima lastne velikosti. Element po meri je vrstični, zato mu dajte `display: block` in višino, kot zgoraj. Pogled zapolni polje elementa in mu sledi pri spreminjanju velikosti, pri čemer ohrani povečavo.

`src`, `name-view`, `minimap` in `controls` so njegovi edini atributi, vsak z lastnostjo z enakim imenom, `nameView` za `name-view`. [value](#value) je samo lastnost.  
Vrednosti `value`, `src`, `nameView`, `minimap` ali `controls`, nastavljene na elementu, preden je njegova oznaka definirana, na primer v ogrodju, ki element upodobi, preden se vstopna točka naloži, se prevzamejo, ko je oznaka definirana, in sicer namesto atributov, ki jih je dala označba. Prevzamejo se v vrstnem redu, v katerem jih je stran prvič zapisala, zato zmaga poznejša od `value` in `src`. `value`, ki ne vsebuje dokumenta, tedaj nima več klicatelja, ki bi mu lahko vrgel napako: sporoči se kot neujeta napaka, pregledovalnik pa ostane prazen.

Izvedba z oznako script, `dist/erd-viewer.umd.js`, vsebuje samo pregledovalnik z vsemi odvisnostmi. Definira `<erd-viewer>` in da `ErdViewerElement` ter `defineErdViewer` na `window.ErdViewer`. Naslov URL CDN brez poti postreže izvedbo urejevalnika, zato poimenujte datoteko – glejte razdelek [Oznaka script](./installation.md#script-tag).

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

Naslov URL dokumenta, ki ga pregledovalnik pridobi in prikaže. Privzeto je `''`, torej brez.  
Pridobivanje je navaden `fetch()`, zahteva `GET` brez lastnih možnosti, zato zanj veljajo pravila CORS brskalnika: dokument na drugem izvoru potrebuje strežnik, ki dovoljuje izvor strani, piškotki pa gredo samo na izvor same strani. Relativni naslov URL se razreši glede na stran.  
Odgovor mora vsebovati dokument, kot ga vsebuje datoteka `.erd.json`, torej obliko za shranjevanje, ki jo pišeta [value](./erd-editor-element.md#value) urejevalnika in vsak uradni gostitelj. Nobena druga oblika se ne prebere: datoteka SQL, GraphQL, DBML ali AML spodleti kot besedilo, ki se ne razčleni.  
Dokument, ki se razčleni, pristane prilagojen pogledu in sproži [load](#load). Zahteva, ki jo je omrežje ali CORS zavrnil, odgovor, ki ni `ok`, ali besedilo, ki se ne razčleni, sproži [error](#error) in pusti prazen diagram – glejte razdelek [Nalaganje](#loading).

Šteje samo zadnja zahteva. Nov `src` prekliče pridobivanje, ki še teče, zato počasen odgovor nikoli ne pristane nad poznejšim dokumentom. Tudi dodelitev [value](#value) ga prekliče, prav tako odstranitev `src` ali nastavitev na `''`, ki mu preneha slediti in pusti prikazani dokument, kakršen je bil.  
Zmaga tisti od `value` in `src`, ki je nastavljen zadnji, prek lastnosti ali atributa. `src`, zapisan po `value`, se pridobi, tudi če poimenuje naslov URL, pridobljen prej. Ponovno zapisan nad dokumentom, ki ga že prikazuje, ne pridobi ničesar.  
Pregledovalnik pridobiva samo, dokler je na strani. Če ga odstranite, preklicete pridobivanje, ki še teče, ob vrnitvi pa pridobi `src`, ki ga še ni prikazal, tudi tistega, ki je spodletel, nikoli pa tistega, ki ga že prikazuje.  
`src` je edini `fetch()`, ki ga naredi paket, zato stroga politika Content Security Policy navede izvor dokumenta v `connect-src`.

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

Pridobi prikazani dokument, ne glede na to, ali je prišel iz `src` ali `value`, kot niz JSON v obliki za shranjevanje, ki jo piše [value](./erd-editor-element.md#value) urejevalnika. Preden je kaj prikazano, je to nov, prazen dokument, katerega `doc` je `{}`.  
Dokler je [zaklep](../guide/guides/settings.md#lock) `Viewport` dokumenta vklopljen, kot je v novem dokumentu, zapiše povečavo in pomik, pri katerih je dokument zaklenjen, kamor koli je bralec premaknil pogled. Samo z izklopljenim zaklepom zapiše, kje pogled stoji, vključno s prilagoditvijo ob pristanku.  
Zapiše prikaz imen, ki ga dokument hrani, nikoli pa tistega, ki ga čez njega prikazujeta [nameView](#nameview) ali vrstica s kontrolniki, tudi v dokumentu z izklopljenim zaklepom `Name View`.  
Dokument vrne tudi po [destroy](#destroy).

```js
const data = viewer.value;
```

### setter {#setter}

Prikaže dokument iz njegovega besedila, zamenja prikazanega in ga prilagodi pogledu – glejte razdelek [Nalaganje](#loading). Sprejme besedilo, ki ga vsebuje datoteka ali `value` urejevalnika.  
Besedilo, ki se ne razčleni, vrže napako, preden se karkoli spremeni, prikazani dokument pa ostane: `SyntaxError` za besedilo, ki ni JSON, `TypeError` za JSON, ki ne vsebuje dokumenta, na primer `7`. Prazen niz ali karkoli, kar ni niz, prikaže prazen diagram.  
Dodelitev prekliče pridobivanje `src`, ki še teče, in ne sproži ne `load` ne `error`.

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

Prikaže diagram v [prikazu imen](../guide/guides/logical-names.md#name-view) čez tistega, ki ga hrani dokument: `'physical'` za `Physical Names`, `'logical'` za `Logical Names` ali `'both'` za `Both Names`. `null`, privzeto, prikaže dokumentovega, vrednost atributa, ki ni ena od treh, pa se prebere kot `null`.  
Ostane v veljavi nad vsakim dokumentom, naloženim po njem, [value](#value) pa ga nikoli ne zapiše. Odstranitev atributa se vrne na dokumentov lasten pogled.  
Seznam `Name View` na [vrstici s kontrolniki](#controls) pogled preklopi tudi sam, dokler ne pristane naslednji dokument ali se `nameView` naslednjič ne spremeni. Preklop tam prav tako ni zapisan v `value`.

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

Prikaže mini zemljevid v zgornjem desnem kotu, dokler dokument vsebuje tabelo, prikazano beležko ali prikazano skupino tabel. Privzeto je vklopljena.  
Deluje kot mini zemljevid urejevalnika: kliknite nanjo, da tja premaknete pogled, ali povlecite pravokotnik njenega vidnega območja za premikanje – glejte razdelek [Premikanje po platnu](../guide/guides/table-related-functions.md#getting-around-the-canvas). Prst na njej je strani, dokler pregledovalnik nima fokusa.  
Samo `minimap="false"` jo izklopi. Atribut brez vrednosti, katera koli druga vrednost in brez atributa jo pustijo vklopljeno.

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

Prikaže vrstico s kontrolniki nad sredino spodnjega roba platna. Privzeto je vklopljena in od leve proti desni vsebuje:

- Povečavo: `Zoom out`, trenutno povečavo kot odstotek in `Zoom in`. Gumba korakata povečavo kot tipke za povečavo, klik na odstotek, `Reset zoom`, pa jo vrne na `100%`. Vsak v opisu orodja navaja svojo tipko.
- `Fit`, ki poveča in pomakne tako, da je celoten diagram viden v pogledu, na sredini.
- `Name View`, gumb, ki poimenuje veljavni prikaz in nad vrstico odpre seznam `Physical Names`, `Logical Names` in `Both Names` – glejte [nameView](#nameview).
- Kompas `Go to content`, ki se pridruži koncu vrstice samo, dokler noben del diagrama ni na zaslonu, in pelje pogled na najbližji del.

Vrstica v vseh jezikih stoji od leve proti desni.  
Samo `controls="false"` jo izklopi, skupaj s kompasom in seznamom `Name View`. Atribut brez vrednosti, katera koli druga vrednost in brez atributa jo pustijo vklopljeno. Brez vrstice kolesce, ščip in tipke še vedno povečujejo, ko pregledovalnik dobi fokus.

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Dogodek {#event}

`load` in `error` sta edina dogodka in oba poročata o `src`. Nobeden ne mehurči, zato poslušajte na samem elementu.

### load {#load}

Sproži se, ko je dokument, ki ga poimenuje `src`, pridobljen in prikazan. `event.detail` je `null`.  
Dodelitev `value` ne sproži nobenega, prav tako ne pridobivanje, ki so ga prekinili poznejši `src`, `value`, odstranitev elementa s strani ali [destroy](#destroy).

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

Sproži se, ko pridobivanje `src` spodleti: omrežje ali CORS je zahtevo zavrnil, odgovor ni bil `ok` ali njegovo besedilo se ni razčlenilo. Pregledovalnik nato prikaže prazen diagram in obvestilo `Couldn't load the diagram` – glejte razdelek [Nalaganje](#loading).  
`event.detail` je vzrok: `TypeError`, s katerim `fetch()` zavrne, `Error`, ki poimenuje stanje, na primer `GET /missing.erd.json answered 404 Not Found`, ali `SyntaxError` ali `TypeError` razčlenjevalnika.  
Pridobivanje, ki ga je kaj prekinilo, ne sproži ničesar.

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

Nastavi prednastavljeno temo in sprejme `ThemeOptions` urejevalnika – glejte [setPresetTheme](./erd-editor-element.md#setpresettheme).  
Pregledovalnik se začne z `appearance: 'system'`, `grayColor: 'slate'` in `accentColor: 'indigo'`, zato od prve sličice prikazuje svetlo ali temno, kar sporoča operacijski sistem, in preklopi, ko se to spremeni. Urejevalnik se namesto tega začne s temno.  
Vsako polje se uveljavi samo zase, zato delni klic pusti ostali dve, kot sta. Vrednost, ki ni eno od imen, se prezre, klic pa nikoli ne vrže napake.  
Pregledovalnik nima graditelja tem in nima `systemDarkMode` ter ne sproži dogodka za temo.

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

Poimenuje svetlo ali temno, ki ju prikazuje videz `'system'`, za stran z lastno svetlo in temno. Dokler je ena poimenovana, se spremembe operacijskega sistema prezrejo.  
`null` ali katera koli vrednost, ki ni `'dark'` ali `'light'`, se vrne k sledenju operacijskemu sistemu.  
Dokler je videz `'light'` ali `'dark'`, ne spremeni ničesar na zaslonu, vendar se vrednost ohrani in se uveljavi takoj, ko videz postane `'system'`. Ne sproži ničesar.

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

Preglasi žetone teme na vrhu prednastavitve in sprejme žetone `Theme` urejevalnika – glejte [setTheme](./erd-editor-element.md#settheme).  
Vsak klic zamenja celotno prekrivanje, zato podajte `{}`, da se vrnete na prednastavitev. Ohranijo se samo imena žetonov z vrednostmi v obliki niza, poznejši `setPresetTheme` pa zamenja prednastavitev pod njimi, preglasitve pa ostanejo.  
Lastne CSS spremenljivke `--erd-editor-*` dosežejo tudi pregledovalnik, nastavljene na elementu ali kjer koli nad njim – glejte razdelek [Spremenljivke CSS](./erd-editor-element.md#css-variables). Platno, ki ga ne doseže noben slogovni list, jih prebere znova, ko se spremeni slogovni list v `head` strani ali ko se spremeni atribut `class` ali `style` elementa ali elementa nad njim. Pravilo, dodano z `insertRule()`, ne spremeni nobenega od teh, zato ga platno prevzame ob naslednji taki spremembi.

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

Nastavi jezik prikaza: `'system'`, privzeto, ali eno od 25 kod, ki jih navaja [Jezik prikaza](./erd-editor-element.md#display-language) urejevalnika. Karkoli drugega, na primer goli `'ko'` ali vrednost, ki ni niz, se prezre.  
Jezik spremeni opise orodij vrstice s kontrolniki, seznam `Name View`, paleto, obvestila o nalaganju in besede, ki jih diagram nariše sam, na primer `unnamed`. Imena, komentarji in preostali del dokumenta se nikoli ne prevedejo.

Angleščina je del vstopne točke pregledovalnika in se uveljavi, preden se klic vrne. Vsak drug jezik je lasten modul, ki ga vaš paketnik odda kot kos ob pregledovalniku in ga pregledovalnik pridobi iz vašega paketa, ko stran prvič zahteva ta jezik, in sicer enkrat za vse pregledovalnike strani. Dokler ne pristane, pregledovalnik še naprej prikazuje jezik, ki ga je, na prvi sličici angleščino. Če se ne naloži, pregledovalnik prikaže angleščino, ponovna zahteva tega jezika pa poskusi znova.  
Izvedba [oznake script](./installation.md#script-tag) vsebuje vseh 25 jezikov, zato ne pridobi nobenega. Paket, ki vsebuje tudi urejevalnik, naloži vse jezike s kosom urejevalnika – glejte razdelek [Registracija elementov](./installation.md#registering-the-elements).  
`Promise`, ki ga vrne, se razreši, ko je ta jezik pristal ali spodletel, in nikoli ne zavrne. Ta jezik ali angleščina po neuspehu je nato v veljavi, razen če je poznejši klic zahteval drugega: poznejši klic zmaga, v kakršnem koli vrstnem redu jeziki pristanejo.

Hebrejščina, arabščina in perzijščina postavijo paleto in obvestila o nalaganju od desne proti levi. Platno, mini zemljevid, drsniki in vrstica s kontrolniki s kompasom ostanejo od leve proti desni, tako kot platno urejevalnika – glejte razdelek [Jeziki, ki se pišejo od desne proti levi](../guide/guides/language-and-theme.md#right-to-left-languages).  
Pregledovalnik nastavi `lang` in `dir` na svojem korenu znotraj zaprtega senčnega korena, nikoli na gostiteljskem elementu ali strani.  
Ne sproži ničesar, pregledovalnik pa nima izbirnika jezika in ničesar ne shranjuje.

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

Poimenuje jezik, ki ga predstavlja `'system'`, kot oznako BCP 47, za stran z lastno nastavitvijo jezika.  
Oznaka se obreže. `null`, prazen niz ali vrednost, ki ni niz, se vrne k jezikom strani.  
To so `<html lang>` strani, nato `navigator.languages` brskalnika, prebrana enkrat, ko se pregledovalnik prvič poveže. `'system'` vzame prvega od njih, za katerega ima pregledovalnik jezik, po pravilu urejevalnika iz [setSystemLocale](./erd-editor-element.md#setsystemlocale), in angleščino, če nima nobenega od njih. Zato stran, katere `<html lang>` poimenuje jezik, ki ga pregledovalnik ima, prikazuje ta jezik, ne glede na to, kaj brskalnik raje ima, poznejša sprememba `lang` ali jezikov brskalnika pa ne premakne nobenega pregledovalnika.  
Pomembno je samo, dokler je v veljavi možnost `'system'`, njegov `Promise` pa se razreši kot pri [setLocale](#setlocale).

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

Pregledovalnik dokončno zaključi. Pogled podre, preden se vrne, ne glede na to, ali je element še na strani ali je bil prej odstranjen, prekliče `src`, ki še teče, in preneha slediti barvni shemi operacijskega sistema in slogom strani.  
Uničen pregledovalnik ne nariše več ničesar, ne pridobiva ničesar in ne zahteva nobenega jezika, tudi če je ponovno dodan na stran. Branje [value](#value) še vedno vrne dokument, ki ga je hranil.  
Odstranitev elementa s strani ga ne uniči: ko je vrnjen, nadaljuje in pridobi `src`, ki ga še ni prikazal – glejte razdelek [Nalaganje](#loading).

```js
viewer.destroy();
```

## Fokus in tipke {#focus-and-keys}

Pregledovalnik ne prevzame fokusa ob priklopu, ko dokument pristane ali ko se zapre njegova paleta, zato nikoli ne pomakne strani nase in ne vzame tipk strani.  
Klik ali tap na njegovo platno ga fokusira brez pomika strani in je ena postaja tipke `Tab`. Za razliko od urejevalnika nima lastnega člana `focus()` ali `blur()`. Pritisk kjer koli drugje na strani fokus znova odvzame.

Dokler pregledovalnik nima fokusa, kolesce, ki pomika stran, in ščip na sledilni ploščici ostaneta strani. Prst na platnu pomika stran in ničesar ne premika v pregledovalniku, vsaka tipka pa doseže stran neprestrežena.  
Ko ima fokus:

- Kolesce premika pogled, `Shift + Wheel` ga premika vstran. Nad beležko, katere besedilo prekoračuje, kolesce pomika beležko.
- `Ctrl + Wheel` (Windows/Linux) ali `⌘ + Wheel` (Mac), ščip na sledilni ploščici ali dva prsta na zaslonu na dotik povečujejo.
- Prst premika pogled.
- `Ctrl + Plus` in `Ctrl + Minus` (Windows/Linux) ali `⌘ + Plus` in `⌘ + Minus` (Mac) korakajo povečavo kot gumba `Zoom in` in `Zoom out`, `Ctrl + 0` (Windows/Linux) ali `⌘ + 0` (Mac) pa gre naravnost nazaj na `100%`, pri čemer sredina zaslona ostane, kjer je.
- `Ctrl + K` (Windows/Linux) ali `⌘ + K` (Mac) odpre paleto, `Esc` pa jo zapre.

To so njegove edine tipke in jih ni mogoče preslikati. Vsaka druga tipka doseže stran neprestrežena, s fokusom ali brez: `Delete`, `Backspace`, `Space`, `Enter`, `Tab`, `Ctrl + A`, `Ctrl + F` in vsaka kombinacija, ki v urejevalniku ureja.

Paleta išče samo po dokumentu in ne navaja nobenega ukaza. Njen prazen vnos prikaže predpone: `#` išče tabele, `@` stolpce, `:` komentarje in beležke, `?` pa navede predpone, kot v urejevalniku – glejte razdelek [Iskanje po diagramu](../guide/guides/quick-search.md#searching-the-diagram). Beseda brez predpone prikaže `No commands match` nad vrsticami, ki po diagramu iščejo to besedo.  
Izbira vrstice premakne pogled po pravilu urejevalnika, [Kam pripelje skok](../guide/guides/table-related-functions.md#where-a-jump-lands), pri čemer povečava ostane, kot je, in obrobi, kar je dosegla, prinešeno v ospredje: tabelo, tabelo, ki vsebuje stolpec ali komentar, ali beležko.  
Izbira vrstice ali pritisk `Esc` zapre paleto in pusti fokus brez elementa, zato naslednje kolesce pomakne stran; kliknite pogled, da mu znova date kolesce in tipke. Dokler je paleta odprta, kolesce pomika njen seznam, tipke za povečavo pa ne naredijo ničesar.

S fokusom ali brez vlečenje z glavnim gumbom miške premika pogled kjer koli na platnu, tudi čez tabelo. Klik ali tap, ki se ne premakne, osvetli relacije: na tabeli relacije te tabele, na črti relacije to črto, kjer koli drugje, vključno z beležko, pa osvetlitev ugasne. Tak klik izbriše tudi obris, ki ga je pustil skok iz palete. Kazalec, ki počiva na tabeli, osvetli njene relacije, dokler je tam.  
Noben pritisk ničesar ne izbere, premakne ali uredi. Izbire ni razen obrisa skoka, ni okvirja za izbiro, in noben dvoklik ali `Enter` ne odpre celice.

## Nalaganje {#loading}

Medtem ko se `src` nalaga, obvestilo nad sredino platna prikazuje `Loading diagram` ob vrtečem se nalagalniku. Ko nalaganje spodleti, prikazuje `Couldn't load the diagram` ob opozorilnem znaku, dokler ga ne zamenja nov `src` ali `value` ali dokler `src` ni odstranjen. Pritiski gredo skozi obvestilo na platno, obvestilo pa se bere v jeziku prikaza, od desne proti levi v jeziku, ki se piše tako.

Vsak dokument, ki pristane, iz `src` ali iz `value`, se prilagodi polju pregledovalnika: poveča in pomakne se tako, da je viden celoten diagram, na sredini, kot to naredi `Fit`, povečava in pomik, ki ju je shranila datoteka, pa se odložita. Dokument, predan, preden ima pregledovalnik velikost, nastavljen, preden je na strani ali medtem ko je njegovo polje prazno, se prilagodi, ko jo dobi. Poznejša sprememba velikosti ohrani povečavo; `Fit` prilagodi znova.

Pregledovalnik pridobiva `src` samo, dokler je na strani. Odstranitev prekliče pridobivanje, ki še teče, ob vrnitvi pa pridobi `src`, ki ga še ni prikazal, tudi tistega, ki je spodletel, nikoli pa tistega, ki ga že prikazuje. Pregledovalnik, ki ga ne potrebujete več, zaključite z [destroy](#destroy).

## Kaj doda strani {#what-it-adds-to-a-page}

- Nobenega delavca. Ne zažene nobenega, zato Content Security Policy zanj ne potrebuje `worker-src`.
- Nobenega shranjevanja. Ne zapiše piškotka, `localStorage`, `sessionStorage` ali IndexedDB.
- Dve vrsti zahtev: pridobivanje [src](#src), katerega izvor stroga politika navede v `connect-src`, in modul jezika prikaza, ki ni angleščina, iz vašega paketa – glejte [setLocale](#setlocale).
- Sloge v sestavljenih slogovnih listih, ki jih stroga `style-src` spusti skozi. Brskalnik brez sestavljenih slogovnih listov, na primer Firefox pred različico 101, namesto tega dobi elemente `<style>`, ki potrebujejo `style-src 'unsafe-inline'`.
- Poslušalce na `window`. Uvoz vstopne točke doda tri za življenjsko dobo strani, za `mousedown`, `touchstart` in lasten dogodek paketa `@dineug/erd-editor/internal-forward-move-start`. Konva, ki riše platno, nastavi `window.Konva` in s prvim odrom doda poslušalce miške in dotika na `window` ter poslušalca `visibilitychange` na `document`, ki ga nikoli ne odstrani. Vstopna točka urejevalnika doda enake.
- Do [destroy](#destroy) vsak pregledovalnik sledi barvni shemi operacijskega sistema in opazuje sloge strani za lastne spremenljivke CSS, ki jih opisuje [setTheme](#settheme).
