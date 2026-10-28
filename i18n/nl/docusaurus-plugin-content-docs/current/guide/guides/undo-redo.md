---
sidebar_position: 15
description: Bewerkingen ongedaan maken en opnieuw uitvoeren, wat de geschiedenis vastlegt, de eigen geschiedenissen van de woordenboekbladen en met Tijdreizen door de geschiedenis van het diagram stappen.
---

# Ongedaan maken, opnieuw uitvoeren

Je kunt teruggaan naar een eerdere bewerkingstoestand of vooruitgaan naar een latere.  
De geschiedenis bewaart tot `2048` wijzigingen.

- Ongedaan maken: `Ctrl + Z` (Windows/Linux) of `⌘ + Z` (Mac)
- Opnieuw uitvoeren: `Ctrl + Shift + Z` (Windows/Linux) of `⌘ + Shift + Z` (Mac)

Op het ERD-tabblad biedt de werkbalk dezelfde twee opdrachten in de vorm van de knoppen `Undo` en `Redo`, naast `Time Travel`. Op het tabblad Woordenboek toont de werkbalk `Undo` en `Redo` zonder `Time Travel`, en geen enkel ander tabblad toont ze.  
Ze lichten alleen op als er iets is om ongedaan te maken of opnieuw uit te voeren. Een editor met `readonly` verbergt ze en `Time Travel`, en de sneltoetsen maken dan niets ongedaan en voeren niets opnieuw uit.

