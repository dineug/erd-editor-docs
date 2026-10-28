---
sidebar_position: 1
description: Partire dalla schermata di benvenuto e creare tabelle, memo, gruppi di tabelle e relazioni dal menu contestuale dell’area di disegno, dalla barra degli strumenti dell’area di disegno o con un tasto di scelta rapida.
---

# Iniziare a modificare

La modifica inizia dal menu contestuale, con un clic con il pulsante destro.

![Clic con il pulsante destro sull’area di disegno, apertura del sottomenu Relationship, aggiunta di una tabella e poi apertura del suo menu](/img/demo-context-menu.webp)

Un clic con il pulsante destro su una tabella, un memo, un gruppo di tabelle o una relazione apre invece il menu specifico di quell’elemento.  
Un clic con il pulsante destro su una tabella, un memo o un gruppo di tabelle già selezionato mantiene l’intera selezione, quindi voci come `Color` e `Delete selected` agiscono su tutta la selezione — vedere [Selezione multipla](./table-related-functions.md#multiple-selection).  
Un editor di sola lettura non crea nulla, quindi nulla di ciò che descrive questa pagina vi viene offerto: il menu dell’area di disegno mantiene solo `View Option`, `Name View`, `Export` e `Diff Viewer`, il menu di una tabella solo `Table Properties`, e un memo, un gruppo di tabelle o una relazione non apre alcun menu — vedere [Editor di sola lettura](./table-related-functions.md#read-only-editors).

## Schermata di benvenuto {#welcome-screen}

Nell’app web, in Google Drive, in VS Code, in Obsidian e in un IDE JetBrains, un diagramma vuoto si apre su una schermata di benvenuto sopra l’area di disegno ERD. Un `<erd-editor>` nella propria pagina la mostra solo quando la pagina la attiva con [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen).  
Un diagramma è considerato vuoto finché non contiene alcuna tabella, alcun memo visibile né alcun gruppo di tabelle visibile, quindi i memo e i gruppi nascosti con le Opzioni di visualizzazione non contano. La schermata scompare non appena il diagramma contiene uno di questi elementi e ricompare ogni volta che il diagramma torna vuoto, ad esempio dopo aver eliminato l’ultima tabella o annullato l’aggiunta della prima.  
Non viene mostrata in un editor di sola lettura, in modalità Zen, mentre è aperto il pannello Proprietà tabella o mentre il Visualizzatore differenze, l’anteprima del Layout automatico o il Viaggio nel tempo occupa l’area di disegno.

![La schermata di benvenuto su un diagramma vuoto: apertura dei formati di Import, ritorno con Esc, aggiunta di una tabella con New Table e poi ricomparsa della schermata con ⌘ + Z](/img/demo-welcome-screen.webp)

Sotto il titolo `Right-click the canvas for every action.` si trova un menu:

- `New Table` aggiunge una tabella, come fa `Alt + N`.
- `New Memo` aggiunge un memo, come fa `Alt + M`. Non compare mentre i memo sono nascosti.
- `Import` sostituisce il menu con `Back` e i formati `json`, `Schema SQL`, `GraphQL`, `DBML` e `AML`. Scegliendo un formato viene richiesto un file in quel formato, che viene caricato al posto del diagramma vuoto — vedere [Importare o esportare file](./file-import-export.md). `Back`, o `Escape`, riporta al primo menu.
- `Command Palette` apre la [Ricerca rapida](./quick-search.md), come fa `Ctrl + K` (Windows/Linux) o `⌘ + K` (Mac).
- `Shortcuts` apre Impostazioni sulla scheda [`Shortcuts`](./settings.md#shortcuts).

Quando l’area di disegno è abbastanza larga, `New Table`, `New Memo` e `Command Palette` mostrano il tasto attualmente associato al rispettivo comando, compreso un tasto riassegnato da un host.  
Quando una voce ha il focus della tastiera, `↑` e `↓` si spostano tra le voci in modo circolare, `Home` e `End` saltano alla prima e all’ultima, e `Enter` o `Space` attiva la voce con il focus. Tutti gli altri tasti di scelta rapida continuano a funzionare, quindi anche da lì `Alt + N` aggiunge una tabella.  
Solo il menu riceve i clic: una pressione in qualsiasi altro punto della schermata arriva all’area di disegno, e un clic con il pulsante destro sull’area di disegno apre il menu contestuale come di consueto.

Quando l’area di disegno ha spazio sufficiente, alcune frecce disegnate a mano indicano:

- il pulsante `Search` della barra degli strumenti: `Search commands and tables`
- i pulsanti `Theme` e `Display Language`: `Pick a theme and a language`, oppure `Pick a theme` o `Pick a language` quando la barra degli strumenti ne mostra solo uno — vedere [Lingua e tema](./language-and-theme.md)
- la [barra degli strumenti dell’area di disegno](./table-related-functions.md#canvas-toolbar) in basso: `Pan, zoom and draw relationships`

Mentre il pannello [Esplora](./explorer.md) è visibile, la schermata di benvenuto copre solo l’area di disegno accanto a esso.  
Una freccia il cui pulsante della barra degli strumenti si trova sopra il pannello Esplora non viene mostrata. La freccia di `Theme` e `Display Language` non viene mostrata solo quando entrambi i suoi pulsanti si trovano sopra il pannello Esplora; fino ad allora indica quello ancora sopra l’area di disegno.  
Un’etichetta senza spazio accanto alla sua freccia compare invece sotto la freccia.

## Creazione di tabelle {#table-creation}

Creare una tabella dal menu contestuale, con il pulsante `New Table` della [barra degli strumenti dell’area di disegno](./table-related-functions.md#canvas-toolbar) o con il tasto di scelta rapida `Alt + N`.

## Creazione di memo {#memo-creation}

Creare un memo dal menu contestuale, con il pulsante `New Memo` della barra degli strumenti dell’area di disegno o con il tasto di scelta rapida `Alt + M`.  
Mentre View Option → `Memos` è disattivato, i memo sono nascosti, `New Memo` non viene proposto da nessuna parte e `Alt + M` non ne aggiunge alcuno — vedere [Opzioni di visualizzazione delle tabelle](./table-related-functions.md#table-view-options).

Un memo è una nota a testo libero sull’area di disegno. Fare clic nel suo corpo e digitare; il testo viene salvato con il documento.  
`Escape` chiude l’editor del memo, mantenendo il testo digitato e lasciando il memo selezionato, e un secondo `Escape` annulla la selezione.  
Trascinarne il bordo per ridimensionarlo. La `x` nella sua intestazione, visibile mentre il puntatore si trova sul memo, lo elimina.  
Un clic con il pulsante destro su un memo apre il suo menu anziché l’editor: `Color`, `Remove color` mentre un elemento selezionato ha un colore, e `Delete`, che diventa `Delete selected` mentre il memo è uno di due o più elementi selezionati. Un memo selezionato viene eliminato anche con i tasti che eliminano le tabelle — vedere [Eliminazione di tabelle e memo](./table-related-functions.md#table-and-memo-deletion).

![Aggiunta di un memo con Alt + M, digitazione di una nota e trascinamento del bordo per ridimensionarlo](/img/demo-memo.webp)

## Creazione di gruppi di tabelle {#table-group-creation}

Un gruppo di tabelle è un riquadro che contiene tabelle, a cui è possibile assegnare un nome e un colore. Crearne uno in uno dei due modi seguenti:

- Scegliere `New Table Group` dal menu contestuale o dalla Ricerca rapida, fare clic sul pulsante `New Table Group` della [barra degli strumenti dell’area di disegno](./table-related-functions.md#canvas-toolbar) oppure premere `Alt + G` (Windows/Linux) o `⌥ + G` (Mac), quindi trascinare un riquadro sull’area di disegno. Ogni tabella il cui centro si trova all’interno del riquadro entra nel nuovo gruppo, a meno che non faccia già parte di un altro gruppo — vedere [Disegnare un gruppo](./table-groups.md#drawing-a-group).
- Selezionare le tabelle e scegliere `Group selected tables` dal menu contestuale di una tabella o `Group Selected Tables` dalla Ricerca rapida, oppure premere `T` e poi `G` — vedere [Raggruppare le tabelle selezionate](./table-groups.md#grouping-selected-tables).

L’assegnazione del nome e del colore, lo spostamento, il ridimensionamento e tutto il resto sono descritti in [Gruppi di tabelle](./table-groups.md).

## Creazione di relazioni {#relationship-creation}

Avviare una relazione dal menu contestuale, dalla [barra degli strumenti dell’area di disegno](./table-related-functions.md#canvas-toolbar) in fondo all’area di disegno o con un tasto di scelta rapida. Ogni tipo di relazione ha il proprio:

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) o `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) o `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) o `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) o `⌘ + ⌥ + 4` (Mac)

Una volta attivato un tipo, il cursore cambia. Fare clic prima sulla tabella padre, poi sulla tabella figlia.  
La tabella padre riceve una chiave primaria se non ne ha una, e per ogni colonna della chiave primaria della tabella padre la tabella figlia riceve una colonna chiave esterna `Not Null` con lo stesso tipo di dati, valore predefinito, commento, [nome logico](./logical-names.md) e [dominio](./dictionary.md#domains-and-data-types).  
Una chiave serial è l’eccezione: la sua chiave esterna assume il tipo intero memorizzato dal serial, come `integer` per `serial4`, e in tal caso non collega alcun dominio — vedere [Relazioni identificanti](./relationship-editing.md#identifying-relationships).  
Ogni colonna chiave esterna prende il nome dalla sua chiave: un nome di una sola parola come `id` riceve davanti il nome della tabella padre (`user_id`), un nome di più parole come `member_id` viene mantenuto, e un nome già presente nella tabella figlia viene numerato (`user_id_2`) — vedere [Nomi delle colonne chiave esterna](./relationship-editing.md#foreign-key-column-names).  
Facendo clic due volte sulla stessa tabella si disegna una relazione autoreferenziale.  
Una nuova relazione parte con `On Delete` e `On Update` entrambi su `Not set`; modificarli dal suo menu contestuale — vedere [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Per interrompere, premere `Escape` oppure premere di nuovo lo stesso tasto di scelta rapida. L’interruzione lascia la selezione com’è, e il successivo `Escape` la annulla.

Una volta scelta la tabella padre, passando il puntatore su una tabella su cui la relazione può terminare, quella tabella viene evidenziata con un contorno e accanto a essa compaiono due pulsanti:

- `Create new columns` (`+`) disegna la relazione con nuove colonne chiave esterna, come fa un clic sulla tabella.
- `Map to existing columns` (un’icona di collegamento) termina il disegno e apre [Associa colonne](./relationship-editing.md#map-columns) per le due tabelle, così la relazione può usare colonne già presenti nella tabella figlia. Non viene scritto nulla finché non si preme `Map`.

Anche la tabella padre mostra i pulsanti una volta che il puntatore si è spostato di un breve tratto dal punto in cui si è fatto clic su di essa, quindi anche una relazione autoreferenziale può essere associata a colonne esistenti.  
Un dito non consente il passaggio del puntatore, quindi disegnando con un dito i pulsanti non compaiono mai e un tocco sulla tabella figlia disegna subito la relazione; una penna li mostra come fa un mouse.  
Se la tabella padre ha perso la sua chiave primaria prima che si raggiunga la tabella figlia, ad esempio a causa di un annullamento o della modifica di un collaboratore, `Create new columns` appare attenuato con il tooltip `<parent> has no primary key to copy`, e un clic sulla tabella figlia termina il disegno senza disegnare nulla.  
Il tooltip riporta il nome della tabella padre come lo mostra la [Visualizzazione nomi](./logical-names.md#beyond-the-canvas).

![Disegno di una relazione One N con ⌘ + ⌥ + 4, poi di una Zero N dalla barra degli strumenti dell’area di disegno, con la tabella figlia contornata e i suoi pulsanti Map to existing columns e Create new columns](/img/demo-relationship.webp)

## Duplicare tabelle e memo {#duplicating-tables-and-memos}

Le tabelle e i memo esistenti possono essere copiati, incollati e duplicati trascinandoli con `Alt` premuto — vedere [Funzioni relative alle tabelle](./table-related-functions.md#copyingpasting-tables-and-memos).
