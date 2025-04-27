const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const inquirer = require('inquirer');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);
const chalk = require('chalk');
const ora = require('ora');

// 凭证存储路径
const CREDENTIALS_DIR = path.join(os.homedir(), '.ybm-cli');
const CREDENTIALS_FILE = path.join(CREDENTIALS_DIR, 'git-credentials.json');

/**
 * 初始化凭证存储
 */
async function initCredentialsStorage() {
  try {
    await fs.ensureDir(CREDENTIALS_DIR);
    if (!await fs.pathExists(CREDENTIALS_FILE)) {
      await fs.writeJson(CREDENTIALS_FILE, {}, { spaces: 2 });
    }
  } catch (err) {
    console.error('初始化凭证存储失败:', err);
  }
}

/**
 * 从URL中提取主机名
 * @param {string} url - 仓库URL
 * @returns {string} 主机名
 */
function extractHostname(url) {
  try {
    // 移除协议前缀
    let hostname = url.replace(/^(https?:\/\/)?(www\.)?/, '');

    // 提取主机名部分
    hostname = hostname.split('/')[0].split(':')[0];

    return hostname;
  } catch (err) {
    return '';
  }
}

/**
 * 获取存储的凭证
 * @param {string} hostname - 主机名
 * @returns {object|null} 凭证对象或null
 */
async function getStoredCredentials(hostname) {
  try {
    await initCredentialsStorage();
    const credentials = await fs.readJson(CREDENTIALS_FILE);
    return credentials[hostname] || null;
  } catch (err) {
    console.error('读取凭证失败:', err);
    return null;
  }
}

/**
 * 存储凭证
 * @param {string} hostname - 主机名
 * @param {object} credentials - 凭证对象
 */
async function storeCredentials(hostname, credentials) {
  try {
    await initCredentialsStorage();
    const allCredentials = await fs.readJson(CREDENTIALS_FILE);
    allCredentials[hostname] = credentials;
    await fs.writeJson(CREDENTIALS_FILE, allCredentials, { spaces: 2 });
  } catch (err) {
    console.error('存储凭证失败:', err);
  }
}

/**
 * 配置Git凭证助手
 * @param {string} hostname - 主机名
 * @param {object} credentials - 凭证对象
 */
async function configureGitCredentialHelper(hostname, credentials) {
  try {
    // 使用Git凭证存储
    await execPromise(`git config --global credential.helper store`);

    // 创建凭证字符串
    const protocol = 'https';
    const { username, password } = credentials;
    const credentialUrl = `${protocol}://${username}:${password}@${hostname}`;

    // 将凭证添加到Git凭证存储
    const credentialHelper = path.join(os.homedir(), '.git-credentials');

    // 检查是否已存在相同主机名的凭证
    let existingCredentials = '';
    if (await fs.pathExists(credentialHelper)) {
      existingCredentials = await fs.readFile(credentialHelper, 'utf8');
    }

    // 如果不存在相同主机名的凭证，则添加
    if (!existingCredentials.includes(`${protocol}://${username}:`) ||
        !existingCredentials.includes(`@${hostname}`)) {
      await fs.appendFile(credentialHelper, credentialUrl + '\n');
    }
  } catch (err) {
    console.error('配置Git凭证助手失败:', err);
  }
}

/**
 * 检查是否需要身份验证
 * @param {string} repoUrl - 仓库URL
 * @returns {boolean} 是否需要身份验证
 */
async function checkAuthRequired(repoUrl) {
  try {
    // 尝试匿名访问仓库
    await execPromise(`git ls-remote --heads ${repoUrl}`);
    return false; // 如果成功，则不需要身份验证
  } catch (err) {
    // 检查错误消息是否表明需要身份验证
    return err.message.includes('Authentication failed') ||
           err.message.includes('could not read Username') ||
           err.message.includes('Permission denied') ||
           err.message.includes('请输入用户名') ||
           err.message.includes('fatal: Authentication failed');
  }
}

