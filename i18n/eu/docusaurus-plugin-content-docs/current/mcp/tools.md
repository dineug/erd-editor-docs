---
sidebar_position: 4
description: "erd-editor MCP zerbitzariak eskaintzen dituen tresna guztiak: dokumentu bat orrialdez orrialde irakurtzea, hiztegiaren egiaztapenak, 67 edizio-tresnak, erd_batch, eta emaitza batek eta ukapen batek duten itxura."
---

# Tresnak

Zerbitzariak 77 tresna eskaintzen ditu: saioko bost tresna, lau irakurketa-tresna, 67 edizio-tresna, edizio-eragiketa bakoitzeko bat, eta `erd_batch` tresna, hainbat edizio-tresna edizio bakar gisa exekutatzen dituena.

`erd_list_documents` tresna izan ezik, tresna guztiek dokumentuaren `path` bide-izena hartzen dute lehen argumentutzat, eta beheko tauletan ez da ageri.
`?` ikurraz markatutako argumentua aukerakoa da.

## Saioko tresnak {#session-tools}

| Tresna | Argumentuak | Zer egiten duen |
| --- | --- | --- |
| `erd_list_documents` | | ERD dokumentuak zerrendatzen ditu `path`, `open`, `active`, `dirty` eta `readonly` eremuekin: laneko direktorioa zerbitzatzen duen editorearenak (JetBrains IDE batean, irekitako proiektu guztietakoak), eta, bestela, laneko direktorioaren azpiko ERD fitxategiak. |
| `erd_open_document` | `create?` | Dokumentu bat editatzeko irekitzen du, hura zerbitzatzen duen editorearen ERD Editor bidez, halakorik badago. `create` argumentuarekin, fitxategia falta bada, lehenik sortu egiten du, eta luzapenik gabeko izen bati `.erd.json` gehitzen zaio. |
| `erd_save` | | Editore batek daukan dokumentu bat gordetzen du. VS Code editoreak agentearen edizioak gorde gabe uzten ditu tresna honi deitzen zaion arte; Obsidian aplikazioak eta JetBrains IDE batek zureak gordetzen dituzten bezala gordetzen dituzte, eta tresna honek berehala idazten ditu. Editorerik gabeko moduan, edizio guztiak idatzita daude jada, haren emaitzaren `saved: true` eremuak dioen bezala, eta tresna honek ez du ezer egiten. |
| `erd_undo` | | Agente honek egindako azken edizioa desegiten du, inoiz ez zurea. Desegite-urratsik sortu ez duten deiak saltatu eta aipatu egiten ditu. |
| `erd_redo` | | `erd_undo` tresnak desegindako azken edizioa berriro aplikatzen du. |

Modu bakoitzean gordetzeak eta desegiteak zer egiten duten jakiteko, ikus [Zuzenean eta editorerik gabe](./live-and-headless.md).

## Dokumentu bat irakurtzea {#reading-a-document}

