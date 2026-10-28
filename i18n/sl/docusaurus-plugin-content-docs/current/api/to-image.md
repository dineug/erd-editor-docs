---
sidebar_position: 4
description: Narišite dokument kot PNG ali SVG iz lastne kode s funkcijo toImage in možnostmi pogovornega okna Export image, v brskalniku in v izvoznem delavcu, kjer ga je mogoče uporabiti.
---

# toImage

Od različice `5.0.0` koren paketa izvaža `toImage()`, ki nariše dokument kot PNG ali SVG brez urejevalnika na strani.  
Zapiše datoteke, ki jih zapišeta gumba `PNG` in `SVG` pogovornega okna [Export image](../guide/guides/file-import-export.md#image), s tremi možnostmi pogovornega okna, `Background`, `Dark mode` in `Scale`, in nobeno drugo.

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

`ToImageOptions` je ob njej izvožen kot tip – glejte razdelek [Vstopne točke](./installation.md#entry-points).

## value {#value}

Besedilo dokumenta: kar vsebuje datoteka `.erd.json`, [value](./erd-editor-element.md#value) ali [runtimeValue](./erd-editor-element.md#runtimevalue) urejevalnika ali katero koli drugo besedilo, ki ga naloži [setInitialValue](./erd-editor-element.md#setinitialvalue).  
Prazno besedilo ali samo presledki narišejo prazen diagram, enako velja za JSON, ki ne vsebuje nobenega polja dokumenta, saj ga razčlenjevalnik dopolni s privzetimi vrednostmi.

## Možnosti {#options}

| Možnost | Privzeto | Opis |
| --- | --- | --- |
| `format` | Brez; obvezna je | `'png'` se razreši v `Blob` tipa `image/png`, `'svg'` v oznake SVG kot niz. |
| `background` | `true` | Pobarva barvo platna za diagramom. `false` jo pusti prosojno, vključno s poljem pod oznako ON DELETE ali ON UPDATE. |
| `darkMode` | `false` | Nariše temno temo namesto svetle. |
| `scale` | `2` | `1`, `2` ali `3` slikovne pike slike na enoto diagrama pri 100 %. Določa samo velikost PNG; SVG je velik toliko kot diagram, ne glede na `scale`. |

`toImage()` ne prebere nobenega drugega ključa, zato ključ, ki ga tabela ne navaja, ne spremeni ničesar.

## Kaj nariše {#what-it-draws}

Slika je tista, ki jo nariše pogovorno okno:

- Celoten diagram, obrezan na narisano vsebino z robom, vedno pri 100 %, ne glede na povečavo, pri kateri je bil dokument shranjen, zato je vsaka tabela narisana v celoti. Kar [View Option](../guide/guides/table-related-functions.md#table-view-options) v dokumentu skrije, ni narisano in ne dobi prostora, skupine tabel so narisane za vsem drugim, barve, ki jih imenom dajo [preverjanja slovarja](../guide/guides/dictionary.md#marks-on-the-canvas), pa niso narisane.
- PNG je velik toliko kot diagram pri 100 % krat `scale`. Prevelik za platno brskalnika se zapiše z manjšo ločljivostjo, namesto da bi spodletel, `toImage()` pa tega ne sporoči.
- SVG ohrani besedilo kot besedilo in navaja pisave, namesto da bi jih vdelal, zato pregledovalnik brez pisave urejevalnika nariše drugo. Sence so izpuščene.

Kjer pogovorno okno vzame zaslon urejevalnika, `toImage()` vzame samo dokument, zato se dokument na vsaki strani nariše enako:

- Njegove barve so prednastavitev privzete sive in poudarjene barve elementa, `slate` in `indigo`, svetle, razen če je `darkMode` enak `true`. Nobena tema strani, nobena preglasitev [setTheme](./erd-editor-element.md#settheme) in nobena sprememba [graditelja tem](../guide/guides/language-and-theme.md) je ne doseže.
- Njegove tabele in stolpci so poimenovani v [prikazu imen](../guide/guides/logical-names.md#name-view), ki ga dokument hrani, kar je za datoteko z vklopljenim zaklepom `Name View` zaklenjeni prikaz.
- Besede, ki jih diagram nariše sam, na primer nadomestno besedilo neimenovane tabele, so v angleščini.

## Kje se izvaja {#where-it-runs}

`toImage()` potrebuje stran brskalnika, saj meri in riše na platnu. Koren paketa, iz katerega izhaja, za nalaganje potrebuje DOM, zato ga ni mogoče doseči iz Node ali Web Workerja – glejte razdelek [Upodabljanje na strežniku](./installation.md#server-side-rendering).  
Počaka, da se pisave strani končajo nalagati, preden nariše.

Riše v skupnem delavcu za izvoz slik, kjer ga gostitelj izvaja, kot to počne pogovorno okno, zato je stran medtem odzivna, na glavni niti pa, kjer ga ni ali se delavec ne odzove pravočasno – glejte razdelek [Web Workers](./installation.md#web-workers).  
Paket, ki uvozi `toImage` in nobenega elementa, nosi samo delavca za izvoz slik.  
Nobena izvedba [oznake script](./installation.md#script-tag) ga ne nosi: `window.ErdEditor` in `window.ErdViewer` nimata `toImage`.

## Zavrnitve {#rejections}

Promise, ki ga vrne, je zavrnjen, preden je karkoli narisano, kadar:

- stran nima `document`: `Error`, `toImage needs a browser, since it draws on a canvas`;
- `value` ni niz, na primer dokument, ki je že razčlenjen v objekt: `TypeError`;
- možnost vsebuje vrednost, ki je tabela [Možnosti](#options) ne navaja, vključno z manjkajočim `format`, enako velja za `scale` z vrednostjo `'2'`, podan s SVG: `TypeError`, ki poimenuje možnost, kot v `toImage: scale cannot be 4`;
- besedilo ni dokument, ki ga razčlenjevalnik zna prebrati: napaka razčlenjevalnika, `SyntaxError` za besedilo, ki ni JSON.

## Pogovorno okno Export image {#export-image-dialog}

Pogovorno okno in `toImage()` rišeta prek istega izvoza, zato pri enakih možnostih zapišeta enako sliko, začneta pa na različnih mestih:

| | Pogovorno okno `Export image` | `toImage()` |
| --- | --- | --- |
| Dokument | Diagram, kakršen je bil, ko se je pogovorno okno odprlo | Besedilo, ki ga podate |
| Temni način | Na začetku ustreza videzu urejevalnika, dokler mu ustreza, pa nariše barve zaslona | Izklopljen, razen če je `darkMode` enak `true`, in vedno prednastavitev |
| Prikaz imen | Tisti, ki ga prikazuje urejevalnik | Tisti, ki ga hrani dokument |
| Jezik lastnih besed | Jezik prikaza urejevalnika | Angleščina |
| Rezultat | Shranjen prek brskalnika ali [izvozne povratne funkcije](./installation.md#file-dialogs) ali kopiran v odložišče | Vrnjen vam; nobena od povratnih funkcij za datoteke ni poklicana |

`Copy to clipboard` nima ustreznika. Stran, ki ga želi, `Blob` PNG v odložišče zapiše sama.
