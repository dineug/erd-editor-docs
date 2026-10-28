---
sidebar_position: 6
description: Agrupar tabelas relacionadas numa caixa com nome e cor atrás delas; criar grupos, dar-lhes nome e cor, movê-los, redimensioná-los e removê-los, ir para eles a partir do explorador, mudar as tabelas que contêm, ocultá-los e mantê-los na disposição automática, no Esquema SQL e no DBML.
---

# Grupos de tabelas

Um grupo de tabelas é uma caixa com nome e cor, desenhada atrás de tabelas relacionadas na tela ERD, para mostrar que tabelas pertencem ao mesmo conjunto.  
Uma tabela pertence, no máximo, a um grupo. Os grupos são guardados com o diagrama, juntamente com o grupo a que cada tabela pertence.

A caixa tem uma barra de título ao longo do topo, com um ícone de grupo, o nome do grupo a negrito e, enquanto o ponteiro está sobre o grupo, um `x` que o remove — consulte [Remover um grupo](#removing-a-group). Um grupo sem nome mostra `unnamed`, e um nome demasiado longo para a barra é cortado com `…`.  
A caixa contém sempre as suas tabelas: mantém o tamanho que lhe foi dado, mas estica-se para manter cada tabela no interior, com `24px` de folga à volta e a barra de título por cima. Uma tabela que cresce estica a caixa consigo, e o mesmo acontece com uma tabela largada perto de um bordo com o centro ainda dentro da caixa. Enquanto as tabelas estão a ser arrastadas, a caixa não cresce nem encolhe. Esse alongamento não é guardado: a caixa volta ao seu próprio tamanho assim que a tabela deixa de precisar do espaço.

Os grupos são desenhados atrás de tudo o resto na tela: tabelas, notas e linhas de relação.  
Onde os grupos se sobrepõem, o último a ser premido ou adicionado é desenhado à frente, e o corpo de um grupo nunca cobre a barra de título de outro grupo. A ordem não é guardada, pelo que um diagrama reaberto empilha os grupos pela ordem em que foram adicionados.  
Os grupos aparecem na tela ERD, no minimapa e numa imagem exportada, e o [explorador](./explorer.md) lista-os — consulte [Ir para um grupo](#going-to-a-group). O separador [Visualização](./visualization.md) não desenha grupos nem cores de grupos em nenhum dos modos.

Um agente de programação também pode criar e alterar grupos, e ler o DDL dos grupos escolhidos — consulte [Grupos de tabelas](../../mcp/tools.md#table-groups) nas ferramentas MCP.

![Preparar o desenho de um grupo com ⌥ + G, desenhá-lo sobre orders e payments, dar-lhe o nome Billing, largar order_items dentro dele e depois mover e redimensionar o grupo](/img/demo-table-group.webp)

## Criar um grupo {#creating-a-group}

Há duas formas de criar um grupo, cada uma com um atalho. Nenhuma delas está disponível num editor só de leitura nem enquanto os grupos estão [ocultos](#hiding-groups), e, nesse caso, os seus atalhos não fazem nada.  
Tal como os outros atalhos da tela, só funcionam no separador ERD e ficam suspensos enquanto uma célula, uma nota ou o nome de um grupo está a ser editado — consulte [Atalhos](./settings.md#shortcuts).

### Desenhar um grupo {#drawing-a-group}

Clique no botão `New Table Group` da [barra de ferramentas da tela](./table-related-functions.md#canvas-toolbar), prima `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac), ou escolha a opção `New Table Group` no menu de contexto da tela, onde surge a seguir às opções `New Table` e `New Memo`, ou na [pesquisa rápida](./quick-search.md) no separador ERD. Depois arraste uma caixa sobre a tela.  
O botão e o atalho ativam ou desativam o desenho, pelo que premir qualquer um deles enquanto o desenho está preparado termina-o, seja qual for a forma como foi iniciado; a opção do menu de contexto e a pesquisa rápida apenas o iniciam. Iniciá-lo desativa a ferramenta mão e cancela uma relação que esteja a ser desenhada.  
Enquanto o desenho está preparado, o cursor é uma cruz, e o premir do botão inicia a caixa no ponto onde ocorre, mesmo sobre uma tabela, em vez de selecionar ou mover o que está por baixo. A barra de ferramentas da tela marca então o seu botão `New Table Group`, e não a mão nem o ponteiro.

Soltar o botão adiciona um grupo nessa caixa, nunca com menos de `160px` de largura e `100px` de altura, barra de título incluída, por mais curto que seja o arrasto. Um clique sem arrastar adiciona um grupo com `480px` de largura e `320px` de altura, com o canto superior esquerdo no ponto do clique.  
Todas as tabelas sem grupo cujo centro fique dentro da nova caixa juntam-se ao grupo. Uma tabela que já pertença a outro grupo fica nesse grupo.

O botão do meio do rato continua a deslocar a vista da tela e mantém o desenho preparado. Os seguintes casos terminam o desenho sem adicionar um grupo:

- `Escape`, ou `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac), antes de premir o botão ou durante o arrasto. Antes de premir o botão, deixam a seleção como está; o premir do botão que inicia a caixa já a limpou.
- Um clique com o botão direito, que limpa a seleção. Não se abre nenhum menu de contexto.
- Mudar para a ferramenta mão com `Space` ou com a barra de ferramentas da tela, clicar no ponteiro ou no botão `New Table Group` da barra de ferramentas, ou iniciar uma relação.
- Mudar para outro separador, ocultar os grupos ou o editor passar a só de leitura.

### Agrupar as tabelas selecionadas {#grouping-selected-tables}

Selecione uma ou mais tabelas e prima `T` e depois `G`, ou escolha a opção `Group selected tables` no menu de contexto de uma tabela ou a entrada `Group Selected Tables` na pesquisa rápida, que a lista enquanto houver uma tabela selecionada.  
O novo grupo é desenhado à volta das tabelas selecionadas, com `24px` de folga em todos os lados e a barra de título por cima. Todas as tabelas selecionadas juntam-se a ele, saindo do grupo em que estavam, e o grupo que deixaram mantém-se, mesmo que agora esteja vazio. As notas incluídas na seleção são ignoradas.

`T` e depois `G` consiste em premir duas teclas sem tecla modificadora, `G` no espaço de um segundo após `T`. Sem nenhuma tabela selecionada, não faz nada, e num campo de texto, como o campo Localizar do explorador, escreve as duas letras.

![Agrupar categories e products com T e depois G, dar o nome Catalog ao grupo e depois atribuir-lhe a cor violeta a partir do seu menu, para que ambos os cabeçalhos fiquem com essa cor](/img/demo-table-group-selected.webp)

Em qualquer dos casos, o novo grupo não tem nome nem cor. Fica selecionado sozinho, e o seu editor de nome abre-se sobre a barra de título para que possa escrever um nome de imediato — consulte [Dar nome a um grupo](#naming-a-group).  
O grupo e as tabelas que acolhe formam um passo de anulação, e o nome que escrever é outro.

## Dar nome a um grupo {#naming-a-group}

O nome de um grupo é editado num campo que se abre sobre a sua barra de título. Abre-se sozinho quando um grupo é criado, com um duplo clique na barra de título e a partir da opção `Rename` do menu de contexto do grupo.  
`Enter`, ou clicar noutro sítio, guarda o nome. `Escape` fecha o campo sem alterar o nome e deixa o grupo selecionado, e um segundo `Escape` limpa a seleção.  
Um nome alterado é um passo de anulação; guardar o nome sem alterações não regista nada. Um nome vazio ou em branco aparece como `unnamed`.  
Enquanto o campo está aberto, os atalhos da tela ficam suspensos, e os atalhos da pesquisa rápida e do comando `Toggle Explorer` não fazem nada, tal como enquanto uma célula de tabela está a ser editada.

[Localizar e substituir](./find-and-replace.md#what-it-searches) pesquisa os nomes dos grupos com o botão `Table group names` enquanto os grupos estão visíveis, e os seus botões `Replace` e `Replace All` mudam o nome dos grupos — consulte [Substituir](./find-and-replace.md#replacing). A [pesquisa rápida](./quick-search.md#searching-the-diagram) não pesquisa nomes de grupos.

## Atribuir uma cor a um grupo {#coloring-a-group}

Escolha a opção `Color` no menu de contexto do grupo para abrir o seletor de cores na cor do grupo.  
Tal como com as tabelas e as notas, o seletor aplica a cor a todas as tabelas, notas e grupos selecionados, e a opção `Remove color` do menu, ou a opção `No color` do seletor, retira a cor a todos eles — consulte [Atribuição de cores a tabelas e notas](./table-related-functions.md#table-and-memo-color-specification). A cor de um grupo também é proposta na fila `Document colors` do seletor.

Um grupo com cor desenha a barra de título e o contorno nessa cor e o corpo num tom pálido dela. Um grupo sem cor usa os cinzentos neutros do tema.  
Todas as tabelas de um grupo com cor apresentam a cor do grupo em todo o cabeçalho e mantêm a sua própria cor no bordo esquerdo, pelo que ambas ficam visíveis.  
O texto e os botões desse cabeçalho ficam brancos, ou pretos sobre uma cor clara onde o preto se lê muito melhor, tal como o nome, o ícone e o `x` da barra de título do grupo. Entre as amostras predefinidas do seletor, Orange, Amber, Yellow e Lime ficam com preto, e as restantes com branco.  
Uma tabela mantém o seu próprio cabeçalho enquanto o seu grupo não tem cor, enquanto os grupos estão ocultos, com zoom de `70%` ou menos, em que as tabelas ficam reduzidas ao nome, e no separador Visualização.

Uma mudança de cor fica registada no [histórico de anulação](./undo-redo.md#one-gesture-one-step), tal como para as tabelas e as notas.

## Selecionar grupos {#selecting-groups}

Clique na barra de título de um grupo para selecionar apenas esse grupo, ou faça `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac) para o adicionar à seleção.  
Premir a barra de título de um grupo que já está selecionado mantém toda a seleção, pelo que um arrasto move então a seleção inteira.  
Premir a barra de título, ou clicar com o botão direito no grupo, traz o grupo para a frente dos outros grupos e as suas tabelas para a frente de todas as outras tabelas e notas.

O corpo, a área por baixo da barra de título, funciona como a tela para o botão esquerdo do rato: arrastá-lo desloca a vista, `Ctrl + drag` (Windows/Linux) ou `⌘ + drag` (Mac) desenha um retângulo de seleção e um clique limpa a seleção. As tabelas, notas e linhas de relação sobre o corpo respondem ao ponteiro como habitualmente.

Um retângulo de seleção só inclui um grupo quando envolve toda a caixa do grupo, pelo que um retângulo desenhado dentro de um grupo seleciona tabelas sem o grupo — consulte [Seleção múltipla](./table-related-functions.md#multiple-selection).  
`Ctrl + A` (Windows/Linux) ou `⌘ + A` (Mac) nunca seleciona um grupo.

A opção `Select tables` do menu de contexto do grupo substitui a seleção pelas tabelas do grupo, deixando de fora o próprio grupo, pelo que o comando seguinte só abrange as tabelas.  
Use-a antes de comandos que atuam só sobre tabelas, como copiar ou [focar em tabelas](./table-related-functions.md#focusing-on-tables), que ignoram um grupo selecionado.

O contorno de um grupo selecionado fica com a cor de seleção. Numa [sessão colaborativa](../../api/advanced/collaborative-editing.md), um grupo que outro participante seleciona fica rodeado pela cor desse participante.

## Ir para um grupo {#going-to-a-group}

O [explorador](./explorer.md#the-tree) lista os grupos na sua pasta `Table Groups`, por nome, cada um com as suas tabelas por baixo. A pesquisa rápida não lista grupos.

Escolher a linha de um grupo no explorador, uma correspondência de [Localizar e substituir](./find-and-replace.md#going-to-a-match) no nome de um grupo ou a linha de um grupo na lista do [visualizador de diferenças](./table-related-functions.md#the-change-tree) leva a esse grupo.  
Coloca a caixa do grupo à vista, guiando-se pela barra de título quando a caixa é mais alta do que a tela — consulte [Onde termina um salto](./table-related-functions.md#where-a-jump-lands). Depois seleciona apenas o grupo e trá-lo para a frente com as suas tabelas, tal como acontece ao premir a sua barra de título.  
Enquanto os grupos estão [ocultos](#hiding-groups), ou depois de o grupo ter sido removido, ir para ele não faz nada.  
No visualizador de diferenças, cada lado só vai para o grupo quando o seu próprio documento o contém e o mostra — consulte [Ir para uma alteração](./table-related-functions.md#going-to-a-change).

## Mover e redimensionar um grupo {#moving-and-resizing-a-group}

Arraste um grupo pela barra de título para o mover com todas as suas tabelas.  
Se o grupo fizer parte de uma seleção maior, a seleção inteira move-se com ele, e uma tabela que esteja selecionada e também no grupo move-se uma só vez.  
O arrasto só começa depois de o ponteiro se deslocar um pouco, pelo que um clique ou duplo clique na barra de título continua a ser um clique. `Alt + drag` numa barra de título move o grupo como um arrasto normal; um grupo nunca é duplicado.  
O movimento, com todas as tabelas que leva consigo, é um passo de anulação.

Arrastar uma tabela sozinha move apenas essa tabela, e pode movê-la para dentro ou para fora de um grupo — consulte [Adicionar e remover tabelas](#adding-and-removing-tables).

Todos os grupos têm pegas de redimensionamento nos quatro bordos e nos quatro cantos, estejam selecionados ou não, tal como uma nota.  
Arraste uma com o botão esquerdo do rato: a caixa segue o ponteiro, e o novo tamanho é guardado quando soltar o botão, como um passo de anulação.  
Um grupo não pode ficar mais pequeno do que `160px` por `100px`, nem mais pequeno do que as suas tabelas com os seus `24px` de folga e a barra de título. O bordo para aí, por mais longe que vá o ponteiro.

## Adicionar e remover tabelas {#adding-and-removing-tables}

Uma tabela entra num grupo ou sai dele consoante o sítio onde a largar.  
Quando arrasta tabelas e solta o botão, cada tabela arrastada que não seja levada por um grupo selecionado é avaliada pelo seu centro. Entra no grupo mais acima cuja caixa contém o seu centro, ou sai do seu grupo se o centro não estiver na caixa de nenhum grupo. O grupo mais acima é o que é desenhado à frente.  
Um grupo que o arrasto deixa no lugar mantém a caixa que tinha quando o arrasto começou, pelo que uma tabela ligeiramente deslocada dentro do seu próprio grupo fica nele, e tem de ser arrastada até o centro ficar fora dessa caixa para sair.  
Enquanto arrasta, cada grupo no qual uma tabela entraria ao ser largada fica com o contorno realçado.

Quando solta o botão até cerca de `200ms` após o último movimento, a mudança de grupo faz parte do passo de anulação do arrasto, pelo que uma anulação repõe as tabelas onde estavam e nos grupos em que estavam. Após uma pausa mais longa antes de soltar, a mudança de grupo é um passo próprio — consulte [Um gesto, um passo](./undo-redo.md#one-gesture-one-step).  
Um clique, ou um arrasto de poucos píxeis, não altera nenhum grupo, e nada muda de grupo enquanto os grupos estão ocultos.

As outras formas de mudar as tabelas que um grupo contém:

- A opção `Remove from group` do menu de contexto de uma tabela retira do seu grupo todas as tabelas selecionadas. Aparece enquanto uma tabela selecionada pertence a um grupo, mesmo enquanto os grupos estão ocultos, e é um passo de anulação.
- A opção `Group selected tables` move as tabelas selecionadas para um novo grupo — consulte [Agrupar as tabelas selecionadas](#grouping-selected-tables).
- Remover um grupo deixa as suas tabelas sem grupo.

Uma tabela colada ou duplicada com `Alt` não pertence a nenhum grupo, mesmo quando fica dentro da caixa de um grupo. Arrastá-la depois aplica a regra do sítio onde é largada.

## Remover um grupo {#removing-a-group}

Remover um grupo nunca remove as suas tabelas: ficam onde estão, sem grupo.

- O `x` no fim da barra de título, que aparece enquanto o ponteiro está sobre o grupo, remove apenas esse grupo.
- A opção `Delete` do menu de contexto do grupo remove o grupo. Quando o grupo é um de vários itens selecionados, a opção indica `Delete selected` e remove tudo o que está selecionado: tabelas, notas e grupos.
- Com grupos selecionados, `Delete` ou `Backspace` remove os grupos selecionados juntamente com as tabelas e notas selecionadas, tal como `Ctrl + Backspace` e `Ctrl + Delete` (Windows/Linux) ou `⌘ + Backspace` e `⌘ + Delete` (Mac) — consulte [Eliminação de tabelas e notas](./table-related-functions.md#table-and-memo-deletion).

Cada remoção é um passo de anulação, que repõe o grupo com as suas tabelas lá dentro.

## O menu do grupo {#the-group-menu}

Clique com o botão direito na barra de título, no corpo ou no bordo de um grupo para abrir o seu menu. Num Mac, `Ctrl + click` também o abre, tal como um toque prolongado num ecrã tátil.  
O clique com o botão direito seleciona primeiro o grupo, sozinho a menos que já faça parte da seleção, pelo que as opções `Color` e `Delete selected` só abrangem o resto da seleção quando o grupo fazia parte dela.

- `Select tables`: seleciona apenas as tabelas do grupo — consulte [Selecionar grupos](#selecting-groups).
- `Rename`: abre o editor de nome — consulte [Dar nome a um grupo](#naming-a-group).
- `Color`: abre o seletor de cores — consulte [Atribuir uma cor a um grupo](#coloring-a-group).
- `Remove color`: aparece enquanto algum elemento selecionado tem cor.
- `Delete`, ou `Delete selected` quando o grupo é um de vários itens selecionados, com a tecla `Delete` indicada à direita — consulte [Remover um grupo](#removing-a-group).

O menu de contexto de uma tabela acrescenta as opções `Group selected tables` e `Remove from group` a seguir às opções `Color` e `Remove color`, antes da sua opção Delete, e o menu de contexto da tela acrescenta a opção `New Table Group`.  
A opção `Group selected tables` mostra as suas teclas, `T` e depois `G`, à direita, e a opção `New Table Group` mostra `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac).

## Ocultar grupos {#hiding-groups}

A opção `View Option` → `Table Groups` do menu de contexto da tela mostra ou oculta todos os grupos. Está marcada por predefinição — consulte [Opções de vista das tabelas](./table-related-functions.md#table-view-options).  
Com a opção desmarcada, as caixas dos grupos e as cores dos grupos nos cabeçalhos das tabelas desaparecem da tela, do minimapa e das imagens exportadas, e as barras de deslocamento e o minimapa deixam de reservar espaço para os grupos. Nada se move nem é redimensionado, e cada tabela fica no seu grupo.  
Ocultar os grupos remove-os da seleção, termina um desenho iniciado com `New Table Group` e fecha um editor de nome que esteja aberto.

Enquanto os grupos estão ocultos:

- As opções `New Table Group` e `Group selected tables` não estão disponíveis nos menus, nem as entradas `New Table Group` e `Group Selected Tables` na pesquisa rápida, e a barra de ferramentas da tela omite o seu botão `New Table Group`. A opção `Remove from group` continua disponível.
- `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac), bem como `T` e depois `G`, não fazem nada.
- Arrastar tabelas não altera nenhum grupo, e um retângulo de seleção não inclui nenhum grupo.
- O explorador omite a sua pasta `Table Groups`, e Localizar e substituir não localiza nem substitui nomes de grupos, mesmo com o botão `Table group names` ativado.
- A [disposição automática](#auto-layout) continua a manter juntas as tabelas de cada grupo, o separador Esquema SQL continua a propor os [grupos à escolha](#schema-sql-by-group), o DBML continua a escrevê-los e [Importar e adicionar](./file-import-export.md#import-and-add) continua a colocar o conteúdo importado abaixo das caixas ocultas.

A escolha é guardada no documento e registada no [histórico de anulação](./undo-redo.md#what-the-history-records), tal como os outros interruptores do menu Opções de vista. Num editor só de leitura, fica antes nesse ecrã — consulte [Editores só de leitura](#read-only-editors).

## Disposição automática {#auto-layout}

Qualquer [disposição automática](./table-related-functions.md#auto-layout) mantém juntas as tabelas de cada grupo, quer os grupos estejam visíveis quer não.

- `Force` move cada grupo com as suas tabelas como uma única caixa, com as tabelas a manter as suas posições dentro dela, e mantém a caixa de cada grupo a pelo menos `100px` de outros grupos e das tabelas sem grupo. A pré-visualização mostra cada grupo no sítio para onde vai.
- `Flow`, `Tree - vertical` e `Tree - horizontal` dispõem as tabelas de cada grupo dentro do grupo e posicionam os grupos segundo as relações entre eles, com as tabelas sem grupo dispostas à sua volta.

Depois, cada grupo que contém tabelas é ajustado a elas: a sua caixa passa a ser os limites delas, com `24px` de folga e a barra de título. Um grupo sem tabelas mantém a posição e o tamanho.  
As tabelas e os grupos ficam posicionados num único passo de anulação.

Uma importação de DBML ajusta cada grupo à volta das suas tabelas da mesma forma, onde quer que estejam posicionadas — consulte [DBML](./file-import-export.md#dbml).

## Esquema SQL por grupo {#schema-sql-by-group}

O separador [Esquema SQL](./schema-sql.md) pode escrever apenas as tabelas dos grupos escolhidos.  
Enquanto o documento contém um grupo, visível ou oculto, o seu painel de opções mostra uma linha `Tables` na secção `This window only`, com uma caixa de verificação para `All`, uma para cada grupo e uma para `No group`, as tabelas sem grupo — consulte [Tabelas](./schema-sql.md#tables).  
A escolha pertence à janela do editor e não é guardada no documento.

## Importar, exportar e copiar {#import-export-and-copying}

- O DBML transporta os grupos nos dois sentidos. Uma importação de DBML transforma cada bloco `TableGroup` num grupo — consulte [DBML](./file-import-export.md#dbml) — e a linguagem `DBML` do Gerador de código escreve um bloco `TableGroup` para cada grupo que contém uma tabela — consulte [Gerador de código](./code-generator.md#language).
- Um ficheiro JSON mantém os seus grupos. Nenhum outro formato os transporta: as importações de SQL, GraphQL e AML não trazem nenhum, e o Esquema SQL e os outros destinos do Gerador de código não escrevem nenhum.
- [Importar e adicionar](./file-import-export.md#import-and-add) traz os grupos de um ficheiro como novos grupos com as respetivas tabelas, e seleciona-os com as novas tabelas enquanto os grupos estão visíveis, pelo que arrastar o bloco adicionado leva consigo os seus grupos.
- Uma [imagem exportada](./file-import-export.md#image) desenha os grupos visíveis atrás das tabelas, com as cores dos grupos nos cabeçalhos delas.
- Copiar e colar, ou duplicar com `Alt`, nunca copia um grupo — consulte [Copiar e colar tabelas e notas](./table-related-functions.md#copyingpasting-tables-and-memos) e [Adicionar e remover tabelas](#adding-and-removing-tables).

## Editores só de leitura {#read-only-editors}

Num editor [`readonly`](../../api/erd-editor-element.md#readonly), os grupos são desenhados e listados no explorador como habitualmente e é possível ir para eles, mas não alterá-los:

- [Ir para um grupo](#going-to-a-group) seleciona-o, e essa é a única forma de selecionar um grupo aí. Premir uma barra de título não seleciona nada nem move nada: arrastada, desloca a tela, e um clique que não se move retira a seleção que um salto deixou.
- Não há pegas de redimensionamento nem `x`, e um duplo clique na barra de título não abre o editor de nome.
- Um clique com o botão direito num grupo não abre nenhum menu, e o menu da tabela só contém `Table Properties`.
- O menu da tela não tem a opção `New Table Group`, e a pesquisa rápida não lista nenhum dos dois comandos de grupo. Um desenho iniciado com `New Table Group` termina quando o editor passa a só de leitura.
- A [barra de ferramentas da tela](./table-related-functions.md#canvas-toolbar) mantém apenas os seus controlos de vista, pelo que não tem o botão `New Table Group`, e `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac), bem como `T` e depois `G`, não fazem nada.
- Um arrastamento de tabelas ou de um grupo em curso quando o editor passa a só de leitura pára onde está e não altera nenhum grupo, e um redimensionamento de grupo em curso termina sem alterar o tamanho.
- `View Option` → `Table Groups` mostra ou oculta os grupos apenas nesse ecrã, tal como toda a opção de View Option aí: o documento, os colaboradores e o histórico de anulação mantêm a escolha como estava, e, quando o editor volta a ser editável, a escolha do documento é reposta.
- A escolha `Tables` do separador Esquema SQL continua a funcionar.
