const fs = require('fs-extra');
const path = require('path');
const { expect } = require('chai');
const { convertToTypeScript } = require('../lib/tools-generator');
const os = require('os');

describe('TypeScript转换测试', function() {
  // 增加超时时间，因为文件操作可能需要更多时间
  this.timeout(10000);
  
  let tempDir;
  
  beforeEach(async () => {
    // 创建临时目录
    tempDir = path.join(os.tmpdir(), `ybm-test-${Date.now()}`);
    await fs.ensureDir(tempDir);
    
    // 创建src目录
    const srcDir = path.join(tempDir, 'src');
    await fs.ensureDir(srcDir);
    
    // 创建测试文件
    await fs.writeFile(
      path.join(srcDir, 'main.js'),
      `import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)
app.mount('#app')
`
    );
    
    await fs.writeFile(
      path.join(srcDir, 'utils.js'),
      `// 工具函数
function formatDate(date) {
  return new Date(date).toLocaleDateString()
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export { formatDate, capitalize }
`
    );
    
    // 创建React组件
    await fs.writeFile(
      path.join(srcDir, 'Counter.jsx'),
      `import React, { useState } from 'react'

function Counter(props) {
  const [count, setCount] = useState(0)
  
  function handleIncrement() {
    setCount(count + 1)
  }
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  )
}

export default Counter
`
    );
    
    // 创建package.json
    await fs.writeFile(
      path.join(tempDir, 'package.json'),
      JSON.stringify({
        name: 'test-project',
        version: '1.0.0',
        main: 'src/main.js'
      }, null, 2)
    );
    
    // 创建vite.config.js
    await fs.writeFile(
      path.join(tempDir, 'vite.config.js'),
      `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})
`
    );
  });
  
  afterEach(async () => {
    // 清理临时目录
    await fs.remove(tempDir);
  });
  
  it('应该将JavaScript文件转换为TypeScript文件', async () => {
    // 执行转换
    await convertToTypeScript(tempDir, 'vue3-vite');
    
    // 检查文件是否已转换
    expect(await fs.pathExists(path.join(tempDir, 'src/main.ts'))).to.be.true;
    expect(await fs.pathExists(path.join(tempDir, 'src/utils.ts'))).to.be.true;
    expect(await fs.pathExists(path.join(tempDir, 'src/Counter.tsx'))).to.be.true;
    
    // 检查原始文件是否已删除
    expect(await fs.pathExists(path.join(tempDir, 'src/main.js'))).to.be.false;
    expect(await fs.pathExists(path.join(tempDir, 'src/utils.js'))).to.be.false;
    expect(await fs.pathExists(path.join(tempDir, 'src/Counter.jsx'))).to.be.false;
    
    // 检查vite.config.js是否已转换为vite.config.ts
    expect(await fs.pathExists(path.join(tempDir, 'vite.config.ts'))).to.be.true;
    expect(await fs.pathExists(path.join(tempDir, 'vite.config.js'))).to.be.false;
    
    // 检查package.json是否已更新
    const pkg = await fs.readJson(path.join(tempDir, 'package.json'));
    expect(pkg.main).to.equal('src/main.ts');
  });
  
  it('应该添加基本的TypeScript类型声明', async () => {
    // 执行转换
    await convertToTypeScript(tempDir, 'vue3-vite');
    
    // 读取转换后的文件
    const mainTs = await fs.readFile(path.join(tempDir, 'src/main.ts'), 'utf8');
    const utilsTs = await fs.readFile(path.join(tempDir, 'src/utils.ts'), 'utf8');
    const counterTsx = await fs.readFile(path.join(tempDir, 'src/Counter.tsx'), 'utf8');
    
    // 检查是否添加了类型声明
    expect(utilsTs).to.include('function formatDate(date: any)');
    expect(utilsTs).to.include('function capitalize(str: any)');
    
    // 检查React组件是否添加了类型
    expect(counterTsx).to.include('React.FC');
    expect(counterTsx).to.include('function handleIncrement(');
  });
});
