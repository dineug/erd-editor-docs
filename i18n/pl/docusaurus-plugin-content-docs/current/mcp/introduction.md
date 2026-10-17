---
sidebar_position: 1
description: Pozwól agentowi kodującemu, takiemu jak Claude Code lub Codex, edytować diagramy erd-editor za pomocą serwera MCP @dineug/erd-editor-mcp, na żywo w VS Code, aplikacji Obsidian lub IDE JetBrains albo bezpośrednio na dysku.
---

# Wprowadzenie

`@dineug/erd-editor-mcp` to serwer MCP, który pozwala agentowi kodującemu edytować diagramy erd-editor.
Claude Code, Codex i każdy inny klient protokołu [Model Context Protocol](https://modelcontextprotocol.io) otrzymują po jednym narzędziu na każdą operację na dokumencie: dodanie tabeli, zmianę nazwy kolumny, powiązanie dwóch tabel relacją, zaimportowanie zrzutu DDL, odczytanie schematu z powrotem w postaci kodu SQL.

Gdy dokument jest otwarty w ERD Editor dla [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), [aplikacji Obsidian](https://community.obsidian.md/plugins/erd-editor) lub [IDE JetBrains](https://plugins.jetbrains.com/plugin/23594-erd-editor), agent dołącza do edytora jak współpracownik.
Każda zmiana pojawia się na kanwie w chwili, gdy następuje, a cofnięcie wykonane przez agenta wycofuje tylko jego własne zmiany.
VS Code pozostawia zmiany agenta niezapisane do chwili zapisu przez agenta lub przez ciebie, natomiast aplikacja Obsidian i IDE JetBrains zapisują je tak samo, jak zapisują twoje zmiany.
Gdy dokumentu nie obsługuje żaden edytor, te same narzędzia edytują sam plik.

![Dodawanie tabel i relacji do diagramu otwartego w VS Code przez agenta kodującego](/img/coding-agents.webp)

## Co potrafi agent {#what-an-agent-can-do}

- Tworzy lub zmienia schemat w trakcie rozmowy: tabele, kolumny i każdą opcję kolumny, relacje wraz z ich licznością oraz akcjami ON DELETE i ON UPDATE, indeksy, notatki, kolory i położenie na kanwie. Zobacz sekcję [Relacje](./tools.md#relationships).
- Zbiera tabele w [grupy tabel](../guide/guides/table-groups.md): dodaje grupę obejmującą wskazane przez siebie tabele lub obszar kanwy, a następnie zmienia jej nazwę, nadaje jej kolor, przenosi ją razem z jej tabelami, zmienia jej rozmiar, dodaje do niej tabele lub je z niej wyjmuje albo ją usuwa, co pozostawia jej tabele tam, gdzie są. Zobacz sekcję [Grupy tabel](./tools.md#table-groups).
- Zastępuje dokument schematem sparsowanym z kodu SQL DDL, GraphQL SDL, DBML lub AML albo innym dokumentem `.erd.json`. Może też dodać ten schemat lub dokument pod diagramem i zachować wszystko, co już się w nim znajduje, tak jak robi to pozycja [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) w edytorze. W obu przypadkach blok `TableGroup` formatu DBML staje się grupą tabel. Zobacz sekcję [Import](./tools.md#import).
- Odczytuje diagram z powrotem jako listę identyfikatorów, jako całe encje, jako tekst `.erd.json` taki sam, jaki trafia do pliku przy zapisie, lub jako kod DDL dla dowolnej z ośmiu baz danych, z opcjami `Statements` i `Header` karty [Schemat SQL](../guide/guides/schema-sql.md). W schemacie liczącym tysiące tabel odczytuje naraz jedną stronę, kilka tabel lub tabele kilku grup tabel. Zobacz sekcję [Odczyt dokumentu](./tools.md#reading-a-document).
- Ustawia bazę danych, nazwę bazy danych oraz [skrypty](../guide/guides/schema-sql.md#before-and-after-scripts) umieszczane w Schemacie SQL przed tabelami i po nich, takie jak `CREATE EXTENSION` przed nimi lub `GRANT` po nich. Narzędzie `erd_read` zwraca same skrypty albo skrypty w obrębie kodu DDL całego dokumentu. Zobacz sekcję [Ustawienia](./tools.md#settings).
- Wykonuje kilka zmian jako jedną, na zasadzie „wszystko albo nic”, a jedno cofnięcie ją wycofuje. Zobacz sekcję [erd_batch](./tools.md#erd_batch).
- Cofa i ponawia własne zmiany, nigdy twoje.

Czego agent nie robi:

- Zmiana powiększenia, przewijanie i przełączanie kart. Należą one do każdego oglądającego z osobna, więc żadne narzędzie tego nie robi. Import, który zastępuje dokument, mimo to przesuwa widok, nawet przy włączonej blokadzie `Viewport`, tak jak robi to pozycja `Import` w edytorze: z powrotem na początek kanwy przy powiększeniu 100% albo, w przypadku narzędzia `erd_import_json`, do widoku wczytywanego dokumentu, a także na jego kartę, chyba że ten dokument ma włączoną blokadę `Canvas Type`. Zobacz sekcję [Import](./tools.md#import).
- Zmiana przełączników [`View Option`](../guide/guides/table-related-functions.md#table-view-options), języka i stylów nazw w Generatorze kodu, typu cudzysłowu lub opcji `Relationship DataType Sync`, `Maximum comment width` i `Column Order` na karcie [Ustawienia](../guide/guides/settings.md). Ich ustawianie w edytorze należy do ciebie, a agent odczytuje je w postaci zapisanej w pliku.
- Włączanie i wyłączanie [blokady](../guide/guides/settings.md#lock). Blokady lub powyższe ustawienia zmienia wyłącznie narzędzie `erd_import_json`, gdy zastępuje cały dokument, i ustawia je na te z wczytywanego dokumentu. Dokument bez pola `lockSettings`, taki jak plik zapisany przez rozszerzenie VS Code w wersji starszej niż `4.0.0` albo przez wtyczkę Obsidian lub JetBrains w wersji starszej niż `1.0.0`, włącza wszystkie blokady. Cofnięcie dowolnego importu, który zastąpił dokument, przywraca ustawienia i blokady, jakie dokument miał wcześniej.
- Ponowne mapowanie relacji na inne kolumny, tak jak robi to okno dialogowe [`Map Columns`](../guide/guides/relationship-editing.md#map-columns). Zamiast tego agent usuwa relację, co pozostawia na miejscu jej kolumny klucza obcego, i łączy wybrane kolumny narzędziem `erd_link_columns`, w ramach jednego wywołania `erd_batch`, które można wycofać jednym cofnięciem.
- Uruchamianie Generatora kodu. Narzędzie `erd_read` zwraca kod DDL lub JSON, a agent sam pisze na tej podstawie kod.

## Jak to działa {#how-it-works}

Serwer to proces stdio uruchamiany przez klienta MCP.
Przy każdym wywołaniu szuka edytora, do którego należy dokument: okna VS Code, okna sejfu aplikacji Obsidian lub IDE JetBrains, w każdym przypadku z rozszerzeniem lub wtyczką ERD Editor.

- **Live** – edytor ma dokument w swoim obszarze roboczym, swoim sejfie lub jednym ze swoich otwartych projektów albo dokument jest w nim otwarty. Serwer dołącza do sesji edycji tego edytora, a zmiana trafia do edytora: w VS Code jako niezapisana, a w aplikacji Obsidian i IDE JetBrains zapisana tak, jak zapisywane są twoje zmiany.
- **Headless** – brak edytora. Serwer wczytuje plik, stosuje zmianę i zapisuje plik z powrotem.
- **Odrzucenie** – dokument należy do edytora, który ma wyłączony hub. Serwer odczytuje dane z dysku, ale niczego nie zapisuje, ponieważ otwarty edytor mógłby nadpisać plik przy swoim następnym zapisie. IDE JetBrains z włączonym hubem również odmawia zmiany dokumentu należącego wyłącznie do projektów, którym nie ufa, choć agent nadal może go odczytać. Gdy hub edytora jest włączony, ale jego rozszerzenie lub wtyczka ERD Editor używa innego protokołu huba niż serwer, każde wywołanie dotyczące dokumentu jest odrzucane, łącznie z odczytami, z kodem `protocolMismatch` i komunikatem, który wskazuje stronę do zaktualizowania – zobacz sekcję [Aktualizacja](./installation.md#updating).

Szczegóły opisano na stronie [Tryby Live i Headless](./live-and-headless.md).

## Wymagania {#requirements}

| | |
| --- | --- |
| Node.js | Wersja `22.12` lub nowsza, do uruchomienia serwera |
| Klient MCP | Claude Code, Codex lub dowolny klient, który potrafi uruchomić serwer stdio |
| VS Code, do edycji na żywo | Wersja `1.101.0` lub nowsza, z rozszerzeniem ERD Editor w wersji `4.0.0` lub nowszej |
| Obsidian, do edycji na żywo | Aplikacja desktopowa w wersji `1.5.7` lub nowszej, z wtyczką ERD Editor w wersji `1.0.0` lub nowszej |
| IDE JetBrains, do edycji na żywo | IDE oparte na IntelliJ w wersji `2025.2` lub nowszej, z wtyczką ERD Editor w wersji `1.0.0` lub nowszej |

Serwer w wersji `1.0.0` i powyższe wersje posługują się protokołem huba w wersji 2.
Wcześniejsze wersje obsługujące agentów posługują się protokołem w wersji 1: rozszerzenie VS Code od wersji `3.0.0` do `3.1.0`, wtyczka Obsidian w wersjach `0.1.0` i `0.2.0` oraz wtyczka JetBrains w wersjach `0.9.0` i `0.10.0`.
Taka wersja i serwer w wersji `1.0.0` wzajemnie się odrzucają, podobnie jak wcześniejsza wersja serwera i powyższe wersje – zobacz sekcję [Aktualizacja](./installation.md#updating).
Rozszerzenie VS Code w wersji starszej niż `3.0.0` lub wtyczka JetBrains w wersji starszej niż `0.9.0` nie ma huba, więc serwer nie widzi takiej wersji i edytuje plik na dysku, nawet jeśli diagram jest w niej otwarty.

Dalej: [Instalacja](./installation.md).
