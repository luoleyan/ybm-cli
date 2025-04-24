const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);
const { toolsConfig, getUIFrameworkChoices, getTypeScriptPackages, getTestingPackages, getCSSPreprocessorPackages } = require('./tools-config');
const { checkNodeVersionForNpm } = require('./utils');

/**
 * 生成ESLint配置文件
 * @param {string} targetDir - 目标目录
 * @param {string} linter - 代码规范工具
 * @param {boolean} useTypeScript - 是否使用TypeScript
 * @param {boolean} usePrettier - 是否使用Prettier
 */
async function generateESLintConfig(targetDir, linter, useTypeScript, usePrettier) {
  if (linter === 'none') return;

  const configPath = path.join(targetDir, '.eslintrc.js');
  let config = 'module.exports = {\n';

  // 基本配置
  config += '  root: true,\n';
  config += '  env: {\n';
  config += '    node: true,\n';
  config += '    browser: true,\n';
  config += '  },\n';

  // 扩展
  config += '  extends: [\n';

  if (linter === 'eslint-airbnb') {
    config += "    'airbnb-base',\n";
  } else if (linter === 'eslint-standard') {
    config += "    'standard',\n";
  }

  if (useTypeScript) {
    config += "    'plugin:@typescript-eslint/recommended',\n";
  }

  if (usePrettier) {
    config += "    'plugin:prettier/recommended',\n";
  }

  config += '  ],\n';

  // 解析器
  if (useTypeScript) {
    config += '  parser: \'@typescript-eslint/parser\',\n';
  }

  // 插件
  config += '  plugins: [\n';
  if (useTypeScript) {
    config += "    '@typescript-eslint',\n";
  }
  config += '  ],\n';

  // 规则
  config += '  rules: {\n';
  config += '    // 自定义规则\n';
  config += '  }\n';
  config += '};\n';

  await fs.writeFile(configPath, config);
}

/**
 * 生成Prettier配置文件
 * @param {string} targetDir - 目标目录
 */
async function generatePrettierConfig(targetDir) {
  const configPath = path.join(targetDir, '.prettierrc');
  const config = {
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5',
    printWidth: 100,
    endOfLine: 'lf'
  };

  await fs.writeJson(configPath, config, { spaces: 2 });
}

/**
 * 生成TypeScript配置文件
 * @param {string} targetDir - 目标目录
 * @param {string} template - 模板名称
 */
async function generateTypeScriptConfig(targetDir, template) {
  const configPath = path.join(targetDir, 'tsconfig.json');

  // 检查是否已存在tsconfig.json
  if (await fs.pathExists(configPath)) {
    return;
  }

  let config = {};

  if (template.startsWith('vue')) {
    config = {
      compilerOptions: {
        target: 'esnext',
        module: 'esnext',
        strict: true,
        jsx: 'preserve',
        moduleResolution: 'node',
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        forceConsistentCasingInFileNames: true,
        useDefineForClassFields: true,
        sourceMap: true,
        baseUrl: '.',
        paths: {
          '@/*': ['src/*']
        },
        lib: ['esnext', 'dom', 'dom.iterable', 'scripthost']
      },
      include: [
        'src/**/*.ts',
        'src/**/*.tsx',
        'src/**/*.vue'
      ],
      exclude: [
        'node_modules'
      ]
    };
  } else if (template === 'react') {
    config = {
      compilerOptions: {
        target: 'ESNext',
        useDefineForClassFields: true,
        lib: ['DOM', 'DOM.Iterable', 'ESNext'],
        allowJs: false,
        skipLibCheck: true,
        esModuleInterop: false,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        module: 'ESNext',
        moduleResolution: 'Node',
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        baseUrl: '.',
        paths: {
          '@/*': ['src/*']
        }
      },
      include: ['src'],
      exclude: ['node_modules']
    };
  } else if (template === 'svelte') {
    config = {
      extends: '@tsconfig/svelte/tsconfig.json',
      compilerOptions: {
        target: 'ESNext',
        useDefineForClassFields: true,
        module: 'ESNext',
        resolveJsonModule: true,
        allowJs: true,
        checkJs: true,
        isolatedModules: true,
        baseUrl: '.',
        paths: {
          '@/*': ['src/*']
        }
      },
      include: ['src/**/*.d.ts', 'src/**/*.ts', 'src/**/*.js', 'src/**/*.svelte'],
      exclude: ['node_modules']
    };
  } else if (template === 'solidjs') {
    config = {
      compilerOptions: {
        strict: true,
        target: 'ESNext',
        module: 'ESNext',
        moduleResolution: 'node',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        jsx: 'preserve',
        jsxImportSource: 'solid-js',
        types: ['vite/client'],
        noEmit: true,
        isolatedModules: true,
        baseUrl: '.',
        paths: {
          '@/*': ['src/*']
        }
      },
      include: ['src'],
      exclude: ['node_modules']
    };
  }

  await fs.writeJson(configPath, config, { spaces: 2 });
}

