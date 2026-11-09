# Style for Hacker News (chrome-style-for-hacknews) 工程规格与协作规范

## 1. 项目定位与数据安全边界

- **项目定位**：专为 Hacker News（`news.ycombinator.com`）量身定制的本地优先（Local-First）阅读排版与体验增强扩展（Manifest V3）。在保留 HN 原汁原味技术社区克制底色的前提下，重塑现代字体排印、改善长文行距与层级对比、显化多级评论树引导线，并提供轻量级内联控制面板切换字体与元数据。
- **权限最小化原则（Least Privilege）**：
  - 仅申请单一 `storage` 权限，用于在 `chrome.storage.local` 中持久化用户的字体偏好、元数据可见性与面板语言。
  - 严格限制匹配域名为 `https://news.ycombinator.com/*`。
- **数据安全硬红线（Zero Leakage & Local-Only）**：
  - **零网络外联**：扩展内无任何外部网络请求，字体文件完全离线打包于本地 `fonts/` 目录中。
  - **零遥测与隐私安全**：严禁收集、存储或分析用户的 Hacker News 账号、浏览记录、点赞投票或评论输入。

## 2. 扩展架构与执行模型

- **纯内容脚本架构（Content-Script Only）**：
  ```text
  ┌────────────────────────────────────────────────────────┐
  │ 浏览器加载 news.ycombinator.com                        │
  └──────────────────────────┬─────────────────────────────┘
                             │ run_at: "document_start"
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │ 样式与脚本即时注入                                     │
  │  - content.css (现代排版、间距收敛、评论线重构)        │
  │  - control-panel.css (轻量悬浮控制面板样式)            │
  │  - content.js (字体加载、状态机、控制面板与 DOM 监听)   │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ├─► 读取 chrome.storage.local (偏好状态)
                             ├─► 动态向 <head> 注入 @font-face 规则
                             └─► 挂载 #hn-subtext-control-panel 控制面板
  ```
- **资源声明与字体供给**：
  - `manifest.json` 声明 `web_accessible_resources: ["fonts/*.ttf"]`。
  - `content.js` 启动阶段通过 `chrome.runtime.getURL("fonts/...")` 获取扩展内置字体的安全绝对路径，并内联构建 `@font-face` 规则块注入到 `document.head` 中。
- **状态持久化与容错**：
  - 偏好键值保存在 `chrome.storage.local`，并在异常或特殊受限环境下自动降级回退至 `window.localStorage`，确保用户设置稳定持久。

## 3. 目标站点 DOM 交互与兼容性物理约束

- **HN 传统嵌套 Table 布局对抗**：
  - Hacker News 沿用上古 table 布局（`table#hnmain`，行由 `tr.athing` 与 `tr` 紧随组成，元数据位于 `td.subtext`）。
  - **元数据折叠控制**：通过切换 `tr.athing + tr` 及 `td.subtext` 的可见性类名（`.hn-subtext-hidden`），在用户需要极简扫读文章标题时隐藏分数、作者与发布时间。
- **评论树层级引导线（Comment Nesting Guides）**：
  - HN 原生通过 `td.ind img[src="s.gif"]` 的 `width` 属性计算评论缩进层级（每级缩进通常为 40px）。
  - 扩展在 CSS 与脚本中针对 `td.ind` 及 `.comment-tree` 构造视觉引导线，确保在超深层级嵌套讨论中能够清晰看清所属分支父级，且不破坏原生的折叠按钮（`[-]`）与投票箭头（`.votelinks`）。
- **FOUC（无样式内容闪烁）对抗机制**：
  - 内容脚本配置为 `run_at: "document_start"`。
  - 在 `document.head` 尚未就绪时，立即通过轻量 `MutationObserver` 监听 `document.documentElement` 的 `childList` 变动，一旦检测到 `<head>` 生成即刻抢先注入 `@font-face` 样式规则，最大程度避免字体闪烁。

## 4. 验证与调试流程

- **本地加载调试**：
  1. 打开 Chromium 浏览器，进入 `chrome://extensions`。
  2. 启用右上角“开发者模式”。
  3. 点击“加载已解压的扩展程序”，选中本项目根目录。
  4. 访问 `https://news.ycombinator.com` 首页或评论详情页。
  5. 检查页面右下角是否浮出控制面板，点击验证：
     - “隐藏信息 / 显示信息”：即时切换文章元信息栏；
     - “字体：...”：轮播切换 Outfit, Oxygen, Cause, Playfair, Amarna 等内置字体；
     - 切换语言：验证控制面板多语言实时变更。
- **自动化校验流水线**：
  ```bash
  # 1. 静态清单规范、版本号与字体文件完整性校验
  npm run validate
  # 2. 跨平台打包构建 (生成 chrome, edge, firefox 三端 ZIP)
  npm run package
  # 3. 校验发布包完整性与白名单规则 (剔除临时文件与源码泄露)
  npm run release:check
  # 4. 一键执行完整发布审查流水线
  npm run release
  ```

## 5. 多文件联动与发布规范

- **版本同步清单**：
  - `manifest.json` 与 `package.json` 中的 `version` 字段必须严格一致，由 `scripts/validate.mjs` 在 CI 与发布前实施硬阻断。
- **国际化字典与内联文案联动**：
  - 核心翻译存储在 `_locales/en/messages.json` 与 `_locales/zh_CN/messages.json`。
  - 控制面板支持内嵌实时切换语言（EN / 中 / 日 / 한），当新增控制面板按钮或提示词时，必须同步更新 `content.js` 中的 `i18nFallbacks` 映射与 `_locales/` 字典。
- **发布制品合规（`scripts/validate-release.mjs`）**：
  - 产出的发布 ZIP（`style-for-hacknews-{target}-v*.zip`）中必须包含 `manifest.json` 与 `LICENSE`。
  - 严禁包含 `.git/`、`docs/`、`scripts/`、`build/` 或 `.DS_Store`。

## 6. 历史踩坑与典型故障定位

- **字体文件引入 404 或跨域拦截**：
  - *根因*：在内容脚本中未通过 `chrome.runtime.getURL` 转换即直接引用相对路径，导致浏览器基于 `news.ycombinator.com/fonts/...` 请求而返回 404。
  - *规范*：必须通过 `chrome.runtime.getURL("fonts/<font-name>.ttf")` 动态拼装完整扩展协议 URL，且必须确保 `manifest.json` 的 `web_accessible_resources` 规则覆盖所有 `fonts/*.ttf`。
- **投票（Upvote）后局部 DOM 变动导致样式失效**：
  - *根因*：HN 投票或折叠操作会通过原站内联脚本动态重写部分 `<td>` 或 `<tr>` 的 innerHTML。
  - *防御机制*：`content.js` 的 `observeDOMChanges()` 使用 `MutationObserver` 监控 `table#hnmain`，当检测到 DOM 变动时自动重新应用子文本状态类，杜绝重绘后样式回退。
