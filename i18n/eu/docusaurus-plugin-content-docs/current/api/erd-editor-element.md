---
sidebar_position: 2
description: "erd-editor elementuaren APIa: atributuak, value eta runtimeValue, gertaerak, gaiak, bistaratze-hizkuntza, ongietorri-pantaila, tekla-konbinazioak, eta eskemen inportazioa eta esportazioa."
---

# ErdEditorElement

Editorea `HTMLElement` arrunt bat da.  
Haren mota-definizioa honako hau da.

```ts
interface ErdEditorElement extends HTMLElement {
  readonly: boolean;
  systemDarkMode: boolean; // system dark/light auto
  enableThemeBuilder: boolean;
  enableLocalePicker: boolean;
  enableWelcomeScreen: boolean;
  value: string;
  readonly runtimeValue: string;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  destroy: () => void;
  setInitialValue: (value: string) => void;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => void;
  setSystemLocale: (locale: string | null) => void;
  setKeyBindingMap: (
    keyBindingMap: Partial<
      Omit<
        KeyBindingMap,
        | 'edit'
        | 'stop'
        | 'undo'
        | 'redo'
        | 'zoomIn'
        | 'zoomOut'
        | 'zoomReset'
      >
    >
  ) => void;
  setSchemaSQL: SetSchema;
  setSchemaGraphQL: SetSchema;
  setSchemaDBML: SetSchema;
  setSchemaAML: SetSchema;
  setSchemaJSON: (
    value: string,
    options?: { mode?: 'replace' | 'append' }
  ) => void;
  getSchemaSQL: (
    databaseVendor?: DatabaseVendor,
    options?: SchemaSQLOptions
  ) => string;
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
  setDiffValue: (value: string) => void;
}
```

