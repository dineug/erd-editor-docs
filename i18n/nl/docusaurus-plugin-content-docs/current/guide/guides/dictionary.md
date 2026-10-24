---
sidebar_position: 14
description: Houd de domeinen, woorden en termen van het diagram bij op het tabblad Woordenboek, leid fysieke namen af uit logische namen, laat een domein het gegevenstype van zijn kolommen bepalen, lees wat het blad Controles vindt, bewerk en sorteer de bladen zoals in een spreadsheet, en importeer en exporteer ze als CSV-bestanden.
---

# Woordenboek

Het tabblad Woordenboek bevat de naamgevingsstandaard van het diagram in drie woordenboeken, elk op een blad dat je bewerkt zoals een spreadsheet:

- `Domains`: gegevenstypen met een naam, zoals `Name` voor `VARCHAR(100)`. Een kolom die aan een domein is gekoppeld, heeft het gegevenstype van dat domein.
- `Words`: de standaardwoorden waaruit logische namen bestaan, elk met de afkorting die een fysieke naam ervoor gebruikt, zoals `Customer` en `CUST`.
- `Terms`: volledige logische namen, elk met de fysieke naam en het domein die ze geven, zoals `Customer Name` met `CUST_NM`.

De [logische naam](./logical-names.md) van een tabel of kolom leidt haar fysieke naam af uit deze woordenboeken, en de term van een kolom kan haar ook aan een domein koppelen — zie [Fysieke namen afleiden](#deriving-physical-names).  
Een vierde blad, `Checks`, toont wat de woordenboeken fout vinden in de namen en typen van het diagram en in de woordenboeken zelf, zoals een verboden woord in een logische naam — zie [Het blad Controles](#the-checks-sheet).

## Het tabblad openen {#opening-the-tab}

Schakel in de werkbalk over naar het tabblad `Dictionary`, de knop met een boekpictogram tussen `Code Generator` en `Settings`, of kies `Dictionary` onder `Tab` in [Snel zoeken](./quick-search.md).  
Het diagram kan op dit tabblad openen — zie `Canvas Type` in [Vergrendeling](./settings.md#lock).

Het tabblad opent op het blad `Domains` totdat je een ander blad kiest.  
Telkens als het opent, komt het blad terug met de selectie en de scrollpositie die je achterliet, of bij een eerste bezoek met de eerste cel geselecteerd. Het raster krijgt de toetsenbordfocus, zodat typen of de pijltoetsen meteen werken.

Het getoonde blad en de zoekopdracht, selectie, scrollpositie en kolombreedtes van elk blad zijn alleen van jou.  
Niets daarvan wordt in het bestand opgeslagen, in de geschiedenis vastgelegd of met medebewerkers gedeeld. Het blijft bewaard zolang de editor open blijft, bij het wisselen van tabblad en over de documenten heen die in dezelfde editor worden geladen.

## De bladen {#the-sheets}

De balk bovenaan bevat de vier bladknoppen `Domains`, `Words`, `Terms` en `Checks`, en de knop van het getoonde blad ziet er ingedrukt uit. Elke knop toont een aantal naast zijn naam: de rijen die zijn blad bevat, wat de zoekopdracht ook toont, of op `Checks` het aantal controles, gekleurd naar hun niveau — zie [Het blad Controles](#the-checks-sheet).  
Daarna volgt het zoekveld — zie [Zoeken](#searching). Aan het einde van de balk staan op `Domains`, `Words` en `Terms`, en niet in een editor in alleen-lezenmodus, vier tools: `Add Row`, `Delete Rows`, `Import CSV` en `Export CSV` — zie [Rijen toevoegen en verwijderen](#adding-and-deleting-rows) en [CSV importeren en exporteren](#importing-and-exporting-csv).  
In een smal deelvenster of een weergavetaal met lange teksten loopt de balk door over meer regels, zodat elke knop bereikbaar blijft.

Onder het raster telt een statusregel de rijen die de zoekopdracht overlaat, zoals in `4 rows`, en, zolang de selectie een of meer rijen beslaat, hoeveel ze er beslaat, zoals in `1 selected`. Een rij die in twee bereiken valt, telt één keer, dus dat getal is het aantal rijen dat `Delete Rows` zou verwijderen.  
De rijnummers langs de linkerkant tellen de rijen zoals het blad ze toont, vanaf 1. Een alleen-lezencel, en dat is elke cel op `Checks` en elke cel in een editor in alleen-lezenmodus, krijgt een grijze achtergrond, behalve waar een controle haar markeert.  
Een leeg blad `Domains`, `Words` of `Terms` toont `Import a CSV file or add a row`, behalve in een editor in alleen-lezenmodus.

De kolommen van elk blad, op volgorde:

| Blad | Kolommen |
| --- | --- |
| `Domains` | `Domain`, `Category`, `Data Type`, `Description` |
| `Words` | `Word`, `Abbreviation`, `English Name`, `Description`, `Synonyms`, `Forbidden Words` |
| `Terms` | `Term`, `Physical Name`, `Domain`, `Description`, `Synonyms` |
| `Checks` | `Type`, `Target`, `Detail` |

Wat de cellen doen:

- Het `Data Type` van een domein wordt geschreven als een kolomtype, zoals `VARCHAR(100)` of `NUMERIC(15,2)`, en elke kolom die aan het domein is gekoppeld, heeft dat type — zie [Domeinen en gegevenstypen](#domains-and-data-types).
- De `Abbreviation` van een woord is wat een fysieke naam voor dat woord gebruikt — zie [Uit de woorden](#from-the-words).
- De `Synonyms` en `Forbidden Words` van een woord noemen andere woorden voor hetzelfde begrip, gescheiden door komma's. Van elk item worden de spaties eromheen verwijderd, een leeg item vervalt en een item dat gelijk is aan het woord zelf, wordt genegeerd. Een logische naam die er een gebruikt, stelt geen fysieke naam samen, en het blad `Checks` signaleert hem en noemt het woord dat je in plaats daarvan moet gebruiken — zie [Wat elke controle vindt](#what-each-check-finds).
- De `Term` van een term is een volledige logische naam, en zijn `Physical Name` is de naam die die logische naam geeft — zie [Uit een term](#from-a-term).
- De cel `Domain` van een term toont de naam van het domein waaraan de term is gekoppeld, en is leeg zolang de term aan geen domein is gekoppeld of aan een domein dat sindsdien is verwijderd — zie [Het domein van een term](#a-terms-domain).
- `Category`, `English Name`, elke `Description` en de `Synonyms` van een term zijn notities. Ze veranderen niets, en geen enkele controle leest ze.

In een [weergavetaal van rechts naar links](./language-and-theme.md#right-to-left-languages) zijn de balk, het rastermenu en de statusregel gespiegeld, terwijl de bladen en de domeinlijst van een term van links naar rechts blijven.

## Fysieke namen afleiden {#deriving-physical-names}

De woordenboeken kunnen een tabel of kolom haar fysieke naam geven, de naam die Schema SQL en de Codegenerator schrijven, op basis van haar logische naam. Eerst wordt gezocht naar een term waarvan de `Term` de logische naam is; anders wordt de naam samengesteld uit de afkortingen van de woorden.  
Bijvoorbeeld met de woorden `Customer` (`CUST`), `Name` (`NM`), `Number` (`NO`), `Order` (`ORD`) en `Date` (`DT`), en de term `Customer Number` met de fysieke naam `CUST_NO` en het domein `Number`, waarvan het gegevenstype `INT` is:

- De logische naam `Customer Number` geeft een kolom de naam `CUST_NO`, koppelt haar aan `Number` en geeft haar het type `INT`.
- `Order Date` stelt `ORD_DT` samen.
- Een tabel met de logische naam `Customer` krijgt de naam `CUST`.

Met een leeg blad `Words` en een leeg blad `Terms` wordt niets afgeleid.

### Wanneer een naam wordt afgeleid {#when-a-name-is-derived}

Een fysieke naam wordt afgeleid wanneer er een logische naam wordt ingevoerd:

- Op het canvas, wanneer de editor van de cel van de logische naam sluit met een andere logische naam dan die waarmee hij opende, door `Enter`, `Tab`, `Escape` of een klik ergens anders. Elke toets die je typt, voert alleen de logische naam in — zie [Een logische naam invoeren](./logical-names.md#writing-a-logical-name).
- Meteen, wanneer je een term kiest uit de lijst onder de cel — zie [Termnamen aanvullen](./logical-names.md#completing-term-names).
- Wanneer een plakbewerking een cel van een logische naam vult — zie [Kolommen kopiëren/plakken](./table-editing.md#copyingpasting-columns).
- Wanneer [Zoeken en vervangen](./find-and-replace.md#replacing) een logische naam vervangt, één overeenkomst of allemaal.
- Wanneer een codeeragent een logische naam instelt.

De naam wordt alleen afgeleid zolang de fysieke naam leeg is of zelf is afgeleid — zie [Eigen namen](#names-of-your-own).  
Een gekozen term, een plakbewerking of een vervanging schrijft de logische naam en wat die afleidt als één stap in de geschiedenis. Op het canvas is de naam die bij het sluiten van de editor wordt afgeleid, een eigen stap in de geschiedenis na het typen: de eerste keer ongedaan maken draait de afgeleide naam terug, samen met het domein en het type die een term meebracht, en laat de logische naam staan die je hebt getypt.

Later wordt niets vanzelf opnieuw afgeleid. Een nieuwe `Abbreviation` van een woord, een nieuwe `Physical Name` of een nieuw `Domain` van een term en nieuwe woorden of termen laten de al afgeleide namen zoals ze zijn; gebruik daarvoor [Fysieke namen opnieuw afleiden](#derive-physical-names-again). Het `Data Type` van een domein is de uitzondering: dat bereikt zijn kolommen meteen.

### Uit een term {#from-a-term}

Op het blad `Terms` wordt eerst gezocht naar een term waarvan de `Term` gelijk is aan de logische naam. Spaties aan beide uiteinden en de Unicode-normalisatievorm worden genegeerd, maar het hoofdlettergebruik telt, dus `customer number` komt niet overeen met `Customer Number`. Van twee termen met dezelfde naam telt de eerste op het blad.

- De term geeft zijn `Physical Name`, of, zolang die leeg is, de naam die zijn woorden samenstellen, zoals hieronder, als ze er een samenstellen.
- Bij een kolom koppelt de term ook zijn `Domain`, zolang het blad `Domains` dat domein bevat, waardoor de kolom het gegevenstype van het domein krijgt — zie [Een kolom koppelen](#linking-a-column). Dat gebeurt ook als de term geen naam geeft. Een term zonder domein ontkoppelt niets.
- Een tabel neemt alleen de fysieke naam van de term over.

### Uit de woorden {#from-the-words}

Zonder overeenkomende term stellen de woorden de naam samen:

1. De logische naam wordt gesplitst bij spaties, `_`, `-`, `·` en `/`, en geen enkel woord loopt over een splitsing heen.
2. Elk stuk wordt van links gelezen, waarbij op elk punt de langste tekst wordt genomen die het blad `Words` vermeldt, als `Word`, synoniem of verboden woord, zonder ooit terug te gaan. Met de woorden `가입`, `가입일` en `일자` wordt `가입일자` gelezen als `가입일` en `자`, waardoor `자` niet geregistreerd is, terwijl `가입 일자` wordt gelezen als `가입` en `일자`. Het hoofdlettergebruik telt: `member` is niet het woord `Member`.
3. De fysieke naam bestaat uit de `Abbreviation` van elk woord zoals die is getypt, verbonden met `_`, zoals `ORD_DT`. Van twee woorden met dezelfde naam geeft het eerste op het blad de afkorting. Er geldt geen lengtelimiet, en `Table Name Case` en `Column Name Case` van de Codegenerator spelen geen rol.

Het is alles of niets. Als een deel een synoniem, een verboden woord of tekst is die geen enkel woord vermeldt, of als een woord een lege `Abbreviation` heeft, wordt er geen naam samengesteld en blijft de fysieke naam zoals hij is.

### Eigen namen {#names-of-your-own}

De woordenboeken vullen een fysieke naam alleen in zolang die leeg is of zelf door hen is ingevuld. De editor onthoudt dit voor elke tabel en kolom, al is daar op het canvas niets van te zien.

- Een naam die je zelf invoert, wordt een eigen naam: typen in een naamcel, een tabel- of kolomnaam vervangen met Zoeken en vervangen, over de naamcel van een kolom heen plakken en het hernoemen door een codeeragent. Een logische naam die later wordt ingevoerd, laat hem zoals hij is, voert alleen de logische naam in en koppelt geen domein.
- Als je de naam wist, geef je hem terug aan de woordenboeken, omdat een lege naam altijd wordt afgeleid.
- Een logische naam die niets afleidt, laat de fysieke naam en zijn status zoals ze waren: een lege naam blijft leeg, en een afgeleide naam blijft ongewijzigd en blijft van de woordenboeken.
- Een nieuwe tabel of kolom begint met een lege naam, dus haar eerste logische naam leidt die naam af. Een kolom met refererende sleutel die een relatie toevoegt, wordt naar haar sleutel genoemd en geldt als je eigen naam — zie [Namen van kolommen met refererende sleutel](./relationship-editing.md#foreign-key-column-names).
- De namen die een `Import` of `Import and Add` van Schema SQL, GraphQL, DBML of AML binnenhaalt, en de namen van een diagram dat is gemaakt met een versie van vóór het tabblad Woordenboek, gelden als je eigen namen, dus een logische naam die je er later bij invoert, leidt niets af.
- Een [gedupliceerde tabel](./table-related-functions.md#duplicating-tables-and-memos), een kolom die met haar sleepgreep [naar een andere tabel is verplaatst](./table-editing.md#rearranging-and-moving-columns), het plakken van gekopieerde tabellen en `Import and Add` van een JSON-bestand behouden de status van elke naam. De namen van kolommen die als nieuwe kolommen in geselecteerde tabellen worden geplakt, gelden als je eigen namen, tenzij de geplakte naam leeg is en hun logische naam er een afleidt.
- [Fysieke namen opnieuw afleiden](#derive-physical-names-again) geeft een eigen naam terug aan de woordenboeken, ook een geïmporteerde.

### Twee kolommen, één naam {#two-columns-one-name}

Een kolom leidt niets af wanneer een andere kolom van haar tabel al de naam heeft die ze zou afleiden. Ze behoudt haar naam, haar status en haar domeinkoppeling, en alleen haar logische naam wordt geschreven. De namen worden vergeleken zonder op hoofdlettergebruik en de spaties eromheen te letten, zoals bij namen van kolommen met refererende sleutel.  
Wanneer één wijziging twee kolommen dezelfde naam zou geven, zoals `Replace All` of `Derive Physical Names Again` op een tabel kan doen, krijgt de eerste kolom in de tabel die naam.  
Een zelfverwijzende relatie op `members` met de sleutel `MBR_NO` voegt bijvoorbeeld `MBR_NO_2` toe, die de logische naam `Member Number` overneemt. `Derive Physical Names Again` zou haar `MBR_NO` noemen, wat de sleutel al heeft, dus ze behoudt `MBR_NO_2`.  
Voor tabellen geldt zo'n regel niet: twee tabellen kunnen dezelfde naam afleiden.

## Fysieke namen opnieuw afleiden {#derive-physical-names-again}

Gebruik `Derive Physical Names Again` nadat je de `Abbreviation` van een woord of de `Physical Name` of het `Domain` van een term hebt gewijzigd, omdat die wijzigingen op zichzelf niets hernoemen. Het geeft de namen die het omvat terug aan de woordenboeken en leidt ze opnieuw af volgens de regels hierboven, ook namen die je zelf hebt ingevoerd. Het wordt alleen op het ERD-tabblad aangeboden, en niet in een editor in alleen-lezenmodus:

- Het contextmenu van de tabel, direct na `Focus on this table` of `Focus on selected tables`. Zolang de tabel een van twee of meer geselecteerde tabellen is, omvat `Derive Physical Names Again` ze allemaal, waar je ook met de rechtermuisknop op de tabel klikt. Anders geeft een klik met de rechtermuisknop op de rij van een kolom `Derive Physical Name Again`, voor alleen die kolom, en een klik op de kop `Derive Physical Names Again`, voor de naam van de tabel en elke kolom.
- Het contextmenu van het canvas, direct na `Name View`: `Derive Physical Names Again`, voor elke tabel en kolom in het diagram. Het ontbreekt zolang het diagram geen tabel heeft.
- [Snel zoeken](./quick-search.md#what-the-palette-lists), als rijen voor de gefocuste kolom, de gefocuste tabel, de geselecteerde tabellen en het hele diagram.

![De afkorting van Number op het blad Words wijzigen van NO in NUM, waarbij de fysieke namen MBR_NO en PAY_NO in het diagram blijven, en daarna Derive Physical Names Again uit het canvasmenu, dat ze verandert in MBR_NUM en PAY_NUM, terwijl ORD_NO, dat zijn term geeft, blijft](/img/demo-derive-physical-names.webp)

Elke tabel en kolom die erbinnen valt en een logische naam heeft, wordt opnieuw afgeleid. Een kolom krijgt ook het domein dat haar term geeft, en daarmee het type van het domein, dat zich langs de relaties verspreidt zolang [Gegevenstypen via relaties synchroniseren](./settings.md#relationship-datatype-sync) aanstaat.  
Het laat een tabel of kolom zonder logische naam met rust, en ook een kolom waarvan de nieuwe naam al bij een andere kolom van haar tabel hoort — zie [Twee kolommen, één naam](#two-columns-one-name). Elk daarvan behoudt zijn naam en status, eigen of van de woordenboeken, en een kolom behoudt ook haar domeinkoppeling.  
Een logische naam die nu niets afleidt, laat de fysieke naam zoals hij is, maar geeft hem terug aan de woordenboeken, zodat de volgende logische naam die je invoert hem afleidt.  
Het is één stap in de geschiedenis, hoeveel namen, koppelingen en typen het ook wijzigt. Het legt alleen geen stap vast als het niets wijzigt, en een eigen naam teruggeven aan de woordenboeken geldt als een wijziging, ook als de naam al gelijk is aan wat zij geven.

De eigen `Physical Name` van een term wordt niet opnieuw samengesteld uit gewijzigde woorden, dus bewerk de term voordat je opnieuw afleidt.

## Domeinen en gegevenstypen {#domains-and-data-types}

Een kolom die aan een domein is gekoppeld, heeft het `Data Type` van het domein. Als je een kolom koppelt, krijgt ze dat type meteen.  
Wanneer het `Data Type` van een domein verandert, of het nu op het blad `Domains` is bewerkt, geplakt of geïmporteerd of door een medebewerker of codeeragent is gewijzigd, krijgt elke kolom die eraan is gekoppeld het nieuwe type in dezelfde stap. Zolang [Gegevenstypen via relaties synchroniseren](./settings.md#relationship-datatype-sync) aanstaat, gaat elk van die wijzigingen verder langs de relaties zoals een getypte wijziging dat doet; zolang die uitstaat, veranderen alleen de gekoppelde kolommen.  
Als je de naam van een domein wijzigt, verandert alleen de naam die de domeincellen van de kolommen tonen.

Een typewijziging op het blad `Domains` wordt daar ongedaan gemaakt, samen met de kolomtypen die ze heeft gegeven — zie [Woordenboekbladen](./undo-redo.md#dictionary-sheets).  
Wanneer je op het ERD-tabblad iets ongedaan maakt of opnieuw uitvoert en daarmee een kolom opnieuw aan een domein koppelt, of een gekoppelde kolom terugbrengt, krijgt de kolom het type van het domein zoals het nu is. Zet die stap een ander type terug, dan wordt de kolom ontkoppeld.

### Een kolom koppelen {#linking-a-column}

Een kolom wordt aan een domein gekoppeld door:

- Het domein te kiezen in de domeincel van de kolom, die via View Option → `Domain` wordt getoond, of, in de weergave `Logical Names`, in de typecel die haar plaats inneemt — zie [De domeincel](./logical-names.md#the-domain-cell).
- Een logische naam waarvan de term een domein geeft — zie [Uit een term](#from-a-term). Dit gebeurt alleen zolang de naam wordt afgeleid, dus niet bij een eigen naam of bij een kolom waarvan de afgeleide naam al bij een andere kolom hoort.
- `Derive Physical Name Again` of `Derive Physical Names Again`, dat het domein koppelt van de term van elke kolom die erbinnen valt.
- Een relatie: een kolom met refererende sleutel neemt het domein van haar sleutel over, samen met het type en de logische naam — zie [Identificerende relaties](./relationship-editing.md#identifying-relationships). Een sleutel waarvan de kopie een ander type krijgt, zoals bij een serial-sleutel, geeft geen domein door.
- Haar tabel te dupliceren, of haar met haar sleepgreep naar een andere tabel te verplaatsen, wat in beide gevallen de koppeling behoudt. Het plakken van gekopieerde tabellen of kolommen behoudt de koppeling alleen zolang dit diagram het domein bevat en het domein nog het type van de gekopieerde kolom heeft, dus een kopie uit een ander diagram komt zonder koppeling binnen — zie [Tabellen en memo's kopiëren/plakken](./table-related-functions.md#copyingpasting-tables-and-memos). `Import and Add` koppelt geen enkele kolom.
- De naam van een domein die in een domeincel wordt geplakt — zie [Kolommen kopiëren/plakken](./table-editing.md#copyingpasting-columns).

### Ontkoppelen {#unlinking}

- Een type typen in de cel `DataType` van een gekoppelde kolom, of een suggestie accepteren, ontkoppelt de kolom zodra haar type afwijkt van dat van haar domein, en de kolom behoudt het type dat je hebt getypt — zie [Gegevenstypen automatisch aanvullen](./table-editing.md#datatype-autocomplete). Als je het type van het domein opnieuw typt, wordt ze niet opnieuw gekoppeld; kies in plaats daarvan het domein in haar domeincel. Plakken over de cel `DataType` en een typewijziging door een codeeragent ontkoppelen op dezelfde manier.
- Zolang de instelling Gegevenstypen via relaties synchroniseren aanstaat, wordt elke kolom die door een typewijziging wordt bereikt en waarvan het nieuwe type afwijkt van dat van haar eigen domein, in dezelfde stap ontkoppeld, zoals een refererende sleutel die aan een eigen domein is gekoppeld. [Kolommen toewijzen](./relationship-editing.md#map-columns) ontkoppelt op dezelfde manier de kolommen die het een ander type geeft.
- `None` in de domeincel ontkoppelt de kolom en behoudt haar type.
- Het `Domain` van een term wijzigen of wissen, of een term verwijderen, verandert geen enkele kolom.

### Een domein verwijderen {#removing-a-domain}

Als je de rij van een domein verwijdert, behouden zijn kolommen hun type en blijven hun koppelingen bestaan. De kolommen tonen geen domein, en het blad `Checks` vermeldt `Unknown domain` voor elk van hen zolang het blad `Domains` nog een domein bevat. Als je de verwijdering op het blad `Domains` ongedaan maakt, worden de koppelingen weer getoond.  
Zolang het domein weg is, wordt zo'n kolom definitief ontkoppeld als je er een ander type dan dat van het domein in typt, en `None` in haar domeincel doet dat ook.  
Het bestand laat die koppelingen weg wanneer het wordt opgeslagen, dus het diagram opent opnieuw met die kolommen niet gekoppeld.

Een term die aan een verwijderd domein is gekoppeld, toont een lege cel `Domain`, gemarkeerd als `Unknown domain`. `Delete` of `Backspace` op de cel ontkoppelt de term — zie [Het domein van een term](#a-terms-domain).

## Het blad Controles {#the-checks-sheet}

Het blad `Checks` toont wat de controles van de woordenboeken vinden in de woordenboeken en in de tabellen en kolommen van het diagram. De controles lezen alleen: ze veranderen niets.  
Elke controle draait alleen zolang het blad dat ze leest een rij bevat, en de woordcontroles alleen zolang het blad `Words` een woord met een naam bevat, dus een diagram met lege woordenboeken toont niets.

![Customer Num rood en Order Stat amber in Logical Names, het blad Checks met hun drie controles en een rood aantal, een dubbelklik op de rij Forbidden word die teruggaat naar Customer Num in het diagram, en het opnieuw typen ervan als Member Number, waarna één controle overblijft](/img/demo-dictionary-checks.webp)

De drie kolommen ervan zijn alleen-lezen:

- `Type` noemt de controle — zie [Wat elke controle vindt](#what-each-check-finds).
- `Target` noemt een woord, term of domein bij zijn naam, een tabel bij haar naam en een kolom als `table.column`, waarbij tabel en kolom worden genoemd zoals de [naamweergave](./logical-names.md#beyond-the-canvas) ze noemt, met `unnamed` waar de weergave geen naam toont.
- `Detail` toont wat de controle heeft gevonden en, na `→`, wat de woordenboeken in plaats daarvan aanbieden, meerdere gescheiden door komma's, zoals `멤버 → 회원`. Een lege kant toont `—`, zoals in `— → NUMERIC(15)`.

Eerst komen de controles van de woorden, dan die van de termen en de domeinen, en daarna tabel voor tabel, elke tabel gevolgd door haar kolommen.  
De lijst volgt elke bewerking zodra die binnenkomt, ook die van een medebewerker en van een codeeragent, en elk wisselen van naamweergave.  
Het aantal op de knop `Checks` is rood zolang een controle een fout is, amber zolang ze allemaal waarschuwingen zijn, en gedempt als er geen zijn.

De rijen kunnen niet worden bewerkt, toegevoegd, verwijderd, gesorteerd, geïmporteerd of geëxporteerd: de balk toont geen tools, een klik met de rechtermuisknop opent geen rastermenu, en ongedaan maken en opnieuw uitvoeren doen niets. Zoeken, selecteren en kopiëren werken zoals op de andere bladen.

`Enter` of een dubbelklik op een rij gaat naar wat die rij noemt:

- Een woord, term of domein: het tabblad toont het bijbehorende blad met de cel die de controle leest geselecteerd, de naam of het `Domain` van een term, en de rij bovenaan in beeld. De zoekopdracht van het blad wordt gewist als die de rij verbergt. Een rij die sindsdien is verwijderd, gaat nergens heen.
- Een tabel of kolom: het ERD-tabblad verschijnt met alleen die tabel geselecteerd en de cel die de controle leest gefocust. Dat is de naam, de logische naam of de domeincel, of, waar de rij die cel niet toont, de cel die in haar plaats wordt getoond. Het canvas krijgt de toetsenbordfocus, en de weergave verplaatst zich volgens de regel in [Waar een sprong terechtkomt](./table-related-functions.md#where-a-jump-lands).

Een dubbelklik op een kolomkop, een kolomrand, een schuifbalk of onder de rijen gaat nergens heen.  
Een codeeragent vraagt dezelfde controles in dezelfde volgorde op met `erd_list_checks` — zie [Woordenboekcontroles](../../mcp/tools.md#dictionary-checks).

De andere drie bladen markeren de cellen die de controles lezen, een naam of het `Domain` van een term, met rode of amberkleurige tekst op een getinte achtergrond:

- Rood: een naam die een andere rij van hetzelfde blad ook heeft, een `Domain` van een term dat aan een verwijderd domein is gekoppeld, en een `Term` die een verboden woord gebruikt.
- Amber: een `Term` die een synoniem of een niet-geregistreerd woord gebruikt.

Een cel krijgt het zwaarste van haar niveaus. De markeringen verschijnen ook in een editor in alleen-lezenmodus, en het blad `Checks` zelf wordt niet gekleurd. Zie [Markeringen op het canvas](#marks-on-the-canvas) voor de markeringen op het ERD-canvas.

### Wat elke controle vindt {#what-each-check-finds}

| `Type` | Niveau | Vindt | `Detail`, bijvoorbeeld |
| --- | --- | --- | --- |
| `Duplicate name` | Fout | Een `Word`, `Term` of `Domain` die een andere rij van hetzelfde blad ook heeft. Elk van de rijen wordt vermeld. | `Member` |
| `Unknown domain` | Fout | Een kolom of term die nog aan een verwijderd domein is gekoppeld, zolang het blad `Domains` een domein bevat | De naam van het verwijderde domein |
| `Forbidden word` | Fout | Een deel van een logische naam of van een `Term` dat een woord in zijn `Forbidden Words` vermeldt | `커스터머 → 고객` |
| `Unregistered word` | Waarschuwing | Een deel van de logische naam van een tabel of kolom, of van een `Term`, dat geen enkel woord vermeldt | `자` |
| `Synonym` | Waarschuwing | Een deel dat een woord in zijn `Synonyms` vermeldt | `멤버 → 회원` |
| `Physical name mismatch` | Waarschuwing | Een tabel of kolom waarvan de logische naam overeenkomt met een term, maar waarvan de fysieke naam niet de naam is die de term geeft | `mbr_no → MBR_NO` |
| `Domain type mismatch` | Waarschuwing | Een kolom waarvan het `DataType` niet het `Data Type` is van het domein waaraan ze is gekoppeld | `INT → NUMERIC(15)` |

- Namen worden vergeleken zonder de spaties eromheen en met inachtneming van hoofdlettergebruik, dus `Member` en `member` zijn twee namen, en een lege naam is nooit dubbel. De bladen weigeren een bewerking die twee rijen dezelfde naam zou geven, dus `Duplicate name` verschijnt alleen waar twee bewerkingen elkaar kruisten, zoals bij twee medebewerkers die tegelijk rijen een naam geven, of in een bestand dat elders is bewerkt.
- De woordcontroles lezen een naam zoals [Uit de woorden](#from-the-words) beschrijft, en vermelden elk verschillend deel één keer per naam. `Forbidden word` en `Synonym` bieden het woord aan dat het deel vermeldt.
- `Physical name mismatch` vergelijkt de naam, zonder de spaties eromheen, met de `Physical Name` van de term, of, zolang die leeg is, met wat de woorden van de term samenstellen, en meldt niets zolang de term geen naam geeft. Een kolom met refererende sleutel die de logische naam van haar sleutel heeft overgenomen, toont deze controle telkens als haar eigen naam afwijkt van die van de term, zoals `members_id → MBR_ID`. `Derive Physical Name Again` lost dat op, tenzij een andere kolom die naam heeft.
- `Domain type mismatch` ontstaat nooit door bewerkingen in één editor, omdat een gekoppelde kolom altijd eindigt bij het type van haar domein. Het kan ontstaan wanneer een medebewerker een kolom koppelt terwijl een ander het type van dat domein wijzigt, of in een bestand dat elders is geschreven. Als je het domein opnieuw kiest in de domeincel van de kolom, krijgt de kolom het type ervan, en `None` ontkoppelt haar. Een koppeling aan een verwijderd domein verschijnt alleen als `Unknown domain`.

### Markeringen op het canvas {#marks-on-the-canvas}

Het ERD-canvas toont een naam die de controles signaleren, in de kleur van de betreffende controle:

- Een cel van een logische naam, in de kop van de tabel of in de rij van een kolom, is rood zolang de logische naam een verboden woord gebruikt, en anders amber zolang hij een synoniem gebruikt of een woord dat op het blad `Words` ontbreekt.
- Een cel van een fysieke naam, in de kop of in een rij, is amber zolang de term waarmee de logische naam overeenkomt een andere fysieke naam geeft.

Alleen die twee soorten cellen worden gemarkeerd, nooit de domeincel of de cel `DataType`, dus `Unknown domain` en `Domain type mismatch` van een kolom verschijnen alleen op het blad `Checks`.  
Een cel wordt alleen gemarkeerd voor wat ze toont: `Physical Names` kan alleen fysieke namen markeren, `Logical Names` alleen logische namen, en `Both Names` elke cel volgens haar eigen controles — zie [Naamweergave](./logical-names.md#name-view). Een lege cel behoudt de kleur van haar tijdelijke aanduiding, en lege woordenboeken markeren niets.  
Op de kop van een tabel in een gekleurde [tabelgroep](./table-groups.md) behoudt een markering haar kleur alleen zolang ze leesbaar blijft op de kleur van de groep; anders krijgt de naam het eigen zwart of wit van de kop.

De markeringen verschijnen op het ERD-canvas, in [Tijdreizen](./undo-redo.md#time-travel) en in het voorbeeld van [Automatische indeling](./table-related-functions.md#auto-layout), ook in een editor in alleen-lezenmodus. Het tabblad Visualisatie, de twee kanten van de [Verschilweergave](./table-related-functions.md#diff-viewer) en een geëxporteerde afbeelding tonen er geen.  
Ze volgen elke wijziging terwijl die plaatsvindt, of die nu een naam betreft of een woord, term of domein.

## Zoeken {#searching}

Het zoekveld toont `Search` en staat op alle vier bladen, ook in een editor in alleen-lezenmodus. Elk blad heeft een eigen zoekopdracht.  
Een rij komt overeen wanneer een van de doorzochte cellen de tekst bevat, waarbij hoofdlettergebruik, de Unicode-normalisatievorm en spaties rond de zoektekst worden genegeerd. Een overeenkomst loopt nooit over twee cellen. De doorzochte cellen:

- `Domains`: `Domain`, `Data Type` en `Description`.
- `Words`: `Word`, `Abbreviation`, `English Name` en `Description`.
- `Terms`: `Term`, `Physical Name` en `Description`.
- `Checks`: alle drie, zoals ze in de weergavetaal worden getoond.

Een nieuwe zoekopdracht zet de selectie op de eerste cel en scrolt naar boven.  
Zolang het veld tekst bevat, maakt een knop `x` met de knopinfo `Clear search` het leeg en laat de tekstcursor in het veld staan. `Escape` in het veld maakt het ook leeg.  
In het veld maakt `Ctrl + Z` (Windows/Linux) of `⌘ + Z` (Mac) je typen ongedaan, niet het blad, en zijn de rijtoetsen van [Rijen toevoegen en verwijderen](#adding-and-deleting-rows) teksttoetsen.  
`Add Row` en het invoegen van rijen wissen eerst de zoekopdracht, omdat een lege rij met geen enkele zoekopdracht overeenkomt. Een import laat de zoekopdracht staan.

## Selecteren en navigeren {#selecting-and-moving}

Het raster selecteert zoals een spreadsheet dat doet:

- Een klik selecteert een cel, en slepen selecteert een bereik, waarbij aan de rand van het blad wordt gescrold. `Shift + click` breidt de selectie uit vanaf de actieve cel, en `Ctrl + click` (Windows/Linux) of `⌘ + click` (Mac) voegt een ander bereik toe.
- Een kolomkop selecteert zijn kolom, een rijnummer zijn rij en de linkerbovenhoek elke cel, zoals `Ctrl + A` (Windows/Linux) of `⌘ + A` (Mac) doet.
- Op een Mac is `Ctrl + click` een klik met de rechtermuisknop — zie [Het rastermenu](#the-grids-menu).

Met het toetsenbord:

- De pijltoetsen gaan één cel verder, en met `Ctrl` (Windows/Linux) of `⌘` (Mac) ingedrukt gaan ze in die richting naar de rand van het blad.
- `Home` en `End` gaan naar de eerste en laatste cel van de rij, en met `Ctrl` of `⌘` ingedrukt naar de eerste en laatste cel van het blad.
- `Page Up` en `Page Down` gaan een scherm met rijen verder.
- Als je `Shift` ingedrukt houdt bij een van de toetsen hierboven, wordt in plaats daarvan de selectie uitgebreid.
- `Tab` en `Shift + Tab` gaan naar rechts en links, en `Shift + Enter` gaat omhoog. `Enter` alleen bewerkt de cel — zie [Cellen bewerken](#editing-cells).

Wanneer rijen onder de selectie verdwijnen, door ongedaan maken of doordat een medebewerker ze verwijdert, wordt de selectie teruggebracht binnen de overgebleven rijen.

Sleep de rechterrand van een kolomkop om de grootte van de kolom te wijzigen, of dubbelklik op de rand om de kolom aan te passen aan de breedste tekst in de rijen die in beeld zijn. Geen enkele toets wijzigt de grootte van een kolom.

## Cellen bewerken {#editing-cells}

Typen op de geselecteerde cel vervangt haar waarde. `Enter`, `F2` of een dubbelklik bewerkt de waarde zoals die is, met de tekstcursor aan het einde.  
Een cel bevat één regel, dus een tab of regeleinde dat erin wordt geplakt, wordt een spatie.

- `Enter` schrijft de bewerking weg en gaat omlaag, en `Tab` schrijft haar weg en gaat naar rechts. Met `Shift` gaan ze omhoog of naar links.
- Een klik ergens anders, of de toetsenbordfocus die het raster verlaat, schrijft haar ook weg.
- `Escape` annuleert haar.

![Het blad Words bewerken: NUM over een cel typen en op Enter drukken, een rij invoegen met ⌥ + Enter en die met Tab vullen, sorteren op Word via het rastermenu, daarna zoeken naar ord en de zoekopdracht leegmaken met Esc](/img/demo-dictionary-editing.webp)

Een bewerking die de waarde laat zoals die was, schrijft niets, en een weggeschreven bewerking is één stap in de geschiedenis van haar blad, hoeveel er ook is getypt.  
`Delete` of `Backspace` maakt, als er geen bewerking open is, elke geselecteerde cel leeg, als één stap.  
Zolang een bewerking open is, maken de toetsen voor ongedaan maken en opnieuw uitvoeren je typen in de cel ongedaan en voeren ze het opnieuw uit, en typen de rijtoetsen tekst — zie [Toetsen op het tabblad](#keys-on-the-tab).  
Elke cel op `Checks`, en elke cel in een editor in alleen-lezenmodus, is alleen-lezen en opent geen bewerking.

Wanneer een rij van een bewerking, een plakbewerking of een wisbewerking wordt geweigerd, wordt er niets van opgeslagen, en een foutmelding zegt waarom, met het aantal rijen en de namen van de eerste drie:

- Een naam die een andere rij van het blad heeft, of die een andere rij van dezelfde plakbewerking schrijft: `Nothing saved: 1 row shares a name with another row (Member)`, of `Nothing saved: 2 rows share a name with another row (…)`. Namen worden vergeleken zonder de spaties eromheen en met inachtneming van hoofdlettergebruik, dus `Member` en `member` verschillen. Een lege naam wordt nooit geweigerd.
- Een `Domain` van een term, opgegeven als tekst die geen enkel domein op het blad `Domains` heeft: `Nothing saved: 1 row names an unknown domain (…)`.
- Een rij die een medebewerker heeft verwijderd terwijl jij haar bewerkte: `Nothing saved: the row was removed`.

Een schrijfactie kan verder reiken dan haar cel:

- Een term die een `Term` krijgt terwijl zijn `Physical Name` leeg is, krijgt de naam die zijn woorden samenstellen, als ze er een samenstellen — zie [Uit de woorden](#from-the-words). Dit gebeurt één keer: de naam wordt niet opnieuw samengesteld als de woorden later veranderen.
- Een nieuw `Data Type` van een domein wijzigt het type van elke kolom die aan het domein is gekoppeld, in dezelfde stap in de geschiedenis — zie [Domeinen en gegevenstypen](#domains-and-data-types).

### Het domein van een term {#a-terms-domain}

`Enter`, `F2` of een dubbelklik op de cel `Domain` van een term opent een lijst onder de cel, of erboven waar meer ruimte is, met een zoekveld dat `Domain` toont.  
De lijst bevat `None` en daarna elk domein met een naam in de volgorde van het blad `Domains`, en de markering begint bij het domein waaraan de term is gekoppeld, of bij `None`. Als je een teken typt op de cel, opent de lijst al gefilterd op dat teken.

- Typen beperkt de lijst tot de domeinen waarvan de naam de tekst bevat, ongeacht hoofdlettergebruik, laat `None` weg en markeert de eerste overeenkomst.
- `↑` en `↓` verplaatsen de markering, die aan beide uiteinden rondloopt.
- `Enter` of `Tab` kiest de gemarkeerde rij, en een klik de aangeklikte rij, als één stap in de geschiedenis. De term wordt gekoppeld aan precies het gekozen domein, ook als dat een van twee domeinen met dezelfde naam is, en `None` ontkoppelt hem.
- `Escape` of een klik erbuiten sluit de lijst zonder iets van het getypte weg te schrijven.

Zonder domein met een naam op het blad `Domains` opent het veld zonder lijst.  
Geplakte tekst koppelt het eerste vermelde domein met die naam, lege tekst ontkoppelt, en tekst die gelijk is aan wat de cel toont, laat de koppeling zoals ze is. Elke andere naam wordt geweigerd — zie [Cellen bewerken](#editing-cells). `Delete` of `Backspace` op de cel ontkoppelt de term, ook van een verwijderd domein.

## Kopiëren en plakken {#copying-and-pasting}

`Ctrl + C` (Windows/Linux) of `⌘ + C` (Mac) kopieert de selectie als door tabs gescheiden tekst, één regel per rij, zoals spreadsheets die schrijven, zodat ze in een spreadsheet als cellen wordt geplakt. Een tab of regeleinde binnen een waarde wordt een spatie.  
Meerdere bereiken worden alleen samen gekopieerd als ze dezelfde rijen beslaan, naast elkaar, of dezelfde kolommen, boven elkaar. Anders wordt er niets gekopieerd en verschijnt de foutmelding `Nothing copied: the ranges share no rows or columns`.

`Ctrl + V` (Windows/Linux) of `⌘ + V` (Mac) plakt door tabs gescheiden tekst, zoals cellen die uit een spreadsheet zijn gekopieerd, vanaf de actieve cel naar beneden en naar rechts:

- Aanhalingstekens worden als tekst geplakt, dus een spreadsheetcel met een regeleinde wordt niet als één cel geplakt.
- Eén enkele waarde vult elk geselecteerd bereik.
- Rijen na de laatste rij worden op volgorde als nieuwe rijen toegevoegd, dus plakken in een leeg blad vult het.
- Kolommen na de laatste kolom worden weggelaten, en zodra de rest is opgeslagen, zegt de melding `Columns past the last one weren't pasted` dat.
- Een plakbewerking van meerdere cellen selecteert daarna het blok dat ze heeft geschreven.

Een plakbewerking is één stap in de geschiedenis, de rijen die ze toevoegt inbegrepen, en wordt als geheel geweigerd bij een dubbele naam of een onbekend domein — zie [Cellen bewerken](#editing-cells).  
Kopiëren, plakken of wissen over meer dan een miljoen cellen doet niets, en de foutmelding `Nothing done: the selection covers too many cells` verschijnt.  
Knippen, `Ctrl + X` (Windows/Linux) of `⌘ + X` (Mac), doet niets op een blad. Kopiëren en plakken op dit tabblad bereiken het diagram nooit, en zolang een celbewerking open is, werken ze op de tekst in de cel.

## Rijen toevoegen en verwijderen {#adding-and-deleting-rows}

`Add Row` voegt één lege rij toe aan het einde van het blad. Het wist de zoekopdracht, selecteert de eerste cel van de nieuwe rij en geeft het raster de toetsenbordfocus, zodat typen die cel vult.  
`Delete Rows` verwijdert elke rij die de selectie beslaat, in welke kolom dan ook, en één keer ongedaan maken zet ze allemaal terug op hun plaats. De knopinfo noemt de toets die hetzelfde doet.

Met de toetsenbordfocus in het raster en zonder dat er een cel wordt bewerkt:

- `Alt + Enter` (Windows/Linux) of `⌥ + Enter` (Mac) voegt onder de selectie evenveel lege rijen in als ze beslaat.
- `Alt + Shift + Enter` (Windows/Linux) of `⌥ + Shift + Enter` (Mac) voegt ze erboven in.
- `Alt + Backspace` of `Alt + Delete` (Windows/Linux), of `⌥ + Backspace` of `⌥ + Delete` (Mac), verwijdert de rijen die de selectie beslaat.

Ze doen wat de items voor invoegen en verwijderen in het rastermenu doen — zie [Het rastermenu](#the-grids-menu). Invoegen wist de zoekopdracht en plaatst de nieuwe rijen direct boven de eerste rij die de selectie beslaat, of direct onder de laatste. Het selecteert ze in de eerste kolom, met de eerste ervan actief, en is één stap in de geschiedenis.

Deze toetsen zijn de toewijzingen `Add Column` en `Remove Column` van het tabblad [Sneltoetsen](./settings.md#shortcuts), dus een host die die toewijzingen met [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) wijzigt, verplaatst ook deze toetsen. `Alt + Shift + Enter` is de toets van `Add Column` met `Shift` erbij en heeft daar geen eigen rij.  
In een open bewerking en in het zoekveld zijn het teksttoetsen, dus op een Mac verwijdert `⌥ + Backspace` een woord. Op `Checks` en in een editor in alleen-lezenmodus doen ze niets. Op dit tabblad voegen ze nooit een kolom van een tabel toe en verwijderen ze er nooit een.  
In Obsidian bereiken ze het tabblad, ook waar een sneltoets van Obsidian dezelfde toets gebruikt.

Een rij die nooit is ingevuld, of waarvan elke waarde is gewist, verschijnt op haar blad en bereikt medebewerkers, maar het bestand laat haar weg, dus ze is verdwenen wanneer het diagram opnieuw wordt geopend.

## Het rastermenu {#the-grids-menu}

Klik met de rechtermuisknop op een cel op `Domains`, `Words` of `Terms` om het rastermenu te openen. Een cel buiten de selectie wordt eerst de selectie.  
Een klik met de rechtermuisknop onder de laatste rij of rechts van de laatste kolom opent het voor de selectie zoals die is, dus op een leeg blad gaat het overal onder de kolomkoppen open. De menutoets of `Shift + F10` opent het voor de actieve cel.

- `Insert 1 row above`, `Insert 1 row below` en `Delete 1 row`, die elk het aantal rijen noemen dat de selectie beslaat, zoals in `Insert 3 rows above`, met hun toets rechts — zie [Rijen toevoegen en verwijderen](#adding-and-deleting-rows).
- `Sort by <column>, ascending` en `Sort by <column>, descending`, met de naam van de kolom waarop je met de rechtermuisknop hebt geklikt, zoals in `Sort by Word, ascending` — zie [Sorteren](#sorting). Rechts van de laatste kolom ontbreken ze.
- `Import CSV` en `Export CSV`, die doen wat de knoppen op de balk doen — zie [CSV importeren en exporteren](#importing-and-exporting-csv).

Als er geen rij zichtbaar is, op een leeg blad of bij een zoekopdracht die nergens mee overeenkomt, verschijnen alleen `Insert 1 row below`, `Import CSV` en `Export CSV`.  
`Checks` en een editor in alleen-lezenmodus openen in plaats daarvan het eigen menu van de browser, en een klik met de rechtermuisknop op een kolomkop of een schuifbalk ook.  
Het menu sluit bij een keuze, bij `Escape`, bij een druk ergens anders in het tabblad, wanneer de selectie of het blad verandert, en wanneer de rijen van het blad veranderen, door jouw bewerking of die van een medebewerker.

## Sorteren {#sorting}

`Sort by <column>, ascending` en `Sort by <column>, descending` herschikken de rijen van het blad zelf, niet alleen de weergave. De nieuwe volgorde wordt in het bestand opgeslagen, is zichtbaar voor medebewerkers en wordt gevolgd door `Export CSV`, en één keer ongedaan maken zet de oude volgorde terug.  
Rijen worden vergeleken op de tekst die de cel toont, het `Domain` van een term op de naam van het domein, in de alfabetische volgorde van de weergavetaal, waarbij getallen op waarde worden vergeleken, dus `2` komt vóór `10`. Lege cellen komen in beide richtingen achteraan, en rijen die gelijk zijn, behouden hun volgorde. Een blad sorteren dat al in die volgorde staat, legt niets vast.  
De zoekopdracht blijft zoals ze was, en de selectie ook, waarvan de cellen nu andere rijen bevatten.

## CSV importeren en exporteren {#importing-and-exporting-csv}

Elk van `Domains`, `Words` en `Terms` wordt uit een CSV-bestand ingelezen en naar een CSV-bestand weggeschreven. Deze bestanden horen bij het tabblad Woordenboek zelf: `Import` en `Export` in het contextmenu van het canvas lezen of schrijven ze niet — zie [Bestanden importeren of exporteren](./file-import-export.md).

### Importeren {#importing}

`Import CSV`, op de balk of in het rastermenu, opent de eigen bestandskiezer van de browser voor `.csv`-bestanden, niet het importdialoogvenster van de host. Als je hetzelfde bestand opnieuw kiest, wordt het opnieuw geïmporteerd.  
Het bestand gaat naar het woordenboek dat de koprij noemt, welk blad er ook wordt getoond, en het tabblad toont daarna dat blad en geeft het raster ervan de toetsenbordfocus. Het blad behoudt zijn zoekopdracht, selectie en scrollpositie, dus rijen die de zoekopdracht verbergt, of rijen die onder de weergave zijn toegevoegd, blijven uit beeld.  
Het bestand wordt gelezen als UTF-8, met of zonder bytevolgordemarkering (BOM), of als EUC-KR wanneer het geen geldige UTF-8 is, zoals bij oudere bestanden van de standaard voor openbare gegevens.

![Het tabblad Woordenboek openen via de werkbalk, daarna domeinen, woorden en termen importeren met Import CSV, waarbij elk bestand het tabblad naar zijn eigen blad schakelt en meldt wat het heeft toegevoegd](/img/demo-dictionary-import.webp)

Hoe de rijen terechtkomen:

- Elke rij met een naam werkt de rij met die naam op het blad bij, in de velden waarvoor het bestand kolommen heeft. Kolommen die in het bestand ontbreken, laten die velden zoals ze zijn. Namen worden vergeleken zonder de spaties eromheen en met inachtneming van hoofdlettergebruik.
- Namen die op het blad ontbreken, worden na de laatste rij toegevoegd, in de volgorde van het bestand.
- Een import verwijdert nooit een rij.
- Een rij met een lege naam wordt overgeslagen. Als het bestand een naam twee keer bevat, wint de latere rij en telt de eerdere als overgeslagen. Lege regels zijn geen rijen.
- Het domein van een term wordt op naam gevonden, het eerste domein met die naam, en een naam die geen enkel domein heeft, laat de term zonder koppeling, dus importeer eerst de domeinen.

Eén import is één stap in de geschiedenis van dat blad.  
De melding toont daarna bijvoorbeeld `1 added · 1 updated · 2 skipped`. Een rij die gelijk is aan die op het blad, telt niet als toegevoegd en niet als bijgewerkt, dus hetzelfde bestand opnieuw importeren verandert niets en legt geen stap vast.  
Zolang de termen van het bestand domeinen noemen die het diagram niet heeft, noemt een tweede regel de eerste drie, zoals in `4 unknown domains: 연월일, 금액, 번호`.  
Een bestand waarvan de koprij met geen enkele indeling overeenkomt, of met twee, brengt niets binnen, en de foutmelding `Couldn't read this file as words, terms or domains` verschijnt.

### Bestandsindelingen {#file-layouts}

Elk woordenboek leest twee bestandsindelingen. De eerste is die van de editor zelf, die `Export CSV` schrijft, met de veldnamen als koprij:

| Woordenboek | Koprij | Vereist in een bestand |
| --- | --- | --- |
| Words | `name,abbreviation,englishName,description,synonyms,forbiddenWords` | `name`, `abbreviation` |
| Terms | `name,physicalName,domain,description,synonyms` | `name`, `physicalName` |
| Domains | `name,category,dataType,description` | `name`, `dataType` |

De kolommen mogen in elke volgorde staan, de kolom `domain` van een term bevat de naam van het domein, en elke andere kolom wordt genegeerd. Het hoofdlettergebruik telt in de koprij, en de cellen worden precies gelezen zoals ze zijn geschreven, spaties inbegrepen.

De tweede is de indeling van de bestanden van de Koreaanse standaard voor openbare gegevens (공통표준):

| Woordenboek | Vereist in een bestand | Ook gelezen |
| --- | --- | --- |
| Words | `공통표준단어명` | `공통표준단어영문약어명` (afkorting), `공통표준단어 영문명` (Engelse naam), `공통표준단어 설명` (beschrijving), `이음동의어 목록` (synoniemen), `금칙어 목록` (verboden woorden) |
| Terms | `공통표준용어명` | `공통표준용어영문약어명` (fysieke naam), `공통표준도메인명` (domein, op naam), `공통표준용어설명` (beschrijving), `용어 이음동의어 목록` (synoniemen) |
| Domains | `공통표준도메인명`, `데이터타입` | `공통표준도메인분류명` (categorie), `공통표준도메인설명` (beschrijving), `데이터길이`, `데이터소수점길이` |

`데이터타입`, `데이터길이` en `데이터소수점길이` van een domein worden samengevoegd tot één gegevenstype: `NUMERIC(15,2)`, `CHAR(8)`, alleen het type waar er geen lengte is, zoals `DATE`, en een schaal van 0 weggelaten, zoals in `NUMERIC(15)`.  
In deze bestanden worden de spaties rond de cellen verwijderd, en andere kolommen, zoals de revisiegeschiedenis, worden genegeerd.  
In beide indelingen maken spaties in een kolomnaam van de koprij niet uit.

### Exporteren {#exporting}

`Export CSV`, op de balk of in het rastermenu, slaat het getoonde blad op in de eigen indeling van de editor: elke rij in de volgorde van het blad, wat de zoekopdracht ook toont, met het domein van een term geschreven als zijn naam, of leeg gelaten bij een verwijderd domein.  
Het bestand is UTF-8 met een bytevolgordemarkering (BOM) en CRLF-regeleinden, en alleen een veld met een aanhalingsteken, een komma of een regeleinde wordt tussen aanhalingstekens gezet. Het opent in een spreadsheet en levert bij een import weer dezelfde rijen op.  
Het krijgt de naam `<database name>-<timestamp>-words.csv`, `-terms.csv` of `-domains.csv`, en wordt opgeslagen zoals de andere exports van de editor — zie [Exporteren](./file-import-export.md#exporting).

`Checks` heeft geen export, en een editor in alleen-lezenmodus biedt geen import of export.

## Ongedaan maken en opnieuw uitvoeren {#undo-and-redo}

`Domains`, `Words` en `Terms` houden elk een eigen geschiedenis bij, los van die van het diagram. Op dit tabblad werken `Ctrl + Z` en `Ctrl + Shift + Z` (Windows/Linux) of `⌘ + Z` en `⌘ + Shift + Z` (Mac), en de knoppen `Undo` en `Redo` van de werkbalk, op het getoonde blad, en de werkbalk toont geen `Time Travel`. Op `Checks` doen ze niets.  
Ongedaan maken op het ERD-tabblad draait nooit een bewerking van een blad terug — zie [Woordenboekbladen](./undo-redo.md#dictionary-sheets).

## Toetsen op het tabblad {#keys-on-the-tab}

Zolang de toetsenbordfocus in het tabblad staat, werken deze sneltoetsen van de editor — zie [Sneltoetsen](./settings.md#shortcuts):

- `Search`, `Ctrl + K` (Windows/Linux) of `⌘ + K` (Mac), opent [Snel zoeken](./quick-search.md).
- `Toggle Explorer`, `Ctrl + F` (Windows/Linux) of `⌘ + F` (Mac), schakelt over naar het ERD-tabblad en opent de [Verkenner](./explorer.md#opening-and-closing) op zijn zoekveld.
- `Undo` en `Redo` werken op het getoonde blad — zie [Ongedaan maken en opnieuw uitvoeren](#undo-and-redo).
- `Add Column` en `Remove Column` voegen rijen in en verwijderen ze — zie [Rijen toevoegen en verwijderen](#adding-and-deleting-rows).

Zolang een celbewerking open is, de domeinlijst van een term inbegrepen, doen `Search` en `Toggle Explorer` niets, zodat de getypte tekst niet verloren gaat.

Elke andere sneltoets van de editor blijft in het tabblad en bereikt het canvas nooit: `Alt + N` (Windows/Linux) of `⌥ + N` (Mac) voegt geen tabel toe, en `Delete` en `Backspace` verwijderen niets op het canvas.  
De eigen toetsen van het raster werken in plaats daarvan op het blad: `Enter` bewerkt de cel, `Delete` en `Backspace` wissen de geselecteerde cellen, `Ctrl + A` (Windows/Linux) of `⌘ + A` (Mac) selecteert elke cel, en `Escape` annuleert een bewerking, sluit het rastermenu of maakt het zoekveld leeg. Kopiëren, knippen en plakken blijven ook op het tabblad — zie [Kopiëren en plakken](#copying-and-pasting).

## Editors in alleen-lezenmodus {#read-only-editors}

In een editor met [`readonly`](../../api/erd-editor-element.md#readonly) opent het tabblad en toont het elk blad.  
Van blad wisselen, zoeken, selecteren, scrollen, de grootte van kolommen wijzigen en kopiëren werken zoals gewoonlijk, en dat geldt ook voor naar een controle springen vanaf `Checks` met `Enter` of een dubbelklik. De markeringen van de controles verschijnen ook.

Geen enkele cel accepteert een bewerking, een plakbewerking of een wisbewerking, en elke cel die geen controle markeert, krijgt de grijze achtergrond van alleen-lezencellen.  
`Add Row`, `Delete Rows`, `Import CSV` en `Export CSV` zijn verborgen, de rijtoetsen doen niets, en een klik met de rechtermuisknop opent het menu van de browser. Een leeg blad toont geen aanwijzing, en de werkbalk toont geen `Undo` of `Redo`.

## Medebewerkers en het bestand {#collaborators-and-the-file}

Het bestand van het diagram bevat de woorden, termen en domeinen in de volgorde van hun blad, ook die van een sortering, en laat een rij zonder waarde weg.  
Het bevat ook de logische naam van elke tabel en kolom, of elke fysieke naam van de woordenboeken komt, en de domeinkoppeling van elke kolom zolang het domein op het blad staat. De controles en de markeringen worden daaruit berekend en nooit opgeslagen.

In een [sessie voor gezamenlijk bewerken](../../api/advanced/collaborative-editing.md) zien editors elkaars bewerkingen van de woordenboeken zodra ze binnenkomen, sorteringen en ingevoegde rijen inbegrepen. Elke editor houdt zijn eigen blad, zoekopdracht en selectie, en zijn bladgeschiedenissen bevatten alleen zijn eigen bewerkingen.  
Een bewerking of plakbewerking op een rij die een medebewerker intussen heeft verwijderd, slaat niets op, en de melding `Nothing saved: the row was removed` verschijnt.  
Een editor van een versie van vóór het tabblad Woordenboek slaat het diagram op zonder de logische namen, domeinkoppelingen en woordenboeken — zie [Versies combineren](../../api/advanced/collaborative-editing.md#mixing-releases).

Een `Import` van Schema SQL, GraphQL, DBML of AML behoudt de woordenboeken, een `Import` van JSON vervangt ze door die van het bestand, en `Import and Add` brengt er geen binnen — zie [Externe bestanden importeren](./file-import-export.md#importing-external-files).  
Een codeeragent bewerkt de woorden, termen en domeinen, stelt logische namen en domeinen in, leidt fysieke namen opnieuw af en vraagt de controles op via de MCP-server — zie [Woordenboeken](../../mcp/tools.md#dictionaries) en [Woordenboekcontroles](../../mcp/tools.md#dictionary-checks). De agent heeft geen tool voor CSV-bestanden.
