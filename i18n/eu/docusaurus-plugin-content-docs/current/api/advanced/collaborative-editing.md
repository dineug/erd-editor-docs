---
sidebar_position: 1
description: Birbidali editorearen aldaketak instantzien artean getSharedStore bidez, hasieratu saiora sartzen den editore bat runtimeValue balioarekin, eta erakutsi lankide bakoitzaren kurtsorea, fokua, hautapena eta arrastatze-laukia.
---

# Elkarlaneko edizioa

`getSharedStore()` metodoak editore bat elkarlaneko saio bateko nodo bihurtzen du.  
Aldaketa guztiak ekintza-jario gisa igortzen ditu, eta beste editoreek bueltan bidaltzen dizkioten ekintzak aplikatzen ditu; haien arteko garraioa zuk jartzen duzu (WebSocket, WebRTC edo JSONa eraman dezakeen beste edozer).  
[ErdEditorElement](../erd-editor-element.md) elementuaren metodoetako bat da, eta [Urruneko biltegiratzea](./remote-storage.md) ezaugarriarekin uztartzen da, birbidalitako aldaketak gorde ere egin behar direnean.

```ts
interface ErdEditorElement extends HTMLElement {
  // ...
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
}

type SharedStoreConfig = {
  getNickname?: () => string;
};

type SharedStore = {
  connection: () => void;
  disconnect: () => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  subscribe: (fn: (value: AnyAction[]) => void) => Unsubscribe;
  flushStreamBuffers: () => void;
  destroy: () => void;
};

// example
const sharedStore = editor.getSharedStore();
```

Ekintza bat dokumentuaren aldaketa bakar bat deskribatzen duen objektu serializagarri soil bat da; beraz, garraiorako bidean `JSON.stringify` funtzioa galerarik gabe igarotzen du.  
Sortaka iristen dira: `subscribe` metodoak array bat ematen dizu, eta array hori unitate bakarra da; birbidali osorik, eta aplikatu osorik beste aldean ere, dispatch bidez.  
Tratatu ekintza opako gisa eta pasatu dagoen-dagoenean, irakurri edo berridatzi gabe, ekintzak daramatzan kudeaketa-datuek mantentzen baitituzte editoreak sinkronizatuta.

