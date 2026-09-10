import type { HeadProps, PageProps } from 'gatsby'
import { GatsbyImage, getSrc } from 'gatsby-plugin-image'

import { Seo } from '@/components'
import { getRefinedStringValue } from '@/utils'

import { PostView } from './PostView'
import * as styles from './Post.module.scss'

// TODO: pageContext 값을 이용한 prev, next 컴포넌트 생성
const Post = ({ data, pageContext, location: { pathname } }: PageProps<Queries.PostQuery>) => {
  if (!data.markdownRemark) throw new Error('마크다운 데이터가 존재하지 않습니다.')
  const { html, tableOfContents, frontmatter } = data.markdownRemark
  const { title, date, tags, heroImage, heroImageUrl, heroImageAlt } = frontmatter
  const localHeroImage = heroImage?.childImageSharp?.gatsbyImageData
  const imageAlt = heroImageAlt ?? title

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
      html={getRefinedStringValue(html)}
      tableOfContents={getRefinedStringValue(tableOfContents)}
      hero={hero}
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
