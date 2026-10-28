---
sidebar_position: 3
description: Ajouter, sélectionner, réorganiser et supprimer des colonnes, activer ou désactiver les options de colonne, et copier ou coller des colonnes.
---

# Modification des tables

La modification des tables offre pour l’essentiel une expérience d’édition semblable à celle d’Excel.  
L’[affichage des noms](./logical-names.md#name-view) détermine si une table dessine les noms, les noms logiques ou les deux dans son en-tête et ses lignes.  
Le mode édition démarre avec `Enter` ou par un double-clic sur une cellule.  
`Enter` ou `Escape` y met fin. Ce que vous saisissez s’applique au fur et à mesure, si bien que `Escape` conserve le texte au lieu de revenir au texte précédent. Une [cellule Domaine](./logical-names.md#the-domain-cell) fait exception : elle ne fait que choisir dans sa liste et ne conserve jamais ce que vous saisissez. Fermer une [cellule du nom logique](./logical-names.md#writing-a-logical-name) sur un nom logique modifié peut aussi remplir le nom physique.  
`Escape` laisse la cellule active et la table sélectionnée, et un second `Escape` efface les deux. Tant qu’une cellule du nom logique affiche sa [liste des termes](./logical-names.md#completing-term-names), le premier `Escape` ne ferme que la liste.  
Tant qu’une méthode de saisie est encore en cours de composition, `Escape` laisse le mode édition ouvert.

![Ajout d’une table avec Alt + N et saisie de deux colonnes](/img/demo-table-edit.webp)

## Ajouter des colonnes {#adding-columns}

Les colonnes se créent avec le raccourci `Alt + Enter` (Windows/Linux) ou `⌥ + Enter` (Mac), qui ajoute une colonne à chaque table sélectionnée, ou avec le bouton `+` de l’en-tête d’une table, qui en ajoute une à cette table.  
La première cellule de la nouvelle colonne prend le focus, la première que dessine sa ligne dans l’[ordre des colonnes](./settings.md#adjusting-column-order). Avec l’ordre par défaut, c’est son nom, qui, dans la vue `Logical Names`, est son nom logique, et dans la vue `Both Names` sa cellule `Logical Name` (voir [Affichage des noms](./logical-names.md#name-view)).  
Une colonne ajoutée avec `Tab` depuis la dernière cellule, et la clé primaire qu’ajoute le tracé d’une relation à une table parente qui n’en a pas, commencent elles aussi sur cette cellule.

## Touche Tab {#tab-key}

Appuyez sur `Tab` pour passer directement en mode édition dans la cellule suivante.  
Un appui sur `Tab` dans la dernière cellule crée une nouvelle colonne et ouvre sa première cellule en modification (voir [Ajouter des colonnes](#adding-columns)).  
Utilisez `Shift + Tab` pour revenir en mode édition dans la cellule précédente.  
`Tab` et `Shift + Tab` passent par les cellules que dessine la table, dans leur ordre, si bien que l’affichage des noms et View Option → `Domain` déterminent si les cellules du nom logique et les cellules Domaine en font partie (voir [Écrire un nom logique](./logical-names.md#writing-a-logical-name)).  
Les marques de [clé alternative](./table-related-functions.md#alternate-keys) dessinées après la dernière cellule d’une ligne ne sont pas des cellules, si bien que le focus les saute et qu’elles ne s’ouvrent jamais en mode édition.

![Déplacement avec Tab dans les cellules d’une ligne, ajout d’une colonne depuis la dernière cellule et retour en arrière avec Shift + Tab](/img/demo-table-tab.webp)

## Saisie semi-automatique du type de données {#datatype-autocomplete}

Commencez à modifier une cellule `DataType` et saisissez du texte. Les types correspondants de la base de données sélectionnée sont suggérés, et la partie d’une suggestion qui contient littéralement ce que vous avez saisi est mise en évidence.  
La correspondance elle-même est approximative, si bien que `vch` trouve aussi `VARCHAR`.

- `Arrow Up` ou `Arrow Down` : parcourir les suggestions
- `Arrow Right`, `Tab` ou `Enter` : accepter la suggestion mise en évidence
- `Arrow Left` : revenir au texte que vous avez saisi

Vous pouvez aussi cliquer sur une suggestion.  
La liste affiche jusqu’à dix suggestions à la fois et défile pour les autres.  
Rien n’est imposé, si bien qu’un type absent de la liste peut être saisi librement, arguments compris, comme `VARCHAR(255)`. La liste se ferme dès que ce que vous saisissez dépasse un nom de type complet, comme c’est le cas de `VARCHAR(255)` ou de `BIGINT UNSIGNED`.  
Les suggestions suivent la base de données sélectionnée. Changer de base de données modifie ce qui est proposé et laisse les colonnes existantes telles quelles.

Saisir du texte dans la cellule `DataType` d’une colonne liée à un domaine, ou y accepter une suggestion, délie la colonne dès que son type diffère de celui du domaine (voir [Domaines et types de données](./dictionary.md#domains-and-data-types)).  
Dans la vue `Logical Names`, tant que View Option → `Domain` est désactivé, la cellule du type d’une colonne liée à un domaine nommé affiche le nom du domaine, et sa modification ouvre le [sélecteur de domaine](./logical-names.md#the-domain-cell) au lieu de ces suggestions. Une cellule du type qui affiche un type de données le modifie comme ci-dessus.

![Remplissage de cellules DataType à partir de suggestions approximatives avec les touches fléchées, Tab et Enter](/img/demo-data-type-autocomplete.webp)

## Non NULL, Unique, Auto-incrément {#not-null-unique-auto-increment}

Ces trois cellules s’activent ou se désactivent au lieu de contenir du texte.  
Double-cliquez sur l’une d’elles, ou appuyez sur `Enter` lorsqu’elle a le focus, pour inverser son état.

La cellule de l’indicateur Non NULL affiche `N-N` lorsqu’il est activé et `NULL` lorsqu’il ne l’est pas.  
`UQ` et `AI` sont grisés lorsqu’ils sont désactivés et mis en évidence lorsqu’ils sont activés.

![Inversion de l’indicateur Non NULL par un double-clic, et des indicateurs Unique et Auto-incrément avec Enter](/img/demo-column-options.webp)

Les cellules masquées par les [options d’affichage des tables](./table-related-functions.md) ne peuvent être ni activées ni désactivées.

## Sélectionner plusieurs colonnes {#selecting-multiple-columns}

Cinq méthodes sont prises en charge :

- `Shift + Arrow Up/Down` : étendre la sélection d’une ligne à la fois
- `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac) : ajouter une seule colonne
- `Shift + click` : sélectionner la plage depuis la dernière colonne qui a eu le focus
- `Ctrl + Shift + click` (Windows/Linux) ou `⌘ + Shift + click` (Mac) : ajouter cette plage à la sélection
- `Alt + A` (Windows/Linux) ou `⌥ + A` (Mac) : tout sélectionner

![Sélection de colonnes avec Shift + Arrow Down, Ctrl/⌘ + click, Shift + click et Alt + A](/img/demo-column-select.webp)

Pour déplacer ensemble les colonnes sélectionnées, faites glisser la poignée à côté de celle qui a le focus (voir [Réorganiser et déplacer des colonnes](#rearranging-and-moving-columns)).

Un clic droit sur la ligne d’une colonne détermine les colonnes sur lesquelles agit le menu contextuel de la table, quelle que soit la touche de modification enfoncée.  
Sur une ligne déjà sélectionnée, la sélection est conservée et le focus passe sur cette ligne. Sur toute autre ligne, cette ligne seule est sélectionnée. Cela vaut partout sur la ligne, y compris sur l’icône de clé et sur une marque de [clé alternative](./table-related-functions.md#alternate-keys).  
Pour agir sur plusieurs colonnes depuis le menu, comme dans [Clé primaire de colonne](#column-primary-key) ou [Suppression de colonnes](#column-deletion), cliquez donc avec le bouton droit sur l’une des lignes sélectionnées.  
Sur Mac, `Ctrl + click` ouvre aussi le menu, mais il compte comme un simple clic, si bien que sur une cellule il sélectionne cette ligne seule avant que le menu ne s’ouvre.

## Réorganiser et déplacer des colonnes {#rearranging-and-moving-columns}

Une colonne se déplace par sa poignée de déplacement, un petit bouton muni d’une icône de poignée, situé juste à l’extérieur du bord gauche de la table, à côté de la ligne qui a le focus.  
Donnez le focus à n’importe quelle cellule de la colonne, en cliquant dessus ou avec les touches fléchées ou `Tab`, et la poignée apparaît à côté de sa ligne. Aucune ligne n’en a tant que le focus est sur l’en-tête de la table.  
La poignée est dessinée en pâle jusqu’à ce que le pointeur la survole, et le pointeur se change alors en main. Un appui seul ne fait rien : le glissement commence dès que le pointeur bouge, et il peut amener la colonne à un autre endroit de sa table ou dans une autre table.  
Au-dessus des lignes d’une table, les lignes glissées se mettent en place et les lignes autour du point de dépôt s’écartent pour leur faire de la place. Au-dessus du canevas vide, ou de l’en-tête d’une table qui a des colonnes, une copie translucide des lignes suit le pointeur et affiche les cellules du nom et du type de chaque ligne telles que la ligne les dessine dans l’[affichage des noms](./logical-names.md#name-view) actuel.  
Déposez juste sous la dernière ligne d’une table pour déplacer la colonne à la fin de cette table. Une table sans colonne accepte le dépôt n’importe où sur sa surface. La bande située juste à gauche d’une table, où se trouve la poignée, compte aussi comme les lignes de la table, si bien qu’un glissement droit vers le bas le long de la poignée réorganise les colonnes sans que le pointeur entre dans la table.  
Une colonne déplacée dans une autre table conserve son nom logique et son domaine.

![Focus sur une colonne et glissement de la poignée à côté de sa ligne vers une nouvelle position, puis glissement de la poignée d’une autre colonne dans une autre table](/img/demo-column-move.webp)

Pour déplacer plusieurs colonnes à la fois, [sélectionnez-les](#selecting-multiple-columns) et faites glisser la poignée à côté de celle qui a le focus. Tant que la colonne qui a le focus fait partie de deux colonnes sélectionnées ou plus de sa table, la poignée les emporte toutes ; sinon, elle n’emporte que sa propre colonne.  
Aucune touche de modification n’est nécessaire. Maintenir `Alt` (Windows/Linux) ou `⌥` (Mac) enfoncé sur la poignée déplace les colonnes comme un simple glissement et ne duplique rien.

![Sélection de trois colonnes, puis glissement de la poignée à côté de celle qui a le focus dans une autre table, les autres colonnes sélectionnées se déplaçant avec elle](/img/demo-column-multi-move.webp)

Un glissement qui commence sur la ligne d’une colonne plutôt que sur sa poignée déplace la table, comme le fait un glissement sur son en-tête (voir [Déplacer plusieurs tables](./table-related-functions.md#moving-multiple-tables)). `Alt + drag` (Windows/Linux) ou `⌥ + drag` (Mac) sur une ligne duplique la table (voir [Dupliquer des tables et des mémos](./table-related-functions.md#duplicating-tables-and-memos)).  
Aucune poignée n’est dessinée à un zoom de `70%` ou moins, où les tables n’affichent que leur nom, ni dans un éditeur en lecture seule, si bien que les colonnes ne peuvent pas y être réorganisées.  
Un glissement de colonne en cours quand l’éditeur passe en lecture seule prend fin aussitôt : la copie qui suit le pointeur et la main qui saisit disparaissent, et relâcher ne déplace aucune colonne. Les lignes que le glissement avait déjà déplacées restent là où il les a mises.

## Suppression de colonnes {#column-deletion}

Supprime les colonnes sélectionnées de la table qui a le focus. Un clic sur une cellule sélectionne sa colonne, si bien que cliquer sur une cellule et appuyer sur `Delete` supprime cette seule colonne.  
Raccourcis :

- `Delete` ou `Backspace`. Ces touches suppriment les colonnes sélectionnées tant que leur table est le seul élément sélectionné. Sans colonne sélectionnée (le focus sur le nom, le [nom logique](./logical-names.md#name-view) ou le commentaire de la table), avec un autre élément également sélectionné, ou à un zoom de `70%` ou moins, où les tables n’affichent que leur nom, elles suppriment plutôt toute la sélection (voir [Suppression de tables et de mémos](./table-related-functions.md#table-and-memo-deletion)).
- `Alt + Backspace` ou `Alt + Delete` (Windows/Linux), `⌥ + Backspace` ou `⌥ + Delete` (Mac). Ces raccourcis suppriment les colonnes sélectionnées de la table qui a le focus, même lorsque d’autres tables ou des mémos sont aussi sélectionnés. Ils ne suppriment rien pendant la modification d’une cellule ni à `70%` ou moins.

![Suppression d’une colonne, puis de deux colonnes sélectionnées, avec Alt + Backspace](/img/demo-column-remove.webp)

Le menu contextuel de la table fait de même. Lorsque la table est le seul élément sélectionné, cliquez avec le bouton droit sur la ligne d’une colonne : la dernière entrée du menu indique `Delete column`, ou `Delete columns` lorsque cette ligne fait partie de deux colonnes sélectionnées ou plus.

Pendant la modification d’une cellule, les touches `Delete` et `Backspace` ne font qu’effacer du texte. Maintenues enfoncées hors de l’éditeur de cellule, elles ne suppriment qu’une fois.  
Après une suppression, le focus passe à la colonne restante la plus proche au-dessus de celle qui avait le focus. Lorsqu’il n’en reste aucune au-dessus, le focus passe au nom de la table (dans la vue `Logical Names`, au nom logique dessiné à sa place) même s’il reste des colonnes en dessous, si bien que le prochain appui sur `Delete` ou `Backspace` supprime la table plutôt qu’une colonne.  
Les relations et les index qui utilisent une colonne supprimée sont supprimés avec elle. Aucune confirmation n’est demandée, et toute la suppression constitue une seule étape d’annulation.

## Copier-coller des colonnes {#copyingpasting-columns}

Fonctionne comme un Presse-papiers tabulaire.  
Raccourcis : `Ctrl + C` (Windows/Linux) ou `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) ou `⌘ + V` (Mac)

La copie vers un tableur, le collage depuis un tableur et le collage dans la table dont une cellule de colonne a le focus utilisent les cellules qu’affichent les tables, dans l’ordre où elles les affichent (voir [Options d’affichage des tables](./table-related-functions.md#table-view-options), [Modifier l’ordre des colonnes](./settings.md#adjusting-column-order) et [Affichage des noms](./logical-names.md#name-view)). L’affichage des noms modifie le contenu de certaines de ces cellules :

- Dans la vue `Logical Names`, la cellule du nom contient le nom logique, ou rien tant qu’il est vide. Tant que View Option → `Domain` est désactivé, la cellule du type contient le nom du domaine de la colonne là où elle en affiche un, et le type de données sinon.
- Dans la vue `Both Names`, la cellule `Logical Name` est copiée et collée là où la place l’ordre des colonnes.
- Une cellule Domaine affichée contient le nom du domaine, ou rien pour une colonne qui n’affiche aucun domaine.

Les colonnes copiées dans l’éditeur et collées avec un en-tête de table sélectionné, ou dans les autres tables sélectionnées, emportent toutes les cellules des colonnes copiées, y compris les cellules masquées, comme celles des indicateurs Unique et Auto-incrément, ainsi que leurs noms logiques.  
Elles ne conservent un lien de domaine que si ce diagramme liste ce même domaine, et non simplement un domaine du même nom, et que le domaine a toujours le type de la colonne copiée. Sinon, elles arrivent sans lien, avec le type qu’elles avaient à la copie. Leurs noms comptent comme écrits par vous, sauf si un nom collé est vide et que le nom logique en dérive un (voir [Dériver les noms physiques](./dictionary.md#deriving-physical-names)).  
Les marques de [clé alternative](./table-related-functions.md#alternate-keys) comme `AK1.1` ne sont pas des cellules, si bien que la copie et le collage les laissent de côté même lorsqu’elles sont affichées.

Vous pouvez coller de l’éditeur vers Excel et, en sens inverse, d’Excel vers l’éditeur.  
Les valeurs des cellules sont copiées exactement telles qu’elles ont été saisies, si bien qu’une valeur comme `<label>` ou `a &amp; b` arrive inchangée dans un tableur ou un document.  
Les colonnes du tableur sont mises en correspondance avec les cellules visibles selon leur position, et non selon leur nom, si bien que les colonnes de la feuille doivent suivre leur ordre.  
Pour les colonnes ci-dessous, chacune de ces valeurs est lue comme vraie (sans distinction de casse) :

- AutoIncrement : `TRUE`, `1`, `YES`, `Y`
- Unique : `TRUE`, `1`, `YES`, `Y`
- Not Null : `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

En sortie, l’éditeur écrit `TRUE` ou `FALSE` pour AutoIncrement et Unique, et `NOT NULL` ou `NULL` pour Not Null.  
Les cellules des indicateurs Unique et Auto-incrément sont masquées par défaut, si bien que `TRUE` et `FALSE` ne sont écrits et lus qu’une fois ces cellules affichées.

![Collage de quatre colonnes dans un tableur, avec les indicateurs écrits sous la forme TRUE/FALSE et NOT NULL/NULL](/img/demo-copy-column-to-sheet.webp)

![Collage de trois lignes d’un tableur dans une table sous forme de colonnes, avec YES, 1 et NOT NULL lus comme vrais](/img/demo-copy-sheet-column.webp)

L’endroit où aboutit un collage dépend du focus :

- Avec un en-tête de table sélectionné, les lignes collées sont ajoutées comme nouvelles colonnes à chaque table sélectionnée.
- Lorsqu’une cellule de colonne a le focus, les lignes sélectionnées de cette table, puis les lignes situées sous la dernière d’entre elles, sont écrasées dans l’ordre, autant qu’il y a de lignes collées. Les lignes situées entre des sélections distinctes sont sautées. Une ligne écrasée reçoit les valeurs collées dans ses cellules visibles et conserve ses cellules masquées, et les lignes restantes sont ajoutées comme nouvelles colonnes. Toutes les autres tables sélectionnées reçoivent les lignes collées comme nouvelles colonnes.

![Copie de deux colonnes et collage dans deux tables sélectionnées à la fois](/img/demo-copy-column-multi.webp)

Une ligne collée écrit les noms logiques et les domaines de cette façon :

- Un nom logique, issu d’une cellule `Logical Name` ou de la cellule du nom dans la vue `Logical Names`, compte comme saisi en entier. Tant que le nom de la colonne est vide ou encore dérivé, les [dictionnaires](./dictionary.md#deriving-physical-names) en dérivent le nom physique et lient le domaine que donne son terme, sauf si la cellule Domaine de la ligne elle-même en lie un. Un nom que colle la même ligne est conservé et compte comme écrit par vous.
- Une cellule Domaine, ou la cellule du type dans la vue `Logical Names` tant que View Option → `Domain` est désactivé, lie le domaine que nomme son texte si le diagramme en liste un. Tout autre texte, ou une cellule vide, n’en lie aucun et délie la colonne, même d’un domaine du type collé. Un texte de la cellule du type qui ne nomme aucun domaine est lu comme un type de données. Les lignes copiées dans l’éditeur lient plutôt le domaine avec lequel elles ont été copiées, et seulement tant que ce diagramme le liste avec le type copié, comme le font les nouvelles colonnes.
- Un domaine lié donne à la colonne son type de données, sauf si la ligne colle son propre type. Un domaine d’un autre type n’est alors pas lié, et la colonne prend le type collé.
- Dans une ligne sans cellule Domaine, un type collé délie la colonne d’un domaine d’un autre type, comme le fait sa saisie.
- Aucun collage ne propage un type par la [synchronisation du type de données des relations](./settings.md#relationship-datatype-sync).

## Copier-coller des tables et des mémos {#copyingpasting-tables-and-memos}

Lorsqu’aucune colonne n’est sélectionnée dans une table qui a le focus, les mêmes raccourcis copient les tables et les mémos sélectionnés eux-mêmes (voir [Fonctions liées aux tables](./table-related-functions.md)).

## Clé primaire de colonne {#column-primary-key}

Active ou désactive la clé primaire sur la colonne qui a le focus, c’est-à-dire la colonne à laquelle appartient la cellule active.  
Lorsque la colonne qui a le focus fait partie de deux colonnes sélectionnées ou plus, le basculement s’applique à toutes les colonnes sélectionnées : si l’une d’elles n’est pas une clé, toutes deviennent des clés, et si toutes le sont déjà, elles cessent toutes de l’être. Les colonnes hors de la sélection restent inchangées.  
Utilisez le menu contextuel de la table ou le raccourci `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac). Lorsque le basculement porte sur deux colonnes ou plus, l’entrée du menu indique `Primary Key on selected columns` au lieu de `Primary Key`.  
L’icône de clé de la ligne sert uniquement à l’affichage, si bien qu’un clic dessus ne définit pas la clé.

Pour faire de plusieurs colonnes une seule clé composite, [sélectionnez-les](#selecting-multiple-columns), puis appuyez sur `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac), ou cliquez avec le bouton droit sur l’une des lignes sélectionnées et choisissez `Primary Key on selected columns`. Chaque basculement constitue une étape d’annulation.

![Sélection de deux colonnes avec Shift + Arrow Down, puis passage des deux en clé primaire avec ⌥ + K et retrait des deux avec un second appui](/img/demo-column-pk.webp)

## Éditeurs en lecture seule {#read-only-editors}

Dans un éditeur [`readonly`](../../api/erd-editor-element.md#readonly), aucune cellule ne s’ouvre en modification et aucune colonne ne change.  
Un clic sur une cellule ne donne le focus à rien et retire la sélection qu’un saut a laissée. `Enter` et un double-clic n’ouvrent aucun éditeur et ne basculent aucune option, `Tab` est laissé à la page, et les raccourcis qui ajoutent, sélectionnent toutes les colonnes ou suppriment des colonnes, la bascule de clé primaire et un collage ne font rien.  
Aller à une colonne depuis l’[explorateur](./explorer.md#going-to-a-row) ou la [recherche rapide](./quick-search.md) donne le focus à sa cellule. Les flèches déplacent alors le focus de cellule en cellule, la colonne atteinte étant sélectionnée seule, puisque `Shift` n’y ajoute aucune colonne.  
`Ctrl + C` (Windows/Linux) ou `⌘ + C` (Mac) copie toujours la colonne sélectionnée, ou la table qu’un saut a sélectionnée (voir [Copier-coller des colonnes](#copyingpasting-columns)).
