---
sidebar_position: 18
description: Visa ett diagram skrivskyddat på en annan webbplats utan kod genom att rama in erd-editor.io/embed, bygg dess URL och iframe-rad i byggaren, ställ in tema, språk, namnvisning, minikarta, kontroller och färger i URL:en, och leverera filen från GitHub eller en server som tillåter CORS.
---

# Bädda in

[erd-editor.io/embed](https://erd-editor.io/embed) visar ett diagram skrivskyddat i en visare som fyller sidan, för en annan webbplats att rama in: en wiki, en blogg, en webbplatsbyggare eller vilken sida som helst som inte kan läsa in egna skript.  
Dess parameter `src` anger dokumentet, adressen till en fil så som ERD Editor sparar den, till exempel en `.erd.json`-fil. Resten av URL:en anger hur visaren visar den, och byggaren på samma adress skriver URL:en och dess iframe-rad åt dig.

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Den här ramen visar [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json) från erd-editor-repositoriet, och det här är raden som lägger in den på en sida:

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## Vad ramen visar {#what-the-frame-shows}

Ramen visar diagrammets tabeller, kolumner, relationer, anteckningar och tabellgrupper, och ingenting i den redigerar diagrammet eller filen.  
Diagrammet anpassas till ramen när det läses in, oavsett vilken zoom och rullningsposition filen sparade, så ramens storlek avgör vilken zoom den öppnas vid.

Över arbetsytan finns:

- Minikartan, medan diagrammet har innehåll.
- Kontrollraden längst ned: `Zoom out`, zoomnivån, som återställer zoomen när man klickar på den, `Zoom in`, `Fit`, listan `Name View` och `Go to content` medan ingen del av diagrammet finns på skärmen.
- Länken `erd-editor.io` längst ned till höger, som öppnar erd-editor.io i en ny flik och inte skickar någon referrer, så klicket berättar ingenting för webbplatsen om dokumentet som ramen visar. I en smal ram kan den täcka en del av kontrollraden.

Medan filen läses in visar ramen `Loading diagram`. Om den inte kan hämtas eller inte innehåller något dokument visar ramen ett tomt diagram med `Couldn't load the diagram` – se [Filer på GitHub](#files-on-github) och [Filer på andra servrar](#files-on-other-servers).

Ramen följer bara sin URL och besökarens system. En besökares eget språk och tema på erd-editor.io gäller inte i den.

## Byggaren {#the-builder}

Öppna [erd-editor.io/embed](https://erd-editor.io/embed) utan `src` för att få byggaren, en sida med rubriken `Embed a diagram`:

1. Klistra in dokumentets adress i `Document URL`. Den tillämpas när du trycker på `Enter` eller lämnar fältet, så att skriva hämtar ingenting. När den har tillämpats anger en rad `Loads from` under fältet adressen som visaren hämtar: den du angav eller, för en sida på GitHub, dess adress på GitHubs raw-värd – se [Filer på GitHub](#files-on-github).
2. Välj alternativen. Var och ett tillämpas direkt på förhandsgranskningen, URL:en och iframe-raden:
   - `Theme`: `System`, `Light` eller `Dark`.
   - `Display Language`: `System`, med det språk som det står för i din webbläsare bredvid, sedan de 25 språken, vart och ett med sitt eget namn.
   - `Name View`: `As Saved`, `Physical Names`, `Logical Names` eller `Both Names`. `As Saved` visar den namnvisning som filen sparade.
   - `Accent color` och `Gray color`, var och en listad med namn och ett färgprov.
   - `Minimap` och `Controls`, två reglage, båda på.
   - `Height`, i pixlar, från början `480`. En höjd som inte är ett positivt heltal räknas som `480`.
3. Kontrollera `Preview`: visaren så som ramen kommer att visa den, med länken `erd-editor.io`, i en ruta lika hög som `Height`. Dess språk `System` är din webbläsares, oavsett vilket språk erd-editor.io själv visar.
4. Kopiera resultatet. `Embed URL` är ramens adress och `Embed code` iframe-raden, med den höjd du angav och bredden `100%`. Var och en har en knapp `Copy`, som förblir inaktiverad tills en dokument-URL har tillämpats, och som lyder `Copied` en stund efter en kopiering, tills en ändring skriver om det som den kopierade.

Att tömma `Document URL` tömmer förhandsgranskningen och de två resultaten när det tillämpas.

## URL-parametrar {#url-parameters}

| Parameter | Värden | Standardvärde |
| --- | --- | --- |
| `src` | Dokumentets adress, URL-kodad. | Inget: utan den, eller med en tom, är sidan byggaren. |
| `theme` | `light`, `dark` eller `system`. | `system`: det ljusa eller mörka läge som besökarens webbläsare rapporterar. |
| `locale` | `system`, eller en kod från [språktabellen](./language-and-theme.md#display-language), som `de-DE`. | `system`: besökarens webbläsarspråk, matchade så som [System](./language-and-theme.md#what-system-follows) matchar dem, och engelska när visaren inte har något av dem. |
| `name-view` | `physical`, `logical` eller `both`. | Den namnvisning som filen sparade. |
| `minimap` | `false` döljer minikartan. | Visas. |
| `controls` | `false` döljer kontrollraden. | Visas. |
| `accent-color` | En av de 26 accentfärgerna i [temaverktyget](./language-and-theme.md#theme), som `jade`. | `indigo` |
| `gray-color` | `gray`, `mauve`, `slate`, `sage`, `olive` eller `sand`. | `slate` |

Standardvärdena är visarens egna, inte webbappens, som startar på `jade` och `olive`.

- Byggaren lämnar varje alternativ som har sitt standardvärde utanför URL:en, så en inbäddnings-URL innehåller bara det som skiljer sig.
- Ett värde som visaren inte tar emot ignoreras, och dess alternativ behåller standardvärdet. Värden matchas exakt så som de listas, så `theme=Dark` ignoreras, och `minimap` och `controls` förblir visade för vilket värde som helst utom `false`.
- En parameter som anges två gånger tar sitt första värde.
- `src` är URL-kodad, så som byggaren skriver den, eftersom en adress som själv innehåller ett `&` eller ett `#` annars kapas.

## Filer på GitHub {#files-on-github}

En fil eller en gist på GitHub kan anges med den adress som dess sida visar, som ramen ovan. Visaren hämtar den då från GitHubs raw-värd i stället, som svarar på en annan webbplats begäran där sidans egen adress inte gör det:

- En fils sida, `https://github.com/<owner>/<repo>/blob/<ref>/<path>`, eller dess `raw`-adress, `https://github.com/<owner>/<repo>/raw/<ref>/<path>`, läses in från `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>`. `<ref>` är en gren, en tagg eller en commit: en gren visar filen så som den grenen har den, och en tagg eller en commit behåller den versionen.
- En gists sida, `https://gist.github.com/<user>/<id>`, läses in från `https://gist.githubusercontent.com/<user>/<id>/raw`, som är gistens första fil. Behåll diagrammet som gistens enda fil.

Inbäddnings-URL:en behåller adressen du angav, och byggarens rad `Loads from` visar den som hämtades.  
Det här fungerar bara för offentliga repositorier och offentliga gists. Raw-värden cachar varje fil i fem minuter, så en ändring som du pushar kan ta så lång tid på sig att synas i ramen.

## Filer på andra servrar {#files-on-other-servers}

Visaren på erd-editor.io hämtar filen med en vanlig `GET` från besökarens webbläsare, så servern som håller den måste tillåta den begäran mellan origins (CORS): dess svar behöver en rubrik `Access-Control-Allow-Origin` som tillåter `https://erd-editor.io`, till exempel `*`.  
Begäran innehåller inga cookies, så filen måste gå att läsa utan inloggning.  
Utan den rubriken, eller för en adress som svarar med ett fel eller med något annat än ett ERD Editor-dokument, visar ramen `Couldn't load the diagram`.

## I ramen {#in-the-frame}

Ramen tar inget mushjul, ingen gest och ingen tangent förrän en besökare klickar eller trycker på den eller når den med `Tab`. Tills dess rullar eller zoomar mushjulet, en svepning och en nypning sidan runt den som vanligt.  
När den har fokus panorerar mushjulet diagrammet, `Ctrl + Wheel` (Windows/Linux) eller `⌘ + Wheel` (Mac) och en nypning zoomar det, och `Ctrl + K` (Windows/Linux) eller `⌘ + K` (Mac) öppnar en sökning i dokumentet, där `#` hittar en tabell, `@` en kolumn och `:` en kommentar eller anteckning.  
Ett drag panorerar diagrammet oavsett om ramen har fokus eller inte, och ett klick eller ett tryck lyser upp relationer: den klickade tabellens eller den enda klickade relationens. Tabellen som pekaren vilar på lyser upp sina egna. Se [Fokus och tangenter](../../api/erd-viewer-element.md#focus-and-keys) för varje tangent.

För att prova det på ett större diagram, med zoomning och sökning, öppna [bokhandelsexemplet](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json), nio tabeller och två tabellgrupper, på en sida för sig.

## Analys {#analytics}

erd-editor.io räknar besök i ramen med Google Analytics, som den räknar besök i webbappen. Adressen som den registrerar för en ram är bara `erd-editor.io/embed`, utan den dokumentadress som `src` anger.  
Se [Integritetspolicy](https://erd-editor.io/privacy).

## Läs in visaren själv {#loading-the-viewer-yourself}

En sida som kan läsa in skript kan visa ett diagram med elementet [`<erd-viewer>`](../../api/erd-viewer-element.md) från paketet `@dineug/erd-editor` i stället. Det tar emot samma alternativ som attribut och metoder, gör ingen begäran till erd-editor.io och kan läsa in ett dokument från sidans egen webbplats, vilket inte behöver någon CORS.
