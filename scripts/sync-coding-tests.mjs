import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const repository = 'woojin-devv/coding-test-notes'
const projectRoot = path.resolve(import.meta.dirname, '..')
const sourceRoot = path.resolve(
  process.env.CODING_TEST_NOTES_DIR || process.argv[2] || path.join(projectRoot, 'external/coding-test-notes')
)
const outputPath = path.join(projectRoot, 'src/data/coding-tests.json')

if (!existsSync(sourceRoot)) {
  throw new Error(
    `Coding test repository not found at ${sourceRoot}. Pass its path as the first argument or set CODING_TEST_NOTES_DIR.`
  )
}

const normalizeText = (value) => value.replace(/[\u2000-\u200b\u202f\u205f\u3000]/g, ' ').replace(/\s+/g, ' ').trim()

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.git' || entry.name === '.DS_Store') return []
    const absolutePath = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(absolutePath) : [absolutePath]
  })

const languageNames = {
  '.c': 'C',
  '.cc': 'C++',
  '.cpp': 'C++',
  '.cs': 'C#',
  '.go': 'Go',
  '.java': 'Java',
  '.js': 'JavaScript',
  '.kt': 'Kotlin',
  '.php': 'PHP',
  '.py': 'Python',
  '.rb': 'Ruby',
  '.rs': 'Rust',
  '.sql': 'SQL',
  '.swift': 'Swift',
  '.ts': 'TypeScript',
}

const getCommitHistory = () => {
  const dates = new Map()
  const solutionCommits = new Map()
  const output = execFileSync(
    'git',
    ['-c', 'core.quotepath=false', '-C', sourceRoot, 'log', '--reverse', '--format=@@%H\t%aI', '--name-status', '-M'],
    { encoding: 'utf8' }
  )
  let currentCommit = ''
  let currentDate = ''

  output.split('\n').forEach((line) => {
    if (line.startsWith('@@')) {
      ;[currentCommit, currentDate] = line.slice(2).split('\t')
      return
    }

    if (!line || !currentDate) return

    const [status, ...paths] = line.split('\t')
    const isRename = status.startsWith('R') || status.startsWith('C')
    const filePath = paths.at(-1)

    if (!filePath) return

    const previousPath = isRename ? paths[0] : null
    if (!dates.has(filePath)) {
      dates.set(filePath, (previousPath && dates.get(previousPath)) || currentDate)
    }

    if (!languageNames[path.extname(filePath).toLowerCase()]) return

    const directory = path.posix.dirname(filePath)
    if (!solutionCommits.has(directory)) solutionCommits.set(directory, new Map())
    solutionCommits.get(directory).set(currentCommit, currentDate)
  })

  return {
    dates,
    solutionDates: new Map(
      [...solutionCommits].map(([directory, commits]) => [directory, [...commits.values()]])
    ),
  }
}

