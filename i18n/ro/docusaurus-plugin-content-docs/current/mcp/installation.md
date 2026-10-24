---
sidebar_position: 2
description: Înregistrați serverul @dineug/erd-editor-mcp în Claude Code, Codex sau orice alt client MCP și configurați VS Code, Obsidian sau un IDE JetBrains pentru editarea în direct.
---

# Instalare

Serverul este publicat pe npm sub numele `@dineug/erd-editor-mcp`.
Este un singur fișier autonom, fără dependențe de execuție, iar `npx` îl descarcă prima dată când agentul îl pornește, așa că nu mai trebuie instalat nimic altceva.
Necesită Node.js `22.12` sau o versiune ulterioară.

Pentru ca agentul să poată edita o diagramă în direct, configurați și editorul care o conține: [VS Code](#set-up-vs-code), [Obsidian](#set-up-obsidian) sau [un IDE JetBrains](#set-up-a-jetbrains-ide).
Când niciun editor nu deservește documentul, agentul editează fișierul pe disc (consultați [În direct și fără interfață](./live-and-headless.md)).

## Claude Code {#claude-code}

Rulați în folderul proiectului:

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

Adăugați `--scope project` înainte de `--transport` pentru a scrie în schimb serverul în fișierul `.mcp.json` al proiectului, de unde îl preia oricine clonează proiectul.

## Codex {#codex}

Rulați o singură dată. CLI-ul Codex, aplicația și extensia pentru IDE au în comun această setare:

```sh
codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp
```

Sau adăugați serverul în `~/.codex/config.toml` ori în `.codex/config.toml` dintr-un proiect de încredere:

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## Orice alt client MCP {#any-other-mcp-client}

Rulați `npx -y @dineug/erd-editor-mcp` ca server stdio: comanda este `npx`, iar argumentele sunt `-y` și `@dineug/erd-editor-mcp`.

Serverul interpretează calea relativă a unui document în raport cu directorul său de lucru, așa că porniți-l în folderul proiectului.
Acceptă versiunile `2025-06-18`, `2025-03-26` și `2024-11-05` ale protocolului MCP, iar unui client care folosește o versiune ulterioară îi răspunde cu `2025-06-18`.

## Configurarea VS Code {#set-up-vs-code}

O fereastră VS Code deservește diagramele din folderele spațiului său de lucru și orice diagramă deschisă în ea.

1. Instalați [extensia ERD Editor](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) `4.0.0` sau o versiune ulterioară. Necesită VS Code `1.101.0` sau o versiune ulterioară.
2. Deschideți folderul proiectului și marcați spațiul de lucru drept de încredere. Extensia deservește agenții doar într-un spațiu de lucru de încredere.
3. Lăsați activată setarea `dineug.erd-editor.agentHub.enabled`. Este activată implicit.

O extensie de la versiunea `3.0.0` până la versiunea `3.1.0` și versiunea `1.0.0` sau o versiune ulterioară a serverului se refuză reciproc, iar o extensie anterioară versiunii `3.0.0` nu deservește niciun agent.
O extensie în versiunea `4.0.0` sau `4.1.0` se conectează, dar nici nu afișează, nici nu păstrează numele logice, legăturile cu domeniile și rândurile dicționarelor pe care le scrie agentul (consultați [Actualizarea](#updating)).

Extensia pornește într-un spațiu de lucru care conține fișiere `.erd`, `.erd.json`, `.vuerd` sau `.vuerd.json`, așa că un agent ajunge la acele diagrame înainte să deschideți vreuna.
Într-un spațiu de lucru fără niciunul dintre ele, pornește când deschideți o diagramă, iar până atunci agentul editează pe disc.

| Setare | Valoare implicită | Efect |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | Permite serverului MCP al unui agent să editeze documentele acestei ferestre printr-un socket local sau, pe Windows, printr-un canal numit (named pipe). Când este dezactivată sau într-un spațiu de lucru care nu este de încredere, agenții pot citi în continuare de pe disc diagramele ferestrei, dar nu scriu niciodată vreuna fără știrea editorului ei. |

## Configurarea Obsidian {#set-up-obsidian}

Fereastra unui seif Obsidian deservește diagramele din seiful respectiv.

1. Instalați [pluginul ERD Editor](https://community.obsidian.md/plugins/erd-editor) `1.0.0` sau o versiune ulterioară din Community plugins și activați-l. Rulează doar în aplicația pentru desktop și necesită Obsidian `1.5.7` sau o versiune ulterioară.
2. Lăsați activată opțiunea Settings → ERD Editor → Coding agents. Este activată implicit, iar fiecare seif își păstrează propria setare.

Un plugin anterior versiunii `1.0.0` și versiunea `1.0.0` sau o versiune ulterioară a serverului se refuză reciproc.
Un plugin în versiunea `1.0.0` sau `1.1.0` se conectează, dar nici nu afișează, nici nu păstrează numele logice, legăturile cu domeniile și rândurile dicționarelor pe care le scrie agentul (consultați [Actualizarea](#updating)).

Fereastra unui seif deservește agenții din momentul în care se încarcă pluginul, așa că un agent ajunge la diagramele seifului înainte să deschideți vreuna.
Nu există niciun pas de acordare a încrederii.
Un fișier pe care seiful nu îl listează, de exemplu unul dintr-un folder al cărui nume începe cu un punct, nu poate fi deschis în ERD Editor, așa că o editare a lui este refuzată.

Cereți agentului să denumească diagramele noi cu extensia `.erd`.
Un nume fără extensie primește `.erd.json`, iar exploratorul de fișiere din Obsidian listează un fișier `.erd.json` doar cât timp opțiunea Settings → Files and links → Detect all file extensions este activată.

| Setare | Valoare implicită | Efect |
| --- | --- | --- |
| Coding agents | Activată | Permite serverului MCP al unui agent să editeze diagramele acestui seif printr-un socket local sau, pe Windows, printr-un canal numit (named pipe). Când este dezactivată, agenții pot citi în continuare de pe disc diagramele seifului, dar nu scriu niciodată vreuna fără știrea editorului ei. |

Obsidian instalat din Flathub rulează într-un mediu izolat (sandbox) Flatpak, la care serverul nu poate ajunge.
În acest caz, pluginul nu deservește niciun agent și nu păstrează niciun fișier de blocare, așa că agentul editează fișierele pe disc, chiar și o diagramă pe care o aveți deschisă.
Obsidian reîncarcă diagrama, așa cum face după orice modificare făcută în afara sa, iar o editare a dumneavoastră pe care nu a salvat-o încă cedează locul celei a agentului.
Pluginul semnalează acest lucru de fiecare dată când se deschide seiful, până când dezactivați opțiunea Coding agents.

## Configurarea unui IDE JetBrains {#set-up-a-jetbrains-ide}

Un IDE JetBrains deservește diagramele fiecărui proiect deschis în el și orice diagramă deschisă în ERD Editor din acel IDE.

1. Instalați [pluginul ERD Editor](https://plugins.jetbrains.com/plugin/23594-erd-editor) `1.0.0` sau o versiune ulterioară. Necesită un IDE bazat pe IntelliJ `2025.2` sau o versiune ulterioară, care rulează pe JetBrains Runtime.
2. Deschideți proiectul și marcați-l drept de încredere. Într-un proiect pe care IDE-ul nu îl consideră de încredere, de exemplu unul deschis în modul sigur, agenții citesc diagramele, dar nu le modifică niciodată.
3. Lăsați bifată opțiunea Settings | Tools | ERD Editor → Coding agents. Este activată implicit și se aplică întregului IDE.

Un plugin în versiunea `0.9.0` sau `0.10.0` și versiunea `1.0.0` sau o versiune ulterioară a serverului se refuză reciproc, iar un plugin anterior versiunii `0.9.0` nu deservește niciun agent.
Un plugin în versiunea `1.0.0` sau `1.1.0` se conectează, dar nici nu afișează, nici nu păstrează numele logice, legăturile cu domeniile și rândurile dicționarelor pe care le scrie agentul (consultați [Actualizarea](#updating)).

IDE-ul deservește agenții din momentul în care se deschide primul proiect, așa că un agent ajunge la diagramele unui proiect înainte să deschideți vreuna.

| Setare | Valoare implicită | Efect |
| --- | --- | --- |
| Coding agents | Activată | Permite serverului MCP al unui agent să editeze diagramele acestui IDE printr-un socket local sau, pe Windows, printr-un canal numit (named pipe). Când este dezactivată, agenții pot citi în continuare de pe disc diagramele proiectelor deschise, dar nu modifică niciodată vreuna fără știrea editorului ei. |

Pagina de setări arată când agenții de programare nu sunt disponibili: într-un IDE fără JCEF (unde nici ERD Editor nu poate rula), într-un IDE instalat ca Flatpak pe Linux și atunci când hubul său nu a putut porni.
În aceste cazuri, IDE-ul nu păstrează niciun fișier de blocare, iar agentul editează fișierele pe disc.
ERD Editor nu reîncarcă o diagramă modificată pe disc cât timp aceasta este deschisă, iar următoarea editare pe care o faceți în ea scrie întreaga diagramă peste modificările agentului, așa că închideți mai întâi diagrama.

## Încercați {#try-it}

1. Deschideți folderul care conține diagramele: în VS Code, ca spațiu de lucru de încredere; în Obsidian, ca seif; într-un IDE JetBrains, ca proiect de încredere.
2. Porniți agentul în același folder și formulați cererea cu cuvinte simple, de exemplu _„Adăugați în schema.erd.json un tabel reviews, în relație cu users și products”_.
3. Urmăriți cum modificarea apare pe pânză. În VS Code, salvați cu `Ctrl + S` (Windows/Linux) sau `⌘ + S` (Mac) ori cereți agentului să salveze. Obsidian și un IDE JetBrains salvează modificarea așa cum salvează editările dumneavoastră, iar dacă îi cereți agentului să salveze, modificarea se scrie imediat.

O diagramă care nu este încă deschisă se deschide în ERD Editor la prima editare a agentului, fără a prelua focusul tastaturii.
Agentul creează un document nou cu instrumentul `erd_open_document`, iar un nume fără extensie primește `.erd.json`.

## Actualizarea {#updating}

Comenzile de mai sus nu indică nicio versiune, așa că `npx` verifică pe npm dacă există o versiune mai nouă a serverului de fiecare dată când agentul îl pornește.
Un server care rulează deja își păstrează versiunea până când agentul îl pornește din nou.

Serverul verifică versiunea de protocol folosită de editor înainte de a se conecta.
Când cele două diferă, fiecare apel care ajunge la acel editor este refuzat cu codul `protocolMismatch`, inclusiv citirile și instrumentul `erd_list_documents`, și nu se scrie nimic.
Mesajul indică partea care trebuie actualizată: serverul sau ERD Editor din editor, adică extensia în VS Code și pluginul în Obsidian și într-un IDE JetBrains.

Versiunea `1.0.0` sau o versiune ulterioară a serverului, extensia pentru VS Code `4.0.0` sau o versiune ulterioară, pluginul pentru Obsidian `1.0.0` sau o versiune ulterioară și pluginul pentru JetBrains `1.0.0` sau o versiune ulterioară folosesc protocolul 2.
Toate versiunile anterioare ale serverului folosesc protocolul 1, la fel ca toate versiunile anterioare pentru editoare care deservesc agenți: extensia pentru VS Code de la versiunea `3.0.0` până la versiunea `3.1.0`, pluginul pentru Obsidian în versiunile `0.1.0` și `0.2.0` și pluginul pentru JetBrains în versiunile `0.9.0` și `0.10.0`.
Un astfel de editor și versiunea `1.0.0` sau o versiune ulterioară a serverului se refuză reciproc, la fel ca o versiune anterioară a serverului și un editor care folosește protocolul 2.
O extensie pentru VS Code anterioară versiunii `3.0.0` sau un plugin pentru JetBrains anterior versiunii `0.9.0` nu deservește deloc agenți, așa că agentul editează fișierele pe disc, chiar și o diagramă deschisă în editorul respectiv.

| Combinație | Mesajul se încheie cu |
| --- | --- |
| Versiunea `1.0.0` sau o versiune ulterioară a serverului cu o extensie sau un plugin care folosește protocolul 1 | `Update the ERD Editor extension or plugin in the editor until its hub speaks protocol 2.` |
| O versiune anterioară a serverului cu o extensie sau un plugin care folosește protocolul 2 | `Update the MCP server (npx -y @dineug/erd-editor-mcp@latest) until it speaks protocol 2.` |

Actualizați împreună serverul și extensia sau pluginul.
Un server și un editor care folosesc același protocol se conectează, indiferent care dintre ele este mai vechi, dar doar versiunea `1.1.0` sau o versiune ulterioară a serverului are instrumente pentru nume logice, domenii și dicționare (consultați [Dicționare](./tools.md#dictionaries)).
Doar extensia pentru VS Code `4.2.0` sau o versiune ulterioară și pluginurile pentru Obsidian și JetBrains `1.2.0` sau o versiune ulterioară afișează și păstrează numele logice, legăturile cu domeniile și rândurile dicționarelor pe care le scriu aceste instrumente.
O extensie sau un plugin dintr-o versiune anterioară care se conectează le ignoră, deși apelul agentului reușește.
Aplică totuși numele fizice pe care le derivă dicționarele și tipurile de date pe care le dau domeniile.
Un server anterior versiunii `1.1.0` citește un fișier fără numele logice, legăturile cu domeniile și rândurile dicționarelor și le omite când editează fișierul pe disc (consultați [Fără interfață](./live-and-headless.md#headless)).

Actualizați, de asemenea, ERD Editor oriunde sunt deschise diagramele.
Extensia pentru VS Code anterioară versiunii `4.2.0`, pluginul pentru Obsidian anterior versiunii `1.2.0` și pluginul pentru JetBrains anterior versiunii `1.2.0` deschid o diagramă salvată de o versiune ulterioară, sau editată de agent pe disc, fără numele logice ale tabelelor și coloanelor, fără legăturile coloanelor cu domeniile și fără cuvintele, termenii și domeniile ei.
Când salvează fișierul, le omit.
Extensia pentru VS Code anterioară versiunii `4.0.0`, pluginul pentru Obsidian anterior versiunii `1.0.0` și pluginul pentru JetBrains anterior versiunii `1.0.0` afișează, de asemenea, o astfel de diagramă fără pictogramele de cheie primară și elimină grupurile de tabele și scripturile filei Schemă SQL ale diagramei când salvează fișierul.
Extensia pentru VS Code anterioară versiunii `3.1.0`, pluginul pentru Obsidian anterior versiunii `0.2.0` și pluginul pentru JetBrains anterior versiunii `0.10.0` elimină, de asemenea, acțiunile ON DELETE și ON UPDATE ale unei diagrame când salvează fișierul.
În Obsidian, reporniți aplicația după actualizarea pluginului: până atunci, fereastra unui seif continuă să ruleze ERD Editor din versiunea pluginului pe care a încărcat-o mai întâi.
