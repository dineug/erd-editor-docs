---
sidebar_position: 16
description: Synchronizácia typu údajov vo vzťahoch a domény, maximálna šírka komentára, zamknutie nastavení (zobrazenie, karta, nastavenia kódu a Zobrazenie názvov), poradie zobrazenia stĺpcov, zoznam klávesových skratiek a karta Nastavenia editora iba na čítanie.
---

# Nastavenia

Otvoríte ich tlačidlom `Settings` na paneli nástrojov alebo z [rýchleho vyhľadávania](./quick-search.md) cez položku `Tab`.
Obrazovka Nastavenia má dve karty: `Preferences` a `Shortcuts`. Najprv sa otvorí karta `Preferences` s výnimkou otvorenia z riadka `Shortcuts` na [uvítacej obrazovke](./editing-start.md#welcome-screen), ktorý otvorí kartu `Shortcuts`.

Motív a jazyk zobrazenia na tejto obrazovke nie sú. Otvárajú ich tlačidlá `Theme` a `Display Language` na paneli nástrojov – pozrite si stránku [Jazyk a motív](./language-and-theme.md).

## Synchronizácia typu údajov vo vzťahoch {#relationship-datatype-sync}

Určuje, či sa majú synchronizovať typy údajov. Predvolene je zapnutá.
Zmena typu údajov stĺpca sa potom prenesie na každý stĺpec, ktorý je s ním spojený vzťahom, pričom sa reťazec sleduje z oboch koncov, takže cudzí kľúč sa nikdy neodchýli od kľúča, na ktorý odkazuje.
Z kľúča na jeho cudzie kľúče sa typ serial prenáša ako celočíselný typ, ktorý ukladá, rovnako ako pri kreslení vzťahu – pozrite si časť [Identifikujúce vzťahy](./relationship-editing.md#identifying-relationships). Zmena kľúča na `serial` teda pri databáze PostgreSQL dá jeho cudzím kľúčom typ `integer` a zmena odtiaľ pokračuje ďalej po reťazci.
Z cudzieho kľúča späť na jeho kľúč sa typ prenáša tak, ako je napísaný, s výnimkou kľúča typu serial, ktorý si svoj typ ponechá, a zmena sa tam zastaví.
Týmto nastavením sa riadi aj dialógové okno [Mapovať stĺpce](./relationship-editing.md#map-columns): kým je toto nastavenie zapnuté, každý existujúci stĺpec, ktorý mapuje, prevezme typ, ktorý jeho nadradený kľúč dáva cudziemu kľúču, a zmena sa šíri ďalej po vzťahoch ako vyššie. Keď je vypnuté alebo keď kľúč nemá typ údajov, stĺpec si ponechá vlastný typ.

[Doména](./dictionary.md#domains-and-data-types) dáva svoju hodnotu `Data Type` stĺpcom, ktoré sú s ňou prepojené, keď sa tento typ zmení a keď sa s ňou stĺpec prepojí. Kým je toto nastavenie zapnuté, zmena sa od každého z týchto stĺpcov šíri ďalej po vzťahoch ako vyššie; kým je vypnuté, zmenia sa iba prepojené stĺpce. Stĺpec, ktorý v tomto kroku prevezme typ svojej domény, si ho ponechá, aj keď by mu synchronizácia dala iný, napríklad celočíselný typ, ktorý kľúč typu serial dáva svojim cudzím kľúčom.
Prepojený stĺpec, ktorému synchronizácia alebo dialógové okno Mapovať stĺpce dá iný typ, než má jeho doména, sa v tom istom kroku od tejto domény odpojí – pozrite si časť [Odpojenie](./dictionary.md#unlinking). Pri žiadnom prilepení stĺpcov sa typ týmto nastavením neprenáša ďalej, a to ani typ domény, s ktorou prilepenie stĺpec prepojí – pozrite si časť [Kopírovanie/prilepovanie stĺpcov](./table-editing.md#copyingpasting-columns). Hodnota `Data Type` prilepená v hárku `Domains` na karte Slovník sa ním prenáša, rovnako ako každá zmena typu domény.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Nastavenie synchronizácie typu údajov vo vzťahoch" loading="lazy" />

![Zmena typu members.id na BIGINT UNSIGNED, ktorá aktualizuje každý stĺpec member_id, ktorý je s ním spojený](/img/demo-relationship-data-type-sync.webp)

## Maximálna šírka komentára {#maximum-comment-width}

Určuje maximálnu šírku stĺpca komentára v pixeloch (`60` ~ `200`).
Vypnutím prepínača sa obmedzenie zruší a kým je prepínač vypnutý, pole na zadanie hodnoty je neaktívne.
Po zapnutí sa začína hodnotou `60px`. Hodnota zadaná mimo rozsahu sa nahradí bližšou krajnou hodnotou.

![Zapnutie možnosti Maximum comment width, zadanie hodnoty 120 a karta ERD s komentármi skrátenými na túto šírku](/img/demo-settings-comment-width.webp)

## Zamknutie {#lock}

Zoznam `Lock` obsahuje sedem nastavení. Kým je zamknutie nastavenia zapnuté, súbor uchováva hodnotu, ktorú nastavenie malo v čase zamknutia, takže zmena nastavenia na obrazovke súbor nezmení.

| Riadok | Čo súbor uchováva | V novom diagrame |
| --- | --- | --- |
| `Viewport` | Úroveň priblíženia a polohu zobrazenia plátna ERD spoločne pod jedným zamknutím | `100% · 0, 0` |
| `Canvas Type` | Kartu, na ktorej sa diagram otvorí: `ERD`, `Visualization`, `Schema SQL`, `Code Generator` alebo `Dictionary` | `ERD` |
| `Language` | Jazyk na karte [Generátor kódu](./code-generator.md#language) | `GraphQL` |
| `Table Name Case` | [Štýl názvov tabuliek](./code-generator.md#name-case) na karte Generátor kódu | `Pascal` |
| `Column Name Case` | [Štýl názvov stĺpcov](./code-generator.md#name-case) na karte Generátor kódu | `Camel` |
| `Bracket Type` | Nastavenie `Bracket` na karte [Schéma SQL](./schema-sql.md#database-and-bracket) a pri cieľoch karty [Generátor kódu](./code-generator.md#bracket), ktoré ho ponúkajú | `None` |
| `Name View` | [Zobrazenie názvov](./logical-names.md#name-view), v ktorom sa diagram otvorí: `Physical Names`, `Logical Names` alebo `Both Names` | `Physical Names` |

Každý riadok zobrazuje hodnotu a tlačidlo zámku a kliknutím na tlačidlo sa zapne alebo vypne práve toto jedno zamknutie.
Kým je zamknutie zapnuté, tlačidlo zobrazuje zatvorený zámok s bublinovým popisom `Unlock Viewport` (a tak ďalej pre každý riadok) a hodnota s bublinovým popisom `Locked value` je tá, ktorú uchováva súbor.
Kým je vypnuté, tlačidlo zobrazuje otvorený zámok s bublinovým popisom `Lock Viewport` a stlmená hodnota s bublinovým popisom `Current value` ukazuje nastavenie v jeho aktuálnom stave.
Riadok `Viewport` uvádza priblíženie a potom polohu zobrazenia, napríklad `75% · -40, 91`. Poloha zobrazenia je bod na obrazovke v pixeloch, v ktorom leží bod `0, 0` diagramu, a súradnica s hodnotou tisíc alebo viac sa skracuje, napríklad na `1.2k` alebo `-24k`.

Zamknutie prevezme nastavenie v stave, v akom je v danom okamihu.
Kým je zamknutie zapnuté, nastavenie na obrazovke naďalej funguje: môžete posúvať zobrazenie a meniť priblíženie, prepínať karty, vyberať iný jazyk, štýl názvov alebo úvodzovky z ponúk, panelov možností alebo rýchleho vyhľadávania a prepínať Zobrazenie názvov na ktoromkoľvek mieste, ktoré ho ponúka – pozrite si časť [Prepnutie zobrazenia](./logical-names.md#switching-the-view).
Súbor však uchováva zamknutú hodnotu a riadok ju naďalej zobrazuje, takže diagram sa znova otvorí v zamknutom zobrazení, na zamknutej karte, v zamknutom Zobrazení názvov a so zamknutým jazykom, štýlmi názvov a úvodzovkami. Aj export JSON zapisuje zamknuté hodnoty.
Ak chcete uložiť to, čo zobrazuje obrazovka, vypnite zamknutie a súbor bude odvtedy nastavenie sledovať: pri vypnutom zamknutí `Viewport` sa diagram otvorí tam, kde ste ho nechali. Ak chcete namiesto toho zamknúť novú hodnotu, napríklad nové počiatočné zobrazenie, zamknutie vypnite a znova zapnite.
Ak zamknuté zobrazenie pri otvorení súboru neukazuje nič z diagramu, obrazovka sa aj tak presunie na diagram a zamknutá hodnota zostane nezmenená.
Zamknutie `Canvas Type` nikdy neuchováva kartu Nastavenia. Jeho zapnutím sa zamkne posledná iná karta, na ktorej ste boli, a kým je vypnuté, jeho riadok uvádza túto kartu.

![Odomknutie nastavenia Viewport, posúvanie a zmena priblíženia diagramu a opätovné zamknutie v novom zobrazení, ktoré ukazuje jeho riadok](/img/demo-settings-locks.webp)

Zapnutie alebo vypnutie zamknutia mení súbor, pretože súbor ukladá, ktoré zamknutia sú zapnuté, ale rovnako ako zvyšok karty Nastavenia sa nezaznamenáva do [histórie zmien](./undo-redo.md#what-the-history-records). Nezaznamenáva sa ani prepnutie Zobrazenia názvov, či už je zamknuté, alebo nie.
Všetky ostatné nastavenia sa ukladajú v aktuálnom stave: databáza, prepínače ponuky [`View Option`](./table-related-functions.md#table-view-options) a zvyšok karty `Preferences`.
Editor iba na čítanie nemení súbor žiadnym z nich, nech hovoria zamknutia čokoľvek: jeho tlačidlá zámkov a ostatné ovládacie prvky karty `Preferences` sú vypnuté a nastavenia, ktoré ešte dovoľuje zmeniť, zostávajú na tejto obrazovke – pozrite si časť [Editory iba na čítanie](#read-only-editors).

V novom diagrame, teda v diagrame začatom od nuly, sú zapnuté všetky zamknutia: v prázdnom súbore otvorenom vo VS Code, v aplikácii Obsidian alebo v IDE od JetBrains (v aplikácii Obsidian taký súbor vytvorí príkaz `ERD Editor: Create new diagram` aj položka `New ERD`), v novej schéme vo webovej aplikácii, v súbore vytvorenom z ponuky New v službe Google Drive alebo v elemente `<erd-editor>` bez zadanej hodnoty.
Aj schéma alebo súbor v službe Google Drive, ktoré webová aplikácia vytvorí importom súboru SQL, DBML, AML alebo GraphQL, začínajú so všetkými zamknutiami zapnutými. Pri vytvorení zo súboru JSON sa zachovajú zamknutia, ktoré tento súbor zaznamenáva.
Súbor, ktorý otvoríte, si ponechá zamknutia, s ktorými bol uložený, každé so svojou zamknutou hodnotou.
Súbor, ktorý nezaznamenáva žiadne zamknutia, napríklad súbor uložený verziou spred zavedenia zamknutí alebo napísaný ručne, sa otvorí so všetkými zamknutiami zapnutými: zobrazenie s hodnotou `100% · 0, 0` a karta `ERD` bez ohľadu na to, aké zobrazenie a akú kartu uložil, a jeho jazyk, štýly názvov, typ úvodzoviek a Zobrazenie názvov zamknuté tak, ako ich uložil.
Súbor uložený verziou spred zavedenia zamknutia `Name View` sa otvorí v zobrazení `Physical Names` so zapnutým zamknutím `Name View`, aj keď sú všetky ostatné zamknutia, ktoré zaznamenáva, vypnuté.
Zamknutia nastavuje aj položka `Import`, ktorá nahradí diagram: súbor JSON prinesie zamknutia, ktoré zaznamenáva, spolu s ich hodnotami a súbor SQL, DBML, AML alebo GraphQL ponechá vaše zamknutia, ale vráti zobrazenie na `100% · 0, 0` bez ohľadu na to, či je zamknuté – pozrite si časť [Import externých súborov](./file-import-export.md#importing-external-files). Vrátenie importu späť obnoví zamknutia a zamknuté hodnoty, ktoré import nahradil.

Zmena, ktorú zamknutie nepustí do súboru, sa nepočíta ako zmena. VS Code neoznačí kartu ako zmenenú a aplikácia Obsidian a IDE od JetBrains ponechajú súbor tak, ako bol, a to pri automatickom ukladaní aj pri zatvorení karty.
Pri všetkých zapnutých zamknutiach sa teda prezeranie diagramu, prepínanie kariet, skúšanie iného jazyka, štýlu názvov alebo úvodzoviek a prepínanie Zobrazenia názvov nikdy neprejaví vo výstupe príkazu `git diff`.
Pri vypnutom zamknutí `Viewport` posúvanie a zmena priblíženia menia súbor; pri vypnutom zamknutí `Canvas Type` ho mení aj prepínanie kariet vrátane prepnutia na kartu Nastavenia; pri vypnutom zamknutí `Name View` ho mení aj prepínanie Zobrazenia názvov.
Prázdny súbor nového diagramu zostane prázdny až do prvej zmeny, ktorú súbor uchová: úprava, zmena nastavenia, na ktoré sa nevzťahuje žiadne zamknutie, alebo zapnutie či vypnutie zamknutia.
Otvorenie diagramu a jeho zatvorenie bez takejto zmeny ponechá súbor tak, ako bol, bez ohľadu na to, ktorá verzia alebo ktorý počítač ho zapísal. Súbor obsahuje iba to, čím diagram je, v pevnom poradí, a súbor uložený v staršej forme sa do tejto formy prepíše raz, pri svojej prvej takejto zmene – pozrite si časť [Úložná forma a hodnota za behu](../../api/advanced/schema.md#storage-form-and-runtime-value).
Vo VS Code je revízia, ktorú znova otvoríte ako diagram príkazom `Reopen Editor With...`, napríklad revízia zo systému Git alebo záznam v Local History, iba na čítanie a nikdy sa neoznačí ako zmenená.
V službe Google Drive sa posunutie zobrazenia, zmena priblíženia ani prepnutie na inú kartu nikdy neuložia samostatne bez ohľadu na zamknutie. Pri vypnutom zamknutí `Viewport` sa zobrazenie zapíše iba spolu s inou zmenou, takže súbor v službe Drive sa otvorí v zobrazení z posledného uloženia, a to isté platí pre kartu pri vypnutom zamknutí `Canvas Type`. Prepnutie Zobrazenia názvov pri vypnutom zamknutí `Name View` sa uloží rovnako ako úprava a prepnutie pri zapnutom zamknutí alebo v editore iba na čítanie sa nikdy neuloží.

V [relácii spoločných úprav](../../api/advanced/collaborative-editing.md) sa zapnutie alebo vypnutie zamknutia prenesie do každého editora a zamknutie uchováva hodnotu editora, ktorý ho zapol.
Keď sa vypne zamknutie `Language`, niektorého zo štýlov názvov, `Bracket Type` alebo `Name View`, každý editor dostane hodnotu zobrazenú v editore, ktorý ho vypol, takže všetky uložia tú istú hodnotu. Vypnutie zamknutia `Viewport` alebo `Canvas Type` nikomu nepresunie zobrazenie ani kartu.
Jazyk, štýl názvov alebo úvodzovky vybraté pri zapnutom zamknutí sa naďalej prenesú do každého editora, ale Zobrazenie názvov má každý editor vlastné, kým je zamknutie `Name View` zapnuté: prepnutie sa zobrazí iba v editore, v ktorom sa vykonalo, a zapnutie zamknutia nikomu neprepne zobrazenie. Kým je vypnuté, prepnutie v ktoromkoľvek editore, ktorý nie je iba na čítanie, prepne všetky editory.
Programovací agent pracujúci cez server MCP nemá nástroj na zamknutia ani na nastavenia, ktoré tieto zamknutia držia, a pri zamknutom jazyku, štýle názvov alebo type úvodzoviek číta hodnotu, ktorú uchováva súbor. Ovplyvňujú ich iba jeho importy v režime `replace`, rovnako ako položka `Import` – pozrite si časti [Nastavenia](../../mcp/tools.md#settings) a [Import](../../mcp/tools.md#import). Nástroj `erd_list` a formát `snapshot` nástroja `erd_read` Zobrazenie názvov vynechávajú a agent upravuje schému vrátane logických názvov bez ohľadu na to, na aké zobrazenie sa niekto práve pozerá.

## Úprava poradia stĺpcov {#adjusting-column-order}

Nastavuje poradie zobrazenia stĺpcov v tabuľkách.
Presuňte riadok myšou na nové miesto – ťahať sa dá za celý riadok a označuje ho ikona úchytu. V predvolenom poradí ide o týchto deväť riadkov: `Logical Name`, `Name`, `DataType`, `Domain`, `Not Null`, `Unique`, `Auto Increment`, `Default` a `Comment`.
Riadok `Logical Name` určuje miesto bunky logického názvu, ktorú riadok tabuľky vykresľuje v zobrazení `Both Names`. V zobrazení `Logical Names` stojí logický názov namiesto toho na mieste riadka `Name` a zobrazenie `Physical Names` ho nevykresľuje vôbec – pozrite si časť [Zobrazenie názvov](./logical-names.md#name-view). Riadok `Domain` určuje miesto bunky domény, ktorú zobrazuje možnosť View Option → `Domain` – pozrite si časť [Bunka domény](./logical-names.md#the-domain-cell).
Bunka skrytá [možnosťou zobrazenia tabuliek](./table-related-functions.md#table-view-options) alebo vynechaná Zobrazením názvov si zachová svoje miesto v zozname, takže poradie platí pre tie bunky, ktoré sa práve zobrazujú.
Diagram, ktorého poradie sa nastavilo predtým, ako pribudli riadky `Logical Name` a `Domain`, dostane riadok `Logical Name` tesne pred riadok `Name` a riadok `Domain` tesne za riadok `DataType` bez ohľadu na to, kde v jeho poradí stoja.
Diagram uložený neskorším vydaním si poradie tiež ponechá, aj keď toto vydanie má riadok, ktorý tomuto chýba: riadky, ktoré toto vydanie má, stoja v poradí, aké im súbor dáva, a neznámy riadok sa vynechá. Uloženie diagramu tu zapíše poradie bez neho a neskoršie vydanie ten riadok vráti vedľa jeho suseda vo svojom predvolenom poradí.
Označenie [alternatívneho kľúča](./table-related-functions.md#alternate-keys) (`AK1.1` a tak ďalej) nie je jedným z týchto riadkov. V riadku stojí vždy na konci, za tou bunkou, ktorú toto poradie dá na posledné miesto.

![Posunutie nadol k Column Order a presunutie riadka Comment nahor pod Name, čím sa každý komentár dostane hneď za názov svojho stĺpca](/img/demo-settings-column-order.webp)

## Klávesové skratky {#shortcuts}

Karta `Shortcuts` je tabuľka iba na čítanie so stĺpcami `Command` a `Keybinding`, ktorá uvádza klávesové skratky pre platformu, ktorú používate.

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | `T` a potom `G` | `T` a potom `G` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

Väčšina z nich funguje iba na karte ERD a je potlačená, kým je otvorené rýchle vyhľadávanie, panel Vlastnosti tabuľky, prehliadač rozdielov, ukážka automatického rozloženia, cestovanie v čase alebo dialógové okno [`Export image`](./file-import-export.md#image) či [`Map Columns`](./relationship-editing.md#map-columns).
Výnimkami sú klávesové skratky `Search`, `Toggle Explorer` a `Stop`: `Search` zapína a vypína rýchle vyhľadávanie z ktorejkoľvek karty, `Toggle Explorer` z ktorejkoľvek karty otvorí [prieskumníka](./explorer.md#opening-and-closing) s fokusom v jeho vyhľadávaní a prepne na kartu ERD a `Stop` je skratka, ktorou sa zatvára rýchle vyhľadávanie, panel Vlastnosti tabuľky, prehliadač rozdielov, ukážka automatického rozloženia, cestovanie v čase, dialógové okno `Export image`, dialógové okno `Map Columns`, výber motívu, výber jazyka `Display Language`, výber farby, zoznam, ktorý otvára tlačidlo `Name View`, a otvorená kontextová ponuka.
Klávesová skratka `Toggle Explorer` prieskumníka znova zatvorí, kým je otvorený na karte ERD a neskrýva ho režim Zen, rovnako ako tlačidlo `Explorer` na paneli nástrojov. Keď je otvorené rýchle vyhľadávanie, panel Vlastnosti tabuľky, výber motívu, výber jazyka `Display Language`, dialógové okno `Export image` alebo `Map Columns`, zatvorí namiesto toho tento prvok a presunie fokus klávesnice do vyhľadávania v prieskumníkovi.
Klávesová skratka `Toggle Explorer` nemá žiadny účinok, kým sa upravuje bunka, poznámka alebo názov skupiny tabuliek. Ani ona, ani skratka `Search` nemajú žiadny účinok, kým sa upravuje bunka na karte [Slovník](./dictionary.md), takže text, ktorý sa do nej napísal, sa zachová. Kým je otvorený prehliadač rozdielov, ukážka automatického rozloženia alebo cestovanie v čase, skratka `Toggle Explorer` prenechá svoj kláves prehliadaču alebo hostiteľskej aplikácii – pozrite si časť [Panel hľadania v prehliadači](./find-and-replace.md#the-browsers-find-bar).
Na karte ERD klávesová skratka `Stop` ukončí otvorený editor bunky alebo poznámky, zatvorí editor názvu [skupiny tabuliek](./table-groups.md) bez premenovania skupiny alebo zruší práve kreslený vzťah či skupinu `New Table Group` a výber ponechá tak, ako je. Keď nie je otvorené nič z toho, zruší výber a aktívnu bunku a tým istým stlačením zatvorí otvorený výber farby. Otvorený výber motívu alebo výber jazyka `Display Language` sa v oboch prípadoch zatvorí tým istým stlačením.
V bunke logického názvu s otvoreným zoznamom termínov prvé stlačenie skratky `Stop` zatvorí iba tento zoznam – pozrite si časť [Dopĺňanie názvov termínov](./logical-names.md#completing-term-names).
Otvorený prieskumník, výber motívu ani výber jazyka `Display Language` nepotláčajú na plátne žiadnu z klávesových skratiek. Klávesová skratka `Stop` prieskumníka nikdy nezatvorí. Informácie o tom, čo skratka `Stop` a ostatné klávesy robia v prieskumníkovi, nájdete v časti [Klávesy v prieskumníkovi](./explorer.md#keys-in-the-explorer) a o tom, čo robia vo výbere jazyka, v časti [Výber jazyka](./language-and-theme.md#picking-a-language).
Klávesová skratka `Delete Selection` odstráni každú vybratú tabuľku, poznámku a skupinu tabuliek alebo, keď je vybratá jediná tabuľka s niektorými svojimi stĺpcami a priblíženie je nad `70%`, tieto stĺpce – pozrite si časť [Odstraňovanie tabuliek a poznámok](./table-related-functions.md#table-and-memo-deletion). Klávesová skratka `Remove Table, Memo` odstraňuje aj vybraté skupiny tabuliek.
Klávesová skratka `Add Table Group` spustí kreslenie skupiny [`New Table Group`](./table-groups.md#drawing-a-group) rovnako ako tlačidlo `New Table Group` na [paneli nástrojov plátna](./table-related-functions.md#canvas-toolbar) a druhé stlačenie kreslenie zruší. Klávesová skratka `Group Selected Tables` pozostáva z dvoch stlačení bez modifikačného klávesu, `T` a potom `G` do jednej sekundy. Vloží vybraté tabuľky do novej skupiny a otvorí editor jej názvu rovnako ako položka `Group selected tables` v kontextovej ponuke tabuľky a keď nie je vybratá žiadna tabuľka, nemá žiadny účinok – pozrite si časť [Zoskupenie vybratých tabuliek](./table-groups.md#grouping-selected-tables). Ani jedna z nich nemá žiadny účinok v editore iba na čítanie ani vtedy, keď sú skupiny [skryté](./table-groups.md#hiding-groups).
V editore iba na čítanie fungujú iba klávesy, ktoré slúžia na čítanie: `Search`, `Toggle Explorer`, `Stop`, `Table Properties` a `Focus on this table` na tabuľke, ktorú vybral skok, tri klávesy priblíženia, `Zen Mode`, kopírovanie a klávesy so šípkami, ktoré presúvajú aktívnu bunku. `Editing`, každý kláves `Add` a `Remove`, `Delete Selection`, `Primary Key`, oba klávesy výberu všetkého, štyri klávesy vzťahov, `Add Table Group`, `Group Selected Tables`, `Hand Tool` a prilepenie nič nerobia a `Undo` a `Redo` nevrátia späť ani nevykonajú znova nič – pozrite si časť [Editory iba na čítanie](./table-related-functions.md#read-only-editors).
Klávesové skratky `Zoom In`, `Zoom Out` a `Zoom Reset` menia priblíženie aj na karte [Vizualizácia](./visualization.md#toolbar), v režime `Graph` aj `Flow`, pokiaľ nie je otvorené rýchle vyhľadávanie.
V režime `Flow` klávesové skratky `Undo` a `Redo` prechádzajú o krok späť a dopredu cez to, na čo bol režim Flow zúžený, rovnako ako jeho tlačidlá `Previous table` a `Next table`, pokiaľ nie je otvorené rýchle vyhľadávanie. Zmeny diagramu tam nikdy nevracajú späť a v režime `Graph` nemajú žiadny účinok – pozrite si časť [Predchádzajúca a nasledujúca tabuľka](./visualization.md#previous-table-and-next-table).
Na karte Vizualizácia klávesová skratka `Stop` zatvorí aj ponuku [zobrazenia riadkov](./visualization.md#row-display) a zruší [rozloženie Flow](./visualization.md#how-flow-is-placed), ktoré ešte prebieha; zobrazenie zúžené skratkou `Focus on this table` nerozšíri.
Klávesová skratka `Focus on this table` otvorí kartu Vizualizácia v režime `Flow` zúženú na vybraté tabuľky a každú tabuľku vzdialenú o jeden vzťah a keď nie je vybratá žiadna tabuľka, nemá žiadny účinok – pozrite si časť [Zameranie na tabuľky](./visualization.md#focusing-on-tables).
Na karte Slovník pôsobia klávesové skratky `Undo` a `Redo` na históriu zobrazeného hárka namiesto histórie diagramu a v hárku `Checks` nemajú žiadny účinok – pozrite si časť [Hárky karty Slovník](./undo-redo.md#dictionary-sheets). V hárkoch `Domains`, `Words` a `Terms` vloží klávesová skratka `Add Column` riadky pod výber, tá istá skratka s pridaným klávesom `Shift` ich vloží nad výber a skratka `Remove Column` odstráni riadky, na ktoré sa výber vzťahuje – pozrite si časť [Pridávanie a odstraňovanie riadkov](./dictionary.md#adding-and-deleting-rows). Informácie o ostatných klávesoch karty nájdete v časti [Klávesy na karte](./dictionary.md#keys-on-the-tab).
Klávesové skratky `Select All Table, Memo`, `Hand Tool`, `Delete Selection` a `Group Selected Tables` ustupujú textovému kurzoru: kým upravujete bunku či poznámku alebo píšete do textového poľa, napríklad do poľa hľadania v prieskumníkovi, `Ctrl + A` (Windows/Linux) alebo `⌘ + A` (Mac) vyberie text, kláves `Space` napíše medzeru, klávesy `Delete` a `Backspace` mažú text a `T` a potom `G` napíše obe písmená.
Kopírovanie a prilepenie zabezpečujú vlastné klávesové skratky prehliadača `Ctrl + C` a `Ctrl + V` (Windows/Linux) alebo `⌘ + C` a `⌘ + V` (Mac), takže v tomto zozname nie sú – pozrite si stránku [Úprava tabuliek](./table-editing.md).

Klávesové skratky sa na tejto karte nedajú zmeniť.
Hostiteľská aplikácia, ktorá editor vkladá, ich mení metódou [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) okrem skratiek `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` a `Zoom Reset`, ktoré sú pevne dané.
Karta `Shortcuts` potom uvádza klávesové skratky hostiteľa: príkaz, ktorý hostiteľ nezmení, si ponechá predvolenú skratku a príkaz, ktorému hostiteľ nepriradí žiadny kláves, nezobrazuje žiadnu.
Klávesy pre riadky na karte Slovník sa riadia skratkami `Add Column` a `Remove Column`, takže zmenou priradenia ktorejkoľvek z nich sa zmenia aj tieto klávesy – pozrite si časť [`dictionaryRowChords`](../../api/erd-editor-element.md#dictionaryrowchords).

V aplikácii Obsidian sa tieto klávesy dostanú do editora vždy, keď je aktívna karta diagramu v aplikácii Obsidian, a to aj tam, kde rovnaký kláves používa niektorá klávesová skratka aplikácie Obsidian, napríklad `Alt + Enter`, `Ctrl + K` a `Ctrl + F` (Windows/Linux) alebo `⌥ + Enter`, `⌘ + K` a `⌘ + F` (Mac). Rovnako sa do editora dostane klávesová skratka `Alt + Shift + Enter` (Windows/Linux) alebo `⌥ + Shift + Enter` (Mac) karty Slovník, ktorá nie je v žiadnom riadku tohto zoznamu. Všetky ostatné klávesové skratky aplikácie Obsidian tam naďalej fungujú. Informácie o skratke `Ctrl + F` alebo `⌘ + F` nájdete v časti [Panel hľadania v prehliadači](./find-and-replace.md#the-browsers-find-bar).

## Editory iba na čítanie {#read-only-editors}

V editore s atribútom [`readonly`](../../api/erd-editor-element.md#readonly) karta Nastavenia zobrazuje nastavenia diagramu a žiadne z nich nemení. Vedľa nadpisu každej stránky, `Preferences` a `Shortcuts`, stojí odznak `Read only`.
Prepínače `Relationship DataType Sync` a `Maximum comment width` a pole šírky sú vypnuté, rovnako ako každé tlačidlo zámku. Riadky `Column Order` nemajú úchyt a nedajú sa ťahať.
Každý riadok `Lock` stále zobrazuje svoju hodnotu. Zamknutý riadok zobrazuje hodnotu, ktorú uchováva súbor, a odomknutý nastavenie tak, ako ho má táto obrazovka, čo sa môže líšiť od súboru, ako je uvedené nižšie.

Nastavenia, ktoré určujú, čo obrazovka zobrazuje, sa tam stále menia: poloha a priblíženie zobrazenia, karta, Zobrazenie názvov, databáza, jazyk Generátora kódu, oba štýly názvov, úvodzovky a prepínače [`View Option`](./table-related-functions.md#table-view-options).
Každé z nich mení iba danú obrazovku, nech hovorí jeho zamknutie čokoľvek. Neukladá sa do súboru ani sa nezapisuje exportom JSON, nezaznamenáva sa v histórii vrátenia späť, nepočíta sa ako zmena a nikdy sa nedostane k spolupracovníkom. Panely možností kariet [Schéma SQL](./schema-sql.md#options-panel) a [Generátor kódu](./code-generator.md#options-panel) označujú tieto voľby `This window only` namiesto `Saved in the document`.
Keď sa editor znova prepne na úpravy, databáza, jazyk, štýly názvov, úvodzovky a prepínače View Option sa vrátia na hodnoty súboru. Zobrazenie, karta a Zobrazenie názvov zostanú také, aké ste ich nechali, a súbor si každé z nich prevezme, ako to dovolí jeho zamknutie, pri vašej ďalšej zmene.
