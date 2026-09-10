import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { PostSearch } from './PostSearch'

const SearchDemo = ({ initialValue = '' }: { initialValue?: string }) => {
  const [value, setValue] = useState(initialValue)
  return <PostSearch value={value} onChange={setValue} />
}

const meta = {
  title: 'Home/PostSearch',
  component: PostSearch,
  decorators: [
    (Story) => (
      <div style={{ padding: 40 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PostSearch>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: { value: '', onChange: () => undefined },
  render: () => <SearchDemo />,
}

export const WithClearButton: Story = {
  args: { value: 'Spring', onChange: () => undefined },
  render: () => <SearchDemo initialValue="Spring" />,
}
