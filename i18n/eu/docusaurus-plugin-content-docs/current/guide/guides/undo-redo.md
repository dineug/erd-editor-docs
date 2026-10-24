---
sidebar_position: 15
description: Edizioak desegitea eta berregitea, historiak zer erregistratzen duen, Hiztegiaren orrien historia propioak, eta diagramaren historian urratsez urrats ibiltzea Denbora-bidaiarekin.
---

# Desegin eta berregin

Aurreko edizio-egoera batera itzul zaitezke, edo geroagoko batera aurrera egin.  
Historiak `2048` aldaketa gordetzen ditu gehienez.

- Desegin: `Ctrl + Z` (Windows/Linux) edo `⌘ + Z` (Mac)
- Berregin: `Ctrl + Shift + Z` (Windows/Linux) edo `⌘ + Shift + Z` (Mac)

ERD fitxan, tresna-barrak bi komando berberak ditu `Undo` eta `Redo` botoi gisa, `Time Travel` botoiaren ondoan. Hiztegia fitxan `Undo` eta `Redo` erakusten ditu, `Time Travel` botoirik gabe, eta beste ezein fitxak ez ditu erakusten.  
Desegiteko edo berregiteko zerbait dagoenean bakarrik agertzen dira aktibo. `readonly` atributua duen editore batek ezkutatu egiten ditu, eta lasterbideek ez dute ezer desegiten ez berregiten.

