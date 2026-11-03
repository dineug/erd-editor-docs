---
sidebar_position: 2
description: Ohranjajte usklajenost elementa <erd-editor> ali shrambe udeleženca brez vmesnika prek dokumenta Yjs s paketom @dineug/erd-editor-yjs, inicializirajte sobo, prikažite prisotnost prek Awareness, urejajte brez povezave in strnite zgodovino sobe s pomožnim procesom za strnitev.
---

# Yjs

`@dineug/erd-editor-yjs` ohranja usklajenost diagramov prek dokumenta [Yjs](https://github.com/yjs/yjs). Je samostojen paket, prvič izdan kot različica `0.1.0` ob paketu `@dineug/erd-editor` `5.1.0`.  
`bindErdEditor` poveže element `<erd-editor>`, `bindPeerStore` pa shrambo udeleženca brez vmesnika iz `@dineug/erd-editor/peer.js` z dokumentom `Y.Doc`.  
Diagram prenaša vsak ponudnik, ki prenaša `Y.Doc`: strežnik websocket, WebRTC, IndexedDB ali vaš lasten. Ponudnik in `Y.Doc` ostaneta vaša: vezava ju nikoli ne poveže, ne odklopi in ne uniči.

Spremembe potujejo kot lastni paketi dejanj urejevalnika, ki jih vezava hrani take, kot jih je poslala shramba.  
Zato registri sodelovanja urejevalnika razrešijo spremembe, narejene v istem trenutku, tako kot v seji, povezani prek `getSharedStore`, z enakimi izjemami, kot je sprememba barve – glejte razdelek [Sočasne spremembe](./collaborative-editing.md#concurrent-edits).  
Kazalci, fokus, izbori in okvirji vlečenja potujejo prek Awareness ponudnika – glejte razdelek [Prisotnost](#presence).  
V primerjavi z lastno povezavo skupne shrambe s prenosom vezava doda:

- Odjemalec, ki se pridruži, odpre diagram, ki ga hrani soba, brez lastnosti [runtimeValue](../erd-editor-element.md#runtimevalue), ki bi jo predal delujoč urejevalnik.
- Odjemalec, ki je izgubil povezavo, lahko še naprej ureja, njegove spremembe pa pristanejo, ko se znova poveže – glejte razdelek [Spremembe brez povezave in ponovne pridružitve](#offline-edits-and-rejoins).
- `Y.Doc`, ki ga vrne ponudnik trajne shrambe, odpre diagram, ki ga hrani – glejte razdelek [Kaj hrani soba](#what-the-room-holds).
- Neobvezen pomožni proces Node strne zgodovino sobe v en posnetek – glejte razdelek [Strnitev sobe](#compacting-a-room).

Vezava potrebuje pet metod, ki jih je različica `5.1.0` dodala skupni shrambi in shrambi udeleženca – [getLWW](./collaborative-editing.md#getlww), [mergeLWW](./collaborative-editing.md#mergelww), [getVersion](./collaborative-editing.md#getversion), [forgetPeer](./collaborative-editing.md#forgetpeer) in [reseed](./collaborative-editing.md#reseed) – in vse potrebne klice nanje opravi sama.

## Namestitev {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`, `yjs` in `y-protocols` so odvisnosti peer, zato stran vsebuje po eno kopijo vsakega: `@dineug/erd-editor` `5.1.0` ali novejši v okviru `5.x`, `yjs` `13.6` ali novejši v okviru `13.x` in `y-protocols` `1.0` ali novejši v okviru `1.x`.  
Paket vzame samo njihove tipe in deluje na `Y.Doc` in `Awareness`, ki ju predate, zato sam ne naloži nobene kode Yjs, y-protocols ali urejevalnika.  
Dve kopiji Yjs na eni strani pokvarita preverjanja konstruktorjev druga druge, druga pa zapiše `Yjs was already imported`. Kadar vaša koda in ponudnik razrešita `yjs` z dveh mest, odstranite podvojitev v združevalniku (Vite: `resolve.dedupe: ['yjs']`).

Paket je samo ESM (`"type": "module"`), z eno vstopno točko, korenom paketa, in je označen kot brez stranskih učinkov, zato sveženj, ki uvozi samo `bindErdEditor`, izpusti strnjevalnik.  
`bindErdEditor` potrebuje DOM, saj poveže definiran element `<erd-editor>`. `bindPeerStore` deluje tudi v navadnem okolju Node.js, različice 22.12 ali novejše, kot deluje [pomožni proces za strnitev](#compacting-a-room).

## Uporaba {#usage}

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

`wss://yjs.example.com` in `my-diagram` označujeta vaš lasten strežnik in sobo.  
Povežite in inicializirajte šele, ko se ponudnik sinhronizira, kot pove dogodek `sync` ponudnika y-websocket z vrednostjo `true`. Prej narejena inicializacija lahko zamenja diagram sobe – glejte razdelek [Inicializacija sobe](#seeding-a-room).

Kadar `Y.Doc` ob povezavi hrani posnetek sobe, ga vezava takoj odpre v elementu: naloži posnetek z njegovimi registri in različico, kot to stori metoda [reseed](./collaborative-editing.md#reseed), in uporabi vse spremembe, zabeležene od takrat.  
To odpiranje počisti in zapre isto kot ponovna pridružitev – glejte razdelek [Spremembe brez povezave in ponovne pridružitve](#offline-edits-and-rejoins) – element pa se odpre tam, kamor ga postavi posnetek. Za to prvo odpiranje se ne sproži noben dogodek `rejoin`.  
Kadar `Y.Doc` ne hrani posnetka, na primer v prazni sobi ali preden se ponudnik sinhronizira, element obdrži svoj dokument, vezava pa v sobo ne zapiše ničesar, dokler se ne pojavi posnetek: njena lastna [inicializacija](#seed) ali inicializacija drugega odjemalca.

`bindErdEditor` vzame iz elementa eno skupno shrambo z [getSharedStore](../erd-editor-element.md#getsharedstore), [destroy](#destroy) pa jo izpusti.  
Element mora biti že `<erd-editor>`, njegova vstopna točka uvožena ali pa poklican `defineErdEditor()` – glejte razdelek [Registracija elementov](../installation.md#registering-the-elements). Dokler oznaka ni definirana, je `<erd-editor>` navaden `HTMLElement`, ki ga brskalnik nadgradi, ko je oznaka definirana in je element v dokumentu. Za element, ki še ni nadgrajen, `bindErdEditor` vrže `TypeError`, namesto da bi sprožil `error`.

Spremembe sobe se uporabijo v elementu in sprožijo dogodek [change](../erd-editor-element.md#change), kot spremembe sodelavca, med njimi tudi spremembe, ponovno izvedene po odprtju posnetka.  
Odprtje posnetka, ob povezavi ali ob ponovni pridružitvi, ne naredi koraka razveljavitve, ne sproži `change` in v sobo ne zapiše ničesar, razen izpeljave fizičnega imena iz logičnega, ki jo opisuje razdelek [Spremembe brez povezave in ponovne pridružitve](#offline-edits-and-rejoins).  
Če želite v inicializirano sobo naložiti drug dokument, naredite spremembo, ki jo uporabi vsak odjemalec: priredite lastnost [value](../erd-editor-element.md#value), pokličite [clear](../erd-editor-element.md#clear) ali uvozite dokument.  
[setInitialValue](../erd-editor-element.md#setinitialvalue) se nikoli ne zapiše v sobo, saj ga skupna shramba ne pošlje, zato spremeni samo ta element, vsi drugi odjemalci pa obdržijo diagram sobe. Prazno sobo namesto tega inicializirajte z [seed](#seed).

En `Y.Doc` hrani en diagram. Vezava ga hrani pod imeni `erd:` v `Y.Doc` in nastavi polje `erd` lokalnega stanja Awareness, vsa druga imena in polja pa pusti pri miru.  
Vsakemu povezanemu elementu dajte lasten `Y.Doc` in lasten Awareness, kot ju ima vsak odjemalec sobe: dve vezavi, ki si delita en Awareness, druga drugi prepišeta polje `erd`.

## Inicializacija sobe {#seeding-a-room}

Soba ne hrani nobenega diagrama, dokler ga odjemalec ne [inicializira](#seed).  
To, kar urejevalnik medtem hrani, gre v njegovo lastno inicializacijo in odstopi mesto inicializaciji drugega odjemalca, če ta pride prej: vezava se znova odpre na njej z `rejoin('snapshot')`, dokument, ki ga je hranil element, pa je skupaj s tem, kar je bilo v njem urejeno od povezave, izgubljen.

Kadar dva odjemalca inicializirata hkrati, ena inicializacija zmaga pri vseh odjemalcih.  
Drugi odjemalec, ki je inicializiral sobo, se znova odpre na njej z `rejoin('seedLost')` in izgubi, kar je urejal od svoje inicializacije, enako velja za odjemalca, ki se je pridružil poraženi inicializaciji, z `rejoin('snapshot')`. Njihove spremembe v poraženi inicializaciji ne dosežejo nikogar.  
Inicializacija, narejena, preden se je ponudnik sinhroniziral, velja za narejeno v istem trenutku kot inicializacija, iz katere izhaja diagram sobe, zato lahko zmaga nad njo in zamenja diagram sobe.

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

`Awareness`, ki prenaša kazalce, fokus, izbore in okvirje vlečenja, na primer Awareness ponudnika.  
Z njim vezava vklopi sledilnika miške in fokusa elementa in na elementu nariše prisotnost drugih odjemalcev – glejte razdelek [Prisotnost](#presence).  
Brez njega se sinhronizira samo diagram: element ne pošilja kazalca, fokusa ali izbora in ne riše prisotnosti nikogar drugega.

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

Ime, ki ga drugi vidijo ob kazalcu tega urejevalnika.  
Skupna shramba elementa ga prebere ob vsakem pošiljanju, kot pri [getSharedStore](./collaborative-editing.md#getnickname), drugi uporabniki pa vidijo `user`, kadar manjka ali je prazno.

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

`on(event, listener)` vrne funkcijo, ki odstrani poslušalca.

### seed {#seed}

Zapiše prvi posnetek sobe iz dokumenta urejevalnika in vrne `true`.  
Če je podan `value`, besedilo dokumenta v katerikoli obliki, ki jo prebere [setInitialValue](../erd-editor-element.md#setinitialvalue), ga najprej naloži v urejevalnik.  
Nato brez beleženja izpusti vlečenja, spremembe velikosti in spremembe barv, ki jih urejevalnik še zadržuje, tako da nobena ne pristane v sobi za posnetkom. Brez `value` jih posnetek že prikazuje, saj vzame dokument urejevalnika; z `value` so pripadale dokumentu, ki ga je `value` zamenjal.  
Nato zapiše posnetek, ki ga opisuje razdelek [Kaj hrani soba](#what-the-room-holds).  
Ko soba že hrani posnetek, metoda vrne `false` in ne zapiše ničesar ter ne naloži `value`, zato jo lahko po povezavi pokliče vsak odjemalec. Vrne tudi `false`, ko je bila vezava uničena ali ustavljena, in pri vezavi, ki je bila ob povezovanju [zavrnjena](#onerror).

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

Vezava je znova odprla urejevalnik na posnetku sobe, kot to stori metoda [reseed](./collaborative-editing.md#reseed); razdelek [Spremembe brez povezave in ponovne pridružitve](#offline-edits-and-rejoins) pove, kaj obdrži in kaj izgubi.  
`reason` pove, zakaj:

- `'snapshot'`: posnetek vsebuje spremembe, ki jih vezava ni uporabila, ker je bila odsotna, medtem ko jih je strnjevalnik strnil, ali ker je strnjevalnik v lastni strnitvi vrnil to, kar je strnil v posnetek, ki ga je zamenjal posnetek drugega strnjevalnika (glejte razdelek [En strnjevalnik na sobo](#one-compactor-per-room)). To je tudi razlog, ko je posnetek prvi, ki doseže vezavo prazne sobe, in ko je posnetek druge inicializacije, vezava pa se je pridružila inicializaciji, ki je ni zapisala.
- `'seedLost'`: inicializacija drugega odjemalca je zmagala nad inicializacijo, ki jo je zapisala ta vezava.

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

Vezava je zavrnila povezavo, se ustavila ali zavrnila možnost. Vsako sporočilo se začne z `erd-editor-yjs: `.

Ob povezovanju ne poveže ničesar, kadar:

- je urejevalnik ali shramba udeleženca že povezana s tem `Y.Doc`;
- je njegov `@dineug/erd-editor` zgrajen pred različico `5.1.0`; vezava uniči skupno shrambo, ki jo je vzela iz elementa;
- je bila shramba udeleženca uničena, preden je bila povezana;
- soba hrani posnetek v obliki, ki je ta izdaja ne bere (glejte razdelek [Kaj hrani soba](#what-the-room-holds)).

Taka vezava sproži `error` v mikroopravilu, zato ga sliši tudi poslušalec, dodan takoj po klicu, in na njej se nikoli ne sproži `rejoin`.

Pozneje se vezava ustavi, kadar:

- se posnetek sobe spremeni v obliko, ki je ta izdaja ne bere. Ustavijo se vse vezave te izdaje, vsak urejevalnik obdrži, kar je uporabil, in nič, kar je urejeno pozneje, se ne zapiše;
- je bila njena shramba udeleženca uničena pod njo, kar se ugotovi ob naslednji spremembi sobe ali ob klicu `seed()` ali `compact()`.

Vezava, ki se ustavi, izpusti skupno shrambo, ki jo je vzela, ter svojo shrambo in `Y.Doc` kot par, kot to stori [destroy](#destroy), in obdrži svoje poslušalce.

Samo pri `bindPeerStore` ti primeri sprožijo `error`, vezava pa se nadaljuje:

- `compactAfter` ni pozitivno celo število: vezava strne samo na zahtevo;
- `electionGraceMs` ali `retainMs` ni število od 0 do 2.147.483.647 ms: nadomesti ga privzeta vrednost, saj se časovnik zunaj tega obsega sproži takoj;
- `synced` se zavrne: vezava ne strne nikoli in volitve prepusti drugim strnjevalnikom (glejte razdelek [En strnjevalnik na sobo](#one-compactor-per-room)).

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

Pošlje v sobo vlečenja, spremembe velikosti in spremembe barv, ki jih urejevalnik še zadržuje, nastavi polje Awareness `erd` vezave na `null`, tako da drugi takoj opustijo njen kazalec, fokus in izbor, ter preneha opazovati `Y.Doc` in Awareness.  
Za element uniči tudi skupno shrambo, ki jo je vzela, element in njegov dokument pa pusti, kakršna sta.  
Drugi klic ne naredi ničesar. Pozneje nič, kar urejevalnik uredi, ne doseže nikogar.

Shramba udeleženca, `Y.Doc` in ponudnik ostanejo vaši, da jih uničite po vezavi: shramba udeleženca, uničena prej, nikoli ne pošlje vlečenj, ki jih je še zadrževala.  
Lastna metoda [destroy](../erd-editor-element.md#destroy) elementa uniči vsako skupno shrambo, ki jo je izročil, tudi shrambo vezave, in opusti to, kar zadržujejo, zato najprej uničite vezavo.  
Vezavo uničite, preden isti urejevalnik ali shrambo udeleženca znova povežete z istim `Y.Doc`; vezava, ki se je ustavila z `error`, je že izpustila vse.

```js
binding.destroy();
editor.destroy();
```

## Prisotnost {#presence}

Z možnostjo [awareness](#awareness) kazalec urejevalnika, tabela ali celica s fokusom, izbor in okvir vlečenja potujejo v polju `erd` lokalnega stanja Awareness, nikoli v `Y.Doc`, zato nikoli ne vstopijo v zgodovino sobe, njen posnetek ali trajno shranjen `Y.Doc`.  
Drugi jih narišejo, kot narišejo prisotnost sodelavca – glejte razdelek [focusTracker](./collaborative-editing.md#focustracker) – odjemalec, ki se pridruži, pa nariše prisotnost, ki jo soba že prikazuje.  
Element fokus in izbor pošlje znova vsakih 30 sekund, okvir vlečenja pa vsako sekundo. Vsaka od teh ponovnih pošiljk doseže druge, tudi kadar ponovi zadnjo, tako da tisto, kar uporabnik še drži, nikoli ne poteče.

Odjemalec, ki odide, je takoj pozabljen.  
Kadar Awareness opusti njegovo stanje ali kadar njegovo polje `erd` postane `null`, kot ga nastavi [destroy](#destroy), ali začne navajati drug urejevalnik, vezava odstrani kazalec, fokus, izbor in okvir vlečenja tega urejevalnika iz elementa z [forgetPeer](./collaborative-editing.md#forgetpeer), namesto da bi čakala, da potečejo.  
Obdrži jih, dokler drug odjemalec še prikazuje isti urejevalnik, kot to počne element, ki je znova povezan z drugim `Y.Doc` sobe.

## Spremembe brez povezave in ponovne pridružitve {#offline-edits-and-rejoins}

Odjemalec, odrezan od ponudnika, lahko še naprej ureja. Njegove spremembe čakajo v njegovem lokalnem `Y.Doc`, ne v skupni shrambi, in dosežejo druge, ko se ponudnik znova poveže in sinhronizira.

Kadar je strnjevalnik strnil spremembe, ki jih odjemalec med odsotnostjo nikoli ni uporabil, jih posnetek vsebuje, zato se odjemalec ob ponovni povezavi z `rejoin('snapshot')` znova odpre na posnetku, potem ko je poslal vlečenja, spremembe velikosti in spremembe barv, ki jih njegov urejevalnik še zadržuje. Strnitev samo tistega, kar je odjemalec že uporabil, ne odpre ničesar znova.  
Ponovna pridružitev na posnetek inicializacije, kateri se je vezava pridružila, ponovno izvede vsako spremembo, ki je posnetek ne vsebuje, med njimi tudi spremembe tega odjemalca, narejene med odsotnostjo, zato nobena ni izgubljena. Ponovna pridružitev na drugo inicializacijo ne obdrži ničesar, kot opisuje razdelek [Inicializacija sobe](#seeding-a-room).

Vsaka ponovna pridružitev počisti zgodovino razveljavitev, izbor in fokus, zapre odprt [način Tok](../../guide/guides/visualization.md#flow-mode), konča [risanje relacije](../../guide/guides/editing-start.md#relationship-creation) ter zapre urejanje beležke, imena skupine tabel ali celice, saj lahko navajajo to, česar posnetek ne hrani več.  
Vtipkano ime skupine tabel, ki še ni potrjeno, je opuščeno. Celica logičnega imena, ki se zapre, izpelje fizično ime iz logičnega imena, ki ga je vtipkal bralec, kjer ga ponovno odprti dokument še hrani, kot to stori vsako zapiranje te celice. Ta izpeljava je navadna sprememba: soba jo zabeleži, naredi korak razveljavitve in sproži `change` – glejte razdelek [reseed](./collaborative-editing.md#reseed).  
Vezava, ki se je pridružila sobi, obdrži to, kar vidi njen bralec: položaj pomika, stopnjo povečave in zavihek ter nastavitve, ki jih je spremenil bralec samo za branje.  
Obdrži tudi prikaz imen in nastavitve kode (jezik generatorja kode, zapis imen in vrsta narekovajev), ki jih je bralec prikazal sam, če je bil [zaklep](../../guide/guides/settings.md#lock) posamezne nastavitve vklopljen že pred ponovno pridružitvijo in je po njej še vedno vklopljen pri isti zaklenjeni vrednosti.  
Nič od tega, kar obdrži, ne doseže lastnosti `value`, ki poroča o nastavitvah ponovno odprtega dokumenta – glejte razdelek [reseed](./collaborative-editing.md#reseed) z možnostjo `keepScreen`.  
Položaj pomika in stopnja povečave elementa, ki od zadnjega nalaganja ni bil prikazan, ter ves zaslon vezave, ki se še ni pridružila, se odprejo tam, kamor jih postavi posnetek.  
Shramba udeleženca nima zaslona, zato njena ponovna pridružitev ne obdrži nobenega.

## Urejevalniki samo za branje {#read-only-editors}

Element [samo za branje](../erd-editor-element.md#readonly), povezan s sobo, v zgodovino sobe ne zapiše ničesar: njegova skupna shramba ne pošlje nobene spremembe, samo svoje sledilnike in izmenjavo registrov, soba pa [ne beleži ne enega ne drugega](#what-the-room-holds).  
Še vedno uporabi vsako spremembo, ki jo nosi soba, z možnostjo [awareness](#awareness) pa kazalec, fokus, izbor in okvir vlečenja njegovega bralca še vedno dosežejo druge.  
Nastavitve, ki jih spremeni njegov bralec, ostanejo na njegovem zaslonu, kot pri vsakem urejevalniku samo za branje.  
Metoda [seed](#seed) ni zavrnjena: element samo za branje inicializira prazno sobo z dokumentom, ki ga hrani, ali z `value`, če je podan.

## Kaj hrani soba {#what-the-room-holds}

Vezava hrani diagram v dveh imenih `Y.Doc`: `erd:snapshot`, preslikavi, ki hrani posnetek dokumenta, in `erd:log`, polju paketov dejanj urejevalnika od njega naprej. Ponudnik trajne shrambe shrani oboje skupaj s preostankom `Y.Doc`.

Posnetek hrani [runtimeValue](../erd-editor-element.md#runtimevalue) dokumenta, vključno z odstranjenimi entitetami, njegove registre sodelovanja in različico ter to, do kod so spremembe posameznega pisca strnjene vanj. Zapiše ga inicializacija, pa tudi vsaka strnitev strnjevalnika.  
Vsak vnos v dnevniku je en paket, kot ga je poslal urejevalnik, skupaj z metapodatki, ki nosijo identifikator urejevalnika in vzdevek pošiljatelja.  
Pomiki, povečave, preklopi zavihkov, prisotnost in izmenjava registrov se nikoli ne beležijo. Beleži se vsaka druga sprememba, ki jo pošlje urejevalnik, med njimi preklop prikaza imen, narejen pod njegovim [zaklepom](../../guide/guides/settings.md#lock), ki ga vsak drug odjemalec zavrže.  
Jezik generatorja kode, zapis imen ali vrsta narekovajev, spremenjeni pod njihovim zaklepom, se nikoli ne pošljejo, zato ostanejo na zaslonu tistega urejevalnika in nikoli ne dosežejo sobe.

`Y.Doc`, ki ga vrne ponudnik trajne shrambe, odpre diagram, ki ga hrani, kot vezava odpre vsak `Y.Doc` s posnetkom – glejte razdelek [Uporaba](#usage).

Posnetek ni datoteka: njegova vrednost med izvajanjem nosi odstranjene entitete, ki jih datoteka ne sme hraniti.  
Če želite diagram sobe zapisati v shrambo, shranite [value](../erd-editor-element.md#value) povezanega elementa vsakič, ko se sproži njegov dogodek [change](../erd-editor-element.md#change).  
Shranite ga tudi enkrat po povezavi, po [inicializaciji](#seed) z danim `value` in v poslušalcu [rejoin](#onrejoin), saj nobeno od teh nalaganj ne sproži dogodka `change`.  
Element [samo za branje](../erd-editor-element.md#readonly) nikoli ne sproži dogodka `change`, zato shranjujte iz elementa, ki ni samo za branje, ali preberite `value` iz povezane shrambe udeleženca, ki spremembe sobe uporabi sproti, ko prispejo.  
Shrambe [replicationStore](./remote-storage.md) ni mogoče povezati, ker ji manjkajo metode, ki jih vezava potrebuje, shramba, napajana iz skupne shrambe povezanega elementa, pa zgreši spremembe sobe – glejte razdelek [Replikacija delujočega urejevalnika](./remote-storage.md#replicating-a-live-editor).

Oblika je zasebna in se lahko spremeni z [ERD_YJS_FORMAT](#exports).  
Sobo berite samo prek vezave, imena `erd:` in polje Awareness `erd` pa prepustite njej.

## Strnitev sobe {#compacting-a-room}

Zgodovina sobe raste z vsako spremembo in vsak odjemalec, ki se pridruži, jo vso znova izvede, dokler je kaj ne strne.  
`bindPeerStore` poveže shrambo udeleženca brez vmesnika iz `@dineug/erd-editor/peer.js` in vrne `ErdYjsPeerBinding`: iste metode [seed](#seed), [on](#erdyjsbinding) in [destroy](#destroy) ter [compact](#compact).  
Shramba udeleženca, povezana v procesu Node ob strežniku, pomožnem procesu, strne zgodovino v posnetek svojega diagrama.  
Vezava elementa nikoli ne strne, shramba udeleženca, povezana brez `compactAfter` in brez klica `compact()`, pa je navaden udeleženec brez vmesnika.

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

Shramba udeleženca ostane vaša: vezava je nikoli ne uniči. Njen vzdevek je tisti, ki je bil podan funkciji `createPeerStore`, `presence: false` pa preprečuje, da bi pošiljala lasten fokus.

Strnitev zapiše posnetek iz lastne vrednosti med izvajanjem, registrov in različice shrambe udeleženca ter izbriše vnose dnevnika, ki jih pokriva, in vse vnose druge inicializacije, vse v eni transakciji.  
Odjemalci, ki so uporabili vse, vidijo, kako vnosi izginejo; odjemalec, ki ni, se znova odpre na posnetku (glejte razdelek [Spremembe brez povezave in ponovne pridružitve](#offline-edits-and-rejoins)).  
Vsaka strnitev znova zapiše ves diagram v posnetek, zato vsaka pošlje vsakemu odjemalcu posodobitev, veliko približno toliko kot JSON vrednosti med izvajanjem diagrama in registrov skupaj, ne glede na to, kako malo vnosov zajame. Nastavite `compactAfter` dovolj visoko, da vnosi, ki jih strnitev zajame, odtehtajo eno kopijo diagrama.

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

| Možnost | Privzeto | Opis |
| --- | --- | --- |
| `awareness` | Brez | Prikaže shrambo udeleženca v Awareness sobe, tako kot možnost [awareness](#awareness) prikaže element. Strnjevalnik, ki strne sam od sebe, je tam označen, zato strnjevalniki, ki se vidijo, izberejo enega, ki strne, tisti, ki ne vidi nobenega drugega odjemalca, pa sam od sebe ne strne ničesar – glejte razdelek [En strnjevalnik na sobo](#one-compactor-per-room). Brez nje strnjevalnik strne sam od sebe brez volitev in brez odloga. |
| `compactAfter` | Brez | Strne sam od sebe, ko dnevnik hrani toliko vnosov, kolikor bi jih strnitev zajela. Brez te možnosti ali brez `synced` strneta samo `compact()` in strnitev, ki vrača (glejte razdelek [En strnjevalnik na sobo](#one-compactor-per-room)). |
| `synced` | Brez | Promise, ki se razreši, ko se je ponudnik sinhroniziral. Pred tem ne strne nič, tudi `compact()` ne. Brez njega nič ne strne samo od sebe, `compact()` pa strne takoj. |
| `electionGraceMs` | `3000` | Koliko časa strnjevalnik ob možnosti `awareness` opazuje sobo, preden strne sam od sebe, po `synced` in znova vsakič, ko se drugi odjemalci pokažejo, potem ko jih ni bilo nobenega. |
| `retainMs` | `600000` (deset minut) | Kako dolgo se vnosi strnitve zadržujejo za vrnitev (glejte razdelek [En strnjevalnik na sobo](#one-compactor-per-room)), šteto od prve posodobitve, ki jo soba pošlje po strnitvi. |

Neveljavna možnost ali `synced`, ki se zavrne, sproži [error](#onerror).

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

Strne takoj, brez volitev, odloga ali praga.  
Najprej prevzame trenutni posnetek sobe, vključno s ponovno pridružitvijo, in pošlje, kar njena shramba udeleženca še zadržuje.  
Odgovori z `{ compacted: true, generation }`, kjer `generation` šteje strnitve posnetka: `0` za inicializacijo, ena več za vsako strnitev.  
V nasprotnem primeru odgovori z `{ compacted: false, reason }`:

- `'destroyed'`, ko je bila vezava uničena ali ustavljena, in pri vezavi, ki je bila ob povezovanju [zavrnjena](#onerror), tudi preden se `synced` razreši;
- `'not-synced'`, preden se `synced` razreši;
- `'no-snapshot'` v sobi, ki je noben odjemalec ni inicializiral.

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## En strnjevalnik na sobo {#one-compactor-per-room}

Poganjajte natanko en strnjevalnik na sobo in novega zaženite šele, ko se je stari ustavil. Tega nič ne uveljavlja.  
Med strnjevalniki, ki se vidijo v Awareness, sam od sebe strne samo tisti z najmanjšim identifikatorjem odjemalca Yjs, ko odide ali se njegov `synced` zavrne, pa njegovo vlogo takoj prevzame naslednji.  
Strnjevalnik, katerega Awareness ne kaže nobenega drugega odjemalca, na primer ko se njegova lastna vtičnica zapre in jih vse opusti, sam od sebe ne strne ničesar, dokler se drugi ne pokažejo znova in dokler sobe ne opazuje toliko časa, kot določa `electionGraceMs`.

Dva strnjevalnika, odrezana drug od drugega, ali ponovni zagon, katerega predhodnik še teče, lahko še vedno oba strneta.  
Soba nato obdrži enega od obeh posnetkov, strnjevalnik, čigar posnetek je izgubil, pa vrne to, kar je strnil in česar zmagovalec ne hrani, dokler to hrani: `retainMs` in največ svojih zadnjih 1.000 vnosov, ne glede na to, kako velik je vsak.  
Zato nič ni izgubljeno, kadar je strnjevalnik, čigar posnetek izgubi, tisti, ki se znova poveže, če v času ločenosti ni strnil več kot 1.000 vnosov.  
Kadar je tisti, ki je ostal povezan, in je njegovo zadrževanje poteklo, posnetek in zgodovina sobe nimata tega, kar je strnil, dokler ne strne znova. Odjemalec, ki je zgrešil te spremembe, ali tisti, ki se medtem pridruži, jih nima in zadrži poznejše spremembe vsakega pisca, katerega spremembe je strnjevalnik strnil. Naslednja strnitev strnjevalnika jih vse vrne, razen če je zmagoviti posnetek hranil spremembe, ki jih strnjevalnik ni imel, kar ga znova odpre na tem posnetku in za vedno izgubi to, kar je strnil.

Strnjevalnik vrne v lastni strnitvi, narejeni, ko je dohitel zmagoviti posnetek, brez volitev, odloga ali praga, in vsak odjemalec se znova odpre na tej strnitvi z `rejoin('snapshot')`.  
Spremembe, ki jih vrne, ne dosežejo nobenega odjemalca drugače kot s to strnitvijo, zato odjemalec, ki je bil ves čas povezan, konča enako kot drugi in kot tisti, ki se pridruži pozneje, tudi kadar se na eno od njih opre poznejša sprememba drugega pisca, na primer preimenovanje tabele, ki jo je dodal drug odjemalec.  
Vsaka vrnitev vsakega odjemalca stane to ponovno pridružitev, skupaj s [tem, kar ponovna pridružitev izgubi](#offline-edits-and-rejoins). Kadar dva strnjevalnika vračata hkrati, vsi odjemalci še vedno končajo enako, čeprav lahko ostane uporabljena sprememba pred tisto, na kateri sloni.  
Vezava, uničena ali ustavljena, preden ta strnitev steče, na primer ko jo uniči poslušalec `rejoin`, vrne spremembe sama. Nobena ni izgubljena, vendar lahko odjemalec, ki je bil ves čas povezan, uporabi eno za spremembo drugega pisca, ki se nanjo opira, in konča drugače kot tisti, ki se pridruži pozneje.

## Omejitve {#limits}

- **Vidno območje ostane na vsakem zaslonu.** Pomiki, povečave in preklopi zavihkov se [nikoli ne beležijo](#what-the-room-holds), čeprav jih seja, povezana prek `getSharedStore`, pošilja (tudi tam ne premaknejo pogleda ali zavihka nobenega drugega uporabnika). Vsak bralec obdrži svoje, vezava pa ga prikaže samo v svojem stanju Awareness, ki ga zaenkrat nič ne bere. Z izklopljenim [zaklepom](../../guide/guides/settings.md#lock) `Viewport` ali `Canvas Type` lastnost `value` vsakega odjemalca shrani svoje; pod zaklepi, ki so v novem dokumentu vklopljeni, vsak odjemalec shrani zaklenjeno.
- **Posnetek raste za en vnos na vezavo.** Za vsako vezavo, ki je kdaj pisala v sobo, hrani, do kod so njene spremembe strnjene, in nobene ne opusti. Znova narejena vezava ali vezava, ki je prešla na drugo inicializacijo, šteje znova, prav tako vsaka strnitev, ki vrača. Vnos je identifikator z 32 znaki in število, zato deset tisoč sej, ki pišejo, doda nekaj sto kilobajtov vsakemu posnetku in vsaki strnitvi.
- **Središče in soba si med seboj ničesar ne posredujeta.** Element, povezan s sobo in s [središčem](../../mcp/live-and-headless.md#live) agenta za kodiranje ali z drugim prenosom prek `getSharedStore()`, uporabi spremembe obeh, vendar središče ne sliši sprememb sobe in soba ne sprememb središča, saj skupna shramba ne pošilja naprej tega, kar je prejela.
- **Hkrati narejena dodajanja se lahko razvrstijo različno.** Tabele ali beležke, ki jih hkrati dodata dva odjemalca, lahko stojijo v različnem vrstnem redu v diagramu vsakega odjemalca, kot v seji, povezani prek `getSharedStore` – glejte razdelek [Sočasne spremembe](./collaborative-editing.md#concurrent-edits).
- **Barve in nekatere druge hkrati narejene spremembe lahko končajo različno.** Sprememba barve se zabeleži brez različice, vsak odjemalec pa jo ob uporabi opremi s svojo. Dve hkratni spremembi barve iste tabele, beležke ali skupine tabel zato lahko pustita odjemalce in odjemalca, ki se pridruži pozneje in znova izvede dnevnik, pri različnih barvah. Enako velja za druge spremembe, ki jih vsak odjemalec uporabi v vrstnem redu, v katerem jih sliši, na primer dva premika stolpca znotraj ene tabele ali indeksa ali dve spremembi zbirke podatkov – glejte razdelek [Sočasne spremembe](./collaborative-editing.md#concurrent-edits).
- **Odhajajoči kazalec čaka na strežnik.** Vezava počisti kazalec udeleženca, brž ko ga Awareness opusti. Strežnik, ki ob zaprtju vtičnice odstrani samo stanja Awareness, ki jih je ta vtičnica najprej dodala, obdrži odjemalca, ki se je znova povezal, na zaslonih drugih po njegovem odhodu, dokler ga Awareness po 30 sekundah ne odstrani zaradi poteka časa. Strežnik, ki odstrani vsako stanje, ki ga je vtičnica nazadnje zapisala, posodobitev prav tako kot dodajanje, ga počisti takoj.

## Izvozi {#exports}

| Izvoz | Opis |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | Poveže element `<erd-editor>` – glejte razdelek [Uporaba](#usage). Vrne [ErdYjsBinding](#erdyjsbinding). |
| `bindPeerStore(peer, doc, options?)` | Poveže shrambo udeleženca iz `@dineug/erd-editor/peer.js` – glejte razdelek [Strnitev sobe](#compacting-a-room). Vrne isto, skupaj z metodo [compact](#compact) (`ErdYjsPeerBinding`). |
| `ERD_YJS_FORMAT` | Oblika `Y.Doc`, ki jo zapiše ta izdaja, `1`; vezava zavrne sobo, zapisano v drugi obliki. |

Tipi: `BindOptions`, `PeerBindOptions`, `CompactOptions`, `CompactResult`, `BindingEvents`, `RejoinReason`, `ErdYjsBinding`, `ErdYjsPeerBinding`.
