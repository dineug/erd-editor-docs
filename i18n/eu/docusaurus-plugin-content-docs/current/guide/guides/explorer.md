---
sidebar_position: 8
description: Arakatu diagramaren taulak, beren zutabe, indize eta gako arrotzekin, haren taula-taldeak eta oharrak ERD oihalaren ondoan ainguratutako zuhaitz batean, eta joan haietako edozeinetara klik batekin.
---

# Arakatzailea

Arakatzailea ERD oihalaren ezkerreko ertzean ainguratutako panel bat da, eta diagrama zuhaitz gisa zerrendatzen du: taulak, bakoitza bere zutabe, indize eta gako arrotzekin; ondoren, [taula-taldeak](./table-groups.md); eta ondoren, oharrak. Egin klik errenkada batean, oihalean adierazten duen horretara joateko.  
Arakatzaileak oihala estutzen du, estali beharrean. Diagrama-editorearen zati bat da, ez VS Coderen Explorer ikuspegia, ezta Obsidianen fitxategi-arakatzailea ere.

![Arakatzailea tresna-barratik irekitzea, products taulara joatea, ondoren orders taularen status zutabera eta member_id gako arrotzera, Collapse All botoiarekin tolestea, panela zabaltzea eta ixtea](/img/demo-explorer.webp)

