---
sidebar_position: 2
description: Registrera servern @dineug/erd-editor-mcp i Claude Code, Codex eller någon annan MCP-klient och konfigurera VS Code, Obsidian eller en JetBrains-IDE för live-redigering.
---

# Installera

Servern är publicerad på npm som `@dineug/erd-editor-mcp`.
Den är en enda fristående fil utan körtidsberoenden, och `npx` laddar ned den första gången agenten startar den, så det finns inget annat att installera.
Den kräver Node.js `22.12` eller senare.

För att agenten ska kunna redigera ett diagram live konfigurerar du också den editor som innehåller det: [VS Code](#set-up-vs-code), [Obsidian](#set-up-obsidian) eller [en JetBrains-IDE](#set-up-a-jetbrains-ide).
Om ingen editor betjänar dokumentet redigerar agenten filen på disken – se [Live och headless](./live-and-headless.md).

## Claude Code {#claude-code}

Kör i din projektmapp:

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

Lägg till `--scope project` före `--transport` för att i stället skriva in servern i projektets `.mcp.json`, där alla som klonar projektet får med den.

## Codex {#codex}

Kör en gång. Codex CLI, appen och IDE-tillägget för Codex delar på inställningen:

```sh
codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp
```

Eller lägg till servern i `~/.codex/config.toml` eller i `.codex/config.toml` i ett betrott projekt:

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## Andra MCP-klienter {#any-other-mcp-client}

Kör `npx -y @dineug/erd-editor-mcp` som stdio-server: kommandot är `npx` och argumenten är `-y` och `@dineug/erd-editor-mcp`.

Servern tolkar en relativ dokumentsökväg utifrån sin arbetskatalog, så starta den i din projektmapp.
Den stöder MCP-protokollversionerna `2025-06-18`, `2025-03-26` och `2024-11-05` och svarar med `2025-06-18` när en klient använder en senare version.

## Konfigurera VS Code {#set-up-vs-code}

Ett VS Code-fönster betjänar diagrammen i sina arbetsområdesmappar och alla diagram som är öppna i det.

1. Installera [tillägget ERD Editor](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) `4.0.0` eller senare. Det kräver VS Code `1.101.0` eller senare.
2. Öppna projektmappen och lita på arbetsområdet. Tillägget betjänar agenter bara i ett betrott arbetsområde.
3. Låt inställningen `dineug.erd-editor.agentHub.enabled` vara på. Den är på som standard.

Ett tillägg från `3.0.0` till `3.1.0` och servern i version `1.0.0` nekar varandra, och ett tillägg före `3.0.0` betjänar inga agenter – se [Uppdatera](#updating).

Tillägget startar i ett arbetsområde som innehåller filer med filändelsen `.erd`, `.erd.json`, `.vuerd` eller `.vuerd.json`, så en agent når de diagrammen innan du öppnar något av dem.
I ett arbetsområde utan sådana filer startar det när du öppnar ett diagram, och fram till dess redigerar agenten på disken.

| Inställning | Standardvärde | Effekt |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | Låter en agents MCP-server redigera dokumenten i det här fönstret via en lokal socket, eller en namngiven pipe i Windows. När inställningen är av, eller i ett arbetsområde som inte är betrott, kan agenter fortfarande läsa fönstrets diagram från disken, men aldrig skriva till ett diagram bakom ryggen på editorn. |

## Konfigurera Obsidian {#set-up-obsidian}

Ett valvfönster i Obsidian betjänar diagrammen i sitt valv.

1. Installera [pluginet ERD Editor](https://community.obsidian.md/plugins/erd-editor) `1.0.0` eller senare från Community plugins och slå på det. Det körs bara i skrivbordsappen och kräver Obsidian `1.5.7` eller senare.
2. Låt Settings → ERD Editor → Coding agents vara på. Den är på som standard, och varje valv har sin egen inställning.

En tidigare version av pluginet och servern i version `1.0.0` nekar varandra – se [Uppdatera](#updating).

Ett valvfönster betjänar agenter från det ögonblick pluginet läses in, så en agent når valvets diagram innan du öppnar något av dem.
Det finns inget förtroendesteg.
En fil som valvet inte listar, till exempel en fil i en mapp vars namn börjar med en punkt, kan inte öppnas i ERD Editor, så en redigering av den nekas.

Be agenten att namnge nya diagram med filändelsen `.erd`.
Ett namn utan filändelse får `.erd.json`, och filutforskaren i Obsidian listar en `.erd.json`-fil bara medan Settings → Files and links → Detect all file extensions är på.

| Inställning | Standardvärde | Effekt |
| --- | --- | --- |
| Coding agents | På | Låter en agents MCP-server redigera diagrammen i det här valvet via en lokal socket, eller en namngiven pipe i Windows. När inställningen är av kan agenter fortfarande läsa valvets diagram från disken, men aldrig skriva till ett diagram bakom ryggen på editorn. |

Obsidian som har installerats från Flathub körs i en Flatpak-sandlåda, som servern inte kan nå.
Där betjänar pluginet inga agenter och har ingen låsfil, så agenten redigerar filerna på disken, även ett diagram som du har öppet.
Obsidian läser in diagrammet på nytt, som efter varje ändring som görs utanför Obsidian, och en redigering av dig som ännu inte har sparats ger vika för agentens.
Pluginet meddelar detta varje gång valvet öppnas, tills du slår av Coding agents.

## Konfigurera en JetBrains-IDE {#set-up-a-jetbrains-ide}

En JetBrains-IDE betjänar diagrammen i alla projekt som är öppna i den och alla diagram som är öppna i dess ERD Editor.

1. Installera [pluginet ERD Editor](https://plugins.jetbrains.com/plugin/23594-erd-editor) `1.0.0` eller senare. Det kräver en IntelliJ-baserad IDE `2025.2` eller senare som körs på JetBrains Runtime.
2. Öppna projektet och lita på det. I ett projekt som IDE:n inte litar på, till exempel ett som har öppnats i säkert läge, läser agenter diagrammen men ändrar dem aldrig.
3. Låt Settings | Tools | ERD Editor → Coding agents vara ikryssad. Den är på som standard och gäller för hela IDE:n.

Ett plugin i version `0.9.0` eller `0.10.0` och servern i version `1.0.0` nekar varandra, och ett plugin före `0.9.0` betjänar inga agenter – se [Uppdatera](#updating).

IDE:n betjänar agenter från det ögonblick det första projektet öppnas, så en agent når ett projekts diagram innan du öppnar något av dem.

| Inställning | Standardvärde | Effekt |
| --- | --- | --- |
| Coding agents | På | Låter en agents MCP-server redigera diagrammen i den här IDE:n via en lokal socket, eller en namngiven pipe i Windows. När inställningen är av kan agenter fortfarande läsa diagrammen i de öppna projekten från disken, men aldrig ändra ett diagram bakom ryggen på editorn. |

Inställningssidan visar när kodagenter inte är tillgängliga: i en IDE utan JCEF (där ERD Editor inte heller kan köras), i en IDE som har installerats som Flatpak i Linux och när dess hubb inte kunde starta.
Då har IDE:n ingen låsfil, och agenten redigerar filerna på disken.
ERD Editor läser inte in ett öppet diagram på nytt när det ändras på disken, och din nästa redigering i det skriver hela diagrammet tillbaka över agentens ändringar, så stäng diagrammet först.

## Prova {#try-it}

1. Öppna mappen som innehåller dina diagram: i VS Code som ett arbetsområde som du litar på; i Obsidian som ett valv; i en JetBrains-IDE som ett projekt som du litar på.
2. Starta agenten i samma mapp och formulera dig med vanliga ord, till exempel _”Lägg till tabellen reviews i schema.erd.json, med relationer till users och products”_.
3. Se hur ändringen dyker upp på arbetsytan. I VS Code sparar du med `Ctrl + S` (Windows/Linux) eller `⌘ + S` (Mac), eller ber agenten att spara. Obsidian och en JetBrains-IDE sparar ändringen som de sparar dina egna redigeringar, och om du ber agenten att spara skrivs den direkt.

Ett diagram som inte är öppet ännu öppnas i ERD Editor vid agentens första redigering, utan att ta tangentbordsfokus.
Agenten skapar ett nytt dokument med `erd_open_document`, och ett namn utan filändelse får `.erd.json`.

## Uppdatera {#updating}

Kommandona ovan anger ingen version, så `npx` kontrollerar på npm om det finns en nyare version av servern varje gång agenten startar den.
En server som redan körs behåller sin version tills agenten startar den igen.

Servern kontrollerar vilken protokollversion editorn använder innan den ansluter.
När de två skiljer sig åt nekas varje anrop som når den editorn med `protocolMismatch`, även läsningar och `erd_list_documents`, och ingenting skrivs.
Meddelandet anger vilken sida som ska uppdateras: servern eller ERD Editor i editorn, vilket är tillägget i VS Code och pluginet i Obsidian och en JetBrains-IDE.

Servern i version `1.0.0`, VS Code-tillägget `4.0.0` eller senare, Obsidian-pluginet `1.0.0` eller senare och JetBrains-pluginet `1.0.0` eller senare använder protokoll 2.
Alla tidigare servrar använder protokoll 1, och det gör även alla tidigare editorversioner som betjänar agenter: VS Code-tillägget `3.0.0` till `3.1.0`, Obsidian-pluginet `0.1.0` och `0.2.0` samt JetBrains-pluginet `0.9.0` och `0.10.0`.
En sådan editor och servern i version `1.0.0` nekar varandra, och det gör även en tidigare server och en editor som använder protokoll 2.
Ett VS Code-tillägg före `3.0.0` eller ett JetBrains-plugin före `0.9.0` betjänar inga agenter alls, så agenten redigerar filerna på disken, även ett diagram som är öppet i det.

| Kombination | Meddelandet slutar med |
| --- | --- |
| Servern i version `1.0.0` med ett tillägg eller plugin som använder protokoll 1 | `Update the ERD Editor extension or plugin in the editor until its hub speaks protocol 2.` |
| En tidigare server med ett tillägg eller plugin som använder protokoll 2 | `Update the MCP server (npx -y @dineug/erd-editor-mcp@latest) until it speaks protocol 2.` |

Uppdatera servern och tillägget eller pluginet samtidigt.
Uppdatera också ERD Editor överallt där diagrammen öppnas.
VS Code-tillägget före `4.0.0`, Obsidian-pluginet före `1.0.0` och JetBrains-pluginet före `1.0.0` visar ett diagram som en senare version har sparat, eller som agenten har redigerat på disken, utan dess primärnyckelikoner.
När de sparar filen tar de bort dess tabellgrupper och Schema SQL-skript.
VS Code-tillägget före `3.1.0`, Obsidian-pluginet före `0.2.0` och JetBrains-pluginet före `0.10.0` tar också bort ett diagrams åtgärder för ON DELETE och ON UPDATE när de sparar filen.
I Obsidian startar du om appen efter att ha uppdaterat pluginet: fram till dess fortsätter ett valvfönster att köra ERD Editor från den pluginversion som det läste in först.
