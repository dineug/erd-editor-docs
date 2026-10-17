---
sidebar_position: 2
description: Rejestracja serwera @dineug/erd-editor-mcp w Claude Code, Codex lub dowolnym innym kliencie MCP oraz konfiguracja VS Code, aplikacji Obsidian lub IDE JetBrains do edycji na żywo.
---

# Instalacja

Serwer jest opublikowany w npm jako pakiet `@dineug/erd-editor-mcp`.
To jeden samodzielny plik bez zależności czasu wykonania, a `npx` pobiera go, gdy agent uruchamia go po raz pierwszy, więc nie trzeba instalować niczego więcej.
Wymaga Node.js w wersji `22.12` lub nowszej.

Aby agent mógł edytować diagram na żywo, skonfiguruj też edytor, w którym ten diagram się znajduje: [VS Code](#set-up-vs-code), [Obsidian](#set-up-obsidian) lub [IDE JetBrains](#set-up-a-jetbrains-ide).
Jeśli żaden edytor nie obsługuje dokumentu, agent edytuje plik na dysku – zobacz stronę [Tryby Live i Headless](./live-and-headless.md).

## Claude Code {#claude-code}

Uruchom w folderze projektu:

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

Dodaj opcję `--scope project` przed opcją `--transport`, aby zamiast tego zapisać serwer w pliku `.mcp.json` projektu, z którego skorzysta każdy, kto sklonuje projekt.

## Codex {#codex}

Uruchom raz. Codex CLI, aplikacja Codex i rozszerzenie Codex dla IDE korzystają z tego samego ustawienia:

```sh
codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp
```

Możesz też dodać serwer do pliku `~/.codex/config.toml` lub do pliku `.codex/config.toml` w zaufanym projekcie:

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## Dowolny inny klient MCP {#any-other-mcp-client}

Uruchom `npx -y @dineug/erd-editor-mcp` jako serwer stdio: poleceniem jest `npx`, a argumentami `-y` i `@dineug/erd-editor-mcp`.

Serwer rozwiązuje względną ścieżkę dokumentu w odniesieniu do swojego katalogu roboczego, więc uruchom go w folderze projektu.
Obsługuje protokół MCP w wersjach `2025-06-18`, `2025-03-26` i `2024-11-05`, a klientowi korzystającemu z nowszej wersji odpowiada wersją `2025-06-18`.

## Konfiguracja VS Code {#set-up-vs-code}

Okno VS Code obsługuje diagramy w folderach swojego obszaru roboczego oraz każdy diagram w nim otwarty.

1. Zainstaluj [rozszerzenie ERD Editor](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) w wersji `4.0.0` lub nowszej. Wymaga ono VS Code w wersji `1.101.0` lub nowszej.
2. Otwórz folder projektu i zaufaj obszarowi roboczemu. Rozszerzenie obsługuje agentów tylko w zaufanym obszarze roboczym.
3. Pozostaw włączone ustawienie `dineug.erd-editor.agentHub.enabled`. Jest ono domyślnie włączone.

Rozszerzenie od wersji `3.0.0` do `3.1.0` i serwer `1.0.0` odrzucają się nawzajem, a rozszerzenie w wersji starszej niż `3.0.0` nie obsługuje agentów – zobacz sekcję [Aktualizacja](#updating).

Rozszerzenie uruchamia się w obszarze roboczym, który zawiera pliki `.erd`, `.erd.json`, `.vuerd` lub `.vuerd.json`, więc agent ma dostęp do tych diagramów, zanim którykolwiek otworzysz.
W obszarze roboczym bez żadnego z nich uruchamia się, gdy otworzysz diagram, a do tego czasu agent wprowadza zmiany na dysku.

| Ustawienie | Wartość domyślna | Działanie |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | Pozwala serwerowi MCP agenta edytować dokumenty tego okna przez lokalne gniazdo, a w systemie Windows przez potok nazwany. Gdy ustawienie jest wyłączone lub obszar roboczy nie jest zaufany, agenci nadal mogą odczytywać diagramy okna z dysku, ale nigdy nie zapisują żadnego z nich z pominięciem jego edytora. |

## Konfiguracja aplikacji Obsidian {#set-up-obsidian}

Okno sejfu aplikacji Obsidian obsługuje diagramy ze swojego sejfu.

1. Zainstaluj [wtyczkę ERD Editor](https://community.obsidian.md/plugins/erd-editor) w wersji `1.0.0` lub nowszej z sekcji Community plugins i włącz ją. Działa ona tylko w aplikacji desktopowej i wymaga aplikacji Obsidian w wersji `1.5.7` lub nowszej.
2. Pozostaw włączoną opcję Settings → ERD Editor → Coding agents. Jest ona domyślnie włączona, a każdy sejf przechowuje własne ustawienie.

Wcześniejsza wersja wtyczki i serwer `1.0.0` odrzucają się nawzajem – zobacz sekcję [Aktualizacja](#updating).

Okno sejfu obsługuje agentów od chwili załadowania wtyczki, więc agent ma dostęp do diagramów sejfu, zanim którykolwiek otworzysz.
Nie ma tu etapu nadawania zaufania.
Pliku, którego sejf nie wyświetla na liście, na przykład pliku w folderze o nazwie zaczynającej się od kropki, nie można otworzyć w ERD Editor, więc zmiana w nim jest odrzucana.

Poproś agenta, aby nadawał nowym diagramom nazwy z rozszerzeniem `.erd`.
Nazwa bez rozszerzenia otrzymuje rozszerzenie `.erd.json`, a eksplorator plików aplikacji Obsidian wyświetla plik `.erd.json` tylko wtedy, gdy włączona jest opcja Settings → Files and links → Detect all file extensions.

| Ustawienie | Wartość domyślna | Działanie |
| --- | --- | --- |
| Coding agents | Włączone | Pozwala serwerowi MCP agenta edytować diagramy tego sejfu przez lokalne gniazdo, a w systemie Windows przez potok nazwany. Gdy ustawienie jest wyłączone, agenci nadal mogą odczytywać diagramy sejfu z dysku, ale nigdy nie zapisują żadnego z nich z pominięciem jego edytora. |

Aplikacja Obsidian zainstalowana z serwisu Flathub działa w piaskownicy Flatpak, do której serwer nie ma dostępu.
Wtyczka nie obsługuje tam agentów i nie utrzymuje pliku blokady, więc agent edytuje pliki na dysku, nawet diagram, który masz otwarty.
Aplikacja Obsidian przeładowuje diagram, tak jak po każdej zmianie wprowadzonej poza nią, a twoja zmiana, której jeszcze nie zapisała, ustępuje miejsca zmianie agenta.
Wtyczka informuje o tym przy każdym otwarciu sejfu, dopóki nie wyłączysz opcji Coding agents.

## Konfiguracja IDE JetBrains {#set-up-a-jetbrains-ide}

IDE JetBrains obsługuje diagramy każdego otwartego w nim projektu oraz każdy diagram otwarty w jego ERD Editor.

1. Zainstaluj [wtyczkę ERD Editor](https://plugins.jetbrains.com/plugin/23594-erd-editor) w wersji `1.0.0` lub nowszej. Wymaga ona IDE opartego na IntelliJ w wersji `2025.2` lub nowszej, działającego w środowisku JetBrains Runtime.
2. Otwórz projekt i zaufaj mu. W projekcie, któremu IDE nie ufa, na przykład otwartym w trybie bezpiecznym, agenci odczytują diagramy, ale nigdy ich nie zmieniają.
3. Pozostaw zaznaczoną opcję Settings | Tools | ERD Editor → Coding agents. Jest ona domyślnie włączona i dotyczy całego IDE.

Wtyczka w wersji `0.9.0` lub `0.10.0` i serwer `1.0.0` odrzucają się nawzajem, a wtyczka w wersji starszej niż `0.9.0` nie obsługuje agentów – zobacz sekcję [Aktualizacja](#updating).

IDE obsługuje agentów od chwili otwarcia pierwszego projektu, więc agent ma dostęp do diagramów projektu, zanim którykolwiek otworzysz.

| Ustawienie | Wartość domyślna | Działanie |
| --- | --- | --- |
| Coding agents | Włączone | Pozwala serwerowi MCP agenta edytować diagramy tego IDE przez lokalne gniazdo, a w systemie Windows przez potok nazwany. Gdy ustawienie jest wyłączone, agenci nadal mogą odczytywać diagramy otwartych projektów z dysku, ale nigdy nie zmieniają żadnego z nich z pominięciem jego edytora. |

Strona ustawień informuje, kiedy agenci kodujący są niedostępni: w IDE bez JCEF (w którym nie może działać również ERD Editor), w IDE zainstalowanym jako pakiet Flatpak w systemie Linux oraz wtedy, gdy nie udało się uruchomić jego huba.
W takich przypadkach IDE nie utrzymuje pliku blokady, a agent edytuje pliki na dysku.
ERD Editor nie przeładowuje diagramu zmienionego na dysku, gdy jest on otwarty, a twoja następna zmiana w nim zapisuje z powrotem cały diagram, nadpisując zmiany agenta, więc najpierw zamknij diagram.

## Wypróbuj {#try-it}

1. Otwórz folder ze swoimi diagramami: w VS Code jako obszar roboczy, któremu ufasz; w aplikacji Obsidian jako sejf; w IDE JetBrains jako projekt, któremu ufasz.
2. Uruchom agenta w tym samym folderze i poproś go zwykłymi słowami, na przykład _„Dodaj do schema.erd.json tabelę reviews powiązaną z users i products”_.
3. Obserwuj, jak zmiana pojawia się na kanwie. W VS Code zapisz ją skrótem `Ctrl + S` (Windows/Linux) lub `⌘ + S` (Mac) albo poproś agenta o zapisanie. Obsidian i IDE JetBrains zapisują zmianę tak, jak zapisują twoje własne zmiany, a poproszony o zapisanie agent zapisuje ją od razu.

Diagram, który nie jest jeszcze otwarty, otwiera się w ERD Editor przy pierwszej zmianie wprowadzonej przez agenta, nie przejmując fokusu klawiatury.
Agent tworzy nowy dokument za pomocą narzędzia `erd_open_document`, a nazwa bez rozszerzenia otrzymuje rozszerzenie `.erd.json`.

## Aktualizacja {#updating}

Powyższe polecenia nie podają wersji, więc `npx` przy każdym uruchomieniu serwera przez agenta sprawdza w npm, czy jest dostępna jego nowsza wersja.
Serwer, który już działa, zachowuje swoją wersję, dopóki agent nie uruchomi go ponownie.

Przed połączeniem serwer sprawdza, którą wersją protokołu posługuje się edytor.
Gdy wersje się różnią, każde wywołanie, które dociera do tego edytora, jest odrzucane z kodem `protocolMismatch`, łącznie z odczytami i narzędziem `erd_list_documents`, i nic nie zostaje zapisane.
Komunikat wskazuje stronę, którą należy zaktualizować: serwer albo ERD Editor w edytorze, czyli rozszerzenie w VS Code oraz wtyczkę w aplikacji Obsidian i w IDE JetBrains.

Serwer `1.0.0`, rozszerzenie VS Code w wersji `4.0.0` lub nowszej, wtyczka Obsidian w wersji `1.0.0` lub nowszej oraz wtyczka JetBrains w wersji `1.0.0` lub nowszej posługują się protokołem w wersji 2.
Każdy wcześniejszy serwer posługuje się protokołem w wersji 1, podobnie jak każda wcześniejsza wersja edytora obsługująca agentów: rozszerzenie VS Code od wersji `3.0.0` do `3.1.0`, wtyczka Obsidian w wersjach `0.1.0` i `0.2.0` oraz wtyczka JetBrains w wersjach `0.9.0` i `0.10.0`.
Taki edytor i serwer `1.0.0` odrzucają się nawzajem, podobnie jak wcześniejszy serwer i edytor posługujący się protokołem w wersji 2.
Rozszerzenie VS Code w wersji starszej niż `3.0.0` lub wtyczka JetBrains w wersji starszej niż `0.9.0` w ogóle nie obsługuje agentów, więc agent edytuje pliki na dysku, nawet diagram w nim otwarty.

| Kombinacja | Koniec komunikatu |
| --- | --- |
| Serwer `1.0.0` z rozszerzeniem lub wtyczką posługującą się protokołem w wersji 1 | `Update the ERD Editor extension or plugin in the editor until its hub speaks protocol 2.` |
| Wcześniejszy serwer z rozszerzeniem lub wtyczką posługującą się protokołem w wersji 2 | `Update the MCP server (npx -y @dineug/erd-editor-mcp@latest) until it speaks protocol 2.` |

Aktualizuj serwer razem z rozszerzeniem lub wtyczką.
Aktualizuj też ERD Editor wszędzie tam, gdzie otwiera się diagramy.
Rozszerzenie VS Code w wersji starszej niż `4.0.0`, wtyczka Obsidian w wersji starszej niż `1.0.0` i wtyczka JetBrains w wersji starszej niż `1.0.0` wyświetlają bez ikon klucza podstawowego diagram, który zapisała nowsza wersja albo który agent edytował na dysku.
Gdy zapisują plik, usuwają z niego grupy tabel i skrypty Schematu SQL.
Rozszerzenie VS Code w wersji starszej niż `3.1.0`, wtyczka Obsidian w wersji starszej niż `0.2.0` i wtyczka JetBrains w wersji starszej niż `0.10.0` podczas zapisywania pliku usuwają też z diagramu akcje ON DELETE i ON UPDATE.
Po zaktualizowaniu wtyczki uruchom ponownie aplikację Obsidian: do tego czasu okno sejfu nadal uruchamia ERD Editor z tej wersji wtyczki, którą załadowało jako pierwszą.
