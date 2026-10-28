---
sidebar_position: 10
description: Rechercher les noms de table, de colonne, d’index et de groupe de tables, les noms logiques, les commentaires et les mémos depuis le haut de l’explorateur, parcourir les correspondances dans son arborescence et sur le canevas, et remplacer une correspondance ou toutes.
---

# Rechercher et remplacer

Rechercher et remplacer trouve du texte dans l’ensemble du diagramme, vous amène à chaque correspondance sur le canevas ERD et remplace une correspondance ou toutes.  
La recherche porte sur huit types de texte : les noms de table, les commentaires de table, les noms de colonne, les commentaires de colonne, les mémos, les noms d’index, les noms de groupe de tables et les [noms logiques](./logical-names.md) des tables et des colonnes (voir [Ce qui est recherché](#what-it-searches)).

La fonction se trouve en haut de l’[explorateur](./explorer.md), le panneau ancré à gauche du canevas ERD, entre la barre de titre de l’explorateur et son arborescence. Elle n’a pas de titre propre. De haut en bas, elle contient :

- Le champ Rechercher, avec à l’intérieur, à son extrémité, les trois [options](#options), et devant lui la flèche `Toggle Replace`.
- La ligne `Replace`, réduite au départ (voir [Remplacer](#replacing)).
- Le compteur, puis les flèches haut et bas qui parcourent les correspondances, et le bouton à trois points `Search In`.
- Les [types de texte](#what-it-searches), que `Search In` développe.

Tant que le champ Rechercher contient du texte, l’arborescence de l’explorateur affiche les correspondances (voir [Les résultats](#the-results)).  
Sur un canevas de faible hauteur, la recherche garde toute sa hauteur, et l’arborescence en dessous occupe l’espace restant et défile.

![Ouverture de Rechercher et remplacer dans l’explorateur avec ⌘ + F, parcours des six correspondances de member, puis, avec Preserve Case activé, remplacement des six par user (⌘ + Enter)](/img/demo-find-and-replace.webp)

## Ouvrir et fermer {#opening-and-closing}

`Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac), ainsi que `Toggle Explorer` dans la [recherche rapide](./quick-search.md) ou dans le menu contextuel du canevas, ouvrent l’explorateur sur sa recherche. Le point d’insertion va dans le champ Rechercher, dont le texte est sélectionné, et la requête est recherchée à nouveau sans correspondance actuelle.  
Le bouton `Explorer` de la barre d’outils ne fait qu’ouvrir ou fermer le panneau. Il ne place pas le point d’insertion dans le champ Rechercher et laisse la requête et la correspondance actuelle telles qu’elles étaient.  
Lorsque la touche ne fait que ramener le point d’insertion dans un explorateur déjà affiché, comme c’est le cas quand la recherche rapide ou l’une des cinq boîtes de dialogue de [Boîtes de dialogue à côté de l’explorateur](./explorer.md#dialogs-beside-it) est ouverte, la correspondance actuelle le reste.

La fermeture de l’explorateur, ce que font la touche et les deux entrées `Toggle Explorer` quand il est ouvert, et les boîtes de dialogue qu’elles ferment sont traités dans [Ouvrir et fermer](./explorer.md#opening-and-closing) dans la page Explorateur.  
[Quand l’explorateur s’efface](./explorer.md#when-it-stands-aside) explique comment un autre onglet et le mode zen le masquent, et comment la visionneuse de différences, le voyage dans le temps et l’aperçu de la disposition automatique le masquent et l’empêchent de s’ouvrir. [À côté du canevas](./explorer.md#beside-the-canvas) traite d’un éditeur trop étroit pour lui.

La réouverture conserve la dernière requête, avec le texte de remplacement, les [options](#options), les [types de texte](#what-it-searches) qui étaient activés et l’état, développé ou non, de la ligne `Replace` et des types de texte.  
Ces réglages sont conservés tant que l’éditeur reste ouvert et ne sont pas enregistrés dans le document. Un éditeur qui vient d’être ouvert démarre avec toutes les options désactivées, la ligne `Replace` et les types de texte réduits, et seuls les quatre types de nom et `Logical names` activés (voir [Ce qui est recherché](#what-it-searches)).

## La barre de recherche du navigateur {#the-browsers-find-bar}

Tant que l’éditeur a le focus, `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) lui revient dans tous les onglets, y compris dans ses propres champs de texte, si bien que la barre de recherche du navigateur ne s’ouvre pas.  
La touche est transmise au navigateur ou à l’hôte tant que la visionneuse de différences, le voyage dans le temps ou l’aperçu de la disposition automatique est ouvert, ainsi que lorsque le focus est hors de l’éditeur.

- Application web et Google Drive : la barre de recherche du navigateur ne s’ouvre que dans ces deux cas.
- VS Code : l’extension laisse désactivé le widget de recherche de VS Code dans ERD Editor, si bien que la touche n’y en ouvre jamais.
- Obsidian : la touche parvient à l’éditeur chaque fois que l’onglet du diagramme est actif, à la place de `Search current file` d’Obsidian.
- IDE JetBrains : si la configuration clavier de l’IDE garde `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) pour elle-même, ouvrez la recherche avec `Toggle Explorer` dans la recherche rapide ou dans le menu contextuel du canevas, ou ouvrez l’explorateur avec le bouton `Explorer` de la barre d’outils et cliquez dans le champ Rechercher.

Une page qui intègre l’éditeur peut réaffecter ou supprimer la touche (voir [Changer le raccourci](#changing-the-shortcut)).

## Ce qui est recherché {#what-it-searches}

Huit boutons choisissent les types de texte recherchés, dans cet ordre : `Table names`, `Table comments`, `Column names`, `Column comments`, `Memos`, `Index names`, `Table group names` et `Logical names`.  
Ils sont réduits au départ. Le bouton `Search In`, au bout de la ligne du compteur, les développe sous cette ligne et les réduit à nouveau, et il est mis en évidence tant qu’ils sont affichés.  
Un bouton de type mis en évidence est activé. Cliquez sur l’un d’eux pour l’activer ou le désactiver, et la recherche est relancée. Si les huit sont désactivés, rien n’est trouvé.

À sa première ouverture, la recherche porte sur les quatre types de nom, `Table names`, `Column names`, `Index names` et `Table group names`, ainsi que sur `Logical names`, si bien qu’un renommage n’atteint les commentaires et les mémos que si vous les activez.  
`Logical names` est un seul type pour les noms logiques des tables comme des colonnes.  
Les noms d’index sont les noms des index de l’onglet `Indexes` de la boîte de dialogue [Propriétés de la table](./table-related-functions.md#indexes), et non les clés `PK_` et `UQ_` listées au-dessus d’eux.

Rien d’autre n’est recherché : ni les types de données, ni le domaine d’une colonne, ni les valeurs par défaut, ni les colonnes d’un index, ni le nom de la base de données, ni le [Schéma SQL](./schema-sql.md) avec ses scripts `Before tables` et `After tables`, ni le code généré, ni les feuilles de l’onglet [Dictionnaire](./dictionary.md), qui ont leur [propre recherche](./dictionary.md#searching).  
Les noms logiques sont recherchés quelle que soit la vue de l’[affichage des noms](./logical-names.md#name-view), y compris `Physical Names`, où le canevas n’en affiche aucun. Un commentaire masqué par une [option d’affichage des tables](./table-related-functions.md#table-view-options) est lui aussi recherché. Les mémos masqués avec View Option → `Memos` et les [groupes de tables](./table-groups.md#hiding-groups) masqués avec View Option → `Table Groups` ne le sont pas, même avec leur bouton activé, si bien que `Replace All` ne réécrit jamais un mémo et ne renomme jamais un groupe que vous ne voyez pas.

## Options {#options}

Trois boutons bascules, à l’intérieur du champ Rechercher, à son extrémité, changent la façon dont la requête trouve des correspondances. Leur nom figure dans leur info-bulle, et ils sont mis en évidence lorsqu’ils sont activés. Tous trois sont désactivés au départ, et changer l’un d’eux relance la recherche.

- `Match Case` : lorsqu’il est désactivé, la correspondance ignore la casse.
- `Match Whole Word` : une correspondance ne compte que là où elle ne se prolonge dans un mot ni d’un côté ni de l’autre. Les lettres, les chiffres et les signes diacritiques de toute écriture comptent comme caractères de mot, tout comme le trait de soulignement. `user` correspond donc dans `user id` et `user.id`, mais pas à l’intérieur de `users`, `user_id` ou `superuser`. Une extrémité de la requête qui n’est pas elle-même un caractère de mot, comme le point de `.id`, n’a pas besoin de limite de mot à cet endroit.
- `Use Regular Expression` : la requête est une expression régulière JavaScript, toujours en mode Unicode, si bien que `\p{L}` fonctionne. `^` et `$` correspondent au début et à la fin de chaque ligne d’un commentaire ou d’un mémo de plusieurs lignes, et `.` ne franchit pas un saut de ligne. Les échappements souvent saisis dans les noms, comme `\_` et `\-`, sont acceptés.

Une expression régulière qui ne peut pas être analysée, comme `user(`, ne trouve rien : le compteur indique `Invalid regular expression` en rouge, et le champ Rechercher est entouré de rouge.  
`Match Case` et `Match Whole Word` s’appliquent aussi à une expression régulière. Une correspondance de longueur nulle, comme `^` seul, n’est jamais listée.

Le texte simple est recherché au fil de la saisie. Une expression régulière est recherchée dès que la saisie marque une pause, ou immédiatement lorsque vous appuyez sur `Enter`, sur un bouton de navigation, sur `Replace` ou sur `Replace All`, ou que vous choisissez une ligne qui contient une correspondance.  
La recherche n’a pas de limite de temps, si bien qu’une expression régulière qui fait beaucoup de retours arrière peut laisser l’éditeur sans réponse jusqu’à ce qu’elle se termine.

Un quatrième bouton bascule, `Preserve Case`, se trouve à l’intérieur du champ `Replace`, à son extrémité, si bien qu’il n’apparaît que lorsque la ligne `Replace` est développée. Il est désactivé au départ. Il ne change rien à ce qui est trouvé, seulement la façon dont `Replace` et `Replace All` écrivent le remplacement (voir [Remplacer](#replacing)). L’activer ou le désactiver ne lance aucune recherche, et la correspondance actuelle le reste.

## Les résultats {#the-results}

Le compteur, au début de la ligne sous les champs, indique où vous en êtes. Il est vide tant que le champ Rechercher est vide.

| Compteur | Quand |
| --- | --- |
| `No results` | Rien ne correspond. |
| `12 matches` | Avant que vous passiez à l’une des correspondances ; `1 match` pour une seule. |
| `3 of 12` | La troisième correspondance est la correspondance actuelle. |
| `Invalid regular expression` | L’expression régulière ne peut pas être analysée. |
| `Replaced 12 matches` | `Replace All` a modifié ce nombre de correspondances ; `Replaced 1 match` pour une seule. |
| `No changes` | `Replace All` n’a rien modifié. |
| `No more matches` | Une série de `Replace` est revenue à son point de départ (voir [Remplacer](#replacing)). |

`Replaced …`, `No changes` et `No more matches` cèdent la place au compteur lors de la recherche ou du déplacement suivant, y compris la recherche que lance une modification ou une annulation.

Tant que le champ Rechercher contient du texte, l’[arborescence](./explorer.md#the-tree) de l’explorateur affiche les résultats au lieu du diagramme entier : seulement les lignes qui contiennent une correspondance et les lignes au-dessus d’elles. Lorsque rien ne correspond, ou que l’expression régulière ne peut pas être analysée, elle est vide. Effacer la requête fait revenir l’arborescence entière, réduite comme elle l’était auparavant.

- `Tables`, `Table Groups` et `Memos` n’apparaissent que lorsqu’ils contiennent une correspondance, et le nombre affiché sur chaque dossier est le nombre de lignes directement sous lui dans les résultats.
- Sous `Tables` viennent les tables qui contiennent une correspondance, triées par nom, jamais par nom logique. Sous chaque table viennent une ligne pour chaque correspondance de son commentaire, puis un dossier `Columns` avec les colonnes qui contiennent une correspondance, dans l’ordre des colonnes, chacune avec une ligne pour chaque correspondance de son commentaire, puis un dossier `Indexes` avec les index dont le nom correspond. Il n’y a pas de dossier `Foreign Keys`.
- Sous `Table Groups` viennent les groupes dont le nom correspond, triés par nom, sans leurs tables. Une table trouvée apparaît sous `Tables`.
- Sous `Memos` viennent les mémos qui contiennent une correspondance, dans l’ordre du document, chacun représenté par sa première ligne de texte et accompagné d’une ligne pour chaque correspondance qu’il contient.

Une correspondance dans un nom est mise en évidence dans la ligne de ce nom, si bien qu’un nom qui contient deux fois la requête forme une seule ligne avec deux mises en évidence. Une correspondance dans le nom logique d’une table ou d’une colonne apparaît elle aussi sur la ligne de cette table ou de cette colonne, jamais sur une ligne à part.  
Ces lignes nomment la table ou la colonne comme le montre l’[affichage des noms](./logical-names.md#beyond-the-canvas), et chacun des deux noms qu’une ligne peut afficher ne met en évidence que ses propres correspondances. Une ligne trouvée uniquement dans le nom que sa vue omet, le nom logique dans la vue `Physical Names` ou le nom dans la vue `Logical Names`, ajoute ce nom après celui qu’elle affiche, atténué comme dans la vue `Both Names`, avec la correspondance mise en évidence. Lorsque le nom qu’elle affiche contient lui aussi une correspondance, la ligne n’affiche que ce nom, si bien que les correspondances du nom que sa vue omet sont comptées et parcourues, mais pas mises en évidence.  
Une correspondance dans un commentaire ou un mémo a sa propre ligne : une bulle de dialogue pour un commentaire de table ou de colonne, ou une note adhésive pour un mémo, puis un extrait du texte où la correspondance est mise en évidence. Un texte long est coupé par `…`, et les sauts de ligne s’affichent comme des espaces. Survolez la ligne pour voir le texte entier.  
Toutes les autres lignes ont le même aspect qu’en dehors d’une recherche : une colonne affiche son type de données, un index ses colonnes, et un nom vide affiche `unnamed`.

Chaque ligne qui a des lignes en dessous apparaît développée au début d’une recherche. Une ligne que vous réduisez, ou que `Collapse All` réduit, reste réduite jusqu’à ce qu’une correspondance en dessous devienne actuelle, ou que la requête, `Match Case`, `Match Whole Word`, `Use Regular Expression` ou un type de texte change, ou que la recherche soit rouverte avec la touche ou une entrée `Toggle Explorer`.  
La ligne de la correspondance actuelle est mise en évidence, et l’arborescence défile pour l’afficher. L’arborescence liste toutes les correspondances, quel que soit leur nombre.  
Les correspondances sont parcourues dans l’ordre de l’arborescence : table par table, le nom logique, le nom et le commentaire de la table, puis le nom logique, le nom et le commentaire de chacune de ses colonnes dans l’ordre des colonnes, puis ses noms d’index ; puis les noms de groupe de tables ; puis les mémos.

Les résultats suivent le document tant que l’explorateur est affiché. Dès que les modifications marquent une pause, tout changement dans les textes recherchés relance la recherche, et la correspondance actuelle le reste si elle existe encore. Cela couvre un nom, un nom logique, un commentaire ou le texte d’un mémo modifié, une table, une colonne, un index, un mémo ou un groupe de tables ajouté ou supprimé, une colonne déplacée, ainsi que les mémos ou groupes de tables masqués ou affichés avec View Option, ce qui retire leurs correspondances de l’arborescence ou les y ramène. Une modification sur le canevas, une annulation ou un rétablissement, une importation et une modification par un collaborateur ou un agent de codage sont tous pris en compte. Sélectionner, déplacer des tables, des mémos ou des groupes sur le canevas, faire défiler, zoomer et survoler ne le sont pas.  
Changer de vue dans l’affichage des noms ne l’est pas non plus, car cela ne modifie aucun texte que lit la recherche : les mêmes correspondances restent, et les lignes prennent les noms qu’affiche la nouvelle vue.  
Les modifications faites pendant que l’explorateur est fermé ou hors de vue sont prises en compte dans la recherche dès qu’il réapparaît.

## Aller à une correspondance {#going-to-a-match}

`Enter` dans le champ Rechercher va à la correspondance suivante, et `Shift + Enter` à la précédente. Les boutons fléchés haut et bas après le compteur font de même ; leurs info-bulles indiquent `Previous Match (Shift+Enter)` et `Next Match (Enter)`, et ils sont désactivés tant qu’il n’y a aucune correspondance.  
Le déplacement boucle aux deux extrémités. Aucune correspondance n’est actuelle avant votre premier déplacement, si bien que le premier `Enter` va à la première correspondance et le premier `Shift + Enter` à la dernière.

Un clic sur une ligne des résultats, ou `Enter` ou `Space` lorsque le focus clavier est sur elle, produit l’un des effets suivants :

- Une ligne dont le nom ou le nom logique contient une correspondance va à sa première correspondance, celle du nom logique avant celle du nom.
- Une ligne qui affiche un extrait d’un commentaire ou d’un mémo va à cette correspondance.
- Toute autre ligne, comme une table dont ni le nom ni le nom logique ne correspondent ou la ligne propre d’un mémo, va à ce que la ligne représente et laisse la correspondance actuelle telle quelle (voir [Aller à une ligne](./explorer.md#going-to-a-row)).
- Un dossier se réduit ou se développe.

Chaque fois qu’une correspondance devient actuelle, l’arborescence développe les lignes réduites au-dessus d’elle et y place le focus clavier, si bien que les touches fléchées de l’arborescence reprennent à partir de cette ligne.

Aller à une correspondance ferme la boîte de dialogue Propriétés de la table si elle est ouverte, puis :

- Pour le nom, le nom logique ou le commentaire d’une table ou d’une colonne, sélectionne la table seule, la met au premier plan et place la cellule active sur la cellule qui contient la correspondance. Une correspondance dans un commentaire masqué par une [option d’affichage des tables](./table-related-functions.md#table-view-options) place plutôt la cellule active sur le nom voisin. Là où l’[affichage des noms](./logical-names.md#name-view) ne dessine aucune cellule pour le nom ou le nom logique, la cellule active va sur celle qui est dessinée à sa place : le nom dans la vue `Physical Names`, le nom logique dans la vue `Logical Names`.
- Pour un nom d’index, sélectionne la table de l’index seule et la met au premier plan, en plaçant la cellule active sur le nom de la table, ou sur son nom logique dans les vues `Logical Names` et `Both Names`, sauf si elle est déjà dans cette table. Les noms d’index ne sont pas dessinés sur le canevas.
- Pour un nom de groupe de tables, sélectionne le groupe seul et le met au premier plan avec ses tables.
- Pour un mémo, sélectionne le mémo seul et le met au premier plan.

Le canevas ne défile que si l’élément visé n’est pas déjà bien visible, et le zoom ne change jamais (voir [Où aboutit un saut](./table-related-functions.md#where-a-jump-lands)).

Après `Enter` dans le champ Rechercher, le point d’insertion y reste, et après le choix d’une ligne, le focus clavier reste dans l’arborescence, si bien que ce que vous saisissez ensuite n’atteint pas la table sélectionnée.  
Aller à une correspondance ne lance ni ne termine jamais le tracé d’une relation.

## Remplacer {#replacing}

La ligne `Replace` est réduite au départ. La flèche devant le champ Rechercher, dont l’info-bulle indique `Toggle Replace`, la développe et la réduit. La réduire conserve le texte de remplacement.  
La ligne contient le champ `Replace`, avec le bouton bascule `Preserve Case` à l’intérieur, à son extrémité, et deux boutons, dont les info-bulles indiquent `Replace (Enter)` et `Replace All`. Les deux boutons sont désactivés tant qu’il n’y a aucune correspondance.

`Replace` s’exécute avec `Enter` dans le champ Remplacer, avec ou sans `Shift`, ou avec son bouton :

- Sans correspondance actuelle, le premier appui va seulement à la correspondance suivante, si bien que vous voyez ce qu’il modifierait avant que quoi que ce soit ne change.
- Avec une correspondance actuelle, il remplace cette seule occurrence, en laissant intacte toute autre occurrence dans le même texte, et passe à la correspondance suivante après le texte qu’il a écrit. Ce qu’il a écrit est ignoré même s’il contient la requête : remplacer `user` par `super_user` ne s’arrête donc pas ensuite à l’intérieur de `super_user`.
- Une correspondance que le remplacement réécrirait exactement telle qu’elle était est laissée telle quelle, et l’appui passe seulement à la correspondance suivante.
- Le remplacement et le défilement jusqu’à la correspondance suivante forment une seule étape d’annulation.

Une série d’appuis sur `Replace` s’arrête dès qu’elle revient à son point de départ. Le compteur indique `No more matches`, aucune correspondance n’est actuelle, et les appuis suivants ne remplacent rien.  
`Customer` remplacé par `Big Customer` n’est donc remplacé qu’une fois, au lieu de devenir `Big Big Customer`.  
Aller à une correspondance, changer la requête, `Match Case`, `Match Whole Word`, `Use Regular Expression` ou un type de texte, ouvrir la recherche avec la touche ou une entrée `Toggle Explorer`, ou `Replace All` lance une nouvelle série, tout comme une annulation ou toute autre modification qui change le texte où la série a commencé. Changer le texte de remplacement ou `Preserve Case` n’en lance pas, pas plus que la touche lorsqu’elle ne fait que ramener le point d’insertion dans un explorateur déjà affiché.  
Tant qu’une série dure, une table ou un groupe de tables qu’elle renomme garde sa place dans l’arborescence et dans l’ordre des correspondances, si bien qu’un élément renommé qui serait classé plus loin n’est pas rencontré à nouveau. La série suivante remet l’arborescence dans l’ordre des noms, et la ligne renommée passe à sa nouvelle place.

`Replace All` s’exécute avec `Ctrl + Enter` (Windows/Linux) ou `⌘ + Enter` (Mac) dans le champ Remplacer, ou avec son bouton :

- Il remplace chaque correspondance dans les types de texte activés et ne touche pas aux autres types, hormis les noms physiques que dérive un nom logique remplacé, qu’il écrit même lorsque `Table names` et `Column names` sont désactivés (voir ci-dessous). Avec les types par défaut, il renomme des tables, des colonnes, des index et des groupes de tables, et réécrit les noms logiques des tables et des colonnes ; les commentaires et les mémos restent intacts.
- Tout ce qu’il modifie forme une seule étape d’annulation (voir [Un geste, une étape](./undo-redo.md#one-gesture-one-step)).
- Le compteur indique `Replaced N matches`, en ne comptant que les occurrences dont le texte a réellement changé. Si aucune n’a changé, il indique `No changes` et rien n’est enregistré dans l’historique, comme en remplaçant l’expression régulière `(user)` par `$1`.
- La recherche est ensuite relancée sans correspondance actuelle, si bien que les résultats peuvent lister des correspondances que contient le nouveau texte.

Les deux lisent chaque texte tel qu’il est au moment de l’appui, et non tel que la dernière recherche l’a trouvé.

Utilisation du texte de remplacement :

- Sans `Use Regular Expression`, `$` n’a pas de sens particulier, et le texte de remplacement est utilisé tel que saisi, hormis la casse que lui donne `Preserve Case`.
- Avec `Use Regular Expression`, `$1` à `$99`, `$<name>`, `$&`, `` $` ``, `$'` et `$$` sont interprétés comme dans `String.prototype.replace` de JavaScript.
- Sans `Preserve Case`, la casse du texte trouvé n’est pas reportée : avec `Match Case` désactivé, remplacer `user` par `member` transforme `Users` en `members`.
- Avec `Preserve Case`, la casse de chaque remplacement suit celle du texte qu’il remplace, une fois `$1` et les autres interprétés, si bien que le même remplacement transforme `Users` en `Members` :
  - Une correspondance entièrement en majuscules reçoit le remplacement entièrement en majuscules, et une correspondance entièrement en minuscules le reçoit entièrement en minuscules : `USER` avec `account` donne `ACCOUNT`, et `user` avec `Account` donne `account`.
  - Toute autre correspondance donne au premier caractère du remplacement la casse du premier caractère de la correspondance, et laisse le reste tel que saisi : `UserId` avec `accountKey` donne `AccountKey`, et `uSER` avec `AccountKey` donne `accountKey`. Lorsque le premier caractère de la correspondance n’a pas de casse, le remplacement est laissé tel que saisi : `_Ab` avec `xyz` donne `xyz`.
  - Lorsque la correspondance et le remplacement contiennent tous deux `-`, ou tous deux `_`, et que ce séparateur les découpe en un même nombre de morceaux, la casse de chaque morceau suit celle du morceau correspondant : `USER_id` avec `account_key` donne `ACCOUNT_key`, et `User-Name` avec `account-key` donne `Account-Key`. Lorsque `-` et `_` les découpent tous deux de cette façon, la casse est appliquée à l’ensemble comme à un seul morceau.
  - Une correspondance sans lettre dotée d’une casse, comme `123`, laisse le remplacement tel que saisi.
  - Une correspondance réécrite telle qu’elle était n’est pas comptée : avec `Match Case` désactivé, remplacer `customer` par `Customer` réécrit `customer`, `Customer` et `CUSTOMER` tels qu’ils étaient, et aucun n’est compté.
- Un champ Remplacer vide supprime la correspondance.

Un remplacement est une modification ordinaire, identique au fait de saisir vous-même le nouveau nom de table, le nom de colonne, le nom logique, le commentaire ou le texte du mémo, de renommer l’index dans la boîte de dialogue Propriétés de la table ou de renommer le groupe de tables.  
Il est enregistré dans l’historique et parvient aux collaborateurs et à un agent de codage comme toute autre modification.

Un nom de table ou de colonne qu’écrit un remplacement devient donc un nom personnel, qu’un nom logique écrit plus tard laisse tel quel jusqu’à ce que [Dériver à nouveau les noms physiques](./dictionary.md#derive-physical-names-again) le rende aux dictionnaires. Un nom qu’un remplacement laisse vide revient au contraire aux dictionnaires, comme tout nom effacé (voir [Vos propres noms](./dictionary.md#names-of-your-own)).  
Tant que le nom physique d’une table ou d’une colonne est vide ou a lui-même été dérivé, un nom logique remplacé le dérive des dictionnaires, comme le fait la fermeture de la cellule du nom logique sur un nouveau nom logique (voir [Dériver les noms physiques](./dictionary.md#deriving-physical-names)). Dans ce cas, une colonne dont le nouveau nom logique est un terme prend aussi le domaine du terme, et avec lui le type de données du domaine. Ce qu’il dérive fait partie de l’étape d’annulation du remplacement et n’est pas compté dans `Replaced N matches`.  
Lorsqu’un même `Replace All` réécrit à la fois le nom logique et le nom d’une même table ou colonne, le nom qu’il écrit l’emporte sur celui que dériverait le nouveau nom logique.

## Touches dans les champs de recherche {#keys-in-the-search-fields}

- Dans le champ Rechercher, `Enter` va à la correspondance suivante et `Shift + Enter` à la précédente.
- Dans le champ Remplacer, `Enter` remplace, avec ou sans `Shift`, et `Ctrl + Enter` (Windows/Linux) ou `⌘ + Enter` (Mac) remplace tout.
- Pendant qu’une méthode de saisie compose du texte dans l’un ou l’autre champ, `Enter` revient à la composition et ne provoque ni déplacement ni remplacement.

Ce que font `Escape`, les raccourcis de l’éditeur qui restent actifs et toutes les autres touches dans ces champs est décrit dans [Touches dans l’explorateur](./explorer.md#keys-in-the-explorer).

## Éditeurs en lecture seule {#read-only-editors}

Dans un éditeur [`readonly`](../../api/erd-editor-element.md#readonly), la recherche ne fait que trouver. Il n’y a ni flèche `Toggle Replace` ni ligne `Replace`, donc ni champ Remplacer, ni `Preserve Case`, ni `Replace`, ni `Replace All`.  
Le champ Rechercher, ses trois options, les types de texte, le compteur, les résultats et l’accès à une correspondance fonctionnent tous. Aller à une correspondance sélectionne ce qu’elle atteint, comme dans [Aller à une correspondance](#going-to-a-match), et cette sélection est la seule qu’un éditeur en lecture seule fasse : un clic immobile sur le canevas l’efface.  
Ouvrez la recherche avec la touche ou avec `Toggle Explorer` dans la recherche rapide, puisque le menu contextuel du canevas n’a pas `Toggle Explorer` dans cet éditeur. Le reste de l’explorateur est décrit dans [Éditeurs en lecture seule](./explorer.md#read-only-editors), sur la page de l’explorateur.

Dans VS Code, une révision d’un diagramme, comme une révision Git ou une entrée de Local History, s’ouvre en texte JSON. Rouverte comme diagramme avec `Reopen Editor With...`, elle est en lecture seule et dispose de cette recherche sans remplacement.

## Changer le raccourci {#changing-the-shortcut}

Une page qui intègre l’éditeur peut réaffecter `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac), ou le supprimer, sous le nom `findReplace`, avec [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap).  
Une fois le raccourci supprimé, la touche est laissée à la page dans tous les onglets. Le bouton `Explorer` de la barre d’outils ouvre et ferme toujours l’explorateur, et `Toggle Explorer` dans la recherche rapide et dans le menu contextuel du canevas ouvre toujours la recherche ou ferme l’explorateur, mais aucun d’eux n’affiche de raccourci, si bien que l’info-bulle du bouton indique seulement `Explorer`. La ligne `Toggle Explorer` de l’onglet [Raccourcis](./settings.md#shortcuts) des paramètres n’affiche pas de touche non plus. Une fois le raccourci réaffecté, tous affichent la nouvelle touche.
