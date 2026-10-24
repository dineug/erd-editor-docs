---
sidebar_position: 7
description: Excluir um relacionamento, alterar seu tipo, definir suas ações ON DELETE e ON UPDATE, mapeá-lo para colunas existentes com Mapear colunas, ler a notação dos conectores, trabalhar com relacionamentos N:M e identificadores e ver o que as novas colunas de chave estrangeira copiam da sua chave e como são nomeadas.
---

# Edição de relacionamentos

Os relacionamentos são desenhados pelo menu de contexto do canvas, pela barra de ferramentas do canvas, pela [pesquisa rápida](./quick-search.md#what-the-palette-lists) ou com um atalho — consulte [Começar a editar](./editing-start.md).  
Esta página aborda o que é possível fazer com um relacionamento depois que ele existe, como [Mapear colunas](#map-columns) faz um relacionamento terminar em colunas que a tabela filha já tem e como são nomeadas as colunas de chave estrangeira que ele adiciona.

## Exclusão {#deletion}

Um relacionamento pode ser excluído pelo seu menu de contexto.

![Exclusão do relacionamento de products para reviews pelo seu menu de contexto](/img/demo-relationship-remove.webp)

Não há atalho para isso, porque um relacionamento não é selecionado como uma tabela ou uma nota: `Delete` e `Backspace`, que removem o que está selecionado, nunca removem um relacionamento isoladamente — consulte [Exclusão de tabelas e notas](./table-related-functions.md#table-and-memo-deletion).  
Os relacionamentos também são removidos junto com o que conectam: excluir uma tabela remove todos os relacionamentos ligados a ela, e excluir uma coluna remove todos os relacionamentos que a usam.

## Alteração de tipo {#type-change}

A alteração é feita pelo item `Relationship Type` do menu de contexto do relacionamento.  
Quatro tipos são oferecidos, e o atual aparece com uma marca de seleção:

- Zero One
- Zero N
- One Only
- One N

![Alteração de um relacionamento de Zero N para One Only e depois One N no seu menu de contexto](/img/demo-relationship-type.webp)

São os mesmos quatro tipos com que se começa um relacionamento, cada um com seu próprio atalho — consulte [Começar a editar](./editing-start.md).

## ON DELETE e ON UPDATE {#on-delete-and-on-update}

As ações são definidas pelos itens `On Delete` e `On Update` do menu de contexto do relacionamento, entre `Relationship Type` e `Map Columns`.  
Cada um oferece os mesmos seis itens, e o atual aparece com uma marca de seleção:

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

`Not set` não escreve nenhuma cláusula, então se aplica o padrão do próprio banco de dados. Um relacionamento novo, desenhado ou criado em [Mapear colunas](#map-columns), começa com as duas em `Not set`, e escolher `Not set` mais tarde remove uma ação.  
As duas são independentes: alterar uma deixa a outra como está.  
O conector mostra o que está definido — consulte [Como ler um conector](#reading-a-connector).  
Um relacionamento copiado e colado, ou duplicado, junto com suas tabelas mantém as duas ações, e importar Esquema SQL, DBML ou AML traz as ações que o arquivo declara — consulte [Importar ou exportar arquivos](./file-import-export.md).

![Definição de ON DELETE CASCADE e ON UPDATE RESTRICT no relacionamento de orders para order_items pelo seu menu de contexto, com o rótulo exibindo D:C U:R, e depois o ponteiro sobre o conector para conferir as duas ações](/img/demo-referential-actions.webp)

Qualquer ação pode ser escolhida, seja qual for o banco de dados.  
Uma ação que o [banco de dados](./table-related-functions.md#databases) selecionado deixa de fora do seu Esquema SQL traz ao lado uma observação esmaecida, como `not in MySQL`. `Not set` nunca traz observação, e trocar o banco de dados atualiza as observações.  
Uma ação com observação continua armazenada no relacionamento: o conector a mostra, e JSON, DBML e AML a mantêm, mas o Esquema SQL desse banco de dados deixa a cláusula de fora, então se aplica o padrão do banco de dados.

O [Esquema SQL](./schema-sql.md) escreve estas ações e deixa de fora as demais:

| Banco de dados | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | nenhuma |
| PostgreSQL | todas as cinco | todas as cinco |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | todas as cinco | todas as cinco |

O Esquema SQL do Snowflake também escreve um comentário que nomeia cada ação deixada de fora — consulte [Ações referenciais](./schema-sql.md#referential-actions).

Quais ações os destinos ORM do Gerador de código escrevem depende do destino e também do banco de dados selecionado — consulte [Gerador de código](./code-generator.md#on-delete-and-on-update).

## Mapear colunas {#map-columns}

A caixa de diálogo Mapear colunas associa a chave da tabela pai a colunas da tabela filha, uma linha por coluna da chave.  
Cada linha usa uma coluna que a tabela filha já tem ou adiciona uma nova coluna de chave estrangeira, de modo que um relacionamento pode terminar em colunas que já existem.

![Desenho de um relacionamento Zero N de members para orders, escolha de Map to existing columns e mapeamento de id para a coluna member_id existente](/img/demo-map-columns.webp)

Ela se abre de duas formas:

- Ao desenhar um relacionamento, pelo botão `Map to existing columns` ao lado da tabela filha — consulte [Criação de relacionamentos](./editing-start.md#relationship-creation). `Map` então adiciona um relacionamento do tipo que está sendo desenhado.
- Pelo item `Map Columns` do menu de contexto do relacionamento, para alterar as colunas de um relacionamento existente. `Save` então grava a alteração. Um editor somente leitura omite esse item.

O subtítulo da caixa de diálogo indica as duas tabelas e o tipo de relacionamento, como `users → posts · One N`. O tipo é mostrado aqui, mas não é alterado — use [Alteração de tipo](#type-change).

Em toda a caixa de diálogo, incluindo as observações e os textos sob as linhas e a notificação com que ela se fecha, tabelas e colunas são nomeadas como a [exibição de nomes](./logical-names.md#beyond-the-canvas) as nomeia.  
Três coisas continuam físicas: cada tipo de dados, que é o da própria coluna e nunca o nome do domínio dela; `New column: <name>`, que mostra o nome que a nova coluna vai receber; e as linhas que começam preenchidas com `Map`, que ele associa pelo nome, nunca pelo nome lógico.

O campo `References` define a chave para a qual o relacionamento aponta: `Primary Key`, com suas colunas na ordem da tabela, e depois `Unique: <column>` para cada coluna marcada como `Unique`. Ele só aparece quando há mais de uma opção.  
Um índice único não conta como chave aqui, e uma coluna `Unique` que é a chave primária inteira não é listada duas vezes.  
Escolher outra chave reconstrói as linhas. Uma linha mantém sua escolha enquanto essa coluna continua na tabela filha.

Sob os cabeçalhos `Referenced column` e `Foreign key column`, cada linha mostra uma coluna da chave com seu tipo de dados e uma lista das colunas da tabela filha às quais ela pode ser associada:

- `Pick a column` deixa a linha vazia.
- `New column: <name>` adiciona uma nova coluna de chave estrangeira. O nome mostrado é o que ela vai receber, conforme descrito em [Nomes das colunas de chave estrangeira](#foreign-key-column-names), numerado levando em conta as colunas da tabela filha e as outras linhas que adicionam uma nova coluna. Essa opção não é oferecida quando o nome ficaria em branco, como no caso de uma chave sem nome.
- Todas as colunas da tabela filha, no formato `<name> (<data type>)`. Uma coluna que outra linha escolheu aparece como `<name> (<data type>) · in use` e não pode ser escolhida, para que duas linhas nunca compartilhem a mesma. Uma coluna que outro relacionamento já usa ainda pode ser escolhida, de modo que uma coluna como um `tenant_id` compartilhado pode servir a vários relacionamentos.

Com `Map`, uma linha começa preenchida somente quando exatamente uma coluna da tabela filha, sem diferenciar maiúsculas de minúsculas, tem o nome que uma nova coluna de chave estrangeira criada para ela receberia antes de qualquer numeração `_2`, como `users_id` para `id` em `users` e `member_id` para `member_id`. Enquanto a opção [`Bracket`](./schema-sql.md#database-and-bracket) estiver em `None`, o padrão, o nome formado a partir da parte de tabela de um nome de tabela qualificado com esquema também conta, então `id` em `public.users` é associado a `public.users_id` ou `users_id`. Para uma chave `Unique`, o próprio nome da coluna da chave também conta, então `vin` é associado a `vin`. Todas as outras linhas começam em `Pick a column`.  
Com `Save`, cada linha começa na coluna que o relacionamento usa agora. Com qualquer um dos dois, escolher outra chave em `References` preenche as linhas vazias dessa chave pela mesma correspondência de nomes.

Quando o tipo de dados de uma coluna escolhida difere do que a coluna pai atribui a uma chave estrangeira, uma observação abaixo da linha indica isso.  
Com a [sincronização do tipo de dados nos relacionamentos](./settings.md#relationship-datatype-sync) ativada e um tipo de dados na coluna pai, ela diz `<column> becomes <type>`, o tipo que o mapeamento vai gravar. Caso contrário, diz `Types differ: <parent type> and <child type>`, e a coluna mantém seu tipo.

`Map` ou `Save` fica desabilitado enquanto houver um impedimento, e uma mensagem abaixo das linhas indica qual:

- `Pick a foreign key column for every referenced column`: uma linha ainda está vazia.
- `At least one column must reference a different column`: um relacionamento autorreferenciado em que todas as linhas escolhem a própria coluna pai.
- `These columns are already linked by another relationship`: outro relacionamento entre as mesmas duas tabelas liga exatamente essas colunas.
- `<parent> has no key to reference`: com `Map`, a tabela pai não tem nem chave primária nem coluna `Unique`.

`Save` também fica desabilitado até que o mapeamento seja diferente do atual do relacionamento.  
Com `Save`, uma linha mostra `(removed)` quando sua coluna saiu da tabela. Escolha outra coluna da tabela filha ou, no caso de uma coluna pai que não existe mais, escolha uma chave em `References`. Com `Map`, uma linha cuja coluna escolhida é removida volta para `Pick a column`.

Um relacionamento cujas colunas pai não são exatamente uma das chaves da tabela pai abre com uma opção extra selecionada no fim de `References`, `Current columns (not a key)`, que mantém essas colunas como estão. Quando a tabela pai não tem nenhuma chave, essa é a única opção e `References` não é mostrado.  
Nesse caso, a mensagem `The referenced columns are not a key of <parent>`, ou `<parent> has no key to reference` quando a tabela pai não tem nenhuma chave, é um aviso, não um erro: `Save` continua funcionando, então é possível alterar as colunas da tabela filha e manter a referência.  
Um relacionamento cujas duas listas de colunas não podem ser associadas, por exemplo porque têm comprimentos diferentes, mostra linhas `(invalid)` e mantém `Save` desabilitado até que você escolha uma chave em `References` ou adicione uma chave primária ou coluna `Unique` à tabela pai, caso ela não tenha nenhuma.

A caixa de diálogo acompanha o diagrama enquanto está aberta, inclusive as edições de um colaborador ou de um agente de codificação, e mantém o que você escolheu.  
Se as colunas do relacionamento ou a chave com que ela abriu mudarem nesse meio-tempo, ela adiciona a mensagem `This relationship changed while the dialog was open`.

O que `Map` e `Save` gravam:

- `Map` adiciona o relacionamento com `On Delete` e `On Update` em `Not set`. `Save` altera apenas as colunas do relacionamento, apontando seu lado pai para a chave escolhida em `References`, e mantém seu tipo e suas ações ON DELETE e ON UPDATE.
- Uma linha `New column` adiciona uma coluna no fim da tabela filha, como ao desenhar: `NOT NULL`, nomeada a partir da sua chave, com o tipo de dados, o valor padrão, o comentário, o nome lógico e o domínio da chave — consulte [Relacionamentos identificadores](#identifying-relationships).
- Uma coluna escolhida nunca é renomeada nem vinculada ao domínio da chave, e o `Not Null`, a chave primária, o `Unique`, o valor padrão, o comentário e o nome lógico dela ficam como estão. Seu tipo de dados só muda enquanto a configuração `Relationship DataType Sync` está ativada e a coluna pai tem um tipo de dados: ela recebe o tipo que a coluna pai atribui a uma chave estrangeira, o tipo inteiro no caso de uma chave serial, como para uma nova coluna, e a alteração se propaga pelos relacionamentos da mesma forma que a sincronização faz. Toda coluna cujo tipo a alteração muda, escolhida ou alcançada pelos relacionamentos, é desvinculada do seu [domínio](./dictionary.md#domains-and-data-types) quando o novo tipo dela difere do tipo do domínio.
- Uma coluna que o mapeamento deixa de usar permanece na tabela filha e deixa de ser marcada como chave estrangeira, a menos que outro relacionamento ainda termine nela.
- Tudo o que um `Map` ou `Save` grava — incluindo novas colunas, alterações de tipo e desvinculações de domínio — é uma única etapa de desfazer.

Se o relacionamento é identificador e como sua extremidade do lado pai é desenhada são determinados pelas colunas mapeadas da tabela filha, como em qualquer relacionamento. Mapear para as colunas de chave primária da tabela filha o torna identificador imediatamente, e mapear para uma coluna que permite `NULL` coloca um círculo na extremidade do lado pai — consulte [Como ler um conector](#reading-a-connector).  
A chave estrangeira do Esquema SQL referencia a chave que você escolheu, como `REFERENCES vehicle (vin)` para uma chave `Unique`.

Se o diagrama já contiver o mapeamento quando você pressionar `Map` ou `Save`, porque um colaborador ou um agente de codificação chegou antes, nada é gravado.  
Se ele tiver mudado de modo que o mapeamento não se encaixe mais, nada é gravado e uma notificação diz `Couldn't map columns: the diagram changed`.

`Cancel`, o botão `x`, `Escape` ou um clique na área esmaecida fora da caixa de diálogo a fecham sem gravar nada.  
A área esmaecida cobre o editor inteiro, incluindo a barra de ferramentas, e um [explorador](./explorer.md#dialogs-beside-it) aberto continua aberto sob ela.  
Abrir a pesquisa rápida também fecha a caixa de diálogo, assim como sair da aba ERD ou o editor passar a ser somente leitura.  
`Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) também a fecha e coloca o cursor de texto no campo Localizar da [pesquisa](./find-and-replace.md#opening-and-closing) do explorador, abrindo o explorador se ele estiver fechado. Em um editor estreito demais para mostrar o explorador, o atalho ainda fecha a caixa de diálogo, mas mostra uma notificação em vez de mover o cursor de texto — consulte [Abrir e fechar](./explorer.md#opening-and-closing).  
Se uma das tabelas dela ou o relacionamento for removido enquanto ela estiver aberta, ela se fecha com uma notificação como `Map Columns closed: the relationship was removed`.  
Enquanto ela está aberta, os atalhos do canvas, desfazer e refazer, e copiar e colar não fazem nada.

Um agente de codificação não tem uma ferramenta para Mapear colunas. Ele remapeia um relacionamento removendo-o com `erd_remove_relationship`, que mantém suas colunas de chave estrangeira, e desenhando-o de novo sobre colunas existentes com `erd_link_columns`, ambos em um único `erd_batch` — consulte [Ferramentas](../../mcp/tools.md#relationships).

## Relacionamentos N:M {#nm-relationships}

Como o editor se baseia no modelo físico, um relacionamento N:M é expresso com uma tabela associativa, como mostrado abaixo.

![Desenho de relacionamentos de products e depois de tags para a tabela vazia product_tags com ⌘ + ⌥ + 2, adicionando product_id e depois tag_id](/img/demo-relationship-n-m.webp)

Quando a tabela associativa já tem suas colunas de chave, como `product_id` e `tag_id` em `product_tags`, desenhe cada relacionamento com `Map to existing columns` e escolha essas colunas em vez de adicionar novas — consulte [Mapear colunas](#map-columns). Se elas forem a chave primária da tabela associativa, cada relacionamento é identificador de imediato.

Importar GraphQL, DBML ou AML monta a tabela associativa para você.  
Uma declaração muitos-para-muitos chega como uma tabela chamada `<left>_<right>`, com o comentário `Junction table inferred from <left> <-> <right>`, ligada aos dois lados por relacionamentos identificadores.  
Consulte [Importar ou exportar arquivos](./file-import-export.md).

## Relacionamentos identificadores {#identifying-relationships}

Desenhar um relacionamento clicando na tabela filha, ou com `Create new columns`, copia cada chave primária da tabela pai para a tabela filha como uma coluna de chave estrangeira `NOT NULL`, de modo que um relacionamento novo começa como não identificador.  
A cópia recebe o tipo de dados, o valor padrão, o comentário e o nome lógico da chave, mas não `Unique` nem `Auto Increment`, e é nomeada conforme descrito em [Nomes das colunas de chave estrangeira](#foreign-key-column-names).  
Uma chave serial é a exceção quanto ao tipo de dados: sua cópia recebe o tipo inteiro que o serial armazena. Em qualquer banco de dados, `smallserial` e `serial2` resultam em `smallint`, `serial4` resulta em `integer` e `bigserial` e `serial8` resultam em `bigint`. Um `serial` simples resulta em `integer` no PostgreSQL e em `bigint unsigned` no MySQL e no MariaDB, e permanece `serial` em qualquer outro banco de dados.  
Só conta o nome completo do tipo, sem diferenciar maiúsculas de minúsculas, então `serial(4)` é copiado como está escrito. Um tipo escrito em maiúsculas resulta em maiúsculas: `SERIAL` resulta em `INTEGER` no PostgreSQL. Uma coluna de chave estrangeira que já tem o tipo `serial` em um diagrama salvo mantém esse tipo.  
A cópia também é vinculada ao [domínio](./dictionary.md#domains-and-data-types) da chave, desde que a planilha `Domains` liste esse domínio no momento em que a cópia é feita e a cópia mantenha o tipo de dados da chave. Assim, a cópia de uma chave serial que recebe um tipo inteiro não vincula nenhum domínio, enquanto um `serial` simples mantido como `serial` o vincula.  
Para tornar o relacionamento identificador, defina essas colunas de chave estrangeira da tabela filha como chaves primárias: selecione todas e pressione `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac) uma vez, ou escolha `Primary Key` no menu de contexto da tabela, item que passa a ser `Primary Key on selected columns` enquanto duas ou mais estiverem selecionadas — consulte [Chave primária da coluna](./table-editing.md#column-primary-key).

![Alternância de product_id como chave primária com Alt + K, deixando seu conector contínuo e depois tracejado](/img/demo-identifying-relationship.webp)

O editor mantém isso sincronizado por conta própria.  
Um relacionamento é identificador enquanto todas as colunas do seu lado filho são chaves primárias, e se torna não identificador assim que uma delas deixa de ser.

## Nomes das colunas de chave estrangeira {#foreign-key-column-names}

Desenhar um relacionamento nomeia cada coluna de chave estrangeira que ele adiciona a partir da chave pai que essa coluna copia:

- Um nome de chave de uma só palavra, como `id`, `ID` ou `uuid`, recebe na frente o nome da tabela pai e um sublinhado: `id` em `products` passa a ser `products_id`.
- Um nome de chave de várias palavras, como `member_id`, `userId` ou `UserID`, é mantido como está.
- Um nome de chave de uma só palavra que é o próprio nome da tabela, sem diferenciar maiúsculas de minúsculas, também é mantido: `currency` em `currency` continua `currency`. Uma chave que apenas contém o nome da tabela ainda recebe o prefixo: `username` em `user` passa a ser `user_username`.

Um nome é uma só palavra quando contém apenas letras e dígitos, sem troca entre maiúsculas e minúsculas.  
Qualquer outro caractere o divide, então `_id`, `order no` e `order-no` são várias palavras.  
Uma troca entre maiúsculas e minúsculas também o divide, lida como no camelCase: uma letra minúscula seguida de uma maiúscula (`userId`), duas maiúsculas seguidas de uma minúscula (`IDCard`, `IDs`) ou uma letra de uma escrita sem distinção entre maiúsculas e minúsculas, como hangul, kana ou han, ao lado de uma letra com essa distinção (`회원ID`).  
Dígitos não dividem uma palavra, então `id2` e `SHA256` são uma só palavra. Um termo composto escrito sem troca entre maiúsculas e minúsculas também é uma só palavra: `memberid` em `members` passa a ser `members_memberid`.

O nome da tabela é usado como está escrito, exceto pelos espaços nas extremidades: suas maiúsculas e minúsculas, seus espaços internos e seus pontos são mantidos, ele não é passado para o singular e as opções `Table Name Case` e `Column Name Case` do Gerador de código não têm nenhum papel. `Users` com a chave `ID` resulta em `Users_ID`.  
Cada coluna de uma chave composta é nomeada separadamente: `orders` com a chave (`tenant_id`, `id`) adiciona `tenant_id` e `orders_id`.

Um nome que a tabela filha já tem, sem diferenciar maiúsculas de minúsculas, é numerado com `_2`, `_3` e assim por diante, usando o primeiro número livre.  
Um segundo relacionamento de `users`, com a chave `id`, para a mesma tabela adiciona `users_id_2`, e uma autorreferência em `members`, com a chave `member_id`, adiciona `member_id_2`.  
As colunas de uma mesma chave composta são numeradas umas em relação às outras da mesma forma, e um nome mantido como está garante seu lugar primeiro: `user` com a chave (`id`, `user_id`) adiciona `user_id` para `user_id` e `user_id_2` para `id`.

Uma tabela pai sem nome deixa o nome da chave como está, numerado como qualquer outro em caso de conflito.  
Uma chave sem nome resulta em uma coluna de chave estrangeira sem nome.  
Isso inclui a chave primária que o editor adiciona a uma tabela pai que não tem nenhuma, a menos que você a nomeie antes de clicar na tabela filha.

Os nomes são definidos quando o relacionamento é desenhado. Renomear depois a tabela pai ou sua chave não os renomeia.  
As linhas `New column` de [Mapear colunas](#map-columns) são nomeadas pelas mesmas regras, e a lista mostra cada nome antes que você o escolha.  
Relacionamentos que chegam com suas colunas já no lugar — de uma importação, uma colagem, uma duplicação ou de Mapear colunas associando colunas existentes — mantêm os nomes que essas colunas têm.  
Um agente de codificação que adiciona um relacionamento com `erd_add_relationship` obtém os mesmos nomes, tipos de dados, nomes lógicos e domínios — consulte [Ferramentas](../../mcp/tools.md#relationships).

Uma coluna de chave estrangeira é nomeada a partir da sua chave, nunca a partir do nome lógico que copia, e o nome dela conta como escrito por você: um nome lógico escrito depois na coluna deixa o nome como está, a menos que o nome esteja vazio — consulte [Nomes escritos por você](./dictionary.md#names-of-your-own).  
Por isso, enquanto o nome lógico copiado corresponde a um termo que fornece outro nome, a planilha `Checks` lista a coluna em [`Physical name mismatch`](./dictionary.md#what-each-check-finds). Derivar o nome físico dela novamente a renomeia a partir dos dicionários, a menos que outra coluna da tabela filha já tenha o nome que eles fornecem, sem diferenciar maiúsculas de minúsculas — consulte [Derivar nomes físicos novamente](./dictionary.md#derive-physical-names-again).

## Como ler um conector {#reading-a-connector}

- Um relacionamento identificador é desenhado como uma linha contínua, e um não identificador como uma linha tracejada.
- A extremidade do lado filho traz o símbolo de cardinalidade do tipo de relacionamento: um círculo e uma barra para Zero One, um círculo e um pé de galinha para Zero N, duas barras para One Only e uma barra e um pé de galinha para One N.
- A extremidade do lado pai é um círculo e uma barra, como em Zero One, quando alguma das colunas de chave estrangeira permite `NULL`, e duas barras, como em One Only, quando todas são `NOT NULL`.
- Passar o ponteiro sobre um conector o realça junto com as colunas que ele liga nas duas tabelas.

![Passagem do ponteiro sobre três conectores, um de cada vez, cada um se iluminando com as colunas que liga](/img/demo-relationship-hover.webp)

Um relacionamento que define [ON DELETE ou ON UPDATE](#on-delete-and-on-update) traz um rótulo ao lado da sua extremidade do lado filho, como `D:C U:R`: `D:` e a ação ON DELETE, depois `U:` e a ação ON UPDATE, cada uma só quando está definida.  
As ações são abreviadas segundo a notação do erwin: `C` para CASCADE, `R` para RESTRICT, `SN` para SET NULL, `SD` para SET DEFAULT e `NA` para NO ACTION. Um relacionamento que não define nenhuma das duas não tem rótulo.  
O rótulo fica do lado oposto à tabela filha, acima da linha quando o conector sai pelo lado esquerdo ou direito dessa tabela e à direita da linha quando sai pelo topo ou pela base, sem sobrepor o símbolo de cardinalidade.  
Ele é desenhado na cor do conector sobre uma pequena caixa com a cor de fundo do canvas, e se ilumina junto com seu conector. Os rótulos são desenhados por cima de todos os conectores, então uma linha que cruza um rótulo passa por baixo dele.  
Ele mostra a ação armazenada no relacionamento, seja o que for que o banco de dados selecionado escreva, então ON DELETE SET DEFAULT continua aparecendo como `D:SD` no MySQL.

Passar o ponteiro sobre um conector que define qualquer uma das ações também mostra uma dica de ferramenta com as cláusulas por extenso, uma por linha, como `ON DELETE CASCADE` e `ON UPDATE RESTRICT`.  
A dica de ferramenta aparece mesmo enquanto o rótulo está oculto.

Ir para um relacionamento o ilumina: escolher uma linha sob a pasta `Foreign Keys` de uma tabela no [explorador](./explorer.md#going-to-a-row), ou uma linha de chave estrangeira no [visualizador de diferenças](./table-related-functions.md#going-to-a-change), desenha seu conector e seu rótulo na mesma cor usada ao passar o ponteiro. No visualizador de diferenças, ele ilumina o conector em cada lado que contém o relacionamento, então uma chave estrangeira adicionada ilumina só o lado atual, e uma removida, só o lado salvo.  
O salto seleciona apenas a tabela filha com suas colunas de chave estrangeira, com a célula em foco na primeira delas; o próprio relacionamento, ainda assim, nunca é selecionado. Para saber para onde vai a área visível, consulte [Onde um salto termina](./table-related-functions.md#where-a-jump-lands).  
A iluminação se apaga no próximo pressionamento do botão esquerdo ou direito no canvas, seja em um ponto vazio, uma tabela, uma nota, um grupo de tabelas ou um conector, mesmo um pressionamento que deixe a seleção como estava. Ir para outra linha ou correspondência de pesquisa no explorador também a apaga, assim como ir para outra linha no visualizador de diferenças, em cada lado para o qual essa linha leva.  
Deslocar a área visível com o botão do meio ou com a ferramenta mão a mantém acesa, assim como recolher ou expandir uma linha no explorador ou no visualizador de diferenças, limpar a seleção com `Escape` e um salto a partir da [pesquisa rápida](./quick-search.md) ou do [botão do cartão](./visualization.md#card-buttons) de link externo do Flow.  
A iluminação não é salva e não entra no histórico de desfazer, e os colaboradores não a veem.

Oculte os conectores no canvas ERD com a opção de exibição `Relationship`, ou só os rótulos com a opção de exibição `Referential Actions`, que está ativada por padrão — consulte [Opções de exibição da tabela](./table-related-functions.md#table-view-options).  
Os rótulos não são desenhados em `70%` ou menos, quando as tabelas se reduzem ao nome.  
Uma [exportação de imagem](./file-import-export.md#image) é sempre desenhada em 100%, então desenha os rótulos qualquer que seja o zoom do canvas, a menos que uma opção de exibição os oculte. Com `Background` desativado, a caixa atrás de cada rótulo também fica transparente.  
O [modo Flow](./visualization.md#flow-mode) da aba Visualização desenha os conectores mesmo com `Relationship` desativado, cada um como uma única curva suave, contínua e cinza, com as mesmas marcas nas extremidades, então a linha tracejada, os rótulos, a dica de ferramenta, a iluminação após um salto e o traçado ortogonal descritos nesta página se aplicam apenas ao canvas ERD. Um relacionamento de uma tabela com ela mesma também contorna o canto superior direito no Flow — consulte [Traçado dos conectores](#connector-routing).

## Traçado dos conectores {#connector-routing}

Os conectores são traçados ortogonalmente.  
Um traçado contorna as tabelas que ficam entre suas duas extremidades em vez de cruzá-las, e seus cantos são arredondados.  
Cada extremidade sai da sua tabela em um trecho reto curto antes de virar, então duas tabelas próximas cujas extremidades do conector se alinham são unidas por uma única linha reta em vez de um desvio.  
Os traçados que saem do mesmo lado de uma tabela são distribuídos em corredores separados para que não corram uns sobre os outros.  
Só as tabelas são evitadas: um conector pode cruzar uma nota ou a caixa de um grupo de tabelas, e é desenhado acima dos grupos de tabelas e abaixo das tabelas e das notas.

Um relacionamento de uma tabela com ela mesma é desenhado como uma única curva em torno do canto superior direito da tabela, saindo pelo lado de cima na extremidade do lado pai e entrando pelo lado direito na extremidade do lado filho.  
Outras autorreferências na mesma tabela se aninham por fora da primeira, de modo que suas curvas não se cruzam nem cruzam a tabela.

Não há nada a configurar.  
Os traçados são recalculados automaticamente sempre que algo no canvas é movido ou redimensionado, então nunca precisam ser ajustados manualmente.

![Arrasto da tabela members para baixo e de volta enquanto o conector de orders alterna entre passar à direita de categories e contorná-la pela esquerda, com todos os cantos arredondados](/img/demo-connector-routing.webp)
