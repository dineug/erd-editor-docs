---
sidebar_position: 2
description: Păstrați sincronizat un element <erd-editor> sau un store partener fără interfață printr-un document Yjs cu @dineug/erd-editor-yjs, inițializați o cameră, afișați prezența prin Awareness, continuați editarea offline și restrângeți istoricul camerei cu un proces auxiliar de compactare.
---

# Yjs

`@dineug/erd-editor-yjs` păstrează diagramele sincronizate printr-un document [Yjs](https://github.com/yjs/yjs). Este un pachet de sine stătător, lansat prima dată ca `0.1.0` alături de `@dineug/erd-editor` `5.1.0`.  
`bindErdEditor` leagă un element `<erd-editor>`, iar `bindPeerStore` un store partener fără interfață din `@dineug/erd-editor/peer.js`, de un `Y.Doc`.  
Orice furnizor care transportă `Y.Doc` transportă și diagrama: un server websocket, WebRTC, IndexedDB sau al dumneavoastră. Furnizorul și `Y.Doc` rămân în grija dumneavoastră: legătura nu se ocupă niciodată de conectarea, deconectarea sau distrugerea lor.

Editările circulă sub forma loturilor de acțiuni ale editorului, pe care legătura le păstrează așa cum le-a trimis store-ul.  
Astfel, registrele de colaborare ale editorului rezolvă editările făcute în același moment ca într-o sesiune conectată prin `getSharedStore`, cu aceleași excepții, de exemplu o schimbare de culoare (consultați [Editări simultane](./collaborative-editing.md#concurrent-edits)).  
Cursoarele, focusul, selecțiile și casetele de selecție circulă prin Awareness al furnizorului (consultați [Prezență](#presence)).  
Față de conectarea manuală a unui store partajat la un mecanism de transport, legătura adaugă:

- Un client care se alătură deschide diagrama pe care o conține camera, fără ca un [runtimeValue](../erd-editor-element.md#runtimevalue) să fie predat de la un editor în funcțiune.
- Un client deconectat continuă să editeze, iar editările sale ajung în cameră la reconectare (consultați [Editări offline și realăturări](#offline-edits-and-rejoins)).
- Un `Y.Doc` returnat de un furnizor de persistență deschide diagrama pe care o conține (consultați [Ce conține camera](#what-the-room-holds)).
- Un proces auxiliar (sidecar) opțional pentru Node restrânge istoricul camerei într-un singur instantaneu (consultați [Compactarea unei camere](#compacting-a-room)).

Legătura are nevoie de cele cinci metode pe care `5.1.0` le-a adăugat la store-ul partajat și la store-ul partener – [getLWW](./collaborative-editing.md#getlww), [mergeLWW](./collaborative-editing.md#mergelww), [getVersion](./collaborative-editing.md#getversion), [forgetPeer](./collaborative-editing.md#forgetpeer) și [reseed](./collaborative-editing.md#reseed) – și face singură toate apelurile necesare către ele.

## Instalare {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`, `yjs` și `y-protocols` sunt dependențe peer, astfel încât o pagină conține câte o singură copie din fiecare: `@dineug/erd-editor` `5.1.0` sau o versiune ulterioară din `5.x`, `yjs` `13.6` sau o versiune ulterioară din `13.x` și `y-protocols` `1.0` sau o versiune ulterioară din `1.x`.  
Pachetul preia doar tipurile lor și lucrează pe `Y.Doc` și `Awareness` pe care i le transmiteți, deci nu încarcă propriul cod Yjs, y-protocols sau de editor.  
Două copii ale Yjs într-o pagină își strică reciproc verificările de constructor, iar a doua scrie în consolă `Yjs was already imported`. Când codul dumneavoastră și un furnizor rezolvă `yjs` din două locuri, eliminați duplicatul în bundler (Vite: `resolve.dedupe: ['yjs']`).

Pachetul este doar ESM (`"type": "module"`), cu un singur punct de intrare, rădăcina pachetului, și este marcat ca lipsit de efecte secundare, astfel încât un bundle care importă doar `bindErdEditor` lasă compactorul deoparte.  
`bindErdEditor` are nevoie de un DOM, deoarece leagă un element `<erd-editor>` definit. `bindPeerStore` rulează și în Node simplu, pe Node.js 22.12 sau o versiune ulterioară, la fel ca [procesul auxiliar de compactare](#compacting-a-room).

## Utilizare {#usage}

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

`wss://yjs.example.com` și `my-diagram` reprezintă serverul și camera dumneavoastră.  
Legați și inițializați doar după ce furnizorul s-a sincronizat, așa cum o arată evenimentul `sync` al y-websocket cu `true`. O inițializare făcută mai devreme poate înlocui diagrama camerei (consultați [Inițializarea unei camere](#seeding-a-room)).

Când `Y.Doc` conține un instantaneu al camerei în momentul legării, legătura îl deschide imediat în element: încarcă instantaneul împreună cu registrele și marcajul lui de versiune, așa cum face [reseed](./collaborative-editing.md#reseed), și aplică fiecare editare înregistrată de atunci.  
Această deschidere șterge și închide aceleași lucruri ca o realăturare (consultați [Editări offline și realăturări](#offline-edits-and-rejoins)), iar elementul se deschide acolo unde îl pune instantaneul. Pentru această primă deschidere nu se emite niciun `rejoin`.  
Când `Y.Doc` nu conține niciun instantaneu, ca într-o cameră goală sau înainte ca furnizorul să se fi sincronizat, elementul își păstrează documentul, iar legătura nu scrie nimic în cameră până când apare un instantaneu, fie propria [inițializare](#seed), fie a altui client.

`bindErdEditor` ia un singur store partajat de la element cu [getSharedStore](../erd-editor-element.md#getsharedstore), iar [destroy](#destroy) îl eliberează.  
Elementul trebuie să fie deja un `<erd-editor>`, cu punctul său de intrare importat sau cu `defineErdEditor()` apelat (consultați [Înregistrarea elementelor](../installation.md#registering-the-elements)). Până când eticheta este definită, un `<erd-editor>` este un simplu `HTMLElement`, pe care browserul îl actualizează odată ce eticheta este definită și elementul se află în document. Pentru un element încă neactualizat, `bindErdEditor` aruncă un `TypeError` în loc să emită `error`.

Editările camerei se aplică pe element și emit [change](../erd-editor-element.md#change), ca ale unui colaborator, inclusiv editările reluate după deschiderea unui instantaneu.  
Deschiderea unui instantaneu, la legare sau la o realăturare, nu creează nicio intrare de anulare, nu emite `change` și nu scrie nimic în cameră, în afară de derivarea din numele logic descrisă în [Editări offline și realăturări](#offline-edits-and-rejoins).  
Pentru a încărca un alt document într-o cameră inițializată, faceți o modificare pe care o aplică fiecare client: atribuiți [value](../erd-editor-element.md#value), apelați [clear](../erd-editor-element.md#clear) sau importați unul.  
[setInitialValue](../erd-editor-element.md#setinitialvalue) nu este niciodată scris în cameră, deoarece un store partajat nu îl trimite, deci modifică doar acel element, în timp ce toți ceilalți clienți păstrează diagrama camerei. Inițializați în schimb o cameră goală cu [seed](#seed).

Un `Y.Doc` conține o singură diagramă. Legătura o păstrează sub numele `erd:` ale `Y.Doc` și setează câmpul `erd` al stării Awareness locale, lăsând neatins orice alt nume și câmp.  
Dați fiecărui element legat un `Y.Doc` și un Awareness propriu, așa cum are fiecare client al unei camere: două legături care partajează același Awareness își suprascriu reciproc câmpul `erd`.

## Inițializarea unei camere {#seeding-a-room}

O cameră nu conține nicio diagramă până când un client o [inițializează](#seed).  
Ce conține între timp un editor intră în propria lui inițializare și cedează locul inițializării altui client dacă aceea sosește prima: legătura se redeschide pe ea cu `rejoin('snapshot')`, iar documentul pe care îl ținea elementul, cu ce s-a editat în el de la legare, dispare.

Când doi clienți inițializează în același timp, o singură inițializare câștigă pe fiecare client.  
Celălalt client care a inițializat se redeschide pe ea cu `rejoin('seedLost')` și pierde ce a editat de la inițializarea sa, la fel și un client care se alăturase inițializării pierzătoare, cu `rejoin('snapshot')`. Editările lor din inițializarea pierzătoare nu ajung la nimeni.  
O inițializare făcută înainte ca furnizorul să se fi sincronizat contează ca făcută în același moment cu inițializarea din care provine diagrama camerei, deci poate câștiga în fața ei și poate înlocui diagrama camerei.

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

`Awareness` care transportă cursoarele, focusul, selecțiile și casetele de selecție, de exemplu cel al furnizorului.  
Cu el, legătura activează trackerele de mouse și de focus ale elementului și desenează pe element prezența celorlalți clienți (consultați [Prezență](#presence)).  
Fără el se sincronizează doar diagrama: elementul nu trimite niciun cursor, focus sau selecție și nu desenează pe ale nimănui altcuiva.

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

Numele pe care îl văd ceilalți lângă cursorul acestui editor.  
Store-ul partajat al elementului îl citește la fiecare trimitere, ca în cazul [getSharedStore](./collaborative-editing.md#getnickname), iar ceilalți utilizatori văd `user` când lipsește sau este gol.

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

`on(event, listener)` returnează o funcție care elimină ascultătorul.

### seed {#seed}

Scrie primul instantaneu al camerei din documentul editorului și returnează `true`.  
Dacă primește `value`, textul unui document în orice formă citită de [setInitialValue](../erd-editor-element.md#setinitialvalue), îl încarcă mai întâi în editor.  
Apoi renunță, fără a le înregistra, la tragerile, redimensionările și schimbările de culoare pe care editorul încă le ține în așteptare, astfel încât niciuna să nu ajungă în cameră după instantaneu. Fără `value`, instantaneul le arată deja, deoarece preia documentul editorului; cu `value`, ele aparțineau documentului pe care `value` l-a înlocuit.  
Apoi scrie instantaneul descris în [Ce conține camera](#what-the-room-holds).  
Odată ce camera conține un instantaneu, returnează `false` și nu scrie nimic, fără a încărca `value`, astfel încât fiecare client îl poate apela după legare. Returnează `false` și după ce legătura a fost distrusă sau oprită, precum și pentru o legătură [refuzată](#onerror) la legare.

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

Legătura a redeschis editorul pe instantaneul camerei, așa cum face [reseed](./collaborative-editing.md#reseed); [Editări offline și realăturări](#offline-edits-and-rejoins) spune ce păstrează și ce pierde.  
`reason` indică motivul:

- `'snapshot'`: instantaneul conține editări pe care legătura nu le aplicase, fie pentru că lipsea cât timp un compactor le-a restrâns, fie pentru că un compactor a repus, într-o restrângere proprie, ce restrânsese într-un instantaneu pe care l-a înlocuit cel al altui compactor (consultați [Un singur compactor pe cameră](#one-compactor-per-room)). Este motivul și când instantaneul este primul care ajunge la o legătură a unei camere goale, și când aparține altei inițializări, iar această legătură se alăturase unei inițializări pe care nu o scrisese.
- `'seedLost'`: inițializarea altui client a câștigat în fața celei scrise de această legătură.

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

Legătura a refuzat să se lege, s-a oprit sau a respins o opțiune. Fiecare mesaj începe cu `erd-editor-yjs: `.

La legare, nu leagă nimic când:

- editorul sau store-ul partener este deja legat de acest `Y.Doc`;
- `@dineug/erd-editor` al său a fost construit înainte de `5.1.0`; legătura distruge store-ul partajat pe care l-a luat de la un element;
- store-ul partener a fost distrus înainte de a fi legat;
- camera conține un instantaneu într-o structură pe care această versiune nu o citește (consultați [Ce conține camera](#what-the-room-holds)).

O astfel de legătură emite `error` într-un microtask, astfel încât un ascultător adăugat imediat după apel îl aude, iar niciun `rejoin` nu se emite vreodată pe ea.

Mai târziu, legătura se oprește când:

- instantaneul camerei trece la o structură pe care această versiune nu o citește. Fiecare legătură din această versiune se oprește, fiecare editor păstrează ce aplicase, iar nimic editat după aceea nu se scrie;
- store-ul său partener a fost distrus sub ea, lucru constatat data viitoare când camera se schimbă sau când se apelează `seed()` ori `compact()`.

O legătură care se oprește eliberează store-ul partajat pe care l-a luat și perechea formată din store-ul și `Y.Doc` ale ei, așa cum face [destroy](#destroy), și își păstrează ascultătorii.

Doar pentru `bindPeerStore`, acestea emit `error`, iar legătura continuă:

- `compactAfter` nu este un număr întreg pozitiv: legătura restrânge doar când i se cere;
- `electionGraceMs` sau `retainMs` nu este un număr între 0 și 2.147.483.647 ms: se folosește în schimb valoarea sa implicită, deoarece un temporizator dincolo de acest interval se declanșează imediat;
- `synced` este respins: legătura nu restrânge niciodată și lasă alegerea în seama celorlalte compactoare (consultați [Un singur compactor pe cameră](#one-compactor-per-room)).

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

Trimite în cameră tragerile, redimensionările și schimbările de culoare pe care editorul încă le ține în așteptare, setează pe `null` câmpul Awareness `erd` al legăturii, astfel încât ceilalți să renunțe imediat la cursorul, focusul și selecția ei, și încetează să mai observe `Y.Doc` și Awareness.  
Pentru un element, distruge și store-ul partajat pe care l-a luat, lăsând elementul și documentul său așa cum sunt.  
Un al doilea apel nu face nimic. După aceea, ce editează editorul nu ajunge la nimeni.

Store-ul partener, `Y.Doc` și furnizorul rămân în grija dumneavoastră, iar distrugerea lor vine după cea a legăturii: un store partener distrus primul nu trimite niciodată tragerile pe care încă le ținea.  
Metoda [destroy](../erd-editor-element.md#destroy) a elementului distruge fiecare store partajat pe care l-a oferit, inclusiv pe cel al legăturii, și renunță la ce țineau acestea în așteptare, deci distrugeți mai întâi legătura.  
Distrugeți o legătură înainte de a lega din nou același editor sau același store partener de același `Y.Doc`; una care s-a oprit cu `error` a eliberat deja totul.

```js
binding.destroy();
editor.destroy();
```

## Prezență {#presence}

Cu [awareness](#awareness), cursorul editorului, tabelul sau celula pe care se află focusul, selecția și caseta de selecție circulă în câmpul `erd` al stării sale Awareness locale, niciodată în `Y.Doc`, deci nu intră niciodată în istoricul camerei, în instantaneul ei sau într-un `Y.Doc` persistat.  
Ceilalți le desenează așa cum desenează prezența unui colaborator (consultați [focusTracker](./collaborative-editing.md#focustracker)), iar un client care se alătură desenează prezența pe care o arată deja camera.  
Elementul își retrimite focusul și selecția la fiecare 30 de secunde și caseta de selecție în fiecare secundă. Fiecare dintre aceste retrimiteri ajunge la ceilalți chiar și când repetă ultima, astfel încât ce ține un utilizator să nu expire niciodată.

Un client care pleacă este uitat imediat.  
Când Awareness renunță la starea lui sau când câmpul său `erd` devine `null`, așa cum îl setează [destroy](#destroy), ori indică un alt editor, legătura elimină de pe element cursorul, focusul, selecția și caseta de selecție ale acelui editor cu [forgetPeer](./collaborative-editing.md#forgetpeer), în loc să aștepte să expire.  
Le păstrează cât timp un alt client arată același editor, cum face un element legat din nou de un alt `Y.Doc` al camerei.

## Editări offline și realăturări {#offline-edits-and-rejoins}

Un client deconectat de la furnizor continuă să editeze. Editările sale așteaptă în `Y.Doc` local, nu în store-ul partajat, și ajung la ceilalți când furnizorul se reconectează și se sincronizează.

Când un compactor a restrâns editări pe care clientul nu le aplicase cât timp lipsea, instantaneul le conține, deci la reconectare clientul se redeschide pe instantaneu cu `rejoin('snapshot')`, după ce a trimis tragerile, redimensionările și schimbările de culoare pe care editorul său încă le ținea în așteptare. O restrângere doar a ceea ce clientul aplicase nu redeschide nimic.  
O realăturare pe un instantaneu al inițializării la care s-a alăturat legătura reia fiecare editare pe care instantaneul nu o conține, inclusiv pe cele proprii ale acestui client făcute cât timp lipsea, așa că niciuna nu se pierde. O realăturare pe o altă inițializare nu păstrează nimic, așa cum descrie [Inițializarea unei camere](#seeding-a-room).

Fiecare realăturare șterge istoricul anulărilor, selecția și focusul și închide o vizualizare [Flux](../../guide/guides/visualization.md#flow-mode) deschisă, o [trasare de relație](../../guide/guides/editing-start.md#relationship-creation) și un editor de notă, de nume de grup de tabele sau de celulă, deoarece acestea pot indica ceva ce instantaneul nu mai conține.  
Un nume de grup de tabele tastat și încă neconfirmat se pierde. O celulă de nume logic care se închide derivă numele fizic dintr-un nume logic tastat de cititorul ei, acolo unde documentul redeschis îl mai conține, așa cum face orice închidere a acelei celule. Această derivare este o editare obișnuită: camera o înregistrează, creează o intrare de anulare și emite `change` (consultați [reseed](./collaborative-editing.md#reseed)).  
O legătură care se alăturase camerei păstrează ce vede cititorul ei: poziția de derulare, nivelul de zoom și fila, precum și setările pe care le-a schimbat un cititor doar în citire.  
Păstrează și modul de afișare a numelor și setările de cod (limbajul generatorului de cod, stilurile de denumire și tipul de delimitator) pe care cititorul le afișa pe cont propriu, atât timp cât [blocarea](../../guide/guides/settings.md#lock) fiecăreia era activată înainte de realăturare și este încă activată după ea, la aceeași valoare blocată.  
Nimic din ce păstrează nu ajunge în `value`, care raportează setările documentului redeschis (consultați [reseed](./collaborative-editing.md#reseed) cu `keepScreen`).  
Poziția de derulare și nivelul de zoom ale unui element neafișat de la ultima sa încărcare, precum și întregul ecran al unei legături care nu se alăturase încă, se deschid acolo unde le pune instantaneul.  
Un store partener nu are ecran, deci realăturarea lui nu păstrează niciunul.

## Editoare doar în citire {#read-only-editors}

Un element [doar în citire](../erd-editor-element.md#readonly) legat de o cameră nu scrie nimic în istoricul camerei: store-ul său partajat nu trimite nicio schimbare, ci doar trackerele sale și handshake-ul registrelor, iar camera [nu le înregistrează](#what-the-room-holds) pe niciunul.  
Aplică în continuare fiecare editare pe care o transportă camera, iar cu [awareness](#awareness) cursorul, focusul, selecția și caseta de selecție ale cititorului său ajung în continuare la ceilalți.  
Setările pe care le schimbă cititorul rămân pe ecranul lui, ca la orice editor doar în citire.  
[seed](#seed) nu este refuzat: un element doar în citire inițializează o cameră goală cu documentul pe care îl conține sau cu `value`, când este dat.

## Ce conține camera {#what-the-room-holds}

Legătura păstrează diagrama sub două nume ale `Y.Doc`: `erd:snapshot`, o hartă care conține un instantaneu al documentului, și `erd:log`, un tablou cu loturile de acțiuni ale editorului de după el. Un furnizor de persistență le stochează pe ambele odată cu restul `Y.Doc`.

Instantaneul conține [runtimeValue](../erd-editor-element.md#runtimevalue) al documentului, inclusiv entitățile eliminate, registrele de colaborare și marcajul lui de versiune, precum și cât din editările fiecărui autor este restrâns în el. O inițializare îl scrie, la fel și fiecare restrângere a unui compactor.  
O inițializare sau o restrângere făcută cu pachetul `@dineug/erd-editor` anterior versiunii `5.1.1` scrie un instantaneu fără nicio notă într-un grup de tabele (consultați [Combinarea versiunilor](./collaborative-editing.md#mixing-releases)).  
Fiecare intrare din jurnal este un lot așa cum l-a trimis editorul, cu meta inclus, care poartă id-ul de editor și pseudonimul expeditorului.  
Derulările, zoom-urile, comutările de filă, prezența și handshake-ul registrelor nu sunt niciodată înregistrate. Orice altă schimbare pe care o trimite editorul este înregistrată, inclusiv o schimbare a modului de afișare a numelor făcută sub [blocarea](../../guide/guides/settings.md#lock) sa, schimbare pe care o elimină toți ceilalți clienți.  
Un limbaj al generatorului de cod, un stil de denumire sau un tip de delimitator schimbat sub blocarea sa nu este trimis niciodată, deci rămâne pe ecranul acelui editor și nu ajunge niciodată în cameră.

Un `Y.Doc` returnat de un furnizor de persistență deschide diagrama pe care o conține, așa cum o legătură deschide orice `Y.Doc` care conține un instantaneu (consultați [Utilizare](#usage)).

Instantaneul nu este un fișier: valoarea lui de execuție conține entități eliminate, pe care un fișier nu trebuie să le conțină.  
Pentru a scrie diagrama camerei în stocare, salvați [value](../erd-editor-element.md#value) al unui element legat ori de câte ori se declanșează evenimentul său [change](../erd-editor-element.md#change).  
Salvați-l și o dată după legare, după un [seed](#seed) căruia i s-a dat `value` și într-un ascultător [rejoin](#onrejoin), deoarece niciuna dintre aceste încărcări nu emite `change`.  
Un element [doar în citire](../erd-editor-element.md#readonly) nu emite niciodată `change`, deci salvați de la unul care nu este doar în citire sau citiți `value` de la un store partener legat, care aplică editările camerei pe măsură ce sosesc.  
Un [replicationStore](./remote-storage.md) nu poate fi legat, deoarece îi lipsesc metodele de care are nevoie o legătură, iar unul alimentat de la store-ul partajat al unui element legat pierde editările camerei (consultați [Replicarea unui editor în funcțiune](./remote-storage.md#replicating-a-live-editor)).

Structura este privată și se poate schimba odată cu [ERD_YJS_FORMAT](#exports).  
Citiți o cameră doar printr-o legătură și lăsați numele `erd:` și câmpul Awareness `erd` în seama ei.

## Compactarea unei camere {#compacting-a-room}

Istoricul camerei crește cu fiecare editare, iar fiecare client care se alătură îl reia în întregime, până când ceva îl restrânge.  
`bindPeerStore` leagă un store partener fără interfață din `@dineug/erd-editor/peer.js` și returnează un `ErdYjsPeerBinding`: aceleași [seed](#seed), [on](#erdyjsbinding) și [destroy](#destroy), plus [compact](#compact).  
Un store partener legat într-un proces Node de lângă server, un proces auxiliar (sidecar), restrânge istoricul într-un instantaneu al propriei diagrame.  
Legătura unui element nu restrânge niciodată, iar un store partener legat fără `compactAfter` și fără apel `compact()` este un partener fără interfață obișnuit.

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

Store-ul partener rămâne al dumneavoastră: legătura nu îl distruge niciodată. Pseudonimul său este cel dat lui `createPeerStore`, iar `presence: false` îl împiedică să trimită un focus propriu.

O restrângere scrie instantaneul din valoarea de execuție, registrele și marcajul de versiune proprii ale store-ului partener și șterge intrările de jurnal pe care le acoperă, precum și fiecare intrare a altei inițializări, toate într-o singură tranzacție.  
Clienții care au aplicat totul văd intrările dispărând; un client care nu le aplicase se redeschide pe instantaneu (consultați [Editări offline și realăturări](#offline-edits-and-rejoins)).  
Fiecare restrângere rescrie întreaga diagramă în instantaneu, deci fiecare trimite fiecărui client o actualizare de mărimea JSON-ului de execuție al diagramei și a registrelor luate împreună, oricât de puține intrări ar cuprinde. Setați `compactAfter` suficient de mare încât intrările pe care le cuprinde o restrângere să cântărească mai mult decât o copie a diagramei.

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

| Opțiune | Implicit | Descriere |
| --- | --- | --- |
| `awareness` | Niciuna | Arată store-ul partener în Awareness al camerei, așa cum face [awareness](#awareness) cu un element. Un compactor care restrânge singur este marcat acolo, astfel încât compactoarele care se văd între ele aleg unul care să restrângă, iar unul care nu vede niciun alt client nu restrânge nimic singur (consultați [Un singur compactor pe cameră](#one-compactor-per-room)). Fără ea, un compactor restrânge singur, fără alegere și fără perioadă de grație. |
| `compactAfter` | Niciuna | Restrânge singur odată ce jurnalul conține acest număr de intrări pe care le-ar cuprinde o restrângere. Fără ea, sau fără `synced`, restrânge doar `compact()`, precum și restrângerea care repune (consultați [Un singur compactor pe cameră](#one-compactor-per-room)). |
| `synced` | Niciuna | O promisiune care se rezolvă odată ce furnizorul s-a sincronizat. Nicio restrângere nu are loc înainte de aceasta, nici `compact()`. Fără ea, nimic nu se restrânge singur, iar `compact()` restrânge imediat. |
| `electionGraceMs` | `3000` | Cu `awareness`, cât timp urmărește compactorul camera înainte de a restrânge singur, după `synced` și din nou ori de câte ori apar alți clienți după ce nu era niciunul. |
| `retainMs` | `600000` (zece minute) | Cât timp rămân intrările unei restrângeri păstrate pentru a fi repuse (consultați [Un singur compactor pe cameră](#one-compactor-per-room)), numărat de la prima actualizare pe care o trimite camera după restrângere. |

O opțiune nevalidă sau un `synced` care este respins emite [error](#onerror).

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

Restrânge imediat, fără alegere, perioadă de grație sau prag.  
Mai întâi preia instantaneul curent al camerei, inclusiv o realăturare, și trimite ce mai ține în așteptare store-ul său partener.  
Răspunde `{ compacted: true, generation }`, unde `generation` numără restrângerile instantaneului: `0` pentru o inițializare, cu unu mai mult la fiecare restrângere.  
Altfel răspunde `{ compacted: false, reason }`:

- `'destroyed'` după ce legătura a fost distrusă sau oprită, precum și pentru o legătură [refuzată](#onerror) la legare, chiar înainte ca `synced` să se rezolve;
- `'not-synced'` înainte ca `synced` să se rezolve;
- `'no-snapshot'` într-o cameră pe care niciun client nu a inițializat-o.

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## Un singur compactor pe cameră {#one-compactor-per-room}

Rulați exact un compactor pe cameră și porniți unul nou doar după ce cel vechi s-a oprit. Nimic nu impune acest lucru.  
Dintre compactoarele care se văd între ele în Awareness, doar cel cu cel mai mic id de client Yjs restrânge singur, iar când acesta pleacă, sau `synced` al lui este respins, următorul preia imediat.  
Un compactor al cărui Awareness nu arată niciun alt client, ca atunci când propriul socket se închide și îi pierde pe toți, nu restrânge nimic singur până când apar din nou alții și el a urmărit camera timp de `electionGraceMs`.

Două compactoare izolate unul de celălalt, sau o repornire al cărei predecesor încă rulează, pot totuși restrânge fiecare.  
Camera păstrează atunci unul dintre cele două instantanee, iar compactorul al cărui instantaneu a pierdut repune ce a restrâns și câștigătorul nu conține, atât timp cât păstrează acele intrări: `retainMs`, și cel mult ultimele sale 1.000 de intrări, oricât de mare ar fi fiecare.  
Deci nu se pierde nimic când compactorul al cărui instantaneu pierde este cel care se reconectează, atât timp cât a restrâns cel mult 1.000 de intrări cât au fost izolate.  
Când este cel care a rămas online, iar păstrarea lui a expirat, instantaneul și istoricul camerei nu conțin ce a restrâns el până când restrânge din nou. Un client care a ratat acele editări, sau unul care se alătură între timp, nu le are și ține în așteptare editările ulterioare ale fiecărui autor ale cărui editări le restrânsese compactorul. Următoarea restrângere a compactorului le readuce pe toate, cu excepția cazului în care instantaneul câștigător conținea editări pe care compactorul nu le avea, ceea ce îl redeschide pe acel instantaneu și pierde definitiv ce restrânsese.

Un compactor repune într-o restrângere proprie, făcută după ce a ajuns din urmă instantaneul câștigător, fără alegere, perioadă de grație sau prag, iar fiecare client se redeschide pe acea restrângere cu `rejoin('snapshot')`.  
Editările pe care le repune nu ajung la niciun client în afara acelei restrângeri, deci un client online tot timpul ajunge la fel ca ceilalți și ca unul care se alătură mai târziu, chiar și când o editare ulterioară a unui alt autor se sprijină pe una dintre ele, de exemplu redenumirea unui tabel adăugat de alt client.  
Fiecare repunere costă fiecare client acea realăturare, împreună cu [ce pierde o realăturare](#offline-edits-and-rejoins). Când două compactoare repun în același timp, fiecare client tot ajunge la fel, deși o editare poate rămâne aplicată înaintea celei pe care se sprijină.  
O legătură distrusă sau oprită înainte ca acea restrângere să ruleze, ca atunci când un ascultător `rejoin` o distruge, repune editările separat. Nu se pierde nimic, dar atunci un client online tot timpul poate aplica una după editarea unui alt autor care se sprijină pe ea și poate ajunge diferit de unul care se alătură mai târziu.

## Limite {#limits}

- **Viewportul rămâne pe fiecare ecran.** Derulările, zoom-urile și comutările de filă nu sunt [niciodată înregistrate](#what-the-room-holds), deși o sesiune conectată prin `getSharedStore` le trimite (nici acolo nu mută vizualizarea sau fila altui utilizator). Fiecare cititor îl păstrează pe al său, iar legătura îl arată doar în starea sa Awareness, pe care deocamdată nu o citește nimic. Cu [blocarea](../../guide/guides/settings.md#lock) `Viewport` sau `Canvas Type` dezactivată, `value` al fiecărui client îl salvează pe al său; sub blocări, pe care un document nou le are activate, fiecare client salvează valoarea blocată.
- **Instantaneul crește cu o intrare pe legătură.** Păstrează, pentru fiecare legătură care a scris vreodată în cameră, cât din editările ei este restrâns și nu renunță niciodată la vreuna. O legătură făcută din nou, sau una care a trecut la o altă inițializare, se numără din nou, la fel și fiecare restrângere care repune. O intrare este un id de 32 de caractere și un număr, deci zece mii de sesiuni de scriere adaugă câteva sute de kiloocteți la fiecare instantaneu și la fiecare restrângere.
- **Un hub și o cameră nu retransmit nimic între ele.** Un element legat de o cameră și de [hubul](../../mcp/live-and-headless.md#live) unui agent de programare, sau de orice alt mecanism de transport prin `getSharedStore()`, aplică editările ambelor, dar niciunul nu le aude pe ale celuilalt, deoarece un store partajat nu retransmite ce a primit.
- **Adăugările făcute în același moment pot fi listate în ordini diferite.** Tabelele sau notele adăugate de doi clienți în același moment pot sta în altă ordine în diagrama fiecărui client, ca într-o sesiune conectată prin `getSharedStore` (consultați [Editări simultane](./collaborative-editing.md#concurrent-edits)).
- **Culorile și câteva alte schimbări făcute în același moment pot ajunge la valori diferite.** O schimbare de culoare este înregistrată fără marcaj de versiune, iar fiecare client o marchează cu propriul marcaj când o aplică. Două recolorări ale aceluiași tabel, ale aceleiași note sau ale aceluiași grup de tabele făcute în același moment pot lăsa deci clienții, și un client care se alătură mai târziu și reia jurnalul, cu culori diferite. La fel pot face și celelalte schimbări pe care fiecare client le aplică în ordinea în care le aude, de exemplu două mutări de coloane în cadrul aceluiași tabel sau index, ori două schimbări ale bazei de date (consultați [Editări simultane](./collaborative-editing.md#concurrent-edits)).
- **Un cursor care pleacă așteaptă serverul.** Legătura șterge cursorul unui partener imediat ce Awareness renunță la el. Un server care, la închiderea unui socket, elimină doar stările Awareness pe care acel socket le-a adăugat primul păstrează pe ecranele celorlalți un client care se reconectase, după ce pleacă, până când starea lui expiră în Awareness, 30 de secunde mai târziu. Unul care elimină fiecare stare pe care un socket a scris-o ultima oară, o actualizare la fel ca o adăugare, îl șterge imediat.

## Exporturi {#exports}

| Export | Descriere |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | Leagă un element `<erd-editor>` (consultați [Utilizare](#usage)). Returnează un [ErdYjsBinding](#erdyjsbinding). |
| `bindPeerStore(peer, doc, options?)` | Leagă un store partener din `@dineug/erd-editor/peer.js` (consultați [Compactarea unei camere](#compacting-a-room)). Returnează același lucru, plus [compact](#compact) (`ErdYjsPeerBinding`). |
| `ERD_YJS_FORMAT` | Structura `Y.Doc` pe care o scrie această versiune, `1`; o legătură refuză o cameră scrisă în alta. |

Tipuri: `BindOptions`, `PeerBindOptions`, `CompactOptions`, `CompactResult`, `BindingEvents`, `RejoinReason`, `ErdYjsBinding`, `ErdYjsPeerBinding`.
