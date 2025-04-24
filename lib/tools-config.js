/**
 * 可用的开发工具和库配置
 */
const toolsConfig = {
  // 代码规范工具
  linter: {
    name: '代码规范工具',
    type: 'list',
    choices: [
      {
        name: 'ESLint',
        value: 'eslint',
        description: '流行的JavaScript代码检查工具',
        packages: ['eslint@8.57.0'] // 指定8.x版本，兼容Node.js 16
      },
      {
        name: 'ESLint + Airbnb配置',
        value: 'eslint-airbnb',
        description: '使用Airbnb风格指南的ESLint配置',
        packages: ['eslint@8.57.0', 'eslint-config-airbnb-base@15.0.0', 'eslint-plugin-import@2.29.1']
      },
      {
        name: 'ESLint + Standard配置',
        value: 'eslint-standard',
        description: '使用Standard风格指南的ESLint配置',
        packages: ['eslint@8.57.0', 'eslint-config-standard@17.1.0', 'eslint-plugin-import@2.29.1', 'eslint-plugin-node@11.1.0', 'eslint-plugin-promise@6.1.1']
      },
      {
        name: '不使用',
        value: 'none',
        description: '不使用代码规范工具'
      }
    ]
  },

  // 代码格式化工具
  formatter: {
    name: '代码格式化工具',
    type: 'list',
    choices: [
      {
        name: 'Prettier',
        value: 'prettier',
        description: '流行的代码格式化工具',
        packages: ['prettier@2.8.8'] // 使用2.x版本，兼容Node.js 16
      },
      {
        name: 'Prettier + ESLint集成',
        value: 'prettier-eslint',
        description: 'Prettier和ESLint的集成',
        packages: ['prettier@2.8.8', 'eslint-plugin-prettier@4.2.1', 'eslint-config-prettier@8.10.0']
      },
      {
        name: '不使用',
        value: 'none',
        description: '不使用代码格式化工具'
      }
    ]
  },

  // TypeScript支持
  typescript: {
    name: 'TypeScript支持',
    type: 'confirm',
    description: '是否添加TypeScript支持',
    packages: {
      'vue3-vite': ['typescript@4.9.5', '@vue/tsconfig@0.4.0', 'vue-tsc@1.8.27'], // 使用兼容Node.js 16的版本
      'vue2-webpack': ['typescript@4.9.5', '@vue/cli-plugin-typescript@5.0.8', '@typescript-eslint/eslint-plugin@5.62.0', '@typescript-eslint/parser@5.62.0'],
      'react': ['typescript@4.9.5', '@types/react', '@types/react-dom'],
      'svelte': ['typescript@4.9.5', '@tsconfig/svelte', 'svelte-check@2.10.3', 'svelte-preprocess'],
      'solidjs': ['typescript@4.9.5', '@types/node']
    }
  },

  // 测试框架
  testing: {
    name: '测试框架',
    type: 'list',
    choices: [
      {
        name: 'Jest',
        value: 'jest',
        description: '流行的JavaScript测试框架',
        packages: {
          'vue3-vite': ['jest', '@vue/test-utils', '@vue/vue3-jest', 'babel-jest'],
          'vue2-webpack': ['jest', '@vue/test-utils', '@vue/cli-plugin-unit-jest'],
          'react': ['jest', '@testing-library/react', '@testing-library/jest-dom'],
          'svelte': ['jest', '@testing-library/svelte'],
          'solidjs': ['jest', 'solid-jest', '@testing-library/jest-dom']
        }
      },
      {
        name: 'Vitest',
        value: 'vitest',
        description: '由Vite提供支持的测试框架',
        packages: {
          'vue3-vite': ['vitest@0.34.6', '@vue/test-utils'], // 使用0.34.x版本，兼容Node.js 16
          'react': ['vitest@0.34.6', '@testing-library/react', '@testing-library/jest-dom'],
          'svelte': ['vitest@0.34.6', '@testing-library/svelte'],
          'solidjs': ['vitest@0.34.6', 'solid-testing-library', '@testing-library/jest-dom']
        }
      },
      {
        name: '不使用',
        value: 'none',
        description: '不使用测试框架'
      }
    ]
  },

  // CSS预处理器
  cssPreprocessor: {
    name: 'CSS预处理器',
    type: 'list',
    choices: [
      {
        name: 'SCSS/SASS',
        value: 'scss',
        description: '功能丰富的CSS扩展语言',
        packages: {
          'vue3-vite': ['sass'],
          'vue2-webpack': ['sass', 'sass-loader'],
          'react': ['sass'],
          'svelte': ['sass', 'svelte-preprocess'],
          'solidjs': ['sass']
        }
      },
      {
        name: 'Less',
        value: 'less',
        description: '向后兼容的CSS扩展语言',
        packages: {
          'vue3-vite': ['less'],
          'vue2-webpack': ['less', 'less-loader'],
          'react': ['less'],
          'svelte': ['less', 'svelte-preprocess'],
          'solidjs': ['less']
        }
      },
      {
        name: 'Tailwind CSS',
        value: 'tailwind',
        description: '功能类优先的CSS框架',
        packages: {
          'vue3-vite': ['tailwindcss', 'postcss', 'autoprefixer'],
          'vue2-webpack': ['tailwindcss', 'postcss', 'autoprefixer'],
          'react': ['tailwindcss', 'postcss', 'autoprefixer'],
          'svelte': ['tailwindcss', 'postcss', 'autoprefixer'],
          'solidjs': ['tailwindcss', 'postcss', 'autoprefixer']
        }
      },
      {
        name: '不使用',
        value: 'none',
        description: '使用原生CSS'
      }
    ]
  },

  // UI框架
  uiFramework: {
    name: 'UI框架',
    type: 'list',
    choices: {
      'vue3-vite': [
        {
          name: 'Element Plus',
          value: 'element-plus',
          description: '基于Vue 3的组件库',
          packages: ['element-plus']
        },
        {
          name: 'Vuetify 3',
          value: 'vuetify',
          description: '基于Material Design的Vue组件库',
          packages: ['vuetify']
        },
        {
          name: 'Ant Design Vue',
          value: 'ant-design-vue',
          description: '企业级UI设计语言和Vue组件库',
          packages: ['ant-design-vue']
        },
        {
          name: '不使用',
          value: 'none',
          description: '不使用UI框架'
        }
      ],
      'vue2-webpack': [
        {
          name: 'Element UI',
          value: 'element-ui',
          description: '基于Vue 2的组件库',
          packages: ['element-ui']
        },
        {
          name: 'Vuetify 2',
          value: 'vuetify',
          description: '基于Material Design的Vue组件库',
          packages: ['vuetify']
        },
        {
          name: 'Ant Design Vue',
          value: 'ant-design-vue',
          description: '企业级UI设计语言和Vue组件库',
          packages: ['ant-design-vue']
        },
        {
          name: '不使用',
          value: 'none',
          description: '不使用UI框架'
        }
      ],
      'react': [
        {
          name: 'Ant Design',
          value: 'antd',
          description: '企业级UI设计语言和React组件库',
          packages: ['antd']
        },
        {
          name: 'Material-UI',
          value: 'mui',
          description: '实现Material Design的React组件库',
          packages: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled']
        },
        {
          name: 'Chakra UI',
          value: 'chakra',
          description: '简单、模块化和可访问的组件库',
          packages: ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion']
        },
        {
          name: '不使用',
          value: 'none',
          description: '不使用UI框架'
        }
      ],
      'svelte': [
        {
          name: 'Svelte Material UI',
          value: 'svelte-material-ui',
          description: 'Svelte的Material Design组件库',
          packages: ['svelte-material-ui']
        },
        {
          name: 'Carbon Components Svelte',
          value: 'carbon-components-svelte',
          description: 'IBM Carbon Design System的Svelte实现',
          packages: ['carbon-components-svelte']
        },
        {
          name: '不使用',
          value: 'none',
          description: '不使用UI框架'
        }
      ],
      'solidjs': [
        {
          name: 'Solid UI',
          value: 'solid-ui',
          description: 'SolidJS的UI组件库',
          packages: ['@hope-ui/solid']
        },
        {
          name: 'Solid Material UI',
          value: 'solid-material-ui',
          description: 'Material Design的SolidJS实现',
          packages: ['solid-material-ui']
        },
        {
          name: '不使用',
          value: 'none',
          description: '不使用UI框架'
        }
      ]
    }
  }
};

