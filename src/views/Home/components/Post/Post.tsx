import clsx from 'clsx'
import { Link } from 'gatsby'
import { GatsbyImage, type IGatsbyImageData } from 'gatsby-plugin-image'
import { match } from 'ts-pattern'

import { Date, Description, TagList, Title } from './components'
import * as styles from './Post.module.scss'

type PostProps = {
  variants: 'card' | 'item'
  title: string
  description: string
  date: string
  tags: readonly string[]
  slug: string
  heroImage: IGatsbyImageData | undefined
  heroImageUrl?: string | null
  heroImageAlt: string
}

export const Post = ({ variants, title, description, date, tags, slug, heroImage, heroImageUrl, heroImageAlt }: PostProps) => {
  const hasHeroImage = Boolean(heroImage || heroImageUrl)
  const renderImage = (className: string) =>
    heroImage ? (
      <GatsbyImage image={heroImage} alt={heroImageAlt} className={className} />
    ) : heroImageUrl ? (
      <img src={heroImageUrl} alt={heroImageAlt} className={className} loading="lazy" />
    ) : null

  return (
    <li className={styles.postItem}>
      <Link to={`/posts${slug}`} className={styles.articleLink}>
        {match(variants)
        .with('card', () => (
          <article className={styles.card}>
            <figure className={clsx({ [styles.cardFigureWithoutImage]: !hasHeroImage })}>
              {renderImage(styles.cardImage)}
              <figcaption className={styles.cardCaption}>
                <Date date={date} className={styles.cardDate} />
                <TagList tags={tags} className={styles.cardTagList} />
                <Title title={title} className={styles.cardTitle} />
                <Description description={description} className={styles.cardDescription} />
              </figcaption>
            </figure>
          </article>
        ))
        .with('item', () => (
          <article className={styles.item}>
            <figure className={clsx(styles.itemFigure, { [styles.itemFigureWithoutImage]: !hasHeroImage })}>
              {renderImage(styles.itemImage)}
              <figcaption className={styles.itemCaption}>
                <Date date={date} className={styles.itemDate} />
                <Title title={title} className={styles.itemTitle} />
                <Description description={description} className={styles.itemDescription} />
                <TagList tags={tags} className={styles.itemTagList} />
              </figcaption>
            </figure>
          </article>
        ))
          .exhaustive()}
      </Link>
    </li>
  )
}
