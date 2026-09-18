import type { HeadProps, PageProps } from 'gatsby'
import { GatsbyImage, getSrc } from 'gatsby-plugin-image'

import { Seo } from '@/components'
import { getRefinedStringValue } from '@/utils'

import { PostView } from './PostView'
import * as styles from './Post.module.scss'

type PostPageContext = {
  previous?: string | null
  previousTitle?: string | null
  next?: string | null
  nextTitle?: string | null
}

const Post = ({ data, pageContext, location: { pathname } }: PageProps<Queries.PostQuery, PostPageContext>) => {
  if (!data.markdownRemark) throw new Error('마크다운 데이터가 존재하지 않습니다.')
  const { html, tableOfContents, timeToRead, frontmatter } = data.markdownRemark
  const { title, date, tags, slug, series, heroImage, heroImageUrl, heroImageAlt } = frontmatter
  const localHeroImage = heroImage?.childImageSharp?.gatsbyImageData
  const imageAlt = heroImageAlt ?? title
  const normalizedTags = new Set(tags.map((tag) => tag.toLocaleLowerCase()))
  const postSummaries = data.allMarkdownRemark.nodes
    .filter((post) => post.frontmatter.slug !== slug)
    .map((post) => ({
      ...post.frontmatter,
      sharedTagCount: post.frontmatter.tags.filter((tag) => normalizedTags.has(tag.toLocaleLowerCase())).length,
    }))
  const relatedPosts = postSummaries
    .filter(({ sharedTagCount }) => sharedTagCount > 0)
    .sort((a, b) => b.sharedTagCount - a.sharedTagCount)
    .slice(0, 3)
  const seriesPosts = series
    ? data.allMarkdownRemark.nodes
      .filter((post) => post.frontmatter.series === series)
      .map(({ frontmatter: post }) => post)
      .sort((a, b) => (a.seriesOrder ?? Number.MAX_SAFE_INTEGER) - (b.seriesOrder ?? Number.MAX_SAFE_INTEGER))
    : []

  const hero = localHeroImage ? (
    <GatsbyImage image={localHeroImage} alt={imageAlt} className={styles.heroImage} objectFit="contain" />
  ) : heroImageUrl ? (
    <img src={heroImageUrl} alt={imageAlt} className={styles.heroImage} />
  ) : null

  return (
    <PostView
      pathname={pathname}
      title={getRefinedStringValue(title)}
      date={getRefinedStringValue(date)}
      tags={tags}
      readingTime={Math.max(1, timeToRead ?? 1)}
      html={getRefinedStringValue(html)}
      tableOfContents={getRefinedStringValue(tableOfContents)}
      hero={hero}
      previousPost={pageContext.previous && pageContext.previousTitle
        ? { slug: pageContext.previous, title: pageContext.previousTitle }
        : undefined}
      nextPost={pageContext.next && pageContext.nextTitle
        ? { slug: pageContext.next, title: pageContext.nextTitle }
        : undefined}
      relatedPosts={relatedPosts}
      series={series ? { name: series, currentSlug: slug, posts: seriesPosts } : undefined}
    />
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
