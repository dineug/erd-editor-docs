---
sidebar_position: 3
description: Voeg kolommen toe, selecteer, herschik en verwijder ze, schakel kolomopties in of uit en kopieer of plak kolommen.
---

# Tabellen bewerken

Tabellen bewerken biedt in de basis een bewerkervaring die lijkt op die van Excel.  
De bewerkmodus start met `Enter` of door op een cel te dubbelklikken.  
`Enter` of `Escape` beëindigt de bewerkmodus. Wat je typt, wordt toegepast terwijl je typt, dus `Escape` behoudt de tekst in plaats van die terug te zetten.  
Na `Escape` blijven de cel gefocust en de tabel geselecteerd, en een tweede `Escape` heft beide op.  
Zolang een invoermethode nog aan het samenstellen is, houdt `Escape` de bewerkmodus open.

![Een tabel toevoegen met Alt + N en twee kolommen invullen](/img/demo-table-edit.webp)

## Kolommen toevoegen {#adding-columns}

Je maakt een kolom met de sneltoets `Alt + Enter` (Windows/Linux) of `⌥ + Enter` (Mac).  
Er wordt een kolom toegevoegd aan elke geselecteerde tabel.

## De Tab-toets {#tab-key}

Druk op `Tab` om direct naar de bewerkmodus van de volgende cel te gaan.  
Als je in de laatste cel op `Tab` drukt, wordt er een nieuwe kolom gemaakt.  
Gebruik `Shift + Tab` om naar de bewerkmodus van de vorige cel te gaan.  
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