/**
 * 生成Tailwind CSS配置文件
 * @param {string} targetDir - 目标目录
 */
async function generateTailwindConfig(targetDir) {
  const configPath = path.join(targetDir, 'tailwind.config.js');
  const config = `module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx,svelte}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

  await fs.writeFile(configPath, config);

  // 创建PostCSS配置
  const postcssConfigPath = path.join(targetDir, 'postcss.config.js');
  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;

  await fs.writeFile(postcssConfigPath, postcssConfig);

  // 创建Tailwind CSS入口文件
  const cssDir = path.join(targetDir, 'src/assets');
  await fs.ensureDir(cssDir);

  const tailwindCssPath = path.join(cssDir, 'tailwind.css');
  const tailwindCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  /* 自定义组件样式 */
}`;

  await fs.writeFile(tailwindCssPath, tailwindCss);
}

/**
 * 生成Jest配置文件
 * @param {string} targetDir - 目标目录
 * @param {string} template - 模板名称
 * @param {boolean} useTypeScript - 是否使用TypeScript
 */
async function generateJestConfig(targetDir, template, useTypeScript) {
  const configPath = path.join(targetDir, 'jest.config.js');
  let config = 'module.exports = {\n';

  // 基本配置
  config += '  testEnvironment: "jsdom",\n';
  config += '  transform: {\n';

  if (template.startsWith('vue')) {
    config += '    "^.+\\.vue$": "@vue/vue3-jest",\n';
  }

  if (useTypeScript) {
    config += '    "^.+\\.tsx?$": "ts-jest",\n';
  }

  config += '    "^.+\\.jsx?$": "babel-jest"\n';
  config += '  },\n';

  // 模块名称映射
  config += '  moduleNameMapper: {\n';
  config += '    "^@/(.*)$": "<rootDir>/src/$1"\n';
  config += '  },\n';

  // 测试匹配
  config += '  testMatch: [\n';
  config += '    "**/__tests__/**/*.[jt]s?(x)",\n';
  config += '    "**/?(*.)+(spec|test).[jt]s?(x)"\n';
  config += '  ],\n';

  // 覆盖率收集
  config += '  collectCoverageFrom: [\n';
  config += '    "src/**/*.{js,jsx,ts,tsx,vue}",\n';
  config += '    "!src/**/*.d.ts"\n';
  config += '  ]\n';

  config += '};\n';

  await fs.writeFile(configPath, config);

  // 创建测试目录和示例测试
  const testDir = path.join(targetDir, 'tests/unit');
  await fs.ensureDir(testDir);

  const exampleTestPath = path.join(testDir, `example.${useTypeScript ? 'spec.ts' : 'spec.js'}`);
  const exampleTest = `describe('Example Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});\n`;

  await fs.writeFile(exampleTestPath, exampleTest);
}

