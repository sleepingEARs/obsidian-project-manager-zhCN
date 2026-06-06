import type { Task, PriorityConfig, TaskPriority } from '../../../types'
import { getPriorityConfig } from '../../../utils'
import { renderPriorityBadge } from '../../StatusBadge'
import type { TranslateFn } from '../../../i18n'

export interface PriorityCellProps {
  task: Task
  priorities: PriorityConfig[]
  onChange: (priority: TaskPriority) => void
  t?: TranslateFn
}

export class PriorityCell {
  el: HTMLTableCellElement

  constructor(parentRow: HTMLElement, props: PriorityCellProps) {
    this.el = parentRow.createEl('td', { cls: 'pm-table-cell' })
    if (getPriorityConfig(props.priorities, props.task.priority)) {
      renderPriorityBadge(this.el, props.task, props.priorities, props.onChange, props.t)
    }
  }
}
