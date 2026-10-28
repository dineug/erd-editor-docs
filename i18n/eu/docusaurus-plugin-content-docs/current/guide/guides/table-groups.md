---
sidebar_position: 6
description: Bildu erlazionatutako taulak izena eta kolorea dituen koadro batean, haien atzean; sortu taldeak, eman izena eta kolorea, mugitu, tamainaz aldatu eta kendu, joan haietara Arakatzailetik, aldatu zer taula dituzten, ezkutatu, eta mantendu Antolaketa automatikoan, SQL eskeman eta DBMLn.
---

# Taula-taldeak

Taula-taldea ERD oihalean erlazionatutako taulen atzean marrazten den koadro bat da, izena eta kolorea dituena, zein taula doazen elkarrekin erakusteko.  
Taula bat talde bakar batean egon daiteke gehienez. Taldeak diagramarekin gordetzen dira, baita taula bakoitza zein taldetan dagoen ere.

Koadroak titulu-barra bat du goiko aldean, eta bertan daude talde-ikono bat, taldearen izena lodiz eta, erakuslea taldearen gainean dagoen bitartean, taldea kentzen duen `x` ikurra. Ikus [Talde bat kentzea](#removing-a-group). Izenik gabeko talde batek `unnamed` dio, eta barran sartzeko luzeegia den izena `…` ikurrarekin mozten da.  
Koadroak bere taulak barruan ditu beti: eman zaion tamaina mantentzen du, baina handitu egiten da taula bakoitza barruan gera dadin, inguruan `24px` tarterekin eta titulu-barra gainean duela. Hazten den taula batek koadroa handitzen du berarekin batera, eta gauza bera egiten du ertz batetik gertu askatutako taula batek, erdigunea oraindik koadroaren barruan badu. Taulak arrastatzen diren bitartean, koadroa ez da ez hazten ez txikitzen. Handitze hori ez da gordetzen: koadroa bere tamainara itzultzen da, taulak tarte hori gehiago behar ez duenean.

Taldeak oihaleko beste guztiaren atzean marrazten dira: taulak, oharrak eta erlazio-marrak.  
Taldeak gainjartzen diren lekuan, azkena sakatutakoa edo gehitutakoa marrazten da aurrean, eta talde baten gorputzak ez du inoiz beste talde baten titulu-barra estaltzen. Ordena ez da gordetzen; beraz, berriro irekitako diagrama batek taldeak gehitu ziren ordenan pilatzen ditu.  
Taldeak ERD oihalean, minimapan eta esportatutako irudietan agertzen dira, eta [Arakatzaileak](./explorer.md) zerrendatzen ditu. Ikus [Talde batera joatea](#going-to-a-group). [Bisualizazioa](./visualization.md) fitxak ez du talderik ez taldeen kolorerik marrazten, ez modu batean ez bestean.

Kodetze-agente batek ere sor eta alda ditzake taldeak, eta aukeratutako taldeen DDLa irakur dezake. Ikus [Taula-taldeak](../../mcp/tools.md#table-groups) MCP tresnetan.

![Talde-marrazketa ⌥ + G lasterbidearekin prest jartzea, orders eta payments gainean marraztea, Billing izena ematea, order_items barrura askatzea, eta ondoren taldea mugitzea eta tamainaz aldatzea](/img/demo-table-group.webp)

## Talde bat sortzea {#creating-a-group}

Bi modu daude talde bat sortzeko, bakoitza bere lasterbidearekin. Bietako bat ere ez da eskaintzen irakurtzeko soilik dagoen editore batean edo taldeak [ezkutatuta](#hiding-groups) dauden bitartean, eta orduan haien lasterbideek ez dute ezer egiten.  
Oihaleko beste lasterbideek bezala, ERD fitxan soilik funtzionatzen dute, eta ez dute funtzionatzen gelaxka bat, ohar bat edo talde baten izena editatzen den bitartean. Ikus [Lasterbideak](./settings.md#shortcuts).

### Talde bat marraztea {#drawing-a-group}

Egin klik [oihaleko tresna-barrako](./table-related-functions.md#canvas-toolbar) `New Table Group` botoian, sakatu `Alt + G` (Windows/Linux) edo `⌥ + G` (Mac), edo aukeratu `New Table Group` oihalaren laster-menuan, `New Table` eta `New Memo` aukeren ondoren, edo ERD fitxako [Bilaketa azkarrean](./quick-search.md). Ondoren, arrastatu koadro bat oihalaren gainean.  
Botoiak eta lasterbideak marrazketa aktibatu eta desaktibatu egiten dute; beraz, marrazketa prest dagoen bitartean bietako edozein sakatzeak amaitu egiten du, nola hasi den gorabehera. Laster-menuko aukerak eta Bilaketa azkarrak hasi baino ez dute egiten. Marrazketa hasteak esku-tresna desaktibatzen du eta marrazten ari den erlazio bat bertan behera uzten du.  
Marrazketa prest dagoen bitartean, kurtsorea gurutze-formakoa da, eta sakatze batek koadroa hasten du sakatzen den lekuan, baita taula baten gainean ere, azpian dagoena hautatu edo mugitu beharrean. Orduan, oihaleko tresna-barrak `New Table Group` botoia markatzen du, ez esku-tresna ezta hautapen-tresna ere.

Askatzean, talde bat gehitzen da koadro horretan, inoiz ez `160px` zabalera eta `100px` altuera baino txikiagoa, titulu-barra barne, arrastatzea oso laburra izanda ere. Arrastatu gabeko klik batek `480px` zabalerako eta `320px` altuerako talde bat gehitzen du, goiko ezkerreko izkina klikaren lekuan duela.  
Erdigunea koadro berriaren barruan duen talderik gabeko taula oro taldean sartzen da. Dagoeneko beste talde batean dagoen taula bertan geratzen da.

Saguaren erdiko botoiak oihalaren ikuspegia mugitzen du oraindik, eta marrazketa prest uzten du. Hauek marrazketa amaitzen dute talderik gehitu gabe:

- `Escape`, edo `Alt + G` (Windows/Linux) edo `⌥ + G` (Mac), sakatu baino lehen edo arrastatzean. Sakatu baino lehen, hautapena dagoen bezala uzten dute; koadroa hasten duen sakatzeak kendu du jada hautapena.
- Eskuineko klik bat, hautapena kentzen duena. Ez da laster-menurik irekitzen.
- Esku-tresnara aldatzea `Space` teklarekin edo oihaleko tresna-barrarekin, tresna-barrako hautapen-tresnan edo `New Table Group` botoian klik egitea, edo erlazio bat hastea.
- Beste fitxa batera aldatzea, taldeak ezkutatzea, edo editorea irakurtzeko soilik bihurtzea.

### Hautatutako taulak taldekatzea {#grouping-selected-tables}

Hautatu taula bat edo gehiago eta sakatu `T` eta ondoren `G`, edo aukeratu `Group selected tables` taula baten laster-menuan edo `Group Selected Tables` Bilaketa azkarrean; Bilaketa azkarrak taula bat hautatuta dagoen bitartean zerrendatzen du.  
Talde berria hautatutako taulen inguruan marrazten da, alde guztietan `24px` tarterekin eta titulu-barra gainean duela. Hautatutako taula bakoitza bertan sartzen da eta lehen zegoen taldea uzten du, eta utzitako taldeak bere horretan jarraitzen du, orain hutsik egon arren. Hautapeneko oharrak alde batera uzten dira.

`T` eta ondoren `G` tekla aldatzailerik gabeko bi sakatze dira; `G` tekla `T` sakatu eta segundo bateko epean sakatzen da. Taularik hautatuta ez badago, ez du ezer egiten, eta testu-eremu batean, adibidez Arakatzaileko Bilatu eremuan, bi letrak idazten ditu.

![categories eta products T eta ondoren G lasterbidearekin taldekatzea, taldeari Catalog izena ematea, eta ondoren bere menutik bioletaz koloreztatzea, bi goiburuek kolore hori har dezaten](/img/demo-table-group-selected.webp)

Bi moduetan, talde berriak ez du ez izenik ez kolorerik. Bera bakarrik hautatzen da, eta haren izen-editorea titulu-barraren gainean irekitzen da, izena berehala idatz dezazun. Ikus [Talde bati izena ematea](#naming-a-group).  
Taldea eta bertan sartzen diren taulak desegite-urrats bat dira, eta idazten duzun izena beste bat.

## Talde bati izena ematea {#naming-a-group}

Talde baten izena titulu-barraren gainean irekitzen den eremu batean editatzen da. Eremua berez irekitzen da talde bat sortzen denean, eta titulu-barran klik bikoitza eginda eta taldearen laster-menuko `Rename` aukerarekin ere irekitzen da.  
`Enter` teklak, edo beste nonbait klik egiteak, izena gordetzen du. `Escape` teklak eremua ixten du izena aldatu gabe eta taldea hautatuta uzten du, eta `Escape` berriro sakatzeak hautapena kentzen du.  
Izen-aldaketa bat desegite-urrats bat da; izena aldatu gabe gordetzeak ez du ezer erregistratzen. Izena hutsik badago edo zuriuneak baino ez baditu, `unnamed` erakusten da.  
Eremua irekita dagoen bitartean, oihaleko lasterbideek ez dute funtzionatzen, eta Bilaketa azkarraren eta `Toggle Explorer` komandoaren lasterbideek ez dute ezer egiten, taula-gelaxka bat editatzen den bitartean bezala.

[Bilatu eta ordeztu](./find-and-replace.md#what-it-searches) funtzioak taldeen izenak bilatzen ditu `Table group names` aukerarekin, taldeak erakusten diren bitartean, eta bertako `Replace` eta `Replace All` botoiek taldeei izena aldatzen diete. Ikus [Ordeztea](./find-and-replace.md#replacing). [Bilaketa azkarrak](./quick-search.md#searching-the-diagram) ez ditu taldeen izenak bilatzen.

## Talde bat koloreztatzea {#coloring-a-group}

Aukeratu `Color` taldearen laster-menuan kolore-hautatzailea taldearen kolorea hautatuta duela irekitzeko.  
Taulekin eta oharrekin bezala, hautatzaileak hautatutako taula, ohar eta talde guztiak koloreztatzen ditu, eta menuko `Remove color` aukerak, edo hautatzaileko `No color` aukerak, guztiei kentzen die kolorea. Ikus [Taulen eta oharren kolorea ezartzea](./table-related-functions.md#table-and-memo-color-specification). Taldearen kolorea hautatzaileko `Document colors` atalean ere eskaintzen da.

Talde koloreztatu batek titulu-barra eta inguru-marra kolore horretan marrazten ditu, eta gorputza kolore horren tonu zurbil batean. Kolorerik gabeko talde batek gaiaren gris-tonu neutroak erabiltzen ditu.  
Talde koloreztatu bateko taula bakoitzak taldearen kolorea darama goiburu osoan, eta bere kolorea mantentzen du ezkerreko ertzean; beraz, biak ikusten dira.  
Goiburu horietako testua eta botoiak zuri bihurtzen dira, edo beltz kolore argi batean, beltza askoz hobeto irakurtzen den kasuetan; gauza bera gertatzen zaie taldearen titulu-barrako izenari, ikonoari eta `x` ikurrari. Hautatzailearen kolore aurrezarrien artean, Orange, Amber, Yellow eta Lime koloreek beltza hartzen dute, eta gainerakoek zuria.  
Taulak bere goiburua mantentzen du bere taldeak kolorerik ez duen bitartean, taldeak ezkutatuta dauden bitartean, `70%` edo gutxiagoko zoomean, taulak izenera murrizten diren mailan, eta Bisualizazioa fitxan.

Kolore-aldaketa [desegite-historian](./undo-redo.md#one-gesture-one-step) erregistratzen da, taulen eta oharren kasuan bezala.

## Taldeak hautatzea {#selecting-groups}

Egin klik talde baten titulu-barran taldea bakarrik hautatzeko, edo egin `Ctrl + click` (Windows/Linux) edo `⌘ + click` (Mac) hautapenari gehitzeko.  
Dagoeneko hautatuta dagoen talde baten titulu-barra sakatzeak hautapen osoa mantentzen du; beraz, ondorengo arrastatze batek hautapen osoa mugitzen du.  
Titulu-barra sakatzeak, edo taldean eskuineko klik egiteak, taldea beste taldeen aurrera ekartzen du, eta bere taulak beste taula eta ohar guztien aurrera.

Gorputza, titulu-barraren azpiko eremua, oihala da saguaren ezkerreko botoiarentzat: arrastatzeak ikuspegia mugitzen du, `Ctrl + drag` (Windows/Linux) edo `⌘ + drag` (Mac) ekintzak hautapen-lauki bat marrazten du, eta klik batek hautapena kentzen du. Gorputzaren gaineko taulek, oharrek eta erlazio-marrek ohi bezala erantzuten diote erakusleari.

Hautapen-lauki batek talde bat hartzen du taldearen koadro osoa inguratzen duenean soilik; beraz, talde baten barruan marraztutako lauki batek taulak hautatzen ditu, taldea gabe. Ikus [Hautapen anitza](./table-related-functions.md#multiple-selection).  
`Ctrl + A` (Windows/Linux) edo `⌘ + A` (Mac) lasterbideak ez du inoiz talderik hautatzen.

Taldearen laster-menuko `Select tables` aukerak hautapena taldearen taulekin ordezten du, taldea bera kanpoan utzita; beraz, hurrengo komandoak taulei bakarrik eragiten die.  
Erabili aukera hori taulei soilik eragiten dieten komandoen aurretik, adibidez kopiatzea edo [taulak fokuratzea](./table-related-functions.md#focusing-on-tables), hautatutako talde bat alde batera uzten baitute.

Hautatutako talde baten inguru-marra hautapen-kolorera aldatzen da. [Elkarlaneko saio](../../api/advanced/collaborative-editing.md) batean, beste parte-hartzaile batek hautatzen duen taldea parte-hartzaile horren kolorez inguratzen da.

## Talde batera joatea {#going-to-a-group}

[Arakatzaileak](./explorer.md#the-tree) taldeak bere `Table Groups` karpetan zerrendatzen ditu, izenaren arabera, bakoitza bere taulekin azpian. Bilaketa azkarrak ez du talderik zerrendatzen.

Arakatzaileko talde-errenkada bat, talde baten izeneko [Bilatu eta ordeztu](./find-and-replace.md#going-to-a-match) bat-etortze bat edo [Diferentzia-ikustailearen](./table-related-functions.md#the-change-tree) zerrendako talde-errenkada bat aukeratzeak talde horretara eramaten du.  
Jauziak taldearen koadroa ikusgai jartzen du, eta titulu-barra hartzen du oinarri koadroa oihala baino altuagoa denean. Ikus [Jauziaren helmuga](./table-related-functions.md#where-a-jump-lands). Ondoren, taldea bakarrik hautatzen du eta aurrera ekartzen du bere taulekin, titulu-barra sakatzeak egiten duen bezala.  
Taldeak [ezkutatuta](#hiding-groups) dauden bitartean, edo taldea kendu ondoren, hartara joateak ez du ezer egiten.  
Diferentzia-ikustailean, alde bakoitza taldera joaten da bere dokumentuak taldea duenean eta erakusten duenean soilik. Ikus [Aldaketa batera joatea](./table-related-functions.md#going-to-a-change).

## Talde bat mugitzea eta tamainaz aldatzea {#moving-and-resizing-a-group}

Arrastatu talde bat bere titulu-barratik, bere taula guztiekin mugitzeko.  
Taldea hautapen handiago baten parte bada, hautapen osoa mugitzen da berarekin, eta hautatuta dagoen eta taldean ere dagoen taula behin bakarrik mugitzen da.  
Arrastatzea erakuslea tarte labur bat mugitu ondoren baino ez da hasten; beraz, titulu-barran egindako klik edo klik bikoitz bat klik izaten jarraitzen du. Titulu-barran `Alt + drag` egiteak taldea mugitzen du, arrastatze arrunt batek bezala; talde bat ez da inoiz bikoizten.  
Mugimendua, berarekin daramatzan taula guztiekin, desegite-urrats bat da.

Taula bat bakarrik arrastatzeak taula hori bakarrik mugitzen du, eta talde batera sar edo talde batetik atera dezake. Ikus [Taulak gehitzea eta kentzea](#adding-and-removing-tables).

Talde orok tamaina aldatzeko heldulekuak ditu bere lau ertzetan eta lau izkinetan, hautatuta egon ala ez, ohar batek bezala.  
Arrastatu heldulekuetako bat saguaren ezkerreko botoiarekin: koadroak erakusleari jarraitzen dio, eta tamaina berria askatzean gordetzen da, desegite-urrats bat bezala.  
Talde bat ezin da `160px` bider `100px` baino txikiagoa egin, ezta bere taulak, haien `24px` tartea eta titulu-barra baino txikiagoa ere. Ertza hor gelditzen da, erakuslea nahi bezain urrun eraman arren.

## Taulak gehitzea eta kentzea {#adding-and-removing-tables}

Taula bat talde batean sartzen edo talde batetik irteten da, askatzen duzun lekuaren arabera.  
Taulak arrastatu eta askatzean, hautatutako talde batek eramaten ez duen arrastatutako taula bakoitza bere erdigunearen arabera ebaluatzen da. Erdigunea bere koadroan duen talde goienean sartzen da, edo bere taldetik irteten da erdigunea ez badago inongo talderen koadroan. Talde goiena aurrean marrazten dena da.  
Arrastatzeak bere lekuan uzten duen talde batek arrastatzea hastean zuen koadroa mantentzen du; beraz, bere taldearen barruan apur bat mugitutako taula taldean geratzen da, eta taldetik irteteko, erdigunea koadro horretatik kanpo egon arte arrastatu behar da.  
Arrastatzen duzun bitartean, askatzeak taula bat sartuko lukeen talde bakoitza inguru-marraz nabarmentzen da.

Azken mugimendutik `200ms` inguruko epearen barruan askatzen baduzu, talde-aldaketa arrastatzearen desegite-urratsaren parte da; beraz, desegite bakar batek taulak zeuden lekura eta zeuden taldeetara itzultzen ditu. Askatu aurretik pausa luzeagoa eginez gero, talde-aldaketa bere urrats propioa da. Ikus [Keinu bat, urrats bat](./undo-redo.md#one-gesture-one-step).  
Klik batek, edo pixel gutxiko arrastatze batek, ez du talderik aldatzen, eta taldeak ezkutatuta dauden bitartean ez da ezer taldez aldatzen.

Talde batek zer taula dituen aldatzeko beste moduak:

- Taula baten laster-menuko `Remove from group` aukerak hautatutako taula guztiak ateratzen ditu beren taldetik. Hautatutako taula bat talde batean dagoen bitartean agertzen da, baita taldeak ezkutatuta daudenean ere, eta desegite-urrats bat da.
- `Group selected tables` aukerak hautatutako taulak talde berri batera eramaten ditu. Ikus [Hautatutako taulak taldekatzea](#grouping-selected-tables).
- Talde bat kentzeak bere taulak talderik gabe uzten ditu.

Itsatsitako taula bat, edo `Alt` teklarekin bikoiztutakoa, ez dago inongo taldetan, nahiz eta talde baten koadroaren barruan geratu. Gero arrastatzean, askatzearen araua aplikatzen da.

## Talde bat kentzea {#removing-a-group}

Talde bat kentzeak ez ditu inoiz bere taulak kentzen: dauden lekuan geratzen dira, talderik gabe.

- Titulu-barraren amaierako `x` ikurrak, erakuslea taldearen gainean dagoen bitartean agertzen denak, talde hori bakarrik kentzen du.
- Taldearen laster-menuko `Delete` aukerak taldea kentzen du. Taldea hautatutako hainbat elementutako bat denean, aukerak `Delete selected` dio eta hautatutako guztia kentzen du: taulak, oharrak eta taldeak.
- Taldeak hautatuta daudenean, `Delete` edo `Backspace` teklak hautatutako taldeak kentzen ditu, hautatutako taula eta oharrekin batera, baita `Ctrl + Backspace` eta `Ctrl + Delete` (Windows/Linux) edo `⌘ + Backspace` eta `⌘ + Delete` (Mac) lasterbideek ere. Ikus [Taulak eta oharrak ezabatzea](./table-related-functions.md#table-and-memo-deletion).

Kentze bakoitza desegite-urrats bat da, eta urrats hori desegiteak taldea itzultzen du, bere taulak barruan dituela.

## Taldearen menua {#the-group-menu}

Egin eskuineko klik talde baten titulu-barran, gorputzean edo ertzean haren menua irekitzeko. Mac batean, `Ctrl + click` eginez ere irekitzen da, baita ukipen-pantaila batean luze sakatuz ere.  
Eskuineko klikak taldea hautatzen du lehenik, bakarrik, hautapenaren parte ez bazen jada; beraz, `Color` eta `Delete selected` aukerek hautapeneko gainerako elementuei eragiten diete taldea hautapenean zegoenean soilik.

- `Select tables`: taldearen taulak bakarrik hautatzen ditu. Ikus [Taldeak hautatzea](#selecting-groups).
- `Rename`: izen-editorea irekitzen du. Ikus [Talde bati izena ematea](#naming-a-group).
- `Color`: kolore-hautatzailea irekitzen du. Ikus [Talde bat koloreztatzea](#coloring-a-group).
- `Remove color`: hautatutako zerbaitek kolorea duen bitartean agertzen da.
- `Delete`, edo `Delete selected` taldea hautatutako hainbat elementutako bat denean, `Delete` tekla eskuinean erakusten duela. Ikus [Talde bat kentzea](#removing-a-group).

Taula baten laster-menuak `Group selected tables` eta `Remove from group` aukerak gehitzen ditu `Color` eta `Remove color` aukeren ondoren, bere Delete aukeraren aurretik, eta oihalaren laster-menuak `New Table Group` aukera gehitzen du.  
`Group selected tables` aukerak bere teklak erakusten ditu eskuinean, `T` eta ondoren `G`, eta `New Table Group` aukerak `Alt + G` (Windows/Linux) edo `⌥ + G` (Mac) erakusten du.

## Taldeak ezkutatzea {#hiding-groups}

Oihalaren laster-menuko `View Option` → `Table Groups` aukerak talde guztiak erakusten edo ezkutatzen ditu. Lehenespenez markatuta dago. Ikus [Taulen ikuspegi-aukerak](./table-related-functions.md#table-view-options).  
Markatu gabe dagoenean, taldeen koadroak eta taulen goiburuetako taldeen koloreak desagertu egiten dira oihaletik, minimapatik eta esportatutako irudietatik, eta korritze-barrek eta minimapak jada ez diete lekurik egiten taldeei. Ez da ezer mugitzen ezta tamainaz aldatzen ere, eta taula bakoitza bere taldean geratzen da.  
Taldeak ezkutatzeak haien hautapena kentzen du, `New Table Group` marrazketa bat amaitzen du, eta irekita dagoen izen-editorea ixten du.

Taldeak ezkutatuta dauden bitartean:

- Menuek ez dituzte `New Table Group` eta `Group selected tables` aukerak eskaintzen, ezta Bilaketa azkarrak `New Table Group` eta `Group Selected Tables` ere, eta oihaleko tresna-barrak ez du `New Table Group` botoia erakusten. `Remove from group` aukera eskaintzen da oraindik.
- `Alt + G` (Windows/Linux) edo `⌥ + G` (Mac) lasterbideak ez du ezer egiten, ezta `T` eta ondoren `G` lasterbideak ere.
- Taulak arrastatzeak ez du talderik aldatzen, eta hautapen-lauki batek ez du talderik hartzen.
- Arakatzaileak ez du `Table Groups` karpeta erakusten, eta Bilatu eta ordeztu funtzioak ez ditu taldeen izenak ez bilatzen ez ordezten, `Table group names` aukera aktibatuta egonda ere.
- [Antolaketa automatikoak](#auto-layout) talde bakoitzaren taulak elkarrekin mantentzen ditu oraindik, SQL eskema fitxak [aukeratzeko taldeak](#schema-sql-by-group) eskaintzen ditu oraindik, DBMLak taldeak idazten ditu oraindik, eta [Inportatu eta gehitu](./file-import-export.md#import-and-add) ekintzak edukia ezkutatutako koadroen azpian kokatzen du oraindik.

Aukera dokumentuan gordetzen da eta [desegite-historian](./undo-redo.md#what-the-history-records) erregistratzen da, beste View Option etengailuak bezala. Irakurtzeko soilik dagoen editore batean pantaila horretan geratzen da horren ordez. Ikus [Irakurtzeko soilik dauden editoreak](#read-only-editors).

## Antolaketa automatikoa {#auto-layout}

[Antolaketa automatikoaren](./table-related-functions.md#auto-layout) modu guztiek talde bakoitzaren taulak elkarrekin mantentzen dituzte, taldeak erakusten diren ala ez.

- `Force` moduak talde bakoitza bere taulekin koadro bakar gisa mugitzen du, taulek beren lekua barruan mantentzen dutela, eta talde bakoitzaren koadroa gutxienez `100px` distantziara mantentzen du beste taldeetatik eta talderik gabeko tauletatik. Aurrebistak talde bakoitza joango den lekuan erakusten du.
- `Flow`, `Tree - vertical` eta `Tree - horizontal` moduek talde bakoitzaren taulak taldearen barruan antolatzen dituzte, eta taldeak haien arteko erlazioen arabera kokatzen dituzte, talderik gabeko taulak haien inguruan antolatuta.

Ondoren, taulak dituen talde bakoitza haietara egokitzen da: bere koadroak taulen mugak hartzen ditu, `24px` tartea eta titulu-barra gehituta. Taularik gabeko talde batek bere kokapena eta tamaina mantentzen ditu.  
Taulak eta taldeak desegite-urrats bakar batean kokatzen dira.

DBML inportazio batek talde bakoitza bere taulen inguruan egokitzen du modu berean, taulak non kokatzen diren gorabehera. Ikus [DBML](./file-import-export.md#dbml).

## SQL eskema taldeka {#schema-sql-by-group}

[SQL eskema](./schema-sql.md) fitxak aukeratutako taldeen taulak bakarrik idatz ditzake.  
Dokumentuak talderen bat duen bitartean, erakutsita edo ezkutatuta, fitxaren aukeren panelak `Tables` errenkada bat erakusten du `This window only` atalaren azpian, kontrol-lauki batekin `All` aukerarako, beste bat talde bakoitzerako, eta beste bat `No group` aukerarako, hau da, talderik gabeko tauletarako. Ikus [Taulak](./schema-sql.md#tables).  
Aukera editorearen leihoari dagokio, eta ez da dokumentuan gordetzen.

## Inportazioa, esportazioa eta kopiatzea {#import-export-and-copying}

- DBMLak taldeak bi noranzkoetan mantentzen ditu. DBML inportazio batek `TableGroup` bloke bakoitza talde bihurtzen du. Ikus [DBML](./file-import-export.md#dbml). Kode-sortzailearen `DBML` helburuak `TableGroup` bloke bat idazten du taula bat duen talde bakoitzeko. Ikus [Kode-sortzailea](./code-generator.md#language).
- JSON fitxategi batek bere taldeak mantentzen ditu. Beste ezein formatuk ez ditu taldeak gordetzen: SQL, GraphQL eta AML inportazioek ez dute talderik ekartzen, eta SQL eskemak eta Kode-sortzailearen beste helburuek ez dute talderik idazten.
- [Inportatu eta gehitu](./file-import-export.md#import-and-add) ekintzak fitxategi baten taldeak talde berri gisa ekartzen ditu, beren taulak barruan dituztela, eta taula berriekin batera hautatzen ditu taldeak erakusten diren bitartean; beraz, gehitutako multzoa arrastatzeak bere taldeak ere eramaten ditu.
- [Esportatutako irudi](./file-import-export.md#image) batek erakutsitako taldeak taulen atzean marrazten ditu, taldeen koloreak taulen goiburuetan dituela.
- Kopiatzeak eta itsasteak, edo `Alt` teklarekin bikoizteak, ez du inoiz talderik kopiatzen. Ikus [Taulak eta oharrak kopiatzea/itsastea](./table-related-functions.md#copyingpasting-tables-and-memos) eta [Taulak gehitzea eta kentzea](#adding-and-removing-tables).

## Irakurtzeko soilik dauden editoreak {#read-only-editors}

[`readonly`](../../api/erd-editor-element.md#readonly) atributua duen editore batean, taldeak ohi bezala marrazten dira eta Arakatzailean zerrendatzen dira, eta haietara joan daiteke, baina ezin dira aldatu:

- [Talde batera joateak](#going-to-a-group) hautatu egiten du, eta hori da bertan talde bat hautatzeko modu bakarra. Titulu-barra sakatzeak ez du ezer hautatzen ez mugitzen: arrastatuta, oihala mugitzen du, eta mugitzen ez den klik batek jauzi batek utzitako hautapena kentzen du.
- Ez dago tamaina aldatzeko heldulekurik, ezta `x` ikurrik ere, eta titulu-barran klik bikoitza egiteak ez du izen-editorerik irekitzen.
- Talde batean egindako eskuineko klik batek ez du menurik irekitzen, eta taularen menuak `Table Properties` aukera bakarrik du.
- Oihalaren menuak ez du `New Table Group` aukerarik, eta Bilaketa azkarrak ez du talde-komandoetako bat ere zerrendatzen. `New Table Group` marrazketa bat amaitu egiten da editorea irakurtzeko soilik bihurtzen denean.
- [Oihaleko tresna-barrak](./table-related-functions.md#canvas-toolbar) ikuspegi-kontrolak soilik mantentzen ditu; beraz, ez du `New Table Group` botoirik, eta `Alt + G` (Windows/Linux) edo `⌥ + G` (Mac) lasterbideak ez du ezer egiten, ezta `T` eta ondoren `G` lasterbideak ere.
- Editorea irakurtzeko soilik bihurtzen denean abian dagoen taulen edo talde baten arrastatzea dagoen tokian gelditzen da eta ez du talderik aldatzen, eta abian dagoen talde baten tamaina-aldaketa tamaina aldatu gabe amaitzen da.
- `View Option` → `Table Groups` aukerak taldeak pantaila horretan bakarrik erakusten edo ezkutatzen ditu, bertan View Option guztiek egiten duten bezala: dokumentuak, lankideek eta desegite-historiak aukera lehen zegoen bezala mantentzen dute, eta editorea berriro idazgarri bihurtzeak dokumentuaren aukera itzultzen du.
- SQL eskema fitxako `Tables` aukeraketak funtzionatzen du oraindik.
