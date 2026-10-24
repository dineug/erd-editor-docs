---
sidebar_position: 15
description: Vrátenie späť a opätovné vykonanie úprav, čo zaznamenáva história, vlastné histórie hárkov karty Slovník a prechádzanie históriou diagramu pomocou cestovania v čase.
---

# Vrátiť späť, znova vykonať

Môžete sa vrátiť do predchádzajúceho stavu úprav alebo prejsť dopredu do neskoršieho.  
História uchováva až `2048` zmien.

- Vrátiť späť: `Ctrl + Z` (Windows/Linux) alebo `⌘ + Z` (Mac)
- Znova vykonať: `Ctrl + Shift + Z` (Windows/Linux) alebo `⌘ + Shift + Z` (Mac)

Na karte ERD ponúka panel nástrojov tie isté dva príkazy ako tlačidlá `Undo` a `Redo` vedľa tlačidla `Time Travel`. Na karte Slovník zobrazuje tlačidlá `Undo` a `Redo` bez tlačidla `Time Travel` a žiadna iná karta ich nezobrazuje.  
Zvýraznia sa, iba keď je čo vrátiť späť alebo znova vykonať. Editor s atribútom `readonly` ich skryje a klávesové skratky nič nevrátia späť ani znova nevykonajú.

Príkazy Vrátiť späť a Znova vykonať pôsobia na históriu diagramu iba na karte ERD.  
Klávesové skratky sú tam neaktívne vtedy, keď je otvorené rýchle vyhľadávanie, `Table Properties`, `Diff Viewer`, ukážka `Auto Layout`, dialógové okno [`Export image`](./file-import-export.md#image), dialógové okno [Mapovať stĺpce](./relationship-editing.md#map-columns) alebo cestovanie v čase.  
Fungujú ďalej, kým je fokus klávesnice kdekoľvek v [prieskumníkovi](./explorer.md#keys-in-the-explorer) vrátane jeho stromu a kým je otvorený [výber farby](./table-related-functions.md#table-and-memo-color-specification). Aj keď je textový kurzor v niektorom z ich polí, napríklad v poli hľadania, v poli nahradenia alebo v poli `Hex`, vracajú späť a znova vykonávajú úpravy diagramu, a nie textu v poli.

Na ostatných kartách:

- Slovník: vracajú späť a znova vykonávajú úpravy zobrazeného hárka, `Domains`, `Words` alebo `Terms`, z vlastnej histórie tohto hárka, nikdy nie z histórie diagramu. V hárku `Checks` nemajú žiadny účinok – pozrite si časť [Hárky karty Slovník](#dictionary-sheets).
- Vizualizácia: v režime `Flow` prechádzajú tie isté klávesy o krok späť a dopredu cez to, čo režim Flow zobrazil, rovnako ako tlačidlá `Previous table` a `Next table`, a to aj v editore s atribútom `readonly`. Úpravy diagramu tam nikdy nevracajú späť ani znova nevykonávajú – pozrite si časť [Predchádzajúca a nasledujúca tabuľka](./visualization.md#previous-table-and-next-table). V režime `Graph` nemajú žiadny účinok.
- Schéma SQL, Generátor kódu a Nastavenia: nie sú k dispozícii. V poliach `Before tables` a `After tables` na karte Schéma SQL tie isté klávesy namiesto toho vracajú späť a znova vykonávajú písanie v danom poli.

História sa uchováva v pamäti počas aktuálnej relácie. Neukladá sa do dokumentu, takže znova otvorený diagram začína s prázdnou históriou.

![Presun tabuľky a odstránenie stĺpca pomocou ⌥ + Backspace, potom vrátenie oboch úprav späť pomocou ⌘ + Z a ich opätovné vykonanie pomocou ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Čo zaznamenáva história {#what-the-history-records}

Zaznamenáva sa:

- Tabuľky a poznámky: pridanie, odstránenie, presun a farba; názov, logický názov a komentár tabuľky; text a veľkosť poznámky.
- Skupiny tabuliek: pridanie, odstránenie, presun, zmena veľkosti, názov, farba a to, do ktorej skupiny patrí každá tabuľka – pozrite si stránku [Skupiny tabuliek](./table-groups.md).
- Stĺpce: pridanie, odstránenie, zmena poradia, logický názov, doména, s ktorou je stĺpec prepojený, a každá možnosť stĺpca.
- Fyzické názvy, ktoré odvodia slovníky, a to, či je každý názov vlastný, alebo patrí slovníkom: jedno vrátenie späť obnoví názov aj tento stav spoločne – pozrite si časť [Vlastné názvy](./dictionary.md#names-of-your-own).
- Príkazy `Derive Physical Name Again` a `Derive Physical Names Again` – pozrite si časť [Znova odvodiť fyzické názvy](./dictionary.md#derive-physical-names-again).
- Vzťahy: pridanie, odstránenie, zmena typu, stĺpce nastavené v dialógovom okne [Mapovať stĺpce](./relationship-editing.md#map-columns) a každá voľba z položky `On Delete` alebo `On Update` – pozrite si časť [ON DELETE a ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Vrátenie odstránenia späť obnoví vzťah aj s jeho akciami ON DELETE a ON UPDATE.
- Indexy a ich stĺpce.
- Poloha zobrazenia, úroveň priblíženia a prepínače `View Option`.
- Skripty `Before tables` a `After tables` na karte Schéma SQL, jeden krok za každú úpravu, ktorú použijete opustením poľa – pozrite si časť [Skripty pred tabuľkami a za nimi](./schema-sql.md#before-and-after-scripts).
- Import súboru a pridanie súboru pomocou položky [`Import and Add`](./file-import-export.md#import-and-add).

Nezaznamenáva sa:

- Databázový systém a názov databázy.
- Jazyk na karte Generátor kódu, `Table Name Case` a `Column Name Case`.
- Typ úvodzoviek, či už je nastavený na karte Schéma SQL, alebo na karte Generátor kódu.
- Voľby `Statements`, `Header`, `Write logical names into empty comments` a `Tables` na karte Schéma SQL, ktoré patria k oknu editora – pozrite si časť [Panel možností](./schema-sql.md#options-panel).
- Všetko na karte Nastavenia vrátane riadkov [`Lock`](./settings.md#lock).
- Prepnutie Zobrazenia názvov z ktoréhokoľvek miesta, ktoré ho ponúka, či už je jeho zamknutie zapnuté, alebo vypnuté – pozrite si časť [Prepnutie zobrazenia](./logical-names.md#switching-the-view).
- Motív a jazyk zobrazenia – pozrite si stránku [Jazyk a motív](./language-and-theme.md).
- To, ktorá tabuľka, poznámka alebo skupina sa vykresľuje pred ostatnými.
- [Prieskumník](./explorer.md): jeho otvorenie, zatvorenie alebo zmena veľkosti, zbalenie jeho stromu a hľadaný text a možnosti hľadania. To, čo zmenia `Replace` a `Replace All`, sa však zaznamenáva, a rovnako aj posunutie, ktoré vykoná prechod – pozrite si časť [Jedno gesto, jeden krok](#one-gesture-one-step).
- Zmena priblíženia a posúvanie zobrazenia na karte Vizualizácia v ktoromkoľvek režime, presúvanie uzlov grafu alebo kartičiek režimu Flow, tlačidlo `Tidy Up`, zobrazenie riadkov, zameranie na tabuľky a prechádzanie pomocou tlačidiel `Previous table` a `Next table` – pozrite si časť [Režim Flow nikdy neupravuje dokument](./visualization.md#flow-never-edits-the-document).
- Zobrazený hárok karty Slovník a vyhľadávanie, výber, posunutie a šírky stĺpcov každého hárka – pozrite si časť [Otvorenie karty](./dictionary.md#opening-the-tab).

Zmenu čohokoľvek z toho nemožno vrátiť späť.

Úpravy vykonané na karte Slovník sa dajú vrátiť späť, ale patria do histórie svojho hárka, a nie do tejto histórie, takže príkaz Vrátiť späť na karte ERD žiadnu z nich nevráti, a to ani novú hodnotu `Data Type` domény a typy stĺpcov, ktoré zmení – pozrite si časť [Hárky karty Slovník](#dictionary-sheets).

Nezaznamenávajú sa ani zmeny, ktoré prichádzajú z iného editora, takže príkaz Vrátiť späť vracia iba vaše vlastné zmeny. V [relácii spoločných úprav](../../api/advanced/collaborative-editing.md) vracia každý editor späť svoje vlastné zmeny a programovací agent, ktorý upravuje cez [server MCP](../../mcp/live-and-headless.md#undo), vracia späť svoje pomocou nástroja `erd_undo`.

Keď vrátite späť import cez položku `Import`, ktorý nahrádza celý diagram, obnoví sa predchádzajúci diagram v stave, v akom ho editor mal v čase importu, pričom každé [zamknutie](./settings.md#lock) je zapnuté alebo vypnuté a každá zamknutá hodnota nastavená tak, ako to bolo vtedy.  
Ak mal tento diagram zamknuté nastavenie `Viewport`, zobrazenie a priblíženie sa vrátia na zamknuté zobrazenie, kde sa diagram otvára, a nie tam, kde ste boli. Pri odomknutom nastavení `Viewport` sa vrátia tam, kde ste boli v čase importu. Ostatné zamknuté nastavenia, napríklad karta, na ktorej sa nachádzate, jazyk na karte Generátor kódu alebo Zobrazenie názvov, zostanú tak, ako ich máte na obrazovke.  
Nový diagram začína so všetkými zamknutiami zapnutými. Ak si chcete pri takomto vrátení späť zachovať svoje zobrazenie, pred importom odomknite nastavenie `Viewport`. Jeho neskoršie odomknutie ani import súboru JSON, ktorého vlastné zamknutie `Viewport` je vypnuté, nezmení, kam vás vrátenie späť presunie.

Vrátenie importu súboru JSON späť obnoví aj slová, termíny a domény, ktoré mal predchádzajúci diagram. Import súboru Schéma SQL, GraphQL, DBML alebo AML slovníky zachová, takže jeho vrátenie späť a opätovné vykonanie ich ponechá v aktuálnom stave vrátane úprav, ktoré sa odvtedy vykonali na karte Slovník.

Vrátenie späť alebo opätovné vykonanie na karte ERD, ktoré stĺpec znova prepojí s doménou alebo obnoví stĺpec, ktorý je s doménou prepojený, dá stĺpcu aktuálny typ údajov domény. Ak prepojenému stĺpcu vráti iný typ, odpojí ho od domény – pozrite si časť [Domény a typy údajov](./dictionary.md#domains-and-data-types).

## Jedno gesto, jeden krok {#one-gesture-one-step}

Všetko, čo vyvolá jedno gesto, tvorí jeden záznam histórie.  
Prilepenie viacerých tabuliek a poznámok naraz alebo ich duplikovanie pomocou `Alt + drag` sa vráti späť jedným krokom.

Stlačenie klávesu `Delete` alebo `Backspace`, prípadne položka `Delete selected` alebo `Delete columns` v kontextovej ponuke, je jeden krok bez ohľadu na to, koľko tabuliek, poznámok, skupín tabuliek alebo stĺpcov odstráni.  
Prepnutie primárneho kľúča na viacerých vybratých stĺpcoch je jeden krok, či už pomocou `Alt + K` (Windows/Linux) alebo `⌥ + K` (Mac), alebo pomocou položky `Primary Key on selected columns` v kontextovej ponuke tabuľky.  
Nastavenie farby výberu alebo jej odstránenie pomocou `No color` alebo `Remove color` je jeden krok bez ohľadu na to, koľko tabuliek, poznámok a skupín je vybratých. Zvolenie farby, ktorú už má všetko vybraté, nezaznamená žiadny krok a nezaznamená ho ani `No color`, keď nič z vybratého nemá farbu.  
Stlačenie tlačidla `Map` alebo `Save` v dialógovom okne [Mapovať stĺpce](./relationship-editing.md#map-columns) je jeden krok spolu so stĺpcami cudzieho kľúča, ktoré pridá, a typmi údajov, ktoré zmení.  
Položka `Import and Add` je jeden krok spolu s posunutím zobrazenia na pridaný blok, ak je potrebné.

Výber termínu zo zoznamu pod bunkou logického názvu je jeden krok: logický názov, fyzický názov, ktorý sa z neho odvodí, a pri stĺpci aj doména termínu s jej typom údajov – pozrite si časť [Dopĺňanie názvov termínov](./logical-names.md#completing-term-names).  
Výber domény v bunke domény stĺpca je jeden krok spolu s typom údajov, ktorý doména dá stĺpcu, a s tým, čo [synchronizácia typu údajov vo vzťahoch](./settings.md#relationship-datatype-sync) prenesie po vzťahoch. Jedným krokom je aj výber položky `None`, ktorá stĺpec od domény odpojí – pozrite si časť [Bunka domény](./logical-names.md#the-domain-cell). Zadanie iného typu údajov, než má doména, do prepojeného stĺpca odpojí stĺpec od domény v kroku tohto vstupu.  
Príkaz `Derive Physical Name Again` alebo `Derive Physical Names Again` je jeden krok bez ohľadu na to, koľko názvov, prepojení s doménou a typov údajov zmení. Žiadny krok nezaznamená iba vtedy, keď nič nezmení. Vrátenie vlastného názvu slovníkom je zmena, aj keď názov už obsahuje to, čo dávajú slovníky.

Vytvorenie [skupiny tabuliek](./table-groups.md), či už jej nakreslením, alebo zoskupením vybratých tabuliek pomocou položky `Group selected tables` alebo `T` a potom `G`, je jeden krok spolu so všetkými tabuľkami, ktoré zahrnie. Odstránenie skupiny je jeden krok a jeho vrátenie späť obnoví skupinu aj s tabuľkami v nej.  
Presunutie skupiny myšou za jej záhlavie presunie skupinu a všetky jej tabuľky jedným krokom. Tabuľky pustené do skupiny alebo mimo nej zmenia skupinu v tom istom kroku ako ich presun, keď uvoľníte tlačidlo približne do `200ms` od posledného pohybu, takže jedno vrátenie späť ich umiestni späť tam, kde boli, a do skupín, v ktorých boli. Po dlhšej pauze pred uvoľnením tlačidla je zmena skupiny samostatným krokom a prvé vrátenie späť zruší iba túto zmenu.  
Zmena veľkosti skupiny ťahaním za okraj alebo roh sa zaznamená raz, keď uvoľníte tlačidlo.  
Použitie [automatického rozloženia](./table-related-functions.md#auto-layout) je jeden krok vrátane skupín, ktoré prispôsobí ich tabuľkám.

Aj príkaz `Replace All` v [hľadaní a nahrádzaní](./find-and-replace.md#replacing) je jeden krok bez ohľadu na to, koľko názvov tabuliek, názvov stĺpcov, logických názvov, názvov indexov, názvov skupín tabuliek, komentárov a poznámok zmení, vrátane fyzických názvov a prepojení s doménou, ktoré sa z logických názvov odvodia. Keď nič nezmení, napríklad keď `Preserve Case` zapíše každú zhodu späť tak, ako bola, nezaznamená žiadny krok.  
Jedno použitie príkazu `Replace` je jeden krok vrátane toho, čo sa odvodí z logického názvu, a posunutia na ďalšiu zhodu, keď ho táto zhoda vyžaduje. Keď zapíše svoju zhodu späť tak, ako bola, zaznamená iba toto posunutie, alebo nič, keď k nemu nedôjde.  
Prechod na zhodu posunie plátno, iba keď zhoda ešte nie je dobre viditeľná – pozrite si časť [Kam vedie skok](./table-related-functions.md#where-a-jump-lands). Toto posunutie sa zaznamená ako každá iná zmena polohy zobrazenia, takže po prechádzaní zhodami príkaz Vrátiť späť najprv vráti späť tieto posunutia, po jednom v každom kroku.  
Ostatné prechody, ktoré vedú na plátno, zaznamenávajú svoje posunutia rovnako: zvolenie riadka v prieskumníkovi, výsledku rýchleho vyhľadávania, kontroly v hárku `Checks` na karte Slovník, ktorá uvádza tabuľku alebo stĺpec, alebo [tlačidla na kartičke](./visualization.md#card-buttons) pre externý odkaz v režime Flow. Prechod, ktorý ponechá zobrazenie na mieste, nezaznamená nič. Nič nezaznamená ani zvolenie riadka v zozname okna `Diff Viewer`, pretože posúva iba vlastné strany prehliadača rozdielov, ktoré sú iba na čítanie.

Súvislé ťahanie, posúvanie plátna, zmena priblíženia, stiahnutie prstov alebo zmena farby sa približne `200ms` zhromažďuje a tiež sa zapíše ako jeden záznam.  
Presunutie myšou s celkovým posunom menším ako `20px` nezaznamená žiadny presun. Zaznamená sa iba zmena skupiny, ktorú prípadne spôsobí.

Písanie do bunky alebo poznámky sa zaznamenáva po jednotlivých vstupoch, a nie po gestách: každý napísaný znak, každé prilepenie a každý krok skladania znakov cez IME je samostatný krok.  
Rovnako sa zaznamenáva bunka logického názvu. Keď sa jej editor zatvorí s iným logickým názvom, než s akým sa otvoril, fyzický názov, ktorý z neho odvodia slovníky, je po písaní ďalší krok. Prvé vrátenie späť vráti iba tento názov spolu s doménou a typom údajov, ktoré priniesol termín, a ponechá logický názov, ktorý ste napísali. Keď sa nič neodvodí, nič ďalšie sa nezaznamená – pozrite si časť [Zápis logického názvu](./logical-names.md#writing-a-logical-name).  
Názov skupiny tabuliek sa zaznamená raz, keď ho uloží kláves `Enter` alebo opustenie poľa, takže názov, ktorý zadáte do práve vytvorenej skupiny, je krok oddelený od jej vytvorenia. Kláves `Esc` ani nezmenený názov nezaznamenajú nič.

## Hárky karty Slovník {#dictionary-sheets}

Hárky `Domains`, `Words` a `Terms` na karte Slovník majú každý vlastnú históriu, oddelenú od histórie diagramu. Každá úprava vykonaná na karte patrí do histórie hárka, ktorého riadky zapisuje. Rovnako ako história diagramu uchováva každá z týchto histórií až `2048` krokov a je uložená v pamäti počas relácie.

- Keď je fokus klávesnice na karte, `Ctrl + Z` (Windows/Linux) alebo `⌘ + Z` (Mac) vráti späť poslednú úpravu zobrazeného hárka a `Ctrl + Shift + Z` (Windows/Linux) alebo `⌘ + Shift + Z` (Mac) znova vykoná poslednú úpravu vrátenú späť.
- Tlačidlá `Undo` a `Redo` na paneli nástrojov robia to isté a zvýraznia sa, iba keď má zobrazený hárok úpravu, ktorú možno vrátiť späť alebo znova vykonať. Ich stlačenie ponechá fokus klávesnice tam, kde bol, v mriežke alebo v poli vyhľadávania. Karta nemá tlačidlo `Time Travel`.
- V hárku `Checks`, kde sa nič neupravuje, zostanú tlačidlá nezvýraznené a ani ony, ani klávesy nemajú žiadny účinok.
- Keď je otvorená úprava bunky alebo je textový kurzor v poli vyhľadávania na karte, klávesy namiesto toho vracajú späť a znova vykonávajú písanie na tomto mieste.

Histórie sa nikdy nemiešajú. Príkaz Vrátiť späť na karte ERD nikdy nevráti úpravu hárka a príkaz Vrátiť späť v hárku nikdy nevráti úpravu iného hárka ani diagramu. Každý hárok si svoju históriu zachová aj pri prepínaní hárkov alebo kariet.

Každá z týchto akcií je jeden krok svojho hárka:

- Úprava bunky, ktorá sa zaznamená raz, keď sa zapíše, a nie po jednotlivých napísaných znakoch, a iba vtedy, keď zmení hodnotu – pozrite si časť [Úprava buniek](./dictionary.md#editing-cells).
- Prilepenie vrátane riadkov, ktoré pridá, a vymazanie vybratých buniek klávesom `Delete` alebo `Backspace` – pozrite si časť [Kopírovanie a prilepovanie](./dictionary.md#copying-and-pasting).
- Tlačidlo `Add Row` a každé vloženie alebo odstránenie riadkov z lišty, z ponuky mriežky alebo klávesmi bez ohľadu na to, koľko riadkov zahŕňa – pozrite si časť [Pridávanie a odstraňovanie riadkov](./dictionary.md#adding-and-deleting-rows).
- Doména termínu vybratá z jeho zoznamu vrátane položky `None` – pozrite si časť [Doména termínu](./dictionary.md#a-terms-domain).
- Zoradenie – pozrite si časť [Zoraďovanie](./dictionary.md#sorting).
- Jeden súbor CSV importovaný tlačidlom `Import CSV` bez ohľadu na to, koľko riadkov pridá alebo aktualizuje. Je to krok hárka, ktorý súbor naplní a ktorý potom karta zobrazí, bez ohľadu na to, z ktorého hárka ste ho importovali – pozrite si časť [Import](./dictionary.md#importing).

Zápis, ktorý nič nezmení, napríklad opätovný import toho istého súboru alebo zoradenie hárka, ktorý už v tomto poradí je, nezaznamená žiadny krok a nezaznamená ho ani zápis odmietnutý oznámením `Nothing saved: …`. Keď termín bez hodnoty `Physical Name` dostane názov, fyzický názov, ktorý sa zloží z jeho slov, je súčasťou kroku tejto úpravy.

Nová hodnota `Data Type` domény je jeden krok hárka `Domains` spolu s typmi, ktoré dá stĺpcom prepojeným s doménou a stĺpcom, ku ktorým sa od nich dostane synchronizácia typu údajov vo vzťahoch – pozrite si časť [Domény a typy údajov](./dictionary.md#domains-and-data-types).  
Vrátenie tohto kroku späť alebo jeho opätovné vykonanie zmení typ stĺpcov, ktoré sú s doménou prepojené v tom okamihu, takže stĺpec, ktorý ste odvtedy prepojili s inou doménou alebo ktorému ste zmenili typ, si svoj typ ponechá. Stĺpec, ktorý krok odpojil, napríklad cudzí kľúč, ktorý synchronizácia odpojila od jeho vlastnej domény, sa znova prepojí, iba ak je stále odpojený a stále má typ, ktorý mu krok ponechal.

Editor s atribútom `readonly` tlačidlá skryje a klávesy nič nevrátia späť ani znova nevykonajú.  
Zmeny od spolupracovníkov a programovacích agentov sa do histórie hárka tiež nezaznamenávajú.

História každého hárka sa vyprázdni, keď sa slovníky nahradia: importom súboru JSON cez položku `Import`, či už vaším, alebo spolupracovníkovým, jeho vrátením späť alebo opätovným vykonaním a načítaním iného diagramu do editora. Import súboru Schéma SQL, GraphQL, DBML alebo AML cez položku `Import` slovníky zachová a s nimi aj históriu každého hárka, a to aj pri svojom vrátení späť a opätovnom vykonaní.

## Cestovanie v čase {#time-travel}

Otvára sa tlačidlom `Time Travel` na paneli nástrojov vedľa tlačidiel Vrátiť späť a Znova vykonať na karte ERD.  
Tlačidlo nemá žiadny účinok, kým história diagramu neobsahuje aspoň jednu zaznamenanú zmenu.

Cestovanie v čase otvorí samostatnú kópiu diagramu iba na čítanie s polohou zobrazenia, úrovňou priblíženia a [Zobrazením názvov](./logical-names.md#name-view), ktoré plátno práve ukazuje, bez ohľadu na to, či je zamknutie `Viewport` alebo `Name View` zapnuté.  
Prechádza iba históriou diagramu, takže úpravy hárkov karty Slovník nie sú medzi jeho bodmi.  
Ťahajte posúvač alebo kliknite kamkoľvek na jeho dráhu, ak sa chcete pohybovať celou históriou úprav a zobraziť ukážku každého bodu. Krajná ľavá poloha posúvača zodpovedá stavu jeden krok pred prvou zaznamenanou zmenou a pri otvorení je jazdec na aktuálnom stave.  
Ukážka je neaktívna: vykresľuje minimapu, ale nemôžete ju posúvať ťahaním ani rolovaním, ani ju upravovať, a skutočný dokument zostane nedotknutý, kým vybratý bod nepoužijete.

Stlačte tlačidlo `Apply`, ak chcete obnoviť vybratý bod, alebo tlačidlo `Cancel` či kláves `Esc`, ak chcete ponechať dokument bez zmeny.

![Otvorenie cestovania v čase, ťahanie posúvača späť v rámci relácie a použitie skoršieho bodu](/img/demo-time-travel.webp)
