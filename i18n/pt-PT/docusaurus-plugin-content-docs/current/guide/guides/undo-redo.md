---
sidebar_position: 15
description: Anular e refazer edições, o que o histórico regista, os históricos próprios das folhas do dicionário e percorrer passo a passo o histórico do diagrama com a viagem no tempo.
---

# Anular e refazer

Pode recuar para um estado de edição anterior ou avançar para um posterior.  
O histórico guarda até `2048` alterações.

- Undo: `Ctrl + Z` (Windows/Linux) ou `⌘ + Z` (Mac)
- Redo: `Ctrl + Shift + Z` (Windows/Linux) ou `⌘ + Shift + Z` (Mac)

No separador ERD, a barra de ferramentas disponibiliza os mesmos dois comandos nos botões `Undo` e `Redo`, ao lado do botão `Time Travel`. No separador Dicionário, mostra os botões `Undo` e `Redo` sem o botão `Time Travel`, e nenhum outro separador os mostra.  
Só ficam ativos quando há algo para anular ou refazer. Um editor `readonly` oculta-os e o `Time Travel`, e os atalhos não anulam nem refazem nada.

Só no separador ERD é que anular e refazer atuam sobre o histórico do diagrama.  
Aí, os atalhos ficam inativos enquanto a pesquisa rápida, o painel `Table Properties`, o visualizador `Diff Viewer`, a pré-visualização de `Auto Layout`, a caixa de diálogo [`Export image`](./file-import-export.md#image), a caixa de diálogo [Mapear colunas](./relationship-editing.md#map-columns) ou a viagem no tempo estão abertos.  
Continuam a funcionar enquanto o teclado está em qualquer ponto do [explorador](./explorer.md#keys-in-the-explorer), incluindo a sua árvore, e enquanto o [seletor de cores](./table-related-functions.md#table-and-memo-color-specification) está aberto. Mesmo com o cursor de texto num dos respetivos campos, como os campos Localizar, Substituir ou `Hex`, anulam e refazem o diagrama, e não o texto do campo.

Nos outros separadores:

- Dicionário: anulam e refazem as edições da folha apresentada, `Domains`, `Words` ou `Terms`, a partir do histórico próprio dessa folha, e nunca as do diagrama. Na folha `Checks`, não fazem nada — consulte [Folhas do dicionário](#dictionary-sheets).
- Visualização: no modo `Flow`, as mesmas teclas recuam e avançam por aquilo que o Flow mostrou, tal como os botões `Previous table` e `Next table`, também num editor `readonly`. Aí, nunca anulam nem refazem o diagrama — consulte [Tabela anterior e tabela seguinte](./visualization.md#previous-table-and-next-table). No modo `Graph`, não fazem nada.
- Esquema SQL, Gerador de código e Definições: não estão disponíveis. Nos campos `Before tables` e `After tables` do separador Esquema SQL, as mesmas teclas anulam e refazem, em vez disso, o que escreve no campo.

O histórico fica em memória durante a sessão atual. Não é guardado no documento, pelo que, ao reabrir um diagrama, o histórico começa vazio.

![Mover uma tabela e remover uma coluna com ⌥ + Backspace, depois anular as duas ações com ⌘ + Z e refazê-las com ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## O que o histórico regista {#what-the-history-records}

O que é registado:

- Tabelas e notas: adição, remoção, movimento e cor; o nome, o nome lógico e o comentário de uma tabela; o texto e o tamanho de uma nota.
- Grupos de tabelas: adição, remoção, movimento, redimensionamento, nome, cor e o grupo em que cada tabela está — consulte [Grupos de tabelas](./table-groups.md).
- Colunas: adição, remoção, reordenação, nome lógico, o domínio a que cada uma está vinculada e todas as opções das colunas.
- Os nomes físicos que os dicionários derivam e se cada nome foi escrito por si ou pertence aos dicionários: uma anulação repõe um nome e esse estado em conjunto — consulte [Nomes escritos por si](./dictionary.md#names-of-your-own).
- As opções `Derive Physical Name Again` e `Derive Physical Names Again` — consulte [Voltar a derivar os nomes físicos](./dictionary.md#derive-physical-names-again).
- Relações: adição, remoção, mudança de tipo, as colunas definidas em [Mapear colunas](./relationship-editing.md#map-columns) e cada escolha feita em `On Delete` ou `On Update` — consulte [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Anular uma remoção repõe a relação com as respetivas ações ON DELETE e ON UPDATE.
- Índices e as respetivas colunas.
- Posição da vista, nível de zoom e os interruptores do menu `View Option`.
- Os scripts `Before tables` e `After tables` do separador Esquema SQL, um passo por cada edição que aplica ao sair do campo — consulte [Scripts antes e depois das tabelas](./schema-sql.md#before-and-after-scripts).
- Importar um ficheiro e adicionar um com a opção [`Import and Add`](./file-import-export.md#import-and-add).

O que não é registado:

- A base de dados e o nome da base de dados.
- A linguagem do Gerador de código, a opção `Table Name Case` e a opção `Column Name Case`.
- O tipo de delimitador, quer seja definido no separador Esquema SQL, quer no separador Gerador de código.
- As escolhas `Statements`, `Header`, `Write logical names into empty comments` e `Tables` do separador Esquema SQL, que pertencem à janela do editor — consulte [Painel de opções](./schema-sql.md#options-panel).
- Tudo o que está no separador Definições, incluindo as linhas [`Lock`](./settings.md#lock).
- Mudar a vista de nomes, a partir de qualquer um dos sítios onde está disponível, quer o seu bloqueio esteja ativado quer desativado — consulte [Mudar de vista](./logical-names.md#switching-the-view).
- O tema e o idioma de apresentação — consulte [Idioma e tema](./language-and-theme.md).
- Que tabela, nota ou grupo é desenhado à frente dos outros.
- O [explorador](./explorer.md): abri-lo, fechá-lo ou redimensioná-lo, recolher a sua árvore, bem como o texto e as opções de pesquisa. No entanto, o que os botões `Replace` e `Replace All` alteram é registado, tal como o deslocamento que um salto provoca — consulte [Um gesto, um passo](#one-gesture-one-step).
- O zoom e o deslocamento da vista no separador Visualização, em qualquer dos modos, mover nós do grafo ou cartões do Flow, o botão `Tidy Up`, a apresentação das linhas, focar em tabelas e recuar ou avançar com os botões `Previous table` e `Next table` — consulte [O Flow nunca edita o documento](./visualization.md#flow-never-edits-the-document).
- A folha apresentada no separador Dicionário e a pesquisa, a seleção, o deslocamento e as larguras das colunas de cada folha — consulte [Abrir o separador](./dictionary.md#opening-the-tab).

As alterações a qualquer um destes elementos não podem ser anuladas.

Um editor só de leitura não regista nada. A posição da vista, o zoom e as opções de `View Option` continuam a mudar aí, tal como o separador, a vista de nomes, a base de dados e as definições de código, mas apenas nesse ecrã, pelo que não há nada para anular — consulte [Editores só de leitura](./settings.md#read-only-editors) em Definições.

As edições feitas no separador Dicionário podem ser anuladas, mas entram no histórico da sua própria folha e não neste, pelo que a anulação no separador ERD nunca reverte nenhuma delas, nem sequer o novo valor `Data Type` de um domínio e os tipos das colunas que este altera — consulte [Folhas do dicionário](#dictionary-sheets).

As alterações que chegam de outro editor também não são registadas, pelo que a anulação só reverte as suas. Numa [sessão colaborativa](../../api/advanced/collaborative-editing.md), cada editor anula as suas próprias alterações, e um agente de programação que edita através do [servidor MCP](../../mcp/live-and-headless.md#undo) anula as suas com `erd_undo`.

Anular uma importação feita com a opção `Import`, que substitui o diagrama inteiro, repõe o diagrama anterior tal como o editor o tinha quando importou, com cada [bloqueio](./settings.md#lock) ativado ou desativado e cada valor bloqueado tal como estavam nessa altura.  
Se esse diagrama tinha a definição `Viewport` bloqueada, a vista e o zoom voltam à vista bloqueada, onde o diagrama se abre, e não ao ponto onde estava. Com a sua definição `Viewport` desbloqueada, voltam ao ponto onde estava quando importou. As outras definições bloqueadas, como o separador em que está, a linguagem do Gerador de código ou a vista de nomes, ficam como estão no seu ecrã.  
Um diagrama novo começa com todos os bloqueios ativados. Desative o bloqueio `Viewport` antes de importar para manter a sua vista numa anulação deste tipo. Desativá-lo depois, ou importar um ficheiro JSON cujo próprio bloqueio `Viewport` esteja desativado, não muda o ponto para onde a anulação o leva.

Anular a importação de um ficheiro JSON também repõe as palavras, os termos e os domínios que o diagrama anterior tinha. Uma importação de Esquema SQL, GraphQL, DBML ou AML mantém os dicionários, pelo que anulá-la e refazê-la os deixa como estão, incluindo as edições feitas entretanto no separador Dicionário.

Uma anulação ou uma ação de refazer no separador ERD que volte a vincular uma coluna a um domínio, ou que reponha uma coluna vinculada a um domínio, dá à coluna o tipo de dados do domínio tal como está agora. Uma que reponha outro tipo numa coluna vinculada desvincula-a — consulte [Domínios e tipos de dados](./dictionary.md#domains-and-data-types).

## Um gesto, um passo {#one-gesture-one-step}

Tudo o que um único gesto despacha torna-se uma só entrada do histórico.  
Colar várias tabelas e notas de uma vez, ou duplicá-las com `Alt + drag`, é anulado num único passo.

Premir `Delete` ou `Backspace`, ou escolher a opção `Delete selected` ou `Delete columns` num menu de contexto, é um passo, seja qual for o número de tabelas, notas, grupos de tabelas ou colunas que remove.  
Alternar a chave primária em várias colunas selecionadas é um passo, quer com `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac), quer com a opção `Primary Key on selected columns` do menu de contexto de uma tabela.  
Definir a cor da seleção, ou retirá-la com a opção `No color` ou `Remove color`, é um passo, seja qual for o número de tabelas, notas e grupos selecionados. Escolher uma cor que tudo o que está selecionado já tem não regista nenhum passo, e o mesmo acontece com a opção `No color` quando nada do que está selecionado tem cor.  
Premir o botão `Map` ou `Save` na caixa de diálogo [Mapear colunas](./relationship-editing.md#map-columns) é um passo, juntamente com as colunas de chave externa que adiciona e os tipos de dados que altera.  
A opção `Import and Add` é um passo, juntamente com o deslocamento que mostra o bloco adicionado, quando este precisa de um.

Escolher um termo na lista por baixo de uma célula do nome lógico é um passo: o nome lógico, o nome físico que este deriva e, no caso de uma coluna, o domínio do termo com o respetivo tipo de dados — consulte [Completar os nomes dos termos](./logical-names.md#completing-term-names).  
Escolher um domínio na célula Domínio de uma coluna é um passo, juntamente com o tipo de dados que este dá à coluna e o que a definição [Sincronização do tipo de dados nas relações](./settings.md#relationship-datatype-sync) propaga ao longo das relações. Escolher a opção `None`, que desvincula a coluna, também é um passo — consulte [A célula Domínio](./logical-names.md#the-domain-cell). Escrever numa coluna vinculada um tipo de dados diferente do tipo do seu domínio desvincula a coluna no passo dessa introdução de texto.  
A opção `Derive Physical Name Again` ou `Derive Physical Names Again` é um passo, seja qual for o número de nomes, de vínculos a domínios e de tipos de dados que altere. Só não regista nenhum passo quando não altera nada. Devolver aos dicionários um nome escrito por si é uma alteração, mesmo quando o nome já contém o que estes dão.

Criar um [grupo de tabelas](./table-groups.md), desenhando-o ou agrupando as tabelas selecionadas com a opção `Group selected tables` ou com `T` e depois `G`, é um passo, juntamente com todas as tabelas que abrange. Remover um grupo é um passo, e anular essa remoção repõe o grupo com as suas tabelas lá dentro.  
Arrastar um grupo pela barra de título move o grupo e todas as suas tabelas num único passo. As tabelas largadas para dentro ou para fora de um grupo mudam de grupo no mesmo passo que o seu arrasto quando solta o botão até cerca de `200ms` após o último movimento, pelo que uma anulação as repõe onde estavam e nos grupos em que estavam. Após uma pausa mais longa antes de soltar, a mudança de grupo é um passo próprio, e a primeira anulação reverte apenas essa mudança.  
Redimensionar um grupo por um bordo ou por um canto é registado uma única vez, quando solta o botão.  
Aplicar a [disposição automática](./table-related-functions.md#auto-layout) é um passo, incluindo os grupos que ajusta à volta das respetivas tabelas.

A ação `Replace All` de [Localizar e substituir](./find-and-replace.md#replacing) também é um passo, seja qual for o número de nomes de tabelas, nomes de colunas, nomes lógicos, nomes de índices, nomes de grupos de tabelas, comentários e notas que altera, incluindo os nomes físicos e os vínculos a domínios que os nomes lógicos derivam. Quando não altera nada, como quando o interruptor `Preserve Case` volta a escrever cada correspondência tal como estava, não regista nenhum passo.  
Uma única ação `Replace` é um passo, incluindo o que um nome lógico deriva e o deslocamento até à correspondência seguinte, quando essa correspondência precisa de um. Quando volta a escrever a sua correspondência tal como estava, regista apenas esse deslocamento, ou nada, quando não há nenhum.  
Ir para uma correspondência só desloca a tela quando a correspondência ainda não está bem visível — consulte [Onde termina um salto](./table-related-functions.md#where-a-jump-lands). Esse deslocamento é registado como qualquer outra mudança da posição da vista, pelo que, depois de percorrer as correspondências, a anulação reverte primeiro esses deslocamentos, um por passo.  
Os outros saltos que terminam na tela registam os seus deslocamentos da mesma forma: escolher uma linha no explorador, um resultado da pesquisa rápida, uma verificação da folha `Checks` do separador Dicionário que indica uma tabela ou uma coluna, ou o [botão do cartão](./visualization.md#card-buttons) de ligação externa no Flow. Um salto que deixa a vista onde está não regista nada. Escolher uma linha na lista do visualizador `Diff Viewer` também não regista nada, uma vez que move apenas os lados só de leitura do próprio visualizador de diferenças.

Um arrasto contínuo, um deslocamento da vista da tela, um zoom, um gesto de pinça ou uma mudança de cor é acumulado durante cerca de `200ms` e também fica registado como uma única entrada.  
Um arrasto que percorre menos de `20px` no total não regista nenhum movimento. Só é registada a mudança de grupo que provoque, se houver alguma.

A escrita numa célula ou numa nota é registada por cada introdução de texto, e não por gesto: cada carácter escrito, cada colagem e cada passo de uma composição IME é um passo próprio.  
Uma célula do nome lógico é registada da mesma forma. Quando o seu editor se fecha com um nome lógico diferente daquele com que se abriu, o nome físico que os dicionários derivam dele é mais um passo depois da escrita. A primeira anulação reverte apenas esse nome, com o domínio e o tipo de dados que um termo trouxe, e mantém o nome lógico que escreveu. Quando nada é derivado, nada mais é registado — consulte [Escrever um nome lógico](./logical-names.md#writing-a-logical-name).  
O nome de um grupo de tabelas é registado uma única vez, quando é guardado com `Enter` ou ao sair do campo, pelo que o nome que escreve num grupo que acabou de criar é um passo separado da sua criação. `Esc`, ou um nome deixado sem alterações, não regista nada.

## Folhas do dicionário {#dictionary-sheets}

As folhas `Domains`, `Words` e `Terms` do separador Dicionário mantêm, cada uma, um histórico próprio, à parte do histórico do diagrama. Cada edição feita no separador entra no histórico da folha cujas linhas escreve. Tal como o do diagrama, cada histórico guarda até `2048` passos e fica em memória durante a sessão.

- Com o teclado no separador, `Ctrl + Z` (Windows/Linux) ou `⌘ + Z` (Mac) anula a última edição da folha apresentada, e `Ctrl + Shift + Z` (Windows/Linux) ou `⌘ + Shift + Z` (Mac) refaz a última anulada.
- Os botões `Undo` e `Redo` da barra de ferramentas fazem o mesmo e só ficam ativos quando a folha apresentada tem uma edição para anular ou refazer. Premi-los deixa o teclado onde estava, na grelha ou no campo de pesquisa. O separador não tem o botão `Time Travel`.
- Na folha `Checks`, onde nada é editado, os botões continuam inativos, e nem eles nem as teclas fazem nada.
- Com uma edição de célula aberta, ou com o cursor de texto no campo de pesquisa do separador, as teclas anulam e refazem, em vez disso, o que escreve aí.

Os históricos nunca se cruzam. A anulação no separador ERD nunca reverte uma edição de uma folha, e a anulação de uma folha nunca reverte uma edição de outra folha nem do diagrama. Cada folha mantém o seu histórico enquanto muda de folha ou de separador.

Cada um dos seguintes é um passo da respetiva folha:

- Uma edição de célula, registada uma única vez quando é escrita, e não por cada carácter escrito, e apenas quando altera o valor — consulte [Editar células](./dictionary.md#editing-cells).
- Uma colagem, incluindo as linhas que adiciona, e limpar as células selecionadas com `Delete` ou `Backspace` — consulte [Copiar e colar](./dictionary.md#copying-and-pasting).
- O botão `Add Row` e cada inserção ou eliminação de linhas, a partir da barra, do menu da grelha ou das teclas, seja qual for o número de linhas que abranja — consulte [Adicionar e eliminar linhas](./dictionary.md#adding-and-deleting-rows).
- O domínio de um termo escolhido na respetiva lista, incluindo a opção `None` — consulte [O domínio de um termo](./dictionary.md#a-terms-domain).
- Uma ordenação — consulte [Ordenar](./dictionary.md#sorting).
- Um ficheiro CSV importado com o botão `Import CSV`, seja qual for o número de linhas que adicione ou atualize. É um passo da folha que o ficheiro preenche, que o separador passa então a mostrar, seja qual for a folha a partir da qual o importou — consulte [Importar](./dictionary.md#importing).

Uma escrita que não altera nada, como o mesmo ficheiro importado de novo ou uma ordenação de uma folha que já está por essa ordem, não regista nenhum passo, e o mesmo acontece com uma escrita recusada com uma notificação `Nothing saved: …`. Quando um termo sem valor na coluna `Physical Name` recebe um nome, o nome físico que as suas palavras compõem faz parte do passo dessa edição.

O novo valor `Data Type` de um domínio é um passo da folha `Domains`, juntamente com os tipos que este dá às colunas vinculadas ao domínio e às que a definição Sincronização do tipo de dados nas relações alcança a partir delas — consulte [Domínios e tipos de dados](./dictionary.md#domains-and-data-types).  
Anulá-lo ou refazê-lo redefine o tipo das colunas vinculadas ao domínio nesse momento, pelo que uma coluna que, entretanto, vinculou a outro domínio ou cujo tipo alterou mantém o seu tipo. Uma coluna que o passo desvinculou, como uma chave externa que a sincronização desvinculou de um domínio próprio, só volta a ser vinculada enquanto ainda estiver desvinculada e ainda tiver o tipo com que o passo a deixou.

Um editor `readonly` oculta os botões, e as teclas não anulam nem refazem nada.  
As alterações de colaboradores e de agentes de programação também não são registadas no histórico de uma folha.

O histórico de todas as folhas é esvaziado quando os dicionários são substituídos: por uma importação de um ficheiro JSON feita com a opção `Import`, sua ou de um colaborador, por anulá-la ou refazê-la, e ao carregar outro diagrama no editor. Uma importação de Esquema SQL, GraphQL, DBML ou AML feita com a opção `Import` mantém os dicionários e, com eles, o histórico de todas as folhas, também quando é anulada e refeita.

## Viagem no tempo {#time-travel}

Abre-se com o botão `Time Travel` da barra de ferramentas, ao lado dos botões de anular e refazer no separador ERD.  
O botão não faz nada enquanto o histórico do diagrama não tiver pelo menos uma alteração registada. Um editor só de leitura não mostra esse botão, e um editor que passa a só de leitura fecha a Viagem no tempo sem a aplicar.

A viagem no tempo abre uma cópia separada e só de leitura do diagrama, na posição de deslocamento, no nível de zoom e na [vista de nomes](./logical-names.md#name-view) que a tela está a mostrar, esteja ou não ativado o bloqueio `Viewport` ou `Name View`.  
Percorre apenas o histórico do diagrama, pelo que as edições das folhas do dicionário não estão entre os seus pontos.  
Arraste o controlo de deslize, ou clique em qualquer ponto da sua calha, para percorrer todo o histórico de edições e pré-visualizar cada ponto. A posição mais à esquerda do controlo de deslize é o estado um passo antes da primeira alteração registada, e o controlo abre-se com o cursor no estado atual.  
A pré-visualização é inerte: desenha um minimapa, mas não pode deslocar a vista, percorrê-la nem editá-la, e o documento real mantém-se intacto até aplicar.

Prima o botão `Apply` para restaurar o ponto selecionado, ou o botão `Cancel` ou a tecla `Esc` para deixar o documento inalterado.

![Abrir a viagem no tempo, arrastar o controlo de deslize para trás ao longo da sessão e aplicar um ponto anterior](/img/demo-time-travel.webp)
