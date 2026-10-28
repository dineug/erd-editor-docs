---
sidebar_position: 4
description: Desenați un document ca PNG sau SVG din propriul cod cu toImage, folosind opțiunile casetei de dialog Export image, într-un browser și în workerul de export acolo unde există unul.
---

# toImage

Începând cu versiunea `5.0.0`, rădăcina pachetului exportă `toImage()`, care desenează un document ca PNG sau SVG fără niciun editor pe pagină.  
Scrie fișierele pe care le scriu butoanele `PNG` și `SVG` ale casetei de dialog [Export imagine](../guide/guides/file-import-export.md#image), cu cele trei opțiuni ale casetei, `Background`, `Dark mode` și `Scale`, și cu niciuna în plus.

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

`ToImageOptions` este exportat ca tip alături de ea (consultați [Puncte de intrare](./installation.md#entry-points)).

## value {#value}

Textul documentului: ce conține un fișier `.erd.json`, [value](./erd-editor-element.md#value) sau [runtimeValue](./erd-editor-element.md#runtimevalue) ale unui editor ori orice alt text pe care îl încarcă [setInitialValue](./erd-editor-element.md#setinitialvalue).  
Un text gol, sau doar spații, desenează o diagramă goală, la fel un JSON care nu conține niciunul dintre câmpurile unui document, pe care parserul le completează cu valori implicite.

## Opțiuni {#options}

| Opțiune | Implicit | Descriere |
| --- | --- | --- |
| `format` | Niciuna; este obligatorie | `'png'` se rezolvă într-un `Blob` de tip `image/png`, `'svg'` în marcajul SVG ca șir de caractere. |
| `background` | `true` | Pictează culoarea pânzei în spatele diagramei. `false` o lasă transparentă, inclusiv caseta de sub o etichetă ON DELETE sau ON UPDATE. |
| `darkMode` | `false` | Desenează tema întunecată în locul celei luminoase. |
| `scale` | `2` | `1`, `2` sau `3` pixeli de imagine pe unitate a diagramei la 100%. Dimensionează doar PNG-ul; un SVG are dimensiunea diagramei indiferent de scară. |

`toImage()` nu citește nicio altă cheie, așa că o cheie pe care tabelul nu o listează nu schimbă nimic.

## Ce desenează {#what-it-draws}

Imaginea este cea pe care o desenează caseta de dialog:

- Întreaga diagramă, decupată la ce desenează plus o margine și mereu la 100%, indiferent de zoomul la care a fost salvat documentul, așa că fiecare tabel este desenat întreg. Ce ascunde în document [View Option](../guide/guides/table-related-functions.md#table-view-options) nu este nici desenat, nici nu primește loc, grupurile de tabele sunt desenate în spatele tuturor celorlalte, iar culorile pe care [verificările dicționarului](../guide/guides/dictionary.md#marks-on-the-canvas) le dau numelor nu sunt desenate.
- Un PNG are dimensiunea diagramei la 100% înmulțită cu `scale`. Unul prea mare pentru o pânză de browser este scris la o rezoluție redusă în loc să eșueze, iar `toImage()` nu spune acest lucru.
- Un SVG își păstrează textul ca text și își numește fonturile în loc să le încorporeze, așa că un cititor fără fontul editorului desenează altul. Umbrele sunt omise.

Acolo unde caseta de dialog ia ecranul editorului, `toImage()` ia doar documentul, astfel încât un document se desenează la fel pe orice pagină:

- Culorile sale sunt presetul griului și al accentului implicite ale elementului, `slate` și `indigo`, luminos dacă `darkMode` nu este `true`. Nicio temă a paginii, nicio suprascriere [setTheme](./erd-editor-element.md#settheme) și nicio modificare a [configuratorului de teme](../guide/guides/language-and-theme.md) nu o ajunge.
- Tabelele și coloanele sale sunt denumite în [modul de afișare a numelor](../guide/guides/logical-names.md#name-view) pe care îl conține documentul, care pentru un fișier cu blocarea `Name View` activată este cel blocat.
- Cuvintele pe care diagrama le desenează singură, cum ar fi substituentul unui tabel fără nume, sunt în engleză.

## Unde rulează {#where-it-runs}

`toImage()` are nevoie de o pagină de browser, deoarece măsoară și desenează pe o pânză canvas. Rădăcina pachetului din care provine are nevoie de un DOM ca să se încarce, așa că nu poate fi atinsă din Node sau dintr-un Web Worker (consultați [Redare pe server](./installation.md#server-side-rendering)).  
Așteaptă ca fonturile paginii să termine încărcarea înainte să deseneze.

Desenează în workerul partajat de export de imagini acolo unde gazda rulează unul, ca în cazul casetei de dialog, astfel încât pagina rămâne receptivă între timp, iar pe firul principal acolo unde nu există niciunul sau workerul nu răspunde la timp (consultați [Web Workers](./installation.md#web-workers)).  
Un bundle care importă `toImage` și niciun element poartă doar workerul de export de imagini.  
Nicio versiune pentru [eticheta script](./installation.md#script-tag) nu îl poartă: `window.ErdEditor` și `window.ErdViewer` nu au `toImage`.

## Respingeri {#rejections}

Promise-ul pe care îl returnează este respins, înainte de a se desena ceva, când:

- pagina nu are `document`: un `Error`, `toImage needs a browser, since it draws on a canvas`;
- `value` nu este un șir de caractere, de exemplu un document deja parsat într-un obiect: un `TypeError`;
- o opțiune conține o valoare pe care tabelul [Opțiuni](#options) nu o listează, inclusiv un `format` lipsă, la fel un `scale` de `'2'` transmis cu un SVG: un `TypeError` care numește opțiunea, ca în `toImage: scale cannot be 4`;
- textul nu este un document pe care parserul îl poate citi: eroarea parserului, un `SyntaxError` pentru un text care nu este JSON.

## Caseta de dialog Export image {#export-image-dialog}

Caseta de dialog și `toImage()` desenează prin același export, așa că, cu aceleași opțiuni, scriu aceeași imagine, dar pornesc din locuri diferite:

| | Caseta de dialog `Export image` | `toImage()` |
| --- | --- | --- |
| Document | Diagrama așa cum era când s-a deschis caseta | Textul pe care îl transmiteți |
| Modul întunecat | Pornește potrivit cu aspectul editorului și, cât timp se potrivește, desenează culorile proprii ale ecranului | Dezactivat dacă `darkMode` nu este `true` și mereu presetul |
| Name View | Cel pe care îl afișează editorul | Cel pe care îl conține documentul |
| Limba cuvintelor proprii | Limba de afișare a editorului | Engleza |
| Rezultat | Salvat prin browser sau prin [funcția callback de export](./installation.md#file-dialogs), ori copiat în clipboard | Înapoiat dumneavoastră; nicio funcție callback pentru fișiere nu este apelată |

`Copy to clipboard` nu are corespondent. O pagină care dorește unul scrie ea însăși `Blob`-ul PNG în clipboard.
