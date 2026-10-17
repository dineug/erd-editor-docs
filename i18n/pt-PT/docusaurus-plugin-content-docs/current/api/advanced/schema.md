---
sidebar_position: 3
description: O formato de documento .erd.json — a forma de armazenamento que um ficheiro contém e o valor em tempo de execução que um editor mantém, os tipos TypeScript, as constantes por detrás de cada campo numérico e o JSON Schema publicado.
---

# Esquema

`.erd.json` é o formato de documento do editor. Leia esta página se precisar de gerar, validar ou migrar um documento fora do editor.

A partir da `4.0.0`, um documento tem duas serializações, ambas com `version` `'3.0.0'`. A forma de armazenamento é o que um ficheiro contém: é o que [`editor.value`](../erd-editor-element.md#value) devolve, o que a exportação JSON escreve e a única forma que o [JSON Schema](#json-schema) publicado aceita. O valor em tempo de execução é o documento inteiro tal como um editor o mantém, que [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) devolve. `setInitialValue()`, o setter `value` e `setSchemaJSON()` leem qualquer uma das formas, qualquer ficheiro guardado por uma versão anterior e um documento `.vuerd` v2. Antes da `4.0.0`, havia apenas uma: `value` devolvia o documento inteiro tal como o editor o mantinha, como `runtimeValue` faz agora.

## Forma de armazenamento e valor em tempo de execução {#storage-form-and-runtime-value}

A forma de armazenamento contém apenas as entidades ativas: cada tabela listada em `doc.tableIds`, as colunas que essas tabelas listam, as relações entre duas tabelas mantidas, os índices das tabelas mantidas, com as colunas de índice cuja coluna a tabela ainda lista, e as notas e os grupos de tabelas listados. Deixa de fora o que um editor deriva ao carregar ou mantém enquanto está aberto: as entidades removidas, `seqColumnIds` e `seqIndexColumnIds`, todos os `zIndex`, as larguras medidas, o `ui` das colunas e o `identification`, o `startRelationshipType` e as âncoras de uma relação. Os tipos abaixo marcam cada um destes campos com `// runtime only`.  
Cada coleção tem o id como chave, pela ordem das unidades de código, com as colunas agrupadas primeiro por `tableId` e as colunas de índice primeiro por `indexId`. Cada entidade escreve os seus campos por uma ordem fixa, e o texto é indentado com dois espaços e termina com uma quebra de linha. Assim, o mesmo documento escreve sempre os mesmos bytes, uma edição altera apenas aquilo em que toca e um ficheiro guardado num computador com outros tipos de letra volta a abrir com o mesmo `value`.  
O VS Code, o Obsidian e o plugin para JetBrains só escrevem um ficheiro quando uma edição altera `value`, pelo que um ficheiro guardado por uma versão anterior mantém a sua forma antiga até à primeira edição.

O valor em tempo de execução mantém o que a forma de armazenamento deixa de fora: entidades removidas, sequências, valores de z-index, larguras, marcas de chave, sinalizadores das relações e âncoras. É indentado com dois espaços, sem quebra de linha no final. Utilize-o apenas para inicializar um colaborador ou uma segunda vista através de `setInitialValue()`, para que, quando outro editor envia a anulação de uma remoção, a entidade seja aí reposta por inteiro. Nunca o escreva num ficheiro; o JSON Schema recusa-o. Já nada recolhe as entidades removidas, pelo que o valor em tempo de execução as mantém até o documento voltar a ser aberto a partir do seu ficheiro.

As duas formas escrevem cada definição bloqueada com o seu valor bloqueado (consulte [`lockSettings`](#settings)), `settings.ddlScripts` apenas enquanto um script contém texto e o `groupId` de uma tabela apenas enquanto não está vazio. A forma de armazenamento escreve `doc.tableGroupIds` e `tableGroupEntities` apenas enquanto existe um grupo de tabelas; o valor em tempo de execução escreve-os enquanto o documento contém um grupo ou um grupo removido.

## TypeScript {#typescript}

Os tipos descrevem o valor em tempo de execução. Um campo marcado com `// runtime only` fica de fora da forma de armazenamento, e um campo marcado com `?` só é escrito enquanto contém algo.

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

Cada entidade tem como chave o seu `id`, uma cadeia de caracteres opaca; a análise descarta uma entidade cujo `id` esteja em falta ou vazio. A partir da `4.0.0`, cada novo id é um UUIDv7 escrito na forma Uuid25, 25 dígitos minúsculos em base 36, como `03gzrxjv20bdlcak89q25d2m7`, pelo que os ids gerados por um editor, quando ordenados, ficam pela ordem em que este os criou. Um documento mantém os ids que contém, como os ids nanoid de uma versão anterior ou os ids de um ficheiro v2, pelo que nada deve depender do formato de um id.

A partir da `4.0.0`, nenhuma entidade tem um objeto `meta` (`createAt`, `updateAt`), e os tipos `EntityMeta` e `EntityType` foram removidos. Nada o escreve, a análise descarta o `meta` que um ficheiro mais antigo tenha e o JSON Schema recusa-o. Servia apenas para determinar quando fazer a recolha de lixo das entidades removidas, que também desapareceu.

### Definições {#settings}

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

`originX` e `originY` são a vista: o ponto do ecrã onde fica o ponto `(0, 0)` da cena.  
`zoomLevel` vai de `0.1` a `1.5`. Um documento guardado acima de `1` abre em `1` num editor anterior à `3.5.0`.  
A partir da `4.0.0`, as definições não têm `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` nem `ignoreSaveSettings`. Nada os escreve, o analisador não mantém nenhum deles e o JSON Schema recusa um ficheiro que ainda os tenha.

`canvasType` é o separador em que um documento abre. Um documento guardado no separador Visualização contém `'@dineug/erd-editor/builtin-visualization'`, mas não se estava a ser mostrado o modo `Graph` ou o modo `Flow`, e um editor acabado de criar mostra esse separador no modo `Graph`.  
A partir da `4.0.0`, enquanto o bloqueio `Canvas Type` está ativado, como acontece num documento novo, o documento mantém o separador que estava visível quando foi bloqueado, e mudar de separador deixa `value` como estava. Um bloqueio ativado no separador Definições mantém o separador de onde o leitor veio, e um `'settings'` bloqueado, que só uma edição manual pode escrever, abre em `'ERD'`.  
Nada do estado próprio do modo `Flow` é serializado — o posicionamento, o zoom, o deslocamento da vista, a apresentação das linhas e as tabelas focadas ficam no editor — pelo que `originX`, `originY` e `zoomLevel` descrevem sempre a tela ERD.

`show` e `lockSettings` são máscaras de bits — combine os sinalizadores com OR.  
`columnOrder` é um array que contém todos os sete valores de `ColumnType`, pela ordem de apresentação.  
`database`, `language`, `tableNameCase`, `columnNameCase` e `bracketType` contêm, cada um, exatamente um valor, e o JSON Schema rejeita um valor combinado.

O `show` de um documento novo é `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` e `relationship`.  
A partir da `3.10.0`, há mais dois sinalizadores de `show`, ambos desativados num documento novo e em todos os documentos guardados antes da `3.10.0`.  
`columnAlternateKey` (`512`) é a opção de vista [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Quando está ativo, marca as colunas de cada índice único sobre duas ou mais colunas como `AK1.1`, `AK1.2` e assim sucessivamente. Começa desativado, pelo que nenhum diagrama existente muda de largura.  
`hideReferentialAction` (`1024`) funciona ao contrário: quando está ativo, oculta as [etiquetas ON DELETE e ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) nos conectores, pelo que estas aparecem por predefinição. A opção de vista `Referential Actions` está marcada enquanto o sinalizador está desativado. Não altera o tamanho de nenhuma tabela.  
Um editor anterior à `3.10.0` mantém `show` como um número inteiro, pelo que os dois sinalizadores se mantêm quando se guarda nesse editor.

A partir da `4.0.0`, há mais dois sinalizadores de `show`, ambos desativados num documento novo e em todos os documentos guardados antes da `4.0.0`. Tal como `hideReferentialAction`, cada um oculta aquilo que nomeia, pelo que os grupos de tabelas e as notas aparecem por predefinição.  
`hideTableGroup` (`2048`) oculta os [grupos de tabelas](../../guide/guides/table-groups.md), e `hideMemo` (`4096`) oculta todas as notas. São as [opções de vista](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` e `Memos`, cada uma marcada enquanto o seu sinalizador está desativado. Nenhum deles altera o tamanho de qualquer tabela.  
Um editor anterior à `4.0.0` mantém `show` como um número inteiro, pelo que os dois sinalizadores se mantêm quando se guarda nesse editor.

A partir da `4.0.0`, `Language` tem mais oito destinos do [Gerador de código](../../guide/guides/code-generator.md), de `Mermaid` a `JSONSchema`. Um `language` que o analisador não conhece é lido como `GraphQL`, pelo que um editor anterior à `4.0.0` abre em GraphQL um documento guardado com um deles, e guardar nesse editor escreve GraphQL.

A partir da `4.0.0`, `lockSettings` ocupa o lugar de `ignoreSaveSettings`, e `LockSettingType` o de `SaveSettingType`, que foi removido. `lockSettings` indica as definições que um documento guarda tal como estavam quando foram bloqueadas. `viewport` abrange `originX`, `originY` e `zoomLevel` em conjunto, uma vez que uma origem guardada sem o respetivo zoom abre noutro sítio, e cada um dos outros bits abrange o campo com o mesmo nome. São as linhas [`Lock`](../../guide/guides/settings.md#lock) do separador Definições.  
Uma definição bloqueada é escrita com o seu valor bloqueado, seja o que for que o editor mostre, tanto por `value` como por `runtimeValue`, e todas as outras definições tal como estão. Assim, enquanto o bloqueio correspondente está ativado, deslocar a vista e fazer zoom, mudar de separador ou alterar a linguagem do Gerador de código, um formato do nome ou o tipo de delimitador deixa o ficheiro como estava. Bloquear fixa o valor que a definição tem nesse momento, e a análise obtém o valor bloqueado a partir do campo guardado.  
Um documento iniciado do zero — um novo editor ou armazenamento de replicação, ou um valor em branco passado a `value` ou a `setInitialValue()` — tem `lockSettings` definido como `63`, com todos os bloqueios ativados. Um documento cujas `settings` não têm `lockSettings` — todos os ficheiros guardados antes da `4.0.0`, seja qual for o seu `ignoreSaveSettings`, e todos os documentos v2 — abre também com todos os bloqueios ativados: a vista e o separador onde estão os de um documento novo (`originX` e `originY` a `0`, `zoomLevel` a `1`, o separador ERD), e a linguagem, os formatos dos nomes e o tipo de delimitador bloqueados nos valores que guardou. Um documento que indica os seus bloqueios mantém-nos, incluindo `0`, e todos os valores que guardou.  
A análise mantém todos os bits de `lockSettings`, incluindo os desconhecidos, pelo que um bloqueio que uma versão posterior acrescente se mantém quando se guarda aqui; o JSON Schema verifica apenas se é um número inteiro. Um editor anterior à `4.0.0` descarta `lockSettings` quando guarda e escreve a vista e o separador tal como estão, pelo que o ficheiro volta a abrir aqui como um ficheiro guardado antes da `4.0.0`.

A partir da `4.0.0`, `ddlScripts` contém os dois scripts do separador [Esquema SQL](../../guide/guides/schema-sql.md), que o DDL de todas as bases de dados escreve: `before` depois do cabeçalho e antes das tabelas, `after` a seguir ao DDL gerado. O DDL escreve cada um com quebras de linha LF, sem as linhas em branco iniciais nem os espaços em branco finais, e, no MSSQL, terminado com `GO`, como descreve [Scripts antes e depois das tabelas](../../guide/guides/schema-sql.md#before-and-after-scripts); o próprio `ddlScripts` mantém cada script tal como foi escrito. A chave só é escrita enquanto um dos scripts contém texto, e então com ambos; uma chave em falta, ou um script que não seja uma cadeia de caracteres, é lido como `''`. As escolhas `Statements`, `Header` e `Tables` do separador não são guardadas no documento.  
Um editor anterior à `4.0.0` descarta os scripts quando carrega um documento, pelo que estes se perdem quando se guarda nesse editor.

`Database`, `Language`, `Show`, `LockSettingType` e `ReferentialAction` só aceitam acréscimos no fim. Um documento guardado armazena o número, pelo que cada base de dados, destino de geração de código, sinalizador, bloqueio ou ação que se acrescente ocupa o bit seguinte em vez de uma posição no meio.

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

Cada lista é a ordem de um tipo de entidade, que o DDL, a ordenação das tabelas e a ordem de desenho leem. Na forma de armazenamento, cada lista contém apenas os ids das entidades mantidas, cada um uma só vez, pela ordem listada. A partir da `4.0.0`, `tableGroupIds` é a ordem dos grupos de tabelas.

A partir da `4.0.0`, a ordem de sobreposição não é guardada. A análise empilha cada tabela, nota e grupo de tabelas listado que não tenha `zIndex` segundo a sua posição na respetiva lista, com os posteriores à frente: os grupos de tabelas a partir de `1`, as tabelas a partir de `2` e as notas acima de todas as tabelas. Uma entidade que tenha um `zIndex`, como num valor em tempo de execução ou num ficheiro guardado antes da `4.0.0`, mantém-no. Por isso, o efeito de trazer uma tabela ou nota para a frente perde-se quando o ficheiro volta a ser aberto.

### Coleção: tableEntities {#collection-tableentities}

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

A partir da `4.0.0`, uma tabela tem `groupId`, o id do [grupo de tabelas](../../guide/guides/table-groups.md) a que pertence. Um `groupId` em falta ou vazio, ou um que não indique nenhum grupo em `doc.tableGroupIds`, significa nenhum grupo, e a forma de armazenamento só o escreve enquanto indica um grupo mantido.  
A análise inicializa `seqColumnIds` com `columnIds` quando está em falta ou não tem um id listado, e um editor volta a medir `widthName` e `widthComment` com os seus próprios tipos de letra a cada carregamento.

### Coleção: tableColumnEntities {#collection-tablecolumnentities}

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

A partir da `4.0.0`, a forma de armazenamento não escreve o `ui` das colunas. Cada carregamento deriva `keys`, a marca de chave primária a partir do bit `primaryKey` de `options` e a marca de chave externa a partir das relações que terminam na coluna, e mede as quatro larguras.  
Um editor anterior à `4.0.0` mostra as colunas de um ficheiro guardado aqui sem os respetivos ícones de chave primária.

### Coleção: relationshipEntities {#collection-relationshipentities}

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

A partir da `3.10.0`, uma relação tem `onDelete` e `onUpdate`, as suas [ações ON DELETE e ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Cada um contém exatamente um valor de `ReferentialAction`. `none`, o valor predefinido, não escreve nenhuma cláusula, pelo que se aplica a predefinição da própria base de dados. Os outros cinco correspondem a `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` e `RESTRICT`. O Esquema SQL só escreve uma cláusula para uma base de dados que aceite a respetiva ação.  
A forma de armazenamento escreve sempre ambos, e, a partir da `4.0.0`, o JSON Schema exige-os, verificando apenas se cada um é um número inteiro. A análise continua a ler como `none` um campo em falta, como em todos os documentos guardados antes da `3.10.0`, e o mesmo acontece com um valor fora da lista.  
Um editor anterior à `3.10.0` não conhece estes campos e descarta-os quando carrega um documento, pelo que se perdem todas as ações quando se guarda nesse editor.

A partir da `4.0.0`, cada carregamento deriva o que a forma de armazenamento deixa de fora. Uma relação é identificadora quando todas as colunas em que termina são chaves primárias, e o seu `startRelationshipType` é `dash` quando todas essas colunas são NOT NULL e `ring` caso contrário; uma relação sem nenhuma coluna final restante é não identificadora e `dash`, tal como começa uma relação nova. As âncoras, `x`, `y` e `direction`, são posicionadas de novo.

### Coleção: indexEntities {#collection-indexentities}

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

A análise inicializa `seqIndexColumnIds` com `indexColumnIds` quando está em falta ou não tem um id listado.

### Coleção: indexColumnEntities {#collection-indexcolumnentities}

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

### Coleção: memoEntities {#collection-memoentities}

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

A partir da `4.0.0`, as tabelas e as notas [partilham uma única pilha](../../guide/guides/table-related-functions.md#moving-multiple-tables) ordenada por `zIndex`, pelo que trazer uma tabela para a frente pode colocá-la sobre uma nota. A análise empilha uma nota guardada sem `zIndex` acima de todas as tabelas, como descreve [Doc](#doc). Uma nota num ficheiro guardado antes da `4.0.0` mantém o `zIndex` que guardou, que vinha do mesmo contador que o das tabelas, pelo que uma nota que uma versão anterior desenhou sobre todas as tabelas pode abrir por baixo de uma tabela trazida para a frente depois dela.

### Coleção: tableGroupEntities {#collection-tablegroupentities}

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

A partir da `4.0.0`, um documento pode conter [grupos de tabelas](../../guide/guides/table-groups.md): retângulos com nome e com cor desenhados atrás das tabelas. Uma tabela junta-se a um grupo através do seu próprio `groupId`, pelo que um grupo não contém nenhuma lista de membros. A forma de armazenamento escreve a coleção, tal como `doc.tableGroupIds`, apenas enquanto existe um grupo, e um documento sem ela, como um guardado antes da `4.0.0`, não tem grupos. `Show.hideTableGroup` oculta-os.  
Um editor anterior à `4.0.0` descarta os grupos e o `groupId` de todas as tabelas quando carrega um documento, pelo que se perdem todos os grupos quando se guarda nesse editor.

## JSON Schema {#json-schema}

O ficheiro de esquema canónico está publicado em [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) e pode ser referenciado diretamente com `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Coloque `$schema` no topo de um ficheiro `.erd.json` e os editores que entendem JSON Schema, como o VS Code, validam o documento e completam automaticamente os seus campos à medida que edita.

A partir da `4.0.0`, o esquema descreve apenas a forma de armazenamento. Cada objeto com campos nomeados é fechado (`additionalProperties: false`), cada campo que a forma de armazenamento escreve sempre é obrigatório e nenhum campo que esta deixa de fora é nomeado. Por isso, recusa o valor em tempo de execução. Recusa também um ficheiro guardado antes da `4.0.0`, com o seu `meta`, larguras, `zIndex`, `ignoreSaveSettings` e o resto, até que um editor da `4.0.0` ou posterior volte a guardar esse ficheiro. Um ficheiro guardado pela `3.2.0` ou posterior já indica o URL deste esquema, que aponta para o ramo `main`, pelo que um editor que valida com base nele assinala agora o ficheiro. Um ficheiro guardado pela `3.0.0` ou pela `3.1.0`, ou um documento v2, não indica nenhum `$schema`.

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
