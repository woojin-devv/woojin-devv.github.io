import { Post } from '../Post'
import * as styles from './RecentPost.module.scss'

type RecentPostProps = {
  posts: Queries.HomeQuery['allMarkdownRemark']['nodes']
}

export const RecentPost = ({ posts }: RecentPostProps) => (
  <ul className={styles.recentPostList}>
      {posts.map(({ frontmatter: { title, description, date, tags, slug, heroImage, heroImageUrl, heroImageAlt }, id }) => (
        <Post
          key={id}
          variants="card"
          title={title}
          description={description}
          date={date}
          tags={tags}
          slug={slug}
          heroImage={heroImage?.childImageSharp?.gatsbyImageData}
          heroImageUrl={heroImageUrl}
          heroImageAlt={heroImageAlt}
        />
      ))}
  </ul>
)
