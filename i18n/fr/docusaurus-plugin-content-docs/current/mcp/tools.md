---
sidebar_position: 4
description: "Tous les outils qu’offre le serveur MCP erd-editor : la lecture d’un document page par page, les 54 outils d’édition, erd_batch et la forme d’un résultat et d’un refus."
---

# Outils

Le serveur offre 63 outils : cinq outils de session, trois outils de lecture, 54 outils d’édition, un par opération d’édition, et `erd_batch`, qui exécute plusieurs outils d’édition comme une seule modification.

Tous les outils sauf `erd_list_documents` prennent le `path` du document comme premier argument, et les tableaux ci-dessous l’omettent.
Un argument marqué `?` est facultatif.

## Outils de session {#session-tools}

| Outil | Arguments | Ce qu’il fait |
| --- | --- | --- |
| `erd_list_documents` | | Liste les documents ERD avec `path`, `open`, `active`, `dirty` et `readonly` : ceux de l’éditeur qui prend en charge le répertoire de travail, ce qui, dans un IDE JetBrains, couvre tous les projets ouverts, et sinon les fichiers ERD situés sous le répertoire de travail. |
| `erd_open_document` | `create?` | Ouvre un document pour le modifier, dans l’ERD Editor de l’éditeur qui le prend en charge, s’il y en a un. Avec `create`, il crée d’abord le fichier s’il est absent, et un nom sans extension reçoit `.erd.json`. |
| `erd_save` | | Enregistre un document que détient un éditeur. VS Code garde les modifications de l’agent non enregistrées jusqu’à l’appel de cet outil ; Obsidian et un IDE JetBrains les enregistrent comme ils enregistrent les vôtres, et cet outil les écrit immédiatement. En mode sans interface, chaque modification est déjà écrite et cet outil ne fait rien. |
| `erd_undo` | | Annule la dernière modification faite par cet agent, jamais les vôtres. Les appels qui n’ont créé aucune étape d’annulation sont sautés et nommés. |
| `erd_redo` | | Réapplique la modification que `erd_undo` a annulée en dernier. |

Pour ce que font l’enregistrement et l’annulation dans chaque mode, voir [En direct et sans interface](./live-and-headless.md).

## Lire un document {#reading-a-document}

