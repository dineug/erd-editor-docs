---
sidebar_position: 7
description: Ezabatu erlazio bat, aldatu haren mota, ezarri haren ON DELETE eta ON UPDATE ekintzak, mapatu lehendik dauden zutabeetara Mapatu zutabeak erabiliz, irakurri konektorearen notazioa eta konektoreak taulen inguruan nola bideratzen diren, landu N:M erlazioak eta erlazio identifikatzaileak, eta ikusi gako arrotzen zutabe berriek beren gakotik zer kopiatzen duten eta nola ematen zaien izena.
---

# Erlazioak editatzea

Erlazioak oihalaren laster-menutik, oihaleko tresna-barratik, [Bilaketa azkarra](./quick-search.md#what-the-palette-lists) erabiliz edo lasterbide batekin marrazten dira. Ikus [Editatzen hastea](./editing-start.md).  
Orri honetan azaltzen da erlazio bat sortuta dagoenean zer egin daitekeen harekin, [Mapatu zutabeak](#map-columns) elkarrizketa-koadroak nola amaitzen duen erlazio bat taula umeak lehendik dituen zutabeetan, eta nola ematen zaien izena erlazioak gehitzen dituen gako arrotzen zutabeei.

## Ezabatzea {#deletion}

Erlazioaren laster-menutik ezaba daiteke.

![products taulatik reviews taulara doan erlazioa haren laster-menutik ezabatzea](/img/demo-relationship-remove.webp)

Ez dago horretarako lasterbiderik, erlazio bat ez baita taula bat edo ohar bat bezala hautatzen: hautatutakoa kentzen duten `Delete` eta `Backspace` teklek ez dute inoiz erlazio bat bakarrik kentzen. Ikus [Taulak eta oharrak ezabatzea](./table-related-functions.md#table-and-memo-deletion).  
Erlazioak lotzen dutenarekin batera ere kentzen dira: taula bat ezabatzeak hura ukitzen duten erlazio guztiak kentzen ditu, eta zutabe bat ezabatzeak hura erabiltzen duten erlazio guztiak kentzen ditu.

## Mota aldatzea {#type-change}

Erlazioaren laster-menuko `Relationship Type` aukeraren bidez alda daiteke.  
Lau mota eskaintzen dira, eta unekoak egiaztapen-marka bat du:

- Zero One
- Zero N
- One Only
- One N

![Erlazio bat Zero N motatik One Only motara eta ondoren One N motara aldatzea haren laster-menuan](/img/demo-relationship-type.webp)

Erlazio bat hasteko erabiltzen diren lau mota berberak dira, bakoitza bere lasterbidearekin. Ikus [Editatzen hastea](./editing-start.md).

## ON DELETE eta ON UPDATE {#on-delete-and-on-update}

Erlazioaren laster-menuko `On Delete` eta `On Update` aukeren bidez ezartzen dira; `Relationship Type` eta `Map Columns` aukeren artean daude.  
Bakoitzak sei aukera berberak eskaintzen ditu, eta unekoak egiaztapen-marka bat du:

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

`Not set` aukerak ez du klausularik idazten; beraz, datu-basearen beraren balio lehenetsia aplikatzen da. Erlazio berri bat, marraztua edo [Mapatu zutabeak](#map-columns) elkarrizketa-koadroan sortua, biak `Not set` balioan dituela hasten da, eta geroago `Not set` aukeratzeak ekintza bat kentzen du.  
Biak independenteak dira: bat aldatzeak bestea dagoen bezala uzten du.  
Konektoreak ezarritakoa erakusten du. Ikus [Konektore bat irakurtzea](#reading-a-connector).  
Bere taulekin batera kopiatu eta itsatsi edo bikoiztu den erlazio batek bi ekintzak gordetzen ditu, eta SQL eskema, DBML edo AML inportatzean fitxategiak adierazten dituen ekintzak ekartzen dira. Ikus [Fitxategiak inportatzea edo esportatzea](./file-import-export.md).

![orders taulatik order_items taulara doan erlazioan ON DELETE CASCADE eta ON UPDATE RESTRICT ezartzea haren laster-menutik, etiketak D:C U:R dioela, eta ondoren gainetik pasatzea biak berriro irakurtzeko](/img/demo-referential-actions.webp)

Ekintza guztiak aukera daitezke, datu-basea edozein dela ere.  
Hautatutako [datu-baseak](./table-related-functions.md#databases) bere SQL eskematik kanpo uzten duen ekintza batek azalpen lausotu bat du ondoan, adibidez `not in MySQL`. `Not set` aukerak ez du inoiz azalpenik, eta datu-basea aldatzean azalpenak eguneratu egiten dira.  
Azalpena duen ekintza erlazioan gordeta geratzen da hala ere: konektoreak erakusten du, eta JSON, DBML eta AML formatuek gordetzen dute, baina datu-base horren SQL eskemak klausula kanpo uzten du; beraz, datu-basearen balio lehenetsia aplikatzen da.

[SQL eskema](./schema-sql.md) fitxak ekintza hauek idazten ditu eta gainerakoak kanpo uzten ditu:

| Datu-basea | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | bat ere ez |
| PostgreSQL | bostak | bostak |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | bostak | bostak |

Snowflake datu-basearen SQL eskemak, gainera, kanpo uzten duen ekintza bakoitza aipatzen duen iruzkin bat idazten du. Ikus [Erreferentzia-ekintzak](./schema-sql.md#referential-actions).

Kode-sortzailearen ORM helburuek zer ekintza idazten dituzten helburuaren eta hautatutako datu-basearen araberakoa da. Ikus [Kode-sortzailea](./code-generator.md#on-delete-and-on-update).

## Mapatu zutabeak {#map-columns}

Mapatu zutabeak elkarrizketa-koadroak taula gurasoaren gakoa taula umearen zutabeekin parekatzen du, errenkada bat gakoaren zutabe bakoitzeko.  
Errenkada bakoitzak taula umeak lehendik duen zutabe bat erabiltzen du edo gako arrotzaren zutabe berri bat gehitzen du; beraz, erlazio bat lehendik dauden zutabeetan amai daiteke.

![members taulatik orders taulara Zero N erlazio bat marraztea, Map to existing columns aukeratzea eta id lehendik dagoen member_id zutabera mapatzea](/img/demo-map-columns.webp)

Bi modutara irekitzen da:

- Erlazio bat marraztean, taula umearen ondoko `Map to existing columns` aukeratik. Ikus [Erlazioak sortzea](./editing-start.md#relationship-creation). Orduan, `Map` botoiak marrazten ari den motako erlazio bat gehitzen du.
- Erlazioaren laster-menuko `Map Columns` aukeratik, lehendik dagoen erlazio baten zutabeak aldatzeko. Orduan, `Save` botoiak aldaketa idazten du. Irakurtzeko soilik dagoen editore batek ez du erlazioaren laster-menurik irekitzen; beraz, Mapatu zutabeak ezin da hor ireki.

Elkarrizketa-koadroaren azpitituluak bi taulak eta erlazio mota aipatzen ditu, adibidez `users → posts · One N`. Mota hemen erakusten da, baina ez da aldatzen. Erabili [Mota aldatzea](#type-change).

Elkarrizketa-koadro osoan, errenkaden azpiko azalpenak eta lerroak eta ixtean erakusten duen jakinarazpena barne, taulak eta zutabeak [Izenen ikuspegiak](./logical-names.md#beyond-the-canvas) izendatzen dituen bezala izendatzen dira.  
Hiru gauza beti dira fisikoak: datu mota bakoitza, zutabearena bera dena eta inoiz ez haren domeinuaren izena; `New column: <name>`, zutabe berriak izango duen izena erakusten duena; eta `Map` botoiak beteta hasten dituen errenkadak, izenaren arabera parekatzen dituenak, inoiz ez izen logikoaren arabera.

`References` hautatzaileak erlazioak seinalatzen duen gakoa aukeratzen du: `Primary Key`, bere zutabeak taulako ordenan dituela, eta ondoren `Unique: <column>`, `Unique` gisa markatutako zutabe bakoitzeko. Aukera bat baino gehiago dagoenean bakarrik agertzen da.  
Indize bakar bat ez da gakotzat hartzen hemen, eta gako nagusi osoa den `Unique` zutabe bat ez da bi aldiz zerrendatzen.  
Beste gako bat aukeratzean, errenkadak berreraikitzen dira. Errenkada batek aukeratutako zutabea gordetzen du, zutabe hori oraindik taula umean dagoen bitartean.

`Referenced column` eta `Foreign key column` goiburuen azpian, errenkada bakoitzak gakoaren zutabe bat erakusten du bere datu motarekin, eta harekin parekatzeko taula umearen zutabeen zerrenda bat:

- `Pick a column` aukerak errenkada hutsik uzten du.
- `New column: <name>` aukerak gako arrotzaren zutabe berri bat gehitzen du. Erakusten den izena zutabeak izango duena da, [Gako arrotzen zutabeen izenak](#foreign-key-column-names) atalean azaltzen den bezala, taula umearen zutabeak eta zutabe berri bat gehitzen duten beste errenkadak kontuan hartuta zenbakituta. Ez da eskaintzen izena hutsik geratuko litzatekeenean, izenik gabeko gako batekin gertatzen den bezala.
- Taula umearen zutabe guztiak, `<name> (<data type>)` formatuan. Beste errenkada batek aukeratutako zutabe batek `<name> (<data type>) · in use` dio eta ezin da aukeratu; beraz, bi errenkadek ez dute zutabe bera partekatzen. Beste erlazio batek dagoeneko erabiltzen duen zutabe bat aukera daiteke hala ere; beraz, partekatutako `tenant_id` bezalako zutabe bat hainbat erlaziotan erabil daiteke.

`Map` botoiarekin, errenkada bat beteta hasten da soilik taula umearen zutabe bakar batek zehazki, maiuskulak eta minuskulak bereizi gabe, errenkada horretarako gako arrotzaren zutabe berri batek `_2` bezalako edozein zenbakitze baino lehen izango lukeen izena duenean; adibidez, `users_id`, `users` taulako `id` gakoarentzat, eta `member_id`, `member_id` gakoarentzat. [`Bracket`](./schema-sql.md#database-and-bracket) aukera lehenetsitako `None` balioan dagoen bitartean, eskemaz kualifikatutako taula-izen baten taula-zatitik eraikitako izenak ere balio du; beraz, `public.users` taulako `id` gakoa `public.users_id` edo `users_id` zutabearekin parekatzen da. `Unique` gako baterako, gakoaren zutabearen beraren izenak ere balio du; beraz, `vin` gakoa `vin` zutabearekin parekatzen da. Gainerako errenkada guztiak `Pick a column` aukeran hasten dira.  
`Save` botoiarekin, errenkada bakoitza erlazioak orain erabiltzen duen zutabean hasten da. Bietan, `References` hautatzailean beste gako bat aukeratzean, gako horren errenkada hutsak izen berberen arabera betetzen dira.

Aukeratutako zutabe baten datu mota zutabe gurasoak gako arrotz bati ematen dionaren desberdina denean, errenkadaren azpiko azalpen batek hala dio.  
[Erlazioen datu moten sinkronizazioa](./settings.md#relationship-datatype-sync) aktibatuta dagoenean eta zutabe gurasoak datu mota bat duenean, `<column> becomes <type>` dio, mapaketak idatziko duen mota adieraziz. Bestela, `Types differ: <parent type> and <child type>` dio, eta zutabeak bere mota gordetzen du.

`Map` edo `Save` botoia desgaituta geratzen da zerbaitek eragozten duen bitartean, eta errenkaden azpiko lerro batek zerk eragozten duen adierazten du:

- `Pick a foreign key column for every referenced column`: errenkada bat hutsik dago oraindik.
- `At least one column must reference a different column`: errenkada bakoitzak bere zutabe gurasoa bera aukeratzen duen auto-erreferentziazko erlazio bat.
- `These columns are already linked by another relationship`: bi taula berberen arteko beste erlazio batek zutabe hauexek lotzen ditu.
- `<parent> has no key to reference`: `Map` botoiarekin, taula gurasoak ez du ez gako nagusirik ez `Unique` zutaberik.

`Save` botoia desgaituta geratzen da, halaber, mapaketa erlazioaren uneko mapaketaren desberdina izan arte.  
`Save` botoiarekin, errenkada batek `(removed)` dio bere zutabea jada bere taulan ez dagoenean. Aukeratu taula umearen beste zutabe bat, edo, desagertu den zutabe guraso baterako, aukeratu gako bat `References` hautatzailean. `Map` botoiarekin, aukeratutako zutabea kentzen zaion errenkada `Pick a column` aukerara itzultzen da.

Zutabe gurasoak zehazki taula gurasoaren gakoetako bat ez dituen erlazio bat `References` hautatzailearen amaierako aukera gehigarri batean irekitzen da, `Current columns (not a key)` aukeran, zutabe horiek dauden bezala gordetzen dituena. Taula gurasoak gakorik batere ez duenean, hori da aukera bakarra eta `References` ez da erakusten.  
Kasu horretan, `The referenced columns are not a key of <parent>` lerroa, edo `<parent> has no key to reference` taula gurasoak gakorik batere ez duenean, abisu bat da, ez errore bat: `Save` botoiak funtzionatzen du oraindik; beraz, taula umearen zutabeak alda ditzakezu eta erreferentzia gorde.  
Bere bi zutabe-zerrendak parekatu ezin diren erlazio batek, adibidez luzera desberdina dutelako, `(invalid)` errenkadak erakusten ditu eta `Save` botoia desgaituta mantentzen du `References` hautatzailean gako bat aukeratu arte, edo, taula gurasoak gakorik ez badu, hari gako nagusi bat edo `Unique` zutabe bat gehitu arte.

Elkarrizketa-koadroak diagramari jarraitzen dio irekita dagoen bitartean, lankide baten edo kodetze-agente baten edizioak barne, eta aukeratu duzuna gordetzen du.  
Bitartean erlazioaren zutabeak edo elkarrizketa-koadroa irekitzean hautatuta zegoen gakoa aldatzen badira, `This relationship changed while the dialog was open` lerroa gehitzen du.

`Map` eta `Save` botoiek idazten dutena:

- `Map` botoiak erlazioa gehitzen du, `On Delete` eta `On Update` `Not set` balioan dituela. `Save` botoiak erlazioaren zutabeak soilik aldatzen ditu, gurasoaren aldea `References` hautatzailean aukeratutako gakora zuzenduz, eta haren mota eta haren ON DELETE eta ON UPDATE gordetzen ditu.
- `New column` errenkada batek zutabe bat gehitzen du taula umearen amaieran, marrazteak egiten duen bezala: `NOT NULL`, bere gakoaren araberako izenarekin, eta gakoaren datu mota, balio lehenetsia, iruzkina, izen logikoa eta domeinua dituela. Ikus [Erlazio identifikatzaileak](#identifying-relationships).
- Aukeratutako zutabe bati ez zaio inoiz izena aldatzen, ezta gakoaren domeinuari lotzen ere, eta haren `Not Null`, gako nagusia, `Unique`, balio lehenetsia, iruzkina eta izen logikoa dauden bezala geratzen dira. Haren datu mota `Relationship DataType Sync` aktibatuta dagoen bitartean eta zutabe gurasoak datu mota bat duenean bakarrik aldatzen da: zutabe gurasoak gako arrotz bati ematen dion mota hartzen du (serial motako gako baterako, zenbaki osoko mota, zutabe berri batean bezala), eta aldaketa erlazioetan zehar hedatzen da, sinkronizazioak egiten duen bezala. Aldaketak mota aldatzen dien zutabe guztiei, aukeratutakoei zein erlazioetan zehar iritsitakoei, beren [domeinuarekiko](./dictionary.md#domains-and-data-types) lotura kentzen zaie, mota berria domeinuarenaren desberdina denean.
- Mapaketak erabiltzeari uzten dion zutabea taula umean geratzen da, eta jada ez da gako arrotz gisa markatzen, beste erlazio bat oraindik hartan amaitzen ez bada behintzat.
- `Map` edo `Save` sakatze batek idazten duen guztia, zutabe berriak, mota-aldaketak eta domeinu-loturen kentzeak barne, desegite-urrats bat da.

Erlazioa identifikatzailea den ala ez, eta haren gurasoaren muturra nola marrazten den, mapatutako taula umearen zutabeetatik ondorioztatzen da, beste edozein erlaziotan bezala. Taula umearen gako nagusiko zutabeetara mapatzeak berehala bihurtzen du identifikatzaile, eta `NULL` onartzen duen zutabe batera mapatzeak eraztun bat jartzen du gurasoaren muturrean. Ikus [Konektore bat irakurtzea](#reading-a-connector).  
SQL eskemako gako arrotzak aukeratu duzun gakoari egiten dio erreferentzia, adibidez `REFERENCES vehicle (vin)` `Unique` gako baterako.

`Map` edo `Save` sakatzen duzunean diagramak dagoeneko mapaketa hori badu, lankide bat edo kodetze-agente bat aurretik iritsi delako, ez da ezer idazten.  
Mapaketa jada egokitzen ez den moduan aldatu bada, ez da ezer idazten eta jakinarazpen batek `Couldn't map columns: the diagram changed` dio.

`Cancel` botoiak, `x` botoiak, `Escape` teklak edo elkarrizketa-koadroaren kanpoko eremu lausotuan klik egiteak ixten du, ezer idatzi gabe.  
Eremu lausotuak editore osoa estaltzen du, tresna-barra barne, eta irekita dagoen [Arakatzailea](./explorer.md#dialogs-beside-it) irekita geratzen da haren azpian.  
Bilaketa azkarra irekitzeak ere ixten du elkarrizketa-koadroa, eta baita ERD fitxatik irteteak edo editorea irakurtzeko soilik bihurtzeak ere.  
`Ctrl + F` (Windows/Linux) edo `⌘ + F` (Mac) lasterbideak ere ixten du, eta testu-kurtsorea Arakatzailearen [bilaketako](./find-and-replace.md#opening-and-closing) Bilatu eremuan jartzen du, Arakatzailea irekiz itxita badago. Arakatzailea erakusteko estuegia den editore batean, elkarrizketa-koadroa ixten du hala ere, baina jakinarazpen bat erakusten du testu-kurtsorea mugitu beharrean. Ikus [Irekitzea eta ixtea](./explorer.md#opening-and-closing).  
Irekita dagoen bitartean bere tauletako bat edo erlazioa kentzen bada, jakinarazpen batekin ixten da, adibidez `Map Columns closed: the relationship was removed`.  
Irekita dagoen bitartean, oihalaren lasterbideek, desegiteak eta berregiteak, eta kopiatzeak eta itsasteak ez dute ezer egiten.

Kodetze-agente batek ez du Mapatu zutabeak tresnarik. Erlazio bat berriro mapatzeko, gako arrotzen zutabeak gordetzen dituen `erd_remove_relationship` tresnarekin kentzen du, eta lehendik dauden zutabeetan berriro marrazten du `erd_link_columns` tresnarekin, biak `erd_batch` dei bakar batean. Ikus [Tresnak](../../mcp/tools.md#relationships).

## N:M erlazioak {#nm-relationships}

Editorea eredu fisikoan oinarritzen denez, N:M erlazio bat lotura-taula batekin adierazten da, behean erakusten den bezala.

![products taulatik eta ondoren tags taulatik product_tags taula hutsera erlazioak marraztea ⌘ + ⌥ + 2 lasterbidearekin, product_id eta ondoren tag_id gehituz](/img/demo-relationship-n-m.webp)

Lotura-taulak bere gako-zutabeak dagoeneko dituenean, adibidez `product_tags` taulako `product_id` eta `tag_id`, marraztu erlazio bakoitza `Map to existing columns` aukerarekin eta aukeratu zutabe horiek zutabe berriak gehitu beharrean. Ikus [Mapatu zutabeak](#map-columns). Lotura-taularen gako nagusia badira, erlazio bakoitza berehala da identifikatzailea.

GraphQL, DBML edo AML inportatzeak lotura-taula zure partez eraikitzen du.  
Askotik askorako adierazpen bat `<left>_<right>` izeneko taula gisa iristen da, `Junction table inferred from <left> <-> <right>` iruzkinarekin, eta bi aldeekin erlazio identifikatzaileen bidez lotuta.  
Ikus [Fitxategiak inportatzea edo esportatzea](./file-import-export.md).

## Erlazio identifikatzaileak {#identifying-relationships}

Erlazio bat taula umean klik eginez edo `Create new columns` aukerarekin marrazteak taula gurasoaren gako nagusi bakoitza taula umera kopiatzen du `NOT NULL` gako arrotzaren zutabe gisa; beraz, erlazio berri bat ez-identifikatzaile gisa hasten da.  
Kopiak gakoaren datu mota, balio lehenetsia, iruzkina eta izen logikoa hartzen ditu, baina ez `Unique` edo `Auto Increment`, eta [Gako arrotzen zutabeen izenak](#foreign-key-column-names) atalean azaltzen den bezala ematen zaio izena.  
Serial motako gakoa da datu motaren salbuespena: haren kopiak serial motak gordetzen duen zenbaki osoko mota hartzen du. Edozein datu-basetan, `smallserial` eta `serial2` motek `smallint` ematen dute, `serial4` motak `integer`, eta `bigserial` eta `serial8` motek `bigint`. `serial` mota soilak `integer` ematen du PostgreSQL datu-basean eta `bigint unsigned` MySQL eta MariaDB datu-baseetan, eta `serial` gisa geratzen da beste edozein datu-basetan.  
Mota-izen osoak bakarrik balio du, maiuskulak eta minuskulak bereizi gabe; beraz, `serial(4)` idatzita dagoen bezala kopiatzen da. Maiuskulaz idatzitako mota batek maiuskulak ematen ditu: `SERIAL` motak `INTEGER` ematen du PostgreSQL datu-basean. Gordetako diagrama batean dagoeneko `serial` mota duen gako arrotzaren zutabe batek mota hori gordetzen du.  
Kopia gakoaren [domeinuari](./dictionary.md#domains-and-data-types) ere lotzen zaio, baldin eta `Domains` orriak domeinu hori zerrendatzen badu kopia egiten denean eta kopiak gakoaren datu mota mantentzen badu. Beraz, zenbaki osoko mota hartzen duen serial motako gako baten kopiak ez du domeinurik lotzen; `serial` gisa mantentzen den `serial` mota soil batek, berriz, lotu egiten du.  
Erlazioa identifikatzaile bihurtzeko, ezarri taula umeko gako arrotzen zutabe horiek gako nagusi gisa: hautatu guztiak eta sakatu `Alt + K` (Windows/Linux) edo `⌥ + K` (Mac) behin, edo aukeratu `Primary Key` taularen laster-menuan; aukera horrek `Primary Key on selected columns` dio bi zutabe edo gehiago hautatuta daudenean. Ikus [Zutabearen gako nagusia](./table-editing.md#column-primary-key).

![product_id gako nagusi gisa aktibatzea eta desaktibatzea Alt + K lasterbidearekin, haren konektorea jarraitua eta ondoren etena bihurtuz](/img/demo-identifying-relationship.webp)

Editoreak berez mantentzen du hori sinkronizatuta.  
Erlazio bat identifikatzailea da umearen aldeko zutabe guztiak gako nagusiak diren bitartean, eta ez-identifikatzaile bihurtzen da horietako bat gako nagusia ez den unean bertan.

## Gako arrotzen zutabeen izenak {#foreign-key-column-names}

Erlazio bat marraztean, gehitzen duen gako arrotzaren zutabe bakoitzari zutabe horrek kopiatzen duen gako gurasoaren araberako izena ematen zaio:

- Hitz bakarreko gako-izen batek, adibidez `id`, `ID` edo `uuid`, taula gurasoaren izena eta azpimarra bat hartzen ditu aurrean: `products` taulako `id` gakoa `products_id` bihurtzen da.
- Hainbat hitzeko gako-izen bat, adibidez `member_id`, `userId` edo `UserID`, dagoen bezala gordetzen da.
- Hitz bakarreko gako-izen bat taularen beraren izena denean, maiuskulak eta minuskulak bereizi gabe, hura ere dagoen bezala gordetzen da: `currency` taulako `currency` gakoa `currency` gisa geratzen da. Taularen izena besterik gabe barnean duen gako batek aurrizkia hartzen du hala ere: `user` taulako `username` gakoa `user_username` bihurtzen da.

Izen bat hitz bakarra da letrak eta digituak soilik dituenean, maiuskula-minuskula aldaketarik gabe.  
Beste edozein karakterek zatitzen du; beraz, `_id`, `order no` eta `order-no` hainbat hitz dira.  
Baita maiuskula-minuskula aldaketa batek ere, camelCase irakurtzen den moduan irakurrita: minuskula bat eta ondoren maiuskula bat (`userId`), bi maiuskula eta ondoren minuskula bat (`IDCard`, `IDs`), edo maiuskula-minuskularik gabeko idazketa-sistema bateko letra bat, adibidez hangula, kana edo txinatar karaktereak, maiuskula-minuskulak dituen letra baten ondoan (`회원ID`).  
Digituek ez dute hitza zatitzen; beraz, `id2` eta `SHA256` hitz bakarra dira. Maiuskulaz edo minuskulaz soilik idatzitako hitz konposatu bat ere hitz bakarra da: `members` taulako `memberid` gakoa `members_memberid` bihurtzen da.

Taularen izena idatzita dagoen bezala erabiltzen da, inguruko zuriuneak izan ezik: maiuskulak eta minuskulak, barneko zuriuneak eta puntuak gordetzen dira, ez da singular bihurtzen, eta Kode-sortzailearen `Table Name Case` eta `Column Name Case` aukerek ez dute eraginik. `ID` gakoa duen `Users` taulak `Users_ID` ematen du.  
Gako konposatu bateko zutabe bakoitzari bere aldetik ematen zaio izena: (`tenant_id`, `id`) gakoa duen `orders` taulak `tenant_id` eta `orders_id` gehitzen ditu.

Taula umeak dagoeneko duen izen bat, maiuskulak eta minuskulak bereizi gabe, `_2`, `_3` eta abarrekin zenbakitzen da, libre dagoen lehen zenbakia hartuz.  
`users` taulatik taula berera doan bigarren erlazio batek, `id` gakoarekin, `users_id_2` gehitzen du, eta `members` taulako auto-erreferentzia batek, `member_id` gakoarekin, `member_id_2` gehitzen du.  
Gako konposatu bateko zutabeak elkarren artean modu berean zenbakitzen dira, eta dagoen bezala gordetzen den izen batek hartzen du lehenik bere lekua: (`id`, `user_id`) gakoa duen `user` taulak `user_id` gehitzen du `user_id` gakorako eta `user_id_2` `id` gakorako.

Izenik gabeko taula guraso batek gako-izena dagoen bezala uzten du, eta talka egiten badu beste edozein bezala zenbakitzen da.  
Izenik gabeko gako batek izenik gabeko gako arrotzaren zutabe bat ematen du.  
Horren barruan dago editoreak gako nagusirik ez duen taula guraso bati gehitzen dion gako nagusia, taula umean klik egin aurretik izena ematen ez badiozu behintzat.

Izenak erlazioa marrazten denean ezartzen dira. Geroago taula gurasoaren edo haren gakoaren izena aldatzeak ez du haien izena aldatzen.  
[Mapatu zutabeak](#map-columns) elkarrizketa-koadroko `New column` errenkadei arau berberen arabera ematen zaie izena, eta zerrendak izen bakoitza erakusten du hura aukeratu aurretik.  
Zutabeak dagoeneko lekuan dituztela iristen diren erlazioek, inportazio, itsaste edo bikoizte batetik edo lehendik dauden zutabeak parekatzen dituen Mapatu zutabeak elkarrizketa-koadrotik, zutabe horiek dituzten izenak gordetzen dituzte.  
`erd_add_relationship` tresnarekin erlazio bat gehitzen duen kodetze-agente batek izen, datu mota, izen logiko eta domeinu berberak lortzen ditu. Ikus [Tresnak](../../mcp/tools.md#relationships).

Gako arrotzaren zutabe bati bere gakoaren arabera ematen zaio izena, inoiz ez kopiatzen duen izen logikoaren arabera, eta haren izena zuk idatzitakotzat hartzen da: geroago zutabean idatzitako izen logiko batek izena dagoen bezala uzten du, izena hutsik ez badago behintzat. Ikus [Zuk idatzitako izenak](./dictionary.md#names-of-your-own).  
Kopiatutako izen logikoa beste izen bat ematen duen termino batekin bat datorren bitartean, `Checks` orriak, beraz, zutabea [`Physical name mismatch`](./dictionary.md#what-each-check-finds) egiaztapenean zerrendatzen du. Haren izen fisikoa berriro eratortzeak hiztegien arabera aldatzen dio izena, taula umeko beste zutabe batek hiztegiek ematen duten izena dagoeneko ez badu behintzat, maiuskulak eta minuskulak bereizi gabe. Ikus [Izen fisikoak berriro eratortzea](./dictionary.md#derive-physical-names-again).

## Konektore bat irakurtzea {#reading-a-connector}

- Erlazio identifikatzaile bat marra jarraitu gisa marrazten da, eta ez-identifikatzaile bat marra eten gisa.
- Umearen muturrak erlazio motaren kardinalitate-ikurra du: eraztun bat eta barra bat Zero One motarako, eraztun bat eta bele-hanka bat Zero N motarako, bi barra One Only motarako, eta barra bat eta bele-hanka bat One N motarako.
- Gurasoaren muturra eraztun bat eta barra bat da, Zero One bezala, gako arrotzen zutabeetako edozeinek `NULL` onartzen duenean, eta bi barra, One Only bezala, guztiak `NOT NULL` direnean.
- Konektore baten gainetik sagua pasatzean, konektorea nabarmentzen da bi tauletan lotzen dituen zutabeekin batera.

![Hiru konektoreren gainetik txandaka pasatzea, bakoitza lotzen dituen zutabeekin batera argiztatzen dela](/img/demo-relationship-hover.webp)

[ON DELETE edo ON UPDATE](#on-delete-and-on-update) ezartzen duen erlazio batek etiketa bat du umearen muturraren ondoan, adibidez `D:C U:R`: `D:` eta ON DELETE ekintza, ondoren `U:` eta ON UPDATE ekintza, bakoitza ezarrita dagoenean bakarrik.  
Ekintzak erwin notazioaren arabera laburtzen dira: `C` CASCADE ekintzarako, `R` RESTRICT ekintzarako, `SN` SET NULL ekintzarako, `SD` SET DEFAULT ekintzarako eta `NA` NO ACTION ekintzarako. Bietako bat ere ezartzen ez duen erlazio batek ez du etiketarik.  
Etiketa taula umearen kontrako aldean kokatzen da: marraren gainean, konektorea taula horren ezkerreko edo eskuineko aldetik irteten denean, eta marraren eskuinean, goiko edo beheko aldetik irteten denean, kardinalitate-ikurra estali gabe.  
Konektorearen kolorean marrazten da, oihalaren atzeko planoaren koloreko lauki txiki baten gainean, eta bere konektorearekin batera argiztatzen da. Etiketak konektore guztien gainean marrazten dira; beraz, etiketa bat zeharkatzen duen marra haren azpitik igarotzen da.  
Erlazioan gordetako ekintza erakusten du, hautatutako datu-baseak idazten duena edozein dela ere; beraz, ON DELETE SET DEFAULT ekintzak `D:SD` dio MySQL datu-basean ere.

Ekintzetako edozein ezartzen duen konektore baten gainetik sagua pasatzean, klausulak osorik idazten dituen argibide bat ere erakusten da, bat lerro bakoitzeko, adibidez `ON DELETE CASCADE` eta `ON UPDATE RESTRICT`.  
Argibidea etiketa ezkutatuta dagoenean ere agertzen da.

Erlazio batera joateak argiztatu egiten du: [Arakatzailean](./explorer.md#going-to-a-row) taula baten `Foreign Keys` karpetaren azpiko errenkada bat aukeratzeak, edo [Diferentzia-ikustailean](./table-related-functions.md#going-to-a-change) gako arrotz baten errenkada bat aukeratzeak, haren konektorea eta etiketa gainetik pasatzeko kolorean marrazten ditu. Diferentzia-ikustailean, erlazioa duen alde bakoitzeko konektorea argiztatzen du; beraz, gehitutako gako arrotz batek uneko aldea soilik argiztatzen du, eta kendutako batek gordetako aldea soilik.  
Jauziak taula umea bakarrik hautatzen du, bere gako arrotzen zutabeekin, eta fokuratutako gelaxka horietako lehenengoan dago; erlazioa bera, hala ere, ez da inoiz hautatzen. Ikuspegia nora joaten den jakiteko, ikus [Jauziaren helmuga](./table-related-functions.md#where-a-jump-lands).  
Argia oihalean saguaren ezkerreko edo eskuineko botoiaren hurrengo sakatzean itzaltzen da, leku huts batean, taula batean, ohar batean, taula-talde batean edo konektore batean izan, baita hautapena zegoen bezala uzten duen sakatze bat ere. Arakatzailean beste errenkada batera edo bilaketaren beste bat-etortze batera joateak ere itzaltzen du, eta baita Diferentzia-ikustailean beste errenkada batera joateak ere, errenkada hori doan alde bakoitzean.  
Erdiko botoiarekin edo esku-tresnarekin ikuspegia mugitzeak argiztatuta uzten du, eta baita Arakatzailean edo Diferentzia-ikustailean errenkada bat tolestu edo zabaltzeak, hautapena `Escape` teklarekin garbitzeak, eta [Bilaketa azkarra](./quick-search.md) edo Fluxuko kanpo-estekako [txartelaren botoia](./visualization.md#card-buttons) erabiliz egindako jauzi batek ere.  
Argia ez da gordetzen eta ez dago desegite-historian, eta lankideek ez dute ikusten.

[`readonly`](../../api/erd-editor-element.md#readonly) atributua duen editore batean, erakusleak ere konektoreak pizten ditu, jauzi batek utzitako argiaren ordez. Taula baten gainean geldi egonda, taula horren konektore guztiak pizten ditu hover kolorean, erakuslea taulatik atera arte.  
Mugitzen ez den klik batek argi bat piztuta uzten du hurrengo horrelako klik arte: taula batean, taula horren konektoreak pizten ditu; konektore batean, konektore hori; eta beste edonon, ezer ez. Bertan arrastatzeak oihala mugitzen du eta argi hori dagoen bezala uzten du.

Ezkutatu ERD oihaleko konektoreak `Relationship` ikuspegi-aukerarekin, edo haien etiketak soilik `Referential Actions` ikuspegi-aukerarekin, lehenespenez aktibatuta dagoena. Ikus [Taulen ikuspegi-aukerak](./table-related-functions.md#table-view-options).  
Etiketak ez dira marrazten `70%` edo gutxiagoko zoomean, taulak beren izenera murrizten diren mailan.  
[Irudi-esportazio bat](./file-import-export.md#image) beti % 100ean marrazten da; beraz, etiketak marrazten ditu oihalaren zooma edozein dela ere, ikuspegi-aukera batek ezkutatzen ez baditu behintzat. `Background` desaktibatuta dagoenean, etiketa bakoitzaren atzeko laukia ere gardena da.  
Bisualizazioa fitxako [Fluxu modua](./visualization.md#flow-mode) erabiliz, konektoreak marrazten dira `Relationship` desaktibatuta egonda ere, bakoitza kurba gris jarraitu leun bakar gisa, mutur-marka berberekin; beraz, marra etena, etiketak, argibidea, jauzi baten ondorengo argia eta orri honetan azaldutako bideratze ortogonala ERD oihalean soilik aplikatzen dira. Taula batetik bere buruarako erlazio bat goiko eskuineko izkinaren inguruan kurbatzen da Fluxuan ere. Ikus [Konektoreen bideratzea](#connector-routing).

## Konektoreen bideratzea {#connector-routing}

Konektoreak ortogonalki bideratzen dira, eta haien izkinak biribilduak dira.  
Ibilbide batek bere bideko taulak inguratzen ditu, haietatik igaro beharrean. Bere bi muturren artean bihurgune gutxi dituen ibilbide guztiek taula bat zeharkatuko luketen lekuan, diagrama pilatu batean bezala, konektoreak behar dituen bihurgune guztiak dituen inguruko bidea hartzen du. Inguruko biderik aurkitzen ez den lekuan bakarrik zeharkatzen du oraindik taula bat.  
Konektore batek bere bi taulak elkarren aurrez aurre dauden alde-pare batetik uzten ditu halakorik dagoen guztietan, eta mutur bakoitza bere taulatik tarte zuzen labur batean irteten da biratu aurretik; beraz, elkarrengandik gertu dauden eta konektorearen muturrak lerrokatuta dituzten bi taula marra zuzen bakar batez lotzen dira, inguru bat egin beharrean.  
Elkarren aurrez aurre dauden bi taula hori baino hurbilago egonda, `40px` baino gutxiagora ere, aurrez aurreko aldeak mantentzen dira, eta haien muturrak lerrokatuta ez daudenean konektoreak haien arteko tartea zeharka gurutzatzen du, bietako baten azpitik joan beharrean.  
Taula baten alde beretik irteten diren ibilbideak korridore bereizietan banatzen dira, bata bestearen gainetik joan ez daitezen.  
Taulak soilik saihesten dira: konektore batek ohar bat edo taula-talde baten koadroa zeharka dezake, eta taula-taldeen gainean eta taulen eta oharren azpian marrazten da.

Taula batetik bere buruarako erlazio bat taularen goiko eskuineko izkinaren inguruko kurba bakar gisa marrazten da: goiko aldetik irteten da gurasoaren muturrean, eta eskuineko aldetik sartzen da umearen muturrean.  
Taula bereko auto-erreferentzia gehiago lehenengoaren kanpoaldean habiaratzen dira; beraz, haien kurbek ez dute elkar zeharkatzen, ezta taula ere.

Ez dago ezer konfiguratu beharrik.  
Ibilbideak automatikoki birkalkulatzen dira oihaleko edozer mugitzen den edo tamainaz aldatzen den bakoitzean; beraz, ez dira inoiz eskuz ukitu behar.  
Arrastatzen ari zaren bitartean, mugitzen dituzun taulen konektoreek haiei jarraitzen diete, eta gainerako konektore guztiek arrastatzea hasi zenean zuten ibilbidea mantentzen dute. Askatzen duzunean, mugimenduak berriro bideratzen duen konektore bakoitza berriro marrazten da, adibidez bidean jarritako taula baten inguruan orain doan bat, edo taula bat bere bidetik atera ondoren zuzentzen den bat.

Diagrama batek ibilbide berberak marrazten ditu Izenen ikuspegi berean erakusten duen leiho guztietan: taulak mugitu ziren bitartean irekita egon zenean, diagrama une honetan ireki duenean, eta lankide batenean, eta [esportatutako irudi batek](./file-import-export.md#image) ere marrazten ditu. Izenen ikuspegiak balio du, taulak zenbateko zabalak diren aldatzen baitu. Ikus [Izenen ikuspegia](./logical-names.md#name-view).

![members taula behera eta atzera arrastatzea, orders taulatik datorren konektorea categories taularen eskuinetik eta ezkerretik inguratuz igarotzearen artean txandakatzen den bitartean, izkina guztiak biribilduta](/img/demo-connector-routing.webp)
