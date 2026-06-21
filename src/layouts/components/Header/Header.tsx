import clsx from 'clsx'
import { Link } from 'gatsby'
import { match } from 'ts-pattern'

import { useTheme } from '@/contexts'
import { reactCss } from '@/utils'

import * as styles from './Header.module.scss'
import { useScrollIndicator } from './hooks'

type HeaderProps = {
  pathname: string
}

export const Header = ({ pathname }: HeaderProps) => {
  const { toggleDarkMode } = useTheme()
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
          <Link to="/">Writing</Link>
          <Link to="/guestbook/" className={styles.iconLink}>
            <span className={styles.desktopLabel}>Guestbook</span>
            <span className={styles.mobileLabel}>GB</span>
          </Link>
          <a href="/rss.xml">RSS</a>
          <button className={styles.iconButton} onClick={toggleDarkMode}>
            <span className={styles.desktopLabel}>Theme</span>
            <span className={styles.mobileLabel}>DM</span>
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