| Outil | Arguments | Ce qu’il fait |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Les paramètres et les décomptes, puis une page de tables avec leurs index et leurs relations, chaque table avec son id, sa position et sa taille sur le canevas, son nombre de colonnes et son groupe de tables si elle fait partie d’un groupe. Sauf lors d’une recherche, les groupes de tables puis les mémos suivent les tables. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?` | Les entités désignées, au complet : les tables avec leurs colonnes et leur groupe de tables, les relations avec leurs colonnes et leurs `onDelete` et `onUpdate`, les index avec leurs colonnes, les mémos avec leur texte, les groupes de tables avec leurs tables. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `tableIds?`, `tableNames?`, `groupNames?` | Le document entier d’un seul coup dans l’un des quatre formats, ou le DDL de quelques tables ou groupes de tables seulement. |

Un agent trouve les id avec `erd_list`, lit les colonnes et les autres détails avec `erd_get`, et transmet ces id aux outils d’édition.
La taille d’une table dans `erd_list` est le cadre qu’elle occupe sur le canevas : la hauteur exacte, la largeur approximative.
Un groupe de tables est listé par le rectangle qu’il stocke, avec son nom, sa couleur et le nombre de tables qu’il contient.
Chaque relation est listée une seule fois, avec l’une de ses deux tables.
Les paramètres que rapportent `erd_list` et `erd_read` sont ceux qu’enregistre le fichier (voir [Paramètres](#settings)).

`erd_read` prend l’un des quatre formats suivants :

| `format` | Ce qu’il renvoie |
| --- | --- |
| `snapshot` | Un JSON compact avec chaque entité et son id, groupes de tables compris, et les paramètres avec les scripts de Schéma SQL. Il omet ce qui diffère d’un utilisateur à l’autre : les largeurs mesurées, l’ordre d’empilement, la vue et l’onglet. Volumineux sur un grand schéma. |
| `sql` | Le DDL de l’un des huit SGBD, `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` ou `SQLite`. `vendor` a pour valeur par défaut la base de données définie pour le document. Le DDL du document entier comprend ses scripts avant et après les tables. Avec `tableIds`, `tableNames` ou `groupNames`, seulement ces tables, avec les clés étrangères qu’elles contiennent, et aucun script. Les clés étrangères portent leurs actions ON DELETE et ON UPDATE, sauf celles que la base de données cible omet (voir [ON DELETE et ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update)). |
| `json` | Le document entier, exactement tel qu’un enregistrement écrit le fichier, y compris les modifications que l’éditeur n’a pas encore enregistrées (voir [Forme de stockage et valeur d’exécution](../api/advanced/schema.md#storage-form-and-runtime-value)). |
| `scripts` | Les seuls scripts avant et après les tables du document, sous la forme `{"before":"…","after":"…"}`, chacun vide s’il n’est pas défini, quelle que soit la taille du schéma. |

Seul le format `sql` prend `vendor`, `statements`, `header`, `tableIds`, `tableNames` et `groupNames`, et tout autre format les refuse.

- `statements` : `create`, la valeur par défaut ; `ifNotExists`, qui écrit `CREATE TABLE IF NOT EXISTS` sur MySQL, MariaDB, PostgreSQL, SQLite et Databricks et un simple `CREATE TABLE` sur les autres ; ou `recreate`, qui supprime les tables avant de les créer, là où Snowflake écrit plutôt `CREATE OR REPLACE TABLE`.
- `header` : `none`, la valeur par défaut ; `use`, qui sélectionne la base de données ou le schéma que désigne le nom de base de données du document ; ou `createAndUse`, qui le crée d’abord. Oracle n’a que `use`, donc `createAndUse` y écrit `use`, et PostgreSQL n’a que `createAndUse`, donc `use` n’y écrit aucun en-tête. SQLite n’en écrit aucun, et aucune base de données n’en écrit tant que le nom de base de données est vide ou n’est pas un identifiant simple.
- `groupNames` : les tables des groupes de tables nommés, par nom sans tenir compte de la casse, réunies avec celles de `tableIds` et `tableNames`. Un nom qui ne correspond à aucun groupe est refusé avec `notFound`. Un groupe qui ne contient aucune table n’en ajoute aucune, et une lecture qui se retrouve sans aucune table, comme lorsque tous les groupes nommés sont vides et qu’aucune table n’est nommée, est refusée avec `invalidArgs`.

`statements` et `header` s’appliquent aussi au DDL de quelques tables. Ils fonctionnent comme les options `Statements` et `Header` de l’onglet [Schéma SQL](../guide/guides/schema-sql.md#options-panel) de l’éditeur, bien que l’onglet démarre sur `If not exists` et `CREATE + USE`.
Les noms sont encadrés selon le type de délimiteur qu’enregistre le fichier, le type verrouillé tant que `Bracket Type` est verrouillé (voir [Verrouillage](../guide/guides/settings.md#lock)).

### Schémas volumineux {#large-schemas}

Les schémas de centaines ou de milliers de tables fonctionnent aussi.
Une lecture renvoie au plus 40 000 caractères, sous le seuil à partir duquel Claude Code met un résultat d’outil de côté dans un fichier.

- `erd_list` renvoie une page de 100 par défaut, d’abord les tables, puis les groupes de tables, puis les mémos, et indique où commence la page suivante avec `nextOffset` et une `note`. Passez ce `nextOffset` comme `offset`, avec le même `query`.
- `query` trouve les tables par des mots présents dans un nom ou un commentaire de table ou de colonne, sans tenir compte de la casse. Les tables dont les noms contiennent le plus de ces mots viennent en premier. Une recherche ne liste ni groupes de tables ni mémos.
- `namesOnly` liste uniquement les noms de table, environ 2 000 noms courts dans une réponse.
- `erd_get` et `erd_read` prennent `tableNames` en plus des id, et `erd_read` prend `groupNames`, si bien qu’un agent sollicité pour une requête SQL sur un grand schéma lit le DDL des seules tables dont il a besoin.
- `erd_get` liste sous `missing` les id et les noms qui ne désignent rien, et sous `notReturned` les id qui ne tiennent pas dans une réponse, à redemander.
- Une lecture trop volumineuse pour une seule réponse est refusée avec `tooLarge` et l’indication de la manière de la restreindre.

## Outils d’édition {#edit-tools}

Les id proviennent de `erd_list` et `erd_get`, ou des `createdIds` de l’appel qui a créé l’entité.
Un nouvel id se compose de 25 lettres minuscules et chiffres, comme `03h17be2plxpj5n59tqag7ogj`, tandis qu’un id que le document contient déjà garde sa forme : ne déduisez donc rien de la forme d’un id.
`x` et `y` sont les bords gauche et supérieur sur le canevas, en pixels, et une couleur est une couleur hexadécimale CSS comme `#3b82f6`, ou une chaîne vide, qui retire la couleur.

