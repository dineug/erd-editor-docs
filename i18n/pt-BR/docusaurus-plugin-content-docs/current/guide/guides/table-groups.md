---
sidebar_position: 5
description: Reunir tabelas relacionadas em uma caixa com nome e cor desenhada atrás delas; criar, nomear, colorir, mover, redimensionar e remover grupos, ir até eles pelo explorador, alterar quais tabelas eles contêm, ocultá-los e preservá-los no layout automático, no Esquema SQL e no DBML.
---

# Grupos de tabelas

Um grupo de tabelas é uma caixa com nome e cor, desenhada atrás de tabelas relacionadas no canvas ERD, para mostrar quais tabelas formam um conjunto.  
Uma tabela fica em no máximo um grupo. Os grupos são salvos com o diagrama, junto com o grupo em que cada tabela está.

A caixa tem uma barra de título na parte superior, com um ícone de grupo, o nome do grupo em negrito e, enquanto o ponteiro está sobre o grupo, um `x` que o remove — consulte [Remover um grupo](#removing-a-group). Um grupo sem nome mostra `unnamed`, e um nome longo demais para a barra é cortado com `…`.  
A caixa sempre contém suas tabelas: ela mantém o tamanho que recebeu, mas se estende para manter cada tabela dentro dela, com `24px` de espaço ao redor e a barra de título acima. Uma tabela que cresce estende a caixa junto, e o mesmo acontece com uma tabela solta perto de uma borda com o centro ainda dentro da caixa. Enquanto tabelas estão sendo arrastadas, a caixa não cresce nem encolhe. A extensão não é salva: a caixa volta ao próprio tamanho assim que a tabela deixa de precisar do espaço.

Os grupos são desenhados atrás de todo o resto no canvas: tabelas, notas e linhas de relacionamento.  
Onde grupos se sobrepõem, o último pressionado ou adicionado é desenhado na frente, e o corpo de um grupo nunca cobre a barra de título de outro grupo. A ordem não é salva, então um diagrama reaberto empilha seus grupos na ordem em que foram adicionados.  
Os grupos aparecem no canvas ERD, no minimapa e em uma imagem exportada, e o [explorador](./explorer.md) os lista — consulte [Ir para um grupo](#going-to-a-group). A aba [Visualização](./visualization.md) não desenha grupos nem cores de grupo em nenhum dos modos.

Um agente de codificação também pode criar e alterar grupos e ler o DDL de grupos escolhidos — consulte [Grupos de tabelas](../../mcp/tools.md#table-groups) nas ferramentas MCP.

![Preparação do desenho de um grupo com ⌥ + G, desenho sobre orders e payments, nomeação como Billing, inclusão da tabela order_items ao soltá-la nele e, depois, movimentação e redimensionamento do grupo](/img/demo-table-group.webp)

## Criar um grupo {#creating-a-group}

Há duas maneiras de criar um grupo, cada uma com um atalho. Nenhuma delas é oferecida em um editor somente leitura nem enquanto os grupos estão [ocultos](#hiding-groups), e os atalhos, nesse caso, não fazem nada.  
Como os outros atalhos do canvas, eles funcionam apenas na aba ERD e ficam suspensos enquanto uma célula, uma nota ou o nome de um grupo está sendo editado — consulte [Atalhos](./settings.md#shortcuts).

### Desenhar um grupo {#drawing-a-group}

Clique no botão `New Table Group` na [barra de ferramentas do canvas](./table-related-functions.md#canvas-toolbar), pressione `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac) ou escolha `New Table Group` no menu de contexto do canvas, onde ele vem depois de `New Table` e `New Memo`, ou na [pesquisa rápida](./quick-search.md) da aba ERD. Depois, arraste uma caixa sobre o canvas.  
O botão e o atalho alternam o desenho, então pressionar qualquer um deles enquanto o desenho está preparado o encerra, não importa como tenha começado; o item do menu de contexto e a pesquisa rápida apenas o iniciam. Iniciá-lo desativa a ferramenta mão e cancela um relacionamento que esteja sendo desenhado.  
Enquanto o desenho está preparado, o cursor é uma cruz, e um pressionamento inicia a caixa onde quer que ocorra, mesmo sobre uma tabela, em vez de selecionar ou mover o que está embaixo. A barra de ferramentas do canvas então marca o botão `New Table Group`, e não a ferramenta mão nem o ponteiro.

Soltar adiciona um grupo nessa caixa, nunca menor que `160px` de largura e `100px` de altura, incluindo a barra de título, por mais curto que seja o arrasto. Um clique sem arrastar adiciona um grupo de `480px` de largura e `320px` de altura com o canto superior esquerdo no ponto do clique.  
Toda tabela sem grupo cujo centro fique dentro da nova caixa entra no grupo. Uma tabela que já está em outro grupo permanece nele.

O botão do meio do mouse continua deslocando a área visível do canvas e mantém o desenho preparado. Estas ações encerram o desenho sem adicionar um grupo:

- `Escape`, ou `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac), antes do pressionamento ou durante o arrasto. Antes do pressionamento, essas teclas deixam a seleção como está; o pressionamento que inicia a caixa já a limpou.
- Um clique com o botão direito, que limpa a seleção. Nenhum menu de contexto é aberto.
- Mudar para a ferramenta mão com `Space` ou pela barra de ferramentas do canvas, clicar no ponteiro ou no botão `New Table Group` da barra de ferramentas ou iniciar um relacionamento.
- Mudar para outra aba, ocultar os grupos ou o editor passar a ser somente leitura.

### Agrupar tabelas selecionadas {#grouping-selected-tables}

Selecione uma ou mais tabelas e pressione `T` e depois `G`, ou escolha `Group selected tables` no menu de contexto de uma tabela ou `Group Selected Tables` na pesquisa rápida, que o lista enquanto há uma tabela selecionada.  
O novo grupo é desenhado ao redor das tabelas selecionadas, com `24px` de espaço em todos os lados e a barra de título acima. Toda tabela selecionada entra nele, saindo de qualquer grupo em que estivesse, e o grupo que ela deixou permanece, mesmo que agora esteja vazio. As notas na seleção são ignoradas.

`T` e depois `G` são dois pressionamentos sem tecla modificadora, com `G` em até um segundo após `T`. Sem nenhuma tabela selecionada, a sequência não faz nada, e em um campo de texto, como o campo Localizar do explorador, ela digita as duas letras.

![Agrupamento de categories e products com T e depois G, nomeação do grupo como Catalog e, depois, aplicação da cor violeta pelo menu do grupo, para que os dois cabeçalhos recebam a cor](/img/demo-table-group-selected.webp)

De qualquer maneira, o novo grupo não tem nome nem cor. Ele é selecionado sozinho, e seu editor de nome se abre sobre a barra de título para que você possa digitar um nome imediatamente — consulte [Nomear um grupo](#naming-a-group).  
O grupo e as tabelas que ele recebe são uma única etapa de desfazer, e o nome que você digita é outra.

## Nomear um grupo {#naming-a-group}

O nome de um grupo é editado em um campo que se abre sobre a barra de título. Ele se abre sozinho quando um grupo é criado, com um clique duplo na barra de título e pelo item `Rename` no menu de contexto do grupo.  
`Enter`, ou um clique em outro lugar, salva o nome. `Escape` fecha o campo sem alterar o nome e deixa o grupo selecionado, e um segundo `Escape` limpa a seleção.  
Um nome alterado é uma única etapa de desfazer; salvar o nome sem alterá-lo não registra nada. Um nome vazio ou só com espaços aparece como `unnamed`.  
Enquanto o campo está aberto, os atalhos do canvas ficam suspensos, e os atalhos da pesquisa rápida e de `Toggle Explorer` não fazem nada, como durante a edição de uma célula da tabela.

[Localizar e substituir](./find-and-replace.md#what-it-searches) pesquisa nomes de grupos em `Table group names` enquanto os grupos estão visíveis, e seus botões `Replace` e `Replace All` renomeiam grupos — consulte [Substituir](./find-and-replace.md#replacing). A [pesquisa rápida](./quick-search.md#searching-the-diagram) não pesquisa nomes de grupos.

## Colorir um grupo {#coloring-a-group}

Escolha `Color` no menu de contexto do grupo para abrir o seletor de cores com a cor do grupo.  
Como acontece com tabelas e notas, o seletor colore todas as tabelas, notas e grupos selecionados, e `Remove color` no menu, ou `No color` no seletor, remove a cor de todos eles — consulte [Cores de tabelas e notas](./table-related-functions.md#table-and-memo-color-specification). A cor de um grupo também é oferecida em `Document colors` no seletor.

Um grupo colorido desenha a barra de título e o contorno nessa cor e o corpo em um tom claro dela. Um grupo sem cor usa os cinzas neutros do tema.  
Toda tabela em um grupo colorido exibe a cor do grupo em todo o cabeçalho e mantém a própria cor na borda esquerda, de modo que as duas aparecem.  
O texto e os botões desse cabeçalho ficam brancos, ou pretos sobre uma cor clara em que o preto fica muito mais legível, assim como o nome, o ícone e o `x` na barra de título do grupo. Entre as amostras predefinidas do seletor, Orange, Amber, Yellow e Lime usam preto, e as demais usam branco.  
Uma tabela mantém o próprio cabeçalho enquanto seu grupo não tem cor, enquanto os grupos estão ocultos, com zoom de `70%` ou menos, em que as tabelas se reduzem ao nome, e na aba Visualização.

Uma mudança de cor é registrada no [histórico de desfazer](./undo-redo.md#one-gesture-one-step), como acontece com tabelas e notas.

## Selecionar grupos {#selecting-groups}

Clique na barra de título de um grupo para selecionar só esse grupo, ou use `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac) para adicioná-lo à seleção.  
Pressionar a barra de título de um grupo que já está selecionado mantém toda a seleção, então um arrasto em seguida move a seleção inteira.  
Pressionar a barra de título, ou clicar com o botão direito no grupo, traz o grupo para a frente dos outros grupos e suas tabelas para a frente de todas as outras tabelas e notas.

Para o botão esquerdo do mouse, o corpo, a área abaixo da barra de título, é o próprio canvas: arrastá-lo desloca a área visível, `Ctrl + drag` (Windows/Linux) ou `⌘ + drag` (Mac) desenha um retângulo de seleção e um clique limpa a seleção. As tabelas, notas e linhas de relacionamento sobre o corpo respondem ao ponteiro normalmente.

Um retângulo de seleção só inclui um grupo quando envolve a caixa inteira do grupo, então um retângulo desenhado dentro de um grupo seleciona tabelas sem o grupo — consulte [Seleção múltipla](./table-related-functions.md#multiple-selection).  
`Ctrl + A` (Windows/Linux) ou `⌘ + A` (Mac) nunca seleciona um grupo.

`Select tables` no menu de contexto do grupo substitui a seleção pelas tabelas do grupo, deixando o próprio grupo de fora, de modo que o próximo comando alcança só as tabelas.  
Use-o antes de comandos que atuam só em tabelas, como copiar ou [focar em tabelas](./table-related-functions.md#focusing-on-tables), que ignoram um grupo selecionado.

O contorno de um grupo selecionado passa a ter a cor de seleção. Em uma [sessão colaborativa](../../api/advanced/collaborative-editing.md), um grupo que outro participante seleciona fica circundado na cor desse participante.

## Ir para um grupo {#going-to-a-group}

O [explorador](./explorer.md#the-tree) lista os grupos na pasta `Table Groups`, por nome, cada um com suas tabelas abaixo. A pesquisa rápida não lista grupos.

Escolher a linha de um grupo no explorador, uma correspondência de [Localizar e substituir](./find-and-replace.md#going-to-a-match) no nome de um grupo ou a linha de um grupo na lista do [visualizador de diferenças](./table-related-functions.md#the-change-tree) leva a esse grupo.  
Isso traz a caixa do grupo para a área visível, tomando a barra de título como referência quando a caixa é mais alta que o canvas — consulte [Onde um salto termina](./table-related-functions.md#where-a-jump-lands). Em seguida, seleciona só o grupo e o traz para a frente com suas tabelas, como acontece ao pressionar a barra de título.  
Enquanto os grupos estão [ocultos](#hiding-groups), ou depois que o grupo foi removido, ir para ele não faz nada.  
No visualizador de diferenças, cada lado só vai para o grupo quando o próprio documento o contém e o mostra — consulte [Ir para uma alteração](./table-related-functions.md#going-to-a-change).

## Mover e redimensionar um grupo {#moving-and-resizing-a-group}

Arraste um grupo pela barra de título para movê-lo com todas as suas tabelas.  
Se o grupo faz parte de uma seleção maior, toda a seleção se move com ele, e uma tabela que está selecionada e também no grupo se move uma única vez.  
O arrasto só começa depois que o ponteiro se move um pouco, então um clique ou clique duplo na barra de título continua sendo um clique. `Alt + drag` em uma barra de título move o grupo como um arrasto comum; um grupo nunca é duplicado.  
A movimentação, com todas as tabelas que ela leva, é uma única etapa de desfazer.

Arrastar uma tabela sozinha move apenas essa tabela e pode colocá-la em um grupo ou tirá-la dele — consulte [Adicionar e remover tabelas](#adding-and-removing-tables).

Todo grupo tem alças de redimensionamento nas quatro bordas e nos quatro cantos, selecionado ou não, como uma nota.  
Arraste uma delas com o botão esquerdo do mouse: a caixa segue o ponteiro, e o novo tamanho é salvo quando você solta, como uma única etapa de desfazer.  
Um grupo não pode ficar menor que `160px` por `100px`, nem menor que suas tabelas com seus `24px` de espaço e a barra de título. A borda para ali, por mais longe que o ponteiro vá.

## Adicionar e remover tabelas {#adding-and-removing-tables}

Uma tabela entra em um grupo ou sai dele conforme o lugar onde você a solta.  
Quando você arrasta tabelas e solta, cada tabela arrastada que não é levada por um grupo selecionado é avaliada pelo centro. Ela entra no grupo mais acima cuja caixa contém seu centro, ou sai do grupo se o centro não está na caixa de nenhum grupo. O grupo mais acima é o que está desenhado na frente.  
Um grupo que o arrasto deixa no lugar mantém a caixa que tinha quando o arrasto começou, então uma tabela deslocada um pouco dentro do próprio grupo permanece nele e, para sair, precisa ser arrastada até que o centro fique fora dessa caixa.  
Enquanto você arrasta, cada grupo que receberia uma tabela ao soltar fica contornado.

Quando você solta em até cerca de `200ms` após o último movimento, a mudança de grupo faz parte da etapa de desfazer do arrasto, então um único desfazer traz as tabelas de volta para onde estavam e para os grupos em que estavam. Após uma pausa maior antes de soltar, a mudança de grupo é uma etapa própria — consulte [Um gesto, uma etapa](./undo-redo.md#one-gesture-one-step).  
Um clique, ou um arrasto de poucos pixels, não muda nenhum grupo, e nada muda de grupo enquanto os grupos estão ocultos.

As outras maneiras de alterar quais tabelas um grupo contém:

- `Remove from group` no menu de contexto de uma tabela tira todas as tabelas selecionadas do respectivo grupo. Ele aparece enquanto uma tabela selecionada está em um grupo, mesmo enquanto os grupos estão ocultos, e é uma única etapa de desfazer.
- `Group selected tables` move as tabelas selecionadas para um novo grupo — consulte [Agrupar tabelas selecionadas](#grouping-selected-tables).
- Remover um grupo deixa suas tabelas sem grupo.

Uma tabela colada ou duplicada com `Alt` fica sem grupo, mesmo quando cai dentro da caixa de um grupo. Arrastá-la depois aplica a regra de soltar.

## Remover um grupo {#removing-a-group}

Remover um grupo nunca remove suas tabelas: elas ficam onde estão, sem grupo.

- O `x` no fim da barra de título, que aparece enquanto o ponteiro está sobre o grupo, remove só esse grupo.
- `Delete` no menu de contexto do grupo remove o grupo. Quando o grupo é um de vários itens selecionados, o item do menu passa a ser `Delete selected` e remove tudo o que está selecionado: tabelas, notas e grupos.
- Com grupos selecionados, `Delete` ou `Backspace` remove os grupos selecionados junto com as tabelas e notas que estiverem selecionadas, assim como `Ctrl + Backspace` e `Ctrl + Delete` (Windows/Linux) ou `⌘ + Backspace` e `⌘ + Delete` (Mac) — consulte [Exclusão de tabelas e notas](./table-related-functions.md#table-and-memo-deletion).

Cada remoção é uma única etapa de desfazer, que traz o grupo de volta com suas tabelas dentro.

## O menu do grupo {#the-group-menu}

Clique com o botão direito na barra de título, no corpo ou na borda de um grupo para abrir o menu dele. No Mac, `Ctrl + click` também o abre, assim como um toque longo em uma tela sensível ao toque.  
O clique com o botão direito primeiro seleciona o grupo, sozinho, a menos que ele já faça parte da seleção, então `Color` e `Delete selected` só alcançam o resto da seleção quando o grupo estava nela.

- `Select tables`: seleciona só as tabelas do grupo — consulte [Selecionar grupos](#selecting-groups).
- `Rename`: abre o editor de nome — consulte [Nomear um grupo](#naming-a-group).
- `Color`: abre o seletor de cores — consulte [Colorir um grupo](#coloring-a-group).
- `Remove color`: aparece enquanto algo selecionado tem cor.
- `Delete`, ou `Delete selected` quando o grupo é um de vários itens selecionados, com a tecla `Delete` mostrada à direita — consulte [Remover um grupo](#removing-a-group).

O menu de contexto de uma tabela ganha `Group selected tables` e `Remove from group` depois de `Color` e `Remove color`, antes do item Delete, e o menu de contexto do canvas ganha `New Table Group`.  
`Group selected tables` mostra suas teclas, `T` e depois `G`, à direita, e `New Table Group` mostra `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac).

## Ocultar grupos {#hiding-groups}

`View Option` → `Table Groups` no menu de contexto do canvas mostra ou oculta todos os grupos. Ele vem marcado por padrão — consulte [Opções de exibição da tabela](./table-related-functions.md#table-view-options).  
Com ele desmarcado, as caixas dos grupos e as cores de grupo nos cabeçalhos das tabelas desaparecem do canvas, do minimapa e das imagens exportadas, e as barras de rolagem e o minimapa deixam de reservar espaço para os grupos. Nada se move nem muda de tamanho, e toda tabela permanece em seu grupo.  
Ocultar os grupos os retira da seleção, encerra um desenho de `New Table Group` e fecha um editor de nome aberto.

Enquanto os grupos estão ocultos:

- `New Table Group` e `Group selected tables` não são oferecidos nos menus, nem `New Table Group` e `Group Selected Tables` na pesquisa rápida, e a barra de ferramentas do canvas omite o botão `New Table Group`. `Remove from group` continua sendo oferecido.
- `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac) e a sequência `T` e depois `G` não fazem nada.
- Arrastar tabelas não muda nenhum grupo, e um retângulo de seleção não inclui nenhum grupo.
- O explorador omite a pasta `Table Groups`, e Localizar e substituir não localiza nem substitui nomes de grupos, mesmo com `Table group names` ativado.
- O [layout automático](#auto-layout) continua mantendo juntas as tabelas de cada grupo, a aba Esquema SQL continua oferecendo os [grupos para escolher](#schema-sql-by-group), o DBML continua escrevendo os grupos e [Importar e adicionar](./file-import-export.md#import-and-add) continua colocando o conteúdo importado abaixo das caixas ocultas.

A escolha é salva no documento e registrada no [histórico de desfazer](./undo-redo.md#what-the-history-records), como os outros botões de alternância do menu Opções de exibição.

## Layout automático {#auto-layout}

Todo [layout automático](./table-related-functions.md#auto-layout) mantém juntas as tabelas de cada grupo, estejam os grupos visíveis ou não.

- `Force` move cada grupo com suas tabelas como uma única caixa, com as tabelas mantendo suas posições dentro dela, e mantém a caixa de cada grupo a pelo menos `100px` de outros grupos e de tabelas sem grupo. A pré-visualização mostra cada grupo no lugar para onde ele vai.
- `Flow`, `Tree - vertical` e `Tree - horizontal` organizam as tabelas de cada grupo dentro do grupo e posicionam os grupos de acordo com os relacionamentos entre eles, com as tabelas sem grupo organizadas ao redor.

Depois, cada grupo que contém tabelas é ajustado a elas: sua caixa passa a corresponder aos limites delas, mais `24px` de espaço e a barra de título. Um grupo sem tabelas mantém a posição e o tamanho.  
As tabelas e os grupos são posicionados em uma única etapa de desfazer.

Uma importação de DBML ajusta cada grupo ao redor de suas tabelas da mesma forma, onde quer que elas sejam posicionadas — consulte [DBML](./file-import-export.md#dbml).

## Esquema SQL por grupo {#schema-sql-by-group}

A aba [Esquema SQL](./schema-sql.md) pode escrever só as tabelas de grupos escolhidos.  
Enquanto o documento contém um grupo, visível ou oculto, o painel de opções da aba mostra uma linha `Tables` abaixo de `This window only`, com uma caixa de seleção para `All`, uma para cada grupo e uma para `No group`, as tabelas sem grupo — consulte [Tabelas](./schema-sql.md#tables).  
A escolha pertence à janela do editor e não é salva no documento.

## Importar, exportar e copiar {#import-export-and-copying}

- O DBML preserva os grupos nos dois sentidos. Uma importação de DBML transforma cada bloco `TableGroup` em um grupo — consulte [DBML](./file-import-export.md#dbml) — e o destino `DBML` do Gerador de código escreve um bloco `TableGroup` para cada grupo que contém uma tabela — consulte [Gerador de código](./code-generator.md#language).
- Um arquivo JSON mantém seus grupos. Nenhum outro formato os preserva: as importações de SQL, GraphQL e AML não trazem nenhum, e o Esquema SQL e os outros destinos do Gerador de código não escrevem nenhum.
- [Importar e adicionar](./file-import-export.md#import-and-add) traz os grupos de um arquivo como novos grupos que contêm suas tabelas e os seleciona junto com as novas tabelas enquanto os grupos estão visíveis, então arrastar o bloco adicionado leva seus grupos junto.
- Uma [imagem exportada](./file-import-export.md#image) desenha os grupos visíveis atrás das tabelas, com as cores de grupo nos cabeçalhos delas.
- Copiar e colar, ou duplicar com `Alt`, nunca copia um grupo — consulte [Copiar e colar tabelas e notas](./table-related-functions.md#copyingpasting-tables-and-memos) e [Adicionar e remover tabelas](#adding-and-removing-tables).

## Editores somente leitura {#read-only-editors}

Em um editor [`readonly`](../../api/erd-editor-element.md#readonly), os grupos são desenhados e listados no explorador normalmente, e é possível selecioná-los e ir até eles, mas não alterá-los:

- Pressionar uma barra de título seleciona o grupo e não move nada. Não há alças de redimensionamento nem `x`.
- Um clique duplo na barra de título não abre o editor de nome, e o menu do grupo contém só `Select tables`.
- O menu do canvas não tem `New Table Group`, o menu da tabela não tem `Group selected tables` nem `Remove from group` e a pesquisa rápida não lista nenhum dos dois comandos de grupo. Um desenho de `New Table Group` termina quando o editor passa a ser somente leitura.
- A [barra de ferramentas do canvas](./table-related-functions.md#canvas-toolbar) não mostra nenhum dos botões de adicionar, incluindo `New Table Group`, e `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac) e a sequência `T` e depois `G` não fazem nada.
- A opção de exibição `Table Groups` não altera nada, como todas as opções do menu Opções de exibição.
- A escolha `Tables` da aba Esquema SQL continua funcionando.
