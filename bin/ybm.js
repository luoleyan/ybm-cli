#!/usr/bin/env node
const inquirer = require('inquirer');
const { Command } = require('commander');
const program = new Command();
const chalk = require('chalk');
const figlet = require('figlet');
const logger = require('../lib/logger');
const { checkForUpdates } = require('../lib/update-checker');
const repoConfig = require('../lib/config/repo-config');

const { version } = require('../package.json');
// 初始化日志系统
logger.init();
logger.enableFileLogging(true);

// 检查Node.js版本
function checkNodeVersion() {
  const semver = require('semver');
  const requiredVersion = require('../package.json').engines.node;

  // 只显示警告，不再强制退出
  if (!semver.satisfies(process.version, requiredVersion)) {
    console.log(chalk.yellow('┌──────────────────────────────────────────────────────────────┐'));
    console.log(chalk.yellow('│                      版本兼容性警告                          │'));
    console.log(chalk.yellow('└──────────────────────────────────────────────────────────────┘'));
    console.log(chalk.yellow(
      `您当前的Node版本为 ${process.version}，推荐的版本要求是 ${requiredVersion}。`
    ));
    console.log(chalk.yellow(`某些功能可能无法正常工作，建议使用兼容的Node.js版本。`));
    console.log();
  }
}

// 显示欢迎信息
function showWelcome() {
  console.log(
    chalk.green(
      figlet.textSync('YBM CLI', { horizontalLayout: 'full' })
    )
  );
  console.log(chalk.blue(`YBM CLI 版本: ${version}`));
  console.log(chalk.blue('一个简单易用的前端项目脚手架工具\n'));
}

// 主函数
async function main() {
  checkNodeVersion();
  showWelcome();

  // 检查更新
  await checkForUpdates();

  program
    .version(version, '-v, --version', '输出当前版本号')
    .usage('<command> [options]')
    .description('一个前端项目脚手架工具');

  program
    .command('create <project-name>')
    .description('创建一个新项目')
    .option('-f, --force', '强制覆盖已存在的目录')
    .option('-t, --template <template>', '指定项目模板 (vue3-vite, vue2-webpack, react, svelte, solidjs)')
    .option('-p, --package-manager <manager>', '指定包管理器 (npm, yarn, pnpm)', 'npm')
    .option('-s, --skip-install', '跳过依赖安装')
    .action((name, options) => {
      require('../lib/create')(name, options);
    })
    .on('--help', () => {
      console.log();
      console.log('示例:');
      console.log(`  $ ybm create my-project`);
      console.log(`  $ ybm create my-project --template vue`);
      console.log(`  $ ybm create my-project --force`);
      console.log(`  $ ybm create my-project --package-manager yarn`);
      console.log();
    });

  program
    .command('list')
    .description('列出可用的项目模板')
    .action(() => {
      const { getAllTemplates } = require('../lib/download');
      console.log();
      console.log('可用的项目模板:');
      const templates = getAllTemplates();
      templates.forEach(template => {
        console.log(`  ${chalk.green(template.name)} - ${template.description || '无描述'}`);
      });
      console.log();
    });

    program
    .command('clone [repo]')
    .description('克隆仓库（支持完整URL或选择药帮忙/豆芽项目）')
    .option('-f, --force', '强制覆盖已存在的目录')
    .option('-b, --branch <branch-name>', '指定分支', 'master')
    .option('-p, --package-manager <manager>', '包管理器 (npm|yarn|pnpm)', 'npm')
    .option('-s, --skip-install', '跳过依赖安装')
    .action(async (repoInput, options) => {
      try {
        let repo;

        // 如果提供了仓库名称或URL
        if (repoInput) {
          // 尝试从配置中查找仓库
          const foundRepo = repoConfig.getRepoByNameOrUrl(repoInput);
          if (foundRepo) {
            repo = foundRepo.value;
          } else {
            // 如果不是预定义的仓库，假设是URL
            repo = {
              url: repoInput,
              projectName: options.name || repoInput.split('/').pop() || "project"
            };
          }
        } else {
          // 如果没有提供仓库，显示选择列表
          const answer = await inquirer.prompt([
            {
              type: 'list',
              name: 'selectedRepo',
              message: '请选择要克隆的项目',
              choices: repoConfig.choices
            }
          ]);
          repo = answer.selectedRepo;
        }

        // 检查Node版本兼容性
        if (repo.nodeVersion) {
          const currentVersion = process.version;
          if (currentVersion != repo.nodeVersion) {
            console.log(chalk.yellow(`警告: 当前Node版本为 ${currentVersion}，推荐的版本是 ${repo.nodeVersion}。`));
            console.log(chalk.yellow(`某些功能可能无法正常工作，但将继续执行操作。`));
          }
        }

        // 设置项目名称和执行克隆
        const projectName = options.name || repo.projectName || repo.url.split('/').pop().replace('.git', '');
        console.log(chalk.blue(`克隆仓库: ${repo.url} 到目录: ${projectName}`));
        require('../lib/clone')(repo.url, projectName, options);

      } catch (error) {
        console.error('克隆失败:', error.message);
        process.exit(1);
      }
    })
    .on('--help', () => {
      console.log('\n可用的预定义仓库:');
      repoConfig.choices.forEach(repo => {
        console.log(`  ${chalk.green(repo.name)} - ${repo.value.description || repo.value.url}`);
      });

      console.log('\n示例:');
      console.log('  $ ybm clone https://git.int.ybm100.com/ec/new-ybm-pc');
      console.log('  $ ybm clone 药帮忙');
      console.log('  $ ybm clone new-ybm-pc');
      console.log('  $ ybm clone');
      console.log('  $ ybm clone --branch develop');
    });

  program
    .command('credentials <action>')
    .description('管理Git凭证')
    .action((action) => {
      require('../lib/credentials')(action);
    })
    .on('--help', () => {
      console.log();
      console.log('可用操作:');
      console.log(`  list   - 列出已存储的凭证`);
      console.log(`  add    - 添加新的凭证`);
      console.log(`  remove - 删除已存储的凭证`);
      console.log();
      console.log('示例:');
      console.log(`  $ ybm credentials list`);
      console.log(`  $ ybm credentials add`);
      console.log(`  $ ybm credentials remove`);
      console.log();
    });

  program
    .command('completion <action>')
    .description('管理命令行自动补全')
    .action((action) => {
      require('../lib/completion')(action);
    })
    .on('--help', () => {
      console.log();
      console.log('可用操作:');
      console.log(`  install   - 安装自动补全`);
      console.log(`  uninstall - 卸载自动补全`);
      console.log();
      console.log('示例:');
      console.log(`  $ ybm completion install`);
      console.log(`  $ ybm completion uninstall`);
      console.log();
    });

  // 解析命令行参数
  program.parse(process.argv);

  // 如果没有提供命令，显示帮助信息
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
}

main().catch(err => {
  logger.error('脚手架执行错误:', err);
  process.exit(1);
});
