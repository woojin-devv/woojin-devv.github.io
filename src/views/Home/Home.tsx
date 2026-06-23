import type { HeadProps, PageProps } from 'gatsby'
import { useState } from 'react'

import { FloatingButton, Hero, Seo } from '@/components'
import Layout from '@/layouts'
import { getRefinedStringValue } from '@/utils'

import { Pagination, PostList, PostSearch, RecentPost, TagList } from './components'
import * as styles from './Home.module.scss'
import { usePostPagination, useTag } from './hooks'

const Home = ({ data, location: { pathname, search } }: PageProps<Queries.HomeQuery>) => {
  const { nodes: allPosts, totalCount, group } = data.allMarkdownRemark
  const recentPosts = allPosts.slice(0, 3)
  const { tags, selectedTag, clickTag } = useTag(totalCount, group)
  const [searchQuery, setSearchQuery] = useState(() => new URLSearchParams(search).get('q') ?? '')
  const { visiblePosts, resultCount, currentPage, totalPages, changePage } = usePostPagination(
    allPosts,
    selectedTag,
    searchQuery,
    pathname,
    search,
  )

  return (
    <Layout pathname={pathname}>
      <main className={styles.main}>
        <Hero posts={allPosts} />
        <section className={styles.wrapper} aria-labelledby="archive-title">
          <div className={styles.archiveHeader}>
            <div>
              <p className={styles.eyebrow}>Writing Archive</p>
              <h2 id="archive-title">All writing</h2>
            </div>
            <p className={styles.archiveDescription}>
              Notes on development, debugging, design decisions, and things I learned while building.
            </p>
          </div>

          <div className={styles.controlPanel} aria-label="Writing filters">
            <PostSearch value={searchQuery} onChange={setSearchQuery} />
            <TagList tags={tags} selectedTag={selectedTag} clickTag={clickTag} className={styles.tagList} />
          </div>

          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Selected Writing</p>
              <h3>Recently organized</h3>
            </div>
            <p>Latest notes from the archive.</p>
          </div>
          <RecentPost posts={recentPosts} />

          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>Archive List</p>
              <h3>All posts</h3>
            </div>
            <p>
              {resultCount} {resultCount === 1 ? 'post' : 'posts'} found
            </p>
          </div>

          <div data-post-list>
            {resultCount > 0 ? (
              <PostList posts={visiblePosts} className={styles.postList} />
            ) : (
              <p className={styles.emptyResult}>No posts found for “{searchQuery}”.</p>
            )}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} changePage={changePage} />
        </section>
        <FloatingButton />
      </main>
    </Layout>
  )
}

export const Head = ({ location: { pathname }, data: { site, file } }: HeadProps<Queries.HomeQuery>) => {
  const seo = {
    title: site?.siteMetadata.title,
    description: site?.siteMetadata.description,
    heroImage: getRefinedStringValue(file?.publicURL),
  }

  return <Seo title={seo.title} description={seo.description} heroImage={seo.heroImage} pathname={pathname}></Seo>
}

export default Home
