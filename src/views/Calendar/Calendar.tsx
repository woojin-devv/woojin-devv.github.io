import clsx from 'clsx'
import type { HeadProps, PageProps } from 'gatsby'
import { ExternalLink } from 'lucide-react'
import { useState } from 'react'

import { FloatingButton, Seo } from '@/components'
import Layout from '@/layouts'

import * as styles from './Calendar.module.scss'

const CALENDAR_URL =
  'https://calendar.google.com/calendar/embed?src=b88481a5df1fe7ef0f552f95d3ed7c23ffef940ba4eaba6e42dce32864848bd3%40group.calendar.google.com&color=%23FF9D50&ctz=Asia%2FSeoul'

const Calendar = ({ location: { pathname } }: PageProps) => {
  const [isCalendarReady, setIsCalendarReady] = useState(false)

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
            <a href={CALENDAR_URL} target="_blank" rel="noreferrer">
              Google Calendar에서 보기
              <ExternalLink size={13} strokeWidth={1.8} aria-hidden="true" />
            </a>
          </div>

          <div className={styles.calendarFrame} aria-busy={!isCalendarReady}>
            <div
              className={clsx(styles.calendarPlaceholder, { [styles.hidden]: isCalendarReady })}
              aria-hidden="true"
            >
              <div className={styles.placeholderToolbar} />
              <div className={styles.placeholderGrid} />
            </div>
            <iframe
              title="Woojin 공개 Google Calendar"
              src={CALENDAR_URL}
              className={clsx(styles.calendar, { [styles.loaded]: isCalendarReady })}
              loading="lazy"
              onLoad={() => setIsCalendarReady(true)}
            />
          </div>
          <noscript>
            <p className={styles.noScriptMessage}>
              캘린더를 보려면 JavaScript를 활성화하거나{' '}
              <a href={CALENDAR_URL}>Google Calendar에서 직접 확인해 주세요.</a>
            </p>
          </noscript>
        </section>
        <FloatingButton />
      </main>
    </Layout>
  )
}

export const Head = ({ location: { pathname } }: HeadProps) => (
  <Seo
    title="Calendar | Woojin Devlog"
    description="Woojin Devlog의 공개 일정 캘린더입니다."
    pathname={pathname}
  />
)

export default Calendar
