---
sidebar_position: 5
description: Selecteer, verplaats, kopieer, dupliceer en verwijder tabellen en memo's, stel kleuren en weergaveopties in, definieer indexen en alternatieve sleutels, kies een database, navigeer op het oneindige canvas en vergelijk documenten.
---

# Functies voor tabellen

Alles wat je met tabellen en memo's doet zodra ze bestaan — selecteren, verplaatsen, kopiëren, verwijderen, kleuren en instellen wat het canvas toont — en daarnaast de bediening van het canvas eromheen.  
Eerst komen de opdrachten voor tabellen en memo's; daarna Tabeleigenschappen, het focussen op tabellen, indexen en alternatieve sleutels, Automatische indeling en het databasesysteem; daarna het canvas zelf: de canvaswerkbalk, zoomen, pannen en waar een sprong terechtkomt, en de Verschilweergave; en als laatste wat een editor in alleen-lezenmodus van dit alles behoudt.  
Tabelgroepen, de kaders die tabellen bundelen, hebben een eigen pagina — zie [Tabelgroepen](./table-groups.md).  
Dat geldt ook voor logische namen en de naamweergave, die bepaalt welke namen de tabellen tonen — zie [Logische namen](./logical-names.md).

## Meervoudige selectie {#multiple-selection}

Er zijn drie manieren:

- `Ctrl + drag` (Windows/Linux) of `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) of `⌘ + click` (Mac)
- `Ctrl + A` of `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` of `⌘ + ⌥ + A` (Mac)

Memo's worden op dezelfde manier geselecteerd, en beide sneltoetsen voor alles selecteren nemen alle tabellen en memo's tegelijk mee. Memo's die met View Option → `Memos` zijn verborgen, vallen buiten alles selecteren en buiten een selectiekader — zie [Weergaveopties voor tabellen](#table-view-options).  
[Tabelgroepen](./table-groups.md#selecting-groups) voeg je aan de selectie toe met `Ctrl + click` (Windows/Linux) of `⌘ + click` (Mac) op hun titelbalk, maar alles selecteren neemt er nooit een mee.  
`Ctrl + A` wijkt voor een tekstcursor, dus terwijl je een cel bewerkt, selecteert de sneltoets de tekst in plaats van het diagram.  
Een selectiekader markeert een tabel of memo wanneer het kader het midden ervan bedekt, niet wanneer het alleen een rand raakt. Een tabelgroep wordt alleen meegenomen als het selectiekader het volledige kader van de groep omsluit, dus een selectiekader dat binnen een groep wordt getekend, pikt er tabellen uit zonder de groep.  
Een klik met de rechtermuisknop op iets wat al geselecteerd is, behoudt de hele selectie, zodat menu-items zoals `Color`, `Group selected tables` en `Delete selected` op de hele selectie werken. Een klik met de rechtermuisknop op een andere tabel, memo of tabelgroep selecteert alleen dat element, ook als je `Ctrl` of `⌘` ingedrukt houdt, en een klik met de rechtermuisknop op een relatie of op een leeg deel van het canvas heft de selectie op.  
`Escape` heft de selectie op. Terwijl een editor voor een cel, memo of tabelgroepnaam open is, of terwijl een relatie of een `New Table Group` wordt getekend, beëindigt de eerste `Escape` dat en heft een tweede de selectie op.  
Een editor in alleen-lezenmodus heeft geen van deze manieren om te selecteren: daar selecteert alleen een sprong — zie [Editors in alleen-lezenmodus](#read-only-editors).

![Tabellen selecteren met ⌘ + drag en ⌘ + click, daarna alle tabellen en memo's met ⌘ + A](/img/demo-table-select.webp)

In een sessie voor gezamenlijk bewerken worden de selectie, de gefocuste cel en het selectiekader van elke deelnemer op het canvas getekend in de kleur van die deelnemer — zie [Gezamenlijk bewerken](../../api/advanced/collaborative-editing.md).  
Bij een deelnemer die in een andere naamweergave kijkt, wordt de gefocuste cel getekend op de cel die jouw weergave op die plaats tekent, zoals de naamcel van die deelnemer op jouw cel van de logische naam — zie [Medebewerkers](./logical-names.md#collaborators).

## Meerdere tabellen verplaatsen {#moving-multiple-tables}

Sleep een tabel of memo die al deel uitmaakt van de selectie, en de hele selectie beweegt mee — een modificatietoets is niet nodig.  
Een tabel versleep je aan haar kop of aan een van haar kolomrijen, dus slepen dat op een kolomrij begint, verplaatst de tabel en niet de kolom. Kolommen verplaats je in plaats daarvan met de sleepgreep naast de gefocuste rij — zie [Kolommen herschikken en verplaatsen](./table-editing.md#rearranging-and-moving-columns).  
Op een cel van de kop of een kolomrij begint de tabel pas te bewegen nadat de aanwijzer een klein stukje heeft afgelegd, dus een klik daar focust nog steeds de cel en een dubbelklik opent nog steeds de editor ervan. Slepen begint nooit vanaf de kleurrand van een tabel, die de kleurkiezer opent, vanaf de knoppen `+` en `x` op de kop ervan of vanaf de `x` van een kolomrij.  
Sleep je iets buiten de selectie, dan wordt dat de enige selectie en wordt alleen dat verplaatst. `Ctrl + drag` (Windows/Linux) of `⌘ + drag` (Mac) behoudt de selectie in beide gevallen.  
Alleen de linkermuisknop verplaatst tabellen en memo's. Een klik met de rechtermuisknop bepaalt waarop het contextmenu werkt en verplaatst niets, en slepen met de middelste muisknop pant in plaats daarvan het canvas — zie [Navigeren op het canvas](#getting-around-the-canvas).

![Een van twee geselecteerde tabellen slepen verplaatst ze allebei, en de relatie volgt](/img/demo-table-multiple-move.webp)

Een geselecteerde [tabelgroep](./table-groups.md) beweegt ook mee, met de tabellen erin, en een tabel die zowel geselecteerd is als in een bewegende groep zit, wordt één keer verplaatst.  
De plek waar je een tabel neerzet, kan de tabel in of uit een groep verplaatsen — zie [Tabellen toevoegen en verwijderen](./table-groups.md#adding-and-removing-tables).

Tabellen en memo's delen één stapelvolgorde. Een druk op een tabel of memo, met de linker- of de rechtermuisknop, brengt die vóór alle andere tabellen en memo's, en een druk op de titelbalk van een tabelgroep, of een klik met de rechtermuisknop op het vlak ervan, brengt de tabellen van de groep naar voren.  
De volgorde wordt niet opgeslagen: een opnieuw geopend diagram stapelt de tabellen in de volgorde waarin het bestand ze vermeldt, met alle memo's erboven.

## Tabellen en memo's kopiëren/plakken {#copyingpasting-tables-and-memos}

Kopieert de geselecteerde tabellen en memo's en plakt ze terug als nieuwe exemplaren.  
Sneltoetsen: `Ctrl + C` (Windows/Linux) of `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) of `⌘ + V` (Mac)

