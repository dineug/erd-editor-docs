---
sidebar_position: 7
description: "Supprimer une relation, changer son type, définir ses actions ON DELETE et ON UPDATE, l’associer à des colonnes existantes avec Associer les colonnes, lire la notation des connecteurs et leur tracé autour des tables, travailler avec les relations N:M et identifiantes, et voir ce que les nouvelles colonnes de clé étrangère copient de leur clé et comment elles sont nommées."
---

# Modification des relations

Les relations se tracent depuis le menu contextuel du canevas, la barre d’outils du canevas, la [recherche rapide](./quick-search.md#what-the-palette-lists) ou avec un raccourci (voir [Commencer l’édition](./editing-start.md)).  
Cette page décrit ce que vous pouvez faire d’une relation une fois qu’elle existe, comment la boîte de dialogue [Associer les colonnes](#map-columns) la fait aboutir sur des colonnes que la table enfant possède déjà, et comment sont nommées les colonnes de clé étrangère qu’elle ajoute.

## Suppression {#deletion}

La suppression se fait depuis le menu contextuel de la relation.

![Suppression de la relation entre products et reviews depuis son menu contextuel](/img/demo-relationship-remove.webp)

Il n’existe pas de raccourci pour cela, car une relation ne se sélectionne pas comme une table ou un mémo : `Delete` et `Backspace`, qui suppriment ce qui est sélectionné, ne suppriment jamais une relation isolément (voir [Suppression de tables et de mémos](./table-related-functions.md#table-and-memo-deletion)).  
Les relations sont aussi supprimées avec ce qu’elles relient : supprimer une table supprime toutes les relations qui la touchent, et supprimer une colonne supprime toutes les relations qui l’utilisent.

## Changement de type {#type-change}

Le changement se fait avec `Relationship Type` dans le menu contextuel de la relation.  
Quatre types sont proposés, et le type actuel est coché :

- Zero One
- Zero N
- One Only
- One N

![Changement d’une relation de Zero N à One Only puis à One N dans son menu contextuel](/img/demo-relationship-type.webp)

Ce sont les quatre mêmes types que ceux avec lesquels vous commencez une relation, chacun avec son propre raccourci (voir [Commencer l’édition](./editing-start.md)).

## ON DELETE et ON UPDATE {#on-delete-and-on-update}

Ces actions se définissent avec `On Delete` et `On Update` dans le menu contextuel de la relation, entre `Relationship Type` et `Map Columns`.  
Chacun propose les six mêmes entrées, et l’entrée actuelle est cochée :

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

`Not set` n’écrit aucune clause, si bien que le comportement par défaut de la base de données elle-même s’applique. Une nouvelle relation, tracée ou créée dans [Associer les colonnes](#map-columns), commence avec les deux actions à `Not set`, et choisir `Not set` par la suite efface une action.  
Les deux sont indépendantes : modifier l’une laisse l’autre telle quelle.  
Le connecteur indique ce qui est défini (voir [Lire un connecteur](#reading-a-connector)).  
Une relation copiée-collée ou dupliquée avec ses tables conserve ses deux actions, et l’importation de Schéma SQL, de DBML ou d’AML reprend les actions que déclare le fichier (voir [Importer ou exporter des fichiers](./file-import-export.md)).

![Définition de ON DELETE CASCADE et ON UPDATE RESTRICT sur la relation entre orders et order_items depuis son menu contextuel, son étiquette affichant D:C U:R, puis survol pour relire les deux actions](/img/demo-referential-actions.webp)

Chaque action peut être choisie quelle que soit la base de données.  
Une action que la [base de données](./table-related-functions.md#databases) sélectionnée omet de son Schéma SQL s’accompagne d’une mention atténuée, comme `not in MySQL`. `Not set` n’en porte jamais, et changer de base de données met à jour les mentions.  
Une action ainsi signalée reste enregistrée dans la relation : le connecteur l’affiche, et JSON, DBML et AML la conservent, mais le Schéma SQL de cette base de données omet la clause, si bien que le comportement par défaut de la base de données s’applique.

Le [Schéma SQL](./schema-sql.md) écrit ces actions et omet les autres :

| Base de données | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | aucune |
| PostgreSQL | les cinq | les cinq |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | les cinq | les cinq |

Le Schéma SQL de Snowflake écrit aussi un commentaire qui nomme chaque action omise (voir [Actions référentielles](./schema-sql.md#referential-actions)).

Les actions qu’écrivent les cibles ORM du générateur de code dépendent de la cible comme de la base de données sélectionnée (voir [Générateur de code](./code-generator.md#on-delete-and-on-update)).

## Associer les colonnes {#map-columns}

La boîte de dialogue Associer les colonnes met la clé de la table parente en correspondance avec des colonnes de la table enfant, une ligne par colonne de la clé.  
Chaque ligne utilise une colonne que la table enfant possède déjà ou ajoute une nouvelle colonne de clé étrangère, de sorte qu’une relation peut aboutir sur des colonnes déjà en place.

![Tracé d’une relation Zero N de members vers orders, choix de Map to existing columns et association de id à la colonne existante member_id](/img/demo-map-columns.webp)

Elle s’ouvre de deux façons :

- Pendant le tracé d’une relation, depuis `Map to existing columns` à côté de la table enfant (voir [Création de relations](./editing-start.md#relationship-creation)). `Map` ajoute alors une relation du type en cours de tracé.
- Depuis `Map Columns` dans le menu contextuel de la relation, pour changer les colonnes d’une relation existante. `Save` écrit alors la modification. Un éditeur en lecture seule n’ouvre aucun menu contextuel de relation, si bien que Associer les colonnes ne peut pas y être ouvert.

Le sous-titre de la boîte de dialogue nomme les deux tables et le type de relation, comme `users → posts · One N`. Le type y est affiché mais ne s’y modifie pas : utilisez [Changement de type](#type-change).

Dans toute la boîte de dialogue, y compris les notes et les mentions sous les lignes et la notification sur laquelle elle se ferme, les tables et les colonnes sont nommées comme les nomme l’[affichage des noms](./logical-names.md#beyond-the-canvas).  
Trois éléments restent physiques : chaque type de données, qui est celui de la colonne et jamais le nom de son domaine ; `New column: <name>`, qui affiche le nom que recevra la nouvelle colonne ; et les lignes que `Map` préremplit, en les appariant par nom, jamais par nom logique.

`References` choisit la clé que vise la relation : `Primary Key`, avec ses colonnes dans l’ordre de la table, puis `Unique: <column>` pour chaque colonne marquée `Unique`. Ce sélecteur n’apparaît que lorsqu’il y a plus d’un choix.  
Un index unique ne compte pas comme une clé ici, et une colonne `Unique` qui forme à elle seule toute la clé primaire n’est pas listée deux fois.  
Choisir une autre clé reconstruit les lignes. Une ligne conserve son choix tant que cette colonne est encore dans la table enfant.

Sous les en-têtes `Referenced column` et `Foreign key column`, chaque ligne affiche une colonne de la clé avec son type de données, et une liste des colonnes de la table enfant à lui associer :

- `Pick a column` laisse la ligne vide.
- `New column: <name>` ajoute une nouvelle colonne de clé étrangère. Le nom affiché est celui qu’elle recevra, comme décrit dans [Noms des colonnes de clé étrangère](#foreign-key-column-names), numéroté par rapport aux colonnes de la table enfant et aux autres lignes qui ajoutent une nouvelle colonne. Ce choix n’est pas proposé lorsque le nom serait vide, comme pour une clé sans nom.
- Chaque colonne de la table enfant, sous la forme `<name> (<data type>)`. Une colonne qu’une autre ligne a choisie s’affiche `<name> (<data type>) · in use` et ne peut pas être choisie, si bien que deux lignes ne partagent jamais la même colonne. Une colonne qu’une autre relation utilise déjà peut quand même être choisie, ce qui permet à une colonne comme un `tenant_id` partagé de servir à plusieurs relations.

Avec `Map`, une ligne n’est préremplie que si exactement une colonne de la table enfant, sans tenir compte de la casse, porte le nom que recevrait une nouvelle colonne de clé étrangère pour cette ligne avant toute numérotation `_2`, comme `users_id` pour `id` sur `users` et `member_id` pour `member_id`. Tant que [`Bracket`](./schema-sql.md#database-and-bracket) vaut `None`, la valeur par défaut, le nom construit à partir de la partie table d’un nom de table qualifié par le schéma compte aussi, si bien que `id` sur `public.users` est associé à `public.users_id` ou à `users_id`. Pour une clé `Unique`, le nom même de la colonne de clé compte également, si bien que `vin` est associé à `vin`. Toutes les autres lignes commencent à `Pick a column`.  
Avec `Save`, chaque ligne commence sur la colonne qu’utilise actuellement la relation. Dans les deux cas, choisir une autre clé dans `References` remplit les lignes vides de cette clé d’après les mêmes noms.

Lorsque le type de données d’une colonne choisie diffère de celui que la colonne parente donne à une clé étrangère, une mention sous la ligne le signale.  
Avec la [synchronisation du type de données des relations](./settings.md#relationship-datatype-sync) activée et un type de données sur la colonne parente, elle indique `<column> becomes <type>`, le type que l’association écrira. Sinon, elle indique `Types differ: <parent type> and <child type>`, et la colonne garde son type.

`Map` ou `Save` reste désactivé tant qu’un obstacle subsiste, et un message sous les lignes indique lequel :

- `Pick a foreign key column for every referenced column` : une ligne est encore vide.
- `At least one column must reference a different column` : une relation autoréférencée dans laquelle chaque ligne choisit sa propre colonne parente.
- `These columns are already linked by another relationship` : une autre relation entre les deux mêmes tables relie exactement ces colonnes.
- `<parent> has no key to reference` : avec `Map`, la table parente n’a ni clé primaire ni colonne `Unique`.

`Save` reste aussi désactivé tant que l’association ne diffère pas de l’association actuelle de la relation.  
Avec `Save`, une ligne affiche `(removed)` lorsque sa colonne a quitté sa table. Choisissez une autre colonne de la table enfant ou, pour une colonne parente disparue, choisissez une clé dans `References`. Avec `Map`, une ligne dont la colonne choisie est supprimée revient à `Pick a column`.

Une relation dont les colonnes parentes ne forment pas exactement l’une des clés de la table parente s’ouvre sur un choix supplémentaire à la fin de `References`, `Current columns (not a key)`, qui conserve ces colonnes telles quelles. Lorsque la table parente n’a aucune clé, c’est le seul choix et `References` n’est pas affiché.  
Dans ce cas, le message `The referenced columns are not a key of <parent>`, ou `<parent> has no key to reference` lorsque la table parente n’a aucune clé, est une information, pas une erreur : `Save` fonctionne toujours, si bien que vous pouvez changer les colonnes de la table enfant et conserver la référence.  
Une relation dont les deux listes de colonnes ne peuvent pas être associées, par exemple parce qu’elles n’ont pas la même longueur, affiche des lignes `(invalid)` et garde `Save` désactivé jusqu’à ce que vous choisissiez une clé dans `References`, ou que vous ajoutiez une clé primaire ou une colonne `Unique` à la table parente si elle n’en a pas.

La boîte de dialogue suit le diagramme tant qu’elle est ouverte, y compris les modifications d’un collaborateur ou d’un agent de codage, et conserve vos choix.  
Si les colonnes de la relation ou la clé sur laquelle elle s’est ouverte changent entre-temps, elle ajoute le message `This relationship changed while the dialog was open`.

Ce qu’écrivent `Map` et `Save` :

- `Map` ajoute la relation avec `On Delete` et `On Update` à `Not set`. `Save` ne modifie que les colonnes de la relation, en faisant pointer son côté parent vers la clé choisie dans `References`, et conserve son type ainsi que ses ON DELETE et ON UPDATE.
- Une ligne `New column` ajoute une colonne à la fin de la table enfant, comme le fait le tracé : `NOT NULL`, nommée d’après sa clé, avec le type de données, la valeur par défaut, le commentaire, le nom logique et le domaine de la clé (voir [Relations identifiantes](#identifying-relationships)).
- Une colonne choisie n’est jamais renommée ni liée au domaine de la clé, et son `Not Null`, sa clé primaire, son `Unique`, sa valeur par défaut, son commentaire et son nom logique restent tels quels. Son type de données ne change que lorsque `Relationship DataType Sync` est activé et que la colonne parente a un type de données : elle prend le type que la colonne parente donne à une clé étrangère, le type entier pour une clé de type serial comme pour une nouvelle colonne, et la modification se propage le long des relations comme le fait la synchronisation. Chaque colonne dont la modification change le type, choisie ou atteinte le long des relations, est déliée de son [domaine](./dictionary.md#domains-and-data-types) lorsque son nouveau type diffère de celui du domaine.
- Une colonne que l’association cesse d’utiliser reste dans la table enfant, et n’est plus marquée comme clé étrangère, sauf si une autre relation aboutit encore sur elle.
- Tout ce qu’écrit un `Map` ou un `Save`, nouvelles colonnes, changements de type et suppressions de liens de domaine compris, forme une seule étape d’annulation.

Le fait que la relation soit identifiante ou non, ainsi que la façon dont son extrémité parente est tracée, se déduisent des colonnes associées de la table enfant, comme pour toute relation. Une association aux colonnes de clé primaire de la table enfant la rend aussitôt identifiante, et une association à une colonne qui accepte `NULL` place un cercle à l’extrémité parente (voir [Lire un connecteur](#reading-a-connector)).  
La clé étrangère du Schéma SQL référence la clé que vous avez choisie, comme `REFERENCES vehicle (vin)` pour une clé `Unique`.

Si le diagramme contient déjà l’association lorsque vous cliquez sur `Map` ou `Save`, parce qu’un collaborateur ou un agent de codage l’a faite avant vous, rien n’est écrit.  
S’il a changé au point que l’association ne convient plus, rien n’est écrit et une notification affiche `Couldn't map columns: the diagram changed`.

`Cancel`, le bouton `x`, `Escape` ou un clic sur la zone assombrie hors de la boîte de dialogue la ferme sans rien écrire.  
La zone assombrie couvre tout l’éditeur, barre d’outils comprise, et un [explorateur](./explorer.md#dialogs-beside-it) ouvert reste ouvert en dessous.  
Ouvrir la recherche rapide ferme aussi la boîte de dialogue, tout comme la sortie de l’onglet ERD ou le passage de l’éditeur en lecture seule.  
`Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) la ferme également et place le point d’insertion dans le champ Rechercher de la [recherche](./find-and-replace.md#opening-and-closing) de l’explorateur, en ouvrant l’explorateur s’il est fermé. Dans un éditeur trop étroit pour afficher l’explorateur, le raccourci ferme quand même la boîte de dialogue mais affiche une notification au lieu de déplacer le point d’insertion (voir [Ouvrir et fermer](./explorer.md#opening-and-closing)).  
Si l’une de ses tables ou la relation est supprimée pendant qu’elle est ouverte, elle se ferme avec une notification comme `Map Columns closed: the relationship was removed`.  
Tant qu’elle est ouverte, les raccourcis du canevas, l’annulation et le rétablissement, ainsi que le copier-coller, sont sans effet.

Un agent de codage ne dispose d’aucun outil Associer les colonnes. Il réassocie une relation en la supprimant avec `erd_remove_relationship`, qui conserve ses colonnes de clé étrangère, et en la traçant de nouveau sur des colonnes existantes avec `erd_link_columns`, les deux dans un même `erd_batch` (voir [Outils](../../mcp/tools.md#relationships)).

## Relations N:M {#nm-relationships}

Comme l’éditeur repose sur le modèle physique, une relation N:M s’exprime avec une table d’association, comme illustré ci-dessous.

![Tracé de relations depuis products puis tags vers la table vide product_tags avec ⌘ + ⌥ + 2, avec ajout de product_id puis de tag_id](/img/demo-relationship-n-m.webp)

Lorsque la table d’association possède déjà ses colonnes de clé, comme `product_id` et `tag_id` sur `product_tags`, tracez chaque relation avec `Map to existing columns` et choisissez ces colonnes au lieu d’en ajouter de nouvelles (voir [Associer les colonnes](#map-columns)). Si elles forment la clé primaire de la table d’association, chaque relation est aussitôt identifiante.

L’importation de GraphQL, de DBML ou d’AML construit la table d’association pour vous.  
Une déclaration plusieurs-à-plusieurs arrive sous la forme d’une table nommée `<left>_<right>`, avec le commentaire `Junction table inferred from <left> <-> <right>`, reliée aux deux côtés par des relations identifiantes.  
Voir [Importer ou exporter des fichiers](./file-import-export.md).

## Relations identifiantes {#identifying-relationships}

Tracer une relation en cliquant sur la table enfant, ou avec `Create new columns`, copie chaque clé primaire de la table parente dans la table enfant sous forme de colonne de clé étrangère `NOT NULL`, si bien qu’une nouvelle relation est d’abord non identifiante.  
La copie reprend le type de données, la valeur par défaut, le commentaire et le nom logique de la clé, mais pas `Unique` ni `Auto Increment`, et elle est nommée comme décrit dans [Noms des colonnes de clé étrangère](#foreign-key-column-names).  
Une clé de type serial fait exception pour le type de données : sa copie prend le type entier que stocke le serial. Quelle que soit la base de données, `smallserial` et `serial2` donnent `smallint`, `serial4` donne `integer`, et `bigserial` et `serial8` donnent `bigint`. Un `serial` seul donne `integer` sous PostgreSQL et `bigint unsigned` sous MySQL et MariaDB, et reste `serial` sous toute autre base de données.  
Seul le nom complet du type compte, sans tenir compte de la casse, si bien que `serial(4)` est copié tel quel. Un type écrit en majuscules donne des majuscules : `SERIAL` donne `INTEGER` sous PostgreSQL. Une colonne de clé étrangère déjà typée `serial` dans un diagramme enregistré conserve ce type.  
La copie est aussi liée au [domaine](./dictionary.md#domains-and-data-types) de la clé, à condition que la feuille `Domains` liste ce domaine au moment de la copie et que la copie conserve le type de données de la clé. Ainsi, la copie d’une clé de type serial qui prend un type entier ne lie aucun domaine, tandis qu’un `serial` seul conservé en `serial` le lie.  
Pour rendre la relation identifiante, définissez ces colonnes de clé étrangère de la table enfant comme clés primaires : sélectionnez-les toutes et appuyez une fois sur `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac), ou choisissez `Primary Key` dans le menu contextuel de la table, qui affiche `Primary Key on selected columns` lorsque deux colonnes ou plus sont sélectionnées (voir [Clé primaire de colonne](./table-editing.md#column-primary-key)).

![Activation puis désactivation de product_id comme clé primaire avec Alt + K, son connecteur passant en trait continu, puis discontinu](/img/demo-identifying-relationship.webp)

L’éditeur maintient cette cohérence de lui-même.  
Une relation est identifiante tant que chaque colonne de son côté enfant est une clé primaire, et devient non identifiante dès que l’une d’elles ne l’est pas.

## Noms des colonnes de clé étrangère {#foreign-key-column-names}

Le tracé d’une relation nomme chaque colonne de clé étrangère qu’il ajoute d’après la clé parente que copie cette colonne :

- Un nom de clé d’un seul mot, comme `id`, `ID` ou `uuid`, reçoit en préfixe le nom de la table parente et un trait de soulignement : `id` sur `products` devient `products_id`.
- Un nom de clé de plusieurs mots, comme `member_id`, `userId` ou `UserID`, est conservé tel quel.
- Un nom de clé d’un seul mot identique au nom de la table, sans tenir compte de la casse, est également conservé : `currency` sur `currency` reste `currency`. Une clé qui ne fait que contenir le nom de la table reçoit quand même le préfixe : `username` sur `user` devient `user_username`.

Un nom forme un seul mot lorsqu’il ne contient que des lettres et des chiffres, sans changement de casse.  
Tout autre caractère le divise, si bien que `_id`, `order no` et `order-no` forment plusieurs mots.  
Un changement de casse le divise aussi, lu comme en camelCase : une minuscule suivie d’une majuscule (`userId`), deux majuscules suivies d’une minuscule (`IDCard`, `IDs`), ou une lettre d’une écriture sans casse, comme le hangeul, les kana ou les sinogrammes, à côté d’une lettre avec casse (`회원ID`).  
Les chiffres ne divisent pas un mot, si bien que `id2` et `SHA256` forment un seul mot. Un mot composé écrit dans une seule casse forme aussi un seul mot : `memberid` sur `members` devient `members_memberid`.

Le nom de la table est utilisé tel qu’il est écrit, hormis les espaces qui l’entourent : sa casse, ses espaces intérieurs et ses points sont conservés, il n’est pas mis au singulier, et ni `Table Name Case` ni `Column Name Case` du générateur de code n’interviennent. `Users` avec la clé `ID` donne `Users_ID`.  
Chaque colonne d’une clé composite est nommée séparément : `orders` avec la clé (`tenant_id`, `id`) ajoute `tenant_id` et `orders_id`.

Un nom que la table enfant possède déjà, sans tenir compte de la casse, est numéroté avec `_2`, `_3` et ainsi de suite, en prenant le premier numéro libre.  
Une deuxième relation depuis `users`, de clé `id`, vers la même table ajoute `users_id_2`, et une autoréférence sur `members`, de clé `member_id`, ajoute `member_id_2`.  
Les colonnes d’une même clé composite sont numérotées les unes par rapport aux autres de la même façon, et un nom conservé tel quel réserve sa place en premier : `user` avec la clé (`id`, `user_id`) ajoute `user_id` pour `user_id` et `user_id_2` pour `id`.

Une table parente sans nom laisse le nom de la clé tel quel, numéroté comme tout autre en cas de conflit.  
Une clé sans nom donne une colonne de clé étrangère sans nom.  
Cela inclut la clé primaire que l’éditeur ajoute à une table parente qui n’en a pas, sauf si vous la nommez avant de cliquer sur la table enfant.

Les noms sont fixés au tracé de la relation. Renommer ensuite la table parente ou sa clé ne les renomme pas.  
Les lignes `New column` de la boîte de dialogue [Associer les colonnes](#map-columns) sont nommées selon les mêmes règles, et la liste affiche chaque nom avant que vous le choisissiez.  
Les relations qui arrivent avec leurs colonnes déjà en place (importation, collage, duplication ou association de colonnes existantes dans Associer les colonnes) conservent les noms de ces colonnes.  
Un agent de codage qui ajoute une relation avec `erd_add_relationship` obtient les mêmes noms, types de données, noms logiques et domaines (voir [Outils](../../mcp/tools.md#relationships)).

Une colonne de clé étrangère est nommée d’après sa clé, jamais d’après le nom logique qu’elle copie, et son nom compte comme un nom que vous avez écrit : un nom logique écrit plus tard sur la colonne laisse le nom tel quel, sauf si le nom est vide (voir [Vos propres noms](./dictionary.md#names-of-your-own)).  
Tant que le nom logique copié correspond à un terme qui donne un autre nom, la feuille `Checks` liste donc la colonne sous [`Physical name mismatch`](./dictionary.md#what-each-check-finds). Dériver à nouveau son nom physique la renomme d’après les dictionnaires, sauf si une autre colonne de la table enfant porte déjà le nom qu’ils donnent, sans tenir compte de la casse (voir [Dériver à nouveau les noms physiques](./dictionary.md#derive-physical-names-again)).

## Lire un connecteur {#reading-a-connector}

- Une relation identifiante est tracée en trait continu, une relation non identifiante en trait discontinu.
- L’extrémité enfant porte le symbole de cardinalité du type de relation : un cercle et une barre pour zéro ou un, un cercle et une patte d’oie pour zéro ou N, deux barres pour un seul, et une barre et une patte d’oie pour un ou N.
- L’extrémité parente est un cercle et une barre, comme zéro ou un, lorsqu’au moins une des colonnes de clé étrangère accepte `NULL`, et deux barres, comme un seul, lorsqu’elles sont toutes `NOT NULL`.
- Le survol d’un connecteur le met en évidence avec les colonnes qu’il relie dans les deux tables.

![Survol de trois connecteurs tour à tour, chacun se mettant en surbrillance avec les colonnes qu’il relie](/img/demo-relationship-hover.webp)

Une relation qui définit [ON DELETE ou ON UPDATE](#on-delete-and-on-update) porte une étiquette à côté de son extrémité enfant, comme `D:C U:R` : `D:` suivi de l’action ON DELETE, puis `U:` suivi de l’action ON UPDATE, chacune seulement si elle est définie.  
Les actions sont abrégées d’après la notation d’erwin : `C` pour CASCADE, `R` pour RESTRICT, `SN` pour SET NULL, `SD` pour SET DEFAULT et `NA` pour NO ACTION. Une relation qui ne définit ni l’une ni l’autre n’a pas d’étiquette.  
L’étiquette se place du côté opposé à la table enfant, au-dessus de la ligne lorsque le connecteur quitte le côté gauche ou droit de cette table et à sa droite lorsqu’il en quitte le haut ou le bas, à l’écart du symbole de cardinalité.  
Elle est dessinée dans la couleur du connecteur sur un petit cadre de la couleur de fond du canevas, et se met en surbrillance en même temps que son connecteur. Les étiquettes sont dessinées au-dessus de tous les connecteurs, si bien qu’une ligne qui en croise une passe en dessous.  
Elle affiche l’action enregistrée dans la relation, indépendamment de ce qu’écrit la base de données sélectionnée, si bien que ON DELETE SET DEFAULT s’affiche toujours `D:SD` sous MySQL.

Le survol d’un connecteur qui définit l’une ou l’autre action affiche aussi une info-bulle qui écrit les clauses en toutes lettres, une par ligne, comme `ON DELETE CASCADE` et `ON UPDATE RESTRICT`.  
L’info-bulle apparaît même lorsque l’étiquette est masquée.

Aller à une relation la met en surbrillance : choisir une ligne sous le dossier `Foreign Keys` d’une table dans l’[explorateur](./explorer.md#going-to-a-row), ou une ligne de clé étrangère dans la [visionneuse de différences](./table-related-functions.md#going-to-a-change), dessine son connecteur et son étiquette dans la couleur de survol. Dans la visionneuse de différences, le connecteur est mis en surbrillance de chaque côté qui contient la relation, si bien qu’une clé étrangère ajoutée ne met en surbrillance que le côté actuel, et une clé supprimée que le côté enregistré.  
Le saut sélectionne uniquement la table enfant avec ses colonnes de clé étrangère, la cellule active sur la première d’entre elles ; la relation elle-même n’est, comme toujours, jamais sélectionnée. Pour savoir où va la vue, voir [Où aboutit un saut](./table-related-functions.md#where-a-jump-lands).  
La surbrillance s’éteint au prochain appui du bouton gauche ou droit sur le canevas, que ce soit sur un emplacement vide, une table, un mémo, un groupe de tables ou un connecteur, même un appui qui laisse la sélection inchangée. Aller à une autre ligne ou à une autre correspondance de recherche dans l’explorateur l’éteint aussi, de même qu’aller à une autre ligne dans la visionneuse de différences, de chaque côté où va cette ligne.  
Déplacer la vue avec le bouton central ou l’outil Main la laisse allumée, tout comme réduire ou développer une ligne dans l’explorateur ou la visionneuse de différences, effacer la sélection avec `Escape`, et un saut depuis la [recherche rapide](./quick-search.md) ou le [bouton de carte](./visualization.md#card-buttons) de lien externe du mode Flux.  
La surbrillance n’est pas enregistrée et ne figure pas dans l’historique d’annulation, et les collaborateurs ne la voient pas.

Dans un éditeur [`readonly`](../../api/erd-editor-element.md#readonly), le pointeur éclaire aussi les connecteurs, à la place de l’éclairage qu’un saut a laissé. Posé sur une table, il éclaire chaque connecteur de cette table avec la couleur de survol jusqu’à ce qu’il quitte la table.  
Un clic immobile laisse un éclairage allumé jusqu’au prochain clic de ce genre : sur une table, il éclaire les connecteurs de cette table, sur un connecteur, ce connecteur, et ailleurs, rien. Un glissement déplace alors la vue et laisse cet éclairage tel qu’il était.

Masquez les connecteurs sur le canevas ERD avec l’option d’affichage `Relationship`, ou seulement leurs étiquettes avec l’option d’affichage `Referential Actions`, activée par défaut (voir [Options d’affichage des tables](./table-related-functions.md#table-view-options)).  
Les étiquettes ne sont pas dessinées à `70%` et en dessous, où les tables se réduisent à leur nom.  
Une [exportation en image](./file-import-export.md#image) est toujours dessinée à 100 %, si bien qu’elle dessine les étiquettes quel que soit le zoom du canevas, sauf si une option d’affichage les masque. Avec `Background` désactivé, le cadre derrière chaque étiquette est aussi transparent.  
Le [mode Flux](./visualization.md#flow-mode) de l’onglet Visualisation dessine les connecteurs même avec `Relationship` désactivé, chacun sous la forme d’une seule courbe grise continue et lisse avec les mêmes marques d’extrémité, si bien que le trait discontinu, les étiquettes, l’info-bulle, la surbrillance après un saut et le tracé orthogonal décrits dans cette page ne s’appliquent qu’au canevas ERD. Une relation d’une table vers elle-même s’incurve aussi autour du coin supérieur droit en mode Flux (voir [Tracé des connecteurs](#connector-routing)).

## Tracé des connecteurs {#connector-routing}

Les connecteurs suivent un tracé orthogonal, et leurs angles sont arrondis.  
Un tracé contourne les tables qui lui barrent la route au lieu de les traverser. Lorsque tout tracé de quelques coudes entre ses deux extrémités traverserait une table, comme dans un diagramme encombré, le connecteur prend un chemin de contournement avec autant de coudes qu’il en faut. Il ne traverse encore une table que lorsqu’aucun chemin de contournement n’est trouvé.  
Un connecteur quitte ses deux tables par une paire de côtés qui se font face partout où il en existe une, et chaque extrémité quitte sa table par un court segment droit avant de tourner, si bien que deux tables proches dont les extrémités du connecteur sont alignées sont reliées par une seule ligne droite plutôt que par un détour.  
Deux tables qui se font face et sont plus rapprochées que cela, même à moins de `40px` l’une de l’autre, gardent leurs côtés en regard, et lorsque leurs extrémités ne sont pas alignées, le connecteur fait un décrochement dans l’intervalle qui les sépare plutôt que de passer sous l’une d’elles.  
Les tracés qui quittent le même côté d’une table sont répartis dans des couloirs distincts afin de ne pas se chevaucher.  
Seules les tables sont évitées : un connecteur peut traverser un mémo ou le cadre d’un groupe de tables, et il est dessiné au-dessus des groupes de tables et en dessous des tables et des mémos.

Une relation d’une table vers elle-même est dessinée sous la forme d’une seule courbe autour du coin supérieur droit de la table, qui part du côté supérieur à l’extrémité parente et entre par le côté droit à l’extrémité enfant.  
Les autoréférences supplémentaires sur la même table s’emboîtent à l’extérieur de la première, si bien que leurs courbes ne se croisent ni entre elles ni avec la table.

Il n’y a rien à configurer.  
Les tracés sont recalculés automatiquement chaque fois qu’un élément du canevas est déplacé ou redimensionné, si bien qu’il n’est jamais nécessaire d’y toucher à la main.  
Pendant un glissement, les connecteurs des tables que vous déplacez les suivent, et tous les autres conservent le tracé qu’ils avaient au début du glissement. Quand vous relâchez, chaque connecteur que le déplacement fait changer de tracé est redessiné, par exemple celui qui contourne désormais une table déposée sur son chemin, ou celui qui se redresse une fois qu’une table s’est écartée de son trajet.

Un diagramme dessine les mêmes tracés dans toutes les fenêtres qui l’affichent dans le même affichage des noms : celle qui est restée ouverte pendant que les tables bougeaient, celle qui vient d’ouvrir le diagramme et celle d’un collaborateur, et une [image exportée](./file-import-export.md#image) les dessine aussi. L’affichage des noms compte parce qu’il change la largeur des tables (voir [Affichage des noms](./logical-names.md#name-view)).

![Glissement de la table members vers le bas puis retour, pendant que le connecteur venant d’orders alterne entre un passage à droite de categories et un contournement par sa gauche, tous les angles arrondis](/img/demo-connector-routing.webp)
