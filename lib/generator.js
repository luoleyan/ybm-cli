const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);
const { checkNodeVersionForNpm } = require('./utils');

/**
 * 项目生成器类
 */
class Generator {
  /**
   * 构造函数
   * @param {object} options - 用户选择的选项
   * @param {string} targetDir - 目标目录
   */
  constructor(options, targetDir) {
    this.options = options;
    this.targetDir = targetDir;

    // 处理模板路径
    const { extractTemplateName } = require('./utils');
    const templateName = extractTemplateName(options.template);
    this.templateDir = path.resolve(__dirname, '../templates', templateName);
  }

  /**
   * 生成项目
   */
  async generate() {
    // 复制模板文件
    await this.copyTemplateFiles();

    // 修改package.json
    await this.updatePackageJson();

    // 安装依赖
    if (this.options.installDeps) {
      await this.installDependencies();
    }
  }

  /**
   * 复制模板文件到目标目录
   */
  async copyTemplateFiles() {
    const spinner = ora('复制项目模板文件...').start();
    try {
      await fs.copy(this.templateDir, this.targetDir);
      spinner.succeed('模板文件复制完成');
    } catch (err) {
      spinner.fail('模板文件复制失败');
      throw err;
    }
  }

  /**
   * 更新package.json文件
   */
  async updatePackageJson() {
    const pkgPath = path.join(this.targetDir, 'package.json');

    // 确保package.json存在
    if (!fs.existsSync(pkgPath)) {
      return;
    }

    const spinner = ora('更新package.json...').start();
    try {
      const pkg = await fs.readJson(pkgPath);

      // 更新项目信息
      pkg.name = this.options.projectName;
      pkg.description = this.options.projectDescription;
      pkg.author = this.options.author;

      // 写入更新后的package.json
      await fs.writeJson(pkgPath, pkg, { spaces: 2 });
      spinner.succeed('package.json更新完成');
    } catch (err) {
      spinner.fail('package.json更新失败');
      throw err;
    }
  }

  /**
   * 安装依赖
   */
  async installDependencies() {
    const spinner = ora('正在安装依赖...').start();
    try {
      // 切换到目标目录
      process.chdir(this.targetDir);

      // 不检查Node版本，直接执行安装命令
      const packageManager = this.options.packageManager || 'npm';
      const installCommand = packageManager === 'yarn' ? 'yarn' :
                           packageManager === 'pnpm' ? 'pnpm install' : 'npm install';

      spinner.text = `正在使用 ${packageManager} 安装依赖...`;
      await execPromise(installCommand);

      spinner.succeed('依赖安装完成');
    } catch (err) {
      spinner.fail('依赖安装失败');
      const packageManager = this.options.packageManager || 'npm';
      const installCommand = packageManager === 'yarn' ? 'yarn' :
                           packageManager === 'pnpm' ? 'pnpm install' : 'npm install';
      console.log(chalk.red(`请手动安装依赖: ${installCommand}`));
    }
  }
}

module.exports = { Generator };
