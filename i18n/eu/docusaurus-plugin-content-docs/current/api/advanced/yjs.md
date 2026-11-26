---
sidebar_position: 2
description: Mantendu sinkronizatuta <erd-editor> elementu bat edo editorerik gabeko pareko-biltegi bat Yjs dokumentu baten bidez @dineug/erd-editor-yjs paketearekin, hasieratu gela bat, erakutsi presentzia Awareness bidez, jarraitu lineaz kanpo editatzen, eta bildu gelaren historia trinkotze-albo-prozesu batekin.
---

# Yjs

`@dineug/erd-editor-yjs` paketeak diagramak sinkronizatuta mantentzen ditu [Yjs](https://github.com/yjs/yjs) dokumentu baten bidez. Bere kabuko pakete bat da, `@dineug/erd-editor` `5.1.0` bertsioarekin batera kaleratu zen lehen aldiz, `0.1.0` gisa.  
`bindErdEditor` funtzioak `<erd-editor>` elementu bat lotzen du `Y.Doc` batera, eta `bindPeerStore` funtzioak `@dineug/erd-editor/peer.js` modulutik datorren editorerik gabeko pareko-biltegi bat.  
`Y.Doc` eramaten duen hornitzaileak diagrama eramaten du: websocket zerbitzari batek, WebRTC-k, IndexedDB-k edo zure berak. Hornitzailea eta `Y.Doc` zureak izaten jarraitzen dute: loturak ez ditu inoiz konektatzen, deskonektatzen edo suntsitzen.

Edizioak editorearen beraren ekintza-sorta gisa bidaiatzen dute, eta loturak biltegiak bidali zituen bezala gordetzen ditu.  
Beraz, editorearen elkarlan-erregistroek une berean egindako edizioak `getSharedStore` bidez konektatutako saio batean bezala ebazten dituzte, salbuespen berberekin, kolore-aldaketarekin esaterako. Ikus [Aldi bereko edizioak](./collaborative-editing.md#concurrent-edits).  
Kurtsoreak, fokua, hautapenak eta arrastatze-laukiak hornitzailearen Awareness mekanismoaren bidez bidaiatzen dute. Ikus [Presentzia](#presence).  
Biltegi partekatu bat garraio batera zuk konektatzearekin alderatuta, loturak hauek gehitzen ditu:

- Sartzen den bezero batek gelak duen diagrama irekitzen du, martxan dagoen editore batek [runtimeValue](../erd-editor-element.md#runtimevalue) baliorik eman gabe.
- Deskonektatuta geratu den bezero batek editatzen jarraitzen du, eta haren edizioak berriro konektatzen denean iristen dira. Ikus [Lineaz kanpoko edizioak eta berriro sartzeak](#offline-edits-and-rejoins).
- Iraunkortasun-hornitzaile batek itzultzen duen `Y.Doc` batek duen diagrama irekitzen du. Ikus [Gelak zer duen](#what-the-room-holds).
- Aukerako Node albo-prozesu batek gelaren historia argazki bakar batean biltzen du. Ikus [Gela trinkotzea](#compacting-a-room).

Loturak `5.1.0` bertsioak biltegi partekatuari eta pareko-biltegiari gehitu zizkien bost metodoak behar ditu ([getLWW](./collaborative-editing.md#getlww), [mergeLWW](./collaborative-editing.md#mergelww), [getVersion](./collaborative-editing.md#getversion), [forgetPeer](./collaborative-editing.md#forgetpeer) eta [reseed](./collaborative-editing.md#reseed)), eta behar dituen dei guztiak berak egiten ditu.

## Instalazioa {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`, `yjs` eta `y-protocols` pareko-mendekotasunak (peer dependencies) dira; beraz, orri batek bakoitzaren kopia bakar bat izaten du: `@dineug/erd-editor` `5.1.0` edo berriagoa `5.x` barruan, `yjs` `13.6` edo berriagoa `13.x` barruan, eta `y-protocols` `1.0` edo berriagoa `1.x` barruan.  
Paketeak haien motak soilik hartzen ditu, eta zuk pasatutako `Y.Doc` eta `Awareness` objektuekin lan egiten du; beraz, ez du Yjs, y-protocols edo editore koderik kargatzen berez.  
Orri bereko bi Yjs kopiek elkarren eraikitzaile-egiaztapenak hausten dituzte, eta bigarrenak `Yjs was already imported` idazten du erregistroan. Zure kodeak eta hornitzaile batek `yjs` bi lekutatik ebazten dutenean, deduplikatu bundlerrean (Vite: `resolve.dedupe: ['yjs']`).

Paketea ESM soilik da (`"type": "module"`), sarrera bakarrekoa (paketearen erroa), eta albo-ondoriorik gabekotzat markatuta dago; beraz, `bindErdEditor` bakarrik inportatzen duen bundle batek trinkotzailea kanpoan uzten du.  
`bindErdEditor` funtzioak DOM bat behar du, definitutako `<erd-editor>` elementu bat lotzen duelako. `bindPeerStore` funtzioak Node soilean ere funtzionatzen du, Node.js 22.12 edo berriagoan, [trinkotze-albo-prozesuak](#compacting-a-room) egiten duen bezala.

## Erabilera {#usage}

```ts
function bindErdEditor(
  editor: ErdEditorElement,
  doc: Y.Doc,
  options?: BindOptions
): ErdYjsBinding;
```

```js
import '@dineug/erd-editor/erd-editor.js';

import { bindErdEditor } from '@dineug/erd-editor-yjs';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc);
const editor = document.createElement('erd-editor');
document.body.appendChild(editor);

provider.on('sync', function onSync(synced) {
  if (!synced) return;
  provider.off('sync', onSync);

  const binding = bindErdEditor(editor, doc, {
    awareness: provider.awareness,
    getNickname: () => 'Ada',
  });
  binding.on('error', error => console.error(error));
  binding.on('rejoin', reason => console.info('reopened on the room', reason));
  binding.seed(); // false, and nothing written, once the room holds a diagram
});
```

`wss://yjs.example.com` eta `my-diagram` zure zerbitzariaren eta gelaren ordezkoak dira.  
Lotu, eta hasieratu, hornitzaileak sinkronizatu ondoren bakarrik, y-websocket hornitzailearen `sync` gertaerak `true` balioarekin esaten duen bezala. Lehenago egindako hasieraketa batek gelaren diagrama ordezka dezake. Ikus [Gela hasieratzea](#seeding-a-room).

`Y.Doc` batek gela baten argazkia duenean lotzen den unean, loturak berehala irekitzen du elementuan: argazkia kargatzen du bere erregistro eta erregistro-bertsioarekin, [reseed](./collaborative-editing.md#reseed) metodoak bezala, eta ordutik erregistratutako edizio guztiak aplikatzen ditu.  
Irekitze horrek berriro sartze batek egiten duena garbitzen eta ixten du (ikus [Lineaz kanpoko edizioak eta berriro sartzeak](#offline-edits-and-rejoins)), eta elementua argazkiak jartzen duen lekuan irekitzen da. Lehen irekitze honetarako ez da `rejoin` igortzen.  
`Y.Doc` batek argazkirik ez duenean, gela hutsean edo hornitzaileak sinkronizatu aurretik bezala, elementuak bere dokumentua mantentzen du, eta loturak ez du ezer idazten gelan argazki bat agertu arte, bere [seed](#seed) metodoarena edo beste bezero batena.

`bindErdEditor` funtzioak biltegi partekatu bat hartzen du elementutik [getSharedStore](../erd-editor-element.md#getsharedstore) metodoarekin, eta [destroy](#destroy) metodoak askatzen du.  
Elementuak `<erd-editor>` bat izan behar du jada, bere sarrera inportatuta edo `defineErdEditor()` deituta. Ikus [Elementuak erregistratzea](../installation.md#registering-the-elements). Etiketa definitu arte, `<erd-editor>` bat `HTMLElement` soil bat da, eta nabigatzaileak eguneratzen du etiketa definituta eta elementua dokumentuan dagoenean. Oraindik eguneratu gabeko elementu baterako, `bindErdEditor` funtzioak `TypeError` bat jaurtitzen du, `error` igo ordez.

Gelaren edizioak elementuari aplikatzen zaizkio, eta [change](../erd-editor-element.md#change) gertaera igortzen dute, lankide batenak bezala; argazki bat irekitzen denean ondoren erreproduzitzen direnak ere barne.  
Argazki bat irekitzeak, lotzen den unean zein berriro sartzean, ez du desegite-urratsik sortzen, ez du `change` igortzen eta ez du ezer idazten gelan, [Lineaz kanpoko edizioak eta berriro sartzeak](#offline-edits-and-rejoins) atalak azaltzen duen izen logikoaren eratorpena izan ezik.  
Beste dokumentu bat hasieratutako gela batean kargatzeko, egin bezero guztiek aplikatzen duten aldaketa bat: esleitu [value](../erd-editor-element.md#value), deitu [clear](../erd-editor-element.md#clear) metodoari, edo inportatu bat.  
[setInitialValue](../erd-editor-element.md#setinitialvalue) ez da inoiz gelan idazten, biltegi partekatu batek ez baitu bidaltzen; beraz, elementu hori bakarrik aldatzen du, eta beste bezero guztiek gelaren diagrama mantentzen dute. Horren ordez, hasieratu gela huts bat [seed](#seed) metodoarekin.

`Y.Doc` batek diagrama bat gordetzen du. Loturak `Y.Doc`-aren `erd:` izenen azpian gordetzen du, eta Awareness lokalaren egoeraren `erd` eremua ezartzen du, eta gainerako izen eta eremu guztiak bere horretan uzten ditu.  
Eman lotutako elementu bakoitzari berea den `Y.Doc` bat eta Awareness bat, gela bateko bezero bakoitzak duen bezala: Awareness bera partekatzen duten bi loturek elkarren `erd` eremua gainidazten dute.

## Gela hasieratzea {#seeding-a-room}

Gela batek ez du diagramarik bezero batek [hasieratu](#seed) arte.  
Bien bitartean editore batek duena bere hasieraketan sartzen da, eta beste bezero baten hasieraketari lekua uzten dio hura lehenago iristen bada: loturak hartan irekitzen du berriro `rejoin('snapshot')` erabiliz, eta elementuak zuen dokumentua, lotu zenetik hartan editatutakoarekin batera, galdu egiten da.

Bi bezerok batera hasieratzen dutenean, hasieraketa batek irabazten du bezero guztietan.  
Beste hasieratzaileak hartan irekitzen du berriro `rejoin('seedLost')` erabiliz, eta bere hasieraketatik editatutakoa galtzen du; galtzen duen hasieraketara sartu zen bezero batek ere bai, `rejoin('snapshot')` erabiliz. Galtzen duen hasieraketan egindako haien edizioak ez dira inorengana iristen.  
Hornitzaileak sinkronizatu aurretik egindako hasieraketa bat gelaren diagrama zetorren hasieraketaren une berean egindakotzat hartzen da; beraz, hura gainditu dezake eta gelaren diagrama ordezka dezake.

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

Kurtsoreak, fokua, hautapenak eta arrastatze-laukiak eramaten dituen `Awareness`, hornitzailearena esaterako.  
Harekin, loturak elementuaren sagu- eta foku-jarraitzaileak aktibatzen ditu, eta beste bezeroen presentzia marrazten du elementuan. Ikus [Presentzia](#presence).  
Hura gabe, diagrama bakarrik sinkronizatzen da: elementuak ez du kurtsorerik, fokurik edo hautapenik bidaltzen eta ez du beste inorena marrazten.

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

Besteek editore honen kurtsorearen ondoan ikusten duten izena.  
Elementuaren biltegi partekatuak bidaltzen duen bakoitzean irakurtzen du, [getSharedStore](./collaborative-editing.md#getnickname) metodoarekin bezala, eta beste erabiltzaileek `user` ikusten dute falta denean edo hutsik dagoenean.

```js
bindErdEditor(editor, doc, {
  awareness: provider.awareness,
  getNickname: () => 'nickname...',
});
```

## ErdYjsBinding {#erdyjsbinding}

```ts
type ErdYjsBinding = {
  seed: (value?: string) => boolean;
  on: <K extends keyof BindingEvents>(
    event: K,
    listener: BindingEvents[K]
  ) => () => void;
  destroy: () => void;
};

type BindingEvents = {
  rejoin: (reason: RejoinReason) => void;
  error: (error: Error) => void;
};

type RejoinReason = 'snapshot' | 'seedLost';
```

`on(event, listener)` metodoak entzulea kentzen duen funtzio bat itzultzen du.

### seed {#seed}

Gelaren lehen argazkia idazten du editorearen dokumentutik, eta `true` itzultzen du.  
`value` emanda, [setInitialValue](../erd-editor-element.md#setinitialvalue) metodoak irakurtzen duen edozein formatako dokumentu-testua, lehenik hura kargatzen du editorean.  
Gero, editoreak oraindik atxikita dituen arrastatzeak, tamaina-aldaketak eta kolore-aldaketak askatzen ditu, erregistratu gabe; beraz, horietako bat ere ez da argazkiaren ondoren gelara iristen. `value` gabe argazkiak dagoeneko erakusten ditu, editorearen dokumentua hartzen baitu; `value` emanda, `value` balioak ordezkatu zuen dokumentuarenak ziren.  
Gero [Gelak zer duen](#what-the-room-holds) atalak azaltzen duen argazkia idazten du.  
Gelak argazki bat duenean `false` itzultzen du eta ez du ezer idazten, `value` kargatu gabe; beraz, bezero guztiek dei dezakete lotu ondoren. Era berean `false` itzultzen du lotura suntsitu edo geldiarazi ondoren, eta lotzean [ukatu](#onerror) zen lotura batean.

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

Loturak editorea berriro ireki du gelaren argazkian, [reseed](./collaborative-editing.md#reseed) metodoak bezala; [Lineaz kanpoko edizioak eta berriro sartzeak](#offline-edits-and-rejoins) atalak azaltzen du zer mantentzen duen eta zer galtzen duen.  
`reason` balioak zergatia esaten du:

- `'snapshot'`: argazkiak loturak aplikatu gabeko edizioak ditu, urrun egon zelako trinkotzaile batek haiek bildu zituen bitartean, edo trinkotzaile batek, bere bilketa batean, beste trinkotzaile baten argazkiak ordezkatu zuen argazki batean bildu zituena berriz jarri zuelako (ikus [Gela bakoitzeko trinkotzaile bat](#one-compactor-per-room)). Gela huts bateko lotura batera iristen den lehen argazkia denean ere hau da arrazoia, eta argazkia beste hasieraketa batena denean eta lotura hark idatzi ez zuen hasieraketa batera sartuta zegoenean.
- `'seedLost'`: beste bezero baten hasieraketak lotura honek idatzitakoa gainditu du.

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

Loturak lotzeari uko egin dio, gelditu da edo aukera bat baztertu du. Mezu bakoitza `erd-editor-yjs: ` testuarekin hasten da.

Lotzean, ez du ezer lotzen hauetan:

- editorea edo pareko-biltegia `Y.Doc` honetara lotuta dago jada;
- bere `@dineug/erd-editor` `5.1.0` bertsioa baino lehen eraiki zen; loturak elementu batetik hartutako biltegi partekatua suntsitzen du;
- pareko-biltegia lotu aurretik suntsitu zen;
- gelak bertsio honek irakurtzen ez duen egituran dagoen argazki bat du (ikus [Gelak zer duen](#what-the-room-holds)).

Halako lotura batek `error` igotzen du mikroataza batean, deiaren ondoren gehitutako entzule batek entzun dezan, eta ez da inoiz `rejoin` igortzen hartan.

Geroago, lotura gelditu egiten da hauetan:

- gelaren argazkia bertsio honek irakurtzen ez duen egitura bihurtzen da. Bertsio honetako lotura guztiak gelditzen dira, editore bakoitzak aplikatuta zuena mantentzen du, eta ondoren editatutako ezer ez da idazten;
- bere pareko-biltegia haren azpian suntsitu zen, gela hurrengoan aldatzen denean edo `seed()` edo `compact()` deitzen denean aurkitzen dena.

Gelditzen den lotura batek hartutako biltegi partekatua askatzen du, eta bere biltegia eta `Y.Doc` bikote gisa ere bai, [destroy](#destroy) metodoak bezala, eta bere entzuleak mantentzen ditu.

`bindPeerStore` funtzioan bakarrik, hauek `error` igotzen dute eta lotura aurrera doa:

- `compactAfter` ez da zenbaki oso positibo bat: loturak eskatzen zaionean bakarrik biltzen du;
- `electionGraceMs` edo `retainMs` ez da 0tik 2.147.483.647 ms arteko zenbaki bat: haren balio lehenetsia erabiltzen da ordez, tarte horretatik kanpoko tenporizadore bat berehala aktibatzen baita;
- `synced` baztertzen da: loturak ez du inoiz biltzen, eta hautaketa beste trinkotzaileei uzten die (ikus [Gela bakoitzeko trinkotzaile bat](#one-compactor-per-room)).

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

Editoreak oraindik atxikita dituen arrastatzeak, tamaina-aldaketak eta kolore-aldaketak gelara bidaltzen ditu, loturaren `erd` Awareness eremua `null` bihurtzen du besteek haren kurtsorea, fokua eta hautapena berehala ken ditzaten, eta `Y.Doc` eta Awareness behatzeari uzten dio.  
Elementu batean, hartutako biltegi partekatua ere suntsitzen du, elementua eta bere dokumentua dauden bezala utzita.  
Bigarren dei batek ez du ezer egiten. Ondoren editoreak editatzen duena ez da inorengana iristen.

Pareko-biltegia, `Y.Doc` eta hornitzailea zureak izaten jarraitzen dute, lotura ondoren suntsitzeko: lehenago suntsitutako pareko-biltegi batek ez ditu inoiz bidaltzen oraindik atxikitako arrastatzeak.  
Elementuaren beraren [destroy](../erd-editor-element.md#destroy) metodoak emandako biltegi partekatu guztiak suntsitzen ditu, loturarenak barne, eta haiek atxikitakoa baztertzen du; beraz, suntsitu lehenik lotura.  
Suntsitu lotura bat editore bera edo pareko-biltegi bera `Y.Doc` berera berriro lotu aurretik; `error` batekin gelditu denak dagoeneko askatu du.

```js
binding.destroy();
editor.destroy();
```

## Presentzia {#presence}

[awareness](#awareness) erabilita, editorearen kurtsorea, fokuratutako taula edo gelaxka, hautapena eta arrastatze-laukia bere Awareness egoera lokalaren `erd` eremuan bidaiatzen dute, inoiz `Y.Doc` barruan ez; beraz, ez dira inoiz sartzen gelaren historian, bere argazkian edo iraunkortzen den `Y.Doc` batean.  
Besteek lankide baten presentzia marrazten duten bezala marrazten dituzte. Ikus [focusTracker](./collaborative-editing.md#focustracker). Sartzen den bezero batek gelak dagoeneko erakusten duen presentzia marrazten du.  
Elementuak bere fokua eta hautapena 30 segundoro bidaltzen ditu berriro, eta bere arrastatze-laukia segundoro. Birbidalketa horietako bakoitza besteengana iristen da azkena errepikatzen duenean ere, erabiltzaile batek oraindik atxikitzen duena inoiz iraungi ez dadin.

Alde egiten duen bezeroa berehala ahazten da.  
Awareness mekanismoak haren egoera kentzen duenean, edo bere `erd` eremua `null` bihurtzen denean ([destroy](#destroy) metodoak ezartzen duen bezala) edo beste editore bat aipatzen duenean, loturak editore horren kurtsorea, fokua, hautapena eta arrastatze-laukia kentzen ditu elementutik [forgetPeer](./collaborative-editing.md#forgetpeer) metodoarekin, iraungi arte itxaron beharrean.  
Mantendu egiten ditu beste bezero batek editore bera erakusten duen bitartean, gelaren beste `Y.Doc` batera berriro lotutako elementu batek egiten duen bezala.

## Lineaz kanpoko edizioak eta berriro sartzeak {#offline-edits-and-rejoins}

Hornitzailetik deskonektatuta geratu den bezero batek editatzen jarraitzen du. Bere edizioak bere `Y.Doc` lokalean itxaroten dute, ez biltegi partekatuan, eta hornitzailea berriro konektatu eta sinkronizatzen denean iristen dira besteengana.

Trinkotzaile batek bezeroak urrun zegoen bitartean inoiz aplikatu ez zituen edizioak bildu dituenean, argazkiak ditu edizio horiek; beraz, berriro konektatzean, bezeroak argazkian irekitzen du berriro `rejoin('snapshot')` erabiliz, bere editoreak oraindik atxikita zituen arrastatzeak, tamaina-aldaketak eta kolore-aldaketak bidali ondoren. Bezeroak aplikatuta zeukan guztiaren bilketa batek ez du ezer berriro irekitzen.  
Lotura batek sartu zen hasieraketaren argazki batera berriro sartzeak argazkiak ez dituen edizio guztiak erreproduzitzen ditu, bezero honek urrun zegoela egindakoak barne; beraz, bat ere ez da galtzen. Beste hasieraketa batera berriro sartzeak ez du ezer mantentzen, [Gela hasieratzea](#seeding-a-room) atalak azaltzen duen bezala.

Berriro sartze guztiek desegite-historia, hautapena eta fokua garbitzen dituzte, eta irekita dagoen [Fluxu](../../guide/guides/visualization.md#flow-mode) ikuspegi bat, [erlazio-marrazketa](../../guide/guides/editing-start.md#relationship-creation) bat eta ohar, taula-taldearen izen edo gelaxka editore bat ixten dituzte, argazkiak jada ez duena izen dezaketelako.  
Idatzi baina oraindik sartu gabeko taula-taldearen izen bat baztertzen da. Ixten den izen logikoaren gelaxka batek izen fisikoa eratortzen du irakurleak idatzitako izen logiko batetik, berriro irekitako dokumentuak oraindik duen lekuan, gelaxka horren edozein itxierak egiten duen bezala. Eratorpen hori ohiko edizio bat da: gelak erregistratzen du, desegite-urrats bat sortzen du eta `change` igortzen du. Ikus [reseed](./collaborative-editing.md#reseed).  
Gelara sartu zen lotura batek irakurleak ikusten duena mantentzen du: korritze-posizioa, zoom-maila eta fitxa, eta irakurtzeko soilik dagoen irakurle batek aldatutako ezarpenak.  
Irakurleak berak erakutsi zituen Izenen ikuspegia eta kode-ezarpenak (Kode-sortzailearen lengoaia, izenen idazkera eta mugatzaile mota) ere mantentzen ditu, bakoitzaren [blokeoa](../../guide/guides/settings.md#lock) berriro sartu aurretik aktibatuta zegoen eta ondoren ere aktibatuta dagoen bitartean, balio blokeatu berarekin.  
Mantentzen duen horietako ezer ez da `value` balioan agertzen, berriro irekitako dokumentuaren ezarpenak jakinarazten dituena. Ikus [reseed](./collaborative-editing.md#reseed) `keepScreen` aukerarekin.  
Azken kargatik erakutsi gabe dagoen elementu baten korritze-posizioa eta zoom-maila, eta oraindik sartu gabeko lotura baten pantaila osoa, argazkiak jartzen dituen lekuan irekitzen dira.  
Pareko-biltegi batek ez du pantailarik, beraz bere berriro sartzeak ez du ezer mantentzen.

## Irakurtzeko soilik dauden editoreak {#read-only-editors}

Gela batera lotutako [irakurtzeko soilik](../erd-editor-element.md#readonly) dagoen elementu batek ez du ezer idazten gelaren historian: bere biltegi partekatuak ez du aldaketarik bidaltzen, bere jarraitzaileak eta erregistroen esku-ematea baizik, eta gelak [ez ditu bata ez bestea erregistratzen](#what-the-room-holds).  
Hala ere, gelak dakartzan edizio guztiak aplikatzen ditu, eta [awareness](#awareness) erabilita bere irakurlearen kurtsorea, fokua, hautapena eta arrastatze-laukia besteengana iristen dira oraindik.  
Irakurleak aldatzen dituen ezarpenak bere pantailan geratzen dira, irakurtzeko soilik dagoen edozein editoretan bezala.  
[seed](#seed) ez da ukatzen: irakurtzeko soilik dagoen elementu batek gela huts bat hasieratzen du duen dokumentuarekin, edo `value` emanda, harekin.

## Gelak zer duen {#what-the-room-holds}

Loturak diagrama `Y.Doc`-aren bi izenetan gordetzen du: `erd:snapshot`, dokumentuaren argazkia duen mapa bat, eta `erd:log`, ordutik editoreak bidalitako ekintza-sorten array bat. Iraunkortasun-hornitzaile batek biak gordetzen ditu `Y.Doc`-aren gainerakoarekin.

Argazkiak dokumentuaren [runtimeValue](../erd-editor-element.md#runtimevalue) balioa du, kendutako entitateak barne, bere elkarlan-erregistroak eta erregistro-bertsioa, eta idazle bakoitzaren edizioak zenbateraino dauden bertan bilduta. Hasieraketa batek idazten du, eta trinkotzaile baten bilketa guztiek ere bai.  
`5.1.1` baino lehenagoko `@dineug/erd-editor` batean egindako hasieraketa batek edo bilketa batek ohar bat ere taula-talde batean ez duen argazki bat idazten du. Ikus [Bertsioak nahastea](./collaborative-editing.md#mixing-releases).  
Erregistroko sarrera bakoitza editoreak bidali zuen bezalako sorta bat da, bere meta barne, bidaltzailearen editore-identifikatzailea eta ezizena daramatzana.  
Korritzeak, zoomak, fitxa-aldaketak, presentzia eta erregistroen esku-ematea ez dira inoiz erregistratzen. Editoreak bidaltzen duen beste aldaketa guztia bai, bere [blokeoaren](../../guide/guides/settings.md#lock) azpian egindako Izenen ikuspegiaren aldaketa barne, beste bezero guztiek baztertzen dutena.  
Bere blokeoaren azpian aldatutako Kode-sortzailearen lengoaia, izenen idazkera edo mugatzaile mota ez da inoiz bidaltzen; beraz, editore horren pantailan geratzen da eta ez da inoiz gelara iristen.

Iraunkortasun-hornitzaile batek itzultzen duen `Y.Doc` batek duen diagrama irekitzen du, argazkia duen edozein `Y.Doc` lotura batek irekitzen duen bezala. Ikus [Erabilera](#usage).

Argazkia ez da fitxategi bat: bere exekuzio-garaiko balioak kendutako entitateak ditu, fitxategi batek izan behar ez dituenak.  
Gelaren diagrama biltegiratzera idazteko, gorde lotutako elementu baten [value](../erd-editor-element.md#value) balioa bere [change](../erd-editor-element.md#change) gertaera igortzen den bakoitzean.  
Gorde ere behin lotu ondoren, `value` eman zaion [seed](#seed) baten ondoren eta [rejoin](#onrejoin) entzule batean, karga horietako batek ere ez baitu `change` igortzen.  
[Irakurtzeko soilik](../erd-editor-element.md#readonly) dagoen elementu batek ez du inoiz `change` igortzen; beraz, gorde irakurtzeko soilik ez dagoen batetik, edo irakurri `value` lotutako pareko-biltegi batetik, gelaren edizioak iristen diren heinean aplikatzen dituena.  
[replicationStore](./remote-storage.md) bat ezin da lotu, loturak behar dituen metodoak ez dituelako, eta lotutako elementu baten biltegi partekatutik elikatutako batek gelaren edizioak galtzen ditu. Ikus [Martxan dagoen editore bat erreplikatzea](./remote-storage.md#replicating-a-live-editor).

Egitura pribatua da eta [ERD_YJS_FORMAT](#exports) balioarekin alda daiteke.  
Irakurri gela bat lotura baten bidez soilik, eta utzi `erd:` izenak eta `erd` Awareness eremua loturari.

## Gela trinkotzea {#compacting-a-room}

Gelaren historia edizio bakoitzarekin hazten da, eta sartzen den bezero bakoitzak osorik erreproduzitzen du, zerbaitek bildu arte.  
`bindPeerStore` funtzioak `@dineug/erd-editor/peer.js` moduluko editorerik gabeko pareko-biltegi bat lotzen du eta `ErdYjsPeerBinding` bat itzultzen du: [seed](#seed), [on](#erdyjsbinding) eta [destroy](#destroy) berak, [compact](#compact) metodoarekin.  
Zerbitzariaren ondoan dagoen Node prozesu batean lotutako pareko-biltegi batek, albo-prozesu batek, historia bere diagramaren argazki batean biltzen du.  
Elementu baten loturak ez du inoiz biltzen, eta `compactAfter` gabe eta `compact()` deirik gabe lotutako pareko-biltegi bat editorerik gabeko pareko arrunt bat da.

```ts
function bindPeerStore(
  peer: PeerStore,
  doc: Y.Doc,
  options?: PeerBindOptions
): ErdYjsPeerBinding;

type ErdYjsPeerBinding = ErdYjsBinding & {
  compact: () => CompactResult;
};
```

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols y-websocket ws
```

```js
import { createPeerStore } from '@dineug/erd-editor/peer.js';
import { bindPeerStore } from '@dineug/erd-editor-yjs';
import WebSocket from 'ws';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc, {
  WebSocketPolyfill: WebSocket,
});
const synced = new Promise(resolve => {
  provider.on('sync', function onSync(isSynced) {
    if (!isSynced) return;
    provider.off('sync', onSync);
    resolve();
  });
});

const peer = createPeerStore({ nickname: 'compactor', presence: false });
const binding = bindPeerStore(peer, doc, {
  awareness: provider.awareness,
  compactAfter: 1000,
  synced,
});
binding.on('error', error => console.error(error));

process.on('SIGTERM', () => {
  binding.destroy(); // first, so the peer store's held drags still reach the room
  peer.destroy();
  provider.destroy();
  doc.destroy(); // ends the provider's Awareness timer, so the process can exit
});
```

Pareko-biltegia zurea izaten jarraitzen du: loturak ez du inoiz suntsitzen. Bere ezizena `createPeerStore` funtzioari eman zaiona da, eta `presence: false` aukerak berak fokurik bidal ez dezan eragozten du.

Bilketa batek argazkia pareko-biltegiaren exekuzio-garaiko balioarekin, erregistroekin eta erregistro-bertsioarekin idazten du, eta hark estaltzen dituen erregistro-sarrerak eta beste hasieraketa bateko sarrera guztiak ezabatzen ditu, dena transakzio bakarrean.  
Dena aplikatu zuten bezeroek sarrerak joaten ikusten dituzte; aplikatu ez zuen bezero batek argazkian irekitzen du berriro (ikus [Lineaz kanpoko edizioak eta berriro sartzeak](#offline-edits-and-rejoins)).  
Bilketa bakoitzak diagrama osoa berridazten du argazkian; beraz, bakoitzak bezero guztiei diagramaren exekuzio-garaiko JSONaren eta erregistroen tamaina inguruko eguneratze bat bidaltzen die, sarrera gutxi hartu arren. Ezarri `compactAfter` bilketa batek hartzen dituen sarrerek diagramaren kopia bat gainditzeko adina altua.

### PeerBindOptions {#peerbindoptions}

```ts
type PeerBindOptions = CompactOptions & {
  awareness?: Awareness;
};

type CompactOptions = {
  compactAfter?: number;
  synced?: Promise<void>;
  electionGraceMs?: number;
  retainMs?: number;
};
```

| Aukera | Lehenetsia | Deskribapena |
| --- | --- | --- |
| `awareness` | Bat ere ez | Pareko-biltegia gelaren Awareness mekanismoan erakusten du, [awareness](#awareness) aukerak elementu bati egiten dion bezala. Bere kabuz biltzen duen trinkotzaile bat hantxe markatzen da, elkar ikusten duten trinkotzaileek bat hauta dezaten biltzeko, eta beste bezerorik ikusten ez duen batek ez du ezer biltzen bere kabuz. Ikus [Gela bakoitzeko trinkotzaile bat](#one-compactor-per-room). Hura gabe, trinkotzaile batek bere kabuz biltzen du hautaketarik eta itxaronaldirik gabe. |
| `compactAfter` | Bat ere ez | Bildu bere kabuz bilketa batek hartuko lituzkeen erregistro-sarrera hainbeste izan direnean. Hura gabe, edo `synced` gabe, `compact()` metodoak bakarrik biltzen du, baita berriz jartzen duen bilketak ere (ikus [Gela bakoitzeko trinkotzaile bat](#one-compactor-per-room)). |
| `synced` | Bat ere ez | Hornitzaileak sinkronizatu duenean ebazten den promesa bat. Bilketarik ez da hori baino lehen egiten, `compact()` barne. Hura gabe, ezer ez da bere kabuz biltzen eta `compact()` metodoak berehala biltzen du. |
| `electionGraceMs` | `3000` | `awareness` erabilita, trinkotzaileak gela zenbat denboran behatzen duen bere kabuz bildu aurretik, `synced` ondoren eta berriz ere inor ez zegoenean beste bezeroak agertzen direnean. |
| `retainMs` | `600000` (hamar minutu) | Bilketa baten sarrerak berriz jartzeko zenbat denboran mantentzen diren (ikus [Gela bakoitzeko trinkotzaile bat](#one-compactor-per-room)), bilketaren ondoren gelak bidaltzen duen lehen eguneratzetik zenbatuta. |

Baliogabeko aukera batek, edo baztertzen den `synced` batek, [error](#onerror) igotzen du.

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

Berehala biltzen du, hautaketarik, itxaronaldirik edo atalaserik gabe.  
Lehenik gelaren uneko argazkia hartzen du, berriro sartze bat barne, eta bere pareko-biltegiak oraindik atxikitakoa bidaltzen du.  
`{ compacted: true, generation }` erantzuten du, non `generation` argazkiaren bilketak zenbatzen dituen: `0` hasieraketa batean, bat gehiago bilketa bakoitzeko.  
Bestela `{ compacted: false, reason }` erantzuten du:

- `'destroyed'` lotura suntsitu edo geldiarazi ondoren, eta lotzean [ukatu](#onerror) zen lotura batean, `synced` ebatzi aurretik ere;
- `'not-synced'` `synced` ebatzi aurretik;
- `'no-snapshot'` bezerorik hasieratu ez duen gela batean.

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## Gela bakoitzeko trinkotzaile bat {#one-compactor-per-room}

Exekutatu trinkotzaile bat zehazki gela bakoitzeko, eta hasi berri bat zaharra gelditu ondoren bakarrik. Ezerk ez du hau betearazten.  
Awareness mekanismoan elkar ikusten duten trinkotzaileen artean, Yjs bezero-identifikatzaile txikiena duenak bakarrik biltzen du bere kabuz, eta hura joaten denean, edo bere `synced` baztertzen denean, hurrengoak berehala hartzen du lekua.  
Bere Awareness mekanismoak beste bezerorik erakusten ez duen trinkotzaile batek, bere socketa ixten denean eta guztiak uzten dituenean bezala, ez du ezer biltzen bere kabuz, besteak berriro agertu arte eta gela `electionGraceMs` denboran behatu arte.

Bata bestearengandik deskonektatutako bi trinkotzailek, edo aurrekoa oraindik martxan duen berrabiarazte batek, bakoitzak bildu dezakete oraindik.  
Orduan gelak bi argazkietako bat mantentzen du, eta bere argazkia galdu duen trinkotzaileak bildu zuen eta irabazleak ez duena jartzen du berriz, hura atxikita duen bitartean: `retainMs`, eta gehienez bere azken 1.000 sarrerak, bakoitza edozein tamainatakoa izanda ere.  
Beraz ez da ezer galtzen bere argazkia galtzen duen trinkotzailea berriro konektatzen dena denean, bereizita zeudela 1.000 sarrera baino gehiago bildu ez zituen bitartean.  
Konektatuta jarraitu zuena denean eta bere atxikipena iraungi denean, gelaren argazkiak eta historiak ez dute bildu zuena, berriro bildu arte. Edizio horiek galdu dituen bezero batek, edo bien bitartean sartzen den batek, ez ditu; eta trinkotzaileak edizioak bildu dituen idazle bakoitzaren geroko edizioak atxikitzen ditu. Trinkotzailearen hurrengo bilketak guztiak itzultzen ditu, salbu eta irabazten duen argazkiak trinkotzaileak ez zituen edizioak bazituen: orduan argazki horretan irekitzen da berriro, eta bildu zuena betiko galtzen du.

Trinkotzaile batek berak egindako bilketa batean jartzen du berriro, irabazten duen argazkira iritsi ondoren egina, hautaketarik, itxaronaldirik edo atalaserik gabe, eta bezero guztiek bilketa horretan irekitzen dute berriro `rejoin('snapshot')` erabiliz.  
Berriz jarritako edizioak ez dira bilketa horretatik kanpo inongo bezerorengana iristen; beraz, une guztian konektatuta egon den bezero batek besteekin eta geroago sartzen den batekin berdin amaitzen du, beste idazle baten geroko edizio batek haietako batean oinarritzen denean ere, beste bezero batek gehitutako taula baten izen-aldaketa bezala.  
Berriz jartze bakoitzak bezero bakoitzari berriro sartze hori kostatzen dio, [berriro sartzeak galtzen duenarekin](#offline-edits-and-rejoins). Bi trinkotzailek batera berriz jartzen dutenean, bezero guztiek berdin amaitzen dute oraindik, nahiz eta edizio bat oinarritzen den ediziotik lehenago aplikatuta gera daitekeen.  
Bilketa hori exekutatu aurretik suntsitutako edo geldiarazitako lotura batek, `rejoin` entzule batek suntsitzen duenean bezala, horren ordez edizioak bakarka jartzen ditu berriz. Bat ere ez da galtzen, baina orduan une guztian konektatuta egon den bezero batek edizio bat aplika dezake hartan oinarritzen den beste idazle baten edizioaren ondoren, eta geroago sartzen den batetik desberdin amaitu.

## Mugak {#limits}

- **Ikuspen-eremua pantaila bakoitzean geratzen da.** Korritzeak, zoomak eta fitxa-aldaketak [ez dira inoiz erregistratzen](#what-the-room-holds), nahiz eta `getSharedStore` bidez konektatutako saio batek bidaltzen dituen (han ere ez dute beste inoren ikuspegirik edo fitxarik mugitzen). Irakurle bakoitzak berea mantentzen du, eta loturak bere Awareness egoeran bakarrik erakusten du, oraindik ezerk irakurtzen ez duena. `Viewport` edo `Canvas Type` [blokeoa](../../guide/guides/settings.md#lock) desaktibatuta, bezero bakoitzaren `value` balioak berea gordetzen du; blokeoak aktibatuta daudela, dokumentu berri batek dituen bezala, bezero guztiek blokeatutakoa gordetzen dute.
- **Argazkia sarrera batean hazten da lotura bakoitzeko.** Gelan inoiz idatzi duen lotura bakoitzeko, bere edizioak zenbateraino dauden bilduta gordetzen du, eta inoiz ez du bat ere botatzen. Berriz egindako lotura batek, edo beste hasieraketa batera pasatu denak, berriro zenbatzen du, eta berriz jartzen duen bilketa bakoitzak ere bai. Sarrera bat 32 karaktereko identifikatzaile bat eta zenbaki bat da; beraz, hamar mila idazketa-saiok zenbait ehun kilobyte gehitzen dizkiote argazki eta bilketa bakoitzari.
- **Gune batek eta gela batek ez dute ezer elkarri birbidaltzen.** Gela batera eta kodetze-agente baten [agente-gunera](../../mcp/live-and-headless.md#live), edo `getSharedStore()` bidez beste edozein garraiotara, lotutako elementu batek bien edizioak aplikatzen ditu, baina bakoitzak ez ditu besteak entzuten, biltegi partekatu batek ez baitu jasotakoa aurrera bidaltzen.
- **Une berean egindako gehiketak desberdin zerrenda daitezke.** Bi bezerok batera gehitutako taulak edo oharrak beste ordena batean egon daitezke bezero bakoitzaren diagraman, `getSharedStore` bidez konektatutako saio batean bezala. Ikus [Aldi bereko edizioak](./collaborative-editing.md#concurrent-edits).
- **Une berean egindako koloreak eta beste aldaketa batzuk desberdin amai daitezke.** Kolore-aldaketa erregistro-bertsiorik gabe erregistratzen da, eta bezero bakoitzak berea jartzen dio aplikatzen duenean. Beraz, taula, ohar edo taula-talde bereko bi kolore-aldaketa batera eginez gero, bezeroak, eta geroago sartu eta erregistroa erreproduzitzen duen bezero bat, kolore desberdinetan gera daitezke. Gauza bera gertatzen da bezero bakoitzak entzuten duen ordenan aplikatzen dituen beste aldaketekin, taula edo indize bereko bi zutabe-mugimendu edo datu-basearen bi aldaketa bezala. Ikus [Aldi bereko edizioak](./collaborative-editing.md#concurrent-edits).
- **Alde egiten duen kurtsore bat zerbitzariaren zain geratzen da.** Loturak parekoaren kurtsorea garbitzen du Awareness mekanismoak kentzen duen bezain laster. Socket bat ixten denean socket horrek lehenik gehitu zituen Awareness egoerak soilik kentzen dituen zerbitzari batek, berriro konektatu zen bezero bat besteen pantailetan mantentzen du bera joan ondoren, Awareness mekanismoak denbora-muga ezartzen dion arte, 30 segundo geroago. Socket batek azkenekoz idatzi duen egoera guztiak kentzen dituen batek, eguneratze bat gehiketa bat bezainbeste, berehala garbitzen du.

## Esportazioak {#exports}

| Esportazioa | Deskribapena |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | `<erd-editor>` elementu bat lotzen du. Ikus [Erabilera](#usage). [ErdYjsBinding](#erdyjsbinding) bat itzultzen du. |
| `bindPeerStore(peer, doc, options?)` | `@dineug/erd-editor/peer.js` moduluko pareko-biltegi bat lotzen du. Ikus [Gela trinkotzea](#compacting-a-room). Gauza bera itzultzen du [compact](#compact) metodoarekin (`ErdYjsPeerBinding`). |
| `ERD_YJS_FORMAT` | Bertsio honek idazten duen `Y.Doc` egitura, `1`; lotura batek beste batean idatzitako gela bati uko egiten dio. |

Motak: `BindOptions`, `PeerBindOptions`, `CompactOptions`, `CompactResult`, `BindingEvents`, `RejoinReason`, `ErdYjsBinding`, `ErdYjsPeerBinding`.
