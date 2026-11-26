---
sidebar_position: 4
description: O formato de documento .erd.json — a forma de armazenamento que um ficheiro contém, os seus tipos TypeScript, as constantes por detrás de cada campo numérico e o JSON Schema publicado.
---

# Esquema

`.erd.json` é o formato de documento do editor. Leia esta página se precisar de gerar, validar ou migrar um documento fora do editor.

Esta página descreve a forma de armazenamento, o documento tal como um ficheiro o contém, que todas as versões desde a `4.0.0` escrevem. É o que [`editor.value`](../erd-editor-element.md#value) devolve, o que a exportação JSON escreve e a única forma que o [JSON Schema](#json-schema) publicado aceita. A sua `version` é `'3.0.0'`, como em todos os ficheiros v3 guardados por uma versão anterior, pelo que `version` não distingue um ficheiro mais antigo de um mais recente. `setInitialValue()`, o setter `value` e `setSchemaJSON()` leem-na, assim como qualquer ficheiro guardado por uma versão anterior e um documento `.vuerd` v2. Antes da `4.0.0`, `value` devolvia o documento inteiro tal como o editor o mantinha, pelo que um ficheiro guardado nessa altura contém mais (consulte [Forma de armazenamento](#storage-form)).  
O [`runtimeValue`](../erd-editor-element.md#runtimevalue) de um editor é outra serialização, que esta página não descreve. Inicializa outro editor ou uma réplica, e uma [sala Yjs](./yjs.md#what-the-room-holds) guarda-o no seu instantâneo; nunca pertence a um ficheiro, e o JSON Schema recusa qualquer um que contenha uma entidade.

## Forma de armazenamento {#storage-form}

A forma de armazenamento contém apenas as entidades ativas: cada tabela listada em `doc.tableIds`, as colunas que essas tabelas listam, as relações entre duas tabelas mantidas, os índices das tabelas mantidas, com as colunas de índice cuja coluna a tabela ainda lista, as notas e os grupos de tabelas listados e, a partir da `4.2.0`, as palavras, os termos e os domínios das folhas do Dicionário que contêm um valor além do seu id. Não contém nada do que um editor calcula ao carregar ou mantém apenas enquanto está aberto: nem ordem de sobreposição, larguras medidas ou marcas de chave, nem se uma relação é identificadora, como é desenhada a sua extremidade pai ou onde se une às suas tabelas. Cada carregamento volta a calcular isto a partir do que o ficheiro contém.  
Cada coleção, exceto os dicionários, tem o id como chave, pela ordem das unidades de código, com as colunas agrupadas primeiro por `tableId` e as colunas de índice primeiro por `indexId`. A partir da `4.2.0`, `wordEntities`, `termEntities` e `domainEntities` vêm depois de todas as outras coleções, por esta ordem, cada uma escrita como um cabeçalho e linhas, cada linha numa linha de texto própria (consulte [Linhas dos dicionários](#dictionary-rows)). Cada entidade escreve os seus campos por uma ordem fixa, e o texto é indentado com dois espaços e termina com uma quebra de linha. Assim, o mesmo documento escreve sempre os mesmos bytes, uma edição altera apenas aquilo em que toca e um ficheiro guardado num computador com outros tipos de letra volta a abrir com o mesmo `value`.  
O VS Code, o Obsidian e o plugin para JetBrains só escrevem um ficheiro quando uma edição altera `value`, pelo que um ficheiro guardado por uma versão anterior mantém a sua forma antiga até à primeira edição.

A partir da `4.2.0`, a forma de armazenamento deixa também de fora o que não contém nada: cada campo de texto que uma entidade ou o seu `ui` contém como `''` (o `name`, o `comment` e o `ui.color` de uma tabela, o `name`, o `comment`, o `dataType` e o `default` de uma coluna, o `name` de um índice, o `value` e o `ui.color` de uma nota, o `name` e o `color` de um grupo de tabelas), cada lista de `doc` e cada coleção que não contém nenhuma entrada e o próprio `collections` quando todas as coleções estão vazias. O texto composto só por espaços em branco é escrito tal como está, exceto um nome lógico, que fica então de fora, e uma palavra, um termo ou um domínio cujos valores além do id estão todos vazios ou só contêm espaços em branco, que fica inteiramente de fora. Cada id, cada lista dentro de uma entidade e cada número, incluindo `0`, continuam a ser escritos. `doc` é sempre escrito, pelo que o ficheiro de um documento novo contém `$schema`, `version`, as suas definições e `"doc": {}`.  
A análise lê um campo de texto em falta como `''` e uma coleção em falta como vazia, como fazem todas as versões v3, e a forma de armazenamento só deixa de fora uma lista de `doc` enquanto a respetiva coleção não contém nada (consulte [Doc](#doc)). Assim, um editor anterior à `4.2.0` também abre estes ficheiros, e um programa que leia ele próprio um ficheiro tem de ler da mesma forma o que está em falta. Um ficheiro guardado por uma versão anterior volta da gravação seguinte com o texto, as listas e as coleções vazios deixados de fora, uma alteração feita uma só vez, e, a partir daí, é guardado sempre com os mesmos bytes.

A forma de armazenamento escreve cada definição bloqueada com o seu valor bloqueado (consulte [`lockSettings`](#settings)), `settings.ddlScripts` apenas enquanto um script contém texto e o `groupId` de uma tabela ou, a partir da `5.1.1`, de uma nota apenas enquanto indica um grupo de tabelas que o ficheiro escreve. A partir da `4.2.0`, escreve também `settings.nameViewMode` apenas enquanto o valor que escreve não é `'physical'`, `settings.columnOrder` em sete entradas sempre que possível (consulte [Definições](#settings)) e o `nameDerived` de uma tabela apenas enquanto é `true`.  
Escreve `doc.tableGroupIds` e `tableGroupEntities` apenas enquanto existe um grupo de tabelas, um `logicalName` apenas enquanto contém texto além de espaços em branco, o `domainId` de uma coluna apenas enquanto indica um domínio que o ficheiro escreve e cada dicionário apenas enquanto contém uma linha que o ficheiro escreve.

Um ficheiro guardado antes da `4.0.0` contém o documento inteiro tal como um editor o mantinha então, com as suas entidades removidas e o que cada carregamento calcula. Um carregamento lê-o, mantém o lugar de cada tabela e nota na pilha (consulte [Doc](#doc)) e volta a calcular o resto, e o guardar seguinte escreve apenas a forma de armazenamento.

## TypeScript {#typescript}

Os tipos descrevem a forma de armazenamento, e cada um lista os seus campos pela ordem em que um ficheiro os escreve. Um campo marcado com `?` é um que a forma de armazenamento pode deixar de fora, como detalha [Forma de armazenamento](#storage-form), e a análise lê um campo em falta como não contendo nada: `''`, `false`, nenhum grupo de tabelas nem domínio, uma coleção vazia, `'physical'` para `nameViewMode` e dois scripts vazios para `ddlScripts`. A exceção é uma lista de `doc` em falta, que a análise preenche a partir da sua coleção (consulte [Doc](#doc)). Numa linha de dicionário, `?` marca os valores antes dos quais uma linha pode terminar (consulte [Linhas dos dicionários](#dictionary-rows)). Todos os outros campos são sempre escritos.

### ERDEditorSchemaV3 {#erdeditorschemav3}

```ts
type ERDEditorSchemaV3 = {
  $schema: 'https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json';
  version: '3.0.0';
  settings: Settings;
  doc: Doc;
  collections?: {
    tableEntities?: Record<string, Table>;
    tableColumnEntities?: Record<string, Column>;
    relationshipEntities?: Record<string, Relationship>;
    indexEntities?: Record<string, Index>;
    indexColumnEntities?: Record<string, IndexColumn>;
    memoEntities?: Record<string, Memo>;
    tableGroupEntities?: Record<string, TableGroup>;
    wordEntities?: DictionaryRows; // rows of Word
    termEntities?: DictionaryRows; // rows of Term
    domainEntities?: DictionaryRows; // rows of Domain
  };
};
```

Cada entidade tem um `id`, uma cadeia de caracteres opaca, que lhe serve de chave na respetiva coleção, exceto nos três dicionários, onde é o primeiro valor de uma linha. A partir da `4.2.0`, quando o `id` de uma entidade das sete coleções com chave está em falta, está vazio ou não é uma cadeia de caracteres, a análise lê-a pela chave em que está guardada, e descarta uma entrada que não seja um objeto, ou uma sem id cuja chave seja `''`. Uma linha de um dicionário é descartada quando não é um array ou quando o seu `id` não é uma cadeia de caracteres diferente de `''`. Um editor anterior à `4.2.0` descarta uma entidade cujo `id` esteja em falta ou vazio, pelo que a forma de armazenamento continua a escrever todos os ids.  
A partir da `4.0.0`, cada novo id, incluindo o de uma linha de um dicionário, é um UUIDv7 escrito na forma Uuid25, 25 dígitos minúsculos em base 36, como `03gzrxjv20bdlcak89q25d2m7`, pelo que os ids gerados por um editor, quando ordenados, ficam pela ordem em que este os criou. Um documento mantém os ids que contém, como os ids nanoid de uma versão anterior ou os ids de um ficheiro v2, pelo que nada deve depender do formato de um id.

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

`originX` e `originY` são a vista: o ponto do ecrã onde fica o ponto `(0, 0)` da cena.  
`zoomLevel` vai de `0.1` a `1.5`. Um documento guardado acima de `1` abre em `1` num editor anterior à `3.5.0`.  
A partir da `4.0.0`, as definições não têm `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` nem `ignoreSaveSettings`. Nada os escreve, o analisador não mantém nenhum deles e o JSON Schema recusa um ficheiro que ainda os tenha.

`canvasType` é o separador em que um documento abre. Um documento guardado no separador Visualização contém `'@dineug/erd-editor/builtin-visualization'`, mas não se estava a ser mostrado o modo `Graph` ou o modo `Flow`, e um editor acabado de criar mostra esse separador no modo `Graph`.  
A partir da `4.0.0`, enquanto o bloqueio `Canvas Type` está ativado, como acontece num documento novo, o documento mantém o separador que estava visível quando foi bloqueado, e mudar de separador deixa `value` como estava. Um bloqueio ativado no separador Definições mantém o separador de onde o leitor veio, e um `'settings'` bloqueado, que só uma edição manual pode escrever, abre em `'ERD'`.  
A partir da `4.2.0`, `canvasType` também pode ser `'@dineug/erd-editor/builtin-dictionary'`, o separador [Dicionário](../../guide/guides/dictionary.md), que o bloqueio `Canvas Type` mantém tal como mantém os outros. Um editor anterior à `4.2.0` mantém esse valor, mas não mostra nenhum separador por baixo da barra de ferramentas até o leitor escolher um.  
Nada do estado próprio do modo `Flow` é serializado: o posicionamento, o zoom, o deslocamento da vista, a apresentação das linhas e as tabelas focadas ficam no editor e, a partir da `4.2.0`, o mesmo acontece com as vistas que [`Previous table` e `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table) percorrem. Assim, `originX`, `originY` e `zoomLevel` descrevem sempre a tela ERD.

`show` e `lockSettings` são máscaras de bits — combine os sinalizadores com OR.  
`columnOrder` é um array que contém cada valor de `ColumnType` uma vez, pela ordem de apresentação; a partir da `4.2.0`, um documento pode escrevê-lo com sete dos nove, como descreve o parágrafo sobre a ordem das colunas mais abaixo.  
`database`, `language`, `tableNameCase`, `columnNameCase` e `bracketType` contêm, cada um, exatamente um valor, e o JSON Schema rejeita um valor combinado.

O `show` de um documento novo é `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` e `relationship`.  
A partir da `3.10.0`, há mais dois sinalizadores de `show`, ambos desativados num documento novo e em todos os documentos guardados antes da `3.10.0`.  
`columnAlternateKey` (`512`) é a opção de vista [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Quando está ativo, marca as colunas de cada índice único sobre duas ou mais colunas como `AK1.1`, `AK1.2` e assim sucessivamente. Começa desativado, pelo que nenhum diagrama existente muda de largura.  
`hideReferentialAction` (`1024`) funciona ao contrário: quando está ativo, oculta as [etiquetas ON DELETE e ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) nos conectores, pelo que estas aparecem por predefinição. A opção de vista `Referential Actions` está marcada enquanto o sinalizador está desativado. Não altera o tamanho de nenhuma tabela.  
Um editor anterior à `3.10.0` mantém `show` como um número inteiro, pelo que os dois sinalizadores se mantêm quando se guarda nesse editor.

A partir da `4.0.0`, há mais dois sinalizadores de `show`, ambos desativados num documento novo e em todos os documentos guardados antes da `4.0.0`. Tal como `hideReferentialAction`, cada um oculta aquilo que nomeia, pelo que os grupos de tabelas e as notas aparecem por predefinição.  
`hideTableGroup` (`2048`) oculta os [grupos de tabelas](../../guide/guides/table-groups.md), e `hideMemo` (`4096`) oculta todas as notas. São as [opções de vista](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` e `Memos`, cada uma marcada enquanto o seu sinalizador está desativado. Nenhum deles altera o tamanho de qualquer tabela.  
Um editor anterior à `4.0.0` mantém `show` como um número inteiro, pelo que os dois sinalizadores se mantêm quando se guarda nesse editor.

A partir da `4.2.0`, há mais um sinalizador de `show`, `columnDomain` (`8192`), desativado num documento novo e em todos os documentos guardados antes da `4.2.0`, pelo que o `show` de um documento novo continua a ser `431`. É a [opção de vista](../../guide/guides/table-related-functions.md#table-view-options) `Domain`: quando está ativo, cada linha de coluna mostra uma [célula Domínio](../../guide/guides/logical-names.md#the-domain-cell), o que alarga as tabelas. Começa desativado, pelo que nenhum diagrama existente muda de largura.  
Um editor anterior à `4.2.0` mantém `show` como um número inteiro, pelo que o sinalizador se mantém quando se guarda nesse editor.

A partir da `4.2.0`, `ColumnType` tem nove valores. `columnLogicalName` (`128`) posiciona a célula do nome lógico, que uma linha de coluna só desenha na vista `Both Names`, e `columnDomain` (`256`) a célula Domínio. São as linhas `Logical Name` e `Domain` da [ordem das colunas](../../guide/guides/settings.md#adjusting-column-order) do separador Definições. Um editor mantém uma ordem com os nove, e a de um documento novo é `128, 1, 2, 256, 4, 8, 16, 32, 64`.  
A forma de armazenamento escreve a ordem em sete entradas, deixando de fora `128` e `256`, enquanto `128` estiver imediatamente antes de `columnName` e `256` imediatamente depois de `columnDataType`. Assim, um documento novo continua a escrever `1, 2, 4, 8, 16, 32, 64`, e um ficheiro cuja ordem nunca os moveu mantém os seus bytes. Caso contrário, escreve os nove.  
A análise coloca os dois numa ordem de sete entradas nesses lugares, seja qual for a ordem dos sete, e aceita tal como estão nove entradas que contenham todos os tipos.  
A partir da `5.0.0` aceita também qualquer outra ordem. Mantém uma só vez cada `ColumnType` que conhece, pela ordem dada, e descarta todas as outras entradas: um valor que nenhum `ColumnType` nomeia, como um tipo que uma versão posterior acrescente, e uma segunda entrada do mesmo tipo. Cada tipo que falta na ordem fica imediatamente depois do tipo mais próximo que, na ordem predefinida, vem antes dele e que a ordem contém ou, não havendo nenhum antes, imediatamente antes do mais próximo que vem depois, que é como `128` e `256` encontram o seu lugar em sete entradas. Só uma ordem que não nomeia nenhum tipo que conheça, ou um valor que não é um array, é lida como a ordem predefinida.  
Assim, um ficheiro guardado por uma versão posterior abre com a sua ordem dos tipos que esta versão conhece, e uma gravação aqui escreve essa ordem sem os outros. Antes da `5.0.0`, uma análise lia qualquer outra ordem como a predefinida, pelo que um ficheiro assim abria com a ordem das colunas reposta. O JSON Schema aceita sete ou nove números inteiros.

A partir da `4.0.0`, `Language` tem mais oito destinos do [Gerador de código](../../guide/guides/code-generator.md), de `Mermaid` a `JSONSchema`. Um `language` que o analisador não conhece é lido como `GraphQL`, pelo que um editor anterior à `4.0.0` abre em GraphQL um documento guardado com um deles, e guardar nesse editor escreve GraphQL.

A partir da `4.0.0`, `lockSettings` ocupa o lugar de `ignoreSaveSettings`, e `LockSettingType` o de `SaveSettingType`, que foi removido. `lockSettings` indica as definições que um documento guarda tal como estavam quando foram bloqueadas. `viewport` abrange `originX`, `originY` e `zoomLevel` em conjunto, uma vez que uma origem guardada sem o respetivo zoom abre noutro sítio, e cada um dos outros bits abrange o campo com o mesmo nome. São as linhas [`Lock`](../../guide/guides/settings.md#lock) do separador Definições.  
Um ficheiro contém cada definição bloqueada com o seu valor bloqueado, seja o que for que o editor mostre, e todas as outras definições tal como estão. Assim, enquanto o bloqueio correspondente está ativado, deslocar a vista e fazer zoom, mudar de separador, alterar a linguagem do Gerador de código, um formato do nome ou o tipo de delimitador, ou mudar a vista de nomes deixa o ficheiro como estava. Bloquear fixa o valor que a definição tem nesse momento, e a análise obtém o valor bloqueado a partir do campo guardado.  
Um documento iniciado do zero — um novo editor ou armazenamento de replicação, ou um valor em branco passado a `value` ou a `setInitialValue()` — tem `lockSettings` definido como `63`, com todos os bloqueios ativados. Um documento cujas `settings` não têm `lockSettings` — todos os ficheiros guardados antes da `4.0.0`, seja qual for o seu `ignoreSaveSettings`, e todos os documentos v2 — abre também com todos os bloqueios ativados: a vista e o separador onde estão os de um documento novo (`originX` e `originY` a `0`, `zoomLevel` a `1`, o separador ERD), e a linguagem, os formatos dos nomes e o tipo de delimitador bloqueados nos valores que guardou. Um documento que indica os seus bloqueios mantém-nos, incluindo `0`, e todos os valores que guardou.  
A análise mantém todos os bits de `lockSettings`, incluindo os desconhecidos, pelo que um bloqueio que uma versão posterior acrescente se mantém quando se guarda aqui; o JSON Schema verifica apenas se é um número inteiro. Um editor anterior à `4.0.0` descarta `lockSettings` quando guarda e escreve a vista e o separador tal como estão, pelo que o ficheiro volta a abrir aqui como um ficheiro guardado antes da `4.0.0`.

A partir da `4.2.0`, há um sétimo bloqueio, `unlockNameViewMode` (`64`), a linha `Name View`, que abrange `nameViewMode`. O seu bit lê-se ao contrário dos outros bits de bloqueio, tal como os bits de ocultação de `Show`: quando está ativo, a vista de nomes está desbloqueada, e quando está desativado, bloqueada. Assim, `63` continua a significar todos os bloqueios ativados, e um documento novo contém esse valor com a vista de nomes bloqueada em `'physical'`. Um ficheiro guardado antes da `4.2.0` tem o bit desativado, sejam quais forem os seus outros bloqueios, incluindo `0`, pelo que abre com a vista de nomes bloqueada em `'physical'`. Um documento com todos os bloqueios desativados contém `64`, e um com todos os outros bloqueios ativados e a vista de nomes desbloqueada contém `127`. Teste este bloqueio de forma invertida: está ativado enquanto `(lockSettings & 64) === 0`.  
Enquanto o bit está desativado, um ficheiro contém `nameViewMode` com a vista bloqueada, seja o que for que qualquer editor mostre, e enquanto está ativado, a vista tal como está. O que cada editor mostra, com o bloqueio ativado ou desativado, é descrito em [`Lock`](../../guide/guides/settings.md#lock).  
Um editor da `4.0.0` ou da `4.1.0` mantém o bit ao guardar, mas descarta `nameViewMode`, pelo que o documento volta a abrir aqui em `'physical'`, com o bloqueio como estava.

A partir da `4.0.0`, `ddlScripts` contém os dois scripts do separador [Esquema SQL](../../guide/guides/schema-sql.md), que o DDL de todas as bases de dados escreve: `before` depois do cabeçalho e antes das tabelas, `after` a seguir ao DDL gerado. O DDL escreve cada um com quebras de linha LF, sem as linhas em branco iniciais nem os espaços em branco finais, e, no MSSQL, terminado com `GO`, como descreve [Scripts antes e depois das tabelas](../../guide/guides/schema-sql.md#before-and-after-scripts); o próprio `ddlScripts` mantém cada script tal como foi escrito. A chave só é escrita enquanto um dos scripts contém texto, e então com ambos; uma chave em falta, ou um script que não seja uma cadeia de caracteres, é lido como `''`. As escolhas `Statements`, `Header` e `Tables` do separador e, a partir da `4.2.0`, o seu interruptor [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) não são guardados no documento.  
Um editor anterior à `4.0.0` descarta os scripts quando carrega um documento, pelo que estes se perdem quando se guarda nesse editor.

A partir da `4.2.0`, `nameViewMode` é a [vista de nomes](../../guide/guides/logical-names.md#name-view), os nomes que o diagrama desenha: `'physical'` o nome de cada tabela e coluna, `'logical'` o seu nome lógico no lugar do nome e `'both'` o nome lógico e o nome. Os menus chamam-lhes `Physical Names`, `Logical Names` e `Both Names`. A forma de armazenamento escreve-o em último lugar, depois de `ddlScripts`, e apenas enquanto o valor que escreve não é `'physical'`. Um valor em falta, ou um que o analisador não conheça, é lido como `'physical'`, e o JSON Schema aceita apenas `"logical"` e `"both"`.  
Um editor anterior à `4.2.0` descarta `nameViewMode` quando carrega um documento.

`Database`, `Language`, `Show`, `ColumnType`, `ColumnOption`, `LockSettingType` e `ReferentialAction` só aceitam acréscimos no fim. Um documento guardado armazena o número, pelo que cada base de dados, destino de geração de código, sinalizador, tipo de coluna, opção de coluna, bloqueio ou ação que se acrescente ocupa o bit seguinte em vez de uma posição no meio.

### Doc {#doc}

```ts
type Doc = {
  tableIds?: string[];
  relationshipIds?: string[];
  indexIds?: string[];
  memoIds?: string[];
  tableGroupIds?: string[];
};
```

Cada lista é a ordem de um tipo de entidade, que o DDL, a ordenação das tabelas e a ordem de desenho leem. Cada uma contém apenas os ids das entidades que o ficheiro escreve, cada um uma só vez, pela ordem listada, e, a partir da `4.2.0`, uma lista que não contenha nenhum fica de fora. A partir da `4.0.0`, `tableGroupIds` é a ordem dos grupos de tabelas. Os dicionários não têm aqui nenhuma lista, uma vez que as suas linhas estão pela ordem de cada folha (consulte [Linhas dos dicionários](#dictionary-rows)), e o JSON Schema não aceita nenhuma outra chave em `doc`.

A partir da `4.2.0`, a análise lê uma lista que o documento deixa de fora, ou que contém como algo que não seja um array, como todas as entradas que a sua coleção contém, cada id uma só vez, pela ordem em que estão; um array vazio continua vazio, e todas as entradas da sua coleção são então lidas como removidas. Um editor anterior à `4.2.0` lê uma lista em falta como vazia, pelo que a forma de armazenamento continua a escrever cada lista sempre que a respetiva coleção contém uma entidade.

A partir da `4.0.0`, um ficheiro não contém ordem de sobreposição. Um carregamento empilha as tabelas e as notas listadas segundo as suas posições nas respetivas listas, com as posteriores à frente e todas as notas acima de todas as tabelas, e os grupos de tabelas da mesma forma entre si, atrás das tabelas. Uma tabela ou nota num ficheiro guardado antes da `4.0.0` tem um `zIndex` no seu `ui`, que um carregamento mantém como o seu lugar na pilha e que o guardar seguinte deixa de fora. Por isso, o efeito de trazer uma tabela ou nota para a frente perde-se quando o ficheiro volta a ser aberto.

### Coleção: tableEntities {#collection-tableentities}

```ts
type Table = {
  id: string;
  name?: string;
  logicalName?: string;
  comment?: string;
  columnIds: string[];
  groupId?: string;
  nameDerived?: true;
  ui: TableUI;
};

type TableUI = {
  x: number;
  y: number;
  color?: string;
};
```

A partir da `4.0.0`, uma tabela tem `groupId`, o id do [grupo de tabelas](../../guide/guides/table-groups.md) a que pertence. Um `groupId` em falta ou vazio, ou um que não indique nenhum grupo em `doc.tableGroupIds`, significa nenhum grupo, e a forma de armazenamento só o escreve enquanto indica um grupo mantido.

A partir da `4.2.0`, uma tabela tem `logicalName`, o nome que as [vistas](../../guide/guides/logical-names.md#name-view) `Logical Names` e `Both Names` desenham, `''` se não tiver nenhum, e `nameDerived`, `true` enquanto o `name` tiver sido [derivado](../../guide/guides/dictionary.md#deriving-physical-names) pelos dicionários a partir do nome lógico. Enquanto está ativo, um novo nome lógico volta a derivar o nome; enquanto não está, o nome foi escrito por alguém, e um novo nome lógico deixa-o como está, a não ser que o nome esteja vazio ou só tenha espaços em branco. Uma mudança de nome à mão desativa-o, e [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) reescreve até um nome que alguém escreveu e ativa-o onde quer que exista um nome lógico.  
A forma de armazenamento escreve `logicalName` depois de `name`, tal como foi escrito, apenas enquanto contém texto além de espaços em branco, e `nameDerived` depois de `groupId` apenas enquanto é `true`, o único valor que o JSON Schema aceita. Um `logicalName` em falta é lido como `''` e um `nameDerived` em falta como `false`, pelo que todos os nomes de um ficheiro guardado antes da `4.2.0` contam como escritos por alguém.  
Um editor anterior à `4.2.0` descarta ambos quando carrega um documento, pelo que se perde o nome lógico de todas as tabelas quando se guarda nesse editor.

### Coleção: tableColumnEntities {#collection-tablecolumnentities}

```ts
type Column = {
  id: string;
  tableId: string;
  name?: string;
  comment?: string;
  dataType?: string;
  default?: string;
  options: number; // Constants: ColumnOption
  logicalName?: string;
  domainId?: string;
};

// Constants
const ColumnOption = {
  autoIncrement: 1,
  primaryKey: 2,
  unique: 4,
  notNull: 8,
  nameDerived: 16,
} as const;
```

A partir da `4.0.0`, um ficheiro não contém marcas de chave: cada carregamento marca uma coluna como chave primária a partir do bit `primaryKey` de `options`, e como chave externa enquanto uma relação termina nela na sua tabela.  
Um editor anterior à `4.0.0` mostra as colunas de um ficheiro guardado aqui sem os respetivos ícones de chave primária.

A partir da `4.2.0`, uma coluna tem `logicalName`, tal como uma tabela, e `domainId`, o id do domínio a que está vinculada, `''` se não tiver nenhum. As edições num editor mantêm uma coluna vinculada no tipo de dados do seu domínio, como descreve [Domínios e tipos de dados](../../guide/guides/dictionary.md#domains-and-data-types). No entanto, a análise não muda o tipo de nenhuma coluna, pelo que um ficheiro escrito noutro sítio pode deixar uma coluna vinculada com outro tipo, e o mesmo podem fazer as edições cruzadas de dois colaboradores; a folha Verificações lista cada caso como [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds). A análise limpa um `domainId` que não indique nenhum domínio que o ficheiro contenha. Depois de `options`, a forma de armazenamento escreve `logicalName` segundo a regra de uma tabela, e `domainId` apenas enquanto indica um domínio que o ficheiro escreve, pelo que uma coluna vinculada a um domínio removido, ou a um que o ficheiro deixa de fora, é escrita sem o vínculo e com o tipo de dados que contém.  
`ColumnOption.nameDerived` (`16`) é o sinalizador de nome derivado da coluna, mantido em `options` com os outros bits e com o mesmo significado que o `nameDerived` de uma tabela. Uma chave primária não nula cujo nome os dicionários derivaram, por exemplo, tem `options` `26`.  
Um editor anterior à `4.2.0` descarta `logicalName` e `domainId` quando carrega um documento, pelo que estes se perdem quando se guarda nesse editor. Mantém `options` como um número inteiro, pelo que o bit `nameDerived` se mantém quando se guarda nesse editor.

### Coleção: relationshipEntities {#collection-relationshipentities}

```ts
type Relationship = {
  id: string;
  relationshipType: number; // Constants: RelationshipType
  onDelete: number; // Constants: ReferentialAction
  onUpdate: number; // Constants: ReferentialAction
  start: RelationshipPoint;
  end: RelationshipPoint;
};

type RelationshipPoint = {
  tableId: string;
  columnIds: string[];
};

// Constants
const RelationshipType = {
  ZeroOne: 2,
  ZeroN: 4,
  OneOnly: 8,
  OneN: 16,
} as const;

const ReferentialAction = {
  none: 1,
  noAction: 2,
  cascade: 4,
  setNull: 8,
  setDefault: 16,
  restrict: 32,
} as const;
```

A partir da `3.10.0`, uma relação tem `onDelete` e `onUpdate`, as suas [ações ON DELETE e ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Cada um contém exatamente um valor de `ReferentialAction`. `none`, o valor predefinido, não escreve nenhuma cláusula, pelo que se aplica a predefinição da própria base de dados. Os outros cinco correspondem a `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` e `RESTRICT`. O Esquema SQL só escreve uma cláusula para uma base de dados que aceite a respetiva ação.  
A forma de armazenamento escreve sempre ambos, e, a partir da `4.0.0`, o JSON Schema exige-os, verificando apenas se cada um é um número inteiro. A análise continua a ler como `none` um campo em falta, como em todos os documentos guardados antes da `3.10.0`, e o mesmo acontece com um valor fora da lista.  
Um editor anterior à `3.10.0` não conhece estes campos e descarta-os quando carrega um documento, pelo que se perdem todas as ações quando se guarda nesse editor.

A partir da `4.0.0`, cada carregamento lê se uma relação é identificadora, e como é desenhada a sua extremidade pai, a partir das colunas em que termina que a tabela filha ainda lista. É identificadora, uma linha contínua, enquanto todas essas colunas são chaves primárias, e a sua extremidade pai são duas barras enquanto todas essas colunas são NOT NULL, um círculo e uma barra caso contrário. Uma relação sem nenhuma dessas colunas é não identificadora, com duas barras, tal como começa uma relação nova. Consulte [Como ler um conector](../../guide/guides/relationship-editing.md#reading-a-connector).

### Coleção: indexEntities {#collection-indexentities}

```ts
type Index = {
  id: string;
  name?: string;
  tableId: string;
  indexColumnIds: string[];
  unique: boolean;
};
```

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
  value?: string;
  groupId?: string;
  ui: MemoUI;
};

type MemoUI = {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
};
```

A partir da `4.0.0`, as tabelas e as notas [partilham uma única pilha](../../guide/guides/table-related-functions.md#moving-multiple-tables), pelo que trazer uma tabela para a frente pode colocá-la sobre uma nota. Um carregamento coloca todas as notas acima de todas as tabelas, como descreve [Doc](#doc). Uma nota num ficheiro guardado antes da `4.0.0` mantém o `zIndex` que guardou, que vinha do mesmo contador que o das tabelas, pelo que uma nota que uma versão anterior desenhou sobre todas as tabelas pode abrir por baixo de uma tabela trazida para a frente depois dela.

A partir da `5.1.1`, uma nota tem `groupId`, o id do [grupo de tabelas](../../guide/guides/table-groups.md) a que pertence, tal como uma tabela. Um `groupId` em falta ou vazio, como em todos os ficheiros guardados antes da `5.1.1`, ou um que não indique nenhum grupo em `doc.tableGroupIds`, significa nenhum grupo, e a forma de armazenamento só o escreve enquanto indica um grupo mantido.  
Um editor anterior à `5.1.1` descarta o `groupId` de todas as notas quando carrega um documento, pelo que guardar nesse editor tira todas as notas do seu grupo, embora um da `4.0.0` em diante mantenha os grupos das tabelas — consulte [Misturar versões](./collaborative-editing.md#mixing-releases).

### Coleção: tableGroupEntities {#collection-tablegroupentities}

```ts
type TableGroup = {
  id: string;
  name?: string;
  color?: string;
  ui: TableGroupUI;
};

type TableGroupUI = {
  x: number;
  y: number;
  width: number;
  height: number;
};
```

A partir da `4.0.0`, um documento pode conter [grupos de tabelas](../../guide/guides/table-groups.md): retângulos com nome e com cor desenhados atrás das tabelas e das notas. Uma tabela, e a partir da `5.1.1` uma nota, junta-se a um grupo através do seu próprio `groupId`, pelo que um grupo não contém nenhuma lista de membros. A forma de armazenamento escreve a coleção, tal como `doc.tableGroupIds`, apenas enquanto existe um grupo, e um documento sem ela, como um guardado antes da `4.0.0`, não tem grupos. `Show.hideTableGroup` oculta-os.  
Um editor anterior à `4.0.0` descarta os grupos e o `groupId` de todas as tabelas quando carrega um documento, pelo que se perdem todos os grupos quando se guarda nesse editor.

### Linhas dos dicionários {#dictionary-rows}

A partir da `4.2.0`, um documento contém três dicionários, as folhas `Words`, `Terms` e `Domains` do separador [Dicionário](../../guide/guides/dictionary.md), em `wordEntities`, `termEntities` e `domainEntities`. Todos os campos de uma palavra, de um termo ou de um domínio são cadeias de caracteres, e nenhum deles tem `ui`. A folha `Checks` é calculada a partir dos dicionários e do diagrama, e não é guardada.

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

Nenhum dos três tem o id como chave. Cada um é escrito como um cabeçalho e linhas: `fields` indica os campos da entidade uma vez, com o id em primeiro lugar, e cada linha contém os valores de uma entidade por essa ordem. Os tipos abaixo listam os campos de cada entidade por essa ordem. Uma linha mantém sempre o seu id e o seu nome, mas os valores vazios finais depois do nome ficam de fora, pelo que um valor vazio antes de um que se mantém continua a ser `''`, e a análise lê como `''` um valor que falte numa linha. Cada linha é escrita numa linha de texto própria como JSON compacto, como nestas duas palavras de um ficheiro:

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

A forma de armazenamento escreve as linhas de cada folha pela ordem da folha, sem campo de ordem, pelo que as linhas de um ficheiro são os membros de um dicionário e a sua ordem. Deixa de fora uma linha cujos valores além do id estão todos vazios ou só contêm espaços em branco, como uma que foi adicionada e nunca preenchida, ou que foi esvaziada, e todos os vínculos a um domínio desses ou a um removido: o `domainId` de uma coluna fica de fora, e o de um termo é escrito como `''`, ficando o próprio termo de fora se não contiver mais nada.  
A análise lê as linhas pela ordem em que estão, pelo que cada folha as lista pela ordem em que o ficheiro as escreveu.  
Um documento sem os dicionários, como um guardado antes da `4.2.0`, não tem nenhum. Um editor anterior à `4.2.0` descarta os três quando carrega um documento, pelo que se perdem todas as palavras, todos os termos e todos os domínios quando se guarda nesse editor.

### Coleção: wordEntities {#collection-wordentities}

```ts
type Word = {
  id: string;
  name: string;
  abbreviation?: string;
  englishName?: string;
  description?: string;
  synonyms?: string;
  forbiddenWords?: string;
};
```

Uma palavra é uma das palavras de que um nome lógico é feito, e `abbreviation` é o que a representa num nome físico. `synonyms` lista outras grafias da palavra, e `forbiddenWords` palavras que não podem ser usadas no seu lugar, cada uma com os valores separados por vírgulas.

### Coleção: termEntities {#collection-termentities}

```ts
type Term = {
  id: string;
  name: string;
  physicalName?: string;
  domainId?: string;
  description?: string;
  synonyms?: string;
};
```

Um termo é um nome lógico completo. Uma tabela ou coluna cujo `logicalName` corresponda a `name` deriva `physicalName` ou, enquanto este estiver vazio, um nome composto a partir das abreviaturas das palavras, e uma coluna recebe também o domínio que `domainId` indica, `''` se não houver nenhum (consulte [Derivar nomes físicos](../../guide/guides/dictionary.md#deriving-physical-names)). `synonyms` é separado por vírgulas. A análise limpa um `domainId` que não indique nenhum domínio que o ficheiro contenha, tal como numa coluna.

### Coleção: domainEntities {#collection-domainentities}

```ts
type Domain = {
  id: string;
  name: string;
  category?: string;
  dataType?: string;
  description?: string;
};
```

Um domínio é um tipo de dados com nome, que `dataType` contém tal como uma coluna o contém, incluindo o comprimento, como `NUMERIC(10)`. Uma coluna ou um termo fica vinculado a um domínio pelo id deste, e o editor dá a todas as colunas vinculadas o tipo de dados do domínio (consulte [Domínios e tipos de dados](../../guide/guides/dictionary.md#domains-and-data-types)).

## JSON Schema {#json-schema}

O ficheiro de esquema canónico está publicado em [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) e pode ser referenciado diretamente com `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Coloque `$schema` no topo de um ficheiro `.erd.json` e os editores que entendem JSON Schema, como o VS Code, validam o documento e completam automaticamente os seus campos à medida que edita.

A partir da `4.0.0`, o esquema descreve apenas a forma de armazenamento. Cada objeto com campos nomeados é fechado (`additionalProperties: false`), cada campo que a forma de armazenamento escreve sempre é obrigatório, cada campo marcado com `?` nos tipos acima é nomeado, mas não é obrigatório, e nenhum outro campo é nomeado. Por isso, recusa um ficheiro guardado antes da `4.0.0`, com o seu `meta`, larguras, `zIndex`, `ignoreSaveSettings` e o resto, até que um editor da `4.0.0` ou posterior volte a guardar esse ficheiro. Um ficheiro guardado pela `3.2.0` ou posterior já indica o URL deste esquema, que aponta para o ramo `main`, pelo que um editor que valida com base nele assinala agora o ficheiro. Um ficheiro guardado pela `3.0.0` ou pela `3.1.0`, ou um documento v2, não indica nenhum `$schema`.

A partir da `4.2.0`, o esquema deixa de exigir os campos de texto de uma entidade, qualquer lista de `doc`, qualquer coleção ou o próprio `collections`, que a forma de armazenamento deixa de fora enquanto não contêm nada. Continua a aceitar um ficheiro guardado pela `4.0.0` ou pela `4.1.0`. Nomeia os novos campos: `nameViewMode`, que aceita apenas `"logical"` e `"both"`; o `logicalName` e o `nameDerived` de uma tabela, que aceita apenas `true`; o `logicalName` e o `domainId` de uma coluna; e os três dicionários, cada um com o seu cabeçalho e linhas de cadeias de caracteres. `canvasType` lista o separador Dicionário, `columnOrder` aceita sete ou nove números inteiros e as descrições de `show`, `columnOrder`, `lockSettings` e `options` nomeiam os novos bits.

A partir da `5.1.1`, nomeia também o `groupId` de uma nota, que uma cópia do esquema obtida antes da `5.1.1` recusa.

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
          "groupId": {
            "description": "Id of the table group in doc.tableGroupIds the memo belongs to; absent means none",
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
      "description": "Named, coloured rectangles drawn behind tables and memos; a table or a memo joins one through its groupId. Written while a group exists; absent means none",
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
