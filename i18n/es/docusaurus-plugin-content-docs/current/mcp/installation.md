---
sidebar_position: 2
description: Registra el servidor @dineug/erd-editor-mcp en Claude Code, Codex o cualquier otro cliente MCP, y configura VS Code, Obsidian o un IDE de JetBrains para la edición en vivo.
---

# Instalación

El servidor se publica en npm como `@dineug/erd-editor-mcp`.
Es un único archivo autónomo sin dependencias en tiempo de ejecución, y `npx` lo descarga la primera vez que el agente lo inicia, así que no hay nada más que instalar.
Necesita Node.js `22.12` o posterior.

Para que el agente edite un diagrama en vivo, configura también el editor que lo contiene: [VS Code](#set-up-vs-code), [Obsidian](#set-up-obsidian) o [un IDE de JetBrains](#set-up-a-jetbrains-ide).
Si ningún editor sirve el documento, el agente edita el archivo en disco; consulta [En vivo y headless](./live-and-headless.md).

## Claude Code {#claude-code}

Ejecuta esto en la carpeta de tu proyecto:

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

Añade `--scope project` antes de `--transport` para escribir el servidor, en su lugar, en el `.mcp.json` del proyecto, donde lo obtiene cualquiera que clone el proyecto.

## Codex {#codex}

Ejecútalo una sola vez. La CLI, la aplicación y la extensión para IDE de Codex comparten el ajuste:

```sh
codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp
```

O añade el servidor a `~/.codex/config.toml`, o a `.codex/config.toml` en un proyecto de confianza:

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## Cualquier otro cliente MCP {#any-other-mcp-client}

Ejecuta `npx -y @dineug/erd-editor-mcp` como servidor stdio: el comando es `npx`, y los argumentos son `-y` y `@dineug/erd-editor-mcp`.

El servidor resuelve una ruta de documento relativa respecto a su directorio de trabajo, así que inícialo en la carpeta de tu proyecto.
Admite las versiones `2025-06-18`, `2025-03-26` y `2024-11-05` del protocolo MCP, y a un cliente con una versión posterior le responde con `2025-06-18`.

## Configurar VS Code {#set-up-vs-code}

Una ventana de VS Code sirve los diagramas de las carpetas de su área de trabajo y cualquier diagrama abierto en ella.

1. Instala la [extensión ERD Editor](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) `4.0.0` o posterior. Necesita VS Code `1.101.0` o posterior.
2. Abre la carpeta del proyecto y confía en el área de trabajo. La extensión solo da servicio a agentes en un área de trabajo de confianza.
3. Deja activado el ajuste `dineug.erd-editor.agentHub.enabled`. Está activado de forma predeterminada.

Una extensión de la `3.0.0` a la `3.1.0` y el servidor `1.0.0` o posterior se rechazan mutuamente, y una extensión anterior a la `3.0.0` no da servicio a ningún agente.
Una extensión `4.0.0` o `4.1.0` se conecta, pero no muestra ni conserva los nombres lógicos, los vínculos con dominios ni las filas de los diccionarios que escribe el agente; consulta [Actualizar](#updating).

La extensión se inicia en un área de trabajo que contiene archivos `.erd`, `.erd.json`, `.vuerd` o `.vuerd.json`, así que un agente llega a esos diagramas antes de que abras uno.
En un área de trabajo sin ninguno de ellos, se inicia cuando abres un diagrama, y hasta entonces el agente edita en disco.

| Ajuste | Predeterminado | Efecto |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | Permite que el servidor MCP de un agente edite los documentos de esta ventana a través de un socket local, o de una canalización con nombre en Windows. Si se desactiva, o en un área de trabajo que no es de confianza, los agentes aún pueden leer desde el disco los diagramas de la ventana, pero nunca escribir uno a espaldas de su editor. |

## Configurar Obsidian {#set-up-obsidian}

Una ventana de bóveda de Obsidian sirve los diagramas de su bóveda.

1. Instala el [plugin ERD Editor](https://community.obsidian.md/plugins/erd-editor) `1.0.0` o posterior desde Community plugins y actívalo. Solo funciona en la aplicación de escritorio y necesita Obsidian `1.5.7` o posterior.
2. Deja activado Settings → ERD Editor → Coding agents. Está activado de forma predeterminada, y cada bóveda guarda su propio ajuste.

Un plugin anterior a la `1.0.0` y el servidor `1.0.0` o posterior se rechazan mutuamente.
Un plugin `1.0.0` o `1.1.0` se conecta, pero no muestra ni conserva los nombres lógicos, los vínculos con dominios ni las filas de los diccionarios que escribe el agente; consulta [Actualizar](#updating).

Una ventana de bóveda da servicio a agentes desde el momento en que se carga el plugin, así que un agente llega a los diagramas de la bóveda antes de que abras uno.
No hay ningún paso de confianza.
Un archivo que la bóveda no enumera, como uno de una carpeta cuyo nombre empieza por un punto, no se puede abrir en el ERD Editor, así que una edición en él se rechaza.

Pide al agente que nombre los diagramas nuevos con `.erd`.
Un nombre sin extensión recibe `.erd.json`, y el explorador de archivos de Obsidian solo muestra un archivo `.erd.json` mientras Settings → Files and links → Detect all file extensions está activado.

| Ajuste | Predeterminado | Efecto |
| --- | --- | --- |
| Coding agents | Activado | Permite que el servidor MCP de un agente edite los diagramas de esta bóveda a través de un socket local, o de una canalización con nombre en Windows. Si se desactiva, los agentes aún pueden leer desde el disco los diagramas de la bóveda, pero nunca escribir uno a espaldas de su editor. |

Obsidian instalado desde Flathub se ejecuta en un entorno aislado de Flatpak, al que el servidor no puede llegar.
En ese entorno, el plugin no da servicio a ningún agente ni mantiene ningún archivo de bloqueo, así que el agente edita los archivos en disco, incluso un diagrama que tengas abierto.
Obsidian recarga el diagrama, como hace tras cualquier cambio hecho fuera de él, y una edición tuya que aún no haya guardado cede ante la del agente.
El plugin lo indica cada vez que se abre la bóveda, hasta que desactives Coding agents.

## Configurar un IDE de JetBrains {#set-up-a-jetbrains-ide}

Un IDE de JetBrains sirve los diagramas de todos los proyectos abiertos en él y cualquier diagrama abierto en su ERD Editor.

1. Instala el [plugin ERD Editor](https://plugins.jetbrains.com/plugin/23594-erd-editor) `1.0.0` o posterior. Necesita un IDE basado en IntelliJ `2025.2` o posterior que se ejecute sobre el JetBrains Runtime.
2. Abre el proyecto y confía en él. En un proyecto en el que el IDE no confía, como uno abierto en modo seguro, los agentes leen los diagramas pero nunca los modifican.
3. Deja marcado Settings | Tools | ERD Editor → Coding agents. Está activado de forma predeterminada y se aplica a todo el IDE.

Un plugin `0.9.0` o `0.10.0` y el servidor `1.0.0` o posterior se rechazan mutuamente, y un plugin anterior a la `0.9.0` no da servicio a ningún agente.
Un plugin `1.0.0` o `1.1.0` se conecta, pero no muestra ni conserva los nombres lógicos, los vínculos con dominios ni las filas de los diccionarios que escribe el agente; consulta [Actualizar](#updating).

El IDE da servicio a agentes desde el momento en que se abre el primer proyecto, así que un agente llega a los diagramas de un proyecto antes de que abras uno.

| Ajuste | Predeterminado | Efecto |
| --- | --- | --- |
| Coding agents | Activado | Permite que el servidor MCP de un agente edite los diagramas de este IDE a través de un socket local, o de una canalización con nombre en Windows. Si se desactiva, los agentes aún pueden leer desde el disco los diagramas de los proyectos abiertos, pero nunca modificar uno a espaldas de su editor. |

La página de ajustes indica cuándo no están disponibles los agentes de programación: en un IDE sin JCEF (donde tampoco puede ejecutarse el ERD Editor), en un IDE instalado como Flatpak en Linux y cuando su hub no ha podido iniciarse.
En esos casos, el IDE no mantiene ningún archivo de bloqueo, y el agente edita los archivos en disco.
El ERD Editor no recarga un diagrama modificado en disco mientras está abierto, y tu siguiente edición en él vuelve a escribir el diagrama entero sobre los cambios del agente, así que cierra antes el diagrama.

## Pruébalo {#try-it}

1. Abre la carpeta que contiene tus diagramas: en VS Code, como un área de trabajo en la que confías; en Obsidian, como una bóveda; en un IDE de JetBrains, como un proyecto en el que confías.
2. Inicia el agente en la misma carpeta y haz tu petición con palabras sencillas, por ejemplo _«Añade una tabla reviews a schema.erd.json, relacionada con users y products»_.
3. Observa cómo el cambio llega al lienzo. En VS Code, guarda con `Ctrl + S` (Windows/Linux) o `⌘ + S` (Mac), o pide al agente que guarde. Obsidian y un IDE de JetBrains guardan el cambio igual que guardan tus propias ediciones, y pedir al agente que guarde lo escribe de inmediato.

Un diagrama que aún no está abierto se abre en el ERD Editor con la primera edición del agente, sin tomar el foco del teclado.
El agente crea un documento nuevo con `erd_open_document`, y un nombre sin extensión recibe `.erd.json`.

## Actualizar {#updating}

Los comandos anteriores no indican ninguna versión, así que `npx` comprueba en npm si hay una versión más reciente del servidor cada vez que el agente lo inicia.
Un servidor que ya está en ejecución conserva su versión hasta que el agente lo vuelve a iniciar.

El servidor comprueba la versión del protocolo que usa el editor antes de conectarse.
Cuando no coinciden, toda llamada que llega a ese editor se rechaza con `protocolMismatch`, incluidas las lecturas y `erd_list_documents`, y no se escribe nada.
El mensaje indica qué lado hay que actualizar: el servidor, o el ERD Editor del editor, que es la extensión en VS Code y el plugin en Obsidian y en un IDE de JetBrains.

El servidor `1.0.0` o posterior, la extensión de VS Code `4.0.0` o posterior, el plugin de Obsidian `1.0.0` o posterior y el plugin de JetBrains `1.0.0` o posterior usan el protocolo 2.
Todos los servidores anteriores usan el protocolo 1, y también todas las versiones anteriores del editor que dan servicio a agentes: la extensión de VS Code de la `3.0.0` a la `3.1.0`, el plugin de Obsidian `0.1.0` y `0.2.0`, y el plugin de JetBrains `0.9.0` y `0.10.0`.
Un editor así y el servidor `1.0.0` o posterior se rechazan mutuamente, y lo mismo ocurre con un servidor anterior y un editor que usa el protocolo 2.
Una extensión de VS Code anterior a la `3.0.0` o un plugin de JetBrains anterior a la `0.9.0` no da servicio a ningún agente, así que el agente edita los archivos en disco, incluso un diagrama abierto en él.

| Combinación | Final del mensaje |
| --- | --- |
| El servidor `1.0.0` o posterior con una extensión o un plugin que usa el protocolo 1 | `Update the ERD Editor extension or plugin in the editor until its hub speaks protocol 2.` |
| Un servidor anterior con una extensión o un plugin que usa el protocolo 2 | `Update the MCP server (npx -y @dineug/erd-editor-mcp@latest) until it speaks protocol 2.` |

Actualiza a la vez el servidor y la extensión o el plugin.
Un servidor y un editor que usan el mismo protocolo se conectan, sea cual sea el más antiguo de los dos, pero solo el servidor `1.1.0` o posterior tiene herramientas para los nombres lógicos, los dominios y los diccionarios; consulta [Diccionarios](./tools.md#dictionaries).
Solo la extensión de VS Code `4.2.0` o posterior y los plugins de Obsidian y JetBrains `1.2.0` o posterior muestran y conservan los nombres lógicos, los vínculos con dominios y las filas de los diccionarios que escriben esas herramientas.
Una extensión o un plugin anterior que se conecta los ignora, aunque la llamada del agente se completa correctamente.
Aun así, aplica los nombres físicos que derivan los diccionarios y los tipos de datos que dan los dominios.
Un servidor anterior a la `1.1.0` lee un archivo sin sus nombres lógicos, sus vínculos con dominios ni sus filas de los diccionarios, y los omite cuando edita el archivo en disco; consulta [Headless](./live-and-headless.md#headless).

Actualiza también ERD Editor allí donde se abran los diagramas.
La extensión de VS Code anterior a la `4.2.0`, el plugin de Obsidian anterior a la `1.2.0` y el plugin de JetBrains anterior a la `1.2.0` abren un diagrama que guardó una versión posterior, o que el agente editó en disco, sin los nombres lógicos de sus tablas y columnas, sin los vínculos con dominios de sus columnas y sin sus palabras, términos y dominios.
Cuando guardan el archivo, los omiten.
La extensión de VS Code anterior a la `4.0.0`, el plugin de Obsidian anterior a la `1.0.0` y el plugin de JetBrains anterior a la `1.0.0` también muestran un diagrama así sin sus iconos de clave principal, y descartan sus grupos de tablas y sus scripts del Esquema SQL al guardar el archivo.
La extensión de VS Code anterior a la `3.1.0`, el plugin de Obsidian anterior a la `0.2.0` y el plugin de JetBrains anterior a la `0.10.0` también descartan las acciones ON DELETE y ON UPDATE de un diagrama al guardar el archivo.
En Obsidian, reinicia la aplicación después de actualizar el plugin: hasta entonces, una ventana de bóveda sigue ejecutando el ERD Editor de la versión del plugin que cargó primero.