Een gekopieerde tabel behoudt naam, logische naam, opmerking, kolommen en kleur; een gekopieerde memo behoudt tekst, grootte en kleur.  
Elke gekopieerde kolom behoudt haar logische naam, en van elke tabel- en kolomnaam blijft bewaard of die uit de woordenboeken is afgeleid — zie [Fysieke namen afleiden](./dictionary.md#deriving-physical-names).  
Een geplakte kolom behoudt haar domeinkoppeling alleen als aan twee voorwaarden is voldaan: het diagram waarin ze terechtkomt, bevat precies dat domein, niet alleen een domein met dezelfde naam, en het domein heeft nog het gegevenstype waarmee de kolom is gekopieerd. Anders komt de kolom zonder domein terecht en behoudt ze het type waarmee ze is gekopieerd — zie [Een kolom koppelen](./dictionary.md#linking-a-column).  
Indexen en relaties gaan ook mee: een index wordt in zijn geheel naar de gekopieerde tabel gekopieerd, en een relatie wordt met haar type en haar ON DELETE- en ON UPDATE-acties gekopieerd wanneer beide tabellen die ze verbindt in de gekopieerde set zitten. Een halve relatie wordt weggelaten in plaats van terug te blijven wijzen naar het origineel.  
De geplakte kopieën worden de nieuwe selectie, en als je dezelfde kopie opnieuw plakt, verschuift die telkens `50px` verder, zodat herhaalde plakacties niet op elkaar komen te liggen.  
Een kopie behoudt haar [tabelgroep](./table-groups.md) niet: de geplakte tabel zit in geen enkele groep, ook niet als die binnen het kader van een groep terechtkomt, en een geselecteerde groep wordt niet gekopieerd.  
Terwijl View Option → `Memos` de memo's verbergt, voegt plakken de meegebrachte memo's nog steeds toe, verborgen en niet geselecteerd, zodat alleen de geplakte tabellen de selectie worden.

![Twee gerelateerde tabellen kopiëren en twee keer plakken, inclusief de relatie](/img/demo-table-copy-paste.webp)

Als er kolommen zijn geselecteerd in een gefocuste tabel, kopieert dezelfde sneltoets in plaats daarvan die kolommen — zie [Tabellen bewerken](./table-editing.md).

## Tabellen en memo's dupliceren {#duplicating-tables-and-memos}

Houd `Alt` ingedrukt en sleep een tabel of memo met de linkermuisknop.  
Een tabel pak je vast aan haar kop of aan een kolomrij, dus `Alt + drag` op een kolomrij dupliceert de tabel en laat de kolomvolgorde ongemoeid. `Alt` ingedrukt houden op de sleepgreep van een kolom dupliceert niets: de kolom wordt verplaatst zoals bij gewoon slepen aan de greep — zie [Kolommen herschikken en verplaatsen](./table-editing.md#rearranging-and-moving-columns).  
Een doorschijnend voorbeeld volgt de aanwijzer, en wanneer je de knop loslaat, wordt de kopie neergezet waar het voorbeeld staat.  
Als wat je vastpakt al deel uitmaakt van een selectie, wordt de hele selectie gedupliceerd. Anders wordt de selectie vervangen door de entiteit onder de aanwijzer.  
`Alt + click` zonder te bewegen zet de kopie `50px` lager en naar rechts neer, en gaat telkens een stap verder wanneer die plek al bezet is.

Een duplicaat neemt hetzelfde mee als [plakken](#copyingpasting-tables-and-memos): namen en logische namen, opmerkingen, kolommen, kleuren, memogroottes en de indexen en relaties die volledig horen bij wat je hebt gekopieerd. Omdat het in hetzelfde diagram blijft, behoudt het de domeinkoppeling van elke kolom zoals die is. Net als bij plakken komt het in geen enkele tabelgroep terecht.  
`Alt + drag` op de titelbalk van een tabelgroep verplaatst de groep zoals normaal slepen dat doet; een groep wordt nooit gedupliceerd.

![Een tabel dupliceren met Alt + drag, daarna Alt + click voor nog een kopie rechtsonder](/img/demo-table-duplicate.webp)

## Tabellen en memo's verwijderen {#table-and-memo-deletion}

Verwijdert de geselecteerde tabellen, memo's en [tabelgroepen](./table-groups.md).  
Sneltoetsen:

- `Delete` of `Backspace`. Deze verwijderen de hele selectie, behalve wanneer het enige geselecteerde element een tabel is waarvan enkele kolommen zijn geselecteerd en het zoomniveau boven `70%` ligt: dan verwijderen ze in plaats daarvan die kolommen — zie [Kolommen verwijderen](./table-editing.md#column-deletion).
- `Ctrl + Backspace` of `Ctrl + Delete` (Windows/Linux), `⌘ + Backspace` of `⌘ + Delete` (Mac). Deze verwijderen altijd de geselecteerde tabellen, memo's en tabelgroepen, ook als er kolommen zijn geselecteerd.

![Een tabel en haar relaties verwijderen met de Delete-toets, daarna een tabel en een memo samen met Delete selected uit het menu van de memo](/img/demo-table-remove.webp)

De contextmenu's verwijderen ook. Het laatste item in het menu van een tabel of memo toont `Delete selected` zolang die tabel of memo een van twee of meer geselecteerde elementen is, en verwijdert de hele selectie. Anders toont het `Delete` en verwijdert het alleen die tabel of memo. Op de rij van een geselecteerde kolom toont het menu van een tabel in plaats daarvan `Delete column` of `Delete columns`, zoals in [Kolommen verwijderen](./table-editing.md#column-deletion).

Wanneer je een tabel verwijdert, worden haar relaties en indexen meeverwijderd. Wanneer je een tabelgroep verwijdert, blijven de tabellen ervan bestaan, zonder groep — zie [Een groep verwijderen](./table-groups.md#removing-a-group).  
Er is geen bevestiging, elke verwijdering is één stap in de geschiedenis, en in een editor met `readonly` wordt niets verwijderd.  
Ingedrukt gehouden verwijderen `Delete` en `Backspace` maar één keer, en ze verwijderen nooit een relatie — zie [Relaties bewerken](./relationship-editing.md#deletion). Terwijl je typt in een cel, een memo of een ander tekstveld, bewerken ze in plaats daarvan de tekst.  
Het tabblad Instellingen toont de twee toetsen als `Delete Selection` — zie [Sneltoetsen](./settings.md#shortcuts).

## Kleur van tabellen en memo's instellen {#table-and-memo-color-specification}

Je kunt kleuren toewijzen om op categorie onderscheid te maken.  
Een tabel draagt haar kleur langs de linkerrand, en een memo langs de bovenkant. Klik met de linkermuisknop op die rand of strook, of kies `Color` in het contextmenu van de tabel of memo, om de kleurkiezer bij de aanwijzer te openen. De kleur wordt toegepast op elke geselecteerde tabel, memo en tabelgroep, niet alleen op het element waarop je hebt geklikt.  
Een tabelgroep kleur je via `Color` in het eigen menu van de groep, en een tabel in een gekleurde groep draagt de kleur van de groep over haar kop, terwijl ze haar eigen kleur op de linkerrand houdt — zie [Een groep kleuren](./table-groups.md#coloring-a-group).

![De vooraf ingestelde kleur Blue kiezen via de kleurstrook van een memo voor twee geselecteerde tabellen en de memo, daarna de kleur verwijderen met No color](/img/demo-table-color.webp)

De kleurkiezer bevat, van boven naar beneden:

- Een vlak voor verzadiging en helderheid, daarna de tintschuifregelaar met een voorbeeld van de kleur ernaast. Waar de browser een pipet aanbiedt, neemt een pipetknop vóór de schuifregelaar, `Pick a color from the screen`, een kleur over van elke plek op het scherm.
- De velden `Hex`, `R`, `G` en `B`. `Hex` accepteert 3, 4, 6 of 8 hexadecimale cijfers, met of zonder `#`, of een geplakte `rgb()`, `hsl()` of CSS-kleurnaam. Een volledige waarde van 6 of 8 cijfers wordt toegepast terwijl je typt, al het andere bij `Enter` of wanneer je het veld verlaat. `R`, `G` en `B` accepteren gehele getallen, lezen alles boven `255` als `255` en worden toegepast bij `Enter` of wanneer je het veld verlaat. Tekst die de kleurkiezer niet kan lezen, wordt genegeerd.
- Zestien vooraf ingestelde kleurstalen in twee rijen van acht: Red, Orange, Amber, Yellow, Lime, Green, Teal, Cyan, Blue, Indigo, Violet, Purple, Pink, Crimson, Brown en Gray. Als je de aanwijzer boven een kleurstaal houdt, zie je de hexcode ervan.
- `Document colors`: maximaal acht kleuren die de tabellen, memo's en tabelgroepen van het document al gebruiken, de meest gebruikte eerst. De rij verschijnt alleen als er zulke kleuren zijn.
- `No color`.

Een kleur is altijd dekkend: de kleurkiezer heeft geen regelaar voor transparantie en laat transparantie in een getypte of geplakte waarde weg.  
De kleurkiezer openen verandert niets, en de kleur kiezen die de selectie al heeft, voegt geen stap aan de geschiedenis toe.

`No color` wist de kleur van elke geselecteerde tabel, memo en tabelgroep als één stap in de geschiedenis en sluit de kleurkiezer. `Remove color`, direct onder `Color` in de contextmenu's van tabellen, memo's en tabelgroepen zolang een geselecteerd element een kleur heeft, doet hetzelfde zonder de kleurkiezer te openen.

De kleurkiezer krijgt de toetsenbordfocus wanneer die opent, en `Tab` en `Shift + Tab` gaan in een rondje langs de bedieningselementen. De pijltoetsen verplaatsen het vlak en de tintschuifregelaar met 1, of met `Shift` met 10, en gaan van kleurstaal naar kleurstaal, waarbij ze elke kleurstaal meteen toepassen.  
Zolang de kleurkiezer de toetsenbordfocus heeft, bereiken ongedaan maken en opnieuw uitvoeren, de zoomsneltoetsen, `Search` en `Toggle Explorer` de editor nog wel, en de andere sneltoetsen van de editor niet: de sneltoetsen voor [verwijderen](#table-and-memo-deletion) verwijderen niets, en `Delete` en `Backspace` bewerken alleen de tekst van de velden `Hex`, `R`, `G` en `B`.  
`Escape` sluit de kleurkiezer, en een druk op het canvas buiten de kleurkiezer ook.  
Een druk in de [Verkenner](./explorer.md) is geen druk op het canvas en laat de kleurkiezer dus open. Een rij die je daar kiest, wijzigt de selectie, en de volgende kleurkeuze kleurt de nieuwe selectie.

## Weergaveopties voor tabellen {#table-view-options}

Biedt de volgende weergaveopties:

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

`Domain`, `Unique`, `Alternate Key` en `Auto Increment` staan standaard uit, en de rest staat aan.  
Welke namen de tabellen tonen, is geen weergaveoptie: `Name View`, direct na `View Option` in het contextmenu van het canvas, kiest fysieke namen, logische namen of beide — zie [De weergave wisselen](./logical-names.md#switching-the-view).  
`Domain` geeft elke kolom een cel, geplaatst volgens de [kolomvolgorde](./settings.md#adjusting-column-order), met de naam van het domein waaraan de kolom is gekoppeld. Een kolom die aan geen domein is gekoppeld dat op het blad `Domains` staat, toont daar de tijdelijke aanduiding `domain`, gedimd. De cel verschijnt in elke naamweergave. Zolang `Domain` uitstaat, toont de weergave `Logical Names` in plaats daarvan de naam van een gekoppeld domein in de typecel — zie [De domeincel](./logical-names.md#the-domain-cell).  
`Alternate Key` markeert de kolommen van elke alternatieve sleutel, zoals `AK1.1` — zie [Alternatieve sleutels](#alternate-keys).  
`Referential Actions` toont de labels `D:` en `U:` die de ON DELETE- en ON UPDATE-acties van een relatie op haar verbindingslijn bij de kindtabel plaatsen — zie [Een verbindingslijn lezen](./relationship-editing.md#reading-a-connector). Als je deze optie uitschakelt, worden alleen die labels verborgen en worden geen tabellen of verbindingslijnen verplaatst.  
`Table Groups` toont de [tabelgroepen](./table-groups.md) en de groepskleuren op de koppen van hun tabellen. Als je deze optie uitschakelt, worden ze verborgen op het canvas, op de minimap en in geëxporteerde afbeeldingen, wordt geen tabel verplaatst en blijft elke tabel in haar groep — zie [Groepen verbergen](./table-groups.md#hiding-groups). Ook verdwijnt de map `Table Groups` uit de [Verkenner](./explorer.md#the-tree) en `New Table Group` van de [canvaswerkbalk](#canvas-toolbar), en vindt de zoekfunctie van de Verkenner geen groepsnamen meer.  
`Memos` toont de memo's. Als je deze optie uitschakelt, wordt elke memo verborgen op het canvas, op de minimap en in geëxporteerde afbeeldingen, en worden geen tabellen of verbindingslijnen verplaatst. Verborgen memo's nemen geen ruimte in, dus de schuifbalken, de minimap en het kompas `Go to content` laten ze buiten beschouwing.  
Als je de memo's verbergt, worden ze gedeselecteerd en wordt een geopende memo-editor gesloten. De [Verkenner](./explorer.md#the-tree) laat de map `Memos` weg, en de functie [Zoeken en vervangen](./find-and-replace.md) ervan en het voorvoegsel `:` van Snel zoeken doorzoeken ze niet. Zolang ze verborgen zijn, verdwijnt `New Memo` uit het contextmenu, de [canvaswerkbalk](#canvas-toolbar), Snel zoeken en het [welkomstscherm](./editing-start.md#welcome-screen), en voegt `Alt + M` geen memo toe. Plakken of [Importeren en toevoegen](./file-import-export.md#import-and-add) voegt de meegebrachte memo's nog steeds toe, verborgen en niet geselecteerd.  
In een editor in alleen-lezenmodus werken de schakelaars nog steeds, maar alleen op dat scherm: ze worden niet opgeslagen, niet in de ongedaanmakingsgeschiedenis vastgelegd en niet gedeeld, en ze gaan terug naar die van het bestand als de editor weer bewerkbaar wordt — zie [Editors in alleen-lezenmodus](./settings.md#read-only-editors) bij Instellingen.

![Items van View Option in- en uitschakelen terwijl de tabellen zich opnieuw schikken, een samengestelde unieke index markeren als AK1.1 en AK1.2 met Alternate Key, daarna Memos uit- en weer inschakelen](/img/demo-view-options.webp)

Kaarten in de modus `Flow` van het tabblad Visualisatie volgen deze opties niet, `Domain` inbegrepen: ze gebruiken hun eigen [rijweergave](./visualization.md#row-display) en tekenen hun verbindingslijnen ook als `Relationship` uitstaat. Welke cellen een kaart toont, hangt alleen af van de naamweergave — zie [Namen op de kaarten](./visualization.md#names-on-the-cards).

## Tabeleigenschappen {#table-properties}

Opent het eigenschappenpaneel van een tabel.  
Kies `Table Properties` in het contextmenu van een tabel, waarmee je het paneel opent voor de tabel waarop je met de rechtermuisknop hebt geklikt, of selecteer een tabel en druk op `Alt + Space`.  
Het paneel opent in het midden van een gedimd canvas. Alleen het canvas wordt gedimd, dus een geopende [Verkenner](./explorer.md#dialogs-beside-it) blijft ernaast open en bruikbaar. De kop bevat de titel `Table Properties`, de vijf laatst geopende tabellen als chips, waarbij de huidige gemarkeerd is, en een sluitknop. Elke chip benoemt zijn tabel zoals de [naamweergave](./logical-names.md#beyond-the-canvas) dat doet. Klik op een chip om naar die tabel te gaan zonder het paneel opnieuw te openen.  
Onder de kop staan drie tabbladen: `Indexes`, `Schema SQL` en `Code Generator`. Het paneel houdt voor alle drie dezelfde grootte, dus wisselen tussen tabbladen verplaatst het paneel niet en wijzigt de grootte niet.  
Sluit het met de sluitknop, met `Escape` of door buiten het paneel op het canvas te klikken.  
Als je in de Verkenner een andere rij dan een map kiest, of naar een overeenkomst van de zoekfunctie gaat, wordt Tabeleigenschappen vóór de sprong gesloten. Dat geldt ook voor `Ctrl + F` (Windows/Linux) of `⌘ + F` (Mac), dat de zoekfunctie van de Verkenner opent, of de tekstcursor in het zoekveld zet als de Verkenner al open is. Elke andere klik in de Verkenner, ook op een maprij, of op de knop `Explorer` op de werkbalk, laat Tabeleigenschappen open. Druk je op `Escape` terwijl de toetsenbordfocus in de Verkenner ligt, dan gaat de toetsenbordfocus alleen terug naar het canvas, dus er is een tweede `Escape` nodig om Tabeleigenschappen te sluiten.

Het tabblad `Indexes` staat beschreven in [Indexen](#indexes).  
Het tabblad `Schema SQL` toont de DDL van de tabel voor de geselecteerde [database](#databases): de `CREATE TABLE`, de aparte beperkingen die sommige databases voor de unieke kolommen schrijven, en de indexen. Het schrijft altijd kale `CREATE`-instructies, zonder kop, zonder script vóór of na de tabellen en zonder logische namen in lege opmerkingen, hoe het tabblad [Schema SQL](./schema-sql.md) op de werkbalk ook is ingesteld — zie [Logische namen als opmerkingen](./schema-sql.md#logical-names-as-comments). Het heeft geen optiepaneel, en het contextmenu biedt alleen `Database` en `Bracket`.  
Het tabblad `Code Generator` genereert alleen code voor deze tabel — zie [Codegenerator](./code-generator.md).

In een editor in alleen-lezenmodus opent het paneel nog steeds, via `Table Properties`, de enige rij van het contextmenu van een tabel daar, of met `Alt + Space` op de tabel die een sprong selecteerde. Het toont een badge `Read only` naast de titel, en het tabblad `Indexes` biedt geen bewerkingen.  
Een paneel dat openstaat wanneer de editor in alleen-lezenmodus gaat, blijft open en gaat mee in alleen-lezenmodus — zie [Editors in alleen-lezenmodus](#read-only-editors).

## Focussen op tabellen {#focusing-on-tables}

Opent het tabblad Visualisatie in de modus `Flow`, beperkt tot de gekozen tabellen en elke tabel die er één relatie van verwijderd is.  
Kies `Focus on this table` in het contextmenu van een tabel, of selecteer een of meer tabellen en druk op `Alt + F`.  
Als de tabel waarop je met de rechtermuisknop klikt een van meerdere geselecteerde tabellen is, toont het item `Focus on selected tables` en focust het op de hele selectie. Een klik met de rechtermuisknop op een tabel buiten de selectie focust alleen op die tabel.  
De sneltoets gebruikt de geselecteerde tabellen, laat memo's weg en doet niets als er geen tabel is geselecteerd. Het menu van een tabel in een editor in alleen-lezenmodus heeft geen `Focus on this table`, en de sneltoets gebruikt daar de tabel die een sprong selecteerde — zie [Editors in alleen-lezenmodus](#read-only-editors).  
Een geselecteerde [tabelgroep](./table-groups.md) telt hier niet mee, bij de sneltoets en bij het menu-item: de tabellen ervan worden alleen meegenomen als ze zelf geselecteerd zijn, wat `Select tables` in het menu van de groep doet.  
Wat de beperkte weergave toont en hoe je terugkeert naar het hele diagram, staat beschreven in [Visualisatie](./visualization.md#focusing-on-tables), en hoe je een stap terug en vooruit gaat door wat de stroomweergave eerder heeft getoond in [Vorige en volgende tabel](./visualization.md#previous-table-and-next-table).

## Indexen {#indexes}

Indexen definieer je op het tabblad `Indexes` van het eigenschappenpaneel van de tabel, en ze worden opgenomen in de geëxporteerde Schema SQL.

De linkerkant toont de sleutels en indexen van de tabel in twee groepen.  
`Keys`, dat verschijnt als de tabel sleutels heeft, toont de sleutels die de kolommen declareren: `PK_<table name>` over de kolommen gemarkeerd als PK, daarna `UQ_<table name>_<column name>` voor elke kolom gemarkeerd als Uniek, in kolomvolgorde. De namen zijn de fysieke namen die de Schema SQL van de geselecteerde database schrijft, ongeacht de naamweergave, dus met `Bracket` op `None` staat voor een tabel met schemanaam zoals `sales.users` bij elke database behalve Databricks en Snowflake `PK_users` in de lijst — zie [Tabelnamen met schemanaam](./schema-sql.md#schema-qualified-table-names). Elke sleutel heeft het label `PK` of `UQ` en is gemarkeerd met een slot. Ze zijn hier alleen-lezen en veranderen alleen met de vlaggen [PK](./table-editing.md#column-primary-key) en [Uniek](./table-editing.md#not-null-unique-auto-increment) van de kolommen.  
`Indexes` toont de indexen van de tabel in de volgorde waarin ze zijn toegevoegd. Elke index heeft een schakelaar `UQ` die de index uniek maakt, een naamveld en een `x` die de index verwijdert. Een index die een [alternatieve sleutel](#alternate-keys) is, toont ook zijn nummer, zoals `AK1`. Voeg een index toe met `Add Index` onderaan de lijst.

De rechterkant toont de kolommen van de tabel onder `Columns`, elk met een selectievakje. Elke rij toont dezelfde cellen als de rij van de kolom op het canvas, volgens de kolomvolgorde, de weergaveopties en de [naamweergave](./logical-names.md#beyond-the-canvas). Niets is bewerkbaar totdat links een index is geselecteerd.  
Vink een kolom aan om die aan de geselecteerde index toe te voegen, en vink de kolom uit om die te verwijderen. Als je een sleutel selecteert, worden de kolommen ervan aangevinkt weergegeven, maar de selectievakjes blijven uitgeschakeld.  
De kolommen van de geselecteerde index staan daaronder bij `Index order`, elk benoemd zoals de naamweergave haar benoemt, met in de weergave `Both Names` de naam tussen haakjes na de logische naam, zoals `Member Number (member_no)`. Sleep ze aan de greep om de volgorde te wijzigen, en klik op de chip `ASC` of `DESC` in een rij om de sorteervolgorde om te draaien. Bij een alternatieve sleutel eindigt elke rij op de bijbehorende markering `AK<n>.<m>`. De lijst toont drie rijen tegelijk; voor de rest scroll je.

In een editor in alleen-lezenmodus toont het selecteren van een sleutel of index nog steeds de kolommen ervan, maar er is geen `Add Index` en geen `x`, en verder kan niets op het tabblad worden gewijzigd: de namen accepteren geen invoer, elk selectievakje is uitgeschakeld, en de rijen van `Index order` laten zich niet slepen en wisselen hun sorteervolgorde niet.

De [Verkenner](./explorer.md#the-tree) toont de indexen van elke tabel in de map `Indexes` van die tabel, en als je er daar een kiest, ga je naar de tabel ervan. De zoekfunctie ervan vindt ook indexnamen en kan die wijzigen — zie [Wat er wordt doorzocht](./find-and-replace.md#what-it-searches).

![Tabeleigenschappen openen voor orders, waar het tabblad Indexes de sleutels PK en UQ boven de indexen toont, daarna een index toevoegen over member_id en ordered_at DESC en die terugzien op het tabblad Schema SQL](/img/demo-table-properties.webp)

## Alternatieve sleutels {#alternate-keys}

Een alternatieve sleutel is een unieke index over twee of meer kolommen: een index op het tabblad `Indexes` met de schakelaar `UQ` aan en ten minste twee kolommen van de tabel aangevinkt.  
Een unieke index over één kolom zegt niet meer dan de vlag Uniek van die kolom en is dus geen alternatieve sleutel, en een niet-unieke index, de primaire sleutel of een kolom gemarkeerd als Uniek zijn dat ook niet.

Met `Alternate Key` ingeschakeld in de [weergaveopties](#table-view-options) markeert het diagram de kolommen van elke alternatieve sleutel zoals erwin en IDEF1X dat doen: `AK1.1`, `AK1.2` enzovoort. De optie staat standaard uit.

Sleutels worden genummerd naar de plaats van hun kolommen in de tabel, niet naar de volgorde waarin de indexen zijn toegevoegd. De sleutel waarvan de eerste kolom in de `Index order` het hoogst in de tabel staat, is `AK1`. Bij een gelijke stand beslist de volgende kolom van elke sleutel, en een sleutel die het begin vormt van een langere sleutel, komt vóór die sleutel.  
Een kolom binnen de tabel verplaatsen of de `Index order` van een sleutel herschikken kan de sleutels opnieuw nummeren. Als je het verwijderen van een sleutel ongedaan maakt, krijgt die zijn nummer terug, en elke medebewerker ziet dezelfde nummers.

Elke kolom van een sleutel wordt gemarkeerd met `AK<n>.<m>`, waarbij `n` het nummer van de sleutel is en `m` de plaats van de kolom in de `Index order` van de sleutel. Een kolom in meerdere sleutels draagt alle markeringen, gescheiden door een komma.  
In een tabel met de kolommen `a`, `b` en `c` worden unieke indexen over (`c`, `a`) en (`b`, `a`) bijvoorbeeld `AK1` = (`b`, `a`) en `AK2` = (`c`, `a`), omdat `b` boven `c` staat. Zo krijgt `b` de markering `AK1.1`, `c` de markering `AK2.1` en `a` de markering `AK1.2,AK2.2`.

De markering wordt als laatste in de rij getekend, na de cel die de [kolomvolgorde](./settings.md#adjusting-column-order) als laatste plaatst. Ze is geen cel en wordt dus nooit gefocust, bewerkt of gekopieerd — zie [Tabellen bewerken](./table-editing.md).  
Een kolom met primaire of refererende sleutel kan ook een AK-markering dragen, omdat de markering niets vervangt: het sleutelpictogram aan het begin van de rij toont nog steeds PK en FK, en de cel Uniek houdt haar eigen `UQ`.  
Een tabel met een alternatieve sleutel houdt na de laatste cel van elke rij ruimte vrij voor haar langste markering; een tabel zonder alternatieve sleutel behoudt haar breedte.  
De markeringen verschijnen op het ERD-canvas, waar een tabel die bij `70%` en lager tot haar naam is ingeklapt er geen toont, en in een [geëxporteerde afbeelding](./file-import-export.md#image), die elke tabel volledig tekent, ongeacht het zoomniveau. Het [voorbeeld bij aanwijzen](./visualization.md#hover-preview) van het tabblad Visualisatie in de modus `Graph` toont ze ook; kaarten in `Flow` tonen ze nooit.

Het tabblad `Indexes` toont de nummers, of de optie nu aanstaat of niet — zie [Indexen](#indexes).

## Automatische indeling {#auto-layout}

Rangschikt alle tabellen op het canvas voor je.  
Open `Auto Layout` via het contextmenu van het canvas of via Snel zoeken, en kies een van vier indelingen:

| Indeling | Wat die tekent |
| --- | --- |
| `Force` | Een simulatie: relaties trekken tabellen naar elkaar toe, buren duwen elkaar weg en overlappende tabellen schuiven uit elkaar. |
| `Flow` | Van links naar rechts langs de relaties, waarbij elke verbindingslijn een eigen aansluitpunt op een tabel krijgt. Deze indeling probeert het aantal kruisingen klein te houden, maar kan er een paar laten staan die een andere indeling zou vermijden. |
| `Tree - vertical` | In lagen naar beneden: een oudertabel staat boven de tabellen die een refererende sleutel naar haar hebben. |
| `Tree - horizontal` | Dezelfde gelaagdheid, van links naar rechts. |

`Force` opent een voorbeeld terwijl de indeling tot rust komt, met `Apply` en `Cancel` in de melding die het toont.  
Het voorbeeld wordt ingekaderd op het diagram zoals het was toen de indeling begon, dus tabellen kunnen buiten beeld raken terwijl de indeling tot rust komt. Het wordt getekend bij `70%` of minder, dus de tabellen zijn ingeklapt tot hun naam en hun kleurrand. Het opent in de naamweergave waarin je kijkt, ongeacht welke weergave het bestand behoudt — zie [Buiten het canvas](./logical-names.md#beyond-the-canvas).  
`Apply` behoudt de posities zoals ze op dat moment zijn, en de indeling wordt vanzelf toegepast zodra die tot rust komt. `Cancel` of `Escape` laat het diagram zoals het was.

De andere drie worden in één keer berekend, buiten de hoofdthread, dus er valt niets te volgen: er verschijnt een melding terwijl de indeling wordt berekend, en de uiteindelijke rangschikking wordt gecentreerd op het gebied dat het diagram al beslaat. `Cancel` of `Escape` laat een indeling vallen waarop je niet langer wacht, en een host die geen shared worker draait, eindigt met `Could not place tables` — zie [Web Workers](../../api/installation.md#web-workers). Een indeling die niet binnen 60 seconden terugkomt, eindigt op dezelfde manier.

Welke je ook kiest, tabellen en tabelgroepen worden verplaatst en memo's blijven waar ze zijn. De tabellen worden geplaatst op de breedte die ze hebben in de naamweergave waarin je kijkt. Een relatie van een tabel naar zichzelf wordt genegeerd, en meerdere relaties tussen dezelfde twee tabellen tellen als één.  
Elke indeling houdt de tabellen van elke groep bij elkaar, of de groepen nu worden weergegeven of niet, en past elke groep met tabellen om die tabellen heen aan — zie [Tabelgroepen](./table-groups.md#auto-layout).  
Het resultaat komt als één stap in de geschiedenis terecht, dus één keer ongedaan maken zet elke tabel en groep terug waar die stond.  
Een editor in alleen-lezenmodus biedt geen `Auto Layout` aan. Eén die nog loopt wanneer de editor in alleen-lezenmodus gaat, eindigt daar: het voorbeeld `Force` sluit met zijn melding en behoudt geen van zijn posities, en een indeling die nog wordt berekend, wordt met zijn melding weggegooid, dus er verplaatst geen tabel, noch toen noch als de editor weer bewerkbaar is.

![Een stapel tabellen opruimen met de automatische indeling Flow uit het contextmenu van het canvas, die ze van links naar rechts langs hun relaties op een rij zet](/img/demo-automatic-table-placement.webp)

## Databases {#databases}

Ondersteunde databases zijn onder meer:

- Databricks
- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- Snowflake
- SQLite

Kies er een via `Database` in het contextmenu van het canvas, in het optiepaneel of het contextmenu van de tabbladen Schema SQL en Codegenerator, of in Snel zoeken. Ze wijzigen allemaal dezelfde instelling. Het contextmenu van het canvas van een editor in alleen-lezenmodus heeft geen `Database`, en een keuze in de andere wijzigt alleen dat scherm — zie [Editors in alleen-lezenmodus](#read-only-editors).

Deze opties bepalen de Schema SQL-syntaxis voor het exporteren, de automatische aanvulling van gegevenstypen en de typen waarin gegenereerde code en geïmporteerde schema's worden omgezet.  
Ze bepalen welke keuzes voor `Statements` en `Header` het tabblad [Schema SQL](./schema-sql.md#options-panel) kan schrijven. Een keuze die de database niet kent, blijft gedimd in het optiepaneel staan, en de SQL valt terug op de dichtstbijzijnde keuze die de database wel heeft.  
Ze bepalen ook welke ON DELETE- en ON UPDATE-acties Schema SQL en de ORM-doelen van de Codegenerator schrijven, en welke de relatiemenu's markeren met `not in <database>` — zie [ON DELETE en ON UPDATE](./relationship-editing.md#on-delete-and-on-update) en [Codegenerator](./code-generator.md#database).  
Bij een Schema SQL-import blijft het gegevenstype van een kolom behouden, inclusief de argumentenlijst, of de editor het nu vermeldt of niet, zoals `TIMESTAMP WITH TIME ZONE`, `public.mood` of `integer[]` — zie [Gegevenstypen](./file-import-export.md#data-types). De automatische aanvulling van gegevenstypen stelt alleen de typen voor die de geselecteerde database vermeldt.

![De database omzetten naar PostgreSQL, daarna een PostgreSQL-type kiezen in de automatische aanvulling](/img/demo-database.webp)

![Automatische aanvulling van gegevenstypen bij benadering, doorlopen met de pijltoetsen en geaccepteerd met Right, Tab of Enter](/img/demo-data-type-autocomplete.webp)

## Canvaswerkbalk {#canvas-toolbar}

Een kleine werkbalk zweeft boven het midden van de onderrand van het canvas en bevat, van links naar rechts, de gereedschappen die op het canvas zelf werken en de opdrachten die er iets aan toevoegen:

- De hand en de aanwijzer. De aanwijzer is de standaard; de hand maakt van elke sleepbeweging een panbeweging, over tabellen en over lege ruimte. `Space` wisselt tussen beide. Zolang het tekenen van een [`New Table Group`](./table-groups.md#drawing-a-group) actief is, is de knop `New Table Group` gemarkeerd in plaats van een van beide, en een klik op een van beide, een druk op `Space` of het kiezen van een relatienotatie beëindigt het tekenen zonder een groep toe te voegen.
- `New Table`, `New Memo` en `New Table Group`. `New Table` voegt een tabel toe zoals `Alt + N`, en `New Memo` voegt een memo toe zoals `Alt + M`. `New Table Group` activeert het [tekenen van een groep](./table-groups.md#drawing-a-group) zoals `Alt + G` en schakelt de hand uit; een tweede klik beëindigt, net als een tweede `Alt + G`, het tekenen zonder een groep toe te voegen. `New Memo` ontbreekt zolang View Option → `Memos` de memo's verbergt, en `New Table Group` zolang View Option → `Table Groups` de groepen verbergt.
- De zoom: `Zoom out`, het huidige zoomniveau als percentage en `Zoom in`. De twee knoppen wijzigen het zoomniveau stapsgewijs op dezelfde manier als de zoomsneltoetsen, en een klik op het percentage zet het terug op `100%`.
- De vier relatienotaties, dezelfde vier waarmee je een relatie begint — zie [Beginnen met bewerken](./editing-start.md). Als je er een kiest, schakel je terug naar de aanwijzer, omdat je een relatie tekent door op twee tabellen te klikken.
- `Name View`, een knop met een pijl omlaag die de weergave noemt die van kracht is: `Physical Names`, `Logical Names` of `Both Names`. De knop houdt één breedte, welke weergave hij ook noemt, zodat wisselen de werkbalk nooit verschuift. Een klik opent boven de werkbalk een lijst met de drie, met een vinkje bij de weergave die van kracht is. Als je er een kiest, wissel je naar die weergave en sluit de lijst; een tweede klik op de knop, een druk ergens anders of `Escape` sluit de lijst zonder te wisselen. Wat elke weergave toont, staat beschreven in [Naamweergave](./logical-names.md#name-view), en of wisselen wordt opgeslagen in [De weergave wisselen](./logical-names.md#switching-the-view).
- De zen-modus, `Alt + Z`, die alles behalve het canvas en deze werkbalk verbergt. Nog een keer `Alt + Z`, of de knop, brengt de rest terug. Een geopende Verkenner wordt met de rest verborgen, zonder te worden gesloten, en komt ermee terug. De Verkenner kan tijdens de zen-modus nog steeds worden geopend — zie [Wanneer de Verkenner plaatsmaakt](./explorer.md#when-it-stands-aside).
- Het kompas `Go to content`, dat alleen aan het einde van de werkbalk verschijnt zolang er geen tabel, weergegeven memo of weergegeven tabelgroep in beeld is — zie [Navigeren op het canvas](#getting-around-the-canvas).

Elke knop met een sneltoets vermeldt die in de knopinfo, zoals `New Table (Alt + N)` (Windows/Linux) of `New Table (⌥ + N)` (Mac).  
De werkbalk maakt plaats zolang het voorbeeld van Automatische indeling `Force`, Tabeleigenschappen, Tijdreizen of de Verschilweergave open is, en komt terug zodra dat sluit.  
De werkbalk van een editor in alleen-lezenmodus behoudt de zoom, `Name View`, de zen-modus en het kompas `Go to content`. Hij heeft geen hand of aanwijzer, geen `New Table`, `New Memo` of `New Table Group` en geen notaties, en krijgt ze terug zodra de editor weer bewerkbaar is.

![Een tabel en een memo toevoegen via de werkbalk, New Table Group activeren en deactiveren, pannen met de hand, het zoomniveau stapsgewijs wijzigen en de zen-modus in- en uitschakelen met ⌥ + Z](/img/demo-canvas-toolbar.webp)

## In- en uitzoomen {#zoom-inout}

Zoomen gaat met `Ctrl + Wheel` (Windows/Linux) of `⌘ + Wheel` (Mac). Het scrollwiel alleen pant het canvas.  
Knijpen op een trackpad zoomt ook, rond het punt waar je knijpt, en dat doen ook twee vingers op een touchscreen, die bij het bewegen ook pannen.  
Sneltoetsen: `Ctrl + Plus` (Windows/Linux) of `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) of `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) of `⌘ + 0` (Mac) gaat direct terug naar `100%` en houdt het midden van het scherm op zijn plaats.

De knoppen `Zoom out` en `Zoom in` op de [canvaswerkbalk](#canvas-toolbar) wijzigen het zoomniveau stapsgewijs zoals de sneltoetsen `Minus` en `Plus`: elke druk verschuift het 4 procentpunten en houdt het midden van het scherm op zijn plaats. Het percentage ertussen toont het huidige zoomniveau, en een klik erop gaat direct terug naar `100%`, zoals `Ctrl + 0` (Windows/Linux) of `⌘ + 0` (Mac).

Het zoomniveau loopt van `10%` tot `150%`.  
Bij `70%` en lager worden tabellen ingeklapt tot hun naam en hun kleurrand, en werken het bewerken van cellen, de celsneltoetsen en kopiëren en plakken niet meer totdat je weer inzoomt. De naam die een ingeklapte tabel toont, volgt de naamweergave — zie [Naamweergave](./logical-names.md#name-view).

Dezelfde drie sneltoetsen zoomen ook op het tabblad Visualisatie, zowel in de modus `Graph` als in `Flow`, elke modus binnen zijn eigen bereik — zie [Visualisatie](./visualization.md#toolbar).

![Uitzoomen met ⌘ + Wheel tot tabellen tot hun naam inklappen, daarna stapsgewijs terug met ⌘ + Plus, ⌘ + Minus en ⌘ + 0](/img/demo-zoom.webp)

## Navigeren op het canvas {#getting-around-the-canvas}

Het canvas heeft geen randen en geen in te stellen grootte. Tabellen en memo's staan waar je ze neerzet, en alles hieronder beschrijft het diagram en niet een vaste pagina.

Sleep over een leeg deel van het canvas om te pannen, of schakel met `Space` over naar het handgereedschap en sleep waar je wilt, ook over een tabel. Het scrollwiel pant ook, en `Shift + Wheel` pant zijwaarts.  
Het vlak van een [tabelgroep](./table-groups.md#selecting-groups), het gebied onder de titelbalk, telt voor de linkermuisknop als leeg canvas: slepen erover pant, `Ctrl + drag` (Windows/Linux) of `⌘ + drag` (Mac) tekent een selectiekader en een klik heft de selectie op.  
Pannen kent geen grenzen: het scrollwiel, slepen en het handgereedschap nemen de weergave mee zo ver als je beweegt, aan elke kant voorbij de tabellen.

Sleep met de middelste muisknop (druk het scrollwiel in) om vanaf elke plek op het canvas te pannen, zowel met de aanwijzer als met de hand. Dit werkt ook wanneer de druk op een tabel, een memo, een cel, een pictogram of een relatie terechtkomt.  
Slepen met de middelste muisknop selecteert, verplaatst en klikt niets, en behoudt de selectie. Het sluit een geopend contextmenu en de kleurkiezer, en het eigen scrollen en plakken van de browser bij een middelklik start niet.  
Een druk met de middelste muisknop op de schuifbalken, de minimap, de canvaswerkbalk of een geopende cel- of memo-editor pant niet.

De minimap in de rechterbovenhoek toont het diagram met aan elke kant een scherm aan ruimte, het bereik van de schuifbalken, naar buiten afgerond op een grof raster, dus hoe verder je uitzoomt, hoe kleiner het diagram erin staat. Klik erop om de weergave naar dat punt te verplaatsen, of sleep de rechthoek van het weergavegebied om te pannen. Als je uitzoomt, wordt de rechthoek van het weergavegebied groter en beslaat die meer van de kaart.  
De minimap tekent elke tabel in de kleur van die tabel, en elke weergegeven tabelgroep als een kader in de kleur van de groep achter de tabellen ervan.  
De schuifbalken langs de rechter- en onderrand beschrijven hetzelfde bereik, dat loopt van het diagram net buiten de ene kant van het scherm tot net buiten de andere, dus het is ten minste een scherm langer dan het getekende diagram, en nog langer zolang de weergave er voorbij staat. Buiten de zen-modus verschijnen beide schuifbalken zodra het document een tabel, een weergegeven memo of een weergegeven tabelgroep bevat, ook als alles op het scherm past. Een document zonder een van deze, zoals een document waarvan de enige memo's met View Option → `Memos` zijn verborgen, toont geen van beide, en geen minimap.  
Het schuifblokje van een schuifbalk of de rechthoek van het weergavegebied in de minimap slepen is de enige panbeweging die stopt: die gaat niet verder dan de tabellen net buiten beeld, of dan waar het slepen begon als dat verder naar buiten lag.

Als er na het pannen geen tabel, weergegeven memo of weergegeven tabelgroep meer in beeld is, verschijnt een kompas `Go to content` aan het einde van de [canvaswerkbalk](#canvas-toolbar), met een pijl naar het dichtstbijzijnde element en de afstand ernaartoe. Klik erop om dat element te centreren zonder het zoomniveau te wijzigen.

![Pannen door over leeg canvas te slepen, met het scrollwiel, door met de middelste muisknop over een tabel te slepen en via de minimap, daarna met Shift + wheel voorbij de inhoud en terug via het kompas Go to content](/img/demo-canvas-navigation.webp)

### Waar een sprong terechtkomt {#where-a-jump-lands}

Elke sprong die je naar iets op het canvas brengt, verplaatst de weergave volgens één regel: de resultaten van `#`, `@` en `:` in [Snel zoeken](./quick-search.md#searching-the-diagram), de rijen van de [Verkenner](./explorer.md#going-to-a-row) en de overeenkomsten van de zoekfunctie [Zoeken en vervangen](./find-and-replace.md#going-to-a-match) ervan, de rijen in de lijst van de [Verschilweergave](#going-to-a-change), de [kaartknop](./visualization.md#card-buttons) voor de externe link in de stroomweergave, een controle die een tabel of kolom noemt op het [blad Controles](./dictionary.md#the-checks-sheet) van het tabblad Woordenboek en de plek waar [Importeren en toevoegen](./file-import-export.md#import-and-add) iets neerzet. Elk van die secties vertelt wat de sprong selecteert; deze sectie vertelt waar de weergave naartoe gaat.

Een sprong wijzigt nooit het zoomniveau en scrolt hoogstens één keer. Vanaf een ander tabblad schakelt de sprong eerst over naar het ERD-tabblad.  
De sprong meet het canvas zoals het wordt weergegeven: onder de bovenste werkbalk, of over de hele hoogte in de zen-modus, en rechts van een geopende Verkenner, die het canvas smaller maakt in plaats van het te bedekken.

Horizontaal en verticaal worden afzonderlijk beoordeeld, en een richting waarin het doel al goed in beeld is, blijft precies zoals die is:

- Een doel dat in die richting niet langer is dan de helft van het canvas, blijft staan zolang het midden ervan in de middelste helft van het canvas ligt, tussen een kwart en drie kwart van de breedte, of van de hoogte. Anders wordt het midden ervan naar het midden van het canvas gebracht.
- Een langer doel dat nog past met `40px` ruimte aan elk uiteinde, blijft staan zolang het volledig in beeld is. Anders wordt het horizontaal gecentreerd; verticaal wordt de bovenkant ervan op `40px` onder de bovenkant van het canvas gebracht.
- Een doel dat nog langer is, blijft staan zolang het volledig in beeld is, of, als het langer is dan het canvas, zolang het kerndeel ervan, hieronder vermeld, in beeld is. Anders wordt het gecentreerd als het past, of anders zo dicht bij het midden geplaatst als mogelijk is terwijl beide uiteinden van het kerndeel ten minste `40px` binnen het canvas blijven; bij een kerndeel dat daarvoor te lang is, blijft het begin `40px` naar binnen.

Een kleine tabel bij de linkerrand van het canvas, halverwege de hoogte, wordt dus alleen horizontaal verplaatst.

Wat een sprong in beeld brengt, en het kerndeel dat zichtbaar moet zijn als het geheel niet past:

- Een tabel: de hele tabel, met als kerndeel de naambalk bovenaan, of de opmerkingscel bij een overeenkomst in een tabelopmerking zolang View Option → `Table Comment` de opmerkingen toont. Bij `70%` en lager, waar tabellen tot hun naam inklappen, is dat de naam in het midden van het vak.
- Een kolom: de rij ervan, met als kerndeel de cel waar de sprong naartoe gaat: de naam, de logische naam bij een overeenkomst in een logische naam of een controle van de logische naam, de domeincel bij een controle van het domein, of de opmerking waarin een overeenkomst staat zolang View Option → `Column Comment` de opmerkingen toont. Waar de rij zo'n cel niet tekent, gaat de sprong naar de cel die op die plaats wordt getekend: de logische naam voor de naam in de weergave `Logical Names`, de naam voor de logische naam in de weergave `Physical Names`, en de typecel voor de domeincel zolang View Option → `Domain` uitstaat, of de rij als geheel zolang ook `DataType` uitstaat. Bij `70%` en lager brengt een kolom haar tabel in beeld volgens de regel voor tabellen.
- Een cel die te breed is om geheel te tonen, zoals een lange opmerking: met als kerndeel de overeenkomende tekst erin. Een sprong naar de cel die wordt getekend in plaats van de cel waarin de overeenkomst staat, zoals de naam bij een overeenkomst in een logische naam in de weergave `Physical Names`, gaat niet uit van de tekst.
- Een relatie: de rechthoek die haar twee tabellen omspant, met als kerndeel de kindtabel.
- Een tabelgroep: het kader ervan, met als kerndeel de titelbalk.
- Een memo, of het blok dat Importeren en toevoegen neerzet: het geheel.

Als geen van beide richtingen zou bewegen, wordt er niet gescrold, dus als je twee keer achter elkaar naar dezelfde plek gaat, beweegt er de tweede keer niets. Een sprong die het canvas scrolt, legt de scroll vast in de [geschiedenis](./undo-redo.md#what-the-history-records), net als elke andere wijziging van de weergavepositie, en een sprong die niets verplaatst, laat niets achter om ongedaan te maken. Bij Importeren en toevoegen hoort de scroll bij dezelfde stap als de toevoeging. Een rij in de lijst van de Verschilweergave verplaatst alleen de kanten van de weergave, die alleen-lezen zijn, en legt dus niets vast, en een editor in alleen-lezenmodus legt helemaal geen sprong vast.  
Geen enkele sprong start of voltooit een relatie die wordt getekend. Het kompas `Go to content` is geen sprong: het centreert waar het naar wijst.

## Verschilweergave {#diff-viewer}

Je kunt eerder opgeslagen documenten vergelijken met het huidige document.  
Kies `Diff Viewer` in het contextmenu van het canvas en selecteer een `.json`-document dat je eerder hebt geëxporteerd.

De weergave opent over het canvas: links wat er is gewijzigd, daarna het opgeslagen en het huidige document naast elkaar.  
Het huidige document wordt vergeleken zoals het is wanneer de weergave opent; wijzigingen die daarna worden aangebracht, ook die van een medebewerker, komen niet in de weergave terecht. Beide kanten openen, en blijven, in de naamweergave waarin je kijkt, ongeacht welke weergave een van beide bestanden behoudt — zie [Buiten het canvas](./logical-names.md#beyond-the-canvas). Een geopende [Verkenner](./explorer.md#when-it-stands-aside) wordt verborgen zolang de weergave open is, zodat de weergave de volledige breedte van de editor inneemt.  
Elke kant pant met het scrollwiel, door over een leeg gebied of het vlak van een tabelgroep te slepen, of door ergens op die kant met de middelste muisknop te slepen, en zoomt met `Ctrl + Wheel` (Windows/Linux), `⌘ + Wheel` (Mac) of een knijpbeweging. Bij `70%` en lager klappen de tabellen ervan in, zoals op het canvas — zie [Markeringen aan beide kanten](#marks-on-the-two-sides).  
Beide kanten zijn alleen-lezen, dus er wordt niets in je document gewijzigd. Elke kant heeft een eigen selectie, en een klik op een tabel daar selecteert die alleen aan die kant.  
Sluit de weergave met de knop `Close` in de melding `Diff Viewer` waarmee die opent, of met `Escape`.  
Een editor in alleen-lezenmodus biedt ook `Diff Viewer` aan, en de weergave werkt daar zoals in elke editor, waarbij een klik op een tabel van een kant die nog steeds alleen aan die kant selecteert. Een weergave die openstaat wanneer de editor in alleen-lezenmodus gaat, blijft open.

![De Verschilweergave openen voor een opgeslagen .json-bestand, op rijen gemarkeerd met A, M, D en R in de boomstructuur klikken, filteren op naam en de weergave sluiten](/img/demo-diff-viewer.webp)

### Wat er wordt vergeleken {#what-is-compared}

Tabellen, kolommen, indexen, refererende sleutels, memo's en tabelgroepen worden allemaal vergeleken.  
Elk element wordt eerst gekoppeld op zijn id, dus bij vergelijking met een eerdere versie van hetzelfde bestand, die de id's behoudt, blijft een hernoemde tabel, kolom, index of tabelgroep één element, vermeld als hernoemd.  
Wat overblijft, wordt één op één gekoppeld op wat het behoudt: een tabel of tabelgroep op de naam, inclusief hoofdlettergebruik; een kolom of index op de tabel en de naam; een refererende sleutel op de twee tabellen en de kolomparen; en een memo op de tekst, daarna op de positie. Een index zonder naam wordt gekoppeld op de kolommen, hun volgorde en richting en of de index uniek is, en een tabelgroep zonder naam op de groep waarmee die de meeste tabellen gemeen heeft.  
Bij vergelijking met een bestand van elders, zoals een diagram dat via een SQL-import opnieuw is opgebouwd, verschijnt een hernoemde tabel dus als één verwijderde en één toegevoegde tabel.

Wat als wijziging telt:

- Een tabel: naam, opmerking, tabelgroep, positie en kleur.
- Een kolom: naam, opmerking, gegevenstype, standaardwaarde, automatisch ophogen, primaire sleutel, Uniek, NOT NULL en de plaats in de tabel. Alleen de kolommen buiten de volgorde die beide documenten delen, tellen als verplaatst, dus een kolom toevoegen, verwijderen of verplaatsen markeert de andere niet.
- Een index: naam, UNIQUE en kolommen, met hun volgorde en richting.
- Een refererende sleutel: kolomparen, relatietype en ON DELETE- en ON UPDATE-acties.
- Een memo: tekst, positie, grootte en kleur.
- Een tabelgroep: naam, de tabellen die de groep bevat, kleur, positie en grootte.

Een tabel, memo of groep die alleen is verplaatst, van grootte is veranderd of een andere kleur heeft gekregen, telt dus als gewijzigd. Posities en groottes worden in hele pixels vergeleken, en de stapelvolgorde en de plek waar een verbindingslijn een tabel raakt, tellen nooit mee.  
Logische namen, domeinkoppelingen en de woorden, termen en domeinen van het tabblad [Woordenboek](./dictionary.md) worden niet vergeleken, dus een wijziging die alleen daarin zit, wordt niet vermeld en niet gemarkeerd. Een gegevenstype dat door een domein is gewijzigd, telt wel, als wijziging van het gegevenstype van de kolom.

### De wijzigingsboom {#the-change-tree}

De lijst links wordt getekend zoals de [boomstructuur van de Verkenner](./explorer.md#the-tree) en bevat alleen wat er is gewijzigd: `Tables`, `Table Groups` en `Memos`, elk alleen weergegeven als die een rij bevat, en onder een tabel de eigen `Columns`, `Indexes` en `Foreign Keys`. Een refererende sleutel staat onder zijn kindtabel, en een toegevoegde of verwijderde tabel toont niets daarbinnen.  
Elke map toont hoeveel rijen die bevat, en elke map en tabel is in het begin uitgevouwen.  
Een rij van een tabel of kolom wordt benoemd in de naamweergave waarin de kanten zijn geopend. In de weergave `Both Names` toont de rij de logische naam met de naam erachter, gedempt, en op een verwijderde rij wordt de gedempte naam samen met de rest doorgestreept. Tabellen en tabelgroepen worden op naam gesorteerd, zonder onderscheid tussen hoofdletters en kleine letters, ongeacht de weergave. Memo's, en de kolommen, indexen en refererende sleutels van een tabel, volgen de volgorde van het huidige document, waarbij een verwijderd element wordt teruggezet waar het stond. Een memorij toont de eerste regel van de memo, en een rij van een refererende sleutel toont de kindkolommen, daarna `→` met de oudertabel en de kolommen daarvan, zoals `user_id → users(id)`. Een lege naam toont `unnamed` cursief.

Elke rij eindigt op een letter, en bij een rij gemarkeerd met `A`, `D`, `M` of `R` staat de naam in de kleur van die letter:

- `A`, toegevoegd, in groen: alleen in het huidige document.
- `D`, verwijderd, in rood en doorgestreept: alleen in het opgeslagen document.
- `M`, gewijzigd, in amber: in beide, met wijzigingen.
- `R`, hernoemd, in blauw: in beide, met een nieuwe naam. Een naamswijziging gaat boven elke andere wijziging, die de knopinfo nog wel vermeldt.
- `~`, in amber, staat aan het einde van elke map en van een tabel die alleen wordt vermeld vanwege wijzigingen erbinnen; hun namen houden de gebruikelijke kleur.

Houd de aanwijzer boven de naam van een rij voor de knopinfo: de status, `Added`, `Deleted`, `Modified`, `Renamed` of `Changed inside`, daarna één regel per wijziging, zoals `Name: users → members` of `NN: ✗ → ✓`. Een tekst wordt aangehaald met de eerste regel, afgekapt na 40 tekens, en een lege waarde toont `—`. De knopinfo van een toegevoegd of verwijderd element bevat alleen de status.

`Filter by name`, boven de boomstructuur, houdt de rijen over waarvan de huidige of opgeslagen naam, of de huidige of opgeslagen logische naam, bevat wat je typt, zonder onderscheid tussen hoofdletters en kleine letters, in elke naamweergave. Een tabel waarvan de naam overeenkomt, houdt al haar rijen, en een tabel waarvoor dat niet geldt, houdt alleen de overeenkomende rijen. Een filter zonder overeenkomsten laat de boom leeg.  
Als de twee documenten helemaal niet verschillen, toont de boom `No changes`.

Sleep de rechterrand van de boom om die breder of smaller te maken, van `200px` tot `480px`, en dubbelklik op de rand om die terug te zetten op `260px`. Elke vergelijking opent op `260px`, en de twee kanten verdelen de rest van de breedte gelijk.  
Met het toetsenbord navigeer je door de boom zoals door die van de Verkenner — zie [Toetsen in de Verkenner](./explorer.md#keys-in-the-explorer) — maar hier sluit `Escape`, in de boom of in `Filter by name`, de weergave.

### Naar een wijziging gaan {#going-to-a-change}

Klik op een rij, of druk op `Enter` of `Space` terwijl de toetsenbordfocus erop staat, om naar het bijbehorende element te gaan aan elke kant die het bevat: een toegevoegd element alleen aan de huidige kant, een verwijderd element alleen aan de opgeslagen kant, en alles wat beide bevatten aan beide kanten. Een klik op een maprij vouwt die alleen samen of uit, en de pijl aan het begin van een tabelrij doet hetzelfde.

- Een rij van een tabel, kolom of index selecteert alleen de tabel.
- Een rij van een refererende sleutel brengt de twee tabellen in beeld, of de kindtabel als de twee te ver uit elkaar liggen om samen te tonen, selecteert de kindtabel met haar kolommen met refererende sleutel en laat de verbindingslijn oplichten — zie [Een verbindingslijn lezen](./relationship-editing.md#reading-a-connector).
- Een memorij selecteert de memo, en een rij van een tabelgroep selecteert de groep. Bij een memo of groep die het document van een kant verbergt, gaat de sprong aan die kant nergens heen.

Elke kant beweegt volgens de regel in [Waar een sprong terechtkomt](#where-a-jump-lands), gemeten aan die kant, dus nogmaals op dezelfde rij klikken verplaatst niets.

### Markeringen aan beide kanten {#marks-on-the-two-sides}

De twee kanten kleuren tekst, omlijningen en verbindingslijnen, en vullen niets in. Toegevoegd is groen en verschijnt alleen aan de huidige kant, verwijderd is rood en verschijnt alleen aan de opgeslagen kant, en gewijzigd, in amber, en hernoemd, in blauw, verschijnen aan beide kanten. Alles wat ongewijzigd is, wordt op de gebruikelijke manier getekend.

- Een toegevoegde of verwijderde tabel of tabelgroep krijgt een omlijning in die kleur, en de naam neemt die kleur aan. Een toegevoegde of verwijderde memo krijgt een omlijning.
- Een kolom die is toegevoegd of verwijderd in een tabel die beide documenten bevatten, kleurt haar hele rij, en een verplaatste kolom kleurt haar hele rij amber. Binnen een toegevoegde of verwijderde tabel wordt niets afzonderlijk gemarkeerd.
- De tekst van een gewijzigde cel wordt amber: de opmerking van een tabel, de opmerking, het gegevenstype, de standaardwaarde, automatisch ophogen, Uniek of NOT NULL van een kolom, of de tekst van een memo. Een wijziging van de primaire sleutel kleurt het sleutelpictogram van de kolom amber.
- Bij een hernoemde tabel, kolom of tabelgroep staat de naam in blauw.
- Een tabel, memo of tabelgroep met een wijziging die geen eigen cel heeft, zoals een verplaatsing, een nieuwe grootte of kleur, of een wijziging van groep of van de tabellen van een groep, krijgt een amberkleurige omlijning.
- Een toegevoegde, verwijderde of gewijzigde refererende sleutel tekent zijn verbindingslijn in die kleur. Als je de aanwijzer erboven houdt, of als een rij die laat oplichten, wordt die in plaats daarvan getekend in de gebruikelijke kleur bij aanwijzen.
- Een indexwijziging markeert aan geen van beide kanten iets; die is alleen in de boom te zien.

Elke kant volgt de weergaveopties van het eigen document. Een wijziging in een cel die die kant niet tekent, verschijnt in plaats daarvan op de naam. Een kolomwijziging in een cel die een weergaveoptie verbergt, zoals `Unique` of `Auto Increment`, die allebei standaard uitstaan, kleurt de naam van de kolom amber, en dat geldt ook voor een wijziging van de primaire sleutel in een rij zonder sleutelpictogram. Een wijziging van de tabelopmerking terwijl `Table Comment` uitstaat, kleurt de naam van de tabel amber. Het blauw van een naamswijziging gaat boven dit amber. Een memo of tabelgroep die het eigen document verbergt, staat wel in de boom maar wordt aan die kant niet getekend.

In de weergave `Logical Names`, die geen naamcel tekent, komen het blauw van een naamswijziging en het amber van een wijziging in een cel die de kant niet tekent op de logische naam die op de plaats van de naam wordt getekend. Een wijziging van het gegevenstype kleurt de typecel amber in elke naamweergave, ook waar de cel de naam van een domein toont. Geen van beide kanten tekent de kleuren die de controles van het Woordenboek namen op het canvas geven — zie [Markeringen op het canvas](./dictionary.md#marks-on-the-canvas).

Bij `70%` en lager behouden ingeklapte tabellen hun omlijning. De naam behoudt het groen of rood van een toegevoegde of verwijderde tabel, of het blauw van een naamswijziging, en neemt anders het amber van een gewijzigde opmerking aan. Kolomwijzigingen worden pas getekend als je weer inzoomt; de boom vermeldt ze nog wel.

## Editors in alleen-lezenmodus {#read-only-editors}

Een editor met [`readonly`](../../api/erd-editor-element.md#readonly), zoals een Git-revisie die in VS Code opnieuw als diagram wordt geopend, is een lezer. Zijn zes tabbladen, de [Verkenner](./explorer.md#read-only-editors), de minimap, de schuifbalken en de cursors en selecties van medebewerkers blijven, en elk bedieningselement dat het diagram zou wijzigen is weg in plaats van gedimd.

Op het ERD-canvas:

- Een sleepbeweging pant, waar ze ook begint: op leeg canvas, een tabel, een memo of een tabelgroep. De middelste knop, het wiel, een knijpbeweging en de zoomtoetsen werken zoals in elke editor.
- De aanwijzer op een tabel laat haar relaties oplichten. Een klik die niet beweegt, laat de relaties oplichten van de tabel waarop hij terechtkomt, of de relatie waarop hij terechtkomt, en een klik elders dooft het licht.
- Een druk, een selectiekader of een toets voor alles selecteren selecteert niets. Alleen een sprong selecteert: een rij van de [Verkenner](./explorer.md#going-to-a-row), een overeenkomst van de bijbehorende [Zoeken en vervangen](./find-and-replace.md#going-to-a-match), of een resultaat met `#`, `@` of `:` van [Snel zoeken](./quick-search.md#searching-the-diagram) selecteert waar hij terechtkomt, omlijnd zoals elke selectie, met de gefocuste cel waar de sprong die plaatst. Een klik die niet beweegt, wist die selectie.
- De pijltoetsen verplaatsen de gefocuste cel. Kopiëren, `Table Properties` en `Focus on this table` werken op wat een sprong selecteerde, met hun toetsen, en plakken voegt niets toe. De andere toetsen staan in [Sneltoetsen](./settings.md#shortcuts).
- Er opent geen naam van een cel, memo of tabelgroep voor bewerken. Er zijn geen knoppen `+` of `x` op tabellen, memo's en groepen, geen randen om het formaat van memo's en groepen te wijzigen, geen sleephandvat voor kolommen en geen kleurkiezer.

Het contextmenu van het canvas behoudt `View Option`, `Name View`, `Export` en `Diff Viewer`. Het heeft geen `New Table`, `New Memo`, `New Table Group`, `Toggle Explorer`, `Relationship`, `Derive Physical Names Again`, `Database`, `Import`, `Import and Add` of `Auto Layout`.  
Het menu van een tabel behoudt alleen `Table Properties`, dat het paneel voor die tabel alleen-lezen opent — zie [Tabeleigenschappen](#table-properties). Een memo, een relatie en een tabelgroep roepen geen menu op.  
De [canvaswerkbalk](#canvas-toolbar) behoudt de zoom, `Name View`, de zen-modus en het kompas `Go to content`. De bovenste werkbalk toont de naam van het databasesysteem als tekst die niet kan worden bewerkt, en geen `Undo`, `Redo` of `Time Travel`.  
[Export](./file-import-export.md#exporting), met alle drie zijn items, en de [Verschilweergave](#diff-viewer) werken zoals in elke editor.

[`View Option`](#table-view-options), de `Name View`, het databasesysteem, het tabblad, de positie van de weergave en de zoom veranderen daar nog steeds, maar alleen op dat scherm: niets slaat ze op, legt ze vast of deelt ze — zie [Editors in alleen-lezenmodus](./settings.md#read-only-editors) bij Instellingen.

Een editor in alleen-lezenmodus zetten beëindigt wat openstond voor bewerken: een editor voor een cel, memo of tabelgroepnaam, een relatie of `New Table Group` die wordt getekend, de selectie en de gefocuste cel, het handgereedschap, de kleurkiezer, [Map Columns](./relationship-editing.md#map-columns) en [Tijdreizen](./undo-redo.md#time-travel). De weergave, de zoom, het tabblad en de naamweergave blijven zoals ze waren, en Tabeleigenschappen, de Verschilweergave en het dialoogvenster `Export image` blijven open.  
Een gebaar dat bezig is, eindigt daar ook. Een sleepbeweging van tabellen of memo's stopt waar ze staat, een `Alt + drag` laat geen kopie vallen, een kolomsleepbeweging eindigt, het wijzigen van de grootte van een memo stopt waar het staat, het wijzigen van de grootte van een tabelgroep wordt weggegooid, en een [Automatische indeling](#auto-layout) wordt met zijn melding weggegooid, dus er verplaatst geen tabel.  
Weer bewerkbaar gemaakt geeft de editor de bovenstaande bedieningselementen terug, en opent niets wat de omschakeling sloot opnieuw.
