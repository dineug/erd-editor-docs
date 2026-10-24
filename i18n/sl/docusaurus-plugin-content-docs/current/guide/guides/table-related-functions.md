---
sidebar_position: 5
description: Izbiranje, premikanje, kopiranje, podvajanje in brisanje tabel in beležk, nastavljanje barv in možnosti pogleda, določanje indeksov in alternativnih ključev, izbira zbirke podatkov, premikanje po neskončnem platnu in primerjava dokumentov.
---

# Funkcije za tabele

Vse, kar počnete s tabelami in beležkami, ko že obstajajo – izbiranje, premikanje, kopiranje, brisanje, barvanje in nastavljanje tega, kaj prikazuje platno –, ter kontrolniki platna okoli njih.  
Najprej so na vrsti ukazi za tabele in beležke; nato lastnosti tabele, osredotočanje na tabele, indeksi in alternativni ključi, samodejna postavitev in vrsta zbirke podatkov; na koncu pa še samo platno: orodna vrstica platna, povečava, premikanje pogleda in to, kam pripelje skok, ter pregledovalnik razlik.  
Skupine tabel, okvirji, ki združujejo tabele, imajo svojo stran – glejte stran [Skupine tabel](./table-groups.md).  
Svojo stran imajo tudi logična imena in prikaz imen, ki določa, katera imena prikazujejo tabele – glejte stran [Logična imena](./logical-names.md).

## Večkratni izbor {#multiple-selection}

Podprti so trije načini:

- `Ctrl + drag` (Windows/Linux) ali `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) ali `⌘ + click` (Mac)
- `Ctrl + A` ali `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` ali `⌘ + ⌥ + A` (Mac)

Beležke izbirate na enak način, vsaka od obeh bližnjic za izbor vsega pa naenkrat zajame vse tabele in beležke. Beležke, skrite z View Option → `Memos`, so izpuščene iz izbora vsega in iz okvira izbora – glejte razdelek [Možnosti pogleda tabel](#table-view-options).  
[Skupine tabel](./table-groups.md#selecting-groups) dodate v izbor s `Ctrl + click` (Windows/Linux) ali `⌘ + click` (Mac) na njihovo naslovno vrstico, izbor vsega pa nikoli ne zajame nobene skupine.  
Bližnjica `Ctrl + A` se umakne kazalki, zato med urejanjem celice izbere besedilo in ne diagrama.  
Okvir izbora označi tabelo ali beležko, ko prekrije njeno sredino, in ne že takrat, ko se le dotakne njenega roba. Skupino tabel zajame samo, če obkroža celoten okvir skupine, zato okvir, narisan znotraj skupine, izbere tabele brez skupine.  
Klik z desno tipko miške na nekaj, kar je že izbrano, ohrani celoten izbor, zato postavke menija, kot so `Color`, `Group selected tables` in `Delete selected`, delujejo na celoten izbor. Klik z desno tipko miške na katero koli drugo tabelo, beležko ali skupino tabel izbere samo to, tudi če držite `Ctrl` ali `⌘`, klik z desno tipko miške na relacijo ali na prazno platno pa počisti izbor.  
Tipka `Escape` počisti izbor. Medtem ko je odprto urejanje celice, urejanje beležke ali polje za ime skupine tabel oziroma medtem ko rišete relacijo ali skupino z `New Table Group`, prvi pritisk tipke `Escape` to konča, drugi pa počisti izbor.

![Izbiranje tabel s ⌘ + drag in ⌘ + click, nato vseh tabel in beležk s ⌘ + A](/img/demo-table-select.webp)

V sodelovalni seji se izbor, celica s fokusom in okvir izbora vsakega udeleženca narišejo na platnu v barvi tega udeleženca – glejte stran [Sodelovalno urejanje](../../api/advanced/collaborative-editing.md).  
Celica s fokusom udeleženca, ki gleda drug prikaz imen, se nariše na celici, ki jo vaš prikaz izriše na njenem mestu, na primer njegova celica imena na vaši celici logičnega imena – glejte razdelek [Sodelavci](./logical-names.md#collaborators).

## Premikanje več tabel {#moving-multiple-tables}

Povlecite katero koli tabelo ali beležko, ki je že del izbora, in z njo se premakne celoten izbor – modifikatorska tipka ni potrebna.  
Tabelo povlečete za glavo ali za katero koli vrstico stolpca, zato vlečenje, ki se začne na vrstici stolpca, premakne tabelo in ne stolpca. Stolpci se namesto tega premikajo z ročico za vlečenje ob vrstici s fokusom – glejte razdelek [Prerazporejanje in premikanje stolpcev](./table-editing.md#rearranging-and-moving-columns).  
Na celici glave ali vrstici stolpca se tabela začne premikati šele, ko kazalec prepotuje kratko razdaljo, zato klik tam celici še vedno da fokus, dvoklik pa še vedno odpre njeno urejanje. Vlečenje se nikoli ne začne z barvnega roba tabele, ki odpre izbirnik barv, z gumbov `+` in `x` na njeni glavi ali z gumba `x` v vrstici stolpca.  
Če povlečete nekaj zunaj izbora, se izbor zoži nanj in premakne se samo to. `Ctrl + drag` (Windows/Linux) ali `⌘ + drag` (Mac) v obeh primerih ohrani izbor.  
Tabele in beležke premika samo levi gumb miške. Klik z desno tipko miške določi, na kaj deluje priročni meni, in ne premakne ničesar, vlečenje s srednjim gumbom pa namesto tega premika pogled po platnu – glejte razdelek [Premikanje po platnu](#getting-around-the-canvas).

![Vlečenje ene od dveh izbranih tabel premakne obe, relacija pa jima sledi](/img/demo-table-multiple-move.webp)

Premakne se tudi izbrana [skupina tabel](./table-groups.md) in s seboj ponese svoje tabele, tabela, ki je izbrana in hkrati v skupini, ki se premika, pa se premakne samo enkrat.  
Glede na to, kam spustite tabelo, se ta lahko premakne v skupino ali iz nje – glejte razdelek [Dodajanje in odstranjevanje tabel](./table-groups.md#adding-and-removing-tables).

Tabele in beležke imajo skupen vrstni red prekrivanja. Pritisk na tabelo ali beležko, z levim ali desnim gumbom, jo postavi pred vse druge tabele in beležke, pritisk na naslovno vrstico skupine tabel ali klik z desno tipko miške na njeno notranjost pa postavi njene tabele v ospredje.  
Vrstni red se ne shrani: ponovno odprt diagram zloži tabele v vrstnem redu, v katerem jih navaja datoteka, vse beležke pa nad njimi.

## Kopiranje/lepljenje tabel in beležk {#copyingpasting-tables-and-memos}

Kopira izbrane tabele in beležke ter jih prilepi nazaj kot nove.  
Bližnjice: `Ctrl + C` (Windows/Linux) ali `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) ali `⌘ + V` (Mac)

