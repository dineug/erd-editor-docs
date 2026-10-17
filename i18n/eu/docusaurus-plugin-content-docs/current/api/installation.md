---
sidebar_position: 1
description: Instalatu @dineug/erd-editor npm bidez edo CDN batetik, muntatu elementu pertsonalizatua, konektatu fitxategi-elkarrizketak eta eguneratu 3.x bertsiotik.
---

# Instalazioa

```sh
npm install @dineug/erd-editor
```

Paketea ESM soilik da (`"type": "module"`), eta `dist` karpeta bakarrik banatzen du.
Ez dago CommonJS konpilaziorik; beraz, `require('@dineug/erd-editor')` deiak ez du funtzionatzen.

Paketearen exekuzio-garaiko mendekotasunak kanpoan geratzen dira, inportazio soil moduan; zure paketatzaileak ebatzi, bikoiztuak bateratu eta tree-shaking bidez kimatzen ditu.
Paketearen worker partekatuak `dist/workers/` karpetaren azpian sarrera-fitxategi bereizi gisa sortzen dira, eta `new URL('./…', import.meta.url)` adierazpenarekin eraikitzen dira: Vite, webpack 5 eta Rspack paketatzaileek worker-sarrera gisa paketatzen duten idazmoldea. Ikus [Web Workers](#web-workers).
Atzean paketatzailerik ez duen orri baterako, bigarren konpilazio autonomo bat dago. Ikus [Script etiketa](#script-tag).

## Erabilera {#usage}

```js
import '@dineug/erd-editor';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`<erd-editor>` elementuak ez du berezko tamainarik. Eman elementuari (edo haren edukiontziari) zabalera eta altuera esplizituak.
`4.1.0` bertsiotik aurrera, [Arakatzailea](../guide/guides/explorer.md) irekita dagoenean elementuaren barruan kokatzen da, ERD oihalaren ezkerrean, eta oihala estutzen du, estali beharrean. Editore berri bat Arakatzailea itxita duela hasten da.
Panela ez da `200px` zabalera baino estuagoa marrazten, eta oihalari gutxienez `320px` zabalera uzten dio; beraz, `520px` baino estuagoa den elementu batean, Arakatzaile irekia ez da marrazten elementua zabaldu arte. Ikus [Oihalaren ondoan](../guide/guides/explorer.md#beside-the-canvas).

`setInitialValue('')` deiak dokumentu berri eta huts bat hasten du. `value` propietatea esleitzeak, aldiz, dokumentua edizio gisa kargatzen du; beraz, desegite-historian geratzen da.
`4.0.0` bertsiotik aurrera, `editor.value` propietatea fitxategi batek gordetzen duen forman dagoen dokumentua da, eta hori da gorde behar dena. `editor.runtimeValue` propietatea editoreak duen moduko dokumentua da, kendutako entitateak barne: lankide bat hasieratzeko erabiltzen da, eta ez da inoiz fitxategi batera joaten. Ikus [runtimeValue](./erd-editor-element.md#runtimevalue).
`4.0.0` bertsiotik aurrera, dokumentu berri batek [ezarpen-blokeo](../guide/guides/settings.md#lock) guztiak ere aktibatuta ditu: ikuspen-eremua, fitxa, Kode-sortzailearen lengoaia, izenen bi idazkerak eta mugatzaile mota. Korritzeak, zooma aldatzeak, fitxaz aldatzeak edo ezarpen horietako bat aldatzeak `editor.value` lehen zegoen bezala uzten du, eta ez du `change` gertaerarik igortzen. Testutik kargatutako dokumentu batek bertan izendatutako blokeoak mantentzen ditu. Blokeorik izendatzen ez duena, `4.0.0` bertsioa baino lehen gordetako edozein fitxategi bezala, blokeo guztiak aktibatuta irekitzen da, % 100eko zoomean eta ERD fitxan, gordetako ikuspegia eta fitxa edozein direla ere. Haren ikuspegia `0, 0` jatorrian blokeatzen da, eta, han diagramaren zatirik marraztuta ez badago, diagraman irekitzen da horren ordez. Ikus [setInitialValue](./erd-editor-element.md#setinitialvalue).
APIaren gainerakorako, ikus [ErdEditorElement](./erd-editor-element.md).

### CDN {#cdn}

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor"></script>
```

`esm.run` zerbitzuak paketearen kanpoko mendekotasunak ebazten ditu zure ordez; beraz, honek paketatzailerik gabe funtzionatzen du.
Bertsiorik gabeko URLak beti azken bertsioa zerbitzatzen du. Finkatu bertsio bat — `https://esm.run/@dineug/erd-editor@4.1.0` — ez baduzu nahi eguneratze nagusi bat abisurik gabe zure orrira iristea.
`4.0.0` bertsioa bera da horietako bat: 3.x bertsioan geratu behar duen orri batek `@3.10.0` bertsioa finkatzen du. Ikus [3.x bertsiotik eguneratzea](#upgrading-from-3x).

### Script etiketa {#script-tag}

`3.6.0` bertsiotik aurrera, paketeak UMD konpilazio bat ere banatzen du, mendekotasun guztiak eta worker partekatu guztiak fitxategi bakar baten barruan dituena.
`unpkg` eta `jsdelivr` eremuek hura seinalatzen dute; beraz, bi CDN zerbitzuetako edozeinetan paketearen URL soilak hura zerbitzatzen du, eta konpilazio horrek `window.ErdEditor` definitzen du.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.1.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Hura inportatzeak `<erd-editor>` elementua modu berean erregistratzen du; `window.ErdEditor` objektuak fitxategien bi callback funtzioak ditu, `ErdEditor.setExportFileCallback` eta `ErdEditor.setImportFileCallback`, eta, `3.9.2` bertsiotik aurrera, `ErdEditor.createKeyBindingMap` funtzioa.
Paketearen exports mapak paketatzailea ES moduluetara bideratzen du oraindik; beraz, npm bidezko instalazio batek ez du inoiz fitxategi hau hartzen.

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

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
25 bistaratze-hizkuntza guztiak paketearen barruan banatzen dira, bai ES konpilazioan bai script etiketako konpilazioan; beraz, ez dago zerbitzatu beharreko hizkuntza-fitxategirik, ezta erregistratu beharreko ezer ere. Hautatzailerik eta `setLocale()` deirik gabe, editoreak ingelesa erakusten du.

Hemen `readonly` atributua gehitzeak edizioa galarazten du: `value` propietatea esleitzea, `clear()` metodoari deitzea eta `setSchema*()` dei guztiak, `setSchemaJSON()` eta gehitze-moduko deiak barne, baztertu egiten dira, eta `change` gertaera ez da inoiz igortzen. `editor.value` eta `editor.runtimeValue` irakurtzeak funtzionatzen du oraindik. Kargatzeko, erabili `setInitialValue()` horren ordez.

### Zerbitzari aldeko errendatzea {#server-side-rendering}

Paketea inportatzeak elementu pertsonalizatua modulu-esparruan erregistratzen du; beraz, DOM bat behar du, eta Node ingurunean errore bat jaurtitzen du.
Next.js, Nuxt, SvelteKit edo Astro esparruetan, inportatu paketea bezeroan soilik exekutatzen den bide batetik.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

Paketea inportatzeak `erd-editor` etiketa `HTMLElementTagNameMap` interfazean bateratzen du; beraz, elementuak mota zuzena du, mota-bihurketarik egin gabe.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` mota esportatzen da, zure aldagaiei eta propietateei mota esleitzeko.
`4.0.0` bertsiotik aurrera, paketeak `LocaleCode`, `LocaleOption` eta `SchemaSQLOptions` motak ere esportatzen ditu. Ikus [Sarrera-puntuak](#entry-points). `setSchema*()` metodoek hartzen dituzten aukerek ez dute izen esportaturik; atera elementutik, `Parameters<ErdEditorElement['setSchemaSQL']>[1]` bezala.

## Sintaxia nabarmentzea {#syntax-highlighting}

SQL eskemaren eta Kode-sortzailearen panelak [Shiki](https://shiki.style) liburutegiak nabarmentzen ditu, bere worker partekatu propioan, eta `4.0.0` bertsiotik aurrera baita SQL eskema fitxako `Before tables` eta `After tables` scriptak ere.
`3.7.0` bertsiotik aurrera, ez dago ezer instalatu edo erregistratu beharrik: workerra kode-panel bat lehen aldiz errendatzen denean eraikitzen da; beraz, bat ere irekitzen ez duen orri batek ez ditu inoiz gramatikak eskuratzen.

| | |
| --- | --- |
| Lengoaiak | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Gaiak | `github-dark` eta `github-light`, editorearen itxura argiari edo ilunari jarraituz |

Horiexek dira, hain zuzen, panelek sortzen dituzten lengoaiak: `JPA` Java gisa nabarmentzen da, `SQLAlchemy` Python gisa, `TypeORM`, `Sequelize`, `Drizzle` eta `Zod` TypeScript gisa, `Doctrine` PHP gisa, `SeaORM` Rust gisa, `JSON Schema` JSON gisa, eta `DBML` eta `AML` SQL gisa, multzoan dagoen gramatikarik hurbilena baita. Ikus [Kode-sortzailea](../guide/guides/code-generator.md).

Adierazpen erregularren motorra JavaScript hutsa da; beraz, ostalariaren ezein politikak ez du `wasm-unsafe-eval` behar.
`SharedWorker` falta den lekuetan — Android sistemako Chrome, 16.4 bertsioa baino lehenagoko Safari — hutsegitea erregistratzen da eta kodea testu arrunt gisa erakusten da; scriptak edita daitezke oraindik.

`3.6.0` edo lehenagoko bertsio batetik eguneratzean: `@dineug/erd-editor-shiki-worker` paketea ez da gehiago argitaratzen, eta `setGetShikiServiceCallback` funtzioa ere harekin batera desagertu da.
Kendu instalazioa eta erregistratzea; workerra CDN batetik kargatzen zuen orri batek bigarren `<script>` etiketa hori ere kentzen du.

## Web Workers {#web-workers}

Editoreak hiru lan exekutatzen ditu `SharedWorker` instantzietan: sintaxia nabarmentzea, irudi-esportazioa, eta [Antolaketa automatikoa](../guide/guides/table-related-functions.md#auto-layout), Bisualizazioa fitxako [Fluxu modua](../guide/guides/visualization.md#how-flow-is-placed) eta, `4.0.0` bertsiotik aurrera, inportatutako eskema baten kokapena ahalbidetzen dituen taulen antolaketa.
Hirurak `@dineug/erd-editor` paketearen barruan banatzen dira. Ez duzu horietako bat ere konfiguratu behar, baina ostalari batek horietako edozein blokea dezake.
Dokumentuaren zabor-bilketa exekutatzen zuen workerra `4.0.0` bertsioan kendu zen, zabor-bilketarekin berarekin batera.

| Workerra | Hura gabe |
| --- | --- |
| Sintaxia nabarmentzea | SQL eskemaren eta Kode-sortzailearen panelak eta SQL eskemaren scriptak testu arrunt gisa geratzen dira |
| Irudi-esportazioa | PNG irudia, SVG irudia, `Copy to clipboard` aukera eta `Export image` elkarrizketa-koadroaren aurrebista hari nagusian marrazten dira, eta horrek orria geldiarazten du marrazten den bitartean |
| Taulen antolaketa | Antolaketa automatikoaren `Flow`, `Tree - vertical` eta `Tree - horizontal` antolaketak, eta Bisualizazioa fitxako Fluxu modua, `Could not place tables` mezuarekin amaitzen dira; Fluxuak kokatutako inportazio batek — `Import` edo `Import and Add` aukeratik datorren SQL, GraphQL, DBML edo AML fitxategi bat, edo `placement: 'auto'` duen `setSchema*()` dei bat — bere taulak errenkadetan jartzen ditu, mezurik gabe; `Force` eta Grafo modua ez dira kaltetzen, editorearen barruan exekutatzen baitira |

Irudi-esportazioak hamar segundoz itxaroten du bere workerrak erantzun dezan, eta ondoren hari nagusian marrazten du; sintaxia nabarmentzeak, berriz, kodea testu arrunt gisa uzten du bere workerrak huts egin bezain laster; beraz, workerrak blokeatzen dituen ostalari batean errendimendua galtzen da, ez funtzionaltasuna.
Taulen antolaketa da salbuespena: antolaketa kalkulatzen duen motorra editorea bera baino astunagoa da, eta ez da inoiz prozesu barruan kargatzen; beraz, lehen kokapenean hogeita hamar segundoz itxaroten dio bere workerrari, eta workerrak erantzun ondoren, hirurogei segundo ematen dizkio antolaketa bati itzultzeko.
Bi itxaronaldietako bat agortzen bada, kokapena workerrik gabe bezala amaitzen da. Antolaketa automatikoak `Placing tables` erakusten du hasi bezain laster; Fluxu moduak eta Fluxuak kokatutako inportazio batek, aldiz, kokapen bat, bere workerraren abiaraztea barne, sei segundoz exekutatzen egon denean soilik erakusten dute.

Paketatutako konpilazioan, hirurak paketearen ondoan fitxategi gisa sortzen dira; beraz, CSP zorrotz batek `worker-src 'self'` behar du, eta, zure paketatzaileak worker bat lerroan txertatzen badu, baita `blob:` ere.
[Script etiketako](#script-tag) konpilazioan, hirurak fitxategiaren barruan doaz `data:` URL gisa; beraz, orri horrek `worker-src data:` behar du horren ordez.

## Sarrera-puntuak {#entry-points}

`@dineug/erd-editor` paketea inportatzeak `<erd-editor>` elementua erregistratzen du albo-ondorio gisa. Horretaz gain, elementuaren mota esportatzen du, callback funtzioak ezartzeko bi funtzio, `3.9.2` bertsiotik aurrera tekla-konbinazio lehenetsiak beren motekin, eta `4.0.0` bertsiotik aurrera bistaratze-hizkuntzaren motak eta `getSchemaSQL()` metodoaren aukeren mota.

| Esportazioa | Deskribapena |
| --- | --- |
| `ErdEditorElement` (mota) | Elementuaren interfazea. Ikus [ErdEditorElement](./erd-editor-element.md). |
| `setExportFileCallback(cb)` | Nabigatzailearen deskarga ordezten du, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Nabigatzailearen fitxategi-hautatzailea ordezten du, `({ type, op, accept, mode }) => void`; `mode` parametroa `4.0.0` bertsiotik aurrera. |
| `createKeyBindingMap()` | Tekla-konbinazio lehenetsiak itzultzen ditu `KeyBindingMap` berri gisa dei bakoitzean. Ikus [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (motak) | Tekla-konbinazioen mapa bat, haren komando-izenen bildura eta tekla-konbinazio bat. |
| `LocaleCode`, `LocaleOption` (motak) | `4.0.0` bertsiotik aurrera. 25 bistaratze-hizkuntzen kodeak, eta kode horiek gehi `'system'`, `setLocale()` metodoak hartzen duena. Ikus [Bistaratze-hizkuntza](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (mota) | `4.0.0` bertsiotik aurrera. `getSchemaSQL()` metodoak hartzen dituen `statements` eta `header` aukerak. Ikus [getSchemaSQL](./erd-editor-element.md#getschemasql). |

`@dineug/erd-editor/engine.js` bigarren sarrera-puntu bat da. Dokumentu-biltegia DOMik gabe exekutatzen du; beraz, Web Worker batean funtzionatzen du. Ikus [Urruneko biltegiratzea](./advanced/remote-storage.md).
`createReplicationStore` funtzioa eta `ReplicationStore` mota esportatzen ditu. `3.10.0` bertsiotik aurrera, `ReplicationChange` mota ere esportatzen du, `{ value: string; changed: boolean }`, erreplika baten `change` entzuleak jasotzen duena. Ikus [on@change](./advanced/remote-storage.md#onchange).
`4.0.0` bertsiotik aurrera, `ReplicationStore` batek `runtimeValue` propietatea ere badu. Haren `value` propietatea eta `change` gertaera batek ematen duena fitxategi batek gordetzen duen biltegiratze-forma dira, elementuarenak bezala. Ikus [ReplicationStore](./advanced/remote-storage.md#replicationstore).

`3.9.1` bertsiotik aurrera, hirugarren bat dago, `@dineug/erd-editor/peer.js`: [MCP zerbitzariak](../mcp/introduction.md) dokumentu bat editatzeko bitarteko gisa erabiltzen duen editorerik gabeko parekoa. Zerbitzari horrentzat dago, eta orri hauek ez dute dokumentatzen.

### Fitxategi-elkarrizketak {#file-dialogs}

Inportazioa eta esportazioa injekta daitezkeen callback funtzioen bidez egiten dira; beraz, nabigatzailearen fitxategi-elkarrizketarik ez duen ostalari batek, adibidez IDE baten webview batek, berea eman dezake.
Biak ez dira simetrikoak: esportazioak amaitutako fitxategia ematen dizu; inportazioak, berriz, fitxategi bat eskatu besterik ez du egiten, eta edukia zuk zeuk sartu behar duzu berriro.

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

Editoreak sortzen duen `fileName` balioa `<database name>-<timestamp>` gehi fitxategiaren luzapena da, eta denbora-zigilua tokiko ordua da, `yyyy-MM-dd'T'HH_mm_ss` formatuan. Datu-basearen izena hutsik badago, `unnamed` erabiltzen da haren ordez.
Esportazioko callback funtzioak fitxategi hauek jasotzen ditu. `4.0.0` bertsiotik aurrera, SVG irudia eta Kode-sortzailearen fitxategiak ere haien artean daude, eta `.sql` fitxategia SQL eskema fitxako `Save file` aukeratik dator, ez zuzenean `Export` menutik.

| Fitxategia | Luzapena | Blob `type` |
| --- | --- | --- |
| JSON esportazioa | `.erd.json` | `application/json` |
| SQL eskema fitxako `Save file` aukera, fitxak erakusten duen testuarekin. Ikus [SQL eskema](../guide/guides/schema-sql.md) | `.sql` | bat ere ez |
| [Export image](../guide/guides/file-import-export.md#image) elkarrizketa-koadroa | `.png` edo `.svg` | `image/png` edo `image/svg+xml` |
| Kode-sortzailea fitxako `Save file` aukera. Ikus [Kode-sortzailea](../guide/guides/code-generator.md) | Lengoaiarena: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` edo `.mmd` | bat ere ez |

Kudeatzailea luzapenaren arabera aukeratzen duen ostalari batek horietako bakoitzerako bat behar du.

Ezarri gabe utziz gero, editoreak nabigatzailearen beraren deskarga- eta fitxategi-hautatzaile-portaera erabiltzen du. Pasatu `null` portaera horretara itzultzeko.

## Nabigatzaileen euskarria {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+: argitaratutako paketeak eraikitzeko oinarri gisa hartzen den ES2022 maila.
Ez da polyfillik paketatzen. Gehitu zureak, nabigatzaile zaharragoetara iritsi behar baduzu.

## 3.x bertsiotik eguneratzea {#upgrading-from-3x}

`4.0.0` bertsio nagusi bat da. Egiaztatu hauetako bakoitza orri bat 3.x bertsiotik eramatean:

- `editor.value`, erreplika baten `value` eta haren `change` gertaerak ematen duen `value` fitxategi batek gordetzen duen biltegiratze-forma dira: ez dute kendutako entitaterik, neurtutako zabalerarik, pilatze-ordenarik ezta erlazioen aingura-punturik ere. Jarraitu `value` gordetzen, eta irakurri horiek `runtimeValue` propietatetik; entitateen denbora-zigiluak (`meta`) erabat desagertu dira. Hasieratu martxan dagoen saio batean sartzen den lankide bat edo erreplika bat martxan dagoen pareko baten `runtimeValue` propietatetik, ez `value` propietatetik edo fitxategitik, eta ez gorde inoiz `runtimeValue`. Ikus [value](./erd-editor-element.md#value) eta [runtimeValue](./erd-editor-element.md#runtimevalue).
- Ezarpen-blokeoek `Save Scroll Information` eta `Save Zoom Information` ezarpenak ordezten dituzte. Dokumentu berri batek, eta `4.0.0` bertsioa baino lehen gordetako edozein dokumentuk, blokeo guztiak aktibatuta ditu; beraz, korritze batek, zoom batek, fitxa-aldaketa batek edo Kode-sortzailearen lengoaiaren, izenen idazkera baten edo mugatzaile motaren aldaketa batek `value` lehen zegoen bezala uzten du, eta ez du `change` gertaerarik igortzen. Ikuspegia `change` bidez gordetzen zuen orri batek `Viewport` (eta fitxarako `Canvas Type`) desblokeatuta behar ditu Ezarpenak fitxan, edo `settings.lockSettings` propietateak bit horiek garbi uzten dituen dokumentu bat. Ikus [Blokeoa](../guide/guides/settings.md#lock).
- `settings` objektuak ez du jada `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` edo `ignoreSaveSettings` propietaterik, eta `SaveSettingType` konstanteak desagertu dira. `settings.lockSettings` propietateak, `LockSettingType` bitekin, `ignoreSaveSettings` propietatearen lekua hartzen du, eta `4.0.0` edo berriagoak ez du hura ez irakurtzen ez idazten. Ikus [Settings](./advanced/schema.md#settings).
- Fitxategi bakoitzak `$schema` eremuan izendatzen duen [JSON Schema](./advanced/schema.md#json-schema) eskemak biltegiratze-forma soilik deskribatzen du orain, eta itxia da: lehenagoko bertsio batek gordetako fitxategi bat ukatzen du, `4.0.0` edo berriagoak egindako gordetze batek berridazten duen arte.
- Dokumentuaren zabor-bilketa bere workerrarekin batera desagertu da; beraz, kendutako entitate bat `runtimeValue` propietatean geratzen da, dokumentua bere fitxategitik hurrengoz ireki arte. Hiru worker partekatu geratzen dira. Ikus [Web Workers](#web-workers).
- Mantendu saio partekatu bateko editore eta erreplika guztiak `4.0.0` bertsioan edo berriagoan. Lehenagoko bertsio batek ez ditu kontuan hartzen ekintza mota berriak: taula-taldeenak, Mapatu zutabeak elkarrizketa-koadroarenak, blokeoenak eta SQL eskemaren scriptenak. Ikus [Bertsioak nahastea](./advanced/collaborative-editing.md#mixing-releases).
- Inportazioko callback funtzioak `mode: 'append'` jasotzen du Inportatu eta gehitu ekintzarako, eta callback funtzio batek aurrera pasatu behar du. Esportazioko callback funtzioak `.svg` fitxategiak eta Kode-sortzailearen fitxategiak ere jasotzen ditu orain, eta `Export` ▸ `Schema SQL` aukerak SQL eskema fitxa irekitzen du gorde beharrean; beraz, `.sql` fitxategia fitxa horretako `Save file` aukeratik bakarrik iristen da. Ikus [Fitxategi-elkarrizketak](#file-dialogs).
- `Delete` eta `Backspace` teklak `removeSelection` komando berriari lotuta daude. Editoreak testu-eremu batetik kanpo fokua duen bitartean, teklaren portaera lehenetsia eragotzi egiten da fitxa guztietan, eta ERD fitxan hautapena kentzen da. `KeyBindingName` eta `KeyBindingMap` motek barne hartzen dute orain, eta `setKeyBindingMap({ removeSelection: [] })` deiak bi teklak orriaren esku uzten ditu. Ikus [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- `ThemeOptions.appearance` propietateak `'system'` balioa ere hartzen du, gai-sortzaileko `System` aukera, `systemDarkMode` aktibatzeak ezartzen duena. `changePresetTheme` gertaerak `'system'` jakinarazten du hura hautatuta dagoen bitartean; beraz, gorde dagoen bezala eta itzuli `setPresetTheme` metodoari. `systemDarkMode` aktibatuta dagoela, `'light'` edo `'dark'` balioarekin egindako `setPresetTheme()` dei bat bere horretan geratzen da orain, sistema eragilearen hurrengo aldaketak hura gainidatzi beharrean. Ikus [systemDarkMode](./erd-editor-element.md#systemdarkmode) eta [changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` paketearen `1.0.0` bertsioak, VS Code luzapenaren `4.0.0` edo berriagoak eta Obsidian eta JetBrains pluginen `1.0.0` edo berriagoak agente-gunearen protokoloaren 2. bertsioa erabiltzen dute. `1.0.0` bertsioko zerbitzariak eta agenteei zerbitzua ematen dien lehenagoko editore-bertsio batek, edo lehenagoko zerbitzari batek eta editore hauetako batek, elkar ukatzen dute `protocolMismatch` errorearekin, eguneratu beharreko aldea adieraziz. Ikus [Eguneratzea](../mcp/installation.md#updating).
- Bertsiorik gabeko CDN URL batek azken 4.x bertsioa zerbitzatzen du orain. Finkatu `@3.10.0` 3.x bertsioan geratzeko. Ikus [CDN](#cdn).
