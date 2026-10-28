---
sidebar_position: 1
description: Começar pela tela de boas-vindas e criar tabelas, notas, grupos de tabelas e relacionamentos pelo menu de contexto do canvas, pela barra de ferramentas do canvas ou por um atalho.
---

# Começar a editar

A edição começa pelo menu de contexto, que se abre com um clique com o botão direito.

![Clique com o botão direito no canvas, abertura do submenu Relationship, adição de uma tabela e, depois, abertura do menu dela](/img/demo-context-menu.webp)

Clicar com o botão direito em uma tabela, uma nota, um grupo de tabelas ou um relacionamento abre, em vez disso, o menu próprio desse item.  
Um clique com o botão direito em uma tabela, nota ou grupo de tabelas que já está selecionado mantém a seleção inteira, então itens como `Color` e `Delete selected` atuam sobre toda ela — consulte [Seleção múltipla](./table-related-functions.md#multiple-selection).  
Um editor somente leitura não cria nada, então nada do que esta página descreve é oferecido ali: o menu do canvas mantém apenas `View Option`, `Name View`, `Export` e `Diff Viewer`, o menu de uma tabela mantém apenas `Table Properties`, e uma nota, um grupo de tabelas ou um relacionamento não abre menu — consulte [Editores somente leitura](./table-related-functions.md#read-only-editors).

## Tela de boas-vindas {#welcome-screen}

No aplicativo web, no Google Drive, no VS Code, no Obsidian e em uma IDE da JetBrains, um diagrama vazio se abre em uma tela de boas-vindas sobre o canvas ERD. Um `<erd-editor>` na sua própria página só a mostra quando a página a ativa com [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen).  
Um diagrama conta como vazio enquanto não contém nenhuma tabela, nenhuma nota visível e nenhum grupo de tabelas visível, então notas e grupos ocultos pelo menu Opções de exibição não contam. A tela some assim que o diagrama passa a conter um deles e volta sempre que o diagrama fica vazio de novo, por exemplo depois que você exclui a última tabela ou desfaz a adição da primeira.  
Ela não é mostrada em um editor somente leitura, no modo zen, enquanto o painel Propriedades da tabela está aberto nem enquanto o visualizador de diferenças, a pré-visualização do layout automático ou a viagem no tempo ocupa o canvas.

![A tela de boas-vindas em um diagrama vazio: abertura dos formatos de Import, retorno com Esc, adição de uma tabela com New Table e, depois, retorno da tela com ⌘ + Z](/img/demo-welcome-screen.webp)

Abaixo do título `Right-click the canvas for every action.` há um menu:

- `New Table` adiciona uma tabela, como faz `Alt + N`.
- `New Memo` adiciona uma nota, como faz `Alt + M`. Esse item é omitido enquanto as notas estão ocultas.
- `Import` troca o menu por `Back` e pelos formatos `json`, `Schema SQL`, `GraphQL`, `DBML` e `AML`. Escolher um formato pede um arquivo desse formato e o carrega no lugar do diagrama vazio — consulte [Importar ou exportar arquivos](./file-import-export.md). `Back`, ou `Escape`, volta ao primeiro menu.
- `Command Palette` abre a [pesquisa rápida](./quick-search.md), como faz `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac).
- `Shortcuts` abre as Configurações na aba [`Shortcuts`](./settings.md#shortcuts).

Onde o canvas é largo o bastante, `New Table`, `New Memo` e `Command Palette` mostram a tecla atualmente vinculada ao respectivo comando, inclusive uma que um host tenha reatribuído.  
Quando um item tem o foco do teclado, `↑` e `↓` percorrem os itens de forma circular, `Home` e `End` saltam para o primeiro e o último e `Enter` ou `Space` pressiona o item em foco. Todos os outros atalhos continuam funcionando, então `Alt + N` também adiciona uma tabela a partir dali.  
Só o menu recebe cliques: um pressionamento em qualquer outro ponto da tela chega ao canvas, e clicar com o botão direito no canvas abre o menu de contexto como de costume.

Onde o canvas tem espaço, setas desenhadas à mão apontam para:

- o botão `Search` da barra de ferramentas: `Search commands and tables`
- os botões `Theme` e `Display Language`: `Pick a theme and a language`, ou `Pick a theme` ou `Pick a language` quando a barra de ferramentas mostra só um deles — consulte [Idioma e tema](./language-and-theme.md)
- a [barra de ferramentas do canvas](./table-related-functions.md#canvas-toolbar) na parte inferior: `Pan, zoom and draw relationships`

Enquanto o [explorador](./explorer.md) está visível, a tela de boas-vindas cobre só o canvas ao lado dele.  
Uma seta cujo botão da barra de ferramentas fica acima do explorador é omitida. A seta de `Theme` e `Display Language` só é omitida quando os dois botões dela ficam acima do explorador; até lá, ela aponta para aquele que ainda está sobre o canvas.  
Um rótulo sem espaço ao lado da sua seta fica, em vez disso, logo abaixo da seta.

## Criação de tabelas {#table-creation}

Crie uma tabela pelo menu de contexto, com o botão `New Table` da [barra de ferramentas do canvas](./table-related-functions.md#canvas-toolbar) ou com o atalho `Alt + N`.

## Criação de notas {#memo-creation}

Crie uma nota pelo menu de contexto, com o botão `New Memo` da barra de ferramentas do canvas ou com o atalho `Alt + M`.  
Enquanto View Option → `Memos` está desativado, as notas ficam ocultas, nada oferece `New Memo` e `Alt + M` não adiciona nenhuma — consulte [Opções de exibição da tabela](./table-related-functions.md#table-view-options).

Uma nota é uma anotação de texto livre no canvas. Clique no corpo dela e digite; o texto é salvo com o documento.  
`Escape` fecha o editor da nota, mantendo o que você digitou e deixando a nota selecionada, e um segundo `Escape` limpa a seleção.  
Arraste a borda da nota para redimensioná-la. O `x` no cabeçalho dela, mostrado enquanto o ponteiro está sobre a nota, a exclui.  
Clicar com o botão direito em uma nota abre o menu dela, e não o editor: `Color`, `Remove color` enquanto um item selecionado tem cor e `Delete`, que passa a ser `Delete selected` enquanto a nota é um de dois ou mais itens selecionados. Uma nota selecionada também é excluída com as teclas que excluem tabelas — consulte [Exclusão de tabelas e notas](./table-related-functions.md#table-and-memo-deletion).

![Adição de uma nota com Alt + M, digitação de um texto e arrasto da borda para redimensioná-la](/img/demo-memo.webp)

## Criação de grupos de tabelas {#table-group-creation}

Um grupo de tabelas é uma caixa que contém tabelas, e é possível dar a ele um nome e uma cor. Crie um grupo de uma destas duas maneiras:

- Escolha `New Table Group` no menu de contexto ou na pesquisa rápida, clique no botão `New Table Group` da [barra de ferramentas do canvas](./table-related-functions.md#canvas-toolbar) ou pressione `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac) e, depois, arraste uma caixa sobre o canvas. Cada tabela cujo centro fica dentro da caixa entra no novo grupo, a menos que já esteja em outro grupo — consulte [Desenhar um grupo](./table-groups.md#drawing-a-group).
- Selecione tabelas e escolha `Group selected tables` no menu de contexto de uma tabela ou `Group Selected Tables` na pesquisa rápida, ou pressione `T` e depois `G` — consulte [Agrupar tabelas selecionadas](./table-groups.md#grouping-selected-tables).

Nomear, colorir, mover, redimensionar e o restante são abordados em [Grupos de tabelas](./table-groups.md).

## Criação de relacionamentos {#relationship-creation}

Inicie um relacionamento pelo menu de contexto, pela [barra de ferramentas do canvas](./table-related-functions.md#canvas-toolbar) na parte inferior do canvas ou com um atalho. Cada tipo de relacionamento tem o seu:

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) ou `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) ou `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) ou `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) ou `⌘ + ⌥ + 4` (Mac)

Assim que um tipo é preparado, o cursor muda. Clique primeiro na tabela pai e depois na tabela filha.  
A tabela pai recebe uma chave primária se não tiver uma e, para cada coluna de chave primária da tabela pai, a tabela filha recebe uma coluna de chave estrangeira `Not Null` com o mesmo tipo de dados, valor padrão, comentário, [nome lógico](./logical-names.md) e [domínio](./dictionary.md#domains-and-data-types).  
Uma chave serial é a exceção: sua chave estrangeira recebe o tipo inteiro que o serial armazena, como `integer` para `serial4`, e então não vincula nenhum domínio — consulte [Relacionamentos identificadores](./relationship-editing.md#identifying-relationships).  
Cada coluna de chave estrangeira é nomeada a partir da sua chave: um nome de uma só palavra, como `id`, ganha na frente o nome da tabela pai (`user_id`), um nome de várias palavras, como `member_id`, é mantido e um nome que a tabela filha já tem é numerado (`user_id_2`) — consulte [Nomes das colunas de chave estrangeira](./relationship-editing.md#foreign-key-column-names).  
Clicar na mesma tabela nas duas vezes desenha um relacionamento autorreferenciado.  
Um relacionamento novo começa com `On Delete` e `On Update` ambos definidos como `Not set`; altere-os pelo menu de contexto dele — consulte [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Pressione `Escape`, ou pressione o mesmo atalho de novo, para cancelar. Cancelar deixa a seleção como está, e o `Escape` seguinte a limpa.

Depois que a tabela pai é escolhida, apontar para uma tabela em que o relacionamento pode terminar contorna essa tabela e mostra dois botões ao lado dela:

- `Create new columns` (`+`) desenha o relacionamento com novas colunas de chave estrangeira, como faz um clique na tabela.
- `Map to existing columns` (um ícone de link) encerra o desenho e abre a caixa de diálogo [Mapear colunas](./relationship-editing.md#map-columns) para as duas tabelas, de modo que o relacionamento possa usar colunas que a tabela filha já tem. Nada é gravado até você pressionar `Map`.

A tabela pai também mostra os botões depois que o ponteiro se afasta um pouco do ponto em que você clicou nela, então um relacionamento autorreferenciado também pode ser mapeado para colunas existentes.  
Um dedo não tem como passar o ponteiro sobre nada, então, ao desenhar com o dedo, os botões nunca aparecem e tocar na tabela filha desenha o relacionamento de imediato; uma caneta os mostra como faz um mouse.  
Se a tabela pai tiver perdido a chave primária quando você chegar à tabela filha, por exemplo por causa de um desfazer ou da edição de um colaborador, `Create new columns` fica esmaecido com a dica de ferramenta `<parent> has no primary key to copy`, e clicar na tabela filha encerra o desenho sem desenhar nada.  
A dica de ferramenta nomeia a tabela pai como faz a [exibição de nomes](./logical-names.md#beyond-the-canvas).

![Desenho de um relacionamento One N com ⌘ + ⌥ + 4 e, depois, de um Zero N pela barra de ferramentas do canvas, com a tabela filha contornada e seus botões Map to existing columns e Create new columns](/img/demo-relationship.webp)

## Duplicar tabelas e notas {#duplicating-tables-and-memos}

Tabelas e notas existentes podem ser copiadas, coladas e arrastadas com `Alt` para criar duplicatas — consulte [Funções relacionadas a tabelas](./table-related-functions.md#copyingpasting-tables-and-memos).
