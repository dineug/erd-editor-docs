---
sidebar_position: 2
description: Replicați un editor în funcțiune într-un store fără interfață, în afara firului principal, și serializați documentul pentru stocare.
---

# Stocare la distanță

Trimiterea întregii stări a editorului la fiecare modificare este ineficientă.  
Pentru acest caz, editorul oferă un API pentru replicarea datelor în timp real.

## Instalare {#installation}

```sh
npm install @dineug/erd-editor
```

Store-ul de replicare se află la subcalea `@dineug/erd-editor/engine.js`, nu la rădăcina pachetului.  
Acest punct de intrare nu accesează DOM-ul, așa că rulează într-un Web Worker sau oriunde altundeva în afara firului principal.  
Importarea rădăcinii pachetului înregistrează în schimb elementul personalizat `<erd-editor>`, care are nevoie de un document.

## Utilizare {#usage}

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

## Replicarea unui editor în funcțiune {#replicating-a-live-editor}

Acțiunile provin din store-ul partajat al unui editor în funcțiune.  
Consultați [Editare colaborativă](./collaborative-editing.md).

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

Doar modificarea traversează granița, niciodată întregul document.  
Replica o aplică și serializează rezultatul de partea sa.  
Evenimentul `change` vă transmite acest rezultat ca `value`, iar `changed` vă spune când merită să-l scrieți.

Începând cu versiunea `4.0.0`, inițializați replica din proprietatea `runtimeValue` a editorului, ca mai sus, nu din fișierul stocat sau din proprietatea `value` a editorului.  
Fișierului îi lipsesc editările făcute de la salvare, iar proprietății `value` îi lipsesc entitățile eliminate în sesiune.  
Când un editor anulează eliminarea, o replică inițializată fără un tabel eliminat îl readuce fără nume și fără coloane și îl salvează așa.  
Începând cu versiunea `4.2.0`, același lucru este valabil pentru un cuvânt, un termen sau un domeniu eliminat dintr-o foaie a filei [Dicționar](../../guide/guides/dictionary.md).  
Când un editor anulează eliminarea, o replică inițializată fără rândul respectiv îl listează din nou gol, iar, deoarece `value` omite un rând gol, replica salvează documentul fără el.  
În cazul unui domeniu, coloanele și termenii legați de el rămân, de asemenea, fără această legătură în acea replică, deoarece replica nu a deținut niciodată legăturile, iar anularea nu le trimite.

## InjectEngineContext {#injectenginecontext}

### toWidth {#towidth}

