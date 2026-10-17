---
sidebar_position: 3
description: Como o servidor MCP decide entre editar em direto num editor (VS Code, Obsidian ou um IDE da JetBrains) e editar o ficheiro no disco, e o que acontece em cada caso ao guardar, ao anular e com um editor fechado.
---

# Em direto e headless

Em cada chamada, o servidor procura um editor que detenha o documento, através dos ficheiros de bloqueio que os editores mantêm em `~/.erd-editor/ide/`.
Cada janela do VS Code e cada janela de cofre do Obsidian com o ERD Editor mantém um, e um IDE da JetBrains mantém um para todo o IDE, que lista todos os projetos nele abertos.
Um editor remove o seu ficheiro de bloqueio quando fecha.
O que o servidor encontra decide para onde vai a edição.

| O que encontra | O que faz uma edição |
| --- | --- |
| Um editor cuja área de trabalho, cofre ou projeto aberto contém o documento, ou que o tem aberto | **Em direto.** Abre o documento no ERD Editor, se necessário, junta-se à sessão de edição e aplica lá a alteração. As edições aparecem de imediato e são guardadas tal como o editor guarda as edições feitas por si — consulte [Guardar](#saving). |
| Nenhum editor | **Headless.** Carrega o ficheiro, aplica a alteração e substitui o ficheiro. `erd_save` não tem nada para fazer. |
| Um editor com o hub desativado | **Recusado.** As leituras continuam a funcionar, a partir do disco. Uma alteração escrita no ficheiro enquanto um editor o tem aberto poderia ser substituída da próxima vez que esse editor guardar, por isso o servidor não escreve nada. |
| Um editor com o hub ativado, mas que utiliza um protocolo que não é o do servidor: com o servidor `1.0.0`, uma extensão do VS Code `3.x`, um plugin do Obsidian `0.x` ou um plugin da JetBrains `0.9.0` ou `0.10.0`; com um servidor anterior à `1.0.0`, a extensão `4.0.0` ou posterior, ou um plugin `1.0.0` ou posterior | **Recusado**, incluindo as leituras, com `protocolMismatch`. A mensagem indica o lado a atualizar: a extensão ou o plugin, ou o servidor — consulte [Atualizar](./installation.md#updating). |
| No Windows, um editor que detém o documento sob outro caminho para o mesmo ficheiro: o agente indicou-o através de uma partilha de rede ou de uma unidade mapeada deste computador, como `\\localhost\C$\…`, e o editor detém-no pelo caminho da unidade, ou o contrário | **Recusado**, incluindo as leituras, com `invalidPath`. A mensagem indica o caminho pelo qual o editor detém o documento; volte a chamar com esse caminho. |
| No Windows, um editor a que o Windows não deixa o agente aceder: um iniciado como administrador quando o agente não o foi, ou qualquer editor quando o agente é executado numa sandbox | **Recusado**, incluindo as leituras, com `hubUnreachable` e uma mensagem que diz porquê. Execute o editor e o agente com os mesmos direitos, por exemplo, iniciando de novo o editor sem direitos de administrador. |

O resultado de uma edição indica o modo em que foi executada, `live` ou `headless`, e uma edição recusada diz porquê.
A procura repete-se em cada chamada, pelo que a chamada seguinte acompanha a abertura ou o fecho de um editor.

Quando mais do que um editor detém o documento, um que o tem aberto prevalece sobre um que apenas serve uma pasta que o contém e, entre os que servem uma pasta, prevalece aquele cuja pasta é a mais profunda.
Um empate, como dois editores que o têm ambos aberto, resolve-se a favor daquele cujo ficheiro de bloqueio mudou por último.
Assim, um documento num cofre do Obsidian dentro de uma pasta da área de trabalho do VS Code vai para o Obsidian, a menos que o VS Code o tenha aberto e o Obsidian não.

As chamadas sobre um mesmo documento são executadas uma de cada vez, pela ordem em que chegaram ao servidor. As chamadas sobre documentos diferentes são executadas em paralelo.

## Em direto {#live}

O agente junta-se ao editor como mais um colaborador.
As edições do agente chegam de imediato a todos os editores abertos no documento, e o seu foco é mostrado na tabela e na célula que está a editar, como o de um colaborador — consulte [focusTracker](../api/advanced/collaborative-editing.md#focustracker).

Uma leitura nunca abre um editor. Uma edição abre o documento no ERD Editor quando ainda não está aberto, sem ficar com o foco do teclado.

### Guardar {#saving}

Cada editor guarda as edições do agente da mesma forma que guarda as edições feitas por si.

No VS Code, as edições do agente marcam o separador como tendo alterações por guardar, tal como as edições feitas por si, e só chegam ao disco quando o documento é guardado.
`erd_save` guarda-o através do VS Code, tal como faz o comando de guardar do próprio VS Code. Em alternativa, pode guardar com `Ctrl + S` (Windows/Linux) ou `⌘ + S` (Mac).
Se fechar o editor com edições do agente por guardar, este pergunta se as quer guardar, tal como acontece com qualquer outra alteração por guardar.

O Obsidian guarda as edições do agente cerca de dois segundos depois de a edição parar, e fechar o separador guarda-as sem perguntar.
Um IDE da JetBrains escreve-as uma fração de segundo depois de a edição parar, e fechar o separador escreve o que ainda está pendente; o separador nunca aparece como modificado.
Em ambos, `erd_save` escreve-as de imediato.

`erd_save` começa por esperar até dois segundos para que o editor tenha todas as edições que o agente fez.
É recusado com `notSaved` quando o editor não o conseguiu confirmar ou não escreveu o ficheiro: o VS Code mantém um separador por guardar quando o ficheiro mudou no disco, e um IDE da JetBrains não o conseguiu escrever, por exemplo, enquanto uma caixa de diálogo estava aberta ou quando não é possível escrever no ficheiro.

No VS Code e num IDE da JetBrains, `erd_save` num documento sem nada por guardar é bem-sucedido e deixa o ficheiro como está.
Isso acontece assim que todas as edições estão guardadas, o que um IDE da JetBrains faz sozinho, e continua a acontecer enquanto todas as alterações posteriores forem das que um [bloqueio](../guide/guides/settings.md#lock) mantém fora do ficheiro, como deslocar a vista ou fazer zoom com a definição `Viewport` bloqueada, ou mudar de separador com a definição `Canvas Type` bloqueada. Todos os bloqueios estão ativados por predefinição.
Um ficheiro em que um IDE da JetBrains não consegue escrever é recusado mesmo nesse caso.

Quando o editor fecha o documento depois da última edição do agente, a chamada seguinte do agente traz uma indicação de que essas edições só estão no ficheiro se tiverem sido guardadas antes de o editor fechar.

### Anular {#undo}

`erd_undo` reverte a última edição que o agente fez, nunca uma feita por si, e `erd_redo` volta a aplicá-la.
A [anulação](../guide/guides/undo-redo.md) do próprio editor funciona ao contrário: reverte as suas edições e nunca as do agente, uma vez que as alterações que chegam de outro editor não são registadas no seu histórico.

Algumas edições não criam entrada de anulação no editor: `erd_set_database` e `erd_set_database_name`, entre as [ferramentas de definições](./tools.md#settings), e `erd_resize_memo`.
Também não a cria um `erd_move_table_group` que mova o grupo menos de 20 píxeis no total, somando o movimento na horizontal e na vertical, embora o grupo fique onde foi movido.
Uma chamada que não altera nada também não cria nenhuma: `erd_set_column_primary_key`, `erd_set_column_unique`, `erd_set_column_not_null`, `erd_set_column_auto_increment`, `erd_set_index_unique` ou `erd_set_index_column_order` a definir um valor que o documento já tem; `erd_add_index_column` com uma coluna que já está no índice; `erd_set_table_group` com tabelas que já estão nesse grupo (ou já em nenhum, com `groupId` `null`); `erd_move_table_group` para o ponto onde o grupo já está; `erd_resize_table_group` para o retângulo que o grupo já tem; `erd_sort_tables` num documento sem tabelas; ou uma importação com `mode` `append` que não traz nenhuma tabela (no caso de `erd_import_json`, nenhuma tabela e nenhuma nota).
`erd_undo` ignora-as e indica-as pelo nome no seu resultado.
Outras edições, como `erd_change_relationship_type`, `erd_change_relationship_on_delete`, `erd_change_relationship_on_update`, `erd_change_table_group_name`, `erd_change_table_group_color` e `erd_set_ddl_script`, criam uma entrada mesmo quando definem um valor que o documento já tem.

O histórico de anulação do agente termina, com uma indicação no resultado, quando:

- O agente volta a juntar-se ao documento, por exemplo, depois de o editor ter desligado o agente do documento.
- O editor termina, ou fecha o documento e deixa de o servir, e o agente continua a editar o ficheiro no disco.
- Um editor assume o controlo de um documento que o agente estava a editar no disco.

O servidor também fecha um documento sobre o qual o agente não fez nenhuma chamada durante 30 minutos, e o histórico de anulação desaparece com ele, sem indicação.

### Quando o editor desaparece {#when-the-editor-goes-away}

Enquanto um editor detém um documento, o servidor nunca recorre ao ficheiro por iniciativa própria.
Se a ligação cair, volta a ligar-se.
Só quando o editor terminou, ou fechou o documento e já não lista o documento nem uma pasta que o contenha, é que o servidor edita o ficheiro, e indica-o no resultado.
Isso acontece quando fecha um diagrama que está fora de todas as pastas que o editor serve (no VS Code, um aberto a partir de fora da área de trabalho), quando desativa o plugin ERD Editor no Obsidian e quando fecha, num IDE da JetBrains, o projeto que contém o documento ou desativa aí o plugin.
Um diagrama fechado dentro de uma pasta que o editor serve fica com o editor, e a edição seguinte do agente volta a abri-lo.

Um editor que continua em execução, mas cujo ficheiro de bloqueio desapareceu e cuja ligação foi fechada sem que este tenha fechado o documento, recusa a edição seguinte com `hubGone`.
A mensagem diz o que liberta o documento: no VS Code, recarregue essa janela, ou feche-a para permitir que o agente edite o ficheiro diretamente; no Obsidian, volte a ativar o plugin ERD Editor, ou feche essa janela; num IDE da JetBrains, volte a ativar o plugin, ou saia do IDE.

Em vez disso, uma leitura vai ao ficheiro no disco, com uma indicação de que faltam as edições ainda não guardadas no editor, em dois casos: quando o editor que detém o documento tem o hub desativado e no caso `hubGone` acima.
Uma leitura que não se consegue ligar ao hub de um editor é recusada com `hubUnreachable`, tal como uma edição.

## Headless {#headless}

Sem nenhum editor a servir o documento, cada edição carrega o ficheiro, aplica a alteração e volta a escrever o ficheiro.
A escrita vai para um ficheiro temporário ao lado do documento, com o nome `.<name>.<id>.tmp`, que depois o substitui, pelo que o documento nunca fica escrito a meio, exceto no Windows, no caso da escrita no próprio ficheiro, descrito abaixo.

Antes desse último passo, o servidor verifica se o ficheiro mudou no disco durante a chamada.
Se tiver mudado, nada é escrito, o ficheiro é carregado novamente e a chamada é recusada com `conflict`. O agente volta a chamar.
Um ficheiro que mudou entre duas chamadas é simplesmente carregado de novo, e o histórico de anulação do agente anterior a isso é descartado.

Um ficheiro só de leitura fica como está, e a edição é recusada com `readonly`: um ficheiro sem permissão de escrita para o seu proprietário, ou com o atributo só de leitura no Windows, como um ficheiro do Perforce ou do TFVC sem check-out.
Permita a escrita no ficheiro e depois volte a chamar. As leituras continuam a funcionar.

Se um editor começar a servir o documento enquanto o agente o edita no disco, só essa edição é recusada com `hubAppeared` e nada é escrito. A chamada seguinte edita através do editor.

No Windows, aplicam-se mais duas regras:

- Um documento com permissões próprias, diferentes das da sua pasta, é escrito no próprio ficheiro em vez de ser substituído, para que as mantenha, e o ficheiro temporário é removido a seguir. Um programa que leia o documento durante essa escrita pode encontrar texto que não é possível analisar.
- Um ficheiro que outro programa tem aberto não pode ser substituído, por isso o servidor tenta novamente durante um máximo de dois segundos. Cada tentativa começa por procurar de novo um editor, e um editor que entretanto começou a servir o documento recusa a escrita com `hubAppeared`, ou com `blocked` quando tem o hub desativado. Se o ficheiro ainda estiver aberto ao fim de dois segundos, nada é escrito, o ficheiro é carregado novamente e a chamada falha com uma mensagem que cita o erro do sistema.

## Recusado {#refused}

Uma janela do VS Code mantém o seu ficheiro de bloqueio mesmo quando o hub está desativado: quando a definição `dineug.erd-editor.agentHub.enabled` está desativada, quando a área de trabalho não é de confiança ou quando o hub não conseguiu ficar à escuta.
Uma janela de cofre do Obsidian mantém o seu ficheiro de bloqueio com o hub desativado quando a definição Coding agents está desativada e quando o hub não conseguiu ficar à escuta.
Um IDE da JetBrains mantém o seu ficheiro de bloqueio com o hub desativado quando a definição Coding agents está desativada, quando o hub não conseguiu ficar à escuta e enquanto o IDE está a terminar.

Uma edição de um documento destes é recusada com `blocked`, porque o editor aberto poderia substituir, da próxima vez que guardar, uma alteração escrita no ficheiro.
As leituras continuam a funcionar, a partir do ficheiro no disco.

Para permitir que o agente edite, volte a ativar o hub, tal como a mensagem indica para esse editor: no VS Code, confie na área de trabalho e ative a definição, ou recarregue a janela; no Obsidian, ative a definição Coding agents, ou recarregue o Obsidian; num IDE da JetBrains, ative a definição Coding agents, ou reinicie o IDE se esta já estiver ativada.

Um IDE da JetBrains também se recusa, com `hubDisabled`, a alterar um documento detido apenas por projetos em que não confia.
Os agentes continuam a poder ler um documento destes, e `erd_list_documents` lista-o como `readonly`. Confie no projeto e depois volte a chamar.

Um editor que não mantém nenhum ficheiro de bloqueio não protege nada, e o agente edita o ficheiro no disco mesmo enquanto o diagrama está aí aberto.
É o caso do Obsidian ou de um IDE da JetBrains instalado como Flatpak no Linux, de um IDE da JetBrains sem JCEF e de um IDE da JetBrains cujo hub não pôde ser iniciado — consulte [Configurar o Obsidian](./installation.md#set-up-obsidian) e [Configurar um IDE da JetBrains](./installation.md#set-up-a-jetbrains-ide).
Uma extensão do VS Code anterior à `3.0.0` e um plugin da JetBrains anterior à `0.9.0` também não mantêm nenhum, pois não têm hub.

## Documentos {#documents}

Um documento é indicado por `path`, absoluto ou relativo ao diretório de trabalho do servidor.

- Os documentos novos são `.erd.json`. `erd_open_document` com `create` cria o ficheiro, acrescentando `.erd.json` a um nome sem extensão. Tal como um diagrama novo no editor, o documento novo tem todos os [bloqueios](../guide/guides/settings.md#lock) ativados, pelo que deslocar a vista, fazer zoom, mudar de separador ou escolher outra linguagem do Gerador de código, outro formato do nome ou outro tipo de delimitador num editor nunca altera o ficheiro. Nenhuma ferramenta ativa ou desativa um bloqueio isolado: isso faz-se no separador Definições do editor. `erd_import_json` no modo `replace` substitui-os todos pelos do documento que carrega — consulte [Importação](./tools.md#import).
- Os ficheiros `.erd`, `.vuerd` e `.vuerd.json` existentes também abrem. Um caminho com qualquer outra extensão é recusado com `invalidPath`.
- No Windows, um caminho que contém um nome que o Windows não guarda tal como está escrito é recusado com `invalidPath` antes de o documento ser lido ou escrito, incluindo as leituras: um nome com dois pontos ou outro carácter que o Windows recusa, como `orders:v2.erd`; um nome de dispositivo como `NUL.erd` ou `CON.erd`, independentemente das maiúsculas e minúsculas; ou um nome que termina num ponto ou num espaço. Mude-lhe o nome, por exemplo, com `-` em vez de `:`.
- Um ficheiro que não é um documento que o editor consiga ler, como um que ficou com marcadores de conflito de fusão, é recusado com `invalidDocument` e fica como está. Nunca é carregado como um diagrama vazio e depois escrito de novo.

O agente altera um documento apenas através das ferramentas e é instruído a nunca escrever ele próprio no ficheiro.

`erd_list_documents` lista os documentos com `path`, `open`, `active`, `dirty` e `readonly`.
Pergunta ao editor que serve o diretório de trabalho, escolhido como para um documento, e lista os diagramas nele abertos e, a seguir, os ficheiros ERD que serve: os das pastas da área de trabalho de uma janela do VS Code, de um cofre do Obsidian ou de todos os projetos abertos num IDE da JetBrains.
Caso contrário, lista os ficheiros ERD dentro do diretório de trabalho, onde um ficheiro só de leitura é marcado como `readonly` e, no Windows, um nome que o Windows não guarda tal como está escrito fica de fora.
