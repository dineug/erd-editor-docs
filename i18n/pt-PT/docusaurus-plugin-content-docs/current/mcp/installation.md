---
sidebar_position: 2
description: Registar o servidor @dineug/erd-editor-mcp no Claude Code, no Codex ou em qualquer outro cliente MCP, e configurar o VS Code, o Obsidian ou um IDE da JetBrains para a edição em direto.
---

# Instalação

O servidor está publicado no npm como `@dineug/erd-editor-mcp`.
É um único ficheiro autónomo, sem dependências em tempo de execução, e o `npx` transfere-o na primeira vez que o agente o inicia, pelo que não há mais nada a instalar.
Requer o Node.js `22.12` ou posterior.

Para que o agente edite um diagrama em direto, configure também o editor que o contém: o [VS Code](#set-up-vs-code), o [Obsidian](#set-up-obsidian) ou [um IDE da JetBrains](#set-up-a-jetbrains-ide).
Se nenhum editor servir o documento, o agente edita o ficheiro no disco — consulte [Em direto e headless](./live-and-headless.md).

## Claude Code {#claude-code}

Execute na pasta do seu projeto:

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

Adicione `--scope project` antes de `--transport` para, em vez disso, escrever o servidor no `.mcp.json` do projeto, onde fica disponível para todos os que clonarem o projeto.

## Codex {#codex}

Execute uma vez. A CLI, a aplicação e a extensão para IDE do Codex partilham a definição:

```sh
codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp
```

Ou adicione o servidor a `~/.codex/config.toml` ou a `.codex/config.toml` num projeto de confiança:

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## Qualquer outro cliente MCP {#any-other-mcp-client}

Execute `npx -y @dineug/erd-editor-mcp` como servidor stdio: o comando é `npx` e os argumentos são `-y` e `@dineug/erd-editor-mcp`.

O servidor resolve um caminho de documento relativo a partir do respetivo diretório de trabalho, por isso inicie-o na pasta do seu projeto.
Suporta as versões `2025-06-18`, `2025-03-26` e `2024-11-05` do protocolo MCP e responde com `2025-06-18` a um cliente numa versão posterior.

## Configurar o VS Code {#set-up-vs-code}

Uma janela do VS Code serve os diagramas das pastas da respetiva área de trabalho e qualquer diagrama nela aberto.

1. Instale a [extensão ERD Editor](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) `4.0.0` ou posterior. Requer o VS Code `1.101.0` ou posterior.
2. Abra a pasta do projeto e confie na área de trabalho. A extensão só serve agentes numa área de trabalho de confiança.
3. Deixe a definição `dineug.erd-editor.agentHub.enabled` ativada. Está ativada por predefinição.

Uma extensão da `3.0.0` à `3.1.0` e o servidor `1.0.0` ou posterior recusam-se mutuamente, e uma extensão anterior à `3.0.0` não serve agentes.
Uma extensão `4.0.0` ou `4.1.0` liga-se, mas não mostra nem mantém os nomes lógicos, os vínculos a domínios e as linhas dos dicionários que o agente escreve — consulte [Atualizar](#updating).

A extensão inicia-se numa área de trabalho que contenha ficheiros `.erd`, `.erd.json`, `.vuerd` ou `.vuerd.json`, pelo que um agente chega a esses diagramas antes de algum deles ser aberto.
Numa área de trabalho sem nenhum deles, inicia-se quando se abre um diagrama e, até lá, o agente edita no disco.

| Definição | Predefinição | Efeito |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | Permite que o servidor MCP de um agente edite os documentos desta janela através de um socket local, ou de um pipe com nome no Windows. Quando está desativada, ou numa área de trabalho que não é de confiança, os agentes continuam a poder ler os diagramas da janela a partir do disco, mas nunca escrevem nenhum nas costas do respetivo editor. |

## Configurar o Obsidian {#set-up-obsidian}

Uma janela de cofre do Obsidian serve os diagramas do respetivo cofre.

1. Instale o [plugin ERD Editor](https://community.obsidian.md/plugins/erd-editor) `1.0.0` ou posterior a partir de Community plugins e ative-o. Só funciona na aplicação para computador e requer o Obsidian `1.5.7` ou posterior.
2. Deixe Settings → ERD Editor → Coding agents ativado. Está ativado por predefinição e cada cofre mantém a sua própria definição.

Um plugin anterior à `1.0.0` e o servidor `1.0.0` ou posterior recusam-se mutuamente.
Um plugin `1.0.0` ou `1.1.0` liga-se, mas não mostra nem mantém os nomes lógicos, os vínculos a domínios e as linhas dos dicionários que o agente escreve — consulte [Atualizar](#updating).

Uma janela de cofre serve agentes a partir do momento em que o plugin é carregado, pelo que um agente chega aos diagramas do cofre antes de algum deles ser aberto.
Não há nenhum passo de confiança.
Um ficheiro que o cofre não lista, como um que esteja numa pasta cujo nome começa por um ponto, não pode ser aberto no ERD Editor, pelo que uma edição a esse ficheiro é recusada.

Peça ao agente que dê aos novos diagramas nomes com a extensão `.erd`.
Um nome sem extensão recebe `.erd.json`, e o explorador de ficheiros do Obsidian só lista um ficheiro `.erd.json` enquanto Settings → Files and links → Detect all file extensions estiver ativado.

| Definição | Predefinição | Efeito |
| --- | --- | --- |
| Coding agents | Ativado | Permite que o servidor MCP de um agente edite os diagramas deste cofre através de um socket local, ou de um pipe com nome no Windows. Quando está desativado, os agentes continuam a poder ler os diagramas do cofre a partir do disco, mas nunca escrevem nenhum nas costas do respetivo editor. |

O Obsidian instalado a partir do Flathub é executado numa sandbox Flatpak, que o servidor não consegue alcançar.
Aí, o plugin não serve agentes nem mantém nenhum ficheiro de bloqueio, pelo que o agente edita os ficheiros no disco, mesmo um diagrama que tenha aberto.
O Obsidian recarrega o diagrama, como faz após qualquer alteração feita fora dele, e uma edição sua que ainda esteja por guardar dá lugar à do agente.
O plugin indica-o sempre que o cofre é aberto, até que desative Coding agents.

## Configurar um IDE da JetBrains {#set-up-a-jetbrains-ide}

Um IDE da JetBrains serve os diagramas de todos os projetos nele abertos e qualquer diagrama aberto no respetivo ERD Editor.

1. Instale o [plugin ERD Editor](https://plugins.jetbrains.com/plugin/23594-erd-editor) `1.0.0` ou posterior. Requer um IDE baseado no IntelliJ `2025.2` ou posterior, executado no JetBrains Runtime.
2. Abra o projeto e confie nele. Num projeto em que o IDE não confia, como um aberto no modo de segurança, os agentes leem os diagramas, mas nunca os alteram.
3. Deixe Settings | Tools | ERD Editor → Coding agents marcado. Está ativado por predefinição e aplica-se a todo o IDE.

Um plugin `0.9.0` ou `0.10.0` e o servidor `1.0.0` ou posterior recusam-se mutuamente, e um plugin anterior à `0.9.0` não serve agentes.
Um plugin `1.0.0` ou `1.1.0` liga-se, mas não mostra nem mantém os nomes lógicos, os vínculos a domínios e as linhas dos dicionários que o agente escreve — consulte [Atualizar](#updating).

O IDE serve agentes a partir do momento em que o primeiro projeto é aberto, pelo que um agente chega aos diagramas de um projeto antes de algum deles ser aberto.

| Definição | Predefinição | Efeito |
| --- | --- | --- |
| Coding agents | Ativado | Permite que o servidor MCP de um agente edite os diagramas deste IDE através de um socket local, ou de um pipe com nome no Windows. Quando está desativado, os agentes continuam a poder ler os diagramas dos projetos abertos a partir do disco, mas nunca alteram nenhum nas costas do respetivo editor. |

A página de definições indica quando os agentes de programação não estão disponíveis: num IDE sem JCEF (onde o ERD Editor também não pode ser executado), num IDE instalado como Flatpak no Linux e quando não foi possível iniciar o respetivo hub.
Aí, o IDE não mantém nenhum ficheiro de bloqueio e o agente edita os ficheiros no disco.
O ERD Editor não recarrega um diagrama alterado no disco enquanto este está aberto, e a próxima edição que fizer nele volta a escrever o diagrama inteiro por cima das alterações do agente, por isso feche primeiro o diagrama.

## Experimente {#try-it}

1. Abra a pasta que contém os seus diagramas: no VS Code, como uma área de trabalho em que confia; no Obsidian, como um cofre; num IDE da JetBrains, como um projeto em que confia.
2. Inicie o agente na mesma pasta e faça o pedido por palavras simples, por exemplo _«Adicione uma tabela reviews a schema.erd.json, relacionada com users e products»_.
3. Veja a alteração aparecer na tela. No VS Code, guarde com `Ctrl + S` (Windows/Linux) ou `⌘ + S` (Mac), ou peça ao agente que guarde. O Obsidian e um IDE da JetBrains guardam a alteração tal como guardam as edições feitas por si, e pedir ao agente que guarde escreve-a de imediato.

Um diagrama que ainda não está aberto abre-se no ERD Editor na primeira edição do agente, sem ficar com o foco do teclado.
O agente cria um novo documento com `erd_open_document`, e um nome sem extensão recebe `.erd.json`.

## Atualizar {#updating}

Os comandos acima não indicam nenhuma versão, pelo que o `npx` verifica no npm se existe uma versão mais recente do servidor sempre que o agente o inicia.
Um servidor que já está em execução mantém a sua versão até o agente voltar a iniciá-lo.

O servidor verifica a versão do protocolo que o editor utiliza antes de se ligar.
Quando as duas diferem, cada chamada que chega a esse editor é recusada com `protocolMismatch`, incluindo as leituras e `erd_list_documents`, e nada é escrito.
A mensagem indica o lado a atualizar: o servidor ou o ERD Editor no editor, que é a extensão no VS Code e o plugin no Obsidian e num IDE da JetBrains.

O servidor `1.0.0` ou posterior, a extensão do VS Code `4.0.0` ou posterior, o plugin do Obsidian `1.0.0` ou posterior e o plugin da JetBrains `1.0.0` ou posterior utilizam o protocolo 2.
Todos os servidores anteriores utilizam o protocolo 1, tal como todas as versões anteriores de editores que servem agentes: a extensão do VS Code da `3.0.0` à `3.1.0`, o plugin do Obsidian `0.1.0` e `0.2.0` e o plugin da JetBrains `0.9.0` e `0.10.0`.
Um editor destes e o servidor `1.0.0` ou posterior recusam-se mutuamente, e o mesmo acontece com um servidor anterior e um editor que utiliza o protocolo 2.
Uma extensão do VS Code anterior à `3.0.0` ou um plugin da JetBrains anterior à `0.9.0` não serve agente nenhum, pelo que o agente edita os ficheiros no disco, mesmo um diagrama nele aberto.

| Combinação | A mensagem termina com |
| --- | --- |
| Servidor `1.0.0` ou posterior com uma extensão ou um plugin que utiliza o protocolo 1 | `Update the ERD Editor extension or plugin in the editor until its hub speaks protocol 2.` |
| Um servidor anterior com uma extensão ou um plugin que utiliza o protocolo 2 | `Update the MCP server (npx -y @dineug/erd-editor-mcp@latest) until it speaks protocol 2.` |

Atualize o servidor e a extensão ou o plugin em conjunto.
Um servidor e um editor que utilizam o mesmo protocolo ligam-se, seja qual for o mais antigo dos dois, mas só o servidor `1.1.0` ou posterior tem ferramentas para nomes lógicos, domínios e os dicionários — consulte [Dicionários](./tools.md#dictionaries).
Só a extensão do VS Code `4.2.0` ou posterior e os plugins do Obsidian e da JetBrains `1.2.0` ou posterior mostram e mantêm os nomes lógicos, os vínculos a domínios e as linhas dos dicionários que essas ferramentas escrevem.
Uma extensão ou um plugin anterior que se ligue ignora-os, embora a chamada do agente tenha êxito.
Continua a aplicar os nomes físicos que os dicionários derivam e os tipos de dados que os domínios dão.
Um servidor anterior à `1.1.0` lê um ficheiro sem os respetivos nomes lógicos, vínculos a domínios e linhas dos dicionários, e deixa-os de fora quando edita o ficheiro no disco — consulte [Headless](./live-and-headless.md#headless).

Atualize também o ERD Editor em todos os sítios onde os diagramas são abertos.
A extensão do VS Code anterior à `4.2.0`, o plugin do Obsidian anterior à `1.2.0` e o plugin da JetBrains anterior à `1.2.0` abrem um diagrama que uma versão posterior guardou, ou que o agente editou no disco, sem os nomes lógicos das suas tabelas e colunas, sem os vínculos a domínios das suas colunas e sem as suas palavras, termos e domínios.
Quando guardam o ficheiro, deixam-nos de fora.
A extensão do VS Code anterior à `4.0.0`, o plugin do Obsidian anterior à `1.0.0` e o plugin da JetBrains anterior à `1.0.0` também mostram um diagrama destes sem os respetivos ícones de chave primária, e descartam os respetivos grupos de tabelas e scripts do Esquema SQL quando guardam o ficheiro.
A extensão do VS Code anterior à `3.1.0`, o plugin do Obsidian anterior à `0.2.0` e o plugin da JetBrains anterior à `0.10.0` também descartam as ações ON DELETE e ON UPDATE de um diagrama quando guardam o ficheiro.
No Obsidian, reinicie a aplicação depois de atualizar o plugin: até lá, uma janela de cofre continua a executar o ERD Editor da versão do plugin que carregou primeiro.
