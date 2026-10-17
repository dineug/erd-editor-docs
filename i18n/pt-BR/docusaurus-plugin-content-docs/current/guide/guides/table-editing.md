---
sidebar_position: 3
description: Adicionar, selecionar, reordenar e excluir colunas, alternar as opções de coluna e copiar ou colar colunas.
---

# Edição de tabelas

A edição de tabelas oferece, basicamente, uma experiência de edição semelhante à do Excel.  
O modo de edição começa com `Enter` ou com um clique duplo em uma célula.  
`Enter` ou `Escape` o encerra. O que você digita é aplicado à medida que é digitado, então `Escape` mantém o texto em vez de revertê-lo.  
`Escape` deixa a célula em foco e a tabela selecionada, e um segundo `Escape` limpa o foco e a seleção.  
Enquanto um método de entrada ainda está compondo, `Escape` mantém o modo de edição aberto.

![Adição de uma tabela com Alt + N e preenchimento de duas colunas](/img/demo-table-edit.webp)

## Adicionar colunas {#adding-columns}

As colunas são criadas com o atalho `Alt + Enter` (Windows/Linux) ou `⌥ + Enter` (Mac).  
Uma coluna é adicionada a cada tabela selecionada.

## Tecla Tab {#tab-key}

Pressione `Tab` para passar direto ao modo de edição da próxima célula.  
Pressionar `Tab` na última célula cria uma nova coluna.  
Use `Shift + Tab` para ir ao modo de edição da célula anterior.  
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

Um clique com o botão direito na linha de uma coluna decide sobre quais colunas o menu de contexto da tabela atua, seja qual for a tecla modificadora pressionada.  
Em uma linha que já está selecionada, a seleção se mantém e o foco passa para essa linha. Em qualquer outra linha, só essa linha é selecionada. Isso vale em qualquer ponto da linha, inclusive no ícone de chave e em uma marca de [chave alternativa](./table-related-functions.md#alternate-keys).  
Então, para atuar sobre várias colunas pelo menu, como em [Chave primária da coluna](#column-primary-key) ou [Exclusão de colunas](#column-deletion), clique com o botão direito em uma das linhas selecionadas.  
No Mac, `Ctrl + click` também abre o menu, mas conta como um clique simples, então, em uma célula, ele seleciona só essa linha antes de o menu se abrir.

## Reordenar e mover colunas {#rearranging-and-moving-columns}

Funciona com `dragging` e permite mover colunas para outras tabelas.  
As linhas arrastadas acompanham o ponteiro, e as linhas ao redor do ponto em que serão soltas deslizam para o lado para abrir espaço.  
Solte logo abaixo da última linha de uma tabela para mover a coluna para o fim dessa tabela. Uma tabela sem colunas recebe a coluna solta em qualquer ponto dela.

![Arrasto de uma coluna para uma nova posição e, depois, para outra tabela](/img/demo-column-move.webp)

Permite mover várias colunas com `Ctrl + drag` (Windows/Linux) ou `⌘ + drag` (Mac).

![Seleção de três colunas e movimentação delas para outra tabela com Ctrl/⌘ + drag](/img/demo-column-multi-move.webp)

## Exclusão de colunas {#column-deletion}

Exclui as colunas selecionadas da tabela em foco. Clicar em uma célula seleciona a coluna dela, então clicar em uma célula e pressionar `Delete` remove essa única coluna.  
Atalhos:

- `Delete` ou `Backspace` (`⌫` no Mac). Essas teclas removem as colunas selecionadas enquanto a tabela delas é a única coisa selecionada. Sem nenhuma coluna selecionada (com o foco no nome ou no comentário da tabela), com qualquer outra coisa também selecionada ou com zoom de `70%` ou menos, em que as tabelas mostram apenas o nome, elas removem toda a seleção em vez disso — consulte [Exclusão de tabelas e notas](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` ou `Alt + Delete` (Windows/Linux), `⌥ + ⌫` ou `⌥ + Delete` (Mac). Essas combinações removem as colunas selecionadas da tabela em foco mesmo enquanto outras tabelas ou notas também estão selecionadas. Elas não removem nada enquanto uma célula está sendo editada nem em `70%` ou menos.

![Exclusão de uma coluna e, depois, de duas colunas selecionadas com Alt + Backspace](/img/demo-column-remove.webp)

O menu de contexto da tabela faz o mesmo. Com a tabela como única coisa selecionada, clique com o botão direito na linha de uma coluna: o último item do menu passa a ser `Delete column`, ou `Delete columns` quando essa linha é uma de duas ou mais colunas selecionadas.

Enquanto uma célula está sendo editada, `Delete` e `Backspace` só apagam texto. Mantidas pressionadas fora do editor de célula, elas removem só uma vez.  
Após uma remoção, o foco passa para a coluna restante mais próxima acima da que estava em foco. Quando não resta nenhuma acima dela, o foco passa para o nome da tabela, mesmo que restem colunas abaixo, então o próximo `Delete` ou `Backspace` remove a tabela, e não uma coluna.  
Os relacionamentos e índices que usam uma coluna removida são removidos com ela. Não há confirmação, e toda a remoção é uma única etapa de desfazer.

## Copiar e colar colunas {#copyingpasting-columns}

Funciona como uma área de transferência baseada em tabelas.  
Atalhos: `Ctrl + C` (Windows/Linux) ou `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) ou `⌘ + V` (Mac)

Copiar para uma planilha, colar a partir de uma e colar na tabela cuja célula de coluna está em foco usam as células que as tabelas mostram, na ordem em que as mostram — consulte [Opções de exibição da tabela](./table-related-functions.md#table-view-options) e [Ajustar a ordem das colunas](./settings.md#adjusting-column-order).  
Colunas copiadas no editor e coladas com um cabeçalho de tabela selecionado, ou nas outras tabelas selecionadas, levam todas as células das colunas copiadas, inclusive as ocultas, como Único e Incremento automático.  
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

## Copiar e colar tabelas e notas {#copyingpasting-tables-and-memos}

Quando nenhuma coluna está selecionada dentro de uma tabela em foco, os mesmos atalhos copiam as próprias tabelas e notas selecionadas — consulte [Funções relacionadas a tabelas](./table-related-functions.md).

## Chave primária da coluna {#column-primary-key}

Alterna a chave primária na coluna em foco, que é a coluna à qual pertence a célula em foco.  
Quando a coluna em foco é uma de duas ou mais colunas selecionadas, a alternância se aplica a todas as colunas selecionadas: se alguma delas não for chave, todas se tornam chaves e, se todas já forem, todas deixam de ser chaves. As colunas fora da seleção não são alteradas.  
Use o menu de contexto da tabela ou o atalho `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac). Quando a alternância abrange duas ou mais colunas, o item do menu passa a ser `Primary Key on selected columns` em vez de `Primary Key`.  
O ícone de chave na linha serve apenas para exibição, então clicar nele não define a chave.

Para transformar várias colunas em uma única chave composta, [selecione-as](#selecting-multiple-columns) e depois pressione `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac), ou clique com o botão direito em uma das linhas selecionadas e escolha `Primary Key on selected columns`. Cada alternância é uma única etapa de desfazer.

![Seleção de duas colunas com Shift + Arrow Down e, depois, transformação das duas em chave primária com ⌥ + K e remoção da chave das duas com um segundo pressionamento](/img/demo-column-pk.webp)
