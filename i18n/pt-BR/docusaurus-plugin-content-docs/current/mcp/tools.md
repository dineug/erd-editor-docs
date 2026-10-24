---
sidebar_position: 4
description: Todas as ferramentas que o servidor MCP do erd-editor oferece — a leitura de um documento uma página por vez, as verificações do dicionário, as 67 ferramentas de edição, erd_batch e como são um resultado e uma recusa.
---

# Ferramentas

O servidor oferece 77 ferramentas: cinco ferramentas de sessão, quatro ferramentas de leitura, 67 ferramentas de edição, uma por operação de edição, e `erd_batch`, que executa várias ferramentas de edição como uma única edição.

Todas as ferramentas, exceto `erd_list_documents`, recebem o `path` do documento como primeiro argumento, e as tabelas abaixo o omitem.
Um argumento marcado com `?` é opcional.

## Ferramentas de sessão {#session-tools}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_list_documents` | | Lista os documentos ERD com `path`, `open`, `active`, `dirty` e `readonly`: os do editor que atende o diretório de trabalho, o que em uma IDE da JetBrains abrange todos os projetos abertos, ou, caso contrário, os arquivos ERD sob o diretório de trabalho. |
| `erd_open_document` | `create?` | Abre um documento para edição, no ERD Editor do editor que o atende, se houver um. Com `create`, cria antes o arquivo se ele não existir, e um nome sem extensão recebe `.erd.json`. |
| `erd_save` | | Salva um documento mantido por um editor. O VS Code mantém as edições do agente não salvas até que esta ferramenta seja chamada; o Obsidian e uma IDE da JetBrains as salvam como salvam as suas, e esta ferramenta as grava imediatamente. No modo headless, cada edição já está gravada, como diz o `saved: true` de seu resultado, e esta ferramenta não faz nada. |
| `erd_undo` | | Reverte a última edição feita por este agente, nunca as suas. As chamadas que não criaram nenhuma entrada de desfazer são puladas e indicadas pelo nome. |
| `erd_redo` | | Aplica novamente a última edição revertida por `erd_undo`. |

Consulte [Ao vivo e headless](./live-and-headless.md) para saber o que o salvamento e o desfazer fazem em cada modo.

