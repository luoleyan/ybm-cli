const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

/**
 * 生成项目初始化后的指导信息
 * @param {string} projectName - 项目名称
 * @param {string} targetDir - 目标目录
 * @param {object} options - 项目选项
 * @returns {string} 指导信息
 */
function generateInstructions(projectName, targetDir, options) {
  let instructions = '';
  
  // 基本指导
  instructions += chalk.green('项目初始化完成!\n\n');
  instructions += `${chalk.cyan('进入项目目录:')}\n`;
  instructions += `  cd ${chalk.yellow(projectName)}\n\n`;
  
  // 安装依赖
  if (!options.installDeps) {
    instructions += `${chalk.cyan('安装依赖:')}\n`;
    
    const packageManager = options.packageManager || 'npm';
    if (packageManager === 'yarn') {
      instructions += `  yarn\n\n`;
    } else if (packageManager === 'pnpm') {
      instructions += `  pnpm install\n\n`;
    } else {
      instructions += `  npm install\n\n`;
    }
  }
  
  // 开发命令
  instructions += `${chalk.cyan('启动开发服务器:')}\n`;
  
  // 检查package.json中的脚本
  const pkgPath = path.join(targetDir, 'package.json');
  let devCommand = 'npm run dev';
  let buildCommand = 'npm run build';
  let testCommand = '';
  
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = fs.readJsonSync(pkgPath);
      
      if (pkg.scripts) {
        // 开发命令
        if (pkg.scripts.dev) {
          devCommand = 'npm run dev';
        } else if (pkg.scripts.serve) {
          devCommand = 'npm run serve';
        } else if (pkg.scripts.start) {
          devCommand = 'npm run start';
        }
        
        // 构建命令
        if (pkg.scripts.build) {
          buildCommand = 'npm run build';
        }
        
        // 测试命令
        if (pkg.scripts.test) {
          testCommand = 'npm run test';
        }
        
        // 根据包管理器调整命令
        if (options.packageManager === 'yarn') {
          devCommand = devCommand.replace('npm run', 'yarn');
          buildCommand = buildCommand.replace('npm run', 'yarn');
          if (testCommand) {
            testCommand = testCommand.replace('npm run', 'yarn');
          }
        } else if (options.packageManager === 'pnpm') {
          devCommand = devCommand.replace('npm run', 'pnpm');
          buildCommand = buildCommand.replace('npm run', 'pnpm');
          if (testCommand) {
            testCommand = testCommand.replace('npm run', 'pnpm');
          }
        }
      }
    } catch (err) {
      // 忽略错误，使用默认命令
    }
  }
  
  instructions += `  ${chalk.yellow(devCommand)}\n\n`;
  
  // 构建命令
  instructions += `${chalk.cyan('构建生产版本:')}\n`;
  instructions += `  ${chalk.yellow(buildCommand)}\n\n`;
  
  // 测试命令
  if (testCommand) {
    instructions += `${chalk.cyan('运行测试:')}\n`;
    instructions += `  ${chalk.yellow(testCommand)}\n\n`;
  }
  
  // 项目结构
  instructions += `${chalk.cyan('项目结构:')}\n`;
  
  // 根据模板类型提供不同的结构说明
  const templateName = options.template.replace('local:', '');
  
  if (templateName.includes('vue')) {
    instructions += `  ${chalk.yellow('src/components')}: 组件目录\n`;
    instructions += `  ${chalk.yellow('src/views')}: 页面目录\n`;
    instructions += `  ${chalk.yellow('src/router')}: 路由配置\n`;
    
    if (templateName.includes('vue3')) {
      instructions += `  ${chalk.yellow('src/stores')}: Pinia状态管理\n`;
    } else {
      instructions += `  ${chalk.yellow('src/store')}: Vuex状态管理\n`;
    }
    
    instructions += `  ${chalk.yellow('src/assets')}: 静态资源\n`;
  } else if (templateName.includes('react')) {
    instructions += `  ${chalk.yellow('src/components')}: 组件目录\n`;
    instructions += `  ${chalk.yellow('src/pages')}: 页面目录\n`;
    instructions += `  ${chalk.yellow('src/assets')}: 静态资源\n`;
  } else if (templateName.includes('svelte')) {
    instructions += `  ${chalk.yellow('src/components')}: 组件目录\n`;
    instructions += `  ${chalk.yellow('src/routes')}: 页面目录\n`;
    instructions += `  ${chalk.yellow('src/assets')}: 静态资源\n`;
  } else if (templateName.includes('solidjs')) {
    instructions += `  ${chalk.yellow('src/components')}: 组件目录\n`;
    instructions += `  ${chalk.yellow('src/pages')}: 页面目录\n`;
    instructions += `  ${chalk.yellow('src/assets')}: 静态资源\n`;
  }
  
  // 工具说明
  if (options.features && options.features.length > 0) {
    instructions += `\n${chalk.cyan('已配置的工具:')}\n`;
    
    if (options.features.includes('typescript') && options.typescript) {
      instructions += `  ${chalk.yellow('TypeScript')}: 使用 ${chalk.yellow('tsc --noEmit')} 检查类型\n`;
    }
    
    if (options.features.includes('linter') && options.linter !== 'none') {
      instructions += `  ${chalk.yellow('代码规范')}: 使用 ${chalk.yellow('npm run lint')} 检查代码\n`;
    }
    
    if (options.features.includes('formatter') && options.formatter !== 'none') {
      instructions += `  ${chalk.yellow('代码格式化')}: 使用 ${chalk.yellow('npm run format')} 格式化代码\n`;
    }
    
    if (options.features.includes('testing') && options.testing !== 'none') {
      instructions += `  ${chalk.yellow('测试')}: 使用 ${chalk.yellow(testCommand)} 运行测试\n`;
    }
    
    if (options.features.includes('cssPreprocessor') && options.cssPreprocessor !== 'none') {
      let preprocessorName = '';
      
      switch (options.cssPreprocessor) {
        case 'scss':
          preprocessorName = 'SCSS/SASS';
          break;
        case 'less':
          preprocessorName = 'Less';
          break;
        case 'tailwind':
          preprocessorName = 'Tailwind CSS';
          break;
      }
      
      instructions += `  ${chalk.yellow('CSS预处理器')}: 使用 ${chalk.yellow(preprocessorName)}\n`;
    }
    
    if (options.features.includes('uiFramework') && options.uiFramework !== 'none') {
      instructions += `  ${chalk.yellow('UI框架')}: 使用 ${chalk.yellow(options.uiFramework)}\n`;
    }
  }
  
  // 文档链接
  instructions += `\n${chalk.cyan('文档链接:')}\n`;
  
  if (templateName.includes('vue3')) {
    instructions += `  ${chalk.yellow('Vue 3')}: https://v3.cn.vuejs.org/\n`;
    instructions += `  ${chalk.yellow('Vite')}: https://cn.vitejs.dev/\n`;
    instructions += `  ${chalk.yellow('Vue Router')}: https://router.vuejs.org/zh/\n`;
    instructions += `  ${chalk.yellow('Pinia')}: https://pinia.vuejs.org/zh/\n`;
  } else if (templateName.includes('vue2')) {
    instructions += `  ${chalk.yellow('Vue 2')}: https://v2.cn.vuejs.org/\n`;
    instructions += `  ${chalk.yellow('Vue Router')}: https://v3.router.vuejs.org/zh/\n`;
    instructions += `  ${chalk.yellow('Vuex')}: https://v3.vuex.vuejs.org/zh/\n`;
  } else if (templateName.includes('react')) {
    instructions += `  ${chalk.yellow('React')}: https://zh-hans.react.dev/\n`;
    instructions += `  ${chalk.yellow('React Router')}: https://reactrouter.com/\n`;
  } else if (templateName.includes('svelte')) {
    instructions += `  ${chalk.yellow('Svelte')}: https://svelte.dev/\n`;
    instructions += `  ${chalk.yellow('Svelte Navigator')}: https://github.com/mefechoel/svelte-navigator\n`;
  } else if (templateName.includes('solidjs')) {
    instructions += `  ${chalk.yellow('SolidJS')}: https://www.solidjs.com/\n`;
    instructions += `  ${chalk.yellow('Solid Router')}: https://github.com/solidjs/solid-router\n`;
  }
  
  // 祝福语
  instructions += `\n${chalk.green('祝您开发愉快! 🎉')}\n`;
  
  return instructions;
}

/**
 * 保存指导信息到文件
 * @param {string} targetDir - 目标目录
 * @param {string} instructions - 指导信息
 */
async function saveInstructions(targetDir, instructions) {
  const instructionsPath = path.join(targetDir, 'INSTRUCTIONS.md');
  
  // 移除ANSI颜色代码
  const cleanInstructions = instructions.replace(/\u001b\[\d+m/g, '');
  
  await fs.writeFile(instructionsPath, cleanInstructions);
}

module.exports = {
  generateInstructions,
  saveInstructions
};
