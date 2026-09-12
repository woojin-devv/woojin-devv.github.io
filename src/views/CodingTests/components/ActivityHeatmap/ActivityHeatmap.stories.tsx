import type { Meta, StoryObj } from '@storybook/react-vite'

import { ActivityHeatmap } from './ActivityHeatmap'

const tests = [
  '2026-09-12T09:00:00+09:00',
  '2026-09-12T10:00:00+09:00',
  '2026-09-11T09:00:00+09:00',
  '2026-09-11T10:00:00+09:00',
  '2026-09-11T11:00:00+09:00',
  '2026-09-09T09:00:00+09:00',
  '2026-09-09T10:00:00+09:00',
  '2026-09-09T11:00:00+09:00',
  '2026-09-09T12:00:00+09:00',
  '2026-09-09T13:00:00+09:00',
  '2026-09-09T14:00:00+09:00',
  '2026-09-09T15:00:00+09:00',
  '2026-09-09T16:00:00+09:00',
].map((solvedAt) => ({ solvedAt }))

const meta = {
  title: 'Coding Tests/ActivityHeatmap',
  component: ActivityHeatmap,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: 40 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActivityHeatmap>

export default meta
type Story = StoryObj<typeof meta>

export const RecentYear: Story = {
  args: {
    generatedAt: '2026-09-12T12:00:00+09:00',
    repository: 'woojin-devv/coding-test-notes',
    tests,
    totalCount: 351,
  },
}
