import clsx from 'clsx'
import { ExternalLink } from 'lucide-react'
import { useState } from 'react'

import Layout from '@/layouts'

import { FloatingButton } from '../../components/FloatingButton'

import * as styles from './Calendar.module.scss'

export const CALENDAR_URL =
  'https://calendar.google.com/calendar/embed?src=b88481a5df1fe7ef0f552f95d3ed7c23ffef940ba4eaba6e42dce32864848bd3%40group.calendar.google.com&color=%23FF9D50&ctz=Asia%2FSeoul'

export type CalendarLoadingState = 'auto' | 'loading' | 'loaded'

type CalendarViewProps = {
  pathname?: string
  calendarUrl?: string
  loadingState?: CalendarLoadingState
}

export const CalendarView = ({
  pathname = '/calendar/',
  calendarUrl = CALENDAR_URL,
  loadingState = 'auto',
}: CalendarViewProps) => {
  const [hasLoaded, setHasLoaded] = useState(false)
  const isReady = loadingState === 'loaded' || (loadingState === 'auto' && hasLoaded)

  return (
    <Layout pathname={pathname}>
      <main className={styles.wrapper}>
        <header className={styles.pageHeader}>
          <div>
            <p className={styles.eyebrow}>Public schedule</p>
            <h1 className={styles.title}>Calendar</h1>
          </div>
          <p className={styles.description}>일정과 기록 계획을 공개 캘린더에서 확인할 수 있습니다.</p>
        </header>

        <section className={styles.calendarSection} aria-labelledby="calendar-heading">
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Asia / Seoul</p>
              <h2 id="calendar-heading">Woojin’s schedule</h2>
            </div>
            <a href={calendarUrl} target="_blank" rel="noreferrer">
              Google Calendar에서 보기
              <ExternalLink size={13} strokeWidth={1.8} aria-hidden="true" />
            </a>
          </div>

          <div className={styles.calendarFrame} aria-busy={!isReady}>
            <div className={clsx(styles.calendarPlaceholder, { [styles.hidden]: isReady })} aria-hidden="true">
              <div className={styles.placeholderToolbar} />
              <div className={styles.placeholderGrid} />
            </div>
            <iframe
              title="Woojin 공개 Google Calendar"
              src={calendarUrl}
              className={clsx(styles.calendar, { [styles.loaded]: isReady })}
              loading="lazy"
              onLoad={() => setHasLoaded(true)}
            />
          </div>
          <noscript>
            <p className={styles.noScriptMessage}>
              캘린더를 보려면 JavaScript를 활성화하거나{' '}
              <a href={calendarUrl}>Google Calendar에서 직접 확인해 주세요.</a>
            </p>
          </noscript>
        </section>
        <FloatingButton />
      </main>
    </Layout>
  )
}
