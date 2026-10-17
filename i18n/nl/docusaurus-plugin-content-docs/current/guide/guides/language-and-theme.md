---
sidebar_position: 15
description: De 25 weergavetalen van de editor, de indeling van rechts naar links, het uiterlijk System, Light of Dark en de kleuren van de themabouwer, en waar elke host ze bewaart.
---

# Taal en thema

De eigen tekst van de editor is beschikbaar in 25 talen, en zijn vormgeving is een thema: een uiterlijk (`System`, `Light` of `Dark`), een grijstint en een accentkleur.  
Beide horen bij de persoon die de editor gebruikt, niet bij het diagram. Geen van beide wordt in het bestand opgeslagen, in de [geschiedenis](./undo-redo.md) vastgelegd of met medebewerkers gedeeld, zodat iedereen zijn eigen taal en thema ziet, en door een van beide te wijzigen wordt een bestand nooit als gewijzigd gemarkeerd.

Geen van beide staat op het tabblad [Instellingen](./settings.md). De werkbalk heeft een knop `Theme` en direct daarna een knop `Display Language`, beide na de knop [`Explorer`](./explorer.md). [Snel zoeken](./quick-search.md) toont `Theme` en `Display Language` op elk tabblad.  
De webapp, Google Drive, VS Code, JetBrains-IDE's en Obsidian bieden allemaal beide aan en onthouden je keuzes — zie [Per host](#in-each-host). Beide werken ook in een editor in alleen-lezenmodus.

## Weergavetaal {#display-language}

De taal geldt voor de eigen tekst van de editor: de knopinfo op de werkbalk, contextmenu's, Snel zoeken, panelen en dialoogvensters, het tabblad Instellingen, het [welkomstscherm](./editing-start.md#welcome-screen), meldingen en berichten, en de tijdelijke aanduiding die op het canvas en in een geëxporteerde afbeelding verschijnt bij een lege naam, een leeg gegevenstype, een lege standaardwaarde of een lege opmerking.  
In elke taal blijft het volgende zoals het geschreven is: je tabel- en kolomnamen, opmerkingen en memo's; databasesystemen, de talen van de Codegenerator en bestandsformaten; gegevenstypen, SQL-trefwoorden en de acties `ON DELETE` en `ON UPDATE`; de Schema SQL-opties `Create`, `If not exists`, `Drop & re-create`, `USE` en `CREATE + USE`; de markeringen `PK`, `FK`, `UQ`, `AI`, `NN`, `N-N`, `NULL` en `AK1.1`; de statusletters `A`, `M`, `D`, `R` en `~` van de [Verschilweergave](./table-related-functions.md#diff-viewer); de keuzes voor naamnotatie en `Bracket` behalve `None`; de namen van toetsen op het toetsenbord; de kleurnamen van de themabouwer; gegenereerde SQL en code; en de namen van geëxporteerde bestanden.

De talen, in de volgorde waarin de taalkiezer ze toont:

| In de taalkiezer | Taal | Code |
| --- | --- | --- |
| Bahasa Indonesia | Indonesisch | `id-ID` |
| Deutsch | Duits | `de-DE` |
| English | Engels | `en` |
| Español | Spaans | `es-ES` |
| Euskara | Baskisch | `eu-ES` |
| Français | Frans | `fr-FR` |
| Italiano | Italiaans | `it-IT` |
| Nederlands | Nederlands | `nl-NL` |
| Polski | Pools | `pl-PL` |
| Português | Portugees | `pt-PT` |
| Português Brasileiro | Braziliaans-Portugees | `pt-BR` |
| Română | Roemeens | `ro-RO` |
| Slovenčina | Slowaaks | `sk-SK` |
| Slovenščina | Sloveens | `sl-SI` |
| Svenska | Zweeds | `sv-SE` |
| Türkçe | Turks | `tr-TR` |
| Русский | Russisch | `ru-RU` |
| Українська | Oekraïens | `uk-UA` |
| עברית | Hebreeuws | `he-IL` |
| العربية | Arabisch | `ar-SA` |
| فارسی | Perzisch | `fa-IR` |
| 日本語 | Japans | `ja-JP` |
| 简体中文 | Vereenvoudigd Chinees | `zh-CN` |
| 繁體中文 | Traditioneel Chinees | `zh-TW` |
| 한국어 | Koreaans | `ko-KR` |

