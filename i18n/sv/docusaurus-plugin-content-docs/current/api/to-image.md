---
sidebar_position: 4
description: Rita ett dokument som en PNG eller en SVG från din egen kod med toImage, med alternativen i dialogrutan Export image, i en webbläsare och i exportworkern där det finns en.
---

# toImage

Sedan `5.0.0` exporterar paketets rot `toImage()`, som ritar ett dokument som en PNG eller en SVG utan någon editor på sidan.  
Den skriver de filer som knapparna `PNG` och `SVG` i dialogrutan [Export image](../guide/guides/file-import-export.md#image) skriver, med dialogrutans tre alternativ, `Background`, `Dark mode` och `Scale`, och inga andra.

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

`ToImageOptions` exporteras som en typ bredvid den – se [Ingångspunkter](./installation.md#entry-points).

## value {#value}

Dokumentets text: det som en `.erd.json`-fil innehåller, en editors [value](./erd-editor-element.md#value) eller [runtimeValue](./erd-editor-element.md#runtimevalue), eller vilken annan text som helst som [setInitialValue](./erd-editor-element.md#setinitialvalue) läser in.  
Tom text, eller enbart blanksteg, ritar ett tomt diagram, och det gör även JSON som inte innehåller något av ett dokuments fält, vilka tolkaren fyller med standardvärden.

## Alternativ {#options}

| Alternativ | Standardvärde | Beskrivning |
| --- | --- | --- |
| `format` | Inget; det krävs | `'png'` löses upp till en `Blob` av typen `image/png`, `'svg'` till SVG-bildens markup som en sträng. |
| `background` | `true` | Målar arbetsytans färg bakom diagrammet. `false` lämnar det genomskinligt, rutan under en etikett för ON DELETE eller ON UPDATE inräknad. |
| `darkMode` | `false` | Ritar det mörka temat i stället för det ljusa. |
| `scale` | `2` | `1`, `2` eller `3` bildpunkter per enhet i diagrammet vid 100 %. Det avgör bara PNG-bildens storlek; en SVG-bild har diagrammets storlek oavsett skala. |

`toImage()` läser ingen annan nyckel, så en nyckel som tabellen inte listar ändrar ingenting.

## Vad den ritar {#what-it-draws}

Bilden är den som dialogrutan ritar:

- Hela diagrammet, beskuret till det som det ritar plus en marginal och alltid i 100 %, oavsett vilken zoom dokumentet sparades vid, så att varje tabell ritas i sin helhet. Det som [View Option](../guide/guides/table-related-functions.md#table-view-options) döljer i dokumentet ritas varken eller får utrymme, tabellgrupper ritas bakom allt annat, och de färger som [ordlistans kontroller](../guide/guides/dictionary.md#marks-on-the-canvas) ger namn ritas inte.
- En PNG-bild har diagrammets storlek vid 100 % gånger `scale`. En som är för stor för en canvas i webbläsaren skrivs med lägre upplösning i stället för att misslyckas, och `toImage()` talar inte om det.
- En SVG-bild behåller sin text som text och anger sina typsnitt i stället för att bädda in dem, så en visare utan editorns typsnitt ritar ett annat. Skuggor utelämnas.

Där dialogrutan tar editorns skärm tar `toImage()` enbart dokumentet, så ett dokument ritas likadant på varje sida:

- Dess färger är det förinställda temat med elementets standardgrå och standardaccent, `slate` och `indigo`, ljust om inte `darkMode` är `true`. Inget tema som sidan har, ingen åsidosättning med [setTheme](./erd-editor-element.md#settheme) och ingen ändring i [temaverktyget](../guide/guides/language-and-theme.md) når den.
- Dess tabeller och kolumner namnges i den [namnvisning](../guide/guides/logical-names.md#name-view) som dokumentet har, vilket för en fil med låset `Name View` på är den låsta.
- De ord som diagrammet ritar själv, som platshållaren för en tabell utan namn, är på engelska.

## Var den körs {#where-it-runs}

`toImage()` behöver en webbläsarsida, eftersom den mäter och ritar på en canvas. Paketroten som den kommer från behöver en DOM för att läsas in, så den nås inte från Node eller en Web Worker – se [Rendering på serversidan](./installation.md#server-side-rendering).  
Den väntar på att sidans typsnitt har lästs in färdigt innan den ritar.

Den ritar i bildexportens shared worker där värdprogrammet kör en, som dialogrutan gör, så sidan förblir responsiv under tiden, och på huvudtråden där det inte finns någon eller workern inte svarar i tid – se [Web Workers](./installation.md#web-workers).  
En bundle som importerar `toImage` och inget element bär bara bildexportens worker.  
Ingen av builderna för [script-taggen](./installation.md#script-tag) bär den: `window.ErdEditor` och `window.ErdViewer` har ingen `toImage`.

## Avvisningar {#rejections}

Det Promise som den returnerar avvisas, innan något ritats, när:

- sidan saknar `document`: ett `Error`, `toImage needs a browser, since it draws on a canvas`;
- `value` inte är en sträng, till exempel ett dokument som redan har tolkats till ett objekt: ett `TypeError`;
- ett alternativ har ett värde som tabellen [Alternativ](#options) inte listar, ett `format` som saknas inräknat, och det gör även en `scale` på `'2'` som skickas med en SVG-bild: ett `TypeError` som nämner alternativet, som i `toImage: scale cannot be 4`;
- texten inte är ett dokument som tolkaren kan läsa: tolkarens fel, ett `SyntaxError` för text som inte är JSON.

## Dialogrutan Export image {#export-image-dialog}

Dialogrutan och `toImage()` ritar genom samma export, så med samma alternativ skriver de samma bild, men de utgår från olika ställen:

| | Dialogrutan `Export image` | `toImage()` |
| --- | --- | --- |
| Dokument | Diagrammet så som det var när dialogrutan öppnades | Texten som du skickar |
| Mörkt läge | Börjar som editorns utseende, och medan det stämmer överens ritar skärmens egna färger | Av om inte `darkMode` är `true`, och alltid det förinställda temat |
| Namnvisning | Den som editorn visar | Den som dokumentet har |
| Språk för dess egna ord | Editorns visningsspråk | Engelska |
| Resultat | Sparas via webbläsaren eller [exportcallbacken](./installation.md#file-dialogs), eller kopieras till Urklipp | Lämnas tillbaka till dig; ingen av filcallbackerna anropas |

`Copy to clipboard` har ingen motsvarighet. En sida som vill ha en skriver själv PNG-`Blob` till Urklipp.
