---
sidebar_position: 4
description: Todas as ferramentas que o servidor MCP do erd-editor oferece — a leitura de um documento uma página de cada vez, as verificações do dicionário, as 67 ferramentas de edição, erd_batch e o aspeto de um resultado e de uma recusa.
---

# Ferramentas

O servidor oferece 77 ferramentas: cinco ferramentas de sessão, quatro ferramentas de leitura, 67 ferramentas de edição, uma por operação de edição, e `erd_batch`, que executa várias ferramentas de edição como uma só edição.

Todas as ferramentas, exceto `erd_list_documents`, recebem o `path` do documento como primeiro argumento, e as tabelas abaixo omitem-no.
Um argumento marcado com `?` é opcional.

## Ferramentas de sessão {#session-tools}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_list_documents` | | Lista os documentos ERD com `path`, `open`, `active`, `dirty` e `readonly`: os do editor que serve o diretório de trabalho, que num IDE da JetBrains abrange todos os projetos abertos, ou, caso contrário, os ficheiros ERD dentro do diretório de trabalho. |
| `erd_open_document` | `create?` | Abre um documento para edição, no ERD Editor do editor que o serve, se houver algum. Com `create`, cria primeiro o ficheiro se este não existir, e um nome sem extensão recebe `.erd.json`. |
| `erd_save` | | Guarda um documento que um editor detém. O VS Code mantém as edições do agente por guardar até esta ferramenta ser chamada; o Obsidian e um IDE da JetBrains guardam-nas tal como guardam as edições feitas por si, e esta ferramenta escreve-as de imediato. No modo headless, todas as edições já estão escritas, como indica o `saved: true` do seu resultado, e esta ferramenta não faz nada. |
| `erd_undo` | | Reverte a última edição feita por este agente, nunca uma feita por si. As chamadas que não criaram nenhuma entrada de anulação são ignoradas e indicadas pelo nome. |
| `erd_redo` | | Volta a aplicar a última edição que `erd_undo` reverteu. |

Consulte [Em direto e headless](./live-and-headless.md) para saber o que acontece ao guardar e ao anular em cada modo.

