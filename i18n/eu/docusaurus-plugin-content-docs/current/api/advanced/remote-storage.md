---
sidebar_position: 2
description: Erreplikatu martxan dagoen editore bat hari nagusitik kanpoko editorerik gabeko biltegi batean, eta serializatu dokumentua gordetzeko.
---

# Urruneko biltegiratzea

Aldaketa bakoitzean editorearen egoera osoa bidaltzea ez da eraginkorra.  
Kasu horretarako, editoreak denbora errealeko datu-erreplikaziorako API bat eskaintzen du.

## Instalazioa {#installation}

```sh
npm install @dineug/erd-editor
```

Erreplikazio-biltegia `@dineug/erd-editor/engine.js` azpibidean dago, ez paketearen erroan.  
Sarrera-puntu horrek ez du DOMa ukitzen; beraz, Web Worker batean edo hari nagusitik kanpoko beste edozein lekutan exekutatzen da.  
Paketearen erroa inportatzen bada, berriz, `<erd-editor>` elementu pertsonalizatua erregistratzen da, eta horrek dokumentu bat behar du.

## Erabilera {#usage}

```ts
type ReplicationStore = {
  readonly value: string;
  readonly runtimeValue: string;
  on: (
    listeners: Partial<{ change: (change: ReplicationChange) => void }>
  ) => Unsubscribe;
  setInitialValue: (value: string) => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  destroy: () => void;
};

type ReplicationChange = {
  value: string;
  changed: boolean;
};

type InjectEngineContext = {
  toWidth: (text: string) => number;
};

type CreateReplicationStore = (
  context: InjectEngineContext
) => ReplicationStore;

// example
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({
  toWidth: text => text.length * 10,
});
```

## Martxan dagoen editore bat erreplikatzea {#replicating-a-live-editor}

Ekintzak martxan dagoen editore baten biltegi partekatutik datoz.  
Ikus [Elkarlaneko edizioa](./collaborative-editing.md).

```js
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({ toWidth });
replicationStore.setInitialValue(editor.runtimeValue);

replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) save(value);
  },
});

const sharedStore = editor.getSharedStore();
sharedStore.subscribe(actions => {
  replicationStore.dispatch(actions);
});
```

Aldaketa bakarrik igarotzen da mugaz bestaldera, inoiz ez dokumentu osoa.  
Erreplikak aplikatu egiten du, eta emaitza bere aldean serializatzen du.  
`change` gertaerak emaitza hori `value` gisa ematen dizu, eta `changed` propietateak noiz merezi duen idaztea adierazten dizu.

`4.0.0` bertsiotik aurrera, hasieratu erreplika editorearen `runtimeValue` propietatetik, goian bezala, eta ez gordetako fitxategitik edo editorearen `value` propietatetik.  
Fitxategian ez daude gorde zenetik egindako edizioak, eta `value` propietatean ez daude saioan kendutako entitateak.  
Kendutako taula bat gabe hasieratutako erreplika batek, editore batek kentzea desegiten duenean, taula izenik eta zutaberik gabe itzultzen du, eta horrela gordetzen du.

## InjectEngineContext {#injectenginecontext}

### toWidth {#towidth}

