---
sidebar_position: 3
description: Adicionar, selecionar, reordenar e excluir colunas, alternar as opções de coluna e copiar ou colar colunas.
---

# Edição de tabelas

A edição de tabelas oferece, basicamente, uma experiência de edição semelhante à do Excel.  
A [exibição de nomes](./logical-names.md#name-view) decide se uma tabela desenha os nomes, os nomes lógicos ou ambos no cabeçalho e nas linhas.  
O modo de edição começa com `Enter` ou com um clique duplo em uma célula.  
`Enter` ou `Escape` o encerra. O que você digita é aplicado à medida que é digitado, então `Escape` mantém o texto em vez de revertê-lo. Uma [célula Domínio](./logical-names.md#the-domain-cell) é a exceção: ela só escolhe a partir da sua lista e nunca mantém o que você digita. Fechar uma [célula de nome lógico](./logical-names.md#writing-a-logical-name) cujo nome lógico foi alterado também pode preencher o nome físico.  
`Escape` deixa a célula em foco e a tabela selecionada, e um segundo `Escape` limpa o foco e a seleção. Enquanto uma célula de nome lógico mostra sua [lista de termos](./logical-names.md#completing-term-names), o primeiro `Escape` fecha só a lista.  
Enquanto um método de entrada ainda está compondo, `Escape` mantém o modo de edição aberto.

![Adição de uma tabela com Alt + N e preenchimento de duas colunas](/img/demo-table-edit.webp)

## Adicionar colunas {#adding-columns}

As colunas são criadas com o atalho `Alt + Enter` (Windows/Linux) ou `⌥ + Enter` (Mac), que adiciona uma coluna a cada tabela selecionada, ou com o botão `+` no cabeçalho de uma tabela, que adiciona uma a essa tabela.  
A primeira célula da nova coluna recebe o foco, a primeira que a linha desenha na [ordem das colunas](./settings.md#adjusting-column-order). Na ordem padrão, essa é o nome dela, que na exibição `Logical Names` é o nome lógico e, em `Both Names`, a célula `Logical Name` — consulte [Exibição de nomes](./logical-names.md#name-view).  
Uma coluna adicionada com `Tab` a partir da última célula e a chave primária que o desenho de um relacionamento adiciona a uma tabela pai que não tem nenhuma também começam nessa célula.

## Tecla Tab {#tab-key}

Pressione `Tab` para passar direto ao modo de edição da próxima célula.  
Pressionar `Tab` na última célula cria uma nova coluna e abre a primeira célula dela para edição — consulte [Adicionar colunas](#adding-columns).  
Use `Shift + Tab` para ir ao modo de edição da célula anterior.  
`Tab` e `Shift + Tab` passam pelas células que a tabela desenha, na ordem delas, então a exibição de nomes e View Option → `Domain` decidem se as células de nome lógico e as células Domínio estão entre elas — consulte [Escrever um nome lógico](./logical-names.md#writing-a-logical-name).  
As marcas de [chave alternativa](./table-related-functions.md#alternate-keys) desenhadas após a última célula de uma linha não são células, então o foco do teclado passa por cima delas e elas nunca se abrem para edição.

![Movimento com Tab pelas células de uma linha, adição de uma coluna a partir da última célula e volta com Shift + Tab](/img/demo-table-tab.webp)

## Preenchimento automático do tipo de dados {#datatype-autocomplete}

Comece a editar uma célula `DataType` e digite. Os tipos correspondentes do banco de dados selecionado são sugeridos, e a parte de uma sugestão que contém literalmente o que você digitou é realçada.  
A correspondência em si é aproximada, então `vch` também encontra `VARCHAR`.

- `Arrow Up` ou `Arrow Down`: percorrer as sugestões
- `Arrow Right`, `Tab` ou `Enter`: aceitar a sugestão realçada
- `Arrow Left`: voltar ao texto que você digitou

Também é possível clicar em uma sugestão.  
A lista mostra até dez sugestões por vez e rola para exibir as demais.  
Nada é imposto, então um tipo que não está na lista pode ser digitado livremente, inclusive com argumentos, como `VARCHAR(255)`. A lista se fecha quando o que você digita ultrapassa um nome de tipo completo, como acontece com `VARCHAR(255)` ou `BIGINT UNSIGNED`.  
As sugestões seguem o banco de dados selecionado. Mudar o banco de dados muda o que é oferecido e deixa as colunas existentes como estão.

Digitar na célula `DataType` de uma coluna vinculada a um domínio, ou aceitar uma sugestão nela, desvincula a coluna assim que o tipo dela passa a diferir do tipo do domínio — consulte [Domínios e tipos de dados](./dictionary.md#domains-and-data-types).  
Na exibição `Logical Names`, enquanto View Option → `Domain` está desativado, a célula de tipo de uma coluna vinculada a um domínio com nome mostra o nome do domínio, e editá-la abre o [seletor de domínio](./logical-names.md#the-domain-cell) em vez dessas sugestões. Uma célula de tipo que mostra um tipo de dados o edita como descrito acima.

![Preenchimento de células DataType a partir de sugestões aproximadas com as teclas de seta, Tab e Enter](/img/demo-data-type-autocomplete.webp)

## Não nulo, Único, Incremento automático {#not-null-unique-auto-increment}

Essas três células são botões de alternância, e não texto.  
Clique duas vezes em uma delas, ou pressione `Enter` enquanto ela estiver em foco, para alterná-la.

A célula Não nulo mostra `N-N` quando ativada e `NULL` quando desativada.  
`UQ` e `AI` ficam esmaecidos quando desativados e realçados quando ativados.

![Alternância de Não nulo com um clique duplo e de Único e Incremento automático com Enter](/img/demo-column-options.webp)

As células ocultas pelas [opções de exibição da tabela](./table-related-functions.md) não podem ser alternadas.

## Selecionar várias colunas {#selecting-multiple-columns}

Oferece cinco métodos:

- `Shift + Arrow Up/Down`: estender a seleção uma linha por vez
- `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac): adicionar uma única coluna
- `Shift + click`: selecionar o intervalo a partir da última coluna em foco
- `Ctrl + Shift + click` (Windows/Linux) ou `⌘ + Shift + click` (Mac): adicionar esse intervalo à seleção
- `Alt + A` (Windows/Linux) ou `⌥ + A` (Mac): Selecionar tudo

![Seleção de colunas com Shift + Arrow Down, Ctrl/⌘ + click, Shift + click e Alt + A](/img/demo-column-select.webp)

Para mover as colunas selecionadas juntas, arraste a alça ao lado da coluna em foco — consulte [Reordenar e mover colunas](#rearranging-and-moving-columns).

Um clique com o botão direito na linha de uma coluna decide sobre quais colunas o menu de contexto da tabela atua, seja qual for a tecla modificadora pressionada.  
Em uma linha que já está selecionada, a seleção se mantém e o foco passa para essa linha. Em qualquer outra linha, só essa linha é selecionada. Isso vale em qualquer ponto da linha, inclusive no ícone de chave e em uma marca de [chave alternativa](./table-related-functions.md#alternate-keys).  
Então, para atuar sobre várias colunas pelo menu, como em [Chave primária da coluna](#column-primary-key) ou [Exclusão de colunas](#column-deletion), clique com o botão direito em uma das linhas selecionadas.  
No Mac, `Ctrl + click` também abre o menu, mas conta como um clique simples, então, em uma célula, ele seleciona só essa linha antes de o menu se abrir.

## Reordenar e mover colunas {#rearranging-and-moving-columns}

Uma coluna se move pela sua alça de arrastar, um pequeno botão com um ícone de arrastar que fica logo fora da borda esquerda da tabela, ao lado da linha em foco.  
Coloque o foco em qualquer célula da coluna, clicando nela ou com as teclas de seta ou `Tab`, e a alça aparece ao lado da linha dela. Nenhuma linha tem alça enquanto o foco está no cabeçalho da tabela.  
A alça é desenhada de forma discreta até o ponteiro ficar sobre ela, e então o ponteiro se transforma em uma mão. Só pressioná-la não faz nada: o arrasto começa assim que o ponteiro se move e pode levar a coluna para outro lugar na tabela dela ou para outra tabela.  
Sobre as linhas de uma tabela, as linhas arrastadas se encaixam no lugar, e as linhas ao redor do ponto em que serão soltas deslizam para o lado para abrir espaço. Sobre o canvas vazio, ou sobre o cabeçalho de uma tabela que tem colunas, uma cópia translúcida das linhas acompanha o ponteiro, mostrando as células de nome e de tipo de cada linha como a linha as desenha na [exibição de nomes](./logical-names.md#name-view) atual.  
Solte logo abaixo da última linha de uma tabela para mover a coluna para o fim dessa tabela. Uma tabela sem colunas recebe a coluna solta em qualquer ponto dela. A faixa logo à esquerda de uma tabela, onde fica a alça, também conta como as linhas da tabela, então um arrasto direto para baixo ao longo da alça reordena as colunas sem que o ponteiro entre na tabela.  
Uma coluna movida para outra tabela mantém seu nome lógico e seu domínio.

![Foco em uma coluna e arrasto da alça ao lado da linha dela para uma nova posição e, depois, arrasto da alça de outra coluna para outra tabela](/img/demo-column-move.webp)

Para mover várias colunas de uma vez, [selecione-as](#selecting-multiple-columns) e arraste a alça ao lado da coluna em foco. Enquanto a coluna em foco é uma de duas ou mais colunas selecionadas da tabela dela, a alça leva todas elas; caso contrário, leva só a própria coluna.  
Nenhuma tecla modificadora é necessária. Manter `Alt` (Windows/Linux) ou `⌥` (Mac) pressionado na alça move as colunas como um arrasto simples e não duplica nada.

![Seleção de três colunas e, depois, arrasto da alça ao lado da coluna em foco para outra tabela, com as outras colunas selecionadas acompanhando-a](/img/demo-column-multi-move.webp)

Um arrasto que começa na linha de uma coluna, e não na alça dela, move a tabela, como faz um arrasto no cabeçalho — consulte [Mover várias tabelas](./table-related-functions.md#moving-multiple-tables). `Alt + drag` (Windows/Linux) ou `⌥ + drag` (Mac) em uma linha duplica a tabela — consulte [Duplicar tabelas e notas](./table-related-functions.md#duplicating-tables-and-memos).  
Nenhuma alça é desenhada com zoom de `70%` ou menos, em que as tabelas mostram apenas o nome, nem em um editor somente leitura, então as colunas não podem ser reordenadas nesses casos.  
Um arrasto de coluna em andamento quando o editor passa a ser somente leitura termina na hora: a cópia que seguia o ponteiro e a mão de agarrar somem, e soltar não move nenhuma coluna. As linhas que o arrasto já havia movido ficam onde ele as colocou.

## Exclusão de colunas {#column-deletion}

Exclui as colunas selecionadas da tabela em foco. Clicar em uma célula seleciona a coluna dela, então clicar em uma célula e pressionar `Delete` remove essa única coluna.  
Atalhos:

- `Delete` ou `Backspace`. Essas teclas removem as colunas selecionadas enquanto a tabela delas é a única coisa selecionada. Sem nenhuma coluna selecionada (com o foco no nome, no [nome lógico](./logical-names.md#name-view) ou no comentário da tabela), com qualquer outra coisa também selecionada ou com zoom de `70%` ou menos, em que as tabelas mostram apenas o nome, elas removem toda a seleção em vez disso — consulte [Exclusão de tabelas e notas](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` ou `Alt + Delete` (Windows/Linux), `⌥ + Backspace` ou `⌥ + Delete` (Mac). Essas combinações removem as colunas selecionadas da tabela em foco mesmo enquanto outras tabelas ou notas também estão selecionadas. Elas não removem nada enquanto uma célula está sendo editada nem em `70%` ou menos.

![Exclusão de uma coluna e, depois, de duas colunas selecionadas com Alt + Backspace](/img/demo-column-remove.webp)

O menu de contexto da tabela faz o mesmo. Com a tabela como única coisa selecionada, clique com o botão direito na linha de uma coluna: o último item do menu passa a ser `Delete column`, ou `Delete columns` quando essa linha é uma de duas ou mais colunas selecionadas.

Enquanto uma célula está sendo editada, `Delete` e `Backspace` só apagam texto. Mantidas pressionadas fora do editor de célula, elas removem só uma vez.  
Após uma remoção, o foco passa para a coluna restante mais próxima acima da que estava em foco. Quando não resta nenhuma acima dela, o foco passa para o nome da tabela (na exibição `Logical Names`, o nome lógico desenhado no lugar dele), mesmo que restem colunas abaixo, então o próximo `Delete` ou `Backspace` remove a tabela, e não uma coluna.  
Os relacionamentos e índices que usam uma coluna removida são removidos com ela. Não há confirmação, e toda a remoção é uma única etapa de desfazer.

## Copiar e colar colunas {#copyingpasting-columns}

Funciona como uma área de transferência baseada em tabelas.  
Atalhos: `Ctrl + C` (Windows/Linux) ou `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) ou `⌘ + V` (Mac)

Copiar para uma planilha, colar a partir de uma e colar na tabela cuja célula de coluna está em foco usam as células que as tabelas mostram, na ordem em que as mostram — consulte [Opções de exibição da tabela](./table-related-functions.md#table-view-options), [Ajustar a ordem das colunas](./settings.md#adjusting-column-order) e [Exibição de nomes](./logical-names.md#name-view). A exibição de nomes muda o que algumas dessas células contêm:

- Na exibição `Logical Names`, a célula do nome contém o nome lógico, ou nada enquanto ele está em branco. Enquanto View Option → `Domain` está desativado, a célula de tipo contém o nome do domínio da coluna quando mostra um, e o tipo de dados caso contrário.
- Na exibição `Both Names`, a célula `Logical Name` é copiada e colada onde a ordem das colunas a coloca.
- Uma célula Domínio visível contém o nome do domínio, ou nada para uma coluna que não mostra nenhum domínio.

Colunas copiadas no editor e coladas com um cabeçalho de tabela selecionado, ou nas outras tabelas selecionadas, levam todas as células das colunas copiadas, inclusive as ocultas, como Único e Incremento automático, e seus nomes lógicos.  
Elas mantêm um vínculo com um domínio só enquanto este diagrama lista esse mesmo domínio, e não apenas um de mesmo nome, e o domínio ainda tem o tipo da coluna copiada. Caso contrário, chegam desvinculadas, com o tipo com que foram copiadas. Seus nomes contam como escritos por você, a menos que um nome colado esteja vazio e o nome lógico derive um — consulte [Derivar nomes físicos](./dictionary.md#deriving-physical-names).  
As marcas de [chave alternativa](./table-related-functions.md#alternate-keys), como `AK1.1`, não são células, então copiar e colar as deixam de fora mesmo enquanto estão visíveis.

É possível colar do editor no Excel e do Excel de volta no editor.  
Os valores das células saem exatamente como foram digitados, então um valor como `<label>` ou `a &amp; b` chega a uma planilha ou a um documento sem alterações.  
As colunas da planilha são associadas às células visíveis pela posição, e não pelo nome, então as colunas da planilha precisam seguir a ordem dessas células.  
Nas colunas abaixo, qualquer um destes valores é lido como verdadeiro (sem diferenciar maiúsculas de minúsculas):

- AutoIncrement: `TRUE`, `1`, `YES`, `Y`
- Unique: `TRUE`, `1`, `YES`, `Y`
- Not Null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

Na saída, o editor escreve `TRUE` ou `FALSE` para AutoIncrement e Unique, e `NOT NULL` ou `NULL` para Not Null.  
Único e Incremento automático ficam ocultos por padrão, então `TRUE` e `FALSE` só são escritos e lidos depois que essas células são exibidas.

![Colagem de quatro colunas em uma planilha, com os sinalizadores escritos como TRUE/FALSE e NOT NULL/NULL](/img/demo-copy-column-to-sheet.webp)

![Colagem de três linhas de planilha em uma tabela como colunas, com YES, 1 e NOT NULL lidos como verdadeiro](/img/demo-copy-sheet-column.webp)

O destino de uma colagem depende do foco:

- Com um cabeçalho de tabela selecionado, as linhas coladas são adicionadas como novas colunas a todas as tabelas selecionadas.
- Com uma célula de coluna em foco, as linhas selecionadas dessa tabela e, depois, as linhas abaixo da última delas são sobrescritas em ordem, tantas quantas foram coladas. As linhas entre seleções separadas são puladas. Uma linha sobrescrita recebe os valores colados nas células visíveis e mantém as ocultas, e as linhas que sobram são adicionadas como novas colunas. Todas as outras tabelas selecionadas recebem as linhas coladas como novas colunas.

![Cópia de duas colunas e colagem delas em duas tabelas selecionadas de uma só vez](/img/demo-copy-column-multi.webp)

Uma linha colada escreve nomes lógicos e domínios desta forma:

- Um nome lógico, vindo de uma célula `Logical Name` ou da célula do nome na exibição `Logical Names`, conta como digitado por inteiro. Enquanto o nome da coluna está vazio ou ainda derivado, os [dicionários](./dictionary.md#deriving-physical-names) derivam dele o nome físico e vinculam o domínio que o termo dele fornece, a menos que a própria célula Domínio da linha vincule um. Um nome que a mesma linha cola é mantido e conta como escrito por você.
- Uma célula Domínio, ou a célula de tipo na exibição `Logical Names` enquanto View Option → `Domain` está desativado, vincula o domínio que o texto dela nomeia, se o diagrama listar um. Qualquer outro texto, ou uma célula vazia, não vincula nenhum e desvincula a coluna, mesmo de um domínio do tipo colado. Um texto na célula de tipo que não nomeia nenhum domínio é lido como tipo de dados. As linhas copiadas no editor vinculam, em vez disso, o domínio com que foram copiadas, e só enquanto este diagrama o lista com o tipo copiado, como fazem as colunas novas.
- Um domínio vinculado dá à coluna o tipo de dados dele, a menos que a linha cole um tipo próprio. Nesse caso, um domínio de outro tipo não é vinculado, e a coluna recebe o tipo colado.
- Em uma linha sem célula Domínio, um tipo colado desvincula a coluna de um domínio de outro tipo, como faz digitá-lo.
- Nenhuma colagem propaga um tipo pela [sincronização do tipo de dados nos relacionamentos](./settings.md#relationship-datatype-sync).

## Copiar e colar tabelas e notas {#copyingpasting-tables-and-memos}

Quando nenhuma coluna está selecionada dentro de uma tabela em foco, os mesmos atalhos copiam as próprias tabelas e notas selecionadas — consulte [Funções relacionadas a tabelas](./table-related-functions.md).

## Chave primária da coluna {#column-primary-key}

Alterna a chave primária na coluna em foco, que é a coluna à qual pertence a célula em foco.  
Quando a coluna em foco é uma de duas ou mais colunas selecionadas, a alternância se aplica a todas as colunas selecionadas: se alguma delas não for chave, todas se tornam chaves e, se todas já forem, todas deixam de ser chaves. As colunas fora da seleção não são alteradas.  
Use o menu de contexto da tabela ou o atalho `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac). Quando a alternância abrange duas ou mais colunas, o item do menu passa a ser `Primary Key on selected columns` em vez de `Primary Key`.  
O ícone de chave na linha serve apenas para exibição, então clicar nele não define a chave.

Para transformar várias colunas em uma única chave composta, [selecione-as](#selecting-multiple-columns) e depois pressione `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac), ou clique com o botão direito em uma das linhas selecionadas e escolha `Primary Key on selected columns`. Cada alternância é uma única etapa de desfazer.

![Seleção de duas colunas com Shift + Arrow Down e, depois, transformação das duas em chave primária com ⌥ + K e remoção da chave das duas com um segundo pressionamento](/img/demo-column-pk.webp)

## Editores somente leitura {#read-only-editors}

Em um editor [`readonly`](../../api/erd-editor-element.md#readonly), nenhuma célula se abre para edição e nenhuma coluna muda.  
Um clique em uma célula não coloca o foco em nada e tira a seleção que um salto deixou. `Enter` e um clique duplo não abrem nenhum editor nem alternam nenhum interruptor, `Tab` fica para a página, e os atalhos que adicionam, selecionam tudo ou excluem colunas, o de alternar a chave primária e uma colagem não fazem nada.  
Ir para uma coluna a partir do [explorador](./explorer.md#going-to-a-row) ou da [pesquisa rápida](./quick-search.md) coloca o foco na célula dela. As teclas de seta então movem o foco de célula em célula, com a coluna que alcançam selecionada sozinha, já que `Shift` não adiciona nenhuma coluna ali.  
`Ctrl + C` (Windows/Linux) ou `⌘ + C` (Mac) ainda copia a coluna selecionada, ou a tabela que um salto selecionou — consulte [Copiar e colar colunas](#copyingpasting-columns).
