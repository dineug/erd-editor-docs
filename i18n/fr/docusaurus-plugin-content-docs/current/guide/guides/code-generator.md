---
sidebar_position: 13
description: Générer du code pour vingt-deux cibles à partir du diagramme, choisir le langage, la base de données, la casse des noms et le délimiteur dans le panneau des options, voir quelles cibles écrivent les actions ON DELETE et ON UPDATE d’une relation, et enregistrer ou copier le résultat.
---

# Générateur de code

Passez à l’onglet `Code Generator` dans la barre d’outils. L’onglet affiche le code de tout le document à gauche et, à sa droite, un panneau des options intitulé `Code Generator`, où vous choisissez le langage, la base de données, les casses des noms et, pour certaines cibles, le délimiteur.  
Le panneau s’ouvre de lui-même, sauf si l’éditeur fait moins de 640 px de large à la première ouverture de l’onglet. `Hide options`, en haut du panneau, le réduit, et `Show options`, en haut à droite du code, le rouvre. Il reste ouvert ou réduit d’un changement d’onglet à l’autre tant que l’éditeur est ouvert, indépendamment du panneau de l’onglet Schéma SQL, et n’est jamais enregistré dans le fichier.

Cliquez avec le bouton droit sur le code pour ouvrir son menu contextuel : `Language`, `Database`, `Table Name Case`, `Column Name Case`, `Bracket` (uniquement pour `Doctrine`, `JPA` et `SeaORM`), chacun avec un sous-menu qui coche la valeur actuelle, puis `Options panel`, qui réduit ou ouvre le panneau et est coché tant que celui-ci est affiché, et `Save file`.  
Tant que cet onglet est ouvert, la [recherche rapide](./quick-search.md) propose `Database`, `Bracket` (uniquement pour `Doctrine`, `JPA` et `SeaORM`), `Language`, `Table Name Case`, `Column Name Case` et `Code Generator: Options panel`, qui réduit ou ouvre le panneau.

![Choix de TypeScript, puis de Rust, dans le menu contextuel du code, passage des noms de colonne à Snake dans le panneau des options et copie du code](/img/demo-code-generator.webp)

