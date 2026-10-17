---
sidebar_position: 9
description: Pesquisar nomes de tabelas, colunas, índices e grupos de tabelas, comentários e notas a partir do topo do explorador, percorrer as correspondências na árvore e no canvas e substituir uma correspondência ou todas elas.
---

# Localizar e substituir

Localiza texto em todo o diagrama, leva você a cada correspondência no canvas ERD e substitui uma correspondência ou todas elas.  
Pesquisa sete tipos de texto: nomes de tabelas, comentários de tabelas, nomes de colunas, comentários de colunas, notas, nomes de índices e nomes de grupos de tabelas — consulte [O que é pesquisado](#what-it-searches).

Fica no topo do [explorador](./explorer.md), o painel encaixado à esquerda do canvas ERD, entre a barra de título do explorador e a árvore dele. Não tem título próprio. De cima para baixo, contém:

- O campo Localizar, com as três [opções](#options) dentro dele, no final, e a seta `Toggle Replace` antes dele.
- A linha `Replace`, recolhida de início — consulte [Substituir](#replacing).
- O contador, depois as setas para cima e para baixo que percorrem as correspondências, e o botão de três pontos `Search In`.
- Os [tipos de texto](#what-it-searches), que `Search In` expande.

Enquanto o campo Localizar contém texto, a árvore do explorador mostra as correspondências — consulte [Os resultados](#the-results).  
A pesquisa mantém sua altura total em um canvas baixo, e a árvore abaixo dela ocupa o espaço restante e rola.

![Abertura de Localizar e substituir no explorador com ⌘ + F, navegação pelas seis correspondências de member e, depois, com Preserve Case ativado, substituição de todas as seis por user (⌘ + Enter)](/img/demo-find-and-replace.webp)

## Abrir e fechar {#opening-and-closing}

`Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) e `Toggle Explorer` na [pesquisa rápida](./quick-search.md) ou no menu de contexto do canvas abrem o explorador já na pesquisa. O cursor de texto vai para o campo Localizar com o texto dele selecionado, e o termo de pesquisa é procurado novamente, sem nenhuma correspondência atual.  
O botão `Explorer` da barra de ferramentas só abre ou fecha o painel. Ele não coloca o cursor de texto no campo Localizar e deixa o termo de pesquisa e a correspondência atual como estavam.  
Quando o atalho apenas devolve o cursor de texto a um explorador já visível, como acontece enquanto a pesquisa rápida ou uma das cinco caixas de diálogo de [Caixas de diálogo ao lado dele](./explorer.md#dialogs-beside-it) está aberta, a correspondência atual continua sendo a atual.

Fechar o explorador, o que o atalho e os dois itens `Toggle Explorer` fazem enquanto ele está aberto e as caixas de diálogo que eles fecham são abordados em [Abrir e fechar](./explorer.md#opening-and-closing), na página do explorador.  
[Quando ele fica oculto](./explorer.md#when-it-stands-aside) aborda como outra aba e o modo zen o ocultam, e como o visualizador de diferenças, a viagem no tempo e a pré-visualização do layout automático o ocultam e impedem que ele seja aberto. [Ao lado do canvas](./explorer.md#beside-the-canvas) aborda um editor estreito demais para ele.

Reabrir mantém o último termo de pesquisa, junto com o texto de substituição, as [opções](#options), os [tipos de texto](#what-it-searches) que estavam ativados e se a linha `Replace` e os tipos de texto estavam expandidos.  
Eles são mantidos enquanto o editor permanece aberto e não são salvos no documento. Um editor recém-aberto começa com todas as opções desativadas, a linha `Replace` e os tipos de texto recolhidos e só os quatro tipos de nome ativados — consulte [O que é pesquisado](#what-it-searches).

## A barra de localização do navegador {#the-browsers-find-bar}

Enquanto o editor tem o foco do teclado, `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) pertence a ele em todas as abas, inclusive nos próprios campos de texto dele, então a barra de localização do navegador não abre.  
O atalho segue para o navegador ou o host enquanto o visualizador de diferenças, a viagem no tempo ou a pré-visualização do layout automático está aberta, e enquanto o foco está fora do editor.

- Aplicativo web e Google Drive: a barra de localização do navegador só abre nesses dois casos.
- VS Code: a extensão deixa desativado o próprio widget de localização do VS Code no ERD Editor, então o atalho nunca abre um ali.
- Obsidian: o atalho chega ao editor sempre que a aba do diagrama está ativa, no lugar do comando `Search current file` do Obsidian.
- IDE da JetBrains: se o mapa de teclas da IDE reservar `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) para si, abra a pesquisa por `Toggle Explorer` na pesquisa rápida ou no menu de contexto do canvas, ou abra o explorador com o botão `Explorer` da barra de ferramentas e clique no campo Localizar.

Uma página que incorpora o editor pode reatribuir ou remover o atalho — consulte [Alterar o atalho](#changing-the-shortcut).

## O que é pesquisado {#what-it-searches}

Sete botões escolhem os tipos de texto pesquisados, nesta ordem: `Table names`, `Table comments`, `Column names`, `Column comments`, `Memos`, `Index names` e `Table group names`.  
De início, eles ficam recolhidos. O botão `Search In`, no final da linha do contador, os expande abaixo dessa linha e os recolhe de novo, e fica realçado enquanto eles aparecem.  
Um botão de tipo realçado está ativado. Clique em um para ativá-lo ou desativá-lo, e a pesquisa é executada de novo. Com os sete desativados, nada é encontrado.

Na primeira abertura, a pesquisa usa os quatro tipos de nome, `Table names`, `Column names`, `Index names` e `Table group names`, então uma renomeação não alcança comentários e notas, a menos que você os ative.  
Os nomes de índices são os nomes dos índices na aba `Indexes` do painel [Propriedades da tabela](./table-related-functions.md#indexes), e não as chaves `PK_` e `UQ_` listadas acima deles.

Nada mais é pesquisado: nem tipos de dados, nem valores padrão, nem as colunas de um índice, nem o nome do banco de dados, nem o [Esquema SQL](./schema-sql.md) com seus scripts `Before tables` e `After tables`, nem o código gerado.  
Um comentário oculto por uma [opção de exibição da tabela](./table-related-functions.md#table-view-options) ainda é pesquisado. As notas ocultas com View Option → `Memos` e os [grupos de tabelas](./table-groups.md#hiding-groups) ocultos com View Option → `Table Groups` não são, mesmo com o botão deles ativado, então `Replace All` nunca reescreve uma nota nem renomeia um grupo que você não consegue ver.

## Opções {#options}

Três botões de alternância dentro do campo Localizar, no final dele, mudam a forma como o termo de pesquisa corresponde ao texto. Os nomes deles aparecem nas dicas de ferramenta, e eles ficam realçados enquanto estão ativados. Os três começam desativados, e mudar um deles refaz a pesquisa.

- `Match Case`: com ele desativado, a correspondência não diferencia maiúsculas de minúsculas.
- `Match Whole Word`: uma correspondência só conta onde não emenda em uma palavra de nenhum dos lados. Letras, dígitos e marcas de qualquer sistema de escrita contam como caracteres de palavra, assim como o sublinhado. Por isso, `user` corresponde em `user id` e `user.id`, mas não dentro de `users`, `user_id` ou `superuser`. Uma extremidade do termo de pesquisa que não seja ela própria um caractere de palavra, como o ponto em `.id`, não precisa de limite ali.
- `Use Regular Expression`: o termo de pesquisa é uma expressão regular do JavaScript, sempre no modo Unicode, então `\p{L}` funciona. `^` e `$` correspondem ao início e ao fim de cada linha de um comentário ou de uma nota com várias linhas, e `.` não atravessa uma quebra de linha. Escapes frequentemente digitados em nomes, como `\_` e `\-`, são aceitos.

Uma expressão regular que não pode ser analisada, como `user(`, não encontra nada: o contador diz `Invalid regular expression` em vermelho, e o campo Localizar fica contornado em vermelho.  
`Match Case` e `Match Whole Word` também se aplicam a uma expressão regular. Uma correspondência de comprimento zero, como `^` sozinho, nunca é listada.

O texto simples é pesquisado enquanto você digita. Uma expressão regular é pesquisada quando a digitação pausa, ou imediatamente quando você pressiona `Enter`, um botão de navegação, `Replace` ou `Replace All`, ou escolhe uma linha que contém uma correspondência.  
A pesquisa não tem limite de tempo, então uma expressão regular que faz muito retrocesso pode deixar o editor sem resposta até terminar.

Um quarto botão de alternância, `Preserve Case`, fica dentro do campo `Replace`, no final dele, então só aparece enquanto a linha `Replace` está expandida. Ele começa desativado. Não muda nada do que é encontrado, só a forma como `Replace` e `Replace All` escrevem a substituição — consulte [Substituir](#replacing). Ativá-lo ou desativá-lo não pesquisa nada, e a correspondência atual continua sendo a atual.

## Os resultados {#the-results}

O contador, no início da linha abaixo dos campos, diz onde você está. Ele fica vazio enquanto o campo Localizar está vazio.

| Contador | Quando |
| --- | --- |
| `No results` | Nada corresponde. |
| `12 matches` | Antes de você ir para uma delas; `1 match` para uma só. |
| `3 of 12` | A terceira correspondência é a atual. |
| `Invalid regular expression` | A expressão regular não pode ser analisada. |
| `Replaced 12 matches` | `Replace All` alterou essa quantidade de correspondências; `Replaced 1 match` para uma só. |
| `No changes` | `Replace All` não alterou nada. |
| `No more matches` | Uma sequência de `Replace` voltou ao ponto onde começou — consulte [Substituir](#replacing). |

`Replaced …`, `No changes` e `No more matches` dão lugar ao contador na próxima pesquisa ou navegação, inclusive na pesquisa que uma edição ou um desfazer inicia.

Enquanto o campo Localizar contém texto, a [árvore](./explorer.md#the-tree) do explorador mostra os resultados em vez do diagrama inteiro: só as linhas que contêm uma correspondência e as linhas acima delas. Quando nada corresponde, ou a expressão regular não pode ser analisada, ela fica vazia. Apagar o termo de pesquisa traz de volta a árvore inteira, com as linhas recolhidas como estavam antes.

- `Tables`, `Table Groups` e `Memos` só aparecem quando contêm uma correspondência, e o contador de cada pasta é o número de linhas logo abaixo dela nos resultados.
- Sob `Tables` vêm as tabelas que contêm uma correspondência, ordenadas por nome. Sob cada tabela vêm uma linha para cada correspondência no comentário dela, depois uma pasta `Columns` com as colunas que contêm uma correspondência, na ordem das colunas, cada uma com uma linha para cada correspondência no comentário dela, e depois uma pasta `Indexes` com os índices cujo nome corresponde. Não há pasta `Foreign Keys`.
- Sob `Table Groups` vêm os grupos cujo nome corresponde, ordenados por nome, sem suas tabelas. Uma tabela encontrada aparece sob `Tables`.
- Sob `Memos` vêm as notas que contêm uma correspondência, na ordem do documento, cada uma exibida pela primeira linha do texto e com uma linha para cada correspondência que contém.

Uma correspondência em um nome é realçada na própria linha desse nome, então um nome que contém o termo de pesquisa duas vezes é uma única linha com dois realces.  
Uma correspondência em um comentário ou em uma nota tem uma linha própria: um balão de fala para um comentário de tabela ou de coluna, ou um bilhete adesivo para uma nota, e depois um trecho do texto com a correspondência realçada. Um texto longo é cortado com `…`, e as quebras de linha aparecem como espaços. Passe o ponteiro sobre a linha para ver o texto inteiro.  
Todas as outras linhas aparecem como fora de uma pesquisa: uma coluna mostra seu tipo de dados, um índice mostra suas colunas e um nome em branco aparece como `unnamed`.

Toda linha com linhas abaixo dela aparece expandida quando uma pesquisa começa. Uma linha que você recolhe, ou que `Collapse All` recolhe, continua recolhida até que uma correspondência abaixo dela se torne a atual, ou até que o termo de pesquisa, `Match Case`, `Match Whole Word`, `Use Regular Expression` ou um tipo de texto mude, ou que a pesquisa seja aberta de novo com o atalho ou com um item `Toggle Explorer`.  
A linha da correspondência atual é realçada e rolada até ficar visível. A árvore lista todas as correspondências, não importa quantas sejam.  
As correspondências são percorridas na ordem da árvore: tabela por tabela, o nome da tabela, o comentário dela, o nome e o comentário de cada uma de suas colunas na ordem das colunas e os nomes de seus índices; depois, os nomes dos grupos de tabelas; depois, as notas.

Os resultados acompanham o documento enquanto o explorador está visível. Quando as edições pausam, qualquer alteração nos textos pesquisados refaz a pesquisa, e a correspondência atual continua sendo a atual se ainda existir. Isso inclui a edição de um nome, de um comentário ou do texto de uma nota, a adição ou a remoção de uma tabela, coluna, índice, nota ou grupo de tabelas, a movimentação de uma coluna e a ocultação ou a exibição das notas ou dos grupos de tabelas com o menu Opções de exibição, o que tira as correspondências deles da árvore ou as traz de volta. Uma edição no canvas, um desfazer ou refazer, uma importação e uma edição feita por um colaborador ou por um agente de codificação contam todos. Selecionar, mover tabelas, notas ou grupos no canvas, rolar, aplicar zoom e passar o ponteiro não contam.  
As edições feitas enquanto o explorador está fechado ou fora de vista são pesquisadas assim que ele volta a aparecer.

## Ir para uma correspondência {#going-to-a-match}

`Enter` no campo Localizar vai para a próxima correspondência, e `Shift + Enter`, para a anterior. Os botões de seta para cima e para baixo depois do contador fazem o mesmo; as dicas de ferramenta deles dizem `Previous Match (Shift+Enter)` e `Next Match (Enter)`, e eles ficam desabilitados enquanto não há correspondência.  
A navegação dá a volta nas duas extremidades. Nenhuma correspondência é a atual até você navegar pela primeira vez, então o primeiro `Enter` vai para a primeira correspondência, e o primeiro `Shift + Enter`, para a última.

Um clique em uma linha dos resultados, ou `Enter` ou `Space` com o teclado nela, faz uma destas coisas:

- Uma linha cujo próprio nome contém uma correspondência vai para a primeira correspondência desse nome.
- Uma linha que mostra um trecho de um comentário ou de uma nota vai para essa correspondência.
- Qualquer outra linha, como uma tabela cujo nome não corresponde ou a própria linha de uma nota, vai para aquilo que a linha representa e deixa a correspondência atual como está — consulte [Ir para uma linha](./explorer.md#going-to-a-row).
- Uma pasta é recolhida ou expandida.

Sempre que uma correspondência se torna a atual, a árvore expande as linhas recolhidas acima dela e move a linha do teclado para lá, então as teclas de seta na árvore continuam a partir dela.

Ir para uma correspondência fecha o painel Propriedades da tabela, se estiver aberto, e depois:

- Para o nome ou o comentário de uma tabela, ou o nome ou o comentário de uma coluna, seleciona apenas a tabela, a traz para a frente e põe a célula em foco na célula que contém a correspondência. Uma correspondência em um comentário oculto por uma [opção de exibição da tabela](./table-related-functions.md#table-view-options) põe a célula em foco no nome ao lado dele, em vez disso.
- Para o nome de um índice, seleciona apenas a tabela do índice e a traz para a frente, com a célula em foco no nome da tabela, a menos que a célula em foco já esteja nessa tabela. Os nomes de índices não são desenhados no canvas.
- Para o nome de um grupo de tabelas, seleciona apenas o grupo e o traz para a frente com suas tabelas.
- Para uma nota, seleciona apenas a nota e a traz para a frente.

O canvas só rola quando o destino ainda não aparece bem, e o zoom nunca muda — consulte [Onde um salto termina](./table-related-functions.md#where-a-jump-lands).

Depois de `Enter` no campo Localizar, o cursor de texto fica ali, e depois que uma linha é escolhida, o teclado fica na árvore, então o que você digita em seguida não chega à tabela selecionada.  
Ir para uma correspondência nunca inicia nem conclui um relacionamento que está sendo desenhado.

## Substituir {#replacing}

A linha `Replace` fica recolhida de início. A seta antes do campo Localizar, cuja dica de ferramenta diz `Toggle Replace`, a expande e a recolhe. Recolhê-la mantém o texto de substituição.  
A linha contém o campo `Replace`, com o botão de alternância `Preserve Case` dentro dele, no final, e dois botões, cujas dicas de ferramenta dizem `Replace (Enter)` e `Replace All`. Os dois botões ficam desabilitados enquanto não há correspondência.

`Replace` é executado com `Enter` no campo Substituir, com ou sem `Shift`, ou pelo botão dele:

- Sem correspondência atual, o primeiro pressionamento só vai para a próxima correspondência, então você vê o que ele mudaria antes que algo mude.
- Com uma correspondência atual, substitui essa única ocorrência, deixando qualquer outra ocorrência no mesmo texto, e segue para a próxima correspondência depois do texto que escreveu. O que ele escreveu é ignorado mesmo quando contém o termo de pesquisa: substituir `user` por `super_user` não para depois dentro de `super_user`.
- Uma correspondência que a substituição reescreveria exatamente como estava é deixada como está, e o pressionamento só segue para a próxima correspondência.
- A substituição e a rolagem até a próxima correspondência são uma única etapa de desfazer.

Uma sequência de pressionamentos de `Replace` para quando volta ao ponto onde começou. O contador diz `No more matches`, nenhuma correspondência é a atual, e os pressionamentos seguintes não substituem nada.  
Por isso, `Customer` substituído por `Big Customer` é substituído uma vez, em vez de crescer para `Big Big Customer`.  
Ir para uma correspondência, alterar o termo de pesquisa, `Match Case`, `Match Whole Word`, `Use Regular Expression` ou um tipo de texto, abrir a pesquisa com o atalho ou com um item `Toggle Explorer`, ou `Replace All` inicia uma nova sequência, assim como um desfazer ou qualquer outra edição que altere o texto em que a sequência começou. Alterar o texto de substituição ou `Preserve Case` não inicia, e o atalho também não, quando apenas devolve o cursor de texto a um explorador já visível.  
Enquanto uma sequência dura, uma tabela ou um grupo de tabelas que ela renomeia mantém seu lugar na árvore e na ordem das correspondências, então um item renomeado que passaria a ficar mais adiante na ordenação não é encontrado de novo. A próxima sequência volta a ordenar a árvore por nome, e a linha renomeada vai para seu novo lugar.

`Replace All` é executado com `Ctrl + Enter` (Windows/Linux) ou `⌘ + Enter` (Mac) no campo Substituir, ou pelo botão dele:

- Substitui todas as correspondências nos tipos de texto ativados e não mexe nos outros tipos. Com os tipos padrão, renomeia tabelas, colunas, índices e grupos de tabelas, e os comentários e as notas ficam intactos.
- Tudo o que ele altera é uma única etapa de desfazer — consulte [Um gesto, uma etapa](./undo-redo.md#one-gesture-one-step).
- O contador diz `Replaced N matches`, contando só as ocorrências cujo texto realmente mudou. Quando nenhuma mudou, diz `No changes` e nada é registrado no histórico, como ao substituir a expressão regular `(user)` por `$1`.
- Em seguida, a pesquisa é refeita sem correspondência atual, de modo que os resultados podem listar correspondências que o novo texto contém.

Ambos leem cada texto como ele está no momento em que você pressiona, e não como a última pesquisa o encontrou.

Como o texto de substituição é usado:

- Sem `Use Regular Expression`, `$` não tem significado especial, e o texto de substituição é usado como foi digitado, exceto pelas maiúsculas e minúsculas que `Preserve Case` aplica a ele.
- Com `Use Regular Expression`, de `$1` a `$99`, `$<name>`, `$&`, `` $` ``, `$'` e `$$` são expandidos como no `String.prototype.replace` do JavaScript.
- Sem `Preserve Case`, as maiúsculas e minúsculas do texto correspondente não são transferidas: com `Match Case` desativado, substituir `user` por `member` transforma `Users` em `members`.
- Com `Preserve Case`, cada substituição recebe as maiúsculas e minúsculas do texto que substitui, depois que `$1` e os demais são expandidos, então a mesma substituição transforma `Users` em `Members`:
  - Uma correspondência toda em maiúsculas recebe a substituição toda em maiúsculas, e uma correspondência toda em minúsculas a recebe toda em minúsculas: `USER` com `account` dá `ACCOUNT`, e `user` com `Account` dá `account`.
  - Qualquer outra correspondência dá ao primeiro caractere da substituição a mesma forma, maiúscula ou minúscula, do primeiro caractere da correspondência e deixa o resto como foi digitado: `UserId` com `accountKey` dá `AccountKey`, e `uSER` com `AccountKey` dá `accountKey`. Quando o primeiro caractere da correspondência não tem forma maiúscula nem minúscula, a substituição fica como foi digitada: `_Ab` com `xyz` dá `xyz`.
  - Quando tanto a correspondência quanto a substituição contêm `-`, ou ambas contêm `_`, e esse separador as divide no mesmo número de partes, cada parte recebe as maiúsculas e minúsculas da parte correspondente: `USER_id` com `account_key` dá `ACCOUNT_key`, e `User-Name` com `account-key` dá `Account-Key`. Quando tanto `-` quanto `_` as dividem dessa forma, as maiúsculas e minúsculas são aplicadas ao todo, como uma única parte.
  - Uma correspondência sem letras que tenham maiúscula e minúscula, como `123`, deixa a substituição como foi digitada.
  - Uma correspondência reescrita como estava não conta: com `Match Case` desativado, substituir `customer` por `Customer` reescreve `customer`, `Customer` e `CUSTOMER` como estavam, e nenhuma delas é contada.
- Um campo Substituir vazio exclui a correspondência.

Uma substituição é uma edição comum, igual a digitar você mesmo o novo nome da tabela, o comentário, o nome da coluna ou o texto da nota, renomear o índice no painel Propriedades da tabela ou renomear o grupo de tabelas.  
Ela é registrada no histórico e chega aos colaboradores e a um agente de codificação como qualquer outra edição.

## Teclas nos campos de pesquisa {#keys-in-the-search-fields}

- No campo Localizar, `Enter` vai para a próxima correspondência, e `Shift + Enter`, para a anterior.
- No campo Substituir, `Enter` substitui, com ou sem `Shift`, e `Ctrl + Enter` (Windows/Linux) ou `⌘ + Enter` (Mac) substitui tudo.
- Enquanto um método de entrada está compondo texto em qualquer um dos campos, `Enter` pertence à composição e não navega nem substitui.

O que `Escape`, os atalhos do editor que continuam funcionando e todas as outras teclas fazem nesses campos é abordado em [Teclas no explorador](./explorer.md#keys-in-the-explorer).

## Editores somente leitura {#read-only-editors}

Em um editor [`readonly`](../../api/erd-editor-element.md#readonly), a pesquisa só localiza. Não há a seta `Toggle Replace` nem a linha `Replace`, portanto não há campo Substituir, `Preserve Case`, `Replace` nem `Replace All`.  
O campo Localizar, suas três opções, os tipos de texto, o contador, os resultados e a ida a uma correspondência funcionam todos. O explorador ao redor da pesquisa funciona como em qualquer outro editor — consulte [Editores somente leitura](./explorer.md#read-only-editors).

No VS Code, uma revisão de um diagrama, como uma revisão do Git ou uma entrada do Local History, abre como texto JSON. Reaberta como diagrama com `Reopen Editor With...`, ela é somente leitura e recebe esta pesquisa que só localiza.

## Alterar o atalho {#changing-the-shortcut}

Uma página que incorpora o editor pode reatribuir ou remover o atalho `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac), pelo nome `findReplace`, com o método [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap).  
Sem o atalho, a tecla fica a cargo da página em todas as abas. O botão `Explorer` da barra de ferramentas ainda abre e fecha o explorador, e `Toggle Explorer` na pesquisa rápida e no menu de contexto do canvas ainda abre a pesquisa ou fecha o explorador, mas nenhum deles mostra um atalho, então a dica de ferramenta do botão diz apenas `Explorer`. A linha `Toggle Explorer` da aba [Atalhos](./settings.md#shortcuts) das Configurações também não mostra nenhuma tecla. Quando o atalho é reatribuído, todos mostram a nova tecla.
