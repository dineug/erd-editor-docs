---
sidebar_position: 16
description: Sincronização do tipo de dados nas relações e domínios, largura máxima dos comentários, recálculo da largura das tabelas, bloqueio de definições (vista, separador, definições de código e vista de nomes), ordem de apresentação das colunas e lista de atalhos.
---

# Definições

Abra as Definições com o botão `Settings` da barra de ferramentas ou a partir da [pesquisa rápida](./quick-search.md), na entrada `Tab`.
O ecrã Definições tem dois separadores: `Preferences` e `Shortcuts`. O separador `Preferences` abre-se primeiro, exceto a partir da opção `Shortcuts` do [ecrã de boas-vindas](./editing-start.md#welcome-screen), que abre o separador `Shortcuts`.

O tema e o idioma de apresentação não estão neste ecrã. Os botões `Theme` e `Display Language` da barra de ferramentas abrem-nos — consulte [Idioma e tema](./language-and-theme.md).

## Sincronização do tipo de dados nas relações {#relationship-datatype-sync}

Determina se os tipos de dados são sincronizados. Está ativada por predefinição.
Alterar o tipo de dados de uma coluna aplica-o então a todas as colunas que lhe estão ligadas por uma relação, seguindo a cadeia a partir de ambas as extremidades, pelo que uma chave externa nunca diverge da chave que referencia.
De uma chave para as suas chaves externas, um tipo serial passa como o tipo inteiro que armazena, tal como acontece quando se desenha uma relação — consulte [Relações identificadoras](./relationship-editing.md#identifying-relationships). Assim, mudar uma chave para `serial` dá às suas chaves externas o tipo `integer` no PostgreSQL, e a alteração continua a descer pela cadeia a partir daí.
De uma chave externa de volta para a sua chave, o tipo passa tal como está escrito, exceto que uma chave serial mantém o seu tipo e a alteração termina aí.
A caixa de diálogo [Mapear colunas](./relationship-editing.md#map-columns) também segue esta definição: enquanto está ativada, cada coluna existente que mapeia recebe o tipo que a respetiva chave pai dá a uma chave externa, e a alteração continua ao longo das relações, como acima. Enquanto está desativada, ou quando a chave não tem tipo de dados, a coluna mantém o seu próprio tipo.

Um [domínio](./dictionary.md#domains-and-data-types) dá o seu valor `Data Type` às colunas vinculadas a ele, quando esse tipo muda e quando uma coluna é vinculada. Enquanto esta definição está ativada, a alteração continua ao longo das relações a partir de cada uma dessas colunas, como acima; enquanto está desativada, só mudam as colunas vinculadas. Uma coluna que recebe o tipo do seu domínio nesse passo mantém-no, mesmo quando a sincronização lhe daria outro, como o tipo inteiro que uma chave serial dá às suas chaves externas.
Uma coluna vinculada à qual a sincronização ou a caixa de diálogo Mapear colunas dá um tipo diferente do tipo do seu próprio domínio é desvinculada desse domínio no mesmo passo — consulte [Desvincular](./dictionary.md#unlinking). Nenhuma colagem de colunas propaga um tipo através desta definição, nem sequer o tipo de um domínio que a colagem vincula — consulte [Copiar e colar colunas](./table-editing.md#copyingpasting-columns). Um valor `Data Type` colado na folha `Domains` do separador Dicionário propaga-o, tal como qualquer alteração do tipo de um domínio.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Definição de sincronização do tipo de dados nas relações" loading="lazy" />

![Alterar members.id para BIGINT UNSIGNED, o que atualiza todos os member_id que lhe estão ligados](/img/demo-relationship-data-type-sync.webp)

## Largura máxima dos comentários {#maximum-comment-width}

Especifica a largura máxima da coluna de comentários, em píxeis (`60` ~ `200`).
Desativar o interruptor remove o limite, e o campo fica desativado enquanto o interruptor está desativado.
Ao ativá-lo, o valor começa em `60px`. Um valor escrito fora do intervalo é ajustado ao extremo mais próximo.

![Ativar a opção Maximum comment width, introduzir 120 e o separador ERD a mostrar os comentários cortados a essa largura](/img/demo-settings-comment-width.webp)

## Recalcular a largura das tabelas {#recalculation-table-width}

Prima o botão `Sync` para recalcular a largura de cada tabela e de cada célula de coluna de acordo com o respetivo texto atual e para redesenhar os conectores das relações em função dos novos tamanhos.
Uma notificação `Recalculated table width` confirma-o.
As larguras são recalculadas automaticamente sempre que um documento é carregado, pelo que isto só é necessário quando uma alteração do tipo de letra ou da renderização as deixou desatualizadas.
As larguras não são guardadas no ficheiro, pelo que o botão `Sync` nunca o altera.

## Bloqueio {#lock}

A lista `Lock` contém sete definições. Enquanto o bloqueio de uma definição está ativado, o ficheiro mantém o valor que esta tinha quando foi bloqueada, pelo que alterá-la no ecrã deixa o ficheiro como estava.

| Linha | O que o ficheiro mantém | Num diagrama novo |
| --- | --- | --- |
| `Viewport` | O nível de zoom e a posição da vista da tela ERD, como um só bloqueio | `100% · 0, 0` |
| `Canvas Type` | O separador em que o diagrama se abre: `ERD`, `Visualization`, `Schema SQL`, `Code Generator` ou `Dictionary` | `ERD` |
| `Language` | A linguagem do [Gerador de código](./code-generator.md#language) | `GraphQL` |
| `Table Name Case` | O [formato do nome da tabela](./code-generator.md#name-case) do Gerador de código | `Pascal` |
| `Column Name Case` | O [formato do nome da coluna](./code-generator.md#name-case) do Gerador de código | `Camel` |
| `Bracket Type` | A opção `Bracket` do separador [Esquema SQL](./schema-sql.md#database-and-bracket) e dos destinos do [Gerador de código](./code-generator.md#bracket) que a oferecem | `None` |
| `Name View` | A [vista de nomes](./logical-names.md#name-view) em que o diagrama se abre: `Physical Names`, `Logical Names` ou `Both Names` | `Physical Names` |

Cada linha mostra um valor e um botão de bloqueio, e um clique no botão ativa ou desativa apenas esse bloqueio.
Enquanto um bloqueio está ativado, o botão mostra um cadeado fechado com a dica `Unlock Viewport` (e assim sucessivamente para cada linha), e o valor, com a dica `Locked value`, é o que o ficheiro mantém.
Enquanto está desativado, o botão mostra um cadeado aberto com a dica `Lock Viewport`, e o valor, esbatido, com a dica `Current value`, é a definição tal como está agora.
A linha `Viewport` indica o zoom e depois a posição da vista, como `75% · -40, 91`. A posição da vista é o ponto do ecrã, em píxeis, onde se encontra o `0, 0` do diagrama, e uma coordenada de mil ou mais é abreviada, como em `1.2k` ou `-24k`.

Bloquear capta a definição tal como está nesse momento.
Enquanto um bloqueio está ativado, a definição continua a funcionar no ecrã: pode deslocar a vista e fazer zoom, mudar de separador, escolher outra linguagem, outro formato do nome ou outro delimitador nos menus, nos painéis de opções ou na pesquisa rápida, e mudar a vista de nomes a partir de qualquer um dos seus seletores — consulte [Mudar de vista](./logical-names.md#switching-the-view).
No entanto, o ficheiro mantém o valor bloqueado, e a linha continua a mostrá-lo, pelo que o diagrama volta a abrir-se na vista bloqueada, no separador bloqueado, na vista de nomes bloqueada e com a linguagem, os formatos dos nomes e o delimitador bloqueados. Uma exportação JSON também escreve os valores bloqueados.
Para guardar o que o ecrã mostra, desative o bloqueio, e o ficheiro passa a acompanhar a definição a partir daí: com o bloqueio `Viewport` desativado, o diagrama abre-se onde o deixou. Para bloquear, em vez disso, um novo valor, como uma nova vista inicial, desative o bloqueio e volte a ativá-lo.
Se a vista bloqueada não mostrar nenhuma parte do diagrama quando o ficheiro se abre, o ecrã desloca-se mesmo assim até ao diagrama, e o valor bloqueado mantém-se como está.
O bloqueio `Canvas Type` nunca mantém o separador Definições. Ativá-lo bloqueia o último outro separador em que esteve e, enquanto está desativado, a sua linha indica esse separador.

![Desbloquear Viewport, deslocar a vista e fazer zoom no diagrama e voltar a bloqueá-lo na nova vista que a respetiva linha mostra](/img/demo-settings-locks.webp)

Ativar ou desativar um bloqueio altera o ficheiro, uma vez que o ficheiro guarda que bloqueios estão ativados, mas, tal como o resto do separador Definições, não fica registado no [histórico de anulação](./undo-redo.md#what-the-history-records). Uma mudança da vista de nomes também não fica registada, com ou sem bloqueio. Num editor só de leitura, os botões de bloqueio não fazem nada, e uma mudança da vista de nomes só altera esse ecrã, seja qual for o seu bloqueio.
Todas as outras definições são guardadas tal como estão: a base de dados, os interruptores do menu [`View Option`](./table-related-functions.md#table-view-options) e o resto do separador `Preferences`.

Todos os bloqueios estão ativados num diagrama novo, iniciado do zero: um ficheiro vazio aberto no VS Code, no Obsidian ou num IDE da JetBrains (as opções `ERD Editor: Create new diagram` e `New ERD` do Obsidian criam um), um novo esquema na aplicação web, um ficheiro criado a partir do menu New do Google Drive ou um elemento `<erd-editor>` sem valor.
Um esquema ou um ficheiro do Google Drive que a aplicação web cria ao importar um ficheiro SQL, DBML, AML ou GraphQL também começa com todos os bloqueios ativados. O que é criado a partir de um ficheiro JSON mantém os bloqueios que esse ficheiro regista.
Um ficheiro que abrir mantém os bloqueios com que foi guardado, cada um com o seu valor bloqueado.
Um ficheiro que não regista nenhum bloqueio, como um ficheiro guardado por uma versão anterior aos bloqueios ou escrito à mão, abre-se com todos os bloqueios ativados: a vista em `100% · 0, 0` e o separador em `ERD`, quaisquer que sejam a vista e o separador que guardou, e a linguagem, os formatos dos nomes, o tipo de delimitador e a vista de nomes bloqueados tal como os guardou.
Um ficheiro guardado por uma versão anterior ao bloqueio `Name View` abre-se na vista `Physical Names` com o bloqueio `Name View` ativado, mesmo que todos os outros bloqueios que regista estejam desativados.
Uma importação com a opção `Import` que substitui o diagrama também define os bloqueios: um ficheiro JSON traz os bloqueios que regista e os valores que estes contêm, e um ficheiro SQL, DBML, AML ou GraphQL mantém os bloqueios atuais, mas repõe a vista em `100% · 0, 0`, bloqueada ou não — consulte [Importar ficheiros externos](./file-import-export.md#importing-external-files). Anular a importação repõe os bloqueios e os valores bloqueados que esta substituiu.

Uma alteração que um bloqueio mantém fora do ficheiro não conta como alteração. O VS Code não marca o separador como modificado, e o Obsidian e um IDE da JetBrains deixam o ficheiro como estava, tanto quando guardam automaticamente como quando o separador se fecha.
Assim, com todos os bloqueios ativados, percorrer um diagrama, mudar de separador, experimentar outra linguagem, outro formato do nome ou outro delimitador e mudar a vista de nomes nunca aparecem no `git diff`.
Com o bloqueio `Viewport` desativado, deslocar a vista e fazer zoom alteram o ficheiro; com o bloqueio `Canvas Type` desativado, o mesmo acontece ao mudar de separador, incluindo para o separador Definições; e, com o bloqueio `Name View` desativado, o mesmo acontece ao mudar a vista de nomes.
O ficheiro vazio de um diagrama novo mantém-se vazio até à primeira alteração que o ficheiro guarda: uma edição, uma alteração a uma definição que nenhum bloqueio retém ou um bloqueio ativado ou desativado.
Abrir um diagrama e fechá-lo sem nenhuma alteração desse tipo deixa o ficheiro como estava, qualquer que seja a versão ou a máquina que o escreveu. O ficheiro contém apenas aquilo que o diagrama é, por uma ordem fixa, e um ficheiro guardado numa forma mais antiga é reescrito nesta forma uma única vez, na sua primeira alteração desse tipo — consulte [Forma de armazenamento e valor em tempo de execução](../../api/advanced/schema.md#storage-form-and-runtime-value).
No VS Code, uma revisão reaberta como diagrama com `Reopen Editor With...`, como uma revisão do Git ou uma entrada de Local History, é só de leitura e nunca é marcada como modificada.
No Google Drive, um deslocamento, um zoom ou uma mudança para outro separador nunca é guardado por si só, com ou sem bloqueio. Com o bloqueio `Viewport` desativado, a vista só é escrita juntamente com outra alteração, pelo que um ficheiro do Drive se abre onde a vista estava quando foi guardado pela última vez, e o mesmo acontece com o separador quando o bloqueio `Canvas Type` está desativado. Uma mudança da vista de nomes feita com o bloqueio `Name View` desativado é guardada tal como uma edição, e uma mudança feita enquanto este está ativado, ou num editor só de leitura, nunca é guardada.

Numa [sessão colaborativa](../../api/advanced/collaborative-editing.md), ativar ou desativar um bloqueio chega a todos os editores, e um bloqueio mantém o valor do editor que o ativou.
Desativar o bloqueio `Language`, o de um formato do nome, o bloqueio `Bracket Type` ou o bloqueio `Name View` dá a todos os editores o valor mostrado no editor que o desativou, pelo que todos guardam o mesmo valor. Desativar o bloqueio `Viewport` ou `Canvas Type` não move a vista nem o separador de ninguém.
Uma linguagem, um formato do nome ou um delimitador escolhidos enquanto o respetivo bloqueio está ativado continuam a chegar a todos os editores, mas a vista de nomes é própria de cada editor enquanto o bloqueio `Name View` está ativado: uma mudança só aparece no editor que a fez, e ativar o bloqueio não move a vista de ninguém. Enquanto está desativado, uma mudança em qualquer editor que não seja só de leitura muda a vista de todos os editores.
Um agente de programação que trabalhe através do servidor MCP não tem nenhuma ferramenta para os bloqueios nem para as definições que estes retêm, e lê uma linguagem, um formato do nome ou um tipo de delimitador bloqueados com o valor que o ficheiro mantém. Só as suas importações no modo `replace` os afetam, tal como uma importação com a opção `Import` — consulte [Definições](../../mcp/tools.md#settings) e [Importação](../../mcp/tools.md#import). A sua ferramenta `erd_list` e o formato `snapshot` da ferramenta `erd_read` deixam de fora a vista de nomes, e o agente edita o esquema, incluindo os nomes lógicos, seja qual for a vista que uma pessoa esteja a ver.

## Ajustar a ordem das colunas {#adjusting-column-order}

Define a ordem de apresentação das colunas nas tabelas.
Arraste uma linha para a mover — a linha inteira pode ser arrastada, e o ícone da pega de arrastamento assinala-a. As nove linhas, pela ordem predefinida, são `Logical Name`, `Name`, `DataType`, `Domain`, `Not Null`, `Unique`, `Auto Increment`, `Default` e `Comment`.
A linha `Logical Name` posiciona a célula do nome lógico que a linha de uma coluna desenha na vista `Both Names`. Na vista `Logical Names`, o nome lógico ocupa, em vez disso, o lugar da linha `Name`, e a vista `Physical Names` não desenha nenhuma — consulte [Vista de nomes](./logical-names.md#name-view). A linha `Domain` posiciona a célula Domínio que Opções de vista → `Domain` mostra — consulte [A célula Domínio](./logical-names.md#the-domain-cell).
Uma célula ocultada por uma [opção de vista das tabelas](./table-related-functions.md#table-view-options) ou deixada de fora pela vista de nomes mantém o seu lugar na lista, pelo que a ordem se aplica às células que estiverem visíveis.
Um diagrama cuja ordem foi definida antes de as linhas `Logical Name` e `Domain` existirem recebe a linha `Logical Name` imediatamente antes da linha `Name` e a linha `Domain` imediatamente depois da linha `DataType`, onde quer que estas estejam na sua ordem.
A marca de [chave alternativa](./table-related-functions.md#alternate-keys) (`AK1.1` e assim sucessivamente) não é uma destas linhas. Aparece sempre no fim de uma linha, depois da célula que esta ordem colocar em último lugar.

![Deslocar para baixo até Column Order e arrastar a linha Comment para cima, até ficar por baixo de Name, o que coloca cada comentário logo a seguir ao nome da respetiva coluna](/img/demo-settings-column-order.webp)

## Atalhos {#shortcuts}

O separador `Shortcuts` é uma tabela só de leitura com as colunas `Command` e `Keybinding`, que lista as combinações de teclas da plataforma em que está.

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

A maioria destes atalhos só funciona no separador ERD e fica suspensa enquanto estiver aberta a pesquisa rápida, o painel Propriedades da tabela, o visualizador de diferenças, a pré-visualização da disposição automática, a viagem no tempo, a caixa de diálogo [`Export image`](./file-import-export.md#image) ou a caixa de diálogo [`Map Columns`](./relationship-editing.md#map-columns).
Os atalhos `Search`, `Toggle Explorer` e `Stop` são as exceções: `Search` abre ou fecha a pesquisa rápida a partir de qualquer separador, `Toggle Explorer` abre o [explorador](./explorer.md#opening-and-closing) na respetiva pesquisa a partir de qualquer separador e mostra o separador ERD, e `Stop` é o que fecha a pesquisa rápida, o painel Propriedades da tabela, o visualizador de diferenças, a pré-visualização da disposição automática, a viagem no tempo, a caixa de diálogo `Export image`, a caixa de diálogo `Map Columns`, o criador de temas, o seletor `Display Language`, o seletor de cores, a lista que um botão `Name View` abre e um menu de contexto aberto.
O atalho `Toggle Explorer` volta a fechar o explorador enquanto este está aberto no separador ERD e não está oculto pelo modo zen, tal como faz o botão `Explorer` da barra de ferramentas. Com a pesquisa rápida, o painel Propriedades da tabela, o criador de temas, o seletor `Display Language`, a caixa de diálogo `Export image` ou a caixa de diálogo `Map Columns` abertos, fecha, em vez disso, o que estiver aberto e leva o foco do teclado para a pesquisa do explorador.
O atalho `Toggle Explorer` não faz nada enquanto uma célula, uma nota ou o nome de um grupo de tabelas está a ser editado. Nem ele nem o atalho `Search` fazem nada enquanto uma célula do separador [Dicionário](./dictionary.md) está a ser editada, pelo que o texto aí escrito se mantém. Enquanto estiver aberto o visualizador de diferenças, a pré-visualização da disposição automática ou a viagem no tempo, o atalho `Toggle Explorer` deixa a sua tecla para o navegador ou para o host — consulte [A barra de localização do navegador](./find-and-replace.md#the-browsers-find-bar).
No separador ERD, o atalho `Stop` termina a edição em curso de uma célula ou de uma nota, fecha o editor do nome de um [grupo de tabelas](./table-groups.md) sem mudar o nome do grupo ou cancela uma relação ou um grupo `New Table Group` que esteja a ser desenhado, e deixa a seleção como está. Se nada disso estiver aberto, limpa a seleção e a célula com o foco e, no mesmo premir da tecla, fecha um seletor de cores aberto. Um criador de temas ou um seletor `Display Language` aberto fecha-se no mesmo premir da tecla em qualquer dos casos.
Numa célula do nome lógico com a lista de termos aberta, premir `Stop` pela primeira vez fecha apenas a lista — consulte [Completar os nomes dos termos](./logical-names.md#completing-term-names).
Um explorador, um criador de temas ou um seletor `Display Language` aberto não suspende nenhum dos atalhos na tela. O atalho `Stop` nunca fecha o explorador. Para saber o que `Stop` e as outras teclas fazem dentro do explorador, consulte [Teclas no explorador](./explorer.md#keys-in-the-explorer), e, dentro do seletor, consulte [Escolher um idioma](./language-and-theme.md#picking-a-language).
O atalho `Delete Selection` remove todas as tabelas, notas e grupos de tabelas selecionados ou, quando está selecionada uma única tabela com algumas das suas colunas e o zoom está acima de `70%`, essas colunas — consulte [Eliminação de tabelas e notas](./table-related-functions.md#table-and-memo-deletion). O atalho `Remove Table, Memo` também remove os grupos de tabelas selecionados.
O atalho `Add Table Group` inicia o desenho de um grupo [`New Table Group`](./table-groups.md#drawing-a-group), tal como o botão `New Table Group` da [barra de ferramentas da tela](./table-related-functions.md#canvas-toolbar), e premi-lo uma segunda vez cancela o desenho. O atalho `Group Selected Tables` consiste em premir duas teclas sem tecla modificadora, `T` e depois `G` no espaço de um segundo. Coloca as tabelas selecionadas num novo grupo e abre o editor do respetivo nome, tal como a opção `Group selected tables` do menu de contexto de uma tabela, e não faz nada quando não há nenhuma tabela selecionada — consulte [Agrupar as tabelas selecionadas](./table-groups.md#grouping-selected-tables). Nenhum dos dois faz nada num editor só de leitura nem enquanto os grupos estão [ocultos](./table-groups.md#hiding-groups).
Os atalhos `Zoom In`, `Zoom Out` e `Zoom Reset` também aplicam o zoom no separador [Visualização](./visualization.md#toolbar), tanto no modo `Graph` como no modo `Flow`, exceto se a pesquisa rápida estiver aberta.
No modo `Flow`, os atalhos `Undo` e `Redo` recuam e avançam por aquilo a que o Flow foi restringido, tal como os seus botões `Previous table` e `Next table`, exceto se a pesquisa rápida estiver aberta. Aí, nunca anulam o diagrama e, no modo `Graph`, não fazem nada — consulte [Tabela anterior e tabela seguinte](./visualization.md#previous-table-and-next-table).
No separador Visualização, o atalho `Stop` também fecha o menu de [apresentação das linhas](./visualization.md#row-display) e cancela uma [disposição do Flow](./visualization.md#how-flow-is-placed) que ainda esteja em curso; não alarga uma vista restrita com `Focus on this table`.
O atalho `Focus on this table` abre o separador Visualização no modo `Flow`, restrito às tabelas selecionadas e a todas as tabelas a uma relação de distância, e não faz nada quando não há nenhuma tabela selecionada — consulte [Focar em tabelas](./visualization.md#focusing-on-tables).
No separador Dicionário, os atalhos `Undo` e `Redo` atuam sobre o histórico da folha apresentada em vez do histórico do diagrama, e não fazem nada na folha `Checks` — consulte [Folhas do dicionário](./undo-redo.md#dictionary-sheets). Nas folhas `Domains`, `Words` e `Terms`, o atalho `Add Column` insere linhas abaixo da seleção, a sua combinação de teclas com `Shift` insere-as acima, e o atalho `Remove Column` elimina as linhas que a seleção abrange — consulte [Adicionar e eliminar linhas](./dictionary.md#adding-and-deleting-rows). Para as outras teclas do separador, consulte [Teclas no separador](./dictionary.md#keys-on-the-tab).
Os atalhos `Select All Table, Memo`, `Hand Tool`, `Delete Selection` e `Group Selected Tables` cedem a vez ao cursor de texto: enquanto está a editar uma célula ou uma nota ou a escrever num campo de texto, como o campo Localizar do explorador, `Ctrl + A` (Windows/Linux) ou `⌘ + A` (Mac) seleciona o texto, `Space` escreve um espaço, `Delete` e `Backspace` apagam texto, e `T` e depois `G` escreve as duas letras.
Copiar e colar usam as teclas do próprio navegador, `Ctrl + C` e `Ctrl + V` (Windows/Linux) ou `⌘ + C` e `⌘ + V` (Mac), pelo que não constam desta lista — consulte [Edição de tabelas](./table-editing.md).

As combinações de teclas não podem ser alteradas a partir deste separador.
Um host que incorpora o editor reatribui-as com [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), exceto as de `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` e `Zoom Reset`, que são fixas.
O separador `Shortcuts` lista então as combinações do host: um comando que o host não reatribui mantém a sua combinação predefinida, e um que o host não associa a nenhuma tecla não mostra nenhuma.
As teclas de linha do separador Dicionário seguem os atalhos `Add Column` e `Remove Column`, pelo que acompanham a reatribuição de qualquer um dos dois — consulte [`dictionaryRowChords`](../../api/erd-editor-element.md#dictionaryrowchords).

No Obsidian, estas teclas chegam ao editor sempre que o separador do Obsidian com o diagrama está ativo, mesmo quando um atalho de teclado do Obsidian usa a mesma tecla, como `Alt + Enter`, `Ctrl + K` e `Ctrl + F` (Windows/Linux) ou `⌥ + Enter`, `⌘ + K` e `⌘ + F` (Mac). O mesmo acontece com `Alt + Shift + Enter` (Windows/Linux) ou `⌥ + Shift + Enter` (Mac) do separador Dicionário, que não está em nenhuma linha desta lista. Todos os outros atalhos de teclado do Obsidian continuam a funcionar aí. Para `Ctrl + F` ou `⌘ + F`, consulte [A barra de localização do navegador](./find-and-replace.md#the-browsers-find-bar).