Editorea shadow root itxi batean errendatzen da; beraz, `editor.shadowRoot` balioa `null` da, eta estiloak ez dira ez orritik barrura sartzen, ez barrutik kanpora ateratzen.  
Barruko ezer ezin da hautatzaile batekin atzitu; horren ordez, eman estiloa [setTheme](#settheme) metodoaren eta `--erd-editor-*` propietate pertsonalizatuen bidez.

`readonly`, `system-dark-mode`, `enable-theme-builder`, `enable-locale-picker` eta `enable-welcome-screen` dira atributu bakarrak, eta bostek `false` balioa dute lehenespenez. Azken biak `4.0.0` bertsioan berriak dira. Bakoitzak bere balioa [readonly](#readonly) atalean azaltzen den bezala irakurtzen du.

`4.1.0` bertsiotik aurrera, ERD fitxak [Arakatzailea](../guide/guides/explorer.md) du: diagramaren zuhaitz bat, oihalaren ezkerraldean kokatua, goialdean Bilatu eta ordeztu duela. Ez dago hura ireki, itxi edo haren egoera jakinarazten duen atributu, propietate, metodo edo gertaerarik: tresna-barrako `Explorer` botoitik irekitzen da, Bilaketa azkarreko edo oihalaren laster-menuko `Toggle Explorer` aukeratik, edo [`findReplace`](#setkeybindingmap) tekla-konbinazioarekin.  
Elementu bakoitza Arakatzailea itxita duela hasten da. Irekita dagoen ala ez, haren zabalera, tolestea eta bilaketa elementuak irauten duen artean mantentzen dira, fitxa-aldaketetan eta karga guztietan zehar, `setInitialValue` barne, eta ez daude inoiz ez `value` balioan, ez `runtimeValue` balioan, ez desegite-historian, ez biltegi partekatu batean.

## readonly {#readonly}

Editorearen edizio-gaitasuna ezartzen du.  
Ezarrita dagoen bitartean, `value` esleitzea, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, `setSchemaJSON()`, desegitea eta berregitea ez dira kontuan hartzen, eta `change` gertaera ez da inoiz igortzen. Horren ordez, kargatu dokumentua [setInitialValue](#setinitialvalue) metodoarekin.  
Ikusteko funtzioek lanean jarraitzen dute: zooma, ikuspegia mugitzea, esku-tresna, zen modua, oihalaren fitxa, [Bisualizazioa](../guide/guides/visualization.md) fitxa bere bi moduetan, taulak fokuratzea barne, datu-base hornitzailea, eta SQLaren eta Kode-sortzailearen irteera-ezarpenak aplikatzen dira oraindik; beraz, irakurtzeko soilik dagoen ikustaile batek beste hornitzaile baterako SQLa esporta dezake oraindik edo sortutako kodea irakur dezake.  
`4.1.0` bertsiotik aurrera, [Arakatzailea](../guide/guides/explorer.md#read-only-editors) ere irekitzen da, eta haren errenkadetako bat aukeratzean, errenkadak adierazten duen elementura joaten da, editore editagarri batean bezala. Goialdeko [Bilatu eta ordeztu](../guide/guides/find-and-replace.md#read-only-editors) funtzioak bilatu baino ez du egiten, `Toggle Replace` gezirik eta Ordeztu errenkadarik gabe, eta bat-etortze batera joateak hura ikuspegira ekarri eta hautatu egiten du oraindik. Panelaren izenburua `Explorer` da, eta tresna-barrako botoiaren argibideak `Explorer (Ctrl + F)` (Windows/Linux) edo `Explorer (⌘ + F)` (Mac) dio editore guztietan. `3.10.0` bertsiotik `4.0.0` bertsiora arte, Bilatu eta ordeztu bilatzeko soilik zen panel flotatzaile gisa irekitzen zen, `Find` izenburuarekin.  
Taularen propietateak panela irekitzen da oraindik, eta `3.10.0` bertsiotik aurrera `Read only` etiketa erakusten du izenburuaren ondoan, eta haren `Indexes` fitxak ez du ediziorik eskaintzen. Ikus [Taularen propietateak](../guide/guides/table-related-functions.md#table-properties).  
`4.0.0` bertsiotik aurrera, irakurtzeko soilik dagoen editore batek ez du eskaintzen [`Import and Add`](../guide/guides/file-import-export.md#import-and-add), `New Table Group`, `Group selected tables`, `Remove from group` (ikus [Taula-taldeak](../guide/guides/table-groups.md#read-only-editors)) edo [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) aukerarik, eta ez du [ongietorri-pantailarik](#enablewelcomescreen) erakusten. Ezarpenak fitxako blokeo-botoiek ez dute ezer aldatzen, eta SQL eskema fitxako `Before tables` eta `After tables` scriptak ezin dira editatu.  
`4.1.0` bertsiotik aurrera, ez du `New Table`, `New Memo` edo `New Table Group` botoirik erakusten [oihaleko tresna-barran](../guide/guides/table-related-functions.md#canvas-toolbar) ere, eta `addTableGroup` eta `groupSelectedTables` tekla-konbinazioek ez dute ezer egiten.  
SQL eskema fitxako `This window only` aukerak, `Statements`, `Header` eta `Tables`, ez dira inoiz gordetzen eta aplikatzen dira oraindik, eta gauza bera gertatzen da [`Export image`](../guide/guides/file-import-export.md#image) elkarrizketa-koadroarekin, gai-sortzailearekin eta Bistaratze-hizkuntzaren hautatzailearekin. Gai-sortzailean edo Bistaratze-hizkuntzaren hautatzailean egindako aukeraketa batek [changePresetTheme](#changepresettheme) edo [changeLocale](#changelocale) igortzen du oraindik.  
Baliorik gabeko atributua, `=""` eta `="true"` `true` gisa irakurtzen dira. `="false"` balioa `false` gisa irakurtzen da, eta beste edozein kate ere bai, HTMLko `readonly="readonly"` ohiko idazkera barne.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode {#systemdarkmode}

Sistemaren modu ilun/argiarekin automatikoki sinkronizatu ala ez zehazten du.  
`4.0.0` bertsiotik aurrera, aktibatzeak gaiaren `appearance` propietatea `'system'` balioan jartzen du, `setPresetTheme({ appearance: 'system' })` deiak egiten duen bezala. Orduan, editoreak sistema eragileak jakinarazten duen itxura argia edo iluna erakusten du, edo [setSystemAppearance](#setsystemappearance) metodoak izendatzen duena, eta hura aldatzen denean aldatu egiten da.  
Geroago `'light'` edo `'dark'` balioarekin egindako [setPresetTheme](#setpresettheme) dei batek, edo gai-sortzailean edo Bilaketa azkarrean `Light` edo `Dark` aukeratzeak, `'system'` ordezten du, eta hala geratzen da: sistema eragilearen hurrengo aldaketak ez du gainidazten, `systemDarkMode` oraindik `true` bada ere. `4.0.0` bertsioa baino lehen, sistema eragilearen hurrengo aldaketak gainidazten zuen.  
Itxura `'system'` den bitartean desaktibatzean, une horretan erakusten den itxura argia edo iluna mantentzen da. Itxura `'system'` baliotik aldatu ondoren desaktibatzean, dagoen bezala geratzen da.  
Aldatzeak ez du gertaerarik igortzen.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder {#enablethemebuilder}

Gai aurrezarriak erraz ezartzeko interfaze bat eskaintzen den ala ez zehazten du.  
Tresna-barrako `Theme` botoia erakusten du, eta botoi horrek gai-sortzailea irekitzen du, `Accent color`, `Gray color` eta `Appearance` aukerekin. `4.0.0` bertsiotik aurrera, `Appearance` aukerak `System` eskaintzen du `Light` eta `Dark` aukeren ondoan, eta hau aktibatuta dagoen bitartean, Bilaketa azkarrak `Theme` zerrendatzen du, `System`, `Light` eta `Dark` aukerekin. Ikus [Hizkuntza eta gaia](../guide/guides/language-and-theme.md).

![Gai-sortzailea tresna-barratik irekitzea, nabarmentze-kolorea eta gris-tonua aukeratzea, eta itxura Light aukerara eta ondoren System aukerara aldatzea](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

Panel honetatik edo Bilaketa azkarretik gai aurrezarria aldatzeak [changePresetTheme](#changepresettheme) gertaera igortzen du.

## enableLocalePicker {#enablelocalepicker}

`4.0.0` bertsiotik aurrera, editorearen bistaratze-hizkuntza aukeratzeko interfaze bat eskaintzen den ala ez zehazten du.  
Tresna-barrako `Display Language` botoia erakusten du, `Theme` botoiaren ondoren biak erakusten direnean. Botoiak Bistaratze-hizkuntzaren hautatzailea irekitzen du, eta Bilaketa azkarrak `Display Language` zerrendatzen du. Biek `System` eta 25 hizkuntzak eskaintzen dituzte. Ikus [Hizkuntza eta gaia](../guide/guides/language-and-theme.md).  
Era berean, [setLocale](#setlocale) metodoari deitu edo hizkuntza bat aukeratu aurretik editore batek zer erakusten duen erabakitzen du: `'system'` aktibatuta dagoen bitartean, eta ingelesa desaktibatuta dagoen bitartean; beraz, ezer konfiguratzen ez duen elementu batek beti erakutsi duen ingelesa mantentzen du. Aktibatzeak edo desaktibatzeak berehala aldatzen du bien artean. Hizkuntza bat ezarri edo aukeratu ondoren, aukera horrek bere horretan jarraitzen du, aktibatuta zein desaktibatuta egon.  
Lehen fotogramak `'system'` jarrai dezan, ezarri elementua erantsi aurretik.  
Aukeraketa batek [changeLocale](#changelocale) igortzen du.

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen {#enablewelcomescreen}

`4.0.0` bertsiotik aurrera, diagrama huts batek irakurleari [ongietorri-pantailarekin](../guide/guides/editing-start.md#welcome-screen) harrera egiten dion ala ez zehazten du.  
ERD fitxaren gainean agertzen da, dokumentuak ez taularik, ez erakutsitako oharrik, ez erakutsitako taula-talderik ez duen bitartean. Ez da erakusten `readonly` ezarrita dagoen bitartean, zen moduan, edo Taularen propietateak, Diferentzia-ikustailea, Denbora-bidaia edo Antolaketa automatikoaren aurrebista irekita dagoen bitartean. Lehen taulak, lehen ohar erakutsiak edo lehen taula-talde erakutsiak kentzen du, eta diagrama hutsera itzultzen den desegite batek berriro ekartzen du.  
Haren `New Table`, `New Memo` eta `Command Palette` errenkadek `addTable`, `addMemo` eta `search` tekla-konbinazioen lehen lasterbidea erakusten dute, [setKeyBindingMap](#setkeybindingmap) metodoak utzi dituen bezala, eta bat ere ez hutsik utzitako izen batentzat. Haren geziek `Theme` eta `Display Language` botoiak seinalatzen dituzte, soilik `enableThemeBuilder` eta `enableLocalePicker` propietateek erakusten dituzten tokietan.  
Haren menuan, `↑`, `↓`, `Home` eta `End` teklekin errenkaden artean mugitzen da, eta tekla horiek eragotzi egiten dira eta haien hedapena gelditzen da. `Enter` eta `Space` teklen hedapena gelditzen da, baina ez dira eragozten; beraz, fokuratutako errenkadak jasotzen ditu, eta `Import` formatuen artean, `Escape` teklak atzera egiten du, eragotzita eta hedapena geldituta. Beste tekla guztiak editorera eta orrira iristen dira ohi bezala.  
Ez du dokumentuan ezer aldatzen; beraz, `value` zegoen bezala uzten du, eta ez du `change` gertaerarik igortzen.  
Aktibatu [setInitialValue](#setinitialvalue) metodoak dokumentua kargatu ondoren, ostalari ofizialek egiten duten bezala, pantaila inoiz une batez ager ez dadin oraindik kargatzen ari den fitxategi baten gainean.

```js
editor.enableWelcomeScreen = true;
// or
editor.setAttribute('enable-welcome-screen', 'true');
```

```html
<erd-editor enable-welcome-screen></erd-editor>
```

## value {#value}

### getter {#getter}

Uneko dokumentua JSON kate gisa itzultzen du, editoreak definitzen duen [eskeman](./advanced/schema.md).  
`4.0.0` bertsiotik aurrera, biltegiratze-forma da, dokumentua fitxategi batek gordetzen duen bezala, eta hori bera da `json` esportazioak idazten duena eta ostalari ofizialek gordetzen dutena. Entitate biziak soilik ditu, kendutakorik gabe, pilatze-ordenarik gabe, eta editoreak berak kalkulatzen duenik gabe, hala nola neurtutako zabalerak, gako-markak eta erlazioen aingura-puntuak. Haren entitateen gakoak ordena finkoan daude, bi zuriunerekin koskatuta dago, eta lerro-jauzi batekin amaitzen da; beraz, dokumentu berak beti byte berak ematen ditu.  
[Blokeoa](../guide/guides/settings.md#lock) aktibatuta duen ezarpen bakoitza blokeatuta dagoen balioarekin idazten da, ez pantailak erakusten duen bezala. `Viewport` blokeoak `originX`, `originY` eta `zoomLevel` gordetzen ditu, eta `Canvas Type`, `Language`, `Table Name Case`, `Column Name Case` eta `Bracket Type` blokeoetako bakoitzak bere ezarpena gordetzen du. Beste ezarpen guztiak dauden bezala idazten dira, eta `lockSettings` beti idazten da. Bitei buruzko xehetasunetarako, ikus [Settings](./advanced/schema.md#settings).  
Dokumentu berri batek blokeo guztiak aktibatuta ditu, dela elementu batek balio bat jaso aurretik erakusten duena, dela balio huts batetik kargatutakoa. Haren `value` balioak jatorria `0, 0` puntuan, zoom-maila `1` balioan, ERD fitxa, eta Kode-sortzailearen lengoaia, izenen idazkerak eta mugatzaile mota lehenetsiak mantentzen ditu, dagokion blokeoa desaktibatu arte.  
`4.0.0` bertsioa baino lehen, dokumentu osoa itzultzen zuen editoreak gordetzen zuen bezala, `ignoreSaveSettings` aplikatuta. Editoreak gordetzen duen bezalako dokumentua [runtimeValue](#runtimevalue) da orain, eta `ignoreSaveSettings` ez da gehiago irakurtzen ez idazten.

```js
const data = editor.value;
```

### setter {#setter}

Aurrez gordetako editore-egoera bat kargatzen du. Dokumentu osoa ordezten du: unekoa garbitzen da lehenik.  
`clear()` eta `setInitialValue()` bezala, eta `setSchema*` metodoak beren `mode: 'replace'` modu lehenetsian bezala, Bisualizazioa fitxako Fluxu ikuspegia ere baztertzen du: haren antolaketa, zein taulatara mugatuta dagoen, errenkaden bistaratzea, zooma eta ikuspegiaren kokapena. Gehitze batek (`mode: 'append'`) ez du baztertzen.  
Historia-zerrendan erregistratzen da, `Undo, Redo` ahalbidetuz, eta `change` igortzen du.  
Biltegiratze-forma, [runtimeValue](#runtimevalue) bat edo aurreko bertsio batek gordetako fitxategi bat onartzen ditu.  
Kate huts batek, edo kate ez den edozerk, dokumentu berri bat kargatzen du errorerik sortu beharrean; beraz, egiaztatu balioa esleitu aurretik.  
Dokumentu berri hori `setInitialValue('')` deiak hasten duen bera da: hutsa, ezarpen lehenetsiekin, eta `4.0.0` bertsiotik aurrera blokeo guztiak aktibatuta. `3.10.x` bertsioetan ez zituen ez korritze-posizioa ez zoom-maila gordetzen, eta horren aurretik biak gordetzen zituen.  
Biltegi partekatu batek karga hori lankideei helarazten die dokumentu berriaren JSON osoarekin; beraz, pareko guztiek, bertsio zaharragoko bat barne, dokumentu bera kargatzen dute.  
`4.0.0` bertsiotik aurrera, kargatutako dokumentuaren blokeoak, eta ondoren `value` balioak idazten dituen balio blokeatuak, testutik datoz, eta ikuspegia testuak jartzen duen tokian kokatzen da, edo diagraman, han diagramaren zatirik ere marrazten ez bada. Testuak blokeatzen dituen beste ezarpen bakoitzerako — fitxa, Kode-sortzailearen lengoaia, izenen idazkerak eta mugatzaile mota — editoreak kargatu aurretik erakusten zuena erakusten jarraitzen du. Testuak blokeatu gabe uzten duen ezarpen batek testuaren balioa hartzen du. [setInitialValue](#setinitialvalue) metodoak, aldiz, testuak dituen balio guztiak hartzen ditu; ikus hura, baita blokeorik izendatzen ez duen testu baterako ere.  
JSON ez den testuak ere, esaterako bateratze-gatazken markekin utzitako fitxategi batek, ez du errorerik sortzen: dokumentua hustu egiten da, haren ezarpenak zeuden bezala geratzen dira, eta analisi-errorea kontsolan erregistratzen da.  
Ez da kontuan hartzen `readonly` ezarrita dagoen bitartean; erabili [setInitialValue](#setinitialvalue) irakurtzeko soilik dagoen editore batean kargatzeko.

```js
editor.value = 'json...';
```

## runtimeValue {#runtimevalue}

`4.0.0` bertsiotik aurrera, dokumentua editore honek gordetzen duen bezala itzultzen du, JSON kate gisa. Ez du setter-ik; beraz, esleitzeak errore bat jaurtitzen du modu zorrotzeko kodean.  
[value](#value) propietateak kanpoan uzten duena darama: kendutako entitateak eta haien ordena, pilatze-ordena, neurtutako zabalerak, gako-markak, erlazioen aingura-puntuak eta sekuentziak. Ezarpen blokeatuak hemen ere beren balio blokeatuekin idazten dira.  
Erabili martxan dagoen saio batean sartzen den beste editore bat hasieratzeko, hala nola lankide bat edo dokumentu beraren bigarren ikuspegi bat, haren [setInitialValue](#setinitialvalue) metodoaren bidez. Saioak geroago bidaltzen duen kentze baten desegiteak entitatea osorik berreskuratzen du han; `value` baliotik hasieratutako editore batek, berriz, ez du kendutako entitaterik, eta taula huts eta izengabe bat berreskuratzen du horren ordez. Ikus [Elkarlaneko edizioa](./advanced/collaborative-editing.md).  
Kendutako entitateak jada ez ditu ezerk biltzen; beraz, bertan geratzen dira dokumentua hurrengoan bere fitxategitik ireki arte.  
Ez idatzi inoiz fitxategi batean: gorde `value`, [JSON Schema](./advanced/schema.md#json-schema) eskemak hura onartzen baitu, baina hau ez.

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue {#setinitialvalue}

Aurrez gordetako editore-egoera bat kargatzen du. Karga bera ez da historia-zerrendan erregistratzen; beraz, ezin da desegin, eta ez da `change` gertaerarik igortzen.  
Desegite-historia ere garbitzen du; beraz, kargatu aurretik egindako ezer ezin da desegin edo berregin kargatutako dokumentuaren gainean.  
Biltegiratze-forma, [runtimeValue](#runtimevalue) bat edo aurreko bertsio batek gordetako fitxategi bat onartzen ditu, eta, `value` esleitzean ez bezala, testuak dituen ezarpen guztiak hartzen ditu, fitxa eta kode-ezarpenak barne.  
Kate huts batek, edo kate ez den edozerk, dokumentu berri bat kargatzen du errorerik sortu beharrean; beraz, `setInitialValue('')` deiak diagrama huts bat hasten du.  
`4.0.0` bertsiotik aurrera, dokumentu berri horrek, elementu batek inolako baliorik jaso aurretik erakusten duen berak, blokeo guztiak aktibatuta ditu. Korritzeak, zooma aldatzeak, fitxaz aldatzeak, eta Kode-sortzailearen lengoaia, izenen idazkerak edo mugatzaile mota aldatzeak `value` zegoen bezala uzten dute, eta ez dute `change` gertaerarik igortzen. `3.10.x` bertsioetan ez zituen ez korritze-posizioa ez zoom-maila gordetzen, eta horren aurretik biak gordetzen zituen.  
Testutik kargatutako dokumentu batek izendatzen dituen blokeoak mantentzen ditu. Bat ere izendatzen ez duena — `4.0.0` bertsioa baino lehen gordetako edozein fitxategi, haren `ignoreSaveSettings` aukerak zer zioen gorabehera, eta v2 `.vuerd` fitxategi bat — blokeo guztiak aktibatuta irekitzen da, `Viewport` blokeoa `0, 0` jatorrian eta `1` zoom-mailan blokeatuta, ERD fitxan, eta lengoaia, izenen idazkerak eta mugatzaile mota gorde zituen bezala dituela.  
Edonola ere, ikuspegia dokumentuaren ikuspegian irekitzen da — testuak gordetakoa, blokeoak izendatzen dituenean; `0, 0` jatorria `1` zoom-mailan, bat ere izendatzen ez duenean — edo diagraman, han diagramaren zatirik ere marrazten ez bada. Blokeatutako `Viewport` batek bere balio blokeatuak mantentzen ditu oraindik `value` balioan.  
`4.0.0` bertsiotik aurrera, aurretik zuen dokumentuaren elkarlan-egoera ere baztertzen du, eta dagoeneko harpidetuta dagoen editore honen [biltegi partekatu](#getsharedstore) batek beste editoreei haiena eskatzen die berriro; beraz, martxan dagoen saio batean berriro kargatutako editore bat besteekin bat jartzen da. Hasieratu editore hori beste editore baten [runtimeValue](#runtimevalue) balioarekin.  
JSON ez den testuak ere ez du errorerik sortzen: dokumentua hustu egiten da, haren ezarpenak zeuden bezala geratzen dira, eta analisi-errorea kontsolan erregistratzen da.  
`value` esleitzean ez bezala, `readonly` atributuak ez du blokeatzen; beraz, horrela kargatzen da dokumentu bat irakurtzeko soilik dagoen ikustaile batean.

```js
editor.setInitialValue('json...');
```

Kargatu hastean, gorde aldatzean.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Gertaerak {#event}

`change`, `changePresetTheme` eta `changeLocale` dira hiru gertaera publiko bakarrak; `changeLocale` gertaera `4.0.0` bertsioan berria da.  
Elementuak barneko `@dineug/erd-editor/internal-*` gertaerak ere bidaltzen dizkio bere buruari, bere barne-loturetarako; horiek ez dira APIaren parte.

### change {#change}

Editorean aldaketak daudenean, gertaera bat igortzen du.  
Gertaera atzeratu egiten da 200 ms-ko isilaldia igaro arte, eta ez da igortzen `readonly` `true` den bitartean.  
Dokumentuaren edozein aldaketarekin abiarazten da: interfazeko edizio batekin, `value` esleitzearekin, `clear()` deiarekin, `setSchema*` metodo bakoitzarekin, eta `4.0.0` bertsiotik aurrera `setSchemaJSON()` deiarekin eta `Import and Add` aukerarekin. `setInitialValue` metodoak ez du igortzen.  
Bisualizazioa fitxako Fluxu moduan egiten den ezerk ez du igortzen — zooma, ikuspegia mugitzea, txartelak mugitzea, `Tidy Up`, errenkaden bistaratzea, ezta txartel batetik ikuspegia mugatzea ere — horietako bat ere ez baita dokumentu-aldaketa.  
`4.0.0` bertsiotik aurrera, [blokeoa](../guide/guides/settings.md#lock) aktibatuta duen ezarpen baten aldaketak ere ez du igortzen, pantaila soilik mugitzen duelako eta inoiz ez `value`: ERD oihaleko korritze edo zoom bat `Viewport` blokeatuta dagoen bitartean, fitxa-aldaketa bat `Canvas Type` blokeatuta dagoen bitartean, eta Kode-sortzailearen lengoaiaren, taula-izenen idazkeraren, zutabe-izenen idazkeraren edo mugatzaile motaren aldaketa bat, haren blokeoa aktibatuta dagoen bitartean. Aldaketa horiek soilik geratzen dira kanpoan; beraz, dokumentua ere editatzen duen sorta batek igortzen du. Ezarpen bat blokeatzeak edo desblokeatzeak igortzen du.  
Blokeo guztiak aktibatuta daude dokumentu berri batean eta `4.0.0` bertsioa baino lehen gordetako edozein fitxategitan; beraz, lehenespenez korritzeak, zoomak eta fitxaz aldatzeak ez dute ezer igortzen. Horrek barne hartzen ditu ERD fitxatik taulak fokuratzea, Fluxutik ERD fitxara itzultzen zaituen txartelaren kanpo-estekaren botoia, Arakatzaileko errenkada batera edo bilaketaren bat-etortze batera joatea, eta beste fitxa batetik Arakatzailea irekitzea edo Bilaketa azkarreko emaitza batera joatea. Horietako bakoitzak `change` bakar bat igortzen du, hura estaltzen duen blokeo bat desaktibatuta dagoen bitartean soilik: `Canvas Type` fitxa-aldaketarako, eta `Viewport` txartel-botoi batek, Bilaketa azkarreko emaitza batek, Arakatzaileko errenkada batek edo bilaketaren bat-etortze batek ere egiten duen korritzerako. `4.1.0` bertsiotik aurrera, korritze horiek guztiek arau bakar bati jarraitzen diote, [Jauziaren helmuga](../guide/guides/table-related-functions.md#where-a-jump-lands); beraz, Bilaketa azkarreko taula-emaitza batek jada ez du beti korritzen, eta arauak bere tokian uzten duen jauzi batek ez du igortzeko korritzerik egiten. Arakatzailea irekitzeak, ixteak edo tamainaz aldatzeak oihala estutu edo zabaltzen du haren jatorria mugitu gabe, eta horrek ere ez du ezer igortzen. `4.0.0` bertsioa baino lehen, korritzeak, zoomak eta fitxaz aldatzeak beti igortzen zuten, `editor.value` berdin ateratzen zenean ere.  
Ezer aldatzen ez duten idazketak saihesteko, alderatu `editor.value` gorde zenuen azken balioarekin, ez kargatu zenuen fitxategiarekin: aurreko bertsio batek idatzitako fitxategi bat, v2 fitxategi bat edo eskuz editatutako bat desberdin atera daiteke `value` balioan kargatu bezain laster, `value` balioak biltegiratze-forman idazten duelako. Gauza bera gerta daiteke `Viewport` blokeoa desaktibatuta duen fitxategi batekin, haren jatorritik diagramaren zatirik ere marrazten ez bada pantaila honetan: kargak ikuspegia diagramara mugitzen du, eta `value` balioak ikuspegia kokatzen den tokia idazten du. `4.0.0` bertsiotik aurrera, neurtutako zabalerek ez dute hau eragiten, `value` balioak ez baitu bat ere. Fitxategiak idazten dituen ostalari batek, horren ordez, edizio bat eta ikuspegi-aldaketa bat bereiz ditzake erreplikazio-biltegi baten `changed` propietatearekin. Ikus [on@change](./advanced/remote-storage.md#onchange).  
Gertaerak ez du `detail` propietaterik, eta ez da burbuila-fasean hedatzen, ezta shadow DOMaren muga zeharkatzen ere; beraz, entzun elementuan bertan eta irakurri `editor.value` kudeatzailean.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme {#changepresettheme}

Gai aurrezarria editorean integratutako gai-sortzailetik aldatzen denean igortzen da, edo, `4.0.0` bertsiotik aurrera, Bilaketa azkarreko `Theme` aukeratik. Aukeraketa orok igortzen du, dagoeneko indarrean dagoen aukera berriro aukeratzea barne.  
Zuk zeuk [setPresetTheme](#setpresettheme) edo [setSystemAppearance](#setsystemappearance) metodoei deitzeak, edo [systemDarkMode](#systemdarkmode) aktibatzeak edo desaktibatzeak, ez du igortzen.  
`event.detail` aukeraketaren ondorengo `ThemeOptions` osoa da, `{ appearance, grayColor, accentColor }`, ez eskatutako balio partziala. `4.0.0` bertsiotik aurrera, haren `appearance` propietatea `'system'` da `System` aukeratuta dagoen bitartean, ez erakusten duen itxura argia edo iluna; beraz, gorde dagoen bezala eta eman berriro `setPresetTheme` metodoari.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale {#changelocale}

`4.0.0` bertsiotik aurrera, editorean hizkuntza bat aukeratzen denean igortzen da, Bistaratze-hizkuntzaren hautatzailetik edo Bilaketa azkarreko `Display Language` aukeratik; biak [enableLocalePicker](#enablelocalepicker) propietateak aktibatzen ditu.  
Hizkuntza aplikatu ondoren abiarazten da, aukeraketa bakoitzean, dagoeneko indarrean dagoen aukera berriro aukeratzea barne. [setLocale](#setlocale) eta [setSystemLocale](#setsystemlocale) metodoek ez dute inoiz igortzen, ezta nabigatzailearen hizkuntzen aldaketa batek ere. Hizkuntza-aldaketa batek ez du `change` gertaerarik igortzen.  
`event.detail` objektua `{ locale }` da, `LocaleOption` bat: `'system'`, `System` aukeratu denean; bestela, hizkuntzaren kodea. Elementuak ez du aukeraketa gogoratzen; beraz, gorde eta pasatu `setLocale` metodoari hurrengo kargan.  
`change` gertaerak bezala, ez da burbuila-fasean hedatzen; beraz, entzun elementuan bertan.

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus {#focus}

Editorea fokuratzen du.

```js
editor.focus();
```

## blur {#blur}

Fokua editoretik kentzen du.

```js
editor.blur();
```

## clear {#clear}

Dokumentua husten du: taula, zutabe, erlazio, indize eta ohar guztiak kentzen ditu, eta `4.0.0` bertsiotik aurrera taula-talde guztiak ere bai.  
Ezarpen guztiak mantentzen dira, datu-basea, ikuspegiaren kokapena, zoom-maila, taulen ikuspegi-aukerak, blokeo bakoitza gordetzen duen balioarekin, eta SQL eskema fitxako `Before tables` eta `After tables` scriptak barne; beraz, garbitutako fitxategi batek lehen gordetzen zuena gordetzen jarraitzen du. Horren ordez dokumentu berri bat hasteko, esleitu `''` `value` propietateari edo deitu `setInitialValue('')` metodoari.  
Historia-zerrendan erregistratzen da; beraz, desegin daiteke, eta `change` igortzen du. Desegite batek dokumentua editoreak gordetzen zuen bezala itzultzen du, ezarpen blokeatu bakoitza bere balio blokeatuarekin. Ez da kontuan hartzen `readonly` ezarrita dagoen bitartean.

```js
editor.clear();
```

## destroy {#destroy}

Editorearen instantzia guztiz suntsitzen du, berriro erabili ezin izateko moduan.  
Editorearen entzuleak eta harpidetzak askatzen ditu, eta [getSharedStore](#getsharedstore) metodoak itzulitako biltegi partekatu guztiak suntsitzen ditu.  
Biltegi partekatu batek oraindik atxikita duen jario-sorta bat berarekin batera galtzen da; bidaltzeko, deitu lehenik biltegi horren [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) metodoari.

```js
editor.destroy();
```

## setKeyBindingMap {#setkeybindingmap}

Teklatuko lasterbideak birdefinitzen ditu.  
`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut` eta `zoomReset` finkoak dira, eta ezin dira birdefinitu.  
Beheko hogeita bat izenak soilik idazten dira; objektuko beste edozer ez da kontuan hartzen, izen finkoak barne.  
`3.10.0` bertsiotik aurrera, `search` birdefini daiteke, eta `findReplace` berria da. Lehen, `search` finkoa zen. `4.0.0` bertsiotik aurrera, `removeSelection` berria da. `4.1.0` bertsiotik aurrera, `addTableGroup` eta `groupSelectedTables` berriak dira.  
Tekla-konbinazio baten balioak `ShortcutOption[]` bat izan behar du. Kate soil bat ez da kontuan hartzen; beraz, idatzi `{ addTable: [{ shortcut: 'Alt+KeyN' }] }`, eta ez `{ addTable: 'Alt+KeyN' }`.  
Array huts bat onartzen da, eta ez du ezer lotzen: `setKeyBindingMap({ findReplace: [] })` deiak `Ctrl + F` (Windows/Linux) edo `⌘ + F` (Mac) orriaren esku uzten du, eta `{ search: [] }` balioak gauza bera egiten du `Ctrl + K` (Windows/Linux) edo `⌘ + K` (Mac) lasterbidearekin. Tresna-barrako `Search` botoiak Bilaketa azkarra irekitzen du oraindik, tresna-barrako `Explorer` botoiak Arakatzailea ireki eta ixten du oraindik, eta Bilaketa azkarreko eta oihalaren laster-menuko `Toggle Explorer` aukerak haren bilaketa irekitzen du edo hura ixten du oraindik; horietako batek ere ez du lasterbiderik erakusten hutsik utzitako izen batentzat. `{ removeSelection: [] }` balioak `Delete` eta `Backspace` orriaren esku uzten ditu, eta orduan taularen, oharraren eta taula-taldearen menuetako ezabatze-aukerek (`Delete`, `Delete selected`, `Delete column`, `Delete columns`) ez dute lasterbiderik erakusten.  
`4.1.0` bertsiotik aurrera, `{ addTableGroup: [] }` balioak `Alt + G` (Windows/Linux) edo `⌥ + G` (Mac) orriaren esku uzten du, eta `{ groupSelectedTables: [] }` balioak `T` eta ondoren `G`. Oihaleko tresna-barrako, oihalaren laster-menuko eta Bilaketa azkarreko `New Table Group`, taularen menuko `Group selected tables` eta Bilaketa azkarreko `Group Selected Tables` aukerek funtzionatzen dute oraindik, lasterbiderik erakutsi gabe. Oihaleko tresna-barrako `New Table`, `New Memo` eta `New Table Group` botoien argibideek `addTable`, `addMemo` eta `addTableGroup` tekla-konbinazioen lehen lasterbidea izendatzen dute, edo botoia soilik, hutsik utzitako tekla-konbinazio batentzat.  
Deia bateratze partziala da: kanpoan uzten dituzun izenek beren balio lehenetsiak mantentzen dituzte, eta bi aldiz deitzean aurreko aldaketak mantentzen dira. Ez dago uneko tekla-konbinazioetarako getter-ik: [createKeyBindingMap](#createkeybindingmap) funtzioak balio lehenetsiak itzultzen ditu, ez `setKeyBindingMap` metodoak aldatutakoa.

```ts
type ShortcutOption = {
  shortcut: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

const defaultKeyBindingMap: Omit<
  KeyBindingMap,
  | 'edit'
  | 'stop'
  | 'undo'
  | 'redo'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
> = {
  search: [
    { shortcut: '$mod+KeyK', preventDefault: true, stopPropagation: true },
  ],
  findReplace: [
    { shortcut: '$mod+KeyF', preventDefault: true, stopPropagation: true },
  ],
  addTable: [{ shortcut: 'Alt+KeyN', preventDefault: true }],
  addColumn: [{ shortcut: 'Alt+Enter', preventDefault: true }],
  addMemo: [{ shortcut: 'Alt+KeyM', preventDefault: true }],
  addTableGroup: [
    { shortcut: 'Alt+KeyG', preventDefault: true, stopPropagation: true },
  ],
  groupSelectedTables: [{ shortcut: 'KeyT KeyG', preventDefault: true }],
  removeTable: [
    { shortcut: '$mod+Backspace', preventDefault: true },
    { shortcut: '$mod+Delete', preventDefault: true },
  ],
  removeColumn: [
    { shortcut: 'Alt+Backspace', preventDefault: true },
    { shortcut: 'Alt+Delete', preventDefault: true },
  ],
  removeSelection: [
    { shortcut: 'Delete', preventDefault: true },
    { shortcut: 'Backspace', preventDefault: true },
  ],
  primaryKey: [{ shortcut: 'Alt+KeyK', preventDefault: true }],
  selectAllTable: [
    { shortcut: '$mod+KeyA', preventDefault: true },
    { shortcut: '$mod+Alt+KeyA', preventDefault: true },
  ],
  selectAllColumn: [{ shortcut: 'Alt+KeyA', preventDefault: true }],
  relationshipZeroOne: [{ shortcut: '$mod+Alt+Digit1', preventDefault: true }],
  relationshipZeroN: [{ shortcut: '$mod+Alt+Digit2', preventDefault: true }],
  relationshipOneOnly: [{ shortcut: '$mod+Alt+Digit3', preventDefault: true }],
  relationshipOneN: [{ shortcut: '$mod+Alt+Digit4', preventDefault: true }],
  tableProperties: [{ shortcut: 'Alt+Space', preventDefault: true }],
  focusView: [
    { shortcut: 'Alt+KeyF', preventDefault: true, stopPropagation: true },
  ],
  handTool: [{ shortcut: 'Space', preventDefault: true }],
  zenMode: [
    { shortcut: 'Alt+KeyZ', preventDefault: true, stopPropagation: true },
  ],
};

// example
editor.setKeyBindingMap({
  addTable: [{ shortcut: '$mod+KeyN', preventDefault: true }],
});
```

`selectAllTable`, `handTool`, `removeSelection` eta, `4.1.0` bertsiotik aurrera, `groupSelectedTables` tekla-konbinazioek testu-kurtsoreari lekua uzten diote: fokua input, textarea edo `contenteditable` elementu batean dagoen bitartean, `$mod + A` lasterbideak testua hautatzen du, `Space` teklak zuriune bat idazten du, `Delete` eta `Backspace` teklek testua ezabatzen dute, eta `T` eta ondoren `G` sakatzeak bi letrak idazten ditu, oihalera iritsi beharrean. Sakatze horietako bat ere ez da eragozten. Haiei esleitzen dizkiezun tekla berriek ere berdin jokatzen dute.

`4.0.0` bertsiotik aurrera, `removeSelection` tekla-konbinazioak (`Delete` edo `Backspace`) ERD fitxako hautapena kentzen du desegite-urrats bakar gisa, galdetu gabe. Fokuratutako taula hautatutako gauza bakarra denean, haren zutabe bat edo gehiago hautatuta daudenean eta zoomak haren errenkadak marrazten dituenean, zutabe horiek kentzen ditu; bestela, hautatutako taula, ohar eta taula-talde guztiak kentzen ditu, talde baten taulak mantenduz. Ikus [Taulak eta oharrak ezabatzea](../guide/guides/table-related-functions.md#table-and-memo-deletion).  
Sakatuta mantendutako tekla batek behin bakarrik kentzen du, eta ez da ezer kentzen gelaxka-editore bat, ohar-editore bat edo taula-talde baten izen-editorea irekita dagoen bitartean. Testu-eremu batetik eta tekla-konbinazioei eusten dieten paneletatik kanpo (ikus [createKeyBindingMap](#createkeybindingmap)), sakatzea fitxa guztietan eragozten da editoreak fokua duen bitartean, baita fokuratutako tresna-barrako botoi batean ere, eta irakurtzeko soilik dagoen editore batean, non ez baitu ezer kentzen.

`4.1.0` bertsiotik aurrera, `addTableGroup` tekla-konbinazioak (`Alt+KeyG`) ERD fitxako `New Table Group` marrazketa prest jartzen du, eta oihalean botoi nagusiarekin egiten den hurrengo sakatzeak taldea marrazten du; tekla-konbinazioa berriro sakatzeak marrazketa bertan behera uzten du, oihaleko tresna-barrako `New Table Group` botoiak egiten duen bezala. `groupSelectedTables` tekla-konbinazioak (`KeyT KeyG`, `T` eta ondoren `G`) hautatutako taulak talde berri batean jartzen ditu eta haren izen-editorea irekitzen du, taula baten laster-menuko `Group selected tables` aukerak egiten duen bezala. Taularik hautatuta ez badago, ez du ezer gehitzen; hautatutako ohar edo taula-talde bat ez da kontuan hartzen. Ikus [Talde bat marraztea](../guide/guides/table-groups.md#drawing-a-group) eta [Hautatutako taulak taldekatzea](../guide/guides/table-groups.md#grouping-selected-tables).  
Biek menuek talde bat eskaintzen duten tokian soilik jarduten dute: ez `readonly` ezarrita dagoen bitartean, ez `Table Groups` ikuspegi-aukerak taldeak ezkutatzen dituen bitartean, ez gelaxka-editore bat, ohar-editore bat edo taula-talde baten izen-editorea irekita dagoen bitartean. Oihaleko beste tekla-konbinazioak bezala, ERD fitxan soilik jarduten dute, eta ez Bilaketa azkarra, Taularen propietateak, Diferentzia-ikustailea, Denbora-bidaia, Antolaketa automatikoaren aurrebista, `Export image` edo `Map Columns` irekita dagoen bitartean. Ezer egiten ez duten tokian, sakatzea eragotzi egiten da oraindik, `groupSelectedTables` tekla-konbinazioak testu-kurtsoreari lekua uzten dionean izan ezik. `addTableGroup` tekla-konbinazioaren hedapena ere gelditzen da, `focusView` eta `zenMode` tekla-konbinazioena bezala; beraz, orriaren burbuila-faseko `keydown` entzule batek ez du inoiz entzuten.

`3.10.0` bertsiotik aurrera, `findReplace` tekla-konbinazioak (`$mod+KeyF`) [Bilatu eta ordeztu](../guide/guides/find-and-replace.md) irekitzen du. `4.1.0` bertsiotik aurrera, hura barnean duen [Arakatzailea](../guide/guides/explorer.md#opening-and-closing) ireki edo ixten du, eta Lasterbideak fitxak `Toggle Explorer` gisa zerrendatzen du.  
Tresna-barrako `Explorer` botoia sakatuta ageri den bitartean (Arakatzailea ERD fitxan irekita eta zen moduak ezkutatu gabe), Arakatzailea ixten du, Bilaketa azkarra, Taularen propietateak, gai-sortzailea, Bistaratze-hizkuntzaren hautatzailea, `Export image` elkarrizketa-koadroa edo `Map Columns` irekita badago izan ezik. Bestela, horietatik irekita dagoena ixten du, beste edozein fitxatatik ERD fitxara aldatzen da, eta Arakatzailea irekitzen du, testu-kurtsorea haren `Find` eremuan eta bilaketa-testua hautatuta dituela. Arakatzailea oihalaren ondoan erakusteko estuegia den editore batek irekita baina bazterrean mantentzen du, eta `Widen the window to show the Explorer` jakinarazpena erakusten du. `4.1.0` bertsioa baino lehen, Bilatu eta ordeztu panel flotatzailea irekitzen zuen, edo haren eremuari teklatua itzultzen zion, eta ez zuen inoiz ixten.  
Ez dio testu-kurtsoreari lekua uzten: editoreak fokua duen bitartean, fitxa guztietan hartzen da, oihaletik edo editorearen barruko input elementu batetik. Sakatzea eragotzi egiten da, nabigatzaileak bilaketa-barrarik ireki ez dezan, eta haren hedapena gelditzen da, orriko burbuila-faseko `keydown` entzule batek ere entzun ez dezan. Gelaxka- edo ohar-editore bat irekita dagoenean, edo `4.0.0` bertsiotik aurrera taula-talde baten izen-editorea, oraindik eragotzi egiten da eta haren hedapena gelditzen da, baina ez du ezer egiten.  
Diferentzia-ikustailea, Denbora-bidaia edo Antolaketa automatikoaren aurrebista irekita dagoen bitartean, edozein fitxatan, edo idazketa-metodo bat oraindik konposatzen ari den bitartean, ez da eragozten eta haren hedapena ez da gelditzen; beraz, nabigatzailearen edo ostalariaren bilaketa propioak jasotzen du. Arakatzailearen barruan, oraindik konposatzen ari den sakatze baten hedapena han gelditzen da, eragotzi gabe. `findReplace` tekla-konbinazioari esleitzen diozun edozein teklak berdin jokatzen du.

`focusView` tekla-konbinazioak ERD fitxan soilik jarduten du. Gutxienez taula bat hautatuta dagoenean, Bisualizazioa fitxa irekitzen du Fluxu moduan, taula horietara eta haietatik erlazio bateko distantziara dagoen taula orotara mugatuta; hautatutako ohar edo taula-talde bat ez da kontuan hartzen, eta taularik hautatuta ez badago, ez du ezer egiten. Ikus [Taulak fokuratzea](../guide/guides/visualization.md#focusing-on-tables).

`stop` tekla-konbinazioak (`Escape`) ERD fitxan irekita dagoen gelaxka- edo ohar-editore bat amaitzen du, edo marrazten ari den erlazio bat, eta hautapena dagoen bezala uzten du. `4.0.0` bertsiotik aurrera, taula-talde baten izen-editorea ere amaitzen du, izenik idatzi gabe, eta `New Table Group` marrazketa bat. Editoreak `preventDefault()` metodoari deitzen dio sakatze horretan.  
Horietako bat ere irekita ez dagoenean, `Escape` teklak hautapena eta fokuratutako gelaxka garbitzen ditu, eta ez da eragozten. Beraz, edizio batetik irteteko eta hautapena garbitzeko bi sakatze behar dira.  
Arakatzailea, [ongietorri-pantailako](#enablewelcomescreen) `Import` formatuak eta beheko hautatzaile eta elkarrizketa-koadroak alde batera utzita, editoreak ez du inoiz `Escape` teklaren hedapena gelditzen; beraz, berak entzuten duen orri batek, adibidez bere elkarrizketa-koadro bat ixteko, bi sakatzeak entzuten ditu, eta `defaultPrevented` propietatea `true` duena salta dezake.  
Bilaketa azkarra, Taularen propietateak, Diferentzia-ikustailea, Antolaketa automatikoaren aurrebista edo Denbora-bidaia irekita dagoen bitartean, `Escape` teklak hori ixten du horren ordez, eta hautapena dagoen bezala uzten du. Sakatze hori ere ez da eragozten.  
`4.0.0` bertsiotik aurrera, irekita dagoen [`Export image`](../guide/guides/file-import-export.md#image) edo [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) elkarrizketa-koadro batek ere `Escape` hartzen du: bere burua ixten du eta hautapena dagoen bezala uzten du. Bakoitzak teklatua hartzen du irekitzen denean, eta `Escape` hori eragotzi egiten da eta haren hedapena gelditzen da.  
`4.1.0` bertsiotik aurrera, fokua [Arakatzailearen](../guide/guides/explorer.md#keys-in-the-explorer) barruan dagoela, haren zuhaitzean, eremuetan edo botoietan, sakatutako `Escape` batek teklatua oihalari itzultzen dio, eta Arakatzailea irekita eta hautapena dagoen bezala uzten ditu. Editoreak `preventDefault()` eta `stopPropagation()` metodoei deitzen die haren gainean; beraz, ez da inoiz iristen orriaren burbuila-faseko `keydown` entzule batera.  
Oihaleko `Escape` batek ez du inoiz Arakatzailea ixten. `4.1.0` bertsioa baino lehen, Bilatu eta ordeztu panelaren barruko `Escape` batek panela ixten zuen, eta oihaleko batek hautapena garbitzen zuen sakatze berean ixten zuen.  
`4.0.0` bertsiotik aurrera, Bistaratze-hizkuntzaren hautatzailea eta kolore-hautatzailea `Escape` sakatzean ixten dira: haien barruan eragotzi egiten da eta haren hedapena gelditzen da, eta oihalean, hautapena garbitzen duen sakatze berean ixten dira, ez eragotzita, ez hedapena geldituta.  
Idazketa-metodo bat oraindik konposatzen ari den bitartean sakatutako `Escape` bat konposizioari dagokio. Irekita dagoen editore bat dagoen bezala uzten du, eta ez da eragozten; beraz, orri batek `isComposing` propietatea `true` duen edo `keyCode` propietatea `229` duen sakatze bat ere salta dezake. Arakatzailearen barruan, horrelako sakatze baten hedapena ere gelditzen da, han konposizio erdian sakatutako edozein teklarena bezala, eta teklatua eremuan geratzen da.  
`3.9.2` bertsioa baino lehen, `Escape` sakatze bakar batek edizio edo marrazketa bat amaitzen zuen eta hautapena garbitzen zuen, eta editoreak ez zuen inoiz eragozten.

### createKeyBindingMap {#createkeybindingmap}

`3.9.2` bertsiotik aurrera, paketeak `createKeyBindingMap()` esportatzen du, eta harekin batera `KeyBindingMap`, `KeyBindingName` eta `ShortcutOption` motak.  
Tekla-konbinazio lehenetsiak itzultzen ditu, 28 izenak, finkoak barne, mapa berri gisa dei bakoitzean; beraz, itzultzen duen mapa aldatzeak ez du beste ezer aldatzen.  
Editore guztiak horretatik abiatzen dira, eta `setKeyBindingMap` dei bat ez da bertan islatzen.  
`createKeyBindingMap` da exekuzio-garaiko esportazio bakarra; beste hirurak motak dira.

```ts
type KeyBindingName =
  | 'edit'
  | 'stop'
  | 'search'
  | 'findReplace'
  | 'undo'
  | 'redo'
  | 'addTable'
  | 'addColumn'
  | 'addMemo'
  | 'addTableGroup'
  | 'groupSelectedTables'
  | 'removeTable'
  | 'removeColumn'
  | 'removeSelection'
  | 'primaryKey'
  | 'selectAllTable'
  | 'selectAllColumn'
  | 'relationshipZeroOne'
  | 'relationshipZeroN'
  | 'relationshipOneOnly'
  | 'relationshipOneN'
  | 'tableProperties'
  | 'focusView'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
  | 'handTool'
  | 'zenMode';

type KeyBindingMap = Record<KeyBindingName, ShortcutOption[]>;

declare function createKeyBindingMap(): KeyBindingMap;

// example
import { createKeyBindingMap } from '@dineug/erd-editor';

const shortcuts = Object.values(createKeyBindingMap())
  .flat()
  .map(({ shortcut }) => shortcut); // 'Enter', 'Escape', '$mod+KeyK', ...
```

`shortcut` bakoitza [tinykeys](https://github.com/jamiebuilds/tinykeys) sintaxiko lasterbide bat da, tekla `KeyboardEvent.code` bidez izendatzen duena; [`$mod`](#mod) `⌘` da macOS sisteman, eta `Control` gainerakoetan.  
`4.0.0` bertsiotik aurrera, editoreak berak irakurtzen ditu lasterbide horiek, tinykeys bidez egin beharrean, sintaxi berean. Tekla bat bat dator bere `code` balioagatik edo bere `key` balioagatik, maiuskulak eta minuskulak bereizi gabe, eta sakatze bat izendatzen dituen tekla aldatzaileak, eta horiek bakarrik, sakatuta daudenean soilik dator bat. `AltGraph` `Control` eta `Alt` gisa hartzen da Windows sisteman, eta `Alt` gisa macOS sisteman. Zuriune batez bereizitako sakatzeek sekuentzia bat osatzen dute, eta sekuentzia berriz hasten da keydown gertaerarik gabe segundo bat igarotzen denean.  
`4.1.0` bertsiotik aurrera, balio lehenetsietako bat sekuentzia bat da: `groupSelectedTables` `KeyT KeyG` da, `T` eta ondoren `G`. Sekuentzia bat hura osatzen duen sakatzean exekutatzen da, eta sakatze horrek soilik hartzen ditu haren `preventDefault` eta `stopPropagation`; beraz, balio lehenetsiekin `T` orrira iristen da, eta `G` soilik eragozten da. Menuek, Bilaketa azkarrak eta Lasterbideak fitxak sekuentzia bat sakatze bakoitzeko tekla bat erakutsiz bistaratzen dute.  
Izen finkoak honela lotuta daude: `Enter` (`edit`), `Escape` (`stop`), `$mod+KeyZ` (`undo`), `$mod+Shift+KeyZ` (`redo`), `$mod+Equal` (`zoomIn`), `$mod+Minus` (`zoomOut`) eta `$mod+Digit0` (`zoomReset`). `edit` eta `stop` izenek ez dute markarik; beste bostek `preventDefault` eta `stopPropagation` dituzte. Gainerakoak goiko balio lehenetsiak dira, `search` eta `findReplace` haien artean.

Editoreak bere elementuan entzuten ditu hauek; beraz, editoreak baino lehen teklak hartzen dituen ostalari batek, lasterbide globalekin edo kaptura-faseko `keydown` entzule batekin, igarotzen utzi behar ditu editoreak fokua duen bitartean.  
Eraiki igarotzen utzi beharreko zerrenda `createKeyBindingMap()` funtziotik abiatuta, `setKeyBindingMap` metodoari pasatu dizkiozun tekla-konbinazioak lehenetsien ordez jarrita.  
`3.10.0` bertsiotik aurrera, zerrenda horrek `$mod+KeyF` barne hartzen du, nabigatzailearen beraren bilaketa-lasterbidea. Lasterbide horretan bere bilaketa mantendu nahi duen ostalari batek `setKeyBindingMap({ findReplace: [] })` pasatzen du.  
`4.0.0` bertsiotik aurrera, `Delete` eta `Backspace` soilak ere barne hartzen ditu. Tekla horiek mantendu nahi dituen ostalari batek `setKeyBindingMap({ removeSelection: [] })` pasatzen du.  
`4.1.0` bertsiotik aurrera, `Alt+KeyG` eta `KeyT KeyG` sekuentzia ere barne hartzen ditu, eta azken hori kate bakar gisa dator: zatitu zuriunean eta utzi sakatze bakoitza igarotzen, `T` eta `G` soilak barne, sakatze bat falta zaion sekuentzia ez baita inoiz osatzen. Tekla horiek mantendu nahi dituen ostalari batek `setKeyBindingMap({ addTableGroup: [] })` edo `setKeyBindingMap({ groupSelectedTables: [] })` pasatzen du.

Fokua Arakatzailearen barruan dagoen bitartean, haren zuhaitzean, `Find` eta `Replace` eremuetan edo botoietan, `findReplace`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut` eta `zoomReset` editorera igarotzen dira; beraz, `findReplace` tekla-konbinazioak han oihalean bezala jarduten du. Beste tekla-konbinazio guztiak, unean ezarrita dauden bezala, Arakatzailean gelditzen dira, sekuentzia bat bere azken sakatzean (`G` soil bat balio lehenetsiekin), eta gauza bera gertatzen da gezi-teklekin, `Tab`, `Enter`, `Space`, `Home` eta `End` teklekin, eta idazketa-metodo bat oraindik konposatzen ari den bitartean sakatutako edozein teklarekin. `Escape` alde batera utzita, teklatua oihalari itzultzen baitio, horien hedapena gelditzen da eragotzi gabe; beraz, tekla arrunt gisa jarduten dute Arakatzailearen eremuetan, botoietan eta zuhaitzean, eta ez dira iristen ez oihalera, ez orriaren burbuila-faseko `keydown` entzule batera: han `Alt + N` lasterbideak ez du taularik gehitzen, eta `Delete` teklak ez du ezer kentzen. Zuhaitzean mugitzeko, tolesteko edo zuhaitzeko errenkada batera joateko teklak, eta `Find` edo `Replace` eremuko `Enter`, bat-etortzeen artean mugitzen dena edo ordezten duena, eragotzi ere egiten dira.  
Beste edozein tekla, hala nola ostalari baten gordetzeko edo komando-paletako lasterbidea, orrira doa ohi bezala. Ikus [Arakatzaileko teklak](../guide/guides/explorer.md#keys-in-the-explorer). `4.1.0` bertsioa baino lehen, Bilatu eta ordeztu panel flotatzaileak teklak modu berean atxikitzen zituen, `Home`, `End`, sekuentzia baten azken sakatzea eta `Space`, `handTool` beste tekla bati lotuta zegoen bitartean, izan ezik.  
`4.0.0` bertsiotik aurrera, Bistaratze-hizkuntzaren hautatzaileak teklak modu berean atxikitzen ditu: zazpi tekla-konbinazio berak igarotzen dira, eta beste tekla-konbinazio guztien (`4.1.0` bertsiotik aurrera, sekuentzia bat bere azken sakatzean), gezi-teklen eta `Tab` teklaren hedapena han gelditzen da eragotzi gabe, baita idazketa-metodo bat oraindik konposatzen ari den bitartean sakatutako edozein teklarena ere. Haren errenkadetako batean, `↑`, `↓`, `Home`, `End`, `Enter` eta `Space` teklekin errenkaden artean mugitzen da edo bat aukeratzen da, eta tekla horiek eragotzi ere egiten dira.

### $mod {#mod}

`Control` tekla ingurunearen arabera aldatzen du.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Lasterbideen taula {#shortcut-table}

Teklatu-gertaeren `key, code` propietateak erabiltzen ditu.  
Erabili `code` posizio absolutuetarako eta `key` sarrera-balioetarako.

| Windows            | macOS              | `key`              | `code`                         |
| ------------------ | ------------------ | ------------------ | ------------------------------ |
| Ez dago            | `Command` / `⌘`    | `Meta`             | `MetaLeft` / `MetaRight`       |
| `Alt`              | `Option` / `⌥`     | `Alt`              | `AltLeft` / `AltRight`         |
| `Control`          | `Control` / `^`    | `Control`          | `ControlLeft` / `ControlRight` |
| `Shift`            | `Shift`            | `Shift`            | `ShiftLeft` / `ShiftRight`     |
| `Space`            | `Space`            | Ez dago            | `Space`                        |
| `Enter`            | `Return`           | `Enter`            | `Enter`                        |
| `Esc`              | `Esc`              | `Escape`           | `Escape`                       |
| `Backspace`        | `Delete` / `⌫`     | `Backspace`        | `Backspace`                    |
| `Delete`           | `fn` + `Delete`    | `Delete`           | `Delete`                       |
| `1`, `2`, eta abar | `1`, `2`, eta abar | `1`, `2`, eta abar | `Digit1`, `Digit2`, eta abar   |
| `a`, `b`, eta abar | `a`, `b`, eta abar | `a`, `b`, eta abar | `KeyA`, `KeyB`, eta abar       |
| `-`                | `-`                | `-`                | `Minus`                        |
| `=`                | `=`                | `=`                | `Equal`                        |
| `+`                | `+`                | `+`                | `Equal`                        |

## Gaia {#theme}

### setPresetTheme {#setpresettheme}

Gai aurrezarri bat ezartzen du.  
Balio lehenetsiak `appearance: 'dark'`, `grayColor: 'slate'` eta `accentColor: 'indigo'` dira.  
Eremu bakoitza bere aldetik aplikatzen da; beraz, dei partzial batek beste biak dauden bezala uzten ditu. Beheko izenetako bat ez den balio bat ez da kontuan hartzen, eta deiak ez du inoiz errorerik jaurtitzen.  
`4.0.0` bertsiotik aurrera, `appearance` propietateak `'system'` ere onartzen du, gai-sortzaileko `System` aukera. Sistema eragileak jakinarazten duen itxura argia edo iluna erakusten du, edo [setSystemAppearance](#setsystemappearance) metodoak izendatzen duena, eta hura aldatzen denean aldatu egiten da.

```ts
type ThemeOptions = {
  appearance: 'dark' | 'light' | 'system';
  grayColor: 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';
  accentColor:
    | 'gray'
    | 'gold'
    | 'bronze'
    | 'brown'
    | 'yellow'
    | 'amber'
    | 'orange'
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'lime'
    | 'mint'
    | 'sky';
};

// example
editor.setPresetTheme({ appearance: 'light' });
```

### setSystemAppearance {#setsystemappearance}

`4.0.0` bertsiotik aurrera, `'system'` itxurak erakusten duen argia edo iluna izendatzen du, itxura argi eta ilun propioak dituen ostalari baterako, hala nola IDE baten gaia. Bat izendatuta dagoen bitartean, sistema eragilearen aldaketak ez dira kontuan hartzen.  
`null`, edo `'dark'` edo `'light'` ez den beste edozein balio, sistema eragileari jarraitzera itzultzen da.  
Itxura `'light'` edo `'dark'` den bitartean, ez du ezer aldatzen pantailan, baina balioa gordetzen da eta itxura `'system'` bihurtu bezain laster aplikatzen da. Bestela, berehala aplikatzen da. Ez du ezer igortzen, eta `changePresetTheme` gertaerak `'system'` jakinarazten jarraitzen du.  
VS Code, JetBrains eta Obsidian ostalariek metodo honi deitzen diote beren itxura argi edo ilunarekin, eta berriro hura aldatzen den bakoitzean.

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme {#settheme}

Gaia pertsonalizatzeko aukera ematen du.  
Dei bakoitzak geruza pertsonalizatu osoa ordezten du; beraz, lehendik dagoen gainidazketa baten gainean token bakar bat aldatzeko, pasatu objektu osoa berriro, eta pasatu `{}` gai aurrezarrira itzultzeko.  
Beheko token-izenak soilik gordetzen dira, kate-balioekin; beste edozer baztertu egiten da, errorerik gabe.  
Geruza gai aurrezarriaren gainean dago; beraz, geroagoko `setPresetTheme` dei batek azpiko gai aurrezarria aldatzen du, eta zure gainidazketek bere horretan jarraitzen dute.

#### JavaScript {#javascript}

```ts
type Theme = {
  grayColor1: string;
  grayColor2: string;
  grayColor3: string;
  grayColor4: string;
  grayColor5: string;
  grayColor6: string;
  grayColor7: string;
  grayColor8: string;
  grayColor9: string;
  grayColor10: string;
  grayColor11: string;
  grayColor12: string;

  accentColor1: string;
  accentColor2: string;
  accentColor3: string;
  accentColor4: string;
  accentColor5: string;
  accentColor6: string;
  accentColor7: string;
  accentColor8: string;
  accentColor9: string;
  accentColor10: string;
  accentColor11: string;
  accentColor12: string;

  canvasBackground: string;
  canvasBoundaryBackground: string;

  tableBackground: string;
  tableHeaderBackground: string;
  tableSelect: string;
  tableBorder: string;
  tableShadow: string;

  tableGroupHeaderBackground: string;
  tableGroupBackground: string;
  tableGroupBorder: string;

  memoBackground: string;
  memoSelect: string;
  memoBorder: string;
  memoShadow: string;

  columnSelect: string;
  columnSelectHover: string;
  columnHover: string;

  relationshipHover: string;

  visualizationLink: string;
  visualizationColumn: string;
  visualizationRelationship: string;

  toolbarBackground: string;

  contextMenuBackground: string;
  contextMenuSelect: string;
  contextMenuHover: string;
  contextMenuBorder: string;

  minimapBorder: string;
  minimapShadow: string;
  minimapViewportBorder: string;
  minimapViewportBorderHover: string;

  toastBackground: string;
  toastBorder: string;
  toastSuccess: string;
  toastError: string;

  findReplaceError: string;

  mapColumnsError: string;

  schemaSqlWarningBackground: string;
  schemaSqlWarningForeground: string;

  dragSelectBackground: string;
  dragSelectBorder: string;

  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;

  foreground: string;
  active: string;
  placeholder: string;

  focus: string;
  inputActive: string;

  keyPK: string;
  keyFK: string;
  keyPFK: string;

  treeBackground: string;
  treeRowHover: string;
  treeRowCurrent: string;
  treeMuted: string;
  treeMatch: string;

  explorerBackground: string;
  explorerBorder: string;

  diffInsertForeground: string;
  diffDeleteForeground: string;
  diffModifyForeground: string;
  diffRenameForeground: string;
};

// example
editor.setTheme({
  canvasBackground: '#1b1b1f',
  tableBackground: '#242429',
  keyPK: '#ffc53d',
});
```

`tableShadow` eta `memoShadow` taulek eta oharrek ERD oihalean egiten duten itzalaren kolorea dira. Gai aurrezarri ilunak `transparent` balioan uzten ditu, eta horrek ez du itzalik egiten, `setTheme` metodoari `none` edo kate huts bat pasatzeak bezala; gai aurrezarri argiak `rgba(0, 0, 0, 0.18)` erabiltzen du.

`4.0.0` bertsiotik aurrera, beste bederatzi token daude:

- `tableGroupHeaderBackground`, `tableGroupBackground` eta `tableGroupBorder` tokenek kolore propiorik ez duen [taula-talde](../guide/guides/table-groups.md) baten titulu-barra, gorputza eta ingerada koloreztatzen dituzte.
- `toastSuccess` eta `toastError` tokenek zerbait nola amaitu den jakinarazten duen jakinarazpen baten marka koloreztatzen dute.
- `findReplaceError` eta `mapColumnsError` tokenek Bilatu eta ordeztu funtzioak eta Mapatu zutabeak elkarrizketa-koadroak erakusten dituzten erroreak koloreztatzen dituzte. Bilatu eta ordeztu funtzioak `diffDeleteForeground` erabiltzen zuen lehen; beraz, token hori gainidazteak jada ez du Bilatu eta ordeztu funtzioaren kolorea aldatzen.
- `schemaSqlWarningBackground` eta `schemaSqlWarningForeground` tokenek SQL eskema fitxako aukeretako abisuak koloreztatzen dituzte.

`4.1.0` bertsiotik aurrera, beste bederatzi token daude:

- `treeBackground`, `treeRowHover`, `treeRowCurrent`, `treeMuted` eta `treeMatch` tokenek [Arakatzaileak](../guide/guides/explorer.md#the-tree) eta [Diferentzia-ikustaileak](../guide/guides/table-related-functions.md#diff-viewer) partekatzen duten zuhaitza koloreztatzen dute: haren atzeko planoa, Arakatzailearen `Find` eta `Replace` eremuak ere betetzen dituena; erakuslearen azpiko errenkada bat, teklatuaren errenkada zuhaitzak fokua duen bitartean, eta Arakatzailearen goiburuko eta bilaketako erakuslearen azpiko botoi bat; uneko bilaketaren bat-etortzearen errenkada; testu lausotua, hala nola kopuruak, datu motak eta tolesteko geziak; eta bilaketa batek aurkitutako testuaren atzeko marka.
- `explorerBackground` eta `explorerBorder` tokenek Arakatzailearen panela eta haren marrak koloreztatzen dituzte: oihalaren ondoko ertza, bilaketaren azpiko marra, eta haren eremuen eta `Search In` aukerak zabaltzen dituen botoien ertzak. `explorerBorder` tokenak Diferentzia-ikustailearen zuhaitzaren ertza, haren `Filter by name` eremuaren azpiko marra eta eremu horren ertza ere marrazten ditu. Arakatzailearen gako-ikonoek `keyPK`, `keyFK` eta `keyPFK` hartzen dituzte.
- `diffModifyForeground` eta `diffRenameForeground` tokenek Diferentzia-ikustaileak aldatutzat eta izena aldatutzat markatzen duena koloreztatzen dute, haren zuhaitzean eta bi dokumentuetan. `diffModifyForeground` tokenak mugitu, tamainaz aldatu, kolorez aldatu edo taldez aldatu den taula, ohar edo taula-talde baten ingerada ere marrazten du, bertan beste zer aldatu den gorabehera, eta aldatu den gako arrotz baten konektorea marrazten du.

`diffInsertForeground` eta `diffDeleteForeground` tokenek, orain, Diferentzia-ikustaileak gehitutzat eta kendutzat markatzen duena koloreztatzen dute, haren zuhaitzean eta hura duen dokumentuan, testuan, ingeradetan eta konektoreetan berdin. `diffInsertBackground`, `diffDeleteBackground`, `diffCrossBackground` eta `diffCrossForeground` `4.1.0` bertsioan kendu ziren, Diferentzia-ikustaileak jada ez baititu gelaxkak betetzen. `setTheme` metodoak baztertu egiten ditu, `Theme` motan ez dagoen beste edozein izen bezala, eta haien kakoak, `--erd-editor-diff-insert-background`, `--erd-editor-diff-delete-background`, `--erd-editor-diff-cross-background` eta `--erd-editor-diff-cross-foreground`, jada ez dira irakurtzen.

#### CSS aldagaiak {#css-variables}

`Theme` motako token bakoitzak bat datorren CSS kako bat du, `--erd-editor-` gehi kebab-case formatuko gakoa izenekoa: `grayColor10` `--erd-editor-gray-color-10` da, `keyPK` `--erd-editor-key-pk` da, eta `keyPFK` `--erd-editor-key-pfk` da.  
Kakoak editorearen barrura heredatzen dira; beraz, ezarri aplikatzea nahi duzun tokian. `:root` hautatzailean, orriko editore guztiei aplikatzen diete gaia; elementuan bertan, horri bakarrik.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

`3.4.0` bertsiotik aurrera, gaizki idatzitako `dargSelect` tokenak `dragSelect` idazten dira, eta haien kakoak `--erd-editor-darg-select-background` eta `--erd-editor-darg-select-border` izatetik `--erd-editor-drag-select-background` eta `--erd-editor-drag-select-border` izatera aldatu ziren. Izen zaharrak oraindik erabiltzen dituen estilo-orri bat ez da kontuan hartzen.

<details>
<summary>Gaiaren balio lehenetsiak</summary>

```css
:root {
  --erd-editor-gray-color-1: #111113;
  --erd-editor-gray-color-2: #18191b;
  --erd-editor-gray-color-3: #212225;
  --erd-editor-gray-color-4: #272a2d;
  --erd-editor-gray-color-5: #2e3135;
  --erd-editor-gray-color-6: #363a3f;
  --erd-editor-gray-color-7: #43484e;
  --erd-editor-gray-color-8: #5a6169;
  --erd-editor-gray-color-9: #696e77;
  --erd-editor-gray-color-10: #777b84;
  --erd-editor-gray-color-11: #b0b4ba;
  --erd-editor-gray-color-12: #edeef0;
  --erd-editor-accent-color-1: #11131f;
  --erd-editor-accent-color-2: #141726;
  --erd-editor-accent-color-3: #182449;
  --erd-editor-accent-color-4: #1d2e62;
  --erd-editor-accent-color-5: #253974;
  --erd-editor-accent-color-6: #304384;
  --erd-editor-accent-color-7: #3a4f97;
  --erd-editor-accent-color-8: #435db1;
  --erd-editor-accent-color-9: #3e63dd;
  --erd-editor-accent-color-10: #5472e4;
  --erd-editor-accent-color-11: #9eb1ff;
  --erd-editor-accent-color-12: #d6e1ff;
  --erd-editor-canvas-background: #212225;
  --erd-editor-canvas-boundary-background: #111113;
  --erd-editor-table-background: #18191b;
  --erd-editor-table-header-background: #2e3135;
  --erd-editor-table-select: #435db1;
  --erd-editor-table-border: #363a3f;
  --erd-editor-table-shadow: transparent;
  --erd-editor-table-group-header-background: #43484e;
  --erd-editor-table-group-background: #d3edf81d;
  --erd-editor-table-group-border: #43484e;
  --erd-editor-memo-background: #18191b;
  --erd-editor-memo-select: #435db1;
  --erd-editor-memo-border: #363a3f;
  --erd-editor-memo-shadow: transparent;
  --erd-editor-column-select: #182449;
  --erd-editor-column-select-hover: #1d2e62;
  --erd-editor-column-hover: #272a2d;
  --erd-editor-relationship-hover: #435db1;
  --erd-editor-visualization-link: #43484e;
  --erd-editor-visualization-column: #5a6169;
  --erd-editor-visualization-relationship: #5a6169;
  --erd-editor-toolbar-background: #111113;
  --erd-editor-context-menu-background: #18191b;
  --erd-editor-context-menu-select: #272a2d;
  --erd-editor-context-menu-hover: #3a4f97;
  --erd-editor-context-menu-border: #363a3f;
  --erd-editor-minimap-border: black;
  --erd-editor-minimap-shadow: black;
  --erd-editor-minimap-viewport-border: #3a4f97;
  --erd-editor-minimap-viewport-border-hover: #435db1;
  --erd-editor-toast-background: #18191b;
  --erd-editor-toast-border: #363a3f;
  --erd-editor-toast-success: #3dd68c;
  --erd-editor-toast-error: #ff9592;
  --erd-editor-find-replace-error: #ff9592;
  --erd-editor-map-columns-error: #ff9592;
  --erd-editor-schema-sql-warning-background: #500f1c;
  --erd-editor-schema-sql-warning-foreground: #ff9592;
  --erd-editor-drag-select-background: #253974;
  --erd-editor-drag-select-border: #435db1;
  --erd-editor-scrollbar-track: #ddeaf814;
  --erd-editor-scrollbar-thumb: #696e77;
  --erd-editor-scrollbar-thumb-hover: #777b84;
  --erd-editor-foreground: #b0b4ba;
  --erd-editor-active: #edeef0;
  --erd-editor-placeholder: #e5edfd7b;
  --erd-editor-focus: #435db1;
  --erd-editor-input-active: #5472e4;
  --erd-editor-key-pk: #ffc53d;
  --erd-editor-key-fk: #e54666;
  --erd-editor-key-pfk: #00a2c7;
  --erd-editor-tree-background: #111113;
  --erd-editor-tree-row-hover: #212225;
  --erd-editor-tree-row-current: #1d2e62;
  --erd-editor-tree-muted: #b0b4ba;
  --erd-editor-tree-match: #253974;
  --erd-editor-explorer-background: #111113;
  --erd-editor-explorer-border: #363a3f;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-modify-foreground: #ffca16;
  --erd-editor-diff-rename-foreground: #70b8ff;
}
```

</details>

## Bistaratze-hizkuntza {#display-language}

`4.0.0` bertsiotik aurrera, editorearen testu propioa — haren menuak, panelak, elkarrizketa-koadroak, Bilaketa azkarra, jakinarazpenak eta diagraman marrazten dituen hitzak, hala nola `unnamed`, irudi-esportazioak barne — 25 hizkuntzatan dago. Taulen eta zutabeen izenak, SQLa, datu motak eta sortutako kodea ez dira inoiz itzultzen. Ikus [Hizkuntza eta gaia](../guide/guides/language-and-theme.md).  
[setLocale](#setlocale) metodoari deitu edo hizkuntza bat aukeratu aurretik, editoreak ingelesa erakusten du, edo `'system'` balioari jarraitzen dio [enableLocalePicker](#enablelocalepicker) aktibatuta dagoen bitartean.  
Editoreak `lang` eta `dir` bere erroan ezartzen ditu, shadow root itxiaren barruan, inoiz ez elementu ostalarian edo orrian; beraz, eskuinetik ezkerrera doan orri batek ez du editorea iraultzen, eta eskuinetik ezkerrera idazten den hizkuntza batek ez du orria iraultzen. Hebreerak, arabierak eta persierak editorearen interfazea eskuinetik ezkerrera antolatzen dute; diagrama bera ez da inoiz ispilatzen. `4.1.0` bertsiotik aurrera, [Arakatzailea](../guide/guides/explorer.md) oihalaren ezkerrean geratzen da hizkuntza guztietan, eta haren errenkadak eskuinetik ezkerrera irakurtzen dira hiru horietan.  
Paketeak `LocaleCode` (beheko kodeetako bat) eta `LocaleOption` motak esportatzen ditu.

```ts
type LocaleOption = LocaleCode | 'system';
```

| Kodea   | Honela ageri da      | Hizkuntza             |
| ------- | -------------------- | --------------------- |
| `id-ID` | Bahasa Indonesia     | Indonesiera           |
| `de-DE` | Deutsch              | Alemana               |
| `en`    | English              | Ingelesa              |
| `es-ES` | Español              | Gaztelania            |
| `eu-ES` | Euskara              | Euskara               |
| `fr-FR` | Français             | Frantsesa             |
| `it-IT` | Italiano             | Italiera              |
| `nl-NL` | Nederlands           | Nederlandera          |
| `pl-PL` | Polski               | Poloniera             |
| `pt-PT` | Português            | Portugesa             |
| `pt-BR` | Português Brasileiro | Brasilgo portugesa    |
| `ro-RO` | Română               | Errumaniera           |
| `sk-SK` | Slovenčina           | Eslovakiera           |
| `sl-SI` | Slovenščina          | Esloveniera           |
| `sv-SE` | Svenska              | Suediera              |
| `tr-TR` | Türkçe               | Turkiera              |
| `ru-RU` | Русский              | Errusiera             |
| `uk-UA` | Українська           | Ukrainera             |
| `he-IL` | עברית                | Hebreera              |
| `ar-SA` | العربية              | Arabiera              |
| `fa-IR` | فارسی                | Persiera              |
| `ja-JP` | 日本語               | Japoniera             |
| `zh-CN` | 简体中文             | Txinera sinplifikatua |
| `zh-TW` | 繁體中文             | Txinera tradizionala  |
| `ko-KR` | 한국어               | Koreera               |

### setLocale {#setlocale}

Bistaratze-hizkuntza ezartzen du: `'system'`, edo goiko kodeetako bat. Beste edozer, hala nola `'ko'` soil bat, kode ezezagun bat edo kate ez den balio bat, ez da kontuan hartzen, errorerik gabe.  
Metodoak itzuli aurretik aplikatzen da; beraz, elementua erantsi aurretik ezarritako hizkuntza haren lehen fotograman ageri da.  
Ez du ezer igortzen, ez `changeLocale` ez `change`, eta ez du ukitzen ez `value`, ez desegite-historia, ez biltegi partekatu bat.  
Aukerak bere horretan jarraitzen du `enableLocalePicker` aktibatuta zein desaktibatuta egon, eta `setLocale('system')` deiak sistemari jarraitzen dio hautatzailea desaktibatuta dagoenean ere.  
Editoreak ez du ezer gordetzen. Irakurle baten aukera mantentzeko, entzun [changeLocale](#changelocale) gertaera eta pasatu berriro hurrengo kargan.

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale {#setsystemlocale}

`'system'` aukerak adierazten duen hizkuntza izendatzen du, BCP 47 etiketa gisa, bistaratze-hizkuntza propioa duen ostalari baterako. VS Code, JetBrains eta Obsidian ostalariek metodo honi deitzen diote beren bistaratze-hizkuntzarekin.  
Etiketaren hasierako eta amaierako zuriuneak kentzen dira. `null`, kate huts bat edo kate ez den balio bat nabigatzailearen `navigator.languages` propietatera itzultzen da, eta editoreak hari jarraitzen dio aldatzen den heinean.  
Indarrean dagoen aukera `'system'` den bitartean soilik du eragina, eta berehala aplikatzen da. Hautatzailearen `System` errenkadak zein hizkuntzatara ebazten den izendatzen du.  
Etiketa, edo nabigatzailearen hizkuntza bakoitza ordenan, editoreak duen lehen hizkuntzara ebazten da, hizkuntza-azpietiketaren arabera, maiuskulak eta minuskulak eta azpimarrak kontuan hartu gabe: `de-AT` etiketak `de-DE` ematen du, eta `en-GB` etiketak `en`. Txinera bere idazketa-sistemaren arabera ebazten da, `Hant` idazketa-sistemak `zh-TW` eta `Hans` idazketa-sistemak `zh-CN` emanez, eta idazketa-sistemarik gabe, eskualdearen arabera: `TW`, `HK` eta `MO` eskualdeek `zh-TW` ematen dute, eta beste edozeinek `zh-CN`. `pt` etiketak `pt-BR` ematen du, `BR` ez den beste eskualde bat izendatzen ez bada. Ezer bat ez datorrenean, editoreak ingelesa erakusten du.

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL {#setschemasql}

SQL eskema fitxategi bat kargatzen du.  
Lehenespenez, uneko dokumentua ordezten du, harekin bateratu beharrean; ikus beheko `mode` aukera. Dituzun ezarpenak mantentzen dira, blokeo bakoitza eta haren balio blokeatua barne, ikuspegiaren kokapena eta zoom-maila izan ezik, eta taulak fitxategia irakurri ondoren kokatzen dira, errenkadetan, beheko `placement` aukerak bestela eskatzen ez badu. `Viewport` blokeatuta dagoenean, `value` balioak inportazioa hasten den ikuspegia idazten du ondoren: `0, 0` jatorria `1` zoom-mailan. Beraz, inoiz baliorik jaso ez duen elementu batera inportatutako dokumentu batek blokeo guztiak aktibatuta ditu, dokumentu berri batek bezala.  
Historia-zerrendan erregistratzen da, `Undo, Redo` ahalbidetuz, eta `change` igortzen du. Kate huts bat ez da kontuan hartzen, eta deiak ez du ezer egiten `readonly` ezarrita dagoen bitartean.  
`setSchemaGraphQL`, `setSchemaDBML` eta `setSchemaAML` metodoek modu berean jokatzen dute, eta haien analizatzaileek ez dute inoiz huts egiten: irakurri ezin duten testuak dokumentu huts bat kargatzen du errorerik sortu beharrean.  
`4.0.0` bertsiotik aurrera, laurek aukerako bigarren argumentu bat onartzen dute, `{ placement, mode }`:

- `placement: 'grid'` balio lehenetsiak taulak berehala jartzen ditu errenkadetan, lehen bezala, eta deiak ez du ezer itzultzen.
- `placement: 'auto'` balioak lehenik taulak haien erlazioen arabera antolatzen ditu, editoreko `Import` aukerak egiten duen bezala, eta inportazioa desegite-urrats bakar gisa kokatu ondoren ebazten den `Promise` bat itzultzen du. Bi taula baino gutxiago izateak, erlaziorik ez izateak, antolaketak huts egiteak, orriak `SharedWorker` ez izateak edo `Placing tables` jakinarazpeneko `Cancel` sakatzeak taulak errenkadetan kokatzen ditu horren ordez. Bitartean egindako karga batek — beste inportazio ordezkatzaile bat, `value` esleitzea, `setInitialValue()`, `clear()`, lankide baten karga, edo karga baten edo `clear()` deiaren desegite edo berregite bat — baliogabetzen du, eta `Promise` objektua ezer kargatu gabe ebazten da. Modu honetan kokatutako inportazioak hasi ziren ordenan kokatzen dira.
- `mode: 'replace'` balio lehenetsiak dokumentua ordezten du. `mode: 'append'` balioak fitxategia diagramaren azpian gehitzen du, [Inportatu eta gehitu](../guide/guides/file-import-export.md#import-and-add) aukerak egiten duen bezala, lehendik dagoen taula oro dagoen bezala utziz, baita ezarpen guztiak ere, fitxa eta ikuspegiaren kokapena izan ezik. Beste fitxa batean bada, ERD fitxa agertzen da lehenik. Taula berriak, eta DBML fitxategi batek dakartzan taula-taldeak, taula-taldeak erakusten diren bitartean, hautapena bihurtzen dira, eta ikuspegia haietara korritzen da, dagoeneko ondo ikusten ez badira, `4.1.0` bertsiotik aurrera jauzi orok jarraitzen dion arauaren arabera. Ikus [Jauziaren helmuga](../guide/guides/table-related-functions.md#where-a-jump-lands). Desegite bakar batek gehikuntza osoa kentzen du. Irakurri ezin duen testuak ez du ezer gehitzen, eta dokumentua dagoen bezala uzten du.

`readonly` ezarrita dagoen bitartean, ordezte bat ez da kontuan hartzen, gehitze batek ez du ezer gehitzen, eta `placement: 'auto'` dei bat berehala ebazten da.  
`3.10.0` bertsiotik aurrera, `setSchemaSQL` metodoak fitxategia dokumentuaren uneko datu-baserako irakurtzen du: Databricks hautatuta dagoenean, komatxo bakunen arteko kateek Sparken alderantzizko barrako ihes-sekuentziei jarraitzen diete. Ikus [Iruzkinak](../guide/guides/file-import-export.md#comments).  
`3.10.0` bertsiotik aurrera, `setSchemaSQL` metodoak bi zutabe edo gehiagoren gaineko `UNIQUE` bat indize bakar bat bezala irakurtzen du, zutabe bakoitza bakar gisa markatu beharrean. Ikus [Gako bakarrak eta indizeak](../guide/guides/file-import-export.md#unique-keys-and-indexes).  
`3.10.0` bertsiotik aurrera, SQL, DBML eta AML inportazioek irakurtzen dituzten gako arrotzen `ON DELETE` eta `ON UPDATE` ekintzak mantentzen dituzte.  
`4.0.0` bertsiotik aurrera, `setSchemaSQL` metodoak zutabe baten `DEFAULT` adierazpen osoa mantentzen du, SQL Serverren `ADD DEFAULT … FOR` eta haren `MS_Description` iruzkinak irakurtzen ditu, PostgreSQLen serial eta identity zutabeak gehikuntza automatikoko zutabe bihurtzen ditu, `UNSIGNED` eta `ZEROFILL` datu motan mantentzen ditu, eta `ALTER TABLE … ADD PRIMARY KEY` sententziak `CLUSTERED`, `NONCLUSTERED` edo `USING BTREE` gisa markatzen duen gako nagusi bat irakurtzen du. Ikus [SQL eskema](../guide/guides/file-import-export.md#schema-sql).  
Analizatzaile bakoitzak onartzen duen sintaxia ezagutzeko, ikus [Fitxategiak inportatzea edo esportatzea](../guide/guides/file-import-export.md).

```ts
type SetSchema = {
  (
    value: string,
    options: { placement: 'auto'; mode?: 'replace' | 'append' }
  ): Promise<void>;
  (
    value: string,
    options?: { placement?: 'grid'; mode?: 'replace' | 'append' }
  ): void;
};

// example
editor.setSchemaSQL('Schema SQL...');
// or
await editor.setSchemaSQL('Schema SQL...', { placement: 'auto' });
// or
editor.setSchemaSQL('Schema SQL...', { mode: 'append' });
```

## setSchemaGraphQL {#setschemagraphql}

GraphQL SDL dokumentu bat kargatzen du.  
Objektu-moten definizioak taula bihurtzen dira, eta mota beste taula bat duen eremu bat erlazio bihurtzen da.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML {#setschemadbml}

DBML fitxategi bat kargatzen du, dbdiagram.io eta dbdocs zerbitzuek erabiltzen duten formatua.  
`4.0.0` bertsiotik aurrera, `TableGroup` bakoitza [taula-talde](../guide/guides/table-groups.md) bihurtzen da, eta taula baten `headercolor` haren kolore bihurtzen da. Ikus [DBML](../guide/guides/file-import-export.md#dbml).

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML {#setschemaaml}

AML (Azimutt Markup Language) fitxategi bat kargatzen du. Uneko idazkera zein v1 bertsioko idazkera zaharra onartzen dira.  
`4.0.0` bertsiotik aurrera, entitate baten kolorea, Azimutten kolore-izenetako bat edo komatxo arteko balio hamaseitar bat, haren taularen kolore bihurtzen da. Ikus [AML](../guide/guides/file-import-export.md#aml).

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON {#setschemajson}

`4.0.0` bertsiotik aurrera, `.erd.json` dokumentu bat kargatzen du, hala nola [value](#value) propietateak itzultzen duen testua.  
Bere `mode: 'replace'` modu lehenetsian, dokumentua `value` esleitzeak bezala kargatzen du: historia-zerrendan erregistratzen da, `change` igortzen du, eta dokumentuaren blokeoak modu berean hartzen ditu. `value` propietatean ez bezala, kate huts bat edo kate ez den balio bat ez da kontuan hartzen, dokumentu berri bat hasi beharrean. JSON ez den testuak dokumentua husten du, `value` propietatearekin bezala.  
`mode: 'append'` moduak dokumentuaren taulak, erlazioak, indizeak, oharrak eta taula-taldeak diagramaren azpian gehitzen ditu identifikatzaile berriekin, elkarren arteko kokapenak mantenduz eta dokumentuaren ezarpenak kanpoan utziz, [Inportatu eta gehitu](../guide/guides/file-import-export.md#import-and-add) aukerak `json` fitxategi batekin egiten duen bezala. Irakurri ezin duen testuak, edo taularik eta oharrik ez duen dokumentu batek, ez du ezer gehitzen. Bestela, [setSchemaSQL](#setschemasql) metodoaren gehitze bat bezala kokatzen da, haren ohar eta taula-talde berriak haren taulekin batera hautatuta, mota bakoitza erakusten den bitartean.  
Dokumentua kokatu ondoren itzultzen da, eta ez da kontuan hartzen `readonly` ezarrita dagoen bitartean.

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL {#getschemasql}

Editorearen uneko egoera SQL eskema gisa esportatzen du.  
`databaseVendor` zehazten ez bada, unean ezarritako hornitzailearen arabera jarduten du. Beheko zerrendan ez dagoen izen bat modu berean tratatzen da, errorerik sortu gabe.  
Izenak editoreak erakusten duen mugatzaile motarekin inguratzen dira. `Bracket Type` [blokeatuta](../guide/guides/settings.md#lock) dagoen bitartean, hori `value` balioak gordetzen duenaren desberdina izan daiteke, eta azken hori da kodetze-agente baten [`erd_read`](../mcp/tools.md#reading-a-document) tresnak izenak inguratzeko erabiltzen duena.  
`4.0.0` bertsiotik aurrera, aukerako `options` argumentu batek sententziak eta goiburua aukeratzen ditu, [SQL eskema](../guide/guides/schema-sql.md) fitxako aukerek egiten duten bezala. `SchemaSQLOptions` mota gisa esportatzen da.

- `statements`: `'create'`, lehenetsia; `'ifNotExists'`, `IF NOT EXISTS` idazten duena MySQL, MariaDB, PostgreSQL, SQLite eta Databricks datu-baseetan eta beste guztietan `'create'` erabiltzen duena; edo `'recreate'`, taulak sortu aurretik ezabatzen dituena, eta Snowflakek `CREATE OR REPLACE TABLE` idazten du horren ordez.
- `header`: `'none'`, lehenetsia; `'use'`, dokumentuaren datu-basera edo eskemara aldatzen dena; edo `'createAndUse'`, lehenik existitzen ez bada sortzen duena eta gero hartara aldatzen dena. Eskatutakoa ez duen datu-base batek fitxak bezala jotzen du ordezko aukerara: Oraclek `'use'` idazten du `'createAndUse'` aukeraren ordez, PostgreSQLek ez du goibururik idazten `'use'` aukerarako, eta SQLitek ez du bat ere idazten. Goiburua dokumentuaren datu-basearen izena identifikatzaile arrunta den bitartean soilik idazten da: ASCII letrak, digituak eta `_`, digitu batekin hasi gabe.

Kanpoan utzitako aukera bat, edo balio ezezaguna duen bat, bere balio lehenetsi gisa irakurtzen da; beraz, aukerarik gabeko dei batek `CREATE` sententzia arruntak idazten ditu goibururik gabe, lehen bezala.  
`4.0.0` bertsiotik aurrera, irteerak beti barne hartzen ditu dokumentuaren `Before tables` eta `After tables` scriptak, ordena honetan: goiburua, aurreko scripta, ezabatze-sententziak, taulak, ondorengo scripta. SQL eskema fitxaren beraren `Statements`, `Header` eta `Tables` aukerek ez diote inoiz eragiten dei honi, beti dokumentu osoa idazten baitu.  
`3.10.0` bertsiotik aurrera, gako arrotz bakoitzak erlazioaren `ON DELETE` eta `ON UPDATE` klausulak ditu. Klausula bat haren ekintza ezarrita dagoenean eta hornitzaileak onartzen duenean soilik idazten da; beraz, hornitzaile horrek hartzen ez duen ekintza bat kanpoan geratzen da, eta haren balio lehenetsia aplikatzen da. `4.0.0` bertsiotik aurrera, Snowflakek `NO ACTION` soilik onartzen du. Datu-base bakoitzak zer idazten duen jakiteko, ikus [ON DELETE eta ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).  
`3.10.0` bertsiotik aurrera, taula edo zutabe baten iruzkineko komatxo bakun bati ihes egiten zaio; beraz, `it's` bezalako iruzkin batek jada ez du sententzia hausten. Iruzkinak kate-literal gisa idazten dituen hornitzaile orok bikoiztu egiten du, Databricksek izan ezik, zeinak alderantzizko barra bat jartzen baitu komatxo bakoitzaren eta alderantzizko barra bakoitzaren aurrean. SQLitek iruzkinak `--` lerro gisa idazten jarraitzen du.  
`4.0.0` bertsiotik aurrera, hainbat datu-basek gakoen izenak, balio lehenetsiak eta gehikuntza automatikoa ere beste modu batean idazten dituzte. Ikus [DDLak zer idazten duen](../guide/guides/schema-sql.md#what-the-ddl-writes).

```ts
type DatabaseVendor =
  | 'Databricks'
  | 'MariaDB'
  | 'MSSQL'
  | 'MySQL'
  | 'Oracle'
  | 'PostgreSQL'
  | 'Snowflake'
  | 'SQLite';

type SchemaSQLOptions = {
  statements?: 'create' | 'ifNotExists' | 'recreate';
  header?: 'none' | 'use' | 'createAndUse';
};

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
// or
const mysqlSQL = editor.getSchemaSQL('MySQL', {
  statements: 'ifNotExists',
  header: 'createAndUse',
});
```

## getSharedStore {#getsharedstore}

Denbora errealeko elkarlaneko ediziorako biltegi bat itzultzen du.  
`config` objektua `{ getNickname?, mouseTracker?, focusTracker? }` da. Bi jarraitzaileek `true` dute lehenespenez: `mouseTracker` aukerak editore honen kurtsorea besteei igortzen die, eta `focusTracker` aukerak haren fokuratutako gelaxka, hautapena eta arrastatze-laukia igortzen ditu.  
Ikus [Elkarlaneko edizioa](./advanced/collaborative-editing.md).

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue {#setdiffvalue}

Diferentzia-ikustailea irekitzen du, unean irekita dagoen dokumentua pasatzen duzunarekin alderatuz.  
Ez du ezer itzultzen, eta ez du dokumentua aldatzen; beraz, ikustailea ixtean, editorea zegoen-zegoenean geratzen da.  
Balio huts bat, edo kate ez den edozer, dokumentu huts batekin alderatzen da.  
Oihalaren laster-menuko [Diferentzia-ikustailea](../guide/guides/table-related-functions.md#diff-viewer) aukeraren geruza bera da.  
`4.1.0` bertsiotik aurrera, bi dokumentuek dutena identifikatzailearen arabera parekatzen du lehenik, eta gero bakarrik bakoitzak gordetzen duenaren arabera, hala nola taula baten izena edo ohar baten testua. Ikus [Zer alderatzen den](../guide/guides/table-related-functions.md#what-is-compared). Dokumentu beraren aurreko bertsio baten aurrean, hala nola haren fitxategiaren Git berrikuspen baten aurrean, izen-aldaketa bat, beraz, izena aldatutako elementu bakar gisa ageri da; identifikatzaile desberdinak dituen dokumentu baten aurrean, kentze bat eta gehitze bat gisa ageri da. Ikustaileak aldatu dena zuhaitz batean zerrendatzen du bi dokumentuen ondoan, eta aldaketak kolorez markatzen ditu, gelaxkak bete beharrean.

```js
editor.setDiffValue('prev json...');
```
