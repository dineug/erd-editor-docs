---
sidebar_position: 16
description: Sinhronizacija tipa podatkov v relacijah in domene, največja širina komentarja, ponovni izračun širine tabel, zaklepi nastavitev (pogled, zavihek, nastavitve kode in prikaz imen), vrstni red prikaza stolpcev in seznam bližnjic.
---

# Nastavitve

Odprete jih z gumbom `Settings` v orodni vrstici ali iz [hitrega iskanja](./quick-search.md) v podmeniju `Tab`.
Zaslon Nastavitve ima dva zavihka: `Preferences` in `Shortcuts`. Najprej se odpre zavihek `Preferences`, razen ko nastavitve odprete s postavko `Shortcuts` na [pozdravnem zaslonu](./editing-start.md#welcome-screen), ki odpre zavihek `Shortcuts`.

Tema in jezik prikaza nista na tem zaslonu. Odpreta ju gumba `Theme` in `Display Language` v orodni vrstici – glejte stran [Jezik in tema](./language-and-theme.md).

## Sinhronizacija tipa podatkov v relacijah {#relationship-datatype-sync}

Določa, ali se podatkovni tipi sinhronizirajo. Privzeto je vklopljena.
Sprememba podatkovnega tipa stolpca se takrat prenese na vsak stolpec, ki je z njim povezan z relacijo, in sicer po verigi z obeh koncev, tako da tuji ključ nikoli ne odstopa od ključa, na katerega se sklicuje.
Od ključa do njegovih tujih ključev se tip serial prenese kot celoštevilski tip, ki ga hrani, tako kot ob risanju relacije – glejte razdelek [Identifikacijske relacije](./relationship-editing.md#identifying-relationships). Ko torej ključ spremenite v tip `serial`, njegovi tuji ključi pri zbirki podatkov PostgreSQL dobijo tip `integer`, sprememba pa se od tam nadaljuje navzdol po verigi.
Od tujega ključa nazaj do njegovega ključa se tip prenese tako, kot je zapisan, le da ključ serial ohrani svoj tip in se sprememba tam ustavi.
Tej nastavitvi sledi tudi okno [Preslikaj stolpce](./relationship-editing.md#map-columns): dokler je vklopljena, vsak obstoječi stolpec, ki ga okno preslika, prevzame tip, ki ga njegov nadrejeni ključ da tujemu ključu, sprememba pa se nadaljuje po relacijah, kot je opisano zgoraj. Dokler je izklopljena ali če ključ nima podatkovnega tipa, stolpec ohrani svojega.

[Domena](./dictionary.md#domains-and-data-types) svojo vrednost `Data Type` da stolpcem, ki so povezani z njo, in sicer ko se ta tip spremeni in ko se stolpec poveže z njo. Dokler je ta nastavitev vklopljena, se sprememba od vsakega od teh stolpcev nadaljuje po relacijah, kot je opisano zgoraj; dokler je izklopljena, se spremenijo samo povezani stolpci. Stolpec, ki v tem koraku prevzame tip svoje domene, ga ohrani, tudi kadar bi mu sinhronizacija dala drugega, na primer celoštevilski tip, ki ga ključ serial da svojim tujim ključem.
Povezanemu stolpcu, ki mu sinhronizacija ali okno Preslikaj stolpce da tip, drugačen od tipa njegove domene, se v istem koraku prekine povezava s to domeno – glejte razdelek [Prekinitev povezave z domeno](./dictionary.md#unlinking). Nobeno lepljenje stolpcev ne prenese tipa po tej nastavitvi, niti tipa domene, s katero lepljenje poveže stolpce – glejte razdelek [Kopiranje/lepljenje stolpcev](./table-editing.md#copyingpasting-columns). Vrednost `Data Type`, prilepljena na list `Domains` na zavihku Slovar, pa tip prenese, tako kot vsaka sprememba tipa domene.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Nastavitev sinhronizacije tipa podatkov v relacijah" loading="lazy" />

![Sprememba members.id v BIGINT UNSIGNED, ki posodobi vsak member_id, povezan z njim](/img/demo-relationship-data-type-sync.webp)

## Največja širina komentarja {#maximum-comment-width}

Določa največjo širino stolpca komentarja v slikovnih pikah (`60` ~ `200`).
Izklop stikala odstrani omejitev, vnosno polje pa je onemogočeno, dokler je stikalo izklopljeno.
Ob vklopu je začetna vrednost `60px`. Vrednost, vnesena zunaj obsega, se omeji na najbližjo mejo.

![Vklop možnosti Maximum comment width, vnos vrednosti 120 in zavihek ERD s komentarji, skrajšanimi na to širino](/img/demo-settings-comment-width.webp)

## Ponovni izračun širine tabel {#recalculation-table-width}

Pritisnite gumb `Sync`, da se širina vsake tabele in vsake celice stolpca ponovno izračuna tako, da ustreza trenutnemu besedilu, in da se povezovalne črte relacij znova narišejo okoli novih velikosti.
To potrdi pojavno obvestilo `Recalculated table width`.
Širine se samodejno ponovno izračunajo ob vsakem nalaganju dokumenta, zato je to potrebno le, kadar so zaradi spremembe pisave ali izrisovanja zastarele.
Širine se ne shranijo v datoteko, zato je gumb `Sync` nikoli ne spremeni.

## Zaklepanje {#lock}

Seznam `Lock` vsebuje sedem nastavitev. Dokler je zaklep nastavitve vklopljen, datoteka ohrani vrednost, ki jo je imela nastavitev ob zaklepanju, zato njena sprememba na zaslonu pusti datoteko nespremenjeno.

| Vrstica | Kaj ohrani datoteka | V novem diagramu |
| --- | --- | --- |
| `Viewport` | Stopnja povečave in položaj pogleda platna ERD kot en zaklep | `100% · 0, 0` |
| `Canvas Type` | Zavihek, na katerem se odpre diagram: `ERD`, `Visualization`, `Schema SQL`, `Code Generator` ali `Dictionary` | `ERD` |
| `Language` | Jezik [generatorja kode](./code-generator.md#language) | `GraphQL` |
| `Table Name Case` | [Zapis imen tabel](./code-generator.md#name-case) generatorja kode | `Pascal` |
| `Column Name Case` | [Zapis imen stolpcev](./code-generator.md#name-case) generatorja kode | `Camel` |
| `Bracket Type` | Možnost `Bracket` na zavihku [Shema SQL](./schema-sql.md#database-and-bracket) in v ciljih [generatorja kode](./code-generator.md#bracket), ki jo ponujajo | `None` |
| `Name View` | [Prikaz imen](./logical-names.md#name-view), v katerem se odpre diagram: `Physical Names`, `Logical Names` ali `Both Names` | `Physical Names` |

Vsaka vrstica prikazuje vrednost in gumb za zaklep, klik na gumb pa vklopi ali izklopi samo ta zaklep.
Dokler je zaklep vklopljen, gumb prikazuje zaprto ključavnico z opisom orodja `Unlock Viewport` (in podobno za vsako vrstico), vrednost z opisom orodja `Locked value` pa je tista, ki jo ohrani datoteka.
Dokler je izklopljen, gumb prikazuje odprto ključavnico z opisom orodja `Lock Viewport`, zatemnjena vrednost z opisom orodja `Current value` pa je nastavitev, kakršna je zdaj.
Vrstica `Viewport` prikazuje povečavo in nato položaj pogleda, na primer `75% · -40, 91`. Položaj pogleda je točka na zaslonu v slikovnih pikah, kjer leži točka `0, 0` diagrama, koordinata, ki znaša tisoč ali več, pa se skrajša, na primer v `1.2k` ali `-24k`.

Zaklepanje zajame nastavitev, kakršna je v tistem trenutku.
Dokler je zaklep vklopljen, nastavitev na zaslonu še vedno deluje: lahko pomikate in povečujete pogled, preklapljate med zavihki, v menijih, na ploščah z možnostmi ali v hitrem iskanju izbirate drug jezik, zapis imen ali narekovaje ter prikaz imen preklapljate s katerim koli od njegovih izbirnikov – glejte razdelek [Preklapljanje prikaza](./logical-names.md#switching-the-view).
Datoteka vendarle ohrani zaklenjeno vrednost in vrstica jo še naprej prikazuje, zato se diagram znova odpre z zaklenjenim pogledom, na zaklenjenem zavihku, v zaklenjenem prikazu imen ter z zaklenjenim jezikom, zapisoma imen in narekovaji. Tudi izvoz JSON zapiše zaklenjene vrednosti.
Če želite shraniti, kar prikazuje zaslon, izklopite zaklep in datoteka bo od tedaj naprej sledila nastavitvi: ko je zaklep `Viewport` izklopljen, se diagram odpre tam, kjer ste ga pustili. Če pa želite namesto tega zakleniti novo vrednost, na primer nov začetni pogled, zaklep izklopite in znova vklopite.
Če zaklenjeni pogled ob odprtju datoteke ne prikaže nobenega dela diagrama, se zaslon vseeno premakne na diagram, zaklenjena vrednost pa ostane nespremenjena.
Zaklep `Canvas Type` nikoli ne ohrani zavihka Nastavitve. Njegov vklop zaklene zadnji drugi zavihek, na katerem ste bili, dokler pa je izklopljen, njegova vrstica navaja ta zavihek.

![Odklepanje vrstice Viewport, pomikanje in povečevanje diagrama ter ponovno zaklepanje pri novem pogledu, ki ga prikazuje vrstica](/img/demo-settings-locks.webp)

Vklop ali izklop zaklepa spremeni datoteko, saj datoteka shranjuje, kateri zaklepi so vklopljeni, vendar se tako kot preostanek zavihka Nastavitve ne zabeleži v [zgodovino razveljavitev](./undo-redo.md#what-the-history-records). Prav tako se ne zabeleži preklop prikaza imen, ne glede na to, ali je zaklenjen. V urejevalniku samo za branje gumbi za zaklep ne naredijo ničesar, preklop prikaza imen pa spremeni samo ta zaslon, ne glede na njegov zaklep.
Vse druge nastavitve se shranijo takšne, kot so: zbirka podatkov, stikala [`View Option`](./table-related-functions.md#table-view-options) in preostanek zavihka `Preferences`.

V novem diagramu, torej takem, ki ga začnete iz nič, so vklopljeni vsi zaklepi: v prazni datoteki, odprti v VS Code, v aplikaciji Obsidian ali v razvojnem okolju JetBrains (takšno datoteko ustvarita ukaza `ERD Editor: Create new diagram` in `New ERD` v aplikaciji Obsidian), v novi shemi v spletni aplikaciji, v datoteki, ustvarjeni iz menija New v storitvi Google Drive, ali v elementu `<erd-editor>` brez vrednosti.
Z vsemi vklopljenimi zaklepi se začne tudi shema ali datoteka v storitvi Google Drive, ki jo spletna aplikacija ustvari z uvozom datoteke SQL, DBML, AML ali GraphQL. Tista, ki nastane iz datoteke JSON, ohrani zaklepe, ki jih beleži ta datoteka.
Datoteka, ki jo odprete, ohrani zaklepe, s katerimi je bila shranjena, vsakega z njegovo zaklenjeno vrednostjo.
Datoteka, ki ne beleži nobenih zaklepov, na primer datoteka, ki jo je shranila izdaja izpred zaklepov, ali datoteka, napisana ročno, se odpre z vsemi vklopljenimi zaklepi: s pogledom `100% · 0, 0` in zavihkom `ERD`, ne glede na to, kateri pogled in zavihek je shranila, ter z jezikom, zapisoma imen, vrsto narekovajev in prikazom imen, zaklenjenimi tako, kot jih je shranila.
Datoteka, shranjena z izdajo, ki še nima zaklepa prikaza imen, se odpre v prikazu `Physical Names` z zaklenjeno nastavitvijo `Name View`, tudi če so vsi drugi zaklepi, ki jih beleži, izklopljeni.
Tudi ukaz `Import`, ki nadomesti diagram, nastavi zaklepe: datoteka JSON prinese zaklepe, ki jih beleži, in vrednosti, ki jih ti hranijo, datoteka SQL, DBML, AML ali GraphQL pa ohrani vaše zaklepe, vendar pogled vrne na `100% · 0, 0`, ne glede na to, ali je zaklenjen – glejte razdelek [Uvoz zunanjih datotek](./file-import-export.md#importing-external-files). Razveljavitev uvoza povrne zaklepe in zaklenjene vrednosti, ki jih je uvoz nadomestil.

Sprememba, ki jo zaklep zadrži zunaj datoteke, se ne šteje za spremembo. VS Code zavihka ne označi kot spremenjenega, aplikacija Obsidian in razvojno okolje JetBrains pa pustita datoteko nespremenjeno, tako ob samodejnem shranjevanju kot ob zaprtju zavihka.
Ko so vklopljeni vsi zaklepi, se zato ogledovanje diagrama, preklapljanje med zavihki, preizkušanje drugega jezika, zapisa imen ali narekovajev in preklapljanje prikaza imen nikoli ne pokažejo v izpisu `git diff`.
Ko je zaklep `Viewport` izklopljen, pomikanje in povečevanje spremenita datoteko; ko je izklopljen zaklep `Canvas Type`, jo spremeni tudi preklop zavihka, vključno s preklopom na zavihek Nastavitve; ko pa je izklopljen zaklep `Name View`, jo spremeni tudi preklop prikaza imen.
Prazna datoteka novega diagrama ostane prazna do prve spremembe, ki jo datoteka ohrani: urejanja, spremembe nastavitve, ki je ne pokriva noben zaklep, ali vklopa oziroma izklopa zaklepa.
Če diagram odprete in zaprete brez takšne spremembe, datoteka ostane nespremenjena, ne glede na to, s katero izdajo ali na katerem računalniku je bila zapisana. Datoteka vsebuje samo to, kar diagram je, v stalnem vrstnem redu, datoteka, shranjena v starejši obliki, pa se ob prvi takšni spremembi enkrat prepiše v to obliko – glejte razdelek [Oblika za shranjevanje in vrednost med izvajanjem](../../api/advanced/schema.md#storage-form-and-runtime-value).
V VS Code je revizija, ki jo znova odprete kot diagram z ukazom `Reopen Editor With...`, na primer revizija Git ali vnos v Local History, samo za branje in nikoli ni označena kot spremenjena.
V storitvi Google Drive se pomik, povečava ali preklop na drug zavihek nikoli ne shrani sam po sebi, ne glede na to, ali je nastavitev zaklenjena. Ko je zaklep `Viewport` izklopljen, se pogled zapiše le skupaj z drugo spremembo, zato se datoteka v storitvi Drive odpre s pogledom, kakršen je bil ob zadnjem shranjevanju, enako pa velja za zavihek, ko je izklopljen zaklep `Canvas Type`. Preklop prikaza imen, opravljen pri izklopljenem zaklepu `Name View`, se shrani tako kot urejanje, preklop, opravljen pri vklopljenem zaklepu ali v urejevalniku samo za branje, pa se nikoli ne shrani.

V [sodelovalni seji](../../api/advanced/collaborative-editing.md) vklop ali izklop zaklepa doseže vse urejevalnike, zaklep pa ohrani vrednost urejevalnika, ki ga je vklopil.
Izklop zaklepa `Language`, zaklepa zapisa imen, zaklepa `Bracket Type` ali zaklepa `Name View` vsem urejevalnikom dodeli vrednost, prikazano v urejevalniku, ki je zaklep izklopil, tako da vsi shranijo isto vrednost. Izklop zaklepa `Viewport` ali `Canvas Type` nikomur ne premakne pogleda ali zavihka.
Jezik, zapis imen ali narekovaji, ki jih izberete pri vklopljenem zaklepu, še vedno dosežejo vse urejevalnike, prikaz imen pa ima vsak urejevalnik svoj, dokler je zaklep `Name View` vklopljen: preklop se pokaže samo v urejevalniku, v katerem je bil opravljen, vklop zaklepa pa nikomur ne spremeni prikaza. Dokler je zaklep izklopljen, preklop v katerem koli urejevalniku, ki ni samo za branje, preklopi vse urejevalnike.
Agent za kodiranje, ki deluje prek strežnika MCP, nima orodja za zaklepe ali za nastavitve, ki jih ti pokrivajo, pri zaklenjenem jeziku, zapisu imen ali vrsti narekovajev pa prebere vrednost, ki jo ohrani datoteka. Do njih sežejo samo njegovi uvozi v načinu `replace`, tako kot ukaz `Import` – glejte razdelka [Nastavitve](../../mcp/tools.md#settings) in [Uvoz](../../mcp/tools.md#import). Njegovo orodje `erd_list` in oblika `snapshot` orodja `erd_read` prikaz imen izpustita, shemo, vključno z logičnimi imeni, pa ureja ne glede na to, kateri prikaz gleda človek.

## Prilagajanje vrstnega reda stolpcev {#adjusting-column-order}

Nastavi vrstni red prikaza stolpcev v tabelah.
Povlecite vrstico, da jo premaknete – vlečete lahko celotno vrstico, označuje pa jo ikona ročice za vlečenje. Devet vrstic je v privzetem vrstnem redu `Logical Name`, `Name`, `DataType`, `Domain`, `Not Null`, `Unique`, `Auto Increment`, `Default` in `Comment`.
Vrstica `Logical Name` določa mesto celice logičnega imena, ki jo v prikazu `Both Names` izriše vsaka vrstica stolpca. V prikazu `Logical Names` logično ime namesto tega stoji na mestu vrstice `Name`, prikaz `Physical Names` pa ga ne izriše – glejte razdelek [Prikaz imen](./logical-names.md#name-view). Vrstica `Domain` določa mesto celice domene, ki jo prikaže View Option → `Domain` – glejte razdelek [Celica domene](./logical-names.md#the-domain-cell).
Celica, ki jo skrije [možnost pogleda tabel](./table-related-functions.md#table-view-options) ali izpusti prikaz imen, ohrani svoje mesto na seznamu, zato vrstni red velja za tiste celice, ki so prikazane.
Diagram, katerega vrstni red je bil nastavljen, preden sta bili na seznamu vrstici `Logical Name` in `Domain`, dobi vrstico `Logical Name` tik pred vrstico `Name` in vrstico `Domain` tik za vrstico `DataType`, kjer koli že ti dve stojita v njegovem vrstnem redu.
Oznaka [alternativnega ključa](./table-related-functions.md#alternate-keys) (`AK1.1` itd.) ni ena od teh vrstic. Vedno stoji zadnja v vrstici, za celico, ki jo ta vrstni red postavi na konec.

![Pomikanje navzdol do Column Order in vlečenje vrstice Comment navzgor pod Name, kar vsak komentar postavi takoj za ime njegovega stolpca](/img/demo-settings-column-order.webp)

## Bližnjice {#shortcuts}

Zavihek `Shortcuts` je tabela samo za branje s stolpcema `Command` in `Keybinding`, ki navaja dodelitve tipk za platformo, ki jo uporabljate.

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | `T` in nato `G` | `T` in nato `G` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

Večina teh bližnjic deluje samo na zavihku ERD in je onemogočena, dokler je odprto hitro iskanje, okno Lastnosti tabele, pregledovalnik razlik, predogled samodejne postavitve, potovanje skozi čas, pogovorno okno [`Export image`](./file-import-export.md#image) ali okno [`Map Columns`](./relationship-editing.md#map-columns).
Izjeme so `Search`, `Toggle Explorer` in `Stop`: `Search` s katerega koli zavihka preklopi hitro iskanje, `Toggle Explorer` s katerega koli zavihka odpre iskanje v [raziskovalcu](./explorer.md#opening-and-closing) in prikaže zavihek ERD, `Stop` pa je tisti, ki zapre hitro iskanje, okno Lastnosti tabele, pregledovalnik razlik, predogled samodejne postavitve, potovanje skozi čas, pogovorno okno `Export image`, okno `Map Columns`, izbirnik teme, izbirnik `Display Language`, izbirnik barv, seznam, ki ga odpre gumb `Name View`, in odprt priročni meni.
`Toggle Explorer` raziskovalca znova zapre, kadar je odprt na zavihku ERD in ga ne skriva način zen, tako kot gumb `Explorer` v orodni vrstici. Če je odprto hitro iskanje, okno Lastnosti tabele, izbirnik teme, izbirnik `Display Language`, pogovorno okno `Export image` ali okno `Map Columns`, namesto tega zapre to in premakne fokus tipkovnice na iskanje v raziskovalcu.
`Toggle Explorer` ne naredi ničesar, dokler urejate celico, beležko ali ime skupine tabel. Niti ta bližnjica niti `Search` ne naredita ničesar, dokler urejate celico na zavihku [Slovar](./dictionary.md), zato se besedilo, ki ste ga tam vnesli, ohrani. Dokler je odprt pregledovalnik razlik, predogled samodejne postavitve ali potovanje skozi čas, `Toggle Explorer` svojo tipko prepusti brskalniku ali gostitelju – glejte razdelek [Iskalna vrstica brskalnika](./find-and-replace.md#the-browsers-find-bar).
Na zavihku ERD `Stop` konča odprto urejanje celice ali beležke, zapre polje za ime [skupine tabel](./table-groups.md) brez preimenovanja skupine ali prekliče risanje relacije ali skupine `New Table Group` in pusti izbor nespremenjen. Če nič od tega ni odprto, počisti izbor in celico s fokusom ter z istim pritiskom zapre odprt izbirnik barv. Odprt izbirnik teme ali izbirnik `Display Language` se z istim pritiskom zapre v vsakem primeru.
V celici logičnega imena z odprtim seznamom izrazov prvi pritisk bližnjice `Stop` zapre samo seznam – glejte razdelek [Samodokončanje imen izrazov](./logical-names.md#completing-term-names).
Odprt raziskovalec, izbirnik teme ali izbirnik `Display Language` na platnu ne onemogoči nobene bližnjice. `Stop` nikoli ne zapre raziskovalca. Za to, kaj `Stop` in druge tipke naredijo v raziskovalcu, glejte razdelek [Tipke v raziskovalcu](./explorer.md#keys-in-the-explorer), za to, kaj naredijo v izbirniku, pa razdelek [Izbira jezika](./language-and-theme.md#picking-a-language).
`Delete Selection` odstrani vse izbrane tabele, beležke in skupine tabel ali, kadar je izbrana ena sama tabela z nekaterimi svojimi stolpci in je povečava večja od `70%`, te stolpce – glejte razdelek [Brisanje tabel in beležk](./table-related-functions.md#table-and-memo-deletion). `Remove Table, Memo` odstrani tudi izbrane skupine tabel.
Bližnjica `Add Table Group` začne risanje skupine [`New Table Group`](./table-groups.md#drawing-a-group), tako kot gumb `New Table Group` v [orodni vrstici platna](./table-related-functions.md#canvas-toolbar), drugi pritisk pa risanje prekliče. Bližnjica `Group Selected Tables` je zaporedje dveh pritiskov brez modifikatorske tipke, `T` in nato `G` v eni sekundi. Izbrane tabele postavi v novo skupino in odpre njeno polje za ime, tako kot postavka `Group selected tables` v priročnem meniju tabele, in ne naredi ničesar, če ni izbrana nobena tabela – glejte razdelek [Združevanje izbranih tabel v skupino](./table-groups.md#grouping-selected-tables). Nobena od obeh bližnjic ne naredi ničesar v urejevalniku samo za branje ali dokler so skupine [skrite](./table-groups.md#hiding-groups).
`Zoom In`, `Zoom Out` in `Zoom Reset` spreminjajo povečavo tudi na zavihku [Vizualizacija](./visualization.md#toolbar), tako v načinu `Graph` kot v načinu `Flow`, razen če je odprto hitro iskanje.
V načinu `Flow` bližnjici `Undo` in `Redo` naredita korak nazaj in naprej po tem, na kar je bil zožen način Tok, tako kot njegova gumba `Previous table` in `Next table`, razen če je odprto hitro iskanje. Tam diagrama nikoli ne razveljavita, v načinu `Graph` pa ne naredita ničesar – glejte razdelek [Prejšnja in naslednja tabela](./visualization.md#previous-table-and-next-table).
Na zavihku Vizualizacija `Stop` zapre tudi meni [prikaza vrstic](./visualization.md#row-display) in prekliče [razporejanje v načinu Tok](./visualization.md#how-flow-is-placed), ki se še izvaja; pogleda, zoženega z bližnjico `Focus on this table`, ne razširi.
`Focus on this table` odpre zavihek Vizualizacija v načinu `Flow`, zožen na izbrane tabele in vse tabele, oddaljene za eno relacijo, in ne naredi ničesar, če ni izbrana nobena tabela – glejte razdelek [Osredotočanje na tabele](./visualization.md#focusing-on-tables).
Na zavihku Slovar bližnjici `Undo` in `Redo` namesto na zgodovino diagrama delujeta na zgodovino prikazanega lista, na listu `Checks` pa ne naredita ničesar – glejte razdelek [Listi zavihka Slovar](./undo-redo.md#dictionary-sheets). Na listih `Domains`, `Words` in `Terms` bližnjica `Add Column` vstavi vrstice pod izbor, ista kombinacija tipk z dodano tipko `Shift` jih vstavi nad izbor, bližnjica `Remove Column` pa izbriše vrstice, ki jih zajema izbor – glejte razdelek [Dodajanje in brisanje vrstic](./dictionary.md#adding-and-deleting-rows). Za druge tipke na zavihku glejte razdelek [Tipke na zavihku](./dictionary.md#keys-on-the-tab).
`Select All Table, Memo`, `Hand Tool`, `Delete Selection` in `Group Selected Tables` se umaknejo kazalki: dokler urejate celico ali beležko ali tipkate v besedilno polje, kot je iskalno polje raziskovalca, `Ctrl + A` (Windows/Linux) ali `⌘ + A` (Mac) izbere besedilo, `Space` vnese presledek, `Delete` in `Backspace` brišeta besedilo, `T` in nato `G` pa vneseta obe črki.
Kopiranje in lepljenje opravljata lastni bližnjici brskalnika, `Ctrl + C` in `Ctrl + V` (Windows/Linux) ali `⌘ + C` in `⌘ + V` (Mac), zato ju ni na tem seznamu – glejte stran [Urejanje tabel](./table-editing.md).

Dodelitev tipk na tem zavihku ni mogoče spremeniti.
Gostitelj, v katerega je vgrajen urejevalnik, jih znova dodeli z metodo [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), razen ukazov `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` in `Zoom Reset`, ki so nespremenljivi.
Zavihek `Shortcuts` nato navaja dodelitve gostitelja: ukaz, ki ga gostitelj ne dodeli znova, ohrani privzeto dodelitev, ukaz, ki ga gostitelj ne dodeli nobeni tipki, pa ne prikaže nobene.
Tipke za vrstice na zavihku Slovar sledijo ukazoma `Add Column` in `Remove Column`, zato jih ponovna dodelitev katerega koli od obeh premakne – glejte razdelek [`dictionaryRowChords`](../../api/erd-editor-element.md#dictionaryrowchords).

V aplikaciji Obsidian te tipke dosežejo urejevalnik vedno, ko je aktiven zavihek diagrama v aplikaciji Obsidian, tudi kadar isto tipko uporablja bližnjica aplikacije Obsidian, kot so `Alt + Enter`, `Ctrl + K` in `Ctrl + F` (Windows/Linux) ali `⌥ + Enter`, `⌘ + K` in `⌘ + F` (Mac). Enako velja za bližnjico `Alt + Shift + Enter` (Windows/Linux) ali `⌥ + Shift + Enter` (Mac) zavihka Slovar, ki je ni v nobeni vrstici tega seznama. Vse druge bližnjice aplikacije Obsidian tam še vedno delujejo. Za bližnjico `Ctrl + F` ali `⌘ + F` glejte razdelek [Iskalna vrstica brskalnika](./find-and-replace.md#the-browsers-find-bar).
