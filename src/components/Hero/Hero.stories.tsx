import type { Meta, StoryObj } from '@storybook/react-vite'

import { Hero } from './Hero'

const meta = {
  title: 'Components/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    loadingState: {
      control: 'inline-radio',
      options: ['auto', 'loading', 'loaded'],
    },
  },
} satisfies Meta<typeof Hero>

export default meta
type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  args: {
    loadingState: 'loaded',
  },
}

export const LoadingSkeleton: Story = {
  args: {
    loadingState: 'loading',
  },
}
