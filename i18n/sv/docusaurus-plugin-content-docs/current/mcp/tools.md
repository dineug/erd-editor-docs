---
sidebar_position: 4
description: Alla verktyg som MCP-servern för erd-editor erbjuder – läsning av ett dokument en sida i taget, de 54 redigeringsverktygen, erd_batch och hur ett resultat och ett nekande ser ut.
---

# Verktyg

Servern erbjuder 63 verktyg: fem sessionsverktyg, tre läsverktyg, 54 redigeringsverktyg med ett per redigeringsoperation och `erd_batch`, som kör flera redigeringsverktyg som en enda redigering.

Alla verktyg utom `erd_list_documents` tar dokumentets `path` som första argument, och tabellerna nedan utelämnar det.
Ett argument som är märkt med `?` är valfritt.

## Sessionsverktyg {#session-tools}

| Verktyg | Argument | Vad det gör |
| --- | --- | --- |
| `erd_list_documents` | | Listar ERD-dokument med `path`, `open`, `active`, `dirty` och `readonly`: dokumenten i den editor som betjänar arbetskatalogen, vilket i en JetBrains-IDE omfattar alla öppna projekt, annars ERD-filerna under arbetskatalogen. |
| `erd_open_document` | `create?` | Öppnar ett dokument för redigering, i ERD Editor i den editor som betjänar det, om det finns en sådan. Med `create` skapas filen först om den saknas, och ett namn utan filändelse får `.erd.json`. |
| `erd_save` | | Sparar ett dokument som en editor har. VS Code behåller agentens redigeringar osparade tills verktyget anropas; Obsidian och en JetBrains-IDE sparar dem som de sparar dina, och verktyget skriver dem direkt. I headless-läge är varje redigering redan skriven och verktyget gör ingenting. |
| `erd_undo` | | Ångrar den senaste redigeringen som den här agenten gjorde, aldrig dina. Anrop som inte skapade något steg i ångrahistoriken hoppas över och nämns. |
| `erd_redo` | | Tillämpar på nytt den redigering som `erd_undo` senast ångrade. |

Se [Live och headless](./live-and-headless.md) för vad sparande och ångring gör i varje läge.

## Läsa ett dokument {#reading-a-document}

