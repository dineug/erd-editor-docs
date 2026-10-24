---
sidebar_position: 9
description: Parcourir les tables du diagramme avec leurs colonnes, index et clés étrangères, ses groupes de tables et ses mémos dans une arborescence ancrée à côté du canevas ERD, et aller à chacun d’eux d’un clic.
---

# Explorateur

L’explorateur est un panneau ancré au bord gauche du canevas ERD qui présente le diagramme sous forme d’arborescence : ses tables, chacune avec ses colonnes, ses index et ses clés étrangères, puis ses [groupes de tables](./table-groups.md), puis ses mémos. Cliquez sur une ligne pour aller à ce qu’elle représente sur le canevas.  
L’explorateur rétrécit le canevas plutôt que de le recouvrir. Il fait partie de l’éditeur de diagramme, et n’est ni la vue Explorer de VS Code ni l’explorateur de fichiers d’Obsidian.

![Ouverture de l’explorateur depuis la barre d’outils, accès à products, puis à la colonne status et à la clé étrangère member_id de orders, repli avec Collapse All, élargissement du panneau et fermeture](/img/demo-explorer.webp)

La fonction [Rechercher et remplacer](./find-and-replace.md) se trouve en haut de l’explorateur, entre sa barre de titre et l’arborescence. Tant que le champ Rechercher contient du texte, l’arborescence n’affiche que ce qui correspond (voir [Les résultats](./find-and-replace.md#the-results)).  
L’arborescence elle-même ne modifie jamais le diagramme : elle ne permet ni de renommer, ni de faire glisser, ni de supprimer, ni d’afficher ou de masquer. Un remplacement est la seule modification qu’effectue le panneau.

L’état propre de l’explorateur n’appartient qu’à vous : son ouverture, sa largeur, son repli, la ligne qui a le focus, sa position de défilement et la recherche.  
Rien de tout cela n’est enregistré dans le fichier, consigné dans l’historique d’annulation, partagé avec les collaborateurs ni stocké dans le navigateur. Cet état est conservé tant que l’éditeur reste ouvert, lors des changements d’onglet comme pour les documents successivement chargés dans le même éditeur. Un éditeur qui vient d’être ouvert démarre avec l’explorateur fermé.

## Ouvrir et fermer {#opening-and-closing}

Ouvrez-le par l’un de ces moyens :

- Le bouton `Explorer` de la barre d’outils, juste après `Search`, avec une icône d’arborescence. Son info-bulle indique `Explorer (Ctrl + F)` (Windows/Linux) ou `Explorer (⌘ + F)` (Mac).
- `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac), nommé `Toggle Explorer` dans l’onglet [Raccourcis](./settings.md#shortcuts) des paramètres.
- `Toggle Explorer` dans la [recherche rapide](./quick-search.md), proposé dans tous les onglets. Saisir `find`, `replace`, `rename`, `tree`, `outline` ou `objects` le fait apparaître.
- `Toggle Explorer` dans le menu contextuel du canevas : cliquez avec le bouton droit sur un emplacement vide du canevas ERD, en dehors de tout [groupe de tables](./table-groups.md). Il se trouve après `New Table`, `New Memo` et `New Table Group`, avant `Relationship`.

Les deux entrées `Toggle Explorer` affichent le raccourci à droite.  
Le bouton de la barre d’outils, le raccourci et l’entrée de la recherche rapide fonctionnent depuis tous les onglets. Depuis l’onglet Visualisation, Schéma SQL, Générateur de code, Dictionnaire ou Paramètres, ils passent d’abord à l’onglet ERD, car l’explorateur ne s’affiche que là.

Le bouton de la barre d’outils ne fait qu’ouvrir et fermer le panneau. Il ne place pas le point d’insertion dans le champ Rechercher et laisse ouverts la boîte de dialogue Propriétés de la table, le configurateur de thème et le sélecteur `Display Language`.  
Le raccourci et les deux entrées `Toggle Explorer` ouvrent l’explorateur sur sa recherche : le point d’insertion va dans le champ Rechercher, dont le texte est sélectionné, et toute boîte de dialogue ouverte parmi les cinq de [Boîtes de dialogue à côté de l’explorateur](#dialogs-beside-it) se ferme. Ce que la recherche conserve d’une ouverture à l’autre est indiqué dans [Ouvrir et fermer](./find-and-replace.md#opening-and-closing), dans la page Rechercher et remplacer.  
Le raccourci est sans effet pendant la modification d’une cellule de table, d’un mémo ou du nom d’un groupe de tables, ou tant qu’une modification de cellule est ouverte dans l’onglet [Dictionnaire](./dictionary.md#keys-on-the-tab), liste des domaines d’un terme comprise.

Le bouton de la barre d’outils apparaît enfoncé tant que l’explorateur est ouvert dans l’onglet ERD et n’est pas masqué par le [mode zen](#when-it-stands-aside). Tant que c’est le cas, le bouton, le raccourci et l’une ou l’autre entrée `Toggle Explorer` ferment l’explorateur, et le focus, s’il se trouvait dans le panneau, revient à l’éditeur.  
Le raccourci ne le ferme jamais tant que la recherche rapide ou l’une des cinq boîtes de dialogue est ouverte. Il ferme à la place la palette ou la boîte de dialogue et place le focus dans le champ Rechercher, avec son texte sélectionné et, si l’explorateur était déjà affiché, la correspondance actuelle conservée. L’entrée `Toggle Explorer` de la recherche rapide ne fait pas cette exception : l’exécuter ferme la palette, puis un explorateur ouvert.

Le bouton `x` de la barre de titre, dont l’info-bulle indique `Close`, ferme aussi l’explorateur et donne le focus au canevas. `Escape` ne le ferme pas (voir [Touches dans l’explorateur](#keys-in-the-explorer)).  
Rouvert, l’explorateur reprend la même largeur, le même repli et la même position de défilement de l’arborescence, ainsi que la même requête. Ouvert par le raccourci ou une entrée `Toggle Explorer`, il relance la recherche de cette requête avec tous les résultats développés (voir [Les résultats](./find-and-replace.md#the-results)).

Lorsque le raccourci ou une entrée `Toggle Explorer` ouvre l’explorateur dans un éditeur trop étroit pour lui, une notification indique `Widen the window to show the Explorer`, et le focus reste où il était (voir [À côté du canevas](#beside-the-canvas)).  
L’explorateur est néanmoins ouvert, avec le bouton de la barre d’outils enfoncé, et apparaît, recherche déjà effectuée, dès que l’éditeur est assez large, sans prendre le focus. L’ouvrir avec le bouton de la barre d’outils n’affiche aucune notification.

## À côté du canevas {#beside-the-canvas}

L’explorateur longe le bord gauche de l’onglet ERD, sous la barre d’outils, sur toute la hauteur du canevas.  
Le canevas rétrécit pour lui faire de la place, si bien qu’aucune partie du diagramme ne se trouve sous le panneau, et la [barre d’outils du canevas](./table-related-functions.md#canvas-toolbar), la minicarte et l’[écran d’accueil](./editing-start.md#welcome-screen) se trouvent tous dans le canevas, à côté de lui.  
Ouvrir, fermer ou redimensionner l’explorateur ne fait pas défiler le diagramme et n’enregistre rien dans l’[historique d’annulation](./undo-redo.md#what-the-history-records).

Il mesure `260px` de large au départ dans un éditeur qui vient d’être ouvert. Faites glisser son bord droit pour choisir une largeur comprise entre `200px` et `480px`, ou double-cliquez sur le bord pour revenir à `260px`.

Le canevas conserve toujours au moins `320px` à côté de l’explorateur :

- Dans un éditeur plus étroit que la largeur de l’explorateur plus `320px`, l’explorateur s’affiche plus étroit pour tenir, jusqu’à `200px`.
- Dans un éditeur plus étroit que `520px`, il s’efface. Il n’est pas dessiné, mais reste ouvert, si bien que le bouton de la barre d’outils apparaît toujours enfoncé et qu’un appui sur ce bouton le ferme. Dès que l’éditeur est assez large, il revient à sa propre largeur.

C’est la largeur de l’éditeur lui-même qui compte, et non celle de la fenêtre du navigateur, même si la notification décrite dans [Ouvrir et fermer](#opening-and-closing) parle de la fenêtre.

Dans une [langue d’affichage de droite à gauche](./language-and-theme.md#right-to-left-languages), l’explorateur reste à gauche du canevas, car le canevas n’est jamais mis en miroir.  
Son contenu se lit de droite à gauche : la barre de titre, la recherche et les lignes sont mises en miroir, et les lignes sont indentées à partir de la droite. Le bord à faire glisser reste de son côté droit, contre le canevas. Les types de données, les colonnes d’index et le texte des clés étrangères gardent leur ordre de gauche à droite.

## Quand l’explorateur s’efface {#when-it-stands-aside}

L’explorateur ne s’affiche que dans l’onglet ERD.  
Passer à un autre onglet le masque, et le bouton de la barre d’outils n’apparaît plus enfoncé. De retour dans l’onglet ERD, il réapparaît tel que vous l’avez laissé, avec le même repli et la même position de défilement.

Tant que la [visionneuse de différences](./table-related-functions.md#diff-viewer), le [voyage dans le temps](./undo-redo.md#time-travel) ou l’aperçu de la [disposition automatique](./table-related-functions.md#auto-layout) est ouvert, rien n’ouvre ni ne ferme l’explorateur :

- Un explorateur ouvert est masqué et réapparaît à leur fermeture.
- Le bouton de la barre d’outils est grisé et sans effet.
- La recherche rapide omet `Toggle Explorer`.
- Le raccourci est laissé au navigateur ou à l’hôte (voir [La barre de recherche du navigateur](./find-and-replace.md#the-browsers-find-bar)).

La visionneuse de différences liste ses modifications dans une arborescence du même type (voir [Visionneuse de différences](./table-related-functions.md#diff-viewer)).

Activer le [mode zen](./table-related-functions.md#canvas-toolbar) avec `Alt + Z` (Windows/Linux) ou `⌥ + Z` (Mac) masque un explorateur ouvert sans le fermer, et désactiver le mode zen fait réapparaître l’explorateur.  
En mode zen, le raccourci et les deux entrées `Toggle Explorer` ouvrent toujours l’explorateur sur sa recherche, et le mode zen reste actif. L’explorateur occupe alors toute la hauteur de l’éditeur, car la barre d’outils supérieure a disparu, et reste affiché lorsque le mode zen est désactivé. Réactiver le mode zen le masque de nouveau.

Chaque fois que le panneau disparaît alors que le focus s’y trouve, qu’il soit fermé, masqué ou effacé, le focus revient à l’éditeur.

## L’arborescence {#the-tree}

La barre de titre affiche `Explorer` et contient deux boutons : `Collapse All` et le `x` qui ferme l’explorateur. En dessous se trouve la recherche (voir [Rechercher et remplacer](./find-and-replace.md)), et plus bas l’arborescence.

Le niveau supérieur contient trois dossiers, dans cet ordre : `Tables`, `Table Groups` et `Memos`. Sous chaque table se trouvent ses propres dossiers `Columns`, `Indexes` et `Foreign Keys`.  
Un dossier vide n’est pas affiché, si bien qu’un diagramme vide n’affiche aucune ligne. `Table Groups` est aussi omis tant que [View Option](./table-related-functions.md#table-view-options) → `Table Groups` masque les groupes, et `Memos` tant que View Option → `Memos` masque les mémos.  
Une ligne de dossier affiche une icône de dossier, son nom et, tout au bout, le nombre de lignes placées directement dessous, si bien que le nombre affiché à côté de `Tables` est le nombre de tables du diagramme. Le nombre groupe ses milliers comme le fait la langue d’affichage, toujours avec les chiffres 0 à 9, comme `1,234` en anglais et `1.234` en allemand.

Les tables sont triées par nom, sans tenir compte de la casse, et les tables de même nom gardent l’ordre du document. Les groupes de tables sont triés de la même façon, tout comme les tables sous chaque groupe. Les colonnes d’une table gardent l’ordre de la table, et ses index, ses clés étrangères et les mémos gardent celui du document.  
L’arborescence suit le diagramme à mesure qu’il change, que ce soit par une modification sur le canevas, une annulation ou un rétablissement, une importation, ou du fait d’un collaborateur ou d’un agent de codage, si bien que renommer une table déplace sa ligne.  
L’ordre suit le nom dans toutes les vues de l’[affichage des noms](./logical-names.md#name-view), jamais le nom logique. Changer de vue change le libellé des lignes de table et de colonne sans en déplacer aucune, tout comme donner un nom logique à une table ou à une colonne dans la vue `Logical Names` ou `Both Names`. Un nom physique [dérivé](./dictionary.md#deriving-physical-names) d’un nouveau nom logique est toutefois un renommage comme un autre, si bien qu’il peut déplacer la ligne d’une table.

Chaque type de ligne affiche :

- Une table : une icône de table et son nom.
- Une colonne : une icône de clé pour une colonne de clé primaire ou de clé étrangère, colorée comme la cellule de clé de la table colore une clé primaire, une clé étrangère ou les deux, et une icône de liste pour toute autre colonne. Puis son nom et, en texte atténué, son type de données suivi de `PK`, `FK` ou des deux, comme `id` `BIGINT PK` ou `user_id` `BIGINT FK`. Le type affiché est toujours le type de données de la colonne, jamais son [domaine](./logical-names.md#the-domain-cell), quel que soit l’affichage des noms.
- Un index : une icône d’index et son nom. Puis, en texte atténué, `UNIQUE` pour un index unique et ses colonnes entre parenthèses dans l’ordre de l’index, avec `DESC` après une colonne décroissante, comme `orders_user_idx` `UNIQUE (user_id DESC, total)`, ou seulement `(total)`.
- Une clé étrangère : listée uniquement sous la table enfant, celle qui contient les colonnes de clé étrangère, et seulement tant que la table parente est dans le diagramme. Son icône de clé prend la couleur du connecteur : la couleur de clé primaire et étrangère pour une [relation identifiante](./relationship-editing.md#identifying-relationships), la couleur de clé étrangère sinon. Elle affiche les colonnes de clé de la table enfant, séparées par des virgules, puis, en texte atténué, `→` suivi de la table parente et de ses colonnes, comme `user_id` `→ users(id)`.
- Un groupe de tables : un point de la couleur du groupe, gris pour un groupe sans couleur, et son nom. Ses tables sont listées dessous par nom, et chacune mène à sa table. Un groupe sans table n’a rien à développer.
- Un mémo : une icône de note adhésive et la première ligne du mémo.

Les lignes de table, les tables listées sous un groupe et les lignes de colonne suivent l’affichage des noms (voir [Au-delà du canevas](./logical-names.md#beyond-the-canvas)). Dans la vue `Both Names`, par exemple, une ligne de colonne affiche `Total Amount` `total` `NUMERIC` : le nom logique, puis le nom et le type de données, tous deux atténués.  
Dans toutes les vues, les lignes d’index et de clé étrangère affichent leurs colonnes par leur nom, et une ligne de clé étrangère affiche aussi sa table parente par son nom.  
Tant que le champ Rechercher contient du texte, une ligne trouvée uniquement dans le nom que sa vue omet affiche aussi ce nom, atténué (voir [Les résultats](./find-and-replace.md#the-results)).

Un nom vide, ou un mémo dont la première ligne est vide, s’affiche `unnamed` en italique. Dans les vues `Logical Names` et `Both Names`, une table ou une colonne n’affiche `unnamed` que si son nom logique est vide lui aussi.  
Dans un panneau étroit, le texte atténué est tronqué par `…` avant le nom par lequel commence la ligne. Survolez un nom ou son texte atténué pour l’afficher en entier.

Seul `Tables` est développé au départ. Cliquez sur une ligne de dossier, ou appuyez sur `Enter` ou `Space` lorsqu’elle a le focus, pour la réduire ou la développer.  
La flèche au début d’une ligne réduit ou développe cette ligne sans aller nulle part. Chaque ligne de table en a une, même pour une table sans rien dessous. `→` et `←` réduisent et développent aussi (voir [Touches dans l’explorateur](#keys-in-the-explorer)).  
`Collapse All` réduit un niveau à chaque appui : le niveau le plus profond de lignes développées affichées, si bien que les appuis successifs réduisent de bas en haut. L’appui qui atteint le niveau supérieur réduit toutes les lignes, y compris celles situées sous une ligne déjà réduite, et ne laisse que les dossiers du niveau supérieur.  
Les modifications, les annulations et rétablissements, et les changements venant de collaborateurs ou d’un agent de codage laissent le repli tel quel.

## Aller à une ligne {#going-to-a-row}

Cliquez sur une ligne, ou appuyez sur `Enter` ou `Space` lorsqu’elle a le focus, pour aller à ce qu’elle représente sur le canevas ERD. Une ligne de dossier ne fait que se réduire ou se développer, et les touches fléchées ne font que déplacer le focus dans l’arborescence.

- Une ligne de table, ou une table listée sous un groupe, sélectionne uniquement cette table et la met au premier plan. Sauf si la cellule active se trouve déjà dans cette table, elle passe sur la première cellule de l’en-tête de la table : le nom, ou le nom logique dans les vues `Logical Names` et `Both Names`.
- Une ligne de colonne sélectionne uniquement sa table et place la cellule active sur le nom de la colonne, ou, dans la vue `Logical Names`, sur le nom logique dessiné à sa place.
- Une ligne d’index sélectionne sa table, comme une ligne de table. L’index lui-même n’est pas mis en avant ; les index se modifient dans la boîte de dialogue [Propriétés de la table](./table-related-functions.md#indexes).
- Une ligne de clé étrangère amène les deux tables de la relation ensemble dans la vue, ou la table enfant lorsque les deux sont trop éloignées pour être affichées ensemble. Elle sélectionne uniquement la table enfant avec ses colonnes de clé étrangère, la cellule active sur la première d’entre elles, et met en surbrillance le connecteur de la relation (voir [Lire un connecteur](./relationship-editing.md#reading-a-connector)).
- Une ligne de groupe de tables amène le cadre du groupe dans la vue par sa barre de titre, sélectionne uniquement le groupe et le met au premier plan avec ses tables.
- Une ligne de mémo sélectionne uniquement le mémo et le met au premier plan.

La vue se déplace selon la règle commune à chaque « aller à » : le zoom ne change jamais, et le canevas ne défile que lorsque ce à quoi vous allez n’est pas déjà bien visible (voir [Où aboutit un saut](./table-related-functions.md#where-a-jump-lands)).  
Aller à une ligne ferme d’abord la boîte de dialogue Propriétés de la table si elle est ouverte, et ne commence ni ne termine jamais le tracé d’une relation.  
Tant que le champ Rechercher contient du texte, une ligne dont le nom ou le nom logique contient une correspondance, ou qui affiche un extrait d’un commentaire ou d’un mémo, mène plutôt à sa première correspondance (voir [Aller à une correspondance](./find-and-replace.md#going-to-a-match)).

Après un clic, le focus reste dans l’arborescence, si bien que `Delete`, `Backspace` et les autres touches d’édition n’atteignent pas la nouvelle sélection tant que vous n’appuyez pas sur `Escape` ou ne cliquez pas sur le canevas (voir [Touches dans l’explorateur](#keys-in-the-explorer)).

## Touches dans l’explorateur {#keys-in-the-explorer}

L’arborescence constitue un seul arrêt de la touche `Tab`, ignoré tant qu’elle ne contient aucune ligne.  
Y entrer avec la touche `Tab` mène à la ligne qui avait le focus en dernier, à défaut à la ligne de la correspondance actuelle, ou à la première ligne entièrement visible, et fait défiler l’arborescence jusqu’à cette ligne. La ligne qui a le focus est dessinée comme une ligne sous le pointeur.

Dans l’arborescence :

- `↑` et `↓` déplacent le focus d’une ligne, en s’arrêtant à la première et à la dernière ligne au lieu de boucler. `Home` et `End` vont à la première et à la dernière ligne.
- `→` développe une ligne réduite, ou passe au premier enfant d’une ligne développée. `←` réduit une ligne développée, ou remonte à son parent. Dans une langue d’affichage de droite à gauche, les deux touches sont inversées.
- `Enter` et `Space` agissent comme un clic : elles vont à la ligne, ou réduisent ou développent un dossier (voir [Aller à une ligne](#going-to-a-row)).
- Saisir une lettre ne permet pas d’aller directement à une ligne.

`Escape`, pressé n’importe où dans l’explorateur, dans l’arborescence, dans le champ Rechercher ou Remplacer, ou sur l’un de ses boutons, rend le focus au canevas. L’explorateur reste ouvert et la sélection reste telle quelle.  
Un `Escape` qui termine une composition de méthode de saisie ne fait que terminer la composition. `Escape` ne ferme jamais l’explorateur, qu’il soit pressé dans celui-ci ou sur le canevas.

Quelques raccourcis de l’éditeur fonctionnent encore lorsque le focus est dans l’explorateur (voir [Raccourcis](./settings.md#shortcuts)) :

- `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) fonctionne comme sur le canevas : il ferme l’explorateur ou, tant que la boîte de dialogue Propriétés de la table est ouverte à côté, la ferme et place le point d’insertion dans le champ Rechercher (voir [Ouvrir et fermer](#opening-and-closing)).
- `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac) affiche ou masque la recherche rapide.
- `Undo` et `Redo` annulent et rétablissent les modifications du diagramme plutôt que celles du texte d’un champ.
- `Zoom In`, `Zoom Out` et `Zoom Reset` modifient le zoom du canevas.

Tous les autres raccourcis de l’éditeur restent dans l’explorateur, de même que les touches fléchées, `Tab`, `Enter`, `Space`, `Home`, `End` et toute touche pressée pendant qu’une composition de méthode de saisie est en cours.  
Aucun d’eux n’atteint le canevas : `Delete` et `Backspace` ne suppriment jamais la sélection, `Alt + N` (Windows/Linux) ou `⌥ + N` (Mac) n’ajoute aucune table, et `T` puis `G` ne groupe rien. Dans un champ, ils agissent comme des touches de texte ordinaires : `Ctrl + A` (Windows/Linux) ou `⌘ + A` (Mac) sélectionne le texte du champ, `Delete` et `Backspace` effacent du texte, et `Space` saisit une espace. `Tab` passe d’un élément à l’autre parmi les boutons, les champs et l’arborescence de l’explorateur.  
Les touches propres aux champs Rechercher et Remplacer sont décrites dans [Touches dans les champs de recherche](./find-and-replace.md#keys-in-the-search-fields).  
Les touches que l’éditeur n’utilise pas, comme celles de l’enregistrement ou de la palette de commandes propres à l’hôte, parviennent à l’hôte comme d’habitude.

## Boîtes de dialogue à côté de l’explorateur {#dialogs-beside-it}

La boîte de dialogue [Propriétés de la table](./table-related-functions.md#table-properties), le [configurateur de thème](./language-and-theme.md#theme), le sélecteur [`Display Language`](./language-and-theme.md#picking-a-language), la boîte de dialogue [`Export image`](./file-import-export.md#image) et [Associer les colonnes](./relationship-editing.md#map-columns) laissent l’explorateur ouvert à leur ouverture.

- La boîte de dialogue Propriétés de la table s’ouvre au milieu du canevas, à côté de l’explorateur, et n’assombrit que le canevas. L’explorateur reste utilisable : choisir une ligne ferme la boîte de dialogue, puis mène à la ligne.
- `Export image` et Associer les colonnes assombrissent tout l’éditeur, barre d’outils et explorateur compris. L’explorateur reste ouvert sous la zone assombrie, et un clic à cet endroit ferme la boîte de dialogue, comme un clic n’importe où sur la zone assombrie ; Associer les colonnes se ferme alors sans rien associer.
- Dans une langue d’affichage de gauche à droite, le configurateur de thème et le sélecteur `Display Language` s’ouvrent juste au-delà de l’explorateur au lieu de le recouvrir, et se décalent s’il s’ouvre ou se ferme pendant qu’ils sont affichés. Dans une langue de droite à gauche, ils gardent leur place à droite. Un appui dans l’explorateur les ferme, comme tout appui en dehors d’eux autre qu’un appui sur la barre d’outils.

Ouvrir la recherche avec le raccourci ou une entrée `Toggle Explorer` ferme les cinq, Associer les colonnes se fermant sans rien associer.  
La [recherche rapide](./quick-search.md) laisse aussi l’explorateur ouvert, et `Escape` ne ferme alors que la palette.

## Éditeurs en lecture seule {#read-only-editors}

Dans un éditeur [`readonly`](../../api/erd-editor-element.md#readonly), l’explorateur fonctionne comme dans tout autre éditeur : le bouton de la barre d’outils avec la même info-bulle, le raccourci, les deux entrées `Toggle Explorer`, l’arborescence, le repli, `Collapse All` et l’accès à une ligne, qui sélectionne comme d’habitude l’élément visé. Son titre y affiche aussi `Explorer`.  
Sa recherche ne fait que trouver (voir [Éditeurs en lecture seule](./find-and-replace.md#read-only-editors) dans la page Rechercher et remplacer).