/**
 * 获取特定模板的UI框架选项
 * @param {string} template - 模板名称
 * @returns {Array} UI框架选项
 */
function getUIFrameworkChoices(template) {
  // 如果没有为该模板定义UI框架选项，返回默认选项
  if (!toolsConfig.uiFramework.choices[template]) {
    return [
      {
        name: '不使用',
        value: 'none',
        description: '不使用UI框架'
      }
    ];
  }

  return toolsConfig.uiFramework.choices[template];
}

/**
 * 获取特定模板的TypeScript包
 * @param {string} template - 模板名称
 * @returns {Array} TypeScript包
 */
function getTypeScriptPackages(template) {
  // 如果没有为该模板定义TypeScript包，返回默认包
  if (!toolsConfig.typescript.packages[template]) {
    return ['typescript'];
  }

  return toolsConfig.typescript.packages[template];
}

/**
 * 获取特定模板和测试框架的测试包
 * @param {string} template - 模板名称
 * @param {string} testingFramework - 测试框架名称
 * @returns {Array} 测试包
 */
function getTestingPackages(template, testingFramework) {
  // 查找测试框架
  const framework = toolsConfig.testing.choices.find(choice => choice.value === testingFramework);

  // 如果没有找到测试框架或没有为该模板定义测试包，返回空数组
  if (!framework || !framework.packages || !framework.packages[template]) {
    return [];
  }

  return framework.packages[template];
}

/**
 * 获取特定模板和CSS预处理器的包
 * @param {string} template - 模板名称
 * @param {string} preprocessor - CSS预处理器名称
 * @returns {Array} CSS预处理器包
 */
function getCSSPreprocessorPackages(template, preprocessor) {
  // 查找CSS预处理器
  const processor = toolsConfig.cssPreprocessor.choices.find(choice => choice.value === preprocessor);

  // 如果没有找到CSS预处理器或没有为该模板定义包，返回空数组
  if (!processor || !processor.packages || !processor.packages[template]) {
    return [];
  }

  return processor.packages[template];
}

module.exports = {
  toolsConfig,
  getUIFrameworkChoices,
  getTypeScriptPackages,
  getTestingPackages,
  getCSSPreprocessorPackages
};
