---
sidebar_position: 13
description: Razveljavitev in uveljavitev sprememb, kaj beleži zgodovina, in pomikanje po njej korak za korakom s potovanjem skozi čas.
---

# Razveljavitev, uveljavitev

Lahko se vrnete v prejšnje stanje urejanja ali se pomaknete naprej v poznejše.  
Zgodovina hrani do `2048` sprememb.

- Razveljavitev: `Ctrl + Z` (Windows/Linux) ali `⌘ + Z` (Mac)
- Uveljavitev: `Ctrl + Shift + Z` (Windows/Linux) ali `⌘ + Shift + Z` (Mac)

Orodna vrstica ponuja ista dva ukaza kot gumba `Undo` in `Redo`, ob gumbu `Time Travel`.  
Osvetlita se samo, kadar je na voljo kaj za razveljavitev ali uveljavitev. Urejevalnik z lastnostjo `readonly` skrije vse tri, bližnjice pa ne naredijo ničesar.

Razveljavitev in uveljavitev delujeta samo na zavihku ERD. Na zavihkih Vizualizacija, Shema SQL, Generator kode in Nastavitve nista na voljo. V poljih `Before tables` in `After tables` na zavihku Shema SQL iste tipke namesto tega razveljavijo in uveljavijo vaše tipkanje v polju.  
Bližnjice so neaktivne tudi, dokler je odprto hitro iskanje, okno `Table Properties`, `Diff Viewer`, predogled `Auto Layout`, pogovorno okno [`Export image`](./file-import-export.md#image), okno [Preslikaj stolpce](./relationship-editing.md#map-columns) ali potovanje skozi čas.  
Še naprej pa delujejo, dokler je tipkovnica kjer koli v [raziskovalcu](./explorer.md#keys-in-the-explorer), vključno z njegovim drevesom, in dokler je odprt [izbirnik barv](./table-related-functions.md#table-and-memo-color-specification). Tudi ko je kazalka v enem od njunih polj, na primer v iskalnem polju, polju za zamenjavo ali polju `Hex`, razveljavijo in uveljavijo spremembe v diagramu, ne v besedilu polja.

Zgodovina se hrani v pomnilniku za trenutno sejo. Ne shrani se v dokument, zato znova odprt diagram začne s prazno zgodovino.

![Premikanje tabele in odstranjevanje stolpca z ⌥ + Backspace, nato razveljavitev obeh sprememb z ⌘ + Z in njuna uveljavitev z ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Kaj beleži zgodovina {#what-the-history-records}

Zabeleženo:

- Tabele in beležke: dodajanje, odstranjevanje, premikanje, barva, ime in komentar, besedilo in velikost beležke.
- Skupine tabel: dodajanje, odstranjevanje, premikanje, spreminjanje velikosti, ime, barva in to, v kateri skupini je vsaka tabela – glejte stran [Skupine tabel](./table-groups.md).
- Stolpci: dodajanje, odstranjevanje, spreminjanje vrstnega reda in vsaka možnost stolpca.
- Relacije: dodajanje, odstranjevanje, sprememba vrste, stolpci, nastavljeni v oknu [Preslikaj stolpce](./relationship-editing.md#map-columns), in vsaka izbira v podmeniju `On Delete` ali `On Update` – glejte razdelek [ON DELETE in ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Razveljavitev odstranitve povrne relacijo skupaj z njenima dejanjema ON DELETE in ON UPDATE.
- Indeksi in njihovi stolpci.
- Položaj pogleda, stopnja povečave in stikala `View Option`.
- Skripta `Before tables` in `After tables` na zavihku Shema SQL, en korak za vsako spremembo, ki jo uporabite tako, da zapustite polje – glejte razdelek [Skripti pred tabelami in za njimi](./schema-sql.md#before-and-after-scripts).
- Uvoz datoteke in dodajanje datoteke z ukazom [`Import and Add`](./file-import-export.md#import-and-add).

Ni zabeleženo:

- Vrsta zbirke podatkov in ime zbirke podatkov.
- Jezik generatorja kode, `Table Name Case` in `Column Name Case`.
- Vrsta narekovajev, ne glede na to, ali je nastavljena na zavihku Shema SQL ali na zavihku Generator kode.
- Izbire `Statements`, `Header` in `Tables` na zavihku Shema SQL, ki pripadajo oknu urejevalnika – glejte razdelek [Plošča z možnostmi](./schema-sql.md#options-panel).
- Vse na zavihku Nastavitve, vključno z vrsticami [`Lock`](./settings.md#lock).
- Tema in jezik prikaza – glejte stran [Jezik in tema](./language-and-theme.md).
- Katera tabela, beležka ali skupina je narisana pred drugimi.
- [Raziskovalec](./explorer.md): njegovo odpiranje, zapiranje ali spreminjanje velikosti, strnjevanje njegovega drevesa ter iskalni niz in možnosti iskanja. Vendar se zabeleži, kar spremenita ukaza `Replace` in `Replace All`, prav tako pa tudi pomik, ki ga povzroči prehod – glejte razdelek [Ena poteza, en korak](#one-gesture-one-step).
- Povečava in premikanje pogleda na zavihku Vizualizacija v obeh načinih, premikanje vozlišč grafa ali kartic v načinu Tok, `Tidy Up`, prikaz vrstic in osredotočanje na tabele – glejte razdelek [Način Tok nikoli ne ureja dokumenta](./visualization.md#flow-never-edits-the-document).

Sprememb česar koli od naštetega ni mogoče razveljaviti.

Tudi spremembe, ki prispejo iz drugega urejevalnika, se ne zabeležijo, zato razveljavitev odpravi samo vaše lastne. V [sodelovalni seji](../../api/advanced/collaborative-editing.md) vsak urejevalnik razveljavi svoje spremembe, agent za kodiranje, ki ureja prek [strežnika MCP](../../mcp/live-and-headless.md#undo), pa svoje razveljavi z orodjem `erd_undo`.

Razveljavitev ukaza `Import`, ki nadomesti celoten diagram, povrne prejšnji diagram takšen, kakršen je bil v urejevalniku ob uvozu: vsak [zaklep](./settings.md#lock) je vklopljen ali izklopljen tako kot takrat, vsaka zaklenjena vrednost pa je enaka takratni.  
Če je bila v tem diagramu nastavitev `Viewport` zaklenjena, se pogled in povečava vrneta na zaklenjeni pogled, v katerem se diagram odpre, ne pa tja, kjer ste bili. Če je bila njegova nastavitev `Viewport` odklenjena, se vrneta tja, kjer ste bili ob uvozu. Druge zaklenjene nastavitve, kot je zavihek, na katerem ste, ali jezik generatorja kode, ostanejo takšne, kot so na vašem zaslonu.  
V novem diagramu so vsi zaklepi vklopljeni. Če želite ob taki razveljavitvi ohraniti svoj pogled, pred uvozom odklenite `Viewport`. Če ga odklenete pozneje ali uvozite datoteko JSON, katere lastni zaklep `Viewport` je izklopljen, se mesto, kamor vas pripelje razveljavitev, ne spremeni.

## Ena poteza, en korak {#one-gesture-one-step}

Vse, kar odpošlje ena sama poteza, postane en vnos v zgodovini.  
Lepljenje več tabel in beležk hkrati ali njihovo podvajanje z `Alt + drag` se razveljavi v enem koraku.

En pritisk tipke `Delete` ali `Backspace`, enako pa tudi postavka `Delete selected` ali `Delete columns` v priročnem meniju, je en korak, ne glede na to, koliko tabel, beležk, skupin tabel ali stolpcev odstrani.  
Preklop primarnega ključa na več izbranih stolpcih je en korak, ne glede na to, ali ga izvedete z `Alt + K` (Windows/Linux) ali `⌥ + K` (Mac) ali s postavko `Primary Key on selected columns` v priročnem meniju tabele.  
Nastavitev barve izbora ali njena odstranitev z možnostjo `No color` ali postavko `Remove color` je en korak, ne glede na to, koliko tabel, beležk in skupin je izbranih. Izbira barve, ki jo že ima vse izbrano, ne zabeleži nobenega koraka, prav tako pa ga ne zabeleži možnost `No color`, kadar nič izbranega nima barve.  
Pritisk gumba `Map` ali `Save` v oknu [Preslikaj stolpce](./relationship-editing.md#map-columns) je en korak, skupaj s stolpci tujega ključa, ki jih doda, in podatkovnimi tipi, ki jih spremeni.  
Ukaz `Import and Add` je en korak, skupaj s pomikom, ki pripelje dodani blok v pogled, kadar je ta pomik potreben.

Ustvarjanje [skupine tabel](./table-groups.md), bodisi z risanjem bodisi z združevanjem izbranih tabel s postavko `Group selected tables` ali z bližnjico `T` in nato `G`, je skupaj z vsemi tabelami, ki jih zajame, en korak. Odstranitev skupine je en korak, njena razveljavitev pa povrne skupino skupaj z njenimi tabelami v njej.  
Vlečenje skupine za naslovno vrstico premakne skupino in vse njene tabele v enem koraku. Tabele, ki jih povlečete v skupino ali iz nje, zamenjajo skupino v istem koraku kot njihovo vlečenje, če jih spustite v približno `200ms` po zadnjem premiku, zato jih ena razveljavitev vrne tja, kjer so bile, in v skupine, v katerih so bile. Po daljšem premoru pred spustom je sprememba skupine samostojen korak, prva razveljavitev pa odpravi samo to spremembo.  
Spreminjanje velikosti skupine prek roba ali kota se zabeleži enkrat, ko spustite gumb miške.  
Uporaba [samodejne postavitve](./table-related-functions.md#auto-layout) je en korak, vključno s skupinami, ki jih prilagodi tako, da obdajajo svoje tabele.

Tudi ukaz `Replace All` v [iskanju in zamenjavi](./find-and-replace.md#replacing) je en korak, ne glede na to, koliko imen tabel, imen stolpcev, imen indeksov, imen skupin tabel, komentarjev in beležk spremeni. Kadar ne spremeni ničesar, na primer ko možnost `Preserve Case` vsak zadetek zapiše nazaj takšen, kot je bil, ne zabeleži nobenega koraka.  
En sam ukaz `Replace` je en korak, vključno s pomikom do naslednjega zadetka, kadar ta zadetek pomik potrebuje. Kadar svoj zadetek zapiše nazaj takšen, kot je bil, zabeleži samo ta pomik ali nič, kadar pomika ni.  
Prehod na zadetek pomakne platno samo, kadar zadetek še ni dobro viden – glejte razdelek [Kam pripelje skok](./table-related-functions.md#where-a-jump-lands). Ta pomik se zabeleži kot vsaka druga sprememba položaja pogleda, zato razveljavitev po pomikanju med zadetki najprej odpravi te pomike, po enega na korak.  
Drugi prehodi, ki pristanejo na platnu, zabeležijo svoje pomike na enak način: izbira vrstice v raziskovalcu, rezultata hitrega iskanja ali [gumba na kartici](./visualization.md#card-buttons) z ikono zunanje povezave v načinu Tok. Prehod, ki pusti pogled, kjer je, ne zabeleži ničesar. Tudi izbira vrstice na seznamu okna `Diff Viewer` ne zabeleži ničesar, ker premakne le lastni strani pregledovalnika razlik, ki sta samo za branje.

Tudi neprekinjeno vlečenje, premikanje pogleda platna, povečava, stisk prstov ali sprememba barve se približno `200ms` zbira v medpomnilniku in se zapiše kot en vnos.  
Vlečenje, pri katerem je skupni premik manjši od `20px`, ne zabeleži premika. Zabeleži se samo sprememba skupine, ki jo morebiti povzroči.

Tipkanje v celico ali beležko se beleži po posameznih vnosih, ne po potezah: korak zase je vsak vtipkani znak, vsako lepljenje in vsak korak sestavljanja z vnosno metodo (IME).  
Ime skupine tabel se zabeleži enkrat, ko ga shrani tipka `Enter` ali zapustitev polja, zato je ime, ki ga vnesete v pravkar ustvarjeno skupino, ločen korak od njenega ustvarjanja. Tipka `Esc` ali nespremenjeno ime ne zabeleži ničesar.

## Potovanje skozi čas {#time-travel}

Odpre se z gumbom `Time Travel` v orodni vrstici, ob gumbih za razveljavitev in uveljavitev.  
Gumb ne naredi ničesar, dokler seja nima vsaj ene zabeležene spremembe.

Potovanje skozi čas odpre ločeno kopijo diagrama samo za branje, na položaju pomika in pri stopnji povečave, ki ju prikazuje platno, ne glede na to, ali je zaklep `Viewport` vklopljen.  
Povlecite drsnik ali kliknite kjer koli na njegovem traku, da se pomikate po celotni zgodovini urejanja in si vsako točko ogledate v predogledu. Skrajni levi položaj drsnika je stanje en korak pred prvo zabeleženo spremembo, ob odprtju pa je ročica drsnika na trenutnem stanju.  
Predogled je neinteraktiven: nariše mini zemljevid, vendar v njem ne morete premikati pogleda, se pomikati ali urejati, pravi dokument pa ostane nedotaknjen, dokler izbire ne uporabite.

Pritisnite gumb `Apply`, da obnovite izbrano točko, ali gumb `Cancel` oziroma tipko `Esc`, da dokument pustite nespremenjen.

![Odpiranje potovanja skozi čas, vlečenje drsnika nazaj skozi sejo in uporaba zgodnejše točke](/img/demo-time-travel.webp)
