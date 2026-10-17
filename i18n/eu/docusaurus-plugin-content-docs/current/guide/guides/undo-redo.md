---
sidebar_position: 13
description: Edizioak desegitea eta berregitea, historiak zer erregistratzen duen, eta historian urratsez urrats ibiltzea Denbora-bidaiarekin.
---

# Desegin eta berregin

Aurreko edizio-egoera batera itzul zaitezke, edo geroagoko batera aurrera egin.  
Historiak `2048` aldaketa gordetzen ditu gehienez.

- Desegin: `Ctrl + Z` (Windows/Linux) edo `⌘ + Z` (Mac)
- Berregin: `Ctrl + Shift + Z` (Windows/Linux) edo `⌘ + Shift + Z` (Mac)

Tresna-barrak bi komando berberak ditu `Undo` eta `Redo` botoi gisa, `Time Travel` botoiaren ondoan.  
Desegiteko edo berregiteko zerbait dagoenean bakarrik agertzen dira aktibo. `readonly` atributua duen editore batek hirurak ezkutatzen ditu, eta lasterbideek ez dute ezer egiten.

Desegiteak eta berregiteak ERD fitxan bakarrik funtzionatzen dute. Ez daude erabilgarri Bisualizazioa, SQL eskema, Kode-sortzailea eta Ezarpenak fitxetan. SQL eskema fitxako `Before tables` eta `After tables` eremuetan, tekla berek eremuan idatzitakoa desegin eta berregiten dute horren ordez.  
Lasterbideek ez dute funtzionatzen, halaber, Bilaketa azkarra, `Table Properties`, `Diff Viewer`, `Auto Layout` aurrebista, [`Export image`](./file-import-export.md#image) elkarrizketa-koadroa, [Mapatu zutabeak](./relationship-editing.md#map-columns) edo Denbora-bidaia irekita dagoen bitartean.  
Funtzionatzen jarraitzen dute teklatua [Arakatzaileko](./explorer.md#keys-in-the-explorer) edozein lekutan dagoen bitartean, haren zuhaitza barne, eta [kolore-hautatzailea](./table-related-functions.md#table-and-memo-color-specification) irekita dagoen bitartean. Testu-kurtsorea haien eremuetako batean egonda ere, adibidez Bilatu, Ordeztu edo `Hex` eremuan, diagrama desegin eta berregiten dute, eremuko testua beharrean.

Historia memorian mantentzen da, uneko saiorako. Ez da dokumentuan gordetzen; beraz, diagrama bat berriro irekitzean historia hutsik hasten da.

![Taula bat mugitzea eta zutabe bat ⌥ + Backspace lasterbidearekin kentzea, eta ondoren biak ⌘ + Z lasterbidearekin desegitea eta ⌘ + Shift + Z lasterbidearekin berregitea](/img/demo-undo-redo.webp)

## Historiak zer erregistratzen duen {#what-the-history-records}

Erregistratzen dira:

- Taulak eta oharrak: gehitzea, kentzea, mugitzea, kolorea, izena eta iruzkina, oharraren testua eta tamaina.
- Taula-taldeak: gehitzea, kentzea, mugitzea, tamaina aldatzea, izena, kolorea, eta taula bakoitza zein taldetan dagoen. Ikus [Taula-taldeak](./table-groups.md).
- Zutabeak: gehitzea, kentzea, ordena aldatzea, eta zutabe-aukera guztiak.
- Erlazioak: gehitzea, kentzea, mota aldatzea, [Mapatu zutabeak](./relationship-editing.md#map-columns) elkarrizketa-koadroan ezarritako zutabeak, eta `On Delete` edo `On Update` aukeretan egindako hautaketa bakoitza. Ikus [ON DELETE eta ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Kentze bat desegiteak erlazioa itzultzen du, bere ON DELETE eta ON UPDATE ekintzekin.
- Indizeak eta haien zutabeak.
- Ikuspegiaren kokapena, zoom-maila eta `View Option` menuko etengailuak.
- SQL eskema fitxako `Before tables` eta `After tables` scriptak, urrats bat eremutik irtetean aplikatzen duzun edizio bakoitzeko. Ikus [Taulen aurreko eta ondorengo scriptak](./schema-sql.md#before-and-after-scripts).
- Fitxategi bat inportatzea, eta bat gehitzea [`Import and Add`](./file-import-export.md#import-and-add) aukerarekin.

Ez dira erregistratzen:

- Datu-base hornitzailea eta datu-basearen izena.
- Kode-sortzailearen lengoaia, `Table Name Case` eta `Column Name Case`.
- Mugatzaile mota, dela SQL eskema fitxan ezarrita, dela Kode-sortzailea fitxan.
- SQL eskema fitxako `Statements`, `Header` eta `Tables` aukerak, editore-leihoari dagozkionak. Ikus [Aukeren panela](./schema-sql.md#options-panel).
- Ezarpenak fitxako guztia, [`Lock`](./settings.md#lock) errenkadak barne.
- Gaia eta bistaratze-hizkuntza. Ikus [Hizkuntza eta gaia](./language-and-theme.md).
- Zein taula, ohar edo talde marrazten den besteen aurrean.
- [Arakatzailea](./explorer.md): hura irekitzea, ixtea edo tamainaz aldatzea, haren zuhaitza tolestea, eta bilaketa-testua eta bilaketa-aukerak. `Replace` eta `Replace All` ekintzek aldatzen dutena erregistratu egiten da, ordea, baita jauzi batek egiten duen korritzea ere. Ikus [Keinu bat, urrats bat](#one-gesture-one-step).
- Zooma eta ikuspegia mugitzea Bisualizazioa fitxan, bi moduetako edozeinetan, grafoaren nodoak edo Fluxuko txartelak mugitzea, `Tidy Up` botoia, errenkaden bistaratzea eta taulak fokuratzea. Ikus [Fluxuak ez du inoiz dokumentua editatzen](./visualization.md#flow-never-edits-the-document).

Hauetako edozein aldatzea ezin da desegin.

Beste editore batetik iristen diren aldaketak ere ez dira erregistratzen; beraz, desegiteak zure aldaketak bakarrik leheneratzen ditu. [Elkarlaneko saio](../../api/advanced/collaborative-editing.md) batean, editore bakoitzak bere aldaketak desegiten ditu, eta [MCP zerbitzariaren](../../mcp/live-and-headless.md#undo) bidez editatzen duen kodetze-agente batek bereak desegiten ditu `erd_undo` tresnarekin.

Diagrama osoa ordezten duen `Import` ekintza bat desegiteak aurreko diagrama itzultzen du, editoreak inportatu zenuenean zuen bezala, [blokeo](./settings.md#lock) bakoitza aktibatuta edo desaktibatuta eta balio blokeatu bakoitza orduan zeuden bezala.  
Diagrama horrek `Viewport` blokeatuta bazuen, ikuspegia eta zooma ikuspegi blokeatura itzultzen dira, diagrama irekitzen den lekura, zeunden lekura beharrean. `Viewport` desblokeatuta bazuen, inportatu zenuenean zeunden lekura itzultzen dira. Gainerako ezarpen blokeatuak, adibidez zauden fitxa edo Kode-sortzailearen lengoaia, zure pantailan dauden bezala geratzen dira.  
Diagrama berri bat blokeo guztiak aktibatuta dituela hasten da. Desblokeatu `Viewport` inportatu aurretik, horrelako desegite batean zure ikuspegia mantentzeko. Ondoren desblokeatzeak, edo bere `Viewport` blokeoa desaktibatuta duen JSON fitxategi bat inportatzeak, ez du aldatzen desegiteak nora eramaten zaituen.

## Keinu bat, urrats bat {#one-gesture-one-step}

Keinu bakar batek bidaltzen duen guztia historiako sarrera bakar bihurtzen da.  
Hainbat taula eta ohar aldi berean itsastea, edo `Alt + drag` keinuarekin bikoiztea, urrats bakar batean desegiten da.

`Delete` edo `Backspace` teklaren sakatze bat, edo laster-menu bateko `Delete selected` edo `Delete columns` aukera, urrats bat da, zenbat taula, ohar, taula-talde edo zutabe kentzen dituen gorabehera.  
Hautatutako hainbat zutaberen gako nagusia txandakatzea urrats bat da, dela `Alt + K` (Windows/Linux) edo `⌥ + K` (Mac) lasterbidearekin, dela taula baten laster-menuko `Primary Key on selected columns` aukerarekin.  
Hautapenaren kolorea ezartzea, edo `No color` edo `Remove color` aukerarekin kentzea, urrats bat da, zenbat taula, ohar eta talde dauden hautatuta gorabehera. Hautatutako guztiak dagoeneko duen kolore bat aukeratzeak ez du urratsik erregistratzen, ezta `No color` aukerak ere, hautatutako ezerk kolorerik ez duenean.  
[Mapatu zutabeak](./relationship-editing.md#map-columns) elkarrizketa-koadroko `Map` edo `Save` botoia urrats bat da, gehitzen dituen gako arrotzeko zutabeekin eta aldatzen dituen datu motekin batera.  
`Import and Add` ekintza urrats bat da, gehitutako blokea ikusgai jartzen duen korritzearekin batera, behar denean.

[Taula-talde](./table-groups.md) bat sortzea, marraztuz edo hautatutako taulak `Group selected tables` aukerarekin edo `T` eta ondoren `G` lasterbidearekin taldekatuz, urrats bat da, barnean hartzen dituen taula guztiekin batera. Talde bat kentzea urrats bat da, eta desegiteak taldea itzultzen du, bere taulak barruan dituela.  
Talde bat bere titulu-barratik arrastatzeak taldea eta haren taula guztiak urrats bakar batean mugitzen ditu. Talde batera edo talde batetik kanpora askatutako taulek arrastatzearen urrats berean aldatzen dute taldez, azken mugimendutik `200ms` inguruko epearen barruan askatzen baduzu; beraz, desegite bakar batek zeuden lekura eta zeuden taldeetara itzultzen ditu. Askatu aurretik pausa luzeagoa eginez gero, talde-aldaketa bere urrats propioa da, eta lehen desegiteak hori bakarrik leheneratzen du.  
Talde baten tamaina ertz batetik edo izkina batetik aldatzea behin erregistratzen da, askatzen duzunean.  
[Antolaketa automatikoa](./table-related-functions.md#auto-layout) aplikatzea urrats bat da, beren taulen inguruan egokitzen dituen taldeak barne.

[Bilatu eta ordeztu](./find-and-replace.md#replacing) funtzioko `Replace All` ekintza ere urrats bat da, zenbat taula-izen, zutabe-izen, indize-izen, taula-taldeen izen, iruzkin eta ohar aldatzen dituen gorabehera. Ezer aldatzen ez duenean, `Preserve Case` aukerak bat-etortze guztiak zeuden bezala berridazten dituenean bezala, ez du urratsik erregistratzen.  
`Replace` ekintza bakar bat urrats bat da, hurrengo bat-etortzera korritzea barne, bat-etortze horrek behar duenean. Bere bat-etortzea zegoen bezala berridazten duenean, korritze hori bakarrik erregistratzen du, edo ezer ez, korritzerik ez dagoenean.  
Bat-etortze batera joateak oihala korritzen du bat-etortzea dagoeneko ondo ikusten ez denean bakarrik. Ikus [Jauziaren helmuga](./table-related-functions.md#where-a-jump-lands). Korritze hori ikuspegiaren kokapenaren beste edozein aldaketa bezala erregistratzen da; beraz, bat-etortzeetan zehar mugitu ondoren, desegiteak lehenik korritze horiek leheneratzen ditu, urrats bakoitzean bat.  
Oihalean amaitzen diren gainerako jauziek modu berean erregistratzen dituzte beren korritzeak: Arakatzaileko errenkada bat, Bilaketa azkarreko emaitza bat edo Fluxuko kanpo-estekako [txartel-botoia](./visualization.md#card-buttons) aukeratzea. Ikuspegia dagoen lekuan uzten duen jauzi batek ez du ezer erregistratzen. `Diff Viewer` leihoaren zerrendan errenkada bat aukeratzeak ere ez du ezer erregistratzen, Diferentzia-ikustailearen irakurtzeko soilik diren aldeak baino ez baititu mugitzen.

Etengabeko arrastatze bat, oihalaren ikuspegi-mugimendu bat, zoom bat, atximur-keinu bat edo kolore-aldaketa bat `200ms` inguruz metatzen da, eta sarrera bakar bihurtzen da hori ere.  
Guztira `20px` baino gutxiago mugitzen den arrastatze batek ez du mugimendurik erregistratzen. Egiten duen talde-aldaketa bakarrik erregistratzen da, halakorik badago.

Gelaxka batean edo ohar batean idaztea idazketa-ekintza bakoitzeko erregistratzen da, ez keinu bakoitzeko: idatzitako karaktere bakoitza, itsaste bakoitza eta IME bidezko konposizio baten urrats bakoitza urrats propioa da.  
Taula-talde baten izena behin erregistratzen da, `Enter` teklak edo eremutik irteteak gordetzen duenean; beraz, sortu berri duzun talde batean idazten duzun izena taldea sortzetik bereizitako urrats bat da. `Esc` teklak, edo aldatu gabe utzitako izen batek, ez du ezer erregistratzen.

## Denbora-bidaia {#time-travel}

Tresna-barrako `Time Travel` botoitik irekitzen da, Undo eta Redo botoien ondoan.  
Botoiak ez du ezer egiten saioak gutxienez erregistratutako aldaketa bat izan arte.

Denbora-bidaiak diagramaren kopia bereizi bat irekitzen du, irakurtzeko soilik, oihalak erakusten duen korritze-kokapenean eta zoom-mailan, `Viewport` blokeoa aktibatuta egon ala ez.  
Arrastatu graduatzailea, edo egin klik haren bideko edozein puntutan, edizio-historia osoan zehar mugitzeko eta puntu bakoitzaren aurrebista ikusteko. Graduatzailearen ezkerreneko kokapena erregistratutako lehen aldaketa baino urrats bat lehenagoko egoera da, eta heldulekua uneko egoeran duela irekitzen da.  
Aurrebista ez da interaktiboa: minimapa bat marrazten du, baina ezin da editatu, ezta haren ikuspegia mugitu edo korritu ere, eta benetako dokumentua ukitu gabe geratzen da aplikatu arte.

Sakatu `Apply` hautatutako puntua leheneratzeko, edo `Cancel` edo `Esc` dokumentua aldatu gabe uzteko.

![Denbora-bidaia irekitzea, graduatzailea saioan zehar atzera arrastatzea, eta lehenagoko puntu bat aplikatzea](/img/demo-time-travel.webp)
