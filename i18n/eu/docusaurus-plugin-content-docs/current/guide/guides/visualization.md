---
sidebar_position: 10
description: Arakatu eskema indarrez gidatutako Grafo gisa edo taula-txartelen Fluxu gisa; aldatu zooma eta mugitu ikuspegia, argiztatu taula batekin erlazionatutako taulak, eta fokuratu taula gutxi batzuk aldi berean.
---

# Bisualizazioa

Dokumentu osoa begirada batean erakusten du, bi moduetako batean:

- `Graph`: taula guztien, haien zutabeen eta haien arteko erlazioen indarrez gidatutako grafoa. Ikus [Grafo modua](#graph-mode).
- `Flow`: taula bakoitza txartel gisa marraztuta eta bere erlazioen arabera antolatuta. Ikus [Fluxu modua](#flow-mode).

Ireki goiko tresna-barrako `Visualization` fitxatik, edo [Bilaketa azkarra](./quick-search.md) erabiliz, `Tab` atalean.  
ERD fitxatik, `Alt + F` (Windows/Linux) edo `⌥ + F` (Mac) lasterbideak eta taularen laster-menuko `Focus on this table` aukerak zuzenean `Flow` moduan irekitzen dute, aukeratutako taulei eta haietatik erlazio bakar batera dauden taulei mugatuta. Ikus [Taulak fokuratzea](#focusing-on-tables).

Aldatu modua [tresna-barraren](#toolbar) ezkerreko muturreko `Graph` eta `Flow` botoiekin.  
Irekitako editore berri bat `Graph` moduan hasten da. Aukeratzen duzun moduak irauten du editorea irekita dagoen bitartean, beste fitxa batzuetara joan eta itzuli arren, baina ez da dokumentuan gordetzen.

## Tresna-barra {#toolbar}

Tresna-barra flotatzaile bat dago fitxaren beheko ertzaren erdian. Ezkerretik eskuinera:

- `Graph` eta `Flow`, uneko modua nabarmenduta.
- `Zoom out`, uneko zooma `100%` bezalako ehuneko batez adierazita, eta `Zoom in`. Sakatze bakoitzak zooma 4 ehuneko-puntu aldatzen du, pantailaren erdigunea dagoen lekuan mantenduz. Ehunekoak zauden moduaren zooma erakusten du, eta haren gainean klik egiteak zoom hori `100%` baliora itzultzen du.
- `Fit`, moduak erakusten duen guztia ikusgai jartzen duena: `Graph` moduan nodo guztiak, `Flow` moduan txartel guztiak.
- `Tidy Up`, `Flow` moduan soilik, txartelak berriro antolatzen dituena. Ikus [Fluxua nola antolatzen den](#how-flow-is-placed).
- Errenkaden bistaratzearen menua, `Flow` moduan soilik, uneko aukera etiketa gisa duela. Ikus [Errenkaden bistaratzea](#row-display).
- `Show all`, `Flow` moduan soilik eta ikuspegia mugatuta dagoen bitartean soilik, diagrama osora itzultzen dena. Ikus [Taulak fokuratzea](#focusing-on-tables).
- `Go to content` iparrorratza, tresna-barraren amaieran pantailan nodorik edo txartelik ez dagoen bitartean soilik agertzen dena. Hurbilen dagoen nodoa edo txartela seinalatzen duen gezi bat eta zein urrun dagoen erakusten ditu, adibidez `1.2k`. Egin klik bertan nodo edo txartel hori erdiratzeko, zooma aldatu gabe.

Zoom-botoiek beren lasterbideak adierazten dituzte argibideetan, adibidez `Zoom in (Ctrl + Plus)` (Windows/Linux) edo `Zoom in (⌘ + Plus)` (Mac).  
`Ctrl + Plus` eta `Ctrl + Minus` (Windows/Linux) edo `⌘ + Plus` eta `⌘ + Minus` (Mac) lasterbideek zooma urratsez urrats aldatzen dute botoiek bezala, edozein modutan, eta `Ctrl + 0` (Windows/Linux) edo `⌘ + 0` (Mac) lasterbideak zuzenean `100%` baliora itzultzen du.  
Ehunekoan klik egitea `Ctrl + 0` (Windows/Linux) edo `⌘ + 0` (Mac) sakatzea bezalakoa da, eta ehunekoaren argibideak lasterbide hori aipatzen du. Lasterbideek ez dute ezer egiten Bilaketa azkarra irekita dagoen bitartean.

## Grafo modua {#graph-mode}

Dokumentu osoa indarrez gidatutako grafo gisa marrazten du; horrela, begirada batean ikus dezakezu taulak elkarren artean nola erlazionatzen diren eta zein dauden domeinu baten erdigunean.

![Grafo modua irekitzea, sagua taula baten gainetik pasatzea haren aurrebista ikusteko, nodo bat arrastatzea, eta txikiagotu eta berriro handiagotzea](/img/demo-visualization.webp)

### Grafoa irakurtzea {#reading-the-graph}

Taula eta zutabe bakoitza nodo bat da, eta bi motak kolore desberdinetan marrazten dira. Oharrak eta [taula-taldeak](./table-groups.md) ez dira marrazten.  
Zutabe-nodo bakoitza dagokion taulari lotuta dago, eta erlazio batek batzen dituen bi taula elkarri lotuta daude.  
Norabide berean erlazio bat baino gehiagok batzen dituen taulak behin bakarrik lotzen dira, eta taula berean hasi eta amaitzen den erlazio batek ez du loturarik marrazten.

Taulen izenak handiagotu ahala agertzen dira grafoan, `50%` eta `100%` artean pixkanaka, eta 15 karaktere baino luzeagoa den izena moztu egiten da. Zutabe-nodoek ez dute etiketarik, zooma edozein dela ere.

### Grafoan zehar mugitzea {#getting-around-the-graph}

Gurpilak zooma aldatzen du erakuslearen azpian dagoenaren inguruan, `10%` eta `400%` artean.  
Ukipen-paneleko atximur-keinuak modu berean aldatzen du zooma, eta ukipen-pantailan bi hatzek haien arteko puntuaren inguruan aldatzen dute zooma eta, mugitu ahala, ikuspegia mugitzen dute.  
Arrastatu atzealdea ikuspegia mugitzeko, edo arrastatu saguaren erdiko botoiarekin edozein lekutatik, baita nodo baten gainetik ere, [ERD oihalean](./table-related-functions.md#getting-around-the-canvas) bezala. Erdiko botoiarekin arrastatzeak ikuspegia mugitu besterik ez du egiten: ez du inoiz nodorik tiratzen.

[Tresna-barrako](#toolbar) zoom-botoiek eta zoomaren lasterbideek, aldiz, pantailaren erdigunea geldirik mantentzen dute, tarte berean, eta `Fit` botoiak nodo guztiak ikusgai jartzen ditu.

### Aurrebista gainetik pasatzean {#hover-preview}

Pasatu sagua taula-nodo baten gainetik taula horren aurrebista ikusteko, kurtsorearen ondoan.  
Zutabe-nodo baten gainetik pasatzeak eraztun bat marrazten du haren inguruan, besterik ez; ez da aurrebistarik irekitzen.

Aurrebistak ERD oihalak erakusten dituen zutabe berberak erakusten ditu, ordena berean. Ikus [Taulen ikuspegi-aukerak](./table-related-functions.md#table-view-options) eta [Zutabeen ordena doitzea](./settings.md#adjusting-column-order).  
`Alternate Key` ikuspegi-aukera aktibatuta dagoenean, [gako alternatibo](./table-related-functions.md#alternate-keys) bateko zutabe bakoitzak bere marka darama, adibidez `AK1.1`, bere errenkadaren azkenean, eta aurrebista zabaldu egiten da horretarako, ERD oihaleko taula zabaltzen den bezala.  
ERD oihaleko taula ez bezala, aurrebistaren goiburuak ez du inoiz taularen [taldearen](./table-groups.md#coloring-a-group) kolorea hartzen.  
Bistaratzeko soilik da, eta ezkutatu egiten da nodo bat arrastatzen duzun edo ikuspegia mugitzen duzun bitartean.

### Ingurunea nabarmentzea {#highlighting-a-neighbourhood}

Taula baten gainetik pasatzeak haren ingurunea ere argiztatzen du: taula bera, bere zutabeak, bere erlazioek edozein norabidetan lotzen dizkioten taulak, eta haien arteko loturak.  
Grafoko gainerako guztia lausotu egiten da; horrela, taulak ukitzen duena bereiz irakur daiteke.

### Nodoak mugitzea {#moving-nodes}

Arrastatu nodo bat saguaren ezkerreko botoiarekin, nodoa eta hari lotutako guztia kokapen berri batera tiratzeko.  
Nodoa erakuslearen azpian finkatuta geratzen da eusten diozun bitartean, eta antolaketa berriro berotzen da haren inguruan.  
Askatzen duzunean, berriro egonkortzen da; ez da ezer finkatuta geratzen askatu duzun lekuan.  
Nodo baten gainean eskuineko botoiarekin sakatzeak edo arrastatzeak ez du nodoa tiratzen, ezta ikuspegia mugitzen ere.

### Grafoa une bateko argazkia da {#the-graph-is-a-snapshot}

Grafoa fitxa hau irekitzen duzun unean dokumentuak duen egoeratik eraikitzen da, eta hutsetik berreraikitzen da fitxara itzultzen zaren bakoitzean.  
`Flow` modutik `Graph` modura aldatzeak ere berreraikitzen du, eta berreraikitze bakoitza `100%` zoomean hasten da berriro.

## Fluxu modua {#flow-mode}

Taula bakoitza txartel gisa marrazten du, eta txartelak haien erlazioen arabera antolatzen ditu. Oharrak eta [taula-taldeak](./table-groups.md) ez dira marrazten.  
Ez da [Antolaketa automatikoa](./table-related-functions.md#auto-layout) funtzioaren `Flow` antolaketa, taulak ERD fitxan bertan mugitzen dituena.

Txartel bakoitza ERD fitxako taula bat bezala marrazten da: taularen kolorea ezkerreko ertzean behera, goiburu-banda bat taula-ikono batekin eta taularen izenarekin, eta ondoren haren [errenkaden bistaratzeak](#row-display) eskatzen dituen errenkadak. ERD fitxako taula ez bezala, txartelak marra bat ere marrazten du errenkaden artean, eta haren goiburuak ez du inoiz taularen [taldearen](./table-groups.md#coloring-a-group) kolorea hartzen. Txartelek itxura hori mantentzen dute zoom guztietan, eta ez dira inoiz izenera murrizten, ERD fitxako taulak `70%` edo gutxiagoko zoomean murrizten diren bezala. Txartelean ezin da ezer editatu.

Konektore bat taulatik taularako kurba leun bakarra da, txartelen azpian marraztua; beraz, txartel baten atzetik pasa daiteke. Taula batetik bere buruarako erlazio batek txartelaren goiko eskuineko izkinaren inguruan egiten du kurba, ERD fitxan bezala. Ikus [Konektoreen bideratzea](./relationship-editing.md#connector-routing). Konektore guztiak marra gris jarraitu berberaz marrazten dira, erlazioa identifikatzailea izan ala ez, eta ERD fitxako mutur-marka berberekin. Ikus [Konektore bat irakurtzea](./relationship-editing.md#reading-a-connector). Fluxuak konektoreak marrazten ditu `Relationship` [ikuspegi-aukera](./table-related-functions.md#table-view-options) desaktibatuta dagoenean ere. Ez ditu inoiz marrazten erlazio baten ON DELETE eta ON UPDATE ekintzen `D:` eta `U:` etiketak, ezta horiek azaltzen dituen argibidea erakusten ere, `Referential Actions` ikuspegi-aukeraren balioa edozein dela ere.

Diagrama osoa erakusten denean, beste taula batekin inolako erlaziorik ez duten taulak bloke bakar batean biltzen dira, gainerakoen artean sakabanatu beharrean.

![Fluxu modura aldatzea, sagua orders taularen gainetik pasatzea hura eta bere inguruko taulak argiztatzeko, argia finkatzea, Keys only aukeratzea, eta ondoren ⌘ + Wheel bidez handiagotzea eta Fit sakatzea](/img/demo-visualization-flow.webp)

### Errenkaden bistaratzea {#row-display}

[Tresna-barrako](#toolbar) errenkaden bistaratzearen menuak txartel bakoitzaren zein zati marrazten den ezartzen du. Haren etiketa uneko aukera da, eta haren argibideak, adibidez, `Row display: Name only` dio.  
Menua tresna-barraren gainean irekitzen da, uneko aukeraren ondoan egiaztatze-marka bat duela. Itxi egiten da aukera bat hautatzean, etiketan berriro klik egitean, editorearen beste edozein lekutan klik egitean, `Escape` sakatzean edo `Graph` modura aldatzean.

| Errenkaden bistaratzea | Txartel bakoitzak erakusten duena |
| --- | --- |
| `Name only` | Goiburua bakarrik. |
| `Keys only` | Gako nagusiko eta gako arrotzeko zutabeak, eta erlazioren bat amaitzen den beste edozein zutabe. |
| `All fields` | Zutabe guztiak. |

Errenkadak taularen zutabeen ordenan zerrendatzen dira. Errenkada bakoitzak zutabearen izena erakusten du, aurretik gako-ikono bat duela zutabea gako nagusia, gako arrotza edo biak denean, eta datu mota eskuinean, txartela [argiztatuta](#lighting-related-tables) dagoen bitartean soilik agertzen dena.  
Ez da beste gelaxkarik edo gako alternatiboaren markarik marrazten, eta ez [Taulen ikuspegi-aukerak](./table-related-functions.md#table-view-options), ez [Zutabeen ordena doitzea](./settings.md#adjusting-column-order), errenkada bateko gelaxkak ordenatzen dituena, ez zaizkie txartelei aplikatzen.

Fluxua lehen aldiz irekitzen denean, `Name only` aukerarekin hasten da, edo `Keys only` aukerarekin [taulak fokuratzeak](#focusing-on-tables) ireki badu. Handik aurrera, errenkaden bistaratzea beste bat aukeratzen duzunean bakarrik aldatzen da, eta ikuspegia mugatzeak edo zabaltzeak bere horretan uzten du.  
Errenkaden bistaratzea aldatzeak txartelen tamaina aldatzen du; beraz, Fluxuak berriro antolatzen ditu eta pantailara doitzen ditu.

### Fluxuan zehar mugitzea {#getting-around-the-flow}

Gurpilak ikuspegia mugitzen du, eta `Shift + Wheel` lasterbideak ikuspegia alboetara mugitzen du. `Ctrl + Wheel` (Windows/Linux) edo `⌘ + Wheel` (Mac) lasterbideak zooma aldatzen du, pantailaren erdigunea dagoen lekuan mantenduz.  
Ukipen-paneleko atximur-keinuak atximurra egiten duzun puntuaren inguruan aldatzen du zooma, eta ukipen-pantailan bi hatzek haien arteko puntuaren inguruan aldatzen dute zooma eta, mugitu ahala, ikuspegia mugitzen dute.  
Arrastatu atzealdea ikuspegia mugitzeko, edo arrastatu saguaren erdiko botoiarekin edozein lekutatik, baita txartel baten gainetik ere. Erdiko botoiarekin arrastatzeak ikuspegia mugitu besterik ez du egiten, eta hautapena dagoen bezala uzten du. Ikuspegiaren mugimenduak ez du mugarik, [ERD oihalean](./table-related-functions.md#getting-around-the-canvas) bezala.  
Zooma `10%` eta `150%` artekoa da. Fluxuak bere zooma eta ikuspegiaren kokapena ditu, ERD fitxakoetatik bereizita, eta bietako bat ere ez da dokumentuan gordetzen.

Atzealdean sakatzeak hautapena garbitzen du, eta atzealdeko `Ctrl + drag` (Windows/Linux) edo `⌘ + drag` (Mac) keinuak hautapen-laukia marrazten du.  
Fluxuak ez du minimaparik ezta korritze-barrarik ere. Ikuspegia mugitzean pantailan txartelik geratzen ez bada, erabili [tresna-barrako](#toolbar) `Go to content` iparrorratza.

### Erlazionatutako taulak argiztatzea {#lighting-related-tables}

Pasatu sagua txartel baten gainetik txartel hori, hartatik erlazio bakar batera dauden taulak eta hura taula horiekin lotzen duten konektoreak argiztatzeko. Taula horietako biren arteko konektore bat argiztatu gabe geratzen da.  
Argiztatutako txartel batek nabarmentze-koloreko ertza eta dirdira hartzen ditu, haren datu motak pixkanaka agertzen dira, eta erlazioren bat amaitzen den haren errenkadak tindatu egiten dira. Argiztatutako konektore batek nabarmentze-kolorea hartzen du.  
Ez da beste ezer lausotzen, [Grafoan](#highlighting-a-neighbourhood) ez bezala, eta ez da ezer argiztatzen sagua txartel baten gainean ez dagoen eta txartelik finkatuta ez dagoen bitartean.

Egin klik txartel batean haren argia finkatzeko; horrela, argiztatuta geratzen da erakuslea beste nonbait mugitzen denean. Egin klik berriro txartel berean, edo egin klik atzealdean, askatzeko; beste txartel batean klik egiteak finkapena hara eramaten du. Sagua gainean duen txartela eta finkatutako txartela batera argiztatzen dira.  
Arrastatzeak, `Ctrl + click` (Windows/Linux) edo `⌘ + click` (Mac) keinuak, ikuspegia mugitzeak eta [txartelen botoiek](#card-buttons) ez dute txartelik finkatzen ez askatzen.

Partikulak argiztatutako konektore guztietan zehar mugitzen dira, taula gurasoaren muturretik, gako nagusia dagoen lekutik, taula umearen muturreraino. 60 konektore baino gehiago aldi berean argiztatuta daudenean, partikulak gelditu egiten dira eta argiak bere horretan jarraitzen du.

### Txartelen botoiak {#card-buttons}

Erakuslea txartel baten gainean dagoen bitartean, bi ikono-botoi agertzen dira haren goiburuaren eskuineko muturrean, biak argibiderik gabe:

- Bide-puntuen ikonoak, `Flow` botoiak erakusten duen berak, Fluxua taula horretara eta hartatik erlazio bakar batera dauden tauletara mugatzen du. Ikus [Taulak fokuratzea](#focusing-on-tables).
- Kanpo-estekaren ikonoak ERD fitxara aldatzen du, taula hori bakarrik hautatzen du, aurrera ekartzen du, eta fokuratutako gelaxka haren izenean jartzen du, taula horretako gelaxkaren batek fokua jada ez badu. Oihala taularaino korritzen da, taula jada ondo ikusten ez bada soilik. Ikus [Jauziaren helmuga](./table-related-functions.md#where-a-jump-lands). Ez du inoiz marrazten ari den erlaziorik hasten edo amaitzen.

Bi botoietako edozeinetan sakatzea botoiari bakarrik dagokio: txartelaren beste leku batean sakatzea ez bezala, ez du txartela hautatzen ezta aurrera ekartzen ere. Beraz, bide-puntuen botoiak lehen zenuen hautapena mantentzen du; kanpo-estekaren botoiak taula hautatzen du ERD fitxara aldatzearen barruan soilik. Bi botoiek ezkerreko klikarekin bakarrik funtzionatzen dute.

### Txartelak mugitzea {#moving-cards}

Arrastatu txartel bat saguaren ezkerreko botoiarekin, haren edozein zatitatik, txarteleko bi botoiak izan ezik; eskuineko botoiarekin arrastatzeak ez du ezer mugitzen.  
Txartel batean sakatzeak hautatu egiten du, `Ctrl + click` (Windows/Linux) edo `⌘ + click` (Mac) keinuak hautapenera gehitzen du, eta hautatutako txartel bat arrastatzeak hautatutako txartel guztiak mugitzen ditu. Hautapena ERD fitxak erabiltzen duen bera da; beraz, hemen hautatzen duzunak hautatuta jarraitzen du itzultzen zarenean.

Txartel bat Fluxuan bakarrik mugitzen da: haren taula dagoen lekuan geratzen da ERD fitxan.  
Mugitutako txartel bat bere lekuan geratzen da ikuspegia mugitu, zooma aldatu edo `Fit` sakatu arren. Antolaketak jarri zuen lekura itzultzen da fitxa utzi edo `Graph` modura aldatu eta itzultzen zarenean, baita `Show all` botoiak Fluxuak jada duen diagrama osoaren antolaketa batera itzultzen duenean ere. Antolaketa berri batek berriro kokatzen du, utzi zenuen lekua kontuan hartuta. Ikus [Fluxua nola antolatzen den](#how-flow-is-placed).

### Taulak fokuratzea {#focusing-on-tables}

ERD fitxan, hautatu taula bat edo gehiago eta sakatu `Alt + F` (Windows/Linux) edo `⌥ + F` (Mac), edo egin eskuineko klik taula batean eta aukeratu `Focus on this table`.  
Bisualizazioa fitxa `Flow` moduan irekitzen da, taula horietara eta haietako edozeinetatik erlazio bakar batera dauden taula guztietara mugatuta, edozein norabidetan. Erakusten dituen taulen arteko konektoreak bakarrik marrazten dira.

Eskuineko klik egiten diozun taula hautatutako hainbat tauletako bat denean, aukerak `Focus on selected tables` dio eta hautapen osoa fokuratzen du. Hautapenetik kanpoko taula batean eskuineko klik egiteak taula hori bakarrik fokuratzen du.  
`Alt + F` lasterbideak hautatutako taulak hartzen ditu, eta oharrak eta [taula-taldeak](./table-groups.md) kanpoan uzten ditu. Taularik hautatuta ez badago, ez du ezer egiten, talde bat hautatuta egon arren: aukeratu lehenik `Select tables` taldearen laster-menuan. Ikus [Taldeak hautatzea](./table-groups.md#selecting-groups).  
Ez zaio jaramonik egiten gelaxka bat, ohar bat edo talde baten izena editatzen den bitartean, teklatua [Arakatzailean](./explorer.md#keys-in-the-explorer) dagoen bitartean, edo Bilaketa azkarra, Taularen propietateak, Diferentzia-ikustailea, Antolaketa automatikoaren aurrebista, Denbora-bidaia, [`Export image`](./file-import-export.md#image) elkarrizketa-koadroa edo [`Map Columns`](./relationship-editing.md#map-columns) irekita dagoen bitartean.

Fluxuaren barruan, bide-puntuen [txarteleko botoiak](#card-buttons) ikuspegia modu berean mugatzen du, taula bakar horretara. [Tresna-barrako](#toolbar) `Show all` botoiak diagrama osora itzultzen du.  
Mugatutako ikuspegi bat bereiz antolatzen da eta pantailara doitzen da. Mugatuta jarraitzen du fitxa utzi edo `Graph` modura aldatu eta itzultzen zarenean, eta `Escape` teklak ez du zabaltzen.

![⌥ + F bidez orders taula fokuratzea, members taulara mugatzea haren txarteleko bide-puntuen botoiarekin, eta ondoren Show all](/img/demo-visualization-focus.webp)

### Fluxua nola antolatzen den {#how-flow-is-placed}

`Flow` modua lehen aldiz erakusten denean, erakusten dituen taulak hari nagusitik kanpo antolatzen dira, eta emaitza pantailara doitzen da.  
Antolaketa gorde egiten da editorea irekita dagoen bitartean. Fitxa utzi edo `Graph` modura aldatu eta itzultzen bazara, Fluxuak berrerabili egiten du, zooma eta ikuspegiaren kokapena utzi zenituen bezala.  
Fluxuak antolaketa bat gordetzen du diagrama osorako eta beste bat mugatutako ikuspegirako; beraz, `Show all` botoiak diagrama osoaren antolaketara itzultzen du eta pantailara doitzen du berriro kalkulatu gabe, antolaketa hori egiteko erabilitako ezer aldatu ez den bitartean.

Fluxuak txartelak berriro antolatzen ditu kasu hauetan:

- `Tidy Up` sakatzen duzunean. Emaitza pantailara doitzen da.
- Errenkaden bistaratzea aldatzen duzunean, edo ikuspegia beste taula batzuetara mugatzen duzunean. Emaitza pantailara doitzen da.
- Taulak edo erlazioak gehitzen edo kentzen direnean: ERD fitxan, zu kanpoan zauden bitartean, eta aldaketa itzultzean jasotzen da; edo lankide batek, zu Fluxuan zauden bitartean. Zooma eta ikuspegiaren kokapena dauden bezala geratzen dira.

Antolaketa bakoitzak txartelak une horretan non dauden hartzen du kontuan; beraz, `Tidy Up` botoiak ez du nahitaez aurreko kokapen bat berrezartzen.  
Txartel baten tamaina soilik aldatzen duen aldaketa batek, adibidez taula bati izena aldatzeak edo zutabe bat gehitzeak, ez ditu txartelak berriro antolatzen. Sakatu `Tidy Up` txartelak elkarren gainean geratzen badira.

6 segundo baino gehiago irauten duen antolaketa batek `Placing tables` abisua erakusten du, kargatze-adierazle birakari batekin eta `Cancel` botoiarekin.  
`Cancel` botoiak, edo antolaketa abian den bitartean edozein unetan `Escape` sakatzeak, bertan behera uzten du; `Tidy Up` botoiak, edo `Flow` modura itzultzeak, berriro eskatzen du.  
Antolaketak huts egiten badu — ostalariak ez du worker partekaturik exekutatzen, workerra ez da abiatzen, edo ez da antolaketarik itzultzen 60 segundoren barruan —, Fluxuak `Could not place tables` abisua erakusten du abisu-ikur batekin, eta `Tidy Up` botoiak berriro saiakera bat egiten du. Ikus [Web Workers](../../api/installation.md#web-workers).  
Fluxuak bere azken antolaketak kokatutako taulak bakarrik marrazten ditu, bai diagrama osoan bai mugatutako ikuspegi batean; beraz, lehen aldiz erakusten denean baliteke txartelik batere ez egotea antolaketa batek arrakasta izan arte.  
Fluxuak txartelak berriro antolatzen dituen bakoitzean, adibidez ikuspegia beste taula batzuetara mugatzen duzunean, aurreko kokapena pantailan geratzen da antolaketa berria iritsi arte, eta hantxe geratzen da antolaketa hori bertan behera uzten bada edo huts egiten badu.

Dokumentu osoa ordezten denean, adibidez fitxategi bat inportatuz, Fluxuaren antolaketak, fokuratzea, errenkaden bistaratzea, zooma eta ikuspegiaren kokapena baztertu egiten dira, eta Fluxua irekitzen duzun hurrengo aldian lehen aldian bezala hasten da berriro: diagrama osoarekin, edo mugatuta, [taulak fokuratuz](#focusing-on-tables) irekitzen baduzu.

### Fluxuak ez du inoiz dokumentua editatzen {#flow-never-edits-the-document}

Fluxuak diagrama irakurri besterik ez du egiten. Zooma aldatzeak, ikuspegia mugitzeak, txartelak mugitzeak, `Tidy Up` botoiak, errenkaden bistaratzeak, finkapenek eta fokuratzeak ez diote ezer gehitzen [desegite-historiari](./undo-redo.md#what-the-history-records).  
Ez dute ezer aldatzen diagraman ere. Txartel batean sakatzeak, hori bai, haren taula aurrera ekartzen du, ERD fitxan taula batean klik egiteak bezala, eta, beraz, han ere aurrean dago, baina pilatze-ordena ez da gordetzen. Ikus [Hainbat taula mugitzea](./table-related-functions.md#moving-multiple-tables). `Graph` moduak ere modu berean uzten du diagrama ukitu gabe.  
Txartel batean sakatzeak ez du inoiz erlaziorik gehitzen. ERD fitxa erlazio bat marrazten ari zinela utzi bazenuen, txartel batean sakatzeak haren taula hautatzen du abiapuntu gisa, oraindik bat ere hautatu ez bada, eta, bestela, marrazketa amaitzen du.  
Kanpo-estekaren [txarteleko botoiak](#card-buttons) urrunago doa, Fluxutik ateratzen zaituelako: ERD fitxak taularaino korritu behar duenean, korritze hori ikuspegiaren kokapenaren beste edozein aldaketa bezala erregistratzen da.

Lankideen edizioak diagramara iristen jarraitzen dute Fluxuan zauden bitartean, eta txartelek haiek gehitzen edo kentzen dituzten taulei eta erlazioei jarraitzen diete. Ikus [Fluxua nola antolatzen den](#how-flow-is-placed).  
Haien hautapen- eta foku-eraztunak txarteletan marrazten dira, baina ez haien kurtsoreak eta arrastatze-laukiak. Ikus [Elkarlaneko edizioa](../../api/advanced/collaborative-editing.md).

Bi moduek, fokuratzea barne, `readonly` atributua duen editore batean ere funtzionatzen dute.
