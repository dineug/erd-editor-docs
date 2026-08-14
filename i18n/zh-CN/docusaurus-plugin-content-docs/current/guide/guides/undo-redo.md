---
sidebar_position: 9
---

# Undo, Redo

可以回到之前的编辑状态，也可以前进到之后的状态。  
历史记录最多保留 `2048` 条变更。

- Undo: `Ctrl + Z` (Windows/Linux) or `⌘ + Z` (Mac)
- Redo: `Ctrl + Shift + Z` (Windows/Linux) or `⌘ + Shift + Z` (Mac)

Undo 与 Redo 仅在 ERD 标签页生效，在 Visualization、Schema SQL、Code Generator 和设置标签页中不可用。

## Time Travel

从工具栏中 Undo 与 Redo 旁边打开。
拖动滑块浏览完整的编辑历史，然后按 `Apply` 应用所选时间点，或按 `Cancel` 保持文档不变。
