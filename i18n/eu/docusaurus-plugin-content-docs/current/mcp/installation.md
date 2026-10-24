---
sidebar_position: 2
description: Erregistratu @dineug/erd-editor-mcp zerbitzaria Claude Code, Codex edo beste edozein MCP bezerotan, eta konfiguratu VS Code, Obsidian edo JetBrains IDE bat zuzeneko ediziorako.
---

# Instalazioa

Zerbitzaria npm erregistroan argitaratuta dago, `@dineug/erd-editor-mcp` izenarekin.
Exekuzio-garaiko mendekotasunik gabeko fitxategi autonomo bakarra da, eta agenteak lehen aldiz abiarazten duenean `npx` komandoak deskargatzen du; beraz, ez dago beste ezer instalatu beharrik.
Node.js `22.12` edo berriagoa behar du.

Agenteak diagrama bat zuzenean edita dezan, konfiguratu hura daukan editorea ere: [VS Code](#set-up-vs-code), [Obsidian](#set-up-obsidian) edo [JetBrains IDE bat](#set-up-a-jetbrains-ide).
Dokumentua zerbitzatzen duen editorerik ez badago, agenteak diskoko fitxategia editatzen du. Ikus [Zuzenean eta editorerik gabe](./live-and-headless.md).

## Claude Code {#claude-code}

Exekutatu zure proiektuaren karpetan:

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

Gehitu `--scope project` aukera `--transport` aukeraren aurretik, zerbitzaria horren ordez proiektuaren `.mcp.json` fitxategian idazteko; han, proiektua klonatzen duen orok jasotzen du.

## Codex {#codex}

Exekutatu behin. Codex CLIak, aplikazioak eta IDE luzapenak ezarpena partekatzen dute:

```sh
codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp
```

Edo gehitu zerbitzaria `~/.codex/config.toml` fitxategira, edo proiektu fidagarri bateko `.codex/config.toml` fitxategira:

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## Beste edozein MCP bezero {#any-other-mcp-client}

Exekutatu `npx -y @dineug/erd-editor-mcp` komandoa stdio zerbitzari gisa: komandoa `npx` da, eta argumentuak `-y` eta `@dineug/erd-editor-mcp` dira.

Zerbitzariak dokumentu baten bide-izen erlatiboa bere laneko direktorioaren arabera ebazten du; beraz, abiarazi zure proiektuaren karpetan.
MCP protokoloaren `2025-06-18`, `2025-03-26` eta `2024-11-05` bertsioak erabiltzen ditu, eta bertsio berriago bat erabiltzen duen bezero bati `2025-06-18` bertsioarekin erantzuten dio.

## VS Code konfiguratzea {#set-up-vs-code}

VS Code leiho batek bere lan-eremuko karpetetako diagramak eta bertan irekitako edozein diagrama zerbitzatzen ditu.

1. Instalatu [ERD Editor luzapenaren](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) `4.0.0` bertsioa edo berriagoa. VS Code `1.101.0` edo berriagoa behar du.
2. Ireki proiektuaren karpeta eta jo lan-eremua fidagarritzat. Luzapenak lan-eremu fidagarri batean soilik ematen die zerbitzua agenteei.
3. Utzi `dineug.erd-editor.agentHub.enabled` ezarpena aktibatuta. Lehenespenez aktibatuta dago.

`3.0.0` bertsiotik `3.1.0` bertsiora arteko luzapen batek eta `1.0.0` edo berriagoa den zerbitzariak elkar ukatzen dute, eta `3.0.0` bertsioa baino lehenagoko luzapen batek ez die agenteei zerbitzurik ematen.
`4.0.0` edo `4.1.0` bertsioko luzapen bat konektatu egiten da, baina ez ditu erakusten ez gordetzen agenteak idazten dituen izen logikoak, domeinu-loturak eta hiztegietako errenkadak. Ikus [Eguneratzea](#updating).

Luzapena `.erd`, `.erd.json`, `.vuerd` edo `.vuerd.json` fitxategiak dituen lan-eremu batean abiarazten da; beraz, agente batek diagrama horiek eskura ditzake zuk bat ireki aurretik.
Horietako bat ere ez duen lan-eremu batean, diagrama bat irekitzen duzunean abiarazten da, eta ordura arte agenteak diskoan editatzen du.

| Ezarpena | Lehenetsia | Eragina |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | Agente baten MCP zerbitzariari leiho honetako dokumentuak editatzen uzten dio socket lokal baten bidez, edo Windows sisteman izendun kanalizazio baten bidez. Desaktibatuta badago, edo lan-eremua fidagarria ez bada, agenteek leihoaren diagramak diskotik irakur ditzakete oraindik, baina ez dute inoiz diagramarik idazten haren editorea saihestuta. |

## Obsidian konfiguratzea {#set-up-obsidian}

Obsidian biltegi baten leihoak bere biltegiko diagramak zerbitzatzen ditu.

1. Instalatu [ERD Editor pluginaren](https://community.obsidian.md/plugins/erd-editor) `1.0.0` bertsioa edo berriagoa Community plugins ataletik, eta aktibatu. Mahaigaineko aplikazioan soilik exekutatzen da, eta Obsidian `1.5.7` edo berriagoa behar du.
2. Utzi Settings → ERD Editor → Coding agents aukera aktibatuta. Lehenespenez aktibatuta dago, eta biltegi bakoitzak bere ezarpena gordetzen du.

`1.0.0` bertsioa baino lehenagoko plugin batek eta `1.0.0` edo berriagoa den zerbitzariak elkar ukatzen dute.
`1.0.0` edo `1.1.0` bertsioko plugin bat konektatu egiten da, baina ez ditu erakusten ez gordetzen agenteak idazten dituen izen logikoak, domeinu-loturak eta hiztegietako errenkadak. Ikus [Eguneratzea](#updating).

Biltegi baten leihoak plugina kargatzen den unetik ematen die zerbitzua agenteei; beraz, agente batek biltegiko diagramak eskura ditzake zuk bat ireki aurretik.
Ez dago fidatzeko urratsik.
Biltegiak zerrendatzen ez duen fitxategi bat, hala nola izena puntu batez hasten den karpeta batean dagoena, ezin da ERD Editor editorean ireki; beraz, hari egindako edizio bat ukatu egiten da.

Eskatu agenteari diagrama berriei `.erd` luzapenarekin izena emateko.
Luzapenik gabeko izen bati `.erd.json` gehitzen zaio, eta Obsidianen fitxategi-arakatzaileak Settings → Files and links → Detect all file extensions aukera aktibatuta dagoen bitartean soilik zerrendatzen du `.erd.json` fitxategi bat.

| Ezarpena | Lehenetsia | Eragina |
| --- | --- | --- |
| Coding agents | Aktibatuta | Agente baten MCP zerbitzariari biltegi honetako diagramak editatzen uzten dio socket lokal baten bidez, edo Windows sisteman izendun kanalizazio baten bidez. Desaktibatuta badago, agenteek biltegiko diagramak diskotik irakur ditzakete oraindik, baina ez dute inoiz diagramarik idazten haren editorea saihestuta. |

Flathub bidez instalatutako Obsidian Flatpak isolamendu-ingurune batean exekutatzen da, eta zerbitzaria ezin da hara iritsi.
Han, pluginak ez die agenteei zerbitzurik ematen eta ez du blokeo-fitxategirik mantentzen; beraz, agenteak diskoko fitxategiak editatzen ditu, baita zuk irekita duzun diagrama bat ere.
Obsidian aplikazioak diagrama birkargatzen du, bere kanpoan egindako edozein aldaketaren ondoren egiten duen bezala, eta oraindik gorde ez duen zure edizio batek agentearenari uzten dio lekua.
Pluginak hala adierazten du biltegia irekitzen den bakoitzean, Coding agents aukera desaktibatzen duzun arte.

## JetBrains IDE bat konfiguratzea {#set-up-a-jetbrains-ide}

JetBrains IDE batek bertan irekitako proiektu guztietako diagramak zerbitzatzen ditu, baita bere ERD Editor editorean irekitako edozein diagrama ere.

1. Instalatu [ERD Editor pluginaren](https://plugins.jetbrains.com/plugin/23594-erd-editor) `1.0.0` bertsioa edo berriagoa. IntelliJ plataforman oinarritutako IDE bat behar du, `2025.2` edo berriagoa, JetBrains Runtime gainean exekutatzen dena.
2. Ireki proiektua eta jo fidagarritzat. IDEak fidagarritzat ez duen proiektu batean, hala nola modu seguruan irekitako batean, agenteek diagramak irakurtzen dituzte, baina ez dituzte inoiz aldatzen.
3. Utzi Settings | Tools | ERD Editor → Coding agents aukera markatuta. Lehenespenez aktibatuta dago, eta IDE osoari aplikatzen zaio.

`0.9.0` edo `0.10.0` bertsioko plugin batek eta `1.0.0` edo berriagoa den zerbitzariak elkar ukatzen dute, eta `0.9.0` bertsioa baino lehenagoko plugin batek ez die agenteei zerbitzurik ematen.
`1.0.0` edo `1.1.0` bertsioko plugin bat konektatu egiten da, baina ez ditu erakusten ez gordetzen agenteak idazten dituen izen logikoak, domeinu-loturak eta hiztegietako errenkadak. Ikus [Eguneratzea](#updating).

IDEak lehen proiektua irekitzen den unetik ematen die zerbitzua agenteei; beraz, agente batek proiektu bateko diagramak eskura ditzake zuk bat ireki aurretik.

| Ezarpena | Lehenetsia | Eragina |
| --- | --- | --- |
| Coding agents | Aktibatuta | Agente baten MCP zerbitzariari IDE honetako diagramak editatzen uzten dio socket lokal baten bidez, edo Windows sisteman izendun kanalizazio baten bidez. Desaktibatuta badago, agenteek irekitako proiektuetako diagramak diskotik irakur ditzakete oraindik, baina ez dute inoiz diagramarik aldatzen haren editorea saihestuta. |

Ezarpenen orriak adierazten du kodetze-agenteak noiz ez dauden erabilgarri: JCEF ez duen IDE batean (non ERD Editor ere ezin baita exekutatu), Linux sisteman Flatpak gisa instalatutako IDE batean, eta haren agente-gunea abiarazi ezin izan denean.
Kasu horietan, IDEak ez du blokeo-fitxategirik mantentzen, eta agenteak diskoko fitxategiak editatzen ditu.
ERD Editor editoreak ez du birkargatzen irekita dagoen diagrama bat diskoan aldatzen denean, eta bertan egiten duzun hurrengo edizioak diagrama osoa idazten du berriro agentearen aldaketen gainean; beraz, itxi diagrama lehenago.

## Probatu {#try-it}

1. Ireki zure diagramak dituen karpeta: VS Code editorean, fidagarritzat duzun lan-eremu gisa; Obsidian aplikazioan, biltegi gisa; JetBrains IDE batean, fidagarritzat duzun proiektu gisa.
2. Abiarazi agentea karpeta berean eta eskatu hitz arruntez, adibidez _«Gehitu reviews taula bat schema.erd.json fitxategiari, users eta products taulekin erlazionatuta»_.
3. Ikusi aldaketa oihalean nola agertzen den. VS Code editorean, gorde `Ctrl + S` (Windows/Linux) edo `⌘ + S` (Mac) lasterbidearekin, edo eskatu agenteari gordetzeko. Obsidian aplikazioak eta JetBrains IDE batek zure edizioak gordetzen dituzten bezala gordetzen dute aldaketa, eta agenteari gordetzeko eskatzen badiozu, berehala idazten da.

Oraindik irekita ez dagoen diagrama bat ERD Editor editorean irekitzen da agentearen lehen edizioarekin, teklatuaren fokua hartu gabe.
Agenteak dokumentu berri bat sortzen du `erd_open_document` tresnarekin, eta luzapenik gabeko izen bati `.erd.json` gehitzen zaio.

## Eguneratzea {#updating}

Goiko komandoek ez dute bertsiorik zehazten; beraz, agenteak zerbitzaria abiarazten duen bakoitzean, `npx` komandoak npm erregistroan begiratzen du zerbitzariaren bertsio berriagorik dagoen.
Dagoeneko martxan dagoen zerbitzari batek bere bertsioa mantentzen du agenteak berriro abiarazten duen arte.

Konektatu aurretik, zerbitzariak egiaztatzen du editoreak zer protokolo-bertsio erabiltzen duen.
Biak desberdinak direnean, editore horretara iristen den dei oro `protocolMismatch` errorearekin ukatzen da, irakurketak eta `erd_list_documents` tresna barne, eta ez da ezer idazten.
Mezuak eguneratu beharreko aldea izendatzen du: zerbitzaria, edo editoreko ERD Editor, hau da, VS Code editorean luzapena, eta Obsidian aplikazioan eta JetBrains IDE batean plugina.

Protokoloaren 2. bertsioa erabiltzen dute `1.0.0` edo berriagoa den zerbitzariak, `4.0.0` edo berriagoa den VS Code luzapenak, `1.0.0` edo berriagoa den Obsidian pluginak eta `1.0.0` edo berriagoa den JetBrains pluginak.
Aurreko zerbitzari guztiek protokoloaren 1. bertsioa erabiltzen dute, baita agenteei zerbitzua ematen dien editoreen aurreko bertsio guztiek ere: VS Code luzapenaren `3.0.0` bertsiotik `3.1.0` bertsiora artekoek, Obsidian pluginaren `0.1.0` eta `0.2.0` bertsioek, eta JetBrains pluginaren `0.9.0` eta `0.10.0` bertsioek.
Horrelako editore batek eta `1.0.0` edo berriagoa den zerbitzariak elkar ukatzen dute, baita aurreko zerbitzari batek eta protokoloaren 2. bertsioa erabiltzen duen editore batek ere.
`3.0.0` bertsioa baino lehenagoko VS Code luzapen batek edo `0.9.0` bertsioa baino lehenagoko JetBrains plugin batek ez die agenteei inolako zerbitzurik ematen; beraz, agenteak diskoko fitxategiak editatzen ditu, baita bertan irekita dagoen diagrama bat ere.

| Konbinazioa | Mezua honela amaitzen da |
| --- | --- |
| `1.0.0` edo berriagoa den zerbitzaria, protokoloaren 1. bertsioa erabiltzen duen luzapen edo plugin batekin | `Update the ERD Editor extension or plugin in the editor until its hub speaks protocol 2.` |
| Aurreko zerbitzari bat, protokoloaren 2. bertsioa erabiltzen duen luzapen edo plugin batekin | `Update the MCP server (npx -y @dineug/erd-editor-mcp@latest) until it speaks protocol 2.` |

Eguneratu zerbitzaria eta luzapena edo plugina batera.
Protokolo bera erabiltzen duten zerbitzari bat eta editore bat konektatu egiten dira, bietako zein den zaharragoa edozein dela ere, baina `1.1.0` edo berriagoa den zerbitzariak bakarrik ditu izen logikoetarako, domeinuetarako eta hiztegietarako tresnak. Ikus [Hiztegiak](./tools.md#dictionaries).
`4.2.0` edo berriagoa den VS Code luzapenak eta `1.2.0` edo berriagoak diren Obsidian eta JetBrains pluginek bakarrik erakusten eta gordetzen dituzte tresna horiek idazten dituzten izen logikoak, domeinu-loturak eta hiztegietako errenkadak.
Konektatzen den luzapen edo plugin zaharrago batek ez die jaramonik egiten, nahiz eta agentearen deiak arrakasta izan.
Hala ere, hiztegiek eratortzen dituzten izen fisikoak eta domeinuek ematen dituzten datu motak aplikatzen ditu.
`1.1.0` bertsioa baino lehenagoko zerbitzari batek fitxategi bat irakurtzen du haren izen logikoak, domeinu-loturak eta hiztegietako errenkadak gabe, eta kanpoan uzten ditu fitxategia diskoan editatzen duenean. Ikus [Editorerik gabe](./live-and-headless.md#headless).

Eguneratu ERD Editor diagramak irekitzen diren leku guztietan ere.
`4.2.0` bertsioa baino lehenagoko VS Code luzapenak, `1.2.0` bertsioa baino lehenagoko Obsidian pluginak eta `1.2.0` bertsioa baino lehenagoko JetBrains pluginak bertsio berriago batek gorde duen edo agenteak diskoan editatu duen diagrama bat irekitzen dute, haren taulen eta zutabeen izen logikoak, haren zutabeen domeinu-loturak eta haren hitzak, terminoak eta domeinuak gabe.
Fitxategia gordetzean, kanpoan uzten dituzte.
`4.0.0` bertsioa baino lehenagoko VS Code luzapenak, `1.0.0` bertsioa baino lehenagoko Obsidian pluginak eta `1.0.0` bertsioa baino lehenagoko JetBrains pluginak, gainera, halako diagrama bat haren gako nagusien ikonorik gabe erakusten dute, eta fitxategia gordetzean haren taula-taldeak eta SQL eskemaren scriptak galtzen dituzte.
`3.1.0` bertsioa baino lehenagoko VS Code luzapenak, `0.2.0` bertsioa baino lehenagoko Obsidian pluginak eta `0.10.0` bertsioa baino lehenagoko JetBrains pluginak diagrama baten ON DELETE eta ON UPDATE ekintzak ere galtzen dituzte fitxategia gordetzean.
Obsidian aplikazioan, berrabiarazi aplikazioa plugina eguneratu ondoren: ordura arte, biltegi baten leihoak lehenengo kargatu zuen plugin-bertsioaren ERD Editor exekutatzen jarraitzen du.
