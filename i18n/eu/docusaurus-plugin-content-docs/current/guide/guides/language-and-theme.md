---
sidebar_position: 15
description: Editorearen 25 bistaratze-hizkuntzak, eskuinetik ezkerrerako antolaketa, gai-sortzailearen System, Light eta Dark itxurak eta haren koloreak, eta ostalari bakoitzak non gordetzen dituen.
---

# Hizkuntza eta gaia

Editorearen beraren testua 25 hizkuntzatan dago, eta haren estiloa gai bat da: itxura bat (`System`, `Light` edo `Dark`), gris-tonu bat eta nabarmentze-kolore bat.  
Biak editorea erabiltzen duen pertsonarenak dira, ez diagramarenak. Bietako bat ere ez da fitxategian gordetzen, ez da [desegite-historian](./undo-redo.md) erregistratzen eta ez da lankideekin partekatzen; beraz, pertsona bakoitzak bereak ikusten ditu, eta bietako edozein aldatzeak ez du inoiz fitxategia aldatutzat markatzen.

Bietako bat ere ez dago [Ezarpenak](./settings.md) fitxan. Tresna-barrak `Theme` botoi bat du eta, haren ondoren berehala, `Display Language` botoi bat; biak [`Explorer`](./explorer.md) botoiaren ondoren daude. [Bilaketa azkarrak](./quick-search.md) `Theme` eta `Display Language` aukerak zerrendatzen ditu fitxa guztietan.  
Web aplikazioak, Google Drive zerbitzuak, VS Code editoreak, JetBrains IDEek eta Obsidian aplikazioak biak eskaintzen dituzte, eta aukeratzen duzuna gogoratzen dute. Ikus [Ostalari bakoitzean](#in-each-host). Biek irakurtzeko soilik dagoen editore batean ere funtzionatzen dute.

## Bistaratze-hizkuntza {#display-language}

Hizkuntzak editorearen beraren testua hartzen du barne: tresna-barrako argibideak, laster-menuak, Bilaketa azkarra, panelak eta elkarrizketa-koadroak, Ezarpenak fitxa, [ongietorri-pantaila](./editing-start.md#welcome-screen), jakinarazpenak eta mezuak, eta izen, datu mota, balio lehenetsi edo iruzkin huts batek oihalean eta esportatutako irudi batean erakusten duen leku-marka.  
Hauek idatzita dauden bezala uzten ditu hizkuntza guztietan: zure taulen eta zutabeen izenak, iruzkinak eta oharrak; datu-base hornitzaileak, Kode-sortzailearen lengoaiak eta fitxategi-formatuak; datu motak, SQL gako-hitzak eta `ON DELETE` eta `ON UPDATE` ekintzak; SQL eskemaren `Create`, `If not exists`, `Drop & re-create`, `USE` eta `CREATE + USE` aukerak; `PK`, `FK`, `UQ`, `AI`, `NN`, `N-N`, `NULL` eta `AK1.1` markak; [Diferentzia-ikustailearen](./table-related-functions.md#diff-viewer) `A`, `M`, `D`, `R` eta `~` egoera-letrak; izenen idazkeraren eta `Bracket` ezarpenaren aukerak, `None` izan ezik; teklatuko teklen izenak; gai-sortzailearen koloreen izenak; sortutako SQLa eta kodea; eta esportatutako fitxategien izenak.

Hizkuntzak, hautatzaileak zerrendatzen dituen ordenan:

| Hautatzailean | Hizkuntza | Kodea |
| --- | --- | --- |
| Bahasa Indonesia | Indonesiera | `id-ID` |
| Deutsch | Alemana | `de-DE` |
| English | Ingelesa | `en` |
| Español | Gaztelania | `es-ES` |
| Euskara | Euskara | `eu-ES` |
| Français | Frantsesa | `fr-FR` |
| Italiano | Italiera | `it-IT` |
| Nederlands | Nederlandera | `nl-NL` |
| Polski | Poloniera | `pl-PL` |
| Português | Portugesa | `pt-PT` |
| Português Brasileiro | Brasilgo portugesa | `pt-BR` |
| Română | Errumaniera | `ro-RO` |
| Slovenčina | Eslovakiera | `sk-SK` |
| Slovenščina | Esloveniera | `sl-SI` |
| Svenska | Suediera | `sv-SE` |
| Türkçe | Turkiera | `tr-TR` |
| Русский | Errusiera | `ru-RU` |
| Українська | Ukrainera | `uk-UA` |
| עברית | Hebreera | `he-IL` |
| العربية | Arabiera | `ar-SA` |
| فارسی | Persiera | `fa-IR` |
| 日本語 | Japoniera | `ja-JP` |
| 简体中文 | Txinera sinplifikatua | `zh-CN` |
| 繁體中文 | Txinera tradizionala | `zh-TW` |
| 한국어 | Koreera | `ko-KR` |

Bilaketa azkarrak Kode-sortzailea fitxan eskaintzen duen `Language` aukera eta Ezarpenak fitxako [Blokeoa](./settings.md#lock) zerrendako `Language` errenkada [Kode-sortzailearen helburu-lengoaia](./code-generator.md#language) dira, ez bistaratze-hizkuntza.

### Hizkuntza bat aukeratzea {#picking-a-language}

`Display Language` botoiak (hizkuntzen ikono bat) `Display Language` hautatzailea irekitzen du: `Display Language` izenburua duen panel bat, tresna-barraren azpian, irekita dagoen fitxaren gainean.  
`System` aukera lehena da, une honetan adierazten duen hizkuntza ondoan duela, eta ikusgai geratzen da zerrenda korritzen den bitartean. Ondoren 25 hizkuntzak datoz, bakoitza bere hizkuntzako izenarekin, eta marka batek indarrean dagoen aukera adierazten du.

![Bistaratze-hizkuntza tresna-barratik 한국어 hizkuntzara aldatzea, gero العربية hizkuntzara, tresna-barra ispilatzen duena baina ez diagrama, eta azkenik System aukerara itzultzea](/img/demo-display-language.webp)

Panela irekitzean, teklatuaren fokua markatutako errenkadan dago:

- `↑` eta `↓` teklek errenkadetan zehar mugitzen dute fokua, eta muturrera iristean beste muturretik jarraitzen dute; `Home` eta `End` teklek lehenengo errenkadara eta azkenera jauzi egiten dute.
- `Enter` edo `Space` teklak fokuratutako errenkada aukeratzen du, klik batek bezala.

Aukeraketa batek berehala du eragina, panela ixten du eta teklatua editoreari itzultzen dio.

Itxi ezer aukeratu gabe `Escape` teklarekin, izenburuaren ondoko `x` botoiarekin (haren argibideak `Close (ESC)` dio), editorean panelaz kanpoko edozein lekutan egindako sakatze batekin, tresna-barran izan ezik, edo berriro `Display Language` botoiarekin.  
Irekitzeak gai-sortzailea eta Taularen propietateak ixten ditu. Irekita dagoen [Arakatzailea](./explorer.md#dialogs-beside-it) irekita geratzen da, eta ezkerretik eskuinera idazten den hizkuntza batean hautatzailea haren ondoan bertan kokatzen da, haren gainean egon beharrean.  
Bilaketa azkarra edo gai-sortzailea irekitzeak ixten du, baita `Ctrl + F` (Windows/Linux) edo `⌘ + F` (Mac) lasterbideak ere. Lasterbide horrek [Arakatzailea](./explorer.md#opening-and-closing) haren bilaketa aktibatuta irekitzen du, edo, Arakatzailea dagoeneko irekita badago, irekita mantentzen du eta teklatua haren Bilatu eremura eramaten du. Tresna-barrako `Explorer` botoiak hautatzailea irekita uzten du.

Panelak teklatua duen bitartean, editorearen lasterbide batzuek funtzionatzen jarraitzen dute: `Search`, `Toggle Explorer`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` eta `Zoom Reset`. Ikus [Lasterbideak](./settings.md#shortcuts). Editorearen beste lasterbide guztiak, gezi-teklak eta `Tab` tekla ez dira panelaz haratago iristen; beraz, editoreak ez du haiei erantzuten. Editoreak esleitzen ez dituen teklak, adibidez ostalariaren beraren gordetzeko tekla, ohi bezala iristen zaizkio ostalariari.

[Bilaketa azkarrean](./quick-search.md), `Display Language` aukerak `System` aukera eta 25 hizkuntzak zerrendatzen ditu, indarrean dagoen aukera markatuta. Hizkuntza bat bere ingelesezko izenaren edo bere kodearen bidez ere aurki daiteke bertan; beraz, `german` edo `de-DE` bilatuta `Deutsch` aurkitzen da.

### Sistema aukerak zeri jarraitzen dion {#what-system-follows}

Web aplikazioan, Google Drive zerbitzuan, VS Code editorean, JetBrains IDEetan eta Obsidian aplikazioan, hizkuntza `System` aukeran hasten da. `System` aukerak ostalariaren hizkuntzari jarraitzen dio:

- Web aplikazioan, Google Drive zerbitzuan eta zure orrian: nabigatzailearen hizkuntza hobetsiak. Haietan egindako aldaketak berehala hartzen dira kontuan.
- VS Code editorean: VS Coderen bistaratze-hizkuntza.
- JetBrains IDE batean: IDEak bere interfazea erakusteko erabiltzen duen hizkuntza.
- Obsidian aplikazioan: Obsidianen hizkuntza.

`System` aukerak hizkuntza horietatik editoreak duen lehena hartzen du, edo ingelesa, horietako bat ere ez badu.  
Eskualde-aldaera bat dagokion hizkuntzatzat hartzen da; beraz, `de-AT` kodeak Deutsch ematen du, eta `fr-CA` kodeak Français. Txinera idazkeraren arabera ebazten da: idazkera tradizional batek 繁體中文 ematen du, eta beste edozein idazkerak 简体中文. Idazkerarik adierazten ez bada, Taiwan, Hong Kong edo Macau eskualdeek 繁體中文 ematen dute, eta beste edozein txinerak 简体中文. Portugesak Português Brasileiro ematen du, Brasil ez den eskualde bat adierazten ez bada; beraz, `pt-PT` kodeak Português ematen du; Obsidianen portugesak ere Português ematen du.

### Eskuinetik ezkerrera idazten diren hizkuntzak {#right-to-left-languages}

עברית (hebreera), العربية (arabiera) eta فارسی (persiera) hizkuntzek editorea eskuinetik ezkerrera antolatzen dute: tresna-barra, menuak, panelak eta elkarrizketa-koadroak, Bilaketa azkarra eta Ezarpenak fitxa ispilatuta agertzen dira. Laster-menu baten azpimenuak ezkerrera irekitzen dira, eta tresna-barrako Undo eta Redo ikonoak trukatu egiten dira, Undo ikonoak eskuinetik ezkerrera irakurtzen duenarentzat atzerantz seinala dezan.

Diagrama bera ez da inoiz ispilatzen. Oihala, bere taula, zutabe, erlazio eta oharrekin, ezkerretik eskuinera geratzen da, baita minimapa, korritze-barrak, [oihaleko tresna-barra](./table-related-functions.md#canvas-toolbar), [Bisualizazioa](./visualization.md) eta haren tresna-barra, datu moten gelaxkak, SQL eskema eta Kode-sortzailea fitxetako kodea, kolore-hautatzailea, Diferentzia-ikustailearen bi aldeak, Denbora-bidaia eta Antolaketa automatikoaren aurrebista ere.  
[Arakatzailea](./explorer.md#beside-the-canvas) oihalaren ezkerrean geratzen da, eta Diferentzia-ikustailearen aldaketen zuhaitza ikustailearen ezkerrean, bakoitza bere arrastatzeko ertza eskuinean duela. Barruan, biak eskuinetik ezkerrera irakurtzen dira: haien eremuak eta errenkadak ispilatuta daude, errenkadak eskuinetik koskatzen dira, eta bi zuhaitzetan `←` teklak errenkada bat zabaltzen du edo fokua haren lehen umera eramaten du, `→` teklak, berriz, tolestu egiten du edo fokua haren gurasora eramaten du. Ikus [Arakatzaileko teklak](./explorer.md#keys-in-the-explorer).  
Izenek, iruzkinek eta idatzi duzun beste edozein testuk beren norabidea mantentzen dute; beraz, hebreerazko, arabierazko edo persierazko izen bat eskuinetik ezkerrera irakurtzen da oihalean ere.

## Gaia {#theme}

`Theme` botoiak (kontraste-ikono bat) gai-sortzailea irekitzen du: `Theme` izenburua duen panel bat, tresna-barraren azpian, irekita dagoen fitxaren gainean. Hiru atal ditu:

- `Accent color`: 26 kolore-lagin. Bakoitzaren argibideak haren izena ematen du, adibidez `indigo`.
- `Gray color`: 6 kolore-lagin, `gray`, `mauve`, `slate`, `sage`, `olive` eta `sand`.
- `Appearance`: `System`, `Light` eta `Dark`.

![Gai-sortzailea tresna-barratik irekitzea, nabarmentze-kolore bat eta gris-tonu bat aukeratzea, eta itxura Light aukerara eta ondoren System aukerara aldatzea](/img/demo-theme-builder.webp)

Atal bakoitzean indarrean dagoen aukera markatuta dago, eta aukeraketa batek berehala du eragina, sortzailea itxi gabe.  
Kolore bat aukeratzeak ez du itxura aldatzen; beraz, `System` itxuran aukeratutako kolore batek `System` mantentzen du.

`System` aukerak argia edo iluna erakusten du ostalariaren arabera, eta ostalaria aldatzean aldatu egiten da:

- Web aplikazioan, Google Drive zerbitzuan eta zure orrian: nabigatzaileak adierazten duen modu argia edo iluna, sistema eragileari jarraitzen diona.
- VS Code editorean: argia kolore-gai argi batekin, eta iluna kolore-gai ilun batekin edo kontraste handiko bi gaietako edozeinekin.
- JetBrains IDE batean: IDEaren gai argia edo iluna.
- Obsidian aplikazioan: Obsidianen gai argia edo iluna.

Itxi sortzailea `Escape` teklarekin, izenburuaren ondoko `x` botoiarekin (haren argibideak `Close (ESC)` dio), editorean panelaz kanpoko edozein lekutan egindako sakatze batekin, tresna-barran izan ezik, edo berriro `Theme` botoiarekin.  
Irekitzeak Taularen propietateak eta `Display Language` hautatzailea ixten ditu. Irekita dagoen [Arakatzailea](./explorer.md#dialogs-beside-it) irekita geratzen da, eta ezkerretik eskuinera idazten den hizkuntza batean sortzailea haren ondoan bertan kokatzen da, haren gainean egon beharrean.  
Bilaketa azkarra edo `Display Language` hautatzailea irekitzeak ixten du, baita `Ctrl + F` (Windows/Linux) edo `⌘ + F` (Mac) lasterbideak ere. Lasterbide horrek [Arakatzailea](./explorer.md#opening-and-closing) haren bilaketa aktibatuta irekitzen du, edo, Arakatzailea dagoeneko irekita badago, irekita mantentzen du eta teklatua haren Bilatu eremura eramaten du. Tresna-barrako `Explorer` botoiak sortzailea irekita uzten du.  
Sortzaileak ez du teklarik atzematen; beraz, editorearen lasterbideek funtzionatzen dute irekita dagoen bitartean.

[Bilaketa azkarrean](./quick-search.md), `Theme` aukerak `System`, `Light` eta `Dark` zerrendatzen ditu, indarrean dagoen itxura markatuta. Horietako bat aukeratzeak itxura soilik aldatzen du, eta gris-tonua eta nabarmentze-kolorea dauden bezala uzten ditu.

## Ostalari bakoitzean {#in-each-host}

Editorean aukeratzen duzuna, tresna-barratik edo Bilaketa azkarretik, ostalariak gordetzen duen lekuan gordetzen da, eta irekita dagoen diagrama orok berehala jarraitzen dio balio horren edozein aldaketari, non egiten den gorabehera.  
VS Code editorean, JetBrains IDE batean eta Obsidian aplikazioan, ostalariaren `Auto` aukera (VS Code editorean, `auto` balioa) editorearen `System` aukera da. `System` aukeratzean `Auto` gordetzen da, eta `Light` edo `Dark` aukeratzean itxura hori gordetzen da, `Auto` aukerak lehendik erakusten bazuen ere.  
Luzapenaren eta pluginen beren ezarpenak eta abisuak ingelesez daude, bistaratze-hizkuntza edozein dela ere.

### Web aplikazioa eta Google Drive {#web-app-and-google-drive}

erd-editor.io webgunean, haren elkarlaneko saioak barne, eta Google Drive zerbitzuan, hizkuntza bakarra eta gai bakarra erabiltzen dira aplikazioan eta bertako diagrama guztietan.  
Biak nabigatzaile honetan gordetzen dira, ez eskeman ez Drive fitxategian, eta erd-editor.io webguneko fitxa guztiek partekatzen dituzte: fitxa batean egindako aukeraketak besteak berehala aldatzen ditu.

Hizkuntza bat aukeratu arte, `System` aukera erabiltzen da, nabigatzailearen hizkuntza hobetsiei jarraitzen diena.  
Aplikazioaren beraren testuak (alboko barra, zakarrontzia, elkarlana eta Google Drive zerbitzuko pantailak, adibidez) hizkuntza berari jarraitzen dio, eta hebreeraz, arabieraz eta persieraz aplikazio osoa eskuinetik ezkerrera antolatzen da. Privacy Policy, Terms of Service eta laguntza-orriak ingelesez geratzen dira.  
Editorearen panelaz eta Bilaketa azkarraz gain, alboko barraren beheko errenkadak hizkuntza-botoi bat du, `Privacy` eta `Terms` esteken ondoan, eta haren argibideak `Display Language` dio. Haren menuak `System` aukera zerrendatzen du, adierazten duen hizkuntzarekin, eta ondoren 25 hizkuntzak.

Gaia `System` itxuran hasten da, `olive` gris-tonuarekin eta `jade` nabarmentze-kolorearekin.  
Gai-sortzaileaz eta Bilaketa azkarraz gain, alboko barraren behealdeak hiru ikono-botoi ditu, `System`, `Light` eta `Dark`: erd-editor.io webgunean `Trash` aukeraren ondoan, eta Google Drive zerbitzuan `Sign out` aukeraren ondoan. Gai-sortzaileak ezartzen duen itxura bera ezartzen dute.

### VS Code {#vs-code}

Luzapenaren ezarpenak VS Coderen Settings ataleko ERD Editor sailean daude:

| Ezarpena | Balioak | Lehenetsia |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto`, edo [hizkuntzen taulako](#display-language) kode bat | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`, `light`, `dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | sei gris-tonuak | `slate` |
| `dineug.erd-editor.theme.accentColor` | 26 nabarmentze-koloreak | `indigo` |

Settings editoreak hizkuntza-ezarpenaren aukerak honela zerrendatzen ditu: `Auto`, eta ondoren hizkuntza bakoitza bere hizkuntzako izenarekin. `settings.json` fitxategian hizkuntzarik adierazten ez duen balio bat `auto` balio gisa irakurtzen da.  
Editorean egindako gai-aukeraketa batek gaiaren hiru ezarpenak idazten ditu. Aukeraketa bat haren ezarpena dagoeneko ezarrita dagoen lekuan idazten da: lan-eremuko karpetan, bestela lan-eremuan, bestela erabiltzailearen ezarpenetan.

### JetBrains IDEak {#jetbrains-ides}

Settings | Tools | ERD Editor atalak `Appearance:` (`Auto`, `Light`, `Dark`), `Gray color:`, `Accent color:` eta `Display language:` (`Auto`, eta ondoren hizkuntza bakoitza bere hizkuntzako izenarekin) ezarpenak ditu, IDE osorako gordeta.  
Hasierako balioak `Auto`, `Slate`, `Indigo` eta `Auto` dira.

### Obsidian {#obsidian}

Settings → ERD Editor atalak `Appearance` (`Auto`, `Light`, `Dark`), `Gray color`, `Accent color` eta `Display language` (`Auto`, eta ondoren hizkuntza bakoitza bere hizkuntzako izenarekin) ezarpenak ditu, biltegi bakoitzeko gordeta.  
Hasierako balioak `Auto`, `Slate`, `Indigo` eta `Auto` dira.  
Aldaketa bat biltegiko ERD fitxa guztiei aplikatzen zaie, leiho bereizietan daudenak barne.

### Zure orria {#your-own-page}

Zure orriko `<erd-editor>` elementu batek ez du `Theme` ez `Display Language` botoirik erakusten, eta Bilaketa azkarrak ez du bietako bat ere zerrendatzen, orriak [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) eta [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker) propietateekin aktibatu arte.  
Orriak hizkuntza bat ezarri edo irakurleak bat aukeratu arte, editoreak ingelesa erakusten du, edo `System` aukerari jarraitzen dio `enableLocalePicker` aktibatuta dagoen bitartean.  
Gaia `Dark` itxuran hasten da, `slate` gris-tonuarekin eta `indigo` nabarmentze-kolorearekin, orriak beste bat ezartzen ez badu edo [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode) aktibatzen ez badu.  
Irakurlearen aukeraketak berehala du eragina, baina elementuak ez du bi aukeretako bat ere gordetzen: orriak berak ezartzen ditu hasierakoak eta berak gordetzen ditu irakurlearen aukeraketak. Ikus [Gaia](../../api/erd-editor-element.md#theme) eta [Bistaratze-hizkuntza](../../api/erd-editor-element.md#display-language) APIan.
