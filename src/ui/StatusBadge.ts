import { Menu } from 'obsidian'
import type { Task, TaskStatus, TaskPriority, StatusConfig, PriorityConfig } from '../types'
import { COLOR_MUTED, COLOR_MUTED_ALT } from '../constants'
import { getStatusConfig, getPriorityConfig, formatBadgeText } from '../utils'
import { Badge } from './primitives/Badge'
import type { TranslateFn } from '../i18n'

export function renderStatusBadge(
  container: HTMLElement,
  task: Task,
  statuses: StatusConfig[],
  onChange: (status: TaskStatus) => void,
  t?: TranslateFn
): HTMLElement {
  const config = getStatusConfig(statuses, task.status)
  const label = t ? t(config?.label ?? task.status) : (config?.label ?? task.status)
  const badge = new Badge(container)
    .setLabel(formatBadgeText(config?.icon, label))
    .setColor(config?.color ?? COLOR_MUTED)
    .onClick((e) => {
      const menu = new Menu()
      for (const s of statuses) {
        menu.addItem((item) =>
          item
            .setTitle(formatBadgeText(s.icon, t ? t(s.label) : s.label))
            .setChecked(s.id === task.status)
            .onClick(() => onChange(s.id))
        )
      }
      menu.showAtMouseEvent(e)
    })
  return badge.el
}

export function renderPriorityBadge(
  container: HTMLElement,
  task: Task,
  priorities: PriorityConfig[],
  onChange: (priority: TaskPriority) => void,
  t?: TranslateFn
): HTMLElement {
  const config = getPriorityConfig(priorities, task.priority)
  const label = t ? t(config?.label ?? task.priority) : (config?.label ?? task.priority)
  const badge = new Badge(container)
    .setLabel(formatBadgeText(config?.icon, label))
    .setColor(config?.color ?? COLOR_MUTED_ALT)
    .onClick((e) => {
      const menu = new Menu()
      for (const p of priorities) {
        menu.addItem((item) =>
          item
            .setTitle(formatBadgeText(p.icon, t ? t(p.label) : p.label))
            .setChecked(p.id === task.priority)
            .onClick(() => onChange(p.id))
        )
      }
      menu.showAtMouseEvent(e)
    })
  return badge.el
}

export function renderStatusDot(
  container: HTMLElement,
  status: TaskStatus,
  statuses: StatusConfig[],
  cls = 'pm-subtask-dot'
): HTMLElement {
  const config = getStatusConfig(statuses, status)
  const dot = container.createSpan({ cls })
  dot.style.background = config?.color ?? COLOR_MUTED
  return dot
}
