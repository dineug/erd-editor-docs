---
sidebar_position: 14
description: Conserver les domaines, les mots et les termes du diagramme dans l’onglet Dictionnaire, dériver les noms physiques des noms logiques, laisser un domaine définir le type de données de ses colonnes, lire ce que trouve la feuille Vérifications, modifier et trier les feuilles comme dans un tableur, et les importer et les exporter sous forme de fichiers CSV.
---

# Dictionnaire

L’onglet Dictionnaire contient la norme de nommage du diagramme dans trois dictionnaires, chacun sur une feuille que vous modifiez comme un tableur :

- `Domains` : des types de données nommés, comme `Name` pour `VARCHAR(100)`. Une colonne liée à un domaine a le type de données de celui-ci.
- `Words` : les mots standard qui composent les noms logiques, chacun avec l’abréviation qu’un nom physique utilise pour lui, comme `Customer` et `CUST`.
- `Terms` : des noms logiques complets, chacun avec le nom physique et le domaine qu’il donne, comme `Customer Name` avec `CUST_NM`.

À partir du [nom logique](./logical-names.md) d’une table ou d’une colonne, ces dictionnaires dérivent son nom physique, et le terme d’une colonne peut aussi la lier à un domaine (voir [Dériver les noms physiques](#deriving-physical-names)).  
Une quatrième feuille, `Checks`, liste les problèmes que les dictionnaires trouvent dans les noms et les types du diagramme et dans les dictionnaires eux-mêmes, comme un mot interdit dans un nom logique (voir [La feuille Vérifications](#the-checks-sheet)).

## Ouvrir l’onglet {#opening-the-tab}

Passez à l’onglet `Dictionary` dans la barre d’outils, le bouton à l’icône de livre entre `Code Generator` et `Settings`, ou choisissez `Dictionary` sous `Tab` dans la [recherche rapide](./quick-search.md).  
Il peut être l’onglet sur lequel le diagramme s’ouvre (voir `Canvas Type` dans [Verrouillage](./settings.md#lock)).

L’onglet s’ouvre sur la feuille `Domains` jusqu’à ce que vous en choisissiez une autre.  
À chaque ouverture, la feuille revient avec la sélection et le défilement que vous aviez laissés, ou avec sa première cellule sélectionnée lors d’une première visite. Sa grille reçoit le focus clavier, si bien que la saisie ou les touches fléchées agissent aussitôt.

La feuille affichée, ainsi que la recherche, la sélection, le défilement et la largeur des colonnes de chaque feuille, ne concernent que vous.  
Rien de tout cela n’est enregistré dans le fichier, inscrit dans l’historique d’annulation ou partagé avec les collaborateurs. Ces réglages sont conservés tant que l’éditeur reste ouvert, d’un changement d’onglet à l’autre et d’un document chargé dans le même éditeur à l’autre.

## Les feuilles {#the-sheets}

La barre du haut contient les quatre boutons de feuille, `Domains`, `Words`, `Terms` et `Checks`, et le bouton de la feuille affichée apparaît enfoncé. Chacun affiche un nombre à côté de son nom : les lignes que contient sa feuille, quoi qu’affiche la recherche, ou, sur `Checks`, le nombre de vérifications, coloré selon leur niveau (voir [La feuille Vérifications](#the-checks-sheet)).  
Le champ de recherche vient ensuite (voir [Rechercher](#searching)). Au bout de la barre, sur `Domains`, `Words` et `Terms` et hors d’un éditeur en lecture seule, viennent quatre outils : `Add Row`, `Delete Rows`, `Import CSV` et `Export CSV` (voir [Ajouter et supprimer des lignes](#adding-and-deleting-rows) et [Importer et exporter des fichiers CSV](#importing-and-exporting-csv)).  
Dans un volet étroit ou avec une langue d’affichage aux libellés longs, la barre passe sur plusieurs lignes, si bien que chaque bouton reste accessible.

Sous la grille, une ligne d’état compte les lignes que laisse la recherche, comme `4 rows`, et, tant que la sélection couvre au moins une ligne, combien elle en couvre, comme `1 selected`. Une ligne commune à deux plages compte une fois, si bien que ce nombre est celui des lignes que `Delete Rows` supprimerait.  
Les numéros de ligne, sur la gauche, comptent les lignes telles que la feuille les affiche, à partir de 1. Une cellule en lecture seule, c’est-à-dire toute cellule de `Checks` et toute cellule d’un éditeur en lecture seule, est dessinée sur un fond gris, sauf là où une vérification la marque.  
Une feuille `Domains`, `Words` ou `Terms` vide affiche `Import a CSV file or add a row`, sauf dans un éditeur en lecture seule.

Les colonnes de chaque feuille, dans l’ordre :

| Feuille | Colonnes |
| --- | --- |
| `Domains` | `Domain`, `Category`, `Data Type`, `Description` |
| `Words` | `Word`, `Abbreviation`, `English Name`, `Description`, `Synonyms`, `Forbidden Words` |
| `Terms` | `Term`, `Physical Name`, `Domain`, `Description`, `Synonyms` |
| `Checks` | `Type`, `Target`, `Detail` |

Ce que font les cellules :

- Le `Data Type` d’un domaine s’écrit sous la forme d’un type de colonne, comme `VARCHAR(100)` ou `NUMERIC(15,2)`, et chaque colonne liée au domaine le porte (voir [Domaines et types de données](#domains-and-data-types)).
- L’`Abbreviation` d’un mot est ce qu’un nom physique utilise pour ce mot (voir [À partir des mots](#from-the-words)).
- Les `Synonyms` et les `Forbidden Words` d’un mot listent d’autres mots désignant la même chose, séparés par des virgules. Les espaces autour de chaque élément sont supprimés, un élément vide est écarté, et un élément identique au mot lui-même est ignoré. Un nom logique qui en utilise un ne compose aucun nom physique, et la feuille `Checks` le signale et indique le mot à utiliser à la place (voir [Ce que trouve chaque vérification](#what-each-check-finds)).
- Le `Term` d’un terme est un nom logique complet, et son `Physical Name` est le nom que donne ce nom logique (voir [À partir d’un terme](#from-a-term)).
- Le `Domain` d’un terme affiche le nom du domaine qu’il lie, et reste vide tant qu’il n’en lie aucun ou lie un domaine supprimé depuis (voir [Le domaine d’un terme](#a-terms-domain)).
- `Category`, `English Name`, chaque `Description` et les `Synonyms` d’un terme sont des notes. Ces champs ne changent rien, et aucune vérification ne les lit.

Dans une [langue d’affichage de droite à gauche](./language-and-theme.md#right-to-left-languages), la barre, le menu de la grille et la ligne d’état sont inversés en miroir, tandis que les feuilles et la liste des domaines d’un terme restent de gauche à droite.

## Dériver les noms physiques {#deriving-physical-names}

Les dictionnaires peuvent donner à une table ou à une colonne son nom physique, celui qu’écrivent le Schéma SQL et le générateur de code, à partir de son nom logique. Un terme dont le `Term` est le nom logique est recherché en premier ; à défaut, le nom est composé à partir des abréviations des mots.  
Par exemple, avec les mots `Customer` (`CUST`), `Name` (`NM`), `Number` (`NO`), `Order` (`ORD`) et `Date` (`DT`), et le terme `Customer Number` avec le nom physique `CUST_NO` et le domaine `Number`, dont le type de données est `INT` :

- Le nom logique `Customer Number` nomme une colonne `CUST_NO`, la lie à `Number` et lui donne le type `INT`.
- `Order Date` compose `ORD_DT`.
- Une table dont le nom logique est `Customer` est nommée `CUST`.

Avec une feuille `Words` vide et une feuille `Terms` vide, rien n’est dérivé.

### Quand un nom est dérivé {#when-a-name-is-derived}

Un nom physique est dérivé au moment où un nom logique est écrit :

- Sur le canevas, lorsque l’éditeur de la cellule du nom logique se ferme sur un nom logique différent de celui avec lequel il s’est ouvert, par `Enter`, `Tab`, `Escape` ou un clic ailleurs. Chaque touche que vous tapez n’écrit que le nom logique (voir [Écrire un nom logique](./logical-names.md#writing-a-logical-name)).
- Aussitôt, lorsque vous choisissez un terme dans la liste sous la cellule (voir [Saisie semi-automatique des termes](./logical-names.md#completing-term-names)).
- Lorsqu’un collage écrit une cellule du nom logique (voir [Copier-coller des colonnes](./table-editing.md#copyingpasting-columns)).
- Lorsque [Rechercher et remplacer](./find-and-replace.md#replacing) remplace un nom logique, une correspondance ou toutes.
- Lorsqu’un agent de codage définit un nom logique.

Il n’est dérivé que tant que le nom physique est vide ou a lui-même été dérivé (voir [Vos propres noms](#names-of-your-own)).  
Un terme choisi, un collage ou un remplacement écrit le nom logique et ce qu’il dérive en une seule étape d’annulation. Sur le canevas, le nom dérivé à la fermeture de l’éditeur forme une étape à part après la saisie : la première annulation retire le nom dérivé, avec le domaine et le type qu’un terme a apportés, et laisse le nom logique que vous avez tapé.

Par la suite, rien n’est dérivé à nouveau automatiquement. Une nouvelle `Abbreviation` d’un mot, un nouveau `Physical Name` ou `Domain` d’un terme, et de nouveaux mots ou termes laissent tels quels les noms déjà dérivés ; utilisez pour cela [Dériver à nouveau les noms physiques](#derive-physical-names-again). Le `Data Type` d’un domaine fait exception : il atteint aussitôt ses colonnes.

### À partir d’un terme {#from-a-term}

La feuille `Terms` est d’abord parcourue à la recherche d’un terme dont le `Term` est égal au nom logique. Les espaces de début et de fin et la composition Unicode sont ignorés, mais la casse compte, si bien que `customer number` ne correspond pas à `Customer Number`. De deux termes portant le même nom, c’est le premier de la feuille qui compte.

- Le terme donne son `Physical Name` ou, tant que celui-ci est vide, le nom que composent ses mots, comme ci-dessous, s’ils en composent un.
- Pour une colonne, le terme lie aussi son `Domain` tant que la feuille `Domains` le liste, ce qui donne à la colonne le type de données du domaine (voir [Lier une colonne](#linking-a-column)). Il le fait même lorsque le terme ne donne aucun nom. Un terme sans domaine ne délie rien.
- Une table ne prend que le nom physique du terme.

### À partir des mots {#from-the-words}

Sans terme correspondant, les mots composent le nom :

1. Le nom logique est découpé aux espaces, à `_`, `-`, `·` et `/`, et aucun mot ne s’étend par-delà une coupure.
2. Chaque morceau est lu depuis la gauche, en prenant à chaque position le texte le plus long que liste la feuille `Words`, en tant que `Word`, synonyme ou mot interdit, sans jamais revenir en arrière. Avec les mots `가입`, `가입일` et `일자`, `가입일자` se lit `가입일` et `자`, ce qui laisse `자` non enregistré, tandis que `가입 일자` se lit `가입` et `일자`. La casse compte : `member` n’est pas le mot `Member`.
3. Le nom physique est formé de l’`Abbreviation` de chaque mot, telle qu’elle a été saisie, les abréviations étant reliées par `_`, comme `ORD_DT`. De deux mots portant le même nom, c’est le premier de la feuille qui donne l’abréviation. Aucune limite de longueur ne s’applique, et les paramètres `Table Name Case` et `Column Name Case` du générateur de code n’interviennent pas.

C’est tout ou rien. Si un segment est un synonyme, un mot interdit ou un texte qu’aucun mot ne liste, ou si un mot a une `Abbreviation` vide, aucun nom n’est composé, et le nom physique reste tel quel.

### Vos propres noms {#names-of-your-own}

Les dictionnaires ne remplissent un nom physique que tant qu’il est vide ou qu’ils l’ont eux-mêmes rempli. L’éditeur le retient pour chaque table et chaque colonne, bien que rien ne l’indique sur le canevas.

- Un nom que vous écrivez devient personnel : la saisie dans une cellule du nom, le remplacement d’un nom de table ou de colonne avec Rechercher et remplacer, le collage sur la cellule du nom d’une colonne et le renommage par un agent de codage. Un nom logique écrit plus tard le laisse tel quel, n’écrit que le nom logique et ne lie aucun domaine.
- Effacer le nom le rend aux dictionnaires, puisqu’un nom vide est toujours dérivé.
- Un nom logique qui ne dérive rien laisse le nom physique et son état tels qu’ils étaient : un nom vide reste vide, et un nom dérivé garde sa valeur et reste dérivé.
- Une nouvelle table ou colonne commence avec un nom vide, si bien que son premier nom logique le dérive. Une colonne de clé étrangère qu’ajoute une relation est nommée d’après sa clé, et son nom compte comme personnel (voir [Noms des colonnes de clé étrangère](./relationship-editing.md#foreign-key-column-names)).
- Les noms qu’apporte un `Import` ou un `Import and Add` de Schéma SQL, GraphQL, DBML ou AML, ainsi que les noms d’un diagramme créé par une version antérieure à l’onglet Dictionnaire, comptent comme personnels, si bien qu’un nom logique écrit plus tard sur eux ne dérive rien.
- Une [table dupliquée](./table-related-functions.md#duplicating-tables-and-memos), une colonne [déplacée dans une autre table](./table-editing.md#rearranging-and-moving-columns) par sa poignée de déplacement, un collage de tables copiées et l’`Import and Add` d’un fichier JSON conservent l’état de chaque nom. Les noms des colonnes collées dans des tables sélectionnées comme nouvelles colonnes comptent comme personnels, sauf si le nom collé est vide et que leur nom logique en dérive un.
- [Dériver à nouveau les noms physiques](#derive-physical-names-again) rend un nom personnel aux dictionnaires, y compris un nom importé.

### Deux colonnes, un seul nom {#two-columns-one-name}

Une colonne ne dérive rien lorsqu’une autre colonne de sa table porte déjà le nom qu’elle dériverait. Elle garde son nom, son état et son lien de domaine, et seul son nom logique est écrit. Les noms sont comparés sans tenir compte de la casse ni des espaces de début et de fin, comme le sont les noms des colonnes de clé étrangère.  
Lorsqu’une même modification donnerait le même nom à deux colonnes, comme peuvent le faire `Replace All` ou `Derive Physical Names Again` sur une table, la première de la table le prend.  
Par exemple, une auto-référence sur `members` dont la clé est `MBR_NO` ajoute `MBR_NO_2`, qui copie le nom logique `Member Number`. `Derive Physical Names Again` la nommerait `MBR_NO`, que porte la clé, si bien qu’elle garde `MBR_NO_2`.  
Les tables ne sont pas soumises à cette règle : deux tables peuvent dériver le même nom.

## Dériver à nouveau les noms physiques {#derive-physical-names-again}

Utilisez `Derive Physical Names Again` après avoir modifié l’`Abbreviation` d’un mot ou le `Physical Name` ou le `Domain` d’un terme, puisque ces modifications ne renomment rien d’elles-mêmes. La commande rend aux dictionnaires les noms qu’elle couvre et les dérive à nouveau selon les règles ci-dessus, y compris les noms que vous avez écrits vous-même. Elle n’est proposée que dans l’onglet ERD, et pas dans un éditeur en lecture seule :

- Le menu contextuel de la table, juste après `Focus on this table` ou `Focus on selected tables`. Tant que la table fait partie de deux tables sélectionnées ou plus, `Derive Physical Names Again` les couvre toutes, quel que soit l’endroit de la table où vous cliquez avec le bouton droit. Sinon, un clic droit sur la ligne d’une colonne donne `Derive Physical Name Again`, pour cette seule colonne, et un clic droit sur l’en-tête donne `Derive Physical Names Again`, pour le nom de la table et chaque colonne.
- Le menu contextuel du canevas, juste après `Name View` : `Derive Physical Names Again`, pour chaque table et chaque colonne du diagramme. L’entrée est absente tant que le diagramme n’a aucune table.
- La [recherche rapide](./quick-search.md#what-the-palette-lists), sous forme de lignes pour la colonne active, la table active, les tables sélectionnées et le diagramme entier.

![Modification de l’abréviation de Number de NO en NUM dans la feuille Words, les noms physiques restant MBR_NO et PAY_NO sur le diagramme, puis Derive Physical Names Again, depuis le menu du canevas, qui les change en MBR_NUM et PAY_NUM, tandis qu’ORD_NO, que donne son terme, reste inchangé](/img/demo-derive-physical-names.webp)

Chaque table et chaque colonne couverte qui a un nom logique est dérivée à nouveau. Une colonne prend aussi le domaine que donne son terme, et avec lui le type du domaine, qui se propage le long des relations tant que la [synchronisation du type de données des relations](./settings.md#relationship-datatype-sync) est activée.  
La commande laisse de côté une table ou une colonne sans nom logique, ainsi qu’une colonne dont le nouveau nom est porté par une autre colonne de sa table (voir [Deux colonnes, un seul nom](#two-columns-one-name)). Chacune garde son nom et son état, personnel ou dérivé, et une colonne garde aussi son lien de domaine.  
Un nom logique qui ne dérive rien à ce moment laisse le nom physique tel quel, mais le rend aux dictionnaires, si bien que le prochain nom logique que vous écrivez le dérive.  
La commande forme une seule étape d’annulation, quel que soit le nombre de noms, de liens et de types qu’elle modifie. Seule une exécution qui ne change rien n’enregistre pas d’étape, et rendre un nom personnel aux dictionnaires compte comme une modification, même lorsque le nom contient déjà ce qu’ils donnent.

Le `Physical Name` propre à un terme n’est pas recomposé à partir des mots modifiés ; modifiez donc le terme avant de dériver à nouveau.

## Domaines et types de données {#domains-and-data-types}

Une colonne liée à un domaine porte le `Data Type` du domaine. Lier une colonne lui donne aussitôt ce type.  
Lorsque le `Data Type` d’un domaine change, qu’il soit modifié, collé ou importé dans la feuille `Domains` ou changé par un collaborateur ou un agent de codage, chaque colonne liée à ce domaine prend le nouveau type dans la même étape. Tant que la [synchronisation du type de données des relations](./settings.md#relationship-datatype-sync) est activée, chacune de ces modifications se poursuit le long des relations comme le fait un type saisi ; tant qu’elle est désactivée, seules les colonnes liées changent.  
Renommer un domaine ne change que le nom qu’affichent les cellules Domaine des colonnes.

Une modification de type faite dans la feuille `Domains` s’annule dans cette feuille, avec les types de colonne qu’elle a donnés (voir [Feuilles du dictionnaire](./undo-redo.md#dictionary-sheets)).  
Une annulation ou un rétablissement dans l’onglet ERD qui lie de nouveau une colonne à un domaine, ou qui fait revenir une colonne liée à un domaine, donne à la colonne le type actuel du domaine. Une annulation ou un rétablissement qui remet un autre type délie la colonne.

### Lier une colonne {#linking-a-column}

Une colonne est liée à un domaine par :

- Le choix du domaine dans la cellule Domaine de la colonne, qu’affiche View Option → `Domain`, ou, dans la vue `Logical Names`, dans la cellule du type qui la remplace (voir [La cellule Domaine](./logical-names.md#the-domain-cell)).
- Un nom logique dont le terme donne un domaine (voir [À partir d’un terme](#from-a-term)). Cela ne se produit que tant que le nom est dérivé, donc ni pour un nom personnel, ni pour une colonne dont le nom dérivé est porté par une autre colonne.
- `Derive Physical Name Again` ou `Derive Physical Names Again`, qui lie le domaine du terme de chaque colonne couverte.
- Une relation : une colonne de clé étrangère copie le domaine de sa clé, avec son type et son nom logique (voir [Relations identifiantes](./relationship-editing.md#identifying-relationships)). Une clé dont la copie reçoit un autre type, comme c’est le cas d’une clé serial, ne transmet aucun domaine.
- La duplication de sa table, ou son déplacement dans une autre table par sa poignée de déplacement, qui conservent tous deux le lien. Un collage de tables ou de colonnes copiées ne le conserve que tant que ce diagramme liste le domaine et que le domaine a toujours le type de la colonne copiée, si bien qu’une copie provenant d’un autre diagramme arrive sans lien (voir [Copier-coller des tables et des mémos](./table-related-functions.md#copyingpasting-tables-and-memos)). `Import and Add` ne lie aucune colonne.
- Le nom d’un domaine collé dans une cellule Domaine (voir [Copier-coller des colonnes](./table-editing.md#copyingpasting-columns)).

### Délier une colonne {#unlinking}

- Taper un type dans la cellule `DataType` d’une colonne liée, ou accepter une suggestion, délie la colonne dès que son type diffère de celui de son domaine, et la colonne garde le type que vous avez tapé (voir [Saisie semi-automatique du type de données](./table-editing.md#datatype-autocomplete)). Retaper le type du domaine ne la lie pas de nouveau ; choisissez plutôt le domaine dans sa cellule Domaine. Un collage sur la cellule `DataType` et une modification de type par un agent de codage délient de la même façon.
- Tant que la synchronisation du type de données des relations est activée, chaque colonne qu’atteint une modification de type et dont le nouveau type diffère de celui de son propre domaine est déliée dans la même étape, comme une clé étrangère liée à un domaine qui lui est propre. La boîte de dialogue [Associer les colonnes](./relationship-editing.md#map-columns) délie de la même façon les colonnes dont elle change le type.
- `None` dans la cellule Domaine délie la colonne et conserve son type.
- Modifier ou effacer le `Domain` d’un terme, ou supprimer un terme, ne modifie aucune colonne.

### Supprimer un domaine {#removing-a-domain}

Supprimer la ligne d’un domaine laisse ses colonnes à leur type, et leurs liens demeurent. Les colonnes n’affichent aucun domaine, et la feuille `Checks` liste `Unknown domain` pour chacune d’elles tant que la feuille `Domains` contient encore un domaine. Annuler la suppression dans la feuille `Domains` fait réapparaître les liens.  
Tant que le domaine reste supprimé, taper dans une telle colonne un type autre que celui du domaine la délie définitivement, tout comme `None` dans sa cellule Domaine.  
Le fichier omet ces liens lors de son enregistrement, si bien que le diagramme se rouvre avec ces colonnes déliées.

Un terme lié à un domaine supprimé affiche une cellule `Domain` vide, marquée comme `Unknown domain`. `Delete` ou `Backspace` sur la cellule le délie (voir [Le domaine d’un terme](#a-terms-domain)).

## La feuille Vérifications {#the-checks-sheet}

La feuille `Checks` liste ce que trouvent les vérifications des dictionnaires dans les dictionnaires et dans les tables et colonnes du diagramme. Les vérifications ne font que lire : elles ne changent rien.  
Chaque vérification ne s’exécute que tant que la feuille qu’elle lit contient une ligne, et celles des mots seulement tant que la feuille `Words` contient un mot doté d’un nom, si bien qu’un diagramme aux dictionnaires vides ne liste rien.

![Affichage de Customer Num en rouge et d’Order Stat en ambre dans Logical Names, la feuille Checks listant leurs trois vérifications avec un nombre rouge, un double-clic sur la ligne Forbidden word ramenant à Customer Num sur le diagramme, puis sa nouvelle saisie en Member Number, qui ne laisse qu’une vérification](/img/demo-dictionary-checks.webp)

Ses trois colonnes sont en lecture seule :

- `Type` nomme la vérification (voir [Ce que trouve chaque vérification](#what-each-check-finds)).
- `Target` désigne un mot, un terme ou un domaine par son nom, une table par son nom et une colonne sous la forme `table.column`, la table et la colonne étant nommées comme les nomme l’[affichage des noms](./logical-names.md#beyond-the-canvas), avec `unnamed` là où la vue n’affiche aucun nom.
- `Detail` affiche ce que la vérification a trouvé et, après `→`, ce que les dictionnaires proposent à la place, plusieurs propositions étant séparées par des virgules, comme `멤버 → 회원`. Un côté vide se lit `—`, comme dans `— → NUMERIC(15)`.

Les vérifications des mots viennent en premier, puis celles des termes et des domaines, puis table par table, chaque table suivie de ses colonnes.  
La liste suit chaque modification dès qu’elle arrive, y compris celles d’un collaborateur et d’un agent de codage, ainsi que chaque changement d’affichage des noms.  
Le nombre du bouton `Checks` est rouge tant qu’une vérification est une erreur, ambre tant que toutes sont des avertissements, et atténué quand il n’y en a aucune.

Les lignes ne peuvent être ni modifiées, ni ajoutées, ni supprimées, ni triées, ni importées, ni exportées : la barre n’affiche aucun outil, un clic droit n’ouvre aucun menu de la grille, et Annuler et Rétablir ne font rien. La recherche, la sélection et la copie fonctionnent comme sur les autres feuilles.

`Enter` ou un double-clic sur une ligne mène à ce qu’elle désigne :

- Un mot, un terme ou un domaine : l’onglet affiche sa feuille, sélectionne la cellule que lit la vérification, le nom ou le `Domain` d’un terme, et place sa ligne en haut de la vue. La recherche de la feuille est effacée si elle masque la ligne. Une ligne supprimée depuis ne mène nulle part.
- Une table ou une colonne : l’onglet ERD s’affiche avec la table seule sélectionnée et le focus sur la cellule que lit la vérification. Il s’agit du nom, du nom logique ou de la cellule Domaine, ou, là où la ligne ne dessine pas cette cellule, de la cellule dessinée à sa place. Le canevas reçoit le focus clavier, et la vue se déplace selon la règle décrite dans [Où aboutit un saut](./table-related-functions.md#where-a-jump-lands).

Un double-clic sur un en-tête, un bord de colonne, une barre de défilement ou sous les lignes ne mène nulle part.  
Un agent de codage liste les mêmes vérifications, dans le même ordre, avec `erd_list_checks` (voir [Vérifications du dictionnaire](../../mcp/tools.md#dictionary-checks)).

Les trois autres feuilles marquent les cellules que lisent les vérifications, un nom ou le `Domain` d’un terme, en texte rouge ou ambre sur un fond teinté :

- Rouge : un nom que porte une autre ligne de sa feuille, le `Domain` d’un terme qui lie un domaine supprimé, et un `Term` qui utilise un mot interdit.
- Ambre : un `Term` qui utilise un synonyme ou un mot non enregistré.

Une cellule prend le plus fort de ses niveaux. Les marques s’affichent aussi dans un éditeur en lecture seule, et la feuille `Checks` elle-même n’est pas colorée. Pour les marques sur le canevas ERD, voir [Marques sur le canevas](#marks-on-the-canvas).

### Ce que trouve chaque vérification {#what-each-check-finds}

| `Type` | Niveau | Trouve | `Detail`, par exemple |
| --- | --- | --- | --- |
| `Duplicate name` | Erreur | Un `Word`, un `Term` ou un `Domain` qu’une autre ligne de la même feuille porte aussi. Chacune des lignes est listée. | `Member` |
| `Unknown domain` | Erreur | Une colonne ou un terme encore lié à un domaine supprimé, tant que la feuille `Domains` contient un domaine | Le nom du domaine supprimé |
| `Forbidden word` | Erreur | Un segment d’un nom logique ou d’un `Term` qu’un mot liste dans ses `Forbidden Words` | `커스터머 → 고객` |
| `Unregistered word` | Avertissement | Un segment du nom logique d’une table ou d’une colonne, ou d’un `Term`, qu’aucun mot ne liste | `자` |
| `Synonym` | Avertissement | Un segment qu’un mot liste dans ses `Synonyms` | `멤버 → 회원` |
| `Physical name mismatch` | Avertissement | Une table ou une colonne dont le nom logique correspond à un terme mais dont le nom physique n’est pas celui que donne le terme | `mbr_no → MBR_NO` |
| `Domain type mismatch` | Avertissement | Une colonne dont le `DataType` n’est pas le `Data Type` du domaine qu’elle lie | `INT → NUMERIC(15)` |

- Les noms sont comparés sans leurs espaces de début et de fin, la casse comptant, si bien que `Member` et `member` sont deux noms, et un nom vide n’est jamais en double. Les feuilles refusent une modification qui donnerait le même nom à deux lignes, si bien que `Duplicate name` n’apparaît que là où deux modifications se sont croisées, comme deux collaborateurs nommant des lignes au même moment, ou dans un fichier modifié ailleurs.
- Les vérifications des mots lisent un nom comme le décrit [À partir des mots](#from-the-words), et listent chaque segment différent une fois par nom. `Forbidden word` et `Synonym` proposent le mot qui liste le segment.
- `Physical name mismatch` compare le nom, sans ses espaces de début et de fin, au `Physical Name` du terme, ou à ce que composent ses mots tant qu’il n’en a pas, et ne signale rien tant que le terme ne donne aucun nom. Une colonne de clé étrangère qui a copié le nom logique de sa clé fait apparaître cette vérification chaque fois que son propre nom diffère de celui du terme, comme `members_id → MBR_ID`. `Derive Physical Name Again` corrige l’écart, sauf si une autre colonne porte ce nom.
- `Domain type mismatch` ne résulte jamais des modifications faites dans un seul éditeur, puisqu’une colonne liée finit toujours avec le type de son domaine. Cet écart peut survenir lorsqu’un collaborateur lie une colonne pendant qu’un autre modifie le type de ce domaine, ou dans un fichier écrit ailleurs. Choisir de nouveau le domaine dans la cellule Domaine de la colonne donne à la colonne son type, et `None` la délie. Un lien vers un domaine supprimé n’apparaît que comme `Unknown domain`.

### Marques sur le canevas {#marks-on-the-canvas}

Le canevas ERD écrit dans la couleur de sa vérification un nom que les vérifications signalent :

- Une cellule du nom logique, dans l’en-tête de la table ou dans la ligne d’une colonne, est rouge tant que son nom logique utilise un mot interdit, et sinon ambre tant qu’il utilise un synonyme ou un mot absent de la feuille `Words`.
- Une cellule du nom physique, dans l’en-tête ou dans une ligne, est ambre tant que le terme auquel correspond son nom logique donne un autre nom physique.

Seuls ces deux types de cellule sont marqués, jamais la cellule Domaine ni la cellule `DataType`, si bien que les `Unknown domain` et `Domain type mismatch` d’une colonne n’apparaissent que dans la feuille `Checks`.  
Une cellule n’est marquée que pour ce qu’elle dessine : `Physical Names` ne peut marquer que des noms physiques, `Logical Names` que des noms logiques, et `Both Names` chaque cellule selon ses propres vérifications (voir [Affichage des noms](./logical-names.md#name-view)). Une cellule vide garde la couleur de son texte indicatif, et des dictionnaires vides ne marquent rien.  
Sur l’en-tête d’une table d’un [groupe de tables](./table-groups.md) coloré, une marque ne garde sa couleur que tant qu’elle reste lisible sur la couleur du groupe ; sinon, le nom prend le noir ou le blanc propre à l’en-tête.

Les marques s’affichent sur le canevas ERD, dans le [voyage dans le temps](./undo-redo.md#time-travel) et dans l’aperçu de la [disposition automatique](./table-related-functions.md#auto-layout), y compris dans un éditeur en lecture seule. L’onglet Visualisation, les deux côtés de la [visionneuse de différences](./table-related-functions.md#diff-viewer) et une image exportée n’en dessinent aucune.  
Elles suivent chaque modification au moment où elle se produit, qu’elle touche un nom ou un mot, un terme ou un domaine.

## Rechercher {#searching}

Le champ de recherche affiche `Search` et apparaît sur les quatre feuilles, y compris dans un éditeur en lecture seule. Chaque feuille a sa propre recherche.  
Une ligne correspond lorsque l’une des cellules recherchées contient le texte, sans tenir compte de la casse, de la composition Unicode ni des espaces autour de la recherche. Une correspondance ne s’étend jamais sur deux cellules. Les cellules recherchées :

- `Domains` : `Domain`, `Data Type` et `Description`.
- `Words` : `Word`, `Abbreviation`, `English Name` et `Description`.
- `Terms` : `Term`, `Physical Name` et `Description`.
- `Checks` : les trois, telles qu’elles se lisent dans la langue d’affichage.

Une nouvelle recherche place la sélection sur la première cellule et fait défiler jusqu’en haut.  
Tant que le champ contient du texte, un bouton `x` avec l’info-bulle `Clear search` le vide et laisse le point d’insertion dans le champ. `Escape` dans le champ le vide aussi.  
Dans le champ, `Ctrl + Z` (Windows/Linux) ou `⌘ + Z` (Mac) annule votre saisie, et non la feuille, et les touches de ligne d’[Ajouter et supprimer des lignes](#adding-and-deleting-rows) sont des touches de texte.  
`Add Row` et les insertions effacent d’abord la recherche, puisqu’une ligne vide ne correspond à aucune recherche. Une importation la conserve.

## Sélectionner et se déplacer {#selecting-and-moving}

La grille sélectionne comme un tableur :

- Un clic sélectionne une cellule, et un glissement sélectionne une plage, la feuille défilant quand il atteint son bord. `Shift + click` étend la sélection depuis la cellule active, et `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac) ajoute une autre plage.
- Un en-tête de colonne sélectionne sa colonne, un numéro de ligne sa ligne, et le coin supérieur gauche toutes les cellules, comme le fait `Ctrl + A` (Windows/Linux) ou `⌘ + A` (Mac).
- Sur Mac, `Ctrl + click` est un clic droit (voir [Le menu de la grille](#the-grids-menu)).

Au clavier :

- Les touches fléchées avancent d’une cellule et, avec `Ctrl` (Windows/Linux) ou `⌘` (Mac) enfoncé, vont jusqu’au bord de la feuille dans cette direction.
- `Home` et `End` vont à la première et à la dernière cellule de la ligne et, avec `Ctrl` ou `⌘` enfoncé, à la première et à la dernière cellule de la feuille.
- `Page Up` et `Page Down` avancent d’un écran de lignes.
- Maintenir `Shift` avec l’une des touches ci-dessus étend plutôt la sélection.
- `Tab` et `Shift + Tab` vont vers la droite et vers la gauche, et `Shift + Enter` vers le haut. `Enter` seul modifie la cellule (voir [Modifier les cellules](#editing-cells)).

Lorsque des lignes disparaissent sous la sélection, à la suite d’une annulation ou d’une suppression par un collaborateur, elle est ramenée à l’intérieur des lignes restantes.

Faites glisser le bord droit d’un en-tête de colonne pour redimensionner la colonne, ou double-cliquez sur ce bord pour ajuster la colonne au texte le plus large des lignes visibles. Aucune touche ne redimensionne une colonne.

## Modifier les cellules {#editing-cells}

Taper sur la cellule sélectionnée remplace sa valeur. `Enter`, `F2` ou un double-clic modifie la valeur telle qu’elle est, avec le point d’insertion à sa fin.  
Une cellule contient une seule ligne, si bien qu’une tabulation ou un saut de ligne qui y est collé devient un espace.

- `Enter` écrit la modification et descend, et `Tab` l’écrit et passe à droite. Avec `Shift`, ces touches remontent ou passent à gauche.
- Un clic ailleurs, ou le focus clavier qui quitte la grille, l’écrit aussi.
- `Escape` l’annule.

![Modification de la feuille Words : saisie de NUM sur une cellule et appui sur Enter, insertion d’une ligne avec ⌥ + Enter et remplissage avec Tab, tri par Word depuis le menu de la grille, puis recherche de ord et effacement de la recherche avec Esc](/img/demo-dictionary-editing.webp)

Une modification qui laisse la valeur telle qu’elle était n’écrit rien, et une modification écrite forme une seule étape d’annulation de sa feuille, quelle que soit la quantité de texte saisie.  
`Delete` ou `Backspace`, sans modification en cours, vide chaque cellule sélectionnée, en une seule étape.  
Tant qu’une modification est en cours, les touches d’annulation et de rétablissement annulent et rétablissent votre saisie dans la cellule, et les touches de ligne saisissent du texte (voir [Touches dans l’onglet](#keys-on-the-tab)).  
Toute cellule de `Checks`, et toute cellule d’un éditeur en lecture seule, est en lecture seule et n’ouvre aucune modification.

Lorsqu’une ligne d’une modification, d’un collage ou d’un effacement est refusée, rien n’en est enregistré, et une notification d’erreur en donne la raison, en comptant les lignes et en nommant les trois premières :

- Un nom que porte une autre ligne de la feuille, ou qu’écrit une autre ligne du même collage : `Nothing saved: 1 row shares a name with another row (Member)`, ou `Nothing saved: 2 rows share a name with another row (…)`. Les noms sont comparés sans leurs espaces de début et de fin, la casse comptant, si bien que `Member` et `member` diffèrent. Un nom vide n’est jamais refusé.
- Le `Domain` d’un terme, fourni sous forme d’un texte qu’aucun domaine de la feuille `Domains` ne porte : `Nothing saved: 1 row names an unknown domain (…)`.
- Une ligne qu’un collaborateur a supprimée pendant que vous la modifiiez : `Nothing saved: the row was removed`.

Une écriture peut aller au-delà de sa cellule :

- Un terme qui reçoit un `Term` alors que son `Physical Name` est vide obtient le nom que composent ses mots, lorsqu’ils en composent un (voir [À partir des mots](#from-the-words)). Cela ne se produit qu’une fois : le nom n’est pas recomposé lorsque les mots changent plus tard.
- Le nouveau `Data Type` d’un domaine change le type de chaque colonne liée au domaine, dans la même étape d’annulation (voir [Domaines et types de données](#domains-and-data-types)).

### Le domaine d’un terme {#a-terms-domain}

`Enter`, `F2` ou un double-clic sur la cellule `Domain` d’un terme ouvre une liste sous la cellule, ou au-dessus là où il y a plus de place, avec un champ de recherche qui affiche `Domain`.  
La liste contient `None`, puis chaque domaine nommé dans l’ordre de la feuille `Domains`, et la mise en évidence commence sur le domaine que lie le terme, ou sur `None`. Taper un caractère sur la cellule ouvre la liste déjà filtrée par ce caractère.

- La saisie restreint la liste aux domaines dont le nom contient le texte, sans tenir compte de la casse, retire `None` et met en évidence la première correspondance.
- `↑` et `↓` déplacent la mise en évidence, en rebouclant aux deux extrémités.
- `Enter` ou `Tab` choisit la ligne mise en évidence, et un clic la ligne cliquée, en une seule étape d’annulation. Le terme lie exactement le domaine choisi, même l’un de deux domaines portant le même nom, et `None` le délie.
- `Escape` ou un clic à l’extérieur ferme la liste sans écrire ce qui a été tapé.

Sans domaine nommé dans la feuille `Domains`, le champ s’ouvre sans liste.  
Un texte collé lie le premier domaine listé sous ce nom, un texte vide délie, et un texte identique à ce qu’affiche la cellule conserve le lien tel quel. Tout autre nom est refusé (voir [Modifier les cellules](#editing-cells)). `Delete` ou `Backspace` sur la cellule délie le terme, même d’un domaine supprimé.

## Copier et coller {#copying-and-pasting}

`Ctrl + C` (Windows/Linux) ou `⌘ + C` (Mac) copie la sélection sous forme de texte séparé par des tabulations, une ligne de texte par ligne, comme l’écrivent les tableurs, si bien qu’elle se colle dans un tableur sous forme de cellules. Une tabulation ou un saut de ligne à l’intérieur d’une valeur devient un espace.  
Plusieurs plages ne se copient ensemble que lorsqu’elles couvrent les mêmes lignes, côte à côte, ou les mêmes colonnes, l’une au-dessus de l’autre. Sinon, rien n’est copié, et la notification d’erreur `Nothing copied: the ranges share no rows or columns` apparaît.

`Ctrl + V` (Windows/Linux) ou `⌘ + V` (Mac) colle du texte séparé par des tabulations, comme des cellules copiées depuis un tableur, à partir de la cellule active vers le bas et vers la droite :

- Les guillemets sont collés comme du texte, si bien qu’une cellule de tableur contenant un saut de ligne ne se colle pas en une seule cellule.
- Une valeur unique remplit chaque plage sélectionnée.
- Les lignes au-delà de la dernière ligne sont ajoutées comme nouvelles lignes, dans l’ordre, si bien que coller dans une feuille vide la remplit.
- Les colonnes au-delà de la dernière colonne sont laissées de côté et, une fois le reste enregistré, la notification `Columns past the last one weren't pasted` l’indique.
- Un collage de plusieurs cellules sélectionne ensuite le bloc qu’il a écrit.

Un collage forme une seule étape d’annulation, lignes ajoutées comprises, et il est refusé en bloc en cas de nom en double ou de domaine inconnu (voir [Modifier les cellules](#editing-cells)).  
Une copie, un collage ou un effacement portant sur plus d’un million de cellules ne fait rien, et la notification d’erreur `Nothing done: the selection covers too many cells` apparaît.  
Couper, `Ctrl + X` (Windows/Linux) ou `⌘ + X` (Mac), ne fait rien sur une feuille. La copie et le collage dans cet onglet n’atteignent jamais le diagramme et, tant qu’une modification de cellule est en cours, ils agissent sur le texte de la cellule.

## Ajouter et supprimer des lignes {#adding-and-deleting-rows}

`Add Row` ajoute une ligne vide à la fin de la feuille. Ce bouton efface la recherche, sélectionne la première cellule de la nouvelle ligne et donne le focus clavier à la grille, si bien que la saisie remplit cette cellule.  
`Delete Rows` supprime chaque ligne que couvre la sélection, dans n’importe quelle colonne, et une seule annulation les remet toutes à leur place. Son info-bulle indique la touche qui fait de même.

Avec le focus clavier dans la grille et aucune cellule en cours de modification :

- `Alt + Enter` (Windows/Linux) ou `⌥ + Enter` (Mac) insère sous la sélection autant de lignes vides qu’elle en couvre.
- `Alt + Shift + Enter` (Windows/Linux) ou `⌥ + Shift + Enter` (Mac) les insère au-dessus.
- `Alt + Backspace` ou `Alt + Delete` (Windows/Linux), ou `⌥ + Backspace` ou `⌥ + Delete` (Mac), supprime les lignes que couvre la sélection.

Ces touches font ce que font les entrées d’insertion et de suppression de lignes du menu de la grille (voir [Le menu de la grille](#the-grids-menu)). Une insertion efface la recherche et place les nouvelles lignes juste au-dessus de la première ligne que couvre la sélection, ou juste sous sa dernière. Elle les sélectionne dans la première colonne, la première d’entre elles active, et forme une seule étape d’annulation.

Ces touches sont les raccourcis clavier `Add Column` et `Remove Column` de l’onglet [Raccourcis](./settings.md#shortcuts) des paramètres, si bien qu’un hôte qui les réaffecte avec [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) les déplace aussi. `Alt + Shift + Enter` est la touche `Add Column` avec `Shift` en plus, et n’a pas de ligne propre dans cet onglet.  
Dans une modification en cours et dans le champ de recherche, ce sont des touches de texte, si bien que, sur Mac, `⌥ + Backspace` supprime un mot. Sur `Checks` et dans un éditeur en lecture seule, elles ne font rien. Dans cet onglet, elles n’ajoutent ni ne suppriment jamais de colonne d’une table.  
Dans Obsidian, elles parviennent à l’onglet même là où un raccourci d’Obsidian utilise la même touche.

Une ligne jamais remplie, ou vidée de toutes ses valeurs, s’affiche sur sa feuille et parvient aux collaborateurs, mais le fichier l’omet, si bien qu’elle a disparu quand le diagramme est rouvert.

## Le menu de la grille {#the-grids-menu}

Cliquez avec le bouton droit sur une cellule de `Domains`, `Words` ou `Terms` pour ouvrir le menu de la grille. Une cellule hors de la sélection devient d’abord la sélection.  
Un clic droit sous la dernière ligne ou à droite de la dernière colonne l’ouvre sur la sélection telle qu’elle est, si bien qu’une feuille vide l’ouvre n’importe où sous les en-têtes. La touche Menu ou `Shift + F10` l’ouvre pour la cellule active.

- `Insert 1 row above`, `Insert 1 row below` et `Delete 1 row`, qui comptent chacune les lignes que couvre la sélection, comme `Insert 3 rows above`, avec sa touche à droite (voir [Ajouter et supprimer des lignes](#adding-and-deleting-rows)).
- `Sort by <column>, ascending` et `Sort by <column>, descending`, qui nomment la colonne sur laquelle vous avez cliqué avec le bouton droit, comme `Sort by Word, ascending` (voir [Trier](#sorting)). Ces entrées sont absentes à droite de la dernière colonne.
- `Import CSV` et `Export CSV`, qui font ce que font les boutons de la barre (voir [Importer et exporter des fichiers CSV](#importing-and-exporting-csv)).

Quand aucune ligne n’est affichée, sur une feuille vide ou avec une recherche qui ne correspond à rien, seules les entrées `Insert 1 row below`, `Import CSV` et `Export CSV` apparaissent.  
`Checks` et un éditeur en lecture seule ouvrent à la place le menu propre au navigateur, tout comme un clic droit sur un en-tête ou une barre de défilement.  
Le menu se ferme sur un choix, sur `Escape`, sur un appui ailleurs dans l’onglet, lorsque la sélection ou la feuille change, et lorsque les lignes de la feuille changent, par votre modification ou celle d’un collaborateur.

## Trier {#sorting}

`Sort by <column>, ascending` et `Sort by <column>, descending` réordonnent les lignes de la feuille elles-mêmes, pas seulement la vue. Le nouvel ordre est enregistré dans le fichier, vu par les collaborateurs et suivi par `Export CSV`, et une seule annulation rétablit l’ancien ordre.  
Les lignes se comparent selon le texte qu’affiche la cellule, le `Domain` d’un terme selon le nom du domaine, dans l’ordre alphabétique de la langue d’affichage, les nombres étant comparés par leur valeur, si bien que `2` vient avant `10`. Les cellules vides vont en dernier dans les deux sens, et les lignes égales gardent leur ordre. Trier une feuille déjà dans cet ordre n’enregistre rien.  
La recherche reste telle qu’elle était, tout comme la sélection, dont les cellules contiennent désormais d’autres lignes.

## Importer et exporter des fichiers CSV {#importing-and-exporting-csv}

Chacune des feuilles `Domains`, `Words` et `Terms` s’importe depuis un fichier CSV et s’exporte vers un fichier CSV. Ces fichiers sont propres à l’onglet Dictionnaire : les entrées `Import` et `Export` du menu contextuel du canevas ne les lisent ni ne les écrivent (voir [Importer ou exporter des fichiers](./file-import-export.md)).

### Importer {#importing}

`Import CSV`, dans la barre ou dans le menu de la grille, ouvre le sélecteur de fichiers propre au navigateur pour les fichiers `.csv`, et non la boîte de dialogue d’importation de l’hôte. Choisir de nouveau le même fichier l’importe de nouveau.  
Le fichier va dans le dictionnaire que désigne son en-tête, quelle que soit la feuille affichée, et l’onglet affiche ensuite cette feuille et donne le focus clavier à sa grille. La feuille garde sa recherche, sa sélection et son défilement, si bien que les lignes que masque la recherche, ou les lignes ajoutées sous la vue, restent hors de vue.  
Le fichier est lu en UTF-8, avec ou sans marque d’ordre des octets, ou en EUC-KR lorsqu’il n’est pas en UTF-8 valide, comme les anciens fichiers de la norme coréenne des données publiques.

![Ouverture de l’onglet Dictionary depuis la barre d’outils, puis importation de domaines, de mots et de termes avec Import CSV, chaque fichier faisant passer l’onglet à sa propre feuille et indiquant ce qu’il a ajouté](/img/demo-dictionary-import.webp)

Comment les lignes sont intégrées :

- Chaque ligne dotée d’un nom met à jour la ligne de la feuille portant ce nom, dans les champs pour lesquels le fichier a des colonnes. Les colonnes absentes du fichier laissent ces champs tels quels. Les noms sont comparés sans leurs espaces de début et de fin, la casse comptant.
- Les noms absents de la feuille sont ajoutés après sa dernière ligne, dans l’ordre du fichier.
- Une importation ne supprime jamais de ligne.
- Une ligne au nom vide est ignorée. Lorsque le fichier contient deux fois un nom, la dernière ligne l’emporte et la précédente compte comme ignorée. Les lignes de texte vides ne comptent pas comme des lignes.
- Le domaine d’un terme est trouvé par son nom, le premier domaine de ce nom, et un nom qu’aucun domaine ne porte laisse le terme sans lien ; importez donc d’abord les domaines.

Une importation forme une seule étape d’annulation de cette feuille.  
La notification indique alors, par exemple, `1 added · 1 updated · 2 skipped`. Une ligne identique à celle de la feuille ne compte ni comme ajoutée ni comme mise à jour, si bien qu’importer de nouveau le même fichier ne change rien et n’enregistre aucune étape.  
Tant que les termes du fichier désignent des domaines absents du diagramme, une deuxième ligne nomme les trois premiers, comme `4 unknown domains: 연월일, 금액, 번호`.  
Un fichier dont l’en-tête ne correspond à aucune structure, ou à deux, n’apporte rien, et la notification d’erreur `Couldn't read this file as words, terms or domains` apparaît.

### Structures de fichier {#file-layouts}

Chaque dictionnaire lit deux structures. La première est la structure propre à l’éditeur, celle qu’écrit `Export CSV`, avec les noms des champs comme en-tête :

| Dictionnaire | En-tête | Un fichier requiert |
| --- | --- | --- |
| Words | `name,abbreviation,englishName,description,synonyms,forbiddenWords` | `name`, `abbreviation` |
| Terms | `name,physicalName,domain,description,synonyms` | `name`, `physicalName` |
| Domains | `name,category,dataType,description` | `name`, `dataType` |

Les colonnes peuvent venir dans n’importe quel ordre, la colonne `domain` d’un terme contient le nom du domaine, et toute autre colonne est ignorée. La casse compte dans l’en-tête, et les cellules sont lues exactement telles qu’elles sont écrites, espaces compris.

La seconde est la structure des fichiers de la norme coréenne des données publiques (공통표준) :

| Dictionnaire | Un fichier requiert | Également lus |
| --- | --- | --- |
| Words | `공통표준단어명` | `공통표준단어영문약어명` (abréviation), `공통표준단어 영문명` (nom en anglais), `공통표준단어 설명` (description), `이음동의어 목록` (synonymes), `금칙어 목록` (mots interdits) |
| Terms | `공통표준용어명` | `공통표준용어영문약어명` (nom physique), `공통표준도메인명` (domaine, par son nom), `공통표준용어설명` (description), `용어 이음동의어 목록` (synonymes) |
| Domains | `공통표준도메인명`, `데이터타입` | `공통표준도메인분류명` (catégorie), `공통표준도메인설명` (description), `데이터길이`, `데이터소수점길이` |

Les colonnes `데이터타입`, `데이터길이` et `데이터소수점길이` d’un domaine se combinent en un seul type de données : `NUMERIC(15,2)`, `CHAR(8)`, le type seul là où il n’y a pas de longueur, comme `DATE`, et une échelle de 0 omise, comme dans `NUMERIC(15)`.  
Dans ces fichiers, les espaces de début et de fin des cellules sont supprimés, et les autres colonnes, comme l’historique des révisions, sont ignorées.  
Dans les deux structures, les espaces dans un nom d’en-tête n’ont pas d’importance.

### Exporter {#exporting}

`Export CSV`, dans la barre ou dans le menu de la grille, enregistre la feuille affichée dans la structure propre à l’éditeur : chaque ligne dans l’ordre de la feuille, quoi qu’affiche la recherche, avec le domaine d’un terme écrit par son nom, ou laissé vide pour un domaine supprimé.  
Le fichier est en UTF-8 avec une marque d’ordre des octets et des fins de ligne CRLF, et seul un champ contenant un guillemet, une virgule ou un saut de ligne est placé entre guillemets. Il s’ouvre dans un tableur et se réimporte en donnant les mêmes lignes.  
Il est nommé `<database name>-<timestamp>-words.csv`, `-terms.csv` ou `-domains.csv`, et enregistré comme les autres exportations de l’éditeur (voir [Exporter](./file-import-export.md#exporting)).

`Checks` n’a pas d’exportation, et un éditeur en lecture seule ne propose ni importation ni exportation.

## Annuler et rétablir {#undo-and-redo}

`Domains`, `Words` et `Terms` gardent chacune leur propre historique d’annulation, distinct de celui du diagramme. Dans cet onglet, `Ctrl + Z` et `Ctrl + Shift + Z` (Windows/Linux) ou `⌘ + Z` et `⌘ + Shift + Z` (Mac), ainsi que `Undo` et `Redo` dans la barre d’outils, agissent sur la feuille affichée, et la barre d’outils n’affiche pas `Time Travel`. Sur `Checks`, ils ne font rien.  
La commande Annuler de l’onglet ERD ne défait jamais la modification d’une feuille (voir [Feuilles du dictionnaire](./undo-redo.md#dictionary-sheets)).

## Touches dans l’onglet {#keys-on-the-tab}

Tant que le focus clavier est dans l’onglet, ces raccourcis de l’éditeur agissent (voir [Raccourcis](./settings.md#shortcuts)) :

- `Search`, `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac), ouvre la [recherche rapide](./quick-search.md).
- `Toggle Explorer`, `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac), passe à l’onglet ERD et ouvre l’[explorateur](./explorer.md#opening-and-closing) sur sa recherche.
- `Undo` et `Redo` agissent sur la feuille affichée (voir [Annuler et rétablir](#undo-and-redo)).
- `Add Column` et `Remove Column` insèrent et suppriment des lignes (voir [Ajouter et supprimer des lignes](#adding-and-deleting-rows)).

Tant qu’une modification de cellule est en cours, liste des domaines d’un terme comprise, `Search` et `Toggle Explorer` ne font rien, si bien que le texte saisi n’est pas perdu.

Tout autre raccourci de l’éditeur reste dans l’onglet et n’atteint jamais le canevas : `Alt + N` (Windows/Linux) ou `⌥ + N` (Mac) n’ajoute aucune table, et `Delete` et `Backspace` ne suppriment rien sur le canevas.  
Les touches propres à la grille agissent à la place sur la feuille : `Enter` modifie la cellule, `Delete` et `Backspace` vident les cellules sélectionnées, `Ctrl + A` (Windows/Linux) ou `⌘ + A` (Mac) sélectionne toutes les cellules, et `Escape` annule une modification, ferme le menu de la grille ou vide le champ de recherche. Copier, couper et coller restent aussi dans l’onglet (voir [Copier et coller](#copying-and-pasting)).

## Éditeurs en lecture seule {#read-only-editors}

Dans un éditeur [`readonly`](../../api/erd-editor-element.md#readonly), l’onglet s’ouvre et affiche chaque feuille.  
Changer de feuille, rechercher, sélectionner, faire défiler, redimensionner les colonnes et copier fonctionnent comme d’habitude, tout comme aller à une vérification depuis `Checks` avec `Enter` ou un double-clic. Les marques des vérifications s’affichent aussi.

Aucune cellule n’accepte de modification, de collage ni d’effacement, et chaque cellule qu’aucune vérification ne marque est dessinée sur le fond gris de lecture seule.  
`Add Row`, `Delete Rows`, `Import CSV` et `Export CSV` sont masqués, les touches de ligne ne font rien, et un clic droit ouvre le menu du navigateur. Une feuille vide n’affiche aucune indication, et la barre d’outils n’affiche ni `Undo` ni `Redo`.

## Les collaborateurs et le fichier {#collaborators-and-the-file}

Le fichier du diagramme contient les mots, les termes et les domaines dans l’ordre de leur feuille, y compris celui d’un tri, et omet une ligne qui ne contient aucune valeur.  
Il contient aussi le nom logique de chaque table et de chaque colonne, l’indication que chaque nom physique est dérivé ou non, et le lien de domaine de chaque colonne tant que le domaine est listé. Les vérifications et les marques sont calculées à partir de ces éléments et ne sont jamais enregistrées.

Dans une [session collaborative](../../api/advanced/collaborative-editing.md), les éditeurs voient les modifications de dictionnaire les uns des autres dès qu’elles arrivent, tris et insertions compris. Chacun garde sa propre feuille, sa recherche et sa sélection, et les historiques de ses feuilles ne contiennent que ses propres modifications.  
Une modification ou un collage sur une ligne qu’un collaborateur a supprimée entre-temps n’enregistre rien, et la notification `Nothing saved: the row was removed` apparaît.  
Un éditeur d’une version antérieure à l’onglet Dictionnaire enregistre le diagramme sans ses noms logiques, ses liens de domaine ni ses dictionnaires (voir [Combiner des versions](../../api/advanced/collaborative-editing.md#mixing-releases)).

Un `Import` de Schéma SQL, GraphQL, DBML ou AML conserve les dictionnaires, un `Import` JSON les remplace par ceux du fichier, et `Import and Add` n’en apporte aucun (voir [Importer des fichiers externes](./file-import-export.md#importing-external-files)).  
Un agent de codage modifie les mots, les termes et les domaines, définit les noms logiques et les domaines, dérive à nouveau les noms physiques et liste les vérifications par l’intermédiaire du serveur MCP (voir [Dictionnaires](../../mcp/tools.md#dictionaries) et [Vérifications du dictionnaire](../../mcp/tools.md#dictionary-checks)). Il ne dispose d’aucun outil pour les fichiers CSV.
