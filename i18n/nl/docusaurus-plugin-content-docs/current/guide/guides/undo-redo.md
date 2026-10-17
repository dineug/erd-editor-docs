---
sidebar_position: 13
description: Bewerkingen ongedaan maken en opnieuw uitvoeren, wat de geschiedenis vastlegt en er met Tijdreizen doorheen stappen.
---

# Ongedaan maken, opnieuw uitvoeren

Je kunt teruggaan naar een eerdere bewerkingstoestand of vooruitgaan naar een latere.  
De geschiedenis bewaart tot `2048` wijzigingen.

- Ongedaan maken: `Ctrl + Z` (Windows/Linux) of `⌘ + Z` (Mac)
- Opnieuw uitvoeren: `Ctrl + Shift + Z` (Windows/Linux) of `⌘ + Shift + Z` (Mac)

De werkbalk biedt dezelfde twee opdrachten in de vorm van de knoppen `Undo` en `Redo`, naast `Time Travel`.  
Ze lichten alleen op als er iets is om ongedaan te maken of opnieuw uit te voeren. Een editor met `readonly` verbergt alle drie, en de sneltoetsen doen niets.

Ongedaan maken en opnieuw uitvoeren werken alleen op het ERD-tabblad. Op de tabbladen Visualisatie, Schema SQL, Codegenerator en Instellingen zijn ze niet beschikbaar. In de velden `Before tables` en `After tables` van het tabblad Schema SQL maken dezelfde toetsen in plaats daarvan je typen in het veld ongedaan en voeren ze het opnieuw uit.  
De sneltoetsen werken ook niet zolang Snel zoeken, `Table Properties`, `Diff Viewer`, het voorbeeld van `Auto Layout`, het dialoogvenster [`Export image`](./file-import-export.md#image), het dialoogvenster [Kolommen toewijzen](./relationship-editing.md#map-columns) of Tijdreizen open is.  
Ze blijven werken zolang de toetsenbordfocus ergens in de [Verkenner](./explorer.md#keys-in-the-explorer) staat, de boomstructuur inbegrepen, en zolang de [kleurkiezer](./table-related-functions.md#table-and-memo-color-specification) open is. Zelfs met de tekstcursor in een van hun velden, zoals het zoekveld, het vervangveld of `Hex`, maken ze wijzigingen aan het diagram ongedaan en voeren ze die opnieuw uit, in plaats van wijzigingen aan de tekst in het veld.

De geschiedenis staat voor de huidige sessie in het geheugen. Ze wordt niet in het document opgeslagen, dus een opnieuw geopend diagram begint met een lege geschiedenis.

![Een tabel verplaatsen en een kolom verwijderen met ⌥ + Backspace, daarna beide ongedaan maken met ⌘ + Z en opnieuw uitvoeren met ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Wat de geschiedenis vastlegt {#what-the-history-records}

Vastgelegd:

- Tabellen en memo's: toevoegen, verwijderen, verplaatsen, kleur, naam en opmerking, tekst en grootte van memo's.
- Tabelgroepen: toevoegen, verwijderen, verplaatsen, grootte wijzigen, naam, kleur en in welke groep elke tabel zit — zie [Tabelgroepen](./table-groups.md).
- Kolommen: toevoegen, verwijderen, herschikken en elke kolomoptie.
- Relaties: toevoegen, verwijderen, type wijzigen, de kolommen die in het dialoogvenster [Kolommen toewijzen](./relationship-editing.md#map-columns) zijn ingesteld en elke keuze bij `On Delete` of `On Update` — zie [ON DELETE en ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Als je een verwijdering ongedaan maakt, komt een relatie terug met de bijbehorende ON DELETE- en ON UPDATE-acties.
- Indexen en hun kolommen.
- Weergavepositie, zoomniveau en het in- en uitschakelen van opties in `View Option`.
- De scripts `Before tables` en `After tables` van het tabblad Schema SQL, één stap voor elke bewerking die je toepast door het veld te verlaten — zie [Scripts vóór en na de tabellen](./schema-sql.md#before-and-after-scripts).
- Een bestand importeren en er een toevoegen met [`Import and Add`](./file-import-export.md#import-and-add).

Niet vastgelegd:

- Het databasesysteem en de databasenaam.
- De taal van de Codegenerator, `Table Name Case` en `Column Name Case`.
- Het type aanhalingstekens, of het nu op het tabblad Schema SQL of op het tabblad Codegenerator is ingesteld.
- De keuzes bij `Statements`, `Header` en `Tables` op het tabblad Schema SQL, die bij het editorvenster horen — zie [Optiepaneel](./schema-sql.md#options-panel).
- Alles op het tabblad Instellingen, de rijen [`Lock`](./settings.md#lock) inbegrepen.
- Het thema en de weergavetaal — zie [Taal en thema](./language-and-theme.md).
- Welke tabel, memo of groep vóór de andere wordt getekend.
- De [Verkenner](./explorer.md): hem openen, sluiten of de grootte ervan wijzigen, de boomstructuur samenvouwen en de zoektekst en de zoekopties. Wat `Replace` en `Replace All` wijzigen, wordt wel vastgelegd, net als de scroll van een sprong — zie [Eén handeling, één stap](#one-gesture-one-step).
- Zoomen en pannen op het tabblad Visualisatie in beide modi, knopen van de graaf of kaarten in de stroomweergave verplaatsen, `Tidy Up`, de rijweergave en focussen op tabellen — zie [De stroomweergave wijzigt het document nooit](./visualization.md#flow-never-edits-the-document).

Wijzigingen hierin kun je niet ongedaan maken.

Wijzigingen die uit een andere editor binnenkomen, worden evenmin vastgelegd, dus ongedaan maken draait alleen je eigen wijzigingen terug. In een [sessie voor gezamenlijk bewerken](../../api/advanced/collaborative-editing.md) maakt elke editor zijn eigen wijzigingen ongedaan, en een codeeragent die via de [MCP-server](../../mcp/live-and-headless.md#undo) bewerkt, maakt de zijne ongedaan met `erd_undo`.

Het ongedaan maken van een `Import`, die het hele diagram vervangt, brengt het eerdere diagram terug zoals de editor het had toen je importeerde, met elke [vergrendeling](./settings.md#lock) aan of uit en elke vergrendelde waarde zoals ze toen waren.  
Als in dat diagram `Viewport` vergrendeld was, gaan de weergave en het zoomniveau terug naar de vergrendelde weergave, waarin het diagram opent, in plaats van naar waar je was. Was `Viewport` er ontgrendeld, dan gaan ze terug naar waar je was toen je importeerde. De andere vergrendelde instellingen, zoals het tabblad waarop je bent of de taal van de Codegenerator, blijven zoals ze op je scherm staan.  
Een nieuw diagram begint met elke vergrendeling aan. Ontgrendel `Viewport` voordat je importeert, zodat je weergave bij zo'n ongedaan maken behouden blijft. Als je die daarna ontgrendelt of een JSON-bestand importeert waarvan de eigen vergrendeling `Viewport` uitstaat, verandert dat niet waar het ongedaan maken je naartoe brengt.

## Eén handeling, één stap {#one-gesture-one-step}

Alles wat een enkele handeling in gang zet, wordt één stap in de geschiedenis.  
Meerdere tabellen en memo's tegelijk plakken, of ze dupliceren met `Alt + drag`, wordt in één stap ongedaan gemaakt.

Een druk op `Delete` of `Backspace`, of `Delete selected` of `Delete columns` in een contextmenu, is één stap, hoeveel tabellen, memo's, tabelgroepen of kolommen er ook worden verwijderd.  
De primaire sleutel in- of uitschakelen op meerdere geselecteerde kolommen is één stap, of dat nu gebeurt met `Alt + K` (Windows/Linux) of `⌥ + K` (Mac) of met `Primary Key on selected columns` in het contextmenu van een tabel.  
De kleur van de selectie instellen, of die wissen met `No color` of `Remove color`, is één stap, hoeveel tabellen, memo's en groepen er ook zijn geselecteerd. Een kleur kiezen die alles in de selectie al heeft, legt geen stap vast, en `No color` ook niet als niets in de selectie een kleur heeft.  
`Map` of `Save` in het dialoogvenster [Kolommen toewijzen](./relationship-editing.md#map-columns) is één stap, samen met de kolommen met refererende sleutel die het toevoegt en de gegevenstypen die het wijzigt.  
`Import and Add` is één stap, samen met de scroll die het toegevoegde blok in beeld brengt als dat nodig is.

Een [tabelgroep](./table-groups.md) maken, door hem te tekenen of door de geselecteerde tabellen te groeperen met `Group selected tables` of `T` en daarna `G`, is één stap, samen met elke tabel die de groep opneemt. Een groep verwijderen is één stap, en als je dat ongedaan maakt, komt de groep terug met zijn tabellen erin.  
Een groep aan zijn titelbalk slepen verplaatst de groep en al zijn tabellen in één stap. Als je tabellen in een groep of erbuiten neerzet en binnen ongeveer `200ms` na de laatste beweging loslaat, wisselen ze van groep in dezelfde stap als het slepen, zodat één keer ongedaan maken ze terugzet waar ze waren en in de groepen waarin ze zaten. Na een langere pauze vóór het loslaten is de groepswijziging een eigen stap, en de eerste keer ongedaan maken draait alleen die terug.  
Als je de grootte van een groep wijzigt via een rand of een hoek, wordt dat één keer vastgelegd, bij het loslaten.  
[Automatische indeling](./table-related-functions.md#auto-layout) toepassen is één stap, inclusief de groepen die het om hun tabellen heen aanpast.

`Replace All` in [Zoeken en vervangen](./find-and-replace.md#replacing) is ook één stap, hoeveel tabelnamen, kolomnamen, indexnamen, tabelgroepnamen, opmerkingen en memo's het ook wijzigt. Als het niets wijzigt, zoals wanneer `Preserve Case` elke overeenkomst terugschrijft zoals die was, legt het geen stap vast.  
Een enkele `Replace` is één stap, inclusief de scroll naar de volgende overeenkomst als die overeenkomst er een nodig heeft. Als het zijn overeenkomst terugschrijft zoals die was, legt het alleen die scroll vast, of niets als er geen is.  
Naar een overeenkomst gaan scrolt het canvas alleen als de overeenkomst nog niet goed in beeld is — zie [Waar een sprong terechtkomt](./table-related-functions.md#where-a-jump-lands). Die scroll wordt vastgelegd zoals elke andere wijziging van de weergavepositie, dus nadat je door overeenkomsten bent gegaan, draait ongedaan maken eerst die scrollbewegingen terug, één per stap.  
De andere sprongen die op het canvas terechtkomen, leggen hun scrollbewegingen op dezelfde manier vast: een rij kiezen in de Verkenner, een resultaat van Snel zoeken of de [kaartknop](./visualization.md#card-buttons) voor een externe link in de stroomweergave. Een sprong die de weergave laat waar die is, legt niets vast. Een rij kiezen in de lijst van `Diff Viewer` legt evenmin iets vast, omdat dat alleen de kanten van de Verschilweergave zelf verplaatst, die alleen-lezen zijn.

Een doorlopende sleepbeweging, pan over het canvas, zoomactie, knijpbeweging of kleurwijziging wordt ongeveer `200ms` gebufferd en komt ook als één stap in de geschiedenis terecht.  
Een sleepbeweging die in totaal minder dan `20px` verplaatst, legt geen verplaatsing vast. Alleen een eventuele groepswijziging ervan wordt vastgelegd.

Typen in een cel of een memo wordt per invoer vastgelegd in plaats van per handeling: elk getypt teken, elke keer plakken en elke stap van een samenstelling in de invoermethode (IME) is een eigen stap.  
De naam van een tabelgroep wordt één keer vastgelegd, wanneer `Enter` of het verlaten van het veld hem opslaat, dus de naam die je typt in een groep die je net hebt gemaakt, is een andere stap dan het maken ervan. `Esc`, of een naam die ongewijzigd blijft, legt niets vast.

## Tijdreizen {#time-travel}

Je opent Tijdreizen met de knop `Time Travel` op de werkbalk, naast de knoppen voor ongedaan maken en opnieuw uitvoeren.  
De knop doet niets zolang er in de sessie nog geen enkele wijziging is vastgelegd.

Tijdreizen opent een aparte alleen-lezenkopie van het diagram, op de scrollpositie en het zoomniveau die het canvas toont, of de vergrendeling `Viewport` nu aanstaat of niet.  
Sleep de schuifregelaar, of klik ergens op de baan ervan, om door de hele bewerkingsgeschiedenis te gaan en van elk punt een voorbeeld te zien. De meest linkse positie van de schuifregelaar is de toestand één stap vóór de eerste vastgelegde wijziging, en bij het openen staat het schuifblokje op de huidige toestand.  
Het voorbeeld reageert niet op invoer: het tekent een minimap, maar je kunt het niet pannen, scrollen of bewerken, en het echte document blijft onaangeroerd totdat je een punt toepast.

Druk op `Apply` om het geselecteerde punt te herstellen, of op `Cancel` of `Esc` om het document ongewijzigd te laten.

![Tijdreizen openen, de schuifregelaar door de sessie terugslepen en een eerder punt toepassen](/img/demo-time-travel.webp)
