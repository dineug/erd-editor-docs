---
sidebar_position: 9
description: Wyszukiwanie nazw tabel, kolumn, indeksów i grup tabel, komentarzy oraz notatek z górnej części Eksploratora, przechodzenie przez dopasowania w jego drzewie i na kanwie oraz zamiana jednego dopasowania lub wszystkich.
---

# Znajdź i zamień

Wyszukuje tekst w całym diagramie, przenosi do każdego dopasowania na kanwie ERD i zamienia jedno dopasowanie lub wszystkie.  
Przeszukuje siedem rodzajów tekstu: nazwy tabel, komentarze tabel, nazwy kolumn, komentarze kolumn, notatki, nazwy indeksów i nazwy grup tabel – zobacz sekcję [Co jest przeszukiwane](#what-it-searches).

Znajduje się w górnej części panelu [Eksplorator](./explorer.md), zadokowanego po lewej stronie kanwy ERD, między paskiem tytułu Eksploratora a jego drzewem. Nie ma własnego tytułu. Od góry do dołu zawiera:

- Pole wyszukiwania z trzema [opcjami](#options) wewnątrz, przy jego końcu, oraz strzałkę `Toggle Replace` przed nim.
- Wiersz `Replace`, początkowo zwinięty – zobacz sekcję [Zamiana](#replacing).
- Licznik, za nim strzałki w górę i w dół, które przechodzą przez kolejne dopasowania, oraz przycisk `Search In` z trzema kropkami.
- [Rodzaje tekstu](#what-it-searches), które rozwija przycisk `Search In`.

Gdy pole wyszukiwania zawiera tekst, drzewo Eksploratora pokazuje dopasowania – zobacz sekcję [Wyniki](#the-results).  
Na niskiej kanwie wyszukiwanie zachowuje pełną wysokość, a drzewo pod nim zajmuje pozostałe miejsce i można je przewijać.

![Otwieranie funkcji Znajdź i zamień w Eksploratorze skrótem ⌘ + F, przechodzenie przez sześć dopasowań tekstu member, a następnie, z włączoną opcją Preserve Case, zamiana wszystkich sześciu na user (⌘ + Enter)](/img/demo-find-and-replace.webp)

## Otwieranie i zamykanie {#opening-and-closing}

Skrót `Ctrl + F` (Windows/Linux) lub `⌘ + F` (Mac) oraz polecenie `Toggle Explorer` w palecie [Szybkie wyszukiwanie](./quick-search.md) lub w menu kontekstowym kanwy otwierają wyszukiwanie w Eksploratorze. Kursor tekstowy przechodzi do pola wyszukiwania z zaznaczonym tekstem, a wyszukiwanie jest wykonywane ponownie i żadne dopasowanie nie jest bieżące.  
Przycisk `Explorer` na pasku narzędzi tylko otwiera lub zamyka panel. Nie umieszcza kursora tekstowego w polu wyszukiwania i pozostawia wyszukiwany tekst oraz bieżące dopasowanie bez zmian.  
Gdy skrót tylko przywraca kursor tekstowy do Eksploratora, który jest już widoczny, jak dzieje się to, gdy otwarte jest Szybkie wyszukiwanie lub jedno z pięciu okien dialogowych z sekcji [Okna dialogowe obok Eksploratora](./explorer.md#dialogs-beside-it), bieżące dopasowanie pozostaje bieżące.

Zamykanie Eksploratora, to, co robią skrót i obie pozycje `Toggle Explorer`, gdy Eksplorator jest otwarty, oraz zamykane przez nie okna dialogowe opisano w sekcji [Otwieranie i zamykanie](./explorer.md#opening-and-closing) na stronie Eksploratora.  
Sekcja [Kiedy Eksplorator ustępuje miejsca](./explorer.md#when-it-stands-aside) opisuje, jak ukrywają go inna karta i tryb zen oraz jak podgląd różnic, podróż w czasie i podgląd Automatycznego układu ukrywają go i nie pozwalają go otworzyć. Sekcja [Obok kanwy](./explorer.md#beside-the-canvas) opisuje edytor zbyt wąski dla Eksploratora.

Po ponownym otwarciu zachowany jest ostatni wyszukiwany tekst, a wraz z nim tekst zamiany, [opcje](#options), [rodzaje tekstu](#what-it-searches), które były włączone, oraz to, czy wiersz `Replace` i rodzaje tekstu były rozwinięte.  
Są one zachowywane, dopóki edytor pozostaje otwarty, i nie są zapisywane w dokumencie. Nowo otwarty edytor zaczyna ze wszystkimi opcjami wyłączonymi, ze zwiniętym wierszem `Replace` i zwiniętymi rodzajami tekstu oraz z włączonymi tylko czterema rodzajami nazw – zobacz sekcję [Co jest przeszukiwane](#what-it-searches).

## Pasek wyszukiwania przeglądarki {#the-browsers-find-bar}

Gdy edytor ma fokus klawiatury, skrót `Ctrl + F` (Windows/Linux) lub `⌘ + F` (Mac) należy do niego na każdej karcie, również w jego własnych polach tekstowych, więc pasek wyszukiwania przeglądarki się nie otwiera.  
Skrót trafia dalej do przeglądarki lub hosta, gdy otwarty jest podgląd różnic, podróż w czasie lub podgląd Automatycznego układu oraz gdy fokus jest poza edytorem.

- Aplikacja internetowa i Google Drive: pasek wyszukiwania przeglądarki otwiera się tylko w tych dwóch przypadkach.
- VS Code: rozszerzenie pozostawia własny widżet wyszukiwania VS Code wyłączony w edytorze ERD Editor, więc skrót nigdy go tam nie otwiera.
- Obsidian: skrót trafia do edytora zawsze, gdy aktywna jest karta diagramu, zamiast polecenia `Search current file` aplikacji Obsidian.
- IDE JetBrains: jeśli mapa klawiszy IDE zachowuje skrót `Ctrl + F` (Windows/Linux) lub `⌘ + F` (Mac) dla siebie, otwórz wyszukiwanie poleceniem `Toggle Explorer` w Szybkim wyszukiwaniu lub w menu kontekstowym kanwy albo otwórz Eksplorator przyciskiem `Explorer` na pasku narzędzi i kliknij pole wyszukiwania.

Strona osadzająca edytor może zmienić lub usunąć ten skrót – zobacz sekcję [Zmiana skrótu klawiaturowego](#changing-the-shortcut).

## Co jest przeszukiwane {#what-it-searches}

Siedem przycisków wybiera przeszukiwane rodzaje tekstu, w tej kolejności: `Table names`, `Table comments`, `Column names`, `Column comments`, `Memos`, `Index names` i `Table group names`.  
Początkowo są zwinięte. Przycisk `Search In` na końcu wiersza z licznikiem rozwija je pod tym wierszem i ponownie zwija, a gdy są widoczne, jest wyróżniony.  
Wyróżniony przycisk rodzaju tekstu jest włączony. Kliknij przycisk, aby go włączyć lub wyłączyć, a wyszukiwanie uruchomi się ponownie. Gdy wszystkie siedem przycisków jest wyłączonych, wyszukiwanie niczego nie znajduje.

Przy pierwszym otwarciu wyszukiwanie obejmuje cztery rodzaje nazw: `Table names`, `Column names`, `Index names` i `Table group names`, więc zmiana nazw nie sięga komentarzy ani notatek, chyba że je włączysz.  
Nazwy indeksów to nazwy indeksów na karcie `Indexes` panelu [Właściwości tabeli](./table-related-functions.md#indexes), a nie klucze `PK_` i `UQ_` wymienione nad nimi.

Nic więcej nie jest przeszukiwane: ani typy danych, ani wartości domyślne, ani kolumny indeksu, ani nazwa bazy danych, ani [Schemat SQL](./schema-sql.md) ze skryptami `Before tables` i `After tables`, ani wygenerowany kod.  
Komentarz ukryty przez [opcję widoku tabeli](./table-related-functions.md#table-view-options) nadal jest przeszukiwany. Notatki ukryte za pomocą View Option → `Memos` oraz [grupy tabel](./table-groups.md#hiding-groups) ukryte za pomocą View Option → `Table Groups` nie są przeszukiwane, nawet gdy ich przycisk jest włączony, więc operacja `Replace All` nigdy nie zmienia notatki ani nazwy grupy, których nie widzisz.

## Opcje {#options}

Trzy przełączniki wewnątrz pola wyszukiwania, przy jego końcu, zmieniają sposób dopasowywania wyszukiwanego tekstu. Ich nazwy podają podpowiedzi, a gdy są włączone, są wyróżnione. Wszystkie trzy są początkowo wyłączone, a zmiana któregokolwiek ponownie uruchamia wyszukiwanie.

- `Match Case`: gdy jest wyłączony, dopasowywanie odbywa się bez uwzględniania wielkości liter.
- `Match Whole Word`: dopasowanie liczy się tylko tam, gdzie po żadnej stronie nie przechodzi w dalszy ciąg wyrazu. Litery, cyfry i znaki łączące dowolnego pisma liczą się jako znaki wyrazu, podobnie jak podkreślenie. Dlatego `user` daje dopasowanie w `user id` i `user.id`, ale nie wewnątrz `users`, `user_id` ani `superuser`. Koniec wyszukiwanego tekstu, który sam nie jest znakiem wyrazu, taki jak kropka w `.id`, nie wymaga w tym miejscu granicy wyrazu.
- `Use Regular Expression`: wyszukiwany tekst jest wyrażeniem regularnym JavaScript, zawsze w trybie Unicode, więc działa `\p{L}`. `^` i `$` pasują na początku i na końcu każdego wiersza wielowierszowego komentarza lub notatki, a `.` nie przechodzi przez podział wiersza. Akceptowane są sekwencje ucieczki często wpisywane w nazwach, takie jak `\_` i `\-`.

Wyrażenie regularne, którego nie da się sparsować, takie jak `user(`, niczego nie znajduje: licznik pokazuje na czerwono komunikat `Invalid regular expression`, a pole wyszukiwania ma czerwony obrys.  
Opcje `Match Case` i `Match Whole Word` działają także dla wyrażenia regularnego. Dopasowanie o zerowej długości, takie jak sam znak `^`, nigdy nie jest wyświetlane w wynikach.

Zwykły tekst jest wyszukiwany podczas pisania. Wyrażenie regularne jest wyszukiwane, gdy nastąpi przerwa w pisaniu, albo od razu, gdy naciśniesz klawisz `Enter`, przycisk nawigacji, przycisk `Replace` lub `Replace All` albo wybierzesz wiersz zawierający dopasowanie.  
Wyszukiwanie nie ma limitu czasu, więc wyrażenie regularne z intensywnym nawracaniem (backtracking) może sprawić, że edytor przestanie odpowiadać aż do zakończenia wyszukiwania.

Czwarty przełącznik, `Preserve Case`, znajduje się wewnątrz pola `Replace`, przy jego końcu, więc jest widoczny tylko wtedy, gdy wiersz `Replace` jest rozwinięty. Początkowo jest wyłączony. Nie zmienia tego, co zostaje znalezione, a jedynie to, jak operacje `Replace` i `Replace All` zapisują tekst zamiany – zobacz sekcję [Zamiana](#replacing). Jego włączenie lub wyłączenie nie uruchamia wyszukiwania, a bieżące dopasowanie pozostaje bieżące.

## Wyniki {#the-results}

Licznik, na początku wiersza pod polami, pokazuje, gdzie jesteś. Jest pusty, gdy pole wyszukiwania jest puste.

| Licznik | Kiedy |
| --- | --- |
| `No results` | Nic nie pasuje. |
| `12 matches` | Przed przejściem do któregokolwiek z dopasowań; `1 match`, gdy jest tylko jedno. |
| `3 of 12` | Bieżące jest trzecie dopasowanie. |
| `Invalid regular expression` | Nie da się sparsować wyrażenia regularnego. |
| `Replaced 12 matches` | Operacja `Replace All` zmieniła tyle dopasowań; `Replaced 1 match`, gdy było tylko jedno. |
| `No changes` | Operacja `Replace All` niczego nie zmieniła. |
| `No more matches` | Seria operacji `Replace` wróciła do miejsca, w którym się zaczęła – zobacz sekcję [Zamiana](#replacing). |

Komunikaty `Replaced …`, `No changes` i `No more matches` ustępują miejsca licznikowi przy następnym wyszukiwaniu lub przejściu, także przy wyszukiwaniu uruchomionym przez zmianę lub cofnięcie.

Gdy pole wyszukiwania zawiera tekst, [drzewo](./explorer.md#the-tree) Eksploratora pokazuje wyniki zamiast całego diagramu: tylko wiersze zawierające dopasowanie i wiersze nad nimi. Gdy nic nie pasuje albo nie da się sparsować wyrażenia regularnego, drzewo jest puste. Usunięcie wyszukiwanego tekstu przywraca całe drzewo, zwinięte tak jak wcześniej.

- Foldery `Tables`, `Table Groups` i `Memos` są widoczne tylko wtedy, gdy zawierają dopasowanie, a licznik każdego folderu to liczba wierszy bezpośrednio pod nim w wynikach.
- W folderze `Tables` znajdują się tabele zawierające dopasowanie, uporządkowane według nazwy. Pod każdą tabelą znajduje się wiersz dla każdego dopasowania w jej komentarzu, potem folder `Columns` z kolumnami zawierającymi dopasowanie, w kolejności kolumn, każda z wierszem dla każdego dopasowania w jej komentarzu, a potem folder `Indexes` z indeksami, których nazwa pasuje. Nie ma folderu `Foreign Keys`.
- W folderze `Table Groups` znajdują się grupy, których nazwa pasuje, uporządkowane według nazwy, bez należących do nich tabel. Znaleziona tabela jest widoczna w folderze `Tables`.
- W folderze `Memos` znajdują się notatki zawierające dopasowanie, w kolejności w dokumencie, każda przedstawiona swoją pierwszą linią i z wierszem dla każdego zawartego w niej dopasowania.

Dopasowanie w nazwie jest wyróżnione we własnym wierszu tej nazwy, więc nazwa, która zawiera wyszukiwany tekst dwa razy, to jeden wiersz z dwoma wyróżnieniami.  
Dopasowanie w komentarzu lub notatce ma własny wiersz: dymek dla komentarza tabeli lub kolumny albo karteczkę samoprzylepną dla notatki, a następnie fragment tekstu z wyróżnionym dopasowaniem. Długi tekst jest skracany znakiem `…`, a podziały wierszy są wyświetlane jako spacje. Najedź wskaźnikiem na wiersz, aby zobaczyć cały tekst.  
Każdy inny wiersz wygląda tak samo jak poza wyszukiwaniem: kolumna pokazuje swój typ danych, indeks – swoje kolumny, a pusta nazwa jest wyświetlana jako `unnamed`.

Każdy wiersz, pod którym są inne wiersze, jest rozwinięty, gdy rozpoczyna się wyszukiwanie. Wiersz zwinięty ręcznie lub przyciskiem `Collapse All` pozostaje zwinięty, dopóki dopasowanie pod nim nie stanie się bieżące albo dopóki nie zmieni się wyszukiwany tekst, opcja `Match Case`, `Match Whole Word` lub `Use Regular Expression` albo rodzaj tekstu, albo dopóki wyszukiwanie nie zostanie ponownie otwarte skrótem lub pozycją `Toggle Explorer`.  
Wiersz bieżącego dopasowania jest wyróżniony, a drzewo przewija się tak, aby był widoczny. Drzewo wymienia wszystkie dopasowania, niezależnie od ich liczby.  
Przechodzenie przez dopasowania odbywa się w kolejności drzewa: tabela po tabeli, nazwa tabeli, jej komentarz, nazwa i komentarz każdej z jej kolumn w kolejności kolumn oraz nazwy jej indeksów; następnie nazwy grup tabel; następnie notatki.

Wyniki nadążają za dokumentem, dopóki Eksplorator jest widoczny. Gdy nastąpi przerwa w edycji, każda zmiana przeszukiwanych tekstów ponownie uruchamia wyszukiwanie, a bieżące dopasowanie pozostaje bieżące, jeśli nadal istnieje. Dotyczy to edycji nazwy, komentarza lub treści notatki, dodania lub usunięcia tabeli, kolumny, indeksu, notatki lub grupy tabel, przeniesienia kolumny oraz ukrycia lub pokazania notatek albo grup tabel w Opcjach widoku, co usuwa ich dopasowania z drzewa lub je przywraca. Liczy się każda zmiana na kanwie, cofnięcie lub ponowienie, import oraz zmiana wprowadzona przez współpracownika lub agenta kodującego. Zaznaczanie, przenoszenie tabel, notatek lub grup na kanwie, przewijanie, zmiana powiększenia i najeżdżanie wskaźnikiem się nie liczą.  
Zmiany wprowadzone, gdy Eksplorator jest zamknięty lub niewidoczny, są przeszukiwane, gdy tylko znów się pojawi.

## Przechodzenie do dopasowania {#going-to-a-match}

Klawisz `Enter` w polu wyszukiwania przechodzi do następnego dopasowania, a `Shift + Enter` do poprzedniego. Przyciski ze strzałkami w górę i w dół za licznikiem robią to samo; ich podpowiedzi brzmią `Previous Match (Shift+Enter)` i `Next Match (Enter)`, a gdy nie ma żadnego dopasowania, są nieaktywne.  
Na obu końcach przechodzenie przeskakuje na drugi koniec. Żadne dopasowanie nie jest bieżące przed pierwszym przejściem, więc pierwsze naciśnięcie `Enter` przechodzi do pierwszego dopasowania, a pierwsze naciśnięcie `Shift + Enter` do ostatniego.

Kliknięcie wiersza wyników albo naciśnięcie klawisza `Enter` lub `Space`, gdy znajduje się na nim fokus klawiatury, wykonuje jedno z poniższych:

- Wiersz, którego własna nazwa zawiera dopasowanie, prowadzi do pierwszego dopasowania w tej nazwie.
- Wiersz pokazujący fragment komentarza lub notatki prowadzi do tego dopasowania.
- Każdy inny wiersz, taki jak tabela, której nazwa nie pasuje, lub własny wiersz notatki, prowadzi do tego, co reprezentuje, i pozostawia bieżące dopasowanie bez zmian – zobacz sekcję [Przechodzenie do wiersza](./explorer.md#going-to-a-row).
- Folder zwija się lub rozwija.

Za każdym razem, gdy dopasowanie staje się bieżące, drzewo rozwija wszystkie zwinięte wiersze nad nim i przenosi tam wiersz z fokusem klawiatury, więc klawisze strzałek w drzewie przechodzą dalej od niego.

Przejście do dopasowania zamyka Właściwości tabeli, jeśli są otwarte, a następnie:

- W przypadku nazwy lub komentarza tabeli albo nazwy lub komentarza kolumny zaznacza tylko tę tabelę, przenosi ją na wierzch i ustawia fokus na komórce zawierającej dopasowanie. Dopasowanie w komentarzu ukrytym przez [opcję widoku tabeli](./table-related-functions.md#table-view-options) ustawia zamiast tego fokus na nazwie obok niego.
- W przypadku nazwy indeksu zaznacza tylko tabelę tego indeksu i przenosi ją na wierzch, z fokusem na nazwie tabeli, chyba że komórka z fokusem jest już w tej tabeli. Nazwy indeksów nie są rysowane na kanwie.
- W przypadku nazwy grupy tabel zaznacza tylko tę grupę i przenosi ją na wierzch razem z jej tabelami.
- W przypadku notatki zaznacza tylko tę notatkę i przenosi ją na wierzch.

Kanwa przewija się tylko wtedy, gdy cel przejścia nie jest jeszcze dobrze widoczny, a powiększenie nigdy się nie zmienia – zobacz sekcję [Dokąd prowadzi przejście](./table-related-functions.md#where-a-jump-lands).

Po naciśnięciu klawisza `Enter` w polu wyszukiwania kursor tekstowy pozostaje w nim, a po wybraniu wiersza fokus klawiatury pozostaje w drzewie, więc to, co wpiszesz potem, nie trafia do zaznaczonej tabeli.  
Przejście do dopasowania nigdy nie rozpoczyna ani nie kończy rysowania relacji.

## Zamiana {#replacing}

Wiersz `Replace` jest początkowo zwinięty. Strzałka przed polem wyszukiwania, której podpowiedź brzmi `Toggle Replace`, rozwija go i zwija. Zwinięcie wiersza zachowuje tekst zamiany.  
Wiersz zawiera pole `Replace` z przełącznikiem `Preserve Case` wewnątrz, przy jego końcu, oraz dwa przyciski, których podpowiedzi brzmią `Replace (Enter)` i `Replace All`. Oba przyciski są nieaktywne, gdy nie ma żadnego dopasowania.

Operacja `Replace` jest wykonywana po naciśnięciu klawisza `Enter` w polu zamiany, z klawiszem `Shift` lub bez niego, albo po kliknięciu jej przycisku:

- Gdy żadne dopasowanie nie jest bieżące, pierwsze naciśnięcie tylko przechodzi do następnego dopasowania, więc widzisz, co operacja zmieni, zanim cokolwiek się zmieni.
- Gdy dopasowanie jest bieżące, zamienia to jedno wystąpienie, pozostawiając bez zmian inne wystąpienia w tym samym tekście, i przechodzi do następnego dopasowania za zapisanym tekstem. Zapisany tekst jest pomijany, nawet jeśli zawiera wyszukiwany tekst: zamiana `user` na `super_user` nie zatrzymuje się potem wewnątrz `super_user`.
- Dopasowanie, które zamiana zapisałaby dokładnie w takiej samej postaci, pozostaje bez zmian, a naciśnięcie tylko przechodzi do następnego dopasowania.
- Zamiana i przewinięcie do następnego dopasowania stanowią jeden krok cofania.

Seria operacji `Replace` zatrzymuje się, gdy wróci do miejsca, w którym się zaczęła. Licznik pokazuje komunikat `No more matches`, żadne dopasowanie nie jest bieżące, a kolejne naciśnięcia niczego nie zamieniają.  
Dlatego tekst `Customer` zamieniany na `Big Customer` jest zamieniany jeden raz, zamiast rozrastać się do `Big Big Customer`.  
Nową serię rozpoczyna przejście do dopasowania, zmiana wyszukiwanego tekstu, opcji `Match Case`, `Match Whole Word` lub `Use Regular Expression` albo rodzaju tekstu, otwarcie wyszukiwania skrótem lub pozycją `Toggle Explorer` albo operacja `Replace All`, a także cofnięcie lub każda inna zmiana tekstu, w którym seria się zaczęła. Nie rozpoczyna jej zmiana tekstu zamiany ani opcji `Preserve Case`, ani skrót, gdy tylko przywraca kursor tekstowy do Eksploratora, który jest już widoczny.  
Dopóki seria trwa, tabela lub grupa tabel, której nazwę zmienia, zachowuje swoje miejsce w drzewie i w kolejności dopasowań, więc po zmianie nazwy, która przesunęłaby ją dalej w sortowaniu, seria nie trafia na nią ponownie. Następna seria przywraca w drzewie kolejność według nazw, a wiersz o zmienionej nazwie przenosi się na nowe miejsce.

Operacja `Replace All` jest wykonywana po naciśnięciu `Ctrl + Enter` (Windows/Linux) lub `⌘ + Enter` (Mac) w polu zamiany albo po kliknięciu jej przycisku:

- Zamienia każde dopasowanie we włączonych rodzajach tekstu i nie zmienia pozostałych rodzajów. Przy domyślnych rodzajach tekstu zmienia nazwy tabel, kolumn, indeksów i grup tabel, a komentarze i notatki pozostają nietknięte.
- Wszystko, co zmienia, stanowi jeden krok cofania – zobacz sekcję [Jeden gest, jeden krok](./undo-redo.md#one-gesture-one-step).
- Licznik pokazuje komunikat `Replaced N matches`, licząc tylko wystąpienia, których tekst faktycznie się zmienił. Gdy żadne się nie zmieniło, pokazuje komunikat `No changes` i nic nie jest rejestrowane w historii, jak przy zamianie wyrażenia regularnego `(user)` na `$1`.
- Następnie wyniki są wyszukiwane ponownie bez bieżącego dopasowania, więc mogą zawierać dopasowania występujące w nowym tekście.

Obie operacje odczytują każdy tekst w takiej postaci, jaką ma w chwili naciśnięcia, a nie w takiej, w jakiej znalazło go ostatnie wyszukiwanie.

Jak używany jest tekst zamiany:

- Bez opcji `Use Regular Expression` znak `$` nie ma specjalnego znaczenia, a tekst zamiany jest używany w takiej postaci, w jakiej go wpisano, poza wielkością liter nadawaną przez opcję `Preserve Case`.
- Z opcją `Use Regular Expression` sekwencje od `$1` do `$99`, `$<name>`, `$&`, `` $` ``, `$'` i `$$` są rozwijane tak samo jak w metodzie `String.prototype.replace` języka JavaScript.
- Bez opcji `Preserve Case` wielkość liter dopasowanego tekstu nie jest przenoszona: przy wyłączonej opcji `Match Case` zamiana `user` na `member` zmienia `Users` w `members`.
- Z opcją `Preserve Case` wielkość liter każdej zamiany jest dopasowywana do zastępowanego tekstu, po rozwinięciu `$1` i pozostałych sekwencji, więc ta sama zamiana zmienia `Users` w `Members`:
  - Dopasowanie zapisane w całości wielkimi literami otrzymuje zamianę w całości wielkimi literami, a dopasowanie zapisane w całości małymi literami – w całości małymi literami: `USER` z `account` daje `ACCOUNT`, a `user` z `Account` daje `account`.
  - Każde inne dopasowanie nadaje pierwszemu znakowi zamiany wielkość pierwszego znaku dopasowania, a resztę pozostawia w postaci wpisanej: `UserId` z `accountKey` daje `AccountKey`, a `uSER` z `AccountKey` daje `accountKey`. Gdy pierwszy znak dopasowania nie jest ani wielką, ani małą literą, zamiana pozostaje w postaci wpisanej: `_Ab` z `xyz` daje `xyz`.
  - Gdy dopasowanie i zamiana zawierają jednocześnie znak `-` lub jednocześnie znak `_`, a ten separator dzieli je na tyle samo części, wielkość liter każdej części jest dopasowywana do odpowiadającej jej części: `USER_id` z `account_key` daje `ACCOUNT_key`, a `User-Name` z `account-key` daje `Account-Key`. Gdy w ten sposób dzielą je oba znaki, `-` i `_`, wielkość liter jest dopasowywana do całości jako jednej części.
  - Dopasowanie bez liter rozróżniających wielkość, takie jak `123`, pozostawia zamianę w postaci wpisanej.
  - Dopasowanie zapisane z powrotem w niezmienionej postaci nie jest liczone: przy wyłączonej opcji `Match Case` zamiana `customer` na `Customer` zapisuje `customer`, `Customer` i `CUSTOMER` z powrotem bez zmian i żadne z nich nie jest liczone.
- Puste pole zamiany usuwa dopasowanie.

Zamiana jest zwykłą zmianą, taką samą jak samodzielne wpisanie nowej nazwy tabeli, komentarza, nazwy kolumny lub treści notatki, zmiana nazwy indeksu we Właściwościach tabeli albo zmiana nazwy grupy tabel.  
Jest rejestrowana w historii i dociera do współpracowników oraz agenta kodującego tak jak każda inna zmiana.

## Klawisze w polach wyszukiwania {#keys-in-the-search-fields}

- W polu wyszukiwania klawisz `Enter` przechodzi do następnego dopasowania, a `Shift + Enter` do poprzedniego.
- W polu zamiany klawisz `Enter`, z klawiszem `Shift` lub bez niego, zamienia, a `Ctrl + Enter` (Windows/Linux) lub `⌘ + Enter` (Mac) zamienia wszystko.
- Gdy w którymkolwiek z pól trwa składanie znaków w edytorze metody wprowadzania, klawisz `Enter` należy do składania i ani nie przechodzi, ani nie zamienia.

Działanie klawisza `Escape`, nadal dostępnych skrótów edytora i wszystkich pozostałych klawiszy w tych polach opisano w sekcji [Klawisze w Eksploratorze](./explorer.md#keys-in-the-explorer).

## Edytory tylko do odczytu {#read-only-editors}

W edytorze z atrybutem [`readonly`](../../api/erd-editor-element.md#readonly) wyszukiwanie tylko znajduje. Nie ma strzałki `Toggle Replace` ani wiersza `Replace`, więc nie ma też pola zamiany, przełącznika `Preserve Case` ani przycisków `Replace` i `Replace All`.  
Działają pole wyszukiwania, jego trzy opcje, rodzaje tekstu, licznik, wyniki i przechodzenie do dopasowania. Eksplorator wokół wyszukiwania działa tak jak w każdym innym edytorze – zobacz sekcję [Edytory tylko do odczytu](./explorer.md#read-only-editors).

W VS Code rewizja diagramu, taka jak rewizja Git lub wpis Local History, otwiera się jako tekst JSON. Po ponownym otwarciu jako diagram poleceniem `Reopen Editor With...` jest tylko do odczytu i otrzymuje opisane tu wyszukiwanie bez zamiany.

## Zmiana skrótu klawiaturowego {#changing-the-shortcut}

Strona osadzająca edytor może zmienić powiązanie skrótu `Ctrl + F` (Windows/Linux) lub `⌘ + F` (Mac) albo go usunąć, używając nazwy `findReplace` w metodzie [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap).  
Po usunięciu powiązania skrót na każdej karcie pozostaje do dyspozycji strony. Przycisk `Explorer` na pasku narzędzi nadal otwiera i zamyka Eksplorator, a polecenie `Toggle Explorer` w Szybkim wyszukiwaniu i w menu kontekstowym kanwy nadal otwiera wyszukiwanie lub zamyka Eksplorator, ale żadne z nich nie pokazuje skrótu, więc podpowiedź przycisku brzmi po prostu `Explorer`. Wiersz `Toggle Explorer` na karcie [Skróty klawiaturowe](./settings.md#shortcuts) w Ustawieniach również nie pokazuje żadnego klawisza. Po zmianie powiązania wszystkie pokazują nowy skrót.
