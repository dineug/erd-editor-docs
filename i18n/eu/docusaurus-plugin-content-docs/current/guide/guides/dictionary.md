---
sidebar_position: 14
description: Gorde diagramaren domeinuak, hitzak eta terminoak Hiztegia fitxan, eratorri izen fisikoak izen logikoetatik, utzi domeinu bati bere zutabeen datu mota ezartzen, irakurri Egiaztapenak orriak aurkitzen duena, editatu eta ordenatu orriak kalkulu-orri batean bezala, eta inportatu eta esportatu CSV fitxategi gisa.
---

# Hiztegia

Hiztegia fitxak diagramaren izendapen-estandarra hiru hiztegitan gordetzen du, bakoitza kalkulu-orri bat bezala editatzen duzun orri batean:

- `Domains`: izena duten datu motak, adibidez `Name`, `VARCHAR(100)` motarako. Domeinu bati lotutako zutabe batek haren datu mota dauka.
- `Words`: izen logikoak osatzen dituzten hitz estandarrak, bakoitza izen fisiko batek harentzat erabiltzen duen laburdurarekin, adibidez `Customer` eta `CUST`.
- `Terms`: izen logiko osoak, bakoitza ematen duen izen fisikoarekin eta domeinuarekin, adibidez `Customer Name`, `CUST_NM` izenarekin.