### Tables {#tables}

| Outil | Arguments | Ce qu’il fait |
| --- | --- | --- |
| `erd_add_table` | | Ajoute une table vide à un emplacement libre et renvoie son id dans `createdIds`. |
| `erd_remove_table` | `tableId` | Supprime une table avec ses colonnes, ses index et toutes les relations qui la touchent. |
| `erd_change_table_name` | `tableId`, `value` | Renomme une table. |
| `erd_change_table_comment` | `tableId`, `value` | Définit le commentaire d’une table. Une chaîne vide l’efface. |
| `erd_change_table_color` | `tableId`, `color` | Définit la couleur d’une table. |
| `erd_move_table` | `tableId`, `x`, `y` | Déplace une table vers une position sur le canevas. |
| `erd_move_tables` | `positions` | Déplace plusieurs tables en une seule modification, qu’un seul `erd_undo` annule. `positions` contient `{ tableId, x, y }` par table, chaque table au plus une fois. |
| `erd_sort_tables` | | Place toutes les tables en lignes sur le canevas, les tables ayant le moins de colonnes en premier, comme les placent `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` et `erd_import_aml`. Les tables d’un groupe de tables restent ensemble, et le cadre de chaque groupe est ajusté autour d’elles. |

### Colonnes {#columns}

| Outil | Arguments | Ce qu’il fait |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Ajoute une colonne vide à une table et renvoie son id dans `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Supprime des colonnes d’une table, avec les relations et les entrées d’index qui les utilisent. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Renomme une colonne. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Définit le type de données, comme `INT` ou `VARCHAR(255)`. Tant que la [synchronisation du type de données des relations](../guide/guides/settings.md#relationship-datatype-sync) est activée, la modification suit les relations dans les deux sens, comme dans l’éditeur : un type serial atteint les clés étrangères sous la forme du type entier qu’il stocke, comme le copie `erd_add_relationship`, et une clé serial garde son type quand l’une de ses clés étrangères change, ce qui arrête la modification à cet endroit. C’est à l’utilisateur d’activer ou de désactiver la synchronisation, et `erd_list` la rapporte sous le nom `relationshipDataTypeSync`. |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Définit la valeur par défaut, sous forme de texte SQL. Une chaîne vide l’efface. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Définit le commentaire. Une chaîne vide l’efface. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` intègre la colonne à la clé primaire, `false` l’en retire. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | Définit si la colonne est unique. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | Définit si la colonne est `NOT NULL`. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | Définit si la colonne est en auto-incrément. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | Déplace une colonne au sein de sa table vers la position d’une autre colonne. |

### Relations {#relationships}

`relationshipType` est la cardinalité côté enfant : `ZeroOne`, `ZeroN`, `OneOnly` ou `OneN`.
La table de départ est la parente, le côté référencé qui porte la clé primaire, et la table d’arrivée est l’enfant.
`onDelete` et `onUpdate` sont les actions ON DELETE et ON UPDATE de la clé étrangère : `none`, `noAction`, `cascade`, `setNull`, `setDefault` ou `restrict`.
`none` n’écrit aucune clause, si bien que le comportement par défaut de la base de données s’applique (voir [ON DELETE et ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update)).
Une action omise dans `erd_add_relationship` ou `erd_link_columns` vaut `none`.

