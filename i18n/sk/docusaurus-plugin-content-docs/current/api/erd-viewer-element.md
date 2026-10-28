---
sidebar_position: 3
description: API elementu erd-viewer – diagram iba na čítanie z hodnoty value alebo adresy URL src, jeho minimapa a panel ovládacích prvkov, udalosti load a error, motívy, jazyk zobrazenia, fokus a klávesy, načítanie a to, čo pridáva na stránku.
---

# ErdViewerElement

Od verzie `5.0.0` balík obsahuje aj `<erd-viewer>`, zobrazenie dokumentu iba na čítanie: čitateľ posúva, približuje, vyhľadáva a zvýrazňuje vzťahy a nič v ňom neupravuje. Kreslí samotné plátno ERD s posúvacími lištami, [minimapou](#minimap), [panelom ovládacích prvkov](#controls) a paletou, ktorá vyhľadáva v dokumente, a nemá panel nástrojov, karty, prieskumník ani kontextovú ponuku.

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Rámec vyššie je tento element tak, ako ho zobrazuje erd-editor.io/embed, tu s ukážkou bookstore: kliknutím mu dajte fokus, potom približujte a vyhľadávajte klávesmi z časti [Fokus a klávesy](#focus-and-keys) a ak chcete vložiť vlastný dokument bez kódu, pozrite si stránku [Vkladanie](../guide/guides/embedding.md).

Prehliadač je obyčajný element `HTMLElement`.  
Jeho definícia typu je takáto.

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

Import `@dineug/erd-editor/erd-viewer.js` definuje `<erd-viewer>` a nechá `<erd-editor>` nedefinovaný. Import koreňa balíka nedefinuje ani jeden z nich: exportuje triedu `ErdViewerElement` a `defineErdViewer()`, ktorá definuje značku tam, kde ju zavoláte, takže stránka môže triedu definovať aj pod vlastnou značkou – pozrite si časť [Registrácia elementov](./installation.md#registering-the-elements).  
Každý vstupný bod okrem `engine.js` a `peer.js` potrebuje DOM, aj tento, takže stránka vykresľovaná na strane servera ho importuje na klientovi – pozrite si časť [Vykresľovanie na strane servera](./installation.md#server-side-rendering).  
Import vstupného bodu pridá `erd-viewer` do `HTMLElementTagNameMap`, takže `document.createElement('erd-viewer')` a `document.querySelector('erd-viewer')` majú typ `ErdViewerElement` bez pretypovania.

Rovnako ako editor sa prehliadač vykresľuje do uzavretého shadow root, takže `viewer.shadowRoot` je `null` a štýly stránky doň ani z neho neprenikajú; štýlujte ho cez [setTheme](#settheme) a vlastné vlastnosti `--erd-editor-*`. Viacero prehliadačov na jednej stránke si každý uchováva vlastný dokument, zobrazenie, motív a jazyk.  
`<erd-viewer>` nemá vlastnú veľkosť. Vlastný element je riadkový, preto mu nastavte `display: block` a výšku, ako vyššie. Zobrazenie vypĺňa rámček elementu a sleduje jeho zmeny veľkosti pri zachovaní priblíženia.

`src`, `name-view`, `minimap` a `controls` sú jeho jediné atribúty, každý s vlastnosťou rovnakého názvu, `nameView` pre `name-view`. [value](#value) je len vlastnosť.  
Hodnota `value`, `src`, `nameView`, `minimap` alebo `controls` nastavená na elemente skôr, ako je jeho značka definovaná, napríklad frameworkom, ktorý element vykreslí skôr, ako sa načíta vstupný bod, sa prevezme po definovaní značky, pred atribútmi, ktoré mu dalo značkovanie. Preberajú sa v poradí, v akom ich stránka prvýkrát zapísala, takže neskoršia z hodnôt `value` a `src` vyhrá. Hodnota `value`, ktorá neobsahuje dokument, potom nemá komu vyvolať výnimku: ohlási sa ako neodchytená chyba a prehliadač zostane prázdny.

Zostavenie pre značku script, `dist/erd-viewer.umd.js`, obsahuje samotný prehliadač so všetkými závislosťami. Definuje `<erd-viewer>` a vkladá `ErdViewerElement` a `defineErdViewer` do objektu `window.ErdViewer`. Adresa URL CDN bez cesty namiesto toho poskytuje zostavenie editora, preto uveďte súbor – pozrite si časť [Značka script](./installation.md#script-tag).

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

Adresa URL dokumentu, ktorý má prehliadač stiahnuť a zobraziť. Predvolene je `''`, teda žiadna.  
Sťahovanie je obyčajný `fetch()`, `GET` bez vlastných možností, takže ho riadia pravidlá CORS prehliadača: dokument z iného pôvodu potrebuje server, ktorý povoľuje pôvod stránky, a cookies sa posielajú iba pôvodu samotnej stránky. Relatívna adresa URL sa rozrieši voči stránke.  
Odpoveď musí obsahovať dokument tak, ako ho obsahuje súbor `.erd.json`, teda úložnú formu, ktorú zapisuje [value](./erd-editor-element.md#value) editora a každý oficiálny hostiteľ. Nečíta sa žiadny iný formát: súbor SQL, GraphQL, DBML alebo AML zlyhá ako text, ktorý sa nedá spracovať.  
Dokument, ktorý sa spracuje, sa uloží prispôsobený zobrazeniu a vyvolá [load](#load). Požiadavka, ktorú odmietla sieť alebo CORS, odpoveď, ktorá nie je `ok`, alebo text, ktorý sa nedá spracovať, vyvolá [error](#error) a ponechá prázdny diagram – pozrite si časť [Načítanie](#loading).

Počíta sa iba posledná požiadavka. Nový `src` preruší stále bežiace sťahovanie, takže pomalá odpoveď nikdy nepristane nad neskorším dokumentom. Priradenie [value](#value) ho tiež preruší, rovnako ako odstránenie `src` alebo jeho nastavenie na `''`, čo prestane `src` sledovať a ponechá zobrazený dokument tak, ako bol.  
Platí to, čo bolo nastavené naposledy z `value` a `src`, vlastnosťou aj atribútom. `src` zapísaný po `value` sa stiahne, aj keď uvádza adresu URL stiahnutú predtým. Zapísaný znova nad dokumentom, ktorý už zobrazuje, nestiahne nič.  
Prehliadač sťahuje iba vtedy, keď je na stránke. Jeho odstránenie preruší stále bežiace sťahovanie a jeho vrátenie stiahne `src`, ktorý nezobrazil, vrátane toho, ktorý zlyhal, nikdy však taký, ktorý už zobrazuje.  
`src` je jediný `fetch()`, ktorý balík vykonáva, takže prísna politika Content Security Policy uvádza pôvod dokumentu v `connect-src`.

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

Vráti zobrazený dokument, či už pochádza zo `src` alebo z `value`, ako reťazec JSON v úložnej forme, ktorú zapisuje [value](./erd-editor-element.md#value) editora. Kým sa nezobrazí nič, je to nový, prázdny dokument, ktorého `doc` je `{}`.  
Kým je zapnuté [zamknutie](../guide/guides/settings.md#lock) `Viewport` dokumentu, ako je to v novom dokumente, zapíše priblíženie a posunutie, na ktorom je dokument zamknutý, nech čitateľ posunul zobrazenie kamkoľvek. Iba pri vypnutom zamknutí zapíše, kde zobrazenie stojí, vrátane prispôsobenia, ktoré urobí načítanie.  
Zapíše Zobrazenie názvov, ktoré dokument obsahuje, nikdy nie to, ktoré nad ním zobrazuje [nameView](#nameview) alebo panel ovládacích prvkov, ani v dokumente s vypnutým zamknutím `Name View`.  
Dokument vráti aj po [destroy](#destroy).

```js
const data = viewer.value;
```

### setter {#setter}

Zobrazí dokument z jeho textu, nahradí zobrazený a prispôsobí ho zobrazeniu – pozrite si časť [Načítanie](#loading). Prijíma text, ktorý obsahuje súbor alebo `value` editora.  
Text, ktorý sa nedá spracovať, vyvolá výnimku skôr, ako sa čokoľvek zmení, a zobrazený dokument zostane: `SyntaxError` pre text, ktorý nie je JSON, `TypeError` pre JSON, ktorý neobsahuje dokument, napríklad `7`. Prázdny reťazec alebo čokoľvek, čo nie je reťazec, zobrazí prázdny diagram.  
Priradenie preruší stále bežiace sťahovanie `src` a nevyvolá `load` ani `error`.

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

Zobrazí diagram v [Zobrazení názvov](../guide/guides/logical-names.md#name-view) nad tým, ktoré obsahuje dokument: `'physical'` pre `Physical Names`, `'logical'` pre `Logical Names` alebo `'both'` pre `Both Names`. `null`, predvolená hodnota, zobrazuje vlastné zobrazenie dokumentu a hodnota atribútu iná ako tieto tri sa číta ako `null`.  
Zostáva v platnosti nad každým dokumentom načítaným po ňom a [value](#value) ho nikdy nezapíše. Odstránenie atribútu vráti vlastné zobrazenie dokumentu.  
Zoznam `Name View` na [paneli ovládacích prvkov](#controls) tiež prepína zobrazenie, kým nepristane ďalší dokument alebo sa `nameView` znova nezmení. Prepnutie tam sa do `value` tiež nezapisuje.

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

Zobrazí minimapu v pravom hornom rohu, kým dokument obsahuje tabuľku, zobrazenú poznámku alebo zobrazenú skupinu tabuliek. Predvolene je zapnutá.  
Funguje ako minimapa editora: kliknutím na ňu presuniete zobrazenie tam alebo posuniete zobrazenie ťahaním jej obdĺžnika zobrazenej oblasti – pozrite si časť [Pohyb po plátne](../guide/guides/table-related-functions.md#getting-around-the-canvas). Prst na nej patrí stránke, kým prehliadač nedrží fokus.  
Iba `minimap="false"` ju vypne. Atribút bez hodnoty, akákoľvek iná hodnota a žiadny atribút ju ponechajú zapnutú.

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

Zobrazí panel ovládacích prvkov uprostred dolného okraja plátna. Predvolene je zapnutý a zľava doprava obsahuje:

- Priblíženie: `Zoom out`, aktuálne priblíženie v percentách a `Zoom in`. Obe tlačidlá menia priblíženie tak ako klávesy priblíženia a kliknutie na percentá, `Reset zoom`, ho vráti na `100%`. Každé uvádza svoj kláves v bublinovom popise.
- `Fit`, ktoré priblíži a posunie tak, aby sa celý diagram zmestil do zobrazenia, vycentrovaný.
- `Name View`, tlačidlo, ktoré uvádza aktuálne zobrazenie a nad panelom otvorí zoznam `Physical Names`, `Logical Names` a `Both Names` – pozrite si časť [nameView](#nameview).
- Kompas `Go to content`, ktorý sa pripojí na koniec panela iba vtedy, keď na obrazovke nie je žiadna časť diagramu, a presunie zobrazenie k najbližšej časti.

Panel stojí zľava doprava v každom jazyku.  
Iba `controls="false"` ho vypne, spolu s jeho kompasom a zoznamom `Name View`. Atribút bez hodnoty, akákoľvek iná hodnota a žiadny atribút ho ponechajú zapnutý. Bez panela koliesko, stiahnutie prstov a klávesy naďalej približujú, keď prehliadač drží fokus.

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Udalosti {#event}

`load` a `error` sú jediné dve udalosti a obe hlásia o `src`. Ani jedna sa nešíri nahor (bubble), preto počúvajte na samotnom elemente.

### load {#load}

Vyvolá sa, keď sa dokument, ktorý `src` uvádza, stiahol a zobrazil. `event.detail` je `null`.  
Priradenie `value` nevyvolá žiadnu a nevyvolá ju ani sťahovanie, ktoré prerušil neskorší `src`, `value`, odstránenie elementu zo stránky alebo [destroy](#destroy).

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

Vyvolá sa, keď sťahovanie `src` zlyhá: sieť alebo CORS požiadavku odmietli, odpoveď nebola `ok` alebo sa jej text nedal spracovať. Prehliadač potom zobrazí prázdny diagram a oznámenie `Couldn't load the diagram` – pozrite si časť [Načítanie](#loading).  
`event.detail` je príčina: `TypeError`, ktorým `fetch()` zamietne, `Error` s uvedením stavu, napríklad `GET /missing.erd.json answered 404 Not Found`, alebo `SyntaxError` či `TypeError` parsera.  
Sťahovanie, ktoré niečo prerušilo, nevyvolá nič.

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

Nastaví predvoľbu motívu s `ThemeOptions` editora – pozrite si časť [setPresetTheme](./erd-editor-element.md#setpresettheme).  
Prehliadač začína s `appearance: 'system'`, `grayColor: 'slate'` a `accentColor: 'indigo'`, takže už od prvého snímku zobrazuje svetlý alebo tmavý vzhľad, ktorý hlási operačný systém, a prepne sa, keď sa zmení. Editor namiesto toho začína tmavý.  
Každé pole sa uplatní samostatne, takže čiastočné volanie ponechá ostatné dve také, aké sú. Hodnota, ktorá nie je jedným z názvov, sa ignoruje a volanie nikdy nevyvolá výnimku.  
Prehliadač nemá nástroj na tvorbu motívu ani `systemDarkMode` a pre motív nevyvolá žiadnu udalosť.

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

Určuje svetlý alebo tmavý vzhľad, ktorý zobrazuje vzhľad `'system'`, pre stránku s vlastným svetlým a tmavým vzhľadom. Kým je jeden určený, zmeny operačného systému sa ignorujú.  
`null` alebo akákoľvek hodnota iná ako `'dark'` či `'light'` sa vráti k sledovaniu operačného systému.  
Kým je vzhľad `'light'` alebo `'dark'`, na obrazovke sa nič nezmení, ale hodnota sa zachová a uplatní sa hneď, ako sa vzhľad stane `'system'`. Nevyvolá nič.

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

Prepíše tokeny motívu nad predvoľbou s tokenmi `Theme` editora – pozrite si časť [setTheme](./erd-editor-element.md#settheme).  
Každé volanie nahradí celú vrstvu prepísaní, takže odovzdajte `{}`, aby ste sa vrátili k predvoľbe. Zachovajú sa iba názvy tokenov s hodnotami typu reťazec a neskoršie `setPresetTheme` vymení predvoľbu pod nimi, kým prepísania zostanú.  
Vlastné vlastnosti CSS `--erd-editor-*` sa dostanú aj k prehliadaču, nastavené na elemente alebo kdekoľvek nad ním – pozrite si časť [Premenné CSS](./erd-editor-element.md#css-variables). Plátno, ku ktorému sa žiadna šablóna štýlov nedostane, ich načíta znova, keď sa zmení šablóna štýlov v `head` stránky alebo keď sa zmení atribút `class` či `style` elementu alebo elementu nad ním. Pravidlo pridané cez `insertRule()` nezmení nič z toho, takže plátno ho prevezme pri najbližšej takej zmene.

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

Nastaví jazyk zobrazenia: `'system'`, predvolená hodnota, alebo jeden z 25 kódov, ktoré uvádza [Jazyk zobrazenia](./erd-editor-element.md#display-language) editora. Čokoľvek iné, napríklad samotné `'ko'` alebo hodnota, ktorá nie je reťazec, sa ignoruje.  
Jazyk mení bublinové popisy panela ovládacích prvkov, zoznam `Name View`, paletu, oznámenia o načítaní a slová, ktoré diagram kreslí sám, napríklad `unnamed`. Názvy, komentáre a zvyšok dokumentu sa nikdy neprekladajú.

Angličtina je súčasťou vstupného bodu prehliadača a uplatní sa pred návratom volania. Každý iný jazyk je samostatný modul, ktorý váš bundler vygeneruje ako časť (chunk) vedľa prehliadača a prehliadač ho stiahne z vášho bundla, keď si stránka o tento jazyk požiada prvýkrát, raz pre všetky prehliadače stránky. Kým nepristane, prehliadač naďalej zobrazuje jazyk, ktorý zobrazoval, v prvom snímku angličtinu. Ak sa nepodarí načítať, prehliadač zobrazí angličtinu a opätovná žiadosť o tento jazyk to skúsi znova.  
Zostavenie pre [značku script](./installation.md#script-tag) obsahuje všetkých 25 jazykov, takže nesťahuje žiadny. Bundle, ktorý obsahuje aj editor, načíta každý jazyk spolu s časťou (chunk) editora – pozrite si časť [Registrácia elementov](./installation.md#registering-the-elements).  
`Promise`, ktorý vráti, sa vyrieši, keď daný jazyk pristane alebo sa ho nepodarí načítať, a nikdy sa nezamietne. Tento jazyk, alebo angličtina po zlyhaní, je potom v platnosti, pokiaľ neskoršie volanie nepožiadalo o iný: neskoršie volanie vyhrá bez ohľadu na to, v akom poradí jazyky pristanú.

Hebrejčina, arabčina a perzština rozložia paletu a oznámenia o načítaní sprava doľava. Plátno, minimapa, posúvacie lišty a panel ovládacích prvkov s kompasom zostávajú zľava doprava, ako plátno editora – pozrite si časť [Jazyky písané sprava doľava](../guide/guides/language-and-theme.md#right-to-left-languages).  
Prehliadač nastavuje `lang` a `dir` na vlastnom koreni vnútri uzavretého shadow root, nikdy na hostiteľskom elemente ani na stránke.  
Nevyvolá nič a prehliadač nemá výber jazyka ani nič neukladá.

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

Určuje jazyk, ktorý predstavuje `'system'`, ako značku BCP 47, pre stránku s vlastným nastavením jazyka.  
Značka sa orezá o medzery. `null`, prázdny reťazec alebo hodnota, ktorá nie je reťazec, sa vráti k jazykom stránky.  
Tými sú `<html lang>` stránky a potom `navigator.languages` prehliadača, prečítané raz, keď sa prehliadač prvýkrát pripojí. `'system'` vezme prvý z nich, pre ktorý prehliadač jazyk má, podľa pravidla editora v [setSystemLocale](./erd-editor-element.md#setsystemlocale), a angličtinu, keď nemá ani jeden z nich. Stránka, ktorej `<html lang>` uvádza jazyk, ktorý prehliadač má, preto zobrazuje tento jazyk bez ohľadu na to, čo uprednostňuje prehliadač, a neskoršia zmena `lang` alebo jazykov prehliadača nepresunie žiadny prehliadač.  
Záleží na ňom iba vtedy, keď je v platnosti možnosť `'system'`, a jeho `Promise` sa vyrieši ako pri [setLocale](#setlocale).

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

Ukončí prehliadač natrvalo. Zruší zobrazenie pred návratom, či už je element ešte na stránke, alebo bol predtým odstránený, preruší stále bežiace sťahovanie `src` a prestane sledovať farebnú schému operačného systému a štýly stránky.  
Zničený prehliadač už nič nekreslí, nič nesťahuje a nežiada o žiadny jazyk, ani keď sa znova pridá na stránku. Čítanie [value](#value) naďalej vráti dokument, ktorý držal.  
Odstránenie elementu zo stránky ho nezničí: vrátený pokračuje a stiahne `src`, ktorý ešte nezobrazil – pozrite si časť [Načítanie](#loading).

```js
viewer.destroy();
```

## Fokus a klávesy {#focus-and-keys}

Prehliadač nezíska fokus pri pripojení, pri pristátí dokumentu ani pri zatvorení palety, takže sám nikdy neposunie stránku k sebe ani nepreberie klávesy stránky.  
Kliknutie alebo ťuknutie na jeho plátno mu dá fokus bez posunutia stránky a je jednou zastávkou klávesu `Tab`. Na rozdiel od editora nemá vlastný člen `focus()` ani `blur()`. Stlačenie kdekoľvek inde na stránke fokus znova odoberie.

Kým prehliadač nedrží fokus, stránka si ponecháva koliesko, ktoré posúva stránku, a stiahnutie prstov na touchpade. Prst na plátne posúva stránku a nič neposúva a každý kláves sa dostane na stránku nezablokovaný.  
Keď fokus drží:

- Koliesko posúva zobrazenie a `Shift + Wheel` ho posúva do strany. Nad poznámkou, ktorej text pretečie, koliesko posúva poznámku.
- `Ctrl + Wheel` (Windows/Linux) alebo `⌘ + Wheel` (Mac), stiahnutie prstov na touchpade alebo dva prsty na dotykovej obrazovke približujú.
- Prst posúva zobrazenie.
- `Ctrl + Plus` a `Ctrl + Minus` (Windows/Linux) alebo `⌘ + Plus` a `⌘ + Minus` (Mac) menia priblíženie ako tlačidlá `Zoom in` a `Zoom out` a `Ctrl + 0` (Windows/Linux) alebo `⌘ + 0` (Mac) ho vráti priamo na `100%`, pričom stred obrazovky zostane tam, kde je.
- `Ctrl + K` (Windows/Linux) alebo `⌘ + K` (Mac) otvorí paletu a `Esc` ju zatvorí.

Toto sú jeho jediné klávesy a nedajú sa prepriradiť. Každý iný kláves sa dostane na stránku nezablokovaný, s fokusom aj bez neho: `Delete`, `Backspace`, `Space`, `Enter`, `Tab`, `Ctrl + A`, `Ctrl + F` a každá kombinácia, ktorá v editore upravuje.

Paleta vyhľadáva iba v dokumente a neuvádza žiadny príkaz. Jej prázdne pole zobrazuje predpony: `#` vyhľadáva tabuľky, `@` stĺpce, `:` komentáre a poznámky a `?` uvádza predpony, ako v editore – pozrite si časť [Vyhľadávanie v diagrame](../guide/guides/quick-search.md#searching-the-diagram). Slovo bez predpony zobrazí `No commands match` nad riadkami, ktoré v diagrame vyhľadávajú toto slovo.  
Zvolenie riadka presunie zobrazenie podľa pravidla editora, [Kam vedie skok](../guide/guides/table-related-functions.md#where-a-jump-lands), pričom priblíženie ponechá a obrysom označí to, čo dosiahlo, prenesené do popredia: tabuľku, tabuľku, ktorá obsahuje stĺpec alebo komentár, alebo poznámku.  
Zvolenie riadka alebo stlačenie `Esc` zatvorí paletu a ponechá fokus bez elementu, takže ďalšie koliesko posúva stránku; kliknutím na zobrazenie mu znova dáte koliesko a klávesy. Kým je paleta otvorená, koliesko posúva jej zoznam a klávesy priblíženia nerobia nič.

S fokusom aj bez neho ťahanie hlavným tlačidlom myši posúva zobrazenie odkiaľkoľvek na plátne, aj nad tabuľkou. Kliknutie alebo ťuknutie bez pohybu zvýrazní vzťahy: na tabuľke vzťahy tejto tabuľky, na čiare vzťahu túto čiaru, kdekoľvek inde, vrátane poznámky, zvýraznenie zhasne. Takéto kliknutie zruší aj obrys, ktorý zanechal skok z palety. Ukazovateľ spočívajúci na tabuľke zvýrazňuje jej vzťahy, kým tam je.  
Žiadne stlačenie nič nevyberie, nepresunie ani neupraví. Neexistuje iný výber než obrys skoku, žiadny výberový rámec a ani dvojité kliknutie či `Enter` neotvorí bunku.

## Načítanie {#loading}

Kým sa `src` načítava, oznámenie uprostred plátna hlási `Loading diagram` vedľa točiaceho sa indikátora. Keď načítanie zlyhá, hlási `Couldn't load the diagram` vedľa výstražného symbolu, kým jeho miesto nezaujme nový `src` alebo `value`, alebo sa `src` neodstráni. Stlačenia prechádzajú oznámením na plátno a oznámenie sa číta v jazyku zobrazenia, sprava doľava v jazyku písanom sprava doľava.

Každý dokument, ktorý pristane, zo `src` alebo z `value`, sa prispôsobí rámčeku prehliadača: priblíži a posunie sa tak, aby sa celý diagram zmestil, vycentrovaný, ako to robí `Fit`, pričom priblíženie a posunutie, ktoré uložil súbor, sa odloží. Dokument odovzdaný skôr, ako má prehliadač veľkosť, nastavený pred jeho umiestnením na stránku alebo kým je jeho rámček prázdny, sa prispôsobí, keď veľkosť získa. Neskoršia zmena veľkosti zachová priblíženie; `Fit` prispôsobí znova.

Prehliadač sťahuje `src` iba vtedy, keď je na stránke. Jeho odstránenie preruší stále bežiace sťahovanie a jeho vrátenie stiahne `src`, ktorý nezobrazil, vrátane toho, ktorý zlyhal, nikdy však taký, ktorý už zobrazuje. Prehliadač, ktorý už nepotrebujete, ukončite pomocou [destroy](#destroy).

## Čo pridáva na stránku {#what-it-adds-to-a-page}

- Žiadny worker. Nespúšťa žiadny, takže Content Security Policy pre neho nepotrebuje `worker-src`.
- Žiadne ukladanie. Nezapisuje žiadny cookie, `localStorage`, `sessionStorage` ani IndexedDB.
- Dva druhy požiadaviek: sťahovanie [src](#src), ktorého pôvod prísna politika uvádza v `connect-src`, a modul jazyka zobrazenia inú ako angličtina, z vášho vlastného bundla – pozrite si časť [setLocale](#setlocale).
- Štýly v konštruovaných štýlových tabuľkách, ktoré prísne `style-src` prepúšťa. Prehliadač bez konštruovaných štýlových tabuliek, napríklad Firefox pred verziou 101, dostane namiesto nich elementy `<style>`, ktoré potrebujú `style-src 'unsafe-inline'`.
- Poslucháče na `window`. Import vstupného bodu pridá tri na celý život stránky, pre `mousedown`, `touchstart` a vlastnú udalosť balíka `@dineug/erd-editor/internal-forward-move-start`. Konva, ktorá kreslí plátno, nastaví `window.Konva` a s prvým stage pridá poslucháče myši a dotyku na `window` a poslucháč `visibilitychange` na `document`, ktoré nikdy neodstráni. Vstupný bod editora pridá tie isté.
- Až do [destroy](#destroy) každý prehliadač sleduje farebnú schému operačného systému a štýly stránky kvôli vlastným vlastnostiam, ktoré opisuje [setTheme](#settheme).
