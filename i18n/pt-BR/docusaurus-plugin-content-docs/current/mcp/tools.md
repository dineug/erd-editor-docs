---
sidebar_position: 4
description: Todas as ferramentas que o servidor MCP do erd-editor oferece — a leitura de um documento uma página por vez, as 54 ferramentas de edição, erd_batch e como são um resultado e uma recusa.
---

# Ferramentas

O servidor oferece 63 ferramentas: cinco ferramentas de sessão, três ferramentas de leitura, 54 ferramentas de edição, uma por operação de edição, e `erd_batch`, que executa várias ferramentas de edição como uma única edição.

Todas as ferramentas, exceto `erd_list_documents`, recebem o `path` do documento como primeiro argumento, e as tabelas abaixo o omitem.
Um argumento marcado com `?` é opcional.

## Ferramentas de sessão {#session-tools}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_list_documents` | | Lista os documentos ERD com `path`, `open`, `active`, `dirty` e `readonly`: os do editor que atende o diretório de trabalho, o que em uma IDE da JetBrains abrange todos os projetos abertos, ou, caso contrário, os arquivos ERD sob o diretório de trabalho. |
| `erd_open_document` | `create?` | Abre um documento para edição, no ERD Editor do editor que o atende, se houver um. Com `create`, cria antes o arquivo se ele não existir, e um nome sem extensão recebe `.erd.json`. |
| `erd_save` | | Salva um documento mantido por um editor. O VS Code mantém as edições do agente não salvas até que esta ferramenta seja chamada; o Obsidian e uma IDE da JetBrains as salvam como salvam as suas, e esta ferramenta as grava imediatamente. No modo headless, cada edição já está gravada e esta ferramenta não faz nada. |
| `erd_undo` | | Reverte a última edição feita por este agente, nunca as suas. As chamadas que não criaram nenhuma entrada de desfazer são puladas e indicadas pelo nome. |
| `erd_redo` | | Aplica novamente a última edição revertida por `erd_undo`. |

Consulte [Ao vivo e headless](./live-and-headless.md) para saber o que o salvamento e o desfazer fazem em cada modo.

## Ler um documento {#reading-a-document}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | As configurações e as contagens, depois uma página de tabelas com seus índices e relacionamentos, cada tabela com seu id, sua posição e seu tamanho no canvas, seu número de colunas e seu grupo de tabelas, se estiver em um. A menos que faça uma pesquisa, os grupos de tabelas e depois as notas vêm após as tabelas. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?` | As entidades indicadas, por completo: tabelas com suas colunas e seu grupo de tabelas, relacionamentos com suas colunas e seus `onDelete` e `onUpdate`, índices com suas colunas, notas com seu texto, grupos de tabelas com suas tabelas. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `tableIds?`, `tableNames?`, `groupNames?` | O documento inteiro de uma vez em um de quatro formatos, ou o DDL de apenas algumas tabelas ou grupos de tabelas. |

