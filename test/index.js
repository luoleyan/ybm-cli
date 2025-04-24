#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

// 测试目录
const TEST_DIR = path.join(__dirname, 'test-project');

// 清理测试目录
function cleanup() {
  if (fs.existsSync(TEST_DIR)) {
    fs.removeSync(TEST_DIR);
  }
}

// 运行命令
function runCommand(command) {
  console.log(chalk.blue(`运行命令: ${command}`));
  try {
    // 将ybm命令替换为直接调用本地的bin/ybm.js
    const localCommand = command.replace(/^ybm/, 'node ' + path.join(__dirname, '../bin/ybm.js'));
    console.log(chalk.blue(`执行本地命令: ${localCommand}`));
    execSync(localCommand, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(chalk.red(`命令执行失败: ${command}`));
    console.error(error);
    return false;
  }
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

// 主测试函数
async function runTests() {
  console.log(chalk.green('开始测试 ybm-cli...'));

  // 清理测试目录
  cleanup();

  // 运行测试
  const helpResult = testHelp();
  const versionResult = testVersion();
  const listResult = testList();

  // 清理测试目录
  cleanup();

  // 输出结果
  console.log('\n测试结果:');
  console.log(`帮助命令: ${helpResult ? chalk.green('通过') : chalk.red('失败')}`);
  console.log(`版本命令: ${versionResult ? chalk.green('通过') : chalk.red('失败')}`);
  console.log(`列表命令: ${listResult ? chalk.green('通过') : chalk.red('失败')}`);

  // 总结
  if (helpResult && versionResult && listResult) {
    console.log(chalk.green('\n所有测试通过!'));
    process.exit(0);
  } else {
    console.log(chalk.red('\n测试失败!'));
    process.exit(1);
  }
}

// 运行测试
runTests().catch(error => {
  console.error(chalk.red('测试过程中发生错误:'));
  console.error(error);
  process.exit(1);
});
