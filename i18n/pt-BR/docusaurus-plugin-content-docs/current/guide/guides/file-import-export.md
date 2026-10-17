---
sidebar_position: 2
description: Importar JSON, Esquema SQL, GraphQL, DBML ou AML no lugar do diagrama ou como acréscimo abaixo dele, e exportar JSON, Esquema SQL ou o diagrama como imagem PNG ou SVG.
---

# Importar ou exportar arquivos

## Importar arquivos externos {#importing-external-files}

É possível importar cinco formatos pelo submenu `Import` do menu de contexto do canvas:

- json
- Schema SQL
- GraphQL
- DBML
- AML

O item `Import and Add`, logo abaixo de `Import`, adiciona o arquivo ao diagrama em vez de substituí-lo — consulte [Importar e adicionar](#import-and-add).  
A tela de boas-vindas exibida por um diagrama vazio tem um item `Import` com os mesmos cinco formatos — consulte [Tela de boas-vindas](./editing-start.md#welcome-screen).

As extensões são reconhecidas sem diferenciar maiúsculas de minúsculas. Escolher um arquivo cuja extensão não corresponda ao formato selecionado cancela a importação e exibe `Only <format> files can be imported`, com o formato escrito como `json`, `sql`, `graphql`, `dbml` ou `aml`, como em `Only sql files can be imported`.

`Import` substitui o documento atual em vez de mesclar o arquivo a ele, e um único desfazer traz o diagrama anterior de volta.  
Um arquivo JSON traz consigo as próprias configurações, incluindo seus [bloqueios](./settings.md#lock). Quando o arquivo bloqueia a aba, a linguagem do Gerador de código, um estilo de nome ou o tipo de delimitador, você continua vendo o que tinha, mas o valor salvo é o valor bloqueado do arquivo. A área visível, bloqueada ou não, vai para onde o arquivo a coloca. Um arquivo JSON salvo antes de os bloqueios existirem entra com todos os bloqueios ativados e a área visível em 100%.  
Os outros formatos mantêm as configurações que você já tem, incluindo os bloqueios, exceto a área visível, que começa em 100%.  
Os parsers de GraphQL, DBML e AML nunca falham: um arquivo que eles não conseguem ler produz um diagrama vazio em vez de um erro.

Um arquivo JSON mantém as posições que tem. As tabelas de um arquivo de Esquema SQL, GraphQL, DBML ou AML são posicionadas antes de o diagrama mudar:

- Quando o arquivo tem duas ou mais tabelas e pelo menos um relacionamento, elas são organizadas pelo [layout automático](./table-related-functions.md#auto-layout) `Flow`, da esquerda para a direita ao longo dos relacionamentos, a partir do canto superior esquerdo do canvas. Um relacionamento de uma tabela consigo mesma também conta.
- Caso contrário, elas são dispostas em linhas a partir do canto superior esquerdo, primeiro as tabelas com menos colunas.
- Se o layout levar mais de 6 segundos, aparece um aviso `Placing tables` com um botão `Cancel`. `Cancel`, ou `Escape` enquanto o aviso está visível, abandona o layout e, em vez disso, dispõe as tabelas em linhas. A disposição em linhas também é usada, sem aviso, quando o layout falha, quando nenhum layout é retornado em até 60 segundos ou quando o host não executa nenhum worker compartilhado — consulte [Web Workers](../../api/installation.md#web-workers).

Em seguida, o diagrama é substituído em uma única etapa, de modo que nenhum estado intermediário é exibido. Uma configuração que você alterar enquanto as tabelas estão sendo posicionadas, como a aba, é mantida, e, se você importar outro arquivo nesse meio-tempo, prevalece a importação iniciada por último.

Um editor somente leitura não carrega nada por `Import` e não oferece `Import and Add`.

### Importar e adicionar {#import-and-add}

O item `Import and Add` mantém o diagrama e adiciona um arquivo abaixo dele. Ele está no menu de contexto do canvas e na [pesquisa rápida](./quick-search.md) da aba ERD e oferece os mesmos cinco formatos, com a mesma verificação de extensão de `Import`.

![Adição de um arquivo SQL por Import and Add > Schema SQL, com as tabelas chegando abaixo do diagrama, organizadas ao longo dos relacionamentos e selecionadas](/img/demo-import-and-add.webp)

O arquivo entra da mesma forma que uma colagem: cada tabela, coluna, relacionamento, índice, nota e [grupo de tabelas](./table-groups.md) que ele contém é adicionado como novo, as tabelas que já estão no diagrama não se movem e nenhuma configuração muda, portanto as configurações de um arquivo JSON ficam de fora.  
Uma tabela cujo nome já existe no diagrama é adicionada como uma segunda tabela com esse nome, sem ser mesclada à existente. Relacionamentos e índices vêm somente do arquivo, portanto uma chave estrangeira para uma tabela que o arquivo não define não é ligada a uma tabela que já está no diagrama.

O bloco adicionado é inserido logo abaixo de tudo o que o diagrama contém, alinhado à sua borda esquerda, ou no canto superior esquerdo de um diagrama vazio. Notas e grupos de tabelas ocultados com [Opções de exibição](./table-related-functions.md#table-view-options) também contam, pois continuam ali.  
Dentro do bloco, um arquivo JSON mantém a própria disposição, incluindo seus grupos de tabelas. Os outros formatos são posicionados como `Import` os posiciona, pelo `Flow` ou em linhas, segundo as mesmas regras, e a caixa de cada grupo de tabelas é ajustada em volta de suas tabelas. As tabelas e notas adicionadas ficam empilhadas acima de tudo o que já estava lá.

Assim que o bloco é inserido, somente o que foi adicionado fica selecionado: as novas tabelas, além das novas notas e dos novos grupos de tabelas enquanto estiverem visíveis. Se você tiver ido para outra aba nesse meio-tempo, o editor volta para a aba ERD antes de o bloco ser inserido. Em seguida, a área visível rola até o bloco no zoom atual, a menos que ele já esteja bem visível — consulte [Onde um salto termina](./table-related-functions.md#where-a-jump-lands). Um único desfazer reverte toda a adição.  
Um arquivo que o parser não consegue ler, ou um sem nenhuma tabela e nenhuma nota, não adiciona nada.

Vários arquivos de Esquema SQL, GraphQL, DBML ou AML adicionados enquanto um ainda está sendo posicionado são todos inseridos, na ordem em que foram iniciados. Um arquivo JSON adicionado nesse meio-tempo é inserido assim que é lido, antes deles. Um `Import`, ou o carregamento de outro documento, descarta os que ainda estão sendo posicionados.

Os agentes de codificação adicionam um arquivo da mesma forma com o modo `append` das ferramentas de importação do MCP, que mantém a disposição de um arquivo JSON, mas dispõe as tabelas dos outros formatos em linhas, nunca pelo `Flow` — consulte [Importação](../../mcp/tools.md#import).

### JSON {#json}

É possível importar arquivos no [formato de esquema definido no editor](../../api/advanced/schema.md).
O nome do arquivo deve terminar em `.json`, portanto um arquivo exportado como `<database name>-<timestamp>.erd.json` é importado de volta como está; um arquivo que termina apenas em `.erd` ou `.vuerd` não é aceito aqui. Arquivos salvos por versões anteriores também são lidos.

![Importação de um arquivo salvo por Import > json, substituindo o documento de rascunho junto com suas configurações](/img/demo-import-json.webp)

### Esquema SQL {#schema-sql}

Também é possível importar arquivos de esquema definidos em SQL.  
Embora os parsers tenham sido feitos para ser o mais flexíveis possível, independentemente do fornecedor de banco de dados, pode haver alguma sintaxe sem suporte.  
O nome do arquivo deve terminar em `.sql`.  
[A sintaxe suportada pode ser consultada aqui.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Importação de um arquivo SQL por Import > Schema SQL, com as tabelas organizadas ao longo dos relacionamentos, seguida da diminuição do zoom sobre elas](/img/demo-import-sql.webp)

As colunas vêm somente de `CREATE TABLE`. Uma coluna adicionada por `ALTER TABLE ... ADD COLUMN` não é lida.  
Os itens de um `CREATE TABLE` que não são colunas são ignorados em vez de lidos como colunas: um `CHECK (...)` sem nome, `LIKE` e `EXCLUDE` do PostgreSQL, `FULLTEXT` e `SPATIAL` do MySQL escritos sem `INDEX` ou `KEY`, `PERIOD FOR` do T-SQL e `SUPPLEMENTAL LOG DATA` do Oracle.  
Uma coluna com o nome de um deles ainda é importada quando um tipo nativo segue o nome, como em `exclude BOOLEAN`, ou quando o nome está entre aspas, como em `"check" int`. Um `like` sem aspas seguido de um tipo que não é nativo, como `like citext`, é lido como o `LIKE` do PostgreSQL e ignorado.  
As próprias restrições `CHECK` não são importadas, pois o editor não tem onde armazená-las.

#### Tipos de dados {#data-types}

O tipo de dados de uma coluna é mantido, incluindo a lista de argumentos, mesmo quando não é um tipo nativo de nenhum [banco de dados suportado](./table-related-functions.md#databases).  
Isso abrange um enum ou tipo composto criado com `CREATE TYPE`, um domínio criado com `CREATE DOMAIN`, tipos de extensão como `hstore`, `citext` e `ltree`, nomes qualificados com esquema como `public.mood` e nomes entre aspas ou colchetes como `"MyType"` e `[dbo].[Phone]`, que mantêm suas aspas ou colchetes. As próprias instruções `CREATE TYPE`, `CREATE DOMAIN` e `CREATE EXTENSION` são ignoradas.  
Um tipo nativo perde as aspas ou os colchetes, então `[int]` entra como `int` e `[nvarchar](50)` como `nvarchar(50)`. Os tipos `"char"` e `"bit"` do PostgreSQL mantêm os seus, pois são tipos diferentes de `char` e `bit`.  
Os sufixos de array permanecem em qualquer tipo: `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`. O `UNSIGNED BIG INT` do SQLite entra inteiro.  
Os modificadores `UNSIGNED` e `ZEROFILL` do MySQL e do MariaDB, escritos logo após um tipo e seus argumentos, continuam fazendo parte do tipo como foram escritos: `INT UNSIGNED`, `SMALLINT(5) UNSIGNED ZEROFILL`, o `int unsigned` do mysqldump. `SIGNED`, o padrão, é descartado, então `TINYINT SIGNED` entra como `TINYINT`. Um modificador escrito depois de outra opção de coluna, como em `INT NOT NULL UNSIGNED`, que o MySQL recusa, é descartado.  
Os valores de `ENUM(...)` e `SET(...)` mantêm as aspas, com uma aspa dentro de um valor duplicada, como em `ENUM('a','it''s')`. O `'it\'s'` do MySQL, escapado com barra invertida, entra duplicado da mesma forma. Em um tipo `STRUCT<...>` do Databricks, os nomes de campo entre aspas e o `COMMENT` de um campo mantêm as aspas.  
Uma coluna escrita sem tipo, como uma coluna sem tipo do SQLite ou uma coluna calculada `AS`, continua sem tipo: uma palavra-chave como `NOT`, `NULL`, `DEFAULT`, `PRIMARY` ou `REFERENCES`, ou uma string entre aspas simples, não é lida como tipo.

#### Valores padrão {#defaults}

O `DEFAULT` de uma coluna mantém a expressão inteira, como `now()`, `0.5`, `CURRENT_TIMESTAMP` ou `ARRAY[]::text[]`, até a próxima opção de coluna, uma vírgula ou o parêntese de fechamento. Um `CASE ... END` é lido inteiro.  
Os parênteses em volta de toda a expressão são removidos, então o `((0))` do SQL Server entra como `0` e `(getdate())` como `getdate()`. A conversão (cast) de um literal também é removida, então o `'draft'::character varying` do pg_dump entra como `'draft'` e `NULL::character varying` como `NULL`; as outras conversões permanecem, como em `ARRAY[]::text[]` e `lower('A'::text)`.  
O `ON UPDATE CURRENT_TIMESTAMP` do MySQL é descartado, pois uma coluna não tem lugar para ele, e o valor padrão antes dele permanece. O `DEFAULT ON NULL 0` do Oracle, com ou sem `FOR INSERT ONLY` ou `FOR INSERT AND UPDATE`, entra como `0`.  
Uma string com prefixo, como `N'x'`, `E'x'`, `B'0'`, `X'ff'`, `U&'x'` ou `_utf8mb4'x'`, é lida como uma única string, mesmo com um parêntese dentro dela.

O SQL Server Management Studio gera no script os valores padrão depois das tabelas, como `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]`. Uma instrução assim define o valor padrão dessa coluna, `1` neste caso, e o nome da restrição é descartado.

Uma exportação de Esquema SQL recoloca os parênteses onde um banco de dados só lê a expressão de um valor padrão dentro deles — consulte [Valores padrão](./schema-sql.md#defaults).

#### Incremento automático {#auto-increment}

`AUTO_INCREMENT`, `AUTOINCREMENT` e `IDENTITY` ativam o sinalizador `Auto Increment` de uma coluna, assim como `GENERATED ALWAYS AS IDENTITY` e `GENERATED BY DEFAULT AS IDENTITY`, que não deixam nenhum valor padrão.  
O mesmo faz um valor padrão que seja uma única chamada `nextval()` do PostgreSQL, o valor padrão que uma coluna serial recebe, escrito `nextval('s')` ou, como o pg_dump o escreve, `nextval('s'::regclass)`. O nome da sequência não é mantido. Um valor padrão que apenas usa uma sequência, como `nextval('s') + 1` ou o `NEXT VALUE FOR s` do SQL Server, continua sendo um valor padrão comum.  
O pg_dump escreve ambos depois das tabelas, como `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` e `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY`. Qualquer uma dessas instruções ativa o `Auto Increment` dessa coluna e limpa seu valor padrão. `CREATE SEQUENCE`, `ALTER SEQUENCE` e todas as outras ações de `ALTER COLUMN` são ignoradas.  
Uma coluna declarada diretamente com o tipo `serial`, `bigserial` ou `smallserial` mantém esse tipo, com `Auto Increment` desativado.

O editor mantém apenas o sinalizador `Auto Increment`, e cada banco de dados escreve a própria forma na exportação — consulte [Incremento automático](./schema-sql.md#auto-increment). Uma exportação para PostgreSQL escreve `GENERATED ALWAYS AS IDENTITY` em uma coluna `smallint`, `integer` ou `bigint`, qualquer que tenha sido a forma importada, e, em qualquer outro tipo, como `INT UNSIGNED`, apenas uma linha de comentário depois da tabela. Opções de sequência como `START WITH 100` são perdidas.  
Uma tabela com várias colunas seriais ou de identidade é importada com várias colunas com incremento automático, e o MySQL, o MariaDB e o SQL Server recusam essa tabela quando sua exportação é executada.

#### Chaves primárias {#primary-keys}

Uma chave primária adicionada depois da sua tabela, `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`, marca suas colunas como chave primária.  
O `CLUSTERED` ou `NONCLUSTERED` do SQL Server e o `USING BTREE` do MySQL antes da lista de colunas são pulados na leitura, então o `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]` que o SQL Server Management Studio gera no script define `Id` como chave. O `PRIMARY KEY NONCLUSTERED HASH (...)` de uma tabela otimizada para memória não é lido, nem em `ALTER TABLE` nem em `CREATE TABLE`.

#### Chaves únicas e índices {#unique-keys-and-indexes}

Um `UNIQUE` sobre duas ou mais colunas se torna um só índice único, em qualquer grafia: `UNIQUE (a, b)`, `UNIQUE KEY n (a, b)`, `UNIQUE INDEX n (a, b)`, `CONSTRAINT n UNIQUE (a, b)`, o `INDEX n UNIQUE (a, b)` inline do SQL Server e `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`.  
O índice recebe o nome de índice da chave ou, se não houver, o nome do `CONSTRAINT` ou, se também não houver, nenhum nome, e mantém a ordem de classificação de cada coluna. Um índice assim é uma [chave alternativa](./table-related-functions.md#alternate-keys).  
Um `UNIQUE` sobre uma só coluna, em qualquer dessas grafias, em vez disso marca essa coluna com o sinalizador Único e não adiciona índice, então a restrição `UQ_<table name>_<column name>` que a exportação escreve volta como o sinalizador a partir do qual foi escrita. Um `CREATE UNIQUE INDEX` sobre uma só coluna continua sendo um índice único.

Um `ALTER TABLE` que adiciona várias chaves de uma vez, como o phpMyAdmin escreve `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)`, mantém todas as chaves únicas que contém: `uq_a` entra como um índice único chamado `uq_a`, e `uq_c` como o sinalizador Único de `c`. Um nome de `CONSTRAINT` nomeia apenas a chave da própria cláusula. O `ADD UNIQUE INDEX IF NOT EXISTS n (...)` do MariaDB e o `ALTER TABLE t WITH CHECK ADD ...` e o `WITH NOCHECK ADD ...` do SQL Server também são lidos.  
`CREATE INDEX` e `CREATE UNIQUE INDEX` são lidos com nomes qualificados como `public.t` e `[dbo].[t]`, com `CLUSTERED` e `NONCLUSTERED` do SQL Server, com `CONCURRENTLY`, `IF NOT EXISTS`, `ON ONLY` e `USING btree` do PostgreSQL e sem nenhum nome de índice. O grupo de arquivos `ON [PRIMARY]` do SQL Server é ignorado.  
Opções de chave como `NULLS NOT DISTINCT` ou `USING BTREE` não são confundidas com o nome da chave. Na lista de colunas de uma chave, apenas a primeira palavra nomeia a coluna, então `b DESC NULLS LAST`, `b text_pattern_ops` e `b COLLATE "C"` usam todos `b` como chave, com `DESC` mantido como sua ordem de classificação. Um comprimento de prefixo como `email(191)` é pulado na leitura, mas uma chave com uma parte de expressão, como `lower(email)`, é ignorada por inteiro.

Um índice único parcial, `CREATE UNIQUE INDEX ... WHERE ...` ou o `INDEX n UNIQUE (...) WHERE ...` inline do SQL Server, entra como um índice comum com o mesmo nome e as mesmas colunas, porque uma chave única em toda a tabela seria mais restritiva do que a chave filtrada que o arquivo declara. A exceção é um filtro composto apenas de testes `IS NOT NULL` nas colunas da chave unidos por `AND`, o filtro de que o SQL Server precisa para permitir que uma coluna única contenha mais de um NULL: essa chave continua única.  
Uma chave única que cita uma coluna que a tabela não tem, como uma adicionada por `ALTER TABLE ... ADD COLUMN`, é descartada por inteiro em vez de ser reduzida às colunas que existem. Um índice comum mantém as colunas que existem.

O SQL Developer e o `DBMS_METADATA` do Oracle escrevem o índice próprio de uma chave como um `CREATE UNIQUE INDEX` separado, com o nome da chave ou, para uma chave sem nome seguida de `USING INDEX`, com um nome de sistema como `SYS_C0012345`. A importação lê esse índice, e aquele que um `ADD CONSTRAINT ... USING INDEX` nomeia, como parte da sua chave: uma chave única composta entra como um só índice único, e uma chave primária ou uma chave única de uma coluna, como os sinalizadores da coluna, sem índice extra. Uma exportação de volta para o Oracle cria então o índice uma única vez.

Uma exportação de Esquema SQL é importada de volta com os mesmos sinalizadores Único e índices para MySQL, MariaDB, MSSQL, Oracle, PostgreSQL e SQLite.  
O Snowflake não tem índices secundários, então sua exportação traz de volta apenas as chaves únicas: uma composta como índice único e uma de uma coluna como o sinalizador Único da coluna. Uma exportação para Databricks não declara nenhuma unicidade, então nenhuma volta.

#### Chaves estrangeiras {#foreign-keys}

Uma chave estrangeira se torna um relacionamento nestas grafias:

- Um `FOREIGN KEY (...) REFERENCES t (...)` no nível da tabela, com ou sem `CONSTRAINT name`.
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`, incluindo o `ALTER TABLE t WITH CHECK ADD ...` e o `WITH NOCHECK ADD ...` que o SQL Server Management Studio gera no script.
- O `REFERENCES t (col)` inline de uma coluna, como em `user_id INT REFERENCES users (id)`, e o `FOREIGN KEY REFERENCES t (col)` que o SQL Server e o Snowflake permitem nessa posição. Uma referência inline a mais de uma coluna é ignorada.

Um `ALTER TABLE` gera no máximo um relacionamento, e somente quando sua primeira cláusula adiciona uma chave estrangeira: uma cláusula `FOREIGN KEY` depois de uma cláusula `ADD PRIMARY KEY` ou `ADD UNIQUE` na mesma instrução não é lida. Quando uma instrução adiciona várias chaves estrangeiras, como o phpMyAdmin escreve `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...`, apenas a última é lida.

`REFERENCES t` sem lista de colunas aponta para a chave primária de `t` quando essa chave é uma única coluna. Diante de uma chave primária composta, a chave estrangeira é ignorada.  
Uma chave estrangeira é ignorada, e nenhuma de suas colunas é marcada como chave estrangeira, quando nenhuma de suas colunas referenciadas é encontrada ou quando as colunas encontradas nas duas tabelas diferem em número, como quando uma coluna falta em apenas uma delas. Quando falta o mesmo número de suas colunas nas duas tabelas, as colunas encontradas são pareadas na ordem em que foram escritas, e o relacionamento contém apenas essas.  
Todo relacionamento importado é `Zero N` e é identificador quando cada uma de suas colunas na tabela filha também é chave primária.

As cláusulas `ON DELETE` e `ON UPDATE` de cada chave estrangeira se tornam o `On Delete` e o `On Update` do relacionamento: `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL` ou `SET DEFAULT`, sem diferenciar maiúsculas de minúsculas e em qualquer ordem. Uma chave estrangeira sem elas é importada como `Not set`. Consulte [Edição de relacionamentos](./relationship-editing.md#on-delete-and-on-update) para definir essas ações no editor.  
A lista de colunas do PostgreSQL depois de `SET NULL` ou `SET DEFAULT`, como em `ON DELETE SET NULL (a_id)`, é pulada na leitura: a ação se aplica à chave inteira, e um `ON UPDATE` depois da lista ainda é lido. `MATCH FULL`, `MATCH PARTIAL` e `MATCH SIMPLE` são ignorados, e o atributo de coluna `ON UPDATE CURRENT_TIMESTAMP` do MySQL não é confundido com uma ação.  
Uma exportação de Esquema SQL é importada de volta com as ações que esse banco de dados escreve, então uma ação que ele omite, como `SET DEFAULT` no MySQL, qualquer `ON UPDATE` no Oracle ou qualquer coisa além de `NO ACTION` no Snowflake, volta como `Not set`.

#### Comentários {#comments}

Os comentários de tabelas e colunas são importados das três sintaxes que o parser lê: a opção de tabela e o atributo de coluna `COMMENT`, usados pelo MySQL, MariaDB, Snowflake e Databricks; as instruções `COMMENT ON TABLE` e `COMMENT ON COLUMN`, usadas pelo PostgreSQL e pelo Oracle; e a propriedade estendida `MS_Description`, que o SQL Server define com `EXEC sp_addextendedproperty`.  
Um comentário que cita uma tabela ou coluna que o arquivo não define é ignorado.

As chamadas do SQL Server são lidas com argumentos nomeados, como o SQL Server Management Studio gera cada comentário no script (`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`), e com argumentos posicionais, como a exportação para MSSQL do editor as escreve.  
Somente um `MS_Description` em uma tabela, ou em uma de suas colunas no nível 2, gera um comentário. Outra propriedade, uma view, um índice ou uma restrição não gera nenhum, e o mesmo vale para um comentário passado em uma variável ou montado com `+`.

Em um comentário, assim como em qualquer texto entre aspas, como um valor `DEFAULT` ou um nome entre aspas, uma aspa duplicada representa uma única aspa, da forma como o mysqldump e o pg_dump a escrevem: `'it''s'` é lido como `it's`.  
Uma barra invertida antes de uma aspa, como o MySQL e o MariaDB escrevem `'it\'s'`, também escapa a aspa. Uma aspa assim ainda encerra o texto quando é seguida por um espaço em branco, `,`, `;`, `)`, `]`, `:`, `|`, `+` ou pelo fim do arquivo, então `'C:\'`, o `'C:\'::text` do pg_dump e o `'C:\'+name` do T-SQL mantêm a barra invertida.  
Um valor `DEFAULT` mantém as aspas, e uma aspa dentro dele é reescrita duplicada, qualquer que seja a forma como o arquivo a escapou: `'it''s'`.  
Quando o banco de dados do documento é Databricks no momento da importação, o texto entre aspas simples segue, em vez disso, as regras do Spark: cada barra invertida escapa o caractere seguinte, então `'C:\\dir'` é lido como `C:\dir`, sequências de escape como `\n`, `\t` e `\u0041` são decodificadas e um valor `DEFAULT` é mantido como `'it\'s'`.

O Esquema SQL exportado escapa uma aspa dentro de um comentário de tabela ou coluna: `COMMENT 'it''s'` para MySQL, MariaDB e Snowflake; `COMMENT ON TABLE` e `COMMENT ON COLUMN ... IS 'it''s'` para PostgreSQL e Oracle; e a mesma duplicação, incluindo os nomes de tabelas e colunas, nas chamadas `sp_addextendedproperty` do MSSQL. Um comentário sem aspas é escrito como está.  
O Databricks, em vez disso, escapa uma aspa e uma barra invertida com uma barra invertida, como em `COMMENT 'it\'s'`, então sua exportação só é lida de volta com exatidão enquanto Databricks é o banco de dados selecionado.  
O MSSQL escreve cada comentário como `EXECUTE sys.sp_addextendedproperty 'MS_Description', '<comment>', 'schema', '<schema>', 'table', '<table>'`, seguido de `'column', '<column>'` para uma coluna. Com a opção `Bracket` em `None`, uma tabela chamada `sales.users` gera o esquema `sales` e a tabela `users`, e um nome sem esquema fica em `dbo`. Com qualquer outro `Bracket`, o nome inteiro é a tabela, em `dbo`.

Os comentários não sobrevivem a uma ida e volta de exportação e importação no SQLite: o SQLite os escreve como linhas `--` simples, que o parser não lê. As chamadas `sp_addextendedproperty` de uma exportação para MSSQL são importadas de volta como os mesmos comentários de tabela e coluna.

### GraphQL {#graphql}

É possível importar um documento GraphQL SDL.  
As definições de tipo de objeto se tornam tabelas, um bloco `extend type` é mesclado ao tipo que estende e os campos das interfaces são herdados pelos tipos que as implementam.  
Um campo cujo tipo é outra tabela se torna um relacionamento em vez de uma coluna, e uma lista nos dois lados cria uma tabela associativa.  
Um campo singular como `buyer: User` é primeiro pareado com o único campo do outro tipo cujo nome termina em `By` seguido do nome desse campo, como `orderListByBuyer`, sem diferenciar maiúsculas de minúsculas e ignorando sublinhados; um campo numerado como `buyer2` é pareado da mesma forma, sem o número. É assim que a saída GraphQL do Gerador de código nomeia os campos quando duas tabelas compartilham mais de um relacionamento ou uma tabela faz referência a si mesma, então essa saída é importada de volta com todos os relacionamentos.  
Os tipos raiz (`Query`, `Mutation`, `Subscription`), os tipos de introspecção e os wrappers do Relay, da federação e do Hasura, como `PageInfo`, `*Connection`, `*Edge` e `*_aggregate`, são tratados como ruído e ignorados.  
As diretivas `@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index` e `@db.*` são respeitadas.  
O nome do arquivo deve terminar em `.graphql`, `.gql` ou `.graphqls`. Um arquivo `schema.prisma` do Prisma não é um documento GraphQL e não pode ser importado aqui.

### DBML {#dbml}

É possível importar um arquivo DBML, o formato usado pelo dbdiagram.io e pelo dbdocs.  
Os blocos `Table`, `TablePartial`, `Ref`, `Enum` e `TableGroup` são lidos. Os blocos `Project` e os blocos `Note` independentes são ignorados sem afetar as tabelas ao redor.  
Todas as grafias de ref são aceitas: a forma com dois-pontos `Ref:`, uma ref nomeada, a forma de bloco `Ref { }` e a configuração de coluna inline `[ref: > table.column]`.  
Uma ref muitos-para-muitos `<>` cria uma tabela associativa com o nome dos dois lados.  
As configurações `delete` e `update` de uma ref independente se tornam o `On Delete` e o `On Update` do relacionamento, como em `Ref: users.id < posts.user_id [delete: cascade, update: set null]`. Os valores são `cascade`, `restrict`, `set null`, `set default` e `no action`, sem diferenciar maiúsculas de minúsculas. Qualquer outro valor, ou a ausência de configuração, é importado como `Not set`, e outras configurações, como `color`, são ignoradas.  
A configuração inline `[ref: ...]` não carrega ações, e as configurações de uma ref `<>` não são levadas para a tabela associativa. Quando a mesma chave estrangeira é declarada tanto inline quanto como ref independente, a inline é mantida, sem ações.  
A configuração `headercolor` de uma tabela, como em `Table users [headercolor: #3498DB]`, se torna a cor dela quando o valor é um hexadecimal `#rgb` ou `#rrggbb` escrito sem aspas. Qualquer outro valor é descartado, e o `headercolor` de um `TablePartial` não é passado para as tabelas que o usam.  
Cada `TableGroup` se torna um [grupo de tabelas](./table-groups.md) com as tabelas que lista, uma por linha, nomeadas como uma `Ref` as nomeia. Seu `[color: ...]` se torna a cor do grupo segundo a mesma regra de `headercolor`, e sua nota e outras configurações são descartadas. Uma tabela listada por dois grupos fica no primeiro. Um grupo que fica sem nenhuma tabela não é criado, seja porque não lista nenhuma tabela declarada no arquivo, seja porque lista apenas tabelas que um grupo anterior já pegou. A caixa do grupo é ajustada em volta de suas tabelas onde quer que elas sejam posicionadas, e, quando as tabelas são dispostas em linhas, as tabelas de um grupo ficam juntas.  
O nome do arquivo deve terminar em `.dbml`.

### AML {#aml}

É possível importar um arquivo AML (Azimutt Markup Language). Tanto a grafia atual quanto a grafia legada v1 são aceitas.  
As entidades se tornam tabelas, e os atributos aninhados são achatados em um nome de coluna com pontos, como `settings.slug`.  
Os atributos são `NOT NULL`, a menos que marcados como `nullable`, e as construções para as quais o editor não tem lugar, como `check`, `type` e `tags`, são descartadas em vez de rejeitadas. Uma entidade marcada como view entra como uma tabela comum.  
O `color` de uma entidade, como em `users {color: red}`, se torna a cor da sua tabela. Os nomes de cor do AML, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` e `gray`, são lidos sem diferenciar maiúsculas de minúsculas, com ou sem aspas, cada um como o tom 500 da cor do Tailwind com esse nome, como `#ef4444` para `red`. Um hexadecimal entre aspas como `"#3498db"` é mantido como foi escrito; um `#3498db` sem aspas não pode ser lido, porque `#` inicia um comentário AML. Qualquer outro valor, e um `color` em um atributo ou em um relacionamento, é descartado.  
Uma instrução `rel` independente, ou `fk` na grafia legada, mantém suas propriedades `onDelete` e `onUpdate` como o `On Delete` e o `On Update` do relacionamento, como em `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`. Os valores são `cascade`, `restrict`, `set null`, `set default` e `no action`, com ou sem aspas, sem diferenciar maiúsculas de minúsculas. Outras propriedades são descartadas.  
Em um relacionamento inline como `user_id int -> users(id) {onDelete: cascade}`, as propriedades pertencem ao atributo, então são descartadas e o relacionamento é importado como `Not set`.  
O nome do arquivo deve terminar em `.aml`.

GraphQL, DBML e AML são formatos de ida e volta: cada um também é um destino do [Gerador de código](./code-generator.md).  
O DBML e o AML levam o ON DELETE e o ON UPDATE de cada relacionamento nos dois sentidos — consulte [Gerador de código](./code-generator.md#on-delete-and-on-update). O GraphQL não leva nenhum dos dois, então uma importação de GraphQL deixa ambos como `Not set`.  
O DBML também leva, nos dois sentidos, as cores das tabelas, descontada qualquer transparência, e cada grupo de tabelas que contém uma tabela. Um grupo sem nome volta como `group_1`, `group_2` e assim por diante, e um nome de grupo repetido volta com `_2`, `_3` e assim por diante acrescentados. O AML leva a cor de uma tabela apenas como o nome de cor mais próximo, então `#FF8800` é escrito como `orange` e volta como `#f97316`, e não leva grupos. O GraphQL não leva nem cores nem grupos.

## Exportar {#exporting}

O submenu `Export` do menu de contexto do canvas tem três itens:

- json: Salva o diagrama tal como o seu arquivo o armazena, como `.erd.json`: as tabelas com suas colunas e índices; os relacionamentos, as notas e os grupos de tabelas; e as configurações, cada [configuração bloqueada](./settings.md#lock) com seu valor bloqueado.
- Schema SQL: Abre a aba [Esquema SQL](./schema-sql.md#saving-or-copying-the-sql) com o painel de opções aberto e o botão `Save file` em foco, de modo que pressionar `Enter` salva como `.sql` o SQL exibido na aba. Nada é salvo até lá.
- Image: Abre a caixa de diálogo `Export image`, que salva o diagrama como `.png` ou `.svg` ou o copia para a área de transferência como PNG — consulte [Imagem](#image).

Os três funcionam em um editor somente leitura.

O Esquema SQL escreve o ON DELETE e o ON UPDATE de cada relacionamento depois do seu `REFERENCES`, primeiro o ON DELETE. `Not set` não escreve nada, e uma ação que o banco de dados selecionado não aceita é omitida. Consulte [Edição de relacionamentos](./relationship-editing.md#on-delete-and-on-update) para saber qual banco de dados aceita qual ação.

Todo arquivo exportado recebe o nome `<database name>-<timestamp>` seguido da extensão, com o carimbo de data e hora no horário local, no formato `yyyy-MM-dd'T'HH_mm_ss` — por exemplo, `my-schema-2026-08-29T04_05_06.erd.json`. Um nome de banco de dados em branco é substituído por `unnamed`.  
O botão `Save file` da aba Esquema SQL e o do [Gerador de código](./code-generator.md) nomeiam seus arquivos da mesma forma. Uma imagem usa o nome do banco de dados como estava quando a caixa de diálogo foi aberta.

`Import`, `Import and Add` e `Export` também estão disponíveis na [pesquisa rápida](./quick-search.md) da aba ERD, com os mesmos itens do menu de contexto do canvas.

No Obsidian, não aparece nenhum download nem caixa de diálogo de salvamento: o arquivo é gravado no cofre, onde o Obsidian coloca os novos anexos desse diagrama, e um aviso informa seu caminho.  
Os caracteres que o Obsidian não permite em um nome de arquivo, `\ / : * ? " < > |`, são substituídos por `-`.  
O explorador de arquivos do Obsidian só lista um arquivo `.erd.json` ou `.sql` exportado enquanto Settings → Files and links → Detect all file extensions está ativado.

### Imagem {#image}

`Export` ▸ `Image`, no menu de contexto do canvas ou na pesquisa rápida, abre a caixa de diálogo `Export image`: uma pré-visualização da imagem ao lado das suas opções. Um [explorador](./explorer.md#dialogs-beside-it) aberto continua aberto sob a área esmaecida.

![Abertura de Export > Image, desativação do modo escuro e do plano de fundo, escolha de 3x e cópia da imagem para a área de transferência](/img/demo-export.webp)

- `Background`: Ativado por padrão. Quando desativado, deixa o canvas transparente.
- `Dark mode`: Começa correspondendo à aparência do editor. Enquanto corresponde à aparência na tela, a imagem usa as próprias cores do canvas, incluindo as alterações do [construtor de temas](./language-and-theme.md); a outra aparência usa a predefinição com o mesmo tom de cinza e a mesma cor de destaque.
- `Scale`: `1x`, `2x` ou `3x`, com `2x` selecionado por padrão. Define apenas o tamanho do PNG e da cópia para a área de transferência, e a linha abaixo da opção informa esse tamanho, como `PNG <width> × <height> px`.

As escolhas são mantidas até o editor ser fechado e nunca são salvas no documento. A pré-visualização é desenhada da mesma forma que a imagem e é desenhada novamente quando `Background` ou `Dark mode` muda.

A imagem contém o diagrama como estava quando a caixa de diálogo foi aberta; feche e reabra a caixa de diálogo para incluir alterações posteriores. Ela contém o diagrama inteiro, por mais longe dele que a área visível tenha sido rolada, recortado ao que o diagrama desenha mais uma margem, e é sempre desenhada em 100%, qualquer que seja o zoom exibido pelo editor, então todas as tabelas são desenhadas por completo. O que as [Opções de exibição](./table-related-functions.md#table-view-options) ocultam — relacionamentos, seus rótulos de ON DELETE e ON UPDATE, grupos de tabelas ou notas — não é desenhado nem recebe espaço, e os grupos de tabelas são desenhados atrás de todo o resto.

Três botões gravam a imagem, e cada um deixa a caixa de diálogo aberta:

- `PNG`: Salva um `.png` do tamanho do diagrama em 100% multiplicado pelo valor de `Scale`. Um PNG grande demais para um canvas de navegador é gravado em resolução reduzida em vez de falhar: a caixa de diálogo avisa antes com `Reduced from <width> × <height> px, past what a browser canvas can hold`, e um aviso que diz `Exported at a reduced resolution` informa isso depois.
- `SVG`: Salva um `.svg` do tamanho do diagrama em 100%, qualquer que seja o valor de `Scale`, e nunca reduzido. Seu texto continua sendo texto e suas fontes são referenciadas pelo nome em vez de incorporadas, então um visualizador sem a fonte do editor desenha outra. As sombras são omitidas.
- `Copy to clipboard`: Coloca um PNG na área de transferência no valor de `Scale` escolhido, reduzido como um PNG salvo é quando um canvas de navegador não consegue comportá-lo. Confirma com `Copied the image to the clipboard`, ou com `Copied at a reduced resolution` quando a imagem foi reduzida. Se a cópia falhar, porque o navegador ou o host recusa o acesso à área de transferência ou porque não foi possível desenhar a imagem, `Couldn't copy the image` sugere salvar um PNG em vez disso.

A imagem é desenhada em um worker em segundo plano quando o host executa um, de modo que o editor continua utilizável enquanto isso. Um aviso que diz `Exporting PNG`, `Exporting SVG` ou `Copying image` aparece quando o processo leva mais que um instante, e uma falha é informada como `Couldn't export the PNG` ou `Couldn't export the SVG`. Fechar a caixa de diálogo enquanto um arquivo ainda está sendo desenhado não impede que esse arquivo seja salvo.

O botão `PNG` está em foco quando a caixa de diálogo abre, e `Tab` mantém o foco dentro da caixa de diálogo. `Escape`, o botão `x` ou um clique na área esmaecida ao redor dela a fecha.  
Enquanto ela está aberta, os atalhos do canvas, incluindo desfazer e refazer, bem como copiar e colar, não fazem nada. `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac) a fecha e abre a pesquisa rápida. `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) a fecha e coloca o cursor de texto no campo Localizar do [explorador](./explorer.md#opening-and-closing), abrindo o explorador se estiver fechado, nunca o fechando. Em um editor estreito demais para mostrar o explorador, o atalho ainda fecha a caixa de diálogo, mas mostra uma notificação em vez de mover o cursor de texto.
