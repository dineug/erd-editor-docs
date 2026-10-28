---
sidebar_position: 2
description: API elementu erd-editor – jeho registrácia, atribúty, value a runtimeValue, udalosti, motívy, jazyk zobrazenia, uvítacia obrazovka, klávesové skratky a import a export schémy.
---

# ErdEditorElement

Editor je obyčajný element `HTMLElement`, značka `<erd-editor>`, ktorú definuje import `@dineug/erd-editor/erd-editor.js`.  
Od verzie `5.0.0` import koreňa balíka nedefinuje žiadnu značku. Koreň exportuje `ErdEditorElement` ako typ aj triedu elementu a `defineErdEditor()`, ktorá definuje značku tam, kde ju zavoláte – pozrite si časť [Registrácia elementov](./installation.md#registering-the-elements).  
Pre stránku, ktorá iba zobrazuje diagram, je [`<erd-viewer>`](./erd-viewer-element.md) samostatný element iba na čítanie.

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
```

Jeho definícia typu je takáto.

```ts
interface ErdEditorElement extends HTMLElement {
  readonly: boolean;
  systemDarkMode: boolean; // system dark/light auto
  enableThemeBuilder: boolean;
  enableLocalePicker: boolean;
  enableWelcomeScreen: boolean;
  value: string;
  readonly runtimeValue: string;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  destroy: () => void;
  setInitialValue: (value: string) => void;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => void;
  setSystemLocale: (locale: string | null) => void;
  setKeyBindingMap: (
    keyBindingMap: Partial<
      Omit<
        KeyBindingMap,
        | 'edit'
        | 'stop'
        | 'undo'
        | 'redo'
        | 'zoomIn'
        | 'zoomOut'
        | 'zoomReset'
      >
    >
  ) => void;
  setSchemaSQL: SetSchema;
  setSchemaGraphQL: SetSchema;
  setSchemaDBML: SetSchema;
  setSchemaAML: SetSchema;
  setSchemaJSON: (
    value: string,
    options?: { mode?: 'replace' | 'append' }
  ) => void;
  getSchemaSQL: (
    databaseVendor?: DatabaseVendor,
    options?: SchemaSQLOptions
  ) => string;
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
  setDiffValue: (value: string) => void;
}
```

Editor sa vykresľuje do uzavretého shadow root, takže `editor.shadowRoot` je `null` a štýly stránky neprenikajú dnu ani von.  
K ničomu vnútri sa nedá dostať selektorom – namiesto toho upravujte jeho vzhľad pomocou [setTheme](#settheme) a vlastných vlastností CSS `--erd-editor-*`.

`readonly`, `system-dark-mode`, `enable-theme-builder`, `enable-locale-picker` a `enable-welcome-screen` sú jediné atribúty a všetkých päť má predvolenú hodnotu `false`. Posledné dva sú nové vo verzii `4.0.0`. Každý z nich číta svoju hodnotu tak, ako to opisuje časť [readonly](#readonly).

Od verzie `4.1.0` má karta ERD [prieskumník](../guide/guides/explorer.md), strom diagramu ukotvený naľavo od plátna s hľadaním a nahrádzaním v hornej časti. Žiadny atribút, vlastnosť, metóda ani udalosť ho neotvára, nezatvára ani o ňom neinformuje: otvára sa tlačidlom `Explorer` na paneli nástrojov, položkou `Toggle Explorer` v rýchlom vyhľadávaní či v kontextovej ponuke plátna alebo klávesovou skratkou [`findReplace`](#setkeybindingmap).  
Každý element začína so zatvoreným prieskumníkom. To, či je otvorený, jeho šírka, zbalenie a vyhľadávanie pretrvávajú rovnako dlho ako element, cez prepínanie kariet aj každé načítanie vrátane metódy `setInitialValue`, a nikdy nie sú súčasťou `value`, `runtimeValue`, histórie zmien ani zdieľaného úložiska.

Od verzie `4.2.0` môžu mať tabuľky a stĺpce popri svojich názvoch aj [logické názvy](../guide/guides/logical-names.md) a Zobrazenie názvov, nastavenie dokumentu rovnako ako karta, určuje, či plátno vykresľuje ich fyzické názvy, logické názvy alebo oboje.  
Panel nástrojov má aj kartu [Slovník](../guide/guides/dictionary.md), umiestnenú medzi kartami `Code Generator` a `Settings`, ktorá obsahuje slová, termíny a domény dokumentu a hárok `Checks`. Je to karta ako ostatné: jej hodnotu `canvasType`, `'@dineug/erd-editor/builtin-dictionary'`, uchováva zamknutie `Canvas Type`, takže text uložený na nej sa cez [setInitialValue](#setinitialvalue) otvorí na nej a prepnutie na ňu sa zapíše do vlastnosti `value` a vyvolá udalosť [change](#change) iba vtedy, keď je toto zamknutie vypnuté. Žiadny vlastný atribút, vlastnosť, metóda ani udalosť ju neotvára ani o nej neinformuje. Jej úpravy sú zmenami dokumentu: sú súčasťou vlastnosti `value`, vyvolávajú udalosť [change](#change) a dostanú sa k spolupracovníkom, ich vrátenie späť a opätovné vykonanie však prebieha vo vlastnej histórii každého hárka, nie v histórii dokumentu.  
Vlastný stav karty – ktorý hárok sa zobrazuje, na začiatku hárok `Domains`, a vyhľadávanie, výber, posunutie a šírky stĺpcov každého hárka – pretrváva rovnako dlho ako element, cez prepínanie kariet aj každé načítanie, a nikdy nie je súčasťou vlastnosti `value` ani `runtimeValue`, histórie zmien ani zdieľaného úložiska.  
Rozhranie `ErdEditorElement` nezískava žiadneho nového člena. API pridáva pole `logicalNameAsComment` v možnostiach metódy [getSchemaSQL](#getschemasql), dvanásť [tokenov motívu](#settheme) a export [dictionaryRowChords](#dictionaryrowchords).

## readonly {#readonly}

Nastavuje, či je možné editor upravovať.  
Kým je nastavený, priradenie vlastnosti `value`, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, `setSchemaJSON()`, vrátenie späť aj opätovné vykonanie, od verzie `4.2.0` vrátane tých v hárku karty Slovník, sa ignorujú a udalosť `change` sa nikdy nevyvolá. Dokument namiesto toho načítajte pomocou [setInitialValue](#setinitialvalue).  
Od verzie `5.0.0` je editor iba na čítanie čitateľom, a nie editorom s vypnutými ovládacími prvkami. Ponecháva si svojich šesť kariet, [prieskumník](../guide/guides/explorer.md#read-only-editors), minimapu, rýchle vyhľadávanie, Vlastnosti tabuľky, [Prehliadač rozdielov](../guide/guides/table-related-functions.md#diff-viewer), `Export`, režim Zen a kurzory, fokusy a výbery spolupracovníkov a každý ovládací prvok, ktorý by upravoval diagram, vynecháva namiesto toho, aby ho vykreslil vypnutý. Pred verziou `5.0.0` sa mnohé jeho ovládacie prvky na úpravy ešte vykresľovali a editor zahodil to, čo poslali.

Na karte ERD ťahanie posúva plátno, nech sa začne kdekoľvek, aj na tabuľke, a stlačenie nič nevyberie, nepresunie ani neotvorí. Ukazovateľ spočívajúci na tabuľke rozsvieti jej vzťahy, nehybné kliknutie na tabuľku alebo vzťah toto rozsvietenie zachová a nehybné kliknutie kdekoľvek inde ho zhasne, ako v [`<erd-viewer>`](./erd-viewer-element.md). Jediným výberom je obrys, ktorý zanechá skok: prechod na riadok prieskumníka, na jednu z jeho zhôd hľadania alebo na výsledok rýchleho vyhľadávania po `#`, `@` alebo `:` vyberie to, k čomu sa dostane, a ďalšie nehybné kliknutie ho zruší. Kopírovanie skopíruje to, čo tento výber obsahuje.  
[Panel nástrojov plátna](../guide/guides/table-related-functions.md#canvas-toolbar) si ponecháva `Zoom out`, úroveň priblíženia (`Reset zoom`), `Zoom in`, zoznam Zobrazenia názvov, `Zen Mode` a kompas, bez `Hand` a `Select`, bez `New Table`, `New Memo` a `New Table Group` a bez tlačidiel vzťahov. Ponuka plátna si ponecháva `View Option`, `Name View`, `Export` a `Diff Viewer`, ponuka tabuľky `Table Properties` a poznámka, vzťah ani skupina tabuliek nevyvolá žiadnu ponuku. Rýchle vyhľadávanie na karte ERD neuvádza žiadny riadok, ktorý by zapisoval do diagramu: ponecháva `Tab`, `Name View`, `Database`, `Export`, `Toggle Explorer`, riadky `Theme` a `Display Language`, ktoré zapínajú [enableThemeBuilder](#enablethemebuilder) a [enableLocalePicker](#enablelocalepicker), a vyhľadávania `#`, `@` a `:`. Na ostatných kartách uvádza to, čo v upraviteľnom editore. Panel nástrojov zobrazuje názov databázy ako text a nemá tlačidlá `Undo`, `Redo` ani `Time Travel`.  
Nič neponúka `Import`, [`Import and Add`](../guide/guides/file-import-export.md#import-and-add), `Auto Layout`, riadok skupiny tabuliek (pozrite si stránku [Skupiny tabuliek](../guide/guides/table-groups.md#read-only-editors)) ani [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) a nezobrazuje sa žiadna [uvítacia obrazovka](#enablewelcomescreen).  
Klávesové skratky, ktoré pridávajú, odstraňujú alebo upravujú, nič nerobia: `edit`, `addTable`, `addColumn`, `addMemo`, `addTableGroup`, `groupSelectedTables`, `removeTable`, `removeColumn`, `removeSelection`, `primaryKey`, `selectAllTable`, `selectAllColumn`, štyri skratky vzťahov a `handTool`, pričom každá sa naďalej zablokuje tak, ako hovorí jej možnosť. Ani prilepenie a `Tab` nič nerobia a dostanú sa na stránku nezablokované. Skratky priblíženia, `zenMode`, `focusView`, `tableProperties` na tabuľke, ktorú vybral skok, `search`, `findReplace`, kopírovanie, `Escape` a klávesy so šípkami naďalej fungujú. Neotvorí sa žiadny editor bunky, názvu poznámky ani skupiny tabuliek a nenakreslí sa žiadny vzťah.

[Hľadanie a nahrádzanie](../guide/guides/find-and-replace.md#read-only-editors) v hornej časti prieskumníka iba hľadá, bez šípky `Toggle Replace` a bez riadka nahradenia. Panel má názov `Explorer` a bublinový popis tlačidla na paneli nástrojov znie v každom editore `Explorer (Ctrl + F)` (Windows/Linux) alebo `Explorer (⌘ + F)` (Mac). Prieskumník sa v editore iba na čítanie otvára od verzie `4.1.0`; od verzie `3.10.0` po verziu `4.0.0` sa tam hľadanie a nahrádzanie otváralo ako plávajúci panel iba na hľadanie s názvom `Find`.  
Vlastnosti tabuľky sa otvárajú z ponuky tabuľky alebo skratkou `tableProperties` a od verzie `3.10.0` zobrazujú vedľa svojho názvu odznak `Read only` a ich karta `Indexes` neponúka žiadne úpravy – pozrite si časť [Vlastnosti tabuľky](../guide/guides/table-related-functions.md#table-properties).  
Karta Nastavenia nesie rovnaký odznak `Read only` a zobrazuje každé nastavenie v ovládacom prvku, ktorý neprijme stlačenie: jeho dva prepínače, pole `Maximum comment width` a sedem tlačidiel `Lock` sú vypnuté a riadky `Column Order` sa nedajú ťahať. Skripty `Before tables` a `After tables` na karte Schéma SQL neprijímajú písanie. Karta [Vizualizácia](../guide/guides/visualization.md) funguje ako v upraviteľnom editore, keďže tam nič neupravuje dokument; v režime Flow sa naďalej dá krokovať tlačidlami `Previous table` a `Next table` alebo klávesmi na vrátenie späť a opätovné vykonanie.  
Karta [Slovník](../guide/guides/dictionary.md#read-only-editors) sa naďalej otvára: jej hárky možno prepínať, prehľadávať, vyberať v nich, posúvať a kopírovať z nich a riadok hárka `Checks` naďalej prejde na to, čo uvádza. Žiadna bunka neprijme úpravu, prilepenie ani vymazanie, karta nezobrazuje nástroje `Add Row`, `Delete Rows`, `Import CSV` ani `Export CSV` ani ponuku mriežky a jej kombinácie klávesov pre riadky nič nevložia ani neodstránia. Ponuka tabuľky, ponuka plátna a rýchle vyhľadávanie neponúkajú položky [`Derive Physical Names Again`](../guide/guides/dictionary.md#derive-physical-names-again) ani `Derive Physical Name Again`.

Od verzie `5.0.0` nastavenia, ktoré čitateľ ešte môže zmeniť, zostávajú na obrazovke tohto editora: posunutie a priblíženie, karta, databáza, jazyk Generátora kódu, oba štýly názvov, typ úvodzoviek, riadky `View Option` a [Zobrazenie názvov](../guide/guides/logical-names.md#read-only-editors) z každého jeho výberu, ktoré na obrazovke zostáva od verzie `4.2.0`. Bez ohľadu na ich [zamknutia](../guide/guides/settings.md#lock) sa žiadne z nich nedostane do `value`, `runtimeValue`, exportu `json`, histórie vrátenia späť, udalosti [change](#change) ani zdieľaného úložiska, takže `value` si zachová nastavenia dokumentu, nech sa čitateľ pozerá akokoľvek. Panely možností [Schéma SQL](../guide/guides/schema-sql.md#read-only-editors) a Generátora kódu označujú tieto nastavenia popisom `This window only`, kým je nastavené `readonly`, kde sa v upraviteľnom editore píše `Saved in the document`. To, čo obe karty zobrazujú, kopírujú a ukladajú, sa riadi obrazovkou, rovnako ako [getSchemaSQL](#getschemasql) zavolané bez databázového systému.  
Pred verziou `5.0.0` sa posunutie, priblíženie, prepnutie karty, databáza a nastavenia kódu čitateľa dostali do `value`, kým ich nedržalo žiadne zamknutie, čo pri databáze nikdy nie je, a zdieľané úložisko ich posielalo ostatným editorom.  
Voľby `This window only` na karte Schéma SQL, `Statements`, `Header`, od verzie `4.2.0` `Write logical names into empty comments` a `Tables`, sa v žiadnom editore nikdy neukladajú a naďalej platia, rovnako ako dialógové okno [`Export image`](../guide/guides/file-import-export.md#image), výber motívu a výber jazyka. Zvolenie možnosti vo výbere motívu alebo vo výbere jazyka naďalej vyvolá udalosť [changePresetTheme](#changepresettheme) alebo [changeLocale](#changelocale).

Kým je nastavené, do histórie vrátenia späť nevstupuje nič, ani posunutie či priblíženie, a [zdieľané úložisko](#getsharedstore) editora neodosiela žiadnu zmenu: iba to, čo odosielajú jeho sledovače kurzora, fokusu, výberu a výberového rámca čitateľa, a registre, o ktoré žiada iný editor pri pripojení (pozrite si stránku [Spoločné úpravy](./advanced/collaborative-editing.md)). Naďalej aplikuje každú zmenu, ktorú pošlú ostatné. Zmena databázy, nastavenia Generátora kódu alebo riadku `View Option` sa dostane do dokumentu a aj na obrazovku, pokiaľ tam čitateľ toto nastavenie nezmenil, a zdieľané prepnutie Zobrazenia názvov sa na obrazovke prejaví tak či onak.

Jeho zapnutie ukončí všetko, čo bolo otvorené: editor bunky, názvu poznámky alebo skupiny tabuliek, kreslený vzťah, ťahanie tabuľky, poznámky, skupiny tabuliek alebo stĺpca, kópie ťahania s Alt, zmenu veľkosti poznámky alebo skupiny tabuliek, ešte bežiaci náhľad alebo umiestňovanie Automatického rozloženia, `Map Columns`, Time Travel a výber farby. Zruší výber, odloží nástroj Ruka a najprv odošle to, čo každé zdieľané úložisko ešte drží z presúvania alebo posunutia, tak ako to robí [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers). Vlastnosti tabuľky, teraz iba na čítanie, Prehliadač rozdielov a dialógové okno `Export image` zostávajú otvorené a posunutie, priblíženie, karta a Zobrazenie názvov zostanú také, aké boli. Element, ktorý je pri prvom pripojení iba na čítanie, sa začína rovnako, a element, ktorý hostiteľ presunie na stránke, si ponechá obrys, ktorý zanechal skok.  
Jeho vypnutie vráti ovládacie prvky na úpravy bez čohokoľvek vybraného alebo otvoreného. Databáza, jazyk Generátora kódu, oba štýly názvov, typ úvodzoviek a riadky `View Option` sa vrátia na hodnoty dokumentu, kým posunutie, priblíženie, karta a Zobrazenie názvov zostanú tam, kde ich čitateľ nechal, a `value` si ponechá hodnoty dokumentu, kým ich čitateľ znova nezmení. Ani jedno prepnutie nevyvolá `change`.  
Atribút bez hodnoty, `=""` aj `="true"` sa čítajú ako `true`. `="false"` sa číta ako `false` a rovnako aj akýkoľvek iný reťazec – vrátane idiómu HTML `readonly="readonly"`.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode {#systemdarkmode}

Určuje, či sa má editor automaticky synchronizovať s tmavým/svetlým režimom systému.  
Od verzie `4.0.0` jeho zapnutie nastaví vlastnosť `appearance` motívu na `'system'`, rovnako ako `setPresetTheme({ appearance: 'system' })`. Editor potom zobrazuje svetlý alebo tmavý vzhľad, ktorý hlási operačný systém, alebo ten, ktorý určí [setSystemAppearance](#setsystemappearance), a prepne sa, keď sa tento vzhľad zmení.  
Neskoršie volanie [setPresetTheme](#setpresettheme) s hodnotou `'light'` alebo `'dark'` alebo voľba `Light` či `Dark` vo výbere motívu alebo v rýchlom vyhľadávaní nahradí `'system'` a tento vzhľad zostane: ďalšia zmena v operačnom systéme ho už neprepíše, hoci `systemDarkMode` je stále `true`. Pred verziou `4.0.0` ho ďalšia zmena v operačnom systéme prepísala.  
Jeho vypnutie, kým je vzhľad `'system'`, ponechá svetlý alebo tmavý vzhľad zobrazený v tej chvíli. Jeho vypnutie po tom, ako sa vzhľad zmenil z `'system'` na iný, ponechá vzhľad tak, ako je.  
Jeho zmena nevyvolá žiadnu udalosť.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder {#enablethemebuilder}

Určuje, či je k dispozícii používateľské rozhranie na jednoduché nastavenie prednastavených motívov.  
Zobrazí tlačidlo `Theme` na paneli nástrojov, ktoré otvára výber motívu s možnosťami `Accent color`, `Gray color` a `Appearance`. Od verzie `4.0.0` ponúka `Appearance` okrem možností `Light` a `Dark` aj `System` a kým je tento atribút zapnutý, rýchle vyhľadávanie ponúka položku `Theme` s možnosťami `System`, `Light` a `Dark`. Pozrite si stránku [Jazyk a motív](../guide/guides/language-and-theme.md).

![Otvorenie výberu motívu z panela nástrojov, voľba farby zvýraznenia a odtieňa sivej a prepnutie vzhľadu na Light a potom na System](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

Zmena prednastaveného motívu v tomto paneli alebo v rýchlom vyhľadávaní vyvolá udalosť [changePresetTheme](#changepresettheme).

## enableLocalePicker {#enablelocalepicker}

Od verzie `4.0.0` určuje, či je k dispozícii používateľské rozhranie na výber jazyka zobrazenia editora.  
Zobrazí tlačidlo `Display Language` na paneli nástrojov, za tlačidlom `Theme`, keď sú zobrazené obe. Tlačidlo otvára výber jazyka a rýchle vyhľadávanie ponúka položku `Display Language`. V oboch je k dispozícii možnosť `System` a 25 jazykov – pozrite si stránku [Jazyk a motív](../guide/guides/language-and-theme.md).  
Rozhoduje aj o tom, čo editor zobrazuje, kým sa nezavolá [setLocale](#setlocale) alebo kým sa nezvolí jazyk: `'system'`, kým je zapnutý, angličtinu, kým je vypnutý, takže element, ktorý nič nenastavuje, si ponechá angličtinu, ktorú vždy zobrazoval. Jeho zapnutie alebo vypnutie okamžite prepne medzi týmito dvoma možnosťami. Keď sa jazyk raz nastaví alebo zvolí, táto voľba zostane bez ohľadu na to, či je atribút zapnutý alebo vypnutý.  
Nastavte ho pred pripojením elementu, aby sa už prvá snímka riadila hodnotou `'system'`.  
Zvolenie jazyka vyvolá udalosť [changeLocale](#changelocale).

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen {#enablewelcomescreen}

Od verzie `4.0.0` určuje, či prázdny diagram privíta čitateľa [uvítacou obrazovkou](../guide/guides/editing-start.md#welcome-screen).  
Zobrazuje sa nad kartou ERD, kým dokument nemá žiadnu tabuľku, žiadnu zobrazenú poznámku ani žiadnu zobrazenú skupinu tabuliek. Nezobrazuje sa, kým je nastavený atribút `readonly`, v režime Zen ani vtedy, keď sú otvorené Vlastnosti tabuľky, prehliadač rozdielov, cestovanie v čase alebo ukážka automatického rozloženia. Prvá tabuľka, zobrazená poznámka alebo zobrazená skupina tabuliek ju skryje a vrátenie späť do prázdneho diagramu ju znova zobrazí.  
Jej riadky `New Table`, `New Memo` a `Command Palette` zobrazujú prvú kombináciu klávesov pre `addTable`, `addMemo` a `search` tak, ako ich ponechala metóda [setKeyBindingMap](#setkeybindingmap), a pre názov ponechaný prázdny nezobrazujú žiadnu. Jej šípky ukazujú na tlačidlá `Theme` a `Display Language` iba tam, kde ich zobrazujú `enableThemeBuilder` a `enableLocalePicker`.  
V jej ponuke klávesy `↑`, `↓`, `Home` a `End` presúvajú fokus medzi riadkami, pričom sa zabráni ich predvolenej akcii a zastaví sa ich šírenie. Pri klávesoch `Enter` a `Space` sa zastaví šírenie, ale predvolenej akcii sa nezabráni, takže ich prevezme riadok s fokusom, a kláves `Escape` v zozname formátov `Import` vráti ponuku späť, pričom sa zabráni jeho predvolenej akcii a zastaví sa jeho šírenie. Každý iný kláves sa ako zvyčajne dostane k editoru aj k stránke.  
V dokumente nič nemení, takže ponechá vlastnosť `value` nezmenenú a nevyvolá udalosť `change`.  
Zapnite tento atribút až potom, ako [setInitialValue](#setinitialvalue) načíta dokument, rovnako ako to robia oficiálne hostiteľské aplikácie, aby obrazovka nikdy nezablikala nad súborom, ktorý sa ešte načítava.

```js
editor.enableWelcomeScreen = true;
// or
editor.setAttribute('enable-welcome-screen', 'true');
```

```html
<erd-editor enable-welcome-screen></erd-editor>
```

## value {#value}

### getter {#getter}

Vráti aktuálny dokument ako reťazec JSON v [schéme](./advanced/schema.md), ktorú definuje editor.  
Od verzie `4.0.0` je to úložná forma, teda dokument tak, ako ho uchováva súbor, čo je zároveň to, čo zapisuje export `json` a čo ukladajú oficiálne hostiteľské aplikácie. Obsahuje iba aktuálne entity, bez odstránených, bez poradia prekrývania a bez toho, čo si editor vypočíta sám, napríklad namerané šírky, značky kľúčov a body ukotvenia vzťahov. Kľúče jeho entít majú pevné poradie, je odsadený o dve medzery a končí znakom nového riadka, takže rovnaký dokument vždy dá rovnaké bajty.  
Od verzie `4.2.0` vynecháva aj to, čo je prázdne: prázdny zoznam v objekte `doc`, prázdnu kolekciu, riadok slovníka, ktorý nič neobsahuje, a prázdne textové pole entity, napríklad názov, komentár, typ údajov, predvolenú hodnotu alebo farbu. Zoznam vnútri entity, napríklad `columnIds` tabuľky, sa zapíše aj vtedy, keď je prázdny. Objekt `doc` nového dokumentu je `{}` a dokument nemá žiadne `collections`, preto chýbajúce pole, zoznam alebo kolekciu čítajte ako prázdne. Obsahuje logické názvy a príznaky odvodených názvov tabuliek a stĺpcov, prepojenia stĺpcov s doménami a slová, termíny a domény, pričom každý slovník sa zapíše ako jedna hlavička s názvami polí a za ňou jeho riadky, každý na samostatnom riadku, v poradí hárka. Pozrite si časť [Úložná forma a hodnota za behu](./advanced/schema.md#storage-form-and-runtime-value).  
Každé nastavenie, ktorého [zamknutie](../guide/guides/settings.md#lock) je zapnuté, sa zapíše s hodnotou, na ktorej je zamknuté, nie tak, ako ho ukazuje obrazovka. Zamknutie `Viewport` uchováva `originX`, `originY` a `zoomLevel` a každé zo zamknutí `Canvas Type`, `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` a od verzie `4.2.0` `Name View` uchováva svoje vlastné nastavenie. Zobrazenie názvov sa zapisuje ako `nameViewMode`, a to iba vtedy, keď nemá hodnotu `'physical'`. Každé iné nastavenie sa zapíše tak, ako je, a `lockSettings` sa zapíše vždy. Informácie o jednotlivých bitoch nájdete v časti [Settings](./advanced/schema.md#settings); bit zamknutia `Name View` sa číta opačne.  
Od verzie `5.0.0` sa nastavenia, ktoré mení čitateľ editora [iba na čítanie](#readonly), zapisujú tiež s hodnotami dokumentu, zamknuté či nie, keďže zostávajú na jeho obrazovke.  
Nový dokument má zapnuté všetky zamknutia, či už ide o ten, ktorý element zobrazuje predtým, ako dostane hodnotu, alebo o dokument načítaný z prázdnej hodnoty. Jeho vlastnosť `value` uchováva počiatok na `0, 0`, úroveň priblíženia `1`, kartu ERD, predvolený jazyk na karte Generátor kódu, štýly názvov a typ úvodzoviek a od verzie `4.2.0` zobrazenie `Physical Names`, kým sa príslušné zamknutie nevypne.  
Pred verziou `4.0.0` vracala celý dokument tak, ako ho uchovával editor, s uplatneným nastavením `ignoreSaveSettings`. Dokument tak, ako ho uchováva editor, je teraz [runtimeValue](#runtimevalue) a `ignoreSaveSettings` sa už nečíta ani nezapisuje.

```js
const data = editor.value;
```

### setter {#setter}

Načíta predtým uložený stav editora. Nahradí celý dokument – aktuálny sa najprv vymaže. Od verzie `4.2.0` to zahŕňa aj slová, termíny a domény: dokument prevezme tie, ktoré obsahuje text, alebo žiadne, a vlastná história zmien každého hárka karty Slovník sa vyprázdni.  
Rovnako ako `clear()`, `setInitialValue()` a metódy `setSchema*` v predvolenom režime `mode: 'replace'` zahodí aj zobrazenie Flow na karte Vizualizácia: jeho rozloženie, tabuľky, na ktoré je zúžené, zobrazenie riadkov, priblíženie a posunutie a od verzie `4.2.0` aj tabuľky, ktorými krokujú jeho tlačidlá `Previous table` a `Next table`. Pridanie (`mode: 'append'`) ho nezahodí.  
Zaznamená sa do histórie, čo umožňuje `Undo, Redo`, a vyvolá udalosť `change`.  
Prijíma úložnú formu, hodnotu [runtimeValue](#runtimevalue) alebo súbor uložený staršou verziou.  
Prázdny reťazec alebo čokoľvek, čo nie je reťazec, načíta nový dokument namiesto vyvolania chyby, preto hodnotu pred priradením skontrolujte.  
Tento nový dokument je ten, ktorým začína `setInitialValue('')`: prázdny, s predvolenými nastaveniami a od verzie `4.0.0` so zapnutými všetkými zamknutiami. Vo verzii `3.10.x` neukladal ani polohu posunutia, ani úroveň priblíženia, zatiaľ čo predtým ukladal obe.  
Zdieľané úložisko prepošle toto načítanie spolupracovníkom s úplným JSON nového dokumentu, takže každý účastník, aj ten so staršou verziou, ho načíta, hoci editor starší ako verzia `4.2.0` zahodí to, čo nepozná, napríklad logické názvy, prepojenia s doménami a slovníky – pozrite si časť [Kombinovanie verzií](./advanced/collaborative-editing.md#mixing-releases).  
Od verzie `4.0.0` pochádzajú zamknutia načítaného dokumentu a zamknuté hodnoty, ktoré potom zapisuje `value`, z textu a zobrazenie sa presunie tam, kam ho umiestňuje text, alebo na diagram, ak by sa tam z diagramu nič nevykreslilo. Pri každom ďalšom nastavení, ktoré text zamyká – karta, jazyk na karte Generátor kódu, štýly názvov, typ úvodzoviek a od verzie `4.2.0` Zobrazenie názvov –, editor naďalej zobrazuje to, čo zobrazoval pred načítaním. Nastavenie, ktoré text ponecháva odomknuté, preberie hodnotu z textu. Súbor uložený pred verziou `4.2.0` neuvádza zamknutie `Name View`, pokiaľ ho v ňom editor verzie `4.2.0` nevypol, takže sa načíta so Zobrazením názvov zamknutým na zobrazení `Physical Names` a editor si ponechá Zobrazenie názvov, ktoré zobrazoval. [setInitialValue](#setinitialvalue) naopak preberá všetky hodnoty, ktoré text obsahuje; tam nájdete aj informácie o texte, ktorý neuvádza žiadne zamknutia.  
Ani text, ktorý nie je JSON, napríklad súbor so zostávajúcimi značkami konfliktu zlúčenia, nevyvolá chybu: dokument sa vyprázdni, jeho nastavenia zostanú také, aké boli, a chyba parsovania sa zapíše do konzoly.  
Kým je nastavený atribút `readonly`, ignoruje sa; na načítanie do editora iba na čítanie použite [setInitialValue](#setinitialvalue).

```js
editor.value = 'json...';
```

## runtimeValue {#runtimevalue}

Od verzie `4.0.0` vracia dokument tak, ako ho uchováva tento editor, ako reťazec JSON. Nemá setter, takže pokus o jej priradenie v kóde v prísnom režime (strict mode) vyvolá výnimku.  
Obsahuje to, čo [value](#value) vynecháva: odstránené entity a ich poradie, poradie prekrývania, namerané šírky, značky kľúčov, body ukotvenia vzťahov a sekvencie a od verzie `4.2.0` prázdne textové polia, zoznamy v objekte `doc` a kolekcie; riadky odstránené z hárka karty Slovník a riadky, ktoré nič neobsahujú; kľúč poradia každého riadka slovníka; zoznamy slov, termínov a domén v objekte `doc`; a prepojenie s odstránenou doménou. Zamknuté nastavenia sa aj tu zapisujú so zamknutými hodnotami.  
Použite ju na inicializáciu ďalšieho editora, ktorý sa pripája k už prebiehajúcej relácii, napríklad spolupracovníka alebo druhého zobrazenia toho istého dokumentu, cez jeho [setInitialValue](#setinitialvalue). Vrátenie odstránenia späť, ktoré relácia pošle neskôr, potom v ňom obnoví entitu celú, zatiaľ čo editor inicializovaný z `value` neobsahuje žiadnu odstránenú entitu a namiesto toho obnoví prázdnu tabuľku bez názvu alebo od verzie `4.2.0` prázdny riadok slovníka. Pozrite si stránku [Spoločné úpravy](./advanced/collaborative-editing.md).  
Odstránené entity sa už nijako nezbierajú, takže v nej zostávajú, kým sa dokument nabudúce neotvorí zo svojho súboru.  
Nikdy ju nezapisujte do súboru: ukladajte vlastnosť `value`, ktorú [JSON Schema](./advanced/schema.md#json-schema) prijíma, túto však nie.

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue {#setinitialvalue}

Načíta predtým uložený stav editora. Samotné načítanie sa nezaznamená do histórie, takže sa nedá vrátiť späť, a nevyvolá sa žiadna udalosť `change`.  
Vymaže aj históriu zmien, takže nič, čo sa urobilo pred načítaním, sa nedá vrátiť späť ani znova vykonať na načítanom dokumente, a od verzie `4.2.0` aj vlastnú históriu každého hárka karty Slovník.  
Prijíma úložnú formu, hodnotu [runtimeValue](#runtimevalue) alebo súbor uložený staršou verziou a na rozdiel od priradenia vlastnosti `value` preberá všetky nastavenia, ktoré text obsahuje, vrátane karty a nastavení kódu.  
Prázdny reťazec alebo čokoľvek, čo nie je reťazec, načíta nový dokument namiesto vyvolania chyby, takže `setInitialValue('')` začne prázdny diagram.  
Od verzie `4.0.0` má tento nový dokument, ktorý element zobrazuje aj predtým, ako dostane akúkoľvek hodnotu, zapnuté všetky zamknutia. Posúvanie, zmena priblíženia, prepínanie kariet a zmena jazyka na karte Generátor kódu, štýlov názvov, typu úvodzoviek alebo od verzie `4.2.0` Zobrazenia názvov ponechajú vlastnosť `value` nezmenenú a nevyvolajú udalosť `change`. Vo verzii `3.10.x` neukladal ani polohu posunutia, ani úroveň priblíženia, zatiaľ čo predtým ukladal obe.  
Dokument načítaný z textu si ponechá zamknutia, ktoré uvádza. Dokument, ktorý neuvádza žiadne – akýkoľvek súbor uložený pred verziou `4.0.0` bez ohľadu na to, čo uvádzalo jeho `ignoreSaveSettings`, a súbor `.vuerd` verzie v2 –, sa otvorí so zapnutými všetkými zamknutiami, so zamknutím `Viewport` na počiatku `0, 0` a úrovni priblíženia `1`, na karte ERD a s jazykom, štýlmi názvov a typom úvodzoviek tak, ako ich uložil.  
Od verzie `4.2.0` sa text, ktorý uvádza svoje zamknutia, ale nie zamknutie `Name View`, otvorí aj s týmto zamknutím zapnutým, a to aj vtedy, keď sú všetky ostatné zamknutia vypnuté. Súbor uložený pred verziou `4.2.0` je takýmto textom, pokiaľ v ňom editor verzie `4.2.0` toto zamknutie nevypol (pozrite si časť [Settings](./advanced/schema.md#settings)). Otvorí sa v zobrazení `Physical Names`, rovnako ako text, ktorý neuvádza žiadne zamknutie.  
V oboch prípadoch sa zobrazenie otvorí na polohe zobrazenia dokumentu – pri texte, ktorý uvádza svoje zamknutia, na tej, ktorú uložil, pri texte bez nich na počiatku `0, 0` s úrovňou priblíženia `1` –, alebo na diagrame, ak by sa tam z neho nič nevykreslilo. Pri zamknutom nastavení `Viewport` obsahuje vlastnosť `value` naďalej jeho zamknuté hodnoty.  
Od verzie `4.0.0` zahodí aj stav spolupráce predtým uchovávaného dokumentu a [zdieľané úložisko](#getsharedstore) tohto editora, ktoré je už prihlásené na odber, znova požiada ostatné editory o ich stav, takže editor znova načítaný v prebiehajúcej relácii dobehne ostatných. Takýto editor inicializujte hodnotou [runtimeValue](#runtimevalue) iného editora.  
Ani text, ktorý nie je JSON, nevyvolá chybu: dokument sa vyprázdni, jeho nastavenia zostanú také, aké boli, a chyba parsovania sa zapíše do konzoly.  
Na rozdiel od priradenia vlastnosti `value` ju atribút `readonly` neblokuje, takže práve takto načítate dokument do editora iba na čítanie. Editor iba na čítanie potom zobrazí nastavenia, ktoré obsahuje načítaný text, a zahodí tie, ktoré čitateľ na obrazovke zmenil.

```js
editor.setInitialValue('json...');
```

Načítanie pri štarte, uloženie pri zmene.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Udalosti {#event}

`change`, `changePresetTheme` a `changeLocale` sú jediné tri verejné udalosti; udalosť `changeLocale` je nová vo verzii `4.0.0`.  
Element na sebe vyvoláva aj interné udalosti `@dineug/erd-editor/internal-*` pre vlastné vnútorné prepojenie; tie nie sú súčasťou API.

### change {#change}

Keď v editore nastanú zmeny, vyvolá udalosť.  
Udalosť sa vyvoláva s oneskorením (debounce) 200 ms a nevyvolá sa, kým je `readonly` nastavený na `true`.  
Vyvolá sa pri akejkoľvek zmene dokumentu – pri úprave v používateľskom rozhraní, priradení vlastnosti `value`, `clear()`, každej z metód `setSchema*` a od verzie `4.0.0` aj pri `setSchemaJSON()` a `Import and Add`. Metóda `setInitialValue` ju nevyvolá.  
Od verzie `4.2.0` sem patrí každá úprava na karte [Slovník](../guide/guides/dictionary.md) a každé jej vrátenie späť alebo opätovné vykonanie, zmena logického názvu alebo prepojenia s doménou, príkaz `Derive Physical Names Again` a prepnutie Zobrazenia názvov, kým je zamknutie `Name View` vypnuté.  
Nevyvolá ju nič, čo sa urobí v režime Flow na karte Vizualizácia – priblíženie, posúvanie, presúvanie kartičiek, `Tidy Up`, zobrazenie riadkov, zúženie zobrazenia z kartičky ani od verzie `4.2.0` krokovanie tlačidlami `Previous table` a `Next table` alebo klávesmi na vrátenie späť a opätovné vykonanie –, pretože nič z toho nie je zmenou dokumentu. Výnimkou je jeho zoznam `Name View`: prepnutie v ňom ju vyvolá, kým je zamknutie `Name View` vypnuté, rovnako ako prepnutie na karte ERD.  
Od verzie `4.0.0` ju nevyvolá ani zmena nastavenia, ktorého [zamknutie](../guide/guides/settings.md#lock) je zapnuté, pretože mení iba obrazovku a nikdy nie vlastnosť `value`: posunutie alebo zmena priblíženia plátna ERD, kým je zamknuté nastavenie `Viewport`, prepnutie karty, kým je zamknuté nastavenie `Canvas Type`, zmena jazyka na karte Generátor kódu, štýlu názvov tabuliek, štýlu názvov stĺpcov alebo typu úvodzoviek, kým je zapnuté jeho vlastné zamknutie, a od verzie `4.2.0` prepnutie Zobrazenia názvov, kým je zamknuté nastavenie `Name View`. Vynechávajú sa iba tieto zmeny, takže dávka, ktorá zároveň upravuje dokument, ju naďalej vyvolá. Zamknutie alebo odomknutie nastavenia ju vyvolá.  
V novom dokumente a v akomkoľvek súbore uloženom pred verziou `4.0.0` sú zapnuté všetky zamknutia a v akomkoľvek súbore uloženom pred verziou `4.2.0` je zapnuté zamknutie `Name View`, pokiaľ ho tam editor verzie `4.2.0` nevypol, takže predvolene posúvanie, zmena priblíženia, prepínanie kariet a prepínanie Zobrazenia názvov nevyvolajú nič. Týka sa to zamerania na tabuľky z karty ERD, tlačidla externého odkazu na kartičke, ktoré vás z režimu Flow vráti na kartu ERD, prechodu na riadok prieskumníka alebo na zhodu vyhľadávania, otvorenia prieskumníka alebo prechodu na výsledok rýchleho vyhľadávania z inej karty a od verzie `4.2.0` prechodu na tabuľku alebo stĺpec z riadka hárka `Checks` na karte Slovník. Každý z týchto úkonov vyvolá jednu udalosť `change` iba vtedy, keď je vypnuté zamknutie, ktoré sa ho týka: `Canvas Type` pri prepnutí karty a `Viewport` pri posunutí, ktoré urobí aj tlačidlo na kartičke, výsledok rýchleho vyhľadávania, riadok prieskumníka, zhoda vyhľadávania alebo riadok hárka `Checks`. Od verzie `4.1.0` sa každé z týchto posunutí riadi jedným pravidlom, [Kam vedie skok](../guide/guides/table-related-functions.md#where-a-jump-lands), takže výsledok rýchleho vyhľadávania pre tabuľku už neposúva zobrazenie zakaždým a skok, ktorý pravidlo ponechá na mieste, nevykoná žiadne posunutie, pre ktoré by sa udalosť vyvolala. Otvorenie, zatvorenie alebo zmena veľkosti prieskumníka zúži alebo rozšíri plátno bez posunutia jeho počiatku a takisto nevyvolá nič. Pred verziou `4.0.0` posúvanie, zmena priblíženia a prepínanie kariet udalosť vyvolali vždy, aj keď hodnota `editor.value` vyšla rovnaká.  
Ak chcete vynechať zápisy, ktoré nič nemenia, porovnávajte `editor.value` s hodnotou, ktorú ste naposledy uložili, nie so súborom, ktorý ste načítali: súbor zapísaný staršou verziou, súbor verzie v2 alebo ručne upravený súbor môže vo vlastnosti `value` vyjsť inak hneď po načítaní, pretože ho vlastnosť `value` zapisuje v úložnej forme. To isté platí pre súbor, ktorého zamknutie `Viewport` je vypnuté a ktorého počiatok na tejto obrazovke nevykreslí nič z diagramu: načítanie presunie zobrazenie na diagram a `value` zapíše miesto, kam sa dostalo. Od verzie `4.0.0` to už nespôsobujú namerané šírky, pretože `value` žiadne neobsahuje. Od verzie `4.2.0` môže inak vyjsť aj súbor uložený verziou `4.0.0` alebo `4.1.0`, keďže `value` teraz vynecháva jeho prázdne textové polia, zoznamy a kolekcie, takže sa takýto súbor jedenkrát prepíše, a to pri najbližšom uložení. Hostiteľská aplikácia, ktorá zapisuje súbory, môže namiesto toho rozlíšiť úpravu od zmeny zobrazenia pomocou vlastnosti `changed` replikačného úložiska – pozrite si časť [on@change](./advanced/remote-storage.md#onchange).  
Udalosť nenesie žiadnu vlastnosť `detail`, neprebubláva ani neprekračuje hranicu shadow DOM, preto ju počúvajte priamo na elemente a v obsluhe čítajte `editor.value`.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme {#changepresettheme}

Vyvolá sa, keď sa prednastavený motív zmení vo vstavanom výbere motívu alebo od verzie `4.0.0` cez položku `Theme` v rýchlom vyhľadávaní. Vyvolá ju každá voľba vrátane voľby možnosti, ktorá už platí.  
Vlastné volanie [setPresetTheme](#setpresettheme) alebo [setSystemAppearance](#setsystemappearance) ani zapnutie či vypnutie [systemDarkMode](#systemdarkmode) ju nevyvolá.  
`event.detail` je úplný objekt `ThemeOptions` po voľbe – `{ appearance, grayColor, accentColor }` –, nie čiastočný objekt, ktorý bol požadovaný. Od verzie `4.0.0` má jeho pole `appearance` hodnotu `'system'`, kým je zvolená možnosť `System`, nie svetlý alebo tmavý vzhľad, ktorý sa zobrazuje, preto ho uložte tak, ako je, a odovzdajte ho späť metóde `setPresetTheme`.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale {#changelocale}

Od verzie `4.0.0` sa vyvolá, keď sa v editore zvolí jazyk, vo výbere jazyka alebo cez položku `Display Language` v rýchlom vyhľadávaní, pričom obe zapína [enableLocalePicker](#enablelocalepicker).  
Vyvolá sa po uplatnení jazyka, pri každej voľbe vrátane voľby možnosti, ktorá už platí. [setLocale](#setlocale) a [setSystemLocale](#setsystemlocale) ju nikdy nevyvolajú a nevyvolá ju ani zmena jazykov prehliadača. Prepnutie jazyka nevyvolá udalosť `change`.  
`event.detail` je `{ locale }`, hodnota typu `LocaleOption`: `'system'`, keď bola zvolená možnosť `System`, inak kód jazyka. Element si voľbu nepamätá, preto ju uložte a pri ďalšom načítaní ju odovzdajte metóde `setLocale`.  
Rovnako ako udalosť `change` ani táto udalosť neprebubláva, preto ju počúvajte priamo na elemente.

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus {#focus}

Presunie fokus na editor.

```js
editor.focus();
```

## blur {#blur}

Odoberie fokus z editora.

```js
editor.blur();
```

## clear {#clear}

Vyprázdni dokument, pričom odstráni všetky tabuľky, stĺpce, vzťahy, indexy a poznámky, od verzie `4.0.0` aj všetky skupiny tabuliek a od verzie `4.2.0` slová, termíny a domény karty Slovník, pričom vyprázdni aj vlastnú históriu zmien každého hárka.  
Všetky nastavenia zostanú vrátane databázy, polohy zobrazenia, úrovne priblíženia, možností zobrazenia tabuliek, každého zamknutia s hodnotou, ktorú uchováva, a skriptov `Before tables` a `After tables` na karte Schéma SQL, takže vyprázdnený súbor naďalej ukladá to, čo ukladal. Ak chcete namiesto toho začať nový dokument, priraďte vlastnosti `value` hodnotu `''` alebo zavolajte `setInitialValue('')`.  
Zaznamená sa do histórie, takže sa dá vrátiť späť, a vyvolá udalosť `change`. Vrátenie späť obnoví dokument tak, ako ho uchovával editor, vrátane jeho slov, termínov a domén, každé zamknuté nastavenie so zamknutou hodnotou. Kým je nastavený atribút `readonly`, ignoruje sa.

```js
editor.clear();
```

## destroy {#destroy}

Úplne zničí inštanciu editora, takže ju už nemožno znova použiť.  
Uvoľní poslucháčov a odbery editora a zničí každé zdieľané úložisko, ktoré vrátila metóda [getSharedStore](#getsharedstore).  
Dávka prúdu, ktorú zdieľané úložisko ešte zadržiava, sa zahodí spolu s ním; ak ju chcete odoslať, najprv zavolajte metódu [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) tohto úložiska.

```js
editor.destroy();
```

## setKeyBindingMap {#setkeybindingmap}

Predefinuje klávesové skratky.  
`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut` a `zoomReset` sú pevné a nedajú sa predefinovať.  
Zapisuje sa iba dvadsaťjeden nižšie uvedených názvov; čokoľvek iné v objekte sa ignoruje vrátane pevných názvov.  
Od verzie `3.10.0` sa dá predefinovať `search` a `findReplace` je nový. Predtým bol `search` pevný. Od verzie `4.0.0` je nový `removeSelection`. Od verzie `4.1.0` sú `addTableGroup` a `groupSelectedTables` nové.  
Hodnota klávesovej skratky musí byť typu `ShortcutOption[]`. Samotný reťazec sa ignoruje, preto píšte `{ addTable: [{ shortcut: 'Alt+KeyN' }] }`, nie `{ addTable: 'Alt+KeyN' }`.  
Prázdne pole sa prijme a nepriradí nič: `setKeyBindingMap({ findReplace: [] })` prenechá `Ctrl + F` (Windows/Linux) alebo `⌘ + F` (Mac) stránke a `{ search: [] }` urobí to isté pre `Ctrl + K` (Windows/Linux) alebo `⌘ + K` (Mac). Tlačidlo `Search` na paneli nástrojov naďalej otvára rýchle vyhľadávanie, tlačidlo `Explorer` na paneli nástrojov naďalej otvára a zatvára prieskumníka a položka `Toggle Explorer` v rýchlom vyhľadávaní a v kontextovej ponuke plátna naďalej otvára jeho vyhľadávanie alebo ho zatvára; žiadne z nich nezobrazuje klávesovú skratku pre názov ponechaný prázdny. `{ removeSelection: [] }` prenechá `Delete` a `Backspace` stránke a položky na odstránenie v ponukách tabuľky, poznámky a skupiny tabuliek (`Delete`, `Delete selected`, `Delete column`, `Delete columns`) potom nezobrazujú žiadnu klávesovú skratku.  
Od verzie `4.1.0` prenechá `{ addTableGroup: [] }` stránke `Alt + G` (Windows/Linux) alebo `⌥ + G` (Mac) a `{ groupSelectedTables: [] }` prenechá `T` a potom `G`. `New Table Group` na paneli nástrojov plátna, v kontextovej ponuke plátna a v rýchlom vyhľadávaní, `Group selected tables` v ponuke tabuľky a `Group Selected Tables` v rýchlom vyhľadávaní naďalej fungujú, len bez zobrazenej klávesovej skratky. Bublinové popisy tlačidiel `New Table`, `New Memo` a `New Table Group` na paneli nástrojov plátna uvádzajú prvú kombináciu klávesov pre `addTable`, `addMemo` a `addTableGroup` alebo pri klávesovej skratke ponechanej prázdnej iba názov tlačidla.  
Od verzie `4.2.0` určujú `addColumn` a `removeColumn` aj kombinácie klávesov pre riadky v mriežke karty Slovník, ako je opísané nižšie, takže zmena priradenia ktoréhokoľvek z nich presunie spolu s ním aj tieto kombinácie. `{ addColumn: [] }` nenechá mriežke žiadnu kombináciu na vkladanie riadkov a dve položky vkladania v ponuke mriežky potom nezobrazujú žiadnu klávesovú skratku; `{ removeColumn: [] }` jej nenechá žiadnu na ich odstraňovanie a položka odstránenia v ponuke a bublinový popis `Delete Rows` potom nezobrazujú žiadnu.  
Volanie je čiastočné zlúčenie: názvy, ktoré vynecháte, si ponechajú predvolené hodnoty a dvojnásobné volanie zachová skoršie zmeny. Pre aktuálne klávesové skratky neexistuje getter: [createKeyBindingMap](#createkeybindingmap) vracia predvolené hodnoty, nie to, čo zmenila metóda `setKeyBindingMap`.

```ts
type ShortcutOption = {
  shortcut: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

const defaultKeyBindingMap: Omit<
  KeyBindingMap,
  | 'edit'
  | 'stop'
  | 'undo'
  | 'redo'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
> = {
  search: [
    { shortcut: '$mod+KeyK', preventDefault: true, stopPropagation: true },
  ],
  findReplace: [
    { shortcut: '$mod+KeyF', preventDefault: true, stopPropagation: true },
  ],
  addTable: [{ shortcut: 'Alt+KeyN', preventDefault: true }],
  addColumn: [{ shortcut: 'Alt+Enter', preventDefault: true }],
  addMemo: [{ shortcut: 'Alt+KeyM', preventDefault: true }],
  addTableGroup: [
    { shortcut: 'Alt+KeyG', preventDefault: true, stopPropagation: true },
  ],
  groupSelectedTables: [{ shortcut: 'KeyT KeyG', preventDefault: true }],
  removeTable: [
    { shortcut: '$mod+Backspace', preventDefault: true },
    { shortcut: '$mod+Delete', preventDefault: true },
  ],
  removeColumn: [
    { shortcut: 'Alt+Backspace', preventDefault: true },
    { shortcut: 'Alt+Delete', preventDefault: true },
  ],
  removeSelection: [
    { shortcut: 'Delete', preventDefault: true },
    { shortcut: 'Backspace', preventDefault: true },
  ],
  primaryKey: [{ shortcut: 'Alt+KeyK', preventDefault: true }],
  selectAllTable: [
    { shortcut: '$mod+KeyA', preventDefault: true },
    { shortcut: '$mod+Alt+KeyA', preventDefault: true },
  ],
  selectAllColumn: [{ shortcut: 'Alt+KeyA', preventDefault: true }],
  relationshipZeroOne: [{ shortcut: '$mod+Alt+Digit1', preventDefault: true }],
  relationshipZeroN: [{ shortcut: '$mod+Alt+Digit2', preventDefault: true }],
  relationshipOneOnly: [{ shortcut: '$mod+Alt+Digit3', preventDefault: true }],
  relationshipOneN: [{ shortcut: '$mod+Alt+Digit4', preventDefault: true }],
  tableProperties: [{ shortcut: 'Alt+Space', preventDefault: true }],
  focusView: [
    { shortcut: 'Alt+KeyF', preventDefault: true, stopPropagation: true },
  ],
  handTool: [{ shortcut: 'Space', preventDefault: true }],
  zenMode: [
    { shortcut: 'Alt+KeyZ', preventDefault: true, stopPropagation: true },
  ],
};

// example
editor.setKeyBindingMap({
  addTable: [{ shortcut: '$mod+KeyN', preventDefault: true }],
});
```

`selectAllTable`, `handTool`, `removeSelection` a od verzie `4.1.0` aj `groupSelectedTables` ustupujú textovému kurzoru: kým je fokus v poli input, textarea alebo v elemente `contenteditable`, `$mod + A` vyberie text, `Space` napíše medzeru, `Delete` a `Backspace` mažú text a stlačenie `T` a potom `G` napíše obe písmená, namiesto toho, aby sa stlačenia dostali k plátnu. Ani pri jednom z týchto stlačení sa nezabráni predvolenej akcii. Čokoľvek, na čo ich znova priradíte, sa správa rovnako.

Od verzie `4.0.0` odstráni `removeSelection` (`Delete` alebo `Backspace`) výber na karte ERD ako jeden krok histórie zmien, bez potvrdenia. Keď je tabuľka s fokusom jediným vybratým objektom, je vybratý jeden alebo viac jej stĺpcov a priblíženie vykresľuje jej riadky, odstráni tieto stĺpce; inak odstráni všetky vybraté tabuľky, poznámky a skupiny tabuliek, pričom tabuľky skupiny zostanú. Pozrite si časť [Odstraňovanie tabuliek a poznámok](../guide/guides/table-related-functions.md#table-and-memo-deletion).  
Podržaný kláves odstráni iba raz a nič sa neodstráni, kým je otvorený editor bunky, poznámky alebo názvu skupiny tabuliek. Mimo textového poľa a panelov a kariet, ktoré zadržiavajú klávesové skratky (pozrite si časť [createKeyBindingMap](#createkeybindingmap)), sa predvolenej akcii stlačenia zabráni na každej karte, kým má editor fokus, aj na tlačidle panela nástrojov s fokusom a aj v editore iba na čítanie, kde nič neodstráni.

Od verzie `4.1.0` pripraví `addTableGroup` (`Alt+KeyG`) na karte ERD kreslenie `New Table Group`, pri ktorom ďalšie stlačenie hlavného tlačidla myši na plátne nakreslí skupinu, a opätovné stlačenie kreslenie zruší, rovnako ako tlačidlo `New Table Group` na paneli nástrojov plátna. `groupSelectedTables` (`KeyT KeyG`, `T` a potom `G`) vloží vybraté tabuľky do novej skupiny a otvorí editor jej názvu, rovnako ako položka `Group selected tables` v kontextovej ponuke tabuľky. Keď nie je vybratá žiadna tabuľka, nepridá nič; vybratá poznámka ani skupina tabuliek sa nepočíta. Pozrite si časti [Nakreslenie skupiny](../guide/guides/table-groups.md#drawing-a-group) a [Zoskupenie vybratých tabuliek](../guide/guides/table-groups.md#grouping-selected-tables).  
Obe fungujú iba tam, kde ponuky ponúkajú skupinu: nie, kým je nastavený atribút `readonly`, kým možnosť zobrazenia `Table Groups` skrýva skupiny, ani kým je otvorený editor bunky, poznámky alebo názvu skupiny tabuliek. Rovnako ako ostatné klávesové skratky plátna fungujú iba na karte ERD, a to nie vtedy, keď je otvorené rýchle vyhľadávanie, Vlastnosti tabuľky, prehliadač rozdielov, cestovanie v čase, ukážka automatického rozloženia, `Export image` alebo `Map Columns`. Tam, kde nemajú žiadny účinok, sa predvolenej akcii stlačenia aj tak zabráni, pokiaľ `groupSelectedTables` neustúpi textovému kurzoru. Pri `addTableGroup` sa tiež zastaví šírenie, rovnako ako pri `focusView` a `zenMode`, takže prebublávajúci poslucháč `keydown` na stránke ho nikdy nezachytí.

Od verzie `4.2.0` na karte [Slovník](../guide/guides/dictionary.md#adding-and-deleting-rows) každá kombinácia klávesov `addColumn` na jedno stlačenie vloží pod výber toľko riadkov, koľko ich výber pokrýva, tá istá kombinácia s podržaným klávesom `Shift` ich vloží nad výber a každá kombinácia klávesov `removeColumn` na jedno stlačenie odstráni riadky, ktoré výber pokrýva: s predvolenými hodnotami sú to `Alt+Enter`, `Alt+Shift+Enter` a `Alt+Backspace` alebo `Alt+Delete`. Fungujú v mriežke hárkov `Domains`, `Words` a `Terms`, kým nie je otvorená úprava bunky. Kombinácia `addColumn`, ktorá už obsahuje `Shift`, nedáva žiadnu kombináciu na vkladanie nad výber a sekvencia priradená ktorémukoľvek z týchto dvoch názvov nedáva mriežke nič.  
Predvolenej akcii každého takého stlačenia sa zabráni podľa toho, čo určuje jeho možnosť, a jeho šírenie sa vždy zastaví, takže na karte ERD nepridá ani neodstráni žiadny stĺpec. V hárku `Checks` a v editore iba na čítanie nemá žiadny účinok, hoci sa jeho predvolenej akcii naďalej zabráni a šírenie sa zastaví. V otvorenej úprave bunky alebo v poli vyhľadávania karty sa kombinácie prenechajú textu: šírenie sa tam zastaví, predvolenej akcii sa však nezabráni, takže pole na ne reaguje ako kdekoľvek inde (na Macu `⌥ + Backspace` odstráni slovo). Uvádza ich [dictionaryRowChords](#dictionaryrowchords).

Od verzie `3.10.0` otvára `findReplace` (`$mod+KeyF`) [hľadanie a nahrádzanie](../guide/guides/find-and-replace.md). Od verzie `4.1.0` otvára a zatvára [prieskumníka](../guide/guides/explorer.md#opening-and-closing), ktorý ho obsahuje, a karta Klávesové skratky ho uvádza ako `Toggle Explorer`.  
Kým je tlačidlo `Explorer` na paneli nástrojov zobrazené ako stlačené (prieskumník je otvorený na karte ERD a nie je skrytý režimom Zen), zatvorí prieskumníka, pokiaľ nie je otvorené rýchle vyhľadávanie, Vlastnosti tabuľky, výber motívu, výber jazyka, dialógové okno `Export image` alebo `Map Columns`. Inak zatvorí to z nich, čo je otvorené, z akejkoľvek inej karty prepne na kartu ERD a otvorí prieskumníka s textovým kurzorom v jeho poli `Find` a s vybratým hľadaným textom. Editor, ktorý je príliš úzky na to, aby zobrazil prieskumníka vedľa plátna, ho ponechá otvoreného, ale odsunutého nabok, a zobrazí oznámenie `Widen the window to show the Explorer`. Pred verziou `4.1.0` otváral plávajúci panel hľadania a nahrádzania alebo vracal fokus klávesnice jeho poľu a nikdy ho nezatváral.  
Neustupuje textovému kurzoru: kým má editor fokus, zachytí sa na každej karte, z plátna aj zo vstupného poľa v editore. Predvolenej akcii stlačenia sa zabráni, takže prehliadač neotvorí panel hľadania, a šírenie sa zastaví, takže ho nezachytí žiadny prebublávajúci poslucháč `keydown` na stránke. Keď je otvorený editor bunky alebo poznámky, od verzie `4.0.0` editor názvu skupiny tabuliek alebo od verzie `4.2.0` úprava bunky v mriežke karty Slovník, predvolenej akcii sa naďalej zabráni a šírenie sa zastaví, ale samotná klávesová skratka nemá žiadny účinok. V tomto poslednom prípade nemá žiadny účinok ani `search`, takže doteraz napísaný text zostane.  
Kým je na ktorejkoľvek karte otvorený prehliadač rozdielov, cestovanie v čase alebo ukážka automatického rozloženia, alebo kým metóda vstupu (IME) ešte skladá znaky, predvolenej akcii sa nezabráni ani sa nezastaví šírenie, takže stlačenie dostane vlastné hľadanie prehliadača alebo hostiteľskej aplikácie. V prieskumníkovi sa pri stlačení počas skladania znakov šírenie zastaví, predvolenej akcii sa však nezabráni. Čokoľvek, na čo znova priradíte `findReplace`, sa správa rovnako.

`focusView` funguje iba na karte ERD. Keď je vybratá aspoň jedna tabuľka, otvorí kartu Vizualizácia v režime Flow, zúženú na tieto tabuľky a všetky tabuľky vzdialené o jeden vzťah; vybratá poznámka ani skupina tabuliek sa nepočíta a bez vybratej tabuľky nemá žiadny účinok. Pozrite si časť [Zameranie na tabuľky](../guide/guides/visualization.md#focusing-on-tables).

`undo` a `redo` fungujú podľa karty. Na karte ERD vracajú späť a znova vykonávajú zmeny v histórii dokumentu. Od verzie `4.2.0` na karte Slovník vracajú späť a znova vykonávajú zmeny vo vlastnej histórii zobrazeného hárka, v hárku `Checks` však nič – pozrite si časť [Hárky karty Slovník](../guide/guides/undo-redo.md#dictionary-sheets). V režime Flow na karte Vizualizácia sa posúvajú o krok späť a dopredu rovnako ako tlačidlá [`Previous table` a `Next table`](../guide/guides/visualization.md#previous-table-and-next-table) a históriu dokumentu nechávajú bez zmeny. Na ostatných kartách a v režime Graph nevracajú späť nič.

`stop` (`Escape`) na karte ERD ukončí otvorený editor bunky alebo poznámky, alebo práve kreslený vzťah, a ponechá výber tak, ako je. Od verzie `4.0.0` ukončí aj editor názvu skupiny tabuliek bez zapísania názvu a kreslenie `New Table Group`. Editor pri tomto stlačení zavolá `preventDefault()`.  
Keď nie je otvorené nič z toho, `Escape` zruší výber a aktívnu bunku a jeho predvolenej akcii sa nezabráni. Ukončenie úpravy a zrušenie výberu preto vyžaduje dve stlačenia.  
Od verzie `4.2.0`, kým je zobrazený zoznam termínov bunky logického názvu (pozrite si časť [Dopĺňanie názvov termínov](../guide/guides/logical-names.md#completing-term-names)), prvé stlačenie `Escape` zatvorí iba zoznam a editor ponechá otvorený. Predvolenej akcii tohto stlačenia sa zabráni a jeho šírenie sa zastaví už v bunke, takže ho nezachytí ani `stop`, ani prebublávajúci poslucháč `keydown` na stránke.  
Okrem prieskumníka, formátov `Import` na [uvítacej obrazovke](#enablewelcomescreen), zoznamu termínov bunky logického názvu, karty [Slovník](../guide/guides/dictionary.md#keys-on-the-tab) a nižšie uvedených výberov a dialógových okien editor nikdy nezastaví šírenie klávesu `Escape`, takže stránka, ktorá ho sama počúva, napríklad aby zatvorila vlastné dialógové okno, zachytí obe stlačenia a môže vynechať to, ktorého `defaultPrevented` je `true`.  
Kým je otvorené rýchle vyhľadávanie, Vlastnosti tabuľky, prehliadač rozdielov, ukážka automatického rozloženia alebo cestovanie v čase, `Escape` namiesto toho zatvorí to, čo je otvorené, a ponechá výber tak, ako je. Ani pri tomto stlačení sa nezabráni predvolenej akcii.  
Od verzie `4.0.0` zachytí `Escape` aj otvorené dialógové okno [`Export image`](../guide/guides/file-import-export.md#image) alebo [`Map Columns`](../guide/guides/relationship-editing.md#map-columns), ktoré sa zatvorí a ponechá výber tak, ako je. Každé z nich pri otvorení prevezme fokus klávesnice a pri tomto stlačení `Escape` sa zabráni predvolenej akcii aj zastaví šírenie.  
Od verzie `4.1.0` kláves `Escape` stlačený s fokusom v [prieskumníkovi](../guide/guides/explorer.md#keys-in-the-explorer), v jeho strome, poliach alebo tlačidlách, vráti fokus klávesnice plátnu a ponechá prieskumníka otvoreného a výber tak, ako je. Editor na ňom zavolá `preventDefault()` aj `stopPropagation()`, takže sa nikdy nedostane k prebublávajúcemu poslucháčovi `keydown` na stránke.  
Kláves `Escape` stlačený na plátne nikdy nezatvorí prieskumníka. Pred verziou `4.1.0` kláves `Escape` v paneli hľadania a nahrádzania tento panel zatvoril a na plátne ho zatvoril tým istým stlačením, ktoré zrušilo výber.  
Od verzie `4.0.0` sa výber jazyka a výber farby zatvárajú klávesom `Escape`: v nich sa zabráni jeho predvolenej akcii a zastaví sa jeho šírenie a na plátne ich zatvorí tým istým stlačením, ktoré zruší výber, pričom sa nezabráni predvolenej akcii ani sa nezastaví šírenie.  
Kláves `Escape` stlačený, kým metóda vstupu (IME) ešte skladá znaky, patrí skladaniu. Otvorený editor ponechá tak, ako je, a jeho predvolenej akcii sa nezabráni, takže stránka môže tiež vynechať stlačenie, ktorého `isComposing` je `true` alebo ktorého `keyCode` je `229`. V prieskumníkovi sa pri takom stlačení, rovnako ako pri akomkoľvek klávese stlačenom tam počas skladania znakov, zastaví aj šírenie a fokus klávesnice zostane v poli.  
Pred verziou `3.9.2` jediné stlačenie `Escape` ukončilo úpravu alebo kreslenie a zároveň zrušilo výber a editor nikdy nezabránil jeho predvolenej akcii.

### createKeyBindingMap {#createkeybindingmap}

Od verzie `3.9.2` balík exportuje `createKeyBindingMap()` a spolu s ním typy `KeyBindingMap`, `KeyBindingName` a `ShortcutOption`.  
Vracia predvolené klávesové skratky, všetkých 28 názvov vrátane pevných, pri každom volaní ako novú mapu, takže zmena vrátenej mapy nič iné nezmení.  
Z nej vychádza každý editor a volanie `setKeyBindingMap` sa v nej neprejaví.  
Z týchto štyroch je exportom za behu iba `createKeyBindingMap`; ostatné tri sú typy. Od verzie `4.2.0` sa vedľa neho exportuje aj [dictionaryRowChords](#dictionaryrowchords).

```ts
type KeyBindingName =
  | 'edit'
  | 'stop'
  | 'search'
  | 'findReplace'
  | 'undo'
  | 'redo'
  | 'addTable'
  | 'addColumn'
  | 'addMemo'
  | 'addTableGroup'
  | 'groupSelectedTables'
  | 'removeTable'
  | 'removeColumn'
  | 'removeSelection'
  | 'primaryKey'
  | 'selectAllTable'
  | 'selectAllColumn'
  | 'relationshipZeroOne'
  | 'relationshipZeroN'
  | 'relationshipOneOnly'
  | 'relationshipOneN'
  | 'tableProperties'
  | 'focusView'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
  | 'handTool'
  | 'zenMode';

type KeyBindingMap = Record<KeyBindingName, ShortcutOption[]>;

declare function createKeyBindingMap(): KeyBindingMap;

// example
import { createKeyBindingMap } from '@dineug/erd-editor';

const shortcuts = Object.values(createKeyBindingMap())
  .flat()
  .map(({ shortcut }) => shortcut); // 'Enter', 'Escape', '$mod+KeyK', ...
```

Každá hodnota `shortcut` je kombinácia klávesov v syntaxi [tinykeys](https://github.com/jamiebuilds/tinykeys), ktorá pomenúva svoj kláves podľa `KeyboardEvent.code`, pričom [`$mod`](#mod) je v systéme macOS `⌘` a inde `Control`.  
Od verzie `4.0.0` číta editor tieto kombinácie sám, nie cez tinykeys, v rovnakej syntaxi. Kláves sa zhoduje podľa svojho `code` alebo podľa svojho `key` v ľubovoľnej veľkosti písmen a stlačenie sa zhoduje iba vtedy, keď sú podržané presne tie modifikačné klávesy, ktoré uvádza. `AltGraph` sa v systéme Windows počíta ako `Control` a `Alt` a v systéme macOS ako `Alt`. Stlačenia oddelené medzerou tvoria sekvenciu, ktorá sa začne odznova po sekunde bez stlačenia klávesu.  
Od verzie `4.1.0` je jedna z predvolených klávesových skratiek sekvencia: `groupSelectedTables` je `KeyT KeyG`, `T` a potom `G`. Sekvencia sa vykoná pri stlačení, ktoré ju dokončí, a iba toto stlačenie preberá jej `preventDefault` a `stopPropagation`, takže pri predvolených hodnotách sa `T` dostane k stránke a predvolenej akcii sa zabráni iba pri `G`. Ponuky, rýchle vyhľadávanie a karta Klávesové skratky zobrazujú sekvenciu ako jeden kláves na každé stlačenie.  
Pevné názvy sú priradené ku klávesom `Enter` (`edit`), `Escape` (`stop`), `$mod+KeyZ` (`undo`), `$mod+Shift+KeyZ` (`redo`), `$mod+Equal` (`zoomIn`), `$mod+Minus` (`zoomOut`) a `$mod+Digit0` (`zoomReset`). `edit` a `stop` nemajú žiadne príznaky; ostatných päť má `preventDefault` a `stopPropagation`. Zvyšok tvoria vyššie uvedené predvolené hodnoty vrátane `search` a `findReplace`.

Editor ich počúva na vlastnom elemente, takže hostiteľská aplikácia, ktorá zachytáva klávesy skôr ako editor, pomocou globálnych klávesových skratiek alebo poslucháča `keydown` vo fáze zachytávania (capture), ich musí prepustiť, kým má editor fokus.  
Zoznam klávesov na prepustenie zostavte z `createKeyBindingMap()`, pričom predvolené hodnoty nahraďte klávesovými skratkami, ktoré ste odovzdali metóde `setKeyBindingMap`.  
Od verzie `3.10.0` tento zoznam obsahuje `$mod+KeyF`, vlastnú kombináciu klávesov prehliadača na hľadanie. Hostiteľská aplikácia, ktorá si chce na tejto kombinácii ponechať vlastné hľadanie, odovzdá `setKeyBindingMap({ findReplace: [] })`.  
Od verzie `4.0.0` obsahuje aj samotné `Delete` a `Backspace`. Hostiteľská aplikácia, ktorá si chce tieto klávesy ponechať, odovzdá `setKeyBindingMap({ removeSelection: [] })`.  
Od verzie `4.1.0` obsahuje aj `Alt+KeyG` a sekvenciu `KeyT KeyG`, ktorá prichádza ako jeden reťazec: rozdeľte ju v mieste medzery a prepustite každé stlačenie vrátane samotných `T` a `G`, pretože sekvencia, ktorej chýba stlačenie, sa nikdy nedokončí. Hostiteľská aplikácia, ktorá si chce tieto klávesy ponechať, odovzdá `setKeyBindingMap({ addTableGroup: [] })` alebo `setKeyBindingMap({ groupSelectedTables: [] })`.  
Od verzie `4.2.0` doň pridajte kombinácie klávesov, ktoré pre tú istú mapu vráti [dictionaryRowChords](#dictionaryrowchords), medzi nimi aj `Alt+Shift+Enter`. Hostiteľská aplikácia, ktorá si chce tieto klávesy ponechať, odovzdá `setKeyBindingMap({ addColumn: [] })` alebo `setKeyBindingMap({ removeColumn: [] })`, čím ich odoberie aj pridávaniu a odstraňovaniu stĺpcov na karte ERD.

Kým je fokus v prieskumníkovi, v jeho strome, poliach `Find` a `Replace` alebo tlačidlách, `findReplace`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut` a `zoomReset` prechádzajú do editora, takže `findReplace` tam funguje rovnako ako na plátne. Každá iná klávesová skratka v aktuálnom nastavení sa zastaví v prieskumníkovi, sekvencia pri svojom poslednom stlačení (pri predvolených hodnotách samotné `G`), a rovnako aj klávesy šípok, `Tab`, `Enter`, `Space`, `Home`, `End` a akýkoľvek kláves stlačený, kým metóda vstupu (IME) ešte skladá znaky. Okrem klávesu `Escape`, ktorý vráti fokus klávesnice plátnu, sa ich šírenie zastaví bez zabránenia predvolenej akcii, takže v poliach, tlačidlách a strome prieskumníka fungujú ako bežné klávesy a nedostanú sa ani k plátnu, ani k prebublávajúcemu poslucháčovi `keydown` na stránke: `Alt + N` tam nepridá žiadnu tabuľku a `Delete` nič neodstráni. Pri klávesoch, ktoré presúvajú, zbaľujú alebo prechádzajú na riadok stromu, a pri `Enter` v poli `Find` alebo `Replace`, ktorý prechádza zhodami alebo nahrádza, sa navyše zabráni aj predvolenej akcii.  
Akýkoľvek iný kláves, napríklad kombinácia klávesov hostiteľskej aplikácie na uloženie alebo na paletu príkazov, pokračuje ako zvyčajne k stránke. Pozrite si časť [Klávesy v prieskumníkovi](../guide/guides/explorer.md#keys-in-the-explorer). Pred verziou `4.1.0` zadržiaval klávesy rovnakým spôsobom plávajúci panel hľadania a nahrádzania, okrem `Home`, `End`, posledného stlačenia sekvencie a `Space`, kým bol `handTool` priradený k inému klávesu.  
Od verzie `4.0.0` zadržiava klávesy rovnakým spôsobom výber jazyka: tých istých sedem klávesových skratiek prechádza a pri každej inej klávesovej skratke (od verzie `4.1.0` pri sekvencii jej posledným stlačením), klávesoch šípok a `Tab` sa tam zastaví šírenie bez zabránenia predvolenej akcii, rovnako ako pri akomkoľvek klávese stlačenom, kým metóda vstupu (IME) ešte skladá znaky. `↑`, `↓`, `Home`, `End`, `Enter` a `Space` na niektorom z jeho riadkov presúvajú fokus medzi riadkami alebo jeden z nich zvolia a navyše sa zabráni aj ich predvolenej akcii.

Od verzie `4.2.0` zadržiava klávesy aj karta [Slovník](../guide/guides/dictionary.md#keys-on-the-tab), pričom do editora prechádzajú iba `search`, `findReplace`, `undo` a `redo`. `undo` a `redo` pracujú s vlastnou históriou zobrazeného hárka a pri otvorenej úprave bunky alebo s fokusom v poli vyhľadávania karty sa prenechajú textu, pričom šírenie sa tam zastaví, ale predvolenej akcii sa nezabráni. `search` a `findReplace` nemajú pri otvorenej úprave bunky žiadny účinok, ako je uvedené vyššie. Kombinácie klávesov pre riadky fungujú v mriežke tak, ako opisuje text pri `addColumn` a `removeColumn` vyššie.  
Každá iná klávesová skratka v aktuálnom nastavení sa zastaví na karte, sekvencia pri svojom poslednom stlačení, a rovnako aj klávesy šípok, `Tab`, `Enter`, `Space`, `Home`, `End` a akýkoľvek kláves stlačený, kým metóda vstupu (IME) ešte skladá znaky. Žiadny z nich sa nedostane k plátnu ani k prebublávajúcemu poslucháčovi `keydown` na stránke: `Alt + N` tam nepridá žiadnu tabuľku a `Delete` neodstráni nič z diagramu. Udalosti kopírovania, vystrihnutia a prilepenia na karte sa tam tiež zastavia, takže ich diagram nikdy nepovažuje za svoje. Akýkoľvek iný kláves pokračuje ako zvyčajne k stránke.

### dictionaryRowChords {#dictionaryrowchords}

Od verzie `4.2.0` balík exportuje `dictionaryRowChords()`. Pri každom volaní vráti ako nové pole `ShortcutOption[]` všetky kombinácie klávesov, ktorými mriežka karty Slovník vkladá alebo odstraňuje riadky podľa mapy klávesových skratiek, ktorú odovzdáte.  
V tomto poradí sú to kombinácie klávesov `addColumn` na jedno stlačenie, ktoré vkladajú riadky pod výber; každá z nich aj s podržaným klávesom `Shift`, ktorá vkladá riadky nad výber, pričom pre kombináciu, ktorá už obsahuje `Shift`, žiadna; a kombinácie klávesov `removeColumn` na jedno stlačenie, ktoré odstraňujú riadky. Každá si ponechá `preventDefault` a `stopPropagation` klávesovej skratky, z ktorej pochádza, a sekvencia sa vynechá. Pozrite si časť [Pridávanie a odstraňovanie riadkov](../guide/guides/dictionary.md#adding-and-deleting-rows).  
Kombinácia, ktorá vkladá riadky nad výber, s predvolenými hodnotami `Alt+Shift+Enter`, nie je v žiadnej klávesovej skratke, takže hostiteľská aplikácia, ktorá porovnáva modifikačné klávesy presne a zoznam klávesov na prepustenie zostavuje iba z [createKeyBindingMap](#createkeybindingmap), ju nikdy neprepustí. Prepustite oba zoznamy, ako to robí doplnok pre Obsidian.  
Funkcia číta iba mapu, ktorú dostane, nie klávesové skratky elementu, preto jej odovzdajte mapu, z ktorej ste zostavili svoj zoznam klávesov.

```ts
declare function dictionaryRowChords(
  keyBindingMap: KeyBindingMap
): ShortcutOption[];

// example
import { createKeyBindingMap, dictionaryRowChords } from '@dineug/erd-editor';

const map = createKeyBindingMap();
const shortcuts = [
  ...Object.values(map).flat(),
  ...dictionaryRowChords(map),
].map(({ shortcut }) => shortcut);
// dictionaryRowChords(map): 'Alt+Enter', 'Alt+Shift+Enter', 'Alt+Backspace', 'Alt+Delete'
```

### $mod {#mod}

Prepína kláves `Control` v závislosti od prostredia.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Tabuľka klávesových skratiek {#shortcut-table}

Používa vlastnosti `key, code` udalosti klávesnice.  
Na absolútne polohy používajte `code` a na vstupné hodnoty `key`.

| Windows        | macOS           | `key`          | `code`                         |
| -------------- | --------------- | -------------- | ------------------------------ |
| –              | `Command` / `⌘` | `Meta`         | `MetaLeft` / `MetaRight`       |
| `Alt`          | `Option` / `⌥`  | `Alt`          | `AltLeft` / `AltRight`         |
| `Control`      | `Control` / `^` | `Control`      | `ControlLeft` / `ControlRight` |
| `Shift`        | `Shift`         | `Shift`        | `ShiftLeft` / `ShiftRight`     |
| `Space`        | `Space`         | –              | `Space`                        |
| `Enter`        | `Return`        | `Enter`        | `Enter`                        |
| `Esc`          | `Esc`           | `Escape`       | `Escape`                       |
| `Backspace`    | `Delete` / `⌫`  | `Backspace`    | `Backspace`                    |
| `Delete`       | `fn` + `Delete` | `Delete`       | `Delete`                       |
| `1`, `2` atď.  | `1`, `2` atď.   | `1`, `2` atď.  | `Digit1`, `Digit2` atď.        |
| `a`, `b` atď.  | `a`, `b` atď.   | `a`, `b` atď.  | `KeyA`, `KeyB` atď.            |
| `-`            | `-`             | `-`            | `Minus`                        |
| `=`            | `=`             | `=`            | `Equal`                        |
| `+`            | `+`             | `+`            | `Equal`                        |

## Motív {#theme}

### setPresetTheme {#setpresettheme}

Nastaví prednastavený motív.  
Predvolené hodnoty sú `appearance: 'dark'`, `grayColor: 'slate'` a `accentColor: 'indigo'`.  
Každé pole sa uplatní samostatne, takže čiastočné volanie ponechá ostatné dve tak, ako sú. Hodnota, ktorá nie je jedným z nižšie uvedených názvov, sa ignoruje a volanie nikdy nevyvolá výnimku.  
Od verzie `4.0.0` prijíma pole `appearance` aj hodnotu `'system'`, ktorá zodpovedá možnosti `System` vo výbere motívu. Zobrazuje svetlý alebo tmavý vzhľad, ktorý hlási operačný systém, alebo ten, ktorý určí [setSystemAppearance](#setsystemappearance), a prepne sa, keď sa tento vzhľad zmení.

```ts
type ThemeOptions = {
  appearance: 'dark' | 'light' | 'system';
  grayColor: 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';
  accentColor:
    | 'gray'
    | 'gold'
    | 'bronze'
    | 'brown'
    | 'yellow'
    | 'amber'
    | 'orange'
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'lime'
    | 'mint'
    | 'sky';
};

// example
editor.setPresetTheme({ appearance: 'light' });
```

### setSystemAppearance {#setsystemappearance}

Od verzie `4.0.0` určuje svetlý alebo tmavý vzhľad, ktorý zobrazuje vzhľad `'system'`, pre hostiteľskú aplikáciu s vlastným svetlým a tmavým vzhľadom, napríklad s motívom IDE. Kým je niektorý určený, zmeny operačného systému sa ignorujú.  
`null` alebo akákoľvek iná hodnota ako `'dark'` či `'light'` obnoví riadenie podľa operačného systému.  
Kým je vzhľad `'light'` alebo `'dark'`, na obrazovke nič nezmení, ale hodnota sa uchová a uplatní sa hneď, ako sa vzhľad zmení na `'system'`. Inak sa uplatní okamžite. Nevyvolá nič a `changePresetTheme` naďalej hlási `'system'`.  
Hostiteľské aplikácie pre VS Code, JetBrains a Obsidian ju volajú so svojím vlastným svetlým alebo tmavým vzhľadom a znova vždy, keď sa zmení.

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme {#settheme}

Umožňuje prispôsobiť motív.  
Každé volanie nahradí celú vlastnú vrstvu, takže na zmenu jedného tokenu nad existujúcim prepísaním odovzdajte znova celý objekt a na návrat k prednastavenému motívu odovzdajte `{}`.  
Zachovajú sa iba nižšie uvedené názvy tokenov s reťazcovými hodnotami; všetko ostatné sa bez chyby zahodí.  
Vrstva leží nad prednastaveným motívom, takže neskoršie volanie `setPresetTheme` vymení prednastavený motív pod ňou, zatiaľ čo vaše prepísania zostanú.

#### JavaScript {#javascript}

```ts
type Theme = {
  grayColor1: string;
  grayColor2: string;
  grayColor3: string;
  grayColor4: string;
  grayColor5: string;
  grayColor6: string;
  grayColor7: string;
  grayColor8: string;
  grayColor9: string;
  grayColor10: string;
  grayColor11: string;
  grayColor12: string;

  accentColor1: string;
  accentColor2: string;
  accentColor3: string;
  accentColor4: string;
  accentColor5: string;
  accentColor6: string;
  accentColor7: string;
  accentColor8: string;
  accentColor9: string;
  accentColor10: string;
  accentColor11: string;
  accentColor12: string;

  canvasBackground: string;
  canvasBoundaryBackground: string;

  tableBackground: string;
  tableHeaderBackground: string;
  tableSelect: string;
  tableBorder: string;
  tableShadow: string;

  tableGroupHeaderBackground: string;
  tableGroupBackground: string;
  tableGroupBorder: string;

  memoBackground: string;
  memoSelect: string;
  memoBorder: string;
  memoShadow: string;

  columnSelect: string;
  columnSelectHover: string;
  columnHover: string;

  columnHandleBackground: string;
  columnHandleBorder: string;
  columnHandleHoverBackground: string;
  columnHandleHoverBorder: string;

  relationshipHover: string;

  visualizationLink: string;
  visualizationColumn: string;
  visualizationRelationship: string;

  toolbarBackground: string;

  contextMenuBackground: string;
  contextMenuSelect: string;
  contextMenuHover: string;
  contextMenuBorder: string;

  minimapBorder: string;
  minimapShadow: string;
  minimapViewportBorder: string;
  minimapViewportBorderHover: string;

  toastBackground: string;
  toastBorder: string;
  toastSuccess: string;
  toastError: string;

  findReplaceError: string;

  mapColumnsError: string;

  schemaSqlWarningBackground: string;
  schemaSqlWarningForeground: string;

  dragSelectBackground: string;
  dragSelectBorder: string;

  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;

  foreground: string;
  active: string;
  placeholder: string;

  focus: string;
  inputActive: string;

  keyPK: string;
  keyFK: string;
  keyPFK: string;

  treeBackground: string;
  treeRowHover: string;
  treeRowCurrent: string;
  treeMuted: string;
  treeMatch: string;

  explorerBackground: string;
  explorerBorder: string;

  dictionaryErrorForeground: string;
  dictionaryErrorBackground: string;
  dictionaryWarningForeground: string;
  dictionaryWarningBackground: string;
  dictionaryBackground: string;
  dictionaryHeaderBackground: string;
  dictionaryGridLine: string;
  dictionaryHeaderSelect: string;

  diffInsertForeground: string;
  diffDeleteForeground: string;
  diffModifyForeground: string;
  diffRenameForeground: string;
};

// example
editor.setTheme({
  canvasBackground: '#1b1b1f',
  tableBackground: '#242429',
  keyPK: '#ffc53d',
});
```

`tableShadow` a `memoShadow` určujú farbu tieňa, ktorý tabuľky a poznámky vrhajú na plátno ERD. Tmavý prednastavený motív ich ponecháva `transparent`, čo nevrhá žiadny tieň, rovnako ako odovzdanie `none` alebo prázdneho reťazca metóde `setTheme`; svetlý prednastavený motív používa `rgba(0, 0, 0, 0.18)`.

Od verzie `4.0.0` pribudlo deväť tokenov:

- `tableGroupHeaderBackground`, `tableGroupBackground` a `tableGroupBorder` určujú farbu záhlavia, tela a obrysu [skupiny tabuliek](../guide/guides/table-groups.md), ktorá nemá vlastnú farbu.
- `toastSuccess` a `toastError` určujú farbu značky oznámenia, ktoré informuje o tom, ako sa niečo skončilo.
- `findReplaceError` a `mapColumnsError` určujú farbu chýb, ktoré zobrazujú hľadanie a nahrádzanie a dialógové okno Mapovať stĺpce. Hľadanie a nahrádzanie predtým používalo `diffDeleteForeground`, takže prepísanie tohto tokenu ho už neprefarbí.
- `schemaSqlWarningBackground` a `schemaSqlWarningForeground` určujú farbu upozornení v možnostiach karty Schéma SQL.

Od verzie `4.1.0` pribudlo ďalších deväť tokenov:

- `treeBackground`, `treeRowHover`, `treeRowCurrent`, `treeMuted` a `treeMatch` určujú farby stromu, ktorý zdieľajú [prieskumník](../guide/guides/explorer.md#the-tree) a [prehliadač rozdielov](../guide/guides/table-related-functions.md#diff-viewer): jeho pozadia, ktoré vypĺňa aj polia `Find` a `Replace` prieskumníka; riadka pod ukazovateľom, riadka s fokusom klávesnice, kým má strom fokus, a tlačidla pod ukazovateľom v záhlaví a vyhľadávaní prieskumníka; riadka aktuálnej zhody vyhľadávania; tlmeného textu, napríklad počtov, typov údajov a šípok na zbalenie; a zvýraznenia za textom, ktorý vyhľadávanie našlo.
- `explorerBackground` a `explorerBorder` určujú farbu panela prieskumníka a jeho čiar: jeho okraja vedľa plátna, čiary pod jeho vyhľadávaním a okrajov jeho polí a tlačidiel, ktoré rozbalí `Search In`. `explorerBorder` vykresľuje aj okraj stromu prehliadača rozdielov, čiaru pod jeho poľom `Filter by name` a okraj tohto poľa. Ikony kľúčov v prieskumníkovi preberajú `keyPK`, `keyFK` a `keyPFK`.
- `diffModifyForeground` a `diffRenameForeground` určujú farbu toho, čo prehliadač rozdielov označí ako zmenené a premenované, v jeho strome aj na oboch dokumentoch. `diffModifyForeground` navyše ohraničí tabuľku, poznámku alebo skupinu tabuliek, ktorá bola presunutá alebo ktorej sa zmenila veľkosť, farba alebo skupina, bez ohľadu na to, čo iné sa v nej zmenilo, a vykreslí spojnicu cudzieho kľúča, ktorý sa zmenil.

`diffInsertForeground` a `diffDeleteForeground` teraz určujú farbu toho, čo prehliadač rozdielov označí ako pridané a odstránené, v jeho strome a na dokumente, ktorý to obsahuje, v texte, obrysoch aj spojniciach. `diffInsertBackground`, `diffDeleteBackground`, `diffCrossBackground` a `diffCrossForeground` boli vo verzii `4.1.0` odstránené, pretože prehliadač rozdielov už nevypĺňa bunky. `setTheme` ich zahodí ako akýkoľvek iný názov, ktorý nie je v `Theme`, a ich premenné CSS, `--erd-editor-diff-insert-background`, `--erd-editor-diff-delete-background`, `--erd-editor-diff-cross-background` a `--erd-editor-diff-cross-foreground`, sa už nečítajú.

Od verzie `4.2.0` pribudlo ďalších dvanásť tokenov:

- `columnHandleBackground` a `columnHandleBorder` určujú výplň a obrys [úchytu na presúvanie stĺpca](../guide/guides/table-editing.md#rearranging-and-moving-columns), ktorý sa vykresľuje tesne za ľavým okrajom tabuľky vedľa riadka stĺpca s fokusom, a `columnHandleHoverBackground` a `columnHandleHoverBorder` ich nahrádzajú, kým je nad ním ukazovateľ. Ikona úchytu preberá `foreground` a pod ukazovateľom `active`.
- `dictionaryErrorForeground` a `dictionaryWarningForeground` určujú farbu toho, čo [kontroly slovníkov](../guide/guides/dictionary.md#what-each-check-finds) zistia, teda chyby alebo varovania: nahláseného názvu na plátne ERD (pozrite si časť [Označenia na plátne](../guide/guides/dictionary.md#marks-on-the-canvas)), textu nahlásenej bunky v hárkoch `Domains`, `Words` a `Terms` a počtu pri hárku `Checks`. `dictionaryErrorBackground` a `dictionaryWarningBackground` vypĺňajú takúto bunku. `dictionaryErrorForeground` navyše určuje farbu nástroja `Delete Rows` pod ukazovateľom.
- `dictionaryBackground`, `dictionaryHeaderBackground`, `dictionaryGridLine` a `dictionaryHeaderSelect` určujú farby hárka karty [Slovník](../guide/guides/dictionary.md#the-sheets): jeho buniek, ktorých farbou sa vypĺňa aj pole vyhľadávania karty a zoznam domén termínu; jeho hlavičiek stĺpcov a čísel riadkov; čiar medzi bunkami, ktorými sa vykresľuje aj lišta karty a okraje jej polí; a hlavičky, ktorej riadok alebo stĺpec zasahuje do výberu. Zvyšok hárka preberá spoločné tokeny: `foreground` pre texty hlavičiek, `active` pre text buniek, `grayColor7` pre čiaru, ktorá oddeľuje hlavičky stĺpcov a čísla riadkov od buniek, `focus` pre okraj aktívnej bunky, `accentColor9` pre okraj vybratého rozsahu a s nepriehľadnosťou 20 % pre jeho výplň, `accentColor6` pre hlavičku celého vybratého riadka alebo stĺpca, `grayColor3` pre bunky iba na čítanie a tokeny posúvacieho pruhu. Ak `accentColor9` nie je zapísaný ako `#rgb` alebo `#rrggbb`, vybratý rozsah zostane bez výplne.

#### Premenné CSS {#css-variables}

Každý token v `Theme` má zodpovedajúcu premennú CSS s názvom `--erd-editor-` a kľúčom v zápise kebab-case: `grayColor10` je `--erd-editor-gray-color-10`, `keyPK` je `--erd-editor-key-pk` a `keyPFK` je `--erd-editor-key-pfk`.  
Premenné sa dedia do editora, takže ich nastavte tam, kde sa majú uplatniť. Na `:root` určujú motív každého editora na stránke; na samotnom elemente iba tohto jedného.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

Od verzie `3.4.0` sa tokeny s preklepom `dargSelect` píšu `dragSelect` a ich premenné CSS sa zmenili z `--erd-editor-darg-select-background` a `--erd-editor-darg-select-border` na `--erd-editor-drag-select-background` a `--erd-editor-drag-select-border`. Šablóna štýlov, ktorá ešte používa staré názvy, sa ignoruje.

<details>
<summary>Predvolené hodnoty motívu</summary>

```css
:root {
  --erd-editor-gray-color-1: #111113;
  --erd-editor-gray-color-2: #18191b;
  --erd-editor-gray-color-3: #212225;
  --erd-editor-gray-color-4: #272a2d;
  --erd-editor-gray-color-5: #2e3135;
  --erd-editor-gray-color-6: #363a3f;
  --erd-editor-gray-color-7: #43484e;
  --erd-editor-gray-color-8: #5a6169;
  --erd-editor-gray-color-9: #696e77;
  --erd-editor-gray-color-10: #777b84;
  --erd-editor-gray-color-11: #b0b4ba;
  --erd-editor-gray-color-12: #edeef0;
  --erd-editor-accent-color-1: #11131f;
  --erd-editor-accent-color-2: #141726;
  --erd-editor-accent-color-3: #182449;
  --erd-editor-accent-color-4: #1d2e62;
  --erd-editor-accent-color-5: #253974;
  --erd-editor-accent-color-6: #304384;
  --erd-editor-accent-color-7: #3a4f97;
  --erd-editor-accent-color-8: #435db1;
  --erd-editor-accent-color-9: #3e63dd;
  --erd-editor-accent-color-10: #5472e4;
  --erd-editor-accent-color-11: #9eb1ff;
  --erd-editor-accent-color-12: #d6e1ff;
  --erd-editor-canvas-background: #212225;
  --erd-editor-canvas-boundary-background: #111113;
  --erd-editor-table-background: #18191b;
  --erd-editor-table-header-background: #2e3135;
  --erd-editor-table-select: #435db1;
  --erd-editor-table-border: #363a3f;
  --erd-editor-table-shadow: transparent;
  --erd-editor-table-group-header-background: #43484e;
  --erd-editor-table-group-background: #d3edf81d;
  --erd-editor-table-group-border: #43484e;
  --erd-editor-memo-background: #18191b;
  --erd-editor-memo-select: #435db1;
  --erd-editor-memo-border: #363a3f;
  --erd-editor-memo-shadow: transparent;
  --erd-editor-column-select: #182449;
  --erd-editor-column-select-hover: #1d2e62;
  --erd-editor-column-hover: #272a2d;
  --erd-editor-column-handle-background: #18191b;
  --erd-editor-column-handle-border: #363a3f;
  --erd-editor-column-handle-hover-background: #2e3135;
  --erd-editor-column-handle-hover-border: #43484e;
  --erd-editor-relationship-hover: #435db1;
  --erd-editor-visualization-link: #43484e;
  --erd-editor-visualization-column: #5a6169;
  --erd-editor-visualization-relationship: #5a6169;
  --erd-editor-toolbar-background: #111113;
  --erd-editor-context-menu-background: #18191b;
  --erd-editor-context-menu-select: #272a2d;
  --erd-editor-context-menu-hover: #3a4f97;
  --erd-editor-context-menu-border: #363a3f;
  --erd-editor-minimap-border: black;
  --erd-editor-minimap-shadow: black;
  --erd-editor-minimap-viewport-border: #3a4f97;
  --erd-editor-minimap-viewport-border-hover: #435db1;
  --erd-editor-toast-background: #18191b;
  --erd-editor-toast-border: #363a3f;
  --erd-editor-toast-success: #3dd68c;
  --erd-editor-toast-error: #ff9592;
  --erd-editor-find-replace-error: #ff9592;
  --erd-editor-map-columns-error: #ff9592;
  --erd-editor-schema-sql-warning-background: #500f1c;
  --erd-editor-schema-sql-warning-foreground: #ff9592;
  --erd-editor-drag-select-background: #253974;
  --erd-editor-drag-select-border: #435db1;
  --erd-editor-scrollbar-track: #ddeaf814;
  --erd-editor-scrollbar-thumb: #696e77;
  --erd-editor-scrollbar-thumb-hover: #777b84;
  --erd-editor-foreground: #b0b4ba;
  --erd-editor-active: #edeef0;
  --erd-editor-placeholder: #e5edfd7b;
  --erd-editor-focus: #435db1;
  --erd-editor-input-active: #5472e4;
  --erd-editor-key-pk: #ffc53d;
  --erd-editor-key-fk: #e54666;
  --erd-editor-key-pfk: #00a2c7;
  --erd-editor-tree-background: #111113;
  --erd-editor-tree-row-hover: #212225;
  --erd-editor-tree-row-current: #1d2e62;
  --erd-editor-tree-muted: #b0b4ba;
  --erd-editor-tree-match: #253974;
  --erd-editor-explorer-background: #111113;
  --erd-editor-explorer-border: #363a3f;
  --erd-editor-dictionary-error-foreground: #ff9592;
  --erd-editor-dictionary-error-background: #500f1c;
  --erd-editor-dictionary-warning-foreground: #ffca16;
  --erd-editor-dictionary-warning-background: #3f2700;
  --erd-editor-dictionary-background: #18191b;
  --erd-editor-dictionary-header-background: #2e3135;
  --erd-editor-dictionary-grid-line: #363a3f;
  --erd-editor-dictionary-header-select: #182449;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-modify-foreground: #ffca16;
  --erd-editor-diff-rename-foreground: #70b8ff;
}
```

</details>

## Jazyk zobrazenia {#display-language}

Od verzie `4.0.0` je vlastný text editora – jeho ponuky, panely, dialógové okná, rýchle vyhľadávanie, oznámenia a slová, ktoré vykresľuje na diagram, napríklad `unnamed`, vrátane exportov obrázkov – k dispozícii v 25 jazykoch. Názvy tabuliek a stĺpcov, SQL, typy údajov a vygenerovaný kód sa nikdy neprekladajú. Pozrite si stránku [Jazyk a motív](../guide/guides/language-and-theme.md).  
Kým sa nezavolá [setLocale](#setlocale) alebo sa nezvolí jazyk, editor zobrazuje angličtinu alebo sa riadi hodnotou `'system'`, kým je zapnutý [enableLocalePicker](#enablelocalepicker).  
Editor nastavuje `lang` a `dir` na vlastnom koreni vnútri uzavretého shadow root, nikdy nie na hostiteľskom elemente ani na stránke, takže stránka písaná sprava doľava editor neprevráti a jazyk písaný sprava doľava neprevráti stránku. Hebrejčina, arabčina a perzština zobrazia rozhranie editora sprava doľava; samotný diagram sa nikdy zrkadlovo neotáča. Od verzie `4.1.0` zostáva [prieskumník](../guide/guides/explorer.md) v každom jazyku naľavo od plátna, pričom jeho vlastné riadky sa v týchto troch jazykoch čítajú sprava doľava.  
Balík exportuje typy `LocaleCode` (jeden z nižšie uvedených kódov) a `LocaleOption`.

```ts
type LocaleOption = LocaleCode | 'system';
```

| Kód     | Zobrazuje sa ako     | Jazyk                 |
| ------- | -------------------- | --------------------- |
| `id-ID` | Bahasa Indonesia     | Indonézština          |
| `de-DE` | Deutsch              | Nemčina               |
| `en`    | English              | Angličtina            |
| `es-ES` | Español              | Španielčina           |
| `eu-ES` | Euskara              | Baskičtina            |
| `fr-FR` | Français             | Francúzština          |
| `it-IT` | Italiano             | Taliančina            |
| `nl-NL` | Nederlands           | Holandčina            |
| `pl-PL` | Polski               | Poľština              |
| `pt-PT` | Português            | Portugalčina          |
| `pt-BR` | Português Brasileiro | Brazílska portugalčina |
| `ro-RO` | Română               | Rumunčina             |
| `sk-SK` | Slovenčina           | Slovenčina            |
| `sl-SI` | Slovenščina          | Slovinčina            |
| `sv-SE` | Svenska              | Švédčina              |
| `tr-TR` | Türkçe               | Turečtina             |
| `ru-RU` | Русский              | Ruština               |
| `uk-UA` | Українська           | Ukrajinčina           |
| `he-IL` | עברית                | Hebrejčina            |
| `ar-SA` | العربية              | Arabčina              |
| `fa-IR` | فارسی                | Perzština             |
| `ja-JP` | 日本語               | Japončina             |
| `zh-CN` | 简体中文             | Zjednodušená čínština |
| `zh-TW` | 繁體中文             | Tradičná čínština     |
| `ko-KR` | 한국어               | Kórejčina             |

### setLocale {#setlocale}

Nastaví jazyk zobrazenia: `'system'` alebo jeden z vyššie uvedených kódov. Čokoľvek iné, napríklad samotné `'ko'`, neznámy kód alebo hodnota, ktorá nie je reťazec, sa bez chyby ignoruje.  
Uplatní sa ešte pred návratom z volania, takže jazyk nastavený pred pripojením elementu sa prejaví už v jeho prvej snímke.  
Nevyvolá nič, ani `changeLocale`, ani `change`, a nezasahuje do `value`, histórie zmien ani zdieľaného úložiska.  
Voľba zostane bez ohľadu na to, či je `enableLocalePicker` zapnutý alebo vypnutý, a `setLocale('system')` sa riadi systémom aj pri vypnutom výbere jazyka.  
Editor nič neukladá. Ak chcete zachovať voľbu čitateľa, počúvajte udalosť [changeLocale](#changelocale) a pri ďalšom načítaní ju odovzdajte späť.

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale {#setsystemlocale}

Určuje jazyk, ktorý predstavuje `'system'`, ako značku BCP 47, pre hostiteľskú aplikáciu s vlastným jazykom zobrazenia. Hostiteľské aplikácie pre VS Code, JetBrains a Obsidian ju volajú so svojím vlastným jazykom zobrazenia.  
Zo značky sa odstránia okrajové medzery. `null`, prázdny reťazec alebo hodnota, ktorá nie je reťazec, obnoví riadenie podľa vlastnosti `navigator.languages` prehliadača, ktorú editor sleduje, keď sa mení.  
Má význam iba vtedy, keď je platnou možnosťou `'system'`, a uplatní sa okamžite. Riadok `System` vo výbere jazyka uvádza jazyk, na ktorý sa vyhodnotí.  
Značka, alebo postupne každý z jazykov prehliadača, sa vyhodnotí na prvý jazyk, ktorý editor má, podľa jazykovej podznačky, bez ohľadu na veľkosť písmen a podčiarkovníky: `de-AT` dáva `de-DE` a `en-GB` dáva `en`. Čínština sa určuje podľa písma, pričom `Hant` dáva `zh-TW` a `Hans` dáva `zh-CN`, a bez neho podľa regiónu, pričom `TW`, `HK` a `MO` dávajú `zh-TW` a akýkoľvek iný `zh-CN`. `pt` dáva `pt-BR`, pokiaľ nie je uvedený iný región ako `BR`. Keď sa nič nezhoduje, editor zobrazuje angličtinu.

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL {#setschemasql}

Načíta súbor so schémou SQL.  
Predvolene nahradí aktuálny dokument namiesto toho, aby sa s ním zlúčil; pozrite si nižšie možnosť `mode`. Nastavenia, ktoré už máte, sa zachovajú vrátane každého zamknutia a jeho zamknutej hodnoty, okrem polohy zobrazenia a úrovne priblíženia, a tabuľky sa po prečítaní súboru rozmiestnia do riadkov, pokiaľ nižšie uvedená možnosť `placement` neurčí inak. Pri zamknutom nastavení `Viewport` potom `value` zapíše zobrazenie, na ktorom import začína, teda počiatok `0, 0` s úrovňou priblíženia `1`. Dokument importovaný do elementu, ktorý nikdy nedostal hodnotu, má preto zapnuté všetky zamknutia, rovnako ako nový dokument.  
Od verzie `4.2.0` nahradenie zachová aj slová, termíny a domény dokumentu, ktoré text nedokáže obsahovať, spolu s históriou zmien každého hárka karty Slovník a zachová ich aj vrátenie späť alebo opätovné vykonanie importu. [setSchemaJSON](#setschemajson) v režime nahradenia a priradenie vlastnosti `value` naopak prevezmú tie, ktoré obsahuje ich dokument.  
Zaznamená sa do histórie, čo umožňuje `Undo, Redo`, a vyvolá udalosť `change`. Prázdny reťazec sa ignoruje a kým je nastavený atribút `readonly`, volanie nemá žiadny účinok.  
`setSchemaGraphQL`, `setSchemaDBML` a `setSchemaAML` sa správajú rovnako a ich parsery nikdy nezlyhajú: text, ktorý nedokážu prečítať, načíta prázdny dokument namiesto vyvolania chyby.  
Od verzie `4.0.0` prijímajú všetky štyri voliteľný druhý argument `{ placement, mode }`:

- `placement: 'grid'`, predvolená hodnota, okamžite umiestni tabuľky do riadkov, ako predtým, a volanie nič nevráti.
- `placement: 'auto'` najprv rozloží tabuľky podľa ich vzťahov, rovnako ako `Import` v editore, a vráti objekt `Promise`, ktorý sa splní, keď sa import umiestni ako jeden krok histórie zmien. Menej ako dve tabuľky, žiadny vzťah, zlyhané rozloženie, stránka bez `SharedWorker` alebo `Cancel` v upozornení `Placing tables` ich namiesto toho umiestni do riadkov. Načítanie medzitým – ďalší nahrádzajúci import, priradenie vlastnosti `value`, `setInitialValue()`, `clear()`, načítanie od spolupracovníka alebo vrátenie späť či opätovné vykonanie načítania alebo `clear()` – ho nahradí a objekt `Promise` sa splní bez toho, aby sa čokoľvek načítalo. Importy umiestňované týmto spôsobom sa umiestnia v poradí, v akom začali.
- `mode: 'replace'`, predvolená hodnota, nahradí dokument. `mode: 'append'` pridá súbor pod diagram rovnako ako funkcia [Importovať a pridať](../guide/guides/file-import-export.md#import-and-add), pričom ponechá bez zmeny každú tabuľku, ktorá tam už je, a každé nastavenie okrem karty a polohy zobrazenia. Z inej karty sa najprv prepne na kartu ERD. Nové tabuľky a skupiny tabuliek, ktoré prinesie súbor DBML, kým sú skupiny tabuliek zobrazené, sa stanú výberom a zobrazenie sa k nim posunie, pokiaľ už nie sú dobre viditeľné, podľa pravidla, ktorým sa od verzie `4.1.0` riadi každý skok – pozrite si časť [Kam vedie skok](../guide/guides/table-related-functions.md#where-a-jump-lands). Jedno vrátenie späť odstráni celé pridanie. Text, ktorý nedokáže prečítať, nepridá nič a ponechá dokument tak, ako je.

Kým je nastavený atribút `readonly`, nahradenie sa ignoruje, pridanie nepridá nič a volanie s `placement: 'auto'` sa okamžite splní.  
Od verzie `3.10.0` číta `setSchemaSQL` súbor podľa aktuálnej databázy dokumentu: keď je vybratý Databricks, reťazce v jednoduchých úvodzovkách sa riadia escapovaním spätnou lomkou ako v systéme Spark. Pozrite si časť [Komentáre](../guide/guides/file-import-export.md#comments).  
Od verzie `3.10.0` číta `setSchemaSQL` obmedzenie `UNIQUE` nad dvoma alebo viacerými stĺpcami ako jeden jedinečný index, nie ako príznak Jedinečný na každom stĺpci. Pozrite si časť [Jedinečné kľúče a indexy](../guide/guides/file-import-export.md#unique-keys-and-indexes).  
Od verzie `3.10.0` zachovávajú importy SQL, DBML a AML referenčné akcie `ON DELETE` a `ON UPDATE` cudzích kľúčov, ktoré načítajú.  
Od verzie `4.0.0` zachováva `setSchemaSQL` celý výraz `DEFAULT` stĺpca, číta `ADD DEFAULT … FOR` a komentáre `MS_Description` databázy SQL Server, mení stĺpce typu serial a identity databázy PostgreSQL na Automatický prírastok, zachováva `UNSIGNED` a `ZEROFILL` v type údajov a číta primárny kľúč, ktorý `ALTER TABLE … ADD PRIMARY KEY` označuje ako `CLUSTERED`, `NONCLUSTERED` alebo `USING BTREE`. Pozrite si časť [Schéma SQL](../guide/guides/file-import-export.md#schema-sql).  
Informácie o syntaxi, ktorú prijíma každý parser, nájdete na stránke [Import a export súborov](../guide/guides/file-import-export.md).

```ts
type SetSchema = {
  (
    value: string,
    options: { placement: 'auto'; mode?: 'replace' | 'append' }
  ): Promise<void>;
  (
    value: string,
    options?: { placement?: 'grid'; mode?: 'replace' | 'append' }
  ): void;
};

// example
editor.setSchemaSQL('Schema SQL...');
// or
await editor.setSchemaSQL('Schema SQL...', { placement: 'auto' });
// or
editor.setSchemaSQL('Schema SQL...', { mode: 'append' });
```

## setSchemaGraphQL {#setschemagraphql}

Načíta dokument GraphQL SDL.  
Z definícií objektových typov sa stanú tabuľky a z poľa, ktorého typom je iná tabuľka, sa stane vzťah.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML {#setschemadbml}

Načíta súbor DBML, formát, ktorý používajú dbdiagram.io a dbdocs.  
Od verzie `4.0.0` sa z každého bloku `TableGroup` stane [skupina tabuliek](../guide/guides/table-groups.md) a z hodnoty `headercolor` tabuľky sa stane jej farba. Pozrite si časť [DBML](../guide/guides/file-import-export.md#dbml).

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML {#setschemaaml}

Načíta súbor AML (Azimutt Markup Language). Prijíma sa aktuálny zápis aj starší zápis v1.  
Od verzie `4.0.0` sa farba entity, jeden z názvov farieb Azimutt alebo hexadecimálna hodnota v úvodzovkách, stane farbou jej tabuľky. Pozrite si časť [AML](../guide/guides/file-import-export.md#aml).

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON {#setschemajson}

Od verzie `4.0.0` načíta dokument `.erd.json`, napríklad text, ktorý vracia [value](#value).  
V predvolenom režime `mode: 'replace'` načíta dokument rovnako ako priradenie vlastnosti `value`: zaznamená sa do histórie, vyvolá udalosť `change` a rovnakým spôsobom prevezme zamknutia dokumentu, pričom od verzie `4.2.0` slová, termíny a domény dokumentu nahradia tie, ktoré má editor. Na rozdiel od `value` sa prázdny reťazec alebo hodnota, ktorá nie je reťazec, ignoruje a nezačne nový dokument. Text, ktorý nie je JSON, dokument vyprázdni, rovnako ako pri `value`.  
`mode: 'append'` pridá tabuľky, vzťahy, indexy, poznámky a skupiny tabuliek dokumentu pod diagram s novými identifikátormi, pričom zachová ich vzájomné polohy a vynechá nastavenia dokumentu, rovnako ako funkcia [Importovať a pridať](../guide/guides/file-import-export.md#import-and-add) so súborom `json`. Od verzie `4.2.0` zachová logické názvy a príznaky odvodených názvov tabuliek a stĺpcov, slová, termíny a domény dokumentu však vynechá, takže žiadny z jeho stĺpcov nie je prepojený s doménou. Text, ktorý nedokáže prečítať, alebo dokument bez tabuľky a bez poznámky nepridá nič. Inak sa umiestni rovnako ako pri pridaní cez [setSchemaSQL](#setschemasql), pričom jeho nové poznámky a skupiny tabuliek sa vyberú spolu s jeho tabuľkami, každý druh, kým je zobrazený.  
Skončí, až keď sa dokument umiestni, a kým je nastavený atribút `readonly`, ignoruje sa.

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL {#getschemasql}

Exportuje aktuálny stav editora ako schému SQL.  
Ak `databaseVendor` nie je zadaný, zapíše sa pre databázu, ktorú editor zobrazuje: databázu dokumentu, pokiaľ čitateľ editora [iba na čítanie](#readonly) nevybral inú, ktorá od verzie `5.0.0` zostáva na jeho obrazovke a zobrazuje ju jeho karta Schéma SQL. Názov, ktorý nie je v nižšie uvedenom zozname, sa spracuje rovnako, bez vyvolania chyby.  
Názvy sa uzatvárajú do úvodzoviek typu, ktorý zobrazuje editor. Kým je nastavenie `Bracket Type` [zamknuté](../guide/guides/settings.md#lock) alebo v editore iba na čítanie, ktorého čitateľ od verzie `5.0.0` vybral iný, môže sa líšiť od typu, ktorý ukladá `value`, teda od toho, ktorým uzatvára názvy nástroj [`erd_read`](../mcp/tools.md#reading-a-document) programovacieho agenta. Zapisujú sa vždy fyzické názvy bez ohľadu na Zobrazenie názvov.  
Od verzie `4.0.0` voliteľný argument `options` určuje príkazy a hlavičku, rovnako ako možnosti karty [Schéma SQL](../guide/guides/schema-sql.md), a od verzie `4.2.0` aj to, či logické názvy vyplnia prázdne komentáre. `SchemaSQLOptions` sa exportuje ako typ.

- `statements`: `'create'`, predvolená hodnota; `'ifNotExists'`, ktorá v MySQL, MariaDB, PostgreSQL, SQLite a Databricks zapíše `IF NOT EXISTS` a inde sa vráti k `'create'`; alebo `'recreate'`, ktorá pred vytvorením tabuľky odstráni, pričom Snowflake namiesto toho zapíše `CREATE OR REPLACE TABLE`.
- `header`: `'none'`, predvolená hodnota; `'use'`, ktorá prepne na databázu alebo schému dokumentu; alebo `'createAndUse'`, ktorá ju najprv vytvorí, ak neexistuje, a potom na ňu prepne. Databáza, ktorá požadovanú možnosť nemá, sa vráti k náhradnej rovnako ako karta: Oracle pre `'createAndUse'` zapíše `'use'`, PostgreSQL pre `'use'` nezapíše žiadnu hlavičku a SQLite nezapíše žiadnu. Hlavička sa zapíše iba vtedy, keď je názov databázy dokumentu jednoduchý identifikátor – písmená ASCII, číslice a `_`, pričom nezačína číslicou.
- `logicalNameAsComment`, od verzie `4.2.0`: `true` zapíše logický názov tabuľky alebo stĺpca ako komentár tam, kde je ich vlastný komentár prázdny alebo obsahuje iba prázdne znaky a logický názov prázdny nie je, a to v tvare, v akom daná databáza zapisuje komentáre. Komentár s textom sa zapíše ako predtým. Zapína ju iba `true`: pri vynechaní, hodnote `false` alebo akejkoľvek inej hodnote, napríklad `'true'` alebo `1`, sa žiadny logický názov nezapíše. Robí to isté ako prepínač [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments) na karte.

Vynechaná možnosť alebo možnosť s neznámou hodnotou sa číta ako jej predvolená hodnota, takže volanie bez možností zapíše jednoduché príkazy `CREATE` bez hlavičky, ako predtým.  
Od verzie `4.0.0` výstup vždy obsahuje skripty `Before tables` a `After tables` dokumentu, v poradí hlavička, skript pred tabuľkami, príkazy na odstránenie, tabuľky, skript za tabuľkami. Vlastné voľby `Statements`, `Header`, `Write logical names into empty comments` a `Tables` na karte Schéma SQL toto volanie nikdy neovplyvnia, pretože vždy zapisuje celý dokument.  
Od verzie `3.10.0` obsahuje každý cudzí kľúč klauzuly `ON DELETE` a `ON UPDATE` vzťahu. Klauzula sa zapíše iba vtedy, keď je jej akcia nastavená a databázový systém ju prijíma, takže akcia, ktorú tento systém nepodporuje, sa vynechá a uplatní sa predvolená akcia. Od verzie `4.0.0` Snowflake prijíma iba `NO ACTION`. Informácie o tom, čo zapisuje každá databáza, nájdete v časti [ON DELETE a ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).  
Od verzie `3.10.0` sa jednoduchá úvodzovka v komentári tabuľky alebo stĺpca escapuje, takže komentár ako `it's` už nenaruší príkaz. Každý databázový systém, ktorý zapisuje komentáre ako reťazcové literály, ju zdvojí, okrem Databricks, ktorý pred každú úvodzovku a každú spätnú lomku vloží spätnú lomku. SQLite naďalej zapisuje komentáre ako riadky `--`.  
Od verzie `4.2.0` SQL Server zapisuje každý komentár ako národný literál, `N'…'`, takže sa zachová aj text mimo kódovej stránky databázy, napríklad kórejčina. Oracle zapíše každý úsek prázdnych riadkov v komentári ako jedno zalomenie riadka a SQLite zapíše zalomenia riadkov v komentári ako medzery, takže komentár zostane na svojom riadku `--`. Pozrite si časť [Komentáre](../guide/guides/schema-sql.md#comments).  
Od verzie `4.0.0` niekoľko databáz zapisuje inak aj názvy kľúčov, predvolené hodnoty a automatický prírastok. Pozrite si časť [Čo sa zapisuje do DDL](../guide/guides/schema-sql.md#what-the-ddl-writes).

```ts
type DatabaseVendor =
  | 'Databricks'
  | 'MariaDB'
  | 'MSSQL'
  | 'MySQL'
  | 'Oracle'
  | 'PostgreSQL'
  | 'Snowflake'
  | 'SQLite';

type SchemaSQLOptions = {
  statements?: 'create' | 'ifNotExists' | 'recreate';
  header?: 'none' | 'use' | 'createAndUse';
  logicalNameAsComment?: boolean;
};

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
// or
const mysqlSQL = editor.getSchemaSQL('MySQL', {
  statements: 'ifNotExists',
  header: 'createAndUse',
});
// or
const commentedSQL = editor.getSchemaSQL('PostgreSQL', {
  logicalNameAsComment: true,
});
```

## getSharedStore {#getsharedstore}

Vráti úložisko na spoločné úpravy v reálnom čase.  
`config` je `{ getNickname?, mouseTracker?, focusTracker? }`. Oba sledovače majú predvolenú hodnotu `true`: `mouseTracker` vysiela ostatným kurzor tohto editora a `focusTracker` vysiela jeho aktívnu bunku, výber a výberový rámec.  
Od verzie `5.0.0` úložisko neodosiela žiadnu zmenu, kým je nastavené [readonly](#readonly), iba to, čo odosielajú jeho sledovače, a registre, o ktoré žiada pripájajúci sa editor, a naďalej aplikuje to, čo pošlú ostatné.  
Pozrite si stránku [Spoločné úpravy](./advanced/collaborative-editing.md).

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue {#setdiffvalue}

Otvorí prehliadač rozdielov a porovná aktuálne otvorený dokument s tým, ktorý odovzdáte.  
Nič nevracia a nemení dokument, takže zatvorenie prehliadača ponechá editor presne taký, aký bol.  
Prázdna hodnota alebo čokoľvek, čo nie je reťazec, sa porovná s prázdnym dokumentom.  
Je to tá istá prekryvná vrstva ako položka [Prehliadač rozdielov](../guide/guides/table-related-functions.md#diff-viewer) v kontextovej ponuke plátna.  
Od verzie `4.1.0` páruje obsah oboch dokumentov najprv podľa identifikátora a až potom podľa toho, čo každý obsahuje, napríklad podľa názvu tabuľky alebo textu poznámky – pozrite si časť [Čo sa porovnáva](../guide/guides/table-related-functions.md#what-is-compared). Pri porovnaní so staršou verziou toho istého dokumentu, napríklad s revíziou jeho súboru v systéme Git, sa preto premenovanie zobrazí ako jeden premenovaný objekt; pri porovnaní s dokumentom s inými identifikátormi sa zobrazí ako odstránenie a pridanie. Prehliadač uvádza zmeny v strome vedľa oboch dokumentov a namiesto vypĺňania buniek ich označuje farbou.  
Od verzie `4.2.0` sa oba dokumenty otvoria v Zobrazení názvov, ktoré zobrazuje tento editor, bez ohľadu na to, čo uložil odovzdaný dokument, a podľa neho pomenúva tabuľky a stĺpce aj strom – pozrite si časť [Mimo plátna](../guide/guides/logical-names.md#beyond-the-canvas). Logické názvy, prepojenia s doménami a slovníky sa neporovnávajú, takže samotná zmena v nich sa nezobrazí ako zmena.

```js
editor.setDiffValue('prev json...');
```
