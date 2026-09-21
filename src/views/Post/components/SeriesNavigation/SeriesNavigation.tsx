import { Link } from 'gatsby'
import { BookOpen, ChevronDown } from 'lucide-react'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

import * as styles from './SeriesNavigation.module.scss'

export type SeriesPost = {
  slug: string
  title: string
  date: string
  tags: readonly string[]
  seriesOrder?: number | null
}

export type PostSeries = {
  name: string
  currentSlug: string
  posts: readonly SeriesPost[]
}

type SeriesNavigationProps = {
  series: PostSeries
  variant: 'desktop' | 'mobile'
}

const postPath = (slug: string) => `/posts${slug}`

const getDisplayTitle = (title: string, seriesName: string) => {
  const seriesPrefix = `[${seriesName}]`

  return title.startsWith(seriesPrefix) ? title.slice(seriesPrefix.length).trim() : title
}

const SeriesList = ({ series }: { series: PostSeries }) => (
  <ol className={styles.list}>
    {series.posts.map((post, index) => {
      const isCurrent = post.slug === series.currentSlug
      const order = post.seriesOrder ?? index + 1
      const displayTitle = getDisplayTitle(post.title, series.name)

      return (
        <li key={post.slug}>
          <Link
            to={postPath(post.slug)}
            aria-current={isCurrent ? 'page' : undefined}
            className={cn(styles.link, isCurrent && styles.current)}
          >
            <span className={styles.order}>{String(order).padStart(2, '0')}</span>
            <span className={styles.postTitle} title={post.title}>{displayTitle}</span>
          </Link>
        </li>
      )
    })}
  </ol>
)

export const SeriesNavigation = ({ series, variant }: SeriesNavigationProps) => {
  const currentIndex = series.posts.findIndex((post) => post.slug === series.currentSlug)
  const progress = currentIndex >= 0 ? currentIndex + 1 : 1
  const label = `${series.name} 시리즈, ${progress}/${series.posts.length}`

  if (variant === 'mobile') {
    return (
      <Collapsible className={styles.mobile}>
        <CollapsibleTrigger className={styles.mobileSummary} aria-label={label}>
          <span className={styles.mobileTitle}>
            <BookOpen size={16} aria-hidden="true" />
            <span>
              <strong>{series.name}</strong>
              <small>{progress} / {series.posts.length}</small>
            </span>
          </span>
          <ChevronDown className={styles.chevron} size={18} aria-hidden="true" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <nav aria-label={label} className={styles.mobileList}>
            <SeriesList series={series} />
          </nav>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <nav className={styles.desktop} aria-label={label}>
      <div className={styles.heading}>
        <span className={styles.eyebrow}><BookOpen size={13} aria-hidden="true" /> Series</span>
        <strong>{series.name}</strong>
        <small>{progress} / {series.posts.length}</small>
      </div>
      <SeriesList series={series} />
    </nav>
  )
}
