#!/usr/bin/env node

/**
 * i18n key 完整性校验
 * 扫描 src/ 下所有 t('...') 调用，检查 zhCN 字典中是否有对应条目。
 * 用法：node scripts/check-i18n.mjs
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const SRC_DIR = 'src'
const I18N_FILE = 'src/i18n/index.ts'

// 1. 提取 zhCN 字典中的所有 key
const i18nContent = readFileSync(I18N_FILE, 'utf-8')

const zhStart = i18nContent.indexOf('const zhCN')
if (zhStart === -1) {
  console.error('❌ Could not find zhCN dictionary in', I18N_FILE)
  process.exit(1)
}
const zhBlock = i18nContent.slice(zhStart)

const dictKeys = new Set()
// Match both 'key': ... and "key": ... patterns, handling embedded quotes
// 'single-quoted "key" with embeds': ...  or  "double-quoted 'key' with embeds": ...
const dictKeyPattern = /^\s*(?:"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)')\s*:/gm
for (const match of zhBlock.matchAll(dictKeyPattern)) {
  dictKeys.add(match[1] !== undefined ? match[1] : match[2])
}

// 2. 扫描所有 t() 调用中的 key
function walkDir(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    if (statSync(fullPath).isDirectory()) {
      files.push(...walkDir(fullPath))
    } else if (entry.endsWith('.ts') && !entry.endsWith('.test.ts')) {
      files.push(fullPath)
    }
  }
  return files
}

// Improved pattern: match .t('...') where the key string may contain embedded quotes like "{var}"
// Pattern matches: .t('anything up to closing quote-comma or closing quote-paren)
// Handles: .t('key with "quotes"', {...})  and  .t('simple key')
const tCallPattern = /\.t\(\s*(?:"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)')/g
const usedKeys = new Set()
const missingKeys = []

for (const file of walkDir(SRC_DIR)) {
  if (file.includes('i18n/index.ts')) continue
  let content = readFileSync(file, 'utf-8')
  // Decode JS unicode escapes for comparison
  content = content.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  )
  for (const match of content.matchAll(tCallPattern)) {
    const key = match[1] !== undefined ? match[1] : match[2]
    usedKeys.add(key)
    if (!dictKeys.has(key)) {
      missingKeys.push({ key, file })
    }
  }
}

// 3. 报告
const unusedKeys = [...dictKeys].filter(k => !usedKeys.has(k))

if (missingKeys.length > 0) {
  console.error('❌ Missing translations:')
  for (const { key, file } of missingKeys) {
    console.error(`   "${key}" — used in ${file}`)
  }
}

if (unusedKeys.length > 0) {
  console.warn(`⚠️  Unused translations (${unusedKeys.length} keys, may be data labels or intentionally translated):`)
  for (const key of unusedKeys) {
    console.warn(`   "${key}"`)
  }
}

if (missingKeys.length === 0) {
  console.log(`✅ All ${usedKeys.size} t() keys have translations.`)
}

process.exit(missingKeys.length > 0 ? 1 : 0)