/**
 * 生成Vitest配置文件
 * @param {string} targetDir - 目标目录
 * @param {boolean} useTypeScript - 是否使用TypeScript
 */
async function generateVitestConfig(targetDir, useTypeScript) {
  const configPath = path.join(targetDir, 'vitest.config.js');
  const extension = useTypeScript ? 'ts' : 'js';

  const config = `import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});\n`;

  await fs.writeFile(configPath, config);

  // 创建测试目录和示例测试
  const testDir = path.join(targetDir, 'tests/unit');
  await fs.ensureDir(testDir);

  const exampleTestPath = path.join(testDir, `example.test.${extension}`);
  const exampleTest = `import { describe, it, expect } from 'vitest';

describe('Example Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
});\n`;

  await fs.writeFile(exampleTestPath, exampleTest);
}

/**
 * 更新package.json添加脚本和依赖
 * @param {string} targetDir - 目标目录
 * @param {object} tools - 工具选择
 */
async function updatePackageJson(targetDir, tools) {
  const pkgPath = path.join(targetDir, 'package.json');

  if (!await fs.pathExists(pkgPath)) {
    return;
  }

  const pkg = await fs.readJson(pkgPath);

  // 添加脚本
  pkg.scripts = pkg.scripts || {};

  // 添加测试脚本
  if (tools.testing === 'jest') {
    pkg.scripts.test = 'jest';
    pkg.scripts['test:coverage'] = 'jest --coverage';
  } else if (tools.testing === 'vitest') {
    pkg.scripts.test = 'vitest run';
    pkg.scripts['test:coverage'] = 'vitest run --coverage';
    pkg.scripts['test:watch'] = 'vitest';
  }

  // 添加lint脚本
  if (tools.linter !== 'none') {
    pkg.scripts.lint = 'eslint --ext .js,.jsx,.ts,.tsx,.vue src/';
    pkg.scripts['lint:fix'] = 'eslint --ext .js,.jsx,.ts,.tsx,.vue src/ --fix';
  }

  // 添加format脚本
  if (tools.formatter.startsWith('prettier')) {
    pkg.scripts.format = 'prettier --write "src/**/*.{js,jsx,ts,tsx,vue,css,scss,less}"';
  }

  // 添加TypeScript相关脚本
  if (tools.typescript) {
    if (pkg.scripts.build) {
      // 如果是Vue项目
      if (pkg.dependencies && pkg.dependencies.vue) {
        pkg.scripts['type-check'] = 'vue-tsc --noEmit';
      } else {
        pkg.scripts['type-check'] = 'tsc --noEmit';
      }
    }
  }

  await fs.writeJson(pkgPath, pkg, { spaces: 2 });
}

/**
 * 生成SCSS示例文件
 * @param {string} targetDir - 目标目录
 */
