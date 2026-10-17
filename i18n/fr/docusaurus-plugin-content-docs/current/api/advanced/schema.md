---
sidebar_position: 3
description: "Le format de document .erd.json : la forme de stockage que contient un fichier et la valeur d’exécution que détient un éditeur, les types TypeScript, les constantes associées à chaque champ numérique et le JSON Schema publié."
---

# Schéma

`.erd.json` est le format de document de l’éditeur. Lisez cette page si vous devez générer, valider ou migrer un document en dehors de l’éditeur.

Depuis la version `4.0.0`, un document a deux sérialisations, toutes deux avec `version` `'3.0.0'`. La forme de stockage est ce que contient un fichier : c’est ce que renvoie [`editor.value`](../erd-editor-element.md#value), ce qu’écrit l’exportation JSON et la seule forme qu’accepte le [JSON Schema](#json-schema) publié. La valeur d’exécution, que renvoie [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue), est le document entier tel que le détient un éditeur. `setInitialValue()`, le setter `value` et `setSchemaJSON()` lisent l’une ou l’autre forme, tout fichier enregistré par une version antérieure et un document v2 `.vuerd`. Avant la version `4.0.0`, il n’y en avait qu’une : `value` renvoyait le document entier tel que l’éditeur le détenait, comme le fait aujourd’hui `runtimeValue`.

## Forme de stockage et valeur d’exécution {#storage-form-and-runtime-value}

La forme de stockage ne contient que les entités actives : chaque table listée dans `doc.tableIds`, les colonnes que listent ces tables, les relations entre deux tables conservées, les index des tables conservées avec les colonnes d’index dont la colonne figure encore dans la liste de la table, ainsi que les mémos et groupes de tables listés. Elle omet ce qu’un éditeur dérive au chargement ou conserve tant qu’il est ouvert : les entités supprimées, `seqColumnIds` et `seqIndexColumnIds`, chaque `zIndex`, les largeurs mesurées, le `ui` des colonnes, ainsi que l’`identification`, le `startRelationshipType` et les points d’ancrage d’une relation. Les types ci-dessous marquent chacun de ces champs `// runtime only`.  
Les clés de chaque collection sont les id, dans l’ordre des unités de code, les colonnes étant d’abord regroupées par `tableId` et les colonnes d’index par `indexId`. Chaque entité écrit ses champs dans un ordre fixe, et le texte est indenté de deux espaces et se termine par un saut de ligne. Ainsi, un même document écrit toujours les mêmes octets, une modification ne change que ce qu’elle touche, et un fichier enregistré sur une machine dotée d’autres polices se rouvre avec le même `value`.  
VS Code, Obsidian et le plugin JetBrains n’écrivent un fichier que lorsqu’une modification change `value`, si bien qu’un fichier enregistré par une version antérieure garde son ancienne forme jusqu’à sa première modification.

La valeur d’exécution conserve ce que la forme de stockage omet : entités supprimées, séquences, z-index, largeurs, marques de clé, indicateurs de relation et points d’ancrage. Elle est indentée de deux espaces, sans saut de ligne final. Utilisez-la uniquement pour initialiser un collaborateur ou une seconde vue avec `setInitialValue()`, afin que l’annulation d’une suppression envoyée par un autre éditeur y rétablisse l’entité en entier. Ne l’écrivez jamais dans un fichier ; le JSON Schema la refuse. Plus rien ne collecte les entités supprimées, si bien que la valeur d’exécution les conserve jusqu’à la prochaine ouverture du document depuis son fichier.

Les deux formes écrivent chaque paramètre verrouillé à sa valeur verrouillée (voir [`lockSettings`](#settings)), `settings.ddlScripts` seulement tant qu’un script contient du texte, et le `groupId` d’une table seulement tant qu’il n’est pas vide. La forme de stockage n’écrit `doc.tableGroupIds` et `tableGroupEntities` que tant qu’un groupe de tables existe ; la valeur d’exécution les écrit tant que le document contient un groupe ou un groupe supprimé.

## TypeScript {#typescript}

Les types décrivent la valeur d’exécution. Un champ marqué `// runtime only` est omis de la forme de stockage, et un champ marqué `?` n’est écrit que tant qu’il contient quelque chose.

### ERDEditorSchemaV3 {#erdeditorschemav3}

```ts
type ERDEditorSchemaV3 = {
  $schema: 'https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json';
  version: '3.0.0';
  settings: Settings;
  doc: Doc;
  collections: {
    tableEntities: Record<string, Table>;
    tableColumnEntities: Record<string, Column>;
    relationshipEntities: Record<string, Relationship>;
    indexEntities: Record<string, Index>;
    indexColumnEntities: Record<string, IndexColumn>;
    memoEntities: Record<string, Memo>;
    tableGroupEntities?: Record<string, TableGroup>;
  };
};
```

Chaque entité a pour clé son `id`, une chaîne opaque ; l’analyse écarte toute entité dont l’`id` est absent ou vide. Depuis la version `4.0.0`, chaque nouvel id est un UUIDv7 écrit sous forme Uuid25, soit 25 chiffres en base 36 en minuscules comme `03gzrxjv20bdlcak89q25d2m7`, si bien que les id qu’un éditeur génère se trient dans l’ordre où il les a créés. Un document conserve les id qu’il contient, comme les id nanoid d’une version antérieure ou les id d’un fichier v2, et rien ne doit donc dépendre de la forme d’un id.

Depuis la version `4.0.0`, aucune entité ne porte d’objet `meta` (`createAt`, `updateAt`), et les types `EntityMeta` et `EntityType` ont été supprimés. Rien ne l’écrit, l’analyse écarte le `meta` que porte un fichier plus ancien, et le JSON Schema le refuse. Il servait uniquement à planifier la collecte des entités supprimées, qui a elle aussi disparu.

### Settings {#settings}

```ts
type Settings = {
  originX: number;
  originY: number;
  zoomLevel: number;
  show: number; // Constants: Show
  database: number; // Constants: Database
  databaseName: string;
  canvasType: string; // Constants: CanvasType
  language: number; // Constants: Language
  tableNameCase: number; // Constants: NameCase
  columnNameCase: number; // Constants: NameCase
  bracketType: number; // Constants: BracketType
  relationshipDataTypeSync: boolean;
  columnOrder: number[]; // Constants: ColumnType
  maxWidthComment: number;
  lockSettings: number; // Constants: LockSettingType
  ddlScripts?: DDLScripts;
};

type DDLScripts = {
  before: string;
  after: string;
};

// Constants
const CanvasType = {
  ERD: 'ERD',
  visualization: '@dineug/erd-editor/builtin-visualization',
  schemaSQL: '@dineug/erd-editor/builtin-schema-sql',
  generatorCode: '@dineug/erd-editor/builtin-generator-code',
  settings: 'settings',
} as const;

const Show = {
  tableComment: 1,
  columnComment: 2,
  columnDataType: 4,
  columnDefault: 8,
  columnAutoIncrement: 16,
  columnPrimaryKey: 32,
  columnUnique: 64,
  columnNotNull: 128,
  relationship: 256,
  columnAlternateKey: 512,
  hideReferentialAction: 1024,
  hideTableGroup: 2048,
  hideMemo: 4096,
} as const;

const ColumnType = {
  columnName: 1,
  columnDataType: 2,
  columnNotNull: 4,
  columnUnique: 8,
  columnAutoIncrement: 16,
  columnDefault: 32,
  columnComment: 64,
} as const;

const Database = {
  MariaDB: 1,
  MSSQL: 2,
  MySQL: 4,
  Oracle: 8,
  PostgreSQL: 16,
  SQLite: 32,
  Databricks: 64,
  Snowflake: 128,
} as const;

const Language = {
  GraphQL: 1,
  csharp: 2,
  Java: 4,
  Kotlin: 8,
  TypeScript: 16,
  JPA: 32,
  Scala: 64,
  Go: 128,
  SQLAlchemy: 256,
  TypeORM: 512,
  Sequelize: 1024,
  Drizzle: 2048,
  DBML: 4096,
  AML: 8192,
  Mermaid: 16384,
  PHP: 32768,
  Doctrine: 65536,
  Rust: 131072,
  SeaORM: 262144,
  Swift: 524288,
  Zod: 1048576,
  JSONSchema: 2097152,
} as const;

const NameCase = {
  none: 1,
  camelCase: 2,
  pascalCase: 4,
  snakeCase: 8,
} as const;

const BracketType = {
  none: 1,
  doubleQuote: 2,
  singleQuote: 4,
  backtick: 8,
} as const;

const LockSettingType = {
  viewport: 1, // originX, originY and zoomLevel
  canvasType: 2,
  language: 4,
  tableNameCase: 8,
  columnNameCase: 16,
  bracketType: 32,
} as const;
```

`originX` et `originY` constituent la vue : le point de l’écran où se place le point `(0, 0)` de la scène.  
`zoomLevel` va de `0.1` à `1.5`. Un document enregistré au-delà de `1` s’ouvre à `1` dans un éditeur antérieur à la version `3.5.0`.  
Depuis la version `4.0.0`, les paramètres ne comportent ni `width`, ni `height`, ni `scrollTop`, ni `scrollLeft`, ni `relationshipOptimization`, ni `ignoreSaveSettings`. Rien ne les écrit, l’analyseur n’en conserve aucun, et le JSON Schema refuse un fichier qui les contient encore.

`canvasType` est l’onglet sur lequel s’ouvre un document. Un document enregistré sur l’onglet Visualisation contient `'@dineug/erd-editor/builtin-visualization'`, mais n’indique pas si le mode `Graph` ou le mode `Flow` était affiché, et un éditeur nouvellement créé affiche cet onglet en mode `Graph`.  
Depuis la version `4.0.0`, tant que le verrou `Canvas Type` est activé, comme dans un nouveau document, le document conserve l’onglet affiché au moment du verrouillage, et changer d’onglet laisse `value` inchangé. Un verrouillage effectué dans l’onglet Paramètres retient l’onglet d’où venait le lecteur, et un `'settings'` verrouillé, que seule une modification manuelle peut écrire, s’ouvre sur `'ERD'`.  
Aucun état propre au mode `Flow` n’est sérialisé (son placement, son zoom, son déplacement de la vue, son affichage des lignes et les tables sur lesquelles il se concentre restent dans l’éditeur), si bien que `originX`, `originY` et `zoomLevel` décrivent toujours le canevas ERD.

`show` et `lockSettings` sont des masques de bits : combinez les indicateurs par un OU binaire.  
`columnOrder` est un tableau contenant les sept valeurs de `ColumnType`, dans l’ordre d’affichage.  
`database`, `language`, `tableNameCase`, `columnNameCase` et `bracketType` contiennent chacun exactement une valeur, et le JSON Schema rejette une valeur combinée.

Le `show` d’un nouveau document vaut `431` : `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` et `relationship`.  
Depuis la version `3.10.0`, `show` compte deux indicateurs de plus, tous deux désactivés dans un nouveau document et dans tout document enregistré avant la version `3.10.0`.  
`columnAlternateKey` (`512`) est l’option d’affichage [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Lorsqu’il est activé, il marque de `AK1.1`, `AK1.2` et ainsi de suite les colonnes de chaque index unique portant sur deux colonnes ou plus. Il est désactivé au départ, si bien qu’aucun diagramme existant ne change de largeur.  
`hideReferentialAction` (`1024`) fonctionne à l’inverse : lorsqu’il est activé, il masque les [étiquettes ON DELETE et ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) des connecteurs, qui s’affichent donc par défaut. L’option d’affichage `Referential Actions` est cochée tant que l’indicateur est désactivé. Il ne modifie la taille d’aucune table.  
Un éditeur antérieur à la version `3.10.0` conserve `show` comme un nombre entier, si bien que les deux indicateurs survivent à un enregistrement dans cet éditeur.

Depuis la version `4.0.0`, `show` compte deux indicateurs de plus, tous deux désactivés dans un nouveau document et dans tout document enregistré avant la version `4.0.0`. Comme `hideReferentialAction`, chacun masque ce qu’il nomme, si bien que les groupes de tables et les mémos s’affichent par défaut.  
`hideTableGroup` (`2048`) masque les [groupes de tables](../../guide/guides/table-groups.md), et `hideMemo` (`4096`) masque tous les mémos. Ce sont les [options d’affichage](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` et `Memos`, chacune cochée tant que son indicateur est désactivé. Aucun des deux ne modifie la taille d’une table.  
Un éditeur antérieur à la version `4.0.0` conserve `show` comme un nombre entier, si bien que les deux indicateurs survivent à un enregistrement dans cet éditeur.

Depuis la version `4.0.0`, `Language` compte huit cibles de plus pour le [générateur de code](../../guide/guides/code-generator.md), de `Mermaid` à `JSONSchema`. Un `language` que l’analyseur ne connaît pas est lu comme `GraphQL`, si bien qu’un éditeur antérieur à la version `4.0.0` ouvre sur GraphQL un document enregistré avec l’une de ces cibles, et qu’un enregistrement dans cet éditeur écrit GraphQL.

Depuis la version `4.0.0`, `lockSettings` prend la place de `ignoreSaveSettings`, et `LockSettingType` celle de `SaveSettingType`, qui a été supprimé. `lockSettings` désigne les paramètres qu’un document enregistre tels qu’ils étaient au moment de leur verrouillage. `viewport` couvre à la fois `originX`, `originY` et `zoomLevel`, car une origine enregistrée sans son zoom s’ouvre ailleurs, et chaque autre bit couvre le champ dont il porte le nom. Ce sont les lignes [`Lock`](../../guide/guides/settings.md#lock) de l’onglet Paramètres.  
Un paramètre verrouillé est écrit à sa valeur verrouillée, quoi qu’affiche l’éditeur, par `value` comme par `runtimeValue`, et tout autre paramètre tel qu’il est. Ainsi, tant que le verrou correspondant est activé, faire défiler et zoomer, changer d’onglet, ou changer le langage du générateur de code, une casse des noms ou le type de délimiteur laisse le fichier inchangé. Le verrouillage prend la valeur que détient le paramètre à cet instant, et l’analyse prend la valeur verrouillée dans le champ enregistré.  
Un document créé à partir de rien (un nouvel éditeur ou un nouveau store de réplication, ou une valeur vide donnée à `value` ou à `setInitialValue()`) a `lockSettings` défini à `63`, tous les verrous activés. Un document dont les `settings` ne comportent pas de `lockSettings` (tout fichier enregistré avant la version `4.0.0`, quel que soit son `ignoreSaveSettings`, et tout document v2) s’ouvre lui aussi avec tous les verrous activés : sa vue et son onglet là où sont ceux d’un nouveau document (`originX` et `originY` à `0`, `zoomLevel` à `1`, l’onglet ERD), et son langage, ses casses des noms et son type de délimiteur verrouillés sur les valeurs qu’il a enregistrées. Un document qui nomme ses verrous les conserve, `0` compris, ainsi que toutes les valeurs qu’il a enregistrées.  
L’analyse conserve tous les bits de `lockSettings`, y compris les bits inconnus, si bien qu’un verrou ajouté par une version ultérieure survit à un enregistrement ici ; le JSON Schema vérifie seulement qu’il s’agit d’un entier. Un éditeur antérieur à la version `4.0.0` supprime `lockSettings` à l’enregistrement et écrit la vue et l’onglet tels qu’ils sont, si bien que le fichier se rouvre ici comme un fichier enregistré avant la version `4.0.0`.

Depuis la version `4.0.0`, `ddlScripts` contient les deux scripts de l’onglet [Schéma SQL](../../guide/guides/schema-sql.md), que le DDL de chaque base de données écrit : `before` après l’en-tête et avant les tables, `after` après le DDL généré. Le DDL écrit chacun avec des sauts de ligne LF, sans ses lignes vides de tête ni ses espaces de fin, et, sur MSSQL, terminé par `GO`, comme le décrit [Scripts avant et après les tables](../../guide/guides/schema-sql.md#before-and-after-scripts) ; `ddlScripts` lui-même conserve chaque script tel qu’il a été saisi. La clé n’est écrite que tant que l’un des scripts contient du texte, et alors avec les deux ; une clé absente, ou un script qui n’est pas une chaîne, est lu comme `''`. Les choix `Statements`, `Header` et `Tables` de l’onglet ne sont pas enregistrés dans le document.  
Un éditeur antérieur à la version `4.0.0` supprime les scripts au chargement d’un document, si bien qu’un enregistrement dans cet éditeur les perd.

`Database`, `Language`, `Show`, `LockSettingType` et `ReferentialAction` n’admettent que des ajouts en fin de liste. Un document enregistré stocke le nombre, si bien que tout ajout (SGBD, cible de génération de code, indicateur, verrou ou action) prend le bit suivant plutôt qu’un emplacement au milieu.

### Doc {#doc}

```ts
type Doc = {
  tableIds: string[];
  relationshipIds: string[];
  indexIds: string[];
  memoIds: string[];
  tableGroupIds?: string[];
};
```

Chaque liste donne l’ordre d’un type d’entité, que lisent le DDL, le tri des tables et l’ordre de rendu. Dans la forme de stockage, chaque liste ne contient que les id des entités conservées, chacun une seule fois, dans l’ordre de la liste. Depuis la version `4.0.0`, `tableGroupIds` donne l’ordre des groupes de tables.

Depuis la version `4.0.0`, l’ordre d’empilement n’est pas enregistré. L’analyse empile chaque table, mémo et groupe de tables listé qui ne porte pas de `zIndex` selon sa place dans sa liste, les derniers devant : les groupes de tables à partir de `1`, les tables à partir de `2`, et les mémos au-dessus de toutes les tables. Une entité qui porte un `zIndex`, comme dans une valeur d’exécution ou un fichier enregistré avant la version `4.0.0`, le conserve. La mise au premier plan d’une table ou d’un mémo est donc perdue à la réouverture du fichier.

### Collection : tableEntities {#collection-tableentities}

```ts
type Table = {
  id: string;
  name: string;
  comment: string;
  columnIds: string[];
  seqColumnIds: string[]; // runtime only
  groupId?: string;
  ui: TableUI;
};

type TableUI = {
  x: number;
  y: number;
  zIndex: number; // runtime only
  widthName: number; // runtime only
  widthComment: number; // runtime only
  color: string;
};
```

Depuis la version `4.0.0`, une table porte `groupId`, l’id du [groupe de tables](../../guide/guides/table-groups.md) auquel elle appartient. Un `groupId` absent ou vide, ou qui ne désigne aucun groupe de `doc.tableGroupIds`, signifie l’absence de groupe, et la forme de stockage ne l’écrit que tant qu’il désigne un groupe conservé.  
L’analyse initialise `seqColumnIds` à `columnIds` lorsqu’il est absent ou qu’il lui manque un id listé, et un éditeur mesure à nouveau `widthName` et `widthComment` avec ses propres polices à chaque chargement.

### Collection : tableColumnEntities {#collection-tablecolumnentities}

```ts
type Column = {
  id: string;
  tableId: string;
  name: string;
  comment: string;
  dataType: string;
  default: string;
  options: number; // Constants: ColumnOption
  ui: ColumnUI; // runtime only
};

type ColumnUI = {
  keys: number; // Constants: ColumnUIKey
  widthName: number;
  widthComment: number;
  widthDataType: number;
  widthDefault: number;
};

// Constants
const ColumnOption = {
  autoIncrement: 1,
  primaryKey: 2,
  unique: 4,
  notNull: 8,
} as const;

const ColumnUIKey = {
  primaryKey: 1,
  foreignKey: 2,
} as const;
```

Depuis la version `4.0.0`, la forme de stockage n’écrit aucun `ui` de colonne. Chaque chargement dérive `keys` (la marque de clé primaire à partir du bit `primaryKey` de `options` et la marque de clé étrangère à partir des relations qui aboutissent à la colonne) et mesure les quatre largeurs.  
Un éditeur antérieur à la version `4.0.0` affiche les colonnes d’un fichier enregistré ici sans leurs icônes de clé primaire.

### Collection : relationshipEntities {#collection-relationshipentities}

```ts
type Relationship = {
  id: string;
  identification: boolean; // runtime only
  relationshipType: number; // Constants: RelationshipType
  startRelationshipType: number; // Constants: StartRelationshipType; runtime only
  onDelete: number; // Constants: ReferentialAction
  onUpdate: number; // Constants: ReferentialAction
  start: RelationshipPoint;
  end: RelationshipPoint;
};

type RelationshipPoint = {
  tableId: string;
  columnIds: string[];
  x: number; // runtime only
  y: number; // runtime only
  direction: number; // Constants: Direction; runtime only
};

// Constants
const RelationshipType = {
  ZeroOne: 2,
  ZeroN: 4,
  OneOnly: 8,
  OneN: 16,
} as const;

const StartRelationshipType = {
  ring: 1,
  dash: 2,
} as const;

const ReferentialAction = {
  none: 1,
  noAction: 2,
  cascade: 4,
  setNull: 8,
  setDefault: 16,
  restrict: 32,
} as const;

const Direction = {
  left: 1,
  right: 2,
  top: 4,
  bottom: 8,
} as const;
```

Depuis la version `3.10.0`, une relation porte `onDelete` et `onUpdate`, ses [actions ON DELETE et ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Chacun contient exactement une valeur de `ReferentialAction`. `none`, la valeur par défaut, n’écrit aucune clause, si bien que la valeur par défaut propre à la base de données s’applique. Les cinq autres correspondent à `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` et `RESTRICT`. Schéma SQL n’écrit une clause que pour une base de données qui en accepte l’action.  
La forme de stockage écrit toujours les deux, et depuis la version `4.0.0`, le JSON Schema les exige, en vérifiant seulement que chacun est un entier. L’analyse continue de lire comme `none` un champ absent, comme dans tout document enregistré avant la version `3.10.0`, ainsi qu’une valeur hors de la liste.  
Un éditeur antérieur à la version `3.10.0` ne connaît pas ces champs et les supprime au chargement d’un document, si bien qu’un enregistrement dans cet éditeur perd toutes les actions.

Depuis la version `4.0.0`, chaque chargement dérive ce que la forme de stockage omet. Une relation est identifiante lorsque chaque colonne à laquelle elle aboutit est une clé primaire, et son `startRelationshipType` vaut `dash` lorsque chacune de ces colonnes est NOT NULL, `ring` sinon ; une relation à laquelle il ne reste aucune colonne d’arrivée est non identifiante et `dash`, comme une nouvelle relation à sa création. Les points d’ancrage, `x`, `y` et `direction`, sont placés à nouveau.

### Collection : indexEntities {#collection-indexentities}

```ts
type Index = {
  id: string;
  name: string;
  tableId: string;
  indexColumnIds: string[];
  seqIndexColumnIds: string[]; // runtime only
  unique: boolean;
};
```

L’analyse initialise `seqIndexColumnIds` à `indexColumnIds` lorsqu’il est absent ou qu’il lui manque un id listé.

### Collection : indexColumnEntities {#collection-indexcolumnentities}

```ts
type IndexColumn = {
  id: string;
  indexId: string;
  columnId: string;
  orderType: number; // Constants: OrderType
};

// Constants
const OrderType = {
  ASC: 1,
  DESC: 2,
} as const;
```

### Collection : memoEntities {#collection-memoentities}

```ts
type Memo = {
  id: string;
  value: string;
  ui: MemoUI;
};

type MemoUI = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number; // runtime only
  color: string;
};
```

Depuis la version `4.0.0`, tables et mémos [partagent une même pile](../../guide/guides/table-related-functions.md#moving-multiple-tables) ordonnée par `zIndex`, si bien que mettre une table au premier plan peut la placer au-dessus d’un mémo. L’analyse empile un mémo enregistré sans `zIndex` au-dessus de toutes les tables, comme le décrit [Doc](#doc). Un mémo d’un fichier enregistré avant la version `4.0.0` conserve le `zIndex` qu’il a enregistré, issu du même compteur que celui des tables, si bien qu’un mémo qu’une version antérieure affichait au-dessus de toutes les tables peut s’ouvrir sous une table mise au premier plan après lui.

### Collection : tableGroupEntities {#collection-tablegroupentities}

```ts
type TableGroup = {
  id: string;
  name: string;
  color: string;
  ui: TableGroupUI;
};

type TableGroupUI = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number; // runtime only
};
```

Depuis la version `4.0.0`, un document peut contenir des [groupes de tables](../../guide/guides/table-groups.md) : des rectangles nommés et colorés, tracés derrière les tables. Une table en rejoint un par son propre `groupId`, si bien qu’un groupe ne contient aucune liste de membres. La forme de stockage n’écrit la collection, comme `doc.tableGroupIds`, que tant qu’un groupe existe, et un document qui en est dépourvu, comme un document enregistré avant la version `4.0.0`, n’a aucun groupe. `Show.hideTableGroup` les masque.  
Un éditeur antérieur à la version `4.0.0` supprime les groupes et le `groupId` de chaque table au chargement d’un document, si bien qu’un enregistrement dans cet éditeur perd tous les groupes.

## JSON Schema {#json-schema}

Le fichier de schéma canonique est publié à l’adresse [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) et peut être référencé directement avec `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Placez `$schema` en tête d’un fichier `.erd.json` : les éditeurs qui comprennent JSON Schema, comme VS Code, valident alors le document et proposent la saisie semi-automatique de ses champs pendant que vous le modifiez.

Depuis la version `4.0.0`, le schéma ne décrit que la forme de stockage. Tout objet à champs nommés est fermé (`additionalProperties: false`), tout champ que la forme de stockage écrit toujours est obligatoire, et aucun champ qu’elle omet n’est nommé. Il refuse donc la valeur d’exécution. Il refuse aussi un fichier enregistré avant la version `4.0.0`, avec son `meta`, ses largeurs, ses `zIndex`, son `ignoreSaveSettings` et le reste, jusqu’à ce qu’un éditeur en version `4.0.0` ou ultérieure réenregistre ce fichier. Un fichier enregistré par la version `3.2.0` ou ultérieure nomme déjà l’URL de ce schéma, qui pointe vers la branche `main`, si bien qu’un éditeur qui valide le fichier avec ce schéma le signale désormais. Un fichier enregistré par la version `3.0.0` ou `3.1.0`, ou un document v2, ne nomme aucun `$schema`.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "title": "ERD Editor document",
  "description": "The storage form an ERD Editor file holds (.erd, .erd.json, .vuerd, .vuerd.json): the live entities alone, each collection keyed in id order, without what an editor derives on load or keeps while it is open",
  "type": "object",
  "properties": {
    "$schema": {
      "type": "string"
    },
    "version": {
      "description": "Version of the schema",
      "const": "3.0.0"
    },
    "settings": {
      "$ref": "#/$defs/settings"
    },
    "doc": {
      "$ref": "#/$defs/doc"
    },
    "collections": {
      "type": "object",
      "properties": {
        "tableEntities": {
          "$ref": "#/$defs/tableEntities"
        },
        "tableColumnEntities": {
          "$ref": "#/$defs/tableColumnEntities"
        },
        "relationshipEntities": {
          "$ref": "#/$defs/relationshipEntities"
        },
        "indexEntities": {
          "$ref": "#/$defs/indexEntities"
        },
        "indexColumnEntities": {
          "$ref": "#/$defs/indexColumnEntities"
        },
        "memoEntities": {
          "$ref": "#/$defs/memoEntities"
        },
        "tableGroupEntities": {
          "$ref": "#/$defs/tableGroupEntities"
        }
      },
      "required": [
        "tableEntities",
        "tableColumnEntities",
        "relationshipEntities",
        "indexEntities",
        "indexColumnEntities",
        "memoEntities"
      ],
      "additionalProperties": false
    }
  },
  "required": ["$schema", "version", "settings", "doc", "collections"],
  "additionalProperties": false,
  "$defs": {
    "settings": {
      "type": "object",
      "properties": {
        "originX": {
          "type": "number"
        },
        "originY": {
          "type": "number"
        },
        "zoomLevel": {
          "type": "number",
          "minimum": 0.1,
          "maximum": 1.5
        },
        "show": {
          "description": "bit value (tableComment: 1) | (columnComment: 2) | (columnDataType: 4) | (columnDefault: 8) | (columnAutoIncrement: 16) | (columnPrimaryKey: 32) | (columnUnique: 64) | (columnNotNull: 128) | (relationship: 256) | (columnAlternateKey: 512) | (hideReferentialAction: 1024) | (hideTableGroup: 2048) | (hideMemo: 4096); the three hide bits hide what they name while set",
          "type": "integer"
        },
        "database": {
          "description": "bit value (MariaDB: 1) | (MSSQL: 2) | (MySQL: 4) | (Oracle: 8) | (PostgreSQL: 16) | (SQLite: 32) | (Databricks: 64) | (Snowflake: 128)",
          "type": "integer",
          "enum": [1, 2, 4, 8, 16, 32, 64, 128]
        },
        "databaseName": {
          "type": "string"
        },
        "canvasType": {
          "enum": [
            "ERD",
            "@dineug/erd-editor/builtin-visualization",
            "@dineug/erd-editor/builtin-schema-sql",
            "@dineug/erd-editor/builtin-generator-code",
            "settings"
          ]
        },
        "language": {
          "description": "bit value (GraphQL: 1) | (csharp: 2) | (Java: 4) | (Kotlin: 8) | (TypeScript: 16) | (JPA: 32) | (Scala: 64) | (Go: 128) | (SQLAlchemy: 256) | (TypeORM: 512) | (Sequelize: 1024) | (Drizzle: 2048) | (DBML: 4096) | (AML: 8192) | (Mermaid: 16384) | (PHP: 32768) | (Doctrine: 65536) | (Rust: 131072) | (SeaORM: 262144) | (Swift: 524288) | (Zod: 1048576) | (JSONSchema: 2097152)",
          "type": "integer",
          "enum": [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152]
        },
        "tableNameCase": {
          "description": "bit value (none: 1) | (camelCase: 2) | (pascalCase: 4) | (snakeCase: 8)",
          "type": "integer",
          "enum": [1, 2, 4, 8]
        },
        "columnNameCase": {
          "description": "bit value (none: 1) | (camelCase: 2) | (pascalCase: 4) | (snakeCase: 8)",
          "type": "integer",
          "enum": [1, 2, 4, 8]
        },
        "bracketType": {
          "description": "bit value (none: 1) | (doubleQuote: 2) | (singleQuote: 4) | (backtick: 8)",
          "type": "integer",
          "enum": [1, 2, 4, 8]
        },
        "relationshipDataTypeSync": {
          "type": "boolean"
        },
        "columnOrder": {
          "description": "bit value (columnName: 1) | (columnDataType: 2) | (columnNotNull: 4) | (columnUnique: 8) | (columnAutoIncrement: 16) | (columnDefault: 32) | (columnComment: 64)",
          "type": "array",
          "prefixItems": [
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" }
          ],
          "minItems": 7,
          "maxItems": 7
        },
        "maxWidthComment": {
          "type": "integer"
        },
        "lockSettings": {
          "description": "bit value (viewport: 1) | (canvasType: 2) | (language: 4) | (tableNameCase: 8) | (columnNameCase: 16) | (bracketType: 32); a locked setting is saved as it stood when locked, the viewport being originX, originY and zoomLevel",
          "type": "integer"
        },
        "ddlScripts": {
          "description": "SQL the Schema SQL writes as is for every database: before after the header and ahead of the tables, after past the generated DDL. Absent while both are empty",
          "type": "object",
          "properties": {
            "before": { "type": "string" },
            "after": { "type": "string" }
          },
          "required": ["before", "after"],
          "additionalProperties": false
        }
      },
      "required": [
        "originX",
        "originY",
        "zoomLevel",
        "show",
        "database",
        "databaseName",
        "canvasType",
        "language",
        "tableNameCase",
        "columnNameCase",
        "bracketType",
        "relationshipDataTypeSync",
        "columnOrder",
        "maxWidthComment",
        "lockSettings"
      ],
      "additionalProperties": false
    },
    "doc": {
      "description": "The order of each kind of entity, which the DDL, the sort and the draw order read",
      "type": "object",
      "properties": {
        "tableIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "relationshipIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "indexIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "memoIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "tableGroupIds": {
          "description": "Order of the table groups. Written while a group exists; absent means none",
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "required": ["tableIds", "relationshipIds", "indexIds", "memoIds"],
      "additionalProperties": false
    },
    "tableEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "comment": {
            "type": "string"
          },
          "columnIds": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "groupId": {
            "description": "Id of the table group in doc.tableGroupIds the table belongs to; absent means none",
            "type": "string"
          },
          "ui": {
            "type": "object",
            "properties": {
              "x": {
                "type": "number"
              },
              "y": {
                "type": "number"
              },
              "color": {
                "type": "string"
              }
            },
            "required": ["x", "y", "color"],
            "additionalProperties": false
          }
        },
        "required": ["id", "name", "comment", "columnIds", "ui"],
        "additionalProperties": false
      }
    },
    "tableColumnEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "tableId": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "comment": {
            "type": "string"
          },
          "dataType": {
            "type": "string"
          },
          "default": {
            "type": "string"
          },
          "options": {
            "description": "bit value (autoIncrement: 1) | (primaryKey: 2) | (unique: 4) | (notNull: 8)",
            "type": "integer"
          }
        },
        "required": [
          "id",
          "tableId",
          "name",
          "comment",
          "dataType",
          "default",
          "options"
        ],
        "additionalProperties": false
      }
    },
    "relationshipEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "relationshipType": {
            "description": "bit value (ZeroOne: 2) | (ZeroN: 4) | (OneOnly: 8) | (OneN: 16)",
            "type": "integer"
          },
          "onDelete": {
            "description": "bit value (none: 1) | (noAction: 2) | (cascade: 4) | (setNull: 8) | (setDefault: 16) | (restrict: 32); none, the default, writes no ON DELETE clause",
            "type": "integer"
          },
          "onUpdate": {
            "description": "bit value (none: 1) | (noAction: 2) | (cascade: 4) | (setNull: 8) | (setDefault: 16) | (restrict: 32); none, the default, writes no ON UPDATE clause",
            "type": "integer"
          },
          "start": {
            "$ref": "#/$defs/RelationshipPoint"
          },
          "end": {
            "$ref": "#/$defs/RelationshipPoint"
          }
        },
        "required": [
          "id",
          "relationshipType",
          "onDelete",
          "onUpdate",
          "start",
          "end"
        ],
        "additionalProperties": false
      }
    },
    "indexEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "tableId": {
            "type": "string"
          },
          "indexColumnIds": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "unique": {
            "type": "boolean"
          }
        },
        "required": ["id", "name", "tableId", "indexColumnIds", "unique"],
        "additionalProperties": false
      }
    },
    "indexColumnEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "indexId": {
            "type": "string"
          },
          "columnId": {
            "type": "string"
          },
          "orderType": {
            "description": "bit value (ASC: 1) | (DESC: 2)",
            "type": "integer"
          }
        },
        "required": ["id", "indexId", "columnId", "orderType"],
        "additionalProperties": false
      }
    },
    "memoEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "value": {
            "type": "string"
          },
          "ui": {
            "type": "object",
            "properties": {
              "x": {
                "type": "number"
              },
              "y": {
                "type": "number"
              },
              "width": {
                "type": "number"
              },
              "height": {
                "type": "number"
              },
              "color": {
                "type": "string"
              }
            },
            "required": ["x", "y", "width", "height", "color"],
            "additionalProperties": false
          }
        },
        "required": ["id", "value", "ui"],
        "additionalProperties": false
      }
    },
    "tableGroupEntities": {
      "description": "Named, coloured rectangles drawn behind tables; a table joins one through its groupId. Written while a group exists; absent means none",
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "color": {
            "type": "string"
          },
          "ui": {
            "type": "object",
            "properties": {
              "x": {
                "type": "number"
              },
              "y": {
                "type": "number"
              },
              "width": {
                "type": "number"
              },
              "height": {
                "type": "number"
              }
            },
            "required": ["x", "y", "width", "height"],
            "additionalProperties": false
          }
        },
        "required": ["id", "name", "color", "ui"],
        "additionalProperties": false
      }
    },
    "RelationshipPoint": {
      "type": "object",
      "properties": {
        "tableId": {
          "type": "string"
        },
        "columnIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "required": ["tableId", "columnIds"],
      "additionalProperties": false
    }
  }
}
```
