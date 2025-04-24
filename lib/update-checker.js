const chalk = require('chalk');
const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);
const semver = require('semver');
const logger = require('./logger');
const { version } = require('../package.json');

/**
 * 检查NPM上的最新版本
 * @returns {Promise<string|null>} 最新版本号或null
 */
async function getLatestVersion() {
  try {
    const { stdout } = await execPromise('npm view ybm-cli version');
    return stdout.trim();
  } catch (err) {
    logger.debug('获取最新版本失败:', err.message);
    return null;
  }
}

/**
 * 检查是否有新版本
 * @returns {Promise<boolean>} 是否有新版本
 */
async function checkForUpdates() {
  try {
    const latestVersion = await getLatestVersion();

    if (!latestVersion) {
      return false;
    }

    // 比较版本
    if (semver.gt(latestVersion, version)) {
      logger.info(`发现新版本: ${chalk.green(latestVersion)} (当前版本: ${chalk.yellow(version)})`);
      console.log();
      console.log(chalk.yellow('新版本可用!'));
      console.log(`当前版本: ${chalk.yellow(version)}`);
      console.log(`最新版本: ${chalk.green(latestVersion)}`);
      console.log();
      console.log('运行以下命令更新:');
      console.log(chalk.cyan('  npm install -g ybm-cli'));
      console.log();

      return true;
    }

    return false;
  } catch (err) {
    logger.debug('检查更新失败:', err.message);
    return false;
  }
}

module.exports = {
  checkForUpdates
};
