---
sidebar_position: 15
description: Le 25 lingue di visualizzazione dell’editor, il layout da destra a sinistra, gli aspetti System, Light e Dark del generatore di temi e i suoi colori, e dove li conserva ciascun host.
---

# Lingua e tema

Il testo dell’editor stesso è disponibile in 25 lingue, e la sua veste grafica è un tema: un aspetto (`System`, `Light` o `Dark`), una tonalità di grigio e un colore principale.  
Entrambi appartengono alla persona che usa l’editor, non al diagramma. Nessuno dei due viene salvato nel file, registrato nella [cronologia delle modifiche](./undo-redo.md) o condiviso con i collaboratori, quindi ciascuno vede i propri, e cambiare l’uno o l’altro non contrassegna mai un file come modificato.

Nessuno dei due si trova nella scheda [Impostazioni](./settings.md). La barra degli strumenti ha un pulsante `Theme` e, subito dopo, un pulsante `Display Language`, entrambi dopo il pulsante [`Explorer`](./explorer.md). La [Ricerca rapida](./quick-search.md) elenca `Theme` e `Display Language` in ogni scheda.  
L’app web, Google Drive, VS Code, gli IDE JetBrains e Obsidian li offrono entrambi e ricordano le scelte effettuate — vedere [In ogni host](#in-each-host). Entrambi funzionano anche in un editor di sola lettura.

## Lingua di visualizzazione {#display-language}

La lingua riguarda il testo dell’editor stesso: i tooltip della barra degli strumenti, i menu contestuali, la Ricerca rapida, i pannelli e le finestre di dialogo, la scheda Impostazioni, la [schermata di benvenuto](./editing-start.md#welcome-screen), le notifiche e i messaggi, e il testo segnaposto mostrato nell’area di disegno e in un’immagine esportata quando un nome, un tipo di dati, un valore predefinito o un commento è vuoto.  
In ogni lingua lascia così come sono scritti: i nomi delle tabelle e delle colonne, i commenti e i memo; i fornitori di database, i linguaggi del Generatore di codice e i formati di file; i tipi di dati, le parole chiave SQL e le azioni `ON DELETE` e `ON UPDATE`; le opzioni di Schema SQL `Create`, `If not exists`, `Drop & re-create`, `USE` e `CREATE + USE`; gli indicatori `PK`, `FK`, `UQ`, `AI`, `NN`, `N-N`, `NULL` e `AK1.1`; le lettere di stato `A`, `M`, `D`, `R` e `~` del [Visualizzatore differenze](./table-related-functions.md#diff-viewer); le scelte dello stile dei nomi e di `Bracket` diverse da `None`; i nomi dei tasti della tastiera; i nomi dei colori del generatore di temi; l’SQL e il codice generati; e i nomi dei file esportati.

Le lingue, nell’ordine in cui le elenca il selettore:

| Nel selettore | Lingua | Codice |
| --- | --- | --- |
| Bahasa Indonesia | indonesiano | `id-ID` |
| Deutsch | tedesco | `de-DE` |
| English | inglese | `en` |
| Español | spagnolo | `es-ES` |
| Euskara | basco | `eu-ES` |
| Français | francese | `fr-FR` |
| Italiano | italiano | `it-IT` |
| Nederlands | olandese | `nl-NL` |
| Polski | polacco | `pl-PL` |
| Português | portoghese | `pt-PT` |
| Português Brasileiro | portoghese brasiliano | `pt-BR` |
| Română | rumeno | `ro-RO` |
| Slovenčina | slovacco | `sk-SK` |
| Slovenščina | sloveno | `sl-SI` |
| Svenska | svedese | `sv-SE` |
| Türkçe | turco | `tr-TR` |
| Русский | russo | `ru-RU` |
| Українська | ucraino | `uk-UA` |
| עברית | ebraico | `he-IL` |
| العربية | arabo | `ar-SA` |
| فارسی | persiano | `fa-IR` |
| 日本語 | giapponese | `ja-JP` |
| 简体中文 | cinese semplificato | `zh-CN` |
| 繁體中文 | cinese tradizionale | `zh-TW` |
| 한국어 | coreano | `ko-KR` |

La voce `Language` che la Ricerca rapida propone nella scheda Generatore di codice, e la riga `Language` dell’elenco [Blocco](./settings.md#lock) nella scheda Impostazioni, corrispondono al [linguaggio di destinazione del Generatore di codice](./code-generator.md#language), non alla lingua di visualizzazione.

### Scegliere una lingua {#picking-a-language}

Il pulsante `Display Language` (un’icona delle lingue) apre il selettore `Display Language`, un pannello intitolato `Display Language` sotto la barra degli strumenti, sopra la scheda aperta, qualunque essa sia.  
Per prima viene l’opzione `System`, con accanto la lingua che rappresenta in quel momento, e resta visibile mentre l’elenco scorre. Seguono le 25 lingue, ciascuna con il proprio nome, e un segno di spunta contrassegna l’opzione attiva.

![Cambio della lingua di visualizzazione dalla barra degli strumenti in 한국어, poi in العربية, che inverte a specchio la barra degli strumenti ma non il diagramma, e ritorno a System](/img/demo-display-language.webp)

Il pannello si apre con il focus sulla riga con il segno di spunta:

- `↑` e `↓` percorrono le righe in modo circolare, e `Home` e `End` saltano alla prima e all’ultima.
- `Enter` o `Space` sceglie la riga con il focus, come un clic.

Una scelta si applica subito, chiude il pannello e restituisce il focus all’editor.

Per chiuderlo senza scegliere, usare `Escape`, il pulsante `x` accanto al titolo, il cui tooltip riporta `Close (ESC)`, una pressione in qualsiasi punto dell’editor fuori dal pannello tranne che sulla barra degli strumenti, oppure di nuovo il pulsante `Display Language`.  
Aprirlo chiude il generatore di temi e il pannello Proprietà tabella. Un pannello [Esplora](./explorer.md#dialogs-beside-it) aperto resta aperto, e in una lingua da sinistra a destra il selettore si colloca subito oltre il pannello anziché coprirlo.  
Aprire la Ricerca rapida o il generatore di temi lo chiude, e così fa anche `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac). Quel tasto apre il pannello [Esplora](./explorer.md#opening-and-closing) sulla sua ricerca oppure, se il pannello Esplora è già aperto, lo mantiene aperto e porta il focus nel suo campo Trova. Il pulsante `Explorer` della barra degli strumenti lascia aperto il selettore.

Mentre il pannello ha il focus, alcuni tasti di scelta rapida dell’editor continuano a funzionare: `Search`, `Toggle Explorer`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` e `Zoom Reset` — vedere [Tasti di scelta rapida](./settings.md#shortcuts). Tutti gli altri tasti di scelta rapida dell’editor, i tasti freccia e `Tab` non vanno oltre il pannello, quindi l’editor non vi reagisce. I tasti non associati dall’editor, come quello di salvataggio dell’host, arrivano all’host come di consueto.

Nella [Ricerca rapida](./quick-search.md), la voce `Display Language` elenca `System` e le 25 lingue, con un segno di spunta sull’opzione attiva. Lì una lingua si trova anche con il suo nome inglese o con il suo codice, quindi `german` o `de-DE` trova `Deutsch`.

### Cosa segue l’opzione Sistema {#what-system-follows}

L’opzione `System` è il valore di partenza della lingua nell’app web, in Google Drive, in VS Code, negli IDE JetBrains e in Obsidian. Segue la lingua dell’host:

- Nell’app web, in Google Drive e nella propria pagina: le lingue preferite del browser. Una loro modifica viene seguita subito.
- In VS Code: la lingua di visualizzazione di VS Code.
- In un IDE JetBrains: la lingua in cui l’IDE mostra la propria interfaccia.
- In Obsidian: la lingua di Obsidian.

L’opzione `System` adotta la prima di queste lingue disponibile nell’editor, oppure l’inglese se non ne è disponibile nessuna.  
Una variante regionale vale come la sua lingua, quindi `de-AT` dà Deutsch e `fr-CA` dà Français. Per il cinese conta la scrittura: una scrittura tradizionale dà 繁體中文 e qualsiasi altra scrittura 简体中文. Se la scrittura non è indicata, Taiwan, Hong Kong o Macao danno 繁體中文, e le altre varianti del cinese danno 简体中文. Il portoghese dà Português Brasileiro a meno che non sia indicata una regione diversa dal Brasile, quindi `pt-PT` dà Português; anche il portoghese di Obsidian dà Português.

### Lingue da destra a sinistra {#right-to-left-languages}

עברית (ebraico), العربية (arabo) e فارسی (persiano) dispongono l’editor da destra a sinistra: la barra degli strumenti, i menu, i pannelli e le finestre di dialogo, la Ricerca rapida e la scheda Impostazioni sono invertiti a specchio. I sottomenu di un menu contestuale si aprono verso sinistra, e le icone Annulla e Ripeti della barra degli strumenti si scambiano, in modo che Annulla punti all’indietro rispetto al verso di chi legge da destra a sinistra.

Il diagramma stesso non viene mai invertito a specchio. L’area di disegno, con le sue tabelle, colonne, relazioni e memo, resta da sinistra a destra, e lo stesso vale per la minimappa, le barre di scorrimento, la [barra degli strumenti dell’area di disegno](./table-related-functions.md#canvas-toolbar), la [Visualizzazione](./visualization.md) e la sua barra degli strumenti, le celle del tipo di dati, il codice nelle schede Schema SQL e Generatore di codice, il selettore colori, i due lati del Visualizzatore differenze, il Viaggio nel tempo e l’anteprima del Layout automatico.  
Il pannello [Esplora](./explorer.md#beside-the-canvas) resta a sinistra dell’area di disegno, e l’albero delle modifiche del Visualizzatore differenze a sinistra del visualizzatore, ciascuno con il bordo di trascinamento sul proprio lato destro. All’interno, entrambi si leggono da destra a sinistra: i loro campi e le loro righe sono invertiti a specchio, le righe rientrano da destra, e in entrambi gli alberi `←` espande una riga o passa al suo primo elemento figlio, mentre `→` la comprime o risale al suo elemento padre — vedere [Tasti nel pannello Esplora](./explorer.md#keys-in-the-explorer).  
I nomi, i commenti e gli altri testi digitati mantengono la propria direzione, quindi un nome in ebraico, arabo o persiano si legge da destra a sinistra anche nell’area di disegno.

## Tema {#theme}

Il pulsante `Theme` (un’icona del contrasto) apre il generatore di temi, un pannello intitolato `Theme` sotto la barra degli strumenti, sopra la scheda aperta, qualunque essa sia. Ha tre parti:

- `Accent color`: 26 campioni di colore. Il tooltip di ciascuno ne indica il nome, come `indigo`.
- `Gray color`: 6 campioni, `gray`, `mauve`, `slate`, `sage`, `olive` e `sand`.
- `Appearance`: `System`, `Light` e `Dark`.

![Apertura del generatore di temi dalla barra degli strumenti, scelta di un colore principale e di una tonalità di grigio, e passaggio dell’aspetto a Light e poi a System](/img/demo-theme-builder.webp)

L’opzione attiva di ogni parte è contrassegnata, e una scelta si applica subito mentre il generatore resta aperto.  
Scegliere un colore lascia invariato l’aspetto, quindi un colore scelto con `System` mantiene `System`.

L’opzione `System` usa l’aspetto chiaro o scuro dell’host, e cambia quando lo cambia l’host:

- Nell’app web, in Google Drive e nella propria pagina: la modalità chiara o scura indicata dal browser, che segue il sistema operativo.
- In VS Code: chiaro con un tema colori chiaro, e scuro con uno scuro o con uno dei due temi a contrasto elevato.
- In un IDE JetBrains: il tema chiaro o scuro dell’IDE.
- In Obsidian: il tema chiaro o scuro di Obsidian.

Per chiudere il generatore, usare `Escape`, il pulsante `x` accanto al titolo, il cui tooltip riporta `Close (ESC)`, una pressione in qualsiasi punto dell’editor fuori dal pannello tranne che sulla barra degli strumenti, oppure di nuovo il pulsante `Theme`.  
Aprirlo chiude il pannello Proprietà tabella e il selettore `Display Language`. Un pannello [Esplora](./explorer.md#dialogs-beside-it) aperto resta aperto, e in una lingua da sinistra a destra il generatore si colloca subito oltre il pannello anziché coprirlo.  
Aprire la Ricerca rapida o il selettore `Display Language` lo chiude, e così fa anche `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac). Quel tasto apre il pannello [Esplora](./explorer.md#opening-and-closing) sulla sua ricerca oppure, se il pannello Esplora è già aperto, lo mantiene aperto e porta il focus nel suo campo Trova. Il pulsante `Explorer` della barra degli strumenti lascia aperto il generatore.  
Il generatore non trattiene alcun tasto, quindi i tasti di scelta rapida dell’editor funzionano mentre è aperto.

Nella [Ricerca rapida](./quick-search.md), la voce `Theme` elenca `System`, `Light` e `Dark`, con un segno di spunta sull’aspetto attivo. Sceglierne uno cambia solo l’aspetto e lascia invariati la tonalità di grigio e il colore principale.

## In ogni host {#in-each-host}

Ciò che si sceglie nell’editor, dalla barra degli strumenti o dalla Ricerca rapida, viene salvato dove lo conserva l’host, e ogni diagramma aperto segue subito una sua modifica, ovunque venga fatta.  
In VS Code, in un IDE JetBrains e in Obsidian, l’opzione `Auto` dell’host (il valore `auto` in VS Code) corrisponde all’opzione `System` dell’editor. Scegliere `System` memorizza `Auto`, e scegliere `Light` o `Dark` memorizza quell’aspetto, anche quando `Auto` lo stava già mostrando.  
Le impostazioni e gli avvisi propri dell’estensione e dei plugin sono in inglese, qualunque sia la lingua di visualizzazione.

### App web e Google Drive {#web-app-and-google-drive}

Su erd-editor.io, comprese le sue sessioni di collaborazione, e in Google Drive, una sola lingua e un solo tema valgono per l’app e per ogni diagramma al suo interno.  
Entrambi sono conservati in questo browser, non nello schema né nel file di Drive, e tutte le schede di erd-editor.io li condividono: una scelta in una scheda cambia subito le altre.

La lingua è `System`, che segue le lingue preferite del browser, finché non se ne sceglie una.  
Il testo dell’app stessa, come la barra laterale, il cestino, la collaborazione e le schermate di Google Drive, segue la stessa lingua, e in ebraico, arabo e persiano l’intera app è disposta da destra a sinistra. L’Informativa sulla privacy, i Termini di servizio e le pagine di supporto restano in inglese.  
Oltre al pannello dell’editor e alla Ricerca rapida, la riga inferiore della barra laterale ha un pulsante della lingua, il cui tooltip riporta `Display Language`, accanto ai collegamenti `Privacy` e `Terms`. Il suo menu elenca `System`, con la lingua che rappresenta, e poi le 25 lingue.

Il tema parte da `System`, con la tonalità di grigio `olive` e il colore principale `jade`.  
Oltre al generatore di temi e alla Ricerca rapida, la parte inferiore della barra laterale ha tre pulsanti a icona, `System`, `Light` e `Dark`: accanto a `Trash` su erd-editor.io e accanto a `Sign out` in Google Drive. Impostano lo stesso aspetto del generatore.

### VS Code {#vs-code}

Le impostazioni dell’estensione si trovano sotto ERD Editor nelle Impostazioni di VS Code:

| Impostazione | Valori | Predefinito |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto` o un codice della [tabella delle lingue](#display-language) | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`, `light`, `dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | le sei tonalità di grigio | `slate` |
| `dineug.erd-editor.theme.accentColor` | i 26 colori principali | `indigo` |

Nell’editor delle impostazioni, l’impostazione della lingua elenca `Auto` e poi ogni lingua con il proprio nome. Un valore in `settings.json` che non indica nessuna lingua viene interpretato come `auto`.  
Una scelta del tema nell’editor scrive tutte e tre le impostazioni del tema. Una scelta viene scritta dove la sua impostazione è già definita: la cartella dell’area di lavoro, altrimenti l’area di lavoro, altrimenti le impostazioni utente.

### IDE JetBrains {#jetbrains-ides}

Settings | Tools | ERD Editor contiene `Appearance:` (`Auto`, `Light`, `Dark`), `Gray color:`, `Accent color:` e `Display language:` (`Auto`, poi ogni lingua con il proprio nome), conservati per l’intero IDE.  
I valori iniziali sono `Auto`, `Slate`, `Indigo` e `Auto`.

### Obsidian {#obsidian}

Settings → ERD Editor contiene `Appearance` (`Auto`, `Light`, `Dark`), `Gray color`, `Accent color` e `Display language` (`Auto`, poi ogni lingua con il proprio nome), conservati per ogni vault.  
I valori iniziali sono `Auto`, `Slate`, `Indigo` e `Auto`.  
Una modifica si applica a ogni scheda ERD del vault, comprese quelle nelle finestre separate.

### La propria pagina {#your-own-page}

Un `<erd-editor>` nella propria pagina non mostra né il pulsante `Theme` né il pulsante `Display Language`, e la Ricerca rapida non elenca nessuno dei due, finché la pagina non li attiva con [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) e [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker).  
Finché la pagina non imposta una lingua o il lettore non ne sceglie una, l’editor mostra l’inglese, oppure segue `System` mentre `enableLocalePicker` è attivo.  
Il tema parte da `Dark`, con la tonalità di grigio `slate` e il colore principale `indigo`, a meno che la pagina non ne imposti un altro o non attivi [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode).  
La scelta di un lettore si applica subito, ma l’elemento non salva nessuna delle due scelte: è la pagina a impostare quelle iniziali e a salvare da sé le scelte del lettore — vedere [Tema](../../api/erd-editor-element.md#theme) e [Lingua di visualizzazione](../../api/erd-editor-element.md#display-language) nell’API.
