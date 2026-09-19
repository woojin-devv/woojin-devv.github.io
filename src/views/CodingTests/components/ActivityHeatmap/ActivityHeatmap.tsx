import { ExternalLink, FolderGit2, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import * as styles from './ActivityHeatmap.module.scss'

type ActivityHeatmapProps = {
  generatedAt: string
  repository: string
  tests: Array<{
    level: string | null
    platform: string
    problemUrl: string | null
    repositoryUrl: string
    reviews?: Array<{ round: number; date: string; occurredAt?: string }>
    solvedAt: string | null
    title: string
  }>
  totalCount: number
}

type HeatmapDay = {
  count: number
  date: string
  isFuture: boolean
  level: number
}

type HeatmapMonth = {
  cells: Array<HeatmapDay | null>
  count: number
  key: string
  label: string
}

type ActivityEntry = {
  date: string
  level: string | null
  occurredAt: string
  platform: string
  problemUrl: string | null
  repositoryUrl: string
  round: number
  title: string
}

const MONTH_COUNT = 12

const toSeoulDateKey = (value: Date | string) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value))

const formatSelectedDate = (date: string) =>
  new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date(`${date}T12:00:00+09:00`))

const getLevel = (count: number) => {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 7) return 3
  return 4
}

export const ActivityHeatmap = ({ generatedAt, repository, tests, totalCount }: ActivityHeatmapProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const { activeDays, activitiesByDate, monthGroups, periodCount } = useMemo(() => {
    const activities = tests.reduce<Record<string, ActivityEntry[]>>((result, test) => {
      const reviews = test.reviews?.length
        ? test.reviews
        : test.solvedAt ? [{ round: 1, date: test.solvedAt.slice(0, 10), occurredAt: test.solvedAt }] : []

      reviews.forEach((review) => {
        const entry: ActivityEntry = {
          date: review.date,
          level: test.level,
          occurredAt: review.occurredAt || `${review.date}T00:00:00+09:00`,
          platform: test.platform,
          problemUrl: test.problemUrl,
          repositoryUrl: test.repositoryUrl,
          round: review.round,
          title: test.title,
        }
        if (!result[review.date]) result[review.date] = []
        result[review.date].push(entry)
      })

      return result
    }, {})
    Object.values(activities).forEach((entries) => {
      entries.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    })
    const counts = Object.fromEntries(
      Object.entries(activities).map(([date, entries]) => [date, entries.length])
    )
    const todayKey = toSeoulDateKey(generatedAt)
    const [todayYear, todayMonth] = todayKey.split('-').map(Number)
    const months: HeatmapMonth[] = Array.from({ length: MONTH_COUNT }, (_, index) => {
      const monthDate = new Date(Date.UTC(todayYear, todayMonth - MONTH_COUNT + index, 1))
      const year = monthDate.getUTCFullYear()
      const month = monthDate.getUTCMonth()
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`
      const dayCount = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
      const firstWeekday = new Date(`${monthKey}-01T12:00:00+09:00`).getUTCDay()
      const monthDays: HeatmapDay[] = Array.from({ length: dayCount }, (_, dayIndex) => {
        const date = `${monthKey}-${String(dayIndex + 1).padStart(2, '0')}`
        const count = counts[date] || 0
        return { date, count, level: getLevel(count), isFuture: date > todayKey }
      })

      return {
        cells: [...Array.from({ length: firstWeekday }, () => null), ...monthDays],
        count: monthDays.reduce((sum, day) => sum + (day.isFuture ? 0 : day.count), 0),
        key: monthKey,
        label: `${year}. ${String(month + 1).padStart(2, '0')}`,
      }
    })
    const visibleDays = months.flatMap((month) => month.cells.filter((day): day is HeatmapDay => day !== null))

    return {
      activitiesByDate: activities,
      monthGroups: months,
      activeDays: visibleDays.filter((day) => !day.isFuture && day.count > 0).length,
      periodCount: visibleDays.reduce((sum, day) => sum + (day.isFuture ? 0 : day.count), 0),
    }
  }, [generatedAt, tests])

  const selectedActivities = selectedDate ? activitiesByDate[selectedDate] || [] : []

  return (
    <section className={styles.activity} aria-labelledby="activity-heading">
      <Card className={`${styles.activityCard} rounded-none border-solid shadow-none`}>
        <CardHeader className={`${styles.activityHeader} flex-row p-0`}>
          <div>
            <p>Daily activity</p>
            <h2 id="activity-heading">하루에 푼 문제</h2>
          </div>
          <div className={styles.stats}>
            <Badge variant="outline" className="gap-1.5 border-solid"><strong>{totalCount}</strong> solved problems</Badge>
            <Badge variant="outline" className="gap-1.5 border-solid"><strong>{activeDays}</strong> active days</Badge>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-zinc-700 bg-zinc-700 text-white hover:border-zinc-800 hover:bg-zinc-800 hover:text-white"
            >
              <a href={`https://github.com/${repository}`} target="_blank" rel="noreferrer">
                <FolderGit2 size={14} strokeWidth={1.8} aria-hidden="true" />
                Source
              </a>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className={styles.monthGrid} aria-label="최근 12개월 문제 풀이 활동 히트맵">
            {monthGroups.map((month) => (
              <section key={month.key} className={styles.monthBlock} aria-label={`${month.label} 활동`}>
                <header className={styles.monthHeader}>
                  <h3>{month.label}</h3>
                  <span>{month.count}회</span>
                </header>
                <div className={styles.monthWeekdays} aria-hidden="true">
                  {['일', '월', '화', '수', '목', '금', '토'].map((weekday) => <span key={weekday}>{weekday}</span>)}
                </div>
                <div className={styles.monthDays}>
                  {month.cells.map((day, index) => day ? (
                    <button
                      key={day.date}
                      type="button"
                      className={styles.cell}
                      data-level={day.level}
                      data-future={day.isFuture || undefined}
                      data-selected={selectedDate === day.date || undefined}
                      disabled={day.isFuture || day.count === 0}
                      onClick={() => setSelectedDate(day.date)}
                      title={`${day.date} · ${day.count}문제`}
                      aria-label={`${day.date}, ${day.count}문제 해결`}
                      aria-pressed={selectedDate === day.date}
                    />
                  ) : <span key={`${month.key}-empty-${index}`} className={styles.emptyCell} aria-hidden="true" />)}
                </div>
              </section>
            ))}
          </div>

          <div className={styles.activityFooter}>
            <p>최근 12개월간 <strong>{periodCount}</strong>회 풀이</p>
            <div className={styles.legend} aria-label="풀이 수 색상 범례">
              <span>적음</span>
              {[0, 1, 2, 3, 4].map((level) => <i key={level} data-level={level} />)}
              <span>많음</span>
            </div>
          </div>

          {selectedDate && (
            <div className={styles.dateDetails} aria-live="polite">
              <div className={styles.dateDetailsHeader}>
                <div>
                  <p>Selected date</p>
                  <h3>{formatSelectedDate(selectedDate)}</h3>
                  <span>{selectedActivities.length}회 풀이</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={styles.closeButton}
                  onClick={() => setSelectedDate(null)}
                  aria-label="선택한 날짜 닫기"
                >
                  <X size={16} strokeWidth={1.8} aria-hidden="true" />
                </Button>
              </div>

              <ol className={styles.dateProblemList}>
                {selectedActivities.map((activity) => (
                  <li key={`${activity.repositoryUrl}-${activity.round}-${activity.occurredAt}`}>
                    <div>
                      <span>{activity.platform}{activity.level ? ` · ${activity.level}` : ''} · {activity.round}회독</span>
                      <strong>{activity.title}</strong>
                    </div>
                    <div className={styles.dateProblemLinks}>
                      {activity.problemUrl && (
                        <Button asChild variant="outline" size="sm">
                          <a href={activity.problemUrl} target="_blank" rel="noreferrer">
                            문제 <ExternalLink size={13} strokeWidth={1.8} aria-hidden="true" />
                          </a>
                        </Button>
                      )}
                      <Button asChild variant="outline" size="sm">
                        <a href={activity.repositoryUrl} target="_blank" rel="noreferrer">
                          풀이 <ExternalLink size={13} strokeWidth={1.8} aria-hidden="true" />
                        </a>
                      </Button>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
