#!/usr/bin/env node

const { execSync, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const os = require('os');
const assert = require('assert').strict;
const testConfig = require('./test-config');

// 测试目录
const TEST_DIR = path.join(os.tmpdir(), `ybm-cli-test-${Date.now()}`);
const TEST_PROJECT_NAME = 'test-project';
const TEST_PROJECT_DIR = path.join(TEST_DIR, TEST_PROJECT_NAME);

// 测试配置
const TEST_CONFIG = {
  // 创建项目测试配置
  create: {
    templates: ['vue3-vite', 'react', 'svelte', 'solidjs', 'vue2-webpack'],
    tsTemplates: ['vue3-vite-ts', 'react-ts', 'svelte-ts', 'solidjs-ts', 'vue2-webpack-ts'],
    features: ['typescript', 'linter', 'formatter', 'testing', 'cssPreprocessor', 'uiFramework']
  },
  // 克隆仓库测试配置
  clone: {
    repos: ['药帮忙', '豆芽']
  }
};

// 清理测试目录
function cleanup() {
  if (fs.existsSync(TEST_DIR)) {
    fs.removeSync(TEST_DIR);
  }
}

// 运行命令
function runCommand(command, options = {}) {
  console.log(chalk.blue(`运行命令: ${command}`));
  try {
    // 将ybm命令替换为直接调用本地的bin/ybm.js
    const localCommand = command.replace(/^ybm/, 'node ' + path.join(__dirname, '../bin/ybm.js'));
    console.log(chalk.blue(`执行本地命令: ${localCommand}`));

    const defaultOptions = {
      stdio: options.silent ? 'pipe' : 'inherit',
      cwd: options.cwd || process.cwd()
    };

    if (options.interactive) {
      // 对于需要交互的命令，使用spawnSync
      const parts = localCommand.split(' ');
      const cmd = parts[0];
      const args = parts.slice(1);

      const result = spawnSync(cmd, args, {
        ...defaultOptions,
        input: options.input || undefined
      });

      if (result.status !== 0) {
        console.error(chalk.red(`命令执行失败: ${command}`));
        if (result.stderr) console.error(result.stderr.toString());
        return false;
      }

      if (options.silent && result.stdout) {
        return result.stdout.toString();
      }

      return true;
    } else {
      // 对于不需要交互的命令，使用execSync
      const result = execSync(localCommand, defaultOptions);

      if (options.silent && result) {
        return result.toString();
      }

      return true;
    }
  } catch (error) {
    console.error(chalk.red(`命令执行失败: ${command}`));
    console.error(error);
    return false;
  }
}

// 检查文件是否存在
function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

// 检查文件内容是否包含特定字符串
function checkFileContains(filePath, content) {
  if (!checkFileExists(filePath)) return false;
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return fileContent.includes(content);
}

// 测试帮助命令
function testHelp() {
  console.log(chalk.yellow('\n测试帮助命令...'));
  return runCommand('ybm --help');
}

// 测试版本命令
function testVersion() {
  console.log(chalk.yellow('\n测试版本命令...'));
  return runCommand('ybm --version');
}

// 测试列表命令
function testList() {
  console.log(chalk.yellow('\n测试列表命令...'));
  return runCommand('ybm list');
}

// 测试创建项目命令
function testCreate() {
  console.log(chalk.yellow('\n测试创建项目命令...'));

  // 创建测试目录
  fs.ensureDirSync(TEST_DIR);

  // 测试基本创建命令
  const template = TEST_CONFIG.create.templates[0]; // 使用第一个模板进行测试
  const createResult = runCommand(`ybm create ${TEST_PROJECT_NAME} --template ${template} --skip-install`, { cwd: TEST_DIR });

  if (!createResult) return false;

  // 检查项目是否创建成功
  const projectExists = checkFileExists(TEST_PROJECT_DIR);
  const packageJsonExists = checkFileExists(path.join(TEST_PROJECT_DIR, 'package.json'));

  if (!projectExists || !packageJsonExists) {
    console.error(chalk.red('项目创建失败，关键文件不存在'));
    return false;
  }

  console.log(chalk.green('项目创建成功'));
  return true;
}

// 测试TypeScript支持
function testTypeScript() {
  console.log(chalk.yellow('\n测试TypeScript支持...'));

  // 清理之前的测试项目
  if (fs.existsSync(TEST_PROJECT_DIR)) {
    fs.removeSync(TEST_PROJECT_DIR);
  }

  // 创建TypeScript项目
  const tsTemplate = TEST_CONFIG.create.tsTemplates[0]; // 使用第一个TypeScript模板
  const createResult = runCommand(`ybm create ${TEST_PROJECT_NAME} --template ${tsTemplate} --skip-install`, { cwd: TEST_DIR });

  if (!createResult) return false;

  // 检查TypeScript配置文件是否存在
  const tsconfigExists = checkFileExists(path.join(TEST_PROJECT_DIR, 'tsconfig.json'));

  if (!tsconfigExists) {
    console.error(chalk.red('TypeScript配置文件不存在'));
    return false;
  }

  // 检查是否有.ts或.tsx文件
  const srcDir = path.join(TEST_PROJECT_DIR, 'src');
  if (!fs.existsSync(srcDir)) {
    console.error(chalk.red('src目录不存在'));
    return false;
  }

  let hasTsFiles = false;
  const files = fs.readdirSync(srcDir, { recursive: true });
  for (const file of files) {
    if (typeof file === 'string' && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      hasTsFiles = true;
      break;
    }
  }

  if (!hasTsFiles) {
    console.error(chalk.red('没有找到TypeScript文件'));
    return false;
  }

  console.log(chalk.green('TypeScript支持测试通过'));
  return true;
}

// 测试工具配置
function testToolsConfig() {
  console.log(chalk.yellow('\n测试工具配置...'));

  // 清理之前的测试项目
  if (fs.existsSync(TEST_PROJECT_DIR)) {
    fs.removeSync(TEST_PROJECT_DIR);
  }

  // 创建带有ESLint和Prettier的项目
  const template = TEST_CONFIG.create.templates[0];

  // 使用交互式命令模拟用户输入
  const input = Buffer.from(`${TEST_PROJECT_NAME}\nA test project\nTest User\ny\neslint-standard\nprettier\nnone\nnone\nnone\nn\n`);

  const createResult = runCommand(`ybm create`, {
    cwd: TEST_DIR,
    interactive: true,
    input: input
  });

  if (!createResult) return false;

  // 检查ESLint配置文件是否存在
  const eslintExists = checkFileExists(path.join(TEST_PROJECT_DIR, '.eslintrc.js'));

  // 检查Prettier配置文件是否存在
  const prettierExists = checkFileExists(path.join(TEST_PROJECT_DIR, '.prettierrc'));

  if (!eslintExists || !prettierExists) {
    console.error(chalk.red('工具配置文件不存在'));
    return false;
  }

  console.log(chalk.green('工具配置测试通过'));
  return true;
}

// 测试克隆命令
function testClone() {
  console.log(chalk.yellow('\n测试克隆命令...'));

  // 由于克隆需要访问远程仓库，这里只测试命令是否能正常运行
  const helpOutput = runCommand('ybm clone --help', { silent: true });

  if (!helpOutput || typeof helpOutput !== 'string') {
    console.error(chalk.red('克隆命令帮助信息获取失败'));
    return false;
  }

  // 检查帮助输出是否包含预期内容
  if (!helpOutput.includes('克隆仓库') || !helpOutput.includes('可用的预定义仓库')) {
    console.error(chalk.red('克隆命令帮助信息不完整'));
    return false;
  }

  console.log(chalk.green('克隆命令测试通过'));
  return true;
}

// 测试凭证管理命令
function testCredentials() {
  console.log(chalk.yellow('\n测试凭证管理命令...'));

  // 只测试帮助命令
  const helpOutput = runCommand('ybm credentials --help', { silent: true });

  if (!helpOutput || typeof helpOutput !== 'string') {
    console.error(chalk.red('凭证管理命令帮助信息获取失败'));
    return false;
  }

  // 检查帮助输出是否包含预期内容
  if (!helpOutput.includes('管理Git凭证') || !helpOutput.includes('可用操作')) {
    console.error(chalk.red('凭证管理命令帮助信息不完整'));
    return false;
  }

  console.log(chalk.green('凭证管理命令测试通过'));
  return true;
}

// 测试自动补全命令
function testCompletion() {
  console.log(chalk.yellow('\n测试自动补全命令...'));

  // 只测试帮助命令
  const helpOutput = runCommand('ybm completion --help', { silent: true });

  if (!helpOutput || typeof helpOutput !== 'string') {
    console.error(chalk.red('自动补全命令帮助信息获取失败'));
    return false;
  }

  // 检查帮助输出是否包含预期内容
  if (!helpOutput.includes('管理命令行自动补全') || !helpOutput.includes('可用操作')) {
    console.error(chalk.red('自动补全命令帮助信息不完整'));
    return false;
  }

  console.log(chalk.green('自动补全命令测试通过'));
  return true;
}

// 主测试函数
async function runTests() {
  console.log(chalk.green('开始测试 ybm-cli...'));

  // 清理测试目录
  cleanup();

  try {
    // 基本命令测试
    const helpResult = testHelp();
    const versionResult = testVersion();
    const listResult = testList();

    // 克隆命令测试
    let cloneResult = true;
    if (!testConfig.skip.clone) {
      cloneResult = testClone();
    } else {
      console.log(chalk.yellow('跳过克隆命令测试'));
    }

    // 凭证管理命令测试
    const credentialsResult = testCredentials();

    // 自动补全命令测试
    const completionResult = testCompletion();

    // 创建项目测试
    let createResult = true;
    if (!testConfig.skip.create) {
      createResult = testCreate();
    } else {
      console.log(chalk.yellow('跳过创建项目测试'));
    }

    // TypeScript支持测试
    let typeScriptResult = true;
    if (!testConfig.skip.typescript) {
      typeScriptResult = testTypeScript();
    } else {
      console.log(chalk.yellow('跳过TypeScript支持测试'));
    }

    // 工具配置测试
    let toolsConfigResult = true;
    if (!testConfig.skip.toolsConfig) {
      toolsConfigResult = testToolsConfig();
    } else {
      console.log(chalk.yellow('跳过工具配置测试'));
    }

    // 输出结果
    console.log('\n测试结果:');
    console.log(`帮助命令: ${helpResult ? chalk.green('通过') : chalk.red('失败')}`);
    console.log(`版本命令: ${versionResult ? chalk.green('通过') : chalk.red('失败')}`);
    console.log(`列表命令: ${listResult ? chalk.green('通过') : chalk.red('失败')}`);
    console.log(`克隆命令: ${cloneResult ? chalk.green('通过') : chalk.red('失败')}`);
    console.log(`凭证管理: ${credentialsResult ? chalk.green('通过') : chalk.red('失败')}`);
    console.log(`自动补全: ${completionResult ? chalk.green('通过') : chalk.red('失败')}`);
    console.log(`创建项目: ${createResult ? chalk.green('通过') : chalk.red('失败')}`);
    console.log(`TypeScript支持: ${typeScriptResult ? chalk.green('通过') : chalk.red('失败')}`);
    console.log(`工具配置: ${toolsConfigResult ? chalk.green('通过') : chalk.red('失败')}`);

    // 总结
    const allPassed = helpResult && versionResult && listResult &&
                      cloneResult && credentialsResult && completionResult &&
                      createResult && typeScriptResult && toolsConfigResult;

    if (allPassed) {
      console.log(chalk.green('\n所有测试通过!'));
      process.exit(0);
    } else {
      console.log(chalk.red('\n测试失败!'));
      process.exit(1);
    }
  } catch (error) {
    console.error(chalk.red('测试过程中发生错误:'));
    console.error(error);
    process.exit(1);
  } finally {
    // 清理测试目录
    cleanup();
  }
}

// 运行测试
runTests().catch(error => {
  console.error(chalk.red('测试过程中发生错误:'));
  console.error(error);
  process.exit(1);
});
