---
sidebar_position: 2
description: Registrirajte strežnik @dineug/erd-editor-mcp v agentu Claude Code ali Codex ali v katerem koli drugem odjemalcu MCP ter za urejanje v živo nastavite VS Code, aplikacijo Obsidian ali razvojno okolje JetBrains.
---

# Namestitev

Strežnik je v registru npm objavljen kot paket `@dineug/erd-editor-mcp`.
Gre za eno samostojno datoteko brez odvisnosti med izvajanjem, ukaz `npx` pa jo prenese, ko agent strežnik prvič zažene, zato vam ni treba namestiti ničesar drugega.
Potrebuje Node.js različice `22.12` ali novejše.

Če želite, da agent diagram ureja v živo, nastavite tudi urejevalnik, v katerem je diagram: [VS Code](#set-up-vs-code), [Obsidian](#set-up-obsidian) ali [razvojno okolje JetBrains](#set-up-a-jetbrains-ide).
Če dokumenta ne streže noben urejevalnik, agent ureja datoteko na disku – glejte stran [V živo in brez vmesnika](./live-and-headless.md).

## Claude Code {#claude-code}

V mapi svojega projekta zaženite:

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

Pred možnostjo `--transport` dodajte možnost `--scope project`, da strežnik namesto tega zapišete v datoteko `.mcp.json` projekta, kjer ga prevzame vsak, ki projekt klonira.

## Codex {#codex}

Zaženite enkrat. Codex CLI, aplikacija in razširitev za razvojna okolja uporabljajo isto nastavitev:

```sh
codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp
```

Ali pa strežnik dodajte v datoteko `~/.codex/config.toml` ali v datoteko `.codex/config.toml` zaupanja vrednega projekta:

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## Kateri koli drug odjemalec MCP {#any-other-mcp-client}

Zaženite `npx -y @dineug/erd-editor-mcp` kot strežnik stdio: ukaz je `npx`, argumenta pa sta `-y` in `@dineug/erd-editor-mcp`.

Strežnik razreši relativno pot do dokumenta glede na svoj delovni imenik, zato ga zaženite v mapi svojega projekta.
Podpira različice protokola MCP `2025-06-18`, `2025-03-26` in `2024-11-05`, odjemalcu z novejšo različico pa odgovori z različico `2025-06-18`.

## Nastavitev urejevalnika VS Code {#set-up-vs-code}

Okno VS Code streže diagrame v mapah svojega delovnega prostora in vsak diagram, ki je odprt v njem.

1. Namestite [razširitev ERD Editor](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) različice `4.0.0` ali novejše. Potrebuje VS Code različice `1.101.0` ali novejše.
2. Odprite mapo projekta in zaupajte delovnemu prostoru. Razširitev streže agentom samo v zaupanja vrednem delovnem prostoru.
3. Pustite nastavitev `dineug.erd-editor.agentHub.enabled` vklopljeno. Privzeto je vklopljena.

Razširitev od različice `3.0.0` do `3.1.0` in strežnik različice `1.0.0` se med seboj zavračata, razširitev pred različico `3.0.0` pa ne streže nobenemu agentu – glejte razdelek [Posodabljanje](#updating).

Razširitev se zažene v delovnem prostoru, ki vsebuje datoteke `.erd`, `.erd.json`, `.vuerd` ali `.vuerd.json`, zato agent do teh diagramov dostopa, še preden odprete katerega od njih.
V delovnem prostoru brez takih datotek se zažene, ko odprete diagram, do takrat pa agent ureja na disku.

| Nastavitev | Privzeta vrednost | Učinek |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | Strežniku MCP agenta omogoča, da ureja dokumente tega okna prek lokalne vtičnice ali v sistemu Windows prek poimenovane cevi. Ko je izklopljena ali če delovni prostor ni zaupanja vreden, lahko agenti diagrame okna še vedno berejo z diska, nikoli pa nobenega ne zapišejo brez vednosti njegovega urejevalnika. |

## Nastavitev aplikacije Obsidian {#set-up-obsidian}

Okno trezorja v aplikaciji Obsidian streže diagrame v svojem trezorju.

1. V razdelku Community plugins namestite [vtičnik ERD Editor](https://community.obsidian.md/plugins/erd-editor) različice `1.0.0` ali novejše in ga vklopite. Deluje samo v namizni aplikaciji in potrebuje aplikacijo Obsidian različice `1.5.7` ali novejše.
2. Pustite nastavitev Settings → ERD Editor → Coding agents vklopljeno. Privzeto je vklopljena, vsak trezor pa ima svojo nastavitev.

Vtičnik starejše različice in strežnik različice `1.0.0` se med seboj zavračata – glejte razdelek [Posodabljanje](#updating).

Okno trezorja streže agentom od trenutka, ko se vtičnik naloži, zato agent do diagramov trezorja dostopa, še preden odprete katerega od njih.
Koraka zaupanja ni.
Datoteke, ki je trezor ne navaja, na primer datoteke v mapi, katere ime se začne s piko, ni mogoče odpreti v urejevalniku ERD Editor, zato se sprememba te datoteke zavrne.

Agenta prosite, naj nove diagrame poimenuje s končnico `.erd`.
Ime brez končnice dobi končnico `.erd.json`, raziskovalec datotek v aplikaciji Obsidian pa datoteko `.erd.json` navede samo, dokler je vklopljena nastavitev Settings → Files and links → Detect all file extensions.

| Nastavitev | Privzeta vrednost | Učinek |
| --- | --- | --- |
| Coding agents | Vklopljeno | Strežniku MCP agenta omogoča, da ureja diagrame tega trezorja prek lokalne vtičnice ali v sistemu Windows prek poimenovane cevi. Ko je izklopljena, lahko agenti diagrame trezorja še vedno berejo z diska, nikoli pa nobenega ne zapišejo brez vednosti njegovega urejevalnika. |

Aplikacija Obsidian, nameščena iz repozitorija Flathub, deluje v peskovniku Flatpak, do katerega strežnik ne more dostopati.
Tam vtičnik ne streže nobenemu agentu in ne hrani zaklepne datoteke, zato agent ureja datoteke na disku, tudi diagram, ki ga imate odprtega.
Obsidian diagram znova naloži, tako kot po vsaki spremembi, narejeni zunaj njega, vaša sprememba, ki je še ni shranil, pa se umakne spremembi agenta.
Vtičnik to sporoči vsakič, ko se trezor odpre, dokler ne izklopite nastavitve Coding agents.

## Nastavitev razvojnega okolja JetBrains {#set-up-a-jetbrains-ide}

Razvojno okolje JetBrains streže diagrame vseh projektov, ki so v njem odprti, in vsak diagram, ki je odprt v urejevalniku ERD Editor tega okolja.

1. Namestite [vtičnik ERD Editor](https://plugins.jetbrains.com/plugin/23594-erd-editor) različice `1.0.0` ali novejše. Potrebuje razvojno okolje na osnovi IntelliJ različice `2025.2` ali novejše, ki deluje v okolju JetBrains Runtime.
2. Odprite projekt in mu zaupajte. V projektu, ki mu razvojno okolje ne zaupa, na primer v projektu, odprtem v varnem načinu, agenti diagrame berejo, nikoli pa jih ne spremenijo.
3. Pustite nastavitev Settings | Tools | ERD Editor → Coding agents označeno. Privzeto je vklopljena in velja za celotno razvojno okolje.

Vtičnik različice `0.9.0` ali `0.10.0` in strežnik različice `1.0.0` se med seboj zavračata, vtičnik pred različico `0.9.0` pa ne streže nobenemu agentu – glejte razdelek [Posodabljanje](#updating).

Razvojno okolje streže agentom od trenutka, ko se odpre prvi projekt, zato agent do diagramov projekta dostopa, še preden odprete katerega od njih.

| Nastavitev | Privzeta vrednost | Učinek |
| --- | --- | --- |
| Coding agents | Vklopljeno | Strežniku MCP agenta omogoča, da ureja diagrame tega razvojnega okolja prek lokalne vtičnice ali v sistemu Windows prek poimenovane cevi. Ko je izklopljena, lahko agenti diagrame odprtih projektov še vedno berejo z diska, nikoli pa nobenega ne spremenijo brez vednosti njegovega urejevalnika. |

Stran z nastavitvami prikaže, kdaj agenti za kodiranje niso na voljo: v razvojnem okolju brez JCEF (kjer tudi ERD Editor ne more delovati), v razvojnem okolju, nameščenem kot Flatpak v sistemu Linux, in kadar se njegovo središče ni moglo zagnati.
V teh primerih razvojno okolje ne hrani zaklepne datoteke, agent pa ureja datoteke na disku.
ERD Editor odprtega diagrama ne naloži znova, ko se ta spremeni na disku, vaša naslednja sprememba v njem pa znova zapiše celoten diagram in prepiše spremembe agenta, zato diagram najprej zaprite.

## Preizkus {#try-it}

1. Odprite mapo s svojimi diagrami: v VS Code kot delovni prostor, ki mu zaupate; v aplikaciji Obsidian kot trezor; v razvojnem okolju JetBrains kot projekt, ki mu zaupate.
2. Agenta zaženite v isti mapi in ga prosite z vsakdanjimi besedami, na primer _»V datoteko schema.erd.json dodajte tabelo reviews, povezano s tabelama users in products«_.
3. Opazujte, kako se sprememba pojavi na platnu. V VS Code shranite z bližnjico `Ctrl + S` (Windows/Linux) ali `⌘ + S` (Mac) ali pa agenta prosite, naj shrani. Aplikacija Obsidian in razvojno okolje JetBrains spremembo shranita tako, kot shranjujeta vaše spremembe, če pa agenta prosite, naj shrani, se sprememba zapiše takoj.

Diagram, ki še ni odprt, se ob prvi spremembi agenta odpre v urejevalniku ERD Editor, ne da bi prevzel fokus tipkovnice.
Agent ustvari nov dokument z orodjem `erd_open_document`, ime brez končnice pa dobi končnico `.erd.json`.

## Posodabljanje {#updating}

Zgornji ukazi ne navajajo različice, zato ukaz `npx` vsakič, ko agent zažene strežnik, v registru npm preveri, ali obstaja novejša izdaja strežnika.
Strežnik, ki že teče, ohrani svojo izdajo, dokler ga agent ne zažene znova.

Strežnik pred vzpostavitvijo povezave preveri, katero različico protokola uporablja urejevalnik.
Če se različici razlikujeta, se vsak klic, ki doseže ta urejevalnik, zavrne s kodo `protocolMismatch`, vključno s klici za branje in orodjem `erd_list_documents`, in ničesar se ne zapiše.
Sporočilo navede stran, ki jo je treba posodobiti: strežnik ali ERD Editor v urejevalniku, kar je v VS Code razširitev, v aplikaciji Obsidian in razvojnem okolju JetBrains pa vtičnik.

Strežnik različice `1.0.0`, razširitev za VS Code različice `4.0.0` ali novejše, vtičnik za Obsidian različice `1.0.0` ali novejše in vtičnik za JetBrains različice `1.0.0` ali novejše uporabljajo protokol 2.
Vsak starejši strežnik uporablja protokol 1, prav tako vsaka starejša izdaja urejevalnika, ki streže agentom: razširitev za VS Code od različice `3.0.0` do `3.1.0`, vtičnik za Obsidian različic `0.1.0` in `0.2.0` ter vtičnik za JetBrains različic `0.9.0` in `0.10.0`.
Tak urejevalnik in strežnik različice `1.0.0` se med seboj zavračata, prav tako pa tudi starejši strežnik in urejevalnik, ki uporablja protokol 2.
Razširitev za VS Code pred različico `3.0.0` ali vtičnik za JetBrains pred različico `0.9.0` sploh ne streže agentom, zato agent ureja datoteke na disku, tudi diagram, ki je odprt v urejevalniku.

| Kombinacija | Konec sporočila |
| --- | --- |
| Strežnik različice `1.0.0` z razširitvijo ali vtičnikom, ki uporablja protokol 1 | `Update the ERD Editor extension or plugin in the editor until its hub speaks protocol 2.` |
| Starejši strežnik z razširitvijo ali vtičnikom, ki uporablja protokol 2 | `Update the MCP server (npx -y @dineug/erd-editor-mcp@latest) until it speaks protocol 2.` |

Strežnik in razširitev ali vtičnik posodobite hkrati.
ERD Editor posodobite tudi povsod, kjer se diagrami odpirajo.
Razširitev za VS Code pred različico `4.0.0`, vtičnik za Obsidian pred različico `1.0.0` in vtičnik za JetBrains pred različico `1.0.0` prikažejo diagram, ki ga je shranila novejša izdaja ali ga je agent uredil na disku, brez ikon primarnih ključev.
Ko datoteko shranijo, iz nje odstranijo skupine tabel in skripte Sheme SQL.
Razširitev za VS Code pred različico `3.1.0`, vtičnik za Obsidian pred različico `0.2.0` in vtičnik za JetBrains pred različico `0.10.0` ob shranjevanju datoteke iz diagrama odstranijo tudi dejanja ON DELETE in ON UPDATE.
Po posodobitvi vtičnika aplikacijo Obsidian znova zaženite: do takrat okno trezorja še naprej poganja ERD Editor različice vtičnika, ki jo je naložilo najprej.
