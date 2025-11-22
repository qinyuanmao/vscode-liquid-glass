# VSCode Liquid Glass 安装指南

## 快速安装

### 1. 安装依赖扩展

首先需要安装 **Custom CSS and JS Loader** 扩展：

1. 打开 VSCode
2. 按 `Cmd+Shift+X` 打开扩展面板
3. 搜索 "Custom CSS and JS Loader"
4. 点击安装（作者：be5invis）

### 2. 安装 Liquid Glass 扩展

有两种方式安装：

#### 方式 A：从 VSIX 文件安装（推荐）

1. 打开 VSCode
2. 按 `Cmd+Shift+P` 打开命令面板
3. 输入 "Install from VSIX"
4. 选择 `vscode-liquid-glass-1.0.0.vsix` 文件
5. 点击安装

#### 方式 B：从源码安装（开发者）

```bash
cd vscode-liquid-glass
npm install
npm run compile
```

然后在 VSCode 中按 F5 启动调试窗口。

### 3. 启用 Liquid Glass 效果

1. 按 `Cmd+Shift+P` 打开命令面板
2. 输入 "Liquid Glass: Enable"
3. 选择一张背景图片（支持 PNG, JPG, JPEG, GIF, WEBP, BMP）
4. 点击 "Reload Now" 重新加载 VSCode

## 功能使用

### 更换背景图片

1. 按 `Cmd+Shift+P`
2. 输入 "Liquid Glass: Select Wallpaper"
3. 选择新的图片文件
4. VSCode 会自动重新加载

### 调整透明度

1. 按 `Cmd+Shift+P`
2. 输入 "Liquid Glass: Configure Transparency"
3. 选择要调整的区域（编辑器/侧边栏/快速输入）
4. 输入 0-1 之间的数值（0 = 完全透明，1 = 完全不透明）

推荐设置：
- 编辑器透明度：0.2
- 侧边栏透明度：0.3
- 快速输入透明度：0.5

### 禁用效果

1. 按 `Cmd+Shift+P`
2. 输入 "Liquid Glass: Disable"
3. 点击 "Reload Now" 重新加载 VSCode

## 高级配置

### 通过 settings.json 配置

按 `Cmd+,` 打开设置，搜索 "Liquid Glass"，或直接编辑 `settings.json`：

```json
{
  "liquidGlass.enabled": true,
  "liquidGlass.wallpaperPath": "/Users/你的用户名/Pictures/wallpaper.png",
  "liquidGlass.editorOpacity": 0.2,
  "liquidGlass.sidebarOpacity": 0.3,
  "liquidGlass.quickInputOpacity": 0.5
}
```

### 配合主题使用

Liquid Glass 适合与深色主题搭配使用，推荐主题：
- Dark+ (default dark)
- One Dark Pro
- Dracula
- Material Theme Darker

### 配合 workbench.colorCustomizations 使用

为了获得最佳效果，建议在 `settings.json` 中添加以下配置使背景透明：

```json
{
  "workbench.colorCustomizations": {
    "editor.background": "#00000000",
    "sideBar.background": "#00000000",
    "activityBar.background": "#00000000",
    "panel.background": "#00000000"
  }
}
```

## 常见问题

### Q: 为什么 VSCode 显示 "Unsupported" 警告？

A: 这是正常现象。Custom CSS 扩展会修改 VSCode 的文件，因此会触发完整性检查警告。这个警告可以安全忽略。如果想移除警告徽章，可以安装 "Fix VSCode Checksums" 扩展。

### Q: 背景图片不显示？

A: 请检查：
1. 图片路径是否正确
2. 图片文件是否存在
3. 是否已经重新加载 VSCode
4. 尝试重新选择背景图片

### Q: 文字看不清楚？

A: 可以通过以下方式调整：
1. 提高相应区域的透明度（使背景更不透明）
2. 更换背景图片（选择颜色较深或较浅的图片）
3. 调整 VSCode 主题

### Q: 如何卸载？

A:
1. 先运行 "Liquid Glass: Disable" 命令
2. 重新加载 VSCode
3. 在扩展面板中卸载 "VSCode Liquid Glass" 扩展

## 技术细节

### 工作原理

1. 扩展生成包含毛玻璃效果的 CSS 文件
2. 通过 Custom CSS and JS Loader 将 CSS 注入到 VSCode
3. CSS 使用 `backdrop-filter` 和 `background` 属性实现毛玻璃效果
4. 背景图片通过 `background-image` 设置

### 性能影响

- CPU：几乎无影响
- 内存：增加约 1-2MB（用于背景图片）
- GPU：轻微影响（用于渲染模糊效果）

建议在配置较好的设备上使用，或适当降低背景图片分辨率。

## 支持与反馈

如有问题或建议，请通过以下方式反馈：
- GitHub Issues
- VSCode 扩展评论区

祝使用愉快！
