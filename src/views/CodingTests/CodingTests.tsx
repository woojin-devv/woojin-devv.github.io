import type { HeadProps, PageProps } from 'gatsby'
import { Link } from 'gatsby'
import { BarChart3, ExternalLink, FolderGit2, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Select, Seo } from '@/components'
import codingTestData from '../../data/coding-tests.json'
import Layout from '../../layouts/Layout'

import * as styles from './CodingTests.module.scss'

type CodingTest = {
  id: string
  title: string
  platform: string
  level: string | null
  difficulty: string | null
  category: string | null
  languages: string[]
  solvedAt: string | null
  reviewCount: number
  lastReviewedAt: string | null
  lastActivityAt?: string | null
  reviews: Array<{ round: number; date: string; occurredAt?: string }>
  problemUrl: string | null
  repositoryUrl: string
}

type CodingTestData = {
  repository: string
  commit: string
  syncedAt: string
  generatedAt: string
  totalCount: number
  tests: CodingTest[]
}

const data = codingTestData as CodingTestData
const PAGE_SIZE = 30

const formatDate = (value: string | null) => {
  if (!value) return null

  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value)).replace(/\s/g, '')
}

const CodingTests = ({ location: { pathname } }: PageProps) => {
  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useState('All')
  const [level, setLevel] = useState('All')
  const [review, setReview] = useState('All')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const platforms = useMemo(() => ['All', ...new Set(data.tests.map((test) => test.platform))], [])
  const levels = useMemo(
    () => [
      'All',
      ...[...new Set(
        data.tests
          .filter((test) => platform === 'All' || test.platform === platform)
          .map((test) => test.level)
          .filter((value): value is string => Boolean(value))
      )].sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
    ],
    [platform]
  )
  const normalizedQuery = query.trim().toLocaleLowerCase('ko')
  const filteredTests = useMemo(
    () =>
      data.tests.filter((test) => {
        const matchesPlatform = platform === 'All' || test.platform === platform
        const matchesLevel = level === 'All' || test.level === level
        const matchesReview = review === 'All'
          || (review === '3+' ? test.reviewCount >= 3 : test.reviewCount === Number(review))
        const searchable = [test.title, test.category, test.difficulty, ...test.languages]
          .filter(Boolean)
          .join(' ')
          .toLocaleLowerCase('ko')

        return matchesPlatform && matchesLevel && matchesReview && (!normalizedQuery || searchable.includes(normalizedQuery))
      }),
    [level, normalizedQuery, platform, review]
  )

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [level, normalizedQuery, platform, review])

  useEffect(() => {
    if (!levels.includes(level)) setLevel('All')
  }, [level, levels])

  const platformCounts = useMemo(
    () =>
      data.tests.reduce<Record<string, number>>((counts, test) => {
        counts[test.platform] = (counts[test.platform] || 0) + 1
        return counts
      }, {}),
    []
  )

  return (
    <Layout pathname={pathname}>
      <main className={styles.main}>
        <header className={styles.pageHeader}>
          <div className={styles.headline}>
            <p className={styles.eyebrow}>Problem solving archive</p>
            <h1>Coding tests</h1>
          </div>
          <div className={styles.pageSummary}>
            <p><strong>{data.totalCount}</strong> solved problems</p>
            <Link to="/statistics/">
              통계 보기 <BarChart3 size={15} strokeWidth={1.8} aria-hidden="true" />
            </Link>
          </div>
        </header>

        <section className={styles.archive} aria-labelledby="coding-test-list-heading">
          <div className={styles.controls}>
            <label className={styles.search}>
              <span>Search problems</span>
              <div>
                <Search size={16} strokeWidth={1.8} aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="문제명, 분류 또는 언어 검색"
                />
              </div>
            </label>

            <div className={styles.filterRow}>
              <div className={styles.platformFilters} aria-label="플랫폼 필터">
                {platforms.map((item) => {
                  const count = item === 'All' ? data.totalCount : platformCounts[item]
                  const isActive = item === platform

                  return (
                    <button
                      key={item}
                      type="button"
                      className={isActive ? styles.activeFilter : undefined}
                      aria-pressed={isActive}
                      onClick={() => setPlatform(item)}
                    >
                      {item} <span>{count}</span>
                    </button>
                  )
                })}
              </div>
              <div className={styles.selectFilters}>
                <div className={styles.selectFilter}>
                  <span id="level-filter-label">Level</span>
                  <Select
                    ariaLabelledBy="level-filter-label"
                    value={level}
                    onValueChange={setLevel}
                    options={levels.map((item) => ({ label: item, value: item }))}
                  />
                </div>
                <div className={styles.selectFilter}>
                  <span id="review-filter-label">Review</span>
                  <Select
                    ariaLabelledBy="review-filter-label"
                    value={review}
                    onValueChange={setReview}
                    options={[
                      { label: 'All', value: 'All' },
                      { label: '1회독', value: '1' },
                      { label: '2회독', value: '2' },
                      { label: '3회독 이상', value: '3+' },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.listHeader}>
            <div>
              <p className={styles.eyebrow}>Latest solutions</p>
              <h2 id="coding-test-list-heading">Solved problems</h2>
            </div>
            <p>{filteredTests.length} results</p>
          </div>

          {filteredTests.length > 0 ? (
            <ol className={styles.problemList}>
              {filteredTests.slice(0, visibleCount).map((test, index) => (
                <li key={test.id}>
                  <span className={styles.index}>{String(index + 1).padStart(3, '0')}</span>
                  <div className={styles.problemBody}>
                    <div className={styles.problemTitleRow}>
                      <div>
                        <p>{test.platform}{test.level ? ` · ${test.level}` : ''}</p>
                        <h3>{test.title}</h3>
                      </div>
                      {(test.lastReviewedAt || test.solvedAt) && (
                        <time
                          dateTime={test.lastReviewedAt || test.solvedAt || undefined}
                          title={test.reviewCount > 1 ? '마지막 풀이일' : '최초 풀이일'}
                        >
                          {formatDate(test.lastReviewedAt || test.solvedAt)}
                        </time>
                      )}
                    </div>
                    <div className={styles.problemMeta}>
                      <span className={styles.reviewBadge} title={test.lastReviewedAt ? `마지막 학습일 ${formatDate(test.lastReviewedAt)}` : undefined}>
                        {test.reviewCount}회독
                      </span>
                      {test.difficulty && <span>{test.difficulty}</span>}
                      {test.category && <span>{test.category}</span>}
                      {test.languages.map((language) => <span key={language}>{language}</span>)}
                    </div>
                    <div className={styles.problemLinks}>
                      {test.problemUrl && (
                        <a href={test.problemUrl} target="_blank" rel="noreferrer">
                          문제 보기 <ExternalLink size={12} strokeWidth={1.8} aria-hidden="true" />
                        </a>
                      )}
                      <a href={test.repositoryUrl} target="_blank" rel="noreferrer">
                        풀이 보기 <FolderGit2 size={12} strokeWidth={1.8} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className={styles.empty}>조건에 맞는 문제가 없습니다.</p>
          )}

          {visibleCount < filteredTests.length && (
            <button
              className={styles.loadMore}
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            >
              더 보기 <span>{Math.min(PAGE_SIZE, filteredTests.length - visibleCount)}</span>
            </button>
          )}
        </section>
      </main>
    </Layout>
  )
}

export const Head = ({ location: { pathname } }: HeadProps) => (
  <Seo
    title="Coding tests | Woojin Devlog"
    description="CodeTree와 Programmers에서 해결한 코딩테스트 문제 기록입니다."
    pathname={pathname}
  />
)

export default CodingTests
