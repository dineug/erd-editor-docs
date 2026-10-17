---
sidebar_position: 15
description: 25 jazykov zobrazenia editora, rozloženie sprava doľava, vzhľady System, Light a Dark vo výbere motívu a jeho farby a miesto, kde ich uchováva každá hostiteľská aplikácia.
---

# Jazyk a motív

Vlastný text editora je k dispozícii v 25 jazykoch a jeho podobu určuje motív: vzhľad (`System`, `Light` alebo `Dark`), odtieň sivej a farba zvýraznenia.  
Oboje patrí tomu, kto editor používa, nie diagramu. Ani jedno sa neukladá do súboru, nezaznamenáva sa v [histórii zmien](./undo-redo.md) ani sa nezdieľa so spolupracovníkmi, takže každý vidí svoje vlastné nastavenie a zmena ktoréhokoľvek z nich nikdy neoznačí súbor ako zmenený.

Ani jedno nie je na karte [Nastavenia](./settings.md). Na paneli nástrojov je tlačidlo `Theme` a hneď za ním tlačidlo `Display Language`, obe za tlačidlom [`Explorer`](./explorer.md). [Rýchle vyhľadávanie](./quick-search.md) ponúka položky `Theme` a `Display Language` na každej karte.  
Webová aplikácia, Google Drive, VS Code, IDE od JetBrains a Obsidian ponúkajú oboje a pamätajú si, čo ste zvolili – pozrite si časť [V jednotlivých hostiteľských aplikáciách](#in-each-host). Oboje funguje aj v editore iba na čítanie.

## Jazyk zobrazenia {#display-language}

Jazyk sa vzťahuje na vlastný text editora: bublinové popisy na paneli nástrojov, kontextové ponuky, rýchle vyhľadávanie, panely a dialógové okná, kartu Nastavenia, [uvítaciu obrazovku](./editing-start.md#welcome-screen), oznámenia a správy a zástupný text, ktorý prázdny názov, typ údajov, predvolená hodnota alebo komentár zobrazuje na plátne a v exportovanom obrázku.  
V každom jazyku ponecháva tak, ako sú napísané, tieto prvky: vaše názvy tabuliek a stĺpcov, komentáre a poznámky; databázové systémy, jazyky na karte Generátor kódu a formáty súborov; typy údajov, kľúčové slová SQL a akcie `ON DELETE` a `ON UPDATE`; možnosti karty Schéma SQL `Create`, `If not exists`, `Drop & re-create`, `USE` a `CREATE + USE`; označenia `PK`, `FK`, `UQ`, `AI`, `NN`, `N-N`, `NULL` a `AK1.1`; stavové písmená `A`, `M`, `D`, `R` a `~` v [prehliadači rozdielov](./table-related-functions.md#diff-viewer); možnosti štýlu názvov a možnosti `Bracket` okrem `None`; názvy klávesov; názvy farieb vo výbere motívu; vygenerované SQL a kód; názvy exportovaných súborov.

Jazyky v poradí, v akom ich uvádza výber jazyka:

| Vo výbere jazyka | Jazyk | Kód |
| --- | --- | --- |
| Bahasa Indonesia | Indonézština | `id-ID` |
| Deutsch | Nemčina | `de-DE` |
| English | Angličtina | `en` |
| Español | Španielčina | `es-ES` |
| Euskara | Baskičtina | `eu-ES` |
| Français | Francúzština | `fr-FR` |
| Italiano | Taliančina | `it-IT` |
| Nederlands | Holandčina | `nl-NL` |
| Polski | Poľština | `pl-PL` |
| Português | Portugalčina | `pt-PT` |
| Português Brasileiro | Brazílska portugalčina | `pt-BR` |
| Română | Rumunčina | `ro-RO` |
| Slovenčina | Slovenčina | `sk-SK` |
| Slovenščina | Slovinčina | `sl-SI` |
| Svenska | Švédčina | `sv-SE` |
| Türkçe | Turečtina | `tr-TR` |
| Русский | Ruština | `ru-RU` |
| Українська | Ukrajinčina | `uk-UA` |
| עברית | Hebrejčina | `he-IL` |
| العربية | Arabčina | `ar-SA` |
| فارسی | Perzština | `fa-IR` |
| 日本語 | Japončina | `ja-JP` |
| 简体中文 | Zjednodušená čínština | `zh-CN` |
| 繁體中文 | Tradičná čínština | `zh-TW` |
| 한국어 | Kórejčina | `ko-KR` |

Položka `Language`, ktorú rýchle vyhľadávanie ponúka na karte Generátor kódu, a riadok `Language` v zozname [Zamknutie](./settings.md#lock) na karte Nastavenia predstavujú [cieľový jazyk na karte Generátor kódu](./code-generator.md#language), nie jazyk zobrazenia.

### Výber jazyka {#picking-a-language}

Tlačidlo `Display Language` (ikona jazykov) otvára výber jazyka `Display Language`, panel s nadpisom `Display Language` pod panelom nástrojov, zobrazený nad kartou, ktorá je práve otvorená.  
Prvá je možnosť `System`, vedľa ktorej je uvedený jazyk, ktorý práve zastupuje, a pri posúvaní zoznamu zostáva stále viditeľná. Nasleduje 25 jazykov, každý pod vlastným názvom, a platnú možnosť označuje značka začiarknutia.

![Prepnutie jazyka zobrazenia z panela nástrojov na 한국어, potom na العربية, ktorá zrkadlovo otočí panel nástrojov, ale nie diagram, a späť na System](/img/demo-display-language.webp)

Panel sa otvorí s fokusom klávesnice na začiarknutom riadku:

- Klávesy `↑` a `↓` presúvajú fokus po riadkoch, pričom za posledným pokračujú prvým a naopak, a klávesy `Home` a `End` presunú fokus na prvý a posledný riadok.
- Kláves `Enter` alebo `Space` zvolí riadok s fokusom rovnako ako kliknutie.

Voľba sa uplatní okamžite, zatvorí panel a vráti fokus klávesnice editoru.

Bez voľby ho zatvorte klávesom `Escape`, tlačidlom `x` vedľa nadpisu, ktorého bublinový popis znie `Close (ESC)`, stlačením kdekoľvek v editore mimo panela okrem panela nástrojov alebo opätovným stlačením tlačidla `Display Language`.  
Jeho otvorenie zatvorí výber motívu a panel Vlastnosti tabuľky. Otvorený [prieskumník](./explorer.md#dialogs-beside-it) zostane otvorený a v jazyku písanom zľava doprava sa výber jazyka zobrazí hneď vedľa neho, nie nad ním.  
Zatvorí ho otvorenie rýchleho vyhľadávania alebo výberu motívu a rovnako aj `Ctrl + F` (Windows/Linux) alebo `⌘ + F` (Mac). Táto klávesová skratka otvorí [prieskumníka](./explorer.md#opening-and-closing) s aktívnym hľadaním, alebo, ak je prieskumník už otvorený, ponechá ho otvorený a presunie fokus klávesnice do jeho poľa hľadania. Tlačidlo `Explorer` na paneli nástrojov ponechá výber jazyka otvorený.

Kým má panel fokus klávesnice, niekoľko klávesových skratiek editora naďalej funguje: `Search`, `Toggle Explorer`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` a `Zoom Reset` – pozrite si časť [Klávesové skratky](./settings.md#shortcuts). Každá iná klávesová skratka editora, klávesy šípok a kláves `Tab` sa zastavia v paneli, takže editor na ne nereaguje. Klávesy, ktorým editor nič nepriraďuje, napríklad skratka na uloženie v samotnej hostiteľskej aplikácii, sa k hostiteľskej aplikácii dostanú ako obvykle.

V [rýchlom vyhľadávaní](./quick-search.md) ponúka položka `Display Language` možnosť `System` a 25 jazykov a platná možnosť je začiarknutá. Jazyk sa tam dá nájsť aj podľa jeho anglického názvu alebo kódu, takže hľadaný text `german` alebo `de-DE` nájde jazyk `Deutsch`.

### Čím sa riadi možnosť System {#what-system-follows}

Možnosť `System` je počiatočné nastavenie jazyka vo webovej aplikácii, v službe Google Drive, vo VS Code, v IDE od JetBrains a v aplikácii Obsidian. Riadi sa jazykom hostiteľskej aplikácie:

- Vo webovej aplikácii, v službe Google Drive a na vlastnej stránke: preferovanými jazykmi prehliadača. Ich zmena sa prejaví okamžite.
- Vo VS Code: jazykom zobrazenia VS Code.
- V IDE od JetBrains: jazykom, v ktorom IDE zobrazuje vlastné rozhranie.
- V aplikácii Obsidian: jazykom aplikácie Obsidian.

Možnosť `System` použije prvý z týchto jazykov, ktorý editor má, a angličtinu, ak nemá žiadny z nich.  
Regionálny variant sa počíta ako jeho jazyk, takže kód `de-AT` vyberie Deutsch a kód `fr-CA` Français. Pri čínštine rozhoduje písmo: tradičné písmo vyberie 繁體中文 a akékoľvek iné písmo 简体中文. Ak písmo nie je uvedené, pre Taiwan, Hongkong alebo Macao sa vyberie 繁體中文 a pre inú čínštinu 简体中文. Portugalčina vyberie Português Brasileiro, pokiaľ nie je uvedený iný región ako Brazília, takže kód `pt-PT` vyberie Português; aj portugalčina aplikácie Obsidian vyberie Português.

### Jazyky písané sprava doľava {#right-to-left-languages}

עברית (hebrejčina), العربية (arabčina) a فارسی (perzština) rozložia editor sprava doľava: panel nástrojov, ponuky, panely a dialógové okná, rýchle vyhľadávanie a karta Nastavenia sú zrkadlovo otočené. Podponuky kontextovej ponuky sa otvárajú doľava a ikony Vrátiť späť a Znova vykonať na paneli nástrojov si vymenia miesta, aby ikona Vrátiť späť ukazovala dozadu v smere, ktorým postupuje čitateľ textu sprava doľava.

Samotný diagram sa nikdy zrkadlovo neotáča. Plátno s tabuľkami, stĺpcami, vzťahmi a poznámkami zostáva zľava doprava a rovnako aj minimapa, posúvacie pruhy, [panel nástrojov plátna](./table-related-functions.md#canvas-toolbar), karta [Vizualizácia](./visualization.md) a jej panel nástrojov, bunky typu údajov, kód na kartách Schéma SQL a Generátor kódu, výber farby, obe strany prehliadača rozdielov, cestovanie v čase a ukážka automatického rozloženia.  
[Prieskumník](./explorer.md#beside-the-canvas) zostáva naľavo od plátna a strom zmien prehliadača rozdielov naľavo v prehliadači, každý s okrajom na ťahanie na svojej pravej strane. Vo vnútri sa oba čítajú sprava doľava: ich polia a riadky sú zrkadlovo otočené, riadky sú odsadené sprava a v oboch stromoch kláves `←` rozbalí riadok alebo prejde na jeho prvý podradený riadok, zatiaľ čo kláves `→` ho zbalí alebo prejde späť na jeho nadradený riadok – pozrite si časť [Klávesy v prieskumníkovi](./explorer.md#keys-in-the-explorer).  
Názvy, komentáre a iný text, ktorý ste napísali, si zachovávajú vlastný smer, takže hebrejský, arabský alebo perzský názov sa aj na plátne číta sprava doľava.

## Motív {#theme}

Tlačidlo `Theme` (ikona kontrastu) otvára výber motívu, panel s nadpisom `Theme` pod panelom nástrojov, zobrazený nad kartou, ktorá je práve otvorená. Má tri časti:

- `Accent color`: 26 vzoriek farieb. Bublinový popis každej z nich uvádza jej názov, napríklad `indigo`.
- `Gray color`: 6 vzoriek farieb, `gray`, `mauve`, `slate`, `sage`, `olive` a `sand`.
- `Appearance`: `System`, `Light` a `Dark`.

![Otvorenie výberu motívu z panela nástrojov, voľba farby zvýraznenia a odtieňa sivej a prepnutie vzhľadu na Light a potom na System](/img/demo-theme-builder.webp)

Platná voľba v každej časti je označená a zvolená možnosť sa uplatní okamžite, pričom výber motívu zostane otvorený.  
Voľba farby ponechá vzhľad tak, ako je, takže farba zvolená pri vzhľade `System` vzhľad `System` zachová.

Možnosť `System` zobrazuje svetlý alebo tmavý vzhľad podľa hostiteľskej aplikácie a prepne sa, keď sa prepne hostiteľská aplikácia:

- Vo webovej aplikácii, v službe Google Drive a na vlastnej stránke: svetlý alebo tmavý režim, ktorý hlási prehliadač a ktorý sa riadi operačným systémom.
- Vo VS Code: svetlý pri svetlom farebnom motíve a tmavý pri tmavom alebo pri ktoromkoľvek z dvoch motívov s vysokým kontrastom.
- V IDE od JetBrains: svetlý alebo tmavý motív IDE.
- V aplikácii Obsidian: svetlý alebo tmavý motív aplikácie Obsidian.

Výber motívu zatvorte klávesom `Escape`, tlačidlom `x` vedľa nadpisu, ktorého bublinový popis znie `Close (ESC)`, stlačením kdekoľvek v editore mimo panela okrem panela nástrojov alebo opätovným stlačením tlačidla `Theme`.  
Jeho otvorenie zatvorí panel Vlastnosti tabuľky a výber jazyka `Display Language`. Otvorený [prieskumník](./explorer.md#dialogs-beside-it) zostane otvorený a v jazyku písanom zľava doprava sa výber motívu zobrazí hneď vedľa neho, nie nad ním.  
Zatvorí ho otvorenie rýchleho vyhľadávania alebo výberu jazyka `Display Language` a rovnako aj `Ctrl + F` (Windows/Linux) alebo `⌘ + F` (Mac). Táto klávesová skratka otvorí [prieskumníka](./explorer.md#opening-and-closing) s aktívnym hľadaním, alebo, ak je prieskumník už otvorený, ponechá ho otvorený a presunie fokus klávesnice do jeho poľa hľadania. Tlačidlo `Explorer` na paneli nástrojov ponechá výber motívu otvorený.  
Výber motívu nezadržiava žiadne klávesy, takže klávesové skratky editora fungujú, aj keď je otvorený.

V [rýchlom vyhľadávaní](./quick-search.md) ponúka položka `Theme` možnosti `System`, `Light` a `Dark` a platný vzhľad je začiarknutý. Voľba jednej z nich zmení iba vzhľad a odtieň sivej a farbu zvýraznenia ponechá tak, ako sú.

## V jednotlivých hostiteľských aplikáciách {#in-each-host}

To, čo zvolíte v editore, na paneli nástrojov alebo v rýchlom vyhľadávaní, sa uloží tam, kde to uchováva hostiteľská aplikácia, a každý otvorený diagram sa okamžite prispôsobí jeho zmene bez ohľadu na to, kde sa urobí.  
Vo VS Code, v IDE od JetBrains a v aplikácii Obsidian zodpovedá možnosť `Auto` hostiteľskej aplikácie (vo VS Code hodnota `auto`) možnosti `System` editora. Voľba `System` uloží `Auto` a voľba `Light` alebo `Dark` uloží daný vzhľad, aj keď ho možnosť `Auto` už zobrazovala.  
Vlastné nastavenia a upozornenia rozšírenia a doplnkov sú v angličtine bez ohľadu na jazyk zobrazenia.

### Webová aplikácia a Google Drive {#web-app-and-google-drive}

Na stránke erd-editor.io vrátane jej relácií spoločných úprav a v službe Google Drive slúži jeden jazyk a jeden motív aplikácii a každému diagramu v nej.  
Oboje sa uchováva v tomto prehliadači, nie v schéme ani v súbore na Drive, a zdieľajú ich všetky karty prehliadača so stránkou erd-editor.io: voľba na jednej karte okamžite zmení ostatné.

Kým nezvolíte jazyk, platí možnosť `System`, ktorá sa riadi preferovanými jazykmi prehliadača.  
Vlastný text aplikácie, napríklad na bočnom paneli, v koši, pri spolupráci a na obrazovkách pre Google Drive, sa riadi tým istým jazykom a v hebrejčine, arabčine a perzštine je celá aplikácia rozložená sprava doľava. Zásady ochrany osobných údajov, Podmienky poskytovania služieb a stránky podpory zostávajú v angličtine.  
Okrem panela editora a rýchleho vyhľadávania je v spodnom riadku bočného panela vedľa odkazov `Privacy` a `Terms` tlačidlo jazyka, ktorého bublinový popis znie `Display Language`. Jeho ponuka uvádza možnosť `System` s jazykom, ktorý zastupuje, a potom 25 jazykov.

Motív je na začiatku nastavený na vzhľad `System` s odtieňom sivej `olive` a farbou zvýraznenia `jade`.  
Okrem výberu motívu a rýchleho vyhľadávania sú v spodnej časti bočného panela tri tlačidlá s ikonami, `System`, `Light` a `Dark`: na stránke erd-editor.io vedľa položky `Trash` a v službe Google Drive vedľa položky `Sign out`. Nastavujú ten istý vzhľad ako výber motívu.

### VS Code {#vs-code}

Nastavenia rozšírenia sú v nastaveniach VS Code v časti ERD Editor:

| Nastavenie | Hodnoty | Predvolená hodnota |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto` alebo kód z [tabuľky jazykov](#display-language) | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`, `light`, `dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | šesť odtieňov sivej | `slate` |
| `dineug.erd-editor.theme.accentColor` | 26 farieb zvýraznenia | `indigo` |

Editor nastavení ponúka pre jazyk možnosť `Auto` a potom každý jazyk pod jeho vlastným názvom. Hodnota v súbore `settings.json`, ktorá neoznačuje žiadny jazyk, sa číta ako `auto`.  
Voľba motívu v editore zapíše všetky tri nastavenia motívu. Voľba sa zapíše tam, kde je príslušné nastavenie už určené: do priečinka pracovného priestoru, inak do pracovného priestoru, inak do používateľských nastavení.

### IDE od JetBrains {#jetbrains-ides}

Na stránke Settings | Tools | ERD Editor sú nastavenia `Appearance:` (`Auto`, `Light`, `Dark`), `Gray color:`, `Accent color:` a `Display language:` (`Auto`, potom každý jazyk pod vlastným názvom), ktoré sa uchovávajú pre celé IDE.  
Ich počiatočné hodnoty sú `Auto`, `Slate`, `Indigo` a `Auto`.

### Obsidian {#obsidian}

V Settings → ERD Editor sú nastavenia `Appearance` (`Auto`, `Light`, `Dark`), `Gray color`, `Accent color` a `Display language` (`Auto`, potom každý jazyk pod vlastným názvom), ktoré sa uchovávajú pre každý trezor zvlášť.  
Ich počiatočné hodnoty sú `Auto`, `Slate`, `Indigo` a `Auto`.  
Zmena sa uplatní na každej karte ERD trezora vrátane kariet v samostatných oknách.

### Vlastná stránka {#your-own-page}

Element `<erd-editor>` na vlastnej stránke nezobrazuje tlačidlo `Theme` ani `Display Language` a rýchle vyhľadávanie neponúka ani jednu z týchto položiek, kým ich stránka nezapne atribútmi [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) a [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker).  
Kým stránka nenastaví jazyk alebo ho čitateľ nezvolí, editor zobrazuje angličtinu alebo sa riadi možnosťou `System`, pokiaľ je zapnutý atribút `enableLocalePicker`.  
Motív je na začiatku nastavený na vzhľad `Dark` s odtieňom sivej `slate` a farbou zvýraznenia `indigo`, pokiaľ stránka nenastaví iný alebo nezapne atribút [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode).  
Voľba čitateľa sa uplatní okamžite, ale element neukladá ani jednu voľbu: počiatočné hodnoty nastavuje stránka a voľby čitateľa si ukladá sama – pozrite si časti [Motív](../../api/erd-editor-element.md#theme) a [Jazyk zobrazenia](../../api/erd-editor-element.md#display-language) v API.
