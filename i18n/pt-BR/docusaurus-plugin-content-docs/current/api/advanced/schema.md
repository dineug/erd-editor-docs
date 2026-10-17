---
sidebar_position: 3
description: O formato de documento .erd.json — a forma de armazenamento que um arquivo contém e o valor em tempo de execução que um editor mantém, os tipos TypeScript, as constantes por trás de cada campo numérico e o JSON Schema publicado.
---

# Esquema

`.erd.json` é o formato de documento do editor. Leia esta página se precisar gerar, validar ou migrar um documento fora do editor.

A partir da `4.0.0`, um documento tem duas serializações, ambas com `version` `'3.0.0'`. A forma de armazenamento é o que um arquivo contém: é o que [`editor.value`](../erd-editor-element.md#value) retorna, o que a exportação JSON escreve e a única forma que o [JSON Schema](#json-schema) publicado aceita. O valor em tempo de execução é o documento inteiro como um editor o mantém, que [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) retorna. `setInitialValue()`, o setter `value` e `setSchemaJSON()` leem qualquer uma das formas, qualquer arquivo salvo por uma versão anterior e um documento `.vuerd` v2. Antes da `4.0.0`, havia só uma: `value` retornava o documento inteiro como o editor o mantinha, como `runtimeValue` faz agora.

## Forma de armazenamento e valor em tempo de execução {#storage-form-and-runtime-value}

A forma de armazenamento contém apenas as entidades ativas: cada tabela listada em `doc.tableIds`, as colunas que essas tabelas listam, os relacionamentos entre duas tabelas mantidas, os índices das tabelas mantidas, com as colunas de índice cuja coluna a tabela ainda lista, e as notas e os grupos de tabelas listados. Ela deixa de fora o que um editor deriva ao carregar ou mantém enquanto está aberto: as entidades removidas, `seqColumnIds` e `seqIndexColumnIds`, todo `zIndex`, as larguras medidas, o `ui` da coluna e o `identification`, o `startRelationshipType` e as âncoras de um relacionamento. Os tipos abaixo marcam cada um desses campos com `// runtime only`.  
Toda coleção usa o id como chave, em ordem de unidades de código, com as colunas agrupadas primeiro por `tableId` e as colunas de índice primeiro por `indexId`. Cada entidade escreve seus campos em uma ordem fixa, e o texto é indentado com dois espaços e termina com uma quebra de linha. Assim, o mesmo documento sempre escreve os mesmos bytes, uma edição altera apenas o que toca e um arquivo salvo em uma máquina com outras fontes é reaberto com o mesmo `value`.  
O VS Code, o Obsidian e o plugin para JetBrains só escrevem um arquivo quando uma edição altera `value`, então um arquivo salvo por uma versão anterior mantém sua forma antiga até a primeira edição.

O valor em tempo de execução mantém o que a forma de armazenamento deixa de fora: entidades removidas, sequências, z-indexes, larguras, marcas de chave, sinalizadores de relacionamento e âncoras. Ele é indentado com dois espaços, sem quebra de linha no final. Use-o apenas para inicializar um colaborador ou uma segunda exibição por meio de `setInitialValue()`, para que o desfazer de uma remoção que outro editor envia traga a entidade de volta inteira ali. Nunca o escreva em um arquivo; o JSON Schema o recusa. As entidades removidas não passam mais por coleta de lixo, então o valor em tempo de execução as mantém até a próxima vez que o documento for aberto a partir do seu arquivo.

As duas formas escrevem cada configuração bloqueada com seu valor bloqueado (consulte [`lockSettings`](#settings)), `settings.ddlScripts` apenas enquanto um script contém texto e o `groupId` de uma tabela apenas enquanto ele não está vazio. A forma de armazenamento escreve `doc.tableGroupIds` e `tableGroupEntities` apenas enquanto existe um grupo de tabelas; o valor em tempo de execução os escreve enquanto o documento contém um grupo ou um grupo removido.

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

Cada entidade tem como chave seu `id`, uma string opaca; a análise descarta uma entidade cujo `id` esteja ausente ou vazio. A partir da `4.0.0`, todo id novo é um UUIDv7 escrito na forma Uuid25, 25 dígitos minúsculos em base 36, como `03gzrxjv20bdlcak89q25d2m7`, então os ids que um editor gera, ao serem ordenados, ficam na ordem em que ele os criou. Um documento mantém os ids que já contém, como os ids nanoid de uma versão anterior ou os ids de um arquivo v2, então nada deve depender do formato de um id.

A partir da `4.0.0`, nenhuma entidade traz um objeto `meta` (`createAt`, `updateAt`), e os tipos `EntityMeta` e `EntityType` foram removidos. Nada o escreve, a análise descarta o `meta` que um arquivo mais antigo traz e o JSON Schema o recusa. Ele só servia para determinar o momento da coleta de lixo das entidades removidas, que também deixou de existir.

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

`originX` e `originY` são a área visível: o ponto da tela em que fica o ponto `(0, 0)` da cena.  
`zoomLevel` vai de `0.1` a `1.5`. Um documento salvo acima de `1` abre em `1` em um editor anterior à `3.5.0`.  
A partir da `4.0.0`, as configurações não trazem `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` nem `ignoreSaveSettings`. Nada os escreve, o parser não mantém nenhum deles e o JSON Schema recusa um arquivo que ainda os tenha.

`canvasType` é a aba em que um documento abre. Um documento salvo na aba Visualização contém `'@dineug/erd-editor/builtin-visualization'`, mas não se o modo `Graph` ou `Flow` estava sendo exibido, e um editor recém-criado mostra essa aba no modo `Graph`.  
A partir da `4.0.0`, enquanto o bloqueio `Canvas Type` está ativado, como em um documento novo, o documento mantém a aba que era exibida quando foi bloqueado, e trocar de aba deixa `value` como estava. Um bloqueio feito na aba Configurações guarda a aba de onde o usuário veio, e um `'settings'` bloqueado, que só uma edição manual pode escrever, abre em `'ERD'`.  
Nenhuma parte do estado próprio do modo `Flow` é serializada — seu posicionamento, zoom, deslocamento, exibição de linhas e tabelas em foco ficam no editor — então `originX`, `originY` e `zoomLevel` sempre descrevem o canvas ERD.

`show` e `lockSettings` são máscaras de bits — combine os sinalizadores com OR.  
`columnOrder` é um array com todos os sete valores de `ColumnType`, na ordem de exibição.  
`database`, `language`, `tableNameCase`, `columnNameCase` e `bracketType` contêm, cada um, exatamente um valor, e o JSON Schema rejeita um valor combinado.

O `show` de um documento novo é `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` e `relationship`.  
A partir da `3.10.0`, há mais dois sinalizadores de `show`, ambos desativados em um documento novo e em todo documento salvo antes da `3.10.0`.  
`columnAlternateKey` (`512`) é a opção de exibição [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Quando definido, marca as colunas de cada índice único de duas ou mais colunas como `AK1.1`, `AK1.2` e assim por diante. Ele começa desativado, então nenhum diagrama existente muda de largura.  
`hideReferentialAction` (`1024`) funciona ao contrário: quando definido, oculta os [rótulos ON DELETE e ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) nos conectores, então eles aparecem por padrão. A opção de exibição `Referential Actions` fica marcada enquanto o sinalizador está desativado. Ele não altera o tamanho de nenhuma tabela.  
Um editor anterior à `3.10.0` mantém `show` como um número inteiro, então os dois sinalizadores são preservados ao salvar nesse editor.

A partir da `4.0.0`, há mais dois sinalizadores de `show`, ambos desativados em um documento novo e em todo documento salvo antes da `4.0.0`. Assim como `hideReferentialAction`, cada um oculta o que nomeia, então grupos de tabelas e notas aparecem por padrão.  
`hideTableGroup` (`2048`) oculta os [grupos de tabelas](../../guide/guides/table-groups.md), e `hideMemo` (`4096`) oculta todas as notas. Eles correspondem às [opções de exibição](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` e `Memos`, cada uma marcada enquanto seu sinalizador está desativado. Nenhum dos dois altera o tamanho de nenhuma tabela.  
Um editor anterior à `4.0.0` mantém `show` como um número inteiro, então os dois sinalizadores são preservados ao salvar nesse editor.

A partir da `4.0.0`, `Language` tem mais oito destinos do [Gerador de código](../../guide/guides/code-generator.md), de `Mermaid` a `JSONSchema`. Um `language` que o parser não conhece é lido como `GraphQL`, então um editor anterior à `4.0.0` abre em GraphQL um documento salvo com um deles, e salvar nele escreve GraphQL.

A partir da `4.0.0`, `lockSettings` substitui `ignoreSaveSettings`, e `LockSettingType` substitui `SaveSettingType`, que foi removido. `lockSettings` indica as configurações que um documento salva como estavam quando foram bloqueadas. `viewport` abrange `originX`, `originY` e `zoomLevel` juntos, já que uma origem salva sem seu zoom abre em outro lugar, e cada um dos outros bits abrange o campo de mesmo nome. Estas são as linhas [`Lock`](../../guide/guides/settings.md#lock) da aba Configurações.  
Tanto `value` quanto `runtimeValue` escrevem uma configuração bloqueada com seu valor bloqueado, independentemente do que o editor mostre, e todas as outras configurações como estão. Assim, enquanto o bloqueio correspondente está ativado, rolar e aplicar zoom, trocar de aba ou alterar a linguagem do Gerador de código, um estilo de nome ou o tipo de delimitador deixa o arquivo como estava. Bloquear captura o valor que a configuração tem naquele momento, e a análise obtém o valor bloqueado do campo salvo.  
Um documento iniciado do zero — um novo editor ou armazenamento de replicação, ou um valor vazio passado para `value` ou `setInitialValue()` — tem `lockSettings` definido como `63`, com todos os bloqueios ativados. Um documento cujas `settings` não trazem `lockSettings` — todo arquivo salvo antes da `4.0.0`, qualquer que seja seu `ignoreSaveSettings`, e todo documento v2 — também abre com todos os bloqueios ativados: a área visível e a aba ficam onde ficam as de um documento novo (`originX` e `originY` em `0`, `zoomLevel` em `1`, a aba ERD), e a linguagem, os estilos de nome e o tipo de delimitador ficam bloqueados nos valores que ele salvou. Um documento que indica seus bloqueios os mantém, inclusive `0`, assim como todos os valores que salvou.  
A análise mantém todos os bits de `lockSettings`, inclusive os desconhecidos, então um bloqueio que uma versão posterior adicionar é preservado ao salvar aqui; o JSON Schema verifica apenas se ele é um inteiro. Um editor anterior à `4.0.0` descarta `lockSettings` ao salvar e escreve a área visível e a aba como estão, então o arquivo volta a abrir aqui como um arquivo salvo antes da `4.0.0`.

A partir da `4.0.0`, `ddlScripts` contém os dois scripts da aba [Esquema SQL](../../guide/guides/schema-sql.md), que o DDL de todo banco de dados escreve: `before` depois do cabeçalho e antes das tabelas, `after` depois do DDL gerado. O DDL escreve cada um com quebras de linha LF, sem as linhas em branco no início nem os espaços em branco no final, e, no MSSQL, terminado com `GO`, como descreve [Scripts antes e depois das tabelas](../../guide/guides/schema-sql.md#before-and-after-scripts); o próprio `ddlScripts` mantém cada script como foi digitado. A chave só é escrita enquanto um dos scripts contém texto, e então com os dois; uma chave ausente, ou um script que não seja uma string, é lido como `''`. As escolhas `Statements`, `Header` e `Tables` da aba não são salvas no documento.  
Um editor anterior à `4.0.0` descarta os scripts ao carregar um documento, então salvar nele os perde.

`Database`, `Language`, `Show`, `LockSettingType` e `ReferentialAction` só recebem acréscimos no final. Um documento salvo armazena o número, então um novo fornecedor, destino de geração de código, sinalizador, bloqueio ou ação ocupa o próximo bit em vez de uma posição no meio.

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

Cada lista é a ordem de um tipo de entidade, que o DDL, a ordenação das tabelas e a ordem de desenho leem. Na forma de armazenamento, cada lista contém apenas os ids das entidades mantidas, cada um uma única vez, na ordem listada. A partir da `4.0.0`, `tableGroupIds` é a ordem dos grupos de tabelas.

A partir da `4.0.0`, a ordem de empilhamento não é salva. A análise empilha cada tabela, nota e grupo de tabelas listado que não traga `zIndex` pela sua posição na lista, com os posteriores à frente: grupos de tabelas a partir de `1`, tabelas a partir de `2` e notas acima de todas as tabelas. Uma entidade que traz um `zIndex`, como em um valor em tempo de execução ou em um arquivo salvo antes da `4.0.0`, o mantém. Por isso, trazer uma tabela ou nota para a frente se perde quando o arquivo é reaberto.

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

A partir da `4.0.0`, uma tabela traz `groupId`, o id do [grupo de tabelas](../../guide/guides/table-groups.md) ao qual pertence. Um `groupId` ausente ou vazio, ou um que não indique nenhum grupo em `doc.tableGroupIds`, significa nenhum grupo, e a forma de armazenamento só o escreve enquanto ele indica um grupo mantido.  
A análise inicializa `seqColumnIds` com `columnIds` quando ele está ausente ou falta nele um id listado, e um editor mede `widthName` e `widthComment` novamente com suas próprias fontes a cada carregamento.

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

A partir da `4.0.0`, a forma de armazenamento não escreve o `ui` das colunas. Todo carregamento deriva `keys`, a marca de chave primária a partir do bit `primaryKey` de `options` e a marca de chave estrangeira a partir dos relacionamentos que terminam na coluna, e mede as quatro larguras.  
Um editor anterior à `4.0.0` mostra as colunas de um arquivo salvo aqui sem seus ícones de chave primária.

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

A partir da `3.10.0`, um relacionamento traz `onDelete` e `onUpdate`, suas [ações ON DELETE e ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Cada um contém exatamente um valor de `ReferentialAction`. `none`, o padrão, não escreve nenhuma cláusula, então vale o padrão do próprio banco de dados. Os outros cinco representam `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` e `RESTRICT`. O Esquema SQL só escreve uma cláusula para um banco de dados que aceite sua ação.  
A forma de armazenamento sempre escreve os dois, e, a partir da `4.0.0`, o JSON Schema os exige, verificando apenas se cada um é um inteiro. A análise ainda lê um campo ausente, como em todo documento salvo antes da `3.10.0`, como `none`, e o mesmo vale para um valor fora da lista.  
Um editor anterior à `3.10.0` não conhece esses campos e os descarta ao carregar um documento, então salvar nele perde todas as ações.

A partir da `4.0.0`, todo carregamento deriva o que a forma de armazenamento deixa de fora. Um relacionamento é identificador quando toda coluna em que ele termina é uma chave primária, e seu `startRelationshipType` é `dash` quando todas essas colunas são NOT NULL e `ring` caso contrário; um relacionamento sem nenhuma coluna final restante é não identificador e `dash`, como começa um relacionamento novo. As âncoras, `x`, `y` e `direction`, são posicionadas novamente.

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

A análise inicializa `seqIndexColumnIds` com `indexColumnIds` quando ele está ausente ou falta nele um id listado.

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

A partir da `4.0.0`, tabelas e notas [compartilham uma única pilha](../../guide/guides/table-related-functions.md#moving-multiple-tables) ordenada por `zIndex`, então trazer uma tabela para a frente pode colocá-la sobre uma nota. A análise empilha uma nota salva sem `zIndex` acima de todas as tabelas, como descreve [Doc](#doc). Uma nota em um arquivo salvo antes da `4.0.0` mantém o `zIndex` que salvou, que vinha do mesmo contador que o das tabelas, então uma nota que uma versão anterior desenhou sobre todas as tabelas pode abrir sob uma tabela trazida para a frente depois dela.

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

A partir da `4.0.0`, um documento pode conter [grupos de tabelas](../../guide/guides/table-groups.md): retângulos nomeados e coloridos desenhados atrás das tabelas. Uma tabela entra em um grupo por meio do seu próprio `groupId`, então um grupo não contém uma lista de membros. A forma de armazenamento escreve a coleção, assim como `doc.tableGroupIds`, apenas enquanto existe um grupo, e um documento sem ela, como um salvo antes da `4.0.0`, não tem grupos. `Show.hideTableGroup` os oculta.  
Um editor anterior à `4.0.0` descarta os grupos e o `groupId` de todas as tabelas ao carregar um documento, então salvar nele perde todos os grupos.

## JSON Schema {#json-schema}

O arquivo de esquema canônico é publicado em [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) e pode ser referenciado diretamente com `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Coloque `$schema` no topo de um arquivo `.erd.json`, e os editores que entendem JSON Schema, como o VS Code, validam o documento e completam automaticamente seus campos durante a edição.

A partir da `4.0.0`, o esquema descreve apenas a forma de armazenamento. Todo objeto com campos nomeados é fechado (`additionalProperties: false`), todo campo que a forma de armazenamento sempre escreve é obrigatório e nenhum campo que ela deixa de fora é nomeado. Por isso, ele recusa o valor em tempo de execução. Ele também recusa um arquivo salvo antes da `4.0.0`, com seu `meta`, larguras, `zIndex`, `ignoreSaveSettings` e o restante, até que um editor da `4.0.0` ou posterior salve esse arquivo novamente. Um arquivo salvo pela `3.2.0` ou posterior já indica a URL deste esquema, que aponta para o branch `main`, então um editor que valida com base nele agora sinaliza o arquivo. Um arquivo salvo pela `3.0.0` ou pela `3.1.0`, ou um documento v2, não indica nenhum `$schema`.

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
