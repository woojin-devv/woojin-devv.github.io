import type { Meta, StoryObj } from '@storybook/react-vite'

import { TagList } from './TagList'

const meta = {
  title: 'Post/TagList',
  component: TagList,
  decorators: [
    (Story) => (
      <div style={{ padding: 40 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TagList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { tags: ['React', 'Storybook', 'UI'] },
}

export const ManyTags: Story = {
  args: { tags: ['SpringBoot', 'Java', 'SQL', 'Algorithm', 'design-pattern', 'Web'] },
}