const getSourceInfo = () => ({
  commit: execFileSync('git', ['-C', sourceRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  syncedAt: execFileSync('git', ['-C', sourceRoot, 'show', '-s', '--format=%cI', 'HEAD'], { encoding: 'utf8' }).trim(),
})

const { dates: commitDates, solutionDates } = getCommitHistory()

const tests = walk(sourceRoot)
  .filter((filePath) => path.basename(filePath).toLowerCase() === 'readme.md')
  .filter((filePath) => path.dirname(filePath) !== sourceRoot)
  .map((readmePath) => {
    const relativePath = path.relative(sourceRoot, readmePath).split(path.sep).join('/')
    const directoryPath = path.posix.dirname(relativePath)
    const segments = directoryPath.split('/').map(normalizeText)
    const markdown = readFileSync(readmePath, 'utf8')
    const heading = normalizeText(markdown.match(/^#\s+(.+)$/m)?.[1] || segments.at(-1) || 'Untitled')
    const markdownLink = heading.match(/^\[(.*)\]\((https?:\/\/[^)]+)\)$/)
    const problemLink = markdown.match(/\[문제 링크\]\((https?:\/\/[^)]+)\)/)?.[1]
    const platform = segments[0] === '프로그래머스' ? 'Programmers' : segments[0] === 'codetree' ? 'CodeTree' : segments[0]
    const rawTitle = markdownLink?.[1] || heading
    const title = normalizeText(
      platform === 'Programmers'
        ? rawTitle.replace(/^\[level\s+\d+\]\s*/i, '').replace(/\s+-\s+\d+\s*$/, '')
        : rawTitle
    )
    const level = platform === 'Programmers'
      ? `Level ${segments[1]}`
      : segments[1]?.replace(/^trail/i, 'Trail ')
    const difficulty = normalizeText(markdown.match(/^\|\s*난이도\s*\|\s*([^|]+)\|/m)?.[1] || '') || null
    const category = platform === 'Programmers'
      ? normalizeText(markdown.match(/###\s*구분\s*\n+([^\n]+)/)?.[1] || '').replace(/^[^>]+>\s*/, '') || null
      : normalizeText(markdown.match(/^\|\s*커리큘럼\s*\|\s*(.+?)\s*\|$/m)?.[1] || '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') || null
    const solutionFiles = readdirSync(path.dirname(readmePath), { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.toLowerCase() !== 'readme.md' && entry.name !== '.DS_Store')
      .map((entry) => entry.name)
    const languages = [...new Set(solutionFiles.map((file) => languageNames[path.extname(file).toLowerCase()]).filter(Boolean))]
    const encodedPath = directoryPath.split('/').map(encodeURIComponent).join('/')
    const solvedAt = commitDates.get(relativePath) || null
    const reviewPath = path.join(path.dirname(readmePath), 'review.json')
    const storedReviews = existsSync(reviewPath)
      ? JSON.parse(readFileSync(reviewPath, 'utf8')).reviews
      : []
    const savedReviews = (Array.isArray(storedReviews) ? storedReviews : [])
      .filter((review) => Number.isInteger(review?.round) && review.round > 0 && /^\d{4}-\d{2}-\d{2}$/.test(review?.date))
      .sort((a, b) => a.round - b.round)
    const inferredReviews = (solutionDates.get(directoryPath) || []).map((date, index) => ({
      round: index + 1,
      date: date.slice(0, 10),
      occurredAt: date,
    }))
    const savedReviewsByRound = new Map(savedReviews.map((review) => [review.round, review]))
    const reviewCount = Math.max(1, inferredReviews.length, ...savedReviews.map((review) => review.round))
    const reviews = Array.from({ length: reviewCount }, (_, index) => {
      const inferredReview = inferredReviews[index]
      const savedReview = savedReviewsByRound.get(index + 1)

      if (!savedReview) return inferredReview

      return {
        ...inferredReview,
        ...savedReview,
        occurredAt: savedReview.occurredAt || inferredReview?.occurredAt || `${savedReview.date}T00:00:00+09:00`,
      }
    }).filter(Boolean)
    const lastReviewedAt = reviews.at(-1)?.date || solvedAt?.slice(0, 10) || null
    const lastActivityAt = reviews.at(-1)?.occurredAt || solvedAt || null

    return {
      id: directoryPath,
      title,
      platform,
      level: level || null,
      difficulty,
      category,
      languages,
      solvedAt,
      reviewCount,
      lastReviewedAt,
      lastActivityAt,
      reviews,
      problemUrl: markdownLink?.[2] || problemLink || null,
      repositoryUrl: `https://github.com/${repository}/tree/main/${encodedPath}`,
    }
  })
  .sort((a, b) =>
    new Date(b.lastActivityAt || b.lastReviewedAt || b.solvedAt || 0).getTime()
    - new Date(a.lastActivityAt || a.lastReviewedAt || a.solvedAt || 0).getTime()
    || a.title.localeCompare(b.title, 'ko')
  )

const source = getSourceInfo()
const payload = { repository, ...source, generatedAt: new Date().toISOString(), totalCount: tests.length, tests }

mkdirSync(path.dirname(outputPath), { recursive: true })
writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`)
console.log(`Synced ${tests.length} coding tests from ${repository} (${source.commit.slice(0, 7)}).`)
