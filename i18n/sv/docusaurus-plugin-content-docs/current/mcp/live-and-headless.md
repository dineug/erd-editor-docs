---
sidebar_position: 3
description: Hur MCP-servern väljer mellan att redigera live i en editor (VS Code, Obsidian eller en JetBrains-IDE) och att redigera filen på disken, och vad sparande, ångring och en stängd editor gör i varje läge.
---

# Live och headless

Vid varje anrop letar servern efter en editor som har dokumentet, via de låsfiler som editorerna har i `~/.erd-editor/ide/`.
Varje VS Code-fönster och varje valvfönster i Obsidian med ERD Editor har en, och en JetBrains-IDE har en för hela IDE:n, som listar varje projekt som är öppet i den.
En editor tar bort sin låsfil när den stängs.
Det som servern hittar avgör vart redigeringen går.

| Vad den hittar | Vad en redigering gör |
| --- | --- |
| En editor vars arbetsområde, valv eller öppna projekt innehåller dokumentet, eller som har det öppet | **Live.** Öppnar dokumentet i ERD Editor vid behov, ansluter till redigeringssessionen och tillämpar ändringen där. Redigeringarna visas direkt och sparas på samma sätt som editorn sparar dina egna – se [Spara](#saving). |
| Ingen editor | **Headless.** Läser in filen, tillämpar ändringen och ersätter filen. `erd_save` har ingenting att göra. |
| En editor med hubben avstängd | **Nekad.** Läsningar fungerar fortfarande, från disken. En ändring som skrivs till filen medan en editor har den öppen kan skrivas över när editorn sparar nästa gång, så servern skriver ingenting. |
| En editor vars hubb är på men som använder ett annat protokoll än serverns: med servern i version `1.0.0` ett VS Code-tillägg `3.x`, ett Obsidian-plugin `0.x` eller ett JetBrains-plugin `0.9.0` eller `0.10.0`; med en server före `1.0.0` tillägget `4.0.0` eller senare, eller ett plugin `1.0.0` eller senare | **Nekad**, även för läsningar, med `protocolMismatch`. Meddelandet anger vilken sida som ska uppdateras: tillägget eller pluginet, eller servern – se [Uppdatera](./installation.md#updating). |
| En editor i Windows som har dokumentet under en annan sökväg till samma fil: agenten angav det via en nätverksresurs eller en mappad enhet på den här datorn, som `\\localhost\C$\…`, och editorn har det under dess enhetssökväg, eller tvärtom | **Nekad**, även för läsningar, med `invalidPath`. Meddelandet anger den sökväg som editorn har dokumentet under; anropa igen med den sökvägen. |
| En editor i Windows som Windows håller agenten borta från: en som startades som administratör men inte agenten, eller vilken editor som helst när agenten körs i en sandlåda | **Nekad**, även för läsningar, med `hubUnreachable` och ett meddelande som anger varför. Kör editorn och agenten med samma behörigheter, till exempel genom att starta editorn igen utan administratörsbehörighet. |

Resultatet av en redigering anger vilket läge den kördes i, `live` eller `headless`, och en nekad redigering anger varför.
Sökningen görs på nytt vid varje anrop, så när en editor öppnas eller stängs följer nästa anrop med.

När mer än en editor har dokumentet vinner en som har det öppet över en som bara betjänar en mapp som innehåller det, och bland dem som betjänar en mapp vinner den vars mapp ligger djupast.
Vid oavgjort, som när två editorer båda har det öppet, går dokumentet till den vars låsfil ändrades senast.
Ett dokument i ett Obsidian-valv inuti en arbetsområdesmapp i VS Code går alltså till Obsidian, om inte VS Code har det öppet och Obsidian inte har det.

Anrop mot ett och samma dokument körs ett i taget, i den ordning de nådde servern. Anrop mot olika dokument körs parallellt.

## Live {#live}

Agenten ansluter till editorn som ytterligare en medarbetare.
Dess redigeringar når direkt varje editor som har dokumentet öppet, och dess fokus ritas ut på tabellen och cellen som den redigerar, precis som en medarbetares – se [focusTracker](../api/advanced/collaborative-editing.md#focustracker).

En läsning öppnar aldrig en editor. En redigering öppnar dokumentet i ERD Editor när det ännu inte är öppet, utan att ta tangentbordsfokus.

### Spara {#saving}

Varje editor sparar agentens redigeringar på samma sätt som den sparar dina egna.

I VS Code markerar agentens redigeringar fliken som ändrad precis som dina egna, och de når disken först när dokumentet sparas.
`erd_save` sparar det via VS Code, på samma sätt som sparkommandot i VS Code gör. Du kan spara i stället, med `Ctrl + S` (Windows/Linux) eller `⌘ + S` (Mac).
Om du stänger editorn med osparade redigeringar från agenten tillfrågas du om de ska sparas, som för alla andra osparade ändringar.

Obsidian sparar agentens redigeringar ungefär två sekunder efter att redigeringen upphör, och när fliken stängs sparas de utan fråga.
En JetBrains-IDE skriver dem en bråkdel av en sekund efter att redigeringen upphör, och när fliken stängs skrivs det som fortfarande väntar; fliken visas aldrig som ändrad.
I båda skriver `erd_save` dem direkt.

`erd_save` väntar först i upp till två sekunder på att editorn ska ha varje redigering som agenten har gjort.
Det nekas med `notSaved` när editorn inte kunde bekräfta det, eller inte skrev filen: VS Code låter en flik förbli osparad när filen har ändrats på disken, och en JetBrains-IDE kunde inte skriva den, till exempel medan en dialogruta var öppen eller när det inte går att skriva till filen.

I VS Code och en JetBrains-IDE lyckas `erd_save` för ett dokument som inte har något kvar att spara, och filen lämnas som den är.
Så är det när varje redigering har sparats, vilket en JetBrains-IDE gör på egen hand, och det fortsätter att gälla medan varje senare ändring är en som ett [lås](../guide/guides/settings.md#lock) håller utanför filen, som att rulla eller zooma när `Viewport` är låst, eller byta flik när `Canvas Type` är låst. Alla lås är på som standard.
En fil som en JetBrains-IDE inte kan skriva till nekas även då.

När editorn stänger dokumentet efter agentens senaste redigering får agentens nästa anrop en notering om att de redigeringarna bara finns i filen om de sparades innan editorn stängdes.

### Ångra {#undo}

`erd_undo` ångrar den senaste redigeringen som agenten gjorde, aldrig dina, och `erd_redo` tillämpar den igen.
Editorns eget kommando [Ångra](../guide/guides/undo-redo.md) fungerar tvärtom: det ångrar dina redigeringar och aldrig agentens, eftersom ändringar som kommer från en annan editor inte registreras i din historik.

Några redigeringar skapar inget steg i editorns ångrahistorik: `erd_set_database` och `erd_set_database_name` bland [inställningsverktygen](./tools.md#settings), samt `erd_resize_memo`.
Det gör inte heller ett anrop till `erd_move_table_group` som flyttar gruppen mindre än 20 pixlar totalt, vågrätt och lodrätt sammanlagt, även om gruppen stannar kvar där den flyttades.
Ett anrop som inte ändrar något skapar inte heller något steg: `erd_set_column_primary_key`, `erd_set_column_unique`, `erd_set_column_not_null`, `erd_set_column_auto_increment`, `erd_set_index_unique` eller `erd_set_index_column_order` som anger ett värde som dokumentet redan har; `erd_add_index_column` med en kolumn som redan finns i indexet; `erd_set_table_group` med tabeller som redan finns i den gruppen (eller som redan saknar grupp, med `groupId` `null`); `erd_move_table_group` till den punkt där gruppen redan står; `erd_resize_table_group` till den rektangel som gruppen redan har; `erd_sort_tables` på ett dokument utan tabeller; eller en import med `mode` `append` som inte tillför någon tabell (för `erd_import_json` ingen tabell och ingen anteckning).
`erd_undo` hoppar över dessa och nämner dem i sitt resultat.
Andra redigeringar, som `erd_change_relationship_type`, `erd_change_relationship_on_delete`, `erd_change_relationship_on_update`, `erd_change_table_group_name`, `erd_change_table_group_color` och `erd_set_ddl_script`, skapar ett steg även när de anger ett värde som dokumentet redan har.

Agentens ångrahistorik upphör, med en notering i resultatet, när:

- Agenten ansluter till dokumentet igen, till exempel efter att editorn har kopplat bort agenten från det.
- Editorn avslutas, eller stänger dokumentet och slutar betjäna det, och agenten fortsätter att redigera filen på disken.
- En editor tar över ett dokument som agenten redigerade på disken.

Servern stänger också ett dokument som agenten inte har gjort några anrop mot på 30 minuter, och ångrahistoriken försvinner med det, utan någon notering.

### När editorn försvinner {#when-the-editor-goes-away}

Så länge en editor har ett dokument går servern aldrig över till filen på eget initiativ.
Om anslutningen bryts ansluter den igen.
Först när editorn har avslutats, eller har stängt dokumentet och inte längre listar det eller en mapp som innehåller det, redigerar servern filen, och det framgår av resultatet.
Det händer när du stänger ett diagram som ligger utanför alla mappar som editorn betjänar (i VS Code ett som har öppnats utanför arbetsområdet), när du slår av pluginet ERD Editor i Obsidian och när du stänger projektet som innehåller dokumentet i en JetBrains-IDE eller slår av pluginet där.
Ett stängt diagram i en mapp som editorn betjänar stannar hos editorn, och agentens nästa redigering öppnar det igen.

En editor som fortfarande körs, men vars låsfil är borta och vars anslutning stängdes utan att den stängde dokumentet, nekar nästa redigering med `hubGone`.
Meddelandet anger vad som frigör dokumentet: i VS Code läser du in det fönstret igen, eller stänger det så att agenten kan redigera filen direkt; i Obsidian slår du på pluginet ERD Editor igen, eller stänger det fönstret; i en JetBrains-IDE slår du på pluginet igen, eller avslutar IDE:n.

En läsning går i stället till filen på disken, med en notering om att redigeringar som ännu inte har sparats i editorn saknas, i två fall: när editorn som har dokumentet har hubben avstängd, och i fallet med `hubGone` ovan.
En läsning som inte kan ansluta till en editors hubb nekas med `hubUnreachable`, precis som en redigering.

## Headless {#headless}

När ingen editor betjänar dokumentet läser varje redigering in filen, tillämpar ändringen och skriver tillbaka filen.
Skrivningen görs till en temporär fil bredvid dokumentet, med namnet `.<name>.<id>.tmp`, som sedan ersätter det, så att dokumentet aldrig blir halvskrivet, utom i Windows i fallet med skrivning på plats som beskrivs nedan.

Före det sista steget kontrollerar servern om filen har ändrats på disken under anropet.
Om den har det skrivs ingenting, filen läses in igen och anropet nekas med `conflict`. Agenten anropar igen.
En fil som har ändrats mellan två anrop läses helt enkelt in igen, och agentens ångrahistorik fram till dess rensas.

En skrivskyddad fil lämnas som den är, och redigeringen nekas med `readonly`: en fil utan skrivbehörighet för sin ägare, eller med skrivskyddsattributet i Windows, som en Perforce- eller TFVC-fil som inte är utcheckad.
Gör den skrivbar och anropa sedan igen. Läsningar fungerar fortfarande.

Om en editor börjar betjäna dokumentet medan agenten redigerar det på disken nekas just den redigeringen med `hubAppeared` och ingenting skrivs. Nästa anrop redigerar via editorn.

I Windows gäller ytterligare två regler:

- Ett dokument med egna behörigheter, som skiljer sig från mappens, skrivs på plats i stället för att ersättas, så att det behåller dem, och den temporära filen tas bort efteråt. Ett program som läser dokumentet under den skrivningen kan hitta text som inte går att tolka.
- En fil som ett annat program håller öppen kan inte ersättas, så servern försöker igen i upp till två sekunder. Varje försök letar först efter en editor igen, och en editor som har börjat betjäna dokumentet under tiden nekar skrivningen med `hubAppeared`, eller med `blocked` när dess hubb är avstängd. Om filen fortfarande hålls öppen efter två sekunder skrivs ingenting, filen läses in igen och anropet misslyckas med ett meddelande som citerar systemfelet.

## Nekad {#refused}

Ett VS Code-fönster behåller sin låsfil även när dess hubb är avstängd: när `dineug.erd-editor.agentHub.enabled` är av, när arbetsområdet inte är betrott eller när dess hubb inte kunde lyssna.
Ett valvfönster i Obsidian behåller sin låsfil med hubben avstängd när inställningen Coding agents är av och när dess hubb inte kunde lyssna.
En JetBrains-IDE behåller sin låsfil med hubben avstängd när inställningen Coding agents är av, när dess hubb inte kunde lyssna och medan IDE:n avslutas.

En redigering av ett sådant dokument nekas med `blocked`, eftersom den öppna editorn kan skriva över en ändring som har skrivits till filen nästa gång den sparar.
Läsningar fungerar fortfarande, från filen på disken.

För att låta agenten redigera slår du på hubben igen, så som meddelandet anger för den editorn: i VS Code litar du på arbetsområdet och slår på inställningen, eller läser in fönstret igen; i Obsidian slår du på Coding agents, eller läser in Obsidian igen; i en JetBrains-IDE slår du på Coding agents, eller startar om IDE:n om inställningen redan är på.

En JetBrains-IDE nekar också, med `hubDisabled`, att ändra ett dokument som bara ingår i projekt som den inte litar på.
Agenter kan fortfarande läsa ett sådant dokument, och `erd_list_documents` listar det som `readonly`. Lita på projektet och anropa sedan igen.

En editor som inte har någon låsfil skyddar ingenting, och agenten redigerar filen på disken även när diagrammet är öppet där.
Så är det för Obsidian eller en JetBrains-IDE som har installerats som Flatpak i Linux, en JetBrains-IDE utan JCEF och en JetBrains-IDE vars hubb inte kunde starta – se [Konfigurera Obsidian](./installation.md#set-up-obsidian) och [Konfigurera en JetBrains-IDE](./installation.md#set-up-a-jetbrains-ide).
Ett VS Code-tillägg före `3.0.0` och ett JetBrains-plugin före `0.9.0` har inte heller någon, eftersom de saknar hubb.

## Dokument {#documents}

Ett dokument anges med `path`, absolut eller relativ till serverns arbetskatalog.

- Nya dokument är `.erd.json`. `erd_open_document` med `create` skapar filen och lägger till `.erd.json` till ett namn som saknar filändelse. Precis som ett nytt diagram i editorn har det nya dokumentet alla [lås](../guide/guides/settings.md#lock) på, så att filen aldrig ändras när du rullar, zoomar, byter flik eller väljer ett annat språk, skiftläge eller en annan typ av citattecken i kodgeneratorn i en editor. Inget verktyg slår på eller av ett enskilt lås: det gör du på fliken Inställningar i editorn. `erd_import_json` i läget `replace` ersätter dem alla med låsen i dokumentet som det läser in – se [Import](./tools.md#import).
- Befintliga `.erd`-, `.vuerd`- och `.vuerd.json`-filer går också att öppna. En sökväg med någon annan filändelse nekas med `invalidPath`.
- I Windows nekas med `invalidPath` en sökväg som innehåller ett namn som Windows inte lagrar så som det är skrivet, innan dokumentet läses eller skrivs, även för läsningar: ett namn med kolon eller ett annat tecken som Windows inte godtar, som `orders:v2.erd`; ett enhetsnamn som `NUL.erd` eller `CON.erd`, oavsett skiftläge; eller ett namn som slutar med punkt eller blanksteg. Byt namn på filen, till exempel med `-` i stället för `:`.
- En fil som inte är ett dokument som editorn kan läsa, till exempel en som har kvar markörer från en sammanslagningskonflikt, nekas med `invalidDocument` och lämnas som den är. Den läses aldrig in som ett tomt diagram och skrivs tillbaka.

Agenten ändrar ett dokument bara via verktygen och instrueras att aldrig skriva filen själv.

`erd_list_documents` listar dokumenten med `path`, `open`, `active`, `dirty` och `readonly`.
Verktyget frågar editorn som betjänar arbetskatalogen, vald på samma sätt som för ett dokument, och listar diagrammen som är öppna i den och sedan de ERD-filer som den betjänar: de i arbetsområdesmapparna i ett VS Code-fönster, i ett Obsidian-valv eller i varje projekt som är öppet i en JetBrains-IDE.
Annars listar det ERD-filerna under arbetskatalogen, där en skrivskyddad fil märks med `readonly` och, i Windows, ett namn som Windows inte lagrar så som det är skrivet utelämnas.
