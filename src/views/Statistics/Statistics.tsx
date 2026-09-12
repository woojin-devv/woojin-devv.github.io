import type { HeadProps, PageProps } from 'gatsby'

import { Seo } from '@/components'
import Layout from '@/layouts'
import codingTestData from '../../data/coding-tests.json'
import { ActivityHeatmap } from '../CodingTests/components/ActivityHeatmap'
import { InsightCharts } from '../CodingTests/components/InsightCharts'

import * as styles from './Statistics.module.scss'
import { WritingInsights } from './components/WritingInsights'

type StatisticsData = {
  allMarkdownRemark: {
    nodes: Array<{
      frontmatter: {
        date: string | null
        tags: Array<string | null> | null
      } | null
    }>
  }
}

type CodingTestData = {
  generatedAt: string
  repository: string
  totalCount: number
  tests: Array<{
    category: string | null
    languages: string[]
    solvedAt: string | null
  }>
}

const coding = codingTestData as CodingTestData

const Statistics = ({ data, location: { pathname } }: PageProps<StatisticsData>) => {
  const posts = data.allMarkdownRemark.nodes.flatMap((node) => node.frontmatter ? [node.frontmatter] : [])

  return (
    <Layout pathname={pathname}>
      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <p className={styles.eyebrow}>Archive in numbers</p>
          <h1>Statistics</h1>
          <p className={styles.intro}>쌓아온 글과 문제 풀이 기록을 한눈에 살펴봅니다.</p>
        </header>

        <div className={styles.sections}>
          <WritingInsights posts={posts} />

          <section className={styles.codingSection} aria-labelledby="coding-statistics-heading">
            <header className={styles.codingHeader}>
              <p>Coding test insights</p>
              <h2 id="coding-statistics-heading">문제 풀이는 어떻게 쌓였을까?</h2>
            </header>
            <ActivityHeatmap
              generatedAt={coding.generatedAt}
              repository={coding.repository}
              tests={coding.tests}
              totalCount={coding.totalCount}
            />
            <InsightCharts tests={coding.tests} />
          </section>
        </div>
      </main>
    </Layout>
  )
}

export const Head = ({ location: { pathname } }: HeadProps<StatisticsData>) => (
  <Seo
    title="Statistics | Woojin Devlog"
    description="Woojin Devlog의 글 작성과 코딩 테스트 풀이 통계입니다."
    pathname={pathname}
  />
)

export default Statistics
