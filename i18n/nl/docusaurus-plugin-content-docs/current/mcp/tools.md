---
sidebar_position: 4
description: Elke tool die de MCP-server van erd-editor biedt — een document pagina voor pagina lezen, de woordenboekcontroles, de 67 bewerkingstools, erd_batch en hoe een resultaat en een weigering eruitzien.
---

# Tools

De server biedt 77 tools: vijf sessietools, vier leestools, 67 bewerkingstools, één per soort bewerking, en `erd_batch`, die meerdere bewerkingstools als één bewerking uitvoert.

Elke tool behalve `erd_list_documents` krijgt het `path` van het document als eerste argument, en de tabellen hieronder laten het weg.
Een argument met `?` is optioneel.

## Sessietools {#session-tools}

| Tool | Argumenten | Wat het doet |
| --- | --- | --- |
| `erd_list_documents` | | Toont ERD-documenten met `path`, `open`, `active`, `dirty` en `readonly`: die van de editor die de werkmap bedient, wat in een JetBrains-IDE elk geopend project omvat, en anders de ERD-bestanden onder de werkmap. |
| `erd_open_document` | `create?` | Opent een document om te bewerken, in de ERD Editor van de editor die het bedient, als die er is. Met `create` wordt het bestand eerst aangemaakt als het ontbreekt, en een naam zonder extensie krijgt `.erd.json`. |
| `erd_save` | | Slaat een document op dat een editor beheert. In VS Code blijven de bewerkingen van de agent niet opgeslagen tot deze tool wordt aangeroepen; Obsidian en een JetBrains-IDE slaan ze op zoals ze die van jou opslaan, en deze tool schrijft ze direct weg. In headless-modus is elke bewerking al weggeschreven, zoals `saved: true` in het resultaat ervan aangeeft, en doet deze tool niets. |
| `erd_undo` | | Maakt de laatste bewerking van deze agent ongedaan, nooit die van jou. Aanroepen die geen stap in de geschiedenis hebben opgeleverd, worden overgeslagen en genoemd. |
| `erd_redo` | | Voert de bewerking die `erd_undo` het laatst ongedaan heeft gemaakt opnieuw uit. |

Zie [Live en headless](./live-and-headless.md) voor wat opslaan en ongedaan maken in elke modus doen.

## Een document lezen {#reading-a-document}

