---
sidebar_position: 4
description: Nakreslenie dokumentu ako PNG alebo SVG z vlastného kódu pomocou toImage s možnosťami dialógového okna Export image, v prehliadači aj vo workeri exportu, kde existuje.
---

# toImage

Od verzie `5.0.0` koreň balíka exportuje `toImage()`, ktorá nakreslí dokument ako PNG alebo SVG bez editora na stránke.  
Zapisuje súbory, ktoré zapisujú tlačidlá `PNG` a `SVG` dialógového okna [Export image](../guide/guides/file-import-export.md#image), s troma možnosťami dialógového okna, `Background`, `Dark mode` a `Scale`, a žiadnymi inými.

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

`ToImageOptions` sa exportuje ako typ vedľa nej – pozrite si časť [Vstupné body](./installation.md#entry-points).

## value {#value}

Text dokumentu: to, čo obsahuje súbor `.erd.json`, [value](./erd-editor-element.md#value) alebo [runtimeValue](./erd-editor-element.md#runtimevalue) editora, alebo akýkoľvek iný text, ktorý načíta [setInitialValue](./erd-editor-element.md#setinitialvalue).  
Prázdny text alebo samotné medzery nakreslia prázdny diagram, rovnako ako JSON, ktorý neobsahuje žiadne z polí dokumentu, ktoré parser vyplní predvolenými hodnotami.

## Možnosti {#options}

| Možnosť | Predvolená hodnota | Popis |
| --- | --- | --- |
| `format` | Žiadna; je povinná | `'png'` sa vyrieši na `Blob` typu `image/png`, `'svg'` na značkovanie SVG ako reťazec. |
| `background` | `true` | Vyplní farbu plátna za diagramom. `false` ho ponechá priehľadný vrátane poľa pod menovkou ON DELETE alebo ON UPDATE. |
| `darkMode` | `false` | Nakreslí tmavý motív namiesto svetlého. |
| `scale` | `2` | `1`, `2` alebo `3` pixely obrázka na jednotku diagramu pri 100 %. Určuje iba veľkosť PNG; SVG má veľkosť diagramu bez ohľadu na mierku. |

`toImage()` nečíta žiadny iný kľúč, takže kľúč, ktorý tabuľka neuvádza, nič nezmení.

## Čo kreslí {#what-it-draws}

Obrázok je ten, ktorý kreslí dialógové okno:

- Celý diagram, orezaný na to, čo kreslí, plus okraj a vždy pri 100 %, bez ohľadu na to, pri akom priblížení bol dokument uložený, takže každá tabuľka je nakreslená celá. To, čo v dokumente skrýva [View Option](../guide/guides/table-related-functions.md#table-view-options), sa nekreslí ani sa mu nenechá miesto, skupiny tabuliek sa kreslia za všetkým ostatným a farby, ktoré názvom dávajú [kontroly slovníka](../guide/guides/dictionary.md#marks-on-the-canvas), sa nekreslia.
- PNG má veľkosť diagramu pri 100 % krát `scale`. Príliš veľký pre plátno prehliadača sa zapíše v zníženom rozlíšení namiesto zlyhania a `toImage()` to nehlási.
- SVG ponecháva svoj text ako text a uvádza názvy písiem namiesto ich vloženia, takže prehliadač bez písma editora nakreslí iné. Tiene sú vynechané.

Kde dialógové okno preberá obrazovku editora, `toImage()` preberá samotný dokument, takže dokument vyzerá rovnako na každej stránke:

- Jeho farby sú predvoľba predvoleného šedého a akcentového odtieňa elementu, `slate` a `indigo`, svetlá, kým nie je `darkMode` `true`. Nedostane sa k nim žiadny motív stránky, žiadne prepísanie pomocou [setTheme](./erd-editor-element.md#settheme) a žiadna zmena v [nástroji na tvorbu motívu](../guide/guides/language-and-theme.md).
- Jeho tabuľky a stĺpce sú pomenované v [Zobrazení názvov](../guide/guides/logical-names.md#name-view), ktoré dokument obsahuje, čo je pri súbore so zapnutým zamknutím `Name View` zamknuté zobrazenie.
- Slová, ktoré diagram kreslí sám, napríklad zástupný názov nepomenovanej tabuľky, sú v angličtine.

## Kde beží {#where-it-runs}

`toImage()` potrebuje stránku prehliadača, pretože meria a kreslí na plátno. Koreň balíka, z ktorého pochádza, potrebuje na načítanie DOM, takže sa k nemu nedá dostať z Node ani z Web Workera – pozrite si časť [Vykresľovanie na strane servera](./installation.md#server-side-rendering).  
Pred kreslením počká, kým sa dokončí načítanie písiem stránky.

Kreslí vo shared workeri exportu obrázka, kde ho hostiteľ spúšťa, rovnako ako dialógové okno, takže stránka medzitým zostáva responzívna, a v hlavnom vlákne, kde žiadny nie je alebo worker neodpovie včas – pozrite si časť [Web Workers](./installation.md#web-workers).  
Bundle, ktorý importuje `toImage` a žiadny element, nesie iba worker exportu obrázka.  
Ani jedno zostavenie pre [značku script](./installation.md#script-tag) ju nenesie: `window.ErdEditor` a `window.ErdViewer` nemajú `toImage`.

## Zamietnutia {#rejections}

Promise, ktorý vráti, sa zamietne pred nakreslením čohokoľvek, keď:

- stránka nemá `document`: `Error`, `toImage needs a browser, since it draws on a canvas`;
- `value` nie je reťazec, napríklad dokument už spracovaný na objekt: `TypeError`;
- možnosť obsahuje hodnotu, ktorú tabuľka [Možnosti](#options) neuvádza, vrátane chýbajúceho `format`, a rovnako aj `scale` s hodnotou `'2'` odovzdaný so SVG: `TypeError` s názvom možnosti, ako v `toImage: scale cannot be 4`;
- text nie je dokument, ktorý parser dokáže prečítať: chyba parsera, `SyntaxError` pre text, ktorý nie je JSON.

## Dialógové okno Export image {#export-image-dialog}

Dialógové okno a `toImage()` kreslia cez ten istý export, takže s rovnakými možnosťami zapíšu rovnaký obrázok, ale začínajú z rôznych miest:

| | Dialógové okno `Export image` | `toImage()` |
| --- | --- | --- |
| Dokument | Diagram v stave, v akom bol pri otvorení dialógového okna | Text, ktorý odovzdáte |
| Tmavý režim | Začína tak, aby zodpovedal vzhľadu editora, a kým zodpovedá, kreslí farby samotnej obrazovky | Vypnutý, kým nie je `darkMode` `true`, a vždy predvoľba |
| Zobrazenie názvov | To, ktoré zobrazuje editor | To, ktoré obsahuje dokument |
| Jazyk jeho vlastných slov | Jazyk zobrazenia editora | Angličtina |
| Výsledok | Uložený cez prehliadač alebo [spätné volanie exportu](./installation.md#file-dialogs), alebo skopírovaný do schránky | Odovzdaný vám; nevolá sa ani jedno spätné volanie súboru |

`Copy to clipboard` nemá protistranu. Stránka, ktorá ho chce, zapíše `Blob` PNG do schránky sama.
