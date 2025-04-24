#!/usr/bin/env node

const { Command } = require('commander');
const program = new Command();
const chalk = require('chalk');
const figlet = require('figlet');
const logger = require('../lib/logger');
const { checkForUpdates } = require('../lib/update-checker');

const { version } = require('../package.json');

// 初始化日志系统
logger.init();
logger.enableFileLogging(true);

// 检查Node.js版本
function checkNodeVersion() {
  const requiredVersion = require('../package.json').engines.node;
  if (process.version !== `v${requiredVersion}`) {
    console.log(chalk.red('┌──────────────────────────────────────────────────────────────┐'));
    console.log(chalk.red('│                      版本不兼容错误                          │'));
    console.log(chalk.red('└──────────────────────────────────────────────────────────────┘'));
    console.log(chalk.red(
      `您当前的Node版本为 ${process.version}，但 ybm-cli 仅支持 ${requiredVersion} 版本。`
    ));
    console.log(chalk.red(`由于依赖包的兼容性要求，必须使用精确的Node.js版本。`));
    console.log(chalk.red(`请按照以下步骤安装指定版本的Node.js：`));
    console.log(chalk.yellow(`1. 访问 https://nodejs.org/download/release/v${requiredVersion}/ 下载指定版本`));
    console.log(chalk.yellow(`2. 或者使用 nvm 管理Node版本：`));
    console.log(chalk.yellow(`   nvm install ${requiredVersion}`));
    console.log(chalk.yellow(`   nvm use ${requiredVersion}`));
    console.log(chalk.red('┌──────────────────────────────────────────────────────────────┐'));
    console.log(chalk.red('│ 注意: 使用其他版本的Node.js可能导致依赖安装失败或运行错误。 │'));
    console.log(chalk.red('└──────────────────────────────────────────────────────────────┘'));
    process.exit(1);
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
    .command('clone <repo-url> [project-name]')
    .description('从远程仓库拉取项目')
    .option('-f, --force', '强制覆盖已存在的目录')
    .option('-b, --branch <branch-name>', '指定要拉取的分支', 'main')
    .option('-p, --package-manager <manager>', '指定包管理器 (npm, yarn, pnpm)', 'npm')
    .option('-s, --skip-install', '跳过依赖安装')
    .action((repoUrl, projectName, options) => {
      require('../lib/clone')(repoUrl, projectName, options);
    })
    .on('--help', () => {
      console.log();
      console.log('示例:');
      console.log(`  $ ybm clone https://github.com/username/repo my-project`);
      console.log(`  $ ybm clone https://github.com/username/repo --branch develop`);
      console.log(`  $ ybm clone https://github.com/username/repo --force`);
      console.log(`  $ ybm clone https://github.com/username/repo --package-manager yarn`);
      console.log();
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
