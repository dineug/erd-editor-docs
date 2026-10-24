---
sidebar_position: 5
description: Selecionar, mover, copiar, duplicar e eliminar tabelas e notas, configurar cores e opções de vista, definir índices e chaves alternativas, escolher uma base de dados, navegar na tela infinita e comparar documentos.
---

# Funções relacionadas com tabelas

Tudo o que se faz com tabelas e notas depois de existirem — selecionar, mover, copiar, eliminar, atribuir cores e definir o que a tela mostra — e ainda os controlos da tela à sua volta.  
Primeiro vêm os comandos de tabelas e notas; depois, as propriedades da tabela, focar em tabelas, os índices e as chaves alternativas, a disposição automática e a base de dados; e, por último, a própria tela: a barra de ferramentas da tela, o zoom, o deslocamento da vista e onde termina um salto, e o visualizador de diferenças.  
Os grupos de tabelas, as caixas que reúnem tabelas, têm uma página própria — consulte [Grupos de tabelas](./table-groups.md).  
O mesmo acontece com os nomes lógicos e a vista de nomes, que decide os nomes que as tabelas mostram — consulte [Nomes lógicos](./logical-names.md).

## Seleção múltipla {#multiple-selection}

São suportados três métodos:

- `Ctrl + drag` (Windows/Linux) ou `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac)
- `Ctrl + A` ou `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` ou `⌘ + ⌥ + A` (Mac)

As notas selecionam-se da mesma forma, e qualquer um dos dois atalhos para selecionar tudo seleciona todas as tabelas e notas de uma vez. As notas ocultadas com Opções de vista → `Memos` não são abrangidas por selecionar tudo nem por um retângulo de seleção — consulte [Opções de vista das tabelas](#table-view-options).  
Os [grupos de tabelas](./table-groups.md#selecting-groups) são adicionados à seleção com `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac) na respetiva barra de título, mas selecionar tudo nunca inclui nenhum.  
`Ctrl + A` cede o lugar ao cursor de texto, pelo que seleciona o texto, e não o diagrama, enquanto está a editar uma célula.  
Um retângulo de seleção marca uma tabela ou nota quando cobre o seu centro, e não quando apenas toca num bordo. Só abrange um grupo de tabelas quando envolve toda a caixa do grupo, pelo que um retângulo desenhado dentro de um grupo seleciona tabelas sem o grupo.  
Um clique com o botão direito em algo já selecionado mantém toda a seleção, pelo que opções do menu como `Color`, `Group selected tables` e `Delete selected` atuam sobre toda ela. Um clique com o botão direito em qualquer outra tabela, nota ou grupo de tabelas seleciona apenas esse elemento, mesmo com `Ctrl` ou `⌘` premido, e um clique com o botão direito numa relação ou numa zona vazia da tela limpa a seleção.  
`Escape` limpa a seleção. Enquanto estiver aberto o editor de uma célula, de uma nota ou do nome de um grupo de tabelas, ou enquanto se desenha uma relação ou um grupo com `New Table Group`, o primeiro `Escape` termina essa ação e um segundo limpa a seleção.

![Selecionar tabelas com ⌘ + drag e ⌘ + click e, depois, todas as tabelas e notas com ⌘ + A](/img/demo-table-select.webp)

