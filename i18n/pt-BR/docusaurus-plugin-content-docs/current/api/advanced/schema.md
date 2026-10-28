---
sidebar_position: 3
description: O formato de documento .erd.json — a forma de armazenamento que um arquivo contém e o valor em tempo de execução que um editor mantém, os tipos TypeScript, as constantes por trás de cada campo numérico e o JSON Schema publicado.
---

# Esquema

`.erd.json` é o formato de documento do editor. Leia esta página se precisar gerar, validar ou migrar um documento fora do editor.

A partir da `4.0.0`, um documento tem duas serializações, ambas com `version` `'3.0.0'`. A forma de armazenamento é o que um arquivo contém: é o que [`editor.value`](../erd-editor-element.md#value) retorna, o que a exportação JSON escreve e a única forma que o [JSON Schema](#json-schema) publicado aceita. O valor em tempo de execução é o documento inteiro como um editor o mantém, que [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) retorna. `setInitialValue()`, o setter `value` e `setSchemaJSON()` leem qualquer uma das formas, qualquer arquivo salvo por uma versão anterior e um documento `.vuerd` v2. Antes da `4.0.0`, havia só uma: `value` retornava o documento inteiro como o editor o mantinha, como `runtimeValue` faz agora.

## Forma de armazenamento e valor em tempo de execução {#storage-form-and-runtime-value}

A forma de armazenamento contém apenas as entidades ativas: cada tabela listada em `doc.tableIds`, as colunas que essas tabelas listam, os relacionamentos entre duas tabelas mantidas, os índices das tabelas mantidas, com as colunas de índice cuja coluna a tabela ainda lista, as notas e os grupos de tabelas listados e, a partir da `4.2.0`, as palavras, os termos e os domínios listados que contêm algum valor além do id. Ela deixa de fora o que um editor deriva ao carregar ou mantém enquanto está aberto: as entidades removidas, `seqColumnIds` e `seqIndexColumnIds`, todo `zIndex`, as larguras medidas, o `ui` da coluna, o `identification`, o `startRelationshipType` e as âncoras de um relacionamento e, a partir da `4.2.0`, o `order` de cada linha de dicionário e as listas `doc.wordIds`, `doc.termIds` e `doc.domainIds`. Os tipos abaixo marcam cada um desses campos com `// runtime only`.  
Toda coleção, exceto os dicionários, usa o id como chave, em ordem de unidades de código, com as colunas agrupadas primeiro por `tableId` e as colunas de índice primeiro por `indexId`. A partir da `4.2.0`, `wordEntities`, `termEntities` e `domainEntities` vêm depois de todas as outras coleções, nessa ordem, cada uma escrita como um cabeçalho e linhas, cada linha em uma linha própria do texto (consulte [Linhas do dicionário](#dictionary-rows)). Cada entidade escreve seus campos em uma ordem fixa, e o texto é indentado com dois espaços e termina com uma quebra de linha. Assim, o mesmo documento sempre escreve os mesmos bytes, uma edição altera apenas o que toca e um arquivo salvo em uma máquina com outras fontes é reaberto com o mesmo `value`.  
O VS Code, o Obsidian e o plugin para JetBrains só escrevem um arquivo quando uma edição altera `value`, então um arquivo salvo por uma versão anterior mantém sua forma antiga até a primeira edição.

A partir da `4.2.0`, a forma de armazenamento também deixa de fora o que não contém nada: cada campo de texto que uma entidade ou seu `ui` contém como `''` (o `name`, o `comment` e o `ui.color` de uma tabela, o `name`, o `comment`, o `dataType` e o `default` de uma coluna, o `name` de um índice, o `value` e o `ui.color` de uma nota, o `name` e o `color` de um grupo de tabelas), cada lista de `doc` e cada coleção que não contém nenhuma entrada e o próprio `collections` quando todas as coleções estão vazias. Um texto só com espaços em branco é escrito como está, exceto um nome lógico, que nesse caso fica de fora, e uma palavra, um termo ou um domínio cujos valores além do id estejam todos vazios ou só com espaços em branco, que fica de fora por inteiro. Todo id, toda lista dentro de uma entidade e todo número, inclusive `0`, continuam sendo escritos. `doc` é sempre escrito, então o arquivo de um documento novo contém `$schema`, `version`, suas configurações e `"doc": {}`.  
A análise lê um campo de texto ausente como `''` e uma coleção ausente como vazia, como faz toda versão v3, e a forma de armazenamento só deixa uma lista de `doc` de fora enquanto sua coleção não contém nada (consulte [Doc](#doc)). Assim, um editor anterior à `4.2.0` também abre esses arquivos, e um programa que lê um arquivo por conta própria deve ler o que está ausente da mesma maneira. Um arquivo salvo por uma versão anterior volta do próximo salvamento com seus textos, listas e coleções vazios deixados de fora, uma alteração feita uma única vez, e, daí em diante, é salvo sempre com os mesmos bytes.

O valor em tempo de execução mantém o que a forma de armazenamento deixa de fora: entidades removidas, sequências, z-indexes, larguras, marcas de chave, sinalizadores de relacionamento e âncoras, os campos de texto vazios, as quatro listas `tableIds`, `relationshipIds`, `indexIds` e `memoIds` e as seis coleções de `tableEntities` a `memoEntities`, mesmo quando vazias. A partir da `4.2.0`, ele também mantém as palavras, os termos e os domínios removidos, as linhas que não contêm nada, o `order` de cada linha, as três listas dos dicionários, um nome lógico só com espaços em branco e um vínculo com um domínio removido. Ele é indentado com dois espaços, sem quebra de linha no final. Use-o apenas para inicializar um colaborador ou uma segunda exibição por meio de `setInitialValue()`, para que o desfazer de uma remoção que outro editor envia traga a entidade de volta inteira ali. Nunca o escreva em um arquivo; o JSON Schema o recusa. As entidades removidas não passam mais por coleta de lixo, então o valor em tempo de execução as mantém até a próxima vez que o documento for aberto a partir do seu arquivo.

As duas formas escrevem cada configuração bloqueada com seu valor bloqueado (consulte [`lockSettings`](#settings)), `settings.ddlScripts` apenas enquanto um script contém texto e o `groupId` de uma tabela apenas enquanto ele não está vazio. A partir da `4.2.0`, as duas também escrevem `settings.nameViewMode` apenas enquanto o valor que escrevem não é `'physical'`, `settings.columnOrder` em sete entradas sempre que possível (consulte [Settings](#settings)) e o `nameDerived` de uma tabela apenas enquanto ele é `true`.  
A forma de armazenamento escreve `doc.tableGroupIds` e `tableGroupEntities` apenas enquanto existe um grupo de tabelas, um `logicalName` apenas enquanto ele contém texto que não seja só espaços em branco, o `domainId` de uma coluna apenas enquanto ele indica um domínio que o arquivo escreve e cada dicionário apenas enquanto ele contém uma linha que o arquivo escreve. O valor em tempo de execução escreve os campos de grupo de tabelas enquanto o documento contém um grupo ou um grupo removido, `logicalName` e `domainId` enquanto não são `''` e cada dicionário com sua lista enquanto um dos dois contém uma entrada, inclusive uma linha removida.

## TypeScript {#typescript}

Os tipos descrevem o valor em tempo de execução. Um campo marcado com `// runtime only` fica de fora da forma de armazenamento, e um campo marcado com `?` só é escrito enquanto contém algo. Os textos, as listas e as coleções vazios que a forma de armazenamento deixa de fora a partir da `4.2.0` não são marcados.

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

Toda entidade tem um `id`, uma string opaca, que serve de chave na sua coleção, exceto nos três dicionários, em que ele é o primeiro valor de uma linha. A partir da `4.2.0`, quando o `id` de uma entidade das sete coleções com chave está ausente, vazio ou não é uma string, a análise a lê pela chave em que ela está guardada, e descarta uma entrada que não seja um objeto, ou uma sem id cuja chave seja `''`. Uma linha de dicionário é descartada quando não é um array ou quando seu `id` não é uma string diferente de `''`. Um editor anterior à `4.2.0` descarta uma entidade cujo `id` esteja ausente ou vazio, então a forma de armazenamento ainda escreve todos os ids.  
A partir da `4.0.0`, todo id novo, inclusive o de uma linha de dicionário, é um UUIDv7 escrito na forma Uuid25, 25 dígitos minúsculos em base 36, como `03gzrxjv20bdlcak89q25d2m7`, então os ids que um editor gera, ao serem ordenados, ficam na ordem em que ele os criou. Um documento mantém os ids que já contém, como os ids nanoid de uma versão anterior ou os ids de um arquivo v2, então nada deve depender do formato de um id.

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

`originX` e `originY` são a área visível: o ponto da tela em que fica o ponto `(0, 0)` da cena.  
`zoomLevel` vai de `0.1` a `1.5`. Um documento salvo acima de `1` abre em `1` em um editor anterior à `3.5.0`.  
A partir da `4.0.0`, as configurações não trazem `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` nem `ignoreSaveSettings`. Nada os escreve, o parser não mantém nenhum deles e o JSON Schema recusa um arquivo que ainda os tenha.

`canvasType` é a aba em que um documento abre. Um documento salvo na aba Visualização contém `'@dineug/erd-editor/builtin-visualization'`, mas não se o modo `Graph` ou `Flow` estava sendo exibido, e um editor recém-criado mostra essa aba no modo `Graph`.  
A partir da `4.0.0`, enquanto o bloqueio `Canvas Type` está ativado, como em um documento novo, o documento mantém a aba que era exibida quando foi bloqueado, e trocar de aba deixa `value` como estava. Um bloqueio feito na aba Configurações guarda a aba de onde o usuário veio, e um `'settings'` bloqueado, que só uma edição manual pode escrever, abre em `'ERD'`.  
A partir da `4.2.0`, `canvasType` também pode ser `'@dineug/erd-editor/builtin-dictionary'`, a aba [Dicionário](../../guide/guides/dictionary.md), que o bloqueio `Canvas Type` guarda como guarda as outras. Um editor anterior à `4.2.0` mantém esse valor, mas não mostra nenhuma aba sob sua barra de ferramentas até que o usuário escolha uma.  
Nenhuma parte do estado próprio do modo `Flow` é serializada: seu posicionamento, zoom, deslocamento, exibição de linhas e tabelas em foco ficam no editor, e, a partir da `4.2.0`, o mesmo vale para as exibições que [`Previous table` e `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table) percorrem. Assim, `originX`, `originY` e `zoomLevel` sempre descrevem o canvas ERD.

`show` e `lockSettings` são máscaras de bits — combine os sinalizadores com OR.  
`columnOrder` é um array com cada valor de `ColumnType` uma única vez, na ordem de exibição; a partir da `4.2.0`, um documento pode escrevê-lo com sete dos nove, como descreve o parágrafo sobre a ordem das colunas mais abaixo.  
`database`, `language`, `tableNameCase`, `columnNameCase` e `bracketType` contêm, cada um, exatamente um valor, e o JSON Schema rejeita um valor combinado.

O `show` de um documento novo é `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` e `relationship`.  
A partir da `3.10.0`, há mais dois sinalizadores de `show`, ambos desativados em um documento novo e em todo documento salvo antes da `3.10.0`.  
`columnAlternateKey` (`512`) é a opção de exibição [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Quando definido, marca as colunas de cada índice único de duas ou mais colunas como `AK1.1`, `AK1.2` e assim por diante. Ele começa desativado, então nenhum diagrama existente muda de largura.  
`hideReferentialAction` (`1024`) funciona ao contrário: quando definido, oculta os [rótulos ON DELETE e ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) nos conectores, então eles aparecem por padrão. A opção de exibição `Referential Actions` fica marcada enquanto o sinalizador está desativado. Ele não altera o tamanho de nenhuma tabela.  
Um editor anterior à `3.10.0` mantém `show` como um número inteiro, então os dois sinalizadores são preservados ao salvar nesse editor.

A partir da `4.0.0`, há mais dois sinalizadores de `show`, ambos desativados em um documento novo e em todo documento salvo antes da `4.0.0`. Assim como `hideReferentialAction`, cada um oculta o que nomeia, então grupos de tabelas e notas aparecem por padrão.  
`hideTableGroup` (`2048`) oculta os [grupos de tabelas](../../guide/guides/table-groups.md), e `hideMemo` (`4096`) oculta todas as notas. Eles correspondem às [opções de exibição](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` e `Memos`, cada uma marcada enquanto seu sinalizador está desativado. Nenhum dos dois altera o tamanho de nenhuma tabela.  
Um editor anterior à `4.0.0` mantém `show` como um número inteiro, então os dois sinalizadores são preservados ao salvar nesse editor.

A partir da `4.2.0`, há mais um sinalizador de `show`, `columnDomain` (`8192`), desativado em um documento novo e em todo documento salvo antes da `4.2.0`, então o `show` de um documento novo continua sendo `431`. Ele é a [opção de exibição](../../guide/guides/table-related-functions.md#table-view-options) `Domain`: quando definido, cada linha de coluna mostra uma [célula Domínio](../../guide/guides/logical-names.md#the-domain-cell), o que alarga as tabelas. Ele começa desativado, então nenhum diagrama existente muda de largura.  
Um editor anterior à `4.2.0` mantém `show` como um número inteiro, então o sinalizador é preservado ao salvar nesse editor.

A partir da `4.2.0`, `ColumnType` tem nove valores. `columnLogicalName` (`128`) posiciona a célula de nome lógico, que uma linha de coluna só desenha na exibição `Both Names`, e `columnDomain` (`256`), a célula Domínio. Eles são as linhas `Logical Name` e `Domain` da [ordem das colunas](../../guide/guides/settings.md#adjusting-column-order) da aba Configurações. Um editor mantém uma ordem com os nove, e a de um documento novo é `128, 1, 2, 256, 4, 8, 16, 32, 64`.  
As duas formas escrevem a ordem em sete entradas, deixando `128` e `256` de fora, enquanto `128` fica logo antes de `columnName` e `256` logo depois de `columnDataType`. Assim, um documento novo continua escrevendo `1, 2, 4, 8, 16, 32, 64`, e um arquivo cuja ordem nunca os moveu mantém seus bytes. Caso contrário, elas escrevem os nove.  
A análise insere os dois nessas posições de uma ordem de sete entradas, qualquer que seja a ordem das sete, e aceita como estão nove entradas que contenham todos os tipos.  
A partir da `5.0.0`, ela aceita também qualquer outra ordem. Mantém cada `ColumnType` que conhece uma única vez, na ordem dada, e descarta todas as outras entradas: um valor que nenhum `ColumnType` nomeia, como um tipo que uma versão posterior adicione, e uma segunda entrada do mesmo tipo. Cada tipo que a ordem não tem vai logo depois do tipo anterior mais próximo, na ordem padrão, que a ordem contém ou, se não houver nenhum antes dele, logo antes do posterior mais próximo, que é como `128` e `256` encontram seus lugares em sete entradas. Somente uma ordem que não nomeia nenhum tipo conhecido, ou um valor que não é um array, é lida como a ordem padrão.  
Assim, um arquivo salvo por uma versão posterior abre com a ordem dos tipos que esta versão conhece, e um salvamento aqui grava essa ordem sem os outros. Antes da `5.0.0`, uma análise lia qualquer outra ordem como a padrão, então um arquivo assim abria com a ordem das colunas redefinida. O JSON Schema aceita sete ou nove inteiros.

A partir da `4.0.0`, `Language` tem mais oito destinos do [Gerador de código](../../guide/guides/code-generator.md), de `Mermaid` a `JSONSchema`. Um `language` que o parser não conhece é lido como `GraphQL`, então um editor anterior à `4.0.0` abre em GraphQL um documento salvo com um deles, e salvar nele escreve GraphQL.

A partir da `4.0.0`, `lockSettings` substitui `ignoreSaveSettings`, e `LockSettingType` substitui `SaveSettingType`, que foi removido. `lockSettings` indica as configurações que um documento salva como estavam quando foram bloqueadas. `viewport` abrange `originX`, `originY` e `zoomLevel` juntos, já que uma origem salva sem seu zoom abre em outro lugar, e cada um dos outros bits abrange o campo de mesmo nome. Estas são as linhas [`Lock`](../../guide/guides/settings.md#lock) da aba Configurações.  
Tanto `value` quanto `runtimeValue` escrevem uma configuração bloqueada com seu valor bloqueado, independentemente do que o editor mostre, e todas as outras configurações como estão. Assim, enquanto o bloqueio correspondente está ativado, rolar e aplicar zoom, trocar de aba, alterar a linguagem do Gerador de código, um estilo de nome ou o tipo de delimitador, ou trocar a exibição de nomes deixa o arquivo como estava. Bloquear captura o valor que a configuração tem naquele momento, e a análise obtém o valor bloqueado do campo salvo.  
Um documento iniciado do zero — um novo editor ou armazenamento de replicação, ou um valor vazio passado para `value` ou `setInitialValue()` — tem `lockSettings` definido como `63`, com todos os bloqueios ativados. Um documento cujas `settings` não trazem `lockSettings` — todo arquivo salvo antes da `4.0.0`, qualquer que seja seu `ignoreSaveSettings`, e todo documento v2 — também abre com todos os bloqueios ativados: a área visível e a aba ficam onde ficam as de um documento novo (`originX` e `originY` em `0`, `zoomLevel` em `1`, a aba ERD), e a linguagem, os estilos de nome e o tipo de delimitador ficam bloqueados nos valores que ele salvou. Um documento que indica seus bloqueios os mantém, inclusive `0`, assim como todos os valores que salvou.  
A análise mantém todos os bits de `lockSettings`, inclusive os desconhecidos, então um bloqueio que uma versão posterior adicionar é preservado ao salvar aqui; o JSON Schema verifica apenas se ele é um inteiro. Um editor anterior à `4.0.0` descarta `lockSettings` ao salvar e escreve a área visível e a aba como estão, então o arquivo volta a abrir aqui como um arquivo salvo antes da `4.0.0`.

A partir da `4.2.0`, há um sétimo bloqueio, `unlockNameViewMode` (`64`), a linha `Name View`, que abrange `nameViewMode`. Seu bit funciona ao contrário dos outros bits de bloqueio, como fazem os bits de ocultação de `Show`: quando definido, a exibição de nomes fica desbloqueada, e, quando zerado, bloqueada. Assim, `63` continua significando todos os bloqueios ativados, e um documento novo o contém com a exibição de nomes bloqueada em `'physical'`. Um arquivo salvo antes da `4.2.0` tem o bit zerado, quaisquer que sejam seus outros bloqueios, inclusive `0`, então abre com a exibição de nomes bloqueada em `'physical'`. Um documento com todos os bloqueios desativados contém `64`, e um com todos os outros bloqueios ativados e a exibição de nomes desbloqueada contém `127`. Teste esse bloqueio de forma invertida: ele está ativado enquanto `(lockSettings & 64) === 0`.  
Enquanto ele está ativado, uma troca da exibição de nomes altera apenas a tela do editor que a fez, e o documento mantém a exibição bloqueada. Enquanto está desativado, uma troca em um editor que pode editar vale para o documento, e todos os colaboradores trocam junto. A troca de um editor somente leitura altera apenas a sua própria tela, em qualquer caso. Consulte [`Lock`](../../guide/guides/settings.md#lock).  
Um editor da `4.0.0` ou da `4.1.0` mantém o bit ao salvar, mas descarta `nameViewMode`, então o documento volta a abrir aqui em `'physical'`, com o bloqueio como estava.

A partir da `4.0.0`, `ddlScripts` contém os dois scripts da aba [Esquema SQL](../../guide/guides/schema-sql.md), que o DDL de todo banco de dados escreve: `before` depois do cabeçalho e antes das tabelas, `after` depois do DDL gerado. O DDL escreve cada um com quebras de linha LF, sem as linhas em branco no início nem os espaços em branco no final, e, no MSSQL, terminado com `GO`, como descreve [Scripts antes e depois das tabelas](../../guide/guides/schema-sql.md#before-and-after-scripts); o próprio `ddlScripts` mantém cada script como foi digitado. A chave só é escrita enquanto um dos scripts contém texto, e então com os dois; uma chave ausente, ou um script que não seja uma string, é lido como `''`. As escolhas `Statements`, `Header` e `Tables` da aba e, a partir da `4.2.0`, sua opção [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) não são salvas no documento.  
Um editor anterior à `4.0.0` descarta os scripts ao carregar um documento, então salvar nele os perde.

A partir da `4.2.0`, `nameViewMode` é a [exibição de nomes](../../guide/guides/logical-names.md#name-view), os nomes que o diagrama desenha: `'physical'`, o nome de cada tabela e coluna, `'logical'`, seu nome lógico no lugar do nome, e `'both'`, o nome lógico e o nome. Os menus chamam esses valores de `Physical Names`, `Logical Names` e `Both Names`. As duas formas o escrevem por último, depois de `ddlScripts`, e apenas enquanto o valor que escrevem não é `'physical'`; enquanto o bloqueio `Name View` está ativado, esse é o valor bloqueado, independentemente do que a tela mostre. Um valor ausente, ou um que o parser não conhece, é lido como `'physical'`, e o JSON Schema aceita apenas `"logical"` e `"both"`.  
Um editor anterior à `4.2.0` descarta `nameViewMode` ao carregar um documento.

`Database`, `Language`, `Show`, `ColumnType`, `ColumnOption`, `LockSettingType` e `ReferentialAction` só recebem acréscimos no final. Um documento salvo armazena o número, então um novo fornecedor, destino de geração de código, sinalizador, tipo de coluna, opção de coluna, bloqueio ou ação ocupa o próximo bit em vez de uma posição no meio.

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

Cada uma das cinco primeiras listas é a ordem de um tipo de entidade, que o DDL, a ordenação das tabelas e a ordem de desenho leem. Na forma de armazenamento, cada lista contém apenas os ids das entidades mantidas, cada um uma única vez, na ordem listada, e, a partir da `4.2.0`, uma lista que não contém nenhum fica de fora. A partir da `4.0.0`, `tableGroupIds` é a ordem dos grupos de tabelas.

A partir da `4.2.0`, `wordIds`, `termIds` e `domainIds` listam as linhas ativas de cada dicionário: uma linha que sua coleção contém, mas sua lista não, está removida. Elas não são a ordem de uma planilha, que o `order` de cada linha fornece. Apenas o valor em tempo de execução as escreve, cada uma enquanto ela ou sua coleção contém uma entrada. As próprias linhas de um arquivo são o conjunto de membros e a ordem, e o JSON Schema recusa as listas.  
A partir da `4.2.0`, a análise lê uma lista que o documento deixa de fora, ou que traz como algo que não seja um array, como todas as entradas que sua coleção contém, cada id uma única vez, na ordem em que estão; um array vazio continua vazio, e todas as entradas da sua coleção passam então a ser lidas como removidas. Um editor anterior à `4.2.0` lê uma lista ausente como vazia, então a forma de armazenamento ainda escreve cada lista sempre que sua coleção contém uma entidade.

A partir da `4.0.0`, a ordem de empilhamento não é salva. A análise empilha cada tabela, nota e grupo de tabelas listado que não traga `zIndex` pela sua posição na lista, com os posteriores à frente: grupos de tabelas a partir de `1`, tabelas a partir de `2` e notas acima de todas as tabelas. Uma entidade que traz um `zIndex`, como em um valor em tempo de execução ou em um arquivo salvo antes da `4.0.0`, o mantém. Por isso, trazer uma tabela ou nota para a frente se perde quando o arquivo é reaberto.

### Coleção: tableEntities {#collection-tableentities}

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

A partir da `4.0.0`, uma tabela traz `groupId`, o id do [grupo de tabelas](../../guide/guides/table-groups.md) ao qual pertence. Um `groupId` ausente ou vazio, ou um que não indique nenhum grupo em `doc.tableGroupIds`, significa nenhum grupo, e a forma de armazenamento só o escreve enquanto ele indica um grupo mantido.  
A análise inicializa `seqColumnIds` com `columnIds` quando ele está ausente ou falta nele um id listado, e um editor mede `widthName`, `widthLogicalName` e `widthComment` novamente com suas próprias fontes a cada carregamento.

A partir da `4.2.0`, uma tabela traz `logicalName`, o nome que as [exibições](../../guide/guides/logical-names.md#name-view) `Logical Names` e `Both Names` desenham, `''` para nenhum, e `nameDerived`, `true` enquanto `name` for o nome que os dicionários [derivaram](../../guide/guides/dictionary.md#deriving-physical-names) do nome lógico. Enquanto esse sinalizador está definido, um novo nome lógico deriva o nome novamente; enquanto não está, o nome foi escrito por alguém, e um novo nome lógico não o altera, a menos que o nome esteja vazio ou só com espaços em branco. Renomear manualmente o desativa, e [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) reescreve até um nome que alguém escreveu e o ativa onde houver um nome lógico.  
A forma de armazenamento escreve `logicalName` depois de `name`, como foi digitado, apenas enquanto ele contém texto que não seja só espaços em branco, e `nameDerived` depois de `groupId` apenas enquanto ele é `true`, o único valor que o JSON Schema aceita. Um `logicalName` ausente é lido como `''` e um `nameDerived` ausente como `false`, então todo nome em um arquivo salvo antes da `4.2.0` conta como escrito por alguém.  
Um editor anterior à `4.2.0` descarta os dois ao carregar um documento, então salvar nele perde o nome lógico de todas as tabelas.

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

A partir da `4.0.0`, a forma de armazenamento não escreve o `ui` das colunas. Todo carregamento deriva `keys`, a marca de chave primária a partir do bit `primaryKey` de `options` e a marca de chave estrangeira a partir dos relacionamentos que terminam na coluna, e mede as seis larguras.  
Um editor anterior à `4.0.0` mostra as colunas de um arquivo salvo aqui sem seus ícones de chave primária.

A partir da `4.2.0`, uma coluna traz `logicalName`, como uma tabela, e `domainId`, o id do domínio ao qual está vinculada, `''` para nenhum. As edições em um editor mantêm uma coluna vinculada no tipo de dados do seu domínio, como descreve [Domínios e tipos de dados](../../guide/guides/dictionary.md#domains-and-data-types). A análise, porém, não altera o tipo de nenhuma coluna, então um arquivo escrito em outro lugar pode deixar uma coluna vinculada com outro tipo, e o mesmo podem fazer as edições cruzadas de dois colaboradores; a planilha Verificações lista cada caso como [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds). A análise limpa um `domainId` que não indica nenhum domínio que o documento contém. Um domínio removido ainda conta, então o editor mantém um vínculo com ele enquanto um desfazer puder trazer o domínio de volta. Depois de `options`, a forma de armazenamento escreve `logicalName` pela regra de uma tabela, e `domainId` apenas enquanto ele indica um domínio que o arquivo escreve, portanto nunca um vínculo com um domínio removido.  
`ColumnOption.nameDerived` (`16`) é o sinalizador de nome derivado da coluna, mantido em `options` com os outros bits e com o mesmo significado do `nameDerived` de uma tabela. Uma chave primária não nula cujo nome os dicionários derivaram, por exemplo, tem `options` `26`.  
Um editor anterior à `4.2.0` descarta `logicalName` e `domainId` ao carregar um documento, então salvar nele os perde. Ele mantém `options` como um número inteiro, então o bit `nameDerived` é preservado ao salvar nesse editor.

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

### Linhas do dicionário {#dictionary-rows}

A partir da `4.2.0`, um documento contém três dicionários, as planilhas `Words`, `Terms` e `Domains` da aba [Dicionário](../../guide/guides/dictionary.md), em `wordEntities`, `termEntities` e `domainEntities`. Todo campo de uma palavra, de um termo ou de um domínio é uma string, e nenhum deles tem `ui`. A planilha `Checks` é calculada a partir dos dicionários e do diagrama, e não é salva.

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

Nenhum dos três usa o id como chave. Cada um é escrito como um cabeçalho e linhas: `fields` nomeia os campos da entidade uma única vez, com o id primeiro, e cada linha contém os valores de uma entidade nessa ordem. Os tipos abaixo listam os campos de cada entidade na ordem do cabeçalho do valor em tempo de execução. Uma linha sempre mantém seu id e seu nome, mas os valores vazios no final, depois do nome, ficam de fora, então um valor vazio antes de um que é mantido continua sendo `''`, e a análise lê como `''` um valor que falta em uma linha. As duas formas escrevem cada linha em uma linha própria do texto, como JSON compacto, como nestas duas palavras de um arquivo:

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

A forma de armazenamento escreve as linhas listadas na ordem da planilha e deixa `order` de fora, então seus cabeçalhos não o nomeiam. Ela deixa de fora uma linha cujos valores além do id estejam todos vazios ou só com espaços em branco, como uma adicionada e nunca preenchida, ou esvaziada, e todo vínculo com um domínio assim ou com um domínio removido: o `domainId` de uma coluna fica de fora, e o de um termo é escrito como `''`, ficando o próprio termo de fora se não contiver mais nada.  
Os cabeçalhos do valor em tempo de execução nomeiam `"order"` logo depois de `"name"`. Ele escreve todas as linhas que sua coleção contém, inclusive as removidas, na ordem em que a coleção as contém, então, para obter a ordem de uma planilha, classifique por `order`, comparado em ordem de unidades de código. A análise atribui às linhas de um arquivo chaves `order` na ordem em que as linhas estão, então elas são lidas de volta na ordem em que o arquivo as escreveu.  
Um documento sem os dicionários, como um salvo antes da `4.2.0`, não tem nenhum. Um editor anterior à `4.2.0` descarta os três ao carregar um documento, então salvar nele perde todas as palavras, termos e domínios.

### Coleção: wordEntities {#collection-wordentities}

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

Uma palavra é uma das palavras que compõem um nome lógico, e `abbreviation` é o que a representa em um nome físico. `synonyms` lista outras grafias da palavra, e `forbiddenWords`, palavras que não devem ser usadas no lugar dela, os dois separados por vírgulas.

### Coleção: termEntities {#collection-termentities}

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

Um termo é um nome lógico inteiro. Uma tabela ou coluna cujo `logicalName` corresponde a `name` deriva `physicalName` ou, enquanto ele está vazio, um nome composto das abreviaturas das palavras, e uma coluna também recebe o domínio que `domainId` indica, `''` para nenhum (consulte [Derivar nomes físicos](../../guide/guides/dictionary.md#deriving-physical-names)). `synonyms` é separado por vírgulas. A análise limpa um `domainId` que não indica nenhum domínio, como em uma coluna.

### Coleção: domainEntities {#collection-domainentities}

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

Um domínio é um tipo de dados com nome, que `dataType` guarda como uma coluna o guarda, inclusive o comprimento, como `NUMERIC(10)`. Uma coluna ou um termo vincula um domínio pelo seu id, e o editor dá a toda coluna vinculada o tipo de dados do domínio (consulte [Domínios e tipos de dados](../../guide/guides/dictionary.md#domains-and-data-types)).

## JSON Schema {#json-schema}

O arquivo de esquema canônico é publicado em [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) e pode ser referenciado diretamente com `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Coloque `$schema` no topo de um arquivo `.erd.json`, e os editores que entendem JSON Schema, como o VS Code, validam o documento e completam automaticamente seus campos durante a edição.

A partir da `4.0.0`, o esquema descreve apenas a forma de armazenamento. Todo objeto com campos nomeados é fechado (`additionalProperties: false`), todo campo que a forma de armazenamento sempre escreve é obrigatório, um campo que ela deixa de fora enquanto não contém nada é nomeado, mas não obrigatório, e nenhum campo que ela sempre deixa de fora é nomeado. Por isso, ele recusa o valor em tempo de execução. Ele também recusa um arquivo salvo antes da `4.0.0`, com seu `meta`, larguras, `zIndex`, `ignoreSaveSettings` e o restante, até que um editor da `4.0.0` ou posterior salve esse arquivo novamente. Um arquivo salvo pela `3.2.0` ou posterior já indica a URL deste esquema, que aponta para o branch `main`, então um editor que valida com base nele agora sinaliza o arquivo. Um arquivo salvo pela `3.0.0` ou pela `3.1.0`, ou um documento v2, não indica nenhum `$schema`.

A partir da `4.2.0`, o esquema deixa de exigir os campos de texto de uma entidade, as listas de `doc`, as coleções e o próprio `collections`, que a forma de armazenamento deixa de fora enquanto não contêm nada. Ele ainda aceita um arquivo salvo pela `4.0.0` ou pela `4.1.0`. Ele nomeia os novos campos: `nameViewMode`, que aceita apenas `"logical"` e `"both"`; o `logicalName` de uma tabela e seu `nameDerived`, que aceita apenas `true`; o `logicalName` e o `domainId` de uma coluna; e os três dicionários, cada um com seu cabeçalho e linhas de strings. `canvasType` lista a aba Dicionário, `columnOrder` aceita sete ou nove inteiros, e as descrições de `show`, `columnOrder`, `lockSettings` e `options` nomeiam os novos bits.

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
