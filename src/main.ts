import { MarkdownView, Plugin, Notice } from 'obsidian'
import { DEFAULT_SETTINGS, PMSettings, Project } from './types'
import { flattenTasks } from './store/TaskTreeOps'
import { ProjectStore } from './store'
import { PMSettingTab } from './settings'
import { ProjectView, PM_PROJECT_VIEW_TYPE } from './views/ProjectView'
import { DashboardView, PM_DASHBOARD_VIEW_TYPE } from './views/DashboardView'
import { PMViewRouter } from './views/PMViewRouter'
import { openProjectModal, openTaskModal, openProjectPicker, openTaskPicker, openImportModal } from './ui/ModalFactory'
import { Notifier } from './components/Notifier'
import { migrateProjects } from './migration'
import { safeAsync } from './utils'
import { createTranslator, type TranslateFn } from './i18n'

export default class PMPlugin extends Plugin {
  settings: PMSettings = { ...DEFAULT_SETTINGS }
  store!: ProjectStore
  notifier!: Notifier
  router!: PMViewRouter
  t!: TranslateFn
  private _prevLanguage?: string
  undoStack: Array<{ undo: () => Promise<void>; redo: () => Promise<void> }> = []
  redoStack: Array<{ undo: () => Promise<void>; redo: () => Promise<void> }> = []

  pushUndo(entry: { undo: () => Promise<void>; redo: () => Promise<void> }): void {
    this.undoStack.push(entry)
    if (this.undoStack.length > 20) this.undoStack.shift()
    this.redoStack = []
  }

  async undoLastAction(): Promise<void> {
    const entry = this.undoStack.pop()
    if (entry) {
      await entry.undo()
      this.redoStack.push(entry)
    }
  }

  async redoLastAction(): Promise<void> {
    const entry = this.redoStack.pop()
    if (entry) {
      await entry.redo()
      this.undoStack.push(entry)
    }
  }

  async onload(): Promise<void> {
    await this.loadSettings()
    this.t = createTranslator(this.settings)
    this._prevLanguage = this.settings.language
    this.store = new ProjectStore(this.app, () => this.settings.statuses, this.t)
    this.notifier = new Notifier(this)
    this.router = new PMViewRouter(this)

    this.registerView(PM_PROJECT_VIEW_TYPE, (leaf) => new ProjectView(leaf, this))
    this.registerView(PM_DASHBOARD_VIEW_TYPE, (leaf) => new DashboardView(leaf, this))

    this.app.workspace.onLayoutReady(
      safeAsync(async () => {
        await migrateProjects(this)
        await this.cleanupStaleProjectFilters()
      }, this.t)
    )

    this.addRibbonIcon('chart-gantt', this.t('Project manager'), async () => {
      await this.router.openDashboard()
    })

    this.addCommand({
      id: 'open-projects',
      name: this.t('Open projects pane'),
      callback: () => {
        void this.router.openDashboard()
      }
    })

    this.addCommand({
      id: 'new-project',
      name: this.t('Create new project'),
      callback: () => {
        openProjectModal(this, {
          onSave: async (project) => {
            await this.router.openProjectByPath(project.filePath)
          }
        })
      }
    })

    this.addCommand({
      id: 'new-task',
      name: this.t('Create new task'),
      callback: () => {
        void this.pickProjectThenCreateTask(null)
      }
    })

    this.addCommand({
      id: 'new-subtask',
      name: this.t('Create new subtask'),
      callback: () => {
        void this.pickProjectThenCreateTask('pick-parent')
      }
    })

    this.addCommand({
      id: 'undo-last-action',
      name: this.t('Undo last action'),
      callback: () => {
        void this.undoLastAction()
      }
    })

    this.addCommand({
      id: 'redo-last-action',
      name: this.t('Redo last action'),
      callback: () => {
        void this.redoLastAction()
      }
    })

    this.addCommand({
      id: 'import-notes-as-tasks',
      name: this.t('Import notes as tasks'),
      callback: () => {
        void this.importNotes()
      }
    })

    this.addCommand({
      id: 'open-current-as-project',
      name: this.t('Open current file as project'),
      checkCallback: (checking: boolean) => {
        const md = this.app.workspace.getActiveViewOfType(MarkdownView)
        const file = md?.file
        if (!file) return false
        const cache = this.app.metadataCache.getFileCache(file)
        if (cache?.frontmatter?.['pm-project'] !== true) return false
        if (checking) return true
        void md.leaf.setViewState({ type: PM_PROJECT_VIEW_TYPE, state: { filePath: file.path } })
        return true
      }
    })

    this.addSettingTab(new PMSettingTab(this.app, this))
    this.notifier.start()
  }

