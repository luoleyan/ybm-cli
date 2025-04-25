# YBM CLI

一个简单易用的前端项目脚手架工具。

[![npm version](https://img.shields.io/npm/v/ybm-cli.svg?style=flat)](https://www.npmjs.com/package/ybm-cli)
[![npm downloads](https://img.shields.io/npm/dm/ybm-cli.svg?style=flat)](https://www.npmjs.com/package/ybm-cli)
[![license](https://img.shields.io/npm/l/ybm-cli.svg)](https://www.npmjs.com/package/ybm-cli)
[![GitHub](https://img.shields.io/github/stars/luoleyan/ybm-cli?style=social)](https://github.com/luoleyan/ybm-cli)

## 功能特点

- 快速创建前端项目
- 支持多种项目模板（Vue 3 + Vite、Vue 2 + Webpack、React、Svelte、SolidJS）
- 支持从远程仓库拉取模板
- 支持从任意远程 Git 仓库拉取项目
- 支持私有仓库的身份验证和凭证管理
- 自动保存凭证，下次自动登录
- 允许用户选择常用开发工具和库（ESLint、Prettier、TypeScript等）
- 自动生成工具配置文件和安装依赖
- 支持配置文件预设项目创建选项
- 命令行自动补全功能
- 项目初始化后的详细指导
- 完善的错误处理和日志记录
- 自动检查脚手架工具版本更新
- 自定义项目配置
- 自动安装依赖
- Node版本检查
- 在执行 npm 命令时检测 Node 版本
- 支持多种包管理器（npm、yarn、pnpm）

## 安装

### 要求

- Node.js 16.20.1 (推荐使用此版本)

```bash
# 全局安装
npm install -g ybm-cli

# 或者使用yarn
yarn global add ybm-cli

# 或者使用pnpm
pnpm add -g ybm-cli
```

[![NPM](https://nodei.co/npm/ybm-cli.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/ybm-cli)

## 新版本特性 (v1.0.7)

- **完整的TypeScript支持**：为所有框架添加了TypeScript模板
- **自动TypeScript转换**：将JavaScript项目自动转换为TypeScript项目
- **智能类型推断**：根据代码上下文添加基本类型声明
- **框架特定优化**：为每个框架提供专门的TypeScript集成

## 快速开始

```bash
# 全局安装
npm install -g ybm-cli

# 创建新项目
ybm create my-project

# 按照提示选择项目模板和配置
```

```bash
# 创建TypeScript项目
ybm create my-ts-project --template vue3-vite-ts
```

## 使用方法

### 创建新项目

```bash
# 基本用法
ybm create my-project

# 指定模板
ybm create my-project --template vue3-vite

# 强制覆盖已存在的目录
ybm create my-project --force
```

### 从远程仓库拉取项目

```bash
# 基本用法
ybm clone https://github.com/username/repo my-project

# 指定分支
ybm clone https://github.com/username/repo --branch develop

# 强制覆盖已存在的目录
ybm clone https://github.com/username/repo --force

# 指定包管理器
ybm clone https://github.com/username/repo --package-manager yarn

# 跳过依赖安装
ybm clone https://github.com/username/repo --skip-install
```

### 列出可用模板

```bash
ybm list
```

### 管理Git凭证

```bash
# 列出已存储的凭证
ybm credentials list

# 添加新的凭证
ybm credentials add

# 删除已存储的凭证
ybm credentials remove
```

### create 命令可用选项

- `--template, -t`: 指定项目模板
  - JavaScript模板: `vue3-vite`, `vue2-webpack`, `react`, `svelte`, `solidjs`
  - TypeScript模板: `vue3-vite-ts`, `vue2-webpack-ts`, `react-ts`, `svelte-ts`, `solidjs-ts`
- `--force, -f`: 强制覆盖已存在的目录
- `--package-manager, -p`: 指定包管理器（npm, yarn, pnpm）
- `--skip-install, -s`: 跳过依赖安装

### 使用TypeScript

YBM CLI 支持两种使用TypeScript的方式：

1. **选择TypeScript模板**：直接选择带有TypeScript的项目模板

   ```bash
   ybm create my-ts-project --template vue3-vite-ts
   ```

2. **在创建项目时启用TypeScript**：在交互式提示中选择TypeScript

   ```bash
   ybm create my-project
   # 在提示中选择"TypeScript"选项
   ```

当您选择启用TypeScript时，YBM CLI会：

- 生成适当的TypeScript配置文件（tsconfig.json）
- 将JavaScript文件转换为TypeScript文件
- 添加基本的类型声明
- 安装必要的TypeScript依赖

#### TypeScript转换功能

YBM CLI v1.0.7新增了强大的TypeScript转换功能，可以自动将JavaScript项目转换为TypeScript项目：

- **自动文件转换**：将.js/.jsx文件自动转换为.ts/.tsx文件
- **智能类型推断**：根据代码上下文添加基本类型声明
- **框架适配**：
  - Vue：添加defineComponent和PropType类型
  - React：添加React.FC和事件类型
  - Svelte：添加TypeScript支持到Svelte组件
  - SolidJS：添加Component类型和信号类型

示例转换：

```javascript
// 转换前 (JavaScript)
function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

const Counter = (props) => {
  const [count, setCount] = useState(0)

  function handleClick(event) {
    setCount(count + 1)
  }

  return <button onClick={handleClick}>Count: {count}</button>
}
```

```typescript
// 转换后 (TypeScript)
function formatDate(date: any): string {
  return new Date(date).toLocaleDateString()
}

const Counter: React.FC<{[key: string]: any}> = (props) => {
  const [count, setCount] = useState<number>(0)

  function handleClick(event: any): void {
    setCount(count + 1)
  }

  return <button onClick={handleClick}>Count: {count}</button>
}
```

### 可选的开发工具和库

创建项目时，您可以选择以下开发工具和库：

- **TypeScript**: 添加TypeScript支持
  - 自动生成tsconfig.json配置文件
  - 将JavaScript文件转换为TypeScript文件
  - 自动添加基本类型声明
  - 支持Vue、React、Svelte和SolidJS的TypeScript集成
- **代码规范工具**: 选择ESLint或其他代码规范工具
- **代码格式化工具**: 选择Prettier或其他代码格式化工具
- **测试框架**: 选择Jest、Vitest等测试框架
- **CSS预处理器**: 选择SCSS/SASS、Less或Tailwind CSS
  - SCSS/SASS: 自动生成变量、混合和示例文件
  - Less: 自动生成变量、混合和示例文件
  - Tailwind CSS: 自动配置Tailwind和PostCSS
- **UI框架**: 选择适用于您项目模板的UI框架

### clone 命令可用选项

- `--branch, -b`: 指定要拉取的分支（默认为 main）
- `--force, -f`: 强制覆盖已存在的目录
- `--package-manager, -p`: 指定包管理器（npm, yarn, pnpm）
- `--skip-install, -s`: 跳过依赖安装

### completion 命令

管理命令行自动补全功能。

```bash
# 安装自动补全
ybm completion install

# 卸载自动补全
ybm completion uninstall
```

### 配置文件

脚手架工具支持使用配置文件预设项目创建选项。配置文件可以放置在全局目录（`~/.ybmrc`）或当前目录（`.ybmrc`）。

配置文件示例：

```json
{
  "template": "vue3-vite",
  "author": "Your Name",
  "features": ["linter", "formatter", "typescript"],
  "tools": {
    "typescript": true,
    "linter": "eslint",
    "formatter": "prettier",
    "testing": "jest",
    "cssPreprocessor": "scss",
    "uiFramework": "element-plus"
  }
}
```

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/luoleyan/ybm-cli.git
cd ybm-cli

# 安装依赖
npm install

# 链接到全局
npm link
```

## 支持的模板

### 本地模板

#### JavaScript模板

- Vue 3 + Vite - 基于Vue 3和Vite的项目模板
- Vue 2 + Webpack - 基于Vue 2和Webpack的项目模板
- React - 基于React + Vite的项目模板
- Svelte - 基于Svelte + Vite的项目模板
- SolidJS - 基于SolidJS + Vite的项目模板

#### TypeScript模板

- Vue 3 + TypeScript + Vite - 基于Vue 3、TypeScript和Vite的项目模板
- Vue 2 + TypeScript + Webpack - 基于Vue 2、TypeScript和Webpack的项目模板
- React + TypeScript - 基于React、TypeScript和Vite的项目模板
- Svelte + TypeScript - 基于Svelte、TypeScript和Vite的项目模板
- SolidJS + TypeScript - 基于SolidJS、TypeScript和Vite的项目模板

### 远程模板

#### 远程JavaScript模板

- Vue3 + Vite - 基于Vue3和Vite的项目模板
- React + Vite - 基于React和Vite的项目模板
- Svelte + Vite - 基于Svelte和Vite的项目模板
- SolidJS + Vite - 基于SolidJS和Vite的项目模板
- Vue2 + Webpack - 基于Vue2和Webpack的项目模板

#### 远程TypeScript模板

- Vue3 + TypeScript + Vite - 基于Vue3、TypeScript和Vite的项目模板
- React + TypeScript + Vite - 基于React、TypeScript和Vite的项目模板
- Svelte + TypeScript + Vite - 基于Svelte、TypeScript和Vite的项目模板
- SolidJS + TypeScript + Vite - 基于SolidJS、TypeScript和Vite的项目模板
- Vue2 + TypeScript + Webpack - 基于Vue2、TypeScript和Webpack的项目模板

使用 `ybm list` 命令可以查看所有可用的模板。

## 贡献

欢迎提交问题和拉取请求！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解更多信息。

## 版本历史

### 最新版本 v1.0.7 (2024-05-30)

- 为所有框架添加了TypeScript模板（Vue 3、Vue 2、React、Svelte、SolidJS）
- 添加了TypeScript文件转换功能，支持将JavaScript项目转换为TypeScript项目
- 改进了TypeScript类型声明，自动添加基本类型
- 添加了TypeScript转换的单元测试
- 改进了错误处理，提供更详细的错误信息和建议

查看 [CHANGELOG.md](CHANGELOG.md) 了解详细的变更历史。

## 许可证

MIT
