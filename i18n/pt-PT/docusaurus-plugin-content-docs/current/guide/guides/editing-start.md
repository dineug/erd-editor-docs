---
sidebar_position: 1
description: Começar pelo ecrã de boas-vindas e criar tabelas, notas, grupos de tabelas e relações a partir do menu de contexto da tela, da barra de ferramentas da tela ou com um atalho.
---

# Começar a editar

A edição começa no menu de contexto, que se abre com um clique com o botão direito.

![Clicar com o botão direito na tela, abrir o submenu Relationship, adicionar uma tabela e depois abrir o menu da própria tabela](/img/demo-context-menu.webp)

Clicar com o botão direito numa tabela, numa nota, num grupo de tabelas ou numa relação abre, em vez disso, o menu próprio desse elemento.  
Um clique com o botão direito numa tabela, nota ou grupo de tabelas que já esteja selecionado mantém toda a seleção, pelo que opções como `Color` e `Delete selected` atuam sobre toda ela — consulte [Seleção múltipla](./table-related-functions.md#multiple-selection).

## Ecrã de boas-vindas {#welcome-screen}

Na aplicação web, no Google Drive, no VS Code, no Obsidian e num IDE da JetBrains, um diagrama vazio abre-se com um ecrã de boas-vindas sobre a tela ERD. Um `<erd-editor>` na sua própria página só o mostra quando a página o ativa com [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen).  
Um diagrama conta como vazio enquanto não contém nenhuma tabela, nenhuma nota visível nem nenhum grupo de tabelas visível, pelo que as notas e os grupos ocultados com Opções de vista não contam. O ecrã desaparece assim que o diagrama contém um deles e volta sempre que o diagrama fica novamente vazio, por exemplo, depois de eliminar a última tabela ou de anular a adição da primeira.  
Não é mostrado num editor só de leitura, no modo zen, enquanto o painel Propriedades da tabela está aberto nem enquanto o visualizador de diferenças, a pré-visualização da disposição automática ou a viagem no tempo ocupa a tela.

![O ecrã de boas-vindas num diagrama vazio: abrir os formatos de Import, voltar com Esc, adicionar uma tabela com New Table e depois fazer voltar o ecrã com ⌘ + Z](/img/demo-welcome-screen.webp)

Por baixo do título `Right-click the canvas for every action.` encontra-se um menu:

- A opção `New Table` adiciona uma tabela, tal como `Alt + N`.
- A opção `New Memo` adiciona uma nota, tal como `Alt + M`. É omitida enquanto as notas estão ocultas.
- A opção `Import` substitui o menu pela opção `Back` e pelos formatos `json`, `Schema SQL`, `GraphQL`, `DBML` e `AML`. Escolher um formato pede um ficheiro desse formato e carrega-o no lugar do diagrama vazio — consulte [Importar ou exportar ficheiros](./file-import-export.md). A opção `Back`, ou `Escape`, volta ao primeiro menu.
- A opção `Command Palette` abre a [pesquisa rápida](./quick-search.md), tal como `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac).
- A opção `Shortcuts` abre as Definições no respetivo separador [`Shortcuts`](./settings.md#shortcuts).

Onde a tela é suficientemente larga, as opções `New Table`, `New Memo` e `Command Palette` mostram a tecla atualmente associada ao respetivo comando, incluindo uma que um host tenha reatribuído.  
Assim que uma opção tem o foco do teclado, `↑` e `↓` percorrem as opções de forma circular, `Home` e `End` saltam para a primeira e a última e `Enter` ou `Space` prime a opção com o foco. Todos os outros atalhos continuam a funcionar, pelo que `Alt + N` também adiciona uma tabela a partir daí.  
Só o menu recebe cliques: o premir do botão em qualquer outro ponto do ecrã chega à tela, e clicar com o botão direito na tela abre o menu de contexto, como habitualmente.

Onde a tela tem espaço, setas desenhadas à mão apontam para:

- o botão `Search` da barra de ferramentas: `Search commands and tables`
- os botões `Theme` e `Display Language`: `Pick a theme and a language`, ou `Pick a theme` ou `Pick a language` quando a barra de ferramentas mostra apenas um deles — consulte [Idioma e tema](./language-and-theme.md)
- a [barra de ferramentas da tela](./table-related-functions.md#canvas-toolbar) na parte inferior: `Pan, zoom and draw relationships`

Enquanto o [explorador](./explorer.md) está visível, o ecrã de boas-vindas cobre apenas a tela ao lado dele.  
Uma seta cujo botão da barra de ferramentas fica por cima do explorador é omitida. A seta dos botões `Theme` e `Display Language` só é omitida quando os seus dois botões ficam por cima do explorador; até lá, aponta para o que ainda está sobre a tela.  
Uma etiqueta sem espaço ao lado da sua seta fica, em vez disso, suspensa por baixo da seta.

## Criação de tabelas {#table-creation}

Crie uma tabela a partir do menu de contexto, com o botão `New Table` da [barra de ferramentas da tela](./table-related-functions.md#canvas-toolbar) ou com o atalho `Alt + N`.

## Criação de notas {#memo-creation}

Crie uma nota a partir do menu de contexto, com o botão `New Memo` da barra de ferramentas da tela ou com o atalho `Alt + M`.  
Enquanto Opções de vista → `Memos` está desativada, as notas ficam ocultas, nada oferece a opção `New Memo` e `Alt + M` não adiciona nenhuma — consulte [Opções de vista das tabelas](./table-related-functions.md#table-view-options).

Uma nota é uma anotação de texto livre na tela. Clique no seu corpo e escreva; o texto é guardado com o documento.  
A tecla `Escape` fecha o editor da nota, mantendo o que escreveu e deixando a nota selecionada, e um segundo `Escape` limpa a seleção.  
Arraste o seu bordo para a redimensionar. O `x` no seu cabeçalho, mostrado enquanto o ponteiro está sobre a nota, elimina-a.  
Clicar com o botão direito numa nota abre o respetivo menu em vez do editor: `Color`, `Remove color` enquanto um elemento selecionado tem uma cor, e `Delete`, que indica `Delete selected` enquanto a nota é um de dois ou mais elementos selecionados. Uma nota selecionada também é eliminada com as teclas que eliminam tabelas — consulte [Eliminação de tabelas e notas](./table-related-functions.md#table-and-memo-deletion).

![Adicionar uma nota com Alt + M, escrever uma anotação e arrastar o seu bordo para a redimensionar](/img/demo-memo.webp)

## Criação de grupos de tabelas {#table-group-creation}

Um grupo de tabelas é uma caixa que contém tabelas, à qual pode dar um nome e uma cor. Crie um de uma destas duas formas:

- Escolha a opção `New Table Group` no menu de contexto ou na pesquisa rápida, clique no botão `New Table Group` da [barra de ferramentas da tela](./table-related-functions.md#canvas-toolbar) ou prima `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac), e depois arraste uma caixa sobre a tela. Cada tabela cujo centro fique dentro da caixa junta-se ao novo grupo, a menos que já esteja noutro grupo — consulte [Desenhar um grupo](./table-groups.md#drawing-a-group).
- Selecione tabelas e escolha a opção `Group selected tables` no menu de contexto de uma tabela ou a entrada `Group Selected Tables` na pesquisa rápida, ou prima `T` e depois `G` — consulte [Agrupar as tabelas selecionadas](./table-groups.md#grouping-selected-tables).

A atribuição de nome e de cor, a movimentação, o redimensionamento e o resto são explicados em [Grupos de tabelas](./table-groups.md).

## Criação de relações {#relationship-creation}

Inicie uma relação a partir do menu de contexto, da [barra de ferramentas da tela](./table-related-functions.md#canvas-toolbar) na parte inferior da tela ou com um atalho. Cada tipo de relação tem o seu próprio atalho:

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) ou `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) ou `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) ou `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) ou `⌘ + ⌥ + 4` (Mac)

Assim que um tipo fica preparado, o cursor muda. Clique primeiro na tabela pai e depois na tabela filha.  
A tabela pai recebe uma chave primária se não tiver nenhuma e, para cada coluna de chave primária da tabela pai, a tabela filha recebe uma coluna de chave externa `Not Null` com o mesmo tipo de dados, valor predefinido e comentário.  
Uma chave serial é a exceção: a sua chave externa assume o tipo inteiro que o tipo serial armazena, como `integer` para `serial4` — consulte [Relações identificadoras](./relationship-editing.md#identifying-relationships).  
Cada coluna de chave externa recebe um nome baseado na sua chave: um nome de uma só palavra, como `id`, fica com o nome da tabela pai à frente (`user_id`), um nome de várias palavras, como `member_id`, é mantido e um nome que a tabela filha já tenha é numerado (`user_id_2`) — consulte [Nomes das colunas de chave externa](./relationship-editing.md#foreign-key-column-names).  
Clicar duas vezes na mesma tabela desenha uma relação autorreferencial.  
Uma nova relação começa com `On Delete` e `On Update` ambos em `Not set`; altere-os a partir do respetivo menu de contexto — consulte [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Prima `Escape`, ou volte a premir o mesmo atalho, para cancelar. Cancelar deixa a seleção como está, e o `Escape` seguinte limpa-a.

Assim que a tabela pai está escolhida, apontar para uma tabela onde a relação pode terminar realça o contorno dessa tabela e mostra dois botões ao seu lado:

- O botão `Create new columns` (`+`) desenha a relação com novas colunas de chave externa, tal como clicar na tabela.
- O botão `Map to existing columns` (um ícone de ligação) termina o desenho e abre a caixa de diálogo [Mapear colunas](./relationship-editing.md#map-columns) para as duas tabelas, para que a relação possa utilizar colunas que a tabela filha já tem. Nada é escrito até premir o botão `Map`.

A tabela pai também mostra os botões assim que o ponteiro se afasta um pouco do ponto onde clicou nela, pelo que uma relação autorreferencial também pode ser mapeada para colunas existentes.  
Um dedo não permite passar o ponteiro por cima, pelo que, ao desenhar com um dedo, os botões nunca aparecem e tocar na tabela filha desenha logo a relação; uma caneta mostra-os tal como um rato.  
Se a tabela pai tiver perdido a sua chave primária quando chegar à tabela filha, por exemplo, devido a uma anulação ou à edição de um colaborador, o botão `Create new columns` fica esbatido com a dica `<parent> has no primary key to copy`, e clicar na tabela filha termina o desenho sem desenhar nada.

![Desenhar uma relação One N com ⌘ + ⌥ + 4 e depois uma Zero N a partir da barra de ferramentas da tela, com o contorno da tabela filha realçado e os seus botões Map to existing columns e Create new columns](/img/demo-relationship.webp)

## Duplicar tabelas e notas {#duplicating-tables-and-memos}

As tabelas e notas existentes podem ser copiadas, coladas e arrastadas com `Alt` para criar duplicados — consulte [Funções relacionadas com tabelas](./table-related-functions.md#copyingpasting-tables-and-memos).