## Ler um documento {#reading-a-document}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | As configurações e as contagens, depois uma página de tabelas com seus índices e relacionamentos, cada tabela com seu id, sua posição e seu tamanho no canvas, seu número de colunas, seu nome lógico, se tiver um, e seu grupo de tabelas, se estiver em um. A menos que faça uma pesquisa, os grupos de tabelas, as notas e depois os domínios, os termos e as palavras vêm após as tabelas. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?`, `wordIds?`, `termIds?`, `domainIds?` | As entidades indicadas, por completo: tabelas com suas colunas e seu grupo de tabelas, relacionamentos com suas colunas e seus `onDelete` e `onUpdate`, índices com suas colunas, notas com seu texto, grupos de tabelas com suas tabelas, e palavras, termos e domínios com todos os campos. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `logicalNameAsComment?`, `tableIds?`, `tableNames?`, `groupNames?` | O documento inteiro de uma vez em um de quatro formatos, ou o DDL de apenas algumas tabelas ou grupos de tabelas. |
| `erd_list_checks` | `level?`, `tableIds?`, `tableNames?`, `offset?`, `limit?` | O que os dicionários de palavras, termos e domínios encontram de errado, como a planilha `Checks` da aba Dicionário do editor o lista, uma página por vez. Não altera nada — consulte [Verificações do dicionário](#dictionary-checks). |

Um agente encontra os ids com `erd_list`, lê colunas, linhas de dicionário e outros detalhes com `erd_get` e passa esses ids às ferramentas de edição.
O tamanho de uma tabela em `erd_list` é a caixa que ela ocupa no canvas: a altura exata, a largura aproximada.
Um grupo de tabelas é listado pelo retângulo que armazena, com seu nome, sua cor e quantas tabelas contém.
Cada relacionamento é listado uma vez, com uma de suas duas tabelas.
Uma linha de dicionário é listada pelo seu id, pelo seu `name` e pelo que ela dá a um nome físico ou a uma coluna: o `dataType` de um domínio, o `physicalName` e o `domainId` de um termo e a `abbreviation` de uma palavra. Cada dicionário lista suas linhas na ordem que sua planilha mostra.
As configurações que `erd_list` e `erd_read` informam são as que o arquivo salva — consulte [Configurações](#settings).

Em `erd_get` e no formato `snapshot` de `erd_read`, cada tabela e cada coluna traz seu `logicalName`, uma string vazia quando não há nenhum, e `nameDerived`, que é `true` enquanto o nome for o que os dicionários deram, de modo que um novo nome lógico o deriva novamente — consulte [Dicionários](#dictionaries).
Toda coluna traz seu `domainId`, e todo termo também: uma string vazia quando não há nenhum, ou para um domínio que o documento não lista mais.

`erd_read` recebe um de quatro formatos:

| `format` | O que responde |
| --- | --- |
| `snapshot` | JSON compacto com cada entidade e seu id, incluindo os grupos de tabelas e as linhas de palavras, termos e domínios, e as configurações com os scripts do Esquema SQL. Omite o que varia de um usuário para outro: as larguras medidas, a ordem de empilhamento, a área visível, a aba e a exibição de nomes. Grande em um esquema extenso. |
| `sql` | DDL para um dos oito bancos de dados, `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` ou `SQLite`. `vendor` tem como padrão o banco de dados definido no documento. O DDL do documento inteiro inclui seus scripts antes e depois das tabelas. Com `tableIds`, `tableNames` ou `groupNames`, apenas essas tabelas, com as chaves estrangeiras que contêm, e nenhum script. As chaves estrangeiras trazem suas ações ON DELETE e ON UPDATE, exceto as que o banco de dados de destino omite — consulte [ON DELETE e ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | O documento inteiro exatamente como um salvamento grava o arquivo, incluindo as edições que o editor ainda não salvou — consulte [Forma de armazenamento e valor em tempo de execução](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Apenas os scripts antes e depois das tabelas do documento, como `{"before":"…","after":"…"}`, cada um vazio quando não definido, por maior que seja o esquema. |

Apenas o formato `sql` recebe `vendor`, `statements`, `header`, `logicalNameAsComment`, `tableIds`, `tableNames` e `groupNames`, e qualquer outro formato os recusa.

- `statements`: `create`, o padrão; `ifNotExists`, que escreve `CREATE TABLE IF NOT EXISTS` no MySQL, MariaDB, PostgreSQL, SQLite e Databricks e um `CREATE TABLE` simples nos demais; ou `recreate`, que exclui as tabelas antes de criá-las, caso em que o Snowflake escreve `CREATE OR REPLACE TABLE` em vez disso.
- `header`: `none`, o padrão; `use`, que seleciona o banco de dados ou o esquema indicado pelo nome do banco de dados do documento; ou `createAndUse`, que o cria antes. O Oracle só tem `use`, então `createAndUse` escreve `use` nele, e o PostgreSQL só tem `createAndUse`, então `use` não escreve nenhum cabeçalho nele. O SQLite não escreve nenhum, e nenhum banco de dados escreve um enquanto o nome do banco de dados estiver em branco ou não for um identificador simples.
- `logicalNameAsComment`: `true` escreve o nome lógico de uma tabela ou coluna como seu comentário enquanto o comentário estiver vazio ou só tiver espaços em branco, onde e na forma em que cada banco de dados escreve um comentário, e mantém todo comentário que contém texto; `false`, o padrão, não escreve nenhum nome lógico — consulte [Nomes lógicos como comentários](../guide/guides/schema-sql.md#logical-names-as-comments).
- `groupNames`: as tabelas dos grupos de tabelas indicados, pelo nome, sem diferenciar maiúsculas de minúsculas, somadas às de `tableIds` e `tableNames`. Um nome que não corresponde a nenhum grupo é recusado com `notFound`. Um grupo que não contém nenhuma tabela não acrescenta nenhuma, e uma leitura que fica sem nenhuma tabela, como quando todos os grupos indicados estão vazios e nenhuma tabela é indicada, é recusada com `invalidArgs`.

`statements`, `header` e `logicalNameAsComment` também se aplicam ao DDL de algumas tabelas. Funcionam como as opções `Statements` e `Header` e o interruptor `Write logical names into empty comments` da aba [Esquema SQL](../guide/guides/schema-sql.md#options-panel) do editor, embora a aba comece em `If not exists` e `CREATE + USE`. O interruptor começa desativado, como `logicalNameAsComment`.
Os nomes são delimitados com o tipo de delimitador que o arquivo salva, o bloqueado enquanto `Bracket Type` estiver bloqueado — consulte [Bloqueio](../guide/guides/settings.md#lock).

### Esquemas grandes {#large-schemas}

Esquemas de centenas ou milhares de tabelas também funcionam.
Uma leitura responde com no máximo 40.000 caracteres, abaixo do limite a partir do qual o Claude Code coloca o resultado de uma ferramenta à parte, em um arquivo.

- `erd_list` responde com uma página de 100 por padrão, primeiro as tabelas, depois os grupos de tabelas, as notas, os domínios, os termos e as palavras, com um único offset percorrendo todos eles, e indica onde começa a próxima página com `nextOffset` e uma `note`. Passe esse `nextOffset` como `offset`, com o mesmo `query`.
- `query` encontra tabelas por palavras no nome, no nome lógico ou no comentário de uma tabela ou coluna, sem diferenciar maiúsculas de minúsculas. As tabelas cujos nomes ou nomes lógicos contêm mais dessas palavras vêm primeiro. Uma pesquisa não lista grupos de tabelas, notas nem linhas de dicionário.
- `namesOnly` lista apenas os nomes das tabelas, cerca de 2.000 nomes curtos em uma resposta.
- `erd_get` e `erd_read` recebem `tableNames`, além dos ids, e `erd_read` recebe `groupNames`, de modo que um agente a quem se pede uma consulta SQL sobre um esquema grande lê o DDL apenas das tabelas de que precisa.
- Os dicionários também vêm em partes: `erd_list` percorre suas linhas depois das tabelas, e `erd_get` fornece as linhas por completo por `domainIds`, `termIds` e `wordIds`.
- `erd_get` lista em `missing` os ids e nomes que não indicam nada, e em `notReturned` os ids para os quais uma resposta não tem espaço, para que sejam pedidos de novo.
- `erd_list_checks` responde uma página por vez da mesma forma — consulte [Verificações do dicionário](#dictionary-checks).
- Uma leitura grande demais para uma resposta é recusada com `tooLarge`, com instruções de como restringi-la.

### Verificações do dicionário {#dictionary-checks}

`erd_list_checks` lista as verificações da [planilha Verificações](../guide/guides/dictionary.md#the-checks-sheet) do editor, na mesma ordem: primeiro as verificações das palavras, depois as dos termos e as dos domínios, cada dicionário na ordem que sua planilha mostra, e então cada tabela seguida de suas colunas.
Como na planilha, uma verificação só é executada enquanto o dicionário que ela lê contém uma linha. Um documento cujos dicionários não contêm nenhuma palavra, termo ou domínio não passa por nenhuma verificação: `total` é `0`, e a `note` o informa.

- `level`: `error` ou `warning` para apenas esse nível; os dois por padrão.
- `tableIds` e `tableNames`: apenas as verificações dessas tabelas e de suas colunas, com os nomes sem diferenciar maiúsculas de minúsculas, o que deixa de fora as linhas dos próprios dicionários. Um id ou um nome que não indica nenhuma tabela é recusado com `notFound`.
- `offset` e `limit`: uma página de 100 verificações por padrão, que também para onde uma resposta fica cheia. Enquanto houver mais, `nextOffset` e uma `note` indicam onde começa a próxima página; passe-o como `offset` com os mesmos filtros. Depois de corrigir algumas verificações, liste de novo a partir do offset `0`: uma verificação corrigida sai da lista, então um offset posterior pularia verificações ainda não corrigidas.

A resposta contém `total`, quantas verificações os filtros mantêm; `counts`, quantas delas cada código tem, deixando de fora um código sem nenhuma; e a página como `checks`.
Cada verificação informa seu `level`, seu `code` e o `kind` e o `id` de seu alvo: `table`, `column`, `word`, `term` ou `domain`. A verificação de uma coluna acrescenta seu `tableId` e o nome de sua tabela como `table`.
`name` é o nome do alvo, o nome físico de uma tabela ou de uma coluna, com seu `logicalName` quando tem um. `field` é o que a verificação lê: `name`, `logicalName` ou `domainId`. `text` é o que ela encontrou ali, e `suggestions`, quando os dicionários oferecem alguma, é o que usar em vez disso. Assim, um agente pode corrigir uma verificação sem um `erd_get`:

```json
{"level":"warning","code":"physicalNameMismatch","kind":"column","id":"8e1z0q4xk2m7cwd5tfb9h3ynp","tableId":"03h17be2plxpj5n59tqag7ogj","table":"users","name":"id","logicalName":"Member Number","field":"name","text":"id","suggestions":["MBR_NO"]}
```

| `code` | `level` | `Type` na planilha | O que encontra |
| --- | --- | --- | --- |
| `duplicateName` | `error` | `Duplicate name` | Um nome que duas linhas de um mesmo dicionário compartilham. Cada uma das linhas é listada. |
| `unknownDomain` | `error` | `Unknown domain` | Uma coluna ou um termo vinculado a um domínio que o documento não lista mais. `text` é o nome desse domínio, ou seu id quando nenhum nome é conhecido. |
| `forbiddenWord` | `error` | `Forbidden word` | Uma palavra que alguma palavra lista como proibida, no nome lógico de uma tabela ou coluna ou no nome de um termo. `suggestions` são as palavras padrão. |
| `unregisteredWord` | `warning` | `Unregistered word` | Um texto que nenhuma palavra lista, nos mesmos lugares. |
| `synonymWord` | `warning` | `Synonym` | Um sinônimo usado no lugar de uma palavra padrão, nos mesmos lugares. `suggestions` são as palavras padrão. |
| `physicalNameMismatch` | `warning` | `Physical name mismatch` | Um nome físico de tabela ou coluna diferente do que o termo de seu nome lógico dá. A sugestão é o nome físico do termo, ou o que suas palavras compõem enquanto o termo não tiver nenhum. |
| `domainTypeMismatch` | `warning` | `Domain type mismatch` | Uma coluna cujo tipo de dados não é o do domínio a que está vinculada. `text` é o tipo da coluna, e a sugestão, o do domínio. |

Como cada verificação lê um nome é explicado em [O que cada verificação encontra](../guide/guides/dictionary.md#what-each-check-finds).

## Ferramentas de edição {#edit-tools}

Os ids vêm de `erd_list` e `erd_get`, ou do `createdIds` da chamada que criou a entidade.
Um id novo tem 25 caracteres, entre letras minúsculas e dígitos, como `03h17be2plxpj5n59tqag7ogj`, enquanto um id que o documento já contém mantém sua forma, então não tire conclusões do formato de um id.
`x` e `y` são as bordas esquerda e superior no canvas, em pixels, e uma cor é uma cor hexadecimal CSS como `#3b82f6`, ou uma string vazia, que remove a cor.

### Tabelas {#tables}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_table` | | Adiciona uma tabela vazia em um espaço livre e retorna seu id em `createdIds`. |
| `erd_remove_table` | `tableId` | Remove uma tabela com suas colunas, seus índices e todos os relacionamentos ligados a ela. |
| `erd_change_table_name` | `tableId`, `value` | Renomeia uma tabela. O nome passa então a ser escrito manualmente, de modo que um nome lógico posterior o deixa como está enquanto ele não estiver vazio — consulte [Dicionários](#dictionaries). |
| `erd_change_table_comment` | `tableId`, `value` | Define o comentário de uma tabela. Uma string vazia o remove. |
| `erd_set_table_logical_name` | `tableId`, `value` | Define o nome lógico de uma tabela. Uma string vazia o remove e mantém o nome. Enquanto o nome da tabela estiver vazio ou tiver sido derivado, os dicionários o derivam do nome lógico — consulte [Dicionários](#dictionaries). Um termo não dá domínio a uma tabela. |
| `erd_change_table_color` | `tableId`, `color` | Define a cor de uma tabela. |
| `erd_move_table` | `tableId`, `x`, `y` | Move uma tabela para uma posição no canvas. |
| `erd_move_tables` | `positions` | Move várias tabelas em uma única edição, que um único `erd_undo` reverte. `positions` contém `{ tableId, x, y }` por tabela, cada tabela no máximo uma vez. |
| `erd_sort_tables` | | Posiciona todas as tabelas em linhas pelo canvas, primeiro as tabelas com menos colunas, como `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` e `erd_import_aml` as posicionam. As tabelas de um grupo de tabelas ficam juntas, e a caixa de cada grupo é ajustada ao redor delas. |

### Colunas {#columns}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Adiciona uma coluna vazia a uma tabela e retorna seu id em `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Remove colunas de uma única tabela, com os relacionamentos e as entradas de índice que as usam. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Renomeia uma coluna. O nome passa então a ser escrito manualmente, como o de uma tabela. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Define o tipo de dados, como `INT` ou `VARCHAR(255)`. Enquanto a [sincronização do tipo de dados nos relacionamentos](../guide/guides/settings.md#relationship-datatype-sync) estiver ativada, a alteração segue os relacionamentos nos dois sentidos, como no editor: um tipo serial chega às chaves estrangeiras como o tipo inteiro que armazena, assim como `erd_add_relationship` o copia, e uma chave serial mantém seu tipo quando uma de suas chaves estrangeiras muda, o que interrompe a alteração ali. Cabe ao usuário ativar ou desativar a sincronização, e `erd_list` a informa como `relationshipDataTypeSync`. Uma coluna vinculada a um domínio é desvinculada dele quando recebe um tipo diferente do tipo do domínio, assim como cada coluna alcançada pela sincronização cujo novo tipo difere do tipo de seu próprio domínio — consulte [Desvincular](../guide/guides/dictionary.md#unlinking). |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Define o valor padrão, como texto SQL. Uma string vazia o remove. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Define o comentário. Uma string vazia o remove. |
| `erd_set_column_logical_name` | `tableId`, `columnId`, `value` | Define o nome lógico de uma coluna. Uma string vazia o remove e mantém o nome. Enquanto o nome da coluna estiver vazio ou tiver sido derivado, os dicionários o derivam, e o domínio de um termo vincula a coluna e lhe dá o tipo de dados do domínio — consulte [Dicionários](#dictionaries). |
| `erd_set_column_domain` | `tableId`, `columnId`, `domainId?`, `domainName?` | Vincula uma coluna a um domínio, indicado pelo id ou pelo nome, um dos dois. A coluna assume o tipo de dados do domínio, que segue os relacionamentos enquanto a sincronização do tipo de dados nos relacionamentos estiver ativada, com a mesma desvinculação de `erd_change_column_data_type`. Um `domainId` igual a `null` ou a uma string vazia, ou um `domainName` vazio, desvincula a coluna e mantém seu tipo. |
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
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Relaciona duas tabelas. Copia a chave primária da tabela pai para a filha como colunas de chave estrangeira, criando antes uma coluna de chave primária se a pai não tiver nenhuma. Cada coluna de chave estrangeira é nomeada como ao desenhar um relacionamento no editor: a chave `id` de `users` gera `users_id`, e uma chave como `member_id` mantém seu nome — consulte [Nomes das colunas de chave estrangeira](../guide/guides/relationship-editing.md#foreign-key-column-names). Cada uma copia o tipo de dados de sua chave, exceto que uma chave serial gera o tipo inteiro que armazena, como `integer` para `serial4`, e um `serial` puro continua `serial` fora do PostgreSQL, MySQL e MariaDB — consulte [Relacionamentos identificadores](../guide/guides/relationship-editing.md#identifying-relationships). Cada uma também assume o nome lógico de sua chave e se vincula ao domínio a que sua chave está vinculada, a menos que uma chave serial lhe dê outro tipo. `createdIds` contém essa nova coluna de chave, se uma foi criada, as colunas de chave estrangeira e, por último, o id do relacionamento. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Desenha um relacionamento entre colunas que já existem, emparelhando as colunas iniciais e finais pela posição. Não renomeia nenhuma coluna, não altera nenhum tipo de dados e não copia nenhum nome lógico nem domínio. |
| `erd_remove_relationship` | `relationshipId` | Remove uma linha de relacionamento. Suas colunas de chave estrangeira permanecem na tabela. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Altera a cardinalidade de um relacionamento. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Define a ação ON DELETE de um relacionamento: o que excluir uma linha pai faz com suas linhas filhas. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Define a ação ON UPDATE de um relacionamento: o que alterar uma chave pai faz com suas linhas filhas. |

`erd_add_relationship` nomeia as colunas de chave estrangeira e copia os nomes lógicos de suas chaves ao ser executada. Uma renomeação ou um nome lógico posterior na chave não chega a elas, então dê nome à tabela pai e à sua chave primária, e dê à chave seu nome lógico, antes.
Os nomes que ela dá contam como escritos manualmente, então um nome lógico posterior os deixa como estão, enquanto `erd_derive_physical_names` os devolve aos dicionários — consulte [Dicionários](#dictionaries).

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

### Dicionários {#dictionaries}

Estas ferramentas editam os três dicionários da aba [Dicionário](../guide/guides/dictionary.md) do editor, a partir dos quais o nome lógico de uma tabela ou coluna deriva seu nome físico:

- Uma palavra é uma palavra padrão de que os nomes lógicos são feitos, com a abreviatura que ela escreve em um nome físico, como `Member` e `MBR`.
- Um termo é um nome lógico inteiro com o nome físico que ele dá e, para uma coluna, o domínio que ele vincula, como `Member Number` com `MBR_NO` e `Identifier`.
- Um domínio é um tipo de dados com nome ao qual as colunas se vinculam, como `Identifier` para `INT`.

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_word` | `name`, `abbreviation`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Adiciona uma palavra ao final do dicionário de palavras e retorna seu id em `createdIds`. `synonyms` e `forbiddenWords` são separados por vírgulas: outras grafias da palavra e palavras que não devem ser usadas no lugar dela. |
| `erd_update_word` | `wordId`, `name?`, `abbreviation?`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Altera os campos passados e mantém os demais. |
| `erd_remove_word` | `wordId` | Remove uma palavra. |
| `erd_add_term` | `name`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Adiciona um termo ao final do dicionário de termos e retorna seu id em `createdIds`. Sem um `physicalName`, as palavras compõem um, se puderem, como `MBR_NO` para `Member Number`. |
| `erd_update_term` | `termId`, `name?`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Altera os campos passados e mantém os demais. Um `name` passado enquanto o termo não tem nome físico, ou com um `physicalName` vazio, também escreve o nome físico que suas palavras compõem, se compuserem um. |
| `erd_remove_term` | `termId` | Remove um termo. |
| `erd_add_domain` | `name`, `category?`, `dataType`, `description?` | Adiciona um domínio ao final do dicionário de domínios e retorna seu id em `createdIds`. `category` agrupa os domínios, como `Number` ou `Text`. |
| `erd_update_domain` | `domainId`, `name?`, `category?`, `dataType?`, `description?` | Altera os campos passados e mantém os demais. Um novo `dataType` chega a todas as colunas vinculadas ao domínio e segue os relacionamentos enquanto a sincronização do tipo de dados nos relacionamentos estiver ativada, com a mesma desvinculação de `erd_change_column_data_type`. |
| `erd_remove_domain` | `domainId` | Remove um domínio. As colunas vinculadas a ele mantêm seu tipo de dados, e elas e os termos vinculados a ele não mostram nenhum domínio: seu `domainId` é lido como uma string vazia. `erd_undo` traz os vínculos de volta, e um salvamento os deixa fora do arquivo. |
| `erd_derive_physical_names` | `scope`, `tableId?`, `columnId?` | Deriva novamente os nomes físicos a partir dos nomes lógicos, como faz o comando [Derivar nomes físicos novamente](../guide/guides/dictionary.md#derive-physical-names-again) do editor, para uma coluna, uma tabela ou o documento inteiro. |

- Um dicionário contém cada nome uma única vez, então um nome que outra linha do mesmo dicionário já contém é recusado com `invalidArgs`. Os nomes são comparados sem os espaços das pontas, e maiúsculas e minúsculas são diferenciadas, então `Member` e `member` são dois nomes.
- Uma atualização indica a linha pelo seu id e passa pelo menos um campo. Valores que a linha já contém não alteram nada e não criam entrada de desfazer; uma adição ou uma remoção sempre cria uma.
- O domínio de um termo vem por `domainId`, com `null` ou uma string vazia para nenhum, ou por `domainName`, com uma string vazia para nenhum. Um `domainName` assume o primeiro domínio com esse nome na ordem do dicionário, comparado como os nomes são. Passar os dois, ou um `domainName` que nenhum domínio tem, é recusado. `erd_set_column_domain` recebe um domínio da mesma forma.
- Alterar ou remover uma palavra ou um termo não renomeia nada nem desvincula nada: os nomes e os domínios que deu permanecem como estão. `erd_derive_physical_names` deriva os nomes novamente e vincula o domínio que um termo dá agora, mas uma coluna à qual nenhum termo corresponde agora, ou cujo termo não dá nenhum domínio, mantém o domínio a que está vinculada. `erd_set_column_domain` com um `domainId` vazio a desvincula.
- Nenhuma ferramenta importa ou exporta um dicionário como CSV, classifica um dicionário ou insere linhas em uma posição, como faz a aba Dicionário.

`erd_list` lista as linhas, `erd_get` fornece todos os campos, o formato `snapshot` de `erd_read` contém todas elas e `erd_list_checks` lista o que os dicionários encontram de errado — consulte [Ler um documento](#reading-a-document).

`erd_set_table_logical_name` e `erd_set_column_logical_name` derivam um nome físico como o editor faz quando um nome lógico é escrito — consulte [Derivar nomes físicos](../guide/guides/dictionary.md#deriving-physical-names):

- Um nome só é derivado enquanto estiver vazio ou tiver sido ele próprio derivado, o que as leituras mostram como `nameDerived: true`. Um nome que não está vazio e foi escrito manualmente permanece, e só o nome lógico é escrito. Todos estes escrevem nomes manualmente: `erd_change_table_name`, `erd_change_column_name`, as importações de SQL, GraphQL, DBML e AML e `erd_add_relationship`, nas colunas de chave estrangeira que nomeia. Um nome renomeado para uma string vazia é derivado novamente pelo próximo nome lógico.
- O termo cujo nome é o nome lógico vem primeiro, comparado como os nomes de dicionário são. Ele dá seu nome físico, ou o que suas palavras compõem enquanto ele não tiver nenhum. Para uma coluna, ele também vincula o domínio do termo, mesmo quando nenhum nome é derivado, e a coluna assume o tipo de dados do domínio, seguindo os relacionamentos enquanto a sincronização do tipo de dados nos relacionamentos estiver ativada.
- Sem um termo assim, as palavras compõem o nome, com suas abreviaturas unidas por sublinhados: `Member Number` gera `MBR_NO`. É tudo ou nada: um sinônimo, uma palavra proibida, um texto que nenhuma palavra lista ou uma palavra sem abreviatura não compõe nada, e o nome fica como estava. As palavras não vinculam nenhum domínio, nem um termo sem domínio, então uma coluna mantém o domínio a que está vinculada.
- Uma coluna cujo nome derivado outra coluna de sua tabela já tem, sem diferenciar maiúsculas de minúsculas, mantém seu nome, seu `nameDerived` e seu domínio.
- Remover um nome lógico deixa o nome físico como está. Uma chamada cujo nome lógico, e o que ele deriva, já estão no lugar não altera nada e não cria entrada de desfazer.

`erd_derive_physical_names` recebe um `scope`: `column`, com `tableId` e `columnId`, para essa coluna; `table`, com `tableId`, para o nome da tabela e todas as suas colunas; ou `document`, sem nenhum id, para todas as tabelas e suas colunas. Um escopo ao qual falta um id de que precisa, ou que recebe um que não aceita, é recusado.
Cada nome abrangido que tem um nome lógico volta aos dicionários, incluindo um nome escrito manualmente, e assume o que eles dão agora: o nome físico de um termo e, para uma coluna, seu domínio e seu tipo, ou então a composição das palavras, que deixa o domínio da coluna como está. Um nome lógico que não deriva nada deixa o nome como está, com `nameDerived` agora `true`. Um nome sem nome lógico permanece como está, assim como uma coluna cujo novo nome outra coluna de sua tabela tem, como uma segunda chave estrangeira para uma mesma tabela, que também mantém seu `nameDerived`. Um único `erd_undo` reverte a chamada inteira.
Os nomes de um esquema importado são escritos manualmente, então nomeie-o a partir dos dicionários definindo os nomes lógicos e depois chamando `erd_derive_physical_names`. Essa chamada dá o nome físico próprio de um termo, que uma alteração nas palavras do termo não compõe de novo. Por isso, depois de alterar as palavras de um termo, atualize o termo antes: passe seu `name` com um `physicalName` vazio para que as palavras o componham de novo, ou passe o novo `physicalName`.

Uma versão do ERD Editor anterior à aba Dicionário descarta os nomes lógicos, os vínculos com domínios e as linhas de dicionário de um arquivo ao salvá-lo, como fazem a extensão do VS Code anterior à `4.2.0` e os plugins do Obsidian e da JetBrains anteriores à `1.2.0`. Destes, a extensão `4.0.0` ou `4.1.0` e os plugins `1.0.0` ou `1.1.0` ainda editam ao vivo com o servidor, mas não mostram nem mantêm os nomes lógicos, os vínculos com domínios e as linhas de dicionário que um agente escreve — consulte [Atualizar](./installation.md#updating).

### Configurações {#settings}

Um agente define as configurações do próprio esquema: o banco de dados, seu nome e os scripts do [Esquema SQL](../guide/guides/schema-sql.md).
Todas as outras configurações que o documento armazena cabem ao usuário definir no editor: a [exibição de nomes](../guide/guides/logical-names.md#name-view), os botões de alternância do menu [Opções de exibição](../guide/guides/table-related-functions.md#table-view-options), as opções da aba [Configurações](../guide/guides/settings.md), a linguagem e os estilos de nome do Gerador de código, o tipo de delimitador e os [bloqueios](../guide/guides/settings.md#lock).
Nenhuma ferramenta as altera, exceto as importações no modo `replace`: `erd_import_json` traz as configurações e os bloqueios do documento que carrega, e as outras quatro levam a área visível de volta ao início do canvas — consulte [Importação](#import).
O servidor `1.0.0` removeu as ferramentas que as definiam: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` e `erd_set_show`.

`erd_list` e o formato `snapshot` de `erd_read` informam as configurações como o arquivo as salva, com `lockSettings` contendo um sinalizador por bloqueio: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase`, `bracketType` e `unlockNameViewMode`.
O último é lido ao contrário: é `false` enquanto o bloqueio `Name View` está ativado, como em um documento novo e em um arquivo salvo antes de esse bloqueio existir, e `true` quando o usuário desativa o bloqueio.
Uma linguagem, um estilo de nome ou um tipo de delimitador bloqueado é informado com seu valor bloqueado, aquele que o arquivo mantém e com o qual todo editor abre, seja o que for que a tela de um editor mostre. A área visível, a aba e a exibição de nomes não são informadas. Um agente lê e escreve nomes lógicos seja o que for que a exibição de nomes mostre.

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

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` e `erd_import_aml` substituem todas as tabelas, relacionamentos, índices, notas e grupos de tabelas. Mantêm as configurações do documento, incluindo seus bloqueios, exceto a área visível, que volta ao início do canvas em 100%, e mantêm seus dicionários de palavras, termos e domínios. As tabelas que elas trazem não têm nomes lógicos e não se vinculam a nenhum domínio.
- `erd_import_json` substitui o documento inteiro, incluindo suas configurações e seus dicionários: as configurações, os bloqueios, as palavras, os termos e os domínios do JSON tomam o lugar dos deste documento, e um JSON que não registra nenhum bloqueio ativa todos os bloqueios e coloca a área visível no início do canvas. Cada usuário mantém sua própria exibição de nomes, a menos que o JSON tenha o bloqueio `Name View` desativado, o que traz a exibição de nomes dele. Para manter as configurações deste documento, parta do texto fornecido pelo formato `json` de `erd_read`. Um texto vazio gera um documento novo, como o que `erd_open_document` cria com `create`.

`append` acrescenta a importação ao documento, como faz a opção [Importar e adicionar](../guide/guides/file-import-export.md#import-and-add) do editor, e um único `erd_undo` desfaz todo o acréscimo:

- O conteúdo do texto entra como novas entidades com novos ids, em um bloco abaixo de tudo o que o documento contém, incluindo as notas e os grupos de tabelas ocultos, alinhado à borda esquerda do conteúdo existente. Todas as tabelas e configurações já existentes permanecem, incluindo uma tabela com o mesmo nome: nada é mesclado pelo nome.
- Relacionamentos e índices só entram entre as tabelas que a importação traz, então uma chave estrangeira para uma tabela que o texto não declara é descartada.
- `erd_import_sql`, `erd_import_graphql` e `erd_import_aml` adicionam tabelas com seus relacionamentos e índices, e `erd_import_dbml` também seus grupos de tabelas. `erd_import_json` adiciona tabelas, relacionamentos, índices, notas e grupos de tabelas, nunca suas configurações, e recusa um texto vazio. Suas tabelas e colunas trazem seus nomes lógicos, mas nenhuma coluna se vincula a um domínio, e nenhuma das palavras, dos termos ou dos domínios do JSON entra.

Um documento JSON mantém sua própria disposição, incluindo seus grupos de tabelas: onde posiciona suas tabelas com `replace` e dentro do bloco adicionado com `append`.
As tabelas de SQL, GraphQL, DBML e AML são dispostas em linhas, primeiro as tabelas com menos colunas e com as tabelas de cada grupo juntas, como `erd_sort_tables` as posiciona, nunca pelo `Flow`, como a própria importação do editor as organiza quando pode. Essas quatro ferramentas recusam um texto vazio em qualquer um dos modos.

## erd_batch {#erd_batch}

`erd_batch` executa várias ferramentas de edição em ordem como uma única edição, todas ou nenhuma.

- `operations` contém até 100 entradas, cada uma `{ tool, as?, args? }`, em que `tool` é uma ferramenta de edição e `args` são os argumentos da ferramenta sem `path`. Uma ferramenta de leitura, como `erd_list_checks`, é recusada.
- As operações são testadas antes em uma cópia do documento. Uma operação recusada é indicada, como `operations[1] erd_remove_table: …`, e nada é aplicado.
- Um único `erd_undo` reverte o lote inteiro, exceto as operações que ele não consegue reverter, que o `undoNote` do resultado indica: as de uma ferramenta que não cria entrada de desfazer, como `erd_set_database`, e as que alteraram o documento sem criar uma, como um `erd_move_table_group` curto. Um lote que não criou nenhuma entrada de desfazer é pulado por `erd_undo`. `historyEntries` no resultado conta as entradas do histórico do editor dentro dele, não as chamadas de `erd_undo`.
- Em uma sessão ao vivo, o editor aceita o lote inteiro ou nada dele.

Um agente não tem como saber os ids que um lote cria antes de chamá-lo, então uma operação nomeada com `as` permite que uma posterior se refira a eles: `$name` ou `$name.0` para seu primeiro id criado, `$name.1` para o segundo e `$name.last` para o último.
Um nome contém letras ASCII, dígitos e sublinhados, não começa com dígito e nomeia apenas uma operação.
Uma referência só é resolvida onde um argumento recebe um id de entidade, incluindo `wordId`, `termId` e `domainId`, então um nome ou comentário que diz `$x` continua sendo texto.
Um `domainName` também é texto, mas é lido quando sua operação é executada, então pode indicar um domínio que uma operação anterior do lote adicionou.

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

Palavras, um domínio e um termo, e depois uma tabela nomeada a partir deles por seus nomes lógicos:

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_word", "args": { "name": "Member", "abbreviation": "MBR" } },
    { "tool": "erd_add_word", "args": { "name": "Number", "abbreviation": "NO" } },
    { "tool": "erd_add_word", "args": { "name": "Name", "abbreviation": "NM" } },
    { "tool": "erd_add_domain", "as": "identifier", "args": { "name": "Identifier", "dataType": "INT" } },
    { "tool": "erd_add_term", "args": { "name": "Member Number", "domainId": "$identifier" } },
    { "tool": "erd_add_table", "as": "members" },
    { "tool": "erd_set_table_logical_name", "args": { "tableId": "$members", "value": "Member" } },
    { "tool": "erd_add_column", "as": "no", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$no", "value": "Member Number" } },
    { "tool": "erd_add_column", "as": "nm", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$nm", "value": "Member Name" } }
  ]
}
```

O termo compõe `MBR_NO` a partir de suas palavras, e a tabela recebe o nome `MBR`. A coluna `Member Number` assume o `MBR_NO` do termo e seu domínio, então fica vinculada a `Identifier` e com o tipo `INT`, e `Member Name`, que nenhum termo contém, é composto como `MBR_NM`.

## Resultados {#results}

Uma edição responde com uma linha de JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Campo | Significado |
| --- | --- |
| `mode` | `live` ou `headless` — consulte [Ao vivo e headless](./live-and-headless.md). |
| `saved` | `true` no resultado de toda edição, de `erd_batch`, de `erd_undo` e de `erd_redo` no modo headless: o arquivo contém a alteração no momento em que a chamada responde, então não resta nada a salvar. Um resultado ao vivo não tem `saved`, já que o editor mantém a alteração — consulte [Salvamento](./live-and-headless.md#saving). |
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
| `protocolMismatch` | A extensão ou o plugin ERD Editor do editor e o servidor usam versões de protocolo diferentes, como o servidor `1.0.0` ou posterior com uma extensão do VS Code `3.x`. As leituras também são recusadas, e a mensagem indica o lado a atualizar — consulte [Atualizar](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | O hub de um editor não aceitou a conexão, não respondeu em até 30 segundos ou encerrou a conexão durante a chamada. No Windows, `hubUnreachable` também significa que o Windows impediu o agente de acessar o hub: o editor é executado com mais direitos que o agente, como quando foi iniciado como administrador e o agente não, ou o agente é executado em um ambiente isolado (sandbox). |

Outros códigos são mais raros, e toda recusa traz uma mensagem que diz o que aconteceu.

As ferramentas de edição, `erd_batch` e as quatro ferramentas de leitura recusam um argumento que não declaram, ou um do tipo errado, com um erro JSON-RPC de parâmetros inválidos (`-32602`) antes de tocar no documento, de modo que um argumento com erro de digitação nunca é descartado silenciosamente.
As cinco ferramentas de sessão ignoram argumentos que não conhecem.
