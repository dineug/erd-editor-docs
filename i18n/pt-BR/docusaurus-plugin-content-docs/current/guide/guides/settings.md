---
sidebar_position: 14
description: Sincronização do tipo de dados nos relacionamentos, largura máxima do comentário, recálculo da largura das tabelas, bloqueios de configurações (área visível, aba e configurações de código), ordem de exibição das colunas e a lista de atalhos.
---

# Configurações

Abra as Configurações com o botão `Settings` da barra de ferramentas ou pela [pesquisa rápida](./quick-search.md), em `Tab`.
A tela Configurações tem duas abas: `Preferences` e `Shortcuts`. A aba `Preferences` abre primeiro, exceto quando se entra pelo item `Shortcuts` da [tela de boas-vindas](./editing-start.md#welcome-screen), que abre `Shortcuts`.

O tema e o idioma de exibição não ficam nesta tela. Os botões `Theme` e `Display Language` da barra de ferramentas os abrem — consulte [Idioma e tema](./language-and-theme.md).

## Sincronização do tipo de dados nos relacionamentos {#relationship-datatype-sync}

Define se os tipos de dados são sincronizados. Está ativada por padrão.
Com ela ativada, alterar o tipo de dados de uma coluna o aplica a todas as colunas ligadas a ela por um relacionamento, seguindo a cadeia a partir das duas extremidades, de modo que uma chave estrangeira nunca diverge da chave que referencia.
De uma chave para suas chaves estrangeiras, um tipo serial é repassado como o tipo inteiro que ele armazena, como acontece quando um relacionamento é desenhado — consulte [Relacionamentos identificadores](./relationship-editing.md#identifying-relationships). Assim, alterar uma chave para `serial` dá às suas chaves estrangeiras o tipo `integer` no PostgreSQL, e a alteração continua descendo pela cadeia a partir daí.
De uma chave estrangeira de volta à sua chave, o tipo é repassado como está escrito, exceto que uma chave serial mantém seu tipo e a alteração para ali.
[Mapear colunas](./relationship-editing.md#map-columns) também segue esta configuração: enquanto ela está ativada, cada coluna existente mapeada recebe o tipo que sua chave pai dá a uma chave estrangeira, e a alteração continua pelos relacionamentos como descrito acima. Enquanto ela está desativada, ou quando a chave não tem tipo de dados, a coluna mantém o seu.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Configuração de sincronização do tipo de dados nos relacionamentos" loading="lazy" />

![Alteração de members.id para BIGINT UNSIGNED, que atualiza cada member_id ligado a ele](/img/demo-relationship-data-type-sync.webp)

## Largura máxima do comentário {#maximum-comment-width}

Define a largura máxima da coluna de comentário em pixels (`60` ~ `200`).
Desativar o interruptor remove o limite, e o campo fica desabilitado enquanto ele está desativado.
Ao ativá-lo, o valor começa em `60px`. Um valor digitado fora do intervalo é ajustado ao extremo mais próximo.

![Ativação de Maximum comment width, digitação de 120 e a aba ERD mostrando os comentários cortados nessa largura](/img/demo-settings-comment-width.webp)

## Recalcular largura das tabelas {#recalculation-table-width}

Pressione `Sync` para recalcular a largura de todas as tabelas e células de coluna de acordo com o texto atual e para redesenhar os conectores de relacionamento conforme os novos tamanhos.
Uma notificação `Recalculated table width` confirma o recálculo.
As larguras são recalculadas automaticamente sempre que um documento é carregado, então isso só é necessário quando uma mudança de fonte ou de renderização as deixou desatualizadas.
As larguras não são salvas no arquivo, então `Sync` nunca o altera.

## Bloqueio {#lock}

A lista `Lock` contém seis configurações. Enquanto o bloqueio de uma configuração está ativado, o arquivo mantém o valor que ela tinha ao ser bloqueada, então alterá-la na tela deixa o arquivo como estava.

| Linha | O que o arquivo mantém | Em um novo diagrama |
| --- | --- | --- |
| `Viewport` | O nível de zoom e a posição da área visível do canvas ERD, como um único bloqueio | `100% · 0, 0` |
| `Canvas Type` | A aba em que o diagrama abre: `ERD`, `Visualization`, `Schema SQL` ou `Code Generator` | `ERD` |
| `Language` | A linguagem do [Gerador de código](./code-generator.md#language) | `GraphQL` |
| `Table Name Case` | O [estilo do nome da tabela](./code-generator.md#name-case) do Gerador de código | `Pascal` |
| `Column Name Case` | O [estilo do nome da coluna](./code-generator.md#name-case) do Gerador de código | `Camel` |
| `Bracket Type` | O `Bracket` da aba [Esquema SQL](./schema-sql.md#database-and-bracket) e dos destinos do [Gerador de código](./code-generator.md#bracket) que o oferecem | `None` |

Cada linha mostra um valor e um botão de bloqueio, e um clique no botão ativa ou desativa apenas aquele bloqueio.
Enquanto um bloqueio está ativado, o botão mostra um cadeado fechado com a dica de ferramenta `Unlock Viewport` (e assim por diante para cada linha), e o valor, com a dica de ferramenta `Locked value`, é o que o arquivo mantém.
Enquanto ele está desativado, o botão mostra um cadeado aberto com a dica de ferramenta `Lock Viewport`, e o valor, esmaecido, com a dica de ferramenta `Current value`, é a configuração tal como está agora.
A linha `Viewport` mostra o zoom e depois a posição da área visível, como em `75% · -40, 91`. A posição da área visível é o ponto da tela, em pixels, onde fica o `0, 0` do diagrama, e uma coordenada de mil ou mais é abreviada, como em `1.2k` ou `-24k`.

Bloquear captura a configuração tal como ela está naquele momento.
Enquanto um bloqueio está ativado, a configuração continua funcionando na tela: é possível rolar e aplicar zoom, trocar de aba e escolher outra linguagem, outro estilo de nome ou outro delimitador nos menus, nos painéis de opções ou na pesquisa rápida.
O arquivo, porém, mantém o valor bloqueado, e a linha continua a mostrá-lo, então o diagrama reabre na área visível bloqueada, na aba bloqueada, com a linguagem, os estilos de nome e o delimitador bloqueados. Uma exportação JSON também grava os valores bloqueados.
Para salvar o que a tela mostra, desative o bloqueio e, a partir daí, o arquivo segue a configuração: com `Viewport` desativado, o diagrama abre onde você o deixou. Para bloquear um novo valor em vez disso, como uma nova área visível inicial, desative o bloqueio e ative-o novamente.
Se a área visível bloqueada não mostrar nenhuma parte do diagrama quando o arquivo abrir, a tela ainda assim se desloca até o diagrama, e o valor bloqueado permanece como está.
`Canvas Type` nunca mantém a aba Configurações. Ativá-lo bloqueia a última das outras abas em que você esteve e, enquanto ele está desativado, sua linha indica essa aba.

![Desbloqueio de Viewport, rolagem e zoom do diagrama e novo bloqueio na nova área visível que sua linha mostra](/img/demo-settings-locks.webp)

Ativar ou desativar um bloqueio altera o arquivo, já que o arquivo armazena quais bloqueios estão ativados, mas, como o restante da aba Configurações, isso não é registrado no [histórico de desfazer](./undo-redo.md#what-the-history-records). Em um editor somente leitura, os botões de bloqueio não fazem nada.
Todas as outras configurações são salvas tal como estão: o banco de dados, os botões de alternância de [`View Option`](./table-related-functions.md#table-view-options) e o restante da aba `Preferences`.

Todos os bloqueios estão ativados em um novo diagrama, iniciado do zero: um arquivo vazio aberto no VS Code, no Obsidian ou em uma IDE da JetBrains (`ERD Editor: Create new diagram` e `New ERD`, do Obsidian, criam um), um novo esquema no aplicativo web, um arquivo criado pelo menu New do Google Drive ou um `<erd-editor>` que não recebe nenhum valor.
Um esquema ou arquivo do Google Drive que o aplicativo web cria ao importar um arquivo SQL, DBML, AML ou GraphQL também começa com todos os bloqueios ativados. Um criado a partir de um arquivo JSON mantém os bloqueios que esse arquivo registra.
Um arquivo que você abre mantém os bloqueios com que foi salvo, cada um com seu valor bloqueado.
Um arquivo que não registra bloqueios, como um salvo por uma versão anterior aos bloqueios ou escrito à mão, abre com todos os bloqueios ativados: a área visível em `100% · 0, 0` e a aba em `ERD`, quaisquer que sejam a área visível e a aba que ele salvou, e sua linguagem, seus estilos de nome e seu tipo de delimitador bloqueados tal como ele os salvou.
Um `Import` que substitui o diagrama também define os bloqueios: um arquivo JSON traz os bloqueios que registra e os valores que eles guardam, e um arquivo SQL, DBML, AML ou GraphQL mantém seus bloqueios, mas leva a área visível de volta a `100% · 0, 0`, bloqueada ou não — consulte [Importar arquivos externos](./file-import-export.md#importing-external-files). Desfazer a importação traz de volta os bloqueios e os valores bloqueados que ela substituiu.

Uma alteração que um bloqueio mantém fora do arquivo não conta como alteração. O VS Code não marca a aba como modificada, e o Obsidian e uma IDE da JetBrains deixam o arquivo como estava, tanto quando salvam por conta própria quanto quando a aba é fechada.
Assim, com todos os bloqueios ativados, explorar um diagrama, trocar de aba e experimentar outra linguagem, outro estilo de nome ou outro delimitador nunca aparecem no `git diff`.
Com `Viewport` desativado, rolar e aplicar zoom alteram o arquivo e, com `Canvas Type` desativado, trocar de aba também o altera, inclusive para a aba Configurações.
O arquivo vazio de um novo diagrama continua vazio até a primeira alteração que o arquivo mantém: uma edição, uma alteração em uma configuração que nenhum bloqueio retém ou um bloqueio ativado ou desativado.
Abrir um diagrama e fechá-lo sem nenhuma alteração desse tipo deixa o arquivo como estava, qualquer que seja a versão ou a máquina que o gravou. O arquivo contém apenas o que o diagrama é, em uma ordem fixa, e um arquivo salvo em uma forma mais antiga é regravado nesta forma uma única vez, na primeira alteração desse tipo — consulte [Forma de armazenamento e valor em tempo de execução](../../api/advanced/schema.md#storage-form-and-runtime-value).
No VS Code, uma revisão reaberta como diagrama com `Reopen Editor With...`, como uma revisão do Git ou uma entrada do Local History, é somente leitura e nunca é marcada como modificada.
No Google Drive, uma rolagem, um zoom ou uma troca para outra aba nunca são salvos isoladamente, com ou sem bloqueio. Com `Viewport` desativado, a área visível só é gravada junto com outra alteração, então um arquivo do Drive abre onde a área visível estava no último salvamento, e o mesmo vale para a aba com `Canvas Type` desativado.

Em uma [sessão colaborativa](../../api/advanced/collaborative-editing.md), a ativação ou desativação de um bloqueio chega a todos os editores, e um bloqueio mantém o valor do editor que o ativou.
Desativar `Language`, um estilo de nome ou `Bracket Type` dá a todos os editores o valor mostrado no editor que o desativou, então todos eles salvam um mesmo valor. Desativar `Viewport` ou `Canvas Type` não move a área visível nem a aba de ninguém.
Um agente de codificação que trabalha pelo servidor MCP não tem ferramenta para os bloqueios nem para as configurações que eles retêm, e lê uma linguagem, um estilo de nome ou um tipo de delimitador bloqueado com o valor que o arquivo mantém. Apenas as importações dele no modo `replace` os afetam, como faz um `Import` — consulte [Configurações](../../mcp/tools.md#settings) e [Importação](../../mcp/tools.md#import).

## Ajustar a ordem das colunas {#adjusting-column-order}

Define a ordem de exibição das colunas nas tabelas.
Arraste uma linha para movê-la — a linha inteira pode ser arrastada, e o ícone de alça de arrastar a indica. As sete linhas, na ordem padrão, são `Name`, `DataType`, `Not Null`, `Unique`, `Auto Increment`, `Default` e `Comment`.
Uma célula oculta por uma [opção de exibição da tabela](./table-related-functions.md#table-view-options) mantém seu lugar na lista, então a ordem se aplica às células que estiverem visíveis.
A marca de [chave alternativa](./table-related-functions.md#alternate-keys) (`AK1.1` e assim por diante) não é uma dessas linhas. Ela sempre fica por último em uma linha, depois da célula que esta ordem colocar por último.

![Rolagem até Column Order e arrasto da linha Comment para cima, sob Name, o que coloca cada comentário logo depois do nome da sua coluna](/img/demo-settings-column-order.webp)

## Atalhos {#shortcuts}

A aba `Shortcuts` é uma tabela somente leitura com as colunas `Command` e `Keybinding`, que lista as combinações de teclas da plataforma em que você está.

| Comando | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | `T` e depois `G` | `T` e depois `G` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

A maioria desses atalhos só funciona na aba ERD, e eles ficam suspensos com a pesquisa rápida, o painel Propriedades da tabela, o visualizador de diferenças, a pré-visualização do layout automático, a viagem no tempo, a caixa de diálogo [`Export image`](./file-import-export.md#image) ou [`Map Columns`](./relationship-editing.md#map-columns) abertos.
`Search`, `Toggle Explorer` e `Stop` são as exceções: `Search` alterna a pesquisa rápida a partir de qualquer aba, `Toggle Explorer` abre o [explorador](./explorer.md#opening-and-closing) na pesquisa dele a partir de qualquer aba e exibe a aba ERD, e `Stop` é o que fecha a pesquisa rápida, o painel Propriedades da tabela, o visualizador de diferenças, a pré-visualização do layout automático, a viagem no tempo, a caixa de diálogo `Export image`, `Map Columns`, o construtor de temas, o seletor `Display Language`, o seletor de cores e um menu de contexto aberto.
`Toggle Explorer` fecha o explorador novamente enquanto ele está aberto na aba ERD e não está oculto pelo modo zen, como faz o botão `Explorer` da barra de ferramentas. Com a pesquisa rápida, o painel Propriedades da tabela, o construtor de temas, o seletor `Display Language`, a caixa de diálogo `Export image` ou `Map Columns` abertos, ele fecha o que estiver aberto em vez disso e leva o teclado para a pesquisa do explorador.
`Toggle Explorer` não faz nada enquanto uma célula, uma nota ou o nome de um grupo de tabelas está sendo editado. Com o visualizador de diferenças, a pré-visualização do layout automático ou a viagem no tempo abertos, ele deixa sua tecla para o navegador ou o host — consulte [A barra de localização do navegador](./find-and-replace.md#the-browsers-find-bar).
Na aba ERD, `Stop` encerra o editor aberto de uma célula ou nota, fecha o editor de nome de um [grupo de tabelas](./table-groups.md) sem renomear o grupo ou cancela um relacionamento ou um `New Table Group` que esteja sendo desenhado, e deixa a seleção como está. Quando nada disso está aberto, ele limpa a seleção e a célula em foco e, no mesmo pressionamento, fecha um seletor de cores aberto. Um construtor de temas ou um seletor `Display Language` aberto se fecha no mesmo pressionamento em qualquer caso.
O explorador, o construtor de temas ou o seletor `Display Language` abertos não suspendem nenhum dos atalhos no canvas. `Stop` nunca fecha o explorador. Para saber o que `Stop` e as outras teclas fazem dentro do explorador, consulte [Teclas no explorador](./explorer.md#keys-in-the-explorer) e, dentro do seletor, consulte [Escolher um idioma](./language-and-theme.md#picking-a-language).
`Delete Selection` remove todas as tabelas, notas e grupos de tabelas selecionados ou, quando uma única tabela está selecionada com algumas de suas colunas e o zoom está acima de `70%`, essas colunas — consulte [Exclusão de tabelas e notas](./table-related-functions.md#table-and-memo-deletion). `Remove Table, Memo` também remove os grupos de tabelas selecionados.
`Add Table Group` começa a desenhar um [`New Table Group`](./table-groups.md#drawing-a-group), como faz o botão `New Table Group` da [barra de ferramentas do canvas](./table-related-functions.md#canvas-toolbar), e um segundo pressionamento cancela o desenho. `Group Selected Tables` consiste em dois pressionamentos sem tecla modificadora, `T` e depois `G` em até um segundo. Ele coloca as tabelas selecionadas em um novo grupo e abre o editor de nome do grupo, como faz `Group selected tables` no menu de contexto de uma tabela, e não faz nada quando nenhuma tabela está selecionada — consulte [Agrupar tabelas selecionadas](./table-groups.md#grouping-selected-tables). Nenhum dos dois faz nada em um editor somente leitura nem enquanto os grupos estão [ocultos](./table-groups.md#hiding-groups).
`Zoom In`, `Zoom Out` e `Zoom Reset` também aplicam zoom na aba [Visualização](./visualization.md#toolbar), tanto no `Graph` quanto no `Flow`, a menos que a pesquisa rápida esteja aberta.
Na aba Visualização, `Stop` também fecha o menu de [exibição de linhas](./visualization.md#row-display) e cancela um [layout do Flow](./visualization.md#how-flow-is-placed) que ainda esteja em execução; ele não amplia uma exibição restrita com `Focus on this table`.
`Focus on this table` abre a aba Visualização no `Flow`, com a exibição restrita às tabelas selecionadas e a todas as tabelas a um relacionamento de distância, e não faz nada quando nenhuma tabela está selecionada — consulte [Focar em tabelas](./visualization.md#focusing-on-tables).
`Select All Table, Memo`, `Hand Tool`, `Delete Selection` e `Group Selected Tables` cedem lugar a um cursor de texto: enquanto você edita uma célula ou uma nota ou digita em um campo de texto, como o campo Localizar do explorador, `Ctrl + A` (Windows/Linux) ou `⌘ + A` (Mac) seleciona o texto, `Space` digita um espaço, `Delete` e `Backspace` apagam texto e a sequência `T` e depois `G` digita as duas letras.
Copiar e colar são feitos com os próprios `Ctrl + C` e `Ctrl + V` (Windows/Linux) ou `⌘ + C` e `⌘ + V` (Mac) do navegador, por isso não estão nesta lista — consulte [Edição de tabelas](./table-editing.md).

As combinações de teclas não podem ser alteradas nesta aba.
Um host que incorpora o editor as reatribui com [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), exceto `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` e `Zoom Reset`, que são fixos.
A aba `Shortcuts` então lista as combinações de teclas do host: um comando que o host não reatribui mantém seu padrão, e um que o host não vincula a nenhuma tecla não mostra nenhuma.

No Obsidian, essas teclas chegam ao editor sempre que a aba do Obsidian com o diagrama está ativa, mesmo quando um atalho do Obsidian usa a mesma tecla, como `Alt + Enter`, `Ctrl + K` e `Ctrl + F` (Windows/Linux) ou `⌥ + Enter`, `⌘ + K` e `⌘ + F` (Mac). Todos os outros atalhos do Obsidian continuam funcionando ali. Para `Ctrl + F` ou `⌘ + F`, consulte [A barra de localização do navegador](./find-and-replace.md#the-browsers-find-bar).
