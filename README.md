<div align="center">

# Project Manager (简体中文版)

*全功能项目管理，原生支持中文界面。*

[![Downloads](https://img.shields.io/github/downloads/sleepingEARs/obsidian-project-manager-zhCN/total?style=for-the-badge&color=2ea44f)](https://github.com/sleepingEARs/obsidian-project-manager-zhCN/releases)
[![Version](https://img.shields.io/badge/版本-v1.5.0--zhCN-blue?style=for-the-badge)](https://github.com/sleepingEARs/obsidian-project-manager-zhCN/releases)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://github.com/StepanKropachev/obsidian-pm/blob/main/LICENSE)

> 本项目基于 [StepanKropachev/obsidian-pm](https://github.com/StepanKropachev/obsidian-pm) (MIT License) 汉化修改
> 原作者：[Stepan Kropachev](https://github.com/StepanKropachev)
> 汉化版本：v1.5.0-zhCN

</div>

表格视图、甘特图、看板、自定义字段、时间追踪、智能调度——全部以纯 Markdown + YAML frontmatter 存储。无需外部服务，无需订阅。你的数据完全属于你。

---

## 汉化特性

- ✅ **完整中文界面**：设置面板、命令面板、弹窗、通知全部汉化
- ✅ **语言切换**：设置中可自由切换 中文/英文
- ✅ **数据兼容**：YAML 存储保持英文，与原版完全兼容
- ✅ **术语统一**：项目/任务/里程碑/负责人 等术语与 Obsidian 中文社区保持一致
- ✅ **i18n 校验**：内置翻译完整性检查脚本，确保无遗漏

---

## 功能总览

- **纯文本数据** — 项目和任务以 `.md` 文件形式存在于你的 vault 中。便携、可搜索、可版本控制。永不锁定。
- **三种强大视图** — 表格、甘特图、看板。自由切换；同一数据，不同视角。
- **真正的项目管理** — 不只是复选框。依赖关系、里程碑、子任务、时间追踪、循环任务、智能调度、批量操作。
- **完全可定制** — 自定义字段、状态、优先级、已保存视图——让工具适应你的工作流。
- **离线工作** — 无需云端、无需 API 调用、无需账号。只需 Obsidian。

<img width="1422" height="791" alt="Project Manager dashboard" src="https://github.com/user-attachments/assets/ca6bc67f-e656-45be-b93a-17410555ec1a" />

---

## 视图

### 表格视图

可排序、可筛选的任务网格，支持内联编辑。将自定义筛选/排序组合保存为已命名视图。从顶栏快速添加任务。多选任务并执行批量操作——一次性更改状态、优先级、负责人或删除。

<video src="https://github.com/user-attachments/assets/104bd993-d4c1-42e7-9d6a-ae46fd7ce6a8" autoplay loop muted playsinline width="400"></video>

### 甘特图

交互式时间线，支持可拖动条、可调整边缘和依赖箭头。缩放级别从日到季度。拖动重新调度，调整大小修改持续时间。里程碑以菱形显示。"今天"线帮助你定位。

<video src="https://github.com/user-attachments/assets/916f7100-44ef-401c-abb3-e003a0f7720a" autoplay loop muted playsinline width="400"></video>

### 看板

按状态分组的卡片式看板。拖动卡片到不同列即可即时更新状态。卡片一目了然地显示优先级、负责人和标签。

<video src="https://github.com/user-attachments/assets/316fc43b-6915-499a-a6ad-0680c462d014" autoplay loop muted playsinline width="400"></video>

---

## 功能详情

### 任务管理

- **子任务** — 任务可嵌套到任意深度。在所有视图中折叠/展开层级。
- **依赖关系** — 链接阻塞/依赖任务。在甘特图上以箭头可视化。
- **里程碑** — 零持续时间任务，用于关键日期和交付物。
- **归档** — 归档已完成的任务而不删除。可随时切换可见性。

### 调度与时间

- **拖拽调度** — 在甘特图上拖动条即可重新调度任务。
- **智能调度** — 当阻塞任务日期变更时，自动调整依赖任务的日期。循环检测防止循环依赖。
- **循环任务** — 日/周/月/年循环，可配置结束日期。
- **时间估算与记录** — 设置预估工时，记录实际工时并附加日期和备注。可视化进度条显示已记录 vs. 预估。
- **截止日期通知** — 任务到期前获得提醒。可配置提前天数。

### 自定义

- **自定义字段** — 按项目添加字段：文本、数字、日期、单选、多选、人员、复选框、链接。
- **自定义状态与优先级** — 编辑每个状态和优先级的标签、颜色和图标。
- **已保存视图** — 在表格视图中保存筛选/排序组合，一键切换。
- **团队成员** — 管理全局人员列表，用于所有项目的任务分配，以及每个项目的独立成员列表。

### 批量操作

在表格视图中多选任务，执行批量操作：
- 设置状态、优先级、负责人、标签或截止日期
- 调整进度
- 归档/取消归档
- 设置父任务
- 删除

### 导入

可以将 vault 中任何已有笔记添加为项目任务。在命令面板中运行 **Project Manager: 导入笔记为任务**，选择项目、选择文件，然后选择默认状态、默认优先级，以及是将文件**移动**到任务文件夹还是**复制**它们。已导入的笔记会被自动跳过。

- 如果已打开项目视图，导入会自动针对该项目（不显示选择器）。
- 如果没有打开项目视图，先显示项目选择器，然后显示导入弹窗。

还可以从笔记创建项目。在任何笔记的 frontmatter 中添加 `pm-project: true`，然后运行 **以项目方式打开当前文件**。

---

## 团队协作

Vault 就是数据库。任何能同步 vault 的方式都能同步你的项目。

**Git** 运行良好。提交你的 Projects 文件夹，推送，拉取。同步冲突会显示为常规的 Markdown 冲突，像任何其他文件一样解决。
**Obsidian Sync、iCloud、Dropbox、Syncthing** 无需额外设置即可使用。

团队使用：
- 在 **设置 > 团队成员** 中添加人员，或在项目弹窗中添加到项目的成员列表
- 通过负责人字段分配任务。在表格视图中按负责人筛选
- 通知是本地的。每个人看到自己的截止日期提醒

不支持实时多人编辑。两人同时编辑同一任务会产生同步冲突，与任何 Markdown 笔记相同。

---

## 设置

| 设置项 | 说明 |
|---|---|
| 项目文件夹 | 项目和任务文件存储的 vault 文件夹 |
| 默认视图 | 表格、甘特图或看板 |
| 甘特图粒度 | 默认时间线刻度（日/周/月/季度） |
| 甘特图周标签 | 周数、日期范围或两者 |
| 截止日期通知 | 截止日期前 N 天的提醒 |
| 自动调度 | 当阻塞任务移动时，依赖任务自动调整。拒绝循环依赖 |
| 在看板中显示子任务 | 将子任务渲染为独立卡片 |
| 关闭时保存任务 | 关闭任务弹窗时自动保存 |
| 自定义状态 | 编辑每个状态的标签、颜色和图标 |
| 自定义优先级 | 编辑每个优先级的标签、颜色和图标 |
| 团队成员 | 用于任务分配的全局人员列表 |
| **Language / 语言** | 界面显示语言（English / 简体中文） |

---

## 任务属性

每个任务是一个 `.md` 文件，支持以下属性：

| 属性 | 说明 |
|---|---|
| 标题 | 任务名称 |
| 描述 | 富文本正文（Markdown） |
| 类型 | 任务、子任务或里程碑 |
| 状态 | 待办、进行中、已阻塞、审核中、已完成、已取消 |
| 优先级 | 紧急、高、中、低 |
| 开始/截止日期 | 调度边界 |
| 进度 | 0–100% 完成度 |
| 时间估算 | 预估工时 |
| 时间记录 | 已记录工时，附带日期和备注 |
| 负责人 | 一个或多个团队成员 |
| 标签 | 自由标签 |
| 子任务 | 嵌套子任务 |
| 依赖 | 阻塞/依赖任务链接 |
| 循环 | 重复间隔和结束日期 |
| 自定义字段 | 你定义的任何按项目字段 |

---

## 安装

### 方式 A：BRAT 插件（推荐，支持自动更新）

1. 从社区插件商店安装 [BRAT 插件](https://github.com/TfTHacker/obsidian42-brat)
2. 打开 BRAT 设置 > **Add Beta Plugin**
3. 输入：`https://github.com/sleepingEARs/obsidian-project-manager-zhCN`
4. 在 **设置 > 社区插件** 中启用插件

### 方式 B：手动安装

1. 从 [最新 Release](../../releases/latest) 下载 `main.js`、`manifest.json`、`styles.css`
2. 创建文件夹：`<vault>/.obsidian/plugins/project-manager-zhCN/`
3. 将三个文件复制到该文件夹
4. 重新加载 Obsidian，在 **设置 > 社区插件** 下启用

> **注意**：插件 ID 为 `project-manager-zhCN`，与原版 `project-manager` 不同，可以**同时安装**两个版本。

---

## 快速开始

1. 点击侧边栏的项目管理器图标（或从命令面板运行 **打开项目面板**）
2. 点击 **新建项目** 创建你的第一个项目。给它一个名称、颜色和图标
3. 打开项目——默认以表格视图打开
4. 按 **+ 添加任务** 创建你的第一个任务
5. 使用顶部的 表格/甘特图/看板 标签切换视图

**命令列表：**

| 命令 | 功能 |
|---|---|
| 打开项目面板 | 打开项目列表 |
| 创建新项目 | 打开新建项目弹窗 |
| 创建新任务 | 选择项目后创建任务 |
| 创建新子任务 | 选择项目和父任务 |
| 导入笔记为任务 | 将 Markdown 笔记转换为任务 |
| 以项目方式打开当前文件 | 将当前笔记作为项目打开（需要 `pm-project: true`） |
| 撤销上一步 | 回退上一次更改 |
| 重做上一步 | 重新应用已撤销的更改 |

---

## 数据格式

所有内容以 Markdown 文件 + YAML frontmatter 的形式存储在可配置的 vault 文件夹中（默认：`Projects/`）。纯文本——可读、便携、可版本控制。

```yaml
---
pm-task: true
title: "发布 v1.0"
status: in-progress
priority: high
due: "2026-04-01"
progress: 60
assignees: ["alice", "bob"]
tags: ["launch"]
dependencies: ["task-abc123"]
---

任务描述（Markdown 格式）。
```

> **重要**：YAML 中的状态/优先级值始终为英文（如 `in-progress`、`high`），以保证与原版的数据兼容性。中文翻译仅在 UI 渲染层显示。

---

## 语言切换

```
Obsidian 设置 → 第三方插件 → Project Manager (zhCN) → 设置 ⚙️
     └── Language / 语言 → 选择「简体中文」或「English」
```

切换后视图将自动重载以应用新语言。

---

## 要求

- Obsidian **1.7.2** 或更高版本
- 支持桌面端和移动端

---

## 致谢

- **原作者**：[Stepan Kropachev](https://github.com/StepanKropachev) — 感谢创造了这个优秀的项目管理插件
- **开源协议**：本项目遵循原项目的 MIT License

---

## 贡献

如果你想贡献翻译改进或 Bug 修复：

1. **先提 Issue**：在提交 PR 之前，请先在 Issue 中讨论
2. **保持代码风格**：代码应与现有项目风格一致
3. **通过 CI**：确保代码通过所有类型检查、linter 和测试。本地运行 `pnpm check` 和 `pnpm test`
4. **保持精简**：PR 应专注于单一问题

Bug 修复和经过充分讨论的功能改进欢迎提交！

---

## 许可证

MIT License

本项目基于 [StepanKropachev/obsidian-pm](https://github.com/StepanKropachev/obsidian-pm)（MIT License）汉化修改。
原始 MIT License 和版权声明保留在 LICENSE 文件中。
