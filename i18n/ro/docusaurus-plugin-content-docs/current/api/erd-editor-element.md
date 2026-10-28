---
sidebar_position: 2
description: "API-ul elementului erd-editor: înregistrarea lui, atribute, value și runtimeValue, evenimente, teme, limba de afișare, ecranul de bun venit, combinațiile de taste, importul și exportul schemelor."
---

# ErdEditorElement

Editorul este un `HTMLElement` obișnuit, eticheta `<erd-editor>` pe care o definește importul `@dineug/erd-editor/erd-editor.js`.  
Începând cu versiunea `5.0.0`, importul rădăcinii pachetului nu definește nicio etichetă. Rădăcina exportă `ErdEditorElement` atât ca tip al elementului, cât și ca clasă a lui, precum și `defineErdEditor()`, care definește eticheta acolo unde îl apelați; consultați [Înregistrarea elementelor](./installation.md#registering-the-elements).  
Pentru o pagină care doar arată o diagramă, [`<erd-viewer>`](./erd-viewer-element.md) este un element doar în citire de sine stătător.

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
```

Definiția sa de tip este următoarea.

```ts
interface ErdEditorElement extends HTMLElement {
  readonly: boolean;
  systemDarkMode: boolean; // system dark/light auto
  enableThemeBuilder: boolean;
  enableLocalePicker: boolean;
  enableWelcomeScreen: boolean;
  value: string;
  readonly runtimeValue: string;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  destroy: () => void;
  setInitialValue: (value: string) => void;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => void;
  setSystemLocale: (locale: string | null) => void;
  setKeyBindingMap: (
    keyBindingMap: Partial<
      Omit<
        KeyBindingMap,
        | 'edit'
        | 'stop'
        | 'undo'
        | 'redo'
        | 'zoomIn'
        | 'zoomOut'
        | 'zoomReset'
      >
    >
  ) => void;
  setSchemaSQL: SetSchema;
  setSchemaGraphQL: SetSchema;
  setSchemaDBML: SetSchema;
  setSchemaAML: SetSchema;
  setSchemaJSON: (
    value: string,
    options?: { mode?: 'replace' | 'append' }
  ) => void;
  getSchemaSQL: (
    databaseVendor?: DatabaseVendor,
    options?: SchemaSQLOptions
  ) => string;
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
  setDiffValue: (value: string) => void;
}
```

Editorul se redă într-un shadow root închis, așa că `editor.shadowRoot` este `null`, iar stilurile nu trec nici dinspre pagină în editor, nici invers.  
Nimic din interior nu poate fi accesat cu un selector: stilizați-l în schimb prin [setTheme](#settheme) și proprietățile personalizate CSS `--erd-editor-*`.

Singurele atribute sunt `readonly`, `system-dark-mode`, `enable-theme-builder`, `enable-locale-picker` și `enable-welcome-screen`, iar toate cinci au valoarea implicită `false`. Ultimele două au apărut în versiunea `4.0.0`. Fiecare își citește valoarea așa cum se descrie la [readonly](#readonly).

Începând cu versiunea `4.1.0`, fila ERD are un [explorator](../guide/guides/explorer.md), un arbore al diagramei andocat în stânga pânzei, cu funcția Găsire și înlocuire în partea de sus. Niciun atribut, nicio proprietate, metodă sau eveniment nu îl deschide, nu îl închide și nu îi raportează starea: se deschide din butonul `Explorer` al barei de instrumente, din comanda `Toggle Explorer` din căutarea rapidă sau din meniul contextual al pânzei ori cu combinația de taste [`findReplace`](#setkeybindingmap).  
Fiecare element pornește cu exploratorul închis. Starea sa (deschis sau închis), lățimea, restrângerile și căutarea se păstrează cât timp există elementul, peste schimbările de filă și peste orice încărcare, inclusiv `setInitialValue`, și nu ajung niciodată în `value`, `runtimeValue`, istoricul anulărilor sau un store partajat.

Începând cu versiunea `4.2.0`, tabelele și coloanele pot avea [nume logice](../guide/guides/logical-names.md) pe lângă numele lor, iar modul de afișare a numelor, o setare a documentului ca și fila, decide dacă pânza desenează numele lor, numele lor logice sau pe amândouă.  
Bara de instrumente are și fila [Dicționar](../guide/guides/dictionary.md), între `Code Generator` și `Settings`, care conține cuvintele, termenii și domeniile documentului, precum și foaia `Checks`. Este o filă ca celelalte: valoarea sa `canvasType`, `'@dineug/erd-editor/builtin-dictionary'`, este cuprinsă de blocarea `Canvas Type`, așa că un text salvat pe această filă se deschide pe ea prin [setInitialValue](#setinitialvalue), iar o trecere la ea se scrie în `value` și emite [change](#change) numai cât timp acea blocare este dezactivată. Niciun atribut, nicio proprietate, metodă sau eveniment propriu nu o deschide și nu îi raportează starea. Editările din ea sunt modificări ale documentului: se află în `value`, emit [change](#change) și ajung la colaboratori, dar anularea și refacerea lor se execută pe istoricul propriu al fiecărei foi, nu pe cel al documentului.  
Starea proprie a filei – foaia afișată, inițial `Domains`, precum și căutarea, selecția, derularea și lățimile coloanelor fiecărei foi – se păstrează cât timp există elementul, peste schimbările de filă și peste orice încărcare, și nu ajunge niciodată în `value`, `runtimeValue`, un istoric al anulărilor sau un store partajat.  
Interfața `ErdEditorElement` nu primește niciun membru nou. API-ul adaugă opțiunea `logicalNameAsComment` a metodei [getSchemaSQL](#getschemasql), douăsprezece [tokenuri de temă](#settheme) și exportul [dictionaryRowChords](#dictionaryrowchords).

## readonly {#readonly}

Setează capacitatea de editare a editorului.  
Cât timp este setat, atribuirea proprietății `value`, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, `setSchemaJSON()`, anularea și refacerea (începând cu versiunea `4.2.0`, inclusiv cele dintr-o foaie a filei Dicționar) sunt toate ignorate, iar evenimentul `change` nu este emis niciodată. Încărcați în schimb un document cu [setInitialValue](#setinitialvalue).  
Începând cu versiunea `5.0.0`, un editor doar în citire este un cititor, nu un editor cu controalele dezactivate. Păstrează cele șase file, [exploratorul](../guide/guides/explorer.md#read-only-editors), minihârta, căutarea rapidă, Proprietăți tabel, [Diff Viewer](../guide/guides/table-related-functions.md#diff-viewer), `Export`, modul Zen și cursoarele, focusurile și selecțiile colaboratorilor, iar fiecare control care ar edita diagrama este omis, nu desenat dezactivat. Înainte de `5.0.0`, multe dintre controalele sale de editare erau încă desenate, iar editorul renunța la ce trimiteau ele.

În fila ERD, o tragere deplasează pânza oriunde ar începe, inclusiv pe un tabel, iar o apăsare nu selectează, nu mută și nu deschide nimic. Cursorul oprit pe un tabel luminează relațiile acestuia, un clic fără mișcare pe un tabel sau pe o relație păstrează acea luminare, iar un clic fără mișcare oriunde în altă parte o stinge, ca în [`<erd-viewer>`](./erd-viewer-element.md). Singura selecție este conturul pe care îl lasă un salt: mergând la un rând din explorator, la una dintre potrivirile sale Find sau la un rezultat al căutării rapide după `#`, `@` sau `:`, se selectează ceea ce ajunge acolo, iar următorul clic fără mișcare o șterge. Copierea copiază ce conține acea selecție.  
[Bara de instrumente a pânzei](../guide/guides/table-related-functions.md#canvas-toolbar) păstrează `Zoom out`, nivelul de zoom (`Reset zoom`), `Zoom in`, lista Name View, `Zen Mode` și busola, fără `Hand` sau `Select`, fără `New Table`, `New Memo` sau `New Table Group` și fără butoanele pentru relații. Meniul pânzei păstrează `View Option`, `Name View`, `Export` și `Diff Viewer`, meniul tabelului păstrează `Table Properties`, iar o notă, o relație sau un grup de tabele nu deschide niciun meniu. Căutarea rapidă din fila ERD nu listează niciun rând care scrie în diagramă: păstrează `Tab`, `Name View`, `Database`, `Export`, `Toggle Explorer`, rândurile `Theme` și `Display Language` pe care le activează [enableThemeBuilder](#enablethemebuilder) și [enableLocalePicker](#enablelocalepicker), precum și căutările `#`, `@` și `:`. În celelalte file listează ce listează într-un editor editabil. Bara de instrumente afișează numele bazei de date ca text și nu are butoanele `Undo`, `Redo` sau `Time Travel`.  
Nimic nu oferă `Import`, [`Import and Add`](../guide/guides/file-import-export.md#import-and-add), `Auto Layout`, un rând de grup de tabele (consultați [Grupuri de tabele](../guide/guides/table-groups.md#read-only-editors)) sau [`Map Columns`](../guide/guides/relationship-editing.md#map-columns), iar [ecranul de bun venit](#enablewelcomescreen) nu apare.  
Combinațiile de taste care adaugă, șterg sau editează nu fac nimic: `edit`, `addTable`, `addColumn`, `addMemo`, `addTableGroup`, `groupSelectedTables`, `removeTable`, `removeColumn`, `removeSelection`, `primaryKey`, `selectAllTable`, `selectAllColumn`, cele patru combinații pentru relații și `handTool`, fiecare în continuare cu comportamentul implicit împiedicat, așa cum o spune opțiunea sa. Nici o lipire și nici `Tab` nu fac nimic și ajung la pagină fără să fie împiedicate. Combinațiile de zoom, `zenMode`, `focusView`, `tableProperties` pe tabelul selectat de un salt, `search`, `findReplace`, copierea, `Escape` și tastele săgeți continuă să funcționeze. Nu se deschide niciun editor de celulă, de nume de notă sau de nume de grup de tabele și nu se desenează nicio relație.

[Găsire și înlocuire](../guide/guides/find-and-replace.md#read-only-editors) din partea de sus a exploratorului doar caută, fără săgeata `Toggle Replace` și fără rândul Înlocuire. Panoul are titlul `Explorer`, iar sfatul ecran al butonului din bara de instrumente este `Explorer (Ctrl + F)` (Windows/Linux) sau `Explorer (⌘ + F)` (Mac) în orice editor. Exploratorul se deschide într-un editor doar în citire începând cu versiunea `4.1.0`; de la versiunea `3.10.0` până la versiunea `4.0.0`, Găsire și înlocuire se deschidea acolo ca un panou flotant doar pentru căutare, cu titlul `Find`.  
Proprietăți tabel se deschide din meniul tabelului sau cu combinația `tableProperties` și, începând cu versiunea `3.10.0`, afișează insigna `Read only` lângă titlu, iar fila sa `Indexes` nu permite modificări (consultați [Proprietăți tabel](../guide/guides/table-related-functions.md#table-properties)).  
Fila Setări poartă aceeași insignă `Read only` și afișează fiecare setare într-un control care nu primește apăsări: cele două comutatoare, câmpul `Maximum comment width` și cele șapte butoane `Lock` sunt dezactivate, iar rândurile `Column Order` nu pot fi trase. Scripturile `Before tables` și `After tables` din fila Schemă SQL nu primesc text. Fila [Vizualizare](../guide/guides/visualization.md) funcționează ca într-un editor editabil, deoarece nimic din ea nu editează documentul; comenzile `Previous table` și `Next table` din modul Flux fac în continuare pași înapoi și înainte, prin butoanele lor sau cu tastele de anulare și refacere.  
Fila [Dicționar](../guide/guides/dictionary.md#read-only-editors) se deschide în continuare: se poate trece de la o foaie la alta, în foi se poate căuta, selecta, derula și copia, iar un rând din foaia `Checks` duce în continuare la ceea ce numește. Nicio celulă nu acceptă o editare, o lipire sau o golire, fila nu afișează instrumentele `Add Row`, `Delete Rows`, `Import CSV` sau `Export CSV` și niciun meniu pe grilă, iar combinațiile sale pentru rânduri nu inserează și nu șterg nimic. Meniul tabelului, meniul pânzei și căutarea rapidă nu oferă comanda [`Derive Physical Names Again`](../guide/guides/dictionary.md#derive-physical-names-again) sau `Derive Physical Name Again`.

Începând cu versiunea `5.0.0`, setările pe care un cititor le poate schimba în continuare rămân pe ecranul acelui editor: derularea și zoom-ul, fila, baza de date, limbajul Code Generator, ambele stiluri de denumire, tipul de delimitator, rândurile `View Option` și [modul de afișare a numelor](../guide/guides/logical-names.md#read-only-editors) din fiecare dintre selectoarele sale, care rămâne pe ecran încă din `4.2.0`. Indiferent de [blocările](../guide/guides/settings.md#lock) lor, niciuna nu ajunge în `value`, `runtimeValue`, exportul `json`, istoricul de anulare, evenimentul [change](#change) sau un store partajat, așa că `value` păstrează setările documentului oricum ar privi cititorul diagrama. Panourile de opțiuni [Schemă SQL](../guide/guides/schema-sql.md#read-only-editors) și Code Generator denumesc aceste setări `This window only` cât timp `readonly` este setat, acolo unde într-un editor editabil scrie `Saved in the document`. Ceea ce afișează, copiază și salvează cele două file urmează ecranul, la fel și [getSchemaSQL](#getschemasql) apelat fără un sistem de baze de date.  
Înainte de `5.0.0`, derularea, zoom-ul, comutarea de filă, baza de date și setările de cod ale unui cititor ajungeau în `value` cât timp nicio blocare nu le ținea, ceea ce baza de date nu are niciodată, iar un store partajat le trimitea celorlalte editoare.  
Opțiunile `This window only` din fila Schemă SQL, `Statements`, `Header`, `Write logical names into empty comments` (începând cu versiunea `4.2.0`) și `Tables`, nu se salvează niciodată în niciun editor și se aplică în continuare, la fel ca și caseta de dialog [`Export image`](../guide/guides/file-import-export.md#image), configuratorul de teme și selectorul de limbă de afișare. O alegere în configuratorul de teme sau în selectorul de limbă de afișare emite în continuare [changePresetTheme](#changepresettheme) sau [changeLocale](#changelocale).

Cât timp este setat, nimic nu intră în istoricul de anulare, nici măcar o derulare sau un zoom, iar un [store partajat](#getsharedstore) al editorului nu trimite nicio schimbare: doar ce trimit trackerele sale despre cursorul, focusul, selecția și chenarul de tragere ale cititorului și registrele pe care le cere un alt editor când se alătură (consultați [Editare colaborativă](./advanced/collaborative-editing.md)). Aplică în continuare fiecare schimbare trimisă de ceilalți. O schimbare a bazei de date, a unei setări Code Generator sau a unui rând `View Option` ajunge în document, iar pe ecran ajunge și ea, cu excepția cazului în care cititorul a schimbat acolo setarea respectivă, iar o schimbare partajată a modului de afișare a numelor apare pe ecran în ambele cazuri.

Activarea sa încheie ce era deschis: un editor de celulă, de nume de notă sau de nume de grup de tabele, o relație în curs de desenare, o tragere de tabel, notă, grup de tabele sau coloană, copiile unei trageri cu Alt, o redimensionare de notă sau de grup de tabele, o previzualizare sau o plasare Auto Layout încă în curs, `Map Columns`, Time Travel și selectorul de culori. Șterge selecția, lasă jos instrumentul mână și trimite mai întâi ce mai ține fiecare store partajat din tragere sau din derulare, așa cum face [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers). Proprietăți tabel, acum doar în citire, Diff Viewer și dialogul `Export image` rămân deschise, iar derularea, zoom-ul, fila și modul de afișare a numelor rămân așa cum erau. Un element care este doar în citire la prima montare pornește la fel, iar unul pe care o gazdă îl mută în pagină păstrează conturul lăsat de un salt.  
Dezactivarea sa readuce controalele de editare, fără nimic selectat sau deschis. Baza de date, limbajul Code Generator, ambele stiluri de denumire, tipul de delimitator și rândurile `View Option` revin la cele ale documentului, în timp ce derularea, zoom-ul, fila și modul de afișare a numelor rămân unde le-a lăsat cititorul, iar `value` le păstrează pe cele ale documentului până când cititorul le schimbă din nou. Nici una dintre cele două schimbări nu emite `change`.
Un atribut fără valoare, `=""` și `="true"` se citesc toate ca `true`. `="false"` se citește ca `false`, la fel ca orice alt șir de caractere, inclusiv idiomul HTML `readonly="readonly"`.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode {#systemdarkmode}

Determină dacă editorul se sincronizează automat cu modul întunecat/luminos al sistemului.  
Începând cu versiunea `4.0.0`, activarea sa setează câmpul `appearance` al temei la `'system'`, așa cum face `setPresetTheme({ appearance: 'system' })`. Editorul afișează apoi aspectul luminos sau întunecat raportat de sistemul de operare ori cel indicat de [setSystemAppearance](#setsystemappearance) și comută atunci când acesta se schimbă.  
Un apel ulterior [setPresetTheme](#setpresettheme) cu `'light'` sau `'dark'` ori alegerea `Light` sau `Dark` în configuratorul de teme sau în căutarea rapidă înlocuiește `'system'` și rămâne: următoarea schimbare a sistemului de operare nu îl mai suprascrie, deși `systemDarkMode` este încă `true`. Înainte de versiunea `4.0.0`, următoarea schimbare a sistemului de operare îl suprascria.  
Dezactivarea sa cât timp aspectul este `'system'` păstrează aspectul luminos sau întunecat afișat în acel moment. Dezactivarea sa după ce aspectul a fost schimbat de la `'system'` îl lasă neschimbat.  
Modificarea sa nu emite niciun eveniment.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder {#enablethemebuilder}

Determină dacă este oferită o interfață care simplifică setarea temelor predefinite.  
Afișează butonul `Theme` din bara de instrumente, care deschide configuratorul de teme cu `Accent color`, `Gray color` și `Appearance`. Începând cu versiunea `4.0.0`, opțiunea `Appearance` oferă `System` alături de `Light` și `Dark`, iar cât timp această proprietate este activată, căutarea rapidă listează `Theme` cu `System`, `Light` și `Dark`. Consultați [Limbă și temă](../guide/guides/language-and-theme.md).

![Deschiderea configuratorului de teme din bara de instrumente, alegerea culorii de accent și a tonului de gri și comutarea aspectului la Light, apoi la System](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

Schimbarea temei predefinite din acest panou sau din căutarea rapidă emite evenimentul [changePresetTheme](#changepresettheme).

## enableLocalePicker {#enablelocalepicker}

Începând cu versiunea `4.0.0`, determină dacă este oferită o interfață pentru alegerea limbii de afișare a editorului.  
Afișează butonul `Display Language` din bara de instrumente, după `Theme` când sunt afișate amândouă. Butonul deschide selectorul de limbă de afișare, iar căutarea rapidă listează `Display Language`. Ambele oferă `System` și cele 25 de limbi (consultați [Limbă și temă](../guide/guides/language-and-theme.md)).  
Decide și ce afișează un editor înainte ca metoda [setLocale](#setlocale) să fie apelată sau să fie aleasă o limbă: `'system'` cât timp este activată, engleza cât timp este dezactivată, așa că un element care nu configurează nimic păstrează engleza pe care a afișat-o mereu. Activarea sau dezactivarea sa comută imediat între cele două. După ce o limbă a fost setată sau aleasă, acea alegere rămâne, indiferent dacă proprietatea este activată sau dezactivată.  
Setați-o înainte ca elementul să fie adăugat în DOM, pentru ca primul cadru să urmeze `'system'`.  
O alegere emite [changeLocale](#changelocale).

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen {#enablewelcomescreen}

Începând cu versiunea `4.0.0`, determină dacă o diagramă goală îl întâmpină pe cititor cu [ecranul de bun venit](../guide/guides/editing-start.md#welcome-screen).  
Acesta stă deasupra filei ERD cât timp documentul nu are niciun tabel, nicio notă afișată și niciun grup de tabele afișat. Nu este afișat cât timp atributul `readonly` este setat, în modul Zen sau cât timp este deschis panoul Proprietăți tabel, vizualizatorul de diferențe, călătoria în timp sau previzualizarea aranjării automate. Primul tabel, prima notă afișată sau primul grup de tabele afișat îl face să dispară, iar o anulare care readuce diagrama la starea goală îl face să reapară.  
Rândurile sale `New Table`, `New Memo` și `Command Palette` afișează prima combinație din `addTable`, `addMemo` și `search` așa cum le-a lăsat [setKeyBindingMap](#setkeybindingmap) și niciuna pentru un nume lăsat gol. Săgețile sale indică butoanele `Theme` și `Display Language` numai acolo unde `enableThemeBuilder` și `enableLocalePicker` le afișează.  
În meniul său, tastele `↑`, `↓`, `Home` și `End` trec de la un rând la altul și sunt împiedicate și oprite. Tastele `Enter` și `Space` sunt oprite, nu împiedicate, așa că le preia rândul activ, iar tasta `Escape` în lista formatelor `Import` duce înapoi, fiind împiedicată și oprită. Orice altă tastă ajunge ca de obicei la editor și la pagină.  
Nu schimbă nimic în document, așa că lasă `value` neschimbat și nu emite niciun eveniment `change`.  
Activați-o după ce [setInitialValue](#setinitialvalue) a încărcat documentul, așa cum fac aplicațiile gazdă oficiale, pentru ca ecranul să nu apară niciodată, nici măcar o clipă, peste un fișier care încă se încarcă.

```js
editor.enableWelcomeScreen = true;
// or
editor.setAttribute('enable-welcome-screen', 'true');
```

```html
<erd-editor enable-welcome-screen></erd-editor>
```

## value {#value}

### getter {#getter}

Returnează documentul curent ca șir de caractere JSON, în [schema](./advanced/schema.md) definită de editor.  
Începând cu versiunea `4.0.0`, este forma de stocare, documentul așa cum îl conține un fișier, adică și ceea ce scrie exportul `json` și ceea ce salvează aplicațiile gazdă oficiale. Conține doar entitățile existente, fără cele eliminate, fără ordinea de suprapunere și fără ceea ce editorul calculează singur, de exemplu lățimile măsurate, marcajele de cheie și punctele de ancorare ale relațiilor. Cheile entităților apar într-o ordine fixă, textul este indentat cu două spații și se termină cu un caracter de linie nouă, așa că același document dă mereu aceiași octeți.  
Începând cu versiunea `4.2.0`, omite și ceea ce este gol: o listă `doc` goală, o colecție goală, un rând de dicționar care nu conține nimic și un câmp de text gol al unei entități, de exemplu un nume, un comentariu, un tip de date, o valoare implicită sau o culoare. O listă din interiorul unei entități, de exemplu `columnIds` al unui tabel, se scrie în continuare și când este goală. Câmpul `doc` al unui document nou este `{}`, iar documentul nu are `collections`, așa că tratați ca fiind goale câmpurile, listele și colecțiile care lipsesc. Conține numele logice și indicatorii de nume derivat ai tabelelor și coloanelor, legăturile coloanelor cu domeniile, precum și cuvintele, termenii și domeniile, fiecare dicționar fiind scris ca un antet cu numele câmpurilor urmat de rândurile sale, câte un rând pe linie, în ordinea din foaie. Consultați [Forma de stocare și valoarea de execuție](./advanced/schema.md#storage-form-and-runtime-value).  
Fiecare setare a cărei [blocare](../guide/guides/settings.md#lock) este activată se scrie cu valoarea la care este blocată, nu așa cum o arată ecranul. Blocarea `Viewport` cuprinde `originX`, `originY` și `zoomLevel`, iar `Canvas Type`, `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` și, începând cu versiunea `4.2.0`, `Name View` cuprind fiecare propria setare. Modul de afișare a numelor se scrie ca `nameViewMode` și numai cât timp nu este `'physical'`. Orice altă setare se scrie așa cum este, iar `lockSettings` se scrie întotdeauna. Pentru biți, consultați [Settings](./advanced/schema.md#settings); bitul blocării `Name View` se citește invers.  
Începând cu versiunea `5.0.0`, setările pe care le schimbă cititorul unui editor [doar în citire](#readonly) se scriu tot la valorile documentului, blocate sau nu, deoarece rămân pe acel ecran.  
Un document nou are toate blocările activate, fie că este cel pe care un element îl afișează înainte de a primi o valoare, fie unul încărcat dintr-o valoare goală. Proprietatea sa `value` păstrează originea la `0, 0`, nivelul de zoom la `1`, fila ERD, limbajul implicit al generatorului de cod, stilurile de denumire implicite și tipul de delimitator implicit, precum și, începând cu versiunea `4.2.0`, modul `Physical Names`, până când blocarea corespunzătoare este dezactivată.
Înainte de versiunea `4.0.0`, returna întregul document așa cum îl deținea editorul, cu `ignoreSaveSettings` aplicat. Documentul așa cum îl deține editorul este acum [runtimeValue](#runtimevalue), iar `ignoreSaveSettings` nu mai este citit sau scris.

```js
const data = editor.value;
```

### setter {#setter}

Încarcă o stare a editorului salvată anterior. Înlocuiește întregul document: cel curent este golit mai întâi. Începând cu versiunea `4.2.0`, aceasta include cuvintele, termenii și domeniile: documentul le preia pe cele pe care le conține textul sau rămâne fără ele, iar istoricul propriu al fiecărei foi din fila Dicționar este golit.  
La fel ca `clear()`, `setInitialValue()` și metodele `setSchema*` în modul lor implicit `mode: 'replace'`, elimină și vizualizarea Flux a filei Vizualizare: aranjarea, tabelele la care este restrânsă, afișarea rândurilor, zoomul și deplasarea, precum și, începând cu versiunea `4.2.0`, tabelele prin care trec `Previous table` și `Next table`. O adăugare (`mode: 'append'`) nu o elimină.  
Se înregistrează în istoric, permițând `Undo, Redo`, și emite `change`.  
Acceptă forma de stocare, o valoare [runtimeValue](#runtimevalue) sau un fișier salvat de o versiune anterioară.  
Un șir gol sau orice nu este șir de caractere încarcă un document nou în loc să genereze o eroare, așa că verificați valoarea înainte de a o atribui.  
Acest document nou este cel cu care pornește `setInitialValue('')`: gol, cu setările implicite și, începând cu versiunea `4.0.0`, cu toate blocările activate. În versiunile `3.10.x` nu salva nici poziția de derulare, nici nivelul de zoom, iar înainte de acestea le salva pe amândouă.  
Un store partajat retransmite această încărcare colaboratorilor cu JSON-ul complet al noului document, așa că fiecare partener, inclusiv unul cu o versiune mai veche, îl încarcă, deși un editor anterior versiunii `4.2.0` renunță la ceea ce nu cunoaște, de exemplu numele logice, legăturile cu domeniile și dicționarele (consultați [Combinarea versiunilor](./advanced/collaborative-editing.md#mixing-releases)).  
Începând cu versiunea `4.0.0`, blocările documentului încărcat și valorile blocate pe care le scrie apoi `value` provin din text, iar vizualizarea ajunge acolo unde o plasează textul sau pe diagramă când nicio parte a acesteia nu este desenată acolo. Pentru fiecare altă setare blocată de text – fila, limbajul generatorului de cod, stilurile de denumire, tipul de delimitator și, începând cu versiunea `4.2.0`, modul de afișare a numelor – editorul continuă să afișeze ce afișa înainte de încărcare. O setare pe care textul o lasă deblocată preia valoarea din text. Un fișier salvat înainte de versiunea `4.2.0` nu numește blocarea `Name View`, cu excepția cazului în care un editor cu versiunea `4.2.0` a dezactivat această blocare în el, așa că se încarcă cu modul de afișare blocat la `Physical Names`, iar editorul păstrează modul de afișare pe care îl afișa. [setInitialValue](#setinitialvalue) preia în schimb toate valorile din text; consultați-o și pentru un text care nu numește nicio blocare.  
Nici un text care nu este JSON, de exemplu un fișier rămas cu marcaje de conflict de îmbinare, nu generează o eroare: documentul este golit, setările sale rămân cum erau, iar eroarea de parsare este scrisă în consolă.  
Atribuirea este ignorată cât timp `readonly` este setat; folosiți [setInitialValue](#setinitialvalue) pentru a încărca un document într-un editor doar în citire.

```js
editor.value = 'json...';
```

## runtimeValue {#runtimevalue}

Începând cu versiunea `4.0.0`, returnează documentul așa cum îl deține acest editor, ca șir de caractere JSON. Nu are setter, așa că atribuirea sa aruncă o excepție în codul care rulează în modul strict.  
Conține ceea ce [value](#value) omite: entitățile eliminate și ordinea lor, ordinea de suprapunere, lățimile măsurate, marcajele de cheie, punctele de ancorare ale relațiilor și secvențele, iar, începând cu versiunea `4.2.0`, câmpurile de text, listele `doc` și colecțiile care sunt goale; rândurile eliminate dintr-o foaie a filei Dicționar și cele care nu conțin nimic; cheia de ordine a fiecărui rând de dicționar; listele `doc` ale cuvintelor, termenilor și domeniilor; și o legătură cu un domeniu eliminat. Și aici setările blocate se scriu cu valorile lor blocate.  
Folosiți-o pentru a inițializa, prin metoda sa [setInitialValue](#setinitialvalue), un alt editor care se alătură unei sesiuni deja în desfășurare, de exemplu un colaborator sau o a doua vizualizare a aceluiași document. O anulare a unei eliminări pe care sesiunea o trimite ulterior restaurează atunci acolo entitatea întreagă, în timp ce un editor inițializat din `value` nu conține nicio entitate eliminată și restaurează în schimb un tabel gol, fără nume, sau, începând cu versiunea `4.2.0`, un rând de dicționar gol. Consultați [Editare colaborativă](./advanced/collaborative-editing.md).  
Nimic nu mai colectează entitățile eliminate, așa că ele rămân în această valoare până la următoarea deschidere a documentului din fișierul său.  
Nu o scrieți niciodată într-un fișier: salvați `value`, pe care [JSON Schema](./advanced/schema.md#json-schema) îl acceptă, spre deosebire de aceasta.

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue {#setinitialvalue}

Încarcă o stare a editorului salvată anterior. Încărcarea în sine nu se înregistrează în istoric, așa că nu poate fi anulată, și nu se emite niciun eveniment `change`.  
Golește și istoricul anulărilor, așa că nimic din ce s-a făcut înainte de încărcare nu poate fi anulat sau refăcut peste documentul încărcat, iar, începând cu versiunea `4.2.0`, golește și istoricul propriu al fiecărei foi din fila Dicționar.  
Acceptă forma de stocare, o valoare [runtimeValue](#runtimevalue) sau un fișier salvat de o versiune anterioară și, spre deosebire de atribuirea proprietății `value`, preia toate setările din text, inclusiv fila și setările de cod.  
Un șir gol sau orice nu este șir de caractere încarcă un document nou în loc să genereze o eroare, așa că `setInitialValue('')` pornește o diagramă goală.  
Începând cu versiunea `4.0.0`, acest document nou, care este și ceea ce afișează un element înainte de a primi vreo valoare, are toate blocările activate. Derularea, zoomul, schimbarea filelor și modificarea limbajului generatorului de cod, a stilurilor de denumire, a tipului de delimitator sau, începând cu versiunea `4.2.0`, a modului de afișare a numelor lasă `value` neschimbat și nu emit niciun `change`. În versiunile `3.10.x` nu salva nici poziția de derulare, nici nivelul de zoom, iar înainte de acestea le salva pe amândouă.  
Un document încărcat din text păstrează blocările pe care le numește. Unul care nu numește niciuna – orice fișier salvat înainte de versiunea `4.0.0`, oricare ar fi fost valoarea `ignoreSaveSettings`, și un fișier `.vuerd` v2 – se deschide cu toate blocările activate, cu setarea `Viewport` blocată la originea `0, 0` și la nivelul de zoom `1`, pe fila ERD, cu limbajul, stilurile de denumire și tipul de delimitator așa cum le-a salvat.  
Începând cu versiunea `4.2.0`, un text care își numește blocările, dar nu și blocarea `Name View`, se deschide și cu această blocare activată, chiar și când toate celelalte blocări sunt dezactivate. Un fișier salvat înainte de versiunea `4.2.0` este un astfel de text, cu excepția cazului în care un editor cu versiunea `4.2.0` a dezactivat această blocare în el (consultați [Settings](./advanced/schema.md#settings)). Se deschide în modul `Physical Names`, la fel ca unul care nu numește nicio blocare.  
În ambele cazuri, vizualizarea se deschide la vizualizarea documentului – cea salvată în text când acesta își numește blocările, originea `0, 0` la nivelul de zoom `1` când nu numește niciuna – sau pe diagramă când nicio parte a acesteia nu este desenată acolo. O setare `Viewport` blocată își păstrează în continuare valorile blocate în `value`.  
Începând cu versiunea `4.0.0`, renunță și la starea de colaborare a documentului deținut anterior, iar un [store partajat](#getsharedstore) al acestui editor care este deja abonat le cere din nou celorlalte editoare starea lor, așa că un editor reîncărcat într-o sesiune în desfășurare recuperează decalajul. Inițializați un astfel de editor cu valoarea [runtimeValue](#runtimevalue) a altui editor.  
Nici un text care nu este JSON nu generează o eroare: documentul este golit, setările sale rămân cum erau, iar eroarea de parsare este scrisă în consolă.  
Spre deosebire de atribuirea proprietății `value`, metoda nu este afectată de `readonly`, așa că prin ea încărcați un document într-un editor doar în citire. Un editor doar în citire afișează apoi setările pe care le conține textul încărcat, renunțând la cele pe care cititorul lui le schimbase pe ecran.

```js
editor.setInitialValue('json...');
```

Încărcare la pornire, salvare la modificare.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Evenimente {#event}

Singurele trei evenimente publice sunt `change`, `changePresetTheme` și `changeLocale`; `changeLocale` a apărut în versiunea `4.0.0`.  
Elementul declanșează pe el însuși și evenimente interne `@dineug/erd-editor/internal-*`, pentru propria funcționare; acestea nu fac parte din API.

### change {#change}

Când în editor apar modificări, acesta emite un eveniment.  
Evenimentul este amânat (debounce) cu 200 ms și nu este emis cât timp `readonly` este `true`.  
Se declanșează la orice modificare a documentului: o editare în interfață, atribuirea proprietății `value`, `clear()`, fiecare dintre metodele `setSchema*` și, începând cu versiunea `4.0.0`, `setSchemaJSON()` și `Import and Add`. `setInitialValue` nu îl emite.  
Începând cu versiunea `4.2.0`, aceasta include orice editare din fila [Dicționar](../guide/guides/dictionary.md) și orice anulare sau refacere a uneia, o modificare a unui nume logic sau a unei legături cu un domeniu, comanda `Derive Physical Names Again` și o schimbare a modului de afișare a numelor cât timp blocarea `Name View` este dezactivată.  
Nimic din ce se face în modul Flux al filei Vizualizare (zoomul, deplasarea, mutarea cardurilor, `Tidy Up`, afișarea rândurilor, restrângerea vizualizării dintr-un card sau, începând cu versiunea `4.2.0`, pașii făcuți cu `Previous table` și `Next table` ori cu tastele de anulare și refacere) nu îl emite, deoarece nimic din toate acestea nu este o modificare a documentului. Lista sa `Name View` este excepția: o schimbare făcută acolo îl emite cât timp blocarea `Name View` este dezactivată, la fel ca una făcută în fila ERD.  
Începând cu versiunea `4.0.0`, nu îl emite nici modificarea unei setări a cărei [blocare](../guide/guides/settings.md#lock) este activată, deoarece aceasta schimbă doar ecranul, niciodată `value`: o derulare sau un zoom al pânzei ERD cât timp setarea `Viewport` este blocată, o schimbare de filă cât timp setarea `Canvas Type` este blocată, o modificare a limbajului generatorului de cod, a stilului de denumire a tabelelor, a stilului de denumire a coloanelor sau a tipului de delimitator cât timp propria blocare este activată și, începând cu versiunea `4.2.0`, o schimbare a modului de afișare a numelor cât timp setarea `Name View` este blocată. Doar aceste modificări sunt excluse, așa că un lot care editează și documentul îl emite în continuare. Blocarea sau deblocarea unei setări îl emite.  
Toate blocările sunt activate într-un document nou și în orice fișier salvat înainte de versiunea `4.0.0`, iar blocarea `Name View` este activată în orice fișier salvat înainte de versiunea `4.2.0`, cu excepția cazului în care un editor cu versiunea `4.2.0` a dezactivat-o acolo, așa că, implicit, derularea, zoomul, schimbarea filelor și schimbarea modului de afișare a numelor nu emit nimic. Aceasta include focalizarea pe tabele din fila ERD, butonul cu pictograma de link extern al cardului, care vă duce din Flux înapoi la fila ERD, saltul la un rând din explorator sau la o potrivire a căutării, deschiderea exploratorului sau saltul la un rezultat al căutării rapide dintr-o altă filă, precum și, începând cu versiunea `4.2.0`, saltul la un tabel sau la o coloană dintr-un rând al foii `Checks` din fila Dicționar. Fiecare dintre acestea emite un singur `change` numai cât timp este dezactivată o blocare care acoperă acțiunea respectivă: `Canvas Type` pentru schimbarea filei și `Viewport` pentru derularea pe care o face și un buton de card, un rezultat al căutării rapide, un rând din explorator, o potrivire a căutării sau un rând din foaia `Checks`. Începând cu versiunea `4.1.0`, fiecare dintre aceste derulări urmează o singură regulă, [Unde ajunge un salt](../guide/guides/table-related-functions.md#where-a-jump-lands), așa că un rezultat de tip tabel din căutarea rapidă nu mai derulează de fiecare dată, iar un salt pe care regula îl lasă pe loc nu produce nicio derulare care să emită evenimentul. Deschiderea, închiderea sau redimensionarea exploratorului îngustează sau lărgește pânza fără a-i muta originea și nu emite nici ea nimic. Înainte de versiunea `4.0.0`, derularea, zoomul și schimbarea filelor îl emiteau întotdeauna, chiar și când `editor.value` rezulta identic.  
Pentru a evita scrierile care nu schimbă nimic, comparați `editor.value` cu valoarea pe care ați stocat-o ultima dată, nu cu fișierul încărcat: un fișier scris de o versiune anterioară, un fișier v2 sau unul editat manual poate ieși diferit în `value` imediat ce se încarcă, deoarece `value` îl scrie în forma de stocare. La fel se poate întâmpla cu un fișier a cărui blocare `Viewport` este dezactivată și a cărui origine nu afișează nicio parte a diagramei pe acest ecran: încărcarea mută vizualizarea pe diagramă, iar `value` scrie locul unde ajunge aceasta. Începând cu versiunea `4.0.0`, lățimile măsurate nu mai provoacă acest lucru, deoarece `value` nu conține niciuna. Începând cu versiunea `4.2.0`, poate ieși diferit și un fișier salvat de versiunea `4.0.0` sau `4.1.0`, deoarece `value` omite acum câmpurile de text, listele și colecțiile sale goale, așa că un astfel de fișier este rescris o singură dată, la următoarea salvare. O aplicație gazdă care scrie fișiere poate deosebi în schimb o editare de o schimbare a vizualizării cu ajutorul câmpului `changed` al unui store de replicare (consultați [on@change](./advanced/remote-storage.md#onchange)).  
Evenimentul nu are câmpul `detail`, nu se propagă și nu iese din shadow root, așa că ascultați-l chiar pe element și citiți `editor.value` în funcția de tratare.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme {#changepresettheme}

Este emis când tema predefinită este schimbată din configuratorul de teme încorporat sau, începând cu versiunea `4.0.0`, din comanda `Theme` din căutarea rapidă. Fiecare alegere îl emite, inclusiv alegerea opțiunii deja în vigoare.  
Apelarea de către dumneavoastră a metodelor [setPresetTheme](#setpresettheme) sau [setSystemAppearance](#setsystemappearance) ori activarea sau dezactivarea proprietății [systemDarkMode](#systemdarkmode) nu îl emite.  
`event.detail` este obiectul `ThemeOptions` complet de după alegere, `{ appearance, grayColor, accentColor }`, nu obiectul parțial solicitat. Începând cu versiunea `4.0.0`, câmpul său `appearance` este `'system'` cât timp este ales `System`, nu aspectul luminos sau întunecat afișat, așa că stocați-l ca atare și transmiteți-l înapoi metodei `setPresetTheme`.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale {#changelocale}

Începând cu versiunea `4.0.0`, este emis când se alege o limbă în editor, din selectorul de limbă de afișare sau din comanda `Display Language` din căutarea rapidă, ambele activate de [enableLocalePicker](#enablelocalepicker).  
Se declanșează după ce limba a fost aplicată, la fiecare alegere, inclusiv la alegerea opțiunii deja în vigoare. [setLocale](#setlocale) și [setSystemLocale](#setsystemlocale) nu îl emit niciodată și nici o schimbare a limbilor browserului nu îl emite. O schimbare a limbii nu emite niciun `change`.  
`event.detail` este `{ locale }`, de tipul `LocaleOption`: `'system'` când a fost ales `System`, altfel codul limbii. Elementul nu reține alegerea, așa că stocați-o și transmiteți-o metodei `setLocale` la următoarea încărcare.  
La fel ca `change`, nu se propagă, așa că ascultați-l chiar pe element.

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus {#focus}

Mută focusul pe editor.

```js
editor.focus();
```

## blur {#blur}

Elimină focusul de pe editor.

```js
editor.blur();
```

## clear {#clear}

Golește documentul, eliminând toate tabelele, coloanele, relațiile, indexurile și notele, toate grupurile de tabele (începând cu versiunea `4.0.0`), precum și cuvintele, termenii și domeniile din fila Dicționar (începând cu versiunea `4.2.0`), golind totodată istoricul propriu al fiecărei foi.  
Toate setările rămân, inclusiv baza de date, poziția vizualizării, nivelul de zoom, opțiunile de afișare ale tabelelor, fiecare blocare cu valoarea pe care o deține și scripturile `Before tables` și `After tables` din fila Schemă SQL, așa că un fișier golit salvează în continuare ce salva. Pentru a porni în schimb un document nou, atribuiți `''` proprietății `value` sau apelați `setInitialValue('')`.  
Se înregistrează în istoric, așa că poate fi anulată, și emite `change`. O anulare readuce documentul așa cum îl deținea editorul, inclusiv cuvintele, termenii și domeniile sale, cu fiecare setare blocată la valoarea sa blocată. Este ignorată cât timp `readonly` este setat.

```js
editor.clear();
```

## destroy {#destroy}

Distruge complet instanța editorului, astfel încât aceasta să nu mai poată fi refolosită.  
Eliberează ascultătorii și abonamentele editorului și distruge fiecare store partajat returnat de [getSharedStore](#getsharedstore).  
Un lot din flux pe care un store partajat îl mai reține se pierde odată cu acesta; apelați mai întâi metoda [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) a acelui store pentru a-l trimite.

```js
editor.destroy();
```

## setKeyBindingMap {#setkeybindingmap}

Redefinește comenzile rapide de la tastatură.  
`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut` și `zoomReset` sunt fixe și nu pot fi redefinite.  
Se scriu doar cele douăzeci și unu de nume de mai jos; orice altceva din obiect este ignorat, inclusiv numele fixe.  
Începând cu versiunea `3.10.0`, `search` poate fi redefinit, iar `findReplace` este nou. Înainte, `search` era fix. Începând cu versiunea `4.0.0`, `removeSelection` este nou. Începând cu versiunea `4.1.0`, `addTableGroup` și `groupSelectedTables` sunt noi.  
Valoarea unei combinații de taste trebuie să fie de tipul `ShortcutOption[]`. Un șir simplu este ignorat, așa că scrieți `{ addTable: [{ shortcut: 'Alt+KeyN' }] }`, nu `{ addTable: 'Alt+KeyN' }`.  
Un tablou gol este acceptat și nu asociază nimic: `setKeyBindingMap({ findReplace: [] })` lasă `Ctrl + F` (Windows/Linux) sau `⌘ + F` (Mac) paginii, iar `{ search: [] }` face același lucru pentru `Ctrl + K` (Windows/Linux) sau `⌘ + K` (Mac). Butonul `Search` din bara de instrumente deschide în continuare căutarea rapidă, butonul `Explorer` din bara de instrumente deschide și închide în continuare exploratorul, iar comanda `Toggle Explorer` din căutarea rapidă și din meniul contextual al pânzei deschide în continuare căutarea acestuia sau îl închide; niciunul dintre acestea nu afișează o comandă rapidă pentru un nume lăsat gol. `{ removeSelection: [] }` lasă `Delete` și `Backspace` paginii, iar elementele de ștergere din meniurile tabelului, notei și grupului de tabele (`Delete`, `Delete selected`, `Delete column`, `Delete columns`) nu mai afișează atunci nicio comandă rapidă.  
Începând cu versiunea `4.1.0`, `{ addTableGroup: [] }` lasă `Alt + G` (Windows/Linux) sau `⌥ + G` (Mac) paginii, iar `{ groupSelectedTables: [] }` lasă `T` apoi `G`. Comanda `New Table Group` de pe bara de instrumente a pânzei, din meniul contextual al pânzei și din căutarea rapidă, elementul `Group selected tables` din meniul tabelului și comanda `Group Selected Tables` din căutarea rapidă funcționează în continuare, fără nicio comandă rapidă afișată. Sfaturile ecran ale butoanelor `New Table`, `New Memo` și `New Table Group` de pe bara de instrumente a pânzei numesc prima combinație din `addTable`, `addMemo` și `addTableGroup` sau, pentru o combinație de taste lăsată goală, doar butonul.  
Începând cu versiunea `4.2.0`, `addColumn` și `removeColumn` dau și grilei din fila Dicționar combinațiile sale pentru rânduri, ca mai jos, așa că reasocierea oricăreia dintre ele mută odată cu ea și aceste combinații. `{ addColumn: [] }` nu lasă grilei nicio combinație pentru inserarea rândurilor, iar cele două elemente de inserare din meniul grilei nu mai afișează atunci nicio comandă rapidă; `{ removeColumn: [] }` nu îi lasă niciuna pentru ștergerea lor, iar elementul de ștergere din meniu și sfatul ecran `Delete Rows` nu mai afișează atunci niciuna.  
Apelul face o îmbinare parțială: numele pe care le omiteți își păstrează valorile implicite, iar un al doilea apel păstrează modificările anterioare. Nu există un getter pentru combinațiile de taste curente: [createKeyBindingMap](#createkeybindingmap) returnează valorile implicite, nu ce a modificat `setKeyBindingMap`.

```ts
type ShortcutOption = {
  shortcut: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

const defaultKeyBindingMap: Omit<
  KeyBindingMap,
  | 'edit'
  | 'stop'
  | 'undo'
  | 'redo'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
> = {
  search: [
    { shortcut: '$mod+KeyK', preventDefault: true, stopPropagation: true },
  ],
  findReplace: [
    { shortcut: '$mod+KeyF', preventDefault: true, stopPropagation: true },
  ],
  addTable: [{ shortcut: 'Alt+KeyN', preventDefault: true }],
  addColumn: [{ shortcut: 'Alt+Enter', preventDefault: true }],
  addMemo: [{ shortcut: 'Alt+KeyM', preventDefault: true }],
  addTableGroup: [
    { shortcut: 'Alt+KeyG', preventDefault: true, stopPropagation: true },
  ],
  groupSelectedTables: [{ shortcut: 'KeyT KeyG', preventDefault: true }],
  removeTable: [
    { shortcut: '$mod+Backspace', preventDefault: true },
    { shortcut: '$mod+Delete', preventDefault: true },
  ],
  removeColumn: [
    { shortcut: 'Alt+Backspace', preventDefault: true },
    { shortcut: 'Alt+Delete', preventDefault: true },
  ],
  removeSelection: [
    { shortcut: 'Delete', preventDefault: true },
    { shortcut: 'Backspace', preventDefault: true },
  ],
  primaryKey: [{ shortcut: 'Alt+KeyK', preventDefault: true }],
  selectAllTable: [
    { shortcut: '$mod+KeyA', preventDefault: true },
    { shortcut: '$mod+Alt+KeyA', preventDefault: true },
  ],
  selectAllColumn: [{ shortcut: 'Alt+KeyA', preventDefault: true }],
  relationshipZeroOne: [{ shortcut: '$mod+Alt+Digit1', preventDefault: true }],
  relationshipZeroN: [{ shortcut: '$mod+Alt+Digit2', preventDefault: true }],
  relationshipOneOnly: [{ shortcut: '$mod+Alt+Digit3', preventDefault: true }],
  relationshipOneN: [{ shortcut: '$mod+Alt+Digit4', preventDefault: true }],
  tableProperties: [{ shortcut: 'Alt+Space', preventDefault: true }],
  focusView: [
    { shortcut: 'Alt+KeyF', preventDefault: true, stopPropagation: true },
  ],
  handTool: [{ shortcut: 'Space', preventDefault: true }],
  zenMode: [
    { shortcut: 'Alt+KeyZ', preventDefault: true, stopPropagation: true },
  ],
};

// example
editor.setKeyBindingMap({
  addTable: [{ shortcut: '$mod+KeyN', preventDefault: true }],
});
```

`selectAllTable`, `handTool`, `removeSelection` și, începând cu versiunea `4.1.0`, `groupSelectedTables` cedează în fața cursorului de text: cât timp focusul este într-un câmp input, într-un textarea sau într-un element `contenteditable`, `$mod + A` selectează textul, `Space` tastează un spațiu, `Delete` și `Backspace` șterg text, iar `T` apoi `G` tastează cele două litere, în loc să ajungă la pânză. Niciuna dintre aceste apăsări nu este împiedicată. Orice combinație la care le reasociați se comportă la fel.

Începând cu versiunea `4.0.0`, `removeSelection` (`Delete` sau `Backspace`) elimină selecția din fila ERD ca un singur pas de anulare, fără confirmare. Când tabelul activ este singurul element selectat, una sau mai multe dintre coloanele sale sunt selectate, iar zoomul îi desenează rândurile, elimină acele coloane; altfel elimină toate tabelele, notele și grupurile de tabele selectate, păstrând tabelele unui grup. Consultați [Ștergerea tabelelor și notelor](../guide/guides/table-related-functions.md#table-and-memo-deletion).  
O tastă ținută apăsat elimină o singură dată, iar nimic nu se elimină cât timp este deschis un editor de celulă, de notă sau de nume de grup de tabele. În afara unui câmp de text și a panourilor și filelor care rețin combinațiile de taste (consultați [createKeyBindingMap](#createkeybindingmap)), apăsarea este împiedicată pe orice filă cât timp editorul are focusul, inclusiv pe un buton cu focus din bara de instrumente, precum și într-un editor doar în citire, unde nu elimină nimic.

Începând cu versiunea `4.1.0`, `addTableGroup` (`Alt+KeyG`) activează trasarea `New Table Group` în fila ERD, după care următoarea apăsare a butonului principal pe pânză trasează grupul, iar o nouă apăsare dezactivează trasarea, la fel ca butonul `New Table Group` de pe bara de instrumente a pânzei. `groupSelectedTables` (`KeyT KeyG`, `T` apoi `G`) pune tabelele selectate într-un grup nou și deschide editorul numelui acestuia, la fel ca elementul `Group selected tables` din meniul contextual al unui tabel. Fără niciun tabel selectat nu adaugă nimic; o notă sau un grup de tabele selectat nu contează. Consultați [Trasarea unui grup](../guide/guides/table-groups.md#drawing-a-group) și [Gruparea tabelelor selectate](../guide/guides/table-groups.md#grouping-selected-tables).  
Amândouă acționează doar acolo unde meniurile oferă un grup: nu cât timp `readonly` este setat, cât timp opțiunea de afișare `Table Groups` ascunde grupurile sau cât timp este deschis un editor de celulă, de notă sau de nume de grup de tabele. La fel ca celelalte combinații de taste ale pânzei, acționează doar în fila ERD și nu cât timp este deschisă căutarea rapidă, panoul Proprietăți tabel, vizualizatorul de diferențe, călătoria în timp, previzualizarea aranjării automate ori caseta de dialog `Export image` sau `Map Columns`. Acolo unde nu fac nimic, apăsarea este totuși împiedicată, cu excepția cazului în care `groupSelectedTables` cedează în fața cursorului de text. Combinația `addTableGroup` este și ea oprită, la fel ca `focusView` și `zenMode`, așa că un ascultător `keydown` al paginii, în faza de propagare, nu o aude niciodată.

Începând cu versiunea `4.2.0`, în fila [Dicționar](../guide/guides/dictionary.md#adding-and-deleting-rows), fiecare combinație dintr-o singură apăsare din `addColumn` inserează sub selecție atâtea rânduri câte cuprinde selecția, aceeași combinație cu `Shift` ținut apăsat în plus le inserează deasupra, iar fiecare combinație dintr-o singură apăsare din `removeColumn` șterge rândurile pe care le cuprinde selecția: `Alt+Enter`, `Alt+Shift+Enter` și `Alt+Backspace` sau `Alt+Delete`, cu valorile implicite. Acestea acționează în grila foilor `Domains`, `Words` și `Terms` cât timp nu este deschisă nicio editare de celulă. O combinație din `addColumn` care conține deja `Shift` nu dă nicio combinație pentru inserarea deasupra, iar o secvență asociată cu oricare dintre cele două nume nu dă grilei nimic.  
Fiecare astfel de apăsare este împiedicată după cum indică opțiunea sa și este întotdeauna oprită, așa că nu adaugă și nu elimină nicio coloană în fila ERD. În foaia `Checks` și într-un editor doar în citire nu face nimic, deși este în continuare împiedicată și oprită. Într-o editare de celulă deschisă sau în câmpul de căutare al filei, combinațiile sunt lăsate textului: sunt oprite acolo, dar nu împiedicate, așa că câmpul reacționează la ele ca oriunde altundeva (pe Mac, `⌥ + Backspace` șterge un cuvânt). [dictionaryRowChords](#dictionaryrowchords) le listează.

Începând cu versiunea `3.10.0`, `findReplace` (`$mod+KeyF`) deschide funcția [Găsire și înlocuire](../guide/guides/find-and-replace.md). Începând cu versiunea `4.1.0`, comută [exploratorul](../guide/guides/explorer.md#opening-and-closing) care o conține, iar fila Comenzi rapide o listează ca `Toggle Explorer`.  
Cât timp butonul `Explorer` din bara de instrumente apare apăsat (exploratorul este deschis în fila ERD și nu este ascuns de modul Zen), închide exploratorul, cu excepția cazului în care este deschisă căutarea rapidă, panoul Proprietăți tabel, configuratorul de teme, selectorul de limbă de afișare, caseta de dialog `Export image` sau `Map Columns`. Altfel, închide oricare dintre acestea este deschis, aduce fila ERD din orice altă filă și deschide exploratorul cu cursorul de text în câmpul `Find` și textul căutat selectat. Un editor prea îngust pentru a afișa exploratorul lângă pânză îl păstrează deschis, dar deoparte, și afișează notificarea `Widen the window to show the Explorer`. Înainte de versiunea `4.1.0`, deschidea panoul flotant Găsire și înlocuire sau readucea tastatura în câmpul acestuia și nu îl închidea niciodată.  
Nu cedează în fața cursorului de text: cât timp editorul are focusul, este preluată pe orice filă, de pe pânză sau dintr-un câmp input din editor. Apăsarea este împiedicată, așa că browserul nu deschide bara de căutare, și oprită, așa că niciun ascultător `keydown` al paginii în faza de propagare nu o aude. Cu un editor de celulă sau de notă deschis, cu un editor de nume de grup de tabele deschis (începând cu versiunea `4.0.0`) ori cu o editare de celulă deschisă în grila filei Dicționar (începând cu versiunea `4.2.0`), este în continuare împiedicată și oprită, dar nu face nimic. În acest ultim caz nici `search` nu face nimic, așa că textul tastat până atunci rămâne.  
Cât timp este deschis vizualizatorul de diferențe, călătoria în timp sau previzualizarea aranjării automate, pe oricare filă, ori cât timp o metodă de introducere (IME) încă compune, nu este nici împiedicată, nici oprită, așa că o primește căutarea proprie a browserului sau a aplicației gazdă. În interiorul exploratorului, o apăsare aflată încă în compunere este oprită acolo, deși nu este împiedicată. Orice combinație la care reasociați `findReplace` se comportă la fel.

`focusView` acționează doar în fila ERD. Cu cel puțin un tabel selectat, deschide fila Vizualizare în modul Flux, restrânsă la acele tabele și la toate tabelele aflate la o relație distanță; o notă sau un grup de tabele selectat nu contează, iar fără niciun tabel selectat nu face nimic. Consultați [Focalizarea pe tabele](../guide/guides/visualization.md#focusing-on-tables).

`undo` și `redo` acționează în funcție de filă. În fila ERD, anulează și refac în istoricul documentului. Începând cu versiunea `4.2.0`, în fila Dicționar anulează și refac în istoricul propriu al foii afișate, iar în foaia `Checks` nu fac nimic (consultați [Foile din fila Dicționar](../guide/guides/undo-redo.md#dictionary-sheets)). În modul Flux al filei Vizualizare, fac un pas înapoi sau înainte, așa cum fac [`Previous table` și `Next table`](../guide/guides/visualization.md#previous-table-and-next-table), fără a atinge istoricul documentului. În celelalte file și în modul Graf nu anulează nimic.

`stop` (`Escape`) în fila ERD încheie un editor de celulă sau de notă deschis ori o relație în curs de trasare și lasă selecția neschimbată. Începând cu versiunea `4.0.0`, încheie și un editor de nume de grup de tabele, fără a scrie vreun nume, precum și o trasare `New Table Group`. Editorul apelează `preventDefault()` pentru această apăsare.  
Când niciunul dintre acestea nu este deschis, `Escape` deselectează tot, scoate focusul de pe celula activă și nu este împiedicat. Prin urmare, ieșirea dintr-o editare și deselectarea necesită două apăsări.  
Începând cu versiunea `4.2.0`, cât timp este afișată lista termenilor de sub celula unui nume logic (consultați [Completarea numelor de termeni](../guide/guides/logical-names.md#completing-term-names)), prima apăsare pe `Escape` închide doar lista și lasă editorul deschis. Această apăsare este împiedicată și oprită la nivelul celulei, așa că nu o aud nici `stop`, nici un ascultător `keydown` al paginii în faza de propagare.  
În afară de explorator, de formatele `Import` ale [ecranului de bun venit](#enablewelcomescreen), de lista termenilor de sub celula unui nume logic, de fila [Dicționar](../guide/guides/dictionary.md#keys-on-the-tab) și de selectoarele și casetele de dialog de mai jos, editorul nu oprește niciodată propagarea apăsărilor pe `Escape`, așa că o pagină care le ascultă ea însăși, de exemplu pentru a închide o casetă de dialog proprie, aude ambele apăsări și o poate ignora pe cea al cărei `defaultPrevented` este `true`.  
Cât timp este deschisă căutarea rapidă, panoul Proprietăți tabel, vizualizatorul de diferențe, previzualizarea aranjării automate sau călătoria în timp, `Escape` închide în schimb acel element și lasă selecția neschimbată. Nici această apăsare nu este împiedicată.  
Începând cu versiunea `4.0.0`, o casetă de dialog [`Export image`](../guide/guides/file-import-export.md#image) sau [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) deschisă preia și ea `Escape`, închizându-se și lăsând selecția neschimbată. Fiecare preia tastatura când se deschide, iar acel `Escape` este atât împiedicat, cât și oprit.  
Începând cu versiunea `4.1.0`, o apăsare pe `Escape` cu focusul în [explorator](../guide/guides/explorer.md#keys-in-the-explorer), în arborele, câmpurile sau butoanele sale, readuce tastatura la pânză și lasă exploratorul deschis și selecția neschimbată. Editorul apelează atât `preventDefault()`, cât și `stopPropagation()` pentru ea, așa că nu ajunge niciodată la un ascultător `keydown` al paginii în faza de propagare.  
O apăsare pe `Escape` pe pânză nu închide niciodată exploratorul. Înainte de versiunea `4.1.0`, o apăsare pe `Escape` în panoul Găsire și înlocuire îl închidea, iar una pe pânză îl închidea prin aceeași apăsare care deselecta tot.  
Începând cu versiunea `4.0.0`, selectorul de limbă de afișare și selectorul de culori se închid la `Escape`: în interiorul lor, apăsarea este împiedicată și oprită, iar pe pânză îi închide prin aceeași apăsare care deselectează tot, fără a fi împiedicată sau oprită.  
O apăsare pe `Escape` cât timp o metodă de introducere (IME) încă compune aparține compunerii. Lasă neschimbat un editor deschis și nu este împiedicată, așa că o pagină poate ignora și ea o apăsare al cărei `isComposing` este `true` sau al cărei `keyCode` este `229`. În interiorul exploratorului, o astfel de apăsare, ca orice tastă apăsată acolo în timpul compunerii, este și oprită, iar tastatura rămâne în câmp.  
Înainte de versiunea `3.9.2`, o singură apăsare pe `Escape` încheia o editare sau o trasare și totodată deselecta tot, iar editorul nu o împiedica niciodată.

### createKeyBindingMap {#createkeybindingmap}

Începând cu versiunea `3.9.2`, pachetul exportă `createKeyBindingMap()` și, odată cu aceasta, tipurile `KeyBindingMap`, `KeyBindingName` și `ShortcutOption`.  
Returnează combinațiile de taste implicite, toate cele 28 de nume, inclusiv cele fixe, ca o hartă nouă la fiecare apel, așa că modificarea hărții returnate nu schimbă nimic altceva.  
De la aceste valori pornește fiecare editor, iar un apel `setKeyBindingMap` nu se reflectă în ele.  
Dintre aceste patru, doar `createKeyBindingMap` este un export la execuție; celelalte trei sunt tipuri. Începând cu versiunea `4.2.0`, alături de aceasta este exportată și funcția [dictionaryRowChords](#dictionaryrowchords).

```ts
type KeyBindingName =
  | 'edit'
  | 'stop'
  | 'search'
  | 'findReplace'
  | 'undo'
  | 'redo'
  | 'addTable'
  | 'addColumn'
  | 'addMemo'
  | 'addTableGroup'
  | 'groupSelectedTables'
  | 'removeTable'
  | 'removeColumn'
  | 'removeSelection'
  | 'primaryKey'
  | 'selectAllTable'
  | 'selectAllColumn'
  | 'relationshipZeroOne'
  | 'relationshipZeroN'
  | 'relationshipOneOnly'
  | 'relationshipOneN'
  | 'tableProperties'
  | 'focusView'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
  | 'handTool'
  | 'zenMode';

type KeyBindingMap = Record<KeyBindingName, ShortcutOption[]>;

declare function createKeyBindingMap(): KeyBindingMap;

// example
import { createKeyBindingMap } from '@dineug/erd-editor';

const shortcuts = Object.values(createKeyBindingMap())
  .flat()
  .map(({ shortcut }) => shortcut); // 'Enter', 'Escape', '$mod+KeyK', ...
```

Fiecare `shortcut` este o combinație în sintaxa [tinykeys](https://github.com/jamiebuilds/tinykeys), cu tasta numită după `KeyboardEvent.code`, unde [`$mod`](#mod) este `⌘` pe macOS și `Control` în rest.  
Începând cu versiunea `4.0.0`, editorul citește singur aceste combinații, în aceeași sintaxă, nu prin tinykeys. O tastă se potrivește după `code` sau după `key`, indiferent de majuscule, iar o apăsare se potrivește numai când sunt ținute apăsat exact tastele de modificare pe care le numește combinația. `AltGraph` contează ca `Control` și `Alt` pe Windows și ca `Alt` pe macOS. Apăsările separate printr-un spațiu formează o secvență, care o ia de la capăt după o secundă fără niciun eveniment keydown.  
Începând cu versiunea `4.1.0`, una dintre valorile implicite este o secvență: `groupSelectedTables` este `KeyT KeyG`, `T` apoi `G`. O secvență se execută la apăsarea care o completează și doar acea apăsare primește `preventDefault` și `stopPropagation` ale secvenței, așa că, cu valorile implicite, `T` ajunge la pagină și doar `G` este împiedicat. Meniurile, căutarea rapidă și fila Comenzi rapide afișează o secvență ca o tastă pentru fiecare apăsare.  
Numele fixe sunt asociate cu `Enter` (`edit`), `Escape` (`stop`), `$mod+KeyZ` (`undo`), `$mod+Shift+KeyZ` (`redo`), `$mod+Equal` (`zoomIn`), `$mod+Minus` (`zoomOut`) și `$mod+Digit0` (`zoomReset`). `edit` și `stop` nu au indicatori; celelalte cinci au `preventDefault` și `stopPropagation`. Restul sunt valorile implicite de mai sus, printre care `search` și `findReplace`.

Editorul le ascultă pe propriul element, așa că o aplicație gazdă care preia tastele înaintea editorului, cu comenzi rapide globale sau cu un ascultător `keydown` în faza de captură, trebuie să le lase să treacă cât timp editorul are focusul.  
Construiți lista combinațiilor de lăsat să treacă pornind de la `createKeyBindingMap()`, cu combinațiile de taste transmise metodei `setKeyBindingMap` în locul celor implicite.  
Începând cu versiunea `3.10.0`, această listă include `$mod+KeyF`, combinația de căutare a browserului. O aplicație gazdă care vrea să-și păstreze propria căutare pe această combinație transmite `setKeyBindingMap({ findReplace: [] })`.  
Începând cu versiunea `4.0.0`, include și tastele `Delete` și `Backspace` simple. O aplicație gazdă care vrea să păstreze aceste taste transmite `setKeyBindingMap({ removeSelection: [] })`.  
Începând cu versiunea `4.1.0`, include și `Alt+KeyG` și secvența `KeyT KeyG`, care vine ca un singur șir: împărțiți-l la spațiu și lăsați să treacă fiecare apăsare, inclusiv `T` și `G` simple, deoarece o secvență căreia îi lipsește o apăsare nu se completează niciodată. O aplicație gazdă care vrea să păstreze aceste taste transmite `setKeyBindingMap({ addTableGroup: [] })` sau `setKeyBindingMap({ groupSelectedTables: [] })`.  
Începând cu versiunea `4.2.0`, adăugați la această listă combinațiile pe care [dictionaryRowChords](#dictionaryrowchords) le returnează pentru aceeași hartă, printre care `Alt+Shift+Enter`. O aplicație gazdă care vrea să păstreze aceste taste transmite `setKeyBindingMap({ addColumn: [] })` sau `setKeyBindingMap({ removeColumn: [] })`, ceea ce le scoate și de la adăugarea și eliminarea coloanelor în fila ERD.

Cât timp focusul este în explorator, în arborele său, în câmpurile `Find` și `Replace` sau în butoanele sale, `findReplace`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut` și `zoomReset` trec mai departe la editor, așa că `findReplace` acționează acolo la fel ca pe pânză. Orice altă combinație de taste, așa cum este setată în prezent, se oprește la explorator, o secvență prin ultima sa apăsare (un `G` simplu, cu valorile implicite), la fel ca tastele săgeți, `Tab`, `Enter`, `Space`, `Home`, `End` și orice tastă apăsată cât timp o metodă de introducere (IME) încă compune. Cu excepția tastei `Escape`, care readuce tastatura la pânză, acestea sunt oprite fără a fi împiedicate, așa că acționează ca taste obișnuite în câmpurile, butoanele și arborele exploratorului și nu ajung nici la pânză, nici la un ascultător `keydown` al paginii în faza de propagare: acolo `Alt + N` nu adaugă niciun tabel, iar `Delete` nu elimină nimic. Tastele care mută focusul, restrâng sau duc la un rând din arbore și `Enter` în câmpul `Find` sau `Replace`, care trece prin potriviri sau înlocuiește, sunt și împiedicate.  
Orice altă tastă, de exemplu combinația de salvare sau de paletă de comenzi a unei aplicații gazdă, ajunge ca de obicei la pagină. Consultați [Taste în explorator](../guide/guides/explorer.md#keys-in-the-explorer). Înainte de versiunea `4.1.0`, panoul flotant Găsire și înlocuire reținea tastele în același mod, cu excepția tastelor `Home` și `End`, a ultimei apăsări a unei secvențe și a tastei `Space` cât timp `handTool` era asociat cu altă tastă.  
Începând cu versiunea `4.0.0`, selectorul de limbă de afișare reține tastele în același mod: aceleași șapte combinații trec mai departe, iar orice altă combinație (începând cu versiunea `4.1.0`, o secvență prin ultima sa apăsare), tastele săgeți și `Tab` sunt oprite acolo fără a fi împiedicate, la fel ca orice tastă apăsată cât timp o metodă de introducere (IME) încă compune. `↑`, `↓`, `Home`, `End`, `Enter` și `Space` pe unul dintre rândurile sale trec de la un rând la altul sau aleg unul și sunt și împiedicate.

Începând cu versiunea `4.2.0`, și fila [Dicționar](../guide/guides/dictionary.md#keys-on-the-tab) reține tastele, doar `search`, `findReplace`, `undo` și `redo` trecând mai departe la editor. `undo` și `redo` acționează asupra istoricului propriu al foii afișate, iar cu o editare de celulă deschisă sau cu focusul în câmpul de căutare al filei sunt lăsate textului, fiind oprite acolo, dar nu împiedicate. `search` și `findReplace` nu fac nimic cât timp este deschisă o editare de celulă, ca mai sus. Combinațiile pentru rânduri acționează în grilă, așa cum se descrie mai sus la `addColumn` și `removeColumn`.  
Orice altă combinație de taste, așa cum este setată în prezent, se oprește la filă, o secvență prin ultima sa apăsare, la fel ca tastele săgeți, `Tab`, `Enter`, `Space`, `Home`, `End` și orice tastă apăsată cât timp o metodă de introducere (IME) încă compune. Niciuna dintre acestea nu ajunge la pânză sau la un ascultător `keydown` al paginii în faza de propagare: acolo `Alt + N` nu adaugă niciun tabel, iar `Delete` nu elimină nimic din diagramă. Evenimentele de copiere, decupare și lipire din filă se opresc și ele acolo, așa că diagrama nu le citește niciodată ca fiind ale sale. Orice altă tastă ajunge ca de obicei la pagină.

### dictionaryRowChords {#dictionaryrowchords}

Începând cu versiunea `4.2.0`, pachetul exportă `dictionaryRowChords()`. Returnează, ca un tablou `ShortcutOption[]` nou la fiecare apel, toate combinațiile cu care grila filei Dicționar inserează sau șterge rânduri conform hărții de combinații de taste pe care o transmiteți.  
În ordine, acestea sunt combinațiile dintr-o singură apăsare din `addColumn`, care inserează rânduri sub selecție; fiecare dintre acestea cu `Shift` ținut apăsat în plus, care inserează rânduri deasupra, niciuna pentru o combinație care conține deja `Shift`; și combinațiile dintr-o singură apăsare din `removeColumn`, care șterg rânduri. Fiecare păstrează `preventDefault` și `stopPropagation` ale combinației de taste din care provine, iar o secvență este omisă. Consultați [Adăugarea și ștergerea rândurilor](../guide/guides/dictionary.md#adding-and-deleting-rows).  
Combinația care inserează rânduri deasupra, `Alt+Shift+Enter` cu valorile implicite, nu se află în nicio combinație de taste, așa că o aplicație gazdă care potrivește exact tastele de modificare și își construiește lista tastelor de lăsat să treacă doar din [createKeyBindingMap](#createkeybindingmap) nu o lasă niciodată să treacă. Lăsați să treacă ambele liste, așa cum face pluginul pentru Obsidian.  
Citește doar harta primită, nu combinațiile de taste ale elementului, așa că transmiteți-i harta din care v-ați construit lista de taste.

```ts
declare function dictionaryRowChords(
  keyBindingMap: KeyBindingMap
): ShortcutOption[];

// example
import { createKeyBindingMap, dictionaryRowChords } from '@dineug/erd-editor';

const map = createKeyBindingMap();
const shortcuts = [
  ...Object.values(map).flat(),
  ...dictionaryRowChords(map),
].map(({ shortcut }) => shortcut);
// dictionaryRowChords(map): 'Alt+Enter', 'Alt+Shift+Enter', 'Alt+Backspace', 'Alt+Delete'
```

### $mod {#mod}

Schimbă tasta `Control` în funcție de mediu.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Tabelul comenzilor rapide {#shortcut-table}

Folosește proprietățile `key, code` ale evenimentului de tastatură.  
Folosiți `code` pentru poziții absolute și `key` pentru valorile introduse.

| Windows       | macOS           | `key`         | `code`                         |
| ------------- | --------------- | ------------- | ------------------------------ |
| N/A           | `Command` / `⌘` | `Meta`        | `MetaLeft` / `MetaRight`       |
| `Alt`         | `Option` / `⌥`  | `Alt`         | `AltLeft` / `AltRight`         |
| `Control`     | `Control` / `^` | `Control`     | `ControlLeft` / `ControlRight` |
| `Shift`       | `Shift`         | `Shift`       | `ShiftLeft` / `ShiftRight`     |
| `Space`       | `Space`         | N/A           | `Space`                        |
| `Enter`       | `Return`        | `Enter`       | `Enter`                        |
| `Esc`         | `Esc`           | `Escape`      | `Escape`                       |
| `Backspace`   | `Delete` / `⌫`  | `Backspace`   | `Backspace`                    |
| `Delete`      | `fn` + `Delete` | `Delete`      | `Delete`                       |
| `1`, `2` etc. | `1`, `2` etc.   | `1`, `2` etc. | `Digit1`, `Digit2` etc.        |
| `a`, `b` etc. | `a`, `b` etc.   | `a`, `b` etc. | `KeyA`, `KeyB` etc.            |
| `-`           | `-`             | `-`           | `Minus`                        |
| `=`           | `=`             | `=`           | `Equal`                        |
| `+`           | `+`             | `+`           | `Equal`                        |

## Temă {#theme}

### setPresetTheme {#setpresettheme}

Setează o temă predefinită.  
Valorile implicite sunt `appearance: 'dark'`, `grayColor: 'slate'` și `accentColor: 'indigo'`.  
Fiecare câmp se aplică separat, așa că un apel parțial le lasă neschimbate pe celelalte două. O valoare care nu este unul dintre numele de mai jos este ignorată, iar apelul nu aruncă niciodată o excepție.  
Începând cu versiunea `4.0.0`, câmpul `appearance` acceptă și `'system'`, adică opțiunea `System` din configuratorul de teme. Aceasta afișează aspectul luminos sau întunecat raportat de sistemul de operare ori cel indicat de [setSystemAppearance](#setsystemappearance) și comută atunci când acesta se schimbă.

```ts
type ThemeOptions = {
  appearance: 'dark' | 'light' | 'system';
  grayColor: 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';
  accentColor:
    | 'gray'
    | 'gold'
    | 'bronze'
    | 'brown'
    | 'yellow'
    | 'amber'
    | 'orange'
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'lime'
    | 'mint'
    | 'sky';
};

// example
editor.setPresetTheme({ appearance: 'light' });
```

### setSystemAppearance {#setsystemappearance}

Începând cu versiunea `4.0.0`, indică aspectul luminos sau întunecat pe care îl afișează aspectul `'system'`, pentru o aplicație gazdă cu propriul aspect luminos și întunecat, de exemplu tema unui IDE. Cât timp unul este indicat, schimbările sistemului de operare sunt ignorate.  
`null` sau orice valoare diferită de `'dark'` ori `'light'` revine la urmarea sistemului de operare.  
Cât timp aspectul este `'light'` sau `'dark'`, nu schimbă nimic pe ecran, dar valoarea este păstrată și se aplică imediat ce aspectul devine `'system'`. Altfel se aplică imediat. Nu emite nimic, iar `changePresetTheme` continuă să raporteze `'system'`.  
Aplicațiile gazdă VS Code, JetBrains și Obsidian o apelează cu propriul aspect luminos sau întunecat și din nou de fiecare dată când acesta se schimbă.

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme {#settheme}

Permite personalizarea temei.  
Fiecare apel înlocuiește întregul strat personalizat, așa că transmiteți din nou obiectul complet pentru a schimba un singur token peste o suprascriere existentă și transmiteți `{}` pentru a reveni la tema predefinită.  
Se păstrează doar numele de tokenuri de mai jos, cu valori de tip șir de caractere; orice altceva este eliminat fără eroare.  
Stratul se află deasupra temei predefinite, așa că un apel ulterior `setPresetTheme` înlocuiește tema predefinită de dedesubt, în timp ce suprascrierile dumneavoastră rămân.

#### JavaScript {#javascript}

```ts
type Theme = {
  grayColor1: string;
  grayColor2: string;
  grayColor3: string;
  grayColor4: string;
  grayColor5: string;
  grayColor6: string;
  grayColor7: string;
  grayColor8: string;
  grayColor9: string;
  grayColor10: string;
  grayColor11: string;
  grayColor12: string;

  accentColor1: string;
  accentColor2: string;
  accentColor3: string;
  accentColor4: string;
  accentColor5: string;
  accentColor6: string;
  accentColor7: string;
  accentColor8: string;
  accentColor9: string;
  accentColor10: string;
  accentColor11: string;
  accentColor12: string;

  canvasBackground: string;
  canvasBoundaryBackground: string;

  tableBackground: string;
  tableHeaderBackground: string;
  tableSelect: string;
  tableBorder: string;
  tableShadow: string;

  tableGroupHeaderBackground: string;
  tableGroupBackground: string;
  tableGroupBorder: string;

  memoBackground: string;
  memoSelect: string;
  memoBorder: string;
  memoShadow: string;

  columnSelect: string;
  columnSelectHover: string;
  columnHover: string;

  columnHandleBackground: string;
  columnHandleBorder: string;
  columnHandleHoverBackground: string;
  columnHandleHoverBorder: string;

  relationshipHover: string;

  visualizationLink: string;
  visualizationColumn: string;
  visualizationRelationship: string;

  toolbarBackground: string;

  contextMenuBackground: string;
  contextMenuSelect: string;
  contextMenuHover: string;
  contextMenuBorder: string;

  minimapBorder: string;
  minimapShadow: string;
  minimapViewportBorder: string;
  minimapViewportBorderHover: string;

  toastBackground: string;
  toastBorder: string;
  toastSuccess: string;
  toastError: string;

  findReplaceError: string;

  mapColumnsError: string;

  schemaSqlWarningBackground: string;
  schemaSqlWarningForeground: string;

  dragSelectBackground: string;
  dragSelectBorder: string;

  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;

  foreground: string;
  active: string;
  placeholder: string;

  focus: string;
  inputActive: string;

  keyPK: string;
  keyFK: string;
  keyPFK: string;

  treeBackground: string;
  treeRowHover: string;
  treeRowCurrent: string;
  treeMuted: string;
  treeMatch: string;

  explorerBackground: string;
  explorerBorder: string;

  dictionaryErrorForeground: string;
  dictionaryErrorBackground: string;
  dictionaryWarningForeground: string;
  dictionaryWarningBackground: string;
  dictionaryBackground: string;
  dictionaryHeaderBackground: string;
  dictionaryGridLine: string;
  dictionaryHeaderSelect: string;

  diffInsertForeground: string;
  diffDeleteForeground: string;
  diffModifyForeground: string;
  diffRenameForeground: string;
};

// example
editor.setTheme({
  canvasBackground: '#1b1b1f',
  tableBackground: '#242429',
  keyPK: '#ffc53d',
});
```

`tableShadow` și `memoShadow` sunt culoarea umbrei pe care o aruncă tabelele și notele pe pânza ERD. Tema predefinită întunecată le lasă `transparent`, ceea ce nu aruncă nicio umbră, la fel ca transmiterea valorii `none` sau a unui șir gol către `setTheme`; tema predefinită luminoasă folosește `rgba(0, 0, 0, 0.18)`.

Începând cu versiunea `4.0.0`, există încă nouă tokenuri:

- `tableGroupHeaderBackground`, `tableGroupBackground` și `tableGroupBorder` colorează bara de titlu, corpul și conturul unui [grup de tabele](../guide/guides/table-groups.md) care nu are o culoare proprie.
- `toastSuccess` și `toastError` colorează marcajul unei notificări care raportează cum s-a încheiat o acțiune.
- `findReplaceError` și `mapColumnsError` colorează erorile afișate de funcția Găsire și înlocuire și de caseta de dialog Mapare coloane. Înainte, Găsire și înlocuire folosea `diffDeleteForeground`, așa că suprascrierea acestuia nu o mai recolorează.
- `schemaSqlWarningBackground` și `schemaSqlWarningForeground` colorează avertismentele din opțiunile filei Schemă SQL.

Începând cu versiunea `4.1.0`, există încă nouă tokenuri:

- `treeBackground`, `treeRowHover`, `treeRowCurrent`, `treeMuted` și `treeMatch` colorează arborele comun [exploratorului](../guide/guides/explorer.md#the-tree) și [vizualizatorului de diferențe](../guide/guides/table-related-functions.md#diff-viewer): fundalul său, care umple și câmpurile `Find` și `Replace` ale exploratorului; un rând aflat sub indicator, rândul pe care se află tastatura cât timp arborele are focusul și un buton aflat sub indicator în antetul și căutarea exploratorului; rândul potrivirii curente a căutării; textul estompat, de exemplu contoarele, tipurile de date și săgețile de restrângere; și marcajul din spatele textului găsit de o căutare.
- `explorerBackground` și `explorerBorder` colorează panoul exploratorului și liniile sale: marginea de lângă pânză, linia de sub căutare și bordurile câmpurilor sale și ale butoanelor pe care le desfășoară `Search In`. `explorerBorder` desenează și marginea arborelui vizualizatorului de diferențe, linia de sub câmpul său `Filter by name` și bordura acestui câmp. Pictogramele cheilor din explorator folosesc `keyPK`, `keyFK` și `keyPFK`.
- `diffModifyForeground` și `diffRenameForeground` colorează ceea ce vizualizatorul de diferențe marchează ca modificat și redenumit, în arborele său și pe ambele documente. `diffModifyForeground` conturează și un tabel, o notă sau un grup de tabele care a fost mutat, redimensionat, recolorat sau regrupat, indiferent ce altceva s-a schimbat în el, și desenează conectorul unei chei străine care s-a modificat.

`diffInsertForeground` și `diffDeleteForeground` colorează acum ceea ce vizualizatorul de diferențe marchează ca adăugat și eliminat, în arborele său și pe documentul care îl conține, deopotrivă în text, contururi și conectori. `diffInsertBackground`, `diffDeleteBackground`, `diffCrossBackground` și `diffCrossForeground` au fost eliminate în versiunea `4.1.0`, deoarece vizualizatorul de diferențe nu mai umple celulele. `setTheme` le elimină ca pe orice alt nume care nu se află în `Theme`, iar variabilele lor CSS, `--erd-editor-diff-insert-background`, `--erd-editor-diff-delete-background`, `--erd-editor-diff-cross-background` și `--erd-editor-diff-cross-foreground`, nu mai sunt citite.

Începând cu versiunea `4.2.0`, există încă douăsprezece tokenuri:

- `columnHandleBackground` și `columnHandleBorder` umplu și conturează [mânerul de glisare al coloanei](../guide/guides/table-editing.md#rearranging-and-moving-columns), desenat chiar în afara marginii stângi a tabelului, lângă rândul coloanei active, iar `columnHandleHoverBackground` și `columnHandleHoverBorder` le preiau rolul cât timp indicatorul se află pe el. Pictograma sa de prindere folosește `foreground`, iar sub indicator `active`.
- `dictionaryErrorForeground` și `dictionaryWarningForeground` colorează ceea ce detectează [verificările dicționarelor](../guide/guides/dictionary.md#what-each-check-finds), o eroare sau un avertisment: un nume semnalat pe pânza ERD (consultați [Marcaje pe pânză](../guide/guides/dictionary.md#marks-on-the-canvas)), textul unei celule semnalate în foile `Domains`, `Words` și `Terms` și contorul foii `Checks`. `dictionaryErrorBackground` și `dictionaryWarningBackground` umplu o astfel de celulă. `dictionaryErrorForeground` colorează și instrumentul `Delete Rows` aflat sub indicator.
- `dictionaryBackground`, `dictionaryHeaderBackground`, `dictionaryGridLine` și `dictionaryHeaderSelect` colorează foaia filei [Dicționar](../guide/guides/dictionary.md#the-sheets): celulele sale, a căror culoare umple și câmpul de căutare al filei și lista domeniilor unui termen; antetele coloanelor și numerele rândurilor; liniile dintre celule, care desenează și bara filei și bordurile câmpurilor sale; și un antet al cărui rând sau coloană se intersectează cu selecția. Restul foii folosește tokenuri comune: `foreground` pentru etichetele antetelor, `active` pentru textul celulelor, `grayColor7` pentru linia care separă antetele coloanelor și numerele rândurilor de celule, `focus` pentru marginea celulei active, `accentColor9` pentru marginea unei zone selectate și, la o opacitate de 20%, pentru umplerea acesteia, `accentColor6` pentru antetul unui rând sau al unei coloane selectate în întregime, `grayColor3` pentru celulele doar în citire și tokenurile barei de derulare. O valoare `accentColor9` care nu este scrisă ca `#rgb` sau `#rrggbb` lasă o zonă selectată neumplută.

#### Variabile CSS {#css-variables}

Fiecare token din `Theme` are o variabilă CSS corespunzătoare, numită `--erd-editor-` urmat de cheia scrisă în kebab-case: `grayColor10` este `--erd-editor-gray-color-10`, `keyPK` este `--erd-editor-key-pk`, iar `keyPFK` este `--erd-editor-key-pfk`.  
Variabilele se moștenesc în editor, așa că setați-le oriunde doriți să se aplice. Pe `:root`, aplică tema tuturor editoarelor din pagină; pe elementul însuși, doar acestuia.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

Începând cu versiunea `3.4.0`, tokenurile `dargSelect`, scrise greșit, se scriu `dragSelect`, iar variabilele lor CSS s-au schimbat din `--erd-editor-darg-select-background` și `--erd-editor-darg-select-border` în `--erd-editor-drag-select-background` și `--erd-editor-drag-select-border`. O foaie de stil care folosește încă numele vechi este ignorată.

<details>
<summary>Valorile implicite ale temei</summary>

```css
:root {
  --erd-editor-gray-color-1: #111113;
  --erd-editor-gray-color-2: #18191b;
  --erd-editor-gray-color-3: #212225;
  --erd-editor-gray-color-4: #272a2d;
  --erd-editor-gray-color-5: #2e3135;
  --erd-editor-gray-color-6: #363a3f;
  --erd-editor-gray-color-7: #43484e;
  --erd-editor-gray-color-8: #5a6169;
  --erd-editor-gray-color-9: #696e77;
  --erd-editor-gray-color-10: #777b84;
  --erd-editor-gray-color-11: #b0b4ba;
  --erd-editor-gray-color-12: #edeef0;
  --erd-editor-accent-color-1: #11131f;
  --erd-editor-accent-color-2: #141726;
  --erd-editor-accent-color-3: #182449;
  --erd-editor-accent-color-4: #1d2e62;
  --erd-editor-accent-color-5: #253974;
  --erd-editor-accent-color-6: #304384;
  --erd-editor-accent-color-7: #3a4f97;
  --erd-editor-accent-color-8: #435db1;
  --erd-editor-accent-color-9: #3e63dd;
  --erd-editor-accent-color-10: #5472e4;
  --erd-editor-accent-color-11: #9eb1ff;
  --erd-editor-accent-color-12: #d6e1ff;
  --erd-editor-canvas-background: #212225;
  --erd-editor-canvas-boundary-background: #111113;
  --erd-editor-table-background: #18191b;
  --erd-editor-table-header-background: #2e3135;
  --erd-editor-table-select: #435db1;
  --erd-editor-table-border: #363a3f;
  --erd-editor-table-shadow: transparent;
  --erd-editor-table-group-header-background: #43484e;
  --erd-editor-table-group-background: #d3edf81d;
  --erd-editor-table-group-border: #43484e;
  --erd-editor-memo-background: #18191b;
  --erd-editor-memo-select: #435db1;
  --erd-editor-memo-border: #363a3f;
  --erd-editor-memo-shadow: transparent;
  --erd-editor-column-select: #182449;
  --erd-editor-column-select-hover: #1d2e62;
  --erd-editor-column-hover: #272a2d;
  --erd-editor-column-handle-background: #18191b;
  --erd-editor-column-handle-border: #363a3f;
  --erd-editor-column-handle-hover-background: #2e3135;
  --erd-editor-column-handle-hover-border: #43484e;
  --erd-editor-relationship-hover: #435db1;
  --erd-editor-visualization-link: #43484e;
  --erd-editor-visualization-column: #5a6169;
  --erd-editor-visualization-relationship: #5a6169;
  --erd-editor-toolbar-background: #111113;
  --erd-editor-context-menu-background: #18191b;
  --erd-editor-context-menu-select: #272a2d;
  --erd-editor-context-menu-hover: #3a4f97;
  --erd-editor-context-menu-border: #363a3f;
  --erd-editor-minimap-border: black;
  --erd-editor-minimap-shadow: black;
  --erd-editor-minimap-viewport-border: #3a4f97;
  --erd-editor-minimap-viewport-border-hover: #435db1;
  --erd-editor-toast-background: #18191b;
  --erd-editor-toast-border: #363a3f;
  --erd-editor-toast-success: #3dd68c;
  --erd-editor-toast-error: #ff9592;
  --erd-editor-find-replace-error: #ff9592;
  --erd-editor-map-columns-error: #ff9592;
  --erd-editor-schema-sql-warning-background: #500f1c;
  --erd-editor-schema-sql-warning-foreground: #ff9592;
  --erd-editor-drag-select-background: #253974;
  --erd-editor-drag-select-border: #435db1;
  --erd-editor-scrollbar-track: #ddeaf814;
  --erd-editor-scrollbar-thumb: #696e77;
  --erd-editor-scrollbar-thumb-hover: #777b84;
  --erd-editor-foreground: #b0b4ba;
  --erd-editor-active: #edeef0;
  --erd-editor-placeholder: #e5edfd7b;
  --erd-editor-focus: #435db1;
  --erd-editor-input-active: #5472e4;
  --erd-editor-key-pk: #ffc53d;
  --erd-editor-key-fk: #e54666;
  --erd-editor-key-pfk: #00a2c7;
  --erd-editor-tree-background: #111113;
  --erd-editor-tree-row-hover: #212225;
  --erd-editor-tree-row-current: #1d2e62;
  --erd-editor-tree-muted: #b0b4ba;
  --erd-editor-tree-match: #253974;
  --erd-editor-explorer-background: #111113;
  --erd-editor-explorer-border: #363a3f;
  --erd-editor-dictionary-error-foreground: #ff9592;
  --erd-editor-dictionary-error-background: #500f1c;
  --erd-editor-dictionary-warning-foreground: #ffca16;
  --erd-editor-dictionary-warning-background: #3f2700;
  --erd-editor-dictionary-background: #18191b;
  --erd-editor-dictionary-header-background: #2e3135;
  --erd-editor-dictionary-grid-line: #363a3f;
  --erd-editor-dictionary-header-select: #182449;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-modify-foreground: #ffca16;
  --erd-editor-diff-rename-foreground: #70b8ff;
}
```

</details>

## Limbă de afișare {#display-language}

Începând cu versiunea `4.0.0`, textul propriu al editorului – meniurile, panourile, casetele de dialog, căutarea rapidă, notificările și cuvintele pe care le desenează pe diagramă, de exemplu `unnamed`, inclusiv în imaginile exportate – este disponibil în 25 de limbi. Numele tabelelor și coloanelor, SQL-ul, tipurile de date și codul generat nu se traduc niciodată. Consultați [Limbă și temă](../guide/guides/language-and-theme.md).  
Înainte ca metoda [setLocale](#setlocale) să fie apelată sau să fie aleasă o limbă, editorul afișează engleza sau urmează `'system'` cât timp proprietatea [enableLocalePicker](#enablelocalepicker) este activată.  
Editorul setează `lang` și `dir` pe propria rădăcină, aflată într-un shadow root închis, niciodată pe elementul gazdă sau pe pagină, așa că o pagină de la dreapta la stânga nu inversează editorul, iar o limbă de la dreapta la stânga nu inversează pagina. Ebraica, araba și persana așază interfața editorului de la dreapta la stânga; diagrama în sine nu este niciodată afișată în oglindă. Începând cu versiunea `4.1.0`, [exploratorul](../guide/guides/explorer.md) rămâne în stânga pânzei în orice limbă, iar în aceste trei limbi propriile sale rânduri se citesc de la dreapta la stânga.  
Pachetul exportă tipurile `LocaleCode` (unul dintre codurile de mai jos) și `LocaleOption`.

```ts
type LocaleOption = LocaleCode | 'system';
```

| Cod     | Afișat ca            | Limbă                 |
| ------- | -------------------- | --------------------- |
| `id-ID` | Bahasa Indonesia     | Indoneziană           |
| `de-DE` | Deutsch              | Germană               |
| `en`    | English              | Engleză               |
| `es-ES` | Español              | Spaniolă              |
| `eu-ES` | Euskara              | Bască                 |
| `fr-FR` | Français             | Franceză              |
| `it-IT` | Italiano             | Italiană              |
| `nl-NL` | Nederlands           | Neerlandeză           |
| `pl-PL` | Polski               | Poloneză              |
| `pt-PT` | Português            | Portugheză            |
| `pt-BR` | Português Brasileiro | Portugheză braziliană |
| `ro-RO` | Română               | Română                |
| `sk-SK` | Slovenčina           | Slovacă               |
| `sl-SI` | Slovenščina          | Slovenă               |
| `sv-SE` | Svenska              | Suedeză               |
| `tr-TR` | Türkçe               | Turcă                 |
| `ru-RU` | Русский              | Rusă                  |
| `uk-UA` | Українська           | Ucraineană            |
| `he-IL` | עברית                | Ebraică               |
| `ar-SA` | العربية              | Arabă                 |
| `fa-IR` | فارسی                | Persană               |
| `ja-JP` | 日本語               | Japoneză              |
| `zh-CN` | 简体中文             | Chineză simplificată  |
| `zh-TW` | 繁體中文             | Chineză tradițională  |
| `ko-KR` | 한국어               | Coreeană              |

### setLocale {#setlocale}

Setează limba de afișare: `'system'` sau unul dintre codurile de mai sus. Orice altceva, de exemplu un simplu `'ko'`, un cod necunoscut sau o valoare care nu este șir de caractere, este ignorat fără eroare.  
Se aplică înainte ca metoda să returneze, așa că o limbă setată înainte ca elementul să fie adăugat în DOM apare deja în primul său cadru.  
Nu emite nimic, nici `changeLocale`, nici `change`, și nu atinge nici `value`, nici istoricul anulărilor, nici vreun store partajat.  
Alegerea rămâne indiferent dacă proprietatea `enableLocalePicker` este activată sau dezactivată, iar `setLocale('system')` urmează sistemul și cu selectorul dezactivat.  
Editorul nu stochează nimic. Pentru a păstra alegerea unui cititor, ascultați [changeLocale](#changelocale) și transmiteți-o înapoi la următoarea încărcare.

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale {#setsystemlocale}

Indică limba pe care o reprezintă `'system'`, ca etichetă BCP 47, pentru o aplicație gazdă cu propria limbă de afișare. Aplicațiile gazdă VS Code, JetBrains și Obsidian o apelează cu propria limbă de afișare.  
Spațiile de la capetele etichetei sunt eliminate. `null`, un șir gol sau o valoare care nu este șir de caractere revine la `navigator.languages` al browserului, pe care editorul îl urmează pe măsură ce se schimbă.  
Contează doar cât timp opțiunea în vigoare este `'system'` și se aplică imediat. Rândul `System` al selectorului afișează limba la care se rezolvă.  
Eticheta sau, pe rând, fiecare dintre limbile browserului se rezolvă la prima limbă pe care o are editorul, după subeticheta de limbă, indiferent de majuscule și de caracterele de subliniere: `de-AT` dă `de-DE`, iar `en-GB` dă `en`. Chineza se stabilește după sistemul de scriere, `Hant` dând `zh-TW` și `Hans` dând `zh-CN`, iar în lipsa acestuia după regiune, `TW`, `HK` și `MO` dând `zh-TW` și oricare alta `zh-CN`. `pt` dă `pt-BR`, cu excepția cazului în care este indicată o altă regiune decât `BR`. Când nimic nu se potrivește, editorul afișează engleza.

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL {#setschemasql}

Încarcă un fișier Schemă SQL.  
Implicit, înlocuiește documentul curent în loc să îl îmbine cu acesta; consultați opțiunea `mode` de mai jos. Setările existente se păstrează, inclusiv fiecare blocare și valoarea sa blocată, cu excepția poziției vizualizării și a nivelului de zoom, iar tabelele sunt plasate după citirea fișierului, pe rânduri, dacă opțiunea `placement` de mai jos nu cere altceva. Cu setarea `Viewport` blocată, `value` scrie apoi vizualizarea cu care începe importul, originea `0, 0` la nivelul de zoom `1`. Prin urmare, un document importat într-un element care nu a primit niciodată o valoare are toate blocările activate, la fel ca un document nou.  
Începând cu versiunea `4.2.0`, o înlocuire păstrează și cuvintele, termenii și domeniile documentului, pe care textul nu le poate conține, împreună cu istoricul anulărilor fiecărei foi din fila Dicționar, iar o anulare sau o refacere a importului le păstrează și ea. Un apel [setSchemaJSON](#setschemajson) care înlocuiește documentul și atribuirea proprietății `value` le preiau în schimb pe cele pe care le conține documentul lor.  
Se înregistrează în istoric, permițând `Undo, Redo`, și emite `change`. Un șir gol este ignorat, iar apelul nu face nimic cât timp `readonly` este setat.  
`setSchemaGraphQL`, `setSchemaDBML` și `setSchemaAML` se comportă la fel, iar parserele lor nu eșuează niciodată: un text pe care nu îl pot citi încarcă un document gol în loc să genereze o eroare.  
Începând cu versiunea `4.0.0`, toate patru acceptă un al doilea argument opțional, `{ placement, mode }`:

- `placement: 'grid'`, valoarea implicită, plasează imediat tabelele pe rânduri, ca înainte, iar apelul nu returnează nimic.
- `placement: 'auto'` aranjează mai întâi tabelele după relațiile lor, așa cum face `Import` în editor, și returnează un `Promise` care se rezolvă după ce importul a fost plasat ca un singur pas de anulare. Mai puțin de două tabele, nicio relație, o aranjare care eșuează, o pagină fără `SharedWorker` sau butonul `Cancel` din notificarea `Placing tables` le plasează în schimb pe rânduri. O încărcare între timp – un alt import care înlocuiește documentul, atribuirea proprietății `value`, `setInitialValue()`, `clear()`, încărcarea unui colaborator sau o anulare ori refacere a unei încărcări sau a apelului `clear()` – îi ia locul, iar obiectul `Promise` se rezolvă fără să se fi încărcat nimic. Importurile plasate astfel ajung în ordinea în care au început.
- `mode: 'replace'`, valoarea implicită, înlocuiește documentul. `mode: 'append'` adaugă fișierul sub diagramă, așa cum face [Import și adăugare](../guide/guides/file-import-export.md#import-and-add), lăsând neschimbate toate tabelele deja existente, precum și toate setările, cu excepția filei și a poziției vizualizării. Dintr-o altă filă, fila ERD apare mai întâi. Tabelele noi și grupurile de tabele aduse de un fișier DBML cât timp grupurile de tabele sunt afișate devin selecția, iar vizualizarea derulează până la ele, dacă nu sunt deja bine vizibile, după regula pe care o urmează orice salt începând cu versiunea `4.1.0` (consultați [Unde ajunge un salt](../guide/guides/table-related-functions.md#where-a-jump-lands)). O singură anulare elimină întreaga adăugare. Un text pe care nu îl poate citi nu adaugă nimic și lasă documentul neschimbat.

Cât timp `readonly` este setat, o înlocuire este ignorată, o adăugare nu adaugă nimic, iar un apel cu `placement: 'auto'` se rezolvă imediat.  
Începând cu versiunea `3.10.0`, `setSchemaSQL` citește fișierul pentru baza de date curentă a documentului: cu Databricks selectat, șirurile între apostrofuri urmează secvențele de escape cu backslash din Spark. Consultați [Comentarii](../guide/guides/file-import-export.md#comments).  
Începând cu versiunea `3.10.0`, `setSchemaSQL` citește o constrângere `UNIQUE` pe două sau mai multe coloane ca un singur index unic, nu ca un indicator unic pe fiecare coloană. Consultați [Chei unice și indexuri](../guide/guides/file-import-export.md#unique-keys-and-indexes).  
Începând cu versiunea `3.10.0`, importurile SQL, DBML și AML păstrează acțiunile `ON DELETE` și `ON UPDATE` ale cheilor străine pe care le citesc.  
Începând cu versiunea `4.0.0`, `setSchemaSQL` păstrează întreaga expresie `DEFAULT` a unei coloane, citește `ADD DEFAULT … FOR` și comentariile `MS_Description` din SQL Server, transformă coloanele de tip serial și identity din PostgreSQL în autoincrementare, păstrează `UNSIGNED` și `ZEROFILL` într-un tip de date și citește o cheie primară pe care `ALTER TABLE … ADD PRIMARY KEY` o marchează `CLUSTERED`, `NONCLUSTERED` sau `USING BTREE`. Consultați [Schemă SQL](../guide/guides/file-import-export.md#schema-sql).  
Pentru sintaxa acceptată de fiecare parser, consultați [Importarea sau exportarea fișierelor](../guide/guides/file-import-export.md).

```ts
type SetSchema = {
  (
    value: string,
    options: { placement: 'auto'; mode?: 'replace' | 'append' }
  ): Promise<void>;
  (
    value: string,
    options?: { placement?: 'grid'; mode?: 'replace' | 'append' }
  ): void;
};

// example
editor.setSchemaSQL('Schema SQL...');
// or
await editor.setSchemaSQL('Schema SQL...', { placement: 'auto' });
// or
editor.setSchemaSQL('Schema SQL...', { mode: 'append' });
```

## setSchemaGraphQL {#setschemagraphql}

Încarcă un document GraphQL SDL.  
Definițiile de tip obiect devin tabele, iar un câmp al cărui tip este un alt tabel devine o relație.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML {#setschemadbml}

Încarcă un fișier DBML, formatul folosit de dbdiagram.io și dbdocs.  
Începând cu versiunea `4.0.0`, fiecare `TableGroup` devine un [grup de tabele](../guide/guides/table-groups.md), iar atributul `headercolor` al unui tabel devine culoarea acestuia. Consultați [DBML](../guide/guides/file-import-export.md#dbml).

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML {#setschemaaml}

Încarcă un fișier AML (Azimutt Markup Language). Sunt acceptate atât varianta actuală, cât și varianta veche v1.  
Începând cu versiunea `4.0.0`, culoarea unei entități, unul dintre numele de culori Azimutt sau o valoare hexazecimală între ghilimele, devine culoarea tabelului său. Consultați [AML](../guide/guides/file-import-export.md#aml).

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON {#setschemajson}

Începând cu versiunea `4.0.0`, încarcă un document `.erd.json`, de exemplu textul returnat de [value](#value).  
În modul implicit `mode: 'replace'`, încarcă documentul la fel ca atribuirea proprietății `value`: se înregistrează în istoric, emite `change` și preia blocările documentului în același mod, iar, începând cu versiunea `4.2.0`, cuvintele, termenii și domeniile documentului le înlocuiesc pe cele ale editorului. Spre deosebire de `value`, un șir gol sau o valoare care nu este șir de caractere este ignorat în loc să pornească un document nou. Un text care nu este JSON golește documentul, la fel ca la `value`.  
`mode: 'append'` adaugă sub diagramă tabelele, relațiile, indexurile, notele și grupurile de tabele ale documentului, cu ID-uri noi, păstrându-le pozițiile relative și omițând setările documentului, așa cum face [Import și adăugare](../guide/guides/file-import-export.md#import-and-add) cu un fișier `json`. Începând cu versiunea `4.2.0`, păstrează numele logice și indicatorii de nume derivat ai tabelelor și coloanelor, dar lasă deoparte cuvintele, termenii și domeniile documentului, așa că niciuna dintre coloanele sale nu este legată de un domeniu. Un text pe care nu îl poate citi sau un document fără niciun tabel și fără nicio notă nu adaugă nimic. Altfel, adăugarea se plasează ca o adăugare făcută cu [setSchemaSQL](#setschemasql), cu notele și grupurile de tabele noi selectate împreună cu tabelele, fiecare tip cât timp este afișat.  
Returnează după ce documentul a fost plasat și este ignorată cât timp `readonly` este setat.

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL {#getschemasql}

Exportă starea curentă a editorului ca Schemă SQL.  
Dacă `databaseVendor` nu este specificat, scrie pentru baza de date pe care o afișează editorul: cea a documentului, cu excepția cazului în care cititorul unui editor [doar în citire](#readonly) a ales alta, care începând cu versiunea `5.0.0` rămâne pe acel ecran și este cea pe care o afișează fila sa Schemă SQL. Un nume care nu se află în lista de mai jos este tratat la fel, fără a genera o eroare.
Numele sunt delimitate cu tipul de delimitator afișat de editor. Cât timp setarea `Bracket Type` este [blocată](../guide/guides/settings.md#lock), sau într-un editor doar în citire al cărui cititor a ales altul, începând cu versiunea `5.0.0`, acesta poate diferi de cel salvat de `value`, care este cel cu care delimitează numele instrumentul [`erd_read`](../mcp/tools.md#reading-a-document) al unui agent de programare. Numele scrise sunt întotdeauna cele fizice, indiferent de modul de afișare a numelor.
Începând cu versiunea `4.0.0`, un argument opțional `options` alege instrucțiunile și antetul, așa cum fac opțiunile filei [Schemă SQL](../guide/guides/schema-sql.md), iar, începând cu versiunea `4.2.0`, și dacă numele logice completează comentariile goale. `SchemaSQLOptions` este exportat ca tip.

- `statements`: `'create'`, valoarea implicită; `'ifNotExists'`, care scrie `IF NOT EXISTS` pe MySQL, MariaDB, PostgreSQL, SQLite și Databricks și revine la `'create'` în rest; sau `'recreate'`, care șterge tabelele înainte de a le crea, Snowflake scriind în schimb `CREATE OR REPLACE TABLE`.
- `header`: `'none'`, valoarea implicită; `'use'`, care trece la baza de date sau schema documentului; sau `'createAndUse'`, care mai întâi o creează, dacă nu există, apoi trece la ea. O bază de date care nu are varianta cerută revine la alta, așa cum face fila: Oracle scrie `'use'` pentru `'createAndUse'`, PostgreSQL nu scrie niciun antet pentru `'use'`, iar SQLite nu scrie niciunul. Un antet se scrie doar cât timp numele bazei de date a documentului este un identificator simplu: litere ASCII, cifre și `_`, fără a începe cu o cifră.
- `logicalNameAsComment`, începând cu versiunea `4.2.0`: `true` scrie numele logic al unui tabel sau al unei coloane drept comentariu al acestuia acolo unde propriul comentariu este gol sau conține doar spații albe, iar numele logic nu este gol, în forma în care baza de date respectivă scrie un comentariu. Un comentariu cu text se scrie ca înainte. Doar `true` activează opțiunea: omisă, `false` sau orice altă valoare, de exemplu `'true'` sau `1`, nu scrie niciun nume logic. Face ce face comutatorul [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments) al filei.

O opțiune omisă sau una cu o valoare necunoscută se citește ca valoarea sa implicită, așa că un apel fără opțiuni scrie instrucțiuni `CREATE` simple, fără antet, ca înainte.  
Începând cu versiunea `4.0.0`, rezultatul include întotdeauna scripturile `Before tables` și `After tables` ale documentului, în ordinea: antet, scriptul de dinainte, instrucțiunile DROP, tabelele, scriptul de după. Opțiunile proprii `Statements`, `Header`, `Write logical names into empty comments` și `Tables` ale filei Schemă SQL nu afectează niciodată acest apel, care scrie întotdeauna întregul document.  
Începând cu versiunea `3.10.0`, fiecare cheie străină conține clauzele `ON DELETE` și `ON UPDATE` ale relației. O clauză se scrie doar când acțiunea sa este setată și sistemul de baze de date o acceptă, așa că o acțiune pe care acel sistem nu o acceptă este omisă și se aplică valoarea sa implicită. Începând cu versiunea `4.0.0`, Snowflake acceptă doar `NO ACTION`. Pentru ce scrie fiecare bază de date, consultați [ON DELETE și ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).  
Începând cu versiunea `3.10.0`, un apostrof dintr-un comentariu de tabel sau de coloană este scris cu escape, așa că un comentariu precum `it's` nu mai strică instrucțiunea. Fiecare sistem de baze de date care scrie comentariile ca literali de tip șir îl dublează, cu excepția Databricks, care pune un backslash înaintea fiecărui apostrof și a fiecărui backslash. SQLite scrie în continuare comentariile ca linii `--`.  
Începând cu versiunea `4.2.0`, SQL Server scrie fiecare comentariu ca literal național, `N'…'`, așa că textul din afara paginii de cod a bazei de date, de exemplu cel în coreeană, se păstrează. Oracle scrie fiecare șir de linii goale dintr-un comentariu ca o singură trecere la linie nouă, iar SQLite scrie trecerile la linie nouă dintr-un comentariu ca spații, așa că acesta rămâne pe linia sa `--`. Consultați [Comentarii](../guide/guides/schema-sql.md#comments).  
Începând cu versiunea `4.0.0`, mai multe baze de date scriu diferit și numele cheilor, valorile implicite și autoincrementarea. Consultați [Ce scrie codul DDL](../guide/guides/schema-sql.md#what-the-ddl-writes).

```ts
type DatabaseVendor =
  | 'Databricks'
  | 'MariaDB'
  | 'MSSQL'
  | 'MySQL'
  | 'Oracle'
  | 'PostgreSQL'
  | 'Snowflake'
  | 'SQLite';

type SchemaSQLOptions = {
  statements?: 'create' | 'ifNotExists' | 'recreate';
  header?: 'none' | 'use' | 'createAndUse';
  logicalNameAsComment?: boolean;
};

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
// or
const mysqlSQL = editor.getSchemaSQL('MySQL', {
  statements: 'ifNotExists',
  header: 'createAndUse',
});
// or
const commentedSQL = editor.getSchemaSQL('PostgreSQL', {
  logicalNameAsComment: true,
});
```

## getSharedStore {#getsharedstore}

Returnează un store pentru editarea colaborativă în timp real.  
`config` este `{ getNickname?, mouseTracker?, focusTracker? }`. Ambele opțiuni de urmărire au valoarea implicită `true`: `mouseTracker` difuzează cursorul acestui editor către celelalte, iar `focusTracker` difuzează celula sa activă, selecția și caseta de selecție.  
Începând cu versiunea `5.0.0`, store-ul nu trimite nicio schimbare cât timp [readonly](#readonly) este setat, ci doar ce trimit trackerele sale și registrele pe care le cere un editor care se alătură, și aplică în continuare ce trimit ceilalți.
Consultați [Editare colaborativă](./advanced/collaborative-editing.md).

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue {#setdiffvalue}

Deschide vizualizatorul de diferențe, comparând documentul deschis în prezent cu cel transmis.  
Nu returnează nimic și nu modifică documentul, așa că închiderea vizualizatorului lasă editorul exact cum era.  
O valoare goală sau orice nu este șir de caractere este comparată cu un document gol.  
Este același strat suprapus ca cel deschis de elementul [Vizualizator de diferențe](../guide/guides/table-related-functions.md#diff-viewer) din meniul contextual al pânzei.  
Începând cu versiunea `4.1.0`, asociază conținutul celor două documente mai întâi după ID și abia apoi după ceea ce păstrează fiecare element, de exemplu numele unui tabel sau textul unei note (consultați [Ce se compară](../guide/guides/table-related-functions.md#what-is-compared)). Prin urmare, față de o versiune anterioară a aceluiași document, de exemplu o revizie Git a fișierului său, o redenumire apare ca un singur element redenumit; față de un document ale cărui ID-uri diferă, apare ca o eliminare și o adăugare. Vizualizatorul listează modificările într-un arbore lângă cele două documente și le marchează cu culori în loc să umple celulele.  
Începând cu versiunea `4.2.0`, ambele documente se deschid în modul de afișare a numelor pe care îl afișează acest editor, indiferent ce a salvat documentul transmis, iar arborele numește tabelele și coloanele tot după acesta (consultați [Dincolo de pânză](../guide/guides/logical-names.md#beyond-the-canvas)). Numele logice, legăturile cu domeniile și dicționarele nu se compară, așa că o modificare doar a acestora nu apare ca modificare.

```js
editor.setDiffValue('prev json...');
```