La même vue du code constitue aussi l’onglet `Code Generator` de la boîte de dialogue [Propriétés de la table](./table-related-functions.md#table-properties), où elle génère le code de cette seule table au lieu de tout le document. Elle n’y a pas de panneau des options, et son menu contextuel modifie les mêmes paramètres mais ne propose ni `Options panel` ni `Save file`.  
Là où le code de tout le document commence par des imports ou un en-tête, celui de la table seule commence par ceux dont cette table a besoin, comme `<?php` pour `PHP`, `import Foundation` pour `Swift` ou `$schema` pour `JSON Schema`.

Le code est écrit à l’ouverture de l’onglet, puis de nouveau chaque fois que changent le langage, la base de données, une casse des noms ou le délimiteur. Une modification apportée au diagramme pendant que l’onglet est ouvert, comme celle d’un collaborateur ou d’un agent de codage, apparaît une fois que vous quittez l’onglet et y revenez, ou dès que l’un de ces paramètres change.

## Panneau des options {#options-panel}

Sous la légende `Saved in the document`, le panneau liste `Language`, `Database`, `Table Name Case` et `Column Name Case`, suivis de `Bracket` tant que le langage est `Doctrine`, `JPA` ou `SeaORM`. Chacun est une liste déroulante, et une modification réécrit aussitôt le code.  
Lorsque le langage sélectionné ignore `Database` ou les casses des noms, ces paramètres restent dans le panneau, grisés, avec en dessous une note comme `Not used by DBML`, et peuvent toujours être modifiés.  
`Save file` et `Copy` se trouvent en bas du panneau (voir [Enregistrer ou copier le résultat](#saving-or-copying-the-result)).

Ce sont les paramètres propres au diagramme, ceux que modifient aussi le menu contextuel et la recherche rapide. `Database` est enregistré dans le fichier comme toute modification.  
`Language`, `Table Name Case`, `Column Name Case` et `Bracket` ne sont enregistrés que tant que leur verrou de l’onglet Paramètres est désactivé (`Bracket Type` pour `Bracket`), et un nouveau diagramme a tous ses verrous activés. Tant qu’un verrou est activé, une modification réécrit le code à l’écran, mais le fichier conserve la valeur verrouillée et le diagramme se rouvre avec elle. Le panneau n’affiche aucun signe de verrou ; pour conserver un choix dans le fichier, désactivez son verrou (voir [Verrouillage](./settings.md#lock)).  
Dans un éditeur en lecture seule, la légende indique plutôt `This window only`, puisqu’un changement n’y atteint que cette fenêtre (voir [Éditeurs en lecture seule](#read-only-editors)).

## Langage {#language}

Vingt-deux cibles sont prises en charge, réparties en trois groupes (langages, ORM, puis schémas), chacun par ordre alphabétique. La liste du panneau et le menu contextuel tracent une ligne entre les groupes, mais n’en nomment aucun :

| Cible | Groupe | Relations | Index | ON DELETE / ON UPDATE | Enregistré sous |
| --- | --- | --- | --- | --- | --- |
| `C#` | Langage | — | — | — | `.cs` |
| `Go` | Langage | — | — | — | `.go` |
| `Java` | Langage | — | — | — | `.java` |
| `Kotlin` | Langage | — | — | — | `.kt` |
| `PHP` | Langage | — | — | — | `.php` |
| `Rust` | Langage | — | — | — | `.rs` |
| `Scala` | Langage | — | — | — | `.scala` |
| `Swift` | Langage | — | — | — | `.swift` |
| `TypeScript` | Langage | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | ON DELETE seulement | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | Uniques seulement | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | Schéma | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | Schéma | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | Schéma | ✓ | — | — | `.graphql` |
| `JSON Schema` | Schéma | — | — | — | `.json` |
| `Mermaid` | Schéma | ✓ | — | — | `.mmd` |
| `Zod` | Schéma | — | — | — | `.ts` |

La valeur par défaut est `GraphQL`. Chaque cible émet les colonnes ; les marques ✓ indiquent ce qu’elle émet d’autre.  
Les tables sont émises par ordre de nom plutôt que dans l’ordre où elles se trouvent sur le canevas, et les index sont ceux listés sous `Indexes` dans la boîte de dialogue [Propriétés de la table](./table-related-functions.md#indexes), et non les lignes `Keys` situées au-dessus. `SeaORM` n’écrit que les index uniques, et `Mermaid` marque une colonne unique de `UK` mais n’écrit aucun index.  
Toutes les cibles sauf `Java`, `AML`, `DBML` et `Mermaid` écrivent une colonne de clé primaire comme non NULL, que `Not Null` y soit défini ou non. `Java` ne marque aucune colonne comme pouvant être NULL ou non, et `AML`, `DBML` et `Mermaid` conservent l’indicateur tel que le diagramme le définit.

Ce qu’écrivent certaines des cibles :

- `PHP` : de simples classes de propriétés publiques typées, qui commencent par `<?php` et `declare(strict_types=1);`.
- `Doctrine` : des entités Doctrine ORM 3 avec attributs, pour DBAL 4.2 ou version ultérieure, chaque colonne avec son type DBAL et ses options pour la base de données sélectionnée.
- `Rust` : une `pub struct` par table, dont les types sont écrits avec leur chemin complet, comme `chrono::NaiveDateTime` ou `rust_decimal::Decimal`, sans ligne `use`.
- `SeaORM` : des entités SeaORM 2.0 au format dense, chaque table formant un `pub mod`, si bien que le texte entier se compile comme un seul fichier.
- `Swift` : une structure `Codable`, `Hashable`, `Sendable` par table, qui nécessite Swift 6.1 ou version ultérieure.
- `TypeScript` : une `export interface` par table, qui décrit la ligne sous sa forme JSON, comme le fait le schéma `Zod` (une date ou une heure est une `string`, et une colonne pouvant être NULL est `T | null`).
- `Zod` : un schéma de ligne Zod 4 par table et le type qu’il infère, sans schéma d’insertion ni relations.
- `JSON Schema` : un seul document JSON Schema draft 2020-12, avec un schéma de ligne par table sous `$defs`.
- `Mermaid` : un `erDiagram`, comme ceux qu’affiche GitHub, où chaque table est une entité qui liste chaque colonne avec son type et toute marque `PK`, `FK` ou `UK`, et chaque relation une ligne entre ses deux tables.

`AML`, `DBML` et `GraphQL` sont des formats aller-retour : chacun est aussi une source d’importation. Voir [Importer ou exporter des fichiers](./file-import-export.md). Les autres schémas, `JSON Schema`, `Mermaid` et `Zod`, ne servent qu’en sortie.  
`DBML` écrit la couleur de chaque table sous forme de `headercolor` et, dans le code de tout le document, un bloc `TableGroup` après les `Ref` pour chaque [groupe de tables](./table-groups.md) qui contient une table. `AML` écrit la couleur d’une table sous la forme du nom de couleur AML le plus proche.

## ON DELETE et ON UPDATE {#on-delete-and-on-update}

Les actions ON DELETE et ON UPDATE d’une relation se définissent depuis son menu contextuel (voir [ON DELETE et ON UPDATE](./relationship-editing.md#on-delete-and-on-update)).  
Les cibles marquées d’un ✓ dans la colonne `ON DELETE / ON UPDATE` du tableau [Langage](#language) écrivent les actions que définit une relation ; une action laissée à `Not set` n’écrit rien.  
Les actions que conservent les cibles ORM dépendent de la base de données sélectionnée, tandis que `AML` et `DBML` les conservent toutes (voir [Base de données](#database)).

- `Doctrine` n’écrit que ON DELETE, car Doctrine n’a pas de ON UPDATE. Il ajoute `onDelete: 'CASCADE'` à chaque `#[ORM\JoinColumn]` du `ManyToOne` ou du `OneToOne` du côté propriétaire, comme `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`, et rien sur le `OneToMany` ou le `OneToOne` du côté inverse. Une relation vers une colonne unique qui n’est pas la clé primaire reste sous forme de simples colonnes, que Doctrine mappe sans association, si bien qu’aucune action n’y est écrite.
- `Drizzle` les écrit en minuscules. Sur `.references()`, ce sont des options, comme `{ onDelete: "cascade", onUpdate: "set null" }` ; sur un `foreignKey()`, que reçoit une clé à plusieurs colonnes, elles sont chaînées, comme `.onDelete("restrict").onUpdate("no action")`.
- `SeaORM` les écrit sur la relation `belongs_to` de la table enfant, ON UPDATE en premier, sous les noms SeaORM `NoAction`, `Cascade`, `SetNull`, `SetDefault` et `Restrict`, comme `on_update = "Cascade", on_delete = "SetNull"`. Le `has_one` ou le `has_many` de la table parente n’en reçoit aucune.
- `Sequelize` écrit des entrées `onDelete: "CASCADE"` et `onUpdate` dans les deux appels d’association : `hasMany` ou `hasOne`, et `belongsTo`. Une clé à plusieurs colonnes ne reçoit aucun appel d’association, si bien que `Sequelize` n’écrit aucune action pour elle.
- `SQLAlchemy` passe des arguments `ondelete="CASCADE"` et `onupdate` à `ForeignKey()` pour une clé à une seule colonne, et à `ForeignKeyConstraint()` pour une clé à plusieurs colonnes.
- `TypeORM` écrit des options `onDelete: "CASCADE"` et `onUpdate` sur le `@ManyToOne` ou le `@OneToOne` du côté propriétaire, jamais du côté inverse. Il omet toujours `SET DEFAULT`, car TypeORM l’écrirait sous la forme `DEFAULT`, qu’aucune base de données n’accepte.
- `DBML` ajoute des paramètres au `Ref`, comme `[delete: set null, update: no action]`.
- `AML` écrit une relation qui a une action sous la forme d’une instruction `rel` autonome dotée de propriétés, comme `{onDelete: cascade, onUpdate: "set null"}`, plutôt qu’en ligne sur sa colonne.

`JPA` n’en écrit aucune : JPA standard n’a pas d’option pour elles, et le générateur n’utilise pas le `@OnDelete` d’Hibernate. `Mermaid` n’en écrit pas non plus, car une ligne d’`erDiagram` n’a pas de place pour elles.  
Dans l’onglet `Code Generator` de la boîte de dialogue Propriétés de la table, qui affiche une seule table, `DBML` n’écrit aucun `Ref` et `AML` aucune instruction `rel`, si bien qu’aucun des deux n’y montre les actions ; `AML` garde en ligne sur sa colonne une relation à une seule colonne qui a des actions, comme il le fait pour une relation qui n’en a pas. `Mermaid` n’y écrit aucune ligne de relation. `Doctrine` et `SeaORM` y écrivent la même entité que dans tout le document, actions comprises.

## Casse des noms {#name-case}

`Table Name Case` et `Column Name Case` proposent chacun `Pascal`, `Camel`, `Snake` et `None`.  
Les valeurs par défaut sont `Pascal` pour les noms de table et `Camel` pour les noms de colonne. `None` émet un nom tel qu’il est écrit dans le diagramme.  
Quelle que soit la casse, un nom que réserve le langage de la cible est échappé là où ce langage peut l’échapper, comme `@class` en `C#` ou `r#type` en `Rust`, et renommé là où il ne le peut pas, comme `class_` en `Java`.

`AML`, `DBML` et `Mermaid` ignorent les deux paramètres et émettent toujours les noms du diagramme.  
`SeaORM` les ignore aussi : il nomme les champs et les modules en snake case, la forme que SeaORM relit, et indique les noms stockés dans `table_name` et, lorsqu’ils diffèrent, dans `column_name`.  
Pour ces quatre cibles, le panneau grise les deux listes, avec la note `Not used by` en dessous.

Chaque cible écrit les noms physiques, quelle que soit la vue de l’[affichage des noms](./logical-names.md#name-view).  
Aucune n’écrit de nom logique, pas même dans un commentaire vide : cet onglet n’a pas d’équivalent à l’option [`Write logical names into empty comments`](./schema-sql.md#logical-names-as-comments) de l’onglet Schéma SQL.  
Aucune n’écrit non plus de domaine : une colonne liée à un domaine est écrite avec son type de données, comme toute autre colonne.

## Base de données {#database}

Les types de données sont résolus d’après la base de données sélectionnée (voir [Bases de données](./table-related-functions.md#databases)).  
Choisissez-la dans cet onglet depuis la liste `Database` du panneau, l’entrée `Database` du menu contextuel ou la recherche rapide, et le code est aussitôt réécrit. C’est l’unique paramètre de base de données du diagramme, celui que définissent aussi le menu contextuel du canevas et l’onglet [Schéma SQL](./schema-sql.md), si bien qu’une modification faite ici apparaît aussi là-bas.  
`Drizzle` tire son dialecte du même paramètre : `pgTable` pour PostgreSQL, `mysqlTable` pour MySQL et MariaDB, `sqliteTable` pour SQLite, et `pgTable` pour toute autre base de données.  
`SeaORM` écrit un `column_type` là où SeaORM créerait sinon un autre type de colonne sur PostgreSQL, MySQL, MariaDB ou SQLite, et n’en écrit aucun sur MSSQL, Oracle, Snowflake ou Databricks, pour lesquels SeaORM ne dispose d’aucun backend.

La base de données sélectionnée détermine aussi les actions ON DELETE et ON UPDATE qu’écrivent les cibles ORM.  
`Doctrine`, `SeaORM`, `Sequelize`, `SQLAlchemy` et `TypeORM` omettent toute action qu’omet le Schéma SQL de cette base de données, comme `SET DEFAULT` sur MySQL et MariaDB, `RESTRICT` sur MSSQL, ou toute action autre que `NO ACTION` sur Snowflake et Databricks, si bien que l’action par défaut de la base de données s’applique. La liste complète figure dans [ON DELETE et ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
`Drizzle` suit plutôt le dialecte qu’il écrit : le code `mysqlTable` omet `SET DEFAULT`, tandis que les codes `pgTable` et `sqliteTable` conservent toutes les actions, y compris le code `pgTable` qu’il écrit pour MSSQL, Oracle, Snowflake et Databricks.

`AML`, `DBML` et `Mermaid` font exception : ils émettent chaque type de données tel qu’il est écrit dans le diagramme, si bien que le paramètre de base de données ne change pas leur sortie, et le panneau grise `Database` pour eux. `AML` et `DBML` écrivent toutes les actions que définit une relation, et `Mermaid` n’en écrit aucune.

## Délimiteur {#bracket}

`Bracket` n’est proposé dans le panneau, le menu contextuel et la recherche rapide que tant que le langage est `Doctrine`, `JPA` ou `SeaORM`.  
C’est le même paramètre que le délimiteur de l’onglet Schéma SQL (voir [Schéma SQL](./schema-sql.md#database-and-bracket)), si bien qu’une modification faite ici change aussi la façon dont le Schéma SQL délimite les noms. Il propose `SingleQuote`, `DoubleQuote`, `Backtick` et `None`, et démarre sur `None`.

- `Doctrine` : avec tout délimiteur autre que `None`, chaque nom de table, de colonne et de colonne de jointure est entouré d’accents graves, ce qui est la manière dont Doctrine signale un nom à délimiter, comme ``#[ORM\Table(name: '`order`')]``. Avec `None`, seul un nom qui en a besoin l’est : un mot que réserve une base de données, un nom qui n’est pas un simple identifiant ASCII, ou un nom saisi entre guillemets.
- `JPA` : avec tout délimiteur autre que `None`, un nom de table qui est un mot réservé est délimité dans `@Table`, comme `@Table(name = "\"user\"")`. Avec `None`, il reste sans délimiteur, comme le laisse le Schéma SQL.
- `SeaORM` : avec `None`, les noms sont écrits tels que la base de données les stocke : un nom de table contenant un point est scindé en `schema_name` et `table_name`, et sur PostgreSQL un nom sans délimiteur est converti en minuscules. Avec tout autre délimiteur, un nom est conservé entier, tel qu’il est écrit.

## Enregistrer ou copier le résultat {#saving-or-copying-the-result}

`Save file`, en bas du panneau des options ou dans le menu contextuel, enregistre le code affiché dans un fichier.  
Le fichier est nommé comme toute exportation, `<database name>-<timestamp>`, suivi de l’extension indiquée dans le tableau [Langage](#language), comme `shop-2026-10-12T04_05_06.ts`, et va là où va toute exportation dans votre hôte (voir [Exporter](./file-import-export.md#exporting)). `Java` et `JPA` placent toutes les classes dans un seul fichier `.java`, telles que l’onglet les affiche.  
Le menu Export ne propose aucune entrée pour le générateur de code, et l’onglet `Code Generator` de la boîte de dialogue Propriétés de la table ne peut pas enregistrer de fichier.

Pour copier le code, cliquez sur `Copy` en bas du panneau, ou survolez le code et cliquez sur le bouton de copie en haut à droite, seul moyen possible dans la boîte de dialogue Propriétés de la table.  
Une notification `Copied!` accompagnée d’une coche confirme la copie pendant deux secondes. Si le navigateur ou l’hôte refuse l’accès au Presse-papiers, une notification `Couldn't copy to the clipboard` accompagnée d’un signe d’avertissement le signale à la place, pendant cinq secondes. Copier de nouveau remplace la notification au lieu d’en ajouter une autre.  
Le texte peut aussi être sélectionné, si bien que vous pouvez n’en prendre que la partie dont vous avez besoin.

## Éditeurs en lecture seule {#read-only-editors}

Dans un éditeur [`readonly`](../../api/erd-editor-element.md#readonly), les listes du panneau, le menu contextuel et la recherche rapide changent encore `Language`, `Database`, `Table Name Case`, `Column Name Case` et `Bracket`, mais dans cette fenêtre seulement, si bien que le panneau les légende `This window only` plutôt que `Saved in the document`.  
Un changement réécrit le code sur cet écran et n’est ni enregistré dans le fichier, ni partagé avec les collaborateurs, ni consigné pour l’annulation, quels que soient les verrous, et le changement d’un collaborateur sur un paramètre que vous avez choisi laisse votre choix à l’écran. `Database` et `Bracket` sont aussi des paramètres de l’onglet Schéma SQL, si bien qu’un choix fait ici s’y affiche dans la même fenêtre (voir [Éditeurs en lecture seule](./schema-sql.md#read-only-editors)).  
Quand l’éditeur redevient modifiable, les paramètres du document reviennent et le code est écrit pour eux.  
`Save file` et `Copy` enregistrent et copient le code affiché.
