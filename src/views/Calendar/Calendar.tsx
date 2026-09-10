import type { HeadProps, PageProps } from 'gatsby'

import { Seo } from '@/components'

import { CalendarView } from './CalendarView'

const Calendar = ({ location: { pathname } }: PageProps) => <CalendarView pathname={pathname} />

export const Head = ({ location: { pathname } }: HeadProps) => (
  <Seo
    title="Calendar | Woojin Devlog"
    description="Woojin Devlog의 공개 일정 캘린더입니다."
    pathname={pathname}
  />
)

export default Calendar
