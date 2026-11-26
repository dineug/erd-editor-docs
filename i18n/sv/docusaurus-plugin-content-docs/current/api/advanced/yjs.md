---
sidebar_position: 2
description: Håll ett <erd-editor>-element eller en headless peer-store i takt via ett Yjs-dokument med @dineug/erd-editor-yjs, initiera ett rum, visa närvaro via Awareness, redigera vidare offline och slå ihop rummets historik med en komprimerings-sidecar.
---

# Yjs

`@dineug/erd-editor-yjs` håller diagram i takt via ett [Yjs](https://github.com/yjs/yjs)-dokument. Det är ett eget paket som först släpptes som `0.1.0` tillsammans med `@dineug/erd-editor` `5.1.0`.  
`bindErdEditor` binder ett `<erd-editor>`, och `bindPeerStore` en headless peer-store från `@dineug/erd-editor/peer.js`, till ett `Y.Doc`.  
Den provider som bär `Y.Doc` bär också diagrammet: en websocket-server, WebRTC, IndexedDB eller din egen. Providern och `Y.Doc` förblir dina: bindningen ansluter, kopplar från eller förstör dem aldrig.

Redigeringarna färdas som editorns egna åtgärdsbatchar, som bindningen behåller så som storen skickade dem.  
Därför avgör editorns register för gemensam redigering samtidiga redigeringar på samma sätt som i en session som kopplats via `getSharedStore`, med samma undantag, till exempel en färgändring – se [Samtidiga redigeringar](./collaborative-editing.md#concurrent-edits).  
Markörer, fokus, markeringar och dragrutor färdas via providerns Awareness – se [Närvaro](#presence).  
Jämfört med att koppla en delad store till en transport själv tillför bindningen:

- En klient som ansluter öppnar det diagram som rummet innehåller, utan att något [runtimeValue](../erd-editor-element.md#runtimevalue) lämnas över från en editor som körs.
- En klient som kopplats bort kan redigera vidare, och dess redigeringar landar när den ansluter igen – se [Redigeringar offline och återanslutningar](#offline-edits-and-rejoins).
- Ett `Y.Doc` som en provider för beständig lagring lämnar tillbaka öppnar det diagram det innehåller – se [Vad rummet innehåller](#what-the-room-holds).
- En valfri Node-sidecar slår ihop rummets historik till en enda ögonblicksbild – se [Komprimera ett rum](#compacting-a-room).

Bindningen behöver de fem metoder som `5.1.0` lade till i den delade storen och i peer-storen – [getLWW](./collaborative-editing.md#getlww), [mergeLWW](./collaborative-editing.md#mergelww), [getVersion](./collaborative-editing.md#getversion), [forgetPeer](./collaborative-editing.md#forgetpeer) och [reseed](./collaborative-editing.md#reseed) – och gör själv alla anrop av dem som behövs.

## Installation {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`, `yjs` och `y-protocols` är peer-beroenden, så en sida har en kopia av varje: `@dineug/erd-editor` `5.1.0` eller senare inom `5.x`, `yjs` `13.6` eller senare inom `13.x` och `y-protocols` `1.0` eller senare inom `1.x`.  
Paketet tar bara deras typer och arbetar på det `Y.Doc` och den `Awareness` som du skickar in, så det läser inte in någon egen Yjs-, y-protocols- eller editorkod.  
Två kopior av Yjs på en sida stör varandras konstruktorkontroller, och den andra loggar `Yjs was already imported`. När din kod och en provider hämtar `yjs` från två ställen, avduplicera det i bundlern (Vite: `resolve.dedupe: ['yjs']`).

Paketet är enbart ESM (`"type": "module"`), har en enda ingång, paketroten, och är markerat som fritt från sidoeffekter, så en bundle som bara importerar `bindErdEditor` lämnar komprimeraren utanför.  
`bindErdEditor` behöver ett DOM, eftersom det binder ett definierat `<erd-editor>`. `bindPeerStore` körs också i ren Node, på Node.js 22.12 eller senare, vilket även [komprimerings-sidecaren](#compacting-a-room) gör.

## Användning {#usage}

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

`wss://yjs.example.com` och `my-diagram` står för din egen server och ditt eget rum.  
Bind, och initiera, först när providern har synkroniserats, vilket händelsen `sync` i y-websocket meddelar med `true`. En initiering som görs tidigare kan ersätta rummets diagram – se [Initiera ett rum](#seeding-a-room).

När `Y.Doc` innehåller ett rums ögonblicksbild vid bindningen öppnar bindningen den i elementet direkt: den läser in ögonblicksbilden med dess register och version, som [reseed](./collaborative-editing.md#reseed) gör, och tillämpar alla redigeringar som loggats sedan dess.  
Den öppningen rensar och stänger det som en återanslutning gör – se [Redigeringar offline och återanslutningar](#offline-edits-and-rejoins) – och elementet öppnas där ögonblicksbilden placerar det. Ingen `rejoin` utlöses för den första öppningen.  
När `Y.Doc` inte innehåller någon ögonblicksbild, som i ett tomt rum eller innan providern har synkroniserats, behåller elementet sitt dokument, och bindningen skriver ingenting till rummet förrän en ögonblicksbild dyker upp, antingen dess egen [initiering](#seed) eller en annan klients.

`bindErdEditor` hämtar en delad store från elementet med [getSharedStore](../erd-editor-element.md#getsharedstore), och [destroy](#destroy) släpper den.  
Elementet måste redan vara ett `<erd-editor>`, med sin ingång importerad eller `defineErdEditor()` anropad – se [Registrera elementen](../installation.md#registering-the-elements). Innan taggen har definierats är ett `<erd-editor>` ett vanligt `HTMLElement`, som webbläsaren uppgraderar när taggen har definierats och elementet finns i dokumentet. För ett element som ännu inte har uppgraderats kastar `bindErdEditor` ett `TypeError` i stället för att utlösa `error`.

Rummets redigeringar tillämpas på elementet, och skickar [change](../erd-editor-element.md#change), på samma sätt som en medarbetares, däribland de redigeringar som spelas upp efter att en ögonblicksbild har öppnats.  
När en ögonblicksbild öppnas, vid bindningen eller vid en återanslutning, skapas inget steg i ångrahistoriken, ingen `change` skickas och ingenting skrivs till rummet, bortsett från den härledning av logiska namn som [Redigeringar offline och återanslutningar](#offline-edits-and-rejoins) beskriver.  
Om du vill läsa in ett annat dokument i ett initierat rum gör du en ändring som alla klienter tillämpar: tilldela [value](../erd-editor-element.md#value), anropa [clear](../erd-editor-element.md#clear) eller importera ett.  
[setInitialValue](../erd-editor-element.md#setinitialvalue) skrivs aldrig till rummet, eftersom en delad store inte skickar det, så det ändrar bara det elementet medan alla andra klienter behåller rummets diagram. Initiera ett tomt rum med [seed](#seed) i stället.

Ett `Y.Doc` innehåller ett diagram. Bindningen lagrar det under namnen `erd:` i `Y.Doc` och sätter fältet `erd` i det lokala Awareness-tillståndet, och lämnar alla andra namn och fält orörda.  
Ge varje bundet element ett eget `Y.Doc` och en egen Awareness, som varje klient i ett rum har: två bindningar som delar en Awareness skriver över varandras fält `erd`.

## Initiera ett rum {#seeding-a-room}

Ett rum innehåller inget diagram förrän en klient [initierar](#seed) det.  
Det en editor innehåller under tiden går in i dess egen initiering, och viker sig för en annan klients initiering när den kommer först: bindningen öppnar editorn på nytt på den med `rejoin('snapshot')`, och dokumentet som elementet höll, med det som redigerats i det sedan bindningen, är borta.

När två klienter initierar samtidigt vinner en initiering på alla klienter.  
Den andra klienten som initierade öppnas på nytt på den med `rejoin('seedLost')` och förlorar det som den har redigerat sedan sin initiering, och det gör även en klient som hade anslutit sig till den förlorande initieringen, med `rejoin('snapshot')`. Deras redigeringar i den förlorande initieringen når ingen.  
En initiering som görs innan providern har synkroniserats räknas som gjord samtidigt med den initiering som rummets diagram kom från, så den kan vinna över den och ersätta rummets diagram.

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

Den `Awareness` som bär markörer, fokus, markeringar och dragrutor, till exempel providerns.  
Med den slår bindningen på elementets mus- och fokusspårare och ritar de andra klienternas närvaro på elementet – se [Närvaro](#presence).  
Utan den synkroniseras bara diagrammet: elementet skickar ingen markör, inget fokus och ingen markering och ritar ingen annans.

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

Namnet som de andra ser bredvid den här editorns markör.  
Elementets delade store läser det varje gång den skickar, som med [getSharedStore](./collaborative-editing.md#getnickname), och andra användare ser `user` när det saknas eller är tomt.

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

`on(event, listener)` returnerar en funktion som tar bort lyssnaren.

### seed {#seed}

Skriver rummets första ögonblicksbild från editorns dokument och returnerar `true`.  
Om `value` anges, ett dokuments text i valfri form som [setInitialValue](../erd-editor-element.md#setinitialvalue) läser, läser den först in det i editorn.  
Sedan släpper den, utan att logga, de dragningar, storleksändringar och färgändringar som editorn fortfarande håller tillbaka, så att ingen av dem hamnar i rummet efter ögonblicksbilden. Utan `value` visar ögonblicksbilden dem redan, eftersom den tar editorns dokument; med `value` hörde de till det dokument som `value` ersatte.  
Därefter skriver den den ögonblicksbild som [Vad rummet innehåller](#what-the-room-holds) beskriver.  
När rummet väl innehåller en ögonblicksbild returnerar den `false` och skriver ingenting, utan att läsa in `value`, så att varje klient kan anropa den efter bindningen. Den returnerar också `false` när bindningen har förstörts eller stoppats, och för en bindning som [nekats](#onerror) vid bindningen.

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

Bindningen öppnade editorn på nytt på rummets ögonblicksbild, som [reseed](./collaborative-editing.md#reseed) gör; [Redigeringar offline och återanslutningar](#offline-edits-and-rejoins) säger vad den behåller och vad den förlorar.  
`reason` talar om varför:

- `'snapshot'`: ögonblicksbilden innehåller redigeringar som bindningen inte hade tillämpat, eftersom den var borta medan en komprimerare slog ihop dem, eller eftersom en komprimerare, i en egen ihopslagning, lade tillbaka det som den hade slagit ihop i en ögonblicksbild som en annan komprimerares ersatte (se [En komprimerare per rum](#one-compactor-per-room)). Det är också skälet när ögonblicksbilden är den första som når en bindning i ett tomt rum, och när den tillhör en annan initiering och den här bindningen hade anslutit sig till en initiering som den inte skrev.
- `'seedLost'`: en annan klients initiering vann över den initiering som den här bindningen skrev.

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

Bindningen nekade att binda, stoppades eller avvisade ett alternativ. Varje meddelande börjar med `erd-editor-yjs: `.

Vid bindningen binder den ingenting när:

- editorn eller peer-storen redan är bunden till det här `Y.Doc`;
- dess `@dineug/erd-editor` byggdes före `5.1.0`; bindningen förstör den delade store som den hämtade från ett element;
- peer-storen förstördes innan den bands;
- rummet innehåller en ögonblicksbild i ett format som den här versionen inte läser (se [Vad rummet innehåller](#what-the-room-holds)).

En sådan bindning utlöser `error` i en mikrotask, så en lyssnare som läggs till direkt efter anropet hör den, och ingen `rejoin` utlöses någonsin på den.

Senare stoppas bindningen när:

- rummets ögonblicksbild övergår till ett format som den här versionen inte läser. Alla bindningar från den här versionen stoppas, varje editor behåller det den hade tillämpat, och inget som redigeras efteråt skrivs;
- dess peer-store förstördes under den, vilket upptäcks nästa gång rummet ändras eller `seed()` eller `compact()` anropas.

En bindning som stoppas släpper den delade store som den hämtade, och sin store och sitt `Y.Doc` som ett par, som [destroy](#destroy) gör, och behåller sina lyssnare.

Enbart för `bindPeerStore` utlöser följande `error` och bindningen fortsätter:

- `compactAfter` är inte ett positivt heltal: bindningen slår bara ihop när den ombeds;
- `electionGraceMs` eller `retainMs` är inte ett tal från 0 till 2 147 483 647 ms: dess standardvärde gäller i stället, eftersom en timer bortom det intervallet utlöses direkt;
- `synced` avvisas: bindningen slår aldrig ihop och lämnar valet åt de andra komprimerarna (se [En komprimerare per rum](#one-compactor-per-room)).

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

Skickar in i rummet de dragningar, storleksändringar och färgändringar som editorn fortfarande håller tillbaka, sätter bindningens Awareness-fält `erd` till `null`, så att de andra släpper dess markör, fokus och markering direkt, och slutar observera `Y.Doc` och Awareness.  
För ett element förstör den också den delade store som den hämtade, och lämnar elementet och dess dokument som de är.  
Ett andra anrop gör ingenting. Efteråt når det som editorn redigerar ingen.

Peer-storen, `Y.Doc` och providern förblir dina, att förstöra efter bindningen: en peer-store som förstörs först skickar aldrig de dragningar som den fortfarande höll.  
Elementets egen [destroy](../erd-editor-element.md#destroy) förstör varje delad store som det har lämnat ut, bindningens inräknad, och släpper det som de håller tillbaka, så förstör bindningen först.  
Förstör en bindning innan du binder samma editor eller peer-store till samma `Y.Doc` igen; en som stoppades med `error` har redan släppt.

```js
binding.destroy();
editor.destroy();
```

## Närvaro {#presence}

Med [awareness](#awareness) färdas editorns markör, fokuserade tabell eller cell, markering och dragruta i fältet `erd` i dess lokala Awareness-tillstånd, aldrig i `Y.Doc`, så de hamnar aldrig i rummets historik, dess ögonblicksbild eller ett lagrat `Y.Doc`.  
De andra ritar dem som de ritar en medarbetares närvaro – se [focusTracker](./collaborative-editing.md#focustracker) – och en klient som ansluter ritar den närvaro som rummet redan visar.  
Elementet skickar sitt fokus och sin markering på nytt var 30:e sekund och sin dragruta varje sekund. Varje sådan omsändning når de andra även när den upprepar den förra, så att det en användare fortfarande håller aldrig upphör.

En klient som lämnar glöms direkt.  
När Awareness släpper dess tillstånd, eller dess fält `erd` blir `null`, som [destroy](#destroy) sätter det, eller pekar ut en annan editor, tar bindningen bort den editorns markör, fokus, markering och dragruta från elementet med [forgetPeer](./collaborative-editing.md#forgetpeer) i stället för att vänta på att de ska löpa ut.  
Den behåller dem så länge en annan klient fortfarande visar samma editor, som ett element som bundits på nytt till ett annat `Y.Doc` i rummet gör.

## Redigeringar offline och återanslutningar {#offline-edits-and-rejoins}

En klient som kopplats bort från providern kan redigera vidare. Dess redigeringar väntar i dess lokala `Y.Doc`, inte i den delade storen, och når de andra när providern ansluter igen och synkroniserar.

När en komprimerare slog ihop redigeringar som klienten aldrig tillämpade medan den var borta innehåller ögonblicksbilden dem, så när klienten ansluter igen öppnas den på nytt på ögonblicksbilden med `rejoin('snapshot')`, efter att ha skickat de dragningar, storleksändringar och färgändringar som dess editor fortfarande höll tillbaka. En ihopslagning av enbart det klienten hade tillämpat öppnar ingenting på nytt.  
En återanslutning till en ögonblicksbild av den initiering som bindningen anslöt sig till spelar upp varje redigering som ögonblicksbilden inte innehåller, däribland klientens egna som gjordes medan den var borta, så ingen går förlorad. En återanslutning till en annan initiering behåller ingenting, som [Initiera ett rum](#seeding-a-room) beskriver.

Varje återanslutning rensar ångrahistoriken, markeringen och fokus, och stänger en öppen vy i [flödesläget](../../guide/guides/visualization.md#flow-mode), ett [ritande av en relation](../../guide/guides/editing-start.md#relationship-creation) och en redigerare för anteckning, tabellgruppsnamn eller cell, eftersom de kan peka ut sådant som ögonblicksbilden inte längre innehåller.  
Ett tabellgruppsnamn som skrivits men ännu inte bekräftats släpps. En cell för logiskt namn som stängs härleder det fysiska namnet från ett logiskt namn som dess läsare skrev, där det återöppnade dokumentet fortfarande innehåller det, som varje stängning av den cellen gör. Den härledningen är en vanlig redigering: rummet loggar den, den skapar ett steg i ångrahistoriken och den skickar `change` – se [reseed](./collaborative-editing.md#reseed).  
En bindning som hade anslutit sig till rummet behåller det som dess läsare ser: rullningspositionen, zoomnivån och fliken, och de inställningar som en skrivskyddad läsare ändrade.  
Den behåller också namnvisningen och kodinställningarna (språk, skiftlägen för namn och typ av citattecken i kodgeneratorn) som läsaren visade själv, så länge vart och ett av deras [lås](../../guide/guides/settings.md#lock) var på före återanslutningen och fortfarande är på efter den med samma låsta värde.  
Inget av det den behåller når `value`, som rapporterar det återöppnade dokumentets inställningar – se [reseed](./collaborative-editing.md#reseed) med `keepScreen`.  
Rullningspositionen och zoomnivån för ett element som inte visats sedan det senast lästes in, och hela skärmen för en bindning som ännu inte hade anslutit sig, öppnas där ögonblicksbilden placerar dem.  
En peer-store har ingen skärm, så dess återanslutning behåller ingen.

## Skrivskyddade editorer {#read-only-editors}

Ett [skrivskyddat](../erd-editor-element.md#readonly) element som är bundet till ett rum skriver ingenting till rummets historik: dess delade store skickar ingen ändring, bara sina spårare och registrens handskakning, och rummet [loggar ingetdera](#what-the-room-holds).  
Det tillämpar fortfarande varje redigering som rummet bär, och med [awareness](#awareness) når dess läsares markör, fokus, markering och dragruta fortfarande de andra.  
De inställningar som dess läsare ändrar stannar på dess skärm, som i varje skrivskyddad editor.  
[seed](#seed) nekas inte: ett skrivskyddat element initierar ett tomt rum med det dokument det innehåller, eller med `value` när det anges.

## Vad rummet innehåller {#what-the-room-holds}

Bindningen lagrar diagrammet under två namn i `Y.Doc`: `erd:snapshot`, en map som innehåller en ögonblicksbild av dokumentet, och `erd:log`, en array med editorns åtgärdsbatchar sedan dess. En provider för beständig lagring sparar båda tillsammans med resten av `Y.Doc`.

Ögonblicksbilden innehåller dokumentets [runtimeValue](../erd-editor-element.md#runtimevalue), borttagna entiteter inräknade, dess register för gemensam redigering och version, och hur långt varje skrivares redigeringar är ihopslagna i den. En initiering skriver den, och det gör även varje ihopslagning av en komprimerare.  
En initiering eller ihopslagning som görs med en version av `@dineug/erd-editor` från före `5.1.1` skriver en ögonblicksbild där ingen anteckning ingår i någon tabellgrupp – se [Blanda versioner](./collaborative-editing.md#mixing-releases).  
Varje loggpost är en batch så som editorn skickade den, dess meta inräknad, som bär avsändarens editor-id och smeknamn.  
Rullningar, zoomningar, flikbyten, närvaro och registrens handskakning loggas aldrig. Varje annan ändring som editorn skickar loggas, däribland ett byte av namnvisning som görs under dess [lås](../../guide/guides/settings.md#lock), vilket alla andra klienter släpper.  
Ett språk, ett skiftläge för namn eller en typ av citattecken i kodgeneratorn som ändras under sitt lås skickas aldrig, så det stannar på den editorns skärm och når aldrig rummet.

Ett `Y.Doc` som en provider för beständig lagring lämnar tillbaka öppnar det diagram det innehåller, som en bindning öppnar varje `Y.Doc` som innehåller en ögonblicksbild – se [Användning](#usage).

Ögonblicksbilden är ingen fil: dess körtidsvärde bär borttagna entiteter, som en fil inte får innehålla.  
Om du vill skriva rummets diagram till lagring sparar du ett bundet elements [value](../erd-editor-element.md#value) varje gång dess händelse [change](../erd-editor-element.md#change) utlöses.  
Spara det också en gång efter bindningen, efter en [initiering](#seed) med ett `value` och i en lyssnare för [rejoin](#onrejoin), eftersom ingen av de inläsningarna skickar `change`.  
Ett [skrivskyddat](../erd-editor-element.md#readonly) element skickar aldrig `change`, så spara från ett som inte är skrivskyddat, eller läs `value` från en bunden peer-store, som tillämpar rummets redigeringar när de kommer.  
En [replicationStore](./remote-storage.md) kan inte bindas, eftersom den saknar de metoder som en bindning behöver, och en som matas från ett bundet elements delade store missar rummets redigeringar – se [Replikera en live-editor](./remote-storage.md#replicating-a-live-editor).

Formatet är privat och kan ändras med [ERD_YJS_FORMAT](#exports).  
Läs ett rum bara via en bindning, och lämna namnen `erd:` och Awareness-fältet `erd` åt den.

## Komprimera ett rum {#compacting-a-room}

Rummets historik växer med varje redigering, och varje klient som ansluter spelar upp den i sin helhet, tills något slår ihop den.  
`bindPeerStore` binder en headless peer-store från `@dineug/erd-editor/peer.js` och returnerar en `ErdYjsPeerBinding`: samma [seed](#seed), [on](#erdyjsbinding) och [destroy](#destroy), med [compact](#compact).  
En peer-store som binds i en Node-process bredvid servern, en sidecar, slår ihop historiken till en ögonblicksbild av sitt eget diagram.  
Ett elements bindning slår aldrig ihop, och en peer-store som binds utan `compactAfter` och utan anrop av `compact()` är en vanlig headless deltagare.

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

Peer-storen förblir din: bindningen förstör den aldrig. Dess smeknamn är det som `createPeerStore` fick, och `presence: false` hindrar den från att skicka något eget fokus.

En ihopslagning skriver ögonblicksbilden från peer-storens eget körtidsvärde, register och version, och tar bort de loggposter den täcker och varje post från en annan initiering, allt i en och samma transaktion.  
Klienter som tillämpade allt ser posterna försvinna; en klient som inte gjorde det öppnas på nytt på ögonblicksbilden (se [Redigeringar offline och återanslutningar](#offline-edits-and-rejoins)).  
Varje ihopslagning skriver om hela diagrammet i ögonblicksbilden, så var och en skickar till varje klient en uppdatering av ungefär samma storlek som diagrammets körtids-JSON och register tillsammans, hur få poster den än tar. Sätt `compactAfter` så högt att de poster som en ihopslagning tar väger tyngre än en kopia av diagrammet.

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

| Alternativ | Standardvärde | Beskrivning |
| --- | --- | --- |
| `awareness` | Inget | Visar peer-storen i rummets Awareness, som [awareness](#awareness) gör för ett element. En komprimerare som slår ihop på egen hand markeras där, så att komprimerare som ser varandra väljer en som slår ihop, och en som inte ser någon annan klient slår inte ihop något på egen hand – se [En komprimerare per rum](#one-compactor-per-room). Utan den slår en komprimerare ihop på egen hand utan val och utan väntetid. |
| `compactAfter` | Inget | Slå ihop på egen hand när loggen innehåller så många poster som en ihopslagning skulle ta. Utan den, eller utan `synced`, slår bara `compact()` ihop, och den ihopslagning som lägger tillbaka (se [En komprimerare per rum](#one-compactor-per-room)). |
| `synced` | Inget | Ett promise som löses när providern har synkroniserats. Ingen ihopslagning sker före det, `compact()` inräknad. Utan den slår ingenting ihop på egen hand och `compact()` slår ihop direkt. |
| `electionGraceMs` | `3000` | Med `awareness`, hur länge komprimeraren bevakar rummet innan den slår ihop på egen hand, efter `synced` och på nytt varje gång andra klienter visar sig efter att ingen gjort det. |
| `retainMs` | `600000` (tio minuter) | Hur länge en ihopslagnings poster hålls kvar för att läggas tillbaka (se [En komprimerare per rum](#one-compactor-per-room)), räknat från den första uppdatering som rummet skickar efter ihopslagningen. |

Ett ogiltigt alternativ, eller ett `synced` som avvisas, utlöser [error](#onerror).

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

Slår ihop direkt, utan val, väntetid eller tröskel.  
Den tar först in rummets aktuella ögonblicksbild, en återanslutning inräknad, och skickar det som dess peer-store fortfarande håller tillbaka.  
Den svarar `{ compacted: true, generation }`, där `generation` räknar ögonblicksbildens ihopslagningar: `0` för en initiering, en till för varje ihopslagning.  
I annat fall svarar den `{ compacted: false, reason }`:

- `'destroyed'` när bindningen har förstörts eller stoppats, och för en bindning som [nekats](#onerror) vid bindningen, även innan `synced` löses;
- `'not-synced'` innan `synced` löses;
- `'no-snapshot'` i ett rum som ingen klient har initierat.

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## En komprimerare per rum {#one-compactor-per-room}

Kör exakt en komprimerare per rum, och starta en ny först när den gamla har stoppats. Ingenting framtvingar detta.  
Bland komprimerare som ser varandra i Awareness slår bara den med det minsta Yjs-klient-id:t ihop på egen hand, och när den lämnar, eller dess `synced` avvisas, tar nästa över direkt.  
En komprimerare vars Awareness inte visar någon annan klient, till exempel när dess egen socket stängs och släpper dem alla, slår inte ihop något på egen hand förrän andra visar sig igen och den har bevakat rummet i `electionGraceMs`.

Två komprimerare som är bortkopplade från varandra, eller en omstart vars föregångare fortfarande körs, kan ändå slå ihop var för sig.  
Rummet behåller då en av de två ögonblicksbilderna, och den komprimerare vars ögonblicksbild förlorade lägger tillbaka det som den slog ihop och som vinnaren inte innehåller, så länge den håller det: `retainMs`, och som mest dess senaste 1 000 poster, hur stor varje post än är.  
Så ingenting går förlorat när den komprimerare vars ögonblicksbild förlorar är den som ansluter igen, så länge den slog ihop högst 1 000 poster medan de var isär.  
När det är den som förblev online och dess kvarhållning har löpt ut saknar rummets ögonblicksbild och historik det som den slog ihop tills den slår ihop igen. En klient som missade de redigeringarna, eller en som ansluter under tiden, saknar dem och håller tillbaka de senare redigeringarna från varje skrivare vars redigeringar komprimeraren slog ihop. Komprimerarens nästa ihopslagning ger tillbaka dem alla, om inte den vinnande ögonblicksbilden innehöll redigeringar som den saknade, vilket öppnar den på nytt på den ögonblicksbilden och förlorar det som den slog ihop för alltid.

En komprimerare lägger tillbaka i en egen ihopslagning, gjord när den har hunnit ifatt den vinnande ögonblicksbilden, utan val, väntetid eller tröskel, och varje klient öppnas på nytt på den ihopslagningen med `rejoin('snapshot')`.  
De redigeringar som den lägger tillbaka når ingen klient utanför den ihopslagningen, så en klient som varit online hela tiden slutar lika som de andra och som en som ansluter senare, även när en annan skrivares senare redigering bygger på en av dem, till exempel en namnändring av en tabell som en annan klient lade till.  
Varje tillbakaläggning kostar varje klient den återanslutningen, med [det en återanslutning förlorar](#offline-edits-and-rejoins). När två komprimerare lägger tillbaka samtidigt slutar varje klient ändå lika, men en redigering kan stå kvar tillämpad före en som den bygger på.  
En bindning som förstörs eller stoppas innan den ihopslagningen körs, till exempel när en lyssnare för `rejoin` förstör den, lägger i stället tillbaka redigeringarna på egen hand. Ingen går förlorad, men då kan en klient som varit online hela tiden tillämpa en efter en annan skrivares redigering som bygger på den, och sluta annorlunda än en som ansluter senare.

## Begränsningar {#limits}

- **Visningsområdet stannar på varje skärm.** Rullningar, zoomningar och flikbyten [loggas aldrig](#what-the-room-holds), trots att en session som kopplats via `getSharedStore` skickar dem (de flyttar inte heller någon annan användares vy eller flik där). Varje läsare behåller sin egen, och bindningen visar den bara i sitt Awareness-tillstånd, som ingenting läser ännu. Med [låset](../../guide/guides/settings.md#lock) `Viewport` eller `Canvas Type` av sparar varje klients `value` sin egen; under låsen, som ett nytt dokument har på, sparar varje klient det låsta.
- **Ögonblicksbilden växer med en post per bindning.** Den behåller, för varje bindning som någonsin skrivit till rummet, hur långt dess redigeringar är ihopslagna, och släpper aldrig någon. En bindning som görs på nytt, eller en som flyttade till en annan initiering, räknas på nytt, och det gör även varje ihopslagning som lägger tillbaka. En post är ett id på 32 tecken och ett tal, så tiotusen skrivande sessioner lägger till några hundra kilobyte i varje ögonblicksbild och varje ihopslagning.
- **En hubb och ett rum vidarebefordrar ingenting mellan sig.** Ett element som är bundet till ett rum och till en kodagents [hubb](../../mcp/live-and-headless.md#live), eller till någon annan transport via `getSharedStore()`, tillämpar bådas redigeringar, men ingendera hör den andras, eftersom en delad store aldrig skickar vidare det den tog emot.
- **Tillägg som görs samtidigt kan hamna i olika ordning.** Tabeller eller anteckningar som två klienter lägger till samtidigt kan stå i olika ordning i varje klients diagram, som i en session som kopplats via `getSharedStore` – se [Samtidiga redigeringar](./collaborative-editing.md#concurrent-edits).
- **Färger och några andra ändringar som görs samtidigt kan sluta olika.** En färgändring loggas utan version, och varje klient stämplar den med sin egen när den tillämpar den. Två omfärgningar av samma tabell, anteckning eller tabellgrupp som görs samtidigt kan därför lämna klienter, och en klient som ansluter senare och spelar upp loggen, med olika färger. Det kan även de andra ändringar som varje klient tillämpar i den ordning den hör dem, till exempel två kolumnflyttar inom samma tabell eller index, eller två ändringar av databasen – se [Samtidiga redigeringar](./collaborative-editing.md#concurrent-edits).
- **En markör som försvinner väntar på servern.** Bindningen rensar en deltagares markör så snart Awareness släpper den. En server som, när en socket stängs, bara tar bort de Awareness-tillstånd som den socketen först lade till behåller en klient som hade anslutit igen på de andras skärmar efter att den lämnat, tills Awareness låter den löpa ut 30 sekunder senare. En som tar bort varje tillstånd som en socket senast skrev, en uppdatering lika mycket som ett tillägg, rensar den direkt.

## Exporter {#exports}

| Export | Beskrivning |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | Binder ett `<erd-editor>` – se [Användning](#usage). Returnerar en [ErdYjsBinding](#erdyjsbinding). |
| `bindPeerStore(peer, doc, options?)` | Binder en peer-store från `@dineug/erd-editor/peer.js` – se [Komprimera ett rum](#compacting-a-room). Returnerar samma med [compact](#compact) (`ErdYjsPeerBinding`). |
| `ERD_YJS_FORMAT` | Formatet för det `Y.Doc` som den här versionen skriver, `1`; en bindning nekar ett rum som skrivits i ett annat. |

Typer: `BindOptions`, `PeerBindOptions`, `CompactOptions`, `CompactResult`, `BindingEvents`, `RejoinReason`, `ErdYjsBinding`, `ErdYjsPeerBinding`.
