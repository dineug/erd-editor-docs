---
sidebar_position: 3
description: Voeg kolommen toe, selecteer, herschik en verwijder ze, schakel kolomopties in of uit en kopieer of plak kolommen.
---

# Tabellen bewerken

Tabellen bewerken biedt in de basis een bewerkervaring die lijkt op die van Excel.  
De [naamweergave](./logical-names.md#name-view) bepaalt of een tabel in haar kop en rijen de namen, de logische namen of beide toont.  
De bewerkmodus start met `Enter` of door op een cel te dubbelklikken.  
`Enter` of `Escape` beëindigt de bewerkmodus. Wat je typt, wordt toegepast terwijl je typt, dus `Escape` behoudt de tekst in plaats van die terug te zetten. Een [domeincel](./logical-names.md#the-domain-cell) is de uitzondering: die kiest alleen uit haar lijst en behoudt nooit wat je typt. Het sluiten van de [cel van een logische naam](./logical-names.md#writing-a-logical-name) met een gewijzigde logische naam kan ook de fysieke naam invullen.  
Na `Escape` blijven de cel gefocust en de tabel geselecteerd, en een tweede `Escape` heft beide op. Zolang de cel van een logische naam haar [termenlijst](./logical-names.md#completing-term-names) toont, sluit de eerste `Escape` alleen de lijst.  
Zolang een invoermethode nog aan het samenstellen is, houdt `Escape` de bewerkmodus open.

![Een tabel toevoegen met Alt + N en twee kolommen invullen](/img/demo-table-edit.webp)

## Kolommen toevoegen {#adding-columns}

Je maakt een kolom met de sneltoets `Alt + Enter` (Windows/Linux) of `⌥ + Enter` (Mac), die een kolom toevoegt aan elke geselecteerde tabel, of met de knop `+` op de kop van een tabel, die er een aan die tabel toevoegt.  
De eerste cel van de nieuwe kolom krijgt de focus, de eerste die haar rij tekent in de [kolomvolgorde](./settings.md#adjusting-column-order). Onder de standaardvolgorde is dat haar naam, die in `Logical Names` haar logische naam is, en in `Both Names` haar cel `Logical Name` — zie [Naamweergave](./logical-names.md#name-view).  
Een kolom die met `Tab` vanuit de laatste cel wordt toegevoegd, en de primaire sleutel die het tekenen van een relatie toevoegt aan een bovenliggende tabel die er geen heeft, beginnen ook op die cel.

## De Tab-toets {#tab-key}

Druk op `Tab` om direct naar de bewerkmodus van de volgende cel te gaan.  
Als je in de laatste cel op `Tab` drukt, wordt er een nieuwe kolom gemaakt en opent haar eerste cel voor bewerken — zie [Kolommen toevoegen](#adding-columns).  
Gebruik `Shift + Tab` om naar de bewerkmodus van de vorige cel te gaan.  
`Tab` en `Shift + Tab` gaan langs de cellen die de tabel toont, in hun volgorde, dus de naamweergave en View Option → `Domain` bepalen of cellen van de logische naam en domeincellen daartoe behoren — zie [Een logische naam invoeren](./logical-names.md#writing-a-logical-name).  
De markeringen voor [alternatieve sleutels](./table-related-functions.md#alternate-keys) die na de laatste cel van een rij worden getekend, zijn geen cellen, dus de toetsenbordfocus slaat ze over en ze worden nooit geopend om te bewerken.

![Met Tab door de cellen van een rij gaan, vanuit de laatste cel een kolom toevoegen en met Shift + Tab teruggaan](/img/demo-table-tab.webp)

## Gegevenstypen automatisch aanvullen {#datatype-autocomplete}

Begin met het bewerken van een cel `DataType` en typ. Passende typen uit de geselecteerde database worden voorgesteld, en het deel van een suggestie dat letterlijk bevat wat je hebt getypt, wordt gemarkeerd.  
Het zoeken zelf gebeurt bij benadering, dus `vch` vindt ook `VARCHAR`.

- `Arrow Up` of `Arrow Down`: door de suggesties gaan
- `Arrow Right`, `Tab` of `Enter`: de gemarkeerde suggestie accepteren
- `Arrow Left`: teruggaan naar de tekst die je hebt getypt

Je kunt ook op een suggestie klikken.  
De lijst toont maximaal tien suggesties tegelijk en scrolt om de rest te tonen.  
Niets wordt afgedwongen, dus een type dat niet in de lijst staat, kun je vrij typen, inclusief argumenten zoals `VARCHAR(255)`. De lijst sluit zodra wat je typt verder gaat dan een volledige typenaam, zoals bij `VARCHAR(255)` of `BIGINT UNSIGNED`.  
De suggesties volgen de geselecteerde database. Als je de database wijzigt, verandert wat er wordt aangeboden en blijven bestaande kolommen zoals ze zijn.

Typen in de cel `DataType` van een kolom die aan een domein is gekoppeld, of daar een suggestie accepteren, ontkoppelt de kolom zodra haar type afwijkt van dat van het domein — zie [Domeinen en gegevenstypen](./dictionary.md#domains-and-data-types).  
In de weergave `Logical Names` toont, zolang View Option → `Domain` uitstaat, de typecel van een kolom die aan een domein met een naam is gekoppeld, de naam van het domein, en opent het bewerken ervan de [domeinkiezer](./logical-names.md#the-domain-cell) in plaats van deze suggesties. Een typecel die een gegevenstype toont, bewerk je zoals hierboven beschreven.

![De cellen voor DataType invullen met suggesties bij benadering, via de pijltoetsen, Tab en Enter](/img/demo-data-type-autocomplete.webp)

## NOT NULL, Uniek, Automatisch ophogen {#not-null-unique-auto-increment}

Deze drie cellen zijn schakelaars, geen tekst.  
Dubbelklik op een ervan, of druk op `Enter` terwijl die gefocust is, om de waarde om te zetten.

De cel NOT NULL toont `N-N` als die is ingesteld en `NULL` als dat niet zo is.  
`UQ` en `AI` zijn gedimd wanneer ze uitstaan en gemarkeerd wanneer ze aanstaan.

![NOT NULL omzetten met een dubbelklik, en Uniek en Automatisch ophogen met Enter](/img/demo-column-options.webp)

Cellen die door de [weergaveopties voor tabellen](./table-related-functions.md) zijn verborgen, kunnen niet worden in- of uitgeschakeld.

## Meerdere kolommen selecteren {#selecting-multiple-columns}

Er zijn vijf manieren:

- `Shift + Arrow Up/Down`: de selectie rij voor rij uitbreiden
- `Ctrl + click` (Windows/Linux) of `⌘ + click` (Mac): één kolom toevoegen
- `Shift + click`: het bereik vanaf de laatst gefocuste kolom selecteren
- `Ctrl + Shift + click` (Windows/Linux) of `⌘ + Shift + click` (Mac): dat bereik aan de selectie toevoegen
- `Alt + A` (Windows/Linux) of `⌥ + A` (Mac): alle kolommen selecteren

![Kolommen selecteren met Shift + Arrow Down, Ctrl/⌘ + click, Shift + click en Alt + A](/img/demo-column-select.webp)

Om de geselecteerde kolommen samen te verplaatsen, sleep je de greep naast de gefocuste kolom — zie [Kolommen herschikken en verplaatsen](#rearranging-and-moving-columns).

Een klik met de rechtermuisknop op de rij van een kolom bepaalt op welke kolommen het contextmenu van de tabel werkt, welke modificatietoets je ook ingedrukt houdt.  
Op een rij die al geselecteerd is, blijft de selectie behouden en gaat de focus naar die rij. Op elke andere rij wordt alleen die rij geselecteerd. Dit geldt overal op de rij, ook op het sleutelpictogram en op een markering voor een [alternatieve sleutel](./table-related-functions.md#alternate-keys).  
Om vanuit het menu op meerdere kolommen te werken, zoals bij [Primaire sleutel van een kolom](#column-primary-key) of [Kolommen verwijderen](#column-deletion), klik je dus met de rechtermuisknop op een van de geselecteerde rijen.  
Op een Mac opent `Ctrl + click` het menu ook, maar dat telt als een gewone klik, dus op een cel selecteert het alleen die rij voordat het menu opent.

## Kolommen herschikken en verplaatsen {#rearranging-and-moving-columns}

Een kolom verplaats je met haar sleepgreep, een kleine knop met een greeppictogram die net buiten de linkerrand van de tabel staat, naast de gefocuste rij.  
Focus een willekeurige cel van de kolom, door erop te klikken of met de pijltoetsen of `Tab`, en de greep verschijnt naast haar rij. Zolang de focus op de kop van de tabel staat, heeft geen enkele rij er een.  
De greep wordt vaag getekend totdat de aanwijzer erop staat, en de aanwijzer verandert dan in een hand. Alleen indrukken doet niets: het slepen begint zodra de aanwijzer beweegt, en kan de kolom naar een andere plaats in haar tabel of naar een andere tabel brengen.  
Boven de rijen van een tabel schuiven de gesleepte rijen op hun plaats, en de rijen rond de plek waar je ze neerzet, schuiven opzij om ruimte te maken. Boven leeg canvas, of boven de kop van een tabel die kolommen heeft, volgt een doorschijnende kopie van de rijen de aanwijzer, met de naam- en typecellen van elke rij zoals de rij ze in de huidige [naamweergave](./logical-names.md#name-view) toont.  
Zet de kolom net onder de laatste rij van een tabel neer om die naar het einde van die tabel te verplaatsen. Bij een tabel zonder kolommen kun je overal op de tabel neerzetten. De strook net links van een tabel, waar de greep staat, telt ook als de rijen van de tabel, dus als je langs de greep recht naar beneden sleept, herschik je de kolommen zonder dat de aanwijzer de tabel binnengaat.  
Een kolom die naar een andere tabel wordt verplaatst, behoudt haar logische naam en haar domein.

![Een kolom focussen en de greep naast haar rij naar een nieuwe positie slepen, en daarna de greep van een andere kolom naar een andere tabel slepen](/img/demo-column-move.webp)

Om meerdere kolommen tegelijk te verplaatsen, [selecteer je ze](#selecting-multiple-columns) en sleep je de greep naast de gefocuste kolom. Zolang de gefocuste kolom een van twee of meer geselecteerde kolommen van haar tabel is, neemt de greep ze allemaal mee; anders neemt hij alleen zijn eigen kolom mee.  
Er is geen modificatietoets nodig. Als je `Alt` (Windows/Linux) of `⌥` (Mac) ingedrukt houdt op de greep, worden de kolommen verplaatst zoals bij gewoon slepen en wordt er niets gedupliceerd.

![Drie kolommen selecteren en daarna de greep naast de gefocuste kolom naar een andere tabel slepen, waarbij de andere geselecteerde kolommen meegaan](/img/demo-column-multi-move.webp)

Slepen dat op de rij van een kolom begint in plaats van op haar greep, verplaatst de tabel, net als slepen aan de kop — zie [Meerdere tabellen verplaatsen](./table-related-functions.md#moving-multiple-tables). `Alt + drag` (Windows/Linux) of `⌥ + drag` (Mac) op een rij dupliceert de tabel — zie [Tabellen en memo's dupliceren](./table-related-functions.md#duplicating-tables-and-memos).  
Bij een zoomniveau van `70%` en lager, waarbij tabellen alleen hun naam tonen, en in een editor in alleen-lezenmodus wordt geen greep getekend, dus daar kunnen kolommen niet worden herschikt.  
Een kolomsleepbeweging die bezig is wanneer de editor in alleen-lezenmodus gaat, eindigt direct: de kopie die de aanwijzer volgt en de grijpende hand verdwijnen, en loslaten verplaatst geen kolom. Rijen die de sleepbeweging al had verplaatst, blijven waar ze die zette.

## Kolommen verwijderen {#column-deletion}

Verwijdert de geselecteerde kolommen van de gefocuste tabel. Een klik op een cel selecteert de kolom ervan, dus als je op een cel klikt en op `Delete` drukt, wordt die ene kolom verwijderd.  
Sneltoetsen:

- `Delete` of `Backspace`. Deze verwijderen de geselecteerde kolommen zolang hun tabel het enige geselecteerde element is. Als er geen kolom is geselecteerd (de focus staat op de naam, de [logische naam](./logical-names.md#name-view) of de opmerking van de tabel), als er ook iets anders is geselecteerd of bij een zoomniveau van `70%` en lager, waarbij tabellen alleen hun naam tonen, verwijderen ze in plaats daarvan de hele selectie — zie [Tabellen en memo's verwijderen](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` of `Alt + Delete` (Windows/Linux), `⌥ + Backspace` of `⌥ + Delete` (Mac). Deze verwijderen de geselecteerde kolommen van de gefocuste tabel, ook als er tegelijk andere tabellen of memo's zijn geselecteerd. Ze verwijderen niets terwijl een cel wordt bewerkt of bij `70%` en lager.

![Eén kolom verwijderen en daarna twee geselecteerde kolommen, met Alt + Backspace](/img/demo-column-remove.webp)

Het contextmenu van de tabel doet hetzelfde. Is de tabel het enige geselecteerde element, klik dan met de rechtermuisknop op de rij van een kolom: het laatste item van het menu toont `Delete column`, of `Delete columns` als die rij een van twee of meer geselecteerde kolommen is.

Terwijl een cel wordt bewerkt, wissen `Delete` en `Backspace` alleen tekst. Als je ze buiten de celeditor ingedrukt houdt, verwijderen ze maar één keer.  
Na het verwijderen gaat de focus naar de dichtstbijzijnde overgebleven kolom boven de gefocuste kolom. Als er daarboven geen meer over is, gaat de focus naar de tabelnaam (in de weergave `Logical Names` de logische naam die op zijn plaats wordt getoond), ook als er daaronder nog kolommen zijn, dus de volgende `Delete` of `Backspace` verwijdert de tabel in plaats van een kolom.  
Relaties en indexen die een verwijderde kolom gebruiken, worden meeverwijderd. Er wordt niet om bevestiging gevraagd, en de hele verwijdering is één stap in de geschiedenis.

## Kolommen kopiëren/plakken {#copyingpasting-columns}

Werkt als een klembord in tabelvorm.  
Sneltoetsen: `Ctrl + C` (Windows/Linux) of `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) of `⌘ + V` (Mac)

Kopiëren naar een spreadsheet, plakken vanuit een spreadsheet en plakken in de tabel waarvan een kolomcel gefocust is, gebruiken de cellen die de tabellen tonen, in de volgorde waarin ze die tonen — zie [Weergaveopties voor tabellen](./table-related-functions.md#table-view-options), [Kolomvolgorde aanpassen](./settings.md#adjusting-column-order) en [Naamweergave](./logical-names.md#name-view). De naamweergave verandert wat sommige van die cellen bevatten:

- In de weergave `Logical Names` bevat de cel van de naam de logische naam, of niets zolang die leeg is. Zolang View Option → `Domain` uitstaat, bevat de typecel de naam van het domein van de kolom waar ze er een toont, en anders het gegevenstype.
- In de weergave `Both Names` wordt de cel `Logical Name` gekopieerd en geplakt op de plaats waar de kolomvolgorde haar zet.
- Een getoonde domeincel bevat de naam van het domein, of niets voor een kolom die geen domein toont.

Kolommen die in de editor zijn gekopieerd en worden geplakt terwijl de kop van een tabel is geselecteerd, of in de andere geselecteerde tabellen, nemen elke cel van de gekopieerde kolommen mee, ook verborgen cellen zoals Uniek en Automatisch ophogen, en hun logische namen.  
Ze behouden een domeinkoppeling alleen zolang dit diagram datzelfde domein bevat, niet alleen een domein met dezelfde naam, en het domein nog het type van de gekopieerde kolom heeft. Anders komen ze zonder koppeling terecht, met het type waarmee ze zijn gekopieerd. Hun namen gelden als door jou ingevoerd, tenzij een geplakte naam leeg is en de logische naam er een afleidt — zie [Fysieke namen afleiden](./dictionary.md#deriving-physical-names).  
Markeringen voor [alternatieve sleutels](./table-related-functions.md#alternate-keys) zoals `AK1.1` zijn geen cellen, dus kopiëren en plakken laten ze weg, ook als ze worden getoond.

Je kunt vanuit de editor in Excel plakken en vanuit Excel terug in de editor.  
Celwaarden gaan precies zoals ze zijn getypt naar buiten, dus een waarde zoals `<label>` of `a &amp; b` komt ongewijzigd in een spreadsheet of document terecht.  
Kolommen van een spreadsheet worden op positie aan de zichtbare cellen gekoppeld, niet op naam, dus de kolommen van het werkblad moeten de volgorde van die cellen volgen.  
Voor de kolommen hieronder wordt elk van deze waarden als waar gelezen (niet hoofdlettergevoelig):

- Automatisch ophogen: `TRUE`, `1`, `YES`, `Y`
- Uniek: `TRUE`, `1`, `YES`, `Y`
- NOT NULL: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

Bij het kopiëren naar buiten schrijft de editor `TRUE` of `FALSE` voor Automatisch ophogen en Uniek, en `NOT NULL` of `NULL` voor NOT NULL.  
Uniek en Automatisch ophogen zijn standaard verborgen, dus `TRUE` en `FALSE` worden pas geschreven en gelezen zodra die cellen worden getoond.

![Vier kolommen in een spreadsheet plakken, met de vlaggen geschreven als TRUE/FALSE en NOT NULL/NULL](/img/demo-copy-column-to-sheet.webp)

![Drie rijen uit een spreadsheet als kolommen in een tabel plakken, waarbij YES, 1 en NOT NULL als waar worden gelezen](/img/demo-copy-sheet-column.webp)

Waar een plakactie terechtkomt, hangt af van de focus:

- Als de kop van een tabel is geselecteerd, worden de geplakte rijen als nieuwe kolommen toegevoegd aan elke geselecteerde tabel.
- Als een kolomcel gefocust is, worden de geselecteerde rijen van die tabel, en daarna de rijen onder de laatste daarvan, op volgorde overschreven, zoveel als er zijn geplakt. Rijen tussen afzonderlijke selecties worden overgeslagen. Een overschreven rij krijgt de geplakte waarden in haar zichtbare cellen en behoudt haar verborgen cellen, en de rijen die overblijven, worden als nieuwe kolommen toegevoegd. Aan elke andere geselecteerde tabel worden de geplakte rijen als nieuwe kolommen toegevoegd.

![Twee kolommen kopiëren en ze in één keer in twee geselecteerde tabellen plakken](/img/demo-copy-column-multi.webp)

Een geplakte rij schrijft logische namen en domeinen als volgt:

- Een logische naam, uit een cel `Logical Name` of uit de cel van de naam in de weergave `Logical Names`, geldt als volledig getypt. Zolang de naam van de kolom leeg of nog afgeleid is, leiden de [woordenboeken](./dictionary.md#deriving-physical-names) daaruit de fysieke naam af en koppelen ze het domein dat de term ervan oplevert, tenzij de eigen domeincel van de rij er een koppelt. Een naam die dezelfde rij plakt, blijft behouden en geldt als door jou ingevoerd.
- Een domeincel, of de typecel in de weergave `Logical Names` zolang View Option → `Domain` uitstaat, koppelt het domein dat de tekst ervan noemt, als het diagram zo'n domein bevat. Elke andere tekst, of een lege cel, koppelt geen domein en ontkoppelt de kolom, zelfs van een domein van het geplakte type. Tekst in de typecel die geen domein noemt, wordt als gegevenstype gelezen. Rijen die in de editor zijn gekopieerd, koppelen in plaats daarvan het domein waarmee ze zijn gekopieerd, en alleen zolang dit diagram het met het gekopieerde type bevat, net als nieuwe kolommen.
- Een gekoppeld domein geeft de kolom zijn gegevenstype, tenzij de rij een eigen type plakt. Dan wordt een domein van een ander type niet gekoppeld, en krijgt de kolom het geplakte type.
- In een rij zonder domeincel ontkoppelt een geplakt type de kolom van een domein van een ander type, net als het typen ervan.
- Geen enkele plakactie neemt een type mee via [Gegevenstypen via relaties synchroniseren](./settings.md#relationship-datatype-sync).

## Tabellen en memo's kopiëren/plakken {#copyingpasting-tables-and-memos}

Als er binnen een gefocuste tabel geen kolom is geselecteerd, kopiëren dezelfde sneltoetsen de geselecteerde tabellen en memo's zelf — zie [Functies voor tabellen](./table-related-functions.md).

## Primaire sleutel van een kolom {#column-primary-key}

Schakelt de primaire sleutel in of uit voor de gefocuste kolom, de kolom waartoe de gefocuste cel behoort.  
Als de gefocuste kolom een van twee of meer geselecteerde kolommen is, geldt de omschakeling voor alle geselecteerde kolommen: als een ervan geen sleutel is, worden ze allemaal sleutel, en als ze dat allemaal al zijn, verliezen ze allemaal de sleutel. Kolommen buiten de selectie blijven ongemoeid.  
Gebruik het contextmenu van de tabel of de sneltoets `Alt + K` (Windows/Linux) of `⌥ + K` (Mac). Wanneer de omschakeling twee of meer kolommen betreft, toont het menu-item `Primary Key on selected columns` in plaats van `Primary Key`.  
Het sleutelpictogram in de rij dient alleen ter weergave, dus als je erop klikt, wordt de sleutel niet ingesteld.

Om van meerdere kolommen één samengestelde sleutel te maken, [selecteer je ze](#selecting-multiple-columns) en druk je daarna op `Alt + K` (Windows/Linux) of `⌥ + K` (Mac), of klik je met de rechtermuisknop op een van de geselecteerde rijen en kies je `Primary Key on selected columns`. Elke omschakeling is één stap in de geschiedenis.

![Twee kolommen selecteren met Shift + Arrow Down, ze daarna allebei tot primaire sleutel maken met ⌥ + K en met een tweede druk bij allebei de primaire sleutel weer uitschakelen](/img/demo-column-pk.webp)

## Editors in alleen-lezenmodus {#read-only-editors}

In een editor met [`readonly`](../../api/erd-editor-element.md#readonly) opent geen cel voor bewerken en verandert geen kolom.  
Een klik op een cel focust niets en haalt de selectie weg die een sprong achterliet. `Enter` en een dubbelklik openen geen editor en schakelen geen toggle om, `Tab` blijft aan de pagina, en de sneltoetsen die kolommen toevoegen, alles selecteren of verwijderen, de wisseling van de primaire sleutel en plakken doen niets.  
Naar een kolom gaan vanuit de [Verkenner](./explorer.md#going-to-a-row) of [Snel zoeken](./quick-search.md) focust haar cel. De pijltoetsen verplaatsen de focus dan van cel naar cel, waarbij de kolom die ze bereiken alleen wordt geselecteerd, omdat `Shift` daar geen kolom toevoegt.  
`Ctrl + C` (Windows/Linux) of `⌘ + C` (Mac) kopieert nog steeds de geselecteerde kolom, of de tabel die een sprong selecteerde — zie [Kolommen kopiëren/plakken](#copyingpasting-columns).
