---
sidebar_position: 3
description: Adicionar, selecionar, reordenar e eliminar colunas, alternar as opções das colunas e copiar ou colar colunas.
---

# Edição de tabelas

A edição de tabelas oferece, basicamente, uma experiência de edição semelhante à do Excel.  
O modo de edição começa com `Enter` ou com um duplo clique numa célula.  
`Enter` ou `Escape` termina-o. O que escreve é aplicado à medida que o escreve, pelo que `Escape` mantém o texto em vez de o reverter.  
`Escape` deixa a célula com o foco e a tabela selecionada, e um segundo `Escape` retira o foco e limpa a seleção.  
Enquanto um método de entrada ainda está a compor, `Escape` deixa o modo de edição aberto.

![Adicionar uma tabela com Alt + N e preencher duas colunas](/img/demo-table-edit.webp)

## Adicionar colunas {#adding-columns}

São criadas com o atalho `Alt + Enter` (Windows/Linux) ou `⌥ + Enter` (Mac).  
É adicionada uma coluna a cada tabela selecionada.

## Tecla Tab {#tab-key}

Prima `Tab` para passar diretamente ao modo de edição da célula seguinte.  
Premir `Tab` na última célula cria uma nova coluna.  
Use `Shift + Tab` para ir para o modo de edição da célula anterior.  
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

Um clique com o botão direito na linha de uma coluna determina as colunas sobre as quais atua o menu de contexto da tabela, seja qual for a tecla modificadora premida.  
Numa linha que já está selecionada, a seleção mantém-se e o foco passa para essa linha. Em qualquer outra linha, só essa linha fica selecionada. Isto aplica-se a qualquer ponto da linha, incluindo o ícone de chave e uma marca de [chave alternativa](./table-related-functions.md#alternate-keys).  
Assim, para atuar sobre várias colunas a partir do menu, como em [Chave primária de coluna](#column-primary-key) ou [Eliminação de colunas](#column-deletion), clique com o botão direito numa das linhas selecionadas.  
Num Mac, `Ctrl + click` também abre o menu, mas conta como um clique simples, pelo que, numa célula, seleciona apenas essa linha antes de o menu se abrir.

## Reordenar e mover colunas {#rearranging-and-moving-columns}

Funciona com `dragging` e permite mover colunas para outras tabelas.  
As linhas arrastadas seguem o ponteiro, e as linhas em redor do ponto onde se larga deslizam para o lado para abrir espaço.  
Largue logo abaixo da última linha de uma tabela para mover a coluna para o fim dessa tabela. Uma tabela sem colunas aceita a coluna largada em qualquer ponto da tabela.

![Arrastar uma coluna para uma nova posição e depois para outra tabela](/img/demo-column-move.webp)

Permite mover várias colunas com `Ctrl + drag` (Windows/Linux) ou `⌘ + drag` (Mac).

![Selecionar três colunas e movê-las para outra tabela com Ctrl/⌘ + drag](/img/demo-column-multi-move.webp)

## Eliminação de colunas {#column-deletion}

Elimina as colunas selecionadas da tabela com o foco. Clicar numa célula seleciona a respetiva coluna, pelo que clicar numa célula e premir `Delete` remove apenas essa coluna.  
Atalhos:

- `Delete` ou `Backspace` (`⌫` num Mac). Estas teclas removem as colunas selecionadas enquanto a respetiva tabela é a única coisa selecionada. Sem nenhuma coluna selecionada (com o foco no nome ou no comentário da tabela), com qualquer outra coisa também selecionada ou com um zoom de `70%` ou inferior, em que as tabelas só mostram o nome, removem, em vez disso, toda a seleção — consulte [Eliminação de tabelas e notas](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` ou `Alt + Delete` (Windows/Linux), `⌥ + ⌫` ou `⌥ + Delete` (Mac). Estas combinações removem as colunas selecionadas da tabela com o foco, mesmo enquanto outras tabelas ou notas também estão selecionadas. Não removem nada enquanto uma célula está a ser editada nem com um zoom de `70%` ou inferior.

![Eliminar uma coluna e depois duas colunas selecionadas com Alt + Backspace](/img/demo-column-remove.webp)

O menu de contexto da tabela faz o mesmo. Com a tabela como única coisa selecionada, clique com o botão direito na linha de uma coluna: a última opção do menu indica `Delete column`, ou `Delete columns` quando essa linha é uma de duas ou mais colunas selecionadas.

Enquanto uma célula está a ser editada, `Delete` e `Backspace` apenas apagam texto. Mantidas premidas fora do editor da célula, só removem uma vez.  
Após uma remoção, o foco passa para a coluna restante mais próxima acima da que tinha o foco. Quando não resta nenhuma acima dela, o foco passa para o nome da tabela, mesmo que restem colunas abaixo, pelo que o `Delete` ou `Backspace` seguinte remove a tabela e não uma coluna.  
As relações e os índices que utilizam uma coluna removida são removidos com ela. Não há confirmação, e toda a remoção é um único passo de anulação.

## Copiar e colar colunas {#copyingpasting-columns}

Funciona como uma área de transferência baseada em tabelas.  
Atalhos: `Ctrl + C` (Windows/Linux) ou `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) ou `⌘ + V` (Mac)

Copiar para uma folha de cálculo, colar a partir de uma e colar na tabela cuja célula de coluna tem o foco utilizam as células que as tabelas mostram, pela ordem em que as mostram — consulte [Opções de vista das tabelas](./table-related-functions.md#table-view-options) e [Ajustar a ordem das colunas](./settings.md#adjusting-column-order).  
As colunas copiadas no editor e coladas com um cabeçalho de tabela selecionado, ou nas outras tabelas selecionadas, levam todas as células das colunas copiadas, incluindo as ocultas, como Único e Incremento automático.  
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

## Copiar e colar tabelas e notas {#copyingpasting-tables-and-memos}

Quando nenhuma coluna está selecionada dentro de uma tabela com o foco, os mesmos atalhos copiam as próprias tabelas e notas selecionadas — consulte [Funções relacionadas com tabelas](./table-related-functions.md).

## Chave primária de coluna {#column-primary-key}

Ativa ou desativa a chave primária na coluna com o foco, que é a coluna a que pertence a célula com o foco.  
Quando a coluna com o foco é uma de duas ou mais colunas selecionadas, a alternância aplica-se a todas as colunas selecionadas: se alguma delas não for chave, todas passam a ser chaves, e se todas já o forem, todas deixam de o ser. As colunas fora da seleção não são alteradas.  
Use o menu de contexto da tabela ou o atalho `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac). Quando a alternância abrange duas ou mais colunas, a opção do menu indica `Primary Key on selected columns` em vez de `Primary Key`.  
O ícone de chave na linha serve apenas para apresentação, pelo que clicar nele não define a chave.

Para transformar várias colunas numa chave composta, [selecione-as](#selecting-multiple-columns) e depois prima `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac), ou clique com o botão direito numa das linhas selecionadas e escolha a opção `Primary Key on selected columns`. Cada alternância é um passo de anulação.

![Selecionar duas colunas com Shift + Arrow Down, depois fazer de ambas a chave primária com ⌥ + K e retirá-la a ambas premindo uma segunda vez](/img/demo-column-pk.webp)
