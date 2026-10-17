---
sidebar_position: 4
description: Výber, presúvanie, kopírovanie, duplikovanie a odstraňovanie tabuliek a poznámok, nastavenie farieb a možností zobrazenia, definovanie indexov a alternatívnych kľúčov, výber databázy, pohyb po nekonečnom plátne a porovnávanie dokumentov.
---

# Funkcie pre tabuľky

Všetko, čo s tabuľkami a poznámkami robíte, keď už existujú – výber, presúvanie, kopírovanie, odstraňovanie, nastavenie farby a toho, čo plátno zobrazuje –, a k tomu ovládacie prvky plátna okolo nich.  
Najprv prídu na rad príkazy pre tabuľky a poznámky; potom Vlastnosti tabuľky, zameranie na tabuľky, indexy a alternatívne kľúče, automatické rozloženie a databázový systém; a nakoniec samotné plátno: panel nástrojov plátna, priblíženie, posúvanie a miesto, kam vedie skok, a prehliadač rozdielov.  
Skupiny tabuliek, teda rámce, ktoré zoskupujú tabuľky, majú vlastnú stránku – pozrite si stránku [Skupiny tabuliek](./table-groups.md).

## Viacnásobný výber {#multiple-selection}

Podporuje tri spôsoby:

- `Ctrl + drag` (Windows/Linux) alebo `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) alebo `⌘ + click` (Mac)
- `Ctrl + A` alebo `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` alebo `⌘ + ⌥ + A` (Mac)

Poznámky sa vyberajú rovnako a obe klávesové skratky na výber všetkého vyberú naraz všetky tabuľky a poznámky. Poznámky skryté cez View Option → `Memos` sa vynechávajú z výberu všetkého aj z výberového rámca – pozrite si časť [Možnosti zobrazenia tabuliek](#table-view-options).  
[Skupiny tabuliek](./table-groups.md#selecting-groups) sa do výberu pridávajú pomocou `Ctrl + click` (Windows/Linux) alebo `⌘ + click` (Mac) na ich záhlavie, výber všetkého však nikdy žiadnu z nich nevyberie.  
Klávesová skratka `Ctrl + A` ustupuje textovému kurzoru, takže počas úpravy bunky vyberie text, a nie diagram.  
Výberový rámec označí tabuľku alebo poznámku, keď prekryje jej stred, nie keď sa iba dotkne jej okraja. Skupinu tabuliek vyberie, iba keď obklopí celý rámec skupiny, takže rámec nakreslený vnútri skupiny vyberie tabuľky bez skupiny.  
Kliknutie pravým tlačidlom na niečo, čo už je vybraté, zachová celý výber, takže položky ponuky, napríklad `Color`, `Group selected tables` a `Delete selected`, sa použijú na celý výber. Kliknutie pravým tlačidlom na akúkoľvek inú tabuľku, poznámku alebo skupinu tabuliek vyberie iba ju, aj keď držíte `Ctrl` alebo `⌘`, a kliknutie pravým tlačidlom na vzťah alebo na prázdne plátno zruší výber.  
Kláves `Escape` zruší výber. Keď je otvorený editor bunky, poznámky alebo názvu skupiny tabuliek alebo keď sa kreslí vzťah či skupina pomocou `New Table Group`, prvé stlačenie klávesu `Escape` to ukončí a druhé zruší výber.

![Výber tabuliek pomocou ⌘ + drag a ⌘ + click, potom všetkých tabuliek a poznámok pomocou ⌘ + A](/img/demo-table-select.webp)

V relácii spoločných úprav sa výber, aktívna bunka a výberový rámec každého účastníka vykresľujú na plátne vo farbe daného účastníka – pozrite si stránku [Spoločné úpravy](../../api/advanced/collaborative-editing.md).

## Presúvanie viacerých tabuliek {#moving-multiple-tables}

Presuňte myšou ľubovoľnú tabuľku alebo poznámku, ktorá už je súčasťou výberu, a celý výber sa presunie s ňou – modifikačný kláves netreba.  
Ak presuniete niečo, čo nie je súčasťou výberu, výber sa zúži iba na tento objekt a presunie sa len on. `Ctrl + drag` (Windows/Linux) alebo `⌘ + drag` (Mac) zachová výber v oboch prípadoch.  
Tabuľky a poznámky presúva iba ľavé tlačidlo myši. Kliknutie pravým tlačidlom určí, na čo sa použije kontextová ponuka, a nič nepresunie a ťahanie stredným tlačidlom namiesto toho posúva plátno – pozrite si časť [Pohyb po plátne](#getting-around-the-canvas).

![Presunutie jednej z dvoch vybratých tabuliek presunie obe a vzťah ich nasleduje](/img/demo-table-multiple-move.webp)

Presúva sa aj vybratá [skupina tabuliek](./table-groups.md) spolu so svojimi tabuľkami a tabuľka, ktorá je vybratá a zároveň patrí do presúvanej skupiny, sa presunie iba raz.  
Podľa toho, kam tabuľku pustíte, sa môže presunúť do skupiny alebo zo skupiny – pozrite si časť [Pridávanie a odstraňovanie tabuliek](./table-groups.md#adding-and-removing-tables).

Tabuľky a poznámky majú spoločné poradie prekrývania. Stlačenie ľavého alebo pravého tlačidla na tabuľke alebo poznámke ju presunie pred všetky ostatné tabuľky a poznámky a stlačenie na záhlaví skupiny tabuliek alebo kliknutie pravým tlačidlom na jej telo presunie jej tabuľky dopredu.  
Poradie sa neukladá: znova otvorený diagram usporiada tabuľky v poradí, v akom sú uvedené v súbore, a všetky poznámky nad nimi.

## Kopírovanie/prilepovanie tabuliek a poznámok {#copyingpasting-tables-and-memos}

Skopíruje vybraté tabuľky a poznámky a prilepí ich späť ako nové.  
Klávesové skratky: `Ctrl + C` (Windows/Linux) alebo `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) alebo `⌘ + V` (Mac)

Skopírovaná tabuľka si zachová názov, komentár, stĺpce a farbu; skopírovaná poznámka si zachová text, veľkosť a farbu.  
Skopírujú sa aj indexy a vzťahy: index sa skopíruje celý do skopírovanej tabuľky a vzťah sa skopíruje spolu so svojím typom a akciami ON DELETE a ON UPDATE, ak sú obe tabuľky, ktoré spája, v kopírovanej množine. Vzťah, z ktorého by sa skopírovala iba polovica, sa vynechá a nezostane odkazovať späť na originál.  
Prilepené kópie sa stanú novým výberom a každé ďalšie prilepenie tej istej kópie ju posunie o ďalších `50px`, takže opakované prilepenia sa neukladajú jedno na druhé.  
Kópia si nezachová svoju [skupinu tabuliek](./table-groups.md): prilepená tabuľka nepatrí do žiadnej skupiny, ani keď sa ocitne vnútri rámca skupiny, a vybratá skupina sa neskopíruje.  
Kým View Option → `Memos` skrýva poznámky, prilepenie aj tak pridá poznámky, ktoré obsahuje, skryté a nevybraté, takže výberom sa stanú iba prilepené tabuľky.

![Skopírovanie dvoch súvisiacich tabuliek a ich dvojnásobné prilepenie vrátane vzťahu](/img/demo-table-copy-paste.webp)

Keď sú vnútri aktívnej tabuľky vybraté stĺpce, rovnaká klávesová skratka namiesto toho skopíruje tieto stĺpce – pozrite si stránku [Úprava tabuliek](./table-editing.md).

## Duplikovanie tabuliek a poznámok {#duplicating-tables-and-memos}

Podržte kláves `Alt` a presuňte tabuľku alebo poznámku ľavým tlačidlom myši.  
Za ukazovateľom sa pohybuje priesvitná ukážka a po uvoľnení tlačidla sa kópia umiestni tam, kde je ukážka.  
Ak je to, čo uchopíte, už súčasťou výberu, duplikuje sa celý výber. Inak sa výber nahradí entitou pod ukazovateľom.  
`Alt + click` bez pohybu umiestni kópiu o `50px` nižšie a doprava a vždy, keď je toto miesto už obsadené, ju posunie ešte ďalej.

