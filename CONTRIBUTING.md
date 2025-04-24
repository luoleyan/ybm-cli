# 贡献指南

感谢您考虑为 ybm-cli 做出贡献！以下是一些指导原则，帮助您开始。

## 开发环境设置

1. Fork 这个仓库
2. 克隆您的 fork 到本地
   ```bash
   git clone https://github.com/YOUR_USERNAME/ybm-cli.git
   cd ybm-cli
   ```
3. 安装依赖
   ```bash
   npm install
   ```
4. 创建一个新分支
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. 链接到全局以便测试
   ```bash
   npm link
   ```

## 提交代码

1. 确保您的代码遵循项目的代码风格
2. 更新文档以反映任何更改
3. 提交您的更改
   ```bash
   git commit -m "feat: 添加新功能"
   ```
4. 推送到您的 fork
   ```bash
   git push origin feature/your-feature-name
   ```
5. 创建一个 Pull Request

## 提交消息规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范来格式化提交消息：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更改
- `style`: 不影响代码含义的更改（空格、格式等）
- `refactor`: 既不修复 bug 也不添加功能的代码更改
- `perf`: 提高性能的代码更改
- `test`: 添加或修正测试
- `chore`: 对构建过程或辅助工具的更改

## 报告问题

如果您发现了 bug 或有功能请求，请使用 GitHub Issues 进行报告。请包括：

- 问题的简短描述
- 重现步骤
- 预期行为
- 实际行为
- 环境信息（操作系统、Node.js 版本等）

## 许可证

通过贡献您的代码，您同意您的贡献将根据项目的 MIT 许可证进行许可。
