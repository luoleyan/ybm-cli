/**
 * 测试配置文件
 * 用于配置测试行为
 */

module.exports = {
  // 是否跳过某些测试
  skip: {
    // 跳过创建项目测试（可能耗时较长）
    create: process.env.SKIP_CREATE_TEST === 'true',
    
    // 跳过TypeScript测试（可能耗时较长）
    typescript: process.env.SKIP_TS_TEST === 'true',
    
    // 跳过工具配置测试（可能需要交互）
    toolsConfig: process.env.SKIP_TOOLS_TEST === 'true',
    
    // 跳过克隆测试（可能需要网络连接）
    clone: process.env.SKIP_CLONE_TEST === 'true'
  },
  
  // 测试超时时间（毫秒）
  timeout: {
    create: 60000,
    typescript: 60000,
    toolsConfig: 60000
  }
};
