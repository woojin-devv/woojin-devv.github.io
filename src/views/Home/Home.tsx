import type { HeadProps, PageProps } from 'gatsby'

import { FloatingButton, Seo } from '@/components'
import Layout from '@/layouts'
import { getRefinedStringValue } from '@/utils'

import { PostList, RecentPost, TagList } from './components'
import * as styles from './Home.module.scss'
import { usePostInfiniteScroll, useTag } from './hooks'

const Home = ({ data, location: { pathname } }: PageProps<Queries.HomeQuery>) => {
  const { nodes: allPosts, totalCount, group } = data.allMarkdownRemark
  const recentPosts = allPosts.slice(0, 2)
  const { tags, selectedTag, clickTag } = useTag(totalCount, group)
  const { visiblePosts } = usePostInfiniteScroll(allPosts, selectedTag, totalCount)

  return (
    <Layout pathname={pathname}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Woojin's engineering journal</p>
            <h1 className={styles.heroTitle}>
              Build.<br />
              Learn.<br />
              <span>Document.</span>
            </h1>
            <p className={styles.heroDescription}>
              구조적으로 사고하고, 근거 있게 구현하기 위해 기록합니다.
            </p>
            <div className={styles.heroLinks}>
              <a href="https://github.com/woojin-devv" target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <a href="mailto:dnwls0723@sookmyung.ac.kr">Email ↗</a>
            </div>
          </div>
          <div className={styles.heroGraphic} aria-hidden="true">
            <span className={styles.graphicIndex}>01</span>
            <strong>W</strong>
            <span className={styles.graphicCaption}>THINK / MAKE / WRITE</span>
          </div>
        </section>
        <section className={styles.wrapper}>
          <div className={styles.sectionHeading}>
            <p>Selected</p>
            <h2>Latest notes</h2>
          </div>
          <RecentPost posts={recentPosts} />
          <div className={styles.sectionHeading}>
            <p>Archive</p>
            <h2>All writing</h2>
          </div>
          <TagList tags={tags} selectedTag={selectedTag} clickTag={clickTag} className={styles.tagList} />
          <PostList posts={visiblePosts} className={styles.postList} />
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
