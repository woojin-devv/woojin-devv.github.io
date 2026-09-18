import { graphql } from 'gatsby'

export const query = graphql`
  query Post($id: String) {
    markdownRemark(id: { eq: $id }) {
      html
      timeToRead
      frontmatter {
        date(formatString: "YY.MM.DD")
        description
        slug
        series
        seriesOrder
        heroImage {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED)
          }
        }
        heroImageUrl
        heroImageAlt
        tags
        title
      }
      tableOfContents
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      nodes {
        id
        frontmatter {
          date(formatString: "YY.MM.DD")
          slug
          tags
          title
          series
          seriesOrder
        }
      }
    }
  }
`

export { Head } from '../views/Post'
export { default } from '../views/Post'
