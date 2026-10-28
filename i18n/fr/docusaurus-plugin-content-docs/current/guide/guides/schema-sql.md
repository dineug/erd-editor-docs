---
sidebar_position: 12
description: Lire le DDL du diagramme dans l’onglet Schéma SQL, choisir la base de données, le délimiteur, les instructions, l’en-tête, les noms logiques dans les commentaires vides et les tables dans son panneau des options, ajouter vos propres scripts avant et après les tables, et enregistrer ou copier le SQL.
---

# Schéma SQL

L’onglet `Schema SQL` affiche le DDL du diagramme pour la base de données sélectionnée : le SQL qui crée ses tables avec leurs clés, leurs index et leurs clés étrangères.  
Passez à l’onglet `Schema SQL` dans la barre d’outils, ou choisissez `Schema SQL` sous `Tab` dans la [recherche rapide](./quick-search.md). Choisir `Schema SQL` dans le sous-menu `Export` l’ouvre aussi, prêt pour l’enregistrement (voir [Enregistrer ou copier le SQL](#saving-or-copying-the-sql)).

Le SQL se trouve à gauche et, à sa droite, un panneau des options intitulé `Schema SQL` regroupe les choix qui le façonnent (voir [Panneau des options](#options-panel)). Même dans une langue d’affichage de droite à gauche, le SQL reste à gauche et se lit de gauche à droite.  
Le panneau s’ouvre de lui-même, sauf si l’éditeur fait moins de 640 px de large à la première ouverture de l’onglet. `Hide options`, dans l’en-tête du panneau, le réduit, et `Show options`, en haut à droite du code, le rouvre. Il reste ensuite ouvert ou réduit tel que vous l’avez laissé, d’un changement d’onglet à l’autre, tant que l’éditeur est ouvert. Il se réduit et s’ouvre indépendamment du panneau de l’onglet Générateur de code, et n’est jamais enregistré dans le fichier.

![Ouverture de Export > Schema SQL, passage des instructions à Drop & re-create et de l’en-tête à USE, puis ajout d’un script SET NAMES avant les tables](/img/demo-schema-sql-options.webp)

Cliquez avec le bouton droit sur le SQL pour ouvrir son menu contextuel :

- `Database` et `Bracket`, deux sous-menus qui cochent chacun la valeur actuelle.
- `Statements` et `Header`, deux sous-menus qui cochent chacun le choix en vigueur. Un choix dont la base de données ne dispose pas porte une mention atténuée comme `not in Oracle` et ne fait rien.
- `Options panel`, coché tant que le panneau est affiché, qui le réduit ou l’ouvre.
- `Save file`

Tant que cet onglet est ouvert, la recherche rapide propose `Database` et `Bracket` ; `Schema SQL: Statements` et `Schema SQL: Header`, qui ne listent que les choix dont dispose la base de données ; et `Schema SQL: Options panel`, qui réduit ou ouvre le panneau.  
Ni le menu contextuel ni la recherche rapide ne proposent `Write logical names into empty comments`, qui ne se trouve que dans le panneau des options (voir [Noms logiques en commentaire](#logical-names-as-comments)).

Le SQL est écrit à l’ouverture de l’onglet, puis de nouveau chaque fois que change l’un des choix du panneau, le nom de la base de données ou un script. Une modification apportée aux tables pendant que l’onglet est ouvert, comme celle d’un collaborateur ou d’un agent de codage, apparaît une fois que vous quittez l’onglet et y revenez, ou dès que l’un de ces éléments change.

La boîte de dialogue [Propriétés de la table](./table-related-functions.md#table-properties) possède son propre onglet `Schema SQL`, qui affiche le DDL d’une seule table. Il écrit toujours de simples instructions `CREATE`, sans en-tête ni scripts, n’écrit jamais de nom logique dans un commentaire vide, n’a pas de panneau des options, et son menu contextuel ne propose que `Database` et `Bracket`.

## Panneau des options {#options-panel}

Le panneau contient trois groupes, chacun sous une légende :

1. `Saved in the document` : `Database` et `Bracket` (voir [Base de données et délimiteur](#database-and-bracket)). Un éditeur en lecture seule les légende `This window only` (voir [Éditeurs en lecture seule](#read-only-editors)).
2. `This window only` : `Statements`, `Header`, `Write logical names into empty comments` et, tant que le diagramme comporte un [groupe de tables](./table-groups.md), `Tables` (voir [Instructions](#statements), [En-tête](#header), [Noms logiques en commentaire](#logical-names-as-comments) et [Tables](#tables)).
3. `Saved in the document · written as is for every database` : les scripts `Before tables` et `After tables` (voir [Scripts avant et après les tables](#before-and-after-scripts)).

`Save file` et `Copy` se trouvent en bas du panneau (voir [Enregistrer ou copier le SQL](#saving-or-copying-the-sql)).

Les choix sous `This window only` appartiennent à la fenêtre de l’éditeur dans laquelle vous les faites. Ils ne sont ni enregistrés dans le document, ni partagés avec les collaborateurs, ni consignés dans l’historique d’annulation, et ils sont réinitialisés à la fermeture ou au rechargement de l’éditeur ; un changement d’onglet les conserve.  
`Statements` démarre sur `If not exists`, `Header` sur `CREATE + USE`, et `Write logical names into empty comments` désactivé. Le SQL qu’une page intégrant l’éditeur lit avec [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql), et celui que [lit un agent de codage](../../mcp/tools.md#reading-a-document), démarrent plutôt sur `Create`, sans en-tête, et n’écrivent de noms logiques que sur demande.

Un choix dont la base de données sélectionnée ne dispose pas reste dans le panneau, grisé, avec l’info-bulle `Not in <database>`, comme `Not in Oracle`, et appuyer dessus ne fait rien.  
Le SQL utilise alors la forme la plus proche dont dispose la base de données, et le bouton de cette forme apparaît enfoncé : `If not exists` se rabat sur `Create`, `CREATE + USE` sur `USE`, ou sur `None` lorsque la base de données n’a pas non plus `USE`, et `USE` sur `None`. Votre choix est conservé, si bien que passer à une base de données qui en dispose le fait revenir.

## Base de données et délimiteur {#database-and-bracket}

`Database` est la base de données du diagramme, le même paramètre que `Database` dans le menu contextuel du canevas et que celui du générateur de code (voir [Bases de données](./table-related-functions.md#databases)). Il liste Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake et SQLite, démarre sur MySQL, et est enregistré dans le fichier comme toute modification.

`Bracket` définit le délimiteur placé autour des noms de table, de colonne, de contrainte et d’index : `SingleQuote`, `DoubleQuote`, `Backtick`, ou `None` pour n’en placer aucun, ce qui est la valeur par défaut. C’est le même paramètre que celui du générateur de code (voir [Délimiteur](./code-generator.md#bracket)).  
Snowflake, qui ne délimite les noms qu’avec des guillemets doubles, les utilise pour tout choix autre que `None`, et Databricks délimite toujours les noms avec des accents graves.  
`Bracket` n’est enregistré dans le fichier que tant que le verrou `Bracket Type` de l’onglet Paramètres est désactivé, et un nouveau diagramme a tous ses verrous activés. Tant que le verrou est activé, une modification réécrit le SQL à l’écran, mais le fichier conserve la valeur verrouillée et le diagramme se rouvre avec elle (voir [Verrouillage](./settings.md#lock)).

Tant que la base de données est Oracle et que le SQL contient un nom de plus de 30 octets, ce que refusent Oracle 12.1 et les versions antérieures, une note sous les deux listes nomme chacun de ces noms : `Oracle 12.2+ for names over 30 bytes: <names>`. Elle vérifie les noms de table, de colonne, de schéma, de clé, d’index, de séquence et de déclencheur. Le SQL lui-même ne change pas.

## Instructions {#statements}

`Statements` détermine la façon dont les tables sont créées :

- `Create` écrit de simples instructions `CREATE`.
- `If not exists` ignore les tables et les index qui existent déjà. MySQL, MariaDB, PostgreSQL, SQLite et Databricks en disposent ; MSSQL, Oracle et Snowflake écrivent `Create` à la place.
  - MySQL écrit chaque table sous la forme `CREATE TABLE IF NOT EXISTS`, avec ses contraintes d’unicité, ses index et ses clés étrangères à l’intérieur, et place tout le lot entre `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` et `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;`.
  - MariaDB place `IF NOT EXISTS` sur chaque instruction : le `CREATE TABLE`, chaque contrainte `UNIQUE` et `FOREIGN KEY`, et chaque `CREATE INDEX`.
  - PostgreSQL écrit `CREATE TABLE IF NOT EXISTS` et `CREATE INDEX IF NOT EXISTS`, et supprime chaque clé étrangère avec `DROP CONSTRAINT IF EXISTS` avant de la rajouter.
  - SQLite écrit `CREATE TABLE IF NOT EXISTS` et `CREATE INDEX IF NOT EXISTS`.
  - Databricks écrit `CREATE TABLE IF NOT EXISTS`, et supprime chaque clé étrangère avec `DROP CONSTRAINT IF EXISTS` avant de la rajouter.
- `Drop & re-create` supprime toutes les tables qu’il écrit avant de les recréer, sauf sur Snowflake. Toutes les bases de données en disposent :
  - MySQL et MariaDB écrivent un `DROP TABLE IF EXISTS` pour chaque table, entre les deux mêmes lignes qui désactivent puis réactivent la vérification des clés étrangères.
  - PostgreSQL écrit un seul `DROP TABLE IF EXISTS` qui nomme toutes les tables et qui échoue si une table hors de la liste fait référence à l’une d’elles. Avec un en-tête `CREATE + USE`, une table dont le nom n’indique aucun schéma est supprimée de ce schéma, comme `shop.member`.
  - MSSQL écrit une seule transaction, qui nécessite SQL Server 2016 ou version ultérieure, comme l’indique l’info-bulle `SQL Server 2016+` du bouton. Elle supprime les clés étrangères que portent les tables écrites, puis les tables avec un seul `DROP TABLE IF EXISTS`, et est annulée en cas d’erreur. Une clé étrangère portée par une table hors de la liste bloque tout de même la suppression.
  - SQLite écrit `PRAGMA foreign_keys=OFF;`, qui reste en vigueur pour cette connexion, puis un `DROP TABLE IF EXISTS` pour chaque table.
  - Oracle écrit `DROP TABLE … CASCADE CONSTRAINTS` pour chaque table et `DROP SEQUENCE` pour chaque séquence d’auto-incrément, chacun dans un bloc PL/SQL qui se termine par une ligne `/` et ignore l’erreur que lève une table ou une séquence absente.
  - Databricks écrit un `DROP TABLE IF EXISTS` pour chaque table.
  - Snowflake ne supprime rien et écrit `CREATE OR REPLACE TABLE` à la place.

Tant que `Drop & re-create` est en vigueur, un avertissement dans le panneau nomme les tables qu’il supprime : `Drops <tables> before creating them. Their rows are lost.`, ou sur Snowflake `Replaces <tables>. Their rows are lost.`  
Jusqu’à cinq tables, l’avertissement les nomme toutes. Au-delà de cinq, il nomme les quatre premières et compte les autres, comme `a, b, c, d, and 3 more tables`.

## En-tête {#header}

`Header` ouvre le SQL avec les instructions qui créent ou sélectionnent la base de données, ou le schéma, où il s’exécute. Le nom est le nom de base de données du diagramme, saisi dans le champ `database name` de la barre d’outils, et il est délimité par le caractère choisi dans `Bracket`.

- MySQL et MariaDB : `USE` écrit `USE shop;`, et `CREATE + USE` écrit `CREATE DATABASE IF NOT EXISTS shop;` avant celle-ci.
- MSSQL : `USE` écrit `USE shop` et `GO`, et `CREATE + USE` écrit `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` et `GO` avant celles-ci.
- PostgreSQL ne dispose que de `CREATE + USE`, qui écrit `CREATE SCHEMA IF NOT EXISTS shop;` et `SET search_path TO shop, public;`.
- Oracle ne dispose que de `USE`, qui écrit `ALTER SESSION SET CURRENT_SCHEMA = shop;`. `CREATE + USE` se rabat sur celui-ci, si bien que c’est la ligne qu’Oracle écrit avec l’en-tête par défaut de l’onglet.
- Snowflake et Databricks : `USE` écrit `USE SCHEMA shop;`, et `CREATE + USE` écrit `CREATE SCHEMA IF NOT EXISTS shop;` avant celle-ci.
- SQLite ne dispose d’aucun des deux et n’écrit aucun en-tête.

Lorsque la base de données dispose de `USE` ou de `CREATE + USE`, l’info-bulle du bouton indique ce qu’il y écrit, comme `CREATE SCHEMA + SET search_path` sur PostgreSQL.

Un en-tête n’est écrit que tant que le nom de la base de données est un identifiant simple : une lettre ASCII (`A`–`Z`, `a`–`z`) ou `_`, puis des lettres ASCII, des chiffres ou des `_`.  
Tout autre nom, y compris un nom vide, n’écrit aucun en-tête, et le `DROP TABLE` de PostgreSQL ne nomme alors aucun schéma. Tant qu’un en-tête autre que `None` est en vigueur, une note sous `Header` le signale : `Database name "<name>" is not a valid identifier.`  
Le nom de base de données d’un nouveau diagramme est vide, si bien que, tant que vous ne lui avez pas donné de nom, le panneau affiche `Database name "" is not a valid identifier.`

## Noms logiques en commentaire {#logical-names-as-comments}

`Write logical names into empty comments`, un interrupteur sous `This window only`, écrit dans le DDL le [nom logique](./logical-names.md) d’une table ou d’une colonne là où son commentaire est vide, sur toutes les bases de données.

![Activation de Write logical names into empty comments dans le panneau Schema SQL, qui écrit le nom logique de chaque colonne d’order_items dans son COMMENT vide, tandis que les commentaires de members restent inchangés](/img/demo-schema-sql-logical-names.webp)

- Un commentaire qui contient du texte l’emporte toujours : le nom logique ne le remplace jamais et ne lui est jamais ajouté.
- Un commentaire composé uniquement de blancs compte comme vide, si bien que le nom logique est écrit à sa place. Un nom logique vide ou composé uniquement de blancs n’écrit rien, et cette table ou cette colonne ne reçoit toujours aucun commentaire.
- Le nom logique est écrit à l’endroit et sous la forme où la base de données écrit un commentaire, ses guillemets étant échappés de la même façon (voir [Commentaires](#comments)).

Sur MySQL, par exemple, une colonne `id` dont le nom logique est `Member ID` et qui n’a pas de commentaire est écrite avec `COMMENT 'Member ID'`, tandis qu’une colonne `email` dont le nom logique est `Email` et le commentaire `Sign-in address` conserve `COMMENT 'Sign-in address'`.

Comme `Statements` et `Header`, l’interrupteur appartient à la fenêtre et démarre désactivé (voir [Panneau des options](#options-panel)).  
Une importation ne relit jamais un tel commentaire comme un nom logique (voir [Commentaires](./file-import-export.md#comments)).

## Tables {#tables}

Tant que le diagramme comporte au moins un [groupe de tables](./table-groups.md), affiché ou masqué, `Tables` apparaît sous `This window only` avec une case à cocher pour chaque choix :

- `All`, qui coche ou décoche toutes les cases. Cette case affiche un état mixte tant que seules certaines sont cochées.
- Une case par groupe de tables, dans l’ordre des groupes du diagramme, libellée du nom du groupe, ou de `unnamed` pour un groupe sans nom, après un point de la couleur du groupe lorsqu’il en a une.
- `No group`, pour les tables qui n’appartiennent à aucun groupe.

Lorsque toutes les cases sont cochées, l’onglet écrit tout le diagramme.  
Lorsque seules certaines le sont, il écrit les tables des cases cochées avec leurs index et les clés étrangères qu’elles portent, y compris celles qui font référence à une table exclue. Les scripts avant et après les tables sont tout de même écrits, et `Drop & re-create`, son avertissement et la note Oracle sur les noms longs ne portent que sur ces tables.  
Lorsqu’aucune case n’est cochée, l’onglet n’écrit rien, et une indication par-dessus le code affiche `No tables chosen. Check some under Tables.` `Save file` enregistre alors un fichier vide, et `Copy` copie un texte vide.

Comme `Statements` et `Header`, ce choix appartient à la fenêtre (voir [Panneau des options](#options-panel)).  
Un groupe ajouté par la suite n’est coché au départ que si toutes les cases étaient cochées à ce moment-là. Supprimer un groupe retire sa case, et supprimer le dernier groupe recoche tout.  
Ce choix ne s’applique qu’à cet onglet. L’onglet `Schema SQL` de la boîte de dialogue Propriétés de la table et `getSchemaSQL()` n’en sont pas affectés.

## Scripts avant et après les tables {#before-and-after-scripts}

`Before tables` et `After tables` contiennent votre propre SQL, comme des instructions `CREATE EXTENSION` ou `SET` avant les tables, ou des attributions de droits, des vues et des données initiales après elles.  
Ils sont enregistrés dans le document, une seule paire pour tout le diagramme, quelle que soit la base de données. Chacun est écrit dans le SQL tel que vous l’avez saisi, sans jamais être vérifié : le script avant les tables se place après l’en-tête et avant les instructions `DROP` et les tables, et le script après les tables, tout à la fin.

Les sauts de ligne sont écrits en LF, et les lignes vides en tête d’un script ainsi que les espaces à sa fin sont supprimés.  
Sur MSSQL, une ligne `GO` est ajoutée après un script dont la dernière ligne n’est pas `GO` (ou `GO` suivi d’un nombre), comme l’indique la ligne sous les deux champs. Sur Oracle, terminez vous-même un bloc PL/SQL par sa ligne `/`.

Les champs colorent la syntaxe SQL et s’agrandissent avec leur texte.  
Une modification est appliquée lorsque vous quittez le champ, en cliquant ailleurs ou en changeant d’onglet, et c’est seulement alors que le SQL à côté et le document changent. Un champ dans lequel vous avez seulement cliqué ne change rien.  
Une modification de script change le diagramme comme toute autre modification : elle est enregistrée dans le fichier, les collaborateurs la voient, et chaque modification appliquée est une étape de l’[historique d’annulation](./undo-redo.md), annulable depuis l’onglet ERD.  
Pendant que vous saisissez du texte dans un champ, les raccourcis propres à l’éditeur sont laissés au champ, si bien que `Ctrl + Z` (Windows/Linux) ou `⌘ + Z` (Mac) y annule votre saisie, et que copier, couper et coller agissent sur le texte plutôt que sur le diagramme.  
La recherche rapide et la [recherche de l’explorateur](./find-and-replace.md) s’ouvrent toujours avec leurs raccourcis, `Ctrl + K` et `Ctrl + F` (Windows/Linux) ou `⌘ + K` et `⌘ + F` (Mac). Puisque `Ctrl + F` ou `⌘ + F` bascule vers l’onglet ERD, il applique votre modification, comme tout changement d’onglet.  
Un champ qui n’a pas le focus clavier suit une modification qu’un collaborateur ou un [agent de codage](../../mcp/tools.md#settings) apporte à son script. Un champ dans lequel vous vous trouvez affiche cette modification lorsque vous le quittez sans rien y avoir saisi. Si vous y avez saisi quelque chose, votre texte est appliqué lorsque vous quittez le champ et remplace le leur.

## Enregistrer ou copier le SQL {#saving-or-copying-the-sql}

`Save file`, en bas du panneau ou dans le menu contextuel, enregistre exactement le SQL qu’affiche l’onglet, avec sa base de données, son délimiteur, ses instructions, son en-tête, ses noms logiques en commentaire, ses tables et ses scripts actuels, sous le nom `<database name>-<timestamp>.sql`. Le fichier est nommé et enregistré comme toute autre exportation (voir [Exporter](./file-import-export.md#exporting)).

`Export` ▸ `Schema SQL`, dans le menu contextuel du canevas ou dans la recherche rapide, n’enregistre rien à lui seul.  
Il passe à cet onglet, ouvre le panneau des options même s’il était réduit, et place le focus clavier sur `Save file`, si bien qu’un appui sur `Enter` enregistre le fichier.

`Copy`, en bas du panneau, ou le bouton de copie qui apparaît en haut à droite du code lorsque vous le survolez, copie le SQL.  
Une notification `Copied!` avec une coche le confirme pendant deux secondes. Si le navigateur ou l’hôte refuse l’accès au Presse-papiers, une notification `Couldn't copy to the clipboard` avec un signe d’avertissement le signale à la place, pendant cinq secondes. Copier de nouveau remplace la notification au lieu d’en ajouter une autre.  
Le SQL est aussi sélectionnable, si bien que vous pouvez n’en prendre qu’une partie.

## Ce qu’écrit le DDL {#what-the-ddl-writes}

Ces règles valent partout où l’éditeur écrit le Schéma SQL : dans cet onglet et dans son fichier, ainsi que dans le SQL que lit une page qui intègre l’éditeur ou un agent de codage.  
L’onglet `Schema SQL` de la boîte de dialogue Propriétés de la table les suit pour la seule table qu’il affiche. Il n’écrit ni séquence ni déclencheur Oracle, ni clé étrangère, sauf celles de SQLite, qui se trouvent dans son `CREATE TABLE`. Il n’écrit pas non plus les instructions de commentaire que PostgreSQL, Oracle et MSSQL placent après une table, si bien que, sur ces trois bases de données, il n’affiche aucun commentaire.

Les parties se suivent dans cet ordre, séparées par une ligne vide : l’en-tête, le script avant les tables, les instructions `DROP`, les tables et le script après les tables. Les tables sont écrites dans l’ordre de leur nom.  
Un diagramme sans tables ni scripts n’écrit rien, même avec un en-tête choisi.

Les tables et les colonnes sont écrites sous leur nom physique, quelle que soit la vue de l’[affichage des noms](./logical-names.md#name-view). Une colonne liée à un domaine est écrite avec son propre type de données, que fixe le domaine (voir [Domaines et types de données](./dictionary.md#domains-and-data-types)).

### Auto-incrément {#auto-increment}

Une colonne marquée `Auto Increment` est écrite comme chaque base de données l’écrit : `AUTO_INCREMENT` sur MySQL et MariaDB, `IDENTITY(1,1)` sur MSSQL, `AUTOINCREMENT` sur Snowflake, et `GENERATED ALWAYS AS IDENTITY` sur PostgreSQL et Databricks.  
Oracle reçoit une séquence `SEQ_<table>` et un déclencheur `SEQ_TRG_<table>` qui remplit la colonne à partir de celle-ci. Le déclencheur se termine par une ligne `/`, si bien que SQL\*Plus et SQLcl l’exécutent.

Lorsqu’une base de données n’accepte pas l’auto-incrément sur le type de la colonne, la clause est omise, et une ligne de commentaire après la table nomme la colonne :

- PostgreSQL ne l’accepte que sur `smallint`, `integer` ou `bigint`, sous n’importe lequel de leurs noms : `INT`, `INTEGER`, `BIGINT`, `SMALLINT`, `INT2`, `INT4` ou `INT8`. Une colonne d’un autre type ne reçoit ni la clause ni de valeur par défaut, et le commentaire indique, par exemple, `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`
- Databricks ne l’accepte que sur `BIGINT` ou `LONG`.
- SQLite n’accepte `AUTOINCREMENT` que sur la seule colonne de clé primaire d’une table, d’un type entier comme `INT`, `BIGINT` ou `INT8`, avec ou sans largeur. Cette colonne est écrite en `INTEGER`, et la clé en `PRIMARY KEY (id AUTOINCREMENT)`. Une clé à une seule colonne de tout autre type est écrite sans auto-incrément.

### Actions référentielles {#referential-actions}

Les actions ON DELETE et ON UPDATE qu’écrit chaque base de données sont listées dans [ON DELETE et ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Lorsque Snowflake omet une action, un commentaire au-dessus de l’`ALTER TABLE` de cette clé étrangère la nomme, comme `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### Noms de table qualifiés par le schéma {#schema-qualified-table-names}

Avec `Bracket` sur `None`, un nom de table contenant un point, comme `sales.users`, est lu comme un schéma et une table, séparés au dernier point situé hors crochets ou guillemets doubles.

- MySQL, MariaDB, MSSQL, Oracle et PostgreSQL construisent les noms automatiques qu’ils écrivent à partir de la seule partie table : `FK_users_TO_orders` et `IDX_users` sur les cinq, `UQ_users_email` sur tous sauf PostgreSQL, et `PK_users` sur MSSQL et Oracle, les deux seuls à nommer la clé primaire. Sur ces deux-là, `[sales].[users]` et `"sales"."users"` donnent aussi `PK_users`, et `[Order]` donne `PK_Order`.
- SQLite ne nomme aucune contrainte, si bien que le seul nom automatique qu’il construit est celui de l’index : `CREATE INDEX sales.IDX_users ON users`.
- Oracle crée les index de la table, ainsi que la séquence et le déclencheur d’une colonne auto-incrémentée, dans le schéma de la table : `sales.IDX_users`, `sales.SEQ_users` et `sales.SEQ_TRG_users`.
- Dans Oracle et SQLite, un nom d’index auquel vous avez vous-même donné un schéma le conserve.
- Un nom automatique de clé étrangère ou d’index qui répète un nom précédent, sans tenir compte de la casse, reçoit un numéro. Lorsque `sales.users` et `hr.Users` sont tous deux référencés depuis `orders`, la seconde clé est `FK_Users_TO_orders1`.

Avec tout autre `Bracket`, le nom de table entier forme un seul identifiant, comme `"PK_sales.users"`. Snowflake et Databricks conservent toujours le nom entier.  
Les lignes `Keys` de l’onglet [Index](./table-related-functions.md#indexes) affichent les mêmes noms.

### Valeurs par défaut {#defaults}

La valeur par défaut d’une colonne est écrite telle que vous l’avez saisie, mais entre parenthèses lorsque la base de données ne lit cette expression qu’à l’intérieur de parenthèses. Une valeur par défaut déjà entre parenthèses est laissée telle quelle.

- MySQL met entre parenthèses tout ce qui n’est pas un littéral ou l’heure actuelle, comme `(uuid())`. Il met aussi entre parenthèses toute valeur par défaut autre que `NULL` sur une colonne `BLOB`, `TEXT`, `JSON`, spatiale ou `LONG…`, ainsi que l’heure actuelle sur toute colonne autre que `TIMESTAMP` ou `DATETIME`.
- MariaDB met entre parenthèses tout ce qui n’est pas un littéral, l’heure actuelle, un appel de fonction ou un nom.
- SQLite met entre parenthèses tout ce qui n’est pas un littéral ou un nom, comme `(datetime('now'))`.
- PostgreSQL ne met entre parenthèses qu’une expression contenant un mot comme `AT TIME ZONE`, `AND`, `OR`, `IS`, `IN`, `LIKE`, `COLLATE` ou `= ANY` hors parenthèses, comme `(now() AT TIME ZONE 'utc')`.
- MSSQL, Oracle, Snowflake et Databricks écrivent toutes les valeurs par défaut telles que saisies.

### Commentaires {#comments}

Le commentaire non vide d’une table ou d’une colonne, ou le nom logique que [`Write logical names into empty comments`](#logical-names-as-comments) écrit à sa place, est écrit comme chaque base de données écrit les commentaires :

- MySQL et MariaDB l’écrivent en ligne : une colonne se termine par `COMMENT 'Member ID'`, et la table se ferme par `) COMMENT 'Members';`, y compris dans le lot `If not exists` de MySQL.
- Snowflake écrit celui d’une colonne en ligne, `COMMENT 'Member ID'`, et celui de la table sur sa propre ligne après la parenthèse fermante, `COMMENT = 'Members';`.
- Databricks écrit celui d’une colonne en ligne, et celui de la table sous la forme `COMMENT 'Members';` après `USING DELTA`.
- PostgreSQL écrit `COMMENT ON TABLE member IS 'Members';` et `COMMENT ON COLUMN member.id IS 'Member ID';` juste après le `CREATE TABLE` de la table. Oracle écrit les mêmes instructions après la table, ses contraintes d’unicité, ainsi que sa séquence et son déclencheur d’auto-incrément.
- MSSQL écrit un appel par table et par colonne, après la table et ses contraintes d’unicité, chacun suivi de `GO` : `EXECUTE sys.sp_addextendedproperty 'MS_Description', N'Members', 'schema', 'dbo', 'table', 'member'`, avec `'column', 'id'` ajouté pour une colonne.  
  Le texte est un littéral national, `N'…'`, si bien que SQL Server conserve le texte hors de la page de codes de la base de données, comme du coréen, au lieu d’enregistrer des points d’interrogation.  
  Avec `Bracket` sur `None`, une table nommée `sales.users` donne le schéma `sales` et la table `users`, tout comme `[sales].[users]` et `"sales"."users"`, dont les crochets et les guillemets doubles sont retirés. Un nom sans schéma est placé dans `dbo`. Une partie placée avant le schéma, comme dans `shop.sales.users`, exécute la procédure de cette base de données, `shop.sys.sp_addextendedproperty`. Avec tout autre `Bracket`, le nom entier est celui de la table, dans `dbo`.
- SQLite ne conserve aucun commentaire, si bien qu’il écrit chacun sous la forme d’une ligne `--` au-dessus de ce qu’il décrit : `-- Members` au-dessus de `CREATE TABLE member`, et `-- Member ID` au-dessus de la colonne.

Un guillemet à l’intérieur d’un commentaire entre guillemets est doublé, comme dans `'it''s'` et `N'it''s'`, tout comme celui d’un nom que passent les appels de MSSQL. Databricks échappe plutôt un guillemet et une barre oblique inverse par une barre oblique inverse, comme dans `'it\'s'`, la forme que lit chaque version de Spark. Les lignes `--` de SQLite ne sont pas entre guillemets, si bien qu’elles conservent un guillemet tel que saisi : `-- it's`.  
Le texte est par ailleurs écrit tel que saisi, sauts de ligne compris, sauf sur deux bases de données :

- Oracle omet les lignes vides, une ligne composée uniquement d’espaces ou de tabulations comptant comme vide, car SQL\*Plus termine une instruction à une ligne vide et en ignore la suite. Un commentaire de table composé de `Members`, d’une ligne vide et de `Active only` est écrit sous la forme `COMMENT ON TABLE member IS 'Members`, avec `Active only';` sur la ligne suivante.
- SQLite écrit chaque suite de sauts de ligne sous la forme d’un seul espace, car un saut de ligne terminerait la ligne `--` et exécuterait la suite comme du SQL. Le même commentaire est écrit sous la forme `-- Members Active only`.

La façon dont ces commentaires sont relus à l’importation est décrite dans [Commentaires](./file-import-export.md#comments).

## Éditeurs en lecture seule {#read-only-editors}

Dans un éditeur [`readonly`](../../api/erd-editor-element.md#readonly), l’onglet fonctionne pour le lecteur, et rien de ce qui s’y fait n’atteint le document :

- `Database` et `Bracket` réécrivent toujours le SQL, mais dans cette fenêtre seulement, si bien que le panneau les légende lui aussi `This window only`. Un choix n’est ni enregistré dans le fichier, ni partagé avec les collaborateurs, ni consigné pour l’annulation, quels que soient les verrous, et le changement d’un collaborateur sur un paramètre que vous avez choisi laisse votre choix à l’écran. L’onglet Générateur de code affiche le même choix, et [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) appelé sans SGBD l’écrit lui aussi. Quand l’éditeur redevient modifiable, le SGBD et le délimiteur du document reviennent.
- `Statements`, `Header`, `Write logical names into empty comments` et `Tables` fonctionnent comme partout, puisqu’ils appartiennent déjà à la fenêtre.
- Les deux champs de script sont en lecture seule : ils affichent les scripts du document, que le SQL écrit toujours, et n’acceptent aucune saisie.
- `Save file` et `Copy` enregistrent et copient le SQL que l’onglet affiche.
