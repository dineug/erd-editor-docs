---
sidebar_position: 14
description: Hranjenje domen, besed in izrazov diagrama na zavihku Slovar, izpeljava fizičnih imen iz logičnih imen, določanje podatkovnega tipa stolpcev prek domene, pregled tega, kar najde list Preverjanja, urejanje in razvrščanje listov kot v preglednici ter njihov uvoz in izvoz kot datotek CSV.
---

# Slovar

Zavihek Slovar hrani standard poimenovanja diagrama v treh slovarjih, od katerih je vsak na svojem listu, ki ga urejate kot preglednico:

- `Domains`: podatkovni tipi z imenom, na primer `Name` za `VARCHAR(100)`. Stolpec, povezan z domeno, ima njen podatkovni tip.
- `Words`: standardne besede, iz katerih so sestavljena logična imena, vsaka z okrajšavo, ki jo zanjo uporablja fizično ime, na primer `Customer` in `CUST`.
- `Terms`: cela logična imena, vsako s fizičnim imenom in domeno, ki ju določa, na primer `Customer Name` s `CUST_NM`.

[Logično ime](./logical-names.md) tabele ali stolpca iz teh slovarjev izpelje fizično ime, izraz stolpca pa lahko stolpec poveže tudi z domeno – glejte razdelek [Izpeljava fizičnih imen](#deriving-physical-names).  
Četrti list, `Checks`, navaja, kaj slovarji najdejo narobe v imenih in tipih diagrama ter v samih slovarjih, na primer prepovedano besedo v logičnem imenu – glejte razdelek [List Preverjanja](#the-checks-sheet).

## Odpiranje zavihka {#opening-the-tab}

V orodni vrstici preklopite na zavihek `Dictionary`, gumb z ikono knjige med `Code Generator` in `Settings`, ali pa v [hitrem iskanju](./quick-search.md) v podmeniju `Tab` izberite `Dictionary`.  
Lahko je tudi zavihek, na katerem se diagram odpre – glejte nastavitev `Canvas Type` v razdelku [Zaklepanje](./settings.md#lock).

Zavihek se odpre na listu `Domains`, dokler ne izberete drugega.  
Ob vsakem odprtju se list vrne z izborom in položajem pomika, ki ste ju pustili, ob prvem obisku pa z izbrano prvo celico. Njegova mreža prevzame tipkovnico, zato tipkanje ali puščične tipke delujejo takoj.

Prikazani list ter iskanje, izbor, položaj pomika in širine stolpcev vsakega lista so samo vaši.  
Nič od tega se ne shrani v datoteko, ne zabeleži v zgodovino razveljavitev in ne deli s sodelavci. Ohrani se, dokler je urejevalnik odprt, tudi ob preklopih med zavihki in med dokumenti, naloženimi v isti urejevalnik.

## Listi {#the-sheets}

Zgornji pas vsebuje štiri gumbe listov, `Domains`, `Words`, `Terms` in `Checks`, gumb prikazanega lista pa je videti pritisnjen. Vsak ob svojem imenu prikazuje število: koliko vrstic ima njegov list, ne glede na to, kaj prikazuje iskanje, na gumbu `Checks` pa število preverjanj, obarvano glede na njihovo raven – glejte razdelek [List Preverjanja](#the-checks-sheet).  
Sledi iskalno polje – glejte razdelek [Iskanje](#searching). Na koncu pasu so na listih `Domains`, `Words` in `Terms`, ne pa v urejevalniku samo za branje, štiri orodja: `Add Row`, `Delete Rows`, `Import CSV` in `Export CSV` – glejte razdelka [Dodajanje in brisanje vrstic](#adding-and-deleting-rows) in [Uvoz in izvoz CSV](#importing-and-exporting-csv).  
V ozkem podoknu ali pri jeziku prikaza z dolgimi napisi se pas prelomi v več vrstic, tako da ostane vsak gumb dosegljiv.

Pod mrežo vrstica stanja šteje vrstice, ki jih pusti iskanje, na primer `4 rows`, in, dokler izbor zajema katero koli vrstico, koliko vrstic zajema, na primer `1 selected`. Vrstica, ki si jo delita dva obsega, se šteje enkrat, zato to število pove, koliko vrstic bi odstranil gumb `Delete Rows`.  
Številke vrstic ob levem robu štejejo vrstice od 1, tako kot jih prikazuje list. Celica samo za branje, kar je vsaka celica na listu `Checks` in vsaka celica v urejevalniku samo za branje, je izrisana na sivem ozadju, razen kjer jo označi preverjanje.  
Prazen list `Domains`, `Words` ali `Terms` prikazuje besedilo `Import a CSV file or add a row`, razen v urejevalniku samo za branje.

Stolpci posameznega lista po vrsti:

| List | Stolpci |
| --- | --- |
| `Domains` | `Domain`, `Category`, `Data Type`, `Description` |
| `Words` | `Word`, `Abbreviation`, `English Name`, `Description`, `Synonyms`, `Forbidden Words` |
| `Terms` | `Term`, `Physical Name`, `Domain`, `Description`, `Synonyms` |
| `Checks` | `Type`, `Target`, `Detail` |

Kaj pomenijo celice:

- Celica `Data Type` domene vsebuje tip stolpca, na primer `VARCHAR(100)` ali `NUMERIC(15,2)`, ta tip pa ima vsak stolpec, povezan z domeno – glejte razdelek [Domene in podatkovni tipi](#domains-and-data-types).
- Celica `Abbreviation` besede vsebuje zapis, ki ga fizično ime uporabi za to besedo – glejte razdelek [Iz besed](#from-the-words).
- Celici `Synonyms` in `Forbidden Words` besede navajata druge besede za isti pojem, ločene z vejicami. Vsakemu vnosu se odstranijo presledki na začetku in koncu, prazen vnos se izpusti, vnos, enak sami besedi, pa se prezre. Logično ime, ki uporablja katero od teh besed, ne sestavi fizičnega imena, list `Checks` pa ga označi in navede besedo, ki jo je treba uporabiti namesto nje – glejte razdelek [Kaj najde posamezno preverjanje](#what-each-check-finds).
- Celica `Term` izraza je celo logično ime, celica `Physical Name` pa ime, ki ga določi to logično ime – glejte razdelek [Iz izraza](#from-a-term).
- Celica `Domain` izraza prikazuje ime domene, s katero je izraz povezan, in je prazna, dokler izraz ni povezan z nobeno domeno ali je povezan z domeno, ki je bila medtem odstranjena – glejte razdelek [Domena izraza](#a-terms-domain).
- Celici `Category` in `English Name`, vse celice `Description` in celica `Synonyms` izraza so opombe. Ničesar ne spremenijo in jih ne bere nobeno preverjanje.

V [jeziku prikaza, ki se piše od desne proti levi](./language-and-theme.md#right-to-left-languages), so zgornji pas, meni mreže in vrstica stanja zrcaljeni, listi in seznam domen izraza pa ostanejo od leve proti desni.

## Izpeljava fizičnih imen {#deriving-physical-names}

Slovarji lahko tabeli ali stolpcu iz logičnega imena določijo fizično ime, torej ime, ki ga zapišeta Shema SQL in generator kode. Najprej se poišče izraz, katerega vrednost `Term` je to logično ime, sicer pa se ime sestavi iz okrajšav besed.  
Na primer z besedami `Customer` (`CUST`), `Name` (`NM`), `Number` (`NO`), `Order` (`ORD`) in `Date` (`DT`) ter izrazom `Customer Number` s fizičnim imenom `CUST_NO` in domeno `Number`, katere podatkovni tip je `INT`:

- Logično ime `Customer Number` stolpec poimenuje `CUST_NO`, ga poveže z domeno `Number` in mu da tip `INT`.
- Logično ime `Order Date` sestavi `ORD_DT`.
- Tabela z logičnim imenom `Customer` dobi ime `CUST`.

Ko sta lista `Words` in `Terms` prazna, se ne izpelje nič.

### Kdaj se ime izpelje {#when-a-name-is-derived}

Fizično ime se izpelje, ko se zapiše logično ime:

- Na platnu, ko se urejanje celice logičnega imena zapre z drugačnim logičnim imenom, kot je bilo ob odprtju, in sicer s tipko `Enter`, `Tab` ali `Escape` ali s klikom drugam. Vsak pritisk tipke med tipkanjem zapiše samo logično ime – glejte razdelek [Vnos logičnega imena](./logical-names.md#writing-a-logical-name).
- Takoj, ko izberete izraz s seznama pod celico – glejte razdelek [Samodokončanje imen izrazov](./logical-names.md#completing-term-names).
- Ko lepljenje zapiše celico logičnega imena – glejte razdelek [Kopiranje/lepljenje stolpcev](./table-editing.md#copyingpasting-columns).
- Ko [iskanje in zamenjava](./find-and-replace.md#replacing) zamenja logično ime, bodisi pri enem zadetku bodisi pri vseh.
- Ko agent za kodiranje nastavi logično ime.

Izpelje se le, dokler je fizično ime prazno ali je bilo tudi samo izpeljano – glejte razdelek [Vaša imena](#names-of-your-own).  
Izbira izraza, lepljenje ali zamenjava zapiše logično ime in to, kar se iz njega izpelje, kot en korak razveljavitve. Na platnu je ime, izpeljano ob zaprtju urejanja, samostojen korak razveljavitve, ki sledi tipkanju: prva razveljavitev prekliče izpeljano ime skupaj z domeno in tipom, ki ju je prinesel izraz, logično ime, ki ste ga vnesli, pa ohrani.

Pozneje se nič ne izpelje znova samo od sebe. Nova vrednost `Abbreviation` besede, nova vrednost `Physical Name` ali `Domain` izraza ter nove besede ali izrazi pustijo že izpeljana imena nespremenjena; za to uporabite ukaz [Znova izpelji fizična imena](#derive-physical-names-again). Izjema je vrednost `Data Type` domene: ta takoj doseže njene stolpce.

### Iz izraza {#from-a-term}

Na listu `Terms` se najprej poišče izraz, katerega vrednost `Term` je enaka logičnemu imenu. Presledki na začetku in koncu ter normalizacijska oblika Unicode se ne upoštevajo, velikost črk pa se upošteva, zato se `customer number` ne ujema s `Customer Number`. Od dveh izrazov z enakim imenom velja tisti, ki je na listu prvi.

- Izraz da svojo vrednost `Physical Name` ali, dokler je ta prazna, ime, ki ga sestavijo njegove besede, kot je opisano spodaj, če ga sestavijo.
- Izraz stolpec poveže tudi z domeno iz svoje celice `Domain`, dokler jo list `Domains` navaja, s čimer stolpec dobi podatkovni tip domene – glejte razdelek [Povezovanje stolpca z domeno](#linking-a-column). To stori tudi, ko izraz ne da nobenega imena. Izraz brez domene ne prekine nobene povezave z domeno.
- Tabela prevzame le fizično ime izraza.

### Iz besed {#from-the-words}

Če ni ujemajočega se izraza, ime sestavijo besede:

1. Logično ime se razdeli pri presledkih ter znakih `_`, `-`, `·` in `/`, nobena beseda pa ne sega čez mesto delitve.
2. Vsak kos se bere od leve, pri čemer se na vsakem mestu vzame najdaljše besedilo, ki ga navaja list `Words`, bodisi kot vrednost `Word`, sopomenko ali prepovedano besedo, in se nikoli ne vrača nazaj. Z besedami `가입`, `가입일` in `일자` se `가입일자` prebere kot `가입일` in `자`, pri čemer `자` ostane neregistriran, `가입 일자` pa kot `가입` in `일자`. Velikost črk se upošteva: `member` ni beseda `Member`.
3. Fizično ime so vrednosti `Abbreviation` posameznih besed, kot so vnesene, združene z znakom `_`, na primer `ORD_DT`. Od dveh besed z enakim imenom okrajšavo da tista, ki je na listu prva. Omejitve dolžine ni, nastavitvi `Table Name Case` in `Column Name Case` generatorja kode pa pri tem nimata nobene vloge.

Velja vse ali nič. Če je kateri koli odsek sopomenka, prepovedana beseda ali besedilo, ki ga ne navaja nobena beseda, ali če ima beseda prazno vrednost `Abbreviation`, se ime ne sestavi in fizično ime ostane nespremenjeno.

### Vaša imena {#names-of-your-own}

Slovarji izpolnijo fizično ime le, dokler je prazno ali so ga izpolnili že sami. Urejevalnik si to zapomni za vsako tabelo in vsak stolpec, čeprav tega na platnu nič ne prikazuje.

- Ime, ki ga vnesete, postane vaše: tipkanje v celico imena, zamenjava imena tabele ali stolpca z iskanjem in zamenjavo, lepljenje čez celico imena stolpca in preimenovanje, ki ga izvede agent za kodiranje. Pozneje zapisano logično ime ga pusti nespremenjenega, zapiše samo logično ime in stolpca ne poveže z nobeno domeno.
- Brisanje imena vrne ime v upravljanje slovarjem, saj se prazno ime vedno izpelje.
- Logično ime, ki ne izpelje ničesar, pusti fizično ime in njegovo stanje, kakršna sta bila: prazno ime ostane prazno, izpeljano ime pa ostane, kakršno je, in ga še naprej upravljajo slovarji.
- Nova tabela ali nov stolpec začne s praznim imenom, zato ime izpelje že prvo logično ime. Stolpec tujega ključa, ki ga doda relacija, dobi ime po svojem ključu, to ime pa šteje za vaše – glejte razdelek [Imena stolpcev tujega ključa](./relationship-editing.md#foreign-key-column-names).
- Imena, ki jih ukaz `Import` ali `Import and Add` prinese iz Sheme SQL, GraphQL, DBML ali AML, in imena diagrama, ustvarjenega z izdajo, ki še nima zavihka Slovar, štejejo za vaša, zato logično ime, ki ga zanje pozneje zapišete, ne izpelje ničesar.
- [Podvojena tabela](./table-related-functions.md#duplicating-tables-and-memos), stolpec, ki ga z ročico za vlečenje [premaknete v drugo tabelo](./table-editing.md#rearranging-and-moving-columns), lepljenje kopiranih tabel in ukaz `Import and Add` z datoteko JSON ohranijo stanje vsakega imena. Stolpci, prilepljeni v izbrane tabele kot novi stolpci, štejejo za vaše, razen če je prilepljeno ime prazno in ga izpelje njihovo logično ime.
- Ukaz [Znova izpelji fizična imena](#derive-physical-names-again) vrne vaše ime v upravljanje slovarjem, tudi uvoženo.

### Dva stolpca, eno ime {#two-columns-one-name}

Stolpec ne izpelje ničesar, če ima ime, ki bi ga izpeljal, že drug stolpec iste tabele. Ohrani svoje ime, stanje in povezavo z domeno, zapiše se le njegovo logično ime. Imena se primerjajo ne glede na velikost črk in presledke na začetku in koncu, tako kot imena stolpcev tujega ključa.  
Če bi ena sprememba dvema stolpcema dala enako ime, kar se lahko zgodi z ukazom `Replace All` ali `Derive Physical Names Again` na tabeli, ga dobi prvi stolpec v tabeli.  
Na primer, rekurzivna relacija na tabeli `members` s ključem `MBR_NO` doda stolpec `MBR_NO_2`, ki prevzame logično ime `Member Number`. Ukaz `Derive Physical Names Again` bi ga poimenoval `MBR_NO`, to ime pa že ima ključ, zato stolpec ohrani ime `MBR_NO_2`.  
Za tabele takega pravila ni: dve tabeli lahko izpeljeta enako ime.

## Znova izpelji fizična imena {#derive-physical-names-again}

Ukaz `Derive Physical Names Again` uporabite, ko spremenite vrednost `Abbreviation` besede ali vrednost `Physical Name` ali `Domain` izraza, saj te spremembe same po sebi ničesar ne preimenujejo. Imena, ki jih zajame, vrne v upravljanje slovarjem in jih znova izpelje po zgornjih pravilih, vključno z imeni, ki ste jih vnesli sami. Na voljo je samo na zavihku ERD, v urejevalniku samo za branje pa ne:

- Priročni meni tabele, takoj za postavko `Focus on this table` ali `Focus on selected tables`. Ko je tabela ena od dveh ali več izbranih tabel, postavka `Derive Physical Names Again` zajame vse, ne glede na to, kje na tabeli kliknete z desno tipko miške. Sicer desni klik na vrstico stolpca ponudi postavko `Derive Physical Name Again` samo za ta stolpec, desni klik na glavo tabele pa postavko `Derive Physical Names Again` za ime tabele in vse stolpce.
- Priročni meni platna, takoj za postavko `Name View`: postavka `Derive Physical Names Again` za vse tabele in stolpce v diagramu. Izpuščena je, dokler diagram nima nobene tabele.
- [Hitro iskanje](./quick-search.md#what-the-palette-lists), kot postavke za stolpec s fokusom, tabelo s fokusom, izbrane tabele in celoten diagram.

![Sprememba okrajšave besede Number iz NO v NUM na listu Words, pri čemer fizični imeni na diagramu ostaneta MBR_NO in PAY_NO, nato ukaz Derive Physical Names Again v meniju platna, ki ju spremeni v MBR_NUM in PAY_NUM, medtem ko ORD_NO, ki ga določa njegov izraz, ostane](/img/demo-derive-physical-names.webp)

Vsaka zajeta tabela in vsak zajeti stolpec z logičnim imenom se znova izpelje. Stolpec prevzame tudi domeno, ki jo da njegov izraz, in z njo tip domene, ki se razširi po relacijah, dokler je vklopljena [sinhronizacija tipa podatkov v relacijah](./settings.md#relationship-datatype-sync).  
Pri miru pusti tabelo ali stolpec brez logičnega imena in stolpec, katerega novo ime že ima drug stolpec iste tabele – glejte razdelek [Dva stolpca, eno ime](#two-columns-one-name). Vsak od njih ohrani ime in njegovo stanje, ne glede na to, ali je ime vaše ali ga upravljajo slovarji, stolpec pa ohrani tudi povezavo z domeno.  
Logično ime, ki zdaj ne izpelje ničesar, pusti fizično ime nespremenjeno, vendar ga vrne v upravljanje slovarjem, tako da ga izpelje naslednje logično ime, ki ga vnesete.  
Ukaz je en korak razveljavitve, ne glede na to, koliko imen, povezav z domeno in tipov spremeni. Koraka ne zabeleži le, če ne spremeni ničesar, vračanje vašega imena v upravljanje slovarjem pa šteje za spremembo, tudi ko ime že vsebuje to, kar dajo slovarji.

Vrednost `Physical Name`, ki jo ima izraz sam, se iz spremenjenih besed ne sestavi znova, zato pred ponovno izpeljavo uredite izraz.

## Domene in podatkovni tipi {#domains-and-data-types}

Stolpec, povezan z domeno, ima vrednost `Data Type` te domene. Ko stolpec povežete z domeno, takoj dobi ta tip.  
Ko se vrednost `Data Type` domene spremeni, bodisi z urejanjem, lepljenjem ali uvozom na listu `Domains` bodisi s spremembo sodelavca ali agenta za kodiranje, vsak stolpec, povezan z njo, v istem koraku prevzame nov tip. Dokler je [sinhronizacija tipa podatkov v relacijah](./settings.md#relationship-datatype-sync) vklopljena, se vsaka od teh sprememb nadaljuje po relacijah tako kot sprememba, ki jo vnesete; ko je izklopljena, se spremenijo le povezani stolpci.  
Preimenovanje domene spremeni le ime, ki ga prikazujejo celice domene stolpcev.

Sprememba tipa na listu `Domains` se razveljavi tam, skupaj s tipi stolpcev, ki jih je dodelila – glejte razdelek [Listi zavihka Slovar](./undo-redo.md#dictionary-sheets).  
Razveljavitev ali uveljavitev na zavihku ERD, ki stolpec znova poveže z domeno ali vrne stolpec, povezan z domeno, stolpcu dodeli trenutni tip domene. Razveljavitev ali uveljavitev, ki vrne drug tip, prekine povezavo stolpca z domeno.

### Povezovanje stolpca z domeno {#linking-a-column}

Stolpec se z domeno poveže:

- Z izbiro domene v celici domene stolpca, ki jo prikaže View Option → `Domain`, ali v prikazu `Logical Names` v celici tipa, ki jo nadomešča – glejte razdelek [Celica domene](./logical-names.md#the-domain-cell).
- Z logičnim imenom, katerega izraz da domeno – glejte razdelek [Iz izraza](#from-a-term). To se zgodi le, ko se ime izpelje, torej ne pri vašem imenu in ne pri stolpcu, katerega izpeljano ime že ima drug stolpec.
- Z ukazom `Derive Physical Name Again` ali `Derive Physical Names Again`, ki vsak zajeti stolpec poveže z domeno njegovega izraza.
- Z relacijo: stolpec tujega ključa prevzame domeno svojega ključa, skupaj z njegovim tipom in logičnim imenom – glejte razdelek [Identifikacijske relacije](./relationship-editing.md#identifying-relationships). Ključ, katerega kopija dobi drug tip, kot se zgodi pri ključu serial, ne preda nobene domene.
- S podvojitvijo njegove tabele ali s premikom v drugo tabelo z ročico za vlečenje, pri čemer oboje ohrani povezavo z domeno. Lepljenje kopiranih tabel ali stolpcev jo ohrani le, če ta diagram navaja domeno in ima domena še vedno tip kopiranega stolpca, zato kopija iz drugega diagrama pristane brez povezave z domeno – glejte razdelek [Kopiranje/lepljenje tabel in beležk](./table-related-functions.md#copyingpasting-tables-and-memos). Ukaz `Import and Add` ne poveže nobenega stolpca.
- Z imenom domene, prilepljenim v celico domene – glejte razdelek [Kopiranje/lepljenje stolpcev](./table-editing.md#copyingpasting-columns).

### Prekinitev povezave z domeno {#unlinking}

- Vnos tipa v celico `DataType` povezanega stolpca ali sprejem predloga prekine povezavo stolpca z domeno, takoj ko se njegov tip razlikuje od tipa domene, stolpec pa ohrani tip, ki ste ga vnesli – glejte razdelek [Samodokončanje podatkovnega tipa](./table-editing.md#datatype-autocomplete). Ponoven vnos tipa domene stolpca ne poveže znova; namesto tega izberite domeno v njegovi celici domene. Lepljenje čez celico `DataType` in sprememba tipa, ki jo izvede agent za kodiranje, prekineta povezavo na enak način.
- Dokler je sinhronizacija tipa podatkov v relacijah vklopljena, se v istem koraku prekine povezava z domeno vsakemu stolpcu, do katerega seže sprememba tipa in katerega novi tip se razlikuje od tipa njegove domene, na primer tujemu ključu, povezanemu s svojo domeno. Okno [Preslikaj stolpce](./relationship-editing.md#map-columns) na enak način prekine povezavo z domeno stolpcem, ki jim spremeni tip.
- Možnost `None` v celici domene prekine povezavo stolpca z domeno in ohrani njegov tip.
- Sprememba ali izbris vrednosti `Domain` izraza ali odstranitev izraza ne spremeni nobenega stolpca.

### Odstranjevanje domene {#removing-a-domain}

Odstranitev vrstice domene pusti njenim stolpcem njihove tipe, njihove povezave z domeno pa ostanejo. Stolpci ne prikazujejo nobene domene, list `Checks` pa za vsakega od njih navede preverjanje `Unknown domain`, dokler je na listu `Domains` še kakšna domena. Razveljavitev odstranitve na listu `Domains` povezave znova prikaže.  
Dokler domene ni, vnos tipa, ki ni tip domene, v tak stolpec trajno prekine njegovo povezavo z domeno, enako pa stori možnost `None` v njegovi celici domene.  
Datoteka ob shranjevanju te povezave izpusti, zato se diagram znova odpre s temi stolpci brez povezave z domeno.

Izraz, povezan z odstranjeno domeno, prikazuje prazno celico `Domain`, označeno kot `Unknown domain`. Tipka `Delete` ali `Backspace` na celici prekine njegovo povezavo z domeno – glejte razdelek [Domena izraza](#a-terms-domain).

## List Preverjanja {#the-checks-sheet}

List `Checks` navaja, kaj preverjanja slovarjev najdejo v slovarjih ter v tabelah in stolpcih diagrama. Preverjanja samo berejo: ničesar ne spremenijo.  
Vsako preverjanje se izvede le, dokler ima list, ki ga bere, vsaj eno vrstico, preverjanja besed pa le, dokler je na listu `Words` beseda z imenom, zato diagram s praznimi slovarji ne navede ničesar.

![Customer Num, izrisan rdeče, in Order Stat, izrisan jantarno, v prikazu Logical Names, list Checks z njunimi tremi preverjanji in rdečim številom, dvoklik vrstice Forbidden word, ki vodi nazaj do Customer Num na diagramu, ter ponoven vnos imena kot Member Number, po katerem ostane eno preverjanje](/img/demo-dictionary-checks.webp)

Njegovi trije stolpci so samo za branje:

- Stolpec `Type` navaja preverjanje – glejte razdelek [Kaj najde posamezno preverjanje](#what-each-check-finds).
- Stolpec `Target` navaja besedo, izraz ali domeno z njenim imenom, tabelo z njenim imenom in stolpec kot `table.column`, pri čemer sta tabela in stolpec poimenovana tako, kot ju poimenuje [prikaz imen](./logical-names.md#beyond-the-canvas), z `unnamed`, kjer prikaz ne kaže nobenega imena.
- Stolpec `Detail` prikazuje, kaj je preverjanje našlo, za znakom `→` pa, kaj slovarji ponujajo namesto tega, pri čemer je več možnosti ločenih z vejicami, na primer `멤버 → 회원`. Prazna stran se prikaže kot `—`, na primer `— → NUMERIC(15)`.

Najprej so navedena preverjanja besed, nato preverjanja izrazov in domen, nato pa po tabelah, pri čemer vsaki tabeli sledijo njeni stolpci.  
Seznam sledi vsaki spremembi takoj, ko se zgodi, tudi spremembam sodelavca in agenta za kodiranje, ter vsakemu preklopu prikaza imen.  
Število na gumbu `Checks` je rdeče, dokler je katero koli preverjanje napaka, jantarno, dokler so vsa opozorila, in bledo, ko preverjanj ni.

Vrstic ni mogoče urejati, dodajati, brisati, razvrščati, uvažati ali izvažati: zgornji pas ne prikazuje orodij, desni klik ne odpre menija mreže, razveljavitev in uveljavitev pa ne naredita ničesar. Iskanje, izbiranje in kopiranje delujejo kot na drugih listih.

Tipka `Enter` ali dvoklik na vrstico vodi do tega, kar vrstica navaja:

- Beseda, izraz ali domena: zavihek prikaže njen list, na katerem je izbrana celica, ki jo preverjanje bere, torej ime ali celica `Domain` izraza, njena vrstica pa je prva vidna. Iskanje na listu se počisti, če vrstico skriva. Vrstica, ki je bila medtem odstranjena, ne vodi nikamor.
- Tabela ali stolpec: prikaže se zavihek ERD, na katerem je izbrana samo ta tabela, fokus pa je na celici, ki jo preverjanje bere. To je ime, logično ime ali celica domene ali, kjer vrstica te celice ne izrisuje, celica, izrisana namesto nje. Platno prevzame tipkovnico, pogled pa se premakne po pravilu iz razdelka [Kam pripelje skok](./table-related-functions.md#where-a-jump-lands).

Dvoklik na glavo, rob stolpca, drsni trak ali pod vrstice ne vodi nikamor.  
Agent za kodiranje navede ista preverjanja v enakem vrstnem redu z orodjem `erd_list_checks` – glejte razdelek [Preverjanja slovarjev](../../mcp/tools.md#dictionary-checks).

Drugi trije listi označijo celice, ki jih berejo preverjanja, torej ime ali celico `Domain` izraza, z rdečim ali jantarnim besedilom na obarvanem ozadju:

- Rdeče: ime, ki ga ima tudi druga vrstica istega lista, celica `Domain` izraza, ki je povezana z odstranjeno domeno, in celica `Term`, ki uporablja prepovedano besedo.
- Jantarno: celica `Term`, ki uporablja sopomenko ali neregistrirano besedo.

Celica prevzame barvo višje od svojih ravni. Oznake so vidne tudi v urejevalniku samo za branje, sam list `Checks` pa ni obarvan. Za oznake na platnu ERD glejte razdelek [Oznake na platnu](#marks-on-the-canvas).

### Kaj najde posamezno preverjanje {#what-each-check-finds}

| `Type` | Raven | Kaj najde | Primer za `Detail` |
| --- | --- | --- | --- |
| `Duplicate name` | Napaka | Vrednost `Word`, `Term` ali `Domain`, ki jo ima tudi druga vrstica istega lista. Navedena je vsaka od teh vrstic. | `Member` |
| `Unknown domain` | Napaka | Stolpec ali izraz, ki je še vedno povezan z odstranjeno domeno, dokler je na listu `Domains` kakšna domena | Ime odstranjene domene |
| `Forbidden word` | Napaka | Odsek logičnega imena ali vrednosti `Term`, ki ga beseda navaja v svoji celici `Forbidden Words` | `커스터머 → 고객` |
| `Unregistered word` | Opozorilo | Odsek logičnega imena tabele ali stolpca ali vrednosti `Term`, ki ga ne navaja nobena beseda | `자` |
| `Synonym` | Opozorilo | Odsek, ki ga beseda navaja v svoji celici `Synonyms` | `멤버 → 회원` |
| `Physical name mismatch` | Opozorilo | Tabela ali stolpec, katerega logično ime se ujema z izrazom, fizično ime pa ni tisto, ki ga da izraz | `mbr_no → MBR_NO` |
| `Domain type mismatch` | Opozorilo | Stolpec, katerega vrednost `DataType` ni vrednost `Data Type` domene, s katero je povezan | `INT → NUMERIC(15)` |

- Imena se primerjajo brez presledkov na začetku in koncu, velikost črk pa se upošteva, zato sta `Member` in `member` dve imeni, prazno ime pa nikoli ni dvojnik. Listi zavrnejo spremembo, ki bi dvema vrsticama dala enako ime, zato se preverjanje `Duplicate name` pojavi le tam, kjer sta se križali dve spremembi, na primer ko dva sodelavca hkrati poimenujeta vrstici, ali v datoteki, urejeni drugje.
- Preverjanja besed preberejo ime tako, kot je opisano v razdelku [Iz besed](#from-the-words), in vsak različen odsek navedejo enkrat na ime. Preverjanji `Forbidden word` in `Synonym` ponudita besedo, ki odsek navaja.
- Preverjanje `Physical name mismatch` primerja ime brez presledkov na začetku in koncu z vrednostjo `Physical Name` izraza ali, dokler ta nima vrednosti, s tem, kar sestavijo njegove besede, in ne javi ničesar, dokler izraz ne da nobenega imena. Pri stolpcu tujega ključa, ki je prevzel logično ime svojega ključa, se pojavi vsakič, ko se njegovo ime razlikuje od imena izraza, na primer `members_id → MBR_ID`. Ukaz `Derive Physical Name Again` to popravi, razen če to ime že ima drug stolpec.
- Preverjanje `Domain type mismatch` nikoli ne nastane zaradi sprememb v enem urejevalniku, saj ima povezan stolpec na koncu vedno tip svoje domene. Pojavi se lahko, ko en sodelavec stolpec poveže z domeno, medtem ko drug spremeni tip te domene, ali v datoteki, zapisani drugje. Ponovna izbira domene v celici domene stolpca stolpcu dodeli njen tip, možnost `None` pa prekine njegovo povezavo z domeno. Povezava z odstranjeno domeno se prikaže le kot `Unknown domain`.

### Oznake na platnu {#marks-on-the-canvas}

Platno ERD izriše ime, ki ga označijo preverjanja, v barvi njegovega preverjanja:

- Celica logičnega imena v glavi tabele ali v vrstici stolpca je rdeča, dokler njeno logično ime uporablja prepovedano besedo, sicer pa jantarna, dokler uporablja sopomenko ali besedo, ki je na listu `Words` ni.
- Celica fizičnega imena v glavi ali v vrstici je jantarna, dokler izraz, s katerim se ujema pripadajoče logično ime, da drugačno fizično ime.

Označeni sta le ti dve vrsti celic, nikoli celica domene ali celica `DataType`, zato se preverjanji `Unknown domain` in `Domain type mismatch` stolpca prikažeta samo na listu `Checks`.  
Celica je označena le zaradi tega, kar izrisuje: prikaz `Physical Names` lahko označi samo fizična imena, prikaz `Logical Names` samo logična imena, prikaz `Both Names` pa vsako celico po njenih lastnih preverjanjih – glejte razdelek [Prikaz imen](./logical-names.md#name-view). Prazna celica ohrani barvo nadomestnega besedila, prazni slovarji pa ne označijo ničesar.  
V glavi tabele v obarvani [skupini tabel](./table-groups.md) oznaka ohrani svojo barvo le, dokler je na barvi skupine še berljiva; sicer ime prevzame črno ali belo barvo same glave.

Oznake so vidne na platnu ERD, v [potovanju skozi čas](./undo-redo.md#time-travel) in v predogledu [samodejne postavitve](./table-related-functions.md#auto-layout), tudi v urejevalniku samo za branje. Zavihek Vizualizacija, obe strani [pregledovalnika razlik](./table-related-functions.md#diff-viewer) in izvožena slika jih ne izrišejo.  
Sledijo vsaki spremembi, takoj ko se zgodi, ne glede na to, ali gre za ime ali za besedo, izraz ali domeno.

## Iskanje {#searching}

Iskalno polje prikazuje besedilo `Search` in je na voljo na vseh štirih listih, tudi v urejevalniku samo za branje. Vsak list ima svoje iskanje.  
Vrstica se ujema, ko ena od preiskanih celic vsebuje besedilo, ne glede na velikost črk, normalizacijsko obliko Unicode in presledke okoli iskalnega niza. Zadetek nikoli ne sega čez dve celici. Preiskane celice:

- `Domains`: `Domain`, `Data Type` in `Description`.
- `Words`: `Word`, `Abbreviation`, `English Name` in `Description`.
- `Terms`: `Term`, `Physical Name` in `Description`.
- `Checks`: vse tri, kot se glasijo v jeziku prikaza.

Novo iskanje premakne izbor na prvo celico in list pomakne na vrh.  
Dokler je v polju besedilo, ga gumb `x` z opisom orodja `Clear search` izprazni in pusti kazalko v polju. Polje izprazni tudi tipka `Escape` v polju.  
V polju `Ctrl + Z` (Windows/Linux) ali `⌘ + Z` (Mac) razveljavi vaše tipkanje, ne pa sprememb lista, tipke za vrstice iz razdelka [Dodajanje in brisanje vrstic](#adding-and-deleting-rows) pa vnašajo besedilo.  
Gumb `Add Row` in vstavljanje vrstic najprej počistita iskanje, saj se prazna vrstica ne ujema z nobenim iskanjem. Uvoz ga ohrani.

## Izbiranje in premikanje {#selecting-and-moving}

Mreža izbira tako kot preglednica:

- Klik izbere celico, vlečenje pa obseg, pri čemer se list ob svojem robu pomika. `Shift + click` razširi izbor od aktivne celice, `Ctrl + click` (Windows/Linux) ali `⌘ + click` (Mac) pa doda nov obseg.
- Glava stolpca izbere svoj stolpec, številka vrstice svojo vrstico, levi zgornji kot pa vse celice, tako kot `Ctrl + A` (Windows/Linux) ali `⌘ + A` (Mac).
- Na računalniku Mac je `Ctrl + click` desni klik – glejte razdelek [Meni mreže](#the-grids-menu).

S tipkovnico:

- Puščične tipke premaknejo izbor za eno celico, ob pridržani tipki `Ctrl` (Windows/Linux) ali `⌘` (Mac) pa v tisti smeri do roba lista.
- Tipki `Home` in `End` premakneta na prvo in zadnjo celico vrstice, ob pridržani tipki `Ctrl` ali `⌘` pa na prvo in zadnjo celico lista.
- Tipki `Page Up` in `Page Down` premakneta za zaslon vrstic.
- Če skupaj s katero koli od zgornjih tipk pridržite tipko `Shift`, se namesto tega razširi izbor.
- `Tab` in `Shift + Tab` premakneta desno in levo, `Shift + Enter` pa navzgor. Sama tipka `Enter` odpre celico za urejanje – glejte razdelek [Urejanje celic](#editing-cells).

Ko vrstice pod izborom izginejo zaradi razveljavitve ali odstranitve, ki jo izvede sodelavec, se izbor premakne nazaj med preostale vrstice.

Povlecite desni rob glave stolpca, da spremenite širino stolpca, ali dvokliknite rob, da se stolpec prilagodi najširšemu besedilu v vidnih vrsticah. Nobena tipka ne spremeni širine stolpca.

## Urejanje celic {#editing-cells}

Tipkanje na izbrani celici zamenja njeno vrednost. Tipka `Enter`, `F2` ali dvoklik odpre trenutno vrednost za urejanje, s kazalko na njenem koncu.  
Celica vsebuje eno vrstico, zato tabulator ali prelom vrstice, prilepljen vanjo, postane presledek.

- Tipka `Enter` zapiše spremembo in premakne navzdol, tipka `Tab` pa jo zapiše in premakne desno. S tipko `Shift` premakneta navzgor ali levo.
- Zapiše jo tudi klik drugam ali premik fokusa tipkovnice iz mreže.
- Tipka `Escape` jo prekliče.

![Urejanje lista Words: vnos NUM čez celico in pritisk tipke Enter, vstavljanje vrstice z ⌥ + Enter in izpolnjevanje s tipko Tab, razvrščanje po Word iz menija mreže, nato iskanje ord in praznjenje iskanja z Esc](/img/demo-dictionary-editing.webp)

Sprememba, ki vrednost pusti nespremenjeno, ne zapiše ničesar, zapisana sprememba pa je en korak razveljavitve njenega lista, ne glede na to, koliko je bilo vtipkanega.  
Tipka `Delete` ali `Backspace` izprazni vse izbrane celice v enem koraku, ko ni odprto nobeno urejanje.  
Dokler je urejanje odprto, tipke za razveljavitev in uveljavitev razveljavijo in uveljavijo vaše tipkanje v celici, tipke za vrstice pa vnašajo besedilo – glejte razdelek [Tipke na zavihku](#keys-on-the-tab).  
Vsaka celica na listu `Checks` in vsaka celica v urejevalniku samo za branje je samo za branje in se ne odpre za urejanje.

Ko je katera koli vrstica spremembe, lepljenja ali brisanja zavrnjena, se nič od tega ne shrani, pojavno obvestilo o napaki pa pove zakaj, prešteje vrstice in navede prve tri:

- Ime, ki ga ima druga vrstica lista ali ga zapiše druga vrstica istega lepljenja: `Nothing saved: 1 row shares a name with another row (Member)` ali `Nothing saved: 2 rows share a name with another row (…)`. Imena se primerjajo brez presledkov na začetku in koncu, velikost črk pa se upošteva, zato se `Member` in `member` razlikujeta. Prazno ime ni nikoli zavrnjeno.
- Vrednost `Domain` izraza, podana kot besedilo, ki ni ime nobene domene na listu `Domains`: `Nothing saved: 1 row names an unknown domain (…)`.
- Vrstica, ki jo je sodelavec odstranil, medtem ko ste jo urejali: `Nothing saved: the row was removed`.

Zapis lahko seže čez svojo celico:

- Izraz, ki dobi vrednost `Term`, medtem ko je njegova vrednost `Physical Name` prazna, dobi ime, ki ga sestavijo njegove besede, če ga sestavijo – glejte razdelek [Iz besed](#from-the-words). To se zgodi enkrat: ko se besede pozneje spremenijo, se ime ne sestavi znova.
- Nova vrednost `Data Type` domene v istem koraku razveljavitve spremeni tip vsakega stolpca, povezanega z domeno – glejte razdelek [Domene in podatkovni tipi](#domains-and-data-types).

### Domena izraza {#a-terms-domain}

Tipka `Enter`, `F2` ali dvoklik na celico `Domain` izraza odpre seznam pod celico ali nad njo, če je tam več prostora, skupaj z iskalnim poljem, ki prikazuje besedilo `Domain`.  
Seznam vsebuje `None`, nato pa vse domene z imenom v vrstnem redu lista `Domains`, poudarek pa je na začetku na domeni, s katero je izraz povezan, ali na `None`. Vnos znaka na celici odpre seznam, v katerem se ta znak že išče.

- Tipkanje zoži seznam na domene, katerih imena vsebujejo besedilo, ne glede na velikost črk, izpusti `None` in poudari prvi zadetek.
- `↑` in `↓` premikata poudarek, ki na obeh koncih preskoči na drugi konec.
- Tipka `Enter` ali `Tab` izbere poudarjeno vrstico, klik pa kliknjeno vrstico, kot en korak razveljavitve. Izraz se poveže prav z izbrano domeno, tudi če je ena od dveh domen z enakim imenom, možnost `None` pa prekine njegovo povezavo z domeno.
- Tipka `Escape` ali klik zunaj seznama zapre seznam, ne da bi se zapisalo kar koli vtipkanega.

Če na listu `Domains` ni nobene domene z imenom, se polje odpre brez seznama.  
Prilepljeno besedilo izraz poveže s prvo navedeno domeno s tem imenom, prazno besedilo prekine povezavo z domeno, besedilo, enako prikazanemu v celici, pa povezavo ohrani nespremenjeno. Vsako drugo ime je zavrnjeno – glejte razdelek [Urejanje celic](#editing-cells). Tipka `Delete` ali `Backspace` na celici prekine povezavo izraza z domeno, tudi z odstranjeno.

## Kopiranje in lepljenje {#copying-and-pasting}

`Ctrl + C` (Windows/Linux) ali `⌘ + C` (Mac) kopira izbor kot besedilo, ločeno s tabulatorji, z eno vrstico besedila na vrstico, tako kot ga zapisujejo preglednice, zato se v preglednico prilepi kot celice. Tabulator ali prelom vrstice znotraj vrednosti postane presledek.  
Več obsegov se kopira skupaj le, če zajemajo iste vrstice drug ob drugem ali iste stolpce drug nad drugim. Sicer se nič ne kopira in prikaže se pojavno obvestilo o napaki `Nothing copied: the ranges share no rows or columns`.

`Ctrl + V` (Windows/Linux) ali `⌘ + V` (Mac) prilepi besedilo, ločeno s tabulatorji, na primer celice, kopirane iz preglednice, od aktivne celice navzdol in v desno:

- Narekovaji se prilepijo kot besedilo, zato se celica preglednice s prelomom vrstice ne prilepi kot ena celica.
- Ena sama vrednost zapolni vse izbrane obsege.
- Vrstice za zadnjo vrstico se po vrsti dodajo kot nove vrstice, zato lepljenje v prazen list ta list zapolni.
- Stolpci za zadnjim stolpcem so izpuščeni, kar po shranitvi preostanka sporoči pojavno obvestilo `Columns past the last one weren't pasted`.
- Lepljenje več celic nato izbere blok, ki ga je zapisalo.

Lepljenje je en korak razveljavitve, vključno z vrsticami, ki jih doda, in je zaradi podvojenega imena ali neznane domene zavrnjeno v celoti – glejte razdelek [Urejanje celic](#editing-cells).  
Kopiranje, lepljenje ali brisanje več kot milijona celic ne naredi ničesar, prikaže pa se pojavno obvestilo o napaki `Nothing done: the selection covers too many cells`.  
Izrezovanje, `Ctrl + X` (Windows/Linux) ali `⌘ + X` (Mac), na listu ne naredi ničesar. Kopiranje in lepljenje na tem zavihku nikoli ne sežeta do diagrama, dokler je urejanje celice odprto, pa delujeta na besedilo v celici.

## Dodajanje in brisanje vrstic {#adding-and-deleting-rows}

Gumb `Add Row` doda eno prazno vrstico na konec lista. Počisti iskanje, izbere prvo celico nove vrstice in mreži preda tipkovnico, tako da tipkanje izpolni to celico.  
Gumb `Delete Rows` odstrani vse vrstice, ki jih zajema izbor, v katerem koli stolpcu, ena razveljavitev pa jih vse vrne na njihova mesta. Njegov opis orodja navede tipko, ki naredi isto.

Ko je fokus tipkovnice v mreži in se nobena celica ne ureja:

- `Alt + Enter` (Windows/Linux) ali `⌥ + Enter` (Mac) vstavi pod izbor toliko praznih vrstic, kolikor jih izbor zajema.
- `Alt + Shift + Enter` (Windows/Linux) ali `⌥ + Shift + Enter` (Mac) jih vstavi nad izbor.
- `Alt + Backspace` ali `Alt + Delete` (Windows/Linux) oziroma `⌥ + Backspace` ali `⌥ + Delete` (Mac) izbriše vrstice, ki jih zajema izbor.

Naredijo isto kot postavke za vstavljanje in brisanje vrstic v meniju mreže – glejte razdelek [Meni mreže](#the-grids-menu). Vstavljanje počisti iskanje in nove vrstice postavi tik nad prvo vrstico, ki jo zajema izbor, ali tik pod njegovo zadnjo. Izbere jih v prvem stolpcu, pri čemer je prva od njih aktivna, in je en korak razveljavitve.

Te tipke izhajajo iz dodelitev `Add Column` in `Remove Column` na zavihku [Bližnjice](./settings.md#shortcuts), zato jih gostitelj, ki ti dodelitvi spremeni z metodo [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), premakne tudi tukaj. `Alt + Shift + Enter` je tipka `Add Column` z dodano tipko `Shift` in tam nima svoje vrstice.  
V odprtem urejanju in v iskalnem polju delujejo kot tipke za besedilo, zato na računalniku Mac `⌥ + Backspace` izbriše besedo. Na listu `Checks` in v urejevalniku samo za branje ne naredijo ničesar. Na tem zavihku nikoli ne dodajo ali odstranijo stolpca tabele.  
V aplikaciji Obsidian dosežejo zavihek tudi tam, kjer isto tipko uporablja bližnjica aplikacije Obsidian.

Vrstica, ki ni bila nikoli izpolnjena ali iz katere so bile izbrisane vse vrednosti, je vidna na svojem listu in doseže sodelavce, vendar jo datoteka izpusti, zato je ob ponovnem odprtju diagrama ni več.

## Meni mreže {#the-grids-menu}

Z desno tipko miške kliknite celico na listu `Domains`, `Words` ali `Terms`, da odprete meni mreže. Celica zunaj izbora najprej postane izbor.  
Desni klik pod zadnjo vrstico ali desno od zadnjega stolpca ga odpre za trenutni izbor, zato se na praznem listu odpre kjer koli pod glavami. Tipka menija ali `Shift + F10` ga odpre za aktivno celico.

- `Insert 1 row above`, `Insert 1 row below` in `Delete 1 row`, vsaka s številom vrstic, ki jih zajema izbor, na primer `Insert 3 rows above`, in s svojo tipko na desni – glejte razdelek [Dodajanje in brisanje vrstic](#adding-and-deleting-rows).
- `Sort by <column>, ascending` in `Sort by <column>, descending`, ki navajata stolpec, na katerega ste kliknili z desno tipko miške, na primer `Sort by Word, ascending` – glejte razdelek [Razvrščanje](#sorting). Desno od zadnjega stolpca sta izpuščeni.
- `Import CSV` in `Export CSV`, ki naredita isto kot gumba v zgornjem pasu – glejte razdelek [Uvoz in izvoz CSV](#importing-and-exporting-csv).

Ko ni prikazana nobena vrstica, na praznem listu ali pri iskanju brez zadetkov, so prikazane le postavke `Insert 1 row below`, `Import CSV` in `Export CSV`.  
List `Checks` in urejevalnik samo za branje namesto tega odpreta lastni meni brskalnika, enako pa tudi desni klik na glavo ali drsni trak.  
Meni se zapre ob izbiri, ob pritisku tipke `Escape`, ob pritisku drugje na zavihku, ko se spremeni izbor ali list, in ko se spremenijo vrstice lista, bodisi z vašo spremembo bodisi s spremembo sodelavca.

## Razvrščanje {#sorting}

Postavki `Sort by <column>, ascending` in `Sort by <column>, descending` prerazporedita same vrstice lista, ne le njihovega vrstnega reda na zaslonu. Novi vrstni red se shrani v datoteko, vidijo ga sodelavci in upošteva ga ukaz `Export CSV`, ena razveljavitev pa vrne stari vrstni red.  
Vrstice se primerjajo po besedilu, ki ga prikazuje celica, celica `Domain` izraza po imenu domene, v abecednem vrstnem redu jezika prikaza, pri čemer se števila primerjajo po vrednosti, zato je `2` pred `10`. Prazne celice so v obeh smereh zadnje, vrstice, ki so pri primerjavi enake, pa ohranijo svoj vrstni red. Razvrščanje lista, ki je že v tem vrstnem redu, ne zabeleži ničesar.  
Iskanje ostane, kakršno je bilo, prav tako izbor, katerega celice zdaj vsebujejo druge vrstice.

## Uvoz in izvoz CSV {#importing-and-exporting-csv}

Vsak od listov `Domains`, `Words` in `Terms` se uvozi iz datoteke CSV in izvozi vanjo. Te datoteke so namenjene samo zavihku Slovar: postavki `Import` in `Export` v priročnem meniju platna jih ne bereta in ne zapisujeta – glejte stran [Uvoz in izvoz datotek](./file-import-export.md).

### Uvoz {#importing}

Gumb `Import CSV` v zgornjem pasu ali postavka `Import CSV` v meniju mreže odpre lastni izbirnik datotek brskalnika za datoteke `.csv`, ne pa okna za uvoz gostitelja. Ponovna izbira iste datoteke jo znova uvozi.  
Datoteka gre v slovar, ki ga navaja njena glava, ne glede na to, kateri list je prikazan, zavihek pa nato prikaže ta list in njegovi mreži preda tipkovnico. List ohrani iskanje, izbor in položaj pomika, zato vrstice, ki jih skriva iskanje, ali vrstice, dodane pod vidnim delom, ostanejo skrite.  
Datoteka se prebere kot UTF-8, z oznako vrstnega reda bajtov (BOM) ali brez nje, ali kot EUC-KR, če ni veljaven UTF-8, kar velja za starejše datoteke standarda javnih podatkov.

![Odpiranje zavihka Slovar v orodni vrstici, nato uvoz domen, besed in izrazov z ukazom Import CSV, pri čemer vsaka datoteka preklopi zavihek na svoj list in sporoči, kaj je dodala](/img/demo-dictionary-import.webp)

Kako se vrstice umestijo:

- Vsaka vrstica z imenom posodobi vrstico lista s tem imenom, in sicer v poljih, za katera ima datoteka stolpce. Polja, za katera datoteka nima stolpcev, ostanejo nespremenjena. Imena se primerjajo brez presledkov na začetku in koncu, velikost črk pa se upošteva.
- Imena, ki jih na listu ni, se dodajo za njegovo zadnjo vrstico v vrstnem redu datoteke.
- Uvoz nikoli ne odstrani vrstice.
- Vrstica s praznim imenom se preskoči. Če datoteka vsebuje ime dvakrat, prevlada poznejša vrstica, prejšnja pa šteje za preskočeno. Prazne vrstice v datoteki se ne štejejo za vrstice.
- Domena izraza se poišče po imenu, in sicer prva domena s tem imenom, ime, ki ga nima nobena domena, pa pusti izraz brez povezave z domeno, zato najprej uvozite domene.

En uvoz je en korak razveljavitve tega lista.  
Pojavno obvestilo nato prikaže na primer `1 added · 1 updated · 2 skipped`. Vrstica, ki je enaka vrstici na listu, ne šteje niti za dodano niti za posodobljeno, zato ponoven uvoz iste datoteke ne spremeni ničesar in ne zabeleži nobenega koraka.  
Če izrazi v datoteki navajajo domene, ki jih diagram nima, druga vrstica obvestila navede prve tri, na primer `4 unknown domains: 연월일, 금액, 번호`.  
Datoteka, katere glava se ne ujema z nobeno obliko ali se ujema z dvema, ne uvozi ničesar, prikaže pa se pojavno obvestilo o napaki `Couldn't read this file as words, terms or domains`.

### Oblike datotek {#file-layouts}

Vsak slovar prebere dve obliki datotek. Prva je lastna oblika urejevalnika, ki jo zapiše ukaz `Export CSV`, z imeni polj kot glavo:

| Slovar | Glava | Datoteka mora imeti |
| --- | --- | --- |
| Words | `name,abbreviation,englishName,description,synonyms,forbiddenWords` | `name`, `abbreviation` |
| Terms | `name,physicalName,domain,description,synonyms` | `name`, `physicalName` |
| Domains | `name,category,dataType,description` | `name`, `dataType` |

Stolpci so lahko v poljubnem vrstnem redu, stolpec `domain` izraza vsebuje ime domene, vsak drug stolpec pa se prezre. V glavi se velikost črk upošteva, celice pa se preberejo natanko tako, kot so zapisane, vključno s presledki.

Druga je oblika datotek korejskega standarda javnih podatkov (공통표준):

| Slovar | Datoteka mora imeti | Prebere tudi |
| --- | --- | --- |
| Words | `공통표준단어명` | `공통표준단어영문약어명` (okrajšava), `공통표준단어 영문명` (angleško ime), `공통표준단어 설명` (opis), `이음동의어 목록` (sopomenke), `금칙어 목록` (prepovedane besede) |
| Terms | `공통표준용어명` | `공통표준용어영문약어명` (fizično ime), `공통표준도메인명` (domena, po imenu), `공통표준용어설명` (opis), `용어 이음동의어 목록` (sopomenke) |
| Domains | `공통표준도메인명`, `데이터타입` | `공통표준도메인분류명` (kategorija), `공통표준도메인설명` (opis), `데이터길이`, `데이터소수점길이` |

Stolpci `데이터타입`, `데이터길이` in `데이터소수점길이` domene se združijo v en podatkovni tip: `NUMERIC(15,2)`, `CHAR(8)`, sam tip, kjer dolžine ni, na primer `DATE`, število decimalnih mest 0 pa se izpusti, na primer `NUMERIC(15)`.  
V teh datotekah se celicam odstranijo presledki na začetku in koncu, drugi stolpci, na primer zgodovina revizij, pa se prezrejo.  
V obeh oblikah presledki v imenu stolpca v glavi niso pomembni.

### Izvoz {#exporting}

Gumb `Export CSV` v zgornjem pasu ali postavka `Export CSV` v meniju mreže shrani prikazani list v lastni obliki urejevalnika: vse vrstice v vrstnem redu lista, ne glede na to, kaj prikazuje iskanje, pri čemer je domena izraza zapisana z imenom, pri odstranjeni domeni pa ostane prazna.  
Datoteka je v kodiranju UTF-8 z oznako vrstnega reda bajtov in konci vrstic CRLF, v narekovaje pa je zaprto le polje, ki vsebuje narekovaj, vejico ali prelom vrstice. Odpre se v preglednici in se znova uvozi v enake vrstice.  
Ime datoteke je `<database name>-<timestamp>-words.csv`, `-terms.csv` ali `-domains.csv`, shrani pa se tako kot drugi izvozi urejevalnika – glejte razdelek [Izvoz](./file-import-export.md#exporting).

List `Checks` nima izvoza, urejevalnik samo za branje pa ne ponuja uvoza ali izvoza.

## Razveljavitev in uveljavitev {#undo-and-redo}

Listi `Domains`, `Words` in `Terms` imajo vsak svojo zgodovino razveljavitev, ločeno od zgodovine diagrama. Na tem zavihku `Ctrl + Z` in `Ctrl + Shift + Z` (Windows/Linux) ali `⌘ + Z` in `⌘ + Shift + Z` (Mac) ter gumba `Undo` in `Redo` v orodni vrstici delujejo na prikazani list, orodna vrstica pa ne prikazuje gumba `Time Travel`. Na listu `Checks` ne naredijo ničesar.  
Razveljavitev na zavihku ERD nikoli ne prekliče spremembe na listu – glejte razdelek [Listi zavihka Slovar](./undo-redo.md#dictionary-sheets).

## Tipke na zavihku {#keys-on-the-tab}

Dokler je fokus tipkovnice na zavihku, delujejo te bližnjice urejevalnika – glejte razdelek [Bližnjice](./settings.md#shortcuts):

- `Search`, `Ctrl + K` (Windows/Linux) ali `⌘ + K` (Mac), odpre [hitro iskanje](./quick-search.md).
- `Toggle Explorer`, `Ctrl + F` (Windows/Linux) ali `⌘ + F` (Mac), preklopi na zavihek ERD in odpre iskanje v [raziskovalcu](./explorer.md#opening-and-closing).
- `Undo` in `Redo` delujeta na prikazani list – glejte razdelek [Razveljavitev in uveljavitev](#undo-and-redo).
- `Add Column` in `Remove Column` vstavljata in brišeta vrstice – glejte razdelek [Dodajanje in brisanje vrstic](#adding-and-deleting-rows).

Dokler je urejanje celice odprto, vključno s seznamom domen izraza, `Search` in `Toggle Explorer` ne naredita ničesar, zato se vtipkano besedilo ne izgubi.

Vsaka druga bližnjica urejevalnika ostane na zavihku in nikoli ne doseže platna: `Alt + N` (Windows/Linux) ali `⌥ + N` (Mac) ne doda tabele, `Delete` in `Backspace` pa na platnu ne izbrišeta ničesar.  
Namesto tega na list delujejo lastne tipke mreže: `Enter` odpre celico za urejanje, `Delete` in `Backspace` izpraznita izbrane celice, `Ctrl + A` (Windows/Linux) ali `⌘ + A` (Mac) izbere vse celice, `Escape` pa prekliče urejanje, zapre meni mreže ali izprazni iskalno polje. Tudi kopiranje, izrezovanje in lepljenje ostanejo na zavihku – glejte razdelek [Kopiranje in lepljenje](#copying-and-pasting).

## Urejevalniki samo za branje {#read-only-editors}

V urejevalniku z lastnostjo [`readonly`](../../api/erd-editor-element.md#readonly) se zavihek odpre in prikaže vse liste.  
Preklapljanje listov, iskanje, izbiranje, pomikanje, spreminjanje širine stolpcev in kopiranje delujejo kot običajno, prav tako prehod na preverjanje z lista `Checks` s tipko `Enter` ali dvoklikom. Vidne so tudi oznake preverjanj.

Nobena celica ne sprejme urejanja, lepljenja ali brisanja, vsaka celica, ki je ne označi nobeno preverjanje, pa je izrisana na sivem ozadju celic samo za branje.  
Gumbi `Add Row`, `Delete Rows`, `Import CSV` in `Export CSV` so skriti, tipke za vrstice ne naredijo ničesar, desni klik pa odpre meni brskalnika. Prazen list ne prikazuje namiga, orodna vrstica pa ne prikazuje gumbov `Undo` in `Redo`.

## Sodelavci in datoteka {#collaborators-and-the-file}

Datoteka diagrama vsebuje besede, izraze in domene v vrstnem redu listov, vključno z vrstnim redom po razvrščanju, vrstico brez vrednosti pa izpusti.  
Vsebuje tudi logično ime vsake tabele in vsakega stolpca, podatek, ali posamezno fizično ime upravljajo slovarji, in povezavo z domeno vsakega stolpca, dokler je domena navedena. Preverjanja in oznake se izračunajo iz teh podatkov in se nikoli ne shranijo.

V [sodelovalni seji](../../api/advanced/collaborative-editing.md) urejevalniki vidijo spremembe slovarjev drug drugega takoj, ko se zgodijo, vključno z razvrščanji in vstavljanji. Vsak ohrani svoj list, iskanje in izbor, njegove zgodovine listov pa vsebujejo le njegove spremembe.  
Sprememba ali lepljenje v vrstico, ki jo je sodelavec medtem odstranil, ne shrani ničesar, prikaže pa se pojavno obvestilo `Nothing saved: the row was removed`.  
Urejevalnik iz izdaje, ki še nima zavihka Slovar, shrani diagram brez njegovih logičnih imen, povezav z domeno in slovarjev – glejte razdelek [Mešanje izdaj](../../api/advanced/collaborative-editing.md#mixing-releases).

Ukaz `Import` iz Sheme SQL, GraphQL, DBML ali AML ohrani slovarje, ukaz `Import` iz datoteke JSON jih zamenja s slovarji iz datoteke, ukaz `Import and Add` pa ne prinese nobenega – glejte razdelek [Uvoz zunanjih datotek](./file-import-export.md#importing-external-files).  
Agent za kodiranje prek strežnika MCP ureja besede, izraze in domene, nastavlja logična imena in domene, znova izpeljuje fizična imena in navaja preverjanja – glejte razdelka [Slovarji](../../mcp/tools.md#dictionaries) in [Preverjanja slovarjev](../../mcp/tools.md#dictionary-checks). Za datoteke CSV nima nobenega orodja.
