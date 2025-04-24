const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const util = require('util');

// 日志级别
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};

// 日志配置
const config = {
  level: LOG_LEVELS.INFO,
  logToFile: false,
  logDir: path.join(os.homedir(), '.ybm-cli', 'logs'),
  logFile: 'ybm-cli.log',
  maxLogSize: 10 * 1024 * 1024, // 10MB
  maxLogFiles: 5
};

/**
 * 格式化日期时间
 * @returns {string} 格式化后的日期时间
 */
function formatDateTime() {
  const now = new Date();
  return now.toISOString();
}

/**
 * 确保日志目录存在
 */
async function ensureLogDir() {
  if (config.logToFile) {
    await fs.ensureDir(config.logDir);
  }
}

/**
 * 轮转日志文件
 */
async function rotateLogFile() {
  if (!config.logToFile) return;
  
  const logPath = path.join(config.logDir, config.logFile);
  
  // 检查日志文件是否存在
  if (!await fs.pathExists(logPath)) return;
  
  // 检查日志文件大小
  const stats = await fs.stat(logPath);
  if (stats.size < config.maxLogSize) return;
  
  // 轮转日志文件
  for (let i = config.maxLogFiles - 1; i > 0; i--) {
    const oldPath = path.join(config.logDir, `${config.logFile}.${i}`);
    const newPath = path.join(config.logDir, `${config.logFile}.${i + 1}`);
    
    if (await fs.pathExists(oldPath)) {
      await fs.move(oldPath, newPath, { overwrite: true });
    }
  }
  
  // 移动当前日志文件
  const newPath = path.join(config.logDir, `${config.logFile}.1`);
  await fs.move(logPath, newPath, { overwrite: true });
}

/**
 * 写入日志到文件
 * @param {string} level - 日志级别
 * @param {string} message - 日志消息
 */
async function writeToFile(level, message) {
  if (!config.logToFile) return;
  
  try {
    await ensureLogDir();
    await rotateLogFile();
    
    const logPath = path.join(config.logDir, config.logFile);
    const logEntry = `[${formatDateTime()}] [${level}] ${message}\n`;
    
    await fs.appendFile(logPath, logEntry);
  } catch (err) {
    console.error(`无法写入日志文件: ${err.message}`);
  }
}

/**
 * 设置日志级别
 * @param {string} level - 日志级别
 */
function setLevel(level) {
  if (LOG_LEVELS[level] !== undefined) {
    config.level = LOG_LEVELS[level];
  }
}

/**
 * 启用文件日志
 * @param {boolean} enable - 是否启用
 */
function enableFileLogging(enable) {
  config.logToFile = enable;
}

/**
 * 设置日志目录
 * @param {string} dir - 日志目录
 */
function setLogDir(dir) {
  config.logDir = dir;
}

/**
 * 格式化日志消息
 * @param {any[]} args - 日志参数
 * @returns {string} 格式化后的消息
 */
function formatMessage(args) {
  return args.map(arg => {
    if (typeof arg === 'string') return arg;
    return util.inspect(arg, { depth: null, colors: false });
  }).join(' ');
}

/**
 * 调试日志
 * @param {...any} args - 日志参数
 */
async function debug(...args) {
  if (config.level <= LOG_LEVELS.DEBUG) {
    const message = formatMessage(args);
    console.log(chalk.blue(`[DEBUG] ${message}`));
    await writeToFile('DEBUG', message);
  }
}

/**
 * 信息日志
 * @param {...any} args - 日志参数
 */
async function info(...args) {
  if (config.level <= LOG_LEVELS.INFO) {
    const message = formatMessage(args);
    console.log(chalk.green(`[INFO] ${message}`));
    await writeToFile('INFO', message);
  }
}

/**
 * 警告日志
 * @param {...any} args - 日志参数
 */
async function warn(...args) {
  if (config.level <= LOG_LEVELS.WARN) {
    const message = formatMessage(args);
    console.log(chalk.yellow(`[WARN] ${message}`));
    await writeToFile('WARN', message);
  }
}

/**
 * 错误日志
 * @param {...any} args - 日志参数
 */
async function error(...args) {
  if (config.level <= LOG_LEVELS.ERROR) {
    const message = formatMessage(args);
    console.error(chalk.red(`[ERROR] ${message}`));
    await writeToFile('ERROR', message);
  }
}

/**
 * 处理未捕获的异常
 * @param {Error} err - 错误对象
 */
function handleUncaughtException(err) {
  error('未捕获的异常:', err);
  process.exit(1);
}

/**
 * 处理未处理的Promise拒绝
 * @param {Error} reason - 拒绝原因
 * @param {Promise} promise - Promise对象
 */
function handleUnhandledRejection(reason, promise) {
  error('未处理的Promise拒绝:', reason);
}

/**
 * 初始化日志系统
 */
function init() {
  process.on('uncaughtException', handleUncaughtException);
  process.on('unhandledRejection', handleUnhandledRejection);
}

module.exports = {
  LOG_LEVELS,
  setLevel,
  enableFileLogging,
  setLogDir,
  debug,
  info,
  warn,
  error,
  init
};
