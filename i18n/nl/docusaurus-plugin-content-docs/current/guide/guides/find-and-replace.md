---
sidebar_position: 9
description: Doorzoek namen van tabellen, kolommen, indexen en tabelgroepen, opmerkingen en memo's bovenaan in de Verkenner, loop de overeenkomsten langs in de boomstructuur ervan en op het canvas, en vervang één overeenkomst of allemaal.
---

# Zoeken en vervangen

De functie Zoeken en vervangen vindt tekst in het hele diagram, brengt je naar elke overeenkomst op het ERD-canvas en vervangt één overeenkomst of allemaal.  
Ze doorzoekt zeven soorten tekst: tabelnamen, tabelopmerkingen, kolomnamen, kolomopmerkingen, memo's, indexnamen en tabelgroepnamen — zie [Wat er wordt doorzocht](#what-it-searches).

De functie staat bovenaan in de [Verkenner](./explorer.md), het paneel dat links naast het ERD-canvas is vastgezet, tussen de titelbalk van de Verkenner en de boomstructuur ervan. Ze heeft geen eigen titel. Van boven naar beneden bevat ze:

- Het zoekveld, met aan het einde daarin de drie [opties](#options), en daarvoor de pijl `Toggle Replace`.
- De rij `Replace`, aanvankelijk samengevouwen — zie [Vervangen](#replacing).
- De teller, daarna de pijlen omhoog en omlaag waarmee je de overeenkomsten langsloopt, en de knop `Search In` met drie puntjes.
- De [soorten tekst](#what-it-searches), die `Search In` uitvouwt.

Zolang het zoekveld tekst bevat, toont de boomstructuur van de Verkenner de overeenkomsten — zie [De resultaten](#the-results).  
Op een laag canvas behoudt de zoekfunctie haar volledige hoogte, en de boomstructuur eronder krijgt de resterende ruimte en scrolt.

![Zoeken en vervangen openen in de Verkenner met ⌘ + F, de zes overeenkomsten van member langslopen en daarna, met Preserve Case aan, alle zes vervangen door user (⌘ + Enter)](/img/demo-find-and-replace.webp)

## Openen en sluiten {#opening-and-closing}

`Ctrl + F` (Windows/Linux) of `⌘ + F` (Mac), en `Toggle Explorer` in [Snel zoeken](./quick-search.md) of in het contextmenu van het canvas, openen de Verkenner op de zoekfunctie. De tekstcursor gaat naar het zoekveld, met de tekst erin geselecteerd, en de zoekopdracht wordt opnieuw uitgevoerd zonder huidige overeenkomst.  
De knop `Explorer` op de werkbalk opent of sluit alleen het paneel. Deze knop zet de tekstcursor niet in het zoekveld en laat de zoekopdracht en de huidige overeenkomst zoals ze waren.  
Als de toets de tekstcursor alleen terugbrengt naar een Verkenner die al zichtbaar is, zoals het geval is zolang Snel zoeken of een van de vijf dialoogvensters uit [Dialoogvensters ernaast](./explorer.md#dialogs-beside-it) open is, blijft de huidige overeenkomst de huidige.

Het sluiten van de Verkenner, wat de toets en de twee items `Toggle Explorer` doen zolang die open is, en de dialoogvensters die ze sluiten, staan beschreven in [Openen en sluiten](./explorer.md#opening-and-closing) op de pagina over de Verkenner.  
[Wanneer de Verkenner plaatsmaakt](./explorer.md#when-it-stands-aside) beschrijft hoe een ander tabblad en de zen-modus de Verkenner verbergen, en hoe de Verschilweergave, Tijdreizen en het voorbeeld van Automatische indeling hem verbergen en verhinderen dat hij opent. [Naast het canvas](./explorer.md#beside-the-canvas) gaat over een editor die te smal is voor de Verkenner.

Bij opnieuw openen blijft de laatste zoekopdracht behouden, samen met de vervangtekst, de [opties](#options), de [soorten tekst](#what-it-searches) die aanstonden, en of de rij `Replace` en de soorten tekst waren uitgevouwen.  
Ze blijven bewaard zolang de editor open blijft en worden niet in het document opgeslagen. Een nieuw geopende editor begint met alle opties uit, de rij `Replace` en de soorten tekst samengevouwen, en alleen de vier soorten namen aan — zie [Wat er wordt doorzocht](#what-it-searches).

## De zoekbalk van de browser {#the-browsers-find-bar}

Zolang de editor de toetsenbordfocus heeft, handelt hij `Ctrl + F` (Windows/Linux) of `⌘ + F` (Mac) zelf af op elk tabblad, ook in zijn eigen tekstvelden, zodat de zoekbalk van de browser niet opent.  
De toets gaat door naar de browser of de host zolang de Verschilweergave, Tijdreizen of het voorbeeld van Automatische indeling open is, en zolang de focus buiten de editor ligt.

- Webapp en Google Drive: de zoekbalk van de browser opent alleen in die twee gevallen.
- VS Code: de extensie houdt de eigen zoekwidget van VS Code uitgeschakeld in de ERD Editor, zodat de toets daar er nooit een opent.
- Obsidian: de toets bereikt de editor telkens wanneer het tabblad van het diagram actief is, in plaats van `Search current file` van Obsidian.
- JetBrains-IDE: als de keymap van de IDE `Ctrl + F` (Windows/Linux) of `⌘ + F` (Mac) voor zichzelf houdt, open je de zoekfunctie via `Toggle Explorer` in Snel zoeken of in het contextmenu van het canvas, of open je de Verkenner met de knop `Explorer` op de werkbalk en klik je in het zoekveld.

Een pagina die de editor insluit, kan de sneltoets naar een andere toets verplaatsen of verwijderen — zie [De sneltoets wijzigen](#changing-the-shortcut).

## Wat er wordt doorzocht {#what-it-searches}

Zeven knoppen bepalen welke soorten tekst worden doorzocht, in deze volgorde: `Table names`, `Table comments`, `Column names`, `Column comments`, `Memos`, `Index names` en `Table group names`.  
Ze zijn aanvankelijk samengevouwen. De knop `Search In` aan het einde van de rij met de teller vouwt ze onder die rij uit en weer samen, en is gemarkeerd zolang ze zichtbaar zijn.  
Een gemarkeerde knop voor een soort tekst staat aan. Klik op een knop om die in of uit te schakelen, en er wordt opnieuw gezocht. Staan alle zeven uit, dan wordt niets gevonden.

De zoekfunctie opent eerst met de vier soorten namen aan, `Table names`, `Column names`, `Index names` en `Table group names`, zodat een naamswijziging opmerkingen en memo's niet bereikt, tenzij je die inschakelt.  
Indexnamen zijn de namen van de indexen op het tabblad `Indexes` van [Tabeleigenschappen](./table-related-functions.md#indexes), niet de sleutels `PK_` en `UQ_` die erboven staan.

Verder wordt niets doorzocht: niet de gegevenstypen, de standaardwaarden, de kolommen van een index, de databasenaam, de [Schema SQL](./schema-sql.md) met de scripts `Before tables` en `After tables`, of gegenereerde code.  
Een opmerking die door een [weergaveoptie voor tabellen](./table-related-functions.md#table-view-options) is verborgen, wordt toch doorzocht. Memo's die met View Option → `Memos` zijn verborgen, en [tabelgroepen](./table-groups.md#hiding-groups) die met View Option → `Table Groups` zijn verborgen, worden niet doorzocht, ook niet als hun knop aanstaat, zodat `Replace All` nooit een memo herschrijft of een groep hernoemt die je niet kunt zien.

## Opties {#options}

Drie schakelaars binnen in het zoekveld, aan het einde ervan, bepalen hoe de zoekopdracht overeenkomsten vindt. Hun naam staat in hun knopinfo en ze zijn gemarkeerd zolang ze aanstaan. Alle drie staan aanvankelijk uit, en als je er een wijzigt, wordt opnieuw gezocht.

- `Match Case`: als deze uitstaat, wordt geen onderscheid gemaakt tussen hoofdletters en kleine letters.
- `Match Whole Word`: een overeenkomst telt alleen als die aan geen van beide kanten doorloopt in een woord. Letters, cijfers en diakritische tekens van elk schrift tellen als woordtekens, en het onderstrepingsteken ook. `user` komt daarom overeen in `user id` en `user.id`, maar niet binnen `users`, `user_id` of `superuser`. Een uiteinde van de zoekopdracht dat zelf geen woordteken is, zoals de punt in `.id`, heeft daar geen woordgrens nodig.
- `Use Regular Expression`: de zoekopdracht is een reguliere expressie van JavaScript, altijd in Unicode-modus, zodat `\p{L}` werkt. `^` en `$` komen overeen aan het begin en het einde van elke regel van een opmerking of memo met meerdere regels, en `.` gaat niet over een regeleinde heen. Escapereeksen die vaak in namen worden getypt, zoals `\_` en `\-`, worden geaccepteerd.

Een reguliere expressie die niet kan worden geparseerd, zoals `user(`, vindt niets: de teller toont `Invalid regular expression` in rood, en het zoekveld krijgt een rode omlijning.  
`Match Case` en `Match Whole Word` gelden ook voor een reguliere expressie. Een overeenkomst zonder lengte, zoals `^` op zichzelf, wordt nooit vermeld.

Naar gewone tekst wordt gezocht terwijl je typt. Naar een reguliere expressie wordt gezocht zodra je even stopt met typen, of meteen wanneer je op `Enter`, een navigatieknop, `Replace` of `Replace All` drukt of een rij kiest die een overeenkomst bevat.  
Het zoeken heeft geen tijdslimiet, dus een reguliere expressie met veel backtracking kan ervoor zorgen dat de editor niet meer reageert totdat het zoeken klaar is.

Een vierde schakelaar, `Preserve Case`, zit binnen in het veld `Replace`, aan het einde ervan, en is dus alleen zichtbaar zolang de rij `Replace` is uitgevouwen. Hij staat aanvankelijk uit. Hij verandert niets aan wat wordt gevonden, alleen aan hoe `Replace` en `Replace All` de vervanging schrijven — zie [Vervangen](#replacing). Als je hem in- of uitschakelt, wordt er niet gezocht, en de huidige overeenkomst blijft de huidige.

## De resultaten {#the-results}

De teller, aan het begin van de rij onder de velden, laat zien waar je bent. Hij is leeg zolang het zoekveld leeg is.

| Teller | Wanneer |
| --- | --- |
| `No results` | Niets komt overeen. |
| `12 matches` | Voordat je naar een ervan gaat; `1 match` bij één overeenkomst. |
| `3 of 12` | De derde overeenkomst is de huidige. |
| `Invalid regular expression` | De reguliere expressie kan niet worden geparseerd. |
| `Replaced 12 matches` | `Replace All` heeft zoveel overeenkomsten gewijzigd; `Replaced 1 match` bij één overeenkomst. |
| `No changes` | `Replace All` heeft niets gewijzigd. |
| `No more matches` | Een reeks drukken op `Replace` is teruggekomen op het punt waar die begon — zie [Vervangen](#replacing). |

`Replaced …`, `No changes` en `No more matches` maken plaats voor de teller bij de volgende zoekactie of stap, ook bij de zoekactie die door een bewerking of door ongedaan maken wordt gestart.

Zolang het zoekveld tekst bevat, toont de [boomstructuur](./explorer.md#the-tree) van de Verkenner de resultaten in plaats van het hele diagram: alleen de rijen die een overeenkomst bevatten en de rijen daarboven. Als niets overeenkomt of de reguliere expressie niet kan worden geparseerd, is de boom leeg. Als je de zoekopdracht verwijdert, komt de hele boom terug, samengevouwen zoals hij eerder was.

- `Tables`, `Table Groups` en `Memos` worden alleen getoond als ze een overeenkomst bevatten, en het getal bij elke map is het aantal rijen direct eronder in de resultaten.
- Onder `Tables` staan de tabellen die een overeenkomst bevatten, gesorteerd op naam. Onder elke tabel staan een rij voor elke overeenkomst in de opmerking ervan, daarna een map `Columns` met de kolommen die een overeenkomst bevatten, in kolomvolgorde, elk met een rij voor elke overeenkomst in de opmerking ervan, en daarna een map `Indexes` met de indexen waarvan de naam overeenkomt. Er is geen map `Foreign Keys`.
- Onder `Table Groups` staan de groepen waarvan de naam overeenkomt, gesorteerd op naam, zonder hun tabellen. Een gevonden tabel staat onder `Tables`.
- Onder `Memos` staan de memo's die een overeenkomst bevatten, in documentvolgorde, elk getoond met de eerste regel ervan en met een rij voor elke overeenkomst erin.

Een overeenkomst in een naam wordt gemarkeerd in de eigen rij van die naam, dus een naam die de zoekopdracht twee keer bevat, is één rij met twee markeringen.  
Een overeenkomst in een opmerking of memo heeft een eigen rij: een tekstballon bij een tabel- of kolomopmerking, of een plakbriefje bij een memo, gevolgd door een fragment van de tekst met de overeenkomst gemarkeerd. Een lange tekst wordt afgekapt met `…`, en regeleinden worden als spaties getoond. Houd de aanwijzer boven de rij om de hele tekst te zien.  
Elke andere rij ziet eruit zoals buiten een zoekactie: een kolom toont het gegevenstype ervan, een index de kolommen ervan, en een lege naam toont `unnamed`.

Elke rij met rijen eronder wordt uitgevouwen getoond wanneer een zoekactie start. Een rij die je samenvouwt, of die `Collapse All` samenvouwt, blijft samengevouwen tot een overeenkomst eronder de huidige wordt, of tot de zoekopdracht, `Match Case`, `Match Whole Word`, `Use Regular Expression` of een soort tekst verandert, of tot de zoekfunctie opnieuw wordt geopend met de toets of een item `Toggle Explorer`.  
De rij van de huidige overeenkomst wordt gemarkeerd en in beeld gescrold. De boom toont elke overeenkomst, hoeveel het er ook zijn.  
De overeenkomsten worden doorlopen in de volgorde van de boom: tabel voor tabel de naam van de tabel, de opmerking ervan, de naam en de opmerking van elk van de kolommen in kolomvolgorde, en de indexnamen; daarna de tabelgroepnamen; daarna de memo's.

De resultaten volgen het document zolang de Verkenner zichtbaar is. Zodra het bewerken pauzeert, leidt elke wijziging in de doorzochte teksten tot een nieuwe zoekactie, en de huidige overeenkomst blijft de huidige als die er nog is. Dat geldt voor een bewerkte naam, opmerking of memotekst, een toegevoegde of verwijderde tabel, kolom, index, memo of tabelgroep, een verplaatste kolom, en de memo's of tabelgroepen die met View Option worden verborgen of getoond, waardoor hun overeenkomsten uit de boom verdwijnen of terugkomen. Een bewerking op het canvas, ongedaan maken of opnieuw uitvoeren, een import en een bewerking door een medebewerker of een codeeragent tellen allemaal mee. Selecteren, tabellen, memo's of groepen op het canvas verplaatsen, scrollen, zoomen en aanwijzen tellen niet mee.  
Bewerkingen die zijn gedaan terwijl de Verkenner gesloten of uit beeld was, worden doorzocht zodra hij weer zichtbaar is.

## Naar een overeenkomst gaan {#going-to-a-match}

`Enter` in het zoekveld gaat naar de volgende overeenkomst, en `Shift + Enter` naar de vorige. De pijlknoppen omhoog en omlaag na de teller doen hetzelfde; hun knopinfo toont `Previous Match (Shift+Enter)` en `Next Match (Enter)`, en ze zijn uitgeschakeld zolang er geen overeenkomst is.  
De navigatie loopt aan beide uiteinden rond. Er is geen huidige overeenkomst tot je voor het eerst een stap zet, dus de eerste `Enter` gaat naar de eerste overeenkomst en de eerste `Shift + Enter` naar de laatste.

Een klik op een rij van de resultaten, of `Enter` of `Space` terwijl de toetsenbordfocus erop staat, doet een van de volgende dingen:

- Een rij waarvan de eigen naam een overeenkomst bevat, gaat naar de eerste overeenkomst in die naam.
- Een rij die een fragment van een opmerking of memo toont, gaat naar die overeenkomst.
- Elke andere rij, zoals een tabel waarvan de naam niet overeenkomt of de eigen rij van een memo, gaat naar wat de rij voorstelt en laat de huidige overeenkomst zoals die is — zie [Naar een rij gaan](./explorer.md#going-to-a-row).
- Een map wordt samengevouwen of uitgevouwen.

Telkens wanneer een overeenkomst de huidige wordt, vouwt de boom alle samengevouwen rijen erboven uit en zet hij de toetsenbordfocus op die rij, zodat de pijltoetsen in de boom vanaf daar verdergaan.

Naar een overeenkomst gaan sluit Tabeleigenschappen als die open is, en daarna:

- Bij een tabelnaam of tabelopmerking, of een kolomnaam of kolomopmerking, wordt alleen die tabel geselecteerd en naar voren gebracht, en komt de gefocuste cel op de cel die de overeenkomst bevat. Bij een overeenkomst in een opmerking die door een [weergaveoptie voor tabellen](./table-related-functions.md#table-view-options) is verborgen, komt de gefocuste cel in plaats daarvan op de naam ernaast.
- Bij een indexnaam wordt alleen de tabel van de index geselecteerd en naar voren gebracht, met de gefocuste cel op de naam van de tabel, tenzij de gefocuste cel al in die tabel staat. Indexnamen worden niet op het canvas getekend.
- Bij een tabelgroepnaam wordt alleen de groep geselecteerd en samen met zijn tabellen naar voren gebracht.
- Bij een memo wordt alleen die memo geselecteerd en naar voren gebracht.

Het canvas scrolt alleen als het doel niet al goed in beeld is, en het zoomniveau verandert nooit — zie [Waar een sprong terechtkomt](./table-related-functions.md#where-a-jump-lands).

Na `Enter` in het zoekveld blijft de tekstcursor daar, en nadat een rij is gekozen, blijft de toetsenbordfocus in de boom, zodat wat je daarna typt de geselecteerde tabel niet bereikt.  
Naar een overeenkomst gaan start of voltooit nooit het tekenen van een relatie.

## Vervangen {#replacing}

De rij `Replace` is aanvankelijk samengevouwen. De pijl vóór het zoekveld, met de knopinfo `Toggle Replace`, vouwt de rij uit en weer samen. Bij het samenvouwen blijft de vervangtekst behouden.  
De rij bevat het veld `Replace`, met aan het einde daarin de schakelaar `Preserve Case`, en twee knoppen met de knopinfo `Replace (Enter)` en `Replace All`. Beide knoppen zijn uitgeschakeld zolang er geen overeenkomst is.

`Replace` wordt uitgevoerd met `Enter` in het vervangveld, met of zonder `Shift`, of met de knop ervan:

- Zonder huidige overeenkomst gaat de eerste druk alleen naar de volgende overeenkomst, zodat je ziet wat er zou veranderen voordat er iets verandert.
- Als er een huidige overeenkomst is, vervangt het dat ene exemplaar, laat het elk ander exemplaar in dezelfde tekst staan en gaat het door naar de volgende overeenkomst na de tekst die het heeft geschreven. Wat het heeft geschreven, wordt overgeslagen, ook als het de zoekopdracht bevat: als je `user` vervangt door `super_user`, stopt het daarna niet binnen `super_user`.
- Een overeenkomst die de vervanging precies zo zou terugschrijven als ze was, blijft zoals ze is, en de druk gaat alleen door naar de volgende overeenkomst.
- De vervanging en het scrollen naar de volgende overeenkomst vormen één stap in de geschiedenis.

Een reeks drukken op `Replace` stopt zodra die terugkomt op het punt waar die begon. De teller toont `No more matches`, er is geen huidige overeenkomst, en verdere drukken vervangen niets.  
Als je `Customer` vervangt door `Big Customer`, wordt het daardoor één keer vervangen, in plaats van uit te groeien tot `Big Big Customer`.  
Naar een overeenkomst gaan, de zoekopdracht, `Match Case`, `Match Whole Word`, `Use Regular Expression` of een soort tekst wijzigen, de zoekfunctie openen met de toets of een item `Toggle Explorer`, of `Replace All` start een nieuwe reeks, en dat doet ook ongedaan maken of elke andere bewerking die de tekst wijzigt waarin de reeks begon. De vervangtekst of `Preserve Case` wijzigen doet dat niet, en de toets ook niet als die de tekstcursor alleen terugbrengt naar een Verkenner die al zichtbaar is.  
Zolang een reeks duurt, behoudt een tabel of tabelgroep die erdoor wordt hernoemd, haar plaats in de boom en in de volgorde van de overeenkomsten, zodat ze niet opnieuw aan de beurt komt als de nieuwe naam haar verderop zou sorteren. De volgende reeks zet de boom weer op naamvolgorde, en de hernoemde rij gaat naar haar nieuwe plaats.

`Replace All` wordt uitgevoerd met `Ctrl + Enter` (Windows/Linux) of `⌘ + Enter` (Mac) in het vervangveld, of met de knop ervan:

- Het vervangt elke overeenkomst in de soorten tekst die aanstaan en laat de andere soorten ongemoeid. Met de standaardsoorten hernoemt het tabellen, kolommen, indexen en tabelgroepen, en blijven opmerkingen en memo's onaangeroerd.
- Alles wat het wijzigt, is één stap in de geschiedenis — zie [Eén handeling, één stap](./undo-redo.md#one-gesture-one-step).
- De teller toont `Replaced N matches` en telt alleen de exemplaren waarvan de tekst echt is veranderd. Is er geen enkele veranderd, dan toont hij `No changes` en wordt niets in de geschiedenis vastgelegd, zoals wanneer je de reguliere expressie `(user)` vervangt door `$1`.
- Daarna wordt opnieuw gezocht, zonder huidige overeenkomst, dus de resultaten kunnen overeenkomsten tonen die in de nieuwe tekst staan.

Beide lezen elke tekst zoals die is op het moment dat je drukt, niet zoals de laatste zoekactie die aantrof.

Hoe de vervangtekst wordt gebruikt:

- Zonder `Use Regular Expression` heeft `$` geen speciale betekenis en wordt de vervangtekst gebruikt zoals getypt, afgezien van het hoofdlettergebruik dat `Preserve Case` eraan geeft.
- Met `Use Regular Expression` worden `$1` tot en met `$99`, `$<name>`, `$&`, `` $` ``, `$'` en `$$` ingevuld zoals in `String.prototype.replace` van JavaScript.
- Zonder `Preserve Case` wordt het hoofdlettergebruik van de gevonden tekst niet overgenomen: met `Match Case` uit wordt `Users` bij het vervangen van `user` door `member` omgezet in `members`.
- Met `Preserve Case` krijgt elke vervanging, nadat `$1` en de rest zijn ingevuld, het hoofdlettergebruik van de tekst die ze vervangt, zodat dezelfde vervanging `Users` omzet in `Members`:
  - Een overeenkomst helemaal in hoofdletters krijgt de vervanging helemaal in hoofdletters, en een overeenkomst helemaal in kleine letters krijgt die helemaal in kleine letters: `USER` met `account` geeft `ACCOUNT`, en `user` met `Account` geeft `account`.
  - Elke andere overeenkomst geeft het eerste teken van de vervanging het hoofdlettergebruik van het eerste teken van de overeenkomst en laat de rest zoals getypt: `UserId` met `accountKey` geeft `AccountKey`, en `uSER` met `AccountKey` geeft `accountKey`. Als het eerste teken van de overeenkomst geen hoofd- of kleine letter is, blijft de vervanging zoals getypt: `_Ab` met `xyz` geeft `xyz`.
  - Als de overeenkomst en de vervanging allebei `-` bevatten, of allebei `_`, en dat scheidingsteken ze in hetzelfde aantal delen splitst, krijgt elk deel het hoofdlettergebruik van het overeenkomstige deel: `USER_id` met `account_key` geeft `ACCOUNT_key`, en `User-Name` met `account-key` geeft `Account-Key`. Als `-` en `_` ze allebei zo splitsen, wordt het hoofdlettergebruik op het geheel als één stuk toegepast.
  - Een overeenkomst zonder letters die als hoofd- of kleine letter bestaan, zoals `123`, laat de vervanging zoals getypt.
  - Een overeenkomst die wordt teruggeschreven zoals ze was, telt niet mee: met `Match Case` uit schrijft het vervangen van `customer` door `Customer` de teksten `customer`, `Customer` en `CUSTOMER` terug zoals ze waren, en geen ervan wordt geteld.
- Een leeg vervangveld verwijdert de overeenkomst.

Een vervanging is een gewone bewerking, net als wanneer je zelf de nieuwe tabelnaam, opmerking, kolomnaam of memotekst typt, de naam van de index wijzigt in Tabeleigenschappen of de naam van de tabelgroep wijzigt.  
Ze wordt vastgelegd in de geschiedenis en bereikt medebewerkers en een codeeragent zoals elke andere bewerking.

## Toetsen in de zoekvelden {#keys-in-the-search-fields}

- In het zoekveld gaat `Enter` naar de volgende overeenkomst en `Shift + Enter` naar de vorige.
- In het vervangveld vervangt `Enter`, met of zonder `Shift`, en vervangt `Ctrl + Enter` (Windows/Linux) of `⌘ + Enter` (Mac) alles.
- Zolang een invoermethode in een van beide velden tekst samenstelt, hoort `Enter` bij die samenstelling; de toets gaat dan niet naar een andere overeenkomst en vervangt niets.

Wat `Escape`, de sneltoetsen van de editor die nog werken en elke andere toets in deze velden doen, staat beschreven in [Toetsen in de Verkenner](./explorer.md#keys-in-the-explorer).

## Editors in alleen-lezenmodus {#read-only-editors}

In een editor met [`readonly`](../../api/erd-editor-element.md#readonly) kan de zoekfunctie alleen zoeken. Er is geen pijl `Toggle Replace` en geen rij `Replace`, dus geen vervangveld, `Preserve Case`, `Replace` of `Replace All`.  
Het zoekveld, de drie opties ervan, de soorten tekst, de teller, de resultaten en naar een overeenkomst gaan werken allemaal. De Verkenner eromheen werkt zoals in elke andere editor — zie [Editors in alleen-lezenmodus](./explorer.md#read-only-editors).

In VS Code opent een revisie van een diagram, zoals een Git-revisie of een item uit Local History, als JSON-tekst. Als je zo'n revisie met `Reopen Editor With...` opnieuw als diagram opent, is ze alleen-lezen en krijgt ze deze zoekfunctie die alleen zoekt.

## De sneltoets wijzigen {#changing-the-shortcut}

Een pagina die de editor insluit, kan `Ctrl + F` (Windows/Linux) of `⌘ + F` (Mac) door een andere toetscombinatie vervangen of verwijderen, onder de naam `findReplace` met [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap).  
Als de sneltoets is verwijderd, wordt de toets op elk tabblad aan de pagina overgelaten. De knop `Explorer` op de werkbalk opent en sluit de Verkenner nog steeds, en `Toggle Explorer` in Snel zoeken en in het contextmenu van het canvas opent nog steeds de zoekfunctie of sluit de Verkenner, maar geen ervan toont een sneltoets, dus de knopinfo van de knop toont alleen `Explorer`. De rij `Toggle Explorer` op het tabblad [Sneltoetsen](./settings.md#shortcuts) van Instellingen toont ook geen toets. Na een nieuwe toewijzing tonen ze allemaal de nieuwe toets.
