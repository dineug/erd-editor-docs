---
sidebar_position: 3
description: "Le format de document .erd.json : la forme de stockage que contient un fichier et la valeur d’exécution que détient un éditeur, les types TypeScript, les constantes associées à chaque champ numérique et le JSON Schema publié."
---

# Schéma

`.erd.json` est le format de document de l’éditeur. Lisez cette page si vous devez générer, valider ou migrer un document en dehors de l’éditeur.

Depuis la version `4.0.0`, un document a deux sérialisations, toutes deux avec `version` `'3.0.0'`. La forme de stockage est ce que contient un fichier : c’est ce que renvoie [`editor.value`](../erd-editor-element.md#value), ce qu’écrit l’exportation JSON et la seule forme qu’accepte le [JSON Schema](#json-schema) publié. La valeur d’exécution, que renvoie [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue), est le document entier tel que le détient un éditeur. `setInitialValue()`, le setter `value` et `setSchemaJSON()` lisent l’une ou l’autre forme, tout fichier enregistré par une version antérieure et un document v2 `.vuerd`. Avant la version `4.0.0`, il n’y en avait qu’une : `value` renvoyait le document entier tel que l’éditeur le détenait, comme le fait aujourd’hui `runtimeValue`.

## Forme de stockage et valeur d’exécution {#storage-form-and-runtime-value}

La forme de stockage ne contient que les entités actives : chaque table listée dans `doc.tableIds`, les colonnes que listent ces tables, les relations entre deux tables conservées, les index des tables conservées avec les colonnes d’index dont la colonne figure encore dans la liste de la table, les mémos et groupes de tables listés, et, depuis la version `4.2.0`, les mots, termes et domaines listés qui contiennent une valeur au-delà de leur id. Elle omet ce qu’un éditeur dérive au chargement ou conserve tant qu’il est ouvert : les entités supprimées, `seqColumnIds` et `seqIndexColumnIds`, chaque `zIndex`, les largeurs mesurées, le `ui` des colonnes, l’`identification`, le `startRelationshipType` et les points d’ancrage d’une relation, et, depuis la version `4.2.0`, l’`order` de chaque ligne de dictionnaire ainsi que les listes `doc.wordIds`, `doc.termIds` et `doc.domainIds`. Les types ci-dessous marquent chacun de ces champs `// runtime only`.  
Les clés de chaque collection, sauf les dictionnaires, sont les id, dans l’ordre des unités de code, les colonnes étant d’abord regroupées par `tableId` et les colonnes d’index par `indexId`. Depuis la version `4.2.0`, `wordEntities`, `termEntities` et `domainEntities` viennent après toutes les autres collections, dans cet ordre, chacune écrite sous forme d’un en-tête et de lignes, chaque ligne sur sa propre ligne de texte (voir [Lignes des dictionnaires](#dictionary-rows)). Chaque entité écrit ses champs dans un ordre fixe, et le texte est indenté de deux espaces et se termine par un saut de ligne. Ainsi, un même document écrit toujours les mêmes octets, une modification ne change que ce qu’elle touche, et un fichier enregistré sur une machine dotée d’autres polices se rouvre avec le même `value`.  
VS Code, Obsidian et le plugin JetBrains n’écrivent un fichier que lorsqu’une modification change `value`, si bien qu’un fichier enregistré par une version antérieure garde son ancienne forme jusqu’à sa première modification.

Depuis la version `4.2.0`, la forme de stockage omet aussi ce qui ne contient rien : chaque champ de texte qu’une entité ou son `ui` contient sous la forme `''` (le `name`, le `comment` et le `ui.color` d’une table, le `name`, le `comment`, le `dataType` et le `default` d’une colonne, le `name` d’un index, le `value` et le `ui.color` d’un mémo, le `name` et le `color` d’un groupe de tables), chaque liste de `doc` et chaque collection qui ne contient aucune entrée, et `collections` lui-même dès que toutes les collections sont vides. Un texte composé uniquement de blancs est écrit tel qu’il est détenu, sauf un nom logique, qui est alors omis, et un mot, un terme ou un domaine dont les valeurs au-delà de l’id sont toutes vides ou composées uniquement de blancs, qui est omis en entier. Chaque id, chaque liste à l’intérieur d’une entité et chaque nombre, `0` compris, sont toujours écrits. `doc` est toujours écrit, si bien que le fichier d’un nouveau document contient `$schema`, `version`, ses paramètres et `"doc": {}`.  
L’analyse lit un champ de texte absent comme `''` et une collection absente comme vide, comme le fait toute version v3, et la forme de stockage n’omet une liste de `doc` que tant que sa collection ne contient rien (voir [Doc](#doc)). Ainsi, un éditeur antérieur à la version `4.2.0` ouvre lui aussi ces fichiers, et un programme qui lit lui-même un fichier doit lire ce qui manque de la même façon. Un fichier enregistré par une version antérieure ressort de son prochain enregistrement avec ses textes, listes et collections vides omis, un changement fait une seule fois, puis s’enregistre octet pour octet à partir de là.

La valeur d’exécution conserve ce que la forme de stockage omet : entités supprimées, séquences, z-index, largeurs, marques de clé, indicateurs de relation et points d’ancrage, champs de texte vides, ainsi que les quatre listes `tableIds`, `relationshipIds`, `indexIds` et `memoIds` et les six collections de `tableEntities` à `memoEntities`, même vides. Depuis la version `4.2.0`, elle conserve aussi les mots, termes et domaines supprimés, les lignes qui ne contiennent rien, l’`order` de chaque ligne, les trois listes des dictionnaires, un nom logique composé uniquement de blancs et un lien vers un domaine supprimé. Elle est indentée de deux espaces, sans saut de ligne final. Utilisez-la uniquement pour initialiser un collaborateur ou une seconde vue avec `setInitialValue()`, afin que l’annulation d’une suppression envoyée par un autre éditeur y rétablisse l’entité en entier. Ne l’écrivez jamais dans un fichier ; le JSON Schema la refuse. Plus rien ne collecte les entités supprimées, si bien que la valeur d’exécution les conserve jusqu’à la prochaine ouverture du document depuis son fichier.

Les deux formes écrivent chaque paramètre verrouillé à sa valeur verrouillée (voir [`lockSettings`](#settings)), `settings.ddlScripts` seulement tant qu’un script contient du texte, et le `groupId` d’une table seulement tant qu’il n’est pas vide. Depuis la version `4.2.0`, toutes deux écrivent aussi `settings.nameViewMode` seulement tant que la valeur qu’elles écrivent n’est pas `'physical'`, `settings.columnOrder` en sept entrées lorsque c’est possible (voir [Settings](#settings)), et le `nameDerived` d’une table seulement tant qu’il vaut `true`.  
La forme de stockage n’écrit `doc.tableGroupIds` et `tableGroupEntities` que tant qu’un groupe de tables existe, un `logicalName` que tant qu’il contient autre chose que des blancs, le `domainId` d’une colonne que tant qu’il désigne un domaine que le fichier écrit, et chaque dictionnaire que tant qu’il contient une ligne que le fichier écrit. La valeur d’exécution écrit les champs des groupes de tables tant que le document contient un groupe ou un groupe supprimé, `logicalName` et `domainId` tant qu’ils ne valent pas `''`, et chaque dictionnaire avec sa liste tant que l’un ou l’autre contient une entrée, une ligne supprimée comprise.

## TypeScript {#typescript}

Les types décrivent la valeur d’exécution. Un champ marqué `// runtime only` est omis de la forme de stockage, et un champ marqué `?` n’est écrit que tant qu’il contient quelque chose. Les textes, listes et collections vides que la forme de stockage omet depuis la version `4.2.0` ne sont pas marqués.

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
    wordEntities?: DictionaryRows; // rows of Word
    termEntities?: DictionaryRows; // rows of Term
    domainEntities?: DictionaryRows; // rows of Domain
  };
};
```

Chaque entité a un `id`, une chaîne opaque, qui lui sert de clé dans sa collection, sauf dans les trois dictionnaires, où il est la première valeur d’une ligne. Depuis la version `4.2.0`, l’analyse identifie par la clé sous laquelle elle est rangée une entité des sept collections à clés dont l’`id` est absent, vide ou n’est pas une chaîne, et écarte une entrée qui n’est pas un objet, ou une entrée sans id dont la clé est `''`. Une ligne de dictionnaire est écartée lorsqu’elle n’est pas un tableau ou que son `id` n’est pas une chaîne autre que `''`. Un éditeur antérieur à la version `4.2.0` écarte une entité dont l’`id` est absent ou vide, si bien que la forme de stockage écrit toujours chaque id.  
Depuis la version `4.0.0`, chaque nouvel id, y compris celui d’une ligne de dictionnaire, est un UUIDv7 écrit sous forme Uuid25, soit 25 chiffres en base 36 en minuscules comme `03gzrxjv20bdlcak89q25d2m7`, si bien que les id qu’un éditeur génère se trient dans l’ordre où il les a créés. Un document conserve les id qu’il contient, comme les id nanoid d’une version antérieure ou les id d’un fichier v2, et rien ne doit donc dépendre de la forme d’un id.

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
  nameViewMode?: string; // Constants: NameViewMode
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
  dictionary: '@dineug/erd-editor/builtin-dictionary',
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
  columnDomain: 8192,
} as const;

const ColumnType = {
  columnName: 1,
  columnDataType: 2,
  columnNotNull: 4,
  columnUnique: 8,
  columnAutoIncrement: 16,
  columnDefault: 32,
  columnComment: 64,
  columnLogicalName: 128,
  columnDomain: 256,
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
  unlockNameViewMode: 64, // nameViewMode; set while unlocked
} as const;

const NameViewMode = {
  physical: 'physical',
  logical: 'logical',
  both: 'both',
} as const;
```

`originX` et `originY` constituent la vue : le point de l’écran où se place le point `(0, 0)` de la scène.  
`zoomLevel` va de `0.1` à `1.5`. Un document enregistré au-delà de `1` s’ouvre à `1` dans un éditeur antérieur à la version `3.5.0`.  
Depuis la version `4.0.0`, les paramètres ne comportent ni `width`, ni `height`, ni `scrollTop`, ni `scrollLeft`, ni `relationshipOptimization`, ni `ignoreSaveSettings`. Rien ne les écrit, l’analyseur n’en conserve aucun, et le JSON Schema refuse un fichier qui les contient encore.

`canvasType` est l’onglet sur lequel s’ouvre un document. Un document enregistré sur l’onglet Visualisation contient `'@dineug/erd-editor/builtin-visualization'`, mais n’indique pas si le mode `Graph` ou le mode `Flow` était affiché, et un éditeur nouvellement créé affiche cet onglet en mode `Graph`.  
Depuis la version `4.0.0`, tant que le verrou `Canvas Type` est activé, comme dans un nouveau document, le document conserve l’onglet affiché au moment du verrouillage, et changer d’onglet laisse `value` inchangé. Un verrouillage effectué dans l’onglet Paramètres retient l’onglet d’où venait le lecteur, et un `'settings'` verrouillé, que seule une modification manuelle peut écrire, s’ouvre sur `'ERD'`.  
Depuis la version `4.2.0`, `canvasType` peut aussi valoir `'@dineug/erd-editor/builtin-dictionary'`, l’onglet [Dictionnaire](../../guide/guides/dictionary.md), que le verrou `Canvas Type` retient comme il retient les autres. Un éditeur antérieur à la version `4.2.0` conserve cette valeur, mais n’affiche aucun onglet sous sa barre d’outils tant que le lecteur n’en a pas choisi un.  
Aucun état propre au mode `Flow` n’est sérialisé : son placement, son zoom, son déplacement de la vue, son affichage des lignes et les tables sur lesquelles il se concentre restent dans l’éditeur, de même, depuis la version `4.2.0`, que les vues que parcourent [`Previous table` et `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table). Ainsi, `originX`, `originY` et `zoomLevel` décrivent toujours le canevas ERD.

`show` et `lockSettings` sont des masques de bits : combinez les indicateurs par un OU binaire.  
`columnOrder` est un tableau contenant chaque valeur de `ColumnType` une seule fois, dans l’ordre d’affichage ; depuis la version `4.2.0`, un document peut l’écrire avec sept des neuf valeurs, comme le décrit plus bas le paragraphe sur l’ordre des colonnes.  
`database`, `language`, `tableNameCase`, `columnNameCase` et `bracketType` contiennent chacun exactement une valeur, et le JSON Schema rejette une valeur combinée.

Le `show` d’un nouveau document vaut `431` : `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` et `relationship`.  
Depuis la version `3.10.0`, `show` compte deux indicateurs de plus, tous deux désactivés dans un nouveau document et dans tout document enregistré avant la version `3.10.0`.  
`columnAlternateKey` (`512`) est l’option d’affichage [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Lorsqu’il est activé, il marque de `AK1.1`, `AK1.2` et ainsi de suite les colonnes de chaque index unique portant sur deux colonnes ou plus. Il est désactivé au départ, si bien qu’aucun diagramme existant ne change de largeur.  
`hideReferentialAction` (`1024`) fonctionne à l’inverse : lorsqu’il est activé, il masque les [étiquettes ON DELETE et ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) des connecteurs, qui s’affichent donc par défaut. L’option d’affichage `Referential Actions` est cochée tant que l’indicateur est désactivé. Il ne modifie la taille d’aucune table.  
Un éditeur antérieur à la version `3.10.0` conserve `show` comme un nombre entier, si bien que les deux indicateurs survivent à un enregistrement dans cet éditeur.

Depuis la version `4.0.0`, `show` compte deux indicateurs de plus, tous deux désactivés dans un nouveau document et dans tout document enregistré avant la version `4.0.0`. Comme `hideReferentialAction`, chacun masque ce qu’il nomme, si bien que les groupes de tables et les mémos s’affichent par défaut.  
`hideTableGroup` (`2048`) masque les [groupes de tables](../../guide/guides/table-groups.md), et `hideMemo` (`4096`) masque tous les mémos. Ce sont les [options d’affichage](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` et `Memos`, chacune cochée tant que son indicateur est désactivé. Aucun des deux ne modifie la taille d’une table.  
Un éditeur antérieur à la version `4.0.0` conserve `show` comme un nombre entier, si bien que les deux indicateurs survivent à un enregistrement dans cet éditeur.

Depuis la version `4.2.0`, `show` compte un indicateur de plus, `columnDomain` (`8192`), désactivé dans un nouveau document et dans tout document enregistré avant la version `4.2.0`, si bien que le `show` d’un nouveau document vaut toujours `431`. C’est l’[option d’affichage](../../guide/guides/table-related-functions.md#table-view-options) `Domain` : lorsqu’il est activé, chaque ligne de colonne affiche une [cellule Domaine](../../guide/guides/logical-names.md#the-domain-cell), ce qui élargit les tables. Il est désactivé au départ, si bien qu’aucun diagramme existant ne change de largeur.  
Un éditeur antérieur à la version `4.2.0` conserve `show` comme un nombre entier, si bien que l’indicateur survit à un enregistrement dans cet éditeur.

Depuis la version `4.2.0`, `ColumnType` compte neuf valeurs. `columnLogicalName` (`128`) place la cellule du nom logique, qu’une ligne de colonne n’affiche que dans la vue `Both Names`, et `columnDomain` (`256`) la cellule Domaine. Ce sont les lignes `Logical Name` et `Domain` de l’[ordre des colonnes](../../guide/guides/settings.md#adjusting-column-order) de l’onglet Paramètres. Un éditeur détient un ordre des neuf valeurs, et celui d’un nouveau document est `128, 1, 2, 256, 4, 8, 16, 32, 64`.  
Les deux formes écrivent l’ordre en sept entrées, sans `128` ni `256`, tant que `128` se trouve juste avant `columnName` et `256` juste après `columnDataType`. Ainsi, un nouveau document écrit toujours `1, 2, 4, 8, 16, 32, 64`, et un fichier dont l’ordre ne les a jamais déplacés conserve ses octets. Sinon, elles écrivent les neuf.  
L’analyse insère les deux à ces places dans un ordre de sept entrées, quel que soit l’ordre des sept, prend telles quelles neuf entrées qui contiennent chaque type.  
Depuis la version `5.0.0`, elle accepte aussi tout autre ordre. Elle conserve une seule fois chaque `ColumnType` qu’elle connaît, dans l’ordre donné, et écarte toute autre entrée : une valeur qu’aucun `ColumnType` ne nomme, comme un type qu’ajouterait une version ultérieure, et une seconde entrée d’un même type. Chaque type absent de l’ordre est placé juste après le type le plus proche qui le précède dans l’ordre par défaut et que l’ordre contient ou, s’il n’y en a aucun avant lui, juste avant le plus proche de ceux qui le suivent, ce qui est la façon dont `128` et `256` trouvent leur place dans sept entrées. Seul un ordre qui ne nomme aucun type connu, ou une valeur qui n’est pas un tableau, est lu comme l’ordre par défaut.  
Ainsi, un fichier enregistré par une version ultérieure s’ouvre avec son ordre des types que cette version connaît, et un enregistrement ici écrit cet ordre sans les autres. Avant la version `5.0.0`, une analyse lisait tout autre ordre comme l’ordre par défaut, si bien qu’un tel fichier s’ouvrait avec l’ordre de ses colonnes réinitialisé. Le JSON Schema accepte sept ou neuf entiers.

Depuis la version `4.0.0`, `Language` compte huit cibles de plus pour le [générateur de code](../../guide/guides/code-generator.md), de `Mermaid` à `JSONSchema`. Un `language` que l’analyseur ne connaît pas est lu comme `GraphQL`, si bien qu’un éditeur antérieur à la version `4.0.0` ouvre sur GraphQL un document enregistré avec l’une de ces cibles, et qu’un enregistrement dans cet éditeur écrit GraphQL.

Depuis la version `4.0.0`, `lockSettings` prend la place de `ignoreSaveSettings`, et `LockSettingType` celle de `SaveSettingType`, qui a été supprimé. `lockSettings` désigne les paramètres qu’un document enregistre tels qu’ils étaient au moment de leur verrouillage. `viewport` couvre à la fois `originX`, `originY` et `zoomLevel`, car une origine enregistrée sans son zoom s’ouvre ailleurs, et chaque autre bit couvre le champ dont il porte le nom. Ce sont les lignes [`Lock`](../../guide/guides/settings.md#lock) de l’onglet Paramètres.  
Un paramètre verrouillé est écrit à sa valeur verrouillée, quoi qu’affiche l’éditeur, par `value` comme par `runtimeValue`, et tout autre paramètre tel qu’il est. Ainsi, tant que le verrou correspondant est activé, faire défiler et zoomer, changer d’onglet, changer le langage du générateur de code, une casse des noms ou le type de délimiteur, ou changer l’affichage des noms laisse le fichier inchangé. Le verrouillage prend la valeur que détient le paramètre à cet instant, et l’analyse prend la valeur verrouillée dans le champ enregistré.  
Un document créé à partir de rien (un nouvel éditeur ou un nouveau store de réplication, ou une valeur vide donnée à `value` ou à `setInitialValue()`) a `lockSettings` défini à `63`, tous les verrous activés. Un document dont les `settings` ne comportent pas de `lockSettings` (tout fichier enregistré avant la version `4.0.0`, quel que soit son `ignoreSaveSettings`, et tout document v2) s’ouvre lui aussi avec tous les verrous activés : sa vue et son onglet là où sont ceux d’un nouveau document (`originX` et `originY` à `0`, `zoomLevel` à `1`, l’onglet ERD), et son langage, ses casses des noms et son type de délimiteur verrouillés sur les valeurs qu’il a enregistrées. Un document qui nomme ses verrous les conserve, `0` compris, ainsi que toutes les valeurs qu’il a enregistrées.  
L’analyse conserve tous les bits de `lockSettings`, y compris les bits inconnus, si bien qu’un verrou ajouté par une version ultérieure survit à un enregistrement ici ; le JSON Schema vérifie seulement qu’il s’agit d’un entier. Un éditeur antérieur à la version `4.0.0` supprime `lockSettings` à l’enregistrement et écrit la vue et l’onglet tels qu’ils sont, si bien que le fichier se rouvre ici comme un fichier enregistré avant la version `4.0.0`.

Depuis la version `4.2.0`, il existe un septième verrou, `unlockNameViewMode` (`64`), la ligne `Name View`, qui couvre `nameViewMode`. Son bit se lit à l’inverse des autres bits de verrou, comme les bits de masquage de `Show` : à 1, l’affichage des noms est déverrouillé, et à 0, verrouillé. Ainsi, `63` signifie toujours que tous les verrous sont activés, et un nouveau document contient cette valeur avec l’affichage des noms verrouillé sur `'physical'`. Un fichier enregistré avant la version `4.2.0` a ce bit à 0, quels que soient ses autres verrous, `0` compris, si bien qu’il s’ouvre avec l’affichage des noms verrouillé sur `'physical'`. Un document dont tous les verrous sont désactivés contient `64`, et un document dont tous les autres verrous sont activés et l’affichage des noms déverrouillé contient `127`. Testez ce verrou à l’envers : il est activé tant que `(lockSettings & 64) === 0`.  
Tant qu’il est activé, un changement de l’affichage des noms ne modifie que l’écran de l’éditeur qui l’a fait, et le document conserve la vue verrouillée. Tant qu’il est désactivé, un changement fait dans un éditeur qui peut modifier le document devient celui du document, et chaque collaborateur change de vue avec lui. Dans les deux cas, le changement d’un éditeur en lecture seule ne modifie que son propre écran. Voir [`Lock`](../../guide/guides/settings.md#lock).  
Un éditeur en version `4.0.0` ou `4.1.0` conserve le bit lors d’un enregistrement, mais supprime `nameViewMode`, si bien que le document se rouvre ici en `'physical'`, son verrou inchangé.

Depuis la version `4.0.0`, `ddlScripts` contient les deux scripts de l’onglet [Schéma SQL](../../guide/guides/schema-sql.md), que le DDL de chaque base de données écrit : `before` après l’en-tête et avant les tables, `after` après le DDL généré. Le DDL écrit chacun avec des sauts de ligne LF, sans ses lignes vides de tête ni ses espaces de fin, et, sur MSSQL, terminé par `GO`, comme le décrit [Scripts avant et après les tables](../../guide/guides/schema-sql.md#before-and-after-scripts) ; `ddlScripts` lui-même conserve chaque script tel qu’il a été saisi. La clé n’est écrite que tant que l’un des scripts contient du texte, et alors avec les deux ; une clé absente, ou un script qui n’est pas une chaîne, est lu comme `''`. Les choix `Statements`, `Header` et `Tables` de l’onglet, ainsi que, depuis la version `4.2.0`, son interrupteur [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments), ne sont pas enregistrés dans le document.  
Un éditeur antérieur à la version `4.0.0` supprime les scripts au chargement d’un document, si bien qu’un enregistrement dans cet éditeur les perd.

Depuis la version `4.2.0`, `nameViewMode` est l’[affichage des noms](../../guide/guides/logical-names.md#name-view), les noms que dessine le diagramme : `'physical'` le nom de chaque table et de chaque colonne, `'logical'` son nom logique à la place du nom, et `'both'` le nom logique et le nom. Les menus les appellent `Physical Names`, `Logical Names` et `Both Names`. Les deux formes l’écrivent en dernier, après `ddlScripts`, et seulement tant que la valeur qu’elles écrivent n’est pas `'physical'` ; tant que le verrou `Name View` est activé, il s’agit de la valeur verrouillée, quoi qu’affiche l’écran. Une valeur absente, ou que l’analyseur ne connaît pas, est lue comme `'physical'`, et le JSON Schema n’accepte que `"logical"` et `"both"`.  
Un éditeur antérieur à la version `4.2.0` supprime `nameViewMode` au chargement d’un document.

`Database`, `Language`, `Show`, `ColumnType`, `ColumnOption`, `LockSettingType` et `ReferentialAction` n’admettent que des ajouts en fin de liste. Un document enregistré stocke le nombre, si bien que tout ajout (SGBD, cible de génération de code, indicateur, type de colonne, option de colonne, verrou ou action) prend le bit suivant plutôt qu’un emplacement au milieu.

### Doc {#doc}

```ts
type Doc = {
  tableIds: string[];
  relationshipIds: string[];
  indexIds: string[];
  memoIds: string[];
  tableGroupIds?: string[];
  wordIds?: string[]; // runtime only
  termIds?: string[]; // runtime only
  domainIds?: string[]; // runtime only
};
```

Chacune des cinq premières listes donne l’ordre d’un type d’entité, que lisent le DDL, le tri des tables et l’ordre de rendu. Dans la forme de stockage, chaque liste ne contient que les id des entités conservées, chacun une seule fois, dans l’ordre de la liste, et, depuis la version `4.2.0`, une liste qui n’en contient aucun est omise. Depuis la version `4.0.0`, `tableGroupIds` donne l’ordre des groupes de tables.

Depuis la version `4.2.0`, `wordIds`, `termIds` et `domainIds` listent les lignes actives de chaque dictionnaire : une ligne que contient sa collection mais pas sa liste est supprimée. Elles ne donnent pas l’ordre d’une feuille, que donne l’`order` de chaque ligne. Seule la valeur d’exécution les écrit, chacune tant qu’elle-même ou sa collection contient une entrée. Les lignes d’un fichier constituent elles-mêmes l’appartenance et l’ordre, et le JSON Schema refuse ces listes.  
Depuis la version `4.2.0`, l’analyse lit une liste que le document omet, ou qu’il contient sous une autre forme qu’un tableau, comme toutes les entrées que contient sa collection, chaque id une seule fois, dans l’ordre où elles sont détenues ; un tableau vide reste vide, toutes les entrées de sa collection étant alors lues comme supprimées. Un éditeur antérieur à la version `4.2.0` lit une liste absente comme vide, si bien que la forme de stockage écrit toujours chaque liste dès que sa collection contient une entité.

Depuis la version `4.0.0`, l’ordre d’empilement n’est pas enregistré. L’analyse empile chaque table, mémo et groupe de tables listé qui ne porte pas de `zIndex` selon sa place dans sa liste, les derniers devant : les groupes de tables à partir de `1`, les tables à partir de `2`, et les mémos au-dessus de toutes les tables. Une entité qui porte un `zIndex`, comme dans une valeur d’exécution ou un fichier enregistré avant la version `4.0.0`, le conserve. La mise au premier plan d’une table ou d’un mémo est donc perdue à la réouverture du fichier.

### Collection : tableEntities {#collection-tableentities}

```ts
type Table = {
  id: string;
  name: string;
  logicalName?: string;
  comment: string;
  columnIds: string[];
  seqColumnIds: string[]; // runtime only
  groupId?: string;
  nameDerived?: boolean;
  ui: TableUI;
};

type TableUI = {
  x: number;
  y: number;
  zIndex: number; // runtime only
  widthName: number; // runtime only
  widthLogicalName: number; // runtime only
  widthComment: number; // runtime only
  color: string;
};
```

Depuis la version `4.0.0`, une table porte `groupId`, l’id du [groupe de tables](../../guide/guides/table-groups.md) auquel elle appartient. Un `groupId` absent ou vide, ou qui ne désigne aucun groupe de `doc.tableGroupIds`, signifie l’absence de groupe, et la forme de stockage ne l’écrit que tant qu’il désigne un groupe conservé.  
L’analyse initialise `seqColumnIds` à `columnIds` lorsqu’il est absent ou qu’il lui manque un id listé, et un éditeur mesure à nouveau `widthName`, `widthLogicalName` et `widthComment` avec ses propres polices à chaque chargement.

Depuis la version `4.2.0`, une table porte `logicalName`, le nom que dessinent les [vues](../../guide/guides/logical-names.md#name-view) `Logical Names` et `Both Names`, `''` s’il n’y en a pas, et `nameDerived`, `true` tant que les dictionnaires ont [dérivé](../../guide/guides/dictionary.md#deriving-physical-names) `name` du nom logique. Tant qu’il vaut `true`, un nouveau nom logique dérive de nouveau le nom ; sinon, le nom est un nom personnel, et un nouveau nom logique n’y touche pas, sauf si le nom est vide ou composé uniquement de blancs. Un renommage manuel le désactive, et [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) réécrit même un nom saisi par quelqu’un et l’active partout où il existe un nom logique.  
La forme de stockage écrit `logicalName` après `name`, tel qu’il a été saisi, seulement tant qu’il contient autre chose que des blancs, et `nameDerived` après `groupId` seulement tant qu’il vaut `true`, la seule valeur qu’accepte le JSON Schema. Un `logicalName` absent est lu comme `''` et un `nameDerived` absent comme `false`, si bien que chaque nom d’un fichier enregistré avant la version `4.2.0` compte comme personnel.  
Un éditeur antérieur à la version `4.2.0` supprime les deux au chargement d’un document, si bien qu’un enregistrement dans cet éditeur perd le nom logique de chaque table.

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
  logicalName?: string;
  domainId?: string;
  ui: ColumnUI; // runtime only
};

type ColumnUI = {
  keys: number; // Constants: ColumnUIKey
  widthName: number;
  widthLogicalName: number;
  widthComment: number;
  widthDataType: number;
  widthDomain: number;
  widthDefault: number;
};

// Constants
const ColumnOption = {
  autoIncrement: 1,
  primaryKey: 2,
  unique: 4,
  notNull: 8,
  nameDerived: 16,
} as const;

const ColumnUIKey = {
  primaryKey: 1,
  foreignKey: 2,
} as const;
```

Depuis la version `4.0.0`, la forme de stockage n’écrit aucun `ui` de colonne. Chaque chargement dérive `keys` (la marque de clé primaire à partir du bit `primaryKey` de `options` et la marque de clé étrangère à partir des relations qui aboutissent à la colonne) et mesure les six largeurs.  
Un éditeur antérieur à la version `4.0.0` affiche les colonnes d’un fichier enregistré ici sans leurs icônes de clé primaire.

Depuis la version `4.2.0`, une colonne porte `logicalName`, comme une table, et `domainId`, l’id du domaine auquel elle est liée, `''` s’il n’y en a pas. Les modifications faites dans un éditeur maintiennent une colonne liée au type de données de son domaine, comme le décrit [Domaines et types de données](../../guide/guides/dictionary.md#domains-and-data-types). L’analyse ne change toutefois le type d’aucune colonne, si bien qu’un fichier écrit ailleurs peut laisser à une colonne liée un autre type, tout comme les modifications croisées de deux collaborateurs ; la feuille Vérifications liste chacun de ces cas comme [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds). L’analyse efface un `domainId` qui ne désigne aucun domaine que contient le document. Un domaine supprimé compte encore, si bien que l’éditeur conserve un lien vers lui tant qu’une annulation peut rétablir le domaine. Après `options`, la forme de stockage écrit `logicalName` selon la règle d’une table, et `domainId` seulement tant qu’il désigne un domaine que le fichier écrit, donc jamais un lien vers un domaine supprimé.  
`ColumnOption.nameDerived` (`16`) est l’indicateur de nom dérivé de la colonne, conservé dans `options` avec les autres bits et ayant le même sens que le `nameDerived` d’une table. Une clé primaire non NULL dont les dictionnaires ont dérivé le nom contient par exemple `options` `26`.  
Un éditeur antérieur à la version `4.2.0` supprime `logicalName` et `domainId` au chargement d’un document, si bien qu’un enregistrement dans cet éditeur les perd. Il conserve `options` comme un nombre entier, si bien que le bit `nameDerived` survit à un enregistrement dans cet éditeur.

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

### Lignes des dictionnaires {#dictionary-rows}

Depuis la version `4.2.0`, un document contient trois dictionnaires, les feuilles `Words`, `Terms` et `Domains` de l’onglet [Dictionnaire](../../guide/guides/dictionary.md), dans `wordEntities`, `termEntities` et `domainEntities`. Chaque champ d’un mot, d’un terme ou d’un domaine est une chaîne, et aucun n’a de `ui`. La feuille `Checks` est calculée à partir des dictionnaires et du diagramme, et n’est pas enregistrée.

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

Aucun des trois n’a l’id pour clé. Chacun est écrit sous forme d’un en-tête et de lignes : `fields` nomme une seule fois les champs de l’entité, l’id en premier, et chaque ligne contient les valeurs d’une entité dans cet ordre. Les types ci-dessous listent les champs de chaque entité dans l’ordre de l’en-tête de la valeur d’exécution. Une ligne conserve toujours son id et son nom, mais ses valeurs vides finales au-delà du nom sont omises, si bien qu’une valeur vide placée avant une valeur conservée reste `''`, et l’analyse lit comme `''` une valeur qui manque à une ligne. Les deux formes écrivent chaque ligne sur sa propre ligne de texte, en JSON compact, comme dans ces deux mots tirés d’un fichier :

```json
"wordEntities": {
  "fields": [
    "id",
    "name",
    "abbreviation",
    "englishName",
    "description",
    "synonyms",
    "forbiddenWords"
  ],
  "rows": [
    ["w1","Customer","CUST","customer"],
    ["w2","Number","NO","number","","No, Num","Nbr"]
  ]
}
```

La forme de stockage écrit les lignes listées dans l’ordre de la feuille et omet `order`, si bien que ses en-têtes ne le nomment pas. Elle omet une ligne dont les valeurs au-delà de l’id sont toutes vides ou composées uniquement de blancs, comme une ligne ajoutée et jamais remplie, ou vidée, ainsi que chaque lien vers un tel domaine ou vers un domaine supprimé : le `domainId` d’une colonne est omis, et celui d’un terme est écrit `''`, le terme lui-même étant omis s’il ne contient rien d’autre.  
Les en-têtes de la valeur d’exécution nomment `"order"` juste après `"name"`. Elle écrit chaque ligne que contient sa collection, lignes supprimées comprises, dans l’ordre où la collection les contient : triez donc par `order`, comparé dans l’ordre des unités de code, pour obtenir l’ordre d’une feuille. L’analyse donne aux lignes d’un fichier des clés `order` dans l’ordre où se trouvent les lignes, si bien qu’elles se relisent dans l’ordre où le fichier les a écrites.  
Un document sans les dictionnaires, comme un document enregistré avant la version `4.2.0`, n’en a aucun. Un éditeur antérieur à la version `4.2.0` supprime les trois au chargement d’un document, si bien qu’un enregistrement dans cet éditeur perd tous les mots, termes et domaines.

### Collection : wordEntities {#collection-wordentities}

```ts
type Word = {
  id: string;
  name: string;
  order: string; // runtime only
  abbreviation: string;
  englishName: string;
  description: string;
  synonyms: string;
  forbiddenWords: string;
};
```

Un mot est l’un des mots dont se compose un nom logique, et `abbreviation` est ce qui le représente dans un nom physique. `synonyms` liste d’autres graphies du mot, et `forbiddenWords` les mots à ne pas employer à sa place, dans les deux cas séparés par des virgules.

### Collection : termEntities {#collection-termentities}

```ts
type Term = {
  id: string;
  name: string;
  order: string; // runtime only
  physicalName: string;
  domainId: string;
  description: string;
  synonyms: string;
};
```

Un terme est un nom logique entier. Une table ou une colonne dont le `logicalName` correspond à `name` dérive `physicalName` ou, tant que celui-ci est vide, un nom composé à partir des abréviations des mots, et une colonne prend aussi le domaine que désigne `domainId`, `''` s’il n’y en a pas (voir [Dériver les noms physiques](../../guide/guides/dictionary.md#deriving-physical-names)). `synonyms` est séparé par des virgules. L’analyse efface un `domainId` qui ne désigne aucun domaine, comme pour une colonne.

### Collection : domainEntities {#collection-domainentities}

```ts
type Domain = {
  id: string;
  name: string;
  order: string; // runtime only
  category: string;
  dataType: string;
  description: string;
};
```

Un domaine est un type de données nommé, que `dataType` contient comme le fait une colonne, longueur comprise, par exemple `NUMERIC(10)`. Une colonne ou un terme est lié à un domaine par son id, et l’éditeur donne à chaque colonne liée le type de données du domaine (voir [Domaines et types de données](../../guide/guides/dictionary.md#domains-and-data-types)).

## JSON Schema {#json-schema}

Le fichier de schéma canonique est publié à l’adresse [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) et peut être référencé directement avec `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Placez `$schema` en tête d’un fichier `.erd.json` : les éditeurs qui comprennent JSON Schema, comme VS Code, valident alors le document et proposent la saisie semi-automatique de ses champs pendant que vous le modifiez.

Depuis la version `4.0.0`, le schéma ne décrit que la forme de stockage. Tout objet à champs nommés est fermé (`additionalProperties: false`), tout champ que la forme de stockage écrit toujours est obligatoire, un champ qu’elle omet tant qu’il ne contient rien est nommé mais pas obligatoire, et aucun champ qu’elle omet toujours n’est nommé. Il refuse donc la valeur d’exécution. Il refuse aussi un fichier enregistré avant la version `4.0.0`, avec son `meta`, ses largeurs, ses `zIndex`, son `ignoreSaveSettings` et le reste, jusqu’à ce qu’un éditeur en version `4.0.0` ou ultérieure réenregistre ce fichier. Un fichier enregistré par la version `3.2.0` ou ultérieure nomme déjà l’URL de ce schéma, qui pointe vers la branche `main`, si bien qu’un éditeur qui valide le fichier avec ce schéma le signale désormais. Un fichier enregistré par la version `3.0.0` ou `3.1.0`, ou un document v2, ne nomme aucun `$schema`.

Depuis la version `4.2.0`, le schéma n’exige plus ni les champs de texte d’une entité, ni les listes de `doc`, ni les collections, ni `collections` lui-même, que la forme de stockage omet tant qu’ils ne contiennent rien. Il accepte toujours un fichier enregistré par la version `4.0.0` ou `4.1.0`. Il nomme les nouveaux champs : `nameViewMode`, qui n’accepte que `"logical"` et `"both"` ; le `logicalName` et le `nameDerived` d’une table, ce dernier n’acceptant que `true` ; le `logicalName` et le `domainId` d’une colonne ; et les trois dictionnaires, chacun avec son en-tête et ses lignes de chaînes. `canvasType` liste l’onglet Dictionnaire, `columnOrder` accepte sept ou neuf entiers, et les descriptions de `show`, `columnOrder`, `lockSettings` et `options` nomment les nouveaux bits.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "title": "ERD Editor document",
  "description": "The storage form an ERD Editor file holds (.erd, .erd.json, .vuerd, .vuerd.json): the live entities alone, each collection keyed in id order but the dictionaries, a header and one row per entry in document order, without what an editor derives on load or keeps while it is open, without an entity's text field while it is empty, which reads as the empty string, and without an empty list or collection, which reads as none",
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
      "description": "The entities of each kind, a kind with none left out",
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
        },
        "wordEntities": {
          "$ref": "#/$defs/wordEntities"
        },
        "termEntities": {
          "$ref": "#/$defs/termEntities"
        },
        "domainEntities": {
          "$ref": "#/$defs/domainEntities"
        }
      },
      "additionalProperties": false
    }
  },
  "required": ["$schema", "version", "settings", "doc"],
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
          "description": "bit value (tableComment: 1) | (columnComment: 2) | (columnDataType: 4) | (columnDefault: 8) | (columnAutoIncrement: 16) | (columnPrimaryKey: 32) | (columnUnique: 64) | (columnNotNull: 128) | (relationship: 256) | (columnAlternateKey: 512) | (hideReferentialAction: 1024) | (hideTableGroup: 2048) | (hideMemo: 4096) | (columnDomain: 8192); the three hide bits hide what they name while set",
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
            "settings",
            "@dineug/erd-editor/builtin-dictionary"
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
          "description": "bit value (columnName: 1) | (columnDataType: 2) | (columnNotNull: 4) | (columnUnique: 8) | (columnAutoIncrement: 16) | (columnDefault: 32) | (columnComment: 64) | (columnLogicalName: 128) | (columnDomain: 256); seven entries without the last two while the logical name stands just before the name and the domain just after the data type, all nine otherwise",
          "type": "array",
          "prefixItems": [
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" }
          ],
          "anyOf": [
            { "minItems": 7, "maxItems": 7 },
            { "minItems": 9, "maxItems": 9 }
          ]
        },
        "maxWidthComment": {
          "type": "integer"
        },
        "lockSettings": {
          "description": "bit value (viewport: 1) | (canvasType: 2) | (language: 4) | (tableNameCase: 8) | (columnNameCase: 16) | (bracketType: 32) | (unlockNameViewMode: 64); a locked setting is saved as it stood when locked, the viewport being originX, originY and zoomLevel. The last bit reads the other way round: set, the name view mode is unlocked, and clear, as in a file saved before it, locked",
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
        },
        "nameViewMode": {
          "description": "The names the diagram shows: the logical ones, or both the physical and the logical. Absent while it shows the physical names, the default",
          "enum": ["logical", "both"]
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
      "description": "The order of each kind of entity, which the DDL, the sort and the draw order read, a kind with none left out. A list goes out whenever its collection holds an entity, since a reader that finds none lists none",
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
          "logicalName": {
            "description": "The name the logical view shows; absent means none",
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
          "nameDerived": {
            "description": "The dictionaries filled the name, so a new logical name derives it again; absent means a name someone wrote",
            "type": "boolean",
            "const": true
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
            "required": ["x", "y"],
            "additionalProperties": false
          }
        },
        "required": ["id", "columnIds", "ui"],
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
            "description": "bit value (autoIncrement: 1) | (primaryKey: 2) | (unique: 4) | (notNull: 8) | (nameDerived: 16); nameDerived is set while the dictionaries filled the name",
            "type": "integer"
          },
          "logicalName": {
            "description": "The name the logical view shows; absent means none",
            "type": "string"
          },
          "domainId": {
            "description": "Id of the domain in domainEntities that governs the data type; absent means none",
            "type": "string"
          }
        },
        "required": ["id", "tableId", "options"],
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
        "required": ["id", "tableId", "indexColumnIds", "unique"],
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
            "required": ["x", "y", "width", "height"],
            "additionalProperties": false
          }
        },
        "required": ["id", "ui"],
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
        "required": ["id", "ui"],
        "additionalProperties": false
      }
    },
    "wordEntities": {
      "description": "The words of the dictionary, the parts a logical name is composed of, each with its abbreviation in a physical name. Written while a word exists; absent means none",
      "type": "object",
      "properties": {
        "fields": {
          "const": ["id", "name", "abbreviation", "englishName", "description", "synonyms", "forbiddenWords"]
        },
        "rows": {
          "description": "One row per entry in document order, its values in the order fields names them; values past the name are left out from the last empty one back",
          "type": "array",
          "items": {
            "type": "array",
            "prefixItems": [
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" }
            ],
            "items": false,
            "minItems": 2
          }
        }
      },
      "required": ["fields", "rows"],
      "additionalProperties": false
    },
    "termEntities": {
      "description": "The terms of the dictionary, logical names a column matches by its text, each with its physical name and domain id. Written while a term exists; absent means none",
      "type": "object",
      "properties": {
        "fields": {
          "const": ["id", "name", "physicalName", "domainId", "description", "synonyms"]
        },
        "rows": {
          "description": "One row per entry in document order, its values in the order fields names them; values past the name are left out from the last empty one back",
          "type": "array",
          "items": {
            "type": "array",
            "prefixItems": [
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" }
            ],
            "items": false,
            "minItems": 2
          }
        }
      },
      "required": ["fields", "rows"],
      "additionalProperties": false
    },
    "domainEntities": {
      "description": "The domains of the dictionary, named data types a column or a term links to by id. Written while a domain exists; absent means none",
      "type": "object",
      "properties": {
        "fields": {
          "const": ["id", "name", "category", "dataType", "description"]
        },
        "rows": {
          "description": "One row per entry in document order, its values in the order fields names them; values past the name are left out from the last empty one back",
          "type": "array",
          "items": {
            "type": "array",
            "prefixItems": [
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" }
            ],
            "items": false,
            "minItems": 2
          }
        }
      },
      "required": ["fields", "rows"],
      "additionalProperties": false
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
