---
sidebar_position: 8
description: Percorrer as tabelas do diagrama, com as suas colunas, índices e chaves externas, os seus grupos de tabelas e as suas notas numa árvore ancorada ao lado da tela ERD, e ir para qualquer um deles com um clique.
---

# Explorador

O explorador é um painel ancorado no bordo esquerdo da tela ERD que apresenta o diagrama como uma árvore: as suas tabelas, cada uma com as suas colunas, índices e chaves externas, depois os seus [grupos de tabelas](./table-groups.md) e depois as suas notas. Clique numa linha para ir para aquilo que ela representa na tela.  
O explorador estreita a tela em vez de a cobrir. Faz parte do editor de diagramas; não é a vista Explorer do VS Code nem o explorador de ficheiros do Obsidian.

![Abrir o explorador a partir da barra de ferramentas, ir para products e depois para a coluna status e a chave externa member_id de orders, recolher com Collapse All, alargar o painel e fechá-lo](/img/demo-explorer.webp)

[Localizar e substituir](./find-and-replace.md) fica no topo do explorador, entre a barra de título e a árvore. Enquanto o campo Localizar contém texto, a árvore mostra apenas o que corresponde — consulte [Os resultados](./find-and-replace.md#the-results).  
A árvore em si nunca altera o diagrama: não permite mudar o nome, arrastar, eliminar, mostrar nem ocultar. Uma substituição é a única edição que o painel faz.

O estado próprio do explorador pertence apenas a si: se está aberto, a sua largura, as linhas recolhidas, a linha onde está o foco do teclado, a posição de deslocamento e a pesquisa.  
Nada disto é guardado no ficheiro, registado no histórico de anulação, partilhado com colaboradores nem armazenado no navegador. Mantém-se enquanto o editor estiver aberto, ao mudar de separador e entre documentos carregados no mesmo editor. Um editor acabado de abrir começa com o explorador fechado.

## Abrir e fechar {#opening-and-closing}

Abra-o de qualquer uma destas formas:

- O botão `Explorer` da barra de ferramentas, logo a seguir ao botão `Search`, com um ícone de árvore. A sua dica indica `Explorer (Ctrl + F)` (Windows/Linux) ou `Explorer (⌘ + F)` (Mac).
- `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac), com o nome `Toggle Explorer` no separador [Atalhos](./settings.md#shortcuts) das Definições.
- A entrada `Toggle Explorer` da [pesquisa rápida](./quick-search.md), apresentada em todos os separadores. Escrever `find`, `replace`, `rename`, `tree`, `outline` ou `objects` fá-la aparecer.
- A opção `Toggle Explorer` do menu de contexto da tela: clique com o botão direito num ponto vazio da tela ERD, fora de qualquer [grupo de tabelas](./table-groups.md). Fica a seguir às opções `New Table`, `New Memo` e `New Table Group`, antes da opção `Relationship`.

As duas entradas `Toggle Explorer` mostram o atalho à direita.  
O botão da barra de ferramentas, o atalho e a entrada da pesquisa rápida funcionam em todos os separadores. A partir do separador Visualização, Esquema SQL, Gerador de código ou Definições, mudam primeiro para o separador ERD, uma vez que o explorador só é apresentado aí.

O botão da barra de ferramentas apenas abre e fecha o painel. Não coloca o cursor de texto no campo Localizar e deixa abertos o painel Propriedades da tabela, o criador de temas e o seletor `Display Language`.  
O atalho e as duas entradas `Toggle Explorer` abrem o explorador na respetiva pesquisa: o cursor de texto vai para o campo Localizar com o texto selecionado, e fecha-se qualquer uma das cinco caixas de diálogo indicadas em [Caixas de diálogo ao seu lado](#dialogs-beside-it). O que a pesquisa conserva de uma abertura para a outra está descrito em [Abrir e fechar](./find-and-replace.md#opening-and-closing), em Localizar e substituir.  
O atalho não faz nada enquanto uma célula de tabela, uma nota ou o nome de um grupo de tabelas está a ser editado.

O botão da barra de ferramentas aparece premido enquanto o explorador está aberto no separador ERD e não está oculto pelo [modo zen](#when-it-stands-aside). Enquanto aparece premido, o botão, o atalho e qualquer uma das entradas `Toggle Explorer` fecham o explorador, e o foco do teclado, se estava no painel, regressa ao editor.  
O atalho nunca o fecha enquanto a pesquisa rápida ou uma das cinco caixas de diálogo está aberta. Em vez disso, fecha a paleta ou a caixa de diálogo e leva o foco do teclado para o campo Localizar, com o respetivo texto selecionado e, se o explorador já estava visível, com a correspondência atual mantida. A entrada `Toggle Explorer` da pesquisa rápida não faz esta exceção: executá-la fecha a paleta e depois o explorador, se estiver aberto.

O botão `x` da barra de título, cuja dica indica `Close`, também fecha o explorador e passa o foco do teclado para a tela. A tecla `Escape` não o fecha — consulte [Teclas no explorador](#keys-in-the-explorer).  
Ao ser reaberto, o explorador volta com a mesma largura, com as mesmas linhas recolhidas, a mesma posição de deslocamento da árvore e a mesma consulta. Quando é aberto pelo atalho ou por uma entrada `Toggle Explorer`, volta a pesquisar essa consulta com todos os resultados expandidos — consulte [Os resultados](./find-and-replace.md#the-results).

Quando o atalho ou uma entrada `Toggle Explorer` abre o explorador num editor demasiado estreito para ele, uma notificação indica `Widen the window to show the Explorer`, e o foco do teclado fica onde estava — consulte [Ao lado da tela](#beside-the-canvas).  
Ainda assim, o explorador fica aberto, com o botão da barra de ferramentas premido, e aparece, já com a pesquisa feita, assim que o editor tiver largura suficiente, sem tomar o foco do teclado. Abri-lo com o botão da barra de ferramentas não mostra nenhuma notificação.

## Ao lado da tela {#beside-the-canvas}

O explorador estende-se ao longo do bordo esquerdo do separador ERD, abaixo da barra de ferramentas, em toda a altura da tela.  
A tela estreita-se para lhe dar espaço, pelo que nenhuma parte do diagrama fica por baixo do painel, e a [barra de ferramentas da tela](./table-related-functions.md#canvas-toolbar), o minimapa e o [ecrã de boas-vindas](./editing-start.md#welcome-screen) ficam todos na tela, ao lado dele.  
Abrir, fechar ou redimensionar o explorador não desloca o diagrama e não regista nada no [histórico de anulação](./undo-redo.md#what-the-history-records).

Num editor acabado de abrir, começa com `260px` de largura. Arraste o seu bordo direito para definir qualquer largura entre `200px` e `480px`, ou faça duplo clique no bordo para voltar a `260px`.

A tela mantém sempre pelo menos `320px` ao lado do explorador:

- Num editor mais estreito do que a largura do explorador mais `320px`, o explorador é desenhado mais estreito para caber, até `200px`.
- Num editor mais estreito do que `520px`, afasta-se. Não é desenhado, mas continua aberto, pelo que o botão da barra de ferramentas continua a aparecer premido e premi-lo fecha-o. Assim que o editor tem largura suficiente, volta com a sua própria largura.

O que conta é a largura do próprio editor, e não a da janela do navegador, embora a notificação de [Abrir e fechar](#opening-and-closing) fale da janela.

Num [idioma de apresentação da direita para a esquerda](./language-and-theme.md#right-to-left-languages), o explorador fica à esquerda da tela, uma vez que a tela nunca é espelhada.  
O seu conteúdo lê-se da direita para a esquerda: a barra de título, a pesquisa e as linhas são espelhadas, e as linhas são indentadas a partir da direita. O bordo que arrasta continua do lado direito, encostado à tela. Os tipos de dados, as colunas dos índices e o texto das chaves externas mantêm a ordem da esquerda para a direita.

## Quando se afasta {#when-it-stands-aside}

O explorador só é apresentado no separador ERD.  
Mudar para outro separador oculta-o, e o botão da barra de ferramentas deixa de aparecer premido. De volta ao separador ERD, o explorador volta a ser apresentado tal como o deixou, com as mesmas linhas recolhidas e a mesma posição de deslocamento.

Enquanto o [visualizador de diferenças](./table-related-functions.md#diff-viewer), a [viagem no tempo](./undo-redo.md#time-travel) ou a pré-visualização da [disposição automática](./table-related-functions.md#auto-layout) está aberta, nada abre nem fecha o explorador:

- Um explorador aberto fica oculto e volta a ser apresentado assim que estes se fecham.
- O botão da barra de ferramentas fica esbatido e não faz nada.
- A pesquisa rápida omite a entrada `Toggle Explorer`.
- O atalho fica entregue ao navegador ou ao host — consulte [A barra de localização do navegador](./find-and-replace.md#the-browsers-find-bar).

O visualizador de diferenças apresenta as suas alterações numa árvore do mesmo tipo — consulte [Visualizador de diferenças](./table-related-functions.md#diff-viewer).

Ativar o [modo zen](./table-related-functions.md#canvas-toolbar) com `Alt + Z` (Windows/Linux) ou `⌥ + Z` (Mac) oculta um explorador aberto sem o fechar, e desativar o modo zen traz o explorador de volta.  
No modo zen, o atalho e as duas entradas `Toggle Explorer` continuam a abrir o explorador na respetiva pesquisa, e o modo zen mantém-se ativado. O explorador ocupa então toda a altura do editor, uma vez que a barra de ferramentas superior desaparece, e continua visível quando o modo zen é desativado. Voltar a ativar o modo zen oculta-o de novo.

Sempre que o painel desaparece com o foco do teclado nele, quer seja fechado, ocultado ou afastado, o foco do teclado regressa ao editor.

## A árvore {#the-tree}

A barra de título indica `Explorer` e contém dois botões: o botão `Collapse All` e o botão `x`, que fecha o explorador. Abaixo dela fica a pesquisa — consulte [Localizar e substituir](./find-and-replace.md) — e, abaixo desta, a árvore.

O nível superior contém três pastas, por esta ordem: `Tables`, `Table Groups` e `Memos`. Por baixo de cada tabela ficam as suas próprias pastas `Columns`, `Indexes` e `Foreign Keys`.  
Uma pasta vazia não é apresentada, pelo que um diagrama vazio não mostra nenhuma linha. A pasta `Table Groups` também é omitida enquanto [Opções de vista](./table-related-functions.md#table-view-options) → `Table Groups` oculta os grupos, e a pasta `Memos` enquanto Opções de vista → `Memos` oculta as notas.  
Uma linha de pasta mostra um ícone de pasta, o seu nome e, na extremidade oposta, o número de linhas diretamente abaixo dela, pelo que o número junto à pasta `Tables` é o número de tabelas do diagrama.

As tabelas são ordenadas pelo nome, sem distinguir maiúsculas de minúsculas, e as tabelas com o mesmo nome mantêm a ordem do documento. Os grupos de tabelas são ordenados da mesma forma, tal como as tabelas de cada grupo. As colunas de uma tabela mantêm a ordem da própria tabela, e os seus índices, as suas chaves externas e as notas mantêm a do documento.  
A árvore acompanha o diagrama à medida que este muda, seja por uma edição na tela, por anular ou refazer, por uma importação, ou por um colaborador ou um agente de programação, pelo que mudar o nome de uma tabela move a respetiva linha.

Cada tipo de linha mostra:

- Uma tabela: um ícone de tabela e o seu nome.
- Uma coluna: um ícone de chave para uma coluna de chave primária ou de chave externa, com a mesma cor que a célula de chave da própria tabela dá a uma chave primária, a uma chave externa ou a ambas, e um ícone de lista para qualquer outra coluna. Depois, o seu nome e, esbatido, o seu tipo de dados seguido de `PK`, `FK` ou ambos, como `id` `BIGINT PK` ou `user_id` `BIGINT FK`.
- Um índice: um ícone de índice e o seu nome. Depois, esbatido, `UNIQUE` para um índice único e as suas colunas entre parênteses pela ordem do índice, com `DESC` a seguir a uma coluna descendente, como `orders_user_idx` `UNIQUE (user_id DESC, total)`, ou apenas `(total)`.
- Uma chave externa: apresentada apenas por baixo da tabela filha, a que contém as colunas de chave externa, e apenas enquanto a tabela pai está no diagrama. O seu ícone de chave assume a cor do conector: a cor de chave primária e chave externa para uma [relação identificadora](./relationship-editing.md#identifying-relationships), e a cor de chave externa nos restantes casos. Mostra as colunas de chave da tabela filha, separadas por vírgulas, e depois, esbatido, `→` com a tabela pai e as suas colunas, como `user_id` `→ users(id)`.
- Um grupo de tabelas: um ponto com a cor do grupo, cinzento para um grupo sem cor, e o seu nome. As suas tabelas são listadas por baixo dele pelo nome, e cada uma leva à respetiva tabela. Um grupo sem tabelas não tem nada para expandir.
- Uma nota: um ícone de nota autocolante e a primeira linha da nota.

Um nome em branco, ou uma nota cuja primeira linha está em branco, aparece como `unnamed` em itálico.  
Num painel estreito, o texto esbatido é encurtado com `…` antes de o nome o ser. Passe o ponteiro sobre um nome ou sobre o seu texto esbatido para o ver por completo.

De início, apenas a pasta `Tables` está expandida. Clique numa linha de pasta, ou prima `Enter` ou `Space` sobre ela, para a recolher ou expandir.  
A seta no início de uma linha recolhe ou expande essa linha sem ir para lado nenhum. Todas as linhas de tabela têm uma, mesmo uma tabela sem nada por baixo. As teclas `→` e `←` também recolhem e expandem — consulte [Teclas no explorador](#keys-in-the-explorer).  
O botão `Collapse All` recolhe um nível de cada vez que é premido: o nível mais profundo de linhas expandidas visíveis, pelo que premi-lo várias vezes recolhe de baixo para cima. Ao chegar ao nível superior, premi-lo recolhe todas as linhas, incluindo as que estão por baixo de uma linha já recolhida, deixando apenas as pastas do nível superior.  
Editar, anular e refazer, bem como as alterações de colaboradores ou de um agente de programação, deixam as linhas recolhidas e expandidas tal como estão.

## Ir para uma linha {#going-to-a-row}

Clique numa linha, ou prima `Enter` ou `Space` com o foco do teclado nela, para ir para aquilo que ela representa na tela ERD. Uma linha de pasta apenas recolhe ou expande, e as teclas de seta só se deslocam dentro da árvore.

- Uma linha de tabela, ou uma tabela listada por baixo de um grupo, seleciona apenas essa tabela e trá-la para a frente. A célula com o foco passa para o nome da tabela, a menos que já esteja nessa tabela.
- Uma linha de coluna seleciona apenas a respetiva tabela e coloca a célula com o foco no nome da coluna.
- Uma linha de índice seleciona a respetiva tabela, tal como uma linha de tabela. O índice em si não é selecionado à parte; os índices são editados no painel [Propriedades da tabela](./table-related-functions.md#indexes).
- Uma linha de chave externa coloca as duas tabelas da relação à vista em conjunto, ou a tabela filha quando as duas estão demasiado afastadas para serem mostradas em conjunto. Seleciona apenas a tabela filha com as suas colunas de chave externa, com a célula com o foco na primeira delas, e ilumina o conector da relação — consulte [Como ler um conector](./relationship-editing.md#reading-a-connector).
- Uma linha de grupo de tabelas coloca a caixa do grupo à vista, guiando-se pela respetiva barra de título, seleciona apenas o grupo e trá-lo para a frente com as suas tabelas.
- Uma linha de nota seleciona apenas a nota e trá-la para a frente.

A vista move-se segundo a regra comum a todos os saltos: o zoom nunca muda, e a tela só se desloca quando o destino ainda não está bem visível — consulte [Onde termina um salto](./table-related-functions.md#where-a-jump-lands).  
Ir para uma linha fecha primeiro o painel Propriedades da tabela, se estiver aberto, e nunca inicia nem conclui uma relação que esteja a ser desenhada.  
Enquanto o campo Localizar contém texto, uma linha cujo próprio nome contém uma correspondência, ou que mostra um excerto de um comentário ou de uma nota, leva, em vez disso, a essa correspondência — consulte [Ir para uma correspondência](./find-and-replace.md#going-to-a-match).

Depois de um clique, o foco do teclado fica na árvore, pelo que as teclas `Delete`, `Backspace` e as restantes teclas de edição não chegam à nova seleção até premir `Escape` ou clicar na tela — consulte [Teclas no explorador](#keys-in-the-explorer).

## Teclas no explorador {#keys-in-the-explorer}

A árvore é uma única paragem da tecla `Tab`, ignorada enquanto não tem linhas.  
Ao entrar nela com a tecla Tab, o foco do teclado vai para a linha onde esteve pela última vez ou, na falta desta, para a linha da correspondência atual ou para a primeira linha totalmente visível, e a árvore desloca-se até essa linha ficar visível. A linha do foco do teclado é desenhada como uma linha sob o ponteiro.

Na árvore:

- `↑` e `↓` movem uma linha, parando na primeira e na última linha em vez de dar a volta. `Home` e `End` vão para a primeira e para a última linha.
- `→` expande uma linha recolhida ou entra na primeira linha filha de uma linha expandida. `←` recolhe uma linha expandida ou sai para a linha pai. Num idioma de apresentação da direita para a esquerda, as duas teclas trocam de função.
- `Enter` e `Space` funcionam como um clique: vão para a linha ou recolhem ou expandem uma pasta — consulte [Ir para uma linha](#going-to-a-row).
- Escrever uma letra não salta para nenhuma linha.

A tecla `Escape`, premida em qualquer ponto do explorador, na árvore, no campo Localizar ou Substituir ou num dos seus botões, devolve o foco do teclado à tela. O explorador continua aberto e a seleção mantém-se.  
Quando `Escape` termina uma composição de um método de introdução, apenas termina a composição. A tecla `Escape` nunca fecha o explorador, quer seja premida nele, quer na tela.

Alguns atalhos do editor continuam a funcionar enquanto o foco do teclado está no explorador — consulte [Atalhos](./settings.md#shortcuts):

- `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) funciona como na tela: fecha o explorador ou, enquanto o painel Propriedades da tabela está aberto ao lado dele, fecha o painel Propriedades da tabela e coloca o cursor de texto no campo Localizar — consulte [Abrir e fechar](#opening-and-closing).
- `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac) abre ou fecha a pesquisa rápida.
- `Undo` e `Redo` anulam e refazem as alterações do diagrama, e não as do texto de um campo.
- `Zoom In`, `Zoom Out` e `Zoom Reset` alteram o zoom da tela.

Todos os outros atalhos do editor ficam no explorador, tal como as teclas de seta, `Tab`, `Enter`, `Space`, `Home`, `End` e qualquer tecla premida enquanto um método de introdução está a compor.  
Nenhum deles chega à tela: `Delete` e `Backspace` nunca eliminam a seleção, `Alt + N` (Windows/Linux) ou `⌥ + N` (Mac) não adiciona nenhuma tabela, e `T` e depois `G` não agrupa nada. Num campo, funcionam como teclas de texto normais: `Ctrl + A` (Windows/Linux) ou `⌘ + A` (Mac) seleciona o texto do campo, `Delete` e `Backspace` apagam texto, e `Space` escreve um espaço. `Tab` move o foco entre os botões, os campos e a árvore do explorador.  
As teclas dos próprios campos Localizar e Substituir são explicadas em [Teclas nos campos de pesquisa](./find-and-replace.md#keys-in-the-search-fields).  
As teclas que o editor não associa, como as do próprio host para guardar ou para a paleta de comandos, chegam ao host como habitualmente.

## Caixas de diálogo ao seu lado {#dialogs-beside-it}

O painel [Propriedades da tabela](./table-related-functions.md#table-properties), o [criador de temas](./language-and-theme.md#theme), o seletor [`Display Language`](./language-and-theme.md#picking-a-language), a caixa de diálogo [`Export image`](./file-import-export.md#image) e a caixa de diálogo [Mapear colunas](./relationship-editing.md#map-columns) deixam o explorador aberto quando se abrem.

- O painel Propriedades da tabela abre-se no meio da tela, ao lado do explorador, e esbate apenas a tela. O explorador continua utilizável: escolher uma linha fecha o painel Propriedades da tabela e depois vai para a linha.
- As caixas de diálogo `Export image` e Mapear colunas esbatem todo o editor, incluindo a barra de ferramentas e o explorador. O explorador continua aberto por baixo da área esbatida, e um clique aí fecha a caixa de diálogo, tal como um clique em qualquer ponto da área esbatida; a caixa de diálogo Mapear colunas fecha-se então sem mapear nada.
- Num idioma de apresentação da esquerda para a direita, o criador de temas e o seletor `Display Language` abrem-se logo a seguir ao explorador, em vez de por cima dele, e deslocam-se se ele se abrir ou fechar enquanto estão abertos. Num idioma da direita para a esquerda, mantêm o seu lugar à direita. Premir o botão do rato no explorador fecha-os, tal como premi-lo em qualquer ponto fora deles que não seja a barra de ferramentas.

Abrir a pesquisa com o atalho ou com uma entrada `Toggle Explorer` fecha todas as cinco, e a caixa de diálogo Mapear colunas fecha-se sem mapear nada.  
A [pesquisa rápida](./quick-search.md) também deixa o explorador aberto, e `Escape` fecha então apenas a paleta.

## Editores só de leitura {#read-only-editors}

Num editor [`readonly`](../../api/erd-editor-element.md#readonly), o explorador funciona como em qualquer outro: o botão da barra de ferramentas com a mesma dica, o atalho, as duas entradas `Toggle Explorer`, a árvore, a recolha e expansão de linhas, o botão `Collapse All` e a ida para uma linha, que seleciona o destino como habitualmente. Também aí o seu título indica `Explorer`.  
A sua pesquisa apenas localiza — consulte [Editores só de leitura](./find-and-replace.md#read-only-editors) em Localizar e substituir.
