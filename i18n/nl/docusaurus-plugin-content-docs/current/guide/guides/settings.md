---
sidebar_position: 16
description: Synchronisatie van gegevenstypen via relaties en domeinen, maximale breedte van opmerkingen, instellingsvergrendelingen (weergave-, tabblad- en code-instellingen en naamweergave), weergavevolgorde van kolommen, de lijst met sneltoetsen en het tabblad Instellingen van een editor in alleen-lezenmodus.
---

# Instellingen

Open de instellingen met de knop `Settings` op de werkbalk of via [Snel zoeken](./quick-search.md) onder `Tab`.
Het instellingenscherm heeft twee tabbladen: `Preferences` en `Shortcuts`. `Preferences` opent als eerste, behalve via de rij `Shortcuts` van het [welkomstscherm](./editing-start.md#welcome-screen), die `Shortcuts` opent.

Het thema en de weergavetaal staan niet op dit scherm. De knoppen `Theme` en `Display Language` op de werkbalk openen ze — zie [Taal en thema](./language-and-theme.md).

## Gegevenstypen via relaties synchroniseren {#relationship-datatype-sync}

Bepaalt of gegevenstypen worden gesynchroniseerd. De instelling staat standaard aan.
Wijzig je dan het gegevenstype van een kolom, dan wordt het toegepast op elke kolom die er via een relatie mee verbonden is, langs de keten vanaf beide uiteinden, zodat een refererende sleutel nooit afwijkt van de sleutel waarnaar hij verwijst.
Van een sleutel naar zijn refererende sleutels gaat een serial-type over als het type voor gehele getallen dat het opslaat, net als bij het tekenen van een relatie — zie [Identificerende relaties](./relationship-editing.md#identifying-relationships). Als je een sleutel wijzigt in `serial`, krijgen zijn refererende sleutels onder PostgreSQL dus `integer`, en vanaf daar gaat de wijziging verder langs de keten.
Van een refererende sleutel terug naar zijn sleutel gaat het type over zoals het geschreven is, behalve dat een serial-sleutel zijn type behoudt en de wijziging daar stopt.
Het dialoogvenster [Kolommen toewijzen](./relationship-editing.md#map-columns) volgt deze instelling ook: zolang ze aanstaat, krijgt elke bestaande kolom die ermee wordt toegewezen het type dat de bijbehorende sleutel van de oudertabel aan een refererende sleutel geeft, en gaat de wijziging zoals hierboven verder langs de relaties. Zolang de instelling uitstaat of de sleutel geen gegevenstype heeft, behoudt de kolom haar eigen type.

Een [domein](./dictionary.md#domains-and-data-types) geeft zijn `Data Type` door aan de kolommen die eraan zijn gekoppeld, wanneer dat type wijzigt en wanneer een kolom wordt gekoppeld. Zolang deze instelling aanstaat, gaat de wijziging vanaf elk van die kolommen zoals hierboven verder langs de relaties; zolang ze uitstaat, wijzigen alleen de gekoppelde kolommen. Een kolom die in die stap het type van haar domein krijgt, behoudt het, ook waar de synchronisatie haar een ander type zou geven, zoals het type voor gehele getallen dat een serial-sleutel aan zijn refererende sleutels geeft.
Een gekoppelde kolom die door de synchronisatie of door Kolommen toewijzen een ander type krijgt dan dat van haar eigen domein, wordt in dezelfde stap van dat domein ontkoppeld — zie [Ontkoppelen](./dictionary.md#unlinking). Bij het plakken van kolommen gaat nooit een type langs deze instelling verder, zelfs niet het type van een domein dat door het plakken wordt gekoppeld — zie [Kolommen kopiëren/plakken](./table-editing.md#copyingpasting-columns). Een `Data Type` dat op het blad `Domains` van het tabblad Woordenboek wordt geplakt, gaat wel verder, zoals elke wijziging van het type van een domein.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Instelling voor het synchroniseren van gegevenstypen via relaties" loading="lazy" />

![members.id wijzigen in BIGINT UNSIGNED, waardoor elke member_id die ermee verbonden is, wordt bijgewerkt](/img/demo-relationship-data-type-sync.webp)

## Maximale breedte van opmerkingen {#maximum-comment-width}

Geeft de maximale breedte van de opmerkingskolom in pixels aan (`60` ~ `200`).
Als je de schakelaar uitschakelt, vervalt de limiet, en zolang hij uitstaat, is het invoerveld uitgeschakeld.
Als je hem inschakelt, begint de waarde op `60px`. Een getypte waarde buiten het bereik wordt teruggebracht naar de dichtstbijzijnde grens.

![Maximum comment width inschakelen, 120 invoeren en het ERD-tabblad dat de opmerkingen op die breedte afkapt](/img/demo-settings-comment-width.webp)

## Vergrendeling {#lock}

De lijst `Lock` bevat zeven instellingen. Zolang de vergrendeling van een instelling aanstaat, behoudt het bestand de waarde die de instelling had toen ze werd vergrendeld, dus als je haar op het scherm wijzigt, blijft het bestand zoals het was.

| Rij | Wat het bestand behoudt | In een nieuw diagram |
| --- | --- | --- |
| `Viewport` | Het zoomniveau en de weergavepositie van het ERD-canvas, als één vergrendeling | `100% · 0, 0` |
| `Canvas Type` | Het tabblad waarop het diagram opent: `ERD`, `Visualization`, `Schema SQL`, `Code Generator` of `Dictionary` | `ERD` |
| `Language` | De taal van de [Codegenerator](./code-generator.md#language) | `GraphQL` |
| `Table Name Case` | De [notatie van tabelnamen](./code-generator.md#name-case) van de Codegenerator | `Pascal` |
| `Column Name Case` | De [notatie van kolomnamen](./code-generator.md#name-case) van de Codegenerator | `Camel` |
| `Bracket Type` | De optie `Bracket` van het tabblad [Schema SQL](./schema-sql.md#database-and-bracket) en van de doelen van de [Codegenerator](./code-generator.md#bracket) die deze optie aanbieden | `None` |
| `Name View` | De [naamweergave](./logical-names.md#name-view) waarin het diagram opent: `Physical Names`, `Logical Names` of `Both Names` | `Physical Names` |

Elke rij toont een waarde en een vergrendelknop, en een klik op de knop zet die ene vergrendeling aan of uit.
Zolang een vergrendeling aanstaat, toont de knop een gesloten slot met de knopinfo `Unlock Viewport` (enzovoort voor elke rij), en is de waarde, met de knopinfo `Locked value`, de waarde die het bestand behoudt.
Zolang ze uitstaat, toont de knop een open slot met de knopinfo `Lock Viewport`, en is de waarde, gedimd en met de knopinfo `Current value`, de instelling zoals die nu is.
`Viewport` toont het zoomniveau en daarna de weergavepositie, zoals `75% · -40, 91`. De weergavepositie is het punt op het scherm, in pixels, waar `0, 0` van het diagram ligt, en een coördinaat van duizend of meer wordt verkort, zoals in `1.2k` of `-24k`.

Vergrendelen legt de instelling vast zoals die op dat moment is.
Zolang een vergrendeling aanstaat, werkt de instelling op het scherm nog steeds: je kunt scrollen en zoomen, van tabblad wisselen, een andere taal, een andere naamnotatie of andere aanhalingstekens kiezen via de menu's, de optiepanelen of Snel zoeken, en de naamweergave wisselen via elk van haar kiezers — zie [De weergave wisselen](./logical-names.md#switching-the-view).
Het bestand behoudt echter de vergrendelde waarde, en de rij blijft die tonen, dus het diagram opent opnieuw op de vergrendelde weergave, op het vergrendelde tabblad, in de vergrendelde naamweergave en met de vergrendelde taal, naamnotaties en aanhalingstekens. Een JSON-export schrijft ook de vergrendelde waarden weg.
Zet de vergrendeling uit om op te slaan wat het scherm toont, en vanaf dan volgt het bestand de instelling: met `Viewport` uit opent het diagram waar je het hebt achtergelaten. Zet de vergrendeling uit en weer aan om in plaats daarvan een nieuwe waarde te vergrendelen, zoals een nieuwe beginweergave.
Als de vergrendelde weergave bij het openen van het bestand niets van het diagram toont, gaat het scherm toch naar het diagram, en blijft de vergrendelde waarde zoals ze is.
`Canvas Type` behoudt nooit het tabblad Instellingen. Zet je deze vergrendeling aan, dan wordt het laatste andere tabblad vergrendeld waarop je was, en zolang ze uitstaat, toont de rij dat tabblad.

![Viewport ontgrendelen, in het diagram scrollen en zoomen en het opnieuw vergrendelen op de nieuwe weergave die de rij toont](/img/demo-settings-locks.webp)

Een vergrendeling in- of uitschakelen wijzigt het bestand, omdat het bestand opslaat welke vergrendelingen aanstaan, maar net als de rest van het tabblad Instellingen wordt het niet vastgelegd in de [geschiedenis](./undo-redo.md#what-the-history-records). Het wisselen van de naamweergave wordt evenmin vastgelegd, vergrendeld of niet.
Elke andere instelling wordt opgeslagen zoals ze is: de database, de opties in [`View Option`](./table-related-functions.md#table-view-options) en de rest van het tabblad `Preferences`.
Een editor in alleen-lezenmodus wijzigt het bestand via geen van beide, wat de vergrendelingen ook aangeven: zijn vergrendelknoppen en de andere bedieningselementen van `Preferences` zijn uitgeschakeld, en de instellingen die je nog wel kunt wijzigen, blijven op dat scherm — zie [Editors in alleen-lezenmodus](#read-only-editors).

Elke vergrendeling staat aan in een nieuw diagram, een diagram dat vanaf niets is begonnen: een leeg bestand dat is geopend in VS Code, Obsidian of een JetBrains-IDE (`ERD Editor: Create new diagram` en `New ERD` van Obsidian maken er een), een nieuw schema in de webapp, een bestand dat is gemaakt via het menu New van Google Drive of een `<erd-editor>` zonder waarde.
Een schema of Google Drive-bestand dat de webapp maakt door een SQL-, DBML-, AML- of GraphQL-bestand te importeren, begint ook met elke vergrendeling aan. Een schema of bestand dat uit een JSON-bestand is gemaakt, behoudt de vergrendelingen die dat bestand vastlegt.
Een bestand dat je opent, behoudt de vergrendelingen waarmee het is opgeslagen, elke vergrendeling op haar vergrendelde waarde.
Een bestand dat geen vergrendelingen vastlegt, zoals een bestand dat is opgeslagen door een versie van vóór de vergrendelingen of dat met de hand is geschreven, opent met elke vergrendeling aan: de weergave op `100% · 0, 0` en het tabblad op `ERD`, ongeacht de weergave en het tabblad die het heeft opgeslagen, en de taal, de naamnotaties, het type aanhalingstekens en de naamweergave vergrendeld zoals het bestand ze heeft opgeslagen.
Een bestand dat is opgeslagen door een versie van vóór de vergrendeling van de naamweergave, opent in de weergave `Physical Names` met `Name View` vergrendeld, ook als elke andere vergrendeling die het vastlegt uitstaat.
Een `Import` die het diagram vervangt, stelt ook de vergrendelingen in: een JSON-bestand brengt de vergrendelingen mee die het vastlegt en de waarden die ze bevatten, en een SQL-, DBML-, AML- of GraphQL-bestand behoudt je vergrendelingen, maar zet de weergave terug op `100% · 0, 0`, vergrendeld of niet — zie [Externe bestanden importeren](./file-import-export.md#importing-external-files). Als je de import ongedaan maakt, komen de vergrendelingen en vergrendelde waarden terug die de import heeft vervangen.

Een wijziging die een vergrendeling uit het bestand houdt, telt niet als wijziging. VS Code markeert het tabblad niet als gewijzigd, en Obsidian en een JetBrains-IDE laten het bestand zoals het was, zowel wanneer ze uit zichzelf opslaan als wanneer het tabblad wordt gesloten.
Zolang elke vergrendeling aanstaat, komen rondkijken in een diagram, van tabblad wisselen, een andere taal, naamnotatie of andere aanhalingstekens uitproberen en de naamweergave wisselen dus nooit in `git diff` terecht.
Met `Viewport` uit wijzigen scrollen en zoomen het bestand; met `Canvas Type` uit doet van tabblad wisselen dat ook, inclusief wisselen naar het tabblad Instellingen; en met `Name View` uit doet het wisselen van de naamweergave dat ook.
Het lege bestand van een nieuw diagram blijft leeg tot de eerste wijziging die het bestand behoudt: een bewerking, een wijziging van een instelling waar geen vergrendeling op staat of het in- of uitschakelen van een vergrendeling.
Een diagram openen en zonder zo'n wijziging sluiten laat het bestand zoals het was, ongeacht welke versie of welke machine het heeft geschreven. Het bestand bevat alleen wat het diagram is, in een vaste volgorde, en een bestand dat in een oudere vorm is opgeslagen, wordt bij de eerste wijziging van die soort eenmalig in deze vorm herschreven — zie [Opslagvorm en runtimewaarde](../../api/advanced/schema.md#storage-form-and-runtime-value).
In VS Code is een revisie die met `Reopen Editor With...` opnieuw als diagram is geopend, zoals een Git-revisie of een item uit Local History, alleen-lezen en wordt die nooit als gewijzigd gemarkeerd.
In Google Drive wordt scrollen, zoomen of wisselen naar een ander tabblad nooit op zichzelf opgeslagen, vergrendeld of niet. Met `Viewport` uit wordt de weergave alleen samen met een andere wijziging weggeschreven, dus een Drive-bestand opent waar de weergave stond bij de laatste keer opslaan, en hetzelfde geldt voor het tabblad met `Canvas Type` uit. Het wisselen van de naamweergave met `Name View` uit wordt opgeslagen zoals een bewerking, en wisselen terwijl de vergrendeling aanstaat of in een editor in alleen-lezenmodus wordt nooit opgeslagen.

In een [sessie voor gezamenlijk bewerken](../../api/advanced/collaborative-editing.md) bereikt het in- of uitschakelen van een vergrendeling elke editor, en behoudt een vergrendeling de waarde van de editor die haar heeft ingeschakeld.
Als `Language`, een naamnotatie, `Bracket Type` of `Name View` wordt uitgeschakeld, krijgt elke editor de waarde die wordt getoond in de editor die de vergrendeling heeft uitgeschakeld, zodat ze allemaal één waarde opslaan. Het uitschakelen van `Viewport` of `Canvas Type` verplaatst bij niemand de weergave of het tabblad.
Een taal, naamnotatie of type aanhalingstekens die je kiest terwijl de vergrendeling ervan aanstaat, bereikt nog steeds elke editor, maar zolang `Name View` aanstaat, heeft elke editor zijn eigen naamweergave: wisselen is alleen te zien in de editor waarin is gewisseld, en het inschakelen van de vergrendeling verandert bij niemand de weergave. Zolang ze uitstaat, wisselen alle editors mee wanneer de weergave wordt gewisseld in een editor die niet alleen-lezen is.
Een codeeragent die via de MCP-server werkt, heeft geen tool voor de vergrendelingen of voor de instellingen die ze vasthouden, en leest bij een vergrendelde taal, naamnotatie of type aanhalingstekens de waarde die het bestand behoudt. Alleen de imports van de agent in de modus `replace` bereiken ze, zoals een `Import` dat doet — zie [Instellingen](../../mcp/tools.md#settings) en [Importeren](../../mcp/tools.md#import). De tool `erd_list` en het formaat `snapshot` van `erd_read` laten de naamweergave weg, en de agent bewerkt het schema, logische namen inbegrepen, ongeacht de weergave waarin iemand kijkt.

## Kolomvolgorde aanpassen {#adjusting-column-order}

Stelt de weergavevolgorde van kolommen in tabellen in.
Sleep een rij om haar te verplaatsen — de hele rij is versleepbaar, en het greeppictogram geeft dat aan. De negen rijen zijn, in hun standaardvolgorde, `Logical Name`, `Name`, `DataType`, `Domain`, `Not Null`, `Unique`, `Auto Increment`, `Default` en `Comment`.
`Logical Name` bepaalt de plaats van de cel van de logische naam die een rij in de weergave `Both Names` toont. In de weergave `Logical Names` staat de logische naam in plaats daarvan op de plaats van de rij `Name`, en de weergave `Physical Names` toont er geen — zie [Naamweergave](./logical-names.md#name-view). `Domain` bepaalt de plaats van de domeincel die View Option → `Domain` toont — zie [De domeincel](./logical-names.md#the-domain-cell).
Een cel die door een [weergaveoptie voor tabellen](./table-related-functions.md#table-view-options) is verborgen of door de naamweergave wordt weggelaten, behoudt haar plaats in de lijst, zodat de volgorde geldt voor welke cellen er ook worden getoond.
Een diagram waarvan de volgorde is ingesteld voordat `Logical Name` en `Domain` rijen waren, krijgt `Logical Name` direct vóór `Name` en `Domain` direct na `DataType`, waar die ook in de volgorde staan.
Een diagram dat een latere release heeft opgeslagen, behoudt zijn volgorde ook, zelfs als die release een rij heeft die deze mist: de rijen die deze release heeft, staan in de volgorde die het bestand geeft, en de onbekende rij blijft weg. Het diagram hier opslaan schrijft de volgorde zonder die rij, en de latere release zet die rij weer naast zijn buurman in haar eigen standaardvolgorde.
De markering van de [alternatieve sleutel](./table-related-functions.md#alternate-keys) (`AK1.1` enzovoort) is geen van deze rijen. Ze staat altijd als laatste in een rij, na welke cel deze volgorde ook als laatste zet.

![Omlaag scrollen naar Column Order en de rij Comment omhoog slepen tot onder Name, waardoor elke opmerking direct na de kolomnaam komt te staan](/img/demo-settings-column-order.webp)

## Sneltoetsen {#shortcuts}

Het tabblad `Shortcuts` is een alleen-lezentabel met `Command` en `Keybinding`, die de toetscombinaties toont voor het platform dat je gebruikt.

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | `T` en daarna `G` | `T` en daarna `G` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

De meeste hiervan werken alleen op het ERD-tabblad, en ze worden onderdrukt zolang Snel zoeken, Tabeleigenschappen, de Verschilweergave, het voorbeeld van Automatische indeling, Tijdreizen, het dialoogvenster [`Export image`](./file-import-export.md#image) of [`Map Columns`](./relationship-editing.md#map-columns) open is.
`Search`, `Toggle Explorer` en `Stop` zijn de uitzonderingen: `Search` schakelt Snel zoeken vanaf elk tabblad in en uit, `Toggle Explorer` opent de [Verkenner](./explorer.md#opening-and-closing) vanaf elk tabblad op het zoekveld ervan en schakelt over naar het ERD-tabblad, en `Stop` is de toets die Snel zoeken, Tabeleigenschappen, de Verschilweergave, het voorbeeld van Automatische indeling, Tijdreizen, het dialoogvenster `Export image`, `Map Columns`, de themabouwer, de taalkiezer `Display Language`, de kleurkiezer, de lijst die een knop `Name View` opent en een geopend contextmenu sluit.
`Toggle Explorer` sluit de Verkenner weer zolang die op het ERD-tabblad open is en niet door de zen-modus is verborgen, zoals de knop `Explorer` op de werkbalk doet. Als Snel zoeken, Tabeleigenschappen, de themabouwer, de taalkiezer `Display Language`, het dialoogvenster `Export image` of `Map Columns` open is, sluit de sneltoets dat in plaats daarvan en gaat de toetsenbordfocus naar het zoekveld van de Verkenner.
`Toggle Explorer` doet niets zolang een cel, een memo of de naam van een tabelgroep wordt bewerkt. Zolang een cel van het tabblad [Woordenboek](./dictionary.md) wordt bewerkt, doen zowel deze sneltoets als `Search` niets, zodat de tekst die daar wordt getypt behouden blijft. Zolang de Verschilweergave, het voorbeeld van Automatische indeling of Tijdreizen open is, laat `Toggle Explorer` de toets over aan de browser of de host — zie [De zoekbalk van de browser](./find-and-replace.md#the-browsers-find-bar).
Op het ERD-tabblad beëindigt `Stop` een geopende cel- of memo-editor, sluit het naamveld van een [tabelgroep](./table-groups.md) zonder de naam van de groep te wijzigen of annuleert een relatie of een `New Table Group` die wordt getekend, en laat de selectie zoals die is. Als geen daarvan open is, heft `Stop` de selectie en de celfocus op en sluit met dezelfde toetsaanslag een geopende kleurkiezer. Een geopende themabouwer of taalkiezer `Display Language` sluit in beide gevallen met dezelfde toetsaanslag.
In een cel van een logische naam waarvan de termenlijst open is, sluit de eerste toetsaanslag op `Stop` alleen de lijst — zie [Termnamen aanvullen](./logical-names.md#completing-term-names).
Een geopende Verkenner, themabouwer of taalkiezer `Display Language` onderdrukt geen enkele sneltoets op het canvas. `Stop` sluit de Verkenner nooit. Zie [Toetsen in de Verkenner](./explorer.md#keys-in-the-explorer) voor wat `Stop` en de andere toetsen in de Verkenner doen, en [Een taal kiezen](./language-and-theme.md#picking-a-language) voor wat ze in de kiezer doen.
`Delete Selection` verwijdert elke geselecteerde tabel, memo en tabelgroep, of, als één tabel is geselecteerd samen met enkele van haar kolommen en het zoomniveau boven `70%` ligt, die kolommen — zie [Tabellen en memo's verwijderen](./table-related-functions.md#table-and-memo-deletion). `Remove Table, Memo` verwijdert ook geselecteerde tabelgroepen.
`Add Table Group` start het tekenen van een [`New Table Group`](./table-groups.md#drawing-a-group), zoals de knop `New Table Group` op de [canvaswerkbalk](./table-related-functions.md#canvas-toolbar) doet, en een tweede toetsaanslag annuleert het tekenen. `Group Selected Tables` bestaat uit twee toetsaanslagen zonder modificatietoets, `T` en daarna binnen een seconde `G`. De opdracht zet de geselecteerde tabellen in een nieuwe groep en opent het naamveld ervan, zoals `Group selected tables` in het contextmenu van een tabel doet, en doet niets als er geen tabel is geselecteerd — zie [Geselecteerde tabellen groeperen](./table-groups.md#grouping-selected-tables). Geen van beide doet iets in een editor in alleen-lezenmodus of zolang de groepen [verborgen](./table-groups.md#hiding-groups) zijn.
In een editor in alleen-lezenmodus werken alleen de toetsen die lezen: `Search`, `Toggle Explorer`, `Stop`, `Table Properties` en `Focus on this table` op de tabel die een sprong selecteerde, de drie zoomtoetsen, `Zen Mode`, kopiëren en de pijltoetsen, die de gefocuste cel verplaatsen. `Editing`, elke toets `Add` en `Remove`, `Delete Selection`, `Primary Key`, beide toetsen voor alles selecteren, de vier relatietoetsen, `Add Table Group`, `Group Selected Tables`, `Hand Tool` en plakken doen niets, en `Undo` en `Redo` maken niets ongedaan of opnieuw — zie [Editors in alleen-lezenmodus](./table-related-functions.md#read-only-editors).
`Zoom In`, `Zoom Out` en `Zoom Reset` zoomen ook op het tabblad [Visualisatie](./visualization.md#toolbar), zowel in `Graph` als in `Flow`, tenzij Snel zoeken open is.
In `Flow` gaan `Undo` en `Redo` een stap terug en vooruit door de tabellen waartoe de stroomweergave is beperkt, zoals de knoppen `Previous table` en `Next table` ervan doen, tenzij Snel zoeken open is. Ze maken daar nooit iets in het diagram ongedaan, en in `Graph` doen ze niets — zie [Vorige en volgende tabel](./visualization.md#previous-table-and-next-table).
Op het tabblad Visualisatie sluit `Stop` ook het menu voor de [rijweergave](./visualization.md#row-display) en annuleert een [stroomindeling](./visualization.md#how-flow-is-placed) die nog loopt; een weergave die met `Focus on this table` is beperkt, wordt er niet mee verruimd.
`Focus on this table` opent het tabblad Visualisatie in `Flow`, beperkt tot de geselecteerde tabellen en elke tabel die er één relatie van verwijderd is, en doet niets als er geen tabel is geselecteerd — zie [Focussen op tabellen](./visualization.md#focusing-on-tables).
Op het tabblad Woordenboek werken `Undo` en `Redo` op de geschiedenis van het getoonde blad in plaats van op die van het diagram, en doen ze niets op het blad `Checks` — zie [Woordenboekbladen](./undo-redo.md#dictionary-sheets). Op de bladen `Domains`, `Words` en `Terms` voegt `Add Column` rijen in onder de selectie, voegt dezelfde toets met `Shift` erbij ze erboven in, en verwijdert `Remove Column` de rijen die de selectie beslaat — zie [Rijen toevoegen en verwijderen](./dictionary.md#adding-and-deleting-rows). Zie [Toetsen op het tabblad](./dictionary.md#keys-on-the-tab) voor de andere toetsen van het tabblad.
`Select All Table, Memo`, `Hand Tool`, `Delete Selection` en `Group Selected Tables` wijken voor een tekstcursor: terwijl je een cel of een memo bewerkt of typt in een tekstveld zoals het zoekveld van de Verkenner, selecteert `Ctrl + A` (Windows/Linux) of `⌘ + A` (Mac) de tekst, typt `Space` een spatie, wissen `Delete` en `Backspace` tekst en typt `T` en daarna `G` de twee letters.
Kopiëren en plakken zijn de eigen toetscombinaties `Ctrl + C` en `Ctrl + V` (Windows/Linux) of `⌘ + C` en `⌘ + V` (Mac) van de browser, dus ze staan niet in deze lijst — zie [Tabellen bewerken](./table-editing.md).

Toetscombinaties kunnen niet op dit tabblad worden gewijzigd.
Een host die de editor insluit, wijst ze opnieuw toe met [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), behalve `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` en `Zoom Reset`, die vastliggen.
Het tabblad `Shortcuts` toont dan de toetscombinaties van de host: een opdracht die de host niet opnieuw toewijst, behoudt haar standaardtoets, en een opdracht die de host aan geen enkele toets koppelt, toont er geen.
De rijtoetsen van het tabblad Woordenboek volgen `Add Column` en `Remove Column`, dus als je een van beide opnieuw toewijst, verschuiven ze mee — zie [`dictionaryRowChords`](../../api/erd-editor-element.md#dictionaryrowchords).

In Obsidian bereiken deze toetsen de editor zolang het Obsidian-tabblad van het diagram actief is, ook waar een Obsidian-sneltoets dezelfde toets gebruikt, zoals `Alt + Enter`, `Ctrl + K` en `Ctrl + F` (Windows/Linux) of `⌥ + Enter`, `⌘ + K` en `⌘ + F` (Mac). Dat geldt ook voor `Alt + Shift + Enter` (Windows/Linux) of `⌥ + Shift + Enter` (Mac) van het tabblad Woordenboek, dat in geen enkele rij van deze lijst staat. Elke andere Obsidian-sneltoets werkt daar nog steeds. Zie [De zoekbalk van de browser](./find-and-replace.md#the-browsers-find-bar) voor `Ctrl + F` of `⌘ + F`.

## Editors in alleen-lezenmodus {#read-only-editors}

In een editor met [`readonly`](../../api/erd-editor-element.md#readonly) toont het tabblad Instellingen de instellingen van het diagram en wijzigt het er geen. Een badge `Read only` staat naast de kop van elke pagina, `Preferences` en `Shortcuts`.
De schakelaars `Relationship DataType Sync` en `Maximum comment width` en het breedteveld zijn uitgeschakeld, en elke vergrendelknop ook. De rijen van `Column Order` tonen geen greep en laten zich niet slepen.
Elke rij `Lock` toont nog steeds haar waarde. Een vergrendelde rij toont de waarde die het bestand bewaart, en een ontgrendelde de instelling zoals dat scherm haar heeft, wat van die van het bestand kan verschillen, zoals hieronder.

De instellingen die bepalen wat het scherm toont, veranderen daar nog steeds: de positie en zoom van de weergave, het tabblad, de naamweergave, het databasesysteem, de taal van de Codegenerator, beide naamnotaties, het type aanhalingstekens en de schakelaars van [`View Option`](./table-related-functions.md#table-view-options).
Elk verandert alleen dat scherm, wat zijn vergrendeling ook aangeeft. Het wordt niet in het bestand opgeslagen of door een JSON-export geschreven, niet in de ongedaanmakingsgeschiedenis vastgelegd, niet als wijziging geteld en bereikt nooit medebewerkers. De optiepanelen van de tabbladen [Schema SQL](./schema-sql.md#options-panel) en [Codegenerator](./code-generator.md#options-panel) duiden deze keuzes daar aan met `This window only`, in plaats van `Saved in the document`.
Wanneer de editor weer bewerkbaar wordt, gaan het databasesysteem, de taal, de naamnotaties, het type aanhalingstekens en de schakelaars van View Option terug naar de waarden van het bestand. De weergave, het tabblad en de naamweergave blijven zoals je ze achterliet, en het bestand neemt elk ervan over, voor zover zijn vergrendeling dat toestaat, bij je volgende wijziging ervan.
