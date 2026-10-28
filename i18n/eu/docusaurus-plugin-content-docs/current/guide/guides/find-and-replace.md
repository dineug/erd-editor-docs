---
sidebar_position: 10
description: Bilatu taulen, zutabeen, indizeen eta taula-taldeen izenak, izen logikoak, iruzkinak eta oharrak Arakatzailearen goialdetik, igaro bat-etortzeak banan-banan haren zuhaitzean eta oihalean, eta ordeztu bat-etortze bat edo guztiak.
---

# Bilatu eta ordeztu

Testua diagrama osoan bilatzen du, ERD oihaleko bat-etortze bakoitzera eramaten zaitu, eta bat-etortze bat edo guztiak ordezten ditu.  
Zortzi testu mota bilatzen ditu: taulen izenak, taulen iruzkinak, zutabeen izenak, zutabeen iruzkinak, oharrak, indizeen izenak, taula-taldeen izenak, eta taulen eta zutabeen [izen logikoak](./logical-names.md). Ikus [Zer bilatzen duen](#what-it-searches).

ERD oihalaren ezkerrean ainguratutako [Arakatzailea](./explorer.md) panelaren goialdean dago, Arakatzailearen titulu-barraren eta zuhaitzaren artean. Ez du titulu propiorik. Goitik behera, hauek ditu:

- Bilatu eremua, barruko amaieran hiru [aukerak](#options) dituela, eta haren aurretik `Toggle Replace` gezia.
- `Replace` errenkada, hasieran tolestuta. Ikus [Ordeztea](#replacing).
- Kontagailua, ondoren bat-etortzeak banan-banan igarotzeko gora eta behera geziak, eta hiru puntuko `Search In` botoia.
- [Testu motak](#what-it-searches), `Search In` botoiak zabaltzen dituenak.

Bilatu eremuak testua duen bitartean, Arakatzailearen zuhaitzak bat-etortzeak erakusten ditu. Ikus [Emaitzak](#the-results).  
Oihala baxua denean, bilaketak bere altuera osoa gordetzen du, eta azpiko zuhaitzak geratzen den lekua hartzen du eta korritu egiten da.

![Bilatu eta ordeztu Arakatzailean irekitzea ⌘ + F lasterbidearekin, member testuaren sei bat-etortzeak banan-banan igarotzea, eta ondoren, Preserve Case aktibatuta, seiak user testuarekin ordeztea (⌘ + Enter)](/img/demo-find-and-replace.webp)

## Irekitzea eta ixtea {#opening-and-closing}

`Ctrl + F` (Windows/Linux) edo `⌘ + F` (Mac) lasterbideak, eta [Bilaketa azkarreko](./quick-search.md) edo oihalaren laster-menuko `Toggle Explorer` aukerak, Arakatzailea bilaketan irekitzen dute. Testu-kurtsorea Bilatu eremura joaten da, eremuko testua hautatuta dagoela, eta bilaketa-testua berriro bilatzen da, uneko bat-etortzerik gabe.  
Tresna-barrako `Explorer` botoiak panela ireki edo itxi besterik ez du egiten. Ez du testu-kurtsorea Bilatu eremuan jartzen, eta bilaketa-testua eta uneko bat-etortzea zeuden bezala uzten ditu.  
Lasterbideak testu-kurtsorea dagoeneko ikusgai dagoen Arakatzailera itzuli besterik egiten ez duenean, Bilaketa azkarra edo [Haren ondoko elkarrizketa-koadroak](./explorer.md#dialogs-beside-it) ataleko bost elkarrizketa-koadroetako bat irekita dagoen bitartean gertatzen den bezala, uneko bat-etortzea ez da aldatzen.

Arakatzailea ixtea, Arakatzailea irekita dagoen bitartean lasterbideak eta bi `Toggle Explorer` aukerek egiten dutena, eta ixten dituzten elkarrizketa-koadroak Arakatzailearen orriko [Irekitzea eta ixtea](./explorer.md#opening-and-closing) atalean azaltzen dira.  
[Bazterrean gelditzen denean](./explorer.md#when-it-stands-aside) atalean azaltzen da beste fitxa batek eta zen moduak nola ezkutatzen duten, eta Diferentzia-ikustaileak, Denbora-bidaiak eta Antolaketa automatikoaren aurrebistak nola ezkutatzen duten eta irekitzea nola eragozten duten. [Oihalaren ondoan](./explorer.md#beside-the-canvas) atalean azaltzen da Arakatzailea erakusteko estuegia den editore baten kasua.

Berriro irekitzean, azken bilaketa-testua mantentzen da, baita Ordeztu eremuko testua, [aukerak](#options), aktibatuta zeuden [testu motak](#what-it-searches), eta `Replace` errenkada eta testu motak zabalduta zeuden ala ez ere.  
Editorea irekita dagoen bitartean mantentzen dira, eta ez dira dokumentuan gordetzen. Berriki irekitako editore bat aukera guztiak desaktibatuta, `Replace` errenkada eta testu motak tolestuta, eta lau izen motak eta `Logical names` bakarrik aktibatuta dituela hasten da. Ikus [Zer bilatzen duen](#what-it-searches).

## Nabigatzailearen bilaketa-barra {#the-browsers-find-bar}

Editoreak teklatuaren fokua duen bitartean, `Ctrl + F` (Windows/Linux) edo `⌘ + F` (Mac) lasterbidea editorearena da fitxa guztietan, baita haren testu-eremuetan ere; beraz, nabigatzailearen bilaketa-barra ez da irekitzen.  
Lasterbidea nabigatzailera edo ostalarira pasatzen da Diferentzia-ikustailea, Denbora-bidaia edo Antolaketa automatikoaren aurrebista irekita dagoen bitartean, eta fokua editoretik kanpo dagoen bitartean.

- Web aplikazioa eta Google Drive: nabigatzailearen bilaketa-barra bi kasu horietan bakarrik irekitzen da.
- VS Code: luzapenak VS Coderen bilaketa-trepeta propioa desaktibatuta uzten du ERD Editor editorean; beraz, lasterbideak ez du inoiz trepeta hori irekitzen han.
- Obsidian: diagramaren fitxa aktibo dagoen bakoitzean, lasterbidea editorera iristen da, Obsidianen `Search current file` komandoaren ordez.
- JetBrains IDE: IDEaren teklatu-mapak `Ctrl + F` (Windows/Linux) edo `⌘ + F` (Mac) beretzat gordetzen badu, ireki bilaketa Bilaketa azkarreko edo oihalaren laster-menuko `Toggle Explorer` aukeratik, edo ireki Arakatzailea tresna-barrako `Explorer` botoiarekin eta egin klik Bilatu eremuan.

Editorea txertatzen duen orri batek lasterbidea alda edo ken dezake. Ikus [Lasterbidea aldatzea](#changing-the-shortcut).

## Zer bilatzen duen {#what-it-searches}

Zortzi botoik aukeratzen dituzte bilatzen diren testu motak, ordena honetan: `Table names`, `Table comments`, `Column names`, `Column comments`, `Memos`, `Index names`, `Table group names` eta `Logical names`.  
Hasieran tolestuta daude. Kontagailuaren errenkadaren amaierako `Search In` botoiak errenkada horren azpian zabaltzen ditu eta berriro tolesten ditu, eta nabarmenduta dago ikusgai dauden bitartean.  
Nabarmenduta dagoen mota-botoi bat aktibatuta dago. Egin klik batean aktibatzeko edo desaktibatzeko, eta bilaketa berriro exekutatzen da. Zortziak desaktibatuta badaude, ez da ezer aurkitzen.

Bilaketa lehen aldiz lau izen motak (`Table names`, `Column names`, `Index names` eta `Table group names`) eta `Logical names` aktibatuta irekitzen da; beraz, izen-aldaketa batek ez ditu iruzkinak eta oharrak ukitzen, horiek aktibatzen ez badituzu.  
`Logical names` mota bakarra da tauletako zein zutabeetako izen logikoetarako.  
Indizeen izenak [Taularen propietateak](./table-related-functions.md#indexes) paneleko `Indexes` fitxako indizeen izenak dira, ez horien gainean zerrendatutako `PK_` eta `UQ_` gakoak.

Ez da beste ezer bilatzen: ez datu motak, ez zutabe baten domeinua, ez balio lehenetsiak, ez indize baten zutabeak, ez datu-basearen izena, ez [SQL eskema](./schema-sql.md) bere `Before tables` eta `After tables` scriptekin, ez sortutako kodea, ez [Hiztegia](./dictionary.md) fitxako orriak, horiek [beren bilaketa](./dictionary.md#searching) baitute.  
Izen logikoak bilatu egiten dira [Izenen ikuspegiak](./logical-names.md#name-view) marrazten duena edozein dela ere, `Physical Names` barne, nahiz eta bertan oihalak ez duen bat ere erakusten. [Taulen ikuspegi-aukera](./table-related-functions.md#table-view-options) batek ezkutatutako iruzkin bat ere bilatu egiten da. View Option → `Memos` bidez ezkutatutako oharrak eta View Option → `Table Groups` bidez ezkutatutako [taula-taldeak](./table-groups.md#hiding-groups), berriz, ez dira bilatzen, beren botoia aktibatuta egon arren; beraz, `Replace All` ekintzak ez du inoiz ikusten ez duzun oharrik berridazten, ezta ikusten ez duzun talderen baten izenik aldatzen ere.

## Aukerak {#options}

Bilatu eremuaren barruan, amaieran, dauden hiru etengailuek aldatzen dute bilaketa-testua nola bat datorren. Beren argibideetan dute izena, eta nabarmenduta daude aktibatuta dauden bitartean. Hirurak desaktibatuta hasten dira, eta bat aldatzean berriro bilatzen da.

- `Match Case`: desaktibatuta dagoenean, bilaketak ez ditu maiuskulak eta minuskulak bereizten.
- `Match Whole Word`: bat-etortze batek balio du soilik ezein aldetan hitz bati itsatsita ez dagoenean. Edozein idazkeratako letrak, digituak eta markak hitz-karaktere gisa hartzen dira, baita azpimarra ere. Hortaz, `user` aurkitzen da `user id` eta `user.id` testuetan, baina ez `users`, `user_id` edo `superuser` testuen barruan. Bilaketa-testuaren mutur bat berez hitz-karaktere ez denean, esaterako `.id` testuko puntua, mutur horrek ez du mugarik behar.
- `Use Regular Expression`: bilaketa-testua JavaScript adierazpen erregular bat da, beti Unicode moduan; beraz, `\p{L}` adierazpenak funtzionatzen du. `^` eta `$` ikurrek lerro anitzeko iruzkin edo ohar baten lerro bakoitzaren hasieran eta amaieran egiten dute bat, eta `.` ikurrak ez du lerro-jauzirik gurutzatzen. Izenetan maiz idazten diren ihes-sekuentziak onartzen dira, esaterako `\_` eta `\-`.

Analizatu ezin den adierazpen erregular batek, esaterako `user(`, ez du ezer aurkitzen: kontagailuak `Invalid regular expression` dio gorriz, eta Bilatu eremua gorriz inguratzen da.  
`Match Case` eta `Match Whole Word` aukerak adierazpen erregularrei ere aplikatzen zaizkie. Luzerarik gabeko bat-etortze bat, esaterako `^` bakarrik, ez da inoiz zerrendatzen.

Testu arrunta idatzi ahala bilatzen da. Adierazpen erregular bat idazketa eteten denean bilatzen da, edo berehala `Enter`, nabigazio-botoi bat, `Replace` edo `Replace All` sakatzen duzunean, edo bat-etortze bat duen errenkada bat aukeratzen duzunean.  
Bilaketak ez du denbora-mugarik; beraz, atzera-jotze handia egiten duen adierazpen erregular batek editorea erantzunik gabe utz dezake amaitu arte.

Laugarren etengailu bat, `Preserve Case`, `Replace` eremuaren barruan dago, amaieran; beraz, `Replace` errenkada zabalduta dagoen bitartean bakarrik ikusten da. Desaktibatuta hasten da. Ez du aldatzen aurkitzen dena, `Replace` eta `Replace All` ekintzek ordezpena nola idazten duten baizik. Ikus [Ordeztea](#replacing). Aktibatzeak edo desaktibatzeak ez du ezer bilatzen, eta uneko bat-etortzea ez da aldatzen.

## Emaitzak {#the-results}

Kontagailuak, eremuen azpiko errenkadaren hasieran, non zauden adierazten du. Hutsik dago Bilatu eremua hutsik dagoen bitartean.

| Kontagailua | Noiz |
| --- | --- |
| `No results` | Ezer ez dator bat. |
| `12 matches` | Horietako batera joan aurretik; `1 match`, bat bakarra dagoenean. |
| `3 of 12` | Hirugarren bat-etortzea da unekoa. |
| `Invalid regular expression` | Adierazpen erregularra ezin da analizatu. |
| `Replaced 12 matches` | `Replace All` ekintzak hainbeste bat-etortze aldatu ditu; `Replaced 1 match`, bat bakarra denean. |
| `No changes` | `Replace All` ekintzak ez du ezer aldatu. |
| `No more matches` | `Replace` segida bat hasi zen lekura itzuli da. Ikus [Ordeztea](#replacing). |

`Replaced …`, `No changes` eta `No more matches` mezuek bat-etortzeen kopuruari uzten diote lekua hurrengo bilaketan edo mugimenduan, edizio batek edo desegite batek abiarazten duen bilaketa barne.

Bilatu eremuak testua duen bitartean, Arakatzailearen [zuhaitzak](./explorer.md#the-tree) emaitzak erakusten ditu diagrama osoaren ordez: bat-etortze bat duten errenkadak eta horien gaineko errenkadak bakarrik. Ezer bat ez datorrenean, edo adierazpen erregularra ezin denean analizatu, hutsik dago. Bilaketa-testua ezabatzean, zuhaitz osoa itzultzen da, lehen bezala tolestuta.

- `Tables`, `Table Groups` eta `Memos` karpetak bat-etortzeren bat dutenean bakarrik agertzen dira, eta karpeta bakoitzak erakusten duen kopurua emaitzetan zuzenean haren azpian dauden errenkaden kopurua da.
- `Tables` karpetaren azpian bat-etortzeren bat duten taulak daude, izenaren arabera ordenatuta, inoiz ez izen logikoaren arabera. Taula bakoitzaren azpian errenkada bat dago haren iruzkineko bat-etortze bakoitzeko; ondoren, `Columns` karpeta bat, bat-etortzeren bat duten zutabeekin, zutabeen ordenan, bakoitza bere iruzkineko bat-etortze bakoitzeko errenkada batekin; eta ondoren, `Indexes` karpeta bat, izena bat datorren indizeekin. Ez dago `Foreign Keys` karpetarik.
- `Table Groups` karpetaren azpian izena bat datorren taldeak daude, izenaren arabera ordenatuta, beren taularik gabe. Aurkitutako taula bat `Tables` karpetaren azpian agertzen da.
- `Memos` karpetaren azpian bat-etortzeren bat duten oharrak daude, dokumentuko ordenan, bakoitza bere lehen lerroarekin erakutsita eta bere bat-etortze bakoitzeko errenkada batekin.

Izen bateko bat-etortzea izen horren beraren errenkadan nabarmentzen da; beraz, bilaketa-testua bi aldiz duen izen bat bi nabarmentze dituen errenkada bakarra da. Taula edo zutabe baten izen logikoko bat-etortze bat taula edo zutabe horren errenkadan ere jartzen da, inoiz ez bere errenkada propioan.  
Errenkada horiek taula edo zutabea [Izenen ikuspegiak](./logical-names.md#beyond-the-canvas) erakusten duen bezala izendatzen dute, eta errenkada batek erakuts ditzakeen bi izenetako bakoitzak bere bat-etortzeak bakarrik nabarmentzen ditu. Haren ikuspegiak kanpoan uzten duen izenean bakarrik aurkitutako errenkada batek, `Physical Names` ikuspegiko izen logikoan edo `Logical Names` ikuspegiko izenean, izen hori gehitzen du erakusten duenaren ondoren, `Both Names` ikuspegian bezala lausotuta, bat-etortzea nabarmenduta duela. Erakusten duen izenak ere bat-etortze bat duenean, errenkadak izen hori bakarrik erakusten du; beraz, haren ikuspegiak kanpoan uzten duen izeneko bat-etortzeak zenbatu eta banan-banan igarotzen dira, baina ez dira nabarmentzen.  
Iruzkin edo ohar bateko bat-etortze batek bere errenkada propioa du: hizketa-burbuila bat taula edo zutabe baten iruzkinerako, edo paper itsaskor bat ohar baterako, eta ondoren testuaren zati bat, bat-etortzea nabarmenduta duela. Testu luze bat `…` ikurrarekin mozten da, eta lerro-jauziak zuriune gisa agertzen dira. Pasatu sagua errenkadaren gainetik testu osoa ikusteko.  
Gainerako errenkada guztiek bilaketatik kanpo duten itxura bera dute: zutabe batek bere datu mota erakusten du, indize batek bere zutabeak, eta izen huts batek `unnamed` dio.

Azpian errenkadak dituen errenkada oro zabalduta agertzen da bilaketa bat hastean. Tolesten duzun errenkada bat, edo `Collapse All` botoiak tolesten duena, tolestuta geratzen da haren azpiko bat-etortze bat uneko bihurtu arte, edo bilaketa-testua, `Match Case`, `Match Whole Word`, `Use Regular Expression` edo testu mota bat aldatu arte, edo bilaketa berriro ireki arte lasterbidearekin edo `Toggle Explorer` aukera batekin.  
Uneko bat-etortzearen errenkada nabarmendu egiten da, eta ikusgai geratu arte korritzen da. Zuhaitzak bat-etortze guztiak zerrendatzen ditu, zenbat diren gorabehera.  
Bat-etortzeak zuhaitzaren ordenan igarotzen dira banan-banan: taulaz taula, taularen izen logikoa, izena eta iruzkina, ondoren haren zutabe bakoitzaren izen logikoa, izena eta iruzkina zutabeen ordenan, eta ondoren haren indizeen izenak; ondoren, taula-taldeen izenak; ondoren, oharrak.

Emaitzek dokumentuari jarraitzen diote Arakatzailea ikusgai dagoen bitartean. Edizioak eteten direnean, bilatutako testuetako edozein aldaketak bilaketa berriro abiarazten du, eta uneko bat-etortzea ez da aldatzen, oraindik badago. Horren barruan sartzen dira izen, izen logiko, iruzkin edo ohar-testu bat editatzea, taula, zutabe, indize, ohar edo taula-talde bat gehitzea edo kentzea, zutabe bat mugitzea, eta View Option bidez oharrak edo taula-taldeak ezkutatzea edo erakustea, eta horrek haien bat-etortzeak zuhaitzetik kentzen ditu edo berriro ekartzen ditu. Oihaleko edizio bat, desegite edo berregite bat, inportazio bat, eta lankide batek edo kodetze-agente batek egindako edizio bat, denak hartzen dira kontuan. Hautatzea, oihalean taulak, oharrak edo taldeak mugitzea, korritzea, zooma aldatzea eta sagua gainetik pasatzea, ez.  
Izenen ikuspegia aldatzeak ere ez, ez baitu bilaketak irakurtzen duen testurik aldatzen: bat-etortze berak geratzen dira, eta errenkadek ikuspegi berriak erakusten dituen izenak hartzen dituzte.  
Arakatzailea itxita edo ikusgai ez dagoen bitartean egindako edizioak bilatu egiten dira Arakatzailea berriro agertu bezain laster.

## Bat-etortze batera joatea {#going-to-a-match}

Bilatu eremuan, `Enter` teklak hurrengo bat-etortzera eramaten du, eta `Shift + Enter` lasterbideak aurrekora. Kontagailuaren ondoko gora eta behera gezi-botoiek gauza bera egiten dute; haien argibideek `Previous Match (Shift+Enter)` eta `Next Match (Enter)` diote, eta desgaituta daude bat-etortzerik ez dagoen bitartean.  
Mugimenduak buelta ematen du bi muturretan. Lehen aldiz mugitu arte ez dago uneko bat-etortzerik; beraz, lehen `Enter` sakatzeak lehen bat-etortzera eramaten du, eta lehen `Shift + Enter` sakatzeak azkenera.

Emaitzetako errenkada batean klik egiteak, edo teklatua errenkada horretan dagoela `Enter` edo `Space` sakatzeak, hauetako bat egiten du:

- Bere izenean edo izen logikoan bat-etortzeren bat duen errenkada batek haren lehen bat-etortzera eramaten du, izen logikokoa izenekoaren aurretik.
- Iruzkin edo ohar baten zati bat erakusten duen errenkada batek bat-etortze horretara eramaten du.
- Beste edozein errenkadak, adibidez izena eta izen logikoa bat ez datozen taula batek edo ohar baten errenkada propioak, errenkadak adierazten duenera eramaten du, eta uneko bat-etortzea dagoen bezala uzten du. Ikus [Errenkada batera joatea](./explorer.md#going-to-a-row).
- Karpeta bat tolestu edo zabaldu egiten da.

Bat-etortze bat uneko bihurtzen den bakoitzean, zuhaitzak haren gaineko errenkada tolestuak zabaltzen ditu eta teklatuaren errenkada hara eramaten du; beraz, zuhaitzeko gezi-teklek handik jarraitzen dute.

Bat-etortze batera joateak Taularen propietateak panela ixten du, irekita badago, eta ondoren:

- Taula edo zutabe baten izena, izen logikoa edo iruzkina bada, taula bakarrik hautatzen du, aurrera ekartzen du, eta fokuratutako gelaxka bat-etortzea duen gelaxkan jartzen du. [Taulen ikuspegi-aukera](./table-related-functions.md#table-view-options) batek ezkutatutako iruzkin bateko bat-etortzeak, aldiz, fokuratutako gelaxka ondoko izenean jartzen du. [Izenen ikuspegiak](./logical-names.md#name-view) izenarentzat edo izen logikoarentzat gelaxkarik marrazten ez duen lekuan, fokuratutako gelaxka haren lekuan marrazten denera joaten da: izenera `Physical Names` ikuspegian, eta izen logikora `Logical Names` ikuspegian.
- Indize baten izena bada, indizearen taula bakarrik hautatzen du eta aurrera ekartzen du, eta fokuratutako gelaxka taularen izenean jartzen du, edo haren izen logikoan `Logical Names` eta `Both Names` ikuspegietan, gelaxka hori dagoeneko taula horretan ez badago. Indizeen izenak ez dira oihalean marrazten.
- Taula-talde baten izena bada, taldea bakarrik hautatzen du eta aurrera ekartzen du bere taulekin.
- Ohar bat bada, oharra bakarrik hautatzen du eta aurrera ekartzen du.

Oihala helburua dagoeneko ondo ikusten ez denean bakarrik korritzen da, eta zooma ez da inoiz aldatzen. Ikus [Jauziaren helmuga](./table-related-functions.md#where-a-jump-lands).

Bilatu eremuan `Enter` sakatu ondoren, testu-kurtsorea bertan geratzen da, eta errenkada bat aukeratu ondoren, teklatua zuhaitzean geratzen da; beraz, ondoren idazten duzuna ez da hautatutako taulara iristen.  
Bat-etortze batera joateak ez du inoiz marrazten ari den erlazio bat hasten edo amaitzen.

## Ordeztea {#replacing}

`Replace` errenkada tolestuta dago hasieran. Bilatu eremuaren aurreko geziak zabaldu eta tolestu egiten du; haren argibideak `Toggle Replace` dio. Tolestean, Ordeztu eremuko testua mantentzen da.  
Errenkadak `Replace` eremua du, barruko amaieran `Preserve Case` etengailua duela, eta bi botoi; haien argibideek `Replace (Enter)` eta `Replace All` diote. Bi botoiak desgaituta daude bat-etortzerik ez dagoen bitartean.

`Replace` ekintza Ordeztu eremuan `Enter` sakatzean exekutatzen da, `Shift` teklarekin edo gabe, edo bere botoiarekin:

- Uneko bat-etortzerik ez dagoenean, lehen sakatzeak hurrengo bat-etortzera eraman besterik ez du egiten; beraz, zer aldatuko lukeen ikusten duzu ezer aldatu aurretik.
- Uneko bat-etortze bat dagoenean, agerraldi hori bakarrik ordezten du, testu bereko beste agerraldiak bere horretan utzita, eta idatzi duen testuaren ondorengo bat-etortzera jarraitzen du. Idatzi duena saltatu egiten da, bilaketa-testua duenean ere: `user` testua `super_user` testuarekin ordeztean, ez da gero `super_user` testuaren barruan gelditzen.
- Ordezpenak lehen zegoen bezala berridatziko lukeen bat-etortze bat dagoen bezala uzten da, eta sakatzeak hurrengo bat-etortzera jarraitu besterik ez du egiten.
- Ordezpena eta hurrengo bat-etortzerainoko korritzea desegite-urrats bat dira.

`Replace` sakatze-segida bat gelditu egiten da hasi zen lekura itzultzen denean. Kontagailuak `No more matches` dio, ez dago uneko bat-etortzerik, eta hurrengo sakatzeek ez dute ezer ordezten.  
Hortaz, `Customer` testua `Big Customer` testuarekin ordeztean, behin bakarrik ordezten da, `Big Big Customer` bihurtu beharrean.  
Bat-etortze batera joateak, bilaketa-testua, `Match Case`, `Match Whole Word`, `Use Regular Expression` edo testu mota bat aldatzeak, bilaketa lasterbidearekin edo `Toggle Explorer` aukera batekin irekitzeak, edo `Replace All` ekintzak segida berri bat hasten du, eta gauza bera egiten du desegite batek edo segida hasi zen testua aldatzen duen beste edozein edizioak. Ordeztu eremuko testua edo `Preserve Case` aldatzeak ez, ezta lasterbideak ere, testu-kurtsorea dagoeneko ikusgai dagoen Arakatzailera itzuli besterik egiten ez duenean.  
Segida batek dirauen bitartean, izena aldatzen dion taula edo taula-talde batek bere lekua gordetzen du zuhaitzean eta bat-etortzeen ordenan; beraz, izen-aldaketaren ondorioz geroago ordenatuko litzatekeena ez da berriro aurkitzen. Hurrengo segidak zuhaitza izenaren araberako ordenara itzultzen du, eta izena aldatutako errenkada bere leku berrira mugitzen da.

`Replace All` ekintza Ordeztu eremuan `Ctrl + Enter` (Windows/Linux) edo `⌘ + Enter` (Mac) sakatzean exekutatzen da, edo bere botoiarekin:

- Aktibatuta dauden testu motetako bat-etortze guztiak ordezten ditu, eta beste motak bere horretan uzten ditu, ordeztutako izen logiko batek eratortzen dituen izen fisikoak izan ezik; horiek idatzi egiten ditu `Table names` eta `Column names` desaktibatuta egon arren. Ikus behean. Mota lehenetsiekin, taulen, zutabeen, indizeen eta taula-taldeen izenak aldatzen ditu, eta taulen eta zutabeen izen logikoak berridazten ditu; iruzkinak eta oharrak ez dira ukitzen.
- Aldatzen duen guztia desegite-urrats bat da. Ikus [Keinu bat, urrats bat](./undo-redo.md#one-gesture-one-step).
- Kontagailuak `Replaced N matches` dio, eta testua benetan aldatu zaien agerraldiak bakarrik zenbatzen ditu. Bat ere aldatu ez denean, `No changes` dio eta historian ez da ezer erregistratzen, `(user)` adierazpen erregularra `$1` balioarekin ordeztean gertatzen den bezala.
- Ondoren, emaitzak berriro bilatzen dira uneko bat-etortzerik gabe; beraz, testu berriak dituen bat-etortzeak zerrenda ditzakete.

Bi ekintzek testu bakoitza sakatzen duzun unean dagoen bezala irakurtzen dute, ez azken bilaketak aurkitu zuen bezala.

Ordeztu eremuko testua nola erabiltzen den:

- `Use Regular Expression` aukerarik gabe, `$` ikurrak ez du esanahi berezirik, eta Ordeztu eremuko testua idatzi bezala erabiltzen da, `Preserve Case` aukerak ematen dizkion maiuskulak eta minuskulak salbu.
- `Use Regular Expression` aukerarekin, `$1` eta `$99` bitartekoak, `$<name>`, `$&`, `` $` ``, `$'` eta `$$` JavaScripten `String.prototype.replace` metodoan bezala hedatzen dira.
- `Preserve Case` aukerarik gabe, bat datorren testuaren maiuskulak eta minuskulak ez dira mantentzen: `Match Case` desaktibatuta, `user` testua `member` testuarekin ordezteak `Users` testua `members` bihurtzen du.
- `Preserve Case` aukerarekin, ordezpen bakoitzaren maiuskulak eta minuskulak ordezten duen testuaren araberakoak dira, `$1` eta gainerakoak hedatu ondoren; beraz, ordezpen berak `Users` testua `Members` bihurtzen du:
  - Osorik maiuskulaz dagoen bat-etortze batek ordezpena osorik maiuskulaz jasotzen du, eta osorik minuskulaz dagoenak osorik minuskulaz: `USER`, `account` testuarekin ordeztuta, `ACCOUNT` bihurtzen da, eta `user`, `Account` testuarekin, `account`.
  - Beste edozein bat-etortzek bere lehen karakterearen maiuskula edo minuskula ematen dio ordezpenaren lehen karaktereari, eta gainerakoa idatzi bezala uzten du: `UserId`, `accountKey` testuarekin ordeztuta, `AccountKey` bihurtzen da, eta `uSER`, `AccountKey` testuarekin, `accountKey`. Bat-etortzearen lehen karaktereak maiuskula-minuskula bereizketarik ez duenean, ordezpena idatzi bezala uzten da: `_Ab`, `xyz` testuarekin ordeztuta, `xyz` bihurtzen da.
  - Bat-etortzeak eta ordezpenak biek `-` dutenean, edo biek `_` dutenean, eta bereizle horrek zati kopuru berean zatitzen dituenean, zati bakoitzaren maiuskulak eta minuskulak dagokion zatiaren araberakoak dira: `USER_id`, `account_key` testuarekin ordeztuta, `ACCOUNT_key` bihurtzen da, eta `User-Name`, `account-key` testuarekin, `Account-Key`. `-` eta `_` ikurrek biek horrela zatitzen dituztenean, osoari zati bakar bati bezala egokitzen zaizkio maiuskulak eta minuskulak.
  - Maiuskula-minuskula bereizketa duen letrarik ez duen bat-etortze batek, esaterako `123`, ordezpena idatzi bezala uzten du.
  - Lehen zegoen bezala berridatzitako bat-etortze bat ez da zenbatzen: `Match Case` desaktibatuta, `customer` testua `Customer` testuarekin ordezteak `customer`, `Customer` eta `CUSTOMER` zeuden bezala berridazten ditu, eta horietako bat ere ez da zenbatzen.
- Ordeztu eremua hutsik badago, bat-etortzea ezabatu egiten da.

Ordezpen bat edizio arrunt bat da, taularen izen berria, zutabearen izena, izen logikoa, iruzkina edo oharraren testua zuk zeuk idaztea, indizearen izena Taularen propietateak panelean aldatzea edo taula-taldearen izena aldatzea bezalakoa.  
Historian erregistratzen da, eta lankideengana eta kodetze-agente batengana iristen da, beste edozein edizio bezala.

Beraz, ordezpen batek idazten duen taula- edo zutabe-izen bat zuk idatzitako izen bihurtzen da, eta geroago idatzitako izen logiko batek dagoen bezala uzten du, [Izen fisikoak berriro eratortzea](./dictionary.md#derive-physical-names-again) ekintzak hiztegiei itzultzen dien arte. Ordezpen batek hutsik uzten duen izen bat, aldiz, hiztegiei itzultzen zaie, garbitutako edozein izen bezala. Ikus [Zuk idatzitako izenak](./dictionary.md#names-of-your-own).  
Taula edo zutabe baten izen fisikoa hutsik dagoen edo bera ere eratorria den bitartean, ordeztutako izen logiko batek hiztegietatik eratortzen du, izen logikoaren gelaxka izen logiko berri batekin ixteak egiten duen bezala. Ikus [Izen fisikoak eratortzea](./dictionary.md#deriving-physical-names). Kasu horretan, izen logiko berria termino bat duen zutabe batek terminoaren domeinua ere hartzen du, eta harekin batera domeinuaren datu mota. Eratortzen duena ordezpenaren desegite-urratsaren parte da, eta ez da `Replaced N matches` kopuruan zenbatzen.  
`Replace All` ekintza batek taula edo zutabe bereko izen logikoa eta izena biak berridazten dituenean, idazten duen izena nagusitzen da izen logiko berriak eratorriko lukeenaren gainetik.

## Bilaketa-eremuetako teklak {#keys-in-the-search-fields}

- Bilatu eremuan, `Enter` teklak hurrengo bat-etortzera eramaten du, eta `Shift + Enter` lasterbideak aurrekora.
- Ordeztu eremuan, `Enter` teklak ordeztu egiten du, `Shift` teklarekin edo gabe, eta `Ctrl + Enter` (Windows/Linux) edo `⌘ + Enter` (Mac) lasterbideak guztiak ordezten ditu.
- Idazketa-metodo bat bi eremuetako batean konposatzen ari den bitartean, `Enter` tekla konposizioarena da, eta ez du mugitzen, ezta ordezten ere.

`Escape` teklak, oraindik funtzionatzen duten editorearen lasterbideek eta gainerako tekla guztiek eremu hauetan egiten dutena [Arakatzaileko teklak](./explorer.md#keys-in-the-explorer) atalean azaltzen da.

## Irakurtzeko soilik dauden editoreak {#read-only-editors}

[`readonly`](../../api/erd-editor-element.md#readonly) atributua duen editore batean, bilaketak aurkitu besterik ez du egiten. Ez dago ez `Toggle Replace` geziarik, ez `Replace` errenkadarik; beraz, ez dago Ordeztu eremurik, ez `Preserve Case`, ez `Replace`, ez `Replace All`.  
Bilatu eremuak, haren hiru aukerek, testu motek, kontagailuak, emaitzek eta bat-etortze batera joateak funtzionatzen dute. Bat-etortze batera joateak hautatzen du iristen den elementua, [Bat-etortze batera joatea](#going-to-a-match) atalean bezala, eta hautapen hori da irakurtzeko soilik dagoen editore batek egiten duen bakarra: oihaleko mugitzen ez den klik batek garbitu egiten du.  
Ireki bilaketa tekla-konbinazioarekin edo Bilaketa azkarreko `Toggle Explorer` aukerarekin, oihalaren laster-menuak ez baitu bertan `Toggle Explorer` aukerarik. Arakatzailearen gainerakoa Arakatzailearen orriko [Irakurtzeko soilik dauden editoreak](./explorer.md#read-only-editors) atalean azaltzen da.

VS Code editorean, diagrama baten berrikuspen bat, adibidez Git berrikuspen bat edo Local History sarrera bat, JSON testu gisa irekitzen da. `Reopen Editor With...` komandoarekin diagrama gisa berriro irekitzen denean, irakurtzeko soilik dago, eta aurkitu besterik egiten ez duen bilaketa hau du.

## Lasterbidea aldatzea {#changing-the-shortcut}

Editorea txertatzen duen orri batek `Ctrl + F` (Windows/Linux) edo `⌘ + F` (Mac) lasterbidea beste tekla-konbinazio batera alda edo ken dezake, `findReplace` izenarekin, [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) metodoaren bidez.  
Kenduta dagoenean, tekla orriarentzat geratzen da fitxa guztietan. Tresna-barrako `Explorer` botoiak Arakatzailea irekitzen eta ixten jarraitzen du, eta Bilaketa azkarreko eta oihalaren laster-menuko `Toggle Explorer` aukerak bilaketa irekitzen edo Arakatzailea ixten jarraitzen du, baina horietako batek ere ez du lasterbiderik erakusten; beraz, botoiaren argibideak `Explorer` besterik ez dio. Ezarpenetako [Lasterbideak](./settings.md#shortcuts) fitxako `Toggle Explorer` errenkadak ere ez du teklarik erakusten. Beste tekla batera aldatuta, denek tekla berria erakusten dute.
