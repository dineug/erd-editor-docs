---
sidebar_position: 3
description: L’API dell’elemento erd-viewer — un diagramma di sola lettura da un value o da un URL src, la sua minimappa e la barra dei controlli, gli eventi load ed error, i temi, la lingua di visualizzazione, il focus e i tasti, il caricamento e ciò che aggiunge a una pagina.
---

# ErdViewerElement

Dalla versione `5.0.0` il pacchetto distribuisce anche `<erd-viewer>`, una vista di sola lettura di un documento: un lettore sposta la vista, esegue lo zoom, cerca ed evidenzia le relazioni, e nulla lì modifica. Disegna la sola area di disegno ERD, con le sue barre di scorrimento, una [minimappa](#minimap), una [barra dei controlli](#controls) e una tavolozza che cerca nel documento, e non ha barra degli strumenti, schede, pannello Esplora né menu contestuale.

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Il frame qui sopra è questo elemento così come lo mostra erd-editor.io/embed, qui con l’esempio bookstore: fare clic per dargli il focus, poi eseguire zoom e ricerca con i tasti descritti in [Focus e tasti](#focus-and-keys), e vedere [Incorporare](../guide/guides/embedding.md) per incorporare in un frame un documento proprio senza codice.

Il viewer è un semplice `HTMLElement`.  
La sua definizione di tipo è la seguente.

```ts
interface ErdViewerElement extends HTMLElement {
  src: string;
  nameView: 'physical' | 'logical' | 'both' | null;
  minimap: boolean;
  controls: boolean;
  value: string;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => Promise<void>;
  setSystemLocale: (locale: string | null) => Promise<void>;
  destroy: () => void;
}
```

L’importazione di `@dineug/erd-editor/erd-viewer.js` definisce `<erd-viewer>` e lascia `<erd-editor>` non definito. L’importazione della radice del pacchetto non definisce nessuno dei due: esporta la classe `ErdViewerElement` e `defineErdViewer()`, che definisce il tag nel punto in cui viene chiamata, quindi una pagina può anche definire la classe con un tag proprio — vedere [Registrare gli elementi](./installation.md#registering-the-elements).  
Ogni punto di ingresso tranne `engine.js` e `peer.js` richiede un DOM, anche questo, quindi una pagina con rendering lato server lo importa sul client — vedere [Rendering lato server](./installation.md#server-side-rendering).  
L’importazione del punto di ingresso aggiunge `erd-viewer` a `HTMLElementTagNameMap`, quindi `document.createElement('erd-viewer')` e `document.querySelector('erd-viewer')` sono tipizzati `ErdViewerElement` senza bisogno di un cast.

Come l’editor, il viewer viene disegnato in una shadow root chiusa, quindi `viewer.shadowRoot` è `null` e gli stili della pagina non entrano né escono; lo si stila con [setTheme](#settheme) e con le proprietà personalizzate `--erd-editor-*`. Più viewer in una pagina mantengono ciascuno il proprio documento, la propria vista, il proprio tema e la propria lingua.  
`<erd-viewer>` non ha dimensioni intrinseche. Un elemento personalizzato è inline, quindi assegnargli `display: block` e un’altezza, come sopra. La vista riempie il riquadro dell’elemento e lo segue quando viene ridimensionato, mantenendo lo zoom.

`src`, `name-view`, `minimap` e `controls` sono i suoi soli attributi, ciascuno con una proprietà dello stesso nome, `nameView` per `name-view`. [value](#value) è solo una proprietà.  
Un `value`, `src`, `nameView`, `minimap` o `controls` impostato sull’elemento prima che il suo tag sia definito, ad esempio da un framework che disegna l’elemento prima che il punto di ingresso sia stato caricato, viene recepito una volta definito il tag, al posto degli attributi forniti dal markup. Vengono recepiti nell’ordine in cui la pagina ha scritto ciascuno per la prima volta, quindi prevale il più recente tra `value` e `src`. Un `value` che non contiene alcun documento non ha allora più un chiamante a cui generare l’eccezione: viene segnalato come errore non intercettato, e il viewer resta vuoto.

La build per tag script, `dist/erd-viewer.umd.js`, contiene il solo viewer con tutte le dipendenze. Definisce `<erd-viewer>` e mette `ErdViewerElement` e `defineErdViewer` su `window.ErdViewer`. Un URL CDN senza percorso fornisce invece la build dell’editor, quindi indicare il file — vedere [Tag script](./installation.md#script-tag).

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

L’URL di un documento che il viewer scarica e mostra. Per impostazione predefinita è `''`, cioè nessuno.  
Il download è un semplice `fetch()`, una `GET` senza opzioni proprie, quindi lo governano le regole CORS del browser: un documento su un’altra origine richiede un server che consenta l’origine della pagina, e i cookie vanno solo all’origine della pagina stessa. Un URL relativo viene risolto rispetto alla pagina.  
La risposta deve contenere un documento come quello di un file `.erd.json`, la forma di archiviazione che il [value](./erd-editor-element.md#value) dell’editor e ogni host ufficiale scrivono. Nessun altro formato viene letto: un file SQL, GraphQL, DBML o AML fallisce come testo che non viene analizzato.  
Un documento analizzato correttamente viene adattato alla vista ed emette [load](#load). Una richiesta rifiutata dalla rete o da CORS, una risposta non `ok` o un testo che non viene analizzato emette [error](#error) e lascia un diagramma vuoto — vedere [Caricamento](#loading).

Conta solo l’ultima richiesta. Un nuovo `src` interrompe il download ancora in corso, quindi una risposta lenta non sovrascrive mai un documento successivo. Anche l’assegnazione di [value](#value) lo interrompe, così come la rimozione di `src` o la sua impostazione a `''`, che smette di seguirlo e lascia il documento mostrato com’era.  
Prevale quello impostato per ultimo tra `value` e `src`, sia tramite la proprietà sia tramite l’attributo. Un `src` scritto dopo un `value` viene scaricato anche quando indica l’URL scaricato prima. Se viene scritto di nuovo sopra il documento che mostra già, non scarica nulla.  
Il viewer scarica solo mentre è in una pagina. Rimuoverlo interrompe un download ancora in corso, e rimetterlo scarica un `src` che non ha ancora mostrato, anche uno non riuscito, mai uno che mostra già.  
`src` è l’unico `fetch()` che il pacchetto esegue, quindi una Content Security Policy restrittiva indica l’origine del documento in `connect-src`.

```js
viewer.src = 'https://example.com/diagrams/shop.erd.json';
// or
viewer.setAttribute('src', 'https://example.com/diagrams/shop.erd.json');
```

```html
<erd-viewer src="https://example.com/diagrams/shop.erd.json"></erd-viewer>
```

## value {#value}

### getter {#getter}

Restituisce il documento mostrato, che provenga da `src` o da `value`, come stringa JSON nella forma di archiviazione che il [value](./erd-editor-element.md#value) dell’editor scrive. Prima che venga mostrato qualcosa è un documento nuovo e vuoto, il cui `doc` è `{}`.  
Finché il [blocco](../guide/guides/settings.md#lock) `Viewport` del documento è attivo, come in un documento nuovo, scrive lo zoom e lo scorrimento a cui il documento è bloccato, ovunque il lettore abbia spostato la vista. Solo con quel blocco disattivato scrive dove si trova la vista, compreso l’adattamento di un atterraggio.  
Scrive la Visualizzazione nomi contenuta nel documento, mai quella che [nameView](#nameview) o la barra dei controlli mostra al di sopra, anche in un documento il cui blocco `Name View` è disattivato.  
Restituisce il documento anche dopo [destroy](#destroy).

```js
const data = viewer.value;
```

### setter {#setter}

Mostra un documento dal suo testo, sostituendo quello mostrato, e lo adatta alla vista — vedere [Caricamento](#loading). Accetta il testo contenuto in un file o nel `value` dell’editor.  
Un testo che non viene analizzato genera un’eccezione prima che cambi qualcosa, e il documento mostrato resta: un `SyntaxError` per un testo che non è JSON, un `TypeError` per un JSON che non contiene alcun documento, come `7`. Una stringa vuota, o qualsiasi valore che non sia una stringa, mostra un diagramma vuoto.  
L’assegnazione interrompe un download di `src` ancora in corso, e non emette né `load` né `error`.

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

Mostra il diagramma in una [Visualizzazione nomi](../guide/guides/logical-names.md#name-view) al posto di quella contenuta nel documento: `'physical'` per `Physical Names`, `'logical'` per `Logical Names` o `'both'` per `Both Names`. `null`, il valore predefinito, mostra quella propria del documento, e un valore di attributo diverso dai tre viene letto come `null`.  
Resta in vigore su ogni documento caricato dopo di essa, e [value](#value) non la scrive mai. La rimozione dell’attributo torna alla vista propria del documento.  
Anche l’elenco `Name View` della [barra dei controlli](#controls) cambia la vista, fino all’arrivo del documento successivo o al successivo cambio di `nameView`. Neppure un cambio lì viene scritto in `value`.

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

Mostra la minimappa nell’angolo in alto a destra, finché il documento contiene una tabella, un memo mostrato o un gruppo di tabelle mostrato. È attiva per impostazione predefinita.  
Funziona come quella dell’editor: fare clic su di essa per spostare lì la vista, oppure trascinare il suo rettangolo di visualizzazione per spostarla — vedere [Muoversi nell’area di disegno](../guide/guides/table-related-functions.md#getting-around-the-canvas). Un dito su di essa appartiene alla pagina finché il viewer non ha il focus.  
Solo `minimap="false"` la disattiva. Un attributo senza valore, qualsiasi altro valore e l’assenza dell’attributo la lasciano attiva.

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

Mostra la barra dei controlli al centro del bordo inferiore dell’area di disegno. È attiva per impostazione predefinita e contiene, da sinistra a destra:

- Lo zoom: `Zoom out`, il livello di zoom attuale in percentuale e `Zoom in`. I due pulsanti eseguono lo zoom a scatti come i tasti dello zoom, e un clic sulla percentuale, `Reset zoom`, lo riporta a `100%`. Ciascuno indica il proprio tasto nel tooltip.
- `Fit`, che esegue zoom e scorrimento in modo che l’intero diagramma sia visibile nella vista, centrato.
- `Name View`, un pulsante che indica la vista attiva e apre sopra la barra un elenco di `Physical Names`, `Logical Names` e `Both Names` — vedere [nameView](#nameview).
- La bussola `Go to content`, che si aggiunge alla fine della barra solo finché nessuna parte del diagramma è sullo schermo, e porta la vista alla parte più vicina.

La barra si dispone da sinistra a destra in ogni lingua.  
Solo `controls="false"` la disattiva, insieme alla sua bussola e al suo elenco `Name View`. Un attributo senza valore, qualsiasi altro valore e l’assenza dell’attributo la lasciano attiva. Senza la barra, la rotellina, il pizzico e i tasti eseguono comunque lo zoom una volta che il viewer ha il focus.

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Eventi {#event}

`load` ed `error` sono gli unici due eventi, ed entrambi riguardano `src`. Nessuno dei due risale lungo l’albero, quindi bisogna ascoltare sull’elemento stesso.

### load {#load}

Emesso quando il documento indicato da `src` è stato scaricato e mostrato. `event.detail` è `null`.  
L’assegnazione di `value` non ne emette alcuno, e neppure un download interrotto da un `src` successivo, da un `value`, dalla rimozione dell’elemento dalla pagina o da [destroy](#destroy).

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

Emesso quando il download di `src` fallisce: la rete o CORS hanno rifiutato la richiesta, la risposta non era `ok`, oppure il suo testo non è stato analizzato. Il viewer mostra allora un diagramma vuoto e l’avviso `Couldn't load the diagram` — vedere [Caricamento](#loading).  
`event.detail` è la causa: il `TypeError` con cui `fetch()` viene rifiutato, un `Error` che indica lo stato, come `GET /missing.erd.json answered 404 Not Found`, oppure il `SyntaxError` o il `TypeError` del parser.  
Un download interrotto da qualcosa non emette nulla.

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

Imposta un tema predefinito, accettando i `ThemeOptions` dell’editor — vedere [setPresetTheme](./erd-editor-element.md#setpresettheme).  
Il viewer parte con `appearance: 'system'`, `grayColor: 'slate'` e `accentColor: 'indigo'`, quindi fin dal primo frame mostra il chiaro o lo scuro indicato dal sistema operativo e passa all’altro quando questo cambia. L’editor parte invece in scuro.  
Ogni campo viene applicato per conto proprio, quindi una chiamata parziale lascia gli altri due com’erano. Un valore che non è uno dei nomi viene ignorato, e la chiamata non genera mai eccezioni.  
Il viewer non ha un generatore di temi né `systemDarkMode`, e non emette alcun evento per un tema.

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

Indica il chiaro o lo scuro che l’aspetto `'system'` mostra, per una pagina con un proprio chiaro e scuro. Finché ne è indicato uno, i cambiamenti del sistema operativo vengono ignorati.  
`null`, o qualsiasi valore diverso da `'dark'` o `'light'`, torna a seguire il sistema operativo.  
Finché l’aspetto è `'light'` o `'dark'` non cambia nulla sullo schermo, ma il valore viene conservato e si applica non appena l’aspetto diventa `'system'`. Non emette nulla.

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

Sovrascrive i token del tema sopra quello predefinito, accettando i token `Theme` dell’editor — vedere [setTheme](./erd-editor-element.md#settheme).  
Ogni chiamata sostituisce l’intera sovrapposizione, quindi passare `{}` per tornare al tema predefinito. Vengono conservati solo i nomi dei token, con valori stringa, e un successivo `setPresetTheme` cambia il tema predefinito sottostante mentre le sovrascritture restano.  
Anche le proprietà personalizzate CSS `--erd-editor-*` raggiungono il viewer, se impostate sull’elemento o in un punto qualsiasi sopra di esso — vedere [Variabili CSS](./erd-editor-element.md#css-variables). L’area di disegno, che nessun foglio di stile raggiunge, le rilegge quando cambia un foglio di stile nell’`head` della pagina, o quando cambia l’attributo `class` o `style` dell’elemento o di un elemento sopra di esso. Una regola aggiunta con `insertRule()` non cambia nessuna di queste cose, quindi l’area di disegno la recepisce al successivo cambiamento di questo tipo.

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

Imposta la lingua di visualizzazione: `'system'`, il valore predefinito, o uno dei 25 codici elencati nella [Lingua di visualizzazione](./erd-editor-element.md#display-language) dell’editor. Qualsiasi altro valore, come un semplice `'ko'` o un valore che non è una stringa, viene ignorato.  
La lingua cambia i tooltip della barra dei controlli, l’elenco `Name View`, la tavolozza, gli avvisi di caricamento e le parole che il diagramma disegna da sé, come `unnamed`. I nomi, i commenti e il resto del documento non vengono mai tradotti.

L’inglese fa parte del punto di ingresso del viewer e si applica prima che la chiamata restituisca il controllo. Ogni altra lingua è un modulo a sé, che il bundler genera come chunk accanto al viewer e che il viewer scarica dal proprio bundle la prima volta che una pagina richiede quella lingua, una sola volta per tutti i viewer della pagina. Finché non arriva, il viewer continua a mostrare la lingua che mostrava, l’inglese nel primo frame. Se il caricamento fallisce, il viewer mostra l’inglese, e richiedere di nuovo quella lingua riprova.  
La build per [tag script](./installation.md#script-tag) contiene tutte le 25 lingue, quindi non ne scarica nessuna. Un bundle che contiene anche l’editor carica ogni lingua con il chunk dell’editor — vedere [Registrare gli elementi](./installation.md#registering-the-elements).  
La `Promise` che restituisce viene risolta quando quella lingua è arrivata o non è riuscita ad arrivare, e non viene mai rifiutata. Quella lingua, o l’inglese dopo un errore, è allora in vigore, a meno che una chiamata successiva ne abbia richiesta un’altra: prevale la chiamata successiva, qualunque sia l’ordine in cui le lingue arrivano.

L’ebraico, l’arabo e il persiano dispongono la tavolozza e gli avvisi di caricamento da destra a sinistra. L’area di disegno, la minimappa, le barre di scorrimento e la barra dei controlli con la sua bussola restano da sinistra a destra, come l’area di disegno dell’editor — vedere [Lingue da destra a sinistra](../guide/guides/language-and-theme.md#right-to-left-languages).  
Il viewer imposta `lang` e `dir` sulla propria radice all’interno della shadow root chiusa, mai sull’elemento host né sulla pagina.  
Non emette nulla, e il viewer non ha un selettore della lingua e non memorizza nulla.

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

Specifica la lingua rappresentata da `'system'`, come tag BCP 47, per una pagina con un’impostazione della lingua propria.  
Il tag viene ripulito dagli spazi iniziali e finali. `null`, una stringa vuota o un valore che non è una stringa torna alle lingue della pagina.  
Queste sono l’attributo `<html lang>` della pagina, poi `navigator.languages` del browser, letto una sola volta, quando il viewer si connette per la prima volta. `'system'` prende la prima di esse per cui il viewer ha una lingua, con la regola dell’editor descritta in [setSystemLocale](./erd-editor-element.md#setsystemlocale), e l’inglese quando non ne ha nessuna. Quindi una pagina il cui `<html lang>` indica una lingua che il viewer ha mostra quella lingua qualunque sia la preferenza del browser, e un successivo cambio di `lang` o delle lingue del browser non sposta nessun viewer.  
Conta solo mentre l’opzione in vigore è `'system'`, e la sua `Promise` viene risolta come quella di [setLocale](#setlocale).

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

Termina il viewer in modo definitivo. Rimuove la vista prima di restituire il controllo, che l’elemento sia ancora nella pagina o ne sia stato rimosso prima, interrompe un download di `src` ancora in corso e smette di seguire la combinazione di colori del sistema operativo e gli stili della pagina.  
Un viewer distrutto non disegna più nulla, non scarica nulla e non richiede alcuna lingua, anche se viene aggiunto di nuovo a una pagina. La lettura di [value](#value) restituisce comunque il documento che conteneva.  
La rimozione dell’elemento dalla pagina non lo distrugge: rimesso, continua, e scarica un `src` che non ha ancora mostrato — vedere [Caricamento](#loading).

```js
viewer.destroy();
```

## Focus e tasti {#focus-and-keys}

Un viewer non prende il focus quando viene montato, quando arriva un documento o quando la sua tavolozza si chiude, quindi non fa mai scorrere la pagina fino a sé né prende i tasti della pagina.  
Un clic o un tocco sulla sua area di disegno gli dà il focus senza far scorrere la pagina, ed è una tappa del tasto `Tab`. A differenza dell’editor, non ha propri membri `focus()` o `blur()`. Una pressione in qualsiasi altro punto della pagina gli toglie di nuovo il focus.

Finché il viewer non ha il focus, la pagina mantiene la rotellina, che fa scorrere la pagina, e il pizzico del trackpad. Un dito sull’area di disegno fa scorrere la pagina e non sposta nulla, e ogni tasto raggiunge la pagina senza essere impedito.  
Una volta che ha il focus:

- La rotellina sposta la vista, e `Shift + Wheel` la sposta lateralmente. Sopra un memo il cui testo trabocca, la rotellina fa scorrere il memo.
- `Ctrl + Wheel` (Windows/Linux) o `⌘ + Wheel` (Mac), il pizzico del trackpad o due dita su uno schermo tattile eseguono lo zoom.
- Un dito sposta la vista.
- `Ctrl + Plus` e `Ctrl + Minus` (Windows/Linux) o `⌘ + Plus` e `⌘ + Minus` (Mac) eseguono lo zoom a scatti come i pulsanti `Zoom in` e `Zoom out`, e `Ctrl + 0` (Windows/Linux) o `⌘ + 0` (Mac) tornano direttamente a `100%`, lasciando dov’è il centro dello schermo.
- `Ctrl + K` (Windows/Linux) o `⌘ + K` (Mac) apre la tavolozza, e `Esc` la chiude.

Questi sono i suoi unici tasti, e non possono essere riassegnati. Ogni altro tasto raggiunge la pagina senza essere impedito, con o senza focus: `Delete`, `Backspace`, `Space`, `Enter`, `Tab`, `Ctrl + A`, `Ctrl + F` e ogni combinazione che nell’editor modifica.

La tavolozza cerca solo nel documento e non elenca alcun comando. Il suo campo vuoto mostra i prefissi: `#` cerca le tabelle, `@` le colonne, `:` i commenti e i memo, e `?` elenca i prefissi, come nell’editor — vedere [Cercare nel diagramma](../guide/guides/quick-search.md#searching-the-diagram). Una parola senza prefisso mostra `No commands match` sopra le righe che cercano quella parola nel diagramma.  
La scelta di una riga sposta la vista con la regola dell’editor, [Dove porta un salto](../guide/guides/table-related-functions.md#where-a-jump-lands), lasciando lo zoom com’è, e mette in evidenza con un contorno ciò che ha raggiunto, portato in primo piano: la tabella, la tabella che contiene la colonna o il commento, oppure il memo.  
La scelta di una riga o la pressione di `Esc` chiude la tavolozza e lascia il focus senza alcun elemento, quindi la rotellina successiva fa scorrere la pagina; fare clic sulla vista per ridarle la rotellina e i tasti. Mentre la tavolozza è aperta, la rotellina fa scorrere il suo elenco e i tasti dello zoom non fanno nulla.

Con o senza focus, un trascinamento con il pulsante principale del mouse sposta la vista da qualsiasi punto dell’area di disegno, anche su una tabella. Un clic o un tocco che non sposta evidenzia le relazioni: su una tabella, le relazioni di quella tabella; su una linea di relazione, quella linea; in qualsiasi altro punto, un memo compreso, spegne l’evidenziazione. Un clic di questo tipo cancella anche il contorno lasciato da un salto della tavolozza. Il puntatore fermo su una tabella ne evidenzia le relazioni finché vi si trova.  
Nessuna pressione seleziona, sposta o modifica qualcosa. Non c’è alcuna selezione se non il contorno di un salto, nessun riquadro di selezione, e né un doppio clic né `Enter` aprono una cella.

## Caricamento {#loading}

Mentre `src` viene caricato, un avviso al centro dell’area di disegno riporta `Loading diagram` accanto a un indicatore che gira. Quando un caricamento fallisce, riporta `Couldn't load the diagram` accanto a un segnale di avviso, finché un nuovo `src` o un `value` non ne prende il posto o `src` non viene rimosso. Le pressioni attraversano l’avviso e raggiungono l’area di disegno, e l’avviso è scritto nella lingua di visualizzazione, da destra a sinistra in una lingua da destra a sinistra.

Ogni documento che arriva, da `src` o da `value`, viene adattato al riquadro del viewer: con zoom e scorrimento tali da mostrare l’intero diagramma, centrato, come fa `Fit`, mettendo da parte lo zoom e lo scorrimento salvati nel file. Un documento consegnato prima che il viewer abbia una dimensione, impostato prima che sia in una pagina o mentre il suo riquadro è vuoto, viene adattato appena ne ha una. Un successivo ridimensionamento mantiene lo zoom; `Fit` adatta di nuovo.

Il viewer scarica un `src` solo mentre è in una pagina. Rimuoverlo interrompe un download ancora in corso, e rimetterlo scarica un `src` che non ha ancora mostrato, anche uno non riuscito, mai uno che mostra già. Un viewer che non serve più si termina con [destroy](#destroy).

## Che cosa aggiunge a una pagina {#what-it-adds-to-a-page}

- Nessun worker. Non ne avvia alcuno, quindi una Content Security Policy non richiede `worker-src` per esso.
- Nessuna archiviazione. Non scrive cookie, `localStorage`, `sessionStorage` né IndexedDB.
- Due tipi di richiesta: il download di [src](#src), la cui origine una policy restrittiva indica in `connect-src`, e il modulo di una lingua di visualizzazione diversa dall’inglese, dal proprio bundle — vedere [setLocale](#setlocale).
- Stili in fogli di stile costruiti, che un `style-src` restrittivo lascia passare. Un browser senza fogli di stile costruiti, come Firefox precedente alla 101, riceve invece elementi `<style>`, che richiedono `style-src 'unsafe-inline'`.
- Listener su `window`. L’importazione del punto di ingresso ne aggiunge tre per la durata della pagina, per `mousedown`, `touchstart` e l’evento `@dineug/erd-editor/internal-forward-move-start` del pacchetto. Konva, che disegna l’area di disegno, imposta `window.Konva` e, con il suo primo stage, aggiunge listener del mouse e del tocco a `window` e un listener `visibilitychange` a `document`, che non rimuove mai. Il punto di ingresso dell’editor aggiunge gli stessi.
- Fino a [destroy](#destroy), ogni viewer segue la combinazione di colori del sistema operativo e osserva gli stili della pagina per le proprietà personalizzate descritte in [setTheme](#settheme).
