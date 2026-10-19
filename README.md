# MCP、DORA 与文件分发 Agent 规划展示

静态中文规划展示页，包含五类业务服务、四类内部通用接口、上游接入架构与待讨论事项。无外部依赖，不连接真实业务数据。

## 页面

- `index.html`：MCP 企业智能服务蓝图。
- `dora.html`：DORA 敏捷 BI Agent 框架，包括系统架构、实时交互与定期跑批流程、独立生成 / 推送时间示例，以及管理员控制台交互原型。配套 `dora.css`、`dora.js`，无第三方前端依赖。
- `file-distribution.html`：文件分发 Agent 设计，包含源系统 → STG → ODS → Export → 下游系统的架构、采集规则切换、Flow / Group / Job 层级、测试与生产核查清单及书面说明。配套 `file-distribution.css`、`file-distribution.js`。
- `file-distribution-design.md`：可下载的完整书面设计说明。
- 三个页面提供相互跳转入口；所有原型与核查模板均不连接真实系统、不执行真实任务。

## 本地查看

在仓库目录运行 `python3 -m http.server 8000`，然后用浏览器打开本地 8000 端口。页面支持服务对象筛选、规划详情弹窗与移动端布局。

## GitHub Pages

推送到 `main` 后，`.github/workflows/pages.yml` 使用 GitHub Actions 发布页面。仓库 Settings → Pages 中的 Source 应为 GitHub Actions。若自动启用失败，仓库管理员需先启用 Pages。

地址：

- MCP：https://cafelzj.github.io/businessplan/
- DORA：https://cafelzj.github.io/businessplan/dora.html
- 文件分发 Agent：https://cafelzj.github.io/businessplan/file-distribution.html

更新推送后，需等待 Pages 工作流部署成功。
