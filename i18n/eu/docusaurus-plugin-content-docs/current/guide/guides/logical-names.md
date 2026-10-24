---
sidebar_position: 4
description: Eman izen logikoak taulei eta zutabeei, erakutsi izen fisikoak, izen logikoak edo biak Izenen ikuspegiarekin, osatu termino-izenak idatzi ahala, lotu zutabeak domeinuei, eta ikusi beste non jarraitzen dioten izenek ikuspegiari.
---

# Izen logikoak

Taula batek eta haren zutabe bakoitzak izen logiko bat izan dezakete izenaren ondoan. Izen logikoa jendeak irakurtzen duena da, adibidez `Customer Name`, `CUST_NM` izenarentzat. Izena bera izen fisikoa da, [SQL eskemak](./schema-sql.md) eta [Kode-sortzaileak](./code-generator.md) idazten dutena.  
Izenen ikuspegiak erabakitzen du ERD oihalak bietako zein marrazten duen: izenak, izen logikoak edo biak. Ikus [Izenen ikuspegia](#name-view).  
Izen logiko batek bere taulari edo zutabeari izen fisiko bat ere eman diezaioke, [Hiztegia](./dictionary.md) fitxako hitzetatik eta terminoetatik eratorria. Ikus [Izen fisikoak eratortzea](./dictionary.md#deriving-physical-names).  
Zutabe bat domeinu bati lot daiteke, hau da, Hiztegia fitxako `Domains` orrian gordetako datu mota izendun bati (adibidez, `Name` izena `VARCHAR(100)` motarentzat), eta orduan domeinuaren datu mota du. Ikus [Domain gelaxka](#the-domain-cell).  
SQL eskemak izen logiko bakoitza iruzkin huts batean idatz dezake. Ikus [Izen logikoak iruzkin gisa](./schema-sql.md#logical-names-as-comments).

## Izenen ikuspegia {#name-view}

Hiru ikuspegi daude, eta bakoitzak bere erara marrazten ditu taula baten goiburua eta errenkadak:

- `Physical Names` ikuspegiak, diagrama berri baten ikuspegiak, ez du izen logikorik marrazten. Goiburuak taularen izena erakusten du eta, View Option → `Table Comment` aktibatuta dagoen bitartean, haren iruzkina; errenkada bakoitzak bere gelaxkak erakusten ditu [zutabeen ordenan](./settings.md#adjusting-column-order).
- `Logical Names` ikuspegiak izen logikoa marrazten du izen bakoitzaren lekuan: goiburuan, eta errenkada bakoitzean, zutabeen ordenan `Name` dagoen lekuan. Errenkada baten mota-gelaxkak zutabearen domeinua adieraz dezake, behean azaltzen den bezala.
- `Both Names` ikuspegiak izen logikoa marrazten du izenaren ondoan. Goiburuak izen logikoa erakusten du, ondoren izena eta ondoren iruzkina, eta errenkada bakoitzak `Logical Name` gelaxka bat hartzen du, zutabeen ordenak lehenespenez `Name` baino lehen jartzen duena.

Izen logiko huts batek, zuriunez soilik osatutakoak barne, ordezko lausotu bat erakusten du. `Logical Names` ikuspegian, haren lekuan marrazten den izena da, edo `table` edo `column` leku-marka, izena ere hutsik dagoenean. `Both Names` ikuspegian, `logical` leku-marka da.

`Logical Names` ikuspegian, Hiztegia fitxako `Domains` orrian izena duen domeinu bati lotutako zutabe batek domeinu horren izena erakusten du bere mota-gelaxkan, bere datu motaren ordez. Gainerako zutabe guztiek beren datu mota erakusten dute bertan.  
View Option → `Domain` aktibatuta dagoen bitartean, domeinuak bere gelaxka du eta mota-gelaxkak datu mota mantentzen du; beraz, errenkada batek ere ez du domeinua bi aldiz erakusten. Ikus [Domain gelaxka](#the-domain-cell).

Taula bakoitza ikuspegian marrazten dituen gelaxkak bezain zabala da; beraz, ikuspegi-aldaketa batek taulen tamaina aldatzen du eta haien konektoreak berriro antolatzen ditu. Taula bat ere ez da mugitzen.  
`70%` edo gutxiagoko zoomean, taula bat bere izenera murrizten da. Ikus [Handiagotu/txikiagotu](./table-related-functions.md#zoom-inout). `Logical Names` ikuspegian, izen logikoa erakusten du, edo izena lausotuta, izen logikorik ez dagoen bitartean. `Both Names` ikuspegian, izen logikoa erakusten du, izena azpiko lerro batean duela, edo izena bakarrik, izen logikorik ez dagoen bitartean.

Hiztegiaren egiaztapenek izen logiko bat edo izen bat gorriz edo anbarrez idatz dezakete, seinalatzen duten lekuan. Ikus [Oihaleko markak](./dictionary.md#marks-on-the-canvas).

## Ikuspegia aldatzea {#switching-the-view}

Lau lekutan alda daiteke ikuspegia, eta bakoitzak `Physical Names`, `Logical Names` eta `Both Names` zerrendatzen ditu, indarrean dagoen ikuspegia markatuta duela:

- [Oihaleko tresna-barrako](./table-related-functions.md#canvas-toolbar) `Name View` botoia, erlazioen lau notazioen eta zen moduaren artean. Indarrean dagoen ikuspegiaren izena erakusten du, beherako gezi batekin, eta haren argibideak `Name View` dio. Klik batek zerrenda irekitzen du tresna-barraren gainean, eta aukera bat hautatzeak ixten du.
- Oihalaren laster-menuko `Name View` aukera, `View Option` aukeraren ondoren bertan: hiru ikuspegien azpimenu bat. Menua irekita geratzen da aukera bat hautatu ondoren.
- Zerrenda bera Bisualizazioa fitxako tresna-barran, `Flow` moduan, errenkaden bistaratzearen menuaren ondoren. Ikus [Tresna-barra](./visualization.md#toolbar).
- [Bilaketa azkarreko](./quick-search.md#what-the-palette-lists) `Name View` komandoa, `Tab` komandoaren ondoren bertan, ERD fitxan soilik zerrendatua. Haren azpimenua indarrean dagoen ikuspegia nabarmenduta dagoela irekitzen da.

![Izenen ikuspegia Logical Names ikuspegira aldatzea oihaleko tresna-barratik, Both Names ikuspegira oihalaren menutik, eta berriro Physical Names ikuspegira; izen logikorik ez duen ordered_at lausotuta agertzen da, eta ondoren logical leku-marka gisa](/img/demo-name-view.webp)

Laurek ikuspegi bera ezartzen dute. Goiko tresna-barrak ez du horretarako botoirik.

Ikuspegi-aldaketa batek hautapena mantentzen du, eta ez da [desegite-historian](./undo-redo.md#what-the-history-records) erregistratzen.  
Fokuratutako gelaxka bat ikuspegi berriak marrazten ez badu, fokua haren lekuan marrazten den gelaxkara mugitzen da: izenak eta izen logikoak elkar ordezkatzen dute, motak eta domeinuak bezala. Gelaxka horretan irekita dagoen gelaxka-editorea itxi egiten da. View Option → `Domain` aktibatzeak edo desaktibatzeak fokua modu berean mugitzen du.  
`Name View` blokeoa aktibatuta dagoen bitartean, diagrama berri batean dagoen bezala, ikuspegi-aldaketa batek zure pantaila bakarrik aldatzen du, eta fitxategiak blokeatu zenean zuen ikuspegia mantentzen du. Blokeoa desaktibatuta, fitxategiak aldatzen duzun ikuspegia gordetzen du. Ikus [Blokeoa](./settings.md#lock).

## Izen logiko bat idaztea {#writing-a-logical-name}

`Physical Names` ikuspegiak ez du izen logikorik marrazten; beraz, oihalean bat idazteko, aldatu `Logical Names` edo `Both Names` ikuspegira:

- `Logical Names` ikuspegian, goiburuko eta errenkadetako izen-gelaxkek izen logikoak dituzte; beraz, ikuspegi honetan ezin da izen fisikorik editatu oihalean.
- `Both Names` ikuspegian, izen logikoaren gelaxkek izen logikoak dituzte, eta izen-gelaxkek izen fisikoak.

Izen logikoaren gelaxka bat beste edozein gelaxka bezala editatzen da: hasi `Enter` teklarekin edo klik bikoitz batekin. Ikus [Taulak editatzea](./table-editing.md). Izen logiko huts batean irekitzen denean, editoreak gelaxkak marrazten zuena erakusten du leku-marka gisa: izena `Logical Names` ikuspegian, eta `logical` `Both Names` ikuspegian.  
Idatzitakoa izen logikoan bakarrik idazten da. Izen fisikoa hartatik eratortzen da editorea izen logiko aldatu batekin ixten denean (`Enter`, `Tab`, `Escape` edo beste leku batean klik eginez), zure idazketaren ondoren, bere desegite-urrats gisa. Zuk idatzitako izen fisiko bat dagoen bezala uzten da. Ikus [Izen fisikoak eratortzea](./dictionary.md#deriving-physical-names).

`Tab` eta `Shift + Tab` teklek ikuspegiak marrazten dituen gelaxkak zeharkatzen dituzte, haien ordenan (ikus [Tab tekla](./table-editing.md#tab-key)):

- `Logical Names` ikuspegian, goiburuko izen logikoa, ondoren haren iruzkina, eta ondoren errenkada bakoitzaren gelaxkak zutabeen ordenan, izen logikoa izenaren lekuan duela.
- `Both Names` ikuspegian, goiburuko izen logikoa, izena eta iruzkina, eta ondoren errenkada bakoitzaren gelaxkak zutabeen ordenan, lehenespenez haren `Logical Name` gelaxka lehenengo dela.

`Alt + Enter` (Windows/Linux) edo `⌥ + Enter` (Mac) lasterbideak zutabe bat gehitzen du eta haren izen-gelaxka fokuratzen du, `Logical Names` ikuspegian haren izen logikoa dena.

Erlazio batek gehitzen duen gako arrotzeko zutabe batek bere gakoaren izen logikoa eta domeinua kopiatzen ditu, motarekin batera. Ikus [Erlazio identifikatzaileak](./relationship-editing.md#identifying-relationships).  
Zutabeak kalkulu-orri batera kopiatzeak eta kalkulu-orri batetik zutabeak itsasteak ikuspegiak marrazten dituen gelaxkak erabiltzen dituzte, izen logikoaren gelaxkak eta Domain gelaxkak barne. Ikus [Zutabeak kopiatzea/itsastea](./table-editing.md#copyingpasting-columns).

## Termino-izenak osatzea {#completing-term-names}

Izen logikoaren gelaxka batean idazten duzun bitartean, goiburukoan edo errenkada batekoan, gelaxkaren azpiko zerrenda batek testu horrekin hasten diren izenak dituzten terminoak eskaintzen ditu, maiuskulak eta minuskulak eta testuaren aurreko zuriuneak kontuan hartu gabe. Terminoa Hiztegia fitxako `Terms` orrian gordetako izen logiko oso bat da, ematen dituen izen fisikoarekin eta domeinuarekin. Zerrendak gehienez zortzi erakusten ditu, izenaren arabera ordenatuta, idatzitako testua nabarmenduta. Ez dago zerrendarik termino bat ere horrela hasten ez den bitartean.

![Both Names ikuspegian ⌥ + Enter lasterbidearekin zutabe bat gehitzea, haren izen logikoaren azpiko terminoen zerrendatik Order Amount hautatzea ORD_AMT, DECIMAL(10,2) eta Amount domeinua betetzeko, eta ondoren Order Date idaztea; haren ORD_DT izena hitzek ematen dute Enter teklak editorea ixten duenean](/img/demo-logical-names.webp)

- Hasieran ez dago ezer nabarmenduta. `↑` eta `↓` teklek nabarmentzea mugitzen dute, eta muturretako batera iristean beste muturretik jarraitzen du; nabarmendutako terminoak `Enter` tekla erakusten du.
- Nabarmendutako termino batean `Enter` sakatzeak haren izena izen logiko gisa idazten du eta edizioa amaitzen du. Izen fisikoa zuk idatzitakoa ez bada, desegite-urrats berak berehala eratortzen du izen fisikoa terminotik, eta zutabe bati terminoaren domeinua ere ematen dio. Ezer nabarmenduta ez dagoela `Enter` sakatzeak edizioa amaitzen du eta idatzi duzuna mantentzen du.
- Termino batean klik egiteak modu berean idazten du, eta editorea irekita uzten du.
- Zerrenda ikusgai dagoen bitartean, `Escape` teklak zerrenda bakarrik ixten du, eta hurrengo `Escape` sakatzeak edizioa amaitzen du.
- `Tab` teklak aurrera egiten du testua idatzi den bezala utzita, eta izen fisikoa hartatik eratortzen da editorea ixten denean.
- Idazketa-metodo bat konposatzen ari den bitartean, gezi-teklak eta `Enter` konposizioari dagozkio.

Termino batek taula bati edo zutabe bati zer ematen dion [Izen fisikoak eratortzea](./dictionary.md#deriving-physical-names) atalean azaltzen da.

## Domain gelaxka {#the-domain-cell}

View Option → `Domain` aukerak, lehenespenez desaktibatuta dagoenak, Domain gelaxka bat ematen dio errenkada bakoitzari ikuspegi guztietan, zutabeen ordenan `Domain` dagoen lekuan, lehenespenez `DataType` ondoren bertan. Ikus [Taulen ikuspegi-aukerak](./table-related-functions.md#table-view-options).  
Gelaxkak zutabea lotuta dagoen domeinuaren izena erakusten du, edo `domain` leku-marka lausotua, `Domains` orriak zerrendatzen duen domeinu bati ere lotuta ez dagoen zutabe batean.

![View Option → Domain aktibatzea, PAY_AMT zutabearen Domain gelaxkan Amount hautatzea zerrenda amo testuarekin murriztu ondoren, Dictionary fitxan Amount domeinuaren Data Type DECIMAL(12,2) bihurtzea eta zutabea harekin batera aldatu dela ikustea, eta ondoren zutabean NUMERIC(12,2) idaztea, eta horrek lotura kentzen dio](/img/demo-domains.webp)

`Enter` teklak edo klik bikoitz batek hautatzaile bat irekitzen du gelaxkaren gainean: eremu huts bat, gelaxkaren testua leku-marka gisa duela, eta haren azpian `None` aukera, eta ondoren `Domains` orriko izena duen domeinu guztiak, orriaren ordenan. Nabarmentzea lotutako domeinuan hasten da, edo `None` aukeran.

- Idazteak izenean testua duten domeinuak bakarrik zerrendatzen ditu, maiuskulak eta minuskulak bereizi gabe, `None` aukera kentzen du eta lehena nabarmentzen du. `↑` eta `↓` teklek nabarmentzea mugitzen dute.
- `Enter` teklak nabarmendutako domeinua lotzen du, eta klik batek klik egindakoa. Bietako edozeinek domeinuaren datu mota ematen dio zutabeari, desegite-urrats bakar gisa, eta edizioa amaitzen du. `None` aukerak zutabearen lotura kentzen du eta haren datu mota mantentzen du.
- Idazten duzuna ez da inoiz zutabean idazten. `Domains` orrian izena duen domeinurik ez dagoen bitartean, ez dago zerrendarik, eta `Enter` teklak edizioa amaitzen du ezer idatzi gabe.

`Logical Names` ikuspegian, View Option → `Domain` desaktibatuta dagoela, domeinu baten izena erakusten duen mota-gelaxka batek hautatzaile hau irekitzen du, eta datu mota bat erakusten duenak datu motaren editorea. Ikus [Datu motaren osatze automatikoa](./table-editing.md#datatype-autocomplete). Domeinurik ez duen zutabe bati domeinu bat lotzeko, aktibatu Domain gelaxka.  
Lotutako zutabe batek bere domeinuaren datu mota du eta hari jarraitzen dio domeinuaren mota aldatzen denean; haren DataType gelaxkan beste mota bat idazteak lotura kentzen dio. Ikus [Domeinuak eta datu motak](./dictionary.md#domains-and-data-types).

## Oihaletik kanpo {#beyond-the-canvas}

Taula edo zutabe bat izendatzen duten beste leku gehienek ere Izenen ikuspegiari jarraitzen diote:

- `Physical Names` ikuspegiak izena erakusten du.
- `Logical Names` ikuspegiak izen logikoa erakusten du, edo izena, lekuak lausotu dezakeen tokian lausotuta, izen logikoa hutsik dagoen bitartean.
- `Both Names` ikuspegiak izen logikoa erakusten du, izena haren ondoren duela: testu-errenkada batean lausotuta, Grafoaren etiketa batean bigarren lerro batean, eta parentesi artean testu bakar batek biak hartu behar dituen lekuan, adibidez `Member (member)`. Izen logikorik gabeko taula edo zutabe batek bere izena bakarrik erakusten du.

Izenaren arabera ordenatutako zerrenda bat, adibidez Arakatzaileko taulak edo Bilaketa azkarreko `#` errenkadak, izenaren arabera ordenatuta geratzen da ikuspegi guztietan, inoiz ez izen logikoaren arabera.

Ikuspegiari jarraitzen dioten lekuak:

- Bisualizazioa fitxan, Fluxuaren txartelak (ikus [Txarteletako izenak](./visualization.md#names-on-the-cards)) eta Grafoaren etiketak eta gainetik pasatzean agertzen den aurrebista (ikus [Grafoa irakurtzea](./visualization.md#reading-the-graph) eta [Aurrebista gainetik pasatzean](./visualization.md#hover-preview)).
- [Taularen propietateak](./table-related-functions.md#table-properties): haren etiketak, eta `Indexes` fitxan `Columns` errenkadak eta `Index order` zerrenda. Ikus [Indizeak](./table-related-functions.md#indexes).
- [Arakatzaileko](./explorer.md#the-tree) taulen eta zutabeen errenkadak, eta taula-talde bakoitzaren azpian zerrendatutako taulak.
- Bilaketa azkarreko `#` errenkadak. Ikus [Diagraman bilatzea](./quick-search.md#searching-the-diagram).
- [Diferentzia-ikustailearen](./table-related-functions.md#diff-viewer) aldaketen zuhaitza eta haren bi aldeak.
- [Mapatu zutabeak](./relationship-editing.md#map-columns), eta erlazio bat marrazten den bitartean `Create new columns` aukerak erakuts dezakeen `<parent> has no primary key to copy` argibidea. Ikus [Erlazioak sortzea](./editing-start.md#relationship-creation).
- Zutabe-arrastatze batek oihal hutsaren gainetik eramaten duen errenkaden kopia, errenkada bakoitzaren izen- eta mota-gelaxkak errenkadak marrazten dituen bezala erakusten dituena. Ikus [Zutabeak berrantolatzea eta mugitzea](./table-editing.md#rearranging-and-moving-columns).
- Hiztegia fitxako `Checks` orriaren `Target` zutabea. Ikus [Egiaztapenak orria](./dictionary.md#the-checks-sheet).
- [Esportatutako irudi](./file-import-export.md#image) bat.

Leku gutxi batzuek izenak mantentzen dituzte ikuspegia edozein dela ere: Arakatzaileko indizeen eta gako arrotzen errenkadak, Taularen propietateetako `Indexes` fitxako `Keys` multzoa, Mapatu zutabeak elkarrizketa-koadroko `New column: <name>` aukera, eta Bilaketa azkarreko `@` edo `:` errenkada baten ondoan idatzitako kokapena.

Diferentzia-ikustailea, [Denbora-bidaia](./undo-redo.md#time-travel), [Antolaketa automatikoaren](./table-related-functions.md#auto-layout) `Force` aurrebista eta `Export image` elkarrizketa-koadroa ikusten ari zaren Izenen ikuspegian irekitzen dira, fitxategiak gordetzen duen ikuspegia edozein dela ere. Bakoitzak ikuspegi hori mantentzen du irekita dagoen bitartean.  
Antolaketa automatiko bakoitzak, baita SQL eskema, GraphQL, DBML edo AML formatuko `Import` edo `Import and Add` ekintza batek ere, taulak zure ikuspegian hartzen dituzten zabaleretan kokatzen ditu.

## Izen logikoaren arabera bilatzea {#finding-by-logical-name}

Izen logikoak Izenen ikuspegi guztietan aurkitzen dira, `Physical Names` barne, nahiz eta bertan oihalak ez duen bat ere marrazten:

- [Bilatu eta ordeztu](./find-and-replace.md#what-it-searches) funtzioak testu mota bakar gisa bilatzen ditu, `Logical names`, tauletan zein zutabeetan, eta mota hori aktibatuta dago bilaketa lehen aldiz irekitzen denean. Izen logiko bat ordezteak izen fisikoa eratortzen du hartatik, bat idazteak bezala.
- [Bilaketa azkarrean](./quick-search.md#searching-the-diagram), `#` aurrizkiak taula bat aurkitzen du haren izenaren edo izen logikoaren arabera, eta `@` aurrizkiak zutabe bat aurkitzen du bietako edozeinen arabera; izen logikoko bat-etortze batek `Logical name` etiketa erakusten du ondoan. `@` aurrizkiaren taula-zatia, `.` ikurraren aurrekoa, taula baten izenarekin edo izen logikoarekin ere bat dator.

Izenen ikuspegia aldatzeak emaitzak nola izendatzen diren aldatzen du, inoiz ez zer aurkitzen den.

## Lankideak {#collaborators}

[Elkarlaneko saio](../../api/advanced/collaborative-editing.md) batean, izen logikoak eta domeinu-loturak editore guztietara iristen dira, beste edozein edizio bezala.  
`Name View` blokeoa aktibatuta dagoen bitartean, editore bakoitzak bere ikuspegia mantentzen du, eta ikuspegi-aldaketa bat egin duen editorean bakarrik ikusten da. Desaktibatuta dagoen bitartean, irakurtzeko soilik ez dagoen edozein editoretan egindako ikuspegi-aldaketak editore guztien ikuspegia aldatzen du. Ikus [Blokeoa](./settings.md#lock); atal horrek azaltzen du, halaber, blokeoa aktibatzeak edo desaktibatzeak zer eragiten dion editore bakoitzaren ikuspegiari.  
Parte-hartzaile batek fokuratutako gelaxka zure ikuspegiak marrazten ez duen bat denean, haren kolorea zure ikuspegiak haren lekuan marrazten duen gelaxkan agertzen da: `Physical Names` ikuspegiko izen-gelaxka bat zure izen logikoaren gelaxkan agertzen da `Logical Names` ikuspegian, eta alderantziz, eta mota-gelaxka bat eta haren lekuan dagoen domeinua modu berean parekatzen dira.

MCP zerbitzariaren bidez lan egiten duen kodetze-agente batek izen logikoak ezartzen ditu eta domeinuak lotzen ditu, ikusten ari zaren ikuspegia edozein dela ere, eta ez du Izenen ikuspegia aldatzen duen tresnarik. Ikus [Hiztegiak](../../mcp/tools.md#dictionaries) eta [Ezarpenak](../../mcp/tools.md#settings).

## Irakurtzeko soilik dauden editoreak {#read-only-editors}

[`readonly`](../../api/erd-editor-element.md#readonly) atributua duen editore batean, Izenen ikuspegiaren hautatzaile guztiek funtzionatzen dute, eta ikuspegi-aldaketa batek pantaila hori bakarrik aldatzen du, blokeoa edozein dela ere.  
Bertan ezin dira izen logikoak eta domeinuak editatu; beraz, ez da terminoen zerrendarik ez domeinu-hautatzailerik irekitzen, eta ez da eskaintzen `Derive Physical Name Again` eta `Derive Physical Names Again` aukeretako bat ere. View Option → `Domain` aukerak ez du ezer aldatzen bertan, beste ezein [ikuspegi-aukerak](./table-related-functions.md#table-view-options) aldatzen ez duen bezala.
