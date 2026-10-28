---
sidebar_position: 18
description: Pokažite diagram samo za branje na drugem spletnem mestu brez kode z okvirjem erd-editor.io/embed, v graditelju sestavite njegov naslov URL in vrstico iframe, v naslovu URL nastavite temo, jezik, prikaz imen, mini zemljevid, kontrolnike in barve ter datoteko postrezite z GitHuba ali strežnika, ki dovoljuje CORS.
---

# Vdelava

[erd-editor.io/embed](https://erd-editor.io/embed) prikaže diagram samo za branje v pregledovalniku, ki zapolni stran, da ga lahko v okvir vstavi drugo spletno mesto: wiki, blog, graditelj spletnih mest ali katera koli stran, ki ne more naložiti lastnih skript.  
Njegov parameter `src` poimenuje dokument, torej naslov datoteke, kot jo shrani ERD Editor, na primer datoteke `.erd.json`. Preostanek naslova URL določa, kako ga pregledovalnik prikaže, graditelj na istem naslovu pa naslov URL in vrstico iframe napiše namesto vas.

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Ta okvir prikazuje [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json) iz repozitorija erd-editor, vrstica, ki ga vstavi na stran, pa je ta:

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## Kaj prikazuje okvir {#what-the-frame-shows}

Okvir prikazuje tabele, stolpce, relacije, beležke in skupine tabel diagrama, nič v njem pa ne ureja diagrama ali datoteke.  
Diagram se ob nalaganju prilagodi okviru, ne glede na povečavo in položaj pomika, ki ju je shranila datoteka, zato velikost okvira določa povečavo, pri kateri se odpre.

Nad platnom so:

- Mini zemljevid, dokler ima diagram vsebino.
- Vrstica s kontrolniki na dnu: `Zoom out`, stopnja povečave, ki ob kliku ponastavi povečavo, `Zoom in`, `Fit`, seznam `Name View` in `Go to content`, dokler noben del diagrama ni na zaslonu.
- Povezava `erd-editor.io` spodaj desno, ki odpre erd-editor.io v novem zavihku in mu ne pošlje nobenega referrerja, tako da klik spletnemu mestu ne izda ničesar o dokumentu, ki ga prikazuje okvir. V ozkem okvirju lahko prekrije del vrstice s kontrolniki.

Medtem ko se datoteka nalaga, okvir prikazuje `Loading diagram`. Če je ni mogoče pridobiti ali ne vsebuje dokumenta, okvir prikaže prazen diagram z obvestilom `Couldn't load the diagram` – glejte razdelka [Datoteke na GitHubu](#files-on-github) in [Datoteke na drugih strežnikih](#files-on-other-servers).

Okvir sledi samo svojemu naslovu URL in sistemu obiskovalca. Obiskovalčev lasten jezik in tema na erd-editor.io v njem ne veljata.

## Graditelj {#the-builder}

Odprite [erd-editor.io/embed](https://erd-editor.io/embed) brez `src`, da dobite graditelja, stran z naslovom `Embed a diagram`:

1. V polje `Document URL` prilepite naslov dokumenta. Uveljavi se, ko pritisnete `Enter` ali zapustite polje, zato tipkanje ne pridobi ničesar. Ko se uveljavi, vrstica `Loads from` pod poljem navede naslov, ki ga pregledovalnik pridobi: tistega, ki ste ga podali, ali, za stran na GitHubu, njen naslov na GitHubovem surovem gostitelju – glejte razdelek [Datoteke na GitHubu](#files-on-github).
2. Izberite možnosti. Vsaka se takoj uveljavi v predogledu, naslovu URL in vrstici iframe:
   - `Theme`: `System`, `Light` ali `Dark`.
   - `Display Language`: `System`, ob njem pa jezik, ki ga predstavlja v vašem brskalniku, nato 25 jezikov, vsak v svojem imenu.
   - `Name View`: `As Saved`, `Physical Names`, `Logical Names` ali `Both Names`. `As Saved` prikaže prikaz imen, ki ga je shranila datoteka.
   - `Accent color` in `Gray color`, vsaka navedena z imenom in vzorcem barve.
   - `Minimap` in `Controls`, dve stikali, obe vklopljeni.
   - `Height` v slikovnih pikah, na začetku `480`. Višina, ki ni pozitivno celo število, šteje kot `480`.
3. Preverite `Preview`: pregledovalnik, kakršnega bo prikazal okvir, s povezavo `erd-editor.io`, v polju, visokem toliko, kot je `Height`. Njegov jezik `System` je jezik vašega brskalnika, ne glede na to, v katerem jeziku erd-editor.io sam prikazuje vsebino.
4. Kopirajte rezultat. `Embed URL` je naslov okvirja, `Embed code` pa vrstica iframe z nastavljeno višino in širino `100%`. Vsak ima gumb `Copy`, ki je onemogočen, dokler se naslov URL dokumenta ne uveljavi, in ki za trenutek po kopiranju prikazuje `Copied`, dokler sprememba ne prepiše tistega, kar je kopiral.

Ko izpraznite `Document URL` in se to uveljavi, se izpraznita predogled in oba rezultata.

## Parametri URL {#url-parameters}

| Parameter | Vrednosti | Privzeto |
| --- | --- | --- |
| `src` | Naslov dokumenta, kodiran za URL. | Brez: brez njega ali s praznim je stran graditelj. |
| `theme` | `light`, `dark` ali `system`. | `system`: svetli ali temni način, ki ga sporoča obiskovalčev brskalnik. |
| `locale` | `system` ali koda iz [tabele jezikov](./language-and-theme.md#display-language), na primer `de-DE`. | `system`: jeziki obiskovalčevega brskalnika, ujemani tako, kot jih ujema [System](./language-and-theme.md#what-system-follows), in angleščina, če pregledovalnik nobenega od njih nima. |
| `name-view` | `physical`, `logical` ali `both`. | Prikaz imen, ki ga je shranila datoteka. |
| `minimap` | `false` skrije mini zemljevid. | Prikazana. |
| `controls` | `false` skrije vrstico s kontrolniki. | Prikazana. |
| `accent-color` | Ena od 26 poudarjenih barv [graditelja tem](./language-and-theme.md#theme), na primer `jade`. | `indigo` |
| `gray-color` | `gray`, `mauve`, `slate`, `sage`, `olive` ali `sand`. | `slate` |

Privzete vrednosti so vrednosti pregledovalnika, ne spletne aplikacije, ki se zažene z `jade` in `olive`.

- Graditelj pusti vsako možnost pri privzeti vrednosti zunaj naslova URL, zato naslov URL vsebuje samo tisto, kar se razlikuje.
- Vrednost, ki je pregledovalnik ne sprejme, se prezre, njena možnost pa obdrži privzeto vrednost. Vrednosti se ujemajo natančno, kot so navedene, zato se `theme=Dark` prezre, `minimap` in `controls` pa ostaneta prikazana pri vsaki vrednosti razen `false`.
- Parameter, podan dvakrat, prevzame prvo vrednost.
- `src` je kodiran za URL, kot ga zapiše graditelj, saj bi se naslov z lastnim `&` ali `#` sicer odrezal.

## Datoteke na GitHubu {#files-on-github}

Datoteko ali gist na GitHubu lahko podate z naslovom, ki ga prikazuje njegova stran, kot pri zgornjem okvirju. Pregledovalnik ga namesto tega pridobi iz GitHubovega surovega gostitelja, ki odgovori na zahtevo drugega spletnega mesta, kjer lastni naslov strani ne:

- Stran datoteke, `https://github.com/<owner>/<repo>/blob/<ref>/<path>`, ali njen naslov `raw`, `https://github.com/<owner>/<repo>/raw/<ref>/<path>`, se naloži iz `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>`. `<ref>` je veja, oznaka ali commit: veja prikaže datoteko, kakršno ima ta veja, oznaka ali commit pa ohrani to različico.
- Stran gista, `https://gist.github.com/<user>/<id>`, se naloži iz `https://gist.githubusercontent.com/<user>/<id>/raw`, kar je prva datoteka gista. Diagram naj bo edina datoteka gista.

Naslov URL vdelave ohrani naslov, ki ste ga podali, vrstica `Loads from` v graditelju pa prikazuje tistega, ki je pridobljen.  
To velja samo za javne repozitorije in javne gist-e. Surovi gostitelj vsako datoteko predpomni pet minut, zato se lahko spremembe, ki jih potisnete, v okvirju prikažejo šele po toliko času.

## Datoteke na drugih strežnikih {#files-on-other-servers}

Pregledovalnik na erd-editor.io pridobi datoteko z navadno zahtevo `GET` iz obiskovalčevega brskalnika, zato mora strežnik, ki jo hrani, to zahtevo med različnimi izvori dovoliti (CORS): njegov odgovor potrebuje glavo `Access-Control-Allow-Origin`, ki dovoljuje `https://erd-editor.io`, na primer `*`.  
Zahteva ne nosi piškotkov, zato mora biti datoteka berljiva brez prijave.  
Brez te glave ali za naslov, ki odgovori z napako ali z nečim, kar ni dokument ERD Editor, okvir prikaže `Couldn't load the diagram`.

## V okvirju {#in-the-frame}

Okvir ne sprejme kolesca, geste ali tipke, dokler obiskovalec ne klikne ali tapne nanj ali ga doseže s tipko `Tab`. Do takrat kolesce, poteg in ščip kot običajno pomikajo ali povečujejo stran okoli njega.  
Ko ima fokus, kolesce premika diagram, `Ctrl + Wheel` (Windows/Linux) ali `⌘ + Wheel` (Mac) in ščip ga povečujeta, `Ctrl + K` (Windows/Linux) ali `⌘ + K` (Mac) pa odpre iskanje po dokumentu, kjer `#` najde tabelo, `@` stolpec, `:` pa komentar ali beležko.  
Vlečenje premika diagram, ne glede na to, ali ima okvir fokus, klik ali tap pa osvetli relacije: relacije tabele, na katero ste kliknili, ali edino relacijo, na katero ste kliknili. Tabela, nad katero počiva kazalec, osvetli svoje. Vse tipke so v razdelku [Fokus in tipke](../../api/erd-viewer-element.md#focus-and-keys).

Če želite preizkusiti večji diagram z povečevanjem in iskanjem, odprite [vzorec knjigarne](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json), devet tabel in dve skupini tabel, na lastni strani.

## Analitika {#analytics}

erd-editor.io šteje obiske okvirja z Google Analytics, tako kot šteje obiske spletne aplikacije. Naslov, ki ga zabeleži za okvir, je samo `erd-editor.io/embed`, brez naslova dokumenta, ki ga poimenuje `src`.  
Glejte [Politiko zasebnosti](https://erd-editor.io/privacy).

## Samostojno nalaganje pregledovalnika {#loading-the-viewer-yourself}

Stran, ki lahko nalaga skripte, lahko diagram prikaže z elementom [`<erd-viewer>`](../../api/erd-viewer-element.md) iz paketa `@dineug/erd-editor`. Sprejema enake možnosti kot atribute in metode, ne pošilja zahtev na erd-editor.io in lahko naloži dokument z lastnega mesta strani, za kar CORS ni potreben.
