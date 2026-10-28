---
sidebar_position: 4
description: Disegnare un documento come PNG o SVG dal proprio codice con toImage, usando le opzioni della finestra di dialogo Export image, in un browser e nel worker di esportazione dove ce n’è uno.
---

# toImage

Dalla versione `5.0.0` la radice del pacchetto esporta `toImage()`, che disegna un documento come PNG o SVG senza alcun editor nella pagina.  
Scrive i file che scrivono i pulsanti `PNG` e `SVG` della finestra di dialogo [Esporta immagine](../guide/guides/file-import-export.md#image), con le tre opzioni della finestra, `Background`, `Dark mode` e `Scale`, e nessun’altra.

```ts
function toImage(
  value: string,
  options: ToImageOptions & { format: 'png' }
): Promise<Blob>;
function toImage(
  value: string,
  options: ToImageOptions & { format: 'svg' }
): Promise<string>;

type ToImageOptions = {
  format: 'png' | 'svg';
  background?: boolean;
  darkMode?: boolean;
  scale?: 1 | 2 | 3;
};
```

```js
import { toImage } from '@dineug/erd-editor';

const value = await (await fetch('/diagrams/shop.erd.json')).text();

const png = await toImage(value, { format: 'png', scale: 3 });
const svg = await toImage(value, { format: 'svg', darkMode: true, background: false });
```

`ToImageOptions` è esportato come tipo accanto ad essa — vedere [Punti di ingresso](./installation.md#entry-points).

## value {#value}

Il testo del documento: ciò che contiene un file `.erd.json`, il [value](./erd-editor-element.md#value) o il [runtimeValue](./erd-editor-element.md#runtimevalue) di un editor, o qualsiasi altro testo che [setInitialValue](./erd-editor-element.md#setinitialvalue) carica.  
Un testo vuoto, o fatto solo di spazi, disegna un diagramma vuoto, e lo stesso fa un JSON che non contiene nessuno dei campi di un documento, che il parser riempie con i valori predefiniti.

## Opzioni {#options}

| Opzione | Valore predefinito | Descrizione |
| --- | --- | --- |
| `format` | Nessuno; è obbligatoria | `'png'` si risolve in un `Blob` di tipo `image/png`, `'svg'` nel markup dell’SVG come stringa. |
| `background` | `true` | Dipinge il colore dell’area di disegno dietro il diagramma. `false` lo lascia trasparente, compreso il riquadro sotto un’etichetta ON DELETE o ON UPDATE. |
| `darkMode` | `false` | Disegna il tema scuro al posto di quello chiaro. |
| `scale` | `2` | `1`, `2` o `3` pixel dell’immagine per unità del diagramma al 100%. Dimensiona solo il PNG; un SVG ha la dimensione del diagramma qualunque sia la scala. |

`toImage()` non legge nessun’altra chiave, quindi una chiave non elencata nella tabella non cambia nulla.

## Che cosa disegna {#what-it-draws}

L’immagine è quella che disegna la finestra di dialogo:

- L’intero diagramma, ritagliato su ciò che disegna più un margine e sempre al 100%, qualunque zoom il documento abbia salvato, così ogni tabella viene disegnata per intero. Ciò che le [Opzioni di visualizzazione](../guide/guides/table-related-functions.md#table-view-options) nascondono nel documento non viene né disegnato né dotato di spazio, i gruppi di tabelle vengono disegnati dietro a tutto il resto, e i colori che i [controlli del dizionario](../guide/guides/dictionary.md#marks-on-the-canvas) danno ai nomi non vengono disegnati.
- Un PNG ha la dimensione del diagramma al 100% moltiplicata per `scale`. Uno troppo grande per un canvas del browser viene scritto a una risoluzione ridotta anziché fallire, e `toImage()` non lo segnala.
- Un SVG mantiene il proprio testo come testo e indica i propri font anziché incorporarli, quindi un visualizzatore privo del font dell’editor ne disegna un altro. Le ombre sono escluse.

Dove la finestra di dialogo prende lo schermo dell’editor, `toImage()` prende il solo documento, così un documento viene disegnato allo stesso modo in ogni pagina:

- I suoi colori sono quelli del tema predefinito del grigio e dell’accento predefiniti dell’elemento, `slate` e `indigo`, chiaro a meno che `darkMode` sia `true`. Nessun tema della pagina, nessuna sovrascrittura di [setTheme](./erd-editor-element.md#settheme) e nessuna modifica del [generatore di temi](../guide/guides/language-and-theme.md) lo raggiunge.
- Le sue tabelle e colonne sono denominate nella [Visualizzazione nomi](../guide/guides/logical-names.md#name-view) contenuta nel documento, che per un file con il blocco `Name View` attivo è quella bloccata.
- Le parole che il diagramma disegna da sé, come il segnaposto di una tabella senza nome, sono in inglese.

## Dove viene eseguita {#where-it-runs}

`toImage()` richiede una pagina del browser, poiché misura e disegna su un canvas. La radice del pacchetto da cui proviene richiede un DOM per essere caricata, quindi non è raggiungibile da Node né da un Web Worker — vedere [Rendering lato server](./installation.md#server-side-rendering).  
Attende che i font della pagina finiscano di caricarsi prima di disegnare.

Disegna nel worker condiviso di esportazione delle immagini dove l’host ne esegue uno, come fa la finestra di dialogo, così nel frattempo la pagina resta reattiva, e nel thread principale dove non ce n’è alcuno o il worker non risponde in tempo — vedere [Web Worker](./installation.md#web-workers).  
Un bundle che importa `toImage` e nessun elemento contiene il solo worker di esportazione delle immagini.  
Nessuna delle due build per [tag script](./installation.md#script-tag) lo contiene: `window.ErdEditor` e `window.ErdViewer` non hanno `toImage`.

## Rifiuti {#rejections}

La Promise che restituisce viene rifiutata, prima che venga disegnato qualcosa, quando:

- la pagina non ha alcun `document`: un `Error`, `toImage needs a browser, since it draws on a canvas`;
- `value` non è una stringa, come un documento già analizzato in un oggetto: un `TypeError`;
- un’opzione contiene un valore che la tabella [Opzioni](#options) non elenca, compreso un `format` mancante, e lo stesso vale per una `scale` pari a `'2'` passata con un SVG: un `TypeError` che indica l’opzione, come in `toImage: scale cannot be 4`;
- il testo non è un documento che il parser possa leggere: l’errore del parser, un `SyntaxError` per un testo che non è JSON.

## Finestra di dialogo Export image {#export-image-dialog}

La finestra di dialogo e `toImage()` disegnano attraverso la stessa esportazione, quindi con le stesse opzioni scrivono la stessa immagine, ma partono da punti diversi:

| | Finestra di dialogo `Export image` | `toImage()` |
| --- | --- | --- |
| Documento | Il diagramma com’era quando la finestra si è aperta | Il testo che si passa |
| Dark mode | Parte in accordo con l’aspetto dell’editor e, finché coincide, disegna i colori propri dello schermo | Disattivato a meno che `darkMode` sia `true`, e sempre il tema predefinito |
| Name View | Quella mostrata dall’editor | Quella contenuta nel documento |
| Lingua delle sue parole | La lingua di visualizzazione dell’editor | Inglese |
| Risultato | Salvato tramite il browser o la [callback di esportazione](./installation.md#file-dialogs), oppure copiato negli Appunti | Restituito a chi lo chiama; nessuna delle due callback dei file viene chiamata |

`Copy to clipboard` non ha un equivalente. Una pagina che ne vuole uno scrive da sé il `Blob` PNG negli Appunti.
