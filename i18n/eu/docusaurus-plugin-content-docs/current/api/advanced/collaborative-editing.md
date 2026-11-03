---
sidebar_position: 1
description: Birbidali editorearen aldaketak instantzien artean getSharedStore bidez, hasieratu saiora sartzen den editore bat runtimeValue balioarekin eta biltegiaren erregistroekin, ebatzi une berean egindako edizioak, eta erakutsi lankide bakoitzaren kurtsorea, fokua, hautapena eta arrastatze-laukia.
---

# Elkarlaneko edizioa

`getSharedStore()` metodoak editore bat elkarlaneko saio bateko nodo bihurtzen du.  
Aldaketa guztiak ekintza-jario gisa igortzen ditu, eta beste editoreek bueltan bidaltzen dizkioten ekintzak aplikatzen ditu; haien arteko garraioa zuk jartzen duzu (WebSocket, WebRTC edo JSONa eraman dezakeen beste edozer).  
[ErdEditorElement](../erd-editor-element.md) elementuaren metodoetako bat da, eta [Urruneko biltegiratzea](./remote-storage.md) ezaugarriarekin uztartzen da, birbidalitako aldaketak gorde ere egin behar direnean.  
`5.1.0` bertsiotik aurrera, diagrama bat Yjs dokumentu baten eta haren edozein hornitzaileren bidez partekatzeko, garraioa zuk konektatu beharrean, lotu editorea `@dineug/erd-editor-yjs` paketearekin; ikus [Yjs](./yjs.md).

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
  getLWW: () => SharedRegisters;
  mergeLWW: (lww: SharedRegisters, version: number) => void;
  getVersion: () => number;
  forgetPeer: (editorId: string) => void;
  reseed: (value: string, options: ReseedOptions) => void;
  destroy: () => void;
};

// a JSON object whose shape is the editor's own: hand it on as it is
type SharedRegisters = Record<string, unknown> & {
  readonly [registersBrand]: true;
};

type ReseedOptions = {
  lww: SharedRegisters;
  version: number;
  keepScreen?: boolean; // default false
};

