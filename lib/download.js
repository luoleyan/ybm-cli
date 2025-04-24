const download = require('download-git-repo');
const ora = require('ora');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');

/**
 * 从远程仓库下载模板
 * @param {string} repo - 仓库地址
 * @param {string} dest - 目标路径
 * @param {object} options - 选项
 * @returns {Promise}
 */
function downloadTemplate(repo, dest, options = {}) {
  const spinner = ora(`正在从 ${chalk.blue(repo)} 下载模板...`).start();

  // 确保目标目录存在
  fs.ensureDirSync(dest);

  return new Promise((resolve, reject) => {
    download(repo, dest, options, (err) => {
      if (err) {
        spinner.fail(`模板下载失败: ${err.message}`);
        reject(err);
      } else {
        spinner.succeed(`模板下载成功`);
        resolve();
      }
    });
  });
}

/**
 * 获取远程模板列表
 * @returns {Array} 模板列表
 */
function getRemoteTemplates() {
  return [
    {
      name: 'Vue3 + Vite (GitHub)',
      value: 'direct:https://github.com/vitejs/vite/tree/main/packages/create-vite/template-vue',
      description: '基于Vue3和Vite的项目模板'
    },
    {
      name: 'React + Vite (GitHub)',
      value: 'direct:https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react',
      description: '基于React和Vite的项目模板'
    },
    {
      name: 'Svelte + Vite (GitHub)',
      value: 'direct:https://github.com/vitejs/vite/tree/main/packages/create-vite/template-svelte',
      description: '基于Svelte和Vite的项目模板'
    },
    {
      name: 'SolidJS + Vite (GitHub)',
      value: 'direct:https://github.com/solidjs/templates/tree/master/js',
      description: '基于SolidJS和Vite的项目模板'
    },
    {
      name: 'Vue2 + Webpack (GitHub)',
      value: 'direct:https://github.com/vuejs-templates/webpack',
      description: '基于Vue2和Webpack的项目模板'
    }
  ];
}

/**
 * 获取本地模板列表
 * @returns {Array} 模板列表
 */
function getLocalTemplates() {
  const templatesDir = path.resolve(__dirname, '../templates');

  // 确保模板目录存在
  if (!fs.existsSync(templatesDir)) {
    return [];
  }

  try {
    // 读取模板目录
    return fs.readdirSync(templatesDir)
      .filter(file => fs.statSync(path.join(templatesDir, file)).isDirectory())
      .map(dir => {
        // 将目录名转换为选项
        const name = dir.charAt(0).toUpperCase() + dir.slice(1);
        return {
          name: `${name} (本地)`,
          value: `local:${dir}`,
          description: `本地${name}项目模板`
        };
      });
  } catch (err) {
    console.error('读取本地模板目录失败:', err);
    return [];
  }
}

/**
 * 获取所有可用模板
 * @returns {Array} 模板列表
 */
function getAllTemplates() {
  return [
    ...getLocalTemplates(),
    ...getRemoteTemplates()
  ];
}

module.exports = {
  downloadTemplate,
  getRemoteTemplates,
  getLocalTemplates,
  getAllTemplates
};