Editore batek egiten duenaren zati bat editore horretan bertan geratzen da.  
Taula bat, ohar bat edo taula-talde bat aurrera ekartzea, bat hautatzeak egiten duen bezala, ez da bidaltzen.  
Ez dira bidaltzen [SQL eskema](../../guide/guides/schema-sql.md) fitxako `Statements`, `Header` eta `Tables` aukerak ere, egiten diren leihokoak baitira.  
`4.1.0` bertsiotik aurrera, [Arakatzailea](../../guide/guides/explorer.md) ere bere editorean geratzen da: irekita dagoen ala ez, haren zabalera, tolestutako errenkadak, teklatua dagoen errenkada, zuhaitzaren korritze-posizioa, eta haren bilaketa eta aukerak ez dira bidaltzen.  
Ezta gako arrotz batera joateak haren erlazioaren konektorean jartzen duen [argia](../../guide/guides/relationship-editing.md#reading-a-connector) ere.  
Korritze bat, zoom bat edo fitxa-aldaketa bat bidali egiten da, baina ez du inoiz beste erabiltzaile baten ikuspegia edo fitxa mugitzen. Horren barruan sartzen dira Arakatzailetik egindako jauzi batek eragiten duen korritzea eta Arakatzailea beste fitxa batetik irekitzean ERD fitxara egiten den aldaketa.

[Blokeoak](../../guide/guides/settings.md#lock) partekatuak dira: ezarpen bat azkenekoz blokeatzeak edo desblokeatzeak irabazten du editore guztietan, eta blokeo batek hura aktibatu zuen editorearen balioak daramatza; horrela, editore eta erreplika guztiek balio bera gordetzen dute.  
Beraz, `Viewport` blokeoak hura aktibatu zuen editorearen ikuspegia gordetzen du, eta `Canvas Type` blokeoak editore horrek Ezarpenak fitxaren aurretik irekita izan zuen azken fitxa; Ezarpenak fitxan aktibatzen dira blokeoak.  
`Language`, `Table Name Case`, `Column Name Case` edo `Bracket Type` blokeoa desaktibatzeak, gainera, ezarpen hori editore guztietan hura desaktibatu zuen editorean erakusten den baliora ezartzen du, eta horrela balio bakarra gordetzen jarraitzen dute. `Viewport` edo `Canvas Type` blokeoa desaktibatzeak ez du inoren ikuspegia edo fitxa mugitzen.

`Before tables` edo `After tables` scriptaren edizio bat osorik bidaltzen da haren eremuak fokua galtzen duenean. Bi scriptak bereiz ebazten dira; beraz, lankide batek bata editatzeak ez du inoiz bestea gainidazten.

Bisualizazioa fitxako [Fluxu moduan](../../guide/guides/visualization.md#flow-never-edits-the-document) egiten den ezer ez da dokumentuaren aldaketa; beraz, Fluxuan dagoen editore batek ez die besteei aldaketarik bidaltzen, eta besteek bidaltzen dizkioten aldaketak aplikatzen jarraitzen du, bertan dagoen bitartean.  
Salbuespen bakarra Fluxua uztea da beste fitxa batera joateko: fitxa-aldaketa hori beste edozein bezala bidaltzen da.  
Txarteleko kanpo-estekaren botoiak, `#`, `@` edo `:` ikurraren ondoren aukeratutako [Bilaketa azkarreko](../../guide/guides/quick-search.md#searching-the-diagram) emaitza batek eta [Arakatzailea](../../guide/guides/explorer.md#opening-and-closing) irekitzeak Fluxua uzten dute ERD fitxara joateko. Txarteleko botoiak edo Bilaketa azkarreko emaitza batek bertan eragiten duen korritzea ere bidaltzen da.

## Bi editore orri bakarrean {#two-editors-on-one-page}

Hemen, subscribe eta dispatch lotzen dituen kableatzeak sarearen lekua hartzen du; horrela, saio baten egitura ikus dezakezu garraiorik tartean izan gabe.

```js
const editor1 = document.createElement('erd-editor');
const editor2 = document.createElement('erd-editor');

const sharedStore1 = editor1.getSharedStore({
  getNickname: () => 'editor1',
});
const sharedStore2 = editor2.getSharedStore({
  getNickname: () => 'editor2',
});

sharedStore1.subscribe(actions => {
  sharedStore2.dispatch(actions);
});

sharedStore2.subscribe(actions => {
  sharedStore1.dispatch(actions);
});
```

Hemengo bi editoreak dokumentu berri eta huts beretik abiatzen dira; beraz, ez da beharrezkoa bietako bat ere hasieratzea.  
Hiru editore edo gehiago daudenean, bidali bakoitzaren sortak beste guztiei: editore batek ez du inoiz jaso duena aurrera pasatzen.

## Lankide bat hasieratzea {#seeding-a-collaborator}

Biltegi partekatu batek aldaketak egin ahala birbidaltzen ditu, eta ez dio inoiz saiora sartzen denari dokumentua dagoen bezala ematen; beraz, martxan dagoen saio batera sartzen den editore bati dokumentua eman behar zaio lehenik.  
`4.0.0` bertsiotik aurrera, hasieratu editore hori saioan dagoeneko dagoen editore baten [`runtimeValue`](../erd-editor-element.md#runtimevalue) propietatearekin, ez `value` propietatearekin edo gordetako fitxategiarekin.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

Exekuzio-garaiko balioak dokumentua ireki zenetik kendutakoa gordetzen du oraindik; beraz, beste editore batek geroago kentze bat desegiten duenean, saiora sartu den editoreak taula berreskuratzen du bere izen eta zutabeekin.  
[`value`](../erd-editor-element.md#value) propietatea fitxategi batek gordetzen duen forma da, kendutako entitaterik gabe; beraz, hartatik edo fitxategitik hasieratutako editore batek taula huts eta izenik gabeko bat berreskuratuko luke horren ordez.  
Jarraitu `value` propietatea biltegian idazten: `runtimeValue` beste editore bat, bigarren ikuspegi bat edo [replicationStore](./remote-storage.md) bat hasieratzeko soilik da.  
Ostalari hauetako editoreek horrela hasieratzen dute irekitako dokumentu baten bigarren ikuspegia: VS Code, Obsidian, JetBrains IDE bat eta web aplikazioa.

`setInitialValue` metodoa ez da birbidaltzen; beraz, saiora sartzen den editorea hasieratzeak ez du ezer aldatzen besteetan.  
`4.0.0` bertsiotik aurrera, editorearen elkarlaneko erregistroak ere baztertzen ditu; erregistro horiek aldi bereko edizioak ebazten dituzte. Editorearen biltegi partekatuak dagoeneko harpidedun bat izan badu, biltegiak berriro eskatzen dizkie beste editoreei beren erregistroak, bere lehen [subscribe](#subscribe) deian bezala; horrela, saio baten erdian berriro kargatutako editore batek besteek bezala ebazten ditu edizioak.  
`value` propietatea esleitzeak erregistroak mantentzen ditu, baina, `setInitialValue` metodoa ez bezala, birbidali egiten da: editoreak biltegi partekatu bat duenetik aurrera, saioko editore guztiek esleitutako dokumentua kargatzen dute; beraz, ez hasieratu inoiz saiora sartzen den editore bat horrela.

## Bertsioak nahastea {#mixing-releases}

Editore batek bere bertsioak ezagutzen dituen ekintza motak soilik aplikatzen ditu; beraz, bertsioak nahasten dituen saio batean, editore zaharragoek mota berriago batean doan guztia galtzen dute.

`3.10.0` bertsiotik aurrera, erlazio baten [ON DELETE edo ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) balioaren aldaketa bi ekintza mota berrietako baten gisa doa, `relationship.changeOnDelete` eta `relationship.changeOnUpdate`, eta `relationship.add` ekintzak biak eraman ditzake. Ekintzak dauden-daudenean pasatzen dituen birbidaltzaile batek ez du ezer berririk behar horietarako.  
`3.10.0` bertsioa baino lehenagoko editore batek ez ditu aintzat hartzen ekintza mota eta eremu horiek: ez du inoiz jakiten erlazio baten ON DELETE edo ON UPDATE balioa, eta halako batetik gordetako dokumentu batek ez du bietako bat ere. Editore zaharrago batek gehitzen duen erlazio bat horiek gabe iristen da; beraz, biak `Not set` balioarekin hasten dira.

`3.10.0` bertsioko editore batek bidaltzen duen beste aldaketa oro editore zaharragoek dagoeneko ezagutzen dituzten ekintza motetan doa.  
[Bilatu eta ordeztu](../../guide/guides/find-and-replace.md#replacing) funtzioko `Replace All` botoiak bere edizioak sorta bakar batean bidaltzen ditu, eskuzko edizio batek bidaltzen dituen izena aldatzeko, iruzkinetako eta oharretako ekintza berberekin. `Alternate Key` eta `Referential Actions` [ikuspegi-aukerak](../../guide/guides/table-related-functions.md#table-view-options) lehendik dagoen `settings.changeShow` ekintzan doaz.

`4.0.0` bertsiotik aurrera, aldaketa hauek ekintza mota berrietan doaz, eta ekintzak dauden-daudenean pasatzen dituen birbidaltzaile batek ez du ezer berririk behar horietarako:

- [taula-talde](../../guide/guides/table-groups.md) bat gehitzea, mugitzea, haren tamaina edo izena aldatzea, koloreztatzea edo kentzea: `tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor` eta `tableGroup.remove`; taula bat talde batera sartzea edo talde batetik ateratzea: `table.changeGroup`;
- lehendik dagoen erlazio batean [Mapatu zutabeak](../../guide/guides/relationship-editing.md#map-columns) elkarrizketa-koadroko `Save` botoiarekin gordetzea, haren bi zutabe-zerrendak batera ezartzen dituena: `relationship.changeColumns`;
- [blokeo](../../guide/guides/settings.md#lock) bat aktibatzea edo desaktibatzea: `settings.changeLockSettings`;
- [SQL eskema](../../guide/guides/schema-sql.md) fitxako `Before tables` edo `After tables` scripta editatzea: `settings.changeDDLScript`.

`Table Groups` eta `Memos` ikuspegi-aukerak lehendik dagoen `settings.changeShow` ekintzan doaz.  
`settings.changeIgnoreSaveSettings` ekintza, blokeoek ordeztu aurretik `Save Scroll Information` eta `Save Zoom Information` etengailuek bidaltzen zutena, ez da gehiago bidaltzen, eta `settings.changeRelationshipOptimization` ekintza desagertu egin da. Bietako bat jasotzen duen `4.0.0` bertsioko editore batek ez du ezer aldatzen.

`4.0.0` bertsioa baino lehenagoko editore batek ez ditu aintzat hartzen ekintza mota berriak: ez du inoiz ikusten taula-talderik, ezta zein taula dauden bertan ere, nahiz eta talde bat arrastatzeak taldearen taulak editore horretan ere mugitzen dituen, haien `table.move` ekintza ere bidaltzen baitu.  
Mapatu zutabeak elkarrizketa-koadroko `Save` botoiarekin gorde ondoren, erlazioaren zutabe zaharrak mantentzen ditu, eta mapaketa zahar horretako zutabe bat editore horretan kentzen denean, erlazioa editore guztietan desagertzen da. Ez du ez blokeorik ez scriptik.  
Halako batetik gordetako dokumentu batek ez du horietako ezer, eta `4.0.0` bertsioko editore batek blokeo guztiak aktibatuta irekitzen du.  
Mantendu saio bateko editore guztiak, eta haren dokumentua gordetzen duen edozein [replicationStore](./remote-storage.md#dispatch-dispatchsync), `4.0.0` bertsioan edo berriago batean.

`4.1.0` bertsioko editore batek ez du ekintza mota berririk bidaltzen; beraz, `4.0.0` eta `4.1.0` bertsioetako editoreek eta erreplikek saio bera parteka dezakete ezer galdu gabe.  
Haren [Bilatu eta ordeztu](../../guide/guides/find-and-replace.md#replacing) funtzioak indizeen izenetan eta taula-taldeen izenetan ere bilatzen du, eta `Replace` eta `Replace All` botoiek `4.0.0` bertsioko editore batek dagoeneko aplikatzen dituen `index.changeName` eta `tableGroup.changeName` ekintzen bidez aldatzen dute haien izena.

## SharedStoreConfig {#sharedstoreconfig}

### getNickname {#getnickname}

Beste editoreetan erabiltzaile honen saguaren kurtsorearen ondoan erakusten den ezizena ezartzen du.  
Ezizena falta denean edo hutsik dagoenean, beste erabiltzaileek `user` ikusten dute.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker {#mousetracker}

Erabiltzaile honen saguaren kurtsorea beste editoreetara igortzen du. Balio lehenetsia `true` da.  
Beste erabiltzaileek bidalitako kurtsoreak beti erakusten dira ERD oihalean.

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker {#focustracker}

Erabiltzaile hau zertan ari den igortzen du. Balio lehenetsia `true` da.  
Fokuratuta dituzun taula eta gelaxka, hautatu dituzun taulak, oharrak eta taula-taldeak, eta oihalean arrastatzen duzun laukia beste editoreetara bidaltzen dira, eta han marrazten dira.  
Erabiltzaile bakoitzak bere kolorea du, eta horrela elkarrengandik bereiz ditzakezu: ingerada bat fokuratutako taulan, azpimarra bat fokuratutako gelaxkan, eraztun bat hautatutako taulen, oharren eta taula-taldeen inguruan, eta marra etenezko laukizuzen bat arrastatze-laukiarentzat.  
Beste erabiltzaileengandik iristen den presentzia beti marrazten da zure oihalean, aukera hau aktibatuta egon ala ez.  
Bisualizazioa fitxako Fluxu moduan, beste erabiltzaileen fokua eta hautapena taulen txarteletan marrazten dira, baina haien arrastatze-laukiak ez. Han hautatzen dituzun taulak bidaltzen dira oraindik ere; han arrastatzen duzun laukia, ez.

```js
editor.getSharedStore({ focusTracker: false });
```

Desaktibatu bi jarraitzaileak biltegi partekatua presentzia propiorik argitaratzen ez duen birbidaltzaile soil gisa erabiltzeko.  
Beste editoreek bidalitako presentzia jasotzen eta marrazten da oraindik ere.  
Horixe egiten dute ostalari hauetako editoreek: VS Code, Obsidian, JetBrains IDE bat eta Google Drive.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

Kurtsorea, fokua, hautapena eta arrastatze-laukia dokumentuaren aldaketen jario berean doaz, baina iragankorrak dira.  
Ez dira inoiz sartzen ez dokumentuan, ez desegite-historian, ez `editor.value` propietatean; beraz, garraio bat libre da haiek baztertzeko, eta replicationStore batek ez ditu aintzat hartzen.

## SharedStore {#sharedstore}

### connection, disconnect {#connection-disconnect}

Metodo hauek uneko konexio-egoera ezartzen dute.  
Deskonektatuta dagoen bitartean, aldaketak barne-bufferrean gordetzen dira.  
Bufferrean gordetako aldaketak harpidedunei igortzen zaizkie, berriro transmititu daitekeenean.  
Egoera lehenetsia konektatuta da (`connection`).

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync {#dispatch-dispatchsync}

Beste editore-instantzietako aldaketak uneko editore-instantzian aplikatzen ditu.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Editoreko aldaketetara harpidetzen da.  
Gutxienez harpidedun bat egon arte, ezer ez da ateratzen editoretik, eta ordura arte egindako aldaketak bufferrean gordetzen dira.  
Lehen harpidetzak, gainera, beste editoreei beren elkarlaneko erregistroak eskatzen dizkie, aldi bereko edizioak ebazten dituztenak; horrela, berandu sartzen den editore batek modu berean ebazten ditu.  
Ez du dokumentua ekartzen; beraz, [hasieratu](#seeding-a-collaborator) lehenik berandu sartzen den editorea.  
`4.0.0` bertsiotik aurrera, biltegiak berriro eskatzen ditu lehen harpidetza horren ondoren `setInitialValue` metodoak dokumentu bat bere editorean kargatzen duen bakoitzean.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Biltegi honek oraindik atxikita dituen jario-sortak bidaltzen ditu orain, haien isilaldiaren ondoren bidali beharrean.  
`3.9.2` bertsiotik aurrera, `getSharedStore` metodotik lortutako biltegi batean funtzionatzen du; `3.9.1` bertsioan, metodoa motan dago, baina ez du ezer egiten.  
Taula bat, ohar bat edo taula-talde bat mugitzea, haren kolorea aldatzea, ohar baten tamaina aldatzea, eta ikuspegia korritzea edo zooma aldatzea: horietako bakoitza aldaketa txikien jario gisa iristen da. Taula-talde baten tamaina aldatzea ez da horrela iristen: behin bakarrik bidaltzen da, arrastatzea amaitzen denean.  
Biltegiak jario bakoitza sorta bakar batean biltzen du, eta atxiki egiten du jarioa 200 ms isilik egon arte. Bi fasetan egiten du hori; beraz, sorta azken aldaketatik 400 ms inguru geroago ateratzen da.  
Dei batek itxarote hori amaitzen du bi faseetan. Biltegia konektatuta dagoen bitartean, harpidedun batek sorta jasotzen du deia itzuli aurretik. Ezer atxikita ez dagoenean egindako dei batek ez du ezer bidaltzen.  
`destroy` metodoak, biltegiarenak berak zein editorearenak, oraindik atxikita dagoen sorta bat baztertzen du; beraz, deitu metodo honi lehenik biltegi bat uzten duzunean eta besteek azken aldaketa mantendu behar dutenean, fitxa bat ixten denean bezala.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy {#destroy}

sharedStore instantzia erabat suntsitzen du.  
Editorea bera ez da ukitzen; beraz, saio bat uzteak dokumentua editagarri mantentzen du.  
Saguaren eta fokuaren jarraitzaileak gelditu egiten dira editoreak emandako azken sharedStore instantzia suntsitzen denean.  
Biltegiak oraindik atxikita duen jario-sorta bat harekin batera baztertzen da; deitu lehenik [flushStreamBuffers](#flushstreambuffers) metodoari hura bidaltzeko.

```js
sharedStore.destroy();
```
