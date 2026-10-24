---
sidebar_position: 12
description: Ler o DDL do diagrama no separador Esquema SQL, escolher a base de dados, a delimitação, as instruções, o cabeçalho, os nomes lógicos nos comentários vazios e as tabelas no respetivo painel de opções, adicionar os seus próprios scripts antes e depois das tabelas e guardar ou copiar o SQL.
---

# Esquema SQL

O separador `Schema SQL` mostra o DDL do diagrama para a base de dados selecionada: o SQL que cria as suas tabelas com as respetivas chaves, índices e chaves externas.  
Mude para o separador `Schema SQL` na barra de ferramentas ou escolha `Schema SQL` na entrada `Tab` da [pesquisa rápida](./quick-search.md). Escolher `Schema SQL` no submenu `Export` também o abre, pronto a guardar — consulte [Guardar ou copiar o SQL](#saving-or-copying-the-sql).

O SQL fica à esquerda e, à sua direita, um painel de opções com o título `Schema SQL` reúne as escolhas que lhe dão forma — consulte [Painel de opções](#options-panel). Também num idioma de apresentação da direita para a esquerda, o SQL fica à esquerda e lê-se da esquerda para a direita.  
O painel abre-se sozinho, exceto se o editor for mais estreito do que 640 px quando o separador se abre pela primeira vez. O botão `Hide options` no cabeçalho do painel recolhe-o e o botão `Show options` no canto superior direito do código volta a mostrá-lo. A partir daí, mantém-se aberto ou recolhido tal como o deixou, mesmo ao mudar de separador, enquanto o editor estiver aberto. Recolhe-se e abre-se independentemente do painel do separador Gerador de código e nunca é guardado no ficheiro.

![Abrir Export > Schema SQL, mudar as instruções para Drop & re-create e o cabeçalho para USE e, depois, adicionar um script SET NAMES antes das tabelas](/img/demo-schema-sql-options.webp)

Clique com o botão direito no SQL para abrir o respetivo menu de contexto:

- `Database` e `Bracket`, cada um deles um submenu que marca o valor atual.
- `Statements` e `Header`, cada um deles um submenu que marca a escolha em vigor. Uma escolha que a base de dados não tem apresenta uma indicação esbatida como `not in Oracle` e não faz nada.
- `Options panel`, marcado enquanto o painel está visível, que o recolhe ou o abre.
- `Save file`

Enquanto este separador está aberto, a pesquisa rápida oferece `Database` e `Bracket`; `Schema SQL: Statements` e `Schema SQL: Header`, que listam apenas as escolhas que a base de dados tem; e `Schema SQL: Options panel`, que recolhe ou abre o painel.  
Nem o menu de contexto nem a pesquisa rápida oferecem o interruptor `Write logical names into empty comments`, que está apenas no painel de opções — consulte [Nomes lógicos como comentários](#logical-names-as-comments).

O SQL é escrito quando o separador se abre e novamente sempre que muda uma das escolhas do painel, o nome da base de dados ou um script. Uma edição feita às tabelas enquanto o separador está aberto, como a de um colaborador ou de um agente de programação, aparece quando sair do separador e voltar ou quando um desses elementos mudar.

O painel [Propriedades da tabela](./table-related-functions.md#table-properties) tem o seu próprio separador `Schema SQL`, que mostra o DDL de uma tabela. Escreve sempre instruções `CREATE` simples, sem cabeçalho nem scripts, nunca escreve um nome lógico num comentário vazio, não tem painel de opções e o seu menu de contexto oferece apenas `Database` e `Bracket`.

## Painel de opções {#options-panel}

O painel reúne três grupos, cada um sob uma legenda:

1. `Saved in the document`: `Database` e `Bracket` — consulte [Base de dados e delimitador](#database-and-bracket).
2. `This window only`: `Statements`, `Header`, `Write logical names into empty comments` e, enquanto o diagrama tiver um [grupo de tabelas](./table-groups.md), `Tables` — consulte [Instruções](#statements), [Cabeçalho](#header), [Nomes lógicos como comentários](#logical-names-as-comments) e [Tabelas](#tables).
3. `Saved in the document · written as is for every database`: os scripts `Before tables` e `After tables` — consulte [Scripts antes e depois das tabelas](#before-and-after-scripts).

Os botões `Save file` e `Copy` ficam na parte inferior do painel — consulte [Guardar ou copiar o SQL](#saving-or-copying-the-sql).

As escolhas sob a legenda `This window only` pertencem à janela do editor em que as faz. Não são guardadas no documento, partilhadas com colaboradores nem registadas para anulação, e voltam aos valores iniciais quando o editor é fechado ou recarregado; mudar de separador mantém-nas.  
A opção `Statements` começa em `If not exists`, a opção `Header` em `CREATE + USE` e o interruptor `Write logical names into empty comments` desativado. O SQL que uma página que incorpora o editor lê com [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) e o SQL que um [agente de programação lê](../../mcp/tools.md#reading-a-document) começam, em vez disso, em `Create`, sem cabeçalho, e não escrevem nomes lógicos, a menos que tal seja pedido.

Uma escolha que a base de dados selecionada não tem permanece no painel, esbatida, com a dica `Not in <database>`, como `Not in Oracle`, e premi-la não faz nada.  
O SQL usa então a forma mais próxima que a base de dados tem, e o botão dessa forma aparece premido: `If not exists` passa a `Create`, `CREATE + USE` a `USE`, ou a `None` onde a base de dados também não tem `USE`, e `USE` a `None`. A sua escolha é mantida, pelo que volta a aplicar-se ao mudar para uma base de dados que a tenha.

## Base de dados e delimitador {#database-and-bracket}

A opção `Database` é a base de dados do diagrama, a mesma definição que a opção `Database` do menu de contexto da tela e a do Gerador de código — consulte [Bases de dados](./table-related-functions.md#databases). Lista Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake e SQLite, começa em MySQL e é guardada no ficheiro como qualquer edição.

A opção `Bracket` define o delimitador colocado à volta dos nomes de tabelas, colunas, restrições e índices: `SingleQuote`, `DoubleQuote`, `Backtick` ou `None`, sem qualquer delimitação, que é a predefinição. É a mesma definição que a do Gerador de código — consulte [Delimitador](./code-generator.md#bracket).  
O Snowflake, que só delimita nomes com aspas duplas, usa-as com qualquer escolha exceto `None`, e o Databricks delimita sempre os nomes com acentos graves.  
A opção `Bracket` só é guardada no ficheiro enquanto o bloqueio `Bracket Type` do separador Definições estiver desativado, e um diagrama novo tem todos os bloqueios ativados. Enquanto o bloqueio está ativado, uma alteração reescreve o SQL no seu ecrã, mas o ficheiro mantém o valor bloqueado e o diagrama volta a abrir-se com ele — consulte [Bloqueio](./settings.md#lock).

Enquanto a base de dados é Oracle e o SQL contém um nome com mais de 30 bytes, que o Oracle 12.1 e anteriores recusam, uma indicação sob as duas listas nomeia cada um: `Oracle 12.2+ for names over 30 bytes: <names>`. Verifica os nomes de tabelas, colunas, esquemas, chaves, índices, sequências e triggers. O SQL em si não muda.

## Instruções {#statements}

A opção `Statements` decide como as tabelas são criadas:

- `Create` escreve instruções `CREATE` simples.
- `If not exists` ignora as tabelas e os índices que já existem. Existe no MySQL, no MariaDB, no PostgreSQL, no SQLite e no Databricks; o MSSQL, o Oracle e o Snowflake escrevem `Create` em vez disso.
  - O MySQL escreve cada tabela como `CREATE TABLE IF NOT EXISTS` com as suas restrições únicas, índices e chaves externas dentro dela, e coloca o lote inteiro entre `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` e `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;`.
  - O MariaDB coloca `IF NOT EXISTS` em cada instrução: no `CREATE TABLE`, em cada restrição `UNIQUE` e `FOREIGN KEY` e em cada `CREATE INDEX`.
  - O PostgreSQL escreve `CREATE TABLE IF NOT EXISTS` e `CREATE INDEX IF NOT EXISTS` e elimina cada chave externa com `DROP CONSTRAINT IF EXISTS` antes de a voltar a adicionar.
  - O SQLite escreve `CREATE TABLE IF NOT EXISTS` e `CREATE INDEX IF NOT EXISTS`.
  - O Databricks escreve `CREATE TABLE IF NOT EXISTS` e elimina cada chave externa com `DROP CONSTRAINT IF EXISTS` antes de a voltar a adicionar.
- `Drop & re-create` elimina todas as tabelas que escreve antes de as voltar a criar, exceto no Snowflake. Existe em todas as bases de dados:
  - O MySQL e o MariaDB escrevem um `DROP TABLE IF EXISTS` para cada tabela, entre as mesmas duas linhas que desativam e voltam a ativar as verificações de chaves externas.
  - O PostgreSQL escreve um único `DROP TABLE IF EXISTS` que nomeia todas as tabelas, o que falha se uma tabela fora da lista referenciar uma delas. Com um cabeçalho `CREATE + USE`, uma tabela cujo nome não indica esquema é eliminada desse esquema, como `shop.member`.
  - O MSSQL escreve uma única transação, que requer o SQL Server 2016 ou posterior, como indica a dica do botão, `SQL Server 2016+`. Elimina as chaves externas que as tabelas escritas contêm, depois as tabelas com um único `DROP TABLE IF EXISTS`, e reverte a transação em caso de erro. Uma chave externa contida numa tabela fora da lista continua a impedir a eliminação.
  - O SQLite escreve `PRAGMA foreign_keys=OFF;`, que se mantém desativado nessa ligação, e depois um `DROP TABLE IF EXISTS` para cada tabela.
  - O Oracle escreve `DROP TABLE … CASCADE CONSTRAINTS` para cada tabela e `DROP SEQUENCE` para cada sequência de incremento automático, cada um num bloco PL/SQL que termina com uma linha `/` e ignora o erro gerado por uma tabela ou sequência inexistente.
  - O Databricks escreve um `DROP TABLE IF EXISTS` para cada tabela.
  - O Snowflake não elimina nada e escreve `CREATE OR REPLACE TABLE` em vez disso.

Enquanto `Drop & re-create` está em vigor, um aviso no painel nomeia as tabelas que elimina: `Drops <tables> before creating them. Their rows are lost.` ou, no Snowflake, `Replaces <tables>. Their rows are lost.`  
São nomeadas por extenso até cinco tabelas. Acima de cinco, o aviso nomeia as quatro primeiras e conta as restantes, como `a, b, c, d, and 3 more tables`.

## Cabeçalho {#header}

A opção `Header` abre o SQL com as instruções que criam ou selecionam a base de dados, ou o esquema, em que é executado. O nome é o nome da base de dados do diagrama, escrito no campo `database name` da barra de ferramentas, e é delimitado com o carácter da opção `Bracket`.

- MySQL e MariaDB: `USE` escreve `USE shop;` e `CREATE + USE` escreve `CREATE DATABASE IF NOT EXISTS shop;` antes dessa instrução.
- MSSQL: `USE` escreve `USE shop` e `GO`, e `CREATE + USE` escreve `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` e `GO` antes dessas linhas.
- O PostgreSQL só tem `CREATE + USE`, que escreve `CREATE SCHEMA IF NOT EXISTS shop;` e `SET search_path TO shop, public;`.
- O Oracle só tem `USE`, que escreve `ALTER SESSION SET CURRENT_SCHEMA = shop;`. `CREATE + USE` passa a `USE`, pelo que esta é a linha que o Oracle escreve com o cabeçalho predefinido do separador.
- Snowflake e Databricks: `USE` escreve `USE SCHEMA shop;` e `CREATE + USE` escreve `CREATE SCHEMA IF NOT EXISTS shop;` antes dessa instrução.
- O SQLite não tem nenhum dos dois e não escreve cabeçalho.

Onde a base de dados tem `USE` ou `CREATE + USE`, a dica do botão indica o que escreve aí, como `CREATE SCHEMA + SET search_path` no PostgreSQL.

Só é escrito um cabeçalho enquanto o nome da base de dados for um identificador simples: uma letra ASCII (`A`–`Z`, `a`–`z`) ou `_`, seguida de letras ASCII, algarismos ou `_`.  
Qualquer outro nome, incluindo um nome vazio, não escreve cabeçalho, e o `DROP TABLE` do PostgreSQL não nomeia então nenhum esquema. Enquanto estiver em vigor um cabeçalho diferente de `None`, uma indicação sob a opção `Header` assinala-o: `Database name "<name>" is not a valid identifier.`  
O nome da base de dados de um diagrama novo está vazio, pelo que, até lhe dar um nome, o painel mostra `Database name "" is not a valid identifier.`

## Nomes lógicos como comentários {#logical-names-as-comments}

O interruptor `Write logical names into empty comments`, sob a legenda `This window only`, escreve no DDL o [nome lógico](./logical-names.md) de uma tabela ou coluna onde o seu comentário está vazio, em todas as bases de dados.

![Ativar Write logical names into empty comments no painel do Esquema SQL, o que escreve o nome lógico de cada coluna de order_items no seu COMMENT vazio, enquanto os comentários de members se mantêm](/img/demo-schema-sql-logical-names.webp)

- Um comentário com texto prevalece sempre: o nome lógico nunca o substitui nem lhe é acrescentado.
- Um comentário feito apenas de espaços em branco conta como vazio, pelo que o nome lógico é escrito no seu lugar. Um nome lógico vazio ou feito apenas de espaços em branco não escreve nada, e essa tabela ou coluna continua sem comentário.
- O nome lógico é escrito onde e na forma em que a base de dados escreve um comentário, com as aspas escapadas da mesma forma — consulte [Comentários](#comments).

No MySQL, por exemplo, uma coluna `id` com o nome lógico `Member ID` e sem comentário é escrita com `COMMENT 'Member ID'`, enquanto uma coluna `email` com o nome lógico `Email` e o comentário `Sign-in address` mantém `COMMENT 'Sign-in address'`.

Tal como `Statements` e `Header`, o interruptor pertence à janela e começa desativado — consulte [Painel de opções](#options-panel).  
Uma importação nunca volta a ler um comentário destes como nome lógico — consulte [Comentários](./file-import-export.md#comments).

## Tabelas {#tables}

Enquanto o diagrama tiver pelo menos um [grupo de tabelas](./table-groups.md), visível ou oculto, a opção `Tables` aparece sob a legenda `This window only` com uma caixa de verificação para cada escolha:

- `All`, que marca ou desmarca todas as caixas. Mostra um estado misto enquanto só algumas estão marcadas.
- Uma caixa por grupo de tabelas, pela ordem dos grupos do diagrama, com o nome do grupo como etiqueta, ou `unnamed` para um grupo sem nome, depois de um ponto na cor do grupo quando este tem cor.
- `No group`, para as tabelas que não pertencem a nenhum grupo.

Com todas as caixas marcadas, o separador escreve o diagrama inteiro.  
Com apenas algumas marcadas, escreve as tabelas das caixas marcadas com os respetivos índices e as chaves externas que contêm, incluindo uma que referencie uma tabela deixada de fora. Os scripts antes e depois das tabelas continuam a ser escritos, e `Drop & re-create`, o respetivo aviso e a indicação do Oracle sobre nomes longos abrangem apenas essas tabelas.  
Sem nenhuma caixa marcada, o separador não escreve nada e uma mensagem sobre o código indica `No tables chosen. Check some under Tables.` O botão `Save file` guarda então um ficheiro vazio e o botão `Copy` copia texto vazio.

Tal como `Statements` e `Header`, a escolha pertence à janela — consulte [Painel de opções](#options-panel).  
Um grupo adicionado mais tarde só começa marcado se todas as caixas estiverem marcadas nesse momento. Remover um grupo retira a sua caixa, e remover o último grupo volta a marcar tudo.  
A escolha aplica-se apenas a este separador. O separador `Schema SQL` do painel Propriedades da tabela e `getSchemaSQL()` não são afetados por ela.

## Scripts antes e depois das tabelas {#before-and-after-scripts}

Os campos `Before tables` e `After tables` contêm o seu próprio SQL, como instruções `CREATE EXTENSION` ou `SET` antes das tabelas, ou permissões, vistas e dados iniciais depois delas.  
São guardados no documento, um par para o diagrama inteiro, seja qual for a base de dados. Cada um é inserido no SQL tal como o escreveu, sem nunca ser verificado: o script antes das tabelas depois do cabeçalho e antes das instruções `DROP` e das tabelas, o script depois das tabelas mesmo no fim.

As quebras de linha são escritas como LF, e as linhas em branco antes de um script e os espaços em branco depois dele são removidos.  
No MSSQL, é acrescentada uma linha `GO` após um script cuja última linha não seja `GO` (ou `GO` com uma contagem), como indica a linha sob os dois campos. No Oracle, termine manualmente um bloco PL/SQL com a respetiva linha `/`.

Os campos realçam o SQL e crescem com o texto.  
Uma edição é aplicada quando sai do campo, ao clicar noutro sítio ou ao mudar de separador, e só então mudam o SQL ao lado e o documento. Um campo em que apenas clicou não altera nada.  
Uma edição de script altera o diagrama como qualquer outra edição: é guardada no ficheiro, os colaboradores veem-na e cada edição aplicada é um passo do [histórico de anulação](./undo-redo.md), que se anula a partir do separador ERD.  
Enquanto escreve num campo, o editor cede-lhe os seus próprios atalhos, pelo que `Ctrl + Z` (Windows/Linux) ou `⌘ + Z` (Mac) anula o que escreveu aí, e copiar, cortar e colar atuam sobre o texto e não sobre o diagrama.  
A pesquisa rápida e a [pesquisa do explorador](./find-and-replace.md) continuam a abrir-se com os respetivos atalhos, `Ctrl + K` e `Ctrl + F` (Windows/Linux) ou `⌘ + K` e `⌘ + F` (Mac). Como `Ctrl + F` ou `⌘ + F` muda para o separador ERD, aplica a sua edição, tal como qualquer mudança de separador.  
Um campo sem o foco do teclado acompanha uma alteração que um colaborador ou um [agente de programação](../../mcp/tools.md#settings) faça ao seu script. Um campo em que se encontra mostra essa alteração quando sai dele sem ter escrito. Se escreveu, o seu texto é aplicado quando sai e substitui o deles.

## Guardar ou copiar o SQL {#saving-or-copying-the-sql}

O comando `Save file`, na parte inferior do painel ou no menu de contexto, guarda exatamente o SQL que o separador mostra, com a base de dados, o delimitador, as instruções, o cabeçalho, os comentários com nomes lógicos, as tabelas e os scripts atuais, como `<database name>-<timestamp>.sql`. É nomeado e guardado como qualquer outra exportação — consulte [Exportar](./file-import-export.md#exporting).

A entrada `Export` ▸ `Schema SQL`, no menu de contexto da tela ou na pesquisa rápida, não guarda nada por si só.  
Muda para este separador, abre o painel de opções mesmo que estivesse recolhido e coloca o foco do teclado no botão `Save file`, pelo que premir `Enter` guarda o ficheiro.

O botão `Copy` na parte inferior do painel, ou o botão de cópia que aparece no canto superior direito do código enquanto passa o ponteiro sobre ele, copia o SQL.  
Uma notificação `Copied!` com uma marca de verificação confirma-o durante dois segundos. Se o navegador ou o host recusar o acesso à área de transferência, uma notificação `Couldn't copy to the clipboard` com um sinal de aviso indica-o em vez disso, durante cinco segundos. Copiar novamente substitui a notificação em vez de acrescentar outra.  
O SQL também pode ser selecionado, pelo que pode copiar apenas uma parte dele.

## O que o DDL escreve {#what-the-ddl-writes}

Estas regras aplicam-se onde quer que o editor escreva Esquema SQL: neste separador e no respetivo ficheiro, e no SQL que uma página que incorpora o editor ou um agente de programação lê.  
O separador `Schema SQL` do painel Propriedades da tabela segue-as para a única tabela que mostra. Não escreve sequências nem triggers do Oracle, nem chaves externas, exceto as do SQLite, que ficam dentro do respetivo `CREATE TABLE`. Também não escreve as instruções de comentário que o PostgreSQL, o Oracle e o MSSQL colocam a seguir a uma tabela, pelo que, nessas três bases de dados, não mostra comentários.

As partes surgem por esta ordem, separadas por uma linha em branco: o cabeçalho, o script antes das tabelas, as instruções `DROP`, as tabelas e o script depois das tabelas. As tabelas são escritas por ordem dos nomes.  
Um diagrama sem tabelas nem scripts não escreve nada, mesmo com um cabeçalho escolhido.

As tabelas e as colunas são escritas pelos seus nomes físicos, seja o que for que a [vista de nomes](./logical-names.md#name-view) mostre. Uma coluna vinculada a um domínio é escrita com o seu próprio tipo de dados, que o domínio define — consulte [Domínios e tipos de dados](./dictionary.md#domains-and-data-types).

### Incremento automático {#auto-increment}

Uma coluna marcada com `Auto Increment` é escrita como cada base de dados a escreve: `AUTO_INCREMENT` no MySQL e no MariaDB, `IDENTITY(1,1)` no MSSQL, `AUTOINCREMENT` no Snowflake e `GENERATED ALWAYS AS IDENTITY` no PostgreSQL e no Databricks.  
O Oracle recebe uma sequência `SEQ_<table>` e um trigger `SEQ_TRG_<table>` que preenche a coluna a partir dela. O trigger termina com uma linha `/`, pelo que o SQL\*Plus e o SQLcl o executam.

Onde uma base de dados não aceita incremento automático no tipo da coluna, a cláusula é omitida e uma linha de comentário a seguir à tabela nomeia a coluna:

- O PostgreSQL só o aceita em `smallint`, `integer` ou `bigint`, com qualquer um dos seus nomes: `INT`, `INTEGER`, `BIGINT`, `SMALLINT`, `INT2`, `INT4` ou `INT8`. Uma coluna de outro tipo não recebe a cláusula nem um valor predefinido, e o comentário indica, por exemplo, `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`
- O Databricks só o aceita em `BIGINT` ou `LONG`.
- O SQLite só aceita `AUTOINCREMENT` quando a chave primária de uma tabela tem uma só coluna, de um tipo inteiro, como `INT`, `BIGINT` ou `INT8`, com ou sem largura. Essa coluna é escrita como `INTEGER` e a chave como `PRIMARY KEY (id AUTOINCREMENT)`. Uma chave de uma só coluna de qualquer outro tipo é escrita sem ele.

### Ações referenciais {#referential-actions}

As ações ON DELETE e ON UPDATE que cada base de dados escreve estão listadas em [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Onde o Snowflake omite uma ação, um comentário acima do `ALTER TABLE` dessa chave externa nomeia-a, como `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### Nomes de tabelas qualificados com esquema {#schema-qualified-table-names}

Com `Bracket` em `None`, um nome de tabela com um ponto, como `sales.users`, é lido como um esquema e uma tabela, dividido pelo seu último ponto fora de parênteses retos ou aspas duplas.

- O MySQL, o MariaDB, o MSSQL, o Oracle e o PostgreSQL constroem os nomes automáticos que escrevem apenas a partir da parte da tabela: `FK_users_TO_orders` e `IDX_users` em todos os cinco, `UQ_users_email` em todos exceto o PostgreSQL e `PK_users` no MSSQL e no Oracle, os dois que dão nome à chave primária. Nesses dois, `[sales].[users]` e `"sales"."users"` também dão `PK_users`, e `[Order]` dá `PK_Order`.
- O SQLite não dá nome a restrições, pelo que o único nome automático que constrói é o do índice: `CREATE INDEX sales.IDX_users ON users`.
- O Oracle cria os índices da tabela, bem como a sequência e o trigger de uma coluna de incremento automático, no esquema da tabela: `sales.IDX_users`, `sales.SEQ_users` e `sales.SEQ_TRG_users`.
- No Oracle e no SQLite, um nome de índice ao qual tenha acrescentado manualmente um esquema mantém-no.
- Um nome automático de chave externa ou de índice que repita um anterior, sem distinguir maiúsculas de minúsculas, recebe um número. Com `sales.users` e `hr.Users` ambas referenciadas a partir de `orders`, a segunda chave é `FK_Users_TO_orders1`.

Com qualquer outro valor de `Bracket`, o nome completo da tabela é um único identificador, como `"PK_sales.users"`. O Snowflake e o Databricks mantêm sempre o nome completo.  
As linhas `Keys` do separador [Índices](./table-related-functions.md#indexes) mostram os mesmos nomes.

### Valores predefinidos {#defaults}

O valor predefinido de uma coluna é escrito tal como o escreveu, mas entre parênteses onde a base de dados só lê essa expressão dentro deles. Um valor predefinido já entre parênteses fica tal como está.

- O MySQL coloca entre parênteses tudo exceto um literal ou a hora atual, como `(uuid())`. Também coloca entre parênteses qualquer valor predefinido exceto `NULL` numa coluna `BLOB`, `TEXT`, `JSON`, espacial ou `LONG…`, e a hora atual em qualquer coluna que não seja `TIMESTAMP` ou `DATETIME`.
- O MariaDB coloca entre parênteses tudo exceto um literal, a hora atual, uma chamada de função ou um nome.
- O SQLite coloca entre parênteses tudo exceto um literal ou um nome, como `(datetime('now'))`.
- O PostgreSQL só coloca entre parênteses uma expressão com uma palavra como `AT TIME ZONE`, `AND`, `OR`, `IS`, `IN`, `LIKE`, `COLLATE` ou `= ANY` fora de parênteses, como `(now() AT TIME ZONE 'utc')`.
- O MSSQL, o Oracle, o Snowflake e o Databricks escrevem todos os valores predefinidos tal como foram escritos.

### Comentários {#comments}

O comentário de uma tabela ou coluna que não esteja em branco, ou o nome lógico que o interruptor [`Write logical names into empty comments`](#logical-names-as-comments) escreve no seu lugar, é escrito como cada base de dados escreve os comentários:

- O MySQL e o MariaDB escrevem-no em linha: uma coluna termina com `COMMENT 'Member ID'` e a tabela fecha com `) COMMENT 'Members';`, também no lote `If not exists` do MySQL.
- O Snowflake escreve o de uma coluna em linha, `COMMENT 'Member ID'`, e o da tabela numa linha própria depois do parêntese de fecho, `COMMENT = 'Members';`.
- O Databricks escreve o de uma coluna em linha e o da tabela como `COMMENT 'Members';` depois de `USING DELTA`.
- O PostgreSQL escreve `COMMENT ON TABLE member IS 'Members';` e `COMMENT ON COLUMN member.id IS 'Member ID';` logo a seguir ao `CREATE TABLE` da tabela. O Oracle escreve as mesmas instruções depois da tabela, das suas restrições únicas e da sua sequência e trigger de incremento automático.
- O MSSQL escreve uma chamada por tabela e por coluna, depois da tabela e das suas restrições únicas, cada uma seguida de `GO`: `EXECUTE sys.sp_addextendedproperty 'MS_Description', N'Members', 'schema', 'dbo', 'table', 'member'`, com `'column', 'id'` acrescentado no caso de uma coluna.  
  O texto é um literal nacional, `N'…'`, pelo que o SQL Server mantém o texto fora da página de código da base de dados, como o coreano, em vez de guardar pontos de interrogação.  
  Com `Bracket` em `None`, uma tabela com o nome `sales.users` dá o esquema `sales` e a tabela `users`, e o mesmo acontece com `[sales].[users]` e `"sales"."users"`, cujos parênteses retos e aspas duplas são removidos. Um nome sem esquema fica em `dbo`. Uma parte antes do esquema, como em `shop.sales.users`, executa o procedimento dessa base de dados, `shop.sys.sp_addextendedproperty`. Com qualquer outro valor de `Bracket`, o nome completo é a tabela, em `dbo`.
- O SQLite não guarda comentários, pelo que escreve cada um como uma linha `--` acima do que descreve: `-- Members` acima de `CREATE TABLE member` e `-- Member ID` acima da coluna.

Uma aspa dentro de um comentário entre aspas é duplicada, como em `'it''s'` e `N'it''s'`, e o mesmo acontece com uma aspa nos nomes que as chamadas do MSSQL passam. Em vez disso, o Databricks escapa uma aspa e uma barra invertida com uma barra invertida, como em `'it\'s'`, a forma que todas as versões do Spark leem. As linhas `--` do SQLite não ficam entre aspas, pelo que mantêm uma aspa tal como foi escrita: `-- it's`.  
De resto, o texto sai tal como foi escrito, incluindo as quebras de linha, exceto em duas bases de dados:

- O Oracle omite as linhas em branco, e uma linha feita apenas de espaços ou tabulações conta como em branco, porque o SQL\*Plus termina uma instrução numa linha em branco e ignora o resto dela. Um comentário de tabela com `Members`, uma linha em branco e `Active only` é escrito como `COMMENT ON TABLE member IS 'Members` com `Active only';` na linha seguinte.
- O SQLite escreve cada sequência de quebras de linha como um único espaço, porque uma quebra de linha terminaria a linha `--` e executaria o resto como SQL. O mesmo comentário é escrito como `-- Members Active only`.

A forma como estes comentários são lidos na importação é descrita em [Comentários](./file-import-export.md#comments).

## Editores só de leitura {#read-only-editors}

Num editor `readonly`, o separador funciona como habitualmente: `Database` e `Bracket` continuam a alterar o SQL apresentado, `Statements`, `Header`, `Write logical names into empty comments` e `Tables` continuam a funcionar, e `Save file` e `Copy` continuam a guardá-lo e a copiá-lo.  
Apenas os dois campos de script são só de leitura.