async function generateScssFiles(targetDir) {
  const cssDir = path.join(targetDir, 'src/assets/styles');
  await fs.ensureDir(cssDir);

  // 创建main.scss
  const mainScssPath = path.join(cssDir, 'main.scss');
  const mainScss = `// 导入变量和混合
@import './variables';
@import './mixins';

// 全局样式
body {
  font-family: $font-family-base;
  font-size: $font-size-base;
  line-height: $line-height-base;
  color: $text-color;
  background-color: $bg-color;
}

// 使用混合
.container {
  @include container();
}

// 嵌套示例
.button {
  padding: 10px 15px;
  border-radius: 4px;

  &.primary {
    background-color: $primary-color;
    color: white;

    &:hover {
      background-color: darken($primary-color, 10%);
    }
  }

  &.secondary {
    background-color: $secondary-color;
    color: white;

    &:hover {
      background-color: darken($secondary-color, 10%);
    }
  }
}`;

  await fs.writeFile(mainScssPath, mainScss);

  // 创建_variables.scss
  const variablesScssPath = path.join(cssDir, '_variables.scss');
  const variablesScss = `// 颜色
$primary-color: #3498db;
$secondary-color: #2ecc71;
$text-color: #333333;
$bg-color: #ffffff;

// 字体
$font-family-base: 'Helvetica Neue', Helvetica, Arial, sans-serif;
$font-size-base: 16px;
$line-height-base: 1.5;

// 断点
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;`;

  await fs.writeFile(variablesScssPath, variablesScss);

  // 创建_mixins.scss
  const mixinsScssPath = path.join(cssDir, '_mixins.scss');
  const mixinsScss = `// 响应式容器
@mixin container() {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;

  @media (min-width: $breakpoint-sm) {
    max-width: 540px;
  }

  @media (min-width: $breakpoint-md) {
    max-width: 720px;
  }

  @media (min-width: $breakpoint-lg) {
    max-width: 960px;
  }

  @media (min-width: $breakpoint-xl) {
    max-width: 1140px;
  }
}

// 文本截断
@mixin text-truncate() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 盒子阴影
@mixin box-shadow($shadow...) {
  box-shadow: $shadow;
}`;

  await fs.writeFile(mixinsScssPath, mixinsScss);
}

/**
 * 生成Less示例文件
 * @param {string} targetDir - 目标目录
 */
async function generateLessFiles(targetDir) {
  const cssDir = path.join(targetDir, 'src/assets/styles');
  await fs.ensureDir(cssDir);

  // 创建main.less
  const mainLessPath = path.join(cssDir, 'main.less');
  const mainLess = `// 导入变量和混合
@import './variables.less';
@import './mixins.less';

// 全局样式
body {
  font-family: @font-family-base;
  font-size: @font-size-base;
  line-height: @line-height-base;
  color: @text-color;
  background-color: @bg-color;
}

// 使用混合
.container {
  .container();
}

// 嵌套示例
.button {
  padding: 10px 15px;
  border-radius: 4px;

  &.primary {
    background-color: @primary-color;
    color: white;

    &:hover {
      background-color: darken(@primary-color, 10%);
    }
  }

  &.secondary {
    background-color: @secondary-color;
    color: white;

    &:hover {
      background-color: darken(@secondary-color, 10%);
    }
  }
}`;

  await fs.writeFile(mainLessPath, mainLess);

  // 创建variables.less
  const variablesLessPath = path.join(cssDir, 'variables.less');
  const variablesLess = `// 颜色
@primary-color: #3498db;
@secondary-color: #2ecc71;
@text-color: #333333;
@bg-color: #ffffff;

// 字体
@font-family-base: 'Helvetica Neue', Helvetica, Arial, sans-serif;
@font-size-base: 16px;
@line-height-base: 1.5;

// 断点
@breakpoint-sm: 576px;
@breakpoint-md: 768px;
@breakpoint-lg: 992px;
@breakpoint-xl: 1200px;`;

  await fs.writeFile(variablesLessPath, variablesLess);

  // 创建mixins.less
  const mixinsLessPath = path.join(cssDir, 'mixins.less');
  const mixinsLess = `// 响应式容器
.container() {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;

  @media (min-width: @breakpoint-sm) {
    max-width: 540px;
  }

  @media (min-width: @breakpoint-md) {
    max-width: 720px;
  }

  @media (min-width: @breakpoint-lg) {
    max-width: 960px;
  }

  @media (min-width: @breakpoint-xl) {
    max-width: 1140px;
  }
}

// 文本截断
.text-truncate() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 盒子阴影
.box-shadow(@shadow) {
  box-shadow: @shadow;
}`;

  await fs.writeFile(mixinsLessPath, mixinsLess);
}

/**
 * 更新入口文件以导入CSS
 * @param {string} targetDir - 目标目录
 * @param {string} template - 模板名称
 * @param {string} cssPreprocessor - CSS预处理器
 */
