---
sidebar_position: 3
description: Jak serwer MCP wybiera między edycją na żywo w edytorze (VS Code, Obsidian lub IDE JetBrains) a edycją pliku na dysku oraz jak w każdym z tych trybów działają zapisywanie, cofanie i zamknięcie edytora.
---

# Tryby Live i Headless

Przy każdym wywołaniu serwer szuka edytora, do którego należy dokument, za pomocą plików blokady, które edytory utrzymują w katalogu `~/.erd-editor/ide/`.
Każde okno VS Code i każde okno sejfu aplikacji Obsidian z ERD Editor utrzymuje jeden taki plik, a IDE JetBrains utrzymuje jeden dla całego IDE, z listą wszystkich otwartych w nim projektów.
Edytor usuwa swój plik blokady, gdy zostaje zamknięty.
To, co serwer znajdzie, decyduje, dokąd trafia zmiana.

| Co serwer znajduje | Co robi zmiana |
| --- | --- |
| Edytor, którego obszar roboczy, sejf lub otwarty projekt zawiera dokument albo w którym dokument jest otwarty | **Live.** W razie potrzeby otwiera dokument w ERD Editor, dołącza do sesji edycji i tam stosuje zmianę. Zmiany pojawiają się od razu i są zapisywane tak, jak edytor zapisuje twoje – zobacz sekcję [Zapisywanie](#saving). |
| Brak edytora | **Headless.** Wczytuje plik, stosuje zmianę i zastępuje plik, zanim zwróci odpowiedź, więc wynik podaje `saved: true`, a narzędzie `erd_save` nie ma nic do zrobienia. |
| Edytor z wyłączonym hubem | **Odrzucenie.** Odczyty nadal działają, ale korzystają z dysku. Zmianę zapisaną w pliku otwartym w edytorze mógłby nadpisać następny zapis tego edytora, więc serwer niczego nie zapisuje. |
| Edytor z włączonym hubem, który jednak używa innego protokołu niż serwer: przy serwerze w wersji `1.0.0` lub nowszej rozszerzenie VS Code w wersji `3.x`, wtyczka Obsidian w wersji `0.x` lub wtyczka JetBrains w wersji `0.9.0` albo `0.10.0`; przy serwerze w wersji starszej niż `1.0.0` rozszerzenie w wersji `4.0.0` lub nowszej albo wtyczka w wersji `1.0.0` lub nowszej | **Odrzucenie**, także odczytów, z kodem `protocolMismatch`. Komunikat wskazuje stronę, którą trzeba zaktualizować: rozszerzenie lub wtyczkę albo serwer – zobacz sekcję [Aktualizacja](./installation.md#updating). |
| W systemie Windows edytor, który ma dokument pod inną ścieżką prowadzącą do tego samego pliku: agent wskazał go przez udział sieciowy lub zmapowany dysk tego komputera, np. `\\localhost\C$\…`, a edytor ma go pod ścieżką z literą dysku, albo odwrotnie | **Odrzucenie**, także odczytów, z kodem `invalidPath`. Komunikat podaje ścieżkę, pod którą edytor ma dokument; wywołaj ponownie z tą ścieżką. |
| W systemie Windows edytor, do którego Windows nie dopuszcza agenta: edytor uruchomiony jako administrator, gdy agent nie został tak uruchomiony, albo dowolny edytor, gdy agent działa w piaskownicy | **Odrzucenie**, także odczytów, z kodem `hubUnreachable` i komunikatem, który podaje przyczynę. Uruchom edytor i agenta z tymi samymi uprawnieniami, na przykład uruchamiając edytor ponownie bez uprawnień administratora. |

Wynik zmiany podaje tryb, w którym została wykonana, `live` lub `headless`, a odrzucona zmiana podaje przyczynę.
Wyszukiwanie odbywa się od nowa przy każdym wywołaniu, więc otwarcie lub zamknięcie edytora odpowiednio przekierowuje następne wywołanie.

Gdy dokument należy do więcej niż jednego edytora, edytor, w którym dokument jest otwarty, wygrywa z takim, który jedynie obsługuje zawierający go folder, a spośród tych, które obsługują folder, wygrywa ten, którego folder leży najgłębiej.
Przy remisie, na przykład gdy dokument jest otwarty w dwóch edytorach, wygrywa ten, którego plik blokady zmienił się jako ostatni.
Dlatego dokument w sejfie aplikacji Obsidian znajdującym się w folderze obszaru roboczego VS Code trafia do aplikacji Obsidian, chyba że jest otwarty w VS Code, a w aplikacji Obsidian nie.

Wywołania dotyczące jednego dokumentu są wykonywane pojedynczo, w kolejności, w jakiej dotarły do serwera. Wywołania dotyczące różnych dokumentów są wykonywane równolegle.

## Live {#live}

Agent dołącza do edytora jak kolejny współpracownik.
Jego zmiany od razu docierają do każdego edytora, w którym otwarty jest dokument, a jego fokus jest rysowany na edytowanej przez niego tabeli i komórce, tak jak fokus współpracownika – zobacz sekcję [focusTracker](../api/advanced/collaborative-editing.md#focustracker).

Odczyt nigdy nie otwiera edytora. Zmiana otwiera dokument w ERD Editor, jeśli nie jest on jeszcze otwarty, bez przejmowania fokusu klawiatury.

Edytor z rozszerzeniem VS Code w wersji starszej niż `4.2.0` albo z wtyczką Obsidian lub JetBrains w wersji starszej niż `1.2.0` nadal przyjmuje zmiany agenta na żywo, ale ani nie wyświetla, ani nie zachowuje nazw logicznych, powiązań z domeną i wierszy słowników zapisywanych przez agenta – zobacz sekcję [Aktualizacja](./installation.md#updating).

### Zapisywanie {#saving}

Każdy edytor zapisuje zmiany agenta tak, jak zapisuje twoje.

W VS Code zmiany agenta, tak jak twoje, oznaczają kartę jako zmodyfikowaną i trafiają na dysk dopiero po zapisaniu dokumentu.
Narzędzie `erd_save` zapisuje go za pośrednictwem VS Code, tak jak robi to polecenie zapisu samego VS Code. Zamiast tego możesz zapisać go samodzielnie za pomocą skrótu `Ctrl + S` (Windows/Linux) lub `⌘ + S` (Mac).
Zamknięcie edytora z niezapisanymi zmianami agenta wywołuje pytanie, czy je zapisać, tak jak przy każdej innej niezapisanej zmianie.

Obsidian zapisuje zmiany agenta około dwóch sekund po zakończeniu edycji, a zamknięcie karty zapisuje je bez pytania.
IDE JetBrains zapisuje je ułamek sekundy po zakończeniu edycji, a zamknięcie karty zapisuje to, co jeszcze czeka na zapis; karta nigdy nie jest oznaczana jako zmodyfikowana.
W obu przypadkach narzędzie `erd_save` zapisuje je od razu.

Narzędzie `erd_save` najpierw czeka maksymalnie dwie sekundy, aż w edytorze znajdzie się każda zmiana wprowadzona przez agenta.
Wywołanie jest odrzucane z kodem `notSaved`, gdy edytor nie mógł tego potwierdzić lub nie zapisał pliku: VS Code pozostawia kartę niezapisaną, gdy plik zmienił się na dysku, a IDE JetBrains nie mogło go zapisać, na przykład gdy było otwarte okno dialogowe lub gdy pliku nie da się zapisać.

W VS Code i IDE JetBrains narzędzie `erd_save` wywołane dla dokumentu, w którym nie ma już nic do zapisania, kończy się powodzeniem i pozostawia plik bez zmian.
Tak jest po zapisaniu każdej zmiany, co IDE JetBrains robi samoczynnie, i pozostaje tak, dopóki każda późniejsza zmiana należy do tych, których [blokada](../guide/guides/settings.md#lock) nie dopuszcza do pliku, na przykład przewijanie lub powiększanie przy zablokowanej opcji `Viewport`, przełączanie kart przy zablokowanej opcji `Canvas Type` albo przełączanie ustawienia [Widok nazw](../guide/guides/logical-names.md#name-view) przy zablokowanej opcji `Name View`. Każda blokada jest domyślnie włączona.
Wywołanie dla pliku, którego IDE JetBrains nie może zapisać, jest odrzucane nawet wtedy.

Gdy edytor zamknie dokument po ostatniej zmianie agenta, następne wywołanie agenta zawiera uwagę, że te zmiany są w pliku tylko wtedy, gdy zostały zapisane przed zamknięciem edytora.

### Cofanie {#undo}

Narzędzie `erd_undo` cofa ostatnią zmianę wprowadzoną przez agenta, nigdy twoją, a `erd_redo` stosuje ją ponownie.
Polecenie [Cofnij](../guide/guides/undo-redo.md) samego edytora działa odwrotnie: cofa twoje zmiany, a nigdy zmian agenta, ponieważ zmiany przychodzące z innego edytora nie są rejestrowane w twojej historii.

Kilka zmian nie tworzy wpisu w historii cofania edytora: `erd_set_database` i `erd_set_database_name` spośród [narzędzi ustawień](./tools.md#settings) oraz `erd_resize_memo`.
Nie tworzy go też wywołanie `erd_move_table_group`, które przesuwa grupę łącznie o mniej niż 20 pikseli, licząc razem przesunięcie w poziomie i w pionie, choć grupa pozostaje tam, gdzie została przesunięta.
Nie tworzy go również wywołanie, które niczego nie zmienia: `erd_set_column_primary_key`, `erd_set_column_unique`, `erd_set_column_not_null`, `erd_set_column_auto_increment`, `erd_set_index_unique` lub `erd_set_index_column_order` ustawiające wartość, którą dokument już ma; `erd_add_index_column` z kolumną, która już jest w indeksie; `erd_set_table_group` z tabelami, które już są w tej grupie (lub już nie należą do żadnej, przy argumencie `groupId` o wartości `null`); `erd_move_table_group` do punktu, w którym grupa już się znajduje; `erd_resize_table_group` do prostokąta, który grupa już ma; `erd_sort_tables` w dokumencie bez tabel; `erd_set_table_logical_name` lub `erd_set_column_logical_name` z nazwą logiczną, którą tabela lub kolumna już ma, gdy generowanie na jej podstawie niczego by nie zmieniło; `erd_set_column_domain` z domeną, z którą kolumna jest już powiązana, gdy kolumna ma już typ tej domeny, a [Synchronizacja typu danych w relacjach](../guide/guides/settings.md#relationship-datatype-sync) nie zmieniłaby typu żadnej kolumny wzdłuż jej relacji; `erd_update_word`, `erd_update_term` lub `erd_update_domain` wyłącznie z wartościami, które wiersz już ma, chyba że terminowi bez nazwy fizycznej przekazano argument `name`, a jego słowa składają się na nazwę fizyczną; `erd_derive_physical_names`, gdy każda objęta nim nazwa z nazwą logiczną ma już wartość, którą nadają jej [słowniki](./tools.md#dictionaries), i jest oznaczona jako wygenerowana; albo import z argumentem `mode` o wartości `append`, który nie dodaje żadnej tabeli (w przypadku `erd_import_json` żadnej tabeli ani notatki).
Narzędzie `erd_undo` pomija takie wywołania i wymienia je w swoim wyniku.
Inne zmiany, takie jak `erd_change_relationship_type`, `erd_change_relationship_on_delete`, `erd_change_relationship_on_update`, `erd_change_table_group_name`, `erd_change_table_group_color` i `erd_set_ddl_script`, tworzą wpis nawet wtedy, gdy ustawiają wartość, którą dokument już ma.

Historia cofania agenta kończy się, o czym informuje uwaga w wyniku, gdy:

- Agent ponownie dołącza do dokumentu, na przykład po tym, jak edytor go z niego odłączył.
- Edytor kończy działanie albo zamyka dokument i przestaje go obsługiwać, a agent dalej edytuje plik na dysku.
- Edytor przejmuje dokument, który agent edytował na dysku.

Serwer zamyka też dokument, dla którego agent od 30 minut nie wykonał żadnego wywołania, a historia cofania znika razem z nim, bez żadnej uwagi.

### Gdy edytor zostanie zamknięty {#when-the-editor-goes-away}

Dopóki dokument należy do edytora, serwer nigdy samoczynnie nie przełącza się na plik.
Jeśli połączenie zostanie zerwane, serwer łączy się ponownie.
Dopiero gdy edytor zakończył działanie albo zamknął dokument i nie wymienia już ani jego, ani zawierającego go folderu, serwer edytuje plik i informuje o tym w wyniku.
Dzieje się tak, gdy zamkniesz diagram leżący poza wszystkimi folderami, które obsługuje edytor (w VS Code diagram otwarty spoza obszaru roboczego), gdy wyłączysz wtyczkę ERD Editor w aplikacji Obsidian oraz gdy w IDE JetBrains zamkniesz projekt, do którego należy dokument, lub wyłączysz tam wtyczkę.
Zamknięty diagram w folderze obsługiwanym przez edytor pozostaje przy edytorze, a następna zmiana agenta ponownie go otwiera.

Edytor, który nadal działa, ale którego plik blokady zniknął, a połączenie zostało zamknięte, choć edytor nie zamknął dokumentu, odrzuca następną zmianę z kodem `hubGone`.
Komunikat podaje, co zwalnia dokument: w VS Code przeładuj to okno albo je zamknij, aby agent mógł edytować plik bezpośrednio; w aplikacji Obsidian ponownie włącz wtyczkę ERD Editor albo zamknij to okno; w IDE JetBrains ponownie włącz wtyczkę albo zamknij IDE.

W dwóch przypadkach odczyt korzysta zamiast tego z pliku na dysku, z uwagą, że brakuje w nim zmian jeszcze niezapisanych w edytorze: gdy edytor, do którego należy dokument, ma wyłączony hub, oraz w opisanym wyżej przypadku `hubGone`.
Odczyt, który nie może połączyć się z hubem edytora, jest odrzucany z kodem `hubUnreachable`, tak jak zmiana.

## Headless {#headless}

Gdy żaden edytor nie obsługuje dokumentu, każda edycja wczytuje plik, stosuje zmianę i zapisuje plik z powrotem, zanim zwróci odpowiedź, więc jej wynik podaje `saved: true` – zobacz sekcję [Wyniki](./tools.md#results).
Zapis trafia do pliku tymczasowego obok dokumentu, o nazwie `.<name>.<id>.tmp`, który następnie go zastępuje, dzięki czemu dokument nigdy nie pozostaje zapisany do połowy, z wyjątkiem opisanego niżej przypadku zapisu w miejscu w systemie Windows.

Przed tym ostatnim krokiem serwer sprawdza, czy plik zmienił się na dysku w trakcie wywołania.
Jeśli tak, nic nie jest zapisywane, plik jest wczytywany ponownie, a wywołanie zostaje odrzucone z kodem `conflict`. Agent wywołuje narzędzie ponownie.
Plik, który zmienił się między dwoma wywołaniami, jest po prostu wczytywany ponownie, a historia cofania agenta sprzed tego momentu przepada.

Plik tylko do odczytu pozostaje nietknięty, a edycja jest odrzucana z kodem `readonly`: chodzi o plik bez uprawnienia do zapisu dla właściciela lub, w systemie Windows, z atrybutem tylko do odczytu, na przykład plik Perforce lub TFVC, który nie został wyewidencjonowany.
Umożliw zapis do pliku, a potem wywołaj ponownie. Odczyty nadal działają.

Jeśli edytor zacznie obsługiwać dokument, gdy agent edytuje go na dysku, ta jedna zmiana jest odrzucana z kodem `hubAppeared` i nic nie zostaje zapisane. Następne wywołanie wprowadza zmianę przez edytor.

W systemie Windows obowiązują jeszcze dwie reguły:

- Dokument z własnymi uprawnieniami, innymi niż uprawnienia jego folderu, jest zapisywany w miejscu, a nie zastępowany, aby je zachował, a plik tymczasowy jest potem usuwany. Program, który odczytuje dokument podczas tego zapisu, może natrafić na tekst, którego nie da się sparsować.
- Pliku, który inny program ma otwarty, nie można zastąpić, więc serwer ponawia próby przez maksymalnie dwie sekundy. Każda próba najpierw ponownie szuka edytora, a edytor, który w międzyczasie zaczął obsługiwać dokument, odrzuca zapis z kodem `hubAppeared` albo, gdy jego hub jest wyłączony, z kodem `blocked`. Jeśli po dwóch sekundach plik nadal jest zajęty, nic nie jest zapisywane, plik jest wczytywany ponownie, a wywołanie kończy się niepowodzeniem z komunikatem cytującym błąd systemowy.

Serwer w wersji starszej niż `1.1.0` odczytuje dokument bez jego nazw logicznych, powiązań jego kolumn z domenami oraz jego słów, terminów i domen, więc pierwsza zmiana, którą zapisze w pliku, je pomija. Zaktualizuj serwer – zobacz sekcję [Aktualizacja](./installation.md#updating).

## Odrzucenie {#refused}

Okno VS Code utrzymuje swój plik blokady nawet przy wyłączonym hubie: gdy ustawienie `dineug.erd-editor.agentHub.enabled` jest wyłączone, gdy obszar roboczy nie jest zaufany lub gdy jego hub nie mógł rozpocząć nasłuchiwania.
Okno sejfu aplikacji Obsidian utrzymuje swój plik blokady przy wyłączonym hubie, gdy opcja Coding agents jest wyłączona oraz gdy jego hub nie mógł rozpocząć nasłuchiwania.
IDE JetBrains utrzymuje swój plik blokady przy wyłączonym hubie, gdy opcja Coding agents jest wyłączona, gdy jego hub nie mógł rozpocząć nasłuchiwania oraz gdy IDE kończy działanie.

Zmiana takiego dokumentu jest odrzucana z kodem `blocked`, ponieważ otwarty edytor mógłby przy następnym zapisie nadpisać zmianę zapisaną w pliku.
Odczyty nadal działają, ale korzystają z pliku na dysku.

Aby agent mógł edytować, ponownie włącz hub zgodnie z komunikatem dla danego edytora: w VS Code zaufaj obszarowi roboczemu i włącz ustawienie albo przeładuj okno; w aplikacji Obsidian włącz opcję Coding agents albo przeładuj aplikację Obsidian; w IDE JetBrains włącz opcję Coding agents albo, jeśli jest już włączona, uruchom ponownie IDE.

IDE JetBrains odmawia też, z kodem `hubDisabled`, zmiany dokumentu należącego wyłącznie do projektów, którym nie ufa.
Agenci nadal mogą odczytywać taki dokument, a narzędzie `erd_list_documents` wymienia go jako `readonly`. Zaufaj projektowi, a potem wywołaj ponownie.

Edytor, który nie utrzymuje pliku blokady, niczego nie chroni, a agent edytuje plik na dysku, nawet gdy diagram jest w nim otwarty.
Dotyczy to aplikacji Obsidian lub IDE JetBrains zainstalowanych jako pakiet Flatpak w systemie Linux, IDE JetBrains bez JCEF oraz IDE JetBrains, którego hub nie mógł się uruchomić – zobacz sekcje [Konfiguracja aplikacji Obsidian](./installation.md#set-up-obsidian) i [Konfiguracja IDE JetBrains](./installation.md#set-up-a-jetbrains-ide).
Rozszerzenie VS Code w wersji starszej niż `3.0.0` i wtyczka JetBrains w wersji starszej niż `0.9.0` również go nie utrzymują, ponieważ nie mają huba.

## Dokumenty {#documents}

Dokument wskazuje się argumentem `path`, czyli ścieżką bezwzględną lub względną wobec katalogu roboczego serwera.

- Nowe dokumenty mają rozszerzenie `.erd.json`. Narzędzie `erd_open_document` z argumentem `create` tworzy plik, dodając rozszerzenie `.erd.json` do nazwy bez rozszerzenia. Podobnie jak nowy diagram w edytorze, nowy dokument ma włączoną każdą [blokadę](../guide/guides/settings.md#lock), więc przewijanie, powiększanie, przełączanie kart, przełączanie Widoku nazw lub wybór innego języka Generatora kodu, stylu nazw albo typu cudzysłowu w edytorze nigdy nie zmienia pliku. Żadne narzędzie nie włącza ani nie wyłącza pojedynczej blokady: robisz to na karcie Ustawienia w edytorze. Narzędzie `erd_import_json` w trybie `replace` zastępuje je wszystkie blokadami dokumentu, który wczytuje – zobacz sekcję [Import](./tools.md#import).
- Otwierają się również istniejące pliki `.erd`, `.vuerd` i `.vuerd.json`. Ścieżka z dowolnym innym rozszerzeniem jest odrzucana z kodem `invalidPath`.
- W systemie Windows ścieżka zawierająca nazwę, której Windows nie zapisuje w podanej postaci, jest odrzucana z kodem `invalidPath`, zanim dokument zostanie odczytany lub zapisany, także przy odczytach: nazwa z dwukropkiem lub innym znakiem, którego Windows nie akceptuje, na przykład `orders:v2.erd`; nazwa urządzenia, na przykład `NUL.erd` lub `CON.erd`, pisana dowolną wielkością liter; albo nazwa kończąca się kropką lub spacją. Zmień nazwę pliku, na przykład używając `-` zamiast `:`.
- Plik, który nie jest dokumentem możliwym do odczytania przez edytor, na przykład plik z pozostawionymi znacznikami konfliktu scalania, jest odrzucany z kodem `invalidDocument` i pozostaje nietknięty. Nigdy nie jest wczytywany jako pusty diagram i zapisywany z powrotem.

Agent zmienia dokument wyłącznie za pomocą narzędzi i ma polecenie, aby nigdy samodzielnie nie zapisywać pliku.

Narzędzie `erd_list_documents` wyświetla listę dokumentów z polami `path`, `open`, `active`, `dirty` i `readonly`.
Odpytuje edytor, który obsługuje katalog roboczy, wybrany tak samo jak w przypadku dokumentu, i wymienia otwarte w nim diagramy, a następnie obsługiwane przez niego pliki ERD: te w folderach obszaru roboczego okna VS Code, w sejfie aplikacji Obsidian lub w każdym projekcie otwartym w IDE JetBrains.
W przeciwnym razie wymienia pliki ERD w katalogu roboczym, przy czym plik tylko do odczytu jest oznaczony jako `readonly`, a w systemie Windows nazwa, której Windows nie zapisuje w podanej postaci, jest pomijana.
