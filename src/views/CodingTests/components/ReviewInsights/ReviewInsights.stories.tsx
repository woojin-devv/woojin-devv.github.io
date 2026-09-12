import type { Meta, StoryObj } from '@storybook/react-vite'

import { ReviewInsights } from './ReviewInsights'

const tests = [
  ...Array.from({ length: 9 }, () => ({ reviewCount: 1, reviews: [] })),
  { reviewCount: 2, reviews: [{ round: 1, date: '2026-02-02' }, { round: 2, date: '2026-05-10' }] },
  { reviewCount: 3, reviews: [{ round: 1, date: '2026-01-11' }, { round: 2, date: '2026-04-02' }, { round: 3, date: '2026-08-20' }] },
  { reviewCount: 4, reviews: [{ round: 1, date: '2025-12-01' }, { round: 2, date: '2026-03-03' }, { round: 3, date: '2026-06-14' }, { round: 4, date: '2026-09-01' }] },
]

const meta = {
  title: 'Coding Tests/ReviewInsights',
  component: ReviewInsights,
  decorators: [(Story) => <div style={{ maxWidth: 1080, margin: '0 auto', padding: 40 }}><Story /></div>],
} satisfies Meta<typeof ReviewInsights>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  args: { generatedAt: '2026-09-12T12:00:00+09:00', tests },
}