[Bilatu eta ordeztu](./find-and-replace.md) goiko aldean dago, titulu-barraren eta zuhaitzaren artean. Bilatu eremuak testua duen bitartean, zuhaitzak bat datorrena soilik erakusten du. Ikus [Emaitzak](./find-and-replace.md#the-results).  
Zuhaitzak berak ez du inoiz diagrama aldatzen: ez du izena aldatzeko, arrastatzeko, ezabatzeko, ezta erakusteko eta ezkutatzeko aukerarik ere. Ordezpena da panelak egiten duen edizio bakarra.

Arakatzailearen beraren egoera zurea da soilik: irekita dagoen ala ez, zabalera, tolestura-egoera, teklatua zein errenkadatan dagoen, zenbateraino korrituta dagoen eta bilaketa.  
Horietako bat ere ez da fitxategian gordetzen, desegite-historian erregistratzen, lankideekin partekatzen edo nabigatzailean biltegiratzen. Editorea irekita dagoen bitartean mantentzen da, fitxaz aldatu arren eta editore berean beste dokumentu batzuk kargatu arren. Berriki irekitako editore bat Arakatzailea itxita duela hasten da.

## Irekitzea eta ixtea {#opening-and-closing}

Ireki honako hauetako edozeinekin:

- Tresna-barrako `Explorer` botoia, `Search` botoiaren jarraian, zuhaitz-ikono batekin. Argibideak `Explorer (Ctrl + F)` (Windows/Linux) edo `Explorer (⌘ + F)` (Mac) dio.
- `Ctrl + F` (Windows/Linux) edo `⌘ + F` (Mac), Ezarpenetako [Lasterbideak](./settings.md#shortcuts) fitxan `Toggle Explorer` izena duena.
- [Bilaketa azkarreko](./quick-search.md) `Toggle Explorer` aukera, fitxa guztietan zerrendatzen dena. `find`, `replace`, `rename`, `tree`, `outline` edo `objects` idazteak agerrarazten du.
- Oihalaren laster-menuko `Toggle Explorer` aukera: egin eskuineko klik ERD oihaleko leku huts batean, edozein [taula-taldetatik](./table-groups.md) kanpo. `New Table`, `New Memo` eta `New Table Group` aukeren ondoren dago, `Relationship` aukeraren aurretik.

Bi `Toggle Explorer` aukerek lasterbidea erakusten dute eskuinean.  
Tresna-barrako botoiak, lasterbideak eta Bilaketa azkarreko aukerak fitxa guztietatik funtzionatzen dute. Bisualizazioa, SQL eskema, Kode-sortzailea edo Ezarpenak fitxatik, lehenik ERD fitxara aldatzen dira, Arakatzailea han bakarrik erakusten baita.

Tresna-barrako botoiak panela ireki eta itxi baino ez du egiten. Ez du testu-kurtsorea Bilatu eremuan jartzen, eta Taularen propietateak, gai-sortzailea eta `Display Language` hautatzailea irekita uzten ditu.  
Lasterbideak eta bi `Toggle Explorer` aukerek Arakatzailea bilaketan fokua duela irekitzen dute: testu-kurtsorea Bilatu eremura joaten da, haren testua hautatuta dagoela, eta [Haren ondoko elkarrizketa-koadroak](#dialogs-beside-it) ataleko bost elkarrizketa-koadroetako edozein ixten da, irekita badago. Bilatu eta ordeztu orriko [Irekitzea eta ixtea](./find-and-replace.md#opening-and-closing) atalean azaltzen da bilaketak irekitze batetik bestera zer gordetzen duen.  
Lasterbideak ez du ezer egiten taula-gelaxka bat, ohar bat edo taula-talde baten izena editatzen den bitartean.

Tresna-barrako botoia sakatuta ageri da Arakatzailea ERD fitxan irekita dagoen eta [zen moduak](#when-it-stands-aside) ezkutatzen ez duen bitartean. Hala dagoen bitartean, botoiak, lasterbideak eta bi `Toggle Explorer` aukeretako edozeinek Arakatzailea ixten dute, eta panelean zegoen teklatua editorera itzultzen da.  
Lasterbideak ez du inoiz ixten Bilaketa azkarra edo bost elkarrizketa-koadroetako bat irekita dagoen bitartean. Horren ordez, paleta edo elkarrizketa-koadroa ixten du eta teklatua Bilatu eremura eramaten du, haren testua hautatuta eta, Arakatzailea lehendik ikusgai bazegoen, uneko bat-etortzea mantenduta. Bilaketa azkarreko `Toggle Explorer` aukerak ez du salbuespen hori egiten: exekutatzean, paleta ixten du eta ondoren irekita dagoen Arakatzailea.

Argibideak `Close` dioen titulu-barrako `x` botoiak ere Arakatzailea ixten du, eta teklatua oihalari ematen dio. `Escape` teklak ez du ixten. Ikus [Arakatzaileko teklak](#keys-in-the-explorer).  
Berriro irekitzean, Arakatzailea zabalera berarekin itzultzen da, zuhaitza lehen bezala tolestuta eta korrituta, eta bilaketa-testu berarekin. Lasterbidearekin edo `Toggle Explorer` aukera batekin irekitzen bada, bilaketa-testu hori berriro bilatzen du, emaitza guztiak zabalduta. Ikus [Emaitzak](./find-and-replace.md#the-results).

Lasterbideak edo `Toggle Explorer` aukera batek Arakatzailea hura erakusteko estuegia den editore batean irekitzen duenean, jakinarazpen batek `Widen the window to show the Explorer` dio, eta teklatua zegoen lekuan geratzen da. Ikus [Oihalaren ondoan](#beside-the-canvas).  
Hala ere, Arakatzailea irekita dago, tresna-barrako botoia sakatuta dagoela, eta editorea behar adina zabala denean agertzen da, bilaketa eginda jada, teklatua hartu gabe. Tresna-barrako botoiarekin irekitzeak ez du jakinarazpenik erakusten.

## Oihalaren ondoan {#beside-the-canvas}

Arakatzailea ERD fitxaren ezkerreko ertzean zehar hedatzen da, tresna-barraren azpian, oihalaren altuera osoan.  
Oihala estutu egiten da hari lekua egiteko; beraz, diagramaren zatirik ez dago panelaren azpian, eta [oihaleko tresna-barra](./table-related-functions.md#canvas-toolbar), minimapa eta [ongietorri-pantaila](./editing-start.md#welcome-screen) oihalean daude, haren ondoan.  
Arakatzailea ireki, itxi edo tamainaz aldatzeak ez du diagrama korritzen, eta ez du ezer erregistratzen [desegite-historian](./undo-redo.md#what-the-history-records).

Berriki irekitako editore batean `260px` zabalerarekin hasten da. Arrastatu eskuineko ertza `200px` eta `480px` arteko edozein zabalera ezartzeko, edo egin klik bikoitza ertzean `260px` zabalerara itzultzeko.

Oihalak gutxienez `320px` zabalera gordetzen du beti Arakatzailearen ondoan:

- Arakatzailearen zabalera gehi `320px` baino estuagoa den editore batean, Arakatzailea estuago marrazten da tokian sartzeko, `200px` zabalerara arte.
- `520px` baino estuagoa den editore batean, bazterrean gelditzen da. Ez da marrazten, baina irekita jarraitzen du; beraz, tresna-barrako botoia sakatuta ageri da oraindik, eta sakatze batek ixten du. Editorea behar adina zabala denean, bere zabalerarekin itzultzen da.

Editorearen beraren zabalera da kontuan hartzen dena, ez nabigatzailearen leihoarena, nahiz eta [Irekitzea eta ixtea](#opening-and-closing) ataleko jakinarazpenak leihoa aipatzen duen.

[Eskuinetik ezkerrera idazten den bistaratze-hizkuntza](./language-and-theme.md#right-to-left-languages) batean, Arakatzailea oihalaren ezkerrean geratzen da, oihala ez baita inoiz alderantzikatzen.  
Haren edukia eskuinetik ezkerrera irakurtzen da: titulu-barra, bilaketa eta errenkadak alderantzikatuta daude, eta errenkadak eskuinetik koskatzen dira. Arrastatzen den ertza eskuineko aldean geratzen da, oihalaren kontra. Datu motek, indize-zutabeek eta gako arrotzen testuak ezkerretik eskuinerako ordena mantentzen dute.

## Bazterrean gelditzen denean {#when-it-stands-aside}

Arakatzailea ERD fitxan bakarrik erakusten da.  
Beste fitxa batera aldatzeak ezkutatu egiten du, eta tresna-barrako botoia ez da gehiago sakatuta ageri. ERD fitxara itzultzean, utzi zenuen bezala agertzen da berriro, era berean tolestuta eta korrituta.

[Diferentzia-ikustailea](./table-related-functions.md#diff-viewer), [Denbora-bidaia](./undo-redo.md#time-travel) edo [Antolaketa automatikoaren](./table-related-functions.md#auto-layout) aurrebista irekita dagoen bitartean, ezerk ez du Arakatzailea irekitzen edo ixten:

- Irekita dagoen Arakatzailea ezkutatu egiten da, eta berriro agertzen da haiek ixten direnean.
- Tresna-barrako botoia lausotuta dago eta ez du ezer egiten.
- Bilaketa azkarrak `Toggle Explorer` aukera kanpoan uzten du.
- Lasterbidea nabigatzailearen edo ostalariaren esku geratzen da. Ikus [Nabigatzailearen bilaketa-barra](./find-and-replace.md#the-browsers-find-bar).

Diferentzia-ikustaileak mota bereko zuhaitz batean zerrendatzen ditu bere aldaketak. Ikus [Diferentzia-ikustailea](./table-related-functions.md#diff-viewer).

[Zen modua](./table-related-functions.md#canvas-toolbar) `Alt + Z` (Windows/Linux) edo `⌥ + Z` (Mac) lasterbidearekin aktibatzeak irekita dagoen Arakatzailea ezkutatzen du hura itxi gabe, eta zen modua desaktibatzeak Arakatzailea itzularazten du.  
Zen moduan, lasterbideak eta bi `Toggle Explorer` aukerek Arakatzailea bilaketan fokua duela irekitzen dute oraindik, eta zen moduak aktibatuta jarraitzen du. Orduan, Arakatzailea editorearen altuera osoan hedatzen da, goiko tresna-barra desagertu baita, eta ikusgai jarraitzen du zen modua desaktibatzean. Zen modua berriro aktibatzeak berriro ezkutatzen du.

Panela teklatua barruan duela desagertzen den bakoitzean, itxi, ezkutatu edo bazterrean gelditu delako, teklatua editorera itzultzen da.

## Zuhaitza {#the-tree}

Titulu-barrak `Explorer` dio eta bi botoi ditu: `Collapse All` eta Arakatzailea ixten duen `x` botoia. Haren azpian bilaketa dago, [Bilatu eta ordeztu](./find-and-replace.md) orrian azaltzen dena, eta horren azpian zuhaitza.

Goiko mailak hiru karpeta ditu, ordena honetan: `Tables`, `Table Groups` eta `Memos`. Taula bakoitzaren azpian bere `Columns`, `Indexes` eta `Foreign Keys` karpetak daude.  
Hutsik dagoen karpeta ez da erakusten; beraz, diagrama huts batek ez du errenkadarik batere erakusten. `Table Groups` karpeta ere ez da erakusten [View Option](./table-related-functions.md#table-view-options) → `Table Groups` aukerak taldeak ezkutatzen dituen bitartean, ezta `Memos` karpeta ere View Option → `Memos` aukerak oharrak ezkutatzen dituen bitartean.  
Karpeta-errenkada batek karpeta-ikono bat, bere izena eta, beste muturrean, zuzenean bere azpian dauden errenkaden kopurua erakusten ditu; beraz, `Tables` karpetaren ondoko kopurua diagramako taulen kopurua da.

Taulak izenaren arabera zerrendatzen dira, maiuskulak eta minuskulak bereizi gabe, eta izen bera duten taulek dokumentuko ordena mantentzen dute. Taula-taldeak era berean zerrendatzen dira, baita talde bakoitzaren azpiko taulak ere. Taula baten zutabeek taularen beraren ordena mantentzen dute, eta haren indizeek eta gako arrotzek, baita oharrek ere, dokumentukoa.  
Zuhaitzak diagramaren aldaketei jarraitzen die, oihaleko edizio batek, desegite edo berregite batek, inportazio batek, edo lankide batek edo kodetze-agente batek eragindakoak izan; beraz, taula bati izena aldatzeak haren errenkada mugitzen du.

Errenkada mota bakoitzak hau erakusten du:

- Taula bat: taula-ikono bat eta bere izena.
- Zutabe bat: gako-ikono bat gako nagusiko edo gako arrotzeko zutabe batentzat, taularen beraren gako-gelaxkak gako nagusia, gako arrotza edo biak koloreztatzen dituen bezala koloreztatuta, eta zerrenda-ikono bat beste edozein zutaberentzat. Ondoren, bere izena eta, tonu apalean, bere datu mota eta jarraian `PK`, `FK` edo biak, adibidez `id` `BIGINT PK` edo `user_id` `BIGINT FK`.
- Indize bat: indize-ikono bat eta bere izena. Ondoren, tonu apalean, `UNIQUE` indize bakar batentzat eta bere zutabeak parentesi artean, indizearen ordenan, beheranzko zutabe bakoitzaren ondoren `DESC` jarrita, adibidez `orders_user_idx` `UNIQUE (user_id DESC, total)`, edo `(total)` soilik.
- Gako arrotz bat: taula umearen azpian soilik zerrendatzen da, gako arrotzaren zutabeak dituenaren azpian, eta taula gurasoa diagraman dagoen bitartean soilik. Bere gako-ikonoak konektorearen kolorea hartzen du: gako nagusiaren eta gako arrotzaren kolorea [erlazio identifikatzaile](./relationship-editing.md#identifying-relationships) batentzat, eta gako arrotzaren kolorea bestela. Taula umearen gako-zutabeak erakusten ditu, komaz bereizita, eta ondoren, tonu apalean, `→` ikurra taula gurasoarekin eta haren zutabeekin, adibidez `user_id` `→ users(id)`.
- Taula-talde bat: taldearen koloreko puntu bat, grisa kolorerik gabeko talde batentzat, eta bere izena. Bere taulak haren azpian zerrendatzen dira izenaren arabera, eta bakoitzak bere taulara eramaten du. Taularik gabeko talde batek ez du zabaltzeko ezer.
- Ohar bat: paper itsaskor baten ikonoa eta oharraren lehen lerroa.

Izen huts batek, edo lehen lerroa hutsik duen ohar batek, `unnamed` dio letra etzanez.  
Panel estu batean, tonu apaleko testua `…` ikurrarekin mozten da izena moztu aurretik. Pasatu sagua izen baten edo haren tonu apaleko testuaren gainetik, osorik ikusteko.

Hasieran `Tables` karpeta bakarrik dago zabalduta. Egin klik karpeta-errenkada batean, edo sakatu `Enter` edo `Space` haren gainean, tolestu edo zabaltzeko.  
Errenkada baten hasierako geziak errenkada hori tolestu edo zabaltzen du, inora joan gabe. Taula-errenkada guztiek dute gezi bat, baita azpian ezer ez duen taula batek ere. `→` eta `←` teklek ere tolestu eta zabaldu egiten dute. Ikus [Arakatzaileko teklak](#keys-in-the-explorer).  
`Collapse All` botoiak maila bat tolesten du sakatze bakoitzean: ikusgai dauden errenkada zabalduen mailarik sakonena; beraz, sakatzeek behetik gora tolesten dute. Goiko mailara iristen den sakatzeak errenkada guztiak tolesten ditu, lehendik tolestuta dagoen errenkada baten azpikoak barne, eta goiko mailako karpetak soilik uzten ditu.  
Edizioek, desegiteak eta berregiteak, eta lankideen edo kodetze-agente baten aldaketek tolestura-egoera dagoen bezala uzten dute.

## Errenkada batera joatea {#going-to-a-row}

Egin klik errenkada batean, edo sakatu `Enter` edo `Space` teklatua haren gainean dagoela, ERD oihalean adierazten duen horretara joateko. Karpeta-errenkada batek tolestu edo zabaldu baino ez du egiten, eta gezi-teklek zuhaitzaren barruan mugitu baino ez dute egiten.

- Taula-errenkada batek, edo talde baten azpian zerrendatutako taula batek, taula hori bakarrik hautatzen du eta aurrera ekartzen du. Fokuratutako gelaxka taularen izenera joaten da, dagoeneko taula horretan ez badago.
- Zutabe-errenkada batek bere taula bakarrik hautatzen du eta fokuratutako gelaxka zutabearen izenean jartzen du.
- Indize-errenkada batek bere taula hautatzen du, taula-errenkada batek bezala. Indizea bera ez da berariaz markatzen; indizeak [Taularen propietateetan](./table-related-functions.md#indexes) editatzen dira.
- Gako arrotzeko errenkada batek erlazioaren bi taulak batera jartzen ditu ikusgai, edo taula umea, biak batera erakusteko elkarrengandik urrunegi badaude. Taula umea bakarrik hautatzen du bere gako arrotzaren zutabeekin, fokuratutako gelaxka haietako lehenengoan duela, eta erlazioaren konektorea argiztatzen du. Ikus [Konektore bat irakurtzea](./relationship-editing.md#reading-a-connector).
- Taula-talde baten errenkadak taldearen koadroa ikusgai jartzen du titulu-barra erreferentziatzat hartuta, taldea bakarrik hautatzen du, eta aurrera ekartzen du bere taulekin.
- Ohar-errenkada batek oharra bakarrik hautatzen du eta aurrera ekartzen du.

Ikuspegia jauzi guztiek partekatzen duten arauaren arabera mugitzen da: zooma ez da inoiz aldatzen, eta oihala helmuga dagoeneko ondo ikusten ez denean bakarrik korritzen da. Ikus [Jauziaren helmuga](./table-related-functions.md#where-a-jump-lands).  
Errenkada batera joateak Taularen propietateak ixten ditu lehenik, irekita badaude, eta ez du inoiz marrazten ari den erlazio bat hasten edo amaitzen.  
Bilatu eremuak testua duen bitartean, bere izenean bat-etortze bat duen errenkada batek, edo iruzkin baten edo ohar baten zati bat erakusten duen batek, bat-etortze horretara eramaten du horren ordez. Ikus [Bat-etortze batera joatea](./find-and-replace.md#going-to-a-match).

Klik egin ondoren, teklatua zuhaitzean geratzen da; beraz, `Delete`, `Backspace` eta beste edizio-teklak ez dira hautapen berrira iristen `Escape` sakatu edo oihalean klik egin arte. Ikus [Arakatzaileko teklak](#keys-in-the-explorer).

## Arakatzaileko teklak {#keys-in-the-explorer}

Zuhaitza `Tab` teklaren geldiune bakarra da, eta errenkadarik ez duen bitartean saltatu egiten da.  
`Tab` teklarekin bertara sartzean, teklatua azkenekoz egon zen errenkadan kokatzen da, edo, halakorik ez badago, uneko bat-etortzearen errenkadan, edo osorik ikusgai dagoen lehen errenkadan, eta errenkada hori ikusgai geratzeko korritzen da. Teklatuaren errenkada erakuslearen azpiko errenkada bat bezala marrazten da.

Zuhaitzean:

- `↑` eta `↓` teklekin errenkada bat mugitzen da, eta lehen eta azken errenkadan gelditzen da, beste muturrera itzuli beharrean. `Home` eta `End` teklek lehen eta azken errenkadara eramaten dute.
- `→` teklak errenkada tolestu bat zabaltzen du, edo errenkada zabaldu baten lehen umera eramaten du. `←` teklak errenkada zabaldu bat tolesten du, edo bere gurasora eramaten du. Eskuinetik ezkerrera idazten den bistaratze-hizkuntza batean, bien funtzioak trukatu egiten dira.
- `Enter` eta `Space` teklek klik baten moduan jokatzen dute: errenkadara eramaten dute, edo karpeta bat tolestu edo zabaltzen dute. Ikus [Errenkada batera joatea](#going-to-a-row).
- Letra bat idazteak ez du errenkada batera jauzi egiten.

Arakatzaileko edozein lekutan sakatutako `Escape` teklak, zuhaitzean, Bilatu edo Ordeztu eremuan edo haren botoietako batean, teklatua oihalari itzultzen dio. Arakatzaileak irekita jarraitzen du eta hautapena dagoen bezala geratzen da.  
Idazketa-metodo baten konposizioa amaitzen duen `Escape` sakatze batek konposizioa amaitu baino ez du egiten. `Escape` teklak ez du inoiz Arakatzailea ixten, ez hartan sakatuta, ez oihalean sakatuta.

Teklatua Arakatzailean dagoen bitartean, editorearen lasterbide batzuek funtzionatzen jarraitzen dute (ikus [Lasterbideak](./settings.md#shortcuts)):

- `Ctrl + F` (Windows/Linux) edo `⌘ + F` (Mac) lasterbideak oihalean bezala funtzionatzen du: Arakatzailea ixten du, edo, Taularen propietateak haren ondoan irekita dauden bitartean, Taularen propietateak ixten ditu eta testu-kurtsorea Bilatu eremuan jartzen du. Ikus [Irekitzea eta ixtea](#opening-and-closing).
- `Ctrl + K` (Windows/Linux) edo `⌘ + K` (Mac) lasterbideak Bilaketa azkarra irekitzen edo ixten du.
- `Undo` eta `Redo` komandoek diagrama desegin eta berregiten dute, eremu bateko testua beharrean.
- `Zoom In`, `Zoom Out` eta `Zoom Reset` komandoek oihalaren zooma aldatzen dute.

Editorearen beste lasterbide guztiak Arakatzailean geratzen dira, baita gezi-teklak, `Tab`, `Enter`, `Space`, `Home` eta `End` teklak eta idazketa-metodo bat konposatzen ari den bitartean sakatutako edozein tekla ere.  
Horietako bat ere ez da oihalera iristen: `Delete` eta `Backspace` teklek ez dute inoiz hautapena ezabatzen, `Alt + N` (Windows/Linux) edo `⌥ + N` (Mac) lasterbideak ez du taularik gehitzen, eta `T` eta ondoren `G` sakatzeak ez du ezer taldekatzen. Eremu batean, testu-tekla arrunt gisa jokatzen dute: `Ctrl + A` (Windows/Linux) edo `⌘ + A` (Mac) lasterbideak eremuko testua hautatzen du, `Delete` eta `Backspace` teklek testua ezabatzen dute, eta `Space` teklak zuriune bat idazten du. `Tab` teklarekin Arakatzailearen botoien, eremuen eta zuhaitzaren artean mugitzen da.  
Bilatu eta Ordeztu eremuen beren teklak [Bilaketa-eremuetako teklak](./find-and-replace.md#keys-in-the-search-fields) atalean azaltzen dira.  
Editoreak esleitzen ez dituen teklak, adibidez ostalariaren beraren gordetzekoak edo komando-paletarenak, ostalarira iristen dira ohi bezala.

## Haren ondoko elkarrizketa-koadroak {#dialogs-beside-it}

[Taularen propietateek](./table-related-functions.md#table-properties), [gai-sortzaileak](./language-and-theme.md#theme), [`Display Language`](./language-and-theme.md#picking-a-language) hautatzaileak, [`Export image`](./file-import-export.md#image) elkarrizketa-koadroak eta [Mapatu zutabeak](./relationship-editing.md#map-columns) elkarrizketa-koadroak Arakatzailea irekita uzten dute irekitzean.

- Taularen propietateak oihalaren erdian irekitzen dira, Arakatzailearen ondoan, eta oihala bakarrik lausotzen dute. Arakatzaileak erabilgarri jarraitzen du: errenkada bat aukeratzeak Taularen propietateak ixten ditu, eta ondoren errenkadara joaten da.
- `Export image` elkarrizketa-koadroak eta Mapatu zutabeak elkarrizketa-koadroak editore osoa lausotzen dute, tresna-barra eta Arakatzailea barne. Arakatzaileak irekita jarraitzen du lausotutako eremuaren azpian, eta bertan egindako klik batek elkarrizketa-koadroa ixten du, lausotutako eremuko edozein lekutan egindako klik batek bezala; orduan, Mapatu zutabeak elkarrizketa-koadroa ezer mapatu gabe ixten da.
- Ezkerretik eskuinera idazten den bistaratze-hizkuntza batean, gai-sortzailea eta `Display Language` hautatzailea Arakatzailearen ondo-ondoan irekitzen dira, haren gainean ireki beharrean, eta lekuz aldatzen dira Arakatzailea irekitzen edo ixten bada haiek irekita dauden bitartean. Eskuinetik ezkerrera idazten den hizkuntza batean, eskuinean mantentzen dute beren lekua. Arakatzailean egindako sakatze batek ixten ditu, haietatik kanpo egindako edozein sakatzek bezala, tresna-barran egindakoa izan ezik.

Bilaketa lasterbidearekin edo `Toggle Explorer` aukera batekin irekitzeak bost horiek guztiak ixten ditu, Mapatu zutabeak elkarrizketa-koadroa ezer mapatu gabe.  
[Bilaketa azkarrak](./quick-search.md) ere Arakatzailea irekita uzten du, eta orduan `Escape` teklak paleta bakarrik ixten du.

## Irakurtzeko soilik dauden editoreak {#read-only-editors}

[`readonly`](../../api/erd-editor-element.md#readonly) atributua duen editore batean, Arakatzaileak beste edozeinetan bezala funtzionatzen du: tresna-barrako botoia argibide berarekin, lasterbidea, bi `Toggle Explorer` aukerak, zuhaitza, tolestea, `Collapse All` botoia eta errenkada batera joatea, helmuga ohi bezala hautatzen duena. Bertan ere, haren tituluak `Explorer` dio.  
Haren bilaketak aurkitu baino ez du egiten. Ikus Bilatu eta ordeztu orriko [Irakurtzeko soilik dauden editoreak](./find-and-replace.md#read-only-editors).
