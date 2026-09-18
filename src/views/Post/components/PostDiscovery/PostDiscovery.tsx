import clsx from 'clsx'
import { Link } from 'gatsby'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import * as styles from './PostDiscovery.module.scss'

export type AdjacentPost = {
  slug: string
  title: string
}

export type PostSummary = {
  slug: string
  title: string
  date: string
  tags: readonly string[]
}

export type PostSeries = {
  name: string
  currentSlug: string
  posts: readonly (PostSummary & { seriesOrder?: number | null })[]
}

type PostDiscoveryProps = {
  previousPost?: AdjacentPost
  nextPost?: AdjacentPost
  relatedPosts: readonly PostSummary[]
  series?: PostSeries
}

const postPath = (slug: string) => `/posts${slug}`

export const PostDiscovery = ({ previousPost, nextPost, relatedPosts, series }: PostDiscoveryProps) => (
  <div className={styles.discovery}>
    {(previousPost || nextPost) && (
      <nav className={styles.adjacentPosts} aria-label="이전 글과 다음 글">
        {previousPost ? (
          <Link to={postPath(previousPost.slug)} className={styles.adjacentLink}>
            <span><ArrowLeft size={14} aria-hidden="true" /> Previous post</span>
            <strong>{previousPost.title}</strong>
          </Link>
        ) : <span />}
        {nextPost ? (
          <Link to={postPath(nextPost.slug)} className={clsx(styles.adjacentLink, styles.nextPost)}>
            <span>Next post <ArrowRight size={14} aria-hidden="true" /></span>
            <strong>{nextPost.title}</strong>
          </Link>
        ) : <span />}
      </nav>
    )}

    {relatedPosts.length > 0 && (
      <section className={styles.section} aria-labelledby="related-posts-title">
        <header className={styles.sectionHeader}>
          <p>KEEP READING</p>
          <h2 id="related-posts-title">Related writing</h2>
        </header>
        <ul className={styles.relatedGrid}>
          {relatedPosts.map((post) => (
            <li key={post.slug}>
              <Link to={postPath(post.slug)}>
                <time>{post.date}</time>
                <strong>{post.title}</strong>
                <span>{post.tags.slice(0, 3).join(' · ')}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    )}

    {series && series.posts.length > 1 && (
      <section className={styles.section} aria-labelledby="series-title">
        <header className={styles.sectionHeader}>
          <p>SERIES</p>
          <h2 id="series-title">{series.name}</h2>
        </header>
        <ol className={styles.seriesList}>
          {series.posts.map((post, index) => {
            const isCurrent = post.slug === series.currentSlug
            return (
              <li key={post.slug} className={clsx({ [styles.currentSeriesPost]: isCurrent })}>
                <Link to={postPath(post.slug)} aria-current={isCurrent ? 'page' : undefined}>
                  <span>{String(post.seriesOrder ?? index + 1).padStart(2, '0')}</span>
                  <strong>{post.title}</strong>
                  <small>{isCurrent ? 'Reading' : post.date}</small>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>
    )}
  </div>
)
