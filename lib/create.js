const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const { Generator } = require('./generator');
const { downloadTemplate, getAllTemplates } = require('./download');
const { getTemplateChoices, isLocalTemplate, checkNodeVersionForNpm } = require('./utils');
const { toolsConfig, getUIFrameworkChoices } = require('./tools-config');
const { generateToolsConfig } = require('./tools-generator');
const { getConfig, saveGlobalConfig } = require('./config');
const { generateInstructions, saveInstructions } = require('./instructions');

/**
 * 创建新项目
 * @param {string} projectName - 项目名称
 * @param {object} options - 命令行选项
 */
async function create(projectName, options) {
  // 获取配置
  const config = await getConfig(options);

  // 合并命令行选项和配置
  options = { ...config, ...options };

  // 如果没有提供作者，使用配置中的作者
  if (!options.author && config.author) {
    options.author = config.author;
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

  // 如果使用--yes选项，使用默认值
  let answers;
  if (options.yes) {
    // 使用默认值
    answers = {
      templateSource: 'local',
      template: options.template || 'vue3-vite',
      projectName: projectName,
      projectDescription: `A project created by ybm-cli`,
      author: options.author || '',
      features: ['linter', 'formatter'],
      linter: options.linter || 'eslint',
      formatter: options.formatter || 'prettier',
      installDeps: !options.skipInstall
    };

    console.log(chalk.blue('使用默认选项创建项目:'));
    console.log(chalk.blue(`- 模板: ${answers.template}`));
    console.log(chalk.blue(`- 项目名称: ${answers.projectName}`));
    console.log(chalk.blue(`- 代码规范工具: ${answers.linter}`));
    console.log(chalk.blue(`- 代码格式化工具: ${answers.formatter}`));
  } else {
    // 收集用户输入
    answers = await inquirer.prompt([
    {
      name: 'templateSource',
      type: 'list',
      message: '请选择模板来源:',
      choices: [
        { name: '本地模板', value: 'local' },
        { name: '远程仓库', value: 'remote' }
      ],
      default: 'local'
    },
    {
      name: 'template',
      type: 'list',
      message: '请选择项目模板:',
      choices: (answers) => {
        if (answers.templateSource === 'local') {
          return getTemplateChoices();
        } else {
          return getAllTemplates().filter(t => !t.value.startsWith('local:'));
        }
      },
      default: options.template || 'vue3-vite'
    },
    {
      name: 'projectName',
      type: 'input',
      message: '项目名称:',
      default: projectName
    },
    {
      name: 'projectDescription',
      type: 'input',
      message: '项目描述:',
      default: `A project created by ybm-cli`
    },
    {
      name: 'author',
      type: 'input',
      message: '作者:',
      default: ''
    },
    // 工具选择
    {
      name: 'features',
      type: 'checkbox',
      message: '选择项目功能:',
      choices: [
        { name: 'TypeScript', value: 'typescript', checked: false },
        { name: '代码规范工具', value: 'linter', checked: true },
        { name: '代码格式化工具', value: 'formatter', checked: true },
        { name: '测试框架', value: 'testing', checked: false },
        { name: 'CSS预处理器', value: 'cssPreprocessor', checked: false },
        { name: 'UI框架', value: 'uiFramework', checked: false }
      ]
    },
    // TypeScript
    {
      name: 'typescript',
      type: 'confirm',
      message: '是否使用TypeScript?',
      default: false,
      when: (answers) => answers.features.includes('typescript')
    },
    // 代码规范工具
    {
      name: 'linter',
      type: 'list',
      message: '选择代码规范工具:',
      choices: toolsConfig.linter.choices,
      default: 'eslint',
      when: (answers) => answers.features.includes('linter')
    },
    // 代码格式化工具
    {
      name: 'formatter',
      type: 'list',
      message: '选择代码格式化工具:',
      choices: toolsConfig.formatter.choices,
      default: 'prettier',
      when: (answers) => answers.features.includes('formatter')
    },
    // 测试框架
    {
      name: 'testing',
      type: 'list',
      message: '选择测试框架:',
      choices: toolsConfig.testing.choices,
      default: 'jest',
      when: (answers) => answers.features.includes('testing')
    },
    // CSS预处理器
    {
      name: 'cssPreprocessor',
      type: 'list',
      message: '选择CSS预处理器:',
      choices: toolsConfig.cssPreprocessor.choices,
      default: 'scss',
      when: (answers) => answers.features.includes('cssPreprocessor')
    },
    // UI框架
    {
      name: 'uiFramework',
      type: 'list',
      message: '选择UI框架:',
      choices: (answers) => {
        const templateName = answers.template.replace('local:', '');
        return getUIFrameworkChoices(templateName);
      },
      default: 'none',
      when: (answers) => answers.features.includes('uiFramework')
    },
    {
      name: 'installDeps',
      type: 'confirm',
      message: '是否立即安装依赖?',
      default: !options.skipInstall,
      when: !options.skipInstall
    }
  ]);
  }

  // 创建项目
  let mainSpinner = ora('正在创建项目...').start();

  // 设置全局超时变量
  let globalTimeout;

  // 创建一个函数来设置超时
  const setGlobalTimeout = () => {
    // 清除之前的超时（如果有）
    if (globalTimeout) {
      clearTimeout(globalTimeout);
    }

    // 设置新的超时
    globalTimeout = setTimeout(() => {
      if (mainSpinner) {
        mainSpinner.fail('操作超时');
        mainSpinner = null;
      }
      console.log(chalk.yellow('\n操作耗时过长，已自动终止。'));
      console.log(chalk.yellow('这可能是由于网络问题或依赖安装问题导致的。'));
      console.log(chalk.blue('您可以尝试以下解决方案:'));
      console.log(chalk.blue('1. 检查您的网络连接'));
      console.log(chalk.blue('2. 使用国内npm镜像: npm config set registry https://registry.npmmirror.com'));
      console.log(chalk.blue('3. 增加npm超时时间: npm config set fetch-timeout 300000'));
      console.log(chalk.blue('4. 清除npm缓存: npm cache clean --force'));
      console.log(chalk.blue('5. 手动在项目目录中运行: npm install --registry=https://registry.npmmirror.com'));

      // 强制退出进程
      process.exit(0);
    }, 3 * 60 * 1000); // 3分钟超时，进一步减少等待时间

    return globalTimeout;
  };

  // 设置初始超时
  globalTimeout = setGlobalTimeout();
  try {
    // 确保目标目录存在
    fs.ensureDirSync(targetDir);

    // 处理模板
    if (answers.templateSource === 'remote') {
      // 从远程仓库下载模板
      mainSpinner.text = '正在从远程仓库下载模板...';
      await downloadTemplate(answers.template, targetDir, { clone: true });

      // 更新package.json
      const pkgPath = path.join(targetDir, 'package.json');
      if (fs.existsSync(pkgPath)) {
        mainSpinner.text = '正在更新package.json...';
        const pkg = await fs.readJson(pkgPath);
        pkg.name = answers.projectName;
        pkg.description = answers.projectDescription;
        pkg.author = answers.author;
        await fs.writeJson(pkgPath, pkg, { spaces: 2 });
      }

      // 安装依赖
      if (answers.installDeps) {
        mainSpinner.text = '正在安装依赖...';
        process.chdir(targetDir);
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execPromise = promisify(exec);

        try {
          // 不检查Node版本，直接安装依赖
          const packageManager = options.packageManager || 'npm';
          const installCommand = packageManager === 'yarn' ? 'yarn' :
                               packageManager === 'pnpm' ? 'pnpm install' : 'npm install';

          mainSpinner.text = `正在使用 ${packageManager} 安装依赖...`;
          await execPromise(installCommand);
          mainSpinner.succeed('依赖安装成功!');
          // 将mainSpinner设置为null，表示已停止
          mainSpinner = null;
        } catch (err) {
          if (mainSpinner) {
            mainSpinner.warn('依赖安装失败，请手动安装');
            mainSpinner = null;
          }
          console.error(err);
        }
      }
    } else {
      // 使用本地模板
      const generator = new Generator(answers, targetDir);
      await generator.generate();
    }

    // 生成工具配置
    if (answers.features && answers.features.length > 0) {
      // 准备工具配置
      const toolsOptions = {
        typescript: answers.features.includes('typescript') ? answers.typescript : false,
        linter: answers.features.includes('linter') ? answers.linter : 'none',
        formatter: answers.features.includes('formatter') ? answers.formatter : 'none',
        testing: answers.features.includes('testing') ? answers.testing : 'none',
        cssPreprocessor: answers.features.includes('cssPreprocessor') ? answers.cssPreprocessor : 'none',
        uiFramework: answers.features.includes('uiFramework') ? answers.uiFramework : 'none'
      };

      // 生成工具配置
      const templateName = answers.template.replace('local:', '');
      const packageManager = options.packageManager || 'npm';
      await generateToolsConfig(targetDir, templateName, toolsOptions, packageManager);

      // 工具依赖安装成功后，立即显示成功消息
      if (mainSpinner) {
        mainSpinner.succeed('项目创建成功!');
        mainSpinner = null;
      }
    }

    // 清除超时，确保不会在用户交互过程中触发超时
    clearTimeout(globalTimeout);

    // 如果mainSpinner仍然存在，停止它
    if (mainSpinner) {
      mainSpinner.succeed('项目创建成功!');
      // 将mainSpinner设置为null，表示已停止
      mainSpinner = null;
    }

    // 显示完成信息
    console.log(chalk.green('\n✨ 项目创建完成！'));

    // 保存用户选择的配置
    const userConfig = {
      template: answers.template,
      author: answers.author,
      features: answers.features || [],
      tools: {
        typescript: answers.typescript,
        linter: answers.linter,
        formatter: answers.formatter,
        testing: answers.testing,
        cssPreprocessor: answers.cssPreprocessor,
        uiFramework: answers.uiFramework
      }
    };

    // 询问用户是否保存配置（如果不是使用--yes选项）
    let saveConfig = false;
    if (!options.yes) {
      const result = await inquirer.prompt([
        {
          name: 'saveConfig',
          type: 'confirm',
          message: '是否将当前选择保存为默认配置?',
          default: false
        }
      ]);
      saveConfig = result.saveConfig;
    }

    if (saveConfig) {
      await saveGlobalConfig(userConfig);
      console.log(chalk.green('配置已保存为默认配置。'));
    }

    // 创建新的spinner，指示正在生成指导信息
    const instructionSpinner = ora('正在生成项目指导信息...').start();

    try {
      // 生成指导信息
      const instructions = generateInstructions(projectName, targetDir, {
        ...options,
        ...answers,
        features: answers.features || []
      });

      // 保存指导信息到文件
      await saveInstructions(targetDir, instructions);

      // 停止instructionSpinner
      if (instructionSpinner) {
        instructionSpinner.succeed('项目指导信息生成完成!');
      }

      // 显示指导信息
      console.log(instructions);

      // 确保所有异步操作完成后退出
      console.log(chalk.green('\n✨ 所有操作已完成！祝您开发愉快！'));

      // 清除超时
      clearTimeout(globalTimeout);

      // 显式退出进程，确保不会有未完成的异步操作
      process.exit(0);
    } catch (error) {
      // 确保spinner停止
      if (instructionSpinner) {
        instructionSpinner.fail('项目指导信息生成失败');
      }
      console.error(chalk.red('错误详情:'), error);

      // 显示项目已创建成功的信息，即使指导信息生成失败
      console.log(chalk.yellow('\n注意: 项目结构已创建成功，但指导信息生成失败。'));
      console.log(chalk.green('您仍然可以使用这个项目。'));

      // 清除超时
      clearTimeout(globalTimeout);

      process.exit(1);
    }
  } catch (error) {
    // 确保mainSpinner停止
    if (mainSpinner) {
      mainSpinner.fail('项目创建失败');
      mainSpinner = null;
    }
    console.error(chalk.red('错误详情:'), error);

    // 检查是否是依赖安装错误
    if (error.message && (
      error.message.includes('工具依赖安装失败') ||
      error.message.includes('依赖安装失败') ||
      error.message.includes('npm install') ||
      error.message.includes('yarn add') ||
      error.message.includes('pnpm add')
    )) {
      console.log(chalk.yellow('\n依赖安装失败，这可能是由于网络问题导致的。'));

      // 询问用户是否要继续（如果不是使用--yes选项）
      let action = 'skip'; // 默认跳过依赖安装
      if (!options.yes) {
        const result = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: '您希望如何处理?',
            choices: [
              { name: '跳过依赖安装，继续创建项目', value: 'skip' },
              { name: '退出', value: 'exit' }
            ]
          }
        ]);
        action = result.action;
      }

      if (action === 'skip') {
        console.log(chalk.blue('\n已跳过依赖安装。您可以稍后手动安装依赖:'));
        console.log(chalk.blue(`cd ${projectName}`));
        console.log(chalk.blue('npm install --registry=https://registry.npmmirror.com'));

        // 显示项目创建成功信息
        console.log(chalk.green('\n✨ 项目结构已创建完成！'));
        console.log(chalk.yellow('注意: 由于依赖未安装，您需要先安装依赖才能运行项目。'));

        // 清除超时
        clearTimeout(globalTimeout);

        // 显式退出进程
        process.exit(0);
      } else {
        // 清除超时
        clearTimeout(globalTimeout);

        // 显式退出进程
        process.exit(1);
      }
    } else {
      // 其他错误直接退出
      console.log(chalk.red('\n项目创建失败。请检查错误信息并重试。'));

      // 清除超时
      clearTimeout(globalTimeout);

      process.exit(1);
    }
  }

  // 确保mainSpinner停止
  if (mainSpinner) {
    mainSpinner.succeed('项目创建成功!');
    mainSpinner = null;
  }

  // 清除超时
  clearTimeout(globalTimeout);

  // 确保进程正常退出
  process.exit(0);
}

module.exports = create;
