const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

/**
 * 生成Bash自动补全脚本
 * @returns {string} Bash自动补全脚本
 */
function generateBashCompletion() {
  return `
# ybm-cli bash completion script
_ybm_completion() {
  local cur prev opts
  COMPREPLY=()
  cur="${COMP_WORDS[COMP_CWORD]}"
  prev="${COMP_WORDS[COMP_CWORD-1]}"

  # 主命令
  if [[ $COMP_CWORD == 1 ]]; then
    opts="create clone credentials list completion help"
    COMPREPLY=( $(compgen -W "$opts" -- $cur) )
    return 0
  fi

  # 子命令选项
  case "${COMP_WORDS[1]}" in
    create)
      if [[ $prev == "--template" || $prev == "-t" ]]; then
        opts="vue3-vite vue2-webpack react svelte solidjs"
        COMPREPLY=( $(compgen -W "$opts" -- $cur) )
      elif [[ $prev == "--package-manager" || $prev == "-p" ]]; then
        opts="npm yarn pnpm"
        COMPREPLY=( $(compgen -W "$opts" -- $cur) )
      elif [[ $cur == -* ]]; then
        opts="--template -t --force -f --package-manager -p --skip-install -s --help"
        COMPREPLY=( $(compgen -W "$opts" -- $cur) )
      fi
      ;;
    clone)
      if [[ $prev == "--branch" || $prev == "-b" ]]; then
        # 这里可以添加常用分支名称
        opts="main master develop dev"
        COMPREPLY=( $(compgen -W "$opts" -- $cur) )
      elif [[ $prev == "--package-manager" || $prev == "-p" ]]; then
        opts="npm yarn pnpm"
        COMPREPLY=( $(compgen -W "$opts" -- $cur) )
      elif [[ $cur == -* ]]; then
        opts="--branch -b --force -f --package-manager -p --skip-install -s --help"
        COMPREPLY=( $(compgen -W "$opts" -- $cur) )
      fi
      ;;
    credentials)
      if [[ $COMP_CWORD == 2 ]]; then
        opts="list add remove"
        COMPREPLY=( $(compgen -W "$opts" -- $cur) )
      fi
      ;;
    completion)
      if [[ $COMP_CWORD == 2 ]]; then
        opts="install uninstall"
        COMPREPLY=( $(compgen -W "$opts" -- $cur) )
      fi
      ;;
  esac

  return 0
}

complete -F _ybm_completion ybm
`;
}

/**
 * 生成Zsh自动补全脚本
 * @returns {string} Zsh自动补全脚本
 */
function generateZshCompletion() {
  return `
#compdef ybm

_ybm() {
  local -a commands

  _arguments -C \\
    '1: :->command' \\
    '*:: :->args'

  case $state in
    command)
      commands=(
        'create:创建一个新项目'
        'clone:从远程仓库拉取项目'
        'credentials:管理Git凭证'
        'list:列出可用的项目模板'
        'completion:管理命令行自动补全'
        'help:显示帮助信息'
      )
      _describe 'command' commands
      ;;
    args)
      case $words[1] in
        create)
          _arguments \\
            '(-t --template)'{-t,--template}'[指定项目模板]:template:(vue3-vite vue2-webpack react svelte solidjs)' \\
            '(-f --force)'{-f,--force}'[强制覆盖已存在的目录]' \\
            '(-p --package-manager)'{-p,--package-manager}'[指定包管理器]:package manager:(npm yarn pnpm)' \\
            '(-s --skip-install)'{-s,--skip-install}'[跳过依赖安装]'
          ;;
        clone)
          _arguments \\
            '(-b --branch)'{-b,--branch}'[指定要拉取的分支]:branch:(main master develop dev)' \\
            '(-f --force)'{-f,--force}'[强制覆盖已存在的目录]' \\
            '(-p --package-manager)'{-p,--package-manager}'[指定包管理器]:package manager:(npm yarn pnpm)' \\
            '(-s --skip-install)'{-s,--skip-install}'[跳过依赖安装]'
          ;;
        credentials)
          _arguments \\
            '1: :->credential_command'

          case $state in
            credential_command)
              local -a credential_commands
              credential_commands=(
                'list:列出已存储的凭证'
                'add:添加新的凭证'
                'remove:删除已存储的凭证'
              )
              _describe 'credential command' credential_commands
              ;;
          esac
          ;;
        completion)
          _arguments \\
            '1: :->completion_command'

          case $state in
            completion_command)
              local -a completion_commands
              completion_commands=(
                'install:安装自动补全'
                'uninstall:卸载自动补全'
              )
              _describe 'completion command' completion_commands
              ;;
          esac
          ;;
      esac
      ;;
  esac
}

_ybm
`;
}

/**
 * 安装Bash自动补全
 */