| Tool | Argumenten | Wat het doet |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | De instellingen en aantallen, daarna een pagina tabellen met hun indexen en relaties, elke tabel met haar id, positie en grootte op het canvas, aantal kolommen, logische naam als ze er een heeft en tabelgroep als ze in een groep zit. Tenzij er wordt gezocht, volgen na de tabellen de tabelgroepen, de memo's en daarna de domeinen, termen en woorden. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?`, `wordIds?`, `termIds?`, `domainIds?` | De genoemde entiteiten, volledig: tabellen met hun kolommen en hun tabelgroep, relaties met hun kolommen en hun `onDelete` en `onUpdate`, indexen met hun kolommen, memo's met hun tekst, tabelgroepen met hun tabellen, en woorden, termen en domeinen met elk veld. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `logicalNameAsComment?`, `tableIds?`, `tableNames?`, `groupNames?` | Het hele document in één keer in een van vier formaten, of de DDL van alleen enkele tabellen of tabelgroepen. |
| `erd_list_checks` | `level?`, `tableIds?`, `tableNames?`, `offset?`, `limit?` | Wat er volgens de woordenboeken met woorden, termen en domeinen niet klopt, zoals het blad `Checks` van het tabblad Woordenboek van de editor het toont, pagina voor pagina. Wijzigt niets — zie [Woordenboekcontroles](#dictionary-checks). |

Een agent vindt id's met `erd_list`, leest kolommen, woordenboekrijen en andere details met `erd_get` en geeft die id's door aan de bewerkingstools.
De grootte van een tabel in `erd_list` is het kader dat ze op het canvas inneemt: de hoogte exact, de breedte bij benadering.
Een tabelgroep wordt vermeld met de rechthoek die hij opslaat, met zijn naam, zijn kleur en het aantal tabellen dat hij bevat.
Elke relatie wordt één keer vermeld, bij een van haar twee tabellen.
Een woordenboekrij wordt vermeld met haar id, haar `name` en wat ze aan een fysieke naam of een kolom geeft: het `dataType` van een domein, de `physicalName` en `domainId` van een term en de `abbreviation` van een woord. Elk woordenboek vermeldt zijn rijen in de volgorde die zijn blad toont.
De instellingen die `erd_list` en `erd_read` rapporteren, zijn die welke het bestand opslaat — zie [Instellingen](#settings).

In `erd_get` en het formaat `snapshot` van `erd_read` heeft elke tabel en kolom haar `logicalName`, een lege string als die er niet is, en `nameDerived`, dat `true` is zolang de woordenboeken de naam hebben gegeven, zodat een nieuwe logische naam die opnieuw afleidt — zie [Woordenboeken](#dictionaries).
Elke kolom heeft haar `domainId`, en elke term ook: een lege string als er geen is, of bij een domein dat het document niet meer vermeldt.

`erd_read` accepteert een van vier formaten:

| `format` | Wat het teruggeeft |
| --- | --- |
| `snapshot` | Compacte JSON met elke entiteit en haar id, tabelgroepen en de rijen met woorden, termen en domeinen inbegrepen, en de instellingen met de Schema SQL-scripts. Laat weg wat per kijker verschilt: gemeten breedtes, de stapelvolgorde, de weergave, het tabblad en de naamweergave. Groot bij een groot schema. |
| `sql` | DDL voor een van de acht databases: `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` of `SQLite`. `vendor` is standaard de database waarop het document is ingesteld. De DDL van het hele document bevat de scripts vóór en na de tabellen. Met `tableIds`, `tableNames` of `groupNames` alleen die tabellen, met de refererende sleutels die ze bevatten, en geen scripts. Refererende sleutels krijgen hun ON DELETE- en ON UPDATE-acties mee, behalve die welke de doeldatabase weglaat — zie [ON DELETE en ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | Het hele document precies zoals opslaan het bestand schrijft, inclusief bewerkingen die de editor nog niet heeft opgeslagen — zie [Opslagvorm en runtimewaarde](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Alleen de scripts vóór en na de tabellen van het document, als `{"before":"…","after":"…"}`, elk leeg als het niet is ingesteld, hoe groot het schema ook is. |

Alleen het formaat `sql` accepteert `vendor`, `statements`, `header`, `logicalNameAsComment`, `tableIds`, `tableNames` en `groupNames`, en een ander formaat weigert ze.

- `statements`: `create`, de standaardwaarde; `ifNotExists`, dat op MySQL, MariaDB, PostgreSQL, SQLite en Databricks `CREATE TABLE IF NOT EXISTS` schrijft en op de andere alleen `CREATE TABLE`; of `recreate`, dat de tabellen verwijdert voordat het ze aanmaakt, waarbij Snowflake in plaats daarvan `CREATE OR REPLACE TABLE` schrijft.
- `header`: `none`, de standaardwaarde; `use`, dat de database of het schema selecteert dat de databasenaam van het document aangeeft; of `createAndUse`, dat die eerst aanmaakt. Oracle kent alleen `use`, dus `createAndUse` schrijft daar `use`, en PostgreSQL kent alleen `createAndUse`, dus `use` schrijft daar geen kop. SQLite schrijft er geen, en geen enkele database schrijft er een zolang de databasenaam leeg is of geen gewone identifier is.
- `logicalNameAsComment`: `true` schrijft de logische naam van een tabel of kolom als haar opmerking zolang de opmerking leeg is of alleen witruimte bevat, waar en in de vorm waarin elke database een opmerking schrijft, en behoudt elke opmerking die tekst bevat; `false`, de standaardwaarde, schrijft geen logische naam — zie [Logische namen als opmerkingen](../guide/guides/schema-sql.md#logical-names-as-comments).
- `groupNames`: de tabellen van de genoemde tabelgroepen, op naam ongeacht hoofdlettergebruik, samengevoegd met `tableIds` en `tableNames`. Een naam die met geen enkele groep overeenkomt, wordt geweigerd met `notFound`. Een groep zonder tabellen voegt er geen toe, en een leesopdracht die helemaal geen tabel overhoudt, zoals wanneer elke genoemde groep leeg is en er geen tabel is genoemd, wordt geweigerd met `invalidArgs`.

`statements`, `header` en `logicalNameAsComment` gelden ook voor de DDL van enkele tabellen. Ze werken zoals de opties `Statements` en `Header` en de schakelaar `Write logical names into empty comments` van het tabblad [Schema SQL](../guide/guides/schema-sql.md#options-panel) in de editor, al begint het tabblad bij `If not exists` en `CREATE + USE`. De schakelaar staat aanvankelijk uit, net als `logicalNameAsComment`.
Namen worden tussen aanhalingstekens gezet met het type aanhalingstekens dat het bestand opslaat, het vergrendelde type zolang `Bracket Type` vergrendeld is — zie [Vergrendeling](../guide/guides/settings.md#lock).

### Grote schema's {#large-schemas}

Schema's met honderden of duizenden tabellen werken ook.
Een leesopdracht geeft hooguit 40.000 tekens terug, onder de grens waarboven Claude Code een toolresultaat apart in een bestand zet.

- `erd_list` geeft standaard een pagina van 100 terug, eerst de tabellen, dan de tabelgroepen, de memo's, de domeinen, de termen en de woorden, met één offset die door alles heen loopt, en geeft met `nextOffset` en een `note` aan waar de volgende pagina begint. Geef die `nextOffset` door als `offset`, met dezelfde `query`.
- `query` vindt tabellen op woorden in een tabel- of kolomnaam, logische naam of opmerking, ongeacht hoofdlettergebruik. Tabellen waarvan de namen of logische namen meer van de woorden bevatten, komen eerst. Een zoekopdracht toont geen tabelgroepen, memo's of woordenboekrijen.
- `namesOnly` toont alleen de tabelnamen, ongeveer 2.000 korte namen in één antwoord.
- `erd_get` en `erd_read` accepteren naast id's ook `tableNames`, en `erd_read` accepteert `groupNames`, zodat een agent die om een SQL-query op een groot schema wordt gevraagd, alleen de DDL leest van de tabellen die hij nodig heeft.
- Ook de woordenboeken komen in delen: `erd_list` bladert na de tabellen door hun rijen, en `erd_get` geeft rijen volledig op `domainIds`, `termIds` en `wordIds`.
- `erd_get` vermeldt id's en namen die naar niets verwijzen onder `missing`, en de id's waarvoor in één antwoord geen ruimte is onder `notReturned`, om opnieuw op te vragen.
- `erd_list_checks` antwoordt op dezelfde manier pagina voor pagina — zie [Woordenboekcontroles](#dictionary-checks).
- Een leesopdracht die te groot is voor één antwoord, wordt geweigerd met `tooLarge`, met uitleg over hoe je hem inperkt.

### Woordenboekcontroles {#dictionary-checks}

`erd_list_checks` toont de controles van het [blad Controles](../guide/guides/dictionary.md#the-checks-sheet) van de editor, in dezelfde volgorde: eerst de controles van de woorden, dan die van de termen en de domeinen, elk woordenboek in de volgorde die zijn blad toont, en daarna elke tabel, gevolgd door haar kolommen.
Net als op het blad wordt een controle alleen uitgevoerd zolang het woordenboek dat ze leest een rij bevat. Een document waarvan de woordenboeken geen woord, term of domein bevatten, wordt helemaal niet gecontroleerd: `total` is `0`, en de `note` meldt dat.

- `level`: `error` of `warning` voor alleen dat niveau; standaard beide.
- `tableIds` en `tableNames`: alleen de controles van die tabellen en hun kolommen, namen ongeacht hoofdlettergebruik, wat de eigen rijen van de woordenboeken weglaat. Een id of naam die geen tabel aanduidt, wordt geweigerd met `notFound`.
- `offset` en `limit`: standaard een pagina van 100 controles, die ook stopt waar één antwoord vol is. Zolang er meer volgen, geven `nextOffset` en een `note` aan waar de volgende pagina begint; geef die door als `offset` met dezelfde filters. Vraag na het oplossen van enkele controles de lijst opnieuw op vanaf offset `0`: een opgeloste controle verdwijnt uit de lijst, dus een latere offset zou controles overslaan die nog niet zijn opgelost.

Het antwoord bevat `total`, het aantal controles dat de filters overhouden; `counts`, hoeveel daarvan elke code heeft, zonder codes die er geen hebben; en de pagina als `checks`.
Elke controle geeft haar `level`, haar `code` en de `kind` en `id` van haar object: `table`, `column`, `word`, `term` of `domain`. Een controle van een kolom voegt daar de `tableId` van de kolom aan toe, en de naam van haar tabel als `table`.
`name` is de naam van het object, de fysieke naam van een tabel of kolom, met de `logicalName` ervan als die er is. `field` is wat de controle leest: `name`, `logicalName` of `domainId`. `text` is wat ze daar heeft gevonden, en `suggestions`, waar de woordenboeken die bieden, is wat je in plaats daarvan kunt gebruiken. Zo kan een agent een controle oplossen zonder `erd_get`:

```json
{"level":"warning","code":"physicalNameMismatch","kind":"column","id":"8e1z0q4xk2m7cwd5tfb9h3ynp","tableId":"03h17be2plxpj5n59tqag7ogj","table":"users","name":"id","logicalName":"Member Number","field":"name","text":"id","suggestions":["MBR_NO"]}
```

| `code` | `level` | `Type` op het blad | Wat het vindt |
| --- | --- | --- | --- |
| `duplicateName` | `error` | `Duplicate name` | Een naam die twee rijen van één woordenboek delen. Elk van de rijen wordt vermeld. |
| `unknownDomain` | `error` | `Unknown domain` | Een kolom of term die is gekoppeld aan een domein dat het document niet meer vermeldt. `text` is de naam van dat domein, of zijn id als er geen naam bekend is. |
| `forbiddenWord` | `error` | `Forbidden word` | Een woord dat bij een van de woorden als verboden staat vermeld, in de logische naam van een tabel of kolom of in de naam van een term. `suggestions` zijn de standaardwoorden. |
| `unregisteredWord` | `warning` | `Unregistered word` | Tekst die door geen enkel woord wordt vermeld, op dezelfde plaatsen. |
| `synonymWord` | `warning` | `Synonym` | Een synoniem dat in plaats van een standaardwoord is gebruikt, op dezelfde plaatsen. `suggestions` zijn de standaardwoorden. |
| `physicalNameMismatch` | `warning` | `Physical name mismatch` | Een fysieke naam van een tabel of kolom die afwijkt van de naam die de term van haar logische naam geeft. De suggestie is de fysieke naam van de term, of de naam die de woorden ervan samenstellen zolang de term er geen bevat. |
| `domainTypeMismatch` | `warning` | `Domain type mismatch` | Een kolom waarvan het gegevenstype niet dat van het domein is waaraan ze is gekoppeld. `text` is het type van de kolom, en de suggestie dat van het domein. |

Hoe elke controle een naam leest, staat in [Wat elke controle vindt](../guide/guides/dictionary.md#what-each-check-finds).

## Bewerkingstools {#edit-tools}

Id's komen uit `erd_list` en `erd_get`, of uit de `createdIds` van de aanroep die de entiteit heeft aangemaakt.
Een nieuwe id bestaat uit 25 kleine letters en cijfers, zoals `03h17be2plxpj5n59tqag7ogj`, terwijl een id die het document al bevat zijn vorm behoudt, dus leid niets af uit de vorm van een id.
`x` en `y` zijn de linker- en bovenrand op het canvas, in pixels, en een kleur is een CSS-hexkleur zoals `#3b82f6`, of een lege string, die de kleur verwijdert.

### Tabellen {#tables}

| Tool | Argumenten | Wat het doet |
| --- | --- | --- |
| `erd_add_table` | | Voegt een lege tabel toe op een vrije plek en geeft de id ervan terug in `createdIds`. |
| `erd_remove_table` | `tableId` | Verwijdert een tabel met haar kolommen, indexen en elke relatie die ermee verbonden is. |
| `erd_change_table_name` | `tableId`, `value` | Wijzigt de naam van een tabel. De naam geldt daarna als handmatig ingevoerd, dus een latere logische naam laat hem zoals hij is zolang hij niet leeg is — zie [Woordenboeken](#dictionaries). |
| `erd_change_table_comment` | `tableId`, `value` | Stelt de opmerking van een tabel in. Een lege string wist die. |
| `erd_set_table_logical_name` | `tableId`, `value` | Stelt de logische naam van een tabel in. Een lege string wist die en laat de naam staan. Zolang de naam van de tabel leeg is of is afgeleid, leiden de woordenboeken hem af uit de logische naam — zie [Woordenboeken](#dictionaries). Een term geeft een tabel geen domein. |
| `erd_change_table_color` | `tableId`, `color` | Stelt de kleur van een tabel in. |
| `erd_move_table` | `tableId`, `x`, `y` | Verplaatst een tabel naar een positie op het canvas. |
| `erd_move_tables` | `positions` | Verplaatst meerdere tabellen in één bewerking, die één `erd_undo` ongedaan maakt. `positions` bevat `{ tableId, x, y }` per tabel, elke tabel hooguit één keer. |
| `erd_sort_tables` | | Plaatst alle tabellen in rijen over het canvas, die met de minste kolommen eerst, zoals `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` en `erd_import_aml` ze plaatsen. De tabellen van een tabelgroep blijven bij elkaar, en het kader van elke groep wordt eromheen passend gemaakt. |

### Kolommen {#columns}

| Tool | Argumenten | Wat het doet |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Voegt een lege kolom toe aan een tabel en geeft de id ervan terug in `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Verwijdert kolommen uit één tabel, met de relaties en indexvermeldingen die ze gebruiken. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Wijzigt de naam van een kolom. De naam geldt daarna als handmatig ingevoerd, net als bij een tabel. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Stelt het gegevenstype in, zoals `INT` of `VARCHAR(255)`. Zolang [Gegevenstypen via relaties synchroniseren](../guide/guides/settings.md#relationship-datatype-sync) aanstaat, volgt de wijziging relaties in beide richtingen, zoals in de editor: een serial-type komt bij de refererende sleutels aan als het type voor gehele getallen dat het opslaat, zoals `erd_add_relationship` het kopieert, en een serial-sleutel behoudt zijn type wanneer een van zijn refererende sleutels wijzigt, waardoor de wijziging daar stopt. Het in- of uitschakelen van de synchronisatie is aan de gebruiker, en `erd_list` rapporteert die als `relationshipDataTypeSync`. Een kolom die aan een domein is gekoppeld, wordt ervan ontkoppeld wanneer ze een ander type krijgt dan dat van het domein, en hetzelfde geldt voor elke kolom die de synchronisatie bereikt en waarvan het nieuwe type afwijkt van dat van haar eigen domein — zie [Ontkoppelen](../guide/guides/dictionary.md#unlinking). |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Stelt de standaardwaarde in, als SQL-tekst. Een lege string wist die. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Stelt de opmerking in. Een lege string wist die. |
| `erd_set_column_logical_name` | `tableId`, `columnId`, `value` | Stelt de logische naam van een kolom in. Een lege string wist die en laat de naam staan. Zolang de naam van de kolom leeg is of is afgeleid, leiden de woordenboeken hem af, en wordt de kolom gekoppeld aan het domein van een term en krijgt ze het gegevenstype van dat domein — zie [Woordenboeken](#dictionaries). |
| `erd_set_column_domain` | `tableId`, `columnId`, `domainId?`, `domainName?` | Koppelt een kolom aan een domein, opgegeven op id of op naam, een van beide. De kolom krijgt het gegevenstype van het domein, dat relaties volgt zolang Gegevenstypen via relaties synchroniseren aanstaat, met hetzelfde ontkoppelen als bij `erd_change_column_data_type`. Een `domainId` van `null` of een lege string, of een lege `domainName`, ontkoppelt de kolom en behoudt haar type. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` maakt de kolom onderdeel van de primaire sleutel, `false` haalt haar eruit. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | Stelt in of de kolom uniek is. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | Stelt in of de kolom `NOT NULL` is. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | Stelt in of de kolom automatisch ophoogt. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | Verplaatst een kolom binnen haar tabel naar de positie van een andere kolom. |

### Relaties {#relationships}

`relationshipType` is de kardinaliteit aan de kant van de kindtabel: `ZeroOne`, `ZeroN`, `OneOnly` of `OneN`.
De begintabel is de oudertabel, de kant waarnaar wordt verwezen en die de primaire sleutel bevat, en de eindtabel is de kindtabel.
`onDelete` en `onUpdate` zijn de ON DELETE- en ON UPDATE-acties van de refererende sleutel: `none`, `noAction`, `cascade`, `setNull`, `setDefault` of `restrict`.
`none` schrijft geen clausule, dus geldt het standaardgedrag van de database — zie [ON DELETE en ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).
Een actie die bij `erd_add_relationship` of `erd_link_columns` wordt weggelaten, is `none`.

| Tool | Argumenten | Wat het doet |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Verbindt twee tabellen met een relatie. Kopieert de primaire sleutel van de oudertabel naar de kindtabel als kolommen met refererende sleutel, en maakt eerst een kolom voor de primaire sleutel aan als de oudertabel er geen heeft. Elke kolom met refererende sleutel krijgt dezelfde naam als bij het tekenen van een relatie in de editor: de sleutel `id` van `users` geeft `users_id`, en een sleutel zoals `member_id` behoudt zijn naam — zie [Namen van kolommen met refererende sleutel](../guide/guides/relationship-editing.md#foreign-key-column-names). Elke kolom kopieert het gegevenstype van haar sleutel, behalve dat een serial-sleutel het type voor gehele getallen geeft dat hij opslaat, zoals `integer` voor `serial4`, en een kale `serial` buiten PostgreSQL, MySQL en MariaDB `serial` blijft — zie [Identificerende relaties](../guide/guides/relationship-editing.md#identifying-relationships). Elke kolom krijgt ook de logische naam van haar sleutel en wordt gekoppeld aan het domein waaraan haar sleutel is gekoppeld, tenzij een serial-sleutel haar een ander type geeft. `createdIds` bevat die nieuwe sleutelkolom als er een is aangemaakt, de kolommen met refererende sleutel en als laatste de id van de relatie. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Tekent een relatie tussen kolommen die al bestaan en koppelt begin- en eindkolommen op positie. Wijzigt geen kolomnaam, wijzigt geen gegevenstype en kopieert geen logische naam of domein. |
| `erd_remove_relationship` | `relationshipId` | Verwijdert een verbindingslijn. De kolommen met refererende sleutel blijven in de tabel. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Wijzigt de kardinaliteit van een relatie. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Stelt de ON DELETE-actie van een relatie in: wat het verwijderen van een rij in de oudertabel met de bijbehorende rijen in de kindtabel doet. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Stelt de ON UPDATE-actie van een relatie in: wat het wijzigen van een sleutel in de oudertabel met de bijbehorende rijen in de kindtabel doet. |

`erd_add_relationship` geeft de kolommen met refererende sleutel hun naam en kopieert de logische namen van hun sleutels op het moment dat de tool wordt uitgevoerd. Een latere naamswijziging of logische naam van de sleutel bereikt ze niet, dus geef eerst de oudertabel en haar primaire sleutel een naam, en de sleutel zijn logische naam.
De namen die de tool geeft, gelden als handmatig ingevoerd, dus een latere logische naam laat ze zoals ze zijn, terwijl `erd_derive_physical_names` ze teruggeeft aan de woordenboeken — zie [Woordenboeken](#dictionaries).

Geen enkele tool wijzigt de kolommen van een bestaande relatie zoals [Kolommen toewijzen](../guide/guides/relationship-editing.md#map-columns) in de editor dat doet.
Om een relatie aan andere kolommen toe te wijzen, voer je `erd_remove_relationship` uit, die de kolommen met refererende sleutel in de tabel laat staan, en `erd_link_columns` met de gewenste kolommen, samen in één `erd_batch`, die één `erd_undo` ongedaan maakt.

### Indexen {#indexes}

De id van een indexkolom is die van een item in de kolomlijst van de index, zoals `erd_get` die teruggeeft, niet de id van de tabelkolom.

| Tool | Argumenten | Wat het doet |
| --- | --- | --- |
| `erd_add_index` | `tableId` | Voegt een lege index toe aan een tabel en geeft de id ervan terug in `createdIds`. |
| `erd_remove_index` | `indexId` | Verwijdert een index. |
| `erd_change_index_name` | `indexId`, `value` | Wijzigt de naam van een index. |
| `erd_set_index_unique` | `indexId`, `value` | Stelt in of de index uniek is. |
| `erd_add_index_column` | `indexId`, `columnId` | Voegt een kolom van de tabel van de index toe en geeft de id van de nieuwe indexkolom terug. Een kolom die al in de index staat, blijft ongemoeid. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | Verwijdert één kolom uit een index. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | Verplaatst een kolom binnen een index naar de positie van een andere kolom van die index. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | Stelt de sorteervolgorde van één kolom in een index in, `ASC` of `DESC`. |

### Memo's {#memos}

| Tool | Argumenten | Wat het doet |
| --- | --- | --- |
| `erd_add_memo` | | Voegt een lege memo toe op een vrije plek en geeft de id ervan terug in `createdIds`. |
| `erd_remove_memo` | `memoId` | Verwijdert een memo. |
| `erd_change_memo_value` | `memoId`, `value` | Vervangt de tekst van een memo. |
| `erd_change_memo_color` | `memoId`, `color` | Stelt de kleur van een memo in. |
| `erd_move_memo` | `memoId`, `x`, `y` | Verplaatst een memo naar een positie op het canvas. |
| `erd_resize_memo` | `memoId`, `width`, `height` | Wijzigt de grootte van een memo. De breedte moet minstens ongeveer `116` pixels zijn en de hoogte minstens `100`. Levert geen stap in de geschiedenis op, omdat de editor het wijzigen van de grootte van een memo alleen bij slepen vastlegt. |

Zolang memo's verborgen zijn met [View Option](../guide/guides/table-related-functions.md#table-view-options) → `Memos`, voegt `erd_add_memo` er toch een toe, en die blijft verborgen tot memo's weer worden getoond.
`erd_list` en `erd_get` vermelden ook verborgen memo's.

### Tabelgroepen {#table-groups}

Een tabelgroep is een kader met een naam dat achter zijn tabellen wordt getekend, en zijn kleur is te zien op het kader en over de koppen van zijn tabellen — zie [Tabelgroepen](../guide/guides/table-groups.md).
Een tabel zit in hooguit één groep. `erd_move_table`, `erd_move_tables` en `erd_move_table_group` veranderen nooit welke tabellen een groep bevat, waar ze een tabel ook neerzetten, terwijl in de editor een tabel bij een groep komt of eruit gaat afhankelijk van waar ze wordt neergezet — zie [Tabellen toevoegen en verwijderen](../guide/guides/table-groups.md#adding-and-removing-tables). `erd_add_table_group` en `erd_set_table_group` plaatsen tabellen in een groep, en `erd_remove_table_group` laat zijn tabellen in geen enkele groep achter.
Een groep slaat een rechthoek op van minstens `160` pixels breed en `100` hoog, titelbalk inbegrepen, en de editor tekent het kader zo vergroot dat elk van zijn tabellen erin past.

| Tool | Argumenten | Wat het doet |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | Voegt een groep toe en geeft de id ervan terug in `createdIds`. Geef ofwel `tableIds` door, ofwel een rechthoek: `x`, `y`, `width` en `height` samen. Met `tableIds` verlaat elke tabel de groep waarin ze zat, en wordt de rechthoek om de tabellen heen passend gemaakt zoals bij [Geselecteerde tabellen groeperen](../guide/guides/table-groups.md#grouping-selected-tables). Een rechthoek neemt elke tabel zonder groep op waarvan het midden erbinnen ligt, zoals bij [Een groep tekenen](../guide/guides/table-groups.md#drawing-a-group). Een lege `name` laat de groep zonder naam. Eén `erd_undo` verwijdert de groep en zet elke tabel terug in de groep waarin ze zat. |
| `erd_remove_table_group` | `groupId` | Verwijdert een groep. De tabellen ervan blijven waar ze zijn, zonder groep. |
| `erd_change_table_group_name` | `groupId`, `value` | Wijzigt de naam van een groep. Een lege string laat de groep zonder naam. |
| `erd_change_table_group_color` | `groupId`, `color` | Stelt de kleur van een groep in. |
| `erd_move_table_group` | `groupId`, `x`, `y` | Verplaatst een groep zodat de rechthoek op dat punt begint, met de tabellen ervan over dezelfde afstand, zoals slepen aan de titelbalk doet. Een verplaatsing van minder dan 20 pixels, horizontaal en verticaal bij elkaar opgeteld, levert geen stap in de geschiedenis op. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | Stelt de rechthoek van een groep in, terwijl de tabellen ervan blijven waar ze zijn. Als `x` en `y` worden weggelaten, blijft de hoek behouden. Een rechthoek waarin de tabellen van de groep met hun marge niet passen, wordt geweigerd, met een bericht dat het kader noemt dat erin moet passen. |
| `erd_set_table_group` | `tableIds`, `groupId` | Plaatst tabellen in een groep, waarbij elke tabel de groep verlaat waarin ze zat. Een `groupId` van `null` of een lege string haalt ze uit elke groep. |

Zolang groepen verborgen zijn met `View Option` → `Table Groups`, voegen deze tools nog steeds groepen toe en wijzigen ze groepen, die verborgen blijven tot groepen worden getoond — zie [Groepen verbergen](../guide/guides/table-groups.md#hiding-groups).
`erd_sort_tables` houdt de tabellen van elke groep bij elkaar, `erd_import_dbml` en `erd_import_json` brengen groepen mee — zie [Importeren](#import) — en `erd_read` schrijft met `groupNames` de DDL van gekozen groepen.
Een versie van ERD Editor van vóór de tabelgroepen laat de groepen van een bestand vallen wanneer ze het bestand opslaat, zoals de VS Code-extensie vóór `4.0.0` en de Obsidian- en JetBrains-plug-ins vóór `1.0.0` doen — zie [Bijwerken](./installation.md#updating).

### Woordenboeken {#dictionaries}

Deze tools bewerken de drie woordenboeken van het tabblad [Woordenboek](../guide/guides/dictionary.md) van de editor, waarmee de logische naam van een tabel of kolom de fysieke naam ervan afleidt:

- Een woord is een standaardwoord waaruit logische namen bestaan, met de afkorting die het in een fysieke naam schrijft, zoals `Member` en `MBR`.
- Een term is een hele logische naam met de fysieke naam die hij geeft en, voor een kolom, het domein dat hij koppelt, zoals `Member Number` met `MBR_NO` en `Identifier`.
- Een domein is een gegevenstype met een naam waaraan kolommen worden gekoppeld, zoals `Identifier` voor `INT`.

| Tool | Argumenten | Wat het doet |
| --- | --- | --- |
| `erd_add_word` | `name`, `abbreviation`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Voegt een woord toe aan het einde van het woordenboek met woorden en geeft de id ervan terug in `createdIds`. `synonyms` en `forbiddenWords` zijn door komma's gescheiden: andere schrijfwijzen van het woord, en woorden die niet in plaats ervan mogen worden gebruikt. |
| `erd_update_word` | `wordId`, `name?`, `abbreviation?`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Wijzigt de doorgegeven velden en laat de rest staan. |
| `erd_remove_word` | `wordId` | Verwijdert een woord. |
| `erd_add_term` | `name`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Voegt een term toe aan het einde van het woordenboek met termen en geeft de id ervan terug in `createdIds`. Zonder `physicalName` stellen de woorden er een samen als dat kan, zoals `MBR_NO` voor `Member Number`. |
| `erd_update_term` | `termId`, `name?`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Wijzigt de doorgegeven velden en laat de rest staan. Een `name` die wordt doorgegeven terwijl de term geen fysieke naam bevat, of met een lege `physicalName`, schrijft ook de fysieke naam die de woorden ervan samenstellen, als ze er een samenstellen. |
| `erd_remove_term` | `termId` | Verwijdert een term. |
| `erd_add_domain` | `name`, `category?`, `dataType`, `description?` | Voegt een domein toe aan het einde van het woordenboek met domeinen en geeft de id ervan terug in `createdIds`. `category` groepeert domeinen, zoals `Number` of `Text`. |
| `erd_update_domain` | `domainId`, `name?`, `category?`, `dataType?`, `description?` | Wijzigt de doorgegeven velden en laat de rest staan. Een nieuw `dataType` bereikt elke kolom die aan het domein is gekoppeld, en volgt relaties zolang Gegevenstypen via relaties synchroniseren aanstaat, met hetzelfde ontkoppelen als bij `erd_change_column_data_type`. |
| `erd_remove_domain` | `domainId` | Verwijdert een domein. De kolommen die eraan zijn gekoppeld, behouden hun gegevenstype, en zij en de termen die eraan zijn gekoppeld, tonen geen domein: hun `domainId` wordt gelezen als een lege string. `erd_undo` brengt de koppelingen terug, en bij opslaan worden ze uit het bestand weggelaten. |
| `erd_derive_physical_names` | `scope`, `tableId?`, `columnId?` | Leidt fysieke namen opnieuw af uit de logische namen, zoals [Fysieke namen opnieuw afleiden](../guide/guides/dictionary.md#derive-physical-names-again) in de editor doet, voor één kolom, één tabel of het hele document. |

- Een woordenboek bevat elke naam één keer, dus een naam die een andere rij van hetzelfde woordenboek al bevat, wordt geweigerd met `invalidArgs`. Namen worden vergeleken zonder witruimte aan het begin en het eind, en hoofdlettergebruik telt mee, dus `Member` en `member` zijn twee namen.
- Een update duidt de rij aan met haar id en geeft ten minste één veld door. Waarden die de rij al bevat, veranderen niets en leveren geen stap in de geschiedenis op; toevoegen of verwijderen levert er altijd een op.
- Het domein van een term komt ofwel via `domainId`, met `null` of een lege string voor geen domein, ofwel via `domainName`, met een lege string voor geen domein. Een `domainName` neemt het eerste domein met die naam in de volgorde van het woordenboek, vergeleken zoals namen worden vergeleken. Beide doorgeven, of een `domainName` die bij geen enkel domein hoort, wordt geweigerd. `erd_set_column_domain` neemt een domein op dezelfde manier aan.
- Een woord of term wijzigen of verwijderen wijzigt geen enkele naam en ontkoppelt niets: de namen en domeinen die het gaf, blijven zoals ze zijn. `erd_derive_physical_names` leidt de namen opnieuw af en koppelt het domein dat een term nu geeft, maar een kolom waarmee nu geen term overeenkomt, of waarvan de term geen domein geeft, behoudt het domein waaraan ze is gekoppeld. `erd_set_column_domain` met een lege `domainId` ontkoppelt de kolom.
- Geen enkele tool importeert of exporteert een woordenboek als CSV, sorteert een woordenboek of voegt rijen in op een positie, zoals het tabblad Woordenboek dat doet.

`erd_list` toont de rijen, `erd_get` geeft elk veld, het formaat `snapshot` van `erd_read` bevat ze allemaal, en `erd_list_checks` toont wat er volgens de woordenboeken niet klopt — zie [Een document lezen](#reading-a-document).

`erd_set_table_logical_name` en `erd_set_column_logical_name` leiden een fysieke naam af zoals de editor dat doet wanneer een logische naam wordt ingevoerd — zie [Fysieke namen afleiden](../guide/guides/dictionary.md#deriving-physical-names):

- Een naam wordt alleen afgeleid zolang hij leeg is of zelf is afgeleid, wat de leesopdrachten tonen als `nameDerived: true`. Een naam die niet leeg is en handmatig is ingevoerd, blijft staan, en alleen de logische naam wordt geschreven. De namen die `erd_change_table_name`, `erd_change_column_name` en de imports van SQL, GraphQL, DBML en AML schrijven, en de namen die `erd_add_relationship` aan de kolommen met refererende sleutel geeft, gelden allemaal als handmatig ingevoerd. Een naam die naar een lege string is gewijzigd, wordt door de volgende logische naam opnieuw afgeleid.
- De term waarvan de naam de logische naam is, komt eerst, vergeleken zoals namen in een woordenboek worden vergeleken. Hij geeft zijn fysieke naam, of de naam die zijn woorden samenstellen zolang hij er geen bevat. Bij een kolom wordt ook het domein van de term gekoppeld, zelfs als er geen naam wordt afgeleid, en krijgt de kolom het gegevenstype van het domein, dat relaties volgt zolang Gegevenstypen via relaties synchroniseren aanstaat.
- Zonder zo'n term stellen de woorden de naam samen, met hun afkortingen verbonden door underscores: `Member Number` geeft `MBR_NO`. Het is alles of niets: een synoniem, een verboden woord, tekst die door geen enkel woord wordt vermeld of een woord zonder afkorting stelt niets samen, en de naam blijft zoals hij was. De woorden koppelen geen domein, en een term zonder domein evenmin, dus een kolom behoudt het domein waaraan ze is gekoppeld.
- Een kolom waarvan de afgeleide naam al door een andere kolom van haar tabel wordt gebruikt, ongeacht hoofdlettergebruik, behoudt haar naam, haar `nameDerived` en haar domein.
- Een logische naam wissen laat de fysieke naam zoals hij is. Een aanroep waarvan de logische naam, en wat die afleidt, al aanwezig zijn, verandert niets en levert geen stap in de geschiedenis op.

`erd_derive_physical_names` krijgt een `scope`: `column`, met `tableId` en `columnId`, voor die kolom; `table`, met `tableId`, voor de naam van de tabel en elk van haar kolommen; of `document`, zonder id, voor elke tabel en haar kolommen. Een scope waarbij een benodigde id ontbreekt, of die een id krijgt die ze niet accepteert, wordt geweigerd.
Elke naam binnen de scope die een logische naam heeft, gaat terug naar de woordenboeken, ook een handmatig ingevoerde naam, en krijgt wat ze nu geven: de fysieke naam van een term en, voor een kolom, het domein en type daarvan, of anders de samenstelling uit de woorden, die het domein van de kolom laat zoals het is. Een logische naam die niets afleidt, laat de naam zoals hij is, met `nameDerived` nu `true`. Een naam zonder logische naam blijft zoals hij is, en dat geldt ook voor een kolom waarvan de nieuwe naam al door een andere kolom van haar tabel wordt gebruikt, zoals een tweede refererende sleutel naar dezelfde tabel, die ook haar `nameDerived` behoudt. Eén `erd_undo` maakt de hele aanroep ongedaan.
De namen van een geïmporteerd schema gelden als handmatig ingevoerd, dus geef het namen uit de woordenboeken door de logische namen in te stellen en daarna `erd_derive_physical_names` aan te roepen. Die aanroep geeft de eigen fysieke naam van een term, die na een wijziging van de woorden van de term niet opnieuw wordt samengesteld. Werk dus na het wijzigen van de woorden van een term eerst de term bij: geef zijn `name` door met een lege `physicalName` om de woorden hem opnieuw te laten samenstellen, of geef de nieuwe `physicalName` door.

Een versie van ERD Editor van vóór het tabblad Woordenboek laat de logische namen, domeinkoppelingen en woordenboekrijen van een bestand vallen wanneer ze het bestand opslaat, zoals de VS Code-extensie vóór `4.2.0` en de Obsidian- en JetBrains-plug-ins vóór `1.2.0` doen. Daarvan bewerken de extensie `4.0.0` of `4.1.0` en de plug-ins `1.0.0` of `1.1.0` nog steeds live met de server, maar ze tonen noch behouden de logische namen, domeinkoppelingen en woordenboekrijen die een agent schrijft — zie [Bijwerken](./installation.md#updating).

### Instellingen {#settings}

Een agent stelt de instellingen van het schema zelf in: de database, de naam ervan en de scripts van [Schema SQL](../guide/guides/schema-sql.md).
Elke andere instelling die het document opslaat, stelt de gebruiker in de editor in: de [naamweergave](../guide/guides/logical-names.md#name-view), de schakelaars van de [weergaveopties](../guide/guides/table-related-functions.md#table-view-options), de opties van het tabblad [Instellingen](../guide/guides/settings.md), de taal en de naamnotaties van de Codegenerator, het type aanhalingstekens en de [vergrendelingen](../guide/guides/settings.md#lock).
Geen enkele tool wijzigt ze, behalve de imports in de modus `replace`: `erd_import_json` brengt de instellingen en vergrendelingen mee van het document dat hij laadt, en de andere vier zetten de weergave terug naar het begin van het canvas — zie [Importeren](#import).
Server `1.0.0` heeft de tools verwijderd die ze instelden: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` en `erd_set_show`.

`erd_list` en het formaat `snapshot` van `erd_read` rapporteren de instellingen zoals het bestand ze opslaat, met in `lockSettings` één vlag per vergrendeling: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase`, `bracketType` en `unlockNameViewMode`.
De laatste wordt andersom gelezen: die is `false` zolang de vergrendeling `Name View` aanstaat, zoals in een nieuw document en in een bestand dat is opgeslagen voordat die vergrendeling bestond, en `true` zodra de gebruiker de vergrendeling uitschakelt.
Een taal, naamnotatie of type aanhalingstekens die vergrendeld is, wordt gerapporteerd met de vergrendelde waarde, de waarde die het bestand bewaart en waarmee elke editor opent, wat het scherm van een editor ook toont. De weergave, het tabblad en de naamweergave worden niet gerapporteerd. Een agent leest en schrijft logische namen, wat de naamweergave ook toont.

`erd_set_ddl_script` levert een stap in de geschiedenis op. `erd_set_database` en `erd_set_database_name` leveren er geen op, dus `erd_undo` kan ze niet ongedaan maken.

| Tool | Argumenten | Wat het doet |
| --- | --- | --- |
| `erd_set_database` | `value` | Stelt de database in: `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks` of `Snowflake`. Dit bepaalt de gegevenstypen van de database en de DDL die `erd_read` schrijft als er geen `vendor` is opgegeven. |
| `erd_set_database_name` | `value` | Stelt de databasenaam in, die de koppen `use` en `createAndUse` van `erd_read` noemen. |
| `erd_set_ddl_script` | `position`, `sql` | Stelt een van de twee scripts in die rond de tabellen worden geschreven — zie [Scripts vóór en na de tabellen](../guide/guides/schema-sql.md#before-and-after-scripts). `position` is `before`, geschreven vóór de tabellen, zoals `CREATE EXTENSION` of `CREATE SCHEMA`, of `after`, geschreven na de tabellen, zoals `GRANT` of `CREATE VIEW`. `sql` vervangt het hele script, hooguit 10.000 tekens, en een lege string verwijdert het. Lees eerst het huidige script met het formaat `scripts` van `erd_read`. |

Een script gaat ongewijzigd in de DDL van elke database, dus schrijf het voor de database van het document. Op MSSQL wordt een regel `GO` toegevoegd na een script waarvan de laatste regel niet `GO` is.
Een versie van ERD Editor van vóór deze scripts laat de scripts van een bestand vallen wanneer ze het bestand opslaat, zoals de VS Code-extensie vóór `4.0.0` en de Obsidian- en JetBrains-plug-ins vóór `1.0.0` doen — zie [Bijwerken](./installation.md#updating).

### Importeren {#import}

Deze tools lezen een schema in zoals het importmenu van de editor dat doet — zie [Bestanden importeren of exporteren](../guide/guides/file-import-export.md).
Elke tool krijgt de tekst als `value`, en `mode`: `replace`, de standaardwaarde, of `append`.

| Tool | Argumenten | Wat het doet |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | Laadt SQL-DDL, instructies als `CREATE TABLE` en dergelijke. |
| `erd_import_graphql` | `value`, `mode?` | Laadt een GraphQL-SDL. |
| `erd_import_dbml` | `value`, `mode?` | Laadt DBML. Elke `TableGroup` wordt een tabelgroep van de tabellen die hij noemt — zie [DBML](../guide/guides/file-import-export.md#dbml). |
| `erd_import_aml` | `value`, `mode?` | Laadt AML. |
| `erd_import_json` | `value`, `mode?` | Laadt een JSON-document van erd-editor, zoals een ander `.erd.json`-bestand. |

`replace` neemt de plaats van het document in, en `erd_undo` herstelt het vorige:

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` en `erd_import_aml` vervangen elke tabel, relatie, index, memo en tabelgroep. Ze behouden de instellingen van het document, inclusief de vergrendelingen, behalve de weergave, die terugkeert naar het begin van het canvas op 100%, en ze behouden de woordenboeken met woorden, termen en domeinen ervan. De tabellen die ze meebrengen, hebben geen logische namen en zijn aan geen domein gekoppeld.
- `erd_import_json` vervangt het hele document, inclusief de instellingen en woordenboeken: de instellingen, vergrendelingen, woorden, termen en domeinen van de JSON nemen de plaats in van die van dit document, en een JSON zonder vastgelegde vergrendelingen schakelt elke vergrendeling in en zet de weergave op het begin van het canvas. Elke kijker behoudt zijn eigen naamweergave, tenzij de vergrendeling `Name View` in de JSON uitstaat; dan brengt de JSON zijn naamweergave mee. Om de instellingen van dit document te behouden, begin je met de tekst die het formaat `json` van `erd_read` geeft. Een lege tekst geeft een nieuw document, zoals het document dat `erd_open_document` met `create` aanmaakt.

`append` voegt de import toe aan het document, zoals [Importeren en toevoegen](../guide/guides/file-import-export.md#import-and-add) in de editor dat doet, en één `erd_undo` maakt de hele toevoeging ongedaan:

- Wat de tekst bevat, komt binnen als nieuwe entiteiten met nieuwe id's, in een blok onder alles wat het document bevat, verborgen memo's en tabelgroepen inbegrepen, uitgelijnd op de linkerrand daarvan. Elke tabel en instelling die er al is, blijft, ook een tabel met dezelfde naam: er wordt niets op naam samengevoegd.
- Relaties en indexen worden alleen overgenomen tussen de tabellen die de import meebrengt, dus een refererende sleutel naar een tabel die de tekst niet declareert, vervalt.
- `erd_import_sql`, `erd_import_graphql` en `erd_import_aml` voegen tabellen toe met hun relaties en indexen, en `erd_import_dbml` daarnaast de tabelgroepen. `erd_import_json` voegt tabellen, relaties, indexen, memo's en tabelgroepen toe, nooit de instellingen ervan, en weigert een lege tekst. De tabellen en kolommen ervan brengen hun logische namen mee, maar geen enkele kolom wordt aan een domein gekoppeld, en geen van de woorden, termen of domeinen van de JSON komt mee.

Een JSON-document behoudt zijn eigen indeling, inclusief zijn tabelgroepen: op de plek waar het zijn tabellen plaatst met `replace`, en binnen het toegevoegde blok met `append`.
De tabellen van SQL, GraphQL, DBML en AML worden in rijen gezet, die met de minste kolommen eerst en de tabellen van elke groep bij elkaar, zoals `erd_sort_tables` ze plaatst, nooit volgens `Flow` zoals de eigen import van de editor ze indeelt wanneer dat kan. Die vier tools weigeren een lege tekst in beide modi.

## erd_batch {#erd_batch}

`erd_batch` voert meerdere bewerkingstools op volgorde uit als één bewerking, alles of niets.

- `operations` bevat maximaal 100 items, elk `{ tool, as?, args? }`, waarbij `tool` een bewerkingstool is en `args` de argumenten van de tool zijn zonder `path`. Een leestool, zoals `erd_list_checks`, wordt geweigerd.
- De operaties worden eerst op een kopie van het document geprobeerd. Een geweigerde operatie wordt genoemd, zoals `operations[1] erd_remove_table: …`, en er wordt niets toegepast.
- Eén `erd_undo` maakt de hele batch ongedaan, behalve de operaties die hij niet ongedaan kan maken en die de `undoNote` van het resultaat noemt: die van een tool die geen stap in de geschiedenis oplevert, zoals `erd_set_database`, en die het document hebben gewijzigd zonder er een op te leveren, zoals een korte `erd_move_table_group`. Een batch die helemaal geen stap in de geschiedenis heeft opgeleverd, wordt door `erd_undo` overgeslagen. `historyEntries` in het resultaat telt de stappen in de geschiedenis van de editor binnen de batch, niet het aantal aanroepen van `erd_undo`.
- In een live sessie neemt de editor de hele batch over of niets ervan.

Een agent kan vóór de aanroep niet weten welke id's een batch aanmaakt, dus met een operatie die met `as` een naam krijgt, kan een latere operatie ernaar verwijzen: `$name` of `$name.0` voor de eerste aangemaakte id, `$name.1` voor de tweede en `$name.last` voor de laatste.
Een naam bestaat uit ASCII-letters, cijfers en underscores, begint niet met een cijfer en hoort bij slechts één operatie.
Een verwijzing wordt alleen omgezet waar een argument de id van een entiteit verwacht, `wordId`, `termId` en `domainId` inbegrepen, dus een naam of opmerking met de tekst `$x` blijft tekst.
Een `domainName` is ook tekst, maar wordt gelezen wanneer zijn operatie wordt uitgevoerd, dus die kan een domein noemen dat een eerdere operatie van de batch heeft toegevoegd.

Een tabel met haar kolommen en een relatie, in één aanroep:

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_table", "as": "users" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$users", "value": "users" } },
    { "tool": "erd_add_column", "as": "uid", "args": { "tableId": "$users" } },
    { "tool": "erd_change_column_name", "args": { "tableId": "$users", "columnId": "$uid", "value": "id" } },
    { "tool": "erd_change_column_data_type", "args": { "tableId": "$users", "columnId": "$uid", "value": "BIGINT" } },
    { "tool": "erd_set_column_primary_key", "args": { "tableId": "$users", "columnId": "$uid", "value": true } },
    { "tool": "erd_add_table", "as": "orders" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$orders", "value": "orders" } },
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN", "onDelete": "cascade" } }
  ]
}
```

`users` en haar sleutel `id` krijgen hun naam vóór de relatie, dus de kolom met refererende sleutel die de relatie aan `orders` toevoegt, is `users_id`.

Woorden, een domein en een term, en daarna een tabel die via haar logische namen daaruit haar namen krijgt:

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_word", "args": { "name": "Member", "abbreviation": "MBR" } },
    { "tool": "erd_add_word", "args": { "name": "Number", "abbreviation": "NO" } },
    { "tool": "erd_add_word", "args": { "name": "Name", "abbreviation": "NM" } },
    { "tool": "erd_add_domain", "as": "identifier", "args": { "name": "Identifier", "dataType": "INT" } },
    { "tool": "erd_add_term", "args": { "name": "Member Number", "domainId": "$identifier" } },
    { "tool": "erd_add_table", "as": "members" },
    { "tool": "erd_set_table_logical_name", "args": { "tableId": "$members", "value": "Member" } },
    { "tool": "erd_add_column", "as": "no", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$no", "value": "Member Number" } },
    { "tool": "erd_add_column", "as": "nm", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$nm", "value": "Member Name" } }
  ]
}
```

De term stelt `MBR_NO` samen uit zijn woorden, en de tabel krijgt de naam `MBR`. De kolom `Member Number` krijgt `MBR_NO` en het domein van de term, dus ze wordt gekoppeld aan `Identifier` en krijgt het type `INT`, en `Member Name`, waarvoor geen term bestaat, wordt samengesteld als `MBR_NM`.

## Resultaten {#results}

Een bewerking antwoordt met één regel JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Veld | Betekenis |
| --- | --- |
| `mode` | `live` of `headless` — zie [Live en headless](./live-and-headless.md). |
| `saved` | `true` in het resultaat van elke bewerking in headless-modus, `erd_batch`, `erd_undo` en `erd_redo`: het bestand bevat de wijziging op het moment dat de aanroep antwoordt, dus er valt niets meer op te slaan. Een live resultaat heeft geen `saved`, omdat de editor de wijziging bevat — zie [Opslaan](./live-and-headless.md#saving). |
| `createdIds` | De id's van wat de aanroep heeft aangemaakt, op volgorde. |
| `batches`, `historyEntries` | Hoeveel wijzigingsbatches de aanroep heeft verstuurd en hoeveel stappen in de geschiedenis van de editor hij heeft opgeleverd. |
| `undoable`, `undoNote` | `undoable` is `false` wanneer `erd_undo` de aanroep zal overslaan, en `undoNote` zegt waarom: de tool levert geen stap in de geschiedenis op, de aanroep heeft het document gewijzigd zonder er een op te leveren, zoals een `erd_move_table_group` van minder dan 20 pixels, of het document had de waarde al. Een resultaat van `erd_batch` bevat altijd een `undoNote`. Als de batch een stap in de geschiedenis heeft opgeleverd, zegt de notitie dat één `erd_undo` de batch ongedaan maakt en noemt ze elke operatie die daarbij blijft staan; als de batch er geen heeft opgeleverd, bevat het resultaat `undoable: false` en zegt de notitie dat `erd_undo` de batch overslaat. |
| `mismatch` | Aanwezig wanneer de aanroep een ander aantal batches of stappen in de geschiedenis heeft opgeleverd dan de tool opgeeft. |
| `notes` | Aanwezig wanneer er iets aan de sessie is veranderd, zoals een editor die is afgesloten of het document niet meer bedient, of een bestand dat op schijf is gewijzigd. |

Een weigering is een foutresultaat met een code en een bericht dat zegt wat je moet doen:

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | Waarom |
| --- | --- |
| `notFound` | Een id verwijst naar niets wat nog bestaat, of het bestand bestaat niet. |
| `invalidArgs` | Een argument ontbreekt of heeft een verkeerde waarde. |
| `invalidPath` | Het pad is geen ERD-document. Op Windows ook een pad met een naam die Windows niet opslaat zoals hij geschreven is, of een pad dat uitkomt bij een document dat een editor onder een ander pad beheert, dat het bericht noemt. |
| `invalidDocument` | Het bestand is geen document dat de editor kan lezen. |
| `tooLarge` | Een leesopdracht past niet in één antwoord. |
| `blocked` | Een editor met uitgeschakelde hub beheert het document. Het bericht zegt hoe je de hub inschakelt: vertrouw in VS Code de werkruimte en schakel `dineug.erd-editor.agentHub.enabled` in, of laad het venster opnieuw; schakel in Obsidian Coding agents in, of laad Obsidian opnieuw; schakel in een JetBrains-IDE Coding agents in, of start de IDE opnieuw als Coding agents al is ingeschakeld. |
| `hubDisabled` | Een JetBrains-IDE beheert het document alleen in een project dat hij niet vertrouwt. Lezen werkt nog; vertrouw het project om de agent te laten bewerken. |
| `conflict` | Het bestand is tijdens de aanroep op schijf gewijzigd. Er is niets geschreven. |
| `hubAppeared`, `hubGone` | Een editor is een document gaan bedienen dat de agent op schijf aan het bewerken was, of de editor die het bediende draait nog, maar zijn lockbestand en verbinding zijn verdwenen. Er is niets geschreven. |
| `notSaved` | `erd_save` kon het document van de editor niet opslaan. |
| `readonly` | De editor beheert het document in alleen-lezenmodus, zoals een bestand waarnaar hij niet kan schrijven of dat hij niet als diagram kan lezen. Zonder editor is het bestand zelf alleen-lezen, zoals een Perforce- of TFVC-bestand dat niet is uitgecheckt. Er is niets geschreven. |
| `protocolMismatch` | De ERD Editor-extensie of -plug-in van de editor en de server gebruiken verschillende protocolversies, zoals server `1.0.0` of later met een VS Code-extensie van versie `3.x`. Ook leesopdrachten worden geweigerd, en het bericht noemt de kant die moet worden bijgewerkt — zie [Bijwerken](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | De hub van een editor accepteerde de verbinding niet, antwoordde niet binnen 30 seconden of verbrak de verbinding tijdens de aanroep. Op Windows betekent `hubUnreachable` ook dat Windows de agent van de hub heeft geweerd: de editor draait met meer rechten dan de agent, zoals wanneer hij als administrator is gestart en de agent niet, of de agent draait in een sandbox. |

Andere codes komen minder vaak voor, en elke weigering bevat een bericht dat zegt wat er is gebeurd.

De bewerkingstools, `erd_batch` en de vier leestools weigeren een argument dat ze niet declareren, of een van het verkeerde type, met een JSON-RPC-fout voor ongeldige parameters (`-32602`) voordat ze het document aanraken, zodat een verkeerd gespeld argument nooit stilzwijgend wordt genegeerd.
De vijf sessietools negeren argumenten die ze niet kennen.
