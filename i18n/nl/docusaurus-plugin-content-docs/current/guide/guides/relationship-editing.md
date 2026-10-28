---
sidebar_position: 7
description: Verwijder een relatie, wijzig het type ervan, stel de acties voor ON DELETE en ON UPDATE in, wijs de relatie toe aan bestaande kolommen met het dialoogvenster Kolommen toewijzen, lees de notatie van verbindingslijnen en hoe ze om tabellen heen worden gerouteerd, werk met N:M- en identificerende relaties en bekijk wat nieuwe kolommen met refererende sleutel van hun sleutel overnemen en hoe ze worden benoemd.
---

# Relaties bewerken

Relaties worden getekend via het contextmenu van het canvas, de canvaswerkbalk, [Snel zoeken](./quick-search.md#what-the-palette-lists) of met een sneltoets — zie [Beginnen met bewerken](./editing-start.md).  
Deze pagina beschrijft wat je met een relatie kunt doen zodra die bestaat, hoe [Kolommen toewijzen](#map-columns) een relatie laat eindigen op kolommen die de kindtabel al heeft en hoe de kolommen met refererende sleutel worden benoemd die een relatie toevoegt.

## Verwijderen {#deletion}

Verwijderen kan via het contextmenu van de relatie.

![De relatie van products naar reviews verwijderen via haar contextmenu](/img/demo-relationship-remove.webp)

Er is daarvoor geen sneltoets, omdat een relatie niet wordt geselecteerd zoals een tabel of een memo: `Delete` en `Backspace`, die verwijderen wat geselecteerd is, verwijderen een relatie nooit afzonderlijk — zie [Tabellen en memo's verwijderen](./table-related-functions.md#table-and-memo-deletion).  
Relaties worden ook verwijderd samen met wat ze verbinden: als je een tabel verwijdert, wordt elke relatie verwijderd die op die tabel aansluit, en als je een kolom verwijdert, elke relatie die die kolom gebruikt.

## Type wijzigen {#type-change}

Wijzigen kan via `Relationship Type` in het contextmenu van de relatie.  
Er worden vier typen aangeboden, en het huidige type is gemarkeerd met een vinkje:

- Zero One
- Zero N
- One Only
- One N

![Een relatie in haar contextmenu wijzigen van Zero N naar One Only en daarna One N](/img/demo-relationship-type.webp)

Dit zijn dezelfde vier typen waarmee je een relatie begint, elk met een eigen sneltoets — zie [Beginnen met bewerken](./editing-start.md).

## ON DELETE en ON UPDATE {#on-delete-and-on-update}

Instellen gaat via `On Delete` en `On Update` in het contextmenu van de relatie, tussen `Relationship Type` en `Map Columns`.  
Beide bieden dezelfde zes items, en het huidige item is gemarkeerd met een vinkje:

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

`Not set` schrijft geen clausule, dus geldt het standaardgedrag van de database zelf. Een nieuwe relatie, getekend of gemaakt in [Kolommen toewijzen](#map-columns), begint met beide op `Not set`, en door later `Not set` te kiezen, wis je een actie.  
De twee staan los van elkaar: als je de ene wijzigt, blijft de andere ongewijzigd.  
De verbindingslijn toont wat er is ingesteld — zie [Een verbindingslijn lezen](#reading-a-connector).  
Een relatie die samen met haar tabellen wordt gekopieerd en geplakt of gedupliceerd, behoudt beide acties, en bij het importeren van Schema SQL, DBML of AML komen de acties mee die het bestand declareert — zie [Bestanden importeren of exporteren](./file-import-export.md).

![ON DELETE CASCADE en ON UPDATE RESTRICT instellen op de relatie van orders naar order_items via haar contextmenu, waarna het label D:C U:R toont, en daarna de aanwijzer erboven houden om beide terug te lezen](/img/demo-referential-actions.webp)

Elke actie kan worden gekozen, ongeacht de database.  
Een actie die de geselecteerde [database](./table-related-functions.md#databases) in de Schema SQL weglaat, krijgt ernaast een aantekening in een gedempte kleur, zoals `not in MySQL`. `Not set` krijgt er nooit een, en als je van database wisselt, worden de aantekeningen bijgewerkt.  
Een actie met een aantekening wordt nog steeds in de relatie opgeslagen: de verbindingslijn toont haar en JSON, DBML en AML behouden haar, maar de Schema SQL van die database laat de clausule weg, dus geldt het standaardgedrag van de database.

[Schema SQL](./schema-sql.md) schrijft deze acties en laat de rest weg:

| Database | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | geen |
| PostgreSQL | alle vijf | alle vijf |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | alle vijf | alle vijf |

De Schema SQL van Snowflake schrijft ook een opmerking die elke weggelaten actie noemt — zie [Referentiële acties](./schema-sql.md#referential-actions).

Welke acties de ORM-doelen van de Codegenerator schrijven, hangt af van zowel het doel als de geselecteerde database — zie [Codegenerator](./code-generator.md#on-delete-and-on-update).

## Kolommen toewijzen {#map-columns}

Het dialoogvenster Kolommen toewijzen koppelt de sleutel van de oudertabel aan kolommen van de kindtabel, één rij per sleutelkolom.  
Elke rij gebruikt een kolom die de kindtabel al heeft of voegt een nieuwe kolom met refererende sleutel toe, zodat een relatie kan eindigen op kolommen die al bestaan.

![Een Zero N-relatie van members naar orders tekenen, Map to existing columns kiezen en id toewijzen aan de bestaande kolom member_id](/img/demo-map-columns.webp)

Het dialoogvenster opent op twee manieren:

- Tijdens het tekenen van een relatie, via `Map to existing columns` naast de kindtabel — zie [Relaties maken](./editing-start.md#relationship-creation). `Map` voegt dan een relatie toe van het type dat wordt getekend.
- Via `Map Columns` in het contextmenu van de relatie, om de kolommen van een bestaande relatie te wijzigen. `Save` schrijft dan de wijziging. Een editor in alleen-lezenmodus opent geen contextmenu van een relatie, dus Kolommen toewijzen kan daar niet worden geopend.

De ondertitel van het dialoogvenster noemt de twee tabellen en het relatietype, zoals `users → posts · One N`. Het type wordt hier getoond maar niet gewijzigd — gebruik [Type wijzigen](#type-change).

In het hele dialoogvenster, inclusief de notities en regels onder de rijen en de melding waarmee het sluit, worden tabellen en kolommen genoemd zoals de [naamweergave](./logical-names.md#beyond-the-canvas) ze noemt.  
Drie dingen blijven fysiek: elk gegevenstype, dat dat van de kolom zelf is en nooit de naam van haar domein; `New column: <name>`, dat de naam toont die de nieuwe kolom krijgt; en de rijen die bij `Map` vooraf zijn ingevuld, die op naam worden gekoppeld, nooit op logische naam.

`References` kiest de sleutel waarnaar de relatie verwijst: `Primary Key`, met de bijbehorende kolommen in tabelvolgorde, en daarna `Unique: <column>` voor elke kolom die als `Unique` is gemarkeerd. Dit veld wordt alleen getoond als er meer dan één keuze is.  
Een unieke index telt hier niet als sleutel, en een kolom met `Unique` die de hele primaire sleutel vormt, wordt niet twee keer vermeld.  
Als je een andere sleutel kiest, worden de rijen opnieuw opgebouwd. Een rij behoudt haar keuze zolang die kolom nog in de kindtabel staat.

Onder de kopjes `Referenced column` en `Foreign key column` toont elke rij een kolom van de sleutel met het gegevenstype ervan, en een lijst met kolommen van de kindtabel om die kolom aan te koppelen:

- `Pick a column` laat de rij leeg.
- `New column: <name>` voegt een nieuwe kolom met refererende sleutel toe. De getoonde naam is de naam die de kolom krijgt, zoals beschreven in [Namen van kolommen met refererende sleutel](#foreign-key-column-names), genummerd ten opzichte van de kolommen van de kindtabel en de andere rijen die een nieuwe kolom toevoegen. Deze optie wordt niet aangeboden als de naam leeg zou zijn, zoals bij een sleutel zonder naam.
- Elke kolom van de kindtabel, als `<name> (<data type>)`. Een kolom die een andere rij heeft gekozen, toont `<name> (<data type>) · in use` en kan niet worden gekozen, zodat geen twee rijen dezelfde kolom delen. Een kolom die een andere relatie al gebruikt, kan nog wel worden gekozen, zodat een kolom zoals een gedeelde `tenant_id` meerdere relaties kan bedienen.

Bij `Map` is een rij alleen vooraf ingevuld als precies één kolom van de kindtabel, ongeacht het hoofdlettergebruik, de naam heeft die een nieuwe kolom met refererende sleutel voor die rij zou krijgen vóór een eventuele nummering met `_2`, zoals `users_id` voor `id` op `users` en `member_id` voor `member_id`. Zolang [`Bracket`](./schema-sql.md#database-and-bracket) op `None` staat, de standaardwaarde, telt ook de naam die is gevormd uit het tabeldeel van een tabelnaam met schemanaam, dus `id` op `public.users` wordt gekoppeld aan `public.users_id` of `users_id`. Bij een sleutel met `Unique` telt ook de eigen naam van de sleutelkolom, dus `vin` wordt gekoppeld aan `vin`. Elke andere rij begint op `Pick a column`.  
Bij `Save` begint elke rij op de kolom die de relatie nu gebruikt. In beide gevallen vult het kiezen van een andere sleutel bij `References` de lege rijen van die sleutel op basis van dezelfde namen.

Als het gegevenstype van een gekozen kolom verschilt van het type dat de ouderkolom aan een refererende sleutel geeft, meldt een aantekening onder de rij dat.  
Als [Gegevenstypen via relaties synchroniseren](./settings.md#relationship-datatype-sync) aanstaat en de ouderkolom een gegevenstype heeft, toont de aantekening `<column> becomes <type>`, het type dat de toewijzing zal schrijven. Anders toont ze `Types differ: <parent type> and <child type>`, en blijft het type van de kolom ongewijzigd.

`Map` of `Save` blijft uitgeschakeld zolang er iets in de weg staat, en een regel onder de rijen zegt wat:

- `Pick a foreign key column for every referenced column`: een rij is nog leeg.
- `At least one column must reference a different column`: een zelfverwijzende relatie waarin elke rij haar eigen ouderkolom kiest.
- `These columns are already linked by another relationship`: een andere relatie tussen dezelfde twee tabellen verbindt precies deze kolommen.
- `<parent> has no key to reference`: bij `Map` heeft de oudertabel geen primaire sleutel en geen kolom met `Unique`.

`Save` blijft ook uitgeschakeld tot de toewijzing verschilt van de huidige toewijzing van de relatie.  
Bij `Save` toont een rij `(removed)` als de kolom ervan uit haar tabel is verdwenen. Kies een andere kolom van de kindtabel, of kies bij een ouderkolom die verdwenen is een sleutel bij `References`. Bij `Map` gaat een rij waarvan de gekozen kolom wordt verwijderd, terug naar `Pick a column`.

Een relatie waarvan de ouderkolommen niet precies een van de sleutels van de oudertabel vormen, opent op een extra keuze aan het eind van `References`, `Current columns (not a key)`, die deze kolommen laat zoals ze zijn. Als de oudertabel helemaal geen sleutel heeft, is dat de enige keuze en wordt `References` niet getoond.  
Daar is de regel `The referenced columns are not a key of <parent>`, of `<parent> has no key to reference` als de oudertabel helemaal geen sleutel heeft, een melding en geen fout: `Save` werkt nog steeds, dus je kunt de kolommen van de kindtabel wijzigen en de verwijzing behouden.  
Een relatie waarvan de twee kolomlijsten niet kunnen worden gekoppeld, bijvoorbeeld omdat ze verschillend lang zijn, toont rijen met `(invalid)` en houdt `Save` uitgeschakeld tot je een sleutel kiest bij `References`, of een primaire sleutel of kolom met `Unique` aan de oudertabel toevoegt als die er geen heeft.

Het dialoogvenster volgt het diagram zolang het open is, inclusief de bewerkingen van een medebewerker of een codeeragent, en behoudt wat je hebt gekozen.  
Als de kolommen van de relatie of de sleutel waarop het dialoogvenster opende intussen veranderen, voegt het de regel `This relationship changed while the dialog was open` toe.

Wat `Map` en `Save` schrijven:

- `Map` voegt de relatie toe met `On Delete` en `On Update` op `Not set`. `Save` wijzigt alleen de kolommen van de relatie, laat de ouderkant verwijzen naar de sleutel die bij `References` is gekozen, en behoudt het type en de ON DELETE en ON UPDATE ervan.
- Een rij met `New column` voegt een kolom toe aan het eind van de kindtabel, zoals tekenen dat doet: `NOT NULL`, benoemd naar de sleutel, met het gegevenstype, de standaardwaarde, de opmerking, de logische naam en het domein van de sleutel — zie [Identificerende relaties](#identifying-relationships).
- De naam van een gekozen kolom wordt nooit gewijzigd en de kolom wordt nooit aan het domein van de sleutel gekoppeld, en `Not Null`, primaire sleutel, `Unique`, standaardwaarde, opmerking en logische naam van de kolom blijven zoals ze zijn. Het gegevenstype verandert alleen zolang `Relationship DataType Sync` aanstaat en de ouderkolom een gegevenstype heeft: de kolom krijgt het type dat de ouderkolom aan een refererende sleutel geeft, bij een serial-sleutel het integertype zoals bij een nieuwe kolom, en de wijziging zet zich voort langs de relaties zoals de synchronisatie dat doet. Elke kolom waarvan de wijziging het type aanpast, gekozen of langs de relaties bereikt, wordt van haar [domein](./dictionary.md#domains-and-data-types) ontkoppeld wanneer haar nieuwe type afwijkt van dat van het domein.
- Een kolom die de toewijzing niet meer gebruikt, blijft in de kindtabel en is niet langer als refererende sleutel gemarkeerd, tenzij een andere relatie er nog op eindigt.
- Alles wat één `Map` of `Save` schrijft — inclusief nieuwe kolommen, typewijzigingen en het ontkoppelen van domeinen — is één stap in de geschiedenis.

Of de relatie identificerend is en hoe het ouderuiteinde wordt getekend, wordt zoals bij elke relatie afgeleid uit de toegewezen kolommen van de kindtabel. Toewijzen aan de kolommen van de primaire sleutel van de kindtabel maakt de relatie meteen identificerend, en toewijzen aan een kolom die `NULL` toestaat, zet een ring op het ouderuiteinde — zie [Een verbindingslijn lezen](#reading-a-connector).  
De refererende sleutel in Schema SQL verwijst naar de sleutel die je hebt gekozen, zoals `REFERENCES vehicle (vin)` voor een sleutel met `Unique`.

Als het diagram de toewijzing al bevat wanneer je op `Map` of `Save` drukt, omdat een medebewerker of een codeeragent je voor was, wordt er niets geschreven.  
Als het zo is gewijzigd dat de toewijzing niet meer past, wordt er niets geschreven en verschijnt de melding `Couldn't map columns: the diagram changed`.

`Cancel`, de knop `x`, `Escape` of een klik op het gedimde gebied buiten het dialoogvenster sluit het zonder iets te schrijven.  
Het gedimde gebied bedekt de hele editor, inclusief de werkbalk, en een geopende [Verkenner](./explorer.md#dialogs-beside-it) blijft eronder open.  
Ook het openen van Snel zoeken sluit het dialoogvenster, net als het verlaten van het ERD-tabblad of het overschakelen van de editor naar alleen-lezen.  
`Ctrl + F` (Windows/Linux) of `⌘ + F` (Mac) sluit het ook en zet de tekstcursor in het zoekveld van de [zoekfunctie](./find-and-replace.md#opening-and-closing) van de Verkenner, waarbij de Verkenner wordt geopend als die gesloten is. In een editor die te smal is om de Verkenner te tonen, sluit de sneltoets het dialoogvenster nog steeds, maar toont hij een melding in plaats van de tekstcursor te verplaatsen — zie [Openen en sluiten](./explorer.md#opening-and-closing).  
Als een van de tabellen ervan of de relatie wordt verwijderd terwijl het dialoogvenster open is, sluit het met een melding zoals `Map Columns closed: the relationship was removed`.  
Zolang het open is, doen de sneltoetsen van het canvas, ongedaan maken/opnieuw uitvoeren en kopiëren/plakken niets.

Een codeeragent heeft geen tool voor Kolommen toewijzen. De agent wijst een relatie opnieuw toe door haar te verwijderen met `erd_remove_relationship`, die de kolommen met refererende sleutel behoudt, en haar opnieuw te tekenen op bestaande kolommen met `erd_link_columns`, beide in één `erd_batch` — zie [Tools](../../mcp/tools.md#relationships).

## N:M-relaties {#nm-relationships}

Omdat de editor op het fysieke model is gebaseerd, wordt een N:M-relatie uitgedrukt met een koppeltabel, zoals hieronder te zien is.

![Met ⌘ + ⌥ + 2 relaties tekenen van products en daarna tags naar de lege tabel product_tags, waarbij product_id en daarna tag_id worden toegevoegd](/img/demo-relationship-n-m.webp)

Als de koppeltabel haar sleutelkolommen al heeft, zoals `product_id` en `tag_id` op `product_tags`, teken dan elke relatie met `Map to existing columns` en kies die kolommen in plaats van nieuwe toe te voegen — zie [Kolommen toewijzen](#map-columns). Als ze de primaire sleutel van de koppeltabel vormen, is elke relatie meteen identificerend.

Het importeren van GraphQL, DBML of AML maakt de koppeltabel voor je aan.  
Een veel-op-veeldeclaratie komt binnen als een tabel met de naam `<left>_<right>`, met de opmerking `Junction table inferred from <left> <-> <right>`, die met identificerende relaties aan beide kanten is verbonden.  
Zie [Bestanden importeren of exporteren](./file-import-export.md).

## Identificerende relaties {#identifying-relationships}

Wanneer je een relatie tekent door op de kindtabel te klikken of met `Create new columns`, wordt elke primaire sleutel van de oudertabel naar de kindtabel gekopieerd als kolom met refererende sleutel die `NOT NULL` is, zodat een nieuwe relatie niet-identificerend begint.  
De kopie neemt het gegevenstype, de standaardwaarde, de opmerking en de logische naam van de sleutel over, maar niet `Unique` of `Auto Increment`, en krijgt een naam zoals beschreven in [Namen van kolommen met refererende sleutel](#foreign-key-column-names).  
Een serial-sleutel is de uitzondering voor het gegevenstype: de kopie ervan krijgt het integertype dat de serial opslaat. Bij elke database geven `smallserial` en `serial2` `smallint`, geeft `serial4` `integer` en geven `bigserial` en `serial8` `bigint`. Een losse `serial` geeft `integer` bij PostgreSQL en `bigint unsigned` bij MySQL en MariaDB, en blijft `serial` bij elke andere database.  
Alleen de volledige typenaam telt, ongeacht het hoofdlettergebruik, dus `serial(4)` wordt gekopieerd zoals het is geschreven. Een type in hoofdletters geeft hoofdletters: `SERIAL` geeft `INTEGER` bij PostgreSQL. Een kolom met refererende sleutel die in een opgeslagen diagram al het type `serial` heeft, behoudt dat type.  
De kopie wordt ook gekoppeld aan het [domein](./dictionary.md#domains-and-data-types) van de sleutel, mits het blad `Domains` dat domein bevat wanneer de kopie wordt gemaakt en de kopie het gegevenstype van de sleutel behoudt. Een kopie van een serial-sleutel die een integertype krijgt, koppelt dus geen domein, terwijl een losse `serial` die `serial` blijft, het wel koppelt.  
Om de relatie identificerend te maken, stel je die kolommen met refererende sleutel in de kindtabel in als primaire sleutels: selecteer ze allemaal en druk één keer op `Alt + K` (Windows/Linux) of `⌥ + K` (Mac), of kies in het contextmenu van de tabel `Primary Key`, dat `Primary Key on selected columns` toont zolang er twee of meer zijn geselecteerd — zie [Primaire sleutel van een kolom](./table-editing.md#column-primary-key).

![Met Alt + K product_id als primaire sleutel in- en uitschakelen, waardoor de verbindingslijn eerst doorgetrokken en daarna onderbroken wordt](/img/demo-identifying-relationship.webp)

De editor houdt dit zelf bij.  
Een relatie is identificerend zolang elke kolom aan de kindkant een primaire sleutel is, en wordt niet-identificerend zodra een ervan dat niet is.

## Namen van kolommen met refererende sleutel {#foreign-key-column-names}

Bij het tekenen van een relatie wordt elke kolom met refererende sleutel die wordt toegevoegd, vernoemd naar de sleutel van de oudertabel die die kolom kopieert:

- Een sleutelnaam van één woord, zoals `id`, `ID` of `uuid`, krijgt de naam van de oudertabel en een underscore ervoor: `id` op `products` wordt `products_id`.
- Een sleutelnaam van meerdere woorden, zoals `member_id`, `userId` of `UserID`, blijft ongewijzigd.
- Een sleutelnaam van één woord die, ongeacht het hoofdlettergebruik, gelijk is aan de naam van de tabel zelf, blijft ook ongewijzigd: `currency` op `currency` blijft `currency`. Een sleutel die de naam van de tabel alleen als onderdeel bevat, krijgt toch het voorvoegsel: `username` op `user` wordt `user_username`.

Een naam is één woord als hij alleen letters en cijfers bevat, zonder wisseling in hoofdlettergebruik.  
Elk ander teken splitst de naam, dus `_id`, `order no` en `order-no` zijn meerdere woorden.  
Ook een wisseling in hoofdlettergebruik splitst de naam, gelezen zoals bij camelCase: een kleine letter gevolgd door een hoofdletter (`userId`), twee hoofdletters gevolgd door een kleine letter (`IDCard`, `IDs`) of een letter uit een schrift zonder hoofdletters, zoals Hangul, kana of Han, naast een letter uit een schrift met hoofdletters (`회원ID`).  
Cijfers splitsen een woord niet, dus `id2` en `SHA256` zijn één woord. Een samenstelling die helemaal in kleine letters of helemaal in hoofdletters is geschreven, is ook één woord: `memberid` op `members` wordt `members_memberid`.

De tabelnaam wordt gebruikt zoals hij is geschreven, afgezien van spaties eromheen: het hoofdlettergebruik, de spaties erbinnen en de punten blijven behouden, de naam wordt niet in het enkelvoud gezet en `Table Name Case` en `Column Name Case` van de Codegenerator spelen geen rol. `Users` met de sleutel `ID` geeft `Users_ID`.  
Elke kolom van een samengestelde sleutel wordt afzonderlijk benoemd: `orders` met de sleutel (`tenant_id`, `id`) voegt `tenant_id` en `orders_id` toe.

Een naam die de kindtabel al heeft, ongeacht het hoofdlettergebruik, wordt genummerd met `_2`, `_3` enzovoort, waarbij het eerste vrije nummer wordt genomen.  
Een tweede relatie vanuit `users`, met de sleutel `id`, naar dezelfde tabel voegt `users_id_2` toe, en een zelfverwijzing op `members`, met de sleutel `member_id`, voegt `member_id_2` toe.  
De kolommen van één samengestelde sleutel worden op dezelfde manier ten opzichte van elkaar genummerd, en een naam die ongewijzigd blijft, neemt als eerste zijn plaats in: `user` met de sleutel (`id`, `user_id`) voegt `user_id` toe voor `user_id` en `user_id_2` voor `id`.

Bij een oudertabel zonder naam blijft de sleutelnaam ongewijzigd, en bij een conflict wordt die net als elke andere naam genummerd.  
Een sleutel zonder naam geeft een kolom met refererende sleutel zonder naam.  
Dat geldt ook voor de primaire sleutel die de editor toevoegt aan een oudertabel die er geen heeft, tenzij je die een naam geeft voordat je op de kindtabel klikt.

De namen worden vastgelegd wanneer de relatie wordt getekend. Als je later de naam van de oudertabel of van haar sleutel wijzigt, veranderen ze niet mee.  
De rijen met `New column` van [Kolommen toewijzen](#map-columns) krijgen namen volgens dezelfde regels, en de lijst toont elke naam voordat je die kiest.  
Relaties die binnenkomen terwijl hun kolommen al bestaan — via een import, plakken, dupliceren of het dialoogvenster Kolommen toewijzen dat bestaande kolommen koppelt — behouden de namen die die kolommen hebben.  
Een codeeragent die een relatie toevoegt met `erd_add_relationship`, krijgt dezelfde namen, gegevenstypen, logische namen en domeinen — zie [Tools](../../mcp/tools.md#relationships).

Een kolom met refererende sleutel wordt vernoemd naar haar sleutel, nooit naar de logische naam die ze overneemt, en haar naam geldt als een naam die je zelf hebt ingevoerd: een logische naam die later voor de kolom wordt ingevoerd, laat de naam zoals hij is, tenzij de naam leeg is — zie [Eigen namen](./dictionary.md#names-of-your-own).  
Zolang de overgenomen logische naam overeenkomt met een term die een andere naam oplevert, vermeldt het blad `Checks` de kolom daarom onder [`Physical name mismatch`](./dictionary.md#what-each-check-finds). Als je haar fysieke naam opnieuw afleidt, krijgt ze de naam uit de woordenboeken, tenzij een andere kolom van de kindtabel die naam al heeft, ongeacht hoofdlettergebruik — zie [Fysieke namen opnieuw afleiden](./dictionary.md#derive-physical-names-again).

## Een verbindingslijn lezen {#reading-a-connector}

- Een identificerende relatie wordt getekend als een doorgetrokken lijn, een niet-identificerende als een onderbroken lijn.
- Het kinduiteinde draagt het kardinaliteitssymbool van het relatietype: een ring en een streep voor Zero One, een ring en een kraaienpoot voor Zero N, twee strepen voor One Only en een streep en een kraaienpoot voor One N.
- Het ouderuiteinde is een ring en een streep, zoals bij Zero One, als een van de kolommen met refererende sleutel `NULL` toestaat, en twee strepen, zoals bij One Only, als ze allemaal `NOT NULL` zijn.
- Als je de aanwijzer boven een verbindingslijn houdt, wordt die gemarkeerd samen met de kolommen die de lijn in beide tabellen verbindt.

![De aanwijzer achtereenvolgens boven drie verbindingslijnen houden, die elk oplichten samen met de kolommen die ze verbinden](/img/demo-relationship-hover.webp)

Een relatie die [ON DELETE of ON UPDATE](#on-delete-and-on-update) instelt, heeft een label naast het kinduiteinde, zoals `D:C U:R`: `D:` en de actie voor ON DELETE, daarna `U:` en de actie voor ON UPDATE, elk alleen als die is ingesteld.  
De acties worden afgekort volgens de notatie van erwin: `C` voor CASCADE, `R` voor RESTRICT, `SN` voor SET NULL, `SD` voor SET DEFAULT en `NA` voor NO ACTION. Een relatie die geen van beide instelt, heeft geen label.  
Het label staat aan de kant die van de kindtabel af ligt, boven de lijn als de verbindingslijn de linker- of rechterkant van die tabel verlaat en rechts ervan als ze de boven- of onderkant verlaat, vrij van het kardinaliteitssymbool.  
Het wordt getekend in de kleur van de verbindingslijn op een klein vak in de achtergrondkleur van het canvas, en licht samen met de verbindingslijn op. Labels worden boven op elke verbindingslijn getekend, dus een lijn die een label kruist, loopt eronderdoor.  
Het toont de actie die in de relatie is opgeslagen, ongeacht wat de geselecteerde database schrijft, dus ON DELETE SET DEFAULT toont bij MySQL nog steeds `D:SD`.

Als je de aanwijzer boven een verbindingslijn houdt die een van beide acties instelt, verschijnt ook een knopinfo die de clausules voluit schrijft, één per regel, zoals `ON DELETE CASCADE` en `ON UPDATE RESTRICT`.  
De knopinfo verschijnt ook als het label verborgen is.

Naar een relatie gaan laat haar oplichten: als je in de [Verkenner](./explorer.md#going-to-a-row) een rij onder de map `Foreign Keys` van een tabel kiest, of een rij van een refererende sleutel in de [Verschilweergave](./table-related-functions.md#going-to-a-change), worden de verbindingslijn en het label ervan getekend in de kleur bij aanwijzen. In de Verschilweergave licht de verbindingslijn op aan elke kant die de relatie bevat, dus een toegevoegde refererende sleutel licht alleen aan de huidige kant op en een verwijderde alleen aan de opgeslagen kant.  
De sprong selecteert alleen de kindtabel, samen met haar kolommen met refererende sleutel, met de focus op de cel van de eerste ervan; de relatie zelf wordt nog steeds nooit geselecteerd. Zie [Waar een sprong terechtkomt](./table-related-functions.md#where-a-jump-lands) voor waar de weergave naartoe gaat.  
Het oplichten verdwijnt bij de volgende druk op de linker- of rechtermuisknop op het canvas, of dat nu op een lege plek, een tabel, een memo, een tabelgroep of een verbindingslijn is, zelfs bij een druk die de selectie ongewijzigd laat. Ook naar een andere rij of zoekovereenkomst gaan in de Verkenner laat het verdwijnen, net als naar een andere rij gaan in de Verschilweergave, aan elke kant waar die rij naartoe gaat.  
Pannen met de middelste muisknop of het handgereedschap laat het oplichten intact, net als een rij samenvouwen of uitvouwen in de Verkenner of de Verschilweergave, de selectie opheffen met `Escape` en een sprong vanuit [Snel zoeken](./quick-search.md) of de [kaartknop](./visualization.md#card-buttons) voor een externe link in de stroomweergave.  
Het oplichten wordt niet opgeslagen en staat niet in de geschiedenis, en medebewerkers zien het niet.

In een editor met [`readonly`](../../api/erd-editor-element.md#readonly) laat de aanwijzer ook verbindingslijnen oplichten, in plaats van het licht dat een sprong achterliet. Rust hij op een tabel, dan licht hij elke verbindingslijn van die tabel op in de kleur bij aanwijzen totdat hij van de tabel af beweegt.  
Een klik die niet beweegt, laat een licht aan tot de volgende zulke klik: op een tabel licht hij de verbindingslijnen van die tabel op, op een verbindingslijn die verbindingslijn, en overal anders niets. Een sleepbeweging daar pant het canvas en laat dat licht zoals het was.

Verberg verbindingslijnen op het ERD-canvas met de weergaveoptie `Relationship`, of alleen hun labels met de weergaveoptie `Referential Actions`, die standaard aanstaat — zie [Weergaveopties voor tabellen](./table-related-functions.md#table-view-options).  
Bij `70%` en lager, waar tabellen tot hun naam inklappen, worden geen labels getekend.  
Een [export als afbeelding](./file-import-export.md#image) wordt altijd op 100% getekend, dus de labels worden getekend ongeacht het zoomniveau van het canvas, tenzij een weergaveoptie ze verbergt. Als `Background` uitstaat, is ook het vak achter elk label transparant.  
[Stroommodus](./visualization.md#flow-mode) op het tabblad Visualisatie tekent verbindingslijnen zelfs als `Relationship` uitstaat, elk als één vloeiende, doorgetrokken grijze curve met dezelfde eindsymbolen, dus de onderbroken lijn, de labels, de knopinfo, het oplichten na een sprong en de orthogonale routering die op deze pagina worden beschreven, gelden alleen voor het ERD-canvas. Een relatie van een tabel naar zichzelf buigt ook in de stroomweergave om de rechterbovenhoek — zie [Routering van verbindingslijnen](#connector-routing).

## Routering van verbindingslijnen {#connector-routing}

Verbindingslijnen worden orthogonaal gerouteerd, en hun hoeken zijn afgerond.  
Een route gaat om de tabellen in de weg heen in plaats van erdoorheen. Waar elke route met een paar bochten tussen de twee uiteinden een tabel zou kruisen, zoals in een druk diagram, neemt de verbindingslijn een omweg met zoveel bochten als nodig is. Alleen waar geen omweg wordt gevonden, kruist hij nog een tabel.  
Een verbindingslijn verlaat zijn twee tabellen vanaf een paar zijden die naar elkaar toe wijzen waar die er zijn, en elk uiteinde verlaat zijn tabel met een kort recht stuk voordat het afbuigt, zodat twee tabellen op korte afstand van elkaar waarvan de uiteinden van de verbindingslijn op één lijn liggen, worden verbonden door één rechte lijn in plaats van een omweg.  
Twee tabellen die naar elkaar toe wijzen en dichterbij staan dan dat, zelfs minder dan `40px` van elkaar, behouden hun zijden die naar elkaar wijzen, en waar hun uiteinden niet op één lijn liggen, maakt de verbindingslijn een zijsprong over de ruimte ertussen in plaats van onder een van beide tabellen door te lopen.  
Routes die dezelfde kant van een tabel verlaten, worden over aparte corridors verdeeld, zodat ze niet over elkaar heen lopen.  
Alleen tabellen worden ontweken: een verbindingslijn mag een memo of het kader van een tabelgroep kruisen, en wordt boven tabelgroepen en onder tabellen en memo's getekend.

Een relatie van een tabel naar zichzelf wordt getekend als één curve om de rechterbovenhoek van de tabel, die bij het ouderuiteinde de bovenkant verlaat en bij het kinduiteinde de rechterkant binnengaat.  
Verdere zelfverwijzingen op dezelfde tabel worden buiten de eerste genest, zodat hun curves elkaar en de tabel niet kruisen.

Er valt niets in te stellen.  
Routes worden automatisch opnieuw berekend wanneer er iets op het canvas wordt verplaatst of van grootte verandert, zodat je ze nooit met de hand hoeft aan te passen.  
Terwijl je sleept, volgen de verbindingslijnen van de tabellen die je verplaatst hen, en elke andere verbindingslijn behoudt de route die hij had toen het slepen begon. Als je loslaat, wordt elke verbindingslijn die de verplaatsing opnieuw routeert, opnieuw getekend, zoals een die nu om een tabel heen gaat die in zijn weg is neergezet, of een die rechttrekt zodra een tabel van zijn pad af is verplaatst.

Een diagram tekent dezelfde routes in elk venster dat het in dezelfde naamweergave toont: een dat openbleef terwijl de tabellen verschoven, een dat het diagram net opende, en dat van een medebewerker evengoed, en een [geëxporteerde afbeelding](./file-import-export.md#image) tekent ze ook. De naamweergave telt mee omdat ze verandert hoe breed de tabellen zijn — zie [Naamweergave](./logical-names.md#name-view).

![De tabel members omlaag en weer terug slepen terwijl de verbindingslijn vanaf orders wisselt tussen rechts langs categories en links eromheen, met elke hoek afgerond](/img/demo-connector-routing.webp)
