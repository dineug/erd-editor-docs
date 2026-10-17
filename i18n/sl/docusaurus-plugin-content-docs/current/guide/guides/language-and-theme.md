---
sidebar_position: 15
description: 25 jezikov prikaza urejevalnika, postavitev od desne proti levi, videzi System, Light in Dark v izbirniku teme in njegove barve ter kje jih hrani posamezni gostitelj.
---

# Jezik in tema

Lastno besedilo urejevalnika je na voljo v 25 jezikih, njegova podoba pa je tema: videz (`System`, `Light` ali `Dark`), sivi toni in barva poudarka.  
Oba pripadata osebi, ki uporablja urejevalnik, ne diagramu. Nobeden od njiju se ne shrani v datoteko, ne zabeleži v [zgodovino razveljavitev](./undo-redo.md) in ne deli s sodelavci, zato vsak vidi svoje, sprememba katerega koli od njiju pa datoteke nikoli ne označi kot spremenjene.

Nobenega od njiju ni na zavihku [Nastavitve](./settings.md). Orodna vrstica ima gumb `Theme` in takoj za njim gumb `Display Language`, oba za gumbom [`Explorer`](./explorer.md). [Hitro iskanje](./quick-search.md) navaja `Theme` in `Display Language` na vsakem zavihku.  
Spletna aplikacija, Google Drive, VS Code, razvojna okolja JetBrains in Obsidian ponujajo oba in si zapomnijo vaše izbire – glejte razdelek [V posameznih gostiteljih](#in-each-host). Oba delujeta tudi v urejevalniku samo za branje.

## Jezik prikaza {#display-language}

Jezik zajema lastno besedilo urejevalnika: opise orodij v orodni vrstici, priročne menije, hitro iskanje, plošče in pogovorna okna, zavihek Nastavitve, [pozdravni zaslon](./editing-start.md#welcome-screen), pojavna obvestila in sporočila ter nadomestno besedilo, ki ga prazno ime, podatkovni tip, privzeta vrednost ali komentar prikazuje na platnu in v izvoženi sliki.  
V vseh jezikih pa pusti nespremenjeno naslednje: vaša imena tabel in stolpcev, komentarje in beležke; vrste zbirk podatkov, jezike generatorja kode in oblike datotek; podatkovne tipe, ključne besede SQL ter dejanji `ON DELETE` in `ON UPDATE`; možnosti Sheme SQL `Create`, `If not exists`, `Drop & re-create`, `USE` in `CREATE + USE`; oznake `PK`, `FK`, `UQ`, `AI`, `NN`, `N-N`, `NULL` in `AK1.1`; črke stanja `A`, `M`, `D`, `R` in `~` v [pregledovalniku razlik](./table-related-functions.md#diff-viewer); izbire za zapis imen in za nastavitev `Bracket` razen `None`; imena tipk na tipkovnici; imena barv v izbirniku teme; ustvarjeno kodo SQL in drugo kodo ter imena izvoženih datotek.

Jeziki v vrstnem redu, v katerem jih navaja izbirnik:

| V izbirniku | Jezik | Koda |
| --- | --- | --- |
| Bahasa Indonesia | Indonezijščina | `id-ID` |
| Deutsch | Nemščina | `de-DE` |
| English | Angleščina | `en` |
| Español | Španščina | `es-ES` |
| Euskara | Baskovščina | `eu-ES` |
| Français | Francoščina | `fr-FR` |
| Italiano | Italijanščina | `it-IT` |
| Nederlands | Nizozemščina | `nl-NL` |
| Polski | Poljščina | `pl-PL` |
| Português | Portugalščina | `pt-PT` |
| Português Brasileiro | Brazilska portugalščina | `pt-BR` |
| Română | Romunščina | `ro-RO` |
| Slovenčina | Slovaščina | `sk-SK` |
| Slovenščina | Slovenščina | `sl-SI` |
| Svenska | Švedščina | `sv-SE` |
| Türkçe | Turščina | `tr-TR` |
| Русский | Ruščina | `ru-RU` |
| Українська | Ukrajinščina | `uk-UA` |
| עברית | Hebrejščina | `he-IL` |
| العربية | Arabščina | `ar-SA` |
| فارسی | Perzijščina | `fa-IR` |
| 日本語 | Japonščina | `ja-JP` |
| 简体中文 | Poenostavljena kitajščina | `zh-CN` |
| 繁體中文 | Tradicionalna kitajščina | `zh-TW` |
| 한국어 | Korejščina | `ko-KR` |

Možnost `Language`, ki jo hitro iskanje ponuja na zavihku Generator kode, in vrstica `Language` na seznamu [Zaklepanje](./settings.md#lock) na zavihku Nastavitve sta [ciljni jezik generatorja kode](./code-generator.md#language), ne jezik prikaza.

### Izbira jezika {#picking-a-language}

Gumb `Display Language` (ikona jezikov) odpre izbirnik `Display Language`, ploščo z naslovom `Display Language` pod orodno vrstico, nad katerim koli odprtim zavihkom.  
Prva je možnost `System`, ob kateri je jezik, ki ga trenutno predstavlja, in ostane vidna, medtem ko se seznam pomika. Sledi 25 jezikov, vsak pod svojim lastnim imenom, kljukica pa označuje veljavno možnost.

![Preklop jezika prikaza iz orodne vrstice na 한국어, nato na العربية, ki zrcali orodno vrstico, diagrama pa ne, in nazaj na System](/img/demo-display-language.webp)

Ko se plošča odpre, je fokus tipkovnice na označeni vrstici:

- `↑` in `↓` premikata fokus po vrsticah in na koncu seznama nadaljujeta na drugem koncu, `Home` in `End` pa skočita na prvo in zadnjo vrstico.
- `Enter` ali `Space` izbere vrstico s fokusom, tako kot klik.

Izbira začne veljati takoj, zapre ploščo in vrne fokus tipkovnice urejevalniku.

Brez izbire jo zaprite s tipko `Escape`, z gumbom `x` ob naslovu, katerega opis orodja je `Close (ESC)`, s pritiskom kjer koli v urejevalniku zunaj plošče, razen na orodni vrstici, ali še enkrat z gumbom `Display Language`.  
Če jo odprete, se zapreta izbirnik teme in okno Lastnosti tabele. Odprt [raziskovalec](./explorer.md#dialogs-beside-it) ostane odprt, v jeziku, ki se piše od leve proti desni, pa izbirnik stoji tik ob njem, ne pa nad njim.  
Če odprete hitro iskanje ali izbirnik teme, se zapre, prav tako pa jo zapre `Ctrl + F` (Windows/Linux) ali `⌘ + F` (Mac). Ta bližnjica odpre iskanje v [raziskovalcu](./explorer.md#opening-and-closing) ali, če je raziskovalec že odprt, ga pusti odprtega in premakne fokus tipkovnice v njegovo iskalno polje. Gumb `Explorer` v orodni vrstici pusti izbirnik odprt.

Medtem ko ima plošča fokus tipkovnice, nekaj bližnjic urejevalnika še vedno deluje: `Search`, `Toggle Explorer`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` in `Zoom Reset` – glejte razdelek [Bližnjice](./settings.md#shortcuts). Vse druge bližnjice urejevalnika, puščične tipke in tipka `Tab` ne pridejo dlje od plošče, zato se urejevalnik nanje ne odzove. Tipke, ki jih urejevalnik nima dodeljenih, na primer gostiteljeva lastna bližnjica za shranjevanje, dosežejo gostitelja kot običajno.

V [hitrem iskanju](./quick-search.md) ukaz `Display Language` navaja `System` in 25 jezikov, s kljukico ob veljavni možnosti. Jezik tam najdete tudi po njegovem angleškem imenu ali kodi, zato `german` ali `de-DE` najde `Deutsch`.

### Čemu sledi možnost System {#what-system-follows}

Možnost `System` je začetna nastavitev jezika v spletni aplikaciji, v storitvi Google Drive, v VS Code, v razvojnih okoljih JetBrains in v aplikaciji Obsidian. Sledi jeziku gostitelja:

- V spletni aplikaciji, v storitvi Google Drive in na vaši lastni strani: prednostnim jezikom brskalnika. Njihovi spremembi sledi takoj.
- V VS Code: jeziku prikaza VS Code.
- V razvojnem okolju JetBrains: jeziku, v katerem razvojno okolje prikazuje svoj vmesnik.
- V aplikaciji Obsidian: jeziku aplikacije Obsidian.

Možnost `System` vzame prvega od teh jezikov, ki ga urejevalnik ima, in angleščino, če nima nobenega od njih.  
Regionalna različica se šteje za jezik, ki mu pripada, zato `de-AT` pomeni Deutsch, `fr-CA` pa Français. Pri kitajščini odloča pisava: tradicionalna pisava pomeni 繁體中文, vsaka druga pisava pa 简体中文. Če pisava ni navedena, Tajvan, Hongkong ali Macao pomeni 繁體中文, vsaka druga kitajščina pa 简体中文. Portugalščina pomeni Português Brasileiro, razen če je navedena regija, ki ni Brazilija, zato `pt-PT` pomeni Português; portugalščina aplikacije Obsidian prav tako pomeni Português.

### Jeziki, ki se pišejo od desne proti levi {#right-to-left-languages}

עברית (hebrejščina), العربية (arabščina) in فارسی (perzijščina) postavijo urejevalnik od desne proti levi: orodna vrstica, meniji, plošče in pogovorna okna, hitro iskanje in zavihek Nastavitve so zrcaljeni. Podmeniji priročnega menija se odpirajo v levo, ikoni za razveljavitev in uveljavitev v orodni vrstici pa zamenjata mesti, tako da ikona za razveljavitev kaže nazaj glede na smer branja od desne proti levi.

Sam diagram ni nikoli zrcaljen. Platno s tabelami, stolpci, relacijami in beležkami ostane od leve proti desni, prav tako pa tudi mini zemljevid, drsni trakovi, [orodna vrstica platna](./table-related-functions.md#canvas-toolbar), [vizualizacija](./visualization.md) in njena orodna vrstica, celice podatkovnih tipov, koda na zavihkih Shema SQL in Generator kode, izbirnik barv, obe strani pregledovalnika razlik, potovanje skozi čas in predogled samodejne postavitve.  
[Raziskovalec](./explorer.md#beside-the-canvas) ostane na levi strani platna, drevo sprememb pregledovalnika razlik pa na levi strani pregledovalnika, oba z robom za vlečenje na svoji desni strani. Znotraj se oba bereta od desne proti levi: njuna polja in vrstice so zrcaljeni, vrstice se zamikajo od desne, v obeh drevesih pa `←` razširi vrstico ali premakne fokus na njen prvi podrejeni element, medtem ko `→` vrstico strne ali premakne fokus ven na nadrejeni element – glejte razdelek [Tipke v raziskovalcu](./explorer.md#keys-in-the-explorer).  
Imena, komentarji in drugo besedilo, ki ste ga vnesli, ohranijo svojo smer, zato se hebrejsko, arabsko ali perzijsko ime tudi na platnu bere od desne proti levi.

## Tema {#theme}

Gumb `Theme` (ikona kontrasta) odpre izbirnik teme, ploščo z naslovom `Theme` pod orodno vrstico, nad katerim koli odprtim zavihkom. Ima tri dele:

- `Accent color`: 26 barvnih vzorcev. Opis orodja vsakega vzorca navaja njegovo ime, kot je `indigo`.
- `Gray color`: 6 barvnih vzorcev, in sicer `gray`, `mauve`, `slate`, `sage`, `olive` in `sand`.
- `Appearance`: `System`, `Light` in `Dark`.

![Odpiranje izbirnika teme iz orodne vrstice, izbira barve poudarka in sivih tonov ter preklop videza na Light in nato na System](/img/demo-theme-builder.webp)

V vsakem delu je označena trenutno veljavna možnost, izbira pa začne veljati takoj, pri čemer izbirnik ostane odprt.  
Izbira barve videza ne spremeni, zato izbira barve pri videzu `System` ohrani `System`.

Možnost `System` prikaže svetel ali temen videz tako kot gostitelj in preklopi, ko preklopi gostitelj:

- V spletni aplikaciji, v storitvi Google Drive in na vaši lastni strani: svetli ali temni način, ki ga sporoča brskalnik in ki sledi operacijskemu sistemu.
- V VS Code: svetel videz pri svetli barvni temi in temen pri temni ali pri kateri koli od obeh tem z visokim kontrastom.
- V razvojnem okolju JetBrains: svetla ali temna tema razvojnega okolja.
- V aplikaciji Obsidian: svetla ali temna tema aplikacije Obsidian.

Izbirnik zaprite s tipko `Escape`, z gumbom `x` ob naslovu, katerega opis orodja je `Close (ESC)`, s pritiskom kjer koli v urejevalniku zunaj plošče, razen na orodni vrstici, ali še enkrat z gumbom `Theme`.  
Če ga odprete, se zapreta okno Lastnosti tabele in izbirnik `Display Language`. Odprt [raziskovalec](./explorer.md#dialogs-beside-it) ostane odprt, v jeziku, ki se piše od leve proti desni, pa izbirnik stoji tik ob njem, ne pa nad njim.  
Če odprete hitro iskanje ali izbirnik `Display Language`, se zapre, prav tako pa ga zapre `Ctrl + F` (Windows/Linux) ali `⌘ + F` (Mac). Ta bližnjica odpre iskanje v [raziskovalcu](./explorer.md#opening-and-closing) ali, če je raziskovalec že odprt, ga pusti odprtega in premakne fokus tipkovnice v njegovo iskalno polje. Gumb `Explorer` v orodni vrstici pusti izbirnik odprt.  
Izbirnik ne zadržuje nobenih tipk, zato bližnjice urejevalnika delujejo, medtem ko je odprt.

V [hitrem iskanju](./quick-search.md) ukaz `Theme` navaja `System`, `Light` in `Dark`, s kljukico ob veljavnem videzu. Izbira enega od njih spremeni samo videz, sive tone in barvo poudarka pa pusti nespremenjene.

## V posameznih gostiteljih {#in-each-host}

Kar izberete v urejevalniku, prek orodne vrstice ali hitrega iskanja, se shrani tja, kjer to hrani gostitelj, in vsak odprt diagram takoj sledi spremembi, ne glede na to, kje je bila narejena.  
V VS Code, v razvojnem okolju JetBrains in v aplikaciji Obsidian gostiteljeva možnost `Auto` (v VS Code vrednost `auto`) ustreza možnosti `System` v urejevalniku. Izbira možnosti `System` shrani `Auto`, izbira možnosti `Light` ali `Dark` pa shrani ta videz, tudi če ga je možnost `Auto` že prikazovala.  
Lastne nastavitve in obvestila razširitve in vtičnikov so v angleščini ne glede na jezik prikaza.

### Spletna aplikacija in Google Drive {#web-app-and-google-drive}

Na erd-editor.io, vključno z njegovimi sodelovalnimi sejami, in v storitvi Google Drive en jezik in ena tema veljata za aplikacijo in vsak diagram v njej.  
Oba se hranita v tem brskalniku, ne v shemi ali v datoteki v storitvi Drive, in vsi zavihki z erd-editor.io si ju delijo: izbira v enem zavihku takoj spremeni druge.

Dokler sami ne izberete jezika, je ta nastavljen na `System`, ki sledi prednostnim jezikom brskalnika.  
Lastno besedilo aplikacije, na primer v stranski vrstici, v košu, pri sodelovanju in na zaslonih za Google Drive, sledi istemu jeziku, v hebrejščini, arabščini in perzijščini pa je celotna aplikacija postavljena od desne proti levi. Politika zasebnosti, pogoji uporabe in strani s podporo ostanejo v angleščini.  
Poleg plošče urejevalnika in hitrega iskanja je v spodnji vrsti stranske vrstice, ob povezavah `Privacy` in `Terms`, še gumb za jezik, katerega opis orodja je `Display Language`. Njegov meni navaja `System` z jezikom, ki ga ta možnost predstavlja, nato pa 25 jezikov.

Tema se začne z videzom `System`, s sivimi toni `olive` in z barvo poudarka `jade`.  
Poleg izbirnika teme in hitrega iskanja so na dnu stranske vrstice trije gumbi z ikonami, `System`, `Light` in `Dark`: na erd-editor.io ob postavki `Trash`, v storitvi Google Drive pa ob postavki `Sign out`. Nastavijo enak videz kot izbirnik.

### VS Code {#vs-code}

Nastavitve razširitve so v nastavitvah VS Code pod ERD Editor:

| Nastavitev | Vrednosti | Privzeto |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto` ali koda iz [tabele jezikov](#display-language) | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`, `light`, `dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | Šest sivih tonov | `slate` |
| `dineug.erd-editor.theme.accentColor` | 26 barv poudarka | `indigo` |

Urejevalnik nastavitev pri nastavitvi jezika navaja `Auto`, nato pa vsak jezik pod njegovim lastnim imenom. Vrednost v datoteki `settings.json`, ki ne navaja nobenega jezika, se upošteva kot `auto`.  
Izbira teme v urejevalniku zapiše vse tri nastavitve teme. Izbira se zapiše tja, kjer je njena nastavitev že nastavljena: v mapo delovnega prostora, sicer v delovni prostor, sicer pa v uporabniške nastavitve.

### Razvojna okolja JetBrains {#jetbrains-ides}

V Settings | Tools | ERD Editor so nastavitve `Appearance:` (`Auto`, `Light`, `Dark`), `Gray color:`, `Accent color:` in `Display language:` (`Auto`, nato vsak jezik pod svojim lastnim imenom), ki se shranijo za celotno razvojno okolje.  
Začetne vrednosti so `Auto`, `Slate`, `Indigo` in `Auto`.

### Obsidian {#obsidian}

V Settings → ERD Editor so nastavitve `Appearance` (`Auto`, `Light`, `Dark`), `Gray color`, `Accent color` in `Display language` (`Auto`, nato vsak jezik pod svojim lastnim imenom), ki se shranijo za vsak trezor posebej.  
Začetne vrednosti so `Auto`, `Slate`, `Indigo` in `Auto`.  
Sprememba velja za vsak zavihek ERD v trezorju, vključno s tistimi v ločenih oknih.

### Vaša lastna stran {#your-own-page}

Element `<erd-editor>` na vaši lastni strani ne prikaže ne gumba `Theme` ne gumba `Display Language`, hitro iskanje pa ne navaja nobenega od njiju, dokler ju stran ne vklopi z lastnostma [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) in [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker).  
Dokler stran ne nastavi jezika ali ga bralec ne izbere, urejevalnik prikazuje angleščino ali pa sledi možnosti `System`, kadar je lastnost `enableLocalePicker` vklopljena.  
Tema se začne z videzom `Dark`, s sivimi toni `slate` in z barvo poudarka `indigo`, razen če stran nastavi drugo temo ali vklopi lastnost [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode).  
Bralčeva izbira začne veljati takoj, vendar element ne shrani nobene od obeh izbir: stran sama nastavi začetni izbiri in shrani bralčeve izbire – glejte razdelka [Tema](../../api/erd-editor-element.md#theme) in [Jezik prikaza](../../api/erd-editor-element.md#display-language) v dokumentaciji API.
