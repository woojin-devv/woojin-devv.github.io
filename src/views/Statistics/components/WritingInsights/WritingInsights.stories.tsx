import type { Meta, StoryObj } from '@storybook/react-vite'

import { WritingInsights } from './WritingInsights'

const topics = ['spring', 'javascript', 'React', 'cs', 'algorithm', 'Web', 'python']
const posts = Array.from({ length: 42 }, (_, index) => {
  const month = (index % 12) + 1
  const day = (index % 24) + 1

  return {
    date: `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    tags: [topics[index % topics.length], index % 3 === 0 ? 'study' : null],
  }
})

const meta = {
  title: 'Statistics/WritingInsights',
  component: WritingInsights,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: 40 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WritingInsights>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = { args: { posts } }
