---
sidebar_position: 18
description: "Erakutsi diagrama bat irakurtzeko soilik beste gune batean koderik gabe erd-editor.io/embed txertatuz, eraiki haren URLa eta iframe lerroa sortzailean, ezarri gaia, hizkuntza, Izenen ikuspegia, minimapa, kontrolak eta koloreak URLan, eta zerbitzatu fitxategia GitHub-etik edo CORS onartzen duen zerbitzari batetik."
---

# Txertatzea

[erd-editor.io/embed](https://erd-editor.io/embed) helbideak diagrama bat irakurtzeko soilik erakusten du orria betetzen duen ikustaile batean, beste gune batek txertatzeko: wiki bat, blog bat, gune-sortzaile bat, edo bere scriptik kargatu ezin duen edozein orri.  
Haren `src` parametroak dokumentua izendatzen du, ERD Editor-ek gordetzen duen bezalako fitxategi baten helbidea, hala nola `.erd.json` fitxategi bat. URLaren gainerakoak ikustaileak nola erakusten duen ezartzen du, eta helbide berean dagoen sortzaileak URLa eta haren iframe lerroa idazten ditu zuretzat.

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Marko honek erd-editor biltegiko [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json) erakusten du, eta lerro hau da orri batean jartzen duena:

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## Markoak zer erakusten duen {#what-the-frame-shows}

Markoak diagramaren taulak, zutabeak, erlazioak, oharrak eta taula-taldeak erakusten ditu, eta bertan ezerk ez du diagrama edo fitxategia editatzen.  
Diagrama markora doitzen da kargatzen den heinean, fitxategiak zein zoom eta korritze-kokapen gorde zuen axola gabe; beraz, markoaren tamainak erabakitzen du zein zoomean irekitzen den.

Oihalaren gainean hauek daude:

- Minimapa, diagramak edukia duen bitartean.
- Beheko kontrol-barra: `Zoom out`, zoom maila, zeinak klik egitean zooma berrezartzen duen, `Zoom in`, `Fit`, `Name View` zerrenda, eta `Go to content` diagramaren ezer pantailan ez dagoen bitartean.
- Beheko eskuineko `erd-editor.io` esteka, zeinak erd-editor.io fitxa berri batean irekitzen duen eta erreferentziarik bidaltzen ez duen; beraz, klikak ez dio guneari markoak erakusten duen dokumentuaren berri ematen. Marko estu batean kontrol-barraren zati bat estal dezake.

Fitxategia kargatzen ari den bitartean, markoak `Loading diagram` erakusten du. Eskuratu ezin bada edo dokumenturik ez badu, markoak diagrama huts bat erakusten du `Couldn't load the diagram` mezuarekin. Ikus [GitHub-eko fitxategiak](#files-on-github) eta [Beste zerbitzari batzuetako fitxategiak](#files-on-other-servers).

Markoak bere URLari eta bisitariaren sistemari bakarrik jarraitzen die. Bisitariaren erd-editor.io guneko hizkuntza eta gai propioak ez dira hemen aplikatzen.

## Sortzailea {#the-builder}

Ireki [erd-editor.io/embed](https://erd-editor.io/embed) `src` gabe sortzailea lortzeko, `Embed a diagram` izenburuko orria:

1. Itsatsi dokumentuaren helbidea `Document URL` eremuan. `Enter` sakatzean edo eremutik ateratzean aplikatzen da; beraz, idazteak ez du ezer eskuratzen. Aplikatu ondoren, eremuaren azpiko `Loads from` lerroak ikustaileak eskuratzen duen helbidea izendatzen du: zuk emandakoa, edo GitHub-eko orri baterako, GitHub-en raw ostalariko helbidea. Ikus [GitHub-eko fitxategiak](#files-on-github).
2. Aukeratu aukerak. Bakoitza berehala aplikatzen da aurrebistan, URLan eta iframe lerroan:
   - `Theme`: `System`, `Light` edo `Dark`.
   - `Display Language`: `System`, nabigatzailean ordezkatzen duen hizkuntza ondoan duela, eta ondoren 25 hizkuntzak, bakoitza bere izenean.
   - `Name View`: `As Saved`, `Physical Names`, `Logical Names` edo `Both Names`. `As Saved` aukerak fitxategiak gorde zuen Izenen ikuspegia erakusten du.
   - `Accent color` eta `Gray color`, bakoitza izenez zerrendatuta eta lagin batekin.
   - `Minimap` eta `Controls`, bi etengailu, biak aktibatuta.
   - `Height`, pixeletan, `480` hasteko. Zenbaki oso positiboa ez den altuera bat `480` gisa hartzen da.
3. Egiaztatu `Preview`: ikustailea markoak erakutsiko duen bezala, `erd-editor.io` estekarekin, `Height` bezain altua den kutxa batean. Bere `System` hizkuntza zure nabigatzailearena da, erd-editor.io berak zein hizkuntza erakusten duen axola gabe.
4. Kopiatu emaitza. `Embed URL` markoaren helbidea da, eta `Embed code` iframe lerroa, ezarritako altuerarekin eta `100%` zabalerarekin. Bakoitzak `Copy` botoi bat du, dokumentu-URL bat aplikatu arte desgaituta dagoena, eta kopia baten ondoren une batez `Copied` dioena, aldaketa batek kopiatutakoa berridatzi arte.

`Document URL` garbitzeak aurrebista eta bi emaitzak hustu egiten ditu aplikatzen denean.

## URL parametroak {#url-parameters}

| Parametroa | Balioak | Lehenespena |
| --- | --- | --- |
| `src` | Dokumentuaren helbidea, URL kodetuta. | Bat ere ez: hura gabe, edo huts batekin, orria sortzailea da. |
| `theme` | `light`, `dark` edo `system`. | `system`: bisitariaren nabigatzaileak jakinarazten duen modu argia edo iluna. |
| `locale` | `system`, edo [hizkuntzen taulako](./language-and-theme.md#display-language) kode bat, hala nola `de-DE`. | `system`: bisitariaren nabigatzaileko hizkuntzak, [Sistemak](./language-and-theme.md#what-system-follows) bat egiten dituen bezala, eta ingelesa ikustaileak bat ere ez duenean. |
| `name-view` | `physical`, `logical` edo `both`. | Fitxategiak gorde zuen Izenen ikuspegia. |
| `minimap` | `false` aukerak minimapa ezkutatzen du. | Erakusten da. |
| `controls` | `false` aukerak kontrol-barra ezkutatzen du. | Erakusten da. |
| `accent-color` | [Gai-sortzailearen](./language-and-theme.md#theme) 26 azentu-koloreetako bat, hala nola `jade`. | `indigo` |
| `gray-color` | `gray`, `mauve`, `slate`, `sage`, `olive` edo `sand`. | `slate` |

Lehenespenak ikustailearenak dira, ez web aplikazioarenak, zeina `jade` eta `olive` balioekin hasten den.

- Sortzaileak aukera bakoitza bere lehenespenean uzten du URLtik kanpo; beraz, embed URL batek desberdina dena bakarrik dauka.
- Ikustaileak hartzen ez duen balio bat ez da kontuan hartzen, eta bere aukerak lehenespena mantentzen du. Balioak zerrendatzen diren bezala bat etortzen dira zehazki; beraz, `theme=Dark` ez da kontuan hartzen, eta `minimap` eta `controls` erakusten jarraitzen dute `false` ez den edozein baliorekin.
- Birritan emandako parametro batek lehen balioa hartzen du.
- `src` URL kodetuta dago, sortzaileak idazten duen bezala, bere `&` edo `#` duen helbide bat bestela moztuta geratzen baita.

## GitHub-eko fitxategiak {#files-on-github}

GitHub-eko fitxategi bat edo gist bat bere orriak erakusten duen helbidearekin eman daiteke, goiko markoan bezala. Ikustaileak GitHub-en raw ostalaritik eskuratzen du horren ordez, zeinak beste gune baten eskaerari erantzuten dion orriaren helbide propioak ez bezala:

- Fitxategi baten orriak, `https://github.com/<owner>/<repo>/blob/<ref>/<path>`, edo haren `raw` helbideak, `https://github.com/<owner>/<repo>/raw/<ref>/<path>`, `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>` helbidetik kargatzen dira. `<ref>` adar bat, etiketa bat edo commit bat da: adar batek fitxategia adar horrek duen bezala erakusten du, eta etiketa edo commit batek bertsio hori mantentzen du.
- Gist baten orriak, `https://gist.github.com/<user>/<id>`, `https://gist.githubusercontent.com/<user>/<id>/raw` helbidetik kargatzen dira, hau da, gist-aren lehen fitxategia. Mantendu diagrama gist-aren fitxategi bakar gisa.

Embed URLak zuk emandako helbidea mantentzen du, eta sortzailearen `Loads from` lerroak eskuratutakoa erakusten du.  
Biltegi publikoetarako eta gist publikoetarako bakarrik balio du. Raw ostalariak fitxategi bakoitza bost minutuz gordetzen du cachean; beraz, bidaltzen duzun aldaketa batek denbora hori behar dezake markoan agertzeko.

## Beste zerbitzari batzuetako fitxategiak {#files-on-other-servers}

erd-editor.io helbideko ikustaileak fitxategia `GET` arrunt batekin eskuratzen du bisitariaren nabigatzailetik, beraz haren zerbitzariak jatorri arteko eskaera hori onartu behar du (CORS): bere erantzunak `https://erd-editor.io` onartzen duen `Access-Control-Allow-Origin` goiburu bat behar du, hala nola `*`.  
Eskaerak ez darama cookierik; beraz, fitxategia saioa hasi gabe irakurgarria izan behar du.  
Goiburu hori gabe, edo errore batekin edo ERD Editor dokumentu ez den zerbaitekin erantzuten duen helbide batentzat, markoak `Couldn't load the diagram` erakusten du.

## Markoaren barruan {#in-the-frame}

Markoak ez du gurpilik, keinurik edo teklarik hartzen bisitari batek klik edo ukitu egin arte edo `Tab` teklarekin iritsi arte. Ordura arte, gurpilak, hatz-pasatzeak eta ukipen-pantailako pinch keinuak ohi bezala korritzen edo zoomarekin handitzen dute haren inguruko orria.  
Fokua duenean, gurpilak diagrama mugitzen du, `Ctrl + Wheel` (Windows/Linux) edo `⌘ + Wheel` (Mac) eta pinch batek zooma egiten dute, eta `Ctrl + K` (Windows/Linux) edo `⌘ + K` (Mac) teklek dokumentuaren gaineko bilaketa irekitzen dute, non `#` taula bat aurkitzen duen, `@` zutabe bat, eta `:` iruzkin edo ohar bat.  
Arrastatze batek diagrama mugitzen du markoak fokua duen ala ez, eta klik edo ukitu batek erlazioak pizten ditu: klik egindako taularenak, edo klik egindako erlazio bakarrarenak. Erakuslea gainean geldi dagoen taulak berea pizten du. Tekla guztiak ikusteko, ikus [Fokua eta teklak](../../api/erd-viewer-element.md#focus-and-keys).

Diagrama handiago batean probatzeko, zooma eta bilaketa eginez, ireki [bookstore adibidea](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json), bederatzi taula eta bi taula-talde, bere orrian.

## Analitika {#analytics}

erd-editor.io guneak markoaren bisitak Google Analytics bidez zenbatzen ditu, web aplikazioaren bisitak zenbatzen dituen bezala. Markoarentzat erregistratzen duen helbidea `erd-editor.io/embed` besterik ez da, `src` parametroak izendatzen duen dokumentu-helbiderik gabe.  
Ikus [Pribatutasun-politika](https://erd-editor.io/privacy).

## Ikustailea zuk kargatzea {#loading-the-viewer-yourself}

Scriptak kargatu ditzakeen orri batek diagrama bat erakutsi dezake `@dineug/erd-editor` paketeko [`<erd-viewer>`](../../api/erd-viewer-element.md) elementuarekin horren ordez. Aukera berberak hartzen ditu atributu eta metodo gisa, ez du eskaerarik egiten erd-editor.io helbidera, eta orriaren gune propiotik dokumentu bat karga dezake, eta horrek ez du CORS behar.
