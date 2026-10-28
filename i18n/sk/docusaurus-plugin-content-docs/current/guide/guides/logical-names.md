---
sidebar_position: 4
description: Priradenie logických názvov tabuľkám a stĺpcom, zobrazenie fyzických názvov, logických názvov alebo oboch pomocou Zobrazenia názvov, dopĺňanie názvov termínov počas písania, prepojenie stĺpcov s doménami a prehľad ďalších miest, kde sa názvy riadia zobrazením.
---

# Logické názvy

Tabuľka a každý jej stĺpec môžu mať popri svojom názve aj logický názov. Logický názov je ten, ktorý čítajú ľudia, napríklad `Customer Name` pre `CUST_NM`. Samotný názov je fyzický názov, teda ten, ktorý zapisujú karty [Schéma SQL](./schema-sql.md) a [Generátor kódu](./code-generator.md).  
Zobrazenie názvov určuje, ktorý z týchto dvoch názvov plátno ERD vykresľuje: názvy, logické názvy alebo oba – pozrite si časť [Zobrazenie názvov](#name-view).  
Logický názov môže svojej tabuľke alebo stĺpcu dať aj fyzický názov odvodený zo slov a termínov na karte [Slovník](./dictionary.md) – pozrite si časť [Odvodzovanie fyzických názvov](./dictionary.md#deriving-physical-names).  
Stĺpec môže byť prepojený s doménou, teda s pomenovaným typom údajov, napríklad `Name` pre `VARCHAR(100)`, uloženým v hárku `Domains` na karte Slovník, a potom má typ údajov tejto domény – pozrite si časť [Bunka domény](#the-domain-cell).  
Karta Schéma SQL môže zapísať každý logický názov do prázdneho komentára – pozrite si časť [Logické názvy ako komentáre](./schema-sql.md#logical-names-as-comments).

## Zobrazenie názvov {#name-view}

Existujú tri zobrazenia a každé vykresľuje hlavičku a riadky tabuľky po svojom:

- Zobrazenie `Physical Names`, v ktorom sa otvára nový diagram, nevykresľuje žiadny logický názov. Hlavička zobrazuje názov tabuľky a, kým je zapnutá možnosť View Option → `Table Comment`, aj jej komentár. Každý riadok zobrazuje svoje bunky v [poradí stĺpcov](./settings.md#adjusting-column-order).
- Zobrazenie `Logical Names` vykresľuje logický názov namiesto každého názvu: v hlavičke a v každom riadku na mieste, kde je v poradí stĺpcov položka `Name`. Bunka typu v riadku môže zastupovať doménu stĺpca, ako je opísané nižšie.
- Zobrazenie `Both Names` vykresľuje logický názov vedľa názvu. Hlavička zobrazuje logický názov, za ním názov a potom komentár a každý riadok dostane bunku `Logical Name`, ktorú poradie stĺpcov predvolene umiestňuje tesne pred položku `Name`.

Prázdny logický názov, a to aj taký, ktorý obsahuje iba medzery, zobrazuje stlmený náhradný text. V zobrazení `Logical Names` je to názov vykreslený na jeho mieste, prípadne zástupný text `table` alebo `column`, keď je prázdny aj názov. V zobrazení `Both Names` je to zástupný text `logical`.

V zobrazení `Logical Names` stĺpec prepojený s pomenovanou doménou z hárka `Domains` na karte Slovník zobrazuje v bunke typu namiesto svojho typu údajov názov tejto domény. Každý iný stĺpec tam zobrazuje svoj typ údajov.  
Kým je možnosť View Option → `Domain` zapnutá, doména má vlastnú bunku a bunka typu si ponecháva typ údajov, takže žiadny riadok nezobrazuje doménu dvakrát – pozrite si časť [Bunka domény](#the-domain-cell).

Každá tabuľka je taká široká ako bunky, ktoré v danom zobrazení vykresľuje, takže prepnutie zobrazenia zmení veľkosť tabuliek a nanovo určí vedenie ich spojníc. Žiadna tabuľka sa nepresunie.  
Pri priblížení `70%` a nižšom sa tabuľka zbalí na svoj názov – pozrite si časť [Priblíženie/oddialenie](./table-related-functions.md#zoom-inout). V zobrazení `Logical Names` zobrazuje logický názov, prípadne stlmený názov, kým logický názov chýba. V zobrazení `Both Names` zobrazuje logický názov a pod ním na ďalšom riadku názov, prípadne iba názov, kým logický názov chýba.

Kontroly karty Slovník môžu logický názov alebo názov, ktorý nahlásia, vykresliť červenou alebo jantárovou farbou – pozrite si časť [Označenia na plátne](./dictionary.md#marks-on-the-canvas).

## Prepnutie zobrazenia {#switching-the-view}

Zobrazenie sa dá prepnúť na štyroch miestach a každé z nich ponúka zobrazenia `Physical Names`, `Logical Names` a `Both Names` so začiarknutým aktuálnym zobrazením:

- Tlačidlo `Name View` na [paneli nástrojov plátna](./table-related-functions.md#canvas-toolbar) medzi štyrmi notáciami vzťahov a režimom Zen. Uvádza aktuálne zobrazenie so šípkou nadol a jeho bublinový popis znie `Name View`. Kliknutím sa nad panelom nástrojov otvorí zoznam a výberom zobrazenia sa zoznam zavrie.
- Položka `Name View` v kontextovej ponuke plátna hneď za položkou `View Option`: podponuka s tromi zobrazeniami. Ponuka zostane po výbere otvorená.
- Rovnaký zoznam na paneli nástrojov karty Vizualizácia v režime `Flow` za ponukou zobrazenia riadkov – pozrite si časť [Panel nástrojov](./visualization.md#toolbar).
- Položka `Name View` v [rýchlom vyhľadávaní](./quick-search.md#what-the-palette-lists), uvedená hneď za položkou `Tab` a iba na karte ERD. Jej podponuka sa otvorí so zvýraznením na aktuálnom zobrazení.

![Prepnutie Zobrazenia názvov na Logical Names z panela nástrojov plátna, na Both Names z ponuky plátna a späť na Physical Names, pričom stĺpec ordered_at, ktorý nemá logický názov, je stlmený a potom zobrazený ako zástupný text logical](/img/demo-name-view.webp)

Všetky štyri miesta nastavujú to isté zobrazenie. Horný panel nástrojov preň nemá žiadne tlačidlo.

Prepnutie zachová výber a nezaznamená sa do [histórie zmien](./undo-redo.md#what-the-history-records).  
Ak nové zobrazenie nevykresľuje aktívnu bunku, fokus sa presunie na bunku vykreslenú na jej mieste: názov a logický názov sa navzájom zastupujú, rovnako ako typ a doména. Editor bunky otvorený na tejto bunke sa zavrie. Zapnutie alebo vypnutie možnosti View Option → `Domain` presúva fokus rovnakým spôsobom.  
Kým je zamknutie `Name View` zapnuté, ako je to v novom diagrame, prepnutie zmení iba vašu vlastnú obrazovku a súbor si ponechá zobrazenie, v ktorom bol zamknutý. Pri vypnutom zamknutí súbor uloží zobrazenie, na ktoré prepnete – pozrite si časť [Zamknutie](./settings.md#lock).

## Zápis logického názvu {#writing-a-logical-name}

Zobrazenie `Physical Names` nevykresľuje žiadny logický názov, takže ak ho chcete zapísať na plátne, prepnite na zobrazenie `Logical Names` alebo `Both Names`:

- V zobrazení `Logical Names` obsahujú bunky názvu v hlavičke a v riadkoch logické názvy, takže fyzický názov sa v tomto zobrazení na plátne upraviť nedá.
- V zobrazení `Both Names` obsahujú bunky logického názvu logické názvy a bunky názvu fyzické názvy.

Bunka logického názvu sa upravuje ako každá iná bunka: začnite klávesom `Enter` alebo dvojitým kliknutím – pozrite si stránku [Úprava tabuliek](./table-editing.md). Keď sa editor otvorí na prázdnom logickom názve, ako zástupný text zobrazí to, čo bunka vykresľovala: v zobrazení `Logical Names` názov, v zobrazení `Both Names` text `logical`.  
Písanie zapisuje iba logický názov. Fyzický názov sa z neho odvodí, keď sa editor na zmenenom logickom názve zavrie (`Enter`, `Tab`, `Escape` alebo kliknutie inam), a to ako samostatný krok histórie zmien za vaším písaním. Fyzický názov, ktorý ste zapísali sami, zostane nezmenený – pozrite si časť [Odvodzovanie fyzických názvov](./dictionary.md#deriving-physical-names).

Klávesy `Tab` a `Shift + Tab` prechádzajú bunkami, ktoré zobrazenie vykresľuje, v ich poradí – pozrite si časť [Kláves Tab](./table-editing.md#tab-key):

- V zobrazení `Logical Names` logický názov v hlavičke, potom jej komentár a potom bunky každého riadka v poradí stĺpcov, pričom logický názov je na mieste názvu.
- V zobrazení `Both Names` logický názov, názov a komentár v hlavičke a potom bunky každého riadka v poradí stĺpcov, predvolene s bunkou `Logical Name` na prvom mieste.

Klávesová skratka `Alt + Enter` (Windows/Linux) alebo `⌥ + Enter` (Mac) pridá stĺpec a presunie fokus na prvú bunku, ktorú jeho riadok vykresľuje. V predvolenom poradí stĺpcov je to jeho bunka názvu, ktorou je v zobrazení `Logical Names` jeho logický názov a v zobrazení `Both Names` jeho bunka `Logical Name`, takže môžete začať logickým názvom – pozrite si časť [Pridávanie stĺpcov](./table-editing.md#adding-columns).

Stĺpec cudzieho kľúča, ktorý pridá vzťah, skopíruje spolu s typom aj logický názov a doménu svojho kľúča – pozrite si časť [Identifikujúce vzťahy](./relationship-editing.md#identifying-relationships).  
Kopírovanie stĺpcov do tabuľkového hárka a prilepovanie stĺpcov z neho používajú bunky, ktoré zobrazenie vykresľuje, vrátane buniek logického názvu a buniek domény – pozrite si časť [Kopírovanie/prilepovanie stĺpcov](./table-editing.md#copyingpasting-columns).

## Dopĺňanie názvov termínov {#completing-term-names}

Kým píšete do bunky logického názvu, či už v hlavičke, alebo v riadku, zoznam pod bunkou ponúka termíny, ktorých názvy sa začínajú napísaným textom, bez ohľadu na veľkosť písmen a na medzery pred ním. Termín je celý logický názov uložený v hárku `Terms` na karte Slovník spolu s fyzickým názvom a doménou, ktoré dáva. Zoznam zobrazuje najviac osem termínov zoradených podľa názvu so zvýrazneným napísaným textom. Kým sa takto nezačína žiadny termín, zoznam sa nezobrazí.

![Pridanie stĺpca pomocou ⌥ + Enter v zobrazení Both Names, výber termínu Order Amount zo zoznamu termínov pod jeho logickým názvom, čím sa vyplní ORD_AMT, DECIMAL(10,2) a doména Amount, a potom napísanie Order Date, ktorého názov ORD_DT dajú slová, keď Enter zavrie editor](/img/demo-logical-names.webp)

- Na začiatku nie je zvýraznené nič. Klávesy `↑` a `↓` presúvajú zvýraznenie, ktoré na oboch koncoch pokračuje od opačného konca, a zvýraznený termín zobrazuje kláves `Enter`.
- Kláves `Enter` na zvýraznenom termíne zapíše jeho názov ako logický názov a ukončí úpravu. Ak fyzický názov nie je názov, ktorý ste zapísali sami, ten istý krok histórie zmien z termínu okamžite odvodí fyzický názov a stĺpcu dá aj doménu termínu. Kláves `Enter` bez zvýraznenia ukončí úpravu a ponechá to, čo ste napísali.
- Kliknutie na termín ho zapíše rovnakým spôsobom a editor nechá otvorený.
- Kláves `Escape` pri zobrazenom zozname zavrie iba zoznam a ďalšie stlačenie klávesu `Escape` ukončí úpravu.
- Kláves `Tab` pokračuje ďalej s textom tak, ako bol napísaný, a fyzický názov sa z neho odvodí pri zatvorení editora.
- Kým metóda vstupu skladá znaky, šípky a kláves `Enter` patria skladaniu znakov.

Čo termín dáva tabuľke alebo stĺpcu, opisuje časť [Odvodzovanie fyzických názvov](./dictionary.md#deriving-physical-names).

## Bunka domény {#the-domain-cell}

Možnosť View Option → `Domain`, predvolene vypnutá, pridá každému riadku v každom zobrazení bunku domény na miesto, kde je v poradí stĺpcov položka `Domain`, predvolene hneď za položkou `DataType` – pozrite si časť [Možnosti zobrazenia tabuliek](./table-related-functions.md#table-view-options).  
Bunka zobrazuje názov domény, s ktorou je stĺpec prepojený, prípadne pri stĺpci, ktorý nie je prepojený so žiadnou doménou uvedenou v hárku `Domains`, stlmený zástupný text `domain`.

![Zapnutie View Option → Domain, výber domény Amount v bunke domény stĺpca PAY_AMT po zúžení zoznamu textom amo, zmena hodnoty Data Type domény Amount na DECIMAL(12,2) na karte Slovník, pričom sa spolu s ňou zmení aj stĺpec, a potom napísanie NUMERIC(12,2) do stĺpca, čo ho od domény odpojí](/img/demo-domains.webp)

Kláves `Enter` alebo dvojité kliknutie otvorí nad bunkou výber domény: prázdne pole s textom bunky ako zástupným textom, pod ním položku `None` a potom každú pomenovanú doménu z hárka `Domains` v poradí hárka. Zvýraznenie začína na prepojenej doméne, prípadne na položke `None`.

- Písanie zobrazí iba domény, ktorých názvy obsahujú napísaný text bez ohľadu na veľkosť písmen, vynechá položku `None` a zvýrazní prvú doménu. Klávesy `↑` a `↓` presúvajú zvýraznenie.
- Kláves `Enter` prepojí stĺpec so zvýraznenou doménou a kliknutie s doménou, na ktorú kliknete. Oboje dá stĺpcu typ údajov domény ako jeden krok histórie zmien a ukončí úpravu. Položka `None` odpojí stĺpec od domény a ponechá mu jeho typ údajov.
- To, čo napíšete, sa do stĺpca nikdy nezapíše. Kým hárok `Domains` neobsahuje žiadnu pomenovanú doménu, zoznam sa nezobrazí a kláves `Enter` ukončí úpravu bez zápisu.

V zobrazení `Logical Names` pri vypnutej možnosti View Option → `Domain` otvorí bunka typu, ktorá zobrazuje názov domény, tento výber domény a bunka, ktorá zobrazuje typ údajov, otvorí editor typu údajov – pozrite si časť [Automatické dopĺňanie typu údajov](./table-editing.md#datatype-autocomplete). Ak chcete prepojiť s doménou stĺpec, ktorý žiadnu nemá, zapnite bunku domény.  
Prepojený stĺpec má typ údajov svojej domény a pri zmene typu domény sa mení spolu s ňou, pričom napísanie iného typu do jeho bunky DataType ho od domény odpojí – pozrite si časť [Domény a typy údajov](./dictionary.md#domains-and-data-types).

## Mimo plátna {#beyond-the-canvas}

Väčšina ďalších miest, ktoré uvádzajú názov tabuľky alebo stĺpca, sa tiež riadi Zobrazením názvov:

- Zobrazenie `Physical Names` zobrazuje názov.
- Zobrazenie `Logical Names` zobrazuje logický názov, prípadne názov, ktorý je stlmený tam, kde to dané miesto umožňuje, kým je logický názov prázdny.
- Zobrazenie `Both Names` zobrazuje logický názov a za ním názov: tlmený v riadku textu, na druhom riadku v popise v režime Graph a v zátvorkách tam, kde jeden text musí obsahovať oba, napríklad `Member (member)`. Tabuľka alebo stĺpec bez logického názvu zobrazuje iba svoj názov.

Zoznam zoradený podľa názvu, napríklad tabuľky v prieskumníkovi alebo riadky `#` v rýchlom vyhľadávaní, zostáva v každom zobrazení zoradený podľa názvu, nikdy nie podľa logického názvu.

Miesta, ktoré sa riadia zobrazením:

- Na karte Vizualizácia kartičky režimu Flow – pozrite si časť [Názvy na kartičkách](./visualization.md#names-on-the-cards) – a popisy a ukážka pri podržaní ukazovateľa v režime Graph – pozrite si časti [Čítanie grafu](./visualization.md#reading-the-graph) a [Ukážka pri podržaní ukazovateľa](./visualization.md#hover-preview).
- [Vlastnosti tabuľky](./table-related-functions.md#table-properties): ich štítky a na karte `Indexes` riadky `Columns` a zoznam `Index order` – pozrite si časť [Indexy](./table-related-functions.md#indexes).
- Riadky tabuliek a stĺpcov v [prieskumníkovi](./explorer.md#the-tree) a tabuľky uvedené pod každou skupinou tabuliek.
- Riadky `#` v rýchlom vyhľadávaní – pozrite si časť [Vyhľadávanie v diagrame](./quick-search.md#searching-the-diagram).
- Strom zmien a obe strany [prehliadača rozdielov](./table-related-functions.md#diff-viewer).
- Dialógové okno [Mapovať stĺpce](./relationship-editing.md#map-columns) a bublinový popis `<parent> has no primary key to copy`, ktorý môže položka `Create new columns` zobraziť pri kreslení vzťahu – pozrite si časť [Vytvorenie vzťahu](./editing-start.md#relationship-creation).
- Kópia riadkov, ktorú presúvanie stĺpca prenáša nad prázdnym plátnom a ktorá zobrazuje bunky názvu a typu každého riadka tak, ako ich riadok vykresľuje – pozrite si časť [Zmena poradia a presúvanie stĺpcov](./table-editing.md#rearranging-and-moving-columns).
- Stĺpec `Target` v hárku `Checks` na karte Slovník – pozrite si časť [Hárok Kontroly](./dictionary.md#the-checks-sheet).
- [Exportovaný obrázok](./file-import-export.md#image).

Niekoľko miest ponecháva názvy bez ohľadu na zobrazenie: riadky indexov a cudzích kľúčov v prieskumníkovi, časť `Keys` na karte `Indexes` vo Vlastnostiach tabuľky, položka `New column: <name>` v dialógovom okne Mapovať stĺpce a umiestnenie uvedené vedľa riadka `@` alebo `:` v rýchlom vyhľadávaní.

Prehliadač rozdielov, [cestovanie v čase](./undo-redo.md#time-travel), ukážka `Force` [automatického rozloženia](./table-related-functions.md#auto-layout) a dialógové okno `Export image` sa otvoria v Zobrazení názvov, ktoré práve máte, bez ohľadu na to, aké zobrazenie uchováva súbor. Každé z nich si toto zobrazenie ponechá, kým je otvorené.  
Každé automatické rozloženie, ako aj `Import` alebo `Import and Add` súboru Schéma SQL, GraphQL, DBML alebo AML umiestni tabuľky so šírkami, ktoré majú vo vašom zobrazení.

## Hľadanie podľa logického názvu {#finding-by-logical-name}

Logické názvy sa dajú nájsť v každom Zobrazení názvov vrátane zobrazenia `Physical Names`, v ktorom ich plátno nevykresľuje vôbec:

- [Hľadanie a nahrádzanie](./find-and-replace.md#what-it-searches) ich prehľadáva ako jeden druh textu, `Logical names`, pri tabuľkách aj stĺpcoch a tento druh textu je zapnutý pri prvom otvorení hľadania. Nahradenie logického názvu z neho odvodí fyzický názov rovnako ako jeho zápis.
- V [rýchlom vyhľadávaní](./quick-search.md#searching-the-diagram) nájde `#` tabuľku podľa jej názvu alebo logického názvu a `@` nájde stĺpec podľa ktoréhokoľvek z nich, pričom zhoda v logickom názve sa zobrazí so štítkom `Logical name`. Časť `@` pre tabuľku pred znakom `.` sa tiež porovnáva s názvom alebo logickým názvom tabuľky.

Prepnutie Zobrazenia názvov mení, ako sú výsledky pomenované, nikdy nie to, čo sa nájde.

## Spolupracovníci {#collaborators}

V [relácii spoločných úprav](../../api/advanced/collaborative-editing.md) sa logické názvy a prepojenia s doménami dostanú do každého editora ako každá iná úprava.  
Kým je zamknutie `Name View` zapnuté, každý editor si ponecháva vlastné zobrazenie a prepnutie sa prejaví iba v editore, v ktorom sa vykonalo. Kým je vypnuté, prepnutie v ktoromkoľvek editore, ktorý nie je iba na čítanie, prepne všetky editory – pozrite si časť [Zamknutie](./settings.md#lock), ktorá opisuje aj to, čo zapnutie alebo vypnutie zamknutia urobí so zobrazením každého editora.  
Keď je aktívna bunka účastníka bunkou, ktorú vaše zobrazenie nevykresľuje, jeho farba sa zobrazí na bunke, ktorú vaše zobrazenie vykresľuje na jej mieste: bunka názvu v zobrazení `Physical Names` sa zobrazí na vašej bunke logického názvu v zobrazení `Logical Names` a naopak a rovnako si zodpovedajú aj bunka typu a doména, ktorá ju zastupuje.

Programovací agent, ktorý pracuje cez server MCP, nastavuje logické názvy a prepája stĺpce s doménami bez ohľadu na to, aké zobrazenie práve máte, a nemá žiadny nástroj, ktorý by prepínal Zobrazenie názvov – pozrite si časti [Slovníky](../../mcp/tools.md#dictionaries) a [Nastavenia](../../mcp/tools.md#settings).

## Editory iba na čítanie {#read-only-editors}

V editore s atribútom [`readonly`](../../api/erd-editor-element.md#readonly) funguje každý výber Zobrazenia názvov: tlačidlo `Name View` na paneli nástrojov plátna, položka `Name View` v kontextovej ponuke plátna aj v rýchlom vyhľadávaní a zoznam na paneli nástrojov režimu Flow.  
Prepnutie tam zmení iba danú obrazovku bez ohľadu na zamknutie: súbor, spolupracovníci a história vrátenia späť si ponechajú zobrazenie, aké bolo. Keď sa editor znova prepne na úpravy, vybrané zobrazenie zostane na tejto obrazovke až do ďalšieho prepnutia tam alebo, kým je zamknutie vypnuté, kým ho nezmení spolupracovník alebo kým sa dokument znova nenačíta.  
Logické názvy a domény sa tam nedajú upravovať, takže sa neotvorí žiadny editor bunky, zoznam termínov ani výber domény a neponúka sa ani jedna z položiek `Derive Physical Name Again` a `Derive Physical Names Again`.  
Možnosť View Option → `Domain` tam zobrazí alebo skryje bunku domény iba na tejto obrazovke, rovnako ako každá [možnosť zobrazenia](./table-related-functions.md#table-view-options), a prepnutie editora späť na úpravy vráti možnosti zobrazenia, ktoré uchováva dokument.