Măsoară un șir de caractere în pixeli.  
Store-ul nu are DOM, deci nu poate măsura singur textul, și recalculează lățimile coloanelor cu această funcție de fiecare dată când se modifică un nume, un tip de date, o valoare implicită sau un comentariu.  
Începând cu versiunea `4.2.0`, aici intră și [numele logic](../../guide/guides/logical-names.md) al unui tabel sau al unei coloane.  
Măsoară celula Domeniu a unei coloane, care afișează numele domeniului de care este legată coloana, ori de câte ori coloana este legată de un domeniu sau i se elimină legătura cu acesta și ori de câte ori acel domeniu este adăugat, redenumit sau eliminat.  
De asemenea, măsoară din nou fiecare tabel și fiecare coloană ori de câte ori metoda [setInitialValue](#setinitialvalue) încarcă un document.  
Începând cu versiunea `4.0.0`, lățimile sunt păstrate doar în [runtimeValue](#runtimevalue-getter), niciodată în `value`.  
Astfel, un document salvat de această versiune, citit din nou, produce octet cu octet aceeași valoare pentru `value`, oriunde ar fi fost salvat și oricum s-ar fi măsurat textul acolo.

Măsurați așa cum măsoară editorul: `400 12px` în lista de fonturi a editorului, cu rotunjire, plus o spațiere interioară de 2 px.  
Altfel, lățimile din `runtimeValue` se abat de la cele de pe ecran.

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

Expresia `text.length * 10` este varianta de rezervă atunci când nu este disponibil niciun canvas.  
Este suficientă pentru un store al cărui document este doar stocat, niciodată redat.

## ReplicationStore {#replicationstore}

### value getter {#value-getter}

Serializează starea curentă a editorului.  
Returnează un șir de caractere JSON, gata de stocat ca atare – nu un obiect parsat.

```js
const data = replicationStore.value;
```

Începând cu versiunea `4.0.0`, proprietatea `value` este forma de stocare: documentul așa cum îl conține un fișier, același text pe care îl returnează proprietatea [value](../erd-editor-element.md#value) a elementului.  
Conține doar entitățile existente, într-o ordine fixă, fără cele eliminate, fără ordinea de suprapunere și fără nimic din ce o încărcare recalculează, de exemplu lățimile pe care le măsoară funcția [toWidth](#towidth).  
Începând cu versiunea `4.2.0`, conține și numele logice, informația dacă fiecare nume a fost derivat din dicționare, legăturile cu domeniile, precum și cuvintele, termenii și domeniile din fila [Dicționar](../../guide/guides/dictionary.md).  
Tot începând cu versiunea `4.2.0`, omite fiecare câmp de text gol al unei entități, fiecare listă `doc` și fiecare colecție care nu conține nimic, precum și obiectul `collections` însuși când toate colecțiile sunt goale.  
Textul are o indentare de două spații, cu fiecare rând al dicționarelor pe o linie separată, și se termină cu un caracter de linie nouă, astfel încât același document produce mereu aceiași octeți.  
Consultați [Forma de stocare și valoarea de execuție](./schema.md#storage-form-and-runtime-value) pentru a vedea ce conține.

Fiecare setare a cărei [blocare](../../guide/guides/settings.md#lock) este activată se scrie cu valoarea la care a fost blocată, iar orice altă setare, așa cum este în acel moment.  
Blocarea `Viewport` acoperă împreună originea vizualizării și nivelul de zoom, iar fila, limbajul generatorului de cod, ambele stiluri de denumire și tipul de delimitator au fiecare propria blocare.  
Începând cu versiunea `4.2.0`, are una și [modul de afișare a numelor](../../guide/guides/logical-names.md#name-view), a cărui blocare `Name View` este activată într-un document nou.  
Blocările înlocuiesc câmpul `ignoreSaveSettings` al documentului, care nu mai este nici citit, nici scris începând cu versiunea `4.0.0`.  
Înainte de versiunea `4.0.0`, proprietatea `value` era întregul document așa cum îl păstra store-ul, cu biții de derulare și de zoom ai acelui câmp aplicați.

### runtimeValue getter {#runtimevalue-getter}

Începând cu versiunea `4.0.0`, serializează documentul așa cum îl păstrează replica, inclusiv entitățile eliminate și tot ce recalculează o încărcare.  
Și aici, fiecare setare blocată se scrie cu valoarea sa blocată.

```js
const snapshot = replicationStore.runtimeValue;
```

Folosiți valoarea de execuție pentru a inițializa un editor sau un alt store care se alătură mai târziu, prin metoda `setInitialValue` a acestuia; consultați [Editare colaborativă](./collaborative-editing.md).  
Nu o stocați niciodată ca fișier: conține entitățile eliminate, iar [JSON Schema](./schema.md#json-schema) publicată o respinge.  
Datorită acestor entități eliminate, o anulare a unei eliminări, trimisă ulterior, readuce entitatea întreagă în store-ul inițializat din această valoare.  
Ele rămân până la următoarea deschidere a documentului din fișierul său, a cărui formă le omite.

### setInitialValue {#setinitialvalue}

Încarcă starea editorului stocată anterior.

```js
replicationStore.setInitialValue('json...');
```

Acceptă forma de stocare, o valoare de execuție sau un document salvat de o versiune anterioară, inclusiv un document v2.  
Un șir de caractere gol sau orice altceva decât un șir de caractere încarcă un document nou și gol, în loc să genereze o eroare.  
Un store care nu a primit niciodată o valoare pornește cu același document nou.  
Începând cu versiunea `4.0.0`, acest document are toate [blocările](../../guide/guides/settings.md#lock) activate, așa că proprietatea sa `value` păstrează vizualizarea, fila, limbajul generatorului de cod, stilurile de denumire și tipul de delimitator cu care a pornit, în timp ce editoarele pe care le replică derulează, modifică zoomul, comută filele sau schimbă acele setări. În versiunea `3.10.0`, nu salva nici derularea, nici zoomul, iar înainte de aceasta le salva pe amândouă.  
Începând cu versiunea `4.2.0`, păstrează și modul său de afișare a numelor, `Physical Names`, în timp ce editoarele îl schimbă pe al lor.  
Un document stocat păstrează blocările pe care le specifică.  
Unul care nu specifică niciuna, adică orice document salvat înainte de versiunea `4.0.0`, inclusiv un document v2, se încarcă cu toate blocările activate: originea vizualizării la `0, 0`, nivelul de zoom la `1` și fila la ERD, indiferent ce a salvat, iar limbajul generatorului de cod, stilurile de denumire și tipul de delimitator așa cum le-a salvat.  
Un document salvat înainte de versiunea `4.2.0` nu specifică blocarea `Name View`, așa că se încarcă cu această blocare activată și în modul `Physical Names`, chiar și unul salvat cu toate celelalte blocări dezactivate.  
Începând cu versiunea `4.0.0`, metoda `setInitialValue` elimină și registrele de colaborare păstrate pentru documentul anterior, la fel ca metoda [setInitialValue](../erd-editor-element.md#setinitialvalue) a elementului.  
Un text care nu este JSON, de exemplu un fișier rămas cu marcaje de conflict de îmbinare, nu generează nici el o eroare: eroarea de parsare este doar înregistrată în consolă, documentul este golit, iar setările rămân cum erau.

Începând cu versiunea `4.0.0`, încărcarea nu rulează colectarea gunoiului, așa că entitățile eliminate rămân în [runtimeValue](#runtimevalue-getter).  
Înainte, elimina entitățile care nu mai apăreau în `doc` și nu fuseseră modificate de patru zile sau mai mult.

Rescrierile făcute de încărcare se încheie înainte ca metoda `setInitialValue` să returneze: marcajele de cheie de pe coloane, deduse din opțiunile fiecărei coloane și din relații; lățimea fiecărui tabel și a fiecărei coloane, măsurată din nou cu `toWidth`; punctele în care fiecare conector își întâlnește tabelele; și indicatorul de relație identificatoare al fiecărei relații și simbolul de la capătul ei dinspre tabelul părinte.  
Niciuna dintre ele nu face parte din `value`, dar valoarea `replicationStore.runtimeValue` citită imediat după apel le conține deja pe toate.  
O acțiune care sosește imediat după încărcare, de exemplu o derulare reluată, este comparată cu documentul încărcat, așa că încărcarea însăși nu este niciodată raportată ca [`changed`](#onchange).

Nici încărcarea, nici vreuna dintre aceste rescrieri nu emite evenimentul `change`.  
Citiți dumneavoastră `replicationStore.value` după ce metoda `setInitialValue` returnează, dacă doriți ca documentul încărcat să fie scris înapoi în forma de stocare.

### on@change {#onchange}

Se abonează la modificările stării editorului.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

Evenimentul `change` este amânat (debounce) cu 200 ms, așa că o rafală de acțiuni ajunge ca o singură notificare.  
Se declanșează doar pentru acțiuni de un tip care poate modifica documentul, plus acțiunea `settings.changeIgnoreSaveSettings` pe care un editor mai vechi o poate trimite în continuare (consultați [dispatch, dispatchSync](#dispatch-dispatchsync)).  
O acțiune de prezență retransmisă sau acțiunea `editor.mergeLWW` nu îl declanșează niciodată.  
Apelați funcția returnată pentru a vă dezabona.

Începând cu versiunea `3.10.0`, ascultătorul primește un obiect de tipul `ReplicationChange`, tip pe care subcalea `@dineug/erd-editor/engine.js` îl exportă alături de `ReplicationStore`.  
Înainte de versiunea `3.10.0`, nu primea nimic, iar un ascultător care ignoră argumentul funcționează în continuare.  
Proprietatea `value` este documentul serializat în forma de stocare, același șir pe care îl returnează `replicationStore.value` în acel moment, deci nu este nevoie să-l serializați din nou.  
Proprietatea `changed` este `false` când acțiunile de la evenimentul `change` anterior sau de la încărcare au lăsat `value` octet cu octet așa cum era.

O modificare pe care o [blocare](../../guide/guides/settings.md#lock) o lasă în afara proprietății `value` declanșează totuși evenimentul `change`, cu `changed` setat la `false`, așa că scrieți doar când `changed` este `true`.  
Este vorba de o derulare sau un zoom cât timp setarea `Viewport` este blocată, de o comutare de filă cât timp setarea `Canvas Type` este blocată și de o modificare a limbajului generatorului de cod, a unui stil de denumire sau a tipului de delimitator cât timp propria sa blocare este activată.  
Începând cu versiunea `4.2.0`, la fel este și o schimbare a modului de afișare a numelor cât timp setarea `Name View` este blocată: editorul o trimite în continuare, dar replica o elimină, la fel ca celelalte editoare.  
O schimbare a modului de afișare făcută într-un editor doar în citire este eliminată la fel, indiferent dacă setarea `Name View` este blocată sau nu.  
Evenimentul [change](../erd-editor-element.md#change) al elementului omite o astfel de modificare, dar replica o raportează totuși.  
Toate blocările sunt activate într-un document nou și într-unul salvat înainte de versiunea `4.0.0`, iar setarea `Name View` este blocată în orice document salvat înainte de versiunea `4.2.0`.  
Cu setarea `Viewport` deblocată, o derulare sau un zoom modifică `value`, cu setarea `Canvas Type` deblocată, la fel face și deschiderea unei alte file a editorului, iar cu setarea `Name View` deblocată, la fel face și o schimbare a modului de afișare a numelor venită de la un editor care nu este doar în citire.  
Blocarea sau deblocarea unei setări modifică de asemenea `value`.

Începând cu versiunea `4.0.0`, proprietatea `changed` compară forma de stocare, care nu conține nici entitățile eliminate, nici ordinea de suprapunere.  
Astfel, un tabel adăugat și eliminat din nou în cadrul aceluiași eveniment `change`, o editare care ajunge la o entitate pe care alt colaborator a eliminat-o și o încărcare retransmisă care schimbă doar ordinea de suprapunere se soldează toate, de asemenea, cu `changed` setat la `false`.  
Începând cu versiunea `4.2.0`, la fel se întâmplă cu un rând adăugat într-o foaie a filei Dicționar și lăsat gol, deoarece forma de stocare omite un rând care nu conține nimic.

Proprietatea `changed` nu face niciodată comparația cu fișierul dumneavoastră stocat, care poate diferi deja de `value` imediat ce se încarcă: așa se întâmplă cu un fișier salvat de o versiune anterioară, inclusiv un fișier v2, precum și cu un fișier care începe cu un marcaj de ordine a octeților și cu unul editat manual.  
Începând cu versiunea `4.2.0`, aici intră și un fișier salvat de versiunea `4.0.0` sau `4.1.0`, deoarece `value` omite câmpurile de text goale ale entităților sale, precum și listele `doc` și colecțiile goale pe care le conține un astfel de fișier.  
O comparare a octeților cu un astfel de fișier ar considera editare chiar și o derulare pe care o blocare o omite.  
Primul eveniment `change` cu `changed` setat la `true` vă returnează un astfel de fișier în forma de stocare, așa că scrierea lui rescrie fișierul o singură dată.  
Un fișier salvat de această versiune nu diferă, oriunde ar fi fost salvat, așa cum explică secțiunea [toWidth](#towidth).  
Dacă apelul `setInitialValue` intervine cât timp un eveniment `change` este încă în așteptare și nimic nu este trimis înainte de momentul acestuia, acel eveniment `change` sosește totuși, cu proprietatea `value` a documentului încărcat și cu `changed` setat la `false`.

### dispatch, dispatchSync {#dispatch-dispatchsync}

Aplică modificările unui editor la distanță în store-ul replicationStore.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

Metoda `dispatch` amână aplicarea într-un microtask, iar metoda `dispatchSync` aplică lotul imediat.

Puteți transmite nefiltrat fluxul unui store partajat.  
Ambele metode păstrează doar acțiunile de un tip care poate modifica documentul, plus cele două descrise la sfârșitul acestei secțiuni, și le elimină pe celelalte, astfel încât prezența pe care o transportă o sesiune colaborativă – cursorul mouse-ului, focusul, selecția și caseta de selecție ale fiecărui utilizator – trece fără niciun efect.

Începând cu versiunea `3.10.0`, acțiunile păstrate includ `relationship.changeOnDelete` și `relationship.changeOnUpdate`, iar acțiunea `relationship.add` transportă câmpurile `onDelete` și `onUpdate`.  
Un store dintr-o versiune anterioară elimină aceste acțiuni și ignoră aceste câmpuri, așa că pierde acțiunile [ON DELETE și ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) ale unei relații.

Începând cu versiunea `4.0.0`, acțiunile păstrate includ și `table.changeGroup`, șapte dintre cele opt acțiuni `tableGroup` (`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName` și `tableGroup.changeColor`, toate cu excepția modificării ordinii de suprapunere `tableGroup.changeZIndex`), `relationship.changeColumns`, `settings.changeLockSettings` și `settings.changeDDLScript`.  
Acțiunea `settings.changeRelationshipOptimization` nu mai există, așa că ambele metode o elimină.  
Un store dintr-o versiune anterioară elimină noile acțiuni, așa că pierde [grupurile de tabele](../../guide/guides/table-groups.md), [blocările](../../guide/guides/settings.md#lock), scripturile din fila [Schemă SQL](../../guide/guides/schema-sql.md) și coloanele pe care caseta de dialog [Mapare coloane](../../guide/guides/relationship-editing.md#map-columns) le atribuie unei relații existente.  
Rulați replica pe aceeași versiune ca editoarele sau pe una mai nouă.

Versiunea `4.1.0` nu adaugă niciun tip de acțiune și lasă subcalea `@dineug/erd-editor/engine.js` neschimbată, așa că o replică `4.0.0` păstrează fiecare modificare pe care o trimite un editor `4.1.0`, exact ca o replică `4.1.0`.  
Începând cu versiunea `4.1.0`, butoanele `Replace` și `Replace All` din [Găsire și înlocuire](../../guide/guides/find-and-replace.md#replacing) redenumesc de asemenea indexuri și grupuri de tabele, prin acțiunile `index.changeName` și `tableGroup.changeName` pe care o replică `4.0.0` le păstrează deja.  
Starea proprie a [exploratorului](../../guide/guides/explorer.md) nu este trimisă niciodată, iar o comutare de filă sau o derulare pe care o face sosește ca orice altă comutare de filă sau derulare; consultați [Editare colaborativă](./collaborative-editing.md).

Începând cu versiunea `4.2.0`, acțiunile păstrate includ și `table.changeLogicalName`, `table.changeNameDerived`, `column.changeLogicalName`, `column.changeDomain`, `column.changeNameDerived`, `settings.changeNameViewMode`, precum și `dictionary.add`, `dictionary.update` și `dictionary.remove`, care transportă fiecare editare, sortare și import CSV din foile filei [Dicționar](../../guide/guides/dictionary.md).  
Dintre schimbările modului de afișare a numelor, o replică aplică doar pe cele făcute de un editor care nu este doar în citire cât timp setarea `Name View` este deblocată și le elimină pe celelalte (consultați [on@change](#onchange)).  
Un store dintr-o versiune anterioară elimină toate aceste acțiuni, așa că pierde [numele logice](../../guide/guides/logical-names.md), legăturile cu domeniile, informația dacă fiecare nume provine din dicționare, cuvintele, termenii și domeniile, precum și modul de afișare a numelor.  
Un editor anterior versiunii `4.2.0` aflat în sesiune poate totuși să elimine o parte din acestea dintr-o replică `4.2.0`.  
Un import Schemă SQL, GraphQL, DBML sau AML făcut cu `Import` în acel editor, dar nu unul făcut cu `Import and Add`, elimină cuvintele, termenii și domeniile replicii.  
Anularea unei încărcări, a unui `Import` sau a unui apel `clear()` în acel editor încarcă în replică propria lui copie a documentului, fără nume logice, legături cu domeniile sau dicționare; consultați [Combinarea versiunilor](./collaborative-editing.md#mixing-releases).  
Subcalea `@dineug/erd-editor/engine.js` exportă aceleași `createReplicationStore`, `ReplicationStore` și `ReplicationChange` ca înainte, iar funcția `createReplicationStore` primește același context.

Începând cu versiunea `4.0.0`, ambele metode aplică și acțiunea `editor.mergeLWW`, care transportă registrele de colaborare cu care un editor răspunde când un altul se alătură sesiunii, astfel încât replica rezolvă editările simultane la fel ca editoarele.  
Aceasta nu modifică niciun octet din `value` și nu declanșează niciun eveniment `change`.  
Acțiunea `settings.changeIgnoreSaveSettings`, pe care un editor lansat înainte de versiunea `4.0.0` o poate trimite în continuare, este păstrată, dar nu modifică nimic: declanșează evenimentul `change` cu `changed` setat la `false`.

### destroy {#destroy}

Distruge complet instanța replicationStore.

```js
replicationStore.destroy();
```

După aceea, store-ul nu mai emite evenimentul `change` și ignoră trimiterile ulterioare.  
Documentul rămâne înghețat la ultima sa valoare, în loc să genereze o eroare.  
Creați un store nou pentru a o lua de la capăt.
