/**
 * 仓库配置文件
 * 用于存储可克隆的项目模板信息
 */

const repoConfig = {
  // 可选择的仓库列表
  choices: [
    { 
      name: '药帮忙', 
      value: {
        url: 'https://git.int.ybm100.com/ec/new-ybm-pc',
        projectName: "new-ybm-pc",
        nodeVersion: "16.20.1",
        description: "药帮忙PC端项目"
      }
    },
    { 
      name: '豆芽', 
      value: {
        url: 'https://git.int.ybm100.com/ec/new-dy-pc',
        projectName: "new-dy-pc",
        nodeVersion: "16.20.1",
        description: "豆芽PC端项目"
      }
    }
  ],
  
  // 可以在这里添加更多配置项
  defaultBranch: 'master',
  defaultPackageManager: 'npm',
  
  // 获取所有仓库选项
  getAllRepos() {
    return this.choices;
  },
  
  // 根据名称或URL获取仓库信息
  getRepoByNameOrUrl(nameOrUrl) {
    if (!nameOrUrl) return null;
    
    return this.choices.find(item => 
      item.name === nameOrUrl || 
      item.value.projectName === nameOrUrl ||
      item.value.url === nameOrUrl
    );
  }
};

module.exports = repoConfig;
