import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import path from 'path'

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    transformMode: {
      web: [/\.[jt]sx?$/]
    },
    setupFiles: ['./src/test/setup.ts'],
    // solid needs to be inline to work around
    // a resolution issue in vitest
    deps: {
      inline: [/solid-js/]
    },
    // if you have few tests, try commenting one
    // or both out to improve performance:
    threads: false,
    isolate: false
  }
})