Taula baten edo zutabe baten [izen logikoak](./logical-names.md) hiztegi hauetatik eratortzen du haren izen fisikoa, eta zutabe baten terminoak domeinu bati ere lot diezaioke zutabea. Ikus [Izen fisikoak eratortzea](#deriving-physical-names).  
Laugarren orri batek, `Checks` orriak, hiztegiek diagramaren izen eta motetan eta hiztegietan bertan aurkitzen dituzten akatsak zerrendatzen ditu, adibidez izen logiko bateko hitz debekatu bat. Ikus [Egiaztapenak orria](#the-checks-sheet).

## Fitxa irekitzea {#opening-the-tab}

Aldatu tresna-barrako `Dictionary` fitxara, `Code Generator` eta `Settings` botoien arteko liburu-ikonoa duen botoiarekin, edo aukeratu `Dictionary` [Bilaketa azkarreko](./quick-search.md) `Tab` azpimenuan.  
Diagrama irekitzean agertzen den fitxa izan daiteke. Ikus `Canvas Type` [Blokeoa](./settings.md#lock) atalean.

Fitxa `Domains` orrian irekitzen da, beste bat aukeratzen duzun arte.  
Irekitzen den bakoitzean, orria utzi zenituen hautapenarekin eta korritze-posizioarekin itzultzen da, edo, lehen bisitan, lehen gelaxka hautatuta duela. Haren saretak hartzen du teklatua; beraz, idazteak edo gezi-teklek berehala eragiten dute.

Erakutsitako orria eta orri bakoitzaren bilaketa, hautapena, korritze-posizioa eta zutabeen zabalerak zureak bakarrik dira.  
Horietako ezer ez da fitxategian gordetzen, desegite-historian erregistratzen edo lankideekin partekatzen. Editorea irekita dagoen bitartean mantentzen dira, fitxa-aldaketetan zehar eta editore berean kargatutako dokumentuetan zehar.

## Orriak {#the-sheets}

Goiko barrak lau orri-botoiak ditu, `Domains`, `Words`, `Terms` eta `Checks`, eta erakutsitako orriaren botoia sakatuta ikusten da. Bakoitzak kopuru bat erakusten du bere izenaren ondoan: bere orriak dituen errenkadak, bilaketak erakusten duena edozein dela ere, edo, `Checks` botoian, egiaztapenen kopurua, haien mailaren arabera koloreztatuta. Ikus [Egiaztapenak orria](#the-checks-sheet).  
Ondoren bilaketa-eremua dago. Ikus [Bilatzea](#searching). Barraren amaieran, `Domains`, `Words` eta `Terms` orrietan, eta ez irakurtzeko soilik dagoen editore batean, lau tresna daude: `Add Row`, `Delete Rows`, `Import CSV` eta `Export CSV`. Ikus [Errenkadak gehitzea eta ezabatzea](#adding-and-deleting-rows) eta [CSV fitxategiak inportatzea eta esportatzea](#importing-and-exporting-csv).  
Panel estu batean edo bistaratze-hizkuntza luze batean, barra lerro gehiagotan banatzen da; beraz, botoi guztiak eskura geratzen dira.

Saretaren azpian, egoera-lerro batek bilaketak uzten dituen errenkadak zenbatzen ditu, `4 rows` adibidean bezala, eta, hautapenak errenkadaren bat hartzen duen bitartean, zenbat hartzen dituen, `1 selected` adibidean bezala. Bi barrutik partekatzen duten errenkada bat behin zenbatzen da; beraz, zenbaki hori da `Delete Rows` botoiak kenduko lituzkeen errenkaden kopurua.  
Ezkerreko errenkada-zenbakiek orriak erakusten dituen bezala zenbatzen dituzte errenkadak, 1etik hasita. Irakurtzeko soilik dagoen gelaxka bat, hau da, `Checks` orriko gelaxka guztiak eta irakurtzeko soilik dagoen editore bateko gelaxka guztiak, atzealde grisaren gainean marrazten da, egiaztapen batek markatzen duen lekuan izan ezik.  
`Domains`, `Words` edo `Terms` orri huts batek `Import a CSV file or add a row` dio, irakurtzeko soilik dagoen editore batean izan ezik.

Orri bakoitzaren zutabeak, ordenan:

| Orria | Zutabeak |
| --- | --- |
| `Domains` | `Domain`, `Category`, `Data Type`, `Description` |
| `Words` | `Word`, `Abbreviation`, `English Name`, `Description`, `Synonyms`, `Forbidden Words` |
| `Terms` | `Term`, `Physical Name`, `Domain`, `Description`, `Synonyms` |
| `Checks` | `Type`, `Target`, `Detail` |

Gelaxkek egiten dutena:

- Domeinu baten `Data Type` eremua zutabe-mota gisa idazten da, adibidez `VARCHAR(100)` edo `NUMERIC(15,2)`, eta domeinuari lotutako zutabe guztiek daukate. Ikus [Domeinuak eta datu motak](#domains-and-data-types).
- Hitz baten `Abbreviation` eremua izen fisiko batek hitz horretarako erabiltzen duena da. Ikus [Hitzetatik](#from-the-words).
- Hitz baten `Synonyms` eta `Forbidden Words` eremuek gauza bera adierazten duten beste hitz batzuk zerrendatzen dituzte, komaz bereizita. Elementu bakoitzari muturretako zuriuneak kentzen zaizkio, elementu huts bat baztertu egiten da, eta hitzaren berdina den elementu bat ez da kontuan hartzen. Horietako bat erabiltzen duen izen logiko batek ez du izen fisikorik osatzen, eta `Checks` orriak seinalatu egiten du eta haren ordez erabili beharreko hitza izendatzen du. Ikus [Egiaztapen bakoitzak zer aurkitzen duen](#what-each-check-finds).
- Termino baten `Term` eremua izen logiko oso bat da, eta haren `Physical Name` eremua izen logiko horrek ematen duen izena da. Ikus [Termino batetik](#from-a-term).
- Termino baten `Domain` eremuak lotzen duen domeinuaren izena erakusten du, eta hutsik dago domeinurik lotzen ez duen bitartean edo geroztik kendutako domeinu bat lotzen duen bitartean. Ikus [Termino baten domeinua](#a-terms-domain).
- `Category` eta `English Name` eremuak, `Description` eremu guztiak eta termino baten `Synonyms` eremua azalpenak dira. Ez dute ezer aldatzen, eta egiaztapen batek ere ez ditu irakurtzen.

[Eskuinetik ezkerrera idazten den bistaratze-hizkuntza](./language-and-theme.md#right-to-left-languages) batean, barra, saretaren menua eta egoera-lerroa ispiluan agertzen dira; orriak eta termino baten domeinu-zerrenda, berriz, ezkerretik eskuinera geratzen dira.

## Izen fisikoak eratortzea {#deriving-physical-names}

Hiztegiek taula edo zutabe bati bere izen fisikoa eman diezaiokete, SQL eskemak eta Kode-sortzaileak idazten duten izena, haren izen logikotik abiatuta. Lehenik, `Term` eremua izen logikoa duen termino bat bilatzen da; bestela, izena hitzen laburduretatik osatzen da.  
Adibidez, `Customer` (`CUST`), `Name` (`NM`), `Number` (`NO`), `Order` (`ORD`) eta `Date` (`DT`) hitzekin, eta `Customer Number` terminoarekin, `CUST_NO` izen fisikoa eta `Number` domeinua dituela; domeinu horren datu mota `INT` da:

- `Customer Number` izen logikoak `CUST_NO` izena ematen dio zutabe bati, `Number` domeinuari lotzen dio eta `INT` mota ematen dio.
- `Order Date` izen logikoak `ORD_DT` osatzen du.
- `Customer` izen logikoa duen taula batek `CUST` izena hartzen du.

`Words` orria eta `Terms` orria hutsik daudela, ez da ezer eratortzen.

### Izen bat noiz eratortzen den {#when-a-name-is-derived}

Izen fisiko bat izen logiko bat idazten den unean eratortzen da:

- Oihalean, izen logikoaren gelaxkaren editorea irekitzean zuen izen logikoaz bestelako batekin ixten denean, `Enter`, `Tab` edo `Escape` teklarekin edo beste nonbait klik eginez. Idazten duzun tekla bakoitzak izen logikoa bakarrik idazten du. Ikus [Izen logiko bat idaztea](./logical-names.md#writing-a-logical-name).
- Berehala, gelaxkaren azpiko zerrendatik termino bat aukeratzen duzunean. Ikus [Termino-izenak osatzea](./logical-names.md#completing-term-names).
- Itsasketa batek izen logikoaren gelaxka bat idazten duenean. Ikus [Zutabeak kopiatzea/itsastea](./table-editing.md#copyingpasting-columns).
- [Bilatu eta ordeztu](./find-and-replace.md#replacing) funtzioak izen logiko bat ordezten duenean, bat-etortze bat edo guztiak.
- Kodetze-agente batek izen logiko bat ezartzen duenean.

Izen fisikoa hutsik dagoen bitartean edo bera ere eratorria den bitartean bakarrik eratortzen da. Ikus [Zuk idatzitako izenak](#names-of-your-own).  
Aukeratutako termino batek, itsasketa batek edo ordezpen batek izen logikoa eta hark eratortzen duena desegite-urrats bakar gisa idazten dituzte. Oihalean, editorea ixtean eratorritako izena bere desegite-urratsa da, idazketaren ondoren: lehen desegiteak eratorritako izena kentzen du, termino batek ekarritako domeinu eta motarekin batera, eta idatzi zenuen izen logikoa uzten du.

Geroago ez da ezer berez berriro eratortzen. Hitz baten `Abbreviation` balio berriak, termino baten `Physical Name` edo `Domain` balio berriak eta hitz edo termino berriek dagoeneko eratorritako izenak dauden bezala uzten dituzte; horretarako, erabili [Izen fisikoak berriro eratortzea](#derive-physical-names-again) atalean azaltzen den aukera. Domeinu baten `Data Type` balioa da salbuespena: berehala iristen da haren zutabeetara.

### Termino batetik {#from-a-term}

Lehenik, `Terms` orrian `Term` eremua izen logikoaren berdina duen termino bat bilatzen da. Muturretako zuriuneak eta Unicode konposizioa ez dira kontuan hartzen, baina maiuskulak eta minuskulak bereizten dira; beraz, `customer number` ez dator bat `Customer Number` terminoarekin. Izen bera duten bi terminotatik, orriko lehena hartzen da kontuan.

- Terminoak bere `Physical Name` balioa ematen du, edo, hori hutsik dagoen bitartean, haren hitzek osatzen duten izena, behean azaltzen den bezala, izen bat osatzen badute.
- Zutabe baten kasuan, terminoak bere `Domain` eremuko domeinua ere lotzen du, `Domains` orriak zerrendatzen duen bitartean, eta horrek domeinuaren datu mota ematen dio zutabeari. Ikus [Zutabe bat lotzea](#linking-a-column). Terminoak izenik ematen ez duenean ere egiten du hori. Domeinurik ez duen termino batek ez du loturarik kentzen.
- Taula batek terminoaren izen fisikoa bakarrik hartzen du.

### Hitzetatik {#from-the-words}

Bat datorren terminorik ez dagoenean, hitzek osatzen dute izena:

1. Izen logikoa zuriuneetan eta `_`, `-`, `·` eta `/` ikurretan ebakitzen da, eta hitz batek ere ez du ebaki bat gainditzen.
2. Zati bakoitza ezkerretik irakurtzen da, puntu bakoitzean `Words` orriak `Word` gisa, sinonimo gisa edo hitz debekatu gisa zerrendatzen duen testurik luzeena hartuz, eta inoiz atzera egin gabe. `가입`, `가입일` eta `일자` hitzekin, `가입일자` testua `가입일` eta `자` gisa irakurtzen da, eta `자` erregistratu gabe geratzen da; `가입 일자` testua, berriz, `가입` eta `일자` gisa irakurtzen da. Maiuskulak eta minuskulak bereizten dira: `member` ez da `Member` hitza.
3. Izen fisikoa hitz bakoitzaren `Abbreviation` balioa da, idatzi bezala, `_` ikurrarekin elkartuta, adibidez `ORD_DT`. Izen bera duten bi hitzetatik, orriko lehenak ematen du laburdura. Ez da luzera-mugarik aplikatzen, eta Kode-sortzailearen `Table Name Case` eta `Column Name Case` aukerek ez dute zerikusirik.

Dena edo ezer ez. Segmenturen bat sinonimo bat, hitz debekatu bat edo hitz batek ere zerrendatzen ez duen testua bada, edo hitz batek `Abbreviation` eremua hutsik badu, ez da izenik osatzen, eta izen fisikoa dagoen bezala geratzen da.

### Zuk idatzitako izenak {#names-of-your-own}

Hiztegiek izen fisiko bat betetzen dute soilik hutsik dagoen bitartean edo haiek beraiek bete duten bitartean. Editoreak hori gogoratzen du taula eta zutabe bakoitzerako, oihalean ezerk erakusten ez duen arren.

- Zuk idazten duzun izen bat zuk idatzitakoa bihurtzen da: izen-gelaxka batean idaztea, taula edo zutabe baten izena Bilatu eta ordeztu funtzioarekin ordeztea, zutabe baten izen-gelaxkaren gainean itsastea eta kodetze-agente batek izena aldatzea. Geroago idatzitako izen logiko batek dagoen bezala uzten du izena, izen logikoa bakarrik idazten du eta ez du domeinurik lotzen.
- Izena garbitzeak hiztegiei itzultzen die, izen huts bat beti eratortzen baita.
- Ezer eratortzen ez duen izen logiko batek izen fisikoa eta haren egoera zeuden bezala uzten ditu: izen huts bat hutsik geratzen da, eta izen eratorri batek bere izena mantentzen du eta hiztegiena izaten jarraitzen du.
- Taula edo zutabe berri bat izen hutsarekin hasten da; beraz, haren lehen izen logikoak eratortzen du. Erlazio batek gehitzen duen gako arrotzeko zutabe batek bere gakoaren araberako izena hartzen du, eta zuk idatzitakotzat hartzen da. Ikus [Gako arrotzen zutabeen izenak](./relationship-editing.md#foreign-key-column-names).
- SQL eskema, GraphQL, DBML edo AML formatuko `Import` edo `Import and Add` ekintza batek ekartzen dituen izenak, eta Hiztegia fitxa baino lehenagoko bertsio batek egindako diagrama baten izenak, zuk idatzitakotzat hartzen dira; beraz, geroago haien gainean idatzitako izen logiko batek ez du ezer eratortzen.
- [Bikoiztutako taula](./table-related-functions.md#duplicating-tables-and-memos) batek, arrastatzeko heldulekuaren bidez [beste taula batera mugitutako](./table-editing.md#rearranging-and-moving-columns) zutabe batek, kopiatutako taulen itsasketa batek eta JSON fitxategi baten `Import and Add` ekintzak izen bakoitzaren egoera mantentzen dute. Hautatutako tauletan zutabe berri gisa itsatsitako zutabeak zuk idatzitakotzat hartzen dira, itsatsitako izena hutsik badago eta haien izen logikoak izen bat eratortzen badu izan ezik.
- [Izen fisikoak berriro eratortzeak](#derive-physical-names-again) zuk idatzitako izen bat hiztegiei itzultzen die, inportatutakoa barne.

### Bi zutabe, izen bat {#two-columns-one-name}

Zutabe batek ez du ezer eratortzen bere taulako beste zutabe batek eratorriko lukeen izena dagoeneko badu. Bere izena, egoera eta domeinu-lotura mantentzen ditu, eta haren izen logikoa bakarrik idazten da. Izenak maiuskulak eta minuskulak eta muturretako zuriuneak kontuan hartu gabe alderatzen dira, gako arrotzen zutabeen izenak bezala.  
Aldaketa batek bi zutaberi izen bera emango liekeenean, taula batean `Replace All` edo `Derive Physical Names Again` aukerek egin dezaketen bezala, taulako lehenak hartzen du.  
Adibidez, `MBR_NO` gakoa duen `members` taulako auto-erreferentzia batek `MBR_NO_2` gehitzen du, eta horrek `Member Number` izen logikoa kopiatzen du. `Derive Physical Names Again` aukerak `MBR_NO` izena emango lioke, baina gakoak du izen hori; beraz, `MBR_NO_2` mantentzen du.  
Taulek ez dute halako araurik: bi taulek izen bera eratorri dezakete.

## Izen fisikoak berriro eratortzea {#derive-physical-names-again}

Erabili `Derive Physical Names Again` aukera hitz baten `Abbreviation` balioa edo termino baten `Physical Name` edo `Domain` balioa aldatu ondoren, aldaketa horiek ez baitiote ezeri izena aldatzen berez. Hartzen dituen izenak hiztegiei itzultzen dizkie eta goiko arauen arabera berriro eratortzen ditu, zuk zeuk idatzitako izenak barne. ERD fitxan bakarrik eskaintzen da, eta ez irakurtzeko soilik dagoen editore batean:

- Taularen laster-menua, `Focus on this table` edo `Focus on selected tables` aukeraren ondoren. Taula hautatutako bi taula edo gehiagoren artean dagoen bitartean, `Derive Physical Names Again` aukerak guztiak hartzen ditu, taulan eskuineko klik non egiten duzun kontuan hartu gabe. Bestela, zutabe baten errenkadan eskuineko klik eginez `Derive Physical Name Again` aukera agertzen da, zutabe horretarako bakarrik, eta goiburuan eginez `Derive Physical Names Again` aukera, taularen izenerako eta zutabe guztietarako.
- Oihalaren laster-menua, `Name View` aukeraren ondoren: `Derive Physical Names Again`, diagramako taula eta zutabe guztietarako. Ez da agertzen diagramak taularik ez duen bitartean.
- [Bilaketa azkarra](./quick-search.md#what-the-palette-lists), fokuratutako zutaberako, fokuratutako taularako, hautatutako tauletarako eta diagrama osorako errenkada gisa.

![Words orrian Number hitzaren laburdura NO-tik NUM-era aldatzea, diagramako izen fisikoak MBR_NO eta PAY_NO izaten jarraitzen dutela, eta ondoren oihalaren menuko Derive Physical Names Again aukerak MBR_NUM eta PAY_NUM bihurtzen dituela, bere terminoak ematen duen ORD_NO bere horretan geratzen den bitartean](/img/demo-derive-physical-names.webp)

Hartzen dituen taula eta zutabeetatik, izen logikoa duen bakoitza berriro eratortzen da. Zutabe batek bere terminoak ematen duen domeinua ere hartzen du, eta harekin batera domeinuaren mota, erlazioetan zehar hedatzen dena [Erlazioen datu moten sinkronizazioa](./settings.md#relationship-datatype-sync) aktibatuta dagoen bitartean.  
Ez ditu ukitzen izen logikorik ez duen taula edo zutabe bat, ezta izen berria bere taulako beste zutabe batek duen zutabe bat ere. Ikus [Bi zutabe, izen bat](#two-columns-one-name). Horietako bakoitzak bere izena eta egoera mantentzen ditu, zuk idatzitakoa edo hiztegiena, eta zutabe batek bere domeinu-lotura ere mantentzen du.  
Orain ezer eratortzen ez duen izen logiko batek izen fisikoa dagoen bezala uzten du, baina hiztegiei itzultzen die; beraz, idazten duzun hurrengo izen logikoak eratortzen du.  
Desegite-urrats bat da, zenbat izen, lotura eta mota aldatzen dituen kontuan hartu gabe. Ezer aldatzen ez duenean bakarrik ez du urratsik erregistratzen, eta zuk idatzitako izen bat hiztegiei itzultzea aldaketatzat hartzen da, izenak haiek ematen dutena dagoeneko duenean ere.

Termino baten `Physical Name` balioa bera ez da berriro osatzen aldatutako hitzetatik; beraz, editatu terminoa berriro eratorri aurretik.

## Domeinuak eta datu motak {#domains-and-data-types}

Domeinu bati lotutako zutabe batek domeinuaren `Data Type` balioa dauka. Zutabe bat lotzeak mota hori ematen dio berehala.  
Domeinu baten `Data Type` balioa aldatzen denean, `Domains` orrian editatuta, itsatsita edo inportatuta, edo lankide batek edo kodetze-agente batek aldatuta, hari lotutako zutabe guztiek mota berria hartzen dute urrats berean. [Erlazioen datu moten sinkronizazioa](./settings.md#relationship-datatype-sync) aktibatuta dagoen bitartean, aldaketa horietako bakoitza erlazioetan zehar hedatzen da, idatzitako mota-aldaketa bat bezala; desaktibatuta dagoen bitartean, lotutako zutabeak bakarrik aldatzen dira.  
Domeinu bati izena aldatzeak zutabeen Domain gelaxkek erakusten duten izena bakarrik aldatzen du.

`Domains` orrian egindako mota-aldaketa bat bertan desegiten da, eman zituen zutabe-motekin batera. Ikus [Hiztegiaren orriak](./undo-redo.md#dictionary-sheets).  
ERD fitxan zutabe bat domeinu bati berriro lotzen dion edo domeinu bati lotutako zutabe bat itzultzen duen desegite edo berregite batek domeinuak une honetan duen mota ematen dio zutabeari. Beste mota bat berrezartzen duen batek zutabearen lotura kentzen du.

### Zutabe bat lotzea {#linking-a-column}

Zutabe bat domeinu bati honela lotzen zaio:

- Domeinua zutabearen Domain gelaxkan aukeratuz, View Option → `Domain` bidez erakusten dena, edo, `Logical Names` ikuspegian, haren ordez dagoen mota-gelaxkan. Ikus [Domain gelaxka](./logical-names.md#the-domain-cell).
- Terminoak domeinu bat ematen dion izen logiko baten bidez. Ikus [Termino batetik](#from-a-term). Hori izena eratortzen den bitartean bakarrik gertatzen da; beraz, ez zuk idatzitako izen baterako, ezta eratorritako izena beste zutabe batek duen zutabe baterako ere.
- `Derive Physical Name Again` edo `Derive Physical Names Again` aukeraren bidez, hartzen duen zutabe bakoitzari bere terminoaren domeinua lotzen baitio.
- Erlazio baten bidez: gako arrotzeko zutabe batek bere gakoaren domeinua kopiatzen du, haren mota eta izen logikoarekin batera. Ikus [Erlazio identifikatzaileak](./relationship-editing.md#identifying-relationships). Kopiak beste mota bat jasotzen duen gako batek, gako serial batenak bezala, ez du domeinurik transmititzen.
- Bere taula bikoiztuz, edo arrastatzeko heldulekuaren bidez beste taula batera mugituz; bi kasuetan lotura mantentzen da. Kopiatutako taula edo zutabeen itsasketa batek lotura mantentzen du soilik diagrama honek domeinua zerrendatzen duen bitartean eta domeinuak kopiatutako zutabearen mota oraindik duen bitartean; beraz, beste diagrama bateko kopia bat loturarik gabe iristen da. Ikus [Taulak eta oharrak kopiatzea/itsastea](./table-related-functions.md#copyingpasting-tables-and-memos). `Import and Add` ekintzak ez du zutaberik lotzen.
- Domain gelaxka batean itsatsitako domeinu-izen baten bidez. Ikus [Zutabeak kopiatzea/itsastea](./table-editing.md#copyingpasting-columns).

### Lotura kentzea {#unlinking}

- Lotutako zutabe baten `DataType` gelaxkan mota bat idazteak, edo iradokizun bat onartzeak, zutabearen lotura kentzen du haren mota domeinuarenaren desberdina den unean, eta zutabeak idatzi zenuen mota mantentzen du. Ikus [Datu motaren osatze automatikoa](./table-editing.md#datatype-autocomplete). Domeinuaren mota berriro idazteak ez du berriro lotzen; horren ordez, aukeratu domeinua haren Domain gelaxkan. `DataType` gelaxkaren gaineko itsasketa batek eta kodetze-agente baten mota-aldaketa batek modu berean kentzen dute lotura.
- Erlazioen datu moten sinkronizazioa aktibatuta dagoen bitartean, mota-aldaketa bat iristen zaion eta mota berria bere domeinuarenaren desberdina duen zutabe bakoitzaren lotura urrats berean kentzen da, adibidez bere domeinu propio bati lotutako gako arrotz batena. [Mapatu zutabeak](./relationship-editing.md#map-columns) elkarrizketa-koadroak modu berean kentzen die lotura mota aldatzen dien zutabeei.
- Domain gelaxkako `None` aukerak zutabearen lotura kentzen du eta haren mota mantentzen du.
- Termino baten `Domain` balioa aldatzeak edo garbitzeak, edo termino bat kentzeak, ez du zutaberik aldatzen.

### Domeinu bat kentzea {#removing-a-domain}

Domeinu baten errenkada kentzeak haren zutabeak beren motekin uzten ditu, eta haien loturek bere horretan jarraitzen dute. Zutabeek ez dute domeinurik erakusten, eta `Checks` orriak `Unknown domain` egiaztapena zerrendatzen du horietako bakoitzerako, `Domains` orrian oraindik domeinuren bat dagoen bitartean. `Domains` orrian kentzea desegiteak loturak berriro erakusten ditu.  
Domeinua desagertuta dagoen bitartean, halako zutabe batean domeinuarenaz bestelako mota bat idazteak behin betiko kentzen du lotura, eta gauza bera egiten du haren Domain gelaxkako `None` aukerak.  
Fitxategia gordetzean lotura horiek kanpoan geratzen dira; beraz, diagrama zutabe horiek loturarik gabe irekitzen da berriro.

Kendutako domeinu bati lotutako termino batek `Domain` gelaxka hutsa erakusten du, `Unknown domain` gisa markatuta. Gelaxkan `Delete` edo `Backspace` sakatzeak haren lotura kentzen du. Ikus [Termino baten domeinua](#a-terms-domain).

## Egiaztapenak orria {#the-checks-sheet}

`Checks` orriak hiztegien egiaztapenek hiztegietan eta diagramaren taula eta zutabeetan aurkitzen dutena zerrendatzen du. Egiaztapenek irakurri bakarrik egiten dute: ez dute ezer aldatzen.  
Egiaztapen bakoitza, irakurtzen duen orriak errenkadaren bat duen bitartean bakarrik exekutatzen da, eta hitzen egiaztapenak `Words` orrian izena duen hitzen bat dagoen bitartean bakarrik; beraz, hiztegi hutsak dituen diagrama batek ez du ezer zerrendatzen.

![Customer Num gorriz eta Order Stat anbarrez marraztuta Logical Names ikuspegian, Checks orriak haien hiru egiaztapenak kopuru gorri batekin zerrendatzen dituela, Forbidden word errenkadan klik bikoitza eginez diagramako Customer Num izenera itzultzea, eta Member Number gisa berriro idaztea, egiaztapen bakarra uzten duena](/img/demo-dictionary-checks.webp)

Haren hiru zutabeak irakurtzeko soilik dira:

- `Type` zutabeak egiaztapena izendatzen du. Ikus [Egiaztapen bakoitzak zer aurkitzen duen](#what-each-check-finds).
- `Target` zutabeak hitz, termino edo domeinu bat bere izenaz izendatzen du, taula bat bere izenaz eta zutabe bat `table.column` gisa; taula eta zutabea [Izenen ikuspegiak](./logical-names.md#beyond-the-canvas) izendatzen dituen bezala izendatzen dira, eta `unnamed` agertzen da ikuspegiak izenik erakusten ez duen lekuan.
- `Detail` zutabeak egiaztapenak aurkitu duena erakusten du, eta, `→` ikurraren ondoren, hiztegiek haren ordez eskaintzen dutena, hainbat badira komaz elkartuta, adibidez `멤버 → 회원`. Alde huts batek `—` dio, `— → NUMERIC(15)` adibidean bezala.

Lehenik hitzen egiaztapenak agertzen dira, gero terminoenak eta domeinuenak, eta gero taulaz taula, taula bakoitza bere zutabeekin jarraian.  
Zerrendak edizio bakoitza jarraitzen du iristen den unean, lankide batena eta kodetze-agente batena barne, baita Izenen ikuspegiaren aldaketa bakoitza ere.  
`Checks` botoiaren kopurua gorria da egiaztapenen bat errorea den bitartean, anbarra guztiak abisuak diren bitartean, eta lausotua bat ere ez dagoenean.

Errenkadak ezin dira editatu, gehitu, ezabatu, ordenatu, inportatu edo esportatu: barrak ez du tresnarik erakusten, eskuineko klik batek ez du saretaren menurik irekitzen, eta Desegin eta Berregin komandoek ez dute ezer egiten. Bilatzeak, hautatzeak eta kopiatzeak beste orrietan bezala funtzionatzen dute.

Errenkada batean `Enter` sakatzeak edo klik bikoitza egiteak errenkadak izendatzen duenera eramaten du:

- Hitz, termino edo domeinu bat: fitxak haren orria erakusten du, egiaztapenak irakurtzen duen gelaxka hautatuta, izena edo termino baten `Domain` gelaxka, eta haren errenkada ikusgai dauden errenkaden artean lehena dela. Orriaren bilaketa garbitu egiten da errenkada ezkutatzen badu. Geroztik kendutako errenkada batek ez du inora eramaten.
- Taula edo zutabe bat: ERD fitxa agertzen da, taula bakarrik hautatuta eta egiaztapenak irakurtzen duen gelaxka fokuratuta. Gelaxka hori izena, izen logikoa edo Domain gelaxka da, edo, errenkadak gelaxka hori marrazten ez duen lekuan, haren ordez marraztutako gelaxka. Oihalak hartzen du teklatua, eta ikuspegia [Jauziaren helmuga](./table-related-functions.md#where-a-jump-lands) ataleko arauaren arabera mugitzen da.

Goiburu batean, zutabe-ertz batean, korritze-barra batean edo errenkaden azpian klik bikoitza egiteak ez du inora eramaten.  
Kodetze-agente batek egiaztapen berberak zerrendatzen ditu, ordena berean, `erd_list_checks` tresnarekin. Ikus [Hiztegiaren egiaztapenak](../../mcp/tools.md#dictionary-checks).

Beste hiru orriek egiaztapenek irakurtzen dituzten gelaxkak markatzen dituzte, izena edo termino baten `Domain` gelaxka, testu gorriz edo anbarrez, atzealde tindatu baten gainean:

- Gorria: bere orriko beste errenkada batek duen izen bat, kendutako domeinu bat lotzen duen termino baten `Domain` gelaxka, eta hitz debekatu bat erabiltzen duen `Term` gelaxka bat.
- Anbarra: sinonimo bat edo erregistratu gabeko hitz bat erabiltzen duen `Term` gelaxka bat.

Gelaxka batek bere mailen artean nabarmenena hartzen du. Markak irakurtzeko soilik dagoen editore batean ere agertzen dira, eta `Checks` orria bera ez da koloreztatzen. ERD oihaleko markei buruz, ikus [Oihaleko markak](#marks-on-the-canvas).

### Egiaztapen bakoitzak zer aurkitzen duen {#what-each-check-finds}

| `Type` | Maila | Zer aurkitzen du | `Detail`, adibidez |
| --- | --- | --- | --- |
| `Duplicate name` | Errorea | Orri bereko beste errenkada batek ere duen `Word`, `Term` edo `Domain` bat. Errenkada bakoitza zerrendatzen da. | `Member` |
| `Unknown domain` | Errorea | Kendutako domeinu bati oraindik lotuta dagoen zutabe edo termino bat, `Domains` orrian domeinuren bat dagoen bitartean | Kendutako domeinuaren izena |
| `Forbidden word` | Errorea | Izen logiko baten edo `Term` baten segmentu bat, hitz batek bere `Forbidden Words` eremuan zerrendatzen duena | `커스터머 → 고객` |
| `Unregistered word` | Abisua | Hitz batek ere zerrendatzen ez duen segmentu bat, taula baten edo zutabe baten izen logikoan edo `Term` batean | `자` |
| `Synonym` | Abisua | Hitz batek bere `Synonyms` eremuan zerrendatzen duen segmentu bat | `멤버 → 회원` |
| `Physical name mismatch` | Abisua | Izen logikoa termino batekin bat datorren baina izen fisikoa terminoak ematen duena ez duen taula edo zutabe bat | `mbr_no → MBR_NO` |
| `Domain type mismatch` | Abisua | `DataType` balioa lotzen duen domeinuaren `Data Type` balioaren desberdina duen zutabe bat | `INT → NUMERIC(15)` |

- Izenak muturretako zuriuneak kenduta eta maiuskulak eta minuskulak bereizita alderatzen dira; beraz, `Member` eta `member` bi izen dira, eta izen huts bat ez da inoiz bikoiztua. Orriek bi errenkadari izen bera emango liekeen edizio bat ukatzen dute; beraz, `Duplicate name` egiaztapena bi edizio gurutzatu diren lekuetan bakarrik agertzen da, adibidez bi lankidek errenkadei aldi berean izena ematen dietenean, edo beste nonbait editatutako fitxategi batean.
- Hitzen egiaztapenek [Hitzetatik](#from-the-words) atalak azaltzen duen bezala irakurtzen dute izen bat, eta segmentu desberdin bakoitza behin zerrendatzen dute izen bakoitzeko. `Forbidden word` eta `Synonym` egiaztapenek segmentua zerrendatzen duen hitza eskaintzen dute.
- `Physical name mismatch` egiaztapenak izena, muturretako zuriuneak kenduta, terminoaren `Physical Name` balioarekin alderatzen du, edo, hura ez duen bitartean, haren hitzek osatzen dutenarekin, eta ez du ezer esaten terminoak izenik ematen ez duen bitartean. Bere gakoaren izen logikoa kopiatu duen gako arrotzeko zutabe batek egiaztapen hau erakusten du bere izena terminoarenaren desberdina den bakoitzean, adibidez `members_id → MBR_ID`. `Derive Physical Name Again` aukerak konpontzen du, beste zutabe batek izen hori ez badu.
- `Domain type mismatch` egiaztapena ez da inoiz editore bakar bateko edizioetatik sortzen, lotutako zutabe batek beti bere domeinuaren mota izaten amaitzen baitu. Lankide batek zutabe bat lotzen duen bitartean beste batek domeinu horren mota aldatzen duenean ager daiteke, edo beste nonbait idatzitako fitxategi batean. Domeinua zutabearen Domain gelaxkan berriro aukeratzeak haren mota ematen dio zutabeari, eta `None` aukerak lotura kentzen dio. Kendutako domeinu baterako lotura bat `Unknown domain` gisa bakarrik agertzen da.

### Oihaleko markak {#marks-on-the-canvas}

ERD oihalak egiaztapenek seinalatzen duten izena bere egiaztapenaren kolorean idazten du:

- Izen logikoaren gelaxka bat, taularen goiburuan edo zutabe baten errenkadan, gorria da bere izen logikoak hitz debekatu bat erabiltzen duen bitartean, eta, bestela, anbarra sinonimo bat edo `Words` orrian ez dagoen hitz bat erabiltzen duen bitartean.
- Izen fisikoaren gelaxka bat, goiburuan edo errenkada batean, anbarra da bere izen logikoarekin bat datorren terminoak beste izen fisiko bat ematen duen bitartean.

Bi gelaxka mota horiek bakarrik markatzen dira, inoiz ez Domain gelaxka edo `DataType` gelaxka; beraz, zutabe baten `Unknown domain` eta `Domain type mismatch` egiaztapenak `Checks` orrian bakarrik agertzen dira.  
Gelaxka bat marrazten duenagatik bakarrik markatzen da: `Physical Names` ikuspegiak izen fisikoak bakarrik marka ditzake, `Logical Names` ikuspegiak izen logikoak bakarrik, eta `Both Names` ikuspegiak gelaxka bakoitza bere egiaztapenen arabera. Ikus [Izenen ikuspegia](./logical-names.md#name-view). Gelaxka huts batek bere leku-markaren kolorea mantentzen du, eta hiztegi hutsek ez dute ezer markatzen.  
Koloreztatutako [taula-talde](./table-groups.md) bateko taula baten goiburuan, marka batek bere kolorea mantentzen du taldearen kolorearen gainean irakurgarri dagoen bitartean bakarrik; bestela, izenak goiburuaren beraren beltza edo zuria hartzen du.

Markak ERD oihalean, [Denbora-bidaian](./undo-redo.md#time-travel) eta [Antolaketa automatikoaren](./table-related-functions.md#auto-layout) aurrebistan agertzen dira, irakurtzeko soilik dagoen editore batean ere. Bisualizazioa fitxak, [Diferentzia-ikustailearen](./table-related-functions.md#diff-viewer) bi aldeek eta esportatutako irudi batek ez dute bat ere marrazten.  
Aldaketa bakoitza jarraitzen dute gertatu ahala, izen batena izan edo hitz, termino edo domeinu batena izan.

## Bilatzea {#searching}

Bilaketa-eremuak `Search` dio, eta lau orrietan agertzen da, irakurtzeko soilik dagoen editore batean ere. Orri bakoitzak bere bilaketa du.  
Errenkada bat bilaketarekin bat dator bilatutako gelaxketako batek testua duenean, maiuskulak eta minuskulak, Unicode konposizioa eta bilaketaren inguruko zuriuneak kontuan hartu gabe. Bat-etortze bat ez da inoiz bi gelaxkatan zehar hedatzen. Bilatutako gelaxkak:

- `Domains`: `Domain`, `Data Type` eta `Description`.
- `Words`: `Word`, `Abbreviation`, `English Name` eta `Description`.
- `Terms`: `Term`, `Physical Name` eta `Description`.
- `Checks`: hirurak, bistaratze-hizkuntzan agertzen diren bezala.

Bilaketa berri batek hautapena lehen gelaxkan jartzen du eta goraino korritzen du.  
Eremuak testua duen bitartean, `Clear search` argibidea duen `x` botoi batek hustu egiten du eta testu-kurtsorea eremuan uzten du. Eremuan `Escape` sakatzeak ere hustu egiten du.  
Eremuan, `Ctrl + Z` (Windows/Linux) edo `⌘ + Z` (Mac) lasterbideak zure idazketa desegiten du, ez orria, eta [Errenkadak gehitzea eta ezabatzea](#adding-and-deleting-rows) ataleko errenkaden teklak testu-teklak dira.  
`Add Row` botoiak eta txertatzeek bilaketa garbitzen dute lehenik, errenkada huts bat ez baitator bat inolako bilaketarekin. Inportazio batek mantendu egiten du.

## Hautatzea eta mugitzea {#selecting-and-moving}

Saretak kalkulu-orri batek bezala hautatzen du:

- Klik batek gelaxka bat hautatzen du, eta arrastatze batek barruti bat, orriaren ertzean korrituz. `Shift + click` konbinazioak hautapena gelaxka aktibotik zabaltzen du, eta `Ctrl + click` (Windows/Linux) edo `⌘ + click` (Mac) konbinazioak beste barruti bat gehitzen du.
- Zutabe-goiburu batek bere zutabea hautatzen du, errenkada-zenbaki batek bere errenkada, eta goiko ezkerreko izkinak gelaxka guztiak, `Ctrl + A` (Windows/Linux) edo `⌘ + A` (Mac) lasterbideak bezala.
- Mac batean, `Ctrl + click` eskuineko klik bat da. Ikus [Saretaren menua](#the-grids-menu).

Teklatuarekin:

- Gezi-teklekin gelaxka bat mugitzen da, eta, `Ctrl` (Windows/Linux) edo `⌘` (Mac) sakatuta, norabide horretan orriaren ertzera joaten da.
- `Home` eta `End` teklekin errenkadaren lehen eta azken gelaxkara joaten da, eta, `Ctrl` edo `⌘` sakatuta, orriaren lehen eta azken gelaxkara.
- `Page Up` eta `Page Down` teklekin pantaila bateko errenkada adina mugitzen da.
- Goiko tekletako edozeinekin `Shift` sakatuta edukitzeak hautapena zabaltzen du, mugitu beharrean.
- `Tab` eta `Shift + Tab` lasterbideekin eskuinera eta ezkerrera mugitzen da, eta `Shift + Enter` lasterbidearekin gora. `Enter` bakarrik sakatzeak gelaxka editatzen du. Ikus [Gelaxkak editatzea](#editing-cells).

Hautapenaren azpiko errenkadak desagertzen direnean, desegite baten edo lankide baten kentze baten ondorioz, hautapena geratzen diren errenkaden barrura itzultzen da.

Arrastatu zutabe-goiburu baten eskuineko ertza zutabearen tamaina aldatzeko, edo egin klik bikoitza ertzean zutabea ikusgai dauden errenkadetako testurik zabalenera egokitzeko. Ez dago zutabe baten tamaina aldatzen duen teklarik.

## Gelaxkak editatzea {#editing-cells}

Hautatutako gelaxkan idazteak haren balioa ordezten du. `Enter` edo `F2` teklak, edo klik bikoitz batek, balioa dagoen bezala editatzen du, testu-kurtsorea amaieran dagoela.  
Gelaxka batek lerro bakarra dauka; beraz, bertan itsatsitako tabulazio bat edo lerro-jauzi bat zuriune bihurtzen da.

- `Enter` teklak edizioa idazten du eta hautapena behera eramaten du, eta `Tab` teklak idatzi eta eskuinera eramaten du. `Shift` teklarekin, gora edo ezkerrera eramaten dute.
- Beste nonbait klik egiteak, edo teklatuak sareta uzteak, ere idazten du.
- `Escape` teklak bertan behera uzten du.

![Words orria editatzea: gelaxka baten gainean NUM idaztea eta Enter sakatzea, ⌥ + Enter lasterbidearekin errenkada bat txertatzea eta Tab teklarekin betetzea, saretaren menutik Word zutabearen arabera ordenatzea, eta ondoren ord bilatzea eta bilaketa Esc teklarekin hustea](/img/demo-dictionary-editing.webp)

Balioa zegoen bezala uzten duen edizio batek ez du ezer idazten, eta idatzitako edizio bat bere orriaren desegite-urrats bat da, zenbat idatzi duen kontuan hartu gabe.  
Ediziorik irekita ez dagoela, `Delete` edo `Backspace` teklak hautatutako gelaxka guztiak husten ditu, urrats bakar gisa.  
Edizio bat irekita dagoen bitartean, desegiteko eta berregiteko teklek gelaxkako zure idazketa desegiten eta berregiten dute, eta errenkaden teklek testu gisa idazten dute. Ikus [Fitxako teklak](#keys-on-the-tab).  
`Checks` orriko gelaxka guztiak, eta irakurtzeko soilik dagoen editore bateko gelaxka guztiak, irakurtzeko soilik dira eta ez dute ediziorik irekitzen.

Edizio, itsasketa edo garbiketa bateko errenkadaren bat ukatzen denean, haren ezer ez da gordetzen, eta errore-jakinarazpen batek zergatia azaltzen du, errenkadak zenbatuz eta lehen hirurak izendatuz:

- Orriko beste errenkada batek duen izen bat, edo itsasketa bereko beste errenkada batek idazten duena: `Nothing saved: 1 row shares a name with another row (Member)` edo `Nothing saved: 2 rows share a name with another row (…)`. Izenak muturretako zuriuneak kenduta eta maiuskulak eta minuskulak bereizita alderatzen dira; beraz, `Member` eta `member` desberdinak dira. Izen huts bat ez da inoiz ukatzen.
- `Domains` orriko domeinu batek ere ez duen testu gisa emandako termino baten `Domain` balioa: `Nothing saved: 1 row names an unknown domain (…)`.
- Zuk editatzen zenuen bitartean lankide batek kendutako errenkada bat: `Nothing saved: the row was removed`.

Idazketa bat bere gelaxkatik haratago irits daiteke:

- `Physical Name` eremua hutsik duela `Term` balio bat jasotzen duen termino batek haren hitzek osatzen duten izena jasotzen du, izen bat osatzen dutenean. Ikus [Hitzetatik](#from-the-words). Hori behin gertatzen da: izena ez da berriro osatzen geroago hitzak aldatzen direnean.
- Domeinu baten `Data Type` balio berriak domeinuari lotutako zutabe guztien mota aldatzen du, desegite-urrats berean. Ikus [Domeinuak eta datu motak](#domains-and-data-types).

### Termino baten domeinua {#a-terms-domain}

Termino baten `Domain` gelaxkan `Enter` edo `F2` sakatzeak, edo klik bikoitza egiteak, zerrenda bat irekitzen du gelaxkaren azpian, edo gainean leku gehiago dagoenean, `Domain` dioen bilaketa-eremu batekin.  
Zerrendak `None` aukera dauka, eta ondoren izena duen domeinu bakoitza, `Domains` orriaren ordenan; nabarmentzea terminoak lotzen duen domeinuan hasten da, edo `None` aukeran. Gelaxkan karaktere bat idazteak karaktere horrekin dagoeneko bilatutako zerrenda irekitzen du.

- Idazteak zerrenda izenean testua duten domeinuetara murrizten du, maiuskulak eta minuskulak bereizi gabe, `None` aukera kentzen du eta lehen bat-etortzea nabarmentzen du.
- `↑` eta `↓` teklek nabarmentzea mugitzen dute, eta bi muturretan beste muturrera igarotzen da.
- `Enter` edo `Tab` teklak nabarmendutako errenkada aukeratzen du, eta klik batek klik egindako errenkada, desegite-urrats bakar gisa. Terminoak aukeratutako domeinu zehatza lotzen du, izen bera duten bi domeinuetako bat izanda ere, eta `None` aukerak lotura kentzen dio.
- `Escape` teklak edo kanpoan klik egiteak zerrenda ixten du, idatzitako ezer gorde gabe.

`Domains` orrian izena duen domeinurik ez dagoenean, eremua zerrendarik gabe irekitzen da.  
Itsatsitako testuak izen hori duen zerrendako lehen domeinua lotzen du, testu hutsak lotura kentzen du, eta gelaxkak erakusten duenaren berdina den testuak lotura dagoen bezala mantentzen du. Beste edozein izen ukatu egiten da. Ikus [Gelaxkak editatzea](#editing-cells). Gelaxkan `Delete` edo `Backspace` sakatzeak terminoaren lotura kentzen du, kendutako domeinu batetik ere.

## Kopiatzea eta itsastea {#copying-and-pasting}

`Ctrl + C` (Windows/Linux) edo `⌘ + C` (Mac) lasterbideak hautapena tabulazioz bereizitako testu gisa kopiatzen du, errenkada bakoitzeko lerro bat, kalkulu-orriek idazten duten bezala; beraz, kalkulu-orri batean gelaxka gisa itsasten da. Balio baten barruko tabulazio bat edo lerro-jauzi bat zuriune bihurtzen da.  
Hainbat barruti batera kopiatzen dira soilik errenkada berberak hartzen dituztenean, bata bestearen ondoan, edo zutabe berberak, bata bestearen gainean. Bestela, ez da ezer kopiatzen, eta `Nothing copied: the ranges share no rows or columns` errore-jakinarazpena agertzen da.

`Ctrl + V` (Windows/Linux) edo `⌘ + V` (Mac) lasterbideak tabulazioz bereizitako testua itsasten du, adibidez kalkulu-orri batetik kopiatutako gelaxkak, gelaxka aktibotik behera eta eskuinera:

- Komatxoak testu gisa itsasten dira; beraz, lerro-jauzi bat duen kalkulu-orriko gelaxka bat ez da gelaxka bakar gisa itsasten.
- Balio bakar batek hautatutako barruti guztiak betetzen ditu.
- Azken errenkadaren ondoko errenkadak errenkada berri gisa gehitzen dira, ordenan; beraz, orri huts batean itsasteak bete egiten du.
- Azken zutabearen ondoko zutabeak kanpoan geratzen dira, eta gainerakoa gorde ondoren, `Columns past the last one weren't pasted` jakinarazpenak hala adierazten du.
- Hainbat gelaxkaren itsasketa batek, ondoren, idatzi duen blokea hautatzen du.

Itsasketa bat desegite-urrats bat da, gehitzen dituen errenkadak barne, eta osorik ukatzen da izen bikoiztu bat edo domeinu ezezagun bat dagoenean. Ikus [Gelaxkak editatzea](#editing-cells).  
Milioi bat gelaxka baino gehiagoko kopia, itsasketa edo garbiketa batek ez du ezer egiten, eta `Nothing done: the selection covers too many cells` errore-jakinarazpena agertzen da.  
Ebakitzeak, `Ctrl + X` (Windows/Linux) edo `⌘ + X` (Mac), ez du ezer egiten orri batean. Fitxa honetako kopiatzea eta itsastea ez dira inoiz diagramara iristen, eta gelaxka-edizio bat irekita dagoen bitartean gelaxkako testuan eragiten dute.

## Errenkadak gehitzea eta ezabatzea {#adding-and-deleting-rows}

`Add Row` botoiak errenkada huts bat gehitzen du orriaren amaieran. Bilaketa garbitzen du, errenkada berriaren lehen gelaxka hautatzen du eta teklatua saretari ematen dio; beraz, idazteak gelaxka hori betetzen du.  
`Delete Rows` botoiak hautapenak hartzen dituen errenkada guztiak kentzen ditu, edozein zutabetan, eta desegite batek guztiak beren lekuetara itzultzen ditu. Haren argibideak gauza bera egiten duen tekla izendatzen du.

Teklatua saretan dagoela eta gelaxkarik editatzen ari ez dela:

- `Alt + Enter` (Windows/Linux) edo `⌥ + Enter` (Mac) lasterbideak hautapenak hartzen dituen adina errenkada huts txertatzen ditu haren azpian.
- `Alt + Shift + Enter` (Windows/Linux) edo `⌥ + Shift + Enter` (Mac) lasterbideak gainean txertatzen ditu.
- `Alt + Backspace` edo `Alt + Delete` (Windows/Linux), edo `⌥ + Backspace` edo `⌥ + Delete` (Mac), lasterbideak hautapenak hartzen dituen errenkadak ezabatzen ditu.

Saretaren menuko errenkadak txertatzeko eta ezabatzeko aukerek egiten dutena egiten dute. Ikus [Saretaren menua](#the-grids-menu). Txertatze batek bilaketa garbitzen du eta errenkada berriak hautapenak hartzen duen lehen errenkadaren gainean jartzen ditu, edo azkenaren azpian. Lehen zutabean hautatzen ditu, haien artean lehena aktibo dagoela, eta desegite-urrats bat da.

Tekla hauek [Lasterbideak](./settings.md#shortcuts) fitxako `Add Column` eta `Remove Column` tekla-konbinazioak dira; beraz, [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) metodoarekin horiek berriro esleitzen dituen ostalari batek hauek ere aldatzen ditu. `Alt + Shift + Enter` lasterbidea `Add Column` komandoaren tekla da, `Shift` gehituta, eta ez du bere errenkadarik han.  
Irekitako edizio batean eta bilaketa-eremuan testu-teklak dira; beraz, Mac batean `⌥ + Backspace` lasterbideak hitz bat ezabatzen du. `Checks` orrian eta irakurtzeko soilik dagoen editore batean ez dute ezer egiten. Fitxa honetan ez dute inoiz taula baten zutaberik gehitzen edo kentzen.  
Obsidian aplikazioan fitxara iristen dira, Obsidianen lasterbide batek tekla bera erabiltzen duenean ere.

Inoiz bete ez den errenkada bat, edo balio guztiak hustu zaizkiona, bere orrian agertzen da eta lankideengana iristen da, baina fitxategiak kanpoan uzten du; beraz, desagertuta dago diagrama berriro irekitzean.

## Saretaren menua {#the-grids-menu}

Egin eskuineko klik `Domains`, `Words` edo `Terms` orriko gelaxka batean saretaren menua irekitzeko. Hautapenetik kanpoko gelaxka bat hautapen bihurtzen da lehenik.  
Azken errenkadaren azpian edo azken zutabearen eskuinean eskuineko klik egiteak dagoen hautapenaren gainean irekitzen du; beraz, orri huts batean goiburuen azpiko edozein lekutan irekitzen da. Menu-teklak edo `Shift + F10` lasterbideak gelaxka aktiborako irekitzen du.

- `Insert 1 row above`, `Insert 1 row below` eta `Delete 1 row`, bakoitza hautapenak hartzen dituen errenkadak zenbatuz, `Insert 3 rows above` adibidean bezala, eta bere tekla eskuinean duela. Ikus [Errenkadak gehitzea eta ezabatzea](#adding-and-deleting-rows).
- `Sort by <column>, ascending` eta `Sort by <column>, descending`, eskuineko klik egin duzun zutabea izendatuz, `Sort by Word, ascending` adibidean bezala. Ikus [Ordenatzea](#sorting). Ez dira agertzen azken zutabearen eskuinean.
- `Import CSV` eta `Export CSV`, barrako botoiek egiten dutena egiten dutenak. Ikus [CSV fitxategiak inportatzea eta esportatzea](#importing-and-exporting-csv).

Errenkadarik erakusten ez denean, orri huts batean edo ezerekin bat ez datorren bilaketa baten pean, `Insert 1 row below`, `Import CSV` eta `Export CSV` aukerak bakarrik agertzen dira.  
`Checks` orriak eta irakurtzeko soilik dagoen editore batek nabigatzailearen beraren menua irekitzen dute horren ordez, eta gauza bera egiten du goiburu batean edo korritze-barra batean eskuineko klik egiteak.  
Menua ixten da aukera bat egitean, `Escape` sakatzean, fitxako beste leku batean sakatzean, hautapena edo orria aldatzen denean, eta orriaren errenkadak aldatzen direnean, zure edizioz edo lankide batenaz.

## Ordenatzea {#sorting}

`Sort by <column>, ascending` eta `Sort by <column>, descending` aukerek orriaren errenkadak beraiek ordenatzen dituzte berriro, ez ikuspegia bakarrik. Ordena berria fitxategian gordetzen da, lankideek ikusten dute, eta `Export CSV` aukerak jarraitzen du; desegite batek ordena zaharra berrezartzen du.  
Errenkadak gelaxkak erakusten duen testuaren arabera alderatzen dira, termino baten `Domain` gelaxka domeinuaren izenaren arabera, bistaratze-hizkuntzaren ordena alfabetikoan, eta zenbakiak balioaren arabera alderatzen dira; beraz, `2` balioa `10` balioa baino lehen dator. Gelaxka hutsak azkenak dira bi noranzkoetan, eta berdin alderatzen diren errenkadek beren ordena mantentzen dute. Dagoeneko ordena horretan dagoen orri bat ordenatzeak ez du ezer erregistratzen.  
Bilaketa zegoen bezala geratzen da, eta hautapena ere bai; haren gelaxketan orain beste errenkada batzuk daude.

## CSV fitxategiak inportatzea eta esportatzea {#importing-and-exporting-csv}

`Domains`, `Words` eta `Terms` orrietako bakoitza CSV fitxategi batetik inportatzen da eta CSV fitxategi batera esportatzen da. Fitxategi hauek Hiztegia fitxarenak dira: oihalaren laster-menuko `Import` eta `Export` aukerek ez dituzte ez irakurtzen ez idazten. Ikus [Fitxategiak inportatzea edo esportatzea](./file-import-export.md).

### Inportatzea {#importing}

`Import CSV` aukerak, barran edo saretaren menuan, nabigatzailearen beraren fitxategi-hautatzailea irekitzen du `.csv` fitxategietarako, ez ostalariaren inportazio-elkarrizketa-koadroa. Fitxategi bera berriro aukeratzeak berriro inportatzen du.  
Fitxategia bere goiburuak izendatzen duen hiztegira doa, edozein orri erakusten dela ere, eta ondoren fitxak orri hori erakusten du eta teklatua haren saretari ematen dio. Orriak bere bilaketa, hautapena eta korritze-posizioa mantentzen ditu; beraz, bilaketak ezkutatzen dituen errenkadak, edo ikuspegiaren azpian gehitutako errenkadak, ikusezin geratzen dira.  
Fitxategia UTF-8 gisa irakurtzen da, byte-ordenaren markarekin edo gabe, edo EUC-KR gisa UTF-8 baliozkoa ez denean, datu publikoen estandarreko fitxategi zaharragoak bezala.

![Dictionary fitxa tresna-barratik irekitzea, eta ondoren domeinuak, hitzak eta terminoak Import CSV aukerarekin inportatzea, fitxategi bakoitzak fitxa bere orrira aldatzen duela eta gehitu duena jakinarazten duela](/img/demo-dictionary-import.webp)

Errenkadak nola iristen diren:

- Izena duen errenkada bakoitzak izen hori duen orriko errenkada eguneratzen du, fitxategiak zutabeak dituen eremuetan. Fitxategian ez dauden zutabeek eremu horiek dauden bezala uzten dituzte. Izenak muturretako zuriuneak kenduta eta maiuskulak eta minuskulak bereizita alderatzen dira.
- Orrian ez dauden izenak haren azken errenkadaren ondoren gehitzen dira, fitxategiaren ordenan.
- Inportazio batek ez du inoiz errenkadarik kentzen.
- Izen hutsa duen errenkada bat saltatu egiten da. Fitxategiak izen bat bi aldiz duenean, geroagoko errenkada nagusitzen da, eta lehenagokoa saltatutzat hartzen da. Lerro hutsak ez dira errenkadak.
- Termino baten domeinua bere izenaren bidez aurkitzen da, izen hori duen lehen domeinua, eta domeinu batek ere ez duen izen batek terminoa loturarik gabe uzten du; beraz, inportatu domeinuak lehenik.

Inportazio bat orri horren desegite-urrats bat da.  
Ondoren, jakinarazpenak, adibidez, `1 added · 1 updated · 2 skipped` dio. Orrikoaren berdina den errenkada bat ez da ez gehitutzat ez eguneratutzat hartzen; beraz, fitxategi bera berriro inportatzeak ez du ezer aldatzen eta ez du urratsik erregistratzen.  
Fitxategiko terminoek diagraman ez dauden domeinuak izendatzen dituzten bitartean, bigarren lerro batek lehen hirurak izendatzen ditu, `4 unknown domains: 연월일, 금액, 번호` adibidean bezala.  
Goiburua inongo egiturarekin bat ez datorren fitxategi batek, edo birekin bat datorrenak, ez du ezer inportatzen, eta `Couldn't read this file as words, terms or domains` errore-jakinarazpena agertzen da.

### Fitxategi-egiturak {#file-layouts}

Hiztegi bakoitzak bi egitura irakurtzen ditu. Lehena editorearena da, `Export CSV` aukerak idazten duena, eremuen izenak goiburu gisa dituela:

| Hiztegia | Goiburua | Fitxategiak behar duena |
| --- | --- | --- |
| Hitzak | `name,abbreviation,englishName,description,synonyms,forbiddenWords` | `name`, `abbreviation` |
| Terminoak | `name,physicalName,domain,description,synonyms` | `name`, `physicalName` |
| Domeinuak | `name,category,dataType,description` | `name`, `dataType` |

Zutabeak edozein ordenatan etor daitezke, termino baten `domain` zutabeak domeinuaren izena dauka, eta beste edozein zutabe ez da kontuan hartzen. Goiburuan maiuskulak eta minuskulak bereizten dira, eta gelaxkak idatzita dauden bezala irakurtzen dira, zuriuneak barne.

Bigarrena Koreako datu publikoen estandarraren (공통표준) fitxategien egitura da:

| Hiztegia | Fitxategiak behar duena | Hauek ere irakurtzen dira |
| --- | --- | --- |
| Hitzak | `공통표준단어명` | `공통표준단어영문약어명` (laburdura), `공통표준단어 영문명` (ingelesezko izena), `공통표준단어 설명` (deskribapena), `이음동의어 목록` (sinonimoak), `금칙어 목록` (hitz debekatuak) |
| Terminoak | `공통표준용어명` | `공통표준용어영문약어명` (izen fisikoa), `공통표준도메인명` (domeinua, izenaren arabera), `공통표준용어설명` (deskribapena), `용어 이음동의어 목록` (sinonimoak) |
| Domeinuak | `공통표준도메인명`, `데이터타입` | `공통표준도메인분류명` (kategoria), `공통표준도메인설명` (deskribapena), `데이터길이`, `데이터소수점길이` |

Domeinu baten `데이터타입`, `데이터길이` eta `데이터소수점길이` zutabeak datu mota bakar batean elkartzen dira: `NUMERIC(15,2)`, `CHAR(8)`, mota bakarrik luzerarik ez dagoenean, adibidez `DATE`, eta 0 eskala kanpoan utzita, `NUMERIC(15)` adibidean bezala.  
Fitxategi hauetan gelaxkei muturretako zuriuneak kentzen zaizkie, eta beste zutabeak, hala nola berrikuspen-historia, ez dira kontuan hartzen.  
Bi egituretan, goiburuko izen bateko zuriuneek ez dute garrantzirik.

### Esportatzea {#exporting}

`Export CSV` aukerak, barran edo saretaren menuan, erakutsitako orria editorearen beraren egituran gordetzen du: errenkada guztiak orriaren ordenan, bilaketak erakusten duena edozein dela ere, termino baten domeinua bere izenaz idatzita, edo hutsik kendutako domeinu baten kasuan.  
Fitxategia UTF-8 kodeketan dago, byte-ordenaren markarekin eta CRLF lerro-amaierekin, eta komatxo bat, koma bat edo lerro-jauzi bat duen eremua bakarrik jartzen da komatxo artean. Kalkulu-orri batean irekitzen da, eta berriro inportatuta errenkada berberak ematen ditu.  
`<database name>-<timestamp>-words.csv`, `-terms.csv` edo `-domains.csv` izena du, eta editorearen beste esportazioak bezala gordetzen da. Ikus [Esportatzea](./file-import-export.md#exporting).

`Checks` orriak ez du esportaziorik, eta irakurtzeko soilik dagoen editore batek ez du inportaziorik edo esportaziorik eskaintzen.

## Desegin eta berregin {#undo-and-redo}

`Domains`, `Words` eta `Terms` orrietako bakoitzak bere desegite-historia du, diagramarenaz bestelakoa. Fitxa honetan, `Ctrl + Z` eta `Ctrl + Shift + Z` (Windows/Linux) edo `⌘ + Z` eta `⌘ + Shift + Z` (Mac) lasterbideek, eta tresna-barrako `Undo` eta `Redo` botoiek, erakutsitako orrian eragiten dute, eta tresna-barrak ez du `Time Travel` botoirik erakusten. `Checks` orrian ez dute ezer egiten.  
ERD fitxako Desegin komandoak ez du inoiz orri bateko edizio bat desegiten. Ikus [Hiztegiaren orriak](./undo-redo.md#dictionary-sheets).

## Fitxako teklak {#keys-on-the-tab}

Teklatua fitxan dagoen bitartean, editorearen lasterbide hauek eragiten dute (ikus [Lasterbideak](./settings.md#shortcuts)):

- `Search` komandoak, `Ctrl + K` (Windows/Linux) edo `⌘ + K` (Mac), [Bilaketa azkarra](./quick-search.md) irekitzen du.
- `Toggle Explorer` komandoak, `Ctrl + F` (Windows/Linux) edo `⌘ + F` (Mac), ERD fitxara aldatzen du eta [Arakatzailea](./explorer.md#opening-and-closing) bere bilaketan irekitzen du.
- `Undo` eta `Redo` komandoek erakutsitako orrian eragiten dute. Ikus [Desegin eta berregin](#undo-and-redo).
- `Add Column` eta `Remove Column` komandoek errenkadak txertatzen eta ezabatzen dituzte. Ikus [Errenkadak gehitzea eta ezabatzea](#adding-and-deleting-rows).

Gelaxka-edizio bat irekita dagoen bitartean, termino baten domeinu-zerrenda barne, `Search` eta `Toggle Explorer` komandoek ez dute ezer egiten; beraz, idatzitako testua ez da galtzen.

Editorearen beste lasterbide guztiak fitxan geratzen dira eta ez dira inoiz oihalera iristen: `Alt + N` (Windows/Linux) edo `⌥ + N` (Mac) lasterbideak ez du taularik gehitzen, eta `Delete` eta `Backspace` teklek ez dute ezer ezabatzen oihalean.  
Horren ordez, saretaren beraren teklek orrian eragiten dute: `Enter` teklak gelaxka editatzen du, `Delete` eta `Backspace` teklek hautatutako gelaxkak garbitzen dituzte, `Ctrl + A` (Windows/Linux) edo `⌘ + A` (Mac) lasterbideak gelaxka guztiak hautatzen ditu, eta `Escape` teklak edizio bat bertan behera uzten du, saretaren menua ixten du edo bilaketa-eremua husten du. Kopiatzea, ebakitzea eta itsastea ere fitxan geratzen dira. Ikus [Kopiatzea eta itsastea](#copying-and-pasting).

## Irakurtzeko soilik dauden editoreak {#read-only-editors}

[`readonly`](../../api/erd-editor-element.md#readonly) atributua duen editore batean, fitxa ireki egiten da eta orri guztiak erakusten ditu.  
Orriz aldatzeak, bilatzeak, hautatzeak, korritzeak, zutabeen tamaina aldatzeak eta kopiatzeak ohi bezala funtzionatzen dute, baita `Checks` orritik egiaztapen batera `Enter` teklarekin edo klik bikoitzarekin joateak ere. Egiaztapenen markak ere agertzen dira.

Gelaxka batek ere ez du onartzen ediziorik, itsasketarik edo garbiketarik, eta egiaztapen batek markatzen ez duen gelaxka oro irakurtzeko soilik diren gelaxken atzealde grisaren gainean marrazten da.  
`Add Row`, `Delete Rows`, `Import CSV` eta `Export CSV` botoiak ezkutatuta daude, errenkaden teklek ez dute ezer egiten, eta eskuineko klik batek nabigatzailearen menua irekitzen du. Orri huts batek ez du laguntza-testurik erakusten, eta tresna-barrak ez ditu `Undo` eta `Redo` botoiak erakusten.

## Lankideak eta fitxategia {#collaborators-and-the-file}

Diagramaren fitxategiak hitzak, terminoak eta domeinuak beren orriaren ordenan gordetzen ditu, ordenatze batek ezarritakoa barne, eta baliorik ez duen errenkada kanpoan uzten du.  
Taula eta zutabe bakoitzaren izen logikoa ere gordetzen du, izen fisiko bakoitza hiztegiena den ala ez, eta zutabe bakoitzaren domeinu-lotura, domeinua zerrendatuta dagoen bitartean. Egiaztapenak eta markak horietatik kalkulatzen dira, eta ez dira inoiz gordetzen.

[Elkarlaneko saio](../../api/advanced/collaborative-editing.md) batean, editoreek elkarren hiztegi-edizioak ikusten dituzte iristen diren unean, ordenatzeak eta txertatzeak barne. Bakoitzak bere orria, bilaketa eta hautapena mantentzen ditu, eta haren orrien historiek bere edizioak bakarrik dituzte.  
Bitartean lankide batek kendutako errenkada baten gaineko edizio batek edo itsasketa batek ez du ezer gordetzen, eta `Nothing saved: the row was removed` jakinarazpena agertzen da.  
Hiztegia fitxa baino lehenagoko bertsio bateko editore batek diagrama haren izen logikoak, domeinu-loturak eta hiztegiak gabe gordetzen du. Ikus [Bertsioak nahastea](../../api/advanced/collaborative-editing.md#mixing-releases).

SQL eskema, GraphQL, DBML edo AML formatuko `Import` ekintza batek hiztegiak mantentzen ditu, JSON formatuko `Import` ekintza batek fitxategikoekin ordezten ditu, eta `Import and Add` ekintzak ez du bat ere ekartzen. Ikus [Kanpoko fitxategiak inportatzea](./file-import-export.md#importing-external-files).  
Kodetze-agente batek hitzak, terminoak eta domeinuak editatzen ditu, izen logikoak eta domeinuak ezartzen ditu, izen fisikoak berriro eratortzen ditu eta egiaztapenak zerrendatzen ditu MCP zerbitzariaren bidez. Ikus [Hiztegiak](../../mcp/tools.md#dictionaries) eta [Hiztegiaren egiaztapenak](../../mcp/tools.md#dictionary-checks). Ez du CSV fitxategietarako tresnarik.