// example
const sharedStore = editor.getSharedStore();
```

`@dineug/erd-editor` paketeak ez du mota hauetako bat ere izenez esportatzen. TypeScript kodeak `ErdEditorElement` bidez heltzen die, `ReturnType<ErdEditorElement['getSharedStore']>` bezala.

Ekintza bat dokumentuaren aldaketa bakar bat deskribatzen duen objektu serializagarri soil bat da; beraz, garraiorako bidean `JSON.stringify` funtzioa galerarik gabe igarotzen du.  
Sortaka iristen dira: `subscribe` metodoak array bat ematen dizu, eta array hori unitate bakarra da; birbidali osorik, eta aplikatu osorik beste aldean ere, dispatch bidez.  
Tratatu ekintza opako gisa eta pasatu dagoen-dagoenean, irakurri edo berridatzi gabe, ekintzak daramatzan kudeaketa-datuek, esaterako haren [erregistro-bertsioak](#concurrent-edits), mantentzen baitituzte editoreak sinkronizatuta.

Editore batek egiten duenaren zati bat editore horretan bertan geratzen da.  
Taula bat, ohar bat edo taula-talde bat aurrera ekartzea, bat hautatzeak egiten duen bezala, ez da bidaltzen.  
Ez dira bidaltzen [SQL eskema](../../guide/guides/schema-sql.md) fitxako `Statements`, `Header`, `Write logical names into empty comments` (`4.2.0` bertsiotik aurrera) eta `Tables` aukerak ere, egiten diren leihokoak baitira.  
`4.1.0` bertsiotik aurrera, [Arakatzailea](../../guide/guides/explorer.md) ere bere editorean geratzen da: irekita dagoen ala ez, haren zabalera, tolestutako errenkadak, teklatua dagoen errenkada, zuhaitzaren korritze-posizioa, eta haren bilaketa eta aukerak ez dira bidaltzen.  
Ezta gako arrotz batera joateak haren erlazioaren konektorean jartzen duen [argia](../../guide/guides/relationship-editing.md#reading-a-connector) ere.  
`4.2.0` bertsiotik aurrera, [Hiztegia](../../guide/guides/dictionary.md) fitxa ere bere editorean geratzen da: zein orri erakusten den, eta orri bakoitzaren bilaketa, hautapena, korritze-posizioa eta zutabeen zabalerak ez dira bidaltzen. Haren edizioak, ordenatzeak eta CSV inportazioak, berriz, bai.  
Korritze bat, zoom bat edo fitxa-aldaketa bat bidali egiten da, baina ez du inoiz beste erabiltzaile baten ikuspegia edo fitxa mugitzen. Horren barruan sartzen dira Arakatzailetik egindako jauzi batek eragiten duen korritzea, Arakatzailea beste fitxa batetik irekitzean ERD fitxara egiten den aldaketa, eta Hiztegia fitxako [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) orritik taula edo zutabe batera egindako jauzi baten fitxa-aldaketa eta korritzea. Orri horretatik hitz, termino edo domeinu batera egindako jauzi bat Hiztegia fitxan geratzen da; beraz, ez da horretatik ezer bidaltzen.

`4.2.0` bertsiotik aurrera, [Izenen ikuspegiaren](../../guide/guides/logical-names.md#switching-the-view) aldaketa bat ere bidaltzen da, eta haren [blokeoak](../../guide/guides/settings.md#lock) erabakitzen du beste editoreek harekin zer egiten duten. `Name View` blokeoa aktibatuta dago diagrama berri batean eta `4.2.0` bertsioa baino lehenagoko edozein dokumentutan.  
Blokeoa aktibatuta dagoen bitartean, aldaketa hura egin duen editorean bakarrik ikusten da: bidali egiten da oraindik, baina beste editore guztiek eta erreplika guztiek baztertu egiten dute; beraz, erabiltzaile bakoitzak beste ikuspegi bat begira dezake, `value` balioak ikuspegi blokeatua mantentzen duen bitartean.  
Blokeoa desaktibatuta dagoen bitartean, edita dezakeen editore batean egindako aldaketa batek editore eta erreplika guztietako Izenen ikuspegia aldatzen du, azken aldaketak irabazten duela, eta guztiek gordetzen dute.  
Irakurtzeko soilik dagoen editore batek berak egindako aldaketa editore horretan geratzen da beti, eta editoreak besteen aldaketa partekatuei jarraitzen die oraindik.

`5.1.0` bertsiotik aurrera, [Kode-sortzailearen](../../guide/guides/code-generator.md) lengoaiaren, taula-izenen idazkeraren, zutabe-izenen idazkeraren edo mugatzaile motaren aldaketa batek bere blokeoari jarraitzen dio (`Language`, `Table Name Case`, `Column Name Case` edo `Bracket Type`) modu berean, alde batekin: blokeoa aktibatuta dagoen bitartean, aldaketa ez da batere bidaltzen.  
Aldaketa egin duen editorean bakarrik ikusten da, eta haren Kode-sortzailea eta SQL eskema fitxek jarraitzen diote; beste ezein editorek edo erreplikak ez du ikusten. `value` eta `runtimeValue` balioek blokeatutako balioa mantentzen dute; beraz, edozein editoretatik hasieratutako sartzaile batek ere ez du ikusten, eta erabiltzaile bakoitzak beste lengoaia, izenen idazkera edo mugatzaile mota bat begira dezake blokeoa aktibatuta dagoen bitartean.  
Blokeoa desaktibatuta dagoen bitartean, edita dezakeen editore batean egindako aldaketa partekatu gisa markatuta bidaltzen da (`shared: true` karga-datuetan). Ezarpena editore eta erreplika guztietan aldatzen du, azken aldaketak irabazten duela, eta guztiek gordetzen dute. `5.1.0` bertsioko editore edo erreplika batek markatutako aldaketa aplikatzen du bere blokeoak dioena axola gabe; beraz, desblokeo baten ondoren berehala egindako aldaketa leku guztietara iristen da, desblokeoa baino lehen iristen den lekuetan ere.  
`5.1.0` bertsioa baino lehen, halako aldaketa bat editore eta erreplika guztietara iristen zen haien blokeoa aktibatuta egon ala ez, eta fitxategiak blokeatutako balioa gordetzen zuen.

`5.0.0` bertsiotik aurrera, [irakurtzeko soilik](../erd-editor-element.md#readonly) dagoen editore batek ez du aldaketarik bidaltzen. Irakurleak aldatzen dituen korritzea, zooma, fitxa, Izenen ikuspegia, datu-basea, Kode-sortzailearen lengoaia, izenen idazkera, mugatzaile mota eta `View Option` errenkadak bere pantailan geratzen dira, haien blokeoek zer esaten duten axola gabe; `5.0.0` bertsioa baino lehen, haren korritzeak, zoomak, fitxa-aldaketak, datu-basea eta kode-ezarpenak editatu daitekeen editore batenak bezala bidaltzen ziren.  
Haren biltegiak bidaltzen du oraindik jarraitzaileek irakurlearen kurtsoreaz, fokuaz, hautapenaz eta arrastatze-laukiaz bidaltzen dutena, elkarlanera sartzen den editore batek eskatzen dituen erregistroei erantzuten die, eta besteek bidaltzen duten aldaketa guztiak aplikatzen ditu. Datu-basearen, Kode-sortzailearen ezarpen baten edo `View Option` errenkada baten aldaketa bat haren dokumentura iristen da, eta pantailara ere bai, irakurleak ezarpen hori bertan aldatu ez badu behintzat; eta partekatutako Izenen ikuspegiaren aldaketa bat pantailan ikusten da edonola. `5.1.0` bertsiotik aurrera, Kode-sortzailearen ezarpen bat jasotzen du ezarpen hori blokeoa desaktibatuta zegoela aldatu bada edo desblokeo batek eramaten badu soilik.  
Editorea irakurtzeko soilik jartzen denean, lehenik biltegiak arrastatze edo korritze batetik oraindik atxikita duena bidaltzen du, [flushStreamBuffers](#flushstreambuffers) metodoak bezala; horrela, besteek azkenak mantentzen dituzte.

[Blokeoak](../../guide/guides/settings.md#lock) partekatuak dira: ezarpen bat azkenekoz blokeatzeak edo desblokeatzeak irabazten du editore guztietan, eta blokeo batek hura aktibatu zuen editorearen balioak daramatza; horrela, editore eta erreplika guztiek balio bera gordetzen dute.  
Beraz, `Viewport` blokeoak hura aktibatu zuen editorearen ikuspegia gordetzen du, eta `Canvas Type` blokeoak editore horrek Ezarpenak fitxaren aurretik irekita izan zuen azken fitxa; Ezarpenak fitxan aktibatzen dira blokeoak.  
`Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` edo, `4.2.0` bertsiotik aurrera, `Name View` blokeoa desaktibatzeak, gainera, ezarpen hori editore guztietan hura desaktibatu zuen editorean erakusten den baliora ezartzen du, blokeoaren pean egindako bere aldaketa barne, eta horrela balio bakarra gordetzen jarraitzen dute. `Viewport` edo `Canvas Type` blokeoa desaktibatzeak ez du inoren ikuspegia edo fitxa mugitzen.

`Before tables` edo `After tables` scriptaren edizio bat osorik bidaltzen da haren eremuak fokua galtzen duenean. Bi scriptak bereiz ebazten dira; beraz, lankide batek bata editatzeak ez du inoiz bestea gainidazten.

Bisualizazioa fitxako [Fluxu moduan](../../guide/guides/visualization.md#flow-never-edits-the-document) egiten den ezer ez da dokumentuaren aldaketa; beraz, Fluxuan dagoen editore batek ez die besteei aldaketarik bidaltzen, eta besteek bidaltzen dizkioten aldaketak aplikatzen jarraitzen du, bertan dagoen bitartean.  
Bi salbuespen daude. Fluxua beste fitxa batera joateko uztea fitxa-aldaketa bat da, eta beste edozein bezala bidaltzen da. `4.2.0` bertsiotik aurrera, Fluxuaren tresna-barrako Izenen ikuspegiaren zerrendan egindako aukeraketa bat Izenen ikuspegiaren aldaketa bat da, eta oihalean egindako bat bezala bidaltzen eta aplikatzen da.  
`Previous table` eta `Next table` botoiak eta desegiteko eta berregiteko teklak, Fluxuan [ikuspegietan zehar atzera eta aurrera egiten dutenak](../../guide/guides/visualization.md#previous-table-and-next-table), ez dira bidaltzen.  
Txarteleko kanpo-estekaren botoiak, `#`, `@` edo `:` ikurraren ondoren aukeratutako [Bilaketa azkarreko](../../guide/guides/quick-search.md#searching-the-diagram) emaitza batek eta [Arakatzailea](../../guide/guides/explorer.md#opening-and-closing) irekitzeak Fluxua uzten dute ERD fitxara joateko. Txarteleko botoiak edo Bilaketa azkarreko emaitza batek bertan eragiten duen korritzea ere bidaltzen da.

