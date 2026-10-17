---
sidebar_position: 2
description: Registreer de server @dineug/erd-editor-mcp bij Claude Code, Codex of een andere MCP-client, en stel VS Code, Obsidian of een JetBrains-IDE in voor live bewerken.
---

# Installeren

De server is op npm gepubliceerd als `@dineug/erd-editor-mcp`.
Het is één zelfstandig bestand zonder runtime-afhankelijkheden, en `npx` downloadt het de eerste keer dat de agent het start, dus hoeft er verder niets te worden geïnstalleerd.
De server heeft Node.js `22.12` of later nodig.

Wil je de agent een diagram live laten bewerken, stel dan ook de editor in die het beheert: [VS Code](#set-up-vs-code), [Obsidian](#set-up-obsidian) of [een JetBrains-IDE](#set-up-a-jetbrains-ide).
Als geen editor het document bedient, bewerkt de agent het bestand op schijf — zie [Live en headless](./live-and-headless.md).

## Claude Code {#claude-code}

Voer dit uit in je projectmap:

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

Voeg `--scope project` vóór `--transport` toe om de server in plaats daarvan in de `.mcp.json` van het project te schrijven, waar iedereen die het project kloont hem meekrijgt.

## Codex {#codex}

Voer dit één keer uit. De CLI, de app en de IDE-extensie van Codex delen de instelling:

```sh
codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp
```

Of voeg de server toe aan `~/.codex/config.toml`, of aan `.codex/config.toml` in een vertrouwd project:

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## Elke andere MCP-client {#any-other-mcp-client}

Voer `npx -y @dineug/erd-editor-mcp` uit als stdio-server: de opdracht is `npx` en de argumenten zijn `-y` en `@dineug/erd-editor-mcp`.

De server lost een relatief documentpad op ten opzichte van zijn werkmap, dus start hem in je projectmap.
Hij ondersteunt de MCP-protocolversies `2025-06-18`, `2025-03-26` en `2024-11-05`, en geeft een client met een latere versie `2025-06-18` als antwoord.

## VS Code instellen {#set-up-vs-code}

Een VS Code-venster bedient de diagrammen in zijn werkruimtemappen en elk diagram dat erin geopend is.

1. Installeer de [ERD Editor-extensie](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) `4.0.0` of later. Die heeft VS Code `1.101.0` of later nodig.
2. Open de projectmap en vertrouw de werkruimte. De extensie bedient agents alleen in een vertrouwde werkruimte.
3. Laat de instelling `dineug.erd-editor.agentHub.enabled` aanstaan. Die staat standaard aan.

Een extensie van `3.0.0` tot en met `3.1.0` en server `1.0.0` weigeren elkaar, en een extensie vóór `3.0.0` bedient geen agents — zie [Bijwerken](#updating).

De extensie start in een werkruimte die `.erd`-, `.erd.json`-, `.vuerd`- of `.vuerd.json`-bestanden bevat, zodat een agent die diagrammen bereikt voordat je er een opent.
In een werkruimte zonder zulke bestanden start de extensie wanneer je een diagram opent, en tot dan bewerkt de agent op schijf.

| Instelling | Standaardwaarde | Effect |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | Laat de MCP-server van een agent de documenten van dit venster bewerken via een lokale socket, of een named pipe op Windows. Staat de instelling uit, of is de werkruimte niet vertrouwd, dan kunnen agents de diagrammen van het venster nog steeds van schijf lezen, maar schrijven ze er nooit een achter de rug van zijn editor om. |

## Obsidian instellen {#set-up-obsidian}

Een venster van een Obsidian-kluis bedient de diagrammen in die kluis.

1. Installeer de [ERD Editor-plug-in](https://community.obsidian.md/plugins/erd-editor) `1.0.0` of later vanuit Community plugins en schakel die in. De plug-in draait alleen in de desktopapp en heeft Obsidian `1.5.7` of later nodig.
2. Laat Settings → ERD Editor → Coding agents aanstaan. Die staat standaard aan, en elke kluis heeft zijn eigen instelling.

Een eerdere plug-in en server `1.0.0` weigeren elkaar — zie [Bijwerken](#updating).

Een kluisvenster bedient agents vanaf het moment dat de plug-in wordt geladen, zodat een agent de diagrammen van de kluis bereikt voordat je er een opent.
Er is geen vertrouwensstap.
Een bestand dat de kluis niet vermeldt, zoals een bestand in een map waarvan de naam met een punt begint, kan niet in de ERD Editor worden geopend, dus wordt een bewerking ervan geweigerd.

Vraag de agent nieuwe diagrammen een naam met `.erd` te geven.
Een naam zonder extensie krijgt `.erd.json`, en de bestandsverkenner van Obsidian toont een `.erd.json`-bestand alleen zolang Settings → Files and links → Detect all file extensions aanstaat.

| Instelling | Standaardwaarde | Effect |
| --- | --- | --- |
| Coding agents | Aan | Laat de MCP-server van een agent de diagrammen van deze kluis bewerken via een lokale socket, of een named pipe op Windows. Staat de instelling uit, dan kunnen agents de diagrammen van de kluis nog steeds van schijf lezen, maar schrijven ze er nooit een achter de rug van zijn editor om. |

Obsidian dat vanaf Flathub is geïnstalleerd, draait in een Flatpak-sandbox, die de server niet kan bereiken.
Daar bedient de plug-in geen agents en houdt hij geen lockbestand bij, dus bewerkt de agent de bestanden op schijf, zelfs een diagram dat je geopend hebt.
Obsidian laadt het diagram opnieuw, zoals het dat doet na elke wijziging die buiten Obsidian is gemaakt, en een bewerking van jou die het nog niet heeft opgeslagen, moet wijken voor die van de agent.
De plug-in meldt dit elke keer dat de kluis wordt geopend, totdat je Coding agents uitschakelt.

## Een JetBrains-IDE instellen {#set-up-a-jetbrains-ide}

Een JetBrains-IDE bedient de diagrammen van elk project dat erin geopend is, en elk diagram dat in zijn ERD Editor geopend is.

1. Installeer de [ERD Editor-plug-in](https://plugins.jetbrains.com/plugin/23594-erd-editor) `1.0.0` of later. Die heeft een op IntelliJ gebaseerde IDE `2025.2` of later nodig die op de JetBrains Runtime draait.
2. Open het project en vertrouw het. In een project dat de IDE niet vertrouwt, zoals een project dat in de veilige modus is geopend, lezen agents de diagrammen, maar wijzigen ze die nooit.
3. Laat Settings | Tools | ERD Editor → Coding agents aangevinkt. Die staat standaard aan en geldt voor de hele IDE.

Een plug-in `0.9.0` of `0.10.0` en server `1.0.0` weigeren elkaar, en een plug-in vóór `0.9.0` bedient geen agents — zie [Bijwerken](#updating).

De IDE bedient agents vanaf het moment dat het eerste project wordt geopend, zodat een agent de diagrammen van een project bereikt voordat je er een opent.

| Instelling | Standaardwaarde | Effect |
| --- | --- | --- |
| Coding agents | Aan | Laat de MCP-server van een agent de diagrammen van deze IDE bewerken via een lokale socket, of een named pipe op Windows. Staat de instelling uit, dan kunnen agents de diagrammen van de geopende projecten nog steeds van schijf lezen, maar wijzigen ze er nooit een achter de rug van zijn editor om. |

De instellingenpagina meldt wanneer codeeragents niet beschikbaar zijn: in een IDE zonder JCEF (waar ook de ERD Editor niet kan draaien), in een IDE die op Linux als Flatpak is geïnstalleerd en wanneer zijn hub niet kon starten.
In die gevallen houdt de IDE geen lockbestand bij en bewerkt de agent de bestanden op schijf.
De ERD Editor laadt een diagram dat op schijf is gewijzigd niet opnieuw zolang het geopend is, en je volgende bewerking erin schrijft het hele diagram terug over de wijzigingen van de agent heen, dus sluit het diagram eerst.

## Uitproberen {#try-it}

1. Open de map met je diagrammen: in VS Code als een werkruimte die je vertrouwt; in Obsidian als een kluis; in een JetBrains-IDE als een project dat je vertrouwt.
2. Start de agent in dezelfde map en vraag het in gewone woorden, bijvoorbeeld _"Voeg aan schema.erd.json een tabel reviews toe met relaties naar users en products"_.
3. Kijk hoe de wijziging op het canvas verschijnt. Sla in VS Code op met `Ctrl + S` (Windows/Linux) of `⌘ + S` (Mac), of vraag de agent om op te slaan. Obsidian en een JetBrains-IDE slaan de wijziging op zoals ze jouw eigen bewerkingen opslaan, en als je de agent vraagt op te slaan, wordt die meteen weggeschreven.

Een diagram dat nog niet geopend is, wordt bij de eerste bewerking van de agent in de ERD Editor geopend, zonder de toetsenbordfocus over te nemen.
De agent maakt een nieuw document aan met `erd_open_document`, en een naam zonder extensie krijgt `.erd.json`.

## Bijwerken {#updating}

De opdrachten hierboven noemen geen versie, dus kijkt `npx` elke keer dat de agent de server start op npm of er een nieuwere versie van de server is.
Een server die al draait, houdt zijn versie tot de agent hem opnieuw start.

De server controleert welke protocolversie de editor gebruikt voordat hij verbinding maakt.
Als de twee verschillen, wordt elke aanroep die bij die editor aankomt, geweigerd met `protocolMismatch`, leesopdrachten en `erd_list_documents` inbegrepen, en wordt er niets geschreven.
Het bericht noemt de kant die moet worden bijgewerkt: de server, of de ERD Editor in de editor, wat in VS Code de extensie is en in Obsidian en een JetBrains-IDE de plug-in.

Server `1.0.0`, de VS Code-extensie `4.0.0` of later, de Obsidian-plug-in `1.0.0` of later en de JetBrains-plug-in `1.0.0` of later gebruiken protocol 2.
Elke eerdere server gebruikt protocol 1, en dat geldt ook voor elke eerdere editorversie die agents bedient: de VS Code-extensie `3.0.0` tot en met `3.1.0`, de Obsidian-plug-in `0.1.0` en `0.2.0` en de JetBrains-plug-in `0.9.0` en `0.10.0`.
Zo'n editor en server `1.0.0` weigeren elkaar, en dat doen ook een eerdere server en een editor die protocol 2 gebruikt.
Een VS Code-extensie vóór `3.0.0` of een JetBrains-plug-in vóór `0.9.0` bedient helemaal geen agents, dus bewerkt de agent de bestanden op schijf, zelfs een diagram dat erin geopend is.

| Combinatie | Het bericht eindigt met |
| --- | --- |
| Server `1.0.0` met een extensie of plug-in die protocol 1 gebruikt | `Update the ERD Editor extension or plugin in the editor until its hub speaks protocol 2.` |
| Een eerdere server met een extensie of plug-in die protocol 2 gebruikt | `Update the MCP server (npx -y @dineug/erd-editor-mcp@latest) until it speaks protocol 2.` |

Werk de server en de extensie of plug-in samen bij.
Werk ERD Editor ook bij overal waar de diagrammen worden geopend.
De VS Code-extensie vóór `4.0.0`, de Obsidian-plug-in vóór `1.0.0` en de JetBrains-plug-in vóór `1.0.0` tonen een diagram dat een latere versie heeft opgeslagen, of dat de agent op schijf heeft bewerkt, zonder de pictogrammen voor primaire sleutels.
Wanneer ze het bestand opslaan, laten ze de tabelgroepen en Schema SQL-scripts ervan weg.
De VS Code-extensie vóór `3.1.0`, de Obsidian-plug-in vóór `0.2.0` en de JetBrains-plug-in vóór `0.10.0` laten bij het opslaan van het bestand ook de ON DELETE- en ON UPDATE-acties van een diagram weg.
Start in Obsidian de app opnieuw na het bijwerken van de plug-in: tot dan blijft een kluisvenster de ERD Editor uitvoeren van de plug-inversie die het als eerste heeft geladen.
