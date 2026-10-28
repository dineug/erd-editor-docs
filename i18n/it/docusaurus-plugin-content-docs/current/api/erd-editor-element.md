---
sidebar_position: 2
description: L’API dell’elemento erd-editor — registrazione, attributi, value e runtimeValue, eventi, temi, lingua di visualizzazione, schermata di benvenuto, associazioni di tasti, importazione ed esportazione dello schema.
---

# ErdEditorElement

L’editor è un semplice `HTMLElement`, il tag `<erd-editor>` che l’importazione di `@dineug/erd-editor/erd-editor.js` definisce.  
Dalla versione `5.0.0` l’importazione della radice del pacchetto non definisce alcun tag. La radice esporta `ErdEditorElement` sia come tipo sia come classe dell’elemento, e `defineErdEditor()`, che definisce il tag nel punto in cui viene chiamata — vedere [Registrare gli elementi](./installation.md#registering-the-elements).  
Per una pagina che si limita a mostrare un diagramma, [`<erd-viewer>`](./erd-viewer-element.md) è un elemento di sola lettura a sé stante.

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
```

La sua definizione di tipo è la seguente.

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

L’editor esegue il rendering in uno shadow root chiuso, quindi `editor.shadowRoot` è `null` e gli stili della pagina non entrano né escono.  
Nessun elemento interno è raggiungibile con un selettore — per applicare gli stili usare invece [setTheme](#settheme) e le proprietà personalizzate `--erd-editor-*`.

`readonly`, `system-dark-mode`, `enable-theme-builder`, `enable-locale-picker` ed `enable-welcome-screen` sono gli unici attributi, e tutti e cinque valgono `false` per impostazione predefinita. Gli ultimi due sono stati introdotti nella versione `4.0.0`. Ciascuno legge il proprio valore come descritto in [readonly](#readonly).

Dalla versione `4.1.0` la scheda ERD dispone del pannello [Esplora](../guide/guides/explorer.md), un albero del diagramma ancorato a sinistra dell’area di disegno con Trova e sostituisci in alto. Nessun attributo, proprietà, metodo o evento lo apre, lo chiude o ne segnala lo stato: si apre dal pulsante `Explorer` della barra degli strumenti, dalla voce `Toggle Explorer` della Ricerca rapida o del menu contestuale dell’area di disegno, oppure con l’associazione [`findReplace`](#setkeybindingmap).  
Ogni elemento parte con il pannello chiuso. Lo stato di apertura, la larghezza, lo stato di compressione e la ricerca durano quanto l’elemento, attraverso i cambi di scheda e ogni caricamento, `setInitialValue` compreso, e non compaiono mai in `value`, in `runtimeValue`, nella cronologia delle modifiche o in uno store condiviso.

Dalla versione `4.2.0` le tabelle e le colonne possono avere [nomi logici](../guide/guides/logical-names.md) accanto ai loro nomi, e la Visualizzazione nomi, un’impostazione del documento come la scheda, determina se l’area di disegno disegna i loro nomi, i loro nomi logici o entrambi.  
La barra degli strumenti dispone anche della scheda [Dizionario](../guide/guides/dictionary.md), tra `Code Generator` e `Settings`, che contiene le parole, i termini e i domini del documento e un foglio `Checks`. È una scheda come le altre: il suo `canvasType`, `'@dineug/erd-editor/builtin-dictionary'`, è conservato dal blocco `Canvas Type`, quindi un testo salvato su di essa si apre su di essa tramite [setInitialValue](#setinitialvalue), e il passaggio a essa viene scritto in `value` ed emette [change](#change) solo mentre quel blocco è disattivato. Nessun attributo, proprietà, metodo o evento proprio la apre o ne segnala lo stato. Le sue modifiche sono modifiche del documento: compaiono in `value`, emettono [change](#change) e raggiungono i collaboratori, ma il loro annullamento e la loro ripetizione seguono la cronologia propria di ciascun foglio, non quella del documento.  
La posizione all’interno della scheda — quale foglio è mostrato, all’inizio `Domains`, e la ricerca, la selezione, lo scorrimento e le larghezze delle colonne di ciascun foglio — dura quanto l’elemento, attraverso i cambi di scheda e ogni caricamento, e non compare mai in `value`, in `runtimeValue`, in una cronologia delle modifiche o in uno store condiviso.  
L’interfaccia `ErdEditorElement` non acquisisce alcun membro. L’API aggiunge `logicalNameAsComment` nelle opzioni di [getSchemaSQL](#getschemasql), dodici [token del tema](#settheme) e l’esportazione [dictionaryRowChords](#dictionaryrowchords).

## readonly {#readonly}

Imposta la capacità di modifica dell’editor.  
Mentre è impostato, l’assegnazione di `value`, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, `setSchemaJSON()`, Annulla e Ripeti, dalla versione `4.2.0` compresi quelli di un foglio della scheda Dizionario, vengono tutti ignorati, e l’evento `change` non viene mai emesso. Per caricare un documento, usare invece [setInitialValue](#setinitialvalue).  
Dalla versione `5.0.0` un editor di sola lettura è un lettore anziché un editor con i controlli disabilitati. Mantiene le sue sei schede, il pannello [Esplora](../guide/guides/explorer.md#read-only-editors), la minimappa, la Ricerca rapida, Proprietà tabella, il [Visualizzatore differenze](../guide/guides/table-related-functions.md#diff-viewer), `Export`, la modalità Zen e i cursori, il focus e le selezioni dei collaboratori, e ogni controllo che modificherebbe il diagramma viene omesso anziché disegnato disabilitato. Prima della versione `5.0.0` molti dei suoi controlli di modifica venivano ancora disegnati, e l’editor scartava ciò che inviavano.

Nella scheda ERD un trascinamento sposta la vista ovunque inizi, anche su una tabella, e una pressione non seleziona, non sposta e non apre nulla. Il puntatore fermo su una tabella ne evidenzia le relazioni, un clic fermo su una tabella o su una relazione mantiene quell’evidenziazione, e un clic fermo in qualsiasi altro punto la spegne, come in [`<erd-viewer>`](./erd-viewer-element.md). L’unica selezione è il contorno che lascia un salto: andare a una riga di Esplora, a una delle sue corrispondenze di Trova o a un risultato della Ricerca rapida dopo `#`, `@` o `:` seleziona ciò che raggiunge, e il successivo clic fermo la cancella. La copia copia ciò che quella selezione contiene.  
La [barra degli strumenti dell’area di disegno](../guide/guides/table-related-functions.md#canvas-toolbar) conserva `Zoom out`, il livello di zoom (`Reset zoom`), `Zoom in`, l’elenco della Visualizzazione nomi, `Zen Mode` e la bussola, senza `Hand` né `Select`, senza `New Table`, `New Memo` o `New Table Group`, e senza i pulsanti delle relazioni. Il menu dell’area di disegno conserva `View Option`, `Name View`, `Export` e `Diff Viewer`, il menu della tabella conserva `Table Properties`, e un memo, una relazione o un gruppo di tabelle non aprono alcun menu. La Ricerca rapida nella scheda ERD non elenca nessuna riga che scriva il diagramma: conserva `Tab`, `Name View`, `Database`, `Export`, `Toggle Explorer`, le righe `Theme` e `Display Language` che [enableThemeBuilder](#enablethemebuilder) e [enableLocalePicker](#enablelocalepicker) attivano, e le ricerche `#`, `@` e `:`. Nelle altre schede elenca ciò che elenca in un editor modificabile. La barra degli strumenti mostra il nome del database come testo e nessun pulsante `Undo`, `Redo` o `Time Travel`.  
Nulla offre `Import`, [`Import and Add`](../guide/guides/file-import-export.md#import-and-add), `Auto Layout`, una riga di gruppo di tabelle (vedere [Gruppi di tabelle](../guide/guides/table-groups.md#read-only-editors)) né [`Map Columns`](../guide/guides/relationship-editing.md#map-columns), e non compare alcuna [schermata di benvenuto](#enablewelcomescreen).  
Le associazioni che aggiungono, rimuovono o modificano non fanno nulla: `edit`, `addTable`, `addColumn`, `addMemo`, `addTableGroup`, `groupSelectedTables`, `removeTable`, `removeColumn`, `removeSelection`, `primaryKey`, `selectAllTable`, `selectAllColumn`, le quattro associazioni delle relazioni e `handTool`, ciascuna ancora impedita come indica la sua opzione. Anche un’operazione di incolla e `Tab` non fanno nulla e raggiungono la pagina senza essere impediti. Le associazioni dello zoom, `zenMode`, `focusView`, `tableProperties` sulla tabella selezionata da un salto, `search`, `findReplace`, la copia, `Escape` e i tasti freccia continuano a funzionare. Non si apre alcun editor del nome di una cella, di un memo o di un gruppo di tabelle, e non viene disegnata alcuna relazione.

[Trova e sostituisci](../guide/guides/find-and-replace.md#read-only-editors), in cima al pannello Esplora, si limita a cercare, senza la freccia `Toggle Replace` e senza la riga Sostituisci. Il pannello è intitolato `Explorer` e il tooltip del pulsante della barra degli strumenti è `Explorer (Ctrl + F)` (Windows/Linux) o `Explorer (⌘ + F)` (Mac) in ogni editor. Il pannello Esplora si apre in un editor di sola lettura dalla versione `4.1.0`; dalla `3.10.0` alla `4.0.0` Trova e sostituisci vi si apriva come pannello mobile di sola ricerca intitolato `Find`.  
Proprietà tabella si apre dal menu della tabella o dall’associazione `tableProperties` e, dalla versione `3.10.0`, mostra l’etichetta `Read only` accanto al titolo, mentre la sua scheda `Indexes` non consente modifiche — vedere [Proprietà tabella](../guide/guides/table-related-functions.md#table-properties).  
La scheda Impostazioni riporta la stessa etichetta `Read only` e mostra ogni impostazione in un controllo che non accetta pressioni: i suoi due interruttori, il campo `Maximum comment width` e i sette pulsanti `Lock` sono disabilitati, e le righe di `Column Order` non si trascinano. Gli script `Before tables` e `After tables` della scheda Schema SQL non accettano digitazione. La scheda [Visualizzazione](../guide/guides/visualization.md) funziona come in un editor modificabile, poiché nulla lì modifica il documento; `Previous table` e `Next table` della modalità Flusso continuano a spostarsi di un passo, con i loro pulsanti o con i tasti per annullare e ripetere.  
La scheda [Dizionario](../guide/guides/dictionary.md#read-only-editors) si apre comunque: è possibile passare da un foglio all’altro e, nei fogli, cercare, selezionare, scorrere e copiare, e una riga del foglio `Checks` porta comunque all’elemento che indica. Nessuna cella accetta una modifica, un’operazione di incolla o una cancellazione, la scheda non mostra gli strumenti `Add Row`, `Delete Rows`, `Import CSV` o `Export CSV` né alcun menu sulla griglia, e le sue combinazioni di tasti per le righe non inseriscono né eliminano nulla. Il menu della tabella, il menu dell’area di disegno e la Ricerca rapida non offrono [`Derive Physical Names Again`](../guide/guides/dictionary.md#derive-physical-names-again) né `Derive Physical Name Again`.

Dalla versione `5.0.0` le impostazioni che un lettore può ancora cambiare restano sullo schermo di quell’editor: lo scorrimento e lo zoom, la scheda, il database, il linguaggio del Generatore di codice, entrambi gli stili dei nomi, il tipo di delimitatore, le righe di `View Option` e la [Visualizzazione nomi](../guide/guides/logical-names.md#read-only-editors) da ciascuno dei suoi selettori, che resta sullo schermo dalla versione `4.2.0`. Qualunque cosa indichino i loro [blocchi](../guide/guides/settings.md#lock), nessuna di esse raggiunge `value`, `runtimeValue`, l’esportazione `json`, la cronologia di annullamento, l’evento [change](#change) o uno store condiviso, quindi `value` mantiene le impostazioni del documento comunque il lettore lo guardi. I pannelli delle opzioni di [Schema SQL](../guide/guides/schema-sql.md#read-only-editors) e del Generatore di codice indicano queste impostazioni con `This window only` finché `readonly` è impostato, mentre quelli di un editor modificabile riportano `Saved in the document`. Ciò che le due schede mostrano, copiano e salvano segue lo schermo, e lo stesso vale per [getSchemaSQL](#getschemasql) chiamato senza un fornitore.  
Prima della versione `5.0.0` lo scorrimento, lo zoom, il cambio di scheda, il database e le impostazioni del codice di un lettore andavano a `value` finché nessun blocco li tratteneva, cosa che il database non ha mai, e uno store condiviso li inviava agli altri editor.  
Le scelte `This window only` proprie della scheda Schema SQL, `Statements`, `Header`, dalla versione `4.2.0` `Write logical names into empty comments`, e `Tables`, non vengono mai salvate in nessun editor e continuano ad applicarsi, e lo stesso vale per la finestra di dialogo [`Export image`](../guide/guides/file-import-export.md#image), il generatore di temi e il selettore della lingua di visualizzazione. Una scelta nel generatore di temi o nel selettore della lingua di visualizzazione emette comunque [changePresetTheme](#changepresettheme) o [changeLocale](#changelocale).

Finché è impostato, nulla entra nella cronologia di annullamento, nemmeno uno scorrimento o uno zoom, e uno [store condiviso](#getsharedstore) dell’editor non invia alcun cambio: solo ciò che inviano i suoi tracker del cursore, del focus, della selezione e del riquadro di trascinamento del lettore, e i registri che un altro editor richiede quando si unisce (vedere [Modifica collaborativa](./advanced/collaborative-editing.md)). Applica comunque ogni cambio inviato dagli altri. Un cambio del database, di un’impostazione del Generatore di codice o di una riga di `View Option` raggiunge il documento, e anche lo schermo a meno che il lettore non abbia cambiato quell’impostazione proprio lì, e un cambio condiviso della Visualizzazione nomi compare comunque sullo schermo.

Attivarlo termina ciò che era aperto: l’editor del nome di una cella, di un memo o di un gruppo di tabelle, una relazione in corso di disegno, un trascinamento di una tabella, di un memo, di un gruppo di tabelle o di una colonna, le copie di un trascinamento con Alt, il ridimensionamento di un memo o di un gruppo di tabelle, un’anteprima o un posizionamento del Layout automatico ancora in corso, `Map Columns`, il Viaggio nel tempo e il selettore di colore. Cancella la selezione, abbassa lo strumento Mano e invia prima ciò che ogni store condiviso trattiene ancora di un trascinamento o di uno scorrimento, come fa [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers). Proprietà tabella, ora di sola lettura, il Visualizzatore differenze e la finestra di dialogo `Export image` restano aperti, e lo scorrimento, lo zoom, la scheda e la Visualizzazione nomi restano com’erano. Un elemento già di sola lettura al primo montaggio parte allo stesso modo, e uno che un host sposta nella pagina mantiene il contorno lasciato da un salto.  
Disattivarlo riporta i controlli di modifica, senza nulla di selezionato o aperto. Il database, il linguaggio del Generatore di codice, entrambi gli stili dei nomi, il tipo di delimitatore e le righe di `View Option` tornano a quelli del documento, mentre lo scorrimento, lo zoom, la scheda e la Visualizzazione nomi restano dove il lettore li ha lasciati e `value` mantiene quelli del documento finché il lettore non li cambia di nuovo. Nessuno dei due passaggi emette `change`.  
Un attributo senza valore, `=""` e `="true"` vengono tutti letti come `true`. `="false"` viene letto come `false`, e così qualsiasi altra stringa — compresa la forma idiomatica HTML `readonly="readonly"`.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode {#systemdarkmode}

Determina se sincronizzarsi automaticamente con la modalità scura/chiara del sistema.  
Dalla versione `4.0.0` attivarlo imposta la proprietà `appearance` del tema su `'system'`, come fa `setPresetTheme({ appearance: 'system' })`. L’editor mostra quindi l’aspetto chiaro o scuro indicato dal sistema operativo, o quello specificato da [setSystemAppearance](#setsystemappearance), e cambia quando questo cambia.  
Una successiva chiamata a [setPresetTheme](#setpresettheme) con `'light'` o `'dark'`, o la scelta di `Light` o `Dark` nel generatore di temi o nella Ricerca rapida, sostituisce `'system'` e rimane: il successivo cambiamento del sistema operativo non la sovrascrive più, anche se `systemDarkMode` è ancora `true`. Prima della versione `4.0.0` il successivo cambiamento del sistema operativo la sovrascriveva.  
Disattivarlo mentre l’aspetto è `'system'` mantiene l’aspetto chiaro o scuro mostrato in quel momento. Disattivarlo dopo che l’aspetto è stato cambiato da `'system'` a un altro valore lo lascia invariato.  
Modificarlo non emette alcun evento.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder {#enablethemebuilder}

Determina se viene fornita un’interfaccia per impostare facilmente i temi preimpostati.  
Mostra il pulsante `Theme` della barra degli strumenti, che apre il generatore di temi con `Accent color`, `Gray color` e `Appearance`. Dalla versione `4.0.0` l’opzione `Appearance` offre `System` accanto a `Light` e `Dark` e, mentre questa opzione è attiva, la Ricerca rapida elenca `Theme` con `System`, `Light` e `Dark`. Vedere [Lingua e tema](../guide/guides/language-and-theme.md).

![Apertura del generatore di temi dalla barra degli strumenti, scelta del colore principale e della tonalità di grigio, e passaggio dell’aspetto a Light e poi a System](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

Modificare il tema preimpostato da questo pannello, o dalla Ricerca rapida, emette l’evento [changePresetTheme](#changepresettheme).

## enableLocalePicker {#enablelocalepicker}

Dalla versione `4.0.0`, determina se viene fornita un’interfaccia per scegliere la lingua di visualizzazione dell’editor.  
Mostra il pulsante `Display Language` della barra degli strumenti, dopo `Theme` quando sono mostrati entrambi. Il pulsante apre il selettore della lingua di visualizzazione, e la Ricerca rapida elenca `Display Language`. Entrambi offrono `System` e le 25 lingue — vedere [Lingua e tema](../guide/guides/language-and-theme.md).  
Determina anche cosa mostra un editor prima che venga chiamato [setLocale](#setlocale) o scelta una lingua: `'system'` quando è attivo, l’inglese quando è disattivato, quindi un elemento che non configura nulla mantiene l’inglese che ha sempre mostrato. Attivarlo o disattivarlo passa immediatamente dall’uno all’altro. Una volta impostata o scelta una lingua, quella scelta rimane, che l’opzione sia attiva o disattivata.  
Impostarlo prima di aggiungere l’elemento perché già il primo frame segua `'system'`.  
Una scelta emette [changeLocale](#changelocale).

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen {#enablewelcomescreen}

Dalla versione `4.0.0`, determina se un diagramma vuoto accoglie l’utente con la [schermata di benvenuto](../guide/guides/editing-start.md#welcome-screen).  
Si sovrappone alla scheda ERD mentre il documento non contiene tabelle, memo visibili né gruppi di tabelle visibili. Non viene mostrata mentre `readonly` è impostato, in modalità Zen, o mentre sono aperti Proprietà tabella, il Visualizzatore differenze, il Viaggio nel tempo o l’anteprima del Layout automatico. La prima tabella, il primo memo visibile o il primo gruppo di tabelle visibile la fa sparire, e un annullamento che riporta a un diagramma vuoto la fa ricomparire.  
Le sue voci `New Table`, `New Memo` e `Command Palette` mostrano la prima combinazione di tasti di `addTable`, `addMemo` e `search` così come le ha lasciate [setKeyBindingMap](#setkeybindingmap), e nessuna per un nome lasciato vuoto. Le sue frecce indicano i pulsanti `Theme` e `Display Language` solo dove `enableThemeBuilder` ed `enableLocalePicker` li mostrano.  
Nel suo menu, `↑`, `↓`, `Home` ed `End` spostano il focus tra le voci, con l’azione predefinita impedita e la propagazione interrotta. Per `Enter` e `Space` la propagazione viene interrotta, ma l’azione predefinita non viene impedita, così li riceve la voce con il focus, e `Escape` tra i formati di `Import` torna indietro, con l’azione predefinita impedita e la propagazione interrotta. Ogni altro tasto raggiunge l’editor e la pagina come di consueto.  
Non modifica nulla nel documento, quindi lascia `value` invariato e non emette alcun `change`.  
Attivarlo dopo che [setInitialValue](#setinitialvalue) ha caricato il documento, come fanno gli host ufficiali, in modo che la schermata non lampeggi mai sopra un file ancora in caricamento.

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

Restituisce il documento corrente come stringa JSON, nello [schema](./advanced/schema.md) definito dall’editor.  
Dalla versione `4.0.0` è la forma di archiviazione, il documento così come lo contiene un file, che è anche ciò che scrive l’esportazione `json` e che salvano gli host ufficiali. Contiene solo le entità presenti, senza quelle rimosse, l’ordine di sovrapposizione o ciò che l’editor calcola da sé, come le larghezze misurate, gli indicatori delle chiavi e i punti di ancoraggio delle relazioni. Le chiavi delle sue entità seguono un ordine fisso, il testo è indentato di due spazi e termina con un a capo, quindi lo stesso documento produce sempre gli stessi byte.  
Dalla versione `4.2.0` tralascia anche ciò che è vuoto: un elenco `doc` vuoto, una collezione vuota, una riga di un dizionario che non contiene nulla e un campo di testo vuoto di un’entità, come un nome, un commento, un tipo di dati, un valore predefinito o un colore. Un elenco all’interno di un’entità, come `columnIds` di una tabella, viene comunque scritto quando è vuoto. Il `doc` di un nuovo documento è `{}`, e il documento non ha `collections`, quindi un campo, un elenco o una collezione mancante va letto come vuoto. Contiene i nomi logici e i flag di nome derivato delle tabelle e delle colonne, i collegamenti delle colonne ai domini e le parole, i termini e i domini, con ciascun dizionario scritto come un’intestazione di nomi di campo seguita dalle sue righe, ogni riga su una linea a sé, nell’ordine del foglio. Vedere [Forma di archiviazione e valore di runtime](./advanced/schema.md#storage-form-and-runtime-value).  
Ogni impostazione con il [blocco](../guide/guides/settings.md#lock) attivo viene scritta con il valore a cui è bloccata, non come la mostra lo schermo. Il blocco `Viewport` contiene `originX`, `originY` e `zoomLevel`, mentre `Canvas Type`, `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` e, dalla versione `4.2.0`, `Name View` contengono ciascuno la propria impostazione. La Visualizzazione nomi viene scritta come `nameViewMode`, e solo quando non è `'physical'`. Ogni altra impostazione viene scritta così com’è, e `lockSettings` viene sempre scritto. Per i bit, vedere [Settings](./advanced/schema.md#settings); il bit del blocco `Name View` va letto al contrario.  
Dalla versione `5.0.0` anche le impostazioni che il lettore di un editor [di sola lettura](#readonly) cambia vengono scritte con i valori del documento, bloccate o no, poiché restano su quello schermo.  
Un nuovo documento ha tutti i blocchi attivi, sia quello che un elemento mostra prima di ricevere un valore, sia uno caricato da un valore vuoto. Il suo `value` mantiene l’origine a `0, 0`, il livello di zoom a `1`, la scheda ERD, il linguaggio predefinito del Generatore di codice, gli stili dei nomi e il tipo di delimitatore predefiniti e, dalla versione `4.2.0`, la vista `Physical Names`, finché il blocco corrispondente non viene disattivato.  
Prima della versione `4.0.0` restituiva l’intero documento così come lo conteneva l’editor, con `ignoreSaveSettings` applicato. Il documento così come lo contiene l’editor è ora [runtimeValue](#runtimevalue), e `ignoreSaveSettings` non viene più letto né scritto.

```js
const data = editor.value;
```

### setter {#setter}

Carica uno stato dell’editor salvato in precedenza. Sostituisce l’intero documento — quello corrente viene prima svuotato. Dalla versione `4.2.0` ciò comprende le parole, i termini e i domini: il documento assume quelli contenuti nel testo, o nessuno, e la cronologia delle modifiche propria di ogni foglio della scheda Dizionario viene svuotata.  
Come `clear()`, `setInitialValue()` e i metodi `setSchema*` nella loro modalità predefinita `mode: 'replace'`, scarta anche la vista in modalità Flusso della scheda Visualizzazione: il suo layout, le tabelle a cui è ristretta, la visualizzazione righe, lo zoom e lo spostamento della vista e, dalla versione `4.2.0`, le tabelle tra cui si spostano i suoi `Previous table` e `Next table`. Un’aggiunta (`mode: 'append'`) non la scarta.  
Viene registrato nella cronologia, abilitando `Undo, Redo`, ed emette `change`.  
Accetta la forma di archiviazione, un [runtimeValue](#runtimevalue) o un file salvato da una versione precedente.  
Una stringa vuota, o qualsiasi valore che non sia una stringa, carica un nuovo documento anziché generare un errore, quindi verificare il valore prima di assegnarlo.  
Quel nuovo documento è lo stesso con cui inizia `setInitialValue('')`: vuoto, con le impostazioni predefinite e, dalla versione `4.0.0`, con tutti i blocchi attivi. Nella `3.10.x` non salvava né la posizione di scorrimento né il livello di zoom, e prima di allora li salvava entrambi.  
Uno store condiviso inoltra quel caricamento ai collaboratori con il JSON completo del nuovo documento, così che ogni peer, comprese le versioni precedenti, lo carichi, sebbene un editor precedente alla versione `4.2.0` scarti ciò che non conosce, come i nomi logici, i collegamenti ai domini e i dizionari — vedere [Combinare versioni diverse](./advanced/collaborative-editing.md#mixing-releases).  
Dalla versione `4.0.0` i blocchi del documento caricato, e i valori bloccati che `value` scrive poi, provengono dal testo, e la vista si posiziona dove la colloca il testo, oppure sul diagramma quando lì non ne è disegnata alcuna parte. Per ogni altra impostazione che il testo blocca — la scheda, il linguaggio del Generatore di codice, gli stili dei nomi, il tipo di delimitatore e, dalla versione `4.2.0`, la Visualizzazione nomi — l’editor continua a mostrare ciò che mostrava prima del caricamento. Un’impostazione che il testo lascia sbloccata assume il valore del testo. Un file salvato prima della versione `4.2.0` non indica alcun blocco `Name View`, a meno che un editor della versione `4.2.0` non abbia disattivato quel blocco nel file, quindi si carica con la Visualizzazione nomi bloccata su `Physical Names`, e l’editor mantiene la Visualizzazione nomi che mostrava. [setInitialValue](#setinitialvalue) invece assume ogni valore contenuto nel testo; consultarlo anche per il caso di un testo che non indica alcun blocco.  
Neppure un testo che non è JSON, come un file rimasto con i marcatori di conflitto di merge, genera un errore: il documento viene svuotato, le sue impostazioni restano com’erano e l’errore di analisi viene registrato nella console.  
Viene ignorato mentre `readonly` è impostato; per caricare in un editor di sola lettura, usare [setInitialValue](#setinitialvalue).

```js
editor.value = 'json...';
```

## runtimeValue {#runtimevalue}

Dalla versione `4.0.0`, restituisce il documento così come lo contiene questo editor, come stringa JSON. Non ha un setter, quindi assegnarlo genera un’eccezione nel codice in modalità strict.  
Contiene ciò che [value](#value) tralascia: le entità rimosse e il loro ordine, l’ordine di sovrapposizione, le larghezze misurate, gli indicatori delle chiavi, i punti di ancoraggio delle relazioni e le sequenze e, dalla versione `4.2.0`, i campi di testo, gli elenchi `doc` e le collezioni vuoti; le righe rimosse da un foglio della scheda Dizionario e quelle che non contengono nulla; la chiave di ordinamento di ogni riga dei dizionari; gli elenchi `doc` delle parole, dei termini e dei domini; e un collegamento a un dominio rimosso. Anche qui le impostazioni bloccate vengono scritte con i loro valori bloccati.  
Usarlo per inizializzare, tramite il suo [setInitialValue](#setinitialvalue), un altro editor che si unisce a una sessione già in corso, come un collaboratore o una seconda vista dello stesso documento. L’annullamento di una rimozione che la sessione invia in seguito ripristina allora l’entità per intero in quell’editor, mentre un editor inizializzato da `value` non contiene alcuna entità rimossa e ripristina invece una tabella vuota e senza nome o, dalla versione `4.2.0`, una riga di dizionario vuota. Vedere [Modifica collaborativa](./advanced/collaborative-editing.md).  
Nulla raccoglie più le entità rimosse, quindi vi restano finché il documento non viene riaperto dal suo file.  
Non scriverlo mai in un file: salvare `value`, che il [JSON Schema](./advanced/schema.md#json-schema) accetta, a differenza di questo.

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue {#setinitialvalue}

Carica uno stato dell’editor salvato in precedenza. Il caricamento in sé non viene registrato nella cronologia, quindi non può essere annullato, e non viene emesso alcun evento `change`.  
Svuota anche la cronologia delle modifiche, quindi nulla di ciò che è stato fatto prima del caricamento può essere annullato o ripetuto sul documento caricato, e dalla versione `4.2.0` svuota anche la cronologia propria di ogni foglio della scheda Dizionario.  
Accetta la forma di archiviazione, un [runtimeValue](#runtimevalue) o un file salvato da una versione precedente e, a differenza dell’assegnazione di `value`, assume ogni impostazione contenuta nel testo, comprese la scheda e le impostazioni del codice.  
Una stringa vuota, o qualsiasi valore che non sia una stringa, carica un nuovo documento anziché generare un errore, quindi `setInitialValue('')` avvia un diagramma vuoto.  
Dalla versione `4.0.0` quel nuovo documento, che è anche ciò che un elemento mostra prima di ricevere qualsiasi valore, ha tutti i blocchi attivi. Lo scorrimento, lo zoom, il cambio di scheda e la modifica del linguaggio del Generatore di codice, degli stili dei nomi, del tipo di delimitatore o, dalla versione `4.2.0`, della Visualizzazione nomi lasciano `value` invariato e non emettono alcun `change`. Nella `3.10.x` non salvava né la posizione di scorrimento né il livello di zoom, e prima di allora li salvava entrambi.  
Un documento caricato da testo mantiene i blocchi che indica. Uno che non ne indica alcuno — qualsiasi file salvato prima della versione `4.0.0`, qualunque cosa dicesse il suo `ignoreSaveSettings`, e un file `.vuerd` v2 — si apre con tutti i blocchi attivi, con `Viewport` bloccato all’origine `0, 0` e al livello di zoom `1`, sulla scheda ERD, con il linguaggio, gli stili dei nomi e il tipo di delimitatore così come li ha salvati.  
Dalla versione `4.2.0` un testo che indica i propri blocchi ma non il blocco `Name View` si apre con anche quel blocco attivo, perfino quando tutti gli altri blocchi sono disattivati. Un file salvato prima della versione `4.2.0` è un testo di questo tipo, a meno che un editor della versione `4.2.0` non abbia disattivato quel blocco nel file (vedere [Settings](./advanced/schema.md#settings)). Si apre nella vista `Physical Names`, come uno che non indica alcun blocco.  
In entrambi i casi la vista si apre su quella del documento — quella salvata nel testo quando indica i propri blocchi, l’origine `0, 0` al livello di zoom `1` quando non ne indica alcuno — oppure sul diagramma quando lì non ne è disegnata alcuna parte. Un `Viewport` bloccato mantiene comunque i suoi valori bloccati in `value`.  
Dalla versione `4.0.0` scarta anche lo stato di collaborazione del documento contenuto in precedenza, e uno [store condiviso](#getsharedstore) di questo editor già sottoscritto chiede di nuovo il loro stato agli altri editor, così che un editor ricaricato in una sessione in corso si rimetta in pari. Inizializzare un editor di questo tipo con il [runtimeValue](#runtimevalue) di un altro editor.  
Neppure un testo che non è JSON genera un errore: il documento viene svuotato, le sue impostazioni restano com’erano e l’errore di analisi viene registrato nella console.  
A differenza dell’assegnazione di `value`, non è bloccato da `readonly`, quindi è il modo per caricare un documento in un editor di sola lettura. Un editor di sola lettura mostra poi le impostazioni contenute nel testo caricato, scartando quelle che il suo lettore aveva cambiato sullo schermo.

```js
editor.setInitialValue('json...');
```

Caricare all’avvio, salvare a ogni modifica.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Eventi {#event}

`change`, `changePresetTheme` e `changeLocale` sono gli unici tre eventi pubblici; `changeLocale` è stato introdotto nella versione `4.0.0`.  
L’elemento emette anche su se stesso eventi interni `@dineug/erd-editor/internal-*` per i propri collegamenti interni; questi non fanno parte dell’API.

### change {#change}

Quando ci sono modifiche nell’editor, emette un evento.  
L’evento ha un debounce di 200 ms e non viene emesso mentre `readonly` è `true`.  
Viene emesso per qualsiasi modifica del documento — una modifica nell’interfaccia, l’assegnazione di `value`, `clear()`, ciascuno dei metodi `setSchema*` e, dalla versione `4.0.0`, `setSchemaJSON()` e `Import and Add`. `setInitialValue` non lo emette.  
Dalla versione `4.2.0` ciò comprende ogni modifica nella scheda [Dizionario](../guide/guides/dictionary.md) e ogni annullamento o ripetizione di una di esse, una modifica di un nome logico o di un collegamento a un dominio, `Derive Physical Names Again` e un cambio della Visualizzazione nomi mentre il blocco `Name View` è disattivato.  
Nulla di ciò che si fa nella modalità Flusso della scheda Visualizzazione lo emette — zoom, spostamento della vista, spostamento delle card, `Tidy Up`, visualizzazione righe, restringimento della vista da una card o, dalla versione `4.2.0`, gli spostamenti di un passo con `Previous table` e `Next table` o con i tasti per annullare e ripetere — poiché nessuna di queste azioni è una modifica del documento. Fa eccezione il suo elenco `Name View`: un cambio da lì lo emette mentre il blocco `Name View` è disattivato, come uno nella scheda ERD.  
Dalla versione `4.0.0` non lo emette neppure la modifica di un’impostazione con il [blocco](../guide/guides/settings.md#lock) attivo, perché sposta solo lo schermo e mai `value`: uno scorrimento o uno zoom dell’area di disegno ERD mentre `Viewport` è bloccato, un cambio di scheda mentre `Canvas Type` è bloccato, una modifica del linguaggio del Generatore di codice, dello stile dei nomi delle tabelle, dello stile dei nomi delle colonne o del tipo di delimitatore mentre il relativo blocco è attivo e, dalla versione `4.2.0`, un cambio della Visualizzazione nomi mentre `Name View` è bloccato. Sono escluse solo queste modifiche, quindi un batch che modifica anche il documento lo emette comunque. Bloccare o sbloccare un’impostazione lo emette.  
In un nuovo documento e in qualsiasi file salvato prima della versione `4.0.0` tutti i blocchi sono attivi, e il blocco `Name View` è attivo in qualsiasi file salvato prima della versione `4.2.0`, a meno che un editor della versione `4.2.0` non l’abbia disattivato lì, quindi per impostazione predefinita lo scorrimento, lo zoom, il cambio di scheda e il cambio della Visualizzazione nomi non emettono nulla. Ciò comprende la focalizzazione delle tabelle dalla scheda ERD, il pulsante della card con il link esterno che riporta dalla modalità Flusso alla scheda ERD, il passaggio a una riga di Esplora o a una corrispondenza della ricerca, l’apertura di Esplora o il passaggio a un risultato della Ricerca rapida da un’altra scheda e, dalla versione `4.2.0`, il passaggio a una tabella o a una colonna da una riga del foglio `Checks` della scheda Dizionario. Ciascuna di queste azioni emette un `change` solo mentre è disattivato un blocco che la riguarda: `Canvas Type` per il cambio di scheda e `Viewport` per lo scorrimento prodotto anche da un pulsante della card, da un risultato della Ricerca rapida, da una riga di Esplora, da una corrispondenza della ricerca o da una riga di `Checks`. Dalla versione `4.1.0` ognuno di questi scorrimenti segue un’unica regola, [Dove porta un salto](../guide/guides/table-related-functions.md#where-a-jump-lands), quindi un risultato di tipo tabella della Ricerca rapida non provoca più uno scorrimento ogni volta, e un salto che la regola lascia sul posto non produce alcuno scorrimento da emettere. Aprire, chiudere o ridimensionare Esplora restringe o allarga l’area di disegno senza spostarne l’origine, e anche questo non emette nulla. Prima della versione `4.0.0` lo scorrimento, lo zoom e il cambio di scheda lo emettevano sempre, anche quando `editor.value` risultava identico.  
Per evitare scritture che non cambiano nulla, confrontare `editor.value` con l’ultimo valore memorizzato, non con il file caricato: un file scritto da una versione precedente, un file v2 o uno modificato a mano possono risultare diversi in `value` non appena vengono caricati, perché `value` li scrive nella forma di archiviazione. Lo stesso vale per un file il cui blocco `Viewport` è disattivato e la cui origine non mostra alcuna parte del diagramma su questo schermo: il caricamento sposta la vista sul diagramma, e `value` scrive il punto in cui si posiziona. Dalla versione `4.0.0` le larghezze misurate non ne sono più la causa, perché `value` non ne contiene. Dalla versione `4.2.0` può risultare diverso anche un file salvato dalla `4.0.0` o dalla `4.1.0`, poiché `value` ora ne tralascia i campi di testo, gli elenchi e le collezioni vuoti, quindi un file di questo tipo viene riscritto una sola volta, al salvataggio successivo. Un host che scrive file può invece distinguere una modifica da un cambiamento della vista con il valore `changed` di uno store di replica — vedere [on@change](./advanced/remote-storage.md#onchange).  
L’evento non trasporta alcun `detail` e non si propaga né attraversa il confine dello shadow DOM, quindi restare in ascolto sull’elemento stesso e leggere `editor.value` nel gestore.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme {#changepresettheme}

Viene emesso quando il tema preimpostato viene modificato dal generatore di temi integrato o, dalla versione `4.0.0`, da `Theme` nella Ricerca rapida. Ogni scelta lo emette, compresa quella dell’opzione già in vigore.  
Chiamare direttamente [setPresetTheme](#setpresettheme) o [setSystemAppearance](#setsystemappearance), o attivare o disattivare [systemDarkMode](#systemdarkmode), non lo emette.  
`event.detail` è l’oggetto `ThemeOptions` completo dopo la scelta — `{ appearance, grayColor, accentColor }` — non l’oggetto parziale richiesto. Dalla versione `4.0.0` la sua proprietà `appearance` è `'system'` mentre è scelto `System`, non l’aspetto chiaro o scuro mostrato, quindi memorizzarlo così com’è e ripassarlo a `setPresetTheme`.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale {#changelocale}

Dalla versione `4.0.0`, viene emesso quando si sceglie una lingua nell’editor, dal selettore della lingua di visualizzazione o da `Display Language` nella Ricerca rapida, entrambi attivati da [enableLocalePicker](#enablelocalepicker).  
Viene emesso dopo che la lingua è stata applicata, a ogni scelta, compresa quella dell’opzione già in vigore. [setLocale](#setlocale) e [setSystemLocale](#setsystemlocale) non lo emettono mai, né lo emette un cambiamento delle lingue del browser. Un cambio di lingua non emette alcun `change`.  
`event.detail` è `{ locale }`, un `LocaleOption`: `'system'` quando è stato scelto `System`, altrimenti il codice della lingua. L’elemento non ricorda la scelta, quindi memorizzarla e passarla a `setLocale` al caricamento successivo.  
Come `change`, non si propaga, quindi restare in ascolto sull’elemento stesso.

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus {#focus}

Assegna il focus all’editor.

```js
editor.focus();
```

## blur {#blur}

Rimuove il focus dall’editor.

```js
editor.blur();
```

## clear {#clear}

Svuota il documento, rimuovendo ogni tabella, colonna, relazione, indice e memo, dalla versione `4.0.0` ogni gruppo di tabelle e, dalla versione `4.2.0`, le parole, i termini e i domini della scheda Dizionario, svuotando anche la cronologia propria di ogni foglio.  
Tutte le impostazioni restano, compresi il database, la posizione della vista, il livello di zoom, le opzioni di visualizzazione delle tabelle, ogni blocco con il valore che contiene e gli script `Before tables` e `After tables` della scheda Schema SQL, quindi un file svuotato continua a salvare ciò che salvava. Per iniziare invece un nuovo documento, assegnare `''` a `value` o chiamare `setInitialValue('')`.  
Viene registrato nella cronologia, quindi può essere annullato, ed emette `change`. Un annullamento riporta il documento a com’era nell’editor, comprese le sue parole, i suoi termini e i suoi domini, con ogni impostazione bloccata al suo valore bloccato. Viene ignorato mentre `readonly` è impostato.

```js
editor.clear();
```

## destroy {#destroy}

Distrugge completamente l’istanza dell’editor, che non può più essere riutilizzata.  
Rilascia i listener e le sottoscrizioni dell’editor, e distrugge ogni store condiviso restituito da [getSharedStore](#getsharedstore).  
Un batch di stream che uno store condiviso sta ancora trattenendo viene scartato insieme a esso; per inviarlo, chiamare prima [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) di quello store.

```js
editor.destroy();
```

## setKeyBindingMap {#setkeybindingmap}

Ridefinisce i tasti di scelta rapida.  
`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut` e `zoomReset` sono fissi e non possono essere ridefiniti.  
Vengono scritti solo i ventuno nomi seguenti; qualsiasi altra cosa nell’oggetto viene ignorata, compresi i nomi fissi.  
Dalla versione `3.10.0`, `search` può essere ridefinito e `findReplace` è nuovo. In precedenza, `search` era fisso. Dalla versione `4.0.0`, `removeSelection` è nuovo. Dalla versione `4.1.0`, `addTableGroup` e `groupSelectedTables` sono nuovi.  
Il valore di un’associazione deve essere un `ShortcutOption[]`. Una semplice stringa viene ignorata, quindi scrivere `{ addTable: [{ shortcut: 'Alt+KeyN' }] }` anziché `{ addTable: 'Alt+KeyN' }`.  
Un array vuoto viene accettato e non associa nulla: `setKeyBindingMap({ findReplace: [] })` lascia `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac) alla pagina, e `{ search: [] }` fa lo stesso per `Ctrl + K` (Windows/Linux) o `⌘ + K` (Mac). Il pulsante `Search` della barra degli strumenti apre comunque la Ricerca rapida, il pulsante `Explorer` della barra degli strumenti apre e chiude comunque il pannello Esplora, e la voce `Toggle Explorer` nella Ricerca rapida e nel menu contestuale dell’area di disegno apre comunque la ricerca del pannello Esplora o lo chiude; nessuno di questi mostra un tasto di scelta rapida per un nome lasciato vuoto. `{ removeSelection: [] }` lascia `Delete` e `Backspace` alla pagina, e le voci di eliminazione dei menu della tabella, del memo e del gruppo di tabelle (`Delete`, `Delete selected`, `Delete column`, `Delete columns`) in quel caso non mostrano alcun tasto di scelta rapida.  
Dalla versione `4.1.0`, `{ addTableGroup: [] }` lascia `Alt + G` (Windows/Linux) o `⌥ + G` (Mac) alla pagina, e `{ groupSelectedTables: [] }` lascia `T` e poi `G`. `New Table Group` nella barra degli strumenti dell’area di disegno, nel menu contestuale dell’area di disegno e nella Ricerca rapida, `Group selected tables` nel menu della tabella e `Group Selected Tables` nella Ricerca rapida continuano a funzionare, senza mostrare alcun tasto di scelta rapida. I tooltip dei pulsanti `New Table`, `New Memo` e `New Table Group` della barra degli strumenti dell’area di disegno indicano la prima combinazione di tasti di `addTable`, `addMemo` e `addTableGroup`, oppure solo il pulsante per un’associazione lasciata vuota.  
Dalla versione `4.2.0`, `addColumn` e `removeColumn` forniscono anche le combinazioni di tasti per le righe della griglia della scheda Dizionario, come descritto più avanti, quindi riassociare l’uno o l’altro sposta con sé quelle combinazioni. `{ addColumn: [] }` non lascia alla griglia alcuna combinazione per inserire righe, e le due voci di inserimento del menu della griglia in quel caso non mostrano alcun tasto di scelta rapida; `{ removeColumn: [] }` non le lascia alcuna combinazione per eliminarle, e la voce di eliminazione del menu e il tooltip di `Delete Rows` in quel caso non ne mostrano alcuno.  
La chiamata è un’unione parziale: i nomi omessi mantengono i valori predefiniti, e chiamarla due volte mantiene le modifiche precedenti. Non esiste un getter per le associazioni correnti: [createKeyBindingMap](#createkeybindingmap) restituisce i valori predefiniti, non ciò che `setKeyBindingMap` ha modificato.

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

`selectAllTable`, `handTool`, `removeSelection` e, dalla versione `4.1.0`, `groupSelectedTables` cedono il passo al punto di inserimento: mentre il focus è in un input, in una textarea o in un elemento `contenteditable`, `$mod + A` seleziona il testo, `Space` digita uno spazio, `Delete` e `Backspace` cancellano il testo, e `T` e poi `G` digitano le due lettere, anziché raggiungere l’area di disegno. Per nessuna di queste pressioni viene impedita l’azione predefinita. Qualunque nuova associazione assegnata loro si comporta allo stesso modo.

Dalla versione `4.0.0`, `removeSelection` (`Delete` o `Backspace`) rimuove la selezione nella scheda ERD in un solo passo di annullamento, senza chiedere conferma. Quando la tabella con il focus è l’unico elemento selezionato, una o più delle sue colonne sono selezionate e lo zoom ne disegna le righe, rimuove quelle colonne; altrimenti rimuove ogni tabella, memo e gruppo di tabelle selezionato, mantenendo le tabelle di un gruppo. Vedere [Eliminazione di tabelle e memo](../guide/guides/table-related-functions.md#table-and-memo-deletion).  
Un tasto tenuto premuto rimuove una sola volta, e nulla viene rimosso mentre è aperto un editor di cella, di memo o del nome di un gruppo di tabelle. Al di fuori di un campo di testo e dei pannelli e delle schede che trattengono le associazioni (vedere [createKeyBindingMap](#createkeybindingmap)), l’azione predefinita della pressione viene impedita in ogni scheda mentre l’editor ha il focus, anche su un pulsante della barra degli strumenti con il focus, e in un editor di sola lettura, dove non rimuove nulla.

Dalla versione `4.1.0`, `addTableGroup` (`Alt+KeyG`) attiva il disegno `New Table Group` nella scheda ERD, per cui la successiva pressione del pulsante principale sull’area di disegno disegna il gruppo, e premerlo di nuovo disattiva il disegno, come fa il pulsante `New Table Group` della barra degli strumenti dell’area di disegno. `groupSelectedTables` (`KeyT KeyG`, `T` e poi `G`) inserisce le tabelle selezionate in un nuovo gruppo e ne apre l’editor del nome, come fa `Group selected tables` nel menu contestuale di una tabella. Senza tabelle selezionate non aggiunge nulla; un memo o un gruppo di tabelle selezionato non conta. Vedere [Disegnare un gruppo](../guide/guides/table-groups.md#drawing-a-group) e [Raggruppare le tabelle selezionate](../guide/guides/table-groups.md#grouping-selected-tables).  
Entrambi agiscono solo dove i menu offrono un gruppo: non mentre `readonly` è impostato, mentre l’opzione di visualizzazione `Table Groups` nasconde i gruppi o mentre è aperto un editor di cella, di memo o del nome di un gruppo di tabelle. Come le altre associazioni dell’area di disegno, agiscono solo nella scheda ERD, e non mentre sono aperti la Ricerca rapida, Proprietà tabella, il Visualizzatore differenze, il Viaggio nel tempo, l’anteprima del Layout automatico, `Export image` o `Map Columns`. Dove non hanno effetto, l’azione predefinita della pressione viene comunque impedita, a meno che `groupSelectedTables` non ceda il passo al punto di inserimento. Per `addTableGroup` viene inoltre interrotta la propagazione, come per `focusView` e `zenMode`, quindi un listener `keydown` della pagina in fase di bubbling non lo riceve mai.

Dalla versione `4.2.0`, nella scheda [Dizionario](../guide/guides/dictionary.md#adding-and-deleting-rows), ogni combinazione a pressione singola di `addColumn` inserisce sotto la selezione tante righe quante ne copre la selezione, la stessa combinazione tenendo premuto anche `Shift` le inserisce sopra, e ogni combinazione a pressione singola di `removeColumn` elimina le righe coperte dalla selezione: con i valori predefiniti, `Alt+Enter`, `Alt+Shift+Enter` e `Alt+Backspace` o `Alt+Delete`. Agiscono nella griglia dei fogli `Domains`, `Words` e `Terms` mentre non è aperta alcuna modifica di cella. Una combinazione di `addColumn` che contiene già `Shift` non fornisce alcuna combinazione per inserire sopra, e una sequenza associata a uno dei due nomi non fornisce nulla alla griglia.  
Per ciascuna di queste pressioni l’azione predefinita viene impedita come indica la sua opzione e la propagazione viene sempre interrotta, quindi la pressione non aggiunge né rimuove alcuna colonna nella scheda ERD. Nel foglio `Checks` e in un editor di sola lettura non fa nulla, sebbene l’azione predefinita venga comunque impedita e la propagazione interrotta. In una modifica di cella aperta o nel campo di ricerca della scheda le combinazioni vengono lasciate al testo: lì la propagazione viene interrotta ma l’azione predefinita non viene impedita, quindi il campo agisce su di esse come farebbe ovunque (su Mac, `⌥ + Backspace` elimina una parola). [dictionaryRowChords](#dictionaryrowchords) le elenca.

Dalla versione `3.10.0`, `findReplace` (`$mod+KeyF`) apre [Trova e sostituisci](../guide/guides/find-and-replace.md). Dalla versione `4.1.0` apre o chiude il pannello [Esplora](../guide/guides/explorer.md#opening-and-closing) che lo contiene, e la scheda Tasti di scelta rapida lo elenca come `Toggle Explorer`.  
Mentre il pulsante `Explorer` della barra degli strumenti appare premuto (pannello Esplora aperto nella scheda ERD e non nascosto dalla modalità Zen), chiude il pannello Esplora, a meno che non siano aperti la Ricerca rapida, Proprietà tabella, il generatore di temi, il selettore della lingua di visualizzazione, la finestra di dialogo `Export image` o `Map Columns`. Altrimenti chiude quello tra questi che è aperto, passa alla scheda ERD da qualsiasi altra scheda e apre il pannello Esplora con il punto di inserimento nel campo `Find` e il testo di ricerca selezionato. Un editor troppo stretto per mostrare il pannello Esplora accanto all’area di disegno lo mantiene aperto ma messo da parte, e mostra la notifica `Widen the window to show the Explorer`. Prima della versione `4.1.0` apriva il pannello mobile Trova e sostituisci, o restituiva il focus al suo campo, e non lo chiudeva mai.  
Non cede il passo al punto di inserimento: mentre l’editor ha il focus viene intercettato in ogni scheda, dall’area di disegno o da un input all’interno dell’editor. L’azione predefinita della pressione viene impedita, quindi il browser non apre alcuna barra di ricerca, e la propagazione viene interrotta, quindi nessun listener `keydown` della pagina in fase di bubbling la riceve. Con un editor di cella o di memo aperto, dalla versione `4.0.0` un editor del nome di un gruppo di tabelle o, dalla versione `4.2.0`, una modifica di cella nella griglia della scheda Dizionario, l’azione predefinita viene comunque impedita e la propagazione interrotta, ma l’associazione non fa nulla. In quest’ultimo caso non fa nulla neppure `search`, quindi il testo digitato fino a quel momento resta.  
Mentre sono aperti il Visualizzatore differenze, il Viaggio nel tempo o l’anteprima del Layout automatico, in qualunque scheda, o mentre un IME sta ancora componendo, non ne viene impedita l’azione predefinita né interrotta la propagazione, quindi la pressione arriva alla ricerca del browser o dell’host. All’interno del pannello Esplora, per una pressione ancora in composizione la propagazione viene interrotta lì, ma l’azione predefinita non viene impedita. Qualunque nuova associazione assegnata a `findReplace` si comporta allo stesso modo.

`focusView` agisce solo nella scheda ERD. Con almeno una tabella selezionata, apre la scheda Visualizzazione in modalità Flusso, ristretta a quelle tabelle e a ogni tabella distante una relazione; un memo o un gruppo di tabelle selezionato non conta, e senza tabelle selezionate non fa nulla. Vedere [Focalizzare le tabelle](../guide/guides/visualization.md#focusing-on-tables).

`undo` e `redo` agiscono in base alla scheda. Nella scheda ERD annullano e ripetono le modifiche della cronologia del documento. Dalla versione `4.2.0`, nella scheda Dizionario annullano e ripetono le modifiche della cronologia propria del foglio mostrato, e nel foglio `Checks` non fanno nulla — vedere [Fogli della scheda Dizionario](../guide/guides/undo-redo.md#dictionary-sheets). Nella modalità Flusso della scheda Visualizzazione tornano indietro e vanno avanti di un passo come fanno [`Previous table` e `Next table`](../guide/guides/visualization.md#previous-table-and-next-table), senza toccare la cronologia del documento. Nelle altre schede, e in modalità Grafo, non annullano nulla.

`stop` (`Escape`) nella scheda ERD termina un editor di cella o di memo aperto, o il disegno di una relazione in corso, e lascia la selezione invariata. Dalla versione `4.0.0` termina anche un editor del nome di un gruppo di tabelle, senza scrivere alcun nome, e un disegno `New Table Group`. L’editor chiama `preventDefault()` su quella pressione.  
Se nessuno di questi è aperto, `Escape` annulla la selezione e rimuove il focus dalla cella, e la sua azione predefinita non viene impedita. Uscire da una modifica e annullare la selezione richiede quindi due pressioni.  
Dalla versione `4.2.0`, mentre è visibile l’elenco dei termini di una cella del nome logico (vedere [Completare i nomi dei termini](../guide/guides/logical-names.md#completing-term-names)), il primo `Escape` chiude solo l’elenco e lascia aperto l’editor. Per quella pressione l’azione predefinita viene impedita e la propagazione interrotta nella cella, quindi non la ricevono né `stop` né un listener `keydown` della pagina in fase di bubbling.  
A parte il pannello Esplora, i formati di `Import` della [schermata di benvenuto](#enablewelcomescreen), l’elenco dei termini di una cella del nome logico, la scheda [Dizionario](../guide/guides/dictionary.md#keys-on-the-tab) e i selettori e le finestre di dialogo descritti sotto, l’editor non interrompe mai la propagazione di `Escape`, quindi una pagina che resta in ascolto di questo tasto, ad esempio per chiudere una propria finestra di dialogo, riceve entrambe le pressioni e può ignorare quella il cui `defaultPrevented` è `true`.  
Mentre sono aperti la Ricerca rapida, Proprietà tabella, il Visualizzatore differenze, l’anteprima del Layout automatico o il Viaggio nel tempo, `Escape` chiude invece quello e lascia la selezione invariata. Neppure per quella pressione viene impedita l’azione predefinita.  
Dalla versione `4.0.0` anche una finestra di dialogo [`Export image`](../guide/guides/file-import-export.md#image) o [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) aperta riceve `Escape`, chiudendosi e lasciando la selezione invariata. Ciascuna prende il focus quando si apre, e per quel tasto `Escape` l’azione predefinita viene impedita e la propagazione interrotta.  
Dalla versione `4.1.0` un `Escape` premuto con il focus all’interno del pannello [Esplora](../guide/guides/explorer.md#keys-in-the-explorer), nel suo albero, nei suoi campi o nei suoi pulsanti, restituisce il focus all’area di disegno e lascia aperto il pannello Esplora e invariata la selezione. L’editor chiama su di esso sia `preventDefault()` sia `stopPropagation()`, quindi non raggiunge mai un listener `keydown` della pagina in fase di bubbling.  
Un `Escape` sull’area di disegno non chiude mai il pannello Esplora. Prima della versione `4.1.0` un `Escape` all’interno del pannello Trova e sostituisci lo chiudeva, e uno sull’area di disegno lo chiudeva con la stessa pressione che annullava la selezione.  
Dalla versione `4.0.0` il selettore della lingua di visualizzazione e il selettore colori si chiudono con `Escape`: al loro interno l’azione predefinita viene impedita e la propagazione interrotta, e sull’area di disegno li chiude con la stessa pressione che annulla la selezione, senza che l’azione predefinita venga impedita né la propagazione interrotta.  
Un `Escape` premuto mentre un IME sta ancora componendo appartiene alla composizione. Lascia invariato un editor aperto e la sua azione predefinita non viene impedita, quindi anche una pagina può ignorare una pressione il cui `isComposing` è `true`, o il cui `keyCode` è `229`. All’interno del pannello Esplora, per una pressione di questo tipo, come per qualsiasi tasto premuto lì durante la composizione, viene anche interrotta la propagazione, e il focus resta nel campo.  
Prima della versione `3.9.2` un solo `Escape` terminava una modifica o un disegno e insieme annullava la selezione, e l’editor non ne impediva mai l’azione predefinita.

### createKeyBindingMap {#createkeybindingmap}

Dalla versione `3.9.2` il pacchetto esporta `createKeyBindingMap()` e, insieme a essa, i tipi `KeyBindingMap`, `KeyBindingName` e `ShortcutOption`.  
Restituisce le associazioni di tasti predefinite, tutti i 28 nomi compresi quelli fissi, come una nuova mappa a ogni chiamata, quindi modificare la mappa restituita non modifica nient’altro.  
È il punto di partenza di ogni editor, e una chiamata a `setKeyBindingMap` non vi si riflette.  
Di questi quattro, solo `createKeyBindingMap` è un’esportazione di runtime; gli altri tre sono tipi. Dalla versione `4.2.0` accanto a essa viene esportata [dictionaryRowChords](#dictionaryrowchords).

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

Ogni `shortcut` è una combinazione di tasti nella sintassi di [tinykeys](https://github.com/jamiebuilds/tinykeys) che indica il proprio tasto tramite `KeyboardEvent.code`, dove [`$mod`](#mod) è `⌘` su macOS e `Control` altrove.  
Dalla versione `4.0.0` l’editor legge queste combinazioni da sé anziché tramite tinykeys, con la stessa sintassi. Un tasto corrisponde tramite il suo `code`, o tramite il suo `key` in maiuscolo o minuscolo, e una pressione corrisponde solo se sono tenuti premuti esattamente i modificatori che indica. `AltGraph` vale come `Control` e `Alt` su Windows e come `Alt` su macOS. Le pressioni separate da uno spazio formano una sequenza, che ricomincia dopo un secondo senza un keydown.  
Dalla versione `4.1.0` un valore predefinito è una sequenza: `groupSelectedTables` è `KeyT KeyG`, `T` e poi `G`. Una sequenza viene eseguita alla pressione che la completa, e solo quella pressione riceve i suoi `preventDefault` e `stopPropagation`, quindi con i valori predefiniti `T` raggiunge la pagina e solo per `G` viene impedita l’azione predefinita. I menu, la Ricerca rapida e la scheda Tasti di scelta rapida mostrano una sequenza come un tasto per pressione.  
I nomi fissi sono associati a `Enter` (`edit`), `Escape` (`stop`), `$mod+KeyZ` (`undo`), `$mod+Shift+KeyZ` (`redo`), `$mod+Equal` (`zoomIn`), `$mod+Minus` (`zoomOut`) e `$mod+Digit0` (`zoomReset`). `edit` e `stop` non hanno flag; gli altri cinque hanno `preventDefault` e `stopPropagation`. I restanti nomi hanno i valori predefiniti riportati sopra, tra cui `search` e `findReplace`.

L’editor resta in ascolto di queste combinazioni sul proprio elemento, quindi un host che intercetta i tasti prima dell’editor, con tasti di scelta rapida globali o con un listener `keydown` in fase di cattura, deve lasciarle passare mentre l’editor ha il focus.  
Costruire l’elenco di quelle da lasciar passare a partire da `createKeyBindingMap()`, con le associazioni passate a `setKeyBindingMap` al posto di quelle predefinite.  
Dalla versione `3.10.0` l’elenco include `$mod+KeyF`, la combinazione di ricerca del browser stesso. Un host che vuole mantenere la propria ricerca su quella combinazione passa `setKeyBindingMap({ findReplace: [] })`.  
Dalla versione `4.0.0` include anche `Delete` e `Backspace` senza modificatori. Un host che vuole mantenere quei tasti passa `setKeyBindingMap({ removeSelection: [] })`.  
Dalla versione `4.1.0` include anche `Alt+KeyG` e la sequenza `KeyT KeyG`, che arriva come un’unica stringa: dividerla in corrispondenza dello spazio e lasciar passare ogni pressione, compresi `T` e `G` senza modificatori, poiché una sequenza a cui manca una pressione non si completa mai. Un host che vuole mantenere quei tasti passa `setKeyBindingMap({ addTableGroup: [] })` o `setKeyBindingMap({ groupSelectedTables: [] })`.  
Dalla versione `4.2.0` aggiungere all’elenco le combinazioni che [dictionaryRowChords](#dictionaryrowchords) restituisce per la stessa mappa, tra cui `Alt+Shift+Enter`. Un host che vuole mantenere quei tasti passa `setKeyBindingMap({ addColumn: [] })` o `setKeyBindingMap({ removeColumn: [] })`, che li toglie anche all’aggiunta e alla rimozione delle colonne nella scheda ERD.

Mentre il focus è all’interno del pannello Esplora, nel suo albero, nei campi `Find` e `Replace` o nei suoi pulsanti, `findReplace`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut` e `zoomReset` passano all’editor, quindi `findReplace` agisce lì come sull’area di disegno. Ogni altra associazione, così come è impostata al momento, si ferma al pannello Esplora, una sequenza alla sua ultima pressione (un `G` senza modificatori con i valori predefiniti), e lo stesso vale per i tasti freccia, `Tab`, `Enter`, `Space`, `Home`, `End` e qualsiasi tasto premuto mentre un IME sta ancora componendo. A parte `Escape`, che restituisce il focus all’area di disegno, per questi tasti la propagazione viene interrotta senza che l’azione predefinita venga impedita, quindi agiscono come tasti normali nei campi, nei pulsanti e nell’albero del pannello Esplora e non raggiungono né l’area di disegno né un listener `keydown` della pagina in fase di bubbling: lì `Alt + N` non aggiunge alcuna tabella e `Delete` non rimuove nulla. Per i tasti che spostano il focus, comprimono o portano a una riga dell’albero, e per `Enter` nel campo `Find` o `Replace`, che scorre le corrispondenze o sostituisce, viene impedita anche l’azione predefinita.  
Qualsiasi altro tasto, come la combinazione di salvataggio o del riquadro comandi di un host, prosegue verso la pagina come di consueto. Vedere [Tasti nel pannello Esplora](../guide/guides/explorer.md#keys-in-the-explorer). Prima della versione `4.1.0` il pannello mobile Trova e sostituisci tratteneva i tasti allo stesso modo, a parte `Home`, `End`, l’ultima pressione di una sequenza e `Space` mentre `handTool` era associato a un altro tasto.  
Dalla versione `4.0.0` il selettore della lingua di visualizzazione trattiene i tasti allo stesso modo: le stesse sette associazioni passano, mentre per ogni altra associazione (dalla versione `4.1.0` una sequenza alla sua ultima pressione), per i tasti freccia e per `Tab` la propagazione viene interrotta lì senza che l’azione predefinita venga impedita, come per qualsiasi tasto premuto mentre un IME sta ancora componendo. `↑`, `↓`, `Home`, `End`, `Enter` e `Space` su una delle sue voci spostano il focus tra le voci o ne scelgono una, e per questi viene impedita anche l’azione predefinita.

Dalla versione `4.2.0` anche la scheda [Dizionario](../guide/guides/dictionary.md#keys-on-the-tab) trattiene i tasti, e all’editor passano solo `search`, `findReplace`, `undo` e `redo`. `undo` e `redo` agiscono sulla cronologia propria del foglio mostrato e, con una modifica di cella aperta o con il focus nel campo di ricerca della scheda, vengono lasciati al testo, con la propagazione interrotta lì ma senza che l’azione predefinita venga impedita. `search` e `findReplace` non fanno nulla mentre è aperta una modifica di cella, come descritto sopra. Le combinazioni di tasti per le righe agiscono nella griglia, come descritto sopra per `addColumn` e `removeColumn`.  
Ogni altra associazione, così come è impostata al momento, si ferma alla scheda, una sequenza alla sua ultima pressione, e lo stesso vale per i tasti freccia, `Tab`, `Enter`, `Space`, `Home`, `End` e qualsiasi tasto premuto mentre un IME sta ancora componendo. Nessuno di questi raggiunge l’area di disegno o un listener `keydown` della pagina in fase di bubbling: lì `Alt + N` non aggiunge alcuna tabella e `Delete` non rimuove nulla dal diagramma. Anche gli eventi di copia, taglio e incolla nella scheda si fermano lì, quindi il diagramma non li legge mai come propri. Qualsiasi altro tasto prosegue verso la pagina come di consueto.

### dictionaryRowChords {#dictionaryrowchords}

Dalla versione `4.2.0` il pacchetto esporta `dictionaryRowChords()`. Restituisce, come un nuovo `ShortcutOption[]` a ogni chiamata, ogni combinazione di tasti con cui la griglia della scheda Dizionario inserisce o elimina righe in base alla mappa delle associazioni di tasti passata.  
In ordine, sono le combinazioni a pressione singola di `addColumn`, che inseriscono righe sotto la selezione; ciascuna di esse tenendo premuto anche `Shift`, che inseriscono righe sopra, nessuna per una combinazione che contiene già `Shift`; e le combinazioni a pressione singola di `removeColumn`, che eliminano righe. Ciascuna mantiene i flag `preventDefault` e `stopPropagation` dell’associazione da cui proviene, e una sequenza viene esclusa. Vedere [Aggiungere ed eliminare righe](../guide/guides/dictionary.md#adding-and-deleting-rows).  
La combinazione che inserisce righe sopra, `Alt+Shift+Enter` con i valori predefiniti, non appartiene ad alcuna associazione, quindi un host che confronta i modificatori in modo esatto e costruisce l’elenco dei tasti da lasciar passare solo da [createKeyBindingMap](#createkeybindingmap) non la lascia mai passare. Lasciar passare entrambi gli elenchi, come fa il plugin per Obsidian.  
Legge solo la mappa ricevuta, non le associazioni dell’elemento, quindi passarle la mappa da cui si è costruito il proprio elenco di tasti.

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

Cambia il tasto `Control` a seconda dell’ambiente.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Tabella dei tasti {#shortcut-table}

Usa le proprietà `key, code` dell’evento della tastiera.  
Usare `code` per le posizioni assolute e `key` per i valori di input.

| Windows        | macOS           | `key`          | `code`                         |
| -------------- | --------------- | -------------- | ------------------------------ |
| N/D            | `Command` / `⌘` | `Meta`         | `MetaLeft` / `MetaRight`       |
| `Alt`          | `Option` / `⌥`  | `Alt`          | `AltLeft` / `AltRight`         |
| `Control`      | `Control` / `^` | `Control`      | `ControlLeft` / `ControlRight` |
| `Shift`        | `Shift`         | `Shift`        | `ShiftLeft` / `ShiftRight`     |
| `Space`        | `Space`         | N/D            | `Space`                        |
| `Enter`        | `Return`        | `Enter`        | `Enter`                        |
| `Esc`          | `Esc`           | `Escape`       | `Escape`                       |
| `Backspace`    | `Delete` / `⌫`  | `Backspace`    | `Backspace`                    |
| `Delete`       | `fn` + `Delete` | `Delete`       | `Delete`                       |
| `1`, `2`, ecc. | `1`, `2`, ecc.  | `1`, `2`, ecc. | `Digit1`, `Digit2`, ecc.       |
| `a`, `b`, ecc. | `a`, `b`, ecc.  | `a`, `b`, ecc. | `KeyA`, `KeyB`, ecc.           |
| `-`            | `-`             | `-`            | `Minus`                        |
| `=`            | `=`             | `=`            | `Equal`                        |
| `+`            | `+`             | `+`            | `Equal`                        |

## Tema {#theme}

### setPresetTheme {#setpresettheme}

Imposta un tema preimpostato.  
I valori predefiniti sono `appearance: 'dark'`, `grayColor: 'slate'` e `accentColor: 'indigo'`.  
Ogni campo viene applicato singolarmente, quindi una chiamata parziale lascia invariati gli altri due. Un valore che non è uno dei nomi seguenti viene ignorato, e la chiamata non genera mai eccezioni.  
Dalla versione `4.0.0` la proprietà `appearance` accetta anche `'system'`, l’opzione `System` del generatore di temi. Mostra l’aspetto chiaro o scuro indicato dal sistema operativo, o quello specificato da [setSystemAppearance](#setsystemappearance), e cambia quando questo cambia.

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

Dalla versione `4.0.0`, specifica se l’aspetto `'system'` mostra la variante chiara o quella scura, per un host con proprie varianti chiara e scura, come il tema di un IDE. Finché ne è specificata una, i cambiamenti del sistema operativo vengono ignorati.  
`null`, o qualsiasi valore diverso da `'dark'` o `'light'`, torna a seguire il sistema operativo.  
Mentre l’aspetto è `'light'` o `'dark'` non cambia nulla sullo schermo, ma il valore viene conservato e si applica non appena l’aspetto diventa `'system'`. Altrimenti si applica immediatamente. Non emette nulla, e `changePresetTheme` continua a riportare `'system'`.  
Gli host VS Code, JetBrains e Obsidian lo chiamano con la propria variante chiara o scura, e di nuovo ogni volta che questa cambia.

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme {#settheme}

Consente di personalizzare il tema.  
Ogni chiamata sostituisce l’intero livello personalizzato, quindi per cambiare un token in aggiunta a una personalizzazione esistente ripassare l’oggetto completo, e passare `{}` per tornare al tema preimpostato.  
Vengono conservati solo i nomi di token seguenti, con valori stringa; tutto il resto viene scartato senza errori.  
Il livello personalizzato si sovrappone al tema preimpostato, quindi una successiva chiamata a `setPresetTheme` sostituisce il tema preimpostato sottostante mentre le personalizzazioni restano.

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

`tableShadow` e `memoShadow` sono il colore dell’ombra che tabelle e memo proiettano sull’area di disegno ERD. Il tema preimpostato scuro li lascia `transparent`, che non proietta alcuna ombra, come accade passando `none` o una stringa vuota a `setTheme`; il tema preimpostato chiaro usa `rgba(0, 0, 0, 0.18)`.

Dalla versione `4.0.0` ci sono altri nove token:

- `tableGroupHeaderBackground`, `tableGroupBackground` e `tableGroupBorder` colorano la barra del titolo, il corpo e il contorno di un [gruppo di tabelle](../guide/guides/table-groups.md) privo di un colore proprio.
- `toastSuccess` e `toastError` colorano l’indicatore di una notifica che riporta l’esito di un’operazione.
- `findReplaceError` e `mapColumnsError` colorano gli errori mostrati da Trova e sostituisci e dalla finestra di dialogo Associa colonne. In precedenza Trova e sostituisci usava `diffDeleteForeground`, quindi personalizzare quel token non lo ricolora più.
- `schemaSqlWarningBackground` e `schemaSqlWarningForeground` colorano gli avvisi nelle opzioni della scheda Schema SQL.

Dalla versione `4.1.0` ci sono altri nove token:

- `treeBackground`, `treeRowHover`, `treeRowCurrent`, `treeMuted` e `treeMatch` colorano l’albero condiviso dal pannello [Esplora](../guide/guides/explorer.md#the-tree) e dal [Visualizzatore differenze](../guide/guides/table-related-functions.md#diff-viewer): il suo sfondo, che riempie anche i campi `Find` e `Replace` del pannello Esplora; una riga sotto il puntatore, la riga raggiunta con la tastiera mentre l’albero ha il focus e un pulsante sotto il puntatore nell’intestazione e nella ricerca del pannello Esplora; la riga della corrispondenza corrente della ricerca; il testo attenuato come conteggi, tipi di dati e frecce di compressione; e l’evidenziazione dietro il testo trovato da una ricerca.
- `explorerBackground` ed `explorerBorder` colorano il pannello Esplora e le sue linee: il bordo accanto all’area di disegno, la linea sotto la ricerca e i bordi dei suoi campi e dei pulsanti che `Search In` espande. `explorerBorder` disegna anche il bordo dell’albero del Visualizzatore differenze, la linea sotto il suo campo `Filter by name` e il bordo di quel campo. Le icone delle chiavi del pannello Esplora usano `keyPK`, `keyFK` e `keyPFK`.
- `diffModifyForeground` e `diffRenameForeground` colorano ciò che il Visualizzatore differenze contrassegna come modificato e rinominato, nel suo albero e su entrambi i documenti. `diffModifyForeground` contorna anche una tabella, un memo o un gruppo di tabelle che è stato spostato, ridimensionato, ricolorato o raggruppato diversamente, qualunque altra cosa sia cambiata al suo interno, e disegna il connettore di una chiave esterna modificata.

`diffInsertForeground` e `diffDeleteForeground` ora colorano ciò che il Visualizzatore differenze contrassegna come aggiunto e rimosso, nel suo albero e sul documento che lo contiene, allo stesso modo in testo, contorni e connettori. `diffInsertBackground`, `diffDeleteBackground`, `diffCrossBackground` e `diffCrossForeground` sono stati rimossi nella versione `4.1.0`, poiché il Visualizzatore differenze non riempie più le celle. `setTheme` li scarta come qualsiasi altro nome assente da `Theme`, e i loro hook, `--erd-editor-diff-insert-background`, `--erd-editor-diff-delete-background`, `--erd-editor-diff-cross-background` e `--erd-editor-diff-cross-foreground`, non vengono più letti.

Dalla versione `4.2.0` ci sono altri dodici token:

- `columnHandleBackground` e `columnHandleBorder` riempiono e contornano la [maniglia di trascinamento della colonna](../guide/guides/table-editing.md#rearranging-and-moving-columns), disegnata appena fuori dal bordo sinistro di una tabella accanto alla riga della colonna con il focus, e `columnHandleHoverBackground` e `columnHandleHoverBorder` subentrano mentre il puntatore è sopra di essa. La sua impugnatura usa `foreground`, e `active` sotto il puntatore.
- `dictionaryErrorForeground` e `dictionaryWarningForeground` colorano ciò che i [controlli dei dizionari](../guide/guides/dictionary.md#what-each-check-finds) rilevano, un errore o un avviso: un nome segnalato nell’area di disegno ERD (vedere [Indicatori nell’area di disegno](../guide/guides/dictionary.md#marks-on-the-canvas)), il testo di una cella segnalata nei fogli `Domains`, `Words` e `Terms` e il conteggio di `Checks`. `dictionaryErrorBackground` e `dictionaryWarningBackground` riempiono una cella di questo tipo. `dictionaryErrorForeground` colora anche lo strumento `Delete Rows` sotto il puntatore.
- `dictionaryBackground`, `dictionaryHeaderBackground`, `dictionaryGridLine` e `dictionaryHeaderSelect` colorano il foglio della scheda [Dizionario](../guide/guides/dictionary.md#the-sheets): le sue celle, il cui colore riempie anche il campo di ricerca della scheda e l’elenco dei domini di un termine; le intestazioni di colonna e i numeri di riga; le linee tra le celle, il cui colore disegna anche la barra della scheda e i bordi dei suoi campi; e un’intestazione la cui riga o colonna interseca la selezione. Il resto del foglio usa token condivisi: `foreground` per le etichette delle intestazioni, `active` per il testo delle celle, `grayColor7` per la linea che separa le intestazioni di colonna e i numeri di riga dalle celle, `focus` per il bordo della cella attiva, `accentColor9` per il bordo di un intervallo selezionato e, con un’opacità del 20%, per il suo riempimento, `accentColor6` per l’intestazione di un’intera riga o colonna selezionata, `grayColor3` per le celle di sola lettura e i token della barra di scorrimento. Un `accentColor9` non scritto come `#rgb` o `#rrggbb` lascia senza riempimento un intervallo selezionato.

#### Variabili CSS {#css-variables}

Ogni token di `Theme` ha un hook CSS corrispondente, chiamato `--erd-editor-` seguito dalla chiave in kebab-case: `grayColor10` è `--erd-editor-gray-color-10`, `keyPK` è `--erd-editor-key-pk` e `keyPFK` è `--erd-editor-key-pfk`.  
Gli hook vengono ereditati all’interno dell’editor, quindi impostarli dove si desidera che si applichino. Su `:root` applicano il tema a ogni editor della pagina; sull’elemento stesso lo applicano solo a quello.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

Dalla versione `3.4.0` i token con l’errore di ortografia `dargSelect` si scrivono `dragSelect`, e i loro hook sono passati da `--erd-editor-darg-select-background` e `--erd-editor-darg-select-border` a `--erd-editor-drag-select-background` e `--erd-editor-drag-select-border`. Un foglio di stile che usa ancora i vecchi nomi viene ignorato.

<details>
<summary>Valori predefiniti del tema</summary>

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

## Lingua di visualizzazione {#display-language}

Dalla versione `4.0.0` il testo dell’editor stesso — menu, pannelli, finestre di dialogo, Ricerca rapida, notifiche e le parole che disegna sul diagramma come `unnamed`, esportazioni di immagini comprese — è disponibile in 25 lingue. I nomi di tabelle e colonne, l’SQL, i tipi di dati e il codice generato non vengono mai tradotti. Vedere [Lingua e tema](../guide/guides/language-and-theme.md).  
Prima che venga chiamato [setLocale](#setlocale) o scelta una lingua, l’editor mostra l’inglese, oppure segue `'system'` mentre [enableLocalePicker](#enablelocalepicker) è attivo.  
L’editor imposta `lang` e `dir` sulla propria radice all’interno dello shadow root chiuso, mai sull’elemento host o sulla pagina, quindi una pagina da destra a sinistra non capovolge l’editor e una lingua da destra a sinistra non capovolge la pagina. Ebraico, arabo e persiano dispongono l’interfaccia dell’editor da destra a sinistra; il diagramma in sé non viene mai specchiato. Dalla versione `4.1.0` il pannello [Esplora](../guide/guides/explorer.md) resta a sinistra dell’area di disegno in ogni lingua, con le sue righe che si leggono da destra a sinistra in queste tre.  
Il pacchetto esporta i tipi `LocaleCode` (uno dei codici seguenti) e `LocaleOption`.

```ts
type LocaleOption = LocaleCode | 'system';
```

| Codice  | Visualizzato come    | Lingua                |
| ------- | -------------------- | --------------------- |
| `id-ID` | Bahasa Indonesia     | indonesiano           |
| `de-DE` | Deutsch              | tedesco               |
| `en`    | English              | inglese               |
| `es-ES` | Español              | spagnolo              |
| `eu-ES` | Euskara              | basco                 |
| `fr-FR` | Français             | francese              |
| `it-IT` | Italiano             | italiano              |
| `nl-NL` | Nederlands           | olandese              |
| `pl-PL` | Polski               | polacco               |
| `pt-PT` | Português            | portoghese            |
| `pt-BR` | Português Brasileiro | portoghese brasiliano |
| `ro-RO` | Română               | rumeno                |
| `sk-SK` | Slovenčina           | slovacco              |
| `sl-SI` | Slovenščina          | sloveno               |
| `sv-SE` | Svenska              | svedese               |
| `tr-TR` | Türkçe               | turco                 |
| `ru-RU` | Русский              | russo                 |
| `uk-UA` | Українська           | ucraino               |
| `he-IL` | עברית                | ebraico               |
| `ar-SA` | العربية              | arabo                 |
| `fa-IR` | فارسی                | persiano              |
| `ja-JP` | 日本語               | giapponese            |
| `zh-CN` | 简体中文             | cinese semplificato   |
| `zh-TW` | 繁體中文             | cinese tradizionale   |
| `ko-KR` | 한국어               | coreano               |

### setLocale {#setlocale}

Imposta la lingua di visualizzazione: `'system'` o uno dei codici riportati sopra. Qualsiasi altro valore, come un semplice `'ko'`, un codice sconosciuto o un valore che non è una stringa, viene ignorato senza errori.  
Si applica prima di restituire il controllo, quindi una lingua impostata prima che l’elemento venga aggiunto è presente già nel suo primo frame.  
Non emette nulla, né `changeLocale` né `change`, e non tocca né `value`, né la cronologia delle modifiche, né uno store condiviso.  
La scelta rimane, che `enableLocalePicker` sia attivo o disattivato, e `setLocale('system')` segue il sistema anche con il selettore disattivato.  
L’editor non memorizza nulla. Per conservare la scelta di un utente, restare in ascolto di [changeLocale](#changelocale) e ripassarla al caricamento successivo.

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale {#setsystemlocale}

Specifica la lingua rappresentata da `'system'`, come tag BCP 47, per un host con una propria lingua di visualizzazione. Gli host VS Code, JetBrains e Obsidian lo chiamano con la propria lingua di visualizzazione.  
Il tag viene ripulito dagli spazi iniziali e finali. `null`, una stringa vuota o un valore che non è una stringa torna a `navigator.languages` del browser, che l’editor segue man mano che cambia.  
Conta solo mentre l’opzione in vigore è `'system'`, e si applica immediatamente. La voce `System` del selettore indica la lingua in cui si risolve.  
Il tag, o ciascuna delle lingue del browser in ordine, si risolve nella prima lingua disponibile nell’editor in base al sottotag della lingua, ignorando maiuscole/minuscole e trattini bassi: `de-AT` dà `de-DE` ed `en-GB` dà `en`. Il cinese si risolve in base alla scrittura, con `Hant` che dà `zh-TW` e `Hans` che dà `zh-CN`, e in mancanza di questa in base alla regione, con `TW`, `HK` e `MO` che danno `zh-TW` e qualsiasi altra `zh-CN`. `pt` dà `pt-BR` a meno che non sia indicata una regione diversa da `BR`. Quando non c’è alcuna corrispondenza, l’editor mostra l’inglese.

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL {#setschemasql}

Carica un file Schema SQL.  
Per impostazione predefinita sostituisce il documento corrente anziché unirsi a esso; vedere `mode` più avanti. Le impostazioni esistenti vengono mantenute, compresi ogni blocco e il relativo valore bloccato, tranne la posizione della vista e il livello di zoom, e le tabelle vengono disposte una volta letto il file, in righe a meno che `placement`, più avanti, non richieda diversamente. Con `Viewport` bloccato, `value` scrive poi la vista da cui parte l’importazione, l’origine `0, 0` al livello di zoom `1`. Un documento importato in un elemento a cui non è mai stato assegnato un valore ha quindi tutti i blocchi attivi, come un nuovo documento.  
Dalla versione `4.2.0` una sostituzione mantiene anche le parole, i termini e i domini del documento, che il testo non può contenere, insieme alla cronologia delle modifiche di ogni foglio della scheda Dizionario, e anche un annullamento o una ripetizione dell’importazione li mantiene. Un [setSchemaJSON](#setschemajson) in modalità di sostituzione e l’assegnazione di `value` assumono invece quelli contenuti nel loro documento.  
Viene registrato nella cronologia, abilitando `Undo, Redo`, ed emette `change`. Una stringa vuota viene ignorata, e la chiamata non fa nulla mentre `readonly` è impostato.  
`setSchemaGraphQL`, `setSchemaDBML` e `setSchemaAML` si comportano allo stesso modo, e i loro parser non falliscono mai: un testo che non riescono a leggere carica un documento vuoto anziché generare un errore.  
Dalla versione `4.0.0` tutti e quattro accettano un secondo argomento facoltativo, `{ placement, mode }`:

- `placement: 'grid'`, il valore predefinito, dispone subito le tabelle in righe, come in precedenza, e la chiamata non restituisce nulla.
- `placement: 'auto'` dispone prima le tabelle in base alle loro relazioni, come fa `Import` nell’editor, e restituisce una `Promise` che si risolve una volta che l’importazione è stata applicata come un solo passo di annullamento. Meno di due tabelle, nessuna relazione, un layout che non riesce, una pagina senza `SharedWorker` o `Cancel` sulla notifica `Placing tables` le dispongono invece in righe. Un caricamento nel frattempo — un’altra importazione che sostituisce il documento, l’assegnazione di `value`, `setInitialValue()`, `clear()`, il caricamento di un collaboratore, o l’annullamento o la ripetizione di un caricamento o di `clear()` — prevale su di essa, e la `Promise` si risolve senza che sia stato caricato nulla. Le importazioni disposte in questo modo vengono applicate nell’ordine in cui sono iniziate.
- `mode: 'replace'`, il valore predefinito, sostituisce il documento. `mode: 'append'` aggiunge il file sotto il diagramma come fa [Importa e aggiungi](../guide/guides/file-import-export.md#import-and-add), lasciando invariata ogni tabella già presente e ogni impostazione tranne la scheda e la posizione della vista. Da un’altra scheda viene prima mostrata la scheda ERD. Le nuove tabelle, e i gruppi di tabelle portati da un file DBML mentre i gruppi di tabelle sono visibili, diventano la selezione, e la vista scorre fino a loro a meno che non siano già ben visibili, secondo la regola che ogni salto segue dalla versione `4.1.0` — vedere [Dove porta un salto](../guide/guides/table-related-functions.md#where-a-jump-lands). Un solo annullamento rimuove l’intera aggiunta. Un testo che non riesce a leggere non aggiunge nulla e lascia il documento invariato.

Mentre `readonly` è impostato, una sostituzione viene ignorata, un’aggiunta non aggiunge nulla e una chiamata con `placement: 'auto'` si risolve immediatamente.  
Dalla versione `3.10.0`, `setSchemaSQL` legge il file in base al database corrente del documento: con Databricks selezionato, le stringhe tra apici singoli seguono gli escape con barra rovesciata di Spark. Vedere [Commenti](../guide/guides/file-import-export.md#comments).  
Dalla versione `3.10.0`, `setSchemaSQL` legge un `UNIQUE` su due o più colonne come un unico indice univoco anziché come un flag Univoco su ciascuna colonna. Vedere [Chiavi univoche e indici](../guide/guides/file-import-export.md#unique-keys-and-indexes).  
Dalla versione `3.10.0` le importazioni SQL, DBML e AML mantengono le azioni `ON DELETE` e `ON UPDATE` delle chiavi esterne che leggono.  
Dalla versione `4.0.0`, `setSchemaSQL` mantiene l’intera espressione `DEFAULT` di una colonna, legge `ADD DEFAULT … FOR` di SQL Server e i suoi commenti `MS_Description`, trasforma le colonne serial e identity di PostgreSQL in Incremento automatico, mantiene `UNSIGNED` e `ZEROFILL` in un tipo di dati e legge una chiave primaria che `ALTER TABLE … ADD PRIMARY KEY` contrassegna come `CLUSTERED`, `NONCLUSTERED` o `USING BTREE`. Vedere [Schema SQL](../guide/guides/file-import-export.md#schema-sql).  
Per la sintassi accettata da ciascun parser, vedere [Importare o esportare file](../guide/guides/file-import-export.md).

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

Carica un documento GraphQL SDL.  
Le definizioni dei tipi oggetto diventano tabelle, e un campo il cui tipo è un’altra tabella diventa una relazione.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML {#setschemadbml}

Carica un file DBML, il formato usato da dbdiagram.io e dbdocs.  
Dalla versione `4.0.0` ogni `TableGroup` diventa un [gruppo di tabelle](../guide/guides/table-groups.md), e l’impostazione `headercolor` di una tabella ne diventa il colore. Vedere [DBML](../guide/guides/file-import-export.md#dbml).

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML {#setschemaaml}

Carica un file AML (Azimutt Markup Language). Sono accettate sia la sintassi attuale sia la vecchia sintassi v1.  
Dalla versione `4.0.0` il colore di un’entità, uno dei nomi di colore di Azimutt o un valore esadecimale tra virgolette, diventa il colore della sua tabella. Vedere [AML](../guide/guides/file-import-export.md#aml).

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON {#setschemajson}

Dalla versione `4.0.0`, carica un documento `.erd.json`, come il testo restituito da [value](#value).  
Nella modalità predefinita `mode: 'replace'` carica il documento come fa l’assegnazione di `value`: viene registrato nella cronologia, emette `change` e assume i blocchi del documento allo stesso modo e, dalla versione `4.2.0`, le parole, i termini e i domini del documento sostituiscono quelli dell’editor. A differenza di `value`, una stringa vuota o un valore che non è una stringa viene ignorato anziché avviare un nuovo documento. Un testo che non è JSON svuota il documento, come accade con `value`.  
`mode: 'append'` aggiunge le tabelle, le relazioni, gli indici, i memo e i gruppi di tabelle del documento sotto il diagramma con nuovi id, mantenendo le loro posizioni reciproche e tralasciando le impostazioni del documento, come fa [Importa e aggiungi](../guide/guides/file-import-export.md#import-and-add) con un file `json`. Dalla versione `4.2.0` mantiene i nomi logici e i flag di nome derivato delle tabelle e delle colonne, ma non porta con sé le parole, i termini e i domini del documento, quindi nessuna delle sue colonne è collegata a un dominio. Un testo che non riesce a leggere, o un documento senza tabelle né memo, non aggiunge nulla. Altrimenti viene applicato come un’aggiunta di [setSchemaSQL](#setschemasql), con i nuovi memo e gruppi di tabelle selezionati insieme alle tabelle, ciascun tipo mentre è visibile.  
Restituisce il controllo una volta applicato il documento, e viene ignorato mentre `readonly` è impostato.

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL {#getschemasql}

Esporta lo stato corrente dell’editor come Schema SQL.  
Se `databaseVendor` non è specificato, scrive per il database mostrato dall’editor: quello del documento, a meno che il lettore di un editor [di sola lettura](#readonly) ne abbia scelto un altro, che dalla versione `5.0.0` resta su quello schermo ed è ciò che mostra la sua scheda Schema SQL. Un nome non presente nell’elenco seguente viene trattato allo stesso modo, senza generare errori.  
I nomi vengono delimitati con il tipo di delimitatore mostrato dall’editor. Mentre `Bracket Type` è [bloccato](../guide/guides/settings.md#lock), o in un editor di sola lettura il cui lettore ne ha scelto un altro dalla versione `5.0.0`, può differire da quello salvato da `value`, che è quello con cui delimita i nomi [`erd_read`](../mcp/tools.md#reading-a-document) di un agente di programmazione. I nomi scritti sono sempre quelli fisici, qualunque sia la Visualizzazione nomi.  
Dalla versione `4.0.0` un argomento facoltativo `options` sceglie le istruzioni e l’intestazione, come fanno le opzioni della scheda [Schema SQL](../guide/guides/schema-sql.md), e, dalla versione `4.2.0`, se i nomi logici riempiono i commenti vuoti. `SchemaSQLOptions` viene esportato come tipo.

- `statements`: `'create'`, il valore predefinito; `'ifNotExists'`, che scrive `IF NOT EXISTS` su MySQL, MariaDB, PostgreSQL, SQLite e Databricks e ripiega su `'create'` altrove; oppure `'recreate'`, che elimina le tabelle prima di crearle, mentre Snowflake scrive invece `CREATE OR REPLACE TABLE`.
- `header`: `'none'`, il valore predefinito; `'use'`, che passa al database o allo schema del documento; oppure `'createAndUse'`, che prima lo crea se non esiste e poi vi passa. Un database privo di quello richiesto ripiega come fa la scheda: Oracle scrive `'use'` per `'createAndUse'`, PostgreSQL non scrive alcuna intestazione per `'use'` e SQLite non ne scrive nessuna. Un’intestazione viene scritta solo se il nome del database del documento è un identificatore semplice — lettere ASCII, cifre e `_`, senza iniziare con una cifra.
- `logicalNameAsComment`, dalla versione `4.2.0`: `true` scrive il nome logico di una tabella o di una colonna come suo commento dove il commento proprio è vuoto o composto solo da spazi e il nome logico non lo è, nella forma in cui quel database scrive un commento. Un commento con del testo viene scritto come prima. Solo `true` lo attiva: un’opzione omessa, `false` o qualsiasi altro valore, come `'true'` o `1`, non scrive alcun nome logico. Fa ciò che fa l’interruttore [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments) della scheda.

Un’opzione omessa, o con un valore sconosciuto, viene letta come il suo valore predefinito, quindi una chiamata senza opzioni scrive semplici istruzioni `CREATE` senza intestazione, come in precedenza.  
Dalla versione `4.0.0` l’output include sempre gli script `Before tables` e `After tables` del documento, nell’ordine intestazione, script prima delle tabelle, istruzioni di eliminazione, tabelle, script dopo le tabelle. Le scelte `Statements`, `Header`, `Write logical names into empty comments` e `Tables` della scheda Schema SQL non influiscono mai su questa chiamata, che scrive sempre l’intero documento.  
Dalla versione `3.10.0` ogni chiave esterna riporta le clausole `ON DELETE` e `ON UPDATE` della relazione. Una clausola viene scritta solo quando la sua azione è impostata e il fornitore la accetta, quindi un’azione che quel fornitore non supporta viene omessa e si applica il suo valore predefinito. Dalla versione `4.0.0` Snowflake accetta solo `NO ACTION`. Per ciò che scrive ciascun database, vedere [ON DELETE e ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).  
Dalla versione `3.10.0` un apice singolo all’interno del commento di una tabella o di una colonna viene sottoposto a escape, quindi un commento come `it's` non interrompe più l’istruzione. Ogni fornitore che scrive i commenti come stringhe letterali lo raddoppia, tranne Databricks, che antepone una barra rovesciata a ogni apice e a ogni barra rovesciata. SQLite continua a scrivere i commenti come righe `--`.  
Dalla versione `4.2.0` SQL Server scrive ogni commento come letterale nazionale, `N'…'`, quindi il testo esterno alla tabella codici del database, come il coreano, viene conservato. Oracle scrive ogni sequenza di righe vuote in un commento come un solo a capo, e SQLite scrive gli a capo di un commento come spazi, così che resti sulla sua riga `--`. Vedere [Commenti](../guide/guides/schema-sql.md#comments).  
Dalla versione `4.0.0` diversi database scrivono inoltre in modo diverso i nomi delle chiavi, i valori predefiniti e l’incremento automatico. Vedere [Cosa scrive il DDL](../guide/guides/schema-sql.md#what-the-ddl-writes).

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

Restituisce uno store per la modifica collaborativa in tempo reale.  
`config` è `{ getNickname?, mouseTracker?, focusTracker? }`. Entrambi i tracker valgono `true` per impostazione predefinita: `mouseTracker` trasmette agli altri il cursore di questo editor, e `focusTracker` trasmette la sua cella con il focus, la selezione e il riquadro di trascinamento.  
Dalla versione `5.0.0` lo store non invia alcun cambio finché [readonly](#readonly) è impostato, solo ciò che inviano i suoi tracker e i registri richiesti da un editor che si unisce, e applica comunque ciò che inviano gli altri.  
Vedere [Modifica collaborativa](./advanced/collaborative-editing.md).

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue {#setdiffvalue}

Apre il Visualizzatore differenze, confrontando il documento attualmente aperto con quello passato.  
Non restituisce nulla e non modifica il documento, quindi chiudere il visualizzatore lascia l’editor esattamente com’era.  
Un valore vuoto, o qualsiasi valore che non sia una stringa, viene confrontato con un documento vuoto.  
È la stessa vista sovrapposta che apre la voce [Visualizzatore differenze](../guide/guides/table-related-functions.md#diff-viewer) del menu contestuale dell’area di disegno.  
Dalla versione `4.1.0` abbina il contenuto dei due documenti prima in base all’id e solo dopo in base a ciò che ciascun elemento conserva, come il nome di una tabella o il testo di un memo — vedere [Cosa viene confrontato](../guide/guides/table-related-functions.md#what-is-compared). Rispetto a una versione precedente dello stesso documento, come una revisione Git del suo file, una ridenominazione appare quindi come un unico elemento rinominato; rispetto a un documento con id diversi, appare come una rimozione e un’aggiunta. Il visualizzatore elenca le modifiche in un albero accanto ai due documenti e le contrassegna a colori anziché riempire le celle.  
Dalla versione `4.2.0` entrambi i documenti si aprono nella vista che questo editor mostra, qualunque vista abbia salvato il documento passato, e anche l’albero nomina tabelle e colonne in base a essa — vedere [Oltre l’area di disegno](../guide/guides/logical-names.md#beyond-the-canvas). I nomi logici, i collegamenti ai domini e i dizionari non vengono confrontati, quindi una modifica che riguarda solo questi non mostra alcuna modifica.

```js
editor.setDiffValue('prev json...');
```