Desegiteak eta berregiteak ERD fitxan bakarrik eragiten dute diagramaren historian.  
Lasterbideek ez dute han funtzionatzen Bilaketa azkarra, `Table Properties`, `Diff Viewer`, `Auto Layout` aurrebista, [`Export image`](./file-import-export.md#image) elkarrizketa-koadroa, [Mapatu zutabeak](./relationship-editing.md#map-columns) edo Denbora-bidaia irekita dagoen bitartean.  
Funtzionatzen jarraitzen dute teklatua [Arakatzaileko](./explorer.md#keys-in-the-explorer) edozein lekutan dagoen bitartean, haren zuhaitza barne, eta [kolore-hautatzailea](./table-related-functions.md#table-and-memo-color-specification) irekita dagoen bitartean. Testu-kurtsorea haien eremuetako batean egonda ere, adibidez Bilatu, Ordeztu edo `Hex` eremuan, diagrama desegin eta berregiten dute, eremuko testua beharrean.

Beste fitxetan:

- Hiztegia: erakusten den orriko (`Domains`, `Words` edo `Terms`) edizioak desegin eta berregiten dituzte, orri horren historia propiotik, inoiz ez diagramarenetik. `Checks` orrian ez dute ezer egiten. Ikus [Hiztegiaren orriak](#dictionary-sheets).
- Bisualizazioa: `Flow` moduan, tekla berek atzera eta aurrera egiten dute Fluxuak erakutsi dituen ikuspegietan zehar, `Previous table` eta `Next table` botoiek bezala, baita `readonly` atributua duen editore batean ere. Han ez dute inoiz diagrama desegiten ez berregiten. Ikus [Aurreko taula eta hurrengo taula](./visualization.md#previous-table-and-next-table). `Graph` moduan ez dute ezer egiten.
- SQL eskema, Kode-sortzailea eta Ezarpenak: ez daude erabilgarri. SQL eskema fitxako `Before tables` eta `After tables` eremuetan, tekla berek eremuan idatzitakoa desegin eta berregiten dute horren ordez.

Historia memorian mantentzen da, uneko saiorako. Ez da dokumentuan gordetzen; beraz, diagrama bat berriro irekitzean historia hutsik hasten da.

![Taula bat mugitzea eta zutabe bat ⌥ + Backspace lasterbidearekin kentzea, eta ondoren biak ⌘ + Z lasterbidearekin desegitea eta ⌘ + Shift + Z lasterbidearekin berregitea](/img/demo-undo-redo.webp)

## Historiak zer erregistratzen duen {#what-the-history-records}

Erregistratzen dira:

- Taulak eta oharrak: gehitzea, kentzea, mugitzea eta kolorea; taularen izena, izen logikoa eta iruzkina; oharraren testua eta tamaina.
- Taula-taldeak: gehitzea, kentzea, mugitzea, tamaina aldatzea, izena, kolorea, eta taula bakoitza zein taldetan dagoen. Ikus [Taula-taldeak](./table-groups.md).
- Zutabeak: gehitzea, kentzea, ordena aldatzea, izen logikoa, bakoitza lotuta dagoen domeinua, eta zutabe-aukera guztiak.
- Hiztegiek eratortzen dituzten izen fisikoak, eta izen bakoitza zuk idatzitakoa ala hiztegiena den: desegite batek izena eta egoera hori batera itzultzen ditu. Ikus [Zuk idatzitako izenak](./dictionary.md#names-of-your-own).
- `Derive Physical Name Again` eta `Derive Physical Names Again` aukerak. Ikus [Izen fisikoak berriro eratortzea](./dictionary.md#derive-physical-names-again).
- Erlazioak: gehitzea, kentzea, mota aldatzea, [Mapatu zutabeak](./relationship-editing.md#map-columns) elkarrizketa-koadroan ezarritako zutabeak, eta `On Delete` edo `On Update` aukeretan egindako hautaketa bakoitza. Ikus [ON DELETE eta ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Kentze bat desegiteak erlazioa itzultzen du, bere ON DELETE eta ON UPDATE ekintzekin.
- Indizeak eta haien zutabeak.
- Ikuspegiaren kokapena, zoom-maila eta `View Option` menuko etengailuak.
- SQL eskema fitxako `Before tables` eta `After tables` scriptak, urrats bat eremutik irtetean aplikatzen duzun edizio bakoitzeko. Ikus [Taulen aurreko eta ondorengo scriptak](./schema-sql.md#before-and-after-scripts).
- Fitxategi bat inportatzea, eta bat gehitzea [`Import and Add`](./file-import-export.md#import-and-add) aukerarekin.

Ez dira erregistratzen:

- Datu-base hornitzailea eta datu-basearen izena.
- Kode-sortzailearen lengoaia, `Table Name Case` eta `Column Name Case`.
- Mugatzaile mota, dela SQL eskema fitxan ezarrita, dela Kode-sortzailea fitxan.
- SQL eskema fitxako `Statements`, `Header`, `Write logical names into empty comments` eta `Tables` aukerak, editore-leihoari dagozkionak. Ikus [Aukeren panela](./schema-sql.md#options-panel).
- Ezarpenak fitxako guztia, [`Lock`](./settings.md#lock) errenkadak barne.
- Izenen ikuspegia aldatzea, haren edozein lekutatik, haren blokeoa aktibatuta egon ala ez. Ikus [Ikuspegia aldatzea](./logical-names.md#switching-the-view).
- Gaia eta bistaratze-hizkuntza. Ikus [Hizkuntza eta gaia](./language-and-theme.md).
- Zein taula, ohar edo talde marrazten den besteen aurrean.
- [Arakatzailea](./explorer.md): hura irekitzea, ixtea edo tamainaz aldatzea, haren zuhaitza tolestea, eta bilaketa-testua eta bilaketa-aukerak. `Replace` eta `Replace All` ekintzek aldatzen dutena erregistratu egiten da, ordea, baita jauzi batek egiten duen korritzea ere. Ikus [Keinu bat, urrats bat](#one-gesture-one-step).
- Zooma eta ikuspegia mugitzea Bisualizazioa fitxan, bi moduetako edozeinetan, grafoaren nodoak edo Fluxuko txartelak mugitzea, `Tidy Up` botoia, errenkaden bistaratzea, taulak fokuratzea, eta `Previous table` eta `Next table` botoiekin urratsez urrats ibiltzea. Ikus [Fluxuak ez du inoiz dokumentua editatzen](./visualization.md#flow-never-edits-the-document).
- Hiztegia fitxan erakusten den orria, eta orri bakoitzaren bilaketa, hautapena, korritzea eta zutabeen zabalerak. Ikus [Fitxa irekitzea](./dictionary.md#opening-the-tab).

Hauetako edozein aldatzea ezin da desegin.

Hiztegia fitxan egindako edizioak desegin daitezke, baina beren orriaren historiara joaten dira, ez honetara; beraz, ERD fitxako desegiteak ez du inoiz halakorik leheneratzen, ezta domeinu baten `Data Type` berria eta horrek aldatzen dituen zutabe-motak ere. Ikus [Hiztegiaren orriak](#dictionary-sheets).

Beste editore batetik iristen diren aldaketak ere ez dira erregistratzen; beraz, desegiteak zure aldaketak bakarrik leheneratzen ditu. [Elkarlaneko saio](../../api/advanced/collaborative-editing.md) batean, editore bakoitzak bere aldaketak desegiten ditu, eta [MCP zerbitzariaren](../../mcp/live-and-headless.md#undo) bidez editatzen duen kodetze-agente batek bereak desegiten ditu `erd_undo` tresnarekin.

Diagrama osoa ordezten duen `Import` ekintza bat desegiteak aurreko diagrama itzultzen du, editoreak inportatu zenuenean zuen bezala, [blokeo](./settings.md#lock) bakoitza aktibatuta edo desaktibatuta eta balio blokeatu bakoitza orduan zeuden bezala.  
Diagrama horrek `Viewport` blokeatuta bazuen, ikuspegia eta zooma ikuspegi blokeatura itzultzen dira, diagrama irekitzen den lekura, zeunden lekura beharrean. `Viewport` desblokeatuta bazuen, inportatu zenuenean zeunden lekura itzultzen dira. Gainerako ezarpen blokeatuak, adibidez zauden fitxa, Kode-sortzailearen lengoaia edo Izenen ikuspegia, zure pantailan dauden bezala geratzen dira.  
Diagrama berri bat blokeo guztiak aktibatuta dituela hasten da. Desblokeatu `Viewport` inportatu aurretik, horrelako desegite batean zure ikuspegia mantentzeko. Ondoren desblokeatzeak, edo bere `Viewport` blokeoa desaktibatuta duen JSON fitxategi bat inportatzeak, ez du aldatzen desegiteak nora eramaten zaituen.

JSON fitxategi baten inportazioa desegiteak aurreko diagramak zituen hitzak, terminoak eta domeinuak ere itzultzen ditu. SQL eskema, GraphQL, DBML edo AML inportazio batek hiztegiak mantentzen ditu; beraz, haren desegiteak eta berregiteak dauden bezala uzten dituzte, ordutik Hiztegia fitxan egindako edizioak barne.

Zutabe bat domeinu bati berriro lotzen dion edo domeinu bati lotutako zutabe bat itzultzen duen ERD fitxako desegite edo berregite batek domeinuaren datu mota ematen dio zutabeari, orain dagoen bezala. Zutabe lotu batean beste mota bat itzultzen duenak zutabearen lotura kentzen du. Ikus [Domeinuak eta datu motak](./dictionary.md#domains-and-data-types).

## Keinu bat, urrats bat {#one-gesture-one-step}

Keinu bakar batek bidaltzen duen guztia historiako sarrera bakar bihurtzen da.  
Hainbat taula eta ohar aldi berean itsastea, edo `Alt + drag` keinuarekin bikoiztea, urrats bakar batean desegiten da.

`Delete` edo `Backspace` teklaren sakatze bat, edo laster-menu bateko `Delete selected` edo `Delete columns` aukera, urrats bat da, zenbat taula, ohar, taula-talde edo zutabe kentzen dituen gorabehera.  
Hautatutako hainbat zutaberen gako nagusia txandakatzea urrats bat da, dela `Alt + K` (Windows/Linux) edo `⌥ + K` (Mac) lasterbidearekin, dela taula baten laster-menuko `Primary Key on selected columns` aukerarekin.  
Hautapenaren kolorea ezartzea, edo `No color` edo `Remove color` aukerarekin kentzea, urrats bat da, zenbat taula, ohar eta talde dauden hautatuta gorabehera. Hautatutako guztiak dagoeneko duen kolore bat aukeratzeak ez du urratsik erregistratzen, ezta `No color` aukerak ere, hautatutako ezerk kolorerik ez duenean.  
[Mapatu zutabeak](./relationship-editing.md#map-columns) elkarrizketa-koadroko `Map` edo `Save` botoia urrats bat da, gehitzen dituen gako arrotzeko zutabeekin eta aldatzen dituen datu motekin batera.  
`Import and Add` ekintza urrats bat da, gehitutako blokea ikusgai jartzen duen korritzearekin batera, behar denean.

Izen logikoaren gelaxka baten azpiko zerrendatik termino bat aukeratzea urrats bat da: izen logikoa, hark eratortzen duen izen fisikoa, eta zutabe baten kasuan terminoaren domeinua bere datu motarekin. Ikus [Termino-izenak osatzea](./logical-names.md#completing-term-names).  
Zutabe baten Domain gelaxkan domeinu bat aukeratzea urrats bat da, zutabeari ematen dion datu motarekin eta [Erlazioen datu moten sinkronizazioak](./settings.md#relationship-datatype-sync) erlazioetan zehar hedatzen duenarekin batera. `None` aukeratzea, zutabearen lotura kentzen duena, urrats bat da hori ere. Ikus [Domain gelaxka](./logical-names.md#the-domain-cell). Zutabe lotu batean bere domeinuarena ez den datu mota bat idazteak zutabearen lotura kentzen du sarrera horren urratsean.  
`Derive Physical Name Again` edo `Derive Physical Names Again` aukera urrats bat da, zenbat izen, domeinu-lotura eta datu mota aldatzen dituen gorabehera. Ezer aldatzen ez duenean bakarrik ez du urratsik erregistratzen. Zuk idatzitako izen bat hiztegiei itzultzea aldaketa bat da, izenak hiztegiek ematen dutena dagoeneko duenean ere.

[Taula-talde](./table-groups.md) bat sortzea, marraztuz edo hautatutako taulak `Group selected tables` aukerarekin edo `T` eta ondoren `G` lasterbidearekin taldekatuz, urrats bat da, barnean hartzen dituen taula guztiekin batera. Talde bat kentzea urrats bat da, eta desegiteak taldea itzultzen du, bere taulak barruan dituela.  
Talde bat bere titulu-barratik arrastatzeak taldea eta haren taula guztiak urrats bakar batean mugitzen ditu. Talde batera edo talde batetik kanpora askatutako taulek arrastatzearen urrats berean aldatzen dute taldez, azken mugimendutik `200ms` inguruko epearen barruan askatzen baduzu; beraz, desegite bakar batek zeuden lekura eta zeuden taldeetara itzultzen ditu. Askatu aurretik pausa luzeagoa eginez gero, talde-aldaketa bere urrats propioa da, eta lehen desegiteak hori bakarrik leheneratzen du.  
Talde baten tamaina ertz batetik edo izkina batetik aldatzea behin erregistratzen da, askatzen duzunean.  
[Antolaketa automatikoa](./table-related-functions.md#auto-layout) aplikatzea urrats bat da, beren taulen inguruan egokitzen dituen taldeak barne.

[Bilatu eta ordeztu](./find-and-replace.md#replacing) funtzioko `Replace All` ekintza ere urrats bat da, zenbat taula-izen, zutabe-izen, izen logiko, indize-izen, taula-taldeen izen, iruzkin eta ohar aldatzen dituen gorabehera, izen logikoek eratortzen dituzten izen fisikoak eta domeinu-loturak barne. Ezer aldatzen ez duenean, `Preserve Case` aukerak bat-etortze guztiak zeuden bezala berridazten dituenean bezala, ez du urratsik erregistratzen.  
`Replace` ekintza bakar bat urrats bat da, izen logiko batek eratortzen duena eta hurrengo bat-etortzera korritzea barne, bat-etortze horrek behar duenean. Bere bat-etortzea zegoen bezala berridazten duenean, korritze hori bakarrik erregistratzen du, edo ezer ez, korritzerik ez dagoenean.  
Bat-etortze batera joateak oihala korritzen du bat-etortzea dagoeneko ondo ikusten ez denean bakarrik. Ikus [Jauziaren helmuga](./table-related-functions.md#where-a-jump-lands). Korritze hori ikuspegiaren kokapenaren beste edozein aldaketa bezala erregistratzen da; beraz, bat-etortzeetan zehar mugitu ondoren, desegiteak lehenik korritze horiek leheneratzen ditu, urrats bakoitzean bat.  
Oihalean amaitzen diren gainerako jauziek modu berean erregistratzen dituzte beren korritzeak: Arakatzaileko errenkada bat, Bilaketa azkarreko emaitza bat, Hiztegia fitxako `Checks` orrian taula bat edo zutabe bat izendatzen duen egiaztapen bat, edo Fluxuko kanpo-estekako [txartel-botoia](./visualization.md#card-buttons) aukeratzea. Ikuspegia dagoen lekuan uzten duen jauzi batek ez du ezer erregistratzen. `Diff Viewer` leihoaren zerrendan errenkada bat aukeratzeak ere ez du ezer erregistratzen, Diferentzia-ikustailearen irakurtzeko soilik diren aldeak baino ez baititu mugitzen.

Etengabeko arrastatze bat, oihalaren ikuspegi-mugimendu bat, zoom bat, atximur-keinu bat edo kolore-aldaketa bat `200ms` inguruz metatzen da, eta sarrera bakar bihurtzen da hori ere.  
Guztira `20px` baino gutxiago mugitzen den arrastatze batek ez du mugimendurik erregistratzen. Egiten duen talde-aldaketa bakarrik erregistratzen da, halakorik badago.

Gelaxka batean edo ohar batean idaztea idazketa-ekintza bakoitzeko erregistratzen da, ez keinu bakoitzeko: idatzitako karaktere bakoitza, itsaste bakoitza eta IME bidezko konposizio baten urrats bakoitza urrats propioa da.  
Izen logikoaren gelaxka bat modu berean erregistratzen da. Haren editorea ireki zenean zuen izen logikoaz bestelako batekin ixten denean, hiztegiek hartatik eratortzen duten izen fisikoa beste urrats bat da, idazketaren ondoren. Lehen desegiteak izen hori bakarrik leheneratzen du, termino batek ekarritako domeinu eta datu motarekin, eta zuk idatzitako izen logikoa uzten du. Ezer eratortzen ez denean, ez da ezer gehiago erregistratzen. Ikus [Izen logiko bat idaztea](./logical-names.md#writing-a-logical-name).  
Taula-talde baten izena behin erregistratzen da, `Enter` teklak edo eremutik irteteak gordetzen duenean; beraz, sortu berri duzun talde batean idazten duzun izena taldea sortzetik bereizitako urrats bat da. `Esc` teklak, edo aldatu gabe utzitako izen batek, ez du ezer erregistratzen.

## Hiztegiaren orriak {#dictionary-sheets}

Hiztegia fitxako `Domains`, `Words` eta `Terms` orriek historia propio bana dute, diagramarenetik bereizita. Fitxan egindako edizio bakoitza bere errenkadak idazten dituen orriaren historiara joaten da. Diagramarenak bezala, historia bakoitzak `2048` urrats gordetzen ditu gehienez, eta memorian mantentzen da saioan zehar.

- Teklatua fitxan dagoela, `Ctrl + Z` (Windows/Linux) edo `⌘ + Z` (Mac) lasterbideak erakusten den orriaren azken edizioa desegiten du, eta `Ctrl + Shift + Z` (Windows/Linux) edo `⌘ + Shift + Z` (Mac) lasterbideak desegindako azkena berregiten du.
- Tresna-barrako `Undo` eta `Redo` botoiek gauza bera egiten dute, eta erakusten den orriak desegiteko edo berregiteko ediziorik duenean bakarrik agertzen dira aktibo. Haiek sakatzeak teklatua zegoen lekuan uzten du, saretan edo bilaketa-eremuan. Fitxak ez du `Time Travel` botoirik.
- `Checks` orrian, ezer editatzen ez den lekuan, botoiak inaktibo geratzen dira, eta ez haiek ez teklek ez dute ezer egiten.
- Gelaxka-edizio bat irekita dagoela, edo testu-kurtsorea fitxako bilaketa-eremuan dagoela, teklek bertan idatzitakoa desegin eta berregiten dute horren ordez.

Historiak ez dira inoiz gurutzatzen. ERD fitxako desegiteak ez du inoiz orri baten edizioa leheneratzen, eta orri baten desegiteak ez du inoiz beste orri baten edizioa edo diagramarena leheneratzen. Orri bakoitzak bere historia mantentzen du orriz edo fitxaz aldatzen zaren bitartean.

Hauetako bakoitza bere orriko urrats bat da:

- Gelaxka-edizio bat, behin erregistratua idazten denean, ez idatzitako karaktere bakoitzeko, eta balioa aldatzen duenean bakarrik. Ikus [Gelaxkak editatzea](./dictionary.md#editing-cells).
- Itsaste bat, gehitzen dituen errenkadak barne, eta hautatutako gelaxkak `Delete` edo `Backspace` teklarekin garbitzea. Ikus [Kopiatzea eta itsastea](./dictionary.md#copying-and-pasting).
- `Add Row` botoia, eta errenkaden txertatze edo ezabatze bakoitza, barratik, saretaren menutik edo teklekin, zenbat errenkada hartzen dituen gorabehera. Ikus [Errenkadak gehitzea eta ezabatzea](./dictionary.md#adding-and-deleting-rows).
- Termino baten domeinua, bere zerrendatik aukeratua, `None` aukera barne. Ikus [Termino baten domeinua](./dictionary.md#a-terms-domain).
- Ordenatze bat. Ikus [Ordenatzea](./dictionary.md#sorting).
- `Import CSV` botoiarekin inportatutako CSV fitxategi bat, zenbat errenkada gehitzen edo eguneratzen dituen gorabehera. Fitxategiak betetzen duen orriaren urrats bat da, fitxak ondoren erakusten duena, edozein orritatik inportatu duzula ere. Ikus [Inportatzea](./dictionary.md#importing).

Ezer aldatzen ez duen idazketa batek, adibidez berriro inportatutako fitxategi bera edo dagoeneko ordena horretan dagoen orri baten ordenatzea, ez du urratsik erregistratzen, ezta `Nothing saved: …` jakinarazpen batekin ukatutakoak ere. `Physical Name` gabeko termino bati izen bat ematen zaionean, haren hitzek osatzen duten izen fisikoa edizio horren urratsaren parte da.

Domeinu baten `Data Type` berria `Domains` orriko urrats bat da, domeinuari lotutako zutabeei ematen dizkien motekin eta Erlazioen datu moten sinkronizazioak haietatik abiatuta erlazioetan zehar hedatzen dituenekin batera. Ikus [Domeinuak eta datu motak](./dictionary.md#domains-and-data-types).  
Hura desegiteak edo berregiteak une horretan domeinuari lotuta dauden zutabeen mota aldatzen du; beraz, ordutik beste domeinu bati lotu edo mota aldatu diozun zutabe batek bere mota mantentzen du. Urratsak lotura kendu zion zutabe bat, adibidez sinkronizazioak bere domeinu propio batetik askatu zuen gako arrotz bat, berriro lotzen da oraindik loturarik gabe dagoen eta urratsak utzi zion mota oraindik duen bitartean bakarrik.

`readonly` atributua duen editore batek botoiak ezkutatzen ditu, eta teklek ez dute ezer desegiten ez berregiten.  
Lankideen eta kodetze-agenteen aldaketak ere ez dira orri baten historian erregistratzen.

Orri guztien historia hustu egiten da hiztegiak ordezten direnean: JSON fitxategi baten `Import` ekintza batekin, zurea zein lankide batena, haren desegitearekin edo berregitearekin, eta beste diagrama bat editorean kargatzearekin. SQL eskema, GraphQL, DBML edo AML `Import` ekintza batek hiztegiak mantentzen ditu, eta haiekin batera orri guztien historia, haren desegitean eta berregitean ere.

## Denbora-bidaia {#time-travel}

Tresna-barrako `Time Travel` botoitik irekitzen da, ERD fitxan Undo eta Redo botoien ondoan.  
Botoiak ez du ezer egiten diagramaren historiak gutxienez erregistratutako aldaketa bat izan arte.

Denbora-bidaiak diagramaren kopia bereizi bat irekitzen du, irakurtzeko soilik, oihalak erakusten duen korritze-kokapenean, zoom-mailan eta [Izenen ikuspegian](./logical-names.md#name-view), `Viewport` edo `Name View` blokeoa aktibatuta egon ala ez.  
Diagramaren historian bakarrik ibiltzen da urratsez urrats; beraz, Hiztegiaren orrietako edizioak ez daude haren puntuen artean.  
Arrastatu graduatzailea, edo egin klik haren bideko edozein puntutan, edizio-historia osoan zehar mugitzeko eta puntu bakoitzaren aurrebista ikusteko. Graduatzailearen ezkerreneko kokapena erregistratutako lehen aldaketa baino urrats bat lehenagoko egoera da, eta heldulekua uneko egoeran duela irekitzen da.  
Aurrebista ez da interaktiboa: minimapa bat marrazten du, baina ezin da editatu, ezta haren ikuspegia mugitu edo korritu ere, eta benetako dokumentua ukitu gabe geratzen da aplikatu arte.

Sakatu `Apply` hautatutako puntua leheneratzeko, edo `Cancel` edo `Esc` dokumentua aldatu gabe uzteko.

![Denbora-bidaia irekitzea, graduatzailea saioan zehar atzera arrastatzea, eta lehenagoko puntu bat aplikatzea](/img/demo-time-travel.webp)
