---
sidebar_position: 14
description: Synchronisatie van gegevenstypen via relaties, maximale breedte van opmerkingen, herberekening van de tabelbreedte, instellingsvergrendelingen (weergave-, tabblad- en code-instellingen), weergavevolgorde van kolommen en de lijst met sneltoetsen.
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

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Instelling voor het synchroniseren van gegevenstypen via relaties" loading="lazy" />

![members.id wijzigen in BIGINT UNSIGNED, waardoor elke member_id die ermee verbonden is, wordt bijgewerkt](/img/demo-relationship-data-type-sync.webp)

## Maximale breedte van opmerkingen {#maximum-comment-width}

Geeft de maximale breedte van de opmerkingskolom in pixels aan (`60` ~ `200`).
Als je de schakelaar uitschakelt, vervalt de limiet, en zolang hij uitstaat, is het invoerveld uitgeschakeld.
Als je hem inschakelt, begint de waarde op `60px`. Een getypte waarde buiten het bereik wordt teruggebracht naar de dichtstbijzijnde grens.

![Maximum comment width inschakelen, 120 invoeren en het ERD-tabblad dat de opmerkingen op die breedte afkapt](/img/demo-settings-comment-width.webp)

## Tabelbreedte opnieuw berekenen {#recalculation-table-width}

Druk op `Sync` om de breedte van elke tabel en elke kolomcel opnieuw te berekenen zodat de huidige tekst erin past, en om de verbindingslijnen van de relaties rond de nieuwe afmetingen opnieuw te tekenen.
De melding `Recalculated table width` bevestigt dat.
Breedtes worden vanzelf opnieuw berekend telkens wanneer een document wordt geladen, dus dit is alleen nodig als ze door een wijziging in het lettertype of de weergave verouderd zijn.
Breedtes worden niet in het bestand opgeslagen, dus `Sync` wijzigt het bestand nooit.

## Vergrendeling {#lock}

De lijst `Lock` bevat zes instellingen. Zolang de vergrendeling van een instelling aanstaat, behoudt het bestand de waarde die de instelling had toen ze werd vergrendeld, dus als je haar op het scherm wijzigt, blijft het bestand zoals het was.

