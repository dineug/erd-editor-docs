---
sidebar_position: 3
description: Gehitu, hautatu, berrantolatu eta ezabatu zutabeak, txandakatu zutabeen aukerak, eta kopiatu edo itsatsi zutabeak.
---

# Taulak editatzea

Taulen edizioak, funtsean, Excelen antzeko edizio-esperientzia eskaintzen du.  
[Izenen ikuspegiak](./logical-names.md#name-view) erabakitzen du taula batek bere goiburuan eta errenkadetan izenak, izen logikoak ala biak marrazten dituen.  
Edizio modua `Enter` teklarekin edo gelaxka batean klik bikoitza eginez hasten da.  
`Enter` edo `Escape` teklarekin amaitzen da. Idazten duzuna idatzi ahala aplikatzen da; beraz, `Escape` teklak testua mantentzen du, leheneratu beharrean. [Domain gelaxka](./logical-names.md#the-domain-cell) da salbuespena: bere zerrendatik hautatu besterik ez du egiten, eta ez du inoiz gordetzen idazten duzuna. [Izen logikoaren gelaxka](./logical-names.md#writing-a-logical-name) bat izen logikoa aldatuta ixteak izen fisikoa ere bete dezake.  
`Escape` teklak gelaxka fokuratuta eta taula hautatuta uzten ditu, eta bigarren `Escape` sakatze batek biak kentzen ditu. Izen logikoaren gelaxka batek bere [terminoen zerrenda](./logical-names.md#completing-term-names) erakusten duen bitartean, lehen `Escape` sakatzeak zerrenda bakarrik ixten du.  
Idazketa-metodo bat oraindik konposatzen ari den bitartean, `Escape` teklak edizio modua irekita uzten du.

![Alt + N lasterbidearekin taula bat gehitzea eta bi zutabe betetzea](/img/demo-table-edit.webp)

## Zutabeak gehitzea {#adding-columns}

`Alt + Enter` (Windows/Linux) edo `⌥ + Enter` (Mac) lasterbidearekin sortzen da.  
Hautatutako taula guztiei zutabe bat gehitzen zaie.

## Tab tekla {#tab-key}

Sakatu `Tab` hurrengo gelaxkaren edizio modura zuzenean igarotzeko.  
Azken gelaxkan `Tab` sakatzeak zutabe berri bat sortzen du.  
Erabili `Shift + Tab` aurreko gelaxkaren edizio modura joateko.  
`Tab` eta `Shift + Tab` teklak taulak marrazten dituen gelaxketatik igarotzen dira, haien ordenan; beraz, Izenen ikuspegiak eta View Option → `Domain` aukerak erabakitzen dute izen logikoaren gelaxkak eta Domain gelaxkak haien artean dauden ala ez. Ikus [Izen logiko bat idaztea](./logical-names.md#writing-a-logical-name).  
Errenkada baten azken gelaxkaren ondoren marrazten diren [gako alternatiboen](./table-related-functions.md#alternate-keys) markak ez dira gelaxkak; beraz, teklatuaren fokuak gainetik saltatzen ditu, eta ez dira inoiz editatzeko irekitzen.

![Tab teklarekin errenkada baten gelaxketan zehar mugitzea, azken gelaxkatik zutabe bat gehitzea eta Shift + Tab lasterbidearekin atzera egitea](/img/demo-table-tab.webp)

## Datu motaren osatze automatikoa {#datatype-autocomplete}

Hasi `DataType` gelaxka bat editatzen eta idatzi. Hautatutako datu-basean bat datozen motak iradokitzen dira, eta iradokizun batean idatzi duzuna hitzez hitz jasotzen duen zatia nabarmentzen da.  
Bat-etortzea bera lausoa da; beraz, `vch` testuak `VARCHAR` mota ere aurkitzen du.

- `Arrow Up` edo `Arrow Down`: mugitu iradokizunetan zehar
- `Arrow Right`, `Tab` edo `Enter`: onartu nabarmendutako iradokizuna
- `Arrow Left`: itzuli idatzi duzun testura

Iradokizun batean klik ere egin dezakezu.  
Zerrendak gehienez hamar iradokizun erakusten ditu aldi berean, eta gainerakoetarako korritu egiten da.  
Ez da ezer behartzen; beraz, zerrendan ez dagoen mota bat askatasunez idatz daiteke, argumentuak barne, adibidez `VARCHAR(255)`. Zerrenda itxi egiten da idazten duzunak mota-izen oso bat gainditzen duenean, `VARCHAR(255)` edo `BIGINT UNSIGNED` idaztean gertatzen den bezala.  
Iradokizunak hautatutako datu-basearen araberakoak dira. Datu-basea aldatzeak eskaintzen dena aldatzen du, eta lehendik dauden zutabeak dauden bezala uzten ditu.

Domeinu bati lotutako zutabe baten `DataType` gelaxkan idazteak, edo bertan iradokizun bat onartzeak, zutabearen lotura kentzen du haren mota domeinuarenaren desberdina den unean bertan. Ikus [Domeinuak eta datu motak](./dictionary.md#domains-and-data-types).  
`Logical Names` ikuspegian, View Option → `Domain` desaktibatuta dagoen bitartean, izena duen domeinu bati lotutako zutabe baten mota-gelaxkak domeinuaren izena erakusten du, eta hura editatzeak [domeinu-hautatzailea](./logical-names.md#the-domain-cell) irekitzen du iradokizun hauen ordez. Datu mota bat erakusten duen mota-gelaxkan, datu mota goian azaldu bezala editatzen da.

![DataType gelaxkak iradokizun lausoekin betetzea gezi-teklak, Tab eta Enter erabiliz](/img/demo-data-type-autocomplete.webp)

## Ez nulua, bakarra, gehikuntza automatikoa {#not-null-unique-auto-increment}

Hiru gelaxka hauek etengailuak dira, ez testua.  
Egin klik bikoitza horietako batean, edo sakatu `Enter` fokuratuta dagoen bitartean, hura txandakatzeko.

Not Null gelaxkak `N-N` dio ezarrita dagoenean, eta `NULL` ezarrita ez dagoenean.  
`UQ` eta `AI` markak lausotuta daude desaktibatuta daudenean, eta nabarmenduta aktibatuta daudenean.

![Not Null klik bikoitzarekin txandakatzea, eta Unique eta Auto Increment Enter teklarekin](/img/demo-column-options.webp)

[Taulen ikuspegi-aukerek](./table-related-functions.md) ezkutatutako gelaxkak ezin dira txandakatu.

## Hainbat zutabe hautatzea {#selecting-multiple-columns}

Bost metodo onartzen ditu:

- `Shift + Arrow Up/Down`: zabaldu hautapena errenkadaz errenkada
- `Ctrl + click` (Windows/Linux) edo `⌘ + click` (Mac): gehitu zutabe bakar bat
- `Shift + click`: hautatu azken fokuratutako zutabetik hasitako tartea
- `Ctrl + Shift + click` (Windows/Linux) edo `⌘ + Shift + click` (Mac): gehitu tarte hori hautapenari
- `Alt + A` (Windows/Linux) edo `⌥ + A` (Mac): hautatu guztiak

![Zutabeak hautatzea Shift + Arrow Down, Ctrl/⌘ + click, Shift + click eta Alt + A erabiliz](/img/demo-column-select.webp)

Hautatutako zutabeak batera mugitzeko, arrastatu fokuratutakoaren ondoko heldulekua. Ikus [Zutabeak berrantolatzea eta mugitzea](#rearranging-and-moving-columns).

Zutabe baten errenkadan eskuineko klik egiteak erabakitzen du taularen laster-menuak zein zutaberen gainean jarduten duen, sakatuta dagoen tekla aldatzailea edozein dela ere.  
Dagoeneko hautatuta dagoen errenkada batean, hautapena mantendu egiten da eta fokua errenkada horretara mugitzen da. Beste edozein errenkadatan, errenkada hori bakarrik hautatzen da. Hori errenkadako edozein lekutan gertatzen da, gako-ikonoa eta [gako alternatibo](./table-related-functions.md#alternate-keys) baten marka barne.  
Beraz, menutik hainbat zutaberen gainean jarduteko, [Zutabearen gako nagusia](#column-primary-key) edo [Zutabeak ezabatzea](#column-deletion) ataletan bezala, egin eskuineko klik hautatutako errenkadetako batean.  
Mac sisteman, `Ctrl + click` lasterbideak ere irekitzen du menua, baina klik arrunttzat hartzen da; beraz, gelaxka batean errenkada hori bakarrik hautatzen du menua ireki aurretik.

## Zutabeak berrantolatzea eta mugitzea {#rearranging-and-moving-columns}

Zutabe bat bere arrastatzeko heldulekuarekin mugitzen da: heldulekuaren ikurra duen botoi txiki bat, taularen ezkerreko ertzetik kanpo dagoena, fokuratutako errenkadaren ondoan.  
Fokuratu zutabearen edozein gelaxka, hartan klik eginez edo gezi-teklekin edo `Tab` teklarekin, eta heldulekua haren errenkadaren ondoan agertzen da. Fokua taularen goiburuan dagoen bitartean, ez du errenkada batek ere heldulekurik.  
Heldulekua ahul marrazten da erakuslea haren gainean jarri arte, eta orduan erakuslea esku bihurtzen da. Sakatze batek berak ez du ezer egiten: arrastatzea erakuslea mugitzen denean hasten da, eta zutabea bere taulako beste leku batera edo beste taula batera eraman dezake.  
Taula baten errenkaden gainean, arrastatutako errenkadak beren lekura mugitzen dira, eta askatze-puntuaren inguruko errenkadak alde batera lerratzen dira lekua egiteko. Oihal hutsaren gainean, edo zutabeak dituen taula baten goiburuaren gainean, errenkaden kopia erdi garden batek jarraitzen dio erakusleari, eta errenkada bakoitzaren izen- eta mota-gelaxkak erakusten ditu, errenkadak uneko [Izenen ikuspegian](./logical-names.md#name-view) marrazten dituen bezala.  
Askatu taula baten azken errenkadaren azpian bertan, zutabea taula horren amaierara mugitzeko. Zutaberik ez duen taula batek bere gaineko edozein lekutan onartzen du askatzea. Taularen ezkerrean bertan dagoen eremu estua, heldulekua dagoen lekua, taularen errenkadatzat ere hartzen da; beraz, heldulekuan zehar zuzenean behera arrastatzeak zutabeen ordena aldatzen du, erakuslea taulan sartu gabe.  
Beste taula batera mugitutako zutabe batek bere izen logikoa eta bere domeinua mantentzen ditu.

![Zutabe bat fokuratzea eta haren errenkadaren ondoko heldulekua kokapen berri batera arrastatzea, eta ondoren beste zutabe baten heldulekua beste taula batera arrastatzea](/img/demo-column-move.webp)

Hainbat zutabe aldi berean mugitzeko, [hautatu zutabeak](#selecting-multiple-columns) eta arrastatu fokuratutakoaren ondoko heldulekua. Fokuratutako zutabea bere taulako hautatutako bi zutabe edo gehiagotako bat den bitartean, heldulekuak guztiak eramaten ditu; bestela, bere zutabea bakarrik eramaten du.  
Ez da tekla aldatzailerik behar. Heldulekuan `Alt` (Windows/Linux) edo `⌥` (Mac) sakatuta edukitzeak zutabeak arrastatze arrunt batek bezala mugitzen ditu, eta ez du ezer bikoizten.

![Hiru zutabe hautatzea, eta ondoren fokuratutakoaren ondoko heldulekua beste taula batera arrastatzea, hautatutako beste zutabeak harekin batera mugitzen direla](/img/demo-column-multi-move.webp)

Zutabe baten errenkadan, eta ez haren heldulekuan, hasten den arrastatze batek taula mugitzen du, haren goiburuko arrastatze batek bezala. Ikus [Hainbat taula mugitzea](./table-related-functions.md#moving-multiple-tables). Errenkada batean `Alt + drag` (Windows/Linux) edo `⌥ + drag` (Mac) eginez gero, taula bikoizten da. Ikus [Taulak eta oharrak bikoiztea](./table-related-functions.md#duplicating-tables-and-memos).  
Ez da heldulekurik marrazten `70%` edo gutxiagoko zoomean, taulek beren izenak bakarrik erakusten dituztenean, ezta irakurtzeko soilik dagoen editore batean ere; beraz, bertan ezin da zutabeen ordena aldatu.

## Zutabeak ezabatzea {#column-deletion}

Fokuratutako taularen hautatutako zutabeak ezabatzen ditu. Gelaxka batean klik egiteak haren zutabea hautatzen du; beraz, gelaxka batean klik egin eta `Delete` sakatzeak zutabe hori bakarrik kentzen du.  
Lasterbideak:

- `Delete` edo `Backspace`. Tekla hauek hautatutako zutabeak kentzen dituzte haien taula hautatutako gauza bakarra den bitartean. Zutaberik hautatuta ez dagoenean (fokua taularen izenean, [izen logikoan](./logical-names.md#name-view) edo iruzkinean dagoela), beste zerbait ere hautatuta dagoenean, edo taulek beren izenak bakarrik erakusten dituzten `70%` edo gutxiagoko zoomean, hautapen osoa kentzen dute horren ordez. Ikus [Taulak eta oharrak ezabatzea](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` edo `Alt + Delete` (Windows/Linux), `⌥ + Backspace` edo `⌥ + Delete` (Mac). Lasterbide hauek fokuratutako taularen hautatutako zutabeak kentzen dituzte, beste taula edo ohar batzuk ere hautatuta egon arren. Ez dute ezer kentzen gelaxka bat edizioan dagoen bitartean edo `70%` edo gutxiagoko zoomean.

![Zutabe bat ezabatzea, eta ondoren hautatutako bi zutabe, Alt + Backspace lasterbidearekin](/img/demo-column-remove.webp)

Taularen laster-menuak gauza bera egiten du. Taula hautatutako gauza bakarra dela, egin eskuineko klik zutabe baten errenkadan: menuko azken aukerak `Delete column` dio, edo `Delete columns` errenkada hori hautatutako bi zutabe edo gehiagotako bat denean.

Gelaxka bat edizioan dagoen bitartean, `Delete` eta `Backspace` teklek testua bakarrik ezabatzen dute. Gelaxka-editoretik kanpo sakatuta mantenduz gero, behin bakarrik kentzen dute.  
Kentze baten ondoren, fokua fokuratutakoaren gainean geratzen den zutaberik hurbilenera mugitzen da. Haren gainean zutaberik geratzen ez denean, fokua taularen izenera mugitzen da (`Logical Names` ikuspegian, haren lekuan marrazten den izen logikora), azpian zutabeak geratu arren; beraz, hurrengo `Delete` edo `Backspace` sakatzeak taula kentzen du, ez zutabe bat.  
Kendutako zutabe bat erabiltzen duten erlazioak eta indizeak harekin batera kentzen dira. Ez dago berrespenik, eta kentze osoa desegite-urrats bat da.

## Zutabeak kopiatzea/itsastea {#copyingpasting-columns}

Taulan oinarritutako arbel baten moduan funtzionatzen du.  
Lasterbideak: `Ctrl + C` (Windows/Linux) edo `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) edo `⌘ + V` (Mac)

Kalkulu-orri batera kopiatzeak, kalkulu-orri batetik itsasteak eta zutabe-gelaxka bat fokuratuta duen taulan itsasteak taulek erakusten dituzten gelaxkak erabiltzen dituzte, erakusten dituzten ordenan. Ikus [Taulen ikuspegi-aukerak](./table-related-functions.md#table-view-options), [Zutabeen ordena doitzea](./settings.md#adjusting-column-order) eta [Izenen ikuspegia](./logical-names.md#name-view). Izenen ikuspegiak aldatzen du gelaxka horietako batzuek zer duten:

- `Logical Names` ikuspegian, izenaren gelaxkak izen logikoa du, edo ezer ez hura hutsik dagoen bitartean. View Option → `Domain` desaktibatuta dagoen bitartean, mota-gelaxkak zutabearen domeinuaren izena du domeinu bat erakusten duenean, eta datu mota bestela.
- `Both Names` ikuspegian, `Logical Name` gelaxka zutabeen ordenak jartzen duen lekuan kopiatzen eta itsasten da.
- Erakutsitako Domain gelaxka batek domeinuaren izena du, edo ezer ez domeinurik erakusten ez duen zutabe batean.

Editorean kopiatu eta taula baten goiburua hautatuta dagoela itsatsitako zutabeek, edo hautatutako beste tauletan itsatsitakoek, kopiatutako zutabeen gelaxka guztiak daramatzate, ezkutukoak barne, adibidez Unique eta Auto Increment, baita haien izen logikoak ere.  
Domeinu-lotura mantentzen dute soilik diagrama honek domeinu bera zerrendatzen duen bitartean, ez izen bereko bat besterik, eta domeinuak kopiatutako zutabearen mota oraindik duen bitartean. Bestela, lotura gabe iristen dira, kopiatu zirenean zuten motarekin. Haien izenak zuk idatzitakotzat hartzen dira, itsatsitako izen bat hutsik dagoenean eta izen logikoak bat eratortzen duenean izan ezik. Ikus [Izen fisikoak eratortzea](./dictionary.md#deriving-physical-names).  
`AK1.1` bezalako [gako alternatiboen](./table-related-functions.md#alternate-keys) markak ez dira gelaxkak; beraz, kopiatzean eta itsastean kanpoan geratzen dira, erakutsita dauden bitartean ere.

Editoretik Excelera eta Exceletik berriro editorera itsats dezakezu.  
Gelaxken balioak idatzi ziren bezalaxe ateratzen dira; beraz, `<label>` edo `a &amp; b` bezalako balio bat aldatu gabe iristen da kalkulu-orri edo dokumentu batera.  
Kalkulu-orriaren zutabeak ikusgai dauden gelaxkekin kokapenaren arabera parekatzen dira, ez izenaren arabera; beraz, orriaren zutabeek gelaxka horien ordenari jarraitu behar diote.  
Beheko zutabeetan, balio hauetako edozein egiazkotzat irakurtzen da (maiuskulak eta minuskulak bereizi gabe):

- AutoIncrement: `TRUE`, `1`, `YES`, `Y`
- Unique: `TRUE`, `1`, `YES`, `Y`
- Not Null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

Kanpora ateratzean, editoreak `TRUE` edo `FALSE` idazten du AutoIncrement eta Unique zutabeetarako, eta `NOT NULL` edo `NULL` Not Null zutaberako.  
Unique eta Auto Increment lehenespenez ezkutatuta daude; beraz, `TRUE` eta `FALSE` balioak gelaxka horiek erakusten direnean bakarrik idazten eta irakurtzen dira.

![Lau zutabe kalkulu-orri batean itsastea, markak TRUE/FALSE eta NOT NULL/NULL gisa idatzita](/img/demo-copy-column-to-sheet.webp)

![Kalkulu-orri bateko hiru errenkada taula batean zutabe gisa itsastea, YES, 1 eta NOT NULL egiazkotzat irakurrita](/img/demo-copy-sheet-column.webp)

Itsatsitakoa non kokatzen den fokuaren araberakoa da:

- Taula baten goiburua hautatuta dagoela, itsatsitako errenkadak zutabe berri gisa gehitzen zaizkie hautatutako taula guztiei.
- Zutabe-gelaxka bat fokuratuta dagoela, taula horren hautatutako errenkadak, eta ondoren haietako azkenaren azpiko errenkadak, ordenan gainidazten dira, itsatsitako adina. Hautapen bereizien arteko errenkadak saltatu egiten dira. Gainidatzitako errenkada batek itsatsitako balioak hartzen ditu bere gelaxka ikusgaietan eta ezkutukoak mantentzen ditu, eta soberan geratzen diren errenkadak zutabe berri gisa gehitzen dira. Hautatutako beste taula guztiei itsatsitako errenkadak zutabe berri gisa gehitzen zaizkie.

![Bi zutabe kopiatzea eta hautatutako bi tauletan aldi berean itsastea](/img/demo-copy-column-multi.webp)

Itsatsitako errenkada batek honela idazten ditu izen logikoak eta domeinuak:

- Izen logiko bat, `Logical Name` gelaxka batetik edo `Logical Names` ikuspegiko izenaren gelaxkatik datorrena, osorik idatzitakotzat hartzen da. Zutabearen izena hutsik edo oraindik eratorria dagoen bitartean, [hiztegiek](./dictionary.md#deriving-physical-names) hartatik eratortzen dute izen fisikoa eta haren terminoak ematen duen domeinua lotzen dute, errenkadaren beraren Domain gelaxkak domeinu bat lotzen duenean izan ezik. Errenkada berak itsasten duen izen bat mantendu egiten da eta zuk idatzitakotzat hartzen da.
- Domain gelaxka batek, edo `Logical Names` ikuspegiko mota-gelaxkak View Option → `Domain` desaktibatuta dagoen bitartean, bere testuak izendatzen duen domeinua lotzen du, diagramak halakorik zerrendatzen badu. Beste edozein testuk, edo gelaxka huts batek, ez du ezer lotzen eta zutabearen lotura kentzen du, baita itsatsitako motako domeinu batetik ere. Domeinurik izendatzen ez duen mota-gelaxkako testua datu mota gisa irakurtzen da. Editorean kopiatutako errenkadek, horren ordez, kopiatu zirenean zuten domeinua lotzen dute, eta diagrama honek kopiatutako motarekin zerrendatzen duen bitartean soilik, zutabe berriek bezala.
- Lotutako domeinu batek bere datu mota ematen dio zutabeari, errenkadak bere mota bat itsasten duenean izan ezik. Orduan, beste mota bateko domeinurik ez da lotzen, eta zutabeak itsatsitako mota hartzen du.
- Domain gelaxkarik gabeko errenkada batean, itsatsitako mota batek beste mota bateko domeinu batetik kentzen du zutabearen lotura, mota hori idazteak bezala.
- Itsasketa batek ere ez du motarik hedatzen [Erlazioen datu moten sinkronizazioaren](./settings.md#relationship-datatype-sync) bidez.

## Taulak eta oharrak kopiatzea/itsastea {#copyingpasting-tables-and-memos}

Fokuratutako taula baten barruan zutaberik hautatuta ez dagoenean, lasterbide berberek hautatutako taulak eta oharrak beraiek kopiatzen dituzte. Ikus [Taulekin lotutako funtzioak](./table-related-functions.md).

## Zutabearen gako nagusia {#column-primary-key}

Fokuratutako zutabearen gako nagusia txandakatzen du, hau da, fokuratutako gelaxkaren zutabearena.  
Fokuratutako zutabea hautatutako bi zutabe edo gehiagotako bat denean, txandaketa hautatutako zutabe guztiei aplikatzen zaie: haietakoren bat gakoa ez bada, guztiak gako bihurtzen dira, eta guztiak dagoeneko gakoak badira, guztiei kentzen zaie gakoa. Hautapenetik kanpoko zutabeak ez dira ukitzen.  
Erabili taularen laster-menua edo `Alt + K` (Windows/Linux) edo `⌥ + K` (Mac) lasterbidea. Txandaketak bi zutabe edo gehiago hartzen dituenean, menuko aukerak `Primary Key on selected columns` dio, `Primary Key` beharrean.  
Errenkadako gako-ikonoa erakusteko soilik da; beraz, haren gainean klik egiteak ez du gakoa ezartzen.

Hainbat zutabe gako konposatu bakar bihurtzeko, [hautatu zutabeak](#selecting-multiple-columns), eta ondoren sakatu `Alt + K` (Windows/Linux) edo `⌥ + K` (Mac), edo egin eskuineko klik hautatutako errenkadetako batean eta aukeratu `Primary Key on selected columns` aukera. Txandaketa bakoitza desegite-urrats bat da.

![Shift + Arrow Down erabiliz bi zutabe hautatzea, eta ondoren biak gako nagusi bihurtzea ⌥ + K lasterbidearekin eta biak garbitzea bigarren sakatze batekin](/img/demo-column-pk.webp)
