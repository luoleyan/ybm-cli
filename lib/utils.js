const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * 获取可用的模板选项
 * @returns {Array} 模板选项数组
 */
function getTemplateChoices() {
  const templatesDir = path.resolve(__dirname, '../templates');

  // 确保模板目录存在
  if (!fs.existsSync(templatesDir)) {
    return [{ name: 'Vue 3 + Vite', value: 'vue3-vite', description: '基于Vue 3和Vite的项目模板' }];
  }

  try {
    // 读取模板目录
    const templates = fs.readdirSync(templatesDir)
      .filter(file => fs.statSync(path.join(templatesDir, file)).isDirectory())
      .map(dir => {
        // 将目录名转换为选项
        let name;
        let description;

        switch(dir) {
          case 'vue3-vite':
            name = 'Vue 3 + Vite';
            description = '基于Vue 3和Vite的项目模板';
            break;
          case 'vue2-webpack':
            name = 'Vue 2 + Webpack';
            description = '基于Vue 2和Webpack的项目模板';
            break;
          case 'react':
            name = 'React';
            description = '基于React和Vite的项目模板';
            break;
          case 'svelte':
            name = 'Svelte';
            description = '基于Svelte和Vite的项目模板';
            break;
          case 'solidjs':
            name = 'SolidJS';
            description = '基于SolidJS和Vite的项目模板';
            break;
          default:
            name = dir.charAt(0).toUpperCase() + dir.slice(1);
            description = `本地${name}项目模板`;
        }

        return { name, value: dir, description };
      });

    return templates.length ? templates : [{ name: 'Vue 3 + Vite', value: 'vue3-vite', description: '基于Vue 3和Vite的项目模板' }];
  } catch (err) {
    console.error('读取模板目录失败:', err);
    return [{ name: 'Vue 3 + Vite', value: 'vue3-vite', description: '基于Vue 3和Vite的项目模板' }];
  }
}

/**
 * 检查是否为本地模板
 * @param {string} template - 模板名称或路径
 * @returns {boolean} 是否为本地模板
 */
function isLocalTemplate(template) {
  return template.startsWith('local:');
}

/**
 * 从模板字符串中提取模板名称
 * @param {string} template - 模板字符串（如 'local:vue'）
 * @returns {string} 模板名称
 */
function extractTemplateName(template) {
  if (isLocalTemplate(template)) {
    return template.replace('local:', '');
  }
  return template;
}

/**
 * 检查Node版本是否符合package.json中的要求
 * @param {string} pkgPath - package.json文件路径
 * @returns {Promise} 如果版本符合要求，返回空的Promise，否则抛出错误
 */
async function checkNodeVersionForNpm(pkgPath) {
  // 检查package.json是否存在
  if (!fs.existsSync(pkgPath)) {
    throw new Error('找不到package.json文件');
  }

  try {
    // 读取package.json文件
    const pkg = await fs.readJson(pkgPath);

    // 检查是否有engines字段
    if (pkg.engines && pkg.engines.node) {
      const requiredVersion = pkg.engines.node;

      // 如果是精确版本要求
      if (!requiredVersion.includes('>') && !requiredVersion.includes('<') && !requiredVersion.includes('~') && !requiredVersion.includes('^')) {
        if (process.version !== `v${requiredVersion}`) {
          throw new Error(
            `当前项目要求Node.js版本为 ${requiredVersion}，但您的版本是 ${process.version}。\n` +
            `请使用正确的Node.js版本运行此项目。`
          );
        }
      }
      // 如果是版本范围要求，我们需要使用semver库进行检查
      // 这里我们只检查精确版本要求
    }

    // 如果没有版本要求或版本符合要求，返回空的Promise
    return Promise.resolve();
  } catch (err) {
    if (err.message.includes('当前项目要求Node.js版本')) {
      throw err;
    }
    throw new Error(`读取package.json文件失败: ${err.message}`);
  }
}

module.exports = {
  getTemplateChoices,
  isLocalTemplate,
  extractTemplateName,
  checkNodeVersionForNpm
};
