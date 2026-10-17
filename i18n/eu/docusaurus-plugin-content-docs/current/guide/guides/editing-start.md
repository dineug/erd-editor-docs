---
sidebar_position: 1
description: Hasi ongietorri-pantailatik, eta sortu taulak, oharrak, taula-taldeak eta erlazioak oihalaren laster-menutik, oihaleko tresna-barratik edo lasterbide batekin.
---

# Editatzen hastea

Edizioa laster-menutik hasten da, eskuineko klik eginez.

![Oihalean eskuineko klik egitea, Relationship azpimenua irekitzea, taula bat gehitzea eta ondoren haren menu propioa irekitzea](/img/demo-context-menu.webp)

Taula, ohar, taula-talde edo erlazio batean eskuineko klik egiteak elementu horren menu propioa irekitzen du horren ordez.  
Dagoeneko hautatuta dagoen taula, ohar edo taula-talde batean egindako eskuineko klik batek hautapen osoa mantentzen du; beraz, `Color` eta `Delete selected` bezalako aukerek hautapen osoan eragiten dute. Ikus [Hautapen anitza](./table-related-functions.md#multiple-selection).

## Ongietorri-pantaila {#welcome-screen}

Web aplikazioan, Google Drive zerbitzuan, VS Code editorean, Obsidian aplikazioan eta JetBrains IDE batean, diagrama huts bat ERD oihalaren gaineko ongietorri-pantaila batean irekitzen da. Zure orriko `<erd-editor>` elementu batek orriak [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen) propietatearekin aktibatzen duenean soilik erakusten du.  
Diagrama bat hutsik dagoela jotzen da taularik, ohar ikusgairik eta taula-talde ikusgairik ez duen bitartean; beraz, View Option bidez ezkutatutako oharrak eta taldeak ez dira zenbatzen. Pantaila desagertu egiten da diagramak horietako bat duen bezain laster, eta diagrama berriro hutsik geratzen den bakoitzean itzultzen da, adibidez azken taula ezabatu ondoren edo lehenengoa gehitzea desegin ondoren.  
Ez da erakusten irakurtzeko soilik dagoen editore batean, zen moduan, Taularen propietateak irekita dagoen bitartean, ezta Diferentzia-ikustaileak, Antolaketa automatikoaren aurrebistak edo Denbora-bidaiak oihala hartzen duten bitartean ere.

![Ongietorri-pantaila diagrama huts batean: Import aukeraren formatuak irekitzea, Esc teklarekin atzera egitea, New Table aukerarekin taula bat gehitzea eta ondoren pantaila ⌘ + Z lasterbidearekin berriro ekartzea](/img/demo-welcome-screen.webp)

`Right-click the canvas for every action.` izenburuaren azpian menu bat dago:

- `New Table` aukerak taula bat gehitzen du, `Alt + N` lasterbideak bezala.
- `New Memo` aukerak ohar bat gehitzen du, `Alt + M` lasterbideak bezala. Oharrak ezkutatuta dauden bitartean, ez da agertzen.
- `Import` aukerak menua `Back` aukerarekin eta `json`, `Schema SQL`, `GraphQL`, `DBML` eta `AML` formatuekin ordezten du. Formatu bat aukeratzean, formatu horretako fitxategi bat eskatzen da, eta diagrama hutsaren ordez kargatzen da. Ikus [Fitxategiak inportatzea edo esportatzea](./file-import-export.md). `Back` aukerak edo `Escape` teklak hasierako menura itzultzen du.
- `Command Palette` aukerak [Bilaketa azkarra](./quick-search.md) irekitzen du, `Ctrl + K` (Windows/Linux) edo `⌘ + K` (Mac) lasterbideak bezala.
- `Shortcuts` aukerak Ezarpenak irekitzen ditu, [`Shortcuts`](./settings.md#shortcuts) fitxan.

Oihala behar adina zabala denean, `New Table`, `New Memo` eta `Command Palette` aukerek beren komandoari une honetan esleitutako tekla erakusten dute, baita ostalari batek beste tekla batera aldatu duena ere.  
Aukera batek teklatuaren fokua duenean, `↑` eta `↓` teklek fokua aukeretan zehar mugitzen dute, eta muturrera iristean beste muturretik jarraitzen dute; `Home` eta `End` teklek lehenengora eta azkenera jauzi egiten dute, eta `Enter` edo `Space` teklak fokuratutako aukera sakatzen du. Beste lasterbide guztiek funtzionatzen jarraitzen dute; beraz, `Alt + N` lasterbideak hortik ere gehitzen du taula bat.  
Menuak bakarrik jasotzen ditu klikak: pantailako beste edozein lekutan egindako sakatze bat oihalera iristen da, eta oihalean eskuineko klik egiteak laster-menua irekitzen du ohi bezala.

Oihalean tokia dagoenean, eskuz marraztutako geziek hauek seinalatzen dituzte:

- tresna-barrako `Search` botoia: `Search commands and tables`
- `Theme` eta `Display Language` botoiak: `Pick a theme and a language`, edo `Pick a theme` edo `Pick a language` tresna-barrak horietako bat bakarrik erakusten duenean. Ikus [Hizkuntza eta gaia](./language-and-theme.md)
- behealdeko [oihaleko tresna-barra](./table-related-functions.md#canvas-toolbar): `Pan, zoom and draw relationships`

[Arakatzailea](./explorer.md) erakusten den bitartean, ongietorri-pantailak haren ondoko oihala soilik estaltzen du.  
Tresna-barrako botoia Arakatzailearen gainean duen gezia kendu egiten da. `Theme` eta `Display Language` botoien gezia bi botoiak Arakatzailearen gainean daudenean baino ez da kentzen; ordura arte, oraindik oihalaren gainean dagoen botoia seinalatzen du.  
Geziaren ondoan tokirik ez duen etiketa geziaren azpian zintzilik geratzen da horren ordez.

## Taulak sortzea {#table-creation}

Sortu taula bat laster-menutik, [oihaleko tresna-barrako](./table-related-functions.md#canvas-toolbar) `New Table` botoiarekin edo `Alt + N` lasterbidearekin.

## Oharrak sortzea {#memo-creation}

Sortu ohar bat laster-menutik, oihaleko tresna-barrako `New Memo` botoiarekin edo `Alt + M` lasterbidearekin.  
View Option → `Memos` desaktibatuta dagoen bitartean, oharrak ezkutatuta daude, ezerk ez du `New Memo` aukera eskaintzen, eta `Alt + M` lasterbideak ez du oharrik gehitzen. Ikus [Taulen ikuspegi-aukerak](./table-related-functions.md#table-view-options).

Oharra oihaleko testu libreko oharpen bat da. Egin klik haren gorputzean eta idatzi; testua dokumentuarekin gordetzen da.  
`Escape` teklak ohar-editorea ixten du, idatzitakoa mantenduz eta oharra hautatuta utziz, eta bigarren `Escape` sakatze batek hautapena kentzen du.  
Arrastatu haren ertza tamaina aldatzeko. Erakuslea oharraren gainean dagoen bitartean goiburuan agertzen den `x` ikurrak oharra ezabatzen du.  
Ohar batean eskuineko klik egiteak haren menua irekitzen du, ez editorea: `Color`, `Remove color` hautatutako elementu batek kolorea duen bitartean, eta `Delete`, oharra hautatutako bi elementu edo gehiagoren artean dagoen bitartean `Delete selected` dioena. Hautatutako ohar bat taulak ezabatzen dituzten teklekin ere ezabatzen da. Ikus [Taulak eta oharrak ezabatzea](./table-related-functions.md#table-and-memo-deletion).

![Ohar bat Alt + M lasterbidearekin gehitzea, testu bat idaztea eta haren ertza arrastatzea tamaina aldatzeko](/img/demo-memo.webp)

## Taula-taldeak sortzea {#table-group-creation}

Taula-taldea taulak biltzen dituen koadro bat da, eta izena eta kolorea eman dakizkioke. Sortu bat bi modu hauetako batean:

- Aukeratu `New Table Group` laster-menuan edo Bilaketa azkarrean, egin klik [oihaleko tresna-barrako](./table-related-functions.md#canvas-toolbar) `New Table Group` botoian, edo sakatu `Alt + G` (Windows/Linux) edo `⌥ + G` (Mac); ondoren, arrastatu koadro bat oihalaren gainean. Erdigunea koadroaren barruan duen taula bakoitza talde berrian sartzen da, dagoeneko beste talde batean ez badago. Ikus [Talde bat marraztea](./table-groups.md#drawing-a-group).
- Hautatu taulak eta aukeratu `Group selected tables` taula baten laster-menuan edo `Group Selected Tables` Bilaketa azkarrean, edo sakatu `T` eta ondoren `G`. Ikus [Hautatutako taulak taldekatzea](./table-groups.md#grouping-selected-tables).

Izena ematea, koloreztatzea, mugitzea, tamaina aldatzea eta gainerakoa [Taula-taldeak](./table-groups.md) orrian azaltzen dira.

## Erlazioak sortzea {#relationship-creation}

Hasi erlazio bat laster-menutik, oihalaren behealdeko [oihaleko tresna-barratik](./table-related-functions.md#canvas-toolbar) edo lasterbide batekin. Erlazio mota bakoitzak berea du:

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) edo `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) edo `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) edo `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) edo `⌘ + ⌥ + 4` (Mac)

Mota bat prest jarritakoan, kurtsorea aldatu egiten da. Egin klik lehenik taula gurasoan, eta ondoren taula umean.  
Gurasoak gako nagusirik ez badu, bat jasotzen du, eta gurasoaren gako nagusiko zutabe bakoitzeko, taula umeak `Not Null` gisa markatutako gako arrotzaren zutabe bat jasotzen du, datu mota, balio lehenetsi eta iruzkin berberekin.  
Serial motako gakoa da salbuespena: haren gako arrotzak serial motak gordetzen duen zenbaki osoko mota hartzen du, adibidez `integer`, `serial4` motaren kasuan. Ikus [Erlazio identifikatzaileak](./relationship-editing.md#identifying-relationships).  
Gako arrotzaren zutabe bakoitza bere gakoaren arabera izendatzen da: hitz bakarreko izen bati, `id` bezalakoari, taula gurasoaren izena jartzen zaio aurrean (`user_id`); hainbat hitzeko izen bat, `member_id` bezalakoa, mantendu egiten da, eta taula umeak dagoeneko duen izen bati zenbaki bat gehitzen zaio (`user_id_2`). Ikus [Gako arrotzen zutabeen izenak](./relationship-editing.md#foreign-key-column-names).  
Taula berean bi aldiz klik egiteak auto-erreferentziazko erlazio bat marrazten du.  
Erlazio berri bat `On Delete` eta `On Update` biak `Not set` balioan dituela hasten da; aldatu haren laster-menutik. Ikus [ON DELETE eta ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Bertan behera uzteko, sakatu `Escape`, edo sakatu berriro lasterbide bera. Bertan behera uzteak hautapena dagoen bezala uzten du, eta hurrengo `Escape` sakatzeak kendu egiten du.

Gurasoa aukeratu ondoren, erlazioa amai daitekeen taula bat erakusleaz seinalatzeak taula horren ingerua nabarmentzen du eta bi botoi erakusten ditu haren ondoan:

- `Create new columns` (`+`) botoiak erlazioa gako arrotzaren zutabe berriekin marrazten du, taulan klik egiteak bezala.
- `Map to existing columns` (esteka-ikono bat) botoiak marrazketa amaitzen du eta [Mapatu zutabeak](./relationship-editing.md#map-columns) irekitzen du bi taulentzat; beraz, erlazioak taula umeak dagoeneko dituen zutabeak erabil ditzake. Ez da ezer idazten `Map` botoia sakatu arte.

Gurasoak ere erakusten ditu botoiak, erakuslea gurasoan klik egin zenuen lekutik apur bat urrundu ondoren; beraz, auto-erreferentziazko erlazio bat ere lehendik dauden zutabeetara mapa daiteke.  
Hatzarekin ezin da elementuen gainetik pasatu; beraz, hatzarekin marrazten duzunean, botoiak ez dira inoiz agertzen, eta taula umea ukitzeak erlazioa berehala marrazten du; arkatz batek saguak bezala erakusten ditu.  
Taula umera iristen zarenerako gurasoak bere gako nagusia galdu badu, adibidez desegite baten edo lankide baten edizio baten ondorioz, `Create new columns` botoia lausotuta agertzen da `<parent> has no primary key to copy` argibidearekin, eta taula umean klik egiteak marrazketa amaitzen du ezer marraztu gabe.

![One N erlazio bat ⌘ + ⌥ + 4 lasterbidearekin marraztea, eta ondoren Zero N bat oihaleko tresna-barratik, taula umea nabarmenduta bere Map to existing columns eta Create new columns botoiekin](/img/demo-relationship.webp)

## Taulak eta oharrak bikoiztea {#duplicating-tables-and-memos}

Lehendik dauden taulak eta oharrak kopiatu, itsatsi eta `Alt` tekla sakatuta arrastatu daitezke bikoiztuak sortzeko. Ikus [Taulekin lotutako funtzioak](./table-related-functions.md#copyingpasting-tables-and-memos).
