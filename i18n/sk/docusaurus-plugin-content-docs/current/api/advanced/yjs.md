---
sidebar_position: 2
description: Zosúlaďte element <erd-editor> alebo bezhlavé úložisko účastníka cez dokument Yjs pomocou balíka @dineug/erd-editor-yjs, inicializujte miestnosť, zobrazujte prítomnosť cez Awareness, upravujte offline a zlúčte históriu miestnosti pomocným procesom zhutňovania.
---

# Yjs

`@dineug/erd-editor-yjs` zosúlaďuje diagramy cez dokument [Yjs](https://github.com/yjs/yjs). Je to samostatný balík, prvýkrát vydaný vo verzii `0.1.0` spolu s balíkom `@dineug/erd-editor` vo verzii `5.1.0`.  
Funkcia `bindErdEditor` previaže element `<erd-editor>` a funkcia `bindPeerStore` bezhlavé úložisko účastníka (headless peer store) z `@dineug/erd-editor/peer.js` s dokumentom `Y.Doc`.  
Diagram prenáša ten poskytovateľ, ktorý prenáša `Y.Doc`: server WebSocket, WebRTC, IndexedDB alebo váš vlastný. Poskytovateľ a `Y.Doc` zostávajú vaše: väzba ich nikdy nepripojí, neodpojí ani nezničí.

Úpravy sa prenášajú ako dávky akcií samotného editora, ktoré väzba uchováva tak, ako ich úložisko odoslalo.  
Registre spolupráce editora preto rozhodnú o úpravách urobených v tom istom okamihu rovnako ako v relácii prepojenej cez `getSharedStore`, s rovnakými výnimkami, napríklad zmena farby – pozrite si časť [Súbežné úpravy](./collaborative-editing.md#concurrent-edits).  
Kurzory, fokus, výbery a ťahané rámce sa prenášajú cez Awareness poskytovateľa – pozrite si časť [Prítomnosť](#presence).  
V porovnaní s tým, keď zdieľané úložisko prepojíte s prenosom sami, väzba pridáva:

- Klient, ktorý sa pripojí, otvorí diagram, ktorý miestnosť obsahuje, bez toho, aby mu spustený editor odovzdal hodnotu [runtimeValue](../erd-editor-element.md#runtimevalue).
- Klient, ktorý sa odpojil, môže ďalej upravovať a jeho úpravy sa prejavia po opätovnom pripojení – pozrite si časť [Úpravy offline a opätovné pripojenie](#offline-edits-and-rejoins).
- `Y.Doc`, ktorý vráti poskytovateľ trvalého ukladania, otvorí diagram, ktorý obsahuje – pozrite si časť [Čo miestnosť obsahuje](#what-the-room-holds).
- Voliteľný pomocný proces v Node zlúči históriu miestnosti do jednej snímky stavu – pozrite si časť [Zhutňovanie miestnosti](#compacting-a-room).

Väzba potrebuje päť metód, ktoré verzia `5.1.0` pridala do zdieľaného úložiska a úložiska účastníka – [getLWW](./collaborative-editing.md#getlww), [mergeLWW](./collaborative-editing.md#mergelww), [getVersion](./collaborative-editing.md#getversion), [forgetPeer](./collaborative-editing.md#forgetpeer) a [reseed](./collaborative-editing.md#reseed) – a všetky potrebné volania týchto metód vykonáva sama.

## Inštalácia {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`, `yjs` a `y-protocols` sú peer závislosti, takže stránka obsahuje jednu kópiu každej z nich: `@dineug/erd-editor` vo verzii `5.1.0` alebo novšej v rámci `5.x`, `yjs` vo verzii `13.6` alebo novšej v rámci `13.x` a `y-protocols` vo verzii `1.0` alebo novšej v rámci `1.x`.  
Balík preberá iba ich typy a pracuje s `Y.Doc` a `Awareness`, ktoré mu odovzdáte, takže nenačítava žiadny vlastný kód Yjs, y-protocols ani editora.  
Dve kópie Yjs na jednej stránke si navzájom narúšajú kontroly konštruktorov a druhá vypíše hlásenie `Yjs was already imported`. Ak váš kód a poskytovateľ načítavajú `yjs` z dvoch miest, odstráňte duplicitu v bundleri (Vite: `resolve.dedupe: ['yjs']`).

Balík je iba ESM (`"type": "module"`), má jeden vstupný bod, koreň balíka, a je označený ako bez vedľajších účinkov, takže zostavenie, ktoré importuje iba `bindErdEditor`, zhutňovač vynechá.  
Funkcia `bindErdEditor` potrebuje DOM, keďže previaže definovaný element `<erd-editor>`. Funkcia `bindPeerStore` beží aj v čistom Node, a to v Node.js 22.12 alebo novšom, rovnako ako [pomocný proces zhutňovania](#compacting-a-room).

## Použitie {#usage}

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

`wss://yjs.example.com` a `my-diagram` zastupujú váš vlastný server a miestnosť.  
Previažte a inicializujte až po synchronizácii poskytovateľa, ako to oznamuje udalosť `sync` v y-websocket s hodnotou `true`. Inicializácia urobená skôr môže nahradiť diagram miestnosti – pozrite si časť [Inicializácia miestnosti](#seeding-a-room).

Ak `Y.Doc` v čase previazania obsahuje snímku stavu miestnosti, väzba ju okamžite otvorí v elemente: načíta snímku stavu spolu s jej registrami a verziou, ako to robí [reseed](./collaborative-editing.md#reseed), a aplikuje všetky úpravy zapísané do denníka odvtedy.  
Toto otvorenie vymaže a zatvorí to isté ako opätovné pripojenie – pozrite si časť [Úpravy offline a opätovné pripojenie](#offline-edits-and-rejoins) – a element sa otvorí tam, kam ho snímka stavu umiestni. Pri tomto prvom otvorení sa udalosť `rejoin` nevyvolá.  
Ak `Y.Doc` neobsahuje snímku stavu, ako v prázdnej miestnosti alebo pred synchronizáciou poskytovateľa, element si ponechá svoj dokument a väzba nezapíše do miestnosti nič, kým sa snímka stavu neobjaví, buď jej vlastná [inicializácia](#seed), alebo inicializácia iného klienta.

`bindErdEditor` si od elementu vezme jedno zdieľané úložisko cez [getSharedStore](../erd-editor-element.md#getsharedstore) a metóda [destroy](#destroy) ho uvoľní.  
Element už musí byť `<erd-editor>`, s importovaným vstupným bodom alebo zavolanou funkciou `defineErdEditor()` – pozrite si časť [Registrácia elementov](../installation.md#registering-the-elements). Kým značka nie je definovaná, `<erd-editor>` je obyčajný `HTMLElement`, ktorý prehliadač povýši, keď sa značka definuje a element je v dokumente. Pri elemente, ktorý ešte nebol povýšený, `bindErdEditor` vyhodí výnimku `TypeError` namiesto vyvolania udalosti `error`.

Úpravy miestnosti sa aplikujú na element a vyvolajú udalosť [change](../erd-editor-element.md#change), rovnako ako úpravy spolupracovníka, vrátane úprav zopakovaných po otvorení snímky stavu.  
Otvorenie snímky stavu, pri previazaní alebo pri opätovnom pripojení, nevytvorí žiadny záznam v histórii zmien, nevyvolá udalosť `change` a nezapíše do miestnosti nič, okrem odvodenia logického názvu, ktoré opisuje časť [Úpravy offline a opätovné pripojenie](#offline-edits-and-rejoins).  
Ak chcete do inicializovanej miestnosti načítať iný dokument, urobte zmenu, ktorú aplikuje každý klient: priraďte vlastnosť [value](../erd-editor-element.md#value), zavolajte metódu [clear](../erd-editor-element.md#clear) alebo nejaký dokument importujte.  
Volanie metódy [setInitialValue](../erd-editor-element.md#setinitialvalue) sa do miestnosti nikdy nezapíše, keďže zdieľané úložisko ho neodosiela, takže zmení iba daný element, zatiaľ čo každý ďalší klient ponechá diagram miestnosti. Prázdnu miestnosť namiesto toho inicializujte metódou [seed](#seed).

Jeden `Y.Doc` obsahuje jeden diagram. Väzba ho uchováva pod názvami `erd:` dokumentu `Y.Doc` a nastavuje pole `erd` lokálneho stavu Awareness, pričom všetky ostatné názvy a polia necháva na pokoji.  
Každému previazanému elementu dajte vlastný `Y.Doc` a vlastný Awareness, ako ich má každý klient miestnosti: dve väzby, ktoré zdieľajú jeden Awareness, si navzájom prepisujú pole `erd`.

## Inicializácia miestnosti {#seeding-a-room}

Miestnosť neobsahuje žiadny diagram, kým ju klient [neinicializuje](#seed).  
To, čo editor medzitým obsahuje, ide do jeho vlastnej inicializácie a ustúpi inicializácii iného klienta, ak tá dorazí skôr: väzba sa znova otvorí na nej s `rejoin('snapshot')` a dokument, ktorý element obsahoval, spolu s tým, čo sa v ňom od previazania upravilo, zmizne.

Keď dvaja klienti inicializujú naraz, jedna inicializácia vyhrá na každom klientovi.  
Druhý inicializujúci sa znova otvorí na nej s `rejoin('seedLost')` a stratí to, čo upravil od svojej inicializácie, rovnako ako klient, ktorý sa pripojil k porazenej inicializácii, s `rejoin('snapshot')`. Ich úpravy v porazenej inicializácii sa nedostanú k nikomu.  
Inicializácia urobená pred synchronizáciou poskytovateľa sa počíta ako urobená v tom istom okamihu ako inicializácia, z ktorej pochádza diagram miestnosti, takže ju môže poraziť a nahradiť diagram miestnosti.

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

`Awareness`, ktorý prenáša kurzory, fokus, výbery a ťahané rámce, napríklad ten od poskytovateľa.  
S ním väzba zapne sledovače myši a fokusu elementu a vykresľuje prítomnosť ostatných klientov na elemente – pozrite si časť [Prítomnosť](#presence).  
Bez neho sa synchronizuje iba diagram: element neodosiela kurzor, fokus ani výber a nevykresľuje nikoho iného.

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

Meno, ktoré ostatní vidia vedľa kurzora tohto editora.  
Zdieľané úložisko elementu ho číta pri každom odoslaní, rovnako ako pri [getSharedStore](./collaborative-editing.md#getnickname), a ostatní používatelia vidia `user`, ak chýba alebo je prázdne.

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

`on(event, listener)` vráti funkciu, ktorá poslucháča odstráni.

### seed {#seed}

Zapíše prvú snímku stavu miestnosti z dokumentu editora a vráti `true`.  
Ak je zadané `value`, text dokumentu v ľubovoľnej forme, ktorú číta [setInitialValue](../erd-editor-element.md#setinitialvalue), najprv ho načíta do editora.  
Potom bez zapísania do denníka uvoľní ťahania, zmeny veľkosti a zmeny farieb, ktoré editor ešte zadržiava, takže žiadna z nich sa po snímke stavu do miestnosti nedostane. Bez `value` ich snímka stavu už zobrazuje, keďže preberá dokument editora; s `value` patrili dokumentu, ktorý `value` nahradilo.  
Potom zapíše snímku stavu, ktorú opisuje časť [Čo miestnosť obsahuje](#what-the-room-holds).  
Keď miestnosť už snímku stavu obsahuje, vráti `false` a nezapíše nič, bez načítania `value`, takže ju môže po previazaní zavolať každý klient. Vráti `false` aj vtedy, ak bola väzba zničená alebo zastavená, a pri väzbe [odmietnutej](#onerror) v čase previazania.

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

Väzba znova otvorila editor na snímke stavu miestnosti, ako to robí [reseed](./collaborative-editing.md#reseed); čo si ponechá a čo stratí, hovorí časť [Úpravy offline a opätovné pripojenie](#offline-edits-and-rejoins).  
`reason` hovorí prečo:

- `'snapshot'`: snímka stavu obsahuje úpravy, ktoré väzba neaplikovala, pretože bola preč, kým ich zhutňovač zlúčil, alebo pretože zhutňovač vo vlastnom zlúčení vrátil to, čo zlúčil do snímky stavu, ktorú nahradila snímka iného zhutňovača (pozrite si časť [Jeden zhutňovač na miestnosť](#one-compactor-per-room)). Je to aj dôvod vtedy, keď je snímka stavu prvá, ktorá dorazí k väzbe prázdnej miestnosti, a vtedy, keď patrí inej inicializácii a táto väzba sa pripojila k inicializácii, ktorú sama nezapísala.
- `'seedLost'`: inicializácia iného klienta vyhrala nad inicializáciou, ktorú zapísala táto väzba.

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

Väzba odmietla previazanie, zastavila sa alebo odmietla nejakú možnosť. Každá správa sa začína reťazcom `erd-editor-yjs: `.

V čase previazania nepreviaže nič, keď:

- editor alebo úložisko účastníka je už previazané s týmto `Y.Doc`;
- jeho balík `@dineug/erd-editor` bol zostavený pred verziou `5.1.0`; väzba zničí zdieľané úložisko, ktoré si vzala z elementu;
- úložisko účastníka bolo zničené ešte pred previazaním;
- miestnosť obsahuje snímku stavu v štruktúre, ktorú toto vydanie nečíta (pozrite si časť [Čo miestnosť obsahuje](#what-the-room-holds)).

Takáto väzba vyvolá `error` v mikroúlohe, takže poslucháč pridaný hneď po volaní ho zachytí, a `rejoin` sa na nej nikdy nevyvolá.

Neskôr sa väzba zastaví, keď:

- snímka stavu miestnosti prejde na štruktúru, ktorú toto vydanie nečíta. Zastaví sa každá väzba tohto vydania, každý editor si ponechá to, čo aplikoval, a nič, čo sa upraví potom, sa nezapíše;
- jej úložisko účastníka bolo zničené pod ňou, čo sa zistí pri najbližšej zmene miestnosti alebo pri volaní `seed()` či `compact()`.

Väzba, ktorá sa zastaví, uvoľní zdieľané úložisko, ktoré si vzala, aj svoje úložisko a `Y.Doc` ako dvojicu, ako to robí [destroy](#destroy), a ponechá si svojich poslucháčov.

Iba pri `bindPeerStore` tieto prípady vyvolajú `error` a väzba pokračuje:

- `compactAfter` nie je kladné celé číslo: väzba zlúči, iba keď sa to od nej požaduje;
- `electionGraceMs` alebo `retainMs` nie je číslo od 0 do 2 147 483 647 ms: nastúpi jeho predvolená hodnota, keďže časovač nad týmto rozsahom sa spustí okamžite;
- `synced` je zamietnuté: väzba nikdy nezlúči a voľbu prenecháva ostatným zhutňovačom (pozrite si časť [Jeden zhutňovač na miestnosť](#one-compactor-per-room)).

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

Odošle do miestnosti ťahania, zmeny veľkosti a zmeny farieb, ktoré editor ešte zadržiava, nastaví pole `erd` Awareness väzby na `null`, takže ostatní okamžite zahodia jej kurzor, fokus a výber, a prestane sledovať `Y.Doc` a Awareness.  
Pri elemente zničí aj zdieľané úložisko, ktoré si vzala, pričom element a jeho dokument nechá tak, ako sú.  
Druhé volanie nemá žiadny účinok. Potom sa to, čo editor upraví, nedostane k nikomu.

Úložisko účastníka, `Y.Doc` a poskytovateľ zostávajú vaše, zničte ich po väzbe: úložisko účastníka zničené ako prvé nikdy neodošle ťahania, ktoré ešte zadržiavalo.  
Metóda [destroy](../erd-editor-element.md#destroy) samotného elementu ničí každé zdieľané úložisko, ktoré element vydal, vrátane úložiska väzby, a zahodí to, čo zadržiavajú, takže najprv zničte väzbu.  
Zničte väzbu skôr, než ten istý editor alebo úložisko účastníka znova previažete s tým istým `Y.Doc`; väzba, ktorá sa zastavila s `error`, sa už uvoľnila.

```js
binding.destroy();
editor.destroy();
```

## Prítomnosť {#presence}

S [awareness](#awareness) putujú kurzor editora, aktívna tabuľka alebo bunka, výber a ťahaný rámec v poli `erd` jeho lokálneho stavu Awareness, nikdy v `Y.Doc`, takže nikdy nevstúpia do histórie miestnosti, jej snímky stavu ani do trvalo uloženého `Y.Doc`.  
Ostatní ich vykresľujú tak, ako vykresľujú prítomnosť spolupracovníka – pozrite si časť [focusTracker](./collaborative-editing.md#focustracker) – a klient, ktorý sa pripojí, vykreslí prítomnosť, ktorú miestnosť už zobrazuje.  
Element odosiela fokus a výber znova každých 30 sekúnd a ťahaný rámec každú sekundu. Každé z týchto opakovaných odoslaní sa dostane k ostatným, aj keď zopakuje posledné, takže to, čo používateľ stále drží, nikdy nevyprší.

Klient, ktorý odíde, sa zabudne okamžite.  
Keď Awareness zahodí jeho stav alebo jeho pole `erd` prejde na `null`, ako ho nastavuje [destroy](#destroy), alebo pomenuje iný editor, väzba odstráni kurzor, fokus, výber a ťahaný rámec daného editora z elementu cez [forgetPeer](./collaborative-editing.md#forgetpeer), namiesto toho, aby čakala na ich vypršanie.  
Ponechá ich, kým iný klient stále zobrazuje ten istý editor, ako to robí element znova previazaný s iným `Y.Doc` miestnosti.

## Úpravy offline a opätovné pripojenie {#offline-edits-and-rejoins}

Klient odpojený od poskytovateľa môže ďalej upravovať. Jeho úpravy čakajú v jeho lokálnom `Y.Doc`, nie v zdieľanom úložisku, a dostanú sa k ostatným, keď sa poskytovateľ znova pripojí a synchronizuje.

Keď zhutňovač zlúčil úpravy, ktoré klient počas neprítomnosti neaplikoval, snímka stavu ich obsahuje, takže po opätovnom pripojení sa klient znova otvorí na snímke stavu s `rejoin('snapshot')`, po odoslaní ťahaní, zmien veľkosti a zmien farieb, ktoré jeho editor ešte zadržiaval. Zlúčenie iba toho, čo klient aplikoval, nič znova neotvorí.  
Opätovné pripojenie na snímku stavu inicializácie, ku ktorej sa väzba pripojila, zopakuje každú úpravu, ktorú snímka stavu neobsahuje, vrátane úprav tohto klienta urobených počas neprítomnosti, takže žiadna sa nestratí. Opätovné pripojenie na inú inicializáciu neponechá nič, ako opisuje časť [Inicializácia miestnosti](#seeding-a-room).

Každé opätovné pripojenie vymaže históriu zmien, výber a fokus a zatvorí otvorené zobrazenie [Flow](../../guide/guides/visualization.md#flow-mode), [kreslenie vzťahu](../../guide/guides/editing-start.md#relationship-creation) a editor poznámky, názvu skupiny tabuliek alebo bunky, keďže môžu pomenúvať to, čo snímka stavu už neobsahuje.  
Názov skupiny tabuliek napísaný a ešte nepotvrdený sa zahodí. Bunka logického názvu, ktorá sa zatvorí, odvodí fyzický názov z logického názvu, ktorý do nej napísal čitateľ, ak ho znovu otvorený dokument ešte obsahuje, ako pri každom zatvorení tejto bunky. Toto odvodenie je obyčajná úprava: miestnosť ju zapíše do denníka, vytvorí záznam v histórii zmien a vyvolá udalosť `change` – pozrite si časť [reseed](./collaborative-editing.md#reseed).  
Väzba, ktorá sa k miestnosti pripojila, ponechá to, čo vidí jej čitateľ: polohu posunutia, úroveň priblíženia a kartu a nastavenia, ktoré zmenil čitateľ iba na čítanie.  
Ponechá aj Zobrazenie názvov a nastavenia kódu (jazyk Generátora kódu, štýly názvov a typ úvodzoviek), ktoré mal čitateľ zobrazené po svojom, pokiaľ [zamknutie](../../guide/guides/settings.md#lock) každého z nich bolo zapnuté pred opätovným pripojením a po ňom je stále zapnuté s rovnakou zamknutou hodnotou.  
Nič z toho, čo ponechá, sa nedostane do vlastnosti `value`, ktorá hlási nastavenia znovu otvoreného dokumentu – pozrite si časť [reseed](./collaborative-editing.md#reseed) s `keepScreen`.  
Poloha posunutia a úroveň priblíženia elementu, ktorý sa od posledného načítania nezobrazil, a celá obrazovka väzby, ktorá sa ešte nepripojila, sa otvoria tam, kam ich umiestni snímka stavu.  
Úložisko účastníka nemá obrazovku, takže jeho opätovné pripojenie nič neponechá.

## Editory iba na čítanie {#read-only-editors}

Element [iba na čítanie](../erd-editor-element.md#readonly) previazaný s miestnosťou nezapisuje do histórie miestnosti nič: jeho zdieľané úložisko neodosiela žiadnu zmenu, iba údaje svojich sledovačov a výmenu registrov, a miestnosť [nezapíše do denníka ani jedno](#what-the-room-holds).  
Stále aplikuje každú úpravu, ktorú miestnosť nesie, a s [awareness](#awareness) sa kurzor, fokus, výber a ťahaný rámec jeho čitateľa stále dostávajú k ostatným.  
Nastavenia, ktoré jeho čitateľ zmení, zostávajú na jeho obrazovke, ako pri každom editore iba na čítanie.  
Volanie [seed](#seed) sa neodmietne: element iba na čítanie inicializuje prázdnu miestnosť dokumentom, ktorý obsahuje, alebo pomocou `value`, ak je zadané.

## Čo miestnosť obsahuje {#what-the-room-holds}

Väzba uchováva diagram pod dvoma názvami dokumentu `Y.Doc`: `erd:snapshot` je mapa, ktorá obsahuje snímku stavu dokumentu, a `erd:log` je pole dávok akcií editora od jej vytvorenia. Poskytovateľ trvalého ukladania uloží oboje spolu so zvyškom `Y.Doc`.

Snímka stavu obsahuje [runtimeValue](../erd-editor-element.md#runtimevalue) dokumentu vrátane odstránených entít, jeho registre spolupráce a verziu a to, nakoľko sú úpravy každého zapisovateľa v nej zlúčené. Zapíše ju inicializácia aj každé zlúčenie zhutňovača.  
Každý záznam denníka je jedna dávka tak, ako ju editor odoslal, vrátane jej metaúdajov, ktoré nesú identifikátor editora odosielateľa a jeho prezývku.  
Posúvania, priblíženia, prepnutia kariet, prítomnosť a výmena registrov sa do denníka nikdy nezapisujú. Každá iná zmena, ktorú editor odošle, sa zapíše, vrátane prepnutia Zobrazenia názvov urobeného pod jeho [zamknutím](../../guide/guides/settings.md#lock), ktoré každý ďalší klient zahodí.  
Jazyk Generátora kódu, štýl názvov alebo typ úvodzoviek zmenené pod jeho zamknutím sa nikdy neodošlú, takže zostanú na obrazovke daného editora a do miestnosti sa nedostanú.

`Y.Doc`, ktorý vráti poskytovateľ trvalého ukladania, otvorí diagram, ktorý obsahuje, ako väzba otvorí každý `Y.Doc`, ktorý obsahuje snímku stavu – pozrite si časť [Použitie](#usage).

Snímka stavu nie je súbor: jej hodnota za behu nesie odstránené entity, ktoré súbor obsahovať nesmie.  
Ak chcete diagram miestnosti zapísať do úložiska, uložte [value](../erd-editor-element.md#value) previazaného elementu vždy, keď sa vyvolá jeho udalosť [change](../erd-editor-element.md#change).  
Uložte ho aj raz po previazaní, po volaní [seed](#seed) so zadanou hodnotou `value` a v poslucháčovi [rejoin](#onrejoin), keďže žiadne z týchto načítaní nevyvolá `change`.  
Element [iba na čítanie](../erd-editor-element.md#readonly) nikdy nevyvolá `change`, takže ukladajte z elementu, ktorý nie je iba na čítanie, alebo čítajte `value` z previazaného úložiska účastníka, ktoré aplikuje úpravy miestnosti, ako prichádzajú.  
Úložisko [replicationStore](./remote-storage.md) nemožno previazať, keďže mu chýbajú metódy, ktoré väzba potrebuje, a také, ktoré je napájané zo zdieľaného úložiska previazaného elementu, prichádza o úpravy miestnosti – pozrite si časť [Replikácia spusteného editora](./remote-storage.md#replicating-a-live-editor).

Štruktúra je interná a môže sa zmeniť spolu s [ERD_YJS_FORMAT](#exports).  
Miestnosť čítajte iba cez väzbu a názvy `erd:` aj pole Awareness `erd` nechajte jej.

## Zhutňovanie miestnosti {#compacting-a-room}

História miestnosti rastie s každou úpravou a každý klient, ktorý sa pripojí, ju celú zopakuje, kým ju niečo nezlúči.  
`bindPeerStore` previaže bezhlavé úložisko účastníka z `@dineug/erd-editor/peer.js` a vráti `ErdYjsPeerBinding`: rovnaké [seed](#seed), [on](#erdyjsbinding) a [destroy](#destroy), spolu s [compact](#compact).  
Úložisko účastníka previazané v procese Node popri serveri, pomocný proces, zlúči históriu do snímky stavu svojho vlastného diagramu.  
Väzba elementu nikdy nezlučuje a úložisko účastníka previazané bez `compactAfter` a bez volania `compact()` je obyčajný bezhlavý účastník.

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

Úložisko účastníka zostáva vaše: väzba ho nikdy nezničí. Jeho prezývka je tá, ktorú dostala funkcia `createPeerStore`, a `presence: false` mu bráni odosielať vlastný fokus.

Zlúčenie zapíše snímku stavu z vlastnej hodnoty za behu, registrov a verzie úložiska účastníka a v jedinej transakcii odstráni záznamy denníka, ktoré pokrýva, a každý záznam inej inicializácie.  
Klienti, ktorí aplikovali všetko, vidia záznamy zmiznúť; klient, ktorý tak neurobil, sa znova otvorí na snímke stavu (pozrite si časť [Úpravy offline a opätovné pripojenie](#offline-edits-and-rejoins)).  
Každé zlúčenie prepíše celý diagram do snímky stavu, takže každé pošle každému klientovi aktualizáciu veľkú približne ako JSON hodnoty za behu diagramu a registre dohromady, bez ohľadu na to, ako málo záznamov pojme. Nastavte `compactAfter` dostatočne vysoko, aby záznamy, ktoré zlúčenie pojme, prevážili jednu kópiu diagramu.

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

| Možnosť | Predvolená hodnota | Popis |
| --- | --- | --- |
| `awareness` | Žiadna | Zobrazí úložisko účastníka v Awareness miestnosti, ako to robí [awareness](#awareness) pri elemente. Zhutňovač, ktorý zlučuje sám, je tam označený, takže zhutňovače, ktoré sa navzájom vidia, zvolia jeden, ktorý zlučuje, a ten, ktorý nevidí žiadneho iného klienta, sám nezlučuje nič – pozrite si časť [Jeden zhutňovač na miestnosť](#one-compactor-per-room). Bez neho zhutňovač zlučuje sám, bez voľby a bez odkladu. |
| `compactAfter` | Žiadna | Zlúči sám, keď denník obsahuje toľko záznamov, koľko by zlúčenie pojalo. Bez neho alebo bez `synced` zlučuje iba `compact()` a zlúčenie, ktoré vracia (pozrite si časť [Jeden zhutňovač na miestnosť](#one-compactor-per-room)). |
| `synced` | Žiadna | Promise, ktorý sa vyrieši, keď sa poskytovateľ synchronizuje. Pred ním nezlúči nič, vrátane `compact()`. Bez neho nič nezlučuje samo a `compact()` zlučuje okamžite. |
| `electionGraceMs` | `3000` | S `awareness` ako dlho zhutňovač sleduje miestnosť, kým začne zlučovať sám, po `synced` a znova vždy, keď sa objavia iní klienti po tom, čo sa žiadny nezobrazoval. |
| `retainMs` | `600000` (desať minút) | Ako dlho zostanú záznamy zlúčenia podržané na vrátenie (pozrite si časť [Jeden zhutňovač na miestnosť](#one-compactor-per-room)), počítané od prvej aktualizácie, ktorú miestnosť po zlúčení odošle. |

Neplatná možnosť alebo zamietnuté `synced` vyvolá [error](#onerror).

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

Zlúči okamžite, bez voľby, odkladu alebo prahu.  
Najprv prevezme aktuálnu snímku stavu miestnosti, vrátane opätovného pripojenia, a odošle to, čo jeho úložisko účastníka ešte zadržiava.  
Odpovie `{ compacted: true, generation }`, kde `generation` počíta zlúčenia snímky stavu: `0` pre inicializáciu, o jedno viac za každé zlúčenie.  
Inak odpovie `{ compacted: false, reason }`:

- `'destroyed'`, keď bola väzba zničená alebo zastavená, a pri väzbe [odmietnutej](#onerror) v čase previazania, aj pred vyriešením `synced`;
- `'not-synced'` pred vyriešením `synced`;
- `'no-snapshot'` v miestnosti, ktorú žiadny klient neinicializoval.

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## Jeden zhutňovač na miestnosť {#one-compactor-per-room}

Prevádzkujte presne jeden zhutňovač na miestnosť a nový spustite až po zastavení starého. Nič to nevynucuje.  
Medzi zhutňovačmi, ktoré sa v Awareness navzájom vidia, zlučuje sám iba ten s najmenším identifikátorom klienta Yjs, a keď odíde alebo jeho `synced` je zamietnuté, okamžite prevezme ďalší.  
Zhutňovač, ktorého Awareness nezobrazuje žiadneho iného klienta, napríklad keď sa jeho vlastný socket zatvorí a zahodí ich všetkých, sám nezlučuje nič, kým sa iní znova nezobrazia a kým miestnosť nesleduje po dobu `electionGraceMs`.

Dva zhutňovače odpojené jeden od druhého alebo reštart, ktorého predchodca ešte beží, môžu stále každý zlúčiť.  
Miestnosť si potom ponechá jednu z dvoch snímok stavu a zhutňovač, ktorého snímka stavu prehrala, vráti to, čo zlúčil a víťaz neobsahuje, po dobu, kým to drží: `retainMs`, a najviac jeho posledných 1 000 záznamov, bez ohľadu na to, aký veľký je každý z nich.  
Nič sa teda nestratí, keď sa znova pripojí zhutňovač, ktorého snímka stavu prehrala, pokiaľ počas odpojenia zlúčil najviac 1 000 záznamov.  
Ak je to ten, ktorý zostal online, a jeho podržanie vypršalo, snímke stavu a histórii miestnosti chýba to, čo zlúčil, kým nezlúči znova. Klient, ktorý tieto úpravy zmeškal, alebo ten, ktorý sa medzitým pripojí, ich nemá a zadrží neskoršie úpravy každého zapisovateľa, ktorého úpravy zhutňovač zlúčil. Ďalšie zlúčenie zhutňovača ich všetky vráti, pokiaľ víťazná snímka stavu neobsahovala úpravy, ktoré mu chýbali, čo ho znova otvorí na tej snímke stavu a to, čo zlúčil, navždy stratí.

Zhutňovač vracia vo vlastnom zlúčení, urobenom po tom, ako dobehol víťaznú snímku stavu, bez voľby, odkladu alebo prahu, a každý klient sa na tomto zlúčení znova otvorí s `rejoin('snapshot')`.  
Úpravy, ktoré vráti, sa nedostanú k žiadnemu klientovi mimo tohto zlúčenia, takže klient online po celý čas skončí rovnako ako ostatní a ako ten, ktorý sa pripojí neskôr, aj keď neskoršia úprava iného zapisovateľa stavia na jednej z nich, napríklad premenovanie tabuľky, ktorú pridal iný klient.  
Každé vrátenie stojí každého klienta toto opätovné pripojenie, spolu s [tým, čo opätovné pripojenie stratí](#offline-edits-and-rejoins). Keď vracajú dva zhutňovače naraz, každý klient stále skončí rovnako, hoci úprava môže zostať aplikovaná pred tou, na ktorej stavia.  
Väzba zničená alebo zastavená pred spustením tohto zlúčenia, napríklad keď ju zničí poslucháč `rejoin`, vráti úpravy samostatne. Žiadna sa nestratí, ale klient online po celý čas potom môže aplikovať jednu po úprave iného zapisovateľa, ktorá na nej stavia, a skončiť inak než ten, ktorý sa pripojí neskôr.

## Limity {#limits}

- **Zobrazovacia oblasť zostáva na každej obrazovke.** Posúvania, priblíženia a prepnutia kariet sa [nikdy nezapisujú](#what-the-room-holds), hoci ich relácia prepojená cez `getSharedStore` odosiela (ani tam nehýbu zobrazením ani kartou nikoho iného). Každý čitateľ si ponechá vlastné a väzba ich uvádza iba vo svojom stave Awareness, ktorý zatiaľ nič nečíta. Pri vypnutom [zamknutí](../../guide/guides/settings.md#lock) `Viewport` alebo `Canvas Type` ukladá `value` každého klienta jeho vlastné hodnoty; pod zamknutiami, ktoré má nový dokument zapnuté, ukladá každý klient zamknuté hodnoty.
- **Snímka stavu rastie o jeden záznam na väzbu.** Pre každú väzbu, ktorá kedy do miestnosti zapísala, uchováva, nakoľko sú jej úpravy zlúčené, a nikdy žiadnu nezahodí. Väzba vytvorená znova alebo taká, ktorá prešla na inú inicializáciu, sa počíta odznova, rovnako ako každé zlúčenie, ktoré vracia. Záznam je 32-znakový identifikátor a číslo, takže desaťtisíc zapisujúcich relácií pridá niekoľko stoviek kilobajtov do každej snímky stavu a každého zlúčenia.
- **Hub a miestnosť si medzi sebou nič nepreposielajú.** Element previazaný s miestnosťou a s [hubom](../../mcp/live-and-headless.md#live) programovacieho agenta alebo s ľubovoľným iným prenosom cez `getSharedStore()` aplikuje úpravy oboch, no ani jeden nepočuje úpravy druhého, keďže zdieľané úložisko nikdy neposiela ďalej to, čo prijalo.
- **Pridania urobené naraz môžu byť zoradené inak.** Tabuľky alebo poznámky, ktoré dvaja klienti pridajú naraz, môžu stáť v diagrame každého klienta v inom poradí, ako v relácii prepojenej cez `getSharedStore` – pozrite si časť [Súbežné úpravy](./collaborative-editing.md#concurrent-edits).
- **Farby a niekoľko ďalších zmien urobených naraz môže skončiť rozdielne.** Zmena farby sa zapíše bez verzie a každý klient ju pri aplikovaní označí vlastnou. Dve zmeny farby jednej tabuľky, poznámky alebo skupiny tabuliek urobené naraz tak môžu nechať klientov, a klienta, ktorý sa pripojí neskôr a zopakuje denník, s rôznymi farbami. To isté platí o ďalších zmenách, ktoré každý klient aplikuje v poradí, v akom ich počuje, ako sú dva presuny stĺpcov v rámci jednej tabuľky alebo indexu či dve zmeny databázy – pozrite si časť [Súbežné úpravy](./collaborative-editing.md#concurrent-edits).
- **Odchádzajúci kurzor čaká na server.** Väzba vymaže kurzor účastníka hneď, ako ho Awareness zahodí. Server, ktorý pri zatvorení socketu odstráni iba stavy Awareness, ktoré tento socket pridal ako prvé, ponechá klienta, ktorý sa znova pripojil, na obrazovkách ostatných aj po jeho odchode, kým ho Awareness po uplynutí časového limitu neodstráni, o 30 sekúnd neskôr. Ten, ktorý odstráni každý stav, ktorý socket naposledy zapísal, aktualizáciu rovnako ako pridanie, ho vymaže okamžite.

## Exporty {#exports}

| Export | Popis |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | Previaže element `<erd-editor>` – pozrite si časť [Použitie](#usage). Vráti [ErdYjsBinding](#erdyjsbinding). |
| `bindPeerStore(peer, doc, options?)` | Previaže úložisko účastníka z `@dineug/erd-editor/peer.js` – pozrite si časť [Zhutňovanie miestnosti](#compacting-a-room). Vráti to isté s [compact](#compact) (`ErdYjsPeerBinding`). |
| `ERD_YJS_FORMAT` | Štruktúra `Y.Doc`, ktorú zapisuje toto vydanie, `1`; väzba odmietne miestnosť zapísanú v inej. |

Typy: `BindOptions`, `PeerBindOptions`, `CompactOptions`, `CompactResult`, `BindingEvents`, `RejoinReason`, `ErdYjsBinding`, `ErdYjsPeerBinding`.