Kate bat pixeletan neurtzen du.  
Biltegiak ez du DOMik; beraz, ezin du testua berak neurtu, eta funtzio honen bidez birkalkulatzen ditu zutabeen zabalerak izen bat, datu mota bat, balio lehenetsi bat edo iruzkin bat aldatzen den bakoitzean.  
Gainera, taula eta zutabe guztiak berriro neurtzen ditu [setInitialValue](#setinitialvalue) metodoak dokumentu bat kargatzen duen bakoitzean.  
`4.0.0` bertsiotik aurrera, zabalerak [runtimeValue](#runtimevalue-getter) propietatean bakarrik gordetzen dira, inoiz ez `value` propietatean.  
Hortaz, bertsio honek gordetako dokumentu bat berriro irakurtzean `value` bera lortzen da, bytez byte, non gorde zen eta han testua nola neurtzen zen gorabehera.

Neurtu editoreak egiten duen bezala: `400 12px` balioarekin editorearen letra-tipo zerrendan, biribilduta, gehi 2 px-eko barne-tartea.  
Bestela, `runtimeValue` propietateko zabalerak pantailan ikusten direnetatik aldentzen dira.

```js
const TEXT_PADDING = 2;
const FONT =
  "400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, " +
  "'Helvetica Neue', 'Open Sans', system-ui, sans-serif, " +
  "'Apple Color Emoji', 'Segoe UI Emoji'";

let context = null;

function getContext() {
  if (context) return context;

  try {
    context = new OffscreenCanvas(0, 0).getContext('2d');
    if (context) context.font = FONT;
  } catch {
    // no canvas available
  }

  return context;
}

function toWidth(text) {
  const context = getContext();
  const width = context ? context.measureText(text).width : text.length * 10;

  return Math.round(width) + TEXT_PADDING;
}

const replicationStore = createReplicationStore({ toWidth });
```

`text.length * 10` da ordezko neurketa canvas objekturik erabilgarri ez dagoenean.  
Nahikoa da biltegi batentzat, haren dokumentua gorde bakarrik egiten bada eta inoiz errendatzen ez bada.

## ReplicationStore {#replicationstore}

### value getter {#value-getter}

Editorearen uneko egoera serializatzen du.  
JSON kate bat itzultzen du, dagoen bezala gordetzeko prest, ez analizatutako objektu bat.

```js
const data = replicationStore.value;
```

`4.0.0` bertsiotik aurrera, `value` biltegiratze-forma da: fitxategi batek gordetzen duen dokumentua, elementuaren [value](../erd-editor-element.md#value) propietateak itzultzen duen testu bera.  
Entitate biziak soilik ditu, ordena finko batean, kendutakoak, pilatze-ordena eta karga batek berriro kalkulatzen duen ezer gabe, hala nola [toWidth](#towidth) funtzioak neurtzen dituen zabalerak.  
Bi zuriuneko koska du eta lerro-jauzi batekin amaitzen da; beraz, dokumentu berak beti byte berak ematen ditu.  
Zer duen jakiteko, ikus [Biltegiratze-forma eta exekuzio-garaiko balioa](./schema.md#storage-form-and-runtime-value).

[Blokeoa](../../guide/guides/settings.md#lock) aktibatuta duen ezarpen bakoitza blokeatu zen balioarekin idazten da, eta gainerako ezarpen guztiak dauden bezala.  
`Viewport` blokeoak ikuspegiaren jatorria eta zoom-maila batera hartzen ditu, eta fitxak, Kode-sortzailearen lengoaiak, izenen bi idazkerek eta mugatzaile motak blokeo bana dute.  
Blokeoek dokumentuaren `ignoreSaveSettings` eremua ordezten dute; `4.0.0` bertsiotik aurrera, eremu hori ez da irakurtzen ez idazten.  
`4.0.0` bertsioa baino lehen, `value` biltegiak zuen bezalako dokumentu osoa zen, eremu horren korritze- eta zoom-bitak aplikatuta.

### runtimeValue getter {#runtimevalue-getter}

`4.0.0` bertsiotik aurrera, erreplikak duen bezalako dokumentua serializatzen du, kendutako entitateak eta karga batek kalkulatzen duen guztia barne.  
Hemen ere, blokeatutako ezarpen bakoitza bere balio blokeatuarekin idazten da.

```js
const snapshot = replicationStore.runtimeValue;
```

Erabili geroago sartzen den editore bat edo beste biltegi bat hasieratzeko, haren `setInitialValue` metodoaren bidez; ikus [Elkarlaneko edizioa](./collaborative-editing.md).  
Ez gorde inoiz fitxategi gisa: kendutako entitateak ditu, eta argitaratutako [JSON Schema](./schema.md#json-schema) eskemak ukatu egiten du.  
Kendutako entitate horiei esker, geroago bidalitako kentze baten desegiteak entitatea oso-osorik itzul dezake hartatik hasieratutako biltegian.  
Dokumentua bere fitxategitik hurrengoz ireki arte geratzen dira, fitxategiaren formak kanpoan uzten baititu.

### setInitialValue {#setinitialvalue}

Aurrez gordetako editorearen egoera kargatzen du.

```js
replicationStore.setInitialValue('json...');
```

Biltegiratze-forma, exekuzio-garaiko balio bat edo aurreko bertsio batek gordetako dokumentu bat onartzen ditu, v2 dokumentu bat barne.  
Kate huts batek, edo kate ez den edozerk, dokumentu berri eta huts bat kargatzen du errore bat jaurti beharrean.  
Inoiz baliorik jaso ez duen biltegi bat dokumentu berri berarekin hasten da.  
`4.0.0` bertsiotik aurrera, dokumentu horrek [blokeo](../../guide/guides/settings.md#lock) guztiak aktibatuta ditu; beraz, haren `value` propietateak hasieran zituen ikuspegia, fitxa, Kode-sortzailearen lengoaia, izenen idazkerak eta mugatzaile mota gordetzen ditu, erreplikatzen dituen editoreek korritu, zooma aldatu, fitxaz aldatu edo ezarpen horiek aldatu arren. `3.10.0` bertsioan ez zuen gordetzen ez korritzea ez zooma, eta horren aurretik biak gordetzen zituen.  
Gordetako dokumentu batek bertan aipatzen diren blokeoak mantentzen ditu.  
Bat ere aipatzen ez duena, hau da, `4.0.0` bertsioa baino lehen gordetako edozein dokumentu, v2 dokumentuak barne, blokeo guztiak aktibatuta kargatzen da: ikuspegiaren jatorria `0, 0` posizioan, zoom-maila `1` balioan eta ERD fitxa hautatuta, gorde zuena edozein dela ere, eta Kode-sortzailearen lengoaia, izenen idazkerak eta mugatzaile mota gorde zituen bezala.  
`4.0.0` bertsiotik aurrera, `setInitialValue` metodoak aurreko dokumenturako gordetako elkarlaneko erregistroak ere baztertzen ditu, elementuaren [setInitialValue](../erd-editor-element.md#setinitialvalue) metodoak egiten duen bezala.  
JSON ez den testuak ere, adibidez bateratze-gatazken markekin geratu den fitxategi batek, ez du errorerik jaurtitzen: analisi-errorea kontsolan erregistratzen da soilik, dokumentua hustu egiten da, eta ezarpenak zeuden bezala geratzen dira.

`4.0.0` bertsiotik aurrera, kargak ez du zabor-bilketarik exekutatzen; beraz, kendutako entitateak [runtimeValue](#runtimevalue-getter) propietatean geratzen dira.  
Lehen, `doc` eremuan agertzen ez ziren eta lau egun edo gehiagoan ukitu gabe zeuden entitateak baztertzen zituen.

Kargaren berridazketak `setInitialValue` metodoak itzuli baino lehen amaitzen dira: zutabeetako gako-markak, zutabe bakoitzaren aukeretatik eta erlazioetatik irakurriak; taula eta zutabe guztien zabalerak, `toWidth` funtzioarekin berriro neurtuak; konektore bakoitza bere taulekin elkartzen den puntuak; eta erlazio bakoitzaren identifikatzaile-marka eta haren guraso-muturreko ikurra.  
Horietako bat ere ez dago `value` propietatean, baina deiaren ondoren berehala irakurritako `replicationStore.runtimeValue` propietateak dagoeneko guztiak ditu.  
Kargaren ondoren berehala iristen den ekintza bat, adibidez berriro erreproduzitutako korritze bat, kargatutako dokumentuarekin alderatuta neurtzen da; beraz, karga bera ez da inoiz [`changed`](#onchange) gisa jakinarazten.

Ez kargak ez berridazketa horietako batek ere ez du `change` gertaera igortzen.  
Kargatutako dokumentua biltegiratze-forman berriro idatzi nahi baduzu, irakurri zuk zeuk `replicationStore.value` propietatea `setInitialValue` metodoak itzuli ondoren.

### on@change {#onchange}

Editorearen egoeraren aldaketetara harpidetzen da.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

`change` gertaera atzeratu egiten da 200 ms-ko isilaldia igaro arte; beraz, ekintza-zaparrada bat jakinarazpen bakar gisa iristen da.  
Dokumentua alda dezaketen motatako ekintzetarako soilik abiarazten da, gehi editore zaharrago batek oraindik bidal dezakeen `settings.changeIgnoreSaveSettings` ekintzarako (ikus [dispatch, dispatchSync](#dispatch-dispatchsync)).  
Birbidalitako presentzia-ekintza batek edo `editor.mergeLWW` ekintzak ez du inoiz esnatzen.  
Harpidetza kentzeko, deitu itzulitako funtzioari.

`3.10.0` bertsiotik aurrera, entzuleak `ReplicationChange` motako balio bat jasotzen du, `@dineug/erd-editor/engine.js` azpibideak `ReplicationStore` motarekin batera esportatzen duen mota bat.  
`3.10.0` bertsioa baino lehen ez zuen ezer jasotzen, eta argumentua alde batera uzten duen entzule batek funtzionatzen jarraitzen du.  
`value` biltegiratze-forman serializatutako dokumentua da, `replicationStore.value` propietateak une horretan itzultzen duen kate bera; beraz, ez dago berriro serializatu beharrik.  
`changed` propietatea `false` da aurreko `change` gertaeraz geroztik, edo kargaz geroztik, izandako ekintzek `value` bytez byte zegoen bezala utzi dutenean.

[Blokeo](../../guide/guides/settings.md#lock) batek `value` propietatetik kanpo uzten duen aldaketak ere `change` gertaera abiarazten du, `changed` propietatea `false` dela; beraz, idatzi soilik `changed` propietatea `true` denean.  
Halakoak dira korritze bat edo zoom bat `Viewport` blokeatuta dagoen bitartean, fitxa-aldaketa bat `Canvas Type` blokeatuta dagoen bitartean, eta Kode-sortzailearen lengoaiaren, izenen idazkera baten edo mugatzaile motaren aldaketa bat bere blokeoa aktibatuta dagoen bitartean.  
Elementuaren [change](../erd-editor-element.md#change) gertaerak halako aldaketa kanpoan uzten du, baina erreplikak jakinarazi egiten du hala ere.  
Blokeo guztiak aktibatuta daude dokumentu berri batean eta `4.0.0` bertsioa baino lehen gordetako batean.  
`Viewport` desblokeatuta dagoela, korritze batek edo zoom batek `value` aldatzen du, eta `Canvas Type` desblokeatuta dagoela, editorearen beste fitxa bat irekitzeak ere bai.  
Blokeo bat aktibatzeak edo desaktibatzeak ere `value` aldatzen du.

`4.0.0` bertsiotik aurrera, `changed` propietateak biltegiratze-forma alderatzen du, eta horrek ez ditu ez kendutako entitateak ez pilatze-ordena.  
Hortaz, `change` gertaera bakar baten barruan gehitu eta berriro kendutako taula bat, beste lankide batek kendutako entitate batean egindako edizio bat eta pilatze-ordena soilik aldatzen duen birbidalitako karga bat, guztiak ere `changed` propietatea `false` dela iristen dira.

`changed` propietateak ez du inoiz zure gordetako fitxategiarekin alderatzen, eta fitxategi hori kargatu bezain laster `value` propietatetik desberdina izan daiteke: aurreko bertsio batek gordetako fitxategi bat desberdina da, v2 fitxategi bat barne, eta baita byte-ordenaren marka batekin hasten den fitxategi bat eta eskuz editatutako bat ere.  
Halako fitxategi batekin byteak alderatzeak blokeo batek kanpoan uzten duen korritze bat ere edizio gisa zenbatuko luke.  
`changed` propietatea `true` duen lehen `change` gertaerak halako fitxategia biltegiratze-forman itzultzen du; beraz, hura idazteak fitxategia behin berridazten du.  
Bertsio honek gordetako fitxategi bat ez da desberdina, non gorde zen gorabehera, [toWidth](#towidth) atalean azaltzen den bezala.  
`change` gertaera bat oraindik zain dagoela `setInitialValue` deia iristen bada, eta haren unea iritsi aurretik ezer bidaltzen ez bada, `change` hori iritsi egiten da hala ere, kargatutako `value` balioarekin eta `changed` propietatea `false` dela.

### dispatch, dispatchSync {#dispatch-dispatchsync}

Urruneko editorearen aldaketak replicationStore instantziari aplikatzen dizkio.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` metodoak mikrozeregin batera atzeratzen du aplikazioa, eta `dispatchSync` metodoak sorta berehala aplikatzen du.

Biltegi partekatu baten jarioa iragazi gabe pasa dezakezu.  
Bi metodoek dokumentua alda dezaketen motatako ekintzak soilik gordetzen dituzte, gehi atal honen amaieran azaltzen diren biak, eta gainerakoak baztertzen dituzte; beraz, elkarlaneko saio batek daraman presentzia — erabiltzaile bakoitzaren saguaren kurtsorea, fokua, hautapena eta arrastatze-laukia — ezer egin gabe igarotzen da.

`3.10.0` bertsiotik aurrera, gordetako ekintzen artean `relationship.changeOnDelete` eta `relationship.changeOnUpdate` daude, eta `relationship.add` ekintzak `onDelete` eta `onUpdate` eremuak daramatza.  
Aurreko bertsio bateko biltegi batek ekintza horiek baztertzen ditu eta eremu horiek alde batera uzten ditu; beraz, erlazio baten [ON DELETE eta ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) ekintzak galtzen ditu.

`4.0.0` bertsiotik aurrera, gordetako ekintzen artean daude, halaber, `table.changeGroup`, zortzi `tableGroup` ekintzetatik zazpi (`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName` eta `tableGroup.changeColor`; guztiak, pilatze-ordena aldatzen duen `tableGroup.changeZIndex` izan ezik), `relationship.changeColumns`, `settings.changeLockSettings` eta `settings.changeDDLScript`.  
`settings.changeRelationshipOptimization` ekintza jada ez da existitzen; beraz, bi metodoek baztertu egiten dute.  
Aurreko bertsio bateko biltegi batek ekintza berriak baztertzen ditu; beraz, [taula-taldeak](../../guide/guides/table-groups.md), [blokeoak](../../guide/guides/settings.md#lock), [SQL eskema](../../guide/guides/schema-sql.md) fitxako scriptak eta [Mapatu zutabeak](../../guide/guides/relationship-editing.md#map-columns) elkarrizketa-koadroak lehendik dagoen erlazio bati ematen dizkion zutabeak galtzen ditu.  
Exekutatu erreplika editoreen bertsio berean edo berriago batean.

`4.1.0` bertsioak ez du ekintza motarik gehitzen eta `@dineug/erd-editor/engine.js` zegoen bezala uzten du; beraz, `4.0.0` bertsioko erreplika batek `4.1.0` bertsioko editore batek bidaltzen duen aldaketa oro gordetzen du, `4.1.0` bertsioko erreplika batek egiten duen bezalaxe.  
`4.1.0` bertsiotik aurrera, [Bilatu eta ordeztu](../../guide/guides/find-and-replace.md#replacing) funtzioko `Replace` eta `Replace All` botoiek indizeen eta taula-taldeen izena ere aldatzen dute, `4.0.0` bertsioko erreplika batek dagoeneko gordetzen dituen `index.changeName` eta `tableGroup.changeName` ekintzen bidez.  
[Arakatzailearen](../../guide/guides/explorer.md) egoera propioa ez da inoiz bidaltzen, eta hark eragindako fitxa-aldaketa edo korritze bat beste edozein fitxa-aldaketa edo korritze bezala iristen da; ikus [Elkarlaneko edizioa](./collaborative-editing.md).

`4.0.0` bertsiotik aurrera, bi metodoek `editor.mergeLWW` ere aplikatzen dute; ekintza horrek beste editore bat saiora sartzen denean editore batek erantzun gisa bidaltzen dituen elkarlaneko erregistroak daramatza, eta, horri esker, erreplikak editoreek bezala ebazten ditu aldi bereko edizioak.  
Ez du `value` propietatearen byte bakar bat ere aldatzen, eta ez du `change` gertaerarik abiarazten.  
`4.0.0` bertsioa baino lehen argitaratutako editore batek oraindik bidal dezakeen `settings.changeIgnoreSaveSettings` ekintza gorde egiten da, baina ez du ezer aldatzen: `change` abiarazten du, `changed` propietatea `false` dela.

### destroy {#destroy}

replicationStore instantzia erabat suntsitzen du.

```js
replicationStore.destroy();
```

Ondoren, biltegiak `change` igortzeari uzten dio eta ondorengo dispatch deiak alde batera uzten ditu.  
Dokumentua bere azken balioan izozten da, errore bat jaurti beharrean.  
Berriro hasteko, sortu biltegi berri bat.
