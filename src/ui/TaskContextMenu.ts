import { Menu, Notice } from 'obsidian'
import type PMPlugin from '../main'
import type { Task, Project } from '../types'
import { safeAsync } from '../utils'
import { openTaskModal, confirmDialog, confirmDuplicateSubtasks } from './ModalFactory'

export interface TaskMenuContext {
  plugin: PMPlugin
  project: Project
  onRefresh: () => Promise<void>
}

/**
 * Populates a Menu with standard task actions: Edit, Add subtask, Archive/Unarchive, Delete.
 */
export function buildTaskContextMenu(menu: Menu, task: Task, ctx: TaskMenuContext): Menu {
  menu.addItem((item) =>
    item
      .setTitle(ctx.plugin.t('Edit task'))
      .setIcon('pencil')
      .onClick(() => {
        openTaskModal(ctx.plugin, ctx.project, {
          task,
          onSave: async () => {
            await ctx.onRefresh()
          }
        })
      })
  )
  menu.addItem((item) =>
    item
      .setTitle(ctx.plugin.t('Add subtask'))
      .setIcon('plus')
      .onClick(() => {
        openTaskModal(ctx.plugin, ctx.project, {
          parentId: task.id,
          onSave: async () => {
            await ctx.onRefresh()
          }
        })
      })
  )
  menu.addItem((item) =>
    item
      .setTitle(ctx.plugin.t('Duplicate task'))
      .setIcon('copy')
      .onClick(
        safeAsync(async () => {
          let includeSubtasks = false
          if (task.subtasks.length > 0) {
            const choice = await confirmDuplicateSubtasks(ctx.plugin, task.title)
            if (choice === null) return
            includeSubtasks = choice === 'with-subtasks'
          }
          await ctx.plugin.store.duplicateTask(ctx.project, task.id, includeSubtasks)
          await ctx.onRefresh()
        }, ctx.plugin.t)
      )
  )
  menu.addSeparator()
  if (task.archived) {
    menu.addItem((item) =>
      item
        .setTitle(ctx.plugin.t('Unarchive'))
        .setIcon('archive-restore')
        .onClick(
          safeAsync(async () => {
            await ctx.plugin.store.unarchiveTask(ctx.project, task.id)
            new Notice(ctx.plugin.t('Task unarchived'))
            await ctx.onRefresh()
          }, ctx.plugin.t)
        )
    )
  } else {
    menu.addItem((item) =>
      item
        .setTitle(ctx.plugin.t('Archive'))
        .setIcon('archive')
        .onClick(
          safeAsync(async () => {
            await ctx.plugin.store.archiveTask(ctx.project, task.id)
            new Notice(ctx.plugin.t('Task archived'))
            await ctx.onRefresh()
          }, ctx.plugin.t)
        )
    )
  }
  menu.addItem((item) =>
    item
      .setTitle(ctx.plugin.t('Delete task'))
      .setIcon('trash')
      .onClick(
        safeAsync(async () => {
          if (await confirmDialog(ctx.plugin, ctx.plugin.t('Delete "{title}"?', { title: task.title }))) {
            await ctx.plugin.store.deleteTask(ctx.project, task.id)
            await ctx.onRefresh()
          }
        }, ctx.plugin.t)
      )
  )
  return menu
}
