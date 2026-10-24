---
sidebar_position: 2
description: Importar JSON, Esquema SQL, GraphQL, DBML ou AML em substituição do diagrama ou como adição abaixo dele, e exportar JSON, Esquema SQL ou o diagrama como imagem PNG ou SVG.
---

# Importar ou exportar ficheiros

## Importar ficheiros externos {#importing-external-files}

É possível importar cinco formatos, a partir do submenu `Import` do menu de contexto da tela:

- json
- Schema SQL
- GraphQL
- DBML
- AML

A opção `Import and Add`, logo abaixo da opção `Import`, adiciona o ficheiro ao diagrama em vez de o substituir — consulte [Importar e adicionar](#import-and-add).  
O ecrã de boas-vindas que um diagrama vazio mostra tem uma linha `Import` com os mesmos cinco formatos — consulte [Ecrã de boas-vindas](./editing-start.md#welcome-screen).  
As folhas do separador [Dicionário](./dictionary.md) também recebem palavras, termos e domínios de ficheiros CSV, através do botão `Import CSV` próprio desse separador — consulte [Importar e exportar CSV](./dictionary.md#importing-and-exporting-csv).

As extensões são reconhecidas sem distinguir maiúsculas de minúsculas. Escolher um ficheiro cuja extensão não corresponda ao formato selecionado cancela a importação e mostra `Only <format> files can be imported`, com o formato escrito `json`, `sql`, `graphql`, `dbml` ou `aml`, como em `Only sql files can be imported`.

A opção `Import` substitui o documento atual em vez de fundir o ficheiro com ele, e uma anulação repõe o diagrama anterior.  
Um ficheiro JSON traz consigo as suas próprias definições, incluindo os seus [bloqueios](./settings.md#lock). Quando o ficheiro bloqueia o separador, a linguagem do Gerador de código, um formato do nome, o tipo de delimitador ou a [vista de nomes](./logical-names.md#name-view), continua a ver o que tinha, mas o valor guardado é o valor bloqueado do ficheiro. O zoom e a posição da vista, bloqueados ou não, ficam onde o ficheiro os coloca. Um ficheiro JSON guardado antes de existirem os bloqueios é importado com todos os bloqueios ativados e a vista a 100%. Um ficheiro guardado antes de existir o bloqueio `Name View` é importado com esse bloqueio ativado, sejam quais forem os outros bloqueios que regista.  
Os outros formatos mantêm as definições que já tem, incluindo os bloqueios, exceto a vista, que começa a 100%.  
Os analisadores de GraphQL, DBML e AML nunca falham: um ficheiro que não conseguem ler produz um diagrama vazio em vez de um erro.

Um ficheiro JSON também traz os nomes lógicos das suas tabelas e colunas e os vínculos das suas colunas a domínios. As suas palavras, termos e domínios substituem os do separador [Dicionário](./dictionary.md), pelo que um ficheiro que não contenha nenhum deixa as folhas vazias, e anular a importação repõe os que substituiu.  
Os outros formatos não contêm nada disto. As suas tabelas são importadas sem nomes lógicos e sem nenhuma coluna vinculada a um domínio, e as palavras, os termos e os domínios que já tem ficam como estão. Anular ou refazer a importação também os deixa como estão, pelo que uma edição dos dicionários feita depois da importação é mantida. Uma importação destas também deixa como está o histórico de anulação próprio de cada folha, enquanto uma importação de JSON esvazia esses históricos — consulte [Folhas do dicionário](./undo-redo.md#dictionary-sheets).

Um ficheiro JSON mantém as posições que tem. As tabelas de um ficheiro de Esquema SQL, GraphQL, DBML ou AML são posicionadas antes de o diagrama mudar, com as larguras que ocupam na [vista de nomes](./logical-names.md#beyond-the-canvas) que está a ver:

- Quando o ficheiro tem duas ou mais tabelas e pelo menos uma relação, estas são dispostas pela [disposição automática](./table-related-functions.md#auto-layout) `Flow`, da esquerda para a direita ao longo das relações, a partir do canto superior esquerdo da tela. Uma relação de uma tabela consigo própria também conta.
- Caso contrário, são dispostas em linhas a partir do canto superior esquerdo, primeiro as tabelas com menos colunas.
- Se a disposição demorar mais de 6 segundos, aparece um aviso `Placing tables` com um botão `Cancel`. O botão `Cancel`, ou a tecla `Escape` enquanto o aviso está visível, abandona a disposição e, em vez disso, dispõe as tabelas em linhas. A disposição em linhas também é usada, sem aviso, quando a disposição falha, quando nenhuma disposição é devolvida no espaço de 60 segundos ou quando o host não executa nenhum worker partilhado — consulte [Web Workers](../../api/installation.md#web-workers).

O diagrama é então substituído num único passo, pelo que não aparece nenhum estado intermédio. Uma definição que mude enquanto as tabelas estão a ser posicionadas, como o separador, é mantida e, se importar outro ficheiro entretanto, prevalece a importação iniciada em último lugar.

Um editor só de leitura não carrega nada a partir da opção `Import` e não oferece a opção `Import and Add` nem o botão `Import CSV` do separador Dicionário.

### Importar e adicionar {#import-and-add}

A opção `Import and Add` mantém o diagrama e adiciona um ficheiro abaixo dele. Encontra-se no menu de contexto da tela e na [pesquisa rápida](./quick-search.md) no separador ERD, e oferece os mesmos cinco formatos com a mesma verificação da extensão que a opção `Import`.

![Adicionar um ficheiro SQL a partir de Import and Add > Schema SQL, com as tabelas colocadas abaixo do diagrama, dispostas ao longo das suas relações e selecionadas](/img/demo-import-and-add.webp)

O ficheiro entra da mesma forma que uma colagem: cada tabela, coluna, relação, índice, nota e [grupo de tabelas](./table-groups.md) que contém é adicionado como um elemento novo, as tabelas que já estão no diagrama não se movem e nenhuma definição muda, pelo que as definições de um ficheiro JSON ficam de fora.  
As tabelas e as colunas de um ficheiro JSON mantêm os seus nomes lógicos, e cada nome físico continua a pertencer aos dicionários ou a ser escrito por si, tal como estava no ficheiro, o que decide se um nome lógico escrito mais tarde deriva um novo — consulte [Derivar nomes físicos](./dictionary.md#deriving-physical-names). As palavras, os termos e os domínios do ficheiro ficam de fora, pelo que o separador Dicionário fica como estava, e nenhuma coluna adicionada fica vinculada a um domínio: cada uma mantém o tipo de dados que tem.  
Uma tabela cujo nome já existe no diagrama é adicionada como uma segunda tabela com esse nome, e não fundida com a existente. As relações e os índices vêm apenas do ficheiro, pelo que uma chave externa para uma tabela que o ficheiro não define não fica ligada a uma tabela que já esteja no diagrama.

O bloco adicionado fica logo abaixo de tudo o que o diagrama contém, alinhado com a margem esquerda deste, ou no canto superior esquerdo de um diagrama vazio. As notas e os grupos de tabelas ocultados com o menu [Opções de vista](./table-related-functions.md#table-view-options) também contam, pois continuam a ocupar o seu lugar.  
Dentro do bloco, um ficheiro JSON mantém a sua própria disposição, incluindo os seus grupos de tabelas. Os outros formatos são posicionados como a opção `Import` os posiciona, com `Flow` ou em linhas segundo as mesmas regras, e a caixa de cada grupo de tabelas é ajustada às suas tabelas. As tabelas e as notas adicionadas ficam por cima de tudo o que já lá estava.

Quando o bloco é colocado, fica selecionado apenas o que foi adicionado: as novas tabelas e, enquanto estiverem visíveis, as novas notas e os novos grupos de tabelas. Se entretanto tiver mudado para outro separador, o editor volta ao separador ERD antes de o bloco ser colocado. A vista desloca-se então até ao bloco com o zoom atual, a menos que este já esteja bem visível — consulte [Onde termina um salto](./table-related-functions.md#where-a-jump-lands). Uma única anulação retira tudo o que foi adicionado.  
Um ficheiro que o analisador não consegue ler, ou um ficheiro sem tabelas nem notas, não adiciona nada.

Vários ficheiros de Esquema SQL, GraphQL, DBML ou AML adicionados enquanto um ainda está a ser posicionado são todos colocados, pela ordem em que foram iniciados. Um ficheiro JSON adicionado entretanto é colocado assim que é lido, antes deles. Uma importação com a opção `Import`, ou o carregamento de outro documento, descarta os que ainda estiverem a ser posicionados.

Os agentes de programação adicionam um ficheiro da mesma forma com o modo `append` das ferramentas de importação MCP, que mantém a disposição de um ficheiro JSON mas dispõe as tabelas dos outros formatos em linhas, nunca com `Flow` — consulte [Importação](../../mcp/tools.md#import).

### JSON {#json}

Pode importar ficheiros no [formato de esquema definido no editor](../../api/advanced/schema.md).
O nome do ficheiro tem de terminar em `.json`, pelo que um ficheiro exportado como `<database name>-<timestamp>.erd.json` é importado de volta tal como está; um ficheiro apenas com a extensão `.erd` ou `.vuerd` não é aceite aqui. Os ficheiros guardados por versões anteriores também são lidos.

![Importar um ficheiro guardado a partir de Import > json, que substitui o documento de rascunho juntamente com as suas definições](/img/demo-import-json.webp)

### Esquema SQL {#schema-sql}

Também pode importar ficheiros de esquema definidos em SQL.  
Embora os analisadores tenham sido feitos para ser o mais flexíveis possível, independentemente da base de dados, pode haver alguma sintaxe não suportada.  
O nome do ficheiro tem de terminar em `.sql`.  
[Pode consultar aqui a sintaxe suportada.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Importar um ficheiro SQL a partir de Import > Schema SQL, com as tabelas dispostas ao longo das suas relações, e depois reduzir o zoom sobre elas](/img/demo-import-sql.webp)

As colunas vêm apenas de `CREATE TABLE`. Uma coluna adicionada por `ALTER TABLE ... ADD COLUMN` não é lida.  
Os itens de um `CREATE TABLE` que não são colunas são ignorados em vez de serem lidos como colunas: um `CHECK (...)` sem nome, os `LIKE` e `EXCLUDE` do PostgreSQL, os `FULLTEXT` e `SPATIAL` do MySQL escritos sem `INDEX` nem `KEY`, o `PERIOD FOR` do T-SQL e o `SUPPLEMENTAL LOG DATA` do Oracle.  
Uma coluna com o nome de um deles continua a ser importada quando o nome é seguido de um tipo integrado, como em `exclude BOOLEAN`, ou quando o nome está entre aspas, como em `"check" int`. Um `like` sem aspas seguido de um tipo que não é integrado, como `like citext`, é lido como o `LIKE` do PostgreSQL e ignorado.  
As próprias restrições `CHECK` não são importadas, pois o editor não tem onde as guardar.

#### Tipos de dados {#data-types}

O tipo de dados de uma coluna é mantido, incluindo a lista de argumentos, mesmo quando não é um tipo integrado de nenhuma [base de dados suportada](./table-related-functions.md#databases).  
Isto abrange um enum ou um tipo composto criado com `CREATE TYPE`, um domínio criado com `CREATE DOMAIN`, tipos de extensões como `hstore`, `citext` e `ltree`, nomes qualificados com esquema como `public.mood` e nomes entre aspas ou entre parênteses retos como `"MyType"` e `[dbo].[Phone]`, que mantêm as aspas ou os parênteses retos. As próprias instruções `CREATE TYPE`, `CREATE DOMAIN` e `CREATE EXTENSION` são ignoradas.  
Um tipo integrado perde as aspas ou os parênteses retos, pelo que `[int]` é importado como `int` e `[nvarchar](50)` como `nvarchar(50)`. Os tipos `"char"` e `"bit"` do PostgreSQL mantêm as aspas, porque são tipos diferentes de `char` e `bit`.  
Os sufixos de array mantêm-se em qualquer tipo: `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`. O `UNSIGNED BIG INT` do SQLite é importado inteiro.  
Os `UNSIGNED` e `ZEROFILL` do MySQL e do MariaDB, escritos logo a seguir a um tipo e aos seus argumentos, mantêm-se como parte do tipo, tal como estão escritos: `INT UNSIGNED`, `SMALLINT(5) UNSIGNED ZEROFILL`, o `int unsigned` do mysqldump. `SIGNED`, a predefinição, é descartado, pelo que `TINYINT SIGNED` é importado como `TINYINT`. Um modificador escrito depois de outra opção de coluna, como em `INT NOT NULL UNSIGNED`, que o MySQL recusa, é descartado.  
Os valores de `ENUM(...)` e `SET(...)` mantêm as aspas, com uma aspa dentro de um valor duplicada, como em `ENUM('a','it''s')`. O `'it\'s'` do MySQL, com escape por barra invertida, é importado com a aspa duplicada da mesma forma. Num tipo `STRUCT<...>` do Databricks, os nomes de campos entre aspas e o `COMMENT` de um campo mantêm as aspas.  
Uma coluna escrita sem tipo, como uma coluna do SQLite sem tipo ou uma coluna calculada `AS`, continua sem tipo: uma palavra-chave como `NOT`, `NULL`, `DEFAULT`, `PRIMARY` ou `REFERENCES`, ou uma cadeia entre aspas simples, não é lida como tipo.

#### Valores predefinidos {#defaults}

O `DEFAULT` de uma coluna mantém a expressão completa, como `now()`, `0.5`, `CURRENT_TIMESTAMP` ou `ARRAY[]::text[]`, até à opção de coluna seguinte, a uma vírgula ou ao parêntese de fecho. Um `CASE ... END` é lido inteiro.  
Os parênteses à volta de toda a expressão são removidos, pelo que o `((0))` do SQL Server é importado como `0` e `(getdate())` como `getdate()`. A conversão de tipo de um literal também é removida, pelo que o `'draft'::character varying` do pg_dump é importado como `'draft'` e `NULL::character varying` como `NULL`; as outras conversões mantêm-se, como em `ARRAY[]::text[]` e `lower('A'::text)`.  
O `ON UPDATE CURRENT_TIMESTAMP` do MySQL é descartado, pois uma coluna não tem lugar para ele, e o valor predefinido que o antecede mantém-se. O `DEFAULT ON NULL 0` do Oracle, com ou sem `FOR INSERT ONLY` ou `FOR INSERT AND UPDATE`, é importado como `0`.  
Uma cadeia com prefixo, como `N'x'`, `E'x'`, `B'0'`, `X'ff'`, `U&'x'` ou `_utf8mb4'x'`, é lida como uma só cadeia, mesmo que contenha um parêntese.

O SQL Server Management Studio escreve os valores predefinidos depois das tabelas, como `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]`. Uma instrução deste tipo define o valor predefinido dessa coluna, aqui `1`, e o nome da sua restrição é descartado.

Uma exportação de Esquema SQL volta a colocar os parênteses onde uma base de dados só lê a expressão de um valor predefinido dentro deles — consulte [Valores predefinidos](./schema-sql.md#defaults).

#### Incremento automático {#auto-increment}

`AUTO_INCREMENT`, `AUTOINCREMENT` e `IDENTITY` ativam o sinalizador `Auto Increment` de uma coluna, tal como `GENERATED ALWAYS AS IDENTITY` e `GENERATED BY DEFAULT AS IDENTITY`, que não deixam nenhum valor predefinido.  
O mesmo acontece com um valor predefinido que seja uma única chamada `nextval()` do PostgreSQL, o valor predefinido que uma coluna serial recebe, escrito `nextval('s')` ou, como o pg_dump o escreve, `nextval('s'::regclass)`. O nome da sequência não é mantido. Um valor predefinido que apenas usa uma sequência, como `nextval('s') + 1` ou o `NEXT VALUE FOR s` do SQL Server, continua a ser um valor predefinido simples.  
O pg_dump escreve ambos depois das tabelas, como `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` e `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY`. Qualquer uma das duas instruções ativa o sinalizador `Auto Increment` dessa coluna e limpa o seu valor predefinido. `CREATE SEQUENCE`, `ALTER SEQUENCE` e todas as outras ações `ALTER COLUMN` são ignoradas.  
Uma coluna com o tipo `serial`, `bigserial` ou `smallserial` declarado em linha mantém esse tipo, com o sinalizador `Auto Increment` desativado.

O editor mantém apenas o sinalizador `Auto Increment`, e cada base de dados escreve a sua própria forma na exportação — consulte [Incremento automático](./schema-sql.md#auto-increment). Uma exportação para PostgreSQL escreve `GENERATED ALWAYS AS IDENTITY` numa coluna `smallint`, `integer` ou `bigint`, seja qual for a forma importada, e, em qualquer outro tipo, como `INT UNSIGNED`, apenas uma linha de comentário depois da tabela. As opções de sequência como `START WITH 100` perdem-se.  
Uma tabela com várias colunas serial ou de identidade é importada com várias colunas de incremento automático, e o MySQL, o MariaDB e o SQL Server recusam uma tabela assim quando a sua exportação é executada.

#### Chaves primárias {#primary-keys}

Uma chave primária adicionada depois da sua tabela, `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`, marca as suas colunas como chave primária.  
Os `CLUSTERED` ou `NONCLUSTERED` do SQL Server e o `USING BTREE` do MySQL antes da lista de colunas são saltados na leitura, pelo que o `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]` que o SQL Server Management Studio escreve define `Id` como chave. O `PRIMARY KEY NONCLUSTERED HASH (...)` de uma tabela otimizada para memória não é lido, nem em `ALTER TABLE` nem em `CREATE TABLE`.

#### Chaves únicas e índices {#unique-keys-and-indexes}

Um `UNIQUE` sobre duas ou mais colunas torna-se um índice único, em todas as formas de escrita: `UNIQUE (a, b)`, `UNIQUE KEY n (a, b)`, `UNIQUE INDEX n (a, b)`, `CONSTRAINT n UNIQUE (a, b)`, o `INDEX n UNIQUE (a, b)` em linha do SQL Server e `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`.  
O índice recebe o nome de índice da chave ou, na sua falta, o nome de `CONSTRAINT` ou, na falta deste, nenhum nome, e mantém a ordem de ordenação de cada coluna. Um índice assim é uma [chave alternativa](./table-related-functions.md#alternate-keys).  
Um `UNIQUE` sobre uma só coluna, em qualquer dessas formas de escrita, ativa em vez disso o sinalizador Único dessa coluna e não adiciona nenhum índice, pelo que a restrição `UQ_<table name>_<column name>` que a exportação escreve volta como o sinalizador a partir do qual foi escrita. Um `CREATE UNIQUE INDEX` sobre uma só coluna continua a ser um índice único.

Um `ALTER TABLE` que adiciona várias chaves de uma vez, tal como o phpMyAdmin escreve `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)`, mantém todas as chaves únicas que contém: `uq_a` é importada como um índice único chamado `uq_a`, e `uq_c` como o sinalizador Único de `c`. Um nome de `CONSTRAINT` só dá nome à chave da sua própria cláusula. O `ADD UNIQUE INDEX IF NOT EXISTS n (...)` do MariaDB e os `ALTER TABLE t WITH CHECK ADD ...` e `WITH NOCHECK ADD ...` do SQL Server também são lidos.  
`CREATE INDEX` e `CREATE UNIQUE INDEX` são lidos com nomes qualificados como `public.t` e `[dbo].[t]`, com os `CLUSTERED` e `NONCLUSTERED` do SQL Server, com os `CONCURRENTLY`, `IF NOT EXISTS`, `ON ONLY` e `USING btree` do PostgreSQL e sem qualquer nome de índice. O grupo de ficheiros `ON [PRIMARY]` do SQL Server é ignorado.  
As opções de chave como `NULLS NOT DISTINCT` ou `USING BTREE` não são confundidas com o nome da chave. Na lista de colunas de uma chave, só a primeira palavra designa a coluna, pelo que `b DESC NULLS LAST`, `b text_pattern_ops` e `b COLLATE "C"` incluem todos a coluna `b` na chave, com `DESC` mantido como a sua ordem de ordenação. Um comprimento de prefixo como `email(191)` é saltado na leitura, mas uma chave com uma parte de expressão, como `lower(email)`, é ignorada por inteiro.

Um índice único parcial, `CREATE UNIQUE INDEX ... WHERE ...` ou o `INDEX n UNIQUE (...) WHERE ...` em linha do SQL Server, é importado como um índice simples com o mesmo nome e as mesmas colunas, porque uma chave única em toda a tabela seria mais restritiva do que a chave filtrada que o ficheiro declara. A exceção é um filtro composto apenas por testes `IS NOT NULL` sobre as colunas da chave unidos por `AND`, o filtro de que o SQL Server precisa para permitir que uma coluna única contenha mais do que um NULL: essa chave continua única.  
Uma chave única que indique uma coluna que a tabela não tem, como uma coluna adicionada por `ALTER TABLE ... ADD COLUMN`, é descartada por inteiro em vez de ser reduzida às colunas que existem. Um índice simples mantém as colunas que existem.

O SQL Developer e o `DBMS_METADATA` do Oracle escrevem o índice próprio de uma chave como um `CREATE UNIQUE INDEX` separado, com o nome da chave ou, no caso de uma chave sem nome seguida de `USING INDEX`, com um nome de sistema como `SYS_C0012345`. A importação lê esse índice, e o que um `ADD CONSTRAINT ... USING INDEX` indica, como parte da sua chave: uma chave única composta é importada como um índice único, e uma chave primária ou uma chave única de uma só coluna como os sinalizadores da coluna, sem índice adicional. Uma nova exportação para o Oracle cria então o índice uma única vez.

Uma exportação de Esquema SQL volta a ser importada com os mesmos sinalizadores Único e os mesmos índices para MySQL, MariaDB, MSSQL, Oracle, PostgreSQL e SQLite.  
O Snowflake não tem índices secundários, pelo que a sua exportação só traz de volta as chaves únicas: uma composta como um índice único e uma de uma só coluna como o sinalizador Único da coluna. Uma exportação para Databricks não declara nenhuma unicidade, pelo que nenhuma volta.

#### Chaves externas {#foreign-keys}

Uma chave externa torna-se uma relação nestas formas de escrita:

- Um `FOREIGN KEY (...) REFERENCES t (...)` ao nível da tabela, com ou sem `CONSTRAINT name`.
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`, incluindo os `ALTER TABLE t WITH CHECK ADD ...` e `WITH NOCHECK ADD ...` que o SQL Server Management Studio escreve.
- O `REFERENCES t (col)` em linha de uma coluna, como em `user_id INT REFERENCES users (id)`, e o `FOREIGN KEY REFERENCES t (col)` que o SQL Server e o Snowflake permitem nesse ponto. Uma referência em linha a mais do que uma coluna é ignorada.

Um `ALTER TABLE` origina no máximo uma relação, e só quando a sua primeira cláusula adiciona uma chave externa: uma cláusula `FOREIGN KEY` depois de uma cláusula `ADD PRIMARY KEY` ou `ADD UNIQUE` na mesma instrução não é lida. Quando uma instrução adiciona várias chaves externas, tal como o phpMyAdmin escreve `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...`, só a última é lida.

`REFERENCES t` sem lista de colunas aponta para a chave primária de `t` quando essa chave é uma só coluna. Perante uma chave primária composta, a chave externa é ignorada.  
Uma chave externa é ignorada, e nenhuma das suas colunas é marcada como chave externa, quando não é encontrada nenhuma das suas colunas referenciadas ou quando as colunas encontradas nas duas tabelas diferem em número, como quando falta uma coluna apenas numa delas. Quando falta às duas tabelas o mesmo número das suas colunas, as colunas encontradas são emparelhadas pela ordem em que estão escritas, e a relação contém apenas essas.  
Todas as relações importadas são do tipo `Zero N`, e uma relação é identificadora quando cada uma das suas colunas filhas é também uma chave primária.

As cláusulas `ON DELETE` e `ON UPDATE` de cada chave externa tornam-se os valores `On Delete` e `On Update` da relação: `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL` ou `SET DEFAULT`, sem distinguir maiúsculas de minúsculas e por qualquer ordem. Uma chave externa sem elas é importada como `Not set`. Consulte [Edição de relações](./relationship-editing.md#on-delete-and-on-update) para as definir no editor.  
A lista de colunas do PostgreSQL depois de `SET NULL` ou `SET DEFAULT`, como em `ON DELETE SET NULL (a_id)`, é saltada na leitura: a ação aplica-se a toda a chave, e um `ON UPDATE` depois da lista continua a ser lido. `MATCH FULL`, `MATCH PARTIAL` e `MATCH SIMPLE` são ignorados, e o atributo de coluna `ON UPDATE CURRENT_TIMESTAMP` do MySQL não é confundido com uma ação.  
Uma exportação de Esquema SQL volta a ser importada com as ações que essa base de dados escreve, pelo que uma ação que ela omite, como `SET DEFAULT` no MySQL, qualquer `ON UPDATE` no Oracle ou tudo o que não seja `NO ACTION` no Snowflake, volta como `Not set`.

#### Comentários {#comments}

Os comentários de tabelas e colunas são importados a partir das três sintaxes que o analisador lê: a opção de tabela e o atributo de coluna `COMMENT` usados pelo MySQL, pelo MariaDB, pelo Snowflake e pelo Databricks, as instruções `COMMENT ON TABLE` e `COMMENT ON COLUMN` usadas pelo PostgreSQL e pelo Oracle, e a propriedade estendida `MS_Description` que o SQL Server define com `EXEC sp_addextendedproperty`.  
Um comentário que indique uma tabela ou coluna que o ficheiro não define é ignorado.

As chamadas do SQL Server são lidas com argumentos nomeados, tal como o SQL Server Management Studio escreve todos os comentários (`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`), e com argumentos posicionais, tal como a exportação MSSQL do editor as escreve.  
Só uma propriedade `MS_Description` numa tabela, ou numa das suas colunas no nível 2, dá origem a um comentário. Outra propriedade, uma vista, um índice ou uma restrição não dão origem a nenhum, e o mesmo acontece com um comentário passado numa variável ou construído com `+`.

Num comentário, tal como em qualquer texto entre aspas, como um valor `DEFAULT` ou um nome entre aspas, uma aspa duplicada representa uma só aspa, tal como o mysqldump e o pg_dump a escrevem: `'it''s'` é lido como `it's`.  
Uma barra invertida antes de uma aspa, tal como o MySQL e o MariaDB escrevem `'it\'s'`, também escapa a aspa. Uma aspa assim continua a terminar o texto quando é seguida de um espaço em branco, `,`, `;`, `)`, `]`, `:`, `|`, `+` ou do fim do ficheiro, pelo que `'C:\'`, o `'C:\'::text` do pg_dump e o `'C:\'+name` do T-SQL mantêm a barra invertida.  
Um valor `DEFAULT` mantém as aspas, e uma aspa no seu interior é reescrita duplicada, seja qual for a forma como o ficheiro a escapou: `'it''s'`.  
Quando a base de dados do documento é Databricks no momento da importação, o texto entre aspas simples segue antes as regras do Spark: cada barra invertida escapa o carácter seguinte, pelo que `'C:\\dir'` é lido como `C:\dir`, sequências de escape como `\n`, `\t` e `\u0041` são descodificadas, e um valor `DEFAULT` é mantido como `'it\'s'`.

A forma como cada base de dados escreve um comentário na exportação, e como escapa uma aspa num comentário, é descrita em [Comentários](./schema-sql.md#comments), na página do Esquema SQL.  
Uma exportação para MySQL, MariaDB, PostgreSQL, Oracle, Snowflake ou MSSQL volta a ser importada com os mesmos comentários de tabelas e colunas, incluindo as aspas, exceto as linhas em branco que uma exportação Oracle omite. Uma exportação Databricks, que escapa uma aspa e uma barra invertida com uma barra invertida, só é lida de volta com exatidão enquanto o Databricks for a base de dados selecionada.  
Os comentários não sobrevivem a uma ida e volta de exportação e importação com SQLite: o SQLite escreve-os como simples linhas `--`, que o analisador não lê.  
Exceto no SQLite, um nome lógico que o interruptor `Write logical names into empty comments` escreveu num comentário vazio volta a ser importado como comentário dessa tabela ou coluna, e não como o seu nome lógico — consulte [Nomes lógicos como comentários](./schema-sql.md#logical-names-as-comments).

### GraphQL {#graphql}

Pode importar um documento GraphQL SDL.  
As definições de tipos de objeto tornam-se tabelas, um bloco `extend type` funde-se com o tipo que estende, e os campos das interfaces são herdados pelos tipos que as implementam.  
Um campo cujo tipo é outra tabela torna-se uma relação em vez de uma coluna, e uma lista em ambos os lados cria uma tabela de associação.  
Um campo singular como `buyer: User` é primeiro emparelhado com o único campo do outro tipo cujo nome termina em `By` seguido do nome desse campo, como `orderListByBuyer`, sem distinguir maiúsculas de minúsculas e ignorando os caracteres de sublinhado; um campo numerado como `buyer2` é emparelhado da mesma forma sem o seu número. É assim que a saída GraphQL do Gerador de código dá nome aos campos quando duas tabelas partilham mais do que uma relação ou uma tabela se refere a si própria, pelo que essa saída volta a ser importada com todas as relações.  
Os tipos raiz (`Query`, `Mutation`, `Subscription`), os tipos de introspeção e os tipos envolventes do Relay, da federação e do Hasura, como `PageInfo`, `*Connection`, `*Edge` e `*_aggregate`, são tratados como ruído e ignorados.  
As diretivas `@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index` e `@db.*` são respeitadas.  
O nome do ficheiro tem de terminar em `.graphql`, `.gql` ou `.graphqls`. Um ficheiro `schema.prisma` do Prisma não é um documento GraphQL e não pode ser importado aqui.

### DBML {#dbml}

Pode importar um ficheiro DBML, o formato usado pelo dbdiagram.io e pelo dbdocs.  
São lidos os blocos `Table`, `TablePartial`, `Ref`, `Enum` e `TableGroup`. Os blocos `Project` e os blocos `Note` autónomos são ignorados sem afetar as tabelas à sua volta.  
São aceites todas as formas de escrita de uma referência: a forma `Ref:` com dois pontos, uma referência com nome, a forma de bloco `Ref { }` e a definição de coluna em linha `[ref: > table.column]`.  
Uma referência muitos-para-muitos `<>` cria uma tabela de associação com o nome dos dois lados.  
As definições `delete` e `update` de uma referência autónoma tornam-se os valores `On Delete` e `On Update` da relação, como em `Ref: users.id < posts.user_id [delete: cascade, update: set null]`. Os valores são `cascade`, `restrict`, `set null`, `set default` e `no action`, sem distinguir maiúsculas de minúsculas. Qualquer outro valor, ou a ausência de definição, é importado como `Not set`, e as outras definições, como `color`, são ignoradas.  
A definição `[ref: ...]` em linha não transporta ações, e as definições de uma referência `<>` não passam para a tabela de associação. Quando a mesma chave externa é declarada em linha e como referência autónoma, mantém-se a declarada em linha, sem ações.  
A definição `headercolor` de uma tabela, como em `Table users [headercolor: #3498DB]`, torna-se a sua cor quando o valor é um hexadecimal `#rgb` ou `#rrggbb` escrito sem aspas. Qualquer outro valor é descartado, e o `headercolor` de um `TablePartial` não passa para as tabelas que o usam.  
Cada `TableGroup` torna-se um [grupo de tabelas](./table-groups.md) com as tabelas que enumera, uma por linha, designadas tal como um `Ref` as designa. O seu `[color: ...]` torna-se a cor do grupo segundo a mesma regra que `headercolor`, e a sua observação e as outras definições são descartadas. Uma tabela enumerada por dois grupos fica no primeiro. Um grupo que fique sem nenhuma tabela não é criado, quer não enumere nenhuma tabela que o ficheiro declare, quer enumere apenas tabelas já atribuídas a um grupo anterior. A caixa do grupo é ajustada às suas tabelas onde quer que estas sejam posicionadas, e, quando as tabelas são dispostas em linhas, as tabelas de um grupo ficam juntas.  
O nome do ficheiro tem de terminar em `.dbml`.

### AML {#aml}

Pode importar um ficheiro AML (Azimutt Markup Language). São aceites tanto a forma de escrita atual como a antiga v1.  
As entidades tornam-se tabelas, e os atributos aninhados são achatados num nome de coluna com pontos, como `settings.slug`.  
Os atributos são `NOT NULL` a menos que estejam marcados como `nullable`, e as construções para as quais o editor não tem lugar, como `check`, `type` e `tags`, são descartadas em vez de rejeitadas. Uma entidade marcada como vista é importada como uma tabela simples.  
A propriedade `color` de uma entidade, como em `users {color: red}`, torna-se a cor da sua tabela. Os nomes de cores do AML, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` e `gray`, são lidos sem distinguir maiúsculas de minúsculas, com ou sem aspas, cada um como o tom 500 da cor do Tailwind com esse nome, como `#ef4444` para `red`. Um hexadecimal entre aspas como `"#3498db"` é mantido tal como está escrito; um `#3498db` sem aspas não pode ser lido, porque `#` inicia um comentário AML. Qualquer outro valor, e uma propriedade `color` num atributo ou numa relação, é descartado.  
Uma instrução `rel` autónoma, ou `fk` na forma de escrita antiga, mantém as suas propriedades `onDelete` e `onUpdate` como os valores `On Delete` e `On Update` da relação, como em `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`. Os valores são `cascade`, `restrict`, `set null`, `set default` e `no action`, com ou sem aspas, sem distinguir maiúsculas de minúsculas. As outras propriedades são descartadas.  
Numa relação em linha como `user_id int -> users(id) {onDelete: cascade}`, as propriedades pertencem ao atributo, pelo que são descartadas e a relação é importada como `Not set`.  
O nome do ficheiro tem de terminar em `.aml`.

GraphQL, DBML e AML são formatos de ida e volta: cada um é também um destino do [Gerador de código](./code-generator.md).  
O DBML e o AML transportam o ON DELETE e o ON UPDATE de cada relação nos dois sentidos — consulte [Gerador de código](./code-generator.md#on-delete-and-on-update). O GraphQL não transporta nenhum dos dois, pelo que uma importação de GraphQL deixa ambos como `Not set`.  
O DBML transporta também as cores das tabelas, sem qualquer transparência, e cada grupo de tabelas que contenha uma tabela, nos dois sentidos. Um grupo sem nome volta como `group_1`, `group_2` e assim sucessivamente, e um nome de grupo repetido volta com `_2`, `_3` e assim sucessivamente acrescentado. O AML transporta a cor de uma tabela apenas como o mais próximo dos seus nomes de cores, pelo que `#FF8800` é escrito como `orange` e volta como `#f97316`, e não transporta grupos. O GraphQL não transporta cores nem grupos.  
Nenhum dos três transporta nomes lógicos, vínculos a domínios ou os dicionários, em nenhum dos sentidos: o Gerador de código escreve o nome físico e o tipo de dados de cada tabela e coluna, nunca um nome lógico nem um domínio.

## Exportar {#exporting}

O submenu `Export` do menu de contexto da tela tem três opções:

- json: Guarda o diagrama tal como o seu ficheiro o contém, como `.erd.json`: as tabelas com as suas colunas e índices, as relações, as notas e os grupos de tabelas, os nomes lógicos e os vínculos das colunas a domínios, as palavras, os termos e os domínios do separador [Dicionário](./dictionary.md), e as definições, cada [definição bloqueada](./settings.md#lock) com o seu valor bloqueado. O que não contém nada, como um texto vazio ou uma linha de dicionário vazia, é omitido — consulte [Forma de armazenamento e valor em tempo de execução](../../api/advanced/schema.md#storage-form-and-runtime-value).
- Schema SQL: Abre o separador [Esquema SQL](./schema-sql.md#saving-or-copying-the-sql) com o seu painel de opções aberto e o foco no botão `Save file`, pelo que premir `Enter` guarda como `.sql` o SQL que o separador mostra. Nada é guardado até lá.
- Image: Abre a caixa de diálogo `Export image`, que guarda o diagrama como `.png` ou `.svg`, ou o copia para a área de transferência como PNG — consulte [Imagem](#image).

As três funcionam num editor só de leitura.  
O botão `Export CSV` do próprio separador Dicionário, que não está neste submenu, guarda a sua folha `Domains`, `Words` ou `Terms` como ficheiro CSV. Ao contrário destas três opções, não é oferecido num editor só de leitura — consulte [Importar e exportar CSV](./dictionary.md#importing-and-exporting-csv).

O Esquema SQL escreve o ON DELETE e o ON UPDATE de cada relação depois do seu `REFERENCES`, primeiro o ON DELETE. O valor `Not set` não escreve nada, e uma ação que a base de dados selecionada não aceita é omitida. Consulte [Edição de relações](./relationship-editing.md#on-delete-and-on-update) para saber que base de dados aceita cada ação.

Cada ficheiro exportado tem o nome `<database name>-<timestamp>` seguido da sua extensão, com o carimbo de data/hora na hora local no formato `yyyy-MM-dd'T'HH_mm_ss` — por exemplo, `my-schema-2026-08-29T04_05_06.erd.json`. Um nome da base de dados em branco é substituído por `unnamed`.  
O botão `Save file` do separador Esquema SQL e o do [Gerador de código](./code-generator.md) dão nome aos ficheiros da mesma forma, tal como o botão `Export CSV`, que acrescenta a folha depois do carimbo de data/hora: `-words.csv`, `-terms.csv` ou `-domains.csv`. Uma imagem usa o nome da base de dados tal como estava quando a caixa de diálogo foi aberta.

As opções `Import`, `Import and Add` e `Export` também estão disponíveis na [pesquisa rápida](./quick-search.md) no separador ERD, com as mesmas entradas que o menu de contexto da tela.

No Obsidian não aparece nenhuma caixa de diálogo de transferência ou para guardar: o ficheiro é escrito no cofre, onde o Obsidian coloca os novos anexos desse diagrama, e um aviso indica o seu caminho.  
Os caracteres que o Obsidian não permite num nome de ficheiro, `\ / : * ? " < > |`, são substituídos por `-`.  
O explorador de ficheiros do Obsidian só lista um ficheiro `.erd.json` ou `.sql` exportado enquanto a opção Settings → Files and links → Detect all file extensions estiver ativada.

### Imagem {#image}

A opção `Export` ▸ `Image`, a partir do menu de contexto da tela ou da pesquisa rápida, abre a caixa de diálogo `Export image`: uma pré-visualização da imagem ao lado das suas opções. Um [explorador](./explorer.md#dialogs-beside-it) aberto continua aberto por baixo da área esbatida.

![Abrir Export > Image, desativar o modo escuro e o fundo, escolher 3x e copiar a imagem para a área de transferência](/img/demo-export.webp)

- `Background`: Ativado por predefinição. Desativado, deixa a tela transparente.
- `Dark mode`: Começa por corresponder ao aspeto do editor. Enquanto corresponder ao aspeto no ecrã, a imagem usa as próprias cores da tela, incluindo as alterações do [criador de temas](./language-and-theme.md); o outro aspeto usa o tema predefinido com o mesmo tom de cinzento e a mesma cor de destaque.
- `Scale`: `1x`, `2x` ou `3x`, com `2x` selecionado por predefinição. Define apenas o tamanho do PNG e da cópia para a área de transferência, e a linha por baixo indica esse tamanho, como `PNG <width> × <height> px`.

As escolhas mantêm-se até o editor fechar e nunca são guardadas no documento. A pré-visualização é desenhada da mesma forma que a imagem e volta a ser desenhada quando a opção `Background` ou a opção `Dark mode` muda.

A imagem contém o diagrama tal como estava quando a caixa de diálogo foi aberta; feche e volte a abrir a caixa de diálogo para incluir alterações posteriores. As suas tabelas e colunas são nomeadas na vista de nomes que o editor mostrava nesse momento, mesmo numa vista mudada apenas no seu ecrã enquanto o bloqueio `Name View` mantém outra no ficheiro — consulte [Além da tela](./logical-names.md#beyond-the-canvas). As cores que as [verificações do dicionário](./dictionary.md#marks-on-the-canvas) dão aos nomes na tela não são desenhadas. Contém o diagrama completo, por mais longe que a vista esteja deslocada, recortado ao que o diagrama desenha mais uma margem, e é sempre desenhada a 100%, seja qual for o zoom que o editor mostra, pelo que todas as tabelas são desenhadas por inteiro. O que o menu [Opções de vista](./table-related-functions.md#table-view-options) oculta — relações, as suas etiquetas ON DELETE e ON UPDATE, grupos de tabelas ou notas — não é desenhado nem recebe espaço, e os grupos de tabelas são desenhados atrás de tudo o resto.

Três botões escrevem a imagem, e cada um deixa a caixa de diálogo aberta:

- `PNG`: Guarda um `.png` com o tamanho do diagrama a 100% multiplicado pelo valor de `Scale`. Um PNG demasiado grande para um canvas do navegador é escrito com uma resolução reduzida em vez de falhar: a caixa de diálogo avisa antecipadamente com `Reduced from <width> × <height> px, past what a browser canvas can hold`, e um aviso que indica `Exported at a reduced resolution` informa disso depois.
- `SVG`: Guarda um `.svg` com o tamanho do diagrama a 100%, seja qual for o valor de `Scale`, e nunca reduzido. O seu texto continua a ser texto e os tipos de letra são referidos pelo nome em vez de incorporados, pelo que um visualizador sem o tipo de letra do editor desenha outro. As sombras são omitidas.
- `Copy to clipboard`: Coloca um PNG na área de transferência com o valor de `Scale` escolhido, reduzido tal como um PNG guardado quando um canvas do navegador não o consegue conter. Confirma com `Copied the image to the clipboard`, ou com `Copied at a reduced resolution` quando a imagem foi reduzida. Se a cópia falhar, porque o navegador ou o host recusa o acesso à área de transferência ou não foi possível desenhar a imagem, a mensagem `Couldn't copy the image` sugere que, em alternativa, guarde um PNG.

A imagem é desenhada num worker em segundo plano quando o host executa um, pelo que o editor continua utilizável entretanto. Um aviso que indica `Exporting PNG`, `Exporting SVG` ou `Copying image` aparece quando a operação demora mais do que um instante, e uma falha é comunicada como `Couldn't export the PNG` ou `Couldn't export the SVG`. Fechar a caixa de diálogo enquanto um ficheiro ainda está a ser desenhado não impede que esse ficheiro seja guardado.

O botão `PNG` tem o foco quando a caixa de diálogo se abre, e a tecla `Tab` mantém-se dentro da caixa de diálogo. A tecla `Escape`, o botão `x` ou um clique na área esbatida à sua volta fecham-na.  
Enquanto está aberta, os atalhos da tela, incluindo anular e refazer, bem como copiar e colar, não fazem nada. `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac) fecha-a e abre a pesquisa rápida. `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) fecha-a e coloca o cursor de texto no campo Localizar do [explorador](./explorer.md#opening-and-closing), abrindo o explorador se estiver fechado, sem nunca o fechar. Num editor demasiado estreito para mostrar o explorador, continua a fechar a caixa de diálogo, mas mostra uma notificação em vez de mover o cursor de texto.