## Ler um documento {#reading-a-document}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | As definições e as contagens e, a seguir, uma página de tabelas com os seus índices e relações, cada tabela com o seu id, a posição e o tamanho na tela, o número de colunas, o nome lógico, se tiver um, e o grupo de tabelas, se pertencer a algum. Exceto numa pesquisa, os grupos de tabelas, as notas e depois os domínios, os termos e as palavras vêm a seguir às tabelas. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?`, `wordIds?`, `termIds?`, `domainIds?` | As entidades indicadas, completas: tabelas com as suas colunas e o seu grupo de tabelas, relações com as suas colunas e os seus `onDelete` e `onUpdate`, índices com as suas colunas, notas com o seu texto, grupos de tabelas com as suas tabelas, e palavras, termos e domínios com todos os campos. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `logicalNameAsComment?`, `tableIds?`, `tableNames?`, `groupNames?` | O documento inteiro de uma só vez num de quatro formatos, ou o DDL de apenas algumas tabelas ou grupos de tabelas. |
| `erd_list_checks` | `level?`, `tableIds?`, `tableNames?`, `offset?`, `limit?` | O que os dicionários de palavras, termos e domínios encontram de errado, tal como a folha `Checks` do separador Dicionário do editor o lista, uma página de cada vez. Não altera nada — consulte [Verificações do dicionário](#dictionary-checks). |

Um agente encontra os ids com `erd_list`, lê as colunas, as linhas dos dicionários e outros detalhes com `erd_get` e passa esses ids às ferramentas de edição.
O tamanho de uma tabela em `erd_list` é a caixa que ocupa na tela: a altura exata, a largura aproximada.
Um grupo de tabelas é listado pelo retângulo que guarda, com o seu nome, a sua cor e o número de tabelas que contém.
Cada relação é listada uma vez, com uma das suas duas tabelas.
Uma linha de dicionário é listada pelo seu id, pelo seu `name` e pelo que dá a um nome físico ou a uma coluna: o `dataType` de um domínio, o `physicalName` e o `domainId` de um termo e a `abbreviation` de uma palavra. Cada dicionário lista as suas linhas pela ordem que a sua folha mostra.
As definições que `erd_list` e `erd_read` indicam são as que o ficheiro guarda — consulte [Definições](#settings).

Em `erd_get` e no formato `snapshot` de `erd_read`, cada tabela e cada coluna traz o seu `logicalName`, uma cadeia vazia quando não tem nenhum, e `nameDerived`, que é `true` enquanto o nome tiver sido dado pelos dicionários, de modo que um novo nome lógico o volta a derivar — consulte [Dicionários](#dictionaries).
Cada coluna traz o seu `domainId`, tal como cada termo: uma cadeia vazia quando não tem nenhum, ou quando se trata de um domínio que o documento já não lista.

`erd_read` aceita um de quatro formatos:

| `format` | O que devolve |
| --- | --- |
| `snapshot` | JSON compacto com todas as entidades e o respetivo id, incluindo os grupos de tabelas e as linhas de palavras, termos e domínios, e as definições com os scripts do Esquema SQL. Omite o que varia de um utilizador para outro: as larguras medidas, a ordem de sobreposição, a vista, o separador e a vista de nomes. Volumoso num esquema grande. |
| `sql` | DDL para uma das oito bases de dados, `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` ou `SQLite`. `vendor` assume por predefinição a base de dados definida no documento. O DDL do documento inteiro inclui os seus scripts antes e depois das tabelas. Com `tableIds`, `tableNames` ou `groupNames`, apenas essas tabelas, com as chaves externas que contêm, e sem scripts. As chaves externas levam as suas ações ON DELETE e ON UPDATE, exceto as que a base de dados de destino omite — consulte [ON DELETE e ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | O documento inteiro exatamente como fica escrito no ficheiro ao guardar, incluindo as edições que o editor ainda não guardou — consulte [Forma de armazenamento e valor em tempo de execução](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Apenas os scripts antes e depois das tabelas do documento, como `{"before":"…","after":"…"}`, cada um vazio quando não está definido, por maior que seja o esquema. |

Só o formato `sql` aceita `vendor`, `statements`, `header`, `logicalNameAsComment`, `tableIds`, `tableNames` e `groupNames`, e os restantes formatos recusam-nos.

- `statements`: `create`, a predefinição; `ifNotExists`, que escreve `CREATE TABLE IF NOT EXISTS` no MySQL, MariaDB, PostgreSQL, SQLite e Databricks e um simples `CREATE TABLE` nas restantes; ou `recreate`, que elimina as tabelas antes de as criar, caso em que o Snowflake escreve `CREATE OR REPLACE TABLE` em vez disso.
- `header`: `none`, a predefinição; `use`, que seleciona a base de dados ou o esquema indicado pelo nome da base de dados do documento; ou `createAndUse`, que o cria primeiro. O Oracle só tem `use`, por isso aí `createAndUse` escreve `use`, e o PostgreSQL só tem `createAndUse`, por isso aí `use` não escreve cabeçalho. O SQLite não escreve nenhum, e nenhuma base de dados escreve um enquanto o nome da base de dados estiver vazio ou não for um identificador simples.
- `logicalNameAsComment`: `true` escreve o nome lógico de uma tabela ou coluna como o seu comentário enquanto o comentário estiver vazio ou só tiver espaços em branco, onde e na forma como cada base de dados escreve um comentário, e mantém todos os comentários que contêm texto; `false`, a predefinição, não escreve nenhum nome lógico — consulte [Nomes lógicos como comentários](../guide/guides/schema-sql.md#logical-names-as-comments).
- `groupNames`: as tabelas dos grupos de tabelas indicados, pelo nome, sem distinguir maiúsculas de minúsculas, juntas às de `tableIds` e `tableNames`. Um nome que não corresponde a nenhum grupo é recusado com `notFound`. Um grupo sem tabelas não acrescenta nenhuma, e uma leitura que fica sem qualquer tabela, como quando todos os grupos indicados estão vazios e nenhuma tabela é indicada, é recusada com `invalidArgs`.

`statements`, `header` e `logicalNameAsComment` aplicam-se também ao DDL de apenas algumas tabelas. Funcionam como as opções `Statements` e `Header` e o interruptor `Write logical names into empty comments` do separador [Esquema SQL](../guide/guides/schema-sql.md#options-panel) do editor, embora o separador comece em `If not exists` e `CREATE + USE`. O interruptor começa desativado, tal como `logicalNameAsComment`.
Os nomes são delimitados com o tipo de delimitador que o ficheiro guarda, o valor bloqueado enquanto a definição `Bracket Type` estiver bloqueada — consulte [Bloqueio](../guide/guides/settings.md#lock).

### Esquemas grandes {#large-schemas}

Também funcionam esquemas com centenas ou milhares de tabelas.
Uma leitura responde com 40 000 caracteres no máximo, abaixo do limite a partir do qual o Claude Code põe o resultado de uma ferramenta à parte num ficheiro.

- `erd_list` responde, por predefinição, com uma página de 100, primeiro as tabelas, depois os grupos de tabelas, as notas, os domínios, os termos e as palavras, com um único deslocamento que os percorre a todos, e indica onde começa a página seguinte com `nextOffset` e um campo `note`. Passe esse `nextOffset` como `offset`, com a mesma `query`.
- `query` encontra tabelas por palavras no nome, no nome lógico ou no comentário de uma tabela ou coluna, sem distinguir maiúsculas de minúsculas. As tabelas cujos nomes ou nomes lógicos contêm mais dessas palavras aparecem primeiro. Uma pesquisa não lista grupos de tabelas, notas nem linhas de dicionários.
- `namesOnly` lista apenas os nomes das tabelas, cerca de 2000 nomes curtos numa resposta.
- `erd_get` e `erd_read` aceitam `tableNames` além de ids, e `erd_read` aceita `groupNames`, pelo que um agente a quem se pede uma consulta SQL sobre um esquema grande lê o DDL apenas das tabelas de que precisa.
- Os dicionários também vêm por partes: `erd_list` percorre as suas linhas página a página depois das tabelas, e `erd_get` dá as linhas completas por `domainIds`, `termIds` e `wordIds`.
- `erd_get` lista em `missing` os ids e nomes que não designam nada, e em `notReturned` os ids que não cabem numa resposta, para os pedir de novo.
- `erd_list_checks` responde uma página de cada vez da mesma forma — consulte [Verificações do dicionário](#dictionary-checks).
- Uma leitura demasiado grande para uma resposta é recusada com `tooLarge`, com indicações sobre como a restringir.

### Verificações do dicionário {#dictionary-checks}

`erd_list_checks` lista as verificações da [folha Verificações](../guide/guides/dictionary.md#the-checks-sheet) do editor, pela mesma ordem: primeiro as verificações das palavras, depois as dos termos e dos domínios, cada dicionário pela ordem que a sua folha mostra, e depois cada tabela seguida das suas colunas.
Tal como na folha, uma verificação só é executada enquanto o dicionário que lê contém alguma linha. Um documento cujos dicionários não contêm nenhuma palavra, termo ou domínio não é verificado de todo: `total` é `0`, e o `note` indica-o.

- `level`: `error` ou `warning` para apenas esse nível; ambos por predefinição.
- `tableIds` e `tableNames`: apenas as verificações dessas tabelas e das suas colunas, com os nomes sem distinguir maiúsculas de minúsculas, o que deixa de fora as próprias linhas dos dicionários. Um id ou um nome que não designa nenhuma tabela é recusado com `notFound`.
- `offset` e `limit`: uma página de 100 verificações por predefinição, que também para onde uma resposta fica cheia. Enquanto houver mais, `nextOffset` e um `note` indicam onde começa a página seguinte; passe-o como `offset` com os mesmos filtros. Depois de corrigir algumas verificações, liste de novo a partir do deslocamento `0`: uma verificação corrigida sai da lista, pelo que um deslocamento posterior saltaria verificações ainda por corrigir.

A resposta contém `total`, quantas verificações os filtros mantêm; `counts`, quantas dessas tem cada código, omitindo um código sem nenhuma; e a página como `checks`.
Cada verificação indica o seu `level`, o seu `code` e o `kind` e o `id` do seu alvo: `table`, `column`, `word`, `term` ou `domain`. A verificação de uma coluna acrescenta o seu `tableId` e o nome da sua tabela como `table`.
`name` é o nome do alvo, o nome físico de uma tabela ou de uma coluna, com o seu `logicalName` quando tem um. `field` é o que a verificação lê: `name`, `logicalName` ou `domainId`. `text` é o que encontrou aí, e `suggestions`, quando os dicionários oferecem alguma, é o que usar em vez disso. Assim, um agente pode corrigir uma verificação sem um `erd_get`:

```json
{"level":"warning","code":"physicalNameMismatch","kind":"column","id":"8e1z0q4xk2m7cwd5tfb9h3ynp","tableId":"03h17be2plxpj5n59tqag7ogj","table":"users","name":"id","logicalName":"Member Number","field":"name","text":"id","suggestions":["MBR_NO"]}
```

| `code` | `level` | `Type` na folha | O que encontra |
| --- | --- | --- | --- |
| `duplicateName` | `error` | `Duplicate name` | Um nome que duas linhas de um mesmo dicionário partilham. Cada uma das linhas é listada. |
| `unknownDomain` | `error` | `Unknown domain` | Uma coluna ou um termo vinculado a um domínio que o documento já não lista. `text` é o nome desse domínio, ou o seu id quando não se conhece nenhum nome. |
| `forbiddenWord` | `error` | `Forbidden word` | Uma palavra que alguma palavra lista como proibida, no nome lógico de uma tabela ou coluna ou no nome de um termo. `suggestions` são as palavras normalizadas. |
| `unregisteredWord` | `warning` | `Unregistered word` | Texto que nenhuma palavra lista, nos mesmos locais. |
| `synonymWord` | `warning` | `Synonym` | Um sinónimo usado no lugar de uma palavra normalizada, nos mesmos locais. `suggestions` são as palavras normalizadas. |
| `physicalNameMismatch` | `warning` | `Physical name mismatch` | Um nome físico de uma tabela ou coluna diferente do que o termo do seu nome lógico dá. A sugestão é o nome físico do termo, ou o que as suas palavras compõem enquanto o termo não contém nenhum. |
| `domainTypeMismatch` | `warning` | `Domain type mismatch` | Uma coluna cujo tipo de dados não é o do domínio a que está vinculada. `text` é o tipo da coluna, e a sugestão o do domínio. |

A forma como cada verificação lê um nome é explicada em [O que cada verificação encontra](../guide/guides/dictionary.md#what-each-check-finds).

## Ferramentas de edição {#edit-tools}

Os ids vêm de `erd_list` e `erd_get`, ou do campo `createdIds` da chamada que criou a entidade.
Um id novo tem 25 letras minúsculas e algarismos, como `03h17be2plxpj5n59tqag7ogj`, enquanto um id que o documento já contém mantém a sua forma, por isso não tire conclusões do formato de um id.
`x` e `y` são os limites esquerdo e superior na tela, em píxeis, e uma cor é uma cor hexadecimal CSS como `#3b82f6`, ou uma cadeia vazia, que remove a cor.

### Tabelas {#tables}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_table` | | Adiciona uma tabela vazia num espaço livre e devolve o respetivo id em `createdIds`. |
| `erd_remove_table` | `tableId` | Remove uma tabela com as suas colunas, os seus índices e todas as relações que a envolvem. |
| `erd_change_table_name` | `tableId`, `value` | Muda o nome de uma tabela. O nome passa então a estar escrito à mão, pelo que um nome lógico posterior o deixa como está enquanto não estiver vazio — consulte [Dicionários](#dictionaries). |
| `erd_change_table_comment` | `tableId`, `value` | Define o comentário de uma tabela. Uma cadeia vazia apaga-o. |
| `erd_set_table_logical_name` | `tableId`, `value` | Define o nome lógico de uma tabela. Uma cadeia vazia apaga-o e mantém o nome. Enquanto o nome da tabela estiver vazio ou tiver sido derivado, os dicionários derivam-no a partir do nome lógico — consulte [Dicionários](#dictionaries). Um termo não dá nenhum domínio a uma tabela. |
| `erd_change_table_color` | `tableId`, `color` | Define a cor de uma tabela. |
| `erd_move_table` | `tableId`, `x`, `y` | Move uma tabela para uma posição na tela. |
| `erd_move_tables` | `positions` | Move várias tabelas numa só edição, que um único `erd_undo` reverte. `positions` contém `{ tableId, x, y }` por tabela, cada tabela no máximo uma vez. |
| `erd_sort_tables` | | Posiciona todas as tabelas em linhas ao longo da tela, primeiro as que têm menos colunas, tal como as posicionam `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` e `erd_import_aml`. As tabelas de um grupo de tabelas ficam juntas, e a caixa de cada grupo é ajustada à volta delas. |

### Colunas {#columns}

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Adiciona uma coluna vazia a uma tabela e devolve o respetivo id em `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Remove colunas de uma tabela, com as relações e as entradas de índice que as usam. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Muda o nome de uma coluna. O nome passa então a estar escrito à mão, tal como o de uma tabela. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Define o tipo de dados, como `INT` ou `VARCHAR(255)`. Enquanto a definição [Sincronização do tipo de dados nas relações](../guide/guides/settings.md#relationship-datatype-sync) está ativada, a alteração segue as relações nos dois sentidos, tal como no editor: um tipo serial chega às chaves externas como o tipo inteiro que armazena, tal como `erd_add_relationship` o copia, e uma chave serial mantém o seu tipo quando uma das suas chaves externas muda, o que trava a alteração aí. Cabe ao utilizador ativar ou desativar a sincronização, e `erd_list` indica-a como `relationshipDataTypeSync`. Uma coluna vinculada a um domínio é desvinculada dele quando lhe é definido um tipo diferente do do domínio, tal como cada coluna alcançada pela sincronização cujo novo tipo difere do do seu próprio domínio — consulte [Desvincular](../guide/guides/dictionary.md#unlinking). |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Define o valor predefinido, como texto SQL. Uma cadeia vazia apaga-o. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Define o comentário. Uma cadeia vazia apaga-o. |
| `erd_set_column_logical_name` | `tableId`, `columnId`, `value` | Define o nome lógico de uma coluna. Uma cadeia vazia apaga-o e mantém o nome. Enquanto o nome da coluna estiver vazio ou tiver sido derivado, os dicionários derivam-no, e o domínio de um termo vincula a coluna e dá-lhe o tipo de dados do domínio — consulte [Dicionários](#dictionaries). |
| `erd_set_column_domain` | `tableId`, `columnId`, `domainId?`, `domainName?` | Vincula uma coluna a um domínio, indicado pelo id ou pelo nome, um dos dois. A coluna assume o tipo de dados do domínio, que segue as relações enquanto a definição Sincronização do tipo de dados nas relações está ativada, com a mesma desvinculação que `erd_change_column_data_type`. Um `domainId` com o valor `null` ou uma cadeia vazia, ou um `domainName` vazio, desvincula a coluna e mantém o seu tipo. |
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
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Relaciona duas tabelas. Copia a chave primária da tabela pai para a tabela filha como colunas de chave externa, criando primeiro uma coluna de chave primária se a tabela pai não tiver nenhuma. Cada coluna de chave externa recebe o nome que o editor lhe dá quando se desenha uma relação: a chave `id` de `users` dá `users_id`, e uma chave como `member_id` mantém o seu nome — consulte [Nomes das colunas de chave externa](../guide/guides/relationship-editing.md#foreign-key-column-names). Cada uma copia o tipo de dados da sua chave, com a exceção de que uma chave serial dá o tipo inteiro que armazena, como `integer` para `serial4`, e um `serial` simples continua `serial` fora do PostgreSQL, MySQL e MariaDB — consulte [Relações identificadoras](../guide/guides/relationship-editing.md#identifying-relationships). Cada uma também recebe o nome lógico da sua chave e vincula o domínio a que a sua chave está vinculada, a menos que uma chave serial lhe dê outro tipo. `createdIds` contém essa nova coluna de chave, se tiver sido criada, as colunas de chave externa e, por último, o id da relação. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Desenha uma relação entre colunas que já existem, emparelhando as colunas iniciais e finais pela posição. Não muda o nome de nenhuma coluna, não altera nenhum tipo de dados e não copia nenhum nome lógico nem domínio. |
| `erd_remove_relationship` | `relationshipId` | Remove a linha de uma relação. As suas colunas de chave externa ficam na tabela. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Altera a cardinalidade de uma relação. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Define a ação ON DELETE de uma relação: o que a eliminação de uma linha pai faz às respetivas linhas filhas. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Define a ação ON UPDATE de uma relação: o que a alteração de uma chave pai faz às respetivas linhas filhas. |

`erd_add_relationship` dá nome às colunas de chave externa e copia os nomes lógicos das suas chaves quando é executado. Uma mudança de nome ou um nome lógico posterior na chave não chega até elas, por isso, antes disso, dê nome à tabela pai e à sua chave primária e atribua à chave o seu nome lógico.
Os nomes que dá contam como escritos à mão, pelo que um nome lógico posterior os deixa como estão, ao passo que `erd_derive_physical_names` os devolve aos dicionários — consulte [Dicionários](#dictionaries).

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

### Dicionários {#dictionaries}

Estas ferramentas editam os três dicionários do separador [Dicionário](../guide/guides/dictionary.md) do editor, a partir dos quais o nome lógico de uma tabela ou coluna deriva o seu nome físico:

- Uma palavra é uma palavra normalizada de que os nomes lógicos são feitos, com a abreviatura que escreve num nome físico, como `Member` e `MBR`.
- Um termo é um nome lógico completo com o nome físico que dá e, para uma coluna, o domínio que vincula, como `Member Number` com `MBR_NO` e `Identifier`.
- Um domínio é um tipo de dados com nome a que as colunas se vinculam, como `Identifier` para `INT`.

| Ferramenta | Argumentos | O que faz |
| --- | --- | --- |
| `erd_add_word` | `name`, `abbreviation`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Adiciona uma palavra no fim do dicionário de palavras e devolve o respetivo id em `createdIds`. `synonyms` e `forbiddenWords` são separados por vírgulas: outras grafias da palavra e palavras que não podem ser usadas no seu lugar. |
| `erd_update_word` | `wordId`, `name?`, `abbreviation?`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Altera os campos passados e mantém os restantes. |
| `erd_remove_word` | `wordId` | Remove uma palavra. |
| `erd_add_term` | `name`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Adiciona um termo no fim do dicionário de termos e devolve o respetivo id em `createdIds`. Sem `physicalName`, as palavras compõem um, se puderem, como `MBR_NO` para `Member Number`. |
| `erd_update_term` | `termId`, `name?`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Altera os campos passados e mantém os restantes. Um `name` passado enquanto o termo não contém nenhum nome físico, ou com um `physicalName` vazio, também escreve o nome físico que as suas palavras compõem, se compuserem algum. |
| `erd_remove_term` | `termId` | Remove um termo. |
| `erd_add_domain` | `name`, `category?`, `dataType`, `description?` | Adiciona um domínio no fim do dicionário de domínios e devolve o respetivo id em `createdIds`. `category` agrupa domínios, como `Number` ou `Text`. |
| `erd_update_domain` | `domainId`, `name?`, `category?`, `dataType?`, `description?` | Altera os campos passados e mantém os restantes. Um novo `dataType` chega a todas as colunas vinculadas ao domínio e segue as relações enquanto a definição Sincronização do tipo de dados nas relações está ativada, com a mesma desvinculação que `erd_change_column_data_type`. |
| `erd_remove_domain` | `domainId` | Remove um domínio. As colunas vinculadas a ele mantêm o seu tipo de dados, e elas e os termos vinculados a ele não mostram nenhum domínio: o seu `domainId` é lido como uma cadeia vazia. `erd_undo` repõe os vínculos e, ao guardar, estes ficam fora do ficheiro. |
| `erd_derive_physical_names` | `scope`, `tableId?`, `columnId?` | Volta a derivar os nomes físicos a partir dos nomes lógicos, tal como a opção [Voltar a derivar os nomes físicos](../guide/guides/dictionary.md#derive-physical-names-again) do editor, para uma coluna, uma tabela ou o documento inteiro. |

- Um dicionário contém cada nome uma única vez, pelo que um nome que outra linha do mesmo dicionário contém é recusado com `invalidArgs`. Os nomes são comparados sem os espaços nas extremidades, e distinguem-se maiúsculas de minúsculas, pelo que `Member` e `member` são dois nomes.
- Uma atualização indica a linha pelo seu id e passa pelo menos um campo. Os valores que a linha já contém não alteram nada e não criam nenhuma entrada de anulação; uma adição ou uma remoção cria sempre uma.
- O domínio de um termo vem por `domainId`, com `null` ou uma cadeia vazia para nenhum, ou por `domainName`, com uma cadeia vazia para nenhum. Um `domainName` assume o primeiro domínio com esse nome pela ordem do dicionário, comparado como são os nomes. Passar ambos, ou um `domainName` que nenhum domínio contém, é recusado. `erd_set_column_domain` aceita um domínio da mesma forma.
- Alterar ou remover uma palavra ou um termo não muda o nome de nada nem desvincula nada: os nomes e os domínios que deu ficam como estão. `erd_derive_physical_names` volta a derivar os nomes e vincula o domínio que um termo dá agora, mas uma coluna a que nenhum termo corresponde agora, ou cujo termo não dá nenhum domínio, mantém o domínio a que está vinculada. `erd_set_column_domain` com um `domainId` vazio desvincula-a.
- Nenhuma ferramenta importa ou exporta um dicionário como CSV, ordena um dicionário ou insere linhas numa posição, como faz o separador Dicionário.

`erd_list` lista as linhas, `erd_get` dá todos os campos, o formato `snapshot` de `erd_read` contém-nas todas, e `erd_list_checks` lista o que os dicionários encontram de errado — consulte [Ler um documento](#reading-a-document).

`erd_set_table_logical_name` e `erd_set_column_logical_name` derivam um nome físico tal como o editor faz quando se escreve um nome lógico — consulte [Derivar nomes físicos](../guide/guides/dictionary.md#deriving-physical-names):

- Um nome só é derivado enquanto estiver vazio ou tiver sido ele próprio derivado, o que as leituras mostram como `nameDerived: true`. Um nome que não está vazio e foi escrito à mão mantém-se, e só o nome lógico é escrito. `erd_change_table_name`, `erd_change_column_name`, as importações de SQL, GraphQL, DBML e AML e as colunas de chave externa a que `erd_add_relationship` dá nome escrevem todos os nomes à mão. Um nome mudado para uma cadeia vazia volta a ser derivado pelo nome lógico seguinte.
- O termo cujo nome é o nome lógico vem primeiro, comparado como são os nomes dos dicionários. Dá o seu nome físico, ou o que as suas palavras compõem enquanto não contém nenhum. Para uma coluna, também vincula o domínio do termo, mesmo quando nenhum nome é derivado, e a coluna assume o tipo de dados do domínio, seguindo as relações enquanto a definição Sincronização do tipo de dados nas relações está ativada.
- Sem esse termo, as palavras compõem o nome, com as suas abreviaturas unidas por caracteres de sublinhado: `Member Number` dá `MBR_NO`. É tudo ou nada: um sinónimo, uma palavra proibida, texto que nenhuma palavra lista ou uma palavra sem abreviatura não compõe nada, e o nome fica como estava. As palavras não vinculam nenhum domínio, nem um termo sem domínio, pelo que uma coluna mantém o domínio a que está vinculada.
- Uma coluna cujo nome derivado outra coluna da sua tabela já tem, sem distinguir maiúsculas de minúsculas, mantém o seu nome, o seu `nameDerived` e o seu domínio.
- Apagar um nome lógico deixa o nome físico como está. Uma chamada cujo nome lógico, e o que este deriva, já estão em vigor não altera nada e não cria nenhuma entrada de anulação.

`erd_derive_physical_names` recebe um `scope`: `column`, com `tableId` e `columnId`, para essa coluna; `table`, com `tableId`, para o nome da tabela e todas as suas colunas; ou `document`, sem nenhum id, para todas as tabelas e as respetivas colunas. Um âmbito a que falte um id de que precisa, ou a que seja dado um que não aceita, é recusado.
Cada nome abrangido que tem um nome lógico é devolvido aos dicionários, incluindo um nome escrito à mão, e assume o que estes dão agora: o nome físico de um termo e, para uma coluna, o seu domínio e o seu tipo, ou então a composição das palavras, que deixa o domínio da coluna como está. Um nome lógico que não deriva nada deixa o nome como está, com `nameDerived` agora `true`. Um nome sem nome lógico fica como está, tal como uma coluna cujo novo nome outra coluna da sua tabela já tem, como uma segunda chave externa para uma mesma tabela, que também mantém o seu `nameDerived`. Um único `erd_undo` reverte a chamada inteira.
Os nomes de um esquema importado são escritos à mão, por isso, para lhe dar nomes a partir dos dicionários, defina os nomes lógicos e depois chame `erd_derive_physical_names`. Essa chamada dá o nome físico que o próprio termo contém, que uma alteração às palavras do termo não volta a compor. Por isso, depois de alterar as palavras de um termo, atualize primeiro o termo: passe o seu `name` com um `physicalName` vazio para que as palavras o componham de novo, ou passe o novo `physicalName`.

Uma versão do ERD Editor anterior ao separador Dicionário descarta os nomes lógicos, os vínculos aos domínios e as linhas dos dicionários de um ficheiro quando o guarda, como fazem a extensão do VS Code anterior à `4.2.0` e os plugins do Obsidian e da JetBrains anteriores à `1.2.0`. Destes, a extensão `4.0.0` ou `4.1.0` e os plugins `1.0.0` ou `1.1.0` continuam a editar em direto com o servidor, mas não mostram nem mantêm os nomes lógicos, os vínculos aos domínios e as linhas dos dicionários que um agente escreve — consulte [Atualizar](./installation.md#updating).

### Definições {#settings}

Um agente configura as definições do próprio esquema: a base de dados, o seu nome e os scripts do [Esquema SQL](../guide/guides/schema-sql.md).
Cabe ao utilizador definir no editor todas as outras definições que o documento guarda: a [vista de nomes](../guide/guides/logical-names.md#name-view), os interruptores do menu [Opções de vista](../guide/guides/table-related-functions.md#table-view-options), as opções do separador [Definições](../guide/guides/settings.md), a linguagem e os formatos dos nomes do Gerador de código, o tipo de delimitador e os [bloqueios](../guide/guides/settings.md#lock).
Nenhuma ferramenta as altera, exceto as importações no modo `replace`: `erd_import_json` traz as definições e os bloqueios do documento que carrega, e as outras quatro repõem a vista no início da tela — consulte [Importação](#import).
O servidor `1.0.0` removeu as ferramentas que as definiam: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` e `erd_set_show`.

`erd_list` e o formato `snapshot` de `erd_read` indicam as definições tal como o ficheiro as guarda, com `lockSettings` a conter um sinalizador por bloqueio: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase`, `bracketType` e `unlockNameViewMode`.
O último lê-se ao contrário: é `false` enquanto o bloqueio `Name View` está ativado, como acontece num documento novo e num ficheiro guardado antes de esse bloqueio existir, e `true` depois de o utilizador desativar o bloqueio.
Uma linguagem, um formato do nome ou um tipo de delimitador bloqueado é indicado pelo seu valor bloqueado, aquele que o ficheiro mantém e com o qual todos os editores abrem, seja o que for que o ecrã de um editor mostre. A vista, o separador e a vista de nomes não são indicados. Um agente lê e escreve nomes lógicos seja o que for que a vista de nomes mostre.

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

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` e `erd_import_aml` substituem todas as tabelas, relações, índices, notas e grupos de tabelas. Mantêm as definições do documento, incluindo os bloqueios, exceto a vista, que volta ao início da tela a 100%, e mantêm os seus dicionários de palavras, termos e domínios. As tabelas que trazem não têm nomes lógicos e não estão vinculadas a nenhum domínio.
- `erd_import_json` substitui o documento inteiro, incluindo as definições e os dicionários: as definições, os bloqueios, as palavras, os termos e os domínios do JSON tomam o lugar dos deste documento, e um JSON que não regista bloqueios ativa todos os bloqueios e coloca a vista no início da tela. Cada utilizador mantém a sua própria vista de nomes, a menos que o JSON tenha o bloqueio `Name View` desativado, o que traz a sua vista de nomes. Para manter as definições deste documento, parta do texto que o formato `json` de `erd_read` devolve. Um texto vazio dá um documento novo, como o que `erd_open_document` cria com `create`.

`append` acrescenta a importação ao documento, como faz a opção [Importar e adicionar](../guide/guides/file-import-export.md#import-and-add) do editor, e um único `erd_undo` retira toda a adição:

- O conteúdo do texto entra como novas entidades com novos ids, num bloco abaixo de tudo o que o documento contém, incluindo notas ocultas e grupos de tabelas, alinhado com o seu limite esquerdo. Todas as tabelas e definições já existentes mantêm-se, incluindo uma tabela com o mesmo nome: nada é fundido pelo nome.
- As relações e os índices só surgem entre as tabelas que a importação traz, pelo que uma chave externa para uma tabela que o texto não declara é descartada.
- `erd_import_sql`, `erd_import_graphql` e `erd_import_aml` acrescentam tabelas com as suas relações e índices, e `erd_import_dbml` também os seus grupos de tabelas. `erd_import_json` acrescenta tabelas, relações, índices, notas e grupos de tabelas, nunca as suas definições, e recusa um texto vazio. As suas tabelas e colunas trazem os seus nomes lógicos, mas nenhuma coluna fica vinculada a um domínio, e não entra nenhuma das palavras, termos ou domínios do JSON.

Um documento JSON mantém a sua própria disposição, incluindo os grupos de tabelas: onde posiciona as suas tabelas com `replace` e dentro do bloco acrescentado com `append`.
As tabelas de SQL, GraphQL, DBML e AML são dispostas em linhas, primeiro as que têm menos colunas, com as tabelas de cada grupo juntas, tal como `erd_sort_tables` as posiciona, e nunca com a disposição `Flow` com que a própria importação do editor as dispõe quando pode. Essas quatro ferramentas recusam um texto vazio em qualquer dos modos.

## erd_batch {#erd_batch}

`erd_batch` executa várias ferramentas de edição por ordem como uma só edição, todas ou nenhuma.

- `operations` contém até 100 entradas, cada uma `{ tool, as?, args? }`, em que `tool` é uma ferramenta de edição e `args` são os argumentos da ferramenta sem `path`. Uma ferramenta de leitura, como `erd_list_checks`, é recusada.
- As operações são primeiro testadas numa cópia do documento. Uma operação recusada é indicada, como `operations[1] erd_remove_table: …`, e nada é aplicado.
- Um único `erd_undo` reverte o lote inteiro, exceto as operações que não consegue reverter, que o campo `undoNote` do resultado indica: as de uma ferramenta que não cria entrada de anulação, como `erd_set_database`, e as que alteraram o documento sem criar uma, como um `erd_move_table_group` curto. Um lote que não criou nenhuma entrada de anulação é ignorado por `erd_undo`. `historyEntries` no resultado conta as entradas do histórico do editor dentro do lote, e não as chamadas a `erd_undo`.
- Numa sessão em direto, o editor aceita o lote inteiro ou nenhuma parte dele.

Um agente não pode saber os ids que um lote cria antes de fazer a chamada, por isso uma operação com um nome atribuído através de `as` permite que uma posterior se refira a eles: `$name` ou `$name.0` para o seu primeiro id criado, `$name.1` para o segundo e `$name.last` para o último.
Um nome contém letras ASCII, algarismos e caracteres de sublinhado, não começa por um algarismo e designa uma única operação.
Uma referência só é resolvida onde um argumento recebe um id de entidade, incluindo `wordId`, `termId` e `domainId`, por isso um nome ou comentário com o texto `$x` continua a ser texto.
Um `domainName` também é texto, mas é lido quando a sua operação é executada, pelo que pode designar um domínio que uma operação anterior do lote adicionou.

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

Palavras, um domínio e um termo e, a seguir, uma tabela que recebe os nomes a partir deles através dos seus nomes lógicos:

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

O termo compõe `MBR_NO` a partir das suas palavras, e a tabela recebe o nome `MBR`. A coluna `Member Number` assume o `MBR_NO` do termo e o seu domínio, pelo que fica vinculada a `Identifier` e com o tipo `INT`, e a coluna `Member Name`, que nenhum termo contém, recebe o nome composto `MBR_NM`.

## Resultados {#results}

Uma edição responde com uma linha de JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Campo | Significado |
| --- | --- |
| `mode` | `live` ou `headless` — consulte [Em direto e headless](./live-and-headless.md). |
| `saved` | `true` no resultado de cada edição, `erd_batch`, `erd_undo` e `erd_redo` no modo headless: o ficheiro já contém a alteração quando a chamada responde, pelo que não fica nada por guardar. Um resultado em direto não tem `saved`, já que é o editor que detém a alteração — consulte [Guardar](./live-and-headless.md#saving). |
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
| `protocolMismatch` | A extensão ou o plugin ERD Editor do editor e o servidor utilizam versões diferentes do protocolo, como o servidor `1.0.0` ou posterior com uma extensão do VS Code `3.x`. As leituras também são recusadas, e a mensagem indica o lado a atualizar — consulte [Atualizar](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | O hub de um editor não aceitou a ligação, não respondeu no espaço de 30 segundos ou desligou durante a chamada. No Windows, `hubUnreachable` também significa que o Windows impediu o agente de aceder ao hub: o editor é executado com mais direitos do que o agente, como quando foi iniciado como administrador e o agente não, ou o agente é executado numa sandbox. |

Os outros códigos são mais raros, e todas as recusas trazem uma mensagem que diz o que aconteceu.

As ferramentas de edição, `erd_batch` e as quatro ferramentas de leitura recusam um argumento que não declaram, ou um do tipo errado, com um erro JSON-RPC de parâmetros inválidos (`-32602`) antes de tocar no documento, pelo que um argumento mal escrito nunca é descartado em silêncio.
As cinco ferramentas de sessão ignoram os argumentos que não conhecem.
