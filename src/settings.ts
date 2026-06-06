import { App, PluginSettingTab, Setting, Notice } from 'obsidian'
import type PMPlugin from './main'
import { PMSettings, DEFAULT_SETTINGS, Locale, makeId } from './types'
import { flattenTasks } from './store/TaskTreeOps'

export type { PMSettings }
export { DEFAULT_SETTINGS }

export class PMSettingTab extends PluginSettingTab {
  plugin: PMPlugin

  constructor(app: App, plugin: PMPlugin) {
    super(app, plugin)
    this.plugin = plugin
  }

  display(): void {
    const { containerEl } = this
    containerEl.empty()
    containerEl.addClass('pm-settings')

    const t = this.plugin.t.bind(this.plugin)

    // ── General ──────────────────────────────────────────────────────────────
    new Setting(containerEl)
      .setName('Language / 语言')
      .setDesc(
        'Interface display language. Changing this will reload the views. 界面显示语言，切换后将重载视图。'
      )
      .addDropdown((dd) =>
        dd
          .addOption('en', 'English')
          .addOption('zh-CN', '简体中文')
          .setValue(this.plugin.settings.language ?? 'en')
          .onChange(async (v) => {
            this.plugin.settings.language = v as Locale
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName(t('Projects folder'))
      .setDesc(t('Vault folder where project files are stored.'))
      .addText((text) =>
        text
          .setPlaceholder('Projects')
          .setValue(this.plugin.settings.projectsFolder)
          .onChange(async (v) => {
            this.plugin.settings.projectsFolder = v.trim() || 'Projects'
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName(t('Default view'))
      .setDesc(t('Which view opens when you open a project.'))
      .addDropdown((dd) =>
        dd
          .addOption('table', t('Table'))
          .addOption('gantt', t('Gantt'))
          .addOption('kanban', t('Board'))
          .setValue(this.plugin.settings.defaultView)
          .onChange(async (v) => {
            this.plugin.settings.defaultView = v as PMSettings['defaultView']
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName(t('Default gantt granularity'))
      .addDropdown((dd) =>
        dd
          .addOption('day', t('Day'))
          .addOption('week', t('Week'))
          .addOption('month', t('Month'))
          .addOption('quarter', t('Quarter'))
          .setValue(this.plugin.settings.ganttGranularity)
          .onChange(async (v) => {
            this.plugin.settings.ganttGranularity = v as PMSettings['ganttGranularity']
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName(t('Gantt week label'))
      .setDesc(t('What to display in weekly gantt header cells.'))
      .addDropdown((dd) =>
        dd
          .addOption('weekNumber', t('Week number (w15)'))
          .addOption('dateRange', t('Date range (apr 7–13)'))
          .addOption('both', t('Both (w15: apr 7–13)'))
          .setValue(this.plugin.settings.ganttWeekLabel)
          .onChange(async (v) => {
            this.plugin.settings.ganttWeekLabel = v as PMSettings['ganttWeekLabel']
            await this.plugin.saveSettings()
          })
      )

    new Setting(containerEl)
      .setName(t('Show subtasks on board'))
      .setDesc(t('Display subtasks as individual cards on the kanban board.'))
      .addToggle((t) =>
        t.setValue(this.plugin.settings.kanbanShowSubtasks).onChange(async (v) => {
          this.plugin.settings.kanbanShowSubtasks = v
          await this.plugin.saveSettings()
        })
      )

    new Setting(containerEl)
      .setName(t('Save tasks on close'))
      .setDesc(
        t(
          'Automatically save tasks when you close the task modal. When off, only clicking save persists changes.'
        )
      )
      .addToggle((t) =>
        t.setValue(this.plugin.settings.saveTaskOnClose).onChange(async (v) => {
          this.plugin.settings.saveTaskOnClose = v
          await this.plugin.saveSettings()
        })
      )

    // ── Notifications ─────────────────────────────────────────────────────────
    new Setting(containerEl).setName(t('Due date notifications')).setHeading()

    new Setting(containerEl)
      .setName(t('Enable notifications'))
      .setDesc(t('Show a banner when tasks are approaching their due date.'))
      .addToggle((t) =>
        t.setValue(this.plugin.settings.notificationsEnabled).onChange(async (v) => {
          this.plugin.settings.notificationsEnabled = v
          await this.plugin.saveSettings()
        })
      )

    new Setting(containerEl)
      .setName(t('Lead time (days)'))
      .setDesc(t('How many days before the due date to show the notification.'))
      .addSlider((sl) =>
        sl
          .setLimits(1, 14, 1)
          .setValue(this.plugin.settings.notificationLeadDays)
          .setDynamicTooltip()
          .onChange(async (v) => {
            this.plugin.settings.notificationLeadDays = v
            await this.plugin.saveSettings()
          })
      )

    // ── Scheduling ───────────────────────────────────────────────────────────
    new Setting(containerEl).setName(t('Scheduling')).setHeading()

    new Setting(containerEl)
      .setName(t('Auto-schedule'))
      .setDesc(t('Automatically adjust dependent task dates when a task changes.'))
      .addToggle((t) =>
        t.setValue(this.plugin.settings.autoSchedule).onChange(async (v) => {
          this.plugin.settings.autoSchedule = v
          await this.plugin.saveSettings()
        })
      )

    // ── Team Members ──────────────────────────────────────────────────────────
    new Setting(containerEl).setName(t('Team members')).setHeading()

    containerEl.createEl('p', {
      cls: 'pm-settings-desc',
      text: t('Global list of people available as assignees across all projects.')
    })
    // margin handled by .pm-settings-desc CSS class

    const membersContainer = containerEl.createDiv('pm-settings-members')
    this.renderMembersList(membersContainer)

    new Setting(containerEl).addButton((btn) =>
      btn
        .setButtonText(t('+ add member'))
        .setCta()
        .onClick(() => {
          this.plugin.settings.globalTeamMembers.push('')
          void this.plugin.saveSettings()
          this.renderMembersList(membersContainer)
        })
    )

    // ── Statuses ──────────────────────────────────────────────────────────────
    new Setting(containerEl).setName(t('Statuses')).setHeading()
    containerEl.createEl('p', {
      cls: 'pm-settings-desc',
      text: t('Customize status labels, colors, and icons. Drag to reorder.')
    })

    const statusContainer = containerEl.createDiv('pm-settings-statuses')
    this.renderStatusList(statusContainer)

    new Setting(containerEl).addButton((btn) =>
      btn
        .setButtonText(t('+ add status'))
        .setCta()
        .onClick(() => {
          const id = 'status-' + makeId().slice(0, 6)
          this.plugin.settings.statuses.push({
            id,
            label: t('New status'),
            color: '#8a94a0',
            icon: '',
            complete: false
          })
          void this.plugin.saveSettings()
          this.renderStatusList(statusContainer)
        })
    )
  }

  private renderMembersList(container: HTMLElement): void {
    container.empty()
    const members = this.plugin.settings.globalTeamMembers
    const t = this.plugin.t.bind(this.plugin)
    members.forEach((m, i) => {
      const row = container.createDiv('pm-settings-member-row')
      const input = row.createEl('input', { type: 'text', value: m })
      input.placeholder = t('Name')
      input.addEventListener('change', () => {
        this.plugin.settings.globalTeamMembers[i] = input.value
        void this.plugin.saveSettings()
      })
      const del = row.createEl('button', { text: '✕' })
      del.addClass('pm-settings-del')
      del.addEventListener('click', () => {
        this.plugin.settings.globalTeamMembers.splice(i, 1)
        void this.plugin.saveSettings()
        this.renderMembersList(container)
      })
    })
  }

  private async remapOrphanTasks(deletedId: string, deletedLabel: string): Promise<void> {
    const statuses = this.plugin.settings.statuses
    if (statuses.length === 0) return
    const defaultStatus = statuses[0]
    const folder = this.plugin.settings.projectsFolder
    const projects = await this.plugin.store.loadAllProjects(folder)
    let remapped = 0
    for (const project of projects) {
      const flat = flattenTasks(project.tasks)
      let modified = false
      for (const { task } of flat) {
        if (task.status === deletedId) {
          task.status = defaultStatus.id
          task.updatedAt = new Date().toISOString()
          remapped++
          modified = true
        }
      }
      if (modified) {
        await this.plugin.store.saveProject(project)
      }
    }
    if (remapped > 0) {
      new Notice(
        this.plugin.t("Remapped {count} task(s) from '{old}' to '{new}'.", {
          count: remapped,
          old: deletedLabel,
          new: defaultStatus.label
        })
      )
    }
  }

  private renderStatusList(container: HTMLElement): void {
    container.empty()
    const t = this.plugin.t.bind(this.plugin)
    this.plugin.settings.statuses.forEach((s, i) => {
      const row = container.createDiv('pm-settings-status-row')

      // Drag handle
      row.createSpan({ text: '⠿', cls: 'pm-settings-drag-handle' })
      row.draggable = true
      row.addEventListener('dragstart', (e) => {
        e.dataTransfer?.setData('text/plain', String(i))
        row.addClass('pm-settings-row--dragging')
      })
      row.addEventListener('dragend', () => {
        row.removeClass('pm-settings-row--dragging')
      })
      row.addEventListener('dragover', (e) => {
        e.preventDefault()
      })
      row.addEventListener('drop', (e) => {
        e.preventDefault()
        const fromIdx = parseInt(e.dataTransfer?.getData('text/plain') ?? '', 10)
        if (isNaN(fromIdx) || fromIdx === i) return
        const statuses = this.plugin.settings.statuses
        const [moved] = statuses.splice(fromIdx, 1)
        statuses.splice(i, 0, moved)
        void this.plugin.saveSettings()
        this.renderStatusList(container)
      })

      // Icon input
      const icon = row.createEl('input', { type: 'text', value: s.icon })
      icon.addClass('pm-settings-status-icon')
      icon.placeholder = ''
      icon.addEventListener('change', () => {
        this.plugin.settings.statuses[i].icon = icon.value
        void this.plugin.saveSettings()
      })

      // Label input
      const label = row.createEl('input', { type: 'text', value: t(s.label) })
      label.addClass('pm-settings-status-label')
      label.addEventListener('change', () => {
        this.plugin.settings.statuses[i].label = label.value
        void this.plugin.saveSettings()
      })

      // Color picker
      const color = row.createEl('input', { type: 'color', value: s.color })
      color.addEventListener('change', () => {
        this.plugin.settings.statuses[i].color = color.value
        void this.plugin.saveSettings()
      })

      // Complete toggle
      const completeLabel = row.createEl('label', { cls: 'pm-settings-complete-toggle' })
      const checkbox = completeLabel.createEl('input', { type: 'checkbox' })
      checkbox.checked = s.complete
      completeLabel.createSpan({ text: t('Terminal status'), cls: 'pm-settings-complete-text' })
      checkbox.addEventListener('change', () => {
        this.plugin.settings.statuses[i].complete = checkbox.checked
        void this.plugin.saveSettings()
      })

      // Delete button
      const del = row.createEl('button', { text: '✕', cls: 'pm-settings-del' })
      del.addEventListener('click', () => {
        if (this.plugin.settings.statuses.length <= 1) {
          new Notice(t('You must have at least one status.'))
          return
        }
        const deletedStatus = this.plugin.settings.statuses[i]
        this.plugin.settings.statuses.splice(i, 1)
        void this.plugin.saveSettings()
        this.renderStatusList(container)
        void this.remapOrphanTasks(deletedStatus.id, deletedStatus.label)
      })
    })
  }
}
