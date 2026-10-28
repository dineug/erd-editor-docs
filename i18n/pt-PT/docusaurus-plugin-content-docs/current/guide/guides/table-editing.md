---
sidebar_position: 3
description: Adicionar, selecionar, reordenar e eliminar colunas, alternar as opções das colunas e copiar ou colar colunas.
---

# Edição de tabelas

A edição de tabelas oferece, basicamente, uma experiência de edição semelhante à do Excel.  
A [vista de nomes](./logical-names.md#name-view) decide se uma tabela desenha os nomes, os nomes lógicos ou ambos no seu cabeçalho e nas suas linhas.  
O modo de edição começa com `Enter` ou com um duplo clique numa célula.  
`Enter` ou `Escape` termina-o. O que escreve é aplicado à medida que o escreve, pelo que `Escape` mantém o texto em vez de o reverter. A [célula Domínio](./logical-names.md#the-domain-cell) é a exceção: apenas escolhe da sua lista e nunca mantém o que escreve. Fechar uma [célula do nome lógico](./logical-names.md#writing-a-logical-name) com um nome lógico alterado também pode preencher o nome físico.  
`Escape` deixa a célula com o foco e a tabela selecionada, e um segundo `Escape` retira o foco e limpa a seleção. Enquanto uma célula do nome lógico mostra a sua [lista de termos](./logical-names.md#completing-term-names), o primeiro `Escape` fecha apenas a lista.  
Enquanto um método de entrada ainda está a compor, `Escape` deixa o modo de edição aberto.

![Adicionar uma tabela com Alt + N e preencher duas colunas](/img/demo-table-edit.webp)

## Adicionar colunas {#adding-columns}

São criadas com o atalho `Alt + Enter` (Windows/Linux) ou `⌥ + Enter` (Mac), que adiciona uma coluna a cada tabela selecionada, ou com o botão `+` do cabeçalho de uma tabela, que adiciona uma a essa tabela.  
A primeira célula da nova coluna recebe o foco, a primeira que a sua linha desenha na [ordem das colunas](./settings.md#adjusting-column-order). Com a ordem predefinida, é o seu nome, que, na vista `Logical Names`, é o seu nome lógico e, na vista `Both Names`, a sua célula `Logical Name` — consulte [Vista de nomes](./logical-names.md#name-view).  
Uma coluna adicionada com `Tab` a partir da última célula, e a chave primária que o desenho de uma relação adiciona a uma tabela pai que não tem nenhuma, começam também nessa célula.

## Tecla Tab {#tab-key}

Prima `Tab` para passar diretamente ao modo de edição da célula seguinte.  
Premir `Tab` na última célula cria uma nova coluna e abre a sua primeira célula para edição — consulte [Adicionar colunas](#adding-columns).  
Use `Shift + Tab` para ir para o modo de edição da célula anterior.  
`Tab` e `Shift + Tab` passam pelas células que a tabela desenha, pela respetiva ordem, pelo que a vista de nomes e Opções de vista → `Domain` decidem se as células do nome lógico e as células Domínio estão entre elas — consulte [Escrever um nome lógico](./logical-names.md#writing-a-logical-name).  
As marcas de [chave alternativa](./table-related-functions.md#alternate-keys) desenhadas após a última célula de uma linha não são células, pelo que o foco do teclado passa por cima delas e nunca se abrem para edição.

![Tab a percorrer as células de uma linha e a adicionar uma coluna a partir da última célula, e Shift + Tab a voltar atrás](/img/demo-table-tab.webp)

## Preenchimento automático do tipo de dados {#datatype-autocomplete}

Comece a editar uma célula `DataType` e escreva. São sugeridos os tipos correspondentes da base de dados selecionada, e a parte de uma sugestão que contém literalmente o que escreveu fica realçada.  
A correspondência em si é aproximada, pelo que `vch` também encontra `VARCHAR`.

- `Arrow Up` ou `Arrow Down`: percorrer as sugestões
- `Arrow Right`, `Tab` ou `Enter`: aceitar a sugestão realçada
- `Arrow Left`: voltar ao texto que escreveu

Também pode clicar numa sugestão.  
A lista mostra até dez sugestões de cada vez e desloca-se para mostrar as restantes.  
Nada é imposto, pelo que é possível escrever livremente um tipo que não está na lista, incluindo argumentos, como em `VARCHAR(255)`. A lista fecha-se assim que o que escreve ultrapassa um nome de tipo completo, como acontece com `VARCHAR(255)` ou `BIGINT UNSIGNED`.  
As sugestões seguem a base de dados selecionada. Mudar de base de dados muda o que é proposto e deixa as colunas existentes como estão.

Escrever na célula `DataType` de uma coluna vinculada a um domínio, ou aceitar aí uma sugestão, desvincula a coluna assim que o seu tipo difere do tipo do domínio — consulte [Domínios e tipos de dados](./dictionary.md#domains-and-data-types).  
Na vista `Logical Names`, enquanto Opções de vista → `Domain` está desativada, a célula do tipo de uma coluna vinculada a um domínio com nome mostra o nome do domínio, e editá-la abre o [seletor de domínios](./logical-names.md#the-domain-cell) em vez destas sugestões. Uma célula do tipo que mostra um tipo de dados edita-o como acima.

![Preencher células DataType a partir de sugestões aproximadas com as teclas de seta, Tab e Enter](/img/demo-data-type-autocomplete.webp)

## Não nulo, Único, Incremento automático {#not-null-unique-auto-increment}

Estas três células são interruptores e não texto.  
Faça duplo clique numa delas, ou prima `Enter` enquanto a célula tem o foco, para a alternar.

A célula Não nulo mostra `N-N` quando está ativada e `NULL` quando não está.  
`UQ` e `AI` ficam esbatidos quando estão desativados e realçados quando estão ativados.

![Alternar Não nulo com um duplo clique, e Único e Incremento automático com Enter](/img/demo-column-options.webp)

As células ocultas pelas [opções de vista das tabelas](./table-related-functions.md) não podem ser alternadas.

## Selecionar várias colunas {#selecting-multiple-columns}

São suportados cinco métodos:

- `Shift + Arrow Up/Down`: alargar a seleção uma linha de cada vez
- `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac): adicionar uma única coluna
- `Shift + click`: selecionar o intervalo a partir da última coluna que teve o foco
- `Ctrl + Shift + click` (Windows/Linux) ou `⌘ + Shift + click` (Mac): adicionar esse intervalo à seleção
- `Alt + A` (Windows/Linux) ou `⌥ + A` (Mac): Selecionar tudo

![Selecionar colunas com Shift + Arrow Down, Ctrl/⌘ + click, Shift + click e Alt + A](/img/demo-column-select.webp)

Para mover as colunas selecionadas em conjunto, arraste a pega ao lado da que tem o foco — consulte [Reordenar e mover colunas](#rearranging-and-moving-columns).

Um clique com o botão direito na linha de uma coluna determina as colunas sobre as quais atua o menu de contexto da tabela, seja qual for a tecla modificadora premida.  
Numa linha que já está selecionada, a seleção mantém-se e o foco passa para essa linha. Em qualquer outra linha, só essa linha fica selecionada. Isto aplica-se a qualquer ponto da linha, incluindo o ícone de chave e uma marca de [chave alternativa](./table-related-functions.md#alternate-keys).  
Assim, para atuar sobre várias colunas a partir do menu, como em [Chave primária de coluna](#column-primary-key) ou [Eliminação de colunas](#column-deletion), clique com o botão direito numa das linhas selecionadas.  
Num Mac, `Ctrl + click` também abre o menu, mas conta como um clique simples, pelo que, numa célula, seleciona apenas essa linha antes de o menu se abrir.

## Reordenar e mover colunas {#rearranging-and-moving-columns}

Uma coluna move-se pela sua pega de arrastamento, um pequeno botão com um ícone de arrastamento que fica logo fora do bordo esquerdo da tabela, ao lado da linha com o foco.  
Dê o foco a qualquer célula da coluna, clicando nela ou com as teclas de seta ou `Tab`, e a pega aparece ao lado da sua linha. Nenhuma linha tem pega enquanto o foco está no cabeçalho da tabela.  
A pega é desenhada de forma ténue até o ponteiro estar sobre ela, e o ponteiro passa então a ser uma mão. Premir sem mais não faz nada: o arrasto começa assim que o ponteiro se move e pode levar a coluna para outro local da sua tabela ou para outra tabela.  
Sobre as linhas de uma tabela, as linhas arrastadas passam para o seu lugar e as linhas em redor do ponto onde se larga deslizam para o lado para abrir espaço. Sobre a tela vazia, ou sobre o cabeçalho de uma tabela que tem colunas, uma cópia translúcida das linhas segue o ponteiro e mostra as células do nome e do tipo de cada linha tal como a linha as desenha na [vista de nomes](./logical-names.md#name-view) atual.  
Largue logo abaixo da última linha de uma tabela para mover a coluna para o fim dessa tabela. Uma tabela sem colunas aceita a coluna largada em qualquer ponto da tabela. A faixa logo à esquerda de uma tabela, onde fica a pega, também conta como as linhas da tabela, pelo que um arrasto a direito para baixo ao longo da pega reordena as colunas sem que o ponteiro entre na tabela.  
Uma coluna movida para outra tabela mantém o seu nome lógico e o seu domínio.

![Dar o foco a uma coluna e arrastar a pega ao lado da sua linha para uma nova posição e depois arrastar a pega de outra coluna para outra tabela](/img/demo-column-move.webp)

Para mover várias colunas de uma só vez, [selecione-as](#selecting-multiple-columns) e arraste a pega ao lado da que tem o foco. Enquanto a coluna com o foco é uma de duas ou mais colunas selecionadas da sua tabela, a pega leva todas; caso contrário, leva apenas a sua própria coluna.  
Não é necessária nenhuma tecla modificadora. Manter `Alt` (Windows/Linux) ou `⌥` (Mac) premida sobre a pega move as colunas tal como um arrasto simples e não duplica nada.

![Selecionar três colunas e depois arrastar a pega ao lado da que tem o foco para outra tabela, com as outras colunas selecionadas a moverem-se com ela](/img/demo-column-multi-move.webp)

Um arrasto que começa na linha de uma coluna, e não na sua pega, move a tabela, tal como um arrasto no seu cabeçalho — consulte [Mover várias tabelas](./table-related-functions.md#moving-multiple-tables). `Alt + drag` (Windows/Linux) ou `⌥ + drag` (Mac) numa linha duplica a tabela — consulte [Duplicar tabelas e notas](./table-related-functions.md#duplicating-tables-and-memos).  
Não é desenhada nenhuma pega com um zoom de `70%` ou inferior, em que as tabelas só mostram o nome, nem num editor só de leitura, pelo que aí não é possível reordenar as colunas.  
Um arrastamento de coluna em curso quando o editor passa a só de leitura termina de imediato: a cópia que seguia o ponteiro e a mão de agarrar desaparecem, e largar não move nenhuma coluna. As linhas que o arrastamento já tinha movido ficam onde ele as moveu.

## Eliminação de colunas {#column-deletion}

Elimina as colunas selecionadas da tabela com o foco. Clicar numa célula seleciona a respetiva coluna, pelo que clicar numa célula e premir `Delete` remove apenas essa coluna.  
Atalhos:

- `Delete` ou `Backspace`. Estas teclas removem as colunas selecionadas enquanto a respetiva tabela é a única coisa selecionada. Sem nenhuma coluna selecionada (com o foco no nome, no [nome lógico](./logical-names.md#name-view) ou no comentário da tabela), com qualquer outra coisa também selecionada ou com um zoom de `70%` ou inferior, em que as tabelas só mostram o nome, removem, em vez disso, toda a seleção — consulte [Eliminação de tabelas e notas](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` ou `Alt + Delete` (Windows/Linux), `⌥ + Backspace` ou `⌥ + Delete` (Mac). Estas combinações removem as colunas selecionadas da tabela com o foco, mesmo enquanto outras tabelas ou notas também estão selecionadas. Não removem nada enquanto uma célula está a ser editada nem com um zoom de `70%` ou inferior.

![Eliminar uma coluna e depois duas colunas selecionadas com Alt + Backspace](/img/demo-column-remove.webp)

O menu de contexto da tabela faz o mesmo. Com a tabela como única coisa selecionada, clique com o botão direito na linha de uma coluna: a última opção do menu indica `Delete column`, ou `Delete columns` quando essa linha é uma de duas ou mais colunas selecionadas.

Enquanto uma célula está a ser editada, `Delete` e `Backspace` apenas apagam texto. Mantidas premidas fora do editor da célula, só removem uma vez.  
Após uma remoção, o foco passa para a coluna restante mais próxima acima da que tinha o foco. Quando não resta nenhuma acima dela, o foco passa para o nome da tabela (na vista `Logical Names`, o nome lógico desenhado no seu lugar), mesmo que restem colunas abaixo, pelo que o `Delete` ou `Backspace` seguinte remove a tabela e não uma coluna.  
As relações e os índices que utilizam uma coluna removida são removidos com ela. Não há confirmação, e toda a remoção é um único passo de anulação.

## Copiar e colar colunas {#copyingpasting-columns}

Funciona como uma área de transferência baseada em tabelas.  
Atalhos: `Ctrl + C` (Windows/Linux) ou `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) ou `⌘ + V` (Mac)

Copiar para uma folha de cálculo, colar a partir de uma e colar na tabela cuja célula de coluna tem o foco utilizam as células que as tabelas mostram, pela ordem em que as mostram — consulte [Opções de vista das tabelas](./table-related-functions.md#table-view-options), [Ajustar a ordem das colunas](./settings.md#adjusting-column-order) e [Vista de nomes](./logical-names.md#name-view). A vista de nomes altera o que algumas dessas células contêm:

- Na vista `Logical Names`, a célula do nome contém o nome lógico, ou nada enquanto este estiver em branco. Enquanto Opções de vista → `Domain` está desativada, a célula do tipo contém o nome do domínio da coluna quando mostra um, e o tipo de dados nos outros casos.
- Na vista `Both Names`, a célula `Logical Name` é copiada e colada na posição que a ordem das colunas lhe atribui.
- Uma célula Domínio visível contém o nome do domínio, ou nada numa coluna que não mostra nenhum domínio.

As colunas copiadas no editor e coladas com um cabeçalho de tabela selecionado, ou nas outras tabelas selecionadas, levam todas as células das colunas copiadas, incluindo as ocultas, como Único e Incremento automático, e os seus nomes lógicos.  
Só mantêm um vínculo a um domínio enquanto este diagrama apresentar esse mesmo domínio, e não apenas um com o mesmo nome, e o domínio ainda tiver o tipo da coluna copiada. Caso contrário, ficam desvinculadas, com o tipo com que foram copiadas. Os seus nomes contam como escritos por si, a menos que um nome colado esteja vazio e o nome lógico derive um — consulte [Derivar nomes físicos](./dictionary.md#deriving-physical-names).  
As marcas de [chave alternativa](./table-related-functions.md#alternate-keys), como `AK1.1`, não são células, pelo que são deixadas de fora ao copiar e colar, mesmo enquanto estão visíveis.

Pode colar do editor para o Excel e do Excel de volta para o editor.  
Os valores das células saem exatamente como foram escritos, pelo que um valor como `<label>` ou `a &amp; b` chega sem alterações a uma folha de cálculo ou a um documento.  
As colunas da folha de cálculo são associadas às células visíveis pela posição, e não pelo nome, pelo que as colunas da folha têm de seguir a ordem dessas células.  
Para as colunas abaixo, qualquer um destes valores é lido como verdadeiro (sem distinguir maiúsculas de minúsculas):

- AutoIncrement: `TRUE`, `1`, `YES`, `Y`
- Unique: `TRUE`, `1`, `YES`, `Y`
- Not Null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

Na saída, o editor escreve `TRUE` ou `FALSE` para AutoIncrement e Unique, e `NOT NULL` ou `NULL` para Not Null.  
As células Único e Incremento automático estão ocultas por predefinição, pelo que `TRUE` e `FALSE` só são escritos e lidos depois de essas células serem mostradas.

![Colar quatro colunas numa folha de cálculo, com os sinalizadores escritos como TRUE/FALSE e NOT NULL/NULL](/img/demo-copy-column-to-sheet.webp)

![Colar três linhas de uma folha de cálculo numa tabela como colunas, com YES, 1 e NOT NULL lidos como verdadeiros](/img/demo-copy-sheet-column.webp)

O local onde uma colagem é aplicada depende do foco:

- Com um cabeçalho de tabela selecionado, as linhas coladas são adicionadas como novas colunas a todas as tabelas selecionadas.
- Quando uma célula de coluna tem o foco, as linhas selecionadas dessa tabela e, depois, as linhas abaixo da última delas são substituídas por ordem, tantas quantas as que foram coladas. As linhas entre seleções separadas são ignoradas. Uma linha substituída recebe os valores colados nas suas células visíveis e mantém as ocultas, e as linhas que sobram são adicionadas como novas colunas. Todas as outras tabelas selecionadas recebem as linhas coladas como novas colunas.

![Copiar duas colunas e colá-las em duas tabelas selecionadas de uma só vez](/img/demo-copy-column-multi.webp)

Uma linha colada escreve os nomes lógicos e os domínios da seguinte forma:

- Um nome lógico, de uma célula `Logical Name` ou da célula do nome na vista `Logical Names`, conta como escrito por inteiro. Enquanto o nome da coluna está vazio ou ainda é derivado, os [dicionários](./dictionary.md#deriving-physical-names) derivam dele o nome físico e vinculam o domínio que o seu termo atribui, a menos que a própria célula Domínio da linha vincule um. Um nome colado pela mesma linha é mantido e conta como escrito por si.
- Uma célula Domínio, ou a célula do tipo na vista `Logical Names` enquanto Opções de vista → `Domain` está desativada, vincula o domínio que o seu texto nomeia, se o diagrama apresentar um. Qualquer outro texto, ou uma célula vazia, não vincula nenhum e desvincula a coluna, mesmo de um domínio do tipo colado. O texto na célula do tipo que não nomeia nenhum domínio é lido como um tipo de dados. As linhas copiadas no editor vinculam antes o domínio com que foram copiadas, e apenas enquanto este diagrama o apresentar com o tipo copiado, tal como acontece com as novas colunas.
- Um domínio vinculado dá à coluna o seu tipo de dados, a menos que a linha cole um tipo próprio. Nesse caso, um domínio de outro tipo não é vinculado, e a coluna fica com o tipo colado.
- Numa linha sem célula Domínio, um tipo colado desvincula a coluna de um domínio de outro tipo, tal como acontece ao escrevê-lo.
- Nenhuma colagem propaga um tipo através da definição [Sincronização do tipo de dados nas relações](./settings.md#relationship-datatype-sync).

## Copiar e colar tabelas e notas {#copyingpasting-tables-and-memos}

Quando nenhuma coluna está selecionada dentro de uma tabela com o foco, os mesmos atalhos copiam as próprias tabelas e notas selecionadas — consulte [Funções relacionadas com tabelas](./table-related-functions.md).

## Chave primária de coluna {#column-primary-key}

Ativa ou desativa a chave primária na coluna com o foco, que é a coluna a que pertence a célula com o foco.  
Quando a coluna com o foco é uma de duas ou mais colunas selecionadas, a alternância aplica-se a todas as colunas selecionadas: se alguma delas não for chave, todas passam a ser chaves, e se todas já o forem, todas deixam de o ser. As colunas fora da seleção não são alteradas.  
Use o menu de contexto da tabela ou o atalho `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac). Quando a alternância abrange duas ou mais colunas, a opção do menu indica `Primary Key on selected columns` em vez de `Primary Key`.  
O ícone de chave na linha serve apenas para apresentação, pelo que clicar nele não define a chave.

Para transformar várias colunas numa chave composta, [selecione-as](#selecting-multiple-columns) e depois prima `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac), ou clique com o botão direito numa das linhas selecionadas e escolha a opção `Primary Key on selected columns`. Cada alternância é um passo de anulação.

![Selecionar duas colunas com Shift + Arrow Down, depois fazer de ambas a chave primária com ⌥ + K e retirá-la a ambas premindo uma segunda vez](/img/demo-column-pk.webp)

## Editores só de leitura {#read-only-editors}

Num editor [`readonly`](../../api/erd-editor-element.md#readonly), nenhuma célula se abre para edição e nenhuma coluna muda.  
Um clique numa célula não dá o foco a nada e retira a seleção que um salto deixou. `Enter` e um duplo clique não abrem nenhum editor nem alternam nenhum interruptor, `Tab` fica para a página, e os atalhos que adicionam, selecionam tudo ou eliminam colunas, a alternância da chave primária e uma colagem não fazem nada.  
Ir para uma coluna a partir do [explorador](./explorer.md#going-to-a-row) ou da [pesquisa rápida](./quick-search.md) dá o foco à sua célula. As teclas de seta passam então o foco de célula em célula, ficando selecionada apenas a coluna que alcançam, uma vez que `Shift` não acrescenta nenhuma coluna aí.  
`Ctrl + C` (Windows/Linux) ou `⌘ + C` (Mac) continua a copiar a coluna selecionada, ou a tabela que um salto selecionou — consulte [Copiar e colar colunas](#copyingpasting-columns).
