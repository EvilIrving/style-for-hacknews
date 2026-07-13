# 项目协作说明

Style for Hacker News 是仅运行于 `news.ycombinator.com` 的 MV3 阅读体验扩展。它只调整页面呈现，使用 `storage` 保存本地字体和元数据可见性偏好，不收集或传输用户数据。

改动扩展行为前，先读 `README.md`、`manifest.json` 和 `PRODUCT.md`；改公开信息时，同时更新 `docs/`、`release-docs/` 与 README。发布前运行 `npm run release`，并按 `release-docs/release-checklist.md` 进行浏览器手工验证。通用发布规则由全局 `browser-extension-baseline` 技能提供，禁止复制出第二套不一致的发布流程。
