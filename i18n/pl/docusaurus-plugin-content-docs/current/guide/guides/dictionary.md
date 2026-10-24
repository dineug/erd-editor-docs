---
sidebar_position: 14
description: Przechowywanie domen, słów i terminów diagramu na karcie Słownik, generowanie nazw fizycznych na podstawie nazw logicznych, ustalanie przez domenę typu danych jej kolumn, odczytywanie tego, co wykrywa arkusz Kontrole, edycja i sortowanie arkuszy jak w arkuszu kalkulacyjnym oraz importowanie i eksportowanie ich jako plików CSV.
---

# Słownik

Karta Słownik przechowuje standard nazewnictwa diagramu w trzech słownikach, z których każdy znajduje się w arkuszu edytowanym jak arkusz kalkulacyjny:

- `Domains`: nazwane typy danych, takie jak `Name` dla `VARCHAR(100)`. Kolumna powiązana z domeną ma jej typ danych.
- `Words`: słowa standardowe, z których składają się nazwy logiczne, każde ze skrótem, którego używa dla niego nazwa fizyczna, na przykład `Customer` i `CUST`.
- `Terms`: całe nazwy logiczne, każda z nazwą fizyczną i domeną, które nadaje, na przykład `Customer Name` z `CUST_NM`.

Na podstawie [nazwy logicznej](./logical-names.md) tabeli lub kolumny te słowniki generują jej nazwę fizyczną, a termin kolumny może też powiązać ją z domeną – zobacz sekcję [Generowanie nazw fizycznych](#deriving-physical-names).  
Czwarty arkusz, `Checks`, wymienia nieprawidłowości, które słowniki wykrywają w nazwach i typach diagramu oraz w samych słownikach, na przykład słowo zakazane w nazwie logicznej – zobacz sekcję [Arkusz Kontrole](#the-checks-sheet).

## Otwieranie karty {#opening-the-tab}

Przejdź na kartę `Dictionary` za pomocą przycisku z ikoną książki na pasku narzędzi, między przyciskami `Code Generator` i `Settings`, albo wybierz pozycję `Dictionary` w grupie `Tab` w palecie [Szybkie wyszukiwanie](./quick-search.md).  
Może to być karta, na której otwiera się diagram – zobacz ustawienie `Canvas Type` w sekcji [Blokada](./settings.md#lock).

Po otwarciu karta pokazuje arkusz `Domains`, dopóki nie wybierzesz innego.  
Przy każdym otwarciu arkusz wraca z zaznaczeniem i przewinięciem z chwili, gdy go opuszczono, a przy pierwszej wizycie z zaznaczoną pierwszą komórką. Jego siatka przejmuje fokus klawiatury, więc pisanie lub klawisze strzałek działają od razu.

Wyświetlany arkusz oraz wyszukiwanie, zaznaczenie, przewinięcie i szerokości kolumn każdego arkusza należą tylko do ciebie.  
Nic z tego nie jest zapisywane w pliku, rejestrowane w historii cofania ani udostępniane współpracownikom. Wszystko to jest zachowywane, dopóki edytor pozostaje otwarty, również przy przełączaniu kart i między dokumentami wczytywanymi do tego samego edytora.

## Arkusze {#the-sheets}

Pasek u góry zawiera cztery przyciski arkuszy, `Domains`, `Words`, `Terms` i `Checks`, a przycisk wyświetlanego arkusza wygląda na wciśnięty. Każdy pokazuje obok nazwy licznik: liczbę wierszy swojego arkusza, niezależnie od tego, co pokazuje wyszukiwanie, a na przycisku `Checks` liczbę kontroli, zabarwioną według ich poziomu – zobacz sekcję [Arkusz Kontrole](#the-checks-sheet).  
Dalej znajduje się pole wyszukiwania – zobacz sekcję [Wyszukiwanie](#searching). Na końcu paska, w arkuszach `Domains`, `Words` i `Terms`, ale nie w edytorze tylko do odczytu, znajdują się cztery narzędzia: `Add Row`, `Delete Rows`, `Import CSV` i `Export CSV` – zobacz sekcje [Dodawanie i usuwanie wierszy](#adding-and-deleting-rows) i [Importowanie i eksportowanie plików CSV](#importing-and-exporting-csv).  
W wąskim panelu lub w języku wyświetlania z długimi tekstami pasek zawija się do kolejnych wierszy, więc każdy przycisk pozostaje w zasięgu.

Pod siatką wiersz stanu podaje liczbę wierszy pozostawionych przez wyszukiwanie, na przykład `4 rows`, a gdy zaznaczenie obejmuje jakikolwiek wiersz, także liczbę objętych wierszy, na przykład `1 selected`. Wiersz wspólny dla dwóch zakresów liczy się raz, więc ta liczba odpowiada liczbie wierszy, które usunąłby przycisk `Delete Rows`.  
Numery wierszy po lewej stronie liczą wiersze w kolejności, w jakiej pokazuje je arkusz, od 1. Komórka tylko do odczytu, czyli każda komórka w arkuszu `Checks` i każda komórka w edytorze tylko do odczytu, ma szare tło, chyba że oznacza ją kontrola.  
Pusty arkusz `Domains`, `Words` lub `Terms` wyświetla tekst `Import a CSV file or add a row`, z wyjątkiem edytora tylko do odczytu.

Kolumny każdego arkusza w kolejności:

| Arkusz | Kolumny |
| --- | --- |
| `Domains` | `Domain`, `Category`, `Data Type`, `Description` |
| `Words` | `Word`, `Abbreviation`, `English Name`, `Description`, `Synonyms`, `Forbidden Words` |
| `Terms` | `Term`, `Physical Name`, `Domain`, `Description`, `Synonyms` |
| `Checks` | `Type`, `Target`, `Detail` |

Do czego służą komórki:

- Wartość `Data Type` domeny zapisuje się jak typ kolumny, na przykład `VARCHAR(100)` lub `NUMERIC(15,2)`, a każda kolumna powiązana z domeną ma ten typ – zobacz sekcję [Domeny i typy danych](#domains-and-data-types).
- Wartość `Abbreviation` słowa to forma, której nazwa fizyczna używa dla tego słowa – zobacz sekcję [Na podstawie słów](#from-the-words).
- Wartości `Synonyms` i `Forbidden Words` słowa wymieniają inne słowa oznaczające to samo, rozdzielone przecinkami. Z każdej pozycji usuwa się spacje na początku i na końcu, pusta pozycja jest pomijana, a pozycja równa samemu słowu jest ignorowana. Dla nazwy logicznej, która zawiera jedno z nich, nie jest składana żadna nazwa fizyczna, a arkusz `Checks` zgłasza tę nazwę i podaje słowo, którego należy użyć w jego miejsce – zobacz sekcję [Co wykrywa każda kontrola](#what-each-check-finds).
- Wartość `Term` terminu to cała nazwa logiczna, a jego wartość `Physical Name` to nazwa, którą daje ta nazwa logiczna – zobacz sekcję [Na podstawie terminu](#from-a-term).
- Komórka `Domain` terminu pokazuje nazwę powiązanej z nim domeny i jest pusta, gdy termin nie jest powiązany z żadną domeną lub jest powiązany z domeną, którą później usunięto – zobacz sekcję [Domena terminu](#a-terms-domain).
- Wartości `Category`, `English Name`, każda wartość `Description` i wartość `Synonyms` terminu są jedynie adnotacjami. Niczego nie zmieniają i żadna kontrola ich nie odczytuje.

W [języku wyświetlania pisanym od prawej do lewej](./language-and-theme.md#right-to-left-languages) pasek, menu siatki i wiersz stanu są odbijane lustrzanie, a arkusze i lista domen terminu pozostają od lewej do prawej.

## Generowanie nazw fizycznych {#deriving-physical-names}

Słowniki mogą nadać tabeli lub kolumnie nazwę fizyczną, czyli nazwę, którą zapisują Schemat SQL i Generator kodu, na podstawie jej nazwy logicznej. Najpierw wyszukiwany jest termin, którego wartość `Term` jest tą nazwą logiczną; w przeciwnym razie nazwa składa się ze skrótów słów.  
Na przykład przy słowach `Customer` (`CUST`), `Name` (`NM`), `Number` (`NO`), `Order` (`ORD`) i `Date` (`DT`) oraz terminie `Customer Number` z nazwą fizyczną `CUST_NO` i domeną `Number`, której typ danych to `INT`:

- Nazwa logiczna `Customer Number` nadaje kolumnie nazwę `CUST_NO`, wiąże ją z domeną `Number` i nadaje jej typ `INT`.
- Z nazwy logicznej `Order Date` powstaje złożona nazwa `ORD_DT`.
- Tabela z nazwą logiczną `Customer` otrzymuje nazwę `CUST`.

Gdy arkusze `Words` i `Terms` są puste, nic nie jest generowane.

### Kiedy nazwa jest generowana {#when-a-name-is-derived}

Nazwa fizyczna jest generowana w chwili zapisania nazwy logicznej:

- Na kanwie, gdy edytor komórki nazwy logicznej zamyka się z nazwą logiczną inną niż ta, z którą się otworzył, po naciśnięciu klawisza `Enter`, `Tab` lub `Escape` albo po kliknięciu w innym miejscu. Każde naciśnięcie klawisza podczas pisania zapisuje tylko nazwę logiczną – zobacz sekcję [Wpisywanie nazwy logicznej](./logical-names.md#writing-a-logical-name).
- Od razu, gdy wybierzesz termin z listy pod komórką – zobacz sekcję [Uzupełnianie nazw terminów](./logical-names.md#completing-term-names).
- Gdy wklejenie zapisuje komórkę nazwy logicznej – zobacz sekcję [Kopiowanie/wklejanie kolumn](./table-editing.md#copyingpasting-columns).
- Gdy funkcja [Znajdź i zamień](./find-and-replace.md#replacing) zamienia nazwę logiczną, jedno dopasowanie lub wszystkie.
- Gdy agent kodujący ustawia nazwę logiczną.

Nazwa jest generowana tylko wtedy, gdy nazwa fizyczna jest pusta lub sama została wygenerowana – zobacz sekcję [Własne nazwy](#names-of-your-own).  
Wybranie terminu, wklejenie lub zamiana zapisuje nazwę logiczną i to, co na jej podstawie wygenerowano, jako jeden krok cofania. Na kanwie nazwa wygenerowana przy zamknięciu edytora stanowi osobny krok cofania po wpisywaniu: pierwsze cofnięcie wycofuje wygenerowaną nazwę wraz z domeną i typem, które wniósł termin, i pozostawia wpisaną nazwę logiczną.

Później nic nie jest generowane ponownie samoczynnie. Nowa wartość `Abbreviation` słowa, nowa wartość `Physical Name` lub `Domain` terminu oraz nowe słowa lub terminy pozostawiają już wygenerowane nazwy bez zmian; do tego użyj polecenia [Wygeneruj ponownie nazwy fizyczne](#derive-physical-names-again). Wyjątkiem jest wartość `Data Type` domeny: od razu trafia do jej kolumn.

### Na podstawie terminu {#from-a-term}

Najpierw w arkuszu `Terms` wyszukiwany jest termin, którego wartość `Term` jest równa nazwie logicznej. Spacje na początku i na końcu oraz postać normalizacji Unicode są ignorowane, ale wielkość liter ma znaczenie, więc `customer number` nie pasuje do `Customer Number`. Spośród dwóch terminów o tej samej nazwie liczy się pierwszy w arkuszu.

- Termin daje swoją wartość `Physical Name`, a gdy jest ona pusta, nazwę złożoną z jego słów, jak opisano poniżej, o ile da się ją złożyć.
- W przypadku kolumny termin wiąże ją też z domeną ze swojej komórki `Domain`, o ile arkusz `Domains` ją wymienia, co nadaje kolumnie typ danych domeny – zobacz sekcję [Powiązanie kolumny z domeną](#linking-a-column). Dzieje się tak nawet wtedy, gdy termin nie daje żadnej nazwy. Termin bez domeny niczego nie odłącza.
- Tabela przejmuje tylko nazwę fizyczną terminu.

### Na podstawie słów {#from-the-words}

Gdy żaden termin nie pasuje, nazwa składa się ze słów:

1. Nazwa logiczna jest dzielona w miejscu spacji oraz znaków `_`, `-`, `·` i `/`, a żadne słowo nie przekracza miejsca podziału.
2. Każda część jest odczytywana od lewej: w każdym miejscu brany jest najdłuższy tekst, który wymienia arkusz `Words`, jako wartość `Word`, synonim lub słowo zakazane, bez cofania się. Przy słowach `가입`, `가입일` i `일자` tekst `가입일자` jest odczytywany jako `가입일` i `자`, przez co fragment `자` pozostaje niezarejestrowany, a `가입 일자` jako `가입` i `일자`. Wielkość liter ma znaczenie: `member` to nie słowo `Member`.
3. Nazwa fizyczna to wartości `Abbreviation` kolejnych słów, dokładnie tak, jak je wpisano, połączone znakiem `_`, na przykład `ORD_DT`. Spośród dwóch słów o tej samej nazwie skrót daje pierwsze w arkuszu. Nie obowiązuje żaden limit długości, a ustawienia `Table Name Case` i `Column Name Case` Generatora kodu nie mają znaczenia.

Obowiązuje zasada „wszystko albo nic”. Jeśli którykolwiek fragment jest synonimem, słowem zakazanym lub tekstem, którego nie wymienia żadne słowo, albo słowo ma pustą wartość `Abbreviation`, nazwa nie jest składana, a nazwa fizyczna pozostaje bez zmian.

### Własne nazwy {#names-of-your-own}

Słowniki wypełniają nazwę fizyczną tylko wtedy, gdy jest pusta lub same ją wcześniej wypełniły. Edytor zapamiętuje to dla każdej tabeli i kolumny, choć nic na kanwie tego nie pokazuje.

- Nazwa wpisana samodzielnie staje się własną nazwą: dotyczy to pisania w komórce nazwy, zamiany nazwy tabeli lub kolumny funkcją Znajdź i zamień, wklejenia do komórki nazwy kolumny i zmiany nazwy przez agenta kodującego. Wpisana później nazwa logiczna pozostawia ją bez zmian, zapisuje tylko nazwę logiczną i nie wiąże kolumny z żadną domeną.
- Wyczyszczenie nazwy oddaje ją słownikom, ponieważ pusta nazwa jest zawsze generowana.
- Nazwa logiczna, która niczego nie generuje, pozostawia nazwę fizyczną i jej stan bez zmian: pusta nazwa pozostaje pusta, a wygenerowana nazwa zachowuje swoją wartość i nadal należy do słowników.
- Nowa tabela lub kolumna zaczyna z pustą nazwą, więc jej pierwsza nazwa logiczna generuje nazwę fizyczną. Kolumna klucza obcego dodana przez relację otrzymuje nazwę od swojego klucza i jest traktowana jako własna – zobacz sekcję [Nazwy kolumn kluczy obcych](./relationship-editing.md#foreign-key-column-names).
- Nazwy wprowadzone przez operację `Import` lub `Import and Add` w formacie Schemat SQL, GraphQL, DBML lub AML oraz nazwy diagramu utworzonego w wersji sprzed karty Słownik są traktowane jako własne, więc wpisana później nazwa logiczna niczego dla nich nie generuje.
- [Zduplikowana tabela](./table-related-functions.md#duplicating-tables-and-memos), kolumna [przeniesiona do innej tabeli](./table-editing.md#rearranging-and-moving-columns) za pomocą uchwytu przeciągania, wklejenie skopiowanych tabel i operacja `Import and Add` z pliku JSON zachowują stan każdej nazwy. Kolumny wklejone do zaznaczonych tabel jako nowe kolumny są traktowane jako własne, chyba że wklejona nazwa jest pusta, a ich nazwa logiczna generuje nazwę.
- Polecenie [Wygeneruj ponownie nazwy fizyczne](#derive-physical-names-again) oddaje własną nazwę słownikom, również zaimportowaną.

### Dwie kolumny, jedna nazwa {#two-columns-one-name}

Kolumna niczego nie generuje, gdy inna kolumna jej tabeli ma już nazwę, którą by wygenerowała. Zachowuje swoją nazwę, jej stan i powiązanie z domeną, a zapisywana jest tylko jej nazwa logiczna. Nazwy są porównywane bez uwzględniania wielkości liter i spacji na początku i na końcu, tak jak nazwy kolumn kluczy obcych.  
Gdy jedna zmiana nadałaby dwóm kolumnom tę samą nazwę, co może się zdarzyć przy poleceniu `Replace All` lub `Derive Physical Names Again` dla tabeli, otrzymuje ją pierwsza kolumna w tabeli.  
Na przykład relacja zwrotna w tabeli `members` z kluczem `MBR_NO` dodaje kolumnę `MBR_NO_2`, która kopiuje nazwę logiczną `Member Number`. Polecenie `Derive Physical Names Again` nadałoby jej nazwę `MBR_NO`, którą ma klucz, więc kolumna zachowuje nazwę `MBR_NO_2`.  
Dla tabel nie ma takiej reguły: dwie tabele mogą wygenerować tę samą nazwę.

## Wygeneruj ponownie nazwy fizyczne {#derive-physical-names-again}

Użyj polecenia `Derive Physical Names Again` po zmianie wartości `Abbreviation` słowa albo wartości `Physical Name` lub `Domain` terminu, ponieważ te zmiany same nie zmieniają żadnej nazwy. Polecenie oddaje objęte nim nazwy słownikom i generuje je ponownie według powyższych reguł, łącznie z nazwami wpisanymi samodzielnie. Jest dostępne tylko na karcie ERD, ale nie w edytorze tylko do odczytu:

- Menu kontekstowe tabeli, bezpośrednio za pozycją `Focus on this table` lub `Focus on selected tables`. Gdy tabela jest jedną z co najmniej dwóch zaznaczonych tabel, pozycja `Derive Physical Names Again` obejmuje je wszystkie, niezależnie od tego, w którym miejscu tabeli klikniesz prawym przyciskiem myszy. W przeciwnym razie kliknięcie prawym przyciskiem myszy wiersza kolumny udostępnia pozycję `Derive Physical Name Again` tylko dla tej kolumny, a kliknięcie nagłówka udostępnia pozycję `Derive Physical Names Again` dla nazwy tabeli i każdej kolumny.
- Menu kontekstowe kanwy, bezpośrednio za pozycją `Name View`: pozycja `Derive Physical Names Again` dla każdej tabeli i kolumny diagramu. Nie jest dostępna, gdy diagram nie ma żadnej tabeli.
- [Szybkie wyszukiwanie](./quick-search.md#what-the-palette-lists), jako wiersze dla kolumny z fokusem, tabeli z fokusem, zaznaczonych tabel i całego diagramu.

![Zmiana skrótu słowa Number z NO na NUM w arkuszu Words, nazwy fizyczne MBR_NO i PAY_NO pozostające bez zmian na diagramie, a następnie polecenie Derive Physical Names Again z menu kanwy zmieniające je na MBR_NUM i PAY_NUM, podczas gdy ORD_NO, nadana przez termin, pozostaje bez zmian](/img/demo-derive-physical-names.webp)

Nazwa każdej objętej tabeli i kolumny, która ma nazwę logiczną, jest generowana ponownie. Kolumna przejmuje też domenę, którą daje jej termin, a wraz z nią typ domeny, który rozchodzi się wzdłuż relacji, gdy ustawienie [Synchronizacja typu danych w relacjach](./settings.md#relationship-datatype-sync) jest włączone.  
Polecenie pomija tabelę lub kolumnę bez nazwy logicznej oraz kolumnę, której nową nazwę ma już inna kolumna jej tabeli – zobacz sekcję [Dwie kolumny, jedna nazwa](#two-columns-one-name). Każda z nich zachowuje swoją nazwę i jej stan, czyli to, czy jest własna, czy należy do słowników, a kolumna zachowuje też powiązanie z domeną.  
Nazwa logiczna, która teraz niczego nie generuje, pozostawia nazwę fizyczną bez zmian, ale oddaje ją słownikom, więc następna wpisana nazwa logiczna ją wygeneruje.  
Polecenie stanowi jeden krok cofania, niezależnie od tego, ile nazw, powiązań z domenami i typów zmienia. Nie rejestruje kroku tylko wtedy, gdy niczego nie zmienia, a oddanie własnej nazwy słownikom liczy się jako zmiana, nawet gdy nazwa ma już wartość, którą dają słowniki.

Własna wartość `Physical Name` terminu nie jest ponownie składana ze zmienionych słów, więc przed ponownym generowaniem zmień termin.

## Domeny i typy danych {#domains-and-data-types}

Kolumna powiązana z domeną ma typ podany w wartości `Data Type` domeny. Powiązanie kolumny z domeną od razu nadaje jej ten typ.  
Gdy wartość `Data Type` domeny się zmienia, niezależnie od tego, czy zostanie edytowana, wklejona lub zaimportowana w arkuszu `Domains`, czy zmieniona przez współpracownika lub agenta kodującego, każda powiązana z nią kolumna przejmuje nowy typ w tym samym kroku. Gdy ustawienie [Synchronizacja typu danych w relacjach](./settings.md#relationship-datatype-sync) jest włączone, każda z tych zmian rozchodzi się dalej wzdłuż relacji, tak jak ręcznie wpisana zmiana typu; gdy jest wyłączone, zmieniają się tylko powiązane kolumny.  
Zmiana nazwy domeny zmienia tylko nazwę wyświetlaną w komórkach domeny kolumn.

Zmianę typu wprowadzoną w arkuszu `Domains` cofa się w tym arkuszu, razem z typami kolumn, które nadała – zobacz sekcję [Arkusze karty Słownik](./undo-redo.md#dictionary-sheets).  
Cofnięcie lub ponowienie na karcie ERD, które ponownie wiąże kolumnę z domeną albo przywraca kolumnę powiązaną z domeną, nadaje kolumnie bieżący typ domeny. Cofnięcie lub ponowienie, które przywraca inny typ, odłącza kolumnę od domeny.

### Powiązanie kolumny z domeną {#linking-a-column}

Kolumnę wiążą z domeną:

- Wybranie domeny w komórce domeny kolumny, wyświetlanej po włączeniu View Option → `Domain`, lub, w widoku `Logical Names`, w komórce typu, która ją zastępuje – zobacz sekcję [Komórka domeny](./logical-names.md#the-domain-cell).
- Nazwa logiczna, której termin daje domenę – zobacz sekcję [Na podstawie terminu](#from-a-term). Dzieje się tak tylko wtedy, gdy nazwa jest generowana, a więc nie w przypadku własnej nazwy ani kolumny, której wygenerowaną nazwę ma inna kolumna.
- Polecenie `Derive Physical Name Again` lub `Derive Physical Names Again`, które wiąże każdą objętą kolumnę z domeną jej terminu.
- Relacja: kolumna klucza obcego kopiuje domenę swojego klucza wraz z jego typem i nazwą logiczną – zobacz sekcję [Relacje identyfikujące](./relationship-editing.md#identifying-relationships). Klucz, którego kopia otrzymuje inny typ, jak w przypadku klucza typu serial, nie przekazuje domeny.
- Duplikowanie jej tabeli lub przeniesienie jej do innej tabeli za pomocą uchwytu przeciągania, co w obu przypadkach zachowuje powiązanie. Wklejenie skopiowanych tabel lub kolumn zachowuje je tylko wtedy, gdy ten diagram zawiera domenę, a domena nadal ma typ skopiowanej kolumny, więc kopia z innego diagramu trafia do niego bez powiązania – zobacz sekcję [Kopiowanie/wklejanie tabel i notatek](./table-related-functions.md#copyingpasting-tables-and-memos). Operacja `Import and Add` nie wiąże żadnej kolumny.
- Nazwa domeny wklejona do komórki domeny – zobacz sekcję [Kopiowanie/wklejanie kolumn](./table-editing.md#copyingpasting-columns).

### Odłączanie od domeny {#unlinking}

- Wpisanie typu w komórce `DataType` powiązanej kolumny lub zaakceptowanie sugestii odłącza kolumnę od domeny, gdy tylko jej typ różni się od typu domeny, a kolumna zachowuje wpisany typ – zobacz sekcję [Autouzupełnianie typu danych](./table-editing.md#datatype-autocomplete). Ponowne wpisanie typu domeny nie przywraca powiązania; zamiast tego wybierz domenę w komórce domeny kolumny. Wklejenie do komórki `DataType` i zmiana typu przez agenta kodującego odłączają kolumnę w ten sam sposób.
- Gdy ustawienie Synchronizacja typu danych w relacjach jest włączone, każda kolumna, do której dociera zmiana typu i której nowy typ różni się od typu jej własnej domeny, jest odłączana w tym samym kroku, na przykład klucz obcy powiązany z własną domeną. Okno dialogowe [Mapuj kolumny](./relationship-editing.md#map-columns) w ten sam sposób odłącza kolumny, którym zmienia typ.
- Pozycja `None` w komórce domeny odłącza kolumnę od domeny i zachowuje jej typ.
- Zmiana lub wyczyszczenie wartości `Domain` terminu albo usunięcie terminu nie zmienia żadnej kolumny.

### Usuwanie domeny {#removing-a-domain}

Usunięcie wiersza domeny pozostawia jej kolumny z ich typami, a ich powiązania pozostają. Kolumny nie pokazują żadnej domeny, a arkusz `Checks` wyświetla kontrolę `Unknown domain` dla każdej z nich, dopóki arkusz `Domains` nadal zawiera jakąkolwiek domenę. Cofnięcie usunięcia w arkuszu `Domains` ponownie pokazuje powiązania.  
Dopóki domeny nie ma, wpisanie w takiej kolumnie typu innego niż typ domeny trwale odłącza ją od domeny, podobnie jak pozycja `None` w jej komórce domeny.  
Przy zapisywaniu plik pomija te powiązania, więc po ponownym otwarciu diagramu te kolumny nie są powiązane z domeną.

Termin powiązany z usuniętą domeną ma pustą komórkę `Domain` oznaczoną jako `Unknown domain`. Klawisz `Delete` lub `Backspace` w tej komórce odłącza termin od domeny – zobacz sekcję [Domena terminu](#a-terms-domain).

## Arkusz Kontrole {#the-checks-sheet}

Arkusz `Checks` wymienia to, co kontrole słowników wykrywają w słownikach oraz w tabelach i kolumnach diagramu. Kontrole tylko odczytują: niczego nie zmieniają.  
Każda kontrola działa tylko wtedy, gdy odczytywany przez nią arkusz zawiera wiersz, a kontrole słów tylko wtedy, gdy arkusz `Words` zawiera słowo z nazwą, więc diagram z pustymi słownikami nic nie wyświetla.

![Wyświetlanie Customer Num na czerwono i Order Stat na bursztynowo w widoku Logical Names, arkusz Checks z ich trzema kontrolami i czerwonym licznikiem, dwukrotne kliknięcie wiersza Forbidden word prowadzące z powrotem do Customer Num na diagramie oraz zmiana tej nazwy na Member Number, po której zostaje jedna kontrola](/img/demo-dictionary-checks.webp)

Jego trzy kolumny są tylko do odczytu:

- Kolumna `Type` podaje rodzaj kontroli – zobacz sekcję [Co wykrywa każda kontrola](#what-each-check-finds).
- Kolumna `Target` podaje słowo, termin lub domenę według nazwy, tabelę według nazwy, a kolumnę jako `table.column`, przy czym tabela i kolumna są nazwane tak, jak nazywa je [Widok nazw](./logical-names.md#beyond-the-canvas), z tekstem `unnamed` tam, gdzie widok nie pokazuje żadnej nazwy.
- Kolumna `Detail` pokazuje, co wykryła kontrola, a po znaku `→` to, co słowniki proponują w zamian, przy czym kilka propozycji rozdziela się przecinkami, na przykład `멤버 → 회원`. Pusta strona ma postać `—`, jak w `— → NUMERIC(15)`.

Najpierw wyświetlane są kontrole słów, potem terminów i domen, a następnie kolejno tabel, przy czym po każdej tabeli następują jej kolumny.  
Lista na bieżąco odzwierciedla każdą zmianę, także wprowadzoną przez współpracownika lub agenta kodującego, oraz każde przełączenie Widoku nazw.  
Licznik przycisku `Checks` jest czerwony, gdy którakolwiek kontrola jest błędem, bursztynowy, gdy wszystkie są ostrzeżeniami, a wyciszony, gdy nie ma żadnej.

Wierszy nie można edytować, dodawać, usuwać, sortować, importować ani eksportować: pasek nie pokazuje żadnych narzędzi, kliknięcie prawym przyciskiem myszy nie otwiera menu siatki, a Cofnij i Ponów nic nie robią. Wyszukiwanie, zaznaczanie i kopiowanie działają tak jak w pozostałych arkuszach.

Klawisz `Enter` lub dwukrotne kliknięcie wiersza przechodzi do obiektu, który wiersz wskazuje:

- Słowo, termin lub domena: karta pokazuje odpowiedni arkusz z zaznaczoną komórką, którą odczytuje kontrola, czyli nazwą lub komórką `Domain` terminu, a wiersz obiektu jest pierwszym widocznym wierszem. Wyszukiwanie w arkuszu jest czyszczone, jeśli ukrywa ten wiersz. Wiersz, który w międzyczasie usunięto, nigdzie nie prowadzi.
- Tabela lub kolumna: pojawia się karta ERD z zaznaczoną tylko tą tabelą i fokusem na komórce, którą odczytuje kontrola. Jest to komórka nazwy, nazwy logicznej lub domeny albo, gdy wiersz nie wyświetla tej komórki, komórka wyświetlana w jej miejscu. Kanwa przejmuje fokus klawiatury, a widok przesuwa się według reguły z sekcji [Dokąd prowadzi przejście](./table-related-functions.md#where-a-jump-lands).

Dwukrotne kliknięcie nagłówka, krawędzi kolumny, paska przewijania lub obszaru pod wierszami nigdzie nie prowadzi.  
Agent kodujący pobiera listę tych samych kontroli, w tej samej kolejności, za pomocą narzędzia `erd_list_checks` – zobacz sekcję [Kontrole słowników](../../mcp/tools.md#dictionary-checks).

Pozostałe trzy arkusze oznaczają komórki odczytywane przez kontrole, czyli nazwę lub komórkę `Domain` terminu, czerwonym lub bursztynowym tekstem na zabarwionym tle:

- Czerwony: nazwa, którą ma inny wiersz jej arkusza, komórka `Domain` terminu powiązana z usuniętą domeną oraz wartość `Term`, która zawiera słowo zakazane.
- Bursztynowy: wartość `Term`, która zawiera synonim lub niezarejestrowane słowo.

Komórka przyjmuje kolor poważniejszego ze swoich poziomów. Oznaczenia są widoczne również w edytorze tylko do odczytu, a sam arkusz `Checks` nie jest kolorowany. Informacje o oznaczeniach na kanwie ERD znajdziesz w sekcji [Oznaczenia na kanwie](#marks-on-the-canvas).

### Co wykrywa każda kontrola {#what-each-check-finds}

| `Type` | Poziom | Wykrywa | Przykładowa wartość `Detail` |
| --- | --- | --- | --- |
| `Duplicate name` | Błąd | Wartość `Word`, `Term` lub `Domain`, którą ma również inny wiersz tego samego arkusza. Wymieniany jest każdy z tych wierszy. | `Member` |
| `Unknown domain` | Błąd | Kolumna lub termin nadal powiązany z usuniętą domeną, gdy arkusz `Domains` zawiera jakąkolwiek domenę | Nazwa usuniętej domeny |
| `Forbidden word` | Błąd | Fragment nazwy logicznej lub wartości `Term`, który słowo wymienia w swojej wartości `Forbidden Words` | `커스터머 → 고객` |
| `Unregistered word` | Ostrzeżenie | Fragment nazwy logicznej tabeli lub kolumny albo wartości `Term`, którego nie wymienia żadne słowo | `자` |
| `Synonym` | Ostrzeżenie | Fragment, który słowo wymienia w swojej wartości `Synonyms` | `멤버 → 회원` |
| `Physical name mismatch` | Ostrzeżenie | Tabela lub kolumna, której nazwa logiczna pasuje do terminu, ale której nazwa fizyczna nie jest tą, którą daje termin | `mbr_no → MBR_NO` |
| `Domain type mismatch` | Ostrzeżenie | Kolumna, której wartość `DataType` nie jest wartością `Data Type` powiązanej z nią domeny | `INT → NUMERIC(15)` |

- Nazwy są porównywane bez spacji na początku i na końcu, z uwzględnieniem wielkości liter, więc `Member` i `member` to dwie nazwy, a pusta nazwa nigdy nie jest duplikatem. Arkusze odrzucają zmianę, która nadałaby dwóm wierszom tę samą nazwę, więc kontrola `Duplicate name` pojawia się tylko tam, gdzie skrzyżowały się dwie zmiany, na przykład gdy dwóch współpracowników jednocześnie nadaje nazwy wierszom, lub w pliku edytowanym gdzie indziej.
- Kontrole słów odczytują nazwę tak, jak opisano w sekcji [Na podstawie słów](#from-the-words), i wymieniają każdy odrębny fragment raz dla danej nazwy. Kontrole `Forbidden word` i `Synonym` proponują słowo, które wymienia dany fragment.
- Kontrola `Physical name mismatch` porównuje nazwę, bez spacji na początku i na końcu, z wartością `Physical Name` terminu, a gdy jej brak, z nazwą złożoną z jego słów, i nic nie zgłasza, gdy termin nie daje żadnej nazwy. Dla kolumny klucza obcego, która skopiowała nazwę logiczną swojego klucza, ta kontrola pojawia się zawsze, gdy własna nazwa kolumny różni się od nazwy terminu, na przykład `members_id → MBR_ID`. Polecenie `Derive Physical Name Again` usuwa ten problem, chyba że tę nazwę ma inna kolumna.
- Kontrola `Domain type mismatch` nigdy nie wynika ze zmian w jednym edytorze, ponieważ powiązana kolumna zawsze ostatecznie otrzymuje typ swojej domeny. Może się pojawić, gdy jeden współpracownik wiąże kolumnę z domeną, a inny w tym czasie zmienia typ tej domeny, lub w pliku zapisanym gdzie indziej. Ponowne wybranie domeny w komórce domeny kolumny nadaje kolumnie jej typ, a pozycja `None` odłącza ją od domeny. Powiązanie z usuniętą domeną jest zgłaszane tylko jako `Unknown domain`.

### Oznaczenia na kanwie {#marks-on-the-canvas}

Kanwa ERD wyświetla nazwę zgłaszaną przez kontrole w kolorze danej kontroli:

- Komórka nazwy logicznej, w nagłówku tabeli lub w wierszu kolumny, jest czerwona, gdy jej nazwa logiczna zawiera słowo zakazane, a w przeciwnym razie bursztynowa, gdy zawiera synonim lub słowo, którego brakuje w arkuszu `Words`.
- Komórka nazwy fizycznej, w nagłówku lub w wierszu, jest bursztynowa, gdy termin, do którego pasuje jej nazwa logiczna, daje inną nazwę fizyczną.

Oznaczane są tylko te dwa rodzaje komórek, nigdy komórka domeny ani komórka `DataType`, więc kontrole `Unknown domain` i `Domain type mismatch` kolumny są widoczne wyłącznie w arkuszu `Checks`.  
Komórka jest oznaczana tylko ze względu na to, co wyświetla: widok `Physical Names` może oznaczać tylko nazwy fizyczne, widok `Logical Names` tylko nazwy logiczne, a widok `Both Names` każdą komórkę według jej własnych kontroli – zobacz sekcję [Widok nazw](./logical-names.md#name-view). Pusta komórka zachowuje kolor tekstu zastępczego, a puste słowniki niczego nie oznaczają.  
W nagłówku tabeli należącej do kolorowej [grupy tabel](./table-groups.md) oznaczenie zachowuje swój kolor tylko wtedy, gdy pozostaje czytelne na kolorze grupy; w przeciwnym razie nazwa przyjmuje czarny lub biały kolor samego nagłówka.

Oznaczenia są widoczne na kanwie ERD, w funkcji [Podróż w czasie](./undo-redo.md#time-travel) i w podglądzie funkcji [Automatyczny układ](./table-related-functions.md#auto-layout), również w edytorze tylko do odczytu. Karta Wizualizacja, obie strony funkcji [Podgląd różnic](./table-related-functions.md#diff-viewer) i wyeksportowany obraz nie wyświetlają żadnych oznaczeń.  
Na bieżąco odzwierciedlają każdą zmianę, zarówno nazwy, jak i słowa, terminu lub domeny.

## Wyszukiwanie {#searching}

Pole wyszukiwania, oznaczone tekstem `Search`, jest widoczne we wszystkich czterech arkuszach, również w edytorze tylko do odczytu. Każdy arkusz ma własne wyszukiwanie.  
Wiersz pasuje, gdy jedna z przeszukiwanych komórek zawiera wyszukiwany tekst, bez uwzględniania wielkości liter, postaci normalizacji Unicode i spacji wokół wyszukiwanego tekstu. Dopasowanie nigdy nie obejmuje dwóch komórek. Przeszukiwane komórki:

- `Domains`: `Domain`, `Data Type` i `Description`.
- `Words`: `Word`, `Abbreviation`, `English Name` i `Description`.
- `Terms`: `Term`, `Physical Name` i `Description`.
- `Checks`: wszystkie trzy, tak jak brzmią w języku wyświetlania.

Nowe wyszukiwanie przenosi zaznaczenie na pierwszą komórkę i przewija arkusz na początek.  
Gdy pole zawiera tekst, przycisk `x` z podpowiedzią `Clear search` czyści je i pozostawia w nim kursor tekstowy. Klawisz `Escape` w polu również je czyści.  
W polu skrót `Ctrl + Z` (Windows/Linux) lub `⌘ + Z` (Mac) cofa wpisany tekst, nie zmiany w arkuszu, a klawisze wierszy z sekcji [Dodawanie i usuwanie wierszy](#adding-and-deleting-rows) działają jak zwykłe klawisze tekstowe.  
Przycisk `Add Row` i wstawianie wierszy najpierw czyszczą wyszukiwanie, ponieważ pusty wiersz nie pasuje do żadnego wyszukiwania. Import je zachowuje.

## Zaznaczanie i poruszanie się {#selecting-and-moving}

Siatka zaznacza tak jak arkusz kalkulacyjny:

- Kliknięcie zaznacza komórkę, a przeciągnięcie zaznacza zakres i przewija arkusz przy jego krawędzi. Kombinacja `Shift + click` rozszerza zaznaczenie od aktywnej komórki, a `Ctrl + click` (Windows/Linux) lub `⌘ + click` (Mac) dodaje kolejny zakres.
- Nagłówek kolumny zaznacza swoją kolumnę, numer wiersza swój wiersz, a lewy górny róg wszystkie komórki, tak jak `Ctrl + A` (Windows/Linux) lub `⌘ + A` (Mac).
- Na komputerze Mac kombinacja `Ctrl + click` działa jak kliknięcie prawym przyciskiem myszy – zobacz sekcję [Menu siatki](#the-grids-menu).

Za pomocą klawiatury:

- Klawisze strzałek przesuwają o jedną komórkę, a z przytrzymanym klawiszem `Ctrl` (Windows/Linux) lub `⌘` (Mac) przechodzą do krawędzi arkusza w danym kierunku.
- Klawisze `Home` i `End` przechodzą do pierwszej i ostatniej komórki wiersza, a z przytrzymanym klawiszem `Ctrl` lub `⌘` do pierwszej i ostatniej komórki arkusza.
- Klawisze `Page Up` i `Page Down` przesuwają o ekran wierszy.
- Przytrzymanie klawisza `Shift` z dowolnym z powyższych klawiszy zamiast tego rozszerza zaznaczenie.
- Klawisz `Tab` i skrót `Shift + Tab` przesuwają w prawo i w lewo, a `Shift + Enter` w górę. Sam klawisz `Enter` rozpoczyna edycję komórki – zobacz sekcję [Edycja komórek](#editing-cells).

Gdy wiersze pod zaznaczeniem znikają, na skutek cofnięcia lub usunięcia przez współpracownika, zaznaczenie jest przesuwane z powrotem w obręb pozostałych wierszy.

Przeciągnij prawą krawędź nagłówka kolumny, aby zmienić jej szerokość, lub kliknij krawędź dwukrotnie, aby dopasować kolumnę do najszerszego tekstu w widocznych wierszach. Żaden klawisz nie zmienia szerokości kolumny.

## Edycja komórek {#editing-cells}

Pisanie w zaznaczonej komórce zastępuje jej wartość. Klawisz `Enter` lub `F2` albo dwukrotne kliknięcie rozpoczyna edycję bieżącej wartości z kursorem tekstowym na jej końcu.  
Komórka mieści jeden wiersz tekstu, więc wklejony do niej znak tabulacji lub podział wiersza staje się spacją.

- Klawisz `Enter` zapisuje zmianę i przechodzi w dół, a `Tab` zapisuje ją i przechodzi w prawo. Z klawiszem `Shift` przechodzą w górę lub w lewo.
- Kliknięcie w innym miejscu lub przeniesienie fokusu klawiatury poza siatkę również ją zapisuje.
- Klawisz `Escape` ją anuluje.

![Edycja arkusza Words: wpisanie NUM w miejsce zawartości komórki i naciśnięcie Enter, wstawienie wiersza skrótem ⌥ + Enter i wypełnienie go za pomocą Tab, sortowanie według Word z menu siatki, a następnie wyszukanie ord i wyczyszczenie wyszukiwania klawiszem Esc](/img/demo-dictionary-editing.webp)

Edycja, która pozostawia wartość bez zmian, niczego nie zapisuje, a zapisana edycja stanowi jeden krok cofania swojego arkusza, niezależnie od ilości wpisanego tekstu.  
Klawisz `Delete` lub `Backspace`, gdy żadna edycja nie jest otwarta, czyści wszystkie zaznaczone komórki w jednym kroku.  
Gdy edycja jest otwarta, skróty cofania i ponawiania cofają i ponawiają wpisywanie w komórce, a klawisze wierszy wpisują tekst – zobacz sekcję [Klawisze na karcie](#keys-on-the-tab).  
Każda komórka w arkuszu `Checks` i każda komórka w edytorze tylko do odczytu jest tylko do odczytu i nie otwiera edycji.

Gdy którykolwiek wiersz edycji, wklejenia lub czyszczenia zostanie odrzucony, nic z tej operacji nie jest zapisywane, a powiadomienie o błędzie podaje przyczynę, liczbę wierszy i nazwy pierwszych trzech:

- Nazwa, którą ma inny wiersz arkusza lub którą zapisuje inny wiersz tego samego wklejenia: `Nothing saved: 1 row shares a name with another row (Member)` lub `Nothing saved: 2 rows share a name with another row (…)`. Nazwy są porównywane bez spacji na początku i na końcu, z uwzględnieniem wielkości liter, więc `Member` i `member` się różnią. Pusta nazwa nigdy nie jest odrzucana.
- Wartość `Domain` terminu podana jako tekst, który nie jest nazwą żadnej domeny w arkuszu `Domains`: `Nothing saved: 1 row names an unknown domain (…)`.
- Wiersz, który współpracownik usunął podczas twojej edycji: `Nothing saved: the row was removed`.

Zapis może sięgać poza swoją komórkę:

- Termin, który otrzymuje wartość `Term`, gdy jego wartość `Physical Name` jest pusta, dostaje nazwę złożoną z jego słów, o ile da się ją złożyć – zobacz sekcję [Na podstawie słów](#from-the-words). Dzieje się to raz: nazwa nie jest ponownie składana, gdy słowa później się zmienią.
- Nowa wartość `Data Type` domeny zmienia typ każdej kolumny powiązanej z domeną w tym samym kroku cofania – zobacz sekcję [Domeny i typy danych](#domains-and-data-types).

### Domena terminu {#a-terms-domain}

Klawisz `Enter` lub `F2` albo dwukrotne kliknięcie komórki `Domain` terminu otwiera listę pod komórką lub nad nią, jeśli nad nią jest więcej miejsca, z polem wyszukiwania oznaczonym tekstem `Domain`.  
Lista zawiera pozycję `None`, po niej każdą domenę z nazwą w kolejności arkusza `Domains`, a podświetlenie zaczyna się na domenie powiązanej z terminem lub na pozycji `None`. Wpisanie znaku w komórce otwiera listę już przefiltrowaną według tego znaku.

- Pisanie zawęża listę do domen, których nazwy zawierają wpisany tekst, bez uwzględniania wielkości liter, usuwa pozycję `None` i podświetla pierwsze dopasowanie.
- Klawisze `↑` i `↓` przesuwają podświetlenie, a po dojściu do jednego końca listy przechodzą na drugi.
- Klawisz `Enter` lub `Tab` wybiera podświetlony wiersz, a kliknięcie – kliknięty wiersz, jako jeden krok cofania. Termin zostaje powiązany dokładnie z wybraną domeną, nawet jeśli jest to jedna z dwóch domen o tej samej nazwie, a pozycja `None` odłącza go od domeny.
- Klawisz `Escape` lub kliknięcie poza listą zamyka ją bez zapisywania wpisanego tekstu.

Gdy w arkuszu `Domains` nie ma żadnej domeny z nazwą, pole otwiera się bez listy.  
Wklejony tekst wiąże termin z pierwszą wymienioną domeną o tej nazwie, pusty tekst odłącza go od domeny, a tekst równy temu, co pokazuje komórka, pozostawia powiązanie bez zmian. Każda inna nazwa jest odrzucana – zobacz sekcję [Edycja komórek](#editing-cells). Klawisz `Delete` lub `Backspace` w komórce odłącza termin od domeny, nawet od usuniętej.

## Kopiowanie i wklejanie {#copying-and-pasting}

Skrót `Ctrl + C` (Windows/Linux) lub `⌘ + C` (Mac) kopiuje zaznaczenie jako tekst rozdzielany tabulatorami, po jednym wierszu tekstu na wiersz arkusza, tak jak zapisują go arkusze kalkulacyjne, więc w arkuszu kalkulacyjnym wkleja się on jako komórki. Znak tabulacji lub podział wiersza wewnątrz wartości staje się spacją.  
Kilka zakresów kopiuje się razem tylko wtedy, gdy obejmują te same wiersze, jeden obok drugiego, lub te same kolumny, jeden nad drugim. W przeciwnym razie nic nie jest kopiowane i pojawia się powiadomienie o błędzie `Nothing copied: the ranges share no rows or columns`.

Skrót `Ctrl + V` (Windows/Linux) lub `⌘ + V` (Mac) wkleja tekst rozdzielany tabulatorami, na przykład komórki skopiowane z arkusza kalkulacyjnego, od aktywnej komórki w dół i w prawo:

- Cudzysłowy są wklejane jako tekst, więc komórka arkusza kalkulacyjnego zawierająca podział wiersza nie wkleja się jako jedna komórka.
- Pojedyncza wartość wypełnia każdy zaznaczony zakres.
- Wiersze wykraczające poza ostatni wiersz są dodawane po kolei jako nowe wiersze, więc wklejenie do pustego arkusza go wypełnia.
- Kolumny wykraczające poza ostatnią kolumnę są pomijane, a po zapisaniu reszty informuje o tym powiadomienie `Columns past the last one weren't pasted`.
- Wklejenie kilku komórek zaznacza następnie zapisany blok.

Wklejenie stanowi jeden krok cofania, łącznie z dodanymi przez nie wierszami, i jest odrzucane w całości z powodu zduplikowanej nazwy lub nieznanej domeny – zobacz sekcję [Edycja komórek](#editing-cells).  
Kopiowanie, wklejenie lub czyszczenie obejmujące ponad milion komórek nic nie robi i pojawia się powiadomienie o błędzie `Nothing done: the selection covers too many cells`.  
Wycinanie, czyli skrót `Ctrl + X` (Windows/Linux) lub `⌘ + X` (Mac), nic nie robi w arkuszu. Kopiowanie i wklejanie na tej karcie nigdy nie sięgają diagramu, a gdy edycja komórki jest otwarta, działają na tekście w komórce.

## Dodawanie i usuwanie wierszy {#adding-and-deleting-rows}

Przycisk `Add Row` dodaje jeden pusty wiersz na końcu arkusza. Czyści wyszukiwanie, zaznacza pierwszą komórkę nowego wiersza i przekazuje siatce fokus klawiatury, więc pisanie wypełnia tę komórkę.  
Przycisk `Delete Rows` usuwa każdy wiersz objęty zaznaczeniem, w dowolnej kolumnie, a jedno cofnięcie przywraca je wszystkie na ich miejsca. Jego podpowiedź podaje klawisz, który robi to samo.

Gdy fokus klawiatury jest w siatce i żadna komórka nie jest edytowana:

- `Alt + Enter` (Windows/Linux) lub `⌥ + Enter` (Mac) wstawia poniżej zaznaczenia tyle pustych wierszy, ile ono obejmuje.
- `Alt + Shift + Enter` (Windows/Linux) lub `⌥ + Shift + Enter` (Mac) wstawia je powyżej.
- `Alt + Backspace` lub `Alt + Delete` (Windows/Linux) albo `⌥ + Backspace` lub `⌥ + Delete` (Mac) usuwa wiersze objęte zaznaczeniem.

Działają tak samo jak pozycje wstawiania i usuwania wierszy w menu siatki – zobacz sekcję [Menu siatki](#the-grids-menu). Wstawianie czyści wyszukiwanie i umieszcza nowe wiersze bezpośrednio nad pierwszym wierszem objętym zaznaczeniem lub bezpośrednio pod ostatnim. Zaznacza je w pierwszej kolumnie, z pierwszym z nich jako aktywnym, i stanowi jeden krok cofania.

Te klawisze to powiązania poleceń `Add Column` i `Remove Column` z karty [Skróty klawiaturowe](./settings.md#shortcuts), więc host, który zmienia je za pomocą metody [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), zmienia też te klawisze. Skrót `Alt + Shift + Enter` to klawisz polecenia `Add Column` z dodanym klawiszem `Shift` i nie ma tam własnego wiersza.  
W otwartej edycji i w polu wyszukiwania są to zwykłe klawisze tekstowe, więc na komputerze Mac `⌥ + Backspace` usuwa wyraz. W arkuszu `Checks` i w edytorze tylko do odczytu nic nie robią. Na tej karcie nigdy nie dodają ani nie usuwają kolumny tabeli.  
W aplikacji Obsidian docierają do karty nawet wtedy, gdy ten sam klawisz wykorzystuje skrót klawiaturowy aplikacji Obsidian.

Wiersz, którego nigdy nie wypełniono lub z którego usunięto wszystkie wartości, jest widoczny w swoim arkuszu i dociera do współpracowników, ale plik go pomija, więc po ponownym otwarciu diagramu go nie ma.

## Menu siatki {#the-grids-menu}

Kliknij prawym przyciskiem myszy komórkę w arkuszu `Domains`, `Words` lub `Terms`, aby otworzyć menu siatki. Komórka spoza zaznaczenia najpierw staje się zaznaczeniem.  
Kliknięcie prawym przyciskiem myszy pod ostatnim wierszem lub na prawo od ostatniej kolumny otwiera menu dla bieżącego zaznaczenia, więc w pustym arkuszu otwiera się ono w dowolnym miejscu pod nagłówkami. Klawisz menu lub skrót `Shift + F10` otwiera je dla aktywnej komórki.

- Pozycje `Insert 1 row above`, `Insert 1 row below` i `Delete 1 row`, z których każda podaje liczbę wierszy objętych zaznaczeniem, na przykład `Insert 3 rows above`, z klawiszem po prawej stronie – zobacz sekcję [Dodawanie i usuwanie wierszy](#adding-and-deleting-rows).
- Pozycje `Sort by <column>, ascending` i `Sort by <column>, descending`, które podają nazwę kolumny klikniętej prawym przyciskiem myszy, na przykład `Sort by Word, ascending` – zobacz sekcję [Sortowanie](#sorting). Na prawo od ostatniej kolumny nie są dostępne.
- Pozycje `Import CSV` i `Export CSV`, które działają tak samo jak przyciski na pasku – zobacz sekcję [Importowanie i eksportowanie plików CSV](#importing-and-exporting-csv).

Gdy żaden wiersz nie jest widoczny, w pustym arkuszu lub przy wyszukiwaniu, do którego nic nie pasuje, widoczne są tylko pozycje `Insert 1 row below`, `Import CSV` i `Export CSV`.  
Arkusz `Checks` i edytor tylko do odczytu otwierają zamiast tego własne menu przeglądarki, podobnie jak kliknięcie prawym przyciskiem myszy nagłówka lub paska przewijania.  
Menu zamyka się po wybraniu pozycji, po naciśnięciu klawisza `Escape`, po kliknięciu w innym miejscu karty, gdy zmienia się zaznaczenie lub arkusz, oraz gdy zmieniają się wiersze arkusza, na skutek twojej edycji lub edycji współpracownika.

## Sortowanie {#sorting}

Pozycje `Sort by <column>, ascending` i `Sort by <column>, descending` zmieniają kolejność samych wierszy arkusza, a nie tylko widoku. Nowa kolejność jest zapisywana w pliku, widzą ją współpracownicy i stosuje ją polecenie `Export CSV`, a jedno cofnięcie przywraca poprzednią kolejność.  
Wiersze są porównywane według tekstu wyświetlanego w komórce, a komórka `Domain` terminu według nazwy domeny, w porządku alfabetycznym języka wyświetlania, przy czym liczby są porównywane według wartości, więc `2` występuje przed `10`. Puste komórki trafiają na koniec w obu kierunkach, a wiersze, które w porównaniu są sobie równe, zachowują swoją kolejność. Sortowanie arkusza, który ma już taką kolejność, niczego nie rejestruje.  
Wyszukiwanie pozostaje bez zmian, podobnie jak zaznaczenie, którego komórki zawierają teraz inne wiersze.

## Importowanie i eksportowanie plików CSV {#importing-and-exporting-csv}

Każdy z arkuszy `Domains`, `Words` i `Terms` można zaimportować z pliku CSV i wyeksportować do takiego pliku. Te pliki należą wyłącznie do karty Słownik: pozycje `Import` i `Export` menu kontekstowego kanwy ich nie odczytują ani nie zapisują – zobacz stronę [Importowanie i eksportowanie plików](./file-import-export.md).

### Importowanie {#importing}

Przycisk `Import CSV` na pasku lub pozycja `Import CSV` w menu siatki otwiera własne okno wyboru pliku przeglądarki dla plików `.csv`, a nie okno dialogowe importu hosta. Ponowne wybranie tego samego pliku importuje go ponownie.  
Plik trafia do słownika wskazanego przez jego wiersz nagłówka, niezależnie od tego, który arkusz jest wyświetlany, a karta pokazuje następnie ten arkusz i przekazuje jego siatce fokus klawiatury. Arkusz zachowuje wyszukiwanie, zaznaczenie i przewinięcie, więc wiersze ukryte przez wyszukiwanie lub dodane poniżej widocznego obszaru pozostają niewidoczne.  
Plik jest odczytywany jako UTF-8, ze znacznikiem kolejności bajtów (BOM) lub bez niego, albo jako EUC-KR, gdy nie jest poprawnym plikiem UTF-8, tak jak starsze pliki standardu danych publicznych.

![Otwieranie karty Słownik z paska narzędzi, a następnie importowanie domen, słów i terminów za pomocą Import CSV, przy czym każdy plik przełącza kartę na swój arkusz i informuje o tym, co dodał](/img/demo-dictionary-import.webp)

Jak wiersze trafiają do arkusza:

- Każdy wiersz z nazwą aktualizuje wiersz arkusza o tej nazwie w polach, dla których plik ma kolumny. Pola, dla których w pliku brakuje kolumn, pozostają bez zmian. Nazwy są porównywane bez spacji na początku i na końcu, z uwzględnieniem wielkości liter.
- Nazwy, których brakuje w arkuszu, są dodawane za jego ostatnim wierszem w kolejności z pliku.
- Import nigdy nie usuwa wiersza.
- Wiersz z pustą nazwą jest pomijany. Gdy plik zawiera nazwę dwukrotnie, obowiązuje późniejszy wiersz, a wcześniejszy liczy się jako pominięty. Puste linie nie są wierszami.
- Domena terminu jest wyszukiwana według nazwy, czyli jako pierwsza domena o tej nazwie, a nazwa, której nie ma żadna domena, pozostawia termin niepowiązany, więc najpierw zaimportuj domeny.

Jeden import stanowi jeden krok cofania tego arkusza.  
Powiadomienie brzmi wtedy na przykład `1 added · 1 updated · 2 skipped`. Wiersz identyczny z wierszem arkusza nie liczy się ani jako dodany, ani jako zaktualizowany, więc ponowny import tego samego pliku niczego nie zmienia i nie rejestruje kroku.  
Gdy terminy z pliku wskazują domeny, których brakuje w diagramie, drugi wiersz powiadomienia podaje pierwsze trzy, na przykład `4 unknown domains: 연월일, 금액, 번호`.  
Plik, którego wiersz nagłówka nie pasuje do żadnego układu albo pasuje do dwóch, niczego nie wprowadza i pojawia się powiadomienie o błędzie `Couldn't read this file as words, terms or domains`.

### Układy plików {#file-layouts}

Każdy słownik odczytuje dwa układy plików. Pierwszy to własny układ edytora, który zapisuje polecenie `Export CSV`, z nazwami pól jako wierszem nagłówka:

| Słownik | Wiersz nagłówka | Wymagane w pliku |
| --- | --- | --- |
| Words | `name,abbreviation,englishName,description,synonyms,forbiddenWords` | `name`, `abbreviation` |
| Terms | `name,physicalName,domain,description,synonyms` | `name`, `physicalName` |
| Domains | `name,category,dataType,description` | `name`, `dataType` |

Kolumny mogą występować w dowolnej kolejności, kolumna `domain` terminu zawiera nazwę domeny, a każda inna kolumna jest ignorowana. W wierszu nagłówka wielkość liter ma znaczenie, a komórki są odczytywane dokładnie tak, jak je zapisano, łącznie ze spacjami.

Drugi to układ plików koreańskiego standardu danych publicznych (공통표준):

| Słownik | Wymagane w pliku | Odczytywane również |
| --- | --- | --- |
| Words | `공통표준단어명` | `공통표준단어영문약어명` (skrót), `공통표준단어 영문명` (nazwa angielska), `공통표준단어 설명` (opis), `이음동의어 목록` (synonimy), `금칙어 목록` (słowa zakazane) |
| Terms | `공통표준용어명` | `공통표준용어영문약어명` (nazwa fizyczna), `공통표준도메인명` (domena, według nazwy), `공통표준용어설명` (opis), `용어 이음동의어 목록` (synonimy) |
| Domains | `공통표준도메인명`, `데이터타입` | `공통표준도메인분류명` (kategoria), `공통표준도메인설명` (opis), `데이터길이`, `데이터소수점길이` |

Kolumny `데이터타입`, `데이터길이` i `데이터소수점길이` domeny łączą się w jeden typ danych: `NUMERIC(15,2)`, `CHAR(8)`, sam typ tam, gdzie nie ma długości, na przykład `DATE`, a skala 0 jest pomijana, jak w `NUMERIC(15)`.  
W tych plikach z komórek usuwane są spacje na początku i na końcu, a inne kolumny, takie jak historia zmian, są ignorowane.  
W obu układach spacje w nazwie kolumny w wierszu nagłówka nie mają znaczenia.

### Eksportowanie {#exporting}

Przycisk `Export CSV` na pasku lub pozycja `Export CSV` w menu siatki zapisuje wyświetlany arkusz we własnym układzie edytora: każdy wiersz w kolejności w arkuszu, niezależnie od tego, co pokazuje wyszukiwanie, z domeną terminu zapisaną według nazwy lub pustą w przypadku usuniętej domeny.  
Plik jest zapisywany w kodowaniu UTF-8 ze znacznikiem kolejności bajtów (BOM) i znakami końca wiersza CRLF, a w cudzysłów ujmowane jest tylko pole zawierające cudzysłów, przecinek lub podział wiersza. Otwiera się w arkuszu kalkulacyjnym i importuje się z powrotem do tych samych wierszy.  
Ma nazwę `<database name>-<timestamp>-words.csv`, `-terms.csv` lub `-domains.csv` i jest zapisywany tak samo jak inne eksporty edytora – zobacz sekcję [Eksportowanie](./file-import-export.md#exporting).

Arkusza `Checks` nie można eksportować, a edytor tylko do odczytu nie oferuje importu ani eksportu.

## Cofanie i ponawianie {#undo-and-redo}

Każdy z arkuszy `Domains`, `Words` i `Terms` ma własną historię cofania, oddzielną od historii diagramu. Na tej karcie skróty `Ctrl + Z` i `Ctrl + Shift + Z` (Windows/Linux) lub `⌘ + Z` i `⌘ + Shift + Z` (Mac) oraz przyciski `Undo` i `Redo` na pasku narzędzi działają na wyświetlanym arkuszu, a pasek narzędzi nie pokazuje przycisku `Time Travel`. W arkuszu `Checks` nic nie robią.  
Polecenie Cofnij na karcie ERD nigdy nie wycofuje zmiany arkusza – zobacz sekcję [Arkusze karty Słownik](./undo-redo.md#dictionary-sheets).

## Klawisze na karcie {#keys-on-the-tab}

Gdy fokus klawiatury jest na karcie, działają następujące skróty klawiaturowe edytora – zobacz sekcję [Skróty klawiaturowe](./settings.md#shortcuts):

- Polecenie `Search`, czyli `Ctrl + K` (Windows/Linux) lub `⌘ + K` (Mac), otwiera [Szybkie wyszukiwanie](./quick-search.md).
- Polecenie `Toggle Explorer`, czyli `Ctrl + F` (Windows/Linux) lub `⌘ + F` (Mac), przełącza na kartę ERD i otwiera [Eksplorator](./explorer.md#opening-and-closing) z fokusem w jego polu wyszukiwania.
- Polecenia `Undo` i `Redo` działają na wyświetlanym arkuszu – zobacz sekcję [Cofanie i ponawianie](#undo-and-redo).
- Polecenia `Add Column` i `Remove Column` wstawiają i usuwają wiersze – zobacz sekcję [Dodawanie i usuwanie wierszy](#adding-and-deleting-rows).

Gdy otwarta jest edycja komórki, łącznie z listą domen terminu, polecenia `Search` i `Toggle Explorer` nic nie robią, więc wpisany tekst nie ginie.

Każdy inny skrót klawiaturowy edytora pozostaje na karcie i nigdy nie dociera do kanwy: `Alt + N` (Windows/Linux) lub `⌥ + N` (Mac) nie dodaje tabeli, a klawisze `Delete` i `Backspace` niczego nie usuwają na kanwie.  
Zamiast tego na arkusz działają własne klawisze siatki: `Enter` rozpoczyna edycję komórki, `Delete` i `Backspace` czyszczą zaznaczone komórki, `Ctrl + A` (Windows/Linux) lub `⌘ + A` (Mac) zaznacza wszystkie komórki, a `Escape` anuluje edycję, zamyka menu siatki lub czyści pole wyszukiwania. Kopiowanie, wycinanie i wklejanie również pozostają na karcie – zobacz sekcję [Kopiowanie i wklejanie](#copying-and-pasting).

## Edytory tylko do odczytu {#read-only-editors}

W edytorze z atrybutem [`readonly`](../../api/erd-editor-element.md#readonly) karta się otwiera i pokazuje każdy arkusz.  
Przełączanie arkuszy, wyszukiwanie, zaznaczanie, przewijanie, zmiana szerokości kolumn i kopiowanie działają jak zwykle, podobnie jak przechodzenie z arkusza `Checks` do obiektu kontroli klawiszem `Enter` lub dwukrotnym kliknięciem. Oznaczenia kontroli również są widoczne.

Żadnej komórki nie można edytować ani wyczyścić i nie można do niej niczego wkleić, a każda komórka, której nie oznacza żadna kontrola, ma szare tło komórek tylko do odczytu.  
Przyciski `Add Row`, `Delete Rows`, `Import CSV` i `Export CSV` są ukryte, klawisze wierszy nic nie robią, a kliknięcie prawym przyciskiem myszy otwiera menu przeglądarki. Pusty arkusz nie wyświetla wskazówki, a pasek narzędzi nie pokazuje przycisków `Undo` ani `Redo`.

## Współpracownicy i plik {#collaborators-and-the-file}

Plik diagramu przechowuje słowa, terminy i domeny w kolejności z arkuszy, również tej ustalonej przez sortowanie, i pomija wiersz, który nie zawiera żadnej wartości.  
Przechowuje też nazwę logiczną każdej tabeli i kolumny, informację, czy każda nazwa fizyczna należy do słowników, oraz powiązanie każdej kolumny z domeną, o ile domena jest wymieniona. Kontrole i oznaczenia są obliczane na tej podstawie i nigdy nie są zapisywane.

W [sesji wspólnej edycji](../../api/advanced/collaborative-editing.md) edytory na bieżąco widzą nawzajem swoje zmiany w słownikach, łącznie z sortowaniem i wstawianiem wierszy. Każdy zachowuje własny arkusz, wyszukiwanie i zaznaczenie, a jego historie arkuszy zawierają tylko jego własne zmiany.  
Edycja lub wklejenie do wiersza, który współpracownik w międzyczasie usunął, niczego nie zapisuje i pojawia się powiadomienie `Nothing saved: the row was removed`.  
Edytor w wersji sprzed karty Słownik zapisuje diagram bez jego nazw logicznych, powiązań z domenami i słowników – zobacz sekcję [Mieszanie wersji](../../api/advanced/collaborative-editing.md#mixing-releases).

Operacja `Import` w formacie Schemat SQL, GraphQL, DBML lub AML zachowuje słowniki, operacja `Import` z pliku JSON zastępuje je słownikami z pliku, a operacja `Import and Add` nie wprowadza żadnych – zobacz sekcję [Importowanie plików zewnętrznych](./file-import-export.md#importing-external-files).  
Agent kodujący edytuje słowa, terminy i domeny, ustawia nazwy logiczne i domeny, ponownie generuje nazwy fizyczne i pobiera listę kontroli przez serwer MCP – zobacz sekcje [Słowniki](../../mcp/tools.md#dictionaries) i [Kontrole słowników](../../mcp/tools.md#dictionary-checks). Nie ma narzędzia do obsługi plików CSV.
