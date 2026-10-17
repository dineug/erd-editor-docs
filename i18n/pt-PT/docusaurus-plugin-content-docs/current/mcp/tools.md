---
sidebar_position: 4
description: Todas as ferramentas que o servidor MCP do erd-editor oferece — a leitura de um documento uma página de cada vez, as 54 ferramentas de edição, erd_batch e o aspeto de um resultado e de uma recusa.
---

# Ferramentas

O servidor oferece 63 ferramentas: cinco ferramentas de sessão, três ferramentas de leitura, 54 ferramentas de edição, uma por operação de edição, e `erd_batch`, que executa várias ferramentas de edição como uma só edição.

Todas as ferramentas, exceto `erd_list_documents`, recebem o `path` do documento como primeiro argumento, e as tabelas abaixo omitem-no.
Um argumento marcado com `?` é opcional.

## Ferramentas de sessão {#session-tools}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_list_documents` | | Lista os documentos ERD com `path`, `open`, `active`, `dirty` e `readonly`: os do editor que serve o diretório de trabalho, que num IDE da JetBrains abrange todos os projetos abertos, ou, caso contrário, os ficheiros ERD dentro do diretório de trabalho. |
| `erd_open_document` | `create?` | Abre um documento para edição, no ERD Editor do editor que o serve, se houver algum. Com `create`, cria primeiro o ficheiro se este não existir, e um nome sem extensão recebe `.erd.json`. |
| `erd_save` | | Guarda um documento que um editor detém. O VS Code mantém as edições do agente por guardar até esta ferramenta ser chamada; o Obsidian e um IDE da JetBrains guardam-nas tal como guardam as edições feitas por si, e esta ferramenta escreve-as de imediato. No modo headless, todas as edições já estão escritas e esta ferramenta não faz nada. |
| `erd_undo` | | Reverte a última edição feita por este agente, nunca uma feita por si. As chamadas que não criaram nenhuma entrada de anulação são ignoradas e indicadas pelo nome. |
| `erd_redo` | | Volta a aplicar a última edição que `erd_undo` reverteu. |

Consulte [Em direto e headless](./live-and-headless.md) para saber o que acontece ao guardar e ao anular em cada modo.

## Ler um documento {#reading-a-document}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | As definições e as contagens e, a seguir, uma página de tabelas com os seus índices e relações, cada tabela com o seu id, a posição e o tamanho na tela, o número de colunas e o grupo de tabelas, se pertencer a algum. Exceto numa pesquisa, os grupos de tabelas e depois as notas vêm a seguir às tabelas. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?` | As entidades indicadas, completas: tabelas com as suas colunas e o seu grupo de tabelas, relações com as suas colunas e os seus `onDelete` e `onUpdate`, índices com as suas colunas, notas com o seu texto, grupos de tabelas com as suas tabelas. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `tableIds?`, `tableNames?`, `groupNames?` | O documento inteiro de uma só vez num de quatro formatos, ou o DDL de apenas algumas tabelas ou grupos de tabelas. |

