import { useMemo } from 'react'
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import * as styles from './WritingInsights.module.scss'

type WritingPost = {
  date: string | null
  tags: readonly (string | null)[] | null
}

type WritingInsightsProps = {
  posts: readonly WritingPost[]
}

const MONTH_COUNT = 12
const TAG_LIMIT = 10

const getMonthKey = (date: Date) =>
  `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`

const shiftMonth = (date: Date, amount: number) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1))

const tooltipStyle = {
  background: 'var(--paper-raised)',
  border: '1px solid var(--line)',
  borderRadius: 0,
  color: 'var(--ink)',
  fontSize: 12,
}

export const WritingInsights = ({ posts }: WritingInsightsProps) => {
  const { months, tagCount, tags, thisYearCount } = useMemo(() => {
    const validDates = posts
      .map((post) => post.date ? new Date(`${post.date}T00:00:00Z`) : null)
      .filter((date): date is Date => Boolean(date && !Number.isNaN(date.getTime())))
    const latestDate = validDates.reduce(
      (latest, date) => date > latest ? date : latest,
      new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)),
    )
    const lastMonth = new Date(Date.UTC(latestDate.getUTCFullYear(), latestDate.getUTCMonth(), 1))
    const monthCounts = posts.reduce<Record<string, number>>((counts, post) => {
      if (!post.date) return counts
      const key = post.date.slice(0, 7)
      counts[key] = (counts[key] || 0) + 1
      return counts
    }, {})
    const monthItems = Array.from({ length: MONTH_COUNT }, (_, index) => {
      const date = shiftMonth(lastMonth, index - MONTH_COUNT + 1)
      const key = getMonthKey(date)
      return {
        count: monthCounts[key] || 0,
        key,
        label: `${date.getUTCMonth() + 1}월`,
        year: date.getUTCFullYear(),
        axisLabel: index === 0 || date.getUTCMonth() === 0
          ? `${date.getUTCMonth() + 1}월 '${String(date.getUTCFullYear()).slice(2)}`
          : `${date.getUTCMonth() + 1}월`,
      }
    })
    const tagCounts = posts.reduce<Map<string, number>>((counts, post) => {
      post.tags?.filter((tag): tag is string => Boolean(tag)).forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1)
      })
      return counts
    }, new Map())
    const tagItems = [...tagCounts]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'ko'))
      .slice(0, TAG_LIMIT)

    return {
      months: monthItems,
      tags: tagItems,
      tagCount: tagCounts.size,
      thisYearCount: posts.filter((post) => post.date?.startsWith(`${lastMonth.getUTCFullYear()}-`)).length,
    }
  }, [posts])

  const maxTagCount = tags[0]?.count || 1

  return (
    <section className={styles.writing} aria-labelledby="writing-insight-heading">
      <header className={styles.sectionHeader}>
        <div>
          <p>Writing insights</p>
          <h2 id="writing-insight-heading">기록은 어떻게 쌓였을까?</h2>
        </div>
        <dl className={styles.summary}>
          <div><dt>Posts</dt><dd>{posts.length}</dd></div>
          <div><dt>Tags</dt><dd>{tagCount}</dd></div>
          <div><dt>This year</dt><dd>{thisYearCount}</dd></div>
        </dl>
      </header>

      <div className={styles.chartGrid}>
        <article className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <div><span>Publishing rhythm</span><h3>최근 12개월 발행 추이</h3></div>
            <strong>{months.reduce((sum, month) => sum + month.count, 0)} posts</strong>
          </div>
          <div
            className={styles.monthChart}
            role="img"
            aria-label={months.map((month) => `${month.year}년 ${month.label} ${month.count}개`).join(', ')}
          >
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 580, height: 220 }}>
              <BarChart accessibilityLayer data={months} margin={{ top: 22, right: 4, bottom: 0, left: 4 }}>
                <XAxis
                  dataKey="axisLabel"
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                  minTickGap={20}
                  tick={{ fill: 'var(--faint)', fontSize: 9 }}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: 'var(--soft)', opacity: 0.55 }}
                  contentStyle={tooltipStyle}
                  labelFormatter={(_, payload) => {
                    const month = payload[0]?.payload as typeof months[number] | undefined
                    return month ? `${month.year}년 ${month.label}` : ''
                  }}
                  formatter={(value) => [`${value}개`, '발행 글']}
                />
                <Bar dataKey="count" fill="#ff9d50" radius={[2, 2, 0, 0]} maxBarSize={36}>
                  <LabelList dataKey="count" position="top" fill="var(--muted)" fontSize={10} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <div><span>Topics</span><h3>많이 기록한 태그</h3></div>
            <strong>Top {Math.min(TAG_LIMIT, tags.length)}</strong>
          </div>
          <div
            className={styles.tagChart}
            role="img"
            aria-label={tags.map((tag) => `${tag.label} ${tag.count}개`).join(', ')}
          >
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 360, height: 266 }}>
              <BarChart
                accessibilityLayer
                data={tags}
                layout="vertical"
                margin={{ top: 0, right: 28, bottom: 0, left: 0 }}
              >
                <XAxis type="number" domain={[0, maxTagCount]} hide />
                <YAxis
                  type="category"
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  width={112}
                  tick={{ fill: 'var(--muted)', fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: 'var(--soft)', opacity: 0.55 }}
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${value}개`, '작성 글']}
                />
                <Bar dataKey="count" fill="var(--ink)" radius={[0, 2, 2, 0]} maxBarSize={9}>
                  <LabelList dataKey="count" position="right" fill="var(--ink)" fontSize={10} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </section>
  )
}