## Bi editore orri bakarrean {#two-editors-on-one-page}

Hemen, subscribe eta dispatch lotzen dituen kableatzeak sarearen lekua hartzen du; horrela, saio baten egitura ikus dezakezu garraiorik tartean izan gabe.

```js
import '@dineug/erd-editor/erd-editor.js';

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
[`@dineug/erd-editor-yjs`](./yjs.md) paketearekin lotutako gela batek berak dauka dokumentua bezero batek [hasieratu](./yjs.md#seeding-a-room) ondoren; beraz, harekin lotutako editore bakoitzak dokumentu hori irekitzen du, `runtimeValue` baliorik eman gabe.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

Exekuzio-garaiko balioak dokumentua ireki zenetik kendutakoa gordetzen du oraindik; beraz, beste editore batek geroago kentze bat desegiten duenean, saiora sartu den editoreak taula berreskuratzen du bere izen eta zutabeekin.  
[`value`](../erd-editor-element.md#value) propietatea fitxategi batek gordetzen duen forma da, kendutako entitaterik gabe; beraz, hartatik edo fitxategitik hasieratutako editore batek taula huts eta izenik gabeko bat berreskuratuko luke horren ordez.  
`4.2.0` bertsiotik aurrera, gauza bera gertatzen da [Hiztegia](../../guide/guides/dictionary.md) fitxako orri batetik kendutako hitz, termino edo domeinu batekin: beste editore batek kentzea desegiten duenean, `runtimeValue` balioarekin hasieratutako editoreak errenkada osorik zerrendatzen du berriro, eta `value` balioarekin hasieratutakoak errenkada huts bat zerrendatzen du, bere `value` balioak gero kanpoan uzten duena.  
Jarraitu `value` propietatea biltegian idazten: `runtimeValue` beste editore bat, bigarren ikuspegi bat edo [replicationStore](./remote-storage.md) bat hasieratzeko soilik da.  
Ostalari hauetako editoreek horrela hasieratzen dute irekitako dokumentu baten bigarren ikuspegia: VS Code, Obsidian, JetBrains IDE bat eta web aplikazioa.

`setInitialValue` metodoa ez da birbidaltzen; beraz, saiora sartzen den editorea hasieratzeak ez du ezer aldatzen besteetan.  
`4.0.0` bertsiotik aurrera, editorearen elkarlan-erregistroak ere baztertzen ditu; erregistro horiek [aldi bereko edizioak](#concurrent-edits) ebazten dituzte. Editorearen biltegi partekatuak dagoeneko harpidedun bat izan badu, biltegiak berriro eskatzen dizkie beste editoreei beren erregistroak, bere lehen [subscribe](#subscribe) deian bezala; horrela, saio baten erdian berriro kargatutako editore batek besteek bezala ebazten ditu edizioak.  
`value` propietatea esleitzeak erregistroak mantentzen ditu, baina, `setInitialValue` metodoa ez bezala, birbidali egiten da: editoreak biltegi partekatu bat duenetik aurrera, saioko editore guztiek esleitutako dokumentua kargatzen dute; beraz, ez hasieratu inoiz saiora sartzen den editore bat horrela.

Ez `value` ez `runtimeValue` balioek ez dituzte erregistroak, ezta editorearen erlojuak lortu duen erregistro-bertsioa ere, gordetzen; beraz, `runtimeValue` balioarekin soilik hasieratutako sartzaile batek saioko editoreek bere lehen subscribe deiari bidaltzen dioten erantzunetik hartzen ditu.  
Erantzun hori iritsi arte, sartzaileak egiten duen edizio batek besteek dutena baino erregistro-bertsio baxuagoa eraman dezake; beraz, sartzailean geratzen den bitartean besteek baztertu egiten dute, eta bidean oraindik dagoen idazketa zaharrago bat hasieraketak gordetzen duen berriaren gainean lurreratzen da. Erantzuten duen editorerik martxan ez dagoenean, adibidez zerbitzari batek edo dokumentu-biltegi batek saioaren dokumentua gordetzen duenean, sartzaileak ez ditu inoiz jasotzen.  
`5.1.0` bertsiotik aurrera, eman balioarekin batera. Saioko editore batean, deitu [`flushStreamBuffers()`](#flushstreambuffers) metodoari, oraindik atxikita duen arrastatze edo kolore-aldaketa bat lehenik irten dadin, eta irakurri `runtimeValue` eta haren biltegiko [`getLWW()`](#getlww) eta [`getVersion()`](#getversion) aldi berean. Sartzaileak balioa `setInitialValue` metodoarekin kargatzen du, eta ondoren gainerakoa bere biltegiko [`mergeLWW`](#mergelww) metodoarekin hartzen du, ordena horretan, `setInitialValue` bakoitzak erregistroak baztertzen baititu. Haren hurrengo edizioak hasieraketak gordetzen duen guztien gainetik doan erregistro-bertsio bat darama; beraz, erantzunaren zain egon gabe lurreratzen da. Lehendik dagoen biltegi batean, [`reseed`](#reseed) metodoak biak egiten ditu dei bakarrean.

```js
// on an editor already in the session
sharedStore1.flushStreamBuffers();
const seed = {
  value: editor1.runtimeValue,
  lww: sharedStore1.getLWW(),
  version: sharedStore1.getVersion(),
};

