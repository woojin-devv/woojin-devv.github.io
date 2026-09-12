import type { Meta, StoryObj } from '@storybook/react-vite'

import { InsightCharts } from './InsightCharts'

const tests = [
  ...Array.from({ length: 12 }, (_, index) => ({
    platform: 'CodeTree',
    level: 'Trail 2',
    difficulty: index < 7 ? '쉬움' : index < 11 ? '보통' : '어려움',
    languages: ['Python'],
    category: 'Trail 2 / 완전탐색 / DFS',
  })),
  ...Array.from({ length: 7 }, (_, index) => ({
    platform: 'Programmers',
    level: `Level ${index < 4 ? 2 : index < 6 ? 3 : 4}`,
    difficulty: null,
    languages: ['SQL'],
    category: 'GROUP BY',
  })),
  ...Array.from({ length: 4 }, (_, index) => ({
    platform: 'Programmers',
    level: `Level ${index + 1}`,
    difficulty: null,
    languages: ['JavaScript'],
    category: '연습문제',
  })),
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
