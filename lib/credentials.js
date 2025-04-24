const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const { extractHostname, getStoredCredentials, storeCredentials, configureGitCredentialHelper } = require('./git-credentials');

// 凭证存储路径
const CREDENTIALS_DIR = path.join(os.homedir(), '.ybm-cli');
const CREDENTIALS_FILE = path.join(CREDENTIALS_DIR, 'git-credentials.json');

/**
 * 列出所有存储的凭证
 */
async function listCredentials() {
  try {
    // 确保凭证文件存在
    if (!await fs.pathExists(CREDENTIALS_FILE)) {
      console.log(chalk.yellow('没有存储的凭证。'));
      return;
    }
    
    // 读取凭证
    const credentials = await fs.readJson(CREDENTIALS_FILE);
    const hostnames = Object.keys(credentials);
    
    if (hostnames.length === 0) {
      console.log(chalk.yellow('没有存储的凭证。'));
      return;
    }
    
    console.log(chalk.green('已存储的Git凭证:'));
    hostnames.forEach(hostname => {
      console.log(`  ${chalk.blue(hostname)}: ${chalk.cyan(credentials[hostname].username)}`);
    });
  } catch (err) {
    console.error(chalk.red('读取凭证失败:', err.message));
  }
}

/**
 * 添加新的凭证
 */
async function addCredential() {
  try {
    // 提示用户输入主机名和凭证
    const { hostname, username, password, saveToGit } = await inquirer.prompt([
      {
        name: 'hostname',
        type: 'input',
        message: '请输入Git主机名 (例如: github.com, gitee.com):',
        validate: input => input ? true : '主机名不能为空'
      },
      {
        name: 'username',
        type: 'input',
        message: '请输入用户名:',
        validate: input => input ? true : '用户名不能为空'
      },
      {
        name: 'password',
        type: 'password',
        message: '请输入密码或访问令牌:',
        validate: input => input ? true : '密码不能为空'
      },
      {
        name: 'saveToGit',
        type: 'confirm',
        message: '是否同时保存到Git凭证存储?',
        default: true
      }
    ]);
    
    // 存储凭证
    await storeCredentials(hostname, { username, password });
    
    // 如果用户选择保存到Git凭证存储
    if (saveToGit) {
      await configureGitCredentialHelper(hostname, { username, password });
    }
    
    console.log(chalk.green(`凭证已保存，下次将自动登录 ${hostname}。`));
  } catch (err) {
    console.error(chalk.red('添加凭证失败:', err.message));
  }
}

/**
 * 删除凭证
 */
async function removeCredential() {
  try {
    // 确保凭证文件存在
    if (!await fs.pathExists(CREDENTIALS_FILE)) {
      console.log(chalk.yellow('没有存储的凭证。'));
      return;
    }
    
    // 读取凭证
    const credentials = await fs.readJson(CREDENTIALS_FILE);
    const hostnames = Object.keys(credentials);
    
    if (hostnames.length === 0) {
      console.log(chalk.yellow('没有存储的凭证。'));
      return;
    }
    
    // 提示用户选择要删除的凭证
    const { hostname } = await inquirer.prompt([
      {
        name: 'hostname',
        type: 'list',
        message: '请选择要删除的凭证:',
        choices: hostnames.map(hostname => ({
          name: `${hostname} (${credentials[hostname].username})`,
          value: hostname
        }))
      }
    ]);
    
    // 确认删除
    const { confirm } = await inquirer.prompt([
      {
        name: 'confirm',
        type: 'confirm',
        message: `确定要删除 ${hostname} 的凭证吗?`,
        default: false
      }
    ]);
    
    if (!confirm) {
      console.log(chalk.yellow('操作已取消。'));
      return;
    }
    
    // 删除凭证
    delete credentials[hostname];
    await fs.writeJson(CREDENTIALS_FILE, credentials, { spaces: 2 });
    
    console.log(chalk.green(`已删除 ${hostname} 的凭证。`));
    
    // 提示用户可能需要手动清理Git凭证存储
    console.log(chalk.yellow(`注意: 您可能需要手动从Git凭证存储中删除凭证。`));
    console.log(chalk.yellow(`Git凭证存储通常位于: ${path.join(os.homedir(), '.git-credentials')}`));
  } catch (err) {
    console.error(chalk.red('删除凭证失败:', err.message));
  }
}

/**
 * 管理凭证
 * @param {string} action - 操作类型
 */
async function manageCredentials(action) {
  switch (action) {
    case 'list':
      await listCredentials();
      break;
    case 'add':
      await addCredential();
      break;
    case 'remove':
      await removeCredential();
      break;
    default:
      console.log(chalk.red(`未知操作: ${action}`));
      console.log(chalk.yellow('可用操作: list, add, remove'));
  }
}

module.exports = manageCredentials;
