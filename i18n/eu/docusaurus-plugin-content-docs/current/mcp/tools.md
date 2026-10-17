---
sidebar_position: 4
description: "erd-editor MCP zerbitzariak eskaintzen dituen tresna guztiak: dokumentu bat orrialdez orrialde irakurtzea, 54 edizio-tresnak, erd_batch, eta emaitza batek eta ukapen batek duten itxura."
---

# Tresnak

Zerbitzariak 63 tresna eskaintzen ditu: saioko bost tresna, hiru irakurketa-tresna, 54 edizio-tresna, edizio-eragiketa bakoitzeko bat, eta `erd_batch` tresna, hainbat edizio-tresna edizio bakar gisa exekutatzen dituena.

`erd_list_documents` tresna izan ezik, tresna guztiek dokumentuaren `path` bide-izena hartzen dute lehen argumentutzat, eta beheko tauletan ez da ageri.
`?` ikurraz markatutako argumentua aukerakoa da.

## Saioko tresnak {#session-tools}

| Tresna | Argumentuak | Zer egiten duen |
| --- | --- | --- |
| `erd_list_documents` | | ERD dokumentuak zerrendatzen ditu `path`, `open`, `active`, `dirty` eta `readonly` eremuekin: laneko direktorioa zerbitzatzen duen editorearenak (JetBrains IDE batean, irekitako proiektu guztietakoak), eta, bestela, laneko direktorioaren azpiko ERD fitxategiak. |
| `erd_open_document` | `create?` | Dokumentu bat editatzeko irekitzen du, hura zerbitzatzen duen editorearen ERD Editor bidez, halakorik badago. `create` argumentuarekin, fitxategia falta bada, lehenik sortu egiten du, eta luzapenik gabeko izen bati `.erd.json` gehitzen zaio. |
| `erd_save` | | Editore batek daukan dokumentu bat gordetzen du. VS Code editoreak agentearen edizioak gorde gabe uzten ditu tresna honi deitzen zaion arte; Obsidian aplikazioak eta JetBrains IDE batek zureak gordetzen dituzten bezala gordetzen dituzte, eta tresna honek berehala idazten ditu. Editorerik gabeko moduan, edizio guztiak idatzita daude jada, eta tresna honek ez du ezer egiten. |
| `erd_undo` | | Agente honek egindako azken edizioa desegiten du, inoiz ez zurea. Desegite-urratsik sortu ez duten deiak saltatu eta aipatu egiten ditu. |
| `erd_redo` | | `erd_undo` tresnak desegindako azken edizioa berriro aplikatzen du. |

Modu bakoitzean gordetzeak eta desegiteak zer egiten duten jakiteko, ikus [Zuzenean eta editorerik gabe](./live-and-headless.md).

## Dokumentu bat irakurtzea {#reading-a-document}

