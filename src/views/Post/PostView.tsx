import type { ReactNode } from 'react'
import { useEffect } from 'react'

import Layout from '@/layouts'

import { Giscus } from '../../components/Giscus'
import { ProfileCard } from '../../components/ProfileCard'
import { type AdjacentPost, PostDiscovery, type PostSeries, type PostSummary, TableOfContents, TagList } from './components'
import * as styles from './Post.module.scss'

type PostViewProps = {
  pathname?: string
  title: string
  date: string
  tags: readonly string[]
  readingTime?: number
  html: string
  tableOfContents: string
  hero?: ReactNode
  previousPost?: AdjacentPost
  nextPost?: AdjacentPost
  relatedPosts?: readonly PostSummary[]
  series?: PostSeries
  showComments?: boolean
}

export const PostView = ({
  pathname = '/posts/storybook-preview/',
  title,
  date,
  tags,
  readingTime,
  html,
  tableOfContents,
  hero,
  previousPost,
  nextPost,
  relatedPosts = [],
  series,
  showComments = true,
}: PostViewProps) => {
  useEffect(() => {
    const blocks = document.querySelectorAll('pre > code.language-mermaid')
    if (blocks.length === 0) return

    void import('mermaid').then(({ default: mermaid }) => {
      blocks.forEach((block) => {
        const container = document.createElement('div')
        container.className = 'mermaid'
        container.textContent = block.textContent
        block.parentElement?.replaceWith(container)
      })
      mermaid.initialize({ startOnLoad: false, theme: 'neutral' })
      void mermaid.run({ querySelector: '.mermaid' })
    })
  }, [html])

  return (
    <Layout pathname={pathname}>
      <main className={styles.wrapper}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.metadata}>
          <p>{date}</p>
          {readingTime && <p>{readingTime} min read</p>}
        </div>
        <TagList tags={tags} className={styles.tagList} />
        {hero}
        <div className={styles.contentWrapper}>
          <section className={styles.content} dangerouslySetInnerHTML={{ __html: html }} />
          <TableOfContents html={tableOfContents} />
        </div>
        <PostDiscovery
          previousPost={previousPost}
          nextPost={nextPost}
          relatedPosts={relatedPosts}
          series={series}
        />
        <section className={styles.bio}>
          <ProfileCard pathname={pathname} />
        </section>
        {showComments && <Giscus />}
      </main>
    </Layout>
  )
}
