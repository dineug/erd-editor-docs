---
sidebar_position: 4
description: Alla verktyg som MCP-servern för erd-editor erbjuder – läsning av ett dokument en sida i taget, ordlistornas kontroller, de 67 redigeringsverktygen, erd_batch och hur ett resultat och ett nekande ser ut.
---

# Verktyg

Servern erbjuder 77 verktyg: fem sessionsverktyg, fyra läsverktyg, 67 redigeringsverktyg med ett per redigeringsoperation och `erd_batch`, som kör flera redigeringsverktyg som en enda redigering.

Alla verktyg utom `erd_list_documents` tar dokumentets `path` som första argument, och tabellerna nedan utelämnar det.
Ett argument som är märkt med `?` är valfritt.

## Sessionsverktyg {#session-tools}

| Verktyg | Argument | Vad det gör |
| --- | --- | --- |
| `erd_list_documents` | | Listar ERD-dokument med `path`, `open`, `active`, `dirty` och `readonly`: dokumenten i den editor som betjänar arbetskatalogen, vilket i en JetBrains-IDE omfattar alla öppna projekt, annars ERD-filerna under arbetskatalogen. |
| `erd_open_document` | `create?` | Öppnar ett dokument för redigering, i ERD Editor i den editor som betjänar det, om det finns en sådan. Med `create` skapas filen först om den saknas, och ett namn utan filändelse får `.erd.json`. |
| `erd_save` | | Sparar ett dokument som en editor har. VS Code behåller agentens redigeringar osparade tills verktyget anropas; Obsidian och en JetBrains-IDE sparar dem som de sparar dina, och verktyget skriver dem direkt. I headless-läge är varje redigering redan skriven, som `saved: true` i dess resultat anger, och verktyget gör ingenting. |
| `erd_undo` | | Ångrar den senaste redigeringen som den här agenten gjorde, aldrig dina. Anrop som inte skapade något steg i ångrahistoriken hoppas över och nämns. |
| `erd_redo` | | Tillämpar på nytt den redigering som `erd_undo` senast ångrade. |

Se [Live och headless](./live-and-headless.md) för vad sparande och ångring gör i varje läge.

## Läsa ett dokument {#reading-a-document}

