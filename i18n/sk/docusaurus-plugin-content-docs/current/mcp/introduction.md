---
sidebar_position: 1
description: Úprava diagramov erd-editor programovacím agentom, napríklad Claude Code alebo Codex, prostredníctvom servera MCP @dineug/erd-editor-mcp, naživo vo VS Code, v aplikácii Obsidian či v IDE od JetBrains alebo priamo na disku.
---

# Úvod

`@dineug/erd-editor-mcp` je server MCP, ktorý programovaciemu agentovi umožňuje upravovať diagramy erd-editor.
Claude Code, Codex a akýkoľvek iný klient protokolu [Model Context Protocol](https://modelcontextprotocol.io) dostanú jeden nástroj pre každú operáciu s dokumentom: pridanie tabuľky, premenovanie stĺpca, prepojenie dvoch tabuliek vzťahom, import výpisu DDL, prečítanie schémy späť ako SQL.

Keď je dokument otvorený v rozšírení či doplnku ERD Editor pre [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), [Obsidian](https://community.obsidian.md/plugins/erd-editor) alebo [IDE od JetBrains](https://plugins.jetbrains.com/plugin/23594-erd-editor), agent sa k editoru pripojí ako spolupracovník.
Každá zmena sa na plátne zobrazí v okamihu, keď nastane, a vrátenie späť, ktoré vykoná agent, zruší iba jeho vlastné úpravy.
VS Code ponechá zmeny agenta neuložené, kým ich neuloží agent alebo kým ich neuložíte vy, zatiaľ čo aplikácia Obsidian a IDE od JetBrains ich ukladajú tak, ako ukladajú vaše vlastné.
Ak dokument nespravuje žiadny editor, tie isté nástroje upravujú samotný súbor.

![Programovací agent pri pridávaní tabuliek a vzťahov do diagramu otvoreného vo VS Code](/img/coding-agents.webp)

## Čo dokáže agent {#what-an-agent-can-do}

- Vytvoriť alebo zmeniť schému v rozhovore: tabuľky, stĺpce a všetky možnosti stĺpcov, vzťahy s ich kardinalitou a akciami ON DELETE a ON UPDATE, indexy, poznámky, farby a polohy na plátne. Pozrite si časť [Vzťahy](./tools.md#relationships).
- Zoskupiť tabuľky do [skupín tabuliek](../guide/guides/table-groups.md): pridať skupinu okolo tabuliek, ktoré vymenuje, alebo na oblasť plátna, potom ju premenovať, nastaviť jej farbu, presunúť ju spolu s jej tabuľkami, zmeniť jej veľkosť, vložiť do nej tabuľky či ich z nej vyňať alebo ju odstrániť, pričom jej tabuľky zostanú tam, kde sú. Pozrite si časť [Skupiny tabuliek](./tools.md#table-groups).
- Nahradiť dokument schémou načítanou zo SQL DDL, GraphQL SDL, DBML alebo AML, prípadne iným dokumentom `.erd.json`. Alebo túto schému či dokument pridať pod diagram a zachovať všetko, čo v ňom už je, rovnako ako to robí položka [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) v editore. Blok `TableGroup` z DBML sa v oboch prípadoch zmení na skupinu tabuliek. Pozrite si časť [Import](./tools.md#import).
- Prečítať diagram späť ako zoznam identifikátorov, ako celé entity, ako text súboru `.erd.json`, ktorý zapíše uloženie, alebo ako kód DDL pre ktorúkoľvek z ôsmich databáz s možnosťami `Statements` a `Header` karty [Schéma SQL](../guide/guides/schema-sql.md). Pri schéme s tisíckami tabuliek číta naraz vždy jednu stránku, niekoľko tabuliek alebo tabuľky niekoľkých skupín tabuliek. Pozrite si časť [Čítanie dokumentu](./tools.md#reading-a-document).
- Nastaviť databázu, názov databázy a [skripty](../guide/guides/schema-sql.md#before-and-after-scripts), ktoré karta Schéma SQL zapisuje pred tabuľky a za ne, napríklad `CREATE EXTENSION` pred nimi alebo `GRANT` za nimi. Nástroj `erd_read` vráti samotné skripty alebo skripty v rámci kódu DDL celého dokumentu. Pozrite si časť [Nastavenia](./tools.md#settings).
- Vykonať niekoľko úprav ako jednu, buď všetky, alebo žiadnu, pričom ich zruší jedno vrátenie späť. Pozrite si časť [erd_batch](./tools.md#erd_batch).
- Vrátiť späť a znova vykonať svoje vlastné úpravy, nikdy nie vaše.

Čo agent nerobí:

- Meniť priblíženie, posúvať zobrazenie alebo prepínať karty. To je vecou každého, kto dokument zobrazuje, preto to nerobí žiadny nástroj. Import, ktorý nahradí dokument, napriek tomu presunie zobrazenie, a to aj pri zamknutom nastavení `Viewport`, rovnako ako to robí položka `Import` v editore: späť na začiatok plátna s priblížením 100 % alebo v prípade nástroja `erd_import_json` na zobrazenie dokumentu, ktorý načíta, a ak tento dokument nemá zamknuté nastavenie `Canvas Type`, aj na jeho kartu. Pozrite si časť [Import](./tools.md#import).
- Meniť možnosti ponuky [`View Option`](../guide/guides/table-related-functions.md#table-view-options), jazyk a štýly názvov na karte Generátor kódu, typ úvodzoviek alebo možnosti `Relationship DataType Sync`, `Maximum comment width` a `Column Order` na karte [Nastavenia](../guide/guides/settings.md). Tie nastavujete vy v editore a agent ich číta tak, ako ich ukladá súbor.
- Zapnúť alebo vypnúť [zamknutie](../guide/guides/settings.md#lock). Zamknutia alebo vyššie uvedené nastavenia mení iba nástroj `erd_import_json`, keď nahrádza celý dokument, a to na tie z dokumentu, ktorý načíta. Dokument bez poľa `lockSettings`, napríklad súbor uložený rozšírením pre VS Code pred verziou `4.0.0` alebo doplnkom pre Obsidian či JetBrains pred verziou `1.0.0`, zapne všetky zamknutia. Vrátenie späť akéhokoľvek importu, ktorý nahradil dokument, obnoví nastavenia a zamknutia, ktoré mal dokument predtým.
- Namapovať vzťah na iné stĺpce, ako to robí dialógové okno [`Map Columns`](../guide/guides/relationship-editing.md#map-columns). Namiesto toho agent odstráni vzťah, pričom jeho stĺpce cudzieho kľúča zostanú na mieste, a požadované stĺpce prepojí nástrojom `erd_link_columns`, a to v jednom volaní `erd_batch`, ktoré zruší jedno vrátenie späť.
- Spustiť Generátor kódu. Nástroj `erd_read` odpovedá kódom DDL alebo JSON a agent z toho kód napíše sám.

## Ako to funguje {#how-it-works}

Server je proces stdio, ktorý spúšťa váš klient MCP.
Pri každom volaní hľadá editor, ktorý spravuje dokument: okno VS Code, okno trezoru aplikácie Obsidian alebo IDE od JetBrains, každé s rozšírením alebo doplnkom ERD Editor.

- **Live** – editor má dokument vo svojom pracovnom priestore, trezore či v jednom zo svojich otvorených projektov alebo ho má otvorený. Server sa pripojí k relácii úprav tohto editora a úprava sa vykoná v editore: vo VS Code zostane neuložená a v aplikácii Obsidian a v IDE od JetBrains sa uloží tak, ako sa ukladajú vaše vlastné úpravy.
- **Headless** – žiadny editor. Server načíta súbor, vykoná úpravu a súbor zapíše späť.
- **Odmietnuté** – editor spravuje dokument, ale má vypnutý hub. Server číta z disku, ale nezapíše nič, pretože otvorený editor by mohol súbor pri ďalšom uložení prepísať. IDE od JetBrains so zapnutým hubom tiež odmietne zmeniť dokument, ktorý spravujú iba projekty, ktorým nedôveruje, hoci ho agent stále môže čítať. Keď má editor zapnutý hub, ale jeho rozšírenie alebo doplnok ERD Editor používa iný protokol hubu ako server, odmietne sa každé volanie pre dokument vrátane čítania, a to s kódom `protocolMismatch` a so správou, ktorá uvádza stranu, ktorú treba aktualizovať – pozrite si časť [Aktualizácia](./installation.md#updating).

Podrobnosti nájdete na stránke [Live a Headless](./live-and-headless.md).

## Požiadavky {#requirements}

| | |
| --- | --- |
| Node.js | Verzia `22.12` alebo novšia na spustenie servera |
| Klient MCP | Claude Code, Codex alebo akýkoľvek klient, ktorý dokáže spustiť server stdio |
| VS Code na úpravy naživo | Verzia `1.101.0` alebo novšia s rozšírením ERD Editor vo verzii `4.0.0` alebo novšej |
| Obsidian na úpravy naživo | Desktopová aplikácia vo verzii `1.5.7` alebo novšej s doplnkom ERD Editor vo verzii `1.0.0` alebo novšej |
| IDE od JetBrains na úpravy naživo | IDE založené na platforme IntelliJ vo verzii `2025.2` alebo novšej s doplnkom ERD Editor vo verzii `1.0.0` alebo novšej |

Server vo verzii `1.0.0` a vyššie uvedené verzie používajú protokol hubu verzie 2.
Staršie verzie, ktoré obsluhujú agentov, používajú protokol verzie 1: rozšírenie pre VS Code od verzie `3.0.0` po verziu `3.1.0`, doplnok pre Obsidian vo verziách `0.1.0` a `0.2.0` a doplnok pre JetBrains vo verziách `0.9.0` a `0.10.0`.
Takáto verzia a server vo verzii `1.0.0` sa navzájom odmietnu a rovnako aj starší server a vyššie uvedené verzie – pozrite si časť [Aktualizácia](./installation.md#updating).
Rozšírenie pre VS Code staršie ako verzia `3.0.0` alebo doplnok pre JetBrains starší ako verzia `0.9.0` nemá hub, takže ho server nevidí a upravuje súbor na disku, a to aj vtedy, keď je v ňom diagram otvorený.

Ďalej: [Inštalácia](./installation.md).
