---
sidebar_position: 18
description: Zobrazenie diagramu iba na čítanie na inom webe bez kódu vložením erd-editor.io/embed, zostavenie jeho adresy URL a riadka iframe v nástroji na zostavenie, nastavenie motívu, jazyka, Zobrazenia názvov, minimapy, ovládacích prvkov a farieb v adrese URL a poskytovanie súboru z GitHubu alebo zo servera, ktorý povoľuje CORS.
---

# Vkladanie

[erd-editor.io/embed](https://erd-editor.io/embed) zobrazuje diagram iba na čítanie v prehliadači, ktorý vypĺňa stránku, aby ju mohol vložiť iný web: wiki, blog, nástroj na tvorbu webov alebo ľubovoľná stránka, ktorá nemôže načítať vlastné skripty.  
Jeho parameter `src` uvádza dokument, teda adresu súboru v podobe, v akej ho ukladá ERD Editor, napríklad súboru `.erd.json`. Zvyšok adresy URL určuje, ako ho prehliadač zobrazí, a nástroj na zostavenie na tej istej adrese zapíše adresu URL aj jej riadok iframe za vás.

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Tento rámec zobrazuje [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json) z repozitára erd-editor a tento riadok ho vloží na stránku:

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## Čo rámec zobrazuje {#what-the-frame-shows}

Rámec zobrazuje tabuľky, stĺpce, vzťahy, poznámky a skupiny tabuliek diagramu a nič v ňom diagram ani súbor neupravuje.  
Diagram sa pri načítaní prispôsobí rámcu bez ohľadu na to, aké priblíženie a polohu posunutia súbor uložil, takže priblíženie, s ktorým sa otvorí, určuje veľkosť rámca.

Nad plátnom sú:

- Minimapa, kým diagram obsahuje nejaký obsah.
- Panel ovládacích prvkov v dolnej časti: `Zoom out`, úroveň priblíženia, ktorá po kliknutí obnoví priblíženie, `Zoom in`, `Fit`, zoznam `Name View` a `Go to content`, kým na obrazovke nie je žiadna časť diagramu.
- Odkaz `erd-editor.io` vpravo dole, ktorý otvorí erd-editor.io na novej karte a neposiela mu žiadny referrer, takže kliknutie nepovie webu nič o dokumente, ktorý rámec zobrazuje. V úzkom rámci môže zakryť časť panela ovládacích prvkov.

Kým sa súbor načítava, rámec zobrazuje `Loading diagram`. Ak sa nedá stiahnuť alebo neobsahuje dokument, rámec zobrazí prázdny diagram s oznámením `Couldn't load the diagram` – pozrite si časti [Súbory na GitHube](#files-on-github) a [Súbory na iných serveroch](#files-on-other-servers).

Rámec sa riadi iba svojou adresou URL a systémom návštevníka. Vlastný jazyk a motív návštevníka na erd-editor.io sa v ňom neuplatnia.

## Nástroj na zostavenie {#the-builder}

Otvorte [erd-editor.io/embed](https://erd-editor.io/embed) bez `src` a získate nástroj na zostavenie, stránku s názvom `Embed a diagram`:

1. Vložte adresu dokumentu do poľa `Document URL`. Uplatní sa po stlačení `Enter` alebo po opustení poľa, takže písanie nič nestiahne. Po uplatnení riadok `Loads from` pod poľom uvádza adresu, ktorú prehliadač sťahuje: tú, ktorú ste zadali, alebo, pri stránke na GitHube, jej adresu na hostiteľovi raw na GitHube – pozrite si časť [Súbory na GitHube](#files-on-github).
2. Vyberte možnosti. Každá sa okamžite uplatní na náhľad, adresu URL aj riadok iframe:
   - `Theme`: `System`, `Light` alebo `Dark`.
   - `Display Language`: `System`, vedľa neho jazyk, ktorý vo vašom prehliadači predstavuje, a potom 25 jazykov, každý vo svojom vlastnom názve.
   - `Name View`: `As Saved`, `Physical Names`, `Logical Names` alebo `Both Names`. `As Saved` zobrazuje Zobrazenie názvov, ktoré uložil súbor.
   - `Accent color` a `Gray color`, každá uvedená názvom so vzorkou.
   - `Minimap` a `Controls`, dva prepínače, oba zapnuté.
   - `Height` v pixeloch, na začiatku `480`. Výška, ktorá nie je kladné celé číslo, sa počíta ako `480`.
3. Skontrolujte `Preview`: prehliadač tak, ako ho rámec zobrazí, s odkazom `erd-editor.io`, v poli vysokom ako `Height`. Jeho jazyk `System` je jazyk vášho prehliadača bez ohľadu na to, v akom jazyku sa zobrazuje samotný erd-editor.io.
4. Skopírujte výsledok. `Embed URL` je adresa rámca a `Embed code` riadok iframe s výškou, ktorú ste nastavili, a šírkou `100%`. Každý má tlačidlo `Copy`, ktoré zostáva vypnuté, kým sa neuplatní adresa dokumentu, a po skopírovaní na chvíľu zobrazuje `Copied`, kým zmena neprepíše to, čo skopírovalo.

Vymazanie poľa `Document URL` vyprázdni náhľad a oba výsledky, hneď ako sa uplatní.

## Parametre adresy URL {#url-parameters}

| Parameter | Hodnoty | Predvolená hodnota |
| --- | --- | --- |
| `src` | Adresa dokumentu zakódovaná ako URL. | Žiadna: bez nej alebo s prázdnou hodnotou je stránka nástrojom na zostavenie. |
| `theme` | `light`, `dark` alebo `system`. | `system`: svetlý alebo tmavý režim, ktorý hlási prehliadač návštevníka. |
| `locale` | `system` alebo kód z [tabuľky jazykov](./language-and-theme.md#display-language), napríklad `de-DE`. | `system`: jazyky prehliadača návštevníka, priradené tak, ako ich priraďuje [System](./language-and-theme.md#what-system-follows), a angličtina, keď prehliadač nemá ani jeden z nich. |
| `name-view` | `physical`, `logical` alebo `both`. | Zobrazenie názvov, ktoré uložil súbor. |
| `minimap` | `false` skryje minimapu. | Zobrazená. |
| `controls` | `false` skryje panel ovládacích prvkov. | Zobrazený. |
| `accent-color` | Jedna z 26 akcentových farieb [nástroja na tvorbu motívu](./language-and-theme.md#theme), napríklad `jade`. | `indigo` |
| `gray-color` | `gray`, `mauve`, `slate`, `sage`, `olive` alebo `sand`. | `slate` |

Predvolené hodnoty sú hodnoty samotného prehliadača, nie webovej aplikácie, ktorá začína na `jade` a `olive`.

- Nástroj na zostavenie vynecháva z adresy URL každú možnosť na predvolenej hodnote, takže adresa URL vloženia obsahuje iba to, čo sa líši.
- Hodnota, ktorú prehliadač neprijíma, sa ignoruje a jej možnosť si ponechá predvolenú hodnotu. Hodnoty sa porovnávajú presne tak, ako sú uvedené, takže `theme=Dark` sa ignoruje a `minimap` a `controls` zostanú zobrazené pri každej hodnote okrem `false`.
- Parameter zadaný dvakrát preberie svoju prvú hodnotu.
- `src` je zakódovaný ako URL, tak ako ho zapisuje nástroj na zostavenie, pretože adresa s vlastným `&` alebo `#` by sa inak skrátila.

## Súbory na GitHube {#files-on-github}

Súbor alebo gist na GitHube možno zadať adresou, ktorú zobrazuje jeho stránka, ako v rámci vyššie. Prehliadač ho namiesto toho stiahne z hostiteľa raw na GitHube, ktorý odpovedá na požiadavku iného webu, na rozdiel od vlastnej adresy stránky:

- Stránka súboru, `https://github.com/<owner>/<repo>/blob/<ref>/<path>`, alebo jeho adresa `raw`, `https://github.com/<owner>/<repo>/raw/<ref>/<path>`, sa načíta z `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>`. `<ref>` je vetva, značka alebo commit: vetva zobrazuje súbor tak, ako ho má vetva, a značka alebo commit zachováva túto verziu.
- Stránka gistu, `https://gist.github.com/<user>/<id>`, sa načíta z `https://gist.githubusercontent.com/<user>/<id>/raw`, čo je prvý súbor gistu. Ponechajte diagram ako jediný súbor gistu.

Adresa URL vloženia si ponechá adresu, ktorú ste zadali, a riadok `Loads from` v nástroji na zostavenie zobrazuje tú, ktorá sa sťahuje.  
Funguje to iba pre verejné repozitáre a verejné gisty. Hostiteľ raw ukladá každý súbor do vyrovnávacej pamäte na päť minút, takže zmena, ktorú odošlete, sa môže v rámci prejaviť až po tomto čase.

## Súbory na iných serveroch {#files-on-other-servers}

Prehliadač na erd-editor.io sťahuje súbor obyčajným `GET` z prehliadača návštevníka, takže server, ktorý ho drží, musí túto požiadavku z iného pôvodu povoliť (CORS): jeho odpoveď potrebuje hlavičku `Access-Control-Allow-Origin`, ktorá povoľuje `https://erd-editor.io`, napríklad `*`.  
Požiadavka nenesie žiadne cookies, takže súbor musí byť čitateľný bez prihlásenia.  
Bez tejto hlavičky alebo pri adrese, ktorá odpovie chybou alebo niečím iným ako dokumentom ERD Editor, rámec zobrazí `Couldn't load the diagram`.

## V rámci {#in-the-frame}

Rámec neprijíma koliesko, gesto ani kláves, kým naň návštevník neklikne alebo ťukne, alebo kým sa k nemu nedostane klávesom `Tab`. Dovtedy koliesko, potiahnutie a stiahnutie prstov posúvajú alebo približujú stránku okolo neho ako zvyčajne.  
Keď má fokus, koliesko posúva diagram, `Ctrl + Wheel` (Windows/Linux) alebo `⌘ + Wheel` (Mac) a stiahnutie prstov ho približujú a `Ctrl + K` (Windows/Linux) alebo `⌘ + K` (Mac) otvorí vyhľadávanie v dokumente, kde `#` nájde tabuľku, `@` stĺpec a `:` komentár alebo poznámku.  
Ťahanie posúva diagram bez ohľadu na to, či má rámec fokus, a kliknutie alebo ťuknutie zvýrazní vzťahy: vzťahy tabuľky, na ktorú sa kliklo, alebo jeden vzťah, na ktorý sa kliklo. Tabuľka, na ktorej spočíva ukazovateľ, zvýrazní svoje vlastné. Všetky klávesy nájdete v časti [Fokus a klávesy](../../api/erd-viewer-element.md#focus-and-keys).

Ak si chcete vyskúšať väčší diagram, približovanie a vyhľadávanie, otvorte [ukážku bookstore](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json), deväť tabuliek a dve skupiny tabuliek, na vlastnej stránke.

## Analytika {#analytics}

erd-editor.io počíta návštevy rámca pomocou Google Analytics, rovnako ako počíta návštevy webovej aplikácie. Adresa, ktorú zaznamenáva pre rámec, je iba `erd-editor.io/embed`, bez adresy dokumentu, ktorú uvádza `src`.  
Pozrite si [Zásady ochrany osobných údajov](https://erd-editor.io/privacy).

## Samostatné načítanie prehliadača {#loading-the-viewer-yourself}

Stránka, ktorá môže načítať skripty, môže diagram zobraziť aj pomocou elementu [`<erd-viewer>`](../../api/erd-viewer-element.md) z balíka `@dineug/erd-editor`. Prijíma rovnaké možnosti ako atribúty a metódy, nevykonáva žiadne požiadavky na erd-editor.io a môže načítať dokument z vlastného webu stránky, čo nepotrebuje CORS.
