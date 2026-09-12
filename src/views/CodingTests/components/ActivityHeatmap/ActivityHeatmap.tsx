import { FolderGit2 } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'

import * as styles from './ActivityHeatmap.module.scss'

type ActivityHeatmapProps = {
  generatedAt: string
  repository: string
  tests: Array<{
    reviews?: Array<{ round: number; date: string }>
    solvedAt: string | null
  }>
  totalCount: number
}

type HeatmapDay = {
  count: number
  date: string
  isFuture: boolean
  level: number
}

const DAY_IN_MS = 24 * 60 * 60 * 1000
const WEEK_COUNT = 53
const CELL_COUNT = WEEK_COUNT * 7

const toSeoulDateKey = (value: Date | string) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value))

const shiftDate = (date: Date, days: number) => new Date(date.getTime() + days * DAY_IN_MS)

const getLevel = (count: number) => {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 7) return 3
  return 4
}

export const ActivityHeatmap = ({ generatedAt, repository, tests, totalCount }: ActivityHeatmapProps) => {
  const heatmapViewportRef = useRef<HTMLDivElement>(null)
  const { activeDays, days, months, periodCount } = useMemo(() => {
    const counts = tests.reduce<Record<string, number>>((result, test) => {
      const activityDates = test.reviews?.length
        ? test.reviews.map((review) => review.date)
        : test.solvedAt ? [test.solvedAt.slice(0, 10)] : []

      activityDates.forEach((date) => {
        result[date] = (result[date] || 0) + 1
      })
      return result
    }, {})
    const todayKey = toSeoulDateKey(generatedAt)
    const today = new Date(`${todayKey}T12:00:00+09:00`)
    const lastSaturday = shiftDate(today, 6 - today.getUTCDay())
    const firstSunday = shiftDate(lastSaturday, -(CELL_COUNT - 1))
    const heatmapDays: HeatmapDay[] = Array.from({ length: CELL_COUNT }, (_, index) => {
      const date = toSeoulDateKey(shiftDate(firstSunday, index))
      const count = counts[date] || 0
      return { date, count, level: getLevel(count), isFuture: date > todayKey }
    })
    const seenMonths = new Set<string>()
    const monthLabels = heatmapDays.reduce<Array<{ label: string; week: number }>>((labels, day, index) => {
      const dayOfMonth = Number(day.date.slice(8, 10))
      const month = day.date.slice(0, 7)
      const week = Math.floor(index / 7)
      if (dayOfMonth <= 7 && !seenMonths.has(month)) {
        labels.push({ label: `${Number(day.date.slice(5, 7))}월`, week })
        seenMonths.add(month)
      }
      return labels
    }, [])

    return {
      days: heatmapDays,
      months: monthLabels,
      activeDays: heatmapDays.filter((day) => !day.isFuture && day.count > 0).length,
      periodCount: heatmapDays.reduce((sum, day) => sum + (day.isFuture ? 0 : day.count), 0),
    }
  }, [generatedAt, tests])

  useEffect(() => {
    const viewport = heatmapViewportRef.current
    if (!viewport) return

    viewport.scrollLeft = viewport.scrollWidth - viewport.clientWidth
  }, [days])

  return (
    <section className={styles.activity} aria-labelledby="activity-heading">
      <div className={styles.activityHeader}>
        <div>
          <p>Daily activity</p>
          <h2 id="activity-heading">하루에 푼 문제</h2>
        </div>
        <div className={styles.stats}>
          <p><strong>{totalCount}</strong> solved problems</p>
          <p><strong>{activeDays}</strong> active days</p>
          <a href={`https://github.com/${repository}`} target="_blank" rel="noreferrer">
            <FolderGit2 size={14} strokeWidth={1.8} aria-hidden="true" />
            Source
          </a>
        </div>
      </div>

      <div
        ref={heatmapViewportRef}
        className={styles.heatmapViewport}
        tabIndex={0}
        aria-label="최근 1년 문제 풀이 활동 히트맵"
      >
        <div className={styles.heatmapInner}>
          <div className={styles.months} aria-hidden="true">
            {months.map(({ label, week }) => (
              <span key={`${label}-${week}`} style={{ gridColumn: week + 1 }}>{label}</span>
            ))}
          </div>
          <div className={styles.heatmapBody}>
            <div className={styles.weekdays} aria-hidden="true">
              <span>월</span><span>수</span><span>금</span>
            </div>
            <div className={styles.grid}>
              {days.map((day) => (
                <span
                  key={day.date}
                  className={styles.cell}
                  data-level={day.level}
                  data-future={day.isFuture || undefined}
                  title={`${day.date} · ${day.count}문제`}
                  aria-label={`${day.date}, ${day.count}문제 해결`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.activityFooter}>
        <p>최근 1년간 <strong>{periodCount}</strong>회 풀이</p>
        <div className={styles.legend} aria-label="풀이 수 색상 범례">
          <span>적음</span>
          {[0, 1, 2, 3, 4].map((level) => <i key={level} data-level={level} />)}
          <span>많음</span>
        </div>
      </div>
    </section>
  )
}
