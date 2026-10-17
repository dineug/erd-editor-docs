---
sidebar_position: 14
description: Erlazioen datu moten sinkronizazioa, iruzkinen gehienezko zabalera, taulen zabalera birkalkulatzea, ezarpen-blokeoak (ikuspegia, fitxa eta kode-ezarpenak), zutabeen bistaratze-ordena eta lasterbideen zerrenda.
---

# Ezarpenak

Ireki Ezarpenak tresna-barrako `Settings` botoiarekin, edo [Bilaketa azkarreko](./quick-search.md) `Tab` ataletik.
Ezarpenen pantailak bi fitxa ditu: `Preferences` eta `Shortcuts`. `Preferences` fitxa irekitzen da lehenik, [ongietorri-pantailako](./editing-start.md#welcome-screen) `Shortcuts` errenkadatik irekitzean izan ezik, orduan `Shortcuts` fitxa irekitzen baita.

Gaia eta bistaratze-hizkuntza ez daude pantaila honetan. Tresna-barrako `Theme` eta `Display Language` botoiek irekitzen dituzte. Ikus [Hizkuntza eta gaia](./language-and-theme.md).

## Erlazioen datu moten sinkronizazioa {#relationship-datatype-sync}

Datu motak sinkronizatu ala ez erabakitzen du. Lehenespenez aktibatuta dago.
Hartara, zutabe baten datu mota aldatzean, mota hori erlazio baten bidez harekin lotuta dagoen zutabe orori aplikatzen zaio, katea bi muturretatik jarraituz; beraz, gako arrotz bat ez da inoiz aldentzen erreferentziatzen duen gakotik.
Gako batetik bere gako arrotzetara, serial mota bat gordetzen duen zenbaki osoko mota gisa igarotzen da, erlazio bat marraztean bezala. Ikus [Erlazio identifikatzaileak](./relationship-editing.md#identifying-relationships). Beraz, gako bat `serial` motara aldatzeak `integer` mota ematen die bere gako arrotzei PostgreSQL datu-basean, eta aldaketak katean behera jarraitzen du handik aurrera.
Gako arrotz batetik bere gakora itzultzean, mota idatzita dagoen bezala igarotzen da, salbu eta serial gako batek bere mota mantentzen duela eta aldaketa bertan gelditzen dela.
[Mapatu zutabeak](./relationship-editing.md#map-columns) elkarrizketa-koadroak ere ezarpen honi jarraitzen dio: aktibatuta dagoen bitartean, mapatzen duen lehendik dagoen zutabe bakoitzak bere gako gurasoak gako arrotz bati ematen dion mota hartzen du, eta aldaketak erlazioetan zehar jarraitzen du, goian bezala. Desaktibatuta dagoen bitartean, edo gakoak datu motarik ez duenean, zutabeak berea mantentzen du.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Erlazioen datu moten sinkronizazioaren ezarpena" loading="lazy" />

![members.id BIGINT UNSIGNED motara aldatzea, harekin lotutako member_id guztiak eguneratuz](/img/demo-relationship-data-type-sync.webp)

## Iruzkinen gehienezko zabalera {#maximum-comment-width}

Iruzkinen zutabearen gehienezko zabalera ezartzen du, pixeletan (`60` ~ `200`).
Etengailua desaktibatzeak muga kentzen du, eta sarrera-eremua desgaituta dago desaktibatuta dagoen bitartean.
Aktibatzean, `60px` baliotik hasten da. Barrutitik kanpo idatzitako balio bat muturrik hurbilenera mugatzen da.

![Maximum comment width aktibatzea, 120 idaztea, eta ERD fitxak zabalera horretara moztutako iruzkinak erakustea](/img/demo-settings-comment-width.webp)

## Taulen zabalera birkalkulatzea {#recalculation-table-width}

Sakatu `Sync` botoia taula eta zutabe-gelaxka guztien zabalera birkalkulatzeko, bakoitza bere uneko testura egokituz, eta erlazioen konektoreak tamaina berrien arabera berriro marrazteko.
`Recalculated table width` jakinarazpen batek baieztatzen du.
Zabalerak berez birkalkulatzen dira dokumentu bat kargatzen den bakoitzean; beraz, letra-tipoaren edo errendatzearen aldaketa batek zaharkituta utzi dituenean bakarrik behar da hau.
Zabalerak ez dira fitxategian gordetzen; beraz, `Sync` botoiak ez du inoiz fitxategia aldatzen.

## Blokeoa {#lock}

`Lock` zerrendak sei ezarpen ditu. Ezarpen baten blokeoa aktibatuta dagoen bitartean, fitxategiak blokeatu zenean zuen balioa mantentzen du; beraz, pantailan aldatzeak fitxategia zegoen bezala uzten du.

| Errenkada | Fitxategiak mantentzen duena | Diagrama berri batean |
| --- | --- | --- |
| `Viewport` | ERD oihalaren zoom-maila eta ikuspegiaren kokapena, blokeo bakar gisa | `100% · 0, 0` |
| `Canvas Type` | Diagrama irekitzen den fitxa: `ERD`, `Visualization`, `Schema SQL` edo `Code Generator` | `ERD` |
| `Language` | [Kode-sortzailearen](./code-generator.md#language) lengoaia | `GraphQL` |
| `Table Name Case` | Kode-sortzailearen [taula-izenen idazkera](./code-generator.md#name-case) | `Pascal` |
| `Column Name Case` | Kode-sortzailearen [zutabe-izenen idazkera](./code-generator.md#name-case) | `Camel` |
| `Bracket Type` | [SQL eskema](./schema-sql.md#database-and-bracket) fitxaren eta hura eskaintzen duten [Kode-sortzailearen](./code-generator.md#bracket) helburuen `Bracket` aukera | `None` |

Errenkada bakoitzak balio bat eta blokeo-botoi bat erakusten ditu, eta botoian klik egiteak blokeo hori bakarrik aktibatzen edo desaktibatzen du.
Blokeo bat aktibatuta dagoen bitartean, botoiak giltzarrapo itxi bat erakusten du, `Unlock Viewport` argibidearekin (eta horrela errenkada bakoitzerako), eta balioa, `Locked value` argibidearekin, fitxategiak mantentzen duena da.
Desaktibatuta dagoen bitartean, botoiak giltzarrapo ireki bat erakusten du, `Lock Viewport` argibidearekin, eta balioa, lausotuta eta `Current value` argibidearekin, ezarpenak une honetan duena da.
`Viewport` errenkadaren balioak zooma eta ondoren ikuspegiaren kokapena erakusten ditu, adibidez `75% · -40, 91`. Ikuspegiaren kokapena diagramaren `0, 0` puntua dagoen pantailako puntua da, pixeletan, eta mila edo gehiagoko koordenatu bat laburtu egiten da, `1.2k` edo `-24k` balioetan bezala.

Blokeatzeak ezarpena une horretan dagoen bezala hartzen du.
Blokeo bat aktibatuta dagoen bitartean, ezarpenak pantailan funtzionatzen jarraitzen du: korritu eta zooma alda dezakezu, fitxaz alda dezakezu, eta beste lengoaia, izenen idazkera edo mugatzaile bat aukera dezakezu menuetatik, aukeren paneletatik edo Bilaketa azkarretik.
Fitxategiak, ordea, balio blokeatua mantentzen du, eta errenkadak hura erakusten jarraitzen du; beraz, diagrama ikuspegi blokeatuan eta fitxa blokeatuan irekitzen da berriro, blokeatutako lengoaia, izenen idazkerak eta mugatzailea erabiliz. JSON esportazio batek ere balio blokeatuak idazten ditu.
Pantailak erakusten duena gordetzeko, desaktibatu blokeoa, eta fitxategiak ezarpenari jarraituko dio handik aurrera: `Viewport` desaktibatuta dagoela, diagrama utzi zenuen lekuan irekitzen da. Horren ordez balio berri bat blokeatzeko, adibidez hasierako ikuspegi berri bat, desaktibatu blokeoa eta aktibatu berriro.
Fitxategia irekitzean ikuspegi blokeatuak diagramaren zatirik ere erakusten ez badu, pantaila diagramara mugitzen da hala ere, eta balio blokeatua dagoen bezala geratzen da.
`Canvas Type` blokeoak ez du inoiz Ezarpenak fitxa mantentzen. Aktibatzean, azken aldiz egon zinen beste fitxa blokeatzen du, eta desaktibatuta dagoen bitartean, haren errenkadak fitxa hori izendatzen du.

![Viewport desblokeatzea, diagrama korritzea eta zooma aldatzea, eta berriro blokeatzea haren errenkadak erakusten duen ikuspegi berrian](/img/demo-settings-locks.webp)

Blokeo bat aktibatzeak edo desaktibatzeak fitxategia aldatzen du, fitxategiak zein blokeo dauden aktibatuta gordetzen baitu, baina, Ezarpenak fitxako gainerakoa bezala, ez da [desegite-historian](./undo-redo.md#what-the-history-records) erregistratzen. Irakurtzeko soilik dagoen editore batean, blokeo-botoiek ez dute ezer egiten.
Gainerako ezarpen guztiak dauden bezala gordetzen dira: datu-basea, [`View Option`](./table-related-functions.md#table-view-options) menuko etengailuak eta `Preferences` fitxako gainerakoa.

Blokeo guztiak aktibatuta daude diagrama berri batean, hau da, ezerezetik hasitako batean: VS Code editorean, Obsidian aplikazioan edo JetBrains IDE batean irekitako fitxategi huts bat (Obsidianen `ERD Editor: Create new diagram` eta `New ERD` komandoek sortzen dute halakoa), web aplikazioko eskema berri bat, Google Drive zerbitzuko New menutik sortutako fitxategi bat, edo baliorik jaso ez duen `<erd-editor>` elementu bat.
Web aplikazioak SQL, DBML, AML edo GraphQL fitxategi bat inportatuz sortzen duen eskema edo Google Drive fitxategi bat ere blokeo guztiak aktibatuta hasten da. JSON fitxategi batetik sortutakoak fitxategi horrek erregistratzen dituen blokeoak mantentzen ditu.
Irekitzen duzun fitxategi batek gorde zenean zituen blokeoak mantentzen ditu, bakoitza bere balio blokeatuarekin.
Blokeorik erregistratzen ez duen fitxategi bat, adibidez blokeoak baino lehenagoko bertsio batek gordetakoa edo eskuz idatzitakoa, blokeo guztiak aktibatuta irekitzen da: ikuspegia `100% · 0, 0` balioan eta fitxa `ERD` balioan, gorde zituen ikuspegia eta fitxa edozein direla ere, eta haren lengoaia, izenen idazkerak eta mugatzaile mota gorde zituen bezala blokeatuta.
Diagrama ordezten duen `Import` ekintza batek ere ezartzen ditu blokeoak: JSON fitxategi batek erregistratzen dituen blokeoak eta haien balioak dakartza, eta SQL, DBML, AML edo GraphQL fitxategi batek zure blokeoak mantentzen ditu, baina ikuspegia `100% · 0, 0` baliora itzultzen du, blokeatuta egon ala ez. Ikus [Kanpoko fitxategiak inportatzea](./file-import-export.md#importing-external-files). Inportazioa desegiteak ordeztu zituen blokeoak eta balio blokeatuak itzultzen ditu.

Blokeo batek fitxategitik kanpo uzten duen aldaketa bat ez da aldaketatzat hartzen. VS Code editoreak ez du fitxa aldatutzat markatzen, eta Obsidian aplikazioak eta JetBrains IDE batek fitxategia zegoen bezala uzten dute, bai berez gordetzen dutenean, bai fitxa ixten denean.
Beraz, blokeo guztiak aktibatuta daudela, diagrama batean zehar begiratzea, fitxaz aldatzea eta beste lengoaia, izenen idazkera edo mugatzaile bat probatzea ez dira inoiz `git diff` komandoan agertzen.
`Viewport` desaktibatuta dagoela, korritzeak eta zooma aldatzeak fitxategia aldatzen dute, eta `Canvas Type` desaktibatuta dagoela, baita fitxaz aldatzeak ere, Ezarpenak fitxara aldatzea barne.
Diagrama berri baten fitxategi hutsa hutsik geratzen da fitxategiak mantentzen duen lehen aldaketa arte: edizio bat, blokeorik ez duen ezarpen baten aldaketa, edo blokeo bat aktibatzea edo desaktibatzea.
Diagrama bat ireki eta halako aldaketarik gabe ixteak fitxategia zegoen bezala uzten du, edozein bertsiok edo makinak idatzi zuela ere. Fitxategiak diagrama osatzen duena baino ez du gordetzen, ordena finko batean, eta forma zaharrago batean gordetako fitxategi bat forma honetan berridazten da behin, halako lehen aldaketan. Ikus [Biltegiratze-forma eta exekuzio-garaiko balioa](../../api/advanced/schema.md#storage-form-and-runtime-value).
VS Code editorean, `Reopen Editor With...` komandoarekin diagrama gisa berriro irekitako berrikuspen bat, adibidez Git berrikuspen bat edo Local History sarrera bat, irakurtzeko soilik dago, eta ez da inoiz aldatutzat markatzen.
Google Drive zerbitzuan, korritze bat, zoom bat edo beste fitxa batera aldatze bat ez da inoiz bere kabuz gordetzen, blokeatuta egon ala ez. `Viewport` desaktibatuta dagoela, ikuspegia beste aldaketa batekin batera bakarrik idazten da; beraz, Drive fitxategi bat ikuspegia azken gordetzean zegoen lekuan irekitzen da, eta gauza bera gertatzen da fitxarekin `Canvas Type` desaktibatuta dagoela.

[Elkarlaneko saio](../../api/advanced/collaborative-editing.md) batean, blokeo bat aktibatzea edo desaktibatzea editore guztietara iristen da, eta blokeo batek hura aktibatu zuen editorearen balioa mantentzen du.
`Language` blokeoa, izenen idazkera batena edo `Bracket Type` blokeoa desaktibatzeak hura desaktibatu zuen editorean erakusten den balioa ematen die editore guztiei; beraz, guztiek balio bakarra gordetzen dute. `Viewport` edo `Canvas Type` blokeoa desaktibatzeak ez du inoren ikuspegia edo fitxa mugitzen.
MCP zerbitzariaren bidez lan egiten duen kodetze-agente batek ez du tresnarik blokeoetarako edo haiek hartzen dituzten ezarpenetarako, eta blokeatutako lengoaia, izenen idazkera edo mugatzaile mota fitxategiak mantentzen duen balioarekin irakurtzen du. `replace` moduan egiten dituen inportazioak bakarrik iristen zaizkie, `Import` ekintza batek egiten duen bezala. Ikus [Ezarpenak](../../mcp/tools.md#settings) eta [Inportazioa](../../mcp/tools.md#import).

## Zutabeen ordena doitzea {#adjusting-column-order}

Zutabeak tauletan bistaratzeko ordena ezartzen du.
Arrastatu errenkada bat mugitzeko: errenkada osoa arrasta daiteke, eta heldulekuaren ikonoak markatzen du. Zazpi errenkadak, beren ordena lehenetsian, hauek dira: `Name`, `DataType`, `Not Null`, `Unique`, `Auto Increment`, `Default` eta `Comment`.
[Taulen ikuspegi-aukera](./table-related-functions.md#table-view-options) batek ezkutatutako gelaxka batek zerrendan bere lekua mantentzen du; beraz, ordena erakusten diren gelaxkei aplikatzen zaie, direnak direla.
[Gako alternatiboaren](./table-related-functions.md#alternate-keys) marka (`AK1.1` eta abar) ez da errenkada hauetako bat. Beti errenkada baten amaieran dago, ordena honek azkenik jartzen duen gelaxkaren ondoren, edozein dela ere.

![Column Order ataleraino behera korritzea eta Comment errenkada gora arrastatzea Name errenkadaren azpira, iruzkin bakoitza bere zutabearen izenaren ondoren jarriz](/img/demo-settings-column-order.webp)

## Lasterbideak {#shortcuts}

`Shortcuts` fitxa irakurtzeko soilik den taula bat da, `Command` eta `Keybinding` zutabeekin, eta erabiltzen ari zaren plataformako tekla-konbinazioak zerrendatzen ditu.

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | `T` eta ondoren `G` | `T` eta ondoren `G` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

Gehienak ERD fitxan bakarrik abiarazten dira, eta ez dira abiarazten Bilaketa azkarra, Taularen propietateak, Diferentzia-ikustailea, Antolaketa automatikoaren aurrebista, Denbora-bidaia, [`Export image`](./file-import-export.md#image) elkarrizketa-koadroa edo [`Map Columns`](./relationship-editing.md#map-columns) elkarrizketa-koadroa irekita dagoen bitartean.
`Search`, `Toggle Explorer` eta `Stop` komandoak dira salbuespenak: `Search` komandoak Bilaketa azkarra ireki eta ixten du edozein fitxatatik, `Toggle Explorer` komandoak [Arakatzailea](./explorer.md#opening-and-closing) bere bilaketa-eremuan irekitzen du edozein fitxatatik eta ERD fitxa erakusten du, eta `Stop` komandoa da Bilaketa azkarra, Taularen propietateak, Diferentzia-ikustailea, Antolaketa automatikoaren aurrebista, Denbora-bidaia, `Export image` elkarrizketa-koadroa, `Map Columns` elkarrizketa-koadroa, gai-sortzailea, `Display Language` hautatzailea, kolore-hautatzailea eta irekitako laster-menu bat ixten dituena.
`Toggle Explorer` komandoak Arakatzailea berriro ixten du ERD fitxan irekita dagoen eta zen moduak ezkutatzen ez duen bitartean, tresna-barrako `Explorer` botoiak egiten duen bezala. Bilaketa azkarra, Taularen propietateak, gai-sortzailea, `Display Language` hautatzailea, `Export image` elkarrizketa-koadroa edo `Map Columns` elkarrizketa-koadroa irekita badago, hori ixten du horren ordez, eta teklatua Arakatzailearen bilaketa-eremura eramaten du.
`Toggle Explorer` komandoak ez du ezer egiten gelaxka bat, ohar bat edo taula-talde baten izena editatzen den bitartean. Diferentzia-ikustailea, Antolaketa automatikoaren aurrebista edo Denbora-bidaia irekita dagoen bitartean, bere tekla nabigatzaileari edo ostalariari uzten dio. Ikus [Nabigatzailearen bilaketa-barra](./find-and-replace.md#the-browsers-find-bar).
ERD fitxan, `Stop` komandoak irekita dagoen gelaxka- edo ohar-editore bat amaitzen du, [taula-talde](./table-groups.md) baten izen-editorea ixten du taldearen izena aldatu gabe, edo marrazten ari den erlazio bat edo `New Table Group` talde bat bertan behera uzten du, eta hautapena dagoen bezala uzten du. Horietako bat ere irekita ez badago, hautapena eta fokuratutako gelaxka garbitzen ditu eta, sakatze berean, irekitako kolore-hautatzaile bat ixten du. Irekitako gai-sortzaile bat edo `Display Language` hautatzaile bat sakatze berean ixten da, edozein kasutan.
Arakatzailea, gai-sortzailea edo `Display Language` hautatzailea irekita egoteak ez du oihaleko lasterbideetako bat ere eragozten. `Stop` komandoak ez du inoiz Arakatzailea ixten. `Stop` komandoak eta beste teklek Arakatzailearen barruan zer egiten duten jakiteko, ikus [Arakatzaileko teklak](./explorer.md#keys-in-the-explorer), eta hautatzailearen barruan, ikus [Hizkuntza bat aukeratzea](./language-and-theme.md#picking-a-language).
`Delete Selection` komandoak hautatutako taula, ohar eta taula-talde guztiak kentzen ditu, edo, taula bakar bat bere zutabe batzuekin hautatuta dagoenean eta zooma `70%` baino handiagoa denean, zutabe horiek. Ikus [Taulak eta oharrak ezabatzea](./table-related-functions.md#table-and-memo-deletion). `Remove Table, Memo` komandoak hautatutako taula-taldeak ere kentzen ditu.
`Add Table Group` komandoak [`New Table Group`](./table-groups.md#drawing-a-group) talde baten marrazketa hasten du, [oihaleko tresna-barrako](./table-related-functions.md#canvas-toolbar) `New Table Group` botoiak egiten duen bezala, eta bigarren sakatze batek marrazketa bertan behera uzten du. `Group Selected Tables` komandoa tekla aldatzailerik gabeko bi sakatzez osatzen da: `T` eta ondoren `G`, segundo bateko epean. Hautatutako taulak talde berri batean jartzen ditu eta haren izen-editorea irekitzen du, taula baten laster-menuko `Group selected tables` aukerak egiten duen bezala, eta ez du ezer egiten taularik hautatuta ez dagoenean. Ikus [Hautatutako taulak taldekatzea](./table-groups.md#grouping-selected-tables). Bietako batek ere ez du ezer egiten irakurtzeko soilik dagoen editore batean edo taldeak [ezkutatuta](./table-groups.md#hiding-groups) dauden bitartean.
`Zoom In`, `Zoom Out` eta `Zoom Reset` komandoek [Bisualizazioa](./visualization.md#toolbar) fitxako zooma ere aldatzen dute, `Graph` zein `Flow` moduan, Bilaketa azkarra irekita dagoenean izan ezik.
Bisualizazioa fitxan, `Stop` komandoak [errenkaden bistaratzearen](./visualization.md#row-display) menua ere ixten du, eta oraindik abian dagoen [Fluxuaren antolaketa](./visualization.md#how-flow-is-placed) bat bertan behera uzten du; ez du zabaltzen `Focus on this table` komandoarekin mugatutako ikuspegi bat.
`Focus on this table` komandoak Bisualizazioa fitxa `Flow` moduan irekitzen du, hautatutako tauletara eta haietatik erlazio bakar batera dauden taula guztietara mugatuta, eta ez du ezer egiten taularik hautatuta ez dagoenean. Ikus [Taulak fokuratzea](./visualization.md#focusing-on-tables).
`Select All Table, Memo`, `Hand Tool`, `Delete Selection` eta `Group Selected Tables` komandoek testu-kurtsoreari ematen diote lehentasuna: gelaxka bat edo ohar bat editatzen ari zaren bitartean edo testu-eremu batean idazten ari zaren bitartean, adibidez Arakatzaileko Bilatu eremuan, `Ctrl + A` (Windows/Linux) edo `⌘ + A` (Mac) lasterbideak testua hautatzen du, `Space` teklak zuriune bat idazten du, `Delete` eta `Backspace` teklek testua ezabatzen dute, eta `T` eta ondoren `G` lasterbideak bi letrak idazten ditu.
Kopiatzeko eta itsasteko, nabigatzailearen beraren `Ctrl + C` eta `Ctrl + V` (Windows/Linux) edo `⌘ + C` eta `⌘ + V` (Mac) erabiltzen dira; beraz, ez daude zerrenda honetan. Ikus [Taulak editatzea](./table-editing.md).

Tekla-konbinazioak ezin dira fitxa honetatik aldatu.
Editorea txertatzen duen ostalari batek [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) metodoarekin esleitzen ditu berriro, `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` eta `Zoom Reset` izan ezik, finkoak baitira.
Orduan, `Shortcuts` fitxak ostalariaren tekla-konbinazioak zerrendatzen ditu: ostalariak berriro esleitzen ez duen komando batek bere lehenetsia mantentzen du, eta ostalariak inongo teklari lotzen ez dionak ez du tekla-konbinaziorik erakusten.

Obsidian aplikazioan, tekla hauek editorera iristen dira diagramaren Obsidian fitxa aktibo dagoen bakoitzean, baita Obsidianen lasterbide batek tekla bera erabiltzen duenean ere, adibidez `Alt + Enter`, `Ctrl + K` eta `Ctrl + F` (Windows/Linux) edo `⌥ + Enter`, `⌘ + K` eta `⌘ + F` (Mac). Obsidianen beste lasterbide guztiek bertan funtzionatzen jarraitzen dute. `Ctrl + F` edo `⌘ + F` lasterbideari buruz, ikus [Nabigatzailearen bilaketa-barra](./find-and-replace.md#the-browsers-find-bar).
