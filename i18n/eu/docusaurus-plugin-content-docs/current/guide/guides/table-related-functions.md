---
sidebar_position: 5
description: Hautatu, mugitu, kopiatu, bikoiztu eta ezabatu taulak eta oharrak, ezarri koloreak eta ikuspegi-aukerak, definitu indizeak eta gako alternatiboak, aukeratu datu-base bat, mugitu oihal mugagabean zehar eta alderatu dokumentuak.
---

# Taulekin lotutako funtzioak

Taulak eta oharrak sortuta daudenean haiekin egiten duzun guztia — hautatzea, mugitzea, kopiatzea, ezabatzea, koloreztatzea eta oihalak zer erakusten duen ezartzea — eta haien inguruko oihaleko kontrolak.  
Lehenik taulen eta oharren komandoak datoz; ondoren Taularen propietateak, taulak fokuratzea, indizeak eta gako alternatiboak, Antolaketa automatikoa eta datu-base hornitzailea; ondoren oihala bera: oihaleko tresna-barra, zooma, ikuspegia mugitzea eta jauzi baten helmuga, eta Diferentzia-ikustailea; eta azkenik irakurtzeko soilik dagoen editore batek horretatik zer mantentzen duen.  
Taula-taldeek, taulak biltzen dituzten koadroek, beren orria dute. Ikus [Taula-taldeak](./table-groups.md).  
Izen logikoek eta Izenen ikuspegiak ere badute beren orria; Izenen ikuspegiak erabakitzen ditu taulek erakusten dituzten izenak. Ikus [Izen logikoak](./logical-names.md).

## Hautapen anitza {#multiple-selection}

Hiru metodo onartzen ditu:

- `Ctrl + drag` (Windows/Linux) edo `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) edo `⌘ + click` (Mac)
- `Ctrl + A` edo `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` edo `⌘ + ⌥ + A` (Mac)

Oharrak modu berean hautatzen dira, eta guztiak hautatzeko bi lasterbideetako edozeinek taula eta ohar guztiak hartzen ditu aldi berean. View Option → `Memos` aukerarekin ezkutatutako oharrak kanpoan geratzen dira guztiak hautatzean, baita hautapen-lauki batekin hautatzean ere. Ikus [Taulen ikuspegi-aukerak](#table-view-options).  
[Taula-taldeak](./table-groups.md#selecting-groups) hautapenera gehitzen dira beren titulu-barran `Ctrl + click` (Windows/Linux) edo `⌘ + click` (Mac) eginez, baina guztiak hautatzeak ez du inoiz talderik hartzen.  
`Ctrl + A` lasterbideak testu-kurtsoreari uzten dio lekua; beraz, gelaxka bat editatzen ari zarenean, testua hautatzen du, ez diagrama.  
Hautapen-lauki batek taula edo ohar bat markatzen du haren erdigunea estaltzen duenean; ez da nahikoa ertz bat ukitzea. Taula-talde bat taldearen koadro osoa inguratzen duenean soilik hartzen du; beraz, talde baten barruan marraztutako lauki batek taulak hautatzen ditu, taldea gabe.  
Dagoeneko hautatuta dagoen zerbaitean eskuineko klik eginez gero, hautapen osoa mantentzen da; beraz, `Color`, `Group selected tables` eta `Delete selected` bezalako menuko aukerek hautapen osoan eragiten dute. Beste edozein taula, ohar edo taula-taldetan eskuineko klik eginez gero, hura bakarrik hautatzen da, `Ctrl` edo `⌘` sakatuta eduki arren, eta erlazio batean edo oihal hutsean eskuineko klik eginez gero, hautapena garbitzen da.  
`Escape` teklak hautapena garbitzen du. Gelaxka-editore bat, ohar-editore bat edo taula-talde baten izen-editorea irekita dagoen bitartean, edo erlazio bat edo `New Table Group` bat marrazten ari zaren bitartean, lehen `Escape` sakatzeak hori amaitzen du, eta bigarrenak hautapena garbitzen du.  
Irakurtzeko soilik dagoen editore batek ez du hautatzeko modu horietako bat ere: bertan jauzi batek soilik hautatzen du. Ikus [Irakurtzeko soilik dauden editoreak](#read-only-editors).

![Taulak ⌘ + drag eta ⌘ + click bidez hautatzea, eta ondoren taula eta ohar guztiak ⌘ + A bidez](/img/demo-table-select.webp)

Elkarlaneko saio batean, parte-hartzaile bakoitzaren hautapena, fokuratutako gelaxka eta hautapen-laukia oihalean marrazten dira, parte-hartzaile horren kolorean. Ikus [Elkarlaneko edizioa](../../api/advanced/collaborative-editing.md).  
Beste Izenen ikuspegi bat begiratzen ari den parte-hartzaile baten fokuratutako gelaxka zure ikuspegiak haren ordez marrazten duen gelaxkan marrazten da, adibidez haren izen-gelaxka zure izen logikoaren gelaxkan. Ikus [Lankideak](./logical-names.md#collaborators).

## Hainbat taula mugitzea {#moving-multiple-tables}

Arrastatu dagoeneko hautapenaren parte den edozein taula edo ohar, eta hautapen osoa harekin batera mugitzen da, tekla aldatzailerik behar izan gabe.  
Taula bat bere goiburutik edo bere zutabe-errenkadetako edozeinetatik arrastatzen da; beraz, zutabe-errenkada batean hasten den arrastatze batek taula mugitzen du, ez zutabea. Zutabeak, horren ordez, fokuratutako errenkadaren ondoko arrastatzeko heldulekutik mugitzen dira. Ikus [Zutabeak berrantolatzea eta mugitzea](./table-editing.md#rearranging-and-moving-columns).  
Goiburuko gelaxka batean edo zutabe-errenkada batean, taula erakusleak tarte labur bat egin ondoren bakarrik hasten da mugitzen; beraz, bertan klik egiteak gelaxka fokuratzen du oraindik, eta klik bikoitzak haren editorea irekitzen du oraindik. Arrastatze bat ez da inoiz hasten taularen kolore-ertzetik, kolore-hautatzailea irekitzen baitu, ezta haren goiburuko `+` eta `x` botoietatik edo zutabe-errenkada bateko `x` botoitik ere.  
Hautapenetik kanpoko zerbait arrastatzean, hautapena hartara murrizten da, eta hura bakarrik mugitzen da. `Ctrl + drag` (Windows/Linux) edo `⌘ + drag` (Mac) eginez gero, hautapena mantendu egiten da bi kasuetan.  
Saguaren ezkerreko botoiak soilik mugitzen ditu taulak eta oharrak. Eskuineko klikak laster-menuak zertan eragingo duen aukeratzen du eta ez du ezer mugitzen, eta erdiko botoiarekin arrastatzean, berriz, oihalaren ikuspegia mugitzen da. Ikus [Oihalean zehar mugitzea](#getting-around-the-canvas).

![Hautatutako bi tauletako bat arrastatzean biak mugitzen dira, eta erlazioak jarraitu egiten die](/img/demo-table-multiple-move.webp)

Hautatutako [taula-talde bat](./table-groups.md) ere mugitzen da, bere taulak eramanez, eta hautatuta egoteaz gain mugitzen ari den talde batean ere dagoen taula bat behin bakarrik mugitzen da.  
Taula bat askatzen duzun lekuaren arabera, talde batean sar edo talde batetik atera daiteke. Ikus [Taulak gehitzea eta kentzea](./table-groups.md#adding-and-removing-tables).

Taulek eta oharrek pilatze-ordena bera partekatzen dute. Taula edo ohar bat sakatzean, ezkerreko edo eskuineko botoiarekin, gainerako taula eta ohar guztien aurrera ekartzen da, eta taula-talde baten titulu-barra sakatzean, edo haren gorputzean eskuineko klik egitean, taldearen taulak aurrera ekartzen dira.  
Ordena ez da gordetzen: berriro irekitako diagrama batek bere taulak fitxategiak zerrendatzen dituen ordenan pilatzen ditu, ohar guztiak haien gainean dituela.

## Taulak eta oharrak kopiatzea/itsastea {#copyingpasting-tables-and-memos}

Hautatutako taulak eta oharrak kopiatzen ditu, eta berri gisa itsasten ditu berriro.  
Lasterbideak: `Ctrl + C` (Windows/Linux) edo `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) edo `⌘ + V` (Mac)

