---
sidebar_position: 2
description: Registrar o servidor @dineug/erd-editor-mcp no Claude Code, no Codex ou em qualquer outro cliente MCP e configurar o VS Code, o Obsidian ou uma IDE da JetBrains para a edição ao vivo.
---

# Instalação

O servidor é publicado no npm como `@dineug/erd-editor-mcp`.
É um único arquivo autocontido, sem dependências em tempo de execução, e o `npx` o baixa na primeira vez que o agente o inicia, então não há mais nada para instalar.
Ele requer o Node.js `22.12` ou posterior.

Para que o agente edite um diagrama ao vivo, configure também o editor que o contém: o [VS Code](#set-up-vs-code), o [Obsidian](#set-up-obsidian) ou [uma IDE da JetBrains](#set-up-a-jetbrains-ide).
Sem nenhum editor atendendo o documento, o agente edita o arquivo em disco — consulte [Ao vivo e headless](./live-and-headless.md).

## Claude Code {#claude-code}

Execute na pasta do seu projeto:

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

Adicione `--scope project` antes de `--transport` para gravar o servidor, em vez disso, no `.mcp.json` do projeto, onde todos que clonam o projeto passam a usá-lo.

## Codex {#codex}

Execute uma vez. A CLI, o aplicativo e a extensão para IDE do Codex compartilham a configuração:

```sh
codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp
```

Ou adicione o servidor ao `~/.codex/config.toml` ou ao `.codex/config.toml` em um projeto confiável:

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## Qualquer outro cliente MCP {#any-other-mcp-client}

Execute `npx -y @dineug/erd-editor-mcp` como um servidor stdio: o comando é `npx` e os argumentos são `-y` e `@dineug/erd-editor-mcp`.

O servidor resolve um caminho de documento relativo a partir do próprio diretório de trabalho, então inicie-o na pasta do seu projeto.
Ele suporta as versões `2025-06-18`, `2025-03-26` e `2024-11-05` do protocolo MCP e responde com `2025-06-18` a um cliente que usa uma versão posterior.

## Configurar o VS Code {#set-up-vs-code}

Uma janela do VS Code atende os diagramas das pastas do espaço de trabalho dela e qualquer diagrama aberto nela.

1. Instale a [extensão ERD Editor](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) `4.0.0` ou posterior. Ela requer o VS Code `1.101.0` ou posterior.
2. Abra a pasta do projeto e confie no espaço de trabalho. A extensão atende agentes apenas em um espaço de trabalho confiável.
3. Deixe a configuração `dineug.erd-editor.agentHub.enabled` ativada. Ela está ativada por padrão.

Uma extensão da `3.0.0` à `3.1.0` e o servidor `1.0.0` ou posterior se recusam mutuamente, e uma extensão anterior à `3.0.0` não atende nenhum agente.
Uma extensão `4.0.0` ou `4.1.0` se conecta, mas não mostra nem mantém os nomes lógicos, os vínculos com domínios e as linhas do dicionário que o agente grava — consulte [Atualizar](#updating).

A extensão é iniciada em um espaço de trabalho que contém arquivos `.erd`, `.erd.json`, `.vuerd` ou `.vuerd.json`, então um agente alcança esses diagramas antes que você abra um deles.
Em um espaço de trabalho sem nenhum deles, ela é iniciada quando você abre um diagrama e, até lá, o agente edita em disco.

| Configuração | Padrão | Efeito |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | Permite que o servidor MCP de um agente edite os documentos desta janela por um socket local, ou por um pipe nomeado no Windows. Com ela desativada, ou em um espaço de trabalho não confiável, os agentes ainda podem ler do disco os diagramas da janela, mas nunca gravam um deles sem passar pelo editor. |

## Configurar o Obsidian {#set-up-obsidian}

Uma janela de cofre do Obsidian atende os diagramas do próprio cofre.

1. Instale o [plugin ERD Editor](https://community.obsidian.md/plugins/erd-editor) `1.0.0` ou posterior a partir de Community plugins e ative-o. Ele funciona apenas no aplicativo para desktop e requer o Obsidian `1.5.7` ou posterior.
2. Deixe ativada a opção Settings → ERD Editor → Coding agents. Ela está ativada por padrão, e cada cofre mantém sua própria configuração.

Um plugin anterior à `1.0.0` e o servidor `1.0.0` ou posterior se recusam mutuamente.
Um plugin `1.0.0` ou `1.1.0` se conecta, mas não mostra nem mantém os nomes lógicos, os vínculos com domínios e as linhas do dicionário que o agente grava — consulte [Atualizar](#updating).

Uma janela de cofre atende agentes a partir do momento em que o plugin é carregado, então um agente alcança os diagramas do cofre antes que você abra um deles.
Não há etapa de confiança.
Um arquivo que o cofre não lista, como um que está em uma pasta cujo nome começa com um ponto, não pode ser aberto no ERD Editor, então uma edição nele é recusada.

Peça ao agente que nomeie os novos diagramas com `.erd`.
Um nome sem extensão recebe `.erd.json`, e o explorador de arquivos do Obsidian lista um arquivo `.erd.json` somente enquanto Settings → Files and links → Detect all file extensions está ativado.

| Configuração | Padrão | Efeito |
| --- | --- | --- |
| Coding agents | Ativado | Permite que o servidor MCP de um agente edite os diagramas deste cofre por um socket local, ou por um pipe nomeado no Windows. Com ela desativada, os agentes ainda podem ler do disco os diagramas do cofre, mas nunca gravam um deles sem passar pelo editor. |

O Obsidian instalado pelo Flathub é executado em um ambiente isolado (sandbox) do Flatpak, que o servidor não consegue alcançar.
Nesse caso, o plugin não atende nenhum agente e não mantém nenhum arquivo de bloqueio, então o agente edita os arquivos em disco, mesmo um diagrama que você tenha aberto.
O Obsidian recarrega o diagrama, como faz após qualquer alteração feita fora dele, e uma edição sua que ele ainda não salvou cede lugar à do agente.
O plugin informa isso toda vez que o cofre é aberto, até que você desative Coding agents.

## Configurar uma IDE da JetBrains {#set-up-a-jetbrains-ide}

Uma IDE da JetBrains atende os diagramas de todos os projetos abertos nela e qualquer diagrama aberto no ERD Editor dela.

1. Instale o [plugin ERD Editor](https://plugins.jetbrains.com/plugin/23594-erd-editor) `1.0.0` ou posterior. Ele requer uma IDE baseada no IntelliJ `2025.2` ou posterior, executada no JetBrains Runtime.
2. Abra o projeto e confie nele. Em um projeto em que a IDE não confia, como um aberto no modo seguro, os agentes leem os diagramas, mas nunca os alteram.
3. Deixe marcada a opção Settings | Tools | ERD Editor → Coding agents. Ela está ativada por padrão e se aplica à IDE inteira.

Um plugin `0.9.0` ou `0.10.0` e o servidor `1.0.0` ou posterior se recusam mutuamente, e um plugin anterior à `0.9.0` não atende nenhum agente.
Um plugin `1.0.0` ou `1.1.0` se conecta, mas não mostra nem mantém os nomes lógicos, os vínculos com domínios e as linhas do dicionário que o agente grava — consulte [Atualizar](#updating).

A IDE atende agentes a partir do momento em que o primeiro projeto é aberto, então um agente alcança os diagramas de um projeto antes que você abra um deles.

| Configuração | Padrão | Efeito |
| --- | --- | --- |
| Coding agents | Ativado | Permite que o servidor MCP de um agente edite os diagramas desta IDE por um socket local, ou por um pipe nomeado no Windows. Com ela desativada, os agentes ainda podem ler do disco os diagramas dos projetos abertos, mas nunca alteram um deles sem passar pelo editor. |

A página de configurações informa quando os agentes de codificação não estão disponíveis: em uma IDE sem JCEF (onde o ERD Editor também não pode ser executado), em uma IDE instalada como Flatpak no Linux e quando não foi possível iniciar o hub dela.
Nesses casos, a IDE não mantém nenhum arquivo de bloqueio, e o agente edita os arquivos em disco.
O ERD Editor não recarrega um diagrama alterado em disco enquanto ele está aberto, e sua próxima edição nele grava o diagrama inteiro de volta por cima das alterações do agente, então feche o diagrama antes.

## Experimente {#try-it}

1. Abra a pasta que contém seus diagramas: no VS Code, como um espaço de trabalho em que você confia; no Obsidian, como um cofre; em uma IDE da JetBrains, como um projeto em que você confia.
2. Inicie o agente na mesma pasta e faça o pedido em palavras simples, por exemplo _“Adicione uma tabela reviews ao schema.erd.json, relacionada a users e products”_.
3. Veja a alteração chegar ao canvas. No VS Code, salve com `Ctrl + S` (Windows/Linux) ou `⌘ + S` (Mac), ou peça ao agente que salve. O Obsidian e uma IDE da JetBrains salvam a alteração como salvam as suas próprias edições, e, se você pedir ao agente que salve, a alteração é gravada imediatamente.

Um diagrama que ainda não está aberto se abre no ERD Editor na primeira edição do agente, sem tomar o foco do teclado.
O agente cria um novo documento com a ferramenta `erd_open_document`, e um nome sem extensão recebe `.erd.json`.

## Atualizar {#updating}

Os comandos acima não indicam nenhuma versão, então o `npx` verifica no npm se há uma versão mais recente do servidor toda vez que o agente o inicia.
Um servidor que já está em execução mantém sua versão até que o agente o inicie novamente.

O servidor verifica a versão do protocolo que o editor usa antes de se conectar.
Quando as duas versões diferem, toda chamada que chega a esse editor é recusada com `protocolMismatch`, inclusive as leituras e `erd_list_documents`, e nada é gravado.
A mensagem indica o lado a atualizar: o servidor ou o ERD Editor no editor, que é a extensão no VS Code e o plugin no Obsidian e em uma IDE da JetBrains.

O servidor `1.0.0` ou posterior, a extensão do VS Code `4.0.0` ou posterior, o plugin do Obsidian `1.0.0` ou posterior e o plugin da JetBrains `1.0.0` ou posterior usam o protocolo 2.
Todo servidor anterior usa o protocolo 1, assim como toda versão anterior de um editor que atende agentes: a extensão do VS Code da `3.0.0` à `3.1.0`, o plugin do Obsidian nas versões `0.1.0` e `0.2.0` e o plugin da JetBrains nas versões `0.9.0` e `0.10.0`.
Um editor assim e o servidor `1.0.0` ou posterior se recusam mutuamente, assim como um servidor anterior e um editor que usa o protocolo 2.
Uma extensão do VS Code anterior à `3.0.0` ou um plugin da JetBrains anterior à `0.9.0` não atende nenhum agente, então o agente edita os arquivos em disco, mesmo um diagrama aberto nele.

| Combinação | A mensagem termina com |
| --- | --- |
| Servidor `1.0.0` ou posterior com uma extensão ou um plugin que usa o protocolo 1 | `Update the ERD Editor extension or plugin in the editor until its hub speaks protocol 2.` |
| Um servidor anterior com uma extensão ou um plugin que usa o protocolo 2 | `Update the MCP server (npx -y @dineug/erd-editor-mcp@latest) until it speaks protocol 2.` |

Atualize o servidor e a extensão ou o plugin juntos.
Um servidor e um editor que usam o mesmo protocolo se conectam, qualquer que seja o mais antigo dos dois, mas só o servidor `1.1.0` ou posterior tem ferramentas para nomes lógicos, domínios e dicionários — consulte [Dicionários](./tools.md#dictionaries).
Só a extensão do VS Code `4.2.0` ou posterior e os plugins do Obsidian e da JetBrains `1.2.0` ou posterior mostram e mantêm os nomes lógicos, os vínculos com domínios e as linhas do dicionário que essas ferramentas gravam.
Uma extensão ou um plugin anterior que se conecta os ignora, embora a chamada do agente seja bem-sucedida.
Ele ainda aplica os nomes físicos que os dicionários derivam e os tipos de dados que os domínios dão.
Um servidor anterior à `1.1.0` lê um arquivo sem os nomes lógicos, os vínculos com domínios e as linhas do dicionário dele e os omite quando edita o arquivo em disco — consulte [Headless](./live-and-headless.md#headless).

Atualize também o ERD Editor em todos os lugares onde os diagramas são abertos.
A extensão do VS Code anterior à `4.2.0`, o plugin do Obsidian anterior à `1.2.0` e o plugin da JetBrains anterior à `1.2.0` abrem um diagrama que uma versão posterior salvou, ou que o agente editou em disco, sem os nomes lógicos das tabelas e das colunas, os vínculos das colunas com domínios e as palavras, os termos e os domínios do diagrama.
Quando salvam o arquivo, eles os omitem.
A extensão do VS Code anterior à `4.0.0`, o plugin do Obsidian anterior à `1.0.0` e o plugin da JetBrains anterior à `1.0.0` também exibem um diagrama desses sem os ícones de chave primária e descartam os grupos de tabelas e os scripts de Esquema SQL dele quando salvam o arquivo.
A extensão do VS Code anterior à `3.1.0`, o plugin do Obsidian anterior à `0.2.0` e o plugin da JetBrains anterior à `0.10.0` também descartam as ações ON DELETE e ON UPDATE de um diagrama ao salvar o arquivo.
No Obsidian, reinicie o aplicativo depois de atualizar o plugin: até lá, uma janela de cofre continua executando o ERD Editor da versão do plugin que carregou primeiro.