Numa sessão colaborativa, a seleção, a célula com o foco e o retângulo de seleção de cada participante são desenhados na tela com a cor desse participante — consulte [Edição colaborativa](../../api/advanced/collaborative-editing.md).  
Quando um participante está a ver outra vista de nomes, a célula com o foco desse participante é desenhada na célula que a sua vista desenha no lugar dela, como a célula do nome desse participante sobre a sua célula do nome lógico — consulte [Colaboradores](./logical-names.md#collaborators).

## Mover várias tabelas {#moving-multiple-tables}

Arraste qualquer tabela ou nota que já faça parte da seleção e toda a seleção move-se com ela — não é necessária nenhuma tecla modificadora.  
Uma tabela é arrastada pelo cabeçalho ou por qualquer uma das linhas das suas colunas, pelo que um arrasto que começa na linha de uma coluna move a tabela, e não a coluna. As colunas movem-se, em vez disso, pela pega de arrastamento junto à linha com o foco — consulte [Reordenar e mover colunas](./table-editing.md#rearranging-and-moving-columns).  
Numa célula do cabeçalho ou na linha de uma coluna, a tabela só começa a mover-se depois de o ponteiro percorrer uma pequena distância, pelo que um clique aí continua a pôr o foco na célula e um duplo clique continua a abrir o respetivo editor. Um arrasto nunca começa no bordo de cor de uma tabela, que abre o seletor de cores, nos botões `+` e `x` do seu cabeçalho nem no botão `x` da linha de uma coluna.  
Arrastar algo fora da seleção reduz a seleção a esse elemento e move apenas esse. `Ctrl + drag` (Windows/Linux) ou `⌘ + drag` (Mac) mantém a seleção em qualquer dos casos.  
Só o botão esquerdo do rato move tabelas e notas. Um clique com o botão direito escolhe aquilo sobre o qual o menu de contexto atua e não move nada, e um arrasto com o botão do meio desloca antes a vista da tela — consulte [Navegar na tela](#getting-around-the-canvas).

![Arrastar uma de duas tabelas selecionadas move ambas, e a relação acompanha-as](/img/demo-table-multiple-move.webp)

Um [grupo de tabelas](./table-groups.md) selecionado também se move, levando as suas tabelas, e uma tabela que esteja simultaneamente selecionada e num grupo em movimento move-se uma só vez.  
O local onde larga uma tabela pode colocá-la num grupo ou retirá-la dele — consulte [Adicionar e remover tabelas](./table-groups.md#adding-and-removing-tables).

As tabelas e as notas partilham uma única ordem de sobreposição. Premir o botão do rato sobre uma tabela ou nota, seja o esquerdo ou o direito, trá-la para a frente de todas as outras tabelas e notas, e premir o botão sobre a barra de título de um grupo de tabelas, ou clicar com o botão direito no seu corpo, traz as suas tabelas para a frente.  
A ordem não é guardada: um diagrama reaberto sobrepõe as tabelas pela ordem em que o ficheiro as lista, com todas as notas por cima delas.

## Copiar e colar tabelas e notas {#copyingpasting-tables-and-memos}

Copia as tabelas e notas selecionadas e cola-as como novas.  
Atalhos: `Ctrl + C` (Windows/Linux) ou `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) ou `⌘ + V` (Mac)

Uma tabela copiada mantém o nome, o nome lógico, o comentário, as colunas e a cor; uma nota copiada mantém o texto, o tamanho e a cor.  
Cada coluna copiada mantém o seu nome lógico, e cada nome de tabela e de coluna mantém a informação sobre se foi derivado dos dicionários — consulte [Derivar nomes físicos](./dictionary.md#deriving-physical-names).  
Uma coluna colada só mantém o seu vínculo ao domínio quando se verificam duas condições: o diagrama em que é colada contém esse mesmo domínio, e não apenas um com o mesmo nome, e o domínio ainda tem o tipo de dados com que a coluna foi copiada. Caso contrário, a coluna fica sem domínio e mantém o tipo com que foi copiada — consulte [Vincular uma coluna](./dictionary.md#linking-a-column).  
Os índices e as relações também acompanham a cópia: um índice é copiado por inteiro para a tabela copiada, e uma relação é copiada com o seu tipo e as suas ações ON DELETE e ON UPDATE quando as duas tabelas que liga estão no conjunto copiado. Meia relação é descartada, em vez de ficar a apontar para o original.  
As cópias coladas passam a ser a nova seleção, e colar a mesma cópia outra vez desloca-a mais `50px` de cada vez, pelo que colagens repetidas não ficam empilhadas umas sobre as outras.  
Uma cópia não mantém o seu [grupo de tabelas](./table-groups.md): a tabela colada não fica em nenhum grupo, mesmo quando cai dentro da caixa de um grupo, e um grupo selecionado não é copiado.  
Enquanto Opções de vista → `Memos` oculta as notas, uma colagem continua a adicionar as notas que contém, ocultas e não selecionadas, pelo que só as tabelas coladas passam a ser a seleção.

![Copiar duas tabelas relacionadas e colá-las duas vezes, com a relação incluída](/img/demo-table-copy-paste.webp)

Quando há colunas selecionadas dentro de uma tabela com o foco, o mesmo atalho copia antes essas colunas — consulte [Edição de tabelas](./table-editing.md).

## Duplicar tabelas e notas {#duplicating-tables-and-memos}

Mantenha `Alt` premido e arraste uma tabela ou nota com o botão esquerdo do rato.  
Uma tabela é agarrada pelo cabeçalho ou por qualquer linha de coluna, pelo que `Alt + drag` na linha de uma coluna duplica a tabela e deixa a ordem das colunas intacta. Manter `Alt` premido na pega de arrastamento da coluna não duplica nada: a coluna move-se tal como num arrasto normal pela pega — consulte [Reordenar e mover colunas](./table-editing.md#rearranging-and-moving-columns).  
Uma pré-visualização translúcida acompanha o ponteiro, e soltar o botão larga a cópia onde está a pré-visualização.  
Se aquilo que agarra já faz parte de uma seleção, toda a seleção é duplicada. Caso contrário, a seleção é substituída pela entidade sob o ponteiro.  
`Alt + click` sem mover larga a cópia `50px` para baixo e para a direita, avançando mais sempre que esse lugar já está ocupado.

Um duplicado traz o mesmo que uma [colagem](#copyingpasting-tables-and-memos): nomes e nomes lógicos, comentários, colunas, cores, tamanhos das notas e os índices e as relações que pertencem inteiramente ao que copiou. Como fica no mesmo diagrama, mantém o vínculo ao domínio de cada coluna tal como está. Tal como uma colagem, não fica em nenhum grupo de tabelas.  
`Alt + drag` na barra de título de um grupo de tabelas move o grupo como um arrasto simples; um grupo nunca é duplicado.

![Duplicar uma tabela com Alt + drag e, depois, Alt + click para outra cópia em baixo e à direita](/img/demo-table-duplicate.webp)

## Eliminação de tabelas e notas {#table-and-memo-deletion}

Elimina as tabelas, notas e [grupos de tabelas](./table-groups.md) selecionados.  
Atalhos:

- `Delete` ou `Backspace`. Estas teclas removem toda a seleção, exceto quando a única coisa selecionada é uma tabela com algumas das suas colunas selecionadas e o zoom está acima de `70%`: nesse caso, removem antes essas colunas — consulte [Eliminação de colunas](./table-editing.md#column-deletion).
- `Ctrl + Backspace` ou `Ctrl + Delete` (Windows/Linux), `⌘ + Backspace` ou `⌘ + Delete` (Mac). Estes atalhos removem sempre as tabelas, notas e grupos de tabelas selecionados, mesmo enquanto há colunas selecionadas.

![Eliminar uma tabela e as suas relações com a tecla Delete e, depois, uma tabela e uma nota em conjunto com Delete selected no menu da nota](/img/demo-table-remove.webp)

Os menus de contexto também eliminam. A última opção do menu de uma tabela ou de uma nota indica `Delete selected` enquanto essa tabela ou nota é um de dois ou mais elementos selecionados, e remove toda a seleção. Caso contrário, indica `Delete` e remove apenas essa tabela ou nota. Sobre a linha de uma coluna selecionada, o menu de uma tabela indica antes `Delete column` ou `Delete columns`, como em [Eliminação de colunas](./table-editing.md#column-deletion).

Remover uma tabela remove também as suas relações e índices. Remover um grupo de tabelas mantém as suas tabelas, sem grupo — consulte [Remover um grupo](./table-groups.md#removing-a-group).  
Não há confirmação, cada remoção é um passo de anulação e, num editor `readonly`, nada é removido.  
Mantidas premidas, as teclas `Delete` e `Backspace` removem uma só vez e nunca removem uma relação — consulte [Edição de relações](./relationship-editing.md#deletion). Enquanto escreve numa célula, numa nota ou em qualquer outro campo de texto, editam antes o texto.  
O separador Definições apresenta as duas teclas como `Delete Selection` — consulte [Atalhos](./settings.md#shortcuts).

## Atribuição de cores a tabelas e notas {#table-and-memo-color-specification}

Pode atribuir cores para diferenciar por categoria.  
Uma tabela mostra a sua cor ao longo do bordo esquerdo, e uma nota ao longo do topo. Clique nesse bordo ou nessa faixa com o botão esquerdo, ou escolha a opção `Color` no menu de contexto da tabela ou da nota, para abrir o seletor de cores junto ao ponteiro. A cor é aplicada a todas as tabelas, notas e grupos de tabelas selecionados, e não apenas àquele em que clicou.  
A cor de um grupo de tabelas atribui-se com a opção `Color` do seu próprio menu, e uma tabela num grupo com cor mostra a cor do grupo em todo o cabeçalho, mantendo a sua própria cor no bordo esquerdo — consulte [Atribuir uma cor a um grupo](./table-groups.md#coloring-a-group).

![Escolher a cor predefinida Blue na faixa de cor de uma nota para duas tabelas selecionadas e a nota e, depois, retirar a cor com No color](/img/demo-table-color.webp)

O seletor contém, de cima para baixo:

- Uma área de saturação e brilho e, depois, o controlo de deslize de matiz com uma pré-visualização da cor ao lado. Onde o navegador disponibiliza um conta-gotas, um botão de pipeta antes do controlo de deslize, `Pick a color from the screen`, recolhe uma cor de qualquer ponto do ecrã.
- Os campos `Hex`, `R`, `G` e `B`. O campo `Hex` aceita 3, 4, 6 ou 8 dígitos hexadecimais, com ou sem `#`, ou um `rgb()`, um `hsl()` ou um nome de cor CSS colados. Um valor completo de 6 ou 8 dígitos aplica-se à medida que escreve, e qualquer outro ao premir `Enter` ou ao sair do campo. Os campos `R`, `G` e `B` aceitam números inteiros, leem qualquer valor acima de `255` como `255` e aplicam-se ao premir `Enter` ou ao sair do campo. O texto que o seletor não consegue ler é descartado.
- Dezasseis amostras predefinidas em duas filas de oito: Red, Orange, Amber, Yellow, Lime, Green, Teal, Cyan, Blue, Indigo, Violet, Purple, Pink, Crimson, Brown e Gray. Passar o ponteiro sobre uma amostra mostra o seu código hexadecimal.
- `Document colors`: até oito cores que as tabelas, notas e grupos de tabelas do documento já utilizam, primeiro as mais usadas. A fila só aparece quando existe alguma.
- `No color`.

Uma cor é sempre opaca: o seletor não tem nenhum controlo de transparência e descarta qualquer transparência que um valor escrito ou colado traga.  
Abrir o seletor não altera nada, e escolher a cor que a seleção já tem não acrescenta nenhum passo de anulação.

A opção `No color` limpa a cor de todas as tabelas, notas e grupos de tabelas selecionados num só passo de anulação e fecha o seletor. A opção `Remove color`, logo abaixo de `Color` nos menus de contexto da tabela, da nota e do grupo de tabelas enquanto algum elemento selecionado tem cor, faz o mesmo sem abrir o seletor.

O seletor recebe o foco do teclado quando se abre, e `Tab` e `Shift + Tab` percorrem os seus controlos. As teclas de seta movem a área e o controlo de deslize de matiz em 1, ou em 10 com `Shift`, e passam de amostra em amostra, aplicando cada uma à medida que avançam.  
Enquanto o seletor tem o foco do teclado, anular e refazer, os atalhos de zoom, `Search` e `Toggle Explorer` continuam a chegar ao editor, e os outros atalhos do editor não: os atalhos de [eliminação](#table-and-memo-deletion) não removem nada, e `Delete` e `Backspace` apenas editam o texto dos campos `Hex`, `R`, `G` e `B`.  
`Escape` fecha o seletor, tal como premir o botão do rato na tela fora dele.  
Premir o botão no [explorador](./explorer.md) não é premir na tela, pelo que o seletor fica aberto. Uma linha escolhida aí muda a seleção, e a escolha seguinte atribui a cor à nova seleção.

## Opções de vista das tabelas {#table-view-options}

Disponibiliza as seguintes opções de vista:

- Table Comment
- Column Comment
- DataType
- Domain
- Default
- Not Null
- Unique
- Alternate Key
- Auto Increment
- Relationship
- Referential Actions
- Table Groups
- Memos

As opções `Domain`, `Unique`, `Alternate Key` e `Auto Increment` estão desativadas por predefinição, e as restantes estão ativadas.  
Os nomes que as tabelas mostram não são uma opção de vista: a entrada `Name View`, logo a seguir a `View Option` no menu de contexto da tela, escolhe nomes físicos, nomes lógicos ou ambos — consulte [Mudar de vista](./logical-names.md#switching-the-view).  
A opção `Domain` dá a cada coluna uma célula, posicionada pela [ordem das colunas](./settings.md#adjusting-column-order), com o nome do domínio a que a coluna está vinculada. Uma coluna que não está vinculada a nenhum domínio que a folha `Domains` contenha mostra aí o marcador de posição `domain`, esbatido. A célula aparece em todas as vistas de nomes. Enquanto a opção `Domain` está desativada, a vista `Logical Names` mostra, em vez disso, o nome de um domínio vinculado na célula do tipo — consulte [A célula Domínio](./logical-names.md#the-domain-cell).  
A opção `Alternate Key` marca as colunas de cada chave alternativa, como `AK1.1` — consulte [Chaves alternativas](#alternate-keys).  
A opção `Referential Actions` mostra as etiquetas `D:` e `U:` que as ações ON DELETE e ON UPDATE de uma relação colocam na extremidade filha do seu conector — consulte [Como ler um conector](./relationship-editing.md#reading-a-connector). Desativá-la oculta apenas essas etiquetas e não move nenhuma tabela nem conector.  
A opção `Table Groups` mostra os [grupos de tabelas](./table-groups.md) e as cores dos grupos nos cabeçalhos das suas tabelas. Desativá-la oculta-os na tela, no minimapa e nas exportações de imagem, não move nenhuma tabela e mantém cada tabela no seu grupo — consulte [Ocultar grupos](./table-groups.md#hiding-groups). Também retira a pasta `Table Groups` do [explorador](./explorer.md#the-tree) e o botão `New Table Group` da [barra de ferramentas da tela](#canvas-toolbar), e a pesquisa do explorador deixa de encontrar nomes de grupos.  
A opção `Memos` mostra as notas. Desativá-la oculta todas as notas na tela, no minimapa e nas exportações de imagem, e não move nenhuma tabela nem conector. As notas ocultas não ocupam espaço, pelo que as barras de deslocamento, o minimapa e a bússola `Go to content` não as têm em conta.  
Ocultar as notas retira-as da seleção e fecha um editor de nota aberto. O [explorador](./explorer.md#the-tree) deixa de mostrar a pasta `Memos`, e a sua pesquisa [Localizar e substituir](./find-and-replace.md) e o prefixo `:` da pesquisa rápida não as pesquisam. Enquanto estão ocultas, a opção `New Memo` sai do menu de contexto, da [barra de ferramentas da tela](#canvas-toolbar), da pesquisa rápida e do [ecrã de boas-vindas](./editing-start.md#welcome-screen), e `Alt + M` não adiciona nenhuma nota. Uma colagem ou um [Importar e adicionar](./file-import-export.md#import-and-add) continua a adicionar as notas que contém, ocultas e não selecionadas.  
Num editor `readonly`, os interruptores não alteram nada.

![Alternar as entradas do menu Opções de vista enquanto as tabelas se reorganizam, marcar um índice único composto como AK1.1 e AK1.2 com Alternate Key e, depois, desativar e voltar a ativar Memos](/img/demo-view-options.webp)

Os cartões do modo `Flow` do separador Visualização não seguem estas opções, nem sequer a opção `Domain`: usam a sua própria [apresentação das linhas](./visualization.md#row-display) e desenham os seus conectores mesmo com a opção `Relationship` desativada. As células que um cartão dispõe dependem apenas da vista de nomes — consulte [Nomes nos cartões](./visualization.md#names-on-the-cards).

## Propriedades da tabela {#table-properties}

Abre o painel de propriedades de uma tabela.  
Comece pela opção `Table Properties` do menu de contexto da tabela, que o abre para a tabela em que clicou com o botão direito, ou selecione uma tabela e prima `Alt + Space`.  
O painel abre-se no meio de uma tela esbatida. Só a tela fica esbatida, pelo que um [explorador](./explorer.md#dialogs-beside-it) aberto continua aberto e utilizável ao lado. O seu cabeçalho contém o título `Table Properties`, as cinco tabelas abertas mais recentemente como chips, com a atual realçada, e um botão de fechar. Cada chip nomeia a sua tabela tal como a [vista de nomes](./logical-names.md#beyond-the-canvas) o faz. Clique num chip para passar para essa tabela sem reabrir o painel.  
Abaixo do cabeçalho há três separadores: `Indexes`, `Schema SQL` e `Code Generator`. O painel mantém o mesmo tamanho para os três, pelo que mudar de separador não o move nem o redimensiona.  
Feche-o com o botão de fechar, com `Escape` ou clicando fora dele, na tela.  
Escolher no explorador uma linha que não seja uma pasta, ou ir para uma correspondência da sua pesquisa, fecha o painel Propriedades da tabela antes do salto. O mesmo faz `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac), que abre a pesquisa do explorador ou põe o cursor de texto no seu campo Localizar quando o explorador já está aberto. Qualquer outro clique no explorador, incluindo numa linha de pasta, ou no botão `Explorer` da barra de ferramentas, deixa o painel Propriedades da tabela aberto. Um `Escape` premido enquanto o teclado está no explorador apenas devolve o teclado à tela, pelo que é preciso um segundo `Escape` para fechar o painel Propriedades da tabela.

O separador `Indexes` é explicado em [Índices](#indexes).  
O separador `Schema SQL` mostra o DDL da tabela para a [base de dados](#databases) selecionada: o seu `CREATE TABLE`, as restrições separadas que algumas bases de dados escrevem para as suas colunas únicas e os seus índices. Escreve sempre instruções `CREATE` simples, sem cabeçalho, sem scripts antes nem depois das tabelas e sem nomes lógicos em comentários vazios, seja qual for a configuração do separador [Esquema SQL](./schema-sql.md) da barra de ferramentas — consulte [Nomes lógicos como comentários](./schema-sql.md#logical-names-as-comments). Não tem painel de opções, e o seu menu de contexto disponibiliza apenas as opções `Database` e `Bracket`.  
O separador `Code Generator` gera código apenas para esta tabela — consulte [Gerador de código](./code-generator.md).

Num editor `readonly`, o painel continua a abrir-se, com um distintivo `Read only` ao lado do título, mas o seu separador `Indexes` não permite edições.

## Focar em tabelas {#focusing-on-tables}

Abre o separador Visualização no modo `Flow`, restringido às tabelas escolhidas e a todas as tabelas a uma relação de distância delas.  
Comece pelo menu de contexto da tabela com a opção `Focus on this table`, ou selecione uma ou mais tabelas e prima `Alt + F`.  
Quando a tabela em que clica com o botão direito é uma de várias tabelas selecionadas, a opção indica `Focus on selected tables` e foca toda a seleção. Clicar com o botão direito numa tabela fora da seleção foca apenas essa tabela.  
O atalho usa as tabelas selecionadas, deixa as notas de fora e não faz nada quando não há nenhuma tabela selecionada.  
Um [grupo de tabelas](./table-groups.md) selecionado não conta aqui, tanto no atalho como na opção do menu: as suas tabelas só são usadas quando elas próprias estão selecionadas, o que a opção `Select tables` do menu do grupo faz.  
O que a vista restrita mostra, e como voltar ao diagrama completo, é explicado em [Visualização](./visualization.md#focusing-on-tables), e como recuar e avançar por aquilo que o Flow mostrou antes, em [Tabela anterior e tabela seguinte](./visualization.md#previous-table-and-next-table).

## Índices {#indexes}

Os índices definem-se no separador `Indexes` do painel de propriedades da tabela e são incluídos no Esquema SQL exportado.

O lado esquerdo lista as chaves e os índices da tabela em dois grupos.  
O grupo `Keys`, mostrado quando a tabela tem alguma, lista as chaves que as suas colunas declaram: `PK_<table name>` sobre as colunas marcadas como PK e, depois, `UQ_<table name>_<column name>` para cada coluna marcada como Único, pela ordem das colunas. Os nomes são os nomes físicos que o Esquema SQL da base de dados selecionada escreve, seja qual for a vista de nomes, pelo que, com a opção `Bracket` em `None`, uma tabela qualificada com esquema como `sales.users` lista `PK_users` em todas as bases de dados exceto Databricks e Snowflake — consulte [Nomes de tabelas qualificados com esquema](./schema-sql.md#schema-qualified-table-names). Cada uma tem a etiqueta `PK` ou `UQ` e está marcada com um cadeado. Aqui são só de leitura e só mudam com os sinalizadores [PK](./table-editing.md#column-primary-key) e [Único](./table-editing.md#not-null-unique-auto-increment) das colunas.  
O grupo `Indexes` lista os índices da tabela pela ordem em que foram adicionados. Cada índice tem um interruptor `UQ` que o torna único, um campo de nome e um `x` que o remove. Um índice que seja uma [chave alternativa](#alternate-keys) mostra também o seu número, como `AK1`. Adicione um índice com o botão `Add Index` no fundo da lista.

O lado direito lista as colunas da tabela em `Columns`, cada uma com uma caixa de verificação. Cada linha mostra as mesmas células que a linha da coluna na tela, seguindo a ordem das colunas, as opções de vista e a [vista de nomes](./logical-names.md#beyond-the-canvas). Nada é editável até se selecionar um índice à esquerda.  
Marque uma coluna para a adicionar ao índice selecionado e desmarque-a para a remover. Selecionar uma chave mostra as suas colunas marcadas, mas as caixas ficam desativadas.  
As colunas do índice selecionado são listadas abaixo, em `Index order`, cada uma nomeada como a vista de nomes a nomeia, com o nome entre parênteses a seguir ao nome lógico na vista `Both Names`, como `Member Number (member_no)`. Arraste-as pela pega de arrastamento para as reordenar e clique no chip `ASC` ou `DESC` de uma linha para inverter a sua ordem de ordenação. Numa chave alternativa, cada linha termina com a sua marca `AK<n>.<m>`. A lista mostra três linhas de cada vez e permite deslocar as restantes.

Num editor `readonly`, selecionar uma chave ou um índice continua a mostrar as suas colunas, mas não há botão `Add Index` nem `x`, e mais nada no separador pode ser alterado.

O [explorador](./explorer.md#the-tree) lista os índices de cada tabela na pasta `Indexes` da tabela, e escolher um deles aí leva à sua tabela. A sua pesquisa também encontra nomes de índices e pode mudar-lhes o nome — consulte [O que é pesquisado](./find-and-replace.md#what-it-searches).

![Abrir o painel Table Properties de orders, onde o separador Indexes lista as chaves PK e UQ acima dos índices, e, depois, adicionar um índice sobre member_id e ordered_at DESC e lê-lo no separador Schema SQL](/img/demo-table-properties.webp)

## Chaves alternativas {#alternate-keys}

Uma chave alternativa é um índice único sobre duas ou mais colunas: um índice do separador `Indexes` com o interruptor `UQ` ativado e pelo menos duas das colunas da tabela marcadas.  
Um índice único sobre uma coluna não diz mais do que o sinalizador Único dessa coluna, pelo que não é uma chave alternativa, e também não o são um índice simples, a chave primária nem uma coluna marcada como Único.

Com a opção `Alternate Key` ativada nas [opções de vista](#table-view-options), o diagrama marca as colunas de cada chave alternativa como o erwin e o IDEF1X as escrevem: `AK1.1`, `AK1.2` e assim sucessivamente. A opção está desativada por predefinição.

As chaves são numeradas pela posição das suas colunas na tabela, e não pela ordem em que os índices foram adicionados. A chave cuja primeira coluna na sua lista `Index order` está mais acima na tabela é a `AK1`. Em caso de empate, decide a coluna seguinte de cada chave, e uma chave que seja a parte inicial de outra mais longa vem antes dela.  
Mover uma coluna dentro da tabela, ou reordenar a lista `Index order` de uma chave, pode renumerar as chaves. Anular a remoção de uma chave devolve-lhe o seu número, e todos os colaboradores veem os mesmos números.

Cada coluna de uma chave é marcada com `AK<n>.<m>`, em que `n` é o número da chave e `m` a posição da coluna na lista `Index order` da chave. Uma coluna que esteja em várias chaves tem todas as marcas, unidas por uma vírgula.  
Por exemplo, numa tabela com as colunas `a`, `b` e `c`, os índices únicos sobre (`c`, `a`) e (`b`, `a`) passam a ser `AK1` = (`b`, `a`) e `AK2` = (`c`, `a`), porque `b` está acima de `c`. Assim, `b` mostra `AK1.1`, `c` mostra `AK2.1` e `a` mostra `AK1.2,AK2.2`.

A marca é desenhada no fim da linha, depois da célula que a [ordem das colunas](./settings.md#adjusting-column-order) puser em último lugar. Não é uma célula, pelo que nunca recebe o foco, nem é editada ou copiada — consulte [Edição de tabelas](./table-editing.md).  
Uma coluna de chave primária ou de chave externa também pode ter uma marca AK, já que a marca não substitui nada: o ícone de chave no início da linha continua a mostrar PK e FK, e a célula Único mantém o seu próprio `UQ`.  
Uma tabela que tenha uma chave alternativa reserva espaço depois da última célula de cada linha para a sua marca mais longa; uma tabela sem nenhuma mantém a sua largura.  
As marcas aparecem na tela ERD, onde uma tabela reduzida ao nome a `70%` ou menos não mostra nenhuma, e numa [exportação de imagem](./file-import-export.md#image), que desenha todas as tabelas por completo seja qual for o zoom. A [pré-visualização ao passar o ponteiro](./visualization.md#hover-preview) do separador Visualização no modo `Graph` também as mostra; os cartões `Flow` nunca as mostram.

O separador `Indexes` mostra os números quer a opção esteja ativada quer não — consulte [Índices](#indexes).

## Disposição automática {#auto-layout}

Dispõe por si todas as tabelas na tela.  
Abra a opção `Auto Layout` a partir do menu de contexto da tela ou da pesquisa rápida e escolha uma de quatro disposições:

| Disposição | O que desenha |
| --- | --- |
| `Force` | Uma simulação: as relações aproximam as tabelas, as vizinhas afastam-se umas das outras e as tabelas sobrepostas separam-se. |
| `Flow` | Da esquerda para a direita ao longo das relações, com um ponto de contacto próprio numa tabela para cada conector. Tenta manter poucos cruzamentos, mas pode deixar alguns que outra disposição evitaria. |
| `Tree - vertical` | Em camadas, de cima para baixo: uma tabela pai fica acima das tabelas que têm uma chave externa para ela. |
| `Tree - horizontal` | As mesmas camadas, da esquerda para a direita. |

A disposição `Force` abre uma pré-visualização enquanto a disposição estabiliza, com os botões `Apply` e `Cancel` no aviso que mostra.  
A pré-visualização é enquadrada no diagrama tal como estava quando a disposição começou, pelo que as tabelas podem sair do enquadramento à medida que a disposição estabiliza. É desenhada a `70%` ou menos, pelo que as suas tabelas aparecem reduzidas ao nome e ao bordo de cor. Abre-se na vista de nomes que está a ver, seja qual for a vista que o ficheiro mantém — consulte [Além da tela](./logical-names.md#beyond-the-canvas).  
`Apply` mantém as posições tal como estão nesse momento, e a disposição aplica-se automaticamente assim que para. `Cancel` ou `Escape` deixa o diagrama como estava.

As outras três são calculadas de uma só vez, fora da thread principal, pelo que não há nada para observar: aparece um aviso enquanto a disposição é calculada, e a disposição final é centrada naquilo que o diagrama já ocupa. `Cancel` ou `Escape` descarta uma disposição de que já não está à espera, e um host que não executa nenhum worker partilhado termina em `Could not place tables` — consulte [Web Workers](../../api/installation.md#web-workers). Uma disposição que não tenha regressado no espaço de 60 segundos termina da mesma forma.

Seja qual for a escolhida, as tabelas e os grupos de tabelas são movidos, e as notas ficam onde estão. As tabelas são posicionadas com as larguras que ocupam na vista de nomes que está a ver. Uma relação de uma tabela consigo própria é ignorada, e várias relações entre as mesmas duas tabelas contam uma só vez.  
Todas as disposições mantêm juntas as tabelas de cada grupo, quer os grupos estejam visíveis quer não, e ajustam cada grupo que contenha tabelas à volta delas — consulte [Grupos de tabelas](./table-groups.md#auto-layout).  
O resultado fica numa única entrada do histórico, pelo que uma anulação repõe todas as tabelas e grupos onde estavam.

![Arrumar um monte de tabelas com a disposição automática Flow a partir do menu de contexto da tela, que as alinha da esquerda para a direita ao longo das suas relações](/img/demo-automatic-table-placement.webp)

## Bases de dados {#databases}

As bases de dados suportadas incluem:

- Databricks
- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- Snowflake
- SQLite

Escolha uma na opção `Database` do menu de contexto da tela, do painel de opções ou do menu de contexto dos separadores Esquema SQL e Gerador de código, ou na pesquisa rápida. Todas alteram a mesma definição.

Estas opções determinam a sintaxe do Esquema SQL na exportação, o preenchimento automático do tipo de dados e os tipos em que se resolvem o código gerado e os esquemas importados.  
Decidem que opções de `Statements` e `Header` o separador [Esquema SQL](./schema-sql.md#options-panel) pode escrever. Uma opção que a base de dados não tenha permanece no painel de opções, esbatida, e o SQL recorre à mais próxima que esta tenha.  
Também decidem que ações ON DELETE e ON UPDATE escrevem o Esquema SQL e os destinos ORM do Gerador de código, e quais delas os menus das relações marcam como `not in <database>` — consulte [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update) e [Gerador de código](./code-generator.md#database).  
A importação de Esquema SQL mantém o tipo de dados de uma coluna, incluindo a lista de argumentos, quer o editor o liste quer não, como `TIMESTAMP WITH TIME ZONE`, `public.mood` ou `integer[]` — consulte [Tipos de dados](./file-import-export.md#data-types). O preenchimento automático do tipo de dados sugere apenas os tipos que a base de dados selecionada lista.

![Mudar a base de dados para PostgreSQL e, depois, escolher um tipo PostgreSQL no preenchimento automático](/img/demo-database.webp)

![Preenchimento automático do tipo de dados com correspondência aproximada, percorrido com as teclas de seta e aceite com Right, Tab ou Enter](/img/demo-data-type-autocomplete.webp)

## Barra de ferramentas da tela {#canvas-toolbar}

Uma pequena barra de ferramentas flutua sobre o meio do bordo inferior da tela e contém, da esquerda para a direita, as ferramentas que atuam sobre a própria tela e os comandos que lhe acrescentam elementos:

- A mão e o ponteiro. O ponteiro é a predefinição; a mão transforma qualquer arrasto num deslocamento da vista, tanto sobre tabelas como sobre espaço vazio. `Space` alterna entre os dois. Enquanto o desenho de um [`New Table Group`](./table-groups.md#drawing-a-group) está preparado, é o botão `New Table Group` que fica marcado em vez de qualquer um deles, e clicar em qualquer um, premir `Space` ou escolher uma notação de relação termina o desenho sem adicionar nenhum grupo.
- `New Table`, `New Memo` e `New Table Group`. O botão `New Table` adiciona uma tabela como `Alt + N`, e o botão `New Memo` adiciona uma nota como `Alt + M`. O botão `New Table Group` prepara o [desenho do grupo](./table-groups.md#drawing-a-group) como `Alt + G` e desativa a mão; um segundo clique, tal como um segundo `Alt + G`, termina o desenho sem adicionar nenhum grupo. O botão `New Memo` não aparece enquanto Opções de vista → `Memos` oculta as notas, nem o botão `New Table Group` enquanto Opções de vista → `Table Groups` oculta os grupos. Um editor `readonly` não mostra nenhum dos três.
- O zoom: `Zoom out`, o zoom atual em percentagem e `Zoom in`. Os dois botões alteram o zoom por passos, tal como os atalhos de zoom, e clicar na percentagem repõe-no em `100%`.
- As quatro notações de relação, as mesmas quatro com que se começa uma relação — consulte [Começar a editar](./editing-start.md). Escolher uma faz voltar ao ponteiro, já que uma relação se desenha clicando em duas tabelas.
- `Name View`, um botão com uma seta para baixo que indica a vista em vigor: `Physical Names`, `Logical Names` ou `Both Names`. Mantém a mesma largura seja qual for a vista que indica, pelo que uma mudança nunca desloca a barra de ferramentas. Um clique abre, por cima da barra de ferramentas, uma lista das três, com a vista em vigor marcada. Escolher uma muda para essa vista e fecha a lista; um segundo clique no botão, premir em qualquer outro ponto ou `Escape` fecha a lista sem mudar de vista. Um editor `readonly` também o mostra. O que cada vista desenha é explicado em [Vista de nomes](./logical-names.md#name-view), e se uma mudança é guardada, em [Mudar de vista](./logical-names.md#switching-the-view).
- O modo zen, `Alt + Z`, que retira tudo exceto a tela e esta barra de ferramentas. Premir `Alt + Z` outra vez, ou o botão, traz o resto de volta. Um explorador aberto é ocultado com o resto, sem ser fechado, e volta com ele. Continua a poder ser aberto durante o modo zen — consulte [Quando se afasta](./explorer.md#when-it-stands-aside).
- A bússola `Go to content`, que só se junta ao fim da barra de ferramentas enquanto nenhuma tabela, nota visível ou grupo de tabelas visível está no ecrã — consulte [Navegar na tela](#getting-around-the-canvas).

Cada botão com atalho indica-o na sua dica, como `New Table (Alt + N)` (Windows/Linux) ou `New Table (⌥ + N)` (Mac).  
A barra de ferramentas afasta-se enquanto a pré-visualização da disposição automática `Force`, o painel Propriedades da tabela, a viagem no tempo ou o visualizador de diferenças estão abertos, e volta assim que se fecham.

![Adicionar uma tabela e uma nota a partir da barra de ferramentas, preparar e cancelar New Table Group, deslocar a vista com a mão, alterar o zoom por passos e ativar e desativar o modo zen com ⌥ + Z](/img/demo-canvas-toolbar.webp)

## Ampliar e reduzir {#zoom-inout}

Faz zoom com `Ctrl + Wheel` (Windows/Linux) ou `⌘ + Wheel` (Mac). A roda do rato sozinha desloca a vista da tela.  
Um gesto de pinça no painel tátil também faz zoom, em torno do ponto onde é feito, tal como dois dedos num ecrã tátil, que também deslocam a vista ao moverem-se.  
Atalhos: `Ctrl + Plus` (Windows/Linux) ou `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) ou `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) ou `⌘ + 0` (Mac) volta diretamente a `100%`, mantendo o meio do ecrã no lugar.

Os botões `Zoom out` e `Zoom in` da [barra de ferramentas da tela](#canvas-toolbar) alteram o zoom por passos, como os atalhos `Minus` e `Plus`: cada clique altera-o em 4 pontos percentuais, mantendo o meio do ecrã no lugar. A percentagem entre eles mostra o zoom atual, e clicar nela volta diretamente a `100%`, como `Ctrl + 0` (Windows/Linux) ou `⌘ + 0` (Mac).

O zoom vai de `10%` a `150%`.  
A `70%` ou menos, as tabelas ficam reduzidas ao nome e ao bordo de cor, e a edição de células, os atalhos de células e copiar e colar deixam de funcionar até voltar a ampliar. O nome que uma tabela reduzida mostra segue a vista de nomes — consulte [Vista de nomes](./logical-names.md#name-view).

Os mesmos três atalhos também fazem zoom no separador Visualização, tanto no modo `Graph` como no `Flow`, cada modo dentro do seu próprio intervalo — consulte [Visualização](./visualization.md#toolbar).

![Reduzir com ⌘ + Wheel até as tabelas mostrarem apenas o nome e, depois, voltar por passos com ⌘ + Plus, ⌘ + Minus e ⌘ + 0](/img/demo-zoom.webp)

## Navegar na tela {#getting-around-the-canvas}

A tela não tem limites nem um tamanho a definir. As tabelas e as notas ficam onde as colocar, e tudo o que se segue descreve o diagrama, e não uma página fixa.

Arraste uma zona vazia da tela para deslocar a vista, ou mude para a ferramenta mão com `Space` e arraste em qualquer sítio, incluindo sobre uma tabela. A roda do rato também desloca a vista, e `Shift + Wheel` desloca-a na horizontal.  
O corpo de um [grupo de tabelas](./table-groups.md#selecting-groups), a área por baixo da barra de título, conta como tela vazia para o botão esquerdo: arrastá-lo desloca a vista, `Ctrl + drag` (Windows/Linux) ou `⌘ + drag` (Mac) desenha um retângulo de seleção, e um clique limpa a seleção.  
O deslocamento da vista não tem limites: a roda do rato, um arrasto e a ferramenta mão levam a vista tão longe quanto a mover, para lá das tabelas em qualquer lado.

Arraste com o botão do meio do rato (prima a roda) para deslocar a vista a partir de qualquer ponto da tela, tanto com o ponteiro como com a mão. Funciona mesmo quando o botão é premido sobre uma tabela, uma nota, uma célula, um ícone ou uma relação.  
Um arrasto com o botão do meio não seleciona, não move nem clica em nada, e mantém a seleção. Fecha um menu de contexto aberto e o seletor de cores, e o deslocamento e a colagem do próprio navegador com o botão do meio não se iniciam.  
Premir o botão do meio sobre as barras de deslocamento, o minimapa, a barra de ferramentas da tela ou um editor de célula ou de nota aberto não desloca a vista.

O minimapa no canto superior direito representa o diagrama com o espaço de um ecrã à sua volta em todos os lados, o alcance das barras de deslocamento, ajustado para fora a uma grelha grosseira, pelo que, quanto mais reduzir, mais pequeno fica o diagrama nele. Clique nele para mover a vista para esse ponto, ou arraste o retângulo da área visível para deslocar a vista. À medida que reduz, o retângulo da área visível cresce para cobrir mais do mapa.  
Desenha cada tabela com a cor da tabela, e cada grupo de tabelas visível como uma caixa com a cor do grupo por trás das suas tabelas.  
As barras de deslocamento ao longo dos bordos direito e inferior descrevem o mesmo percurso, que vai do diagrama logo fora de um dos lados do ecrã até logo fora do outro, pelo que é pelo menos um ecrã mais longo do que o diagrama tal como está desenhado, e ainda mais longo enquanto a vista estiver para lá dele. Fora do modo zen, as duas barras de deslocamento aparecem sempre que o documento contém uma tabela, uma nota visível ou um grupo de tabelas visível, mesmo quando tudo cabe no ecrã. Um documento sem nenhum destes, como um cujas únicas notas estão ocultas com Opções de vista → `Memos`, não mostra nenhuma delas, nem o minimapa.  
Arrastar o cursor de uma barra de deslocamento ou o retângulo da área visível do minimapa é o único deslocamento da vista que para: não vai além das tabelas logo fora do ecrã, ou além do ponto onde o arrasto começou, se este estava mais longe.

Se um deslocamento da vista não deixar nenhuma tabela, nota visível ou grupo de tabelas visível no ecrã, uma bússola `Go to content` junta-se ao fim da [barra de ferramentas da tela](#canvas-toolbar), com uma seta a apontar para o elemento mais próximo e a distância a que está. Clique nela para centrar esse elemento sem alterar o zoom.

![Deslocar a vista arrastando a tela vazia, com a roda do rato, com um arrasto com o botão do meio sobre uma tabela e a partir do minimapa e, depois, Shift + wheel para lá do conteúdo e seguir a bússola Go to content de volta](/img/demo-canvas-navigation.webp)

### Onde termina um salto {#where-a-jump-lands}

Todas as ações «ir para» que levam a algo na tela movem a vista segundo uma única regra: os resultados `#`, `@` e `:` da [pesquisa rápida](./quick-search.md#searching-the-diagram), as linhas do [explorador](./explorer.md#going-to-a-row) e as correspondências da sua pesquisa [Localizar e substituir](./find-and-replace.md#going-to-a-match), as linhas da lista do [visualizador de diferenças](#going-to-a-change), o [botão do cartão](./visualization.md#card-buttons) de ligação externa no Flow, uma verificação que indica uma tabela ou uma coluna na [folha Verificações](./dictionary.md#the-checks-sheet) do separador Dicionário e o destino de um [Importar e adicionar](./file-import-export.md#import-and-add). Cada uma dessas secções diz o que essa ação seleciona; esta diz para onde vai a vista.

Um salto nunca altera o zoom e faz no máximo um deslocamento. A partir de outro separador, muda primeiro para o separador ERD.  
Mede a tela tal como aparece: abaixo da barra de ferramentas superior, ou a altura toda no modo zen, e à direita de um explorador aberto, que estreita a tela em vez de a cobrir.

A horizontal e a vertical são avaliadas separadamente, e uma direção em que o destino já aparece bem fica exatamente como está:

- Um destino com comprimento não superior a metade da tela nessa direção fica onde está enquanto o seu meio estiver na metade central da tela, entre um quarto e três quartos da largura, ou da altura. Caso contrário, o seu meio é trazido para o meio da tela.
- Um destino mais longo que ainda caiba com `40px` de folga em cada extremidade fica onde está enquanto estiver totalmente à vista. Caso contrário, na horizontal, é centrado; na vertical, o seu topo é trazido para `40px` abaixo do topo da tela.
- Um destino ainda mais longo fica onde está enquanto estiver totalmente à vista ou, quando é mais longo do que a tela, enquanto a sua parte essencial, indicada abaixo, o estiver. Caso contrário, é centrado se couber, ou então posicionado tão perto do meio quanto permita manter as duas extremidades da sua parte essencial pelo menos `40px` dentro da tela; uma parte essencial demasiado longa para isso fica com o início `40px` para dentro.

Assim, uma tabela pequena perto do bordo esquerdo da tela, a meio da altura, só se move na horizontal.

O que um salto traz para a vista, e a parte essencial que tem de aparecer quando o todo não cabe:

- Uma tabela: a tabela inteira, pela faixa do nome no seu topo, ou pela sua célula de comentário no caso de uma correspondência no comentário da tabela, enquanto Opções de vista → `Table Comment` mostra os comentários. A `70%` ou menos, onde as tabelas ficam reduzidas ao nome, pelo nome no meio da caixa.
- Uma coluna: a sua linha, pela célula para onde o salto vai: o seu nome, o seu nome lógico no caso de uma correspondência no nome lógico ou de uma verificação sobre o nome lógico, a sua célula Domínio no caso de uma verificação sobre o seu domínio, ou o comentário em que está uma correspondência enquanto Opções de vista → `Column Comment` mostra os comentários. Quando a linha não desenha essa célula, o salto vai para a célula desenhada no lugar dela: o nome lógico em vez do nome na vista `Logical Names`, o nome em vez do nome lógico na vista `Physical Names`, e a célula do tipo em vez da célula Domínio enquanto Opções de vista → `Domain` está desativada, ou a linha como um todo enquanto a opção `DataType` também está desativada. A `70%` ou menos, uma coluna traz a sua tabela para a vista segundo a regra da tabela.
- Uma célula demasiado larga para aparecer por inteiro, como um comentário longo: pelo texto correspondente que contém. Um salto para a célula desenhada no lugar daquela em que está a correspondência, como o nome no caso de uma correspondência no nome lógico na vista `Physical Names`, não se orienta pelo texto.
- Uma relação: a caixa que abrange as suas duas tabelas, pela tabela filha.
- Um grupo de tabelas: a sua caixa, pela barra de título.
- Uma nota, ou o bloco colocado por um Importar e adicionar: o elemento inteiro.

Quando nenhuma das direções se moveria, não há deslocamento, pelo que ir duas vezes seguidas para o mesmo sítio não move nada da segunda vez. Um salto que desloca a tela regista o deslocamento no [histórico de anulação](./undo-redo.md#what-the-history-records) como qualquer outra mudança da posição da vista, e um que não move nada não deixa nada para anular. No caso de um Importar e adicionar, o deslocamento faz parte do mesmo passo que a adição. Uma linha da lista do visualizador de diferenças move apenas os lados só de leitura da vista, pelo que não regista nada.  
Nenhum salto inicia ou termina uma relação que esteja a ser desenhada. A bússola `Go to content` não é um salto: centra aquilo para que aponta.

## Visualizador de diferenças {#diff-viewer}

Pode comparar documentos guardados anteriormente com o documento atual.  
Escolha a opção `Diff Viewer` no menu de contexto da tela e selecione um documento `.json` que tenha exportado antes.

A vista abre-se sobre a tela: o que mudou à esquerda e, depois, o documento guardado e o atual lado a lado.  
O documento atual é comparado tal como está quando a vista se abre; as alterações feitas depois disso, incluindo as de um colaborador, não chegam à vista. Ambos os lados se abrem, e permanecem, na vista de nomes que está a ver, seja qual for a vista que cada ficheiro mantém — consulte [Além da tela](./logical-names.md#beyond-the-canvas). Um [explorador](./explorer.md#when-it-stands-aside) aberto fica oculto enquanto a vista está aberta, pelo que a vista ocupa toda a largura do editor.  
Cada lado desloca-se com a roda do rato, arrastando uma zona vazia ou o corpo de um grupo de tabelas, ou arrastando com o botão do meio em qualquer ponto dele, e faz zoom com `Ctrl + Wheel` (Windows/Linux), `⌘ + Wheel` (Mac) ou um gesto de pinça. A `70%` ou menos, as suas tabelas ficam reduzidas como na tela — consulte [Marcas nos dois lados](#marks-on-the-two-sides).  
Os dois lados são só de leitura, pelo que nada no seu documento é modificado. Cada um mantém a sua própria seleção, e um clique numa tabela aí seleciona-a apenas nesse lado.  
Feche a vista com o botão `Close` do aviso `Diff Viewer` com que se abre, ou com `Escape`.

![Abrir o visualizador de diferenças com um ficheiro .json guardado, clicar em linhas marcadas com A, M, D e R na sua árvore, filtrar por nome e fechá-lo](/img/demo-diff-viewer.webp)

### O que é comparado {#what-is-compared}

As tabelas, colunas, índices, chaves externas, notas e grupos de tabelas são todos comparados.  
Cada item é emparelhado primeiro pelo seu id, pelo que, face a uma versão anterior do mesmo ficheiro, que mantém os ids, uma tabela, coluna, índice ou grupo de tabelas com o nome alterado continua a ser um único item, indicado como tendo mudado de nome.  
O que resta emparelha um a um por aquilo que mantém: uma tabela ou um grupo de tabelas pelo nome, distinguindo maiúsculas de minúsculas; uma coluna ou um índice pela tabela e pelo nome; uma chave externa pelas suas duas tabelas e pelos seus pares de colunas; e uma nota pelo texto e, depois, pela posição. Um índice sem nome emparelha pelas suas colunas, pela ordem e direção destas e por ser ou não único, e um grupo de tabelas sem nome pelo maior número de tabelas em comum.  
Assim, face a um ficheiro de outra origem, como um diagrama reconstruído por importação de SQL, uma tabela com o nome alterado aparece como uma eliminada e uma adicionada.

O que conta como alteração:

- Uma tabela: o nome, o comentário, o grupo de tabelas, a posição e a cor.
- Uma coluna: o nome, o comentário, o tipo de dados, o valor predefinido, Incremento automático, chave primária, Único, Não nulo e a sua posição na tabela. Só as colunas fora da ordem que os dois documentos partilham contam como movidas, pelo que adicionar, remover ou mover uma coluna não marca as outras.
- Um índice: o nome, UNIQUE e as suas colunas, com a ordem e a direção destas.
- Uma chave externa: os pares de colunas, o tipo de relação e as ações ON DELETE e ON UPDATE.
- Uma nota: o texto, a posição, o tamanho e a cor.
- Um grupo de tabelas: o nome, as tabelas que contém, a cor, a posição e o tamanho.

Assim, uma tabela, nota ou grupo que apenas mudou de posição, de tamanho ou de cor conta como alterado. As posições e os tamanhos são comparados em píxeis inteiros, e a ordem de sobreposição e o ponto onde um conector encontra uma tabela nunca contam.  
Os nomes lógicos, os vínculos a domínios e as palavras, os termos e os domínios do separador [Dicionário](./dictionary.md) não são comparados, pelo que uma alteração apenas a estes não é listada nem marcada. Um tipo de dados que um domínio alterou conta, como uma alteração do tipo de dados da coluna.

### A árvore de alterações {#the-change-tree}

A lista à esquerda é desenhada como a [árvore do explorador](./explorer.md#the-tree) e contém apenas o que mudou: as pastas `Tables`, `Table Groups` e `Memos`, cada uma mostrada apenas quando contém uma linha, e, dentro de uma tabela, as suas próprias pastas `Columns`, `Indexes` e `Foreign Keys`. Uma chave externa é listada dentro da sua tabela filha, e uma tabela adicionada ou eliminada não lista nada dentro dela.  
Cada pasta mostra quantas linhas contém, e todas as pastas e tabelas começam expandidas.  
Uma linha de tabela ou de coluna é nomeada na vista de nomes em que os lados se abriram. Na vista `Both Names`, mostra o nome lógico com o nome a seguir, esbatido, e, numa linha eliminada, o nome esbatido é riscado com o resto. As tabelas e os grupos de tabelas são listados pelo nome, sem distinguir maiúsculas de minúsculas, seja qual for a vista. As notas, e as colunas, os índices e as chaves externas de uma tabela, mantêm a ordem do documento atual, com um item eliminado reposto onde estava. A linha de uma nota mostra a primeira linha da nota, e a linha de uma chave externa mostra as suas colunas filhas e, depois, `→` com a tabela pai e as suas colunas, como `user_id → users(id)`. Um nome em branco mostra `unnamed` em itálico.

Cada linha termina numa letra, e uma linha marcada com `A`, `D`, `M` ou `R` tem o nome na cor da letra:

- `A`, adicionado, a verde: só no documento atual.
- `D`, eliminado, a vermelho e riscado: só no documento guardado.
- `M`, modificado, a âmbar: nos dois, alterado.
- `R`, com o nome alterado, a azul: nos dois, com um novo nome. Uma mudança de nome prevalece sobre qualquer outra alteração, que a dica continua a listar.
- `~`, a âmbar, termina todas as pastas e uma tabela listada apenas pelo que mudou dentro dela; os seus nomes mantêm a cor habitual.

Passe o ponteiro sobre o nome de uma linha para ver a sua dica: o estado, `Added`, `Deleted`, `Modified`, `Renamed` ou `Changed inside`, e, depois, uma linha por alteração, como `Name: users → members` ou `NN: ✗ → ✓`. Um texto é citado pela primeira linha, cortada após 40 caracteres, e um valor vazio mostra `—`. A dica de um item adicionado ou eliminado é apenas o seu estado.

O campo `Filter by name`, acima da árvore, mantém as linhas cujo nome atual ou guardado, ou cujo nome lógico atual ou guardado, contém o que escrever, sem distinguir maiúsculas de minúsculas, em todas as vistas de nomes. Uma tabela cujo nome corresponde mantém todas as suas linhas, e uma cujo nome não corresponde fica apenas com as linhas que correspondem. Um filtro que não corresponde a nada deixa a árvore vazia.  
Quando os dois documentos não diferem em nada, a árvore mostra `No changes`.

Arraste o bordo direito da árvore para a alargar ou estreitar, de `200px` a `480px`, e faça duplo clique no bordo para a repor em `260px`. Cada diff abre-se com `260px`, e os dois lados partilham o resto da largura em partes iguais.  
O teclado percorre a árvore como percorre a do explorador — consulte [Teclas no explorador](./explorer.md#keys-in-the-explorer) — mas aqui `Escape`, na árvore ou no campo `Filter by name`, fecha a vista.

### Ir para uma alteração {#going-to-a-change}

Clique numa linha, ou prima `Enter` ou `Space` com o foco do teclado nela, para ir para o seu item em cada lado que o contém: um item adicionado só no lado atual, um eliminado só no lado guardado e tudo o que ambos contêm nos dois lados. Uma linha de pasta apenas recolhe ou expande, tal como a seta no início da linha de uma tabela.

- A linha de uma tabela, coluna ou índice seleciona apenas a tabela.
- A linha de uma chave externa traz para a vista as suas duas tabelas, ou a tabela filha quando as duas estão demasiado afastadas para aparecerem juntas, seleciona a tabela filha com as suas colunas de chave externa e ilumina o conector — consulte [Como ler um conector](./relationship-editing.md#reading-a-connector).
- A linha de uma nota seleciona a nota, e a linha de um grupo de tabelas seleciona o grupo. Uma nota ou um grupo que o documento de um lado oculta não leva a nenhum sítio nesse lado.

Cada lado move-se segundo a regra de [Onde termina um salto](#where-a-jump-lands), medida nesse lado, pelo que clicar outra vez na mesma linha não move nada.

### Marcas nos dois lados {#marks-on-the-two-sides}

Os dois lados dão cor ao texto, aos contornos e aos conectores, e não preenchem nada. O adicionado é verde e só aparece no lado atual, o eliminado é vermelho e só aparece no lado guardado, e o alterado, a âmbar, e o que mudou de nome, a azul, aparecem nos dois lados. Tudo o que não mudou é desenhado como habitualmente.

- Uma tabela ou um grupo de tabelas adicionado ou eliminado é contornado com a respetiva cor, e o seu nome fica com essa cor. Uma nota adicionada ou eliminada é contornada.
- Uma coluna adicionada ou eliminada numa tabela que os dois documentos contêm dá cor a toda a sua linha, e uma coluna que mudou de posição põe toda a sua linha a âmbar. Nada dentro de uma tabela adicionada ou eliminada é marcado individualmente.
- O texto de uma célula alterada fica a âmbar: o comentário de uma tabela, o comentário, o tipo de dados, o valor predefinido, Incremento automático, Único ou Não nulo de uma coluna, ou o texto de uma nota. Uma alteração da chave primária põe a âmbar o ícone de chave da coluna.
- Uma tabela, coluna ou grupo de tabelas com o nome alterado tem o nome a azul.
- Uma tabela, nota ou grupo de tabelas com uma alteração que não tem célula própria, como uma mudança de posição, um novo tamanho ou cor, ou uma mudança de grupo ou das tabelas de um grupo, é contornado a âmbar.
- Uma chave externa adicionada, eliminada ou alterada desenha o seu conector nessa cor. Passar o ponteiro sobre ele, ou a iluminação de uma linha, desenha-o antes na cor habitual de passagem do ponteiro.
- Uma alteração de índice não marca nada em nenhum dos lados; só aparece na árvore.

Cada lado segue as opções de vista do seu próprio documento. Uma alteração numa célula que esse lado não desenha aparece antes no nome. Uma alteração de coluna numa célula que uma opção de vista oculta, como `Unique` ou `Auto Increment`, ambas desativadas por predefinição, põe a âmbar o nome da coluna, tal como uma alteração da chave primária numa linha que não mostra ícone de chave. Uma alteração do comentário da tabela enquanto a opção `Table Comment` está desativada põe a âmbar o nome da tabela. O azul de uma mudança de nome prevalece sobre este âmbar. Uma nota ou um grupo de tabelas que o seu documento oculta é listado na árvore, mas não é desenhado nesse lado.

Na vista `Logical Names`, que não desenha nenhuma célula do nome, o azul de uma mudança de nome e o âmbar de uma alteração numa célula que o lado não desenha aparecem no nome lógico desenhado no lugar do nome. Uma alteração do tipo de dados põe a âmbar a célula do tipo em todas as vistas de nomes, mesmo quando a célula mostra o nome de um domínio. Nenhum dos lados desenha as cores que as verificações do dicionário dão aos nomes na tela — consulte [Marcas na tela](./dictionary.md#marks-on-the-canvas).

A `70%` ou menos, as tabelas reduzidas mantêm o contorno. O nome mantém o verde ou o vermelho de uma tabela adicionada ou eliminada, ou o azul de uma mudança de nome, e, caso contrário, fica com o âmbar de uma alteração de comentário. As alterações de colunas não são desenhadas até voltar a ampliar; a árvore continua a listá-las.
