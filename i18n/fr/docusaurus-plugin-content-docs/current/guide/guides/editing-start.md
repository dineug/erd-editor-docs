---
sidebar_position: 1
description: Commencer depuis l’écran d’accueil et créer des tables, des mémos, des groupes de tables et des relations depuis le menu contextuel du canevas, la barre d’outils du canevas ou avec un raccourci.
---

# Commencer l’édition

L’édition commence par le menu contextuel, qui s’ouvre d’un clic droit.

![Clic droit sur le canevas, ouverture du sous-menu Relationship, ajout d’une table, puis ouverture de son propre menu](/img/demo-context-menu.webp)

Un clic droit sur une table, un mémo, un groupe de tables ou une relation ouvre plutôt le menu propre à cet élément.  
Un clic droit sur une table, un mémo ou un groupe de tables déjà sélectionné conserve toute la sélection, si bien que les entrées comme `Color` et `Delete selected` s’appliquent à l’ensemble (voir [Sélection multiple](./table-related-functions.md#multiple-selection)).

## Écran d’accueil {#welcome-screen}

Dans l’application web, Google Drive, VS Code, Obsidian et un IDE JetBrains, un diagramme vide s’ouvre sur un écran d’accueil affiché par-dessus le canevas ERD. Un `<erd-editor>` dans votre propre page ne l’affiche que si la page l’active avec [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen).  
Un diagramme est considéré comme vide tant qu’il ne contient aucune table, aucun mémo affiché et aucun groupe de tables affiché, si bien que les mémos et les groupes masqués avec les options d’affichage ne comptent pas. L’écran disparaît dès que le diagramme contient l’un d’eux, et revient chaque fois que le diagramme redevient vide, par exemple après la suppression de la dernière table ou l’annulation de l’ajout de la première.  
Il n’est pas affiché dans un éditeur en lecture seule, en mode zen, tant que la boîte de dialogue Propriétés de la table est ouverte, ni tant que la visionneuse de différences, l’aperçu de la disposition automatique ou le voyage dans le temps occupe le canevas.

![L’écran d’accueil sur un diagramme vide : ouverture des formats d’Import, retour avec Esc, ajout d’une table avec New Table, puis réapparition de l’écran avec ⌘ + Z](/img/demo-welcome-screen.webp)

Sous le titre `Right-click the canvas for every action.` se trouve un menu :

- `New Table` ajoute une table, comme le fait `Alt + N`.
- `New Memo` ajoute un mémo, comme le fait `Alt + M`. Il est omis tant que les mémos sont masqués.
- `Import` remplace le menu par `Back` et les formats `json`, `Schema SQL`, `GraphQL`, `DBML` et `AML`. Choisir un format demande un fichier de ce format et le charge à la place du diagramme vide (voir [Importer ou exporter des fichiers](./file-import-export.md)). `Back`, ou `Escape`, ramène au premier menu.
- `Command Palette` ouvre la [recherche rapide](./quick-search.md), comme le fait `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac).
- `Shortcuts` ouvre les paramètres sur leur onglet [`Shortcuts`](./settings.md#shortcuts).

Lorsque le canevas est assez large, `New Table`, `New Memo` et `Command Palette` affichent la touche actuellement associée à leur commande, y compris celle qu’un hôte a réaffectée.  
Dès qu’une entrée a le focus, `↑` et `↓` parcourent les entrées en boucle, `Home` et `End` vont directement à la première et à la dernière, et `Enter` ou `Space` active l’entrée qui a le focus. Tous les autres raccourcis fonctionnent toujours, si bien que `Alt + N` ajoute aussi une table depuis cet écran.  
Seul le menu reçoit les clics : un appui n’importe où ailleurs sur l’écran parvient au canevas, et un clic droit sur le canevas ouvre le menu contextuel comme d’habitude.

Lorsque le canevas a assez de place, des flèches dessinées à la main désignent :

- le bouton `Search` de la barre d’outils : `Search commands and tables`
- les boutons `Theme` et `Display Language` : `Pick a theme and a language`, ou `Pick a theme` ou `Pick a language` lorsque la barre d’outils n’affiche que l’un des deux (voir [Langue et thème](./language-and-theme.md))
- la [barre d’outils du canevas](./table-related-functions.md#canvas-toolbar) en bas : `Pan, zoom and draw relationships`

Tant que l’[explorateur](./explorer.md) est affiché, l’écran d’accueil ne couvre que le canevas situé à côté.  
Une flèche dont le bouton de la barre d’outils se trouve au-dessus de l’explorateur est omise. La flèche de `Theme` et `Display Language` n’est omise que lorsque ses deux boutons se trouvent au-dessus de l’explorateur ; jusque-là, elle désigne celui qui se trouve encore au-dessus du canevas.  
Un libellé qui n’a pas de place à côté de sa flèche s’affiche plutôt sous la flèche.

## Création de tables {#table-creation}

Créez une table depuis le menu contextuel, avec le bouton `New Table` de la [barre d’outils du canevas](./table-related-functions.md#canvas-toolbar) ou avec le raccourci `Alt + N`.

## Création de mémos {#memo-creation}

Créez un mémo depuis le menu contextuel, avec le bouton `New Memo` de la barre d’outils du canevas ou avec le raccourci `Alt + M`.  
Tant que View Option → `Memos` est désactivé, les mémos sont masqués, rien ne propose `New Memo` et `Alt + M` n’en ajoute aucun (voir [Options d’affichage des tables](./table-related-functions.md#table-view-options)).

Un mémo est une note en texte libre sur le canevas. Cliquez dans son corps et saisissez votre texte ; le texte est enregistré avec le document.  
`Escape` ferme l’éditeur du mémo en conservant ce que vous avez saisi et en laissant le mémo sélectionné, et un second `Escape` efface la sélection.  
Faites glisser sa bordure pour le redimensionner. Le `x` de son en-tête, affiché tant que le pointeur survole le mémo, le supprime.  
Un clic droit sur un mémo ouvre son menu plutôt que l’éditeur : `Color`, `Remove color` tant qu’un élément sélectionné a une couleur, et `Delete`, qui devient `Delete selected` lorsque le mémo fait partie de deux éléments sélectionnés ou plus. Un mémo sélectionné se supprime aussi avec les touches qui suppriment les tables (voir [Suppression de tables et de mémos](./table-related-functions.md#table-and-memo-deletion)).

![Ajout d’un mémo avec Alt + M, saisie d’une note et redimensionnement en faisant glisser sa bordure](/img/demo-memo.webp)

## Création de groupes de tables {#table-group-creation}

Un groupe de tables est un cadre qui contient des tables, et vous pouvez lui donner un nom et une couleur. Créez-en un de l’une des deux façons suivantes :

- Choisissez `New Table Group` dans le menu contextuel ou la recherche rapide, cliquez sur le bouton `New Table Group` de la [barre d’outils du canevas](./table-related-functions.md#canvas-toolbar) ou appuyez sur `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac), puis tracez un cadre sur le canevas. Chaque table dont le centre se trouve dans le cadre rejoint le nouveau groupe, sauf si elle fait déjà partie d’un autre groupe (voir [Tracer un groupe](./table-groups.md#drawing-a-group)).
- Sélectionnez des tables et choisissez `Group selected tables` dans le menu contextuel d’une table ou `Group Selected Tables` dans la recherche rapide, ou appuyez sur `T` puis `G` (voir [Grouper les tables sélectionnées](./table-groups.md#grouping-selected-tables)).

Le nommage, la couleur, le déplacement, le redimensionnement et le reste sont décrits dans [Groupes de tables](./table-groups.md).

## Création de relations {#relationship-creation}

Commencez une relation depuis le menu contextuel, depuis la [barre d’outils du canevas](./table-related-functions.md#canvas-toolbar) en bas du canevas ou avec un raccourci. Chaque type de relation a le sien :

- Zero One : `Ctrl + Alt + 1` (Windows/Linux) ou `⌘ + ⌥ + 1` (Mac)
- Zero N : `Ctrl + Alt + 2` (Windows/Linux) ou `⌘ + ⌥ + 2` (Mac)
- One Only : `Ctrl + Alt + 3` (Windows/Linux) ou `⌘ + ⌥ + 3` (Mac)
- One N : `Ctrl + Alt + 4` (Windows/Linux) ou `⌘ + ⌥ + 4` (Mac)

Dès qu’un type est actif, le curseur change. Cliquez d’abord sur la table parente, puis sur la table enfant.  
La table parente reçoit une clé primaire si elle n’en a pas, et pour chaque colonne de clé primaire de la table parente, la table enfant reçoit une colonne de clé étrangère `Not Null` avec le même type de données, la même valeur par défaut et le même commentaire.  
Une clé serial fait exception : sa clé étrangère prend le type entier que stocke le serial, comme `integer` pour `serial4` (voir [Relations identifiantes](./relationship-editing.md#identifying-relationships)).  
Chaque colonne de clé étrangère est nommée d’après sa clé : un nom d’un seul mot comme `id` est précédé du nom de la table parente (`user_id`), un nom de plusieurs mots comme `member_id` est conservé, et un nom que la table enfant possède déjà est numéroté, par exemple `user_id_2` (voir [Noms des colonnes de clé étrangère](./relationship-editing.md#foreign-key-column-names)).  
Cliquer deux fois sur une même table trace une relation autoréférencée.  
Une nouvelle relation commence avec `On Delete` et `On Update` tous deux à `Not set` ; modifiez-les depuis son menu contextuel (voir [ON DELETE et ON UPDATE](./relationship-editing.md#on-delete-and-on-update)).  
Appuyez sur `Escape`, ou de nouveau sur le même raccourci, pour annuler. L’annulation laisse la sélection telle qu’elle est, et l’appui suivant sur `Escape` l’efface.

Une fois la table parente choisie, placer le pointeur sur une table où la relation peut aboutir entoure cette table et affiche deux boutons à côté d’elle :

- `Create new columns` (`+`) trace la relation avec de nouvelles colonnes de clé étrangère, comme le fait un clic sur la table.
- `Map to existing columns` (une icône de lien) termine le tracé et ouvre la boîte de dialogue [Associer les colonnes](./relationship-editing.md#map-columns) pour les deux tables, afin que la relation puisse utiliser des colonnes que la table enfant possède déjà. Rien n’est écrit tant que vous n’appuyez pas sur `Map`.

La table parente affiche elle aussi les boutons dès que le pointeur s’est un peu éloigné de l’endroit où vous avez cliqué dessus, si bien qu’une relation autoréférencée peut aussi être associée à des colonnes existantes.  
Un doigt ne permet pas le survol, donc lorsque vous tracez avec un doigt, les boutons ne s’affichent jamais et toucher la table enfant trace aussitôt la relation ; un stylet les affiche comme le fait une souris.  
Si la table parente a perdu sa clé primaire au moment où vous atteignez la table enfant, par exemple à la suite d’une annulation ou de la modification d’un collaborateur, `Create new columns` est grisé avec l’info-bulle `<parent> has no primary key to copy`, et un clic sur la table enfant termine le tracé sans rien tracer.

![Tracé d’une relation One N avec ⌘ + ⌥ + 4, puis d’une relation Zero N depuis la barre d’outils du canevas, la table enfant entourée avec ses boutons Map to existing columns et Create new columns](/img/demo-relationship.webp)

## Dupliquer des tables et des mémos {#duplicating-tables-and-memos}

Les tables et les mémos existants peuvent être copiés, collés et dupliqués en les faisant glisser avec `Alt` (voir [Fonctions liées aux tables](./table-related-functions.md#copyingpasting-tables-and-memos)).
