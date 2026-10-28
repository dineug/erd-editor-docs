---
sidebar_position: 4
description: Rysowanie dokumentu jako PNG lub SVG z własnego kodu za pomocą toImage, z opcjami okna dialogowego Export image, w przeglądarce i w workerze eksportu, gdzie taki istnieje.
---

# toImage

Od wersji `5.0.0` moduł główny pakietu eksportuje funkcję `toImage()`, która rysuje dokument jako PNG lub SVG bez edytora na stronie.  
Zapisuje te same pliki, co przyciski `PNG` i `SVG` okna dialogowego [Export image](../guide/guides/file-import-export.md#image), z trzema opcjami tego okna, `Background`, `Dark mode` i `Scale`, i z żadnymi innymi.

```ts
function toImage(
  value: string,
  options: ToImageOptions & { format: 'png' }
): Promise<Blob>;
function toImage(
  value: string,
  options: ToImageOptions & { format: 'svg' }
): Promise<string>;

type ToImageOptions = {
  format: 'png' | 'svg';
  background?: boolean;
  darkMode?: boolean;
  scale?: 1 | 2 | 3;
};
```

```js
import { toImage } from '@dineug/erd-editor';

const value = await (await fetch('/diagrams/shop.erd.json')).text();

const png = await toImage(value, { format: 'png', scale: 3 });
const svg = await toImage(value, { format: 'svg', darkMode: true, background: false });
```

Typ `ToImageOptions` jest eksportowany obok jako typ – zobacz sekcję [Punkty wejścia](./installation.md#entry-points).

## value {#value}

Tekst dokumentu: to, co zawiera plik `.erd.json`, [value](./erd-editor-element.md#value) lub [runtimeValue](./erd-editor-element.md#runtimevalue) edytora albo dowolny inny tekst, który wczytuje [setInitialValue](./erd-editor-element.md#setinitialvalue).  
Pusty tekst lub same białe znaki dają pusty diagram, podobnie jak JSON, który nie zawiera żadnego z pól dokumentu, a które parser uzupełnia wartościami domyślnymi.

## Opcje {#options}

| Opcja | Wartość domyślna | Opis |
| --- | --- | --- |
| `format` | Brak; jest wymagana | `'png'` daje obiekt `Blob` typu `image/png`, a `'svg'` kod SVG jako ciąg znaków. |
| `background` | `true` | Maluje kolor kanwy za diagramem. Wartość `false` zostawia tło przezroczyste, łącznie z polem pod etykietą ON DELETE lub ON UPDATE. |
| `darkMode` | `false` | Rysuje ciemny motyw zamiast jasnego. |
| `scale` | `2` | `1`, `2` lub `3` piksele obrazu na jednostkę diagramu przy powiększeniu 100%. Określa rozmiar samego pliku PNG; plik SVG ma rozmiar diagramu niezależnie od skali. |

Funkcja `toImage()` nie czyta żadnego innego klucza, więc klucz spoza tabeli niczego nie zmienia.

## Co rysuje {#what-it-draws}

Obraz jest taki sam jak ten, który rysuje okno dialogowe:

- Cały diagram, przycięty do tego, co rysuje, z marginesem i zawsze przy powiększeniu 100%, niezależnie od powiększenia, przy którym zapisano dokument, więc każda tabela jest narysowana w całości. To, co [View Option](../guide/guides/table-related-functions.md#table-view-options) ukrywa w dokumencie, nie jest ani rysowane, ani uwzględniane w układzie, grupy tabel są rysowane za wszystkim innym, a kolory, które [kontrole słownika](../guide/guides/dictionary.md#marks-on-the-canvas) nadają nazwom, nie są rysowane.
- Plik PNG ma rozmiar diagramu przy 100% pomnożony przez `scale`. Obraz zbyt duży dla kanwy przeglądarki jest zapisywany w zmniejszonej rozdzielczości, zamiast zawieść, a `toImage()` o tym nie informuje.
- Plik SVG zachowuje tekst jako tekst i podaje nazwy czcionek, zamiast je osadzać, więc przeglądarka bez czcionki edytora narysuje inną. Cienie są pomijane.

Tam, gdzie okno dialogowe bierze ekran edytora, `toImage()` bierze sam dokument, więc dokument wygląda tak samo na każdej stronie:

- Jego kolory pochodzą z ustawienia wstępnego domyślnej szarości i koloru akcentu elementu, `slate` i `indigo`, w jasnej wersji, chyba że `darkMode` ma wartość `true`. Nie dociera do niego żaden motyw strony, żadne nadpisanie [setTheme](./erd-editor-element.md#settheme) ani żadna zmiana w [kreatorze motywu](../guide/guides/language-and-theme.md).
- Jego tabele i kolumny mają nazwy w [Widoku nazw](../guide/guides/logical-names.md#name-view), który zawiera dokument, a dla pliku z włączoną blokadą `Name View` jest to widok zablokowany.
- Słowa, które diagram rysuje sam, takie jak tekst zastępczy tabeli bez nazwy, są po angielsku.

## Gdzie działa {#where-it-runs}

Funkcja `toImage()` wymaga strony przeglądarki, ponieważ mierzy i rysuje na kanwie. Moduł główny pakietu, z którego pochodzi, potrzebuje do załadowania drzewa DOM, więc nie można jej wywołać z Node ani z Web Workera – zobacz sekcję [Renderowanie po stronie serwera](./installation.md#server-side-rendering).  
Przed rysowaniem czeka, aż czcionki strony zakończą ładowanie.

Rysuje w shared workerze eksportu obrazu, jeśli host go uruchamia, tak jak okno dialogowe, więc strona pozostaje w tym czasie responsywna, a w wątku głównym, gdy go nie ma lub gdy worker nie odpowie na czas – zobacz sekcję [Web Workers](./installation.md#web-workers).  
Pakiet, który importuje `toImage` i żaden element, zawiera wyłącznie workera eksportu obrazu.  
Żadna z kompilacji dla [znacznika script](./installation.md#script-tag) go nie zawiera: obiekty `window.ErdEditor` i `window.ErdViewer` nie mają `toImage`.

## Odrzucenia {#rejections}

Zwracany obiekt Promise jest odrzucany, zanim cokolwiek zostanie narysowane, gdy:

- strona nie ma `document`: `Error`, `toImage needs a browser, since it draws on a canvas`;
- `value` nie jest ciągiem znaków, na przykład dokument już sparsowany do obiektu: `TypeError`;
- opcja ma wartość, której tabela [Opcje](#options) nie wymienia, w tym brakujący `format`, a także `scale` równe `'2'` przekazane z SVG: `TypeError` z nazwą opcji, jak w `toImage: scale cannot be 4`;
- tekst nie jest dokumentem, który parser potrafi odczytać: błąd parsera, a dla tekstu niebędącego JSON-em `SyntaxError`.

## Okno dialogowe Export image {#export-image-dialog}

Okno dialogowe i `toImage()` rysują tym samym eksportem, więc przy tych samych opcjach zapisują ten sam obraz, ale zaczynają od innych danych:

| | Okno dialogowe `Export image` | `toImage()` |
| --- | --- | --- |
| Dokument | Diagram taki, jaki był w chwili otwarcia okna | Tekst, który przekażesz |
| Tryb ciemny | Zaczyna zgodnie z wyglądem edytora i dopóki się z nim zgadza, rysuje kolory ekranu | Wyłączony, chyba że `darkMode` ma wartość `true`, i zawsze ustawienie wstępne |
| Widok nazw | Ten, który pokazuje edytor | Ten, który zawiera dokument |
| Język własnych słów | Język wyświetlania edytora | Angielski |
| Wynik | Zapisany przez przeglądarkę lub [funkcję zwrotną eksportu](./installation.md#file-dialogs) albo skopiowany do schowka | Zwrócony tobie; żadna funkcja zwrotna plików nie jest wywoływana |

Pozycja `Copy to clipboard` nie ma odpowiednika. Strona, która jej potrzebuje, sama zapisuje obiekt `Blob` PNG w schowku.
