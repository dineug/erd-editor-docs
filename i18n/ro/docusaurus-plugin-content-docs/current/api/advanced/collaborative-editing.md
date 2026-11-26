---
sidebar_position: 1
description: Retransmiteți modificările editorului între instanțe cu getSharedStore, inițializați un editor care se alătură din runtimeValue și din registrele store-ului, rezolvați editările făcute în același moment și afișați cursorul, focusul, selecția și caseta de selecție ale fiecărui colaborator.
---

# Editare colaborativă

Metoda `getSharedStore()` transformă un editor într-un nod al unei sesiuni colaborative.  
Aceasta emite fiecare modificare ca flux de acțiuni și aplică acțiunile pe care i le trimit înapoi celelalte editoare – mecanismul de transport dintre ele îl furnizați dumneavoastră (WebSocket, WebRTC sau orice altceva care poate transporta JSON).  
Este una dintre metodele [ErdEditorElement](../erd-editor-element.md) și se folosește împreună cu [Stocare la distanță](./remote-storage.md) atunci când modificările retransmise trebuie să fie și stocate.  
Începând cu versiunea `5.1.0`, pentru a partaja o diagramă printr-un document Yjs și oricare dintre furnizorii săi, în loc să construiți singuri mecanismul de transport, legați editorul cu `@dineug/erd-editor-yjs`; consultați [Yjs](./yjs.md).

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

`@dineug/erd-editor` nu exportă cu nume niciunul dintre aceste tipuri. Codul TypeScript ajunge la ele prin `ErdEditorElement`, ca în `ReturnType<ErdEditorElement['getSharedStore']>`.