async function updateEntryFile(targetDir, template, cssPreprocessor) {
  if (cssPreprocessor === 'none') return;

  let entryFile;

  // 确定入口文件路径
  if (template === 'vue3-vite') {
    entryFile = path.join(targetDir, 'src/main.js');
  } else if (template === 'vue2-webpack') {
    entryFile = path.join(targetDir, 'src/main.js');
  } else if (template === 'react') {
    entryFile = path.join(targetDir, 'src/index.jsx');
  } else if (template === 'svelte') {
    entryFile = path.join(targetDir, 'src/main.js');
  } else if (template === 'solidjs') {
    entryFile = path.join(targetDir, 'src/index.jsx');
  }

  if (!entryFile || !await fs.pathExists(entryFile)) {
    return;
  }

  // 读取入口文件
  let content = await fs.readFile(entryFile, 'utf8');
  let importStatement = '';

  // 根据Css预处理器生成对应的导入语句
  switch (cssPreprocessor) {
    case 'scss':
      importStatement = "import './assets/styles/main.scss';";
      // 生成SCSS示例文件
      await generateScssFiles(targetDir);
      break;
    case 'less':
      importStatement = "import './assets/styles/main.less';";
      // 生成Less示例文件
      await generateLessFiles(targetDir);
      break;
    case 'tailwind':
      importStatement = "import './assets/tailwind.css';";
      break;
  }

  // 检查是否已经导入了相应的CSS文件
  if (importStatement && !content.includes(importStatement.replace("import '", '').replace("';", ''))) {
    // 在第一个导入语句后添加
    content = content.replace(
      /^(import .+;)$/m,
      `$1\n${importStatement}`
    );

    // 写回文件
    await fs.writeFile(entryFile, content);
  }
}

/**
 * 获取工具依赖包
 * @param {string} template - 模板名称
 * @param {object} tools - 工具选择
 * @returns {object} 依赖包对象
 */
function getToolDependencies(template, tools) {
  const dependencies = [];
  const devDependencies = [];

  // 添加代码规范工具依赖
  if (tools.linter !== 'none') {
    const linterChoice = toolsConfig.linter.choices.find(choice => choice.value === tools.linter);
    if (linterChoice && linterChoice.packages) {
      devDependencies.push(...linterChoice.packages);
    }
  }

  // 添加代码格式化工具依赖
  if (tools.formatter !== 'none') {
    const formatterChoice = toolsConfig.formatter.choices.find(choice => choice.value === tools.formatter);
    if (formatterChoice && formatterChoice.packages) {
      devDependencies.push(...formatterChoice.packages);
    }
  }

  // 添加TypeScript依赖
  if (tools.typescript) {
    const tsPackages = getTypeScriptPackages(template);
    devDependencies.push(...tsPackages);
  }

  // 添加测试框架依赖
  if (tools.testing !== 'none') {
    const testingPackages = getTestingPackages(template, tools.testing);
    devDependencies.push(...testingPackages);
  }

  // 添加CSS预处理器依赖
  if (tools.cssPreprocessor !== 'none') {
    const cssPackages = getCSSPreprocessorPackages(template, tools.cssPreprocessor);
    devDependencies.push(...cssPackages);
  }

  // 添加UI框架依赖
  if (tools.uiFramework !== 'none') {
    const uiFrameworkChoices = getUIFrameworkChoices(template);
    const uiChoice = uiFrameworkChoices.find(choice => choice.value === tools.uiFramework);
    if (uiChoice && uiChoice.packages) {
      dependencies.push(...uiChoice.packages);
    }
  }

  return { dependencies, devDependencies };
}

/**
 * 安装工具依赖
 * @param {string} targetDir - 目标目录
 * @param {string} packageManager - 包管理器
 * @param {Array} dependencies - 依赖包
 * @param {Array} devDependencies - 开发依赖包
 * @returns {Promise} 安装结果
 */