| Tresna | Argumentuak | Zer egiten duen |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Ezarpenak eta kopuruak, eta ondoren taulen orrialde bat, haien indize eta erlazioekin; taula bakoitza bere IDarekin, oihaleko kokapen eta tamainarekin, zutabe kopuruarekin eta, talde batean badago, bere taula-taldearekin. Bilaketarik egiten ez badu, taulen ondoren taula-taldeak eta gero oharrak datoz. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?` | Izendatutako entitateak, osorik: taulak beren zutabe eta taula-taldearekin, erlazioak beren zutabeekin eta `onDelete` eta `onUpdate` balioekin, indizeak beren zutabeekin, oharrak beren testuarekin, taula-taldeak beren taulekin. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `tableIds?`, `tableNames?`, `groupNames?` | Dokumentu osoa batera, lau formatuetako batean, edo taula edo taula-talde batzuen DDLa soilik. |

Agente batek `erd_list` tresnarekin aurkitzen ditu IDak, `erd_get` tresnarekin irakurtzen ditu zutabeak eta beste xehetasun batzuk, eta ID horiek edizio-tresnei pasatzen dizkie.
`erd_list` tresnan, taula baten tamaina oihalean hartzen duen laukia da: altuera zehatza, zabalera gutxi gorabeherakoa.
Taula-talde bat gordetzen duen laukizuzenaren bidez zerrendatzen da, bere izenarekin, kolorearekin eta zenbat taula dituen adierazita.
Erlazio bakoitza behin zerrendatzen da, bere bi tauletako batekin.
`erd_list` eta `erd_read` tresnek jakinarazten dituzten ezarpenak fitxategiak gordetzen dituenak dira. Ikus [Ezarpenak](#settings).

`erd_read` tresnak lau formatuetako bat hartzen du:

| `format` | Zer erantzuten duen |
| --- | --- |
| `snapshot` | JSON trinkoa, entitate guztiekin eta haien IDekin, taula-taldeak barne, eta ezarpenekin, SQL eskemaren scriptekin batera. Ikusle batetik bestera aldatzen dena kanpoan uzten du: neurtutako zabalerak, pilatze-ordena, ikuspegia eta fitxa. Handia da eskema handi batean. |
| `sql` | Zortzi datu-baseetako baterako DDLa: `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` edo `SQLite`. `vendor` argumentuaren balio lehenetsia dokumentuan ezarritako datu-basea da. Dokumentu osoaren DDLak bere aurreko eta ondorengo scriptak barne hartzen ditu. `tableIds`, `tableNames` edo `groupNames` argumentuekin, taula horiek soilik, dituzten gako arrotzekin, eta scriptik gabe. Gako arrotzek beren ON DELETE eta ON UPDATE ekintzak dituzte, helburuko datu-baseak kanpoan uzten dituenak izan ezik. Ikus [ON DELETE eta ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | Dokumentu osoa, gordetzean fitxategian idazten den bezala-bezala, editoreak oraindik gorde ez dituen edizioak barne. Ikus [Biltegiratze-forma eta exekuzio-garaiko balioa](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Dokumentuaren aurreko eta ondorengo scriptak soilik, `{"before":"…","after":"…"}` gisa, bakoitza hutsik, ezarri gabe badago, eskema edozein tamainatakoa izanda ere. |

`sql` formatuak soilik hartzen ditu `vendor`, `statements`, `header`, `tableIds`, `tableNames` eta `groupNames` argumentuak, eta beste formatu batek ukatu egiten ditu.

- `statements`: `create`, lehenetsia; `ifNotExists`, MySQL, MariaDB, PostgreSQL, SQLite eta Databricks datu-baseetan `CREATE TABLE IF NOT EXISTS` eta besteetan `CREATE TABLE` soila idazten duena; edo `recreate`, taulak sortu aurretik ezabatzen dituena, eta Snowflake datu-basean, horren ordez, `CREATE OR REPLACE TABLE` idazten duena.
- `header`: `none`, lehenetsia; `use`, dokumentuaren datu-basearen izenak adierazten duen datu-basea edo eskema hautatzen duena; edo `createAndUse`, lehenik hura sortzen duena. Oracle datu-baseak `use` bakarrik duenez, han `createAndUse` balioak `use` idazten du, eta PostgreSQL datu-baseak `createAndUse` bakarrik duenez, han `use` balioak ez du goibururik idazten. SQLite datu-baseak ez du goibururik idazten, eta datu-basearen izena hutsik dagoen edo identifikatzaile soila ez den bitartean, ezein datu-basek ez du goibururik idazten.
- `groupNames`: izendatutako taula-taldeen taulak, izenez, maiuskulak eta minuskulak bereizi gabe, `tableIds` eta `tableNames` argumentuetakoekin batuta. Inongo talderekin bat ez datorren izena `notFound` kodearekin ukatzen da. Taularik ez duen talde batek ez du taularik gehitzen, eta taularik batere gabe geratzen den irakurketa bat, izendatutako talde guztiak hutsik daudenean eta taularik izendatzen ez denean bezala, `invalidArgs` kodearekin ukatzen da.

`statements` eta `header` argumentuak taula batzuen DDLari ere aplikatzen zaizkio. Editorearen [SQL eskema](../guide/guides/schema-sql.md#options-panel) fitxako `Statements` eta `Header` aukerek bezala funtzionatzen dute, nahiz eta fitxa `If not exists` eta `CREATE + USE` balioekin abiatzen den.
Izenak fitxategiak gordetzen duen mugatzaile motarekin inguratzen dira, eta `Bracket Type` blokeatuta dagoen bitartean, blokeatutakoarekin. Ikus [Blokeoa](../guide/guides/settings.md#lock).

### Eskema handiak {#large-schemas}

Ehunka edo milaka taulako eskemek ere funtzionatzen dute.
Irakurketa batek gehienez 40.000 karaktereko erantzuna ematen du, Claude Codek tresna baten emaitza fitxategi batean alde batera uzten duen mugaren azpitik.

- `erd_list` tresnak lehenespenez 100 elementuko orrialde bat erantzuten du, lehenik taulak, gero taula-taldeak eta gero oharrak, eta hurrengo orrialdea non hasten den adierazten du `nextOffset` eremuarekin eta `note` eremu batekin. Pasatu `nextOffset` hori `offset` gisa, `query` argumentu berarekin.
- `query` argumentuak taula edo zutabe baten izeneko edo iruzkineko hitzen bidez aurkitzen ditu taulak, maiuskulak eta minuskulak bereizi gabe. Izenean hitz gehiago dituzten taulak agertzen dira lehenik. Bilaketa batek ez du taula-talderik ez oharrik zerrendatzen.
- `namesOnly` argumentuak taulen izenak soilik zerrendatzen ditu, 2.000 izen labur inguru erantzun bakarrean.
- `erd_get` eta `erd_read` tresnek IDez gain `tableNames` ere hartzen dute, eta `erd_read` tresnak `groupNames` hartzen du; beraz, eskema handi batean SQL kontsulta bat eskatzen zaion agente batek behar dituen taulen DDLa soilik irakurtzen du.
- `erd_get` tresnak ezer izendatzen ez duten IDak eta izenak `missing` eremuan zerrendatzen ditu, eta erantzun batean lekurik ez duten IDak `notReturned` eremuan, berriro eskatzeko.
- Erantzun baterako handiegia den irakurketa `tooLarge` kodearekin ukatzen da, nola murriztu adierazita.

## Edizio-tresnak {#edit-tools}

IDak `erd_list` eta `erd_get` tresnetatik datoz, edo entitatea sortu zuen deiaren `createdIds` eremutik.
ID berri bat 25 letra xehe eta digituz osatuta dago, adibidez `03h17be2plxpj5n59tqag7ogj`, eta dokumentuak lehendik duen IDak bere forma gordetzen du; beraz, ez atera ondoriorik ID baten itxuratik.
`x` eta `y` argumentuak oihaleko ezkerreko eta goiko ertzak dira, pixeletan, eta kolore bat CSS kolore hamaseitar bat da, adibidez `#3b82f6`, edo kate huts bat, kolorea kentzen duena.

