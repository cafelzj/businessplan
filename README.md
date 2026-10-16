# MCP 企业智能服务蓝图

静态中文规划展示页，包含五类业务服务、四类内部通用接口、上游接入架构与待讨论事项。无外部依赖，不连接真实业务数据。

## 本地查看

在仓库目录运行 `python3 -m http.server 8000`，然后用浏览器打开本地 8000 端口。页面支持服务对象筛选、规划详情弹窗与移动端布局。

## GitHub Pages

推送到 `main` 后，`.github/workflows/pages.yml` 使用 GitHub Actions 发布页面。仓库 Settings → Pages 中的 Source 应为 GitHub Actions。若自动启用失败，仓库管理员需先启用 Pages。

预期地址： https://cafelzj.github.io/businessplan/ （须等待部署成功后才能访问）。
