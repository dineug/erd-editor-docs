---
sidebar_position: 3
description: Como o servidor MCP decide entre editar ao vivo em um editor (VS Code, Obsidian ou uma IDE da JetBrains) e editar o arquivo em disco, e o que o salvamento, o desfazer e um editor fechado fazem em cada caso.
---

# Ao vivo e headless

A cada chamada, o servidor procura um editor que mantenha o documento, por meio dos arquivos de bloqueio que os editores guardam em `~/.erd-editor/ide/`.
Cada janela do VS Code e cada janela de cofre do Obsidian com o ERD Editor mantém um, e uma IDE da JetBrains mantém um para a IDE inteira, listando todos os projetos abertos nela.
Um editor remove seu arquivo de bloqueio quando é fechado.
O que o servidor encontra decide para onde vai a edição.

| O que ele encontra | O que uma edição faz |
| --- | --- |
| Um editor cujo espaço de trabalho, cofre ou projeto aberto contém o documento, ou que o tem aberto | **Ao vivo.** Abre o documento no ERD Editor, se necessário, entra na sessão de edição e aplica a alteração ali. As edições aparecem imediatamente e são salvas como o editor salva as suas — consulte [Salvamento](#saving). |
| Nenhum editor | **Headless.** Carrega o arquivo, aplica a alteração e substitui o arquivo antes de responder, então o resultado diz `saved: true` e `erd_save` não tem nada a fazer. |
| Um editor com o hub desativado | **Recusado.** As leituras continuam funcionando, a partir do disco. Uma alteração gravada no arquivo sob um editor aberto poderia ser sobrescrita pelo próximo salvamento dele, por isso o servidor não grava nada. |
| Um editor cujo hub está ativado, mas usa um protocolo diferente do usado pelo servidor: com o servidor `1.0.0` ou posterior, uma extensão do VS Code `3.x`, um plugin do Obsidian `0.x` ou um plugin da JetBrains `0.9.0` ou `0.10.0`; com um servidor anterior à `1.0.0`, a extensão `4.0.0` ou posterior, ou um plugin `1.0.0` ou posterior | **Recusado**, incluindo as leituras, com `protocolMismatch`. A mensagem indica o lado a atualizar: a extensão ou o plugin, ou o servidor — consulte [Atualizar](./installation.md#updating). |
| No Windows, um editor que mantém o documento sob outro caminho para o mesmo arquivo: o agente o indicou por meio de um compartilhamento de rede ou de uma unidade mapeada deste computador, como `\\localhost\C$\…`, e o editor o mantém pelo caminho da unidade, ou o contrário | **Recusado**, incluindo as leituras, com `invalidPath`. A mensagem indica o caminho pelo qual o editor mantém o documento; chame novamente com esse caminho. |
| No Windows, um editor ao qual o Windows impede o acesso do agente: um iniciado como administrador quando o agente não foi, ou qualquer editor quando o agente é executado em um ambiente isolado (sandbox) | **Recusado**, incluindo as leituras, com `hubUnreachable` e uma mensagem que explica o motivo. Execute o editor e o agente com os mesmos direitos, por exemplo, iniciando o editor novamente sem direitos de administrador. |

O resultado de uma edição indica o modo em que ela foi executada, `live` ou `headless`, e uma edição recusada informa o motivo.
A procura é refeita a cada chamada, então a próxima chamada acompanha a abertura ou o fechamento de um editor.

Quando mais de um editor mantém o documento, um que o tem aberto prevalece sobre um que apenas atende uma pasta que o contém, e, entre os que atendem uma pasta, prevalece aquele cuja pasta está mais profunda.
Um empate, como dois editores que o têm aberto, fica com aquele cujo arquivo de bloqueio mudou por último.
Assim, um documento em um cofre do Obsidian dentro de uma pasta do espaço de trabalho do VS Code vai para o Obsidian, a menos que o VS Code o tenha aberto e o Obsidian não.

As chamadas sobre um mesmo documento são executadas uma de cada vez, na ordem em que chegaram ao servidor. As chamadas sobre documentos diferentes são executadas em paralelo.

## Ao vivo {#live}

O agente entra no editor como mais um colaborador.
Suas edições chegam imediatamente a todos os editores abertos no documento, e seu foco é desenhado na tabela e na célula que ele está editando, como o de um colaborador — consulte [focusTracker](../api/advanced/collaborative-editing.md#focustracker).

Uma leitura nunca abre um editor. Uma edição abre o documento no ERD Editor quando ele ainda não está aberto, sem tomar o foco do teclado.

Um editor com uma extensão do VS Code anterior à `4.2.0`, ou com um plugin do Obsidian ou da JetBrains anterior à `1.2.0`, ainda recebe ao vivo as edições do agente, mas não mostra nem mantém os nomes lógicos, os vínculos com domínios e as linhas do dicionário que o agente grava — consulte [Atualizar](./installation.md#updating).

### Salvamento {#saving}

Cada editor salva as edições do agente da mesma forma que salva as suas.

No VS Code, as edições do agente marcam a aba como tendo alterações não salvas, como as suas, e só chegam ao disco quando o documento é salvo.
`erd_save` o salva por meio do VS Code, como faz o comando de salvar do próprio VS Code. Em vez disso, você pode salvar com `Ctrl + S` (Windows/Linux) ou `⌘ + S` (Mac).
Fechar o editor com edições do agente não salvas pergunta se elas devem ser salvas, como para qualquer outra alteração não salva.

O Obsidian salva as edições do agente cerca de dois segundos depois que a edição para, e fechar a aba as salva sem perguntar.
Uma IDE da JetBrains as grava uma fração de segundo depois que a edição para, e fechar a aba grava o que ainda está pendente; a aba nunca aparece como modificada.
Em ambos, `erd_save` as grava imediatamente.

`erd_save` primeiro aguarda por até dois segundos que o editor contenha todas as edições que o agente fez.
É recusado com `notSaved` quando o editor não conseguiu confirmar isso ou não gravou o arquivo: o VS Code mantém uma aba não salva quando o arquivo mudou em disco, e uma IDE da JetBrains não conseguiu gravá-lo, como enquanto uma caixa de diálogo estava aberta ou quando o arquivo não pode ser gravado.

No VS Code e em uma IDE da JetBrains, `erd_save` em um documento sem nada mais a salvar é bem-sucedido e deixa o arquivo como está.
Esse é o caso assim que todas as edições estão salvas, o que uma IDE da JetBrains faz por conta própria, e continua assim enquanto cada alteração posterior for uma que um [bloqueio](../guide/guides/settings.md#lock) mantém fora do arquivo, como rolar ou aplicar zoom com `Viewport` bloqueado, trocar de aba com `Canvas Type` bloqueado ou trocar a [exibição de nomes](../guide/guides/logical-names.md#name-view) com `Name View` bloqueado. Todos os bloqueios estão ativados por padrão.
Um arquivo que uma IDE da JetBrains não consegue gravar é recusado mesmo nesse caso.

Quando o editor fecha o documento depois da última edição do agente, a próxima chamada do agente traz um aviso de que essas edições só estão no arquivo se foram salvas antes de o editor ser fechado.

### Desfazer {#undo}

`erd_undo` reverte a última edição feita pelo agente, nunca as suas, e `erd_redo` a aplica novamente.
O [desfazer](../guide/guides/undo-redo.md) do próprio editor funciona ao contrário: reverte as suas edições e nunca as do agente, pois as alterações que chegam de outro editor não são registradas no seu histórico.

Algumas edições não criam nenhuma entrada de desfazer no editor: `erd_set_database` e `erd_set_database_name`, entre as [ferramentas de configuração](./tools.md#settings), e `erd_resize_memo`.
O mesmo vale para um `erd_move_table_group` que move o grupo menos de 20 pixels no total, somando o deslocamento horizontal e o vertical, embora o grupo permaneça onde foi movido.
Uma chamada que não altera nada também não cria nenhuma: `erd_set_column_primary_key`, `erd_set_column_unique`, `erd_set_column_not_null`, `erd_set_column_auto_increment`, `erd_set_index_unique` ou `erd_set_index_column_order` definindo um valor que o documento já tem; `erd_add_index_column` com uma coluna que já está no índice; `erd_set_table_group` com tabelas que já estão nesse grupo (ou que já não estão em nenhum, com `groupId` `null`); `erd_move_table_group` para o ponto onde o grupo já está; `erd_resize_table_group` para o retângulo que o grupo já tem; `erd_sort_tables` em um documento sem nenhuma tabela; `erd_set_table_logical_name` ou `erd_set_column_logical_name` com o nome lógico que a tabela ou a coluna já tem, quando a derivação a partir dele não alteraria nada; `erd_set_column_domain` com o domínio ao qual a coluna já está vinculada, quando a coluna já tem o tipo desse domínio e a [sincronização do tipo de dados nos relacionamentos](../guide/guides/settings.md#relationship-datatype-sync) não mudaria o tipo de nenhuma coluna pelos relacionamentos dela; `erd_update_word`, `erd_update_term` ou `erd_update_domain` apenas com valores que a linha já tem, a menos que um termo sem nome físico receba seu `name` e suas palavras componham um; `erd_derive_physical_names` quando cada nome que ele abrange e que tem um nome lógico já contém o que os [dicionários](./tools.md#dictionaries) lhe dão e está marcado como derivado; ou uma importação com `mode` `append` que não traz nenhuma tabela (para `erd_import_json`, nenhuma tabela e nenhuma nota).
`erd_undo` pula essas chamadas e as indica pelo nome em seu resultado.
Outras edições, como `erd_change_relationship_type`, `erd_change_relationship_on_delete`, `erd_change_relationship_on_update`, `erd_change_table_group_name`, `erd_change_table_group_color` e `erd_set_ddl_script`, criam uma entrada mesmo quando definem um valor que o documento já tem.

O histórico de desfazer do agente termina, com um aviso no resultado, quando:

- O agente entra novamente no documento, por exemplo, depois que o editor o desconectou do documento.
- O editor é encerrado, ou fecha o documento e deixa de atendê-lo, e o agente continua editando o arquivo em disco.
- Um editor assume um documento que o agente estava editando em disco.

O servidor também fecha um documento sobre o qual o agente não fez nenhuma chamada por 30 minutos, e o histórico de desfazer se perde com ele, sem aviso.

### Quando o editor desaparece {#when-the-editor-goes-away}

Enquanto um editor mantém um documento, o servidor nunca recorre ao arquivo por conta própria.
Se a conexão cair, ele se reconecta.
Somente quando o editor foi encerrado, ou fechou o documento e não lista mais nem ele nem uma pasta que o contém, é que o servidor edita o arquivo, e ele informa isso no resultado.
Isso acontece quando você fecha um diagrama que está fora de todas as pastas que o editor atende (no VS Code, um aberto de fora do espaço de trabalho), quando desativa o plugin ERD Editor no Obsidian e quando fecha o projeto que contém o documento em uma IDE da JetBrains ou desativa o plugin nela.
Um diagrama fechado dentro de uma pasta que o editor atende permanece com o editor, e a próxima edição do agente o abre novamente.

Um editor que continua em execução, mas cujo arquivo de bloqueio desapareceu e cuja conexão se encerrou sem que ele fechasse o documento, recusa a próxima edição com `hubGone`.
A mensagem diz o que libera o documento: no VS Code, recarregue essa janela, ou feche-a para que o agente edite o arquivo diretamente; no Obsidian, reative o plugin ERD Editor, ou feche essa janela; em uma IDE da JetBrains, reative o plugin, ou encerre a IDE.

Em vez disso, uma leitura vai para o arquivo em disco, com um aviso de que faltam as edições ainda não salvas no editor, em dois casos: quando o editor que mantém o documento está com o hub desativado e no caso de `hubGone` acima.
Uma leitura que não consegue se conectar ao hub de um editor é recusada com `hubUnreachable`, como uma edição.

## Headless {#headless}

Sem nenhum editor atendendo o documento, cada edição carrega o arquivo, aplica a alteração e grava o arquivo de volta antes de responder, então o resultado dela diz `saved: true` — consulte [Resultados](./tools.md#results).
A gravação vai para um arquivo temporário ao lado do documento, chamado `.<name>.<id>.tmp`, que depois o substitui, de modo que o documento nunca fica gravado pela metade, exceto no Windows, no caso da gravação direta no arquivo descrita abaixo.

Antes dessa última etapa, o servidor verifica se o arquivo mudou em disco durante a chamada.
Se mudou, nada é gravado, o arquivo é carregado novamente e a chamada é recusada com `conflict`. O agente chama novamente.
Um arquivo que mudou entre duas chamadas é apenas carregado novamente, e o histórico de desfazer do agente até esse ponto é descartado.

Um arquivo somente leitura é deixado como está, e a edição é recusada com `readonly`: um arquivo sem permissão de gravação para seu proprietário, ou com o atributo somente leitura no Windows, como um arquivo do Perforce ou do TFVC sem check-out.
Torne-o gravável e depois chame novamente. As leituras continuam funcionando.

Se um editor começar a atender o documento enquanto o agente o edita em disco, somente essa edição é recusada com `hubAppeared` e nada é gravado. A próxima chamada edita por meio do editor.

No Windows, aplicam-se mais duas regras:

- Um documento com permissões próprias, diferentes das de sua pasta, é gravado diretamente no próprio arquivo em vez de substituído, para que as mantenha, e o arquivo temporário é removido depois. Um programa que lê o documento durante essa gravação pode encontrar um texto impossível de analisar.
- Um arquivo que outro programa mantém aberto não pode ser substituído, então o servidor tenta novamente por até dois segundos. Cada tentativa primeiro procura novamente um editor, e um editor que começou a atender o documento nesse meio-tempo recusa a gravação com `hubAppeared`, ou com `blocked` quando seu hub está desativado. Se o arquivo ainda estiver retido após dois segundos, nada é gravado, o arquivo é carregado novamente e a chamada falha com uma mensagem que cita o erro do sistema.

Um servidor anterior à `1.1.0` lê um documento sem os nomes lógicos, os vínculos das colunas com domínios e as palavras, os termos e os domínios dele, então a primeira edição que ele grava no arquivo os omite. Atualize o servidor — consulte [Atualizar](./installation.md#updating).

## Recusado {#refused}

Uma janela do VS Code mantém seu arquivo de bloqueio mesmo quando seu hub está desativado: quando `dineug.erd-editor.agentHub.enabled` está desativado, quando o espaço de trabalho não é confiável ou quando seu hub não conseguiu escutar.
Uma janela de cofre do Obsidian mantém seu arquivo de bloqueio com o hub desativado quando a opção Coding agents está desativada e quando seu hub não conseguiu escutar.
Uma IDE da JetBrains mantém seu arquivo de bloqueio com o hub desativado quando a opção Coding agents está desativada, quando seu hub não conseguiu escutar e enquanto a IDE está sendo encerrada.

Uma edição em um documento assim é recusada com `blocked`, porque o editor aberto poderia sobrescrever uma alteração gravada no arquivo em seu próximo salvamento.
As leituras continuam funcionando, a partir do arquivo em disco.

Para permitir que o agente edite, reative o hub, como a mensagem indica para esse editor: no VS Code, confie no espaço de trabalho e ative a configuração, ou recarregue a janela; no Obsidian, ative Coding agents, ou recarregue o Obsidian; em uma IDE da JetBrains, ative Coding agents, ou reinicie a IDE se a opção já estiver ativada.

Uma IDE da JetBrains também se recusa, com `hubDisabled`, a alterar um documento mantido apenas por projetos em que ela não confia.
Os agentes ainda podem ler um documento assim, e `erd_list_documents` o lista como `readonly`. Confie no projeto e depois chame novamente.

Um editor que não mantém nenhum arquivo de bloqueio não protege nada, e o agente edita o arquivo em disco mesmo enquanto o diagrama está aberto nele.
Esse é o caso do Obsidian ou de uma IDE da JetBrains instalados como Flatpak no Linux, de uma IDE da JetBrains sem JCEF e de uma IDE da JetBrains cujo hub não conseguiu iniciar — consulte [Configurar o Obsidian](./installation.md#set-up-obsidian) e [Configurar uma IDE da JetBrains](./installation.md#set-up-a-jetbrains-ide).
Uma extensão do VS Code anterior à `3.0.0` e um plugin da JetBrains anterior à `0.9.0` também não mantêm nenhum, pois não têm hub.

## Documentos {#documents}

Um documento é indicado por `path`, absoluto ou relativo ao diretório de trabalho do servidor.

- Os documentos novos são `.erd.json`. `erd_open_document` com `create` cria o arquivo, acrescentando `.erd.json` a um nome que não tem extensão. Como um diagrama novo no editor, o documento novo tem todos os [bloqueios](../guide/guides/settings.md#lock) ativados, então rolar, aplicar zoom, trocar de aba, trocar a exibição de nomes ou escolher outra linguagem do Gerador de código, outro estilo de nome ou outro tipo de delimitador em um editor nunca altera o arquivo. Nenhuma ferramenta ativa ou desativa um bloqueio individual: você faz isso na aba Configurações do editor. `erd_import_json` no modo `replace` substitui todos eles pelos do documento que carrega — consulte [Importação](./tools.md#import).
- Os arquivos `.erd`, `.vuerd` e `.vuerd.json` existentes também abrem. Um caminho com qualquer outra extensão é recusado com `invalidPath`.
- No Windows, um caminho que contém um nome que o Windows não armazena como escrito é recusado com `invalidPath` antes que o documento seja lido ou gravado, incluindo as leituras: um nome com dois-pontos ou outro caractere que o Windows recusa, como `orders:v2.erd`; um nome de dispositivo como `NUL.erd` ou `CON.erd`, com qualquer combinação de maiúsculas e minúsculas; ou um nome que termina em ponto ou espaço. Renomeie-o, por exemplo, com `-` no lugar de `:`.
- Um arquivo que não é um documento que o editor consiga ler, como um que ficou com marcadores de conflito de merge, é recusado com `invalidDocument` e deixado como está. Ele nunca é carregado como um diagrama vazio e gravado de volta.

O agente altera um documento apenas por meio das ferramentas e é instruído a nunca gravar o arquivo por conta própria.

`erd_list_documents` lista os documentos com `path`, `open`, `active`, `dirty` e `readonly`.
Consulta o editor que atende o diretório de trabalho, escolhido como para um documento, e lista os diagramas abertos nele, depois os arquivos ERD que ele atende: os das pastas do espaço de trabalho de uma janela do VS Code, de um cofre do Obsidian ou de todos os projetos abertos em uma IDE da JetBrains.
Caso contrário, lista os arquivos ERD sob o diretório de trabalho, onde um arquivo somente leitura é marcado como `readonly` e, no Windows, um nome que o Windows não armazena como escrito fica de fora.
