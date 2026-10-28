---
sidebar_position: 9
description: Blader door de tabellen van het diagram met hun kolommen, indexen en refererende sleutels, de tabelgroepen en de memo's in een boomstructuur die naast het ERD-canvas is vastgezet, en ga met een klik naar elk ervan.
---

# Verkenner

De Verkenner is een paneel dat aan de linkerrand van het ERD-canvas is vastgezet en het diagram als een boomstructuur weergeeft: de tabellen, elk met de eigen kolommen, indexen en refererende sleutels, daarna de [tabelgroepen](./table-groups.md), daarna de memo's. Klik op een rij om naar het bijbehorende element op het canvas te gaan.  
De Verkenner maakt het canvas smaller in plaats van het te bedekken. Hij hoort bij de diagrameditor en is niet de weergave Explorer van VS Code of de bestandsverkenner van Obsidian.

![De Verkenner openen vanaf de werkbalk, naar products gaan, daarna naar de kolom status en de refererende sleutel member_id van orders, samenvouwen met Collapse All, het paneel breder maken en het sluiten](/img/demo-explorer.webp)

[Zoeken en vervangen](./find-and-replace.md) staat bovenaan, tussen de titelbalk en de boomstructuur. Zolang het zoekveld tekst bevat, toont de boom alleen wat overeenkomt — zie [De resultaten](./find-and-replace.md#the-results).  
De boom zelf wijzigt het diagram nooit: je kunt er geen namen wijzigen en niets slepen, verwijderen, tonen of verbergen. Een vervanging is de enige bewerking die het paneel uitvoert.

De eigen status van de Verkenner is alleen van jou: of hij open is, zijn breedte, welke rijen zijn samengevouwen, de rij waarop de toetsenbordfocus staat, de scrollpositie en de zoekopdracht.  
Niets daarvan wordt in het bestand opgeslagen, in de geschiedenis vastgelegd, met medebewerkers gedeeld of in de browser bewaard. Het blijft behouden zolang de editor open blijft, ook wanneer je van tabblad wisselt en wanneer er documenten in dezelfde editor worden geladen. Een nieuw geopende editor begint met de Verkenner gesloten.

## Openen en sluiten {#opening-and-closing}

Open de Verkenner op een van deze manieren:

- De knop `Explorer` op de werkbalk, direct na `Search`, met een boompictogram. De knopinfo toont `Explorer (Ctrl + F)` (Windows/Linux) of `Explorer (⌘ + F)` (Mac).
- `Ctrl + F` (Windows/Linux) of `⌘ + F` (Mac), met de naam `Toggle Explorer` op het tabblad [Sneltoetsen](./settings.md#shortcuts) van Instellingen.
- `Toggle Explorer` in [Snel zoeken](./quick-search.md), dat op elk tabblad in de lijst staat. Als je `find`, `replace`, `rename`, `tree`, `outline` of `objects` typt, verschijnt het.
- `Toggle Explorer` in het contextmenu van het canvas: klik met de rechtermuisknop op een lege plek op het ERD-canvas, buiten elke [tabelgroep](./table-groups.md). Het staat na `New Table`, `New Memo` en `New Table Group`, vóór `Relationship`. Het contextmenu van het canvas van een editor in alleen-lezenmodus heeft zo'n rij niet — zie [Editors in alleen-lezenmodus](#read-only-editors).

De twee items `Toggle Explorer` tonen de sneltoets aan de rechterkant.  
De knop op de werkbalk, de sneltoets en het item in Snel zoeken werken vanaf elk tabblad. Vanaf het tabblad Visualisatie, Schema SQL, Codegenerator, Woordenboek of Instellingen schakelen ze eerst over naar het ERD-tabblad, omdat de Verkenner alleen daar wordt getoond.

De knop op de werkbalk opent en sluit alleen het paneel. Hij zet de tekstcursor niet in het zoekveld en laat Tabeleigenschappen, de themabouwer en de taalkiezer `Display Language` open.  
De sneltoets en de twee items `Toggle Explorer` openen de Verkenner op de zoekfunctie: de tekstcursor gaat naar het zoekveld, met de tekst erin geselecteerd, en welk van de vijf dialoogvensters uit [Dialoogvensters ernaast](#dialogs-beside-it) ook open is, wordt gesloten. Wat de zoekfunctie bewaart van de ene keer openen tot de volgende, staat in [Openen en sluiten](./find-and-replace.md#opening-and-closing) op de pagina Zoeken en vervangen.  
De sneltoets doet niets terwijl een tabelcel, een memo of de naam van een tabelgroep wordt bewerkt, of terwijl een celbewerking open is op het tabblad [Woordenboek](./dictionary.md#keys-on-the-tab), de domeinlijst van een term inbegrepen.

De knop op de werkbalk ziet er ingedrukt uit zolang de Verkenner op het ERD-tabblad open is en niet door de [zen-modus](#when-it-stands-aside) wordt verborgen. Zolang dat zo is, sluiten de knop, de sneltoets en elk van beide items `Toggle Explorer` de Verkenner, en gaat de toetsenbordfocus, als die in het paneel stond, terug naar de editor.  
De sneltoets sluit de Verkenner nooit zolang Snel zoeken of een van de vijf dialoogvensters open is. In plaats daarvan sluit de sneltoets het palet of het dialoogvenster en brengt hij de toetsenbordfocus naar het zoekveld, met de tekst erin geselecteerd en, als de Verkenner al werd getoond, met behoud van de huidige overeenkomst. Het item `Toggle Explorer` in Snel zoeken maakt die uitzondering niet: uitvoeren ervan sluit het palet en daarna een geopende Verkenner.

De knop `x` in de titelbalk, met de knopinfo `Close`, sluit de Verkenner ook en geeft de toetsenbordfocus aan het canvas. `Escape` sluit hem niet — zie [Toetsen in de Verkenner](#keys-in-the-explorer).  
Wordt de Verkenner opnieuw geopend, dan komt hij terug met dezelfde breedte, met de boom samengevouwen en gescrold zoals hij was, en met dezelfde zoekopdracht. Wordt hij met de sneltoets of een item `Toggle Explorer` geopend, dan voert hij die zoekopdracht opnieuw uit, met elk resultaat uitgevouwen — zie [De resultaten](./find-and-replace.md#the-results).

Wanneer de sneltoets of een item `Toggle Explorer` de Verkenner opent in een editor die daarvoor te smal is, verschijnt de melding `Widen the window to show the Explorer` en blijft de toetsenbordfocus waar die was — zie [Naast het canvas](#beside-the-canvas).  
De Verkenner is evengoed open, met de knop op de werkbalk ingedrukt, en verschijnt, met de zoekopdracht al uitgevoerd, zodra de editor breed genoeg is, zonder de toetsenbordfocus over te nemen. Als je hem met de knop op de werkbalk opent, verschijnt er geen melding.

## Naast het canvas {#beside-the-canvas}

De Verkenner loopt langs de linkerrand van het ERD-tabblad, onder de werkbalk, over de volle hoogte van het canvas.  
Het canvas wordt smaller om er ruimte voor te maken, zodat geen enkel deel van het diagram onder het paneel ligt, en de [canvaswerkbalk](./table-related-functions.md#canvas-toolbar), de minimap en het [welkomstscherm](./editing-start.md#welcome-screen) staan allemaal in het canvas ernaast.  
De Verkenner openen, sluiten of de grootte ervan wijzigen scrolt het diagram niet en legt niets vast in de [geschiedenis](./undo-redo.md#what-the-history-records).

In een nieuw geopende editor is hij eerst `260px` breed. Sleep de rechterrand om een breedte van `200px` tot `480px` in te stellen, of dubbelklik op de rand om terug te gaan naar `260px`.

Het canvas houdt naast de Verkenner altijd minstens `320px` over:

- In een editor die smaller is dan de breedte van de Verkenner plus `320px`, wordt de Verkenner smaller getekend zodat hij past, tot minimaal `200px`.
- In een editor die smaller is dan `520px`, maakt hij plaats. Hij wordt niet getekend, maar blijft open, dus de knop op de werkbalk ziet er nog steeds ingedrukt uit en een druk erop sluit hem. Zodra de editor breed genoeg is, komt hij terug met zijn eigen breedte.

Wat telt, is de breedte van de editor zelf, niet die van het browservenster, ook al heeft de melding in [Openen en sluiten](#opening-and-closing) het over het venster.

In een [weergavetaal van rechts naar links](./language-and-theme.md#right-to-left-languages) blijft de Verkenner links van het canvas, omdat het canvas nooit wordt gespiegeld.  
De inhoud loopt van rechts naar links: de titelbalk, de zoekfunctie en de rijen worden gespiegeld, en rijen springen in vanaf rechts. De rand die je sleept, blijft aan de rechterkant, tegen het canvas. Gegevenstypen, indexkolommen en de tekst van refererende sleutels behouden hun volgorde van links naar rechts.

## Wanneer de Verkenner plaatsmaakt {#when-it-stands-aside}

De Verkenner wordt alleen op het ERD-tabblad getoond.  
Als je naar een ander tabblad gaat, wordt hij verborgen en ziet de knop op de werkbalk er niet meer ingedrukt uit. Terug op het ERD-tabblad verschijnt hij weer zoals je hem achterliet, op dezelfde manier samengevouwen en gescrold.

Zolang de [Verschilweergave](./table-related-functions.md#diff-viewer), [Tijdreizen](./undo-redo.md#time-travel) of het voorbeeld van [Automatische indeling](./table-related-functions.md#auto-layout) open is, opent of sluit niets de Verkenner:

- Een geopende Verkenner wordt verborgen en verschijnt weer zodra ze sluiten.
- De knop op de werkbalk is gedimd en doet niets.
- Snel zoeken laat `Toggle Explorer` weg.
- De sneltoets wordt aan de browser of de host overgelaten — zie [De zoekbalk van de browser](./find-and-replace.md#the-browsers-find-bar).

De Verschilweergave toont haar wijzigingen in een boomstructuur van hetzelfde type — zie [Verschilweergave](./table-related-functions.md#diff-viewer).

Het inschakelen van de [zen-modus](./table-related-functions.md#canvas-toolbar) met `Alt + Z` (Windows/Linux) of `⌥ + Z` (Mac) verbergt een geopende Verkenner zonder hem te sluiten, en het uitschakelen van de zen-modus brengt de Verkenner terug.  
In de zen-modus openen de sneltoets en de twee items `Toggle Explorer` de Verkenner nog steeds op de zoekfunctie, en de zen-modus blijft aan. De Verkenner loopt dan over de volle hoogte van de editor, omdat de bovenste werkbalk weg is, en blijft zichtbaar wanneer de zen-modus wordt uitgeschakeld. Als je de zen-modus opnieuw inschakelt, wordt hij weer verborgen.

Telkens wanneer het paneel verdwijnt terwijl de toetsenbordfocus erin staat, of het nu wordt gesloten, wordt verborgen of plaatsmaakt, gaat de toetsenbordfocus terug naar de editor.

## De boomstructuur {#the-tree}

De titelbalk toont `Explorer` en bevat twee knoppen: `Collapse All` en de `x` die de Verkenner sluit. Daaronder staat de zoekfunctie — zie [Zoeken en vervangen](./find-and-replace.md) — en daar weer onder de boomstructuur.

Het bovenste niveau bevat drie mappen, in deze volgorde: `Tables`, `Table Groups` en `Memos`. Onder elke tabel staan haar eigen mappen `Columns`, `Indexes` en `Foreign Keys`.  
Een map zonder inhoud wordt niet getoond, dus een leeg diagram toont helemaal geen rijen. `Table Groups` wordt ook weggelaten zolang [View Option](./table-related-functions.md#table-view-options) → `Table Groups` de groepen verbergt, en `Memos` zolang View Option → `Memos` de memo's verbergt.  
Een maprij toont een mappictogram, de naam en helemaal aan het einde het aantal rijen direct eronder, dus het getal naast `Tables` is het aantal tabellen in het diagram. Het getal groepeert duizendtallen zoals de weergavetaal dat doet, altijd met de cijfers 0 tot en met 9, zoals `1,234` in het Engels en `1.234` in het Duits.

Tabellen worden op naam gesorteerd, zonder onderscheid tussen hoofdletters en kleine letters, en tabellen met dezelfde naam behouden de volgorde van het document. Tabelgroepen worden op dezelfde manier gesorteerd, en de tabellen onder elke groep ook. De kolommen van een tabel behouden de eigen volgorde van de tabel, en haar indexen, haar refererende sleutels en de memo's behouden die van het document.  
De boom volgt het diagram terwijl het verandert, of dat nu komt door een bewerking op het canvas, door ongedaan maken of opnieuw uitvoeren, door een import of door een medebewerker of een codeeragent, dus als je de naam van een tabel wijzigt, verschuift haar rij.  
De volgorde gaat in elke [naamweergave](./logical-names.md#name-view) op naam, nooit op logische naam. Het wisselen van weergave geeft de tabel- en kolomrijen een ander label zonder er een te verplaatsen, en dat geldt ook als je een tabel of kolom een logische naam geeft in `Logical Names` of `Both Names`. Een fysieke naam die uit een nieuwe logische naam wordt [afgeleid](./dictionary.md#deriving-physical-names), is echter een naamswijziging zoals elke andere, dus die kan de rij van een tabel verplaatsen.

Elke soort rij toont:

- Een tabel: een tabelpictogram en de naam.
- Een kolom: een sleutelpictogram voor een kolom met primaire of refererende sleutel, gekleurd zoals de sleutelcel van de tabel zelf een primaire sleutel, een refererende sleutel of beide kleurt, en een lijstpictogram voor elke andere kolom. Daarna de naam en, in een gedempte kleur, het gegevenstype gevolgd door `PK`, `FK` of beide, zoals `id` `BIGINT PK` of `user_id` `BIGINT FK`. Het type dat de rij toont, is altijd het gegevenstype van de kolom, nooit haar [domein](./logical-names.md#the-domain-cell), wat de naamweergave ook is.
- Een index: een indexpictogram en de naam. Daarna, in een gedempte kleur, `UNIQUE` voor een unieke index en de kolommen tussen haakjes in de volgorde van de index, met `DESC` na een aflopende kolom, zoals `orders_user_idx` `UNIQUE (user_id DESC, total)`, of alleen `(total)`.
- Een refererende sleutel: alleen vermeld onder de kindtabel, de tabel met de kolommen met refererende sleutel, en alleen zolang de oudertabel in het diagram staat. Het sleutelpictogram krijgt de kleur van de verbindingslijn: de kleur voor een primaire en refererende sleutel bij een [identificerende relatie](./relationship-editing.md#identifying-relationships), anders de kleur voor een refererende sleutel. De rij toont de sleutelkolommen van de kindtabel, gescheiden door komma's, en daarna, in een gedempte kleur, `→` met de oudertabel en haar kolommen, zoals `user_id` `→ users(id)`.
- Een tabelgroep: een stip in de kleur van de groep, grijs voor een groep zonder kleur, en de naam. De tabellen ervan staan er op naam onder, en elk ervan gaat naar de bijbehorende tabel. Een groep zonder tabellen heeft niets om uit te vouwen.
- Een memo: een pictogram van een plakbriefje en de eerste regel van de memo.

Tabelrijen, de tabellen die onder een groep staan, en kolomrijen volgen de naamweergave — zie [Buiten het canvas](./logical-names.md#beyond-the-canvas). In `Both Names` toont een kolomrij bijvoorbeeld `Total Amount` `total` `NUMERIC`: de logische naam, daarna de naam en het gegevenstype, beide gedempt.  
In elke weergave tonen rijen van indexen en refererende sleutels hun kolommen bij naam, en een rij van een refererende sleutel toont ook haar oudertabel bij naam.  
Zolang het zoekveld tekst bevat, toont een rij die alleen is gevonden in de naam die de weergave weglaat, ook die naam, gedempt — zie [De resultaten](./find-and-replace.md#the-results).

Een lege naam, of een memo waarvan de eerste regel leeg is, toont `unnamed` in cursief. In `Logical Names` en `Both Names` toont een tabel of kolom alleen `unnamed` als ook haar logische naam leeg is.  
In een smal paneel wordt de gedempte tekst eerder met `…` afgekapt dan de naam waarmee de rij begint. Houd de aanwijzer boven een naam of de gedempte tekst ervan om die volledig te zien.

In het begin is alleen `Tables` uitgevouwen. Klik op een maprij, of druk op `Enter` of `Space` terwijl de toetsenbordfocus erop staat, om die samen te vouwen of uit te vouwen.  
De pijl aan het begin van een rij vouwt die rij samen of uit zonder ergens naartoe te gaan. Elke tabelrij heeft er een, ook een tabel zonder iets eronder. `→` en `←` vouwen ook samen en uit — zie [Toetsen in de Verkenner](#keys-in-the-explorer).  
`Collapse All` vouwt bij elke druk één niveau samen: het diepste niveau van zichtbare uitgevouwen rijen, dus bij herhaald drukken wordt er van onder naar boven samengevouwen. De druk die het bovenste niveau bereikt, vouwt elke rij samen, ook die onder een al samengevouwen rij, zodat alleen de mappen op het bovenste niveau overblijven.  
Bewerkingen, ongedaan maken, opnieuw uitvoeren en wijzigingen van medebewerkers of een codeeragent veranderen niets aan wat er is samengevouwen.

## Naar een rij gaan {#going-to-a-row}

Klik op een rij, of druk op `Enter` of `Space` terwijl de toetsenbordfocus erop staat, om naar het bijbehorende element op het ERD-canvas te gaan. Een maprij vouwt alleen samen of uit, en de pijltoetsen bewegen alleen binnen de boom.

- Een tabelrij, of een tabel die onder een groep staat, selecteert alleen die tabel en brengt haar naar voren. Tenzij de gefocuste cel al in die tabel staat, gaat ze naar de eerste cel van de kop van de tabel: de naam, of de logische naam in `Logical Names` en `Both Names`.
- Een kolomrij selecteert alleen de tabel ervan en zet de gefocuste cel op de naam van de kolom, of in `Logical Names` op de logische naam die op zijn plaats wordt getoond.
- Een indexrij selecteert de tabel ervan, zoals een tabelrij doet. De index zelf wordt niet apart uitgelicht; indexen worden bewerkt in [Tabeleigenschappen](./table-related-functions.md#indexes).
- Een rij van een refererende sleutel brengt beide tabellen van de relatie samen in beeld, of de kindtabel als de twee te ver uit elkaar liggen om samen te tonen. De rij selecteert alleen de kindtabel met haar kolommen met refererende sleutel, met de gefocuste cel op de eerste ervan, en laat de verbindingslijn van de relatie oplichten — zie [Een verbindingslijn lezen](./relationship-editing.md#reading-a-connector).
- Een rij van een tabelgroep brengt het kader van de groep in beeld, uitgaande van de titelbalk, selecteert alleen de groep en brengt hem met zijn tabellen naar voren.
- Een memorij selecteert alleen de memo en brengt die naar voren.

De weergave beweegt volgens de regel die voor elke sprong geldt: het zoomniveau verandert nooit, en het canvas scrolt alleen als het element waar je naartoe gaat nog niet goed in beeld is — zie [Waar een sprong terechtkomt](./table-related-functions.md#where-a-jump-lands).  
Naar een rij gaan sluit eerst Tabeleigenschappen als dat open is, en begint of voltooit nooit een relatie die wordt getekend.  
Zolang het zoekveld tekst bevat, gaat een rij waarvan de naam of de logische naam een overeenkomst bevat, of een rij die een fragment van een opmerking of memo toont, in plaats daarvan naar de eerste overeenkomst ervan — zie [Naar een overeenkomst gaan](./find-and-replace.md#going-to-a-match).

Na een klik blijft de toetsenbordfocus in de boom, dus `Delete`, `Backspace` en de andere bewerkingstoetsen bereiken de nieuwe selectie pas als je op `Escape` drukt of op het canvas klikt — zie [Toetsen in de Verkenner](#keys-in-the-explorer).

## Toetsen in de Verkenner {#keys-in-the-explorer}

De boom telt als één stop voor `Tab` en wordt overgeslagen zolang hij geen rijen heeft.  
Als je er met Tab in komt, kom je terecht op de rij waarop de toetsenbordfocus het laatst stond, of anders op de rij van de huidige overeenkomst of op de eerste rij die volledig in beeld is, en die rij wordt in beeld gescrold. De rij met de toetsenbordfocus wordt getekend als een rij onder de aanwijzer.

In de boom:

- `↑` en `↓` gaan één rij verder en stoppen bij de eerste en de laatste rij in plaats van rond te lopen. `Home` en `End` gaan naar de eerste en de laatste rij.
- `→` vouwt een samengevouwen rij uit, of gaat naar de eerste onderliggende rij van een uitgevouwen rij. `←` vouwt een uitgevouwen rij samen, of gaat terug naar de bovenliggende rij. In een weergavetaal van rechts naar links wisselen de twee om.
- `Enter` en `Space` werken als een klik: ze gaan naar de rij, of vouwen een map samen of uit — zie [Naar een rij gaan](#going-to-a-row).
- Een letter typen leidt niet tot een sprong naar een rij.

`Escape`, ingedrukt waar dan ook in de Verkenner, in de boom, in het zoek- of vervangveld of op een van de knoppen, geeft de toetsenbordfocus terug aan het canvas. De Verkenner blijft open en de selectie blijft zoals ze is.  
Een `Escape` die een samenstelling in de invoermethode beëindigt, beëindigt alleen die samenstelling. `Escape` sluit de Verkenner nooit, of je er nu in drukt of op het canvas.

Een paar sneltoetsen van de editor werken nog steeds terwijl de toetsenbordfocus in de Verkenner staat — zie [Sneltoetsen](./settings.md#shortcuts):

- `Ctrl + F` (Windows/Linux) of `⌘ + F` (Mac) werkt zoals op het canvas: de sneltoets sluit de Verkenner, of sluit, zolang Tabeleigenschappen ernaast open is, Tabeleigenschappen en zet de tekstcursor in het zoekveld — zie [Openen en sluiten](#opening-and-closing).
- `Ctrl + K` (Windows/Linux) of `⌘ + K` (Mac) schakelt Snel zoeken in of uit.
- `Undo` en `Redo` maken wijzigingen in het diagram ongedaan en voeren ze opnieuw uit, in plaats van wijzigingen in de tekst van een veld.
- `Zoom In`, `Zoom Out` en `Zoom Reset` wijzigen het zoomniveau van het canvas.

Elke andere sneltoets van de editor blijft in de Verkenner, net als de pijltoetsen, `Tab`, `Enter`, `Space`, `Home`, `End` en elke toets die wordt ingedrukt terwijl een invoermethode bezig is met een samenstelling.  
Geen ervan bereikt het canvas: `Delete` en `Backspace` verwijderen nooit de selectie, `Alt + N` (Windows/Linux) of `⌥ + N` (Mac) voegt geen tabel toe, en `T` en daarna `G` groepeert niets. In een veld werken ze als gewone teksttoetsen: `Ctrl + A` (Windows/Linux) of `⌘ + A` (Mac) selecteert de tekst van het veld, `Delete` en `Backspace` wissen tekst en `Space` typt een spatie. `Tab` beweegt tussen de knoppen, de velden en de boom van de Verkenner.  
De toetsen van het zoek- en vervangveld zelf staan beschreven in [Toetsen in de zoekvelden](./find-and-replace.md#keys-in-the-search-fields).  
Toetsen die de editor niet toewijst, zoals die voor opslaan of het opdrachtpalet van de host zelf, bereiken de host zoals gewoonlijk.

## Dialoogvensters ernaast {#dialogs-beside-it}

[Tabeleigenschappen](./table-related-functions.md#table-properties), de [themabouwer](./language-and-theme.md#theme), de taalkiezer [`Display Language`](./language-and-theme.md#picking-a-language), het dialoogvenster [`Export image`](./file-import-export.md#image) en het dialoogvenster [Kolommen toewijzen](./relationship-editing.md#map-columns) laten de Verkenner open wanneer ze openen.

- Tabeleigenschappen opent in het midden van het canvas naast de Verkenner en dimt alleen het canvas. De Verkenner blijft bruikbaar: een rij kiezen sluit Tabeleigenschappen en gaat daarna naar de rij.
- `Export image` en het dialoogvenster Kolommen toewijzen dimmen de hele editor, inclusief de werkbalk en de Verkenner. De Verkenner blijft open onder het gedimde gebied, en een klik daar sluit het dialoogvenster, zoals een klik op elke plek in het gedimde gebied dat doet; het dialoogvenster Kolommen toewijzen sluit dan zonder iets toe te wijzen.
- In een weergavetaal van links naar rechts openen de themabouwer en de taalkiezer `Display Language` net naast de Verkenner in plaats van eroverheen, en schuiven ze mee als de Verkenner opent of sluit terwijl ze open zijn. In een taal van rechts naar links blijven ze op hun plaats aan de rechterkant. Een druk in de Verkenner sluit ze, zoals elke druk erbuiten dat doet, behalve een druk op de werkbalk.

De zoekfunctie openen met de sneltoets of een item `Toggle Explorer` sluit alle vijf, het dialoogvenster Kolommen toewijzen zonder iets toe te wijzen.  
[Snel zoeken](./quick-search.md) laat de Verkenner ook open, en `Escape` sluit dan alleen het palet.

## Editors in alleen-lezenmodus {#read-only-editors}

In een editor met [`readonly`](../../api/erd-editor-element.md#readonly) werkt de Verkenner zoals in elke andere: de knop op de werkbalk met dezelfde knopinfo, de sneltoets, het item `Toggle Explorer` in Snel zoeken, de boom, het samen- en uitvouwen en `Collapse All`. De titel toont daar ook `Explorer`. Het contextmenu van het canvas heeft daar geen `Toggle Explorer`, omdat het alleen de rijen behoudt die lezen — zie [Editors in alleen-lezenmodus](./table-related-functions.md#read-only-editors).

Naar een rij gaan werkt zoals in [Naar een rij gaan](#going-to-a-row): de weergave verplaatst volgens dezelfde regel, en de tabel, tabelgroep of memo van de rij wordt geselecteerd, op het canvas omlijnd, met de gefocuste cel waar de rij die plaatst.  
Dat is de enige manier waarop een editor in alleen-lezenmodus iets selecteert. Een druk op het canvas selecteert niets, en een klik die niet beweegt wist de selectie die een rij achterliet. Een tabel die ze selecteerde, opent in [Tabeleigenschappen](./table-related-functions.md#table-properties) met `Alt + Space` (Windows/Linux) of `⌥ + Space` (Mac), alleen-lezen, en `Ctrl + C` (Windows/Linux) of `⌘ + C` (Mac) kopieert wat ze selecteerde zoals in elke editor.  
De zoekfunctie ervan zoekt alleen — zie [Editors in alleen-lezenmodus](./find-and-replace.md#read-only-editors) op de pagina Zoeken en vervangen.
