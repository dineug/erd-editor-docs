---
sidebar_position: 10
description: Raziščite shemo v načinu Graf kot graf, razporejen na osnovi sil, ali v načinu Tok kot kartice tabel – povečujte in premikajte pogled, osvetlite tabele, povezane s posamezno tabelo, in se osredotočite na nekaj tabel hkrati.
---

# Vizualizacija

Prikaže celoten dokument na en pogled, v enem od dveh načinov:

- `Graph`, graf vseh tabel, njihovih stolpcev in relacij med njimi, razporejen na osnovi sil – glejte razdelek [Način Graf](#graph-mode).
- `Flow`, v katerem je vsaka tabela narisana kot kartica in razporejena glede na svoje relacije – glejte razdelek [Način Tok](#flow-mode).

Odprete jo z zavihkom `Visualization` v orodni vrstici na vrhu ali iz [hitrega iskanja](./quick-search.md) v podmeniju `Tab`.  
Na zavihku ERD jo bližnjica `Alt + F` (Windows/Linux) ali `⌥ + F` (Mac) in postavka `Focus on this table` v priročnem meniju tabele odpreta neposredno v načinu `Flow`, s pogledom, zoženim na tabele, ki ste jih izbrali, in na tabele, ki so od njih oddaljene za eno relacijo – glejte razdelek [Osredotočanje na tabele](#focusing-on-tables).

Med načinoma preklopite z gumboma `Graph` in `Flow` na levem koncu [orodne vrstice](#toolbar).  
Na novo odprt urejevalnik se začne v načinu `Graph`. Izbrani način ostane, dokler je urejevalnik odprt, tudi ko obiščete druge zavihke, vendar se ne shrani v dokument.

## Orodna vrstica {#toolbar}

Nad sredino spodnjega roba zavihka lebdi orodna vrstica. Od leve proti desni:

- `Graph` in `Flow`, pri čemer je trenutni način poudarjen.
- `Zoom out`, trenutna povečava v odstotkih, kot je `100%`, in `Zoom in`. Vsak pritisk spremeni povečavo za 4 odstotne točke, sredina zaslona pa ostane na mestu. Odstotek kaže povečavo načina, v katerem ste, klik nanj pa to povečavo ponastavi na `100%`.
- `Fit`, ki pogled prilagodi tako, da je vidno vse, kar način prikazuje: vsako vozlišče v načinu `Graph`, vsaka kartica v načinu `Flow`.
- `Tidy Up`, samo v načinu `Flow`, ki kartice znova razporedi – glejte razdelek [Kako način Tok razporedi kartice](#how-flow-is-placed).
- Meni prikaza vrstic, samo v načinu `Flow`, ki ima za napis trenutno izbiro – glejte razdelek [Prikaz vrstic](#row-display).
- `Show all`, ki znova prikaže celoten diagram, samo v načinu `Flow` in samo, dokler je pogled zožen – glejte razdelek [Osredotočanje na tabele](#focusing-on-tables).
- Kompas `Go to content`, ki se pridruži koncu orodne vrstice samo, dokler na zaslonu ni nobenega vozlišča ali kartice. Prikazuje puščico, ki kaže proti najbližjemu vozlišču ali kartici, in kako daleč je, na primer `1.2k`. Kliknite ga, da to vozlišče ali kartico postavite na sredino zaslona, ne da bi se spremenila povečava.

Gumba za povečavo navajata svoji bližnjici v opisih orodja, na primer `Zoom in (Ctrl + Plus)` (Windows/Linux) ali `Zoom in (⌘ + Plus)` (Mac).  
Bližnjici `Ctrl + Plus` in `Ctrl + Minus` (Windows/Linux) ali `⌘ + Plus` in `⌘ + Minus` (Mac) v obeh načinih spreminjata povečavo po korakih tako kot gumba, bližnjica `Ctrl + 0` (Windows/Linux) ali `⌘ + 0` (Mac) pa jo takoj vrne na `100%`.  
Klik na odstotek naredi isto kot `Ctrl + 0` (Windows/Linux) ali `⌘ + 0` (Mac), odstotek pa to bližnjico navaja v svojem opisu orodja. Bližnjice ne naredijo ničesar, dokler je odprto hitro iskanje.

## Način Graf {#graph-mode}

Celoten dokument nariše kot graf, razporejen na osnovi sil, tako da na en pogled vidite, kako so tabele povezane med seboj in katere so v središču posameznega področja.

![Odpiranje načina Graf, premik kazalca nad tabelo za njen predogled, vlečenje vozlišča ter pomanjšanje in ponovno povečanje](/img/demo-visualization.webp)

### Branje grafa {#reading-the-graph}

Vsaka tabela in vsak stolpec je vozlišče, obe vrsti vozlišč pa sta prikazani v različnih barvah. Beležk in [skupin tabel](./table-groups.md) graf ne riše.  
Vsako vozlišče stolpca je povezano s tabelo, ki ji pripada, dve tabeli, ki ju povezuje relacija, pa sta povezani med seboj.  
Tabele, ki jih povezuje več relacij v isti smeri, so povezane samo enkrat, relacija, ki se začne in konča na isti tabeli, pa ne nariše nobene povezave.

Imena tabel se na grafu prikazujejo med povečevanjem, pri čemer med `50%` in `100%` postopno postajajo vidna, ime, daljše od 15 znakov, pa se odreže. Vozlišča stolpcev nimajo napisa pri nobeni povečavi.

### Premikanje po grafu {#getting-around-the-graph}

Kolesce miške spreminja povečavo okoli točke pod kazalcem, od `10%` do `400%`.  
Stisk prstov na sledilni ploščici spreminja povečavo na enak način, dva prsta na zaslonu na dotik pa spreminjata povečavo okoli točke med njima in premikata pogled, ko se premikata.  
Za premikanje pogleda povlecite ozadje ali pa vlecite s srednjim gumbom miške s katerega koli mesta, tudi z vozlišča, tako kot na [platnu ERD](./table-related-functions.md#getting-around-the-canvas). Vlečenje s srednjim gumbom samo premika pogled: vozlišča nikoli ne povleče.

Gumba za povečavo v [orodni vrstici](#toolbar) in bližnjice za povečavo namesto tega ohranjajo sredino zaslona na mestu, v enakem razponu, gumb `Fit` pa pogled prilagodi tako, da so vidna vsa vozlišča.

### Predogled ob lebdenju {#hover-preview}

Premaknite kazalec nad vozlišče tabele, da se ob kazalcu prikaže predogled te tabele.  
Ko je kazalec nad vozliščem stolpca, se okoli njega nariše le obroč; predogled se ne odpre.

Predogled prikazuje iste stolpce kot platno ERD, v enakem vrstnem redu – glejte razdelka [Možnosti pogleda tabel](./table-related-functions.md#table-view-options) in [Prilagajanje vrstnega reda stolpcev](./settings.md#adjusting-column-order).  
Ko je možnost pogleda `Alternate Key` vklopljena, ima vsak stolpec [alternativnega ključa](./table-related-functions.md#alternate-keys) na koncu svoje vrstice svojo oznako, kot je `AK1.1`, predogled pa se zaradi nje razširi tako kot tabela na platnu ERD.  
Za razliko od tabele na platnu ERD njegova glava nikoli ne prevzame barve [skupine](./table-groups.md#coloring-a-group) tabele.  
Namenjen je samo prikazu in se skrije, medtem ko vlečete vozlišče ali premikate pogled.

### Poudarjanje soseščine {#highlighting-a-neighbourhood}

Ko je kazalec nad tabelo, se osvetli tudi njena soseščina: sama tabela, njeni stolpci, tabele, s katerimi jo njene relacije povezujejo ne glede na smer, in povezave med njimi.  
Vse drugo na grafu se zatemni, tako da to, s čimer je tabela povezana, izstopa samo zase.

### Premikanje vozlišč {#moving-nodes}

Povlecite vozlišče z levim gumbom miške, da njega in vse, kar je povezano z njim, potegnete na nov položaj.  
Vozlišče je pripeto pod kazalcem, dokler ga držite, postavitev okoli njega pa se znova začne prilagajati.  
Ko ga spustite, se znova umiri – nič ne ostane pripeto tam, kamor ste ga spustili.  
Pritisk ali vlečenje z desno tipko miške na vozlišču ga niti ne povleče niti ne premakne pogleda.

### Graf je posnetek stanja {#the-graph-is-a-snapshot}

Graf se zgradi iz dokumenta, kakršen je v trenutku, ko odprete ta zavihek, in se vsakič, ko se vrnete nanj, zgradi povsem na novo.  
Znova ga zgradi tudi preklop iz načina `Flow` v način `Graph`, vsaka ponovna gradnja pa se začne pri `100%`.

## Način Tok {#flow-mode}

Vsako tabelo nariše kot kartico in kartice razporedi glede na njihove relacije. Beležk in [skupin tabel](./table-groups.md) ne riše.  
To ni postavitev `Flow` v [samodejni postavitvi](./table-related-functions.md#auto-layout), ki premika tabele na samem zavihku ERD.

Vsaka kartica se nariše kot tabela na zavihku ERD: barva tabele ob njenem levem robu, pas glave z ikono tabele in imenom tabele ter nato vrstice, ki jih zahteva njen [prikaz vrstic](#row-display). Za razliko od tabele na zavihku ERD kartica med svojimi vrsticami nariše tudi črto, njena glava pa nikoli ne prevzame barve [skupine](./table-groups.md#coloring-a-group) tabele. Kartice ohranijo ta videz pri vsaki povečavi in se nikoli ne strnejo na svoje ime, kot se to zgodi tabelam na zavihku ERD pri `70%` in manj. Na kartici ni mogoče urediti ničesar.

Povezovalna črta je ena gladka krivulja od tabele do tabele, narisana pod karticami, zato lahko poteka za kartico. Rekurzivna relacija se ukrivi okoli zgornjega desnega kota kartice, tako kot na zavihku ERD – glejte razdelek [Usmerjanje povezovalnih črt](./relationship-editing.md#connector-routing). Vsaka povezovalna črta se nariše kot enaka polna siva črta, ne glede na to, ali je relacija identifikacijska ali ne, z enakimi oznakami na koncih kot na zavihku ERD – glejte razdelek [Branje povezovalne črte](./relationship-editing.md#reading-a-connector). Način Tok nariše povezovalne črte tudi, ko je [možnost pogleda](./table-related-functions.md#table-view-options) `Relationship` izklopljena. Nikoli ne nariše oznak `D:` in `U:`, ki označujeta dejanji ON DELETE in ON UPDATE relacije, in ne prikaže opisa orodja, ki ju izpiše v celoti, ne glede na nastavitev možnosti pogleda `Referential Actions`.

V pogledu celotnega diagrama se tabele, ki jih nobena relacija ne povezuje z drugo tabelo, zberejo v en blok, namesto da bi bile razpršene med ostalimi.

![Preklop v način Tok, premik kazalca nad tabelo orders za osvetlitev nje in njenih sosedov, pripenjanje osvetlitve, izbira Keys only, nato povečanje z ⌘ + Wheel in pritisk na Fit](/img/demo-visualization-flow.webp)

### Prikaz vrstic {#row-display}

Meni prikaza vrstic v [orodni vrstici](#toolbar) določa, kolikšen del vsake kartice se nariše. Njegov napis je trenutna izbira, njegov opis orodja pa je na primer `Row display: Name only`.  
Meni se odpre nad orodno vrstico, ob trenutni izbiri pa je kljukica. Zapre se, ko izberete možnost, znova kliknete napis, kliknete kjer koli drugje v urejevalniku, pritisnete `Escape` ali preklopite v način `Graph`.

| Prikaz vrstic | Kaj prikazuje vsaka kartica |
| --- | --- |
| `Name only` | Samo glavo. |
| `Keys only` | Stolpce primarnih in tujih ključev ter vse druge stolpce, na katerih se konča kakšna relacija. |
| `All fields` | Vse stolpce. |

Vrstice si sledijo v vrstnem redu stolpcev tabele. Vsaka vrstica prikazuje ime stolpca, pred katerim je ikona ključa, kadar je stolpec primarni ključ, tuji ključ ali oboje, na desni pa podatkovni tip, ki se prikaže samo, ko je kartica [osvetljena](#lighting-related-tables).  
Nobena druga celica ali oznaka alternativnega ključa se ne nariše, za kartice pa ne veljajo niti [možnosti pogleda tabel](./table-related-functions.md#table-view-options) niti [prilagajanje vrstnega reda stolpcev](./settings.md#adjusting-column-order), ki določa vrstni red celic v vrstici.

Ko se način Tok odpre prvič, se začne z možnostjo `Name only` ali z možnostjo `Keys only`, če ga je odprlo [osredotočanje na tabele](#focusing-on-tables). Nato se prikaz vrstic spremeni samo, ko izberete drugo možnost, zoževanje ali razširjanje pogleda pa ga ohrani.  
Sprememba prikaza vrstic spremeni velikost kartic, zato jih način Tok znova razporedi in prilagodi zaslonu.

### Premikanje v načinu Tok {#getting-around-the-flow}

Kolesce miške premika pogled, `Shift + Wheel` pa ga premika vodoravno. Bližnjica `Ctrl + Wheel` (Windows/Linux) ali `⌘ + Wheel` (Mac) spreminja povečavo, sredina zaslona pa ostane na mestu.  
Stisk prstov na sledilni ploščici spreminja povečavo okoli točke, kjer stisnete prste, dva prsta na zaslonu na dotik pa spreminjata povečavo okoli točke med njima in premikata pogled, ko se premikata.  
Za premikanje pogleda povlecite ozadje ali pa vlecite s srednjim gumbom miške s katerega koli mesta, tudi s kartice. Vlečenje s srednjim gumbom samo premika pogled, izbor pa pusti nespremenjen. Premikanje pogleda nima meja, tako kot na [platnu ERD](./table-related-functions.md#getting-around-the-canvas).  
Povečava sega od `10%` do `150%`. Način Tok ima svojo povečavo in svoj položaj pogleda, ločena od tistih na zavihku ERD, in ne eno ne drugo se ne shrani v dokument.

Pritisk na ozadje počisti izbor, `Ctrl + drag` (Windows/Linux) ali `⌘ + drag` (Mac) na ozadju pa nariše okvir izbora.  
Način Tok nima mini zemljevida in nima drsnih trakov. Ko po premiku pogleda na zaslonu ne ostane nobena kartica, uporabite kompas `Go to content` v [orodni vrstici](#toolbar).

### Osvetljevanje povezanih tabel {#lighting-related-tables}

Premaknite kazalec nad kartico, da osvetlite njo, tabele, ki so od nje oddaljene za eno relacijo, in povezovalne črte, ki jo povezujejo s temi tabelami. Povezovalna črta med dvema od teh tabel ostane neosvetljena.  
Osvetljena kartica dobi obrobo in sij v barvi poudarka, njeni podatkovni tipi postopno postanejo vidni, njene vrstice, na katerih se konča relacija, pa se rahlo obarvajo. Osvetljena povezovalna črta se obarva v barvo poudarka.  
Za razliko od [načina Graf](#highlighting-a-neighbourhood) se nič drugega ne zatemni in nič ni osvetljeno, dokler kazalec ni nad nobeno kartico in nobena kartica ni pripeta.

Kliknite kartico, da pripnete njeno osvetlitev, tako da ostane osvetljena tudi, ko kazalec odide drugam. Za sprostitev znova kliknite isto kartico ali kliknite ozadje; klik na drugo kartico pa prenese pripetje nanjo. Kartica pod kazalcem in pripeta kartica se osvetlita skupaj.  
Vlečenje, `Ctrl + click` (Windows/Linux) ali `⌘ + click` (Mac), premikanje pogleda in [gumbi na kartici](#card-buttons) kartice niti ne pripnejo niti ne sprostijo.

Po vsaki osvetljeni povezovalni črti tečejo delci, od konca pri nadrejeni tabeli, kjer je primarni ključ, do konca pri podrejeni tabeli. Ko je hkrati osvetljenih več kot 60 povezovalnih črt, se delci ustavijo, osvetlitev pa ostane.

### Gumbi na karticah {#card-buttons}

Ko je kazalec nad kartico, se na desnem koncu njene glave prikažeta dva gumba z ikonama, ki nimata opisa orodja:

- Ikona točk poti, enaka tisti na gumbu `Flow`, zoži način Tok na to tabelo in tabele, ki so od nje oddaljene za eno relacijo – glejte razdelek [Osredotočanje na tabele](#focusing-on-tables).
- Ikona zunanje povezave preklopi na zavihek ERD, izbere samo to tabelo, jo postavi v ospredje in premakne fokus na celico z njenim imenom, razen če ima fokus že kakšna celica te tabele. Platno se do tabele pomakne samo, če ta še ni dobro vidna – glejte razdelek [Kam pripelje skok](./table-related-functions.md#where-a-jump-lands). Risanja relacije nikoli niti ne začne niti ne konča.

Pritisk na katerega koli od obeh gumbov velja samo za ta gumb: za razliko od pritiska drugje na kartici kartice ne izbere in je ne postavi v ospredje. Gumb z ikono točk poti zato ohrani izbor, ki ste ga imeli; gumb z ikono zunanje povezave izbere tabelo samo kot del preklopa na zavihek ERD. Oba gumba se odzivata samo na klik z levim gumbom miške.

### Premikanje kartic {#moving-cards}

Kartico povlecite z levim gumbom miške za kateri koli njen del razen obeh gumbov na kartici; vlečenje z desno tipko miške ne premakne ničesar.  
Pritisk na kartico jo izbere, `Ctrl + click` (Windows/Linux) ali `⌘ + click` (Mac) jo doda izboru, vlečenje izbrane kartice pa premakne vse izbrane kartice. To je isti izbor, ki ga uporablja zavihek ERD, zato je tisto, kar izberete tukaj, izbrano tudi, ko se vrnete.

Kartica se premakne samo v načinu Tok: njena tabela na zavihku ERD ostane, kjer je.  
Premaknjena kartica ostane na mestu ob premikanju pogleda, spreminjanju povečave in uporabi gumba `Fit`. Na mesto, kamor jo je razporedila postavitev, se vrne, ko zapustite zavihek ali preklopite v način `Graph` in se vrnete, ter ko gumb `Show all` preklopi nazaj na postavitev celotnega diagrama, ki jo način Tok že ima. Nova postavitev jo znova razporedi in pri tem upošteva, kam ste jo pustili – glejte razdelek [Kako način Tok razporedi kartice](#how-flow-is-placed).

### Osredotočanje na tabele {#focusing-on-tables}

Na zavihku ERD izberite eno ali več tabel in pritisnite `Alt + F` (Windows/Linux) ali `⌥ + F` (Mac) ali pa kliknite tabelo z desno tipko miške in izberite `Focus on this table`.  
Zavihek Vizualizacija se odpre v načinu `Flow`, s pogledom, zoženim na te tabele in na vse tabele, ki so od katere koli od njih oddaljene za eno relacijo, ne glede na smer. Narišejo se samo povezovalne črte med prikazanimi tabelami.

Ko je tabela, ki jo kliknete z desno tipko miške, ena od več izbranih tabel, se postavka glasi `Focus on selected tables` in pogled osredotoči na celoten izbor. Klik z desno tipko miške na tabelo zunaj izbora osredotoči pogled samo na to tabelo.  
Bližnjica `Alt + F` upošteva izbrane tabele, beležke in [skupine tabel](./table-groups.md) pa izpusti. Če ni izbrana nobena tabela, ne naredi ničesar, tudi če je izbrana skupina: najprej izberite `Select tables` v priročnem meniju skupine – glejte razdelek [Izbiranje skupin](./table-groups.md#selecting-groups).  
Ne deluje, medtem ko se ureja celica, beležka ali ime skupine, medtem ko je tipkovnica v [raziskovalcu](./explorer.md#keys-in-the-explorer) ali medtem ko je odprto hitro iskanje, okno Lastnosti tabele, pregledovalnik razlik, predogled samodejne postavitve, potovanje skozi čas, pogovorno okno [`Export image`](./file-import-export.md#image) ali okno [`Map Columns`](./relationship-editing.md#map-columns).

V načinu Tok [gumb na kartici](#card-buttons) z ikono točk poti na enak način zoži pogled, in sicer na to eno tabelo. Gumb `Show all` v [orodni vrstici](#toolbar) znova prikaže celoten diagram.  
Zoženi pogled se razporedi ločeno in prilagodi zaslonu. Ostane zožen, ko zapustite zavihek ali preklopite v način `Graph` in se vrnete, tipka `Escape` pa ga ne razširi.

![Osredotočanje na tabelo orders z ⌥ + F, zoženje na tabelo members z gumbom točk poti na njeni kartici, nato Show all](/img/demo-visualization-focus.webp)

### Kako način Tok razporedi kartice {#how-flow-is-placed}

Ko se način `Flow` prvič prikaže, se tabele, ki jih prikazuje, razporedijo zunaj glavne niti, rezultat pa se prilagodi zaslonu.  
Postavitev se ohrani, dokler je urejevalnik odprt. Če zapustite zavihek ali preklopite v način `Graph` in se vrnete, jo način Tok uporabi znova, povečava in položaj pogleda pa sta takšna, kot ste ju pustili.  
Način Tok hrani eno postavitev za celoten diagram in eno za zoženi pogled, zato se gumb `Show all` vrne na postavitev celotnega diagrama in jo prilagodi zaslonu, ne da bi jo znova izračunal, če se ni spremenilo nič od tistega, iz česar je ta postavitev nastala.

Način Tok kartice znova razporedi, ko:

- pritisnete gumb `Tidy Up`. Rezultat se prilagodi zaslonu.
- spremenite prikaz vrstic ali zožite pogled na druge tabele. Rezultat se prilagodi zaslonu.
- se dodajo ali odstranijo tabele ali relacije – na zavihku ERD, medtem ko ste drugje, kar način Tok upošteva ob vaši vrnitvi, ali pa to stori sodelavec, medtem ko ste v načinu Tok. Povečava in položaj pogleda ostaneta, kjer sta.

Vsaka postavitev upošteva, kje so kartice trenutno, zato gumb `Tidy Up` ne povrne nujno prejšnje razporeditve.  
Sprememba, ki samo spremeni velikost kartice, kot je preimenovanje tabele ali dodajanje stolpca, kartic ne razporedi znova. Če se kartice na koncu prekrivajo, pritisnite `Tidy Up`.

Postavitev, ki traja dlje kot 6 sekund, prikaže obvestilo `Placing tables` z vrtečim se indikatorjem nalaganja in gumbom `Cancel`.  
Gumb `Cancel` ali tipka `Escape`, pritisnjena kadar koli med izvajanjem postavitve, jo prekliče; gumb `Tidy Up` ali vrnitev v način `Flow` jo znova zahteva.  
Če postavitev ne uspe – gostitelj ne poganja nobene delovne niti shared worker, delovna nit se ne zažene ali se v 60 sekundah ne vrne nobena postavitev –, način Tok prikaže obvestilo `Could not place tables` z opozorilnim znakom, gumb `Tidy Up` pa poskusi znova. Glejte razdelek [Web Workers](../../api/installation.md#web-workers).  
Način Tok nariše samo tabele, ki jih je razporedila njegova zadnja postavitev, tako v pogledu celotnega diagrama kot v zoženem pogledu, zato ob prvem prikazu morda ne bo nobene kartice, dokler postavitev ne uspe.  
Kadar koli način Tok kartice znova razporedi, na primer takrat, ko zožite pogled na druge tabele, prejšnja razporeditev ostane na zaslonu, dokler ne prispe nova postavitev, in tam ostane tudi, če se ta postavitev prekliče ali ne uspe.

Ko se zamenja celoten dokument, na primer z uvozom datoteke, se postavitve, osredotočitev, prikaz vrstic, povečava in položaj pogleda načina Tok zavržejo, ob naslednjem odprtju pa način Tok začne znova tako kot prvič: s celotnim diagramom ali z zoženim pogledom, če ga odprete z [osredotočanjem na tabele](#focusing-on-tables).

### Način Tok nikoli ne ureja dokumenta {#flow-never-edits-the-document}

Način Tok diagram samo bere. Spreminjanje povečave, premikanje pogleda, premikanje kartic, `Tidy Up`, prikaz vrstic, pripetja in osredotočanje ne dodajo ničesar v [zgodovino razveljavitev](./undo-redo.md#what-the-history-records).  
Tudi v diagramu ne spremenijo ničesar. Pritisk na kartico sicer postavi njeno tabelo v ospredje, tako kot klik na tabelo na zavihku ERD, zato je ta tudi tam v ospredju, vendar se vrstni red prekrivanja ne shrani – glejte razdelek [Premikanje več tabel](./table-related-functions.md#moving-multiple-tables). Način `Graph` na enak način pusti diagram nedotaknjen.  
Pritisk na kartico nikoli ne doda relacije. Če ste zavihek ERD zapustili med risanjem relacije, pritisk na kartico njeno tabelo izbere za začetno, kadar začetna tabela še ni izbrana, sicer pa risanje konča.  
[Gumb na kartici](#card-buttons) z ikono zunanje povezave gre dlje, ker vas odpelje iz načina Tok: kadar se mora zavihek ERD pomakniti do tabele, se to pomikanje zabeleži kot vsaka druga sprememba položaja pogleda.

Spremembe sodelavcev dosežejo diagram tudi, medtem ko ste v načinu Tok, kartice pa sledijo tabelam in relacijam, ki jih dodajo ali odstranijo – glejte razdelek [Kako način Tok razporedi kartice](#how-flow-is-placed).  
Njihovi obroči izbora in fokusa se narišejo na karticah, njihovi kazalci in okvirji vlečenja pa ne – glejte stran [Sodelovalno urejanje](../../api/advanced/collaborative-editing.md).

Oba načina, vključno z osredotočanjem, delujeta tudi v urejevalniku z lastnostjo `readonly`.
