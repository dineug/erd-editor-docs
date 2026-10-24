---
sidebar_position: 1
description: Begin vanuit het welkomstscherm en maak tabellen, memo's, tabelgroepen en relaties via het contextmenu van het canvas, de canvaswerkbalk of een sneltoets.
---

# Beginnen met bewerken

Bewerken begint via het contextmenu, door met de rechtermuisknop te klikken.

![Met de rechtermuisknop op het canvas klikken, het submenu Relationship openen, een tabel toevoegen en daarna het eigen menu van de tabel openen](/img/demo-context-menu.webp)

Een klik met de rechtermuisknop op een tabel, een memo, een tabelgroep of een relatie opent in plaats daarvan het eigen menu van dat item.  
Een klik met de rechtermuisknop op een tabel, memo of tabelgroep die al geselecteerd is, behoudt de hele selectie, zodat menu-items zoals `Color` en `Delete selected` op de hele selectie werken — zie [Meervoudige selectie](./table-related-functions.md#multiple-selection).

## Welkomstscherm {#welcome-screen}

In de webapp, Google Drive, VS Code, Obsidian en een JetBrains-IDE opent een leeg diagram met een welkomstscherm over het ERD-canvas. Een `<erd-editor>` in je eigen pagina toont het alleen als de pagina het inschakelt met [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen).  
Een diagram geldt als leeg zolang het geen tabel, geen getoonde memo en geen getoonde tabelgroep bevat, dus memo's en groepen die met de weergaveopties zijn verborgen, tellen niet mee. Het scherm verdwijnt zodra het diagram één ervan bevat, en komt terug wanneer het diagram weer leeg is, bijvoorbeeld nadat je de laatste tabel hebt verwijderd of het toevoegen van de eerste ongedaan hebt gemaakt.  
Het wordt niet getoond in een editor in alleen-lezenmodus, in de zen-modus, zolang Tabeleigenschappen open is of zolang de Verschilweergave, het voorbeeld van Automatische indeling of Tijdreizen het canvas overneemt.

![Het welkomstscherm op een leeg diagram: de formaten van Import openen, met Esc teruggaan, een tabel toevoegen met New Table en daarna het scherm terughalen met ⌘ + Z](/img/demo-welcome-screen.webp)

Onder de kop `Right-click the canvas for every action.` staat een menu:

- `New Table` voegt een tabel toe, net als `Alt + N`.
- `New Memo` voegt een memo toe, net als `Alt + M`. Het wordt weggelaten zolang memo's verborgen zijn.
- `Import` vervangt het menu door `Back` en de formaten `json`, `Schema SQL`, `GraphQL`, `DBML` en `AML`. Als je een formaat kiest, wordt om een bestand van dat formaat gevraagd en wordt dat bestand geladen in plaats van het lege diagram — zie [Bestanden importeren of exporteren](./file-import-export.md). `Back`, of `Escape`, brengt je terug naar het eerste menu.
- `Command Palette` opent [Snel zoeken](./quick-search.md), net als `Ctrl + K` (Windows/Linux) of `⌘ + K` (Mac).
- `Shortcuts` opent Instellingen op het tabblad [`Shortcuts`](./settings.md#shortcuts).

Waar het canvas breed genoeg is, tonen `New Table`, `New Memo` en `Command Palette` de toets die op dat moment aan hun opdracht is gekoppeld, ook als een host die toets heeft gewijzigd.  
Zodra een item de toetsenbordfocus heeft, lopen `↑` en `↓` door de items en gaan ze aan het ene uiteinde verder bij het andere, springen `Home` en `End` naar het eerste en het laatste, en kiest `Enter` of `Space` het item met de focus. Alle andere sneltoetsen blijven werken, dus ook vanaf daar voegt `Alt + N` een tabel toe.  
Alleen het menu reageert op klikken: een druk ergens anders op het scherm komt bij het canvas terecht, en een klik met de rechtermuisknop op het canvas opent zoals gewoonlijk het contextmenu.

Waar het canvas ruimte heeft, wijzen met de hand getekende pijlen naar:

- de knop `Search` op de werkbalk: `Search commands and tables`
- de knoppen `Theme` en `Display Language`: `Pick a theme and a language`, of `Pick a theme` of `Pick a language` als de werkbalk maar één ervan toont — zie [Taal en thema](./language-and-theme.md)
- de [canvaswerkbalk](./table-related-functions.md#canvas-toolbar) onderaan: `Pan, zoom and draw relationships`

Zolang de [Verkenner](./explorer.md) wordt getoond, bedekt het welkomstscherm alleen het canvas ernaast.  
Een pijl waarvan de knop op de werkbalk boven de Verkenner staat, wordt weggelaten. De pijl voor `Theme` en `Display Language` wordt alleen weggelaten als beide knoppen ervan boven de Verkenner staan; tot dan wijst hij naar de knop die nog boven het canvas staat.  
Een label zonder ruimte naast zijn pijl hangt in plaats daarvan onder de pijl.

## Tabellen maken {#table-creation}

Maak een tabel via het contextmenu, met de knop `New Table` op de [canvaswerkbalk](./table-related-functions.md#canvas-toolbar) of met de sneltoets `Alt + N`.

## Memo's maken {#memo-creation}

Maak een memo via het contextmenu, met de knop `New Memo` op de canvaswerkbalk of met de sneltoets `Alt + M`.  
Zolang View Option → `Memos` uitstaat, zijn memo's verborgen, wordt `New Memo` nergens aangeboden en voegt `Alt + M` geen memo toe — zie [Weergaveopties voor tabellen](./table-related-functions.md#table-view-options).

Een memo is een notitie met vrije tekst op het canvas. Klik in het tekstvak en typ; de tekst wordt met het document opgeslagen.  
`Escape` sluit de memo-editor, behoudt wat je hebt getypt en laat de memo geselecteerd, en een tweede `Escape` heft de selectie op.  
Sleep aan de rand om de grootte ervan te wijzigen. De `x` in de kop, die wordt getoond zolang de aanwijzer zich boven de memo bevindt, verwijdert de memo.  
Een klik met de rechtermuisknop op een memo opent het menu ervan in plaats van de editor: `Color`, `Remove color` zolang een geselecteerd item een kleur heeft en `Delete`, dat `Delete selected` toont zolang de memo een van twee of meer geselecteerde items is. Een geselecteerde memo wordt ook verwijderd met de toetsen die tabellen verwijderen — zie [Tabellen en memo's verwijderen](./table-related-functions.md#table-and-memo-deletion).

![Een memo toevoegen met Alt + M, een notitie typen en aan de rand slepen om de grootte te wijzigen](/img/demo-memo.webp)

## Tabelgroepen maken {#table-group-creation}

Een tabelgroep is een kader dat tabellen bevat, en je kunt het een naam en een kleur geven. Maak er een op een van twee manieren:

- Kies `New Table Group` in het contextmenu of in Snel zoeken, klik op de knop `New Table Group` op de [canvaswerkbalk](./table-related-functions.md#canvas-toolbar) of druk op `Alt + G` (Windows/Linux) of `⌥ + G` (Mac), en sleep daarna een kader over het canvas. Elke tabel waarvan het midden binnen het kader ligt, komt in de nieuwe groep, tenzij ze al in een andere groep zit — zie [Een groep tekenen](./table-groups.md#drawing-a-group).
- Selecteer tabellen en kies `Group selected tables` in het contextmenu van een tabel of `Group Selected Tables` in Snel zoeken, of druk op `T` en daarna `G` — zie [Geselecteerde tabellen groeperen](./table-groups.md#grouping-selected-tables).

Een naam geven, kleuren, verplaatsen, de grootte wijzigen en de rest staan beschreven in [Tabelgroepen](./table-groups.md).

## Relaties maken {#relationship-creation}

Begin een relatie via het contextmenu, via de [canvaswerkbalk](./table-related-functions.md#canvas-toolbar) onderaan het canvas of met een sneltoets. Elk relatietype heeft een eigen sneltoets:

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) of `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) of `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) of `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) of `⌘ + ⌥ + 4` (Mac)

Zodra een type actief is, verandert de cursor. Klik eerst op de oudertabel en daarna op de kindtabel.  
De oudertabel krijgt een primaire sleutel als ze er geen heeft, en voor elke kolom van de primaire sleutel van de oudertabel krijgt de kindtabel een kolom met refererende sleutel die `Not Null` is, met hetzelfde gegevenstype, dezelfde standaardwaarde, dezelfde opmerking, dezelfde [logische naam](./logical-names.md) en hetzelfde [domein](./dictionary.md#domains-and-data-types).  
Een serial-sleutel is de uitzondering: de refererende sleutel ervan krijgt het integertype dat de serial opslaat, zoals `integer` voor `serial4`, en koppelt dan geen domein — zie [Identificerende relaties](./relationship-editing.md#identifying-relationships).  
Elke kolom met refererende sleutel wordt vernoemd naar de bijbehorende sleutel: een naam van één woord, zoals `id`, krijgt de naam van de oudertabel ervoor (`user_id`), een naam van meerdere woorden, zoals `member_id`, blijft behouden en een naam die de kindtabel al heeft, wordt genummerd (`user_id_2`) — zie [Namen van kolommen met refererende sleutel](./relationship-editing.md#foreign-key-column-names).  
Als je twee keer op dezelfde tabel klikt, wordt een zelfverwijzende relatie getekend.  
Een nieuwe relatie begint met `On Delete` en `On Update` allebei op `Not set`; wijzig ze via het contextmenu van de relatie — zie [ON DELETE en ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Druk op `Escape`, of druk nogmaals op dezelfde sneltoets, om te annuleren. Annuleren laat de selectie zoals ze is, en de volgende `Escape` heft haar op.

Als de oudertabel is gekozen en je een tabel aanwijst waarop de relatie kan eindigen, wordt die tabel omlijnd en verschijnen ernaast twee knoppen:

- `Create new columns` (`+`) tekent de relatie met nieuwe kolommen met refererende sleutel, net als een klik op de tabel.
- `Map to existing columns` (een koppelingspictogram) beëindigt het tekenen en opent [Kolommen toewijzen](./relationship-editing.md#map-columns) voor de twee tabellen, zodat de relatie kolommen kan gebruiken die de kindtabel al heeft. Er wordt niets geschreven totdat je op `Map` drukt.

Ook de oudertabel toont de knoppen zodra de aanwijzer een klein stukje is bewogen vanaf de plek waar je erop klikte, zodat ook een zelfverwijzende relatie aan bestaande kolommen kan worden toegewezen.  
Een vinger kan niet aanwijzen, dus als je met een vinger tekent, verschijnen de knoppen nooit en tekent een tik op de kindtabel meteen de relatie; een pen toont ze net als een muis.  
Als de oudertabel haar primaire sleutel kwijt is tegen de tijd dat je bij de kindtabel bent, bijvoorbeeld door ongedaan maken of door een bewerking van een medebewerker, is `Create new columns` gedimd met de knopinfo `<parent> has no primary key to copy`, en beëindigt een klik op de kindtabel het tekenen zonder iets te tekenen.  
De knopinfo noemt de oudertabel zoals de [naamweergave](./logical-names.md#beyond-the-canvas) dat doet.

![Een One N-relatie tekenen met ⌘ + ⌥ + 4 en daarna een Zero N-relatie via de canvaswerkbalk, waarbij de kindtabel is omlijnd en de knoppen Map to existing columns en Create new columns toont](/img/demo-relationship.webp)

## Tabellen en memo's dupliceren {#duplicating-tables-and-memos}

Bestaande tabellen en memo's kun je kopiëren, plakken en met `Alt` slepen om duplicaten te maken — zie [Functies voor tabellen](./table-related-functions.md#copyingpasting-tables-and-memos).
