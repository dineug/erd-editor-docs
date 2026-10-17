---
sidebar_position: 2
description: Registrácia servera @dineug/erd-editor-mcp v Claude Code, Codex alebo akomkoľvek inom klientovi MCP a nastavenie VS Code, aplikácie Obsidian alebo IDE od JetBrains na úpravy naživo.
---

# Inštalácia

Server je zverejnený v npm ako balík `@dineug/erd-editor-mcp`.
Ide o jeden samostatný súbor bez závislostí za behu a `npx` ho stiahne, keď ho agent prvýkrát spustí, takže nič ďalšie netreba inštalovať.
Vyžaduje Node.js vo verzii `22.12` alebo novšej.

Ak chcete, aby agent upravoval diagram naživo, nastavte aj editor, v ktorom sa diagram nachádza: [VS Code](#set-up-vs-code), [Obsidian](#set-up-obsidian) alebo [IDE od JetBrains](#set-up-a-jetbrains-ide).
Ak dokument neobsluhuje žiadny editor, agent upravuje súbor na disku – pozrite si stránku [Live a Headless](./live-and-headless.md).

## Claude Code {#claude-code}

Spustite v priečinku projektu:

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

Pridajte `--scope project` pred `--transport`, ak chcete server namiesto toho zapísať do súboru `.mcp.json` projektu, odkiaľ ho prevezme každý, kto si projekt naklonuje.

## Codex {#codex}

Spustite raz. Codex CLI, aplikácia Codex a rozšírenie Codex pre IDE zdieľajú toto nastavenie:

```sh
codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp
```

Prípadne pridajte server do súboru `~/.codex/config.toml` alebo do súboru `.codex/config.toml` v dôveryhodnom projekte:

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## Iný klient MCP {#any-other-mcp-client}

Spustite `npx -y @dineug/erd-editor-mcp` ako server stdio: príkaz je `npx` a argumenty sú `-y` a `@dineug/erd-editor-mcp`.

Server vyhodnocuje relatívnu cestu k dokumentu vzhľadom na svoj pracovný adresár, preto ho spustite v priečinku projektu.
Podporuje verzie protokolu MCP `2025-06-18`, `2025-03-26` a `2024-11-05` a klientovi s novšou verziou odpovedá verziou `2025-06-18`.

## Nastavenie VS Code {#set-up-vs-code}

Okno VS Code obsluhuje diagramy v priečinkoch svojho pracovného priestoru a každý diagram, ktorý je v ňom otvorený.

1. Nainštalujte [rozšírenie ERD Editor](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) vo verzii `4.0.0` alebo novšej. Vyžaduje VS Code vo verzii `1.101.0` alebo novšej.
2. Otvorte priečinok projektu a dôverujte pracovnému priestoru. Rozšírenie obsluhuje agentov iba v dôveryhodnom pracovnom priestore.
3. Nechajte nastavenie `dineug.erd-editor.agentHub.enabled` zapnuté. Predvolene je zapnuté.

Rozšírenie od verzie `3.0.0` po verziu `3.1.0` a server vo verzii `1.0.0` sa navzájom odmietnu a rozšírenie pred verziou `3.0.0` neobsluhuje žiadnych agentov – pozrite si časť [Aktualizácia](#updating).

Rozšírenie sa spustí v pracovnom priestore, ktorý obsahuje súbory `.erd`, `.erd.json`, `.vuerd` alebo `.vuerd.json`, takže agent sa k týmto diagramom dostane ešte predtým, ako niektorý z nich otvoríte.
V pracovnom priestore bez takýchto súborov sa spustí, keď otvoríte diagram, a dovtedy agent vykonáva úpravy na disku.

| Nastavenie | Predvolená hodnota | Účinok |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | Umožňuje serveru MCP agenta upravovať dokumenty tohto okna cez lokálny soket alebo v systéme Windows cez pomenovanú rúru. Ak je vypnuté alebo ak pracovný priestor nie je dôveryhodný, agenti môžu diagramy okna stále čítať z disku, ale nikdy žiadny z nich nezapíšu bez vedomia jeho editora. |

## Nastavenie aplikácie Obsidian {#set-up-obsidian}

Okno trezoru aplikácie Obsidian obsluhuje diagramy vo svojom trezore.

1. Nainštalujte [doplnok ERD Editor](https://community.obsidian.md/plugins/erd-editor) vo verzii `1.0.0` alebo novšej z časti Community plugins a zapnite ho. Funguje iba v desktopovej aplikácii a vyžaduje aplikáciu Obsidian vo verzii `1.5.7` alebo novšej.
2. Nechajte možnosť Settings → ERD Editor → Coding agents zapnutú. Predvolene je zapnutá a každý trezor má vlastné nastavenie.

Staršia verzia doplnku a server vo verzii `1.0.0` sa navzájom odmietnu – pozrite si časť [Aktualizácia](#updating).

Okno trezoru obsluhuje agentov od chvíle, keď sa doplnok načíta, takže agent sa k diagramom trezoru dostane ešte predtým, ako niektorý z nich otvoríte.
Nie je tu žiadny krok udelenia dôvery.
Súbor, ktorý trezor neuvádza, napríklad súbor v priečinku, ktorého názov sa začína bodkou, sa nedá otvoriť v editore ERD Editor, preto sa jeho úprava odmietne.

Požiadajte agenta, aby nové diagramy pomenúval s príponou `.erd`.
Názov bez prípony dostane príponu `.erd.json` a prieskumník súborov aplikácie Obsidian zobrazuje súbor `.erd.json` iba vtedy, keď je zapnutá možnosť Settings → Files and links → Detect all file extensions.

| Nastavenie | Predvolená hodnota | Účinok |
| --- | --- | --- |
| Coding agents | Zapnuté | Umožňuje serveru MCP agenta upravovať diagramy tohto trezoru cez lokálny soket alebo v systéme Windows cez pomenovanú rúru. Ak je vypnuté, agenti môžu diagramy trezoru stále čítať z disku, ale nikdy žiadny z nich nezapíšu bez vedomia jeho editora. |

Aplikácia Obsidian nainštalovaná z repozitára Flathub beží v izolovanom prostredí Flatpak, ku ktorému server nemá prístup.
Doplnok tam neobsluhuje žiadnych agentov a neudržiava žiadny súbor zámku, takže agent upravuje súbory na disku, dokonca aj diagram, ktorý máte otvorený.
Aplikácia Obsidian diagram znova načíta, ako to robí po každej zmene vykonanej mimo nej, a vaša úprava, ktorú ešte neuložila, ustúpi úprave agenta.
Doplnok na to upozorní pri každom otvorení trezoru, kým nevypnete možnosť Coding agents.

## Nastavenie IDE od JetBrains {#set-up-a-jetbrains-ide}

IDE od JetBrains obsluhuje diagramy každého projektu, ktorý je v ňom otvorený, a každý diagram otvorený v jeho editore ERD Editor.

1. Nainštalujte [doplnok ERD Editor](https://plugins.jetbrains.com/plugin/23594-erd-editor) vo verzii `1.0.0` alebo novšej. Vyžaduje IDE založené na platforme IntelliJ vo verzii `2025.2` alebo novšej, spustené v prostredí JetBrains Runtime.
2. Otvorte projekt a dôverujte mu. V projekte, ktorému IDE nedôveruje, napríklad v projekte otvorenom v bezpečnom režime, agenti diagramy čítajú, ale nikdy ich nemenia.
3. Nechajte možnosť Settings | Tools | ERD Editor → Coding agents začiarknutú. Predvolene je zapnutá a platí pre celé IDE.

Doplnok vo verzii `0.9.0` alebo `0.10.0` a server vo verzii `1.0.0` sa navzájom odmietnu a doplnok pred verziou `0.9.0` neobsluhuje žiadnych agentov – pozrite si časť [Aktualizácia](#updating).

IDE obsluhuje agentov od chvíle, keď sa otvorí prvý projekt, takže agent sa k diagramom projektu dostane ešte predtým, ako niektorý z nich otvoríte.

| Nastavenie | Predvolená hodnota | Účinok |
| --- | --- | --- |
| Coding agents | Zapnuté | Umožňuje serveru MCP agenta upravovať diagramy tohto IDE cez lokálny soket alebo v systéme Windows cez pomenovanú rúru. Ak je vypnuté, agenti môžu diagramy otvorených projektov stále čítať z disku, ale nikdy žiadny z nich nezmenia bez vedomia jeho editora. |

Stránka nastavení uvádza, kedy programovací agenti nie sú k dispozícii: v IDE bez JCEF (kde nemôže bežať ani ERD Editor), v IDE nainštalovanom ako balík Flatpak v systéme Linux a vtedy, keď sa jeho hub nepodarilo spustiť.
Vtedy IDE neudržiava žiadny súbor zámku a agent upravuje súbory na disku.
ERD Editor znova nenačíta diagram zmenený na disku, kým je otvorený, a vaša ďalšia úprava v ňom zapíše späť celý diagram a prepíše tak zmeny agenta, preto diagram najprv zatvorte.

## Vyskúšajte si to {#try-it}

1. Otvorte priečinok, v ktorom máte diagramy: vo VS Code ako pracovný priestor, ktorému dôverujete; v aplikácii Obsidian ako trezor; v IDE od JetBrains ako projekt, ktorému dôverujete.
2. Spustite agenta v tom istom priečinku a požiadajte ho bežnými slovami, napríklad _„Pridajte do schema.erd.json tabuľku reviews prepojenú s tabuľkami users a products“_.
3. Sledujte, ako sa zmena objaví na plátne. Vo VS Code uložte zmenu stlačením `Ctrl + S` (Windows/Linux) alebo `⌘ + S` (Mac), prípadne požiadajte agenta o uloženie. Aplikácia Obsidian a IDE od JetBrains ukladajú zmenu tak, ako ukladajú vaše vlastné úpravy, a ak agenta požiadate o uloženie, zapíše ju okamžite.

Diagram, ktorý ešte nie je otvorený, sa pri prvej úprave agenta otvorí v editore ERD Editor bez toho, aby prevzal fokus klávesnice.
Agent vytvorí nový dokument pomocou nástroja `erd_open_document` a názov bez prípony dostane príponu `.erd.json`.

## Aktualizácia {#updating}

Príkazy vyššie neuvádzajú žiadnu verziu, takže `npx` pri každom spustení servera agentom overí v npm, či existuje jeho novšia verzia.
Server, ktorý už beží, si ponechá svoju verziu, kým ho agent znova nespustí.

Pred pripojením server overí, akú verziu protokolu používa editor.
Ak sa verzie líšia, odmietne sa s kódom `protocolMismatch` každé volanie, ktoré sa dostane k tomuto editoru, vrátane čítania a nástroja `erd_list_documents`, a nič sa nezapíše.
Správa uvádza stranu, ktorú treba aktualizovať: server alebo ERD Editor v editore, čo je vo VS Code rozšírenie a v aplikácii Obsidian a v IDE od JetBrains doplnok.

Server vo verzii `1.0.0`, rozšírenie pre VS Code vo verzii `4.0.0` alebo novšej, doplnok pre Obsidian vo verzii `1.0.0` alebo novšej a doplnok pre JetBrains vo verzii `1.0.0` alebo novšej používajú protokol verzie 2.
Každý starší server používa protokol verzie 1 a rovnako aj každá staršia verzia editora, ktorá obsluhuje agentov: rozšírenie pre VS Code od verzie `3.0.0` po verziu `3.1.0`, doplnok pre Obsidian vo verziách `0.1.0` a `0.2.0` a doplnok pre JetBrains vo verziách `0.9.0` a `0.10.0`.
Takýto editor a server vo verzii `1.0.0` sa navzájom odmietnu a rovnako aj starší server a editor, ktorý používa protokol verzie 2.
Rozšírenie pre VS Code pred verziou `3.0.0` alebo doplnok pre JetBrains pred verziou `0.9.0` neobsluhuje vôbec žiadnych agentov, takže agent upravuje súbory na disku, dokonca aj diagram, ktorý je v ňom otvorený.

| Kombinácia | Koniec správy |
| --- | --- |
| Server vo verzii `1.0.0` s rozšírením alebo doplnkom, ktorý používa protokol verzie 1 | `Update the ERD Editor extension or plugin in the editor until its hub speaks protocol 2.` |
| Starší server s rozšírením alebo doplnkom, ktorý používa protokol verzie 2 | `Update the MCP server (npx -y @dineug/erd-editor-mcp@latest) until it speaks protocol 2.` |

Server a rozšírenie alebo doplnok aktualizujte spoločne.
ERD Editor aktualizujte aj všade, kde sa diagramy otvárajú.
Rozšírenie pre VS Code pred verziou `4.0.0`, doplnok pre Obsidian pred verziou `1.0.0` a doplnok pre JetBrains pred verziou `1.0.0` zobrazujú diagram, ktorý uložila novšia verzia alebo ktorý agent upravil na disku, bez ikon primárneho kľúča.
Pri uložení súboru zahodia jeho skupiny tabuliek a skripty karty Schéma SQL.
Rozšírenie pre VS Code pred verziou `3.1.0`, doplnok pre Obsidian pred verziou `0.2.0` a doplnok pre JetBrains pred verziou `0.10.0` pri uložení súboru zahodia aj akcie ON DELETE a ON UPDATE diagramu.
V aplikácii Obsidian po aktualizácii doplnku reštartujte aplikáciu: dovtedy okno trezoru naďalej spúšťa ERD Editor z tej verzie doplnku, ktorú načítalo ako prvú.
