---
sidebar_position: 4
description: Dați tabelelor și coloanelor nume logice, afișați numele fizice, numele logice sau ambele cu modul de afișare a numelor, completați numele termenilor în timp ce tastați, legați coloanele de domenii și aflați unde altundeva numele urmează modul de afișare.
---

# Nume logice

Un tabel și fiecare dintre coloanele sale pot avea, alături de nume, un nume logic. Numele logic este cel pe care îl citesc oamenii, de exemplu `Customer Name` pentru `CUST_NM`. Numele propriu-zis este numele fizic, cel pe care îl scriu fila [Schemă SQL](./schema-sql.md) și [generatorul de cod](./code-generator.md).  
Modul de afișare a numelor stabilește ce desenează pânza ERD dintre cele două: numele, numele logice sau ambele (consultați [Afișare nume](#name-view)).  
Un nume logic poate da și tabelului sau coloanei sale un nume fizic, derivat din cuvintele și termenii din fila [Dicționar](./dictionary.md) (consultați [Derivarea numelor fizice](./dictionary.md#deriving-physical-names)).  
O coloană poate fi legată de un domeniu, adică un tip de date cu nume păstrat în foaia `Domains` din fila Dicționar, de exemplu `Name` pentru `VARCHAR(100)`, și atunci are tipul de date al domeniului (consultați [Celula Domeniu](#the-domain-cell)).  
Fila Schemă SQL poate scrie fiecare nume logic într-un comentariu gol (consultați [Nume logice drept comentarii](./schema-sql.md#logical-names-as-comments)).

## Afișare nume {#name-view}

Există trei moduri de afișare și fiecare desenează în felul său antetul și rândurile unui tabel:

- Modul `Physical Names`, cel al unei diagrame noi, nu desenează niciun nume logic. Antetul afișează numele tabelului și, cât timp opțiunea View Option → `Table Comment` este activată, comentariul acestuia, iar fiecare rând își afișează celulele în [ordinea coloanelor](./settings.md#adjusting-column-order).
- Modul `Logical Names` desenează numele logic în locul fiecărui nume: în antet și, în fiecare rând, acolo unde se află `Name` în ordinea coloanelor. Celula tipului dintr-un rând poate reprezenta domeniul coloanei, așa cum se descrie mai jos.
- Modul `Both Names` desenează numele logic alături de nume. Antetul afișează numele logic, apoi numele, apoi comentariul, iar fiecare rând primește o celulă `Logical Name`, pe care ordinea coloanelor o plasează implicit chiar înainte de `Name`.

Un nume logic necompletat, inclusiv unul format doar din spații, afișează un înlocuitor estompat. În modul `Logical Names`, acesta este numele desenat în locul lui sau, când și numele este necompletat, textul substituent `table` sau `column`. În modul `Both Names`, acesta este textul substituent `logical`.

În modul `Logical Names`, o coloană legată de un domeniu cu nume din foaia `Domains` din fila Dicționar afișează în celula tipului numele acelui domeniu în locul tipului de date. Orice altă coloană își afișează acolo tipul de date.  
Cât timp opțiunea View Option → `Domain` este activată, domeniul are o celulă proprie, iar celula tipului păstrează tipul de date, așa că niciun rând nu afișează domeniul de două ori (consultați [Celula Domeniu](#the-domain-cell)).

Fiecare tabel este atât de lat cât o cer celulele pe care le desenează în modul de afișare, așa că o schimbare a modului de afișare redimensionează tabelele și le aranjează din nou conectorii. Niciun tabel nu se mută.  
La un zoom de `70%` sau mai mic, un tabel se restrânge la nume (consultați [Mărire/micșorare](./table-related-functions.md#zoom-inout)). În modul `Logical Names`, tabelul afișează numele logic sau, cât timp acesta lipsește, numele, estompat. În modul `Both Names`, afișează numele logic, cu numele pe o linie sub el, sau doar numele, cât timp nu există un nume logic.

Verificările dicționarelor pot scrie cu roșu sau chihlimbariu un nume logic sau un nume acolo unde îl semnalează (consultați [Marcaje pe pânză](./dictionary.md#marks-on-the-canvas)).

## Schimbarea modului de afișare {#switching-the-view}

Modul de afișare se schimbă din patru locuri, iar fiecare listează `Physical Names`, `Logical Names` și `Both Names`, cu modul activ bifat:

- Butonul `Name View` din [bara de instrumente a pânzei](./table-related-functions.md#canvas-toolbar), între cele patru notații de relație și modul Zen. Butonul afișează numele modului activ, cu o săgeată în jos, iar sfatul său ecran este `Name View`. Un clic deschide lista deasupra barei de instrumente, iar o alegere o închide.
- Elementul `Name View` din meniul contextual al pânzei, imediat după `View Option`: un submeniu cu cele trei moduri de afișare. Meniul rămâne deschis după o alegere.
- Aceeași listă în bara de instrumente a filei Vizualizare, în modul `Flow`, după meniul de afișare a rândurilor (consultați [Bara de instrumente](./visualization.md#toolbar)).
- Comanda `Name View` din [căutarea rapidă](./quick-search.md#what-the-palette-lists), imediat după `Tab`, listată doar în fila ERD. Submeniul ei se deschide cu evidențierea pe modul activ.

![Schimbarea modului de afișare a numelor la Logical Names din bara de instrumente a pânzei, la Both Names din meniul pânzei și înapoi la Physical Names, cu ordered_at, care nu are nume logic, estompat și apoi afișat ca text substituent logical](/img/demo-name-view.webp)

Toate patru setează același mod de afișare. Bara de instrumente de sus nu are niciun buton pentru acesta.

O schimbare a modului de afișare păstrează selecția și nu se înregistrează în [istoricul anulărilor](./undo-redo.md#what-the-history-records).  
Când noul mod de afișare nu desenează celula activă, focusul trece la celula desenată în locul ei: numele și numele logic își țin locul unul altuia, la fel ca tipul și domeniul. Un editor de celulă deschis pe acea celulă se închide. Activarea sau dezactivarea opțiunii View Option → `Domain` mută focusul în același fel.  
Cât timp blocarea `Name View` este activată, cum este într-o diagramă nouă, o schimbare modifică doar ecranul dumneavoastră, iar fișierul păstrează modul de afișare la care a fost blocat. Cu blocarea dezactivată, fișierul salvează modul de afișare la care treceți (consultați [Blocare](./settings.md#lock)).

## Scrierea unui nume logic {#writing-a-logical-name}

Modul `Physical Names` nu desenează niciun nume logic, așa că treceți la modul `Logical Names` sau `Both Names` pentru a scrie unul pe pânză:

- În modul `Logical Names`, celulele numelui din antet și din rânduri conțin numele logice, așa că în acest mod de afișare un nume fizic nu poate fi editat pe pânză.
- În modul `Both Names`, celulele numelui logic conțin numele logice, iar celulele numelui, numele fizice.

Celula numelui logic se editează ca orice altă celulă: începeți cu `Enter` sau cu un dublu clic (consultați [Editarea tabelelor](./table-editing.md)). Deschis pe un nume logic necompletat, editorul afișează ca text substituent ceea ce desena celula: numele în modul `Logical Names`, `logical` în modul `Both Names`.  
Tastarea scrie doar numele logic. Numele fizic se derivă din acesta după ce editorul se închide (`Enter`, `Tab`, `Escape` sau un clic în altă parte) pe un nume logic modificat, ca un pas de anulare separat, după tastare. Un nume fizic scris de dumneavoastră rămâne așa cum este (consultați [Derivarea numelor fizice](./dictionary.md#deriving-physical-names)).

`Tab` și `Shift + Tab` parcurg, în ordine, celulele pe care le desenează modul de afișare (consultați [Tasta Tab](./table-editing.md#tab-key)):

- În modul `Logical Names`, numele logic din antet, apoi comentariul acestuia, apoi celulele fiecărui rând în ordinea coloanelor, cu numele logic în locul numelui.
- În modul `Both Names`, numele logic, numele și comentariul din antet, apoi celulele fiecărui rând în ordinea coloanelor, implicit cu celula `Logical Name` prima.

`Alt + Enter` (Windows/Linux) sau `⌥ + Enter` (Mac) adaugă o coloană și mută focusul pe celula numelui acesteia, care în modul `Logical Names` este numele logic.

O coloană cheie străină adăugată de o relație copiază numele logic și domeniul cheii, împreună cu tipul acesteia (consultați [Relații identificatoare](./relationship-editing.md#identifying-relationships)).  
Copierea coloanelor într-o foaie de calcul și lipirea coloanelor dintr-una folosesc celulele pe care le desenează modul de afișare, inclusiv celulele numelui logic și celulele Domeniu (consultați [Copierea/lipirea coloanelor](./table-editing.md#copyingpasting-columns)).

## Completarea numelor de termeni {#completing-term-names}

Cât timp tastați într-o celulă a numelui logic, din antet sau dintr-un rând, o listă de sub celulă oferă termenii ale căror nume încep cu textul, indiferent de majuscule și de spațiile dinaintea lui. Un termen este un nume logic întreg păstrat în foaia `Terms` din fila Dicționar, împreună cu numele fizic și domeniul pe care le dă. Lista afișează cel mult opt termeni, sortați după nume, cu textul tastat evidențiat. Nu apare nicio listă cât timp niciun termen nu începe astfel.

![Adăugarea unei coloane cu ⌥ + Enter în Both Names, alegerea termenului Order Amount din lista termenilor de sub numele logic pentru a completa ORD_AMT, DECIMAL(10,2) și domeniul Amount, apoi tastarea Order Date, al cărui nume ORD_DT îl dau cuvintele când Enter închide editorul](/img/demo-logical-names.webp)

- La început nu este evidențiat nimic. `↑` și `↓` mută evidențierea, reluând de la capăt la ambele extremități, iar termenul evidențiat afișează tasta `Enter`.
- `Enter` pe un termen evidențiat scrie numele acestuia ca nume logic și încheie editarea. Dacă numele fizic nu este unul scris de dumneavoastră, același pas de anulare derivă imediat numele fizic din termen și îi dă unei coloane și domeniul termenului. `Enter` fără nimic evidențiat încheie editarea și păstrează ce ați tastat.
- Un clic pe un termen îl scrie în același fel și lasă editorul deschis.
- `Escape`, cât timp lista este afișată, închide doar lista, iar următoarea apăsare pe `Escape` încheie editarea.
- `Tab` trece mai departe cu textul așa cum a fost tastat, iar numele fizic se derivă din acesta la închiderea editorului.
- Cât timp metoda de introducere (IME) compune textul, săgețile și `Enter` aparțin compunerii.

Ce dă un termen unui tabel sau unei coloane este descris în [Derivarea numelor fizice](./dictionary.md#deriving-physical-names).

## Celula Domeniu {#the-domain-cell}

Opțiunea View Option → `Domain`, dezactivată implicit, dă fiecărui rând, în orice mod de afișare, o celulă Domeniu, acolo unde se află `Domain` în ordinea coloanelor, implicit imediat după `DataType` (consultați [Opțiuni de afișare a tabelelor](./table-related-functions.md#table-view-options)).  
Celula afișează numele domeniului de care este legată coloana sau, pentru o coloană nelegată de niciun domeniu listat în foaia `Domains`, textul substituent `domain`, estompat.

![Activarea View Option → Domain, alegerea Amount în celula Domain a coloanei PAY_AMT după restrângerea listei cu amo, schimbarea valorii Data Type a domeniului Amount în DECIMAL(12,2) în fila Dicționar și constatarea că și coloana s-a schimbat odată cu aceasta, apoi tastarea NUMERIC(12,2) în coloană, ceea ce elimină legătura cu domeniul](/img/demo-domains.webp)

`Enter` sau un dublu clic deschide peste celulă un selector: un câmp gol, cu textul celulei ca text substituent, iar sub el `None`, apoi fiecare domeniu cu nume din foaia `Domains`, în ordinea din foaie. Evidențierea pornește de pe domeniul legat sau de pe `None`.

- Tastarea listează doar domeniile ale căror nume conțin textul, indiferent de majuscule, elimină `None` și îl evidențiază pe primul. `↑` și `↓` mută evidențierea.
- `Enter` leagă domeniul evidențiat, iar un clic îl leagă pe cel pe care faceți clic. Oricare dintre ele dă coloanei tipul de date al domeniului, ca un singur pas de anulare, și încheie editarea. `None` elimină legătura coloanei cu domeniul și păstrează tipul ei de date.
- Ce tastați nu se scrie niciodată în coloană. Cât timp foaia `Domains` nu are niciun domeniu cu nume, nu apare nicio listă, iar `Enter` încheie editarea fără să scrie nimic.

În modul `Logical Names`, cu opțiunea View Option → `Domain` dezactivată, o celulă a tipului care afișează numele unui domeniu deschide acest selector, iar una care afișează un tip de date deschide editorul tipului de date (consultați [Completarea automată a tipului de date](./table-editing.md#datatype-autocomplete)). Pentru a lega un domeniu de o coloană care nu are niciunul, activați celula Domeniu.  
O coloană legată are tipul de date al domeniului său și îl urmează când tipul domeniului se schimbă, iar tastarea altui tip în celula Tip de date elimină legătura (consultați [Domenii și tipuri de date](./dictionary.md#domains-and-data-types)).

## Dincolo de pânză {#beyond-the-canvas}

Majoritatea celorlalte locuri care numesc un tabel sau o coloană urmează și ele modul de afișare a numelor:

- Modul `Physical Names` afișează numele.
- Modul `Logical Names` afișează numele logic sau, cât timp numele logic este necompletat, numele, estompat acolo unde locul respectiv îl poate estompa.
- Modul `Both Names` afișează numele logic urmat de nume: atenuat într-un rând de text, pe o a doua linie într-o etichetă din graf și între paranteze acolo unde un singur text trebuie să le conțină pe amândouă, de exemplu `Member (member)`. Un tabel sau o coloană fără nume logic își afișează doar numele.

O listă sortată după nume, de exemplu tabelele din explorator sau rândurile `#` din căutarea rapidă, rămâne sortată după nume în orice mod de afișare, niciodată după numele logic.

Locurile care urmează modul de afișare:

- În fila Vizualizare, cardurile din modul Flux (consultați [Numele de pe carduri](./visualization.md#names-on-the-cards)), precum și etichetele și previzualizarea la trecerea indicatorului din modul Graf (consultați [Citirea grafului](./visualization.md#reading-the-graph) și [Previzualizare la trecerea indicatorului](./visualization.md#hover-preview)).
- Panoul [Proprietăți tabel](./table-related-functions.md#table-properties): etichetele sale, iar în fila `Indexes`, rândurile `Columns` și lista `Index order` (consultați [Indexuri](./table-related-functions.md#indexes)).
- Rândurile tabelelor și ale coloanelor din [explorator](./explorer.md#the-tree), precum și tabelele listate sub fiecare grup de tabele.
- Rândurile `#` din căutarea rapidă (consultați [Căutarea în diagramă](./quick-search.md#searching-the-diagram)).
- Arborele modificărilor din [vizualizatorul de diferențe](./table-related-functions.md#diff-viewer) și ambele sale părți.
- Caseta de dialog [Mapare coloane](./relationship-editing.md#map-columns), precum și sfatul ecran `<parent> has no primary key to copy` pe care îl poate afișa butonul `Create new columns` în timp ce se trasează o relație (consultați [Crearea relațiilor](./editing-start.md#relationship-creation)).
- Copia rândurilor pe care o poartă glisarea unei coloane peste o zonă goală a pânzei, care afișează celulele numelui și tipului fiecărui rând așa cum le desenează rândul (consultați [Reordonarea și mutarea coloanelor](./table-editing.md#rearranging-and-moving-columns)).
- Coloana `Target` din foaia `Checks` din fila Dicționar (consultați [Foaia Verificări](./dictionary.md#the-checks-sheet)).
- O [imagine exportată](./file-import-export.md#image).

Câteva locuri păstrează numele indiferent de modul de afișare: rândurile indexurilor și ale cheilor străine din explorator, secțiunea `Keys` din fila `Indexes` a panoului Proprietăți tabel, eticheta `New column: <name>` din caseta de dialog Mapare coloane și locul scris alături de un rând `@` sau `:` din căutarea rapidă.

Vizualizatorul de diferențe, [călătoria în timp](./undo-redo.md#time-travel), previzualizarea `Force` a [aranjării automate](./table-related-functions.md#auto-layout) și caseta de dialog `Export image` se deschid în modul de afișare a numelor pe care îl vedeți, indiferent de modul pe care îl păstrează fișierul. Fiecare păstrează acel mod de afișare cât timp este deschis.  
Orice aranjare automată, precum și un import Schemă SQL, GraphQL, DBML sau AML prin `Import` sau `Import and Add`, plasează tabelele la lățimile pe care le au în modul dumneavoastră de afișare.

## Căutarea după numele logic {#finding-by-logical-name}

Numele logice se găsesc în orice mod de afișare, inclusiv în modul `Physical Names`, în care pânza nu desenează niciunul:

- Funcția [Găsire și înlocuire](./find-and-replace.md#what-it-searches) le caută ca pe un tip de text aparte, `Logical names`, atât pentru tabele, cât și pentru coloane, iar acesta este activat la prima deschidere a căutării. Înlocuirea unui nume logic derivă din el numele fizic, la fel ca scrierea unuia.
- În [căutarea rapidă](./quick-search.md#searching-the-diagram), `#` găsește un tabel după nume sau după numele logic, iar `@` găsește o coloană după oricare dintre ele, o potrivire în numele logic afișând alături `Logical name`. Partea de tabel a prefixului `@`, dinaintea caracterului `.`, se potrivește și ea cu numele sau cu numele logic al unui tabel.

Schimbarea modului de afișare a numelor modifică felul în care sunt numite rezultatele, niciodată ce se găsește.

## Colaboratori {#collaborators}

Într-o [sesiune colaborativă](../../api/advanced/collaborative-editing.md), numele logice și legăturile cu domeniile ajung la fiecare editor ca orice altă editare.  
Cât timp blocarea `Name View` este activată, fiecare editor își păstrează propriul mod de afișare, iar o schimbare apare doar în editorul care a făcut-o. Cât timp este dezactivată, o schimbare în orice editor care nu este doar în citire schimbă modul de afișare în toate editoarele (consultați [Blocare](./settings.md#lock), unde se descrie și ce face activarea sau dezactivarea blocării cu modul de afișare al fiecărui editor).  
Când celula activă a unui participant este una pe care modul dumneavoastră de afișare nu o desenează, culoarea lui apare pe celula pe care modul dumneavoastră o desenează în locul ei: o celulă a numelui în modul `Physical Names` apare pe celula numelui logic în modul `Logical Names` și invers, iar o celulă a tipului și domeniul care îi ține locul se corespund în același fel.

Un agent de programare care lucrează prin serverul MCP setează nume logice și leagă domenii indiferent de modul de afișare pe care îl vedeți și nu are niciun instrument care să schimbe modul de afișare a numelor (consultați [Dicționare](../../mcp/tools.md#dictionaries) și [Setări](../../mcp/tools.md#settings)).

## Editoare doar în citire {#read-only-editors}

Într-un editor [`readonly`](../../api/erd-editor-element.md#readonly), fiecare selector al modului de afișare funcționează, iar o schimbare modifică doar acel ecran, indiferent de blocare.  
Numele logice și domeniile nu pot fi editate acolo, așa că nu se deschide nicio listă a termenilor și niciun selector de domeniu, iar niciunul dintre elementele `Derive Physical Name Again` și `Derive Physical Names Again` nu este oferit. Opțiunea View Option → `Domain` nu schimbă nimic acolo, așa cum nu schimbă nicio [opțiune de afișare](./table-related-functions.md#table-view-options).