O acțiune este un obiect simplu, serializabil, care descrie o modificare a documentului, astfel încât trece intactă prin `JSON.stringify` în drum spre mecanismul de transport.  
Acțiunile sosesc în loturi: metoda `subscribe` vă transmite un tablou, iar acel tablou este o unitate – retransmiteți-l întreg și trimiteți-l întreg cu `dispatch` de partea cealaltă.  
Tratați o acțiune ca opacă și transmiteți-o ca atare, fără s-o citiți sau s-o rescrieți, deoarece evidența internă pe care o transportă, cum ar fi [marcajul de versiune](#concurrent-edits), este cea care menține editoarele sincronizate.

Unele dintre lucrurile pe care le face un editor rămân pe acel editor.  
Aducerea în prim-plan a unui tabel, a unei note sau a unui grup de tabele, pe care o produce și selectarea, nu este trimisă.  
Nu sunt trimise nici opțiunile `Statements`, `Header`, `Write logical names into empty comments` (începând cu versiunea `4.2.0`) și `Tables` din fila [Schemă SQL](../../guide/guides/schema-sql.md), care aparțin ferestrei în care sunt alese.  
Începând cu versiunea `4.1.0`, și [exploratorul](../../guide/guides/explorer.md) rămâne pe editorul său: dacă este deschis, lățimea sa, rândurile restrânse, rândul pe care se află focusul tastaturii, poziția de derulare a arborelui, precum și căutarea și opțiunile sale nu sunt trimise.  
Nu este trimisă nici [evidențierea](../../guide/guides/relationship-editing.md#reading-a-connector) pe care saltul la o cheie străină o aplică pe conectorul relației sale.  
Începând cu versiunea `4.2.0`, și fila [Dicționar](../../guide/guides/dictionary.md) rămâne pe editorul său: foaia afișată, precum și căutarea, selecția, poziția de derulare și lățimile coloanelor fiecărei foi nu sunt trimise. Editările, sortările și importurile CSV din ea sunt trimise.  
O derulare, un zoom sau o comutare de filă se trimite, dar nu mută niciodată vizualizarea sau fila altui utilizator. Aceasta include derularea pe care o face un salt din explorator, comutarea la fila ERD atunci când exploratorul se deschide dintr-o altă filă, precum și comutarea de filă și derularea pe care le face un salt din foaia [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) a filei Dicționar la un tabel sau la o coloană. Un salt din acea foaie la un cuvânt, un termen sau un domeniu rămâne în fila Dicționar, așa că nimic din el nu este trimis.

Începând cu versiunea `4.2.0`, se trimite și o schimbare a [modului de afișare a numelor](../../guide/guides/logical-names.md#switching-the-view), iar [blocarea](../../guide/guides/settings.md#lock) acestuia decide ce fac celelalte editoare cu ea. Blocarea `Name View` este activată într-o diagramă nouă și în orice document anterior versiunii `4.2.0`.  
Cât timp blocarea este activată, schimbarea apare doar pe editorul care a făcut-o: este trimisă în continuare, dar toate celelalte editoare și toate replicile o elimină, așa că fiecare utilizator poate vedea un alt mod de afișare, în timp ce `value` păstrează modul blocat.  
Cât timp blocarea este dezactivată, o schimbare făcută într-un editor care poate edita modifică modul de afișare a numelor pe toate editoarele și replicile, cea mai recentă schimbare impunându-se, iar fiecare dintre ele îl salvează.  
Schimbarea proprie a unui editor doar în citire rămâne întotdeauna pe acel editor, iar editorul urmează în continuare schimbările partajate ale celorlalte.

Începând cu versiunea `5.1.0`, o schimbare a limbajului [generatorului de cod](../../guide/guides/code-generator.md), a stilului de denumire a tabelelor, a stilului de denumire a coloanelor sau a tipului de delimitator urmează în același mod propria blocare (`Language`, `Table Name Case`, `Column Name Case` sau `Bracket Type`), cu o singură diferență: cât timp blocarea este activată, schimbarea nu este trimisă deloc.  
Ea apare doar pe editorul care a făcut-o, ale cărui file Generator de cod și Schemă SQL o urmează, iar niciun alt editor și nicio altă replică nu o vede. `value` și `runtimeValue` păstrează valoarea blocată, așa că nici un participant inițializat de la oricare editor nu o vede, iar fiecare utilizator poate vedea un alt limbaj, un alt stil de denumire sau un alt tip de delimitator cât timp blocarea este activată.  
Cât timp blocarea este dezactivată, o schimbare făcută într-un editor care poate edita este trimisă marcată ca partajată (`shared: true` în conținutul acțiunii). Ea modifică setarea pe toate editoarele și replicile, cea mai recentă schimbare impunându-se, iar fiecare dintre ele o salvează. Un editor sau o replică `5.1.0` aplică o schimbare marcată indiferent de ce spune propria sa blocare, așa că o schimbare făcută imediat după o deblocare ajunge peste tot, chiar și acolo unde sosește înainte de deblocare.  
Înainte de versiunea `5.1.0`, o astfel de schimbare ajungea la toate editoarele și replicile indiferent dacă blocarea sa era activată, în timp ce fișierul păstra valoarea blocată.

Începând cu versiunea `5.0.0`, un editor [doar în citire](../erd-editor-element.md#readonly) nu trimite nicio schimbare. Derularea, zoom-ul, fila, modul de afișare a numelor (`Name View`), baza de date, limbajul generatorului de cod, stilurile de denumire, tipul de delimitator și rândurile `View Option` pe care le schimbă cititorul rămân pe ecranul lui, indiferent de ce spun blocările lor; înainte de `5.0.0`, derulările, zoom-urile, comutările de filă, baza de date și setările de cod ale unui astfel de editor erau trimise ca ale unui editor care poate edita.  
Store-ul său trimite în continuare ce trimit trackerele sale despre cursorul, focusul, selecția și caseta de selecție ale cititorului, răspunde la registrele pe care le cere un editor care se alătură și aplică orice schimbare trimisă de ceilalți. O schimbare a bazei de date, a unei setări a generatorului de cod sau a unui rând `View Option` ajunge în documentul său, iar pe ecran ajunge și ea, cu excepția cazului în care cititorul a schimbat acolo setarea respectivă, iar o schimbare partajată a modului de afișare a numelor apare pe ecran în ambele cazuri. Începând cu versiunea `5.1.0`, primește o setare a generatorului de cod doar atunci când acea setare a fost schimbată cu blocarea dezactivată sau când o deblocare o transportă.  
Când editorul devine doar în citire, trimite mai întâi ce mai ține store-ul din tragere sau din derulare, așa cum face [flushStreamBuffers](#flushstreambuffers), astfel încât ceilalți să păstreze ultima parte.

[Blocările](../../guide/guides/settings.md#lock) sunt partajate: cea mai recentă blocare sau deblocare a unei setări se impune pe toate editoarele, iar o blocare transportă valorile editorului care a activat-o, astfel încât fiecare editor și fiecare replică salvează aceeași valoare.  
Prin urmare, o blocare `Viewport` salvează vizualizarea editorului care a activat-o, iar o blocare `Canvas Type`, ultima filă pe care s-a aflat acel editor înainte de fila Setări, unde se activează blocările.  
Dezactivarea blocării `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` sau, începând cu versiunea `4.2.0`, `Name View` setează totodată acea setare, pe fiecare editor, la valoarea afișată pe editorul care a dezactivat-o, inclusiv propria sa schimbare făcută sub blocare, astfel încât toate continuă să salveze o singură valoare. Dezactivarea blocării `Viewport` sau `Canvas Type` nu mută vizualizarea sau fila nimănui.

O editare a scriptului `Before tables` sau `After tables` se trimite întreagă atunci când câmpul său pierde focusul. Cele două scripturi se reconciliază separat, astfel încât editarea unuia de către un colaborator nu îl suprascrie niciodată pe celălalt.

Nimic din ce se face în [modul Flux](../../guide/guides/visualization.md#flow-never-edits-the-document) al filei Vizualizare nu este o modificare a documentului, așa că un editor aflat în Flux nu le trimite celorlalte nicio modificare, iar modificările pe care le trimit acestea continuă să se aplice cât timp se află acolo.  
Există două excepții. Părăsirea modului Flux pentru o altă filă este o comutare de filă, trimisă ca oricare alta. Începând cu versiunea `4.2.0`, o alegere din lista modurilor de afișare a numelor din bara de instrumente a modului Flux este o schimbare a modului de afișare, trimisă și aplicată ca una făcută pe pânză.  
Comenzile `Previous table` și `Next table`, precum și tastele de anulare și refacere, care în modul Flux [parcurg pas cu pas vizualizările](../../guide/guides/visualization.md#previous-table-and-next-table), nu sunt trimise.  
Butonul de link extern al cardului, un rezultat al [căutării rapide](../../guide/guides/quick-search.md#searching-the-diagram) ales după `#`, `@` sau `:` și deschiderea [exploratorului](../../guide/guides/explorer.md#opening-and-closing) părăsesc toate modul Flux pentru fila ERD. O derulare pe care o face acolo butonul cardului sau un rezultat al căutării rapide se trimite și ea.

## Două editoare pe aceeași pagină {#two-editors-on-one-page}

Conectarea de la subscribe la dispatch de aici ține locul rețelei, astfel încât puteți vedea forma unei sesiuni fără să vă încurce un mecanism de transport.

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

Ambele editoare de aici pornesc de la același document nou și gol, așa că niciunul nu trebuie inițializat.  
Cu trei sau mai multe editoare, trimiteți loturile fiecăruia către toate celelalte: un editor nu transmite niciodată mai departe ce a primit.

## Inițializarea unui colaborator {#seeding-a-collaborator}

Un store partajat retransmite modificările pe măsură ce sunt făcute și nu îi oferă niciodată unui nou participant documentul în starea sa actuală, așa că un editor care se alătură unei sesiuni aflate deja în desfășurare trebuie să primească mai întâi documentul.  
Începând cu versiunea `4.0.0`, inițializați-l cu proprietatea [`runtimeValue`](../erd-editor-element.md#runtimevalue) a unui editor aflat deja în sesiune, nu cu proprietatea `value` sau cu fișierul salvat.  
O cameră legată cu [`@dineug/erd-editor-yjs`](./yjs.md) conține ea însăși documentul din momentul în care un client a [inițializat-o](./yjs.md#seeding-a-room), așa că fiecare editor legat de ea deschide acel document fără să i se transmită vreun `runtimeValue`.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

Valoarea de execuție conține încă ceea ce a fost eliminat de la deschiderea documentului, astfel încât, atunci când un alt editor anulează ulterior o eliminare, noul participant readuce tabelul cu numele și coloanele sale.  
Proprietatea [`value`](../erd-editor-element.md#value) este forma pe care o conține un fișier, fără entitățile eliminate, așa că un participant inițializat din ea sau din fișier ar readuce în schimb un tabel gol, fără nume.  
Începând cu versiunea `4.2.0`, același lucru este valabil pentru un cuvânt, un termen sau un domeniu eliminat dintr-o foaie a filei [Dicționar](../../guide/guides/dictionary.md): când un alt editor anulează eliminarea, un participant nou inițializat din `runtimeValue` listează din nou rândul întreg, iar unul inițializat din `value` listează un rând gol, pe care propria lui proprietate `value` îl omite apoi.  
Continuați să scrieți proprietatea `value` în stocare: proprietatea `runtimeValue` servește doar la inițializarea unui alt editor, a unei a doua vizualizări sau a unui store [replicationStore](./remote-storage.md).  
Editoarele din VS Code, din Obsidian, dintr-un IDE JetBrains și din aplicația web inițializează în acest mod o a doua vizualizare a unui document deschis.

Metoda `setInitialValue` nu este retransmisă, așa că inițializarea noului participant nu schimbă nimic pe celelalte editoare.  
Începând cu versiunea `4.0.0`, aceasta elimină și registrele de colaborare ale editorului, care rezolvă [editările simultane](#concurrent-edits). Dacă store-ul partajat al editorului a avut deja un abonat, store-ul le cere din nou celorlalte editoare registrele lor, ca la primul său apel [subscribe](#subscribe), astfel încât un editor încărcat din nou în mijlocul unei sesiuni rezolvă editările la fel ca celelalte.  
Atribuirea proprietății `value` păstrează registrele, dar, spre deosebire de metoda `setInitialValue`, este retransmisă: odată ce editorul are un store partajat, fiecare editor din sesiune încarcă documentul atribuit, așa că nu inițializați niciodată un participant nou în acest mod.

Nici `value`, nici `runtimeValue` nu conțin registrele și nici marcajul de versiune la care a ajuns ceasul editorului, așa că un participant inițializat doar din `runtimeValue` le preia din răspunsul pe care îl trimit editoarele din sesiune la primul său subscribe.  
Până sosește acel răspuns, o editare făcută de participant poate purta un marcaj de versiune mai mic decât cel pe care îl dețin ceilalți, așa că aceștia o refuză cât timp ea rămâne la participant, iar o scriere mai veche, încă pe drum, se impune peste cea mai nouă pe care o conține inițializarea. Acolo unde niciun editor în funcțiune nu răspunde, de exemplu când un server sau un depozit de documente păstrează documentul sesiunii, participantul nu le primește niciodată.  
Începând cu versiunea `5.1.0`, transmiteți-le împreună cu valoarea. Pe un editor din sesiune, apelați [`flushStreamBuffers()`](#flushstreambuffers), astfel încât o tragere sau o schimbare de culoare pe care o mai reține să plece mai întâi, apoi citiți în același moment `runtimeValue` și metodele [`getLWW()`](#getlww) și [`getVersion()`](#getversion) ale store-ului său. Participantul care se alătură încarcă valoarea cu `setInitialValue`, apoi preia restul cu [`mergeLWW`](#mergelww) din propriul store, în această ordine, deoarece fiecare `setInitialValue` elimină registrele. Următoarea sa editare poartă atunci un marcaj de versiune mai mare decât oricare dintre cele pe care le conține inițializarea, așa că se impune fără să aștepte vreun răspuns. Pe un store care există deja, [`reseed`](#reseed) face ambele în același apel.

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

O inițializare păstrată astfel pentru a deschide participanți ulteriori conține cele trei laolaltă. Nu este un fișier: `value` rămâne ceea ce se scrie în stocare.  
Un [replicationStore](./remote-storage.md#runtimevalue-getter) nu oferă registre, așa că un participant inițializat din proprietatea sa `runtimeValue` le preia în continuare din răspunsul editoarelor.

## Editări simultane {#concurrent-edits}

Fiecare editor și fiecare replică păstrează, pentru fiecare nume și pentru aproape orice alt câmp, marcajul de versiune al scrierii care l-a setat: acestea sunt registrele sale de colaborare. O scriere se impune doar dacă marcajul ei de versiune nu este sub cel deținut, astfel încât editoarele care aud aceleași modificări în ordini diferite ajung la același document.  
Începând cu versiunea `5.1.0`, fiecare marcaj de versiune poartă, sub contorul său, un slot propriu editorului care scrie, preluat din ID-ul acestuia. Marcajele cresc deci în pași de 4.194.304 și depășesc un întreg pe 32 de biți odată ce contorul ajunge la 512. `JSON.stringify` și `JSON.parse` le transportă intacte, dar un releu sau un depozit care le interpretează într-un alt limbaj trebuie să le păstreze ca numere pe 64 de biți, niciodată ca întregi pe 32 de biți.

Începând cu versiunea `5.1.0`, două editoare care schimbă același nume sau câmp în același moment, cu excepțiile de mai jos, ajung la aceeași valoare pe fiecare editor și pe fiecare replică: scriind la același contor, ele scriu cu două marcaje de versiune diferite, iar cel mai mare se impune peste tot. Înainte de versiunea `5.1.0`, amândouă puteau scrie cu același marcaj de versiune, iar fiecare editor păstra scrierea auzită ultima, așa că puteau ajunge la valori diferite. Două editoare au același slot cu o probabilitate de 1 la 4.194.304 pentru fiecare pereche, iar atunci rămân la egalitate ca înainte.

Începând cu versiunea `5.1.0`, poziția unui tabel, poziția și dimensiunea unei note sau a unui grup de tabele, precum și originea și nivelul de zoom ale vizualizării sunt versionate în același mod, iar ceea ce le mută pleacă sub forma locului în care ajung:

- o tragere ca un singur `table.moveTo`, `memo.moveTo` sau `tableGroup.moveTo` pentru fiecare entitate mutată, într-un singur lot, astfel încât tragerea unui grup poartă punctele tabelelor sale și, începând cu versiunea `5.1.1`, ale notelor sale împreună cu cel al grupului;
- anularea sau refacerea unei trageri ca punctul în care aceasta pune fiecare entitate;
- o derulare ca `settings.scrollTo`, iar un zoom ca `settings.changeZoomLevel`;
- redimensionarea unei note sau a unui grup de tabele ca poziția și dimensiunea sa, împreună.

Astfel, doi utilizatori care mută, sau mută și redimensionează, același tabel, aceeași notă sau același grup de tabele în același moment ajung cu el la un singur punct și la o singură dimensiune pe fiecare editor și pe fiecare replică. Punctul revine scrierii cu marcajul de versiune mai mare, ambele axe împreună. O mutare nu scrie nicio dimensiune, așa că o redimensionare își păstrează dimensiunea chiar și acolo unde o mutare făcută în același moment preia punctul.  
Înainte de versiunea `5.1.0`, o tragere pleca sub forma distanței parcurse, așa că două trageri ale aceluiași tabel se adunau, iar o mutare și o redimensionare ale aceleiași note sau ale aceluiași grup de tabele făcute în același moment puteau ajunge la valori diferite.  
O tragere sub 20 px, care nu lasă nicio intrare de anulare, este trimisă ca oricare alta, așa că, sub forma unui punct, poate suprascrie o tragere a aceleiași entități făcută de alt utilizator în același moment. Un lot de tragere, derulare sau zoom pe care un mecanism de transport îl livrează de două ori nu mută nimic de două ori.

O schimbare de culoare este o excepție. Ea pleacă fără marcaj de versiune, iar fiecare editor și fiecare replică o marchează cu propriul marcaj și păstrează culoarea auzită ultima, așa că doi utilizatori care recolorează același tabel, aceeași notă sau același grup de tabele în același moment pot ajunge la culori diferite.  
Câteva schimbări nu păstrează deloc un marcaj de versiune, așa că fiecare editor și fiecare replică le aplică în ordinea în care le aude, iar două făcute în același moment pot ajunge și ele la valori diferite: mutarea unei coloane în cadrul tabelului sau al indexului său (`column.move`, `indexColumn.move`) și o schimbare a [bazei de date](../../guide/guides/table-related-functions.md#databases), a unui rând [`View Option`](../../guide/guides/table-related-functions.md#table-view-options) sau a setărilor `Relationship DataType Sync`, `Maximum comment width` ori `Column Order` din fila [Setări](../../guide/guides/settings.md).  
Entitățile pe care doi utilizatori le adaugă în același moment, de exemplu două tabele sau două coloane ale aceluiași tabel, pot sta de asemenea într-o ordine diferită pe fiecare editor și pe fiecare replică, iar proprietatea `value` a fiecăruia salvează propria ordine.

Tot ce precede este valabil între editoarele și replicile de versiune `5.1.0` sau ulterioară; [Combinarea versiunilor](#mixing-releases) arată ce schimbă una mai veche.

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

Un editor anterior versiunii `4.0.0` ignoră noile tipuri de acțiuni: nu vede niciodată un grup de tabele sau ce tabele conține acesta, deși glisarea unui grup mută totuși și acolo tabelele grupului, deoarece trimite și o mutare a fiecăruia dintre aceste tabele.  
Păstrează coloanele vechi ale unei relații după apăsarea butonului `Save` din caseta de dialog Mapare coloane, iar când pe el se elimină o coloană din acea mapare veche, relația dispare de pe toate editoarele. Nu are nici blocări, nici scripturi.  
Un document salvat de un astfel de editor nu conține nimic din toate acestea, iar un editor `4.0.0` îl deschide cu toate blocările activate.  
Păstrați fiecare editor dintr-o sesiune, precum și orice store [replicationStore](./remote-storage.md#dispatch-dispatchsync) care îi stochează documentul, la versiunea `4.0.0` sau la o versiune ulterioară.

Un editor `4.1.0` nu trimite niciun tip nou de acțiune, așa că editoarele și replicile `4.0.0` și `4.1.0` participă la aceeași sesiune fără să piardă nimic.  
Funcția sa [Găsire și înlocuire](../../guide/guides/find-and-replace.md#replacing) caută și în numele indexurilor și ale grupurilor de tabele, iar butoanele `Replace` și `Replace All` le redenumesc prin acțiunile `index.changeName` și `tableGroup.changeName` pe care un editor `4.0.0` le aplică deja.

Începând cu versiunea `4.2.0`, următoarele modificări circulă prin tipuri noi de acțiuni, iar un releu care transmite acțiunile ca atare nu are nevoie de nimic nou pentru ele:

- [numele logic](../../guide/guides/logical-names.md) al unui tabel sau al unei coloane: `table.changeLogicalName` și `column.changeLogicalName`; informația dacă numele său a fost [derivat din dicționare](../../guide/guides/dictionary.md#deriving-physical-names): `table.changeNameDerived` și `column.changeNameDerived`;
- o coloană legată de un [domeniu](../../guide/guides/dictionary.md#domains-and-data-types) sau a cărei legătură cu domeniul este eliminată: `column.changeDomain`;
- un cuvânt, un termen sau un domeniu adăugat, modificat (inclusiv locul său în foaie, așa cum îl stabilește o sortare) sau eliminat în fila [Dicționar](../../guide/guides/dictionary.md): `dictionary.add`, `dictionary.update` și `dictionary.remove`;
- o schimbare a [modului de afișare a numelor](../../guide/guides/logical-names.md#switching-the-view): `settings.changeNameViewMode`.

Blocarea `Name View` circulă prin acțiunea existentă `settings.changeLockSettings`, opțiunea de afișare `Domain` prin `settings.changeShow`, iar o mutare a rândului `Logical Name` sau `Domain` în [ordinea coloanelor](../../guide/guides/settings.md#adjusting-column-order) prin `settings.changeColumnOrder`.  
Acțiunile `editor.clear` și `editor.loadJson` ale unui import Schemă SQL, GraphQL, DBML sau AML făcut cu `Import` conțin `keepDictionaries: true`, care păstrează cuvintele, termenii și domeniile pe toate editoarele. La fel le conțin și cele ale unui apel [setSchemaSQL](../erd-editor-element.md#setschemasql), `setSchemaGraphQL`, `setSchemaDBML` sau `setSchemaAML` în modul de înlocuire.  
Un nume fizic derivat de dicționare circulă prin `table.changeName` sau `column.changeName`, iar tipul de date pe care un domeniu îl dă coloanelor sale, prin `column.changeDataType`, adică prin acțiunile pe care le trimite o editare manuală.

Un editor anterior versiunii `4.2.0` ignoră noile tipuri de acțiuni: nu are nume logice, legături cu domeniile, dicționare sau mod de afișare a numelor. O blocare sau deblocare a setării `Name View` nu schimbă nimic acolo și nici o mutare a rândului `Logical Name` sau `Domain` în ordinea coloanelor ori a altui rând pe locul unuia dintre ele. Nu schimbă nimic nici o blocare `Canvas Type` activată de un editor care a ajuns în fila Setări din fila Dicționar: editorul mai vechi nu cunoaște acea filă, așa că păstrează setarea `Canvas Type` deblocată. Afișează totuși numele fizice pe care le derivă dicționarele și tipurile de date pe care le dau domeniile.  
Propriile sale editări nu știu nimic despre numele logice, domenii sau dicționare, cu următoarele efecte asupra editoarelor mai noi:

- Un tabel sau o coloană pe care o redenumește manual își păstrează numele marcat ca derivat, așa că un nume logic scris ulterior pentru acel element într-un editor mai nou poate deriva din nou numele peste cel tastat în editorul mai vechi.
- Un tip de date pe care îl dă unei coloane legate de un domeniu nu elimină legătura cu domeniul, așa că foaia `Checks` listează `Domain type mismatch`, iar următoarea modificare a tipului domeniului îi dă coloanei din nou tipul domeniului.
- Coloanele cheie străină ale unei relații pe care o adaugă nu primesc de la cheia lor niciun nume logic și niciun domeniu.
- Un tabel pe care îl lipește sau îl duplică sosește fără nume logice și fără legături cu domeniile.
- Un import Schemă SQL, GraphQL, DBML sau AML făcut pe el nu trimite `keepDictionaries`, așa că elimină cuvintele, termenii și domeniile de pe toate editoarele.
- Anularea unei încărcări, a unui import sau a unui apel `clear()` pe el încarcă propria lui copie a documentului pe toate editoarele, iar acea copie nu are nume logice, legături cu domeniile sau dicționare.
- Acea copie, precum și documentul pe care îl încarcă un import Schemă SQL, GraphQL, DBML sau AML făcut pe el readuc totodată blocarea `Name View` de pe toate editoarele la starea în care a găsit-o acel editor. Fiecare editor salvează apoi `Physical Names` ca mod de afișare a numelor și îl și afișează dacă blocarea este dezactivată.

Un document salvat de un astfel de editor nu are nume logice, legături cu domeniile, dicționare sau mod de afișare a numelor, așa că un editor `4.2.0` îl deschide în modul `Physical Names`. Editorul mai vechi salvează totuși blocarea `Name View` așa cum a găsit-o, așa că un document deblocat într-un editor `4.2.0` rămâne deblocat.  
Păstrați fiecare editor dintr-o sesiune, precum și orice store [replicationStore](./remote-storage.md#dispatch-dispatchsync) care îi stochează documentul, la versiunea `4.2.0` sau la o versiune ulterioară.

Un editor `5.1.0` nu trimite niciun tip nou de acțiune, așa că editoarele și replicile anterioare versiunii `5.1.0` participă în continuare la aceeași sesiune cu el, iar un releu care transmite acțiunile ca atare nu are nevoie de nimic nou. Ceea ce descrie secțiunea [Editări simultane](#concurrent-edits) este însă valabil doar între editoarele și replicile `5.1.0`:

- Tragerile unui editor `5.1.0` circulă ca puncte prin `table.moveTo`, `memo.moveTo` și `tableGroup.moveTo`, pe care editoarele mai vechi le aplică deja, iar derulările și zoom-urile sale ca puncte prin `settings.scrollTo` și `settings.changeZoomLevel`, pe care, ca orice derulare și orice zoom, niciun alt editor nu le aplică și doar replicile le preiau. Un editor mai vechi aplică fiecare punct al unei trageri în ordinea sosirii, în afara oricărui registru, iar o replică mai veche face același lucru cu fiecare punct al unei trageri, derulări sau al unui zoom, așa că două puncte trimise în același moment pentru aceeași entitate sau pentru vizualizare pot ajunge acolo la valori diferite.
- Tragerea unui editor mai vechi circulă în continuare ca distanță parcursă, pe care fiecare editor și fiecare replică o adună în afara registrelor sale, iar derularea sau zoom-ul său tot ca distanță, pe care fiecare replică o adună în același mod. O distanță și un punct pentru aceeași entitate, făcute în același moment, pot ajunge la valori diferite pe editoarele și replicile care le aud în ordini diferite, iar o distanță pe care un mecanism de transport o livrează de două ori este adunată de două ori.
- În afara excepțiilor numite în secțiunea [Editări simultane](#concurrent-edits), scrierea unui nume sau câmp de către un editor `5.1.0`, făcută în același moment cu scrierea aceluiași de către un editor mai vechi, se impune aproape întotdeauna, cu același rezultat pe fiecare editor și pe fiecare replică. Două editoare mai vechi pot totuși ajunge la valori diferite pentru un câmp scris în același moment.
- Un editor `5.1.0` trimite o schimbare a limbajului generatorului de cod, a stilului de denumire sau a tipului de delimitator doar cât timp blocarea sa este dezactivată, cu indicatorul `shared: true`, pe care un editor mai vechi îl ignoră, aplicând schimbarea ca înainte. Un editor mai vechi trimite în continuare, nemarcată, o schimbare făcută de el sub blocare: un editor sau o replică `5.1.0` o elimină cât timp acea setare este blocată acolo, iar editoarele mai vechi o aplică. Astfel, sub o blocare, editoarele mai vechi urmează alegerile unul altuia, în timp ce editoarele `5.1.0` le păstrează pe ale lor, iar fișierul păstrează valoarea blocată în ambele cazuri. O deblocare făcută pe oricare dintre versiuni transportă valoarea celui care deblochează către fiecare editor și fiecare replică.
- O încărcare care înlocuiește documentul, cum ar fi atribuirea proprietății `value`, `clear()` sau un import cu înlocuire, încheie trasarea unei relații pe fiecare editor `5.1.0`, atât pe cel care a făcut-o, cât și pe fiecare editor care o primește. Un editor mai vechi își păstrează trasarea activă pe parcursul ei.

Păstrați fiecare editor dintr-o sesiune, precum și orice store [replicationStore](./remote-storage.md#dispatch-dispatchsync) care îi stochează documentul, la versiunea `5.1.0` sau la o versiune ulterioară, astfel încât editările făcute în același moment să ajungă la fel peste tot, cu excepția celor numite în secțiunea [Editări simultane](#concurrent-edits); versiunea `4.2.0` sau una ulterioară este în continuare cea care păstrează numele logice și dicționarele. Un [server MCP](../../mcp/live-and-headless.md#edits-made-at-the-same-moment) anterior versiunii `1.2.0` se numără aici printre editoarele anterioare versiunii `5.1.0`, iar un editor anterior versiunii `5.1.0` nu poate fi legat deloc de o cameră [Yjs](./yjs.md).

Începând cu versiunea `5.1.1`, intrarea unei note într-un [grup de tabele](../../guide/guides/table-groups.md) sau părăsirea acestuia circulă printr-un tip nou de acțiune, `memo.changeGroup`, iar un releu care transmite acțiunile ca atare nu are nevoie de nimic nou pentru el. Se trimite pentru o notă lăsată într-un grup sau în afara lui, pentru un grup nou trasat în jurul unor note afișate care nu aparțin niciunui grup, pentru elementul `Group selected tables` cu note selectate alături de tabele, pentru elementul `Remove from group` cu note în selecție, pentru fiecare notă a unui grup eliminat, pentru apelurile prin care un agent de programare schimbă grupul notelor cu ajutorul [serverului MCP](../../mcp/tools.md#table-groups), precum și pentru anularea și refacerea fiecăreia dintre acestea. O adăugare prin `Import and Add` sau `setSchemaJSON` ale cărei grupuri conțin note o trimite și ea, la fel și refacerea ei, în timp ce anularea ei doar elimină acele note.

Un editor sau o replică anterioară versiunii `5.1.1` ignoră `memo.changeGroup`, iar parsarea sa elimină câmpul `groupId` al fiecărei note, așa că nu vede niciodată o notă într-un grup, deși tragerea unui grup într-un editor `5.1.1` mută în continuare și acolo notele grupului, pentru că trimite și un `memo.moveTo` pentru fiecare dintre ele. Propriile sale editări nu știu nimic despre grupurile notelor, cu următoarele efecte asupra editoarelor mai noi:

- O notă pe care o trage în chenarul unui grup rămâne în afara grupului, iar o notă membră pe care o trage în afara chenarului rămâne în grup, chenarul extinzându-se în jurul ei.
- Tragerea unui grup făcută pe el, la fel ca o comandă `Auto Layout` rulată pe el, mută grupul și tabelele lui, dar lasă notele grupului pe loc, iar chenarul se extinde pentru a le cuprinde acolo pe cele afișate.
- Un import făcut cu `Import and Add` pe el nu pune nicio notă în grupurile pe care le adaugă.
- Un grup pe care îl elimină lasă câmpul `groupId` al fiecărei note a sale numindu-l: notele apar ca fiind fără grup, iar anularea eliminării, făcută pe el, le pune înapoi în grup.
- Anularea unei încărcări, a unui import sau a unui apel `clear()` pe el încarcă propria lui copie a documentului pe toate editoarele, iar acea copie nu are nicio notă în vreun grup.

Un document salvat de un astfel de editor nu are nicio notă în vreun grup, deși unul din versiunea `4.0.0` încoace îi păstrează grupurile tabelelor.  
Păstrați fiecare editor dintr-o sesiune, precum și orice store [replicationStore](./remote-storage.md#dispatch-dispatchsync) care îi stochează documentul, la versiunea `5.1.1` sau la o versiune ulterioară pentru a păstra notele în grupurile lor de tabele; versiunea `5.1.0` sau una ulterioară rămâne cea care rezolvă editările făcute în același moment. Un [server MCP](../../mcp/installation.md#updating) anterior versiunii `1.2.1` nu vede și nu păstrează nici el în ce grup de tabele se află o notă.

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
Începând cu versiunea `4.2.0`, fiecare utilizator poate vedea un alt [mod de afișare a numelor](../../guide/guides/logical-names.md#collaborators) cât timp blocarea acestuia este activată sau după o schimbare proprie a unui editor doar în citire. O celulă activă pe care modul dumneavoastră de afișare nu o desenează este subliniată pe celula pe care acesta o desenează în locul ei: numele și numele logic își țin locul unul altuia, la fel ca tipul de date și domeniul.  
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
Atunci când un lot conține cererea de registre a altui editor, așa cum trimite primul [subscribe](#subscribe) al unui participant care se alătură, store-ul răspunde prin abonații săi cu registrele și marcajul său de versiune, cu excepția cazului în care nu are registre.  
Începând cu versiunea `5.1.0`, trimite mai întâi fiecare lot de flux pe care îl mai reține, așa cum face [flushStreamBuffers](#flushstreambuffers), astfel încât fiecare marcaj de versiune din răspunsul său să se sprijine pe o scriere trimisă deja celorlalți. Sosirea unui participant face deci ca fiecare editor din sesiune să trimită imediat o tragere, o derulare, un zoom, o schimbare de culoare sau o redimensionare a unei note pe care o mai reține.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Se abonează la modificările din editor.  
Nimic nu iese din editor până nu există cel puțin un abonat, iar modificările făcute înainte de acel moment sunt reținute în memoria tampon.  
Primul apel subscribe le cere și celorlalte editoare registrele lor de colaborare, care rezolvă [editările simultane](#concurrent-edits), astfel încât un participant care se alătură târziu le rezolvă în același mod.  
Apelul nu aduce documentul, așa că [inițializați](#seeding-a-collaborator) mai întâi participantul care se alătură târziu; începând cu versiunea `5.1.0`, inițializarea poate transporta și registrele.  
Începând cu versiunea `4.0.0`, store-ul le cere din nou de fiecare dată când metoda `setInitialValue`, sau, începând cu versiunea `5.1.0`, metoda [reseed](#reseed), încarcă un document în editorul său după acel prim apel subscribe.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Trimite acum loturile de flux pe care acest store le reține încă, în loc să le trimită după perioada lor de inactivitate.  
Începând cu versiunea `3.9.2`, funcționează pe un store obținut din `getSharedStore`; în versiunea `3.9.1`, metoda apare în definiția de tip, dar nu face nimic.  
Mutarea unui tabel, a unei note sau a unui grup de tabele, schimbarea culorii acestuia, redimensionarea unei note și derularea sau zoomul vizualizării se fac fiecare ca flux de modificări mici. Redimensionarea unui grup de tabele nu se face așa: se trimite o singură dată, când se termină glisarea.  
Store-ul adună fiecare flux într-un singur lot și îl reține până când fluxul rămâne inactiv timp de 200 ms, în două etape. O schimbare de culoare sau o redimensionare a unei note trece prin ambele, așa că pleacă la aproximativ 400 ms după ultima modificare, așa cum pleca fiecare flux înainte de versiunea `5.1.0`. Începând cu versiunea `5.1.0`, o tragere, o derulare sau un zoom pleacă după prima etapă, la aproximativ 200 ms după ultimul său pas, sub forma locului în care ajunge (consultați [Editări simultane](#concurrent-edits)).  
Un apel încheie această așteptare în ambele etape. Cât timp store-ul este conectat, un abonat primește lotul înainte ca apelul să returneze. Dacă nu este reținut nimic, apelul nu trimite nimic.  
Metoda `destroy`, fie cea a store-ului, fie cea a editorului, elimină un lot încă reținut, așa că apelați mai întâi metoda de față atunci când renunțați la un store și celelalte editoare trebuie să păstreze ultima modificare, ca atunci când se închide o filă.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

Începând cu versiunea `5.1.0`, returnează o copie a registrelor de colaborare ale editorului (consultați [Editări simultane](#concurrent-edits)).  
Copia este făcută prin JSON, așa că este un obiect simplu, gata pentru `JSON.stringify`, iar o modificare a ei lasă neschimbate registrele store-ului.  
Transmiteți-o ca atare metodei [mergeLWW](#mergelww) sau [reseed](#reseed) a altui store. Forma ei este cea proprie editorului, așa că nu citiți niciun câmp din ea.  
Citiți-o împreună cu [getVersion](#getversion) și cu proprietatea `runtimeValue` a editorului în același moment pentru a [inițializa un participant care se alătură](#seeding-a-collaborator).

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

Începând cu versiunea `5.1.0`, preia în registrele acestui store registrele pe care un alt store le-a oferit prin [getLWW](#getlww), păstrând pentru fiecare marcajul de versiune mai mare, și preia `version` în ceasul editorului, care păstrează cel mai mare dintre al său și cel dat.  
Nu schimbă nimic în document: niciun octet din `value` sau `runtimeValue`, nicio intrare de anulare și niciun eveniment `change`. Doar ridică marcajele de versiune pe care trebuie să le depășească o scriere ulterioară, așa că o scriere mai veche decât registrele date este refuzată ulterior, iar următoarea editare a editorului poartă un marcaj de versiune peste `version`.  
Nu trimite nimic și nu răspunde la nimic. Este ceea ce primește primul subscribe al unui participant care se alătură din răspunsul celorlalți, preluat direct.  
Apelați-o după `setInitialValue`, niciodată înainte: fiecare `setInitialValue` și fiecare [reseed](#reseed) elimină registrele deținute și, odată cu ele, ceea ce preluase un `mergeLWW` anterior.

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

Începând cu versiunea `5.1.0`, returnează cel mai mare marcaj de versiune pe care l-a încorporat ceasul editorului: cel mai mare dintre marcajele modificărilor pe care le-a făcut sau le-a preluat, ale cererilor de registre și ale răspunsurilor pe care le schimbă o alăturare și ale fiecărui `version` dat metodei `mergeLWW` sau `reseed`.  
Cursoarele, focusul, selecțiile și casetele de selecție, ale sale sau ale altui editor, nu îl mută.  
Transmiteți-l împreună cu [getLWW()](#getlww), citit în același moment, metodei [mergeLWW](#mergelww) sau [reseed](#reseed) a unui participant care se alătură. Este un [marcaj de versiune](#concurrent-edits) ca cele pe care le poartă acțiunile sale.

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

Începând cu versiunea `5.1.0`, elimină imediat cursorul, focusul, selecția și caseta de selecție trimise de editorul cu ID-ul dat, precum și expirarea pe care o aștepta fiecare. Cele ale oricărui alt editor rămân.  
ID-ul este valoarea `meta.editorId` purtată de fiecare acțiune pe care o trimite store-ul partajat al acelui editor. Un ID despre care acest editor nu deține nimic nu schimbă nimic.  
Apelați-o atunci când mecanismul dumneavoastră de transport află că un partener a plecat. Altfel, ce a trimis partenerul rămâne desenat până expiră: cursorul său la 30 de secunde după ultimul primit, focusul și selecția la 90 de secunde după, iar caseta de selecție la 3 secunde după.

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

Începând cu versiunea `5.1.0`, deschide din nou în editor documentul unei sesiuni, așa cum face o realăturare. Legătura [Yjs](./yjs.md) o apelează pentru a deschide documentul unei camere atunci când se leagă de o cameră care a fost inițializată, și din nou la fiecare realăturare, păstrând ecranul odată ce s-a alăturat camerei.  
Încarcă `value` așa cum face [setInitialValue](../erd-editor-element.md#setinitialvalue) și preia `lww` și `version` așa cum face [mergeLWW](#mergelww), astfel încât store-ul deține apoi exact registrele date, iar ceasul său, cel mai mare dintre propriul marcaj de versiune și `version`. De asemenea, golește istoricul anulărilor și, spre deosebire de `setInitialValue`, elimină selecția și focusul, deoarece ele pot numi ceva ce valoarea nu mai conține.  
În afară de derivarea din numele logic descrisă mai jos, nu creează nicio intrare de anulare, nu emite niciun eveniment `change` și nu trimite nicio schimbare. Odată ce store-ul a avut un abonat, trimite cererea de registre pe care o trimite orice astfel de încărcare, pe care un mecanism de transport care a transmis deja registrele o poate elimina, iar, cu [focusTracker](#focustracker) activat, selecția și focusul golite.  
Ca `setInitialValue`, funcționează cât timp [readonly](../erd-editor-element.md#readonly) este setat, renunță la vizualizarea din modul Flux, încheie trasarea unei relații și închide casetele de editare ale notei, ale numelui grupului de tabele și ale celulei, păstrând sau eliminând în același mod ce s-a tastat în ele; un nume pe care îl derivă o celulă de nume logic la închidere din ce a tastat cititorul este o editare obișnuită: trimisă, anulabilă și emisă ca eveniment `change`.

Fără `keepScreen`, ecranul arată ce conține valoarea, ca după `setInitialValue`. Cu `keepScreen: true`, ecranul cititorului este așezat la loc peste documentul încărcat, doar pe acel ecran:

- poziția de derulare și nivelul de zoom, odată ce elementul le-a afișat; unul care nu le-a afișat niciodată sau care a fost încărcat ascuns și nu a mai fost afișat se deschide acolo unde îl pune valoarea, ca la un participant care se alătură târziu;
- fila, atunci când încărcarea a mutat-o, iar pe fila Setări, și fila din care a venit cititorul, pe care o numește o blocare `Canvas Type` activată acolo;
- modul de afișare a numelor și fiecare setare a generatorului de cod pe care cititorul le-a afișat pe cont propriu sub blocarea lor, dar numai atunci când acea blocare era activată înainte de încărcare, este încă activată după ea și deține aceeași valoare blocată. Așa că, dacă între timp un partener a deblocat, a schimbat și a blocat din nou o setare la altă valoare, editorul se deschide pe noua valoare blocată, iar acolo unde blocarea este dezactivată înainte sau după încărcare, el arată valoarea încărcată;
- fiecare setare pe care un cititor doar în citire a schimbat-o pe propriul ecran, indiferent de ce spun blocările.

Nimic din acestea nu este trimis, iar `value` și `runtimeValue` raportează în continuare documentul încărcat. O deblocare ulterioară a unui partener înlocuiește o setare de cod păstrată astfel, ca orice deblocare.  
Următoarea derulare sau următorul zoom al cititorului, făcute cât timp editorul poate edita, fac din nou ale documentului poziția de derulare și nivelul de zoom păstrate și pleacă conduse de locul în care se află ecranul, astfel încât replicile preiau și acel zoom.

O reinițializare lasă neschimbat ce reține store-ul. O tragere, o derulare sau un zoom reținute pleacă după ea, citite din documentul reinițializat; o schimbare de culoare sau o redimensionare a unei note pleacă așa cum a fost făcută, deși editorul nu o mai arată; iar ce a reținut `disconnect()` pleacă la `connection()`.  
Așadar apelați mai întâi [flushStreamBuffers](#flushstreambuffers), trimiteți ce emite și reinițializați cu o valoare care conține acel conținut. Nu reinițializați niciodată cât timp store-ul este deconectat.

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy {#destroy}

Distruge complet instanța sharedStore.  
Editorul însuși rămâne neatins, așa că părăsirea unei sesiuni lasă documentul editabil.  
Funcțiile de urmărire a mouse-ului și a focusului se opresc odată ce este distrusă ultima instanță sharedStore furnizată de editor.  
Un lot de flux pe care store-ul încă îl reține este eliminat odată cu acesta; apelați mai întâi metoda [flushStreamBuffers](#flushstreambuffers) pentru a-l trimite.  
Cursoarele, focusul, selecțiile și casetele de selecție trimise de alte editoare rămân desenate până expiră; începând cu versiunea `5.1.0`, [forgetPeer](#forgetpeer) le elimină imediat pe cele ale unui editor.

```js
sharedStore.destroy();
```