| Tresna | Argumentuak | Zer egiten duen |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Ezarpenak eta kopuruak, eta ondoren taulen orrialde bat, haien indize eta erlazioekin; taula bakoitza bere IDarekin, oihaleko kokapen eta tamainarekin, zutabe kopuruarekin, izen logikoarekin, baldin badu, eta, talde batean badago, bere taula-taldearekin. Bilaketarik egiten ez badu, taulen ondoren taula-taldeak, oharrak, eta gero domeinuak, terminoak eta hitzak datoz. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?`, `wordIds?`, `termIds?`, `domainIds?` | Izendatutako entitateak, osorik: taulak beren zutabe eta taula-taldearekin, erlazioak beren zutabeekin eta `onDelete` eta `onUpdate` balioekin, indizeak beren zutabeekin, oharrak beren testuarekin, taula-taldeak beren taulekin, eta hitzak, terminoak eta domeinuak beren eremu guztiekin. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `logicalNameAsComment?`, `tableIds?`, `tableNames?`, `groupNames?` | Dokumentu osoa batera, lau formatuetako batean, edo taula edo taula-talde batzuen DDLa soilik. |
| `erd_list_checks` | `level?`, `tableIds?`, `tableNames?`, `offset?`, `limit?` | Hitzen, terminoen eta domeinuen hiztegiek aurkitzen dituzten akatsak, editorearen Hiztegia fitxako `Checks` orriak zerrendatzen dituen bezala, orrialdez orrialde. Ez du ezer aldatzen. Ikus [Hiztegiaren egiaztapenak](#dictionary-checks). |

Agente batek `erd_list` tresnarekin aurkitzen ditu IDak, `erd_get` tresnarekin irakurtzen ditu zutabeak, hiztegi-errenkadak eta beste xehetasun batzuk, eta ID horiek edizio-tresnei pasatzen dizkie.
`erd_list` tresnan, taula baten tamaina oihalean hartzen duen laukia da: altuera zehatza, zabalera gutxi gorabeherakoa.
Taula-talde bat gordetzen duen laukizuzenaren bidez zerrendatzen da, bere izenarekin, kolorearekin eta zenbat taula dituen adierazita.
Erlazio bakoitza behin zerrendatzen da, bere bi tauletako batekin.
Hiztegi-errenkada bat bere IDarekin, bere `name` eremuarekin eta izen fisiko bati edo zutabe bati ematen dionarekin zerrendatzen da: domeinu baten `dataType`, termino baten `physicalName` eta `domainId`, eta hitz baten `abbreviation`. Hiztegi bakoitzak bere errenkadak bere orriak erakusten dituen ordenan zerrendatzen ditu.
`erd_list` eta `erd_read` tresnek jakinarazten dituzten ezarpenak fitxategiak gordetzen dituenak dira. Ikus [Ezarpenak](#settings).

`erd_get` tresnan eta `erd_read` tresnaren `snapshot` formatuan, taula eta zutabe bakoitzak bere `logicalName` du, kate huts bat izen logikorik ez badu, eta `nameDerived`, `true` dena hiztegiek izena eman duten bitartean, izen logiko berri batek berriro erator dezan. Ikus [Hiztegiak](#dictionaries).
Zutabe bakoitzak bere `domainId` du, eta termino bakoitzak ere bai: kate huts bat domeinurik ez badu, edo dokumentuak jada zerrendatzen ez duen domeinu baterako.

`erd_read` tresnak lau formatuetako bat hartzen du:

| `format` | Zer erantzuten duen |
| --- | --- |
| `snapshot` | JSON trinkoa, entitate guztiekin eta haien IDekin, taula-taldeak eta hitzen, terminoen eta domeinuen errenkadak barne, eta ezarpenekin, SQL eskemaren scriptekin batera. Ikusle batetik bestera aldatzen dena kanpoan uzten du: neurtutako zabalerak, pilatze-ordena, ikuspegia, fitxa eta Izenen ikuspegia. Handia da eskema handi batean. |
| `sql` | Zortzi datu-baseetako baterako DDLa: `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` edo `SQLite`. `vendor` argumentuaren balio lehenetsia dokumentuan ezarritako datu-basea da. Dokumentu osoaren DDLak bere aurreko eta ondorengo scriptak barne hartzen ditu. `tableIds`, `tableNames` edo `groupNames` argumentuekin, taula horiek soilik, dituzten gako arrotzekin, eta scriptik gabe. Gako arrotzek beren ON DELETE eta ON UPDATE ekintzak dituzte, helburuko datu-baseak kanpoan uzten dituenak izan ezik. Ikus [ON DELETE eta ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | Dokumentu osoa, gordetzean fitxategian idazten den bezala-bezala, editoreak oraindik gorde ez dituen edizioak barne. Ikus [Biltegiratze-forma eta exekuzio-garaiko balioa](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Dokumentuaren aurreko eta ondorengo scriptak soilik, `{"before":"…","after":"…"}` gisa, bakoitza hutsik, ezarri gabe badago, eskema edozein tamainatakoa izanda ere. |

`sql` formatuak soilik hartzen ditu `vendor`, `statements`, `header`, `logicalNameAsComment`, `tableIds`, `tableNames` eta `groupNames` argumentuak, eta beste formatu batek ukatu egiten ditu.

- `statements`: `create`, lehenetsia; `ifNotExists`, MySQL, MariaDB, PostgreSQL, SQLite eta Databricks datu-baseetan `CREATE TABLE IF NOT EXISTS` eta besteetan `CREATE TABLE` soila idazten duena; edo `recreate`, taulak sortu aurretik ezabatzen dituena, eta Snowflake datu-basean, horren ordez, `CREATE OR REPLACE TABLE` idazten duena.
- `header`: `none`, lehenetsia; `use`, dokumentuaren datu-basearen izenak adierazten duen datu-basea edo eskema hautatzen duena; edo `createAndUse`, lehenik hura sortzen duena. Oracle datu-baseak `use` bakarrik duenez, han `createAndUse` balioak `use` idazten du, eta PostgreSQL datu-baseak `createAndUse` bakarrik duenez, han `use` balioak ez du goibururik idazten. SQLite datu-baseak ez du goibururik idazten, eta datu-basearen izena hutsik dagoen edo identifikatzaile soila ez den bitartean, ezein datu-basek ez du goibururik idazten.
- `logicalNameAsComment`: `true` balioak taula edo zutabe baten izen logikoa haren iruzkin gisa idazten du iruzkina hutsik edo zuriunez soilik osatuta dagoen bitartean, datu-base bakoitzak iruzkin bat idazten duen lekuan eta forman, eta testua duen iruzkin oro mantentzen du; `false` balioak, lehenetsiak, ez du izen logikorik idazten. Ikus [Izen logikoak iruzkin gisa](../guide/guides/schema-sql.md#logical-names-as-comments).
- `groupNames`: izendatutako taula-taldeen taulak, izenez, maiuskulak eta minuskulak bereizi gabe, `tableIds` eta `tableNames` argumentuetakoekin batuta. Inongo talderekin bat ez datorren izena `notFound` kodearekin ukatzen da. Taularik ez duen talde batek ez du taularik gehitzen, eta taularik batere gabe geratzen den irakurketa bat, izendatutako talde guztiak hutsik daudenean eta taularik izendatzen ez denean bezala, `invalidArgs` kodearekin ukatzen da.

`statements`, `header` eta `logicalNameAsComment` argumentuak taula batzuen DDLari ere aplikatzen zaizkio. Editorearen [SQL eskema](../guide/guides/schema-sql.md#options-panel) fitxako `Statements` eta `Header` aukerek eta `Write logical names into empty comments` etengailuak bezala funtzionatzen dute, nahiz eta fitxa `If not exists` eta `CREATE + USE` balioekin abiatzen den. Etengailua desaktibatuta abiatzen da, `logicalNameAsComment` bezala.
Izenak fitxategiak gordetzen duen mugatzaile motarekin inguratzen dira, eta `Bracket Type` blokeatuta dagoen bitartean, blokeatutakoarekin. Ikus [Blokeoa](../guide/guides/settings.md#lock).

### Eskema handiak {#large-schemas}

Ehunka edo milaka taulako eskemek ere funtzionatzen dute.
Irakurketa batek gehienez 40.000 karaktereko erantzuna ematen du, Claude Codek tresna baten emaitza fitxategi batean alde batera uzten duen mugaren azpitik.

- `erd_list` tresnak lehenespenez 100 elementuko orrialde bat erantzuten du, lehenik taulak, gero taula-taldeak, oharrak, domeinuak, terminoak eta hitzak, guztiak zeharkatzen dituen desplazamendu bakar batekin, eta hurrengo orrialdea non hasten den adierazten du `nextOffset` eremuarekin eta `note` eremu batekin. Pasatu `nextOffset` hori `offset` gisa, `query` argumentu berarekin.
- `query` argumentuak taula edo zutabe baten izeneko, izen logikoko edo iruzkineko hitzen bidez aurkitzen ditu taulak, maiuskulak eta minuskulak bereizi gabe. Izenean edo izen logikoan hitz gehiago dituzten taulak agertzen dira lehenik. Bilaketa batek ez du taula-talderik, oharrik edo hiztegi-errenkadarik zerrendatzen.
- `namesOnly` argumentuak taulen izenak soilik zerrendatzen ditu, 2.000 izen labur inguru erantzun bakarrean.
- `erd_get` eta `erd_read` tresnek IDez gain `tableNames` ere hartzen dute, eta `erd_read` tresnak `groupNames` hartzen du; beraz, eskema handi batean SQL kontsulta bat eskatzen zaion agente batek behar dituen taulen DDLa soilik irakurtzen du.
- Hiztegiak ere zatika datoz: `erd_list` tresnak haien errenkadak orrialdeka ematen ditu taulen ondoren, eta `erd_get` tresnak errenkadak osorik ematen ditu `domainIds`, `termIds` eta `wordIds` argumentuen bidez.
- `erd_get` tresnak ezer izendatzen ez duten IDak eta izenak `missing` eremuan zerrendatzen ditu, eta erantzun batean lekurik ez duten IDak `notReturned` eremuan, berriro eskatzeko.
- `erd_list_checks` tresnak ere modu berean erantzuten du, orrialdez orrialde. Ikus [Hiztegiaren egiaztapenak](#dictionary-checks).
- Erantzun baterako handiegia den irakurketa `tooLarge` kodearekin ukatzen da, nola murriztu adierazita.

### Hiztegiaren egiaztapenak {#dictionary-checks}

`erd_list_checks` tresnak egiaztapenak zerrendatzen ditu, editorearen [Egiaztapenak orria](../guide/guides/dictionary.md#the-checks-sheet) bezala eta ordena berean: lehenik hitzen egiaztapenak, gero terminoenak eta domeinuenak, hiztegi bakoitza bere orriak erakusten duen ordenan, eta gero taula bakoitza, bere zutabeak ondoren dituela.
Orrian bezala, egiaztapen bat hark irakurtzen duen hiztegiak errenkadaren bat duen bitartean soilik exekutatzen da. Hiztegietan hitzik, terminorik edo domeinurik ez duen dokumentu bat ez da batere egiaztatzen: `total` eremua `0` da, eta `note` eremuak hala dio.

- `level`: `error` edo `warning`, maila hori bakarrik nahi bada; biak, lehenespenez.
- `tableIds` eta `tableNames`: taula horien eta haien zutabeen egiaztapenak soilik, izenak maiuskulak eta minuskulak bereizi gabe, eta horrek hiztegien beren errenkadak kanpoan uzten ditu. Inongo taula izendatzen ez duen ID edo izen bat `notFound` kodearekin ukatzen da.
- `offset` eta `limit`: lehenespenez 100 egiaztapeneko orrialde bat, erantzun bat betetzen den lekuan ere gelditzen dena. Gehiago dauden bitartean, `nextOffset` eremuak eta `note` eremu batek hurrengo orrialdea non hasten den adierazten dute; pasatu `offset` gisa, iragazki berekin. Egiaztapen batzuk konpondu ondoren, zerrendatu berriro `0` desplazamendutik: konpondutako egiaztapen bat zerrendatik ateratzen da; beraz, geroko desplazamendu batek oraindik konpondu gabeko egiaztapenak saltatuko lituzke.

Erantzunak hauek ditu: `total`, iragazkiek zenbat egiaztapen mantentzen dituzten; `counts`, horietatik kode bakoitzak zenbat dituen, bat ere ez duen kodea kanpoan utzita; eta orrialdea, `checks` gisa.
Egiaztapen bakoitzak bere `level`, bere `code`, eta bere helburuaren `kind` eta `id` ematen ditu: `table`, `column`, `word`, `term` edo `domain`. Zutabe baten egiaztapenak haren `tableId` eta haren taularen izena gehitzen ditu, azken hori `table` gisa.
`name` helburuaren izena da, taula baten edo zutabe baten izen fisikoa, eta haren ondoan `logicalName` dago, halakorik duenean. `field` egiaztapenak irakurtzen duena da: `name`, `logicalName` edo `domainId`. `text` han aurkitu duena da, eta `suggestions`, hiztegiek ezer eskaintzen duten lekuan, horren ordez erabili beharrekoa. Horrela, agente batek egiaztapen bat konpon dezake `erd_get` deirik gabe:

```json
{"level":"warning","code":"physicalNameMismatch","kind":"column","id":"8e1z0q4xk2m7cwd5tfb9h3ynp","tableId":"03h17be2plxpj5n59tqag7ogj","table":"users","name":"id","logicalName":"Member Number","field":"name","text":"id","suggestions":["MBR_NO"]}
```

| `code` | `level` | `Type` orrian | Zer aurkitzen du |
| --- | --- | --- | --- |
| `duplicateName` | `error` | `Duplicate name` | Hiztegi bateko bi errenkadek partekatzen duten izen bat. Errenkada bakoitza zerrendatzen da. |
| `unknownDomain` | `error` | `Unknown domain` | Dokumentuak jada zerrendatzen ez duen domeinu bati lotutako zutabe edo termino bat. `text` domeinu horren izena da, edo haren IDa, izenik ezagutzen ez denean. |
| `forbiddenWord` | `error` | `Forbidden word` | Hitzen batek debekatutzat zerrendatzen duen hitz bat, taula baten edo zutabe baten izen logikoan edo termino baten izenean. `suggestions` hitz estandarrak dira. |
| `unregisteredWord` | `warning` | `Unregistered word` | Inongo hitzek zerrendatzen ez duen testua, leku berberetan. |
| `synonymWord` | `warning` | `Synonym` | Hitz estandar baten ordez erabilitako sinonimo bat, leku berberetan. `suggestions` hitz estandarrak dira. |
| `physicalNameMismatch` | `warning` | `Physical name mismatch` | Taula baten edo zutabe baten izen fisikoa, haren izen logikoaren terminoak ematen duenaz bestelakoa. Iradokizuna terminoaren izen fisikoa da, edo, terminoak halakorik ez duen bitartean, haren hitzek osatzen dutena. |
| `domainTypeMismatch` | `warning` | `Domain type mismatch` | Datu mota lotuta dagoen domeinuarena ez duen zutabe bat. `text` zutabearen mota da, eta iradokizuna domeinuarena. |

Egiaztapen bakoitzak izen bat nola irakurtzen duen [Egiaztapen bakoitzak zer aurkitzen duen](../guide/guides/dictionary.md#what-each-check-finds) atalean azaltzen da.

## Edizio-tresnak {#edit-tools}

IDak `erd_list` eta `erd_get` tresnetatik datoz, edo entitatea sortu zuen deiaren `createdIds` eremutik.
ID berri bat 25 letra xehe eta digituz osatuta dago, adibidez `03h17be2plxpj5n59tqag7ogj`, eta dokumentuak lehendik duen IDak bere forma gordetzen du; beraz, ez atera ondoriorik ID baten itxuratik.
`x` eta `y` argumentuak oihaleko ezkerreko eta goiko ertzak dira, pixeletan, eta kolore bat CSS kolore hamaseitar bat da, adibidez `#3b82f6`, edo kate huts bat, kolorea kentzen duena.

