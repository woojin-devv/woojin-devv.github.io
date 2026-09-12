import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

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

const tooltipStyle = {
  background: 'var(--paper-raised)',
  border: '1px solid var(--line)',
  borderRadius: 0,
  color: 'var(--ink)',
  fontSize: 12,
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
            <div className={styles.donutWrap} role="img" aria-label={languages.map((language) => `${language.label} ${language.count}개`).join(', ')}>
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 154, height: 154 }}>
                <PieChart accessibilityLayer>
                  <Pie
                    data={languages}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={1}
                    stroke="none"
                  >
                    {languages.map((language, index) => (
                      <Cell key={language.label} fill={LANGUAGE_COLORS[index % LANGUAGE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value, name) => [`${value}개`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className={styles.donutCenter}>
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

          <div
            className={styles.barChart}
            role="img"
            aria-label={problemTypes.map((type) => `${type.label} ${type.count}문제`).join(', ')}
          >
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 480, height: 266 }}>
              <BarChart
                accessibilityLayer
                data={problemTypes}
                layout="vertical"
                margin={{ top: 0, right: 30, bottom: 0, left: 0 }}
              >
                <XAxis type="number" domain={[0, maxTypeCount]} hide />
                <YAxis
                  type="category"
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  width={132}
                  tick={{ fill: 'var(--muted)', fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: 'var(--soft)', opacity: 0.55 }}
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${value}문제`, '풀이 수']}
                />
                <Bar dataKey="count" fill="#ff9d50" radius={[0, 2, 2, 0]} maxBarSize={12}>
                  <LabelList dataKey="count" position="right" fill="var(--ink)" fontSize={11} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className={`${styles.chartCard} ${styles.radarCard}`}>
          <div className={styles.cardHeader}>
            <div>
              <span>Problem type radar</span>
              <h3>문제 유형 분포</h3>
            </div>
            <strong>Top {TYPE_LIMIT}</strong>
          </div>

          <div
            className={styles.radarChart}
            role="img"
            aria-label={problemTypes.map((type) => `${type.label} ${type.count}문제`).join(', ')}
          >
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 900, height: 360 }}>
              <RadarChart
                accessibilityLayer
                data={problemTypes}
                cx="50%"
                cy="50%"
                outerRadius="72%"
                margin={{ top: 20, right: 70, bottom: 20, left: 70 }}
              >
                <PolarGrid stroke="var(--line)" />
                <PolarAngleAxis dataKey="label" tick={{ fill: 'var(--muted)', fontSize: 11 }} />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, maxTypeCount]}
                  tickCount={5}
                  axisLine={false}
                  tick={{ fill: 'var(--faint)', fontSize: 9 }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`${value}문제`, '풀이 수']}
                />
                <Radar
                  dataKey="count"
                  stroke="#ff9d50"
                  fill="#ff9d50"
                  fillOpacity={0.28}
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#ff9d50', strokeWidth: 0 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </section>
  )
}
