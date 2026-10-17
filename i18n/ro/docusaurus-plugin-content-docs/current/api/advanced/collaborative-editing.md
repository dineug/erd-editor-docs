---
sidebar_position: 1
description: Retransmiteți modificările editorului între instanțe cu getSharedStore, inițializați un editor care se alătură din runtimeValue și afișați cursorul, focusul, selecția și caseta de selecție ale fiecărui colaborator.
---

# Editare colaborativă

Metoda `getSharedStore()` transformă un editor într-un nod al unei sesiuni colaborative.  
Aceasta emite fiecare modificare ca flux de acțiuni și aplică acțiunile pe care i le trimit înapoi celelalte editoare – mecanismul de transport dintre ele îl furnizați dumneavoastră (WebSocket, WebRTC sau orice altceva care poate transporta JSON).  
Este una dintre metodele [ErdEditorElement](../erd-editor-element.md) și se folosește împreună cu [Stocare la distanță](./remote-storage.md) atunci când modificările retransmise trebuie să fie și stocate.

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

O acțiune este un obiect simplu, serializabil, care descrie o modificare a documentului, astfel încât trece intactă prin `JSON.stringify` în drum spre mecanismul de transport.  
Acțiunile sosesc în loturi: metoda `subscribe` vă transmite un tablou, iar acel tablou este o unitate – retransmiteți-l întreg și trimiteți-l întreg cu `dispatch` de partea cealaltă.  
Tratați o acțiune ca opacă și transmiteți-o ca atare, fără s-o citiți sau s-o rescrieți, deoarece evidența internă pe care o transportă este cea care menține editoarele sincronizate.