### Taulak {#tables}

| Tresna | Argumentuak | Zer egiten duen |
| --- | --- | --- |
| `erd_add_table` | | Taula huts bat gehitzen du leku libre batean eta haren IDa `createdIds` eremuan itzultzen du. |
| `erd_remove_table` | `tableId` | Taula bat kentzen du, bere zutabe eta indizeekin eta hura ukitzen duen erlazio guztiekin. |
| `erd_change_table_name` | `tableId`, `value` | Taula baten izena aldatzen du. |
| `erd_change_table_comment` | `tableId`, `value` | Taula baten iruzkina ezartzen du. Kate huts batek garbitu egiten du. |
| `erd_change_table_color` | `tableId`, `color` | Taula baten kolorea ezartzen du. |
| `erd_move_table` | `tableId`, `x`, `y` | Taula bat oihaleko kokapen batera mugitzen du. |
| `erd_move_tables` | `positions` | Hainbat taula edizio bakarrean mugitzen ditu, eta `erd_undo` dei bakar batek desegiten du. `positions` argumentuak `{ tableId, x, y }` bat du taula bakoitzeko, taula bakoitza gehienez behin. |
| `erd_sort_tables` | | Taula guztiak errenkadetan kokatzen ditu oihalean zehar, zutabe gutxien dituztenak lehenik, `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` eta `erd_import_aml` tresnek kokatzen dituzten bezala. Taula-talde bateko taulak elkarrekin geratzen dira, eta talde bakoitzaren laukia haien inguruan doitzen da. |

### Zutabeak {#columns}

