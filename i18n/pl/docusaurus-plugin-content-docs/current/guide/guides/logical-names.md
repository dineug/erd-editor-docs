---
sidebar_position: 4
description: Nadawanie tabelom i kolumnom nazw logicznych, wyświetlanie nazw fizycznych, nazw logicznych lub obu za pomocą Widoku nazw, uzupełnianie nazw terminów podczas pisania, wiązanie kolumn z domenami oraz sprawdzanie, gdzie jeszcze nazwy podążają za widokiem.
---

# Nazwy logiczne

Tabela i każda z jej kolumn mogą mieć obok nazwy także nazwę logiczną. Nazwa logiczna to ta, którą czytają ludzie, na przykład `Customer Name` dla `CUST_NM`. Sama nazwa jest nazwą fizyczną, czyli tą, którą zapisują [Schemat SQL](./schema-sql.md) i [Generator kodu](./code-generator.md).  
Widok nazw decyduje o tym, którą z nich wyświetla kanwa ERD: nazwy fizyczne, nazwy logiczne czy obie – zobacz sekcję [Widok nazw](#name-view).  
Nazwa logiczna może też dać swojej tabeli lub kolumnie nazwę fizyczną generowaną na podstawie słów i terminów z karty [Słownik](./dictionary.md) – zobacz sekcję [Generowanie nazw fizycznych](./dictionary.md#deriving-physical-names).  
Kolumnę można powiązać z domeną, czyli nazwanym typem danych przechowywanym w arkuszu `Domains` na karcie Słownik, takim jak `Name` dla `VARCHAR(100)`, a wtedy kolumna ma typ danych tej domeny – zobacz sekcję [Komórka domeny](#the-domain-cell).  
Schemat SQL może wpisywać każdą nazwę logiczną do pustego komentarza – zobacz sekcję [Nazwy logiczne jako komentarze](./schema-sql.md#logical-names-as-comments).

## Widok nazw {#name-view}

Są trzy widoki, a każdy z nich wyświetla nagłówek i wiersze tabeli na swój sposób:

- Widok `Physical Names`, czyli widok nowego diagramu, nie wyświetla żadnej nazwy logicznej. Nagłówek pokazuje nazwę tabeli oraz, gdy włączona jest opcja View Option → `Table Comment`, jej komentarz, a każdy wiersz pokazuje swoje komórki w [kolejności kolumn](./settings.md#adjusting-column-order).
- Widok `Logical Names` wyświetla nazwę logiczną w miejscu każdej nazwy: w nagłówku i w każdym wierszu tam, gdzie w kolejności kolumn stoi pozycja `Name`. Komórka typu w wierszu może przedstawiać domenę kolumny, jak opisano poniżej.
- Widok `Both Names` wyświetla nazwę logiczną obok nazwy. Nagłówek pokazuje nazwę logiczną, potem nazwę, a na końcu komentarz, a każdy wiersz zyskuje komórkę `Logical Name`, którą kolejność kolumn domyślnie umieszcza tuż przed pozycją `Name`.

W miejscu pustej nazwy logicznej, także takiej, która składa się tylko ze spacji, wyświetlany jest przyciemniony zamiennik. W widoku `Logical Names` jest nim nazwa wyświetlana w jej miejscu albo tekst zastępczy `table` lub `column`, gdy nazwa również jest pusta. W widoku `Both Names` jest nim tekst zastępczy `logical`.

W widoku `Logical Names` kolumna powiązana z domeną z nazwą, zapisaną w arkuszu `Domains` na karcie Słownik, pokazuje w komórce typu nazwę tej domeny zamiast swojego typu danych. Każda inna kolumna pokazuje tam swój typ danych.  
Gdy włączona jest opcja View Option → `Domain`, domena ma własną komórkę, a komórka typu zachowuje typ danych, więc żaden wiersz nie pokazuje domeny dwa razy – zobacz sekcję [Komórka domeny](#the-domain-cell).

Każda tabela jest tak szeroka jak komórki, które wyświetla w danym widoku, więc przełączenie widoku zmienia rozmiar tabel i na nowo rozmieszcza ich łączniki. Żadna tabela się nie przesuwa.  
Przy powiększeniu `70%` i mniejszym tabela zwija się do swojej nazwy – zobacz sekcję [Powiększanie i pomniejszanie](./table-related-functions.md#zoom-inout). W widoku `Logical Names` pokazuje nazwę logiczną albo, dopóki jej nie ma, przyciemnioną nazwę. W widoku `Both Names` pokazuje nazwę logiczną, a pod nią w osobnej linii nazwę, albo samą nazwę, dopóki nie ma nazwy logicznej.

Kontrole Słownika mogą wyświetlać nazwę logiczną lub nazwę kolorem czerwonym albo bursztynowym tam, gdzie ją zgłaszają – zobacz sekcję [Oznaczenia na kanwie](./dictionary.md#marks-on-the-canvas).

## Przełączanie widoku {#switching-the-view}

Widok można przełączyć w czterech miejscach, a każde z nich wymienia widoki `Physical Names`, `Logical Names` i `Both Names` z zaznaczonym bieżącym widokiem:

- Przycisk `Name View` na [pasku narzędzi kanwy](./table-related-functions.md#canvas-toolbar), między czterema notacjami relacji a trybem zen. Pokazuje nazwę bieżącego widoku ze strzałką w dół, a jego podpowiedź brzmi `Name View`. Kliknięcie otwiera listę nad paskiem narzędzi, a wybór pozycji ją zamyka.
- Pozycja `Name View` w menu kontekstowym kanwy, tuż po pozycji `View Option`: podmenu z trzema widokami. Po wyborze pozycji menu pozostaje otwarte.
- Ta sama lista na pasku narzędzi karty Wizualizacja w trybie `Flow`, po menu wyświetlania wierszy – zobacz sekcję [Pasek narzędzi](./visualization.md#toolbar).
- Pozycja `Name View` w palecie [Szybkie wyszukiwanie](./quick-search.md#what-the-palette-lists), tuż po pozycji `Tab`, wyświetlana tylko na karcie ERD. Jej podmenu otwiera się z podświetleniem na bieżącym widoku.

![Przełączanie Widoku nazw na Logical Names z paska narzędzi kanwy, na Both Names z menu kanwy i z powrotem na Physical Names, przy czym kolumna ordered_at, która nie ma nazwy logicznej, jest najpierw przyciemniona, a potem wyświetlana jako tekst zastępczy logical](/img/demo-name-view.webp)

Wszystkie cztery ustawiają ten sam widok. Górny pasek narzędzi nie ma do tego przycisku.

Przełączenie widoku zachowuje zaznaczenie i nie jest rejestrowane w [historii cofania](./undo-redo.md#what-the-history-records).  
Fokus z komórki, której nowy widok nie wyświetla, przechodzi na komórkę wyświetlaną w jej miejscu: nazwa i nazwa logiczna zastępują się wzajemnie, tak jak typ i domena. Edytor otwarty w tej komórce się zamyka. Włączenie lub wyłączenie opcji View Option → `Domain` przenosi fokus w ten sam sposób.  
Gdy blokada `Name View` jest włączona, tak jak w nowym diagramie, przełączenie zmienia tylko twój ekran, a plik zachowuje widok z chwili zablokowania. Przy wyłączonej blokadzie plik zapisuje widok, na który przełączysz – zobacz sekcję [Blokada](./settings.md#lock).

## Wpisywanie nazwy logicznej {#writing-a-logical-name}

Widok `Physical Names` nie wyświetla nazw logicznych, więc aby wpisać nazwę logiczną na kanwie, przełącz na widok `Logical Names` lub `Both Names`:

- W widoku `Logical Names` komórki nazw w nagłówku i w wierszach zawierają nazwy logiczne, więc w tym widoku nazwy fizycznej nie można edytować na kanwie.
- W widoku `Both Names` komórki nazw logicznych zawierają nazwy logiczne, a komórki nazw – nazwy fizyczne.

Komórkę nazwy logicznej edytuje się jak każdą inną komórkę: zacznij klawiszem `Enter` lub dwukrotnym kliknięciem – zobacz stronę [Edycja tabel](./table-editing.md). Edytor otwarty na pustej nazwie logicznej pokazuje jako tekst zastępczy to, co wyświetlała komórka: nazwę w widoku `Logical Names`, a tekst `logical` w widoku `Both Names`.  
Wpisywany tekst trafia tylko do nazwy logicznej. Gdy po zmianie nazwy logicznej edytor się zamknie (`Enter`, `Tab`, `Escape` lub kliknięcie w innym miejscu), na jej podstawie generowana jest nazwa fizyczna jako osobny krok cofania po twoim wpisywaniu. Nazwa fizyczna wpisana samodzielnie pozostaje bez zmian – zobacz sekcję [Generowanie nazw fizycznych](./dictionary.md#deriving-physical-names).

Klawisz `Tab` i skrót `Shift + Tab` przechodzą po kolei przez komórki wyświetlane w danym widoku – zobacz sekcję [Klawisz Tab](./table-editing.md#tab-key):

- W widoku `Logical Names` kolejno: nazwa logiczna nagłówka, potem jego komentarz, a potem komórki każdego wiersza w kolejności kolumn, z nazwą logiczną w miejscu nazwy.
- W widoku `Both Names` kolejno: nazwa logiczna, nazwa i komentarz nagłówka, a potem komórki każdego wiersza w kolejności kolumn, domyślnie zaczynając od komórki `Logical Name`.

Skrót `Alt + Enter` (Windows/Linux) lub `⌥ + Enter` (Mac) dodaje kolumnę i ustawia fokus na jej komórce nazwy, którą w widoku `Logical Names` jest jej nazwa logiczna.

Kolumna klucza obcego dodana przez relację kopiuje razem z typem nazwę logiczną i domenę swojego klucza – zobacz sekcję [Relacje identyfikujące](./relationship-editing.md#identifying-relationships).  
Kopiowanie kolumn do arkusza kalkulacyjnego i wklejanie kolumn z niego korzystają z komórek wyświetlanych w danym widoku, łącznie z komórkami nazwy logicznej i domeny – zobacz sekcję [Kopiowanie/wklejanie kolumn](./table-editing.md#copyingpasting-columns).

## Uzupełnianie nazw terminów {#completing-term-names}

Podczas wpisywania w komórce nazwy logicznej, w nagłówku lub w wierszu, lista pod komórką proponuje terminy, których nazwy zaczynają się od wpisanego tekstu, bez uwzględniania wielkości liter i spacji przed nim. Termin to cała nazwa logiczna przechowywana w arkuszu `Terms` na karcie Słownik wraz z nazwą fizyczną i domeną, które nadaje. Lista pokazuje do ośmiu terminów posortowanych według nazwy, z wyróżnionym wpisanym tekstem. Dopóki żaden termin tak się nie zaczyna, lista się nie pojawia.

![Dodawanie kolumny za pomocą ⌥ + Enter w widoku Both Names, wybieranie Order Amount z listy terminów pod jej nazwą logiczną w celu wypełnienia ORD_AMT, DECIMAL(10,2) i domeny Amount, a potem wpisywanie Order Date, dla której słowa dają nazwę ORD_DT, gdy Enter zamyka edytor](/img/demo-logical-names.webp)

- Na początku nic nie jest podświetlone. Klawisze `↑` i `↓` przesuwają podświetlenie, przeskakując z jednego końca listy na drugi, a podświetlony termin pokazuje klawisz `Enter`.
- Klawisz `Enter` na podświetlonym terminie wpisuje jego nazwę jako nazwę logiczną i kończy edycję. Jeśli nazwa fizyczna nie została wpisana samodzielnie, w tym samym kroku cofania od razu generowana jest nazwa fizyczna na podstawie terminu, a kolumna otrzymuje też domenę terminu. Klawisz `Enter`, gdy nic nie jest podświetlone, kończy edycję i zachowuje wpisany tekst.
- Kliknięcie terminu wpisuje go w ten sam sposób i pozostawia edytor otwarty.
- Klawisz `Escape`, gdy lista jest widoczna, zamyka tylko listę, a kolejne naciśnięcie klawisza `Escape` kończy edycję.
- Klawisz `Tab` przechodzi dalej z tekstem w takiej postaci, w jakiej go wpisano, a nazwa fizyczna jest generowana na jego podstawie przy zamknięciu edytora.
- Gdy edytor metody wprowadzania składa znaki, strzałki i klawisz `Enter` służą do składania znaków.

To, co termin nadaje tabeli lub kolumnie, opisano w sekcji [Generowanie nazw fizycznych](./dictionary.md#deriving-physical-names).

## Komórka domeny {#the-domain-cell}

Opcja View Option → `Domain`, domyślnie wyłączona, daje każdemu wierszowi we wszystkich widokach komórkę domeny w miejscu, które w kolejności kolumn zajmuje pozycja `Domain`, domyślnie tuż po pozycji `DataType` – zobacz sekcję [Opcje widoku tabel](./table-related-functions.md#table-view-options).  
Komórka pokazuje nazwę domeny, z którą powiązana jest kolumna, albo – w przypadku kolumny niepowiązanej z żadną domeną z arkusza `Domains` – przyciemniony tekst zastępczy `domain`.

![Włączanie View Option → Domain, wybieranie Amount w komórce domeny kolumny PAY_AMT po zawężeniu listy tekstem amo, zmienianie typu danych domeny Amount na DECIMAL(12,2) na karcie Słownik i sprawdzanie, że kolumna zmieniła się razem z nim, a potem wpisywanie NUMERIC(12,2) w kolumnie, co odłącza ją od domeny](/img/demo-domains.webp)

Klawisz `Enter` lub dwukrotne kliknięcie otwiera nad komórką selektor: puste pole, którego tekstem zastępczym jest tekst komórki, pod nim pozycja `None`, a dalej każda domena z nazwą z arkusza `Domains` w kolejności w arkuszu. Podświetlenie zaczyna się na powiązanej domenie albo na pozycji `None`.

- Wpisywanie zostawia na liście tylko domeny, których nazwy zawierają wpisany tekst bez uwzględniania wielkości liter, usuwa pozycję `None` i podświetla pierwszą domenę. Klawisze `↑` i `↓` przesuwają podświetlenie.
- Klawisz `Enter` wiąże z kolumną podświetloną domenę, a kliknięcie – klikniętą. Oba sposoby nadają kolumnie typ danych domeny w jednym kroku cofania i kończą edycję. Pozycja `None` odłącza kolumnę od domeny i zachowuje jej typ danych.
- Wpisany tekst nigdy nie trafia do kolumny. Dopóki arkusz `Domains` nie ma żadnej domeny z nazwą, lista się nie pojawia, a klawisz `Enter` kończy edycję, niczego nie zapisując.

W widoku `Logical Names` przy wyłączonej opcji View Option → `Domain` komórka typu, która pokazuje nazwę domeny, otwiera ten selektor, a komórka, która pokazuje typ danych, otwiera edytor typu danych – zobacz sekcję [Autouzupełnianie typu danych](./table-editing.md#datatype-autocomplete). Aby powiązać domenę z kolumną, która nie ma domeny, włącz komórkę domeny.  
Powiązana kolumna ma typ danych swojej domeny i podąża za nim, gdy typ domeny się zmienia, a wpisanie innego typu w jej komórce typu danych odłącza ją od domeny – zobacz sekcję [Domeny i typy danych](./dictionary.md#domains-and-data-types).

## Poza kanwą {#beyond-the-canvas}

Większość innych miejsc, w których pojawia się nazwa tabeli lub kolumny, również podąża za Widokiem nazw:

- Widok `Physical Names` pokazuje nazwę.
- Widok `Logical Names` pokazuje nazwę logiczną albo, dopóki nazwa logiczna jest pusta, nazwę – przyciemnioną tam, gdzie dane miejsce może ją przyciemnić.
- Widok `Both Names` pokazuje nazwę logiczną, a po niej nazwę: wyciszoną w wierszu tekstu, w drugiej linii w etykiecie w trybie Graf i w nawiasie tam, gdzie jeden tekst musi zawierać obie, na przykład `Member (member)`. Tabela lub kolumna bez nazwy logicznej pokazuje samą nazwę.

Lista posortowana według nazwy, taka jak tabele w Eksploratorze lub wiersze `#` w Szybkim wyszukiwaniu, we wszystkich widokach pozostaje posortowana według nazwy, nigdy według nazwy logicznej.

Miejsca, które podążają za widokiem:

- Na karcie Wizualizacja kafelki trybu Przepływ – zobacz sekcję [Nazwy na kafelkach](./visualization.md#names-on-the-cards) – oraz etykiety i podgląd po najechaniu w trybie Graf – zobacz sekcje [Odczytywanie grafu](./visualization.md#reading-the-graph) i [Podgląd po najechaniu](./visualization.md#hover-preview).
- Panel [Właściwości tabeli](./table-related-functions.md#table-properties): jego etykiety, a na karcie `Indexes` wiersze `Columns` i lista `Index order` – zobacz sekcję [Indeksy](./table-related-functions.md#indexes).
- Wiersze tabel i kolumn w panelu [Eksplorator](./explorer.md#the-tree) oraz tabele wymienione pod każdą grupą tabel.
- Wiersze `#` w Szybkim wyszukiwaniu – zobacz sekcję [Przeszukiwanie diagramu](./quick-search.md#searching-the-diagram).
- Drzewo zmian i obie strony nakładki [Podgląd różnic](./table-related-functions.md#diff-viewer).
- Okno dialogowe [Mapuj kolumny](./relationship-editing.md#map-columns) oraz podpowiedź `<parent> has no primary key to copy`, którą może pokazać pozycja `Create new columns` podczas rysowania relacji – zobacz sekcję [Tworzenie relacji](./editing-start.md#relationship-creation).
- Kopia wierszy, którą przeciąganie kolumn przenosi nad pustą kanwą i która pokazuje komórki nazwy i typu każdego wiersza tak, jak wyświetla je ten wiersz – zobacz sekcję [Zmiana kolejności i przenoszenie kolumn](./table-editing.md#rearranging-and-moving-columns).
- Kolumna `Target` arkusza `Checks` na karcie Słownik – zobacz sekcję [Arkusz Kontrole](./dictionary.md#the-checks-sheet).
- [Wyeksportowany obraz](./file-import-export.md#image).

Kilka miejsc zachowuje nazwy niezależnie od widoku: wiersze indeksów i kluczy obcych w Eksploratorze, grupa `Keys` na karcie `Indexes` we Właściwościach tabeli, pozycja `New column: <name>` w oknie dialogowym „Mapuj kolumny” oraz położenie podane obok wiersza `@` lub `:` w Szybkim wyszukiwaniu.

Podgląd różnic, [Podróż w czasie](./undo-redo.md#time-travel), podgląd `Force` funkcji [Automatyczny układ](./table-related-functions.md#auto-layout) i okno dialogowe `Export image` otwierają się z tym ustawieniem Widoku nazw, które właśnie widzisz, niezależnie od widoku zapisanego w pliku. Każde z nich zachowuje ten widok, dopóki jest otwarte.  
Każde użycie funkcji Automatyczny układ oraz operacja `Import` lub `Import and Add` w formacie Schemat SQL, GraphQL, DBML lub AML rozmieszczają tabele z szerokościami, jakie mają one w twoim widoku.

## Wyszukiwanie według nazwy logicznej {#finding-by-logical-name}

Nazwy logiczne są wyszukiwane przy każdym ustawieniu Widoku nazw, także w widoku `Physical Names`, w którym kanwa nie wyświetla żadnej z nich:

- Funkcja [Znajdź i zamień](./find-and-replace.md#what-it-searches) przeszukuje je jako jeden rodzaj tekstu, `Logical names`, wspólny dla tabel i kolumn, a ten rodzaj jest włączony przy pierwszym otwarciu wyszukiwania. Zamiana nazwy logicznej generuje na jej podstawie nazwę fizyczną, tak jak jej wpisanie.
- W palecie [Szybkie wyszukiwanie](./quick-search.md#searching-the-diagram) prefiks `#` wyszukuje tabelę według nazwy lub nazwy logicznej, a prefiks `@` wyszukuje kolumnę według dowolnej z nich, przy czym obok dopasowania nazwy logicznej widnieje napis `Logical name`. Część z nazwą tabeli w wyszukiwaniu `@`, przed znakiem `.`, również pasuje do nazwy lub nazwy logicznej tabeli.

Przełączenie Widoku nazw zmienia sposób nazywania wyników, nigdy to, co zostaje znalezione.

## Współpracownicy {#collaborators}

W [sesji wspólnej edycji](../../api/advanced/collaborative-editing.md) nazwy logiczne i powiązania z domenami docierają do każdego edytora jak każda inna zmiana.  
Gdy blokada `Name View` jest włączona, każdy edytor ma własny widok, a przełączenie widać tylko w edytorze, w którym je wykonano. Gdy jest wyłączona, przełączenie w dowolnym edytorze, który nie jest tylko do odczytu, przełącza wszystkie edytory – zobacz sekcję [Blokada](./settings.md#lock), w której opisano też, jak włączenie lub wyłączenie blokady wpływa na widok każdego edytora.  
Gdy komórka z fokusem uczestnika jest komórką, której twój widok nie wyświetla, jego kolor pojawia się na komórce, którą twój widok wyświetla w jej miejscu: kolor z komórki nazwy w widoku `Physical Names` pojawia się na twojej komórce nazwy logicznej w widoku `Logical Names` i odwrotnie, a komórka typu i zastępująca ją domena odpowiadają sobie w ten sam sposób.

Agent kodujący działający przez serwer MCP ustawia nazwy logiczne i wiąże domeny niezależnie od widoku, który oglądasz, i nie ma narzędzia, które przełącza Widok nazw – zobacz sekcje [Słowniki](../../mcp/tools.md#dictionaries) i [Ustawienia](../../mcp/tools.md#settings).

## Edytory tylko do odczytu {#read-only-editors}

W edytorze z atrybutem [`readonly`](../../api/erd-editor-element.md#readonly) działa każdy selektor Widoku nazw, a przełączenie zmienia tylko ten ekran, niezależnie od blokady.  
Nie można w nim edytować nazw logicznych ani domen, więc nie otwiera się lista terminów ani selektor domen, a żadna z pozycji `Derive Physical Name Again` i `Derive Physical Names Again` nie jest dostępna. Opcja View Option → `Domain` niczego w nim nie zmienia, tak jak żadna [opcja widoku](./table-related-functions.md#table-view-options).
