---
sidebar_position: 15
description: Desfazer e refazer edições, o que o histórico registra, os históricos próprios das planilhas do dicionário e como percorrer o histórico do diagrama com a viagem no tempo.
---

# Desfazer e refazer

É possível voltar a um estado de edição anterior ou avançar para um estado posterior.  
O histórico guarda até `2048` alterações.

- Undo: `Ctrl + Z` (Windows/Linux) ou `⌘ + Z` (Mac)
- Redo: `Ctrl + Shift + Z` (Windows/Linux) ou `⌘ + Shift + Z` (Mac)

Na aba ERD, a barra de ferramentas oferece os mesmos dois comandos nos botões `Undo` e `Redo`, ao lado de `Time Travel`. Na aba Dicionário, ela mostra `Undo` e `Redo` sem `Time Travel`, e nenhuma outra aba os mostra.  
Eles só ficam ativos quando há algo para desfazer ou refazer. Um editor `readonly` os oculta, e os atalhos não desfazem nem refazem nada.

Desfazer e refazer atuam sobre o histórico do diagrama apenas na aba ERD.  
Ali, os atalhos ficam inativos enquanto a pesquisa rápida, o painel `Table Properties`, o `Diff Viewer`, a pré-visualização do `Auto Layout`, a caixa de diálogo [`Export image`](./file-import-export.md#image), [Mapear colunas](./relationship-editing.md#map-columns) ou a viagem no tempo está aberta.  
Eles continuam funcionando enquanto o foco do teclado está em qualquer lugar do [explorador](./explorer.md#keys-in-the-explorer), inclusive na árvore, e enquanto o [seletor de cores](./table-related-functions.md#table-and-memo-color-specification) está aberto. Mesmo com o cursor de texto em um dos campos deles, como Localizar, Substituir ou `Hex`, os atalhos desfazem e refazem o diagrama, e não o texto do campo.

Nas outras abas:

- Dicionário: eles desfazem e refazem as edições da planilha exibida, `Domains`, `Words` ou `Terms`, a partir do histórico próprio dessa planilha, nunca do histórico do diagrama. Na planilha `Checks`, não fazem nada — consulte [Planilhas do dicionário](#dictionary-sheets).
- Visualização: no `Flow`, as mesmas teclas voltam e avançam pelo que o Flow mostrou, como fazem `Previous table` e `Next table`, inclusive em um editor `readonly`. Ali elas nunca desfazem nem refazem o diagrama — consulte [Tabela anterior e próxima tabela](./visualization.md#previous-table-and-next-table). No `Graph`, não fazem nada.
- Esquema SQL, Gerador de código e Configurações: eles ficam indisponíveis. Nos campos `Before tables` e `After tables` da aba Esquema SQL, as mesmas teclas desfazem e refazem, em vez disso, a digitação no campo.

O histórico fica na memória durante a sessão atual. Ele não é armazenado no documento, então, ao reabrir um diagrama, o histórico começa vazio.

![Movimentação de uma tabela e remoção de uma coluna com ⌥ + Backspace, depois ambas desfeitas com ⌘ + Z e refeitas com ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## O que o histórico registra {#what-the-history-records}

São registrados:

- Tabelas e notas: adição, remoção, movimentação e cor; o nome, o nome lógico e o comentário de uma tabela; o texto e o tamanho de uma nota.
- Grupos de tabelas: adição, remoção, movimentação, redimensionamento, nome, cor e o grupo em que cada tabela está — consulte [Grupos de tabelas](./table-groups.md).
- Colunas: adição, remoção, reordenação, nome lógico, o domínio ao qual cada uma está vinculada e todas as opções de coluna.
- Os nomes físicos que os dicionários derivam e se cada nome foi escrito por você ou vem dos dicionários: um único desfazer traz de volta um nome e esse estado juntos — consulte [Nomes escritos por você](./dictionary.md#names-of-your-own).
- `Derive Physical Name Again` e `Derive Physical Names Again` — consulte [Derivar nomes físicos novamente](./dictionary.md#derive-physical-names-again).
- Relacionamentos: adição, remoção, alteração de tipo, as colunas definidas em [Mapear colunas](./relationship-editing.md#map-columns) e cada escolha em `On Delete` ou `On Update` — consulte [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Desfazer uma remoção traz o relacionamento de volta com suas ações ON DELETE e ON UPDATE.
- Índices e suas colunas.
- A posição da área visível, o nível de zoom e os botões de alternância do menu `View Option`.
- Os scripts `Before tables` e `After tables` da aba Esquema SQL, uma etapa para cada edição que você aplica ao sair do campo — consulte [Scripts antes e depois das tabelas](./schema-sql.md#before-and-after-scripts).
- Importar um arquivo e adicionar um com [`Import and Add`](./file-import-export.md#import-and-add).

Não são registrados:

- O fornecedor de banco de dados e o nome do banco de dados.
- A linguagem do Gerador de código, `Table Name Case` e `Column Name Case`.
- O tipo de delimitador, seja ele definido na aba Esquema SQL ou na aba Gerador de código.
- As escolhas de `Statements`, `Header`, `Write logical names into empty comments` e `Tables` da aba Esquema SQL, que pertencem à janela do editor — consulte [Painel de opções](./schema-sql.md#options-panel).
- Tudo o que está na aba Configurações, inclusive as linhas de [`Lock`](./settings.md#lock).
- A troca da exibição de nomes, a partir de qualquer um dos seus lugares, esteja o bloqueio dela ativado ou desativado — consulte [Trocar a exibição](./logical-names.md#switching-the-view).
- O tema e o idioma de exibição — consulte [Idioma e tema](./language-and-theme.md).
- Qual tabela, nota ou grupo é desenhado à frente dos demais.
- O [explorador](./explorer.md): abri-lo, fechá-lo ou redimensioná-lo, recolher sua árvore, além do termo e das opções de pesquisa. No entanto, o que `Replace` e `Replace All` alteram é registrado, assim como a rolagem que um salto provoca — consulte [Um gesto, uma etapa](#one-gesture-one-step).
- O zoom e o deslocamento na aba Visualização em qualquer um dos modos, a movimentação de nós do grafo ou de cartões do Flow, `Tidy Up`, a exibição de linhas, o foco em tabelas e os passos com `Previous table` e `Next table` — consulte [O Flow nunca edita o documento](./visualization.md#flow-never-edits-the-document).
- A planilha exibida na aba Dicionário e a pesquisa, a seleção, a rolagem e as larguras de coluna de cada planilha — consulte [Abrir a aba](./dictionary.md#opening-the-tab).

Alterações em qualquer um desses itens não podem ser desfeitas.

As edições feitas na aba Dicionário podem ser desfeitas, mas vão para o histórico da própria planilha, e não para este, então o desfazer na aba ERD nunca reverte nenhuma delas, nem mesmo o novo `Data Type` de um domínio e os tipos de coluna que ele altera — consulte [Planilhas do dicionário](#dictionary-sheets).

As alterações que chegam de outro editor também não são registradas, então o desfazer reverte apenas as suas. Em uma [sessão colaborativa](../../api/advanced/collaborative-editing.md), cada editor desfaz as próprias alterações, e um agente de codificação que edita pelo [servidor MCP](../../mcp/live-and-headless.md#undo) desfaz as próprias com `erd_undo`.

Desfazer um `Import`, que substitui o diagrama inteiro, traz de volta o diagrama anterior tal como o editor o mantinha quando você importou, com cada [bloqueio](./settings.md#lock) ativado ou desativado e cada valor bloqueado como estavam naquele momento.  
Se esse diagrama tinha `Viewport` bloqueado, a área visível e o zoom voltam para a área visível bloqueada, onde o diagrama se abre, e não para onde você estava. Com o `Viewport` dele desbloqueado, eles voltam para onde você estava quando importou. As outras configurações bloqueadas, como a aba em que você está, a linguagem do Gerador de código ou a exibição de nomes, ficam como estão na sua tela.  
Um diagrama novo começa com todos os bloqueios ativados. Desbloqueie `Viewport` antes de importar para manter sua área visível em um desfazer desse tipo. Desbloqueá-lo depois, ou importar um arquivo JSON cujo próprio bloqueio `Viewport` esteja desativado, não altera o lugar para onde o desfazer leva você.

Desfazer a importação de um arquivo JSON também traz de volta as palavras, os termos e os domínios que o diagrama anterior tinha. Uma importação de Esquema SQL, GraphQL, DBML ou AML mantém os dicionários, então desfazê-la e refazê-la os deixa como estão, inclusive com as edições feitas na aba Dicionário desde então.

Um desfazer ou refazer na aba ERD que vincula novamente uma coluna a um domínio, ou que traz de volta uma coluna vinculada a um, dá à coluna o tipo de dados do domínio tal como ele está agora. Um que restaura outro tipo em uma coluna vinculada a desvincula — consulte [Domínios e tipos de dados](./dictionary.md#domains-and-data-types).

## Um gesto, uma etapa {#one-gesture-one-step}

Tudo o que um único gesto despacha se torna uma única entrada do histórico.  
Colar várias tabelas e notas de uma vez, ou duplicá-las com `Alt + drag`, é desfeito em uma única etapa.

Um pressionamento de `Delete` ou `Backspace`, ou o item `Delete selected` ou `Delete columns` de um menu de contexto, é uma única etapa, independentemente de quantas tabelas, notas, grupos de tabelas ou colunas ele remova.  
Alternar a chave primária em várias colunas selecionadas é uma única etapa, seja com `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac), seja com `Primary Key on selected columns` no menu de contexto de uma tabela.  
Definir a cor da seleção, ou removê-la com `No color` ou `Remove color`, é uma única etapa, independentemente de quantas tabelas, notas e grupos estejam selecionados. Escolher uma cor que tudo o que está selecionado já tem não registra nenhuma etapa, e `No color` também não registra quando nada do que está selecionado tem cor.  
`Map` ou `Save` em [Mapear colunas](./relationship-editing.md#map-columns) é uma única etapa, junto com as colunas de chave estrangeira que adiciona e os tipos de dados que altera.  
`Import and Add` é uma única etapa, junto com a rolagem que traz o bloco adicionado para a área visível quando ele precisa de uma.

Escolher um termo da lista sob uma célula de nome lógico é uma única etapa: o nome lógico, o nome físico derivado e, no caso de uma coluna, o domínio do termo com seu tipo de dados — consulte [Completar nomes de termos](./logical-names.md#completing-term-names).  
Escolher um domínio na célula Domínio de uma coluna é uma única etapa, junto com o tipo de dados que ele dá à coluna e o que a [sincronização do tipo de dados nos relacionamentos](./settings.md#relationship-datatype-sync) repassa pelos relacionamentos. Escolher `None`, que desvincula a coluna, também é uma única etapa — consulte [A célula Domínio](./logical-names.md#the-domain-cell). Digitar em uma coluna vinculada um tipo de dados diferente do tipo do seu domínio desvincula a coluna na etapa dessa inserção.  
`Derive Physical Name Again` ou `Derive Physical Names Again` é uma única etapa, independentemente de quantos nomes, vínculos com domínios e tipos de dados ele altere. Ele só deixa de registrar uma etapa quando não altera nada. Devolver aos dicionários um nome escrito por você é uma alteração, mesmo quando o nome já contém o que eles dão.

Criar um [grupo de tabelas](./table-groups.md), seja desenhando-o, seja agrupando as tabelas selecionadas com `Group selected tables` ou `T` e depois `G`, é uma única etapa junto com todas as tabelas que ele recebe. Remover um grupo é uma única etapa, e desfazer a remoção traz o grupo de volta com suas tabelas dentro.  
Arrastar um grupo pela barra de título move o grupo e todas as suas tabelas em uma única etapa. Tabelas soltas para dentro ou para fora de um grupo mudam de grupo na mesma etapa do arrasto quando você solta em até cerca de `200ms` após o último movimento, então um único desfazer traz as tabelas de volta para onde estavam e para os grupos em que estavam. Após uma pausa maior antes de soltar, a mudança de grupo é uma etapa à parte, e o primeiro desfazer reverte apenas ela.  
Redimensionar um grupo por uma borda ou um canto é registrado uma única vez, quando você solta.  
Aplicar o [layout automático](./table-related-functions.md#auto-layout) é uma única etapa, incluindo os grupos que ele ajusta em volta das suas tabelas.

`Replace All` em [Localizar e substituir](./find-and-replace.md#replacing) também é uma única etapa, independentemente de quantos nomes de tabela, nomes de coluna, nomes lógicos, nomes de índice, nomes de grupo de tabelas, comentários e notas ele altere, incluindo os nomes físicos e os vínculos com domínios que os nomes lógicos derivam. Quando não altera nada, como quando a opção `Preserve Case` grava cada correspondência de volta como estava, ele não registra nenhuma etapa.  
Um `Replace` isolado é uma única etapa, incluindo o que um nome lógico deriva e a rolagem até a próxima correspondência quando essa correspondência precisa de uma. Quando ele grava sua correspondência de volta como estava, registra apenas essa rolagem, ou nada quando não há rolagem.  
Ir para uma correspondência rola o canvas apenas quando ela ainda não está bem visível — consulte [Onde um salto termina](./table-related-functions.md#where-a-jump-lands). Essa rolagem é registrada como qualquer outra mudança na posição da área visível, então, depois de percorrer as correspondências, o desfazer primeiro reverte essas rolagens, uma por etapa.  
Os outros saltos que terminam no canvas registram suas rolagens da mesma forma: escolher uma linha no explorador, um resultado da pesquisa rápida, uma verificação da planilha `Checks` da aba Dicionário que nomeia uma tabela ou uma coluna ou o [botão do cartão](./visualization.md#card-buttons) de link externo no Flow. Um salto que deixa a área visível onde está não registra nada. Escolher uma linha na lista do `Diff Viewer` também não registra nada, pois isso move apenas os lados somente leitura do próprio visualizador de diferenças.

Um arrasto contínuo, um deslocamento do canvas, um zoom, um gesto de pinça ou uma mudança de cor é armazenado em buffer por cerca de `200ms` e também resulta em uma única entrada.  
Um arrasto que percorre menos de `20px` no total não registra nenhuma movimentação. Apenas a mudança de grupo que ele fizer, se houver, é registrada.

Digitar em uma célula ou em uma nota é registrado a cada inserção, e não a cada gesto: cada caractere digitado, cada colagem e cada etapa de uma composição de IME é uma etapa à parte.  
Uma célula de nome lógico é registrada da mesma forma. Quando seu editor se fecha com um nome lógico diferente daquele com que abriu, o nome físico que os dicionários derivam dele é mais uma etapa depois da digitação. O primeiro desfazer reverte apenas esse nome, com o domínio e o tipo de dados que um termo trouxe, e mantém o nome lógico que você digitou. Quando nada é derivado, nada mais é registrado — consulte [Escrever um nome lógico](./logical-names.md#writing-a-logical-name).  
O nome de um grupo de tabelas é registrado uma única vez, quando `Enter` ou a saída do campo o salva, então o nome que você digita em um grupo que acabou de criar é uma etapa separada da criação. `Esc`, ou um nome deixado sem alteração, não registra nada.

## Planilhas do dicionário {#dictionary-sheets}

As planilhas `Domains`, `Words` e `Terms` da aba Dicionário mantêm, cada uma, um histórico próprio, separado do histórico do diagrama. Cada edição feita na aba vai para o histórico da planilha cujas linhas ela grava. Como o do diagrama, cada histórico guarda até `2048` etapas e fica na memória durante a sessão.

- Com o foco do teclado na aba, `Ctrl + Z` (Windows/Linux) ou `⌘ + Z` (Mac) desfaz a última edição da planilha exibida, e `Ctrl + Shift + Z` (Windows/Linux) ou `⌘ + Shift + Z` (Mac) refaz a última desfeita.
- Os botões `Undo` e `Redo` da barra de ferramentas fazem o mesmo e só ficam ativos quando a planilha exibida tem uma edição para desfazer ou refazer. Pressioná-los deixa o foco do teclado onde estava, na grade ou no campo de pesquisa. A aba não tem `Time Travel`.
- Na planilha `Checks`, onde nada é editado, os botões ficam inativos, e nem eles nem as teclas fazem nada.
- Com a edição de uma célula aberta, ou com o cursor de texto no campo de pesquisa da aba, as teclas desfazem e refazem, em vez disso, a digitação ali.

Os históricos nunca se cruzam. O desfazer na aba ERD nunca reverte a edição de uma planilha, e o desfazer de uma planilha nunca reverte a edição de outra planilha nem a do diagrama. Cada planilha mantém seu histórico enquanto você troca de planilha ou de aba.

Cada um dos itens a seguir é uma única etapa da sua planilha:

- A edição de uma célula, registrada uma única vez quando é gravada, e não a cada caractere digitado, e apenas quando altera o valor — consulte [Editar células](./dictionary.md#editing-cells).
- Uma colagem, incluindo as linhas que ela adiciona, e a limpeza das células selecionadas com `Delete` ou `Backspace` — consulte [Copiar e colar](./dictionary.md#copying-and-pasting).
- `Add Row` e cada inserção ou exclusão de linhas, pela barra, pelo menu da grade ou pelas teclas, independentemente de quantas linhas ela abranja — consulte [Adicionar e excluir linhas](./dictionary.md#adding-and-deleting-rows).
- O domínio de um termo escolhido na lista dele, inclusive `None` — consulte [O domínio de um termo](./dictionary.md#a-terms-domain).
- Uma classificação — consulte [Classificar](./dictionary.md#sorting).
- Um arquivo CSV importado com `Import CSV`, independentemente de quantas linhas ele adicione ou atualize. Ele é uma etapa da planilha que o arquivo preenche, que a aba então exibe, qualquer que seja a planilha a partir da qual você o importou — consulte [Importar](./dictionary.md#importing).

Uma gravação que não altera nada, como o mesmo arquivo importado novamente ou a classificação de uma planilha que já está nessa ordem, não registra nenhuma etapa, assim como uma gravação recusada com uma notificação `Nothing saved: …`. Quando um termo sem `Physical Name` recebe um nome, o nome físico que suas palavras compõem faz parte da etapa dessa edição.

O novo `Data Type` de um domínio é uma única etapa da planilha `Domains`, junto com os tipos que ele dá às colunas vinculadas ao domínio e às que a sincronização do tipo de dados nos relacionamentos alcança a partir delas — consulte [Domínios e tipos de dados](./dictionary.md#domains-and-data-types).  
Desfazer ou refazer essa etapa muda o tipo das colunas vinculadas ao domínio naquele momento, então uma coluna que, desde então, você vinculou a outro domínio ou cujo tipo você alterou mantém seu tipo. Uma coluna que a etapa desvinculou, como uma chave estrangeira que a sincronização tirou de um domínio próprio, só é vinculada novamente enquanto ainda estiver desvinculada e ainda tiver o tipo com que a etapa a deixou.

Um editor `readonly` oculta os botões, e as teclas não desfazem nem refazem nada.  
As alterações de colaboradores e de agentes de codificação também não são registradas no histórico de uma planilha.

O histórico de todas as planilhas é esvaziado quando os dicionários são substituídos: por um `Import` de um arquivo JSON, seu ou de um colaborador, pelo desfazer ou refazer dele e pelo carregamento de outro diagrama no editor. Um `Import` de Esquema SQL, GraphQL, DBML ou AML mantém os dicionários e, com eles, o histórico de todas as planilhas, também ao ser desfeito e refeito.

## Viagem no tempo {#time-travel}

É aberta pelo botão `Time Travel` na barra de ferramentas, ao lado dos botões de desfazer e refazer na aba ERD.  
O botão não faz nada até que o histórico do diagrama tenha pelo menos uma alteração registrada.

A viagem no tempo abre uma cópia separada e somente leitura do diagrama, na posição de rolagem, no nível de zoom e na [exibição de nomes](./logical-names.md#name-view) que o canvas está mostrando, esteja o bloqueio `Viewport` ou `Name View` ativado ou não.  
Ela percorre apenas o histórico do diagrama, então as edições das planilhas do dicionário não estão entre os seus pontos.  
Arraste o controle deslizante, ou clique em qualquer lugar da sua trilha, para percorrer todo o histórico de edições e pré-visualizar cada ponto. A posição mais à esquerda do controle deslizante é o estado uma etapa antes da primeira alteração registrada, e ele começa com o marcador no estado atual.  
A pré-visualização é inerte: ela desenha um minimapa, mas não é possível deslocá-la, rolá-la nem editá-la, e o documento real permanece intacto até você aplicar.

Pressione `Apply` para restaurar o ponto selecionado, ou `Cancel` ou `Esc` para deixar o documento inalterado.

![Abertura da viagem no tempo, arrasto do controle deslizante de volta pela sessão e aplicação de um ponto anterior](/img/demo-time-travel.webp)
