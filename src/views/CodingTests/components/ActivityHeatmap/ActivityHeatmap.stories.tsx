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
].map((solvedAt, index) => ({
  title: `샘플 알고리즘 문제 ${index + 1}`,
  platform: index % 3 === 0 ? 'Programmers' : 'CodeTree',
  level: index % 3 === 0 ? 'Level 2' : 'Trail 2',
  solvedAt,
  problemUrl: 'https://example.com/problem',
  repositoryUrl: 'https://github.com/woojin-devv/coding-test-notes',
  reviews: [{ round: 1, date: solvedAt.slice(0, 10), occurredAt: solvedAt }],
}))

tests[0].reviews.push({ round: 2, date: '2026-09-12', occurredAt: '2026-09-12T18:00:00+09:00' })

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
