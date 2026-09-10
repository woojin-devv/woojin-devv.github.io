import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'

const configDirectory = dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: ['../static'],
  addons: ['@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (viteConfig) =>
    mergeConfig(viteConfig, {
      publicDir: false,
      resolve: {
        alias: {
          '@': resolve(configDirectory, '../src'),
          gatsby: resolve(configDirectory, './mocks/gatsby.tsx'),
          'gatsby-plugin-image': resolve(configDirectory, './mocks/gatsby-plugin-image.tsx'),
        },
      },
    }),
}

export default config
