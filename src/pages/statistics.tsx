import { graphql } from 'gatsby'

export const query = graphql`
  query Statistics {
    allMarkdownRemark(sort: { frontmatter: { date: ASC } }) {
      nodes {
        frontmatter {
          date(formatString: "YYYY-MM-DD")
          tags
        }
      }
    }
  }
`

export { Head } from '../views/Statistics'
export { default } from '../views/Statistics'