| Verktyg | Argument | Vad det gör |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Inställningarna och antalen, sedan en sida tabeller med deras index och relationer, varje tabell med sitt id, sin position och storlek på arbetsytan, sitt antal kolumner och sin tabellgrupp om den ingår i en. Utom vid sökning följer tabellgrupperna och därefter anteckningarna efter tabellerna. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?` | De angivna entiteterna i sin helhet: tabeller med sina kolumner och sin tabellgrupp, relationer med sina kolumner samt `onDelete` och `onUpdate`, index med sina kolumner, anteckningar med sin text, tabellgrupper med sina tabeller. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `tableIds?`, `tableNames?`, `groupNames?` | Hela dokumentet på en gång i ett av fyra format, eller DDL-koden för bara vissa tabeller eller tabellgrupper. |

En agent hittar id:n med `erd_list`, läser kolumner och andra detaljer med `erd_get` och skickar dessa id:n till redigeringsverktygen.
En tabells storlek i `erd_list` är den ruta som tabellen tar upp på arbetsytan: höjden exakt, bredden ungefärlig.
En tabellgrupp listas med den rektangel som den lagrar, tillsammans med sitt namn, sin färg och hur många tabeller den innehåller.
Varje relation listas en gång, tillsammans med en av sina två tabeller.
De inställningar som `erd_list` och `erd_read` rapporterar är de som filen sparar – se [Inställningar](#settings).

`erd_read` tar ett av fyra format:

| `format` | Vad det svarar med |
| --- | --- |
| `snapshot` | Kompakt JSON med varje entitet och dess id, tabellgrupper inräknade, samt inställningarna med skripten för Schema SQL. Det utelämnar det som skiljer sig mellan olika betraktare: uppmätta bredder, staplingsordningen, vyn och fliken. Blir stort för ett stort schema. |
| `sql` | DDL-kod för en av de åtta databaserna `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` eller `SQLite`. Standardvärdet för `vendor` är den databas som dokumentet är inställt på. DDL-koden för hela dokumentet innehåller dess skript före och efter tabellerna. Med `tableIds`, `tableNames` eller `groupNames` bara de tabellerna, med de sekundärnycklar som de innehåller och utan skript. Sekundärnycklar skrivs med sina åtgärder för ON DELETE och ON UPDATE, utom de som måldatabasen utelämnar – se [ON DELETE och ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | Hela dokumentet exakt som en sparning skriver filen, inklusive redigeringar som editorn ännu inte har sparat – se [Lagringsform och körtidsvärde](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Enbart dokumentets skript före och efter tabellerna, som `{"before":"…","after":"…"}`, vart och ett tomt när det inte är angivet, oavsett hur stort schemat är. |

Bara formatet `sql` tar `vendor`, `statements`, `header`, `tableIds`, `tableNames` och `groupNames`, och andra format nekar dem.

- `statements`: `create`, som är standard; `ifNotExists`, som skriver `CREATE TABLE IF NOT EXISTS` för MySQL, MariaDB, PostgreSQL, SQLite och Databricks och ett vanligt `CREATE TABLE` för de övriga; eller `recreate`, som tar bort tabellerna innan de skapas, där Snowflake i stället skriver `CREATE OR REPLACE TABLE`.
- `header`: `none`, som är standard; `use`, som väljer den databas eller det schema som dokumentets databasnamn anger; eller `createAndUse`, som först skapar databasen eller schemat. Oracle har bara `use`, så `createAndUse` skriver `use` där, och PostgreSQL har bara `createAndUse`, så `use` skriver ingen inledning där. SQLite skriver ingen, och ingen databas skriver någon så länge databasnamnet är tomt eller inte är en enkel identifierare.
- `groupNames`: tabellerna i de namngivna tabellgrupperna, efter namn oavsett skiftläge, sammanslagna med `tableIds` och `tableNames`. Ett namn som inte matchar någon grupp nekas med `notFound`. En grupp utan tabeller lägger inte till någon, och en läsning som blir utan en enda tabell, som när alla angivna grupper är tomma och ingen tabell anges, nekas med `invalidArgs`.

`statements` och `header` gäller även DDL-koden för vissa tabeller. De fungerar som alternativen `Statements` och `Header` på fliken [Schema SQL](../guide/guides/schema-sql.md#options-panel) i editorn, men fliken utgår från `If not exists` och `CREATE + USE`.
Namn omges av den typ av citattecken som filen sparar, den låsta typen när `Bracket Type` är låst – se [Lås](../guide/guides/settings.md#lock).

### Stora scheman {#large-schemas}

Scheman med hundratals eller tusentals tabeller fungerar också.
En läsning svarar med högst 40 000 tecken, under den gräns där Claude Code lägger undan ett verktygsresultat i en fil.

- `erd_list` svarar med en sida på 100 som standard, först tabellerna, sedan tabellgrupperna, sedan anteckningarna, och anger med `nextOffset` och en `note` var nästa sida börjar. Skicka det värdet på `nextOffset` som `offset`, med samma `query`.
- `query` hittar tabeller efter ord i ett tabell- eller kolumnnamn eller en kommentar, oavsett skiftläge. Tabeller vars namn innehåller fler av orden kommer först. En sökning listar inga tabellgrupper eller anteckningar.
- `namesOnly` listar enbart tabellnamnen, ungefär 2 000 korta namn i ett svar.
- `erd_get` och `erd_read` tar `tableNames` såväl som id:n, och `erd_read` tar `groupNames`, så en agent som ombeds ta fram en SQL-fråga mot ett stort schema läser DDL-koden för bara de tabeller den behöver.
- `erd_get` listar under `missing` de id:n och namn som inte pekar på något, och under `notReturned` de id:n som ett svar inte har plats för, så att de kan begäras igen.
- En läsning som är för stor för ett svar nekas med `tooLarge`, tillsammans med hur den kan begränsas.

## Redigeringsverktyg {#edit-tools}

Id:n kommer från `erd_list` och `erd_get`, eller från `createdIds` i det anrop som skapade entiteten.
Ett nytt id består av 25 gemena bokstäver och siffror, som `03h17be2plxpj5n59tqag7ogj`, medan ett id som dokumentet redan har behåller sin form, så dra inga slutsatser av hur ett id ser ut.
`x` och `y` är vänster- och överkanten på arbetsytan, i pixlar, och en färg är en hexadecimal CSS-färg som `#3b82f6`, eller en tom sträng, som tar bort färgen.

