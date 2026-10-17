---
sidebar_position: 10
description: Explorar o esquema como um Graph dirigido por força ou como um Flow de cartões de tabela — aplicar zoom e deslocar a área visível, iluminar as tabelas relacionadas a uma tabela e focar em algumas tabelas por vez.
---

# Visualização

Mostra o documento inteiro de relance, em um de dois modos:

- `Graph`, um grafo dirigido por força de todas as tabelas, suas colunas e os relacionamentos entre elas — consulte [Modo Graph](#graph-mode).
- `Flow`, cada tabela desenhada como um cartão e organizada ao longo de seus relacionamentos — consulte [Modo Flow](#flow-mode).

Abra-a pela aba `Visualization` na barra de ferramentas superior ou pela [pesquisa rápida](./quick-search.md), em `Tab`.  
Na aba ERD, `Alt + F` (Windows/Linux) ou `⌥ + F` (Mac) e o item `Focus on this table` do menu de contexto da tabela a abrem diretamente no `Flow`, com a exibição restrita às tabelas que você escolheu e às tabelas a um relacionamento de distância — consulte [Focar em tabelas](#focusing-on-tables).

Alterne entre os modos com os botões `Graph` e `Flow` na extremidade esquerda da [barra de ferramentas](#toolbar).  
Um editor recém-aberto começa no `Graph`. O modo escolhido se mantém enquanto o editor está aberto, mesmo quando você visita outras abas, mas não é salvo no documento.

## Barra de ferramentas {#toolbar}

Uma barra de ferramentas flutua sobre o centro da borda inferior da aba. Da esquerda para a direita:

- `Graph` e `Flow`, com o modo atual realçado.
- `Zoom out`, o zoom atual em porcentagem, como `100%`, e `Zoom in`. Cada pressionamento altera o zoom em 4 pontos percentuais, mantendo o centro da tela onde está. A porcentagem mostra o zoom do modo em que você está, e clicar nela retorna esse zoom a `100%`.
- `Fit`, que traz para a área visível tudo o que o modo mostra: todos os nós no `Graph`, todos os cartões no `Flow`.
- `Tidy Up`, somente no `Flow`, que organiza os cartões novamente — consulte [Como o Flow posiciona os cartões](#how-flow-is-placed).
- O menu de exibição de linhas, somente no `Flow`, cujo rótulo é a opção atual — consulte [Exibição de linhas](#row-display).
- `Show all`, somente no `Flow` e somente enquanto a exibição está restrita, que volta ao diagrama inteiro — consulte [Focar em tabelas](#focusing-on-tables).
- A bússola `Go to content`, que se junta ao fim da barra de ferramentas somente enquanto nenhum nó ou cartão está na tela. Ela mostra uma seta apontando para o nó ou cartão mais próximo e a que distância ele está, como `1.2k`. Clique nela para centralizar esse nó ou cartão sem alterar o zoom.

Os botões de zoom indicam seus atalhos nas dicas de ferramenta, por exemplo `Zoom in (Ctrl + Plus)` (Windows/Linux) ou `Zoom in (⌘ + Plus)` (Mac).  
`Ctrl + Plus` e `Ctrl + Minus` (Windows/Linux) ou `⌘ + Plus` e `⌘ + Minus` (Mac) alteram o zoom em etapas, como os botões, em qualquer um dos modos, e `Ctrl + 0` (Windows/Linux) ou `⌘ + 0` (Mac) volta diretamente a `100%`.  
Clicar na porcentagem faz o mesmo que `Ctrl + 0` (Windows/Linux) ou `⌘ + 0` (Mac), e a dica de ferramenta dela indica esse atalho. Os atalhos não fazem nada enquanto a pesquisa rápida está aberta.

## Modo Graph {#graph-mode}

Desenha o documento inteiro como um grafo dirigido por força, para que você veja de relance como as tabelas se relacionam entre si e quais ficam no centro de um domínio.

![Abertura do modo Graph, passagem do ponteiro sobre uma tabela para ver sua pré-visualização, arrasto de um nó e diminuição do zoom seguida de novo aumento](/img/demo-visualization.webp)

### Como ler o grafo {#reading-the-graph}

Cada tabela e cada coluna é um nó, e os dois tipos são desenhados em cores diferentes. Notas e [grupos de tabelas](./table-groups.md) não são desenhados.  
Cada nó de coluna está ligado à tabela a que pertence, e duas tabelas unidas por um relacionamento estão ligadas entre si.  
Tabelas unidas por mais de um relacionamento na mesma direção são ligadas uma única vez, e um relacionamento que começa e termina na mesma tabela não desenha nenhuma ligação.

Os nomes das tabelas aparecem no grafo à medida que você aumenta o zoom, surgindo gradualmente entre `50%` e `100%`, e um nome com mais de 15 caracteres é cortado. Os nós de coluna não têm rótulo em nenhum nível de zoom.

### Navegar pelo grafo {#getting-around-the-graph}

A roda do mouse aplica zoom em torno do que estiver sob o ponteiro, de `10%` a `400%`.  
Pinçar no trackpad aplica zoom da mesma forma, e dois dedos em uma tela sensível ao toque aplicam zoom em torno do ponto entre eles e deslocam a área visível conforme se movem.  
Arraste o fundo para deslocar a área visível, ou arraste com o botão do meio do mouse a partir de qualquer lugar, inclusive de um nó, como no [canvas ERD](./table-related-functions.md#getting-around-the-canvas). Um arrasto com o botão do meio só desloca a área visível: nunca puxa um nó.

Já os botões de zoom da [barra de ferramentas](#toolbar) e os atalhos de zoom mantêm fixo o centro da tela, dentro do mesmo intervalo, e `Fit` traz todos os nós para a área visível.

### Pré-visualização ao passar o ponteiro {#hover-preview}

Passe o ponteiro sobre um nó de tabela para pré-visualizar essa tabela, ao lado do cursor.  
Passar o ponteiro sobre um nó de coluna só desenha um anel ao redor dele; nenhuma pré-visualização se abre.

A pré-visualização mostra as mesmas colunas que o canvas ERD, na mesma ordem — consulte [Opções de exibição da tabela](./table-related-functions.md#table-view-options) e [Ajustar a ordem das colunas](./settings.md#adjusting-column-order).  
Com a opção de exibição `Alternate Key` ativada, cada coluna de uma [chave alternativa](./table-related-functions.md#alternate-keys) traz sua marca, como `AK1.1`, no fim da linha, e a pré-visualização se alarga para acomodá-la, como faz a tabela no canvas ERD.  
Ao contrário de uma tabela no canvas ERD, seu cabeçalho nunca assume a cor do [grupo](./table-groups.md#coloring-a-group) da tabela.  
Ela serve apenas para exibição e fica oculta enquanto você arrasta um nó ou desloca a área visível.

### Realçar a vizinhança {#highlighting-a-neighbourhood}

Passar o ponteiro sobre uma tabela também ilumina sua vizinhança: a própria tabela, as colunas dela, as tabelas às quais seus relacionamentos a unem em qualquer direção e as ligações entre elas.  
Todo o resto do grafo esmaece, de modo que aquilo a que a tabela está ligada se destaca sozinho.

### Mover nós {#moving-nodes}

Arraste um nó com o botão esquerdo do mouse para puxá-lo, junto com tudo o que está ligado a ele, para uma nova posição.  
O nó fica fixado sob o ponteiro enquanto você o segura, e o layout se reaquece ao redor dele.  
Ele volta a se estabilizar quando você solta — nada permanece fixado onde você o soltou.  
Pressionar ou arrastar com o botão direito sobre um nó não o puxa nem desloca a área visível.

### O grafo é um instantâneo {#the-graph-is-a-snapshot}

O grafo é construído a partir do documento tal como está no momento em que você abre esta aba, e é reconstruído do zero sempre que você volta a ela.  
Mudar do `Flow` para o `Graph` também o reconstrói, e toda reconstrução recomeça em `100%`.

## Modo Flow {#flow-mode}

Desenha cada tabela como um cartão e organiza os cartões ao longo de seus relacionamentos. Notas e [grupos de tabelas](./table-groups.md) não são desenhados.  
Não é o layout `Flow` do [layout automático](./table-related-functions.md#auto-layout), que move as tabelas na própria aba ERD.

Cada cartão é desenhado como uma tabela na aba ERD: a cor da tabela ao longo da borda esquerda, uma faixa de cabeçalho com um ícone de tabela e o nome da tabela e, em seguida, as linhas que sua [exibição de linhas](#row-display) determina. Ao contrário de uma tabela na aba ERD, um cartão também desenha um traço divisório entre suas linhas, e seu cabeçalho nunca assume a cor do [grupo](./table-groups.md#coloring-a-group) da tabela. Os cartões mantêm essa aparência em qualquer nível de zoom e nunca se reduzem ao nome, como as tabelas da aba ERD fazem em `70%` ou menos. Nada em um cartão pode ser editado.

Um conector é uma única curva suave de tabela a tabela, desenhada por baixo dos cartões, de modo que pode passar por trás de um deles. Um relacionamento de uma tabela com ela mesma se curva em torno do canto superior direito do cartão, como na aba ERD — consulte [Traçado dos conectores](./relationship-editing.md#connector-routing). Todos os conectores são desenhados com a mesma linha cinza contínua, seja o relacionamento identificador ou não, com as mesmas marcas nas extremidades que na aba ERD — consulte [Como ler um conector](./relationship-editing.md#reading-a-connector). O Flow desenha os conectores mesmo quando a [opção de exibição](./table-related-functions.md#table-view-options) `Relationship` está desativada. Ele nunca desenha os rótulos `D:` e `U:` das ações ON DELETE e ON UPDATE de um relacionamento nem mostra a dica de ferramenta que as descreve por extenso, seja qual for o valor da opção de exibição `Referential Actions`.

No diagrama inteiro, as tabelas que nenhum relacionamento une a outra tabela são reunidas em um único bloco, em vez de espalhadas entre as demais.

![Mudança para o Flow, passagem do ponteiro sobre orders para iluminá-la junto com suas vizinhas, fixação da iluminação, escolha de Keys only e, em seguida, aumento do zoom com ⌘ + Wheel e pressionamento de Fit](/img/demo-visualization-flow.webp)

### Exibição de linhas {#row-display}

O menu de exibição de linhas na [barra de ferramentas](#toolbar) define quanto de cada cartão é desenhado. Seu rótulo é a opção atual, e sua dica de ferramenta diz, por exemplo, `Row display: Name only`.  
O menu se abre acima da barra de ferramentas com uma marca de seleção ao lado da opção atual. Ele se fecha quando você escolhe uma opção, clica no rótulo de novo, clica em qualquer outro lugar do editor, pressiona `Escape` ou muda para o `Graph`.

| Exibição de linhas | O que cada cartão mostra |
| --- | --- |
| `Name only` | Somente o cabeçalho. |
| `Keys only` | Colunas de chave primária e de chave estrangeira, além de qualquer outra coluna em que um relacionamento termina. |
| `All fields` | Todas as colunas. |

As linhas seguem a ordem das colunas da tabela. Cada linha mostra o nome da coluna, precedido de um ícone de chave quando a coluna é chave primária, chave estrangeira ou ambas, e o tipo de dados à direita, que só aparece enquanto o cartão está [iluminado](#lighting-related-tables).  
Nenhuma outra célula nem marca de chave alternativa é desenhada, e nem [Opções de exibição da tabela](./table-related-functions.md#table-view-options) nem [Ajustar a ordem das colunas](./settings.md#adjusting-column-order), que ordena as células dentro de uma linha, se aplicam aos cartões.

Quando o Flow é aberto pela primeira vez, ele começa em `Name only`, ou em `Keys only` se ele foi aberto ao [focar em tabelas](#focusing-on-tables). Depois disso, a exibição de linhas só muda quando você escolhe outra, e ela se mantém quando você restringe ou amplia a exibição.  
Mudar a exibição de linhas redimensiona os cartões, por isso o Flow os organiza novamente e os ajusta à tela.

### Navegar pelo Flow {#getting-around-the-flow}

A roda do mouse desloca a área visível, e `Shift + Wheel` a desloca na horizontal. `Ctrl + Wheel` (Windows/Linux) ou `⌘ + Wheel` (Mac) aplica zoom, mantendo o centro da tela onde está.  
Pinçar no trackpad aplica zoom em torno do ponto em que você pinça, e dois dedos em uma tela sensível ao toque aplicam zoom em torno do ponto entre eles e deslocam a área visível conforme se movem.  
Arraste o fundo para deslocar a área visível, ou arraste com o botão do meio do mouse a partir de qualquer lugar, inclusive de um cartão. Um arrasto com o botão do meio só desloca a área visível e deixa a seleção como está. O deslocamento não tem limites, como no [canvas ERD](./table-related-functions.md#getting-around-the-canvas).  
O zoom vai de `10%` a `150%`. O Flow mantém um zoom e um deslocamento próprios, separados dos da aba ERD, e nenhum dos dois é salvo no documento.

Pressionar o fundo limpa a seleção, e `Ctrl + drag` (Windows/Linux) ou `⌘ + drag` (Mac) no fundo desenha um retângulo de seleção.  
O Flow não tem minimapa nem barras de rolagem. Quando um deslocamento não deixa nenhum cartão na tela, use a bússola `Go to content` da [barra de ferramentas](#toolbar).

### Iluminar as tabelas relacionadas {#lighting-related-tables}

Passe o ponteiro sobre um cartão para iluminá-lo, junto com as tabelas a um relacionamento de distância dele e os conectores que o unem a essas tabelas. Um conector entre duas dessas tabelas continua apagado.  
Um cartão iluminado ganha uma borda e um halo na cor de destaque, seus tipos de dados surgem gradualmente e as linhas dele em que um relacionamento termina ficam tingidas. Um conector iluminado assume a cor de destaque.  
Nada mais esmaece, ao contrário do que acontece no [Graph](#highlighting-a-neighbourhood), e nada fica iluminado enquanto nenhum cartão está sob o ponteiro ou fixado.

Clique em um cartão para fixar sua iluminação, de modo que ele continue iluminado quando o ponteiro se afastar. Clique no mesmo cartão de novo, ou clique no fundo, para liberá-lo; clicar em outro cartão move a fixação para ele. O cartão sob o ponteiro e o cartão fixado se iluminam juntos.  
Arrastar, `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac), deslocar a área visível e os [botões do cartão](#card-buttons) não fixam nem liberam um cartão.

Partículas percorrem cada conector iluminado, da ponta da tabela pai, onde está a chave primária, até a ponta da tabela filha. Quando mais de 60 conectores estão iluminados ao mesmo tempo, as partículas param e a iluminação permanece.

### Botões do cartão {#card-buttons}

Enquanto o ponteiro está sobre um cartão, dois botões de ícone, nenhum deles com dica de ferramenta, aparecem na extremidade direita de seu cabeçalho:

- O ícone de pontos de passagem, o mesmo que o botão `Flow` mostra, restringe o Flow a essa tabela e às tabelas a um relacionamento de distância — consulte [Focar em tabelas](#focusing-on-tables).
- O ícone de link externo muda para a aba ERD, seleciona somente essa tabela, a traz para a frente e coloca o foco na célula do nome dela, a menos que uma célula dessa tabela já tenha o foco. O canvas só rola até a tabela se ela ainda não estiver bem visível — consulte [Onde um salto termina](./table-related-functions.md#where-a-jump-lands). Ele nunca inicia nem conclui um relacionamento que esteja sendo desenhado.

Pressionar qualquer um dos botões afeta somente o próprio botão: ao contrário de pressionar outro ponto do cartão, isso não seleciona o cartão nem o traz para a frente. Por isso, o botão de pontos de passagem mantém a seleção que você tinha; o botão de link externo só seleciona a tabela como parte da mudança para a aba ERD. Somente um clique com o botão esquerdo aciona qualquer um dos botões.

### Mover cartões {#moving-cards}

Arraste um cartão com o botão esquerdo do mouse por qualquer parte dele, exceto os dois botões do cartão; arrastar com o botão direito não move nada.  
Pressionar um cartão o seleciona, `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac) o adiciona à seleção, e arrastar um cartão selecionado move todos os cartões selecionados. A seleção é a mesma que a aba ERD usa, então o que você seleciona aqui continua selecionado quando você volta.

Um cartão só se move no Flow: sua tabela permanece onde está na aba ERD.  
Um cartão movido permanece no lugar durante o deslocamento, o zoom e `Fit`. Ele volta para onde o layout o posicionou quando você sai da aba ou muda para o `Graph` e retorna, e quando `Show all` volta a um layout do diagrama inteiro que o Flow já tem. Um novo layout o posiciona de novo, levando em conta onde você o deixou — consulte [Como o Flow posiciona os cartões](#how-flow-is-placed).

### Focar em tabelas {#focusing-on-tables}

Na aba ERD, selecione uma ou mais tabelas e pressione `Alt + F` (Windows/Linux) ou `⌥ + F` (Mac), ou clique com o botão direito em uma tabela e escolha `Focus on this table`.  
A aba Visualização se abre no `Flow`, com a exibição restrita a essas tabelas e a todas as tabelas a um relacionamento de distância de qualquer uma delas, em qualquer direção. Só são desenhados os conectores entre as tabelas exibidas.

Quando a tabela em que você clica com o botão direito é uma de várias tabelas selecionadas, o item passa a ser `Focus on selected tables` e foca em toda a seleção. Clicar com o botão direito em uma tabela fora da seleção foca somente nessa tabela.  
`Alt + F` usa as tabelas selecionadas e deixa de fora as notas e os [grupos de tabelas](./table-groups.md). Sem nenhuma tabela selecionada, ele não faz nada, mesmo com um grupo selecionado: escolha antes `Select tables` no menu de contexto do grupo — consulte [Selecionar grupos](./table-groups.md#selecting-groups).  
O atalho é ignorado enquanto uma célula, uma nota ou o nome de um grupo está sendo editado, enquanto o teclado está no [explorador](./explorer.md#keys-in-the-explorer), ou enquanto a pesquisa rápida, o painel Propriedades da tabela, o visualizador de diferenças, a pré-visualização do layout automático, a viagem no tempo, a caixa de diálogo [`Export image`](./file-import-export.md#image) ou a [`Map Columns`](./relationship-editing.md#map-columns) está aberta.

Dentro do Flow, o [botão do cartão](#card-buttons) de pontos de passagem restringe a exibição da mesma forma, a essa única tabela. `Show all` na [barra de ferramentas](#toolbar) volta ao diagrama inteiro.  
Uma exibição restrita é organizada separadamente e ajustada à tela. Ela continua restrita quando você sai da aba ou muda para o `Graph` e retorna, e `Escape` não a amplia.

![Foco em orders com ⌥ + F, restrição a members com o botão de pontos de passagem do cartão dela e, em seguida, Show all](/img/demo-visualization-focus.webp)

### Como o Flow posiciona os cartões {#how-flow-is-placed}

Na primeira vez que o `Flow` é exibido, as tabelas que ele mostra são organizadas fora da thread principal e o resultado é ajustado à tela.  
O layout é mantido enquanto o editor está aberto. Se você sair da aba ou mudar para o `Graph` e voltar, o Flow o reutiliza, com o zoom e o deslocamento onde você os deixou.  
O Flow mantém um layout para o diagrama inteiro e outro para a exibição restrita, de modo que `Show all` volta ao layout do diagrama inteiro e o ajusta à tela sem calculá-lo de novo, desde que nada do que serviu de base para esse layout tenha mudado.

O Flow organiza os cartões novamente quando:

- Você pressiona `Tidy Up`. O resultado é ajustado à tela.
- Você muda a exibição de linhas ou restringe a exibição a outras tabelas. O resultado é ajustado à tela.
- Tabelas ou relacionamentos são adicionados ou removidos — na aba ERD enquanto você está fora, o que é detectado quando você volta, ou por um colaborador enquanto você está no Flow. O zoom e o deslocamento ficam onde estão.

Cada layout leva em conta onde os cartões estão no momento, por isso `Tidy Up` não restaura necessariamente uma disposição anterior.  
Uma alteração que só redimensiona um cartão, como renomear uma tabela ou adicionar uma coluna, não organiza os cartões novamente. Pressione `Tidy Up` se os cartões acabarem se sobrepondo.

Um layout que leva mais de 6 segundos mostra um aviso `Placing tables`, com um indicador de carregamento giratório e `Cancel`.  
`Cancel`, ou `Escape` a qualquer momento enquanto o layout está em execução, o descarta; `Tidy Up`, ou voltar ao `Flow`, o solicita de novo.  
Se um layout falhar — o host não executa nenhum worker compartilhado, o worker não consegue iniciar ou nenhum layout retorna em até 60 segundos — o Flow mostra um aviso `Could not place tables` com um sinal de alerta, e `Tidy Up` tenta de novo. Consulte [Web Workers](../../api/installation.md#web-workers).  
O Flow desenha somente as tabelas que seu último layout posicionou, tanto no diagrama inteiro quanto em uma exibição restrita, por isso, na primeira vez que ele é exibido, pode não haver nenhum cartão até que um layout seja bem-sucedido.  
Sempre que o Flow organiza os cartões novamente, como quando você restringe a exibição a outras tabelas, a disposição anterior permanece na tela até que o novo layout chegue, e continua ali se esse layout for cancelado ou falhar.

Quando o documento inteiro é substituído, por exemplo ao importar um arquivo, os layouts, o foco, a exibição de linhas, o zoom e o deslocamento do Flow são descartados, e na próxima vez que você abrir o Flow ele recomeça como na primeira vez: no diagrama inteiro, ou com a exibição restrita se você o abrir ao [focar em tabelas](#focusing-on-tables).

### O Flow nunca edita o documento {#flow-never-edits-the-document}

O Flow só lê o diagrama. Aplicar zoom, deslocar a área visível, mover cartões, `Tidy Up`, a exibição de linhas, as fixações e o foco não adicionam nada ao [histórico de desfazer](./undo-redo.md#what-the-history-records).  
Também não alteram nada no diagrama. Pressionar um cartão de fato traz sua tabela para a frente, assim como clicar em uma tabela na aba ERD, de modo que ela também fica na frente lá, mas a ordem de empilhamento não é salva — consulte [Mover várias tabelas](./table-related-functions.md#moving-multiple-tables). O `Graph` deixa o diagrama intacto da mesma forma.  
Pressionar um cartão nunca adiciona um relacionamento. Se você saiu da aba ERD enquanto desenhava um, pressionar um cartão escolhe a tabela dele como ponto de partida quando nenhuma foi escolhida ainda e, caso contrário, encerra o desenho.  
O [botão do cartão](#card-buttons) de link externo vai além, porque leva você para fora do Flow: quando a aba ERD precisa rolar até a tabela, essa rolagem é registrada como qualquer outra mudança de posição da área visível.

As edições dos colaboradores continuam chegando ao diagrama enquanto você está no Flow, e os cartões acompanham as tabelas e os relacionamentos que eles adicionam ou removem — consulte [Como o Flow posiciona os cartões](#how-flow-is-placed).  
Os contornos de seleção e de foco deles são desenhados nos cartões, mas os cursores e os retângulos de arrasto deles não — consulte [Edição colaborativa](../../api/advanced/collaborative-editing.md).

Os dois modos, inclusive o foco em tabelas, também funcionam em um editor `readonly`.
