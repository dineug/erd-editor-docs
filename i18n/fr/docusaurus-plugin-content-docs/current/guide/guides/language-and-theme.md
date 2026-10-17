---
sidebar_position: 15
description: Les 25 langues d’affichage de l’éditeur, la disposition de droite à gauche, les apparences système, claire et sombre du configurateur de thème et ses couleurs, et l’endroit où chaque hôte les conserve.
---

# Langue et thème

Le texte propre de l’éditeur existe en 25 langues, et son aspect est un thème : une apparence (`System`, `Light` ou `Dark`), une nuance de gris et une couleur d’accentuation.  
Tous deux appartiennent à la personne qui utilise l’éditeur, et non au diagramme. Aucun des deux n’est enregistré dans le fichier, consigné dans l’[historique d’annulation](./undo-redo.md) ni partagé avec les collaborateurs, si bien que chacun voit les siens, et modifier l’un ou l’autre ne marque jamais un fichier comme modifié.

Ni l’un ni l’autre ne se trouve dans l’onglet [Paramètres](./settings.md). La barre d’outils comporte un bouton `Theme` et, juste après, un bouton `Display Language`, tous deux après le bouton [`Explorer`](./explorer.md). La [recherche rapide](./quick-search.md) liste `Theme` et `Display Language` dans chaque onglet.  
L’application web, Google Drive, VS Code, les IDE JetBrains et Obsidian proposent tous l’un et l’autre et retiennent vos choix (voir [Dans chaque hôte](#in-each-host)). Tous deux fonctionnent aussi dans un éditeur en lecture seule.

## Langue d’affichage {#display-language}

La langue s’applique au texte propre de l’éditeur : les info-bulles de la barre d’outils, les menus contextuels, la recherche rapide, les panneaux et boîtes de dialogue, l’onglet Paramètres, l’[écran d’accueil](./editing-start.md#welcome-screen), les notifications et les messages, ainsi que le texte indicatif qu’affiche un nom, un type de données, une valeur par défaut ou un commentaire vide sur le canevas et dans une image exportée.  
Elle laisse tels quels, dans toutes les langues : les noms de vos tables et de vos colonnes, vos commentaires et vos mémos ; les SGBD, les langages du générateur de code et les formats de fichier ; les types de données, les mots-clés SQL et les actions `ON DELETE` et `ON UPDATE` ; les options `Create`, `If not exists`, `Drop & re-create`, `USE` et `CREATE + USE` de l’onglet Schéma SQL ; les marques `PK`, `FK`, `UQ`, `AI`, `NN`, `N-N`, `NULL` et `AK1.1` ; les lettres d’état `A`, `M`, `D`, `R` et `~` de la [visionneuse de différences](./table-related-functions.md#diff-viewer) ; les choix de casse des noms et de `Bracket` autres que `None` ; les noms des touches du clavier ; les noms de couleur du configurateur de thème ; le SQL et le code générés ; et les noms des fichiers exportés.

Les langues, dans l’ordre où le sélecteur les liste :

| Dans le sélecteur | Langue | Code |
| --- | --- | --- |
| Bahasa Indonesia | Indonésien | `id-ID` |
| Deutsch | Allemand | `de-DE` |
| English | Anglais | `en` |
| Español | Espagnol | `es-ES` |
| Euskara | Basque | `eu-ES` |
| Français | Français | `fr-FR` |
| Italiano | Italien | `it-IT` |
| Nederlands | Néerlandais | `nl-NL` |
| Polski | Polonais | `pl-PL` |
| Português | Portugais | `pt-PT` |
| Português Brasileiro | Portugais du Brésil | `pt-BR` |
| Română | Roumain | `ro-RO` |
| Slovenčina | Slovaque | `sk-SK` |
| Slovenščina | Slovène | `sl-SI` |
| Svenska | Suédois | `sv-SE` |
| Türkçe | Turc | `tr-TR` |
| Русский | Russe | `ru-RU` |
| Українська | Ukrainien | `uk-UA` |
| עברית | Hébreu | `he-IL` |
| العربية | Arabe | `ar-SA` |
| فارسی | Persan | `fa-IR` |
| 日本語 | Japonais | `ja-JP` |
| 简体中文 | Chinois simplifié | `zh-CN` |
| 繁體中文 | Chinois traditionnel | `zh-TW` |
| 한국어 | Coréen | `ko-KR` |

L’entrée `Language` que propose la recherche rapide dans l’onglet Générateur de code, et la ligne `Language` de la liste [Verrouillage](./settings.md#lock) de l’onglet Paramètres, sont le [langage cible du générateur de code](./code-generator.md#language), et non la langue d’affichage.

### Choisir une langue {#picking-a-language}

Le bouton `Display Language` (une icône de langues) ouvre le sélecteur `Display Language`, un panneau intitulé `Display Language` sous la barre d’outils, par-dessus l’onglet ouvert, quel qu’il soit.  
`System` vient en premier, avec à côté la langue qu’il désigne à cet instant, et reste visible pendant que la liste défile. Les 25 langues suivent, chacune sous son propre nom, et une coche signale l’option en vigueur.

![Passage de la langue d’affichage à 한국어 depuis la barre d’outils, puis à العربية, qui met la barre d’outils en miroir mais pas le diagramme, et retour à System](/img/demo-display-language.webp)

Le panneau s’ouvre avec le focus sur la ligne cochée :

- `↑` et `↓` parcourent les lignes en boucle, et `Home` et `End` vont directement à la première et à la dernière.
- `Enter` ou `Space` choisit la ligne active, comme le fait un clic.

Un choix s’applique aussitôt, ferme le panneau et rend le focus à l’éditeur.

Fermez-le sans choisir avec `Escape`, avec le bouton `x` à côté du titre, dont l’info-bulle indique `Close (ESC)`, avec un appui n’importe où dans l’éditeur hors du panneau sauf sur la barre d’outils, ou de nouveau avec le bouton `Display Language`.  
L’ouvrir ferme le configurateur de thème et la boîte de dialogue Propriétés de la table. Un [explorateur](./explorer.md#dialogs-beside-it) ouvert reste ouvert et, dans une langue de gauche à droite, le sélecteur se place juste à côté de lui plutôt que par-dessus.  
Ouvrir la recherche rapide ou le configurateur de thème le ferme, tout comme `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac). Ce raccourci ouvre l’[explorateur](./explorer.md#opening-and-closing) sur sa recherche ou, si l’explorateur est déjà ouvert, le laisse ouvert et place le focus dans son champ Rechercher. Le bouton `Explorer` de la barre d’outils laisse le sélecteur ouvert.

Tant que le panneau a le focus, quelques raccourcis de l’éditeur fonctionnent encore : `Search`, `Toggle Explorer`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` et `Zoom Reset` (voir [Raccourcis](./settings.md#shortcuts)). Tous les autres raccourcis de l’éditeur, les touches fléchées et `Tab` ne vont pas plus loin que le panneau, si bien que l’éditeur n’y réagit pas. Les touches auxquelles l’éditeur n’associe rien, comme le raccourci d’enregistrement propre à l’hôte, parviennent à l’hôte comme d’habitude.

Dans la [recherche rapide](./quick-search.md), `Display Language` liste `System` et les 25 langues, avec une coche sur l’option en vigueur. La recherche y trouve aussi une langue par son nom anglais ou par son code, si bien que `german` ou `de-DE` trouve `Deutsch`.

### Ce que suit l’option Système {#what-system-follows}

`System` est la valeur initiale de la langue dans l’application web, Google Drive, VS Code, les IDE JetBrains et Obsidian. Cette option suit la langue de l’hôte :

- Dans l’application web, Google Drive et votre propre page : les langues préférées du navigateur. Toute modification de celles-ci est suivie aussitôt.
- Dans VS Code : la langue d’affichage de VS Code.
- Dans un IDE JetBrains : la langue dans laquelle l’IDE affiche sa propre interface.
- Dans Obsidian : la langue d’Obsidian.

`System` prend la première de ces langues que l’éditeur propose, et l’anglais s’il n’en propose aucune.  
Une variante régionale est rattachée à sa langue, si bien que `de-AT` donne Deutsch et `fr-CA` donne Français. Le chinois dépend de l’écriture : une écriture traditionnelle donne 繁體中文 et toute autre écriture 简体中文. Sans écriture précisée, le chinois de Taïwan, de Hong Kong ou de Macao donne 繁體中文, et tout autre chinois donne 简体中文. Le portugais donne Português Brasileiro sauf si une région autre que le Brésil est précisée, si bien que `pt-PT` donne Português ; le portugais d’Obsidian donne aussi Português.

### Langues de droite à gauche {#right-to-left-languages}

עברית (hébreu), العربية (arabe) et فارسی (persan) disposent l’éditeur de droite à gauche : la barre d’outils, les menus, les panneaux et boîtes de dialogue, la recherche rapide et l’onglet Paramètres sont mis en miroir. Les sous-menus d’un menu contextuel s’ouvrent vers la gauche, et les icônes Annuler et Rétablir de la barre d’outils sont échangées, afin qu’Annuler pointe vers l’arrière dans le sens de lecture de droite à gauche.

Le diagramme lui-même n’est jamais mis en miroir. Le canevas, avec ses tables, ses colonnes, ses relations et ses mémos, reste de gauche à droite, tout comme la minicarte, les barres de défilement, la [barre d’outils du canevas](./table-related-functions.md#canvas-toolbar), la [visualisation](./visualization.md) et sa barre d’outils, les cellules de type de données, le code des onglets Schéma SQL et Générateur de code, le sélecteur de couleur, les deux côtés de la visionneuse de différences, le voyage dans le temps et l’aperçu de la disposition automatique.  
L’[explorateur](./explorer.md#beside-the-canvas) reste à gauche du canevas, et l’arborescence des modifications de la visionneuse de différences à gauche de la visionneuse, chacun avec son bord de glissement à droite. À l’intérieur, tous deux se lisent de droite à gauche : leurs champs et leurs lignes sont mis en miroir, les lignes sont indentées depuis la droite, et dans l’une comme dans l’autre arborescence, `←` développe une ligne ou passe à son premier enfant tandis que `→` la réduit ou remonte à son parent (voir [Touches dans l’explorateur](./explorer.md#keys-in-the-explorer)).  
Les noms, les commentaires et tout autre texte que vous avez saisi gardent leur propre sens, si bien qu’un nom en hébreu, en arabe ou en persan se lit aussi de droite à gauche sur le canevas.

## Thème {#theme}

Le bouton `Theme` (une icône de contraste) ouvre le configurateur de thème, un panneau intitulé `Theme` sous la barre d’outils, par-dessus l’onglet ouvert, quel qu’il soit. Il comporte trois parties :

- `Accent color` : 26 pastilles. L’info-bulle de chacune la nomme, comme `indigo`.
- `Gray color` : 6 pastilles, `gray`, `mauve`, `slate`, `sage`, `olive` et `sand`.
- `Appearance` : `System`, `Light` et `Dark`.

![Ouverture du configurateur de thème depuis la barre d’outils, choix d’une couleur d’accentuation et d’une nuance de gris, et passage de l’apparence à Light puis à System](/img/demo-theme-builder.webp)

L’option en vigueur dans chaque partie est signalée, et un choix s’applique aussitôt tandis que le configurateur reste ouvert.  
Choisir une couleur laisse l’apparence telle quelle, si bien qu’une couleur choisie sous `System` conserve `System`.

`System` affiche le mode clair ou sombre comme le fait l’hôte, et bascule quand l’hôte bascule :

- Dans l’application web, Google Drive et votre propre page : le mode clair ou sombre que signale le navigateur, qui suit le système d’exploitation.
- Dans VS Code : clair avec un thème de couleur clair, et sombre avec un thème sombre ou l’un ou l’autre des thèmes à contraste élevé.
- Dans un IDE JetBrains : le thème clair ou sombre de l’IDE.
- Dans Obsidian : le thème clair ou sombre d’Obsidian.

Fermez le configurateur avec `Escape`, avec le bouton `x` à côté du titre, dont l’info-bulle indique `Close (ESC)`, avec un appui n’importe où dans l’éditeur hors du panneau sauf sur la barre d’outils, ou de nouveau avec le bouton `Theme`.  
L’ouvrir ferme la boîte de dialogue Propriétés de la table et le sélecteur `Display Language`. Un [explorateur](./explorer.md#dialogs-beside-it) ouvert reste ouvert et, dans une langue de gauche à droite, le configurateur se place juste à côté de lui plutôt que par-dessus.  
Ouvrir la recherche rapide ou le sélecteur `Display Language` le ferme, tout comme `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac). Ce raccourci ouvre l’[explorateur](./explorer.md#opening-and-closing) sur sa recherche ou, si l’explorateur est déjà ouvert, le laisse ouvert et place le focus dans son champ Rechercher. Le bouton `Explorer` de la barre d’outils laisse le configurateur ouvert.  
Le configurateur ne retient aucune touche, si bien que les raccourcis de l’éditeur fonctionnent tant qu’il est ouvert.

Dans la [recherche rapide](./quick-search.md), `Theme` liste `System`, `Light` et `Dark`, avec une coche sur l’apparence en vigueur. En choisir une ne change que l’apparence et laisse la nuance de gris et la couleur d’accentuation telles quelles.

## Dans chaque hôte {#in-each-host}

Ce que vous choisissez dans l’éditeur, depuis la barre d’outils ou la recherche rapide, est enregistré là où l’hôte le conserve, et chaque diagramme ouvert suit aussitôt toute modification, où qu’elle soit faite.  
Dans VS Code, un IDE JetBrains et Obsidian, l’option `Auto` de l’hôte (la valeur `auto` dans VS Code) correspond à l’option `System` de l’éditeur. Choisir `System` enregistre `Auto`, et choisir `Light` ou `Dark` enregistre cette apparence, même lorsque `Auto` l’affichait déjà.  
Les paramètres et les notifications propres à l’extension et aux plugins sont en anglais, quelle que soit la langue d’affichage.

### Application web et Google Drive {#web-app-and-google-drive}

Sur erd-editor.io, sessions collaboratives comprises, et dans Google Drive, une seule langue et un seul thème valent pour l’application et pour chacun de ses diagrammes.  
Tous deux sont conservés dans ce navigateur, et non dans le schéma ni dans le fichier Drive, et tous les onglets erd-editor.io les partagent : un choix dans un onglet modifie aussitôt les autres.

La langue est `System`, qui suit les langues préférées du navigateur, jusqu’à ce que vous en choisissiez une.  
Le texte propre de l’application, comme la barre latérale, la corbeille, la collaboration et les écrans Google Drive, suit la même langue et, en hébreu, en arabe et en persan, toute l’application est disposée de droite à gauche. La politique de confidentialité, les conditions d’utilisation et les pages d’assistance restent en anglais.  
Outre le panneau de l’éditeur et la recherche rapide, la ligne du bas de la barre latérale comporte un bouton de langue, dont l’info-bulle indique `Display Language`, à côté des liens `Privacy` et `Terms`. Son menu liste `System`, avec la langue qu’il désigne, puis les 25 langues.

Au départ, le thème est `System`, avec la nuance de gris `olive` et la couleur d’accentuation `jade`.  
Outre le configurateur de thème et la recherche rapide, le bas de la barre latérale comporte trois boutons à icône, `System`, `Light` et `Dark` : à côté de `Trash` sur erd-editor.io, et à côté de `Sign out` dans Google Drive. Ils définissent la même apparence que le configurateur.

### VS Code {#vs-code}

Les paramètres de l’extension se trouvent sous ERD Editor dans la vue Settings de VS Code :

| Paramètre | Valeurs | Valeur par défaut |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto`, ou un code du [tableau des langues](#display-language) | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`, `light`, `dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | les six nuances de gris | `slate` |
| `dineug.erd-editor.theme.accentColor` | les 26 couleurs d’accentuation | `indigo` |

L’éditeur Settings propose pour le paramètre de langue `Auto`, puis chaque langue sous son propre nom. Une valeur de `settings.json` qui ne désigne aucune langue est lue comme `auto`.  
Un choix de thème dans l’éditeur écrit les trois paramètres de thème. Un choix est écrit là où son paramètre est déjà défini : le dossier de l’espace de travail, sinon l’espace de travail, sinon les paramètres utilisateur.

### IDE JetBrains {#jetbrains-ides}

Settings | Tools | ERD Editor comporte `Appearance:` (`Auto`, `Light`, `Dark`), `Gray color:`, `Accent color:` et `Display language:` (`Auto`, puis chaque langue sous son propre nom), conservés pour tout l’IDE.  
Leurs valeurs initiales sont `Auto`, `Slate`, `Indigo` et `Auto`.

### Obsidian {#obsidian}

Settings → ERD Editor comporte `Appearance` (`Auto`, `Light`, `Dark`), `Gray color`, `Accent color` et `Display language` (`Auto`, puis chaque langue sous son propre nom), conservés par coffre.  
Leurs valeurs initiales sont `Auto`, `Slate`, `Indigo` et `Auto`.  
Une modification s’applique à tous les onglets ERD du coffre, y compris ceux des fenêtres détachées.

### Votre propre page {#your-own-page}

Un `<erd-editor>` dans votre propre page n’affiche ni bouton `Theme` ni bouton `Display Language`, et la recherche rapide ne liste ni l’un ni l’autre, tant que la page ne les active pas avec [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) et [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker).  
Jusqu’à ce que la page définisse une langue ou que le lecteur en choisisse une, l’éditeur s’affiche en anglais, ou suit `System` lorsque `enableLocalePicker` est activé.  
Au départ, le thème est `Dark`, avec la nuance de gris `slate` et la couleur d’accentuation `indigo`, sauf si la page en définit un autre ou active [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode).  
Le choix d’un lecteur s’applique aussitôt, mais l’élément n’enregistre ni l’un ni l’autre : la page définit les valeurs initiales et enregistre elle-même les choix du lecteur (voir [Thème](../../api/erd-editor-element.md#theme) et [Langue d’affichage](../../api/erd-editor-element.md#display-language) dans l’API).