| Outil | Arguments | Ce qu’il fait |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Crée une relation entre deux tables. Il copie la clé primaire de la parente dans l’enfant sous forme de colonnes de clé étrangère, en créant d’abord une colonne de clé primaire si la parente n’en a pas. Chaque colonne de clé étrangère est nommée comme la nomme le tracé d’une relation dans l’éditeur : la clé `id` de `users` donne `users_id`, et une clé comme `member_id` garde son nom (voir [Noms des colonnes de clé étrangère](../guide/guides/relationship-editing.md#foreign-key-column-names)). Chacune copie le type de données de sa clé, sauf qu’une clé serial donne le type entier qu’elle stocke, comme `integer` pour `serial4`, et qu’un `serial` seul reste `serial` hors de PostgreSQL, MySQL et MariaDB (voir [Relations identifiantes](../guide/guides/relationship-editing.md#identifying-relationships)). `createdIds` contient cette nouvelle colonne de clé si elle a été créée, les colonnes de clé étrangère, et l’id de la relation en dernier. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Trace une relation entre des colonnes qui existent déjà, en appariant les colonnes de départ et d’arrivée par position. Il ne renomme aucune colonne et ne change aucun type de données. |
| `erd_remove_relationship` | `relationshipId` | Supprime une ligne de relation. Ses colonnes de clé étrangère restent dans la table. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Change la cardinalité d’une relation. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Définit l’action ON DELETE d’une relation : ce que la suppression d’une ligne parente fait à ses lignes enfants. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Définit l’action ON UPDATE d’une relation : ce que la modification d’une clé parente fait à ses lignes enfants. |

`erd_add_relationship` nomme les colonnes de clé étrangère au moment où il s’exécute : nommez donc d’abord la table parente et sa clé primaire.

Aucun outil ne change les colonnes d’une relation existante comme le fait la boîte de dialogue [Associer les colonnes](../guide/guides/relationship-editing.md#map-columns) de l’éditeur.
Pour associer une relation à d’autres colonnes, exécutez `erd_remove_relationship`, qui laisse ses colonnes de clé étrangère dans la table, et `erd_link_columns` avec les colonnes voulues, dans un seul `erd_batch`, qu’un seul `erd_undo` annule.

### Index {#indexes}

Un id de colonne d’index est une entrée de la liste de colonnes de l’index que donne `erd_get`, et non l’id de la colonne de la table.

| Outil | Arguments | Ce qu’il fait |
| --- | --- | --- |
| `erd_add_index` | `tableId` | Ajoute un index vide à une table et renvoie son id dans `createdIds`. |
| `erd_remove_index` | `indexId` | Supprime un index. |
| `erd_change_index_name` | `indexId`, `value` | Renomme un index. |
| `erd_set_index_unique` | `indexId`, `value` | Définit si l’index est unique. |
| `erd_add_index_column` | `indexId`, `columnId` | Ajoute une colonne de la table de l’index et renvoie l’id de la nouvelle colonne d’index. Une colonne déjà présente dans l’index reste inchangée. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | Retire une colonne d’un index. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | Déplace une colonne au sein d’un index vers la position d’une autre de ses colonnes. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | Définit l’ordre de tri d’une colonne dans un index, `ASC` ou `DESC`. |

### Mémos {#memos}

| Outil | Arguments | Ce qu’il fait |
| --- | --- | --- |
| `erd_add_memo` | | Ajoute un mémo vide à un emplacement libre et renvoie son id dans `createdIds`. |
| `erd_remove_memo` | `memoId` | Supprime un mémo. |
| `erd_change_memo_value` | `memoId`, `value` | Remplace le texte d’un mémo. |
| `erd_change_memo_color` | `memoId`, `color` | Définit la couleur d’un mémo. |
| `erd_move_memo` | `memoId`, `x`, `y` | Déplace un mémo vers une position sur le canevas. |
| `erd_resize_memo` | `memoId`, `width`, `height` | Redimensionne un mémo. La largeur doit être d’au moins `116` pixels environ et la hauteur d’au moins `100`. Il ne crée aucune étape d’annulation, car l’éditeur n’enregistre le redimensionnement d’un mémo qu’à partir d’un glissement. |

Tant que les mémos sont masqués avec [View Option](../guide/guides/table-related-functions.md#table-view-options) → `Memos`, `erd_add_memo` en ajoute quand même un, qui reste masqué jusqu’à ce que les mémos soient de nouveau affichés.
`erd_list` et `erd_get` listent aussi les mémos masqués.

### Groupes de tables {#table-groups}

Un groupe de tables est un cadre nommé tracé derrière ses tables, et sa couleur apparaît sur le cadre et sur toute la largeur des en-têtes de ses tables (voir [Groupes de tables](../guide/guides/table-groups.md)).
Une table appartient au plus à un groupe. `erd_move_table`, `erd_move_tables` et `erd_move_table_group` ne changent jamais les tables que contient un groupe, où qu’ils placent une table, alors que dans l’éditeur une table rejoint ou quitte un groupe là où elle est déposée (voir [Ajouter et retirer des tables](../guide/guides/table-groups.md#adding-and-removing-tables)). `erd_add_table_group` et `erd_set_table_group` placent des tables dans un groupe, et `erd_remove_table_group` laisse ses tables hors de tout groupe.
Un groupe stocke un rectangle d’au moins `160` pixels de large et `100` de haut, barre de titre comprise, et l’éditeur trace le cadre agrandi de façon à contenir chacune de ses tables.

| Outil | Arguments | Ce qu’il fait |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | Ajoute un groupe et renvoie son id dans `createdIds`. Passez soit `tableIds`, soit un rectangle, `x`, `y`, `width` et `height` ensemble. Avec `tableIds`, chaque table quitte le groupe dont elle faisait partie, et le rectangle est ajusté autour d’elles comme l’ajuste le [regroupement des tables sélectionnées](../guide/guides/table-groups.md#grouping-selected-tables). Un rectangle intègre chaque table sans groupe dont le centre se trouve à l’intérieur, comme le fait le [tracé d’un groupe](../guide/guides/table-groups.md#drawing-a-group). Un `name` vide laisse le groupe sans nom. Un seul `erd_undo` supprime le groupe et remet chaque table dans le groupe dont elle faisait partie. |
| `erd_remove_table_group` | `groupId` | Supprime un groupe. Ses tables restent où elles sont, hors de tout groupe. |
| `erd_change_table_group_name` | `groupId`, `value` | Renomme un groupe. Une chaîne vide le laisse sans nom. |
| `erd_change_table_group_color` | `groupId`, `color` | Définit la couleur d’un groupe. |
| `erd_move_table_group` | `groupId`, `x`, `y` | Déplace un groupe pour que son rectangle commence à ce point, avec ses tables décalées d’autant, comme le fait le glissement de sa barre de titre. Un déplacement de moins de 20 pixels, horizontal et vertical additionnés, ne crée aucune étape d’annulation. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | Définit le rectangle d’un groupe, ses tables restant où elles sont. Omis, `x` et `y` conservent son coin. Un rectangle qui ne contiendrait pas les tables du groupe avec leur marge est refusé, avec un message qui indique le cadre qu’il doit contenir. |
| `erd_set_table_group` | `tableIds`, `groupId` | Place des tables dans un groupe, chacune quittant le groupe dont elle faisait partie. Un `groupId` valant `null` ou une chaîne vide les retire de tout groupe. |

Tant que les groupes sont masqués avec `View Option` → `Table Groups`, ces outils ajoutent et modifient quand même des groupes, qui restent masqués jusqu’à ce que les groupes soient affichés (voir [Masquer les groupes](../guide/guides/table-groups.md#hiding-groups)).
`erd_sort_tables` garde ensemble les tables de chaque groupe, `erd_import_dbml` et `erd_import_json` apportent des groupes (voir [Importation](#import)), et `erd_read` écrit le DDL des groupes choisis avec `groupNames`.
Une version d’ERD Editor antérieure aux groupes de tables supprime les groupes d’un fichier quand elle enregistre ce fichier, comme le font l’extension VS Code antérieure à la version `4.0.0` et les plugins Obsidian et JetBrains antérieurs à la version `1.0.0` (voir [Mettre à jour](./installation.md#updating)).

### Paramètres {#settings}

Un agent définit les paramètres du schéma lui-même : la base de données, son nom et les scripts de [Schéma SQL](../guide/guides/schema-sql.md).
Tous les autres paramètres que stocke le document reviennent à l’utilisateur, qui les définit dans l’éditeur : les réglages des [options d’affichage](../guide/guides/table-related-functions.md#table-view-options), les options de l’onglet [Paramètres](../guide/guides/settings.md), le langage et la casse des noms du générateur de code, le type de délimiteur et les [verrous](../guide/guides/settings.md#lock).
Aucun outil ne les modifie, sauf les importations en mode `replace` : `erd_import_json` apporte les paramètres et les verrous du document qu’il charge, et les quatre autres ramènent la vue au début du canevas (voir [Importation](#import)).
La version `1.0.0` du serveur a retiré les outils qui les définissaient : `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` et `erd_set_show`.

`erd_list` et le format `snapshot` de `erd_read` rapportent les paramètres tels que le fichier les enregistre, avec `lockSettings` qui contient un indicateur par verrou : `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase` et `bracketType`.
Un langage, une casse des noms ou un type de délimiteur verrouillé est rapporté avec sa valeur verrouillée, celle que garde le fichier et sur laquelle s’ouvre tout éditeur, quoi qu’affiche l’écran d’un éditeur. La vue et l’onglet ne sont pas rapportés.

`erd_set_ddl_script` crée une étape d’annulation. `erd_set_database` et `erd_set_database_name` n’en créent aucune, donc `erd_undo` ne peut pas les annuler.

| Outil | Arguments | Ce qu’il fait |
| --- | --- | --- |
| `erd_set_database` | `value` | Définit la base de données : `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks` ou `Snowflake`. Ce choix détermine les types de données de la base, ainsi que le DDL qu’écrit `erd_read` quand aucun `vendor` n’est indiqué. |
| `erd_set_database_name` | `value` | Définit le nom de la base de données, que nomment les en-têtes `use` et `createAndUse` de `erd_read`. |
| `erd_set_ddl_script` | `position`, `sql` | Définit l’un des deux scripts écrits autour des tables (voir [Scripts avant et après les tables](../guide/guides/schema-sql.md#before-and-after-scripts)). `position` vaut `before`, écrit avant les tables, comme `CREATE EXTENSION` ou `CREATE SCHEMA`, ou `after`, écrit après elles, comme `GRANT` ou `CREATE VIEW`. `sql` remplace le script entier, de 10 000 caractères au plus, et une chaîne vide le supprime. Lisez d’abord le script actuel avec le format `scripts` de `erd_read`. |

Un script est inséré tel quel dans le DDL de chaque base de données : écrivez-le donc pour la base de données du document. Sur MSSQL, une ligne `GO` est ajoutée après un script dont la dernière ligne n’est pas `GO`.
Une version d’ERD Editor antérieure à ces scripts supprime les scripts d’un fichier quand elle enregistre ce fichier, comme le font l’extension VS Code antérieure à la version `4.0.0` et les plugins Obsidian et JetBrains antérieurs à la version `1.0.0` (voir [Mettre à jour](./installation.md#updating)).

### Importation {#import}

Ces outils lisent un schéma comme le fait le menu Importer de l’éditeur (voir [Importer ou exporter des fichiers](../guide/guides/file-import-export.md)).
Chacun prend le texte dans `value`, et `mode` : `replace`, la valeur par défaut, ou `append`.

| Outil | Arguments | Ce qu’il fait |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | Charge un DDL SQL, des instructions `CREATE TABLE` et similaires. |
| `erd_import_graphql` | `value`, `mode?` | Charge un SDL GraphQL. |
| `erd_import_dbml` | `value`, `mode?` | Charge du DBML. Chaque `TableGroup` devient un groupe de tables réunissant les tables qu’il nomme (voir [DBML](../guide/guides/file-import-export.md#dbml)). |
| `erd_import_aml` | `value`, `mode?` | Charge de l’AML. |
| `erd_import_json` | `value`, `mode?` | Charge un document JSON erd-editor, comme un autre fichier `.erd.json`. |

`replace` remplace le document, et `erd_undo` restaure le précédent :

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` et `erd_import_aml` remplacent toutes les tables, relations, index, mémos et groupes de tables. Ils conservent les paramètres du document, verrous compris, à l’exception de la vue, qui revient au début du canevas à 100 %.
- `erd_import_json` remplace le document entier, paramètres compris : les paramètres et les verrous du JSON prennent la place de ceux de ce document, et un JSON qui n’enregistre aucun verrou active tous les verrous et place la vue au début du canevas. Pour conserver les paramètres de ce document, partez du texte que donne le format `json` de `erd_read`. Un texte vide donne un nouveau document, comme celui que crée `erd_open_document` avec `create`.

`append` ajoute l’importation au document, comme le fait [Importer et ajouter](../guide/guides/file-import-export.md#import-and-add) dans l’éditeur, et un seul `erd_undo` retire tout l’ajout :

- Le contenu du texte arrive sous forme de nouvelles entités avec de nouveaux id, dans un bloc situé sous tout ce que contient le document, mémos masqués et groupes de tables compris, aligné sur son bord gauche. Chaque table et chaque paramètre déjà présents restent en place, y compris une table du même nom : rien n’est fusionné par nom.
- Les relations et les index ne sont repris qu’entre les tables qu’apporte l’importation, si bien qu’une clé étrangère vers une table que le texte ne déclare pas est écartée.
- `erd_import_sql`, `erd_import_graphql` et `erd_import_aml` ajoutent des tables avec leurs relations et leurs index, et `erd_import_dbml` ajoute aussi ses groupes de tables. `erd_import_json` ajoute des tables, des relations, des index, des mémos et des groupes de tables, jamais ses paramètres, et refuse un texte vide.

Un document JSON conserve sa propre disposition, groupes de tables compris : là où il place ses tables avec `replace`, et à l’intérieur du bloc ajouté avec `append`.
Les tables issues de SQL, GraphQL, DBML et AML sont disposées en lignes, les tables ayant le moins de colonnes en premier et celles de chaque groupe ensemble, comme les place `erd_sort_tables`, jamais avec `Flow` comme les dispose l’importation propre à l’éditeur quand elle le peut. Ces quatre outils refusent un texte vide dans les deux modes.

## erd_batch {#erd_batch}

`erd_batch` exécute plusieurs outils d’édition dans l’ordre comme une seule modification, tout ou rien.

- `operations` contient jusqu’à 100 entrées, chacune de la forme `{ tool, as?, args? }`, où `args` sont les arguments de l’outil sans `path`.
- Les opérations sont d’abord essayées sur une copie du document. Une opération refusée est nommée, comme `operations[1] erd_remove_table: …`, et rien n’est appliqué.
- Un seul `erd_undo` annule le lot entier, à l’exception des opérations qu’il ne peut pas annuler, que nomme le `undoNote` du résultat : celles d’un outil qui ne crée aucune étape d’annulation, comme `erd_set_database`, et celles qui ont modifié le document sans en créer, comme un court `erd_move_table_group`. Un lot qui n’a créé aucune étape d’annulation est sauté par `erd_undo`. `historyEntries` dans le résultat compte les entrées d’historique de l’éditeur que contient le lot, et non les appels à `erd_undo`.
- Dans une session en direct, l’éditeur accepte le lot entier ou rien du tout.

Un agent ne peut pas connaître avant l’appel les id que crée un lot, si bien qu’une opération nommée avec `as` permet à une opération ultérieure d’y faire référence : `$name` ou `$name.0` pour son premier id créé, `$name.1` pour le deuxième, et `$name.last` pour le dernier.
Un nom contient des lettres ASCII, des chiffres et des traits de soulignement, ne commence pas par un chiffre et ne nomme qu’une seule opération.
Une référence n’est résolue que là où un argument prend un id d’entité, donc un nom ou un commentaire qui vaut `$x` reste du texte.

Une table avec ses colonnes et une relation, en un seul appel :

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_table", "as": "users" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$users", "value": "users" } },
    { "tool": "erd_add_column", "as": "uid", "args": { "tableId": "$users" } },
    { "tool": "erd_change_column_name", "args": { "tableId": "$users", "columnId": "$uid", "value": "id" } },
    { "tool": "erd_change_column_data_type", "args": { "tableId": "$users", "columnId": "$uid", "value": "BIGINT" } },
    { "tool": "erd_set_column_primary_key", "args": { "tableId": "$users", "columnId": "$uid", "value": true } },
    { "tool": "erd_add_table", "as": "orders" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$orders", "value": "orders" } },
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN", "onDelete": "cascade" } }
  ]
}
```

`users` et sa clé `id` sont nommées avant la relation, si bien que la colonne de clé étrangère qu’elle ajoute à `orders` est `users_id`.

## Résultats {#results}

Une modification renvoie une ligne de JSON :

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Champ | Signification |
| --- | --- |
| `mode` | `live` ou `headless` (voir [En direct et sans interface](./live-and-headless.md)). |
| `createdIds` | Les id de ce que l’appel a créé, dans l’ordre. |
| `batches`, `historyEntries` | Le nombre de lots de modifications que l’appel a envoyés et le nombre d’entrées d’historique de l’éditeur qu’il a créées. |
| `undoable`, `undoNote` | `undoable` vaut `false` quand `erd_undo` sautera l’appel, et `undoNote` dit pourquoi : l’outil ne crée aucune étape d’annulation, l’appel a modifié le document sans en créer, comme le fait un `erd_move_table_group` de moins de 20 pixels, ou le document contenait déjà la valeur. Un résultat de `erd_batch` porte toujours un `undoNote`. Quand le lot a créé une étape d’annulation, la note indique qu’un seul `erd_undo` annule le lot et nomme toute opération que celui-ci laisse en place ; quand il n’en a créé aucune, le résultat porte `undoable: false` et la note indique que `erd_undo` le saute. |
| `mismatch` | Présent quand l’appel a produit un nombre de lots ou d’entrées d’historique différent de celui que déclare l’outil. |
| `notes` | Présent quand quelque chose a changé dans la session, comme un éditeur qui s’est fermé ou a cessé de prendre en charge le document, ou un fichier qui a changé sur le disque. |

Un refus est un résultat d’erreur portant un code et un message qui indique la marche à suivre :

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | Raison |
| --- | --- |
| `notFound` | Un id ne désigne rien d’existant, ou le fichier n’existe pas. |
| `invalidArgs` | Un argument est manquant ou a une valeur incorrecte. |
| `invalidPath` | Le chemin n’est pas un document ERD. Sous Windows, aussi un chemin contenant un nom que Windows ne stocke pas tel qu’il est écrit, ou un chemin qui mène à un document qu’un éditeur détient sous un autre chemin, que le message indique. |
| `invalidDocument` | Le fichier n’est pas un document que l’éditeur peut lire. |
| `tooLarge` | Une lecture ne tient pas dans une seule réponse. |
| `blocked` | Un éditeur dont le hub est désactivé détient le document. Le message indique comment l’activer : dans VS Code, approuvez l’espace de travail et activez `dineug.erd-editor.agentHub.enabled`, ou rechargez la fenêtre ; dans Obsidian, activez Coding agents, ou rechargez Obsidian ; dans un IDE JetBrains, activez Coding agents, ou redémarrez l’IDE si le paramètre est activé. |
| `hubDisabled` | Un IDE JetBrains ne détient le document que dans un projet qu’il n’approuve pas. Les lectures fonctionnent toujours ; approuvez le projet pour permettre les modifications de l’agent. |
| `conflict` | Le fichier a changé sur le disque pendant l’appel. Rien n’a été écrit. |
| `hubAppeared`, `hubGone` | Un éditeur a commencé à prendre en charge un document que l’agent modifiait sur le disque, ou l’éditeur qui le prenait en charge tourne toujours mais son fichier de verrou et sa connexion ont disparu. Rien n’a été écrit. |
| `notSaved` | `erd_save` n’a pas pu enregistrer le document de l’éditeur. |
| `readonly` | L’éditeur détient le document en lecture seule, comme un fichier qu’il ne peut pas écrire ou ne peut pas lire comme un diagramme. Sans éditeur, le fichier lui-même est en lecture seule, comme un fichier Perforce ou TFVC qui n’est pas extrait. Rien n’a été écrit. |
| `protocolMismatch` | L’extension ou le plugin ERD Editor de l’éditeur et le serveur utilisent des versions de protocole différentes, comme le serveur `1.0.0` avec une extension VS Code `3.x`. Les lectures sont refusées aussi, et le message indique le côté à mettre à jour (voir [Mettre à jour](./installation.md#updating)). |
| `hubUnreachable`, `timeout`, `disconnected` | Le hub d’un éditeur n’a pas accepté la connexion, n’a pas répondu en moins de 30 secondes ou a coupé la connexion pendant l’appel. Sous Windows, `hubUnreachable` signifie aussi que Windows a tenu l’agent à l’écart du hub : l’éditeur s’exécute avec plus de droits que l’agent, comme lorsqu’il a été lancé en tant qu’administrateur et pas l’agent, ou bien l’agent s’exécute dans un bac à sable. |

Les autres codes sont plus rares, et chaque refus porte un message qui indique ce qui s’est passé.

Les outils d’édition, `erd_batch` et les trois outils de lecture refusent un argument qu’ils ne déclarent pas, ou un argument du mauvais type, avec une erreur JSON-RPC invalid params (`-32602`) avant de toucher au document, si bien qu’un argument mal orthographié n’est jamais ignoré en silence.
Les cinq outils de session ignorent les arguments qu’ils ne connaissent pas.
