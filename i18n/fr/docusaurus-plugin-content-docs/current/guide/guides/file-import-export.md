---
sidebar_position: 2
description: Importer du JSON, du Schéma SQL, du GraphQL, du DBML ou de l’AML à la place du diagramme ou en ajout sous celui-ci, et exporter du JSON, du Schéma SQL ou le diagramme en image PNG ou SVG.
---

# Importer ou exporter des fichiers

## Importer des fichiers externes {#importing-external-files}

Cinq formats peuvent être importés depuis le sous-menu `Import` du menu contextuel du canevas :

- json
- Schema SQL
- GraphQL
- DBML
- AML

`Import and Add`, juste sous `Import`, ajoute le fichier au diagramme au lieu de le remplacer (voir [Importer et ajouter](#import-and-add)).  
L’écran d’accueil qu’affiche un diagramme vide comporte une entrée `Import` avec les mêmes cinq formats (voir [Écran d’accueil](./editing-start.md#welcome-screen)).  
Les feuilles de l’onglet [Dictionnaire](./dictionary.md) acceptent aussi des mots, des termes et des domaines issus de fichiers CSV, avec l’outil `Import CSV` propre à cet onglet (voir [Importer et exporter des fichiers CSV](./dictionary.md#importing-and-exporting-csv)).

Les extensions sont reconnues quelle que soit leur casse. Sélectionner un fichier dont l’extension ne correspond pas au format choisi annule l’importation et affiche `Only <format> files can be imported`, le format étant écrit `json`, `sql`, `graphql`, `dbml` ou `aml`, comme dans `Only sql files can be imported`.

`Import` remplace le document actuel au lieu d’y fusionner le fichier, et une seule annulation ramène le diagramme précédent.  
Un fichier JSON apporte ses propres paramètres, ses [verrous](./settings.md#lock) compris. Lorsque le fichier verrouille l’onglet, le langage du générateur de code, une casse des noms, le type de délimiteur ou l’[affichage des noms](./logical-names.md#name-view), vous continuez à voir ce que vous aviez, mais c’est la valeur verrouillée du fichier qui est enregistrée. Le zoom et la position de la vue, verrouillés ou non, vont là où le fichier les place. Un fichier JSON enregistré avant l’apparition des verrous arrive avec tous les verrous activés et la vue à 100 %. Un fichier enregistré avant l’apparition du verrou `Name View` arrive avec ce verrou activé, quels que soient les autres verrous qu’il enregistre.  
Les autres formats conservent les paramètres que vous avez déjà, verrous compris, sauf la vue, qui démarre à 100 %.  
Les analyseurs GraphQL, DBML et AML n’échouent jamais : un fichier qu’ils ne peuvent pas lire produit un diagramme vide plutôt qu’une erreur.

Un fichier JSON apporte aussi les noms logiques de ses tables et de ses colonnes ainsi que les liens de domaine de ses colonnes. Ses mots, ses termes et ses domaines remplacent ceux de l’onglet [Dictionnaire](./dictionary.md), si bien qu’un fichier qui n’en contient aucun laisse les feuilles vides, et annuler l’importation ramène ceux qu’il a remplacés.  
Les autres formats ne contiennent rien de tout cela. Leurs tables arrivent sans noms logiques et sans aucune colonne liée à un domaine, et vos mots, vos termes et vos domaines restent tels quels. Annuler ou rétablir l’importation les laisse aussi tels quels, si bien qu’une modification du dictionnaire faite après l’importation est conservée. Une telle importation ne touche pas non plus à l’historique d’annulation propre de chaque feuille, tandis qu’une importation JSON vide ces historiques (voir [Feuilles du dictionnaire](./undo-redo.md#dictionary-sheets)).

Un fichier JSON conserve les positions qu’il contient. Les tables d’un fichier Schéma SQL, GraphQL, DBML ou AML sont placées avant que le diagramme ne change, aux largeurs qu’elles prennent dans l’[affichage des noms](./logical-names.md#beyond-the-canvas) que vous regardez :

- Lorsque le fichier contient au moins deux tables et au moins une relation, elles sont placées par la [disposition automatique](./table-related-functions.md#auto-layout) `Flow`, de gauche à droite le long des relations, à partir du coin supérieur gauche du canevas. Une relation d’une table vers elle-même compte.
- Sinon, elles sont disposées en lignes à partir du coin supérieur gauche, les tables ayant le moins de colonnes en premier.
- Si la disposition dure plus de 6 secondes, une notification `Placing tables` apparaît avec un bouton `Cancel`. Un clic sur `Cancel`, ou un appui sur `Escape` tant que la notification est affichée, abandonne la disposition et dispose les tables en lignes à la place. La disposition en lignes est aussi utilisée, sans notification, lorsque la disposition échoue, lorsqu’aucune disposition n’est renvoyée dans les 60 secondes ou lorsque l’hôte n’exécute aucun worker partagé (voir [Web Workers](../../api/installation.md#web-workers)).

Le diagramme est ensuite remplacé en une seule étape, si bien qu’aucun état intermédiaire ne s’affiche. Un paramètre que vous modifiez pendant le placement des tables, comme l’onglet, est conservé, et si vous importez un autre fichier entre-temps, c’est la dernière importation lancée qui l’emporte.

Un éditeur en lecture seule n’importe rien. Son menu contextuel du canevas et sa recherche rapide ne proposent ni `Import` ni `Import and Add`, il n’affiche aucun écran d’accueil, et l’onglet Dictionnaire ne propose pas `Import CSV`.

### Importer et ajouter {#import-and-add}

`Import and Add` conserve le diagramme et ajoute un fichier en dessous. Cette entrée figure dans le menu contextuel du canevas et dans la [recherche rapide](./quick-search.md) de l’onglet ERD, et propose les mêmes cinq formats avec la même vérification d’extension que `Import`.

![Ajout d’un fichier SQL depuis Import and Add > Schema SQL, ses tables arrivant sous le diagramme, disposées le long de leurs relations et sélectionnées](/img/demo-import-and-add.webp)

Le fichier arrive de la même façon qu’un collage : chaque table, colonne, relation, index, mémo et [groupe de tables](./table-groups.md) qu’il contient est ajouté comme un nouvel élément, les tables déjà présentes dans le diagramme ne bougent pas et aucun paramètre ne change, de sorte que les paramètres d’un fichier JSON sont laissés de côté.  
Les tables et les colonnes d’un fichier JSON conservent leurs noms logiques, et chaque nom physique reste dérivé des dictionnaires ou personnel, comme il l’était dans le fichier, ce qui détermine si un nom logique écrit plus tard en dérive un nouveau (voir [Dériver les noms physiques](./dictionary.md#deriving-physical-names)). Les mots, les termes et les domaines du fichier sont laissés de côté, si bien que l’onglet Dictionnaire reste tel qu’il était, et aucune colonne ajoutée n’est liée à un domaine : chacune conserve le type de données qu’elle a.  
Une table dont le nom existe déjà dans le diagramme est ajoutée comme une seconde table portant ce nom, sans être fusionnée avec elle. Les relations et les index proviennent uniquement du fichier, si bien qu’une clé étrangère vers une table que le fichier ne définit pas n’est pas reliée à une table déjà présente dans le diagramme.

Le bloc ajouté arrive juste sous tout ce que contient le diagramme, aligné sur son bord gauche, ou dans le coin supérieur gauche d’un diagramme vide. Les mémos et les groupes de tables masqués avec les [options d’affichage](./table-related-functions.md#table-view-options) comptent aussi, puisqu’ils sont toujours là.  
À l’intérieur du bloc, un fichier JSON conserve sa propre disposition, groupes de tables compris. Les autres formats sont placés comme `Import` les place, par `Flow` ou en lignes selon les mêmes règles, et le cadre de chaque groupe de tables est ajusté autour de ses tables. Les tables et les mémos ajoutés s’empilent au-dessus de tout ce qui est déjà là.

Une fois le bloc arrivé, seul ce qui a été ajouté est sélectionné : les nouvelles tables, plus les nouveaux mémos et groupes de tables tant qu’ils sont affichés. Si vous êtes passé à un autre onglet entre-temps, l’éditeur revient à l’onglet ERD avant l’arrivée du bloc. La vue défile ensuite jusqu’au bloc au niveau de zoom actuel, sauf s’il est déjà bien visible (voir [Où aboutit un saut](./table-related-functions.md#where-a-jump-lands)). Une seule annulation défait tout l’ajout.  
Un fichier que l’analyseur ne peut pas lire, ou un fichier sans table ni mémo, n’ajoute rien.

Plusieurs fichiers Schéma SQL, GraphQL, DBML ou AML ajoutés pendant qu’un fichier est encore en cours de placement arrivent tous, dans l’ordre où ils ont été lancés. Un fichier JSON ajouté entre-temps arrive dès qu’il est lu, avant eux. Un `Import`, ou le chargement d’un autre document, abandonne ceux qui sont encore en cours de placement.

Les agents de codage ajoutent un fichier de la même façon avec le mode `append` des outils d’importation MCP, qui conserve la disposition d’un fichier JSON mais dispose en lignes les tables des autres formats, jamais par `Flow` (voir [Importation](../../mcp/tools.md#import)).

### JSON {#json}

Vous pouvez importer des fichiers au [format de schéma défini dans l’éditeur](../../api/advanced/schema.md).
Le nom du fichier doit se terminer par `.json`, si bien qu’un fichier exporté sous `<database name>-<timestamp>.erd.json` se réimporte tel quel ; un simple fichier `.erd` ou `.vuerd` n’est pas accepté ici. Les fichiers enregistrés par des versions antérieures sont lus aussi.

![Importation d’un fichier enregistré depuis Import > json, qui remplace le document brouillon ainsi que ses paramètres](/img/demo-import-json.webp)

### Schéma SQL {#schema-sql}

Vous pouvez aussi importer des fichiers de schéma définis en SQL.  
Bien que les analyseurs aient été conçus pour être aussi souples que possible quel que soit le SGBD, il se peut que certaines syntaxes ne soient pas prises en charge.  
Le nom du fichier doit se terminer par `.sql`.  
[Les syntaxes prises en charge peuvent être consultées ici.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Importation d’un fichier SQL depuis Import > Schema SQL, ses tables disposées le long de leurs relations, puis zoom arrière sur celles-ci](/img/demo-import-sql.webp)

Les colonnes proviennent uniquement de `CREATE TABLE`. Une colonne ajoutée par `ALTER TABLE ... ADD COLUMN` n’est pas lue.  
Les éléments d’un `CREATE TABLE` qui ne sont pas des colonnes sont ignorés au lieu d’être lus comme des colonnes : un `CHECK (...)` sans nom, les `LIKE` et `EXCLUDE` de PostgreSQL, les `FULLTEXT` et `SPATIAL` de MySQL écrits sans `INDEX` ni `KEY`, le `PERIOD FOR` de T-SQL et le `SUPPLEMENTAL LOG DATA` d’Oracle.  
Une colonne portant le nom de l’un d’eux est tout de même importée lorsqu’un type intégré suit le nom, comme dans `exclude BOOLEAN`, ou lorsque le nom est entre guillemets, comme dans `"check" int`. Un `like` sans guillemets suivi d’un type non intégré, comme `like citext`, est lu comme le `LIKE` de PostgreSQL et ignoré.  
Les contraintes `CHECK` elles-mêmes ne sont pas importées, puisque l’éditeur n’a aucun endroit où les conserver.

#### Types de données {#data-types}

Le type de données d’une colonne est conservé, liste d’arguments comprise, même lorsqu’il n’est le type intégré d’aucune [base de données prise en charge](./table-related-functions.md#databases).  
Cela couvre un enum ou un type composite créé avec `CREATE TYPE`, un domaine créé avec `CREATE DOMAIN`, les types d’extension comme `hstore`, `citext` et `ltree`, les noms qualifiés par le schéma comme `public.mood`, et les noms entre guillemets ou entre crochets comme `"MyType"` et `[dbo].[Phone]`, qui conservent leurs guillemets ou leurs crochets. Les instructions `CREATE TYPE`, `CREATE DOMAIN` et `CREATE EXTENSION` elles-mêmes sont ignorées.  
Un type intégré perd ses guillemets ou ses crochets, si bien que `[int]` devient `int` et `[nvarchar](50)` devient `nvarchar(50)`. Les types `"char"` et `"bit"` de PostgreSQL conservent les leurs, car ce sont des types différents de `char` et `bit`.  
Les suffixes de tableau restent sur n’importe quel type : `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`. Le `UNSIGNED BIG INT` de SQLite est importé en entier.  
Les `UNSIGNED` et `ZEROFILL` de MySQL et de MariaDB, écrits juste après un type et ses arguments, font partie du type tel qu’il est écrit : `INT UNSIGNED`, `SMALLINT(5) UNSIGNED ZEROFILL`, le `int unsigned` de mysqldump. `SIGNED`, la valeur par défaut, est supprimé, si bien que `TINYINT SIGNED` devient `TINYINT`. Un modificateur écrit après une autre option de colonne, comme dans `INT NOT NULL UNSIGNED`, que MySQL refuse, est supprimé.  
Les valeurs `ENUM(...)` et `SET(...)` conservent leurs guillemets, un guillemet à l’intérieur d’une valeur étant doublé, comme dans `ENUM('a','it''s')`. Le `'it\'s'` de MySQL, échappé par une barre oblique inverse, est doublé de la même façon. Dans un type `STRUCT<...>` de Databricks, les noms de champs entre guillemets et le `COMMENT` d’un champ conservent leurs guillemets.  
Une colonne écrite sans type, comme une colonne SQLite sans type ou une colonne calculée `AS`, reste sans type : un mot-clé comme `NOT`, `NULL`, `DEFAULT`, `PRIMARY` ou `REFERENCES`, ou une chaîne entre guillemets simples, n’est pas lu comme un type.

#### Valeurs par défaut {#defaults}

Le `DEFAULT` d’une colonne conserve toute son expression, comme `now()`, `0.5`, `CURRENT_TIMESTAMP` ou `ARRAY[]::text[]`, jusqu’à l’option de colonne suivante, une virgule ou la parenthèse fermante. Un `CASE ... END` est lu en entier.  
Les parenthèses qui entourent toute l’expression sont retirées, si bien que le `((0))` de SQL Server devient `0` et `(getdate())` devient `getdate()`. La conversion d’un littéral est aussi retirée, si bien que le `'draft'::character varying` de pg_dump devient `'draft'` et `NULL::character varying` devient `NULL` ; les autres conversions restent, comme dans `ARRAY[]::text[]` et `lower('A'::text)`.  
Le `ON UPDATE CURRENT_TIMESTAMP` de MySQL est supprimé, puisqu’une colonne n’a aucun emplacement pour lui, et la valeur par défaut qui le précède reste. Le `DEFAULT ON NULL 0` d’Oracle, avec ou sans `FOR INSERT ONLY` ou `FOR INSERT AND UPDATE`, devient `0`.  
Une chaîne avec un préfixe, comme `N'x'`, `E'x'`, `B'0'`, `X'ff'`, `U&'x'` ou `_utf8mb4'x'`, est lue comme une seule chaîne, même si elle contient une parenthèse.

Les scripts de SQL Server Management Studio placent les valeurs par défaut après les tables, sous la forme `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]`. Une telle instruction définit la valeur par défaut de cette colonne, ici `1`, et son nom de contrainte est supprimé.

Une exportation Schéma SQL remet les parenthèses là où une base de données ne lit l’expression d’une valeur par défaut qu’à l’intérieur de celles-ci (voir [Valeurs par défaut](./schema-sql.md#defaults)).

#### Auto-incrément {#auto-increment}

`AUTO_INCREMENT`, `AUTOINCREMENT` et `IDENTITY` activent l’option `Auto Increment` d’une colonne, tout comme `GENERATED ALWAYS AS IDENTITY` et `GENERATED BY DEFAULT AS IDENTITY`, qui ne laissent aucune valeur par défaut derrière eux.  
Il en va de même d’une valeur par défaut constituée d’un seul appel PostgreSQL `nextval()`, la valeur par défaut que reçoit une colonne serial, écrite `nextval('s')` ou, comme l’écrit pg_dump, `nextval('s'::regclass)`. Le nom de la séquence n’est pas conservé. Une valeur par défaut qui ne fait qu’utiliser une séquence, comme `nextval('s') + 1` ou le `NEXT VALUE FOR s` de SQL Server, reste une simple valeur par défaut.  
pg_dump écrit les deux après les tables, sous la forme `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` et `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY`. L’une ou l’autre instruction active l’option `Auto Increment` de cette colonne et efface sa valeur par défaut. `CREATE SEQUENCE`, `ALTER SEQUENCE` et toute autre action `ALTER COLUMN` sont ignorés.  
Une colonne déclarée directement avec le type `serial`, `bigserial` ou `smallserial` conserve ce type, avec `Auto Increment` désactivé.

L’éditeur ne conserve que l’indicateur `Auto Increment`, et chaque base de données écrit sa propre forme à l’exportation (voir [Auto-incrément](./schema-sql.md#auto-increment)). Une exportation PostgreSQL écrit `GENERATED ALWAYS AS IDENTITY` sur une colonne `smallint`, `integer` ou `bigint`, quelle que soit la forme importée, et sur tout autre type, comme `INT UNSIGNED`, seulement une ligne de commentaire après la table. Les options de séquence comme `START WITH 100` sont perdues.  
Une table comportant plusieurs colonnes serial ou d’identité est importée avec plusieurs colonnes en auto-incrément, et MySQL, MariaDB et SQL Server refusent une telle table lorsque son exportation est exécutée.

#### Clés primaires {#primary-keys}

Une clé primaire ajoutée après sa table, `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`, marque ses colonnes comme clé primaire.  
Les `CLUSTERED` ou `NONCLUSTERED` de SQL Server et le `USING BTREE` de MySQL placés avant la liste de colonnes sont sautés à la lecture, si bien que l’instruction `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]` des scripts de SQL Server Management Studio fait de `Id` la clé. Le `PRIMARY KEY NONCLUSTERED HASH (...)` d’une table optimisée en mémoire n’est pas lu, ni dans `ALTER TABLE` ni dans `CREATE TABLE`.

#### Clés uniques et index {#unique-keys-and-indexes}

Un `UNIQUE` portant sur deux colonnes ou plus devient un seul index unique, quelle que soit son écriture : `UNIQUE (a, b)`, `UNIQUE KEY n (a, b)`, `UNIQUE INDEX n (a, b)`, `CONSTRAINT n UNIQUE (a, b)`, la forme en ligne `INDEX n UNIQUE (a, b)` de SQL Server et `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`.  
L’index prend le nom d’index de la clé, à défaut son nom `CONSTRAINT`, à défaut aucun nom, et conserve l’ordre de tri de chaque colonne. Un tel index est une [clé alternative](./table-related-functions.md#alternate-keys).  
Un `UNIQUE` portant sur une seule colonne, sous n’importe laquelle de ces écritures, marque plutôt cette colonne comme unique et n’ajoute aucun index, si bien que la contrainte `UQ_<table name>_<column name>` qu’écrit l’exportation revient sous la forme de l’indicateur à partir duquel elle a été écrite. Un `CREATE UNIQUE INDEX` portant sur une seule colonne reste un index unique.

Un `ALTER TABLE` qui ajoute plusieurs clés à la fois, comme le `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)` qu’écrit phpMyAdmin, conserve chacune de ses clés uniques : `uq_a` devient un index unique nommé `uq_a`, et `uq_c` l’indicateur Unique de `c`. Un nom `CONSTRAINT` ne nomme que la clé de sa propre clause. Le `ADD UNIQUE INDEX IF NOT EXISTS n (...)` de MariaDB et les `ALTER TABLE t WITH CHECK ADD ...` et `WITH NOCHECK ADD ...` de SQL Server sont lus aussi.  
`CREATE INDEX` et `CREATE UNIQUE INDEX` sont lus avec des noms qualifiés comme `public.t` et `[dbo].[t]`, les `CLUSTERED` et `NONCLUSTERED` de SQL Server, les `CONCURRENTLY`, `IF NOT EXISTS`, `ON ONLY` et `USING btree` de PostgreSQL, et sans aucun nom d’index. Le groupe de fichiers `ON [PRIMARY]` de SQL Server est ignoré.  
Les options de clé comme `NULLS NOT DISTINCT` ou `USING BTREE` ne sont pas prises pour le nom de la clé. Dans la liste de colonnes d’une clé, seul le premier mot désigne la colonne, si bien que `b DESC NULLS LAST`, `b text_pattern_ops` et `b COLLATE "C"` portent tous sur `b`, `DESC` étant conservé comme ordre de tri. Une longueur de préfixe comme `email(191)` est sautée à la lecture, mais une clé comportant une partie expression, comme `lower(email)`, est entièrement ignorée.

Un index unique partiel, `CREATE UNIQUE INDEX ... WHERE ...` ou la forme en ligne `INDEX n UNIQUE (...) WHERE ...` de SQL Server, devient un index simple avec le même nom et les mêmes colonnes, car une clé unique sur toute la table serait plus stricte que la clé filtrée que déclare le fichier. L’exception est un filtre composé uniquement de tests `IS NOT NULL` sur les colonnes de la clé reliés par `AND`, le filtre dont SQL Server a besoin pour permettre à une colonne unique de contenir plus d’un NULL : cette clé reste unique.  
Une clé unique qui nomme une colonne que la table ne possède pas, comme une colonne ajoutée par `ALTER TABLE ... ADD COLUMN`, est entièrement supprimée plutôt que réduite aux colonnes existantes. Un index simple conserve les colonnes existantes.

Oracle SQL Developer et `DBMS_METADATA` écrivent l’index propre d’une clé sous la forme d’un `CREATE UNIQUE INDEX` distinct, nommé d’après la clé ou, pour une clé sans nom que suit `USING INDEX`, avec un nom système comme `SYS_C0012345`. L’importation lit un tel index, ainsi que celui que nomme un `ADD CONSTRAINT ... USING INDEX`, comme faisant partie de sa clé : une clé unique composite devient un seul index unique, et une clé primaire ou une clé unique sur une seule colonne se traduit par les indicateurs de colonne, sans index supplémentaire. Une exportation vers Oracle crée alors l’index une seule fois.

Une exportation Schéma SQL se réimporte avec les mêmes indicateurs Unique et les mêmes index pour MySQL, MariaDB, MSSQL, Oracle, PostgreSQL et SQLite.  
Snowflake n’a pas d’index secondaires, si bien que son exportation ne ramène que les clés uniques : une clé composite sous la forme d’un index unique et une clé sur une seule colonne sous la forme de l’indicateur Unique de la colonne. Une exportation Databricks ne déclare aucune unicité, si bien qu’aucune ne revient.

#### Clés étrangères {#foreign-keys}

Une clé étrangère devient une relation sous ces écritures :

- Un `FOREIGN KEY (...) REFERENCES t (...)` au niveau de la table, avec ou sans `CONSTRAINT name`.
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`, y compris les `ALTER TABLE t WITH CHECK ADD ...` et `WITH NOCHECK ADD ...` des scripts de SQL Server Management Studio.
- Le `REFERENCES t (col)` en ligne d’une colonne, comme dans `user_id INT REFERENCES users (id)`, et le `FOREIGN KEY REFERENCES t (col)` que SQL Server et Snowflake autorisent à cet endroit. Une référence en ligne vers plus d’une colonne est ignorée.

Un `ALTER TABLE` donne au plus une relation, et seulement lorsque sa première clause ajoute une clé étrangère : une clause `FOREIGN KEY` placée après une clause `ADD PRIMARY KEY` ou `ADD UNIQUE` dans la même instruction n’est pas lue. Lorsqu’une instruction ajoute plusieurs clés étrangères, comme le `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...` qu’écrit phpMyAdmin, seule la dernière est lue.

`REFERENCES t` sans liste de colonnes pointe vers la clé primaire de `t` lorsque cette clé est une seule colonne. Face à une clé primaire composite, la clé étrangère est ignorée.  
Une clé étrangère est ignorée, et aucune de ses colonnes n’est marquée comme clé étrangère, lorsqu’aucune de ses colonnes référencées n’est trouvée, ou lorsque les colonnes trouvées dans les deux tables diffèrent en nombre, comme lorsqu’une colonne manque dans une seule des deux. Lorsqu’il manque le même nombre de ses colonnes dans chacune des deux tables, les colonnes trouvées sont appariées dans l’ordre d’écriture, et la relation ne contient que celles-ci.  
Chaque relation importée est `Zero N`, et elle est identifiante lorsque chacune de ses colonnes enfants est aussi une clé primaire.

Les clauses `ON DELETE` et `ON UPDATE` de chaque clé étrangère deviennent les `On Delete` et `On Update` de la relation : `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL` ou `SET DEFAULT`, quelle que soit la casse et dans n’importe quel ordre. Une clé étrangère sans ces clauses est importée en `Not set`. Pour les définir dans l’éditeur, voir [Modification des relations](./relationship-editing.md#on-delete-and-on-update).  
La liste de colonnes que PostgreSQL accepte après `SET NULL` ou `SET DEFAULT`, comme dans `ON DELETE SET NULL (a_id)`, est sautée à la lecture : l’action s’applique à toute la clé, et un `ON UPDATE` placé après la liste est quand même lu. `MATCH FULL`, `MATCH PARTIAL` et `MATCH SIMPLE` sont ignorés, et l’attribut de colonne `ON UPDATE CURRENT_TIMESTAMP` de MySQL n’est pas pris pour une action.  
Une exportation Schéma SQL se réimporte avec les actions qu’écrit cette base de données, si bien qu’une action qu’elle omet, comme `SET DEFAULT` sur MySQL, tout `ON UPDATE` sur Oracle ou tout ce qui n’est pas `NO ACTION` sur Snowflake, revient en `Not set`.

#### Commentaires {#comments}

Les commentaires de table et de colonne sont importés depuis les trois syntaxes que lit l’analyseur : l’option de table et l’attribut de colonne `COMMENT` utilisés par MySQL, MariaDB, Snowflake et Databricks, les instructions `COMMENT ON TABLE` et `COMMENT ON COLUMN` utilisées par PostgreSQL et Oracle, et la propriété étendue `MS_Description` que SQL Server définit avec `EXEC sp_addextendedproperty`.  
Un commentaire qui nomme une table ou une colonne que le fichier ne définit pas est ignoré.

Les appels de SQL Server sont lus avec des arguments nommés, forme sous laquelle les scripts de SQL Server Management Studio écrivent chaque commentaire (`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`), et avec des arguments positionnels, forme qu’utilise l’exportation MSSQL de l’éditeur.  
Seule une propriété `MS_Description` placée sur une table, ou sur l’une de ses colonnes au niveau 2, donne un commentaire. Une autre propriété, une vue, un index ou une contrainte n’en donne aucun, pas plus qu’un commentaire passé dans une variable ou construit avec `+`.

Dans un commentaire, comme dans tout texte entre guillemets, tel qu’une valeur `DEFAULT` ou un nom entre guillemets, un guillemet doublé représente un seul guillemet, comme l’écrivent mysqldump et pg_dump : `'it''s'` se lit `it's`.  
Une barre oblique inverse devant un guillemet, comme dans le `'it\'s'` qu’écrivent MySQL et MariaDB, échappe aussi le guillemet. Un tel guillemet termine malgré tout le texte lorsqu’il est suivi d’un caractère d’espacement, de `,`, `;`, `)`, `]`, `:`, `|`, `+` ou de la fin du fichier, si bien que `'C:\'`, le `'C:\'::text` de pg_dump et le `'C:\'+name` de T-SQL conservent leur barre oblique inverse.  
Une valeur `DEFAULT` conserve ses guillemets, et un guillemet qu’elle contient est réécrit doublé, quelle que soit la façon dont le fichier l’a échappé : `'it''s'`.  
Lorsque la base de données du document est Databricks au moment de l’importation, le texte entre guillemets simples suit plutôt les règles de Spark : chaque barre oblique inverse échappe le caractère qui la suit, si bien que `'C:\\dir'` se lit `C:\dir`, les séquences d’échappement comme `\n`, `\t` et `\u0041` sont décodées, et une valeur `DEFAULT` est conservée sous la forme `'it\'s'`.

La façon dont chaque base de données écrit un commentaire à l’exportation, et dont elle y échappe un guillemet, est décrite dans [Commentaires](./schema-sql.md#comments), dans la page Schéma SQL.  
Une exportation vers MySQL, MariaDB, PostgreSQL, Oracle, Snowflake ou MSSQL se réimporte sous la forme des mêmes commentaires de table et de colonne, guillemets compris, à l’exception des lignes vides qu’omet une exportation Oracle. Une exportation Databricks, qui échappe un guillemet et une barre oblique inverse par une barre oblique inverse, ne se relit à l’identique que tant que Databricks est la base de données sélectionnée.  
Les commentaires ne survivent pas à un aller-retour d’exportation et d’importation SQLite : SQLite les écrit sous forme de simples lignes `--`, que l’analyseur ne lit pas.  
Sauf sur SQLite, un nom logique que `Write logical names into empty comments` a écrit dans un commentaire vide se réimporte comme le commentaire de cette table ou de cette colonne, et non comme son nom logique (voir [Noms logiques en commentaire](./schema-sql.md#logical-names-as-comments)).

### GraphQL {#graphql}

Vous pouvez importer un document GraphQL SDL.  
Les définitions de types objet deviennent des tables, un bloc `extend type` est fusionné dans le type qu’il étend, et les champs d’interface sont hérités par les types qui les implémentent.  
Un champ dont le type est une autre table devient une relation au lieu d’une colonne, et une liste des deux côtés crée une table d’association.  
Un champ au singulier comme `buyer: User` est d’abord apparié à l’unique champ de l’autre type dont le nom se termine par `By` suivi du nom de ce champ, comme `orderListByBuyer`, sans tenir compte de la casse ni des traits de soulignement ; un champ numéroté comme `buyer2` est apparié de la même façon, sans son numéro. C’est ainsi que la sortie GraphQL du générateur de code nomme les champs lorsque deux tables partagent plus d’une relation ou qu’une table fait référence à elle-même, si bien qu’une telle sortie se réimporte avec toutes ses relations.  
Les types racine (`Query`, `Mutation`, `Subscription`), les types d’introspection et les types enveloppes de Relay, de la fédération et de Hasura comme `PageInfo`, `*Connection`, `*Edge` et `*_aggregate` sont traités comme du bruit et ignorés.  
Les directives `@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index` et `@db.*` sont prises en compte.  
Le nom du fichier doit se terminer par `.graphql`, `.gql` ou `.graphqls`. Un fichier Prisma `schema.prisma` n’est pas un document GraphQL et ne peut pas être importé ici.

### DBML {#dbml}

Vous pouvez importer un fichier DBML, le format utilisé par dbdiagram.io et dbdocs.  
Les blocs `Table`, `TablePartial`, `Ref`, `Enum` et `TableGroup` sont lus. Les blocs `Project` et les blocs `Note` autonomes sont ignorés sans affecter les tables qui les entourent.  
Toutes les écritures de ref sont acceptées : la forme `Ref:` avec deux-points, une ref nommée, la forme en bloc `Ref { }` et le paramètre de colonne en ligne `[ref: > table.column]`.  
Une ref plusieurs-à-plusieurs `<>` crée une table d’association nommée d’après les deux côtés.  
Les paramètres `delete` et `update` d’une ref autonome deviennent les `On Delete` et `On Update` de la relation, comme dans `Ref: users.id < posts.user_id [delete: cascade, update: set null]`. Les valeurs sont `cascade`, `restrict`, `set null`, `set default` et `no action`, quelle que soit la casse. Toute autre valeur, ou l’absence de paramètre, est importée en `Not set`, et les autres paramètres comme `color` sont ignorés.  
Le paramètre en ligne `[ref: ...]` ne porte aucune action, et les paramètres d’une ref `<>` ne sont pas reportés sur la table d’association. Lorsque la même clé étrangère est déclarée à la fois en ligne et sous forme de ref autonome, c’est la déclaration en ligne qui est conservée, sans actions.  
Le paramètre `headercolor` d’une table, comme dans `Table users [headercolor: #3498DB]`, devient sa couleur lorsque la valeur est un hexadécimal `#rgb` ou `#rrggbb` écrit sans guillemets. Toute autre valeur est supprimée, et le `headercolor` d’un `TablePartial` n’est pas transmis aux tables qui l’utilisent.  
Chaque `TableGroup` devient un [groupe de tables](./table-groups.md) contenant les tables qu’il liste, une par ligne, nommées comme les nomme un `Ref`. Son `[color: ...]` devient la couleur du groupe selon la même règle que `headercolor`, et sa note et ses autres paramètres sont supprimés. Une table listée par deux groupes reste dans le premier. Un groupe qui se retrouve sans table n’est pas créé, qu’il n’en liste aucune que le fichier déclare ou seulement des tables qu’un groupe précédent a prises. Le cadre du groupe est ajusté autour de ses tables où qu’elles soient placées, et lorsque les tables sont disposées en lignes, les tables d’un groupe restent ensemble.  
Le nom du fichier doit se terminer par `.dbml`.

### AML {#aml}

Vous pouvez importer un fichier AML (Azimutt Markup Language). L’écriture actuelle comme l’ancienne écriture v1 sont acceptées.  
Les entités deviennent des tables, et les attributs imbriqués sont aplatis en un nom de colonne pointé comme `settings.slug`.  
Les attributs sont `NOT NULL` sauf s’ils sont marqués `nullable`, et les constructions pour lesquelles l’éditeur n’a aucun emplacement, comme `check`, `type` et `tags`, sont supprimées plutôt que rejetées. Une entité marquée comme vue devient une table ordinaire.  
La propriété `color` d’une entité, comme dans `users {color: red}`, devient la couleur de sa table. Les noms de couleur d’AML, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` et `gray`, sont lus quelle que soit la casse, entre guillemets ou non, chacun comme la nuance 500 de la couleur Tailwind de ce nom, par exemple `#ef4444` pour `red`. Un hexadécimal entre guillemets comme `"#3498db"` est conservé tel qu’il est écrit ; un `#3498db` nu ne peut pas être lu, car `#` commence un commentaire AML. Toute autre valeur, ainsi qu’une propriété `color` sur un attribut ou une relation, est supprimée.  
Une instruction `rel` autonome, ou `fk` dans l’ancienne écriture, conserve ses propriétés `onDelete` et `onUpdate` comme `On Delete` et `On Update` de la relation, comme dans `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`. Les valeurs sont `cascade`, `restrict`, `set null`, `set default` et `no action`, entre guillemets ou non, quelle que soit la casse. Les autres propriétés sont supprimées.  
Sur une relation en ligne comme `user_id int -> users(id) {onDelete: cascade}`, les propriétés appartiennent à l’attribut, si bien qu’elles sont supprimées et que la relation est importée en `Not set`.  
Le nom du fichier doit se terminer par `.aml`.

GraphQL, DBML et AML sont des formats aller-retour : chacun est aussi une cible du [générateur de code](./code-generator.md).  
DBML et AML conservent les ON DELETE et ON UPDATE de chaque relation dans les deux sens (voir [Générateur de code](./code-generator.md#on-delete-and-on-update)). GraphQL ne conserve ni l’un ni l’autre, si bien qu’une importation GraphQL laisse les deux en `Not set`.  
DBML conserve aussi dans les deux sens les couleurs de table, sans leur transparence, et chaque groupe de tables qui contient une table. Un groupe sans nom revient sous la forme `group_1`, `group_2`, et ainsi de suite, et un nom de groupe répété revient suivi de `_2`, `_3`, et ainsi de suite. AML ne conserve une couleur de table que sous la forme du plus proche de ses noms de couleur, si bien que `#FF8800` est écrit `orange` et revient en `#f97316`, et il ne conserve aucun groupe. GraphQL ne conserve ni couleurs ni groupes.  
Aucun des trois ne conserve les noms logiques, les liens de domaine ni les dictionnaires, dans un sens comme dans l’autre : le générateur de code écrit le nom physique et le type de données de chaque table et de chaque colonne, jamais un nom logique ni un domaine.

## Exporter {#exporting}

Le sous-menu `Export` du menu contextuel du canevas comporte trois entrées :

- json : enregistre le diagramme tel que son fichier le contient, en `.erd.json` : les tables avec leurs colonnes et leurs index, les relations, les mémos et les groupes de tables, les noms logiques et les liens de domaine des colonnes, les mots, les termes et les domaines de l’onglet [Dictionnaire](./dictionary.md), ainsi que les paramètres, chaque [paramètre verrouillé](./settings.md#lock) à sa valeur verrouillée. Ce qui ne contient rien, comme un texte vide ou une ligne de dictionnaire vide, est omis (voir [Forme de stockage et valeur d’exécution](../../api/advanced/schema.md#storage-form-and-runtime-value)).
- Schema SQL : ouvre l’onglet [Schéma SQL](./schema-sql.md#saving-or-copying-the-sql) avec son panneau des options ouvert et le focus sur son bouton `Save file`, si bien qu’un appui sur `Enter` enregistre en `.sql` le SQL qu’affiche l’onglet. Rien n’est enregistré avant cela.
- Image : ouvre la boîte de dialogue `Export image`, qui enregistre le diagramme en `.png` ou en `.svg`, ou le copie dans le Presse-papiers au format PNG (voir [Image](#image)).

Les trois entrées fonctionnent dans un éditeur en lecture seule, où `Export` est l’une des rares entrées que conserve son menu du canevas. Là, json écrit les paramètres que contient le fichier, et non la vue, l’onglet, l’affichage des noms, le SGBD, les paramètres de code ni les bascules de `View Option` modifiés sur cet écran seulement (voir [Éditeurs en lecture seule](./settings.md#read-only-editors) dans Paramètres).  
L’outil `Export CSV` propre à l’onglet Dictionnaire, qui ne figure pas dans ce sous-menu, enregistre sa feuille `Domains`, `Words` ou `Terms` dans un fichier CSV. Contrairement à ces trois entrées, il n’est pas proposé dans un éditeur en lecture seule (voir [Importer et exporter des fichiers CSV](./dictionary.md#importing-and-exporting-csv)).

Le Schéma SQL écrit les ON DELETE et ON UPDATE de chaque relation après son `REFERENCES`, ON DELETE en premier. `Not set` n’écrit rien, et une action que la base de données sélectionnée n’accepte pas est omise. Pour savoir quelle base de données accepte quelle action, voir [Modification des relations](./relationship-editing.md#on-delete-and-on-update).

Chaque fichier exporté est nommé `<database name>-<timestamp>` suivi de son extension, l’horodatage étant en heure locale au format `yyyy-MM-dd'T'HH_mm_ss`, par exemple `my-schema-2026-08-29T04_05_06.erd.json`. Un nom de base de données vide est remplacé par `unnamed`.  
Le bouton `Save file` de l’onglet Schéma SQL et celui du [générateur de code](./code-generator.md) nomment leurs fichiers de la même façon, tout comme `Export CSV`, qui ajoute la feuille après l’horodatage : `-words.csv`, `-terms.csv` ou `-domains.csv`. Une image prend le nom de la base de données tel qu’il était à l’ouverture de la boîte de dialogue.

`Import`, `Import and Add` et `Export` sont aussi disponibles depuis la [recherche rapide](./quick-search.md) de l’onglet ERD, avec les mêmes entrées que le menu contextuel du canevas.

Dans Obsidian, aucune boîte de dialogue de téléchargement ou d’enregistrement n’apparaît : le fichier est écrit dans le coffre, là où Obsidian place les nouvelles pièces jointes de ce diagramme, et une notification indique son chemin.  
Les caractères qu’Obsidian n’autorise pas dans un nom de fichier, `\ / : * ? " < > |`, sont remplacés par `-`.  
L’explorateur de fichiers d’Obsidian ne liste un fichier `.erd.json` ou `.sql` exporté que tant que Settings → Files and links → Detect all file extensions est activé.

### Image {#image}

`Export` ▸ `Image`, depuis le menu contextuel du canevas ou depuis la recherche rapide, ouvre la boîte de dialogue `Export image` : un aperçu de l’image à côté de ses options. Un [explorateur](./explorer.md#dialogs-beside-it) ouvert reste ouvert sous la zone assombrie.

![Ouverture de Export > Image, désactivation du mode sombre et de l’arrière-plan, choix de 3x et copie de l’image dans le Presse-papiers](/img/demo-export.webp)

- `Background` : activé par défaut. Désactivé, il laisse le canevas transparent.
- `Dark mode` : correspond au départ à l’apparence de l’éditeur. Tant qu’il correspond à l’apparence affichée à l’écran, l’image prend les couleurs propres du canevas, modifications du [configurateur de thème](./language-and-theme.md) comprises ; l’autre apparence utilise le préréglage ayant la même nuance de gris et la même couleur d’accentuation.
- `Scale` : `1x`, `2x` ou `3x`, `2x` étant sélectionné par défaut. Il ne définit que la taille du PNG et de la copie dans le Presse-papiers, et la ligne en dessous indique cette taille, sous la forme `PNG <width> × <height> px`.

Les choix sont conservés jusqu’à la fermeture de l’éditeur et ne sont jamais enregistrés dans le document. L’aperçu est dessiné de la même façon que l’image, et il est redessiné lorsque `Background` ou `Dark mode` change.

L’image contient le diagramme tel qu’il était à l’ouverture de la boîte de dialogue ; fermez puis rouvrez la boîte de dialogue pour prendre en compte les modifications ultérieures. Ses tables et ses colonnes sont nommées selon la vue de l’affichage des noms que montrait alors l’éditeur, même une vue choisie sur votre seul écran tant que le verrou `Name View` en conserve une autre dans le fichier (voir [Au-delà du canevas](./logical-names.md#beyond-the-canvas)). Les couleurs que les [vérifications du dictionnaire](./dictionary.md#marks-on-the-canvas) donnent aux noms sur le canevas ne sont pas dessinées. L’image contient tout le diagramme, aussi loin que la vue ait défilé, est rognée à ce que dessine le diagramme plus une marge, et est toujours dessinée à 100 %, quel que soit le niveau de zoom qu’affiche l’éditeur, si bien que chaque table est dessinée en entier. Ce que masquent les [options d’affichage](./table-related-functions.md#table-view-options) (relations, leurs étiquettes ON DELETE et ON UPDATE, groupes de tables ou mémos) n’est pas dessiné et ne prend aucune place, et les groupes de tables sont dessinés derrière tout le reste.

Trois boutons écrivent l’image, et chacun laisse la boîte de dialogue ouverte :

- `PNG` : enregistre un `.png` de la taille du diagramme à 100 % multipliée par la valeur de `Scale`. Un PNG trop grand pour un canevas de navigateur est écrit à une résolution réduite au lieu d’échouer : la boîte de dialogue avertit au préalable avec `Reduced from <width> × <height> px, past what a browser canvas can hold`, et une notification indiquant `Exported at a reduced resolution` le signale ensuite.
- `SVG` : enregistre un `.svg` de la taille du diagramme à 100 %, quelle que soit la valeur de `Scale`, et jamais réduit. Son texte reste du texte et ses polices sont nommées plutôt qu’incorporées, si bien qu’une visionneuse qui n’a pas la police de l’éditeur en utilise une autre. Les ombres sont omises.
- `Copy to clipboard` : place un PNG dans le Presse-papiers à la valeur de `Scale` choisie, réduit comme l’est un PNG enregistré lorsqu’un canevas de navigateur ne peut pas le contenir. Il confirme avec `Copied the image to the clipboard`, ou avec `Copied at a reduced resolution` lorsque l’image a été réduite. Si la copie échoue, parce que le navigateur ou l’hôte refuse l’accès au Presse-papiers ou que l’image n’a pas pu être dessinée, `Couldn't copy the image` suggère plutôt d’enregistrer un PNG.

L’image est dessinée dans un worker en arrière-plan lorsque l’hôte en exécute un, si bien que l’éditeur reste utilisable pendant ce temps. Une notification indiquant `Exporting PNG`, `Exporting SVG` ou `Copying image` s’affiche lorsque l’opération dure plus d’un instant, et un échec est signalé par `Couldn't export the PNG` ou `Couldn't export the SVG`. Fermer la boîte de dialogue pendant qu’un fichier est encore en cours de dessin n’empêche pas l’enregistrement de ce fichier.

`PNG` a le focus à l’ouverture de la boîte de dialogue, et `Tab` maintient le focus à l’intérieur de la boîte de dialogue. `Escape`, le bouton `x` ou un clic sur la zone assombrie qui l’entoure la ferme.  
Tant qu’elle est ouverte, les raccourcis du canevas, annulation et rétablissement compris, ainsi que la copie et le collage, sont sans effet. `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac) la ferme et ouvre la recherche rapide. `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) la ferme et place le point d’insertion dans le champ Rechercher de l’[explorateur](./explorer.md#opening-and-closing), en ouvrant l’explorateur s’il est fermé, sans jamais le fermer. Dans un éditeur trop étroit pour afficher l’explorateur, ce raccourci ferme quand même la boîte de dialogue, mais affiche une notification au lieu de déplacer le point d’insertion.
