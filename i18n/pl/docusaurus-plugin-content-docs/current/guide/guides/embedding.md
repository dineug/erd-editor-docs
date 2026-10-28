---
sidebar_position: 18
description: Pokaż diagram tylko do odczytu na innej stronie bez kodu, osadzając erd-editor.io/embed, zbuduj jego adres URL i wiersz iframe w kreatorze, ustaw motyw, język, Widok nazw, minimapę, kontrolki i kolory w adresie URL oraz udostępnij plik z GitHuba lub z serwera, który zezwala na CORS.
---

# Osadzanie

[erd-editor.io/embed](https://erd-editor.io/embed) pokazuje diagram tylko do odczytu w przeglądarce wypełniającej stronę, którą może osadzić inna witryna: wiki, blog, kreator stron albo dowolna strona, która nie może ładować własnych skryptów.  
Jego parametr `src` wskazuje dokument, czyli adres pliku w postaci, w jakiej zapisuje go ERD Editor, na przykład pliku `.erd.json`. Reszta adresu URL określa, jak przeglądarka go pokazuje, a kreator pod tym samym adresem zapisuje za Ciebie adres URL i jego wiersz iframe.

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Ta ramka pokazuje plik [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json) z repozytorium erd-editor, a oto wiersz, który umieszcza go na stronie:

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## Co pokazuje ramka {#what-the-frame-shows}

Ramka pokazuje tabele, kolumny, relacje, notatki i grupy tabel diagramu i nic w niej nie edytuje ani diagramu, ani pliku.  
Diagram jest dopasowywany do ramki podczas ładowania, niezależnie od powiększenia i położenia przewinięcia zapisanych w pliku, więc rozmiar ramki decyduje o powiększeniu, przy którym się otwiera.

Nad kanwą znajdują się:

- Minimapa, dopóki diagram ma zawartość.
- Pasek kontrolek u dołu: `Zoom out`, poziom powiększenia, którego kliknięcie resetuje powiększenie, `Zoom in`, `Fit`, lista `Name View` oraz `Go to content`, gdy żadna część diagramu nie jest na ekranie.
- Łącze `erd-editor.io` w prawym dolnym rogu, które otwiera erd-editor.io w nowej karcie i nie wysyła żadnego referera, więc kliknięcie nie mówi witrynie nic o dokumencie pokazywanym w ramce. W wąskiej ramce może zasłaniać część paska kontrolek.

Podczas ładowania pliku ramka pokazuje `Loading diagram`. Jeśli nie można go pobrać lub nie zawiera dokumentu, ramka pokazuje pusty diagram z komunikatem `Couldn't load the diagram` – zobacz sekcje [Pliki na GitHubie](#files-on-github) i [Pliki na innych serwerach](#files-on-other-servers).

Ramka kieruje się wyłącznie swoim adresem URL i systemem odwiedzającego. Własny język i motyw odwiedzającego na erd-editor.io nie obowiązują w ramce.

## Kreator {#the-builder}

Otwórz [erd-editor.io/embed](https://erd-editor.io/embed) bez `src`, aby zobaczyć kreator, stronę zatytułowaną `Embed a diagram`:

1. Wklej adres dokumentu w polu `Document URL`. Zaczyna obowiązywać po naciśnięciu `Enter` lub opuszczeniu pola, więc samo wpisywanie niczego nie pobiera. Gdy adres zacznie obowiązywać, wiersz `Loads from` pod polem podaje adres, który pobiera przeglądarka: ten, który podałeś, albo, dla strony na GitHubie, jej adres na hoście raw GitHuba – zobacz sekcję [Pliki na GitHubie](#files-on-github).
2. Wybierz opcje. Każda z nich od razu obowiązuje w podglądzie, adresie URL i wierszu iframe:
   - `Theme`: `System`, `Light` lub `Dark`.
   - `Display Language`: `System`, a obok język, który oznacza w Twojej przeglądarce, potem 25 języków, każdy pod własną nazwą.
   - `Name View`: `As Saved`, `Physical Names`, `Logical Names` lub `Both Names`. Opcja `As Saved` pokazuje Widok nazw zapisany w pliku.
   - `Accent color` i `Gray color`, każdy wymieniony z nazwą i próbką koloru.
   - `Minimap` i `Controls`, dwa przełączniki, oba włączone.
   - `Height` w pikselach, na początku `480`. Wysokość, która nie jest dodatnią liczbą całkowitą, jest traktowana jak `480`.
3. Sprawdź `Preview`: przeglądarkę taką, jaką pokaże ramka, z łączem `erd-editor.io`, w polu o wysokości `Height`. Jego język `System` to język Twojej przeglądarki, niezależnie od tego, w jakim języku pokazuje się sam erd-editor.io.
4. Skopiuj wynik. Pole `Embed URL` to adres ramki, a `Embed code` to wiersz iframe, z ustawioną wysokością i szerokością `100%`. Każde z nich ma przycisk `Copy`, który pozostaje wyłączony, dopóki adres dokumentu nie zacznie obowiązywać, i który przez chwilę po skopiowaniu pokazuje `Copied`, dopóki zmiana nie przepisze tego, co skopiował.

Wyczyszczenie pola `Document URL` opróżnia podgląd i oba wyniki, gdy zacznie obowiązywać.

## Parametry adresu URL {#url-parameters}

| Parametr | Wartości | Wartość domyślna |
| --- | --- | --- |
| `src` | Adres dokumentu, zakodowany jako URL. | Brak: bez niego lub z pustą wartością stroną jest kreator. |
| `theme` | `light`, `dark` lub `system`. | `system`: jasny lub ciemny tryb zgłaszany przez przeglądarkę odwiedzającego. |
| `locale` | `system` albo kod z [tabeli języków](./language-and-theme.md#display-language), na przykład `de-DE`. | `system`: języki przeglądarki odwiedzającego, dopasowane tak, jak dopasowuje je opcja [System](./language-and-theme.md#what-system-follows), a angielski, gdy przeglądarka nie ma żadnego z nich. |
| `name-view` | `physical`, `logical` lub `both`. | Widok nazw zapisany w pliku. |
| `minimap` | `false` ukrywa minimapę. | Pokazana. |
| `controls` | `false` ukrywa pasek kontrolek. | Pokazany. |
| `accent-color` | Jeden z 26 kolorów akcentu z [kreatora motywu](./language-and-theme.md#theme), na przykład `jade`. | `indigo` |
| `gray-color` | `gray`, `mauve`, `slate`, `sage`, `olive` lub `sand`. | `slate` |

Wartości domyślne należą do samej przeglądarki, a nie do aplikacji internetowej, która startuje od `jade` i `olive`.

- Kreator pomija w adresie URL każdą opcję pozostawioną na wartości domyślnej, więc adres osadzenia zawiera tylko to, co się różni.
- Wartość, której przeglądarka nie przyjmuje, jest ignorowana, a jej opcja zachowuje wartość domyślną. Wartości są dopasowywane dokładnie tak, jak je wymieniono, więc `theme=Dark` jest ignorowane, a `minimap` i `controls` pozostają pokazane przy każdej wartości poza `false`.
- Parametr podany dwa razy przyjmuje swoją pierwszą wartość.
- Parametr `src` jest kodowany jako URL, tak jak zapisuje go kreator, ponieważ adres zawierający własny znak `&` lub `#` zostałby w przeciwnym razie ucięty.

## Pliki na GitHubie {#files-on-github}

Plik lub gist na GitHubie można podać pod adresem, który pokazuje jego strona, jak w ramce powyżej. Przeglądarka pobiera go wtedy z hosta raw GitHuba, który odpowiada na żądanie z innej witryny, w przeciwieństwie do adresu samej strony:

- Strona pliku, `https://github.com/<owner>/<repo>/blob/<ref>/<path>`, lub jego adres `raw`, `https://github.com/<owner>/<repo>/raw/<ref>/<path>`, jest ładowana z `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>`. Wartość `<ref>` to gałąź, tag lub commit: gałąź pokazuje plik taki, jaki ma ta gałąź, a tag lub commit zachowuje tę wersję.
- Strona gista, `https://gist.github.com/<user>/<id>`, jest ładowana z `https://gist.githubusercontent.com/<user>/<id>/raw`, czyli z pierwszego pliku gista. Trzymaj diagram jako jedyny plik gista.

Adres osadzenia zachowuje adres, który podałeś, a wiersz `Loads from` w kreatorze pokazuje adres pobierany.  
Działa to tylko dla publicznych repozytoriów i publicznych gistów. Host raw buforuje każdy plik przez pięć minut, więc zmiana, którą wypchniesz, może pojawić się w ramce dopiero po tym czasie.

## Pliki na innych serwerach {#files-on-other-servers}

Przeglądarka na erd-editor.io pobiera plik zwykłym żądaniem `GET` z przeglądarki odwiedzającego, więc serwer, który go przechowuje, musi zezwolić na takie żądanie między źródłami (CORS): jego odpowiedź potrzebuje nagłówka `Access-Control-Allow-Origin`, który zezwala na `https://erd-editor.io`, na przykład `*`.  
Żądanie nie niesie ciasteczek, więc plik musi dać się odczytać bez logowania.  
Bez tego nagłówka, a także dla adresu, który odpowiada błędem lub czymś innym niż dokument ERD Editor, ramka pokazuje `Couldn't load the diagram`.

## W ramce {#in-the-frame}

Ramka nie przejmuje kółka, gestu ani klawisza, dopóki odwiedzający nie kliknie jej lub nie dotknie albo nie dotrze do niej klawiszem `Tab`. Do tego czasu kółko, przeciągnięcie palcem i szczypnięcie przewijają lub powiększają otaczającą stronę jak zwykle.  
Gdy ramka ma fokus, kółko przesuwa diagram, `Ctrl + Wheel` (Windows/Linux) lub `⌘ + Wheel` (Mac) i szczypnięcie go powiększają, a `Ctrl + K` (Windows/Linux) lub `⌘ + K` (Mac) otwiera wyszukiwanie w dokumencie, w którym `#` znajduje tabelę, `@` kolumnę, a `:` komentarz lub notatkę.  
Przeciągnięcie przesuwa diagram niezależnie od tego, czy ramka ma fokus, a kliknięcie lub dotknięcie podświetla relacje: klikniętej tabeli albo jedną klikniętą relację. Tabela, na której spoczywa wskaźnik, podświetla swoje relacje. Wszystkie klawisze opisuje sekcja [Fokus i klawisze](../../api/erd-viewer-element.md#focus-and-keys).

Aby wypróbować to na większym diagramie, z powiększaniem i wyszukiwaniem, otwórz [przykład księgarni](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json), dziewięć tabel i dwie grupy tabel, na osobnej stronie.

## Analityka {#analytics}

erd-editor.io zlicza wizyty w ramce za pomocą Google Analytics, tak jak zlicza wizyty w aplikacji internetowej. Adres, który zapisuje dla ramki, to wyłącznie `erd-editor.io/embed`, bez adresu dokumentu, który wskazuje `src`.  
Zobacz [Politykę prywatności](https://erd-editor.io/privacy).

## Samodzielne ładowanie przeglądarki {#loading-the-viewer-yourself}

Strona, która może ładować skrypty, może zamiast tego pokazać diagram za pomocą elementu [`<erd-viewer>`](../../api/erd-viewer-element.md) z pakietu `@dineug/erd-editor`. Przyjmuje on te same opcje jako atrybuty i metody, nie wysyła żadnych żądań do erd-editor.io i może wczytać dokument z własnej witryny strony, co nie wymaga CORS.