| Tresna | Argumentuak | Zer egiten duen |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Zutabe huts bat gehitzen dio taula bati eta haren IDa `createdIds` eremuan itzultzen du. |
| `erd_remove_columns` | `tableId`, `columnIds` | Taula bateko zutabeak kentzen ditu, haiek erabiltzen dituzten erlazio eta indize-sarrerekin. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Zutabe baten izena aldatzen du. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Datu mota ezartzen du, adibidez `INT` edo `VARCHAR(255)`. [Erlazioen datu moten sinkronizazioa](../guide/guides/settings.md#relationship-datatype-sync) aktibatuta dagoen bitartean, aldaketak erlazioei jarraitzen die bi noranzkoetan, editorean bezala: serial mota bat gordetzen duen zenbaki osoko mota gisa iristen da gako arrotzetara, `erd_add_relationship` tresnak kopiatzen duen bezala, eta serial gako batek bere mota mantentzen du bere gako arrotzetako bat aldatzen denean, eta horrek aldaketa han gelditzen du. Sinkronizazioa aktibatzea edo desaktibatzea erabiltzaileari dagokio, eta `erd_list` tresnak `relationshipDataTypeSync` gisa jakinarazten du. |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Balio lehenetsia ezartzen du, SQL testu gisa. Kate huts batek garbitu egiten du. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Iruzkina ezartzen du. Kate huts batek garbitu egiten du. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` balioak zutabea gako nagusiaren parte bihurtzen du, eta `false` balioak handik ateratzen du. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | Zutabea bakarra den ala ez ezartzen du. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | Zutabea `NOT NULL` den ala ez ezartzen du. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | Zutabeak gehikuntza automatikoa duen ala ez ezartzen du. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | Zutabe bat bere taularen barruan beste zutabe baten kokapenera mugitzen du. |

### Erlazioak {#relationships}

`relationshipType` argumentua taula umearen muturreko kardinalitatea da: `ZeroOne`, `ZeroN`, `OneOnly` edo `OneN`.
Hasierako taula gurasoa da, gako nagusia duen alde erreferentziatua, eta amaierako taula umea da.
`onDelete` eta `onUpdate` argumentuak gako arrotzaren ON DELETE eta ON UPDATE ekintzak dira: `none`, `noAction`, `cascade`, `setNull`, `setDefault` edo `restrict`.
`none` balioak ez du klausularik idazten; beraz, datu-basearen lehenetsia aplikatzen da. Ikus [ON DELETE eta ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).
`erd_add_relationship` edo `erd_link_columns` tresnan adierazten ez den ekintza `none` da.

| Tresna | Argumentuak | Zer egiten duen |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Bi taula erlazionatzen ditu. Gurasoaren gako nagusia umera kopiatzen du gako arrotzeko zutabe gisa, eta, gurasoak gako nagusirik ez badu, lehenik gako nagusiko zutabe bat sortzen du. Gako arrotzeko zutabe bakoitzari editorean erlazio bat marraztean ematen zaion izena ematen zaio: `users` taulako `id` gakoak `users_id` ematen du, eta `member_id` bezalako gako batek bere izena gordetzen du. Ikus [Gako arrotzen zutabeen izenak](../guide/guides/relationship-editing.md#foreign-key-column-names). Bakoitzak bere gakoaren datu mota kopiatzen du, salbu eta serial gako batek gordetzen duen zenbaki osoko mota ematen duela, adibidez `serial4` motarako `integer`, eta `serial` soila `serial` geratzen dela PostgreSQL, MySQL eta MariaDB datu-baseetatik kanpo. Ikus [Erlazio identifikatzaileak](../guide/guides/relationship-editing.md#identifying-relationships). `createdIds` eremuak gako-zutabe berri hori du, sortu bada, gako arrotzeko zutabeak, eta erlazioaren IDa azkenik. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Lehendik dauden zutabeen artean erlazio bat marrazten du, hasierako eta amaierako zutabeak kokapenaren arabera parekatuz. Ez dio inongo zutaberi izena aldatzen, eta ez du datu motarik aldatzen. |
| `erd_remove_relationship` | `relationshipId` | Erlazio-marra bat kentzen du. Haren gako arrotzeko zutabeak taulan geratzen dira. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Erlazio baten kardinalitatea aldatzen du. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Erlazio baten ON DELETE ekintza ezartzen du: errenkada guraso bat ezabatzeak bere errenkada umeei zer egiten dien. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Erlazio baten ON UPDATE ekintza ezartzen du: gurasoaren gako bat aldatzeak bere errenkada umeei zer egiten dien. |

`erd_add_relationship` tresnak exekutatzen denean ematen die izena gako arrotzeko zutabeei; beraz, eman izena lehenik taula gurasoari eta haren gako nagusiari.

Ez dago lehendik dagoen erlazio baten zutabeak editorearen [Mapatu zutabeak](../guide/guides/relationship-editing.md#map-columns) elkarrizketa-koadroak bezala aldatzen dituen tresnarik.
Erlazio bat beste zutabe batzuetara mapatzeko, exekutatu `erd_remove_relationship` tresna, haren gako arrotzeko zutabeak taulan uzten dituena, eta `erd_link_columns` tresna nahi diren zutabeekin, `erd_batch` dei bakarrean; `erd_undo` dei bakar batek desegiten du.

### Indizeak {#indexes}

Indize-zutabe baten IDa `erd_get` tresnak ematen duen indizearen zutabe-zerrendako sarrera bat da, ez taulako zutabearen IDa.

| Tresna | Argumentuak | Zer egiten duen |
| --- | --- | --- |
| `erd_add_index` | `tableId` | Indize huts bat gehitzen dio taula bati eta haren IDa `createdIds` eremuan itzultzen du. |
| `erd_remove_index` | `indexId` | Indize bat kentzen du. |
| `erd_change_index_name` | `indexId`, `value` | Indize baten izena aldatzen du. |
| `erd_set_index_unique` | `indexId`, `value` | Indizea bakarra den ala ez ezartzen du. |
| `erd_add_index_column` | `indexId`, `columnId` | Indizearen taulako zutabe bat gehitzen du eta indize-zutabe berriaren IDa itzultzen du. Indizean lehendik dagoen zutabea ez da ukitzen. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | Indize bateko zutabe bat kentzen du. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | Indize bateko zutabe bat indizearen beste zutabe baten kokapenera mugitzen du. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | Indize bateko zutabe baten ordena ezartzen du, `ASC` edo `DESC`. |

### Oharrak {#memos}

| Tresna | Argumentuak | Zer egiten duen |
| --- | --- | --- |
| `erd_add_memo` | | Ohar huts bat gehitzen du leku libre batean eta haren IDa `createdIds` eremuan itzultzen du. |
| `erd_remove_memo` | `memoId` | Ohar bat kentzen du. |
| `erd_change_memo_value` | `memoId`, `value` | Ohar baten testua ordezten du. |
| `erd_change_memo_color` | `memoId`, `color` | Ohar baten kolorea ezartzen du. |
| `erd_move_memo` | `memoId`, `x`, `y` | Ohar bat oihaleko kokapen batera mugitzen du. |
| `erd_resize_memo` | `memoId`, `width`, `height` | Ohar baten tamaina aldatzen du. Zabalerak gutxienez `116` pixel ingurukoa izan behar du, eta altuerak gutxienez `100`. Ez du desegite-urratsik sortzen, editoreak oharren tamaina-aldaketa arrastatze batetik soilik erregistratzen baitu. |

Oharrak [View Option](../guide/guides/table-related-functions.md#table-view-options) → `Memos` bidez ezkutatuta dauden bitartean, `erd_add_memo` tresnak ohar bat gehitzen du hala ere, eta ezkutuan geratzen da oharrak berriro erakusten diren arte.
`erd_list` eta `erd_get` tresnek ezkutuko oharrak ere zerrendatzen dituzte.

### Taula-taldeak {#table-groups}

Taula-talde bat bere taulen atzean marraztutako lauki izendun bat da, eta haren kolorea laukian eta bere taulen goiburuetan zehar ikusten da. Ikus [Taula-taldeak](../guide/guides/table-groups.md).
Taula bat gehienez talde batean dago. `erd_move_table`, `erd_move_tables` eta `erd_move_table_group` tresnek ez dute inoiz aldatzen talde batek zer taula dituen, taula bat edonon kokatuta ere; editorean, aldiz, taula bat askatzen den lekuaren arabera sartzen da talde batean edo ateratzen da talde batetik. Ikus [Taulak gehitzea eta kentzea](../guide/guides/table-groups.md#adding-and-removing-tables). `erd_add_table_group` eta `erd_set_table_group` tresnek taulak talde batean sartzen dituzte, eta `erd_remove_table_group` tresnak taldearen taulak talderik gabe uzten ditu.
Talde batek laukizuzen bat gordetzen du, gutxienez `160` pixel zabal eta `100` garai, titulu-barra barne, eta editoreak laukia bere taula bakoitza hartzeko handituta marrazten du.

| Tresna | Argumentuak | Zer egiten duen |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | Talde bat gehitzen du eta haren IDa `createdIds` eremuan itzultzen du. Pasatu `tableIds` edo laukizuzen bat, `x`, `y`, `width` eta `height` batera. `tableIds` argumentuarekin, taula bakoitza zegoen taldetik ateratzen da, eta laukizuzena haien inguruan doitzen da, [hautatutako taulak taldekatzea](../guide/guides/table-groups.md#grouping-selected-tables) ekintzak doitzen duen bezala. Laukizuzen batek talderik gabeko taula guztiak hartzen ditu, baldin eta haien zentroa laukizuzenaren barruan badago, [talde bat marraztea](../guide/guides/table-groups.md#drawing-a-group) ekintzak egiten duen bezala. `name` argumentu hutsak taldea izenik gabe uzten du. `erd_undo` dei batek taldea kentzen du eta taula bakoitza zegoen taldera itzultzen du. |
| `erd_remove_table_group` | `groupId` | Talde bat kentzen du. Haren taulak dauden lekuan geratzen dira, talderik gabe. |
| `erd_change_table_group_name` | `groupId`, `value` | Talde baten izena aldatzen du. Kate huts batek izenik gabe uzten du. |
| `erd_change_table_group_color` | `groupId`, `color` | Talde baten kolorea ezartzen du. |
| `erd_move_table_group` | `groupId`, `x`, `y` | Talde bat mugitzen du haren laukizuzena puntu horretan has dadin, bere taulekin batera desplazamendu berean, haren titulu-barra arrastatzeak egiten duen bezala. 20 pixel baino gutxiagoko mugimendu batek, horizontala eta bertikala batuta, ez du desegite-urratsik sortzen. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | Talde baten laukizuzena ezartzen du, haren taulak dauden lekuan geratzen direla. `x` eta `y` adierazten ez badira, izkina mantentzen da. Taldearen taulak beren barne-tartearekin hartuko ez lituzkeen laukizuzena ukatu egiten da, hartu behar duen laukia adierazten duen mezu batekin. |
| `erd_set_table_group` | `tableIds`, `groupId` | Taulak talde batean sartzen ditu, bakoitza zegoen taldetik ateraz. `groupId` argumentua `null` edo kate hutsa bada, talde guztietatik ateratzen ditu. |

Taldeak `View Option` → `Table Groups` bidez ezkutatuta dauden bitartean, tresna hauek taldeak gehitzen eta aldatzen dituzte hala ere, eta ezkutuan geratzen dira taldeak erakusten diren arte. Ikus [Taldeak ezkutatzea](../guide/guides/table-groups.md#hiding-groups).
`erd_sort_tables` tresnak talde bakoitzeko taulak elkarrekin mantentzen ditu, `erd_import_dbml` eta `erd_import_json` tresnek taldeak ekartzen dituzte (ikus [Inportazioa](#import)), eta `erd_read` tresnak aukeratutako taldeen DDLa idazten du `groupNames` argumentuarekin.
Taula-taldeak baino lehenagoko ERD Editor bertsio batek fitxategi baten taldeak kentzen ditu fitxategia gordetzean, `4.0.0` bertsioa baino lehenagoko VS Code luzapenak eta `1.0.0` bertsioa baino lehenagoko Obsidian eta JetBrains pluginek egiten duten bezala. Ikus [Eguneratzea](./installation.md#updating).

### Ezarpenak {#settings}

Agente batek eskemaren beraren ezarpenak ezartzen ditu: datu-basea, haren izena eta [SQL eskema](../guide/guides/schema-sql.md) fitxako scriptak.
Dokumentuak gordetzen duen beste ezarpen guztiak editorean ezartzea erabiltzaileari dagokio: [View Option](../guide/guides/table-related-functions.md#table-view-options) menuko etengailuak, [Ezarpenak](../guide/guides/settings.md) fitxako aukerak, Kode-sortzailearen lengoaia eta izenen idazkerak, mugatzaile mota eta [blokeoak](../guide/guides/settings.md#lock).
Ez dago horiek aldatzen dituen tresnarik, `replace` moduan egindako inportazioak izan ezik: `erd_import_json` tresnak kargatzen duen dokumentuaren ezarpenak eta blokeoak ekartzen ditu, eta beste lauek ikuspegia oihalaren hasierara itzultzen dute. Ikus [Inportazioa](#import).
Zerbitzariaren `1.0.0` bertsioak kendu zituen horiek ezartzen zituzten tresnak: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` eta `erd_set_show`.

`erd_list` tresnak eta `erd_read` tresnaren `snapshot` formatuak ezarpenak fitxategiak gordetzen dituen bezala jakinarazten dituzte, `lockSettings` eremuan blokeo bakoitzeko marka bat dutela: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase` eta `bracketType`.
Blokeatutako lengoaia, izenen idazkera edo mugatzaile mota bere balio blokeatuarekin jakinarazten da, hau da, fitxategiak gordetzen duen eta editore orok irekitzean erabiltzen duen balioarekin, editore baten pantailak edozer erakusten duela ere. Ikuspegia eta fitxa ez dira jakinarazten.

`erd_set_ddl_script` tresnak desegite-urrats bat sortzen du. `erd_set_database` eta `erd_set_database_name` tresnek ez dute bat ere sortzen; beraz, `erd_undo` tresnak ezin ditu desegin.

| Tresna | Argumentuak | Zer egiten duen |
| --- | --- | --- |
| `erd_set_database` | `value` | Datu-basea ezartzen du: `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks` edo `Snowflake`. Datu-basearen datu motak zehazten ditu, baita `erd_read` tresnak `vendor` argumenturik ematen ez denean idazten duen DDLa ere. |
| `erd_set_database_name` | `value` | Datu-basearen izena ezartzen du, `erd_read` tresnaren `use` eta `createAndUse` goiburuek aipatzen dutena. |
| `erd_set_ddl_script` | `position`, `sql` | Taulen inguruan idazten diren bi scriptetako bat ezartzen du. Ikus [Taulen aurreko eta ondorengo scriptak](../guide/guides/schema-sql.md#before-and-after-scripts). `position` argumentua `before` da, taulen aurretik idazten dena, adibidez `CREATE EXTENSION` edo `CREATE SCHEMA`, edo `after`, haien ondoren idazten dena, adibidez `GRANT` edo `CREATE VIEW`. `sql` argumentuak script osoa ordezten du, gehienez 10.000 karaktere, eta kate huts batek kendu egiten du. Irakurri lehenik unekoa `erd_read` tresnaren `scripts` formatuarekin. |

Script bat dagoen bezala sartzen da datu-base guztien DDLan; beraz, idatzi dokumentuaren datu-baserako. MSSQL datu-basean, `GO` lerro bat gehitzen da azken lerroa `GO` ez duen script baten ondoren.
Script hauek baino lehenagoko ERD Editor bertsio batek fitxategi baten scriptak kentzen ditu fitxategia gordetzean, `4.0.0` bertsioa baino lehenagoko VS Code luzapenak eta `1.0.0` bertsioa baino lehenagoko Obsidian eta JetBrains pluginek egiten duten bezala. Ikus [Eguneratzea](./installation.md#updating).

### Inportazioa {#import}

Tresna hauek eskema bat editorearen Import menuak bezala irakurtzen dute. Ikus [Fitxategiak inportatzea edo esportatzea](../guide/guides/file-import-export.md).
Bakoitzak testua `value` gisa hartzen du, eta `mode` argumentua: `replace`, lehenetsia, edo `append`.

| Tresna | Argumentuak | Zer egiten duen |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | SQL DDLa kargatzen du, `CREATE TABLE` sententziak eta antzekoak. |
| `erd_import_graphql` | `value`, `mode?` | GraphQL SDL bat kargatzen du. |
| `erd_import_dbml` | `value`, `mode?` | DBMLa kargatzen du. `TableGroup` bakoitza izendatzen dituen taulen taula-talde bihurtzen da. Ikus [DBML](../guide/guides/file-import-export.md#dbml). |
| `erd_import_aml` | `value`, `mode?` | AMLa kargatzen du. |
| `erd_import_json` | `value`, `mode?` | erd-editor JSON dokumentu bat kargatzen du, adibidez beste `.erd.json` fitxategi bat. |

`replace` moduak dokumentua ordezten du, eta `erd_undo` tresnak aurrekoa leheneratzen du:

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` eta `erd_import_aml` tresnek taula, erlazio, indize, ohar eta taula-talde guztiak ordezten dituzte. Dokumentuaren ezarpenak mantentzen dituzte, blokeoak barne, ikuspegia izan ezik, oihalaren hasierara itzultzen baita, % 100ean.
- `erd_import_json` tresnak dokumentu osoa ordezten du, ezarpenak barne: JSONaren ezarpenek eta blokeoek dokumentu honenak ordezten dituzte, eta blokeorik erregistratzen ez duen JSON batek blokeo guztiak aktibatzen ditu eta ikuspegia oihalaren hasieran jartzen du. Dokumentu honen ezarpenak mantentzeko, abiatu `erd_read` tresnaren `json` formatuak ematen duen testutik. Testu huts batek dokumentu berri bat ematen du, `erd_open_document` tresnak `create` argumentuarekin sortzen duenaren antzekoa.

`append` moduak inportazioa dokumentuari gehitzen dio, editorearen [Inportatu eta gehitu](../guide/guides/file-import-export.md#import-and-add) aukerak bezala, eta `erd_undo` dei batek gehikuntza osoa kentzen du:

- Testuak duena entitate berri gisa sartzen da, ID berriekin, bloke batean: dokumentuak duen guztiaren azpian (ezkutuko oharrak eta taula-taldeak barne) eta haren ezkerreko ertzarekin lerrokatuta. Lehendik dauden taula eta ezarpen guztiak geratzen dira, izen bereko taula bat barne: ez da ezer izenaren arabera bateratzen.
- Erlazioak eta indizeak inportazioak ekartzen dituen taulen artean soilik sartzen dira; beraz, testuak deklaratzen ez duen taula baterako gako arrotz bat baztertu egiten da.
- `erd_import_sql`, `erd_import_graphql` eta `erd_import_aml` tresnek taulak gehitzen dituzte beren erlazio eta indizeekin, eta `erd_import_dbml` tresnak bere taula-taldeak ere bai. `erd_import_json` tresnak taulak, erlazioak, indizeak, oharrak eta taula-taldeak gehitzen ditu, inoiz ez bere ezarpenak, eta testu hutsa ukatu egiten du.

JSON dokumentu batek bere antolaketa mantentzen du, taula-taldeak barne: taulak kokatzen dituen lekuan `replace` moduarekin, eta gehitutako blokearen barruan `append` moduarekin.
SQL, GraphQL, DBML eta AML formatuetako taulak errenkadetan antolatzen dira, zutabe gutxien dituztenak lehenik eta talde bakoitzeko taulak elkarrekin, `erd_sort_tables` tresnak kokatzen dituen bezala, eta inoiz ez `Flow` bidez, editorearen beraren inportazioak ahal duenean antolatzen dituen bezala. Lau tresna horiek testu hutsa ukatzen dute bi moduetan.

## erd_batch {#erd_batch}

`erd_batch` tresnak hainbat edizio-tresna exekutatzen ditu ordenan, edizio bakar gisa: denak ala bat ere ez.

- `operations` argumentuak gehienez 100 sarrera ditu, bakoitza `{ tool, as?, args? }` formakoa; `args` tresnaren argumentuak dira, `path` gabe.
- Eragiketak lehenik dokumentuaren kopia batean probatzen dira. Ukatutako eragiketa izendatu egiten da, adibidez `operations[1] erd_remove_table: …`, eta ez da ezer aplikatzen.
- `erd_undo` dei batek sorta osoa desegiten du, desegin ezin dituen eragiketak izan ezik, emaitzaren `undoNote` eremuak aipatzen dituenak: desegite-urratsik sortzen ez duen tresna batenak, adibidez `erd_set_database`, eta dokumentua urratsik sortu gabe aldatu dutenak, adibidez `erd_move_table_group` labur bat. Desegite-urratsik batere sortu ez duen sorta `erd_undo` tresnak saltatu egiten du. Emaitzako `historyEntries` eremuak sortaren barruko editorearen historiako sarrerak zenbatzen ditu, ez `erd_undo` deiak.
- Zuzeneko saio batean, editoreak sorta osoa onartzen du edo ezer ere ez.

Agente batek ezin ditu jakin sorta batek sortzen dituen IDak deia egin aurretik; beraz, `as` bidez izendatutako eragiketa bati esker, geroko eragiketa batek haiei erreferentzia egin diezaieke: `$name` edo `$name.0` sortutako lehen IDarentzat, `$name.1` bigarrenarentzat eta `$name.last` azkenarentzat.
Izen batek ASCII letrak, digituak eta azpimarrak ditu, ez da digitu batekin hasten, eta eragiketa bakar bat izendatzen du soilik.
Erreferentzia bat argumentu batek entitate baten IDa hartzen duen lekuetan soilik ebazten da; beraz, `$x` dioen izen edo iruzkin bat testu gisa geratzen da.

Taula bat bere zutabeekin eta erlazio batekin, dei bakarrean:

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

`users` taulari eta haren `id` gakoari erlazioa baino lehen ematen zaie izena; beraz, erlazioak `orders` taulari gehitzen dion gako arrotzeko zutabea `users_id` da.

## Emaitzak {#results}

Edizio batek JSON lerro bakar batekin erantzuten du:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Eremua | Esanahia |
| --- | --- |
| `mode` | `live` edo `headless`. Ikus [Zuzenean eta editorerik gabe](./live-and-headless.md). |
| `createdIds` | Deiak sortu duenaren IDak, ordenan. |
| `batches`, `historyEntries` | Deiak zenbat aldaketa-sorta bidali dituen eta editorearen historian zenbat sarrera sortu dituen. |
| `undoable`, `undoNote` | `undoable` eremua `false` da `erd_undo` tresnak deia saltatuko duenean, eta `undoNote` eremuak zergatik adierazten du: tresnak ez du desegite-urratsik sortzen, deiak dokumentua aldatu du urratsik sortu gabe, 20 pixel baino gutxiagoko `erd_move_table_group` batek egiten duen bezala, edo dokumentuak bazuen jada balioa. `erd_batch` tresnaren emaitza batek beti du `undoNote` eremu bat. Sortak desegite-urrats bat sortu duenean, `erd_undo` dei batek sorta desegiten duela dio, eta bere lekuan uzten duen edozein eragiketa aipatzen du; bat ere sortu ez duenean, emaitzak `undoable: false` du, eta azalpenak `erd_undo` tresnak saltatu egiten duela dio. |
| `mismatch` | Deiak tresnak deklaratzen duen kopuruaz bestelako sorta edo historiako sarrera kopurua sortu duenean agertzen da. |
| `notes` | Saioari buruzko zerbait aldatu denean agertzen da, adibidez itxi den edo dokumentua zerbitzatzeari utzi dion editore bat, edo diskoan aldatu den fitxategi bat. |

Ukapen bat kode bat eta zer egin adierazten duen mezu bat dituen errore-emaitza bat da:

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | Zergatik |
| --- | --- |
| `notFound` | ID batek ez du entitate bizirik izendatzen, edo fitxategia ez da existitzen. |
| `invalidArgs` | Argumentu bat falta da edo balio okerra du. |
| `invalidPath` | Bide-izena ez da ERD dokumentu bat. Windows sisteman, baita Windowsek idatzita dagoen bezala gordetzen ez duen izena duen bide-izena ere, edo editore batek beste bide-izen batekin daukan dokumentu batera iristen dena, mezuak aipatzen duena. |
| `invalidDocument` | Fitxategia ez da editoreak irakur dezakeen dokumentu bat. |
| `tooLarge` | Irakurketa bat ez da erantzun bakar batean sartzen. |
| `blocked` | Agente-gunea desaktibatuta duen editore batek dauka dokumentua. Mezuak nola aktibatu adierazten du: VS Code editorean, jo lan-eremua fidagarritzat eta aktibatu `dineug.erd-editor.agentHub.enabled` ezarpena, edo birkargatu leihoa; Obsidian aplikazioan, aktibatu Coding agents aukera, edo birkargatu Obsidian; JetBrains IDE batean, aktibatu Coding agents aukera, edo berrabiarazi IDEa aktibatuta badago. |
| `hubDisabled` | JetBrains IDE batek fidagarritzat jotzen ez duen proiektu batean soilik dauka dokumentua. Irakurketek funtzionatzen dute oraindik; jo proiektua fidagarritzat agenteak edita dezan. |
| `conflict` | Fitxategia diskoan aldatu da deiak iraun bitartean. Ez da ezer idatzi. |
| `hubAppeared`, `hubGone` | Agenteak diskoan editatzen ari zen dokumentu bat zerbitzatzen hasi da editore bat, edo hura zerbitzatzen zuen editorea martxan dago oraindik, baina haren blokeo-fitxategia eta konexioa desagertu dira. Ez da ezer idatzi. |
| `notSaved` | `erd_save` tresnak ezin izan du editorearen dokumentua gorde. |
| `readonly` | Editoreak irakurtzeko soilik dauka dokumentua, adibidez idatzi ezin duen edo diagrama gisa irakurri ezin duen fitxategi bat. Editorerik gabe, fitxategia bera da irakurtzeko soilik, adibidez editatzeko atera ez den Perforce edo TFVC fitxategi bat. Ez da ezer idatzi. |
| `protocolMismatch` | Editorearen ERD Editor luzapenak edo pluginak eta zerbitzariak protokolo-bertsio desberdinak erabiltzen dituzte, adibidez `1.0.0` bertsioko zerbitzaria `3.x` bertsioko VS Code luzapen batekin. Irakurketak ere ukatzen dira, eta mezuak eguneratu beharreko aldea aipatzen du. Ikus [Eguneratzea](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | Editore baten guneak ez du konexioa onartu, ez du 30 segundoren barruan erantzun, edo deian zehar eten du konexioa. Windows sisteman, `hubUnreachable` kodeak esan nahi du, halaber, Windowsek agentea gunetik kanpo utzi duela: editorea agenteak baino eskubide gehiagorekin exekutatzen da, adibidez editorea administratzaile gisa abiarazi denean eta agentea ez, edo agentea isolamendu-ingurune batean exekutatzen da. |

Beste kode batzuk ez dira hain ohikoak, eta ukapen orok gertatu dena adierazten duen mezu bat du.

Edizio-tresnek, `erd_batch` tresnak eta hiru irakurketa-tresnek deklaratzen ez duten argumentu bat edo mota okerreko bat ukatzen dute, JSON-RPC invalid params errore batekin (`-32602`), dokumentua ukitu aurretik; beraz, gaizki idatzitako argumentu bat ez da inoiz isilean baztertzen.
Saioko bost tresnek ez dituzte aintzat hartzen ezagutzen ez dituzten argumentuak.
