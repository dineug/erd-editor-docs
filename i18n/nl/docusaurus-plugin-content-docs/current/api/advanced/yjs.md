---
sidebar_position: 2
description: Houd een <erd-editor>-element of een headless peerstore synchroon via een Yjs-document met @dineug/erd-editor-yjs, initialiseer een room, toon de aanwezigheid via Awareness, blijf offline bewerken en voeg met een compactiesidecar de geschiedenis van de room samen.
---

# Yjs

`@dineug/erd-editor-yjs` houdt diagrammen synchroon via een [Yjs](https://github.com/yjs/yjs)-document. Het is een eigen pakket, voor het eerst uitgebracht als `0.1.0` naast `@dineug/erd-editor` `5.1.0`.  
`bindErdEditor` bindt een `<erd-editor>`-element, en `bindPeerStore` een headless peerstore uit `@dineug/erd-editor/peer.js`, aan een `Y.Doc`.  
Elke provider die de `Y.Doc` draagt, draagt ook het diagram: een websocketserver, WebRTC, IndexedDB of je eigen provider. De provider en de `Y.Doc` blijven van jou: de binding verbindt ze nooit, verbreekt nooit hun verbinding en vernietigt ze nooit.

De bewerkingen reizen als de eigen actiebatches van de editor, die de binding bewaart zoals de store ze verstuurde.  
De registers voor gezamenlijk bewerken van de editor handelen bewerkingen op hetzelfde moment dus af zoals in een sessie die via `getSharedStore` is opgezet, met dezelfde uitzonderingen, zoals een kleurwijziging — zie [Gelijktijdige bewerkingen](./collaborative-editing.md#concurrent-edits).  
Cursors, focus, selecties en sleepkaders reizen via de Awareness van de provider — zie [Aanwezigheid](#presence).  
Vergeleken met zelf een gedeelde store aan een transport koppelen voegt de binding toe:

- Een client die zich aansluit opent het diagram dat de room bevat, zonder dat een [runtimeValue](../erd-editor-element.md#runtimevalue) van een draaiende editor wordt doorgegeven.
- Een client die is afgesneden blijft bewerken, en zijn bewerkingen komen aan zodra hij weer verbinding maakt — zie [Offline bewerkingen en opnieuw aansluiten](#offline-edits-and-rejoins).
- Een `Y.Doc` die een persistentieprovider teruggeeft opent het diagram dat hij bevat — zie [Wat de room bevat](#what-the-room-holds).
- Een optionele Node-sidecar voegt de geschiedenis van de room samen tot één snapshot — zie [Een room compacteren](#compacting-a-room).

De binding heeft de vijf methoden nodig die `5.1.0` aan de gedeelde store en de peerstore toevoegde — [getLWW](./collaborative-editing.md#getlww), [mergeLWW](./collaborative-editing.md#mergelww), [getVersion](./collaborative-editing.md#getversion), [forgetPeer](./collaborative-editing.md#forgetpeer) en [reseed](./collaborative-editing.md#reseed) — en roept zelf alles aan wat ze ervan nodig heeft.

## Installatie {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`, `yjs` en `y-protocols` zijn peer-afhankelijkheden, zodat een pagina van elk één kopie bevat: `@dineug/erd-editor` `5.1.0` of later binnen `5.x`, `yjs` `13.6` of later binnen `13.x` en `y-protocols` `1.0` of later binnen `1.x`.  
Het pakket neemt alleen hun typen over en werkt op de `Y.Doc` en `Awareness` die je doorgeeft, dus het laadt zelf geen Yjs-, y-protocols- of editorcode.  
Twee kopieën van Yjs in één pagina verstoren elkaars constructorcontroles, en de tweede logt `Yjs was already imported`. Als je code en een provider `yjs` uit twee verschillende locaties halen, ontdubbel het dan in de bundler (Vite: `resolve.dedupe: ['yjs']`).

Het pakket is alleen ESM (`"type": "module"`), met één ingangspunt, de pakketroot, en is gemarkeerd als vrij van neveneffecten, zodat een bundel die alleen `bindErdEditor` importeert de compactor weglaat.  
`bindErdEditor` heeft een DOM nodig, omdat het een gedefinieerd `<erd-editor>`-element bindt. `bindPeerStore` draait ook in gewoon Node, op Node.js 22.12 of later, zoals ook de [compactiesidecar](#compacting-a-room) doet.

## Gebruik {#usage}

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

`wss://yjs.example.com` en `my-diagram` staan voor je eigen server en room.  
Bind en initialiseer pas nadat de provider is gesynchroniseerd, zoals het event `sync` van y-websocket met `true` aangeeft. Een initialisatie die eerder plaatsvindt kan het diagram van de room vervangen — zie [Een room initialiseren](#seeding-a-room).

Wanneer de `Y.Doc` bij het binden de snapshot van een room bevat, opent de binding die meteen in het element: ze laadt de snapshot met zijn registers en versie, zoals [reseed](./collaborative-editing.md#reseed) doet, en past elke sindsdien gelogde bewerking toe.  
Dat openen wist en sluit wat een nieuwe aansluiting ook wist en sluit — zie [Offline bewerkingen en opnieuw aansluiten](#offline-edits-and-rejoins) — en het element opent waar de snapshot het plaatst. Bij dit eerste openen treedt geen `rejoin` op.  
Wanneer de `Y.Doc` geen snapshot bevat, zoals in een lege room of voordat de provider is gesynchroniseerd, behoudt het element zijn document, en schrijft de binding niets naar de room totdat er een snapshot verschijnt, de eigen [seed](#seed) of die van een andere client.

`bindErdEditor` neemt met [getSharedStore](../erd-editor-element.md#getsharedstore) één gedeelde store van het element, en [destroy](#destroy) geeft die weer vrij.  
Het element moet al een `<erd-editor>` zijn, met zijn ingangspunt geïmporteerd of `defineErdEditor()` aangeroepen — zie [De elementen registreren](../installation.md#registering-the-elements). Zolang de tag niet is gedefinieerd, is een `<erd-editor>` een gewoon `HTMLElement`, dat de browser upgradet zodra de tag is gedefinieerd en het element in het document staat. Voor een element dat nog niet is geüpgraded gooit `bindErdEditor` een `TypeError` in plaats van `error` te versturen.

De bewerkingen van de room worden op het element toegepast, en versturen [change](../erd-editor-element.md#change), zoals die van een medebewerker, de bewerkingen die na het openen van een snapshot opnieuw worden afgespeeld daarbij inbegrepen.  
Het openen van een snapshot, bij het binden of bij een nieuwe aansluiting, maakt geen stap in de geschiedenis, verstuurt geen `change` en schrijft niets naar de room, behalve de afleiding van de logische naam die [Offline bewerkingen en opnieuw aansluiten](#offline-edits-and-rejoins) beschrijft.  
Om een ander document in een geïnitialiseerde room te laden, maak je een wijziging die elke client toepast: wijs [value](../erd-editor-element.md#value) toe, roep [clear](../erd-editor-element.md#clear) aan of importeer er een.  
[setInitialValue](../erd-editor-element.md#setinitialvalue) wordt nooit naar de room geschreven, omdat een gedeelde store het niet verstuurt, dus het wijzigt alleen dat element terwijl elke andere client het diagram van de room behoudt. Initialiseer een lege room in plaats daarvan met [seed](#seed).

Eén `Y.Doc` bevat één diagram. De binding bewaart het onder de `erd:`-namen van de `Y.Doc` en stelt het veld `erd` van de lokale Awareness-status in, en laat elke andere naam en elk ander veld met rust.  
Geef elk gebonden element een eigen `Y.Doc` en een eigen Awareness, zoals elke client van een room die heeft: twee bindingen die één Awareness delen overschrijven elkaars veld `erd`.

## Een room initialiseren {#seeding-a-room}

Een room bevat geen diagram totdat een client die [initialiseert](#seed).  
Wat een editor intussen bevat gaat in zijn eigen seed, en wijkt voor de seed van een andere client als die eerder aankomt: de binding opent dan opnieuw op die seed met `rejoin('snapshot')`, en het document dat het element bevatte, met wat er sinds het binden in is bewerkt, is verdwenen.

Wanneer twee clients tegelijk initialiseren, wint één seed op elke client.  
De andere initialiseerder opent opnieuw op die seed met `rejoin('seedLost')` en verliest wat hij sinds zijn seed heeft bewerkt, en dat geldt ook voor een client die zich bij de verliezende seed had aangesloten, met `rejoin('snapshot')`. Hun bewerkingen in de verliezende seed bereiken niemand.  
Een seed die wordt gemaakt voordat de provider is gesynchroniseerd, telt als gemaakt op hetzelfde moment als de seed waar het diagram van de room vandaan kwam, dus hij kan die verslaan en het diagram van de room vervangen.

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

De `Awareness` die cursors, focus, selecties en sleepkaders draagt, zoals die van de provider.  
Daarmee schakelt de binding de muis- en focustrackers van het element in en tekent ze de aanwezigheid van de andere clients op het element — zie [Aanwezigheid](#presence).  
Zonder deze optie synchroniseert alleen het diagram: het element verstuurt geen cursor, focus of selectie en tekent die van niemand anders.

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

De naam die de anderen naast de cursor van deze editor zien.  
De gedeelde store van het element leest hem telkens wanneer hij verstuurt, zoals bij [getSharedStore](./collaborative-editing.md#getnickname), en andere gebruikers zien `user` wanneer hij ontbreekt of leeg is.

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

`on(event, listener)` geeft een functie terug die de listener verwijdert.

### seed {#seed}

Schrijft de eerste snapshot van de room vanuit het document van de editor en geeft `true` terug.  
Met `value`, de tekst van een document in elke vorm die [setInitialValue](../erd-editor-element.md#setinitialvalue) leest, laadt het die eerst in de editor.  
Daarna laat het, zonder ze te loggen, de sleepbewegingen, formaatwijzigingen en kleurwijzigingen vallen die de editor nog achterhoudt, zodat geen ervan na de snapshot in de room terechtkomt. Zonder `value` toont de snapshot ze al, omdat hij het document van de editor neemt; met `value` hoorden ze bij het document dat `value` verving.  
Vervolgens schrijft het de snapshot die [Wat de room bevat](#what-the-room-holds) beschrijft.  
Zodra de room een snapshot bevat, geeft het `false` terug en schrijft het niets, zonder `value` te laden, zodat elke client het na het binden kan aanroepen. Het geeft ook `false` terug zodra de binding is vernietigd of gestopt, en bij een binding die bij het binden is [geweigerd](#onerror).

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

De binding heeft de editor opnieuw geopend op de snapshot van de room, zoals [reseed](./collaborative-editing.md#reseed) doet; [Offline bewerkingen en opnieuw aansluiten](#offline-edits-and-rejoins) zegt wat ze behoudt en wat ze verliest.  
`reason` geeft aan waarom:

- `'snapshot'`: de snapshot bevat bewerkingen die de binding niet had toegepast, omdat ze weg was terwijl een compactor ze samenvoegde, of omdat een compactor in een eigen samenvoeging terugzette wat hij had samengevoegd in een snapshot die door die van een andere compactor was vervangen (zie [Eén compactor per room](#one-compactor-per-room)). Het is ook de reden wanneer de snapshot de eerste is die een binding van een lege room bereikt, en wanneer het de seed van een ander is en deze binding zich had aangesloten bij een seed die ze niet zelf schreef.
- `'seedLost'`: de seed van een andere client won van de seed die deze binding schreef.

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

De binding weigerde te binden, stopte of wees een optie af. Elk bericht begint met `erd-editor-yjs: `.

Bij het binden bindt ze niets wanneer:

- de editor of peerstore al aan deze `Y.Doc` is gebonden;
- zijn `@dineug/erd-editor` is gebouwd vóór `5.1.0`; de binding vernietigt de gedeelde store die ze van een element nam;
- de peerstore is vernietigd voordat hij werd gebonden;
- de room een snapshot bevat in een indeling die deze versie niet leest (zie [Wat de room bevat](#what-the-room-holds)).

Zo'n binding verstuurt `error` in een microtask, zodat een listener die direct na de aanroep wordt toegevoegd het hoort, en er wordt nooit een `rejoin` op verstuurd.

Later stopt de binding wanneer:

- de snapshot van de room verandert in een indeling die deze versie niet leest. Elke binding van deze versie stopt, elke editor behoudt wat hij had toegepast en wat daarna wordt bewerkt wordt niet geschreven;
- haar peerstore onder haar uit is vernietigd, wat wordt ontdekt de volgende keer dat de room verandert of `seed()` of `compact()` wordt aangeroepen.

Een binding die stopt geeft de gedeelde store die ze nam vrij, en haar store en `Y.Doc` als paar, zoals [destroy](#destroy) doet, en behoudt haar listeners.

Alleen voor `bindPeerStore` leiden deze tot `error` waarna de binding doorgaat:

- `compactAfter` is geen positief geheel getal: de binding voegt alleen samen wanneer erom wordt gevraagd;
- `electionGraceMs` of `retainMs` is geen getal van 0 tot 2.147.483.647 ms: de standaardwaarde komt ervoor in de plaats, omdat een timer voorbij dat bereik meteen afgaat;
- `synced` wordt afgewezen: de binding voegt nooit samen en laat de verkiezing over aan de andere compactors (zie [Eén compactor per room](#one-compactor-per-room)).

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

Stuurt de sleepbewegingen, formaatwijzigingen en kleurwijzigingen die de editor nog achterhoudt naar de room, zet het Awareness-veld `erd` van de binding op `null`, zodat de anderen haar cursor, focus en selectie meteen laten vallen, en stopt met het observeren van de `Y.Doc` en de Awareness.  
Voor een element vernietigt het ook de gedeelde store die het nam, waarbij het element en zijn document blijven zoals ze zijn.  
Een tweede aanroep doet niets. Daarna bereikt wat de editor bewerkt niemand.

De peerstore, de `Y.Doc` en de provider blijven van jou, om na de binding te vernietigen: een peerstore die eerst wordt vernietigd verstuurt de sleepbewegingen die hij nog achterhield nooit.  
De eigen [destroy](../erd-editor-element.md#destroy) van het element vernietigt elke gedeelde store die het uitgaf, die van de binding inbegrepen, en laat vallen wat ze achterhouden, dus vernietig eerst de binding.  
Vernietig een binding voordat je dezelfde editor of peerstore opnieuw aan dezelfde `Y.Doc` bindt; een binding die met `error` stopte heeft al losgelaten.

```js
binding.destroy();
editor.destroy();
```

## Aanwezigheid {#presence}

Met [awareness](#awareness) reizen de cursor, de tabel of cel in focus, de selectie en het sleepkader van de editor in het veld `erd` van zijn lokale Awareness-status, nooit in de `Y.Doc`, zodat ze nooit in de geschiedenis van de room, zijn snapshot of een bewaarde `Y.Doc` terechtkomen.  
De anderen tekenen ze zoals ze de aanwezigheid van een medebewerker tekenen — zie [focusTracker](./collaborative-editing.md#focustracker) — en een client die zich aansluit tekent de aanwezigheid die de room al toont.  
Het element verstuurt zijn focus en selectie elke 30 seconden opnieuw en zijn sleepkader elke seconde. Elk van die nieuwe verzendingen bereikt de anderen ook wanneer ze gelijk is aan de vorige, zodat wat een gebruiker nog vasthoudt nooit verloopt.

Een client die vertrekt wordt meteen vergeten.  
Wanneer Awareness zijn status laat vallen, of zijn veld `erd` `null` wordt, zoals [destroy](#destroy) instelt, of een andere editor noemt, verwijdert de binding de cursor, focus, selectie en het sleepkader van die editor van het element met [forgetPeer](./collaborative-editing.md#forgetpeer) in plaats van te wachten tot ze verlopen.  
Ze behoudt ze zolang een andere client dezelfde editor nog toont, zoals een element dat opnieuw aan een andere `Y.Doc` van de room is gebonden.

## Offline bewerkingen en opnieuw aansluiten {#offline-edits-and-rejoins}

Een client die van de provider is afgesneden blijft bewerken. Zijn bewerkingen wachten in zijn lokale `Y.Doc`, niet in de gedeelde store, en bereiken de anderen wanneer de provider weer verbinding maakt en synchroniseert.

Wanneer een compactor bewerkingen heeft samengevoegd die de client niet had toegepast terwijl hij weg was, bevat de snapshot ze, dus bij het opnieuw verbinden opent de client opnieuw op de snapshot met `rejoin('snapshot')`, nadat hij de sleepbewegingen, formaatwijzigingen en kleurwijzigingen heeft verstuurd die zijn editor nog achterhield. Een samenvoeging van alleen wat de client had toegepast opent niets opnieuw.  
Een nieuwe aansluiting op een snapshot van de seed waarbij de binding zich had aangesloten speelt elke bewerking opnieuw af die de snapshot niet bevat, de eigen bewerkingen van deze client die tijdens zijn afwezigheid zijn gemaakt daarbij inbegrepen, zodat er niets verloren gaat. Een nieuwe aansluiting op een andere seed behoudt niets, zoals [Een room initialiseren](#seeding-a-room) beschrijft.

Elke nieuwe aansluiting wist de geschiedenis, de selectie en de focus, en sluit een geopende [stroomweergave](../../guide/guides/visualization.md#flow-mode), het [tekenen van een relatie](../../guide/guides/editing-start.md#relationship-creation) en een memo-, tabelgroepnaam- of celeditor af, omdat ze iets kunnen noemen wat de snapshot niet meer bevat.  
Een tabelgroepnaam die is getypt maar nog niet is bevestigd, gaat verloren. Een cel van de logische naam die sluit leidt de fysieke naam af uit een logische naam die de lezer typte, waar het heropende document die nog bevat, zoals elke sluiting van die cel doet. Die afleiding is een gewone bewerking: de room logt haar, ze maakt een stap in de geschiedenis en ze verstuurt `change` — zie [reseed](./collaborative-editing.md#reseed).  
Een binding die zich bij de room had aangesloten behoudt wat haar lezer ziet: de scrollpositie, het zoomniveau en het tabblad, en de instellingen die een lezer in alleen-lezenmodus wijzigde.  
Ze behoudt ook de naamweergave en de code-instellingen (taal van de Codegenerator, naamnotaties en type aanhalingstekens) die de lezer zelf toonde, zolang de [vergrendeling](../../guide/guides/settings.md#lock) van elk ervan vóór de nieuwe aansluiting aanstond en erna nog aanstaat op dezelfde vergrendelde waarde.  
Niets van wat ze behoudt bereikt `value`, dat de instellingen van het heropende document weergeeft — zie [reseed](./collaborative-editing.md#reseed) met `keepScreen`.  
De scrollpositie en het zoomniveau van een element dat sinds zijn laatste laadactie niet is getoond, en het hele scherm van een binding die zich nog niet had aangesloten, openen waar de snapshot ze plaatst.  
Een peerstore heeft geen scherm, dus zijn nieuwe aansluiting behoudt er geen.

## Alleen-lezen editors {#read-only-editors}

Een element in [alleen-lezenmodus](../erd-editor-element.md#readonly) dat aan een room is gebonden schrijft niets naar de geschiedenis van de room: zijn gedeelde store verstuurt geen wijziging, alleen zijn trackers en de registerhandshake, en de room [logt geen van beide](#what-the-room-holds).  
Het past nog steeds elke bewerking toe die de room draagt, en met [awareness](#awareness) bereiken de cursor, focus, selectie en het sleepkader van zijn lezer de anderen nog steeds.  
De instellingen die zijn lezer wijzigt blijven op zijn scherm staan, zoals bij elke editor in alleen-lezenmodus.  
[seed](#seed) wordt niet geweigerd: een element in alleen-lezenmodus initialiseert een lege room met het document dat het bevat, of met `value` wanneer dat is opgegeven.

## Wat de room bevat {#what-the-room-holds}

De binding bewaart het diagram onder twee namen van de `Y.Doc`: `erd:snapshot`, een map met een snapshot van het document, en `erd:log`, een array met de actiebatches van de editor sindsdien. Een persistentieprovider slaat beide op met de rest van de `Y.Doc`.

De snapshot bevat de [runtimeValue](../erd-editor-element.md#runtimevalue) van het document, verwijderde entiteiten inbegrepen, zijn registers voor gezamenlijk bewerken en versie, en hoe ver de bewerkingen van elke schrijver erin zijn samengevoegd. Een seed schrijft hem, en elke samenvoeging van een compactor ook.  
Een seed of een samenvoeging door een `@dineug/erd-editor` van vóór `5.1.1` schrijft een snapshot zonder memo in een tabelgroep — zie [Versies combineren](./collaborative-editing.md#mixing-releases).  
Elk item in het logboek is één batch zoals de editor hem verstuurde, zijn meta inbegrepen, die de editor-id en bijnaam van de afzender bevat.  
Scrolls, zooms, tabwisselingen, aanwezigheid en de registerhandshake worden nooit gelogd. Elke andere wijziging die de editor verstuurt wel, een wissel van naamweergave onder haar [vergrendeling](../../guide/guides/settings.md#lock) daarbij inbegrepen, die elke andere client laat vallen.  
Een taal van de Codegenerator, naamnotatie of type aanhalingstekens die onder zijn vergrendeling is gewijzigd wordt nooit verstuurd, dus hij blijft op het scherm van die editor staan en bereikt de room nooit.

Een `Y.Doc` die een persistentieprovider teruggeeft opent het diagram dat hij bevat, zoals een binding elke `Y.Doc` opent die een snapshot bevat — zie [Gebruik](#usage).

De snapshot is geen bestand: zijn runtimewaarde bevat verwijderde entiteiten, die een bestand niet mag bevatten.  
Om het diagram van de room naar opslag te schrijven, sla je de [value](../erd-editor-element.md#value) van een gebonden element op telkens wanneer zijn event [change](../erd-editor-element.md#change) optreedt.  
Sla hem ook één keer op na het binden, na een [seed](#seed) met een `value`, en in een [rejoin](#onrejoin)-listener, omdat geen van die laadacties `change` verstuurt.  
Een element in [alleen-lezenmodus](../erd-editor-element.md#readonly) verstuurt nooit `change`, dus sla op vanuit een element dat niet alleen-lezen is, of lees `value` van een gebonden peerstore, die de bewerkingen van de room toepast zodra ze aankomen.  
Een [replicationStore](./remote-storage.md) kan niet worden gebonden, omdat hij de methoden mist die een binding nodig heeft, en een store die wordt gevoed vanuit de gedeelde store van een gebonden element mist de bewerkingen van de room — zie [Een live editor repliceren](./remote-storage.md#replicating-a-live-editor).

De indeling is privé en kan veranderen met [ERD_YJS_FORMAT](#exports).  
Lees een room alleen via een binding en laat de `erd:`-namen en het Awareness-veld `erd` aan haar over.

## Een room compacteren {#compacting-a-room}

De geschiedenis van de room groeit met elke bewerking, en elke client die zich aansluit speelt alles opnieuw af, totdat iets haar samenvoegt.  
`bindPeerStore` bindt een headless peerstore uit `@dineug/erd-editor/peer.js` en geeft een `ErdYjsPeerBinding` terug: dezelfde [seed](#seed), [on](#erdyjsbinding) en [destroy](#destroy), met [compact](#compact).  
Een peerstore die is gebonden in een Node-proces naast de server, een sidecar, voegt de geschiedenis samen tot een snapshot van zijn eigen diagram.  
De binding van een element voegt nooit samen, en een peerstore die is gebonden zonder `compactAfter` en zonder aanroep van `compact()` is een gewone headless peer.

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

De peerstore blijft van jou: de binding vernietigt hem nooit. Zijn bijnaam is die welke aan `createPeerStore` is gegeven, en `presence: false` voorkomt dat hij een eigen focus verstuurt.

Een samenvoeging schrijft de snapshot vanuit de eigen runtimewaarde, registers en versie van de peerstore, en verwijdert de logitems die ze dekt en elk item van een andere seed, alles in één transactie.  
Clients die alles hadden toegepast zien de items verdwijnen; een client die dat niet had gedaan opent opnieuw op de snapshot (zie [Offline bewerkingen en opnieuw aansluiten](#offline-edits-and-rejoins)).  
Elke samenvoeging schrijft het hele diagram opnieuw in de snapshot, dus elke samenvoeging stuurt elke client een update ter grootte van de runtime-JSON en de registers van het diagram samen, hoe weinig items ze ook meeneemt. Stel `compactAfter` hoog genoeg in dat de items die een samenvoeging meeneemt zwaarder wegen dan één kopie van het diagram.

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

| Optie | Standaard | Beschrijving |
| --- | --- | --- |
| `awareness` | Geen | Toont de peerstore in de Awareness van de room, zoals [awareness](#awareness) dat voor een element doet. Een compactor die op eigen initiatief samenvoegt wordt daar gemarkeerd, zodat compactors die elkaar zien er één kiezen om samen te voegen, en een compactor die geen andere client ziet voegt op eigen initiatief niets samen — zie [Eén compactor per room](#one-compactor-per-room). Zonder deze optie voegt een compactor op eigen initiatief samen, zonder verkiezing en zonder wachttijd. |
| `compactAfter` | Geen | Voeg op eigen initiatief samen zodra het logboek dit aantal items bevat dat een samenvoeging zou meenemen. Zonder deze optie, of zonder `synced`, voegt alleen `compact()` samen, en de samenvoeging die terugzet (zie [Eén compactor per room](#one-compactor-per-room)). |
| `synced` | Geen | Een promise die wordt opgelost zodra de provider is gesynchroniseerd. Er komt geen samenvoeging voor, `compact()` inbegrepen. Zonder deze optie voegt niets op eigen initiatief samen en voegt `compact()` meteen samen. |
| `electionGraceMs` | `3000` | Met `awareness`: hoe lang de compactor de room in de gaten houdt voordat hij op eigen initiatief samenvoegt, na `synced` en opnieuw telkens wanneer andere clients verschijnen nadat er geen waren. |
| `retainMs` | `600000` (tien minuten) | Hoe lang de items van een samenvoeging worden vastgehouden om terug te zetten (zie [Eén compactor per room](#one-compactor-per-room)), geteld vanaf de eerste update die de room na de samenvoeging verstuurt. |

Een ongeldige optie, of een `synced` die wordt afgewezen, leidt tot [error](#onerror).

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

Voegt meteen samen, zonder verkiezing, wachttijd of drempel.  
Het neemt eerst de huidige snapshot van de room op, een nieuwe aansluiting inbegrepen, en verstuurt wat zijn peerstore nog achterhoudt.  
Het antwoordt met `{ compacted: true, generation }`, waarbij `generation` de samenvoegingen van de snapshot telt: `0` voor een seed, één hoger per samenvoeging.  
Anders antwoordt het met `{ compacted: false, reason }`:

- `'destroyed'` zodra de binding is vernietigd of gestopt, en bij een binding die bij het binden is [geweigerd](#onerror), zelfs voordat `synced` wordt opgelost;
- `'not-synced'` voordat `synced` wordt opgelost;
- `'no-snapshot'` in een room die geen enkele client heeft geïnitialiseerd.

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## Eén compactor per room {#one-compactor-per-room}

Draai precies één compactor per room, en start een nieuwe pas wanneer de oude is gestopt. Niets dwingt dit af.  
Van de compactors die elkaar in Awareness zien, voegt alleen die met de kleinste Yjs-client-id op eigen initiatief samen, en wanneer die vertrekt, of zijn `synced` wordt afgewezen, neemt de volgende het meteen over.  
Een compactor wiens Awareness geen andere client toont, zoals wanneer zijn eigen socket sluit en ze allemaal laat vallen, voegt op eigen initiatief niets samen totdat anderen weer verschijnen en hij de room `electionGraceMs` lang in de gaten heeft gehouden.

Twee compactors die van elkaar zijn afgesneden, of een herstart waarvan de voorganger nog draait, kunnen toch elk samenvoegen.  
De room houdt dan één van de twee snapshots, en de compactor wiens snapshot verloor zet terug wat hij samenvoegde en de winnaar niet bevat, zolang hij het vasthoudt: `retainMs`, en hoogstens zijn laatste 1.000 items, hoe groot elk ook is.  
Er gaat dus niets verloren wanneer de compactor wiens snapshot verliest degene is die weer verbinding maakt, zolang hij tijdens het gescheiden zijn niet meer dan 1.000 items samenvoegde.  
Wanneer hij degene is die online bleef en zijn vasthouden is verlopen, missen de snapshot en de geschiedenis van de room wat hij samenvoegde totdat hij opnieuw samenvoegt. Een client die die bewerkingen miste, of een die zich intussen aansluit, mist ze, en houdt de latere bewerkingen tegen van elke schrijver wiens bewerkingen de compactor samenvoegde. De volgende samenvoeging van de compactor brengt ze allemaal terug, tenzij de winnende snapshot bewerkingen bevatte die hij miste, waardoor hij opnieuw opent op die snapshot en wat hij samenvoegde voorgoed verliest.

Een compactor zet terug in een eigen samenvoeging, gemaakt zodra hij de winnende snapshot heeft ingehaald, zonder verkiezing, wachttijd of drempel, en elke client opent opnieuw op die samenvoeging met `rejoin('snapshot')`.  
De bewerkingen die hij terugzet bereiken geen enkele client buiten die samenvoeging om, dus een client die de hele tijd online was komt op hetzelfde uit als de anderen en als een die zich later aansluit, zelfs wanneer een latere bewerking van een andere schrijver op een ervan voortbouwt, zoals het hernoemen van een tabel die een andere client toevoegde.  
Elke terugzetting kost elke client die nieuwe aansluiting, met [wat een nieuwe aansluiting verliest](#offline-edits-and-rejoins). Wanneer twee compactors tegelijk terugzetten, komt elke client nog steeds op hetzelfde uit, hoewel een bewerking toegepast kan blijven vóór een bewerking waarop ze voortbouwt.  
Een binding die wordt vernietigd of gestopt voordat die samenvoeging draait, zoals wanneer een `rejoin`-listener haar vernietigt, zet de bewerkingen in plaats daarvan zelfstandig terug. Er gaat er geen verloren, maar dan kan een client die de hele tijd online was er één toepassen na de bewerking van een andere schrijver die erop voortbouwt, en uiteindelijk verschillen van een client die zich later aansluit.

## Beperkingen {#limits}

- **Het weergavegebied blijft op elk scherm.** Scrolls, zooms en tabwisselingen worden [nooit gelogd](#what-the-room-holds), hoewel een sessie die via `getSharedStore` is opgezet ze wel verstuurt (ze verplaatsen daar ook de weergave of het tabblad van geen andere gebruiker). Elke lezer houdt de zijne, en de binding toont hem alleen in haar Awareness-status, die nog niets leest. Met de [vergrendeling](../../guide/guides/settings.md#lock) `Viewport` of `Canvas Type` uit slaat de `value` van elke client zijn eigen waarde op; onder de vergrendelingen, die een nieuw document aan heeft, slaat elke client de vergrendelde waarde op.
- **De snapshot groeit met één item per binding.** Hij houdt voor elke binding die ooit naar de room schreef bij hoe ver haar bewerkingen zijn samengevoegd, en laat er nooit één vallen. Een binding die opnieuw wordt gemaakt, of een die naar een andere seed verhuisde, telt opnieuw, en dat geldt ook voor elke samenvoeging die terugzet. Een item is een id van 32 tekens en een getal, dus tienduizend schrijfsessies voegen enkele honderden kilobytes toe aan elke snapshot en elke samenvoeging.
- **Een hub en een room sturen niets naar elkaar door.** Een element dat is gebonden aan een room en aan de [hub](../../mcp/live-and-headless.md#live) van een codeeragent, of aan een ander transport via `getSharedStore()`, past de bewerkingen van beide toe, maar geen van beide hoort die van de ander, omdat een gedeelde store nooit doorstuurt wat hij ontving.
- **Tegelijk gemaakte toevoegingen kunnen in een andere volgorde staan.** Tabellen of memo's die twee clients tegelijk toevoegen kunnen in het diagram van elke client in een andere volgorde staan, zoals in een sessie die via `getSharedStore` is opgezet — zie [Gelijktijdige bewerkingen](./collaborative-editing.md#concurrent-edits).
- **Kleuren en enkele andere tegelijk gemaakte wijzigingen kunnen uiteenlopen.** Een kleurwijziging wordt gelogd zonder versie, en elke client geeft haar zijn eigen versie wanneer hij haar toepast. Twee kleurwijzigingen van één tabel, memo of tabelgroep op hetzelfde moment kunnen clients, en een client die zich later aansluit en het logboek afspeelt, dus op verschillende kleuren laten uitkomen. Dat geldt ook voor de andere wijzigingen die elke client toepast in de volgorde waarin hij ze hoort, zoals twee kolomverplaatsingen binnen één tabel of index, of twee wijzigingen van het databasesysteem — zie [Gelijktijdige bewerkingen](./collaborative-editing.md#concurrent-edits).
- **Een vertrekkende cursor wacht op de server.** De binding wist de cursor van een peer zodra Awareness hem laat vallen. Een server die, wanneer een socket sluit, alleen de Awareness-statussen verwijdert die die socket als eerste toevoegde, houdt een client die weer verbinding had gemaakt op de schermen van de anderen nadat hij vertrekt, totdat Awareness hem 30 seconden later laat verlopen. Een server die elke status verwijdert die een socket het laatst schreef, een update evengoed als een toevoeging, wist hem meteen.

## Exports {#exports}

| Export | Beschrijving |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | Bindt een `<erd-editor>`-element — zie [Gebruik](#usage). Geeft een [ErdYjsBinding](#erdyjsbinding) terug. |
| `bindPeerStore(peer, doc, options?)` | Bindt een peerstore uit `@dineug/erd-editor/peer.js` — zie [Een room compacteren](#compacting-a-room). Geeft hetzelfde terug met [compact](#compact) (`ErdYjsPeerBinding`). |
| `ERD_YJS_FORMAT` | De indeling van de `Y.Doc` die deze versie schrijft, `1`; een binding weigert een room die in een andere is geschreven. |

Types: `BindOptions`, `PeerBindOptions`, `CompactOptions`, `CompactResult`, `BindingEvents`, `RejoinReason`, `ErdYjsBinding`, `ErdYjsPeerBinding`.
