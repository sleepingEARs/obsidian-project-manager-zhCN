import { ButtonComponent } from 'obsidian'
import { Chip } from './primitives/Chip'
import type { TranslateFn } from '../i18n'

export function renderPropRow(container: HTMLElement, label: string, valueBuilder: () => HTMLElement): HTMLElement {
  const row = container.createDiv('pm-prop-row')
  row.createSpan({ text: label, cls: 'pm-prop-label' })
  const valueEl = valueBuilder()
  row.appendChild(valueEl)
  return row
}

export interface ChipListOpts {
  variant?: 'default' | 'accent'
  shape?: 'rounded' | 'pill'
  onRemove: (item: string) => void
  labelFn?: (item: string) => string
  onAdd?: (e: MouseEvent) => void
  addLabel?: string
  renderAdd?: (container: HTMLElement) => void
  t?: TranslateFn
}

export function renderChipList(container: HTMLElement, items: string[], opts: ChipListOpts): void {
  container.empty()
  const variant = opts.variant ?? 'default'
  const shape = opts.shape ?? 'pill'
  const translate = opts.t ?? ((key: string) => key)
  for (const item of items) {
    new Chip(container)
      .setLabel(opts.labelFn ? opts.labelFn(item) : item)
      .setVariant(variant)
      .setShape(shape)
      .setRemovable(() => opts.onRemove(item))
  }
  if (opts.renderAdd) {
    opts.renderAdd(container)
  } else if (opts.onAdd) {
    new ButtonComponent(container).setButtonText(opts.addLabel ?? translate('+ Add')).onClick((e) => opts.onAdd!(e))
  }
}

export function renderProgressSlider(
  container: HTMLElement,
  value: number,
  onChange: (value: number) => void,
  t?: TranslateFn
): HTMLElement {
  const translate = t ?? ((key: string) => key)
  const wrap = container.createDiv('pm-prop-value pm-prop-progress-wrap')
  const slider = wrap.createEl('input', { type: 'range', cls: 'pm-progress-slider' })
  slider.min = '0'
  slider.max = '100'
  slider.step = '5'
  slider.value = String(value)
  const label = wrap.createSpan({ text: `${value}%`, cls: 'pm-progress-slider-label' })
  slider.setAttribute('aria-label', translate('Progress'))
  slider.addEventListener('input', () => {
    const v = parseInt(slider.value)
    label.textContent = `${v}%`
    onChange(v)
  })
  return wrap
}
