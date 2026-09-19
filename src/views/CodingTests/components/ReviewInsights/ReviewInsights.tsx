import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

import * as styles from './ReviewInsights.module.scss'

type ReviewTest = {
  reviewCount: number
  reviews: Array<{ round: number; date: string }>
}

type ReviewInsightsProps = {
  generatedAt: string
  tests: ReviewTest[]
}

const MONTH_COUNT = 12

const tooltipStyle = {
  background: 'var(--paper-raised)',
  border: '1px solid var(--line)',
  borderRadius: 0,
  color: 'var(--ink)',
  fontSize: 12,
}

const monthKey = (date: Date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`

export const ReviewInsights = ({ generatedAt, tests }: ReviewInsightsProps) => {
  const distribution = [
    { label: '1회독', count: tests.filter((test) => test.reviewCount === 1).length },
    { label: '2회독', count: tests.filter((test) => test.reviewCount === 2).length },
    { label: '3회독', count: tests.filter((test) => test.reviewCount === 3).length },
    { label: '4회독+', count: tests.filter((test) => test.reviewCount >= 4).length },
  ]
  const reviewEvents = tests.flatMap((test) => test.reviews.filter((review) => review.round > 1))
  const eventCounts = reviewEvents.reduce<Record<string, number>>((counts, review) => {
    const key = review.date.slice(0, 7)
    counts[key] = (counts[key] || 0) + 1
    return counts
  }, {})
  const current = new Date(generatedAt)
  const lastMonth = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), 1))
  const trend = Array.from({ length: MONTH_COUNT }, (_, index) => {
    const date = new Date(Date.UTC(lastMonth.getUTCFullYear(), lastMonth.getUTCMonth() + index - MONTH_COUNT + 1, 1))
    const key = monthKey(date)
    return {
      count: eventCounts[key] || 0,
      key,
      label: `${date.getUTCMonth() + 1}월`,
    }
  })
  const reviewedCount = tests.filter((test) => test.reviewCount > 1).length
  const maxRound = Math.max(1, ...tests.map((test) => test.reviewCount))

  return (
    <section className={styles.reviews} aria-labelledby="review-insight-heading">
      <header className={styles.sectionHeader}>
        <div>
          <p>Review insights</p>
          <h2 id="review-insight-heading">얼마나 다시 풀었을까?</h2>
        </div>
        <dl className={styles.summary}>
          <div><dt>Reviewed</dt><dd>{reviewedCount}</dd></div>
          <div><dt>Review logs</dt><dd>{reviewEvents.length}</dd></div>
          <div><dt>Max round</dt><dd>{maxRound}</dd></div>
        </dl>
      </header>

      <div className={styles.chartGrid}>
        <Card className={`${styles.chartCard} rounded-none shadow-none`}>
          <CardHeader className={`${styles.cardHeader} flex-row p-0`}>
            <div><span>Review rounds</span><h3>회독별 문제 수</h3></div>
            <strong>{tests.length} problems</strong>
          </CardHeader>
          <CardContent className={`${styles.distributionChart} p-0`} role="img" aria-label={distribution.map((item) => `${item.label} ${item.count}문제`).join(', ')}>
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 480, height: 230 }}>
              <BarChart accessibilityLayer data={distribution} margin={{ top: 24, right: 8, bottom: 0, left: 8 }}>
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 11 }} />
                <YAxis hide />
                <Tooltip cursor={{ fill: 'var(--soft)', opacity: 0.55 }} contentStyle={tooltipStyle} formatter={(value) => [`${value}문제`, '문제 수']} />
                <Bar dataKey="count" fill="#ff9d50" radius={[2, 2, 0, 0]} maxBarSize={64}>
                  <LabelList dataKey="count" position="top" fill="var(--ink)" fontSize={11} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={`${styles.chartCard} rounded-none shadow-none`}>
          <CardHeader className={`${styles.cardHeader} flex-row p-0`}>
            <div><span>Review rhythm</span><h3>최근 12개월 복습 추이</h3></div>
            <strong>{reviewEvents.length} logs</strong>
          </CardHeader>
          <CardContent className={`${styles.trendChart} p-0`} role="img" aria-label={trend.map((item) => `${item.label} ${item.count}회`).join(', ')}>
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 480, height: 230 }}>
              <LineChart accessibilityLayer data={trend} margin={{ top: 20, right: 12, bottom: 0, left: -28 }}>
                <CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 3" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={18} tick={{ fill: 'var(--faint)', fontSize: 9 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: 'var(--faint)', fontSize: 9 }} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}회`, '복습']} />
                <Line type="monotone" dataKey="count" stroke="#ff9d50" strokeWidth={2} dot={{ r: 3, fill: '#ff9d50', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
          {reviewEvents.length === 0 && <p className={styles.emptyHint}>첫 복습을 기록하면 월별 추이가 표시됩니다.</p>}
        </Card>
      </div>
    </section>
  )
}
