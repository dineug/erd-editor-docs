---
sidebar_position: 6
description: Breng gerelateerde tabellen samen in een benoemd, gekleurd kader erachter; maak groepen, geef ze een naam en kleur, verplaats ze, wijzig hun grootte en verwijder ze, ga er vanuit de Verkenner naartoe, wijzig welke tabellen ze bevatten, verberg ze en neem ze mee in Automatische indeling, Schema SQL en DBML.
---

# Tabelgroepen

Een tabelgroep is een gekleurd kader met een naam dat achter gerelateerde tabellen op het ERD-canvas wordt getekend, om te laten zien welke tabellen bij elkaar horen.  
Een tabel zit in hooguit één groep. Groepen worden met het diagram opgeslagen, samen met de groep waarin elke tabel zit.

Het kader heeft bovenaan een titelbalk met een groepspictogram, de naam van de groep in vet en, zolang de aanwijzer boven de groep is, een `x` die de groep verwijdert — zie [Een groep verwijderen](#removing-a-group). Een groep zonder naam toont `unnamed`, en een naam die te lang is voor de balk, wordt afgekapt met `…`.  
Het kader omvat altijd zijn tabellen: het behoudt de grootte die het heeft gekregen, maar rekt uit om elke tabel erbinnen te houden met `24px` ruimte eromheen en de titelbalk erboven. Een tabel die groter wordt, rekt het kader mee, en dat doet ook een tabel die bij een rand wordt neergezet terwijl haar midden nog binnen het kader ligt. Terwijl tabellen worden gesleept, wordt het kader niet groter en ook niet kleiner. Het uitrekken wordt niet opgeslagen: het kader keert terug naar zijn eigen grootte zodra de tabel de ruimte niet meer nodig heeft.

Groepen worden achter al het andere op het canvas getekend: tabellen, memo's en verbindingslijnen.  
Waar groepen elkaar overlappen, wordt de groep waarop het laatst is gedrukt of die het laatst is toegevoegd, vooraan getekend, en bedekt het vlak van een groep nooit de titelbalk van een andere groep. De volgorde wordt niet opgeslagen, dus een opnieuw geopend diagram stapelt zijn groepen in de volgorde waarin ze zijn toegevoegd.  
Groepen zijn zichtbaar op het ERD-canvas, in de minimap en in een geëxporteerde afbeelding, en de [Verkenner](./explorer.md) vermeldt ze — zie [Naar een groep gaan](#going-to-a-group). Het tabblad [Visualisatie](./visualization.md) tekent in geen van beide modi groepen of groepskleuren.

Een codeeragent kan ook groepen maken en wijzigen en de DDL van gekozen groepen lezen — zie [Tabelgroepen](../../mcp/tools.md#table-groups) bij de MCP-tools.

![Het tekenen van een groep activeren met ⌥ + G, de groep over orders en payments tekenen, hem de naam Billing geven, order_items erin neerzetten en daarna de groep verplaatsen en de grootte ervan wijzigen](/img/demo-table-group.webp)

## Een groep maken {#creating-a-group}

Er zijn twee manieren om een groep te maken, elk met een sneltoets. Geen van beide wordt aangeboden in een editor in alleen-lezenmodus of zolang groepen [verborgen](#hiding-groups) zijn, en hun sneltoetsen doen dan niets.  
Net als de andere sneltoetsen van het canvas werken ze alleen op het ERD-tabblad en worden ze onderdrukt terwijl een cel, een memo of de naam van een groep wordt bewerkt — zie [Sneltoetsen](./settings.md#shortcuts).

### Een groep tekenen {#drawing-a-group}

Klik op de knop `New Table Group` op de [canvaswerkbalk](./table-related-functions.md#canvas-toolbar), druk op `Alt + G` (Windows/Linux) of `⌥ + G` (Mac) of kies `New Table Group` in het contextmenu van het canvas, waar het na `New Table` en `New Memo` staat, of in [Snel zoeken](./quick-search.md) op het ERD-tabblad. Sleep daarna een kader over het canvas.  
De knop en de sneltoets schakelen het tekenen in en uit, dus als je op een van beide drukt terwijl het tekenen actief is, wordt het beëindigd, hoe het ook is gestart; het item in het contextmenu en Snel zoeken starten het alleen. Het starten schakelt het handgereedschap uit en annuleert een relatie die wordt getekend.  
Zolang het tekenen actief is, is de cursor een dradenkruis, en start een druk het kader op de plek waar je drukt, zelfs boven een tabel, in plaats van te selecteren of te verplaatsen wat eronder ligt. De canvaswerkbalk markeert dan de knop `New Table Group`, en niet de hand of de aanwijzer.

Bij het loslaten wordt een groep in dat kader toegevoegd, nooit kleiner dan `160px` breed en `100px` hoog, titelbalk inbegrepen, hoe kort het slepen ook was. Een klik zonder slepen voegt een groep toe van `480px` breed en `320px` hoog met de linkerbovenhoek op de plek van de klik.  
Elke tabel zonder groep waarvan het midden binnen het nieuwe kader ligt, komt in de groep. Een tabel die al in een andere groep zit, blijft daar.

Met de middelste muisknop pan je nog steeds het canvas en blijft het tekenen actief. Het volgende beëindigt het tekenen zonder een groep toe te voegen:

- `Escape`, of `Alt + G` (Windows/Linux) of `⌥ + G` (Mac), vóór de druk of tijdens het slepen. Vóór de druk laten ze de selectie zoals die is; de druk die het kader start, heeft die al opgeheven.
- Een klik met de rechtermuisknop, die de selectie opheft. Er opent geen contextmenu.
- Overschakelen naar het handgereedschap met `Space` of via de canvaswerkbalk, klikken op de aanwijzer of de knop `New Table Group` op de werkbalk, of een relatie starten.
- Naar een ander tabblad wisselen, de groepen verbergen of het overschakelen van de editor naar alleen-lezen.

### Geselecteerde tabellen groeperen {#grouping-selected-tables}

Selecteer een of meer tabellen en druk op `T` en daarna `G`, of kies `Group selected tables` in het contextmenu van een tabel of `Group Selected Tables` in Snel zoeken, dat de opdracht toont zolang er een tabel is geselecteerd.  
De nieuwe groep wordt rond de geselecteerde tabellen getekend met `24px` ruimte aan elke kant en de titelbalk erboven. Elke geselecteerde tabel komt erin en verlaat de groep waarin ze zat, en die groep blijft bestaan, ook als hij nu leeg is. Memo's in de selectie worden overgeslagen.

`T` en daarna `G` bestaat uit twee toetsaanslagen zonder modificatietoets, `G` binnen een seconde na `T`. Zonder geselecteerde tabel doet het niets, en in een tekstveld, zoals het zoekveld van de Verkenner, typt het de twee letters.

![categories en products groeperen met T en daarna G, de groep de naam Catalog geven en hem daarna via zijn menu violet kleuren, zodat beide koppen de kleur krijgen](/img/demo-table-group-selected.webp)

In beide gevallen heeft de nieuwe groep geen naam en geen kleur. Hij wordt als enige geselecteerd, en zijn naamveld opent over de titelbalk, zodat je meteen een naam kunt typen — zie [Een groep een naam geven](#naming-a-group).  
De groep en de tabellen die hij opneemt, vormen één stap in de geschiedenis, en de naam die je typt, is een tweede stap.

## Een groep een naam geven {#naming-a-group}

De naam van een groep wordt bewerkt in een veld dat over de titelbalk opent. Het opent vanzelf zodra een groep is gemaakt, bij een dubbelklik op de titelbalk en via `Rename` in het contextmenu van de groep.  
`Enter`, of ergens anders klikken, slaat de naam op. `Escape` sluit het veld zonder de naam te wijzigen en laat de groep geselecteerd, en een tweede `Escape` heft de selectie op.  
Een gewijzigde naam is één stap in de geschiedenis; de naam ongewijzigd opslaan legt niets vast. Een lege naam of een naam met alleen spaties wordt weergegeven als `unnamed`.  
Zolang het veld open is, worden de sneltoetsen van het canvas onderdrukt en doen de sneltoetsen voor Snel zoeken en `Toggle Explorer` niets, net als wanneer een tabelcel wordt bewerkt.

[Zoeken en vervangen](./find-and-replace.md#what-it-searches) doorzoekt groepsnamen onder `Table group names` zolang groepen worden getoond, en `Replace` en `Replace All` van die functie wijzigen de naam van groepen — zie [Vervangen](./find-and-replace.md#replacing). [Snel zoeken](./quick-search.md#searching-the-diagram) doorzoekt geen groepsnamen.

## Een groep kleuren {#coloring-a-group}

Kies `Color` in het contextmenu van de groep om de kleurkiezer te openen op de kleur van de groep.  
Net als bij tabellen en memo's kleurt de kiezer elke geselecteerde tabel, memo en groep, en `Remove color` in het menu, of `No color` in de kiezer, haalt bij allemaal de kleur weg — zie [Kleur van tabellen en memo's instellen](./table-related-functions.md#table-and-memo-color-specification). De kleur van een groep wordt ook aangeboden onder `Document colors` in de kiezer.

Een gekleurde groep tekent zijn titelbalk en omlijning in de kleur en zijn vlak in een lichte tint ervan. Een groep zonder kleur gebruikt de neutrale grijstinten van het thema.  
Elke tabel in een gekleurde groep krijgt de kleur van de groep over haar kop en behoudt haar eigen kleur aan haar linkerrand, zodat beide zichtbaar zijn.  
De tekst en knoppen op zo'n kop worden wit, of zwart op een lichte kleur waar zwart veel beter leesbaar is, en hetzelfde geldt voor de naam, het pictogram en de `x` op de titelbalk van de groep. Van de vooraf ingestelde kleurstalen van de kiezer krijgen Orange, Amber, Yellow en Lime zwart, en de overige wit.  
Een tabel behoudt haar eigen kop zolang haar groep geen kleur heeft, zolang groepen verborgen zijn, bij een zoomniveau van `70%` en lager, waar tabellen tot hun naam inklappen, en op het tabblad Visualisatie.

Een kleurwijziging wordt in de [geschiedenis](./undo-redo.md#one-gesture-one-step) vastgelegd, net als bij tabellen en memo's.

## Groepen selecteren {#selecting-groups}

Klik op de titelbalk van een groep om alleen die groep te selecteren, of gebruik `Ctrl + click` (Windows/Linux) of `⌘ + click` (Mac) om hem aan de selectie toe te voegen.  
Een druk op de titelbalk van een groep die al geselecteerd is, behoudt de hele selectie, zodat slepen dan alles verplaatst.  
Een druk op de titelbalk, of een klik met de rechtermuisknop op de groep, brengt de groep vóór de andere groepen en zijn tabellen vóór elke andere tabel en memo.

Het vlak, het gebied onder de titelbalk, gedraagt zich voor de linkermuisknop als het canvas: slepen pant, `Ctrl + drag` (Windows/Linux) of `⌘ + drag` (Mac) tekent een selectiekader en een klik heft de selectie op. De tabellen, memo's en verbindingslijnen boven het vlak reageren zoals gewoonlijk op de aanwijzer.

Een selectiekader neemt een groep alleen mee als het het hele kader van de groep omsluit, dus een selectiekader dat binnen een groep wordt getekend, selecteert tabellen zonder de groep — zie [Meervoudige selectie](./table-related-functions.md#multiple-selection).  
`Ctrl + A` (Windows/Linux) of `⌘ + A` (Mac) selecteert nooit een groep.

`Select tables` in het contextmenu van de groep vervangt de selectie door de tabellen van de groep, zonder de groep zelf, zodat de volgende opdracht alleen de tabellen bereikt.  
Gebruik het vóór opdrachten die alleen op tabellen werken, zoals kopiëren of [focussen op tabellen](./table-related-functions.md#focusing-on-tables), die een geselecteerde groep overslaan.

De omlijning van een geselecteerde groep krijgt de selectiekleur. In een [sessie voor gezamenlijk bewerken](../../api/advanced/collaborative-editing.md) wordt een groep die een andere deelnemer selecteert, omrand in de kleur van die deelnemer.

## Naar een groep gaan {#going-to-a-group}

De [Verkenner](./explorer.md#the-tree) vermeldt de groepen in de map `Table Groups`, op naam, elk met zijn tabellen eronder. Snel zoeken vermeldt geen groepen.

Als je in de Verkenner een groepsrij kiest, een overeenkomst van [Zoeken en vervangen](./find-and-replace.md#going-to-a-match) in de naam van een groep of een groepsrij in de lijst van de [Verschilweergave](./table-related-functions.md#the-change-tree), ga je naar die groep.  
Het kader van de groep komt dan in beeld, uitgaande van de titelbalk als het kader hoger is dan het canvas — zie [Waar een sprong terechtkomt](./table-related-functions.md#where-a-jump-lands). Daarna wordt alleen de groep geselecteerd en wordt hij met zijn tabellen naar voren gebracht, zoals een druk op zijn titelbalk doet.  
Zolang groepen [verborgen](#hiding-groups) zijn, of zodra de groep is verwijderd, doet ernaartoe gaan niets.  
In de Verschilweergave gaat elke kant alleen naar de groep als het eigen document van die kant de groep bevat en toont — zie [Naar een wijziging gaan](./table-related-functions.md#going-to-a-change).

## Een groep verplaatsen en de grootte wijzigen {#moving-and-resizing-a-group}

Sleep een groep aan zijn titelbalk om hem met al zijn tabellen te verplaatsen.  
Als de groep deel uitmaakt van een grotere selectie, beweegt de hele selectie mee, en een tabel die zowel geselecteerd is als in de groep zit, wordt één keer verplaatst.  
Het slepen begint pas als de aanwijzer een klein stukje is bewogen, zodat een klik of dubbelklik op de titelbalk een klik blijft. `Alt + drag` op een titelbalk verplaatst de groep zoals normaal slepen dat doet; een groep wordt nooit gedupliceerd.  
De verplaatsing, met elke tabel die meegaat, is één stap in de geschiedenis.

Een tabel afzonderlijk slepen verplaatst alleen die tabel en kan haar in een groep zetten of eruit halen — zie [Tabellen toevoegen en verwijderen](#adding-and-removing-tables).

Elke groep heeft grepen om de grootte te wijzigen op zijn vier randen en vier hoeken, geselecteerd of niet, net als een memo.  
Sleep er een met de linkermuisknop: het kader volgt de aanwijzer, en de nieuwe grootte wordt opgeslagen als je loslaat, als één stap in de geschiedenis.  
Een groep kan niet kleiner worden gemaakt dan `160px` bij `100px`, en ook niet kleiner dan zijn tabellen met hun `24px` ruimte en de titelbalk. De rand stopt daar, hoe ver de aanwijzer ook gaat.

## Tabellen toevoegen en verwijderen {#adding-and-removing-tables}

Waar je een tabel neerzet, bepaalt of ze in een groep komt of die verlaat.  
Als je tabellen sleept en loslaat, wordt elke gesleepte tabel die niet door een geselecteerde groep wordt meegenomen, beoordeeld op haar midden. Ze komt in de bovenste groep waarvan het kader haar midden bevat, of verlaat haar groep als haar midden in het kader van geen enkele groep ligt. De bovenste groep is de groep die vooraan wordt getekend.  
Een groep die door het slepen op zijn plaats blijft, behoudt het kader dat hij had toen het slepen begon, dus een tabel die binnen haar eigen groep een stukje wordt verschoven, blijft erin en moet zo ver worden gesleept dat haar midden buiten dat kader ligt om de groep te verlaten.  
Tijdens het slepen wordt elke groep omlijnd waarin het neerzetten een tabel zou plaatsen.

Als je binnen ongeveer `200ms` na de laatste beweging loslaat, hoort de groepswijziging bij de stap van het slepen in de geschiedenis, zodat één keer ongedaan maken de tabellen terugzet waar ze waren en in de groepen waarin ze zaten. Na een langere pauze vóór het loslaten is de groepswijziging een eigen stap — zie [Eén handeling, één stap](./undo-redo.md#one-gesture-one-step).  
Een klik, of slepen over een paar pixels, wijzigt geen groep, en zolang groepen verborgen zijn, verandert niets van groep.

De andere manieren om te wijzigen welke tabellen een groep bevat:

- `Remove from group` in het contextmenu van een tabel haalt elke geselecteerde tabel uit haar groep. Het item wordt getoond zolang een geselecteerde tabel in een groep zit, ook als groepen verborgen zijn, en is één stap in de geschiedenis.
- `Group selected tables` verplaatst de geselecteerde tabellen naar een nieuwe groep — zie [Geselecteerde tabellen groeperen](#grouping-selected-tables).
- Een groep verwijderen laat zijn tabellen zonder groep achter.

Een tabel die wordt geplakt of met `Alt` wordt gedupliceerd, zit in geen enkele groep, ook als ze binnen het kader van een groep terechtkomt. Als je haar daarna sleept, geldt de regel voor neerzetten.

## Een groep verwijderen {#removing-a-group}

Een groep verwijderen verwijdert nooit zijn tabellen: ze blijven waar ze zijn, zonder groep.

- De `x` aan het einde van de titelbalk, die zichtbaar is zolang de aanwijzer boven de groep is, verwijdert alleen die groep.
- `Delete` in het contextmenu van de groep verwijdert de groep. Als de groep een van meerdere geselecteerde items is, toont het menu-item `Delete selected` en verwijdert het alles wat geselecteerd is: tabellen, memo's en groepen.
- Met geselecteerde groepen verwijdert `Delete` of `Backspace` de geselecteerde groepen samen met eventuele geselecteerde tabellen en memo's, net als `Ctrl + Backspace` en `Ctrl + Delete` (Windows/Linux) of `⌘ + Backspace` en `⌘ + Delete` (Mac) — zie [Tabellen en memo's verwijderen](./table-related-functions.md#table-and-memo-deletion).

Elke verwijdering is één stap in de geschiedenis, en ongedaan maken brengt de groep met zijn tabellen erin terug.

## Het groepsmenu {#the-group-menu}

Klik met de rechtermuisknop op de titelbalk, het vlak of de rand van een groep om het menu ervan te openen. Op een Mac opent `Ctrl + click` het ook, net als lang drukken op een touchscreen.  
De klik met de rechtermuisknop selecteert eerst de groep, als enige tenzij hij al deel uitmaakt van de selectie, dus `Color` en `Delete selected` bereiken de rest van de selectie alleen als de groep erin zat.

- `Select tables`: selecteert alleen de tabellen van de groep — zie [Groepen selecteren](#selecting-groups).
- `Rename`: opent het naamveld — zie [Een groep een naam geven](#naming-a-group).
- `Color`: opent de kleurkiezer — zie [Een groep kleuren](#coloring-a-group).
- `Remove color`: wordt getoond zolang iets in de selectie een kleur heeft.
- `Delete`, of `Delete selected` als de groep een van meerdere geselecteerde items is, met de toets `Delete` rechts weergegeven — zie [Een groep verwijderen](#removing-a-group).

Het contextmenu van een tabel voegt `Group selected tables` en `Remove from group` toe na `Color` en `Remove color`, vóór het item Delete, en het contextmenu van het canvas voegt `New Table Group` toe.  
`Group selected tables` toont rechts zijn toetsen, `T` en daarna `G`, en `New Table Group` toont `Alt + G` (Windows/Linux) of `⌥ + G` (Mac).

## Groepen verbergen {#hiding-groups}

`View Option` → `Table Groups` in het contextmenu van het canvas toont of verbergt alle groepen. Deze optie is standaard aangevinkt — zie [Weergaveopties voor tabellen](./table-related-functions.md#table-view-options).  
Uitgevinkt verdwijnen de groepskaders en de groepskleuren op tabelkoppen van het canvas, de minimap en geëxporteerde afbeeldingen, en maken de schuifbalken en de minimap geen ruimte meer voor de groepen. Niets verschuift of verandert van grootte, en elke tabel blijft in haar groep.  
Het verbergen van de groepen deselecteert ze, beëindigt het tekenen met `New Table Group` en sluit een geopend naamveld.

Zolang groepen verborgen zijn:

- `New Table Group` en `Group selected tables` worden niet aangeboden in de menu's, `New Table Group` en `Group Selected Tables` evenmin in Snel zoeken, en de canvaswerkbalk laat de knop `New Table Group` weg. `Remove from group` wordt nog wel aangeboden.
- `Alt + G` (Windows/Linux) of `⌥ + G` (Mac) en `T` en daarna `G` doen niets.
- Tabellen slepen wijzigt geen groep, en een selectiekader neemt geen groep mee.
- De Verkenner laat de map `Table Groups` weg, en de functie Zoeken en vervangen vindt en vervangt geen groepsnamen, ook niet als `Table group names` aanstaat.
- [Automatische indeling](#auto-layout) houdt de tabellen van elke groep nog steeds bij elkaar, het tabblad Schema SQL biedt nog steeds de [groepen om uit te kiezen](#schema-sql-by-group), DBML schrijft ze nog steeds weg en wat [Importeren en toevoegen](./file-import-export.md#import-and-add) toevoegt, komt nog steeds onder de verborgen kaders terecht.

De keuze wordt in het document opgeslagen en in de [geschiedenis](./undo-redo.md#what-the-history-records) vastgelegd, net als de andere weergaveopties. In een editor in alleen-lezenmodus blijft ze in plaats daarvan op dat scherm — zie [Editors in alleen-lezenmodus](#read-only-editors).

## Automatische indeling {#auto-layout}

Elke [automatische indeling](./table-related-functions.md#auto-layout) houdt de tabellen van elke groep bij elkaar, of groepen nu worden getoond of niet.

- `Force` verplaatst elke groep met zijn tabellen als één kader, waarbij de tabellen hun plaats erbinnen behouden, en houdt het kader van elke groep minstens `100px` verwijderd van andere groepen en van tabellen zonder groep. Het voorbeeld toont elke groep op de plek waar hij naartoe gaat.
- `Flow`, `Tree - vertical` en `Tree - horizontal` delen de tabellen van elke groep binnen de groep in en plaatsen de groepen op basis van de relaties ertussen, met de tabellen zonder groep eromheen ingedeeld.

Daarna wordt elke groep die tabellen bevat, eraan aangepast: zijn kader wordt hun omsluitende rechthoek, met `24px` ruimte en de titelbalk. Een groep zonder tabellen behoudt zijn plaats en grootte.  
De tabellen en groepen worden als één stap ongedaan gemaakt.

Een DBML-import past elke groep op dezelfde manier rond zijn tabellen aan, waar ze ook worden geplaatst — zie [DBML](./file-import-export.md#dbml).

## Schema SQL per groep {#schema-sql-by-group}

Het tabblad [Schema SQL](./schema-sql.md) kan alleen de tabellen van gekozen groepen schrijven.  
Zolang het document een groep bevat, getoond of verborgen, toont het optiepaneel ervan een rij `Tables` onder `This window only`, met een selectievakje voor `All`, één voor elke groep en één voor `No group`, de tabellen zonder groep — zie [Tabellen](./schema-sql.md#tables).  
De keuze hoort bij het editorvenster en wordt niet in het document opgeslagen.

## Importeren, exporteren en kopiëren {#import-export-and-copying}

- DBML neemt groepen in beide richtingen mee. Een DBML-import maakt van elk blok `TableGroup` een groep — zie [DBML](./file-import-export.md#dbml) — en `DBML` in de Codegenerator schrijft een blok `TableGroup` voor elke groep die een tabel bevat — zie [Codegenerator](./code-generator.md#language).
- Een JSON-bestand behoudt zijn groepen. Geen ander formaat neemt ze mee: SQL-, GraphQL- en AML-imports brengen er geen mee, en Schema SQL en de andere doelen van de Codegenerator schrijven er geen.
- [Importeren en toevoegen](./file-import-export.md#import-and-add) brengt de groepen van een bestand binnen als nieuwe groepen met hun tabellen, en selecteert ze samen met de nieuwe tabellen zolang groepen worden getoond, zodat het toegevoegde blok bij het slepen zijn groepen meeneemt.
- Een [geëxporteerde afbeelding](./file-import-export.md#image) tekent de getoonde groepen achter de tabellen, met de groepskleuren op hun koppen.
- Kopiëren en plakken, of dupliceren met `Alt`, kopieert nooit een groep — zie [Tabellen en memo's kopiëren/plakken](./table-related-functions.md#copyingpasting-tables-and-memos) en [Tabellen toevoegen en verwijderen](#adding-and-removing-tables).

## Editors in alleen-lezenmodus {#read-only-editors}

In een editor met [`readonly`](../../api/erd-editor-element.md#readonly) worden groepen zoals gewoonlijk getekend en in de Verkenner vermeld, en kun je ernaartoe gaan, maar ze niet wijzigen:

- [Naar een groep gaan](#going-to-a-group) selecteert haar, en dat is de enige manier waarop daar een groep wordt geselecteerd. Een druk op een titelbalk selecteert niets en verplaatst niets: gesleept pant hij het canvas, en een klik die niet beweegt haalt de selectie weg die een sprong achterliet.
- Er zijn geen grepen om de grootte te wijzigen en er is geen `x`, en een dubbelklik op de titelbalk opent geen naamveld.
- Een rechtsklik op een groep opent geen menu, en het menu van een tabel bevat alleen `Table Properties`.
- Het menu van het canvas heeft geen `New Table Group`, en Snel zoeken toont geen van beide groepsopdrachten. Het tekenen met `New Table Group` eindigt wanneer de editor overschakelt naar alleen-lezen.
- De [canvaswerkbalk](./table-related-functions.md#canvas-toolbar) behoudt alleen zijn weergavebesturingen, dus hij heeft geen knop `New Table Group`, en `Alt + G` (Windows/Linux) of `⌥ + G` (Mac) en `T` en daarna `G` doen niets.
- Een sleepbeweging van tabellen of van een groep die bezig is wanneer de editor overschakelt naar alleen-lezen, stopt waar ze is en wijzigt geen groep, en het wijzigen van de grootte van een groep dat bezig is, eindigt zonder de grootte te wijzigen.
- `View Option` → `Table Groups` toont of verbergt de groepen alleen op dat scherm, zoals elke View Option daar doet: het document, medebewerkers en de ongedaanmakingsgeschiedenis behouden de keuze zoals ze was, en als de editor weer bewerkbaar wordt, komt de keuze van het document terug.
- De keuze `Tables` op het tabblad Schema SQL werkt nog steeds.
