import clsx from 'clsx'
import { Link } from 'gatsby'
import { Moon, Sun } from 'lucide-react'
import { match } from 'ts-pattern'

import { Theme, useTheme } from '@/contexts'
import { reactCss } from '@/utils'

import * as styles from './Header.module.scss'
import { useScrollIndicator } from './hooks'

type HeaderProps = {
  pathname: string
}

export const Header = ({ pathname }: HeaderProps) => {
  const { theme, toggleDarkMode } = useTheme()
  const { isPost, progressWidth } = useScrollIndicator(pathname)

  return (
    <header className={clsx(styles.header, { [styles.fixed]: isPost })}>
      <div className={styles.wrapper}>
        <Link to="/" className={styles.headingLink}>
          <h1 className={styles.headingWrapper}>
            <span className={styles.mark}>W</span>
            <span className={styles.heading}>Woojin Devlog</span>
          </h1>
        </Link>
        <nav className={styles.headerButtons} aria-label="Main navigation">
          <Link to="/" className={styles.desktopOnly}>Writing</Link>
          <Link to="/coding-tests/" className={styles.iconLink}>
            <span className={styles.desktopLabel}>Algorithm</span>
            <span className={styles.mobileLabel}>ALGO</span>
          </Link>
          <Link to="/statistics/" className={styles.iconLink}>
            <span className={styles.desktopLabel}>Statistics</span>
            <span className={styles.mobileLabel}>STAT</span>
          </Link>
          <Link to="/calendar/" className={styles.iconLink}>
            <span className={styles.desktopLabel}>Calendar</span>
            <span className={styles.mobileLabel}>CAL</span>
          </Link>
          <a href="/rss.xml" className={styles.desktopOnly}>RSS</a>
          <button
            className={styles.iconButton}
            onClick={toggleDarkMode}
            aria-label={theme === Theme.DARK ? 'Use light theme' : 'Use dark theme'}
          >
            {theme === Theme.DARK ? (
              <Sun size={16} strokeWidth={1.8} aria-hidden="true" />
            ) : (
              <Moon size={16} strokeWidth={1.8} aria-hidden="true" />
            )}
          </button>
        </nav>
      </div>
      {match(isPost)
        .with(true, () => (
          <div style={reactCss({ '--progress-width': `${progressWidth}%` })} className={styles.progressBar} />
        ))
        .otherwise(() => null)}
    </header>
  )
}