Duplikát prenáša to isté ako prilepenie: názvy, komentáre, stĺpce, farby, veľkosti poznámok a indexy a vzťahy, ktoré celé patria do toho, čo ste skopírovali. Rovnako ako prilepená kópia nepatrí do žiadnej skupiny tabuliek.  
`Alt + drag` na záhlaví skupiny tabuliek presunie skupinu rovnako ako obyčajné presunutie myšou; skupina sa nikdy neduplikuje.

![Duplikovanie tabuľky pomocou Alt + drag, potom Alt + click pre ďalšiu kópiu nižšie a vpravo](/img/demo-table-duplicate.webp)

## Odstraňovanie tabuliek a poznámok {#table-and-memo-deletion}

Odstráni vybraté tabuľky, poznámky a [skupiny tabuliek](./table-groups.md).  
Klávesové skratky:

- `Delete` alebo `Backspace`. Tieto klávesy odstránia celý výber okrem prípadu, keď je jediným vybratým objektom tabuľka s niektorými vybratými stĺpcami a priblíženie je nad `70%`: vtedy namiesto toho odstránia tieto stĺpce – pozrite si časť [Odstraňovanie stĺpcov](./table-editing.md#column-deletion).
- `Ctrl + Backspace` alebo `Ctrl + Delete` (Windows/Linux), `⌘ + Backspace` alebo `⌘ + Delete` (Mac). Tieto skratky vždy odstránia vybraté tabuľky, poznámky a skupiny tabuliek, aj keď sú vybraté stĺpce.

![Odstránenie tabuľky a jej vzťahov klávesom Delete, potom tabuľky a poznámky naraz položkou Delete selected z ponuky poznámky](/img/demo-table-remove.webp)

Odstraňovať možno aj z kontextových ponúk. Posledná položka ponuky tabuľky alebo poznámky znie `Delete selected`, keď je táto tabuľka alebo poznámka jedným z dvoch alebo viacerých vybratých objektov, a odstráni celý výber. Inak znie `Delete` a odstráni iba túto tabuľku alebo poznámku. Nad riadkom vybratého stĺpca znie táto položka v ponuke tabuľky namiesto toho `Delete column` alebo `Delete columns`, ako v časti [Odstraňovanie stĺpcov](./table-editing.md#column-deletion).

Odstránením tabuľky sa spolu s ňou odstránia aj jej vzťahy a indexy. Odstránením skupiny tabuliek sa jej tabuľky zachovajú, bez skupiny – pozrite si časť [Odstránenie skupiny](./table-groups.md#removing-a-group).  
Nevyžaduje sa žiadne potvrdenie, každé odstránenie je jeden krok histórie zmien a v editore s atribútom `readonly` sa nič neodstráni.  
Pri podržaní odstránia klávesy `Delete` a `Backspace` iba raz a nikdy neodstránia vzťah – pozrite si stránku [Úprava vzťahov](./relationship-editing.md#deletion). Keď píšete do bunky, poznámky alebo iného textového poľa, namiesto toho upravujú text.  
Na karte Nastavenia sú oba klávesy uvedené ako `Delete Selection` – pozrite si časť [Klávesové skratky](./settings.md#shortcuts).

## Nastavenie farby tabuliek a poznámok {#table-and-memo-color-specification}

Farby môžete priradiť na rozlíšenie podľa kategórií.  
Tabuľka má svoju farbu pozdĺž ľavého okraja a poznámka pozdĺž hornej strany. Kliknite ľavým tlačidlom na tento okraj alebo pruh alebo vyberte položku `Color` v kontextovej ponuke tabuľky alebo poznámky, čím otvoríte výber farby pri ukazovateli. Farba sa použije na každú vybratú tabuľku, poznámku a skupinu tabuliek, nielen na tú, na ktorú ste klikli.  
Farba skupiny tabuliek sa nastavuje položkou `Color` v jej vlastnej ponuke a tabuľka vo farebnej skupine má farbu skupiny na celej hlavičke, pričom na ľavom okraji si ponecháva vlastnú farbu – pozrite si časť [Nastavenie farby skupiny](./table-groups.md#coloring-a-group).

![Výber prednastavenej farby Blue z farebného pruhu poznámky pre dve vybraté tabuľky a poznámku, potom odstránenie farby pomocou No color](/img/demo-table-color.webp)

Výber farby obsahuje zhora nadol:

- Plochu sýtosti a jasu, potom posúvač odtieňa s ukážkou farby vedľa neho. Ak prehliadač ponúka kvapkadlo, tlačidlo s pipetou pred posúvačom, `Pick a color from the screen`, nasníma farbu z ľubovoľného miesta na obrazovke.
- Polia `Hex`, `R`, `G` a `B`. Pole `Hex` prijíma 3, 4, 6 alebo 8 hexadecimálnych číslic s `#` alebo bez neho, prípadne prilepenú hodnotu `rgb()`, `hsl()` alebo názov farby CSS. Úplná 6- alebo 8-ciferná hodnota sa použije už počas písania, všetko ostatné po stlačení klávesu `Enter` alebo po opustení poľa. Polia `R`, `G` a `B` prijímajú celé čísla, pričom všetko nad `255` čítajú ako `255`, a hodnotu použijú po stlačení klávesu `Enter` alebo po opustení poľa. Text, ktorý výber farby nedokáže prečítať, sa zahodí.
- Šestnásť prednastavených farieb v dvoch radoch po osem: Red, Orange, Amber, Yellow, Lime, Green, Teal, Cyan, Blue, Indigo, Violet, Purple, Pink, Crimson, Brown a Gray. Keď podržíte ukazovateľ nad vzorkou farby, zobrazí sa jej hexadecimálny kód.
- `Document colors`: až osem farieb, ktoré už používajú tabuľky, poznámky a skupiny tabuliek dokumentu, od najpoužívanejšej. Tento rad sa zobrazuje, iba ak také farby existujú.
- `No color`.

Farba je vždy nepriehľadná: výber farby nemá ovládanie priehľadnosti a zahodí každú priehľadnosť, ktorú obsahuje zadaná alebo prilepená hodnota.  
Otvorenie výberu farby nič nezmení a zvolenie farby, ktorú už vybraté objekty majú, nepridá žiadny krok histórie zmien.

Možnosť `No color` odstráni farbu všetkých vybratých tabuliek, poznámok a skupín tabuliek v jednom kroku histórie zmien a zatvorí výber farby. Položka `Remove color`, ktorá je hneď pod položkou `Color` v kontextových ponukách tabuľky, poznámky a skupiny tabuliek, kým má niektorý vybratý objekt farbu, urobí to isté bez otvorenia výberu farby.

Po otvorení získa výber farby fokus klávesnice a `Tab` a `Shift + Tab` prechádzajú dookola jeho ovládacími prvkami. Klávesy so šípkami posúvajú plochu a posúvač odtieňa o 1, s klávesom `Shift` o 10, a prechádzajú od jednej vzorky farby k ďalšej, pričom každú hneď použijú.  
Kým má výber farby fokus klávesnice, vrátenie späť a opätovné vykonanie, klávesové skratky priblíženia, `Search` a `Toggle Explorer` sa stále dostanú k editoru, ostatné klávesové skratky editora nie: klávesové skratky na [odstránenie](#table-and-memo-deletion) nič neodstránia a `Delete` a `Backspace` iba upravujú text v poliach `Hex`, `R`, `G` a `B`.  
Kláves `Escape` zatvorí výber farby, rovnako ako stlačenie na plátne mimo neho.  
Stlačenie v [prieskumníkovi](./explorer.md) nie je stlačením na plátne, takže výber farby nechá otvorený. Riadok vybratý v prieskumníkovi zmení výber a ďalšie zvolenie farby zafarbí nový výber.

## Možnosti zobrazenia tabuliek {#table-view-options}

Ponúka tieto možnosti zobrazenia:

- Table Comment
- Column Comment
- DataType
- Default
- Not Null
- Unique
- Alternate Key
- Auto Increment
- Relationship
- Referential Actions
- Table Groups
- Memos

Možnosti `Unique`, `Alternate Key` a `Auto Increment` sú predvolene vypnuté a ostatné sú zapnuté.  
Možnosť `Alternate Key` označí stĺpce každého alternatívneho kľúča, napríklad ako `AK1.1` – pozrite si časť [Alternatívne kľúče](#alternate-keys).  
Možnosť `Referential Actions` zobrazuje popisky `D:` a `U:`, ktoré akcie ON DELETE a ON UPDATE vzťahu umiestňujú na koniec jeho spojnice pri podradenej tabuľke – pozrite si časť [Čítanie spojnice](./relationship-editing.md#reading-a-connector). Jej vypnutím sa skryjú iba tieto popisky a nepresunie sa žiadna tabuľka ani spojnica.  
Možnosť `Table Groups` zobrazuje [skupiny tabuliek](./table-groups.md) a farby skupín na hlavičkách ich tabuliek. Jej vypnutím sa skupiny skryjú na plátne, v minimape a v exportoch obrázkov, žiadna tabuľka sa nepresunie a každá tabuľka zostane vo svojej skupine – pozrite si časť [Skrytie skupín](./table-groups.md#hiding-groups). Zároveň sa z [prieskumníka](./explorer.md#the-tree) odstráni priečinok `Table Groups` a z [panela nástrojov plátna](#canvas-toolbar) tlačidlo `New Table Group` a vyhľadávanie v prieskumníkovi prestane nachádzať názvy skupín.  
Možnosť `Memos` zobrazuje poznámky. Jej vypnutím sa skryjú všetky poznámky na plátne, v minimape a v exportoch obrázkov a nepresunie sa žiadna tabuľka ani spojnica. Skryté poznámky nezaberajú miesto, takže posúvacie pruhy, minimapa a kompas `Go to content` ich vynechávajú.  
Skrytím poznámok sa zruší ich výber a zatvorí sa otvorený editor poznámky. [Prieskumník](./explorer.md#the-tree) vynechá svoj priečinok `Memos` a jeho [hľadanie a nahrádzanie](./find-and-replace.md) ani predpona `:` v rýchlom vyhľadávaní ich neprehľadávajú. Kým sú skryté, položka `New Memo` zmizne z kontextovej ponuky, [panela nástrojov plátna](#canvas-toolbar), rýchleho vyhľadávania a [uvítacej obrazovky](./editing-start.md#welcome-screen) a `Alt + M` nepridá žiadnu poznámku. Prilepenie alebo príkaz [Importovať a pridať](./file-import-export.md#import-and-add) aj tak pridá poznámky, ktoré obsahuje, skryté a nevybraté.  
V editore s atribútom `readonly` prepínače nič nezmenia.

![Prepínanie položiek View Option, pri ktorom sa tabuľky prekresľujú, označenie zloženého jedinečného indexu ako AK1.1 a AK1.2 pomocou Alternate Key, potom vypnutie a zapnutie Memos](/img/demo-view-options.webp)

Kartičky v režime `Flow` na karte Vizualizácia sa týmito možnosťami neriadia: používajú vlastné [zobrazenie riadkov](./visualization.md#row-display) a svoje spojnice vykresľujú, aj keď je možnosť `Relationship` vypnutá.

## Vlastnosti tabuľky {#table-properties}

Otvorí panel vlastností tabuľky.  
Začnite položkou `Table Properties` v kontextovej ponuke tabuľky, ktorá ho otvorí pre tabuľku, na ktorú ste klikli pravým tlačidlom, alebo vyberte tabuľku a stlačte `Alt + Space`.  
Panel sa otvorí uprostred stmaveného plátna. Stmaví sa iba plátno, takže otvorený [prieskumník](./explorer.md#dialogs-beside-it) zostane vedľa neho otvorený a použiteľný. Hlavička panela obsahuje nadpis `Table Properties`, päť naposledy otvorených tabuliek ako štítky so zvýraznenou aktuálnou tabuľkou a tlačidlo zatvorenia. Kliknutím na štítok prejdete na danú tabuľku bez opätovného otvorenia panela.  
Pod hlavičkou sú tri karty: `Indexes`, `Schema SQL` a `Code Generator`. Panel má pre všetky tri rovnakú veľkosť, takže prepínanie kariet ho nepresúva ani nemení jeho veľkosť.  
Zatvorte ho tlačidlom zatvorenia, klávesom `Escape` alebo kliknutím na plátno mimo neho.  
Výber iného riadka ako priečinka v prieskumníkovi alebo prechod na zhodu jeho vyhľadávania zatvorí panel Vlastnosti tabuľky pred skokom. To isté urobí klávesová skratka `Ctrl + F` (Windows/Linux) alebo `⌘ + F` (Mac), ktorá otvorí vyhľadávanie v prieskumníkovi alebo umiestni textový kurzor do jeho poľa hľadania, keď je prieskumník už otvorený. Akékoľvek iné kliknutie v prieskumníkovi vrátane riadka priečinka alebo kliknutie na tlačidlo `Explorer` na paneli nástrojov nechá panel Vlastnosti tabuľky otvorený. Stlačenie klávesu `Escape`, kým je fokus klávesnice v prieskumníkovi, iba vráti fokus klávesnice plátnu, takže na zatvorenie panela Vlastnosti tabuľky treba stlačiť `Escape` druhýkrát.

Kartu `Indexes` opisuje časť [Indexy](#indexes).  
Karta `Schema SQL` zobrazuje kód DDL tabuľky pre vybratú [databázu](#databases): jej príkaz `CREATE TABLE`, samostatné obmedzenia, ktoré niektoré databázy zapisujú pre jej stĺpce s príznakom Jedinečný, a jej indexy. Vždy zapisuje obyčajné príkazy `CREATE` bez hlavičky a bez skriptu pred tabuľkami alebo za tabuľkami, bez ohľadu na nastavenie karty [Schéma SQL](./schema-sql.md) na paneli nástrojov. Nemá panel možností a jej kontextová ponuka ponúka iba položky `Database` a `Bracket`.  
Karta `Code Generator` generuje kód iba pre túto tabuľku – pozrite si stránku [Generátor kódu](./code-generator.md).

V editore s atribútom `readonly` sa panel aj tak otvorí, s odznakom `Read only` vedľa nadpisu, no jeho karta `Indexes` neumožňuje žiadne úpravy.

## Zameranie na tabuľky {#focusing-on-tables}

Otvorí kartu Vizualizácia v režime `Flow` zúženú na vybraté tabuľky a všetky tabuľky, ktoré sú od nich vzdialené o jeden vzťah.  
Začnite položkou `Focus on this table` v kontextovej ponuke tabuľky alebo vyberte jednu alebo viac tabuliek a stlačte `Alt + F`.  
Keď je tabuľka, na ktorú kliknete pravým tlačidlom, jednou z viacerých vybratých tabuliek, položka znie `Focus on selected tables` a zameria zobrazenie na celý výber. Kliknutie pravým tlačidlom na tabuľku mimo výberu zameria zobrazenie iba na túto tabuľku.  
Klávesová skratka použije vybraté tabuľky, poznámky vynechá a nemá žiadny účinok, keď nie je vybratá žiadna tabuľka.  
Vybratá [skupina tabuliek](./table-groups.md) sa tu nepočíta, pri klávesovej skratke ani pri položke ponuky: jej tabuľky sa použijú, iba keď sú samy vybraté, čo urobí položka `Select tables` v ponuke skupiny.  
Čo zúžené zobrazenie ukazuje a ako sa vrátiť k celému diagramu, opisuje stránka [Vizualizácia](./visualization.md#focusing-on-tables).

## Indexy {#indexes}

Indexy sa definujú na karte `Indexes` panela vlastností tabuľky a sú zahrnuté v exportovanej schéme SQL.

Ľavá strana uvádza kľúče a indexy tabuľky v dvoch častiach.  
Časť `Keys`, ktorá sa zobrazuje, ak tabuľka nejaké kľúče má, uvádza kľúče, ktoré deklarujú jej stĺpce: `PK_<table name>` nad stĺpcami označenými ako PK, potom `UQ_<table name>_<column name>` pre každý stĺpec s príznakom Jedinečný, v poradí stĺpcov. Názvy sa riadia schémou SQL vybratej databázy, takže pri možnosti `Bracket` nastavenej na `None` sa pre tabuľku so schémou, napríklad `sales.users`, vo všetkých databázach okrem Databricks a Snowflake uvádza `PK_users` – pozrite si časť [Názvy tabuliek so schémou](./schema-sql.md#schema-qualified-table-names). Každý kľúč má značku `PK` alebo `UQ` a je označený zámkom. Sú tu iba na čítanie a menia sa iba spolu s príznakmi [PK](./table-editing.md#column-primary-key) a [Jedinečný](./table-editing.md#not-null-unique-auto-increment) stĺpcov.  
Časť `Indexes` uvádza indexy tabuľky v poradí, v akom boli pridané. Každý index má prepínač `UQ`, ktorý z neho urobí jedinečný index, pole názvu a tlačidlo `x`, ktoré ho odstráni. Index, ktorý je [alternatívnym kľúčom](#alternate-keys), zobrazuje aj svoje číslo, napríklad `AK1`. Index pridáte tlačidlom `Add Index` v dolnej časti zoznamu.

Pravá strana uvádza stĺpce tabuľky v časti `Columns`, každý so začiarkavacím políčkom. Kým nie je vľavo vybratý index, nič sa nedá upraviť.  
Začiarknutím stĺpca ho pridáte do vybratého indexu a zrušením začiarknutia ho odstránite. Po výbere kľúča sa jeho stĺpce zobrazia začiarknuté, ale políčka zostanú neaktívne.  
Stĺpce vybratého indexu sú uvedené nižšie v časti `Index order`. Ich poradie zmeníte presunutím myšou za úchyt a kliknutím na štítok `ASC` alebo `DESC` v riadku prepnete jeho smer zoradenia. V alternatívnom kľúči sa každý riadok končí svojím označením `AK<n>.<m>`. Zoznam zobrazuje tri riadky naraz a ostatné sú dostupné posúvaním.

V editore s atribútom `readonly` sa po výbere kľúča alebo indexu jeho stĺpce stále zobrazia, ale nie je k dispozícii tlačidlo `Add Index` ani `x` a nič iné na karte sa nedá zmeniť.

[Prieskumník](./explorer.md#the-tree) uvádza indexy každej tabuľky v jej priečinku `Indexes` a výberom indexu v ňom prejdete na jeho tabuľku. Jeho vyhľadávanie nájde aj názvy indexov a dokáže ich premenovať – pozrite si časť [Čo sa prehľadáva](./find-and-replace.md#what-it-searches).

![Otvorenie panela Vlastnosti tabuľky pre orders, kde karta Indexy uvádza kľúče PK a UQ nad indexmi, potom pridanie indexu nad member_id a ordered_at DESC a jeho kontrola na karte Schéma SQL](/img/demo-table-properties.webp)

## Alternatívne kľúče {#alternate-keys}

Alternatívny kľúč je jedinečný index nad dvoma alebo viacerými stĺpcami: index na karte `Indexes` so zapnutým prepínačom `UQ` a aspoň dvoma začiarknutými stĺpcami tabuľky.  
Jedinečný index nad jedným stĺpcom nevyjadruje nič viac ako príznak Jedinečný daného stĺpca, takže nie je alternatívnym kľúčom, a nie je ním ani obyčajný index, primárny kľúč či stĺpec s príznakom Jedinečný.

Keď je v [možnostiach zobrazenia](#table-view-options) zapnutá možnosť `Alternate Key`, diagram označí stĺpce každého alternatívneho kľúča tak, ako ich zapisujú erwin a IDEF1X: `AK1.1`, `AK1.2` a tak ďalej. Táto možnosť je predvolene vypnutá.

Kľúče sa číslujú podľa toho, kde v tabuľke stoja ich stĺpce, nie podľa poradia, v akom boli indexy pridané. Kľúč, ktorého prvý stĺpec v časti `Index order` stojí v tabuľke najvyššie, je `AK1`. Pri zhode rozhoduje ďalší stĺpec každého kľúča a kľúč, ktorý je začiatočnou časťou dlhšieho kľúča, je pred ním.  
Presunutie stĺpca v rámci tabuľky alebo zmena poradia v časti `Index order` kľúča môže kľúče prečíslovať. Vrátenie odstránenia kľúča späť mu vráti jeho číslo a každý spolupracovník vidí rovnaké čísla.

Každý stĺpec kľúča je označený `AK<n>.<m>`, kde `n` je číslo kľúča a `m` poradie stĺpca v časti `Index order` kľúča. Stĺpec vo viacerých kľúčoch nesie všetky označenia oddelené čiarkou.  
Napríklad v tabuľke so stĺpcami `a`, `b` a `c` sa z jedinečných indexov nad (`c`, `a`) a (`b`, `a`) stanú `AK1` = (`b`, `a`) a `AK2` = (`c`, `a`), pretože `b` stojí nad `c`. Stĺpec `b` má teda označenie `AK1.1`, `c` označenie `AK2.1` a `a` označenie `AK1.2,AK2.2`.

Označenie sa vykresľuje na konci riadka, za bunkou, ktorú [poradie stĺpcov](./settings.md#adjusting-column-order) umiestni ako poslednú. Nie je to bunka, takže nikdy nezíska fokus a nedá sa upraviť ani skopírovať – pozrite si stránku [Úprava tabuliek](./table-editing.md).  
Označenie AK môže niesť aj stĺpec primárneho alebo cudzieho kľúča, pretože označenie nič nenahrádza: ikona kľúča na začiatku riadka stále zobrazuje PK a FK a bunka Jedinečný si ponecháva vlastné označenie `UQ`.  
Tabuľka, ktorá má alternatívny kľúč, ponecháva za poslednou bunkou každého riadka miesto pre svoje najdlhšie označenie; tabuľka bez neho si zachováva svoju šírku.  
Označenia sa zobrazujú na plátne ERD, kde tabuľka zbalená na svoj názov pri `70%` a menej nezobrazuje žiadne, a v [exporte obrázka](./file-import-export.md#image), ktorý vykresľuje každú tabuľku celú bez ohľadu na priblíženie. Zobrazuje ich aj [ukážka pri podržaní ukazovateľa](./visualization.md#hover-preview) v režime `Graph` na karte Vizualizácia; kartičky v režime `Flow` ich nikdy nezobrazujú.

Karta `Indexes` zobrazuje čísla bez ohľadu na to, či je táto možnosť zapnutá – pozrite si časť [Indexy](#indexes).

## Automatické rozloženie {#auto-layout}

Usporiada za vás všetky tabuľky na plátne.  
Otvorte položku `Auto Layout` z kontextovej ponuky plátna alebo z rýchleho vyhľadávania a vyberte jedno zo štyroch rozložení:

| Rozloženie | Čo vykreslí |
| --- | --- |
| `Force` | Simulácia: vzťahy priťahujú tabuľky k sebe, susedné tabuľky sa navzájom odpudzujú a prekrývajúce sa tabuľky sa od seba oddelia. |
| `Flow` | Zľava doprava pozdĺž vzťahov, pričom každá spojnica dostane na tabuľke vlastný bod napojenia. Snaží sa udržať málo krížení, ale môže ponechať niektoré, ktorým by sa iné rozloženie vyhlo. |
| `Tree - vertical` | Vo vrstvách smerom nadol: nadradená tabuľka je nad tabuľkami, ktoré na ňu majú cudzí kľúč. |
| `Tree - horizontal` | Rovnaké vrstvenie, zľava doprava. |

Rozloženie `Force` otvorí ukážku, kým sa rozloženie ustáli, s tlačidlami `Apply` a `Cancel` v upozornení, ktoré zobrazí.  
Záber ukážky zodpovedá diagramu v stave, v akom bol pri spustení rozloženia, takže tabuľky sa počas ustaľovania rozloženia môžu dostať mimo záberu. Ukážka sa vykresľuje pri `70%` alebo menej, takže jej tabuľky sú zbalené na svoj názov a farebný okraj.  
Tlačidlo `Apply` zachová polohy v stave, v akom sú v danej chvíli, a keď sa rozloženie ustáli, použije sa samo. Tlačidlo `Cancel` alebo kláves `Escape` ponechá diagram v pôvodnom stave.

Ostatné tri sa vypočítajú naraz mimo hlavného vlákna, takže nie je čo sledovať: počas výpočtu rozloženia sa zobrazuje upozornenie a hotové usporiadanie sa vycentruje na oblasť, ktorú diagram už zaberá. Tlačidlo `Cancel` alebo kláves `Escape` zahodí rozloženie, na ktoré už nečakáte, a v hostiteľskej aplikácii, ktorá nespúšťa shared worker, skončí rozloženie oznámením `Could not place tables` – pozrite si časť [Web Workers](../../api/installation.md#web-workers). Rovnako skončí aj rozloženie, ktoré sa nevráti do 60 sekúnd.

Nech vyberiete ktorékoľvek, presunú sa tabuľky a skupiny tabuliek a poznámky zostanú na svojom mieste. Vzťah tabuľky so sebou samou sa ignoruje a viac vzťahov medzi tými istými dvoma tabuľkami sa počíta ako jeden.  
Každé rozloženie drží tabuľky každej skupiny pohromade bez ohľadu na to, či sú skupiny zobrazené, a každú skupinu, ktorá obsahuje tabuľky, prispôsobí tak, aby ich obklopovala – pozrite si stránku [Skupiny tabuliek](./table-groups.md#auto-layout).  
Výsledok sa zapíše ako jediný záznam histórie, takže jedno vrátenie späť vráti každú tabuľku a skupinu na pôvodné miesto.

![Upratanie kopy tabuliek automatickým rozložením Flow z kontextovej ponuky plátna, ktoré ich zoradí zľava doprava pozdĺž ich vzťahov](/img/demo-automatic-table-placement.webp)

## Databázy {#databases}

Medzi podporované databázy patria:

- Databricks
- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- Snowflake
- SQLite

Databázu vyberte v položke `Database` v kontextovej ponuke plátna, v paneli možností alebo v kontextovej ponuke kariet Schéma SQL a Generátor kódu alebo v rýchlom vyhľadávaní. Všetky menia to isté nastavenie.

Tieto možnosti určujú syntax schémy SQL pri exporte, automatické dopĺňanie typu údajov a typy, na ktoré sa prevedú vygenerovaný kód a importované schémy.  
Určujú, ktoré voľby `Statements` a `Header` dokáže karta [Schéma SQL](./schema-sql.md#options-panel) zapísať. Voľba, ktorú databáza nemá, zostane v paneli možností stlmená a SQL sa vráti k najbližšej voľbe, ktorú databáza má.  
Určujú aj to, ktoré akcie ON DELETE a ON UPDATE zapisujú Schéma SQL a ciele ORM na karte Generátor kódu a ktoré z nich ponuky vzťahu označujú ako `not in <database>` – pozrite si časti [ON DELETE a ON UPDATE](./relationship-editing.md#on-delete-and-on-update) a [Generátor kódu](./code-generator.md#database).  
Import schémy SQL zachová typ údajov stĺpca vrátane zoznamu argumentov bez ohľadu na to, či ho editor uvádza, napríklad `TIMESTAMP WITH TIME ZONE`, `public.mood` alebo `integer[]` – pozrite si časť [Typy údajov](./file-import-export.md#data-types). Automatické dopĺňanie typu údajov navrhuje iba typy, ktoré uvádza vybratá databáza.

![Prepnutie databázy na PostgreSQL, potom výber typu PostgreSQL v automatickom dopĺňaní](/img/demo-database.webp)

![Automatické dopĺňanie typu údajov s približnou zhodou, pohyb klávesmi so šípkami a potvrdenie klávesom Right, Tab alebo Enter](/img/demo-data-type-autocomplete.webp)

## Panel nástrojov plátna {#canvas-toolbar}

Nad stredom dolného okraja plátna sa vznáša malý panel nástrojov, ktorý zľava doprava obsahuje nástroje pôsobiace na samotné plátno a príkazy, ktoré doň pridávajú obsah:

- Ruka a ukazovateľ. Predvolený je ukazovateľ; ruka zmení každé ťahanie na posúvanie, nad tabuľkami aj nad prázdnym priestorom. Kláves `Space` medzi nimi prepína. Keď je aktivované kreslenie [`New Table Group`](./table-groups.md#drawing-a-group), namiesto nich je označené tlačidlo `New Table Group` a kliknutie na ruku alebo ukazovateľ, stlačenie klávesu `Space` alebo výber notácie vzťahu ukončí kreslenie bez pridania skupiny.
- `New Table`, `New Memo` a `New Table Group`. Tlačidlo `New Table` pridá tabuľku rovnako ako `Alt + N` a tlačidlo `New Memo` pridá poznámku rovnako ako `Alt + M`. Tlačidlo `New Table Group` aktivuje [kreslenie skupiny](./table-groups.md#drawing-a-group) rovnako ako `Alt + G` a vypne ruku; druhé kliknutie, rovnako ako druhé stlačenie `Alt + G`, ukončí kreslenie bez pridania skupiny. Tlačidlo `New Memo` nie je k dispozícii, kým View Option → `Memos` skrýva poznámky, a tlačidlo `New Table Group`, kým View Option → `Table Groups` skrýva skupiny. Editor s atribútom `readonly` nezobrazuje ani jedno z týchto troch tlačidiel.
- Priblíženie: `Zoom out`, aktuálne priblíženie v percentách a `Zoom in`. Obe tlačidlá menia priblíženie po krokoch rovnako ako klávesové skratky priblíženia a kliknutie na percentuálnu hodnotu ho vráti na `100%`.
- Štyri notácie vzťahu, tie isté štyri, ktorými začínate vzťah – pozrite si stránku [Začíname s úpravami](./editing-start.md). Výber jednej z nich prepne späť na ukazovateľ, pretože vzťah sa kreslí kliknutím na dve tabuľky.
- Režim Zen, `Alt + Z`, ktorý skryje všetko okrem plátna a tohto panela nástrojov. Opätovné stlačenie `Alt + Z` alebo tlačidlo vráti zvyšok späť. Otvorený prieskumník sa skryje spolu so zvyškom bez toho, aby sa zatvoril, a spolu s ním sa aj vráti. V režime Zen ho možno stále otvoriť – pozrite si časť [Kedy sa prieskumník nezobrazuje](./explorer.md#when-it-stands-aside).
- Kompas `Go to content`, ktorý sa na koniec panela nástrojov pridá iba vtedy, keď na obrazovke nie je žiadna tabuľka, zobrazená poznámka ani zobrazená skupina tabuliek – pozrite si časť [Pohyb po plátne](#getting-around-the-canvas).

Každé tlačidlo s klávesovou skratkou ju uvádza vo svojom bublinovom popise, napríklad `New Table (Alt + N)` (Windows/Linux) alebo `New Table (⌥ + N)` (Mac).  
Panel nástrojov sa skryje, kým je otvorená ukážka automatického rozloženia `Force`, panel Vlastnosti tabuľky, cestovanie v čase alebo prehliadač rozdielov, a keď sa zatvoria, vráti sa.

![Pridanie tabuľky a poznámky z panela nástrojov, aktivácia a deaktivácia New Table Group, posúvanie rukou, postupná zmena priblíženia a prepínanie režimu Zen pomocou ⌥ + Z](/img/demo-canvas-toolbar.webp)

## Priblíženie/oddialenie {#zoom-inout}

Priblíženie sa mení pomocou `Ctrl + Wheel` (Windows/Linux) alebo `⌘ + Wheel` (Mac). Samotné koliesko myši posúva plátno.  
Priblíženie mení aj stiahnutie prstov na touchpade, okolo bodu, v ktorom prsty sťahujete, a rovnako aj dva prsty na dotykovej obrazovke, ktoré pri pohybe zároveň posúvajú zobrazenie.  
Klávesové skratky: `Ctrl + Plus` (Windows/Linux) alebo `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) alebo `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) alebo `⌘ + 0` (Mac) vráti priblíženie priamo na `100%` a stred obrazovky pritom zostane na mieste.

Tlačidlá `Zoom out` a `Zoom in` na [paneli nástrojov plátna](#canvas-toolbar) menia priblíženie po krokoch ako klávesové skratky `Minus` a `Plus`: každé stlačenie ho zmení o 4 percentuálne body, pričom stred obrazovky zostane na mieste. Percentuálna hodnota medzi nimi zobrazuje aktuálne priblíženie a kliknutím na ňu sa priblíženie vráti priamo na `100%` rovnako ako pri `Ctrl + 0` (Windows/Linux) alebo `⌘ + 0` (Mac).

Priblíženie sa pohybuje od `10%` do `150%`.  
Pri `70%` a menej sa tabuľky zbalia na svoj názov a farebný okraj a úprava buniek, klávesové skratky buniek a kopírovanie a prilepovanie prestanú fungovať, kým zobrazenie znova nepriblížite.

Tie isté tri klávesové skratky menia priblíženie aj na karte Vizualizácia, v režime `Graph` aj `Flow`, každý režim vo vlastnom rozsahu – pozrite si stránku [Vizualizácia](./visualization.md#toolbar).

![Oddialenie pomocou ⌘ + Wheel, kým sa tabuľky nezbalia na svoj názov, potom postupný návrat pomocou ⌘ + Plus, ⌘ + Minus a ⌘ + 0](/img/demo-zoom.webp)

## Pohyb po plátne {#getting-around-the-canvas}

Plátno nemá okraje ani nastaviteľnú veľkosť. Tabuľky a poznámky sú tam, kam ich umiestnite, a všetko nižšie opisuje diagram, nie pevnú stránku.

Ak chcete posúvať zobrazenie, ťahajte prázdnu oblasť plátna alebo sa klávesom `Space` prepnite na nástroj Ruka a ťahajte kdekoľvek, aj nad tabuľkou. Zobrazenie posúva aj koliesko myši a `Shift + Wheel` ho posúva do strán.  
Telo [skupiny tabuliek](./table-groups.md#selecting-groups), teda oblasť pod jej záhlavím, sa pre ľavé tlačidlo počíta ako prázdne plátno: ťahaním sa posúva zobrazenie, `Ctrl + drag` (Windows/Linux) alebo `⌘ + drag` (Mac) nakreslí výberový rámec a kliknutie zruší výber.  
Posúvanie nemá hranice: koliesko myši, ťahanie a nástroj Ruka posunú zobrazenie tak ďaleko, ako ním pohnete, aj za tabuľky na ktorejkoľvek strane.

Ak chcete posúvať zobrazenie z ľubovoľného miesta na plátne, ťahajte stredným tlačidlom myši (stlačeným kolieskom), s ukazovateľom aj s rukou. Funguje to aj vtedy, keď stlačenie padne na tabuľku, poznámku, bunku, ikonu alebo vzťah.  
Ťahanie stredným tlačidlom nič nevyberie, nepresunie ani na nič neklikne a zachová výber. Zatvorí otvorenú kontextovú ponuku a výber farby a vlastné posúvanie a prilepovanie prehliadača pri kliknutí stredným tlačidlom sa nespustí.  
Stlačenie stredného tlačidla na posúvacích pruhoch, minimape, paneli nástrojov plátna alebo v otvorenom editore bunky alebo poznámky zobrazenie neposúva.

Minimapa v pravom hornom rohu zobrazuje diagram s okrajom veľkým ako jedna obrazovka na každej jeho strane, teda dosah posúvacích pruhov, zaokrúhlený smerom von na hrubú mriežku, takže čím viac oddialite, tým menší je v nej diagram. Kliknutím do nej presuniete zobrazenie na dané miesto a ťahaním obdĺžnika zobrazovacej oblasti posúvate zobrazenie. Pri oddiaľovaní sa obdĺžnik zobrazovacej oblasti zväčšuje a pokrýva väčšiu časť mapy.  
Každú tabuľku vykresľuje vo farbe tabuľky a každú zobrazenú skupinu tabuliek ako rámec vo farbe skupiny za jej tabuľkami.  
Posúvacie pruhy pozdĺž pravého a dolného okraja opisujú ten istý rozsah pohybu, ktorý siaha od polohy, keď je diagram tesne za jednou stranou obrazovky, po polohu, keď je tesne za druhou, takže je aspoň o jednu obrazovku dlhší ako vykreslený diagram, a ešte dlhší, kým je zobrazenie posunuté za diagram. Mimo režimu Zen sa oba posúvacie pruhy zobrazujú vždy, keď dokument obsahuje tabuľku, zobrazenú poznámku alebo zobrazenú skupinu tabuliek, aj keď sa všetko zmestí na obrazovku. Dokument bez nich, napríklad taký, ktorého jediné poznámky sú skryté cez View Option → `Memos`, nezobrazuje ani jeden z nich, ani minimapu.  
Ťahanie jazdca posúvacieho pruhu alebo obdĺžnika zobrazovacej oblasti v minimape je jediné posúvanie, ktoré sa zastaví: nedostane sa ďalej, ako sú tabuľky tesne za okrajom obrazovky, alebo ako miesto, kde ťahanie začalo, ak bolo ďalej.

Ak po posunutí nezostane na obrazovke žiadna tabuľka, zobrazená poznámka ani zobrazená skupina tabuliek, na koniec [panela nástrojov plátna](#canvas-toolbar) sa pridá kompas `Go to content` so šípkou smerujúcou k najbližšiemu z týchto objektov a s údajom o jeho vzdialenosti. Kliknutím naň tento objekt vycentrujete bez zmeny priblíženia.

![Posúvanie ťahaním prázdneho plátna, ťahaním stredným tlačidlom nad tabuľkou, minimapou a kolieskom myši, potom návrat podľa kompasu Go to content](/img/demo-canvas-navigation.webp)

### Kam vedie skok {#where-a-jump-lands}

Každý prechod, ktorý vás presunie na niečo na plátne, posúva zobrazenie podľa jedného pravidla: výsledky `#`, `@` a `:` [rýchleho vyhľadávania](./quick-search.md#searching-the-diagram), riadky [prieskumníka](./explorer.md#going-to-a-row) a zhody jeho funkcie [hľadanie a nahrádzanie](./find-and-replace.md#going-to-a-match), riadky zoznamu [prehliadača rozdielov](#going-to-a-change), [tlačidlo na kartičke](./visualization.md#card-buttons) s externým odkazom v režime Flow a umiestnenie po príkaze [Importovať a pridať](./file-import-export.md#import-and-add). Každá z týchto častí uvádza, čo prechod vyberie; táto časť uvádza, kam sa presunie zobrazenie.

Skok nikdy nemení priblíženie a posunie zobrazenie najviac raz. Z inej karty najprv prepne na kartu ERD.  
Plátno meria tak, ako sa zobrazuje: pod horným panelom nástrojov, v režime Zen na celú výšku, a vpravo od otvoreného prieskumníka, ktorý plátno zužuje, a nie prekrýva.

Vodorovný a zvislý smer sa posudzujú samostatne a v smere, v ktorom je cieľ už dobre viditeľný, zostane zobrazenie presne tak, ako je:

- Cieľ, ktorý v danom smere nie je dlhší ako polovica plátna, zostane na mieste, kým jeho stred leží v strednej polovici plátna, teda medzi štvrtinou a troma štvrtinami šírky alebo výšky. Inak sa jeho stred presunie do stredu plátna.
- Dlhší cieľ, ktorý sa ešte zmestí s rezervou `40px` na každom konci, zostane na mieste, kým je celý viditeľný. Inak sa vodorovne vycentruje; zvisle sa jeho horný okraj presunie `40px` pod horný okraj plátna.
- Ešte dlhší cieľ zostane na mieste, kým je celý viditeľný, alebo, ak je dlhší ako plátno, kým je viditeľná jeho kľúčová časť uvedená nižšie. Inak sa vycentruje, ak sa zmestí, a ak nie, umiestni sa tak blízko stredu, ako to dovolí ponechanie oboch koncov jeho kľúčovej časti aspoň `40px` vnútri plátna; pri kľúčovej časti, ktorá je na to príliš dlhá, zostane `40px` vnútri plátna jej začiatok.

Pri malej tabuľke pri ľavom okraji plátna v polovici výšky sa teda zobrazenie posunie iba vodorovne.

Čo skok zobrazí a kľúčová časť, ktorá musí byť viditeľná, keď sa celok nezmestí:

- Tabuľka: celá tabuľka, podľa pásu s názvom v jej hornej časti alebo pri zhode v komentári tabuľky podľa bunky komentára, kým View Option → `Table Comment` zobrazuje komentáre. Pri `70%` a menej, keď sú tabuľky zbalené na svoj názov, podľa názvu v strede rámčeka tabuľky.
- Stĺpec: jeho riadok, podľa bunky, na ktorú skok vedie: jeho názov alebo komentár, v ktorom je zhoda, kým View Option → `Column Comment` zobrazuje komentáre. Pri `70%` a menej stĺpec zobrazí svoju tabuľku podľa pravidla pre tabuľky.
- Bunka, ktorá je príliš široká na to, aby sa zobrazila celá, napríklad dlhý komentár: podľa zhodného textu v nej.
- Vzťah: oblasť pokrývajúca jeho dve tabuľky, podľa podradenej tabuľky.
- Skupina tabuliek: jej rámec, podľa jej záhlavia.
- Poznámka alebo blok, ktorý umiestni príkaz Importovať a pridať: celý objekt.

Keď by sa zobrazenie nemalo pohnúť v žiadnom smere, k posunu nedôjde, takže pri dvoch prechodoch na to isté miesto za sebou sa druhýkrát nič nepohne. Skok, ktorý posunie plátno, zaznamená posun do [histórie zmien](./undo-redo.md#what-the-history-records) ako každú inú zmenu polohy zobrazenia, a skok, ktorý nič nepohne, nezanechá nič na vrátenie späť. Pri príkaze Importovať a pridať je posun súčasťou toho istého kroku ako pridanie. Riadok zoznamu prehliadača rozdielov posúva len strany zobrazenia, ktoré sú iba na čítanie, takže nič nezaznamená.  
Žiadny skok nezačne ani nedokončí kreslenie vzťahu. Kompas `Go to content` nie je skok: vycentruje to, na čo ukazuje.

## Prehliadač rozdielov {#diff-viewer}

Môžete porovnať predtým uložené dokumenty s aktuálnym dokumentom.  
V kontextovej ponuke plátna vyberte položku `Diff Viewer` a zvoľte dokument `.json`, ktorý ste predtým exportovali.

Zobrazenie sa otvorí nad plátnom: vľavo to, čo sa zmenilo, potom vedľa seba uložený a aktuálny dokument.  
Aktuálny dokument sa porovnáva v stave, v akom je pri otvorení zobrazenia; zmeny vykonané potom, vrátane zmien spolupracovníka, sa do zobrazenia nedostanú. Otvorený [prieskumník](./explorer.md#when-it-stands-aside) je skrytý, kým je zobrazenie otvorené, takže zobrazenie zaberá celú šírku editora.  
Každú stranu možno posúvať kolieskom myši, ťahaním prázdnej oblasti alebo tela skupiny tabuliek alebo ťahaním stredným tlačidlom kdekoľvek nad ňou a priblíženie sa na nej mení pomocou `Ctrl + Wheel` (Windows/Linux), `⌘ + Wheel` (Mac) alebo stiahnutím prstov. Pri `70%` a menej sa jej tabuľky zbalia rovnako ako na plátne – pozrite si časť [Označenia na oboch stranách](#marks-on-the-two-sides).  
Obe strany sú iba na čítanie, takže vo vašom dokumente sa nič nezmení. Každá má vlastný výber a kliknutie na tabuľku na niektorej strane ju vyberie iba na tejto strane.  
Zobrazenie zatvorte tlačidlom `Close` v upozornení `Diff Viewer`, ktoré sa zobrazí pri jeho otvorení, alebo klávesom `Escape`.

![Otvorenie prehliadača rozdielov pre uložený súbor .json, klikanie na riadky označené A, M, D a R v jeho strome, filtrovanie podľa názvu a jeho zatvorenie](/img/demo-diff-viewer.webp)

### Čo sa porovnáva {#what-is-compared}

Porovnávajú sa tabuľky, stĺpce, indexy, cudzie kľúče, poznámky aj skupiny tabuliek.  
Každá položka sa najprv páruje podľa svojho identifikátora (id), takže pri porovnaní so staršou verziou toho istého súboru, ktorá identifikátory zachováva, je premenovaná tabuľka, stĺpec, index alebo skupina tabuliek stále jedna položka, uvedená ako premenovaná.  
Zvyšné položky sa párujú jedna k jednej podľa toho, čo si zachovávajú: tabuľka alebo skupina tabuliek podľa názvu vrátane veľkosti písmen; stĺpec alebo index podľa tabuľky a názvu; cudzí kľúč podľa svojich dvoch tabuliek a párov stĺpcov; a poznámka podľa textu, potom podľa polohy. Index bez názvu sa páruje podľa stĺpcov, ich poradia a smeru a podľa toho, či je jedinečný, a skupina tabuliek bez názvu podľa najväčšieho počtu spoločných tabuliek.  
Pri porovnaní so súborom z iného zdroja, napríklad s diagramom znova vytvoreným importom SQL, sa preto premenovaná tabuľka zobrazí ako jedna odstránená a jedna pridaná.

Čo sa počíta ako zmena:

- Tabuľka: názov, komentár, skupina tabuliek, poloha a farba.
- Stĺpec: názov, komentár, typ údajov, predvolená hodnota, Automatický prírastok, primárny kľúč, Jedinečný, NOT NULL a jeho miesto v tabuľke. Ako presunuté sa počítajú iba stĺpce mimo poradia, ktoré majú oba dokumenty spoločné, takže pridanie, odstránenie alebo presunutie jedného stĺpca neoznačí ostatné.
- Index: názov, UNIQUE a stĺpce s ich poradím a smerom.
- Cudzí kľúč: páry stĺpcov, typ vzťahu a akcie ON DELETE a ON UPDATE.
- Poznámka: text, poloha, veľkosť a farba.
- Skupina tabuliek: názov, tabuľky, ktoré obsahuje, farba, poloha a veľkosť.

Tabuľka, poznámka alebo skupina, ktorá bola iba presunutá alebo jej bola zmenená veľkosť či farba, sa teda počíta ako zmenená. Polohy a veľkosti sa porovnávajú v celých pixeloch a poradie prekrývania ani miesto, kde sa spojnica stretáva s tabuľkou, sa nikdy nepočítajú.

### Strom zmien {#the-change-tree}

Zoznam vľavo sa vykresľuje ako [strom prieskumníka](./explorer.md#the-tree) a obsahuje iba to, čo sa zmenilo: `Tables`, `Table Groups` a `Memos`, pričom každý z týchto priečinkov sa zobrazuje, iba ak obsahuje nejaký riadok, a pod tabuľkou jej vlastné `Columns`, `Indexes` a `Foreign Keys`. Cudzí kľúč je uvedený pod svojou podradenou tabuľkou a pridaná alebo odstránená tabuľka v sebe nič neuvádza.  
Každý priečinok zobrazuje, koľko riadkov obsahuje, a každý priečinok a tabuľka sú na začiatku rozbalené.  
Tabuľky a skupiny tabuliek sú zoradené podľa názvu bez ohľadu na veľkosť písmen. Poznámky a stĺpce, indexy a cudzie kľúče tabuľky zachovávajú poradie aktuálneho dokumentu, pričom odstránená položka sa vráti na miesto, kde bola. Riadok poznámky zobrazuje prvý riadok poznámky a riadok cudzieho kľúča zobrazuje jeho stĺpce v podradenej tabuľke, potom `→` s nadradenou tabuľkou a jej stĺpcami, napríklad `user_id → users(id)`. Prázdny názov sa zobrazí ako `unnamed` kurzívou.

Každý riadok končí písmenom a riadok označený `A`, `D`, `M` alebo `R` má názov vo farbe tohto písmena:

- `A`, pridaný, zelenou: iba v aktuálnom dokumente.
- `D`, odstránený, červenou a prečiarknutý: iba v uloženom dokumente.
- `M`, zmenený, jantárovou: v oboch, so zmenou.
- `R`, premenovaný, modrou: v oboch, s novým názvom. Premenovanie má prednosť pred akoukoľvek inou zmenou, ktorú však bublinový popis stále uvádza.
- `~`, jantárovou, je na konci každého priečinka a tabuľky uvedenej iba pre zmeny v jej vnútri; ich názvy si zachovávajú obvyklú farbu.

Keď podržíte ukazovateľ nad názvom riadka, zobrazí sa jeho bublinový popis: stav `Added`, `Deleted`, `Modified`, `Renamed` alebo `Changed inside`, potom jeden riadok pre každú zmenu, napríklad `Name: users → members` alebo `NN: ✗ → ✓`. Text sa cituje svojím prvým riadkom skráteným po 40 znakoch a prázdna hodnota sa zobrazí ako `—`. Bublinový popis pridanej alebo odstránenej položky obsahuje iba jej stav.

Pole `Filter by name` nad stromom ponechá riadky, ktorých aktuálny alebo uložený názov obsahuje zadaný text, bez ohľadu na veľkosť písmen. Tabuľka, ktorej názov sa zhoduje, si ponechá všetky svoje riadky, a tabuľka, ktorej názov sa nezhoduje, zostane iba so zhodnými riadkami. Filter, ktorému nič nezodpovedá, ponechá strom prázdny.  
Keď sa tieto dva dokumenty vôbec nelíšia, v strome sa zobrazí `No changes`.

Ťahaním pravého okraja stromu ho rozšírite alebo zúžite, od `200px` do `480px`, a dvojitým kliknutím na okraj ho vrátite na `260px`. Každé porovnanie sa otvorí so šírkou `260px` a obe strany si zvyšok šírky rozdelia rovným dielom.  
Klávesnicou sa po strome pohybujete rovnako ako po strome prieskumníka – pozrite si časť [Klávesy v prieskumníkovi](./explorer.md#keys-in-the-explorer) –, tu však kláves `Escape` v strome alebo v poli `Filter by name` zatvorí zobrazenie.

### Prechod na zmenu {#going-to-a-change}

Kliknutím na riadok alebo stlačením klávesu `Enter` alebo `Space`, keď je na ňom fokus klávesnice, prejdete na jeho položku na každej strane, ktorá ju obsahuje: na pridanú položku iba na aktuálnej strane, na odstránenú iba na uloženej strane a na všetko, čo obsahujú obe, na oboch stranách. Riadok priečinka sa iba zbalí alebo rozbalí a to isté robí šípka na začiatku riadka tabuľky.

- Riadok tabuľky, stĺpca alebo indexu vyberie iba tabuľku.
- Riadok cudzieho kľúča zobrazí jeho dve tabuľky, prípadne podradenú tabuľku, keď sú obe príliš ďaleko od seba, aby sa zobrazili spolu, vyberie podradenú tabuľku s jej stĺpcami cudzieho kľúča a zvýrazní spojnicu – pozrite si časť [Čítanie spojnice](./relationship-editing.md#reading-a-connector).
- Riadok poznámky vyberie poznámku a riadok skupiny tabuliek vyberie skupinu. Poznámka alebo skupina, ktorú dokument danej strany skrýva, na tejto strane nikam nevedie.

Každá strana sa posúva podľa pravidla v časti [Kam vedie skok](#where-a-jump-lands), pričom sa meria na danej strane, takže opätovné kliknutie na ten istý riadok nič nepohne.

### Označenia na oboch stranách {#marks-on-the-two-sides}

Obe strany farbia text, obrysy a spojnice a nič nevypĺňajú. Pridané je zelené a zobrazuje sa iba na aktuálnej strane, odstránené je červené a zobrazuje sa iba na uloženej strane, zmenené je jantárové a premenované modré a obe sa zobrazujú na oboch stranách. Všetko nezmenené sa vykresľuje ako obvykle.

- Pridaná alebo odstránená tabuľka či skupina tabuliek má obrys v príslušnej farbe a jej názov túto farbu prevezme. Pridaná alebo odstránená poznámka má obrys.
- Pridaný alebo odstránený stĺpec v tabuľke, ktorú obsahujú oba dokumenty, zafarbí celý svoj riadok a presunutý stĺpec zafarbí celý svoj riadok jantárovou. Vnútri pridanej alebo odstránenej tabuľky sa nič neoznačuje samostatne.
- Text zmenenej bunky sa zafarbí jantárovou: komentár tabuľky, komentár stĺpca, typ údajov, predvolená hodnota, Automatický prírastok, Jedinečný alebo NOT NULL, prípadne text poznámky. Zmena primárneho kľúča zafarbí ikonu kľúča stĺpca jantárovou.
- Premenovaná tabuľka, stĺpec alebo skupina tabuliek má názov modrou.
- Tabuľka, poznámka alebo skupina tabuliek so zmenou, ktorá nemá vlastnú bunku, napríklad presun, nová veľkosť alebo farba či zmena skupiny alebo tabuliek skupiny, má jantárový obrys.
- Pridaný, odstránený alebo zmenený cudzí kľúč vykreslí svoju spojnicu v príslušnej farbe. Pri podržaní ukazovateľa nad ňou alebo pri zvýraznení z riadka sa namiesto toho vykreslí obvyklou farbou pre podržanie ukazovateľa.
- Zmena indexu neoznačí nič na žiadnej strane; zobrazuje sa iba v strome.

Každá strana sa riadi možnosťami zobrazenia svojho dokumentu. Zmena v bunke, ktorú daná strana nevykresľuje, sa namiesto toho prejaví na názve. Zmena stĺpca v bunke, ktorú skrýva niektorá možnosť zobrazenia, napríklad `Unique` alebo `Auto Increment`, ktoré sú obe predvolene vypnuté, zafarbí názov stĺpca jantárovou, a rovnako aj zmena primárneho kľúča v riadku, ktorý nezobrazuje ikonu kľúča. Zmena komentára tabuľky, kým je možnosť `Table Comment` vypnutá, zafarbí názov tabuľky jantárovou. Modrá farba premenovania má prednosť pred touto jantárovou. Poznámka alebo skupina tabuliek, ktorú jej dokument skrýva, je uvedená v strome, ale na tejto strane sa nevykresľuje.

Pri `70%` a menej si zbalené tabuľky ponechávajú obrys. Názov si ponecháva zelenú alebo červenú farbu pridanej alebo odstránenej tabuľky, prípadne modrú farbu premenovania, a inak preberá jantárovú farbu zmeny komentára. Zmeny stĺpcov sa nevykresľujú, kým zobrazenie znova nepriblížite; strom ich stále uvádza.
