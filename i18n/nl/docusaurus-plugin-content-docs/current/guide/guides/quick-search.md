---
sidebar_position: 7
description: Open het opdrachtpalet om van tabblad te wisselen, een opdracht voor het huidige tabblad uit te voeren, de Verkenner te openen of te sluiten, het thema of de weergavetaal te wijzigen, of door een voorvoegsel te typen naar een tabel, kolom, opmerking of memo te gaan.
---

# Snel zoeken

Snel zoeken is het opdrachtpalet van de editor.  
Het toont de opdrachten die op het huidige tabblad beschikbaar zijn. Begin de zoekopdracht met `#`, `@` of `:` om in plaats daarvan het diagram te doorzoeken en naar een tabel, een kolom of een opmerking of memo te gaan.

Open het met `Ctrl + K` (Windows/Linux) of `⌘ + K` (Mac), of klik op `Search` op de werkbalk.  
Dezelfde sneltoets sluit het, net als `Esc` en een klik buiten het paneel. Het openen ervan sluit Tabeleigenschappen, de [themabouwer](./language-and-theme.md#theme), de taalkiezer [`Display Language`](./language-and-theme.md#picking-a-language), het dialoogvenster [`Export image`](./file-import-export.md#image) en het dialoogvenster [Kolommen toewijzen](./relationship-editing.md#map-columns), dat daarbij vergeet wat je erin had gekozen. Het opent niet terwijl je een tabelcel, een memo of de naam van een tabelgroep bewerkt.

De knop op de werkbalk direct na `Search` is `Explorer`. Deze opent of sluit de [Verkenner](./explorer.md), een boomstructuur van het diagram die links van het canvas is vastgezet, met de functie Zoeken en vervangen bovenaan.  
Het openen van het palet laat de Verkenner open, en `Esc` sluit dan alleen het palet. Als je in het palet op `Ctrl + F` (Windows/Linux) of `⌘ + F` (Mac) drukt, sluit het palet en gaat de toetsenbordfocus naar het zoekveld van de Verkenner, waarbij de Verkenner op de zoekfunctie wordt geopend als hij niet wordt getoond. Anders dan het item `Toggle Explorer` sluit de toets de Verkenner nooit vanuit het palet — zie [Openen en sluiten](./explorer.md#opening-and-closing). Zolang de Verschilweergave, Tijdreizen of het voorbeeld van Automatische indeling open is, laat de editor de toets met rust: het palet blijft open en de toets gaat door naar de browser of de host — zie [De zoekbalk van de browser](./find-and-replace.md#the-browsers-find-bar).  
Een host die de editor insluit, kan Snel zoeken aan een andere toets toewijzen, die de knopinfo van `Search` dan toont — zie [Sneltoetsen](./settings.md#shortcuts).

![Het palet openen met ⌘ + K en daarna met #pay naar een tabel gaan, met @price naar een kolom en met :address naar een tabelopmerking](/img/demo-quick-search.webp)

## Zoeken en navigeren {#searching-and-navigating}

Typ om de lijst te filteren. Bij elke toetsaanslag wordt de hele lijst die je voor je hebt opnieuw doorzocht, dus als je tekens verwijdert of een nieuw woord typt over een woord dat niets vond, komen overeenkomende items terug.  
Er wordt gezocht bij benadering, zowel in de naam van een item als in de trefwoorden die ernaast staan. In het submenu `Import` vindt `sdl` bijvoorbeeld `GraphQL`, `dbdiagram` vindt `DBML` en `azimutt` vindt `AML`. Bij een kleine typefout wordt het item nog steeds gevonden, zoals `New Table` met `tabel` en `Import` met `imprt`, maar een item dat slechts vaag lijkt op wat je typte, wordt weggelaten: `memo` toont alleen `New Memo`. Een item waarvan de naam of de trefwoorden bevatten wat je typte, ongeacht hoofdlettergebruik, staat altijd in de lijst, en een item dat het zoeken bij benadering mist, komt na de overeenkomsten bij benadering. Wat je typte, wordt overal gemarkeerd waar een item het bevat, ongeacht hoofdlettergebruik.  
In een andere weergavetaal dan het Engels worden opdrachten en items van submenu's ook gevonden op hun Engelse namen en trefwoorden, die de lijst niet toont, dus `new table` vindt `New Table` in welke taal het ook wordt getoond.  
Ga door de lijst met `↑` en `↓` — aan beide uiteinden begint de lijst weer aan de andere kant — en voer het gemarkeerde item uit met `Enter`. Een opdracht met een eigen sneltoets toont die aan het einde van de rij: rechts, of links in een weergavetaal van rechts naar links. Zolang een invoermethode nog bezig is met samenstellen, zoals midden in een Koreaanse lettergreep, horen `↑`, `↓` en `Enter` bij de invoermethode en verplaatsen ze de markering niet en voeren ze ook geen item uit.

Een item zoals `Database`, `Import` of `Auto Layout` opent een submenu: de items daarvan vervangen de lijst en het zoekvak wordt leeggemaakt. De submenu's van `Database`, `Bracket`, `Language`, de twee naamnotaties, `Schema SQL: Statements`, `Schema SQL: Header`, `Theme` en `Display Language` vinken de huidige keuze aan en openen met de markering daarop, zodat `Enter` die keuze behoudt; de andere submenu's openen zonder markering.  
Filteren geldt altijd alleen voor de lijst die je voor je hebt, en je kunt niet terug naar een hoger niveau, dus sluit het palet en open het weer om opnieuw te beginnen. In een submenu zijn `#`, `@`, `:` en `?` gewone tekst, geen [voorvoegsels](#searching-the-diagram).

## Wat het palet toont {#what-the-palette-lists}

De lijst hangt af van het huidige tabblad. Op elk tabblad begint de lijst met `Tab`, dat overschakelt naar `Entity Relationship Diagram`, `Visualization`, `Schema SQL`, `Code Generator` of `Settings`, met uitzondering van het tabblad waarop je al bent.

Op het ERD-tabblad: `Database`, `Import`, `Import and Add` en `Export`, daarna `New Table`, `New Memo`, `New Table Group` en `Group Selected Tables`, de vier relatietypen en `Auto Layout`. Tabellen staan hier niet in de lijst; typ `#` om [naar een tabel te gaan](#searching-the-diagram).  
`Import and Add` wordt weggelaten in een editor in alleen-lezenmodus, en `New Memo` zolang [View Option](./table-related-functions.md#table-view-options) → `Memos` de memo's verbergt. `New Table Group` begint met het tekenen van een [tabelgroep](./table-groups.md) op het canvas, en `Group Selected Tables` plaatst de geselecteerde tabellen in een nieuwe groep en opent het naamveld ervan voor invoer. Beide worden weggelaten in een editor in alleen-lezenmodus en zolang View Option → `Table Groups` de groepen verbergt, en `Group Selected Tables` vereist ook dat er minstens één tabel is geselecteerd. Hun rijen tonen de toetsen: `Alt + G` (Windows/Linux) of `⌥ + G` (Mac) voor het [tekenen van een groep](./table-groups.md#drawing-a-group), en `T` en daarna `G` voor het [groeperen van de geselecteerde tabellen](./table-groups.md#grouping-selected-tables).  
Ze voeren dezelfde opdrachten uit als het contextmenu van het canvas, behalve `Group Selected Tables`, dat hetzelfde is als `Group selected tables` in het menu van een tabel; `View Option` en `Diff Viewer` staan alleen in het contextmenu. `Export` biedt dezelfde `json`, `Schema SQL` en `Image` als het contextmenu, en als je daarin `png` of `svg` typt, vind je `Image`.  
Zie [Bestanden importeren of exporteren](./file-import-export.md) voor wat elk formaat, [Importeren en toevoegen](./file-import-export.md#import-and-add) en de [export als afbeelding](./file-import-export.md#image) doen, en [Functies voor tabellen](./table-related-functions.md#databases) voor wat de keuze van de database beïnvloedt.

Op het tabblad Schema SQL: opnieuw `Database`, en `Bracket`, dat het aanhalingsteken instelt dat in de gegenereerde SQL rond tabel-, kolom-, beperkings- en indexnamen staat — `SingleQuote`, `DoubleQuote`, `Backtick` of `None` voor helemaal geen aanhalingstekens. Daarna `Schema SQL: Statements` en `Schema SQL: Header`, die dezelfde keuzes maken als het optiepaneel van het tabblad maar alleen de keuzes tonen die de geselecteerde database schrijft, en `Schema SQL: Options panel`, dat dat paneel toont of verbergt. Zie [Schema SQL](./schema-sql.md) voor wat elke keuze schrijft.

Op het tabblad Codegenerator: `Database`, `Bracket` zolang de taal `Doctrine`, `JPA` of `SeaORM` is, daarna `Language`, `Table Name Case`, `Column Name Case` en `Code Generator: Options panel`, dat het optiepaneel van het tabblad toont of verbergt. Zie [Codegenerator](./code-generator.md) voor wat elk doel oplevert.

De tabbladen Visualisatie en Instellingen hebben geen eigen opdrachten, alleen `Tab` en de opdrachten hieronder die elk tabblad toont.

Tegen het einde van de lijst van elk tabblad staat, ook in een editor in alleen-lezenmodus, `Toggle Explorer`, dat zijn sneltoets toont, `Ctrl + F` (Windows/Linux) of `⌘ + F` (Mac). Je vindt het ook door `find`, `replace`, `rename`, `tree`, `outline` of `objects` te typen.  
Uitvoeren ervan sluit het palet en doet wat de sneltoets op het canvas doet. Zolang de knop `Explorer` op de werkbalk als ingedrukt wordt weergegeven, dus zolang de Verkenner op het ERD-tabblad open is en niet door de zen-modus wordt verborgen, sluit het de Verkenner. Anders schakelt het over naar het ERD-tabblad en opent het de Verkenner op de zoekfunctie, met de tekstcursor in het zoekveld — zie [Openen en sluiten](./explorer.md#opening-and-closing). Het wordt weggelaten zolang de Verschilweergave, Tijdreizen of het voorbeeld van Automatische indeling open is.

### Thema en weergavetaal {#theme-and-display-language}

Na `Toggle Explorer` toont elk tabblad `Theme` en `Display Language`, ook in een editor in alleen-lezenmodus. Elk ervan staat alleen in de lijst waar de editor de bijbehorende kiezer aanbiedt, zoals de knoppen `Theme` en `Display Language` op de werkbalk laten zien. De webapp, Google Drive, VS Code, JetBrains-IDE's en Obsidian bieden beide aan — zie [Per host](./language-and-theme.md#in-each-host).

`Theme` opent `System`, `Light` en `Dark`, met het huidige uiterlijk aangevinkt. Als je er een kiest, verandert alleen het uiterlijk en blijven de grijstint en de accentkleur behouden, zoals bij de knoppen `Appearance` van de themabouwer.  
`Display Language` opent `System` en daarna de 25 talen, elk onder de eigen naam en in de volgorde van de taalkiezer, met de huidige optie aangevinkt. Hier is een taal ook te vinden op haar Engelse naam of haar code: `german` of `de-DE` vindt `Deutsch`, en `korean` vindt `한국어`.  
Een keuze in een van beide wordt meteen toegepast, sluit het palet en wordt net zo bewaard als een keuze in de themabouwer of de taalkiezer `Display Language`. Als de weergavetaal verandert terwijl het palet open is, schakelt de lijst over naar die taal, met behoud van wat je typte en van het submenu waarin je bent.

## Het diagram doorzoeken {#searching-the-diagram}

Begin de zoekopdracht met een voorvoegsel om het diagram te doorzoeken in plaats van de opdrachten: `#` voor tabellen, `@` voor kolommen, `:` voor opmerkingen en memo's, of `?` om de voorvoegsels te tonen. Een voorvoegsel werkt vanaf elk tabblad. Het telt alleen als eerste teken, waarbij spaties ervoor worden genegeerd. Een spatie erna is optioneel, dus `#users` en `# users` zijn dezelfde zoekopdracht, en de tekens met volledige breedte `＃`, `＠`, `：` en `？` die een Japanse of Chinese invoermethode typt, tellen ook mee.  
Zolang het invoerveld op het hoogste niveau leeg is, toont een regel eronder de vier voorvoegsels; klik op een ervan om het te typen. Zolang een voorvoegsel van kracht is, toont het einde van het invoerveld het bereik ervan: `Tables`, `Columns`, `Comments & memos` of `Help`. Verwijder het voorvoegsel om de opdrachten terug te krijgen.

`#` toont de tabellen, elk met `Table` ernaast, en een tabel met een lege naam staat in de lijst als `unnamed`. Zonder iets na `#` zijn ze op naam gesorteerd. Tekst na `#` wordt alleen met tabelnamen vergeleken, bij benadering zoals hierboven, en tabellen waarvan de naam de tekst bevat, komen eerst. Tabelgroepnamen en indexnamen worden onder geen enkel voorvoegsel doorzocht; [Zoeken en vervangen](./find-and-replace.md#what-it-searches) doorzoekt beide.

`@` toont kolommen met hun naam, elk met ernaast waar de kolom staat, zoals `users.email · Column`. Tekst na `@` moet in de kolomnaam voorkomen, ongeacht hoofdlettergebruik; deze vergelijking is niet bij benadering. Tekst vóór de eerste `.` beperkt de zoekopdracht tot de tabellen waarvan de naam die tekst bevat: `@users.em` toont de kolommen die `em` bevatten in tabellen waarvan de naam `users` bevat, `@users.` toont de kolommen van die tabellen en `@.em` doorzoekt alle tabellen. Zonder iets na `@` worden de kolommen ongefilterd getoond.

`:` toont tabelopmerkingen, kolomopmerkingen en memo's, nooit namen. Elke rij toont een fragment van de tekst rond de overeenkomst, met `users · Table comment`, `users.email · Column comment` of `Memo` ernaast. Tekst na `:` moet in de opmerking of memo voorkomen, ongeacht hoofdlettergebruik, net als bij `@`. Zonder iets na `:` worden de opmerkingen en memo's getoond die niet leeg zijn. Zolang View Option → `Memos` de memo's verbergt, toont `:` geen enkele memo.

`@` en `:` tonen hun rijen in de volgorde waarin het document ze bevat: tabel voor tabel, de opmerking van elke tabel vóór haar kolommen in kolomvolgorde, en memo's als laatste.

`?` toont `Tables`, `Columns` en `Comments & memos`, en tekst na `?` filtert die. Als je er een kiest, wordt de invoer vervangen door het bijbehorende voorvoegsel en blijft het palet open.

Een lijst met voorvoegsel bevat elke overeenkomst, hoeveel het er ook zijn. Een voorvoegsel waarvan de zoekopdracht niets vindt, laat de lijst leeg, zonder melding.

Het kiezen van een tabel, kolom, opmerking of memo sluit het palet en schakelt over naar het ERD-tabblad als je op een ander tabblad bent.  
Het canvas scrolt ernaartoe, tenzij het doel al goed in beeld is — zie [Waar een sprong terechtkomt](./table-related-functions.md#where-a-jump-lands). Een tabel wordt dan als enige geselecteerd en naar voren gebracht, met de focus op haar naam, tenzij de focus al in die tabel stond.  
Een memo wordt als enige geselecteerd en naar voren gebracht. Bij een kolom of een opmerking wordt de tabel ervan als enige geselecteerd en naar voren gebracht, en krijgt de cel met de tekst de focus, of de naam naast een opmerking die door een [weergaveoptie voor tabellen](./table-related-functions.md#table-view-options) wordt verborgen.  
Geen enkele sprong begint of voltooit een relatie die wordt getekend.

Gebruik voor `Match Case`, `Match Whole Word` of `Use Regular Expression`, of om tekst te vervangen, [Zoeken en vervangen](./find-and-replace.md) bovenaan de Verkenner.

## Als geen opdracht overeenkomt {#when-no-command-matches}

Als op het hoogste niveau, zonder voorvoegsel, geen opdracht in de lijst bevat wat je typte, ongeacht hoofdlettergebruik, volgen er drie rijen na de opdrachten: `Search tables for "…"`, `Search columns for "…"` en `Search comments & memos for "…"`, elk met het eigen voorvoegsel als pictogram. Kies je er een, dan wordt dat voorvoegsel vóór je tekst getypt, zodat `users` verandert in `#users`, en blijft het palet open met die resultaten.  
Als de zoekopdracht helemaal geen opdracht vindt, verschijnt `No commands match` boven de lijst, die dan alleen de drie rijen bevat. Als de zoekopdracht alleen opdrachten vindt die de tekst niet bevatten, komen die eerst: op het ERD-tabblad zonder geselecteerde tabel verschijnen met `tables` de opdrachten `New Table`, `Database` en, waar het wordt aangeboden, `New Table Group` vóór de drie rijen. Met een geselecteerde tabel bevat `Group Selected Tables`, waar het wordt aangeboden, `tables`, dus de drie rijen verschijnen niet.  
In een submenu laat een zoekopdracht die niets vindt de lijst leeg, zonder melding.

## Zoeken in het Koreaans {#searching-in-korean}

Een zoekopdracht die Hangul bevat, vindt ook overeenkomsten op basis van de letters ervan, in de opdrachten, in submenu's en onder elk voorvoegsel.  
Elke tussenstap van een Koreaanse invoermethode blijft de rij vinden die je aan het intypen bent, dus `ㅅ`, `사`, `상`, `사요` en `사용` vinden allemaal `사용자`. Een zoekopdracht die alleen uit beginmedeklinkers bestaat, wordt vergeleken met de beginmedeklinkers van de lettergrepen, waarbij spaties worden overgeslagen: `ㅅㅇㅈ` vindt `사용자`, en `ㅈㅁ` vindt `주문 내역`. Een medeklinkercluster dat een Windows-invoermethode samenstelt uit twee beginmedeklinkers die na elkaar worden getypt, zoals `ㅄ`, telt als die twee (`ㅂㅅ`), terwijl een dubbele medeklinker zoals `ㄲ` één letter blijft. Tekst die in ontlede vorm is opgeslagen, zoals bestandsnamen op macOS, komt overeen alsof die samengesteld was.  
Rijen waarvan de hele tekst de zoekopdracht vormt, letter voor letter of beginmedeklinker voor beginmedeklinker, komen eerst, daarna rijen die ermee beginnen en daarna rijen die haar bevatten. Onder `@` en `:` komen rijen die de zoekopdracht zoals getypt bevatten vóór al deze rijen, in documentvolgorde. De markering beslaat hele lettergrepen, dus `상` laat `사용` in `사용자` oplichten.
