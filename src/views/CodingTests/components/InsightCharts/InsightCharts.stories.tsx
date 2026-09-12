import type { Meta, StoryObj } from '@storybook/react-vite'

import { InsightCharts } from './InsightCharts'

const tests = [
  ...Array.from({ length: 12 }, () => ({ languages: ['Python'], category: 'Trail 2 / 완전탐색 / DFS' })),
  ...Array.from({ length: 7 }, () => ({ languages: ['SQL'], category: 'GROUP BY' })),
  ...Array.from({ length: 4 }, () => ({ languages: ['JavaScript'], category: 'Trail 1 / 함수 / 값을 반환하는 함수' })),
  ...Array.from({ length: 3 }, () => ({ languages: ['Python'], category: '연습문제' })),
]

const meta = {
  title: 'Coding Tests/InsightCharts',
  component: InsightCharts,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: 40 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InsightCharts>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = { args: { tests } }