async function installBashCompletion() {
  const completionDir = path.join(os.homedir(), '.bash_completion.d');
  await fs.ensureDir(completionDir);

  const completionPath = path.join(completionDir, 'ybm-completion.bash');
  await fs.writeFile(completionPath, generateBashCompletion());

  // 检查.bashrc文件
  const bashrcPath = path.join(os.homedir(), '.bashrc');
  let bashrcContent = '';

  if (await fs.pathExists(bashrcPath)) {
    bashrcContent = await fs.readFile(bashrcPath, 'utf8');
  }

  // 添加自动补全目录到.bashrc
  if (!bashrcContent.includes('bash_completion.d')) {
    const appendContent = `
# Load custom bash completions
if [ -d ~/.bash_completion.d ]; then
  for file in ~/.bash_completion.d/*; do
    . "$file"
  done
fi
`;

    await fs.appendFile(bashrcPath, appendContent);
  }

  console.log(chalk.green('Bash自动补全已安装。'));
  console.log(chalk.yellow('请重新加载您的shell配置或重新启动终端以启用自动补全。'));
  console.log(`  source ${bashrcPath}`);
}

/**
 * 安装Zsh自动补全
 */
async function installZshCompletion() {
  const zshCompletionDir = path.join(os.homedir(), '.zsh/completion');
  await fs.ensureDir(zshCompletionDir);

  const completionPath = path.join(zshCompletionDir, '_ybm');
  await fs.writeFile(completionPath, generateZshCompletion());

  // 检查.zshrc文件
  const zshrcPath = path.join(os.homedir(), '.zshrc');
  let zshrcContent = '';

  if (await fs.pathExists(zshrcPath)) {
    zshrcContent = await fs.readFile(zshrcPath, 'utf8');
  }

  // 添加自动补全目录到.zshrc
  if (!zshrcContent.includes('fpath=($HOME/.zsh/completion $fpath)')) {
    const appendContent = `
# Load custom zsh completions
fpath=($HOME/.zsh/completion $fpath)
autoload -Uz compinit
compinit
`;

    await fs.appendFile(zshrcPath, appendContent);
  }

  console.log(chalk.green('Zsh自动补全已安装。'));
  console.log(chalk.yellow('请重新加载您的shell配置或重新启动终端以启用自动补全。'));
  console.log(`  source ${zshrcPath}`);
}

/**
 * 卸载Bash自动补全
 */
async function uninstallBashCompletion() {
  const completionPath = path.join(os.homedir(), '.bash_completion.d', 'ybm-completion.bash');

  if (await fs.pathExists(completionPath)) {
    await fs.remove(completionPath);
    console.log(chalk.green('Bash自动补全已卸载。'));
  } else {
    console.log(chalk.yellow('未找到Bash自动补全文件。'));
  }
}

/**
 * 卸载Zsh自动补全
 */
async function uninstallZshCompletion() {
  const completionPath = path.join(os.homedir(), '.zsh/completion', '_ybm');

  if (await fs.pathExists(completionPath)) {
    await fs.remove(completionPath);
    console.log(chalk.green('Zsh自动补全已卸载。'));
  } else {
    console.log(chalk.yellow('未找到Zsh自动补全文件。'));
  }
}

/**
 * 检测当前Shell
 * @returns {Promise<string>} Shell类型
 */
async function detectShell() {
  try {
    const { stdout } = await execPromise('echo $SHELL');
    const shell = stdout.trim();

    if (shell.includes('bash')) {
      return 'bash';
    } else if (shell.includes('zsh')) {
      return 'zsh';
    } else {
      return 'unknown';
    }
  } catch (err) {
    return 'unknown';
  }
}

/**
 * 管理自动补全
 * @param {string} action - 操作类型
 */
async function manageCompletion(action) {
  const shell = await detectShell();

  if (action === 'install') {
    if (shell === 'bash') {
      await installBashCompletion();
    } else if (shell === 'zsh') {
      await installZshCompletion();
    } else {
      console.log(chalk.yellow('无法检测到支持的Shell类型。'));

      const { shellType } = await inquirer.prompt([
        {
          name: 'shellType',
          type: 'list',
          message: '请选择您的Shell类型:',
          choices: [
            { name: 'Bash', value: 'bash' },
            { name: 'Zsh', value: 'zsh' },
            { name: '取消', value: 'cancel' }
          ]
        }
      ]);

      if (shellType === 'bash') {
        await installBashCompletion();
      } else if (shellType === 'zsh') {
        await installZshCompletion();
      } else {
        console.log(chalk.yellow('已取消安装自动补全。'));
      }
    }
  } else if (action === 'uninstall') {
    if (shell === 'bash') {
      await uninstallBashCompletion();
    } else if (shell === 'zsh') {
      await uninstallZshCompletion();
    } else {
      console.log(chalk.yellow('无法检测到支持的Shell类型。'));

      const { shellType } = await inquirer.prompt([
        {
          name: 'shellType',
          type: 'list',
          message: '请选择您的Shell类型:',
          choices: [
            { name: 'Bash', value: 'bash' },
            { name: 'Zsh', value: 'zsh' },
            { name: '取消', value: 'cancel' }
          ]
        }
      ]);

      if (shellType === 'bash') {
        await uninstallBashCompletion();
      } else if (shellType === 'zsh') {
        await uninstallZshCompletion();
      } else {
        console.log(chalk.yellow('已取消卸载自动补全。'));
      }
    }
  } else {
    console.log(chalk.red(`未知操作: ${action}`));
    console.log(chalk.yellow('可用操作: install, uninstall'));
  }
}

module.exports = manageCompletion;
