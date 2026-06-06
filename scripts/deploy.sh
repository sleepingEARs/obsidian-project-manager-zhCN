#!/bin/bash
set -e

echo "============================================"
echo "  obsidian-pm 汉化版 — 构建并部署到 Vault"
echo "============================================"
echo ""

# ── 配置 ───
VAULT_PATH="${VAULT_PATH:-}"
if [ -z "$VAULT_PATH" ]; then
  echo "❌ 请设置 VAULT_PATH 环境变量指向你的 Obsidian Vault"
  echo "   例如: export VAULT_PATH=/path/to/your/vault"
  exit 1
fi
PLUGIN_DIR="$VAULT_PATH/.obsidian/plugins/project-manager"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Vault 路径: $VAULT_PATH"
echo "插件目录: $PLUGIN_DIR"
echo ""

# ─── 检查环境 ───
echo "[1/4] 检查 Node.js 版本..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
export PATH="$(nvm which 24 | xargs dirname):$PATH"
node --version
echo ""

# ─── 构建 ───
echo "[2/4] 构建项目..."
cd "$PROJECT_DIR"
pnpm build 2>&1
echo ""

# ─── 类型检查 + 测试 ───
echo "[3/4] 类型检查 + 测试..."
pnpm run check:types 2>&1 && echo "✅ 类型检查通过"
pnpm test 2>&1 | tail -3
echo ""

# ─── 部署 ───
echo "[4/4] 部署到 Vault..."
mkdir -p "$PLUGIN_DIR"

cp "$PROJECT_DIR/main.js"         "$PLUGIN_DIR/main.js"
cp "$PROJECT_DIR/manifest.json"   "$PLUGIN_DIR/manifest.json"
cp "$PROJECT_DIR/styles.css"      "$PLUGIN_DIR/styles.css"

echo ""
echo "============================================"
echo "  ✅ 部署完成！"
echo "============================================"
echo ""
echo "文件已复制到："
echo "  $PLUGIN_DIR/main.js"
echo "  $PLUGIN_DIR/manifest.json"
echo "  $PLUGIN_DIR/styles.css"
echo ""
echo "下一步："
echo "  1. 如果 Obsidian 正在运行，请完全退出（不是关闭窗口）"
echo "  2. 重新打开 Obsidian"
echo "  3. 设置 → 第三方插件 → Project Manager → ⚙️ 设置"
echo "  4. Language / 语言 → 选择「简体中文」"
echo "  5. 视图会自动重载，界面变为中文"
echo ""