| Rij | Wat het bestand behoudt | In een nieuw diagram |
| --- | --- | --- |
| `Viewport` | Het zoomniveau en de weergavepositie van het ERD-canvas, als één vergrendeling | `100% · 0, 0` |
| `Canvas Type` | Het tabblad waarop het diagram opent: `ERD`, `Visualization`, `Schema SQL` of `Code Generator` | `ERD` |
| `Language` | De taal van de [Codegenerator](./code-generator.md#language) | `GraphQL` |
| `Table Name Case` | De [notatie van tabelnamen](./code-generator.md#name-case) van de Codegenerator | `Pascal` |
| `Column Name Case` | De [notatie van kolomnamen](./code-generator.md#name-case) van de Codegenerator | `Camel` |
| `Bracket Type` | De optie `Bracket` van het tabblad [Schema SQL](./schema-sql.md#database-and-bracket) en van de doelen van de [Codegenerator](./code-generator.md#bracket) die deze optie aanbieden | `None` |

Elke rij toont een waarde en een vergrendelknop, en een klik op de knop zet die ene vergrendeling aan of uit.
Zolang een vergrendeling aanstaat, toont de knop een gesloten slot met de knopinfo `Unlock Viewport` (enzovoort voor elke rij), en is de waarde, met de knopinfo `Locked value`, de waarde die het bestand behoudt.
Zolang ze uitstaat, toont de knop een open slot met de knopinfo `Lock Viewport`, en is de waarde, gedimd en met de knopinfo `Current value`, de instelling zoals die nu is.
`Viewport` toont het zoomniveau en daarna de weergavepositie, zoals `75% · -40, 91`. De weergavepositie is het punt op het scherm, in pixels, waar `0, 0` van het diagram ligt, en een coördinaat van duizend of meer wordt verkort, zoals in `1.2k` of `-24k`.

Vergrendelen legt de instelling vast zoals die op dat moment is.
Zolang een vergrendeling aanstaat, werkt de instelling op het scherm nog steeds: je kunt scrollen en zoomen, van tabblad wisselen en een andere taal, een andere naamnotatie of andere aanhalingstekens kiezen via de menu's, de optiepanelen of Snel zoeken.
Het bestand behoudt echter de vergrendelde waarde, en de rij blijft die tonen, dus het diagram opent opnieuw op de vergrendelde weergave, op het vergrendelde tabblad, met de vergrendelde taal, naamnotaties en aanhalingstekens. Een JSON-export schrijft ook de vergrendelde waarden weg.
Zet de vergrendeling uit om op te slaan wat het scherm toont, en vanaf dan volgt het bestand de instelling: met `Viewport` uit opent het diagram waar je het hebt achtergelaten. Zet de vergrendeling uit en weer aan om in plaats daarvan een nieuwe waarde te vergrendelen, zoals een nieuwe beginweergave.
Als de vergrendelde weergave bij het openen van het bestand niets van het diagram toont, gaat het scherm toch naar het diagram, en blijft de vergrendelde waarde zoals ze is.
`Canvas Type` behoudt nooit het tabblad Instellingen. Zet je deze vergrendeling aan, dan wordt het laatste andere tabblad vergrendeld waarop je was, en zolang ze uitstaat, toont de rij dat tabblad.

![Viewport ontgrendelen, in het diagram scrollen en zoomen en het opnieuw vergrendelen op de nieuwe weergave die de rij toont](/img/demo-settings-locks.webp)

Een vergrendeling in- of uitschakelen wijzigt het bestand, omdat het bestand opslaat welke vergrendelingen aanstaan, maar net als de rest van het tabblad Instellingen wordt het niet vastgelegd in de [geschiedenis](./undo-redo.md#what-the-history-records). In een editor in alleen-lezenmodus doen de vergrendelknoppen niets.
Elke andere instelling wordt opgeslagen zoals ze is: de database, de opties in [`View Option`](./table-related-functions.md#table-view-options) en de rest van het tabblad `Preferences`.

Elke vergrendeling staat aan in een nieuw diagram, een diagram dat vanaf niets is begonnen: een leeg bestand dat is geopend in VS Code, Obsidian of een JetBrains-IDE (`ERD Editor: Create new diagram` en `New ERD` van Obsidian maken er een), een nieuw schema in de webapp, een bestand dat is gemaakt via het menu New van Google Drive of een `<erd-editor>` zonder waarde.
Een schema of Google Drive-bestand dat de webapp maakt door een SQL-, DBML-, AML- of GraphQL-bestand te importeren, begint ook met elke vergrendeling aan. Een schema of bestand dat uit een JSON-bestand is gemaakt, behoudt de vergrendelingen die dat bestand vastlegt.
Een bestand dat je opent, behoudt de vergrendelingen waarmee het is opgeslagen, elke vergrendeling op haar vergrendelde waarde.
Een bestand dat geen vergrendelingen vastlegt, zoals een bestand dat is opgeslagen door een versie van vóór de vergrendelingen of dat met de hand is geschreven, opent met elke vergrendeling aan: de weergave op `100% · 0, 0` en het tabblad op `ERD`, ongeacht de weergave en het tabblad die het heeft opgeslagen, en de taal, de naamnotaties en het type aanhalingstekens vergrendeld zoals het bestand ze heeft opgeslagen.
Een `Import` die het diagram vervangt, stelt ook de vergrendelingen in: een JSON-bestand brengt de vergrendelingen mee die het vastlegt en de waarden die ze bevatten, en een SQL-, DBML-, AML- of GraphQL-bestand behoudt je vergrendelingen, maar zet de weergave terug op `100% · 0, 0`, vergrendeld of niet — zie [Externe bestanden importeren](./file-import-export.md#importing-external-files). Als je de import ongedaan maakt, komen de vergrendelingen en vergrendelde waarden terug die de import heeft vervangen.

Een wijziging die een vergrendeling uit het bestand houdt, telt niet als wijziging. VS Code markeert het tabblad niet als gewijzigd, en Obsidian en een JetBrains-IDE laten het bestand zoals het was, zowel wanneer ze uit zichzelf opslaan als wanneer het tabblad wordt gesloten.
Zolang elke vergrendeling aanstaat, komen rondkijken in een diagram, van tabblad wisselen en een andere taal, naamnotatie of andere aanhalingstekens uitproberen dus nooit in `git diff` terecht.
Met `Viewport` uit wijzigen scrollen en zoomen het bestand, en met `Canvas Type` uit doet van tabblad wisselen dat ook, inclusief wisselen naar het tabblad Instellingen.
Het lege bestand van een nieuw diagram blijft leeg tot de eerste wijziging die het bestand behoudt: een bewerking, een wijziging van een instelling waar geen vergrendeling op staat of het in- of uitschakelen van een vergrendeling.
Een diagram openen en zonder zo'n wijziging sluiten laat het bestand zoals het was, ongeacht welke versie of welke machine het heeft geschreven. Het bestand bevat alleen wat het diagram is, in een vaste volgorde, en een bestand dat in een oudere vorm is opgeslagen, wordt bij de eerste wijziging van die soort eenmalig in deze vorm herschreven — zie [Opslagvorm en runtimewaarde](../../api/advanced/schema.md#storage-form-and-runtime-value).
In VS Code is een revisie die met `Reopen Editor With...` opnieuw als diagram is geopend, zoals een Git-revisie of een item uit Local History, alleen-lezen en wordt die nooit als gewijzigd gemarkeerd.
In Google Drive wordt scrollen, zoomen of wisselen naar een ander tabblad nooit op zichzelf opgeslagen, vergrendeld of niet. Met `Viewport` uit wordt de weergave alleen samen met een andere wijziging weggeschreven, dus een Drive-bestand opent waar de weergave stond bij de laatste keer opslaan, en hetzelfde geldt voor het tabblad met `Canvas Type` uit.

In een [sessie voor gezamenlijk bewerken](../../api/advanced/collaborative-editing.md) bereikt het in- of uitschakelen van een vergrendeling elke editor, en behoudt een vergrendeling de waarde van de editor die haar heeft ingeschakeld.
Als `Language`, een naamnotatie of `Bracket Type` wordt uitgeschakeld, krijgt elke editor de waarde die wordt getoond in de editor die de vergrendeling heeft uitgeschakeld, zodat ze allemaal één waarde opslaan. Het uitschakelen van `Viewport` of `Canvas Type` verplaatst bij niemand de weergave of het tabblad.
Een codeeragent die via de MCP-server werkt, heeft geen tool voor de vergrendelingen of voor de instellingen die ze vasthouden, en leest bij een vergrendelde taal, naamnotatie of type aanhalingstekens de waarde die het bestand behoudt. Alleen de imports van de agent in de modus `replace` bereiken ze, zoals een `Import` dat doet — zie [Instellingen](../../mcp/tools.md#settings) en [Importeren](../../mcp/tools.md#import).

## Kolomvolgorde aanpassen {#adjusting-column-order}

Stelt de weergavevolgorde van kolommen in tabellen in.
Sleep een rij om haar te verplaatsen — de hele rij is versleepbaar, en het greeppictogram geeft dat aan. De zeven rijen zijn, in hun standaardvolgorde, `Name`, `DataType`, `Not Null`, `Unique`, `Auto Increment`, `Default` en `Comment`.
Een cel die door een [weergaveoptie voor tabellen](./table-related-functions.md#table-view-options) is verborgen, behoudt haar plaats in de lijst, zodat de volgorde geldt voor welke cellen er ook worden getoond.
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
`Search`, `Toggle Explorer` en `Stop` zijn de uitzonderingen: `Search` schakelt Snel zoeken vanaf elk tabblad in en uit, `Toggle Explorer` opent de [Verkenner](./explorer.md#opening-and-closing) vanaf elk tabblad op het zoekveld ervan en schakelt over naar het ERD-tabblad, en `Stop` is de toets die Snel zoeken, Tabeleigenschappen, de Verschilweergave, het voorbeeld van Automatische indeling, Tijdreizen, het dialoogvenster `Export image`, `Map Columns`, de themabouwer, de taalkiezer `Display Language`, de kleurkiezer en een geopend contextmenu sluit.
`Toggle Explorer` sluit de Verkenner weer zolang die op het ERD-tabblad open is en niet door de zen-modus is verborgen, zoals de knop `Explorer` op de werkbalk doet. Als Snel zoeken, Tabeleigenschappen, de themabouwer, de taalkiezer `Display Language`, het dialoogvenster `Export image` of `Map Columns` open is, sluit de sneltoets dat in plaats daarvan en gaat de toetsenbordfocus naar het zoekveld van de Verkenner.
`Toggle Explorer` doet niets zolang een cel, een memo of de naam van een tabelgroep wordt bewerkt. Zolang de Verschilweergave, het voorbeeld van Automatische indeling of Tijdreizen open is, laat `Toggle Explorer` de toets over aan de browser of de host — zie [De zoekbalk van de browser](./find-and-replace.md#the-browsers-find-bar).
Op het ERD-tabblad beëindigt `Stop` een geopende cel- of memo-editor, sluit het naamveld van een [tabelgroep](./table-groups.md) zonder de naam van de groep te wijzigen of annuleert een relatie of een `New Table Group` die wordt getekend, en laat de selectie zoals die is. Als geen daarvan open is, heft `Stop` de selectie en de celfocus op en sluit met dezelfde toetsaanslag een geopende kleurkiezer. Een geopende themabouwer of taalkiezer `Display Language` sluit in beide gevallen met dezelfde toetsaanslag.
Een geopende Verkenner, themabouwer of taalkiezer `Display Language` onderdrukt geen enkele sneltoets op het canvas. `Stop` sluit de Verkenner nooit. Zie [Toetsen in de Verkenner](./explorer.md#keys-in-the-explorer) voor wat `Stop` en de andere toetsen in de Verkenner doen, en [Een taal kiezen](./language-and-theme.md#picking-a-language) voor wat ze in de kiezer doen.
`Delete Selection` verwijdert elke geselecteerde tabel, memo en tabelgroep, of, als één tabel is geselecteerd samen met enkele van haar kolommen en het zoomniveau boven `70%` ligt, die kolommen — zie [Tabellen en memo's verwijderen](./table-related-functions.md#table-and-memo-deletion). `Remove Table, Memo` verwijdert ook geselecteerde tabelgroepen.
`Add Table Group` start het tekenen van een [`New Table Group`](./table-groups.md#drawing-a-group), zoals de knop `New Table Group` op de [canvaswerkbalk](./table-related-functions.md#canvas-toolbar) doet, en een tweede toetsaanslag annuleert het tekenen. `Group Selected Tables` bestaat uit twee toetsaanslagen zonder modificatietoets, `T` en daarna binnen een seconde `G`. De opdracht zet de geselecteerde tabellen in een nieuwe groep en opent het naamveld ervan, zoals `Group selected tables` in het contextmenu van een tabel doet, en doet niets als er geen tabel is geselecteerd — zie [Geselecteerde tabellen groeperen](./table-groups.md#grouping-selected-tables). Geen van beide doet iets in een editor in alleen-lezenmodus of zolang de groepen [verborgen](./table-groups.md#hiding-groups) zijn.
`Zoom In`, `Zoom Out` en `Zoom Reset` zoomen ook op het tabblad [Visualisatie](./visualization.md#toolbar), zowel in `Graph` als in `Flow`, tenzij Snel zoeken open is.
Op het tabblad Visualisatie sluit `Stop` ook het menu voor de [rijweergave](./visualization.md#row-display) en annuleert een [stroomindeling](./visualization.md#how-flow-is-placed) die nog loopt; een weergave die met `Focus on this table` is beperkt, wordt er niet mee verruimd.
`Focus on this table` opent het tabblad Visualisatie in `Flow`, beperkt tot de geselecteerde tabellen en elke tabel die er één relatie van verwijderd is, en doet niets als er geen tabel is geselecteerd — zie [Focussen op tabellen](./visualization.md#focusing-on-tables).
`Select All Table, Memo`, `Hand Tool`, `Delete Selection` en `Group Selected Tables` wijken voor een tekstcursor: terwijl je een cel of een memo bewerkt of typt in een tekstveld zoals het zoekveld van de Verkenner, selecteert `Ctrl + A` (Windows/Linux) of `⌘ + A` (Mac) de tekst, typt `Space` een spatie, wissen `Delete` en `Backspace` tekst en typt `T` en daarna `G` de twee letters.
Kopiëren en plakken zijn de eigen toetscombinaties `Ctrl + C` en `Ctrl + V` (Windows/Linux) of `⌘ + C` en `⌘ + V` (Mac) van de browser, dus ze staan niet in deze lijst — zie [Tabellen bewerken](./table-editing.md).

Toetscombinaties kunnen niet op dit tabblad worden gewijzigd.
Een host die de editor insluit, wijst ze opnieuw toe met [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), behalve `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` en `Zoom Reset`, die vastliggen.
Het tabblad `Shortcuts` toont dan de toetscombinaties van de host: een opdracht die de host niet opnieuw toewijst, behoudt haar standaardtoets, en een opdracht die de host aan geen enkele toets koppelt, toont er geen.

In Obsidian bereiken deze toetsen de editor zolang het Obsidian-tabblad van het diagram actief is, ook waar een Obsidian-sneltoets dezelfde toets gebruikt, zoals `Alt + Enter`, `Ctrl + K` en `Ctrl + F` (Windows/Linux) of `⌥ + Enter`, `⌘ + K` en `⌘ + F` (Mac). Elke andere Obsidian-sneltoets werkt daar nog steeds. Zie [De zoekbalk van de browser](./find-and-replace.md#the-browsers-find-bar) voor `Ctrl + F` of `⌘ + F`.
