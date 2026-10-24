---
sidebar_position: 2
description: Registrare il server @dineug/erd-editor-mcp in Claude Code, Codex o qualsiasi altro client MCP e configurare VS Code, Obsidian o un IDE JetBrains per la modifica live.
---

# Installazione

Il server è pubblicato su npm come `@dineug/erd-editor-mcp`.
È un unico file autonomo senza dipendenze di runtime, e `npx` lo scarica la prima volta che l’agente lo avvia, quindi non c’è nient’altro da installare.
Richiede Node.js versione `22.12` o successiva.

Per consentire all’agente di modificare un diagramma in modalità live, configurare anche l’editor che lo contiene: [VS Code](#set-up-vs-code), [Obsidian](#set-up-obsidian) o [un IDE JetBrains](#set-up-a-jetbrains-ide).
Se nessun editor gestisce il documento, l’agente modifica il file su disco — vedere [Live e headless](./live-and-headless.md).

## Claude Code {#claude-code}

Eseguire nella cartella del progetto:

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

Aggiungere `--scope project` prima di `--transport` per scrivere invece il server nel file `.mcp.json` del progetto, dove lo trova chiunque cloni il progetto.

## Codex {#codex}

Eseguire una sola volta. La CLI, l’app e l’estensione per IDE di Codex condividono l’impostazione:

```sh
codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp
```

Oppure aggiungere il server a `~/.codex/config.toml`, o a `.codex/config.toml` in un progetto attendibile:

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## Qualsiasi altro client MCP {#any-other-mcp-client}

Eseguire `npx -y @dineug/erd-editor-mcp` come server stdio: il comando è `npx` e gli argomenti sono `-y` e `@dineug/erd-editor-mcp`.

Il server risolve un percorso relativo del documento rispetto alla propria directory di lavoro, quindi avviarlo nella cartella del progetto.
Supporta le versioni del protocollo MCP `2025-06-18`, `2025-03-26` e `2024-11-05`, e a un client con una versione successiva risponde con `2025-06-18`.

## Configurare VS Code {#set-up-vs-code}

Una finestra di VS Code gestisce i diagrammi delle cartelle della sua area di lavoro e qualsiasi diagramma aperto al suo interno.

1. Installare l’[estensione ERD Editor](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), versione `4.0.0` o successiva. Richiede VS Code versione `1.101.0` o successiva.
2. Aprire la cartella del progetto e considerare attendibile l’area di lavoro. L’estensione serve gli agenti solo in un’area di lavoro attendibile.
3. Lasciare attiva l’impostazione `dineug.erd-editor.agentHub.enabled`. È attiva per impostazione predefinita.

Un’estensione dalla `3.0.0` alla `3.1.0` e il server `1.0.0` o successivo si rifiutano a vicenda, e un’estensione precedente alla versione `3.0.0` non serve gli agenti.
Un’estensione `4.0.0` o `4.1.0` si connette, ma non mostra né conserva i nomi logici, i collegamenti ai domini e le righe dei dizionari che l’agente scrive — vedere [Aggiornamento](#updating).

L’estensione si avvia in un’area di lavoro che contiene file `.erd`, `.erd.json`, `.vuerd` o `.vuerd.json`, quindi un agente raggiunge quei diagrammi prima ancora che se ne apra uno.
In un’area di lavoro che non ne contiene nessuno si avvia all’apertura di un diagramma, e fino ad allora l’agente modifica su disco.

| Impostazione | Valore predefinito | Effetto |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | Consente al server MCP di un agente di modificare i documenti di questa finestra tramite un socket locale, o una named pipe su Windows. Se è disattivata, o in un’area di lavoro non attendibile, gli agenti possono comunque leggere da disco i diagrammi della finestra, ma non ne scrivono mai uno alle spalle del suo editor. |

## Configurare Obsidian {#set-up-obsidian}

Una finestra di un vault di Obsidian gestisce i diagrammi del suo vault.

1. Installare il [plugin ERD Editor](https://community.obsidian.md/plugins/erd-editor), versione `1.0.0` o successiva, da Community plugins e attivarlo. Funziona solo nell’app desktop e richiede Obsidian versione `1.5.7` o successiva.
2. Lasciare attivo Settings → ERD Editor → Coding agents. È attivo per impostazione predefinita, e ogni vault mantiene la propria impostazione.

Un plugin precedente alla versione `1.0.0` e il server `1.0.0` o successivo si rifiutano a vicenda.
Un plugin `1.0.0` o `1.1.0` si connette, ma non mostra né conserva i nomi logici, i collegamenti ai domini e le righe dei dizionari che l’agente scrive — vedere [Aggiornamento](#updating).

Una finestra del vault serve gli agenti dal momento in cui il plugin viene caricato, quindi un agente raggiunge i diagrammi del vault prima ancora che se ne apra uno.
Non c’è alcun passaggio di attendibilità.
Un file che il vault non elenca, come uno in una cartella il cui nome inizia con un punto, non può essere aperto nell’ERD Editor, quindi una sua modifica viene rifiutata.

Chiedere all’agente di dare ai nuovi diagrammi un nome con `.erd`.
A un nome senza estensione viene aggiunto `.erd.json`, e l’esplora file di Obsidian elenca un file `.erd.json` solo mentre Settings → Files and links → Detect all file extensions è attivo.

| Impostazione | Valore predefinito | Effetto |
| --- | --- | --- |
| Coding agents | Attivo | Consente al server MCP di un agente di modificare i diagrammi di questo vault tramite un socket locale, o una named pipe su Windows. Se è disattivato, gli agenti possono comunque leggere da disco i diagrammi del vault, ma non ne scrivono mai uno alle spalle del suo editor. |

Obsidian installato da Flathub viene eseguito in una sandbox Flatpak, che il server non può raggiungere.
In questo caso il plugin non serve gli agenti e non mantiene alcun file di lock, quindi l’agente modifica i file su disco, anche un diagramma aperto dall’utente.
Obsidian ricarica il diagramma, come fa dopo qualsiasi modifica apportata al di fuori di esso, e una modifica dell’utente che Obsidian non ha ancora salvato cede il passo a quella dell’agente.
Il plugin lo segnala ogni volta che si apre il vault, finché non si disattiva Coding agents.

## Configurare un IDE JetBrains {#set-up-a-jetbrains-ide}

Un IDE JetBrains gestisce i diagrammi di ogni progetto aperto al suo interno e qualsiasi diagramma aperto nel suo ERD Editor.

1. Installare il [plugin ERD Editor](https://plugins.jetbrains.com/plugin/23594-erd-editor), versione `1.0.0` o successiva. Richiede un IDE basato su IntelliJ versione `2025.2` o successiva, in esecuzione sul JetBrains Runtime.
2. Aprire il progetto e considerarlo attendibile. In un progetto che l’IDE non considera attendibile, come uno aperto in modalità sicura, gli agenti leggono i diagrammi ma non li modificano mai.
3. Lasciare selezionato Settings | Tools | ERD Editor → Coding agents. È attivo per impostazione predefinita e si applica all’intero IDE.

Un plugin `0.9.0` o `0.10.0` e il server `1.0.0` o successivo si rifiutano a vicenda, e un plugin precedente alla versione `0.9.0` non serve gli agenti.
Un plugin `1.0.0` o `1.1.0` si connette, ma non mostra né conserva i nomi logici, i collegamenti ai domini e le righe dei dizionari che l’agente scrive — vedere [Aggiornamento](#updating).

L’IDE serve gli agenti dal momento in cui si apre il primo progetto, quindi un agente raggiunge i diagrammi di un progetto prima ancora che se ne apra uno.

| Impostazione | Valore predefinito | Effetto |
| --- | --- | --- |
| Coding agents | Attivo | Consente al server MCP di un agente di modificare i diagrammi di questo IDE tramite un socket locale, o una named pipe su Windows. Se è disattivato, gli agenti possono comunque leggere da disco i diagrammi dei progetti aperti, ma non ne modificano mai uno alle spalle del suo editor. |

La pagina delle impostazioni indica quando gli agenti di programmazione non sono disponibili: in un IDE senza JCEF (dove nemmeno l’ERD Editor può funzionare), in un IDE installato come Flatpak su Linux e quando il suo hub non è riuscito ad avviarsi.
In questi casi l’IDE non mantiene alcun file di lock, e l’agente modifica i file su disco.
L’ERD Editor non ricarica un diagramma modificato su disco mentre è aperto, e la successiva modifica dell’utente al suo interno riscrive l’intero diagramma sopra le modifiche dell’agente, quindi chiudere prima il diagramma.

## Provare {#try-it}

1. Aprire la cartella che contiene i diagrammi: in VS Code, come area di lavoro attendibile; in Obsidian, come vault; in un IDE JetBrains, come progetto attendibile.
2. Avviare l’agente nella stessa cartella e fare una richiesta a parole semplici, ad esempio _«Aggiungi una tabella reviews a schema.erd.json, collegata a users e products»_.
3. Osservare la modifica comparire nell’area di disegno. In VS Code, salvare con `Ctrl + S` (Windows/Linux) o `⌘ + S` (Mac), oppure chiedere all’agente di salvare. Obsidian e un IDE JetBrains salvano la modifica come salvano quelle dell’utente, e se si chiede all’agente di salvare, la modifica viene scritta subito.

Un diagramma non ancora aperto si apre nell’ERD Editor alla prima modifica dell’agente, senza sottrarre il focus della tastiera.
L’agente crea un nuovo documento con `erd_open_document`, e a un nome senza estensione viene aggiunto `.erd.json`.

## Aggiornamento {#updating}

I comandi riportati sopra non indicano alcuna versione, quindi `npx` controlla su npm se esiste una versione più recente del server ogni volta che l’agente lo avvia.
Un server già in esecuzione mantiene la propria versione finché l’agente non lo riavvia.

Prima di connettersi, il server controlla la versione del protocollo usata dall’editor.
Quando le due differiscono, ogni chiamata che raggiunge quell’editor viene rifiutata con `protocolMismatch`, comprese le letture e `erd_list_documents`, e non viene scritto nulla.
Il messaggio indica la parte da aggiornare: il server, oppure l’ERD Editor nell’editor, che è l’estensione in VS Code e il plugin in Obsidian e in un IDE JetBrains.

Il server `1.0.0` o successivo, l’estensione per VS Code `4.0.0` o successiva, il plugin per Obsidian `1.0.0` o successivo e il plugin per JetBrains `1.0.0` o successivo usano il protocollo 2.
Ogni server precedente usa il protocollo 1, così come ogni versione precedente dell’editor che serve gli agenti: l’estensione per VS Code dalla `3.0.0` alla `3.1.0`, il plugin per Obsidian `0.1.0` e `0.2.0` e il plugin per JetBrains `0.9.0` e `0.10.0`.
Un editor del genere e il server `1.0.0` o successivo si rifiutano a vicenda, e lo stesso vale per un server precedente e un editor che usa il protocollo 2.
Un’estensione per VS Code precedente alla versione `3.0.0` o un plugin per JetBrains precedente alla versione `0.9.0` non serve affatto gli agenti, quindi l’agente modifica i file su disco, anche un diagramma aperto al suo interno.

| Combinazione | Il messaggio termina con |
| --- | --- |
| Il server `1.0.0` o successivo con un’estensione o un plugin che usa il protocollo 1 | `Update the ERD Editor extension or plugin in the editor until its hub speaks protocol 2.` |
| Un server precedente con un’estensione o un plugin che usa il protocollo 2 | `Update the MCP server (npx -y @dineug/erd-editor-mcp@latest) until it speaks protocol 2.` |

Aggiornare insieme il server e l’estensione o il plugin.
Un server e un editor che usano lo stesso protocollo si connettono, qualunque dei due sia meno recente, ma solo il server `1.1.0` o successivo dispone di strumenti per i nomi logici, i domini e i dizionari — vedere [Dizionari](./tools.md#dictionaries).
Solo l’estensione per VS Code `4.2.0` o successiva e i plugin per Obsidian e JetBrains `1.2.0` o successivi mostrano e conservano i nomi logici, i collegamenti ai domini e le righe dei dizionari che quegli strumenti scrivono.
Un’estensione o un plugin precedente che si connette li ignora, anche se la chiamata dell’agente va a buon fine.
Applica comunque i nomi fisici che i dizionari derivano e i tipi di dati che danno i domini.
Un server precedente alla versione `1.1.0` legge un file senza i suoi nomi logici, collegamenti ai domini e righe dei dizionari, e li omette quando modifica il file su disco — vedere [Headless](./live-and-headless.md#headless).

Aggiornare anche ERD Editor ovunque vengano aperti i diagrammi.
L’estensione per VS Code precedente alla versione `4.2.0`, il plugin per Obsidian precedente alla versione `1.2.0` e il plugin per JetBrains precedente alla versione `1.2.0` aprono un diagramma salvato da una versione successiva, o modificato su disco dall’agente, senza i nomi logici delle sue tabelle e colonne, i collegamenti ai domini delle sue colonne e le sue parole, i suoi termini e i suoi domini.
Quando salvano il file, li omettono.
L’estensione per VS Code precedente alla versione `4.0.0`, il plugin per Obsidian precedente alla versione `1.0.0` e il plugin per JetBrains precedente alla versione `1.0.0` mostrano anche un diagramma del genere senza le icone della chiave primaria, e ne scartano i gruppi di tabelle e gli script Schema SQL quando salvano il file.
L’estensione per VS Code precedente alla versione `3.1.0`, il plugin per Obsidian precedente alla versione `0.2.0` e il plugin per JetBrains precedente alla versione `0.10.0` scartano anche le azioni ON DELETE e ON UPDATE di un diagramma quando salvano il file.
In Obsidian, riavviare l’app dopo aver aggiornato il plugin: fino ad allora, una finestra del vault continua a eseguire l’ERD Editor della versione del plugin caricata per prima.