Unele dintre lucrurile pe care le face un editor rămân pe acel editor.  
Aducerea în prim-plan a unui tabel, a unei note sau a unui grup de tabele, pe care o produce și selectarea, nu este trimisă.  
Nu sunt trimise nici opțiunile `Statements`, `Header` și `Tables` din fila [Schemă SQL](../../guide/guides/schema-sql.md), care aparțin ferestrei în care sunt alese.  
Începând cu versiunea `4.1.0`, și [exploratorul](../../guide/guides/explorer.md) rămâne pe editorul său: dacă este deschis, lățimea sa, rândurile restrânse, rândul pe care se află focusul tastaturii, poziția de derulare a arborelui, precum și căutarea și opțiunile sale nu sunt trimise.  
Nu este trimisă nici [evidențierea](../../guide/guides/relationship-editing.md#reading-a-connector) pe care saltul la o cheie străină o aplică pe conectorul relației sale.  
O derulare, un zoom sau o comutare de filă se trimite, dar nu mută niciodată vizualizarea sau fila altui utilizator. Aceasta include derularea pe care o face un salt din explorator și comutarea la fila ERD atunci când exploratorul se deschide dintr-o altă filă.

[Blocările](../../guide/guides/settings.md#lock) sunt partajate: cea mai recentă blocare sau deblocare a unei setări se impune pe toate editoarele, iar o blocare transportă valorile editorului care a activat-o, astfel încât fiecare editor și fiecare replică salvează aceeași valoare.  
Prin urmare, o blocare `Viewport` salvează vizualizarea editorului care a activat-o, iar o blocare `Canvas Type`, ultima filă pe care s-a aflat acel editor înainte de fila Setări, unde se activează blocările.  
Dezactivarea blocării `Language`, `Table Name Case`, `Column Name Case` sau `Bracket Type` setează totodată acea setare, pe fiecare editor, la valoarea afișată pe editorul care a dezactivat-o, astfel încât toate continuă să salveze o singură valoare. Dezactivarea blocării `Viewport` sau `Canvas Type` nu mută vizualizarea sau fila nimănui.

O editare a scriptului `Before tables` sau `After tables` se trimite întreagă atunci când câmpul său pierde focusul. Cele două scripturi se reconciliază separat, astfel încât editarea unuia de către un colaborator nu îl suprascrie niciodată pe celălalt.

Nimic din ce se face în [modul Flux](../../guide/guides/visualization.md#flow-never-edits-the-document) al filei Vizualizare nu este o modificare a documentului, așa că un editor aflat în Flux nu le trimite celorlalte nicio modificare, iar modificările pe care le trimit acestea continuă să se aplice cât timp se află acolo.  
Singura excepție este părăsirea modului Flux pentru o altă filă: această comutare de filă se trimite ca oricare alta.  
Butonul de link extern al cardului, un rezultat al [căutării rapide](../../guide/guides/quick-search.md#searching-the-diagram) ales după `#`, `@` sau `:` și deschiderea [exploratorului](../../guide/guides/explorer.md#opening-and-closing) părăsesc toate modul Flux pentru fila ERD. O derulare pe care o face acolo butonul cardului sau un rezultat al căutării rapide se trimite și ea.

## Două editoare pe aceeași pagină {#two-editors-on-one-page}

Conectarea de la subscribe la dispatch de aici ține locul rețelei, astfel încât puteți vedea forma unei sesiuni fără să vă încurce un mecanism de transport.

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

Ambele editoare de aici pornesc de la același document nou și gol, așa că niciunul nu trebuie inițializat.  
Cu trei sau mai multe editoare, trimiteți loturile fiecăruia către toate celelalte: un editor nu transmite niciodată mai departe ce a primit.

## Inițializarea unui colaborator {#seeding-a-collaborator}

Un store partajat retransmite modificările pe măsură ce sunt făcute și nu îi oferă niciodată unui nou participant documentul în starea sa actuală, așa că un editor care se alătură unei sesiuni aflate deja în desfășurare trebuie să primească mai întâi documentul.  
Începând cu versiunea `4.0.0`, inițializați-l cu proprietatea [`runtimeValue`](../erd-editor-element.md#runtimevalue) a unui editor aflat deja în sesiune, nu cu proprietatea `value` sau cu fișierul salvat.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

Valoarea de execuție conține încă ceea ce a fost eliminat de la deschiderea documentului, astfel încât, atunci când un alt editor anulează ulterior o eliminare, noul participant readuce tabelul cu numele și coloanele sale.  
Proprietatea [`value`](../erd-editor-element.md#value) este forma pe care o conține un fișier, fără entitățile eliminate, așa că un participant inițializat din ea sau din fișier ar readuce în schimb un tabel gol, fără nume.  
Continuați să scrieți proprietatea `value` în stocare: proprietatea `runtimeValue` servește doar la inițializarea unui alt editor, a unei a doua vizualizări sau a unui store [replicationStore](./remote-storage.md).  
Editoarele din VS Code, din Obsidian, dintr-un IDE JetBrains și din aplicația web inițializează în acest mod o a doua vizualizare a unui document deschis.

Metoda `setInitialValue` nu este retransmisă, așa că inițializarea noului participant nu schimbă nimic pe celelalte editoare.  
Începând cu versiunea `4.0.0`, aceasta elimină și registrele de colaborare ale editorului, care rezolvă editările simultane. Dacă store-ul partajat al editorului a avut deja un abonat, store-ul le cere din nou celorlalte editoare registrele lor, ca la primul său apel [subscribe](#subscribe), astfel încât un editor încărcat din nou în mijlocul unei sesiuni rezolvă editările la fel ca celelalte.  
Atribuirea proprietății `value` păstrează registrele, dar, spre deosebire de metoda `setInitialValue`, este retransmisă: odată ce editorul are un store partajat, fiecare editor din sesiune încarcă documentul atribuit, așa că nu inițializați niciodată un participant nou în acest mod.

## Combinarea versiunilor {#mixing-releases}

Un editor aplică doar tipurile de acțiuni pe care le cunoaște propria sa versiune, așa că, într-o sesiune care combină versiuni, editoarele mai vechi pierd tot ce circulă printr-un tip mai nou.

Începând cu versiunea `3.10.0`, o modificare a acțiunii [ON DELETE sau ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) a unei relații circulă sub forma unuia dintre cele două tipuri noi de acțiuni, `relationship.changeOnDelete` și `relationship.changeOnUpdate`, iar acțiunea `relationship.add` le poate transporta pe amândouă. Un releu care transmite acțiunile ca atare nu are nevoie de nimic nou pentru ele.  
Un editor anterior versiunii `3.10.0` ignoră aceste tipuri de acțiuni și aceste câmpuri: nu află niciodată acțiunea ON DELETE sau ON UPDATE a unei relații, iar un document salvat de un astfel de editor nu o conține pe niciuna. O relație pe care o adaugă un editor mai vechi sosește fără ele, așa că ambele pornesc de la valoarea `Not set`.

Orice altă modificare pe care o trimite un editor `3.10.0` circulă prin tipuri de acțiuni pe care editoarele mai vechi le cunosc deja.  
Butonul `Replace All` din [Găsire și înlocuire](../../guide/guides/find-and-replace.md#replacing) își trimite editările ca un singur lot, cu aceleași acțiuni de redenumire, de comentariu și de notă pe care le trimite o editare manuală. [Opțiunile de afișare](../../guide/guides/table-related-functions.md#table-view-options) `Alternate Key` și `Referential Actions` circulă prin acțiunea existentă `settings.changeShow`.

Începând cu versiunea `4.0.0`, următoarele modificări circulă prin tipuri noi de acțiuni, iar un releu care transmite acțiunile ca atare nu are nevoie de nimic nou pentru ele:

- un [grup de tabele](../../guide/guides/table-groups.md) adăugat, mutat, redimensionat, redenumit, recolorat sau eliminat: `tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor` și `tableGroup.remove`; un tabel care intră într-un grup sau iese din el: `table.changeGroup`;
- apăsarea butonului `Save` din caseta de dialog [Mapare coloane](../../guide/guides/relationship-editing.md#map-columns) pentru o relație existentă, care setează deodată ambele liste de coloane ale acesteia: `relationship.changeColumns`;
- o [blocare](../../guide/guides/settings.md#lock) activată sau dezactivată: `settings.changeLockSettings`;
- o editare a scriptului `Before tables` sau `After tables` din fila [Schemă SQL](../../guide/guides/schema-sql.md): `settings.changeDDLScript`.

Opțiunile de afișare `Table Groups` și `Memos` circulă prin acțiunea existentă `settings.changeShow`.  
Acțiunea `settings.changeIgnoreSaveSettings`, pe care o trimiteau comutatoarele `Save Scroll Information` și `Save Zoom Information` înainte ca blocările să le înlocuiască, nu mai este trimisă, iar acțiunea `settings.changeRelationshipOptimization` nu mai există. Un editor `4.0.0` care primește oricare dintre ele nu schimbă nimic.

Un editor anterior versiunii `4.0.0` ignoră noile tipuri de acțiuni: nu vede niciodată un grup de tabele sau ce tabele conține acesta, deși glisarea unui grup mută totuși și acolo tabelele grupului, deoarece trimite și acțiunile `table.move` ale acestora.  
Păstrează coloanele vechi ale unei relații după apăsarea butonului `Save` din caseta de dialog Mapare coloane, iar când pe el se elimină o coloană din acea mapare veche, relația dispare de pe toate editoarele. Nu are nici blocări, nici scripturi.  
Un document salvat de un astfel de editor nu conține nimic din toate acestea, iar un editor `4.0.0` îl deschide cu toate blocările activate.  
Păstrați fiecare editor dintr-o sesiune, precum și orice store [replicationStore](./remote-storage.md#dispatch-dispatchsync) care îi stochează documentul, la versiunea `4.0.0` sau la o versiune ulterioară.

Un editor `4.1.0` nu trimite niciun tip nou de acțiune, așa că editoarele și replicile `4.0.0` și `4.1.0` participă la aceeași sesiune fără să piardă nimic.  
Funcția sa [Găsire și înlocuire](../../guide/guides/find-and-replace.md#replacing) caută și în numele indexurilor și ale grupurilor de tabele, iar butoanele `Replace` și `Replace All` le redenumesc prin acțiunile `index.changeName` și `tableGroup.changeName` pe care un editor `4.0.0` le aplică deja.

## SharedStoreConfig {#sharedstoreconfig}

### getNickname {#getnickname}

Setează pseudonimul afișat lângă cursorul mouse-ului acestui utilizator pe celelalte editoare.  
Ceilalți utilizatori văd `user` atunci când pseudonimul lipsește sau este gol.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker {#mousetracker}

Difuzează cursorul mouse-ului acestui utilizator către celelalte editoare. Valoarea implicită este `true`.  
Cursoarele trimise de alți utilizatori sunt afișate întotdeauna pe pânza ERD.

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker {#focustracker}

Difuzează elementele la care lucrează acest utilizator. Valoarea implicită este `true`.  
Tabelul și celula în care aveți focusul, tabelele, notele și grupurile de tabele pe care le-ați selectat și caseta de selecție pe care o trasați pe pânză sunt trimise celorlalte editoare și desenate acolo.  
Fiecare utilizator primește o culoare proprie, ca să-i puteți deosebi: un contur pe tabelul activ, o subliniere pe celula activă, un inel în jurul tabelelor, notelor și grupurilor de tabele selectate și un dreptunghi cu linie întreruptă pentru caseta de selecție.  
Prezența care sosește de la alți utilizatori este desenată întotdeauna pe pânza dumneavoastră, indiferent dacă această opțiune este activată sau nu.  
În modul Flux al filei Vizualizare, focusul și selecția altor utilizatori sunt desenate pe cardurile tabelelor, dar casetele lor de selecție nu. Tabelele pe care le selectați acolo sunt totuși trimise; caseta pe care o trasați acolo nu.

```js
editor.getSharedStore({ focusTracker: false });
```

Dezactivați ambele funcții de urmărire pentru a folosi store-ul partajat ca simplu releu, care nu publică nicio prezență proprie.  
Prezența trimisă de alte editoare este totuși primită și desenată.  
Așa procedează editoarele din VS Code, din Obsidian, dintr-un IDE JetBrains și din Google Drive.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

Cursorul, focusul, selecția și caseta de selecție circulă pe același flux ca modificările documentului, dar sunt efemere.  
Nu intră niciodată în document, în istoricul anulărilor sau în `editor.value`, așa că un mecanism de transport le poate omite fără probleme, iar un store replicationStore le ignoră.

## SharedStore {#sharedstore}

### connection, disconnect {#connection-disconnect}

Aceste metode setează starea curentă a conexiunii.  
Cât timp store-ul este deconectat, modificările sunt reținute intern într-o memorie tampon.  
Modificările din memoria tampon sunt emise către abonați imediat ce transmisia este din nou posibilă.  
Starea implicită este cea conectată (`connection`).

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync {#dispatch-dispatchsync}

Aplică în instanța curentă a editorului modificările provenite de la alte instanțe ale editorului.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Se abonează la modificările din editor.  
Nimic nu iese din editor până nu există cel puțin un abonat, iar modificările făcute înainte de acel moment sunt reținute în memoria tampon.  
Primul apel subscribe le cere și celorlalte editoare registrele lor de colaborare, care rezolvă editările simultane, astfel încât un participant care se alătură târziu le rezolvă în același mod.  
Apelul nu aduce documentul, așa că [inițializați](#seeding-a-collaborator) mai întâi participantul care se alătură târziu.  
Începând cu versiunea `4.0.0`, store-ul le cere din nou de fiecare dată când metoda `setInitialValue` încarcă un document în editorul său după acel prim apel subscribe.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Trimite acum loturile de flux pe care acest store le reține încă, în loc să le trimită după perioada lor de inactivitate.  
Începând cu versiunea `3.9.2`, funcționează pe un store obținut din `getSharedStore`; în versiunea `3.9.1`, metoda apare în definiția de tip, dar nu face nimic.  
Mutarea unui tabel, a unei note sau a unui grup de tabele, schimbarea culorii acestuia, redimensionarea unei note și derularea sau zoomul vizualizării sosesc fiecare ca flux de modificări mici. Redimensionarea unui grup de tabele nu sosește așa: se trimite o singură dată, când se termină glisarea.  
Store-ul adună fiecare flux într-un singur lot și îl reține până când fluxul rămâne inactiv timp de 200 ms. Face acest lucru în două etape, așa că lotul pleacă la aproximativ 400 ms după ultima modificare.  
Un apel încheie această așteptare în ambele etape. Cât timp store-ul este conectat, un abonat primește lotul înainte ca apelul să returneze. Dacă nu este reținut nimic, apelul nu trimite nimic.  
Metoda `destroy`, fie cea a store-ului, fie cea a editorului, elimină un lot încă reținut, așa că apelați mai întâi metoda de față atunci când renunțați la un store și celelalte editoare trebuie să păstreze ultima modificare, ca atunci când se închide o filă.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy {#destroy}

Distruge complet instanța sharedStore.  
Editorul însuși rămâne neatins, așa că părăsirea unei sesiuni lasă documentul editabil.  
Funcțiile de urmărire a mouse-ului și a focusului se opresc odată ce este distrusă ultima instanță sharedStore furnizată de editor.  
Un lot de flux pe care store-ul încă îl reține este eliminat odată cu acesta; apelați mai întâi metoda [flushStreamBuffers](#flushstreambuffers) pentru a-l trimite.

```js
sharedStore.destroy();
```