Um agente encontra os ids com `erd_list`, lê colunas e outros detalhes com `erd_get` e passa esses ids às ferramentas de edição.
O tamanho de uma tabela em `erd_list` é a caixa que ela ocupa no canvas: a altura exata, a largura aproximada.
Um grupo de tabelas é listado pelo retângulo que armazena, com seu nome, sua cor e quantas tabelas contém.
Cada relacionamento é listado uma vez, com uma de suas duas tabelas.
As configurações que `erd_list` e `erd_read` informam são as que o arquivo salva — consulte [Configurações](#settings).

`erd_read` recebe um de quatro formatos:

| `format` | O que responde |
| --- | --- |
| `snapshot` | JSON compacto com cada entidade e seu id, incluindo os grupos de tabelas, e as configurações com os scripts do Esquema SQL. Omite o que varia de um usuário para outro: as larguras medidas, a ordem de empilhamento, a área visível e a aba. Grande em um esquema extenso. |
| `sql` | DDL para um dos oito bancos de dados, `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` ou `SQLite`. `vendor` tem como padrão o banco de dados definido no documento. O DDL do documento inteiro inclui seus scripts antes e depois das tabelas. Com `tableIds`, `tableNames` ou `groupNames`, apenas essas tabelas, com as chaves estrangeiras que contêm, e nenhum script. As chaves estrangeiras trazem suas ações ON DELETE e ON UPDATE, exceto as que o banco de dados de destino omite — consulte [ON DELETE e ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | O documento inteiro exatamente como um salvamento grava o arquivo, incluindo as edições que o editor ainda não salvou — consulte [Forma de armazenamento e valor em tempo de execução](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Apenas os scripts antes e depois das tabelas do documento, como `{"before":"…","after":"…"}`, cada um vazio quando não definido, por maior que seja o esquema. |

Apenas o formato `sql` recebe `vendor`, `statements`, `header`, `tableIds`, `tableNames` e `groupNames`, e qualquer outro formato os recusa.

- `statements`: `create`, o padrão; `ifNotExists`, que escreve `CREATE TABLE IF NOT EXISTS` no MySQL, MariaDB, PostgreSQL, SQLite e Databricks e um `CREATE TABLE` simples nos demais; ou `recreate`, que exclui as tabelas antes de criá-las, caso em que o Snowflake escreve `CREATE OR REPLACE TABLE` em vez disso.
- `header`: `none`, o padrão; `use`, que seleciona o banco de dados ou o esquema indicado pelo nome do banco de dados do documento; ou `createAndUse`, que o cria antes. O Oracle só tem `use`, então `createAndUse` escreve `use` nele, e o PostgreSQL só tem `createAndUse`, então `use` não escreve nenhum cabeçalho nele. O SQLite não escreve nenhum, e nenhum banco de dados escreve um enquanto o nome do banco de dados estiver em branco ou não for um identificador simples.
- `groupNames`: as tabelas dos grupos de tabelas indicados, pelo nome, sem diferenciar maiúsculas de minúsculas, somadas às de `tableIds` e `tableNames`. Um nome que não corresponde a nenhum grupo é recusado com `notFound`. Um grupo que não contém nenhuma tabela não acrescenta nenhuma, e uma leitura que fica sem nenhuma tabela, como quando todos os grupos indicados estão vazios e nenhuma tabela é indicada, é recusada com `invalidArgs`.

`statements` e `header` também se aplicam ao DDL de algumas tabelas. Funcionam como as opções `Statements` e `Header` da aba [Esquema SQL](../guide/guides/schema-sql.md#options-panel) do editor, embora a aba comece em `If not exists` e `CREATE + USE`.
Os nomes são delimitados com o tipo de delimitador que o arquivo salva, o bloqueado enquanto `Bracket Type` estiver bloqueado — consulte [Bloqueio](../guide/guides/settings.md#lock).

### Esquemas grandes {#large-schemas}

Esquemas de centenas ou milhares de tabelas também funcionam.
Uma leitura responde com no máximo 40.000 caracteres, abaixo do limite a partir do qual o Claude Code coloca o resultado de uma ferramenta à parte, em um arquivo.

- `erd_list` responde com uma página de 100 por padrão, primeiro as tabelas, depois os grupos de tabelas, depois as notas, e indica onde começa a próxima página com `nextOffset` e uma `note`. Passe esse `nextOffset` como `offset`, com o mesmo `query`.
- `query` encontra tabelas por palavras no nome ou no comentário de uma tabela ou coluna, sem diferenciar maiúsculas de minúsculas. As tabelas cujos nomes contêm mais dessas palavras vêm primeiro. Uma pesquisa não lista grupos de tabelas nem notas.
- `namesOnly` lista apenas os nomes das tabelas, cerca de 2.000 nomes curtos em uma resposta.
- `erd_get` e `erd_read` recebem `tableNames`, além dos ids, e `erd_read` recebe `groupNames`, de modo que um agente a quem se pede uma consulta SQL sobre um esquema grande lê o DDL apenas das tabelas de que precisa.
- `erd_get` lista em `missing` os ids e nomes que não indicam nada, e em `notReturned` os ids para os quais uma resposta não tem espaço, para que sejam pedidos de novo.
- Uma leitura grande demais para uma resposta é recusada com `tooLarge`, com instruções de como restringi-la.

## Ferramentas de edição {#edit-tools}

Os ids vêm de `erd_list` e `erd_get`, ou do `createdIds` da chamada que criou a entidade.
Um id novo tem 25 caracteres, entre letras minúsculas e dígitos, como `03h17be2plxpj5n59tqag7ogj`, enquanto um id que o documento já contém mantém sua forma, então não tire conclusões do formato de um id.
`x` e `y` são as bordas esquerda e superior no canvas, em pixels, e uma cor é uma cor hexadecimal CSS como `#3b82f6`, ou uma string vazia, que remove a cor.

### Tabelas {#tables}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_table` | | Adiciona uma tabela vazia em um espaço livre e retorna seu id em `createdIds`. |
| `erd_remove_table` | `tableId` | Remove uma tabela com suas colunas, seus índices e todos os relacionamentos ligados a ela. |
| `erd_change_table_name` | `tableId`, `value` | Renomeia uma tabela. |
| `erd_change_table_comment` | `tableId`, `value` | Define o comentário de uma tabela. Uma string vazia o remove. |
| `erd_change_table_color` | `tableId`, `color` | Define a cor de uma tabela. |
| `erd_move_table` | `tableId`, `x`, `y` | Move uma tabela para uma posição no canvas. |
| `erd_move_tables` | `positions` | Move várias tabelas em uma única edição, que um único `erd_undo` reverte. `positions` contém `{ tableId, x, y }` por tabela, cada tabela no máximo uma vez. |
| `erd_sort_tables` | | Posiciona todas as tabelas em linhas pelo canvas, primeiro as tabelas com menos colunas, como `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` e `erd_import_aml` as posicionam. As tabelas de um grupo de tabelas ficam juntas, e a caixa de cada grupo é ajustada ao redor delas. |

### Colunas {#columns}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Adiciona uma coluna vazia a uma tabela e retorna seu id em `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Remove colunas de uma única tabela, com os relacionamentos e as entradas de índice que as usam. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Renomeia uma coluna. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Define o tipo de dados, como `INT` ou `VARCHAR(255)`. Enquanto a [sincronização do tipo de dados nos relacionamentos](../guide/guides/settings.md#relationship-datatype-sync) estiver ativada, a alteração segue os relacionamentos nos dois sentidos, como no editor: um tipo serial chega às chaves estrangeiras como o tipo inteiro que armazena, assim como `erd_add_relationship` o copia, e uma chave serial mantém seu tipo quando uma de suas chaves estrangeiras muda, o que interrompe a alteração ali. Cabe ao usuário ativar ou desativar a sincronização, e `erd_list` a informa como `relationshipDataTypeSync`. |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Define o valor padrão, como texto SQL. Uma string vazia o remove. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Define o comentário. Uma string vazia o remove. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` torna a coluna parte da chave primária, `false` a retira dela. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | Define se a coluna é única. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | Define se a coluna é `NOT NULL`. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | Define se a coluna tem incremento automático. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | Move uma coluna dentro de sua tabela para a posição de outra coluna. |

### Relacionamentos {#relationships}

`relationshipType` é a cardinalidade na extremidade filha: `ZeroOne`, `ZeroN`, `OneOnly` ou `OneN`.
A tabela inicial é a pai, o lado referenciado que contém a chave primária, e a tabela final é a filha.
`onDelete` e `onUpdate` são as ações ON DELETE e ON UPDATE da chave estrangeira: `none`, `noAction`, `cascade`, `setNull`, `setDefault` ou `restrict`.
`none` não escreve nenhuma cláusula, então vale o padrão do banco de dados — consulte [ON DELETE e ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).
Uma ação omitida em `erd_add_relationship` ou `erd_link_columns` é `none`.

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Relaciona duas tabelas. Copia a chave primária da tabela pai para a filha como colunas de chave estrangeira, criando antes uma coluna de chave primária se a pai não tiver nenhuma. Cada coluna de chave estrangeira é nomeada como ao desenhar um relacionamento no editor: a chave `id` de `users` gera `users_id`, e uma chave como `member_id` mantém seu nome — consulte [Nomes das colunas de chave estrangeira](../guide/guides/relationship-editing.md#foreign-key-column-names). Cada uma copia o tipo de dados de sua chave, exceto que uma chave serial gera o tipo inteiro que armazena, como `integer` para `serial4`, e um `serial` puro continua `serial` fora do PostgreSQL, MySQL e MariaDB — consulte [Relacionamentos identificadores](../guide/guides/relationship-editing.md#identifying-relationships). `createdIds` contém essa nova coluna de chave, se uma foi criada, as colunas de chave estrangeira e, por último, o id do relacionamento. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Desenha um relacionamento entre colunas que já existem, emparelhando as colunas iniciais e finais pela posição. Não renomeia nenhuma coluna nem altera nenhum tipo de dados. |
| `erd_remove_relationship` | `relationshipId` | Remove uma linha de relacionamento. Suas colunas de chave estrangeira permanecem na tabela. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Altera a cardinalidade de um relacionamento. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Define a ação ON DELETE de um relacionamento: o que excluir uma linha pai faz com suas linhas filhas. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Define a ação ON UPDATE de um relacionamento: o que alterar uma chave pai faz com suas linhas filhas. |

`erd_add_relationship` nomeia as colunas de chave estrangeira ao ser executada, então dê nome à tabela pai e à sua chave primária antes.

Nenhuma ferramenta altera as colunas de um relacionamento existente como faz a caixa de diálogo [Mapear colunas](../guide/guides/relationship-editing.md#map-columns) do editor.
Para mapear um relacionamento para outras colunas, execute `erd_remove_relationship`, que deixa suas colunas de chave estrangeira na tabela, e `erd_link_columns` com as colunas desejadas, em um único `erd_batch`, que um único `erd_undo` reverte.

### Índices {#indexes}

Um id de coluna de índice é uma entrada da lista de colunas do índice fornecida por `erd_get`, não o id da coluna da tabela.

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_index` | `tableId` | Adiciona um índice vazio a uma tabela e retorna seu id em `createdIds`. |
| `erd_remove_index` | `indexId` | Remove um índice. |
| `erd_change_index_name` | `indexId`, `value` | Renomeia um índice. |
| `erd_set_index_unique` | `indexId`, `value` | Define se o índice é único. |
| `erd_add_index_column` | `indexId`, `columnId` | Adiciona uma coluna da tabela do índice e retorna o id da nova coluna de índice. Uma coluna que já está no índice permanece como está. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | Remove uma coluna de um índice. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | Move uma coluna dentro de um índice para a posição de outra de suas colunas. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | Define a ordem de classificação de uma coluna em um índice, `ASC` ou `DESC`. |

### Notas {#memos}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_memo` | | Adiciona uma nota vazia em um espaço livre e retorna seu id em `createdIds`. |
| `erd_remove_memo` | `memoId` | Remove uma nota. |
| `erd_change_memo_value` | `memoId`, `value` | Substitui o texto de uma nota. |
| `erd_change_memo_color` | `memoId`, `color` | Define a cor de uma nota. |
| `erd_move_memo` | `memoId`, `x`, `y` | Move uma nota para uma posição no canvas. |
| `erd_resize_memo` | `memoId`, `width`, `height` | Redimensiona uma nota. A largura deve ser de pelo menos cerca de `116` pixels e a altura de pelo menos `100`. Não cria nenhuma entrada de desfazer, pois o editor só registra o redimensionamento de uma nota feito por arrasto. |

Enquanto as notas estão ocultas com [View Option](../guide/guides/table-related-functions.md#table-view-options) → `Memos`, `erd_add_memo` ainda adiciona uma, e ela permanece oculta até que as notas sejam exibidas novamente.
`erd_list` e `erd_get` também listam as notas ocultas.

### Grupos de tabelas {#table-groups}

Um grupo de tabelas é uma caixa com nome desenhada atrás de suas tabelas, e sua cor aparece na caixa e nos cabeçalhos de suas tabelas — consulte [Grupos de tabelas](../guide/guides/table-groups.md).
Uma tabela fica em no máximo um grupo. `erd_move_table`, `erd_move_tables` e `erd_move_table_group` nunca mudam quais tabelas um grupo contém, onde quer que posicionem uma tabela, enquanto no editor uma tabela entra em um grupo ou sai dele conforme o lugar onde é solta — consulte [Adicionar e remover tabelas](../guide/guides/table-groups.md#adding-and-removing-tables). `erd_add_table_group` e `erd_set_table_group` colocam tabelas em um grupo, e `erd_remove_table_group` deixa suas tabelas sem nenhum grupo.
Um grupo armazena um retângulo de pelo menos `160` pixels de largura e `100` de altura, incluindo a barra de título, e o editor desenha a caixa ampliada para conter cada uma de suas tabelas.

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | Adiciona um grupo e retorna seu id em `createdIds`. Passe `tableIds` ou um retângulo, com `x`, `y`, `width` e `height` juntos. Com `tableIds`, cada tabela sai do grupo em que estava, e o retângulo é ajustado ao redor delas da mesma forma que ao [agrupar tabelas selecionadas](../guide/guides/table-groups.md#grouping-selected-tables). Um retângulo inclui todas as tabelas sem grupo cujo centro esteja dentro dele, como ao [desenhar um grupo](../guide/guides/table-groups.md#drawing-a-group). Um `name` vazio deixa o grupo sem nome. Um único `erd_undo` remove o grupo e devolve cada tabela ao grupo em que estava. |
| `erd_remove_table_group` | `groupId` | Remove um grupo. Suas tabelas permanecem onde estão, sem grupo. |
| `erd_change_table_group_name` | `groupId`, `value` | Renomeia um grupo. Uma string vazia o deixa sem nome. |
| `erd_change_table_group_color` | `groupId`, `color` | Define a cor de um grupo. |
| `erd_move_table_group` | `groupId`, `x`, `y` | Move um grupo para que seu retângulo comece nesse ponto, com suas tabelas deslocadas na mesma medida, como acontece ao arrastar sua barra de título. Um movimento de menos de 20 pixels, somando o deslocamento horizontal e o vertical, não cria nenhuma entrada de desfazer. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | Define o retângulo de um grupo, com suas tabelas permanecendo onde estão. Se `x` e `y` forem omitidos, o canto do grupo é mantido. Um retângulo que não comportaria as tabelas do grupo com seu espaçamento é recusado, com uma mensagem indicando a caixa que ele precisa conter. |
| `erd_set_table_group` | `tableIds`, `groupId` | Coloca tabelas em um grupo, cada uma saindo do grupo em que estava. Um `groupId` igual a `null` ou a uma string vazia as retira de todos os grupos. |

Enquanto os grupos estão ocultos com `View Option` → `Table Groups`, estas ferramentas ainda adicionam e alteram grupos, que permanecem ocultos até que os grupos sejam exibidos — consulte [Ocultar grupos](../guide/guides/table-groups.md#hiding-groups).
`erd_sort_tables` mantém juntas as tabelas de cada grupo, `erd_import_dbml` e `erd_import_json` trazem grupos — consulte [Importação](#import) — e `erd_read` escreve o DDL dos grupos escolhidos com `groupNames`.
Uma versão do ERD Editor anterior aos grupos de tabelas descarta os grupos de um arquivo ao salvá-lo, como fazem a extensão do VS Code anterior à `4.0.0` e os plugins do Obsidian e da JetBrains anteriores à `1.0.0` — consulte [Atualizar](./installation.md#updating).

### Configurações {#settings}

Um agente define as configurações do próprio esquema: o banco de dados, seu nome e os scripts do [Esquema SQL](../guide/guides/schema-sql.md).
Todas as outras configurações que o documento armazena cabem ao usuário definir no editor: os botões de alternância do menu [Opções de exibição](../guide/guides/table-related-functions.md#table-view-options), as opções da aba [Configurações](../guide/guides/settings.md), a linguagem e os estilos de nome do Gerador de código, o tipo de delimitador e os [bloqueios](../guide/guides/settings.md#lock).
Nenhuma ferramenta as altera, exceto as importações no modo `replace`: `erd_import_json` traz as configurações e os bloqueios do documento que carrega, e as outras quatro levam a área visível de volta ao início do canvas — consulte [Importação](#import).
O servidor `1.0.0` removeu as ferramentas que as definiam: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` e `erd_set_show`.

`erd_list` e o formato `snapshot` de `erd_read` informam as configurações como o arquivo as salva, com `lockSettings` contendo um sinalizador por bloqueio: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase` e `bracketType`.
Uma linguagem, um estilo de nome ou um tipo de delimitador bloqueado é informado com seu valor bloqueado, aquele que o arquivo mantém e com o qual todo editor abre, seja o que for que a tela de um editor mostre. A área visível e a aba não são informadas.

`erd_set_ddl_script` cria uma entrada de desfazer. `erd_set_database` e `erd_set_database_name` não criam nenhuma, então `erd_undo` não consegue revertê-las.

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_set_database` | `value` | Define o banco de dados: `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks` ou `Snowflake`. Determina os tipos de dados do banco de dados e o DDL que `erd_read` escreve quando nenhum `vendor` é informado. |
| `erd_set_database_name` | `value` | Define o nome do banco de dados, que os cabeçalhos `use` e `createAndUse` de `erd_read` citam. |
| `erd_set_ddl_script` | `position`, `sql` | Define um dos dois scripts escritos em torno das tabelas — consulte [Scripts antes e depois das tabelas](../guide/guides/schema-sql.md#before-and-after-scripts). `position` é `before`, escrito antes das tabelas, como `CREATE EXTENSION` ou `CREATE SCHEMA`, ou `after`, escrito depois delas, como `GRANT` ou `CREATE VIEW`. `sql` substitui o script inteiro, com no máximo 10.000 caracteres, e uma string vazia o remove. Leia antes o script atual com o formato `scripts` de `erd_read`. |

Um script entra como está no DDL de todo banco de dados, então escreva-o para o banco de dados do documento. No MSSQL, uma linha `GO` é adicionada após um script cuja última linha não seja `GO`.
Uma versão do ERD Editor anterior a esses scripts descarta os scripts de um arquivo ao salvá-lo, como fazem a extensão do VS Code anterior à `4.0.0` e os plugins do Obsidian e da JetBrains anteriores à `1.0.0` — consulte [Atualizar](./installation.md#updating).

### Importação {#import}

Estas ferramentas leem um esquema da mesma forma que o menu Importar do editor — consulte [Importar ou exportar arquivos](../guide/guides/file-import-export.md).
Cada uma recebe o texto como `value` e `mode`: `replace`, o padrão, ou `append`.

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | Carrega SQL DDL, instruções `CREATE TABLE` e similares. |
| `erd_import_graphql` | `value`, `mode?` | Carrega um GraphQL SDL. |
| `erd_import_dbml` | `value`, `mode?` | Carrega DBML. Cada `TableGroup` se torna um grupo de tabelas com as tabelas que ele cita — consulte [DBML](../guide/guides/file-import-export.md#dbml). |
| `erd_import_aml` | `value`, `mode?` | Carrega AML. |
| `erd_import_json` | `value`, `mode?` | Carrega um documento JSON do erd-editor, como outro arquivo `.erd.json`. |

`replace` toma o lugar do documento, e `erd_undo` restaura o anterior:

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` e `erd_import_aml` substituem todas as tabelas, relacionamentos, índices, notas e grupos de tabelas. Mantêm as configurações do documento, incluindo seus bloqueios, exceto a área visível, que volta ao início do canvas em 100%.
- `erd_import_json` substitui o documento inteiro, incluindo suas configurações: as configurações e os bloqueios do JSON tomam o lugar dos deste documento, e um JSON que não registra nenhum bloqueio ativa todos os bloqueios e coloca a área visível no início do canvas. Para manter as configurações deste documento, parta do texto fornecido pelo formato `json` de `erd_read`. Um texto vazio gera um documento novo, como o que `erd_open_document` cria com `create`.

`append` acrescenta a importação ao documento, como faz a opção [Importar e adicionar](../guide/guides/file-import-export.md#import-and-add) do editor, e um único `erd_undo` desfaz todo o acréscimo:

- O conteúdo do texto entra como novas entidades com novos ids, em um bloco abaixo de tudo o que o documento contém, incluindo as notas e os grupos de tabelas ocultos, alinhado à borda esquerda do conteúdo existente. Todas as tabelas e configurações já existentes permanecem, incluindo uma tabela com o mesmo nome: nada é mesclado pelo nome.
- Relacionamentos e índices só entram entre as tabelas que a importação traz, então uma chave estrangeira para uma tabela que o texto não declara é descartada.
- `erd_import_sql`, `erd_import_graphql` e `erd_import_aml` adicionam tabelas com seus relacionamentos e índices, e `erd_import_dbml` também seus grupos de tabelas. `erd_import_json` adiciona tabelas, relacionamentos, índices, notas e grupos de tabelas, nunca suas configurações, e recusa um texto vazio.

Um documento JSON mantém sua própria disposição, incluindo seus grupos de tabelas: onde posiciona suas tabelas com `replace` e dentro do bloco adicionado com `append`.
As tabelas de SQL, GraphQL, DBML e AML são dispostas em linhas, primeiro as tabelas com menos colunas e com as tabelas de cada grupo juntas, como `erd_sort_tables` as posiciona, nunca pelo `Flow`, como a própria importação do editor as organiza quando pode. Essas quatro ferramentas recusam um texto vazio em qualquer um dos modos.

## erd_batch {#erd_batch}

`erd_batch` executa várias ferramentas de edição em ordem como uma única edição, todas ou nenhuma.

- `operations` contém até 100 entradas, cada uma `{ tool, as?, args? }`, em que `args` são os argumentos da ferramenta sem `path`.
- As operações são testadas antes em uma cópia do documento. Uma operação recusada é indicada, como `operations[1] erd_remove_table: …`, e nada é aplicado.
- Um único `erd_undo` reverte o lote inteiro, exceto as operações que ele não consegue reverter, que o `undoNote` do resultado indica: as de uma ferramenta que não cria entrada de desfazer, como `erd_set_database`, e as que alteraram o documento sem criar uma, como um `erd_move_table_group` curto. Um lote que não criou nenhuma entrada de desfazer é pulado por `erd_undo`. `historyEntries` no resultado conta as entradas do histórico do editor dentro dele, não as chamadas de `erd_undo`.
- Em uma sessão ao vivo, o editor aceita o lote inteiro ou nada dele.

Um agente não tem como saber os ids que um lote cria antes de chamá-lo, então uma operação nomeada com `as` permite que uma posterior se refira a eles: `$name` ou `$name.0` para seu primeiro id criado, `$name.1` para o segundo e `$name.last` para o último.
Um nome contém letras ASCII, dígitos e sublinhados, não começa com dígito e nomeia apenas uma operação.
Uma referência só é resolvida onde um argumento recebe um id de entidade, então um nome ou comentário que diz `$x` continua sendo texto.

Uma tabela com suas colunas e um relacionamento, em uma única chamada:

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_table", "as": "users" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$users", "value": "users" } },
    { "tool": "erd_add_column", "as": "uid", "args": { "tableId": "$users" } },
    { "tool": "erd_change_column_name", "args": { "tableId": "$users", "columnId": "$uid", "value": "id" } },
    { "tool": "erd_change_column_data_type", "args": { "tableId": "$users", "columnId": "$uid", "value": "BIGINT" } },
    { "tool": "erd_set_column_primary_key", "args": { "tableId": "$users", "columnId": "$uid", "value": true } },
    { "tool": "erd_add_table", "as": "orders" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$orders", "value": "orders" } },
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN", "onDelete": "cascade" } }
  ]
}
```

`users` e sua chave `id` recebem nome antes do relacionamento, então a coluna de chave estrangeira que ele adiciona a `orders` é `users_id`.

## Resultados {#results}

Uma edição responde com uma linha de JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Campo | Significado |
| --- | --- |
| `mode` | `live` ou `headless` — consulte [Ao vivo e headless](./live-and-headless.md). |
| `createdIds` | Os ids do que a chamada criou, em ordem. |
| `batches`, `historyEntries` | Quantos lotes de alterações a chamada enviou e quantas entradas do histórico do editor criou. |
| `undoable`, `undoNote` | `undoable` é `false` quando `erd_undo` vai pular a chamada, e `undoNote` diz por quê: a ferramenta não cria entrada de desfazer, a chamada alterou o documento sem criar uma, como faz um `erd_move_table_group` de menos de 20 pixels, ou o documento já tinha o valor. Um resultado de `erd_batch` sempre traz um `undoNote`. Quando o lote criou uma entrada de desfazer, a nota diz que um único `erd_undo` reverte o lote e indica qualquer operação que ele deixa como está; quando não criou nenhuma, o resultado traz `undoable: false` e a nota diz que `erd_undo` o pula. |
| `mismatch` | Presente quando a chamada criou um número de lotes ou de entradas do histórico diferente do que a ferramenta declara. |
| `notes` | Presente quando algo na sessão mudou, como um editor que foi encerrado ou deixou de atender o documento, ou um arquivo que mudou em disco. |

Uma recusa é um resultado de erro que traz um código e uma mensagem que diz o que fazer:

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | Motivo |
| --- | --- |
| `notFound` | Um id não indica nada existente, ou o arquivo não existe. |
| `invalidArgs` | Um argumento está ausente ou tem o valor errado. |
| `invalidPath` | O caminho não é um documento ERD. No Windows, também um caminho com um nome que o Windows não armazena como foi escrito, ou um que chega a um documento que um editor mantém sob outro caminho, indicado na mensagem. |
| `invalidDocument` | O arquivo não é um documento que o editor consegue ler. |
| `tooLarge` | Uma leitura não cabe em uma resposta. |
| `blocked` | Um editor com o hub desativado mantém o documento. A mensagem diz como ativá-lo: no VS Code, confie no espaço de trabalho e ative `dineug.erd-editor.agentHub.enabled`, ou recarregue a janela; no Obsidian, ative Coding agents, ou recarregue o Obsidian; em uma IDE da JetBrains, ative Coding agents, ou reinicie a IDE se a opção já estiver ativada. |
| `hubDisabled` | Uma IDE da JetBrains mantém o documento apenas em um projeto em que não confia. As leituras continuam funcionando; confie no projeto para permitir que o agente edite. |
| `conflict` | O arquivo mudou em disco durante a chamada. Nada foi gravado. |
| `hubAppeared`, `hubGone` | Um editor começou a atender um documento que o agente estava editando em disco, ou o editor que o atendia continua em execução, mas seu arquivo de bloqueio e sua conexão desapareceram. Nada foi gravado. |
| `notSaved` | `erd_save` não conseguiu salvar o documento do editor. |
| `readonly` | O editor mantém o documento como somente leitura, como um arquivo em que não consegue gravar ou que não consegue ler como diagrama. Sem editor, o próprio arquivo é somente leitura, como um arquivo do Perforce ou do TFVC que não passou por check-out. Nada foi gravado. |
| `protocolMismatch` | A extensão ou o plugin ERD Editor do editor e o servidor usam versões de protocolo diferentes, como o servidor `1.0.0` com uma extensão do VS Code `3.x`. As leituras também são recusadas, e a mensagem indica o lado a atualizar — consulte [Atualizar](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | O hub de um editor não aceitou a conexão, não respondeu em até 30 segundos ou encerrou a conexão durante a chamada. No Windows, `hubUnreachable` também significa que o Windows impediu o agente de acessar o hub: o editor é executado com mais direitos que o agente, como quando foi iniciado como administrador e o agente não, ou o agente é executado em um ambiente isolado (sandbox). |

Outros códigos são mais raros, e toda recusa traz uma mensagem que diz o que aconteceu.

As ferramentas de edição, `erd_batch` e as três ferramentas de leitura recusam um argumento que não declaram, ou um do tipo errado, com um erro JSON-RPC de parâmetros inválidos (`-32602`) antes de tocar no documento, de modo que um argumento com erro de digitação nunca é descartado silenciosamente.
As cinco ferramentas de sessão ignoram argumentos que não conhecem.