Kopirana tabela ohrani svoje ime, logično ime, komentar, stolpce in barvo; kopirana beležka ohrani besedilo, velikost in barvo.  
Vsak kopirani stolpec ohrani svoje logično ime, vsako ime tabele in stolpca pa ohrani podatek o tem, ali je bilo izpeljano iz slovarjev – glejte razdelek [Izpeljava fizičnih imen](./dictionary.md#deriving-physical-names).  
Prilepljeni stolpec ohrani povezavo z domeno samo, kadar veljata dve stvari: diagram, v katerega pristane, navaja prav to domeno, ne le domene z enakim imenom, in domena ima še vedno podatkovni tip, s katerim je bil stolpec kopiran. Sicer stolpec pristane brez povezave z domeno in ohrani tip, s katerim je bil kopiran – glejte razdelek [Povezovanje stolpca z domeno](./dictionary.md#linking-a-column).  
Skupaj z njimi se kopirajo tudi indeksi in relacije: indeks se v celoti kopira na kopirano tabelo, relacija pa se kopira s svojo vrsto in dejanji ON DELETE in ON UPDATE, če sta obe tabeli, ki ju povezuje, v kopiranem naboru. Polovična relacija se izpusti, namesto da bi še naprej kazala na izvirnik.  
Prilepljene kopije postanejo novi izbor, ponovno lepljenje iste kopije pa jo vsakič zamakne za dodatnih `50px`, tako da se ponovljene kopije ne nalagajo druga na drugo.  
Kopija ne ohrani svoje [skupine tabel](./table-groups.md): prilepljena tabela ni v nobeni skupini, tudi če pristane znotraj okvirja skupine, izbrana skupina pa se ne kopira.  
Medtem ko View Option → `Memos` skriva beležke, lepljenje še vedno doda beležke, ki jih prinaša, skrite in neizbrane, tako da izbor postanejo samo prilepljene tabele.

![Kopiranje dveh povezanih tabel in njuno dvakratno lepljenje, skupaj z relacijo](/img/demo-table-copy-paste.webp)

Če so v tabeli s fokusom izbrani stolpci, ista bližnjica namesto tega kopira te stolpce – glejte stran [Urejanje tabel](./table-editing.md).

## Podvajanje tabel in beležk {#duplicating-tables-and-memos}

Držite tipko `Alt` in z levim gumbom miške povlecite tabelo ali beležko.  
Tabelo primete za glavo ali za katero koli vrstico stolpca, zato `Alt + drag` na vrstici stolpca podvoji tabelo, vrstnega reda stolpcev pa ne spremeni. Tipka `Alt`, pridržana na ročici za vlečenje stolpca, ne podvoji ničesar: stolpec se premakne tako kot pri navadnem vlečenju za ročico – glejte razdelek [Prerazporejanje in premikanje stolpcev](./table-editing.md#rearranging-and-moving-columns).  
Kazalcu sledi prosojen predogled, ko pa spustite gumb, se kopija postavi tja, kjer je predogled.  
Če je to, kar primete, že del izbora, se podvoji celoten izbor. V nasprotnem primeru izbor nadomesti entiteta pod kazalcem.  
`Alt + click` brez premikanja postavi kopijo `50px` navzdol in v desno, vsakič, ko je to mesto že zasedeno, pa jo zamakne še naprej.

Dvojnik prenese isto kot [lepljenje](#copyingpasting-tables-and-memos): imena in logična imena, komentarje, stolpce, barve, velikosti beležk ter indekse in relacije, ki v celoti pripadajo temu, kar ste kopirali. Ker ostane v istem diagramu, ohrani povezavo z domeno vsakega stolpca takšno, kot je. Tako kot pri lepljenju ne pristane v nobeni skupini tabel.  
`Alt + drag` na naslovni vrstici skupine tabel premakne skupino tako kot navadno vlečenje; skupina se nikoli ne podvoji.

![Podvajanje tabele z Alt + drag, nato Alt + click za še eno kopijo spodaj desno](/img/demo-table-duplicate.webp)

## Brisanje tabel in beležk {#table-and-memo-deletion}

Izbriše izbrane tabele, beležke in [skupine tabel](./table-groups.md).  
Bližnjice:

- `Delete` ali `Backspace`. Ti tipki odstranita celoten izbor, razen kadar je izbrana samo tabela, v kateri so izbrani nekateri njeni stolpci, povečava pa je nad `70%`: takrat namesto tega odstranita te stolpce – glejte razdelek [Brisanje stolpcev](./table-editing.md#column-deletion).
- `Ctrl + Backspace` ali `Ctrl + Delete` (Windows/Linux), `⌘ + Backspace` ali `⌘ + Delete` (Mac). Te bližnjice vedno odstranijo izbrane tabele, beležke in skupine tabel, tudi ko so izbrani stolpci.

![Brisanje tabele in njenih relacij s tipko Delete, nato tabele in beležke hkrati z Delete selected v meniju beležke](/img/demo-table-remove.webp)

Brišete lahko tudi prek priročnih menijev. Zadnja postavka menija tabele ali beležke se glasi `Delete selected`, kadar je ta tabela ali beležka eden od dveh ali več izbranih elementov, in odstrani celoten izbor. Sicer se glasi `Delete` in odstrani samo to tabelo ali beležko. Nad vrstico izbranega stolpca se postavka v meniju tabele namesto tega glasi `Delete column` ali `Delete columns`, kot v razdelku [Brisanje stolpcev](./table-editing.md#column-deletion).

Ko odstranite tabelo, se z njo odstranijo tudi njene relacije in indeksi. Ko odstranite skupino tabel, njene tabele ostanejo, vendar brez skupine – glejte razdelek [Odstranjevanje skupine](./table-groups.md#removing-a-group).  
Potrditve ni, vsaka odstranitev je en korak razveljavitve, v urejevalniku z lastnostjo `readonly` pa se ne odstrani ničesar.  
Če tipki `Delete` in `Backspace` držite, odstranita samo enkrat, relacije pa ne odstranita nikoli – glejte stran [Urejanje relacij](./relationship-editing.md#deletion). Medtem ko tipkate v celico, beležko ali katero koli drugo besedilno polje, namesto tega urejata besedilo.  
V nastavitvah sta obe tipki navedeni kot `Delete Selection` – glejte razdelek [Bližnjice](./settings.md#shortcuts).

## Določanje barve tabel in beležk {#table-and-memo-color-specification}

Barve lahko dodelite za razlikovanje po kategorijah.  
Tabela kaže svojo barvo na levem robu, beležka pa na vrhu. Kliknite ta rob ali trak z levim gumbom ali v priročnem meniju tabele ali beležke izberite `Color`, da se ob kazalcu odpre izbirnik barv. Barva se uporabi za vse izbrane tabele, beležke in skupine tabel, ne le za tisto, ki ste jo kliknili.  
Skupino tabel obarvate s postavko `Color` v njenem lastnem meniju, tabela v obarvani skupini pa ima barvo skupine čez glavo in na levem robu obdrži svojo barvo – glejte razdelek [Barvanje skupine](./table-groups.md#coloring-a-group).

![Izbira prednastavljene barve Blue na barvnem traku beležke za dve izbrani tabeli in beležko, nato odstranitev barve z No color](/img/demo-table-color.webp)

Izbirnik vsebuje od zgoraj navzdol:

- Območje nasičenosti in svetlosti, nato drsnik odtenka s predogledom barve ob njem. Kjer brskalnik ponuja kapalko, gumb s pipeto pred drsnikom, `Pick a color from the screen`, vzame barvo s katerega koli mesta na zaslonu.
- Polja `Hex`, `R`, `G` in `B`. Polje `Hex` sprejme 3, 4, 6 ali 8 šestnajstiških števk, z znakom `#` ali brez njega, ali prilepljeno vrednost `rgb()`, `hsl()` ali ime barve CSS. Celotna 6- ali 8-mestna vrednost se uporabi že med tipkanjem, vse drugo pa ob pritisku tipke `Enter` ali ko zapustite polje. Polja `R`, `G` in `B` sprejmejo cela števila, vse nad `255` preberejo kot `255`, vrednost pa se uporabi ob pritisku tipke `Enter` ali ko zapustite polje. Besedilo, ki ga izbirnik ne zna prebrati, se zavrže.
- Šestnajst prednastavljenih barvnih vzorcev v dveh vrsticah po osem: Red, Orange, Amber, Yellow, Lime, Green, Teal, Cyan, Blue, Indigo, Violet, Purple, Pink, Crimson, Brown in Gray. Ko je kazalec nad vzorcem, se prikaže njegova šestnajstiška koda.
- `Document colors`: največ osem barv, ki jih tabele, beležke in skupine tabel v dokumentu že uporabljajo, najpogosteje uporabljene najprej. Vrstica se prikaže samo, če takšne barve obstajajo.
- `No color`.

Barva je vedno neprosojna: izbirnik nima nastavitve prosojnosti in zavrže vso prosojnost, ki jo vsebuje vtipkana ali prilepljena vrednost.  
Odpiranje izbirnika ne spremeni ničesar, izbira barve, ki jo izbor že ima, pa ne doda koraka razveljavitve.

Možnost `No color` v enem koraku razveljavitve odstrani barvo vseh izbranih tabel, beležk in skupin tabel ter zapre izbirnik. Postavka `Remove color`, ki je v priročnih menijih tabele, beležke in skupine tabel tik pod postavko `Color`, kadar ima kateri koli izbrani element barvo, naredi isto, ne da bi odprla izbirnik.

Izbirnik ob odprtju prevzame tipkovnico, `Tab` in `Shift + Tab` pa krožita po njegovih kontrolnikih. Puščične tipke premaknejo območje in drsnik odtenka za 1 ali s tipko `Shift` za 10, med vzorci pa se z njimi pomikate od enega do drugega, pri čemer se vsak sproti uporabi.  
Medtem ko ima izbirnik tipkovnico, razveljavitev in uveljavitev, bližnjice za povečavo, `Search` in `Toggle Explorer` še vedno dosežejo urejevalnik, druge bližnjice urejevalnika pa ne: bližnjice za [brisanje](#table-and-memo-deletion) ne odstranijo ničesar, `Delete` in `Backspace` pa le urejata besedilo polj `Hex`, `R`, `G` in `B`.  
Tipka `Escape` zapre izbirnik, prav tako pa tudi pritisk na platno zunaj njega.  
Pritisk v [raziskovalcu](./explorer.md) ni pritisk na platno, zato izbirnik ostane odprt. Vrstica, ki jo izberete tam, spremeni izbor, naslednja izbira barve pa obarva novi izbor.

## Možnosti pogleda tabel {#table-view-options}

Na voljo so naslednje možnosti pogleda:

- Table Comment
- Column Comment
- DataType
- Domain
- Default
- Not Null
- Unique
- Alternate Key
- Auto Increment
- Relationship
- Referential Actions
- Table Groups
- Memos

Možnosti `Domain`, `Unique`, `Alternate Key` in `Auto Increment` so privzeto izklopljene, vse druge pa vklopljene.  
Katera imena prikazujejo tabele, ni možnost pogleda: postavka `Name View`, takoj za `View Option` v priročnem meniju platna, izbere fizična imena, logična imena ali oboje – glejte razdelek [Preklapljanje prikaza](./logical-names.md#switching-the-view).  
Možnost `Domain` vsakemu stolpcu doda celico, katere mesto določa [vrstni red stolpcev](./settings.md#adjusting-column-order), z imenom domene, s katero je stolpec povezan. Stolpec, ki ni povezan z nobeno domeno, ki jo navaja list `Domains`, tam prikaže zatemnjeno nadomestno besedilo `domain`. Celica se prikaže v vsakem prikazu imen. Dokler je možnost `Domain` izklopljena, prikaz `Logical Names` namesto tega prikaže ime povezane domene v celici tipa – glejte razdelek [Celica domene](./logical-names.md#the-domain-cell).  
Možnost `Alternate Key` označi stolpce vsakega alternativnega ključa z oznakami, kot je `AK1.1` – glejte razdelek [Alternativni ključi](#alternate-keys).  
Možnost `Referential Actions` prikaže oznaki `D:` in `U:`, ki ju dejanji ON DELETE in ON UPDATE relacije postavita na konec njene povezovalne črte pri podrejeni tabeli – glejte razdelek [Branje povezovalne črte](./relationship-editing.md#reading-a-connector). Če jo izklopite, se skrijeta samo ti oznaki, nobena tabela ali povezovalna črta pa se ne premakne.  
Možnost `Table Groups` prikaže [skupine tabel](./table-groups.md) in barve skupin na glavah njihovih tabel. Izklop jih skrije na platnu, na mini zemljevidu in v izvoženih slikah, ne premakne nobene tabele in vsako tabelo ohrani v njeni skupini – glejte razdelek [Skrivanje skupin](./table-groups.md#hiding-groups). Odstrani tudi mapo `Table Groups` iz [raziskovalca](./explorer.md#the-tree) in gumb `New Table Group` iz [orodne vrstice platna](#canvas-toolbar), iskanje v raziskovalcu pa ne najde več imen skupin.  
Možnost `Memos` prikaže beležke. Izklop skrije vse beležke na platnu, na mini zemljevidu in v izvoženih slikah ter ne premakne nobene tabele ali povezovalne črte. Skrite beležke ne zavzemajo prostora, zato jih drsna trakova, mini zemljevid in kompas `Go to content` ne upoštevajo.  
Skrivanje beležk prekliče njihov izbor in zapre odprto urejanje beležke. [Raziskovalec](./explorer.md#the-tree) odstrani svojo mapo `Memos`, [iskanje in zamenjava](./find-and-replace.md) v njem in predpona `:` hitrega iskanja pa jih ne preiskujeta. Medtem ko so skrite, ukaz `New Memo` izgine iz priročnega menija, [orodne vrstice platna](#canvas-toolbar), hitrega iskanja in [pozdravnega zaslona](./editing-start.md#welcome-screen), `Alt + M` pa ne doda beležke. Lepljenje ali ukaz [Uvozi in dodaj](./file-import-export.md#import-and-add) še vedno doda beležke, ki jih prinaša, skrite in neizbrane.  
V urejevalniku z lastnostjo `readonly` stikala ne spremenijo ničesar.

![Preklapljanje postavk View Option, ob katerem se tabele prerazporedijo, označevanje sestavljenega enoličnega indeksa kot AK1.1 in AK1.2 z Alternate Key, nato izklop in vklop Memos](/img/demo-view-options.webp)

Kartice v načinu `Flow` na zavihku Vizualizacija ne upoštevajo teh možnosti, vključno z možnostjo `Domain`: uporabljajo svoj [prikaz vrstic](./visualization.md#row-display) in rišejo svoje povezovalne črte, tudi ko je možnost `Relationship` izklopljena. Katere celice razporedi kartica, je odvisno samo od prikaza imen – glejte razdelek [Imena na karticah](./visualization.md#names-on-the-cards).

## Lastnosti tabele {#table-properties}

Odpre okno Lastnosti tabele.  
Začnite s postavko `Table Properties` v priročnem meniju tabele, ki okno odpre za tabelo, ki ste jo kliknili z desno tipko miške, ali izberite tabelo in pritisnite `Alt + Space`.  
Okno se odpre sredi zatemnjenega platna. Zatemni se samo platno, zato odprt [raziskovalec](./explorer.md#dialogs-beside-it) ob njem ostane odprt in uporaben. Njegova glava vsebuje naslov `Table Properties`, pet nazadnje odprtih tabel kot ploščice, med katerimi je trenutna poudarjena, in gumb za zapiranje. Vsaka ploščica poimenuje svojo tabelo tako kot [prikaz imen](./logical-names.md#beyond-the-canvas). Kliknite ploščico, da preklopite na to tabelo, ne da bi znova odprli okno.  
Pod glavo so trije zavihki: `Indexes`, `Schema SQL` in `Code Generator`. Okno ima za vse tri enako velikost, zato ga preklapljanje med zavihki ne premakne in mu ne spremeni velikosti.  
Zaprete ga z gumbom za zapiranje, s tipko `Escape` ali s klikom na platno zunaj njega.  
Izbira vrstice v raziskovalcu, ki ni mapa, ali prehod na zadetek njegovega iskanja zapre okno Lastnosti tabele pred skokom. Enako stori bližnjica `Ctrl + F` (Windows/Linux) ali `⌘ + F` (Mac), ki odpre iskanje v raziskovalcu ali postavi kazalko v njegovo iskalno polje, če je raziskovalec že odprt. Vsak drug klik v raziskovalcu, vključno z vrstico mape, ali na gumb `Explorer` v orodni vrstici pusti okno Lastnosti tabele odprto. Pritisk tipke `Escape`, medtem ko je tipkovnica v raziskovalcu, le vrne tipkovnico platnu, zato je za zapiranje okna Lastnosti tabele potreben drugi pritisk tipke `Escape`.

Zavihek `Indexes` je opisan v razdelku [Indeksi](#indexes).  
Zavihek `Schema SQL` prikaže DDL tabele za izbrano [zbirko podatkov](#databases): njen stavek `CREATE TABLE`, ločene omejitve, ki jih nekatere zbirke podatkov zapišejo za njene stolpce z zastavico Enolično, in njene indekse. Vedno zapiše navadne stavke `CREATE`, brez glave, brez skripta pred tabelami ali za njimi in brez logičnih imen v praznih komentarjih, ne glede na to, kako je nastavljen zavihek [Shema SQL](./schema-sql.md) v orodni vrstici – glejte razdelek [Logična imena kot komentarji](./schema-sql.md#logical-names-as-comments). Nima plošče z možnostmi, njegov priročni meni pa ponuja samo `Database` in `Bracket`.  
Zavihek `Code Generator` ustvari kodo samo za to tabelo – glejte stran [Generator kode](./code-generator.md).

V urejevalniku z lastnostjo `readonly` se okno še vedno odpre, z značko `Read only` ob naslovu, vendar njegov zavihek `Indexes` ne omogoča sprememb.

## Osredotočanje na tabele {#focusing-on-tables}

Odpre zavihek Vizualizacija v načinu `Flow`, zožen na izbrane tabele in vse tabele, ki so od njih oddaljene za eno relacijo.  
Začnite v priročnem meniju tabele s postavko `Focus on this table` ali izberite eno ali več tabel in pritisnite `Alt + F`.  
Kadar je tabela, ki jo kliknete z desno tipko miške, ena od več izbranih tabel, se postavka glasi `Focus on selected tables` in se osredotoči na celoten izbor. Če z desno tipko miške kliknete tabelo zunaj izbora, se osredotočite samo na to tabelo.  
Bližnjica upošteva izbrane tabele, beležke izpusti in ne naredi ničesar, če ni izbrana nobena tabela.  
Izbrana [skupina tabel](./table-groups.md) tu ne šteje, ne pri bližnjici ne pri postavki menija: njene tabele se upoštevajo samo, če so izbrane same, kar naredi postavka `Select tables` v meniju skupine.  
Kaj prikazuje zoženi pogled in kako se vrnete k celotnemu diagramu, je opisano na strani [Vizualizacija](./visualization.md#focusing-on-tables), kako se korak nazaj in naprej pomikate po tem, kar je način Tok prikazoval prej, pa v razdelku [Prejšnja in naslednja tabela](./visualization.md#previous-table-and-next-table).

## Indeksi {#indexes}

Indeksi se določijo na zavihku `Indexes` okna Lastnosti tabele in so vključeni v izvoženo Shemo SQL.

Leva stran navaja ključe in indekse tabele v dveh skupinah.  
Skupina `Keys`, ki se prikaže, če ima tabela ključe, navaja ključe, ki jih določajo njeni stolpci: `PK_<table name>` nad stolpci z oznako PK, nato `UQ_<table name>_<column name>` za vsak stolpec z zastavico Enolično, v vrstnem redu stolpcev. Imena so fizična imena, ki jih zapiše Shema SQL izbrane zbirke podatkov, ne glede na prikaz imen, zato tabela, katere ime vsebuje shemo, kot je `sales.users`, pri vseh zbirkah podatkov razen Databricks in Snowflake navaja `PK_users`, ko ima nastavitev `Bracket` vrednost `None` – glejte razdelek [Imena tabel s shemo](./schema-sql.md#schema-qualified-table-names). Vsak ključ nosi oznako `PK` ali `UQ` in je označen s ključavnico. Tu so samo za branje in se spremenijo le z zastavicama [PK](./table-editing.md#column-primary-key) in [Enolično](./table-editing.md#not-null-unique-auto-increment) stolpcev.  
Skupina `Indexes` navaja indekse tabele v vrstnem redu, v katerem so bili dodani. Vsak indeks ima stikalo `UQ`, ki ga naredi enoličnega, polje za ime in gumb `x`, ki ga odstrani. Indeks, ki je [alternativni ključ](#alternate-keys), prikazuje tudi svojo številko, na primer `AK1`. Indeks dodate z gumbom `Add Index` na dnu seznama.

Desna stran navaja stolpce tabele pod `Columns`, vsakega s potrditvenim poljem. Vsaka vrstica prikazuje iste celice kot vrstica stolpca na platnu ter sledi vrstnemu redu stolpcev, možnostim pogleda in [prikazu imen](./logical-names.md#beyond-the-canvas). Dokler na levi ni izbran indeks, ni mogoče urejati ničesar.  
Označite stolpec, da ga dodate v izbrani indeks, in počistite njegovo oznako, da ga odstranite. Ko izberete ključ, so njegovi stolpci prikazani kot označeni, vendar polja ostanejo onemogočena.  
Stolpci izbranega indeksa so navedeni spodaj pod `Index order`, vsak poimenovan tako, kot ga poimenuje prikaz imen, pri čemer je v prikazu `Both Names` fizično ime v oklepaju za logičnim imenom, na primer `Member Number (member_no)`. Povlecite jih za ročico za vlečenje, da spremenite njihov vrstni red, in kliknite ploščico `ASC` ali `DESC` v vrstici, da obrnete njen vrstni red razvrščanja. Pri alternativnem ključu se vsaka vrstica konča z oznako `AK<n>.<m>`. Seznam prikazuje tri vrstice hkrati, ostale pa so dosegljive s pomikanjem.

V urejevalniku z lastnostjo `readonly` izbira ključa ali indeksa še vedno prikaže njegove stolpce, vendar ni gumbov `Add Index` in `x`, ničesar drugega na zavihku pa ni mogoče spremeniti.

[Raziskovalec](./explorer.md#the-tree) navaja indekse vsake tabele v njeni mapi `Indexes`, izbira indeksa tam pa vas pripelje do njegove tabele. Njegovo iskanje najde tudi imena indeksov in jih lahko preimenuje – glejte razdelek [Kaj preiskuje](./find-and-replace.md#what-it-searches).

![Odpiranje okna Lastnosti tabele za orders, kjer zavihek Indeksi navaja ključa PK in UQ nad indeksi, nato dodajanje indeksa nad member_id in ordered_at DESC ter branje rezultata na zavihku Shema SQL](/img/demo-table-properties.webp)

## Alternativni ključi {#alternate-keys}

Alternativni ključ je enoličen indeks nad dvema ali več stolpci: indeks na zavihku `Indexes` z vklopljenim stikalom `UQ` in vsaj dvema označenima stolpcema tabele.  
Enoličen indeks nad enim stolpcem ne pove nič več kot zastavica Enolično tega stolpca, zato ni alternativni ključ, prav tako pa tudi ne navaden indeks, primarni ključ ali stolpec z zastavico Enolično.

Ko je v [možnostih pogleda](#table-view-options) vklopljena možnost `Alternate Key`, diagram označi stolpce vsakega alternativnega ključa tako, kot jih zapisujeta erwin in IDEF1X: `AK1.1`, `AK1.2` in tako naprej. Možnost je privzeto izklopljena.

Ključi se oštevilčijo po položaju svojih stolpcev v tabeli in ne po vrstnem redu, v katerem so bili indeksi dodani. Ključ, katerega prvi stolpec v njegovem seznamu `Index order` stoji najvišje v tabeli, je `AK1`. Pri izenačenju odloča naslednji stolpec vsakega ključa, ključ, ki je začetni del daljšega ključa, pa je pred njim.  
Premik stolpca znotraj tabele ali sprememba vrstnega reda v seznamu `Index order` ključa lahko ključe preštevilči. Razveljavitev odstranitve ključa mu vrne njegovo številko, vsi sodelavci pa vidijo enake številke.

Vsak stolpec ključa dobi oznako `AK<n>.<m>`, kjer je `n` številka ključa, `m` pa mesto stolpca v seznamu `Index order` ključa. Stolpec v več ključih nosi vse oznake, ločene z vejico.  
V tabeli s stolpci `a`, `b` in `c` na primer enolična indeksa nad (`c`, `a`) in (`b`, `a`) postaneta `AK1` = (`b`, `a`) in `AK2` = (`c`, `a`), ker `b` stoji nad `c`. Tako ima `b` oznako `AK1.1`, `c` oznako `AK2.1`, `a` pa `AK1.2,AK2.2`.

Oznaka se nariše zadnja v vrstici, za tisto celico, ki jo [vrstni red stolpcev](./settings.md#adjusting-column-order) postavi na konec. Ni celica, zato nikoli ne dobi fokusa, je ni mogoče urejati in se ne kopira – glejte stran [Urejanje tabel](./table-editing.md).  
Tudi stolpec primarnega ali tujega ključa lahko nosi oznako AK, saj oznaka ničesar ne nadomesti: ikona ključa na začetku vrstice še vedno prikazuje PK in FK, celica Enolično pa ohrani svojo oznako `UQ`.  
Tabela z alternativnim ključem za zadnjo celico vsake vrstice pusti prostor za svojo najdaljšo oznako; tabela brez njega ohrani svojo širino.  
Oznake so vidne na platnu ERD, kjer tabela, ki je pri `70%` in manj strnjena na ime, ne prikaže nobene, in v [izvozu slike](./file-import-export.md#image), ki vsako tabelo nariše v celoti ne glede na povečavo. Prikaže jih tudi [predogled ob lebdenju](./visualization.md#hover-preview) v načinu `Graph` na zavihku Vizualizacija; kartice v načinu `Flow` jih ne prikažejo nikoli.

Zavihek `Indexes` prikazuje številke ne glede na to, ali je možnost vklopljena – glejte razdelek [Indeksi](#indexes).

## Samodejna postavitev {#auto-layout}

Namesto vas razporedi vse tabele na platnu.  
Odprite `Auto Layout` v priročnem meniju platna ali v hitrem iskanju in izberite eno od štirih postavitev:

| Postavitev | Kaj nariše |
| --- | --- |
| `Force` | Simulacija: relacije vlečejo tabele skupaj, sosedi se medsebojno odrivajo, prekrivajoče se tabele pa se razmaknejo. |
| `Flow` | Od leve proti desni vzdolž relacij, pri čemer ima vsaka povezovalna črta na tabeli svojo stično točko. Skuša ohraniti malo križanj, vendar lahko pusti nekatera, ki bi se jim druga postavitev izognila. |
| `Tree - vertical` | V plasteh navzdol: nadrejena tabela je nad tabelami, ki imajo tuji ključ nanjo. |
| `Tree - horizontal` | Enaka razporeditev v plasti, od leve proti desni. |

Postavitev `Force` med umirjanjem odpre predogled z gumboma `Apply` in `Cancel` v obvestilu, ki ga prikaže.  
Okvir predogleda se določi po diagramu, kakršen je bil ob začetku postavitve, zato se lahko tabele med umirjanjem postavitve premaknejo iz okvirja. Predogled se nariše pri `70%` ali manj, zato so njegove tabele prikazane strnjene na ime in barvni rob. Odpre se v prikazu imen, ki ga gledate, ne glede na to, kateri prikaz hrani datoteka – glejte razdelek [Zunaj platna](./logical-names.md#beyond-the-canvas).  
Gumb `Apply` ohrani položaje, kakršni so v tistem trenutku, postavitev pa se uporabi samodejno, ko se umiri. Gumb `Cancel` ali tipka `Escape` pusti diagram, kakršen je bil.

Druge tri se izračunajo v enem koraku, zunaj glavne niti, zato ni česa opazovati: med izračunom postavitve je prikazano obvestilo, končna razporeditev pa se usredini na območje, ki ga diagram že zaseda. Gumb `Cancel` ali tipka `Escape` opusti postavitev, na katero ne čakate več, pri gostitelju, ki ne poganja procesa shared worker, pa se postavitev konča s sporočilom `Could not place tables` – glejte razdelek [Web Workers](../../api/installation.md#web-workers). Enako se konča postavitev, ki se ne vrne v 60 sekundah.

Ne glede na to, katero izberete, se premaknejo tabele in skupine tabel, beležke pa ostanejo, kjer so. Tabele se razporedijo pri širinah, ki jih imajo v prikazu imen, ki ga gledate. Rekurzivna relacija se ne upošteva, več relacij med istima dvema tabelama pa šteje kot ena.  
Vsaka postavitev ohrani tabele vsake skupine skupaj, ne glede na to, ali so skupine prikazane, in vsako skupino, ki vsebuje tabele, prilagodi okoli njih – glejte stran [Skupine tabel](./table-groups.md#auto-layout).  
Rezultat se zapiše kot en sam vnos v zgodovini, zato ena razveljavitev vrne vse tabele in skupine tja, kjer so bile.

![Urejanje kupa tabel s samodejno postavitvijo Tok iz priročnega menija platna, ki jih poravna od leve proti desni vzdolž njihovih relacij](/img/demo-automatic-table-placement.webp)

## Zbirke podatkov {#databases}

Med podprtimi zbirkami podatkov so:

- Databricks
- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- Snowflake
- SQLite

Zbirko podatkov izberete s postavko `Database` v priročnem meniju platna, na plošči z možnostmi ali v priročnem meniju zavihkov Shema SQL in Generator kode ali v hitrem iskanju. Vsa ta mesta spremenijo isto nastavitev.

Te možnosti določajo sintakso Sheme SQL za izvoz, samodokončanje podatkovnega tipa in tipe, v katere se razrešijo ustvarjena koda in uvožene sheme.  
Odločajo, katere izbire `Statements` in `Header` lahko zapiše zavihek [Shema SQL](./schema-sql.md#options-panel). Izbira, ki je zbirka podatkov nima, ostane na plošči z možnostmi, zatemnjena, koda SQL pa uporabi najbližjo izbiro, ki jo zbirka ima.  
Odločajo tudi, katera dejanja ON DELETE in ON UPDATE zapišejo Shema SQL in cilji ORM generatorja kode ter katera meniji relacij označijo z `not in <database>` – glejte razdelka [ON DELETE in ON UPDATE](./relationship-editing.md#on-delete-and-on-update) in [Generator kode](./code-generator.md#database).  
Uvoz Sheme SQL ohrani podatkovni tip stolpca, vključno s seznamom argumentov, ne glede na to, ali ga urejevalnik navaja, na primer `TIMESTAMP WITH TIME ZONE`, `public.mood` ali `integer[]` – glejte razdelek [Podatkovni tipi](./file-import-export.md#data-types). Samodokončanje podatkovnega tipa predlaga samo tipe, ki jih navaja izbrana zbirka podatkov.

![Preklop zbirke podatkov na PostgreSQL, nato izbira tipa PostgreSQL v samodokončanju](/img/demo-database.webp)

![Samodokončanje podatkovnega tipa s približnim ujemanjem, premikanje po predlogih s puščičnimi tipkami in sprejem s tipko Right, Tab ali Enter](/img/demo-data-type-autocomplete.webp)

## Orodna vrstica platna {#canvas-toolbar}

Nad sredino spodnjega roba platna lebdi majhna orodna vrstica, ki od leve proti desni vsebuje orodja, ki delujejo na samo platno, in ukaze, ki mu dodajajo vsebino:

- Orodji Roka in Izbira. Privzeto je orodje Izbira; orodje Roka vsako vlečenje spremeni v premikanje pogleda, tako nad tabelami kot nad praznim prostorom. Tipka `Space` preklaplja med njima. Medtem ko je vklopljeno risanje [`New Table Group`](./table-groups.md#drawing-a-group), je namesto njiju označen gumb `New Table Group`, klik na katero koli od njiju, pritisk tipke `Space` ali izbira notacije relacije pa konča risanje, ne da bi se dodala skupina.
- `New Table`, `New Memo` in `New Table Group`. Gumb `New Table` doda tabelo tako kot `Alt + N`, gumb `New Memo` pa doda beležko tako kot `Alt + M`. Gumb `New Table Group` vklopi [risanje skupine](./table-groups.md#drawing-a-group) tako kot `Alt + G` in izklopi orodje Roka; drugi klik, tako kot drugi `Alt + G`, konča risanje, ne da bi se dodala skupina. Gumb `New Memo` je izpuščen, medtem ko View Option → `Memos` skriva beležke, gumb `New Table Group` pa, medtem ko View Option → `Table Groups` skriva skupine. Urejevalnik z lastnostjo `readonly` ne prikaže nobenega od teh treh gumbov.
- Povečava: `Zoom out`, trenutna povečava v odstotkih in `Zoom in`. Gumba spreminjata povečavo v korakih na enak način kot bližnjice za povečavo, klik na odstotek pa jo ponastavi na `100%`.
- Štiri notacije relacij, iste štiri, s katerimi začnete relacijo – glejte stran [Začetek urejanja](./editing-start.md). Izbira ene preklopi nazaj na orodje Izbira, saj relacijo narišete s klikom na dve tabeli.
- `Name View`, gumb s puščico navzdol, ki ima za napis trenutni prikaz: `Physical Names`, `Logical Names` ali `Both Names`. Ne glede na to, kateri prikaz navaja, ohrani enako širino, zato preklop nikoli ne premakne orodne vrstice. Klik odpre nad orodno vrstico seznam vseh treh, pri čemer je trenutni označen s kljukico. Izbira enega preklopi nanj in zapre seznam; drugi klik na gumb, pritisk kjer koli drugje ali tipka `Escape` zapre seznam brez preklopa. Prikaže ga tudi urejevalnik z lastnostjo `readonly`. Kaj izriše posamezni prikaz, je opisano v razdelku [Prikaz imen](./logical-names.md#name-view), ali se preklop shrani, pa v razdelku [Preklapljanje prikaza](./logical-names.md#switching-the-view).
- Način zen, `Alt + Z`, ki odstrani vse razen platna in te orodne vrstice. Ponovni `Alt + Z` ali gumb vrne vse ostalo. Odprt raziskovalec se skrije skupaj z ostalim, ne da bi se zaprl, in se vrne skupaj z njim. V načinu zen ga je še vedno mogoče odpreti – glejte razdelek [Ko se umakne](./explorer.md#when-it-stands-aside).
- Kompas `Go to content`, ki se pridruži koncu orodne vrstice samo, kadar na zaslonu ni nobene tabele, prikazane beležke ali prikazane skupine tabel – glejte razdelek [Premikanje po platnu](#getting-around-the-canvas).

Vsak gumb z bližnjico jo navede v svojem opisu orodja, na primer `New Table (Alt + N)` (Windows/Linux) ali `New Table (⌥ + N)` (Mac).  
Orodna vrstica se umakne, medtem ko je odprt predogled samodejne postavitve `Force`, okno Lastnosti tabele, potovanje skozi čas ali pregledovalnik razlik, in se vrne, ko se ta zapre.

![Dodajanje tabele in beležke iz orodne vrstice, vklop in izklop New Table Group, premikanje pogleda z orodjem Roka, spreminjanje povečave v korakih in preklop načina zen z ⌥ + Z](/img/demo-canvas-toolbar.webp)

## Povečava/pomanjšava {#zoom-inout}

Povečavo spreminjate z bližnjico `Ctrl + Wheel` (Windows/Linux) ali `⌘ + Wheel` (Mac). Kolesce miške brez tipke premika pogled po platnu.  
Povečavo spreminja tudi stisk prstov na sledilni ploščici, in sicer okoli točke, kjer stisnete prste, prav tako pa tudi dva prsta na zaslonu na dotik, ki ob premikanju tudi premikata pogled.  
Bližnjice: `Ctrl + Plus` (Windows/Linux) ali `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) ali `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) ali `⌘ + 0` (Mac) takoj ponastavi povečavo na `100%`, pri čemer sredina zaslona ostane na istem mestu.

Gumba `Zoom out` in `Zoom in` v [orodni vrstici platna](#canvas-toolbar) spreminjata povečavo v korakih tako kot bližnjici `Minus` in `Plus`: vsak pritisk jo spremeni za 4 odstotne točke, pri čemer sredina zaslona ostane na istem mestu. Odstotek med njima prikazuje trenutno povečavo, klik nanj pa jo takoj ponastavi na `100%`, tako kot `Ctrl + 0` (Windows/Linux) ali `⌘ + 0` (Mac).

Povečava sega od `10%` do `150%`.  
Pri `70%` in manj se tabele strnejo na ime in barvni rob, urejanje celic, bližnjice za celice ter kopiranje in lepljenje pa ne delujejo, dokler znova ne povečate pogleda. Ime, ki ga prikaže strnjena tabela, sledi prikazu imen – glejte razdelek [Prikaz imen](./logical-names.md#name-view).

Iste tri bližnjice spreminjajo povečavo tudi na zavihku Vizualizacija, tako v načinu `Graph` kot v načinu `Flow`, vsak način v svojem obsegu – glejte stran [Vizualizacija](./visualization.md#toolbar).

![Pomanjševanje s ⌘ + Wheel, dokler se tabele ne strnejo na ime, nato vračanje v korakih s ⌘ + Plus, ⌘ + Minus in ⌘ + 0](/img/demo-zoom.webp)

## Premikanje po platnu {#getting-around-the-canvas}

Platno nima robov in nima velikosti, ki bi jo bilo treba nastaviti. Tabele in beležke so tam, kamor jih postavite, vse spodaj pa opisuje diagram in ne fiksne strani.

Povlecite prazno območje platna, da premaknete pogled, ali s tipko `Space` preklopite na orodje Roka in vlecite kjer koli, tudi nad tabelo. Pogled premika tudi kolesce miške, `Shift + Wheel` pa ga premika vodoravno.  
Notranjost [skupine tabel](./table-groups.md#selecting-groups), območje pod njeno naslovno vrstico, za levi gumb šteje kot prazno platno: vlečenje premakne pogled, `Ctrl + drag` (Windows/Linux) ali `⌘ + drag` (Mac) nariše okvir izbora, klik pa počisti izbor.  
Premikanje pogleda nima meja: kolesce miške, vlečenje in orodje Roka premaknejo pogled tako daleč, kot ga premikate, tudi čez tabele na kateri koli strani.

Vlecite s srednjim gumbom miške (pritisnite kolesce), da premaknete pogled s katerega koli mesta na platnu, tako z orodjem Izbira kot z orodjem Roka. Deluje tudi, ko pritisk pade na tabelo, beležko, celico, ikono ali relacijo.  
Vlečenje s srednjim gumbom ničesar ne izbere, ne premakne in ne klikne ter ohrani izbor. Zapre odprt priročni meni in izbirnik barv, brskalnikovo lastno pomikanje in lepljenje s srednjim klikom pa se ne sprožita.  
Pritisk srednjega gumba na drsna trakova, mini zemljevid, orodno vrstico platna ali v odprto urejanje celice ali beležke ne premakne pogleda.

Mini zemljevid v zgornjem desnem kotu prikazuje diagram s prostorom velikosti zaslona na vsaki strani, kar je doseg drsnih trakov, pri čemer se to območje zaokroži navzven na grobo mrežo, zato je diagram v njem tem manjši, čim bolj pomanjšate pogled. Kliknite nanj, da pogled premaknete na tisto točko, ali povlecite pravokotnik vidnega območja, da premikate pogled. Ko pomanjšujete pogled, pravokotnik vidnega območja raste in pokriva večji del zemljevida.  
Vsako tabelo nariše v barvi tabele, vsako prikazano skupino tabel pa kot okvir v barvi skupine za njenimi tabelami.  
Drsna trakova ob desnem in spodnjem robu opisujeta enak razpon premikanja, ki sega od položaja, ko je diagram tik zunaj ene strani zaslona, do položaja, ko je tik zunaj druge, zato je vsaj za en zaslon daljši od narisanega diagrama in še daljši, kadar je pogled onkraj njega. Zunaj načina zen se oba drsna trakova prikažeta vedno, ko dokument vsebuje tabelo, prikazano beležko ali prikazano skupino tabel, tudi če je vse to v celoti na zaslonu. Dokument brez vsega tega, na primer dokument, katerega edine beležke so skrite z View Option → `Memos`, ne prikaže nobenega od njiju in tudi ne mini zemljevida.  
Vlečenje drsnika drsnega traku ali pravokotnika vidnega območja na mini zemljevidu je edino premikanje pogleda, ki se ustavi: ne seže dlje od tabel tik zunaj zaslona ali dlje od mesta, kjer se je vlečenje začelo, če je bilo to še bolj zunaj.

Če po premikanju pogleda na zaslonu ne ostane nobena tabela, prikazana beležka ali prikazana skupina tabel, se na konec [orodne vrstice platna](#canvas-toolbar) doda kompas `Go to content` s puščico, ki kaže proti najbližjemu elementu, in z njegovo oddaljenostjo. Kliknite nanj, da ta element usredinite, ne da bi spremenili povečavo.

![Premikanje pogleda z vlečenjem praznega platna, s kolescem miške, z vlečenjem s srednjim gumbom nad tabelo in z mini zemljevidom, nato Shift + wheel mimo vsebine in vrnitev s kompasom Go to content](/img/demo-canvas-navigation.webp)

### Kam pripelje skok {#where-a-jump-lands}

Vsak prehod, ki vas pripelje do nečesa na platnu, premakne pogled po istem pravilu: rezultati `#`, `@` in `:` [hitrega iskanja](./quick-search.md#searching-the-diagram), vrstice [raziskovalca](./explorer.md#going-to-a-row) in zadetki njegovega [iskanja in zamenjave](./find-and-replace.md#going-to-a-match), vrstice seznama [pregledovalnika razlik](#going-to-a-change), [gumb na kartici](./visualization.md#card-buttons) za zunanjo povezavo v načinu Tok, preverjanje na [listu Preverjanja](./dictionary.md#the-checks-sheet) zavihka Slovar, ki navaja tabelo ali stolpec, in pristanek ukaza [Uvozi in dodaj](./file-import-export.md#import-and-add). Vsak od teh razdelkov pove, kaj prehod izbere; ta pove, kam se premakne pogled.

Skok nikoli ne spremeni povečave in naredi največ en pomik. Iz drugega zavihka najprej preklopi na zavihek ERD.  
Platno meri tako, kot je prikazano: pod zgornjo orodno vrstico ali po celotni višini v načinu zen ter desno od odprtega raziskovalca, ki platno zoži, namesto da bi ga prekril.

Vodoravna in navpična smer se presojata ločeno, smer, v kateri je cilj že dobro viden, pa ostane natanko takšna, kot je:

- Cilj, ki v tej smeri ni daljši od polovice platna, ostane na mestu, dokler njegova sredina leži v srednji polovici platna, med četrtino in tremi četrtinami širine oziroma višine. Sicer se njegova sredina premakne na sredino platna.
- Daljši cilj, ki se še prilega z rezervo `40px` na vsakem koncu, ostane na mestu, dokler je v celoti viden. Sicer se vodoravno usredini, navpično pa se njegov vrh premakne `40px` pod vrh platna.
- Cilj, ki je še daljši, ostane na mestu, dokler je v celoti viden ali, kadar je daljši od platna, dokler je viden njegov ključni del, naveden spodaj. V nasprotnem primeru se usredini, če se prilega, sicer pa se postavi čim bližje sredini, tako da sta oba konca njegovega ključnega dela vsaj `40px` znotraj platna; pri ključnem delu, ki je za to predolg, ostane njegov začetek `40px` znotraj.

Majhna tabela blizu levega roba platna, na polovici višine, se zato premakne samo vodoravno.

Kaj skok prikaže in kateri ključni del mora biti viden, kadar se celota ne prilega:

- Tabela: celotna tabela, ključni del pa je pas z imenom na vrhu ali, pri zadetku v komentarju tabele, celica komentarja, medtem ko View Option → `Table Comment` prikazuje komentarje. Pri `70%` in manj, kjer se tabele strnejo na ime, je ključni del ime na sredini okvirja.
- Stolpec: njegova vrstica, ključni del pa je celica, na katero skok pripelje: njegovo ime, njegovo logično ime pri zadetku v logičnem imenu ali preverjanju logičnega imena, njegova celica domene pri preverjanju njegove domene ali komentar, v katerem je zadetek, medtem ko View Option → `Column Comment` prikazuje komentarje. Kjer vrstica take celice ne izriše, skok pripelje do celice, izrisane na njenem mestu: do logičnega imena namesto fizičnega imena v prikazu `Logical Names`, do fizičnega imena namesto logičnega imena v prikazu `Physical Names` in do celice tipa namesto celice domene, medtem ko je možnost View Option → `Domain` izklopljena, oziroma do vrstice kot celote, kadar je izklopljena tudi možnost `DataType`. Pri `70%` in manj stolpec prikaže svojo tabelo po pravilu za tabele.
- Celica, preširoka, da bi bila vidna v celoti, na primer dolg komentar: ključni del je besedilo zadetka v njej. Skok na celico, izrisano namesto tiste, v kateri je zadetek, na primer na fizično ime pri zadetku v logičnem imenu v prikazu `Physical Names`, se ne ravna po besedilu.
- Relacija: okvir, ki obsega njeni dve tabeli, ključni del pa je podrejena tabela.
- Skupina tabel: njen okvir, ključni del pa je naslovna vrstica.
- Beležka ali blok, ki ga postavi ukaz Uvozi in dodaj: v celoti.

Kadar se pogled ne bi premaknil v nobeni smeri, pomika ni, zato drugi zaporedni prehod na isto mesto ne premakne ničesar. Skok, ki pomakne platno, zabeleži pomik v [zgodovino razveljavitev](./undo-redo.md#what-the-history-records) tako kot vsako drugo spremembo položaja pogleda, skok, ki ne premakne ničesar, pa ne pusti ničesar za razveljavitev. Pri ukazu Uvozi in dodaj je pomik del istega koraka kot dodajanje. Vrstica seznama pregledovalnika razlik premakne samo strani pregledovalnika, ki sta samo za branje, zato ne zabeleži ničesar.  
Noben skok ne začne ali konča risanja relacije. Kompas `Go to content` ni skok: usredini tisto, na kar kaže.

## Pregledovalnik razlik {#diff-viewer}

Prej shranjene dokumente lahko primerjate s trenutnim dokumentom.  
V priročnem meniju platna izberite `Diff Viewer` in nato dokument `.json`, ki ste ga prej izvozili.

Pogled se odpre čez platno: na levi to, kar se je spremenilo, nato pa shranjeni in trenutni dokument drug ob drugem.  
Trenutni dokument se primerja v stanju ob odprtju pogleda; spremembe, narejene pozneje, vključno s spremembami sodelavca, se v pogledu ne pokažejo. Obe strani se odpreta in ostaneta v prikazu imen, ki ga gledate, ne glede na to, kateri prikaz hrani katera koli od obeh datotek – glejte razdelek [Zunaj platna](./logical-names.md#beyond-the-canvas). Odprt [raziskovalec](./explorer.md#when-it-stands-aside) se skrije, medtem ko je pogled odprt, zato pogled zavzame celotno širino urejevalnika.  
Pogled na vsaki strani premikate s kolescem miške, z vlečenjem praznega območja ali notranjosti skupine tabel ali z vlečenjem s srednjim gumbom kjer koli nad njo, povečavo pa spreminjate z bližnjico `Ctrl + Wheel` (Windows/Linux), `⌘ + Wheel` (Mac) ali s stiskom prstov. Pri `70%` in manj se njene tabele strnejo tako kot na platnu – glejte razdelek [Oznake na obeh straneh](#marks-on-the-two-sides).  
Obe strani sta samo za branje, zato se v vašem dokumentu nič ne spremeni. Vsaka ima svoj izbor, klik na tabelo na njej pa jo izbere samo na tej strani.  
Pogled zaprete z gumbom `Close` v obvestilu `Diff Viewer`, ki se prikaže ob njegovem odprtju, ali s tipko `Escape`.

![Odpiranje pregledovalnika razlik za shranjeno datoteko .json, klikanje vrstic z oznakami A, M, D in R v njegovem drevesu, filtriranje po imenu in zapiranje](/img/demo-diff-viewer.webp)

### Kaj se primerja {#what-is-compared}

Primerjajo se tabele, stolpci, indeksi, tuji ključi, beležke in skupine tabel.  
Vsak element se najprej poveže v par po identifikatorju, zato je pri primerjavi s starejšo različico iste datoteke, ki ohrani identifikatorje, preimenovana tabela, stolpec, indeks ali skupina tabel še vedno en element, naveden kot preimenovan.  
Preostali elementi se povežejo v pare ena na ena po tem, kar ohranijo: tabela ali skupina tabel po imenu, vključno z velikostjo črk; stolpec ali indeks po svoji tabeli in imenu; tuji ključ po svojih dveh tabelah in parih stolpcev; beležka pa po besedilu, nato po položaju. Indeks brez imena se poveže po stolpcih, njihovem vrstnem redu in smeri ter po tem, ali je enoličen, skupina tabel brez imena pa po največjem številu skupnih tabel.  
Pri primerjavi z datoteko od drugod, na primer z diagramom, ponovno zgrajenim z uvozom SQL, se zato preimenovana tabela prikaže kot ena odstranjena in ena dodana.

Kaj šteje kot sprememba:

- Tabela: ime, komentar, skupina tabel, položaj in barva.
- Stolpec: ime, komentar, podatkovni tip, privzeta vrednost, Samodejno povečevanje, primarni ključ, Enolično, Ni NULL in mesto v tabeli. Kot premaknjeni štejejo samo stolpci zunaj vrstnega reda, ki je skupen obema dokumentoma, zato dodajanje, odstranitev ali premik enega stolpca ne označi drugih.
- Indeks: ime, UNIQUE in stolpci, z njihovim vrstnim redom in smerjo.
- Tuji ključ: pari stolpcev, vrsta relacije ter dejanji ON DELETE in ON UPDATE.
- Beležka: besedilo, položaj, velikost in barva.
- Skupina tabel: ime, tabele, ki jih vsebuje, barva, položaj in velikost.

Zato kot spremenjena šteje tabela, beležka ali skupina, ki se je samo premaknila ali ki se ji je spremenila samo velikost ali barva. Položaji in velikosti se primerjajo v celih slikovnih pikah, vrstni red prekrivanja in mesto, kjer se povezovalna črta stika s tabelo, pa ne štejeta nikoli.  
Logična imena, povezave z domeno ter besede, izrazi in domene na zavihku [Slovar](./dictionary.md) se ne primerjajo, zato sprememba samo teh ni niti navedena niti označena. Podatkovni tip, ki ga je spremenila domena, pa šteje, in sicer kot sprememba podatkovnega tipa stolpca.

### Drevo sprememb {#the-change-tree}

Seznam na levi je prikazan kot [drevo raziskovalca](./explorer.md#the-tree) in vsebuje samo tisto, kar se je spremenilo: `Tables`, `Table Groups` in `Memos`, vsaka od teh map je prikazana le, če vsebuje vrstico, pod tabelo pa njene lastne `Columns`, `Indexes` in `Foreign Keys`. Tuji ključ je naveden pod svojo podrejeno tabelo, dodana ali odstranjena tabela pa v sebi ne navaja ničesar.  
Vsaka mapa prikazuje, koliko vrstic vsebuje, vse mape in tabele pa so na začetku razširjene.  
Vrstica tabele ali stolpca je poimenovana v prikazu imen, v katerem sta se odprli strani. V prikazu `Both Names` prikazuje logično ime, za njim pa bledo fizično ime, v odstranjeni vrstici pa je bledo ime prečrtano skupaj z ostalim. Tabele in skupine tabel so razvrščene po imenu, ne glede na velikost črk in ne glede na prikaz. Beležke ter stolpci, indeksi in tuji ključi tabele ohranijo vrstni red trenutnega dokumenta, odstranjeni element pa se vrne na mesto, kjer je bil. Vrstica beležke prikazuje prvo vrstico besedila beležke, vrstica tujega ključa pa njegove stolpce v podrejeni tabeli, nato `→` z nadrejeno tabelo in njenimi stolpci, na primer `user_id → users(id)`. Namesto praznega imena je ležeče zapisano `unnamed`.

Vsaka vrstica se konča s črko, vrstica z oznako `A`, `D`, `M` ali `R` pa ima ime v barvi te črke:

- `A`, dodano, v zeleni barvi: samo v trenutnem dokumentu.
- `D`, izbrisano, v rdeči barvi in prečrtano: samo v shranjenem dokumentu.
- `M`, spremenjeno, v jantarni barvi: v obeh, spremenjeno.
- `R`, preimenovano, v modri barvi: v obeh, z novim imenom. Preimenovanje ima prednost pred vsemi drugimi spremembami, ki jih opis orodja še vedno navaja.
- `~`, v jantarni barvi, je na koncu vsake mape in vsake tabele, navedene samo zaradi sprememb v njej; njihova imena ohranijo običajno barvo.

Premaknite kazalec nad ime vrstice, da se prikaže njen opis orodja: stanje, `Added`, `Deleted`, `Modified`, `Renamed` ali `Changed inside`, nato po ena vrstica za vsako spremembo, na primer `Name: users → members` ali `NN: ✗ → ✓`. Besedilo se navede s prvo vrstico, odrezano po 40 znakih, prazna vrednost pa je prikazana kot `—`. Opis orodja dodanega ali odstranjenega elementa vsebuje samo stanje.

Polje `Filter by name` nad drevesom ohrani vrstice, katerih trenutno ali shranjeno ime ali trenutno ali shranjeno logično ime vsebuje, kar vtipkate, ne glede na velikost črk in v vsakem prikazu imen. Tabela, katere ime se ujema, ohrani vse svoje vrstice, tabela, katere ime se ne ujema, pa ostane le z vrsticami, ki se ujemajo. Filter, ki se ne ujema z ničimer, pusti drevo prazno.  
Kadar se dokumenta sploh ne razlikujeta, drevo prikaže `No changes`.

Povlecite desni rob drevesa, da ga razširite ali zožite, od `200px` do `480px`, in dvokliknite rob, da ga ponastavite na `260px`. Vsaka primerjava se odpre pri `260px`, obe strani pa si preostanek širine razdelita enakomerno.  
Po drevesu se s tipkovnico premikate tako kot po drevesu raziskovalca – glejte razdelek [Tipke v raziskovalcu](./explorer.md#keys-in-the-explorer) –, vendar tu tipka `Escape` v drevesu ali v polju `Filter by name` zapre pogled.

### Prehod na spremembo {#going-to-a-change}

Kliknite vrstico ali pritisnite `Enter` ali `Space`, ko je fokus tipkovnice na njej, da preidete na njen element na vsaki strani, ki ga vsebuje: na dodani element samo na trenutni strani, na odstranjenega samo na shranjeni strani in na vse, kar vsebujeta obe, na obeh straneh. Vrstica mape mapo samo strne ali razširi, enako pa velja za puščico na začetku vrstice tabele.

- Vrstica tabele, stolpca ali indeksa izbere samo tabelo.
- Vrstica tujega ključa prikaže njegovi dve tabeli ali podrejeno tabelo, kadar sta tabeli preveč narazen, da bi bili vidni skupaj, izbere podrejeno tabelo s stolpci tujega ključa in osvetli povezovalno črto – glejte razdelek [Branje povezovalne črte](./relationship-editing.md#reading-a-connector).
- Vrstica beležke izbere beležko, vrstica skupine tabel pa skupino. Pri beležki ali skupini, ki jo dokument neke strani skriva, prehod na tej strani ne vodi nikamor.

Vsaka stran se premakne po pravilu iz razdelka [Kam pripelje skok](#where-a-jump-lands), pri čemer se meri na tej strani, zato ponovni klik iste vrstice ne premakne ničesar.

### Oznake na obeh straneh {#marks-on-the-two-sides}

Obe strani obarvata besedilo, obrobe in povezovalne črte, ničesar pa ne zapolnita z barvo. Dodano je zeleno in se prikaže samo na trenutni strani, odstranjeno je rdeče in se prikaže samo na shranjeni strani, spremenjeno v jantarni barvi in preimenovano v modri barvi pa se prikažeta na obeh straneh. Vse nespremenjeno se nariše kot običajno.

- Dodana ali odstranjena tabela ali skupina tabel dobi obrobo v ustrezni barvi, njeno ime pa se obarva enako. Dodana ali odstranjena beležka dobi obrobo.
- Stolpec, ki je dodan ali odstranjen v tabeli, ki jo vsebujeta oba dokumenta, obarva celotno svojo vrstico, premaknjen stolpec pa obarva celotno svojo vrstico v jantarno barvo. Nič znotraj dodane ali odstranjene tabele ni označeno posebej.
- Besedilo spremenjene celice se obarva jantarno: komentar tabele, pri stolpcu komentar, podatkovni tip, privzeta vrednost, Samodejno povečevanje, Enolično ali Ni NULL, pri beležki pa besedilo. Sprememba primarnega ključa obarva ikono ključa stolpca jantarno.
- Preimenovana tabela, stolpec ali skupina tabel ima ime v modri barvi.
- Tabela, beležka ali skupina tabel s spremembo, ki nima svoje celice, na primer s premikom, novo velikostjo ali barvo ali spremembo skupine ali tabel skupine, dobi jantarno obrobo.
- Dodan, odstranjen ali spremenjen tuji ključ nariše svojo povezovalno črto v ustrezni barvi. Ko je kazalec nad njo ali ko jo osvetli vrstica, se namesto tega nariše v običajni barvi ob lebdenju.
- Sprememba indeksa ne označi ničesar na nobeni strani; vidna je samo v drevesu.

Vsaka stran upošteva možnosti pogleda svojega dokumenta. Sprememba v celici, ki je ta stran ne nariše, se namesto tega pokaže na imenu. Sprememba stolpca v celici, ki jo skrije možnost pogleda, na primer `Unique` ali `Auto Increment`, ki sta obe privzeto izklopljeni, obarva ime stolpca jantarno, enako pa stori sprememba primarnega ključa v vrstici, ki ne prikazuje ikone ključa. Sprememba komentarja tabele, medtem ko je možnost `Table Comment` izklopljena, obarva ime tabele jantarno. Modra barva preimenovanja ima prednost pred to jantarno. Beležka ali skupina tabel, ki jo njen dokument skriva, je navedena v drevesu, na tej strani pa ni narisana.

V prikazu `Logical Names`, ki ne izriše celice imena, gresta modra barva preimenovanja in jantarna barva spremembe v celici, ki je stran ne izriše, na logično ime, izrisano na mestu imena. Sprememba podatkovnega tipa obarva celico tipa jantarno v vsakem prikazu imen, tudi kjer celica prikazuje ime domene. Nobena stran ne izriše barv, ki jih preverjanja zavihka Slovar dajo imenom na platnu – glejte razdelek [Oznake na platnu](./dictionary.md#marks-on-the-canvas).

Pri `70%` in manj strnjene tabele ohranijo obrobo. Ime ohrani zeleno ali rdečo barvo dodane ali odstranjene tabele ali modro barvo preimenovanja, sicer pa prevzame jantarno barvo spremembe komentarja. Spremembe stolpcev se ne narišejo, dokler znova ne povečate pogleda; drevo jih še vedno navaja.