Alleen op het ERD-tabblad werken ongedaan maken en opnieuw uitvoeren op de geschiedenis van het diagram.  
De sneltoetsen werken daar niet zolang Snel zoeken, `Table Properties`, `Diff Viewer`, het voorbeeld van `Auto Layout`, het dialoogvenster [`Export image`](./file-import-export.md#image), het dialoogvenster [Kolommen toewijzen](./relationship-editing.md#map-columns) of Tijdreizen open is.  
Ze blijven werken zolang de toetsenbordfocus ergens in de [Verkenner](./explorer.md#keys-in-the-explorer) staat, de boomstructuur inbegrepen, en zolang de [kleurkiezer](./table-related-functions.md#table-and-memo-color-specification) open is. Zelfs met de tekstcursor in een van hun velden, zoals het zoekveld, het vervangveld of `Hex`, maken ze wijzigingen aan het diagram ongedaan en voeren ze die opnieuw uit, in plaats van wijzigingen aan de tekst in het veld.

Op de andere tabbladen:

- Woordenboek: ze maken de bewerkingen van het getoonde blad, `Domains`, `Words` of `Terms`, ongedaan en voeren ze opnieuw uit vanuit de eigen geschiedenis van dat blad, nooit vanuit die van het diagram. Op `Checks` doen ze niets — zie [Woordenboekbladen](#dictionary-sheets).
- Visualisatie: in `Flow` gaan dezelfde toetsen een stap terug en vooruit door wat de stroomweergave heeft getoond, zoals `Previous table` en `Next table` doen, ook in een editor met `readonly`. Ze maken daar nooit iets in het diagram ongedaan en voeren er nooit iets opnieuw uit — zie [Vorige en volgende tabel](./visualization.md#previous-table-and-next-table). In `Graph` doen ze niets.
- Schema SQL, Codegenerator en Instellingen: ze zijn niet beschikbaar. In de velden `Before tables` en `After tables` van het tabblad Schema SQL maken dezelfde toetsen in plaats daarvan je typen in het veld ongedaan en voeren ze het opnieuw uit.

De geschiedenis staat voor de huidige sessie in het geheugen. Ze wordt niet in het document opgeslagen, dus een opnieuw geopend diagram begint met een lege geschiedenis.

![Een tabel verplaatsen en een kolom verwijderen met ⌥ + Backspace, daarna beide ongedaan maken met ⌘ + Z en opnieuw uitvoeren met ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Wat de geschiedenis vastlegt {#what-the-history-records}

Vastgelegd:

- Tabellen en memo's: toevoegen, verwijderen, verplaatsen en kleur; de naam, logische naam en opmerking van een tabel; de tekst en grootte van een memo.
- Tabelgroepen: toevoegen, verwijderen, verplaatsen, grootte wijzigen, naam, kleur en in welke groep elke tabel zit — zie [Tabelgroepen](./table-groups.md).
- Kolommen: toevoegen, verwijderen, herschikken, logische naam, het domein waaraan elke kolom is gekoppeld en elke kolomoptie.
- De fysieke namen die de woordenboeken afleiden, en of elke naam je eigen naam is of van de woordenboeken komt: één keer ongedaan maken zet een naam en die toestand samen terug — zie [Eigen namen](./dictionary.md#names-of-your-own).
- `Derive Physical Name Again` en `Derive Physical Names Again` — zie [Fysieke namen opnieuw afleiden](./dictionary.md#derive-physical-names-again).
- Relaties: toevoegen, verwijderen, type wijzigen, de kolommen die in het dialoogvenster [Kolommen toewijzen](./relationship-editing.md#map-columns) zijn ingesteld en elke keuze bij `On Delete` of `On Update` — zie [ON DELETE en ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Als je een verwijdering ongedaan maakt, komt een relatie terug met de bijbehorende ON DELETE- en ON UPDATE-acties.
- Indexen en hun kolommen.
- Weergavepositie, zoomniveau en het in- en uitschakelen van opties in `View Option`.
- De scripts `Before tables` en `After tables` van het tabblad Schema SQL, één stap voor elke bewerking die je toepast door het veld te verlaten — zie [Scripts vóór en na de tabellen](./schema-sql.md#before-and-after-scripts).
- Een bestand importeren en er een toevoegen met [`Import and Add`](./file-import-export.md#import-and-add).

Niet vastgelegd:

- Het databasesysteem en de databasenaam.
- De taal van de Codegenerator, `Table Name Case` en `Column Name Case`.
- Het type aanhalingstekens, of het nu op het tabblad Schema SQL of op het tabblad Codegenerator is ingesteld.
- De keuzes bij `Statements`, `Header`, `Write logical names into empty comments` en `Tables` op het tabblad Schema SQL, die bij het editorvenster horen — zie [Optiepaneel](./schema-sql.md#options-panel).
- Alles op het tabblad Instellingen, de rijen [`Lock`](./settings.md#lock) inbegrepen.
- De naamweergave wisselen, waar dat ook gebeurt en of de vergrendeling ervan nu aan- of uitstaat — zie [De weergave wisselen](./logical-names.md#switching-the-view).
- Het thema en de weergavetaal — zie [Taal en thema](./language-and-theme.md).
- Welke tabel, memo of groep vóór de andere wordt getekend.
- De [Verkenner](./explorer.md): hem openen, sluiten of de grootte ervan wijzigen, de boomstructuur samenvouwen en de zoektekst en de zoekopties. Wat `Replace` en `Replace All` wijzigen, wordt wel vastgelegd, net als de scroll van een sprong — zie [Eén handeling, één stap](#one-gesture-one-step).
- Zoomen en pannen op het tabblad Visualisatie in beide modi, knopen van de graaf of kaarten in de stroomweergave verplaatsen, `Tidy Up`, de rijweergave, focussen op tabellen en stappen met `Previous table` en `Next table` — zie [De stroomweergave wijzigt het document nooit](./visualization.md#flow-never-edits-the-document).
- Het getoonde blad van het tabblad Woordenboek, en de zoekopdracht, selectie, scrollpositie en kolombreedtes van elk blad — zie [Het tabblad openen](./dictionary.md#opening-the-tab).

Wijzigingen hierin kun je niet ongedaan maken.

Een editor in alleen-lezenmodus legt helemaal niets vast. De positie en zoom van de weergave en de schakelaars van `View Option` veranderen daar nog steeds, samen met het tabblad, de naamweergave, het databasesysteem en de code-instellingen, maar alleen op dat scherm, dus er is niets ongedaan te maken — zie [Editors in alleen-lezenmodus](./settings.md#read-only-editors) bij Instellingen.

Bewerkingen op het tabblad Woordenboek kun je ongedaan maken, maar ze komen terecht in de geschiedenis van hun eigen blad in plaats van in deze, dus ongedaan maken op het ERD-tabblad draait er nooit een terug, zelfs niet het nieuwe `Data Type` van een domein en de kolomtypen die het wijzigt — zie [Woordenboekbladen](#dictionary-sheets).

Wijzigingen die uit een andere editor binnenkomen, worden evenmin vastgelegd, dus ongedaan maken draait alleen je eigen wijzigingen terug. In een [sessie voor gezamenlijk bewerken](../../api/advanced/collaborative-editing.md) maakt elke editor zijn eigen wijzigingen ongedaan, en een codeeragent die via de [MCP-server](../../mcp/live-and-headless.md#undo) bewerkt, maakt de zijne ongedaan met `erd_undo`.

Het ongedaan maken van een `Import`, die het hele diagram vervangt, brengt het eerdere diagram terug zoals de editor het had toen je importeerde, met elke [vergrendeling](./settings.md#lock) aan of uit en elke vergrendelde waarde zoals ze toen waren.  
Als in dat diagram `Viewport` vergrendeld was, gaan de weergave en het zoomniveau terug naar de vergrendelde weergave, waarin het diagram opent, in plaats van naar waar je was. Was `Viewport` er ontgrendeld, dan gaan ze terug naar waar je was toen je importeerde. De andere vergrendelde instellingen, zoals het tabblad waarop je bent, de taal van de Codegenerator of de naamweergave, blijven zoals ze op je scherm staan.  
Een nieuw diagram begint met elke vergrendeling aan. Ontgrendel `Viewport` voordat je importeert, zodat je weergave bij zo'n ongedaan maken behouden blijft. Als je die daarna ontgrendelt of een JSON-bestand importeert waarvan de eigen vergrendeling `Viewport` uitstaat, verandert dat niet waar het ongedaan maken je naartoe brengt.

Het ongedaan maken van de import van een JSON-bestand brengt ook de woorden, termen en domeinen terug die het eerdere diagram had. Een import van Schema SQL, GraphQL, DBML of AML behoudt de woordenboeken, dus het ongedaan maken en opnieuw uitvoeren ervan laat ze zoals ze zijn, inclusief de bewerkingen die sindsdien op het tabblad Woordenboek zijn gedaan.

Als ongedaan maken of opnieuw uitvoeren op het ERD-tabblad een kolom opnieuw aan een domein koppelt, of een kolom terugbrengt die aan een domein is gekoppeld, krijgt de kolom het gegevenstype van het domein zoals dat nu is. Zet het een ander type terug op een gekoppelde kolom, dan wordt die kolom ontkoppeld — zie [Domeinen en gegevenstypen](./dictionary.md#domains-and-data-types).

## Eén handeling, één stap {#one-gesture-one-step}

Alles wat een enkele handeling in gang zet, wordt één stap in de geschiedenis.  
Meerdere tabellen en memo's tegelijk plakken, of ze dupliceren met `Alt + drag`, wordt in één stap ongedaan gemaakt.

Een druk op `Delete` of `Backspace`, of `Delete selected` of `Delete columns` in een contextmenu, is één stap, hoeveel tabellen, memo's, tabelgroepen of kolommen er ook worden verwijderd.  
De primaire sleutel in- of uitschakelen op meerdere geselecteerde kolommen is één stap, of dat nu gebeurt met `Alt + K` (Windows/Linux) of `⌥ + K` (Mac) of met `Primary Key on selected columns` in het contextmenu van een tabel.  
De kleur van de selectie instellen, of die wissen met `No color` of `Remove color`, is één stap, hoeveel tabellen, memo's en groepen er ook zijn geselecteerd. Een kleur kiezen die alles in de selectie al heeft, legt geen stap vast, en `No color` ook niet als niets in de selectie een kleur heeft.  
`Map` of `Save` in het dialoogvenster [Kolommen toewijzen](./relationship-editing.md#map-columns) is één stap, samen met de kolommen met refererende sleutel die het toevoegt en de gegevenstypen die het wijzigt.  
`Import and Add` is één stap, samen met de scroll die het toegevoegde blok in beeld brengt als dat nodig is.

Een term kiezen uit de lijst onder de cel van een logische naam is één stap: de logische naam, de fysieke naam die daaruit wordt afgeleid en, voor een kolom, het domein van de term met zijn gegevenstype — zie [Termnamen aanvullen](./logical-names.md#completing-term-names).  
Een domein kiezen in de domeincel van een kolom is één stap, samen met het gegevenstype dat het de kolom geeft en wat [Gegevenstypen via relaties synchroniseren](./settings.md#relationship-datatype-sync) langs de relaties doorgeeft. `None` kiezen, wat de kolom ontkoppelt, is ook één stap — zie [De domeincel](./logical-names.md#the-domain-cell). Als je in een gekoppelde kolom een ander gegevenstype typt dan dat van haar domein, wordt de kolom ontkoppeld in de stap van die invoer.  
`Derive Physical Name Again` of `Derive Physical Names Again` is één stap, hoeveel namen, domeinkoppelingen en gegevenstypen het ook wijzigt. Het legt alleen geen stap vast als het niets wijzigt. Een eigen naam teruggeven aan de woordenboeken is een wijziging, ook als de naam al bevat wat ze geven.

Een [tabelgroep](./table-groups.md) maken, door hem te tekenen of door de geselecteerde tabellen te groeperen met `Group selected tables` of `T` en daarna `G`, is één stap, samen met elke tabel die de groep opneemt. Een groep verwijderen is één stap, en als je dat ongedaan maakt, komt de groep terug met zijn tabellen erin.  
Een groep aan zijn titelbalk slepen verplaatst de groep en al zijn tabellen in één stap. Als je tabellen in een groep of erbuiten neerzet en binnen ongeveer `200ms` na de laatste beweging loslaat, wisselen ze van groep in dezelfde stap als het slepen, zodat één keer ongedaan maken ze terugzet waar ze waren en in de groepen waarin ze zaten. Na een langere pauze vóór het loslaten is de groepswijziging een eigen stap, en de eerste keer ongedaan maken draait alleen die terug.  
Als je de grootte van een groep wijzigt via een rand of een hoek, wordt dat één keer vastgelegd, bij het loslaten.  
[Automatische indeling](./table-related-functions.md#auto-layout) toepassen is één stap, inclusief de groepen die het om hun tabellen heen aanpast.

`Replace All` in [Zoeken en vervangen](./find-and-replace.md#replacing) is ook één stap, hoeveel tabelnamen, kolomnamen, logische namen, indexnamen, tabelgroepnamen, opmerkingen en memo's het ook wijzigt, inclusief de fysieke namen en domeinkoppelingen die uit de logische namen worden afgeleid. Als het niets wijzigt, zoals wanneer `Preserve Case` elke overeenkomst terugschrijft zoals die was, legt het geen stap vast.  
Een enkele `Replace` is één stap, inclusief wat uit een logische naam wordt afgeleid en de scroll naar de volgende overeenkomst als die overeenkomst er een nodig heeft. Als het zijn overeenkomst terugschrijft zoals die was, legt het alleen die scroll vast, of niets als er geen is.  
Naar een overeenkomst gaan scrolt het canvas alleen als de overeenkomst nog niet goed in beeld is — zie [Waar een sprong terechtkomt](./table-related-functions.md#where-a-jump-lands). Die scroll wordt vastgelegd zoals elke andere wijziging van de weergavepositie, dus nadat je door overeenkomsten bent gegaan, draait ongedaan maken eerst die scrollbewegingen terug, één per stap.  
De andere sprongen die op het canvas terechtkomen, leggen hun scrollbewegingen op dezelfde manier vast: een rij kiezen in de Verkenner, een resultaat van Snel zoeken, een controle op het blad `Checks` van het tabblad Woordenboek die een tabel of een kolom noemt, of de [kaartknop](./visualization.md#card-buttons) voor een externe link in de stroomweergave. Een sprong die de weergave laat waar die is, legt niets vast. Een rij kiezen in de lijst van `Diff Viewer` legt evenmin iets vast, omdat dat alleen de kanten van de Verschilweergave zelf verplaatst, die alleen-lezen zijn.

Een doorlopende sleepbeweging, pan over het canvas, zoomactie, knijpbeweging of kleurwijziging wordt ongeveer `200ms` gebufferd en komt ook als één stap in de geschiedenis terecht.  
Een sleepbeweging die in totaal minder dan `20px` verplaatst, legt geen verplaatsing vast. Alleen een eventuele groepswijziging ervan wordt vastgelegd.

Typen in een cel of een memo wordt per invoer vastgelegd in plaats van per handeling: elk getypt teken, elke keer plakken en elke stap van een samenstelling in de invoermethode (IME) is een eigen stap.  
De cel van een logische naam wordt op dezelfde manier vastgelegd. Als de editor ervan sluit op een andere logische naam dan die waarmee hij opende, is de fysieke naam die de woordenboeken daaruit afleiden nog een stap na het typen. De eerste keer ongedaan maken draait alleen die naam terug, met het domein en het gegevenstype die een term meebracht, en laat de logische naam staan die je hebt getypt. Als er niets wordt afgeleid, wordt er niets meer vastgelegd — zie [Een logische naam invoeren](./logical-names.md#writing-a-logical-name).  
De naam van een tabelgroep wordt één keer vastgelegd, wanneer `Enter` of het verlaten van het veld hem opslaat, dus de naam die je typt in een groep die je net hebt gemaakt, is een andere stap dan het maken ervan. `Esc`, of een naam die ongewijzigd blijft, legt niets vast.

## Woordenboekbladen {#dictionary-sheets}

De bladen `Domains`, `Words` en `Terms` van het tabblad Woordenboek hebben elk een eigen geschiedenis, los van die van het diagram. Elke bewerking op het tabblad komt terecht in de geschiedenis van het blad waarvan ze de rijen schrijft. Net als die van het diagram bewaart elke geschiedenis tot `2048` stappen en staat ze voor de sessie in het geheugen.

- Met de toetsenbordfocus in het tabblad maakt `Ctrl + Z` (Windows/Linux) of `⌘ + Z` (Mac) de laatste bewerking van het getoonde blad ongedaan, en voert `Ctrl + Shift + Z` (Windows/Linux) of `⌘ + Shift + Z` (Mac) de laatst ongedaan gemaakte bewerking opnieuw uit.
- `Undo` en `Redo` op de werkbalk doen hetzelfde, en lichten alleen op als het getoonde blad een bewerking heeft om ongedaan te maken of opnieuw uit te voeren. Als je erop drukt, blijft de toetsenbordfocus waar ze was, in het raster of in het zoekveld. Het tabblad heeft geen `Time Travel`.
- Op `Checks`, waar niets wordt bewerkt, lichten de knoppen niet op, en doen de knoppen en de toetsen niets.
- Met een geopende celbewerking, of met de tekstcursor in het zoekveld van het tabblad, maken de toetsen in plaats daarvan je typen daar ongedaan en voeren ze het opnieuw uit.

De geschiedenissen lopen nooit door elkaar. Ongedaan maken op het ERD-tabblad draait nooit een bewerking van een blad terug, en ongedaan maken op een blad draait nooit een bewerking van een ander blad of van het diagram terug. Elk blad behoudt zijn geschiedenis terwijl je van blad of tabblad wisselt.

Elk van de volgende is één stap van zijn blad:

- Een celbewerking, één keer vastgelegd wanneer ze wordt weggeschreven in plaats van per getypt teken, en alleen als ze de waarde wijzigt — zie [Cellen bewerken](./dictionary.md#editing-cells).
- Een plakbewerking, inclusief de rijen die ze toevoegt, en het wissen van de geselecteerde cellen met `Delete` of `Backspace` — zie [Kopiëren en plakken](./dictionary.md#copying-and-pasting).
- `Add Row`, en elke invoeging of verwijdering van rijen, via de balk, het rastermenu of de toetsen, hoeveel rijen die ook beslaat — zie [Rijen toevoegen en verwijderen](./dictionary.md#adding-and-deleting-rows).
- Het domein van een term dat uit de lijst ervan wordt gekozen, `None` inbegrepen — zie [Het domein van een term](./dictionary.md#a-terms-domain).
- Een sortering — zie [Sorteren](./dictionary.md#sorting).
- Eén CSV-bestand dat met `Import CSV` is geïmporteerd, hoeveel rijen het ook toevoegt of bijwerkt. Het is een stap van het blad dat het bestand vult en dat het tabblad daarna toont, ongeacht vanuit welk blad je het hebt geïmporteerd — zie [Importeren](./dictionary.md#importing).

Een schrijfbewerking die niets wijzigt, zoals hetzelfde bestand nogmaals importeren of een blad sorteren dat al in die volgorde staat, legt geen stap vast, en een schrijfbewerking die met een melding `Nothing saved: …` wordt geweigerd evenmin. Als een term zonder `Physical Name` een naam krijgt, maakt de fysieke naam die de woorden ervan samenstellen deel uit van de stap van die bewerking.

Het nieuwe `Data Type` van een domein is één stap van het blad `Domains`, samen met de typen die het geeft aan de kolommen die aan het domein zijn gekoppeld en aan de kolommen die de synchronisatie van gegevenstypen via relaties vanaf daar bereikt — zie [Domeinen en gegevenstypen](./dictionary.md#domains-and-data-types).  
Ongedaan maken of opnieuw uitvoeren ervan past het type aan van de kolommen die op dat moment aan het domein zijn gekoppeld, dus een kolom die je sindsdien aan een ander domein hebt gekoppeld of een ander type hebt gegeven, behoudt haar type. Een kolom die de stap heeft ontkoppeld, zoals een refererende sleutel die de synchronisatie van zijn eigen domein heeft losgekoppeld, wordt alleen opnieuw gekoppeld zolang ze nog niet gekoppeld is en nog het type heeft waarmee de stap haar heeft achtergelaten.

Een editor met `readonly` verbergt de knoppen, en de toetsen maken dan niets ongedaan en voeren niets opnieuw uit.  
Wijzigingen van medebewerkers en codeeragents worden evenmin vastgelegd in de geschiedenis van een blad.

De geschiedenis van elk blad wordt geleegd wanneer de woordenboeken worden vervangen: door een `Import` van een JSON-bestand, door jou of door een medebewerker, door het ongedaan maken of opnieuw uitvoeren daarvan en door een ander diagram in de editor te laden. Een `Import` van Schema SQL, GraphQL, DBML of AML behoudt de woordenboeken, en daarmee de geschiedenis van elk blad, ook bij het ongedaan maken en opnieuw uitvoeren ervan.

## Tijdreizen {#time-travel}

Je opent Tijdreizen met de knop `Time Travel` op de werkbalk, naast de knoppen voor ongedaan maken en opnieuw uitvoeren op het ERD-tabblad.  
De knop doet niets zolang er in de geschiedenis van het diagram nog geen enkele wijziging is vastgelegd. Een editor in alleen-lezenmodus toont zo'n knop niet, en een editor die in alleen-lezenmodus gaat, sluit Tijdreizen zonder het toe te passen.

Tijdreizen opent een aparte alleen-lezenkopie van het diagram, op de scrollpositie, het zoomniveau en de [naamweergave](./logical-names.md#name-view) die het canvas toont, of de vergrendeling `Viewport` of `Name View` nu aanstaat of niet.  
Tijdreizen doorloopt alleen de geschiedenis van het diagram, dus de bewerkingen van de woordenboekbladen horen niet bij de punten ervan.  
Sleep de schuifregelaar, of klik ergens op de baan ervan, om door de hele bewerkingsgeschiedenis te gaan en van elk punt een voorbeeld te zien. De meest linkse positie van de schuifregelaar is de toestand één stap vóór de eerste vastgelegde wijziging, en bij het openen staat het schuifblokje op de huidige toestand.  
Het voorbeeld reageert niet op invoer: het tekent een minimap, maar je kunt het niet pannen, scrollen of bewerken, en het echte document blijft onaangeroerd totdat je een punt toepast.

Druk op `Apply` om het geselecteerde punt te herstellen, of op `Cancel` of `Esc` om het document ongewijzigd te laten.

![Tijdreizen openen, de schuifregelaar door de sessie terugslepen en een eerder punt toepassen](/img/demo-time-travel.webp)
