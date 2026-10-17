---
sidebar_position: 13
description: Desfazer e refazer edições, o que o histórico registra e como percorrê-lo com a viagem no tempo.
---

# Desfazer e refazer

É possível voltar a um estado de edição anterior ou avançar para um estado posterior.  
O histórico guarda até `2048` alterações.

- Undo: `Ctrl + Z` (Windows/Linux) ou `⌘ + Z` (Mac)
- Redo: `Ctrl + Shift + Z` (Windows/Linux) ou `⌘ + Shift + Z` (Mac)

A barra de ferramentas oferece os mesmos dois comandos nos botões `Undo` e `Redo`, ao lado de `Time Travel`.  
Eles só ficam ativos quando há algo para desfazer ou refazer. Um editor `readonly` oculta os três, e os atalhos não fazem nada.

Desfazer e refazer só se aplicam à aba ERD. Eles ficam indisponíveis nas abas Visualização, Esquema SQL, Gerador de código e Configurações. Nos campos `Before tables` e `After tables` da aba Esquema SQL, as mesmas teclas desfazem e refazem, em vez disso, a digitação no campo.  
Os atalhos também ficam inativos enquanto a pesquisa rápida, o painel `Table Properties`, o `Diff Viewer`, a pré-visualização do `Auto Layout`, a caixa de diálogo [`Export image`](./file-import-export.md#image), [Mapear colunas](./relationship-editing.md#map-columns) ou a viagem no tempo está aberta.  
Eles continuam funcionando enquanto o foco do teclado está em qualquer lugar do [explorador](./explorer.md#keys-in-the-explorer), inclusive na árvore, e enquanto o [seletor de cores](./table-related-functions.md#table-and-memo-color-specification) está aberto. Mesmo com o cursor de texto em um dos campos deles, como Localizar, Substituir ou `Hex`, os atalhos desfazem e refazem o diagrama, e não o texto do campo.

O histórico fica na memória durante a sessão atual. Ele não é armazenado no documento, então, ao reabrir um diagrama, o histórico começa vazio.

![Movimentação de uma tabela e remoção de uma coluna com ⌥ + Backspace, depois ambas desfeitas com ⌘ + Z e refeitas com ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## O que o histórico registra {#what-the-history-records}

São registrados:

- Tabelas e notas: adição, remoção, movimentação, cor, nome e comentário, texto e tamanho da nota.
- Grupos de tabelas: adição, remoção, movimentação, redimensionamento, nome, cor e o grupo em que cada tabela está — consulte [Grupos de tabelas](./table-groups.md).
- Colunas: adição, remoção, reordenação e todas as opções de coluna.
- Relacionamentos: adição, remoção, alteração de tipo, as colunas definidas em [Mapear colunas](./relationship-editing.md#map-columns) e cada escolha em `On Delete` ou `On Update` — consulte [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Desfazer uma remoção traz o relacionamento de volta com suas ações ON DELETE e ON UPDATE.
- Índices e suas colunas.
- A posição da área visível, o nível de zoom e os botões de alternância do menu `View Option`.
- Os scripts `Before tables` e `After tables` da aba Esquema SQL, uma etapa para cada edição que você aplica ao sair do campo — consulte [Scripts antes e depois das tabelas](./schema-sql.md#before-and-after-scripts).
- Importar um arquivo e adicionar um com [`Import and Add`](./file-import-export.md#import-and-add).

Não são registrados:

- O fornecedor de banco de dados e o nome do banco de dados.
- A linguagem do Gerador de código, `Table Name Case` e `Column Name Case`.
- O tipo de delimitador, seja ele definido na aba Esquema SQL ou na aba Gerador de código.
- As escolhas de `Statements`, `Header` e `Tables` da aba Esquema SQL, que pertencem à janela do editor — consulte [Painel de opções](./schema-sql.md#options-panel).
- Tudo o que está na aba Configurações, inclusive as linhas de [`Lock`](./settings.md#lock).
- O tema e o idioma de exibição — consulte [Idioma e tema](./language-and-theme.md).
- Qual tabela, nota ou grupo é desenhado à frente dos demais.
- O [explorador](./explorer.md): abri-lo, fechá-lo ou redimensioná-lo, recolher sua árvore, além do termo e das opções de pesquisa. No entanto, o que `Replace` e `Replace All` alteram é registrado, assim como a rolagem que um salto provoca — consulte [Um gesto, uma etapa](#one-gesture-one-step).
- O zoom e o deslocamento na aba Visualização em qualquer um dos modos, a movimentação de nós do grafo ou de cartões do Flow, `Tidy Up`, a exibição de linhas e o foco em tabelas — consulte [O Flow nunca edita o documento](./visualization.md#flow-never-edits-the-document).

Alterações em qualquer um desses itens não podem ser desfeitas.

As alterações que chegam de outro editor também não são registradas, então o desfazer reverte apenas as suas. Em uma [sessão colaborativa](../../api/advanced/collaborative-editing.md), cada editor desfaz as próprias alterações, e um agente de codificação que edita pelo [servidor MCP](../../mcp/live-and-headless.md#undo) desfaz as próprias com `erd_undo`.

Desfazer um `Import`, que substitui o diagrama inteiro, traz de volta o diagrama anterior tal como o editor o mantinha quando você importou, com cada [bloqueio](./settings.md#lock) ativado ou desativado e cada valor bloqueado como estavam naquele momento.  
Se esse diagrama tinha `Viewport` bloqueado, a área visível e o zoom voltam para a área visível bloqueada, onde o diagrama se abre, e não para onde você estava. Com o `Viewport` dele desbloqueado, eles voltam para onde você estava quando importou. As outras configurações bloqueadas, como a aba em que você está ou a linguagem do Gerador de código, ficam como estão na sua tela.  
Um diagrama novo começa com todos os bloqueios ativados. Desbloqueie `Viewport` antes de importar para manter sua área visível em um desfazer desse tipo. Desbloqueá-lo depois, ou importar um arquivo JSON cujo próprio bloqueio `Viewport` esteja desativado, não altera o lugar para onde o desfazer leva você.

## Um gesto, uma etapa {#one-gesture-one-step}

Tudo o que um único gesto despacha se torna uma única entrada do histórico.  
Colar várias tabelas e notas de uma vez, ou duplicá-las com `Alt + drag`, é desfeito em uma única etapa.

Um pressionamento de `Delete` ou `Backspace`, ou o item `Delete selected` ou `Delete columns` de um menu de contexto, é uma única etapa, independentemente de quantas tabelas, notas, grupos de tabelas ou colunas ele remova.  
Alternar a chave primária em várias colunas selecionadas é uma única etapa, seja com `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac), seja com `Primary Key on selected columns` no menu de contexto de uma tabela.  
Definir a cor da seleção, ou removê-la com `No color` ou `Remove color`, é uma única etapa, independentemente de quantas tabelas, notas e grupos estejam selecionados. Escolher uma cor que tudo o que está selecionado já tem não registra nenhuma etapa, e `No color` também não registra quando nada do que está selecionado tem cor.  
`Map` ou `Save` em [Mapear colunas](./relationship-editing.md#map-columns) é uma única etapa, junto com as colunas de chave estrangeira que adiciona e os tipos de dados que altera.  
`Import and Add` é uma única etapa, junto com a rolagem que traz o bloco adicionado para a área visível quando ele precisa de uma.

Criar um [grupo de tabelas](./table-groups.md), seja desenhando-o, seja agrupando as tabelas selecionadas com `Group selected tables` ou `T` e depois `G`, é uma única etapa junto com todas as tabelas que ele recebe. Remover um grupo é uma única etapa, e desfazer a remoção traz o grupo de volta com suas tabelas dentro.  
Arrastar um grupo pela barra de título move o grupo e todas as suas tabelas em uma única etapa. Tabelas soltas para dentro ou para fora de um grupo mudam de grupo na mesma etapa do arrasto quando você solta em até cerca de `200ms` após o último movimento, então um único desfazer traz as tabelas de volta para onde estavam e para os grupos em que estavam. Após uma pausa maior antes de soltar, a mudança de grupo é uma etapa à parte, e o primeiro desfazer reverte apenas ela.  
Redimensionar um grupo por uma borda ou um canto é registrado uma única vez, quando você solta.  
Aplicar o [layout automático](./table-related-functions.md#auto-layout) é uma única etapa, incluindo os grupos que ele ajusta em volta das suas tabelas.

`Replace All` em [Localizar e substituir](./find-and-replace.md#replacing) também é uma única etapa, independentemente de quantos nomes de tabela, nomes de coluna, nomes de índice, nomes de grupo de tabelas, comentários e notas ele altere. Quando não altera nada, como quando a opção `Preserve Case` grava cada correspondência de volta como estava, ele não registra nenhuma etapa.  
Um `Replace` isolado é uma única etapa, incluindo a rolagem até a próxima correspondência quando essa correspondência precisa de uma. Quando ele grava sua correspondência de volta como estava, registra apenas essa rolagem, ou nada quando não há rolagem.  
Ir para uma correspondência rola o canvas apenas quando ela ainda não está bem visível — consulte [Onde um salto termina](./table-related-functions.md#where-a-jump-lands). Essa rolagem é registrada como qualquer outra mudança na posição da área visível, então, depois de percorrer as correspondências, o desfazer primeiro reverte essas rolagens, uma por etapa.  
Os outros saltos que terminam no canvas registram suas rolagens da mesma forma: escolher uma linha no explorador, um resultado da pesquisa rápida ou o [botão do cartão](./visualization.md#card-buttons) de link externo no Flow. Um salto que deixa a área visível onde está não registra nada. Escolher uma linha na lista do `Diff Viewer` também não registra nada, pois isso move apenas os lados somente leitura do próprio visualizador de diferenças.

Um arrasto contínuo, um deslocamento do canvas, um zoom, um gesto de pinça ou uma mudança de cor é armazenado em buffer por cerca de `200ms` e também resulta em uma única entrada.  
Um arrasto que percorre menos de `20px` no total não registra nenhuma movimentação. Apenas a mudança de grupo que ele fizer, se houver, é registrada.

Digitar em uma célula ou em uma nota é registrado a cada inserção, e não a cada gesto: cada caractere digitado, cada colagem e cada etapa de uma composição de IME é uma etapa à parte.  
O nome de um grupo de tabelas é registrado uma única vez, quando `Enter` ou a saída do campo o salva, então o nome que você digita em um grupo que acabou de criar é uma etapa separada da criação. `Esc`, ou um nome deixado sem alteração, não registra nada.

## Viagem no tempo {#time-travel}

É aberta pelo botão `Time Travel` na barra de ferramentas, ao lado dos botões de desfazer e refazer.  
O botão não faz nada até que a sessão tenha pelo menos uma alteração registrada.

A viagem no tempo abre uma cópia separada e somente leitura do diagrama, na posição de rolagem e no nível de zoom que o canvas está mostrando, esteja o bloqueio `Viewport` ativado ou não.  
Arraste o controle deslizante, ou clique em qualquer lugar da sua trilha, para percorrer todo o histórico de edições e pré-visualizar cada ponto. A posição mais à esquerda do controle deslizante é o estado uma etapa antes da primeira alteração registrada, e ele começa com o marcador no estado atual.  
A pré-visualização é inerte: ela desenha um minimapa, mas não é possível deslocá-la, rolá-la nem editá-la, e o documento real permanece intacto até você aplicar.

Pressione `Apply` para restaurar o ponto selecionado, ou `Cancel` ou `Esc` para deixar o documento inalterado.

![Abertura da viagem no tempo, arrasto do controle deslizante de volta pela sessão e aplicação de um ponto anterior](/img/demo-time-travel.webp)
