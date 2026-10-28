---
sidebar_position: 18
description: Toon een diagram in alleen-lezenmodus op een andere site zonder code door erd-editor.io/embed in een frame te tonen, bouw de URL en de iframe-regel in de builder, stel het thema, de taal, de naamweergave, de minimap, de besturingsbalk en de kleuren in de URL in, en serveer het bestand vanaf GitHub of een server die CORS toestaat.
---

# Insluiten

[erd-editor.io/embed](https://erd-editor.io/embed) toont een diagram in alleen-lezenmodus in een viewer die de pagina vult, om door een andere site in een frame te worden getoond: een wiki, een blog, een sitebouwer of elke pagina die geen eigen scripts kan laden.  
De parameter `src` noemt het document, het adres van een bestand zoals ERD Editor het opslaat, zoals een `.erd.json`-bestand. De rest van de URL bepaalt hoe de viewer het toont, en de builder op hetzelfde adres schrijft de URL en de iframe-regel ervan voor je.

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Dit frame toont [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json) uit de erd-editor-repository, en dit is de regel die het in een pagina zet:

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## Wat het frame toont {#what-the-frame-shows}

Het frame toont de tabellen, kolommen, relaties, memo's en tabelgroepen van het diagram, en niets erin bewerkt het diagram of het bestand.  
Het diagram wordt bij het laden in het frame gepast, welke zoom en scrollpositie het bestand ook opsloeg, dus de grootte van het frame bepaalt het zoomniveau waarop het opent.

Over het canvas staan:

- De minimap, zolang het diagram inhoud heeft.
- De besturingsbalk onderaan: `Zoom out`, het zoomniveau, dat bij een klik de zoom terugzet, `Zoom in`, `Fit`, de lijst `Name View`, en `Go to content` zolang niets van het diagram in beeld is.
- De link `erd-editor.io` rechtsonder, die erd-editor.io in een nieuw tabblad opent en er geen referrer naartoe stuurt, zodat de klik de site niets vertelt over het document dat het frame toont. In een smal frame kan hij een deel van de besturingsbalk bedekken.

Terwijl het bestand laadt, toont het frame `Loading diagram`. Als het niet kan worden opgehaald of geen document bevat, toont het frame een leeg diagram met `Couldn't load the diagram` — zie [Bestanden op GitHub](#files-on-github) en [Bestanden op andere servers](#files-on-other-servers).

Het frame volgt alleen zijn URL en het systeem van de bezoeker. De eigen taal en het eigen thema van een bezoeker op erd-editor.io gelden er niet in.

## De builder {#the-builder}

Open [erd-editor.io/embed](https://erd-editor.io/embed) zonder `src` om de builder te krijgen, een pagina met de titel `Embed a diagram`:

1. Plak het adres van het document in `Document URL`. Het wordt toegepast wanneer je op `Enter` drukt of het veld verlaat, dus typen haalt niets op. Zodra het is toegepast, noemt een regel `Loads from` onder het veld het adres dat de viewer ophaalt: dat wat je opgaf, of, voor een pagina op GitHub, het adres ervan op de raw-host van GitHub — zie [Bestanden op GitHub](#files-on-github).
2. Kies de opties. Elke optie wordt direct toegepast op het voorbeeld, de URL en de iframe-regel:
   - `Theme`: `System`, `Light` of `Dark`.
   - `Display Language`: `System`, met ernaast de taal waar die in je browser voor staat, dan de 25 talen, elk met zijn eigen naam.
   - `Name View`: `As Saved`, `Physical Names`, `Logical Names` of `Both Names`. `As Saved` toont de naamweergave die het bestand opsloeg.
   - `Accent color` en `Gray color`, elk met naam en kleurstaal weergegeven.
   - `Minimap` en `Controls`, twee schakelaars, beide aan.
   - `Height`, in pixels, om mee te beginnen `480`. Een hoogte die geen positief geheel getal is, telt als `480`.
3. Controleer het `Preview`: de viewer zoals het frame hem zal tonen, met de link `erd-editor.io`, in een vak zo hoog als `Height`. Zijn taal `System` is die van je browser, in welke taal erd-editor.io zelf ook wordt getoond.
4. Kopieer het resultaat. `Embed URL` is het adres van het frame, en `Embed code` de iframe-regel, met de hoogte die je instelde en de breedte `100%`. Elk heeft een knop `Copy`, die uitgeschakeld blijft totdat een document-URL is toegepast, en die na een kopie even `Copied` toont, totdat een wijziging schrijft wat er is gekopieerd.

Het leegmaken van `Document URL` maakt het voorbeeld en de twee resultaten leeg zodra het wordt toegepast.

## URL-parameters {#url-parameters}

| Parameter | Waarden | Standaard |
| --- | --- | --- |
| `src` | Het adres van het document, URL-gecodeerd. | Geen: zonder deze parameter, of met een lege, is de pagina de builder. |
| `theme` | `light`, `dark` of `system`. | `system`: de lichte of donkere modus die de browser van de bezoeker meldt. |
| `locale` | `system`, of een code uit de [taaltabel](./language-and-theme.md#display-language), zoals `de-DE`. | `system`: de browsertalen van de bezoeker, vergeleken zoals [Systeem](./language-and-theme.md#what-system-follows) ze vergelijkt, en Engels wanneer de viewer er geen van heeft. |
| `name-view` | `physical`, `logical` of `both`. | De naamweergave die het bestand opsloeg. |
| `minimap` | `false` verbergt de minimap. | Getoond. |
| `controls` | `false` verbergt de besturingsbalk. | Getoond. |
| `accent-color` | Een van de 26 accentkleuren van de [themabouwer](./language-and-theme.md#theme), zoals `jade`. | `indigo` |
| `gray-color` | `gray`, `mauve`, `slate`, `sage`, `olive` of `sand`. | `slate` |

De standaardwaarden zijn die van de viewer zelf, niet die van de webapp, die begint met `jade` en `olive`.

- De builder laat elke optie op haar standaardwaarde weg uit de URL, zodat een embed-URL alleen bevat wat afwijkt.
- Een waarde die de viewer niet accepteert, wordt genegeerd, en de optie behoudt de standaardwaarde. Waarden worden precies zo vergeleken als ze zijn vermeld, dus `theme=Dark` wordt genegeerd, en `minimap` en `controls` blijven getoond voor elke waarde behalve `false`.
- Een parameter die twee keer is opgegeven, neemt zijn eerste waarde.
- `src` is URL-gecodeerd, zoals de builder het schrijft, omdat een adres met een eigen `&` of `#` anders wordt afgekapt.

## Bestanden op GitHub {#files-on-github}

Een bestand of een gist op GitHub kan worden opgegeven met het adres dat zijn pagina toont, zoals het frame hierboven. De viewer haalt het in plaats daarvan op van de raw-host van GitHub, die het verzoek van een andere site beantwoordt waar het eigen adres van de pagina dat niet doet:

- De pagina van een bestand, `https://github.com/<owner>/<repo>/blob/<ref>/<path>`, of zijn `raw`-adres, `https://github.com/<owner>/<repo>/raw/<ref>/<path>`, laadt van `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>`. `<ref>` is een branch, een tag of een commit: een branch toont het bestand zoals die branch het heeft, en een tag of een commit behoudt die versie.
- De pagina van een gist, `https://gist.github.com/<user>/<id>`, laadt van `https://gist.githubusercontent.com/<user>/<id>/raw`, dat is het eerste bestand van de gist. Houd het diagram het enige bestand van de gist.

De embed-URL behoudt het adres dat je opgaf, en de regel `Loads from` van de builder toont het adres dat is opgehaald.  
Dit werkt alleen voor openbare repositories en openbare gists. De raw-host cachet elk bestand vijf minuten, dus een wijziging die je pusht kan zo lang duren voordat ze in het frame verschijnt.

## Bestanden op andere servers {#files-on-other-servers}

De viewer op erd-editor.io haalt het bestand met een gewone `GET` op vanuit de browser van de bezoeker, dus de server die het bevat moet dat cross-origin-verzoek toestaan (CORS): zijn antwoord heeft een header `Access-Control-Allow-Origin` nodig die `https://erd-editor.io` toestaat, zoals `*`.  
Het verzoek bevat geen cookies, dus het bestand moet leesbaar zijn zonder in te loggen.  
Zonder die header, of voor een adres dat met een fout antwoordt of met iets anders dan een ERD Editor-document, toont het frame `Couldn't load the diagram`.

## In het frame {#in-the-frame}

Het frame neemt geen wiel, gebaar of toets aan totdat een bezoeker erop klikt of tikt of het met `Tab` bereikt. Tot die tijd scrollen of zoomen het wiel, een veegbeweging en een knijpbeweging de pagina eromheen zoals gewoonlijk.  
Zodra het de focus heeft, pant het wiel het diagram, zoomen `Ctrl + Wheel` (Windows/Linux) of `⌘ + Wheel` (Mac) en een knijpbeweging het, en opent `Ctrl + K` (Windows/Linux) of `⌘ + K` (Mac) een zoekopdracht over het document, waar `#` een tabel vindt, `@` een kolom en `:` een opmerking of memo.  
Een sleepbeweging pant het diagram of het frame nu de focus heeft of niet, en een klik of tik laat relaties oplichten: die van de aangeklikte tabel, of de ene aangeklikte relatie. De tabel waarop de aanwijzer rust, laat zijn eigen oplichten. Zie [Focus en toetsen](../../api/erd-viewer-element.md#focus-and-keys) voor elke toets.

Om het op een groter diagram uit te proberen, met zoomen en zoeken, open je het [voorbeeld van de boekwinkel](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json), negen tabellen en twee tabelgroepen, in een eigen pagina.

## Analytics {#analytics}

erd-editor.io telt bezoeken aan het frame met Google Analytics, zoals het bezoeken aan de webapp telt. Het adres dat het voor een frame vastlegt, is alleen `erd-editor.io/embed`, zonder het documentadres dat `src` noemt.  
Zie het [Privacybeleid](https://erd-editor.io/privacy).

## De viewer zelf laden {#loading-the-viewer-yourself}

Een pagina die scripts kan laden, kan een diagram tonen met het element [`<erd-viewer>`](../../api/erd-viewer-element.md) uit het pakket `@dineug/erd-editor`. Het neemt dezelfde opties als attributen en methoden, doet geen verzoek aan erd-editor.io, en kan een document laden van de eigen site van de pagina, wat geen CORS nodig heeft.
