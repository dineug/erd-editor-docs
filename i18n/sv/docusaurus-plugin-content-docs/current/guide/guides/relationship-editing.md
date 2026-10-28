---
sidebar_position: 7
description: Ta bort en relation, ändra dess typ, ange dess ON DELETE- och ON UPDATE-åtgärder, mappa den till befintliga kolumner med Mappa kolumner, läs relationslinjens notation och hur relationslinjer dras runt tabeller, arbeta med N:M-relationer och identifierande relationer och se vad nya sekundärnyckelkolumner kopierar från sin nyckel och hur de namnges.
---

# Redigera relationer

Relationer ritas via arbetsytans snabbmeny, arbetsytans verktygsfält, [snabbsökningen](./quick-search.md#what-the-palette-lists) eller med ett kortkommando – se [Börja redigera](./editing-start.md).  
Den här sidan beskriver vad du kan göra med en relation när den väl finns, hur [Mappa kolumner](#map-columns) låter en relation sluta på kolumner som barntabellen redan har och hur de sekundärnyckelkolumner som relationen lägger till namnges.

## Ta bort en relation {#deletion}

Du kan ta bort en relation via dess snabbmeny.

![Relationen från products till reviews tas bort via dess snabbmeny](/img/demo-relationship-remove.webp)

Det finns inget kortkommando för det, eftersom en relation inte markeras på samma sätt som en tabell eller en anteckning: `Delete` och `Backspace`, som tar bort det som är markerat, tar aldrig bort en relation för sig – se [Ta bort tabeller och anteckningar](./table-related-functions.md#table-and-memo-deletion).  
Relationer tas också bort tillsammans med det som de förbinder: om du tar bort en tabell tas alla relationer som berör den bort, och om du tar bort en kolumn tas alla relationer som använder den bort.

## Ändra typ {#type-change}

Typen ändras via `Relationship Type` i relationens snabbmeny.  
Fyra typer finns att välja mellan, och den aktuella har en bock:

- Zero One
- Zero N
- One Only
- One N

![En relation ändras från Zero N till One Only och sedan till One N i dess snabbmeny](/img/demo-relationship-type.webp)

Det är samma fyra typer som du börjar rita en relation med, var och en med ett eget kortkommando – se [Börja redigera](./editing-start.md).

## ON DELETE och ON UPDATE {#on-delete-and-on-update}

Åtgärderna anges via `On Delete` och `On Update` i relationens snabbmeny, mellan `Relationship Type` och `Map Columns`.  
Båda har samma sex menyalternativ, och det aktuella har en bock:

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

`Not set` skriver ingen sats, så databasens egen standardåtgärd gäller. En ny relation, ritad eller skapad i [Mappa kolumner](#map-columns), börjar med båda inställda på `Not set`, och om du senare väljer `Not set` rensas en åtgärd.  
De två är oberoende av varandra: om du ändrar den ena förblir den andra som den är.  
Relationslinjen visar vad som är angivet – se [Läsa en relationslinje](#reading-a-connector).  
En relation som kopieras och klistras in, eller dupliceras, tillsammans med sina tabeller behåller båda åtgärderna, och en import av Schema SQL, DBML eller AML tar med de åtgärder som filen deklarerar – se [Importera eller exportera filer](./file-import-export.md).

![ON DELETE CASCADE och ON UPDATE RESTRICT anges för relationen från orders till order_items via dess snabbmeny, etiketten visar D:C U:R, och sedan hålls pekaren över relationslinjen för att läsa av båda](/img/demo-referential-actions.webp)

Alla åtgärder kan väljas oavsett databas.  
En åtgärd som den valda [databasen](./table-related-functions.md#databases) utelämnar i sin Schema SQL har en nedtonad notering bredvid sig, till exempel `not in MySQL`. `Not set` har aldrig någon, och när du byter databas uppdateras noteringarna.  
En åtgärd med en notering lagras ändå i relationen: relationslinjen visar den, och JSON, DBML och AML behåller den, men den databasens Schema SQL utelämnar satsen, så databasens standardåtgärd gäller.

[Schema SQL](./schema-sql.md) skriver de här åtgärderna och utelämnar resten:

| Databas | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | inga |
| PostgreSQL | alla fem | alla fem |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | alla fem | alla fem |

Schema SQL för Snowflake skriver också en kommentar som namnger varje åtgärd som den utelämnar – se [Referensåtgärder](./schema-sql.md#referential-actions).

Vilka åtgärder kodgeneratorns ORM-mål skriver beror både på målet och på den valda databasen – se [Kodgenerator](./code-generator.md#on-delete-and-on-update).

## Mappa kolumner {#map-columns}

Dialogrutan Mappa kolumner parar ihop föräldratabellens nyckel med kolumner i barntabellen, en rad per nyckelkolumn.  
Varje rad använder antingen en kolumn som barntabellen redan har eller lägger till en ny sekundärnyckelkolumn, så att en relation kan sluta på kolumner som redan finns.

![En Zero N-relation ritas från members till orders, Map to existing columns väljs och id mappas till den befintliga kolumnen member_id](/img/demo-map-columns.webp)

Den öppnas på två sätt:

- Medan du ritar en relation, via `Map to existing columns` bredvid barntabellen – se [Skapa relationer](./editing-start.md#relationship-creation). `Map` lägger då till en relation av den typ som ritas.
- Via `Map Columns` i relationens snabbmeny, för att ändra kolumnerna i en befintlig relation. `Save` skriver då ändringen. En skrivskyddad editor öppnar ingen snabbmeny för relationer, så Map Columns kan inte öppnas där.

Dialogrutans underrubrik namnger de två tabellerna och relationstypen, till exempel `users → posts · One N`. Typen visas här men ändras inte – använd [Ändra typ](#type-change).

I hela dialogrutan, även i noteringarna och textraderna under raderna och i meddelandet som den stängs med, namnges tabeller och kolumner så som [namnvisningen](./logical-names.md#beyond-the-canvas) namnger dem.  
Tre saker förblir fysiska: varje datatyp, som är kolumnens egen och aldrig dess domäns namn; `New column: <name>`, som visar det namn som den nya kolumnen kommer att få; och de rader som `Map` fyller i från början, som den parar ihop efter namn, aldrig efter logiskt namn.

`References` anger nyckeln som relationen pekar på: `Primary Key`, med dess kolumner i tabellens ordning, och sedan `Unique: <column>` för varje kolumn som är märkt med `Unique`. `References` visas bara när det finns mer än ett alternativ.  
Ett unikt index räknas inte som en nyckel här, och en kolumn med `Unique` som utgör hela primärnyckeln listas inte två gånger.  
Om du väljer en annan nyckel byggs raderna om. En rad behåller sitt val så länge den kolumnen fortfarande finns i barntabellen.

Under rubrikerna `Referenced column` och `Foreign key column` visar varje rad en kolumn i nyckeln med dess datatyp och en lista över barntabellens kolumner att para ihop den med:

- `Pick a column` lämnar raden tom.
- `New column: <name>` lägger till en ny sekundärnyckelkolumn. Namnet som visas är det som kolumnen kommer att få, som beskrivs i [Namn på sekundärnyckelkolumner](#foreign-key-column-names), numrerat i förhållande till barntabellens kolumner och de andra raderna som lägger till en ny kolumn. Alternativet erbjuds inte när namnet skulle bli tomt, som för en nyckel utan namn.
- Varje kolumn i barntabellen, som `<name> (<data type>)`. En kolumn som en annan rad har valt visar `<name> (<data type>) · in use` och kan inte väljas, så att inga två rader delar samma kolumn. En kolumn som en annan relation redan använder kan fortfarande väljas, så att en kolumn som till exempel en delad `tenant_id` kan användas av flera relationer.

Med `Map` är en rad ifylld från början bara när exakt en barnkolumn, oavsett skiftläge, har det namn som en ny sekundärnyckelkolumn för raden skulle få före en eventuell numrering med `_2`, till exempel `users_id` för `id` i `users` och `member_id` för `member_id`. Så länge [`Bracket`](./schema-sql.md#database-and-bracket) är `None`, vilket är standard, räknas även namnet som bildas av tabelldelen i ett schemakvalificerat tabellnamn, så `id` i `public.users` paras ihop med `public.users_id` eller `users_id`. För en nyckel med `Unique` räknas även nyckelkolumnens eget namn, så `vin` paras ihop med `vin`. Alla andra rader börjar på `Pick a column`.  
Med `Save` börjar varje rad på den kolumn som relationen använder nu. I båda fallen gäller att om du väljer en annan nyckel i `References` fylls den nyckelns tomma rader i efter samma namn.

När en vald kolumns datatyp skiljer sig från den som föräldrakolumnen ger en sekundärnyckel, visas en notering om det under raden.  
När [Synkronisera datatyp i relationer](./settings.md#relationship-datatype-sync) är på och föräldrakolumnen har en datatyp visar noteringen `<column> becomes <type>`, den typ som mappningen kommer att skriva. Annars visar den `Types differ: <parent type> and <child type>`, och kolumnen behåller sin typ.

`Map` eller `Save` förblir inaktiverad så länge något står i vägen, och en text under raderna anger vad:

- `Pick a foreign key column for every referenced column`: en rad är fortfarande tom.
- `At least one column must reference a different column`: en självrefererande relation där varje rad väljer sin egen föräldrakolumn.
- `These columns are already linked by another relationship`: en annan relation mellan samma två tabeller länkar exakt de här kolumnerna.
- `<parent> has no key to reference`: med `Map` har föräldratabellen varken en primärnyckel eller en kolumn med `Unique`.

`Save` förblir också inaktiverad tills mappningen skiljer sig från relationens nuvarande mappning.  
Med `Save` visar en rad `(removed)` när dess kolumn har försvunnit från sin tabell. Välj en annan barnkolumn eller, för en föräldrakolumn som har försvunnit, en nyckel i `References`. Med `Map` återgår en rad vars valda kolumn tas bort till `Pick a column`.

En relation vars föräldrakolumner inte är exakt en av föräldratabellens nycklar öppnas med ett extra val i slutet av `References`, `Current columns (not a key)`, som behåller de kolumnerna som de är. När föräldratabellen inte har någon nyckel alls är det det enda valet och `References` visas inte.  
Där är texten `The referenced columns are not a key of <parent>`, eller `<parent> has no key to reference` när föräldratabellen inte har någon nyckel alls, ett meddelande och inte ett fel: `Save` fungerar ändå, så du kan ändra barnkolumnerna och behålla referensen.  
En relation vars två kolumnlistor inte kan paras ihop, till exempel för att de har olika längd, visar rader med `(invalid)` och håller `Save` inaktiverad tills du väljer en nyckel i `References` eller lägger till en primärnyckel eller en kolumn med `Unique` i föräldratabellen om den inte har någon.

Dialogrutan följer diagrammet medan den är öppen, inklusive redigeringar från en medarbetare eller en kodagent, och behåller det du har valt.  
Om relationens kolumner eller nyckeln som den öppnades med ändras under tiden lägger den till texten `This relationship changed while the dialog was open`.

Det här skriver `Map` och `Save`:

- `Map` lägger till relationen med `On Delete` och `On Update` inställda på `Not set`. `Save` ändrar bara relationens kolumner, låter dess föräldrasida peka på nyckeln som har valts i `References` och behåller dess typ och dess ON DELETE och ON UPDATE.
- En rad med `New column` lägger till en kolumn sist i barntabellen, på samma sätt som när en relation ritas: `NOT NULL`, namngiven efter sin nyckel, med nyckelns datatyp, standardvärde, kommentar, logiska namn och domän – se [Identifierande relationer](#identifying-relationships).
- En vald kolumn döps aldrig om och kopplas aldrig till nyckelns domän, och dess `Not Null`, primärnyckel, `Unique`, standardvärde, kommentar och logiska namn förblir som de är. Dess datatyp ändras bara medan `Relationship DataType Sync` är på och föräldrakolumnen har en datatyp: den får den typ som föräldrakolumnen ger en sekundärnyckel, heltalstypen för en nyckel av typen serial precis som för en ny kolumn, och ändringen fortplantar sig längs relationerna på samma sätt som synkroniseringen gör. Varje kolumn som ändringen ger en ny typ, vald eller nådd längs relationerna, kopplas från sin [domän](./dictionary.md#domains-and-data-types) när dess nya typ skiljer sig från domänens.
- En kolumn som mappningen slutar använda finns kvar i barntabellen och är inte längre märkt som sekundärnyckel, om inte en annan relation fortfarande slutar på den.
- Allt som en `Map` eller `Save` skriver – inklusive nya kolumner, typändringar och borttagna domänkopplingar – ångras i ett steg.

Om relationen är identifierande och hur dess föräldraände ritas avgörs av de mappade barnkolumnerna, som för alla relationer. Om du mappar till barntabellens primärnyckelkolumner blir relationen identifierande direkt, och om du mappar till en kolumn som tillåter `NULL` får föräldraänden en ring – se [Läsa en relationslinje](#reading-a-connector).  
Sekundärnyckeln i Schema SQL refererar till nyckeln som du valde, till exempel `REFERENCES vehicle (vin)` för en nyckel med `Unique`.

Om diagrammet redan innehåller mappningen när du trycker på `Map` eller `Save`, eftersom en medarbetare eller en kodagent hann före, skrivs ingenting.  
Om det har ändrats så att mappningen inte längre passar skrivs ingenting, och ett meddelande visar `Couldn't map columns: the diagram changed`.

`Cancel`, knappen `x`, `Escape` eller ett klick på det nedtonade området utanför dialogrutan stänger den utan att skriva något.  
Det nedtonade området täcker hela editorn, inklusive verktygsfältet, och en öppen [utforskare](./explorer.md#dialogs-beside-it) förblir öppen under det.  
Dialogrutan stängs också när du öppnar snabbsökningen, när du lämnar ERD-fliken och när editorn blir skrivskyddad.  
`Ctrl + F` (Windows/Linux) eller `⌘ + F` (Mac) stänger den också och placerar textmarkören i sökfältet i utforskarens [sökning](./find-and-replace.md#opening-and-closing), och öppnar utforskaren om den är stängd. I en editor som är för smal för att visa utforskaren stänger kortkommandot ändå dialogrutan men visar ett meddelande i stället för att flytta textmarkören – se [Öppna och stänga](./explorer.md#opening-and-closing).  
Om en av dess tabeller eller relationen tas bort medan den är öppen stängs den med ett meddelande som `Map Columns closed: the relationship was removed`.  
Medan den är öppen gör arbetsytans kortkommandon, ångra och göra om samt kopiera och klistra in ingenting.

En kodagent har inget verktyg för Mappa kolumner. Den mappar om en relation genom att ta bort den med `erd_remove_relationship`, som behåller dess sekundärnyckelkolumner, och rita den igen på befintliga kolumner med `erd_link_columns`, båda i en och samma `erd_batch` – se [Verktyg](../../mcp/tools.md#relationships).

## N:M-relationer {#nm-relationships}

Eftersom editorn bygger på den fysiska modellen uttrycks en N:M-relation med en kopplingstabell, som visas nedan.

![Relationer ritas från products och sedan tags till den tomma tabellen product_tags med ⌘ + ⌥ + 2, vilket lägger till product_id och sedan tag_id](/img/demo-relationship-n-m.webp)

När kopplingstabellen redan har sina nyckelkolumner, till exempel `product_id` och `tag_id` i `product_tags`, rita varje relation med `Map to existing columns` och välj de kolumnerna i stället för att lägga till nya – se [Mappa kolumner](#map-columns). Om de utgör kopplingstabellens primärnyckel blir varje relation identifierande direkt.

En import av GraphQL, DBML eller AML skapar kopplingstabellen åt dig.  
En många-till-många-deklaration blir en tabell med namnet `<left>_<right>` och kommentaren `Junction table inferred from <left> <-> <right>`, kopplad till båda sidorna med identifierande relationer.  
Se [Importera eller exportera filer](./file-import-export.md).

## Identifierande relationer {#identifying-relationships}

När du ritar en relation genom att klicka på barntabellen, eller med `Create new columns`, kopieras varje primärnyckel i föräldratabellen till barntabellen som en sekundärnyckelkolumn med `NOT NULL`, så en ny relation är från början icke-identifierande.  
Kopian får nyckelns datatyp, standardvärde, kommentar och logiska namn, men inte `Unique` eller `Auto Increment`, och namnges som beskrivs i [Namn på sekundärnyckelkolumner](#foreign-key-column-names).  
En nyckel av typen serial är undantaget när det gäller datatypen: dess kopia får den heltalstyp som serial-typen lagrar. Oavsett databas ger `smallserial` och `serial2` `smallint`, `serial4` ger `integer`, och `bigserial` och `serial8` ger `bigint`. Typen `serial` utan tillägg ger `integer` i PostgreSQL och `bigint unsigned` i MySQL och MariaDB, och förblir `serial` i alla andra databaser.  
Bara hela typnamnet räknas, oavsett skiftläge, så `serial(4)` kopieras som det är skrivet. En typ som är skriven med versaler ger versaler: `SERIAL` ger `INTEGER` i PostgreSQL. En sekundärnyckelkolumn som redan har typen `serial` i ett sparat diagram behåller den typen.  
Kopian kopplas också till nyckelns [domän](./dictionary.md#domains-and-data-types), förutsatt att bladet `Domains` listar den domänen när kopian skapas och att kopian behåller nyckelns datatyp. Kopian av en nyckel av typen serial som får en heltalstyp kopplar därför ingen domän, medan typen `serial` utan tillägg, som behålls som `serial`, kopplar den.  
För att göra relationen identifierande anger du de sekundärnyckelkolumnerna i barntabellen som primärnycklar: markera alla och tryck på `Alt + K` (Windows/Linux) eller `⌥ + K` (Mac) en gång, eller välj `Primary Key` i tabellens snabbmeny, där alternativet visar `Primary Key on selected columns` när två eller fler är markerade – se [Primärnyckel för kolumner](./table-editing.md#column-primary-key).

![Kolumnen product_id slås på och av som primärnyckel med Alt + K, och dess relationslinje blir heldragen och sedan streckad](/img/demo-identifying-relationship.webp)

Editorn håller detta uppdaterat på egen hand.  
En relation är identifierande så länge varje kolumn på dess barnsida är en primärnyckel, och blir icke-identifierande så snart en av dem inte är det.

## Namn på sekundärnyckelkolumner {#foreign-key-column-names}

När du ritar en relation namnges varje sekundärnyckelkolumn som läggs till efter den nyckel i föräldratabellen som kolumnen kopierar:

- Ett nyckelnamn på ett ord, som `id`, `ID` eller `uuid`, får föräldratabellens namn och ett understreck framför sig: `id` i `products` blir `products_id`.
- Ett nyckelnamn på flera ord, som `member_id`, `userId` eller `UserID`, behålls som det är.
- Ett nyckelnamn på ett ord som är tabellens eget namn, oavsett skiftläge, behålls också: `currency` i `currency` förblir `currency`. En nyckel där tabellens namn bara är en del av namnet får ändå prefixet: `username` i `user` blir `user_username`.

Ett namn är ett ord när det bara innehåller bokstäver och siffror, utan något skiftlägesbyte.  
Alla andra tecken delar det, så `_id`, `order no` och `order-no` är flera ord.  
Det gör även ett skiftlägesbyte, tolkat på samma sätt som camelCase: en gemen följd av en versal (`userId`), två versaler följda av en gemen (`IDCard`, `IDs`) eller en bokstav från en skrift utan skiftläge, som hangul, kana eller kinesiska tecken, bredvid en bokstav med skiftläge (`회원ID`).  
Siffror delar inte ett ord, så `id2` och `SHA256` är ett ord. En sammansättning som är skriven i ett och samma skiftläge är också ett ord: `memberid` i `members` blir `members_memberid`.

Tabellnamnet används som det är skrivet, bortsett från omgivande blanksteg: dess skiftläge, inre blanksteg och punkter behålls, det görs inte om till singular och inställningarna `Table Name Case` och `Column Name Case` i kodgeneratorn spelar ingen roll. `Users` med nyckeln `ID` ger `Users_ID`.  
Varje kolumn i en sammansatt nyckel namnges för sig: `orders` med nyckeln (`tenant_id`, `id`) lägger till `tenant_id` och `orders_id`.

Ett namn som barntabellen redan har, oavsett skiftläge, numreras med `_2`, `_3` och så vidare, med det första lediga numret.  
En andra relation från `users`, med nyckeln `id`, till samma tabell lägger till `users_id_2`, och en självreferens i `members`, med nyckeln `member_id`, lägger till `member_id_2`.  
Kolumnerna i en sammansatt nyckel numreras i förhållande till varandra på samma sätt, och ett namn som behålls som det är tar sin plats först: `user` med nyckeln (`id`, `user_id`) lägger till `user_id` för `user_id` och `user_id_2` för `id`.

En föräldratabell utan namn lämnar nyckelnamnet som det är, numrerat som alla andra vid en namnkrock.  
En nyckel utan namn ger en sekundärnyckelkolumn utan namn.  
Det gäller även den primärnyckel som editorn lägger till i en föräldratabell som inte har någon, om du inte namnger den innan du klickar på barntabellen.

Namnen bestäms när relationen ritas. Om du senare byter namn på föräldratabellen eller dess nyckel ändras inte namnen.  
Raderna med `New column` i [Mappa kolumner](#map-columns) namnges enligt samma regler, och listan visar varje namn innan du väljer det.  
Relationer som kommer med sina kolumner redan på plats – från en import, en inklistring, en duplicering eller dialogrutan Mappa kolumner när den parar ihop befintliga kolumner – behåller de namn som de kolumnerna har.  
En kodagent som lägger till en relation med `erd_add_relationship` får samma namn, datatyper, logiska namn och domäner – se [Verktyg](../../mcp/tools.md#relationships).

En sekundärnyckelkolumn namnges efter sin nyckel, aldrig efter det logiska namn som den kopierar, och dess namn räknas som ett som du har skrivit: ett logiskt namn som senare skrivs på kolumnen lämnar namnet som det är, om inte namnet är tomt – se [Egna namn](./dictionary.md#names-of-your-own).  
Medan det kopierade logiska namnet matchar en term som ger ett annat namn listar bladet `Checks` därför kolumnen under [`Physical name mismatch`](./dictionary.md#what-each-check-finds). Om du härleder dess fysiska namn igen får den ett nytt namn från ordlistorna, om inte en annan kolumn i barntabellen redan har det namn som de ger, oavsett skiftläge – se [Härled fysiska namn igen](./dictionary.md#derive-physical-names-again).

## Läsa en relationslinje {#reading-a-connector}

- En identifierande relation ritas som en heldragen linje, en icke-identifierande som en streckad linje.
- Barnänden har relationstypens kardinalitetssymbol: en ring och ett streck för Zero One, en ring och en kråkfot för Zero N, två streck för One Only och ett streck och en kråkfot för One N.
- Föräldraänden är en ring och ett streck, som Zero One, när någon av sekundärnyckelkolumnerna tillåter `NULL`, och två streck, som One Only, när alla är `NOT NULL`.
- När du håller pekaren över en relationslinje framhävs den tillsammans med kolumnerna som den länkar i båda tabellerna.

![Pekaren hålls över tre relationslinjer i tur och ordning, och var och en lyser upp tillsammans med kolumnerna som den länkar](/img/demo-relationship-hover.webp)

En relation som anger [ON DELETE eller ON UPDATE](#on-delete-and-on-update) har en etikett bredvid sin barnände, till exempel `D:C U:R`: `D:` och ON DELETE-åtgärden, sedan `U:` och ON UPDATE-åtgärden, var och en bara när den är angiven.  
Åtgärderna förkortas enligt notationen i erwin: `C` för CASCADE, `R` för RESTRICT, `SN` för SET NULL, `SD` för SET DEFAULT och `NA` för NO ACTION. En relation som inte anger någon av dem har ingen etikett.  
Etiketten sitter på den sida som är vänd bort från barntabellen, ovanför linjen när relationslinjen lämnar tabellens vänstra eller högra sida och till höger om den när den lämnar översidan eller undersidan, utan att överlappa kardinalitetssymbolen.  
Den ritas i relationslinjens färg på en liten ruta i arbetsytans bakgrundsfärg och lyser upp tillsammans med sin relationslinje. Etiketter ritas ovanpå alla relationslinjer, så en linje som korsar en etikett går under den.  
Den visar åtgärden som är lagrad i relationen oavsett vad den valda databasen skriver, så ON DELETE SET DEFAULT visar fortfarande `D:SD` i MySQL.

När du håller pekaren över en relationslinje som anger någon av åtgärderna visas också en knappbeskrivning som skriver ut satserna i sin helhet, en per rad, till exempel `ON DELETE CASCADE` och `ON UPDATE RESTRICT`.  
Knappbeskrivningen visas även när etiketten är dold.

När du går till en relation lyses den upp: om du väljer en rad i mappen `Foreign Keys` under en tabell i [utforskaren](./explorer.md#going-to-a-row), eller en sekundärnyckelrad i [diff-visaren](./table-related-functions.md#going-to-a-change), ritas dess relationslinje och dess etikett i hovringsfärgen. I diff-visaren lyser hoppet upp relationslinjen på varje sida som innehåller relationen, så en tillagd sekundärnyckel lyser bara upp den aktuella sidan och en borttagen bara den sparade sidan.  
Hoppet markerar bara barntabellen med dess sekundärnyckelkolumner, med den fokuserade cellen på den första av dem; själva relationen markeras fortfarande aldrig. Se [Var ett hopp hamnar](./table-related-functions.md#where-a-jump-lands) för vart vyn går.  
Ljuset slocknar vid nästa tryck med vänster eller höger musknapp på arbetsytan, oavsett om det är på en tom plats, en tabell, en anteckning, en tabellgrupp eller en relationslinje, även vid ett tryck som lämnar markeringen som den var. Ljuset slocknar också när du går till en annan rad eller sökträff i utforskaren, och när du går till en annan rad i diff-visaren, på varje sida som den raden går till.  
Relationen förblir upplyst när du panorerar med mittenknappen eller handverktyget, och likaså när du fäller ihop eller fäller ut en rad i utforskaren eller diff-visaren, när du avmarkerar allt med `Escape` och vid ett hopp från [snabbsökningen](./quick-search.md) eller [kortknappen](./visualization.md#card-buttons) för extern länk i flödet.  
Ljuset sparas inte och finns inte i ångrahistoriken, och medarbetare ser det inte.

I en editor med [`readonly`](../../api/erd-editor-element.md#readonly) lyser pekaren upp relationslinjer också, i stället för det ljus som ett hopp lämnar. När den vilar på en tabell lyser den upp varje relationslinje som hör till tabellen i hovringsfärgen tills den flyttas bort från tabellen.  
Ett klick som inte flyttar sig lämnar ett ljus på till nästa sådana klick: på en tabell lyser det upp den tabellens relationslinjer, på en relationslinje den relationslinjen och på alla andra ställen ingenting. Ett drag där panorerar arbetsytan och lämnar det ljuset som det var.

Dölj relationslinjer på ERD-arbetsytan med visningsalternativet `Relationship`, eller bara deras etiketter med visningsalternativet `Referential Actions`, som är på som standard – se [Visningsalternativ för tabeller](./table-related-functions.md#table-view-options).  
Etiketter ritas inte vid `70%` och lägre, där tabellerna fälls ihop till sitt namn.  
En [bildexport](./file-import-export.md#image) ritas alltid i 100 %, så den ritar etiketterna oavsett arbetsytans zoomnivå, om inte ett visningsalternativ döljer dem. När `Background` är av är rutan bakom varje etikett också genomskinlig.  
[Flödesläget](./visualization.md#flow-mode) på fliken Visualisering ritar relationslinjer även när `Relationship` är av, var och en som en enda mjuk, heldragen grå kurva med samma ändsymboler, så den streckade linjen, etiketterna, knappbeskrivningen, ljuset efter ett hopp och den vinkelräta dragning som beskrivs på den här sidan gäller bara ERD-arbetsytan. En relation från en tabell till sig själv böjer sig runt det övre högra hörnet även i flödet – se [Dragning av relationslinjer](#connector-routing).

## Dragning av relationslinjer {#connector-routing}

Relationslinjer dras vinkelrätt, och deras hörn är rundade.  
En dragning går runt de tabeller som ligger i dess väg i stället för genom dem. Där varje dragning med några få svängar mellan dess två ändar skulle korsa en tabell, som i ett trångt diagram, tar relationslinjen en väg runt med så många svängar som behövs. Bara där ingen väg runt hittas korsar den fortfarande en tabell.  
En relationslinje lämnar sina två tabeller från ett par sidor som vetter mot varandra där det finns ett, och varje ände lämnar sin tabell med en kort rak sträcka innan den svänger, så två tabeller en kort bit ifrån varandra vars relationslinjeändar ligger i linje förbinds med en enda rak linje i stället för en omväg.  
Två tabeller som vetter mot varandra och står närmare än så, även under `40px` ifrån varandra, behåller sina sidor som vetter mot varandra, och där deras ändar inte ligger i linje gör relationslinjen en förskjutning över gapet mellan dem i stället för att löpa under någon av dem.  
Dragningar som lämnar samma sida av en tabell sprids ut i separata korridorer så att de inte löper ovanpå varandra.  
Bara tabeller undviks: en relationslinje kan korsa en anteckning eller en tabellgrupps ruta och ritas ovanför tabellgrupper och under tabeller och anteckningar.

En relation från en tabell till sig själv ritas som en enda kurva runt tabellens övre högra hörn, som lämnar översidan vid föräldraänden och går in i högersidan vid barnänden.  
Ytterligare självreferenser på samma tabell läggs utanför den första, så att deras kurvor inte korsar varandra eller tabellen.

Det finns ingenting att konfigurera.  
Dragningarna beräknas om automatiskt när något på arbetsytan flyttas eller ändrar storlek, så de behöver aldrig justeras för hand.  
Medan du drar följer relationslinjerna för de tabeller du flyttar med dem, och varje annan relationslinje behåller den dragning den hade när draget började. När du släpper ritas varje relationslinje som flytten ger en ny dragning om, till exempel en som nu går runt en tabell som släppts i dess väg, eller en som rätas ut när en tabell har flyttats bort från dess väg.

Ett diagram ritar samma dragningar i varje fönster som visar det i samma namnvisning: ett som stod öppet medan tabellerna flyttades, ett som öppnade diagrammet alldeles nyss och en medarbetares, och en [exporterad bild](./file-import-export.md#image) ritar dem också. Namnvisningen räknas eftersom den ändrar hur breda tabellerna är – se [Namnvisning](./logical-names.md#name-view).

![Tabellen members dras nedåt och tillbaka medan relationslinjen från orders växlar mellan att passera till höger om categories och runt dess vänstra sida, med alla hörn rundade](/img/demo-connector-routing.webp)
