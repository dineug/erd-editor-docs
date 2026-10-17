---
sidebar_position: 13
description: Anular e refazer edições, o que o histórico regista e percorrê-lo passo a passo com a viagem no tempo.
---

# Anular e refazer

Pode recuar para um estado de edição anterior ou avançar para um posterior.  
O histórico guarda até `2048` alterações.

- Undo: `Ctrl + Z` (Windows/Linux) ou `⌘ + Z` (Mac)
- Redo: `Ctrl + Shift + Z` (Windows/Linux) ou `⌘ + Shift + Z` (Mac)

A barra de ferramentas disponibiliza os mesmos dois comandos nos botões `Undo` e `Redo`, ao lado do botão `Time Travel`.  
Só ficam ativos quando há algo para anular ou refazer. Um editor `readonly` oculta os três botões, e os atalhos não fazem nada.

Anular e refazer só funcionam no separador ERD. Não estão disponíveis nos separadores Visualização, Esquema SQL, Gerador de código e Definições. Nos campos `Before tables` e `After tables` do separador Esquema SQL, as mesmas teclas anulam e refazem, em vez disso, o que escreve no campo.  
Os atalhos também ficam inativos enquanto a pesquisa rápida, o painel `Table Properties`, o visualizador `Diff Viewer`, a pré-visualização de `Auto Layout`, a caixa de diálogo [`Export image`](./file-import-export.md#image), a caixa de diálogo [Mapear colunas](./relationship-editing.md#map-columns) ou a viagem no tempo estão abertos.  
Continuam a funcionar enquanto o teclado está em qualquer ponto do [explorador](./explorer.md#keys-in-the-explorer), incluindo a sua árvore, e enquanto o [seletor de cores](./table-related-functions.md#table-and-memo-color-specification) está aberto. Mesmo com o cursor de texto num dos respetivos campos, como os campos Localizar, Substituir ou `Hex`, anulam e refazem o diagrama, e não o texto do campo.

O histórico fica em memória durante a sessão atual. Não é guardado no documento, pelo que, ao reabrir um diagrama, o histórico começa vazio.

![Mover uma tabela e remover uma coluna com ⌥ + Backspace, depois anular as duas ações com ⌘ + Z e refazê-las com ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## O que o histórico regista {#what-the-history-records}

O que é registado:

- Tabelas e notas: adição, remoção, movimento, cor, nome e comentário, texto e tamanho das notas.
- Grupos de tabelas: adição, remoção, movimento, redimensionamento, nome, cor e o grupo em que cada tabela está — consulte [Grupos de tabelas](./table-groups.md).
- Colunas: adição, remoção, reordenação e todas as opções das colunas.
- Relações: adição, remoção, mudança de tipo, as colunas definidas em [Mapear colunas](./relationship-editing.md#map-columns) e cada escolha feita em `On Delete` ou `On Update` — consulte [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Anular uma remoção repõe a relação com as respetivas ações ON DELETE e ON UPDATE.
- Índices e as respetivas colunas.
- Posição da vista, nível de zoom e os interruptores do menu `View Option`.
- Os scripts `Before tables` e `After tables` do separador Esquema SQL, um passo por cada edição que aplica ao sair do campo — consulte [Scripts antes e depois das tabelas](./schema-sql.md#before-and-after-scripts).
- Importar um ficheiro e adicionar um com a opção [`Import and Add`](./file-import-export.md#import-and-add).

O que não é registado:

- A base de dados e o nome da base de dados.
- A linguagem do Gerador de código, a opção `Table Name Case` e a opção `Column Name Case`.
- O tipo de delimitador, quer seja definido no separador Esquema SQL, quer no separador Gerador de código.
- As escolhas `Statements`, `Header` e `Tables` do separador Esquema SQL, que pertencem à janela do editor — consulte [Painel de opções](./schema-sql.md#options-panel).
- Tudo o que está no separador Definições, incluindo as linhas [`Lock`](./settings.md#lock).
- O tema e o idioma de apresentação — consulte [Idioma e tema](./language-and-theme.md).
- Que tabela, nota ou grupo é desenhado à frente dos outros.
- O [explorador](./explorer.md): abri-lo, fechá-lo ou redimensioná-lo, recolher a sua árvore, bem como o texto e as opções de pesquisa. No entanto, o que os botões `Replace` e `Replace All` alteram é registado, tal como o deslocamento que um salto provoca — consulte [Um gesto, um passo](#one-gesture-one-step).
- O zoom e o deslocamento da vista no separador Visualização, em qualquer dos modos, mover nós do grafo ou cartões do Flow, o botão `Tidy Up`, a apresentação das linhas e focar em tabelas — consulte [O Flow nunca edita o documento](./visualization.md#flow-never-edits-the-document).

As alterações a qualquer um destes elementos não podem ser anuladas.

As alterações que chegam de outro editor também não são registadas, pelo que a anulação só reverte as suas. Numa [sessão colaborativa](../../api/advanced/collaborative-editing.md), cada editor anula as suas próprias alterações, e um agente de programação que edita através do [servidor MCP](../../mcp/live-and-headless.md#undo) anula as suas com `erd_undo`.

Anular uma importação feita com a opção `Import`, que substitui o diagrama inteiro, repõe o diagrama anterior tal como o editor o tinha quando importou, com cada [bloqueio](./settings.md#lock) ativado ou desativado e cada valor bloqueado tal como estavam nessa altura.  
Se esse diagrama tinha a definição `Viewport` bloqueada, a vista e o zoom voltam à vista bloqueada, onde o diagrama se abre, e não ao ponto onde estava. Com a sua definição `Viewport` desbloqueada, voltam ao ponto onde estava quando importou. As outras definições bloqueadas, como o separador em que está ou a linguagem do Gerador de código, ficam como estão no seu ecrã.  
Um diagrama novo começa com todos os bloqueios ativados. Desative o bloqueio `Viewport` antes de importar para manter a sua vista numa anulação deste tipo. Desativá-lo depois, ou importar um ficheiro JSON cujo próprio bloqueio `Viewport` esteja desativado, não muda o ponto para onde a anulação o leva.

## Um gesto, um passo {#one-gesture-one-step}

Tudo o que um único gesto despacha torna-se uma só entrada do histórico.  
Colar várias tabelas e notas de uma vez, ou duplicá-las com `Alt + drag`, é anulado num único passo.

Premir `Delete` ou `Backspace`, ou escolher a opção `Delete selected` ou `Delete columns` num menu de contexto, é um passo, seja qual for o número de tabelas, notas, grupos de tabelas ou colunas que remove.  
Alternar a chave primária em várias colunas selecionadas é um passo, quer com `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac), quer com a opção `Primary Key on selected columns` do menu de contexto de uma tabela.  
Definir a cor da seleção, ou retirá-la com a opção `No color` ou `Remove color`, é um passo, seja qual for o número de tabelas, notas e grupos selecionados. Escolher uma cor que tudo o que está selecionado já tem não regista nenhum passo, e o mesmo acontece com a opção `No color` quando nada do que está selecionado tem cor.  
Premir o botão `Map` ou `Save` na caixa de diálogo [Mapear colunas](./relationship-editing.md#map-columns) é um passo, juntamente com as colunas de chave externa que adiciona e os tipos de dados que altera.  
A opção `Import and Add` é um passo, juntamente com o deslocamento que mostra o bloco adicionado, quando este precisa de um.

Criar um [grupo de tabelas](./table-groups.md), desenhando-o ou agrupando as tabelas selecionadas com a opção `Group selected tables` ou com `T` e depois `G`, é um passo, juntamente com todas as tabelas que abrange. Remover um grupo é um passo, e anular essa remoção repõe o grupo com as suas tabelas lá dentro.  
Arrastar um grupo pela barra de título move o grupo e todas as suas tabelas num único passo. As tabelas largadas para dentro ou para fora de um grupo mudam de grupo no mesmo passo que o seu arrasto quando solta o botão até cerca de `200ms` após o último movimento, pelo que uma anulação as repõe onde estavam e nos grupos em que estavam. Após uma pausa mais longa antes de soltar, a mudança de grupo é um passo próprio, e a primeira anulação reverte apenas essa mudança.  
Redimensionar um grupo por um bordo ou por um canto é registado uma única vez, quando solta o botão.  
Aplicar a [disposição automática](./table-related-functions.md#auto-layout) é um passo, incluindo os grupos que ajusta à volta das respetivas tabelas.

A ação `Replace All` de [Localizar e substituir](./find-and-replace.md#replacing) também é um passo, seja qual for o número de nomes de tabelas, nomes de colunas, nomes de índices, nomes de grupos de tabelas, comentários e notas que altera. Quando não altera nada, como quando o interruptor `Preserve Case` volta a escrever cada correspondência tal como estava, não regista nenhum passo.  
Uma única ação `Replace` é um passo, incluindo o deslocamento até à correspondência seguinte, quando essa correspondência precisa de um. Quando volta a escrever a sua correspondência tal como estava, regista apenas esse deslocamento, ou nada, quando não há nenhum.  
Ir para uma correspondência só desloca a tela quando a correspondência ainda não está bem visível — consulte [Onde termina um salto](./table-related-functions.md#where-a-jump-lands). Esse deslocamento é registado como qualquer outra mudança da posição da vista, pelo que, depois de percorrer as correspondências, a anulação reverte primeiro esses deslocamentos, um por passo.  
Os outros saltos que terminam na tela registam os seus deslocamentos da mesma forma: escolher uma linha no explorador, um resultado da pesquisa rápida ou o [botão do cartão](./visualization.md#card-buttons) de ligação externa no Flow. Um salto que deixa a vista onde está não regista nada. Escolher uma linha na lista do visualizador `Diff Viewer` também não regista nada, uma vez que move apenas os lados só de leitura do próprio visualizador de diferenças.

Um arrasto contínuo, um deslocamento da vista da tela, um zoom, um gesto de pinça ou uma mudança de cor é acumulado durante cerca de `200ms` e também fica registado como uma única entrada.  
Um arrasto que percorre menos de `20px` no total não regista nenhum movimento. Só é registada a mudança de grupo que provoque, se houver alguma.

A escrita numa célula ou numa nota é registada por cada introdução de texto, e não por gesto: cada carácter escrito, cada colagem e cada passo de uma composição IME é um passo próprio.  
O nome de um grupo de tabelas é registado uma única vez, quando é guardado com `Enter` ou ao sair do campo, pelo que o nome que escreve num grupo que acabou de criar é um passo separado da sua criação. `Esc`, ou um nome deixado sem alterações, não regista nada.

## Viagem no tempo {#time-travel}

Abre-se com o botão `Time Travel` da barra de ferramentas, ao lado dos botões de anular e refazer.  
O botão não faz nada enquanto a sessão não tiver pelo menos uma alteração registada.

A viagem no tempo abre uma cópia separada e só de leitura do diagrama, na posição de deslocamento e no nível de zoom que a tela está a mostrar, esteja ou não ativado o bloqueio `Viewport`.  
Arraste o controlo de deslize, ou clique em qualquer ponto da sua calha, para percorrer todo o histórico de edições e pré-visualizar cada ponto. A posição mais à esquerda do controlo de deslize é o estado um passo antes da primeira alteração registada, e o controlo abre-se com o cursor no estado atual.  
A pré-visualização é inerte: desenha um minimapa, mas não pode deslocar a vista, percorrê-la nem editá-la, e o documento real mantém-se intacto até aplicar.

Prima o botão `Apply` para restaurar o ponto selecionado, ou o botão `Cancel` ou a tecla `Esc` para deixar o documento inalterado.

![Abrir a viagem no tempo, arrastar o controlo de deslize para trás ao longo da sessão e aplicar um ponto anterior](/img/demo-time-travel.webp)
