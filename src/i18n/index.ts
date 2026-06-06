import type { Locale } from '../types'
import type { PMSettings } from '../types'

export type TranslationDict = Record<string, string>
export type TranslateFn = (key: string, vars?: Record<string, string | number>) => string

/** 将 {var} 占位符替换为实际值 */
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`
  )
}

/** 创建翻译函数：英文模式零开销，中文模式一次字典查找 + 插值 */
export function createTranslator(settings: PMSettings): TranslateFn {
  const locale = settings.language ?? 'en'
  const dict = locale === 'zh-CN' ? zhCN : undefined
  if (!dict) return (key, vars) => interpolate(key, vars)
  return (key, vars) => interpolate(dict[key] ?? key, vars)
}

// ─── 简体中文翻译字典 ─────────────────────────────────────────────────────────

const zhCN: TranslationDict = {
  // === 4.1 设置面板 ===
  'Projects folder': '项目文件夹',
  'Vault folder where project files are stored.': '存储项目文件的 vault 文件夹。',
  'Default view': '默认视图',
  'Which view opens when you open a project.': '打开项目时显示的视图。',
  'Table': '表格',
  'Gantt': '甘特图',
  'Board': '看板',
  'Default gantt granularity': '默认甘特图粒度',
  'Day': '日',
  'Week': '周',
  'Month': '月',
  'Quarter': '季度',
  'Gantt week label': '甘特图周标签',
  'What to display in weekly gantt header cells.': '周视图标题单元格中显示的内容。',
  'Week number (w15)': '周数 (w15)',
  'Date range (apr 7–13)': '日期范围 (4月7–13)',
  'Both (w15: apr 7–13)': '两者 (w15: 4月7–13)',
  'Show subtasks on board': '在看板中显示子任务',
  'Display subtasks as individual cards on the kanban board.': '在看板上以独立卡片形式显示子任务。',
  'Save tasks on close': '关闭时保存任务',
  'Automatically save tasks when you close the task modal. When off, only clicking save persists changes.':
    '关闭任务弹窗时自动保存。关闭后仅在点击保存按钮时保存。',
  'Due date notifications': '到期通知',
  'Enable notifications': '启用通知',
  'Show a banner when tasks are approaching their due date.': '任务接近截止日期时显示通知。',
  'Lead time (days)': '提前通知天数',
  'How many days before the due date to show the notification.': '提前多少天显示到期通知。',
  'Scheduling': '调度',
  'Auto-schedule': '自动调度',
  'Automatically adjust dependent task dates when a task changes.': '任务变更时自动调整依赖任务的日期。',
  'Team members': '团队成员',
  'Global list of people available as assignees across all projects.': '跨项目可用的全局人员列表。',
  '+ add member': '+ 添加成员',
  'Name': '姓名',
  'Statuses': '状态',
  'Customize status labels, colors, and icons. Drag to reorder.': '自定义状态标签、颜色和图标。拖动排序。',
  'New status': '新状态',
  '+ add status': '+ 添加状态',
  'You must have at least one status.': '至少需要保留一个状态。',
  "Remapped {count} task(s) from '{old}' to '{new}'.":
    '已将 {count} 个任务从「{old}」重新映射到「{new}」。',

  // === 4.2 默认状态与优先级 ===
  'To Do': '待办',
  'In Progress': '进行中',
  'Blocked': '已阻塞',
  'In Review': '审核中',
  'Done': '已完成',
  'Cancelled': '已取消',
  'Terminal status': '终结状态',
  'Critical': '紧急',
  'High': '高',
  'Medium': '中',
  'Low': '低',

  // === 4.3 仪表盘与项目列表 ===
  'Projects': '项目',
  'Project manager': '项目管理',
  'No projects yet': '暂无项目',
  'Create your first project to get started.': '创建第一个项目以开始使用。',
  '+ new project': '+ 新建项目',
  'New project': '新建项目',
  'Edit project': '编辑项目',
  'Delete project': '删除项目',
  'Project not found': '未找到项目',
  'No project at {path}. It may have been deleted or renamed.':
    '路径 {path} 下未找到项目。它可能已被删除或重命名。',

  // === 4.4 项目视图与工具栏 ===
  'Project': '项目',
  'Project settings': '项目设置',
  '+ add task': '+ 添加任务',
  '+ milestone': '+ 里程碑',

  // === 4.5 项目卡片 ===
  '{done}/{total} tasks': '{done}/{total} 个任务',

  // === 4.6 任务弹窗 ===
  'New Task': '新任务',
  'Edit Task': '编辑任务',
  'Save': '保存',
  'Cancel': '取消',
  'Title': '标题',
  'Description': '描述',
  'Type': '类型',
  'Status': '状态',
  'Priority': '优先级',
  'Start date': '开始日期',
  'Due date': '截止日期',
  'Progress': '进度',
  'Assignees': '负责人',
  'Tags': '标签',
  'Dependencies': '依赖',
  'Subtasks': '子任务',
  'Time tracking': '时间追踪',
  'Recurrence': '重复',
  'Custom fields': '自定义字段',
  'Task': '任务',
  'Milestone': '里程碑',
  'Subtask': '子任务',
  'Task title…': '任务标题…',
  'Open as note': '作为笔记打开',
  'Add a description…': '添加描述…',
  'Unarchive': '取消归档',
  'Archive': '归档',
  'Delete': '删除',
  'Create (Shift+Enter)': '创建 (Shift+Enter)',
  'Save (Shift+Enter)': '保存 (Shift+Enter)',
  'Task archived': '任务已归档',
  'Task unarchived': '任务已取消归档',
  'Failed to save attachment': '保存附件失败',
  'Something went wrong. Check the console for details.': '发生错误，请查看控制台了解详情。',
  'Delete "{title}"?': '确定删除「{title}」？',
  'Task not saved: a note named "{file}" already exists.':
    '任务未保存：名为「{file}」的笔记已存在。',
  'A note named "{file}" already exists. Choose a different title.':
    '名为「{file}」的笔记已存在，请使用其他标题。',

  // === 4.7 项目弹窗 ===
  'Project name': '项目名称',
  'My awesome project': '我的项目',
  'Color': '颜色',
  'Custom color': '自定义颜色',
  'What is this project about?': '这个项目是关于什么的？',
  'Extra properties for tasks': '任务的自定义属性',
  '+ add custom field': '+ 添加自定义字段',
  'New Field': '新字段',
  'Field name': '字段名称',
  '+ option': '+ 选项',
  '+ Create project': '+ 创建项目',
  'Text': '文本',
  'Number': '数字',
  'Date': '日期',
  'Select': '单选',
  'Multi-select': '多选',
  'Person': '人员',
  'Checkbox': '复选框',
  'URL': '链接',
  'Person name': '人员姓名',

  // === 4.8 导入 ===
  'Select notes to import': '选择要导入的笔记',
  'Search files…': '搜索文件…',
  'Select all': '全选',
  'Next': '下一步',
  'Import options': '导入选项',
  'Default status': '默认状态',
  'Default priority': '默认优先级',
  'File handling': '文件处理',
  'Move to tasks folder (default)': '移动到任务文件夹（默认）',
  'Copy (keep original)': '复制（保留原文件）',
  'Back': '返回',
  'Import ({count})': '导入 ({count})',
  '{count} selected': '已选择 {count} 项',
  'Error: project not set for import': '错误：未设置导入目标项目',
  'Imported {count} task(s).': '已导入 {count} 个任务。',
  '({count} skipped)': '({count} 个已跳过)',
  'Error during import. Check console for details.': '导入时发生错误，请查看控制台了解详情。',
  'Import notes as tasks': '导入笔记为任务',

  // === 4.9 时间追踪 ===
  'Time tracking ({logged}h / {est}h)': '时间追踪（已记录 {logged}小时 / 预估 {est}小时）',
  'Time tracking ({logged}h logged)': '时间追踪（已记录 {logged}小时）',
  'Estimate:': '预估：',
  'Hours': '小时',
  'Note…': '备注…',
  '+ log time': '+ 记录时间',

  // === 4.10 重复任务 ===
  'Interval': '间隔',
  'Every': '每',
  'daily': '天',
  'weekly': '周',
  'monthly': '月',
  'yearly': '年',
  'End date': '结束日期',
  'Repeat': '重复',
  '+ set recurrence': '+ 设置重复',
  'Until': '直到',

  // === 4.11 子任务面板 ===
  'Subtasks ({count})': '子任务 ({count})',
  '+ add': '+ 添加',
  'New subtask': '新子任务',

  // === 4.12 任务表单字段 ===
  'Parent task': '父任务',
  '— Select parent —': '— 选择父任务 —',
  'Start': '开始',
  'Due': '截止',
  'Name…': '姓名…',
  'Type a name…': '输入姓名…',
  '+ tag': '+ 标签',
  'Depends on': '依赖于',
  'Search tasks to add as dependency…': '搜索要添加为依赖的任务…',
  '+ Add dependency': '+ 添加依赖',

  // === 4.13 右键菜单与操作 ===
  'Edit task': '编辑任务',
  'Add subtask': '添加子任务',
  'Duplicate task': '复制任务',
  'Delete task': '删除任务',
  'Set status': '设置状态',
  'Set priority': '设置优先级',
  'Set assignee': '设置负责人',
  'Set tag': '设置标签',
  'Set due date': '设置截止日期',
  'Set progress': '设置进度',
  'Set parent': '设置父任务',
  'Remove parent': '移除父任务',
  'Task actions': '任务操作',

  // === 4.14 批量操作栏 ===
  '+ new assignee…': '+ 新负责人…',
  'Enter assignee name:': '输入负责人姓名：',
  'Clear assignees': '清除负责人',
  '+ new tag…': '+ 新标签…',
  'Enter tag:': '输入标签：',
  'Tag': '标签',
  'Clear tags': '清除标签',
  'Today ({date})': '今天 ({date})',
  'Tomorrow ({date})': '明天 ({date})',
  'In 1 week ({date})': '1 周后 ({date})',
  'In 2 weeks ({date})': '2 周后 ({date})',
  'Pick date…': '选择日期…',
  'Clear due date': '清除截止日期',
  'Clear selection': '取消选择',

  // === 4.15 过滤 ===
  'Filter': '筛选',
  'Search tasks…': '搜索任务…',
  'All': '全部',
  'Toggle filter row': '切换筛选行',
  'Clear': '清除',
  'Filter by {label}': '按{label}筛选',
  'Overdue': '已逾期',
  'This week': '本周',
  'This month': '本月',
  'No date': '无日期',
  'Assignee': '负责人',
  'Due: {label}': '截止：{label}',
  'Archived': '已归档',
  'Clear ({count})': '清除 ({count})',
  '+ save view': '+ 保存视图',
  'View name…': '视图名称…',
  'Update with current filters': '使用当前筛选条件更新',
  'Delete view': '删除视图',
  'Show archived': '显示已归档',
  'Saved views': '已保存视图',
  'Save current view': '保存当前视图',

  // === 4.16 表格视图 ===
  'Sort by': '排序',
  'Sort by {label}': '按{label}排序',
  'Time': '时间',
  '{count} task': '{count} 个任务',
  '{count} tasks': '{count} 个任务',
  'Moved {count} under new parent': '已将 {count} 项移至新父任务下',
  'Moved {count} to top level': '已将 {count} 项移至顶层',
  'Archived {count}': '已归档 {count} 项',
  'Unarchived {count}': '已取消归档 {count} 项',
  'Delete {count}? This cannot be undone.': '确定删除 {count} 项？此操作不可撤销。',
  'Bulk action failed. Please try again.': '批量操作失败，请重试。',

  // === 4.17 甘特图 ===
  'Today': '今天',
  'Expand all': '全部展开',
  'Collapse all': '全部收起',
  'Click to set dates': '点击设置日期',
  'Failed to set task dates. Please try again.': '设置任务日期失败，请重试。',
  'Failed to save date change. Please try again.': '保存日期变更失败，请重试。',
  'Dates reverted. Dependent task dates may need adjustment.':
    '日期已回退。依赖任务的日期可能需要调整。',
  'Connect a right dot (output) to a left dot (input).':
    '请将右侧圆点（输出）连接到左侧圆点（输入）。',
  'This dependency already exists.': '该依赖关系已存在。',
  'Reverse dependency exists — would create a cycle.': '存在反向依赖——将形成循环。',
  'Failed to save dependency.': '保存依赖关系失败。',
  '{title}\n{status} · {priority}\nStart: {start}  Due: {due}\nProgress: {progress}%\nAssignees: {assignees}':
    '{title}\n{status} · {priority}\n开始：{start}  截止：{due}\n进度：{progress}%\n负责人：{assignees}',
  '{title}\n{status} · {priority}\nStart: {start}  Due: {due}\nProgress: {progress}%':
    '{title}\n{status} · {priority}\n开始：{start}  截止：{due}\n进度：{progress}%',
  '{title} (milestone)\nDate: {date}': '{title}（里程碑）\n日期：{date}',
  'R': '重',
  'W{num}': '第{num}周',
  'W{num}: {range}': '第{num}周：{range}',
  'Q{q} {year}': '{year}年Q{q}',

  // === 4.18 看板 ===
  'Recurring': '循环',
  '+ Add': '+ 添加',
  '{done}/{total} subtasks': '{done}/{total} 个子任务',

  // === 4.20 标题列徽章与无障碍标签 ===
  'Expand subtasks': '展开子任务',
  'Collapse subtasks': '折叠子任务',

  // === 4.21 命令面板 ===
  'Open projects pane': '打开项目面板',
  'Create new project': '创建新项目',
  'Create new task': '创建新任务',
  'Create new subtask': '创建新子任务',
  'Undo last action': '撤销上一步',
  'Redo last action': '重做上一步',
  'Open current file as project': '以项目方式打开当前文件',

  // === 4.22 通知 ===
  '⚠️ Overdue: "{task}" in {project} was due {days}d ago':
    '⚠️ 已逾期：「{task}」（{project}）已于 {days} 天前到期',
  '📅 Due today: "{task}" in {project}': '📅 今日到期：「{task}」（{project}）',
  '📅 Due in {days}d: "{task}" in {project}': '📅 距到期 {days} 天：「{task}」（{project}）',

  // === 4.23 通用对话框 ===
  'OK': '确定',
  'Duplicate "{title}" with its subtasks?': '是否复制「{title}」及其子任务？',
  'Task only': '仅任务',
  'With subtasks': '含子任务',
  'Confirm': '确认',
  'This cannot be undone.': '此操作不可撤销。',
  'Pick a project…': '选择项目…',
  'Pick a parent task…': '选择父任务…',
  'Search or create a tag…': '搜索或创建标签…',
  'Create: {tag}': '创建：{tag}',

  // === 4.24 迁移 ===
  'Migrating project: {title}…': '正在迁移项目：{title}…',
  'Project Manager: Migration failed for "{file}". Check console for details.':
    '项目管理器：迁移「{file}」失败，请查看控制台了解详情。',
  'Project Manager: Migrated {count} project(s) to new format.':
    '项目管理器：已将 {count} 个项目迁移到新格式。',

  // === 4.25 数据存储层错误 ===
  'Project Manager: Failed to load "{file}". Check console for details.':
    '项目管理器：加载「{file}」失败，请查看控制台了解详情。',
  'Project Manager: Failed to load task "{file}". Check console for details.':
    '项目管理器：加载任务「{file}」失败，请查看控制台了解详情。',
  'Project Manager: Failed to save "{title}". Check console for details.':
    '项目管理器：保存「{title}」失败，请查看控制台了解详情。',
  'A note named "{file}" already exists.': '名为「{file}」的笔记已存在。',
  '{title} (copy)': '{title}（副本）',

  // === 4.26 通用 ===
  'No projects yet. Create a project first.': '暂无项目，请先创建一个项目。',
  'No tasks in this project. Create a task first.': '该项目暂无任务，请先创建一个任务。',

  // === 4.27 文件类型标签 ===
  'Canvas': '画布',
  'Database': '数据库',

  // === 自定义字段选项 ===
  'Option {num}': '选项 {num}',
}
