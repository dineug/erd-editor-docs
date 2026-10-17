---
sidebar_position: 10
description: Explorar o esquema como um Graph dirigido por forças ou como um Flow de cartões de tabela — fazer zoom e deslocar a vista, iluminar as tabelas relacionadas com uma tabela e focar em algumas tabelas de cada vez.
---

# Visualização

Mostra todo o documento de relance, num de dois modos:

- `Graph`, um grafo dirigido por forças de todas as tabelas, das respetivas colunas e das relações entre elas — consulte [Modo Graph](#graph-mode).
- `Flow`, todas as tabelas desenhadas como cartões e dispostas ao longo das suas relações — consulte [Modo Flow](#flow-mode).

Abra-a a partir do separador `Visualization` da barra de ferramentas superior, ou a partir da [pesquisa rápida](./quick-search.md), na entrada `Tab`.  
No separador ERD, `Alt + F` (Windows/Linux) ou `⌥ + F` (Mac) e a entrada `Focus on this table` do menu de contexto da tabela abrem-na diretamente no modo `Flow`, com a vista restrita às tabelas que escolheu e às tabelas a uma relação de distância — consulte [Focar em tabelas](#focusing-on-tables).

Mude de modo com os botões `Graph` e `Flow` na extremidade esquerda da [barra de ferramentas](#toolbar).  
Um editor acabado de abrir começa no modo `Graph`. O modo que escolher mantém-se enquanto o editor estiver aberto, mesmo quando visita outros separadores, mas não é guardado no documento.

## Barra de ferramentas {#toolbar}

Uma barra de ferramentas flutua sobre o meio do bordo inferior do separador. Da esquerda para a direita:

- `Graph` e `Flow`, com o modo atual realçado.
- `Zoom out`, o zoom atual em percentagem, como `100%`, e `Zoom in`. Cada vez que se prime um deles, o zoom muda 4 pontos percentuais, mantendo o meio do ecrã no lugar. A percentagem mostra o zoom do modo em que se encontra, e clicar nela repõe esse zoom em `100%`.
- `Fit`, que coloca à vista tudo o que o modo mostra: todos os nós no modo `Graph`, todos os cartões no modo `Flow`.
- `Tidy Up`, apenas no modo `Flow`, que volta a dispor os cartões — consulte [Como o Flow posiciona os cartões](#how-flow-is-placed).
- O menu de apresentação das linhas, apenas no modo `Flow`, identificado pela opção atual — consulte [Apresentação das linhas](#row-display).
- `Show all`, apenas no modo `Flow` e apenas enquanto a vista está restrita, que volta ao diagrama completo — consulte [Focar em tabelas](#focusing-on-tables).
- A bússola `Go to content`, que só se junta ao fim da barra de ferramentas enquanto não há nenhum nó nem cartão no ecrã. Mostra uma seta que aponta para o nó ou cartão mais próximo e a distância a que este se encontra, como `1.2k`. Clique nela para centrar esse nó ou cartão sem alterar o zoom.

Os botões de zoom indicam os respetivos atalhos nas suas dicas, por exemplo `Zoom in (Ctrl + Plus)` (Windows/Linux) ou `Zoom in (⌘ + Plus)` (Mac).  
`Ctrl + Plus` e `Ctrl + Minus` (Windows/Linux) ou `⌘ + Plus` e `⌘ + Minus` (Mac) alteram o zoom passo a passo, como os botões, em qualquer um dos modos, e `Ctrl + 0` (Windows/Linux) ou `⌘ + 0` (Mac) volta diretamente a `100%`.  
Clicar na percentagem faz o mesmo que `Ctrl + 0` (Windows/Linux) ou `⌘ + 0` (Mac), e a sua dica indica esse atalho. Os atalhos não fazem nada enquanto a pesquisa rápida está aberta.

## Modo Graph {#graph-mode}

Desenha todo o documento como um grafo dirigido por forças, para que possa ver de relance como as tabelas se relacionam entre si e quais estão no centro de um domínio.

![Abrir o modo Graph, passar o ponteiro sobre uma tabela para ver a pré-visualização, arrastar um nó, reduzir e voltar a ampliar](/img/demo-visualization.webp)

### Como ler o grafo {#reading-the-graph}

Cada tabela e cada coluna é um nó, e os dois tipos são desenhados com cores diferentes. As notas e os [grupos de tabelas](./table-groups.md) não são desenhados.  
Cada nó de coluna está ligado à tabela a que pertence, e duas tabelas unidas por uma relação estão ligadas entre si.  
As tabelas unidas por mais de uma relação no mesmo sentido são ligadas apenas uma vez, e uma relação que começa e termina na mesma tabela não desenha nenhuma ligação.

Os nomes das tabelas aparecem no grafo à medida que amplia, surgindo gradualmente entre `50%` e `100%`, e um nome com mais de 15 caracteres é cortado. Os nós de coluna não têm etiqueta em nenhum nível de zoom.

### Navegar no grafo {#getting-around-the-graph}

A roda do rato faz zoom em torno do que estiver sob o ponteiro, de `10%` a `400%`.  
Um gesto de pinça no painel tátil faz zoom da mesma forma, e dois dedos num ecrã tátil fazem zoom em torno do ponto entre eles e deslocam a vista à medida que se movem.  
Arraste o fundo para deslocar a vista, ou arraste com o botão do meio do rato a partir de qualquer ponto, incluindo um nó, como na [tela ERD](./table-related-functions.md#getting-around-the-canvas). Um arrasto com o botão do meio apenas desloca a vista: nunca puxa um nó.

Os botões de zoom da [barra de ferramentas](#toolbar) e os atalhos de zoom, em vez disso, mantêm fixo o meio do ecrã, dentro do mesmo intervalo, e o botão `Fit` coloca todos os nós à vista.

### Pré-visualização ao passar o ponteiro {#hover-preview}

Passe o ponteiro sobre um nó de tabela para pré-visualizar essa tabela, junto ao cursor.  
Passar o ponteiro sobre um nó de coluna apenas desenha um círculo à sua volta; não se abre nenhuma pré-visualização.

A pré-visualização mostra as mesmas colunas que a tela ERD, pela mesma ordem — consulte [Opções de vista das tabelas](./table-related-functions.md#table-view-options) e [Ajustar a ordem das colunas](./settings.md#adjusting-column-order).  
Com a opção de vista `Alternate Key` ativada, cada coluna de uma [chave alternativa](./table-related-functions.md#alternate-keys) apresenta a sua marca, como `AK1.1`, no fim da respetiva linha, e a pré-visualização alarga-se para a acomodar, tal como a tabela na tela ERD.  
Ao contrário de uma tabela na tela ERD, o seu cabeçalho nunca assume a cor do [grupo](./table-groups.md#coloring-a-group) da tabela.  
Serve apenas para visualização e fica oculta enquanto arrasta um nó ou desloca a vista.

### Realçar a vizinhança {#highlighting-a-neighbourhood}

Passar o ponteiro sobre uma tabela também ilumina a sua vizinhança: a própria tabela, as suas próprias colunas, as tabelas a que as suas relações a unem em qualquer sentido e as ligações entre elas.  
Tudo o resto no grafo fica esbatido, para que se destaque apenas aquilo em que a tabela toca.

### Mover nós {#moving-nodes}

Arraste um nó com o botão esquerdo do rato para o puxar, juntamente com tudo o que lhe está ligado, para uma nova posição.  
O nó fica fixo sob o ponteiro enquanto o segurar, e a disposição reaquece à sua volta.  
Volta a estabilizar quando o soltar — nada fica fixo onde o largou.  
Premir ou arrastar com o botão direito sobre um nó não o puxa nem desloca a vista.

### O grafo é um instantâneo {#the-graph-is-a-snapshot}

O grafo é construído a partir do documento tal como está no momento em que abre este separador, e é reconstruído de raiz sempre que volta a ele.  
Mudar do modo `Flow` para o modo `Graph` também o reconstrói, e cada reconstrução recomeça em `100%`.

## Modo Flow {#flow-mode}

Desenha cada tabela como um cartão e dispõe os cartões ao longo das suas relações. As notas e os [grupos de tabelas](./table-groups.md) não são desenhados.  
Não é a disposição `Flow` da [disposição automática](./table-related-functions.md#auto-layout), que move as tabelas no próprio separador ERD.

Cada cartão é desenhado como uma tabela no separador ERD: a cor da tabela ao longo do bordo esquerdo, uma faixa de cabeçalho com um ícone de tabela e o nome da tabela e, depois, as linhas que a sua [apresentação das linhas](#row-display) pede. Ao contrário de uma tabela no separador ERD, um cartão também desenha um traço entre as suas linhas, e o seu cabeçalho nunca assume a cor do [grupo](./table-groups.md#coloring-a-group) da tabela. Os cartões mantêm esse aspeto em qualquer nível de zoom e nunca se reduzem ao nome, como acontece com as tabelas do separador ERD a `70%` ou menos. Nada num cartão pode ser editado.

Um conector é uma única curva suave de tabela para tabela, desenhada por baixo dos cartões, pelo que pode passar por trás de um deles. Uma relação de uma tabela consigo própria curva em torno do canto superior direito do cartão, como no separador ERD — consulte [Traçado dos conectores](./relationship-editing.md#connector-routing). Todos os conectores são desenhados com a mesma linha contínua cinzenta, quer a relação seja identificadora quer não, com as mesmas marcas nas extremidades que no separador ERD — consulte [Como ler um conector](./relationship-editing.md#reading-a-connector). O Flow desenha os conectores mesmo quando a [opção de vista](./table-related-functions.md#table-view-options) `Relationship` está desativada. Nunca desenha as etiquetas `D:` e `U:` das ações ON DELETE e ON UPDATE de uma relação nem mostra a dica que as descreve por extenso, independentemente do que indique a opção de vista `Referential Actions`.

No diagrama completo, as tabelas que nenhuma relação une a outra tabela são reunidas num único bloco, em vez de ficarem espalhadas entre as restantes.

![Mudar para o Flow, passar o ponteiro sobre orders para iluminar essa tabela e as vizinhas, fixar a iluminação, escolher Keys only e, depois, ampliar com ⌘ + Wheel e premir Fit](/img/demo-visualization-flow.webp)

### Apresentação das linhas {#row-display}

O menu de apresentação das linhas na [barra de ferramentas](#toolbar) define quanto de cada cartão é desenhado. A sua etiqueta é a opção atual, e a sua dica indica, por exemplo, `Row display: Name only`.  
O menu abre-se por cima da barra de ferramentas, com um visto junto à opção atual. Fecha-se quando escolhe uma opção, clica novamente na etiqueta, clica em qualquer outro ponto do editor, prime `Escape` ou muda para o modo `Graph`.

| Apresentação das linhas | O que cada cartão mostra |
| --- | --- |
| `Name only` | Apenas o cabeçalho. |
| `Keys only` | As colunas de chave primária e de chave externa, mais qualquer outra coluna em que termine uma relação. |
| `All fields` | Todas as colunas. |

As linhas são apresentadas pela ordem das colunas da tabela. Cada linha mostra o nome da coluna, precedido de um ícone de chave quando a coluna é chave primária, chave externa ou ambas, e o tipo de dados à direita, que só aparece enquanto o cartão está [iluminado](#lighting-related-tables).  
Nenhuma outra célula nem a marca de chave alternativa é desenhada, e nem [Opções de vista das tabelas](./table-related-functions.md#table-view-options) nem [Ajustar a ordem das colunas](./settings.md#adjusting-column-order), que ordena as células dentro de uma linha, se aplicam aos cartões.

Quando o Flow abre pela primeira vez, começa com a opção `Name only`, ou com a opção `Keys only` se tiver sido aberto ao [focar em tabelas](#focusing-on-tables). A partir daí, a apresentação das linhas só muda quando escolhe outra, e restringir ou alargar a vista mantém-na.  
Mudar a apresentação das linhas redimensiona os cartões, pelo que o Flow volta a dispô-los e ajusta-os ao ecrã.

### Navegar no Flow {#getting-around-the-flow}

A roda do rato desloca a vista, e `Shift + Wheel` desloca-a na horizontal. `Ctrl + Wheel` (Windows/Linux) ou `⌘ + Wheel` (Mac) faz zoom, mantendo o meio do ecrã no lugar.  
Um gesto de pinça no painel tátil faz zoom em torno do ponto onde se faz o gesto, e dois dedos num ecrã tátil fazem zoom em torno do ponto entre eles e deslocam a vista à medida que se movem.  
Arraste o fundo para deslocar a vista, ou arraste com o botão do meio do rato a partir de qualquer ponto, incluindo um cartão. Um arrasto com o botão do meio apenas desloca a vista e deixa a seleção como está. O deslocamento não tem limites, como na [tela ERD](./table-related-functions.md#getting-around-the-canvas).  
O zoom vai de `10%` a `150%`. O Flow mantém um zoom e um deslocamento próprios, separados dos do separador ERD, e nenhum deles é guardado no documento.

Premir o botão do rato sobre o fundo limpa a seleção, e `Ctrl + drag` (Windows/Linux) ou `⌘ + drag` (Mac) sobre o fundo desenha um retângulo de seleção.  
O Flow não tem minimapa nem barras de deslocamento. Quando um deslocamento não deixa nenhum cartão no ecrã, utilize a bússola `Go to content` na [barra de ferramentas](#toolbar).

### Iluminar as tabelas relacionadas {#lighting-related-tables}

Passe o ponteiro sobre um cartão para iluminar esse cartão, as tabelas a uma relação de distância dele e os conectores que o unem a essas tabelas. Um conector entre duas dessas tabelas continua sem iluminação.  
Um cartão iluminado ganha um contorno e um brilho na cor de destaque, os seus tipos de dados surgem gradualmente e as suas linhas em que termina uma relação ficam tingidas. Um conector iluminado passa a ter a cor de destaque.  
Nada mais fica esbatido, ao contrário do que acontece no [Graph](#highlighting-a-neighbourhood), e nada fica iluminado enquanto não houver nenhum cartão sob o ponteiro nem fixado.

Clique num cartão para fixar a sua iluminação, de modo que continue iluminado quando o ponteiro se afasta. Clique novamente no mesmo cartão, ou clique no fundo, para a soltar; clicar noutro cartão passa a fixação para esse cartão. O cartão sob o ponteiro e o cartão fixado iluminam-se em conjunto.  
Arrastar, `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac), deslocar a vista e os [botões dos cartões](#card-buttons) não fixam nem soltam um cartão.

Cada conector iluminado é percorrido por partículas, desde a extremidade da tabela pai, onde está a chave primária, até à extremidade da tabela filha. Quando mais de 60 conectores estão iluminados ao mesmo tempo, as partículas param e a iluminação mantém-se.

### Botões dos cartões {#card-buttons}

Enquanto o ponteiro está sobre um cartão, aparecem dois botões de ícone, nenhum deles com dica, na extremidade direita do seu cabeçalho:

- O ícone de pontos de passagem, o mesmo que o botão `Flow` mostra, restringe o Flow a essa tabela e às tabelas a uma relação de distância — consulte [Focar em tabelas](#focusing-on-tables).
- O ícone de ligação externa muda para o separador ERD, seleciona apenas essa tabela, trá-la para a frente e coloca o foco na célula do nome, a menos que uma célula dessa tabela já o tenha. A tela só se desloca até à tabela se esta ainda não estiver bem visível — consulte [Onde termina um salto](./table-related-functions.md#where-a-jump-lands). Nunca inicia nem termina uma relação que esteja a ser desenhada.

Premir qualquer um dos botões diz respeito apenas ao botão: ao contrário de premir noutro ponto do cartão, não seleciona o cartão nem o traz para a frente. Por isso, o botão de pontos de passagem mantém a seleção que tinha; o botão de ligação externa só seleciona a tabela como parte da mudança para o separador ERD. Ambos os botões só respondem a um clique com o botão esquerdo.

### Mover cartões {#moving-cards}

Arraste um cartão com o botão esquerdo do rato por qualquer parte dele, exceto os dois botões do cartão; arrastar com o botão direito não move nada.  
Premir o botão do rato sobre um cartão seleciona-o, `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac) adiciona-o à seleção, e arrastar um cartão selecionado move todos os cartões selecionados. A seleção é a mesma que o separador ERD utiliza, pelo que o que selecionar aqui continua selecionado quando voltar.

Um cartão só se move no Flow: a sua tabela fica onde está no separador ERD.  
Um cartão movido mantém-se no lugar ao deslocar a vista, ao fazer zoom e ao usar o botão `Fit`. Volta ao sítio onde a disposição o colocou quando sai do separador ou muda para o modo `Graph` e volta, e quando o botão `Show all` regressa a uma disposição do diagrama completo que o Flow já tem. Uma nova disposição volta a posicioná-lo, tendo em conta onde o deixou — consulte [Como o Flow posiciona os cartões](#how-flow-is-placed).

### Focar em tabelas {#focusing-on-tables}

No separador ERD, selecione uma ou mais tabelas e prima `Alt + F` (Windows/Linux) ou `⌥ + F` (Mac), ou clique com o botão direito numa tabela e escolha `Focus on this table`.  
O separador Visualização abre-se no modo `Flow`, com a vista restrita a essas tabelas e a todas as tabelas a uma relação de distância de qualquer uma delas, em qualquer sentido. Só são desenhados os conectores entre as tabelas que mostra.

Quando a tabela em que clica com o botão direito é uma de várias tabelas selecionadas, a entrada indica `Focus on selected tables` e foca toda a seleção. Clicar com o botão direito numa tabela fora da seleção foca apenas essa tabela.  
`Alt + F` usa as tabelas selecionadas e deixa de fora as notas e os [grupos de tabelas](./table-groups.md). Sem nenhuma tabela selecionada, não faz nada, mesmo com um grupo selecionado: escolha primeiro `Select tables` no menu de contexto do grupo — consulte [Selecionar grupos](./table-groups.md#selecting-groups).  
É ignorado enquanto uma célula, uma nota ou o nome de um grupo está a ser editado, enquanto o teclado está no [explorador](./explorer.md#keys-in-the-explorer), ou enquanto está aberta a pesquisa rápida, o painel Propriedades da tabela, o visualizador de diferenças, a pré-visualização da disposição automática, a viagem no tempo, a caixa de diálogo [`Export image`](./file-import-export.md#image) ou [`Map Columns`](./relationship-editing.md#map-columns).

Dentro do Flow, o [botão do cartão](#card-buttons) de pontos de passagem restringe a vista da mesma forma, a essa única tabela. O botão `Show all` da [barra de ferramentas](#toolbar) volta ao diagrama completo.  
Uma vista restrita é disposta separadamente e ajustada ao ecrã. Continua restrita quando sai do separador ou muda para o modo `Graph` e volta, e a tecla `Escape` não a alarga.

![Focar em orders com ⌥ + F, restringir a members com o botão de pontos de passagem do respetivo cartão e, depois, Show all](/img/demo-visualization-focus.webp)

### Como o Flow posiciona os cartões {#how-flow-is-placed}

Da primeira vez que o modo `Flow` é apresentado, as tabelas que mostra são dispostas fora da thread principal e o resultado é ajustado ao ecrã.  
A disposição é mantida enquanto o editor estiver aberto. Se sair do separador ou mudar para o modo `Graph` e voltar, o Flow reutiliza-a, com o zoom e o deslocamento como os deixou.  
O Flow mantém uma disposição para o diagrama completo e outra para a vista restrita, pelo que o botão `Show all` volta à disposição do diagrama completo e ajusta-a ao ecrã sem a calcular de novo, desde que nada daquilo a partir do qual essa disposição foi feita tenha mudado.

O Flow volta a dispor os cartões quando:

- Prime o botão `Tidy Up`. O resultado é ajustado ao ecrã.
- Muda a apresentação das linhas ou restringe a vista a outras tabelas. O resultado é ajustado ao ecrã.
- São adicionadas ou removidas tabelas ou relações — no separador ERD enquanto está ausente, o que é detetado quando volta, ou por um colaborador enquanto está no Flow. O zoom e o deslocamento ficam como estão.

Cada disposição tem em conta a posição atual dos cartões, pelo que o botão `Tidy Up` não repõe necessariamente uma organização anterior.  
Uma alteração que apenas redimensiona um cartão, como mudar o nome de uma tabela ou adicionar uma coluna, não volta a dispor os cartões. Prima o botão `Tidy Up` se os cartões acabarem sobrepostos.

Uma disposição que demore mais de 6 segundos mostra o aviso `Placing tables`, com um indicador de carregamento giratório e o botão `Cancel`.  
O botão `Cancel`, ou a tecla `Escape` em qualquer momento enquanto a disposição está em curso, descarta-a; o botão `Tidy Up`, ou voltar ao modo `Flow`, pede-a novamente.  
Se uma disposição falhar — o host não executa nenhum worker partilhado, o worker não consegue arrancar ou nenhuma disposição é devolvida no espaço de 60 segundos — o Flow mostra o aviso `Could not place tables` com um sinal de aviso, e o botão `Tidy Up` tenta novamente. Consulte [Web Workers](../../api/installation.md#web-workers).  
O Flow só desenha as tabelas que a sua última disposição posicionou, tanto no diagrama completo como numa vista restrita, pelo que da primeira vez que é apresentado pode não haver nenhum cartão até que uma disposição tenha êxito.  
Sempre que o Flow volta a dispor os cartões, como quando restringe a vista a outras tabelas, a organização anterior permanece no ecrã até a nova disposição chegar, e continua lá se essa disposição for cancelada ou falhar.

Quando todo o documento é substituído, por exemplo ao importar um ficheiro, as disposições, o foco, a apresentação das linhas, o zoom e o deslocamento do Flow são descartados, e da próxima vez que abrir o Flow, este recomeça como da primeira vez: no diagrama completo, ou com a vista restrita se o abrir ao [focar em tabelas](#focusing-on-tables).

### O Flow nunca edita o documento {#flow-never-edits-the-document}

O Flow apenas lê o diagrama. Fazer zoom, deslocar a vista, mover cartões, o botão `Tidy Up`, a apresentação das linhas, as fixações e o foco não acrescentam nada ao [histórico de anulação](./undo-redo.md#what-the-history-records).  
Também não alteram nada no diagrama. Premir o botão do rato sobre um cartão traz, de facto, a sua tabela para a frente, tal como clicar numa tabela no separador ERD, pelo que também fica à frente lá, mas a ordem de sobreposição não é guardada — consulte [Mover várias tabelas](./table-related-functions.md#moving-multiple-tables). O modo `Graph` deixa igualmente o diagrama intacto.  
Premir o botão do rato sobre um cartão nunca adiciona uma relação. Se saiu do separador ERD a meio de desenhar uma, premir um cartão escolhe a sua tabela como ponto de partida quando ainda não foi escolhida nenhuma e, caso contrário, termina o desenho.  
O [botão do cartão](#card-buttons) de ligação externa vai mais longe, porque o leva para fora do Flow: quando o separador ERD tem de se deslocar até à tabela, esse deslocamento é registado como qualquer outra alteração da posição da vista.

As edições dos colaboradores continuam a chegar ao diagrama enquanto está no Flow, e os cartões acompanham as tabelas e relações que estes adicionam ou removem — consulte [Como o Flow posiciona os cartões](#how-flow-is-placed).  
Os seus contornos de seleção e de foco são desenhados nos cartões, mas os seus cursores e retângulos de arrasto não — consulte [Edição colaborativa](../../api/advanced/collaborative-editing.md).

Ambos os modos, incluindo o foco em tabelas, também funcionam num editor `readonly`.
