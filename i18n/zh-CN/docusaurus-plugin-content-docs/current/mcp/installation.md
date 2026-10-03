---
sidebar_position: 2
description: 在 Claude Code、Codex 或其他任何 MCP 客户端中注册 @dineug/erd-editor-mcp 服务器，并为实时编辑配置 VS Code、Obsidian 或 JetBrains IDE。
---

# 安装

该服务器以 `@dineug/erd-editor-mcp` 的名称发布在 npm 上。
它是一个没有运行时依赖的自包含文件，`npx` 会在智能体首次启动它时下载，因此无需另外安装任何东西。
它需要 Node.js `22.12` 或更高版本。

若要让智能体实时编辑图，还需配置持有该图的编辑器：[VS Code](#set-up-vs-code)、[Obsidian](#set-up-obsidian) 或 [JetBrains IDE](#set-up-a-jetbrains-ide)。
没有编辑器为该文档提供服务时，智能体会编辑磁盘上的文件，参见[实时与无头模式](./live-and-headless.md)。

## Claude Code

在项目文件夹中运行：

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

在 `--transport` 之前加上 `--scope project`，即可改为把服务器写入项目的 `.mcp.json`，所有克隆该项目的人都会用上它。

## Codex

添加到 `~/.codex/config.toml`，或者受信任项目中的 `.codex/config.toml`：

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## 其他 MCP 客户端

以 stdio 服务器的形式运行 `npx -y @dineug/erd-editor-mcp`：命令为 `npx`，参数为 `-y` 和 `@dineug/erd-editor-mcp`。

服务器以自身的工作目录为基准解析相对的文档路径，因此请在项目文件夹中启动它。
它支持 MCP 协议版本 `2025-06-18`、`2025-03-26` 和 `2024-11-05`，对使用更新版本的客户端则以 `2025-06-18` 应答。

## 配置 VS Code {#set-up-vs-code}

VS Code 窗口会为其工作区文件夹中的图，以及在其中打开的任何图提供服务。

1. 安装 `3.0.0` 或更高版本的 [ERD Editor 扩展](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode)。它需要 VS Code `1.101.0` 或更高版本。
2. 打开项目文件夹并信任该工作区。扩展只在受信任的工作区中为智能体提供服务。
3. 保持 `dineug.erd-editor.agentHub.enabled` 设置开启。该设置默认开启。

推荐使用 `3.1.0` 或更高版本。
更早版本的扩展会忽略智能体设置的 ON DELETE 与 ON UPDATE 操作，参见[更新](#更新)。
在通过符号链接、目录联接（junction）或映射驱动器打开的文件夹中，`3.0.0` 可能会为智能体再打开某个图的第二个标签页，而在该标签页中保存可能会撤回智能体的编辑。
在 Windows 上，`3.0.0` 可能会让智能体绕过打开的编辑器去编辑磁盘上的文件：在以管理员身份运行的窗口中，以及偶尔在你刚刚打开的图中。

扩展会在包含 `.erd`、`.erd.json`、`.vuerd` 或 `.vuerd.json` 文件的工作区中启动，因此在你打开任何一个图之前，智能体就能访问这些图。
在不包含这些文件的工作区中，扩展会在你打开图时启动，在此之前智能体会编辑磁盘上的文件。

| 设置 | 默认值 | 作用 |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | 允许智能体的 MCP 服务器通过本地套接字（在 Windows 上为命名管道）编辑该窗口的文档。关闭该设置，或者在不受信任的工作区中，智能体仍然可以从磁盘读取该窗口的图，但绝不会绕过其编辑器写入任何一个图。 |

## 配置 Obsidian {#set-up-obsidian}

Obsidian 仓库窗口会为其仓库中的图提供服务。

1. 从 Community plugins 安装 `0.1.0` 或更高版本的 [ERD Editor 插件](https://community.obsidian.md/plugins/erd-editor)，并将其开启。它只在桌面应用中运行，并且需要 Obsidian `1.5.7` 或更高版本。
2. 保持 Settings → ERD Editor → Coding agents 开启。该设置默认开启，并且每个仓库各自保存自己的设置。

推荐使用 `0.2.0` 或更高版本。
更早版本的插件会忽略智能体设置的 ON DELETE 与 ON UPDATE 操作，参见[更新](#更新)。

仓库窗口从插件加载的那一刻起就为智能体提供服务，因此在你打开任何一个图之前，智能体就能访问该仓库的图。
没有信任这一步骤。
仓库不列出的文件，例如名称以点开头的文件夹中的文件，无法在 ERD Editor 中打开，因此对它的编辑会被拒绝。

请让智能体用 `.erd` 为新图命名。
没有扩展名的名称会加上 `.erd.json`，而 Obsidian 的文件列表只有在 Settings → Files and links → Detect all file extensions 开启时才会列出 `.erd.json` 文件。

| 设置 | 默认值 | 作用 |
| --- | --- | --- |
| Coding agents | 开启 | 允许智能体的 MCP 服务器通过本地套接字（在 Windows 上为命名管道）编辑该仓库的图。关闭该设置后，智能体仍然可以从磁盘读取该仓库的图，但绝不会绕过其编辑器写入任何一个图。 |

从 Flathub 安装的 Obsidian 运行在 Flatpak 沙箱中，服务器无法访问它。
在这种情况下，插件不为任何智能体提供服务，也不保留锁文件，因此智能体会编辑磁盘上的文件，即使是你已打开的图也一样。
Obsidian 会像在其外部发生任何变更之后那样重新加载该图，而你的编辑中 Obsidian 尚未保存的部分会让位于智能体的编辑。
每次打开该仓库时，插件都会提示这一点，直到你关闭 Coding agents。

## 配置 JetBrains IDE {#set-up-a-jetbrains-ide}

JetBrains IDE 会为在其中打开的每个项目中的图，以及在其 ERD Editor 中打开的任何图提供服务。

1. 安装 `0.9.0` 或更高版本的 [ERD Editor 插件](https://plugins.jetbrains.com/plugin/23594-erd-editor)。它需要运行在 JetBrains Runtime 上的 `2025.2` 或更高版本的基于 IntelliJ 的 IDE。
2. 打开项目并信任它。在 IDE 不信任的项目中（例如以安全模式打开的项目），智能体可以读取图，但绝不会修改它们。
3. 保持 Settings | Tools | ERD Editor → Coding agents 处于勾选状态。该设置默认开启，并作用于整个 IDE。

推荐使用 `0.10.0` 或更高版本。
更早版本的插件会忽略智能体设置的 ON DELETE 与 ON UPDATE 操作，参见[更新](#更新)。
此外，当智能体要求保存一个没有任何未保存内容的图时，`0.9.0` 可能会再次写入该文件，从而丢掉文件开头的字节顺序标记，参见[保存](./live-and-headless.md#saving)。

IDE 从第一个项目打开的那一刻起就为智能体提供服务，因此在你打开任何一个图之前，智能体就能访问项目中的图。

| 设置 | 默认值 | 作用 |
| --- | --- | --- |
| Coding agents | 开启 | 允许智能体的 MCP 服务器通过本地套接字（在 Windows 上为命名管道）编辑该 IDE 的图。关闭该设置后，智能体仍然可以从磁盘读取已打开项目中的图，但绝不会绕过其编辑器修改任何一个图。 |

设置页面会指出编码智能体何时不可用：在没有 JCEF 的 IDE 中（ERD Editor 在其中同样无法运行）、在 Linux 上以 Flatpak 形式安装的 IDE 中，以及其 hub 无法启动时。
在这些情况下，IDE 不保留锁文件，智能体会编辑磁盘上的文件。
ERD Editor 在打开某个图期间不会重新加载在磁盘上发生变化的该图，而你在其中的下一次编辑会把整张图写回文件，覆盖智能体的变更，因此请先关闭该图。

## 试用

1. 打开存放你的图的文件夹：在 VS Code 中，作为你信任的工作区打开；在 Obsidian 中，作为仓库打开；在 JetBrains IDE 中，作为你信任的项目打开。
2. 在同一文件夹中启动智能体，用平常的话提出要求，例如 _“在 schema.erd.json 中添加一个 reviews 表，并与 users 和 products 建立关系”_。
3. 看着变更落到画布上。在 VS Code 中，用 `Ctrl + S` (Windows/Linux) 或 `⌘ + S` (Mac) 保存，或者让智能体保存。Obsidian 和 JetBrains IDE 会像保存你自己的编辑一样保存该变更，而让智能体保存则会立即写入。

尚未打开的图会在智能体首次编辑时于 ERD Editor 中打开，且不会夺取键盘焦点。
智能体用 `erd_open_document` 创建新文档，没有扩展名的名称会加上 `.erd.json`。

## 更新

上面的命令都没有指定版本，因此智能体每次启动服务器时，`npx` 都会到 npm 检查是否有更新的发布版本。

服务器在连接之前会检查编辑器所用的协议版本。
两者不一致时，调用会以 `protocolMismatch` 被拒绝，并附带一条指出需要更新哪一方的消息：服务器，或者编辑器中的 ERD Editor，即 VS Code 中的扩展，以及 Obsidian 和 JetBrains IDE 中的插件。

服务器 `0.2.0` 与在它之前发布的扩展和插件使用相同的协议，因此较旧的编辑器也能连接，不会出现 `protocolMismatch`。
`3.1.0` 之前的 VS Code 扩展、`0.2.0` 之前的 Obsidian 插件以及 `0.10.0` 之前的 JetBrains 插件会忽略智能体设置的 ON DELETE 与 ON UPDATE 操作，无论是通过[关系工具](./tools.md#关系)设置的，还是在它导入的 schema 中设置的。
调用会报告成功，但图和编辑器保存的文件中都不会包含这些操作。
这类编辑器在打开文件时还会丢掉文件中已有的这些操作，因此它下一次保存时写入的文件中便不再包含它们。
请同时更新扩展或插件，而不只是更新服务器。
在 Obsidian 中，更新插件后请重启应用：在此之前，仓库窗口会继续运行它最先加载的那个插件版本中的 ERD Editor。
