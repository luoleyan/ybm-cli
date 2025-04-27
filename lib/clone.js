const path = require('path');
const fs = require('fs-extra');
const ora = require('ora');
const chalk = require('chalk');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);
const inquirer = require('inquirer');
const { checkNodeVersionForNpm } = require('./utils');
const { checkAuthRequired, handleAuthenticatedRepo } = require('./git-credentials');

/**
 * 检查git是否已安装
 * @returns {Promise<boolean>} git是否已安装
 */
async function checkGitInstalled() {
  try {
    await execPromise('git --version');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * 从远程仓库拉取项目
 * @param {string} repoUrl - 仓库URL
 * @param {string} projectName - 项目名称
 * @param {object} options - 命令行选项
 */
async function clone(repoUrl, projectName, options) {
  // 如果没有提供项目名称，从仓库URL中提取
  if (!projectName) {
    projectName = path.basename(repoUrl, '.git');
  }

  // 获取当前工作目录
  const cwd = process.cwd();
  // 项目目标路径
  const targetDir = path.join(cwd, projectName);

  // 检查目录是否已存在
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir);
    } else {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `目标目录 ${chalk.cyan(targetDir)} 已存在。请选择操作:`,
          choices: [
            { name: '覆盖', value: 'overwrite' },
            { name: '取消', value: 'cancel' }
          ]
        }
      ]);
      if (action === 'cancel') {
        return;
      } else if (action === 'overwrite') {
        console.log(`\n正在删除 ${chalk.cyan(targetDir)}...`);
        await fs.remove(targetDir);
      }
    }
  }

  // 克隆仓库
  const spinner = ora('正在克隆仓库...').start();
  try {
    // 检查git是否已安装
    const gitInstalled = await checkGitInstalled();
    if (!gitInstalled) {
      throw new Error('未检测到Git。请确保Git已安装并添加到系统PATH中。');
    }

    // 检查是否需要身份验证
    const authRequired = await checkAuthRequired(repoUrl);

    let cloneSuccess = false;

    if (authRequired) {
      spinner.info('该仓库需要身份验证');
      spinner.stop();

      // 处理需要身份验证的仓库
      cloneSuccess = await handleAuthenticatedRepo(repoUrl, options.branch, projectName);

      if (!cloneSuccess) {
        throw new Error('身份验证失败，无法克隆仓库。');
      }
    } else {
      // 构建git clone命令
      const branchOption = options.branch ? `-b ${options.branch}` : '';

      // 从URL中提取仓库路径，避免重复添加项目名称
      const repoPath = repoUrl.endsWith('.git') ? repoUrl : `${repoUrl}.git`;
      const cloneCommand = `git clone ${branchOption} ${repoPath} ${projectName}`;

      console.log(chalk.blue(`执行命令: ${cloneCommand}`));

      // 执行git clone命令
      await execPromise(cloneCommand);
      cloneSuccess = true;
      spinner.succeed('仓库克隆成功!');
    }

    // 安装依赖
    if (!options.skipInstall) {
      // 检查是否有package.json文件
      const pkgPath = path.join(targetDir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        // 检查Node版本是否符合要求
        try {
          await checkNodeVersionForNpm(pkgPath);

          // 安装依赖
          spinner.text = '正在安装依赖...';
          spinner.start();

          // 切换到目标目录
          process.chdir(targetDir);

          // 执行安装命令
          const packageManager = options.packageManager || 'npm';
          const installCommand = packageManager === 'yarn' ? 'yarn' :
                               packageManager === 'pnpm' ? 'pnpm install' : 'npm install';

          spinner.text = `正在使用 ${packageManager} 安装依赖...`;
          await execPromise(installCommand);
          spinner.succeed('依赖安装成功!');
        } catch (err) {
          spinner.warn(err.message);
          console.log(chalk.yellow('请手动安装依赖。'));
        }
      } else {
        spinner.info('未找到package.json文件，跳过依赖安装。');
      }
    }

    console.log('\n项目克隆完成!');
    console.log(`\n  cd ${chalk.cyan(projectName)}`);

    if (!options.skipInstall) {
      console.log('  npm start 或 npm run dev');
    } else {
      console.log('  npm install');
      console.log('  npm start 或 npm run dev');
    }
    console.log();
  } catch (error) {
    spinner.fail('项目克隆失败');
    console.error(error);
  }
}

module.exports = clone;