### Tabeller {#tables}

| Verktyg | Argument | Vad det gör |
| --- | --- | --- |
| `erd_add_table` | | Lägger till en tom tabell på en ledig plats och returnerar dess id i `createdIds`. |
| `erd_remove_table` | `tableId` | Tar bort en tabell med dess kolumner, index och alla relationer som berör den. |
| `erd_change_table_name` | `tableId`, `value` | Byter namn på en tabell. |
| `erd_change_table_comment` | `tableId`, `value` | Anger kommentaren för en tabell. En tom sträng tömmer den. |
| `erd_change_table_color` | `tableId`, `color` | Anger färgen för en tabell. |
| `erd_move_table` | `tableId`, `x`, `y` | Flyttar en tabell till en position på arbetsytan. |
| `erd_move_tables` | `positions` | Flyttar flera tabeller i en redigering, som ett enda `erd_undo` ångrar. `positions` innehåller `{ tableId, x, y }` per tabell, varje tabell högst en gång. |
| `erd_sort_tables` | | Placerar alla tabeller i rader över arbetsytan, de med färst kolumner först, så som `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` och `erd_import_aml` placerar dem. Tabellerna i en tabellgrupp hålls samman, och varje grupps ruta anpassas runt dem. |

### Kolumner {#columns}

| Verktyg | Argument | Vad det gör |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Lägger till en tom kolumn i en tabell och returnerar dess id i `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Tar bort kolumner från en tabell, med de relationer och indexposter som använder dem. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Byter namn på en kolumn. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Anger datatypen, som `INT` eller `VARCHAR(255)`. När [Synkronisera datatyp i relationer](../guide/guides/settings.md#relationship-datatype-sync) är på följer ändringen relationerna åt båda hållen, så som den gör i editorn: en serial-typ når sekundärnycklarna som den heltalstyp den lagrar, på samma sätt som `erd_add_relationship` kopierar den, och en serial-nyckel behåller sin typ när en av dess sekundärnycklar ändras, vilket stoppar ändringen där. Det är användaren som slår på och av synkroniseringen, och `erd_list` rapporterar den som `relationshipDataTypeSync`. |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Anger standardvärdet, som SQL-text. En tom sträng tömmer det. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Anger kommentaren. En tom sträng tömmer den. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` gör kolumnen till en del av primärnyckeln, `false` tar ut den ur nyckeln. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | Anger om kolumnen är unik. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | Anger om kolumnen är `NOT NULL`. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | Anger om kolumnen har automatisk uppräkning. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | Flyttar en kolumn inom sin tabell till en annan kolumns position. |

### Relationer {#relationships}

`relationshipType` är kardinaliteten vid barnänden: `ZeroOne`, `ZeroN`, `OneOnly` eller `OneN`.
Starttabellen är föräldratabellen, den refererade sidan som har primärnyckeln, och sluttabellen är barntabellen.
`onDelete` och `onUpdate` är sekundärnyckelns åtgärder för ON DELETE och ON UPDATE: `none`, `noAction`, `cascade`, `setNull`, `setDefault` eller `restrict`.
`none` skriver ingen klausul, så databasens standardbeteende gäller – se [ON DELETE och ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).
En åtgärd som utelämnas i `erd_add_relationship` eller `erd_link_columns` blir `none`.