async function installToolDependencies(targetDir, packageManager, dependencies, devDependencies) {
  const spinner = ora('正在安装工具依赖...').start();

  try {
    // 切换到目标目录
    process.chdir(targetDir);

    // 检查Node版本是否符合要求
    const pkgPath = path.join(targetDir, 'package.json');
    await checkNodeVersionForNpm(pkgPath);

    // 安装依赖
    if (dependencies.length > 0) {
      const depsString = dependencies.join(' ');
      const installCommand = packageManager === 'yarn' ? `yarn add ${depsString}` :
                           packageManager === 'pnpm' ? `pnpm add ${depsString}` : `npm install ${depsString} --save`;

      spinner.text = `正在安装依赖: ${depsString}`;
      await execPromise(installCommand);
    }

    // 安装开发依赖
    if (devDependencies.length > 0) {
      const devDepsString = devDependencies.join(' ');
      const installDevCommand = packageManager === 'yarn' ? `yarn add ${devDepsString} --dev` :
                              packageManager === 'pnpm' ? `pnpm add ${devDepsString} -D` : `npm install ${devDepsString} --save-dev`;

      spinner.text = `正在安装开发依赖: ${devDepsString}`;
      await execPromise(installDevCommand);
    }

    spinner.succeed('工具依赖安装成功');
    return true;
  } catch (err) {
    spinner.fail('工具依赖安装失败');
    console.error(chalk.red(err.message));
    // 抛出错误而不是返回false，确保错误能被上层函数捕获
    throw new Error(`工具依赖安装失败: ${err.message}`);
  }
}

/**
 * 生成工具配置文件
 * @param {string} targetDir - 目标目录
 * @param {string} template - 模板名称
 * @param {object} tools - 工具选择
 * @param {string} packageManager - 包管理器
 */
async function generateToolsConfig(targetDir, template, tools, packageManager = 'npm') {
  const spinner = ora('正在生成工具配置...').start();

  try {
    // 生成ESLint配置
    if (tools.linter !== 'none') {
      await generateESLintConfig(
        targetDir,
        tools.linter,
        tools.typescript,
        tools.formatter.startsWith('prettier')
      );
    }

    // 生成Prettier配置
    if (tools.formatter.startsWith('prettier')) {
      await generatePrettierConfig(targetDir);
    }

    // 生成TypeScript配置
    if (tools.typescript) {
      await generateTypeScriptConfig(targetDir, template);
    }

    // 生成Tailwind配置
    if (tools.cssPreprocessor === 'tailwind') {
      await generateTailwindConfig(targetDir);
    }

    // 生成测试配置
    if (tools.testing === 'jest') {
      await generateJestConfig(targetDir, template, tools.typescript);
    } else if (tools.testing === 'vitest') {
      await generateVitestConfig(targetDir, tools.typescript);
    }

    // 更新package.json
    await updatePackageJson(targetDir, tools);

    // 更新入口文件
    await updateEntryFile(targetDir, template, tools.cssPreprocessor);

    // 获取工具依赖
    const { dependencies, devDependencies } = getToolDependencies(template, tools);

    // 安装工具依赖
    if (dependencies.length > 0 || devDependencies.length > 0) {
      spinner.succeed('工具配置生成成功，正在安装依赖...');
      // 由于我们修改了installToolDependencies函数，它现在会在失败时抛出错误
      // 所以不需要检查返回值
      await installToolDependencies(targetDir, packageManager, dependencies, devDependencies);
      spinner.succeed('工具依赖安装完成');
    } else {
      spinner.succeed('工具配置生成成功');
    }
  } catch (err) {
    spinner.fail('工具配置生成失败');
    console.error(chalk.red('错误详情:'), err);
    throw new Error(`工具配置生成失败: ${err.message}`); // 抛出错误，让上层函数捕获
  }
}

module.exports = {
  generateToolsConfig
};
