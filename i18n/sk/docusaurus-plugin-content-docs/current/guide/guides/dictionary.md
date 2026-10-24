---
sidebar_position: 14
description: Uchovávanie domén, slov a termínov diagramu na karte Slovník, odvodzovanie fyzických názvov z logických názvov, určovanie typu údajov stĺpcov doménou, čítanie zistení hárka Kontroly, úprava a zoraďovanie hárkov ako v tabuľkovom procesore a ich import a export ako súborov CSV.
---

# Slovník

Karta Slovník uchováva štandard pomenovania diagramu v troch slovníkoch, každý v hárku, ktorý upravujete rovnako ako tabuľkový hárok:

- `Domains`: pomenované typy údajov, napríklad `Name` pre `VARCHAR(100)`. Stĺpec prepojený s doménou má jej typ údajov.
- `Words`: štandardné slová, z ktorých sa skladajú logické názvy, každé so skratkou, ktorú preň používa fyzický názov, napríklad `Customer` a `CUST`.
- `Terms`: celé logické názvy, každý s fyzickým názvom a doménou, ktoré dáva, napríklad `Customer Name` s `CUST_NM`.

Z [logického názvu](./logical-names.md) tabuľky alebo stĺpca sa pomocou týchto slovníkov odvodí fyzický názov a termín stĺpca môže stĺpec aj prepojiť s doménou – pozrite si časť [Odvodzovanie fyzických názvov](#deriving-physical-names).  
Štvrtý hárok `Checks` uvádza, čo slovníky považujú za chybné v názvoch a typoch diagramu aj v samotných slovníkoch, napríklad zakázané slovo v logickom názve – pozrite si časť [Hárok Kontroly](#the-checks-sheet).

## Otvorenie karty {#opening-the-tab}

Na paneli nástrojov prepnite na kartu `Dictionary`, ktorej tlačidlo s ikonou knihy je medzi tlačidlami `Code Generator` a `Settings`, alebo vyberte položku `Dictionary` v [rýchlom vyhľadávaní](./quick-search.md) cez položku `Tab`.  
Môže to byť karta, na ktorej sa diagram otvára – pozrite si nastavenie `Canvas Type` v časti [Zamknutie](./settings.md#lock).

Karta pri otvorení zobrazuje hárok `Domains`, kým nevyberiete iný.  
Pri každom otvorení sa hárok vráti s výberom a posunutím, ktoré ste v ňom nechali, alebo pri prvej návšteve s vybratou prvou bunkou. Jeho mriežka prevezme fokus klávesnice, takže písanie alebo klávesy so šípkami fungujú okamžite.

Zobrazený hárok a hľadaný text, výber, posunutie a šírky stĺpcov každého hárka patria iba vám.  
Nič z toho sa neukladá do súboru, nezaznamenáva do histórie zmien ani nezdieľa so spolupracovníkmi. Zachováva sa, kým je editor otvorený, pri prepínaní kariet aj naprieč dokumentmi načítanými do toho istého editora.

## Hárky {#the-sheets}

Lišta v hornej časti obsahuje štyri tlačidlá hárkov, `Domains`, `Words`, `Terms` a `Checks`, a tlačidlo zobrazeného hárka vyzerá stlačené. Každé zobrazuje vedľa svojho názvu číslo: počet riadkov jeho hárka bez ohľadu na to, čo zobrazuje hľadanie, alebo pri tlačidle `Checks` počet kontrol zafarbený podľa ich úrovne – pozrite si časť [Hárok Kontroly](#the-checks-sheet).  
Za nimi nasleduje pole hľadania – pozrite si časť [Vyhľadávanie](#searching). Na konci lišty sú v hárkoch `Domains`, `Words` a `Terms`, nie však v editore iba na čítanie, štyri nástroje: `Add Row`, `Delete Rows`, `Import CSV` a `Export CSV` – pozrite si časti [Pridávanie a odstraňovanie riadkov](#adding-and-deleting-rows) a [Import a export CSV](#importing-and-exporting-csv).  
V úzkom paneli alebo v jazyku zobrazenia s dlhými textami sa lišta zalomí do viacerých riadkov, takže každé tlačidlo zostane dostupné.

Pod mriežkou stavový riadok uvádza počet riadkov, ktoré hľadanie ponechá, napríklad `4 rows`, a kým výber zahŕňa nejaký riadok, aj to, koľko ich zahŕňa, napríklad `1 selected`. Riadok, ktorý zdieľajú dva rozsahy, sa započíta raz, takže toto číslo udáva, koľko riadkov by odstránilo tlačidlo `Delete Rows`.  
Čísla riadkov pozdĺž ľavého okraja číslujú riadky tak, ako ich hárok zobrazuje, od 1. Bunka iba na čítanie, čo je každá bunka v hárku `Checks` a každá bunka v editore iba na čítanie, sa vykresľuje na sivom pozadí okrem miest, kde ju označí kontrola.  
Prázdny hárok `Domains`, `Words` alebo `Terms` zobrazuje text `Import a CSV file or add a row`, okrem editora iba na čítanie.

Stĺpce jednotlivých hárkov v poradí:

| Hárok | Stĺpce |
| --- | --- |
| `Domains` | `Domain`, `Category`, `Data Type`, `Description` |
| `Words` | `Word`, `Abbreviation`, `English Name`, `Description`, `Synonyms`, `Forbidden Words` |
| `Terms` | `Term`, `Physical Name`, `Domain`, `Description`, `Synonyms` |
| `Checks` | `Type`, `Target`, `Detail` |

Čo bunky robia:

- Hodnota `Data Type` domény sa zapisuje ako typ stĺpca, napríklad `VARCHAR(100)` alebo `NUMERIC(15,2)`, a má ju každý stĺpec prepojený s doménou – pozrite si časť [Domény a typy údajov](#domains-and-data-types).
- Hodnota `Abbreviation` slova je to, čo pre dané slovo používa fyzický názov – pozrite si časť [Zo slov](#from-the-words).
- Hodnoty `Synonyms` a `Forbidden Words` slova uvádzajú iné slová pre tú istú vec, oddelené čiarkami. Z každej položky sa odstránia medzery na začiatku a na konci, prázdna položka sa vynechá a položka zhodná so samotným slovom sa ignoruje. Z logického názvu, ktorý niektoré z nich použije, sa nezloží žiadny fyzický názov a hárok `Checks` ho nahlási a uvedie slovo, ktoré treba použiť namiesto neho – pozrite si časť [Čo zisťujú jednotlivé kontroly](#what-each-check-finds).
- Hodnota `Term` termínu je celý logický názov a jeho hodnota `Physical Name` je názov, ktorý tento logický názov dáva – pozrite si časť [Z termínu](#from-a-term).
- Bunka `Domain` termínu zobrazuje názov domény, s ktorou je termín prepojený, a je prázdna, kým nie je prepojený so žiadnou doménou alebo je prepojený s doménou, ktorá bola medzitým odstránená – pozrite si časť [Doména termínu](#a-terms-domain).
- Stĺpce `Category` a `English Name`, každý stĺpec `Description` a stĺpec `Synonyms` termínov slúžia iba na informáciu. Nič nemenia a žiadna kontrola ich nečíta.

V [jazyku zobrazenia písanom sprava doľava](./language-and-theme.md#right-to-left-languages) sú lišta, ponuka mriežky a stavový riadok zrkadlovo otočené, zatiaľ čo hárky a zoznam domén termínu zostávajú zľava doprava.

## Odvodzovanie fyzických názvov {#deriving-physical-names}

Slovníky môžu tabuľke alebo stĺpcu dať z jeho logického názvu fyzický názov, teda názov, ktorý zapisujú karty Schéma SQL a Generátor kódu. Najprv sa hľadá termín, ktorého hodnota `Term` je tento logický názov; inak sa názov zloží zo skratiek slov.  
Napríklad so slovami `Customer` (`CUST`), `Name` (`NM`), `Number` (`NO`), `Order` (`ORD`) a `Date` (`DT`) a s termínom `Customer Number` s fyzickým názvom `CUST_NO` a doménou `Number`, ktorej typ údajov je `INT`:

- Logický názov `Customer Number` pomenuje stĺpec `CUST_NO`, prepojí ho s doménou `Number` a dá mu typ `INT`.
- Z názvu `Order Date` sa zloží `ORD_DT`.
- Tabuľka s logickým názvom `Customer` dostane názov `CUST`.

Pri prázdnom hárku `Words` a prázdnom hárku `Terms` sa nič neodvodí.

### Kedy sa názov odvodí {#when-a-name-is-derived}

Fyzický názov sa odvodí pri zápise logického názvu:

- Na plátne, keď sa úprava bunky logického názvu ukončí s iným logickým názvom, než s akým začala, klávesom `Enter`, `Tab`, `Escape` alebo kliknutím inde. Každý stlačený kláves zapíše iba logický názov – pozrite si časť [Zápis logického názvu](./logical-names.md#writing-a-logical-name).
- Okamžite, keď vyberiete termín zo zoznamu pod bunkou – pozrite si časť [Dopĺňanie názvov termínov](./logical-names.md#completing-term-names).
- Keď prilepenie zapíše bunku logického názvu – pozrite si časť [Kopírovanie/prilepovanie stĺpcov](./table-editing.md#copyingpasting-columns).
- Keď [hľadanie a nahrádzanie](./find-and-replace.md#replacing) nahradí logický názov, jednu zhodu alebo všetky.
- Keď programovací agent nastaví logický názov.

Odvodí sa, iba ak je fyzický názov prázdny alebo bol sám odvodený – pozrite si časť [Vlastné názvy](#names-of-your-own).  
Výber termínu, prilepenie alebo nahradenie zapíše logický názov a to, čo sa z neho odvodí, ako jeden krok histórie zmien. Na plátne je názov odvodený pri ukončení úpravy samostatným krokom histórie zmien, ktorý nasleduje po písaní: prvé vrátenie späť zruší odvodený názov spolu s doménou a typom, ktoré priniesol termín, a ponechá logický názov, ktorý ste napísali.

Neskôr sa nič neodvodí znova samo. Nová hodnota `Abbreviation` slova, nová hodnota `Physical Name` alebo `Domain` termínu a nové slová či termíny ponechajú už odvodené názvy tak, ako sú; na to použite príkaz [Znova odvodiť fyzické názvy](#derive-physical-names-again). Výnimkou je hodnota `Data Type` domény: do stĺpcov domény sa dostane okamžite.

### Z termínu {#from-a-term}

V hárku `Terms` sa najprv hľadá termín, ktorého hodnota `Term` sa rovná logickému názvu. Medzery na začiatku a na konci a normalizácia Unicode sa ignorujú, ale rozlišuje sa veľkosť písmen, takže názov `customer number` nezodpovedá termínu `Customer Number`. Z dvoch termínov s rovnakým názvom platí ten, ktorý je v hárku prvý.

- Termín dá svoju hodnotu `Physical Name`, alebo, kým je prázdna, názov, ktorý sa zloží z jeho slov, ako je opísané nižšie, ak sa nejaký zloží.
- Stĺpec termín navyše prepojí s doménou zo svojej bunky `Domain`, ak ju hárok `Domains` uvádza, čím stĺpec dostane typ údajov domény – pozrite si časť [Prepojenie stĺpca](#linking-a-column). Urobí to aj vtedy, keď termín nedá žiadny názov. Termín bez domény nič neodpojí.
- Tabuľka preberá iba fyzický názov termínu.

### Zo slov {#from-the-words}

Bez zodpovedajúceho termínu sa názov zloží zo slov:

1. Logický názov sa rozdelí v mieste medzier a znakov `_`, `-`, `·` a `/` a žiadne slovo nesiaha cez miesto rozdelenia.
2. Každá časť sa číta zľava, pričom sa v každom mieste vezme najdlhší text, ktorý hárok `Words` uvádza ako hodnotu `Word`, synonymum alebo zakázané slovo, a nikdy sa nevracia späť. So slovami `가입`, `가입일` a `일자` sa `가입일자` prečíta ako `가입일` a `자`, pričom `자` zostane neregistrovaným slovom, zatiaľ čo `가입 일자` sa prečíta ako `가입` a `일자`. Rozlišuje sa veľkosť písmen: `member` nie je slovo `Member`.
3. Fyzický názov tvoria hodnoty `Abbreviation` jednotlivých slov presne tak, ako sú napísané, spojené znakom `_`, napríklad `ORD_DT`. Z dvoch slov s rovnakým názvom dá skratku to, ktoré je v hárku prvé. Neplatí žiadne obmedzenie dĺžky a nastavenia `Table Name Case` a `Column Name Case` karty Generátor kódu nemajú žiadny vplyv.

Platí všetko alebo nič. Ak je niektorý úsek synonymum, zakázané slovo alebo text, ktorý neuvádza žiadne slovo, alebo ak má slovo prázdnu hodnotu `Abbreviation`, nezloží sa žiadny názov a fyzický názov zostane tak, ako je.

### Vlastné názvy {#names-of-your-own}

Slovníky vyplnia fyzický názov, iba ak je prázdny alebo ho samy vyplnili. Editor si to pamätá pre každú tabuľku a každý stĺpec, hoci na plátne to nič nezobrazuje.

- Názov, ktorý zapíšete, sa stane vlastným: písanie v bunke názvu, nahradenie názvu tabuľky alebo stĺpca pomocou hľadania a nahrádzania, prilepenie do bunky názvu stĺpca a premenovanie programovacím agentom. Pri neskoršom zápise logického názvu zostane tak, ako je, zapíše sa iba logický názov a neprepojí sa žiadna doména.
- Vymazanie názvu ho vráti slovníkom, pretože prázdny názov sa vždy odvodí.
- Logický názov, z ktorého sa nič neodvodí, ponechá fyzický názov a jeho stav tak, ako boli: prázdny názov zostane prázdny a odvodený názov si zachová svoju hodnotu a naďalej patrí slovníkom.
- Nová tabuľka alebo nový stĺpec začína s prázdnym názvom, takže sa názov odvodí z prvého logického názvu. Stĺpec cudzieho kľúča, ktorý pridá vzťah, dostane názov podľa svojho kľúča a považuje sa za vlastný – pozrite si časť [Názvy stĺpcov cudzích kľúčov](./relationship-editing.md#foreign-key-column-names).
- Názvy, ktoré prinesie import súboru Schéma SQL, GraphQL, DBML alebo AML cez položku `Import` alebo `Import and Add`, a názvy diagramu vytvoreného verziou spred zavedenia karty Slovník sa považujú za vlastné, takže logický názov, ktorý k nim neskôr zapíšete, nič neodvodí.
- [Duplikovaná tabuľka](./table-related-functions.md#duplicating-tables-and-memos), stĺpec [presunutý do inej tabuľky](./table-editing.md#rearranging-and-moving-columns) pomocou úchytu na presúvanie, prilepenie skopírovaných tabuliek a pridanie súboru JSON cez položku `Import and Add` zachovajú stav každého názvu. Stĺpce prilepené do vybratých tabuliek ako nové stĺpce sa považujú za vlastné okrem prípadu, keď je prilepený názov prázdny a z ich logického názvu sa nejaký odvodí.
- Príkaz [Znova odvodiť fyzické názvy](#derive-physical-names-again) vráti vlastný názov slovníkom, a to aj importovaný.

### Dva stĺpce, jeden názov {#two-columns-one-name}

Stĺpec nič neodvodí, keď iný stĺpec jeho tabuľky už má názov, ktorý by odvodil. Zachová si svoj názov, svoj stav aj prepojenie s doménou a zapíše sa iba jeho logický názov. Názvy sa porovnávajú bez ohľadu na veľkosť písmen a medzery na začiatku a na konci, rovnako ako názvy stĺpcov cudzích kľúčov.  
Keď by jedna zmena dala dvom stĺpcom rovnaký názov, ako to môže urobiť príkaz `Replace All` alebo `Derive Physical Names Again` pre tabuľku, dostane ho prvý stĺpec v tabuľke.  
Napríklad rekurzívny vzťah v tabuľke `members` s kľúčom `MBR_NO` pridá stĺpec `MBR_NO_2`, ktorý skopíruje logický názov `Member Number`. Príkaz `Derive Physical Names Again` by ho pomenoval `MBR_NO`, čo je názov kľúča, takže si ponechá názov `MBR_NO_2`.  
Pre tabuľky také pravidlo neplatí: dve tabuľky môžu odvodiť rovnaký názov.

## Znova odvodiť fyzické názvy {#derive-physical-names-again}

Príkaz `Derive Physical Names Again` použite po zmene hodnoty `Abbreviation` slova alebo hodnoty `Physical Name` či `Domain` termínu, pretože tieto zmeny samy nič nepremenujú. Vráti názvy, na ktoré sa vzťahuje, slovníkom a znova ich odvodí podľa uvedených pravidiel, a to aj názvy, ktoré ste zapísali sami. Ponúka sa iba na karte ERD, nie však v editore iba na čítanie:

- Kontextová ponuka tabuľky, hneď za položkou `Focus on this table` alebo `Focus on selected tables`. Kým je tabuľka jednou z dvoch alebo viacerých vybratých tabuliek, položka `Derive Physical Names Again` sa vzťahuje na všetky, nech kliknete pravým tlačidlom kdekoľvek na tabuľku. Inak kliknutie pravým tlačidlom na riadok stĺpca ponúkne položku `Derive Physical Name Again` iba pre tento stĺpec a kliknutie na hlavičku ponúkne položku `Derive Physical Names Again` pre názov tabuľky a každý stĺpec.
- Kontextová ponuka plátna, hneď za položkou `Name View`: položka `Derive Physical Names Again` pre každú tabuľku a každý stĺpec v diagrame. Kým diagram nemá žiadnu tabuľku, nie je k dispozícii.
- [Rýchle vyhľadávanie](./quick-search.md#what-the-palette-lists), ako riadky pre stĺpec s fokusom, tabuľku s fokusom, vybraté tabuľky a celý diagram.

![Zmena skratky slova Number z NO na NUM v hárku Words, pričom fyzické názvy v diagrame zostanú MBR_NO a PAY_NO, potom príkaz Derive Physical Names Again z ponuky plátna, ktorý ich zmení na MBR_NUM a PAY_NUM, zatiaľ čo ORD_NO, ktorý dáva jeho termín, zostane](/img/demo-derive-physical-names.webp)

Každá zahrnutá tabuľka a každý zahrnutý stĺpec, ktoré majú logický názov, sa odvodia znova. Stĺpec navyše prevezme doménu, ktorú dáva jeho termín, a s ňou aj typ domény, ktorý sa šíri po vzťahoch, kým je zapnuté nastavenie [Synchronizácia typu údajov vo vzťahoch](./settings.md#relationship-datatype-sync).  
Nechá bez zmeny tabuľku alebo stĺpec bez logického názvu a stĺpec, ktorého nový názov má iný stĺpec jeho tabuľky – pozrite si časť [Dva stĺpce, jeden názov](#two-columns-one-name). Každý z nich si zachová svoj názov a svoj stav, vlastný alebo patriaci slovníkom, a stĺpec si zachová aj prepojenie s doménou.  
Logický názov, z ktorého sa teraz nič neodvodí, ponechá fyzický názov tak, ako je, ale vráti ho slovníkom, takže ho odvodí ďalší logický názov, ktorý zapíšete.  
Je to jeden krok histórie zmien bez ohľadu na to, koľko názvov, prepojení a typov zmení. Krok nezaznamená iba vtedy, keď nič nezmení, a vrátenie vlastného názvu slovníkom sa počíta ako zmena, aj keď názov už má hodnotu, ktorú slovníky dávajú.

Vlastná hodnota `Physical Name` termínu sa zo zmenených slov znova neskladá, takže pred opätovným odvodením upravte termín.

## Domény a typy údajov {#domains-and-data-types}

Stĺpec prepojený s doménou má hodnotu `Data Type` domény. Prepojenie stĺpca mu tento typ okamžite dá.  
Keď sa hodnota `Data Type` domény zmení, či už úpravou, prilepením alebo importom v hárku `Domains`, alebo zmenou od spolupracovníka či programovacieho agenta, každý stĺpec s ňou prepojený prevezme nový typ v tom istom kroku. Kým je zapnuté nastavenie [Synchronizácia typu údajov vo vzťahoch](./settings.md#relationship-datatype-sync), každá z týchto zmien pokračuje po vzťahoch rovnako ako ručne napísaná zmena typu; kým je vypnuté, zmenia sa iba prepojené stĺpce.  
Premenovanie domény zmení iba názov, ktorý zobrazujú bunky domény stĺpcov.

Zmena typu vykonaná v hárku `Domains` sa vracia späť v tomto hárku spolu s typmi stĺpcov, ktoré nastavila – pozrite si časť [Hárky karty Slovník](./undo-redo.md#dictionary-sheets).  
Vrátenie späť alebo opätovné vykonanie na karte ERD, ktoré stĺpec znova prepojí s doménou alebo obnoví stĺpec prepojený s doménou, dá stĺpcu aktuálny typ domény. Ak obnoví iný typ, stĺpec od domény odpojí.

### Prepojenie stĺpca {#linking-a-column}

Stĺpec sa s doménou prepojí:

- Výberom domény v bunke domény stĺpca, ktorú zobrazuje View Option → `Domain`, alebo v zobrazení `Logical Names` v bunke typu, ktorá ju zastupuje – pozrite si časť [Bunka domény](./logical-names.md#the-domain-cell).
- Logickým názvom, ktorého termín dáva doménu – pozrite si časť [Z termínu](#from-a-term). Stane sa to, iba keď sa názov odvodzuje, teda nie pri vlastnom názve ani pri stĺpci, ktorého odvodený názov má iný stĺpec.
- Príkazom `Derive Physical Name Again` alebo `Derive Physical Names Again`, ktorý každý zahrnutý stĺpec prepojí s doménou jeho termínu.
- Vzťahom: stĺpec cudzieho kľúča skopíruje doménu svojho kľúča spolu s jeho typom a logickým názvom – pozrite si časť [Identifikujúce vzťahy](./relationship-editing.md#identifying-relationships). Kľúč, ktorého kópia dostane iný typ, ako je to pri kľúči typu serial, doménu neodovzdá.
- Duplikovaním jeho tabuľky alebo presunutím do inej tabuľky pomocou úchytu na presúvanie, pričom obe prepojenie zachovajú. Prilepenie skopírovaných tabuliek alebo stĺpcov ho zachová, iba ak tento diagram doménu uvádza a doména má stále typ skopírovaného stĺpca, takže kópia z iného diagramu sa vloží neprepojená – pozrite si časť [Kopírovanie/prilepovanie tabuliek a poznámok](./table-related-functions.md#copyingpasting-tables-and-memos). Položka `Import and Add` neprepojí žiadny stĺpec.
- Názvom domény prilepeným do bunky domény – pozrite si časť [Kopírovanie/prilepovanie stĺpcov](./table-editing.md#copyingpasting-columns).

### Odpojenie {#unlinking}

- Napísanie typu do bunky `DataType` prepojeného stĺpca alebo prijatie návrhu odpojí stĺpec od domény, len čo sa jeho typ líši od typu domény, a stĺpec si ponechá typ, ktorý ste napísali – pozrite si časť [Automatické dopĺňanie typu údajov](./table-editing.md#datatype-autocomplete). Opätovné napísanie typu domény ho znova neprepojí; namiesto toho vyberte doménu v jeho bunke domény. Prilepenie do bunky `DataType` a zmena typu programovacím agentom odpájajú rovnako.
- Kým je zapnuté nastavenie Synchronizácia typu údajov vo vzťahoch, každý stĺpec, ku ktorému sa zmena typu dostane a ktorého nový typ sa líši od typu jeho vlastnej domény, sa v tom istom kroku odpojí, napríklad cudzí kľúč prepojený s vlastnou doménou. Dialógové okno [Mapovať stĺpce](./relationship-editing.md#map-columns) rovnako odpojí stĺpce, ktorým zmení typ.
- Položka `None` v bunke domény odpojí stĺpec od domény a ponechá mu jeho typ.
- Zmena alebo vymazanie bunky `Domain` termínu ani odstránenie termínu nezmení žiadny stĺpec.

### Odstránenie domény {#removing-a-domain}

Odstránenie riadka domény ponechá jej stĺpcom ich typy a ich prepojenia zostanú. Stĺpce nezobrazujú žiadnu doménu a hárok `Checks` pre každý z nich uvedie kontrolu `Unknown domain`, kým hárok `Domains` ešte obsahuje nejakú doménu. Vrátenie odstránenia späť v hárku `Domains` prepojenia znova zobrazí.  
Kým je doména odstránená, napísanie iného typu, než má doména, do takého stĺpca ho natrvalo odpojí a rovnako aj položka `None` v jeho bunke domény.  
Súbor tieto prepojenia pri uložení vynechá, takže sa diagram znova otvorí s týmito stĺpcami neprepojenými.

Termín prepojený s odstránenou doménou zobrazuje prázdnu bunku `Domain` označenú kontrolou `Unknown domain`. Kláves `Delete` alebo `Backspace` v tejto bunke ho od domény odpojí – pozrite si časť [Doména termínu](#a-terms-domain).

## Hárok Kontroly {#the-checks-sheet}

Hárok `Checks` uvádza, čo kontroly slovníkov zistia v slovníkoch a v tabuľkách a stĺpcoch diagramu. Kontroly iba čítajú: nič nemenia.  
Každá kontrola sa spúšťa, iba keď hárok, ktorý číta, obsahuje nejaký riadok, a kontroly slov iba vtedy, keď hárok `Words` obsahuje slovo s názvom, takže diagram s prázdnymi slovníkmi neuvádza nič.

![Customer Num vykreslený červenou a Order Stat jantárovou farbou v zobrazení Logical Names, hárok Kontroly so zoznamom ich troch kontrol a červeným počtom, dvojité kliknutie na riadok Forbidden word, ktoré prejde späť na Customer Num v diagrame, a jeho prepísanie na Member Number, po ktorom zostane jedna kontrola](/img/demo-dictionary-checks.webp)

Jeho tri stĺpce sú iba na čítanie:

- Stĺpec `Type` uvádza druh kontroly – pozrite si časť [Čo zisťujú jednotlivé kontroly](#what-each-check-finds).
- Stĺpec `Target` uvádza slovo, termín alebo doménu podľa názvu, tabuľku podľa názvu a stĺpec v tvare `table.column`, pričom tabuľka a stĺpec sú pomenované tak, ako ich pomenúva [Zobrazenie názvov](./logical-names.md#beyond-the-canvas), s textom `unnamed` tam, kde zobrazenie nezobrazuje žiadny názov.
- Stĺpec `Detail` zobrazuje, čo kontrola našla, a za šípkou `→` to, čo slovníky ponúkajú namiesto toho, pričom viacero hodnôt je spojených čiarkami, napríklad `멤버 → 회원`. Prázdna strana sa zobrazí ako `—`, napríklad `— → NUMERIC(15)`.

Najprv sú uvedené kontroly slov, potom termínov a domén a potom tabuľka po tabuľke, pričom za každou tabuľkou nasledujú jej stĺpce.  
Zoznam sleduje každú úpravu hneď, ako sa prejaví, vrátane úprav spolupracovníka a programovacieho agenta, a každé prepnutie Zobrazenia názvov.  
Počet na tlačidle `Checks` je červený, kým je niektorá kontrola chybou, jantárový, kým sú všetky varovaniami, a tlmený, keď nie je žiadna.

Riadky nemožno upravovať, pridávať, odstraňovať, zoraďovať, importovať ani exportovať: lišta nezobrazuje žiadne nástroje, kliknutie pravým tlačidlom neotvorí ponuku mriežky a príkazy Vrátiť späť a Znova vykonať nemajú žiadny účinok. Vyhľadávanie, výber a kopírovanie fungujú ako v ostatných hárkoch.

Kláves `Enter` alebo dvojité kliknutie na riadok prejde na to, čo riadok uvádza:

- Slovo, termín alebo doména: karta zobrazí príslušný hárok s vybratou bunkou, ktorú kontrola číta, teda bunkou názvu alebo bunkou `Domain` termínu, a s daným riadkom ako prvým viditeľným. Hľadanie v hárku sa vymaže, ak riadok skrýva. Riadok, ktorý bol medzitým odstránený, nikam nevedie.
- Tabuľka alebo stĺpec: zobrazí sa karta ERD, na ktorej je vybratá iba táto tabuľka a fokus má bunka, ktorú kontrola číta. Je to bunka názvu, bunka logického názvu alebo bunka domény, alebo tam, kde riadok túto bunku nevykresľuje, bunka vykreslená namiesto nej. Plátno prevezme fokus klávesnice a zobrazenie sa posunie podľa pravidla v časti [Kam vedie skok](./table-related-functions.md#where-a-jump-lands).

Dvojité kliknutie na hlavičku, okraj stĺpca, posúvací pruh alebo do oblasti pod riadkami nikam nevedie.  
Programovací agent vypíše tie isté kontroly v rovnakom poradí nástrojom `erd_list_checks` – pozrite si časť [Kontroly slovníkov](../../mcp/tools.md#dictionary-checks).

Ostatné tri hárky označia bunky, ktoré kontroly čítajú, teda bunku názvu alebo bunku `Domain` termínu, červeným alebo jantárovým textom na zafarbenom pozadí:

- Červenou: názov, ktorý má iný riadok jeho hárka, bunka `Domain` termínu prepojená s odstránenou doménou a hodnota `Term`, ktorá používa zakázané slovo.
- Jantárovou: hodnota `Term`, ktorá používa synonymum alebo neregistrované slovo.

Bunka dostane farbu výraznejšej zo svojich úrovní. Označenia sa zobrazujú aj v editore iba na čítanie a samotný hárok `Checks` sa nezafarbuje. Informácie o označeniach na plátne ERD nájdete v časti [Označenia na plátne](#marks-on-the-canvas).

### Čo zisťujú jednotlivé kontroly {#what-each-check-finds}

| `Type` | Úroveň | Zisťuje | Príklad hodnoty `Detail` |
| --- | --- | --- | --- |
| `Duplicate name` | Chyba | Hodnota `Word`, `Term` alebo `Domain`, ktorú má aj iný riadok toho istého hárka. Uvedie sa každý z týchto riadkov. | `Member` |
| `Unknown domain` | Chyba | Stĺpec alebo termín, ktorý je stále prepojený s odstránenou doménou, kým hárok `Domains` obsahuje nejakú doménu | Názov odstránenej domény |
| `Forbidden word` | Chyba | Úsek logického názvu alebo hodnoty `Term`, ktorý niektoré slovo uvádza vo svojej hodnote `Forbidden Words` | `커스터머 → 고객` |
| `Unregistered word` | Varovanie | Úsek logického názvu tabuľky alebo stĺpca alebo hodnoty `Term`, ktorý neuvádza žiadne slovo | `자` |
| `Synonym` | Varovanie | Úsek, ktorý niektoré slovo uvádza vo svojej hodnote `Synonyms` | `멤버 → 회원` |
| `Physical name mismatch` | Varovanie | Tabuľka alebo stĺpec, ktorých logický názov zodpovedá termínu, ale fyzický názov nie je ten, ktorý termín dáva | `mbr_no → MBR_NO` |
| `Domain type mismatch` | Varovanie | Stĺpec, ktorého hodnota `DataType` nie je hodnotou `Data Type` domény, s ktorou je prepojený | `INT → NUMERIC(15)` |

- Názvy sa porovnávajú bez medzier na začiatku a na konci a s rozlišovaním veľkosti písmen, takže `Member` a `member` sú dva názvy a prázdny názov nikdy nie je duplikát. Hárky odmietnu úpravu, ktorá by dvom riadkom dala rovnaký názov, takže kontrola `Duplicate name` sa objaví iba tam, kde sa dve úpravy skrížili, napríklad keď dvaja spolupracovníci pomenujú riadky naraz, alebo v súbore upravenom inde.
- Kontroly slov čítajú názov tak, ako to opisuje časť [Zo slov](#from-the-words), a každý odlišný úsek uvedú raz pre každý názov. Kontroly `Forbidden word` a `Synonym` ponúknu slovo, ktoré daný úsek uvádza.
- Kontrola `Physical name mismatch` porovnáva názov bez medzier na začiatku a na konci s hodnotou `Physical Name` termínu, alebo, ak ju termín nemá, s tým, čo sa zloží z jeho slov, a nič nehlási, kým termín nedáva žiadny názov. Pri stĺpci cudzieho kľúča, ktorý skopíroval logický názov svojho kľúča, sa zobrazí vždy, keď sa jeho vlastný názov líši od názvu termínu, napríklad `members_id → MBR_ID`. Príkaz `Derive Physical Name Again` to opraví, pokiaľ tento názov nemá iný stĺpec.
- Kontrola `Domain type mismatch` nikdy nevznikne z úprav v jednom editore, pretože prepojený stĺpec vždy skončí s typom svojej domény. Môže sa objaviť, keď jeden spolupracovník prepojí stĺpec, zatiaľ čo iný mení typ tejto domény, alebo v súbore zapísanom inde. Opätovný výber domény v bunke domény stĺpca dá stĺpcu jej typ a položka `None` ho od domény odpojí. Prepojenie s odstránenou doménou sa zobrazí iba ako `Unknown domain`.

### Označenia na plátne {#marks-on-the-canvas}

Plátno ERD vykreslí názov, ktorý kontroly nahlásia, farbou príslušnej kontroly:

- Bunka logického názvu v hlavičke tabuľky alebo v riadku stĺpca je červená, kým jej logický názov používa zakázané slovo, a inak jantárová, kým používa synonymum alebo slovo, ktoré hárok `Words` neobsahuje.
- Bunka fyzického názvu v hlavičke alebo v riadku je jantárová, kým termín, ktorému zodpovedá jej logický názov, dáva iný fyzický názov.

Označujú sa iba tieto dva druhy buniek, nikdy bunka domény ani bunka `DataType`, takže kontroly `Unknown domain` a `Domain type mismatch` stĺpca sa zobrazujú iba v hárku `Checks`.  
Bunka sa označí iba podľa toho, čo vykresľuje: zobrazenie `Physical Names` môže označiť iba fyzické názvy, zobrazenie `Logical Names` iba logické názvy a zobrazenie `Both Names` každú bunku podľa jej vlastných kontrol – pozrite si časť [Zobrazenie názvov](./logical-names.md#name-view). Prázdna bunka si zachová farbu zástupného textu a prázdne slovníky neoznačia nič.  
Na hlavičke tabuľky vo farebnej [skupine tabuliek](./table-groups.md) si označenie zachová svoju farbu, iba kým zostáva čitateľné na farbe skupiny; inak názov prevezme vlastnú čiernu alebo bielu farbu hlavičky.

Označenia sa zobrazujú na plátne ERD, v [cestovaní v čase](./undo-redo.md#time-travel) a v ukážke [automatického rozloženia](./table-related-functions.md#auto-layout), a to aj v editore iba na čítanie. Karta Vizualizácia, obe strany [prehliadača rozdielov](./table-related-functions.md#diff-viewer) a exportovaný obrázok ich nevykresľujú.  
Sledujú každú zmenu hneď, ako nastane, či už ide o zmenu názvu, alebo slova, termínu či domény.

## Vyhľadávanie {#searching}

Pole hľadania zobrazuje text `Search` a nachádza sa vo všetkých štyroch hárkoch, aj v editore iba na čítanie. Každý hárok má vlastné hľadanie.  
Riadok zodpovedá hľadaniu, keď jedna z prehľadávaných buniek obsahuje hľadaný text, bez ohľadu na veľkosť písmen, normalizáciu Unicode a medzery okolo hľadaného textu. Zhoda nikdy nepresahuje cez dve bunky. Prehľadávané bunky:

- `Domains`: `Domain`, `Data Type` a `Description`.
- `Words`: `Word`, `Abbreviation`, `English Name` a `Description`.
- `Terms`: `Term`, `Physical Name` a `Description`.
- `Checks`: všetky tri, tak, ako znejú v jazyku zobrazenia.

Nové hľadanie presunie výber na prvú bunku a posunie hárok na začiatok.  
Kým pole obsahuje text, tlačidlo `x` s bublinovým popisom `Clear search` ho vyprázdni a ponechá textový kurzor v poli. Vyprázdni ho aj kláves `Escape` v poli.  
V poli `Ctrl + Z` (Windows/Linux) alebo `⌘ + Z` (Mac) vráti späť vaše písanie, nie hárok, a klávesy pre riadky z časti [Pridávanie a odstraňovanie riadkov](#adding-and-deleting-rows) fungujú ako textové klávesy.  
Tlačidlo `Add Row` a vkladanie riadkov najprv vymažú hľadanie, pretože prázdny riadok nezodpovedá žiadnemu hľadaniu. Import ho ponechá.

## Výber a pohyb {#selecting-and-moving}

Mriežka vyberá ako tabuľkový procesor:

- Kliknutie vyberie bunku a ťahanie vyberie rozsah, pričom sa pri okraji hárka posúva. `Shift + click` rozšíri výber od aktívnej bunky a `Ctrl + click` (Windows/Linux) alebo `⌘ + click` (Mac) pridá ďalší rozsah.
- Hlavička stĺpca vyberie svoj stĺpec, číslo riadka svoj riadok a ľavý horný roh všetky bunky, rovnako ako `Ctrl + A` (Windows/Linux) alebo `⌘ + A` (Mac).
- Na Macu je `Ctrl + click` kliknutie pravým tlačidlom – pozrite si časť [Ponuka mriežky](#the-grids-menu).

Pomocou klávesnice:

- Klávesy so šípkami posúvajú o jednu bunku a s podržaným klávesom `Ctrl` (Windows/Linux) alebo `⌘` (Mac) prejdú v danom smere na okraj hárka.
- `Home` a `End` prejdú na prvú a poslednú bunku riadka a s podržaným klávesom `Ctrl` alebo `⌘` na prvú a poslednú bunku hárka.
- `Page Up` a `Page Down` posúvajú o obrazovku riadkov.
- Podržanie klávesu `Shift` s ktorýmkoľvek z uvedených klávesov namiesto toho rozšíri výber.
- `Tab` a `Shift + Tab` posúvajú doprava a doľava a `Shift + Enter` posúva nahor. Samotný kláves `Enter` otvorí úpravu bunky – pozrite si časť [Úprava buniek](#editing-cells).

Keď riadky pod výberom zmiznú vrátením späť alebo odstránením spolupracovníkom, výber sa vráti do zostávajúcich riadkov.

Ťahaním pravého okraja hlavičky stĺpca zmeníte šírku stĺpca a dvojitým kliknutím na okraj prispôsobíte stĺpec najširšiemu textu v zobrazených riadkoch. Žiadny kláves šírku stĺpca nemení.

## Úprava buniek {#editing-cells}

Písanie vo vybratej bunke nahradí jej hodnotu. `Enter`, `F2` alebo dvojité kliknutie otvorí úpravu aktuálnej hodnoty s textovým kurzorom na jej konci.  
Bunka obsahuje jeden riadok, takže tabulátor alebo zalomenie riadka, ktoré do nej prilepíte, sa zmení na medzeru.

- `Enter` zapíše úpravu a prejde nadol a `Tab` ju zapíše a prejde doprava. S klávesom `Shift` prejdú nahor alebo doľava.
- Zapíše ju aj kliknutie inde alebo presun fokusu klávesnice mimo mriežky.
- `Escape` ju zruší.

![Úprava hárka Words: prepísanie bunky textom NUM a stlačenie Enter, vloženie riadka pomocou ⌥ + Enter a jeho vyplnenie pomocou Tab, zoradenie podľa Word z ponuky mriežky, potom hľadanie ord a vyprázdnenie hľadania pomocou Esc](/img/demo-dictionary-editing.webp)

Úprava, ktorá ponechá hodnotu tak, ako bola, nič nezapíše a zapísaná úprava je jeden krok histórie zmien jej hárka bez ohľadu na to, koľko sa napísalo.  
Kláves `Delete` alebo `Backspace` bez otvorenej úpravy vyprázdni každú vybratú bunku ako jeden krok.  
Kým je úprava otvorená, klávesy na vrátenie späť a opätovné vykonanie vracajú späť a znova vykonávajú vaše písanie v bunke a klávesy pre riadky píšu ako text – pozrite si časť [Klávesy na karte](#keys-on-the-tab).  
Každá bunka v hárku `Checks` a každá bunka v editore iba na čítanie je iba na čítanie a neotvorí žiadnu úpravu.

Keď sa ktorýkoľvek riadok úpravy, prilepenia alebo vymazania odmietne, nič z toho sa neuloží a chybové oznámenie uvedie dôvod, počet riadkov a prvé tri z nich:

- Názov, ktorý má iný riadok hárka alebo ktorý zapisuje iný riadok toho istého prilepenia: `Nothing saved: 1 row shares a name with another row (Member)` alebo `Nothing saved: 2 rows share a name with another row (…)`. Názvy sa porovnávajú bez medzier na začiatku a na konci a s rozlišovaním veľkosti písmen, takže `Member` a `member` sa líšia. Prázdny názov sa nikdy neodmietne.
- Bunka `Domain` termínu zadaná textom, ktorý nemá ako názov žiadna doména v hárku `Domains`: `Nothing saved: 1 row names an unknown domain (…)`.
- Riadok, ktorý spolupracovník odstránil, kým ste ho upravovali: `Nothing saved: the row was removed`.

Zápis môže zasiahnuť aj mimo svojej bunky:

- Termín, ktorý dostane hodnotu `Term`, kým je jeho hodnota `Physical Name` prázdna, získa názov zložený z jeho slov, ak sa nejaký zloží – pozrite si časť [Zo slov](#from-the-words). Stane sa to raz: keď sa slová neskôr zmenia, názov sa znova neskladá.
- Nová hodnota `Data Type` domény zmení typ každého stĺpca prepojeného s doménou v tom istom kroku histórie zmien – pozrite si časť [Domény a typy údajov](#domains-and-data-types).

### Doména termínu {#a-terms-domain}

`Enter`, `F2` alebo dvojité kliknutie na bunku `Domain` termínu otvorí pod bunkou, alebo nad ňou, ak je tam viac miesta, zoznam s poľom hľadania s textom `Domain`.  
Zoznam obsahuje položku `None` a potom každú pomenovanú doménu v poradí hárka `Domains` a zvýraznenie začína na doméne, s ktorou je termín prepojený, alebo na položke `None`. Napísanie znaku v bunke otvorí zoznam už vyfiltrovaný podľa tohto znaku.

- Písanie zúži zoznam na domény, ktorých názvy obsahujú daný text bez ohľadu na veľkosť písmen, vynechá položku `None` a zvýrazní prvú zhodu.
- `↑` a `↓` posúvajú zvýraznenie, pričom na oboch koncoch pokračujú od opačného konca.
- `Enter` alebo `Tab` vyberie zvýraznený riadok a kliknutie riadok, na ktorý kliknete, ako jeden krok histórie zmien. Termín sa prepojí presne s vybratou doménou, aj keď je jednou z dvoch domén s rovnakým názvom, a položka `None` ho od domény odpojí.
- `Escape` alebo kliknutie mimo zoznamu zatvorí zoznam bez zapísania napísaného textu.

Ak hárok `Domains` neobsahuje žiadnu pomenovanú doménu, pole sa otvorí bez zoznamu.  
Prilepený text prepojí termín s prvou uvedenou doménou s týmto názvom, prázdny text ho odpojí a text zhodný s tým, čo bunka zobrazuje, ponechá prepojenie tak, ako je. Akýkoľvek iný názov sa odmietne – pozrite si časť [Úprava buniek](#editing-cells). Kláves `Delete` alebo `Backspace` v bunke odpojí termín od domény, aj od odstránenej.

## Kopírovanie a prilepovanie {#copying-and-pasting}

`Ctrl + C` (Windows/Linux) alebo `⌘ + C` (Mac) skopíruje výber ako text oddelený tabulátormi, jeden riadok textu na riadok hárka, tak, ako ho zapisujú tabuľkové procesory, takže sa do tabuľkového hárka prilepí ako bunky. Tabulátor alebo zalomenie riadka vnútri hodnoty sa zmení na medzeru.  
Viacero rozsahov sa skopíruje spolu, iba ak zahŕňajú tie isté riadky vedľa seba alebo tie isté stĺpce nad sebou. Inak sa nič neskopíruje a zobrazí sa chybové oznámenie `Nothing copied: the ranges share no rows or columns`.

`Ctrl + V` (Windows/Linux) alebo `⌘ + V` (Mac) prilepí text oddelený tabulátormi, napríklad bunky skopírované z tabuľkového hárka, od aktívnej bunky nadol a doprava:

- Úvodzovky sa prilepia ako text, takže bunka tabuľkového hárka, ktorá obsahuje zalomenie riadka, sa neprilepí ako jedna bunka.
- Jedna hodnota vyplní každý vybratý rozsah.
- Riadky za posledným riadkom sa pridajú ako nové riadky v poradí, takže prilepenie do prázdneho hárka ho vyplní.
- Stĺpce za posledným stĺpcom sa vynechajú a po uložení zvyšku to uvedie oznámenie `Columns past the last one weren't pasted`.
- Prilepenie viacerých buniek potom vyberie blok, ktorý zapísalo.

Prilepenie je jeden krok histórie zmien vrátane riadkov, ktoré pridá, a pri duplicitnom názve alebo neznámej doméne sa odmietne ako celok – pozrite si časť [Úprava buniek](#editing-cells).  
Kopírovanie, prilepenie alebo vymazanie viac ako milióna buniek nemá žiadny účinok a zobrazí sa chybové oznámenie `Nothing done: the selection covers too many cells`.  
Vystrihnutie, `Ctrl + X` (Windows/Linux) alebo `⌘ + X` (Mac), nemá v hárku žiadny účinok. Kopírovanie a prilepovanie na tejto karte sa nikdy nedostanú k diagramu, a kým je otvorená úprava bunky, pôsobia na text v bunke.

## Pridávanie a odstraňovanie riadkov {#adding-and-deleting-rows}

Tlačidlo `Add Row` pridá jeden prázdny riadok na koniec hárka. Vymaže hľadanie, vyberie prvú bunku nového riadka a dá mriežke fokus klávesnice, takže písanie vyplní túto bunku.  
Tlačidlo `Delete Rows` odstráni každý riadok, ktorý výber zahŕňa v ktoromkoľvek stĺpci, a jedno vrátenie späť ich všetky vráti na ich miesta. Jeho bublinový popis uvádza kláves, ktorý robí to isté.

Keď je fokus klávesnice v mriežke a žiadna bunka sa neupravuje:

- `Alt + Enter` (Windows/Linux) alebo `⌥ + Enter` (Mac) vloží pod výber toľko prázdnych riadkov, koľko ich výber zahŕňa.
- `Alt + Shift + Enter` (Windows/Linux) alebo `⌥ + Shift + Enter` (Mac) ich vloží nad výber.
- `Alt + Backspace` alebo `Alt + Delete` (Windows/Linux), prípadne `⌥ + Backspace` alebo `⌥ + Delete` (Mac), odstráni riadky, ktoré výber zahŕňa.

Robia to isté ako položky na vloženie a odstránenie riadkov v ponuke mriežky – pozrite si časť [Ponuka mriežky](#the-grids-menu). Vloženie vymaže hľadanie a vloží nové riadky tesne nad prvý riadok, ktorý výber zahŕňa, alebo tesne pod jeho posledný. Vyberie ich v prvom stĺpci, pričom prvý z nich je aktívny, a je jedným krokom histórie zmien.

Tieto klávesy sú klávesové skratky `Add Column` a `Remove Column` na karte [Klávesové skratky](./settings.md#shortcuts), takže hostiteľská aplikácia, ktorá ich priradí iným klávesom metódou [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), presunie aj tieto klávesy. `Alt + Shift + Enter` je klávesová skratka `Add Column` s pridaným klávesom `Shift` a nemá tam vlastný riadok.  
V otvorenej úprave a v poli hľadania fungujú ako textové klávesy, takže na Macu `⌥ + Backspace` odstráni slovo. V hárku `Checks` a v editore iba na čítanie nemajú žiadny účinok. Na tejto karte nikdy nepridajú ani neodstránia stĺpec tabuľky.  
V aplikácii Obsidian sa dostanú ku karte aj tam, kde ten istý kláves používa klávesová skratka aplikácie Obsidian.

Riadok, ktorý nikdy nebol vyplnený, alebo riadok, z ktorého sa odstránili všetky hodnoty, sa zobrazuje vo svojom hárku a dostane sa k spolupracovníkom, ale súbor ho vynechá, takže po opätovnom otvorení diagramu zmizne.

## Ponuka mriežky {#the-grids-menu}

Ponuku mriežky otvoríte kliknutím pravým tlačidlom na bunku v hárku `Domains`, `Words` alebo `Terms`. Bunka mimo výberu sa najprv stane výberom.  
Kliknutie pravým tlačidlom pod posledný riadok alebo napravo od posledného stĺpca ju otvorí pre aktuálny výber, takže v prázdnom hárku sa otvorí kdekoľvek pod hlavičkami. Kláves ponuky alebo `Shift + F10` ju otvorí pre aktívnu bunku.

- `Insert 1 row above`, `Insert 1 row below` a `Delete 1 row`, pričom každá položka uvádza počet riadkov, ktoré výber zahŕňa, napríklad `Insert 3 rows above`, a napravo svoj kláves – pozrite si časť [Pridávanie a odstraňovanie riadkov](#adding-and-deleting-rows).
- `Sort by <column>, ascending` a `Sort by <column>, descending` s názvom stĺpca, na ktorý ste klikli pravým tlačidlom, napríklad `Sort by Word, ascending` – pozrite si časť [Zoraďovanie](#sorting). Napravo od posledného stĺpca nie sú k dispozícii.
- `Import CSV` a `Export CSV`, ktoré robia to isté ako tlačidlá na lište – pozrite si časť [Import a export CSV](#importing-and-exporting-csv).

Keď sa nezobrazuje žiadny riadok, v prázdnom hárku alebo pri hľadaní, ktorému nič nezodpovedá, sa zobrazia iba položky `Insert 1 row below`, `Import CSV` a `Export CSV`.  
Hárok `Checks` a editor iba na čítanie namiesto nej otvoria vlastnú ponuku prehliadača a rovnako aj kliknutie pravým tlačidlom na hlavičku alebo posúvací pruh.  
Ponuka sa zatvorí po výbere položky, klávesom `Escape`, stlačením inde na karte, keď sa zmení výber alebo hárok a keď sa zmenia riadky hárka, či už vašou úpravou, alebo úpravou spolupracovníka.

## Zoraďovanie {#sorting}

Položky `Sort by <column>, ascending` a `Sort by <column>, descending` menia poradie samotných riadkov hárka, nielen zobrazenie. Nové poradie sa uloží do súboru, vidia ho spolupracovníci a riadi sa ním tlačidlo `Export CSV` a jedno vrátenie späť obnoví pôvodné poradie.  
Riadky sa porovnávajú podľa textu, ktorý bunka zobrazuje, bunka `Domain` termínu podľa názvu domény, v abecednom poradí jazyka zobrazenia, pričom čísla sa porovnávajú podľa hodnoty, takže `2` je pred `10`. Prázdne bunky sú v oboch smeroch na konci a riadky, ktoré sú pri porovnaní rovnaké, si zachovajú svoje poradie. Zoradenie hárka, ktorý už v danom poradí je, nič nezaznamená.  
Hľadanie zostane tak, ako bolo, a rovnako aj výber, ktorého bunky teraz obsahujú iné riadky.

## Import a export CSV {#importing-and-exporting-csv}

Každý z hárkov `Domains`, `Words` a `Terms` sa importuje zo súboru CSV a exportuje do neho. Tieto súbory patria iba karte Slovník: položky `Import` a `Export` v kontextovej ponuke plátna ich nečítajú ani nezapisujú – pozrite si stránku [Import a export súborov](./file-import-export.md).

### Import {#importing}

Tlačidlo `Import CSV` na lište alebo položka `Import CSV` v ponuke mriežky otvorí vlastné dialógové okno výberu súboru prehliadača pre súbory `.csv`, nie dialógové okno importu hostiteľskej aplikácie. Opätovný výber toho istého súboru ho znova importuje.  
Súbor sa načíta do slovníka, ktorý určuje jeho hlavička, bez ohľadu na to, ktorý hárok je zobrazený, a karta potom zobrazí tento hárok a dá jeho mriežke fokus klávesnice. Hárok si zachová hľadanie, výber a posunutie, takže riadky, ktoré hľadanie skrýva, alebo riadky pridané pod zobrazenú oblasť zostanú mimo dohľadu.  
Súbor sa číta ako UTF-8, so značkou poradia bajtov (BOM) alebo bez nej, alebo ako EUC-KR, ak nie je platným UTF-8, ako je to pri starších súboroch štandardu verejných údajov.

![Otvorenie karty Slovník z panela nástrojov, potom import domén, slov a termínov pomocou Import CSV, pričom každý súbor prepne kartu na svoj hárok a oznámi, čo pridal](/img/demo-dictionary-import.webp)

Ako sa riadky načítajú:

- Každý riadok s názvom aktualizuje riadok hárka s týmto názvom v poliach, pre ktoré má súbor stĺpce. Polia, pre ktoré súbor nemá stĺpce, zostanú tak, ako sú. Názvy sa porovnávajú bez medzier na začiatku a na konci a s rozlišovaním veľkosti písmen.
- Názvy, ktoré hárok neobsahuje, sa pridajú za jeho posledný riadok v poradí súboru.
- Import nikdy neodstráni riadok.
- Riadok s prázdnym názvom sa preskočí. Keď súbor obsahuje názov dvakrát, platí neskorší riadok a skorší sa počíta ako preskočený. Prázdne riadky súboru sa nepočítajú ako riadky.
- Doména termínu sa vyhľadá podľa názvu, a to prvá doména s týmto názvom, a názov, ktorý nemá žiadna doména, ponechá termín neprepojený, preto najprv importujte domény.

Jeden import je jeden krok histórie zmien daného hárka.  
Oznámenie potom znie napríklad `1 added · 1 updated · 2 skipped`. Riadok zhodný s riadkom hárka sa nepočíta ako pridaný ani aktualizovaný, takže opätovný import toho istého súboru nič nezmení a nezaznamená žiadny krok.  
Ak termíny zo súboru uvádzajú domény, ktoré diagram nemá, druhý riadok oznámenia uvedie prvé tri, napríklad `4 unknown domains: 연월일, 금액, 번호`.  
Súbor, ktorého hlavička nezodpovedá žiadnej štruktúre alebo zodpovedá dvom, nič nenačíta a zobrazí sa chybové oznámenie `Couldn't read this file as words, terms or domains`.

### Štruktúra súborov {#file-layouts}

Každý slovník číta dve štruktúry súborov. Prvá je vlastná štruktúra editora, ktorú zapisuje tlačidlo `Export CSV`, s názvami polí ako hlavičkou:

| Slovník | Hlavička | Súbor musí obsahovať |
| --- | --- | --- |
| Words | `name,abbreviation,englishName,description,synonyms,forbiddenWords` | `name`, `abbreviation` |
| Terms | `name,physicalName,domain,description,synonyms` | `name`, `physicalName` |
| Domains | `name,category,dataType,description` | `name`, `dataType` |

Stĺpce môžu byť v ľubovoľnom poradí, pole `domain` termínu obsahuje názov domény a každý iný stĺpec sa ignoruje. V hlavičke sa rozlišuje veľkosť písmen a bunky sa čítajú presne tak, ako sú napísané, vrátane medzier.

Druhá je štruktúra súborov kórejského štandardu verejných údajov (공통표준):

| Slovník | Súbor musí obsahovať | Načítajú sa aj |
| --- | --- | --- |
| Words | `공통표준단어명` | `공통표준단어영문약어명` (skratka), `공통표준단어 영문명` (anglický názov), `공통표준단어 설명` (popis), `이음동의어 목록` (synonymá), `금칙어 목록` (zakázané slová) |
| Terms | `공통표준용어명` | `공통표준용어영문약어명` (fyzický názov), `공통표준도메인명` (doména, podľa názvu), `공통표준용어설명` (popis), `용어 이음동의어 목록` (synonymá) |
| Domains | `공통표준도메인명`, `데이터타입` | `공통표준도메인분류명` (kategória), `공통표준도메인설명` (popis), `데이터길이`, `데이터소수점길이` |

Hodnoty `데이터타입`, `데이터길이` a `데이터소수점길이` domény sa spoja do jedného typu údajov: `NUMERIC(15,2)`, `CHAR(8)`, samotný typ tam, kde nie je dĺžka, napríklad `DATE`, a počet desatinných miest 0 sa vynechá, ako v `NUMERIC(15)`.  
V týchto súboroch sa z buniek odstránia medzery na začiatku a na konci a ostatné stĺpce, napríklad história revízií, sa ignorujú.  
V oboch štruktúrach nezáleží na medzerách v názve stĺpca hlavičky.

### Export {#exporting}

Tlačidlo `Export CSV` na lište alebo položka `Export CSV` v ponuke mriežky uloží zobrazený hárok vo vlastnej štruktúre editora: každý riadok v poradí hárka bez ohľadu na to, čo zobrazuje hľadanie, pričom doména termínu sa zapíše svojím názvom alebo sa pri odstránenej doméne ponechá prázdna.  
Súbor je v kódovaní UTF-8 so značkou poradia bajtov a s koncami riadkov CRLF a do úvodzoviek sa uzatvára iba pole, ktoré obsahuje úvodzovky, čiarku alebo zalomenie riadka. Otvorí sa v tabuľkovom procesore a pri importe späť vytvorí tie isté riadky.  
Má názov `<database name>-<timestamp>-words.csv`, `-terms.csv` alebo `-domains.csv` a uloží sa rovnako ako ostatné exporty editora – pozrite si časť [Export](./file-import-export.md#exporting).

Hárok `Checks` nemá export a editor iba na čítanie neponúka import ani export.

## Vrátenie späť a opätovné vykonanie {#undo-and-redo}

Hárky `Domains`, `Words` a `Terms` majú každý vlastnú históriu zmien, oddelenú od histórie diagramu. Na tejto karte `Ctrl + Z` a `Ctrl + Shift + Z` (Windows/Linux) alebo `⌘ + Z` a `⌘ + Shift + Z` (Mac) a tlačidlá `Undo` a `Redo` na paneli nástrojov pôsobia na zobrazený hárok a panel nástrojov nezobrazuje tlačidlo `Time Travel`. V hárku `Checks` nemajú žiadny účinok.  
Príkaz Vrátiť späť na karte ERD nikdy nevráti späť úpravu hárka – pozrite si časť [Hárky karty Slovník](./undo-redo.md#dictionary-sheets).

## Klávesy na karte {#keys-on-the-tab}

Kým je fokus klávesnice na karte, fungujú tieto klávesové skratky editora – pozrite si časť [Klávesové skratky](./settings.md#shortcuts):

- `Search`, `Ctrl + K` (Windows/Linux) alebo `⌘ + K` (Mac), otvorí [rýchle vyhľadávanie](./quick-search.md).
- `Toggle Explorer`, `Ctrl + F` (Windows/Linux) alebo `⌘ + F` (Mac), prepne na kartu ERD a otvorí [prieskumníka](./explorer.md#opening-and-closing) s jeho hľadaním.
- `Undo` a `Redo` pôsobia na zobrazený hárok – pozrite si časť [Vrátenie späť a opätovné vykonanie](#undo-and-redo).
- `Add Column` a `Remove Column` vkladajú a odstraňujú riadky – pozrite si časť [Pridávanie a odstraňovanie riadkov](#adding-and-deleting-rows).

Kým je otvorená úprava bunky vrátane zoznamu domén termínu, klávesové skratky `Search` a `Toggle Explorer` nemajú žiadny účinok, takže sa napísaný text nestratí.

Každá iná klávesová skratka editora zostane na karte a nikdy sa nedostane k plátnu: `Alt + N` (Windows/Linux) alebo `⌥ + N` (Mac) nepridá žiadnu tabuľku a `Delete` a `Backspace` na plátne nič neodstránia.  
Namiesto toho na hárok pôsobia vlastné klávesy mriežky: `Enter` otvorí úpravu bunky, `Delete` a `Backspace` vymažú vybraté bunky, `Ctrl + A` (Windows/Linux) alebo `⌘ + A` (Mac) vyberie všetky bunky a `Escape` zruší úpravu, zatvorí ponuku mriežky alebo vyprázdni pole hľadania. Kopírovanie, vystrihnutie a prilepenie tiež zostávajú na karte – pozrite si časť [Kopírovanie a prilepovanie](#copying-and-pasting).

## Editory iba na čítanie {#read-only-editors}

V editore s atribútom [`readonly`](../../api/erd-editor-element.md#readonly) sa karta otvorí a zobrazí všetky hárky.  
Prepínanie hárkov, vyhľadávanie, výber, posúvanie, zmena šírky stĺpcov a kopírovanie fungujú ako zvyčajne a rovnako aj prechod na kontrolu z hárka `Checks` klávesom `Enter` alebo dvojitým kliknutím. Zobrazujú sa aj označenia kontrol.

Žiadna bunka neprijme úpravu, prilepenie ani vymazanie a každá bunka, ktorú neoznačí žiadna kontrola, sa vykreslí na sivom pozadí buniek iba na čítanie.  
Tlačidlá `Add Row`, `Delete Rows`, `Import CSV` a `Export CSV` sú skryté, klávesy pre riadky nemajú žiadny účinok a kliknutie pravým tlačidlom otvorí ponuku prehliadača. Prázdny hárok nezobrazuje žiadnu nápovedu a panel nástrojov nezobrazuje tlačidlá `Undo` ani `Redo`.

## Spolupracovníci a súbor {#collaborators-and-the-file}

Súbor diagramu obsahuje slová, termíny a domény v poradí ich hárkov vrátane poradia po zoradení a vynecháva riadok, ktorý neobsahuje žiadnu hodnotu.  
Obsahuje aj logický názov každej tabuľky a každého stĺpca, informáciu, či každý fyzický názov patrí slovníkom, a prepojenie každého stĺpca s doménou, kým je doména uvedená. Kontroly a označenia sa z týchto údajov vypočítavajú a nikdy sa neukladajú.

V [relácii spoločných úprav](../../api/advanced/collaborative-editing.md) vidia editory navzájom svoje úpravy slovníkov hneď, ako sa prejavia, vrátane zoraďovania a vkladania. Každý si ponecháva vlastný hárok, hľadanie a výber a jeho histórie hárkov obsahujú iba jeho vlastné úpravy.  
Úprava alebo prilepenie do riadka, ktorý spolupracovník medzitým odstránil, nič neuloží a zobrazí sa oznámenie `Nothing saved: the row was removed`.  
Editor z verzie spred zavedenia karty Slovník uloží diagram bez jeho logických názvov, prepojení s doménami a slovníkov – pozrite si časť [Kombinovanie verzií](../../api/advanced/collaborative-editing.md#mixing-releases).

Import súboru Schéma SQL, GraphQL, DBML alebo AML cez položku `Import` slovníky zachová, import súboru JSON cez položku `Import` ich nahradí slovníkmi zo súboru a položka `Import and Add` neprinesie žiadne – pozrite si časť [Import externých súborov](./file-import-export.md#importing-external-files).  
Programovací agent upravuje slová, termíny a domény, nastavuje logické názvy a domény, znova odvodzuje fyzické názvy a vypisuje kontroly cez server MCP – pozrite si časti [Slovníky](../../mcp/tools.md#dictionaries) a [Kontroly slovníkov](../../mcp/tools.md#dictionary-checks). Pre súbory CSV nemá žiadny nástroj.
