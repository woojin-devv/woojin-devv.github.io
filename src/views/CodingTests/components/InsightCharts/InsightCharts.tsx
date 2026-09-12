import type { CSSProperties } from 'react'
import { useMemo } from 'react'

import * as styles from './InsightCharts.module.scss'

type InsightTest = {
  category: string | null
  languages: string[]
}

type InsightChartsProps = {
  tests: InsightTest[]
}

type CountItem = {
  count: number
  label: string
}

const LANGUAGE_COLORS = ['var(--ink)', '#ff9d50', 'var(--faint)', 'var(--line)']
const TYPE_LIMIT = 8

const countValues = (values: string[]) =>
  [...values.reduce<Map<string, number>>((counts, value) => {
    counts.set(value, (counts.get(value) || 0) + 1)
    return counts
  }, new Map())]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'ko'))

const getProblemType = (category: string) => {
  const lastCategory = category.split('/').at(-1) || category
  return lastCategory.trim().replace(/，/g, ', ')
}

const getDonutGradient = (items: CountItem[], total: number) => {
  let cursor = 0

  return `conic-gradient(${items.map((item, index) => {
    const start = cursor
    cursor += (item.count / total) * 100
    return `${LANGUAGE_COLORS[index % LANGUAGE_COLORS.length]} ${start}% ${cursor}%`
  }).join(', ')})`
}

export const InsightCharts = ({ tests }: InsightChartsProps) => {
  const { languageTotal, languages, problemTypes } = useMemo(() => {
    const languageItems = countValues(tests.flatMap((test) => test.languages))
    const typeItems = countValues(
      tests.flatMap((test) => test.category ? [getProblemType(test.category)] : [])
    ).slice(0, TYPE_LIMIT)

    return {
      languages: languageItems,
      languageTotal: languageItems.reduce((sum, language) => sum + language.count, 0),
      problemTypes: typeItems,
    }
  }, [tests])

  const topLanguage = languages[0]
  const maxTypeCount = problemTypes[0]?.count || 1
  const donutStyle = {
    background: getDonutGradient(languages, languageTotal || 1),
  } as CSSProperties

  return (
    <section className={styles.insights} aria-labelledby="insight-heading">
      <header className={styles.sectionHeader}>
        <div>
          <p>Solution insights</p>
          <h2 id="insight-heading">어떤 문제를 많이 풀었을까?</h2>
        </div>
        <p>전체 풀이 기록 기준</p>
      </header>

      <div className={styles.chartGrid}>
        <article className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <div>
              <span>Language</span>
              <h3>풀이 언어</h3>
            </div>
            <strong>{languages.length}</strong>
          </div>

          <div className={styles.languageChart}>
            <div
              className={styles.donut}
              style={donutStyle}
              role="img"
              aria-label={languages.map((language) => `${language.label} ${language.count}개`).join(', ')}
            >
              <div>
                <strong>{topLanguage?.label}</strong>
                <span>{topLanguage ? Math.round((topLanguage.count / languageTotal) * 100) : 0}%</span>
              </div>
            </div>

            <ol className={styles.languageLegend}>
              {languages.map((language, index) => (
                <li key={language.label}>
                  <i style={{ background: LANGUAGE_COLORS[index % LANGUAGE_COLORS.length] }} />
                  <span>{language.label}</span>
                  <strong>{language.count}</strong>
                  <small>{Math.round((language.count / languageTotal) * 100)}%</small>
                </li>
              ))}
            </ol>
          </div>
        </article>

        <article className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <div>
              <span>Problem type</span>
              <h3>많이 푼 문제 유형</h3>
            </div>
            <strong>Top {TYPE_LIMIT}</strong>
          </div>

          <ol className={styles.barChart}>
            {problemTypes.map((type, index) => (
              <li key={type.label}>
                <span className={styles.rank}>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <div className={styles.barLabel}>
                    <span>{type.label}</span>
                    <strong>{type.count}</strong>
                  </div>
                  <span className={styles.barTrack}>
                    <i style={{ '--bar-width': `${(type.count / maxTypeCount) * 100}%` } as CSSProperties} />
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </section>
  )
}