/**
 * 提示用户输入凭证
 * @param {string} hostname - 主机名
 * @returns {object} 凭证对象
 */
async function promptForCredentials(hostname) {
  console.log(chalk.yellow(`\n需要登录 ${hostname} 才能访问此仓库。`));

  const credentials = await inquirer.prompt([
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
      name: 'saveCredentials',
      type: 'confirm',
      message: '是否保存凭证以便下次自动登录?',
      default: true
    }
  ]);

  return credentials;
}

/**
 * 使用凭证克隆仓库
 * @param {string} repoUrl - 仓库URL
 * @param {string} branch - 分支名
 * @param {string} targetDir - 目标目录
 * @param {object} credentials - 凭证对象
 * @returns {Promise} 克隆结果
 */
async function cloneWithCredentials(repoUrl, branch, targetDir, credentials) {
  const spinner = ora('正在使用凭证克隆仓库...').start();

  try {
    // 提取主机名和路径
    const hostname = extractHostname(repoUrl);
    const { username, password } = credentials;

    // 构建带凭证的URL
    const urlObj = new URL(repoUrl.startsWith('http') ? repoUrl : `https://${repoUrl}`);
    urlObj.username = username;
    urlObj.password = password;
    const authenticatedUrl = urlObj.toString();

    // 构建git clone命令
    const branchOption = branch ? `-b ${branch}` : '';

    // 确保URL格式正确
    let repoPath = authenticatedUrl;
    if (!repoPath.endsWith('.git')) {
      repoPath = `${repoPath}.git`;
    }

    const cloneCommand = `git clone ${branchOption} ${repoPath} ${targetDir}`;
    console.log(chalk.blue(`执行命令: ${cloneCommand.replace(/\/\/.*?@/, '//****:****@')}`)); // 隐藏凭证

    // 执行git clone命令
    await execPromise(cloneCommand);
    spinner.succeed('仓库克隆成功!');
    return true;
  } catch (err) {
    spinner.fail('使用凭证克隆仓库失败');
    console.error(err.message);
    return false;
  }
}

/**
 * 处理需要身份验证的仓库
 * @param {string} repoUrl - 仓库URL
 * @param {string} branch - 分支名
 * @param {string} targetDir - 目标目录
 * @returns {Promise<boolean>} 是否成功克隆
 */
async function handleAuthenticatedRepo(repoUrl, branch, targetDir) {
  // 提取主机名
  const hostname = extractHostname(repoUrl);

  // 尝试获取存储的凭证
  let credentials = await getStoredCredentials(hostname);

  // 如果有存储的凭证，尝试使用它们
  if (credentials) {
    console.log(chalk.blue(`使用存储的 ${hostname} 凭证...`));

    // 尝试使用存储的凭证克隆
    const success = await cloneWithCredentials(repoUrl, branch, targetDir, credentials);

    if (success) {
      return true;
    } else {
      console.log(chalk.yellow('存储的凭证无效，请重新登录。'));
    }
  }

  // 提示用户输入凭证
  credentials = await promptForCredentials(hostname);

  // 尝试使用新凭证克隆
  const success = await cloneWithCredentials(repoUrl, branch, targetDir, credentials);

  if (success) {
    // 如果用户选择保存凭证
    if (credentials.saveCredentials) {
      // 存储凭证
      await storeCredentials(hostname, {
        username: credentials.username,
        password: credentials.password
      });

      // 配置Git凭证助手
      await configureGitCredentialHelper(hostname, {
        username: credentials.username,
        password: credentials.password
      });

      console.log(chalk.green(`凭证已保存，下次将自动登录 ${hostname}。`));
    }

    return true;
  }

  return false;
}

module.exports = {
  checkAuthRequired,
  handleAuthenticatedRepo,
  extractHostname,
  getStoredCredentials,
  storeCredentials,
  configureGitCredentialHelper
};
