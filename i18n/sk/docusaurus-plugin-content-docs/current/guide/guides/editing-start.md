---
sidebar_position: 1
description: Začiatok na uvítacej obrazovke a vytváranie tabuliek, poznámok, skupín tabuliek a vzťahov z kontextovej ponuky plátna, z panela nástrojov plátna alebo klávesovou skratkou.
---

# Začíname s úpravami

Úpravy sa začínajú v kontextovej ponuke, ktorá sa otvorí kliknutím pravým tlačidlom.

![Kliknutie pravým tlačidlom na plátno, otvorenie podponuky Relationship, pridanie tabuľky a potom jej vlastná ponuka](/img/demo-context-menu.webp)

Kliknutie pravým tlačidlom na tabuľku, poznámku, skupinu tabuliek alebo vzťah namiesto toho otvorí vlastnú ponuku daného objektu.  
Kliknutie pravým tlačidlom na tabuľku, poznámku alebo skupinu tabuliek, ktorá je už vybratá, zachová celý výber, takže položky, napríklad `Color` a `Delete selected`, sa vzťahujú na celý výber – pozrite si časť [Viacnásobný výber](./table-related-functions.md#multiple-selection).  
Editor iba na čítanie nič nevytvára, takže sa v ňom neponúka nič z toho, čo táto stránka opisuje: ponuka plátna si ponecháva iba `View Option`, `Name View`, `Export` a `Diff Viewer`, ponuka tabuľky iba `Table Properties` a poznámka, skupina tabuliek ani vzťah neotvorí žiadnu ponuku – pozrite si časť [Editory iba na čítanie](./table-related-functions.md#read-only-editors).

## Uvítacia obrazovka {#welcome-screen}

Vo webovej aplikácii, v službe Google Drive, vo VS Code, v aplikácii Obsidian a v IDE od JetBrains sa prázdny diagram otvorí s uvítacou obrazovkou nad plátnom ERD. Element `<erd-editor>` na vlastnej stránke ju zobrazí, iba keď ju stránka zapne pomocou [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen).  
Diagram sa považuje za prázdny, kým neobsahuje žiadnu tabuľku, žiadnu zobrazenú poznámku ani žiadnu zobrazenú skupinu tabuliek, takže poznámky a skupiny skryté v ponuke Možnosti zobrazenia sa nepočítajú. Obrazovka zmizne, hneď ako diagram niektorú z nich obsahuje, a vráti sa vždy, keď je diagram znova prázdny, napríklad keď odstránite poslednú tabuľku alebo vrátite späť pridanie prvej.  
Nezobrazuje sa v editore iba na čítanie, v režime Zen, kým je otvorený panel Vlastnosti tabuľky, ani kým plátno zaberá prehliadač rozdielov, ukážka automatického rozloženia alebo cestovanie v čase.

![Uvítacia obrazovka na prázdnom diagrame: otvorenie formátov položky Import, návrat klávesom Esc, pridanie tabuľky cez New Table a potom obnovenie obrazovky pomocou ⌘ + Z](/img/demo-welcome-screen.webp)

Pod nadpisom `Right-click the canvas for every action.` je ponuka:

- Položka `New Table` pridá tabuľku rovnako ako `Alt + N`.
- Položka `New Memo` pridá poznámku rovnako ako `Alt + M`. Kým sú poznámky skryté, vynechá sa.
- Položka `Import` nahradí ponuku položkou `Back` a formátmi `json`, `Schema SQL`, `GraphQL`, `DBML` a `AML`. Keď zvolíte formát, vyžiada sa súbor v tomto formáte a načíta sa namiesto prázdneho diagramu – pozrite si stránku [Import a export súborov](./file-import-export.md). Položkou `Back` alebo klávesom `Escape` sa vrátite do prvej ponuky.
- Položka `Command Palette` otvorí [rýchle vyhľadávanie](./quick-search.md) rovnako ako `Ctrl + K` (Windows/Linux) alebo `⌘ + K` (Mac).
- Položka `Shortcuts` otvorí Nastavenia na karte [`Shortcuts`](./settings.md#shortcuts).

Kde je plátno dostatočne široké, položky `New Table`, `New Memo` a `Command Palette` zobrazujú klávesovú skratku, ktorá je práve priradená ich príkazu, a to aj takú, ktorú zmenila hostiteľská aplikácia.  
Keď má niektorá položka fokus klávesnice, klávesy `↑` a `↓` cyklicky prechádzajú položkami, `Home` a `End` prejdú na prvú a poslednú položku a `Enter` alebo `Space` stlačí položku, ktorá má fokus. Všetky ostatné klávesové skratky naďalej fungujú, takže `Alt + N` pridá tabuľku aj odtiaľ.  
Kliknutia prijíma iba ponuka: stlačenie kdekoľvek inde na obrazovke sa odovzdá plátnu a kliknutie pravým tlačidlom na plátno ako obvykle otvorí kontextovú ponuku.

Kde je na plátne dosť miesta, ručne kreslené šípky ukazujú na:

- tlačidlo `Search` na paneli nástrojov: `Search commands and tables`
- tlačidlá `Theme` a `Display Language`: `Pick a theme and a language`, prípadne `Pick a theme` alebo `Pick a language`, keď panel nástrojov zobrazuje iba jedno z nich – pozrite si stránku [Jazyk a motív](./language-and-theme.md)
- [panel nástrojov plátna](./table-related-functions.md#canvas-toolbar) v dolnej časti: `Pan, zoom and draw relationships`

Kým je zobrazený [prieskumník](./explorer.md), uvítacia obrazovka prekrýva iba plátno vedľa neho.  
Šípka, ktorej tlačidlo na paneli nástrojov sa nachádza nad prieskumníkom, sa vynechá. Šípka pre `Theme` a `Display Language` sa vynechá, iba keď sa obe jej tlačidlá nachádzajú nad prieskumníkom; dovtedy ukazuje na to, ktoré je ešte nad plátnom.  
Popis, ktorý nemá vedľa svojej šípky miesto, sa namiesto toho zobrazí pod šípkou.

## Vytvorenie tabuľky {#table-creation}

Vytvorte tabuľku z kontextovej ponuky, tlačidlom `New Table` na [paneli nástrojov plátna](./table-related-functions.md#canvas-toolbar) alebo klávesovou skratkou `Alt + N`.

## Vytvorenie poznámky {#memo-creation}

Vytvorte poznámku z kontextovej ponuky, tlačidlom `New Memo` na paneli nástrojov plátna alebo klávesovou skratkou `Alt + M`.  
Kým je možnosť View Option → `Memos` vypnutá, poznámky sú skryté, položku `New Memo` nič neponúka a `Alt + M` nepridá žiadnu poznámku – pozrite si časť [Možnosti zobrazenia tabuliek](./table-related-functions.md#table-view-options).

Poznámka je voľný text na plátne. Kliknite do jej tela a píšte; text sa ukladá spolu s dokumentom.  
Kláves `Escape` zatvorí editor poznámky, pričom zachová to, čo ste napísali, a poznámku ponechá vybratú, a druhé stlačenie klávesu `Escape` zruší výber.  
Veľkosť poznámky zmeníte ťahaním jej okraja. Tlačidlo `x` v jej hlavičke, ktoré sa zobrazuje, kým je ukazovateľ nad poznámkou, ju odstráni.  
Kliknutie pravým tlačidlom na poznámku otvorí namiesto editora jej ponuku s položkami `Color`, `Remove color`, kým má niektorý vybratý objekt farbu, a `Delete`, ktorá sa zobrazí ako `Delete selected`, kým je poznámka jedným z dvoch alebo viacerých vybratých objektov. Vybratá poznámka sa odstraňuje aj klávesmi, ktoré odstraňujú tabuľky – pozrite si časť [Odstraňovanie tabuliek a poznámok](./table-related-functions.md#table-and-memo-deletion).

![Pridanie poznámky pomocou Alt + M, napísanie textu a zmena jej veľkosti ťahaním okraja](/img/demo-memo.webp)

## Vytvorenie skupiny tabuliek {#table-group-creation}

Skupina tabuliek je rámec, ktorý obsahuje tabuľky, a môžete jej dať názov a farbu. Vytvorte ju jedným z dvoch spôsobov:

- Vyberte položku `New Table Group` z kontextovej ponuky alebo z rýchleho vyhľadávania, kliknite na tlačidlo `New Table Group` na [paneli nástrojov plátna](./table-related-functions.md#canvas-toolbar), prípadne stlačte `Alt + G` (Windows/Linux) alebo `⌥ + G` (Mac) a potom ťahaním nakreslite rámec na plátne. Každá tabuľka, ktorej stred leží vnútri rámca, sa pridá do novej skupiny, pokiaľ už nepatrí do inej skupiny – pozrite si časť [Nakreslenie skupiny](./table-groups.md#drawing-a-group).
- Vyberte tabuľky a z kontextovej ponuky tabuľky vyberte položku `Group selected tables` alebo z rýchleho vyhľadávania položku `Group Selected Tables`, prípadne stlačte `T` a potom `G` – pozrite si časť [Zoskupenie vybratých tabuliek](./table-groups.md#grouping-selected-tables).

Pomenovanie, nastavenie farby, presun, zmenu veľkosti a všetko ostatné opisuje stránka [Skupiny tabuliek](./table-groups.md).

## Vytvorenie vzťahu {#relationship-creation}

Vzťah začnite kresliť z kontextovej ponuky, z [panela nástrojov plátna](./table-related-functions.md#canvas-toolbar) v dolnej časti plátna alebo klávesovou skratkou. Každý typ vzťahu má vlastnú:

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) alebo `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) alebo `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) alebo `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) alebo `⌘ + ⌥ + 4` (Mac)

Keď je typ aktivovaný, kurzor sa zmení. Kliknite najprv na nadradenú tabuľku a potom na podradenú tabuľku.  
Nadradená tabuľka dostane primárny kľúč, ak ho nemá, a pre každý stĺpec primárneho kľúča nadradenej tabuľky dostane podradená tabuľka stĺpec cudzieho kľúča s príznakom `Not Null`, ktorý má rovnaký typ údajov, predvolenú hodnotu, komentár, [logický názov](./logical-names.md) a [doménu](./dictionary.md#domains-and-data-types).  
Výnimkou je kľúč typu serial: jeho cudzí kľúč prevezme celočíselný typ, ktorý serial ukladá, napríklad `integer` pre `serial4`, a potom sa neprepojí so žiadnou doménou – pozrite si časť [Identifikujúce vzťahy](./relationship-editing.md#identifying-relationships).  
Každý stĺpec cudzieho kľúča sa pomenuje podľa svojho kľúča: jednoslovný názov, napríklad `id`, dostane pred seba názov nadradenej tabuľky (`user_id`), viacslovný názov, napríklad `member_id`, sa zachová a názov, ktorý podradená tabuľka už má, sa očísluje (`user_id_2`) – pozrite si časť [Názvy stĺpcov cudzích kľúčov](./relationship-editing.md#foreign-key-column-names).  
Dve kliknutia na tú istú tabuľku nakreslia rekurzívny vzťah.  
Nový vzťah má na začiatku akcie `On Delete` aj `On Update` nastavené na `Not set`; zmeňte ich v jeho kontextovej ponuke – pozrite si časť [ON DELETE a ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Ak chcete kreslenie zrušiť, stlačte `Escape` alebo znova stlačte tú istú klávesovú skratku. Zrušenie ponechá výber tak, ako je, a ďalšie stlačenie klávesu `Escape` ho zruší.

Keď je nadradená tabuľka zvolená, podržanie ukazovateľa nad tabuľkou, na ktorej môže vzťah skončiť, túto tabuľku orámuje a zobrazí vedľa nej dve tlačidlá:

- Tlačidlo `Create new columns` (`+`) nakreslí vzťah s novými stĺpcami cudzích kľúčov rovnako ako kliknutie na tabuľku.
- Tlačidlo `Map to existing columns` (ikona odkazu) ukončí kreslenie a otvorí pre obe tabuľky dialógové okno [Mapovať stĺpce](./relationship-editing.md#map-columns), takže vzťah môže použiť stĺpce, ktoré podradená tabuľka už má. Nič sa nezapíše, kým nestlačíte tlačidlo `Map`.

Tlačidlá zobrazí aj nadradená tabuľka, keď sa ukazovateľ posunie kúsok od miesta, kde ste na ňu klikli, takže aj rekurzívny vzťah možno namapovať na existujúce stĺpce.  
Dotyk prstom nepozná podržanie ukazovateľa, takže keď kreslíte prstom, tlačidlá sa nikdy nezobrazia a ťuknutie na podradenú tabuľku nakreslí vzťah okamžite; pero ich zobrazuje rovnako ako myš.  
Ak nadradená tabuľka do chvíle, keď sa dostanete k podradenej, stratí primárny kľúč, napríklad v dôsledku vrátenia späť alebo úpravy od spolupracovníka, tlačidlo `Create new columns` sa zobrazí stlmené s bublinovým popisom `<parent> has no primary key to copy` a kliknutie na podradenú tabuľku ukončí kreslenie bez toho, aby sa čokoľvek nakreslilo.  
Bublinový popis uvádza nadradenú tabuľku tak, ako ju pomenúva [Zobrazenie názvov](./logical-names.md#beyond-the-canvas).

![Kreslenie vzťahu One N pomocou ⌘ + ⌥ + 4 a potom vzťahu Zero N z panela nástrojov plátna, s orámovanou podradenou tabuľkou a jej tlačidlami Map to existing columns a Create new columns](/img/demo-relationship.webp)

## Duplikovanie tabuliek a poznámok {#duplicating-tables-and-memos}

Existujúce tabuľky a poznámky možno kopírovať, prilepovať a presunutím myšou so stlačeným klávesom `Alt` duplikovať – pozrite si stránku [Funkcie pre tabuľky](./table-related-functions.md#copyingpasting-tables-and-memos).
