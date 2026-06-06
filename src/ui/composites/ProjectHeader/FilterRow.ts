import { ButtonComponent, Menu } from 'obsidian'
import type { Project, FilterState, StatusConfig, PriorityConfig, TaskPriority, DueDateFilter } from '../../../types'
import type { TranslateFn } from '../../../i18n'
import { collectAllAssignees, collectAllTags } from '../../../store'
import { countActiveFilters } from '../../../store/TaskFilter'
import { renderFilterDropdown } from '../../FilterDropdown'
import { Pill } from '../../primitives/Pill'
import { formatBadgeText } from '../../../utils'

export interface FilterRowProps {
  project: Project
  statuses: StatusConfig[]
  priorities: PriorityConfig[]
  filter: FilterState
  onFilterChange: () => void
  onClear: () => void
  t?: TranslateFn
}

const DUE_LABELS: Record<DueDateFilter, string> = {
  any: 'Due date',
  overdue: 'Overdue',
  'this-week': 'This week',
  'this-month': 'This month',
  'no-date': 'No date'
}

export class FilterRow {
  el: HTMLElement
  private clearBtn: ButtonComponent | null = null

  constructor(
    parentEl: HTMLElement,
    private props: FilterRowProps
  ) {
    this.el = parentEl.createDiv('pm-project-header-filter')
    this.render()
  }

  private render(): void {
    this.el.empty()
    const { filter, statuses, priorities, project, t } = this.props
    const translate = t ?? ((key: string) => key)

    const notify = () => {
      this.props.onFilterChange()
      this.updateClearButton()
    }

    renderFilterDropdown(
      this.el,
      translate('Status'),
      filter.statuses,
      statuses.map((s) => ({ id: s.id, label: formatBadgeText(s.icon, translate(s.label)) })),
      (selected) => {
        filter.statuses = selected
        notify()
      },
      translate
    )

    renderFilterDropdown(
      this.el,
      translate('Priority'),
      filter.priorities,
      priorities.map((p) => ({ id: p.id, label: formatBadgeText(p.icon, translate(p.label)) })),
      (selected) => {
        filter.priorities = selected as TaskPriority[]
        notify()
      },
      translate
    )

    const allAssignees = collectAllAssignees(project.tasks)
    if (allAssignees.length) {
      renderFilterDropdown(
        this.el,
        translate('Assignee'),
        filter.assignees,
        allAssignees.map((a) => ({ id: a, label: a })),
        (selected) => {
          filter.assignees = selected
          notify()
        },
        translate
      )
    }

    const allTags = collectAllTags(project.tasks)
    if (allTags.length) {
      renderFilterDropdown(
        this.el,
        translate('Tag'),
        filter.tags,
        allTags.map((t) => ({ id: t, label: t })),
        (selected) => {
          filter.tags = selected
          notify()
        },
        translate
      )
    }

    this.renderDueDatePill(notify)
    this.renderArchivedPill(notify)
    this.renderClearButton()
  }

  private renderDueDatePill(notify: () => void): void {
    const { filter } = this.props
    const translate = this.props.t ?? ((key: string) => key)
    const pill = new Pill(this.el)
    const updateLabel = () => {
      const current = filter.dueDateFilter
      const label = current !== 'any' ? translate('Due: {label}', { label: translate(DUE_LABELS[current]) }) : translate(DUE_LABELS.any)
      pill.setLabel(label).setActive(current !== 'any')
    }
    updateLabel()
    pill.onClick((e) => {
      const menu = new Menu()
      const opts: DueDateFilter[] = ['any', 'overdue', 'this-week', 'this-month', 'no-date']
      for (const opt of opts) {
        menu.addItem((item) =>
          item
            .setTitle(translate(DUE_LABELS[opt]))
            .setChecked(filter.dueDateFilter === opt)
            .onClick(() => {
              filter.dueDateFilter = opt
              updateLabel()
              notify()
            })
        )
      }
      menu.showAtMouseEvent(e)
    })
  }

  private renderArchivedPill(notify: () => void): void {
    const { filter } = this.props
    const translate = this.props.t ?? ((key: string) => key)
    const pill = new Pill(this.el).setLabel(translate('Archived')).setActive(filter.showArchived)
    pill.onClick(() => {
      filter.showArchived = !filter.showArchived
      pill.setActive(filter.showArchived)
      notify()
    })
  }

  private renderClearButton(): void {
    const count = countActiveFilters(this.props.filter)
    if (count === 0) {
      this.clearBtn = null
      return
    }
    const translate = this.props.t ?? ((key: string) => key)
    this.clearBtn = new ButtonComponent(this.el).setButtonText(translate('Clear ({count})', { count })).onClick(() => {
      this.props.onClear()
    })
  }

  refreshClearButton(): void {
    this.updateClearButton()
  }

  private updateClearButton(): void {
    if (this.clearBtn) {
      this.clearBtn.buttonEl.remove()
      this.clearBtn = null
    }
    this.renderClearButton()
  }
}
