import * as Dialog from '@radix-ui/react-dialog'
import clsx from 'clsx'
import { Link } from 'gatsby'
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import { match } from 'ts-pattern'

import { Theme, useTheme } from '@/contexts'
import { reactCss } from '@/utils'

import * as styles from './Header.module.scss'
import { useScrollIndicator } from './hooks'

type HeaderProps = {
  pathname: string
}

const navigation = [
  { label: 'Writing', to: '/' },
  { label: 'Algorithm', to: '/coding-tests/' },
  { label: 'Statistics', to: '/statistics/' },
  { label: 'Calendar', to: '/calendar/' },
]

export const Header = ({ pathname }: HeaderProps) => {
  const { theme, toggleDarkMode } = useTheme()
  const { isPost, progressWidth } = useScrollIndicator(pathname)
  const isActive = (to: string) => to === '/'
    ? pathname === '/' || pathname.startsWith('/posts/')
    : pathname.startsWith(to)

  const themeButton = (
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
  )

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
          {navigation.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={clsx(styles.iconLink, { [styles.activeLink]: isActive(to) })}
              aria-current={isActive(to) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
          <a href="/rss.xml">RSS</a>
          {themeButton}
        </nav>

        <div className={styles.mobileControls}>
          {themeButton}
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className={styles.menuButton} aria-label="Open navigation menu">
                <Menu size={19} strokeWidth={1.8} aria-hidden="true" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className={styles.drawerOverlay} />
              <Dialog.Content className={styles.drawerContent}>
                <div className={styles.drawerHeader}>
                  <div className={styles.drawerBrand}>
                    <span className={styles.mark}>W</span>
                    <span>Woojin Devlog</span>
                  </div>
                  <Dialog.Close asChild>
                    <button className={styles.drawerClose} aria-label="Close navigation menu">
                      <X size={19} strokeWidth={1.8} aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className={styles.drawerIntro}>
                  <p>Explore</p>
                  <Dialog.Title>Navigation</Dialog.Title>
                  <Dialog.Description>블로그의 주요 페이지로 이동합니다.</Dialog.Description>
                </div>

                <nav className={styles.drawerNavigation} aria-label="Mobile navigation">
                  {navigation.map(({ label, to }, index) => (
                    <Dialog.Close asChild key={to}>
                      <Link
                        to={to}
                        className={clsx({ [styles.activeDrawerLink]: isActive(to) })}
                        aria-current={isActive(to) ? 'page' : undefined}
                      >
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <strong>{label}</strong>
                        <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
                      </Link>
                    </Dialog.Close>
                  ))}
                </nav>

                <div className={styles.drawerFooter}>
                  <Dialog.Close asChild>
                    <a href="/rss.xml">
                      RSS feed
                      <ArrowUpRight size={14} strokeWidth={1.6} aria-hidden="true" />
                    </a>
                  </Dialog.Close>
                  <span>© 2026 WOOJIN CHOI</span>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
      {match(isPost)
        .with(true, () => (
          <div style={reactCss({ '--progress-width': `${progressWidth}%` })} className={styles.progressBar} />
        ))
        .otherwise(() => null)}
    </header>
  )
}
