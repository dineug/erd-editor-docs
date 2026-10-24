---
sidebar_position: 9
description: Navegar pelas tabelas do diagrama, com suas colunas, índices e chaves estrangeiras, pelos seus grupos de tabelas e pelas suas notas em uma árvore encaixada ao lado do canvas ERD, e ir para qualquer um deles com um clique.
---

# Explorador

O explorador é um painel encaixado na borda esquerda do canvas ERD que lista o diagrama como uma árvore: suas tabelas, cada uma com suas colunas, índices e chaves estrangeiras, depois seus [grupos de tabelas](./table-groups.md) e depois suas notas. Clique em uma linha para ir até o que ela representa no canvas.  
O explorador estreita o canvas em vez de cobri-lo. Ele faz parte do editor de diagramas e não é a exibição Explorer do VS Code nem o explorador de arquivos do Obsidian.

![Abertura do explorador pela barra de ferramentas, ida até products e depois até a coluna status e a chave estrangeira member_id de orders, recolhimento com Collapse All, alargamento do painel e seu fechamento](/img/demo-explorer.webp)

[Localizar e substituir](./find-and-replace.md) fica no topo do explorador, entre a barra de título e a árvore. Enquanto o campo Localizar contém texto, a árvore mostra apenas o que corresponde à pesquisa — consulte [Os resultados](./find-and-replace.md#the-results).  
A árvore em si nunca altera o diagrama: ela não permite renomear, arrastar, excluir nem mostrar e ocultar. Uma substituição é a única edição que o painel faz.

O estado próprio do explorador pertence apenas a você: se ele está aberto, sua largura, o recolhimento das linhas, a linha em que o teclado está, a posição de rolagem e a pesquisa.  
Nada disso é salvo no arquivo, registrado no histórico de desfazer, compartilhado com colaboradores nem armazenado no navegador. Esse estado é mantido enquanto o editor permanece aberto, ao trocar de aba e entre documentos carregados no mesmo editor. Um editor recém-aberto começa com o explorador fechado.

## Abrir e fechar {#opening-and-closing}

Abra-o de qualquer uma destas formas:

- O botão `Explorer` da barra de ferramentas, logo depois de `Search`, com um ícone de árvore. Sua dica de ferramenta diz `Explorer (Ctrl + F)` (Windows/Linux) ou `Explorer (⌘ + F)` (Mac).
- `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac), chamado `Toggle Explorer` na aba [Atalhos](./settings.md#shortcuts) das Configurações.
- `Toggle Explorer` na [pesquisa rápida](./quick-search.md), listado em todas as abas. Digitar `find`, `replace`, `rename`, `tree`, `outline` ou `objects` faz com que ele apareça.
- `Toggle Explorer` no menu de contexto do canvas: clique com o botão direito em um ponto vazio do canvas ERD, fora de qualquer [grupo de tabelas](./table-groups.md). Ele fica depois de `New Table`, `New Memo` e `New Table Group` e antes de `Relationship`.

Os dois itens `Toggle Explorer` mostram o atalho à direita.  
O botão da barra de ferramentas, o atalho e o item da pesquisa rápida funcionam em todas as abas. Nas abas Visualização, Esquema SQL, Gerador de código, Dicionário ou Configurações, eles primeiro mudam para a aba ERD, já que o explorador só aparece nela.

O botão da barra de ferramentas apenas abre e fecha o painel. Ele não coloca o cursor de texto no campo Localizar e deixa abertos o painel Propriedades da tabela, o construtor de temas e o seletor `Display Language`.  
O atalho e os dois itens `Toggle Explorer` abrem o explorador já na pesquisa: o cursor de texto vai para o campo Localizar com o texto selecionado, e qualquer uma das cinco caixas de diálogo descritas em [Caixas de diálogo ao lado dele](#dialogs-beside-it) se fecha. O que a pesquisa mantém entre uma abertura e outra está em [Abrir e fechar](./find-and-replace.md#opening-and-closing), em Localizar e substituir.  
O atalho não faz nada enquanto uma célula de tabela, uma nota ou o nome de um grupo de tabelas está sendo editado, ou enquanto uma edição de célula está aberta na aba [Dicionário](./dictionary.md#keys-on-the-tab), inclusive a lista de domínios de um termo.

O botão da barra de ferramentas aparece pressionado enquanto o explorador está aberto na aba ERD e não está oculto pelo [modo zen](#when-it-stands-aside). Nesse estado, o botão, o atalho e qualquer um dos itens `Toggle Explorer` fecham o explorador, e o teclado, se estava no painel, volta para o editor.  
O atalho nunca o fecha enquanto a pesquisa rápida ou uma das cinco caixas de diálogo está aberta. Em vez disso, ele fecha a paleta ou a caixa de diálogo e leva o teclado ao campo Localizar, com o texto selecionado e, se o explorador já estava visível, mantendo a correspondência atual. O item `Toggle Explorer` da pesquisa rápida não faz essa exceção: executá-lo fecha a paleta e, em seguida, um explorador aberto.

O botão `x` na barra de título, cuja dica de ferramenta diz `Close`, também fecha o explorador e passa o teclado para o canvas. `Escape` não o fecha — consulte [Teclas no explorador](#keys-in-the-explorer).  
Ao ser reaberto, o explorador volta com a mesma largura, com a árvore recolhida e rolada como estava e com o mesmo termo de pesquisa. Aberto pelo atalho ou por um item `Toggle Explorer`, ele pesquisa esse termo novamente com todos os resultados expandidos — consulte [Os resultados](./find-and-replace.md#the-results).

Quando o atalho ou um item `Toggle Explorer` abre o explorador em um editor estreito demais para ele, uma notificação diz `Widen the window to show the Explorer`, e o teclado fica onde estava — consulte [Ao lado do canvas](#beside-the-canvas).  
O explorador fica aberto mesmo assim, com o botão da barra de ferramentas pressionado, e aparece, com a pesquisa já feita, assim que o editor fica largo o bastante, sem tomar o teclado. Abri-lo pelo botão da barra de ferramentas não mostra nenhuma notificação.

## Ao lado do canvas {#beside-the-canvas}

O explorador se estende ao longo da borda esquerda da aba ERD, abaixo da barra de ferramentas, por toda a altura do canvas.  
O canvas se estreita para dar espaço a ele, então nenhuma parte do diagrama fica sob o painel, e a [barra de ferramentas do canvas](./table-related-functions.md#canvas-toolbar), o minimapa e a [tela de boas-vindas](./editing-start.md#welcome-screen) ficam todos no canvas, ao lado dele.  
Abrir, fechar ou redimensionar o explorador não rola o diagrama e não registra nada no [histórico de desfazer](./undo-redo.md#what-the-history-records).

Em um editor recém-aberto, ele começa com `260px` de largura. Arraste a borda direita dele para definir qualquer largura de `200px` a `480px` ou clique duas vezes na borda para voltar a `260px`.

O canvas sempre mantém pelo menos `320px` ao lado do explorador:

- Em um editor mais estreito que a largura do explorador mais `320px`, o explorador é desenhado mais estreito para caber, até `200px`.
- Em um editor mais estreito que `520px`, ele dá lugar ao canvas. Ele não é desenhado, mas continua aberto, então o botão da barra de ferramentas ainda aparece pressionado e pressioná-lo fecha o explorador. Assim que o editor fica largo o bastante, ele volta com a própria largura.

O que conta é a largura do próprio editor, não a da janela do navegador, mesmo que a notificação de [Abrir e fechar](#opening-and-closing) fale da janela.

Em um [idioma de exibição da direita para a esquerda](./language-and-theme.md#right-to-left-languages), o explorador continua à esquerda do canvas, já que o canvas nunca é espelhado.  
Seu conteúdo é lido da direita para a esquerda: a barra de título, a pesquisa e as linhas são espelhadas, e as linhas são recuadas a partir da direita. A borda que você arrasta continua do lado direito dele, junto ao canvas. Os tipos de dados, as colunas de índice e o texto das chaves estrangeiras mantêm a ordem da esquerda para a direita.

## Quando ele fica oculto {#when-it-stands-aside}

O explorador aparece apenas na aba ERD.  
Mudar para outra aba o oculta, e o botão da barra de ferramentas deixa de aparecer pressionado. De volta à aba ERD, ele aparece de novo como você o deixou, recolhido e rolado da mesma forma.

Enquanto o [visualizador de diferenças](./table-related-functions.md#diff-viewer), a [viagem no tempo](./undo-redo.md#time-travel) ou a pré-visualização do [layout automático](./table-related-functions.md#auto-layout) está aberta, nada abre nem fecha o explorador:

- Um explorador aberto fica oculto e volta a aparecer assim que eles se fecham.
- O botão da barra de ferramentas fica esmaecido e não faz nada.
- A pesquisa rápida não lista o item `Toggle Explorer`.
- O atalho fica a cargo do navegador ou do host — consulte [A barra de localização do navegador](./find-and-replace.md#the-browsers-find-bar).

O visualizador de diferenças lista suas alterações em uma árvore do mesmo tipo — consulte [Visualizador de diferenças](./table-related-functions.md#diff-viewer).

Ativar o [modo zen](./table-related-functions.md#canvas-toolbar) com `Alt + Z` (Windows/Linux) ou `⌥ + Z` (Mac) oculta um explorador aberto sem fechá-lo, e desativar o modo zen traz o explorador de volta.  
No modo zen, o atalho e os dois itens `Toggle Explorer` continuam abrindo o explorador já na pesquisa, e o modo zen permanece ativado. O explorador então ocupa toda a altura do editor, já que a barra de ferramentas superior não está mais lá, e continua visível quando o modo zen é desativado. Ativar o modo zen outra vez volta a ocultá-lo.

Sempre que o painel desaparece com o teclado nele, seja por ser fechado, por ficar oculto ou por dar lugar ao canvas, o teclado volta para o editor.

## A árvore {#the-tree}

A barra de título mostra `Explorer` e tem dois botões: `Collapse All` e o `x` que fecha o explorador. Abaixo dela fica a pesquisa — consulte [Localizar e substituir](./find-and-replace.md) — e, abaixo da pesquisa, a árvore.

O nível superior contém três pastas, nesta ordem: `Tables`, `Table Groups` e `Memos`. Sob cada tabela ficam suas próprias pastas `Columns`, `Indexes` e `Foreign Keys`.  
Uma pasta sem nada dentro não é mostrada, então um diagrama vazio não mostra nenhuma linha. A pasta `Table Groups` também fica de fora enquanto [View Option](./table-related-functions.md#table-view-options) → `Table Groups` oculta os grupos, e a pasta `Memos`, enquanto View Option → `Memos` oculta as notas.  
A linha de uma pasta mostra um ícone de pasta, o nome e, na extremidade oposta, um contador das linhas diretamente abaixo dela, então o contador ao lado de `Tables` é o número de tabelas do diagrama. O contador agrupa os milhares como faz o idioma de exibição, sempre com os algarismos de 0 a 9, como `1,234` em inglês e `1.234` em alemão.

As tabelas são listadas por nome, sem diferenciar maiúsculas de minúsculas, e tabelas com o mesmo nome mantêm a ordem do documento. Os grupos de tabelas são listados da mesma forma, assim como as tabelas sob cada grupo. As colunas de uma tabela mantêm a ordem da própria tabela, e seus índices, suas chaves estrangeiras e as notas mantêm a do documento.  
A árvore acompanha o diagrama à medida que ele muda, seja por uma edição no canvas, por um desfazer ou refazer, por uma importação ou por um colaborador ou agente de codificação, então renomear uma tabela move a linha dela.  
A ordem segue o nome qualquer que seja a [exibição de nomes](./logical-names.md#name-view), nunca o nome lógico. Trocar a exibição muda o rótulo das linhas de tabela e de coluna sem mover nenhuma delas, e o mesmo acontece ao dar um nome lógico a uma tabela ou coluna na exibição `Logical Names` ou `Both Names`. Um nome físico [derivado](./dictionary.md#deriving-physical-names) de um novo nome lógico, porém, é uma renomeação como qualquer outra, então pode mover a linha de uma tabela.

Cada tipo de linha mostra:

- Uma tabela: um ícone de tabela e o nome dela.
- Uma coluna: um ícone de chave para uma coluna de chave primária ou de chave estrangeira, colorido como a própria célula de chave da tabela colore uma chave primária, uma chave estrangeira ou ambas, e um ícone de lista para qualquer outra coluna. Depois, o nome dela e, esmaecido, seu tipo de dados seguido de `PK`, `FK` ou ambos, como `id` `BIGINT PK` ou `user_id` `BIGINT FK`. O tipo que ela mostra é sempre o tipo de dados da coluna, nunca o [domínio](./logical-names.md#the-domain-cell) dela, seja qual for a exibição de nomes.
- Um índice: um ícone de índice e o nome dele. Depois, esmaecidos, `UNIQUE` para um índice único e suas colunas entre parênteses na ordem do índice, com `DESC` depois de uma coluna decrescente, como `orders_user_idx` `UNIQUE (user_id DESC, total)`, ou apenas `(total)`.
- Uma chave estrangeira: listada apenas sob a tabela filha, a que contém as colunas de chave estrangeira, e apenas enquanto a tabela pai está no diagrama. Seu ícone de chave assume a cor do conector: a cor de chave primária e de chave estrangeira para um [relacionamento identificador](./relationship-editing.md#identifying-relationships) e, nos demais casos, a cor de chave estrangeira. Ela mostra as colunas de chave da tabela filha, separadas por vírgula, e depois, esmaecidos, `→` com a tabela pai e suas colunas, como `user_id` `→ users(id)`.
- Um grupo de tabelas: um ponto na cor do grupo, cinza para um grupo sem cor, e o nome dele. Suas tabelas são listadas abaixo dele por nome, e cada uma leva à sua tabela. Um grupo sem tabelas não tem nada para expandir.
- Uma nota: um ícone de nota adesiva e a primeira linha da nota.

As linhas de tabela, as tabelas listadas sob um grupo e as linhas de coluna acompanham a exibição de nomes — consulte [Além do canvas](./logical-names.md#beyond-the-canvas). Na exibição `Both Names`, por exemplo, a linha de uma coluna mostra `Total Amount` `total` `NUMERIC`: o nome lógico e depois o nome e o tipo de dados, ambos esmaecidos.  
Em todas as exibições, as linhas de índice e de chave estrangeira mostram suas colunas pelo nome, e a linha de uma chave estrangeira também mostra a tabela pai pelo nome.  
Enquanto o campo Localizar contém texto, uma linha encontrada só no nome que a exibição deixa de fora também mostra esse nome, esmaecido — consulte [Os resultados](./find-and-replace.md#the-results).

Um nome em branco, ou uma nota cuja primeira linha está em branco, aparece como `unnamed` em itálico. Nas exibições `Logical Names` e `Both Names`, uma tabela ou coluna só aparece como `unnamed` quando o nome lógico dela também está em branco.  
Em um painel estreito, o texto esmaecido é cortado com `…` antes que o nome com que a linha começa seja cortado. Passe o ponteiro sobre um nome ou sobre seu texto esmaecido para vê-lo por inteiro.

No início, apenas a pasta `Tables` está expandida. Clique na linha de uma pasta, ou pressione `Enter` ou `Space` nela, para recolhê-la ou expandi-la.  
A seta no início de uma linha recolhe ou expande essa linha sem ir a lugar nenhum. Toda linha de tabela tem uma, mesmo a de uma tabela sem nada abaixo dela. `→` e `←` também recolhem e expandem — consulte [Teclas no explorador](#keys-in-the-explorer).  
`Collapse All` recolhe um nível a cada pressionamento: o nível mais profundo de linhas expandidas à vista, então os pressionamentos recolhem de baixo para cima. O pressionamento que chega ao nível superior recolhe todas as linhas, incluindo as que estão sob uma linha já recolhida, deixando apenas as pastas do nível superior.  
Edições, desfazer e refazer, bem como alterações de colaboradores ou de um agente de codificação, mantêm o recolhimento das linhas como está.

## Ir para uma linha {#going-to-a-row}

Clique em uma linha, ou pressione `Enter` ou `Space` com o teclado nela, para ir até o que ela representa no canvas ERD. A linha de uma pasta apenas recolhe ou expande, e as teclas de seta apenas navegam pela árvore.

- A linha de uma tabela, ou uma tabela listada sob um grupo, seleciona apenas essa tabela e a traz para a frente. A menos que a célula em foco já esteja nessa tabela, ela vai para a primeira célula do cabeçalho da tabela: o nome ou, nas exibições `Logical Names` e `Both Names`, o nome lógico.
- A linha de uma coluna seleciona apenas a tabela dela e coloca a célula em foco no nome da coluna ou, na exibição `Logical Names`, no nome lógico desenhado no lugar dele.
- A linha de um índice seleciona a tabela dele, como faz a linha de uma tabela. O índice em si não é destacado individualmente; os índices são editados no painel [Propriedades da tabela](./table-related-functions.md#indexes).
- A linha de uma chave estrangeira traz as duas tabelas do relacionamento juntas para a área visível, ou a tabela filha quando as duas estão afastadas demais para aparecer juntas. Ela seleciona apenas a tabela filha com suas colunas de chave estrangeira, com a célula em foco na primeira delas, e ilumina o conector do relacionamento — consulte [Como ler um conector](./relationship-editing.md#reading-a-connector).
- A linha de um grupo de tabelas traz a caixa do grupo para a área visível pela barra de título, seleciona apenas o grupo e o traz para a frente junto com suas tabelas.
- A linha de uma nota seleciona apenas a nota e a traz para a frente.

A área visível se move pela regra comum a todos os saltos: o zoom nunca muda, e o canvas só rola quando o destino ainda não está bem visível — consulte [Onde um salto termina](./table-related-functions.md#where-a-jump-lands).  
Ir para uma linha primeiro fecha o painel Propriedades da tabela, se estiver aberto, e nunca inicia nem conclui um relacionamento que esteja sendo desenhado.  
Enquanto o campo Localizar contém texto, uma linha cujo nome ou nome lógico contém uma correspondência, ou uma que mostra um trecho de um comentário ou de uma nota, leva, em vez disso, à primeira correspondência dela — consulte [Ir para uma correspondência](./find-and-replace.md#going-to-a-match).

Depois de um clique, o teclado permanece na árvore, então `Delete`, `Backspace` e as outras teclas de edição não chegam à nova seleção até que você pressione `Escape` ou clique no canvas — consulte [Teclas no explorador](#keys-in-the-explorer).

## Teclas no explorador {#keys-in-the-explorer}

A árvore é uma única parada de `Tab`, ignorada enquanto não tem linhas.  
Chegar a ela com Tab leva à linha em que o teclado esteve por último ou, na falta dela, à linha da correspondência atual ou à primeira linha inteiramente visível, e rola a árvore até essa linha. A linha do teclado é desenhada como uma linha sob o ponteiro.

Na árvore:

- `↑` e `↓` movem uma linha, parando na primeira e na última linha em vez de dar a volta. `Home` e `End` vão para a primeira e para a última linha.
- `→` expande uma linha recolhida ou entra no primeiro filho de uma linha expandida. `←` recolhe uma linha expandida ou sai para a linha pai. Em um idioma de exibição da direita para a esquerda, as duas teclas se invertem.
- `Enter` e `Space` funcionam como um clique: vão para a linha, ou recolhem ou expandem uma pasta — consulte [Ir para uma linha](#going-to-a-row).
- Digitar uma letra não salta para uma linha.

`Escape` pressionado em qualquer lugar do explorador, seja na árvore, no campo Localizar ou Substituir ou em um de seus botões, devolve o teclado ao canvas. O explorador continua aberto, e a seleção continua como está.  
Um `Escape` que encerra uma composição do método de entrada apenas encerra a composição. `Escape` nunca fecha o explorador, seja pressionado nele ou no canvas.

Alguns atalhos do editor continuam funcionando enquanto o teclado está no explorador — consulte [Atalhos](./settings.md#shortcuts):

- `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) funciona como no canvas: fecha o explorador ou, enquanto o painel Propriedades da tabela está aberto ao lado dele, fecha esse painel e coloca o cursor de texto no campo Localizar — consulte [Abrir e fechar](#opening-and-closing).
- `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac) alterna a pesquisa rápida.
- `Undo` e `Redo` desfazem e refazem as alterações do diagrama, e não as do texto de um campo.
- `Zoom In`, `Zoom Out` e `Zoom Reset` alteram o zoom do canvas.

Todos os outros atalhos do editor ficam no explorador, assim como as teclas de seta, `Tab`, `Enter`, `Space`, `Home`, `End` e qualquer tecla pressionada enquanto um método de entrada está compondo.  
Nenhum deles chega ao canvas: `Delete` e `Backspace` nunca excluem a seleção, `Alt + N` (Windows/Linux) ou `⌥ + N` (Mac) não adiciona nenhuma tabela, e a sequência `T` e depois `G` não agrupa nada. Em um campo, eles funcionam como teclas de texto comuns: `Ctrl + A` (Windows/Linux) ou `⌘ + A` (Mac) seleciona o texto do campo, `Delete` e `Backspace` apagam texto, e `Space` digita um espaço. `Tab` se move entre os botões, os campos e a árvore do explorador.  
As teclas dos próprios campos Localizar e Substituir são abordadas em [Teclas nos campos de pesquisa](./find-and-replace.md#keys-in-the-search-fields).  
As teclas às quais o editor não atribui nenhuma ação, como as de salvar ou da paleta de comandos do próprio host, chegam ao host como de costume.

## Caixas de diálogo ao lado dele {#dialogs-beside-it}

O painel [Propriedades da tabela](./table-related-functions.md#table-properties), o [construtor de temas](./language-and-theme.md#theme), o seletor [`Display Language`](./language-and-theme.md#picking-a-language), a caixa de diálogo [`Export image`](./file-import-export.md#image) e [Mapear colunas](./relationship-editing.md#map-columns) deixam o explorador aberto ao se abrirem.

- O painel Propriedades da tabela abre no meio do canvas, ao lado do explorador, e esmaece apenas o canvas. O explorador continua utilizável: escolher uma linha fecha o painel Propriedades da tabela e depois vai para a linha.
- `Export image` e Mapear colunas esmaecem o editor inteiro, incluindo a barra de ferramentas e o explorador. O explorador continua aberto sob a área esmaecida, e um clique ali fecha a caixa de diálogo, como faz um clique em qualquer ponto da área esmaecida; Mapear colunas então fecha sem mapear nada.
- Em um idioma de exibição da esquerda para a direita, o construtor de temas e o seletor `Display Language` abrem logo depois do explorador em vez de sobre ele, e se deslocam junto se ele abrir ou fechar enquanto estão visíveis. Em um idioma da direita para a esquerda, eles mantêm sua posição à direita. Um pressionamento no explorador os fecha, como qualquer pressionamento fora deles, exceto um na barra de ferramentas.

Abrir a pesquisa pelo atalho ou por um item `Toggle Explorer` fecha todas as cinco, e Mapear colunas se fecha sem mapear nada.  
A [pesquisa rápida](./quick-search.md) também deixa o explorador aberto, e `Escape` então fecha apenas a paleta.

## Editores somente leitura {#read-only-editors}

Em um editor [`readonly`](../../api/erd-editor-element.md#readonly), o explorador funciona como em qualquer outro: o botão da barra de ferramentas com a mesma dica de ferramenta, o atalho, os dois itens `Toggle Explorer`, a árvore, o recolhimento, `Collapse All` e o salto para uma linha, que seleciona o destino como de costume. Ali, o título dele também mostra `Explorer`.  
A pesquisa dele apenas localiza — consulte [Editores somente leitura](./find-and-replace.md#read-only-editors) em Localizar e substituir.
