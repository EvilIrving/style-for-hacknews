# Hacker News 样式优化

一个提升 Hacker News 可读性的 Chrome 扩展，通过精致的字体、优化的间距和更清晰的布局改善阅读体验。支持英文、中文、日文和韩文界面。

[English version](README.md)

## 功能

- **8 款可变字体** — 一键循环切换 MapleMono CN、霞鹜臻楷、Google Sans Flex、Commit Mono、Geist、Geist Mono、MiSans 和 Mona Sans
- **元信息切换** — 显示或隐藏文章元数据（积分、评论数、时间戳），减少视觉干扰
- **评论线程指示器** — 可视化深度标记，让嵌套讨论一目了然
- **偏好持久化** — 字体选择和可见性设置本地保存，跨会话保留
- **四语言支持** — 界面标签适配英文、简体中文、日文和韩文

## 使用方法

1. 访问 [news.ycombinator.com](https://news.ycombinator.com)
2. 使用右下角浮动控制面板切换字体、元信息显示或界面语言

## 安装

1. 在 Chrome 中打开 `chrome://extensions/`
2. 启用**开发者模式**
3. 点击**加载已解压的扩展程序**，选择此项目文件夹
4. 访问 Hacker News 测试

## 技术说明

扩展以内容脚本形式运行于 `news.ycombinator.com`。核心文件：

| 文件 | 用途 |
|---|---|
| `content.js` | 控制面板、切换逻辑、字体切换、国际化 |
| `content.css` | 字体覆盖、评论线程、布局优化 |
| `control-panel.css` | 浮动面板样式 |
| `_locales/` | 英、简中、日、韩四种语言的界面字符串 |

## 许可证

MIT
