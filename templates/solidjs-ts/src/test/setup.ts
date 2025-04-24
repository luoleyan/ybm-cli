import { expect, afterEach } from 'vitest'
import { cleanup } from '@solidjs/testing-library'
import matchers from '@testing-library/jest-dom/matchers'

// 扩展Vitest的expect方法
expect.extend(matchers)

// 每个测试后自动清理
afterEach(() => {
  cleanup()
})
