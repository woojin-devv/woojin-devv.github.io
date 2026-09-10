import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { TagList } from './TagList'

const tags = [
  { fieldValue: 'All', totalCount: 51 },
  { fieldValue: 'spring', totalCount: 7 },
  { fieldValue: 'os', totalCount: 6 },
  { fieldValue: 'React', totalCount: 4 },
  { fieldValue: 'Web', totalCount: 4 },
  { fieldValue: 'cs', totalCount: 4 },
  { fieldValue: 'reverse engineering', totalCount: 4 },
  { fieldValue: 'AI', totalCount: 3 },
  { fieldValue: 'Algorithm', totalCount: 3 },
  { fieldValue: 'javascript', totalCount: 3 },
  { fieldValue: 'DataModeling', totalCount: 2 },
  { fieldValue: 'SpringBoot', totalCount: 2 },
  { fieldValue: 'design-pattern', totalCount: 2 },
  { fieldValue: 'python', totalCount: 1 },
]

const InteractiveTagList = ({ initialTag = 'All' }: { initialTag?: string }) => {
  const [selectedTag, setSelectedTag] = useState(initialTag)

  return <TagList tags={tags} selectedTag={selectedTag} clickTag={setSelectedTag} />
}

const meta = {
  title: 'Home/TagList',
  component: TagList,
  decorators: [
    (Story) => (
      <div style={{ minHeight: 420, padding: 40 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TagList>

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  args: {
    tags,
    selectedTag: 'All',
    clickTag: () => undefined,
  },
  render: () => <InteractiveTagList />,
}

export const OverflowTagSelected: Story = {
  args: {
    tags,
    selectedTag: 'python',
    clickTag: () => undefined,
  },
  render: () => <InteractiveTagList initialTag="python" />,
}