### Taulak {#tables}

| Tresna | Argumentuak | Zer egiten duen |
| --- | --- | --- |
| `erd_add_table` | | Taula huts bat gehitzen du leku libre batean eta haren IDa `createdIds` eremuan itzultzen du. |
| `erd_remove_table` | `tableId` | Taula bat kentzen du, bere zutabe eta indizeekin eta hura ukitzen duen erlazio guztiekin. |
| `erd_change_table_name` | `tableId`, `value` | Taula baten izena aldatzen du. Izena eskuz idatzitzat hartzen da orduan; beraz, geroko izen logiko batek dagoen bezala uzten du, hutsik ez dagoen bitartean. Ikus [Hiztegiak](#dictionaries). |
| `erd_change_table_comment` | `tableId`, `value` | Taula baten iruzkina ezartzen du. Kate huts batek garbitu egiten du. |
| `erd_set_table_logical_name` | `tableId`, `value` | Taula baten izen logikoa ezartzen du. Kate huts batek garbitu egiten du, eta izena dagoen bezala uzten du. Taularen izena hutsik dagoen edo eratorria den bitartean, hiztegiek izen logikotik eratortzen dute. Ikus [Hiztegiak](#dictionaries). Termino batek ez dio domeinurik ematen taula bati. |
| `erd_change_table_color` | `tableId`, `color` | Taula baten kolorea ezartzen du. |
| `erd_move_table` | `tableId`, `x`, `y` | Taula bat oihaleko kokapen batera mugitzen du. |
| `erd_move_tables` | `positions` | Hainbat taula edizio bakarrean mugitzen ditu, eta `erd_undo` dei bakar batek desegiten du. `positions` argumentuak `{ tableId, x, y }` bat du taula bakoitzeko, taula bakoitza gehienez behin. |
| `erd_sort_tables` | | Taula guztiak errenkadetan kokatzen ditu oihalean zehar, zutabe gutxien dituztenak lehenik, `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` eta `erd_import_aml` tresnek kokatzen dituzten bezala. Taula-talde bateko taulak elkarrekin geratzen dira, eta talde bakoitzaren laukia haien inguruan doitzen da. |

### Zutabeak {#columns}

| Tresna | Argumentuak | Zer egiten duen |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Zutabe huts bat gehitzen dio taula bati eta haren IDa `createdIds` eremuan itzultzen du. |
| `erd_remove_columns` | `tableId`, `columnIds` | Taula bateko zutabeak kentzen ditu, haiek erabiltzen dituzten erlazio eta indize-sarrerekin. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Zutabe baten izena aldatzen du. Izena eskuz idatzitzat hartzen da orduan, taula batena bezala. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Datu mota ezartzen du, adibidez `INT` edo `VARCHAR(255)`. [Erlazioen datu moten sinkronizazioa](../guide/guides/settings.md#relationship-datatype-sync) aktibatuta dagoen bitartean, aldaketak erlazioei jarraitzen die bi noranzkoetan, editorean bezala: serial mota bat gordetzen duen zenbaki osoko mota gisa iristen da gako arrotzetara, `erd_add_relationship` tresnak kopiatzen duen bezala, eta serial gako batek bere mota mantentzen du bere gako arrotzetako bat aldatzen denean, eta horrek aldaketa han gelditzen du. Sinkronizazioa aktibatzea edo desaktibatzea erabiltzaileari dagokio, eta `erd_list` tresnak `relationshipDataTypeSync` gisa jakinarazten du. Domeinu bati lotutako zutabe bati domeinuarena ez den mota bat ezartzen zaionean, domeinu horrekiko lotura kentzen zaio, eta gauza bera gertatzen da sinkronizazioa iristen den zutabe bakoitzarekin, haren mota berria bere domeinuarenaz bestelakoa denean. Ikus [Lotura kentzea](../guide/guides/dictionary.md#unlinking). |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Balio lehenetsia ezartzen du, SQL testu gisa. Kate huts batek garbitu egiten du. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Iruzkina ezartzen du. Kate huts batek garbitu egiten du. |
| `erd_set_column_logical_name` | `tableId`, `columnId`, `value` | Zutabe baten izen logikoa ezartzen du. Kate huts batek garbitu egiten du, eta izena dagoen bezala uzten du. Zutabearen izena hutsik dagoen edo eratorria den bitartean, hiztegiek eratortzen dute, eta termino baten domeinuak zutabea lotzen du eta domeinuaren datu mota ematen dio. Ikus [Hiztegiak](#dictionaries). |
| `erd_set_column_domain` | `tableId`, `columnId`, `domainId?`, `domainName?` | Zutabe bat domeinu bati lotzen dio, IDz edo izenez emanda, bietako bat. Zutabeak domeinuaren datu mota hartzen du, eta mota horrek erlazioei jarraitzen die Erlazioen datu moten sinkronizazioa aktibatuta dagoen bitartean, `erd_change_column_data_type` tresnaren lotura-kentze berberarekin. `null` edo kate huts bat den `domainId` batek, edo `domainName` huts batek, zutabearen lotura kentzen du eta haren mota mantentzen du. |
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
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Bi taula erlazionatzen ditu. Gurasoaren gako nagusia umera kopiatzen du gako arrotzeko zutabe gisa, eta, gurasoak gako nagusirik ez badu, lehenik gako nagusiko zutabe bat sortzen du. Gako arrotzeko zutabe bakoitzari editorean erlazio bat marraztean ematen zaion izena ematen zaio: `users` taulako `id` gakoak `users_id` ematen du, eta `member_id` bezalako gako batek bere izena gordetzen du. Ikus [Gako arrotzen zutabeen izenak](../guide/guides/relationship-editing.md#foreign-key-column-names). Bakoitzak bere gakoaren datu mota kopiatzen du, salbu eta serial gako batek gordetzen duen zenbaki osoko mota ematen duela, adibidez `serial4` motarako `integer`, eta `serial` soila `serial` geratzen dela PostgreSQL, MySQL eta MariaDB datu-baseetatik kanpo. Ikus [Erlazio identifikatzaileak](../guide/guides/relationship-editing.md#identifying-relationships). Bakoitzak bere gakoaren izen logikoa ere hartzen du, eta bere gakoak lotzen duen domeinua lotzen du, serial gako batek beste mota bat ematen dionean izan ezik. `createdIds` eremuak gako-zutabe berri hori du, sortu bada, gako arrotzeko zutabeak, eta erlazioaren IDa azkenik. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Lehendik dauden zutabeen artean erlazio bat marrazten du, hasierako eta amaierako zutabeak kokapenaren arabera parekatuz. Ez dio inongo zutaberi izena aldatzen, ez du datu motarik aldatzen, eta ez du izen logikorik edo domeinurik kopiatzen. |
| `erd_remove_relationship` | `relationshipId` | Erlazio-marra bat kentzen du. Haren gako arrotzeko zutabeak taulan geratzen dira. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Erlazio baten kardinalitatea aldatzen du. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Erlazio baten ON DELETE ekintza ezartzen du: errenkada guraso bat ezabatzeak bere errenkada umeei zer egiten dien. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Erlazio baten ON UPDATE ekintza ezartzen du: gurasoaren gako bat aldatzeak bere errenkada umeei zer egiten dien. |

`erd_add_relationship` tresnak exekutatzen denean ematen die izena gako arrotzeko zutabeei eta haien gakoen izen logikoak kopiatzen ditu. Gakoari geroago emandako izen berri edo izen logiko bat ez zaie iristen; beraz, eman izena lehenik taula gurasoari eta haren gako nagusiari, eta eman gakoari bere izen logikoa.
Ematen dituen izenak eskuz idatzitzat hartzen dira; beraz, geroko izen logiko batek dauden bezala uzten ditu, eta `erd_derive_physical_names` tresnak, berriz, hiztegiei itzultzen dizkie. Ikus [Hiztegiak](#dictionaries).

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

### Hiztegiak {#dictionaries}

Tresna hauek editorearen [Hiztegia](../guide/guides/dictionary.md) fitxako hiru hiztegiak editatzen dituzte; haietatik eratortzen du taula baten edo zutabe baten izen logikoak bere izen fisikoa:

- Hitza izen logikoak osatzen dituen hitz estandar bat da, izen fisiko batean idazten duen laburdurarekin, adibidez `Member` eta `MBR`.
- Terminoa izen logiko oso bat da, ematen duen izen fisikoarekin eta, zutabe baterako, lotzen duen domeinuarekin, adibidez `Member Number`, `MBR_NO` eta `Identifier` dituela.
- Domeinua zutabeak lotzen zaizkion datu mota izendun bat da, adibidez `Identifier`, `INT` motarako.

| Tresna | Argumentuak | Zer egiten duen |
| --- | --- | --- |
| `erd_add_word` | `name`, `abbreviation`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Hitz bat gehitzen du hitzen hiztegiaren amaieran eta haren IDa `createdIds` eremuan itzultzen du. `synonyms` eta `forbiddenWords` komaz bereizita daude: hitzaren beste idazkera batzuk, eta haren ordez erabili behar ez diren hitzak. |
| `erd_update_word` | `wordId`, `name?`, `abbreviation?`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Pasatutako eremuak aldatzen ditu, eta gainerakoak dauden bezala uzten ditu. |
| `erd_remove_word` | `wordId` | Hitz bat kentzen du. |
| `erd_add_term` | `name`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Termino bat gehitzen du terminoen hiztegiaren amaieran eta haren IDa `createdIds` eremuan itzultzen du. `physicalName` gabe, hitzek bat osatzen dute, ahal badute, adibidez `MBR_NO`, `Member Number` terminorako. |
| `erd_update_term` | `termId`, `name?`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Pasatutako eremuak aldatzen ditu, eta gainerakoak dauden bezala uzten ditu. Terminoak izen fisikorik ez duen bitartean pasatutako `name` batek, edo `physicalName` huts batekin pasatutakoak, haren hitzek osatzen duten izen fisikoa ere idazten du, bat osatzen badute. |
| `erd_remove_term` | `termId` | Termino bat kentzen du. |
| `erd_add_domain` | `name`, `category?`, `dataType`, `description?` | Domeinu bat gehitzen du domeinuen hiztegiaren amaieran eta haren IDa `createdIds` eremuan itzultzen du. `category` argumentuak domeinuak taldekatzen ditu, adibidez `Number` edo `Text`. |
| `erd_update_domain` | `domainId`, `name?`, `category?`, `dataType?`, `description?` | Pasatutako eremuak aldatzen ditu, eta gainerakoak dauden bezala uzten ditu. `dataType` berri bat domeinuari lotutako zutabe guztietara iristen da, eta erlazioei jarraitzen die Erlazioen datu moten sinkronizazioa aktibatuta dagoen bitartean, `erd_change_column_data_type` tresnaren lotura-kentze berberarekin. |
| `erd_remove_domain` | `domainId` | Domeinu bat kentzen du. Hari lotutako zutabeek beren datu mota mantentzen dute, eta haiek eta hari lotutako terminoek ez dute domeinurik erakusten: haien `domainId` kate huts gisa irakurtzen da. `erd_undo` tresnak loturak itzultzen ditu, eta gordetzean fitxategitik kanpo geratzen dira. |
| `erd_derive_physical_names` | `scope`, `tableId?`, `columnId?` | Izen fisikoak berriro eratortzen ditu izen logikoetatik, editorearen [Izen fisikoak berriro eratortzea](../guide/guides/dictionary.md#derive-physical-names-again) ekintzak egiten duen bezala, zutabe baterako, taula baterako edo dokumentu osorako. |

- Hiztegi batek izen bakoitza behin baino ez du; beraz, hiztegi bereko beste errenkada batek duen izen bat `invalidArgs` kodearekin ukatzen da. Izenak muturretako zuriuneak kenduta eta maiuskulak eta minuskulak bereizita alderatzen dira; beraz, `Member` eta `member` bi izen dira.
- Eguneratze batek errenkada bere IDaz izendatzen du eta gutxienez eremu bat pasatzen du. Errenkadak dagoeneko dituen balioek ez dute ezer aldatzen eta ez dute desegite-urratsik sortzen; gehitze edo kentze batek beti sortzen du bat.
- Termino baten domeinua `domainId` bidez ematen da, `null` edo kate huts bat domeinurik ez izateko, edo `domainName` bidez, kate huts bat domeinurik ez izateko. `domainName` batek izen hori duen lehen domeinua hartzen du hiztegiaren ordenan, izenak bezala alderatuta. Biak pasatzea, edo inongo domeinuk ez duen `domainName` bat pasatzea, ukatu egiten da. `erd_set_column_domain` tresnak modu berean hartzen du domeinu bat.
- Hitz edo termino bat aldatzeak edo kentzeak ez dio ezeri izena aldatzen eta ez dio ezeri lotura kentzen: eman zituen izenak eta domeinuak dauden bezala geratzen dira. `erd_derive_physical_names` tresnak izenak berriro eratortzen ditu eta termino batek orain ematen duen domeinua lotzen du, baina orain inongo terminorekin bat ez datorren zutabe batek, edo bere terminoak domeinurik ematen ez dion batek, lotuta duen domeinua mantentzen du. `domainId` hutsa duen `erd_set_column_domain` tresnak haren lotura kentzen du.
- Ez dago hiztegi bat CSV gisa inportatzen edo esportatzen, hiztegi bat ordenatzen edo errenkadak posizio jakin batean txertatzen dituen tresnarik, Hiztegia fitxak egiten duen bezala.

`erd_list` tresnak errenkadak zerrendatzen ditu, `erd_get` tresnak eremu guztiak ematen ditu, `erd_read` tresnaren `snapshot` formatuak guztiak ditu, eta `erd_list_checks` tresnak hiztegiek aurkitzen dituzten akatsak zerrendatzen ditu. Ikus [Dokumentu bat irakurtzea](#reading-a-document).

`erd_set_table_logical_name` eta `erd_set_column_logical_name` tresnek izen fisiko bat eratortzen dute, editoreak izen logiko bat idazten denean egiten duen bezala (ikus [Izen fisikoak eratortzea](../guide/guides/dictionary.md#deriving-physical-names)):

- Izen bat hutsik dagoen edo bera eratorria den bitartean soilik eratortzen da, eta irakurketek hori `nameDerived: true` gisa erakusten dute. Hutsik ez dagoen eta eskuz idatzitako izen bat bere horretan geratzen da, eta izen logikoa bakarrik idazten da. Hauek guztiek eskuz idatzitako izenak idazten dituzte: `erd_change_table_name`, `erd_change_column_name`, SQL, GraphQL, DBML eta AML inportazioak, eta `erd_add_relationship` tresnak izendatzen dituen gako arrotzeko zutabeak. Kate huts batera aldatutako izen bat hurrengo izen logikoak eratortzen du berriro.
- Izena izen logikoa duen terminoak du lehentasuna, hiztegi-izenak bezala alderatuta. Bere izen fisikoa ematen du, edo, halakorik ez duen bitartean, haren hitzek osatzen dutena. Zutabe baterako, terminoaren domeinua ere lotzen du, izenik eratortzen ez denean ere, eta zutabeak domeinuaren datu mota hartzen du, erlazioei jarraituz Erlazioen datu moten sinkronizazioa aktibatuta dagoen bitartean.
- Halako terminorik ez badago, hitzek osatzen dute izena, haien laburdurak azpimarrekin elkartuta: `Member Number` izenak `MBR_NO` ematen du. Dena edo ezer ez: sinonimo batek, hitz debekatu batek, inongo hitzek zerrendatzen ez duen testuak edo laburdurarik gabeko hitz batek ez du ezer osatzen, eta izena zegoen bezala geratzen da. Hitzek ez dute domeinurik lotzen, ezta domeinurik ez duen termino batek ere; beraz, zutabe batek lotuta duen domeinua mantentzen du.
- Bere taulako beste zutabe batek eratorritako izena dagoeneko duen zutabe batek, maiuskulak eta minuskulak bereizi gabe, bere izena, bere `nameDerived` eta bere domeinua mantentzen ditu.
- Izen logiko bat garbitzeak izen fisikoa dagoen bezala uzten du. Izen logikoa eta hark eratortzen duena dagoeneko bere lekuan dituen dei batek ez du ezer aldatzen eta ez du desegite-urratsik sortzen.

`erd_derive_physical_names` tresnak `scope` bat hartzen du: `column`, `tableId` eta `columnId` argumentuekin, zutabe horretarako; `table`, `tableId` argumentuarekin, taularen izenerako eta haren zutabe guztietarako; edo `document`, IDrik gabe, taula guztietarako eta haien zutabeetarako. Behar duen ID bat falta zaion edo hartzen ez duen ID bat ematen zaion `scope` bat ukatu egiten da.
Barne hartutako eta izen logikoa duen izen bakoitza hiztegiei itzultzen zaie, eskuz idatzitako izen bat barne, eta haiek orain ematen dutena hartzen du: termino baten izen fisikoa eta, zutabe baterako, haren domeinua eta mota, edo, bestela, hitzek osatutakoa, zutabearen domeinua dagoen bezala uzten duena. Ezer eratortzen ez duen izen logiko batek izena dagoen bezala uzten du, `nameDerived` orain `true` dela. Izen logikorik gabeko izena dagoen bezala geratzen da, eta gauza bera gertatzen da bere taulako beste zutabe batek izen berria duen zutabe batekin, adibidez taula bererako bigarren gako arrotz batekin; horrek bere `nameDerived` ere mantentzen du. `erd_undo` dei batek dei osoa desegiten du.
Inportatutako eskema baten izenak eskuz idatzitakoak dira; beraz, hiztegietatik izendatzeko, ezarri izen logikoak eta deitu ondoren `erd_derive_physical_names` tresnari. Dei horrek terminoaren beraren izen fisikoa ematen du, eta terminoaren hitzetako aldaketa batek ez du hura berriro osatzen. Beraz, termino baten hitzak aldatu ondoren, eguneratu lehenik terminoa: pasatu haren `name`, `physicalName` huts batekin, hitzek berriro osa dezaten, edo pasatu `physicalName` berria.

Hiztegia fitxa baino lehenagoko ERD Editor bertsio batek fitxategi baten izen logikoak, domeinu-loturak eta hiztegi-errenkadak kentzen ditu fitxategia gordetzean, `4.2.0` baino lehenagoko VS Code luzapenak eta `1.2.0` baino lehenagoko Obsidian eta JetBrains pluginek egiten duten bezala. Horietatik, `4.0.0` edo `4.1.0` bertsioko luzapenak eta `1.0.0` edo `1.1.0` bertsioko pluginek zerbitzariarekin zuzenean editatzen jarraitzen dute, baina ez dituzte erakusten ez mantentzen agente batek idazten dituen izen logikoak, domeinu-loturak eta hiztegi-errenkadak. Ikus [Eguneratzea](./installation.md#updating).

### Ezarpenak {#settings}

Agente batek eskemaren beraren ezarpenak ezartzen ditu: datu-basea, haren izena eta [SQL eskema](../guide/guides/schema-sql.md) fitxako scriptak.
Dokumentuak gordetzen duen beste ezarpen guztiak editorean ezartzea erabiltzaileari dagokio: [Izenen ikuspegia](../guide/guides/logical-names.md#name-view), [View Option](../guide/guides/table-related-functions.md#table-view-options) menuko etengailuak, [Ezarpenak](../guide/guides/settings.md) fitxako aukerak, Kode-sortzailearen lengoaia eta izenen idazkerak, mugatzaile mota eta [blokeoak](../guide/guides/settings.md#lock).
Ez dago horiek aldatzen dituen tresnarik, `replace` moduan egindako inportazioak izan ezik: `erd_import_json` tresnak kargatzen duen dokumentuaren ezarpenak eta blokeoak ekartzen ditu, eta beste lauek ikuspegia oihalaren hasierara itzultzen dute. Ikus [Inportazioa](#import).
Zerbitzariaren `1.0.0` bertsioak kendu zituen horiek ezartzen zituzten tresnak: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` eta `erd_set_show`.

`erd_list` tresnak eta `erd_read` tresnaren `snapshot` formatuak ezarpenak fitxategiak gordetzen dituen bezala jakinarazten dituzte, `lockSettings` eremuan blokeo bakoitzeko marka bat dutela: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase`, `bracketType` eta `unlockNameViewMode`.
Azkena alderantziz irakurtzen da: `false` da `Name View` blokeoa aktibatuta dagoen bitartean, dokumentu berri batean eta blokeo hori existitu aurretik gordetako fitxategi batean dagoen bezala, eta `true` erabiltzaileak blokeoa desaktibatzen duenean.
Blokeatutako lengoaia, izenen idazkera edo mugatzaile mota bere balio blokeatuarekin jakinarazten da, hau da, fitxategiak gordetzen duen eta editore orok irekitzean erabiltzen duen balioarekin, editore baten pantailak edozer erakusten duela ere. Ikuspegia, fitxa eta Izenen ikuspegia ez dira jakinarazten. Agente batek izen logikoak irakurtzen eta idazten ditu, Izenen ikuspegiak erakusten duena edozein dela ere.

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

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` eta `erd_import_aml` tresnek taula, erlazio, indize, ohar eta taula-talde guztiak ordezten dituzte. Dokumentuaren ezarpenak mantentzen dituzte, blokeoak barne, ikuspegia izan ezik, oihalaren hasierara itzultzen baita, % 100ean, eta haren hitzen, terminoen eta domeinuen hiztegiak ere mantentzen dituzte. Ekartzen dituzten taulek ez dute izen logikorik, eta ez dute domeinurik lotzen.
- `erd_import_json` tresnak dokumentu osoa ordezten du, ezarpenak eta hiztegiak barne: JSONaren ezarpenek, blokeoek, hitzek, terminoek eta domeinuek dokumentu honenak ordezten dituzte, eta blokeorik erregistratzen ez duen JSON batek blokeo guztiak aktibatzen ditu eta ikuspegia oihalaren hasieran jartzen du. Ikusle bakoitzak bere Izenen ikuspegia mantentzen du, JSONak `Name View` blokeoa desaktibatuta duenean izan ezik, orduan haren Izenen ikuspegia ekartzen baitu. Dokumentu honen ezarpenak mantentzeko, abiatu `erd_read` tresnaren `json` formatuak ematen duen testutik. Testu huts batek dokumentu berri bat ematen du, `erd_open_document` tresnak `create` argumentuarekin sortzen duenaren antzekoa.

`append` moduak inportazioa dokumentuari gehitzen dio, editorearen [Inportatu eta gehitu](../guide/guides/file-import-export.md#import-and-add) aukerak bezala, eta `erd_undo` dei batek gehikuntza osoa kentzen du:

- Testuak duena entitate berri gisa sartzen da, ID berriekin, bloke batean: dokumentuak duen guztiaren azpian (ezkutuko oharrak eta taula-taldeak barne) eta haren ezkerreko ertzarekin lerrokatuta. Lehendik dauden taula eta ezarpen guztiak geratzen dira, izen bereko taula bat barne: ez da ezer izenaren arabera bateratzen.
- Erlazioak eta indizeak inportazioak ekartzen dituen taulen artean soilik sartzen dira; beraz, testuak deklaratzen ez duen taula baterako gako arrotz bat baztertu egiten da.
- `erd_import_sql`, `erd_import_graphql` eta `erd_import_aml` tresnek taulak gehitzen dituzte beren erlazio eta indizeekin, eta `erd_import_dbml` tresnak bere taula-taldeak ere bai. `erd_import_json` tresnak taulak, erlazioak, indizeak, oharrak eta taula-taldeak gehitzen ditu, inoiz ez bere ezarpenak, eta testu hutsa ukatu egiten du. Haren taulek eta zutabeek beren izen logikoak ekartzen dituzte, baina zutabe batek ere ez du domeinurik lotzen, eta JSONaren hitz, termino edo domeinuetako bat ere ez da sartzen.

JSON dokumentu batek bere antolaketa mantentzen du, taula-taldeak barne: taulak kokatzen dituen lekuan `replace` moduarekin, eta gehitutako blokearen barruan `append` moduarekin.
SQL, GraphQL, DBML eta AML formatuetako taulak errenkadetan antolatzen dira, zutabe gutxien dituztenak lehenik eta talde bakoitzeko taulak elkarrekin, `erd_sort_tables` tresnak kokatzen dituen bezala, eta inoiz ez `Flow` bidez, editorearen beraren inportazioak ahal duenean antolatzen dituen bezala. Lau tresna horiek testu hutsa ukatzen dute bi moduetan.

## erd_batch {#erd_batch}

`erd_batch` tresnak hainbat edizio-tresna exekutatzen ditu ordenan, edizio bakar gisa: denak ala bat ere ez.

- `operations` argumentuak gehienez 100 sarrera ditu, bakoitza `{ tool, as?, args? }` formakoa; `tool` edizio-tresna bat da, eta `args` tresnaren argumentuak dira, `path` gabe. Irakurketa-tresna bat, adibidez `erd_list_checks`, ukatu egiten da.
- Eragiketak lehenik dokumentuaren kopia batean probatzen dira. Ukatutako eragiketa izendatu egiten da, adibidez `operations[1] erd_remove_table: …`, eta ez da ezer aplikatzen.
- `erd_undo` dei batek sorta osoa desegiten du, desegin ezin dituen eragiketak izan ezik, emaitzaren `undoNote` eremuak aipatzen dituenak: desegite-urratsik sortzen ez duen tresna batenak, adibidez `erd_set_database`, eta dokumentua urratsik sortu gabe aldatu dutenak, adibidez `erd_move_table_group` labur bat. Desegite-urratsik batere sortu ez duen sorta `erd_undo` tresnak saltatu egiten du. Emaitzako `historyEntries` eremuak sortaren barruko editorearen historiako sarrerak zenbatzen ditu, ez `erd_undo` deiak.
- Zuzeneko saio batean, editoreak sorta osoa onartzen du edo ezer ere ez.

Agente batek ezin ditu jakin sorta batek sortzen dituen IDak deia egin aurretik; beraz, `as` bidez izendatutako eragiketa bati esker, geroko eragiketa batek haiei erreferentzia egin diezaieke: `$name` edo `$name.0` sortutako lehen IDarentzat, `$name.1` bigarrenarentzat eta `$name.last` azkenarentzat.
Izen batek ASCII letrak, digituak eta azpimarrak ditu, ez da digitu batekin hasten, eta eragiketa bakar bat izendatzen du soilik.
Erreferentzia bat argumentu batek entitate baten IDa hartzen duen lekuetan soilik ebazten da, `wordId`, `termId` eta `domainId` barne; beraz, `$x` dioen izen edo iruzkin bat testu gisa geratzen da.
`domainName` bat ere testua da, baina bere eragiketa exekutatzen den unean irakurtzen da; beraz, sortako aurreko eragiketa batek gehitutako domeinu bat izenda dezake.

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

Hitzak, domeinu bat eta termino bat, eta ondoren haietatik bere izen logikoen bidez izendatutako taula bat:

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

Terminoak `MBR_NO` osatzen du bere hitzetatik, eta taulak `MBR` izena hartzen du. `Member Number` zutabeak terminoaren `MBR_NO` eta haren domeinua hartzen ditu; beraz, `Identifier` domeinuari lotuta dago eta `INT` mota du, eta `Member Name`, inongo terminok ez duena, `MBR_NM` gisa osatzen da.

## Emaitzak {#results}

Edizio batek JSON lerro bakar batekin erantzuten du:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Eremua | Esanahia |
| --- | --- |
| `mode` | `live` edo `headless`. Ikus [Zuzenean eta editorerik gabe](./live-and-headless.md). |
| `saved` | `true` editorerik gabeko edizio, `erd_batch`, `erd_undo` eta `erd_redo` guztien emaitzan: deiak erantzuten duenerako, fitxategiak badu aldaketa; beraz, ez da ezer gordetzeko geratzen. Zuzeneko emaitza batek ez du `saved` eremurik, editoreak baitu aldaketa. Ikus [Gordetzea](./live-and-headless.md#saving). |
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
| `protocolMismatch` | Editorearen ERD Editor luzapenak edo pluginak eta zerbitzariak protokolo-bertsio desberdinak erabiltzen dituzte, adibidez `1.0.0` bertsioko edo berriagoko zerbitzaria `3.x` bertsioko VS Code luzapen batekin. Irakurketak ere ukatzen dira, eta mezuak eguneratu beharreko aldea aipatzen du. Ikus [Eguneratzea](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | Editore baten guneak ez du konexioa onartu, ez du 30 segundoren barruan erantzun, edo deian zehar eten du konexioa. Windows sisteman, `hubUnreachable` kodeak esan nahi du, halaber, Windowsek agentea gunetik kanpo utzi duela: editorea agenteak baino eskubide gehiagorekin exekutatzen da, adibidez editorea administratzaile gisa abiarazi denean eta agentea ez, edo agentea isolamendu-ingurune batean exekutatzen da. |

Beste kode batzuk ez dira hain ohikoak, eta ukapen orok gertatu dena adierazten duen mezu bat du.

Edizio-tresnek, `erd_batch` tresnak eta lau irakurketa-tresnek deklaratzen ez duten argumentu bat edo mota okerreko bat ukatzen dute, JSON-RPC invalid params errore batekin (`-32602`), dokumentua ukitu aurretik; beraz, gaizki idatzitako argumentu bat ez da inoiz isilean baztertzen.
Saioko bost tresnek ez dituzte aintzat hartzen ezagutzen ez dituzten argumentuak.
