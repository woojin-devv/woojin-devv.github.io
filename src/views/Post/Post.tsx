import type { HeadProps, PageProps } from 'gatsby'
import { GatsbyImage, getSrc } from 'gatsby-plugin-image'
import { useEffect } from 'react'

import { Giscus, ProfileCard, Seo } from '@/components'
import Layout from '@/layouts'
import { getRefinedStringValue } from '@/utils'

import { TableOfContents, TagList } from './components'
import * as styles from './Post.module.scss'

// TODO: pageContext 값을 이용한 prev, next 컴포넌트 생성
const Post = ({ data, pageContext, location: { pathname } }: PageProps<Queries.PostQuery>) => {
  if (!data.markdownRemark) throw new Error('마크다운 데이터가 존재하지 않습니다.')
  const { html, tableOfContents, frontmatter } = data.markdownRemark
  const { title, date, tags, heroImage, heroImageUrl, heroImageAlt } = frontmatter
  const localHeroImage = heroImage?.childImageSharp?.gatsbyImageData

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
  }, [])

  return (
    <Layout pathname={pathname}>
      <main className={styles.wrapper}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.date}>{date}</p>
        <TagList tags={tags} className={styles.tagList} />
        {localHeroImage ? (
          <GatsbyImage image={localHeroImage} alt={heroImageAlt} className={styles.heroImage} objectFit="contain" />
        ) : heroImageUrl ? (
          <img src={heroImageUrl} alt={heroImageAlt} className={styles.heroImage} />
        ) : null}
        <div className={styles.contentWrapper}>
          <section className={styles.content} dangerouslySetInnerHTML={{ __html: getRefinedStringValue(html) }} />
          <TableOfContents html={getRefinedStringValue(tableOfContents)} />
        </div>
        <section className={styles.bio}>
          <ProfileCard pathname={pathname} />
        </section>
        <Giscus />
      </main>
    </Layout>
  )
}

export const Head = ({ data: { markdownRemark }, location: { pathname } }: HeadProps<Queries.PostQuery>) => {
  const seo = {
    title: markdownRemark?.frontmatter.title,
    description: markdownRemark?.frontmatter.description,
    heroImage: markdownRemark?.frontmatter.heroImage,
    heroImageUrl: markdownRemark?.frontmatter.heroImageUrl,
  }
  const localHeroImage = seo.heroImage?.childImageSharp?.gatsbyImageData

  return (
    <Seo
      title={seo.title}
      description={seo.description}
      heroImage={(localHeroImage ? getSrc(localHeroImage) : undefined) || seo.heroImageUrl || undefined}
      pathname={pathname}
    />
  )
}

export default Post
