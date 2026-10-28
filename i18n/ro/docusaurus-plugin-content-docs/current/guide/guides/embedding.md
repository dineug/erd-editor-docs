---
sidebar_position: 18
description: Arătați o diagramă doar în citire pe alt site, fără cod, încadrând erd-editor.io/embed, construiți în generator URL-ul și linia iframe, setați în URL tema, limba, Name View, minihărta, controalele și culorile și servați fișierul de pe GitHub sau de pe un server care permite CORS.
---

# Încorporare

[erd-editor.io/embed](https://erd-editor.io/embed) arată o diagramă doar în citire într-un viewer care umple pagina, pentru ca alt site să o încadreze: un wiki, un blog, un constructor de site-uri sau orice pagină care nu poate încărca scripturi proprii.  
Parametrul său `src` numește documentul, adică adresa unui fișier așa cum îl salvează ERD Editor, de exemplu un fișier `.erd.json`. Restul URL-ului stabilește cum îl arată viewerul, iar generatorul de la aceeași adresă scrie pentru dumneavoastră URL-ul și linia lui iframe.

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Acest cadru arată [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json) din depozitul erd-editor, iar aceasta este linia care îl pune într-o pagină:

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## Ce arată cadrul {#what-the-frame-shows}

Cadrul arată tabelele, coloanele, relațiile, notele și grupurile de tabele ale diagramei, iar nimic din el nu editează diagrama sau fișierul.  
Diagrama este potrivită la cadru în momentul încărcării, indiferent de zoomul și de poziția de derulare salvate de fișier, așa că dimensiunea cadrului decide zoomul la care se deschide.

Peste pânză se află:

- Minihărta, cât timp diagrama are conținut.
- Bara de controale din partea de jos: `Zoom out`, nivelul de zoom, care resetează zoomul când se face clic pe el, `Zoom in`, `Fit`, lista `Name View` și `Go to content`, cât timp nicio parte a diagramei nu este pe ecran.
- Linkul `erd-editor.io` din dreapta jos, care deschide erd-editor.io într-o filă nouă și nu îi trimite niciun referrer, așa că un clic nu spune site-ului nimic despre documentul pe care îl arată cadrul. Într-un cadru îngust, poate acoperi o parte din bara de controale.

Cât timp se încarcă fișierul, cadrul arată `Loading diagram`. Dacă nu poate fi preluat sau nu conține niciun document, cadrul arată o diagramă goală cu `Couldn't load the diagram` (consultați [Fișiere pe GitHub](#files-on-github) și [Fișiere pe alte servere](#files-on-other-servers)).

Cadrul urmează doar URL-ul său și sistemul vizitatorului. Limba și tema proprii ale unui vizitator pe erd-editor.io nu se aplică în el.

## Generatorul {#the-builder}

Deschideți [erd-editor.io/embed](https://erd-editor.io/embed) fără `src` pentru a obține generatorul, o pagină cu titlul `Embed a diagram`:

1. Lipiți adresa documentului în `Document URL`. Se aplică atunci când apăsați `Enter` sau părăsiți câmpul, așa că tastarea nu preia nimic. Odată aplicată, o linie `Loads from` de sub câmp numește adresa pe care o preia viewerul: cea pe care ați dat-o sau, pentru o pagină de pe GitHub, adresa ei pe gazda raw a GitHub (consultați [Fișiere pe GitHub](#files-on-github)).
2. Alegeți opțiunile. Fiecare se aplică imediat previzualizării, URL-ului și liniei iframe:
   - `Theme`: `System`, `Light` sau `Dark`.
   - `Display Language`: `System`, cu limba pe care o reprezintă în browserul dumneavoastră alături, apoi cele 25 de limbi, fiecare cu numele ei.
   - `Name View`: `As Saved`, `Physical Names`, `Logical Names` sau `Both Names`. `As Saved` arată modul de afișare a numelor salvat de fișier.
   - `Accent color` și `Gray color`, fiecare listată după nume, cu o mostră de culoare.
   - `Minimap` și `Controls`, două comutatoare, ambele activate.
   - `Height`, în pixeli, inițial `480`. O înălțime care nu este un număr întreg pozitiv se consideră `480`.
3. Verificați `Preview`: viewerul așa cum îl va arăta cadrul, cu linkul `erd-editor.io`, într-o casetă la fel de înaltă ca `Height`. Limba sa `System` este cea a browserului dumneavoastră, indiferent în ce limbă se afișează erd-editor.io însuși.
4. Copiați rezultatul. `Embed URL` este adresa cadrului, iar `Embed code` linia iframe, cu înălțimea pe care ați setat-o și lățimea `100%`. Fiecare are un buton `Copy`, care rămâne dezactivat până când se aplică un URL de document și care afișează `Copied` pentru o clipă după o copiere, până când o modificare rescrie ce a copiat.

Golirea câmpului `Document URL` golește previzualizarea și cele două rezultate după ce se aplică.

## Parametrii URL-ului {#url-parameters}

| Parametru | Valori | Implicit |
| --- | --- | --- |
| `src` | Adresa documentului, codificată ca URL. | Niciuna: fără el sau cu unul gol, pagina este generatorul. |
| `theme` | `light`, `dark` sau `system`. | `system`: modul luminos sau întunecat raportat de browserul vizitatorului. |
| `locale` | `system` sau un cod din [tabelul limbilor](./language-and-theme.md#display-language), de exemplu `de-DE`. | `system`: limbile browserului vizitatorului, potrivite așa cum le potrivește [System](./language-and-theme.md#what-system-follows), și engleza când viewerul nu o are pe niciuna dintre ele. |
| `name-view` | `physical`, `logical` sau `both`. | Modul de afișare a numelor salvat de fișier. |
| `minimap` | `false` ascunde minihărta. | Afișată. |
| `controls` | `false` ascunde bara de controale. | Afișată. |
| `accent-color` | Una dintre cele 26 de culori de accent ale [configuratorului de teme](./language-and-theme.md#theme), de exemplu `jade`. | `indigo` |
| `gray-color` | `gray`, `mauve`, `slate`, `sage`, `olive` sau `sand`. | `slate` |

Valorile implicite sunt ale viewerului însuși, nu ale aplicației web, care pornește cu `jade` și `olive`.

- Generatorul lasă fiecare opțiune aflată la valoarea implicită în afara URL-ului, așa că un URL de încorporare conține doar ce diferă.
- O valoare pe care viewerul nu o acceptă este ignorată, iar opțiunea ei păstrează valoarea implicită. Valorile se potrivesc exact așa cum sunt listate, așa că `theme=Dark` este ignorat, iar `minimap` și `controls` rămân afișate pentru orice valoare în afară de `false`.
- Un parametru dat de două ori ia prima valoare.
- `src` este codificat ca URL, așa cum îl scrie generatorul, deoarece o adresă care conține un `&` sau un `#` propriu ar fi altfel tăiată.

## Fișiere pe GitHub {#files-on-github}

Un fișier sau un gist de pe GitHub poate fi dat prin adresa pe care o arată pagina lui, ca în cadrul de mai sus. Viewerul îl preia în schimb de pe gazda raw a GitHub, care răspunde cererii altui site, spre deosebire de adresa proprie a paginii:

- Pagina unui fișier, `https://github.com/<owner>/<repo>/blob/<ref>/<path>`, sau adresa lui `raw`, `https://github.com/<owner>/<repo>/raw/<ref>/<path>`, se încarcă de la `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>`. `<ref>` este o ramură, o etichetă sau un commit: o ramură arată fișierul așa cum îl are acea ramură, iar o etichetă sau un commit păstrează acea versiune.
- Pagina unui gist, `https://gist.github.com/<user>/<id>`, se încarcă de la `https://gist.githubusercontent.com/<user>/<id>/raw`, care este primul fișier al gistului. Păstrați diagrama ca unic fișier al gistului.

URL-ul de încorporare păstrează adresa pe care ați dat-o, iar linia `Loads from` a generatorului o arată pe cea preluată.  
Aceasta funcționează doar pentru depozite publice și gisturi publice. Gazda raw păstrează în cache fiecare fișier cinci minute, așa că o modificare pe care o trimiteți poate dura atât până să apară în cadru.

## Fișiere pe alte servere {#files-on-other-servers}

Viewerul de la erd-editor.io preia fișierul cu un `GET` simplu din browserul vizitatorului, așa că serverul care îl deține trebuie să permită acea cerere între origini diferite (CORS): răspunsul lui are nevoie de un antet `Access-Control-Allow-Origin` care să permită `https://erd-editor.io`, cum ar fi `*`.  
Cererea nu poartă cookie-uri, așa că fișierul trebuie să poată fi citit fără autentificare.  
Fără acel antet, sau pentru o adresă care răspunde cu o eroare sau cu altceva decât un document ERD Editor, cadrul arată `Couldn't load the diagram`.

## În cadru {#in-the-frame}

Cadrul nu primește nicio mișcare a rotiței, niciun gest și nicio tastă până când un vizitator face clic sau atinge în el ori ajunge la el cu `Tab`. Până atunci, rotița, o glisare și o ciupire derulează sau măresc pagina din jurul lui, ca de obicei.  
Odată ce are focusul, rotița deplasează diagrama, `Ctrl + Wheel` (Windows/Linux) sau `⌘ + Wheel` (Mac) și o ciupire o măresc, iar `Ctrl + K` (Windows/Linux) sau `⌘ + K` (Mac) deschide o căutare în document, unde `#` găsește un tabel, `@` o coloană, iar `:` un comentariu sau o notă.  
O tragere deplasează diagrama indiferent dacă cadrul are focusul sau nu, iar un clic sau o atingere luminează relațiile: cele ale tabelului pe care s-a făcut clic sau relația pe care s-a făcut clic. Tabelul pe care se oprește cursorul își luminează relațiile. Consultați [Focus și taste](../../api/erd-viewer-element.md#focus-and-keys) pentru toate tastele.

Pentru a-l încerca pe o diagramă mai mare, cu zoom și căutare, deschideți [exemplul bookstore](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json), nouă tabele și două grupuri de tabele, într-o pagină proprie.

## Statistici de utilizare {#analytics}

erd-editor.io numără vizitele cadrului cu Google Analytics, așa cum numără vizitele aplicației web. Adresa pe care o înregistrează pentru un cadru este doar `erd-editor.io/embed`, fără adresa documentului pe care o numește `src`.  
Consultați [Politica de confidențialitate](https://erd-editor.io/privacy).

## Încărcarea viewerului de către dumneavoastră {#loading-the-viewer-yourself}

O pagină care poate încărca scripturi poate arăta o diagramă cu elementul [`<erd-viewer>`](../../api/erd-viewer-element.md) din pachetul `@dineug/erd-editor`. Acesta primește aceleași opțiuni ca atribute și metode, nu face nicio cerere către erd-editor.io și poate încărca un document de pe propriul site al paginii, ceea ce nu necesită CORS.
