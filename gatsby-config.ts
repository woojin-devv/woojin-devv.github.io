import type { GatsbyConfig } from 'gatsby'

const siteUrl = 'https://woojin-devv.github.io'

const config: GatsbyConfig = {
  siteMetadata: {
    title: 'Woojin Devlog',
    description: '구조적으로 사고하고, 근거 있게 구현하기 위해 기록합니다.',
    siteUrl,
    keywords: ['woojin-devv', 'blog', 'tech', 'backend', 'frontend'],
    heroImage: './src/images/blogImage.png',
  },
  graphqlTypegen: {
    generateOnBuild: true,
  },
  jsxRuntime: 'automatic',
  plugins: [
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: siteUrl,
        sitemap: `${siteUrl}/sitemap.xml`,
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
    'gatsby-plugin-sass',
    'gatsby-plugin-advanced-sitemap-v5',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 780,
              linkImagesToOriginal: false,
              wrapperStyle: 'border-radius: 5px; overflow: hidden;',
            },
          },
          { resolve: 'gatsby-remark-autolink-headers', options: { icon: false } },
          'gatsby-remark-katex',
          { resolve: 'gatsby-remark-prismjs', options: { inlineCodeMarker: '>' } },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Woojin Devlog',
        short_name: 'Woojin',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#111111',
        display: 'standalone',
        icon: 'src/images/icon.png',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'contents', path: `${__dirname}/contents` },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'images', path: `${__dirname}/src/images` },
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          { site { siteMetadata { title description siteUrl site_url: siteUrl } } }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }: any) =>
              allMarkdownRemark.nodes.map((node: any) => ({
                ...node.frontmatter,
                date: new Date(node.frontmatter.date),
                url: `${site.siteMetadata.siteUrl}/posts${node.frontmatter.slug}`,
                guid: `${site.siteMetadata.siteUrl}/posts${node.frontmatter.slug}`,
                custom_elements: [{ 'content:encoded': node.html }],
              })),
            query: `
              { allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
                  nodes { frontmatter { date description slug title } html }
                }
              }
            `,
            output: '/rss.xml',
            title: 'Woojin Devlog RSS Feed',
          },
        ],
      },
    },
  ],
}

export default config