  onunload(): void {
    this.notifier.stop()
  }

  async loadSettings(): Promise<void> {
    const saved = (await this.loadData()) as Partial<PMSettings> | null
    this.settings = Object.assign({}, DEFAULT_SETTINGS, saved ?? {})
    if (!saved?.statuses?.length) this.settings.statuses = DEFAULT_SETTINGS.statuses
    if (!saved?.priorities?.length) this.settings.priorities = DEFAULT_SETTINGS.priorities
    if (!this.settings.projectFilters) this.settings.projectFilters = {}

    let migrated = false
    for (const s of this.settings.statuses) {
      if (s.complete === undefined) {
        s.complete = s.id === 'done' || s.id === 'cancelled'
        migrated = true
      }
    }

    // ganttHideDone was a global gantt toggle; replaced by per-project filter.statuses
    // excluding terminal statuses. Seed projects whose filter has no status selection yet.
    const legacy = (saved ?? {}) as { ganttHideDone?: boolean }
    if (legacy.ganttHideDone === true) {
      const nonTerminal = this.settings.statuses.filter((s) => !s.complete).map((s) => s.id)
      for (const entry of Object.values(this.settings.projectFilters)) {
        if (entry.filter.statuses.length === 0) {
          entry.filter.statuses = nonTerminal
        }
      }
      migrated = true
    }

    if (migrated) await this.saveSettings()
  }

  async cleanupStaleProjectFilters(): Promise<void> {
    const filters = this.settings.projectFilters
    const cleaned: typeof filters = {}
    let dirty = false
    for (const [path, entry] of Object.entries(filters)) {
      if (this.app.vault.getAbstractFileByPath(path)) {
        cleaned[path] = entry
      } else {
        dirty = true
      }
    }
    if (dirty) {
      this.settings.projectFilters = cleaned
      await this.saveSettings()
    }
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings)
    this.t = createTranslator(this.settings)

    // 语言变更时，强制重载视图以应用新翻译
    if (this._prevLanguage !== this.settings.language) {
      this._prevLanguage = this.settings.language
      this.app.workspace.detachLeavesOfType(PM_PROJECT_VIEW_TYPE)
      this.app.workspace.detachLeavesOfType(PM_DASHBOARD_VIEW_TYPE)
      void this.app.workspace.getLeaf(false).setViewState({ type: PM_DASHBOARD_VIEW_TYPE })
    }
  }

  showNotice(msg: string, duration = 3000): void {
    new Notice(this.t(msg), duration)
  }

  /** Show project picker, then open TaskModal to create a task (optionally pick parent for subtask) */
  private async pickProjectThenCreateTask(mode: null | 'pick-parent'): Promise<void> {
    const projects = await this.store.loadAllProjects(this.settings.projectsFolder)
    if (!projects.length) {
      this.showNotice('No projects yet. Create a project first.')
      return
    }
    openProjectPicker(this, projects, (project) => {
      if (mode === 'pick-parent') {
        const flat = flattenTasks(project.tasks)
        if (!flat.length) {
          this.showNotice('No tasks in this project. Create a task first.')
          return
        }
        openTaskPicker(
          this,
          flat.map((f) => f.task),
          (parentTask) => {
            this.openTaskModalForProject(project, parentTask.id)
          }
        )
      } else {
        this.openTaskModalForProject(project, null)
      }
    })
  }

  private openTaskModalForProject(project: Project, parentId: string | null): void {
    openTaskModal(this, project, {
      parentId,
      onSave: async () => {
        await this.store.saveProject(project)
        await this.router.openProjectByPath(project.filePath)
      }
    })
  }

  private async importNotes(): Promise<void> {
    const activeLeaves = this.app.workspace.getLeavesOfType(PM_PROJECT_VIEW_TYPE)
    let activeProject: Project | null = null

    for (const leaf of activeLeaves) {
      if (!(leaf.view instanceof ProjectView)) continue
      if (leaf.view.project) {
        activeProject = leaf.view.project
        break
      }
    }

    if (activeProject) {
      const project = activeProject
      const onImportComplete = async () => {
        await this.router.openProjectByPath(project.filePath)
      }
      openImportModal(this, activeProject, onImportComplete)
      return
    }

    const projects = await this.store.loadAllProjects(this.settings.projectsFolder)
    if (!projects.length) {
      this.showNotice('No projects yet. Create a project first.')
      return
    }

    openProjectPicker(this, projects, (project) => {
      const onImportComplete = async () => {
        await this.router.openProjectByPath(project.filePath)
      }
      openImportModal(this, project, onImportComplete)
    })
  }
}
