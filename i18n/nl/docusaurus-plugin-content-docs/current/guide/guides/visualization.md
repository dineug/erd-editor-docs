---
sidebar_position: 10
description: Verken het schema als krachtgerichte graaf of als stroomweergave van tabelkaarten — zoom en pan, laat de gerelateerde tabellen van een tabel oplichten en focus op een paar tabellen tegelijk.
---

# Visualisatie

Toont het hele document in één oogopslag, in een van twee modi:

- `Graph`, een krachtgerichte graaf van elke tabel, de kolommen ervan en de relaties ertussen — zie [Graafmodus](#graph-mode).
- `Flow`, elke tabel getekend als een kaart en ingedeeld langs de relaties ervan — zie [Stroommodus](#flow-mode).

Open Visualisatie via het tabblad `Visualization` op de werkbalk bovenaan, of via [Snel zoeken](./quick-search.md) onder `Tab`.  
Vanaf het ERD-tabblad openen `Alt + F` (Windows/Linux) of `⌥ + F` (Mac) en het menu-item `Focus on this table` in het contextmenu van een tabel Visualisatie direct in de modus `Flow`, beperkt tot de tabellen die je hebt gekozen en de tabellen die er één relatie van verwijderd zijn — zie [Focussen op tabellen](#focusing-on-tables).

Wissel van modus met de knoppen `Graph` en `Flow` aan het linkeruiteinde van de [werkbalk](#toolbar).  
Een net geopende editor begint in `Graph`. De modus die je kiest, blijft behouden zolang de editor open is, ook wanneer je andere tabbladen bezoekt, maar wordt niet in het document opgeslagen.

## Werkbalk {#toolbar}

Een werkbalk zweeft in het midden van de onderrand van het tabblad. Van links naar rechts:

- `Graph` en `Flow`, waarbij de huidige modus gemarkeerd is.
- `Zoom out`, het huidige zoomniveau als percentage, zoals `100%`, en `Zoom in`. Elke druk verandert het zoomniveau met 4 procentpunten, waarbij het midden van het scherm op zijn plaats blijft. Het percentage toont het zoomniveau van de modus waarin je bent, en een klik erop zet dat zoomniveau terug op `100%`.
- `Fit`, dat alles wat de modus toont in beeld brengt: elke knoop in `Graph`, elke kaart in `Flow`.
- `Tidy Up`, alleen in `Flow`, dat de kaarten opnieuw indeelt — zie [Hoe de stroomweergave wordt ingedeeld](#how-flow-is-placed).
- Het menu voor de rijweergave, alleen in `Flow`, met de huidige keuze als label — zie [Rijweergave](#row-display).
- `Show all`, alleen in `Flow` en alleen zolang de weergave beperkt is, dat teruggaat naar het hele diagram — zie [Focussen op tabellen](#focusing-on-tables).
- Het kompas `Go to content`, dat alleen aan het einde van de werkbalk verschijnt zolang er geen knoop of kaart op het scherm staat. Het toont een pijl die naar de dichtstbijzijnde knoop of kaart wijst en hoe ver die weg is, zoals `1.2k`. Klik erop om die knoop of kaart te centreren zonder het zoomniveau te wijzigen.

De zoomknoppen noemen hun sneltoetsen in hun knopinfo, bijvoorbeeld `Zoom in (Ctrl + Plus)` (Windows/Linux) of `Zoom in (⌘ + Plus)` (Mac).  
`Ctrl + Plus` en `Ctrl + Minus` (Windows/Linux) of `⌘ + Plus` en `⌘ + Minus` (Mac) wijzigen het zoomniveau stapsgewijs zoals de knoppen, in beide modi, en `Ctrl + 0` (Windows/Linux) of `⌘ + 0` (Mac) gaat direct terug naar `100%`.  
Een klik op het percentage doet hetzelfde als `Ctrl + 0` (Windows/Linux) of `⌘ + 0` (Mac), en de knopinfo ervan noemt die sneltoets. De sneltoetsen doen niets zolang het palet Snel zoeken open is.

## Graafmodus {#graph-mode}

Tekent het hele document als een krachtgerichte graaf, zodat je in één oogopslag ziet hoe tabellen met elkaar samenhangen en welke in het centrum van een domein staan.

![De graafmodus openen, de aanwijzer boven een tabel houden voor het voorbeeld, een knoop slepen en uit- en weer inzoomen](/img/demo-visualization.webp)

### De graaf lezen {#reading-the-graph}

Elke tabel en elke kolom is een knoop, en de twee soorten worden in verschillende kleuren getekend. Memo's en [tabelgroepen](./table-groups.md) worden niet getekend.  
Elke kolomknoop is verbonden met de tabel waartoe hij behoort, en twee tabellen met een relatie ertussen zijn met elkaar verbonden.  
Tabellen met meer dan één relatie in dezelfde richting ertussen worden maar één keer verbonden, en een relatie die op dezelfde tabel begint en eindigt, tekent geen verbinding.

Tabelnamen verschijnen op de graaf wanneer je inzoomt, waarbij ze tussen `50%` en `100%` geleidelijk in beeld komen, en een naam van meer dan 15 tekens wordt afgekapt. Kolomknopen hebben bij geen enkel zoomniveau een label.

### Navigeren in de graaf {#getting-around-the-graph}

Het scrollwiel zoomt rond het punt onder de aanwijzer, van `10%` tot `400%`.  
Een knijpbeweging op het trackpad zoomt op dezelfde manier, en twee vingers op een touchscreen zoomen rond het punt ertussen en pannen terwijl ze bewegen.  
Sleep de achtergrond om te pannen, of sleep met de middelste muisknop vanaf elke plek, ook vanaf een knoop, zoals op het [ERD-canvas](./table-related-functions.md#getting-around-the-canvas). Slepen met de middelste muisknop pant alleen: het trekt nooit een knoop mee.

De zoomknoppen op de [werkbalk](#toolbar) en de sneltoetsen voor zoomen houden in plaats daarvan het midden van het scherm op zijn plaats, binnen hetzelfde bereik, en `Fit` brengt elke knoop in beeld.

### Voorbeeld bij aanwijzen {#hover-preview}

Houd de aanwijzer boven een tabelknoop om naast de cursor een voorbeeld van die tabel te zien.  
Als je de aanwijzer boven een kolomknoop houdt, wordt er alleen een ring omheen getekend; er opent geen voorbeeld.

Het voorbeeld toont dezelfde kolommen als het ERD-canvas, in dezelfde volgorde — zie [Weergaveopties voor tabellen](./table-related-functions.md#table-view-options) en [Kolomvolgorde aanpassen](./settings.md#adjusting-column-order).  
Als de weergaveoptie `Alternate Key` aanstaat, draagt elke kolom van een [alternatieve sleutel](./table-related-functions.md#alternate-keys) haar markering, zoals `AK1.1`, als laatste in haar rij, en wordt het voorbeeld daarvoor breder, net als de tabel op het ERD-canvas.  
Anders dan bij een tabel op het ERD-canvas neemt de kop van het voorbeeld nooit de kleur van de [groep](./table-groups.md#coloring-a-group) van de tabel over.  
Het voorbeeld dient alleen ter weergave en wordt verborgen terwijl je een knoop sleept of pant.

### Een omgeving markeren {#highlighting-a-neighbourhood}

Als je de aanwijzer boven een tabel houdt, licht ook de omgeving ervan op: de tabel zelf, haar eigen kolommen, de tabellen die via haar relaties in beide richtingen met haar verbonden zijn, en de verbindingen ertussen.  
Al het andere op de graaf vervaagt, zodat alles wat de tabel raakt los van de rest te lezen is.

### Knopen verplaatsen {#moving-nodes}

Sleep een knoop met de linkermuisknop om hem, en alles wat ermee verbonden is, naar een nieuwe positie te trekken.  
Zolang je de knoop vasthoudt, blijft hij onder de aanwijzer vastgezet en komt de indeling eromheen weer in beweging.  
De indeling komt weer tot rust wanneer je loslaat — niets blijft vastgezet op de plek waar je het hebt neergezet.  
Een druk of sleepbeweging met de rechtermuisknop op een knoop trekt hem niet mee en pant ook niet.

### De graaf is een momentopname {#the-graph-is-a-snapshot}

De graaf wordt opgebouwd uit het document zoals het is op het moment dat je dit tabblad opent, en wordt elke keer dat je ernaar terugkeert helemaal opnieuw opgebouwd.  
Overschakelen van `Flow` naar `Graph` bouwt de graaf ook opnieuw op, en elke nieuwe opbouw begint weer bij `100%`.

## Stroommodus {#flow-mode}

Tekent elke tabel als een kaart en deelt de kaarten in langs hun relaties. Memo's en [tabelgroepen](./table-groups.md) worden niet getekend.  
Dit is niet de indeling `Flow` van [Automatische indeling](./table-related-functions.md#auto-layout), die de tabellen op het ERD-tabblad zelf verplaatst.

Elke kaart wordt getekend als een tabel op het ERD-tabblad: de kleur van de tabel langs de linkerrand, een kopbalk met een tabelpictogram en de tabelnaam, en daarna de rijen die haar [rijweergave](#row-display) voorschrijft. Anders dan een tabel op het ERD-tabblad tekent een kaart ook een lijn tussen haar rijen, en neemt haar kop nooit de kleur van de [groep](./table-groups.md#coloring-a-group) van de tabel over. Kaarten behouden dat uiterlijk bij elk zoomniveau en klappen nooit in tot hun naam, zoals tabellen op het ERD-tabblad bij `70%` en lager doen. Niets op een kaart kan worden bewerkt.

Een verbindingslijn is één vloeiende curve van tabel naar tabel, getekend onder de kaarten, zodat ze achter een kaart langs kan lopen. Een relatie van een tabel naar zichzelf buigt om de rechterbovenhoek van de kaart heen, zoals op het ERD-tabblad — zie [Routering van verbindingslijnen](./relationship-editing.md#connector-routing). Elke verbindingslijn wordt getekend als dezelfde ononderbroken grijze lijn, of de relatie nu identificerend is of niet, met dezelfde eindmarkeringen als op het ERD-tabblad — zie [Een verbindingslijn lezen](./relationship-editing.md#reading-a-connector). De stroomweergave tekent verbindingslijnen ook als de [weergaveoptie](./table-related-functions.md#table-view-options) `Relationship` uitstaat. Ze tekent nooit de labels `D:` en `U:` van de ON DELETE- en ON UPDATE-acties van een relatie en toont nooit de knopinfo die deze acties voluit beschrijft, wat de weergaveoptie `Referential Actions` ook aangeeft.

Bij het hele diagram worden tabellen die door geen enkele relatie met een andere tabel zijn verbonden, in één blok verzameld in plaats van tussen de rest verspreid.

![Overschakelen naar Flow, de aanwijzer boven orders houden om die tabel en haar buren te laten oplichten, de markering vastzetten, Keys only kiezen, daarna inzoomen met ⌘ + Wheel en op Fit drukken](/img/demo-visualization-flow.webp)

### Rijweergave {#row-display}

Het menu voor de rijweergave op de [werkbalk](#toolbar) bepaalt hoeveel van elke kaart wordt getekend. Het label ervan is de huidige keuze, en de knopinfo toont bijvoorbeeld `Row display: Name only`.  
Het menu opent boven de werkbalk, met een vinkje naast de huidige keuze. Het sluit wanneer je een keuze maakt, opnieuw op het label klikt, ergens anders in de editor klikt, op `Escape` drukt of overschakelt naar `Graph`.

| Rijweergave | Wat elke kaart toont |
| --- | --- |
| `Name only` | Alleen de kop. |
| `Keys only` | Kolommen met een primaire of refererende sleutel, plus elke andere kolom waarop een relatie eindigt. |
| `All fields` | Elke kolom. |

Rijen staan in de volgorde van de kolommen van de tabel. Elke rij toont de kolomnaam, met een sleutelpictogram ervoor wanneer de kolom een primaire sleutel, een refererende sleutel of beide is, en rechts het gegevenstype, dat alleen verschijnt zolang de kaart [opgelicht](#lighting-related-tables) is.  
Er wordt geen andere cel en geen markering van een alternatieve sleutel getekend, en noch [Weergaveopties voor tabellen](./table-related-functions.md#table-view-options) noch [Kolomvolgorde aanpassen](./settings.md#adjusting-column-order), dat de volgorde van de cellen binnen een rij bepaalt, is van toepassing op kaarten.

Wanneer de stroomweergave voor het eerst opent, begint ze met `Name only`, of met `Keys only` als ze is geopend via [focussen op tabellen](#focusing-on-tables). Daarna verandert de rijweergave alleen wanneer je een andere kiest, en blijft ze behouden bij het beperken of verruimen van de weergave.  
Een andere rijweergave wijzigt de grootte van de kaarten, waarna de stroomweergave ze opnieuw indeelt en aan het scherm aanpast.

### Navigeren in de stroomweergave {#getting-around-the-flow}

Het scrollwiel pant, en `Shift + Wheel` pant zijwaarts. `Ctrl + Wheel` (Windows/Linux) of `⌘ + Wheel` (Mac) zoomt, waarbij het midden van het scherm op zijn plaats blijft.  
Een knijpbeweging op het trackpad zoomt rond het punt waar je knijpt, en twee vingers op een touchscreen zoomen rond het punt ertussen en pannen terwijl ze bewegen.  
Sleep de achtergrond om te pannen, of sleep met de middelste muisknop vanaf elke plek, ook vanaf een kaart. Slepen met de middelste muisknop pant alleen en laat de selectie zoals ze is. Pannen kent geen grenzen, net als op het [ERD-canvas](./table-related-functions.md#getting-around-the-canvas).  
Het zoomniveau loopt van `10%` tot `150%`. De stroomweergave heeft een eigen zoomniveau en weergavepositie, los van die van het ERD-tabblad, en geen van beide wordt in het document opgeslagen.

Een druk op de achtergrond heft de selectie op, en `Ctrl + drag` (Windows/Linux) of `⌘ + drag` (Mac) op de achtergrond tekent een selectiekader.  
De stroomweergave heeft geen minimap en geen schuifbalken. Als er na het pannen geen kaart meer op het scherm staat, gebruik je het kompas `Go to content` op de [werkbalk](#toolbar).

### Gerelateerde tabellen laten oplichten {#lighting-related-tables}

Houd de aanwijzer boven een kaart om die kaart te laten oplichten, samen met de tabellen die er één relatie van verwijderd zijn en de verbindingslijnen die haar met die tabellen verbinden. Een verbindingslijn tussen twee van die tabellen licht niet op.  
Een opgelichte kaart krijgt een rand en een gloed in de accentkleur, haar gegevenstypen komen geleidelijk in beeld, en haar rijen waarop een relatie eindigt, krijgen een tint. Een opgelichte verbindingslijn krijgt de accentkleur.  
Anders dan in de [graafmodus](#highlighting-a-neighbourhood) vervaagt verder niets, en er licht niets op zolang de aanwijzer boven geen enkele kaart is en er geen kaart is vastgezet.

Klik op een kaart om de markering vast te zetten, zodat de kaart opgelicht blijft wanneer de aanwijzer verdergaat. Klik nog eens op dezelfde kaart, of klik op de achtergrond, om haar los te laten; een klik op een andere kaart zet in plaats daarvan die kaart vast. De kaart onder de aanwijzer en de vastgezette kaart lichten samen op.  
Slepen, `Ctrl + click` (Windows/Linux) of `⌘ + click` (Mac), pannen en de [kaartknoppen](#card-buttons) zetten een kaart niet vast en laten haar ook niet los.

Langs elke opgelichte verbindingslijn lopen deeltjes, van het uiteinde bij de oudertabel, waar de primaire sleutel zit, naar het uiteinde bij de kindtabel. Als er meer dan 60 verbindingslijnen tegelijk zijn opgelicht, stoppen de deeltjes en blijft de markering.

### Kaartknoppen {#card-buttons}

Zolang de aanwijzer boven een kaart is, verschijnen aan het rechteruiteinde van haar kop twee pictogramknoppen, beide zonder knopinfo:

- Het routepuntenpictogram, hetzelfde als op de knop `Flow`, beperkt de stroomweergave tot die tabel en de tabellen die er één relatie van verwijderd zijn — zie [Focussen op tabellen](#focusing-on-tables).
- Het pictogram voor een externe link schakelt over naar het ERD-tabblad, selecteert alleen die tabel, brengt haar naar voren en verplaatst de gefocuste cel naar haar naam, tenzij die al op een cel van die tabel staat. Het canvas scrolt alleen naar de tabel als die nog niet goed in beeld is — zie [Waar een sprong terechtkomt](./table-related-functions.md#where-a-jump-lands). Het begint of voltooit nooit een relatie die wordt getekend.

Een druk op een van beide knoppen geldt alleen voor de knop zelf: anders dan een druk elders op de kaart selecteert hij de kaart niet en brengt hij haar niet naar voren. De routepuntenknop laat dus de selectie die je had ongemoeid; de knop voor een externe link selecteert de tabel alleen als onderdeel van het overschakelen naar het ERD-tabblad. Beide knoppen reageren alleen op een klik met de linkermuisknop.

### Kaarten verplaatsen {#moving-cards}

Sleep een kaart met de linkermuisknop aan een willekeurig deel ervan, behalve de twee kaartknoppen; slepen met de rechtermuisknop verplaatst niets.  
Een druk op een kaart selecteert haar, `Ctrl + click` (Windows/Linux) of `⌘ + click` (Mac) voegt haar toe aan de selectie, en een geselecteerde kaart slepen verplaatst elke geselecteerde kaart. Het is dezelfde selectie als op het ERD-tabblad, dus wat je hier selecteert, is nog steeds geselecteerd wanneer je teruggaat.

Een kaart beweegt alleen in de stroomweergave: haar tabel blijft op het ERD-tabblad waar ze is.  
Een verplaatste kaart blijft op haar plek bij pannen, zoomen en `Fit`. Ze gaat terug naar de plek waar de indeling haar plaatste wanneer je het tabblad verlaat of naar `Graph` overschakelt en terugkomt, en wanneer `Show all` terugkeert naar een indeling van het hele diagram die de stroomweergave al heeft. Een nieuwe indeling plaatst haar opnieuw, rekening houdend met waar je haar hebt achtergelaten — zie [Hoe de stroomweergave wordt ingedeeld](#how-flow-is-placed).

### Focussen op tabellen {#focusing-on-tables}

Selecteer op het ERD-tabblad een of meer tabellen en druk op `Alt + F` (Windows/Linux) of `⌥ + F` (Mac), of klik met de rechtermuisknop op een tabel en kies `Focus on this table`.  
Het tabblad Visualisatie opent in de modus `Flow`, beperkt tot die tabellen en elke tabel die in een van beide richtingen één relatie verwijderd is van een van die tabellen. Alleen de verbindingslijnen tussen de getoonde tabellen worden getekend.

Als de tabel waarop je met de rechtermuisknop klikt een van meerdere geselecteerde tabellen is, toont het menu-item `Focus on selected tables` en focust het op de hele selectie. Een klik met de rechtermuisknop op een tabel buiten de selectie focust alleen op die tabel.  
`Alt + F` gebruikt de geselecteerde tabellen en laat memo's en [tabelgroepen](./table-groups.md) buiten beschouwing. Zonder geselecteerde tabel doet de sneltoets niets, ook niet als er een groep is geselecteerd: kies eerst `Select tables` in het contextmenu van de groep — zie [Groepen selecteren](./table-groups.md#selecting-groups).  
De sneltoets wordt genegeerd terwijl een cel, een memo of de naam van een groep wordt bewerkt, terwijl de toetsenbordfocus in de [Verkenner](./explorer.md#keys-in-the-explorer) ligt, of terwijl het palet Snel zoeken, Tabeleigenschappen, de Verschilweergave, het voorbeeld van Automatische indeling, Tijdreizen, het dialoogvenster [`Export image`](./file-import-export.md#image) of [`Map Columns`](./relationship-editing.md#map-columns) open is.

In de stroomweergave beperkt de [kaartknop](#card-buttons) met routepunten de weergave op dezelfde manier, tot die ene tabel. `Show all` op de [werkbalk](#toolbar) gaat terug naar het hele diagram.  
Een beperkte weergave wordt afzonderlijk ingedeeld en aan het scherm aangepast. Ze blijft beperkt wanneer je het tabblad verlaat of naar `Graph` overschakelt en terugkomt, en `Escape` verruimt haar niet.

![Focussen op orders met ⌥ + F, beperken tot members met de routepuntenknop op de kaart ervan, daarna Show all](/img/demo-visualization-focus.webp)

### Hoe de stroomweergave wordt ingedeeld {#how-flow-is-placed}

De eerste keer dat `Flow` wordt getoond, worden de getoonde tabellen buiten de hoofdthread ingedeeld en wordt het resultaat aan het scherm aangepast.  
De indeling blijft bewaard zolang de editor open is. Verlaat je het tabblad of schakel je over naar `Graph` en kom je terug, dan gebruikt de stroomweergave haar opnieuw, met het zoomniveau en de weergavepositie zoals je ze achterliet.  
De stroomweergave bewaart één indeling voor het hele diagram en één voor de beperkte weergave, dus `Show all` gaat terug naar de indeling van het hele diagram en past die aan het scherm aan zonder haar opnieuw te berekenen, zolang niets waaruit die indeling is gemaakt, is veranderd.

De stroomweergave deelt de kaarten opnieuw in wanneer:

- Je op `Tidy Up` drukt. Het resultaat wordt aan het scherm aangepast.
- Je de rijweergave wijzigt, of de weergave tot andere tabellen beperkt. Het resultaat wordt aan het scherm aangepast.
- Er tabellen of relaties worden toegevoegd of verwijderd — op het ERD-tabblad terwijl je weg bent, wat wordt verwerkt wanneer je terugkomt, of door een medebewerker terwijl je in de stroomweergave bent. Het zoomniveau en de weergavepositie blijven zoals ze zijn.

Elke indeling houdt rekening met waar de kaarten op dat moment staan, dus `Tidy Up` herstelt niet per se een eerdere schikking.  
Een wijziging die alleen de grootte van een kaart verandert, zoals de naam van een tabel wijzigen of een kolom toevoegen, deelt de kaarten niet opnieuw in. Druk op `Tidy Up` als kaarten elkaar gaan overlappen.

Een indeling die langer dan 6 seconden duurt, toont de melding `Placing tables`, met een draaiende laadindicator en `Cancel`.  
`Cancel`, of `Escape` op elk moment terwijl de indeling loopt, breekt haar af; `Tidy Up`, of terugkeren naar `Flow`, vraagt er opnieuw om.  
Als een indeling mislukt — de host draait geen shared worker, de worker start niet, of er komt binnen 60 seconden geen indeling terug — toont de stroomweergave de melding `Could not place tables` met een waarschuwingsteken, en probeert `Tidy Up` het opnieuw. Zie [Web Workers](../../api/installation.md#web-workers).  
De stroomweergave tekent alleen de tabellen die haar laatste indeling heeft geplaatst, zowel bij het hele diagram als in een beperkte weergave, dus de eerste keer dat ze wordt getoond, zijn er mogelijk helemaal geen kaarten tot een indeling slaagt.  
Telkens wanneer de stroomweergave de kaarten opnieuw indeelt, zoals wanneer je de weergave tot andere tabellen beperkt, blijft de vorige schikking op het scherm tot de nieuwe indeling binnenkomt, en blijft ze daar als die indeling wordt geannuleerd of mislukt.

Wanneer het hele document wordt vervangen, bijvoorbeeld door een bestand te importeren, worden de indelingen, de focus, de rijweergave, het zoomniveau en de weergavepositie van de stroomweergave gewist, en de volgende keer dat je de stroomweergave opent, begint ze opnieuw zoals de eerste keer: met het hele diagram, of beperkt als je haar opent via [focussen op tabellen](#focusing-on-tables).

### De stroomweergave wijzigt het document nooit {#flow-never-edits-the-document}

De stroomweergave leest het diagram alleen. Zoomen, pannen, kaarten verplaatsen, `Tidy Up`, de rijweergave, vastzetten en focussen voegen niets toe aan de [geschiedenis](./undo-redo.md#what-the-history-records).  
Ze veranderen ook niets aan het diagram. Een druk op een kaart brengt haar tabel wel naar voren, net als een klik op een tabel op het ERD-tabblad, zodat die daar ook vooraan ligt, maar de stapelvolgorde wordt niet opgeslagen — zie [Meerdere tabellen verplaatsen](./table-related-functions.md#moving-multiple-tables). `Graph` laat het diagram op dezelfde manier ongemoeid.  
Een druk op een kaart voegt nooit een relatie toe. Als je het ERD-tabblad hebt verlaten terwijl je er een tekende, kiest een druk op een kaart haar tabel als begintabel wanneer er nog geen is gekozen, en beëindigt hij anders het tekenen.  
De [kaartknop](#card-buttons) voor een externe link gaat verder, omdat die je uit de stroomweergave haalt: wanneer het ERD-tabblad naar de tabel moet scrollen, wordt dat scrollen vastgelegd zoals elke andere wijziging van de weergavepositie.

Bewerkingen van medebewerkers bereiken het diagram nog steeds terwijl je in de stroomweergave bent, en kaarten volgen de tabellen en relaties die zij toevoegen of verwijderen — zie [Hoe de stroomweergave wordt ingedeeld](#how-flow-is-placed).  
Hun selectie- en focusringen worden op de kaarten getekend, maar hun cursors en selectiekaders niet — zie [Gezamenlijk bewerken](../../api/advanced/collaborative-editing.md).

Beide modi, focussen inbegrepen, werken ook in een editor met `readonly`.