| Verktyg | Argument | Vad det gör |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Inställningarna och antalen, sedan en sida tabeller med deras index och relationer, varje tabell med sitt id, sin position och storlek på arbetsytan, sitt antal kolumner, sitt logiska namn om den har ett och sin tabellgrupp om den ingår i en. Utom vid sökning följer tabellgrupperna, anteckningarna och därefter domänerna, termerna och orden efter tabellerna. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?`, `wordIds?`, `termIds?`, `domainIds?` | De angivna entiteterna i sin helhet: tabeller med sina kolumner och sin tabellgrupp, relationer med sina kolumner samt `onDelete` och `onUpdate`, index med sina kolumner, anteckningar med sin text, tabellgrupper med sina tabeller samt ord, termer och domäner med alla sina fält. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `logicalNameAsComment?`, `tableIds?`, `tableNames?`, `groupNames?` | Hela dokumentet på en gång i ett av fyra format, eller DDL-koden för bara vissa tabeller eller tabellgrupper. |
| `erd_list_checks` | `level?`, `tableIds?`, `tableNames?`, `offset?`, `limit?` | Det som ordlistorna med ord, termer och domäner anmärker på, så som bladet `Checks` på fliken Ordlista i editorn listar det, en sida i taget. Verktyget ändrar ingenting – se [Ordlistornas kontroller](#dictionary-checks). |

En agent hittar id:n med `erd_list`, läser kolumner, ordlisterader och andra detaljer med `erd_get` och skickar dessa id:n till redigeringsverktygen.
En tabells storlek i `erd_list` är den ruta som tabellen tar upp på arbetsytan: höjden exakt, bredden ungefärlig.
En tabellgrupp listas med den rektangel som den lagrar, tillsammans med sitt namn, sin färg och hur många tabeller den innehåller.
Varje relation listas en gång, tillsammans med en av sina två tabeller.
En ordlisterad listas med sitt id, sitt `name` och det som den ger ett fysiskt namn eller en kolumn: en domäns `dataType`, en terms `physicalName` och `domainId` och ett ords `abbreviation`. Varje ordlista listar sina rader i den ordning som dess blad visar.
De inställningar som `erd_list` och `erd_read` rapporterar är de som filen sparar – se [Inställningar](#settings).

I `erd_get` och formatet `snapshot` i `erd_read` har varje tabell och kolumn sitt `logicalName`, en tom sträng när det saknas, och `nameDerived`, som är `true` medan namnet kommer från ordlistorna, så att ett nytt logiskt namn härleder det igen – se [Ordlistor](#dictionaries).
Varje kolumn har sitt `domainId`, och det har även varje term: en tom sträng när det saknas, eller för en domän som dokumentet inte längre listar.

`erd_read` tar ett av fyra format:

| `format` | Vad det svarar med |
| --- | --- |
| `snapshot` | Kompakt JSON med varje entitet och dess id, tabellgrupper och raderna med ord, termer och domäner inräknade, samt inställningarna med skripten för Schema SQL. Det utelämnar det som skiljer sig mellan olika betraktare: uppmätta bredder, staplingsordningen, vyn, fliken och namnvisningen. Blir stort för ett stort schema. |
| `sql` | DDL-kod för en av de åtta databaserna `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` eller `SQLite`. Standardvärdet för `vendor` är den databas som dokumentet är inställt på. DDL-koden för hela dokumentet innehåller dess skript före och efter tabellerna. Med `tableIds`, `tableNames` eller `groupNames` bara de tabellerna, med de sekundärnycklar som de innehåller och utan skript. Sekundärnycklar skrivs med sina åtgärder för ON DELETE och ON UPDATE, utom de som måldatabasen utelämnar – se [ON DELETE och ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | Hela dokumentet exakt som en sparning skriver filen, inklusive redigeringar som editorn ännu inte har sparat – se [Lagringsform och körtidsvärde](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Enbart dokumentets skript före och efter tabellerna, som `{"before":"…","after":"…"}`, vart och ett tomt när det inte är angivet, oavsett hur stort schemat är. |

Bara formatet `sql` tar `vendor`, `statements`, `header`, `logicalNameAsComment`, `tableIds`, `tableNames` och `groupNames`, och andra format nekar dem.

- `statements`: `create`, som är standard; `ifNotExists`, som skriver `CREATE TABLE IF NOT EXISTS` för MySQL, MariaDB, PostgreSQL, SQLite och Databricks och ett vanligt `CREATE TABLE` för de övriga; eller `recreate`, som tar bort tabellerna innan de skapas, där Snowflake i stället skriver `CREATE OR REPLACE TABLE`.
- `header`: `none`, som är standard; `use`, som väljer den databas eller det schema som dokumentets databasnamn anger; eller `createAndUse`, som först skapar databasen eller schemat. Oracle har bara `use`, så `createAndUse` skriver `use` där, och PostgreSQL har bara `createAndUse`, så `use` skriver ingen inledning där. SQLite skriver ingen, och ingen databas skriver någon så länge databasnamnet är tomt eller inte är en enkel identifierare.
- `logicalNameAsComment`: `true` skriver det logiska namnet för en tabell eller kolumn som dess kommentar medan kommentaren är tom eller bara består av blanktecken, där och i den form som varje databas skriver en kommentar, och behåller varje kommentar som innehåller text; `false`, som är standard, skriver inget logiskt namn – se [Logiska namn som kommentarer](../guide/guides/schema-sql.md#logical-names-as-comments).
- `groupNames`: tabellerna i de namngivna tabellgrupperna, efter namn oavsett skiftläge, sammanslagna med `tableIds` och `tableNames`. Ett namn som inte matchar någon grupp nekas med `notFound`. En grupp utan tabeller lägger inte till någon, och en läsning som blir utan en enda tabell, som när alla angivna grupper är tomma och ingen tabell anges, nekas med `invalidArgs`.

`statements`, `header` och `logicalNameAsComment` gäller även DDL-koden för vissa tabeller. De fungerar som alternativen `Statements` och `Header` och växlingsknappen `Write logical names into empty comments` på fliken [Schema SQL](../guide/guides/schema-sql.md#options-panel) i editorn, men fliken utgår från `If not exists` och `CREATE + USE`. Växlingsknappen är av från början, precis som `logicalNameAsComment`.
Namn omges av den typ av citattecken som filen sparar, den låsta typen när `Bracket Type` är låst – se [Lås](../guide/guides/settings.md#lock).

### Stora scheman {#large-schemas}

Scheman med hundratals eller tusentals tabeller fungerar också.
En läsning svarar med högst 40 000 tecken, under den gräns där Claude Code lägger undan ett verktygsresultat i en fil.

- `erd_list` svarar med en sida på 100 som standard, först tabellerna, sedan tabellgrupperna, anteckningarna, domänerna, termerna och orden, med en och samma offset genom dem alla, och anger med `nextOffset` och en `note` var nästa sida börjar. Skicka det värdet på `nextOffset` som `offset`, med samma `query`.
- `query` hittar tabeller efter ord i ett tabell- eller kolumnnamn, ett logiskt namn eller en kommentar, oavsett skiftläge. Tabeller vars namn eller logiska namn innehåller fler av orden kommer först. En sökning listar inga tabellgrupper, anteckningar eller ordlisterader.
- `namesOnly` listar enbart tabellnamnen, ungefär 2 000 korta namn i ett svar.
- `erd_get` och `erd_read` tar `tableNames` såväl som id:n, och `erd_read` tar `groupNames`, så en agent som ombeds ta fram en SQL-fråga mot ett stort schema läser DDL-koden för bara de tabeller den behöver.
- Ordlistorna kommer också i delar: `erd_list` bläddrar igenom deras rader efter tabellerna, och `erd_get` ger rader i sin helhet efter `domainIds`, `termIds` och `wordIds`.
- `erd_get` listar under `missing` de id:n och namn som inte pekar på något, och under `notReturned` de id:n som ett svar inte har plats för, så att de kan begäras igen.
- `erd_list_checks` svarar en sida i taget på samma sätt – se [Ordlistornas kontroller](#dictionary-checks).
- En läsning som är för stor för ett svar nekas med `tooLarge`, tillsammans med hur den kan begränsas.

### Ordlistornas kontroller {#dictionary-checks}

`erd_list_checks` listar kontrollerna från [bladet Kontroller](../guide/guides/dictionary.md#the-checks-sheet) i editorn, i samma ordning: först kontrollerna för orden, sedan de för termerna och domänerna, varje ordlista i den ordning som dess blad visar, och sedan varje tabell följd av sina kolumner.
Precis som på bladet körs en kontroll bara medan den ordlista som den läser innehåller en rad. Ett dokument vars ordlistor inte innehåller något ord, någon term eller någon domän kontrolleras inte alls: `total` är `0`, och `note` säger det.

- `level`: `error` eller `warning` för bara den nivån; båda som standard.
- `tableIds` och `tableNames`: bara kontrollerna för de tabellerna och deras kolumner, namn oavsett skiftläge, vilket utelämnar ordlistornas egna rader. Ett id eller ett namn som inte pekar på någon tabell nekas med `notFound`.
- `offset` och `limit`: en sida med 100 kontroller som standard, som också slutar där ett svar är fullt. Medan fler följer anger `nextOffset` och en `note` var nästa sida börjar; skicka det som `offset` med samma filter. När du har åtgärdat några kontroller listar du igen från offset `0`: en åtgärdad kontroll försvinner ur listan, så en senare offset skulle hoppa över kontroller som fortfarande inte är åtgärdade.

Svaret innehåller `total`, hur många kontroller filtren behåller; `counts`, hur många av dem varje kod har, där en kod utan några utelämnas; och sidan som `checks`.
Varje kontroll anger sin `level`, sin `code` och `kind` och `id` för sitt objekt: `table`, `column`, `word`, `term` eller `domain`. En kontroll för en kolumn lägger också till kolumnens `tableId` och namnet på dess tabell som `table`.
`name` är objektets namn, en tabells eller kolumns fysiska namn, med dess `logicalName` när den har ett. `field` är det som kontrollen läser: `name`, `logicalName` eller `domainId`. `text` är det som den hittade där, och `suggestions`, där ordlistorna erbjuder några, är det som ska användas i stället. Så kan en agent åtgärda en kontroll utan ett `erd_get`:

```json
{"level":"warning","code":"physicalNameMismatch","kind":"column","id":"8e1z0q4xk2m7cwd5tfb9h3ynp","tableId":"03h17be2plxpj5n59tqag7ogj","table":"users","name":"id","logicalName":"Member Number","field":"name","text":"id","suggestions":["MBR_NO"]}
```

| `code` | `level` | `Type` på bladet | Vad den hittar |
| --- | --- | --- | --- |
| `duplicateName` | `error` | `Duplicate name` | Ett namn som två rader i en och samma ordlista delar. Var och en av raderna listas. |
| `unknownDomain` | `error` | `Unknown domain` | En kolumn eller en term som är kopplad till en domän som dokumentet inte längre listar. `text` är domänens namn, eller dess id när inget namn är känt. |
| `forbiddenWord` | `error` | `Forbidden word` | Ett ord som något ord listar som förbjudet, i en tabells eller kolumns logiska namn eller i en terms namn. `suggestions` är standardorden. |
| `unregisteredWord` | `warning` | `Unregistered word` | Text som inget ord listar, på samma ställen. |
| `synonymWord` | `warning` | `Synonym` | En synonym som används i stället för ett standardord, på samma ställen. `suggestions` är standardorden. |
| `physicalNameMismatch` | `warning` | `Physical name mismatch` | En tabells eller kolumns fysiska namn som skiljer sig från det som termen för dess logiska namn ger. Förslaget är termens fysiska namn, eller det som dess ord bildar medan termen inte har något. |
| `domainTypeMismatch` | `warning` | `Domain type mismatch` | En kolumn vars datatyp inte är densamma som för den domän som den är kopplad till. `text` är kolumnens typ, och förslaget domänens. |

Hur varje kontroll läser ett namn beskrivs i [Vad varje kontroll hittar](../guide/guides/dictionary.md#what-each-check-finds).

## Redigeringsverktyg {#edit-tools}

Id:n kommer från `erd_list` och `erd_get`, eller från `createdIds` i det anrop som skapade entiteten.
Ett nytt id består av 25 gemena bokstäver och siffror, som `03h17be2plxpj5n59tqag7ogj`, medan ett id som dokumentet redan har behåller sin form, så dra inga slutsatser av hur ett id ser ut.
`x` och `y` är vänster- och överkanten på arbetsytan, i pixlar, och en färg är en hexadecimal CSS-färg som `#3b82f6`, eller en tom sträng, som tar bort färgen.

