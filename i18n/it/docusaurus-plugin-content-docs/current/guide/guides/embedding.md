---
sidebar_position: 18
description: Mostrare un diagramma in sola lettura su un altro sito senza codice incorporando in un frame erd-editor.io/embed, costruire il suo URL e la sua riga iframe nel generatore, impostare nell’URL tema, lingua, Name View, minimappa, controlli e colori, e servire il file da GitHub o da un server che consente CORS.
---

# Incorporare

[erd-editor.io/embed](https://erd-editor.io/embed) mostra un diagramma in sola lettura in un viewer che riempie la pagina, perché un altro sito lo incorpori in un frame: una wiki, un blog, un costruttore di siti o qualsiasi pagina che non può caricare script propri.  
Il suo parametro `src` indica il documento, l’indirizzo di un file così come lo salva ERD Editor, ad esempio un file `.erd.json`. Il resto dell’URL stabilisce come lo mostra il viewer, e il generatore allo stesso indirizzo scrive per voi l’URL e la sua riga iframe.

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Questo frame mostra [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json) dal repository erd-editor, e questa è la riga che lo inserisce in una pagina:

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## Che cosa mostra il frame {#what-the-frame-shows}

Il frame mostra le tabelle, le colonne, le relazioni, i memo e i gruppi di tabelle del diagramma, e nulla lì modifica il diagramma o il file.  
Il diagramma viene adattato al frame durante il caricamento, qualunque zoom e posizione di scorrimento il file abbia salvato, quindi la dimensione del frame decide lo zoom con cui si apre.

Sopra l’area di disegno ci sono:

- La minimappa, finché il diagramma ha del contenuto.
- La barra dei controlli in basso: `Zoom out`, il livello di zoom, che al clic reimposta lo zoom, `Zoom in`, `Fit`, l’elenco `Name View` e `Go to content` finché nessuna parte del diagramma è sullo schermo.
- Il collegamento `erd-editor.io` in basso a destra, che apre erd-editor.io in una nuova scheda senza inviargli alcun referrer, quindi il clic non comunica al sito nulla del documento mostrato dal frame. In un frame stretto può coprire parte della barra dei controlli.

Mentre il file si carica, il frame mostra `Loading diagram`. Se non può essere scaricato o non contiene alcun documento, il frame mostra un diagramma vuoto con `Couldn't load the diagram` — vedere [File su GitHub](#files-on-github) e [File su altri server](#files-on-other-servers).

Il frame segue soltanto il proprio URL e il sistema del visitatore. La lingua e il tema propri del visitatore su erd-editor.io non vi si applicano.

## Il generatore {#the-builder}

Aprire [erd-editor.io/embed](https://erd-editor.io/embed) senza `src` per ottenere il generatore, una pagina intitolata `Embed a diagram`:

1. Incollare l’indirizzo del documento in `Document URL`. Si applica premendo `Enter` o lasciando il campo, quindi la digitazione non scarica nulla. Una volta applicato, una riga `Loads from` sotto il campo indica l’indirizzo che il viewer scarica: quello fornito oppure, per una pagina su GitHub, il suo indirizzo sull’host raw di GitHub — vedere [File su GitHub](#files-on-github).
2. Scegliere le opzioni. Ciascuna si applica subito all’anteprima, all’URL e alla riga iframe:
   - `Theme`: `System`, `Light` o `Dark`.
   - `Display Language`: `System`, con accanto la lingua che rappresenta nel vostro browser, poi le 25 lingue, ciascuna con il proprio nome.
   - `Name View`: `As Saved`, `Physical Names`, `Logical Names` o `Both Names`. `As Saved` mostra la Visualizzazione nomi salvata dal file.
   - `Accent color` e `Gray color`, ciascuno elencato per nome con un campione di colore.
   - `Minimap` e `Controls`, due interruttori, entrambi attivi.
   - `Height`, in pixel, `480` all’inizio. Un’altezza che non è un numero intero positivo vale `480`.
3. Controllare la `Preview`: il viewer così come lo mostrerà il frame, con il collegamento `erd-editor.io`, in un riquadro alto quanto `Height`. La sua lingua `System` è quella del vostro browser, qualunque lingua stia mostrando erd-editor.io stesso.
4. Copiare il risultato. `Embed URL` è l’indirizzo del frame e `Embed code` la riga iframe, con l’altezza impostata e la larghezza `100%`. Ciascuno ha un pulsante `Copy`, che resta disabilitato finché non si applica un URL del documento e che riporta `Copied` per un istante dopo una copia, finché una modifica non riscrive ciò che ha copiato.

Svuotare `Document URL` svuota l’anteprima e i due risultati una volta applicato.

## Parametri dell’URL {#url-parameters}

| Parametro | Valori | Valore predefinito |
| --- | --- | --- |
| `src` | L’indirizzo del documento, codificato come URL. | Nessuno: senza di esso, o con uno vuoto, la pagina è il generatore. |
| `theme` | `light`, `dark` o `system`. | `system`: la modalità chiara o scura che il browser del visitatore segnala. |
| `locale` | `system`, o un codice della [tabella delle lingue](./language-and-theme.md#display-language), come `de-DE`. | `system`: le lingue del browser del visitatore, abbinate come le abbina [Sistema](./language-and-theme.md#what-system-follows), e l’inglese quando il viewer non ne ha nessuna. |
| `name-view` | `physical`, `logical` o `both`. | La Visualizzazione nomi salvata dal file. |
| `minimap` | `false` nasconde la minimappa. | Mostrata. |
| `controls` | `false` nasconde la barra dei controlli. | Mostrata. |
| `accent-color` | Uno dei 26 colori di accento del [generatore di temi](./language-and-theme.md#theme), come `jade`. | `indigo` |
| `gray-color` | `gray`, `mauve`, `slate`, `sage`, `olive` o `sand`. | `slate` |

I valori predefiniti sono quelli propri del viewer, non quelli dell’app web, che parte con `jade` e `olive`.

- Il generatore lascia fuori dall’URL ogni opzione al suo valore predefinito, quindi un URL di incorporamento contiene solo ciò che differisce.
- Un valore che il viewer non accetta viene ignorato, e la sua opzione mantiene il valore predefinito. I valori vengono abbinati esattamente come elencati, quindi `theme=Dark` viene ignorato, e `minimap` e `controls` restano mostrati per qualsiasi valore diverso da `false`.
- Un parametro indicato due volte prende il suo primo valore.
- `src` è codificato come URL, come lo scrive il generatore, poiché un indirizzo che contiene un `&` o un `#` propri verrebbe altrimenti troncato.

## File su GitHub {#files-on-github}

Un file o un gist su GitHub può essere indicato con l’indirizzo che mostra la sua pagina, come nel frame qui sopra. Il viewer lo scarica invece dall’host raw di GitHub, che risponde alla richiesta di un altro sito dove l’indirizzo della pagina non lo fa:

- La pagina di un file, `https://github.com/<owner>/<repo>/blob/<ref>/<path>`, o il suo indirizzo `raw`, `https://github.com/<owner>/<repo>/raw/<ref>/<path>`, viene caricata da `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>`. `<ref>` è un branch, un tag o un commit: un branch mostra il file così come lo ha quel branch, e un tag o un commit mantiene quella versione.
- La pagina di un gist, `https://gist.github.com/<user>/<id>`, viene caricata da `https://gist.githubusercontent.com/<user>/<id>/raw`, che è il primo file del gist. Mantenere il diagramma come unico file del gist.

L’URL di incorporamento mantiene l’indirizzo fornito, e la riga `Loads from` del generatore mostra quello scaricato.  
Funziona solo per repository pubblici e gist pubblici. L’host raw tiene in cache ogni file per cinque minuti, quindi una modifica inviata può impiegare altrettanto tempo a comparire nel frame.

## File su altri server {#files-on-other-servers}

Il viewer su erd-editor.io scarica il file con una semplice `GET` dal browser del visitatore, quindi il server che lo contiene deve consentire quella richiesta tra origini diverse (CORS): la sua risposta richiede un’intestazione `Access-Control-Allow-Origin` che consenta `https://erd-editor.io`, come `*`.  
La richiesta non porta con sé alcun cookie, quindi il file deve essere leggibile senza accedere.  
Senza quell’intestazione, o per un indirizzo che risponde con un errore o con qualcosa di diverso da un documento di ERD Editor, il frame mostra `Couldn't load the diagram`.

## Nel frame {#in-the-frame}

Il frame non prende né rotellina né gesti né tasti finché un visitatore non fa clic o tocca su di esso o lo raggiunge con `Tab`. Fino ad allora, la rotellina, uno scorrimento con il dito e un pizzico fanno scorrere o ingrandiscono la pagina attorno ad esso come di consueto.  
Una volta che ha il focus, la rotellina sposta il diagramma, `Ctrl + Wheel` (Windows/Linux) o `⌘ + Wheel` (Mac) e un pizzico lo ingrandiscono, e `Ctrl + K` (Windows/Linux) o `⌘ + K` (Mac) apre una ricerca nel documento, dove `#` trova una tabella, `@` una colonna e `:` un commento o un memo.  
Un trascinamento sposta il diagramma che il frame abbia il focus o no, e un clic o un tocco evidenzia le relazioni: quelle della tabella su cui si è fatto clic, o la singola relazione su cui si è fatto clic. La tabella su cui il puntatore è fermo evidenzia le proprie. Vedere [Focus e tasti](../../api/erd-viewer-element.md#focus-and-keys) per tutti i tasti.

Per provarlo su un diagramma più grande, con zoom e ricerca, aprire l’[esempio bookstore](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json), nove tabelle e due gruppi di tabelle, in una pagina a sé.

## Analytics {#analytics}

erd-editor.io conta le visite al frame con Google Analytics, come conta le visite all’app web. L’indirizzo che registra per un frame è soltanto `erd-editor.io/embed`, senza l’indirizzo del documento indicato da `src`.  
Vedere l’[Informativa sulla privacy](https://erd-editor.io/privacy).

## Caricare il viewer da sé {#loading-the-viewer-yourself}

Una pagina che può caricare script può invece mostrare un diagramma con l’elemento [`<erd-viewer>`](../../api/erd-viewer-element.md) del pacchetto `@dineug/erd-editor`. Accetta le stesse opzioni come attributi e metodi, non effettua alcuna richiesta a erd-editor.io e può caricare un documento dal sito stesso della pagina, cosa che non richiede CORS.
