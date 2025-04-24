const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const chalk = require('chalk');

// 配置文件路径
const CONFIG_FILENAME = '.ybmrc';
const GLOBAL_CONFIG_PATH = path.join(os.homedir(), CONFIG_FILENAME);

/**
 * 读取配置文件
 * @param {string} [configPath] - 配置文件路径，如果不提供则尝试读取当前目录和全局配置
 * @returns {object} 配置对象
 */
async function readConfig(configPath) {
  const configs = {};

  // 尝试读取全局配置
  if (await fs.pathExists(GLOBAL_CONFIG_PATH)) {
    try {
      const globalConfig = await fs.readJson(GLOBAL_CONFIG_PATH);
      Object.assign(configs, globalConfig);
    } catch (err) {
      console.warn(chalk.yellow(`警告: 无法读取全局配置文件 ${GLOBAL_CONFIG_PATH}`));
    }
  }

  // 尝试读取当前目录配置
  const localConfigPath = path.join(process.cwd(), CONFIG_FILENAME);
  if (!configPath && await fs.pathExists(localConfigPath)) {
    configPath = localConfigPath;
  }

  // 读取指定配置文件
  if (configPath && await fs.pathExists(configPath)) {
    try {
      const localConfig = await fs.readJson(configPath);
      Object.assign(configs, localConfig);
    } catch (err) {
      console.warn(chalk.yellow(`警告: 无法读取配置文件 ${configPath}`));
    }
  }

  return configs;
}

/**
 * 保存全局配置
 * @param {object} config - 配置对象
 */
async function saveGlobalConfig(config) {
  try {
    await fs.ensureDir(path.dirname(GLOBAL_CONFIG_PATH));
    await fs.writeJson(GLOBAL_CONFIG_PATH, config, { spaces: 2 });
  } catch (err) {
    console.error(chalk.red(`错误: 无法保存全局配置文件 ${GLOBAL_CONFIG_PATH}`));
    console.error(err);
  }
}

/**
 * 获取默认配置
 * @returns {object} 默认配置对象
 */
function getDefaultConfig() {
  return {
    // 默认模板
    template: 'vue3-vite',
    // 默认包管理器
    packageManager: 'npm',
    // 默认作者信息
    author: '',
    // 默认工具选择
    features: ['linter', 'formatter'],
    // 默认工具配置
    tools: {
      linter: 'eslint',
      formatter: 'prettier',
      typescript: false,
      testing: 'none',
      cssPreprocessor: 'none',
      uiFramework: 'none'
    }
  };
}

/**
 * 合并配置
 * @param {object} defaultConfig - 默认配置
 * @param {object} fileConfig - 文件配置
 * @param {object} cliOptions - 命令行选项
 * @returns {object} 合并后的配置
 */
function mergeConfig(defaultConfig, fileConfig, cliOptions) {
  const config = { ...defaultConfig, ...fileConfig };

  // 命令行选项优先级最高
  if (cliOptions) {
    Object.keys(cliOptions).forEach(key => {
      if (cliOptions[key] !== undefined && cliOptions[key] !== null) {
        config[key] = cliOptions[key];
      }
    });
  }

  return config;
}

/**
 * 获取配置
 * @param {object} cliOptions - 命令行选项
 * @returns {Promise<object>} 配置对象
 */
async function getConfig(cliOptions = {}) {
  const defaultConfig = getDefaultConfig();
  const fileConfig = await readConfig(cliOptions.config);

  return mergeConfig(defaultConfig, fileConfig, cliOptions);
}

module.exports = {
  readConfig,
  saveGlobalConfig,
  getDefaultConfig,
  mergeConfig,
  getConfig
};
