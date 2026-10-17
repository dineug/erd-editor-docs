---
sidebar_position: 3
description: MCP zerbitzariak nola aukeratzen duen editore batean (VS Code, Obsidian edo JetBrains IDE bat) zuzenean editatzearen eta diskoko fitxategia editatzearen artean, eta modu bakoitzean zer egiten duten gordetzeak, desegiteak eta itxitako editore batek.
---

# Zuzenean eta editorerik gabe

Dei bakoitzean, zerbitzariak dokumentua daukan editore bat bilatzen du, editoreek `~/.erd-editor/ide/` karpetan gordetzen dituzten blokeo-fitxategien bidez.
ERD Editor duen VS Code leiho bakoitzak eta Obsidian biltegi-leiho bakoitzak bana gordetzen dute, eta JetBrains IDE batek bat gordetzen du IDE osorako, bertan irekita dauden proiektu guztiak zerrendatzen dituena.
Editore batek bere blokeo-fitxategia kentzen du ixten denean.
Zerbitzariak aurkitzen duenak erabakitzen du edizioa nora doan.

| Zer aurkitzen duen | Zer egiten duen edizio batek |
| --- | --- |
| Lan-eremuan, biltegian edo irekitako proiektuan dokumentua duen editore bat, edo dokumentua irekita duena | **Zuzenean.** Behar izanez gero, dokumentua ERD Editor editorean irekitzen du, edizio-saioan sartzen da eta aldaketa bertan aplikatzen du. Edizioak berehala agertzen dira, eta editoreak zure edizioak gordetzen dituen bezala gordetzen dira. Ikus [Gordetzea](#saving). |
| Editorerik ez | **Editorerik gabe.** Fitxategia kargatzen du, aldaketa aplikatzen du eta fitxategia ordezten du. `erd_save` tresnak ez du ezer egiteko. |
| Agente-gunea desaktibatuta duen editore bat | **Ukatua.** Irakurketek funtzionatzen dute oraindik, diskotik. Editore bat irekita dagoela fitxategian idatzitako aldaketa bat editore horren hurrengo gordetzeak gainidatz lezake; beraz, zerbitzariak ez du ezer idazten. |
| Gunea aktibatuta duen baina zerbitzariarenaz bestelako protokolo bat erabiltzen duen editore bat: `1.0.0` bertsioko zerbitzariarekin, `3.x` bertsioko VS Code luzapen bat, `0.x` bertsioko Obsidian plugin bat, edo `0.9.0` edo `0.10.0` bertsioko JetBrains plugin bat; `1.0.0` baino lehenagoko zerbitzari batekin, `4.0.0` edo berriagoa den luzapena, edo `1.0.0` edo berriagoa den plugin bat | **Ukatua**, irakurketak barne, `protocolMismatch` kodearekin. Mezuak eguneratu beharreko aldea aipatzen du: luzapena edo plugina, edo zerbitzaria. Ikus [Eguneratzea](./installation.md#updating). |
| Windows sisteman, dokumentua fitxategi bererako beste bide-izen batekin daukan editore bat: agenteak ordenagailu honetako sareko karpeta partekatu baten edo mapatutako unitate baten bidez izendatu du, adibidez `\\localhost\C$\…`, eta editoreak unitatearen bide-izenarekin dauka, edo alderantziz | **Ukatua**, irakurketak barne, `invalidPath` kodearekin. Mezuak editoreak dokumentua zein bide-izenekin daukan aipatzen du; deitu berriro bide-izen horrekin. |
| Windows sisteman, Windowsek agenteari sarbidea eragozten dion editore bat: administratzaile gisa abiarazitakoa, agentea hala abiarazi ez denean, edo edozein editore, agentea isolamendu-ingurune batean exekutatzen denean | **Ukatua**, irakurketak barne, `hubUnreachable` kodearekin eta zergatik adierazten duen mezu batekin. Exekutatu editorea eta agentea eskubide berekin, adibidez editorea berriro abiarazita administratzaile-eskubiderik gabe. |

Edizio baten emaitzak zein modutan exekutatu den aipatzen du, `live` edo `headless`, eta ukatutako edizio batek zergatik adierazten du.
Bilaketa dei bakoitzean exekutatzen da berriro; beraz, editore bat irekitzeak edo ixteak hurrengo deia berarekin eramaten du.

Editore batek baino gehiagok dokumentua daukanean, dokumentua irekita duenak irabazten dio hura duen karpeta bat soilik zerbitzatzen duenari, eta karpeta bat zerbitzatzen dutenen artean, karpeta sakonena duenak irabazten du.
Berdinketa batean, adibidez bi editoreek dokumentua irekita dutenean, blokeo-fitxategia azkenekoz aldatu zaionak irabazten du.
Beraz, VS Code lan-eremuko karpeta baten barruan dagoen Obsidian biltegi bateko dokumentu bat Obsidian aplikaziora doa, VS Code editoreak irekita badu eta Obsidian aplikazioak ez badu izan ezik.

Dokumentu bakar baterako deiak banan-banan exekutatzen dira, zerbitzarira iritsi ziren ordenan. Dokumentu desberdinetarako deiak aldi berean exekutatzen dira.

## Zuzenean {#live}

Agentea beste lankide bat balitz bezala sartzen da editorean.
Haren edizioak berehala iristen dira dokumentua irekita duen editore guztietara, eta haren fokua editatzen ari den taulan eta gelaxkan marrazten da, lankide batena bezala. Ikus [focusTracker](../api/advanced/collaborative-editing.md#focustracker).

Irakurketa batek ez du inoiz editorerik irekitzen. Edizio batek dokumentua ERD Editor editorean irekitzen du oraindik irekita ez dagoenean, teklatuaren fokua hartu gabe.

### Gordetzea {#saving}

Editore bakoitzak zure edizioak gordetzen dituen bezala gordetzen ditu agentearen edizioak.

VS Code editorean, agentearen edizioek fitxa gorde gabeko gisa markatzen dute, zureek bezala, eta dokumentua gordetzen denean soilik iristen dira diskora.
`erd_save` tresnak VS Code bidez gordetzen du, VS Coderen beraren gordetzeko komandoak egiten duen bezala. Horren ordez, zuk gorde dezakezu, `Ctrl + S` (Windows/Linux) edo `⌘ + S` (Mac) lasterbidearekin.
Agentearen edizioak gorde gabe dauden bitartean editorea ixtean, haiek gorde ala ez galdetzen da, gorde gabeko beste edozein aldaketarekin bezala.

Obsidian aplikazioak agentearen edizioak gordetzen ditu editatzeari utzi eta bi segundo inguru geroago, eta fitxa ixteak galdetu gabe gordetzen ditu.
JetBrains IDE batek editatzeari utzi eta segundo-zati bat geroago idazten ditu, eta fitxa ixteak oraindik zain dagoena idazten du; fitxa ez da inoiz aldatutako gisa agertzen.
Bietan, `erd_save` tresnak berehala idazten ditu.

`erd_save` tresnak gehienez bi segundo itxaroten du lehenik, editoreak agenteak egindako edizio guztiak izan arte.
`notSaved` kodearekin ukatzen da editoreak hori baieztatu ezin izan duenean, edo fitxategia idatzi ez duenean: VS Code editoreak fitxa bat gorde gabe uzten du fitxategia diskoan aldatu denean, eta JetBrains IDE batek ezin izan du idatzi, adibidez elkarrizketa-koadro bat irekita zegoen bitartean edo fitxategia idatzi ezin denean.

VS Code editorean eta JetBrains IDE batean, gordetzeko ezer geratzen ez zaion dokumentu batean `erd_save` tresnak arrakasta du eta fitxategia dagoen bezala uzten du.
Hori gertatzen da edizio guztiak gorde ondoren, JetBrains IDE batek berez egiten duen zerbait, eta horrela jarraitzen du ondorengo aldaketa guztiak [blokeo](../guide/guides/settings.md#lock) batek fitxategitik kanpo uzten dituenetakoak diren bitartean, adibidez `Viewport` blokeatuta dagoela korritzea edo zooma aldatzea, edo `Canvas Type` blokeatuta dagoela fitxaz aldatzea. Blokeo guztiak lehenespenez aktibatuta daude.
JetBrains IDE batek idatzi ezin duen fitxategi bat ukatu egiten da orduan ere.

Editoreak agentearen azken edizioaren ondoren dokumentua ixten duenean, agentearen hurrengo deiak azalpen bat dakar: edizio horiek fitxategian daude soilik editorea itxi aurretik gorde baziren.

### Desegitea {#undo}

`erd_undo` tresnak agenteak egindako azken edizioa desegiten du, inoiz ez zurea, eta `erd_redo` tresnak berriro aplikatzen du.
Editorearen beraren [desegiteak](../guide/guides/undo-redo.md) alderantziz funtzionatzen du: zure edizioak desegiten ditu eta inoiz ez agentearenak, beste editore batetik iristen diren aldaketak ez baitira zure historian erregistratzen.

Edizio batzuek ez dute desegite-urratsik sortzen editorean: [ezarpen-tresnen](./tools.md#settings) artean `erd_set_database` eta `erd_set_database_name`, eta `erd_resize_memo`.
Ezta taldea guztira 20 pixel baino gutxiago mugitzen duen `erd_move_table_group` batek ere, horizontaleko eta bertikaleko desplazamenduak batuta, nahiz eta taldea mugitu den lekuan geratzen den.
Ezer aldatzen ez duen dei batek ere ez du urratsik sortzen: dokumentuak jada duen balio bat ezartzen duten `erd_set_column_primary_key`, `erd_set_column_unique`, `erd_set_column_not_null`, `erd_set_column_auto_increment`, `erd_set_index_unique` edo `erd_set_index_column_order`; indizean jada dagoen zutabe batekin `erd_add_index_column`; talde horretan jada dauden taulekin `erd_set_table_group` (edo jada inongo taldetan ez daudenekin, `groupId` `null` balioarekin); taldea jada dagoen puntura `erd_move_table_group`; taldeak jada duen laukizuzenera `erd_resize_table_group`; taularik ez duen dokumentu batean `erd_sort_tables`; edo taularik ekartzen ez duen eta `mode` argumentua `append` duen inportazio bat (`erd_import_json` tresnaren kasuan, ez taularik ez oharrik).
`erd_undo` tresnak horiek saltatu egiten ditu eta bere emaitzan aipatzen ditu.
Beste edizio batzuek, hala nola `erd_change_relationship_type`, `erd_change_relationship_on_delete`, `erd_change_relationship_on_update`, `erd_change_table_group_name`, `erd_change_table_group_color` eta `erd_set_ddl_script`, desegite-urrats bat sortzen dute dokumentuak jada duen balio bat ezartzen dutenean ere.

Agentearen desegite-historia amaitu egiten da, emaitzan azalpen batekin, kasu hauetan:

- Agentea berriro sartzen da dokumentuan, adibidez editoreak agentea dokumentutik kanpo utzi ondoren.
- Editorea itxi egiten da, edo editoreak dokumentua ixten du eta hura zerbitzatzeari uzten dio, eta agenteak diskoko fitxategia editatzen jarraitzen du.
- Editore batek bere gain hartzen du agenteak diskoan editatzen zuen dokumentu bat.

Zerbitzariak, halaber, agentearen deirik 30 minutuz jaso ez duen dokumentu bat ixten du, eta desegite-historia ere harekin batera doa, azalpenik gabe.

### Editorea desagertzen denean {#when-the-editor-goes-away}

Editore batek dokumentu bat daukan bitartean, zerbitzariak ez du inoiz bere kabuz fitxategira jotzen.
Konexioa eteten bada, berriro konektatzen da.
Editorea itxi denean, edo dokumentua itxi eta jada ez duenean hura edo hura duen karpetarik zerrendatzen, orduan soilik editatzen du zerbitzariak fitxategia, eta emaitzan hala adierazten du.
Hori gertatzen da editoreak zerbitzatzen dituen karpeta guztietatik kanpo dagoen diagrama bat ixten duzunean (VS Code editorean, lan-eremutik kanpotik irekitako bat), Obsidian aplikazioan ERD Editor plugina desaktibatzen duzunean, eta JetBrains IDE batean dokumentua duen proiektua ixten duzunean edo bertan plugina desaktibatzen duzunean.
Editoreak zerbitzatzen duen karpeta baten barruan dagoen diagrama itxi bat editorearekin geratzen da, eta agentearen hurrengo edizioak berriro irekitzen du.

Editore bat oraindik martxan dagoenean, baina haren blokeo-fitxategia desagertu denean eta haren konexioa editoreak dokumentua itxi gabe itxi denean, editore horrek hurrengo edizioa `hubGone` kodearekin ukatzen du.
Mezuak dokumentua zerk askatzen duen adierazten du: VS Code editorean, birkargatu leiho hori, edo itxi agenteak fitxategia zuzenean edita dezan; Obsidian aplikazioan, aktibatu berriro ERD Editor plugina, edo itxi leiho hori; JetBrains IDE batean, aktibatu berriro plugina, edo itxi IDEa.

Bi kasutan, irakurketa bat diskoko fitxategira doa horren ordez, editorean oraindik gorde ez diren edizioak falta direla dioen azalpen batekin: dokumentua daukan editoreak gunea desaktibatuta duenean, eta goiko `hubGone` kasuan.
Editore baten gunera konektatu ezin den irakurketa bat `hubUnreachable` kodearekin ukatzen da, edizio bat bezala.

## Editorerik gabe {#headless}

Dokumentua zerbitzatzen duen editorerik ez dagoenean, edizio bakoitzak fitxategia kargatzen du, aldaketa aplikatzen du eta fitxategia berriro idazten du.
Idazketa dokumentuaren ondoko aldi baterako fitxategi batera doa, `.<name>.<id>.tmp` izena duena, eta gero fitxategi horrek dokumentua ordezten du; beraz, dokumentua ez da inoiz erdi idatzita geratzen, Windows sisteman behean azaldutako lekuan bertan idazteko kasuan izan ezik.

Azken urrats horren aurretik, zerbitzariak egiaztatzen du fitxategia diskoan aldatu den deiak iraun bitartean.
Aldatu bada, ez da ezer idazten, fitxategia berriro kargatzen da eta deia `conflict` kodearekin ukatzen da. Agenteak berriro deitzen du.
Bi deiren artean aldatu den fitxategi bat berriro kargatzen da besterik gabe, eta agentearen horren aurreko desegite-historia baztertu egiten da.

Irakurtzeko soilik den fitxategi bat dagoen bezala uzten da, eta edizioa `readonly` kodearekin ukatzen da: bere jabearentzat idazteko baimenik ez duen fitxategi bat, edo Windows sisteman irakurtzeko soilik atributua duena, adibidez editatzeko atera ez den Perforce edo TFVC fitxategi bat.
Eman fitxategiari idazteko baimena, eta deitu berriro. Irakurketek funtzionatzen dute oraindik.

Agenteak dokumentua diskoan editatzen duen bitartean editore bat hura zerbitzatzen hasten bada, edizio hori bakarrik ukatzen da `hubAppeared` kodearekin, eta ez da ezer idazten. Hurrengo deiak editorearen bidez editatzen du.

Windows sisteman, beste bi arau aplikatzen dira:

- Bere karpetarenez bestelako baimen propioak dituen dokumentu bat lekuan bertan idazten da, ordeztu beharrean, baimen horiek gorde ditzan, eta aldi baterako fitxategia ondoren kentzen da. Idazketa horretan dokumentua irakurtzen duen programa batek analizatu ezin den testua aurki dezake.
- Beste programa batek irekita daukan fitxategi bat ezin da ordeztu; beraz, zerbitzaria berriro saiatzen da gehienez bi segundoz. Saiakera bakoitzak lehenik editore bat bilatzen du berriro, eta bitartean dokumentua zerbitzatzen hasi den editore batek idazketa ukatzen du `hubAppeared` kodearekin, edo `blocked` kodearekin gunea desaktibatuta badu. Bi segundoren ondoren fitxategia oraindik hartuta badago, ez da ezer idazten, fitxategia berriro kargatzen da eta deiak huts egiten du sistemaren errorea aipatzen duen mezu batekin.

## Ukatua {#refused}

VS Code leiho batek bere blokeo-fitxategia gordetzen du gunea desaktibatuta duenean ere: `dineug.erd-editor.agentHub.enabled` ezarpena desaktibatuta dagoenean, lan-eremua fidagarria ez denean, edo guneak ezin izan duenean entzun.
Obsidian biltegi-leiho batek bere blokeo-fitxategia gordetzen du gunea desaktibatuta duela, Coding agents aukera desaktibatuta dagoenean eta guneak ezin izan duenean entzun.
JetBrains IDE batek bere blokeo-fitxategia gordetzen du gunea desaktibatuta duela, Coding agents aukera desaktibatuta dagoenean, guneak ezin izan duenean entzun, eta IDEa ixten ari den bitartean.

Halako dokumentu baten edizioa `blocked` kodearekin ukatzen da, irekita dagoen editoreak fitxategian idatzitako aldaketa bat gainidatz baitezake bere hurrengo gordetzean.
Irakurketek funtzionatzen dute oraindik, diskoko fitxategitik.

Agenteak edita dezan, aktibatu berriro gunea, mezuak editore horretarako dioen bezala: VS Code editorean, jo lan-eremua fidagarritzat eta aktibatu ezarpena, edo birkargatu leihoa; Obsidian aplikazioan, aktibatu Coding agents aukera, edo birkargatu Obsidian; JetBrains IDE batean, aktibatu Coding agents aukera, edo berrabiarazi IDEa jada aktibatuta badago.

JetBrains IDE batek, halaber, `hubDisabled` kodearekin ukatzen du fidagarritzat jotzen ez dituen proiektuek soilik daukaten dokumentu bat aldatzea.
Agenteek halako dokumentu bat irakur dezakete oraindik, eta `erd_list_documents` tresnak `readonly` gisa zerrendatzen du. Jo proiektua fidagarritzat, eta deitu berriro.

Blokeo-fitxategirik gordetzen ez duen editore batek ez du ezer babesten, eta agenteak diskoko fitxategia editatzen du diagrama bertan irekita dagoen bitartean ere.
Hori gertatzen da Linux sisteman Flatpak gisa instalatutako Obsidian aplikazioarekin edo JetBrains IDE batekin, JCEF gabeko JetBrains IDE batekin, eta gunea abiarazi ezin izan duen JetBrains IDE batekin. Ikus [Obsidian konfiguratzea](./installation.md#set-up-obsidian) eta [JetBrains IDE bat konfiguratzea](./installation.md#set-up-a-jetbrains-ide).
`3.0.0` baino lehenagoko VS Code luzapen batek eta `0.9.0` baino lehenagoko JetBrains plugin batek ere ez dute bat ere gordetzen, gunerik ez dutelako.

## Dokumentuak {#documents}

Dokumentu bat `path` argumentuarekin izendatzen da, bide-izen absolutu gisa edo zerbitzariaren laneko direktorioarekiko erlatibo gisa.

- Dokumentu berriak `.erd.json` fitxategiak dira. `erd_open_document` tresnak, `create` argumentuarekin, fitxategia sortzen du, eta luzapenik ez duen izen bati `.erd.json` gehitzen dio. Editoreko diagrama berri batek bezala, dokumentu berriak [blokeo](../guide/guides/settings.md#lock) guztiak aktibatuta ditu; beraz, editore batean korritzeak, zooma aldatzeak, fitxaz aldatzeak, edo Kode-sortzailearen beste lengoaia, izenen idazkera edo mugatzaile mota bat hautatzeak ez du inoiz fitxategia aldatzen. Ez dago blokeo bakar bat aktibatzen edo desaktibatzen duen tresnarik: hori editorearen Ezarpenak fitxan egiten duzu. `replace` moduan, `erd_import_json` tresnak blokeo guztiak ordezten ditu kargatzen duen dokumentuarenekin. Ikus [Inportazioa](./tools.md#import).
- Lehendik dauden `.erd`, `.vuerd` eta `.vuerd.json` fitxategiak ere irekitzen dira. Beste edozein luzapen duen bide-izena `invalidPath` kodearekin ukatzen da.
- Windows sisteman, Windowsek idatzita dagoen bezala gordetzen ez duen izen bat duen bide-izena `invalidPath` kodearekin ukatzen da dokumentua irakurri edo idatzi aurretik, irakurketak barne: bi puntu edo Windowsek onartzen ez duen beste karaktere bat duen izena, adibidez `orders:v2.erd`; gailu-izen bat, adibidez `NUL.erd` edo `CON.erd`, maiuskulaz zein minuskulaz; edo puntu batez edo zuriune batez amaitzen den izena. Aldatu izena, adibidez `:` ikurraren ordez `-` erabiliz.
- Editoreak irakur dezakeen dokumentua ez den fitxategi bat, adibidez bateratze-gatazken markekin geratu dena, `invalidDocument` kodearekin ukatzen da eta dagoen bezala uzten da. Ez da inoiz diagrama huts gisa kargatzen eta berriro idazten.

Agenteak tresnen bidez soilik aldatzen du dokumentu bat, eta fitxategia inoiz berak ez idazteko esaten zaio.

`erd_list_documents` tresnak dokumentuak zerrendatzen ditu `path`, `open`, `active`, `dirty` eta `readonly` eremuekin.
Laneko direktorioa zerbitzatzen duen editoreari galdetzen dio, dokumentu baterako bezala aukeratuta, eta bertan irekita dauden diagramak zerrendatzen ditu, eta ondoren zerbitzatzen dituen ERD fitxategiak: VS Code leiho baten lan-eremuko karpetetakoak, Obsidian biltegi batekoak, edo JetBrains IDE batean irekita dauden proiektu guztietakoak.
Bestela, laneko direktorioaren azpiko ERD fitxategiak zerrendatzen ditu; han, irakurtzeko soilik den fitxategi bat `readonly` gisa markatzen da, eta, Windows sisteman, Windowsek idatzita dagoen bezala gordetzen ez duen izena kanpoan uzten da.