| Verktyg | Argument | Vad det gör |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Skapar en relation mellan två tabeller. Verktyget kopierar föräldratabellens primärnyckel till barntabellen som sekundärnyckelkolumner och skapar först en primärnyckelkolumn om föräldratabellen saknar en. Varje sekundärnyckelkolumn får sitt namn på samma sätt som när en relation ritas i editorn: nyckeln `id` i `users` ger `users_id`, och en nyckel som `member_id` behåller sitt namn – se [Namn på sekundärnyckelkolumner](../guide/guides/relationship-editing.md#foreign-key-column-names). Varje kolumn kopierar sin nyckels datatyp, förutom att en serial-nyckel ger den heltalstyp den lagrar, som `integer` för `serial4`, och ett ensamt `serial` förblir `serial` utanför PostgreSQL, MySQL och MariaDB – se [Identifierande relationer](../guide/guides/relationship-editing.md#identifying-relationships). `createdIds` innehåller den nya nyckelkolumnen om en sådan skapades, sekundärnyckelkolumnerna och sist relationens id. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Ritar en relation mellan befintliga kolumner och parar ihop start- och slutkolumner efter position. Verktyget byter inte namn på någon kolumn och ändrar ingen datatyp. |
| `erd_remove_relationship` | `relationshipId` | Tar bort en relationslinje. Dess sekundärnyckelkolumner finns kvar i tabellen. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Ändrar kardinaliteten för en relation. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Anger ON DELETE-åtgärden för en relation: vad som händer med barnraderna när en föräldrarad tas bort. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Anger ON UPDATE-åtgärden för en relation: vad som händer med barnraderna när nyckeln i en föräldrarad ändras. |

`erd_add_relationship` namnger sekundärnyckelkolumnerna när verktyget körs, så namnge föräldratabellen och dess primärnyckel först.

Inget verktyg ändrar kolumnerna i en befintlig relation så som dialogrutan [Mappa kolumner](../guide/guides/relationship-editing.md#map-columns) i editorn gör.
För att mappa en relation till andra kolumner kör du `erd_remove_relationship`, som lämnar kvar dess sekundärnyckelkolumner i tabellen, och `erd_link_columns` med de önskade kolumnerna i ett och samma anrop till `erd_batch`, som ett enda `erd_undo` ångrar.

### Index {#indexes}

Id:t för en indexkolumn är en post i den kolumnlista för indexet som `erd_get` ger, inte tabellkolumnens id.

| Verktyg | Argument | Vad det gör |
| --- | --- | --- |
| `erd_add_index` | `tableId` | Lägger till ett tomt index i en tabell och returnerar dess id i `createdIds`. |
| `erd_remove_index` | `indexId` | Tar bort ett index. |
| `erd_change_index_name` | `indexId`, `value` | Byter namn på ett index. |
| `erd_set_index_unique` | `indexId`, `value` | Anger om indexet är unikt. |
| `erd_add_index_column` | `indexId`, `columnId` | Lägger till en kolumn från indexets tabell och returnerar id:t för den nya indexkolumnen. En kolumn som redan finns i indexet lämnas orörd. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | Tar bort en kolumn från ett index. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | Flyttar en kolumn inom ett index till positionen för en annan av dess kolumner. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | Anger sorteringsordningen för en kolumn i ett index, `ASC` eller `DESC`. |

### Anteckningar {#memos}

| Verktyg | Argument | Vad det gör |
| --- | --- | --- |
| `erd_add_memo` | | Lägger till en tom anteckning på en ledig plats och returnerar dess id i `createdIds`. |
| `erd_remove_memo` | `memoId` | Tar bort en anteckning. |
| `erd_change_memo_value` | `memoId`, `value` | Ersätter texten i en anteckning. |
| `erd_change_memo_color` | `memoId`, `color` | Anger färgen för en anteckning. |
| `erd_move_memo` | `memoId`, `x`, `y` | Flyttar en anteckning till en position på arbetsytan. |
| `erd_resize_memo` | `memoId`, `width`, `height` | Ändrar storlek på en anteckning. Bredden måste vara minst ungefär `116` pixlar och höjden minst `100`. Verktyget skapar inget steg i ångrahistoriken, eftersom editorn bara registrerar en storleksändring av en anteckning när den görs genom att dra. |

När anteckningar är dolda med [View Option](../guide/guides/table-related-functions.md#table-view-options) → `Memos` lägger `erd_add_memo` ändå till en, och den förblir dold tills anteckningar visas igen.
`erd_list` och `erd_get` listar även dolda anteckningar.

### Tabellgrupper {#table-groups}

En tabellgrupp är en namngiven ruta som ritas bakom gruppens tabeller, och dess färg syns på rutan och tvärs över tabellhuvudena i gruppens tabeller – se [Tabellgrupper](../guide/guides/table-groups.md).
En tabell ingår i högst en grupp. `erd_move_table`, `erd_move_tables` och `erd_move_table_group` ändrar aldrig vilka tabeller en grupp innehåller, var de än placerar en tabell, medan en tabell i editorn går med i eller lämnar en grupp där den släpps – se [Lägga till och ta bort tabeller](../guide/guides/table-groups.md#adding-and-removing-tables). `erd_add_table_group` och `erd_set_table_group` lägger tabeller i en grupp, och `erd_remove_table_group` lämnar dess tabeller utan grupp.
En grupp lagrar en rektangel, minst `160` pixlar bred och `100` hög, namnlisten inräknad, och editorn ritar rutan förstorad så att den rymmer var och en av gruppens tabeller.

| Verktyg | Argument | Vad det gör |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | Lägger till en grupp och returnerar dess id i `createdIds`. Skicka antingen `tableIds` eller en rektangel, `x`, `y`, `width` och `height` tillsammans. Med `tableIds` lämnar varje tabell den grupp den eventuellt låg i, och rektangeln anpassas runt tabellerna så som [Gruppera markerade tabeller](../guide/guides/table-groups.md#grouping-selected-tables) anpassar den. En rektangel tar in varje tabell utan grupp vars mittpunkt ligger inom den, så som [att rita en grupp](../guide/guides/table-groups.md#drawing-a-group) gör. Ett tomt `name` lämnar gruppen namnlös. Ett enda `erd_undo` tar bort gruppen och lägger tillbaka varje tabell i den grupp den låg i. |
| `erd_remove_table_group` | `groupId` | Tar bort en grupp. Dess tabeller stannar där de är, utan grupp. |
| `erd_change_table_group_name` | `groupId`, `value` | Byter namn på en grupp. En tom sträng gör den namnlös. |
| `erd_change_table_group_color` | `groupId`, `color` | Anger färgen för en grupp. |
| `erd_move_table_group` | `groupId`, `x`, `y` | Flyttar en grupp så att dess rektangel börjar i den punkten, med tabellerna förskjutna lika långt, så som att dra i gruppens namnlist gör. En förflyttning under 20 pixlar, vågrätt och lodrätt sammanlagt, skapar inget steg i ångrahistoriken. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | Anger rektangeln för en grupp, medan dess tabeller stannar där de är. Utelämnas `x` och `y` behålls hörnet. En rektangel som inte skulle rymma gruppens tabeller med deras utfyllnad nekas, med ett meddelande som anger den ruta den måste rymma. |
| `erd_set_table_group` | `tableIds`, `groupId` | Lägger tabeller i en grupp, där var och en lämnar den grupp den eventuellt låg i. Ett `groupId` som är `null` eller en tom sträng tar ut dem ur alla grupper. |

När grupper är dolda med `View Option` → `Table Groups` lägger de här verktygen ändå till och ändrar grupper, som förblir dolda tills grupper visas – se [Dölja grupper](../guide/guides/table-groups.md#hiding-groups).
`erd_sort_tables` håller samman varje grupps tabeller, `erd_import_dbml` och `erd_import_json` tar med grupper – se [Import](#import) – och `erd_read` skriver DDL-koden för valda grupper med `groupNames`.
En version av ERD Editor som kom före tabellgrupperna tar bort en fils grupper när den sparar filen, så som VS Code-tillägget före `4.0.0` och Obsidian- och JetBrains-pluginen före `1.0.0` gör – se [Uppdatera](./installation.md#updating).

### Inställningar {#settings}

En agent anger inställningarna för själva schemat: databasen, dess namn och skripten för [Schema SQL](../guide/guides/schema-sql.md).
Alla andra inställningar som dokumentet lagrar anger användaren i editorn: [visningsalternativen](../guide/guides/table-related-functions.md#table-view-options), alternativen på fliken [Inställningar](../guide/guides/settings.md), kodgeneratorns språk och skiftlägen för namn, typen av citattecken och [låsen](../guide/guides/settings.md#lock).
Inget verktyg ändrar dem, utom importverktygen i läget `replace`: `erd_import_json` tar med inställningarna och låsen från det dokument som verktyget läser in, och de övriga fyra flyttar tillbaka vyn till början av arbetsytan – se [Import](#import).
Servern tog i version `1.0.0` bort de verktyg som anger dem: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` och `erd_set_show`.

`erd_list` och formatet `snapshot` i `erd_read` rapporterar inställningarna så som filen sparar dem, där `lockSettings` innehåller en flagga per lås: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase` och `bracketType`.
Är språket, skiftläget för namn eller typen av citattecken låst rapporteras det med sitt låsta värde, det värde som filen behåller och som varje editor öppnar med, oavsett vad en editor visar på skärmen. Vyn och fliken rapporteras inte.

`erd_set_ddl_script` skapar ett steg i ångrahistoriken. `erd_set_database` och `erd_set_database_name` skapar inget, så `erd_undo` kan inte ångra dem.

| Verktyg | Argument | Vad det gör |
| --- | --- | --- |
| `erd_set_database` | `value` | Anger databasen: `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks` eller `Snowflake`. Valet styr databasens datatyper och den DDL-kod som `erd_read` skriver när inget `vendor` anges. |
| `erd_set_database_name` | `value` | Anger databasnamnet, som inledningarna `use` och `createAndUse` i `erd_read` hänvisar till. |
| `erd_set_ddl_script` | `position`, `sql` | Anger ett av de två skript som skrivs runt tabellerna – se [Skript före och efter tabellerna](../guide/guides/schema-sql.md#before-and-after-scripts). `position` är `before`, som skrivs före tabellerna, till exempel `CREATE EXTENSION` eller `CREATE SCHEMA`, eller `after`, som skrivs efter dem, till exempel `GRANT` eller `CREATE VIEW`. `sql` ersätter hela skriptet, högst 10 000 tecken, och en tom sträng tar bort det. Läs först det aktuella skriptet med formatet `scripts` i `erd_read`. |

Ett skript hamnar som det är i DDL-koden för alla databaser, så skriv det för dokumentets databas. För MSSQL läggs en rad med `GO` till efter ett skript vars sista rad inte är `GO`.
En version av ERD Editor som kom före de här skripten tar bort en fils skript när den sparar filen, så som VS Code-tillägget före `4.0.0` och Obsidian- och JetBrains-pluginen före `1.0.0` gör – se [Uppdatera](./installation.md#updating).

### Import {#import}

De här verktygen läser in ett schema så som menyn Importera i editorn gör – se [Importera eller exportera filer](../guide/guides/file-import-export.md).
Vart och ett tar texten som `value` samt `mode`: `replace`, som är standard, eller `append`.

| Verktyg | Argument | Vad det gör |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | Läser in SQL-DDL, satser som `CREATE TABLE` och liknande. |
| `erd_import_graphql` | `value`, `mode?` | Läser in GraphQL-SDL. |
| `erd_import_dbml` | `value`, `mode?` | Läser in DBML. Varje `TableGroup` blir en tabellgrupp med de tabeller som den anger – se [DBML](../guide/guides/file-import-export.md#dbml). |
| `erd_import_aml` | `value`, `mode?` | Läser in AML. |
| `erd_import_json` | `value`, `mode?` | Läser in ett JSON-dokument från erd-editor, till exempel en annan `.erd.json`-fil. |

`replace` ersätter dokumentet, och `erd_undo` återställer det tidigare:

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` och `erd_import_aml` ersätter alla tabeller, relationer, index, anteckningar och tabellgrupper. De behåller dokumentets inställningar, låsen inräknade, utom vyn, som går tillbaka till början av arbetsytan vid 100 %.
- `erd_import_json` ersätter hela dokumentet, inställningarna inräknade: JSON-dokumentets inställningar och lås ersätter det här dokumentets, och en JSON som inte anger några lås slår på alla lås och placerar vyn i början av arbetsytan. Utgå från texten som formatet `json` i `erd_read` ger om du vill behålla det här dokumentets inställningar. En tom text ger ett nytt dokument, som det som `erd_open_document` skapar med `create`.

`append` lägger till importen i dokumentet, så som [Importera och lägg till](../guide/guides/file-import-export.md#import-and-add) i editorn gör, och ett enda `erd_undo` tar bort hela tillägget:

- Det som texten innehåller kommer in som nya entiteter med nya id:n, i ett block under allt som dokumentet innehåller, dolda anteckningar och tabellgrupper inräknade, i linje med dess vänsterkant. Varje tabell och inställning som redan finns stannar kvar, även en tabell med samma namn: ingenting slås samman efter namn.
- Relationer och index kommer bara in mellan de tabeller som importen tar med, så en sekundärnyckel till en tabell som texten inte deklarerar faller bort.
- `erd_import_sql`, `erd_import_graphql` och `erd_import_aml` lägger till tabeller med deras relationer och index, och `erd_import_dbml` även dess tabellgrupper. `erd_import_json` lägger till tabeller, relationer, index, anteckningar och tabellgrupper, aldrig dess inställningar, och nekar en tom text.

Ett JSON-dokument behåller sin egen layout, tabellgrupperna inräknade: där det placerar sina tabeller med `replace` och inuti det tillagda blocket med `append`.
Tabellerna från SQL, GraphQL, DBML och AML placeras i rader, de med färst kolumner först och varje grupps tabeller samlade, så som `erd_sort_tables` placerar dem, aldrig med `Flow` så som editorns egen import lägger ut dem när den kan. De fyra verktygen nekar en tom text i båda lägena.

## erd_batch {#erd_batch}

`erd_batch` kör flera redigeringsverktyg i ordning som en enda redigering, allt eller inget.

- `operations` innehåller upp till 100 poster, var och en `{ tool, as?, args? }`, där `args` är verktygets argument utan `path`.
- Operationerna prövas först på en kopia av dokumentet. En nekad operation nämns, som `operations[1] erd_remove_table: …`, och ingenting tillämpas.
- Ett enda `erd_undo` ångrar hela batchen, utom de operationer som det inte kan ångra, vilka `undoNote` i resultatet nämner: operationer med ett verktyg som inte skapar något steg i ångrahistoriken, som `erd_set_database`, och operationer som ändrade dokumentet utan att skapa något, som en kort förflyttning med `erd_move_table_group`. En batch som inte skapade något steg i ångrahistoriken alls hoppas över av `erd_undo`. `historyEntries` i resultatet räknar stegen i editorns historik inuti batchen, inte anrop till `erd_undo`.
- I en live-session tar editorn emot hela batchen eller ingenting av den.

En agent kan inte veta vilka id:n en batch skapar före anropet, så en operation som namnges med `as` låter en senare operation referera till dem: `$name` eller `$name.0` för dess första skapade id, `$name.1` för dess andra och `$name.last` för dess sista.
Ett namn består av ASCII-bokstäver, siffror och understreck, börjar inte med en siffra och namnger bara en operation.
En referens löses bara upp där ett argument tar emot id:t för en entitet, så ett namn eller en kommentar med texten `$x` förblir text.

En tabell med sina kolumner och en relation, i ett enda anrop:

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

`users` och dess nyckel `id` namnges före relationen, så sekundärnyckelkolumnen som läggs till i `orders` blir `users_id`.

## Resultat {#results}

En redigering svarar med en rad JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Fält | Betydelse |
| --- | --- |
| `mode` | `live` eller `headless` – se [Live och headless](./live-and-headless.md). |
| `createdIds` | Id:n för det som anropet skapade, i ordning. |
| `batches`, `historyEntries` | Hur många ändringsbatcher anropet skickade och hur många steg i editorns historik det skapade. |
| `undoable`, `undoNote` | `undoable` är `false` när `erd_undo` kommer att hoppa över anropet, och `undoNote` anger varför: verktyget skapar inget steg i ångrahistoriken, anropet ändrade dokumentet utan att skapa något, som en förflyttning med `erd_move_table_group` under 20 pixlar gör, eller dokumentet hade redan värdet. Ett resultat från `erd_batch` har alltid en `undoNote`. När batchen skapade ett steg i ångrahistoriken anger `undoNote` att ett enda `erd_undo` ångrar batchen och nämner varje operation som det lämnar kvar; när den inte skapade något har resultatet `undoable: false` och `undoNote` anger att `erd_undo` hoppar över den. |
| `mismatch` | Finns när anropet skapade ett annat antal batcher eller steg i historiken än verktyget deklarerar. |
| `notes` | Finns när något i sessionen ändrades, till exempel en editor som avslutades eller slutade betjäna dokumentet, eller en fil som ändrades på disken. |

Ett nekande är ett felresultat med en kod och ett meddelande som säger vad du ska göra:

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | Orsak |
| --- | --- |
| `notFound` | Ett id pekar inte på något befintligt, eller så finns filen inte. |
| `invalidArgs` | Ett argument saknas eller har fel värde. |
| `invalidPath` | Sökvägen är inte ett ERD-dokument. I Windows även en sökväg med ett namn som Windows inte lagrar så som det är skrivet, eller en sökväg som leder till ett dokument som en editor har under en annan sökväg, som meddelandet anger. |
| `invalidDocument` | Filen är inte ett dokument som editorn kan läsa. |
| `tooLarge` | En läsning ryms inte i ett svar. |
| `blocked` | En editor med hubben avstängd har dokumentet. Meddelandet anger hur du slår på den: i VS Code litar du på arbetsområdet och slår på `dineug.erd-editor.agentHub.enabled`, eller läser in fönstret igen; i Obsidian slår du på Coding agents, eller läser in Obsidian igen; i en JetBrains-IDE slår du på Coding agents, eller startar om IDE:n om inställningen är på. |
| `hubDisabled` | En JetBrains-IDE har dokumentet bara i ett projekt som den inte litar på. Läsningar fungerar fortfarande; lita på projektet för att låta agenten redigera. |
| `conflict` | Filen ändrades på disken under anropet. Ingenting skrevs. |
| `hubAppeared`, `hubGone` | En editor började betjäna ett dokument som agenten redigerade på disken, eller så körs editorn som betjänade det fortfarande men dess låsfil och anslutning är borta. Ingenting skrevs. |
| `notSaved` | `erd_save` kunde inte spara editorns dokument. |
| `readonly` | Editorn har dokumentet skrivskyddat, till exempel en fil som den inte kan skriva till eller inte kan läsa som ett diagram. Utan editor är själva filen skrivskyddad, till exempel en Perforce- eller TFVC-fil som inte är utcheckad. Ingenting skrevs. |
| `protocolMismatch` | Tillägget eller pluginet ERD Editor i editorn och servern använder olika protokollversioner, till exempel servern i version `1.0.0` med ett VS Code-tillägg i version `3.x`. Även läsningar nekas, och meddelandet anger vilken sida som ska uppdateras – se [Uppdatera](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | En editors hubb tog inte emot anslutningen, svarade inte inom 30 sekunder eller kopplade ned under anropet. I Windows betyder `hubUnreachable` också att Windows höll agenten borta från hubben: editorn körs med fler behörigheter än agenten, som när editorn startades som administratör men inte agenten, eller så körs agenten i en sandlåda. |

Andra koder är ovanligare, och varje nekande har ett meddelande som säger vad som hände.

Redigeringsverktygen, `erd_batch` och de tre läsverktygen nekar ett argument som de inte deklarerar, eller ett av fel typ, med ett JSON-RPC-fel av typen invalid params (`-32602`) innan de rör dokumentet, så ett felstavat argument ignoreras aldrig i tysthet.
De fem sessionsverktygen ignorerar argument som de inte känner till.