// on the joiner
editor2.setInitialValue(seed.value);
const sharedStore2 = editor2.getSharedStore();
sharedStore2.mergeLWW(seed.lww, seed.version);
```

Horrela gordetako hasieraketa batek, geroko sartzaileak irekitzeko, hirurak batera gordetzen ditu. Ez da fitxategi bat: `value` da oraindik biltegira idatzi beharrekoa.  
[replicationStore](./remote-storage.md#runtimevalue-getter) batek ez du erregistrorik ematen; beraz, haren `runtimeValue` balioarekin hasieratutako sartzaile batek editoreen erantzunetik hartzen ditu oraindik.

## Aldi bereko edizioak {#concurrent-edits}

Editore eta erreplika bakoitzak, izen bakoitzeko eta ia beste eremu guztietako, hura ezarri zuen idazketaren erregistro-bertsioa gordetzen du: horiek dira haren elkarlan-erregistroak. Idazketa bat haren erregistro-bertsioa gordetakoaren azpitik ez dagoenean bakarrik lurreratzen da; beraz, aldaketa berdinak ordena desberdinean entzuten dituzten editoreek dokumentu berean amaitzen dute.  
`5.1.0` bertsiotik aurrera, erregistro-bertsio bakoitzak, bere kontagailuaren azpian, idazten ari den editorearen tarte propio bat darama, haren identifikatzailetik hartua. Erregistro-bertsioak, beraz, 4.194.304ko urratsetan hazten dira, eta kontagailuak 512 lortzen duenean 32 biteko osoko bat gainditzen dute. `JSON.stringify` eta `JSON.parse` metodoek osorik eramaten dituzte, baina beste lengoaia batean irakurtzen dituen birbidaltzaile edo biltegi batek 64 biteko zenbaki gisa mantendu behar ditu, ez inoiz 32 biteko osoko gisa.

`5.1.0` bertsiotik aurrera, izen edo eremu bera aldi berean aldatzen duten bi editorek, beheko salbuespenak kenduta, balio berarekin amaitzen dute editore eta erreplika guztietan: kontagailu berean idazten, bi erregistro-bertsio desberdin jartzen dituzte, eta handiagoak irabazten du leku guztietan. `5.1.0` bertsioa baino lehen biek erregistro-bertsio bera jar zezaketen, eta editore bakoitzak azkenekoz entzundakoa mantentzen zuen; beraz, desberdin amaitu zitezkeen. Bi editorek tartea partekatzen dute bikote bakoitzeko 4.194.304tik 1eko probabilitatearekin, eta orduan lehen bezala berdintzen dute.

`5.1.0` bertsiotik aurrera, taula baten kokapena, oharraren edo taula-taldearen kokapena eta tamaina, eta ikuspegiaren jatorria eta zoom-maila modu berean daude erregistro-bertsioekin kudeatuta, eta horiek mugitzen dituena amaitzen den leku gisa bidaltzen da:

- arrastatze bat, mugitutako entitate bakoitzeko `table.moveTo`, `memo.moveTo` edo `tableGroup.moveTo` bakar gisa, sorta batean; beraz, talde-arrastatze batek taulen puntuak taldearenekin batera darama;
- arrastatze baten desegitea edo berregitea, entitate bakoitza jartzen duen puntu gisa;
- korritze bat `settings.scrollTo` gisa, eta zoom bat `settings.changeZoomLevel` gisa;
- ohar baten edo taula-talde baten tamaina-aldaketa, bere kokapena eta tamaina batera.

Beraz, aldi berean taula, ohar edo taula-talde bera mugitzen duten, edo mugitu eta haren tamaina aldatzen duten bi erabiltzailek puntu eta tamaina berean uzten dute editore eta erreplika guztietan. Puntua erregistro-bertsio handiagoa duen idazketak lortzen du, bi ardatzak batera. Mugimendu batek ez du tamainarik idazten; beraz, tamaina-aldaketa batek bere tamaina mantentzen du, aldi berean egindako mugimendu batek puntua hartzen badu ere.  
`5.1.0` bertsioa baino lehen arrastatze bat egindako distantzia gisa bidaltzen zen; beraz, taula bera arrastatzen zuten bi arrastatzek batu egiten ziren, eta aldi berean egindako ohar edo taula-talde baten mugimendu bat eta tamaina-aldaketa bat desberdin amai zitezkeen.  
20 px baino gutxiagoko arrastatze bat, desegite-urratsik uzten ez duena, beste edozein bezala bidaltzen da; beraz, puntu gisa beste erabiltzaile batek aldi berean egindako entitate bereko arrastatze bat gainidatz dezake. Garraio batek birritan entregatzen duen arrastatze, korritze edo zoom sorta batek ez du ezer birritan mugitzen.

Kolore-aldaketa salbuespen bat da. Erregistro-bertsiorik gabe bidaltzen da, eta editore eta erreplika bakoitzak berea jartzen dio eta azkenekoz entzundako kolorea mantentzen du; beraz, aldi berean taula, ohar edo taula-talde bera birkoloreztatzen duten bi erabiltzailek kolore desberdinekin amaitu dezakete.  
Aldaketa batzuek ez dute inolako erregistro-bertsiorik gordetzen; beraz, editore eta erreplika bakoitzak entzuten duen ordenan aplikatzen ditu, eta aldi berean egindako bi ere desberdin amai daitezke: zutabe bat bere taulan edo indizean mugitzea (`column.move`, `indexColumn.move`), eta [datu-basearen](../../guide/guides/table-related-functions.md#databases), [`View Option`](../../guide/guides/table-related-functions.md#table-view-options) errenkada baten, edo [Ezarpenak](../../guide/guides/settings.md) fitxako `Relationship DataType Sync`, `Maximum comment width` edo `Column Order` ezarpenen aldaketa bat.  
Aldi berean bi erabiltzailek gehitzen dituzten entitateak, esaterako bi taula edo taula bereko bi zutabe, ordena desberdinean egon daitezke editore eta erreplika bakoitzean, eta bakoitzaren `value` balioak bere ordena gordetzen du.

Honek guztiak `5.1.0` bertsioko edo berriagoko editore eta erreplikengan balio du; [Bertsioak nahastea](#mixing-releases) atalak azaltzen du zer aldatzen duen zaharrago batek.

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

`4.0.0` bertsioa baino lehenagoko editore batek ez ditu aintzat hartzen ekintza mota berriak: ez du inoiz ikusten taula-talderik, ezta zein taula dauden bertan ere, nahiz eta talde bat arrastatzeak taldearen taulak editore horretan ere mugitzen dituen, taula horietako bakoitzaren mugimendu bat ere bidaltzen baitu.  
Mapatu zutabeak elkarrizketa-koadroko `Save` botoiarekin gorde ondoren, erlazioaren zutabe zaharrak mantentzen ditu, eta mapaketa zahar horretako zutabe bat editore horretan kentzen denean, erlazioa editore guztietan desagertzen da. Ez du ez blokeorik ez scriptik.  
Halako batetik gordetako dokumentu batek ez du horietako ezer, eta `4.0.0` bertsioko editore batek blokeo guztiak aktibatuta irekitzen du.  
Mantendu saio bateko editore guztiak, eta haren dokumentua gordetzen duen edozein [replicationStore](./remote-storage.md#dispatch-dispatchsync), `4.0.0` bertsioan edo berriago batean.

`4.1.0` bertsioko editore batek ez du ekintza mota berririk bidaltzen; beraz, `4.0.0` eta `4.1.0` bertsioetako editoreek eta erreplikek saio bera parteka dezakete ezer galdu gabe.  
Haren [Bilatu eta ordeztu](../../guide/guides/find-and-replace.md#replacing) funtzioak indizeen izenetan eta taula-taldeen izenetan ere bilatzen du, eta `Replace` eta `Replace All` botoiek `4.0.0` bertsioko editore batek dagoeneko aplikatzen dituen `index.changeName` eta `tableGroup.changeName` ekintzen bidez aldatzen dute haien izena.

`4.2.0` bertsiotik aurrera, aldaketa hauek ekintza mota berrietan doaz, eta ekintzak dauden-daudenean pasatzen dituen birbidaltzaile batek ez du ezer berririk behar horietarako:

- taula baten edo zutabe baten [izen logikoa](../../guide/guides/logical-names.md): `table.changeLogicalName` eta `column.changeLogicalName`; haren izena [hiztegietatik eratorria](../../guide/guides/dictionary.md#deriving-physical-names) den ala ez: `table.changeNameDerived` eta `column.changeNameDerived`;
- zutabe bat [domeinu](../../guide/guides/dictionary.md#domains-and-data-types) bati lotzea edo haren lotura kentzea: `column.changeDomain`;
- [Hiztegia](../../guide/guides/dictionary.md) fitxan hitz, termino edo domeinu bat gehitzea, aldatzea (orrian duen lekua barne, ordenatze batek ezartzen duen bezala) edo kentzea: `dictionary.add`, `dictionary.update` eta `dictionary.remove`;
- [Izenen ikuspegia](../../guide/guides/logical-names.md#switching-the-view) aldatzea: `settings.changeNameViewMode`.

`Name View` blokeoa lehendik dagoen `settings.changeLockSettings` ekintzan doa, `Domain` ikuspegi-aukera `settings.changeShow` ekintzan, eta [Column Order](../../guide/guides/settings.md#adjusting-column-order) zerrendan `Logical Name` edo `Domain` errenkadaren mugimendu bat `settings.changeColumnOrder` ekintzan.  
`Import` aukeratik egindako SQL eskema, GraphQL, DBML edo AML inportazio baten `editor.clear` eta `editor.loadJson` ekintzek `keepDictionaries: true` daramate, eta horrek editore guztietan mantentzen ditu hitzak, terminoak eta domeinuak. Gauza bera gertatzen da ordezten duen [setSchemaSQL](../erd-editor-element.md#setschemasql), `setSchemaGraphQL`, `setSchemaDBML` edo `setSchemaAML` dei baten ekintzekin.  
Hiztegiek eratortzen duten izen fisiko bat `table.changeName` edo `column.changeName` ekintzan doa, eta domeinu batek bere zutabeei ematen dien datu mota `column.changeDataType` ekintzan: eskuzko edizio batek bidaltzen dituen ekintzak.

`4.2.0` bertsioa baino lehenagoko editore batek ez ditu aintzat hartzen ekintza mota berriak: ez du izen logikorik, domeinu-loturarik, hiztegirik ezta Izenen ikuspegirik ere. `Name View` blokeatzeak edo desblokeatzeak ez du ezer aldatzen han, ezta Column Order zerrendan `Logical Name` edo `Domain` errenkadaren mugimendu batek ere, edo horietako baten gainera egindako batek. Ezta Ezarpenak fitxara Hiztegia fitxatik iritsitako editore batek aktibatutako `Canvas Type` blokeo batek ere: editore zaharragoak ez du fitxa hori ezagutzen; beraz, `Canvas Type` desblokeatuta mantentzen du. Hiztegiek eratortzen dituzten izen fisikoak eta domeinuek ematen dituzten datu motak erakusten ditu oraindik.  
Haren edizioek ez dakite ezer izen logikoei, domeinuei edo hiztegiei buruz, eta ondorio hauek dituzte editore berriagoetan:

- Eskuz izena aldatzen dion taula edo zutabe batek bere izena eratorritzat markatuta mantentzen du; beraz, geroago editore berriago batean hari idatzitako izen logiko batek izena berriro erator dezake, editore zaharrak idatzitakoaren gainetik.
- Domeinu bati lotutako zutabe bati ematen dion datu motak lotura bere horretan uzten du; beraz, `Checks` orriak `Domain type mismatch` egiaztapena zerrendatzen du, eta domeinuaren hurrengo mota-aldaketak domeinuaren mota ematen dio berriro zutabeari.
- Gehitzen duen erlazio baten gako arrotzeko zutabeek ez dute izen logikorik ez domeinurik jasotzen beren gakotik.
- Itsasten edo bikoizten duen taula bat izen logikorik eta domeinu-loturarik gabe iristen da.
- Hartan egindako SQL eskema, GraphQL, DBML edo AML inportazio batek ez du `keepDictionaries` bidaltzen; beraz, editore guztietan hustu egiten ditu hitzak, terminoak eta domeinuak.
- Karga bat, inportazio bat edo `clear()` dei bat desegiteak dokumentuaren bere kopia kargatzen du editore guztietan, eta kopia horrek ez du izen logikorik, domeinu-loturarik ezta hiztegirik ere.
- Kopia horrek, eta hartan egindako SQL eskema, GraphQL, DBML edo AML inportazio batek kargatzen duen dokumentuak, editore guztietako `Name View` blokeoa editore horrek aurkitu zuen egoerara itzultzen dute. Ondoren, editore guztiek `Physical Names` gordetzen dute Izenen ikuspegi gisa, eta hura erakutsi ere egiten dute, blokeoa desaktibatuta badago.

Halako batetik gordetako dokumentu batek ez du izen logikorik, domeinu-loturarik, hiztegirik ezta Izenen ikuspegirik ere; beraz, `4.2.0` bertsioko editore batek `Physical Names` ikuspegian irekitzen du. Editore zaharragoak, hala ere, `Name View` blokeoa aurkitu zuen bezala gordetzen du; beraz, `4.2.0` bertsioko editore batean desblokeatutako dokumentu bat desblokeatuta geratzen da.  
Mantendu saio bateko editore guztiak, eta haren dokumentua gordetzen duen edozein [replicationStore](./remote-storage.md#dispatch-dispatchsync), `4.2.0` bertsioan edo berriago batean.

`5.1.0` bertsioko editore batek ez du ekintza mota berririk bidaltzen; beraz, `5.1.0` bertsioa baino lehenagoko editoreek eta erreplikek saio bera parteka dezakete harekin, eta ekintzak dauden-daudenean pasatzen dituen birbidaltzaile batek ez du ezer berririk behar. [Aldi bereko edizioak](#concurrent-edits) atalak deskribatzen duena, ordea, `5.1.0` bertsioko editore eta erreplikengan bakarrik betetzen da:

- `5.1.0` bertsioko editore baten arrastatzeak `table.moveTo`, `memo.moveTo` eta `tableGroup.moveTo` ekintzetan doaz puntu gisa, eta zaharragoek dagoeneko aplikatzen dituzte; haren korritzeak eta zoomak `settings.scrollTo` eta `settings.changeZoomLevel` ekintzetan puntu gisa doaz, eta, korritze eta zoom guztiak bezala, beste ezein editorek ez ditu aplikatzen, erreplikek bakarrik hartzen dituzte. Editore zaharrago batek arrastatze bateko puntu bakoitza iristen den ordenan aplikatzen du, erregistroetatik kanpo, eta erreplika zaharrago batek gauza bera egiten du arrastatze, korritze edo zoom bateko puntu bakoitzarekin; beraz, entitate batentzat, edo ikuspegiarentzat, aldi berean bidalitako bi puntu desberdin amaitu daitezke han.
- Editore zaharrago baten arrastatzea egindako distantzia gisa joaten da oraindik, eta editore eta erreplika guztiek beren erregistroetatik kanpo batzen dute; haren korritzea edo zooma ere distantzia gisa doa, eta erreplika guztiek modu berean batzen dute. Entitate beraren distantzia bat eta puntu bat aldi berean eginda desberdin amaitu daitezke ordena desberdinean entzuten dituzten editore eta erreplikatan, eta garraio batek birritan entregatzen duen distantzia birritan batzen da.
- [Aldi bereko edizioak](#concurrent-edits) atalak izendatzen dituen salbuespenetatik kanpo, `5.1.0` bertsioko editore batek izen edo eremu bati egindako idazketak, editore zaharrago batek une berean hari egindakoaren aurrean, ia beti irabazten du, erantzun bera emanez editore eta erreplika guztietan. Bi editore zaharrago oraindik desberdin amai daitezke aldi berean idatzitako eremu batean.
- `5.1.0` bertsioko editore batek Kode-sortzailearen lengoaiaren, izenen idazkeraren edo mugatzaile motaren aldaketa bat bidaltzen du blokeoa desaktibatuta dagoen bitartean bakarrik, `shared: true` markarekin, editore zaharragoek aintzat hartzen ez dutena, eta lehen bezala aplikatzen dute aldaketa. Editore zaharrago batek blokeoaren pean egiten duen aldaketa markarik gabe bidaltzen du oraindik: `5.1.0` bertsioko editore edo erreplika batek baztertu egiten du ezarpen hori han blokeatuta dagoen bitartean, eta editore zaharragoek aplikatu. Beraz, blokeo baten pean editore zaharragoek elkarren aukerei jarraitzen diete, `5.1.0` bertsioko editoreek berena mantentzen duten bitartean, eta fitxategiak blokeatutako balioa gordetzen du edonola. Bi bertsioetako edozeinetan egindako desblokeo batek desblokeatzailearen balioa eramaten du editore eta erreplika guztietara.
- Dokumentua ordezten duen karga batek, esaterako esleitutako `value` balio batek, `clear()` dei batek edo ordezten duen inportazio batek, marrazten ari den erlazioa amaitzen du `5.1.0` bertsioko editore guztietan, hura egin duen editorean eta hura jasotzen duen bakoitzean. Editore zaharrago batek marrazketa aktibatuta mantentzen du karga horretan zehar.

Mantendu saio bateko editore guztiak, eta haren dokumentua gordetzen duen edozein [replicationStore](./remote-storage.md#dispatch-dispatchsync), `5.1.0` bertsioan edo berriago batean, aldi berean egindako edizioek leku guztietan berdin amaitu dezaten, [Aldi bereko edizioak](#concurrent-edits) atalak izendatzen dituen salbuespenak kenduta; izen logikoak eta hiztegiak mantentzen dituena `4.2.0` bertsioa edo berriagoa da oraindik. `1.2.0` bertsioa baino lehenagoko [MCP zerbitzari](../../mcp/live-and-headless.md#edits-made-at-the-same-moment) bat `5.1.0` bertsioa baino lehenagoko editore gisa zenbatzen da hemen, eta `5.1.0` bertsioa baino lehenagoko editore bat ezin da batere [Yjs](./yjs.md) gela batera lotu.

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
`4.2.0` bertsiotik aurrera, erabiltzaile bakoitzak beste [Izenen ikuspegi](../../guide/guides/logical-names.md#collaborators) bat begira dezake, haren blokeoa aktibatuta dagoen bitartean edo irakurtzeko soilik dagoen editore batek berak egindako aldaketa baten ondoren. Zure ikuspegiak marrazten ez duen fokuratutako gelaxka bat haren lekuan marrazten duen gelaxkan azpimarratzen da: izenak eta izen logikoak elkar ordezkatzen dute, datu motak eta domeinuak bezala.  
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
Sorta batek beste editore baten erregistro-eskaera bat daramanean, sartzaile baten lehen [subscribe](#subscribe) deiak bidaltzen duena bezala, biltegiak bere harpidedunen bidez erantzuten du bere erregistroekin eta erregistro-bertsioarekin, erregistrorik ez badu izan ezik.  
`5.1.0` bertsiotik aurrera, lehenik atxikita dituen jario-sorta guztiak bidaltzen ditu, [flushStreamBuffers](#flushstreambuffers) metodoak bezala, haren erantzunak daramatzan erregistro-bertsio bakoitza besteei bidali zaien idazketa batean oinarritua egon dadin. Sartzaile baten iristeak, beraz, saioko editore guztiek aldi berean bidaltzea eragiten du oraindik atxikita duten arrastatzea, korritzea, zooma, kolore-aldaketa edo ohar-tamainaren aldaketa.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Editoreko aldaketetara harpidetzen da.  
Gutxienez harpidedun bat egon arte, ezer ez da ateratzen editoretik, eta ordura arte egindako aldaketak bufferrean gordetzen dira.  
Lehen harpidetzak, gainera, beste editoreei beren elkarlan-erregistroak eskatzen dizkie, [aldi bereko edizioak](#concurrent-edits) ebazten dituztenak; horrela, berandu sartzen den editore batek modu berean ebazten ditu.  
Ez du dokumentua ekartzen; beraz, [hasieratu](#seeding-a-collaborator) lehenik berandu sartzen den editorea; `5.1.0` bertsiotik aurrera hasieraketak erregistroak ere eraman ditzake.  
`4.0.0` bertsiotik aurrera, biltegiak berriro eskatzen ditu lehen harpidetza horren ondoren `setInitialValue` metodoak, edo `5.1.0` bertsiotik aurrera [reseed](#reseed) metodoak, dokumentu bat bere editorean kargatzen duen bakoitzean.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Biltegi honek oraindik atxikita dituen jario-sortak bidaltzen ditu orain, haien isilaldiaren ondoren bidali beharrean.  
`3.9.2` bertsiotik aurrera, `getSharedStore` metodotik lortutako biltegi batean funtzionatzen du; `3.9.1` bertsioan, metodoa motan dago, baina ez du ezer egiten.  
Taula bat, ohar bat edo taula-talde bat mugitzea, haren kolorea aldatzea, ohar baten tamaina aldatzea, eta ikuspegia korritzea edo zooma aldatzea: horietako bakoitza aldaketa txikien jario gisa egiten da. Taula-talde baten tamaina aldatzea ez da horrela egiten: behin bakarrik bidaltzen da, arrastatzea amaitzen denean.  
Biltegiak jario bakoitza sorta bakar batean biltzen du, eta jarioa 200 ms isilik egon arte atxikitzen du, bi fasetan. Kolore-aldaketa batek edo ohar baten tamaina-aldaketa batek bi faseak igarotzen ditu; beraz, azken aldaketatik 400 ms inguru geroago ateratzen da, `5.1.0` bertsioa baino lehen jario guztiak bezala. `5.1.0` bertsiotik aurrera arrastatze, korritze edo zoom bat lehen fasearen ondoren ateratzen da, haren azken urratsetik 200 ms inguru geroago, amaitzen den leku gisa (ikus [Aldi bereko edizioak](#concurrent-edits)).  
Dei batek itxarote hori amaitzen du bi faseetan. Biltegia konektatuta dagoen bitartean, harpidedun batek sorta jasotzen du deia itzuli aurretik. Ezer atxikita ez dagoenean egindako dei batek ez du ezer bidaltzen.  
`destroy` metodoak, biltegiarenak berak zein editorearenak, oraindik atxikita dagoen sorta bat baztertzen du; beraz, deitu metodo honi lehenik biltegi bat uzten duzunean eta besteek azken aldaketa mantendu behar dutenean, fitxa bat ixten denean bezala.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

`5.1.0` bertsiotik aurrera, editorearen elkarlan-erregistroen kopia bat itzultzen du (ikus [Aldi bereko edizioak](#concurrent-edits)).  
Kopia JSON bidez egiten da; beraz, `JSON.stringify` metodorako prest dagoen objektu soil bat da, eta haren aldaketa batek ez ditu biltegiaren erregistroak aldatzen.  
Eman dagoen-dagoenean beste biltegi baten [mergeLWW](#mergelww) edo [reseed](#reseed) metodoari. Haren forma editorearena da; beraz, ez irakurri haren eremurik.  
Irakurri [getVersion](#getversion) metodoarekin eta editorearen `runtimeValue` balioarekin aldi berean, [sartzaile bat hasieratzeko](#seeding-a-collaborator).

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

`5.1.0` bertsiotik aurrera, beste biltegi batek [getLWW](#getlww) metodoarekin eman dituen erregistroak biltegi honetakoetan hartzen ditu, bakoitzaren erregistro-bertsio handiena mantenduz, eta `version` balioa editorearen erlojuan hartzen du, eta horrek berearen eta emandakoaren artean handiena mantentzen du.  
Ez du ezer aldatzen dokumentuan: ez `value` ez `runtimeValue` balioaren byterik, ez desegite-urratsik, ez `change` gertaerarik. Geroko idazketa batek gainditu behar dituen erregistro-bertsioak soilik igotzen ditu; beraz, emandako erregistroak baino zaharragoa den idazketa bat baztertu egiten da ondoren, eta editorearen hurrengo edizioak `version` baino goragoko erregistro-bertsio bat darama.  
Ez du ezer bidaltzen eta ez du ezer erantzuten. Sartzaile baten lehen subscribe deiak besteen erantzunetik jasotzen duena da, zuzenean hartua.  
Deitu `setInitialValue` metodoaren ondoren, ez inoiz lehenago: `setInitialValue` bakoitzak eta [reseed](#reseed) bakoitzak gordetako erregistroak baztertzen ditu, eta haiekin batera haren aurreko `mergeLWW` batek hartutakoa.

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

`5.1.0` bertsiotik aurrera, editorearen erlojuak batu duen erregistro-bertsio handiena itzultzen du: berak egindako edo hartutako aldaketen, sartze batek trukatzen dituen erregistro-eskaeren eta erantzunen, eta `mergeLWW` edo `reseed` metodoei emandako `version` bakoitzaren erregistro-bertsioen artean handiena.  
Kurtsoreek, fokuak, hautapenek eta arrastatze-laukiek, berenak edo beste editore batenak, ez dute mugitzen.  
Eman [getLWW()](#getlww) metodoarekin batera, aldi berean irakurria, sartzaile baten [mergeLWW](#mergelww) edo [reseed](#reseed) metodoari. Bere ekintzek daramaten bezalako [erregistro-bertsio](#concurrent-edits) bat da.

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

`5.1.0` bertsiotik aurrera, emandako identifikatzailea duen editoreak bidali dituen kurtsorea, fokua, hautapena eta arrastatze-laukia berehala kentzen ditu, eta bakoitzak zain zuen iraungitzea. Beste editore guztienak geratzen dira.  
Identifikatzailea editore horren biltegi partekatuak bidaltzen duen ekintza bakoitzak daraman `meta.editorId` da. Editore honek ezer ez duen identifikatzaile batek ez du ezer aldatzen.  
Deitu zure garraioak parekoa joan dela jakiten duenean. Bestela, parekoak bidalitakoa marraztuta geratzen da iraungi arte: haren kurtsorea jasotako azkenaren ondoren 30 segundora, fokua eta hautapena 90 segundora, eta arrastatze-laukia 3 segundora.

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

`5.1.0` bertsiotik aurrera, saio baten dokumentua editorean berriro irekitzen du, berriro sartzeak bezala. [Yjs](./yjs.md) loturak metodo honi deitzen dio gela baten dokumentua irekitzeko, hasieratutako gela batera lotzen denean, eta berriro sartze bakoitzean, behin gelara sartuta pantaila mantenduz.  
`value` kargatzen du [setInitialValue](../erd-editor-element.md#setinitialvalue) metodoak bezala, eta `lww` eta `version` hartzen ditu [mergeLWW](#mergelww) metodoak bezala; beraz, biltegiak emandako erregistroak besterik ez ditu orduan, eta bere erlojuak berearen eta `version` balioaren artean handiena. Desegite-historia ere husten du, eta, `setInitialValue` metodoak ez bezala, hautapena eta fokua baztertzen ditu, balioak jada ez duen zerbait izenda dezaketelako.  
Beheko izen logikoen eratorpena kenduta, ez du desegite-urratsik egiten, ez du `change` gertaerarik igortzen, eta ez du aldaketarik bidaltzen. Biltegiak harpidedun bat izan duenean, honelako karga guztiek bidaltzen duten erregistro-eskaera bidaltzen du, erregistroak lehendik eman dituen garraio batek baztertu dezakeena, eta, [focusTracker](#focustracker) aktibatuta dagoenean, garbitutako hautapena eta fokua.  
`setInitialValue` bezala, [readonly](../erd-editor-element.md#readonly) ezarrita dagoen bitartean ere funtzionatzen du, Fluxu ikuspegi bat baztertzen du, marrazten ari den erlazioa amaitzen du, eta ohar-, taula-taldearen izen- eta gelaxka-editoreak ixten ditu, haietan idatzitakoa modu berean mantenduz edo baztertuz; izen logikoaren gelaxka bat ixteak bere irakurleak idatzitakotik eratortzen duen izena ohiko edizio bat da: bidali egiten da, desegin daiteke, eta `change` gertaera gisa igortzen da.

`keepScreen` gabe pantailak balioak duena erakusten du, `setInitialValue` ondoren bezala. `keepScreen: true` aukerarekin irakurlearen pantaila kargatutako dokumentuaren gainean berriro jartzen da, pantaila horretan bakarrik:

- korritze-posizioa eta zoom-maila, elementuak erakutsi ondoren; inoiz erakutsi ez den batek, edo ezkutuan kargatu eta ordutik erakutsi ez denak, balioak jartzen duen lekuan irekitzen da, berandu sartzen den batek bezala;
- fitxa, kargak mugitu duenean, eta Ezarpenak fitxan irakurlea nondik etorri zen fitxa ere bai, han hartutako `Canvas Type` blokeo batek izendatzen duena;
- Izenen ikuspegia eta irakurleak bere blokeoaren pean berak erakutsi zuen Kode-sortzailearen ezarpen bakoitza, baina blokeo hori kargaren aurretik aktibatuta zegoen, ondoren ere aktibatuta dagoen eta balio blokeatu bera duen kasuan bakarrik. Beraz, pareko batek ezarpen bat desblokeatu, aldatu eta beste balio batean berriro blokeatu badu bitartean, editorea balio blokeatu berrian irekitzen da, eta blokeoa kargaren aurretik edo ondoren desaktibatuta dagoen lekuan, kargatutako balioa erakusten du;
- irakurtzeko soilik dagoen irakurle batek bere pantailan aldatu duen ezarpen guztiak, blokeoek dioena axola gabe.

Honetako ezer ez da bidaltzen, eta `value` eta `runtimeValue` balioek kargatutako dokumentua jakinarazten dute oraindik. Pareko baten geroko desblokeo batek horrela mantendutako kode-ezarpena ordezten du, desblokeo guztiek bezala.  
Editorea edita daitekeen bitartean irakurlearen hurrengo korritzeak edo zoomak mantendutako korritze-posizioa eta zoom-maila dokumentuarenak bihurtzen ditu berriro, eta pantailaren uneko egoeratik abiatuta bidaltzen da; beraz, erreplikek zoom hori ere hartzen dute.

Berrhasieratze batek biltegiak atxikita duena bere horretan uzten du. Oraindik atxikita dagoen arrastatze, korritze edo zoom bat haren ondoren ateratzen da, berrhasieratutako dokumentutik irakurria; kolore-aldaketa edo ohar-tamainaren aldaketa egin zen bezala ateratzen da, editoreak dagoeneko erakusten ez badu ere; eta `disconnect()` metodoak atxikitakoa `connection()` deiarekin ateratzen da.  
Beraz, deitu lehenik [flushStreamBuffers](#flushstreambuffers) metodoari, bidali ateratzen duena, eta berrhasieratu hura duen balio batekin. Ez berrhasieratu inoiz deskonektatuta dagoen bitartean.

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy {#destroy}

sharedStore instantzia erabat suntsitzen du.  
Editorea bera ez da ukitzen; beraz, saio bat uzteak dokumentua editagarri mantentzen du.  
Saguaren eta fokuaren jarraitzaileak gelditu egiten dira editoreak emandako azken sharedStore instantzia suntsitzen denean.  
Biltegiak oraindik atxikita duen jario-sorta bat harekin batera baztertzen da; deitu lehenik [flushStreamBuffers](#flushstreambuffers) metodoari hura bidaltzeko.  
Beste editoreek bidalitako kurtsoreak, fokuak, hautapenak eta arrastatze-laukiak marraztuta geratzen dira iraungi arte; `5.1.0` bertsiotik aurrera [forgetPeer](#forgetpeer) metodoak editore baten multzoa berehala kentzen du.

```js
sharedStore.destroy();
```