### Tabeller {#tables}

| Verktyg | Argument | Vad det gör |
| --- | --- | --- |
| `erd_add_table` | | Lägger till en tom tabell på en ledig plats och returnerar dess id i `createdIds`. |
| `erd_remove_table` | `tableId` | Tar bort en tabell med dess kolumner, index och alla relationer som berör den. |
| `erd_change_table_name` | `tableId`, `value` | Byter namn på en tabell. Namnet räknas då som skrivet för hand, så ett senare logiskt namn lämnar det som det är medan det inte är tomt – se [Ordlistor](#dictionaries). |
| `erd_change_table_comment` | `tableId`, `value` | Anger kommentaren för en tabell. En tom sträng tömmer den. |
| `erd_set_table_logical_name` | `tableId`, `value` | Anger det logiska namnet för en tabell. En tom sträng tömmer det och lämnar namnet. Medan tabellens namn är tomt eller har härletts härleder ordlistorna det från det logiska namnet – se [Ordlistor](#dictionaries). En term ger inte en tabell någon domän. |
| `erd_change_table_color` | `tableId`, `color` | Anger färgen för en tabell. |
| `erd_move_table` | `tableId`, `x`, `y` | Flyttar en tabell till en position på arbetsytan. |
| `erd_move_tables` | `positions` | Flyttar flera tabeller i en redigering, som ett enda `erd_undo` ångrar. `positions` innehåller `{ tableId, x, y }` per tabell, varje tabell högst en gång. |
| `erd_sort_tables` | | Placerar alla tabeller i rader över arbetsytan, de med färst kolumner först, så som `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` och `erd_import_aml` placerar dem. Tabellerna i en tabellgrupp hålls samman, och varje grupps ruta anpassas runt dem. |

### Kolumner {#columns}

| Verktyg | Argument | Vad det gör |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Lägger till en tom kolumn i en tabell och returnerar dess id i `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Tar bort kolumner från en tabell, med de relationer och indexposter som använder dem. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Byter namn på en kolumn. Namnet räknas då som skrivet för hand, precis som en tabells. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Anger datatypen, som `INT` eller `VARCHAR(255)`. När [Synkronisera datatyp i relationer](../guide/guides/settings.md#relationship-datatype-sync) är på följer ändringen relationerna åt båda hållen, så som den gör i editorn: en serial-typ når sekundärnycklarna som den heltalstyp den lagrar, på samma sätt som `erd_add_relationship` kopierar den, och en serial-nyckel behåller sin typ när en av dess sekundärnycklar ändras, vilket stoppar ändringen där. Det är användaren som slår på och av synkroniseringen, och `erd_list` rapporterar den som `relationshipDataTypeSync`. En kolumn som är kopplad till en domän kopplas från den när den får en annan typ än domänens, och det gör även varje kolumn som synkroniseringen når och vars nya typ skiljer sig från dess egen domäns – se [Koppla från](../guide/guides/dictionary.md#unlinking). |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Anger standardvärdet, som SQL-text. En tom sträng tömmer det. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Anger kommentaren. En tom sträng tömmer den. |
| `erd_set_column_logical_name` | `tableId`, `columnId`, `value` | Anger det logiska namnet för en kolumn. En tom sträng tömmer det och lämnar namnet. Medan kolumnens namn är tomt eller har härletts härleder ordlistorna det, och en terms domän kopplas till kolumnen och ger den domänens datatyp – se [Ordlistor](#dictionaries). |
| `erd_set_column_domain` | `tableId`, `columnId`, `domainId?`, `domainName?` | Kopplar en kolumn till en domän, angiven med id eller med namn, ett av de två. Kolumnen får domänens datatyp, som följer relationerna medan Synkronisera datatyp i relationer är på, med samma frånkoppling som i `erd_change_column_data_type`. Ett `domainId` som är `null` eller en tom sträng, eller ett tomt `domainName`, kopplar från kolumnen och behåller dess typ. |
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
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Skapar en relation mellan två tabeller. Verktyget kopierar föräldratabellens primärnyckel till barntabellen som sekundärnyckelkolumner och skapar först en primärnyckelkolumn om föräldratabellen saknar en. Varje sekundärnyckelkolumn får sitt namn på samma sätt som när en relation ritas i editorn: nyckeln `id` i `users` ger `users_id`, och en nyckel som `member_id` behåller sitt namn – se [Namn på sekundärnyckelkolumner](../guide/guides/relationship-editing.md#foreign-key-column-names). Varje kolumn kopierar sin nyckels datatyp, förutom att en serial-nyckel ger den heltalstyp den lagrar, som `integer` för `serial4`, och ett ensamt `serial` förblir `serial` utanför PostgreSQL, MySQL och MariaDB – se [Identifierande relationer](../guide/guides/relationship-editing.md#identifying-relationships). Varje kolumn får också sin nyckels logiska namn och kopplas till den domän som dess nyckel är kopplad till, om inte en serial-nyckel ger den en annan typ. `createdIds` innehåller den nya nyckelkolumnen om en sådan skapades, sekundärnyckelkolumnerna och sist relationens id. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Ritar en relation mellan befintliga kolumner och parar ihop start- och slutkolumner efter position. Verktyget byter inte namn på någon kolumn, ändrar ingen datatyp och kopierar inget logiskt namn och ingen domän. |
| `erd_remove_relationship` | `relationshipId` | Tar bort en relationslinje. Dess sekundärnyckelkolumner finns kvar i tabellen. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Ändrar kardinaliteten för en relation. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Anger ON DELETE-åtgärden för en relation: vad som händer med barnraderna när en föräldrarad tas bort. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Anger ON UPDATE-åtgärden för en relation: vad som händer med barnraderna när nyckeln i en föräldrarad ändras. |

`erd_add_relationship` namnger sekundärnyckelkolumnerna och kopierar deras nycklars logiska namn när verktyget körs. Ett senare namnbyte eller logiskt namn på nyckeln når inte fram till dem, så namnge föräldratabellen och dess primärnyckel, och ge nyckeln dess logiska namn, först.
De namn som verktyget ger räknas som skrivna för hand, så ett senare logiskt namn lämnar dem som de är, medan `erd_derive_physical_names` lämnar tillbaka dem till ordlistorna – se [Ordlistor](#dictionaries).

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

### Ordlistor {#dictionaries}

De här verktygen redigerar de tre ordlistorna på fliken [Ordlista](../guide/guides/dictionary.md) i editorn, som en tabells eller kolumns logiska namn härleder sitt fysiska namn från:

- Ett ord är ett standardord som logiska namn består av, med den förkortning som det skriver in i ett fysiskt namn, som `Member` och `MBR`.
- En term är ett helt logiskt namn med det fysiska namn som den ger och, för en kolumn, den domän som den kopplar till, som `Member Number` med `MBR_NO` och `Identifier`.
- En domän är en namngiven datatyp som kolumner kopplas till, som `Identifier` för `INT`.

| Verktyg | Argument | Vad det gör |
| --- | --- | --- |
| `erd_add_word` | `name`, `abbreviation`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Lägger till ett ord sist i ordlistan med ord och returnerar dess id i `createdIds`. `synonyms` och `forbiddenWords` är kommaseparerade: andra stavningar av ordet och ord som inte får användas i dess ställe. |
| `erd_update_word` | `wordId`, `name?`, `abbreviation?`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Ändrar de fält som skickas och lämnar resten. |
| `erd_remove_word` | `wordId` | Tar bort ett ord. |
| `erd_add_term` | `name`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Lägger till en term sist i ordlistan med termer och returnerar dess id i `createdIds`. Utan `physicalName` bildar orden ett om de kan, som `MBR_NO` för `Member Number`. |
| `erd_update_term` | `termId`, `name?`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Ändrar de fält som skickas och lämnar resten. Ett `name` som skickas medan termen inte har något fysiskt namn, eller med ett tomt `physicalName`, skriver också det fysiska namn som dess ord bildar, om de bildar ett. |
| `erd_remove_term` | `termId` | Tar bort en term. |
| `erd_add_domain` | `name`, `category?`, `dataType`, `description?` | Lägger till en domän sist i ordlistan med domäner och returnerar dess id i `createdIds`. `category` grupperar domäner, som `Number` eller `Text`. |
| `erd_update_domain` | `domainId`, `name?`, `category?`, `dataType?`, `description?` | Ändrar de fält som skickas och lämnar resten. En ny `dataType` når varje kolumn som är kopplad till domänen och följer relationerna medan Synkronisera datatyp i relationer är på, med samma frånkoppling som i `erd_change_column_data_type`. |
| `erd_remove_domain` | `domainId` | Tar bort en domän. De kolumner som är kopplade till den behåller sin datatyp, och både de och de termer som är kopplade till den visar ingen domän: deras `domainId` läses som en tom sträng. `erd_undo` tar tillbaka kopplingarna, och en sparning utelämnar dem ur filen. |
| `erd_derive_physical_names` | `scope`, `tableId?`, `columnId?` | Härleder fysiska namn igen från de logiska namnen, så som [Härled fysiska namn igen](../guide/guides/dictionary.md#derive-physical-names-again) i editorn gör, för en kolumn, en tabell eller hela dokumentet. |

- En ordlista innehåller varje namn en gång, så ett namn som en annan rad i samma ordlista redan har nekas med `invalidArgs`. Namn jämförs utan blanksteg i början och slutet och med hänsyn till skiftläge, så `Member` och `member` är två namn.
- En uppdatering anger raden med dess id och skickar minst ett fält. Värden som raden redan har ändrar ingenting och skapar inget steg i ångrahistoriken; ett tillägg eller en borttagning skapar alltid ett.
- En terms domän anges antingen med `domainId`, med `null` eller en tom sträng för ingen domän, eller med `domainName`, med en tom sträng för ingen domän. Ett `domainName` tar den första domänen med det namnet i ordlistans ordning, jämfört så som namn jämförs. Att skicka båda, eller ett `domainName` som ingen domän har, nekas. `erd_set_column_domain` tar emot en domän på samma sätt.
- Att ändra eller ta bort ett ord eller en term byter inte namn på något och kopplar inte från något: de namn och domäner som det gav förblir som de är. `erd_derive_physical_names` härleder namnen igen och kopplar till den domän som en term ger nu, men en kolumn som ingen term matchar nu, eller vars term inte ger någon domän, behåller den domän som den är kopplad till. `erd_set_column_domain` med ett tomt `domainId` kopplar från den.
- Inget verktyg importerar eller exporterar en ordlista som CSV, sorterar en ordlista eller infogar rader på en viss position, så som fliken Ordlista gör.

`erd_list` listar raderna, `erd_get` ger alla fält, formatet `snapshot` i `erd_read` innehåller dem alla och `erd_list_checks` listar det som ordlistorna anmärker på – se [Läsa ett dokument](#reading-a-document).

`erd_set_table_logical_name` och `erd_set_column_logical_name` härleder ett fysiskt namn så som editorn gör när ett logiskt namn skrivs – se [Härleda fysiska namn](../guide/guides/dictionary.md#deriving-physical-names):

- Ett namn härleds bara medan det är tomt eller självt har härletts, vilket läsningarna visar som `nameDerived: true`. Ett namn som inte är tomt och har skrivits för hand finns kvar, och bara det logiska namnet skrivs. `erd_change_table_name`, `erd_change_column_name`, importerna av SQL, GraphQL, DBML och AML och de sekundärnyckelkolumner som `erd_add_relationship` namnger skriver alla namn för hand. Ett namn som har bytts till en tom sträng härleds igen av nästa logiska namn.
- Den term vars namn är det logiska namnet har företräde, jämförd så som namn i ordlistorna jämförs. Den ger sitt fysiska namn, eller det som dess ord bildar medan den inte har något. För en kolumn kopplar den också till termens domän, även när inget namn härleds, och kolumnen får domänens datatyp, som följer relationerna medan Synkronisera datatyp i relationer är på.
- Utan en sådan term bildar orden namnet, med sina förkortningar sammanfogade med understreck: `Member Number` ger `MBR_NO`. Det är allt eller inget: en synonym, ett förbjudet ord, text som inget ord listar eller ett ord utan förkortning bildar ingenting, och namnet förblir som det var. Orden kopplar inte till någon domän, och det gör inte heller en term utan domän, så en kolumn behåller den domän som den är kopplad till.
- En kolumn vars härledda namn en annan kolumn i samma tabell redan har, oavsett skiftläge, behåller sitt namn, sitt `nameDerived` och sin domän.
- Att tömma ett logiskt namn lämnar det fysiska namnet som det är. Ett anrop vars logiska namn, och det som det härleder, redan finns på plats ändrar ingenting och skapar inget steg i ångrahistoriken.

`erd_derive_physical_names` tar ett `scope`: `column`, med `tableId` och `columnId`, för den kolumnen; `table`, med `tableId`, för tabellens namn och alla dess kolumner; eller `document`, utan id, för varje tabell och dess kolumner. Ett omfång som saknar ett id som det behöver, eller som får ett som det inte tar emot, nekas.
Varje omfattat namn som har ett logiskt namn lämnas tillbaka till ordlistorna, även ett namn som har skrivits för hand, och får det som de ger nu: en terms fysiska namn och, för en kolumn, dess domän och typ, eller annars det som orden bildar, vilket lämnar kolumnens domän som den är. Ett logiskt namn som inte härleder något lämnar namnet som det är, med `nameDerived` nu `true`. Ett namn utan logiskt namn förblir som det är, och det gör även en kolumn vars nya namn en annan kolumn i samma tabell har, som en andra sekundärnyckel till en och samma tabell, som också behåller sitt `nameDerived`. Ett enda `erd_undo` ångrar hela anropet.
Namnen i ett importerat schema är skrivna för hand, så namnge det från ordlistorna genom att ange de logiska namnen och sedan anropa `erd_derive_physical_names`. Det anropet ger en terms eget fysiska namn, som inte bildas på nytt när termens ord ändras. När du har ändrat orden i en term uppdaterar du därför termen först: skicka dess `name` med ett tomt `physicalName` för att låta orden bilda det på nytt, eller skicka det nya `physicalName`.

En version av ERD Editor som kom före fliken Ordlista tar bort en fils logiska namn, domänkopplingar och ordlisterader när den sparar filen, så som VS Code-tillägget före `4.2.0` och Obsidian- och JetBrains-pluginen före `1.2.0` gör. Av dem redigerar tillägget i version `4.0.0` eller `4.1.0` och pluginen i version `1.0.0` eller `1.1.0` fortfarande live med servern, men de varken visar eller behåller de logiska namn, domänkopplingar och ordlisterader som en agent skriver – se [Uppdatera](./installation.md#updating).

### Inställningar {#settings}

En agent anger inställningarna för själva schemat: databasen, dess namn och skripten för [Schema SQL](../guide/guides/schema-sql.md).
Alla andra inställningar som dokumentet lagrar anger användaren i editorn: [namnvisningen](../guide/guides/logical-names.md#name-view), [visningsalternativen](../guide/guides/table-related-functions.md#table-view-options), alternativen på fliken [Inställningar](../guide/guides/settings.md), kodgeneratorns språk och skiftlägen för namn, typen av citattecken och [låsen](../guide/guides/settings.md#lock).
Inget verktyg ändrar dem, utom importverktygen i läget `replace`: `erd_import_json` tar med inställningarna och låsen från det dokument som verktyget läser in, och de övriga fyra flyttar tillbaka vyn till början av arbetsytan – se [Import](#import).
Servern tog i version `1.0.0` bort de verktyg som anger dem: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` och `erd_set_show`.

`erd_list` och formatet `snapshot` i `erd_read` rapporterar inställningarna så som filen sparar dem, där `lockSettings` innehåller en flagga per lås: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase`, `bracketType` och `unlockNameViewMode`.
Den sista tolkas tvärtom: den är `false` medan låset `Name View` är på, som det är i ett nytt dokument och i en fil som sparades innan det låset fanns, och `true` när användaren har slagit av låset.
Är språket, skiftläget för namn eller typen av citattecken låst rapporteras det med sitt låsta värde, det värde som filen behåller och som varje editor öppnar med, oavsett vad en editor visar på skärmen. Vyn, fliken och namnvisningen rapporteras inte. En agent läser och skriver logiska namn oavsett vad namnvisningen visar.

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

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` och `erd_import_aml` ersätter alla tabeller, relationer, index, anteckningar och tabellgrupper. De behåller dokumentets inställningar, låsen inräknade, utom vyn, som går tillbaka till början av arbetsytan vid 100 %, och de behåller dess ordlistor med ord, termer och domäner. De tabeller som de tar med har inga logiska namn och är inte kopplade till någon domän.
- `erd_import_json` ersätter hela dokumentet, inställningarna och ordlistorna inräknade: JSON-dokumentets inställningar, lås, ord, termer och domäner ersätter det här dokumentets, och en JSON som inte anger några lås slår på alla lås och placerar vyn i början av arbetsytan. Varje betraktare behåller sin egen namnvisning, om inte JSON-dokumentet har låset `Name View` av, vilket tar med dess namnvisning. Utgå från texten som formatet `json` i `erd_read` ger om du vill behålla det här dokumentets inställningar. En tom text ger ett nytt dokument, som det som `erd_open_document` skapar med `create`.

`append` lägger till importen i dokumentet, så som [Importera och lägg till](../guide/guides/file-import-export.md#import-and-add) i editorn gör, och ett enda `erd_undo` tar bort hela tillägget:

- Det som texten innehåller kommer in som nya entiteter med nya id:n, i ett block under allt som dokumentet innehåller, dolda anteckningar och tabellgrupper inräknade, i linje med dess vänsterkant. Varje tabell och inställning som redan finns stannar kvar, även en tabell med samma namn: ingenting slås samman efter namn.
- Relationer och index kommer bara in mellan de tabeller som importen tar med, så en sekundärnyckel till en tabell som texten inte deklarerar faller bort.
- `erd_import_sql`, `erd_import_graphql` och `erd_import_aml` lägger till tabeller med deras relationer och index, och `erd_import_dbml` även dess tabellgrupper. `erd_import_json` lägger till tabeller, relationer, index, anteckningar och tabellgrupper, aldrig dess inställningar, och nekar en tom text. Dess tabeller och kolumner tar med sina logiska namn, men ingen kolumn kopplas till en domän, och inga av JSON-dokumentets ord, termer eller domäner kommer in.

Ett JSON-dokument behåller sin egen layout, tabellgrupperna inräknade: där det placerar sina tabeller med `replace` och inuti det tillagda blocket med `append`.
Tabellerna från SQL, GraphQL, DBML och AML placeras i rader, de med färst kolumner först och varje grupps tabeller samlade, så som `erd_sort_tables` placerar dem, aldrig med `Flow` så som editorns egen import lägger ut dem när den kan. De fyra verktygen nekar en tom text i båda lägena.

## erd_batch {#erd_batch}

`erd_batch` kör flera redigeringsverktyg i ordning som en enda redigering, allt eller inget.

- `operations` innehåller upp till 100 poster, var och en `{ tool, as?, args? }`, där `tool` är ett redigeringsverktyg och `args` är verktygets argument utan `path`. Ett läsverktyg, som `erd_list_checks`, nekas.
- Operationerna prövas först på en kopia av dokumentet. En nekad operation nämns, som `operations[1] erd_remove_table: …`, och ingenting tillämpas.
- Ett enda `erd_undo` ångrar hela batchen, utom de operationer som det inte kan ångra, vilka `undoNote` i resultatet nämner: operationer med ett verktyg som inte skapar något steg i ångrahistoriken, som `erd_set_database`, och operationer som ändrade dokumentet utan att skapa något, som en kort förflyttning med `erd_move_table_group`. En batch som inte skapade något steg i ångrahistoriken alls hoppas över av `erd_undo`. `historyEntries` i resultatet räknar stegen i editorns historik inuti batchen, inte anrop till `erd_undo`.
- I en live-session tar editorn emot hela batchen eller ingenting av den.

En agent kan inte veta vilka id:n en batch skapar före anropet, så en operation som namnges med `as` låter en senare operation referera till dem: `$name` eller `$name.0` för dess första skapade id, `$name.1` för dess andra och `$name.last` för dess sista.
Ett namn består av ASCII-bokstäver, siffror och understreck, börjar inte med en siffra och namnger bara en operation.
En referens löses bara upp där ett argument tar emot id:t för en entitet, även `wordId`, `termId` och `domainId`, så ett namn eller en kommentar med texten `$x` förblir text.
Ett `domainName` är också text, men det läses när dess operation körs, så det kan ange en domän som en tidigare operation i batchen har lagt till.

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

Ord, en domän och en term, och sedan en tabell som namnges från dem via sina logiska namn:

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

Termen bildar `MBR_NO` från sina ord, och tabellen får namnet `MBR`. Kolumnen `Member Number` får termens `MBR_NO` och dess domän, så den kopplas till `Identifier` och får typen `INT`, och `Member Name`, som ingen term har, bildas som `MBR_NM`.

## Resultat {#results}

En redigering svarar med en rad JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Fält | Betydelse |
| --- | --- |
| `mode` | `live` eller `headless` – se [Live och headless](./live-and-headless.md). |
| `saved` | `true` i resultatet av varje headless-redigering, `erd_batch`, `erd_undo` och `erd_redo`: filen innehåller ändringen när anropet svarar, så det finns inget kvar att spara. Ett resultat i live-läge har inget `saved`, eftersom editorn har ändringen – se [Spara](./live-and-headless.md#saving). |
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
| `protocolMismatch` | Tillägget eller pluginet ERD Editor i editorn och servern använder olika protokollversioner, till exempel servern i version `1.0.0` eller senare med ett VS Code-tillägg i version `3.x`. Även läsningar nekas, och meddelandet anger vilken sida som ska uppdateras – se [Uppdatera](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | En editors hubb tog inte emot anslutningen, svarade inte inom 30 sekunder eller kopplade ned under anropet. I Windows betyder `hubUnreachable` också att Windows höll agenten borta från hubben: editorn körs med fler behörigheter än agenten, som när editorn startades som administratör men inte agenten, eller så körs agenten i en sandlåda. |

Andra koder är ovanligare, och varje nekande har ett meddelande som säger vad som hände.

Redigeringsverktygen, `erd_batch` och de fyra läsverktygen nekar ett argument som de inte deklarerar, eller ett av fel typ, med ett JSON-RPC-fel av typen invalid params (`-32602`) innan de rör dokumentet, så ett felstavat argument ignoreras aldrig i tysthet.
De fem sessionsverktygen ignorerar argument som de inte känner till.
