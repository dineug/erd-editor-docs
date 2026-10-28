---
sidebar_position: 1
description: Instalatu @dineug/erd-editor npm bidez edo CDN batetik, erregistratu editorearen eta ikustailearen elementuak, konektatu fitxategi-elkarrizketak eta eguneratu 4.x edo 3.x bertsiotik.
---

# Instalazioa

```sh
npm install @dineug/erd-editor
```

Paketea ESM soilik da (`"type": "module"`), eta `dist` karpeta bakarrik banatzen du.
Ez dago CommonJS konpilaziorik; beraz, `require('@dineug/erd-editor')` deiak ez du funtzionatzen.

Bi elementu pertsonalizatu ditu: `<erd-editor>`, editorea, eta, `5.0.0` bertsiotik aurrera, `<erd-viewer>`, diagrama bat irakurtzeko soilik erakusten duena. Ikus [ErdViewerElement](./erd-viewer-element.md).
`5.0.0` bertsiotik aurrera, paketearen erroa inportatzeak ez du bat ere definitzen. Elementu bakoitzak berea definitzen duen sarrera propioa du. Ikus [Elementuak erregistratzea](#registering-the-elements).

Paketearen exekuzio-garaiko mendekotasunak kanpoan geratzen dira, inportazio soil moduan; zure paketatzaileak ebatzi, bikoiztuak bateratu eta tree-shaking bidez kimatzen ditu. `5.0.0` bertsiotik aurrera, bere `dist` karpetak modulu bakoitzeko fitxategi bat du; beraz, paketatzaileak orri batek lortzen dituen moduluak bakarrik mantentzen ditu. Ikus [Sarrera-puntuak](#entry-points).
Paketearen worker partekatuak `dist/workers/` karpetaren azpian sarrera-fitxategi bereizi gisa sortzen dira, eta `new URL('./…', import.meta.url)` adierazpenarekin eraikitzen dira: Vite, webpack 5 eta Rspack paketatzaileek worker-sarrera gisa paketatzen duten idazmoldea. Ikus [Web Workers](#web-workers).
Atzean paketatzailerik ez duen orri baterako, bi konpilazio autonomo daude. Ikus [Script etiketa](#script-tag).

## Erabilera {#usage}

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`@dineug/erd-editor/erd-editor.js` inportatzean `<erd-editor>` definitzen da. Diagrama bat erakutsi baino ez duen orri batek `@dineug/erd-editor/erd-viewer.js` inportatzen du horren ordez. Ikus [ErdViewerElement](./erd-viewer-element.md).

`<erd-editor>` elementuak ez du berezko tamainarik. Eman elementuari (edo haren edukiontziari) zabalera eta altuera esplizituak.
`4.1.0` bertsiotik aurrera, [Arakatzailea](../guide/guides/explorer.md) irekita dagoenean elementuaren barruan kokatzen da, ERD oihalaren ezkerrean, eta oihala estutzen du, estali beharrean. Editore berri bat Arakatzailea itxita duela hasten da.
Panela ez da `200px` zabalera baino estuagoa marrazten, eta oihalari gutxienez `320px` zabalera uzten dio; beraz, `520px` baino estuagoa den elementu batean, Arakatzaile irekia ez da marrazten elementua zabaldu arte. Ikus [Oihalaren ondoan](../guide/guides/explorer.md#beside-the-canvas).

`setInitialValue('')` deiak dokumentu berri eta huts bat hasten du. `value` propietatea esleitzeak, aldiz, dokumentua edizio gisa kargatzen du; beraz, desegite-historian geratzen da.
`4.0.0` bertsiotik aurrera, `editor.value` propietatea fitxategi batek gordetzen duen forman dagoen dokumentua da, eta hori da gorde behar dena. `editor.runtimeValue` propietatea editoreak duen moduko dokumentua da, kendutako entitateak barne: lankide bat hasieratzeko erabiltzen da, eta ez da inoiz fitxategi batera joaten. Ikus [runtimeValue](./erd-editor-element.md#runtimevalue).
`4.0.0` bertsiotik aurrera, dokumentu berri batek [ezarpen-blokeo](../guide/guides/settings.md#lock) guztiak ere aktibatuta ditu: ikuspen-eremua, fitxa, Kode-sortzailearen lengoaia, izenen bi idazkerak, mugatzaile mota eta, `4.2.0` bertsiotik aurrera, [Izenen ikuspegia](../guide/guides/logical-names.md#name-view). Korritzeak, zooma aldatzeak, fitxaz aldatzeak, Izenen ikuspegia aldatzeak edo gainerako ezarpenetako bat aldatzeak `editor.value` lehen zegoen bezala uzten du, eta ez du `change` gertaerarik igortzen. Testutik kargatutako dokumentu batek bertan izendatutako blokeoak mantentzen ditu. Blokeorik izendatzen ez duena, `4.0.0` bertsioa baino lehen gordetako edozein fitxategi bezala, blokeo guztiak aktibatuta irekitzen da, % 100eko zoomean eta ERD fitxan, gordetako ikuspen-eremua eta fitxa edozein direla ere. Haren ikuspen-eremua `0, 0` jatorrian blokeatzen da, eta, han diagramaren zatirik marraztuta ez badago, ikuspegia diagraman irekitzen da horren ordez. Ikus [setInitialValue](./erd-editor-element.md#setinitialvalue).
`4.2.0` bertsioa baino lehen gordetako fitxategi bat Izenen ikuspegia `Physical Names` ikuspegian blokeatuta duela irekitzen da, gainerako blokeo guztiak desaktibatuta dituena ere bai. `4.0.0` edo `4.1.0` bertsioko editore batek Izenen ikuspegiaren blokeoa dagoen bezala mantentzen du gordetzean, baina ikuspegia galdu egiten du; beraz, Izenen ikuspegia desblokeatuta duela gordetako `4.2.0` bertsioko fitxategi bat desblokeatuta geratzen da, baina `Physical Names` ikuspegian irekitzen da berriro.
APIaren gainerakorako, ikus [ErdEditorElement](./erd-editor-element.md).

### CDN {#cdn}

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js"></script>
```

`esm.run` zerbitzuak paketearen kanpoko mendekotasunak ebazten ditu zure ordez; beraz, honek paketatzailerik gabe funtzionatzen du.
Sarrera bakoitza bertsioaren ondorengo bidearen bidez lortzen da: `…/erd-editor.js` bidez editorea definitzen da, eta `…/erd-viewer.js` bidez ikustailea, zeinak ingelesa ez diren bistaratze-hizkuntza bakoitza CDNtik eskuratzen baitu orri batek eskatzen duenean. Paketaren URL soilak, `https://esm.run/@dineug/erd-editor@5.0.0`, erroa zerbitzatzen du, eta honek ez du elementurik definitzen.
Bertsiorik gabeko URLak beti azken bertsioa zerbitzatzen du. Finkatu bertsio bat, goian bezala, ez baduzu nahi eguneratze nagusi bat abisurik gabe zure orrira iristea.
`5.0.0` bertsioa bera da horietako bat: 4.x bertsioan geratu behar duen orri batek `@4.2.0` bertsioa finkatzen du. Ikus [4.x bertsiotik eguneratzea](#upgrading-from-4x).

`esm.run` zerbitzuak worker partekatuak `cdn.jsdelivr.net` helbidetik zerbitzatzen ditu, eta nabigatzaileak ez du worker partekaturik abiarazten orriarena ez den jatorri batetik. Beraz, horrela kargatutako editore bat bere workerrik gabe exekutatzen da, haiek blokeatzen dituen ostalari batean bezala. Ikus [Web Workers](#web-workers). [Script etiketako](#script-tag) konpilazioak fitxategiaren barruan daramatza.

### Script etiketa {#script-tag}

`3.6.0` bertsiotik aurrera, paketeak UMD konpilazio bat ere banatzen du, mendekotasun guztiak eta worker partekatu guztiak fitxategi bakar baten barruan dituena, `dist/erd-editor.umd.js`.
`unpkg` eta `jsdelivr` eremuek hura seinalatzen dute; beraz, bi CDN zerbitzuetako edozeinetan paketearen URL soilak hura zerbitzatzen du, eta konpilazio horrek `window.ErdEditor` definitzen du.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Hura kargatzeak `<erd-editor>` definitzen du. `window.ErdEditor` objektuak fitxategien bi callback funtzioak ditu, `ErdEditor.setExportFileCallback` eta `ErdEditor.setImportFileCallback`, `3.9.2` bertsiotik aurrera `ErdEditor.createKeyBindingMap`, `4.2.0` bertsiotik aurrera `ErdEditor.dictionaryRowChords` — ikus [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) — eta `5.0.0` bertsiotik aurrera `ErdEditor.ErdEditorElement` eta `ErdEditor.defineErdEditor`. Ikus [Elementuak erregistratzea](#registering-the-elements). Ez du [toImage](./to-image.md) funtziorik.

`5.0.0` bertsiotik aurrera, bigarren fitxategi batek, `dist/erd-viewer.umd.js`, `<erd-viewer>` definitzen du, eta `ErdViewerElement` eta `defineErdViewer` `window.ErdViewer` objektuan jartzen ditu. Ez du workerrik abiarazten, 25 bistaratze-hizkuntzak ditu, eta ez du ezer eskatzen emandako `src` baliora ez bada.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

Fitxategi batek ere ez du besteren etiketa definitzen, eta bakoitzak ez du orrian bere globala eta `window.Konva` baizik uzten.
Paketearen exports mapak paketatzailea ES moduluetara bideratzen du oraindik; beraz, npm bidezko instalazio batek ez du inoiz fitxategi hauetako bat ere hartzen.
Bere script propioa kargatu ezin duen orri batek erd-editor.io/embed helbideko ikustaile ostatatua ere txerta dezake horren ordez. Ikus [Txertatzea](../guide/guides/embedding.md).

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.querySelector('erd-editor');
</script>
```

```css
erd-editor {
  display: block;
  width: 100%;
  height: 100vh;
}
```

`4.0.0` bertsiotik aurrera, `enable-locale-picker` atributuak tresna-barrako `Display Language` hautatzailea gehitzen du, eta `enable-welcome-screen` atributuak diagrama huts batek erakusten duen ongietorri-pantaila. Ikus [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) eta [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
Dokumentu bat kargatzen duen orri batek, [Erabilera](#usage) atalekoak bezala, `enableWelcomeScreen` aktibatzen du `setInitialValue()` metodoak dokumentua kargatu ondoren, ez markaketan; horrela, pantaila ez da inoiz une batez agertzen oraindik kargatzen ari den fitxategi baten gainean.
Editoreak 25 bistaratze-hizkuntza guztiak darama, bai ES konpilazioan bai script etiketako konpilazioan; beraz, ez dago zerbitzatu beharreko hizkuntza-fitxategirik, ezta erregistratu beharreko ezer ere. Hautatzailerik eta `setLocale()` deirik gabe, editoreak ingelesa erakusten du.

Hemen `readonly` atributua gehitzeak editorea irakurle gisa irekitzen du: `value` propietatea esleitzea, `clear()` metodoari deitzea eta `setSchema*()` dei guztiak, `setSchemaJSON()` eta gehitze-moduko deiak barne, baztertu egiten dira, eta `change` gertaera ez da inoiz igortzen. Haren fitxak, Arakatzailea eta Bilaketa azkarra irakurtzeko geratzen dira, eta diagrama editatuko lukeen kontrol oro desagertzen da.
`editor.value` eta `editor.runtimeValue` irakurtzeak funtzionatzen du oraindik, eta biek dokumentuaren ezarpen propioak mantentzen dituzte: irakurleak aldatzen duen ikuspegi-ezarpen bat, hala nola zooma edo datu-basea, editore horren pantailan geratzen da. Kargatzeko, erabili `setInitialValue()` horren ordez. Ikus [readonly](./erd-editor-element.md#readonly).

### Zerbitzari aldeko errendatzea {#server-side-rendering}

`engine.js` eta `peer.js` ez diren sarrera guztiek DOM bat behar dute; beraz, Node ingurunean errore bat jaurtitzen dute. `erd-editor.js` eta `erd-viewer.js` sarrerek beren elementua modulu-esparruan definitzen dute, eta paketearen erroak, `5.0.0` bertsiotik aurrera ezer definitzen ez duenak, bi elementu-klaseak eraikitzen ditu kargatzen den bitartean.
Next.js, Nuxt, SvelteKit edo Astro esparruetan, lortu elementuaren sarrera bezeroan soilik exekutatzen den bide batetik, eta erroko izendun inportazio bat, hala nola `setExportFileCallback` edo `toImage`, bide beretik.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

Garapenean, gehitu editorearen antolaketa-workerrak inportatzen duen ELK paketea Viteren aurre-paketatzera, bestela worker horrek egiten dituen antolaketek huts egiten dute: Antolaketa automatikoaren `Flow`, `Tree - vertical` eta `Tree - horizontal`, Bisualizazioa fitxako Fluxu modua eta Fluxuak kokatutako inportazio bat.
Vite 7 eta zaharragoek, gainera, editorea aurre-paketatzetik kanpo utzi behar dute, haien aurre-paketeak workerren URLak inoiz idazten ez dituen fitxategietara seinalatzen baititu, eta hiru workerrek huts egiten baitute. Vite 8n utzi `exclude` hori kanpoan; horrek garapen-zerbitzariak paketearen fitxategi bakoitza bere aldetik eskuratzea baino ez du eragiten. Produkziorako konpilazioak ez du bat ere behar.

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@dineug/erd-editor > elkjs/lib/elk.bundled.js'],
    // Vite 7 and older only:
    // exclude: ['@dineug/erd-editor'],
  },
};
```

### TypeScript {#typescript}

`@dineug/erd-editor/erd-editor.js` inportatzeak `erd-editor` etiketa `HTMLElementTagNameMap` interfazean bateratzen du, eta `@dineug/erd-editor/erd-viewer.js` inportatzeak `erd-viewer` bateratzen du; beraz, elementuak mota zuzena du, mota-bihurketarik egin gabe. Erroko edozein inportaziok, motak soilik ere, biak ekartzen ditu.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` esportatzen da, zure aldagaiei eta propietateei mota esleitzeko. `5.0.0` bertsiotik aurrera elementuaren klasea ere bada, eta `ErdViewerElement` ikustailearen interfazea eta klasea da. Ikus [Elementuak erregistratzea](#registering-the-elements).
`4.0.0` bertsiotik aurrera, paketeak `LocaleCode`, `LocaleOption` eta `SchemaSQLOptions` motak ere esportatzen ditu, eta `5.0.0` bertsiotik aurrera `ToImageOptions`. Ikus [Sarrera-puntuak](#entry-points). `setSchema*()` metodoek hartzen dituzten aukerek ez dute izen esportaturik; atera elementutik, `Parameters<ErdEditorElement['setSchemaSQL']>[1]` bezala.
`5.0.0` bertsiotik aurrera, paketearen `typesVersions` eremuak azpibide-sarrera bakoitzaren motak ere ematen ditu `moduleResolution: "node10"` konfigurazioan, zeinak ez baitu exports maparik irakurtzen.

## Elementuak erregistratzea {#registering-the-elements}

`5.0.0` bertsiotik aurrera, paketeak etiketa bat orri batek eskatzen duen tokian bakarrik definitzen du.

| Inportazioa | Definitzen duena |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | Ezer ez |

Bi sarreretako bakoitzak bere etiketa ebaluatzen den bitartean definitzen du eta ez du ezer esportatzen; beraz, bere efekturako soilik inportatzen da, eta bietako batek ere ez du besteren etiketa definitzen.
Erroak bi elementu-klaseak esportatzen ditu, `ErdEditorElement` eta `ErdViewerElement`, eta `defineErdEditor()` eta `defineErdViewer()`, zeinek deitzen duzun tokian definitzen duten beren etiketa:

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

Dei batek ez du ezer egiten etiketak klase hori duen bitartean; beraz, sarrera bat eta define dei bat, edo bi define dei, orri berean bil daitezke. `Error` bat jaurtitzen du etiketa izendatuz beste klase batek duenean, orri berean paketatutako paketearen bigarren kopia batek bezala: `Another element class already defines the custom element name erd-editor`.
Erroko klaseak sarrerek definitzen dituztenak dira; beraz, `customElements.get('erd-editor') === ErdEditorElement` betetzen da bietako bat exekutatu ondoren. Etiketa definitu arte, `document.createElement('erd-editor')` deiak `HTMLElement` arrunt bat egiten du, editorearen kiderik gabe, eta `new ErdEditorElement()` deiak errore bat jaurtitzen du.

Zure etiketa propio baterako, definitu klasea zuk zeuk haren pean, eta gehitu etiketa `HTMLElementTagNameMap` interfazera zuk zeuk. Egin ezazu elementu horren sarrera ez duen, haren [script etiketako](#script-tag) konpilazioa kargatzen ez duen eta hari buruzko define funtziorik deitzen ez duen leiho batean, klase batek izen bakarra hartzen baitu leiho bakoitzean:

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

Bi elementuak dituen bundle batek Vite eta Rolldown `INEFFECTIVE_DYNAMIC_IMPORT` abisu bat ematera behartzen ditu ingelesa ez den bistaratze-hizkuntza bakoitzeko. Ikustaileak horietako bakoitza bere `import()` bidez kargatzen du, eta editoreak hiztegi guztiak batera inportatzen ditu; beraz, editorearen chunkean geratzen dira eta harekin batera kargatzen dira. Ez da ezer hutsegiten, eta ikustailea soilik duen bundle batek hizkuntza bakoitza bere chunkean mantentzen du.

## Sintaxia nabarmentzea {#syntax-highlighting}

SQL eskemaren eta Kode-sortzailearen panelak [Shiki](https://shiki.style) liburutegiak nabarmentzen ditu, bere worker partekatu propioan, eta `4.0.0` bertsiotik aurrera baita SQL eskema fitxako `Before tables` eta `After tables` scriptak ere.
`3.7.0` bertsiotik aurrera, ez dago ezer instalatu edo erregistratu beharrik: workerra kode-panel bat lehen aldiz errendatzen denean eraikitzen da; beraz, bat ere irekitzen ez duen orri batek ez ditu inoiz gramatikak eskuratzen.

| | |
| --- | --- |
| Lengoaiak | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Gaiak | `github-dark` eta `github-light`, editorearen itxura argiari edo ilunari jarraituz |

Horiexek dira, hain zuzen, panelek sortzen dituzten lengoaiak: `JPA` Java gisa nabarmentzen da, `SQLAlchemy` Python gisa, `TypeORM`, `Sequelize`, `Drizzle` eta `Zod` TypeScript gisa, `Doctrine` PHP gisa, `SeaORM` Rust gisa, `JSON Schema` JSON gisa, eta `DBML` eta `AML` SQL gisa, multzoan dagoen gramatikarik hurbilena baita. Ikus [Kode-sortzailea](../guide/guides/code-generator.md).

Adierazpen erregularren motorra JavaScript hutsa da; beraz, ostalariaren ezein politikak ez du `wasm-unsafe-eval` behar.
`SharedWorker` falta den lekuetan — Android sistemako Chrome 148 baino lehenago, 16.4 bertsioa baino lehenagoko Safari — hutsegitea erregistratzen da eta kodea testu arrunt gisa erakusten da; scriptak edita daitezke oraindik.

`3.6.0` edo lehenagoko bertsio batetik eguneratzean: `@dineug/erd-editor-shiki-worker` paketea ez da gehiago argitaratzen, eta `setGetShikiServiceCallback` funtzioa ere harekin batera desagertu da.
Kendu instalazioa eta erregistratzea; workerra CDN batetik kargatzen zuen orri batek bigarren `<script>` etiketa hori ere kentzen du.

## Web Workers {#web-workers}

Editoreak hiru lan exekutatzen ditu `SharedWorker` instantzietan: sintaxia nabarmentzea, irudi-esportazioa, eta [Antolaketa automatikoa](../guide/guides/table-related-functions.md#auto-layout), Bisualizazioa fitxako [Fluxu modua](../guide/guides/visualization.md#how-flow-is-placed) eta, `4.0.0` bertsiotik aurrera, inportatutako eskema baten kokapena ahalbidetzen dituen taulen antolaketa.
Hirurak `@dineug/erd-editor` paketearen barruan banatzen dira. Ez duzu horietako bat ere konfiguratu behar, baina ostalari batek horietako edozein blokea dezake.
`5.0.0` bertsiotik aurrera, worker bakoitza bere moduluan eraikitzen da; beraz, bundle batek bere moduluek lortzen dituzten workerrak bakarrik daramatza: [toImage](./to-image.md) funtzioaren eta elementurik gabeko bundle batek irudi-esportazioko workerra bakarrik darama, eta `<erd-viewer>` elementuak ez du workerrik abiarazten. Ikus [Sarrera-puntuak](#entry-points).
Dokumentuaren zabor-bilketa exekutatzen zuen workerra `4.0.0` bertsioan kendu zen, zabor-bilketarekin berarekin batera.

| Workerra | Hura gabe |
| --- | --- |
| Sintaxia nabarmentzea | SQL eskemaren eta Kode-sortzailearen panelak eta SQL eskemaren scriptak testu arrunt gisa geratzen dira |
| Irudi-esportazioa | PNG irudia, SVG irudia, `Copy to clipboard` aukera, `Export image` elkarrizketa-koadroaren aurrebista eta, `5.0.0` bertsiotik aurrera, [toImage()](./to-image.md) hari nagusian marrazten dira, eta horrek orria geldiarazten du marrazten den bitartean |
| Taulen antolaketa | Antolaketa automatikoaren `Flow`, `Tree - vertical` eta `Tree - horizontal` antolaketak, eta Bisualizazioa fitxako Fluxu modua, `Could not place tables` mezuarekin amaitzen dira; Fluxuak kokatutako inportazio batek — `Import` edo `Import and Add` aukeratik datorren SQL, GraphQL, DBML edo AML fitxategi bat, edo `placement: 'auto'` duen `setSchema*()` dei bat — bere taulak errenkadetan jartzen ditu, mezurik gabe; `Force` eta Grafo modua ez dira kaltetzen, editorearen barruan exekutatzen baitira |

Irudi-esportazioak hamar segundoz itxaroten du bere workerrak erantzun dezan, eta ondoren hari nagusian marrazten du; sintaxia nabarmentzeak, berriz, kodea testu arrunt gisa uzten du bere workerrak huts egin bezain laster; beraz, workerrak blokeatzen dituen ostalari batean errendimendua galtzen da, ez funtzionaltasuna.
Taulen antolaketa da salbuespena: antolaketa kalkulatzen duen motorra editorea bera baino astunagoa da, eta ez da inoiz prozesu barruan kargatzen; beraz, lehen kokapenean hogeita hamar segundoz itxaroten dio bere workerrari, eta workerrak erantzun ondoren, hirurogei segundo ematen dizkio antolaketa bati itzultzeko.
Bi itxaronaldietako bat agortzen bada, kokapena workerrik gabe bezala amaitzen da. Antolaketa automatikoak `Placing tables` erakusten du hasi bezain laster; Fluxu moduak eta Fluxuak kokatutako inportazio batek, aldiz, kokapen bat, bere workerraren abiaraztea barne, sei segundoz exekutatzen egon denean soilik erakusten dute.

Vite, webpack 5 eta Rspack paketatzaileek workerrak zure chunken ondoan fitxategi gisa sortzen dituzte. esbuild eta Rolldown, Vite bidez ez baizik eta bere kasa erabilita, ez dute bat ere sortzen; beraz, haiek eraikitako orri batek workerrik gabe exekutatzen da.
Webpacken `experiments.outputModule` esperimentalean ez da workerrik abiarazten, bakoitzak bereizitako chunk baten zain geratzen baita, eta ezerk ez baitu kargatzen. Mantendu webpacken irteera lehenetsia, edo ezarri `optimization.splitChunks: false`.

### Eduki-segurtasuneko politika {#content-security-policy}

Eduki-segurtasuneko politika zorrotza duen orri batek direktiba hauek behar ditu elementuetarako:

- `worker-src 'self'` paketatutako konpilaziorako, zeinaren workerrak paketearen ondoko fitxategiak diren, gehi `blob:` zure paketatzaileak worker bat lerroan txertatzen duen lekuan. [Script etiketako](#script-tag) konpilazioan, hirurak fitxategiaren barruan doaz `data:` URL gisa; beraz, orri horrek `worker-src data:` behar du horren ordez. `<erd-viewer>` elementuak ez du bietako bat ere behar, ez baitu workerrik abiarazten.
- `5.0.0` bertsiotik aurrera, bi elementuek eraikitako estilo-orriekin egiten diete estiloa beren buruei, eta `style-src 'self'` direktibak uzten ditu pasatzen. Editorearen kode-panelek oraindik `style` atributuekin koloreztatzen dute testua, eta `Export image` elkarrizketa-koadroaren aurrebista `blob:` URL bateko irudi bat da; beraz, editoreak `style-src 'unsafe-inline'` eta `img-src blob:` ere behar ditu horietarako.
- Eraikitako estilo-orririk gabeko nabigatzaile batek, hala nola 101 baino lehenagoko Firefoxek, `<style>` elementuak jasotzen ditu horren ordez, eta horiek `style-src 'unsafe-inline'` behar dute edozein elementuarentzat.
- `<erd-viewer>` elementuak bere `src` eskuratzen du; beraz, jatorri hori `connect-src` direktiban jartzen da. Ikus [Zer gehitzen dion orri bati](./erd-viewer-element.md#what-it-adds-to-a-page).

## Sarrera-puntuak {#entry-points}

Paketeak bost sarrera ditu:

| Sarrera | Zer den |
| --- | --- |
| `@dineug/erd-editor` | Erroa: beheko esportazioak. `5.0.0` bertsiotik aurrera ez du elementurik definitzen, nahiz eta kargatzeko DOM bat behar duen |
| `@dineug/erd-editor/erd-editor.js` | `5.0.0` bertsiotik aurrera. `<erd-editor>` definitzen du eta ez du ezer esportatzen |
| `@dineug/erd-editor/erd-viewer.js` | `5.0.0` bertsiotik aurrera. `<erd-viewer>` definitzen du eta ez du ezer esportatzen |
| `@dineug/erd-editor/engine.js` | Dokumentu-biltegia DOMik gabe |
| `@dineug/erd-editor/peer.js` | `3.9.1` bertsiotik aurrera. MCP zerbitzariaren editorerik gabeko parekoa |

Erroak bi elementu-klaseak eta haien define funtzioak esportatzen ditu, callback funtzioak ezartzeko bi funtzio, `3.9.2` bertsiotik aurrera tekla-konbinazio lehenetsiak beren motekin, `4.0.0` bertsiotik aurrera bistaratze-hizkuntzaren motak eta `getSchemaSQL()` metodoaren aukeren mota, `4.2.0` bertsiotik aurrera Hiztegia fitxako errenkaden tekla-konbinazioak, eta `5.0.0` bertsiotik aurrera `toImage`.

| Esportazioa | Deskribapena |
| --- | --- |
| `ErdEditorElement` | Elementuaren interfazea. Ikus [ErdEditorElement](./erd-editor-element.md). `5.0.0` bertsiotik aurrera haren klasea ere bada, `<erd-editor>` definitzen den klasea. Ikus [Elementuak erregistratzea](#registering-the-elements). |
| `ErdViewerElement` | `5.0.0` bertsiotik aurrera. Ikustailearen interfazea eta klasea. Ikus [ErdViewerElement](./erd-viewer-element.md). |
| `defineErdEditor()`, `defineErdViewer()` | `5.0.0` bertsiotik aurrera. `<erd-editor>` edo `<erd-viewer>` definitzen dute haren klase gisa. Dei batek ez du ezer egiten etiketak klase hori duen bitartean, eta `Error` bat jaurtitzen du beste klase batek duenean. Ikus [Elementuak erregistratzea](#registering-the-elements). |
| `toImage(value, options)` | `5.0.0` bertsiotik aurrera. Dokumentu bat PNG `Blob` gisa edo SVG kate gisa marrazten du, `Export image` elkarrizketa-koadroaren aukerekin. Ikus [toImage](./to-image.md). |
| `ToImageOptions` (mota) | `5.0.0` bertsiotik aurrera. `toImage()` funtzioak hartzen dituen aukerak: `format`, `background`, `darkMode` eta `scale`. |
| `setExportFileCallback(cb)` | Nabigatzailearen deskarga ordezten du, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Nabigatzailearen fitxategi-hautatzailea ordezten du, `({ type, op, accept, mode }) => void`; `mode` parametroa `4.0.0` bertsiotik aurrera. `4.2.0` bertsiotik aurrera, Hiztegia fitxako `Import CSV` aukerak nabigatzailearen hautatzailea irekitzen du, callback funtzio bat ezarrita egon arren. Ikus [Fitxategi-elkarrizketak](#file-dialogs). |
| `createKeyBindingMap()` | Tekla-konbinazio lehenetsiak itzultzen ditu `KeyBindingMap` berri gisa dei bakoitzean. Ikus [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (motak) | Tekla-konbinazioen mapa bat, haren komando-izenen bildura eta tekla-konbinazio bat. |
| `dictionaryRowChords(map)` | `4.2.0` bertsiotik aurrera. Pasatzen duzun `KeyBindingMap` maparen arabera [Hiztegia](../guide/guides/dictionary.md#adding-and-deleting-rows) fitxako saretak errenkadak txertatzeko eta ezabatzeko erabiltzen dituen tekla-konbinazioak itzultzen ditu, `ShortcutOption[]` berri gisa dei bakoitzean. Errenkadak gainean txertatzen dituena, `Alt+Shift+Enter` balio lehenetsiekin, ez dago inongo izeni lotuta. Ikus [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (motak) | `4.0.0` bertsiotik aurrera. 25 bistaratze-hizkuntzen kodeak, eta kode horiek gehi `'system'`, `setLocale()` metodoak hartzen duena. Ikus [Bistaratze-hizkuntza](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (mota) | `4.0.0` bertsiotik aurrera. `getSchemaSQL()` metodoak hartzen dituen aukerak: `statements`, `header` eta, `4.2.0` bertsiotik aurrera, `logicalNameAsComment`. Ikus [getSchemaSQL](./erd-editor-element.md#getschemasql). |

`5.0.0` bertsiotik aurrera, `dist` karpetak modulu bakoitzeko minifikatu gabeko fitxategi bat du, bakoitza bere deklarazioaren ondoan, eta `package.json` fitxategiaren `sideEffects` eremuak bi etiketa-sarrerak eta workerren fitxategiek behar dituzten bi stub baino ez ditu izendatzen. Beraz, paketatzaileak orri batek lortzen ez dituen modulu guztiak baztertzen ditu eta behin bakarrik minifikatzen du:

- Erroko izendun inportazio batek, hala nola `setExportFileCallback`, ez du elementurik ez workerrik paketatzen.
- `toImage` funtzioak irudi-esportazioko workerra ekartzen du, eta ez elementurik.
- `erd-editor.js` sarrerak editorea eta hiru worker partekatuak ekartzen ditu.
- `erd-viewer.js` sarrerak ikustailea ekartzen du, workerrik gabe, ingelesa barruan duela eta beste bistaratze-hizkuntza bakoitza bere chunkean, orri batek eskatzen duenean kargatua.

`@dineug/erd-editor/engine.js` sarrerak dokumentu-biltegia DOMik gabe exekutatzen du; beraz, Web Worker batean funtzionatzen du. Ikus [Urruneko biltegiratzea](./advanced/remote-storage.md).
`createReplicationStore` funtzioa eta `ReplicationStore` mota esportatzen ditu. `3.10.0` bertsiotik aurrera, `ReplicationChange` mota ere esportatzen du, `{ value: string; changed: boolean }`, erreplika baten `change` entzuleak jasotzen duena. Ikus [on@change](./advanced/remote-storage.md#onchange).
`4.0.0` bertsiotik aurrera, `ReplicationStore` batek `runtimeValue` propietatea ere badu. Haren `value` propietatea eta `change` gertaera batek ematen duena fitxategi batek gordetzen duen biltegiratze-forma dira, elementuarenak bezala. Ikus [ReplicationStore](./advanced/remote-storage.md#replicationstore).

`@dineug/erd-editor/peer.js` [MCP zerbitzariak](../mcp/introduction.md) dokumentu bat editatzeko bitarteko gisa erabiltzen duen editorerik gabeko parekoa da. Zerbitzari horrentzat dago, eta orri hauek ez dute dokumentatzen.

### Fitxategi-elkarrizketak {#file-dialogs}

Inportazioa eta esportazioa injekta daitezkeen callback funtzioen bidez egiten dira; beraz, nabigatzailearen fitxategi-elkarrizketarik ez duen ostalari batek, adibidez IDE baten webview batek, berea eman dezake.
Biak ez dira simetrikoak: esportazioak amaitutako fitxategia ematen dizu; inportazioak, berriz, fitxategi bat eskatu besterik ez du egiten, eta edukia zuk zeuk sartu behar duzu berriro.
`4.2.0` bertsiotik aurrera, Hiztegia fitxako `Import CSV` aukera da inoiz inportazioko callback funtzioari deitzen ez dion inportazio bakarra; callback horren `type` parametroak ez du CSV baliorik. Beti nabigatzailearen beraren fitxategi-hautatzailea irekitzen du, `.csv` fitxategietarako. Ikus [CSV fitxategiak inportatzea eta esportatzea](../guide/guides/dictionary.md#importing-and-exporting-csv).

`op` parametroa `set` edo `diff` da: `diff` bat `setDiffValue()` metodora doa, `type` edozein dela ere. Bestela, `type` parametroak aukeratzen du metodoa, eta `accept` parametroak mota horren luzapenak ditu, ostalariaren fitxategi-elkarrizketa bati emateko prest.
`4.0.0` bertsiotik aurrera, `set` batek `mode: 'append'` darama erabiltzaileak [Inportatu eta gehitu](../guide/guides/file-import-export.md#import-and-add) aukeratu duenean, eta ez du `mode` baliorik eramaten inportazio arrunt batean. Pasatu aurrera: hura baztertzen duen callback funtzio batek erabiltzaileak gehitu nahi zion diagrama ordezten du.

| `type` | `accept` | Metodoa |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'` aukerak taulak beren erlazioen arabera antolatzen ditu kokatu aurretik, editorearen Inportatu ekintzak berak egiten duen bezala, eta deiari Promise bat itzularazten dio. Hura gabe, taulak berehala kokatzen dira errenkadetan. Ikus [setSchemaSQL](./erd-editor-element.md#setschemasql) eta [setSchemaJSON](./erd-editor-element.md#setschemajson).

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept, mode }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.setSchemaJSON(text, { mode });
  } else if (type === 'sql') {
    editor.setSchemaSQL(text, { placement: 'auto', mode });
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text, { placement: 'auto', mode });
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text, { placement: 'auto', mode });
  } else if (type === 'aml') {
    editor.setSchemaAML(text, { placement: 'auto', mode });
  }
});
```

Adarkatu kudeatzen duzun `type` balio bakoitzaren arabera, eta baztertu gainerakoak.
Ordezten duen `setSchemaJSON()` dei batek, `value` propietatea esleitzeak bezala, dokumentua garbitzen du analizatu aurretik; beraz, `.erd.json` dokumentu bat ez den eduki bat hara bideratzeak — dena harrapatzen duen `else` adar baten bidez, edo geroago gehitutako `type` balio bat azken adarrera erori delako — diagrama hustu egiten du, ezer inportatu beharrean.

Editoreak sortzen duen `fileName` balioa `<database name>-<timestamp>` gehi fitxategiaren luzapena da, eta denbora-zigilua tokiko ordua da, `yyyy-MM-dd'T'HH_mm_ss` formatuan. Datu-basearen izena hutsik badago, `unnamed` erabiltzen da haren ordez. Hiztegiko CSV fitxategi batek bere orriaren izena jartzen du luzapenaren aurretik, `<database name>-<timestamp>-words.csv` fitxategian bezala.
Esportazioko callback funtzioak fitxategi hauek jasotzen ditu. `4.0.0` bertsiotik aurrera, SVG irudia eta Kode-sortzailearen fitxategiak ere haien artean daude, eta `.sql` fitxategia SQL eskema fitxako `Save file` aukeratik dator, ez zuzenean `Export` menutik. `4.2.0` bertsiotik aurrera, Hiztegia fitxako CSV fitxategia ere haien artean dago. [toImage()](./to-image.md) funtzioak ez dio callback bati ere deitzen: bere irudia zuri itzultzen dizu.

| Fitxategia | Luzapena | Blob `type` |
| --- | --- | --- |
| JSON esportazioa | `.erd.json` | `application/json` |
| SQL eskema fitxako `Save file` aukera, fitxak erakusten duen testuarekin. Ikus [SQL eskema](../guide/guides/schema-sql.md) | `.sql` | bat ere ez |
| [Export image](../guide/guides/file-import-export.md#image) elkarrizketa-koadroa | `.png` edo `.svg` | `image/png` edo `image/svg+xml` |
| Kode-sortzailea fitxako `Save file` aukera. Ikus [Kode-sortzailea](../guide/guides/code-generator.md) | Lengoaiarena: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` edo `.mmd` | bat ere ez |
| Hiztegia fitxako `Export CSV` aukera, erakusten den orriaren errenkada guztiekin, haren bilaketak zer zerrendatzen duen gorabehera. Ikus [CSV fitxategiak inportatzea eta esportatzea](../guide/guides/dictionary.md#importing-and-exporting-csv) | `.csv` | `text/csv` |

Kudeatzailea luzapenaren arabera aukeratzen duen ostalari batek horietako bakoitzerako bat behar du.

Ezarri gabe utziz gero, editoreak nabigatzailearen beraren deskarga- eta fitxategi-hautatzaile-portaera erabiltzen du. Pasatu `null` portaera horretara itzultzeko.

## Nabigatzaileen euskarria {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+: argitaratutako paketeak eraikitzeko oinarri gisa hartzen den ES2022 maila.
Ez da polyfillik paketatzen. Gehitu zureak, nabigatzaile zaharragoetara iritsi behar baduzu.

## 4.x bertsiotik eguneratzea {#upgrading-from-4x}

`5.0.0` bertsio nagusi bat da. Egiaztatu hauetako bakoitza orri bat 4.x bertsiotik eramatean:

- `import '@dineug/erd-editor'` jarraibideak ez du jada `<erd-editor>` definitzen. Inportatu `@dineug/erd-editor/erd-editor.js` haren efekturako, edo deitu `defineErdEditor()` funtziora, eta mantendu erroko izendun inportazioak dauden bezala. TypeScript-ek ez du abisurik ematen inportazio soilean geratu den orri baten gainean, erroko deklarazioek etiketa `HTMLElementTagNameMap` interfazean izendatzen jarraitzen baitute, baina sortzen duen elementua `HTMLElement` arrunt bat da; beraz, haren lehen metodo-deiak `TypeError` bat jaurtitzen du. Ikus [Elementuak erregistratzea](#registering-the-elements).

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- CDN batean gauza bera gertatzen da `https://esm.run/@dineug/erd-editor` helbidearekin, zeinak orain erroa zerbitzatzen duen eta ezer definitzen ez duen: inportatu `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`. jsDelivr eta unpkg zerbitzuen URL soilek script etiketako konpilazioa zerbitzatzen jarraitzen dute, lehen bezala `<erd-editor>` definitzen duena. Bertsiorik gabeko URL batek orain azken 5.x bertsioa zerbitzatzen du; finkatu `@4.2.0` 4.x bertsioan geratzeko. Ikus [CDN](#cdn) eta [Script etiketa](#script-tag).
- Erroak ezer definitzen ez badu ere DOM bat behar du; beraz, zerbitzari aldeko errendatzearekin, haren izendun inportazio bat, hala nola `setExportFileCallback`, bezeroan soilik exekutatzen den bidean geratzen da elementuaren sarreraren ondoan. Ikus [Zerbitzari aldeko errendatzea](#server-side-rendering).
- `window.ErdEditor` objektuak `ErdEditorElement` eta `defineErdEditor` irabazten ditu. Ikustailearen script etiketako konpilazioak `ErdViewerElement` eta `defineErdViewer` jartzen ditu `window.ErdViewer` objektuan, eta bietako globalak ez du `toImage` daramanik.
- `readonly` editore bat irakurle gisa irekitzen da. Haren sei fitxak, Arakatzailea, Bilaketa azkarra eta presentzia geratzen dira, eta diagrama editatuko lukeen kontrol oro desgaitu beharrean desagertzen da: tresna-barrak datu-basearen izena testu gisa erakusten du, Ezarpenak fitxak bere ezarpenak erakusten ditu kontrol guztiak desgaituta `Read only` etiketa baten azpian, eta tresna-barra flotatzaileak zooma, Izenen ikuspegia, zen modua eta iparrorratza baino ez ditu mantentzen; beraz, `Hand` eta `Select` desagertu dira eta arrastatze batek ikuspegia mugitzen du. Sakatzeak ez du ezer hautatzen: hautapen bakarra Arakatzailetik edo Bilaketa azkarretik egindako jauzi batek iristen den elementuaren inguruan jartzen duen ingerada da, klik geldi batek garbitzen duena, eta dena hautatzeko lasterbideek ez dute ezer hautatzen. `readonly` aktibatzeak irekita zegoena amaitzen du, hala nola hautapena, esku-tresna, gelaxka-editorea, arrastatze bat, Map Columns, Antolaketa automatikoaren `Force` aurreikuspena eta Time Travel, eta korritzea, zooma, fitxa eta Izenen ikuspegia mantentzen ditu. Ikus [readonly](./erd-editor-element.md#readonly).
- `readonly` irakurle batek aldatzen dituen ezarpenak editore horren pantailan geratzen dira, haien blokeoek zer esaten duten axola gabe: korritzea eta zooma, fitxa, Izenen ikuspegia, View Option, datu-basea eta Code Generator hizkuntza, izenen idazkerak eta mugatzaile mota. `value`, `runtimeValue` eta JSON esportazioak dokumentuarenak mantentzen dituzte, 4.x bertsioko irakurle baten aldaketak iritsi zitezkeenak, eta `getSharedStore()` metodoak ez dio horietako bat ere bidaltzen beste editoreei. Bezerorik gabeko `getSchemaSQL()` deiak irakurleak aukeratu duen datu-basea idazten du. `readonly` desaktibatzeak datu-basea, kode-ezarpenak eta View Option dokumentuarenetara itzultzen ditu, eta korritzea, zooma, fitxa eta Izenen ikuspegia irakurleak utzi zituen tokian uzten ditu.
- Ezarpenak fitxako `Recalculation table width` errenkada desagertu da. Kargatzeak eta itsasteak taula bakoitzaren zabalera bere testuari egokitzen diote oraindik.
- Vite 8n kendu `optimizeDeps` eremuko `exclude: ['@dineug/erd-editor']`, Vite 7 eta zaharragoek soilik behar dutena, eta mantendu ELK `include`. Ikus [Vite](#vite).

## 3.x bertsiotik eguneratzea {#upgrading-from-3x}

`4.0.0` bertsio nagusi bat da. Egiaztatu hauetako bakoitza orri bat 3.x bertsiotik eramatean, eta ondoren `5.0.0` bertsiorako [4.x bertsiotik eguneratzea](#upgrading-from-4x) atalekoak:

- `editor.value`, erreplika baten `value` eta haren `change` gertaerak ematen duen `value` fitxategi batek gordetzen duen biltegiratze-forma dira: ez dute kendutako entitaterik, neurtutako zabalerarik, pilatze-ordenarik ezta erlazioen aingura-punturik ere. Jarraitu `value` gordetzen, eta irakurri horiek `runtimeValue` propietatetik; entitateen denbora-zigiluak (`meta`) erabat desagertu dira. Hasieratu martxan dagoen saio batean sartzen den lankide bat edo erreplika bat martxan dagoen pareko baten `runtimeValue` propietatetik, ez `value` propietatetik edo fitxategitik, eta ez gorde inoiz `runtimeValue`. Ikus [value](./erd-editor-element.md#value) eta [runtimeValue](./erd-editor-element.md#runtimevalue).
- Ezarpen-blokeoek `Save Scroll Information` eta `Save Zoom Information` ezarpenak ordezten dituzte. Dokumentu berri batek, eta `4.0.0` bertsioa baino lehen gordetako edozein dokumentuk, blokeo guztiak aktibatuta ditu; beraz, korritze batek, zoom batek, fitxa-aldaketa batek edo Kode-sortzailearen lengoaiaren, izenen idazkera baten edo mugatzaile motaren aldaketa batek `value` lehen zegoen bezala uzten du, eta ez du `change` gertaerarik igortzen. Ikuspegia `change` bidez gordetzen zuen orri batek `Viewport` (eta fitxarako `Canvas Type`) desblokeatuta behar ditu Ezarpenak fitxan, edo `settings.lockSettings` propietateak bit horiek garbi uzten dituen dokumentu bat. Ikus [Blokeoa](../guide/guides/settings.md#lock).
- `settings` objektuak ez du jada `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` edo `ignoreSaveSettings` propietaterik, eta `SaveSettingType` konstanteak desagertu dira. `settings.lockSettings` propietateak, `LockSettingType` bitekin, `ignoreSaveSettings` propietatearen lekua hartzen du, eta `4.0.0` edo berriagoak ez du hura ez irakurtzen ez idazten. Ikus [Settings](./advanced/schema.md#settings).
- Fitxategi bakoitzak `$schema` eremuan izendatzen duen [JSON Schema](./advanced/schema.md#json-schema) eskemak biltegiratze-forma soilik deskribatzen du orain, eta itxia da: lehenagoko bertsio batek gordetako fitxategi bat ukatzen du, `4.0.0` edo berriagoak egindako gordetze batek berridazten duen arte.
- Dokumentuaren zabor-bilketa bere workerrarekin batera desagertu da; beraz, kendutako entitate bat `runtimeValue` propietatean geratzen da, dokumentua bere fitxategitik hurrengoz ireki arte. Hiru worker partekatu geratzen dira. Ikus [Web Workers](#web-workers).
- Mantendu saio partekatu bateko editore eta erreplika guztiak `4.0.0` bertsioan edo berriagoan. Lehenagoko bertsio batek ez ditu kontuan hartzen ekintza mota berriak: taula-taldeenak, Mapatu zutabeak elkarrizketa-koadroarenak, blokeoenak eta SQL eskemaren scriptenak. Ikus [Bertsioak nahastea](./advanced/collaborative-editing.md#mixing-releases).
- Inportazioko callback funtzioak `mode: 'append'` jasotzen du Inportatu eta gehitu ekintzarako, eta callback funtzio batek aurrera pasatu behar du. Esportazioko callback funtzioak `.svg` fitxategiak eta Kode-sortzailearen fitxategiak ere jasotzen ditu orain, eta `Export` ▸ `Schema SQL` aukerak SQL eskema fitxa irekitzen du gorde beharrean; beraz, `.sql` fitxategia fitxa horretako `Save file` aukeratik bakarrik iristen da. Ikus [Fitxategi-elkarrizketak](#file-dialogs).
- `Delete` eta `Backspace` teklak `removeSelection` komando berriari lotuta daude. Editoreak testu-eremu batetik kanpo fokua duen bitartean, teklaren portaera lehenetsia eragotzi egiten da fitxa guztietan, eta ERD fitxan hautapena kentzen da. `KeyBindingName` eta `KeyBindingMap` motek barne hartzen dute orain, eta `setKeyBindingMap({ removeSelection: [] })` deiak bi teklak orriaren esku uzten ditu. Ikus [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- `ThemeOptions.appearance` propietateak `'system'` balioa ere hartzen du, gai-sortzaileko `System` aukera, `systemDarkMode` aktibatzeak ezartzen duena. `changePresetTheme` gertaerak `'system'` jakinarazten du hura hautatuta dagoen bitartean; beraz, gorde dagoen bezala eta itzuli `setPresetTheme` metodoari. `systemDarkMode` aktibatuta dagoela, `'light'` edo `'dark'` balioarekin egindako `setPresetTheme()` dei bat bere horretan geratzen da orain, sistema eragilearen hurrengo aldaketak hura gainidatzi beharrean. Ikus [systemDarkMode](./erd-editor-element.md#systemdarkmode) eta [changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` paketearen `1.0.0` edo berriagoak, VS Code luzapenaren `4.0.0` edo berriagoak eta Obsidian eta JetBrains pluginen `1.0.0` edo berriagoak agente-gunearen protokoloaren 2. bertsioa erabiltzen dute. `1.0.0` edo berriagoko zerbitzariak eta agenteei zerbitzua ematen dien lehenagoko editore-bertsio batek, edo lehenagoko zerbitzari batek eta editore hauetako batek, elkar ukatzen dute `protocolMismatch` errorearekin, eguneratu beharreko aldea adieraziz. Ikus [Eguneratzea](../mcp/installation.md#updating).
- Bertsiorik gabeko CDN URL batek azken bertsioa zerbitzatzen du, `5.0.0` bertsiotik aurrera 5.x. Finkatu `@3.10.0` 3.x bertsioan geratzeko. Ikus [CDN](#cdn).