Kopiatutako taula batek bere izena, izen logikoa, iruzkina, zutabeak eta kolorea mantentzen ditu; kopiatutako ohar batek bere testua, tamaina eta kolorea.  
Kopiatutako zutabe bakoitzak bere izen logikoa mantentzen du, eta taula- eta zutabe-izen bakoitzak hiztegietatik eratorria izan zen ala ez mantentzen du. Ikus [Izen fisikoak eratortzea](./dictionary.md#deriving-physical-names).  
Itsatsitako zutabe batek bere domeinu-lotura mantentzen du bi baldintza betetzen direnean bakarrik: iristen den diagramak domeinu hori bera zerrendatzen du, ez izen bereko bat soilik, eta domeinuak zutabea kopiatu zenean zuen datu mota du oraindik. Bestela, zutabea domeinurik gabe iristen da, eta kopiatu zenean zuen mota mantentzen du. Ikus [Zutabe bat lotzea](./dictionary.md#linking-a-column).  
Indizeak eta erlazioak ere kopiatzen dira: indize bat osorik kopiatzen da kopiatutako taulara, eta erlazio bat bere motarekin eta bere ON DELETE eta ON UPDATE ekintzekin kopiatzen da, lotzen dituen bi taulak kopiatutako multzoan daudenean. Erdizka hartutako erlazio bat baztertu egiten da, jatorrizkoa seinalatzen utzi beharrean.  
Itsatsitako kopiak hautapen berria bihurtzen dira, eta kopia bera berriro itsasten den bakoitzean beste `50px` desplazatzen da; beraz, behin eta berriz itsastean, kopiak ez dira bata bestearen gainean pilatzen.  
Kopia batek ez du bere [taula-taldea](./table-groups.md) mantentzen: itsatsitako taula ez dago inongo taldetan, talde baten koadroaren barruan geratzen denean ere, eta hautatutako talde bat ez da kopiatzen.  
View Option → `Memos` aukerak oharrak ezkutatzen dituen bitartean, itsasteak daramatzan oharrak gehitzen ditu hala ere, ezkutatuta eta hautatu gabe; beraz, itsatsitako taulek soilik osatzen dute hautapena.

![Erlazionatutako bi taula kopiatzea eta bi aldiz itsastea, erlazioa barne](/img/demo-table-copy-paste.webp)

Fokuratutako taula baten barruan zutabeak hautatuta daudenean, lasterbide berak zutabe horiek kopiatzen ditu horren ordez. Ikus [Taulak editatzea](./table-editing.md).

## Taulak eta oharrak bikoiztea {#duplicating-tables-and-memos}

Eduki sakatuta `Alt` tekla eta arrastatu taula edo ohar bat saguaren ezkerreko botoiarekin.  
Taula bat bere goiburutik edo edozein zutabe-errenkadatatik hartzen da; beraz, zutabe-errenkada batean `Alt + drag` eginez gero, taula bikoizten da eta zutabeen ordena dagoen bezala geratzen da. Zutabea arrastatzeko heldulekuan `Alt` sakatuta edukitzeak ez du ezer bikoizten: zutabea heldulekutik arrastatze arrunt batek bezala mugitzen da. Ikus [Zutabeak berrantolatzea eta mugitzea](./table-editing.md#rearranging-and-moving-columns).  
Aurrebista erdi garden batek erakusleari jarraitzen dio, eta botoia askatzean kopia aurrebista dagoen lekuan uzten da.  
Heltzen duzuna dagoeneko hautapen baten parte bada, hautapen osoa bikoizten da. Bestela, hautapena erakuslearen azpiko entitateak ordezten du.  
Mugitu gabe `Alt + click` eginez gero, kopia `50px` beherago eta eskuinerago uzten da, eta leku hori dagoeneko hartuta dagoen bakoitzean, are urrunago.

Bikoizketa batek [itsaste](#copyingpasting-tables-and-memos) batek daramatzan gauza berak daramatza: izenak eta izen logikoak, iruzkinak, zutabeak, koloreak, oharren tamainak, eta kopiatu duzunari osorik dagozkion indizeak eta erlazioak. Diagrama berean geratzen denez, zutabe guztien domeinu-lotura dagoen bezala mantentzen du. Itsaste batean bezala, ez da inongo taula-taldetan geratzen.  
Taula-talde baten titulu-barran `Alt + drag` eginez gero, taldea arrastatze arrunt batek bezala mugitzen da; talde bat ez da inoiz bikoizten.

![Taula bat Alt + drag bidez bikoiztea, eta ondoren Alt + click bidez beste kopia bat beherago eta eskuinerago](/img/demo-table-duplicate.webp)

## Taulak eta oharrak ezabatzea {#table-and-memo-deletion}

Hautatutako taulak, oharrak eta [taula-taldeak](./table-groups.md) ezabatzen ditu.  
Lasterbideak:

- `Delete` edo `Backspace`. Hauek hautapen osoa kentzen dute, salbu eta hautatutako gauza bakarra zutabe batzuk hautatuta dituen taula bat denean eta zooma `70%` baino handiagoa denean: orduan, horren ordez, zutabe horiek kentzen dituzte. Ikus [Zutabeak ezabatzea](./table-editing.md#column-deletion).
- `Ctrl + Backspace` edo `Ctrl + Delete` (Windows/Linux), `⌘ + Backspace` edo `⌘ + Delete` (Mac). Hauek beti kentzen dituzte hautatutako taulak, oharrak eta taula-taldeak, zutabeak hautatuta dauden bitartean ere.

![Taula bat eta haren erlazioak Delete teklarekin ezabatzea, eta ondoren taula bat eta ohar bat batera, oharraren menuko Delete selected aukerarekin](/img/demo-table-remove.webp)

Laster-menuek ere ezabatzen dute. Taula baten edo ohar baten menuko azken aukerak `Delete selected` dio, taula edo ohar hori hautatutako bi elementu edo gehiagotako bat den bitartean, eta hautapen osoa kentzen du. Bestela, `Delete` dio, eta taula edo ohar hori bakarrik kentzen du. Hautatutako zutabe baten errenkadaren gainean, taularen menuak `Delete column` edo `Delete columns` dio horren ordez, [Zutabeak ezabatzea](./table-editing.md#column-deletion) atalean bezala.

Taula bat kentzean, haren erlazioak eta indizeak ere kentzen dira. Taula-talde bat kentzean, haren taulak mantendu egiten dira, talderik gabe. Ikus [Talde bat kentzea](./table-groups.md#removing-a-group).  
Ez da berrespenik eskatzen, kentze bakoitza desegite-urrats bat da, eta `readonly` atributua duen editore batean ez da ezer kentzen.  
Sakatuta edukiz gero, `Delete` eta `Backspace` teklek behin bakarrik kentzen dute, eta ez dute inoiz erlaziorik kentzen. Ikus [Erlazioak editatzea](./relationship-editing.md#deletion). Gelaxka batean, ohar batean edo beste edozein testu-eremutan idazten ari zarenean, testua editatzen dute horren ordez.  
Ezarpenak fitxak bi tekla horiek `Delete Selection` izenarekin zerrendatzen ditu. Ikus [Lasterbideak](./settings.md#shortcuts).

## Taulen eta oharren kolorea ezartzea {#table-and-memo-color-specification}

Koloreak eslei ditzakezu kategoriaren arabera bereizteko.  
Taula batek bere kolorea ezkerreko ertzean darama, goitik behera, eta ohar batek goiko aldean. Egin klik ertz edo banda horretan ezkerreko botoiarekin, edo aukeratu `Color` aukera taularen edo oharraren laster-menuan, kolore-hautatzailea erakuslearen lekuan irekitzeko. Kolorea hautatutako taula, ohar eta taula-talde guztiei aplikatzen zaie, ez klik egin duzun horri bakarrik.  
Taula-talde bat bere menuko `Color` aukeratik koloreztatzen da, eta koloreztatutako talde bateko taula batek taldearen kolorea darama bere goiburuan zehar, bere kolorea ezkerreko ertzean mantenduz. Ikus [Talde bat koloreztatzea](./table-groups.md#coloring-a-group).

![Blue kolore aurrezarria hautatzea ohar baten kolore-bandatik, hautatutako bi taularentzat eta oharrarentzat, eta ondoren kolorea kentzea No color aukerarekin](/img/demo-table-color.webp)

Hautatzaileak hauek ditu, goitik behera:

- Saturazio eta distiraren eremu bat, eta ondoren ñabarduraren graduatzailea, kolorearen aurrebista bat ondoan duela. Nabigatzaileak kolore-hartzailea eskaintzen duenean, graduatzailearen aurreko pipeta-botoi batek, `Pick a color from the screen` botoiak, pantailako edozein lekutako kolore bat hartzen du.
- `Hex`, `R`, `G` eta `B` eremuak. `Hex` eremuak 3, 4, 6 edo 8 digitu hamaseitar onartzen ditu, `#` ikurrarekin edo gabe, edo itsatsitako `rgb()` edo `hsl()` balio bat, edo CSS kolore-izen bat. 6 edo 8 digituko balio oso bat idatzi ahala aplikatzen da, eta beste edozer `Enter` sakatzean edo eremutik irtetean. `R`, `G` eta `B` eremuek zenbaki osoak onartzen dituzte, `255` baino handiagoko edozer `255` gisa irakurriz, eta `Enter` sakatzean edo eremutik irtetean aplikatzen dira. Hautatzaileak irakur ezin duen testua baztertu egiten da.
- Hamasei kolore aurrezarri, zortziko bi errenkadatan: Red, Orange, Amber, Yellow, Lime, Green, Teal, Cyan, Blue, Indigo, Violet, Purple, Pink, Crimson, Brown eta Gray. Kolore-lagin baten gainetik sagua pasatzean, haren kode hamaseitarra erakusten da.
- `Document colors`: dokumentuko taulek, oharrek eta taula-taldeek dagoeneko erabiltzen dituzten gehienez zortzi kolore, erabilienak lehenik. Errenkada koloreren bat dagoenean soilik erakusten da.
- `No color`.

Kolore bat beti da opakua: hautatzaileak ez du gardentasun-kontrolik, eta idatzitako edo itsatsitako balio batek daraman edozein gardentasun baztertzen du.  
Hautatzailea irekitzeak ez du ezer aldatzen, eta hautapenak dagoeneko duen kolorea hautatzeak ez du desegite-urratsik gehitzen.

`No color` aukerak hautatutako taula, ohar eta taula-talde guztien kolorea garbitzen du desegite-urrats bakarrean, eta hautatzailea ixten du. `Remove color` aukerak, hautatutako elementuren batek kolorea duen bitartean taulen, oharren eta taula-taldeen laster-menuetan `Color` aukeraren azpian agertzen denak, gauza bera egiten du hautatzailea ireki gabe.

Hautatzaileak teklatua hartzen du irekitzean, eta `Tab` eta `Shift + Tab` teklek haren kontrolak zeharkatzen dituzte, zikloan. Gezi-teklek eremua eta ñabarduraren graduatzailea unitate 1 mugitzen dituzte, edo 10 `Shift` teklarekin, eta kolore-lagin batetik bestera igarotzen dira, bakoitza aplikatuz igaro ahala.  
Hautatzaileak teklatua duen bitartean, desegin eta berregin, zoom-lasterbideak, eta `Search` eta `Toggle Explorer` komandoak editorera iristen dira oraindik, eta editorearen gainerako lasterbideak ez: [ezabatzeko](#table-and-memo-deletion) lasterbideek ez dute ezer kentzen, eta `Delete` eta `Backspace` teklek `Hex`, `R`, `G` eta `B` eremuetako testua editatzen dute soilik.  
`Escape` teklak hautatzailea ixten du, baita oihalean haren kanpoaldean egindako sakatze batek ere.  
[Arakatzailean](./explorer.md) sakatzea ez da oihalean sakatzea; beraz, hautatzailea irekita uzten du. Han aukeratutako errenkada batek hautapena aldatzen du, eta hurrengo hautaketak hautapen berria koloreztatzen du.

## Taulen ikuspegi-aukerak {#table-view-options}

Ikuspegi-aukera hauek eskaintzen ditu:

- Table Comment
- Column Comment
- DataType
- Domain
- Default
- Not Null
- Unique
- Alternate Key
- Auto Increment
- Relationship
- Referential Actions
- Table Groups
- Memos

`Domain`, `Unique`, `Alternate Key` eta `Auto Increment` aukerak lehenespenez desaktibatuta daude, eta gainerakoak aktibatuta.  
Taulek zein izen erakusten dituzten ez da ikuspegi-aukera bat: `Name View` aukerak, oihalaren laster-menuan `View Option` aukeraren ondoren dagoenak, izen fisikoak, izen logikoak edo biak aukeratzen ditu. Ikus [Ikuspegia aldatzea](./logical-names.md#switching-the-view).  
`Domain` aukerak gelaxka bat ematen dio zutabe bakoitzari, [zutabeen ordenaren](./settings.md#adjusting-column-order) arabera kokatua, zutabea lotuta dagoen domeinuaren izenarekin. `Domains` orriak zerrendatzen duen domeinurik lotzen ez duen zutabe batek `domain` leku-marka erakusten du bertan, lausotuta. Gelaxka Izenen ikuspegi guztietan agertzen da. `Domain` desaktibatuta dagoen bitartean, `Logical Names` ikuspegiak domeinu lotu baten izena erakusten du mota-gelaxkan horren ordez. Ikus [Domain gelaxka](./logical-names.md#the-domain-cell).  
`Alternate Key` aukerak gako alternatibo bakoitzaren zutabeak markatzen ditu, esaterako `AK1.1` markarekin. Ikus [Gako alternatiboak](#alternate-keys).  
`Referential Actions` aukerak `D:` eta `U:` etiketak erakusten ditu; erlazio baten ON DELETE eta ON UPDATE ekintzek jartzen dituzte, haren konektorearen taula umearen aldeko muturrean. Ikus [Konektore bat irakurtzea](./relationship-editing.md#reading-a-connector). Desaktibatzean, etiketa horiek soilik ezkutatzen dira, eta ez da ez taularik ez konektorerik mugitzen.  
`Table Groups` aukerak [taula-taldeak](./table-groups.md) eta taldeen koloreak haien taulen goiburuetan erakusten ditu. Desaktibatzean, oihalean, minimapan eta irudi-esportazioetan ezkutatzen dira, ez da taularik mugitzen, eta taula bakoitza bere taldean geratzen da. Ikus [Taldeak ezkutatzea](./table-groups.md#hiding-groups). Gainera, `Table Groups` karpeta [Arakatzailetik](./explorer.md#the-tree) kentzen du, eta `New Table Group` botoia [oihaleko tresna-barratik](#canvas-toolbar), eta Arakatzailearen bilaketak taldeen izenak aurkitzeari uzten dio.  
`Memos` aukerak oharrak erakusten ditu. Desaktibatzean, ohar guztiak ezkutatzen dira oihalean, minimapan eta irudi-esportazioetan, eta ez da ez taularik ez konektorerik mugitzen. Ezkutatutako oharrek ez dute lekurik hartzen; beraz, korritze-barrek, minimapak eta `Go to content` iparrorratzak kanpoan uzten dituzte.  
Oharrak ezkutatzean, hautapenetik kentzen dira, eta irekita dagoen ohar-editorea ixten da. [Arakatzaileak](./explorer.md#the-tree) bere `Memos` karpeta kentzen du, eta haren [Bilatu eta ordeztu](./find-and-replace.md) bilaketak eta Bilaketa azkarraren `:` aurrizkiak ez dituzte oharrak bilatzen. Ezkutatuta dauden bitartean, `New Memo` aukera laster-menutik, [oihaleko tresna-barratik](#canvas-toolbar), Bilaketa azkarretik eta [ongietorri-pantailatik](./editing-start.md#welcome-screen) desagertzen da, eta `Alt + M` lasterbideak ez du oharrik gehitzen. Itsaste batek edo [Inportatu eta gehitu](./file-import-export.md#import-and-add) ekintza batek daramatzan oharrak gehitzen ditu hala ere, ezkutatuta eta hautatu gabe.  
Irakurtzeko soilik dagoen editore batean etengailuek oraindik funtzionatzen dute, pantaila horretan bakarrik: ez dira gordetzen, desegite-historian erregistratzen edo partekatzen, eta fitxategiarenetara itzultzen dira editorea berriro idazgarri bihurtzen denean. Ikus Ezarpenetako [Irakurtzeko soilik dauden editoreak](./settings.md#read-only-editors).

![View Option sarrerak aktibatzea eta desaktibatzea taulak berrantolatu ahala, indize bakar konposatu bat AK1.1 eta AK1.2 gisa markatzea Alternate Key aukerarekin, eta ondoren Memos desaktibatzea eta berriro aktibatzea](/img/demo-view-options.webp)

Bisualizazioa fitxako `Flow` moduko txartelek ez diete aukera hauei jarraitzen, `Domain` barne: beren [errenkaden bistaratzea](./visualization.md#row-display) erabiltzen dute, eta beren konektoreak marrazten dituzte `Relationship` desaktibatuta egonda ere. Txartel batek zein gelaxka antolatzen dituen Izenen ikuspegiaren araberakoa da soilik. Ikus [Txarteletako izenak](./visualization.md#names-on-the-cards).

## Taularen propietateak {#table-properties}

Taula baten propietate-panela irekitzen du.  
Hasi taularen laster-menuko `Table Properties` aukeratik, eskuineko klik egin diozun taularentzat irekitzen baitu, edo hautatu taula bat eta sakatu `Alt + Space`.  
Panela lausotutako oihal baten erdian irekitzen da. Oihala bakarrik lausotzen da; beraz, irekita dagoen [Arakatzailea](./explorer.md#dialogs-beside-it) irekita eta erabilgarri geratzen da haren ondoan. Haren goiburuak `Table Properties` titulua, azken aldian irekitako bost taulak etiketa gisa, unekoa nabarmenduta, eta ixteko botoi bat ditu. Etiketa bakoitzak bere taula [Izenen ikuspegiak](./logical-names.md#beyond-the-canvas) bezala izendatzen du. Egin klik etiketa batean taula horretara joateko, panela berriro ireki gabe.  
Goiburuaren azpian hiru fitxa daude: `Indexes`, `Schema SQL` eta `Code Generator`. Panelak tamaina bera mantentzen du hiruentzat; beraz, fitxaz aldatzean ez da mugitzen, ezta tamainaz aldatzen ere.  
Itxi ixteko botoiarekin, `Escape` teklarekin edo oihalean haren kanpoaldean klik eginez.  
Arakatzailean karpeta ez den errenkada bat aukeratzeak, edo haren bilaketaren bat-etortze batera joateak, Taularen propietateak ixten ditu jauziaren aurretik. Gauza bera egiten du `Ctrl + F` (Windows/Linux) edo `⌘ + F` (Mac) lasterbideak, Arakatzailearen bilaketa irekitzen baitu, edo, Arakatzailea dagoeneko irekita badago, testu-kurtsorea haren Bilatu eremuan jartzen baitu. Arakatzailean egindako beste edozein klikek, karpeta-errenkada bat barne, edo tresna-barrako `Explorer` botoian egindakoak, Taularen propietateak irekita uzten ditu. Teklatua Arakatzailean dagoela sakatutako `Escape` batek teklatua oihalari itzultzen dio soilik; beraz, bigarren `Escape` bat behar da Taularen propietateak ixteko.

`Indexes` fitxa [Indizeak](#indexes) atalean azaltzen da.  
`Schema SQL` fitxak taularen DDLa erakusten du hautatutako [datu-basearentzat](#databases): haren `CREATE TABLE` sententzia, datu-base batzuek haren Unique zutabeentzat idazten dituzten murriztapen bereiziak, eta haren indizeak. Beti `CREATE` sententzia soilak idazten ditu, goiburu gabe, aurreko edo ondorengo scriptik gabe eta iruzkin hutsetan izen logikorik gabe, tresna-barrako [SQL eskema](./schema-sql.md) fitxa nola ezarrita dagoen kontuan hartu gabe. Ikus [Izen logikoak iruzkin gisa](./schema-sql.md#logical-names-as-comments). Ez du aukeren panelik, eta haren laster-menuak `Database` eta `Bracket` soilik eskaintzen ditu.  
`Code Generator` fitxak taula honentzat bakarrik sortzen du kodea. Ikus [Kode-sortzailea](./code-generator.md).

Irakurtzeko soilik dagoen editore batean, panela ireki egiten da hala ere, `Table Properties` aukeratik, taularen laster-menuko errenkada bakarretik, edo jauzi batek hautatutako taulan `Alt + Space` lasterbidearekin. `Read only` etiketa bat erakusten du tituluaren ondoan, eta haren `Indexes` fitxak ez du ediziorik eskaintzen.  
Editorea irakurtzeko soilik bihurtzen denean irekita dagoen panela irekita geratzen da eta harekin batera irakurtzeko soilik bihurtzen da. Ikus [Irakurtzeko soilik dauden editoreak](#read-only-editors).

## Taulak fokuratzea {#focusing-on-tables}

Bisualizazioa fitxa `Flow` moduan irekitzen du, aukeratutako tauletara eta haietatik erlazio bakar batera dauden taula guztietara mugatuta.  
Hasi taularen laster-menutik `Focus on this table` aukerarekin, edo hautatu taula bat edo gehiago eta sakatu `Alt + F`.  
Eskuineko klik egiten diozun taula hautatutako hainbat tauletako bat denean, aukerak `Focus on selected tables` dio eta hautapen osoa fokuratzen du. Hautapenetik kanpoko taula batean eskuineko klik eginez gero, taula hori bakarrik fokuratzen da.  
Lasterbideak hautatutako taulak hartzen ditu, oharrak kanpoan uzten ditu, eta ez du ezer egiten taularik hautatuta ez dagoenean. Irakurtzeko soilik dagoen editore baten taula-menuak ez du `Focus on this table` aukerarik, eta lasterbideak jauzi batek hautatutako taula hartzen du. Ikus [Irakurtzeko soilik dauden editoreak](#read-only-editors).  
Hautatutako [taula-talde batek](./table-groups.md) ez du ezertarako balio hemen, ez lasterbidean ez menuko aukeran: haren taulak beraiek hautatuta daudenean soilik hartzen dira, eta hori taldearen menuko `Select tables` aukerak egiten du.  
Ikuspegi mugatuak zer erakusten duen, eta diagrama osora nola itzuli, [Bisualizazioa](./visualization.md#focusing-on-tables) atalean azaltzen da, eta Fluxuak lehenago erakutsi dituen ikuspegietan zehar atzera eta aurrera nola egin, [Aurreko taula eta hurrengo taula](./visualization.md#previous-table-and-next-table) atalean.

## Indizeak {#indexes}

Indizeak taularen propietate-paneleko `Indexes` fitxan definitzen dira, eta esportatutako SQL eskeman sartzen dira.

Ezkerreko aldeak taularen gakoak eta indizeak zerrendatzen ditu, bi multzotan.  
`Keys` multzoak, taulak gakoren bat duenean erakusten denak, haren zutabeek deklaratzen dituzten gakoak zerrendatzen ditu: `PK_<table name>` PK markatutako zutabeen gainean, eta ondoren `UQ_<table name>_<column name>` Unique markatutako zutabe bakoitzeko, zutabeen ordenan. Izenak hautatutako datu-basearen SQL eskemak idazten dituen izen fisikoak dira, Izenen ikuspegia edozein dela ere; beraz, `Bracket` aukera `None` balioan dagoela, `sales.users` bezalako eskemaz kualifikatutako taula batek `PK_users` zerrendatzen du datu-base guztietan, Databricks eta Snowflake izan ezik. Ikus [Eskemaz kualifikatutako taula-izenak](./schema-sql.md#schema-qualified-table-names). Bakoitzak `PK` edo `UQ` etiketa du, eta blokeo-ikono batekin markatuta dago. Hemen irakurtzeko soilik dira, eta zutabeen [PK](./table-editing.md#column-primary-key) eta [Unique](./table-editing.md#not-null-unique-auto-increment) markekin soilik aldatzen dira.  
`Indexes` multzoak taularen indizeak zerrendatzen ditu, gehitu ziren ordenan. Indize bakoitzak indizea bakar bihurtzen duen `UQ` etengailu bat, izen-eremu bat eta indizea kentzen duen `x` botoi bat ditu. [Gako alternatiboa](#alternate-keys) den indize batek bere zenbakia ere erakusten du, esaterako `AK1`. Gehitu indize bat zerrendaren behealdeko `Add Index` botoiarekin.

Eskuineko aldeak taularen zutabeak zerrendatzen ditu `Columns` izenburuaren azpian, bakoitza bere kontrol-laukiarekin. Errenkada bakoitzak zutabearen oihaleko errenkadak dituen gelaxka berberak erakusten ditu, zutabeen ordenari, ikuspegi-aukerei eta [Izenen ikuspegiari](./logical-names.md#beyond-the-canvas) jarraituz. Ezer ez da editagarria ezkerrean indize bat hautatu arte.  
Markatu zutabe bat hautatutako indizeari gehitzeko, eta desmarkatu kentzeko. Gako bat hautatzean, haren zutabeak markatuta agertzen dira, baina kontrol-laukiak desgaituta geratzen dira.  
Hautatutako indizearen zutabeak behean zerrendatzen dira, `Index order` izenburuaren azpian, bakoitza Izenen ikuspegiak izendatzen duen bezala izendatuta, eta `Both Names` ikuspegian izena parentesi artean izen logikoaren ondoren, esaterako `Member Number (member_no)`. Arrastatu heldulekutik ordena aldatzeko, eta egin klik errenkada bateko `ASC` edo `DESC` etiketan haren sailkapen-ordena alderantzikatzeko. Gako alternatibo batean, errenkada bakoitza bere `AK<n>.<m>` markarekin amaitzen da. Zerrendak hiru errenkada erakusten ditu aldi berean, eta gainerakoak korritu egiten dira.

Irakurtzeko soilik dagoen editore batean, gako edo indize bat hautatzean haren zutabeak erakusten dira hala ere, baina ez dago `Add Index` botoirik ez `x` botoirik, eta fitxako beste ezer ezin da aldatu: izenetan ezin da idatzi, kontrol-laukiak desgaituta daude, eta `Index order` errenkadak ez dira arrastatzen ez haien ordenatze-norabidea iraultzen.

[Arakatzaileak](./explorer.md#the-tree) taula bakoitzaren indizeak taularen `Indexes` karpetan zerrendatzen ditu, eta han bat aukeratzean haren taulara joaten da. Haren bilaketak indizeen izenak ere aurkitzen ditu, eta haien izena alda dezake. Ikus [Zer bilatzen duen](./find-and-replace.md#what-it-searches).

![Taularen propietateak orders taulan irekitzea, non Indexes fitxak PK eta UQ gakoak zerrendatzen dituen indizeen gainean, eta ondoren member_id eta ordered_at DESC gaineko indize bat gehitzea eta Schema SQL fitxan irakurtzea](/img/demo-table-properties.webp)

## Gako alternatiboak {#alternate-keys}

Gako alternatiboa bi zutabe edo gehiagoren gaineko indize bakarra da: `Indexes` fitxako indize bat, `UQ` etengailua aktibatuta eta taulako gutxienez bi zutabe markatuta dituena.  
Zutabe bakar baten gaineko indize bakar batek ez du zutabe horren Unique markak baino gehiago adierazten; beraz, ez da gako alternatiboa, eta ezta indize arrunt bat, gako nagusia edo Unique markatutako zutabe bat ere.

[Ikuspegi-aukeretan](#table-view-options) `Alternate Key` aktibatuta dagoela, diagramak gako alternatibo bakoitzaren zutabeak erwin eta IDEF1X notazioetan idazten diren bezala markatzen ditu: `AK1.1`, `AK1.2` eta abar. Aukera lehenespenez desaktibatuta dago.

Gakoak beren zutabeek taulan duten kokapenaren arabera zenbakitzen dira, ez indizeak gehitu ziren ordenaren arabera. `Index order` zerrendako lehen zutabea taulan gorenean duen gakoa `AK1` da. Berdinketa badago, gako bakoitzaren hurrengo zutabeak erabakitzen du, eta gako luzeago baten hasierako zatia den gakoa haren aurretik doa.  
Zutabe bat taularen barruan mugitzeak, edo gako baten `Index order` zerrendaren ordena aldatzeak, gakoak berriro zenbaki ditzake. Gako baten kentzea desegitean, bere zenbakia itzultzen zaio, eta lankide guztiek zenbaki berak ikusten dituzte.

Gako bateko zutabe bakoitza `AK<n>.<m>` markarekin markatzen da, non `n` gakoaren zenbakia den eta `m` zutabeak gakoaren `Index order` zerrendan duen lekua. Hainbat gakotan dagoen zutabe batek marka guztiak daramatza, komaz bereizita.  
Adibidez, `a`, `b` eta `c` zutabeak dituen taula batean, (`c`, `a`) eta (`b`, `a`) gaineko indize bakarrak `AK1` = (`b`, `a`) eta `AK2` = (`c`, `a`) bihurtzen dira, `b` zutabea `c` zutabearen gainean dagoelako. Beraz, `b` zutabeak `AK1.1` dio, `c` zutabeak `AK2.1` eta `a` zutabeak `AK1.2,AK2.2`.

Marka errenkadaren amaieran marrazten da, [zutabeen ordenak](./settings.md#adjusting-column-order) azkenean jartzen duen gelaxkaren ondoren. Ez da gelaxka bat; beraz, ez da inoiz fokuratzen, editatzen edo kopiatzen. Ikus [Taulak editatzea](./table-editing.md).  
Gako nagusiko edo gako arrotzeko zutabe batek AK marka ere izan dezake, markak ez baitu ezer ordezten: errenkadaren hasierako gako-ikonoak PK eta FK erakusten jarraitzen du, eta Unique gelaxkak bere `UQ` mantentzen du.  
Gako alternatiboa duen taula batek errenkada guztietako azken gelaxkaren ondoren lekua gordetzen du bere markarik luzeenarentzat; gako alternatiborik ez duen taula batek bere zabalera mantentzen du.  
Markak ERD oihalean erakusten dira, non `70%` edo gutxiagoko zoomean izenera murriztutako taula batek ez duen bat ere erakusten, eta [irudi-esportazio batean](./file-import-export.md#image), zeinak taula guztiak osorik marrazten dituen zooma edozein dela ere. Bisualizazioa fitxan, `Graph` moduan, [aurrebistak gainetik pasatzean](./visualization.md#hover-preview) ere erakusten ditu; `Flow` txartelek ez dituzte inoiz erakusten.

`Indexes` fitxak zenbakiak erakusten ditu, aukera aktibatuta egon ala ez. Ikus [Indizeak](#indexes).

## Antolaketa automatikoa {#auto-layout}

Oihaleko taula guztiak antolatzen ditu zure ordez.  
Ireki `Auto Layout` aukera oihalaren laster-menutik edo Bilaketa azkarretik, eta aukeratu lau antolaketetako bat:

| Antolaketa | Zer marrazten duen |
| --- | --- |
| `Force` | Simulazio bat: erlazioek taulak elkarrengana erakartzen dituzte, ondoko taulek elkar urruntzen dute, eta gainjarritako taulak bereizi egiten dira. |
| `Flow` | Ezkerretik eskuinera, erlazioei jarraituz, konektore bakoitzari taulan bere ukipen-puntu propioa emanez. Gurutzaketak gutxi izatea bilatzen du, baina beste antolaketa batek saihestuko lituzkeen batzuk utz ditzake. |
| `Tree - vertical` | Geruzatan, beherantz: taula guraso bat harenganako gako arrotz bat duten taulen gainean dago. |
| `Tree - horizontal` | Geruzaketa bera, ezkerretik eskuinera. |

`Force` antolaketak aurrebista bat irekitzen du antolaketa egonkortzen den bitartean, erakusten duen abisuan `Apply` eta `Cancel` botoiekin.  
Aurrebista antolaketa hasi zenean diagramak zuen egoeraren arabera enkoadratzen da; beraz, taulak enkoadraketatik atera daitezke antolaketa egonkortu ahala. `70%` edo gutxiagoko zoomean marrazten da; beraz, haren taulak beren izenera eta kolore-ertzera murriztuta agertzen dira. Ikusten ari zaren Izenen ikuspegian irekitzen da, fitxategiak gordetzen duen ikuspegia edozein dela ere. Ikus [Oihaletik kanpo](./logical-names.md#beyond-the-canvas).  
`Apply` botoiak kokapenak une horretan dauden bezala mantentzen ditu, eta antolaketa bere kasa aplikatzen da geldi geratzen denean. `Cancel` botoiak edo `Escape` teklak diagrama zegoen bezala uzten du.

Beste hirurak behin betean kalkulatzen dira, hari nagusitik kanpo; beraz, ez dago ezer ikusteko: abisu bat erakusten da antolaketa kalkulatzen den bitartean, eta amaitutako antolamendua diagramak dagoeneko hartzen duen eremuaren gainean zentratzen da. `Cancel` botoiak edo `Escape` teklak jada itxaroten ez duzun antolaketa bat baztertzen du, eta worker partekaturik exekutatzen ez duen ostalari batean, antolaketa `Could not place tables` jakinarazpenarekin amaitzen da. Ikus [Web Workers](../../api/installation.md#web-workers). 60 segundoren barruan itzuli ez den antolaketa bat modu berean amaitzen da.

Edozein aukeratzen duzula ere, taulak eta taula-taldeak mugitzen dira, eta oharrak dauden lekuan geratzen dira. Taulak ikusten ari zaren Izenen ikuspegian hartzen duten zabaleran kokatzen dira. Taula batetik bere buruarenganako erlazio bat ez da kontuan hartzen, eta bi taula berberen arteko hainbat erlazio behin bakarrik zenbatzen dira.  
Antolaketa guztiek talde bakoitzeko taulak elkarrekin mantentzen dituzte, taldeak erakutsita egon ala ez, eta taulak dituen talde bakoitza haien inguruan doitzen dute. Ikus [Taula-taldeak](./table-groups.md#auto-layout).  
Emaitza historiako sarrera bakar gisa erregistratzen da; beraz, desegite batek taula eta talde guztiak zeuden lekura itzultzen ditu.  
Irakurtzeko soilik dagoen editore batek ez du `Auto Layout` eskaintzen. Editorea irakurtzeko soilik bihurtzen denean oraindik martxan dagoen batek amaitu egiten du: `Force` aurreikuspena bere abisuarekin ixten da eta bere kokapenik ez du mantentzen, eta oraindik kalkulatzen ari den antolaketa bere abisuarekin baztertzen da; beraz, ez da taularik mugitzen, ez orduan ez editorea berriro idazgarri denean.

![Taula-pila bat txukuntzea oihalaren laster-menuko Antolaketa automatikoaren Flow antolaketarekin, taulak ezkerretik eskuinera lerrokatzen baititu beren erlazioei jarraituz](/img/demo-automatic-table-placement.webp)

## Datu-baseak {#databases}

Onartutako datu-baseak hauek dira:

- Databricks
- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- Snowflake
- SQLite

Aukeratu bat `Database` aukeratik, oihalaren laster-menuan, SQL eskema eta Kode-sortzailea fitxen aukeren panelean edo laster-menuan, edo Bilaketa azkarrean. Guztiek ezarpen bera aldatzen dute. Irakurtzeko soilik dagoen editore baten oihal-menuak ez du `Database` aukerarik, eta besteetan egindako aukera batek pantaila hori bakarrik aldatzen du. Ikus [Irakurtzeko soilik dauden editoreak](#read-only-editors).

Aukera hauek zehazten dituzte esportatzeko SQL eskemaren sintaxia, DataType osatze automatikoa, eta sortutako kodean eta inportatutako eskemetan motak zertara ebazten diren.  
Haiek erabakitzen dute [SQL eskema](./schema-sql.md#options-panel) fitxak `Statements` eta `Header` aukeretako zein idatz ditzakeen. Datu-baseak ez duen aukera bat aukeren panelean geratzen da, lausotuta, eta SQLak datu-baseak duen aukerarik hurbilenera jotzen du.  
Halaber, haiek erabakitzen dute SQL eskemak eta Kode-sortzailearen ORM helburuek zein ON DELETE eta ON UPDATE ekintza idazten dituzten, eta erlazioen menuek zein markatzen dituzten `not in <database>` etiketarekin. Ikus [ON DELETE eta ON UPDATE](./relationship-editing.md#on-delete-and-on-update) eta [Kode-sortzailea](./code-generator.md#database).  
SQL eskema inportatzean, zutabe baten datu mota mantentzen da, argumentu-zerrenda barne, editoreak zerrendatzen duen ala ez, esaterako `TIMESTAMP WITH TIME ZONE`, `public.mood` edo `integer[]`. Ikus [Datu motak](./file-import-export.md#data-types). DataType osatze automatikoak hautatutako datu-baseak zerrendatzen dituen motak soilik iradokitzen ditu.

![Datu-basea PostgreSQL datu-basera aldatzea, eta ondoren PostgreSQL mota bat aukeratzea osatze automatikoan](/img/demo-database.webp)

![DataType osatze automatiko lausoa, gezi-teklekin mugitua eta Right, Tab edo Enter teklekin onartua](/img/demo-data-type-autocomplete.webp)

## Oihaleko tresna-barra {#canvas-toolbar}

Tresna-barra txiki bat oihalaren beheko ertzaren erdiaren gainean flotatzen da, eta, ezkerretik eskuinera, oihalean bertan eragiten duten tresnak eta hari zerbait gehitzen dioten komandoak ditu:

- Esku-tresna eta hautapen-tresna. Hautapen-tresna da lehenetsia; esku-tresnak arrastatze oro ikuspegiaren mugimendu bihurtzen du, tauletan zein leku hutsean. `Space` teklak bien artean txandakatzen du. [`New Table Group`](./table-groups.md#drawing-a-group) marrazketa bat prest dagoen bitartean, `New Table Group` botoia markatuta agertzen da bietako baten ordez, eta bietako batean klik egiteak, `Space` sakatzeak edo erlazio-notazio bat aukeratzeak marrazketa amaitzen du talderik gehitu gabe.
- `New Table`, `New Memo` eta `New Table Group`. `New Table` botoiak taula bat gehitzen du `Alt + N` lasterbideak bezala, eta `New Memo` botoiak ohar bat gehitzen du `Alt + M` lasterbideak bezala. `New Table Group` botoiak [taldearen marrazketa](./table-groups.md#drawing-a-group) prest jartzen du `Alt + G` lasterbideak bezala, eta esku-tresna desaktibatzen du; bigarren klik batek, bigarren `Alt + G` batek bezala, marrazketa amaitzen du talderik gehitu gabe. `New Memo` ez da agertzen View Option → `Memos` aukerak oharrak ezkutatzen dituen bitartean, ezta `New Table Group` ere View Option → `Table Groups` aukerak taldeak ezkutatzen dituen bitartean.
- Zooma: `Zoom out`, uneko zooma ehunekotan eta `Zoom in`. Bi botoiek zooma urratsez urrats aldatzen dute, zoom-lasterbideek bezala, eta ehunekoan klik eginez gero, `100%` baliora itzultzen da.
- Lau erlazio-notazioak, erlazio bat hasteko erabiltzen dituzun lau berak. Ikus [Editatzen hastea](./editing-start.md). Bat aukeratzean, hautapen-tresnara itzultzen da, erlazio bat bi tauletan klik eginez marrazten baita.
- `Name View`, behera begirako gezi bat duen botoia, indarrean dagoen ikuspegia izendatzen duena: `Physical Names`, `Logical Names` edo `Both Names`. Zabalera bera mantentzen du izendatzen duen ikuspegia edozein dela ere; beraz, ikuspegi-aldaketa batek ez du inoiz tresna-barra mugitzen. Klik eginez gero, hiru ikuspegien zerrenda irekitzen da tresna-barraren gainean, indarrean dagoena markatuta. Bat aukeratzean, hartara aldatzen da eta zerrenda ixten da; botoian bigarren klik bat eginez, beste edozein lekutan sakatuz edo `Escape` sakatuz, zerrenda ixten da ikuspegia aldatu gabe. Ikuspegi bakoitzak zer marrazten duen [Izenen ikuspegia](./logical-names.md#name-view) atalean azaltzen da, eta ikuspegi-aldaketa bat gordetzen den ala ez [Ikuspegia aldatzea](./logical-names.md#switching-the-view) atalean.
- Zen modua, `Alt + Z`, oihala eta tresna-barra hau izan ezik dena kentzen duena. Berriro `Alt + Z` sakatuz, edo botoiarekin, gainerakoa itzultzen da. Irekita dagoen Arakatzailea gainerakoarekin batera ezkutatzen da, itxi gabe, eta harekin batera itzultzen da. Zen moduan ere ireki daiteke. Ikus [Bazterrean gelditzen denean](./explorer.md#when-it-stands-aside).
- `Go to content` iparrorratza, tresna-barraren amaierari gehitzen zaiona pantailan ez taularik, ez erakutsitako oharrik, ez erakutsitako taula-talderik ez dagoen bitartean soilik. Ikus [Oihalean zehar mugitzea](#getting-around-the-canvas).

Lasterbidea duen botoi orok bere argibidean adierazten du lasterbide hori, esaterako `New Table (Alt + N)` (Windows/Linux) edo `New Table (⌥ + N)` (Mac).  
Tresna-barra bazterrean gelditzen da `Force` Antolaketa automatikoaren aurrebista, Taularen propietateak, Denbora-bidaia edo Diferentzia-ikustailea irekita dagoen bitartean, eta ixten denean itzultzen da.  
Irakurtzeko soilik dagoen editore baten tresna-barrak zooma, `Name View`, zen modua eta `Go to content` iparrorratza mantentzen ditu. Ez du esku-tresnarik edo erakusle-tresnarik, ez `New Table`, `New Memo` edo `New Table Group` botoirik, eta ez notaziorik, eta editorea berriro idazgarri bihurtzen denean itzultzen zaizkio.

![Taula bat eta ohar bat tresna-barratik gehitzea, New Table Group prest jartzea eta bertan behera uztea, esku-tresnarekin ikuspegia mugitzea, zooma urratsez urrats aldatzea, eta zen modua ⌥ + Z bidez aktibatzea eta desaktibatzea](/img/demo-canvas-toolbar.webp)

## Handiagotu/txikiagotu {#zoom-inout}

`Ctrl + Wheel` (Windows/Linux) edo `⌘ + Wheel` (Mac) bidez egiten da zooma. Gurpila bakarrik erabilita, oihalaren ikuspegia mugitzen da.  
Ukipen-paneleko atximur-keinuak ere zooma egiten du, atximurka egiten duzun puntuaren inguruan, eta baita ukipen-pantaila bateko bi hatzek ere, mugitu ahala ikuspegia ere mugitzen baitute.  
Lasterbideak: `Ctrl + Plus` (Windows/Linux) edo `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) edo `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) edo `⌘ + 0` (Mac) lasterbideak zuzenean `100%` baliora itzultzen du zooma, pantailaren erdigunea dagoen lekuan mantenduz.

[Oihaleko tresna-barrako](#canvas-toolbar) `Zoom out` eta `Zoom in` botoiek zooma urratsez urrats aldatzen dute, `Minus` eta `Plus` lasterbideek bezala: sakatze bakoitzak 4 ehuneko-puntu mugitzen du, pantailaren erdigunea dagoen lekuan mantenduz. Bien arteko ehunekoak uneko zooma erakusten du, eta hartan klik eginez gero, zuzenean `100%` baliora itzultzen da, `Ctrl + 0` (Windows/Linux) edo `⌘ + 0` (Mac) lasterbideak bezala.

Zooma `10%` eta `150%` artekoa da.  
`70%` edo gutxiagoko zoomean, taulak beren izenera eta kolore-ertzera murrizten dira, eta gelaxken edizioak, gelaxken lasterbideek eta kopiatu eta itsatsi ekintzek funtzionatzeari uzten diote berriro handiagotu arte. Murriztutako taula batek erakusten duen izenak Izenen ikuspegiari jarraitzen dio. Ikus [Izenen ikuspegia](./logical-names.md#name-view).

Hiru lasterbide berek Bisualizazioa fitxan ere egiten dute zooma, `Graph` zein `Flow` moduan, modu bakoitzak bere tartearen barruan. Ikus [Bisualizazioa](./visualization.md#toolbar).

![⌘ + Wheel bidez txikiagotzea taulak beren izenera murriztu arte, eta ondoren urratsez urrats itzultzea ⌘ + Plus, ⌘ + Minus eta ⌘ + 0 bidez](/img/demo-zoom.webp)

## Oihalean zehar mugitzea {#getting-around-the-canvas}

Oihalak ez du ertzik, ezta ezarri beharreko tamainarik ere. Taulak eta oharrak jartzen dituzun lekuan geratzen dira, eta beheko guztiak diagrama deskribatzen du, ez orri finko bat.

Arrastatu oihaleko eremu huts bat ikuspegia mugitzeko, edo aldatu esku-tresnara `Space` teklarekin eta arrastatu edonon, taula baten gainean barne. Gurpilak ere mugitzen du ikuspegia, eta `Shift + Wheel` lasterbideak alboetara mugitzen du.  
[Taula-talde baten](./table-groups.md#selecting-groups) gorputza, titulu-barraren azpiko eremua, oihal hutsa da ezkerreko botoiarentzat: hura arrastatzean ikuspegia mugitzen da, `Ctrl + drag` (Windows/Linux) edo `⌘ + drag` (Mac) eginez gero hautapen-lauki bat marrazten da, eta klik batek hautapena garbitzen du.  
Ikuspegiaren mugimenduak ez du mugarik: gurpilak, arrastatze batek eta esku-tresnak ikuspegia mugitzen duzun bezain urrun eramaten dute, edozein aldetan taulez haraindi.

Arrastatu saguaren erdiko botoiarekin (sakatu gurpila) oihaleko edozein lekutatik ikuspegia mugitzeko, hautapen-tresnarekin zein esku-tresnarekin. Sakatzea taula, ohar, gelaxka, ikono edo erlazio batean egiten denean ere funtzionatzen du.  
Erdiko botoiarekin arrastatzeak ez du ezer hautatzen, mugitzen edo klikatzen, eta hautapena mantentzen du. Irekita dagoen laster-menua eta kolore-hautatzailea ixten ditu, eta ez dira abiarazten nabigatzailearen beraren erdiko klikeko korritzea eta itsastea.  
Korritze-barretan, minimapan, oihaleko tresna-barran edo irekita dagoen gelaxka- edo ohar-editore batean erdiko botoiarekin sakatzeak ez du ikuspegia mugitzen.

Goiko eskuineko izkinako minimapak diagrama irudikatzen du alde bakoitzean pantaila bateko tartearekin, korritze-barrek iristen duten eremu berarekin, sareta lodi batera kanpoalderantz doituta; beraz, zenbat eta gehiago txikiagotu, orduan eta txikiagoa ageri da diagrama bertan. Egin klik bertan ikuspegia puntu horretara eramateko, edo arrastatu ikuspen-eremuaren laukizuzena ikuspegia mugitzeko. Txikiagotu ahala, ikuspen-eremuaren laukizuzena handitu egiten da mapako zati handiagoa estaltzeko.  
Taula bakoitza taularen kolorean marrazten du, eta erakutsitako taula-talde bakoitza taldearen koloreko koadro gisa, haren taulen atzean.  
Eskuineko eta beheko ertzetako korritze-barrek ibilbide bera adierazten dute, diagrama pantailaren alde batetik justu kanpo dagoenetik beste aldetik justu kanpo dagoen arte doana; beraz, marraztutako diagrama baino gutxienez pantaila bat luzeagoa da, eta are luzeagoa ikuspegia haratago dagoen bitartean. Zen modutik kanpo, bi korritze-barrak erakusten dira dokumentuak taula bat, erakutsitako ohar bat edo erakutsitako taula-talde bat duen guztietan, dena pantailan sartzen denean ere. Horietako bat ere ez duen dokumentu batek, esaterako ohar bakarrak View Option → `Memos` aukerarekin ezkutatuta dituen batek, ez du korritze-barrarik erakusten, ezta minimaparik ere.  
Korritze-barra baten heldulekua edo minimaparen ikuspen-eremuaren laukizuzena arrastatzea da gelditu egiten den mugimendu bakarra: ez da pantailatik justu kanpo dauden taulak baino urrunago joaten, edo arrastatzea hasi zen lekua baino urrunago, hura kanpoalderago bazegoen.

Ikuspegia mugitzean pantailan ez badago ez taularik, ez erakutsitako oharrik, ez erakutsitako taula-talderik, `Go to content` iparrorratz bat gehitzen zaio [oihaleko tresna-barraren](#canvas-toolbar) amaierari, hurbilena seinalatzen duen gezi batekin eta zein urrun dagoen adierazita. Egin klik bertan hura zentratzeko, zooma aldatu gabe.

![Ikuspegia mugitzea oihal hutsa arrastatuz, gurpilarekin, taula baten gainean erdiko botoiarekin arrastatuz eta minimapatik, eta ondoren Shift + wheel bidez edukitik haratago joatea eta Go to content iparrorratzari jarraituz itzultzea](/img/demo-canvas-navigation.webp)

### Jauziaren helmuga {#where-a-jump-lands}

Oihaleko zerbaitera eramaten zaituen joate-ekintza orok arau bakar baten arabera mugitzen du ikuspegia: [Bilaketa azkarraren](./quick-search.md#searching-the-diagram) `#`, `@` eta `:` emaitzak, [Arakatzailearen](./explorer.md#going-to-a-row) errenkadak eta haren [Bilatu eta ordeztu](./find-and-replace.md#going-to-a-match) bilaketaren bat-etortzeak, [Diferentzia-ikustailearen](#going-to-a-change) zerrendako errenkadak, Fluxu moduko kanpo-estekaren [txartel-botoia](./visualization.md#card-buttons), Hiztegia fitxako [Egiaztapenak orrian](./dictionary.md#the-checks-sheet) taula bat edo zutabe bat izendatzen duen egiaztapen bat, eta [Inportatu eta gehitu](./file-import-export.md#import-and-add) ekintza baten helmuga. Atal horietako bakoitzak dio joate-ekintzak zer hautatzen duen; honek, ikuspegia nora joaten den.

Jauzi batek ez du inoiz zooma aldatzen, eta korritze bat egiten du gehienez. Beste fitxa batetik, lehenik ERD fitxara aldatzen da.  
Oihala ikusten den bezala neurtzen du: goiko tresna-barraren azpian, edo altuera osoa zen moduan, eta irekita dagoen Arakatzailearen eskuinaldean, Arakatzaileak oihala estali beharrean estutu egiten baitu.

Norabide horizontala eta bertikala bereizita ebaluatzen dira, eta helburua dagoeneko ondo ikusten den norabidea dagoen-dagoenean uzten da:

- Norabide horretan oihalaren erdia baino luzeagoa ez den helburu bat bere lekuan geratzen da haren erdigunea oihalaren erdiko bi laurdenetan dagoen bitartean: horizontalean edo bertikalean, laurden baten eta hiru laurdenen artean. Bestela, haren erdigunea oihalaren erdira eramaten da.
- Mutur bakoitzean `40px` tarterekin oraindik sartzen den helburu luzeago bat bere lekuan geratzen da osorik ikusgai dagoen bitartean. Bestela, horizontalean, zentratu egiten da; bertikalean, haren goiko aldea oihalaren goiko aldetik `40px` beherago eramaten da.
- Hori baino luzeagoa den helburu bat bere lekuan geratzen da osorik ikusgai dagoen bitartean, edo, oihala baino luzeagoa denean, haren funtsezko zatia, behean zerrendatua, ikusgai dagoen bitartean. Bestela, sartzen bada, zentratu egiten da; sartzen ez bada, erdigunetik ahalik eta hurbilen kokatzen da, haren funtsezko zatiaren bi muturrak oihalaren barruan gutxienez `40px` gera daitezen; horretarako luzeegia den funtsezko zati baten hasiera `40px` barrurago mantentzen da.

Beraz, oihalaren ezkerreko ertzetik hurbil eta altueraren erdian dagoen taula txiki bat horizontalean soilik mugitzen da.

Jauzi batek zer ekartzen duen ikusgai, eta osoa sartzen ez denean ikusi behar den funtsezko zatia:

- Taula bat: taula osoa, eta funtsezko zatia goiko izen-banda da, edo haren iruzkin-gelaxka taula-iruzkin bateko bat-etortze batean, View Option → `Table Comment` aukerak iruzkinak erakusten dituen bitartean. `70%` edo gutxiagoko zoomean, taulak beren izenera murrizten direnean, funtsezko zatia laukiaren erdiko izena da.
- Zutabe bat: haren errenkada, eta funtsezko zatia jauziak helburu duen gelaxka da: haren izena, haren izen logikoa izen logikoko bat-etortze baterako edo izen logikoari buruzko egiaztapen baterako, haren Domain gelaxka haren domeinuari buruzko egiaztapen baterako, edo bat-etortzea dagoen iruzkina, View Option → `Column Comment` aukerak iruzkinak erakusten dituen bitartean. Errenkadak halako gelaxkarik marrazten ez duenean, jauzia haren ordez marraztutako gelaxkara joaten da: izen logikoa izenaren ordez `Logical Names` ikuspegian, izena izen logikoaren ordez `Physical Names` ikuspegian, eta mota-gelaxka Domain gelaxkaren ordez View Option → `Domain` desaktibatuta dagoen bitartean, edo errenkada osoa `DataType` ere desaktibatuta dagoen bitartean. `70%` edo gutxiagoko zoomean, zutabe batek bere taula ekartzen du ikusgai, taularen arauaren arabera.
- Osorik erakusteko zabalegia den gelaxka bat, esaterako iruzkin luze bat: funtsezko zatia bertan bat datorren testua da. Bat-etortzea dagoen gelaxkaren ordez marraztutako gelaxkara egiten den jauzi batean, esaterako izenera `Physical Names` ikuspegiko izen logikoko bat-etortze batean, funtsezko zatia ez da testua.
- Erlazio bat: bere bi taulak hartzen dituen laukia, eta funtsezko zatia taula umea da.
- Taula-talde bat: haren koadroa, eta funtsezko zatia haren titulu-barra da.
- Ohar bat, edo Inportatu eta gehitu ekintza batek kokatzen duen blokea: osorik.

Bi norabideetako batean ere mugitu beharrik ez dagoenean, ez da korritzerik egiten; beraz, leku berera bi aldiz jarraian joatean, bigarren aldian ez da ezer mugitzen. Oihala korritzen duen jauzi batek korritzea [desegite-historian](./undo-redo.md#what-the-history-records) erregistratzen du, ikuspegiaren kokapenaren beste edozein aldaketa bezala, eta ezer mugitzen ez duenak ez du ezer uzten desegiteko. Inportatu eta gehitu ekintza batean, korritzea gehikuntzaren urrats bereko parte da. Diferentzia-ikustailearen zerrendako errenkada batek ikuspegiaren irakurtzeko soilik diren aldeak baino ez ditu mugitzen; beraz, ez du ezer erregistratzen, eta irakurtzeko soilik dagoen editore batek ez du jauzirik erregistratzen.  
Jauzi batek ere ez du marrazten ari zaren erlazio bat hasten edo amaitzen. `Go to content` iparrorratza ez da jauzia: seinalatzen duena zentratzen du.

## Diferentzia-ikustailea {#diff-viewer}

Aurretik gordetako dokumentuak uneko dokumentuarekin aldera ditzakezu.  
Aukeratu `Diff Viewer` oihalaren laster-menuan, eta hautatu lehenago esportatu zenuen `.json` dokumentu bat.

Ikuspegia oihalaren gainean irekitzen da: aldatu dena ezkerrean, eta ondoren gordetako dokumentua eta unekoa elkarren ondoan.  
Uneko dokumentua ikuspegia irekitzen den unean dagoen bezala alderatzen da; ondoren egindako aldaketak, lankide batenak barne, ez dira ikuspegira iristen. Bi aldeak ikusten ari zaren Izenen ikuspegian irekitzen dira eta hartan geratzen dira, fitxategietako edozeinek gordetzen duen ikuspegia edozein dela ere. Ikus [Oihaletik kanpo](./logical-names.md#beyond-the-canvas). Irekita dagoen [Arakatzailea](./explorer.md#when-it-stands-aside) ezkutatu egiten da ikuspegia irekita dagoen bitartean; beraz, ikuspegiak editorearen zabalera osoa hartzen du.  
Alde bakoitzaren ikuspegia gurpilarekin mugitzen da, eremu huts bat edo taula-talde baten gorputza arrastatuz, edo haren gaineko edozein lekutan erdiko botoiarekin arrastatuz, eta zooma `Ctrl + Wheel` (Windows/Linux), `⌘ + Wheel` (Mac) edo atximur-keinu baten bidez egiten da. `70%` edo gutxiagoko zoomean, haren taulak oihalean bezala murrizten dira. Ikus [Bi aldeetako markak](#marks-on-the-two-sides).  
Bi aldeak irakurtzeko soilik dira; beraz, zure dokumentuan ez da ezer aldatzen. Bakoitzak bere hautapena mantentzen du, eta bertako taula batean klik egiteak alde horretan bakarrik hautatzen du.  
Itxi ikuspegia irekitzean agertzen den `Diff Viewer` abisuko `Close` botoiarekin, edo `Escape` teklarekin.  
Irakurtzeko soilik dagoen editore batek ere eskaintzen du `Diff Viewer`, eta ikuspegiak han edozein editoretan bezala funtzionatzen du; alde bateko taula batean klik egiteak oraindik alde horretan hautatzen du. Editorea irakurtzeko soilik bihurtzen denean irekita dagoen ikuspegi bat irekita geratzen da.

![Diferentzia-ikustailea gordetako .json fitxategi batekin irekitzea, haren zuhaitzean A, M, D eta R markatutako errenkadetan klik egitea, izenaren arabera iragaztea eta ixtea](/img/demo-diff-viewer.webp)

### Zer alderatzen den {#what-is-compared}

Taula, zutabe, indize, gako arrotz, ohar eta taula-talde guztiak alderatzen dira.  
Elementu bakoitza lehenik bere identifikatzailearen arabera parekatzen da; beraz, fitxategi beraren aurreko bertsio baten aurrean, identifikatzaileak mantentzen dituenez, izena aldatu zaion taula, zutabe, indize edo taula-talde bat elementu bakarra da oraindik, izena aldatua gisa zerrendatuta.  
Geratzen dena banan-banan parekatzen da mantentzen duenaren arabera: taula edo taula-talde bat bere izenaren arabera, maiuskulak eta minuskulak bereiziz; zutabe edo indize bat bere taularen eta izenaren arabera; gako arrotz bat bere bi taulen eta zutabe-bikoteen arabera; eta ohar bat bere testuaren arabera, eta ondoren bere kokapenaren arabera. Izenik gabeko indize bat bere zutabeen, haien ordenaren eta norabidearen, eta bakarra den ala ez kontuan hartuta parekatzen da, eta izenik gabeko taula-talde bat taula gehien partekatzen dituen taldearekin.  
Beraz, beste nonbaitetik datorren fitxategi baten aurrean, esaterako SQL inportazio baten bidez berreraikitako diagrama baten aurrean, izena aldatu zaion taula bat kendutako bat eta gehitutako bat gisa agertzen da.

Zer hartzen den aldaketatzat:

- Taula bat: haren izena, iruzkina, taula-taldea, kokapena eta kolorea.
- Zutabe bat: haren izena, iruzkina, datu mota, balio lehenetsia, Auto Increment, gako nagusia, Unique, Not Null eta taulan duen lekua. Bi dokumentuek partekatzen duten ordenatik kanpo dauden zutabeak soilik hartzen dira mugitutzat; beraz, zutabe bat gehitzeak, kentzeak edo mugitzeak ez ditu besteak markatzen.
- Indize bat: haren izena, UNIQUE eta haren zutabeak, beren ordena eta norabidearekin.
- Gako arrotz bat: haren zutabe-bikoteak, erlazio mota, eta ON DELETE eta ON UPDATE ekintzak.
- Ohar bat: haren testua, kokapena, tamaina eta kolorea.
- Taula-talde bat: haren izena, dituen taulak, kolorea, kokapena eta tamaina.

Beraz, mugitu, tamainaz aldatu edo kolorez aldatu besterik egin ez zaion taula, ohar edo talde bat aldatutzat hartzen da. Kokapenak eta tamainak pixel osotan alderatzen dira, eta pilatze-ordena eta konektore batek taula bat non ukitzen duen ez dira inoiz kontuan hartzen.  
Izen logikoak, domeinu-loturak eta [Hiztegia](./dictionary.md) fitxako hitzak, terminoak eta domeinuak ez dira alderatzen; beraz, haiei bakarrik dagokien aldaketa bat ez da zerrendatzen ezta markatzen ere. Domeinu batek aldatutako datu mota bat, berriz, kontuan hartzen da, zutabearen datu motaren aldaketa gisa.

### Aldaketen zuhaitza {#the-change-tree}

Ezkerreko zerrenda [Arakatzailearen zuhaitza](./explorer.md#the-tree) bezala marrazten da, eta aldatu dena soilik dauka: `Tables`, `Table Groups` eta `Memos`, bakoitza errenkadaren bat duenean soilik erakutsita, eta taula baten azpian haren `Columns`, `Indexes` eta `Foreign Keys`. Gako arrotz bat bere taula umearen azpian zerrendatzen da, eta gehitutako edo kendutako taula batek ez du ezer zerrendatzen bere barruan.  
Karpeta bakoitzak zenbat errenkada dituen erakusten du, eta karpeta eta taula guztiak zabalduta hasten dira.  
Taula- edo zutabe-errenkada bat aldeak ireki ziren Izenen ikuspegian izendatzen da. `Both Names` ikuspegian, izen logikoa erakusten du eta haren ondoren izena, lausotua, eta kendutako errenkada batean izen lausotua ere gainerakoarekin batera marratuta dago. Taulak eta taula-taldeak izenaren arabera zerrendatzen dira, maiuskulak eta minuskulak bereizi gabe, ikuspegia edozein dela ere. Oharrek, eta taula baten zutabeek, indizeek eta gako arrotzek, uneko dokumentuaren ordena mantentzen dute, eta kendutako bat zegoen lekuan jartzen da berriro. Ohar baten errenkadak oharraren lehen lerroa erakusten du, eta gako arrotz baten errenkadak bere zutabe umeak, eta ondoren `→` ikurra taula gurasoarekin eta haren zutabeekin, esaterako `user_id → users(id)`. Izen huts batek `unnamed` dio letra etzanez.

Errenkada bakoitza letra batekin amaitzen da, eta `A`, `D`, `M` edo `R` markatutako errenkada batek bere izena letraren kolorean du:

- `A`, gehitua, berdez: uneko dokumentuan soilik.
- `D`, kendua, gorriz eta marratuta: gordetako dokumentuan soilik.
- `M`, aldatua, anbar kolorez: bietan, aldatuta.
- `R`, izena aldatua, urdinez: bietan, izen berri batekin. Izen-aldaketak lehentasuna du beste edozein aldaketaren aurrean, eta argibideak horiek ere zerrendatzen ditu.
- `~`, anbar kolorez, karpeta guztien amaieran dago, baita barruan aldatu denagatik soilik zerrendatutako taula baten amaieran ere; haien izenek ohiko kolorea mantentzen dute.

Pasatu sagua errenkada baten izenaren gainetik haren argibidea ikusteko: egoera, `Added`, `Deleted`, `Modified`, `Renamed` edo `Changed inside`, eta ondoren lerro bat aldaketa bakoitzeko, esaterako `Name: users → members` edo `NN: ✗ → ✓`. Testu bat bere lehen lerroarekin aipatzen da, 40 karaktereren ondoren moztuta, eta balio huts batek `—` dio. Gehitutako edo kendutako elementu baten argibidea bere egoera bakarrik da.

Zuhaitzaren gaineko `Filter by name` eremuak uneko edo gordetako izenean, edo uneko edo gordetako izen logikoan, idazten duzuna duten errenkadak mantentzen ditu, maiuskulak eta minuskulak bereizi gabe, Izenen ikuspegi guztietan. Izena bat datorren taula batek bere errenkada guztiak mantentzen ditu, eta bat ez datorrenak bat datozen errenkadak soilik mantentzen ditu. Ezerekin bat ez datorren iragazki batek zuhaitza hutsik uzten du.  
Bi dokumentuak batere desberdinak ez direnean, zuhaitzak `No changes` dio.

Arrastatu zuhaitzaren eskuineko ertza zabalago edo estuago egiteko, `200px` eta `480px` artean, eta egin klik bikoitza ertzean `260px` zabalerara itzultzeko. Diferentzia oro `260px` zabalerarekin irekitzen da, eta bi aldeek gainerako zabalera berdin banatzen dute.  
Teklatuarekin zuhaitzean zehar Arakatzailearenean bezala mugitzen zara, baina hemen `Escape` teklak, zuhaitzean edo `Filter by name` eremuan, ikuspegia ixten du. Ikus [Arakatzaileko teklak](./explorer.md#keys-in-the-explorer).

### Aldaketa batera joatea {#going-to-a-change}

Egin klik errenkada batean, edo sakatu `Enter` edo `Space` teklatuaren fokua bertan dagoela, haren elementura joateko hura duen alde bakoitzean: gehitutako elementu batera uneko aldean soilik, kendutako batera gordetako aldean soilik, eta biek dutenera bi aldeetan. Karpeta-errenkada batek tolestu edo zabaldu besterik ez du egiten, eta gauza bera gertatzen da taula-errenkada baten hasierako geziarekin.

- Taula, zutabe edo indize baten errenkadak taula bakarrik hautatzen du.
- Gako arrotz baten errenkadak bere bi taulak ekartzen ditu ikusgai, edo taula umea, biak elkarrekin erakusteko urrunegi daudenean; taula umea hautatzen du bere gako arrotzeko zutabeekin, eta konektorea argiztatzen du. Ikus [Konektore bat irakurtzea](./relationship-editing.md#reading-a-connector).
- Ohar baten errenkadak oharra hautatzen du, eta taula-talde baten errenkadak taldea. Alde bateko dokumentuak ezkutatzen duen ohar edo talde batek ez du inora eramaten alde horretan.

Alde bakoitza [Jauziaren helmuga](#where-a-jump-lands) ataleko arauaren arabera mugitzen da, alde horretan neurtuta; beraz, errenkada berean berriro klik egiteak ez du ezer mugitzen.

### Bi aldeetako markak {#marks-on-the-two-sides}

Bi aldeek testua, ingeradak eta konektoreak koloreztatzen dituzte, eta ez dute ezer betetzen. Gehitua berdea da eta uneko aldean soilik ageri da, kendua gorria da eta gordetako aldean soilik ageri da, eta aldatua, anbar kolorez, eta izena aldatua, urdinez, bi aldeetan ageri dira. Aldatu gabeko guztia ohi bezala marrazten da.

- Gehitutako edo kendutako taula edo taula-talde batek dagokion koloreko ingerada du, eta haren izenak kolore hori hartzen du. Gehitutako edo kendutako ohar batek ingerada du.
- Bi dokumentuek duten taula batean gehitutako edo kendutako zutabe batek bere errenkada osoa koloreztatzen du, eta mugitu den zutabe batek bere errenkada osoa anbar kolorez jartzen du. Gehitutako edo kendutako taula baten barruko ezer ez da bere aldetik markatzen.
- Aldatutako gelaxka baten testua anbar kolorez jartzen da: taula baten iruzkina, zutabe baten iruzkina, datu mota, balio lehenetsia, Auto Increment, Unique edo Not Null, edo ohar baten testua. Gako nagusiko aldaketa batek zutabearen gako-ikonoa anbar kolorez jartzen du.
- Izena aldatu zaion taula, zutabe edo taula-talde batek bere izena urdinez du.
- Gelaxka propiorik ez duen aldaketa bat duen taula, ohar edo taula-talde batek, esaterako mugimendu bat, tamaina edo kolore berri bat, edo talde-aldaketa bat edo talde baten taulen aldaketa bat, anbar koloreko ingerada du.
- Gehitutako, kendutako edo aldatutako gako arrotz batek bere konektorea kolore horretan marrazten du. Haren gainetik sagua pasatzean, edo errenkada batek argiztatzen duenean, ohiko gainetik pasatzeko kolorean marrazten da horren ordez.
- Indize-aldaketa batek ez du ezer markatzen ez alde batean ez bestean; zuhaitzean soilik ageri da.

Alde bakoitzak bere dokumentuaren ikuspegi-aukerei jarraitzen die. Alde horrek marrazten ez duen gelaxka bateko aldaketa izenean ageri da horren ordez. Ikuspegi-aukera batek ezkutatzen duen gelaxka bateko zutabe-aldaketa batek, esaterako `Unique` edo `Auto Increment`, biak lehenespenez desaktibatuta, zutabearen izena anbar kolorez jartzen du, eta gauza bera egiten du gako-ikonorik erakusten ez duen errenkada bateko gako nagusiko aldaketa batek. `Table Comment` desaktibatuta dagoen bitartean, taula-iruzkin bateko aldaketa batek taularen izena anbar kolorez jartzen du. Izen-aldaketaren urdina anbar honen gainetik nagusitzen da. Bere dokumentuak ezkutatzen duen ohar edo taula-talde bat zuhaitzean zerrendatzen da, baina ez da alde horretan marrazten.

Izen-gelaxkarik marrazten ez duen `Logical Names` ikuspegian, izen-aldaketa baten urdina eta aldeak marrazten ez duen gelaxka bateko aldaketa baten anbarra izenaren lekuan marraztutako izen logikoan jartzen dira. Datu motaren aldaketa batek mota-gelaxka anbar kolorez jartzen du Izenen ikuspegi guztietan, gelaxkak domeinu baten izena erakusten duen lekuan ere. Bi aldeetako batek ere ez ditu marrazten Hiztegiaren egiaztapenek oihaleko izenei ematen dizkieten koloreak. Ikus [Oihaleko markak](./dictionary.md#marks-on-the-canvas).

`70%` edo gutxiagoko zoomean, murriztutako taulek beren ingerada mantentzen dute. Izenak gehitutako edo kendutako taula baten berdea edo gorria mantentzen du, edo izen-aldaketa baten urdina, eta bestela iruzkin-aldaketa baten anbarra hartzen du. Zutabe-aldaketak ez dira marrazten berriro handiagotu arte; zuhaitzak, hala ere, zerrendatzen ditu.

## Irakurtzeko soilik dauden editoreak {#read-only-editors}

[`readonly`](../../api/erd-editor-element.md#readonly) atributua duen editore bat, adibidez VS Code editorean diagrama gisa berriro irekitako Git berrikuspen bat, irakurle bat da. Bere sei fitxak, [Arakatzailea](./explorer.md#read-only-editors), minimapa, korritze-barrak eta lankideen kurtsoreak eta hautapenak geratzen dira, eta diagrama aldatuko lukeen kontrol oro desagertu egiten da, lausotu beharrean.

ERD oihalean:

- Arrastatze batek oihala mugitzen du hasten den tokian hasita ere: oihal hutsean, taula batean, ohar batean edo taula-talde batean. Erdiko botoiak, gurpilak, ukitu-keinuak eta zoom-teklek edozein editoretan bezala funtzionatzen dute.
- Erakuslea taula baten gainean geldi uzteak haren erlazioak pizten ditu. Mugitzen ez den klik batek iristen den taularen erlazioak pizten ditu, edo iristen den erlazioa, eta beste edonon egindako klik batek argia itzaltzen du.
- Ezer ez da hautatzen sakatzeagatik, hautapen-koadroagatik edo dena-hautatzeko teklagatik. Jauzi batek soilik hautatzen du: [Arakatzaileko](./explorer.md#going-to-a-row) errenkada batek, haren [Bilatu eta ordeztu](./find-and-replace.md#going-to-a-match) funtzioko bat-etortze batek, edo [Bilaketa azkarreko](./quick-search.md#searching-the-diagram) `#`, `@` edo `:` emaitza batek iristen den elementua hautatzen du, edozein hautapenak bezala ingeradaz markatuta, fokuratutako gelaxkarekin jauziak jartzen duen tokian. Mugitzen ez den klik batek hautapen hori garbitzen du.
- Gezi-teklek fokuratutako gelaxka mugitzen dute. Kopiatzeak, `Table Properties` eta `Focus on this table` aukerek jauzi batek hautatutakoan funtzionatzen dute, beren teklekin, eta itsasteak ez du ezer gehitzen. Beste teklak [Lasterbideak](./settings.md#shortcuts) atalean zerrendatzen dira.
- Ez da gelaxkarik, oharrik edo taula-talde izenik irekitzen edizioarako. Ez dago `+` edo `x` botoirik tauletan, oharretan eta taldeetan, ez dago tamaina aldatzeko ertzik oharretan eta taldeetan, ez dago zutabe-arrastatzeko heldulekurik, eta ez dago kolore-hautatzailerik.

Oihalaren laster-menuak `View Option`, `Name View`, `Export` eta `Diff Viewer` mantentzen ditu. Ez du `New Table`, `New Memo`, `New Table Group`, `Toggle Explorer`, `Relationship`, `Derive Physical Names Again`, `Database`, `Import`, `Import and Add` ez `Auto Layout` aukerarik.  
Taula baten menuak `Table Properties` aukera bakarrik mantentzen du, eta horrek taula horren panela irekitzen du irakurtzeko soilik. Ikus [Taularen propietateak](#table-properties). Ohar, erlazio eta taula-talde batek ez du menurik irekitzen.  
[Oihaleko tresna-barrak](#canvas-toolbar) zooma, `Name View`, zen modua eta `Go to content` iparrorratza mantentzen ditu. Goiko tresna-barrak datu-basearen izena erakusten du, editatu ezin den testu gisa, eta ez du `Undo`, `Redo` ez `Time Travel` botoirik.  
[Esportatzea](./file-import-export.md#exporting), bere hiru aukerekin, eta [Diferentzia-ikustailea](#diff-viewer) edozein editoretan bezala funtzionatzen dute.

[`View Option`](#table-view-options), `Name View`, datu-basea, fitxa, ikuspegiaren kokapena eta zooma bertan aldatzen jarraitzen dute, baina pantaila horretan bakarrik: ezerk ez ditu gordetzen, erregistratzen edo partekatzen. Ikus Ezarpenetako [Irakurtzeko soilik dauden editoreak](./settings.md#read-only-editors).

Editorea irakurtzeko soilik bihurtzeak edizioarako irekita zegoena amaitzen du: gelaxka-editore bat, ohar-editore bat edo taula-talde baten izen-editorea, marrazten ari zen erlazio bat edo `New Table Group` bat, hautapena eta fokuratutako gelaxka, esku-tresna, kolore-hautatzailea, [Mapatu zutabeak](./relationship-editing.md#map-columns) eta [Denbora-bidaia](./undo-redo.md#time-travel). Ikuspegia, zooma, fitxa eta Izenen ikuspegia lehen bezala geratzen dira, eta Taularen propietateak, Diferentzia-ikustailea eta `Export image` elkarrizketa-koadroa irekita geratzen dira.  
Abian zegoen keinu bat ere amaitzen da. Taulen edo oharren arrastatze bat dagoen tokian gelditzen da, `Alt + arrastatze` batek ez du kopiarik uzten, zutabe-arrastatze bat amaitzen da, ohar baten tamaina-aldaketa dagoen tokian gelditzen da, taula-talde baten tamaina-aldaketa baztertzen da, eta [Antolaketa automatikoa](#auto-layout) bere abisuarekin baztertzen da; beraz, ez da taularik mugitzen.  
Berriro idazgarri bihurtuta, editoreak goiko kontrolak itzultzen ditu, eta aldaketak itxi zuenetik ezerk ez du berriro irekitzen.
