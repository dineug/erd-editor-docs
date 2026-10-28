---
sidebar_position: 4
description: "Marraztu dokumentu bat PNG edo SVG gisa zure kodetik toImage funtzioarekin, Export image elkarrizketa-koadroaren aukerak erabiliz, nabigatzailean eta esportazio-workerrean hura dagoen lekuan."
---

# toImage

`5.0.0` bertsiotik aurrera, paketearen erroak `toImage()` esportatzen du, dokumentu bat PNG edo SVG gisa marrazten duena editorerik gabe orrian.  
[Export image](../guide/guides/file-import-export.md#image) elkarrizketa-koadroko `PNG` eta `SVG` botoiek idazten dituzten fitxategiak idazten ditu, elkarrizketa-koadroaren hiru aukerekin, `Background`, `Dark mode` eta `Scale`, eta beste ezeinekin.

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

`ToImageOptions` mota gisa esportatzen da haren ondoan. Ikus [Sarrera-puntuak](./installation.md#entry-points).

## value {#value}

Dokumentuaren testua: `.erd.json` fitxategi batek duena, editore baten [value](./erd-editor-element.md#value) edo [runtimeValue](./erd-editor-element.md#runtimevalue), edo [setInitialValue](./erd-editor-element.md#setinitialvalue) metodoak kargatzen duen beste edozein testu.  
Testu hutsak, edo zuriuneak soilik dituenak, diagrama huts bat marrazten du, eta baita dokumentu baten eremurik ez duen JSON batek ere, analizatzaileak lehenespenekin betetzen duena.

## Aukerak {#options}

| Aukera | Lehenespena | Deskribapena |
| --- | --- | --- |
| `format` | Bat ere ez; derrigorrezkoa da | `'png'` aukerak `image/png` motako `Blob` bat ebazten du, `'svg'` aukerak SVG irudiaren markaketa kate gisa. |
| `background` | `true` | Oihalaren kolorea margotzen du diagramaren atzean. `false` aukerak garden uzten du, ON DELETE edo ON UPDATE etiketa baten azpiko kutxa barne. |
| `darkMode` | `false` | Gai iluna marrazten du argiaren ordez. |
| `scale` | `2` | `1`, `2` edo `3` irudi-pixel diagramaren unitate bakoitzeko `100%` zoomean. PNG irudiaren tamaina bakarrik zehazten du; SVG irudia diagramaren tamainakoa da eskala edozein dela ere. |

`toImage()` funtzioak ez du beste tekla bat ere irakurtzen; beraz, taulak zerrendatzen ez duen tekla batek ez du ezer aldatzen.

## Zer marrazten duen {#what-it-draws}

Irudia elkarrizketa-koadroak marrazten duena da:

- Diagrama osoa, marraztuta dagoenera moztuta gehi marjina bat eta beti `100%` zoomean, dokumentua gordetzean zein zoomean zegoen axola gabe; beraz, taula guztiak osorik marrazten dira. Dokumentuan [View Option](../guide/guides/table-related-functions.md#table-view-options) aukerak ezkutatzen duena ez da marrazten ezta lekurik ematen ere, taula-taldeak beste guztiaren atzean marrazten dira, eta [Hiztegiaren egiaztapenek](../guide/guides/dictionary.md#marks-on-the-canvas) izenei ematen dieten koloreak ez dira marrazten.
- PNG irudia diagramak `100%` zoomean duen tamaina da, `scale` balioarekin biderkatuta. Nabigatzailearen oihal batentzat handiegia denak ebazpen murriztuan idazten da huts egin beharrean, eta `toImage()` funtzioak ez du hori jakinarazten.
- SVG irudiak bere testua testu gisa mantentzen du eta bere letra-tipoak izendatzen ditu txertatu beharrean; beraz, editorearen letra-tiporik ez duen ikustaile batek beste bat marrazten du. Itzalak kanpoan uzten dira.

Elkarrizketa-koadroak editorearen pantaila hartzen duen lekuan, `toImage()` funtzioak dokumentua bakarrik hartzen du; beraz, dokumentu batek berdin marrazten du orri guztietan:

- Bere koloreak elementuaren gris eta azentu lehenetsien aurrez zehaztutako gaia dira, `slate` eta `indigo`, argia `darkMode` `true` ez bada. Orriaren gairik, [setTheme](./erd-editor-element.md#settheme) gainidazketarik eta [gai-sortzailearen](../guide/guides/language-and-theme.md) aldaketarik ez da honetara iristen.
- Bere taulak eta zutabeak dokumentuak duen [Izenen ikuspegian](../guide/guides/logical-names.md#name-view) izendatzen dira, `Name View` blokeoa aktibatuta duen fitxategi batean blokeatutakoa dena.
- Diagramak berak marrazten dituen hitzak, hala nola izenik gabeko taula baten ordezkoa, ingelesez daude.

## Non exekutatzen den {#where-it-runs}

`toImage()` funtzioak nabigatzaileko orri bat behar du, oihal batean neurtu eta marrazten baitu. Dagokion paketearen erroak DOM bat behar du kargatzeko; beraz, ez da Node edo Web Worker batetik lortzen. Ikus [Zerbitzari aldeko errendatzea](./installation.md#server-side-rendering).  
Orriaren letra-tipoak kargatzen amaitu arte itxaroten du marraztu aurretik.

Irudi-esportazioko worker partekatuan marrazten du ostalariak bat exekutatzen duenean, elkarrizketa-koadroak bezala, orriak erantzuten jarrai dezan bitartean, eta hari nagusian bat ez dagoenean edo workerrak garaiz erantzuten ez duenean. Ikus [Web Workers](./installation.md#web-workers).  
`toImage` inportatzen duen eta elementurik ez duen bundle batek irudi-esportazioko workerra bakarrik darama.  
[Script etiketako](./installation.md#script-tag) bi konpilazioek ez dute eramaten: `window.ErdEditor` eta `window.ErdViewer` objektuek ez dute `toImage` funtziorik.

## Baztertzeak {#rejections}

Itzultzen duen Promise objektua baztertu egiten da, ezer marraztu aurretik, hauetan:

- orriak ez du `document` objekturik: `Error` bat, `toImage needs a browser, since it draws on a canvas`;
- `value` ez da katea, hala nola objektu batean dagoeneko analizatutako dokumentu bat: `TypeError` bat;
- aukera batek [Aukerak](#options) taulak zerrendatzen ez duen balio bat du, `format` falta dena barne, eta baita SVG batekin pasatutako `'2'` `scale` balioak ere: aukera izendatzen duen `TypeError` bat, `toImage: scale cannot be 4` bezala;
- testua ez da analizatzaileak irakur dezakeen dokumentu bat: analizatzailearen errorea, `SyntaxError` bat JSON ez den testuarentzat.

## Export Image elkarrizketa-koadroa {#export-image-dialog}

Elkarrizketa-koadroak eta `toImage()` funtzioak esportazio beraren bidez marrazten dute; beraz, aukera berberekin irudi bera idazten dute, baina leku desberdinetatik hasten dira:

| | `Export image` elkarrizketa-koadroa | `toImage()` |
| --- | --- | --- |
| Dokumentua | Elkarrizketa-koadroa ireki zenean zegoen diagrama | Pasatzen duzun testua |
| Modu iluna | Editorearen itxurarekin bat egiten hasten da, eta bat datorren bitartean pantailaren kolore propioak marrazten ditu | Itzalita `darkMode` `true` ez bada, eta beti aurrez zehaztutako gaia |
| Izenen ikuspegia | Editoreak erakusten duena | Dokumentuak duena |
| Bere hitzen hizkuntza | Editorearen bistaratze-hizkuntza | Ingelesa |
| Emaitza | Nabigatzailearen bidez gordeta edo [esportazio-callbackaren](./installation.md#file-dialogs) bidez, edo arbelera kopiatuta | Zuri itzulia; fitxategi-callback bat ere ez da deitzen |

`Copy to clipboard` aukerak ez du pareko bat. Bat nahi duen orri batek PNG `Blob` objektua berak idazten du arbelean.
