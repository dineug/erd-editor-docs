---
sidebar_position: 12
description: Ler o DDL do diagrama na aba Esquema SQL, escolher o banco de dados, a delimitação, as instruções, o cabeçalho, os nomes lógicos em comentários vazios e as tabelas no painel de opções, adicionar seus próprios scripts antes e depois das tabelas e salvar ou copiar o SQL.
---

# Esquema SQL

A aba `Schema SQL` mostra o DDL do diagrama para o banco de dados selecionado: o SQL que cria suas tabelas com as respectivas chaves, índices e chaves estrangeiras.  
Mude para a aba `Schema SQL` na barra de ferramentas ou escolha `Schema SQL` em `Tab` na [pesquisa rápida](./quick-search.md). Escolher `Schema SQL` no submenu `Export` também a abre, pronta para salvar — consulte [Salvar ou copiar o SQL](#saving-or-copying-the-sql).

O SQL fica à esquerda e, à direita dele, um painel de opções com o título `Schema SQL` reúne as escolhas que lhe dão forma — consulte [Painel de opções](#options-panel). Em um idioma de exibição da direita para a esquerda, o SQL também fica à esquerda e é lido da esquerda para a direita.  
O painel se abre sozinho, a menos que o editor tenha menos de 640 px de largura quando a aba é aberta pela primeira vez. `Hide options`, no cabeçalho do painel, o recolhe, e `Show options`, no canto superior direito do código, o traz de volta. Depois disso, ele permanece aberto ou recolhido como você o deixou, mesmo ao trocar de aba, enquanto o editor estiver aberto. Ele se recolhe e se abre independentemente do painel da aba Gerador de código e nunca é salvo no arquivo.

![Abertura de Export > Schema SQL, troca das instruções para Drop & re-create e do cabeçalho para USE e, depois, adição de um script SET NAMES antes das tabelas](/img/demo-schema-sql-options.webp)

Clique com o botão direito no SQL para abrir seu menu de contexto:

- `Database` e `Bracket`, cada um deles um submenu que marca o valor atual.
- `Statements` e `Header`, cada um deles um submenu que marca a opção em vigor. Uma opção que o banco de dados não tem traz uma observação esmaecida, como `not in Oracle`, e não faz nada.
- `Options panel`, marcado enquanto o painel está visível, que o recolhe ou o abre.
- `Save file`

Enquanto esta aba está aberta, a pesquisa rápida oferece `Database` e `Bracket`; `Schema SQL: Statements` e `Schema SQL: Header`, que listam só as opções que o banco de dados tem; e `Schema SQL: Options panel`, que recolhe ou abre o painel.  
Nem o menu de contexto nem a pesquisa rápida oferecem a opção `Write logical names into empty comments`, que fica só no painel de opções — consulte [Nomes lógicos como comentários](#logical-names-as-comments).

O SQL é escrito quando a aba se abre e novamente sempre que muda uma das opções do painel, o nome do banco de dados ou um script. Uma edição feita nas tabelas enquanto a aba está aberta, como a de um colaborador ou de um agente de codificação, aparece quando você sai da aba e volta, ou quando um desses itens muda.

O painel [Propriedades da tabela](./table-related-functions.md#table-properties) tem uma aba `Schema SQL` própria, que mostra o DDL de uma tabela. Ela sempre escreve instruções `CREATE` simples, sem cabeçalho nem scripts, nunca escreve um nome lógico em um comentário vazio, não tem painel de opções, e seu menu de contexto oferece só `Database` e `Bracket`.

## Painel de opções {#options-panel}

O painel reúne três grupos, cada um sob uma legenda:

1. `Saved in the document`: `Database` e `Bracket` — consulte [Banco de dados e delimitador](#database-and-bracket). Um editor somente leitura dá a eles a legenda `This window only` — consulte [Editores somente leitura](#read-only-editors).
2. `This window only`: `Statements`, `Header`, `Write logical names into empty comments` e, enquanto o diagrama tiver um [grupo de tabelas](./table-groups.md), `Tables` — consulte [Instruções](#statements), [Cabeçalho](#header), [Nomes lógicos como comentários](#logical-names-as-comments) e [Tabelas](#tables).
3. `Saved in the document · written as is for every database`: os scripts `Before tables` e `After tables` — consulte [Scripts antes e depois das tabelas](#before-and-after-scripts).

`Save file` e `Copy` ficam no rodapé dele — consulte [Salvar ou copiar o SQL](#saving-or-copying-the-sql).

As escolhas em `This window only` pertencem à janela do editor em que são feitas. Elas não são salvas no documento, compartilhadas com colaboradores nem registradas para desfazer, e são redefinidas quando o editor é fechado ou recarregado; trocar de aba as mantém.  
`Statements` começa em `If not exists`, `Header`, em `CREATE + USE`, e a opção `Write logical names into empty comments`, desativada. O SQL que uma página que incorpora o editor lê com [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) e o SQL que um [agente de codificação lê](../../mcp/tools.md#reading-a-document) começam, em vez disso, em `Create`, sem cabeçalho, e não escrevem nomes lógicos, a menos que isso seja pedido.

Uma opção que o banco de dados selecionado não tem continua no painel, esmaecida, com a dica de ferramenta `Not in <database>`, como `Not in Oracle`, e pressioná-la não faz nada.  
O SQL então usa a forma mais próxima que o banco de dados tem, e o botão dessa forma aparece pressionado: `If not exists` recorre a `Create`, `CREATE + USE` a `USE`, ou a `None` quando o banco de dados também não tem `USE`, e `USE` a `None`. Sua escolha é mantida, então mudar para um banco de dados que a tenha a traz de volta.

## Banco de dados e delimitador {#database-and-bracket}

`Database` é o banco de dados do diagrama, a mesma configuração que `Database` no menu de contexto do canvas e no Gerador de código — consulte [Bancos de dados](./table-related-functions.md#databases). Ela lista Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake e SQLite, começa em MySQL e é salva no arquivo como qualquer edição.

`Bracket` define o delimitador colocado em volta dos nomes de tabelas, colunas, restrições e índices: `SingleQuote`, `DoubleQuote`, `Backtick` ou `None`, para nenhuma delimitação, que é o padrão. É a mesma configuração do Gerador de código — consulte [Delimitador](./code-generator.md#bracket).  
O Snowflake, que só delimita nomes com aspas duplas, as usa com qualquer opção exceto `None`, e o Databricks sempre delimita os nomes com acentos graves.  
`Bracket` só é salvo no arquivo enquanto o bloqueio `Bracket Type` da aba Configurações está desativado, e um diagrama novo tem todos os bloqueios ativados. Enquanto o bloqueio está ativado, uma alteração reescreve o SQL na sua tela, mas o arquivo mantém o valor bloqueado e o diagrama é reaberto com ele — consulte [Bloqueio](./settings.md#lock).

Enquanto o banco de dados for o Oracle e o SQL contiver um nome com mais de 30 bytes, que o Oracle 12.1 e versões anteriores recusam, uma observação abaixo das duas listas nomeia cada um deles: `Oracle 12.2+ for names over 30 bytes: <names>`. Ela verifica nomes de tabelas, colunas, esquemas, chaves, índices, sequências e triggers. O próprio SQL não muda.

## Instruções {#statements}

`Statements` decide como as tabelas são criadas:

- `Create` escreve instruções `CREATE` simples.
- `If not exists` ignora as tabelas e os índices que já existem. MySQL, MariaDB, PostgreSQL, SQLite e Databricks têm essa opção; MSSQL, Oracle e Snowflake escrevem `Create` em seu lugar.
  - O MySQL escreve cada tabela como `CREATE TABLE IF NOT EXISTS` com suas restrições de unicidade, índices e chaves estrangeiras dentro dela e coloca o lote inteiro entre `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` e `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;`.
  - O MariaDB coloca `IF NOT EXISTS` em cada instrução: no `CREATE TABLE`, em cada restrição `UNIQUE` e `FOREIGN KEY` e em cada `CREATE INDEX`.
  - O PostgreSQL escreve `CREATE TABLE IF NOT EXISTS` e `CREATE INDEX IF NOT EXISTS` e exclui cada chave estrangeira com `DROP CONSTRAINT IF EXISTS` antes de adicioná-la novamente.
  - O SQLite escreve `CREATE TABLE IF NOT EXISTS` e `CREATE INDEX IF NOT EXISTS`.
  - O Databricks escreve `CREATE TABLE IF NOT EXISTS` e exclui cada chave estrangeira com `DROP CONSTRAINT IF EXISTS` antes de adicioná-la novamente.
- `Drop & re-create` exclui todas as tabelas que escreve antes de criá-las novamente, exceto no Snowflake. Todos os bancos de dados têm essa opção:
  - O MySQL e o MariaDB escrevem um `DROP TABLE IF EXISTS` para cada tabela, entre as mesmas duas linhas que desativam e reativam as verificações de chave estrangeira.
  - O PostgreSQL escreve um único `DROP TABLE IF EXISTS` que nomeia todas as tabelas, o que falha se uma tabela fora da lista referenciar uma delas. Com um cabeçalho `CREATE + USE`, uma tabela cujo nome não indica esquema é excluída desse esquema, como `shop.member`.
  - O MSSQL escreve uma única transação, que exige o SQL Server 2016 ou posterior, como diz a dica de ferramenta `SQL Server 2016+` do botão. Ela exclui as chaves estrangeiras que as tabelas escritas têm, depois as tabelas, com um único `DROP TABLE IF EXISTS`, e é revertida em caso de erro. Uma chave estrangeira de uma tabela fora da lista ainda bloqueia a exclusão.
  - O SQLite escreve `PRAGMA foreign_keys=OFF;`, que permanece desativado nessa conexão, e depois um `DROP TABLE IF EXISTS` para cada tabela.
  - O Oracle escreve `DROP TABLE … CASCADE CONSTRAINTS` para cada tabela e `DROP SEQUENCE` para cada sequência de incremento automático, cada um em um bloco PL/SQL que termina com uma linha `/` e ignora o erro que uma tabela ou sequência inexistente gera.
  - O Databricks escreve um `DROP TABLE IF EXISTS` para cada tabela.
  - O Snowflake não exclui nada e escreve `CREATE OR REPLACE TABLE` em vez disso.

Enquanto `Drop & re-create` está em vigor, um aviso no painel nomeia as tabelas que essa opção exclui: `Drops <tables> before creating them. Their rows are lost.` ou, no Snowflake, `Replaces <tables>. Their rows are lost.`  
Com até cinco tabelas, todas são nomeadas. Acima de cinco, o aviso nomeia as quatro primeiras e conta as demais, como `a, b, c, d, and 3 more tables`.

## Cabeçalho {#header}

`Header` inicia o SQL com as instruções que criam ou selecionam o banco de dados, ou o esquema, em que ele é executado. O nome é o nome do banco de dados do diagrama, digitado no campo `database name` da barra de ferramentas, e é delimitado com o caractere definido em `Bracket`.

- MySQL e MariaDB: `USE` escreve `USE shop;`, e `CREATE + USE` escreve `CREATE DATABASE IF NOT EXISTS shop;` antes disso.
- MSSQL: `USE` escreve `USE shop` e `GO`, e `CREATE + USE` escreve `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` e `GO` antes disso.
- O PostgreSQL só tem `CREATE + USE`, que escreve `CREATE SCHEMA IF NOT EXISTS shop;` e `SET search_path TO shop, public;`.
- O Oracle só tem `USE`, que escreve `ALTER SESSION SET CURRENT_SCHEMA = shop;`. `CREATE + USE` recorre a ele, então esta é a linha que o Oracle escreve com o cabeçalho padrão da aba.
- Snowflake e Databricks: `USE` escreve `USE SCHEMA shop;`, e `CREATE + USE` escreve `CREATE SCHEMA IF NOT EXISTS shop;` antes disso.
- O SQLite não tem nenhum dos dois e não escreve cabeçalho.

Quando o banco de dados tem `USE` ou `CREATE + USE`, a dica de ferramenta do botão indica o que ele escreve nesse banco, como `CREATE SCHEMA + SET search_path` no PostgreSQL.

Um cabeçalho só é escrito enquanto o nome do banco de dados é um identificador simples: uma letra ASCII (`A`–`Z`, `a`–`z`) ou `_`, seguida de letras ASCII, dígitos ou `_`.  
Qualquer outro nome, inclusive um em branco, não escreve cabeçalho, e o `DROP TABLE` do PostgreSQL então não nomeia nenhum esquema. Enquanto um cabeçalho diferente de `None` está em vigor, uma observação abaixo de `Header` informa isso: `Database name "<name>" is not a valid identifier.`  
O nome do banco de dados de um diagrama novo fica em branco, então, até que você o nomeie, o painel mostra `Database name "" is not a valid identifier.`

## Nomes lógicos como comentários {#logical-names-as-comments}

`Write logical names into empty comments`, um interruptor em `This window only`, escreve o [nome lógico](./logical-names.md) de uma tabela ou coluna no DDL onde o comentário dela está vazio, em todos os bancos de dados.

![Ativação de Write logical names into empty comments no painel do Esquema SQL, que escreve o nome lógico de cada coluna de order_items no COMMENT vazio dela, enquanto os comentários de members permanecem](/img/demo-schema-sql-logical-names.webp)

- Um comentário com texto sempre prevalece: o nome lógico nunca o substitui nem é acrescentado a ele.
- Um comentário só com espaços em branco conta como vazio, então o nome lógico é escrito no lugar dele. Um nome lógico vazio ou só com espaços em branco não escreve nada, e essa tabela ou coluna continua sem comentário.
- O nome lógico é escrito onde e na forma em que o banco de dados escreve um comentário, com as aspas escapadas da mesma maneira — consulte [Comentários](#comments).

No MySQL, por exemplo, uma coluna `id` com o nome lógico `Member ID` e sem comentário é escrita com `COMMENT 'Member ID'`, enquanto uma coluna `email` com o nome lógico `Email` e o comentário `Sign-in address` mantém `COMMENT 'Sign-in address'`.

Assim como `Statements` e `Header`, o interruptor pertence à janela e começa desativado — consulte [Painel de opções](#options-panel).  
Uma importação nunca lê esse comentário de volta como nome lógico — consulte [Comentários](./file-import-export.md#comments).

## Tabelas {#tables}

Enquanto o diagrama tem pelo menos um [grupo de tabelas](./table-groups.md), visível ou oculto, `Tables` aparece em `This window only` com uma caixa de seleção para cada opção:

- `All`, que marca ou desmarca todas as caixas. Mostra um estado misto enquanto só algumas estão marcadas.
- Uma caixa por grupo de tabelas, na ordem dos grupos do diagrama, com o nome do grupo como rótulo, ou `unnamed` para um grupo sem nome, depois de um ponto na cor do grupo quando ele tem cor.
- `No group`, para as tabelas que não estão em nenhum grupo.

Com todas as caixas marcadas, a aba escreve o diagrama inteiro.  
Com só algumas marcadas, ela escreve as tabelas das caixas marcadas com seus índices e as chaves estrangeiras que elas têm, inclusive uma que referencie uma tabela deixada de fora. Os scripts antes e depois das tabelas continuam sendo escritos, e `Drop & re-create`, seu aviso e a observação do Oracle sobre nomes longos abrangem só essas tabelas.  
Sem nenhuma caixa marcada, a aba não escreve nada, e uma dica sobreposta ao código diz `No tables chosen. Check some under Tables.` `Save file` então salva um arquivo vazio, e `Copy` copia um texto vazio.

Assim como `Statements` e `Header`, a escolha pertence à janela — consulte [Painel de opções](#options-panel).  
Um grupo adicionado depois só começa marcado se todas as caixas estiverem marcadas nesse momento. Remover um grupo remove sua caixa, e remover o último grupo marca tudo de novo.  
A escolha vale só para esta aba. A aba `Schema SQL` do painel Propriedades da tabela e o método `getSchemaSQL()` não são afetados por ela.

## Scripts antes e depois das tabelas {#before-and-after-scripts}

`Before tables` e `After tables` contêm seu próprio SQL, como instruções `CREATE EXTENSION` ou `SET` antes das tabelas, ou concessões de permissões, views e dados iniciais depois delas.  
Eles são salvos no documento, um par para o diagrama inteiro, seja qual for o banco de dados. Cada um é escrito no SQL tal como você o digitou, sem nenhuma verificação: o script antes das tabelas entra depois do cabeçalho e antes das instruções `DROP` e das tabelas, e o script depois das tabelas, bem no final.

As quebras de linha são escritas como LF, e as linhas em branco antes de um script e os espaços em branco depois dele são descartados.  
No MSSQL, uma linha `GO` é adicionada após um script cuja última linha não seja `GO` (ou `GO` com uma contagem), como diz a linha abaixo dos dois campos. No Oracle, termine você mesmo um bloco PL/SQL com sua linha `/`.

Os campos realçam a sintaxe SQL e crescem conforme o texto.  
Uma edição é aplicada quando você sai do campo, clicando em outro lugar ou trocando de aba, e só então o SQL ao lado e o documento mudam. Um campo em que você apenas clicou não altera nada.  
Uma edição de script altera o diagrama como qualquer outra edição: ela é salva no arquivo, os colaboradores a veem, e cada edição aplicada é uma etapa do [histórico de desfazer](./undo-redo.md), que você desfaz pela aba ERD.  
Enquanto você digita em um campo, os atalhos do próprio editor ficam a cargo do campo, então `Ctrl + Z` (Windows/Linux) ou `⌘ + Z` (Mac) desfaz o que você digitou ali, e copiar, recortar e colar agem sobre o texto, e não sobre o diagrama.  
A pesquisa rápida e a [pesquisa do explorador](./find-and-replace.md) ainda se abrem pelos seus atalhos, `Ctrl + K` e `Ctrl + F` (Windows/Linux) ou `⌘ + K` e `⌘ + F` (Mac). Como `Ctrl + F` ou `⌘ + F` muda para a aba ERD, ele aplica sua edição, como faz qualquer troca de aba.  
Um campo sem o foco do teclado acompanha uma alteração que um colaborador ou um [agente de codificação](../../mcp/tools.md#settings) faça no script do campo. Um campo em que você está com o foco mostra essa alteração quando você sai dele sem ter digitado. Se você digitou, seu texto é aplicado quando você sai e substitui o deles.

## Salvar ou copiar o SQL {#saving-or-copying-the-sql}

`Save file`, no rodapé do painel ou no menu de contexto, salva exatamente o SQL que a aba mostra, com o banco de dados, o delimitador, as instruções, o cabeçalho, os comentários com nomes lógicos, as tabelas e os scripts atuais, como `<database name>-<timestamp>.sql`. Ele é nomeado e salvo como qualquer outra exportação — consulte [Exportar](./file-import-export.md#exporting).

`Export` ▸ `Schema SQL`, no menu de contexto do canvas ou na pesquisa rápida, não salva nada por si só.  
Ele muda para esta aba, abre o painel de opções mesmo que ele esteja recolhido e coloca o foco do teclado em `Save file`, então pressionar `Enter` salva o arquivo.

`Copy`, no rodapé do painel, ou o botão de copiar que aparece no canto superior direito do código enquanto você passa o ponteiro sobre ele, copia o SQL.  
Uma notificação `Copied!` com uma marca de seleção confirma a cópia por dois segundos. Se o navegador ou o host recusar o acesso à área de transferência, em vez disso uma notificação `Couldn't copy to the clipboard` com um sinal de alerta informa o ocorrido, por cinco segundos. Copiar de novo substitui a notificação em vez de adicionar outra.  
O SQL também pode ser selecionado, então é possível pegar só uma parte dele.

## O que o DDL escreve {#what-the-ddl-writes}

Estas regras valem onde quer que o editor escreva Esquema SQL: nesta aba e no arquivo dela, e no SQL que uma página que incorpora o editor ou um agente de codificação lê.  
A aba `Schema SQL` do painel Propriedades da tabela as segue para a única tabela que mostra. Ela não escreve a sequência nem o trigger do Oracle, nem chaves estrangeiras, exceto as do SQLite, que ficam dentro do seu `CREATE TABLE`. Também não escreve as instruções de comentário que o PostgreSQL, o Oracle e o MSSQL colocam depois de uma tabela, então, nesses três, ela não mostra comentários.

As partes vêm nesta ordem, separadas por uma linha em branco: o cabeçalho, o script antes das tabelas, as instruções `DROP`, as tabelas e o script depois das tabelas. As tabelas são escritas ordenadas pelo nome.  
Um diagrama sem tabelas e sem scripts não escreve nada, mesmo com um cabeçalho escolhido.

As tabelas e colunas são escritas pelos nomes físicos, seja qual for a [exibição de nomes](./logical-names.md#name-view) em uso. Uma coluna vinculada a um domínio é escrita com seu próprio tipo de dados, que o domínio define — consulte [Domínios e tipos de dados](./dictionary.md#domains-and-data-types).

### Incremento automático {#auto-increment}

Uma coluna marcada com `Auto Increment` é escrita como cada banco de dados a escreve: `AUTO_INCREMENT` no MySQL e no MariaDB, `IDENTITY(1,1)` no MSSQL, `AUTOINCREMENT` no Snowflake e `GENERATED ALWAYS AS IDENTITY` no PostgreSQL e no Databricks.  
O Oracle recebe uma sequência `SEQ_<table>` e um trigger `SEQ_TRG_<table>` que preenche a coluna a partir dela. O trigger termina com uma linha `/`, então o SQL\*Plus e o SQLcl o executam.

Quando um banco de dados não aceita incremento automático no tipo da coluna, a cláusula é deixada de fora, e uma linha de comentário depois da tabela nomeia a coluna:

- O PostgreSQL só o aceita em `smallint`, `integer` ou `bigint`, com qualquer um de seus nomes: `INT`, `INTEGER`, `BIGINT`, `SMALLINT`, `INT2`, `INT4` ou `INT8`. Uma coluna de outro tipo não recebe nem a cláusula nem um valor padrão, e o comentário diz, por exemplo, `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`
- O Databricks só o aceita em `BIGINT` ou `LONG`.
- O SQLite só aceita `AUTOINCREMENT` na coluna que forma sozinha a chave primária de uma tabela, quando ela é de um tipo inteiro, como `INT`, `BIGINT` ou `INT8`, com ou sem largura. Essa coluna é escrita como `INTEGER`, e a chave, como `PRIMARY KEY (id AUTOINCREMENT)`. Uma chave de uma só coluna de qualquer outro tipo é escrita sem ele.

### Ações referenciais {#referential-actions}

As ações ON DELETE e ON UPDATE que cada banco de dados escreve estão listadas em [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Quando o Snowflake deixa uma ação de fora, um comentário acima do `ALTER TABLE` dessa chave estrangeira a nomeia, como `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### Nomes de tabela qualificados com esquema {#schema-qualified-table-names}

Com `Bracket` em `None`, um nome de tabela com ponto, como `sales.users`, é lido como um esquema e uma tabela, dividido no último ponto que estiver fora de colchetes ou aspas duplas.

- MySQL, MariaDB, MSSQL, Oracle e PostgreSQL formam os nomes automáticos que escrevem só a partir da parte de tabela: `FK_users_TO_orders` e `IDX_users` nos cinco, `UQ_users_email` em todos, exceto no PostgreSQL, e `PK_users` no MSSQL e no Oracle, os dois entre eles que dão nome à chave primária. Nesses dois, `[sales].[users]` e `"sales"."users"` também geram `PK_users`, e `[Order]` gera `PK_Order`.
- O SQLite não nomeia restrições, então o único nome automático que ele forma é o do índice: `CREATE INDEX sales.IDX_users ON users`.
- O Oracle cria os índices da tabela, e a sequência e o trigger de uma coluna com incremento automático, no esquema da tabela: `sales.IDX_users`, `sales.SEQ_users` e `sales.SEQ_TRG_users`.
- No Oracle e no SQLite, um nome de índice ao qual você mesmo deu um esquema o mantém.
- Um nome automático de chave estrangeira ou de índice que repete um anterior, sem diferenciar maiúsculas de minúsculas, recebe um número. Com `sales.users` e `hr.Users` ambos referenciados a partir de `orders`, a segunda chave é `FK_Users_TO_orders1`.

Com qualquer outro `Bracket`, o nome de tabela inteiro é um único identificador, como `"PK_sales.users"`. O Snowflake e o Databricks sempre mantêm o nome inteiro.  
As linhas `Keys` da aba [Índices](./table-related-functions.md#indexes) mostram os mesmos nomes.

### Valores padrão {#defaults}

O valor padrão de uma coluna é escrito como você o digitou, mas entre parênteses quando o banco de dados só lê essa expressão dentro deles. Um valor padrão que já está entre parênteses fica como está.

- O MySQL coloca entre parênteses tudo, exceto um literal ou a hora atual, como `(uuid())`. Ele também coloca entre parênteses qualquer valor padrão, exceto `NULL`, em uma coluna `BLOB`, `TEXT`, `JSON`, espacial ou `LONG…`, e a hora atual em qualquer coluna que não seja `TIMESTAMP` ou `DATETIME`.
- O MariaDB coloca entre parênteses tudo, exceto um literal, a hora atual, uma chamada de função ou um nome.
- O SQLite coloca entre parênteses tudo, exceto um literal ou um nome, como `(datetime('now'))`.
- O PostgreSQL só coloca entre parênteses uma expressão com uma palavra como `AT TIME ZONE`, `AND`, `OR`, `IS`, `IN`, `LIKE`, `COLLATE` ou `= ANY` fora de parênteses, como `(now() AT TIME ZONE 'utc')`.
- MSSQL, Oracle, Snowflake e Databricks escrevem todo valor padrão como foi digitado.

### Comentários {#comments}

O comentário de uma tabela ou coluna que não está em branco, ou o nome lógico que [`Write logical names into empty comments`](#logical-names-as-comments) escreve no lugar dele, é escrito como cada banco de dados escreve comentários:

- O MySQL e o MariaDB o escrevem na mesma linha: uma coluna termina com `COMMENT 'Member ID'`, e a tabela termina com `) COMMENT 'Members';`, inclusive no lote `If not exists` do MySQL.
- O Snowflake escreve o de uma coluna na mesma linha, `COMMENT 'Member ID'`, e o da tabela em uma linha própria depois do parêntese de fechamento, `COMMENT = 'Members';`.
- O Databricks escreve o de uma coluna na mesma linha, e o da tabela como `COMMENT 'Members';` depois de `USING DELTA`.
- O PostgreSQL escreve `COMMENT ON TABLE member IS 'Members';` e `COMMENT ON COLUMN member.id IS 'Member ID';` logo depois do `CREATE TABLE` da tabela. O Oracle escreve as mesmas instruções depois da tabela, das restrições de unicidade dela e da sequência e do trigger de incremento automático dela.
- O MSSQL escreve uma chamada por tabela e por coluna, depois da tabela e das restrições de unicidade dela, cada uma seguida de `GO`: `EXECUTE sys.sp_addextendedproperty 'MS_Description', N'Members', 'schema', 'dbo', 'table', 'member'`, com `'column', 'id'` acrescentado para uma coluna.  
  O texto é um literal nacional, `N'…'`, para que o SQL Server mantenha o texto fora da página de código do banco de dados, como o coreano, em vez de armazenar pontos de interrogação.  
  Com `Bracket` em `None`, uma tabela chamada `sales.users` resulta no esquema `sales` e na tabela `users`, assim como `[sales].[users]` e `"sales"."users"`, cujos colchetes e aspas duplas são descartados. Um nome sem esquema fica em `dbo`. Uma parte antes do esquema, como em `shop.sales.users`, executa o procedimento desse banco de dados, `shop.sys.sp_addextendedproperty`. Com qualquer outro `Bracket`, o nome inteiro é a tabela, em `dbo`.
- O SQLite não armazena comentários, então escreve cada um como uma linha `--` acima do que ele descreve: `-- Members` acima de `CREATE TABLE member` e `-- Member ID` acima da coluna.

Uma aspa dentro de um comentário entre aspas é duplicada, como em `'it''s'` e `N'it''s'`, assim como uma aspa nos nomes que as chamadas do MSSQL passam. O Databricks, em vez disso, escapa uma aspa e uma barra invertida com uma barra invertida, como em `'it\'s'`, a forma que todas as versões do Spark leem. As linhas `--` do SQLite não ficam entre aspas, então mantêm uma aspa como foi digitada: `-- it's`.  
Fora isso, o texto é escrito como foi digitado, incluindo as quebras de linha, exceto em dois bancos de dados:

- O Oracle omite as linhas em branco, e uma linha só com espaços ou tabulações conta como em branco, porque o SQL\*Plus encerra uma instrução em uma linha em branco e ignora o restante dela. Um comentário de tabela com `Members`, uma linha em branco e `Active only` é escrito como `COMMENT ON TABLE member IS 'Members` com `Active only';` na linha seguinte.
- O SQLite escreve cada sequência de quebras de linha como um único espaço, porque uma quebra de linha encerraria a linha `--` e executaria o restante como SQL. O mesmo comentário é escrito como `-- Members Active only`.

O modo como esses comentários são lidos de volta na importação é descrito em [Comentários](./file-import-export.md#comments).

## Editores somente leitura {#read-only-editors}

Em um editor [`readonly`](../../api/erd-editor-element.md#readonly), a aba funciona para quem lê, e nada feito nela chega ao documento:

- `Database` e `Bracket` ainda reescrevem o SQL, mas apenas naquela janela, então o painel também dá a eles a legenda `This window only`. Uma escolha não é salva no arquivo, nem compartilhada com colaboradores, nem registrada para desfazer, quaisquer que sejam os bloqueios, e uma alteração de um colaborador em uma configuração que você escolheu mantém a sua escolha na tela. A aba Gerador de código mostra a mesma escolha, e [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) chamado sem um banco de dados também a escreve. Quando o editor volta a ser editável, o banco de dados e o delimitador do documento retornam.
- `Statements`, `Header`, `Write logical names into empty comments` e `Tables` funcionam como em qualquer lugar, já que pertencem à janela de qualquer forma.
- Os dois campos de script são somente leitura: mostram os scripts do documento, que o SQL continua escrevendo, e não aceitam digitação.
- `Save file` e `Copy` salvam e copiam o SQL que a aba mostra.