Een klik met de rechtermuisknop op de rij van een kolom bepaalt op welke kolommen het contextmenu van de tabel werkt, welke modificatietoets je ook ingedrukt houdt.  
Op een rij die al geselecteerd is, blijft de selectie behouden en gaat de focus naar die rij. Op elke andere rij wordt alleen die rij geselecteerd. Dit geldt overal op de rij, ook op het sleutelpictogram en op een markering voor een [alternatieve sleutel](./table-related-functions.md#alternate-keys).  
Om vanuit het menu op meerdere kolommen te werken, zoals bij [Primaire sleutel van een kolom](#column-primary-key) of [Kolommen verwijderen](#column-deletion), klik je dus met de rechtermuisknop op een van de geselecteerde rijen.  
Op een Mac opent `Ctrl + click` het menu ook, maar dat telt als een gewone klik, dus op een cel selecteert het alleen die rij voordat het menu opent.

## Kolommen herschikken en verplaatsen {#rearranging-and-moving-columns}

Werkt bij `dragging` en maakt verplaatsen naar andere tabellen mogelijk.  
De gesleepte rijen volgen de aanwijzer, en de rijen rond de plek waar je ze neerzet, schuiven opzij om ruimte te maken.  
Zet de kolom net onder de laatste rij van een tabel neer om die naar het einde van die tabel te verplaatsen. Bij een tabel zonder kolommen kun je overal op de tabel neerzetten.

![Een kolom naar een nieuwe positie slepen en daarna naar een andere tabel](/img/demo-column-move.webp)

Met `Ctrl + drag` (Windows/Linux) of `⌘ + drag` (Mac) kun je meerdere kolommen verplaatsen.

![Drie kolommen selecteren en ze met Ctrl/⌘ + drag naar een andere tabel verplaatsen](/img/demo-column-multi-move.webp)

## Kolommen verwijderen {#column-deletion}

Verwijdert de geselecteerde kolommen van de gefocuste tabel. Een klik op een cel selecteert de kolom ervan, dus als je op een cel klikt en op `Delete` drukt, wordt die ene kolom verwijderd.  
Sneltoetsen:

- `Delete` of `Backspace` (`⌫` op een Mac). Deze verwijderen de geselecteerde kolommen zolang hun tabel het enige geselecteerde element is. Als er geen kolom is geselecteerd (de focus staat op de naam of de opmerking van de tabel), als er ook iets anders is geselecteerd of bij een zoomniveau van `70%` en lager, waarbij tabellen alleen hun naam tonen, verwijderen ze in plaats daarvan de hele selectie — zie [Tabellen en memo's verwijderen](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` of `Alt + Delete` (Windows/Linux), `⌥ + ⌫` of `⌥ + Delete` (Mac). Deze verwijderen de geselecteerde kolommen van de gefocuste tabel, ook als er tegelijk andere tabellen of memo's zijn geselecteerd. Ze verwijderen niets terwijl een cel wordt bewerkt of bij `70%` en lager.

![Eén kolom verwijderen en daarna twee geselecteerde kolommen, met Alt + Backspace](/img/demo-column-remove.webp)

Het contextmenu van de tabel doet hetzelfde. Is de tabel het enige geselecteerde element, klik dan met de rechtermuisknop op de rij van een kolom: het laatste item van het menu toont `Delete column`, of `Delete columns` als die rij een van twee of meer geselecteerde kolommen is.

Terwijl een cel wordt bewerkt, wissen `Delete` en `Backspace` alleen tekst. Als je ze buiten de celeditor ingedrukt houdt, verwijderen ze maar één keer.  
Na het verwijderen gaat de focus naar de dichtstbijzijnde overgebleven kolom boven de gefocuste kolom. Als er daarboven geen meer over is, gaat de focus naar de tabelnaam, ook als er daaronder nog kolommen zijn, dus de volgende `Delete` of `Backspace` verwijdert de tabel in plaats van een kolom.  
Relaties en indexen die een verwijderde kolom gebruiken, worden meeverwijderd. Er wordt niet om bevestiging gevraagd, en de hele verwijdering is één stap in de geschiedenis.

## Kolommen kopiëren/plakken {#copyingpasting-columns}

Werkt als een klembord in tabelvorm.  
Sneltoetsen: `Ctrl + C` (Windows/Linux) of `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) of `⌘ + V` (Mac)

Kopiëren naar een spreadsheet, plakken vanuit een spreadsheet en plakken in de tabel waarvan een kolomcel gefocust is, gebruiken de cellen die de tabellen tonen, in de volgorde waarin ze die tonen — zie [Weergaveopties voor tabellen](./table-related-functions.md#table-view-options) en [Kolomvolgorde aanpassen](./settings.md#adjusting-column-order).  
Kolommen die in de editor zijn gekopieerd en worden geplakt terwijl de kop van een tabel is geselecteerd, of in de andere geselecteerde tabellen, nemen elke cel van de gekopieerde kolommen mee, ook verborgen cellen zoals Uniek en Automatisch ophogen.  
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

## Tabellen en memo's kopiëren/plakken {#copyingpasting-tables-and-memos}

Als er binnen een gefocuste tabel geen kolom is geselecteerd, kopiëren dezelfde sneltoetsen de geselecteerde tabellen en memo's zelf — zie [Functies voor tabellen](./table-related-functions.md).

## Primaire sleutel van een kolom {#column-primary-key}

Schakelt de primaire sleutel in of uit voor de gefocuste kolom, de kolom waartoe de gefocuste cel behoort.  
Als de gefocuste kolom een van twee of meer geselecteerde kolommen is, geldt de omschakeling voor alle geselecteerde kolommen: als een ervan geen sleutel is, worden ze allemaal sleutel, en als ze dat allemaal al zijn, verliezen ze allemaal de sleutel. Kolommen buiten de selectie blijven ongemoeid.  
Gebruik het contextmenu van de tabel of de sneltoets `Alt + K` (Windows/Linux) of `⌥ + K` (Mac). Wanneer de omschakeling twee of meer kolommen betreft, toont het menu-item `Primary Key on selected columns` in plaats van `Primary Key`.  
Het sleutelpictogram in de rij dient alleen ter weergave, dus als je erop klikt, wordt de sleutel niet ingesteld.

Om van meerdere kolommen één samengestelde sleutel te maken, [selecteer je ze](#selecting-multiple-columns) en druk je daarna op `Alt + K` (Windows/Linux) of `⌥ + K` (Mac), of klik je met de rechtermuisknop op een van de geselecteerde rijen en kies je `Primary Key on selected columns`. Elke omschakeling is één stap in de geschiedenis.

![Twee kolommen selecteren met Shift + Arrow Down, ze daarna allebei tot primaire sleutel maken met ⌥ + K en met een tweede druk bij allebei de primaire sleutel weer uitschakelen](/img/demo-column-pk.webp)
