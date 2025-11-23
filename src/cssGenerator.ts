import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function generateCSS(config: vscode.WorkspaceConfiguration): string {
    const wallpaperPath = config.get<string>('wallpaperPath', '');
    const editorOpacity = config.get<number>('editorOpacity', 0.2);
    const sidebarOpacity = config.get<number>('sidebarOpacity', 0.3);
    const quickInputOpacity = config.get<number>('quickInputOpacity', 0.5);

    // Convert wallpaper to base64 data URL for better compatibility
    let wallpaperUrl = '';
    if (wallpaperPath && fs.existsSync(wallpaperPath)) {
        try {
            const imageBuffer = fs.readFileSync(wallpaperPath);
            const base64Image = imageBuffer.toString('base64');
            const ext = path.extname(wallpaperPath).toLowerCase();
            const mimeType = ext === '.png' ? 'image/png' :
                           ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
                           ext === '.gif' ? 'image/gif' :
                           ext === '.webp' ? 'image/webp' :
                           ext === '.bmp' ? 'image/bmp' : 'image/jpeg';
            wallpaperUrl = `data:${mimeType};base64,${base64Image}`;
        } catch (error) {
            console.error('Failed to load wallpaper:', error);
            // Fallback to file:// URL
            wallpaperUrl = `file://${wallpaperPath.replace(/\\/g, '/')}`;
        }
    }

    return `/* VSCode Liquid Glass 效果 */
/* 透明度可配置 + 完整弹出层覆盖 */

/* ==================== 通用 Liquid Glass 样式 ==================== */

:root {
  /* Liquid Glass 颜色变量 */
  --glass-bg-light: rgba(255, 255, 255, ${sidebarOpacity});
  --glass-bg-dark: rgba(30, 30, 30, ${sidebarOpacity});
  --glass-border: transparent;
  --glass-shadow: rgba(0, 0, 0, 0.4);

  /* 模糊和饱和度 */
  --glass-blur: blur(8px);
  --glass-saturate: saturate(130%);
  --glass-brightness: brightness(1.05);
}

/* ==================== 0. 整个窗口毛玻璃背景 ==================== */

/* 主工作区背景 */
html,
body,
.monaco-workbench,
.monaco-workbench .monaco-grid-view,
.monaco-workbench .part.editor > .content {
  ${wallpaperUrl ? `background-image: url('${wallpaperUrl}') !important;` : ''}
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-attachment: fixed !important;
}

/* 编辑器区域半透明 */
.monaco-workbench .editor-container,
.monaco-workbench .split-view-view,
.monaco-workbench .part.editor,
.monaco-workbench .part.editor > .content,
.monaco-workbench .editor-instance,
.monaco-workbench .editor-instance > .monaco-editor,
.monaco-editor,
.monaco-editor .overflow-guard,
.monaco-editor .monaco-editor-background,
.monaco-editor-background {
  background: rgba(30, 30, 30, ${editorOpacity}) !important;
}

/* 行号区域半透明 */
.monaco-editor .margin,
.monaco-editor .glyph-margin,
.monaco-editor .line-numbers {
  background: rgba(30, 30, 30, ${editorOpacity}) !important;
  backdrop-filter: blur(5px) !important;
  -webkit-backdrop-filter: blur(5px) !important;
}

/* 侧边栏半透明 */
.monaco-workbench .part.sidebar,
.monaco-workbench .part.auxiliarybar,
.monaco-workbench .part.activitybar,
.monaco-workbench .part.titlebar,
.monaco-workbench .part.statusbar {
  background: rgba(30, 30, 30, ${sidebarOpacity}) !important;
  background-color: rgba(30, 30, 30, ${sidebarOpacity}) !important;
}

/* 折叠菜单标题需要背景色防止内容透上来 */
.pane-header,
.panel-header,
.composite-title,
.monaco-pane-view .pane-header,
.split-view-view .pane-header,
.sidebar-pane .pane-header,
div[class*="pane-header"],
.monaco-workbench .pane-header,
.monaco-workbench .panel-header,
.monaco-workbench .composite-title,
.monaco-workbench .part.sidebar .pane-header,
.monaco-workbench .part.sidebar .panel-header {
  background: rgba(30, 30, 30, 0.98) !important;
  background-color: rgba(30, 30, 30, 0.98) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  position: relative !important;
  z-index: 100 !important;
}

/* 文件树项需要轻微背景色防止重叠 - 但排除 Quick Input */
.monaco-workbench .part.sidebar .monaco-list-row,
.monaco-workbench .part.sidebar .monaco-tl-row,
.monaco-workbench .part.auxiliarybar .monaco-list-row,
.monaco-workbench .part.auxiliarybar .monaco-tl-row,
.explorer-item,
.tree-explorer-viewlet-tree-view .monaco-list-row {
  background: rgba(30, 30, 30, 0.1) !important;
  background-color: rgba(30, 30, 30, 0.1) !important;
  backdrop-filter: blur(2px) !important;
  -webkit-backdrop-filter: blur(2px) !important;
}

/* hover 状态 - 但排除 Quick Input */
.monaco-workbench .part.sidebar .monaco-list-row:hover,
.monaco-workbench .part.auxiliarybar .monaco-list-row:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  background-color: rgba(255, 255, 255, 0.15) !important;
}

/* 子元素背景透明 - 但排除 pane-header 和 list-row */
.monaco-workbench .part.sidebar *:not(.pane-header):not(.panel-header):not(.composite-title):not(.monaco-list-row):not(.monaco-tl-row),
.monaco-workbench .part.auxiliarybar *:not(.pane-header):not(.panel-header):not(.composite-title):not(.monaco-list-row):not(.monaco-tl-row),
.monaco-workbench .part.panel *:not(.pane-header):not(.panel-header):not(.monaco-list-row),
.monaco-workbench .part.activitybar *,
.monaco-workbench .part.titlebar * {
  background-color: transparent !important;
}

/* 标签栏半透明 */
.monaco-workbench .tabs-and-actions-container,
.monaco-workbench .editor-group-container > .title,
.monaco-workbench .title.tabs,
.monaco-workbench .tabs-container {
  background: rgba(30, 30, 30, ${sidebarOpacity}) !important;
  background-color: rgba(30, 30, 30, ${sidebarOpacity}) !important;
}

/* 单个标签透明 */
.monaco-workbench .tab {
  background: transparent !important;
  background-color: transparent !important;
}

.monaco-workbench .tab.active {
  background: rgba(255, 255, 255, 0.1) !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
}

/* ==================== Quick Input 居中 + Liquid Glass ==================== */

.monaco-workbench .quick-input-widget {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  width: 600px !important;
  max-width: 90vw !important;

  background: rgba(30, 30, 30, ${quickInputOpacity}) !important;
  background-color: rgba(30, 30, 30, ${quickInputOpacity}) !important;
  backdrop-filter: var(--glass-blur) var(--glass-saturate) var(--glass-brightness) !important;
  -webkit-backdrop-filter: var(--glass-blur) var(--glass-saturate) var(--glass-brightness) !important;
  border: 1px solid var(--glass-border) !important;
  box-shadow: 0 16px 48px 0 rgba(0, 0, 0, 0.5) !important;
  border-radius: 16px !important;
}

.monaco-workbench .quick-input-header,
.monaco-workbench .quick-input-list,
.monaco-workbench .quick-input-title,
.monaco-workbench .quick-input-list .monaco-list {
  background: transparent !important;
}

.monaco-workbench .quick-input-widget .monaco-inputbox {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 8px !important;
  backdrop-filter: blur(5px) !important;
  -webkit-backdrop-filter: blur(5px) !important;
}

.monaco-workbench .quick-input-list .monaco-list-row {
  background: transparent !important;
  background-color: transparent !important;
  border-radius: 6px !important;
  margin: 0px !important;
  padding-left: 12px !important;
}

.monaco-workbench .quick-input-list .monaco-list-row:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  background-color: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(5px) !important;
  -webkit-backdrop-filter: blur(5px) !important;
}

.monaco-workbench .quick-input-list .monaco-list-row.focused {
  background: rgba(90, 150, 255, 0.25) !important;
  background-color: rgba(90, 150, 255, 0.25) !important;
  backdrop-filter: blur(5px) !important;
  -webkit-backdrop-filter: blur(5px) !important;
}

/* ==================== 弹出层毛玻璃效果 ==================== */

/* Context Menu */
.monaco-workbench .context-view,
.shadow-root-host .context-view,
div.context-view {
  background: var(--glass-bg-dark) !important;
  backdrop-filter: var(--glass-blur) var(--glass-saturate) var(--glass-brightness) !important;
  -webkit-backdrop-filter: var(--glass-blur) var(--glass-saturate) var(--glass-brightness) !important;
  border: none !important;
  box-shadow: 0 10px 40px 0 var(--glass-shadow) !important;
  border-radius: 10px !important;
  padding: 6px !important;
}

/* 通知消息 */
.monaco-workbench .notifications-toasts,
.monaco-workbench .notification-toast,
.monaco-workbench .notification-toast-container,
.monaco-workbench .notification-list-item,
.notifications-toasts,
.notification-toast,
.notification-toast-container,
.notification-list-item,
.notifications-center {
  background: rgba(30, 30, 30, 0) !important;
  backdrop-filter: var(--glass-blur) var(--glass-saturate) var(--glass-brightness) !important;
  -webkit-backdrop-filter: var(--glass-blur) var(--glass-saturate) var(--glass-brightness) !important;
  border: none !important;
  box-shadow: 0 12px 40px 0 var(--glass-shadow) !important;
  border-radius: 12px !important;
}

/* 代码定义悬停 */
.monaco-workbench .monaco-hover,
.monaco-workbench .monaco-editor-hover,
.monaco-workbench .editor-hover-content,
.monaco-hover-content,
.monaco-hover,
.monaco-editor-hover,
.editor-hover-content {
  background: rgba(30, 30, 30, 0) !important;
  backdrop-filter: var(--glass-blur) var(--glass-saturate) var(--glass-brightness) !important;
  -webkit-backdrop-filter: var(--glass-blur) var(--glass-saturate) var(--glass-brightness) !important;
  border: none !important;
  box-shadow: 0 8px 30px 0 var(--glass-shadow) !important;
  border-radius: 10px !important;
}

/* Hover 内容区域 */
.monaco-workbench .monaco-hover .hover-contents,
.monaco-hover .hover-contents,
.monaco-workbench .monaco-hover .hover-row,
.monaco-hover .hover-row,
.monaco-workbench .monaco-hover .monaco-editor,
.monaco-hover .monaco-editor {
  background: transparent !important;
  border: none !important;
  border-radius: 10px !important;
}

/* 代码提示框 (Suggest Widget) */
.monaco-workbench .suggest-widget,
.monaco-workbench .editor-widget.suggest-widget,
.suggest-widget,
.editor-widget.suggest-widget {
  background: rgba(30, 30, 30, 0.5) !important;
  backdrop-filter: var(--glass-blur) var(--glass-saturate) var(--glass-brightness) !important;
  -webkit-backdrop-filter: var(--glass-blur) var(--glass-saturate) var(--glass-brightness) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 8px 30px 0 var(--glass-shadow) !important;
  border-radius: 10px !important;
}

.monaco-workbench .suggest-widget .monaco-list,
.suggest-widget .monaco-list {
  background: transparent !important;
}

.monaco-workbench .suggest-widget .monaco-list .monaco-list-row,
.suggest-widget .monaco-list .monaco-list-row {
  background: transparent !important;
}

.monaco-workbench .suggest-widget .monaco-list .monaco-list-row.focused,
.suggest-widget .monaco-list .monaco-list-row.focused {
  background: rgba(90, 150, 255, 0.3) !important;
  backdrop-filter: blur(5px) !important;
  -webkit-backdrop-filter: blur(5px) !important;
}

/* 参数提示框 (Parameter Hints) */
.monaco-workbench .parameter-hints-widget,
.parameter-hints-widget {
  background: rgba(30, 30, 30, 0.5) !important;
  backdrop-filter: var(--glass-blur) var(--glass-saturate) var(--glass-brightness) !important;
  -webkit-backdrop-filter: var(--glass-blur) var(--glass-saturate) var(--glass-brightness) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 8px 30px 0 var(--glass-shadow) !important;
  border-radius: 10px !important;
}

/* 搜索框 (Find Widget) */
.monaco-workbench .find-widget,
.monaco-workbench .editor-widget.find-widget,
.find-widget,
.editor-widget.find-widget {
  background: rgba(30, 30, 30, 0.5) !important;
  backdrop-filter: var(--glass-blur) var(--glass-saturate) var(--glass-brightness) !important;
  -webkit-backdrop-filter: var(--glass-blur) var(--glass-saturate) var(--glass-brightness) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: 0 8px 30px 0 var(--glass-shadow) !important;
  border-radius: 10px !important;
}

/* 搜索视图 (Search View) */
.monaco-workbench .search-view,
.search-view {
  background: transparent !important;
}

.monaco-workbench .search-view .search-widget,
.search-view .search-widget {
  background: rgba(30, 30, 30, 0.3) !important;
  backdrop-filter: blur(5px) !important;
  -webkit-backdrop-filter: blur(5px) !important;
  border-radius: 8px !important;
}

/* Monaco List 统一选中效果 */
.monaco-workbench .monaco-list .monaco-list-row:hover,
.monaco-list .monaco-list-row:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(5px) !important;
  -webkit-backdrop-filter: blur(5px) !important;
  border-radius: 6px !important;
}

.monaco-workbench .monaco-list .monaco-list-row.focused,
.monaco-list .monaco-list-row.focused,
.monaco-workbench .monaco-list .monaco-list-row:focus,
.monaco-list .monaco-list-row:focus {
  background: rgba(90, 150, 255, 0.3) !important;
  backdrop-filter: blur(5px) !important;
  -webkit-backdrop-filter: blur(5px) !important;
  border-radius: 6px !important;
  outline: none !important;
}

.monaco-workbench .monaco-list .monaco-list-row.selected,
.monaco-list .monaco-list-row.selected,
.monaco-workbench .monaco-list .monaco-list-row[aria-selected="true"],
.monaco-list .monaco-list-row[aria-selected="true"] {
  background: rgba(90, 150, 255, 0.25) !important;
  backdrop-filter: blur(5px) !important;
  -webkit-backdrop-filter: blur(5px) !important;
  border-radius: 6px !important;
}

.monaco-workbench .monaco-list .monaco-list-row.selected.focused,
.monaco-list .monaco-list-row.selected.focused,
.monaco-workbench .monaco-list .monaco-list-row.selected:focus,
.monaco-list .monaco-list-row.selected:focus {
  background: rgba(90, 150, 255, 0.4) !important;
  backdrop-filter: blur(5px) !important;
  -webkit-backdrop-filter: blur(5px) !important;
  border-radius: 6px !important;
}

/* ==================== 终端相关修复 ==================== */

/* 终端 panel 增加背景不透明度 */
.monaco-workbench .part.panel {
  background: rgba(30, 30, 30, 0.85) !important;
  background-color: rgba(30, 30, 30, 0.85) !important;
}

/* 终端 pane-header 确保不透明，防止字体重叠 */
.monaco-workbench .part.panel .pane-header,
.monaco-workbench .part.panel .panel-header,
.monaco-workbench .part.panel .composite-title {
  background: rgba(30, 30, 30, 0.98) !important;
  background-color: rgba(30, 30, 30, 0.98) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  position: relative !important;
  z-index: 100 !important;
}

/* 终端光标增强可见性 */
.monaco-workbench .terminal .xterm-cursor-layer .xterm-cursor-block,
.terminal .xterm-cursor-layer .xterm-cursor-block,
.xterm-cursor-layer .xterm-cursor-block {
  opacity: 1 !important;
  background: rgba(255, 255, 255, 0.9) !important;
}

.monaco-workbench .terminal .xterm-cursor-layer .xterm-cursor-outline,
.terminal .xterm-cursor-layer .xterm-cursor-outline,
.xterm-cursor-layer .xterm-cursor-outline {
  opacity: 1 !important;
  border-color: rgba(255, 255, 255, 0.9) !important;
}

.monaco-workbench .terminal .xterm-cursor-layer .xterm-cursor-bar,
.terminal .xterm-cursor-layer .xterm-cursor-bar,
.xterm-cursor-layer .xterm-cursor-bar {
  opacity: 1 !important;
  background: rgba(255, 255, 255, 0.9) !important;
}

.monaco-workbench .terminal .xterm-cursor-layer .xterm-cursor-underline,
.terminal .xterm-cursor-layer .xterm-cursor-underline,
.xterm-cursor-layer .xterm-cursor-underline {
  opacity: 1 !important;
  border-bottom-color: rgba(255, 255, 255, 0.9) !important;
}

/* 终端选中文本增强可见性 */
.monaco-workbench .terminal .xterm-selection,
.terminal .xterm-selection,
.xterm-selection {
  background: rgba(90, 150, 255, 0.5) !important;
  opacity: 1 !important;
}

/* Panel 中的 list 选中效果增强 */
.monaco-workbench .part.panel .monaco-list-row:hover {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(5px) !important;
  -webkit-backdrop-filter: blur(5px) !important;
}

.monaco-workbench .part.panel .monaco-list-row.focused,
.monaco-workbench .part.panel .monaco-list-row.selected {
  background: rgba(90, 150, 255, 0.4) !important;
  backdrop-filter: blur(5px) !important;
  -webkit-backdrop-filter: blur(5px) !important;
}
`;
}
