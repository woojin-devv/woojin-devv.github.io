import type { Meta, StoryObj } from '@storybook/react-vite'

import { IconList } from './IconList'

const meta = {
  title: 'Components/ProfileIcons',
  component: IconList,
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', gap: 8, padding: 40 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof IconList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
