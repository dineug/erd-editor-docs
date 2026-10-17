---
sidebar_position: 6
description: Eliminar uma relação, mudar o seu tipo, definir as ações ON DELETE e ON UPDATE, mapeá-la para colunas existentes com Mapear colunas, ler a notação dos conectores, trabalhar com relações N:M e identificadoras e ver como são nomeadas as novas colunas de chave externa.
---

# Edição de relações

As relações são desenhadas a partir do menu de contexto da tela, da barra de ferramentas da tela, da [pesquisa rápida](./quick-search.md#what-the-palette-lists) ou com um atalho — consulte [Começar a editar](./editing-start.md).  
Esta página explica o que é possível fazer com uma relação depois de criada, como [Mapear colunas](#map-columns) faz uma relação terminar em colunas que a tabela filha já tem e como são nomeadas as colunas de chave externa que uma relação adiciona.

## Eliminação {#deletion}

É possível eliminar uma relação através do respetivo menu de contexto.

![Eliminar a relação entre products e reviews a partir do respetivo menu de contexto](/img/demo-relationship-remove.webp)

Não existe atalho para isso, porque uma relação não é selecionada da mesma forma que uma tabela ou uma nota: as teclas `Delete` e `Backspace`, que removem o que está selecionado, nunca removem uma relação por si só — consulte [Eliminação de tabelas e notas](./table-related-functions.md#table-and-memo-deletion).  
As relações também são removidas juntamente com aquilo que ligam: eliminar uma tabela remove todas as relações que lhe estão ligadas, e eliminar uma coluna remove todas as relações que a utilizam.

## Mudança de tipo {#type-change}

A mudança está disponível através do submenu `Relationship Type` do menu de contexto da relação.  
São apresentados quatro tipos, e o atual está assinalado com um visto:

- Zero One
- Zero N
- One Only
- One N

![Mudar uma relação de Zero N para One Only e depois para One N no respetivo menu de contexto](/img/demo-relationship-type.webp)

São os mesmos quatro tipos com que se começa uma relação, cada um com o seu próprio atalho — consulte [Começar a editar](./editing-start.md).

## ON DELETE e ON UPDATE {#on-delete-and-on-update}

Definem-se através dos submenus `On Delete` e `On Update` do menu de contexto da relação, entre `Relationship Type` e `Map Columns`.  
Cada um apresenta as mesmas seis opções, e a atual está assinalada com um visto:

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

A opção `Not set` não escreve nenhuma cláusula, pelo que se aplica a predefinição da própria base de dados. Uma relação nova, desenhada ou criada em [Mapear colunas](#map-columns), começa com as duas ações em `Not set`, e escolher `Not set` mais tarde remove uma ação.  
As duas são independentes: mudar uma deixa a outra como está.  
O conector mostra o que está definido — consulte [Como ler um conector](#reading-a-connector).  
Uma relação copiada e colada, ou duplicada, juntamente com as suas tabelas mantém ambas as ações, e importar Esquema SQL, DBML ou AML traz as ações que o ficheiro declara — consulte [Importar ou exportar ficheiros](./file-import-export.md).

![Definir ON DELETE CASCADE e ON UPDATE RESTRICT na relação entre orders e order_items a partir do respetivo menu de contexto, com a etiqueta a indicar D:C U:R, e depois passar o ponteiro por cima para ler ambas as ações](/img/demo-referential-actions.webp)

Qualquer ação pode ser escolhida, seja qual for a base de dados.  
Uma ação que a [base de dados](./table-related-functions.md#databases) selecionada deixa de fora do seu Esquema SQL tem ao lado uma indicação esbatida, como `not in MySQL`. A opção `Not set` nunca tem nenhuma, e mudar de base de dados atualiza as indicações.  
Uma ação com indicação continua guardada na relação: o conector mostra-a e o JSON, o DBML e o AML mantêm-na, mas o Esquema SQL dessa base de dados deixa a cláusula de fora, pelo que se aplica a predefinição da base de dados.

O [Esquema SQL](./schema-sql.md) escreve estas ações e deixa de fora as restantes:

| Base de dados | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | nenhuma |
| PostgreSQL | todas as cinco | todas as cinco |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | todas as cinco | todas as cinco |

O Esquema SQL do Snowflake também escreve um comentário com o nome de cada ação que deixa de fora — consulte [Ações referenciais](./schema-sql.md#referential-actions).

As ações que os destinos ORM do Gerador de código escrevem dependem do destino, bem como da base de dados selecionada — consulte [Gerador de código](./code-generator.md#on-delete-and-on-update).

## Mapear colunas {#map-columns}

A caixa de diálogo Mapear colunas emparelha a chave da tabela pai com colunas da tabela filha, com uma linha por cada coluna da chave.  
Cada linha utiliza uma coluna que a tabela filha já tem ou adiciona uma nova coluna de chave externa, pelo que uma relação pode terminar em colunas que já existem.

![Desenhar uma relação Zero N de members para orders, escolher Map to existing columns e mapear id para a coluna existente member_id](/img/demo-map-columns.webp)

Abre-se de duas formas:

- Enquanto está a desenhar uma relação, a partir da opção `Map to existing columns` ao lado da tabela filha — consulte [Criação de relações](./editing-start.md#relationship-creation). O botão `Map` adiciona então uma relação do tipo que está a ser desenhado.
- A partir da opção `Map Columns` do menu de contexto da relação, para mudar as colunas de uma relação existente. O botão `Save` escreve então a alteração. Um editor só de leitura omite esta opção.

O subtítulo da caixa de diálogo indica as duas tabelas e o tipo de relação, como `users → posts · One N`. O tipo é mostrado aqui, mas não é alterado — utilize [Mudança de tipo](#type-change).

A lista `References` escolhe a chave para a qual a relação aponta: `Primary Key`, com as suas colunas pela ordem da tabela, e depois `Unique: <column>` para cada coluna marcada como `Unique`. Só é mostrada quando há mais do que uma escolha.  
Um índice único não conta aqui como chave, e uma coluna `Unique` que constitui toda a chave primária não aparece duas vezes.  
Escolher outra chave reconstrói as linhas. Uma linha mantém a sua escolha enquanto essa coluna ainda estiver na tabela filha.

Sob os cabeçalhos `Referenced column` e `Foreign key column`, cada linha mostra uma coluna da chave com o seu tipo de dados e uma lista das colunas da tabela filha com que a emparelhar:

- A opção `Pick a column` deixa a linha vazia.
- A opção `New column: <name>` adiciona uma nova coluna de chave externa. O nome mostrado é o que a coluna vai receber, como descrito em [Nomes das colunas de chave externa](#foreign-key-column-names), numerado tendo em conta as colunas da tabela filha e as outras linhas que adicionam uma nova coluna. Não é oferecida quando o nome ficaria vazio, como no caso de uma chave sem nome.
- Todas as colunas da tabela filha, no formato `<name> (<data type>)`. Uma coluna que outra linha escolheu indica `<name> (<data type>) · in use` e não pode ser escolhida, pelo que duas linhas nunca partilham a mesma coluna. Uma coluna que outra relação já utiliza pode ainda assim ser escolhida, pelo que uma coluna como um `tenant_id` partilhado pode servir várias relações.

Com o botão `Map`, uma linha começa preenchida apenas quando exatamente uma coluna da tabela filha, sem distinguir maiúsculas de minúsculas, tem o nome que uma nova coluna de chave externa receberia para essa linha antes de qualquer numeração `_2`, como `users_id` para `id` em `users` e `member_id` para `member_id`. Enquanto a opção [`Bracket`](./schema-sql.md#database-and-bracket) estiver em `None`, a predefinição, o nome construído a partir da parte da tabela de um nome de tabela qualificado com esquema também conta, pelo que `id` em `public.users` é emparelhado com `public.users_id` ou `users_id`. Para uma chave `Unique`, o próprio nome da coluna da chave também conta, pelo que `vin` é emparelhado com `vin`. Todas as outras linhas começam em `Pick a column`.  
Com o botão `Save`, cada linha começa na coluna que a relação utiliza atualmente. Em ambos os casos, escolher outra chave em `References` preenche as linhas vazias dessa chave segundo os mesmos nomes.

Quando o tipo de dados de uma coluna escolhida difere do que a coluna pai dá a uma chave externa, uma indicação por baixo da linha assinala-o.  
Com a definição [Sincronização do tipo de dados nas relações](./settings.md#relationship-datatype-sync) ativada e um tipo de dados na coluna pai, a indicação mostra `<column> becomes <type>`, o tipo que o mapeamento vai escrever. Caso contrário, mostra `Types differ: <parent type> and <child type>`, e a coluna mantém o seu tipo.

O botão `Map` ou `Save` fica desativado enquanto houver um impedimento, e uma frase por baixo das linhas indica qual:

- `Pick a foreign key column for every referenced column`: uma linha ainda está vazia.
- `At least one column must reference a different column`: uma relação autorreferencial em que cada linha escolhe a sua própria coluna pai.
- `These columns are already linked by another relationship`: outra relação entre as mesmas duas tabelas liga exatamente estas colunas.
- `<parent> has no key to reference`: com o botão `Map`, a tabela pai não tem chave primária nem coluna `Unique`.

O botão `Save` também fica desativado até o mapeamento ser diferente do que a relação tem atualmente.  
Com o botão `Save`, uma linha indica `(removed)` quando a sua coluna saiu da respetiva tabela. Escolha outra coluna da tabela filha ou, no caso de uma coluna pai que já não existe, escolha uma chave em `References`. Com o botão `Map`, uma linha cuja coluna escolhida é removida volta a `Pick a column`.

Uma relação cujas colunas pai não correspondem exatamente a uma das chaves da tabela pai abre numa escolha adicional no fim da lista `References`, `Current columns (not a key)`, que mantém essas colunas como estão. Quando a tabela pai não tem qualquer chave, essa é a única escolha e a lista `References` não é mostrada.  
Nesse caso, a frase `The referenced columns are not a key of <parent>`, ou `<parent> has no key to reference` quando a tabela pai não tem qualquer chave, é um aviso e não um erro: o botão `Save` continua a funcionar, pelo que pode mudar as colunas da tabela filha e manter a referência.  
Uma relação cujas duas listas de colunas não podem ser emparelhadas, por exemplo porque têm comprimentos diferentes, mostra linhas `(invalid)` e mantém o botão `Save` desativado até escolher uma chave em `References` ou adicionar uma chave primária ou uma coluna `Unique` à tabela pai, se esta não tiver nenhuma.

A caixa de diálogo acompanha o diagrama enquanto está aberta, incluindo as edições de um colaborador ou de um agente de programação, e mantém o que escolheu.  
Se, entretanto, as colunas da relação ou a chave com que abriu mudarem, acrescenta a frase `This relationship changed while the dialog was open`.

O que os botões `Map` e `Save` escrevem:

- O botão `Map` adiciona a relação com `On Delete` e `On Update` em `Not set`. O botão `Save` muda apenas as colunas da relação, apontando o lado pai para a chave escolhida em `References`, e mantém o seu tipo e as suas ações ON DELETE e ON UPDATE.
- Uma linha `New column` adiciona uma coluna no fim da tabela filha, tal como acontece ao desenhar: `NOT NULL`, com o nome baseado na sua chave e com o tipo de dados, o valor predefinido e o comentário da chave — consulte [Relações identificadoras](#identifying-relationships).
- Uma coluna escolhida nunca muda de nome, e o seu sinalizador `Not Null`, a chave primária, o sinalizador `Unique`, o valor predefinido e o comentário ficam como estão. O seu tipo de dados só muda enquanto a definição `Relationship DataType Sync` estiver ativada e a coluna pai tiver um tipo de dados: recebe o tipo que a coluna pai dá a uma chave externa, o tipo inteiro no caso de uma chave serial, tal como numa coluna nova, e a alteração propaga-se ao longo das relações da mesma forma que a sincronização faz.
- Uma coluna que o mapeamento deixa de utilizar permanece na tabela filha e deixa de estar marcada como chave externa, a menos que outra relação ainda termine nela.
- Tudo o que um clique em `Map` ou `Save` escreve, incluindo as novas colunas e as mudanças de tipo, constitui um único passo de anulação.

O facto de a relação ser identificadora e a forma como é desenhada a sua extremidade pai determinam-se a partir das colunas da tabela filha mapeadas, como em qualquer relação. Mapear para as colunas de chave primária da tabela filha torna-a imediatamente identificadora, e mapear para uma coluna que permite `NULL` coloca um círculo na extremidade pai — consulte [Como ler um conector](#reading-a-connector).  
A chave externa do Esquema SQL referencia a chave que escolheu, como `REFERENCES vehicle (vin)` para uma chave `Unique`.

Se o diagrama já contiver o mapeamento quando premir o botão `Map` ou `Save`, porque um colaborador ou um agente de programação se antecipou, nada é escrito.  
Se tiver mudado de tal forma que o mapeamento já não se ajusta, nada é escrito e uma notificação indica `Couldn't map columns: the diagram changed`.

O botão `Cancel`, o botão `x`, a tecla `Escape` ou um clique na área esbatida fora da caixa de diálogo fecham-na sem escrever nada.  
A área esbatida cobre todo o editor, incluindo a barra de ferramentas, e um [explorador](./explorer.md#dialogs-beside-it) aberto continua aberto por baixo dela.  
Abrir a pesquisa rápida também fecha a caixa de diálogo, tal como sair do separador ERD ou o editor passar a só de leitura.  
`Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) também a fecha e coloca o cursor de texto no campo Localizar da [pesquisa](./find-and-replace.md#opening-and-closing) do explorador, abrindo o explorador se estiver fechado. Num editor demasiado estreito para mostrar o explorador, continua a fechar a caixa de diálogo, mas mostra uma notificação em vez de mover o cursor de texto — consulte [Abrir e fechar](./explorer.md#opening-and-closing).  
Se uma das suas tabelas ou a relação for removida enquanto está aberta, fecha-se com uma notificação como `Map Columns closed: the relationship was removed`.  
Enquanto está aberta, os atalhos da tela, anular e refazer, bem como copiar e colar, não fazem nada.

Um agente de programação não dispõe de nenhuma ferramenta Mapear colunas. Volta a mapear uma relação removendo-a com `erd_remove_relationship`, que mantém as suas colunas de chave externa, e desenhando-a de novo sobre colunas existentes com `erd_link_columns`, ambas as operações num único `erd_batch` — consulte [Ferramentas](../../mcp/tools.md#relationships).

## Relações N:M {#nm-relationships}

Como o editor se baseia no modelo físico, uma relação N:M é expressa com uma tabela de associação, como se mostra abaixo.

![Desenhar relações de products e depois de tags para a tabela vazia product_tags com ⌘ + ⌥ + 2, adicionando product_id e depois tag_id](/img/demo-relationship-n-m.webp)

Quando a tabela de associação já tem as suas colunas de chave, como `product_id` e `tag_id` em `product_tags`, desenhe cada relação com a opção `Map to existing columns` e escolha essas colunas em vez de adicionar novas — consulte [Mapear colunas](#map-columns). Se forem a chave primária da tabela de associação, cada relação é imediatamente identificadora.

Importar GraphQL, DBML ou AML cria a tabela de associação por si.  
Uma declaração muitos-para-muitos chega como uma tabela chamada `<left>_<right>`, com o comentário `Junction table inferred from <left> <-> <right>`, ligada a ambos os lados por relações identificadoras.  
Consulte [Importar ou exportar ficheiros](./file-import-export.md).

## Relações identificadoras {#identifying-relationships}

Desenhar uma relação clicando na tabela filha, ou com a opção `Create new columns`, copia cada chave primária da tabela pai para a tabela filha como uma coluna de chave externa `NOT NULL`, pelo que uma relação nova começa por ser não identificadora.  
A cópia recebe o tipo de dados, o valor predefinido e o comentário da chave, mas não `Unique` nem `Auto Increment`, e é nomeada como descrito em [Nomes das colunas de chave externa](#foreign-key-column-names).  
Uma chave serial é a exceção quanto ao tipo de dados: a sua cópia recebe o tipo inteiro que o serial armazena. Em qualquer base de dados, `smallserial` e `serial2` dão `smallint`; `serial4` dá `integer`; `bigserial` e `serial8` dão `bigint`. Um `serial` simples dá `integer` no PostgreSQL e `bigint unsigned` no MySQL e no MariaDB, e mantém-se `serial` em qualquer outra base de dados.  
Só conta o nome completo do tipo, sem distinguir maiúsculas de minúsculas, pelo que `serial(4)` é copiado tal como está escrito. Um tipo escrito em maiúsculas dá maiúsculas: `SERIAL` dá `INTEGER` no PostgreSQL. Uma coluna de chave externa que já tenha o tipo `serial` num diagrama guardado mantém esse tipo.  
Para tornar a relação identificadora, defina essas colunas de chave externa da tabela filha como chaves primárias: selecione-as todas e prima `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac) uma vez, ou escolha a opção `Primary Key` no menu de contexto da tabela, que indica `Primary Key on selected columns` enquanto estiverem selecionadas duas ou mais — consulte [Chave primária de coluna](./table-editing.md#column-primary-key).

![Alternar product_id como chave primária com Alt + K, o que torna o seu conector contínuo e depois tracejado](/img/demo-identifying-relationship.webp)

O editor mantém isto em sintonia por si só.  
Uma relação é identificadora enquanto todas as colunas do seu lado filho forem chaves primárias, e passa a ser não identificadora assim que uma delas não o for.

## Nomes das colunas de chave externa {#foreign-key-column-names}

Ao desenhar uma relação, cada coluna de chave externa que esta adiciona recebe um nome baseado na chave pai que essa coluna copia:

- Um nome de chave de uma só palavra, como `id`, `ID` ou `uuid`, recebe à frente o nome da tabela pai e um carácter de sublinhado: `id` em `products` passa a `products_id`.
- Um nome de chave de várias palavras, como `member_id`, `userId` ou `UserID`, mantém-se como está.
- Um nome de chave de uma só palavra que é o próprio nome da tabela, sem distinguir maiúsculas de minúsculas, também se mantém: `currency` em `currency` continua a ser `currency`. Uma chave que apenas contém o nome da tabela recebe ainda assim o prefixo: `username` em `user` passa a `user_username`.

Um nome é uma só palavra quando contém apenas letras e dígitos, sem mudança entre maiúsculas e minúsculas.  
Qualquer outro carácter divide-o, pelo que `_id`, `order no` e `order-no` são várias palavras.  
O mesmo acontece com uma mudança entre maiúsculas e minúsculas, lida da forma como se lê o camelCase: uma minúscula seguida de uma maiúscula (`userId`), duas maiúsculas seguidas de uma minúscula (`IDCard`, `IDs`) ou uma letra de uma escrita sem maiúsculas e minúsculas, como o hangul, o kana ou o han, junto a uma letra com maiúsculas e minúsculas (`회원ID`).  
Os dígitos não dividem uma palavra, pelo que `id2` e `SHA256` são uma só palavra. Uma palavra composta escrita só em maiúsculas ou só em minúsculas também é uma só palavra: `memberid` em `members` passa a `members_memberid`.

O nome da tabela é utilizado tal como está escrito, à exceção dos espaços à volta: as maiúsculas e minúsculas, os espaços interiores e os pontos mantêm-se, não é convertido para o singular e as opções `Table Name Case` e `Column Name Case` do Gerador de código não intervêm. `Users` com a chave `ID` dá `Users_ID`.  
Cada coluna de uma chave composta é nomeada individualmente: `orders` com a chave (`tenant_id`, `id`) adiciona `tenant_id` e `orders_id`.

Um nome que a tabela filha já tem, sem distinguir maiúsculas de minúsculas, é numerado com `_2`, `_3` e assim sucessivamente, ficando com o primeiro número livre.  
Uma segunda relação de `users`, com a chave `id`, para a mesma tabela adiciona `users_id_2`, e uma autorreferência em `members`, com a chave `member_id`, adiciona `member_id_2`.  
As colunas de uma mesma chave composta são numeradas entre si da mesma forma, e um nome mantido como está reserva o seu lugar primeiro: `user` com a chave (`id`, `user_id`) adiciona `user_id` para `user_id` e `user_id_2` para `id`.

Uma tabela pai sem nome deixa o nome da chave como está, numerado como qualquer outro em caso de conflito.  
Uma chave sem nome dá uma coluna de chave externa sem nome.  
Isto inclui a chave primária que o editor adiciona a uma tabela pai que não tem nenhuma, a menos que lhe dê um nome antes de clicar na tabela filha.

Os nomes são definidos quando a relação é desenhada. Mudar mais tarde o nome da tabela pai ou da sua chave não lhes muda o nome.  
As linhas `New column` de [Mapear colunas](#map-columns) são nomeadas segundo as mesmas regras, e a lista mostra cada nome antes de o escolher.  
As relações que chegam com as suas colunas já definidas — de uma importação, de uma colagem, de uma duplicação ou de Mapear colunas, ao emparelhar colunas existentes — mantêm os nomes que essas colunas têm.  
Um agente de programação que adicione uma relação com `erd_add_relationship` obtém os mesmos nomes e tipos de dados — consulte [Ferramentas](../../mcp/tools.md#relationships).

## Como ler um conector {#reading-a-connector}

- Uma relação identificadora é desenhada como linha contínua, uma não identificadora como linha tracejada.
- A extremidade filha tem o símbolo de cardinalidade do tipo de relação: um círculo e uma barra para Zero One, um círculo e um pé de galinha para Zero N, duas barras para One Only e uma barra e um pé de galinha para One N.
- A extremidade pai é um círculo e uma barra, como em Zero One, quando alguma das colunas de chave externa permite `NULL`, e duas barras, como em One Only, quando são todas `NOT NULL`.
- Passar o ponteiro sobre um conector realça-o juntamente com as colunas que liga em ambas as tabelas.

![Passar o ponteiro sobre três conectores, um de cada vez, cada um a iluminar-se com as colunas que liga](/img/demo-relationship-hover.webp)

Uma relação que define [ON DELETE ou ON UPDATE](#on-delete-and-on-update) tem uma etiqueta junto à sua extremidade filha, como `D:C U:R`: `D:` e a ação ON DELETE, depois `U:` e a ação ON UPDATE, cada uma apenas quando está definida.  
As ações são abreviadas segundo a notação do erwin: `C` para CASCADE, `R` para RESTRICT, `SN` para SET NULL, `SD` para SET DEFAULT e `NA` para NO ACTION. Uma relação que não define nenhuma das duas não tem etiqueta.  
A etiqueta fica do lado oposto à tabela filha, acima da linha quando o conector sai pelo lado esquerdo ou direito dessa tabela e à direita da linha quando sai por cima ou por baixo, afastada do símbolo de cardinalidade.  
É desenhada na cor do conector sobre uma pequena caixa com a cor de fundo da tela, e ilumina-se juntamente com o seu conector. As etiquetas são desenhadas por cima de todos os conectores, pelo que uma linha que atravesse uma delas passa por baixo dela.  
Mostra a ação guardada na relação, seja o que for que a base de dados selecionada escreva, pelo que ON DELETE SET DEFAULT continua a indicar `D:SD` no MySQL.

Passar o ponteiro sobre um conector que define qualquer uma das ações também mostra uma dica com as cláusulas por extenso, uma por linha, como `ON DELETE CASCADE` e `ON UPDATE RESTRICT`.  
A dica aparece mesmo enquanto a etiqueta está oculta.

Ir para uma relação ilumina-a: escolher uma linha sob a pasta `Foreign Keys` de uma tabela no [explorador](./explorer.md#going-to-a-row), ou uma linha de chave externa no [visualizador de diferenças](./table-related-functions.md#going-to-a-change), desenha o seu conector e a sua etiqueta na cor usada quando o ponteiro passa por cima. No visualizador de diferenças, ilumina o conector em cada lado que contém a relação, pelo que uma chave externa adicionada ilumina apenas o lado atual e uma eliminada apenas o lado guardado.  
O salto seleciona apenas a tabela filha com as suas colunas de chave externa, ficando a célula com o foco na primeira delas; a própria relação continua a nunca ser selecionada. Para saber para onde vai a vista, consulte [Onde termina um salto](./table-related-functions.md#where-a-jump-lands).  
A iluminação apaga-se da próxima vez que se premir o botão esquerdo ou direito na tela, seja num espaço vazio, numa tabela, numa nota, num grupo de tabelas ou num conector, mesmo que isso deixe a seleção como estava. Ir para outra linha ou correspondência de pesquisa no explorador também a apaga, tal como ir para outra linha no visualizador de diferenças, em cada lado para onde essa linha vai.  
Deslocar a vista com o botão do meio ou com a ferramenta mão mantém-na iluminada, tal como recolher ou expandir uma linha no explorador ou no visualizador de diferenças, limpar a seleção com a tecla `Escape` e um salto a partir da [pesquisa rápida](./quick-search.md) ou do [botão do cartão](./visualization.md#card-buttons) de ligação externa do Flow.  
A iluminação não é guardada nem fica no histórico de anulação, e os colaboradores não a veem.

Oculte os conectores na tela ERD com a opção de vista `Relationship`, ou apenas as suas etiquetas com a opção de vista `Referential Actions`, que está ativada por predefinição — consulte [Opções de vista das tabelas](./table-related-functions.md#table-view-options).  
As etiquetas não são desenhadas a `70%` ou menos, onde as tabelas ficam reduzidas ao nome.  
Uma [exportação de imagem](./file-import-export.md#image) é sempre desenhada a 100%, pelo que desenha as etiquetas seja qual for o zoom da tela, a menos que uma opção de vista as oculte. Com a opção `Background` desativada, a caixa por trás de cada etiqueta também fica transparente.  
O [modo Flow](./visualization.md#flow-mode) do separador Visualização desenha os conectores mesmo com a opção `Relationship` desativada, cada um como uma única curva cinzenta, contínua e suave, com as mesmas marcas nas extremidades, pelo que a linha tracejada, as etiquetas, a dica, a iluminação após um salto e o traçado em ângulo reto descritos nesta página se aplicam apenas à tela ERD. Uma relação de uma tabela para si própria também contorna o canto superior direito no Flow — consulte [Traçado dos conectores](#connector-routing).

## Traçado dos conectores {#connector-routing}

Os conectores são traçados em ângulo reto.  
Um traçado contorna as tabelas que se encontram entre as suas duas extremidades em vez de as atravessar, e os seus cantos são arredondados.  
Cada extremidade sai da sua tabela num pequeno troço reto antes de virar, pelo que duas tabelas próximas cujas extremidades do conector estejam alinhadas são unidas por uma única linha reta em vez de um desvio.  
Os traçados que saem do mesmo lado de uma tabela são distribuídos por corredores separados para não se sobreporem uns aos outros.  
Só as tabelas são evitadas: um conector pode atravessar uma nota ou a caixa de um grupo de tabelas, e é desenhado acima dos grupos de tabelas e abaixo das tabelas e das notas.

Uma relação de uma tabela para si própria é desenhada como uma única curva à volta do canto superior direito da tabela, que sai pelo lado superior na extremidade pai e entra pelo lado direito na extremidade filha.  
As autorreferências adicionais na mesma tabela encaixam-se por fora da primeira, pelo que as suas curvas não se cruzam entre si nem atravessam a tabela.

Não há nada para configurar.  
Os traçados são recalculados automaticamente sempre que algo na tela se move ou é redimensionado, pelo que nunca precisam de ser ajustados à mão.

![Arrastar a tabela members para baixo e de volta enquanto o conector a partir de orders alterna entre passar à direita de categories e contorná-la pela esquerda, com todos os cantos arredondados](/img/demo-connector-routing.webp)
