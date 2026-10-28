---
sidebar_position: 4
description: Teken een document als PNG of SVG vanuit je eigen code met toImage, met de opties van het dialoogvenster Export image, in een browser en in de exportworker waar die er is.
---

# toImage

Sinds `5.0.0` exporteert de root van het pakket `toImage()`, dat een document als PNG of SVG tekent zonder editor op de pagina.  
Het schrijft de bestanden die de knoppen `PNG` en `SVG` van het dialoogvenster [Export image](../guide/guides/file-import-export.md#image) schrijven, met de drie opties van het dialoogvenster, `Background`, `Dark mode` en `Scale`, en geen andere.

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

`ToImageOptions` wordt ernaast als type geëxporteerd — zie [Ingangspunten](./installation.md#entry-points).

## value {#value}

De tekst van het document: wat een `.erd.json`-bestand bevat, de [value](./erd-editor-element.md#value) of [runtimeValue](./erd-editor-element.md#runtimevalue) van een editor, of elke andere tekst die [setInitialValue](./erd-editor-element.md#setinitialvalue) laadt.  
Lege tekst, of alleen witruimte, tekent een leeg diagram, en dat doet ook JSON die geen van de velden van een document bevat, die de parser met standaardwaarden vult.

## Opties {#options}

| Optie | Standaard | Beschrijving |
| --- | --- | --- |
| `format` | Geen; verplicht | `'png'` levert een `Blob` van het type `image/png`, `'svg'` de markup van de SVG als string. |
| `background` | `true` | Schildert de canvaskleur achter het diagram. `false` laat het transparant, het vak onder een label ON DELETE of ON UPDATE inbegrepen. |
| `darkMode` | `false` | Tekent het donkere thema in plaats van het lichte. |
| `scale` | `2` | `1`, `2` of `3` afbeeldingspixels per eenheid van het diagram op 100%. Het bepaalt alleen de grootte van de PNG; een SVG heeft de grootte van het diagram, welke schaal ook. |

`toImage()` leest geen andere sleutel, dus een sleutel die de tabel niet vermeldt, verandert niets.

## Wat het tekent {#what-it-draws}

De afbeelding is die welke het dialoogvenster tekent:

- Het hele diagram, bijgesneden tot wat het tekent plus een marge en altijd op 100%, op welke zoom het document ook is opgeslagen, zodat elke tabel volledig wordt getekend. Wat [View Option](../guide/guides/table-related-functions.md#table-view-options) in het document verbergt, wordt niet getekend en krijgt geen ruimte, tabelgroepen worden achter al het andere getekend, en de kleuren die de [controles van het woordenboek](../guide/guides/dictionary.md#marks-on-the-canvas) aan namen geven, worden niet getekend.
- Een PNG heeft de grootte van het diagram op 100% maal `scale`. Een te grote voor een browsercanvas wordt met een lagere resolutie geschreven in plaats van te mislukken, en `toImage()` meldt dat niet.
- Een SVG behoudt zijn tekst als tekst en noemt zijn lettertypen in plaats van ze in te sluiten, dus een viewer zonder het lettertype van de editor tekent een ander. Schaduwen blijven weg.

Waar het dialoogvenster het scherm van de editor neemt, neemt `toImage()` alleen het document, zodat een document op elke pagina hetzelfde wordt getekend:

- De kleuren zijn het vooraf ingestelde thema van de standaardgrijs en -accentkleur van het element, `slate` en `indigo`, licht tenzij `darkMode` `true` is. Geen thema van de pagina, geen overschrijving met [setTheme](./erd-editor-element.md#settheme) en geen wijziging in de [themabouwer](../guide/guides/language-and-theme.md) bereikt het.
- Zijn tabellen en kolommen worden genoemd in de [naamweergave](../guide/guides/logical-names.md#name-view) die het document bevat, en dat is voor een bestand met zijn vergrendeling `Name View` aan de vergrendelde.
- De woorden die het diagram zelf tekent, zoals de tijdelijke aanduiding van een tabel zonder naam, zijn in het Engels.

## Waar het draait {#where-it-runs}

`toImage()` heeft een browserpagina nodig, omdat het op een canvas meet en tekent. De root van het pakket waaruit het komt, heeft een DOM nodig om te laden, dus hij is niet bereikbaar vanuit Node of een Web Worker — zie [Server-side rendering](./installation.md#server-side-rendering).  
Het wacht tot de lettertypen van de pagina klaar zijn met laden voordat het tekent.

Het tekent in de gedeelde worker voor de afbeeldingsexport waar de host er een draait, zoals het dialoogvenster doet, zodat de pagina intussen responsief blijft, en op de hoofdthread waar er geen is of de worker niet op tijd antwoordt — zie [Web Workers](./installation.md#web-workers).  
Een bundle die `toImage` importeert en geen element, bevat alleen de worker voor de afbeeldingsexport.  
Geen van beide [scripttag](./installation.md#script-tag)-builds bevat hem: `window.ErdEditor` en `window.ErdViewer` hebben geen `toImage`.

## Afwijzingen {#rejections}

De Promise die het teruggeeft, wordt afgewezen, voordat er iets is getekend, wanneer:

- de pagina geen `document` heeft: een `Error`, `toImage needs a browser, since it draws on a canvas`;
- `value` geen string is, zoals een document dat al tot een object is geparseerd: een `TypeError`;
- een optie een waarde bevat die de tabel [Opties](#options) niet vermeldt, een ontbrekende `format` inbegrepen, en dat geldt ook voor een `scale` van `'2'` die met een SVG wordt doorgegeven: een `TypeError` die de optie noemt, zoals in `toImage: scale cannot be 4`;
- de tekst geen document is dat de parser kan lezen: de fout van de parser, een `SyntaxError` voor tekst die geen JSON is.

## Dialoogvenster Export image {#export-image-dialog}

Het dialoogvenster en `toImage()` tekenen via dezelfde export, dus met dezelfde opties schrijven ze dezelfde afbeelding, maar ze beginnen op verschillende plekken:

| | Dialoogvenster `Export image` | `toImage()` |
| --- | --- | --- |
| Document | Het diagram zoals het was toen het dialoogvenster opende | De tekst die je doorgeeft |
| Dark mode | Begint met het uiterlijk van de editor te volgen, en tekent zolang dat zo is de eigen kleuren van het scherm | Uit tenzij `darkMode` `true` is, en altijd het vooraf ingestelde thema |
| Name View | Die welke de editor toont | Die welke het document bevat |
| Taal van zijn eigen woorden | De weergavetaal van de editor | Engels |
| Resultaat | Opgeslagen via de browser of de [exportcallback](./installation.md#file-dialogs), of naar het klembord gekopieerd | Aan jou teruggegeven; geen van beide bestandscallbacks wordt aangeroepen |

`Copy to clipboard` heeft geen tegenhanger. Een pagina die er een wil, schrijft de PNG-`Blob` zelf naar het klembord.