De optie `Language` die Snel zoeken op het tabblad Codegenerator aanbiedt en de rij `Language` in de lijst [Vergrendeling](./settings.md#lock) op het tabblad Instellingen zijn de [doeltaal van de Codegenerator](./code-generator.md#language), niet de weergavetaal.

### Een taal kiezen {#picking-a-language}

De knop `Display Language` (een talenpictogram) opent de taalkiezer `Display Language`, een paneel met de titel `Display Language` onder de werkbalk, over welk tabblad er ook open is.  
`System` komt eerst, met daarnaast de taal die het op dit moment vertegenwoordigt, en blijft in beeld terwijl de lijst scrolt. Daarna volgen de 25 talen, elk met haar naam in die taal zelf, en een vinkje markeert de optie die van kracht is.

![De weergavetaal via de werkbalk wijzigen in 한국어 en daarna in العربية, dat de werkbalk spiegelt maar het diagram niet, en terug naar System](/img/demo-display-language.webp)

Het paneel opent met de toetsenbordfocus op de aangevinkte rij:

- `↑` en `↓` lopen door de rijen en gaan aan het ene uiteinde verder bij het andere, en `Home` en `End` springen naar de eerste en de laatste.
- `Enter` of `Space` kiest de rij met de focus, zoals een klik doet.

Een keuze wordt meteen toegepast, sluit het paneel en geeft de toetsenbordfocus terug aan de editor.

Sluit het paneel zonder keuze met `Escape`, met de knop `x` naast de titel, waarvan de knopinfo `Close (ESC)` toont, met een druk ergens in de editor buiten het paneel, behalve op de werkbalk, of nogmaals met de knop `Display Language`.  
Als je het paneel opent, worden de themabouwer en Tabeleigenschappen gesloten. Een geopende [Verkenner](./explorer.md#dialogs-beside-it) blijft open, en in een taal die van links naar rechts loopt, staat de taalkiezer direct ernaast in plaats van eroverheen.  
Als je Snel zoeken of de themabouwer opent, wordt het paneel gesloten, en dat gebeurt ook met `Ctrl + F` (Windows/Linux) of `⌘ + F` (Mac). Die toets opent de [Verkenner](./explorer.md#opening-and-closing) met de zoekfunctie, of houdt de Verkenner open als die al open is en zet de toetsenbordfocus in het zoekveld ervan. De knop `Explorer` op de werkbalk laat de taalkiezer open.

Zolang het paneel de toetsenbordfocus heeft, werken enkele sneltoetsen van de editor nog: `Search`, `Toggle Explorer`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` en `Zoom Reset` — zie [Sneltoetsen](./settings.md#shortcuts). Alle andere sneltoetsen van de editor, de pijltoetsen en `Tab` komen niet verder dan het paneel, zodat de editor er niet op reageert. Toetsen waaraan de editor geen opdracht toewijst, zoals die voor opslaan in de host zelf, bereiken de host zoals gewoonlijk.

In [Snel zoeken](./quick-search.md) toont `Display Language` de optie `System` en de 25 talen, met een vinkje bij de optie die van kracht is. Een taal is daar ook te vinden op haar Engelse naam of haar code, dus met `german` of `de-DE` vind je `Deutsch`.

### Wat de optie Systeem volgt {#what-system-follows}

In de webapp, Google Drive, VS Code, JetBrains-IDE's en Obsidian begint de taal op `System`. Die optie volgt de taal van de host:

- In de webapp, Google Drive en je eigen pagina: de voorkeurstalen van de browser. Een wijziging daarin wordt meteen gevolgd.
- In VS Code: de weergavetaal van VS Code.
- In een JetBrains-IDE: de taal waarin de IDE zijn eigen interface toont.
- In Obsidian: de taal van Obsidian.

`System` kiest de eerste van die talen die de editor kent, en Engels als de editor er geen van kent.  
Een regionale variant telt als de taal zelf, zodat `de-AT` Deutsch oplevert en `fr-CA` Français. Bij Chinees telt het schrift: een traditioneel schrift levert 繁體中文 op en elk ander schrift 简体中文. Zonder opgegeven schrift levert Taiwan, Hongkong of Macau 繁體中文 op, en ander Chinees 简体中文. Portugees levert Português Brasileiro op, tenzij er een andere regio dan Brazilië is opgegeven, zodat `pt-PT` Português oplevert; ook het Portugees van Obsidian levert Português op.

### Talen van rechts naar links {#right-to-left-languages}

עברית (Hebreeuws), العربية (Arabisch) en فارسی (Perzisch) delen de editor van rechts naar links in: de werkbalk, de menu's, de panelen en dialoogvensters, Snel zoeken en het tabblad Instellingen worden gespiegeld. De submenu's van een contextmenu openen naar links, en de pictogrammen voor ongedaan maken en opnieuw uitvoeren op de werkbalk wisselen om, zodat het pictogram voor ongedaan maken naar achteren wijst voor wie van rechts naar links leest.

Het diagram zelf wordt nooit gespiegeld. Het canvas met zijn tabellen, kolommen, relaties en memo's blijft van links naar rechts, en dat geldt ook voor de minimap, de schuifbalken, de [canvaswerkbalk](./table-related-functions.md#canvas-toolbar), [Visualisatie](./visualization.md) en de werkbalk ervan, de cellen met gegevenstypen, de code op de tabbladen Schema SQL en Codegenerator, de kleurkiezer, de twee kanten van de Verschilweergave, Tijdreizen en het voorbeeld van Automatische indeling.  
De [Verkenner](./explorer.md#beside-the-canvas) blijft links van het canvas, en de wijzigingsboom van de Verschilweergave links in de weergave, elk met de sleeprand aan de rechterkant. Binnenin lopen beide van rechts naar links: hun velden en rijen worden gespiegeld, rijen springen in vanaf rechts, en in beide bomen vouwt `←` een rij uit of gaat naar het eerste onderliggende item, terwijl `→` de rij samenvouwt of teruggaat naar het bovenliggende item — zie [Toetsen in de Verkenner](./explorer.md#keys-in-the-explorer).  
Namen, opmerkingen en andere tekst die je hebt getypt, behouden hun eigen richting, zodat een Hebreeuwse, Arabische of Perzische naam ook op het canvas van rechts naar links loopt.

## Thema {#theme}

De knop `Theme` (een contrastpictogram) opent de themabouwer, een paneel met de titel `Theme` onder de werkbalk, over welk tabblad er ook open is. De themabouwer heeft drie delen:

- `Accent color`: 26 kleurstalen. De knopinfo van elke kleurstaal noemt de naam ervan, zoals `indigo`.
- `Gray color`: 6 kleurstalen, `gray`, `mauve`, `slate`, `sage`, `olive` en `sand`.
- `Appearance`: `System`, `Light` en `Dark`.

![De themabouwer openen via de werkbalk, een accentkleur en een grijstint kiezen en het uiterlijk wijzigen in Light en daarna in System](/img/demo-theme-builder.webp)

In elk deel is de keuze die van kracht is gemarkeerd, en een keuze wordt meteen toegepast terwijl de themabouwer open blijft.  
Als je een kleur kiest, blijft het uiterlijk zoals het is, dus een kleur die je onder `System` kiest, behoudt `System`.

`System` toont licht of donker zoals de host dat doet, en schakelt om wanneer de host omschakelt:

- In de webapp, Google Drive en je eigen pagina: de lichte of donkere modus die de browser doorgeeft en die het besturingssysteem volgt.
- In VS Code: licht bij een licht kleurthema, en donker bij een donker kleurthema of een van beide thema's met hoog contrast.
- In een JetBrains-IDE: het lichte of donkere thema van de IDE.
- In Obsidian: het lichte of donkere thema van Obsidian.

Sluit de themabouwer met `Escape`, met de knop `x` naast de titel, waarvan de knopinfo `Close (ESC)` toont, met een druk ergens in de editor buiten het paneel, behalve op de werkbalk, of nogmaals met de knop `Theme`.  
Als je de themabouwer opent, worden Tabeleigenschappen en de taalkiezer `Display Language` gesloten. Een geopende [Verkenner](./explorer.md#dialogs-beside-it) blijft open, en in een taal die van links naar rechts loopt, staat de themabouwer direct ernaast in plaats van eroverheen.  
Als je Snel zoeken of de taalkiezer `Display Language` opent, wordt de themabouwer gesloten, en dat gebeurt ook met `Ctrl + F` (Windows/Linux) of `⌘ + F` (Mac). Die toets opent de [Verkenner](./explorer.md#opening-and-closing) met de zoekfunctie, of houdt de Verkenner open als die al open is en zet de toetsenbordfocus in het zoekveld ervan. De knop `Explorer` op de werkbalk laat de themabouwer open.  
De themabouwer houdt geen toetsen tegen, zodat de sneltoetsen van de editor werken zolang hij open is.

In [Snel zoeken](./quick-search.md) toont `Theme` de opties `System`, `Light` en `Dark`, met een vinkje bij het uiterlijk dat van kracht is. Als je er een kiest, verandert alleen het uiterlijk en blijven de grijstint en de accentkleur zoals ze zijn.

## Per host {#in-each-host}

Wat je in de editor kiest, via de werkbalk of Snel zoeken, wordt opgeslagen waar de host het bewaart, en elk geopend diagram volgt een wijziging daarvan meteen, waar die ook wordt aangebracht.  
In VS Code, een JetBrains-IDE en Obsidian komt de optie `Auto` van de host (de waarde `auto` in VS Code) overeen met `System` in de editor. Als je `System` kiest, wordt `Auto` opgeslagen, en als je `Light` of `Dark` kiest, wordt dat uiterlijk opgeslagen, ook als `Auto` het al toonde.  
De eigen instellingen en meldingen van de extensie en de plug-ins zijn in het Engels, wat de weergavetaal ook is.

### Webapp en Google Drive {#web-app-and-google-drive}

Op erd-editor.io, met inbegrip van de sessies voor gezamenlijk bewerken, en in Google Drive gelden één taal en één thema voor de app en elk diagram daarin.  
Beide worden in deze browser bewaard, niet in het schema of het Drive-bestand, en alle tabbladen van erd-editor.io delen ze: een keuze in het ene tabblad wijzigt meteen de andere.

De taal is `System`, dat de voorkeurstalen van de browser volgt, totdat je er een kiest.  
De eigen tekst van de app, zoals de zijbalk, de prullenbak, gezamenlijk bewerken en de schermen voor Google Drive, volgt dezelfde taal, en in het Hebreeuws, Arabisch en Perzisch wordt de hele app van rechts naar links ingedeeld. Het privacybeleid, de servicevoorwaarden en de ondersteuningspagina's blijven in het Engels.  
Behalve het paneel van de editor en Snel zoeken heeft de onderste rij van de zijbalk ook een taalknop, waarvan de knopinfo `Display Language` toont, naast de links `Privacy` en `Terms`. Het menu ervan toont `System`, met de taal die het vertegenwoordigt, en daarna de 25 talen.

Het thema begint op `System`, met de grijstint `olive` en de accentkleur `jade`.  
Behalve de themabouwer en Snel zoeken heeft de onderkant van de zijbalk drie pictogramknoppen, `System`, `Light` en `Dark`: naast `Trash` op erd-editor.io en naast `Sign out` in Google Drive. Ze stellen hetzelfde uiterlijk in als de themabouwer.

### VS Code {#vs-code}

De instellingen van de extensie staan onder ERD Editor in de Settings van VS Code:

| Instelling | Waarden | Standaardwaarde |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto` of een code uit de [tabel met talen](#display-language) | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`, `light`, `dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | de zes grijstinten | `slate` |
| `dineug.erd-editor.theme.accentColor` | de 26 accentkleuren | `indigo` |

De Settings-editor toont bij de taalinstelling eerst `Auto` en daarna elke taal met haar eigen naam. Een waarde in `settings.json` die geen taal aanduidt, wordt gelezen als `auto`.  
Een themakeuze in de editor schrijft alle drie de thema-instellingen. Een keuze wordt geschreven waar de instelling ervan al is ingesteld: de werkruimtemap, anders de werkruimte, anders de gebruikersinstellingen.

### JetBrains-IDE's {#jetbrains-ides}

Settings | Tools | ERD Editor bevat `Appearance:` (`Auto`, `Light`, `Dark`), `Gray color:`, `Accent color:` en `Display language:` (`Auto` en daarna elke taal met haar eigen naam), die voor de hele IDE worden bewaard.  
Ze beginnen op `Auto`, `Slate`, `Indigo` en `Auto`.

### Obsidian {#obsidian}

Settings → ERD Editor bevat `Appearance` (`Auto`, `Light`, `Dark`), `Gray color`, `Accent color` en `Display language` (`Auto` en daarna elke taal met haar eigen naam), die per kluis worden bewaard.  
Ze beginnen op `Auto`, `Slate`, `Indigo` en `Auto`.  
Een wijziging geldt voor elk ERD-tabblad van de kluis, ook die in pop-outvensters.

### Je eigen pagina {#your-own-page}

Een `<erd-editor>` in je eigen pagina toont geen knop `Theme` of `Display Language`, en Snel zoeken toont geen van beide, totdat de pagina ze inschakelt met [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) en [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker).  
Totdat de pagina een taal instelt of de lezer er een kiest, is de editor in het Engels, of volgt hij `System` zolang `enableLocalePicker` aanstaat.  
Het thema begint op `Dark`, met de grijstint `slate` en de accentkleur `indigo`, tenzij de pagina een ander thema instelt of [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode) inschakelt.  
Een keuze van de lezer wordt meteen toegepast, maar het element slaat geen van beide keuzes op: de pagina stelt de beginwaarden in en slaat de keuzes van de lezer zelf op — zie [Thema](../../api/erd-editor-element.md#theme) en [Weergavetaal](../../api/erd-editor-element.md#display-language) in de API.