Um agente encontra os ids com `erd_list`, lê as colunas e outros detalhes com `erd_get` e passa esses ids às ferramentas de edição.
O tamanho de uma tabela em `erd_list` é a caixa que ocupa na tela: a altura exata, a largura aproximada.
Um grupo de tabelas é listado pelo retângulo que guarda, com o seu nome, a sua cor e o número de tabelas que contém.
Cada relação é listada uma vez, com uma das suas duas tabelas.
As definições que `erd_list` e `erd_read` indicam são as que o ficheiro guarda — consulte [Definições](#settings).

`erd_read` aceita um de quatro formatos:

| `format` | O que devolve |
| --- | --- |
| `snapshot` | JSON compacto com todas as entidades e o respetivo id, incluindo os grupos de tabelas, e as definições com os scripts do Esquema SQL. Omite o que varia de um utilizador para outro: as larguras medidas, a ordem de sobreposição, a vista e o separador. Volumoso num esquema grande. |
| `sql` | DDL para uma das oito bases de dados, `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` ou `SQLite`. `vendor` assume por predefinição a base de dados definida no documento. O DDL do documento inteiro inclui os seus scripts antes e depois das tabelas. Com `tableIds`, `tableNames` ou `groupNames`, apenas essas tabelas, com as chaves externas que contêm, e sem scripts. As chaves externas levam as suas ações ON DELETE e ON UPDATE, exceto as que a base de dados de destino omite — consulte [ON DELETE e ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | O documento inteiro exatamente como fica escrito no ficheiro ao guardar, incluindo as edições que o editor ainda não guardou — consulte [Forma de armazenamento e valor em tempo de execução](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Apenas os scripts antes e depois das tabelas do documento, como `{"before":"…","after":"…"}`, cada um vazio quando não está definido, por maior que seja o esquema. |

Só o formato `sql` aceita `vendor`, `statements`, `header`, `tableIds`, `tableNames` e `groupNames`, e os restantes formatos recusam-nos.

- `statements`: `create`, a predefinição; `ifNotExists`, que escreve `CREATE TABLE IF NOT EXISTS` no MySQL, MariaDB, PostgreSQL, SQLite e Databricks e um simples `CREATE TABLE` nas restantes; ou `recreate`, que elimina as tabelas antes de as criar, caso em que o Snowflake escreve `CREATE OR REPLACE TABLE` em vez disso.
- `header`: `none`, a predefinição; `use`, que seleciona a base de dados ou o esquema indicado pelo nome da base de dados do documento; ou `createAndUse`, que o cria primeiro. O Oracle só tem `use`, por isso aí `createAndUse` escreve `use`, e o PostgreSQL só tem `createAndUse`, por isso aí `use` não escreve cabeçalho. O SQLite não escreve nenhum, e nenhuma base de dados escreve um enquanto o nome da base de dados estiver vazio ou não for um identificador simples.
- `groupNames`: as tabelas dos grupos de tabelas indicados, pelo nome, sem distinguir maiúsculas de minúsculas, juntas às de `tableIds` e `tableNames`. Um nome que não corresponde a nenhum grupo é recusado com `notFound`. Um grupo sem tabelas não acrescenta nenhuma, e uma leitura que fica sem qualquer tabela, como quando todos os grupos indicados estão vazios e nenhuma tabela é indicada, é recusada com `invalidArgs`.

`statements` e `header` aplicam-se também ao DDL de apenas algumas tabelas. Funcionam como as opções `Statements` e `Header` do separador [Esquema SQL](../guide/guides/schema-sql.md#options-panel) do editor, embora o separador comece em `If not exists` e `CREATE + USE`.
Os nomes são delimitados com o tipo de delimitador que o ficheiro guarda, o valor bloqueado enquanto a definição `Bracket Type` estiver bloqueada — consulte [Bloqueio](../guide/guides/settings.md#lock).

### Esquemas grandes {#large-schemas}

Também funcionam esquemas com centenas ou milhares de tabelas.
Uma leitura responde com 40 000 caracteres no máximo, abaixo do limite a partir do qual o Claude Code põe o resultado de uma ferramenta à parte num ficheiro.

- `erd_list` responde, por predefinição, com uma página de 100, primeiro as tabelas, depois os grupos de tabelas e depois as notas, e indica onde começa a página seguinte com `nextOffset` e um campo `note`. Passe esse `nextOffset` como `offset`, com a mesma `query`.
- `query` encontra tabelas por palavras no nome ou no comentário de uma tabela ou coluna, sem distinguir maiúsculas de minúsculas. As tabelas cujos nomes contêm mais dessas palavras aparecem primeiro. Uma pesquisa não lista grupos de tabelas nem notas.
- `namesOnly` lista apenas os nomes das tabelas, cerca de 2000 nomes curtos numa resposta.
- `erd_get` e `erd_read` aceitam `tableNames` além de ids, e `erd_read` aceita `groupNames`, pelo que um agente a quem se pede uma consulta SQL sobre um esquema grande lê o DDL apenas das tabelas de que precisa.
- `erd_get` lista em `missing` os ids e nomes que não designam nada, e em `notReturned` os ids que não cabem numa resposta, para os pedir de novo.
- Uma leitura demasiado grande para uma resposta é recusada com `tooLarge`, com indicações sobre como a restringir.

## Ferramentas de edição {#edit-tools}

Os ids vêm de `erd_list` e `erd_get`, ou do campo `createdIds` da chamada que criou a entidade.
Um id novo tem 25 letras minúsculas e algarismos, como `03h17be2plxpj5n59tqag7ogj`, enquanto um id que o documento já contém mantém a sua forma, por isso não tire conclusões do formato de um id.
`x` e `y` são os limites esquerdo e superior na tela, em píxeis, e uma cor é uma cor hexadecimal CSS como `#3b82f6`, ou uma cadeia vazia, que remove a cor.

### Tabelas {#tables}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_table` | | Adiciona uma tabela vazia num espaço livre e devolve o respetivo id em `createdIds`. |
| `erd_remove_table` | `tableId` | Remove uma tabela com as suas colunas, os seus índices e todas as relações que a envolvem. |
| `erd_change_table_name` | `tableId`, `value` | Muda o nome de uma tabela. |
| `erd_change_table_comment` | `tableId`, `value` | Define o comentário de uma tabela. Uma cadeia vazia apaga-o. |
| `erd_change_table_color` | `tableId`, `color` | Define a cor de uma tabela. |
| `erd_move_table` | `tableId`, `x`, `y` | Move uma tabela para uma posição na tela. |
| `erd_move_tables` | `positions` | Move várias tabelas numa só edição, que um único `erd_undo` reverte. `positions` contém `{ tableId, x, y }` por tabela, cada tabela no máximo uma vez. |
| `erd_sort_tables` | | Posiciona todas as tabelas em linhas ao longo da tela, primeiro as que têm menos colunas, tal como as posicionam `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` e `erd_import_aml`. As tabelas de um grupo de tabelas ficam juntas, e a caixa de cada grupo é ajustada à volta delas. |

### Colunas {#columns}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Adiciona uma coluna vazia a uma tabela e devolve o respetivo id em `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Remove colunas de uma tabela, com as relações e as entradas de índice que as usam. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Muda o nome de uma coluna. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Define o tipo de dados, como `INT` ou `VARCHAR(255)`. Enquanto a definição [Sincronização do tipo de dados nas relações](../guide/guides/settings.md#relationship-datatype-sync) está ativada, a alteração segue as relações nos dois sentidos, tal como no editor: um tipo serial chega às chaves externas como o tipo inteiro que armazena, tal como `erd_add_relationship` o copia, e uma chave serial mantém o seu tipo quando uma das suas chaves externas muda, o que trava a alteração aí. Cabe ao utilizador ativar ou desativar a sincronização, e `erd_list` indica-a como `relationshipDataTypeSync`. |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Define o valor predefinido, como texto SQL. Uma cadeia vazia apaga-o. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Define o comentário. Uma cadeia vazia apaga-o. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` torna a coluna parte da chave primária, `false` retira-a. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | Define se a coluna é única. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | Define se a coluna é `NOT NULL`. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | Define se a coluna tem incremento automático. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | Move uma coluna dentro da sua tabela para a posição de outra coluna. |

### Relações {#relationships}

`relationshipType` é a cardinalidade na extremidade filha: `ZeroOne`, `ZeroN`, `OneOnly` ou `OneN`.
A tabela inicial é a tabela pai, o lado referenciado que contém a chave primária, e a tabela final é a tabela filha.
`onDelete` e `onUpdate` são as ações ON DELETE e ON UPDATE da chave externa: `none`, `noAction`, `cascade`, `setNull`, `setDefault` ou `restrict`.
`none` não escreve nenhuma cláusula, pelo que se aplica a predefinição da base de dados — consulte [ON DELETE e ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).
Uma ação omitida em `erd_add_relationship` ou `erd_link_columns` é `none`.

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Relaciona duas tabelas. Copia a chave primária da tabela pai para a tabela filha como colunas de chave externa, criando primeiro uma coluna de chave primária se a tabela pai não tiver nenhuma. Cada coluna de chave externa recebe o nome que o editor lhe dá quando se desenha uma relação: a chave `id` de `users` dá `users_id`, e uma chave como `member_id` mantém o seu nome — consulte [Nomes das colunas de chave externa](../guide/guides/relationship-editing.md#foreign-key-column-names). Cada uma copia o tipo de dados da sua chave, com a exceção de que uma chave serial dá o tipo inteiro que armazena, como `integer` para `serial4`, e um `serial` simples continua `serial` fora do PostgreSQL, MySQL e MariaDB — consulte [Relações identificadoras](../guide/guides/relationship-editing.md#identifying-relationships). `createdIds` contém essa nova coluna de chave, se tiver sido criada, as colunas de chave externa e, por último, o id da relação. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Desenha uma relação entre colunas que já existem, emparelhando as colunas iniciais e finais pela posição. Não muda o nome de nenhuma coluna nem altera nenhum tipo de dados. |
| `erd_remove_relationship` | `relationshipId` | Remove a linha de uma relação. As suas colunas de chave externa ficam na tabela. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Altera a cardinalidade de uma relação. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Define a ação ON DELETE de uma relação: o que a eliminação de uma linha pai faz às respetivas linhas filhas. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Define a ação ON UPDATE de uma relação: o que a alteração de uma chave pai faz às respetivas linhas filhas. |

`erd_add_relationship` dá nome às colunas de chave externa quando é executado, por isso dê primeiro nome à tabela pai e à sua chave primária.

Nenhuma ferramenta altera as colunas de uma relação existente como faz a caixa de diálogo [Mapear colunas](../guide/guides/relationship-editing.md#map-columns) do editor.
Para mapear uma relação para outras colunas, execute `erd_remove_relationship`, que deixa as suas colunas de chave externa na tabela, e `erd_link_columns` com as colunas pretendidas, num só `erd_batch`, que um único `erd_undo` reverte.

### Índices {#indexes}

Um id de coluna de índice é uma entrada da lista de colunas do índice que `erd_get` devolve, e não o id da coluna da tabela.

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_index` | `tableId` | Adiciona um índice vazio a uma tabela e devolve o respetivo id em `createdIds`. |
| `erd_remove_index` | `indexId` | Remove um índice. |
| `erd_change_index_name` | `indexId`, `value` | Muda o nome de um índice. |
| `erd_set_index_unique` | `indexId`, `value` | Define se o índice é único. |
| `erd_add_index_column` | `indexId`, `columnId` | Adiciona uma coluna da tabela do índice e devolve o id da nova coluna de índice. Uma coluna que já está no índice fica como está. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | Remove uma coluna de um índice. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | Move uma coluna dentro de um índice para a posição de outra das suas colunas. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | Define a ordem de ordenação de uma coluna de um índice, `ASC` ou `DESC`. |

### Notas {#memos}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_memo` | | Adiciona uma nota vazia num espaço livre e devolve o respetivo id em `createdIds`. |
| `erd_remove_memo` | `memoId` | Remove uma nota. |
| `erd_change_memo_value` | `memoId`, `value` | Substitui o texto de uma nota. |
| `erd_change_memo_color` | `memoId`, `color` | Define a cor de uma nota. |
| `erd_move_memo` | `memoId`, `x`, `y` | Move uma nota para uma posição na tela. |
| `erd_resize_memo` | `memoId`, `width`, `height` | Redimensiona uma nota. A largura tem de ser de, pelo menos, cerca de `116` píxeis e a altura de, pelo menos, `100`. Não cria nenhuma entrada de anulação, pois o editor só regista o redimensionamento de uma nota feito por arrasto. |

Enquanto as notas estão ocultas através do menu [Opções de vista](../guide/guides/table-related-functions.md#table-view-options) → `Memos`, `erd_add_memo` continua a adicionar uma, e esta fica oculta até as notas voltarem a ser mostradas.
`erd_list` e `erd_get` também listam as notas ocultas.

### Grupos de tabelas {#table-groups}

Um grupo de tabelas é uma caixa com nome desenhada por trás das suas tabelas, e a sua cor aparece na caixa e nos cabeçalhos das suas tabelas — consulte [Grupos de tabelas](../guide/guides/table-groups.md).
Uma tabela pertence, no máximo, a um grupo. `erd_move_table`, `erd_move_tables` e `erd_move_table_group` nunca alteram as tabelas que um grupo contém, onde quer que posicionem uma tabela, ao passo que no editor uma tabela entra num grupo ou sai dele consoante o sítio onde é largada — consulte [Adicionar e remover tabelas](../guide/guides/table-groups.md#adding-and-removing-tables). `erd_add_table_group` e `erd_set_table_group` colocam tabelas num grupo, e `erd_remove_table_group` deixa as suas tabelas sem grupo.
Um grupo guarda um retângulo com, pelo menos, `160` píxeis de largura e `100` de altura, barra de título incluída, e o editor desenha a caixa alargada para conter cada uma das suas tabelas.

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | Adiciona um grupo e devolve o respetivo id em `createdIds`. Passe `tableIds` ou então um retângulo, com `x`, `y`, `width` e `height` em conjunto. Com `tableIds`, cada tabela sai do grupo em que estivesse, e o retângulo é ajustado à volta delas tal como ao [agrupar as tabelas selecionadas](../guide/guides/table-groups.md#grouping-selected-tables). Um retângulo abrange todas as tabelas sem grupo cujo centro fique dentro dele, tal como ao [desenhar um grupo](../guide/guides/table-groups.md#drawing-a-group). Um `name` vazio deixa o grupo sem nome. Um único `erd_undo` remove o grupo e repõe cada tabela no grupo em que estava. |
| `erd_remove_table_group` | `groupId` | Remove um grupo. As suas tabelas ficam onde estão, sem grupo. |
| `erd_change_table_group_name` | `groupId`, `value` | Muda o nome de um grupo. Uma cadeia vazia deixa-o sem nome. |
| `erd_change_table_group_color` | `groupId`, `color` | Define a cor de um grupo. |
| `erd_move_table_group` | `groupId`, `x`, `y` | Move um grupo de modo que o seu retângulo comece nesse ponto, com as suas tabelas deslocadas na mesma medida, tal como ao arrastar a sua barra de título. Um movimento inferior a 20 píxeis, somando o deslocamento horizontal e o vertical, não cria nenhuma entrada de anulação. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | Define o retângulo de um grupo, ficando as suas tabelas onde estão. Omitir `x` e `y` mantém o seu canto. Um retângulo que não conteria as tabelas do grupo com o respetivo espaçamento é recusado, com uma mensagem que indica a caixa que tem de conter. |
| `erd_set_table_group` | `tableIds`, `groupId` | Coloca tabelas num grupo, saindo cada uma do grupo em que estivesse. Um `groupId` com o valor `null` ou uma cadeia vazia retira-as de todos os grupos. |

Enquanto os grupos estão ocultos através do menu `View Option` → `Table Groups`, estas ferramentas continuam a adicionar e alterar grupos, que ficam ocultos até os grupos serem mostrados — consulte [Ocultar grupos](../guide/guides/table-groups.md#hiding-groups).
`erd_sort_tables` mantém juntas as tabelas de cada grupo, `erd_import_dbml` e `erd_import_json` trazem grupos — consulte [Importação](#import) — e `erd_read` escreve o DDL de grupos escolhidos com `groupNames`.
Uma versão do ERD Editor anterior aos grupos de tabelas descarta os grupos de um ficheiro quando o guarda, como fazem a extensão do VS Code anterior à `4.0.0` e os plugins do Obsidian e da JetBrains anteriores à `1.0.0` — consulte [Atualizar](./installation.md#updating).

### Definições {#settings}

Um agente configura as definições do próprio esquema: a base de dados, o seu nome e os scripts do [Esquema SQL](../guide/guides/schema-sql.md).
Cabe ao utilizador definir no editor todas as outras definições que o documento guarda: os interruptores do menu [Opções de vista](../guide/guides/table-related-functions.md#table-view-options), as opções do separador [Definições](../guide/guides/settings.md), a linguagem e os formatos dos nomes do Gerador de código, o tipo de delimitador e os [bloqueios](../guide/guides/settings.md#lock).
Nenhuma ferramenta as altera, exceto as importações no modo `replace`: `erd_import_json` traz as definições e os bloqueios do documento que carrega, e as outras quatro repõem a vista no início da tela — consulte [Importação](#import).
O servidor `1.0.0` removeu as ferramentas que as definiam: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` e `erd_set_show`.

`erd_list` e o formato `snapshot` de `erd_read` indicam as definições tal como o ficheiro as guarda, com `lockSettings` a conter um sinalizador por bloqueio: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase` e `bracketType`.
Uma linguagem, um formato do nome ou um tipo de delimitador bloqueado é indicado pelo seu valor bloqueado, aquele que o ficheiro mantém e com o qual todos os editores abrem, seja o que for que o ecrã de um editor mostre. A vista e o separador não são indicados.

`erd_set_ddl_script` cria uma entrada de anulação. `erd_set_database` e `erd_set_database_name` não criam nenhuma, por isso `erd_undo` não as consegue reverter.

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_set_database` | `value` | Define a base de dados: `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks` ou `Snowflake`. Determina os tipos de dados da base de dados e o DDL que `erd_read` escreve quando não é indicado nenhum `vendor`. |
| `erd_set_database_name` | `value` | Define o nome da base de dados, que os cabeçalhos `use` e `createAndUse` de `erd_read` indicam. |
| `erd_set_ddl_script` | `position`, `sql` | Define um dos dois scripts escritos à volta das tabelas — consulte [Scripts antes e depois das tabelas](../guide/guides/schema-sql.md#before-and-after-scripts). `position` é `before`, escrito antes das tabelas, como `CREATE EXTENSION` ou `CREATE SCHEMA`, ou `after`, escrito depois delas, como `GRANT` ou `CREATE VIEW`. `sql` substitui o script inteiro, com 10 000 caracteres no máximo, e uma cadeia vazia remove-o. Leia primeiro o atual com o formato `scripts` de `erd_read`. |

Um script entra tal como está no DDL de todas as bases de dados, por isso escreva-o para a base de dados do documento. No MSSQL, é acrescentada uma linha `GO` depois de um script cuja última linha não seja `GO`.
Uma versão do ERD Editor anterior a estes scripts descarta os scripts de um ficheiro quando o guarda, como fazem a extensão do VS Code anterior à `4.0.0` e os plugins do Obsidian e da JetBrains anteriores à `1.0.0` — consulte [Atualizar](./installation.md#updating).

### Importação {#import}

Estas ferramentas leem um esquema tal como o menu Importar do editor — consulte [Importar ou exportar ficheiros](../guide/guides/file-import-export.md).
Cada uma recebe o texto como `value`, e `mode`: `replace`, a predefinição, ou `append`.

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | Carrega DDL SQL, instruções `CREATE TABLE` e semelhantes. |
| `erd_import_graphql` | `value`, `mode?` | Carrega um GraphQL SDL. |
| `erd_import_dbml` | `value`, `mode?` | Carrega DBML. Cada `TableGroup` torna-se um grupo de tabelas com as tabelas que indica — consulte [DBML](../guide/guides/file-import-export.md#dbml). |
| `erd_import_aml` | `value`, `mode?` | Carrega AML. |
| `erd_import_json` | `value`, `mode?` | Carrega um documento JSON do erd-editor, como outro ficheiro `.erd.json`. |

`replace` toma o lugar do documento, e `erd_undo` repõe o anterior:

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` e `erd_import_aml` substituem todas as tabelas, relações, índices, notas e grupos de tabelas. Mantêm as definições do documento, incluindo os bloqueios, exceto a vista, que volta ao início da tela a 100%.
- `erd_import_json` substitui o documento inteiro, incluindo as definições: as definições e os bloqueios do JSON tomam o lugar dos deste documento, e um JSON que não regista bloqueios ativa todos os bloqueios e coloca a vista no início da tela. Para manter as definições deste documento, parta do texto que o formato `json` de `erd_read` devolve. Um texto vazio dá um documento novo, como o que `erd_open_document` cria com `create`.

`append` acrescenta a importação ao documento, como faz a opção [Importar e adicionar](../guide/guides/file-import-export.md#import-and-add) do editor, e um único `erd_undo` retira toda a adição:

- O conteúdo do texto entra como novas entidades com novos ids, num bloco abaixo de tudo o que o documento contém, incluindo notas ocultas e grupos de tabelas, alinhado com o seu limite esquerdo. Todas as tabelas e definições já existentes mantêm-se, incluindo uma tabela com o mesmo nome: nada é fundido pelo nome.
- As relações e os índices só surgem entre as tabelas que a importação traz, pelo que uma chave externa para uma tabela que o texto não declara é descartada.
- `erd_import_sql`, `erd_import_graphql` e `erd_import_aml` acrescentam tabelas com as suas relações e índices, e `erd_import_dbml` também os seus grupos de tabelas. `erd_import_json` acrescenta tabelas, relações, índices, notas e grupos de tabelas, nunca as suas definições, e recusa um texto vazio.

Um documento JSON mantém a sua própria disposição, incluindo os grupos de tabelas: onde posiciona as suas tabelas com `replace` e dentro do bloco acrescentado com `append`.
As tabelas de SQL, GraphQL, DBML e AML são dispostas em linhas, primeiro as que têm menos colunas, com as tabelas de cada grupo juntas, tal como `erd_sort_tables` as posiciona, e nunca com a disposição `Flow` com que a própria importação do editor as dispõe quando pode. Essas quatro ferramentas recusam um texto vazio em qualquer dos modos.

## erd_batch {#erd_batch}

`erd_batch` executa várias ferramentas de edição por ordem como uma só edição, todas ou nenhuma.

- `operations` contém até 100 entradas, cada uma `{ tool, as?, args? }`, em que `args` são os argumentos da ferramenta sem `path`.
- As operações são primeiro testadas numa cópia do documento. Uma operação recusada é indicada, como `operations[1] erd_remove_table: …`, e nada é aplicado.
- Um único `erd_undo` reverte o lote inteiro, exceto as operações que não consegue reverter, que o campo `undoNote` do resultado indica: as de uma ferramenta que não cria entrada de anulação, como `erd_set_database`, e as que alteraram o documento sem criar uma, como um `erd_move_table_group` curto. Um lote que não criou nenhuma entrada de anulação é ignorado por `erd_undo`. `historyEntries` no resultado conta as entradas do histórico do editor dentro do lote, e não as chamadas a `erd_undo`.
- Numa sessão em direto, o editor aceita o lote inteiro ou nenhuma parte dele.

Um agente não pode saber os ids que um lote cria antes de fazer a chamada, por isso uma operação com um nome atribuído através de `as` permite que uma posterior se refira a eles: `$name` ou `$name.0` para o seu primeiro id criado, `$name.1` para o segundo e `$name.last` para o último.
Um nome contém letras ASCII, algarismos e caracteres de sublinhado, não começa por um algarismo e designa uma única operação.
Uma referência só é resolvida onde um argumento recebe um id de entidade, por isso um nome ou comentário com o texto `$x` continua a ser texto.

Uma tabela com as suas colunas e uma relação, numa só chamada:

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

`users` e a sua chave `id` recebem nome antes da relação, por isso a coluna de chave externa que esta acrescenta a `orders` é `users_id`.

## Resultados {#results}

Uma edição responde com uma linha de JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Campo | Significado |
| --- | --- |
| `mode` | `live` ou `headless` — consulte [Em direto e headless](./live-and-headless.md). |
| `createdIds` | Os ids do que a chamada criou, por ordem. |
| `batches`, `historyEntries` | Quantos lotes de alterações a chamada enviou e quantas entradas do histórico do editor criou. |
| `undoable`, `undoNote` | `undoable` é `false` quando `erd_undo` vai ignorar a chamada, e `undoNote` diz porquê: a ferramenta não cria entrada de anulação, a chamada alterou o documento sem criar uma, como faz um `erd_move_table_group` inferior a 20 píxeis, ou o documento já tinha esse valor. Um resultado de `erd_batch` traz sempre um `undoNote`. Quando o lote criou uma entrada de anulação, indica que um único `erd_undo` reverte o lote e nomeia qualquer operação que fica por reverter; quando não criou nenhuma, o resultado traz `undoable: false` e a indicação diz que `erd_undo` o ignora. |
| `mismatch` | Presente quando a chamada criou um número de lotes ou de entradas do histórico diferente do que a ferramenta declara. |
| `notes` | Presente quando algo na sessão mudou, como um editor que terminou ou deixou de servir o documento, ou um ficheiro que mudou no disco. |

Uma recusa é um resultado de erro com um código e uma mensagem que diz o que fazer:

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | Motivo |
| --- | --- |
| `notFound` | Um id não designa nada que ainda exista, ou o ficheiro não existe. |
| `invalidArgs` | Falta um argumento ou este tem um valor errado. |
| `invalidPath` | O caminho não é um documento ERD. No Windows, também um caminho com um nome que o Windows não guarda tal como está escrito, ou um que chega a um documento que um editor detém sob outro caminho, que a mensagem indica. |
| `invalidDocument` | O ficheiro não é um documento que o editor consiga ler. |
| `tooLarge` | Uma leitura não cabe numa resposta. |
| `blocked` | Um editor com o hub desativado detém o documento. A mensagem diz como o ativar: no VS Code, confie na área de trabalho e ative a definição `dineug.erd-editor.agentHub.enabled`, ou recarregue a janela; no Obsidian, ative a definição Coding agents, ou recarregue o Obsidian; num IDE da JetBrains, ative a definição Coding agents, ou reinicie o IDE se esta já estiver ativada. |
| `hubDisabled` | Um IDE da JetBrains só detém o documento num projeto em que não confia. As leituras continuam a funcionar; confie no projeto para permitir que o agente edite. |
| `conflict` | O ficheiro mudou no disco durante a chamada. Nada foi escrito. |
| `hubAppeared`, `hubGone` | Um editor começou a servir um documento que o agente estava a editar no disco, ou o editor que o servia continua em execução, mas o seu ficheiro de bloqueio e a ligação desapareceram. Nada foi escrito. |
| `notSaved` | `erd_save` não conseguiu guardar o documento do editor. |
| `readonly` | O editor detém o documento como só de leitura, como um ficheiro em que não consegue escrever ou que não consegue ler como diagrama. Sem editor, é o próprio ficheiro que é só de leitura, como um ficheiro do Perforce ou do TFVC sem check-out. Nada foi escrito. |
| `protocolMismatch` | A extensão ou o plugin ERD Editor do editor e o servidor utilizam versões diferentes do protocolo, como o servidor `1.0.0` com uma extensão do VS Code `3.x`. As leituras também são recusadas, e a mensagem indica o lado a atualizar — consulte [Atualizar](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | O hub de um editor não aceitou a ligação, não respondeu no espaço de 30 segundos ou desligou durante a chamada. No Windows, `hubUnreachable` também significa que o Windows impediu o agente de aceder ao hub: o editor é executado com mais direitos do que o agente, como quando foi iniciado como administrador e o agente não, ou o agente é executado numa sandbox. |

Os outros códigos são mais raros, e todas as recusas trazem uma mensagem que diz o que aconteceu.

As ferramentas de edição, `erd_batch` e as três ferramentas de leitura recusam um argumento que não declaram, ou um do tipo errado, com um erro JSON-RPC de parâmetros inválidos (`-32602`) antes de tocar no documento, pelo que um argumento mal escrito nunca é descartado em silêncio.
As cinco ferramentas de sessão ignoram os argumentos que não conhecem.
