import { Link } from 'gatsby'
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import { match } from 'ts-pattern'

import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Theme, useTheme } from '@/contexts'
import { cn } from '@/lib/utils'
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
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={styles.iconButton}
      onClick={toggleDarkMode}
      aria-label={theme === Theme.DARK ? 'Use light theme' : 'Use dark theme'}
    >
      {theme === Theme.DARK ? (
        <Sun size={16} strokeWidth={1.8} aria-hidden="true" />
      ) : (
        <Moon size={16} strokeWidth={1.8} aria-hidden="true" />
      )}
    </Button>
  )

  return (
    <header className={cn(styles.header, { [styles.fixed]: isPost })}>
      <div className={styles.wrapper}>
        <Link to="/" className={styles.headingLink}>
          <h1 className={styles.headingWrapper}>
            <span className={styles.mark}>W</span>
            <span className={styles.heading}>Woojin Devlog</span>
          </h1>
        </Link>
        <NavigationMenu className={styles.headerButtons} aria-label="Main navigation">
          <NavigationMenuList className={styles.navigationList}>
            {navigation.map(({ label, to }) => (
              <NavigationMenuItem key={to}>
                <NavigationMenuLink asChild active={isActive(to)}>
                  <Link
                    to={to}
                    className={cn(styles.iconLink, { [styles.activeLink]: isActive(to) })}
                    aria-current={isActive(to) ? 'page' : undefined}
                  >
                    {label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <a href="/rss.xml">RSS</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>{themeButton}</NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className={styles.mobileControls}>
          {themeButton}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={styles.menuButton}
                aria-label="Open navigation menu"
              >
                <Menu size={19} strokeWidth={1.8} aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className={styles.drawerContent}
              overlayClassName={styles.drawerOverlay}
              showCloseButton={false}
            >
              <SheetHeader className={styles.drawerHeader}>
                <div className={styles.drawerBrand}>
                  <span className={styles.mark}>W</span>
                  <span>Woojin Devlog</span>
                </div>
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={styles.drawerClose}
                    aria-label="Close navigation menu"
                  >
                    <X size={19} strokeWidth={1.8} aria-hidden="true" />
                  </Button>
                </SheetClose>
              </SheetHeader>

              <div className={styles.drawerIntro}>
                <p>Explore</p>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>블로그의 주요 페이지로 이동합니다.</SheetDescription>
              </div>

              <nav className={styles.drawerNavigation} aria-label="Mobile navigation">
                {navigation.map(({ label, to }, index) => (
                  <SheetClose asChild key={to}>
                    <Link
                      to={to}
                      className={cn({ [styles.activeDrawerLink]: isActive(to) })}
                      aria-current={isActive(to) ? 'page' : undefined}
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{label}</strong>
                      <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <SheetFooter className={styles.drawerFooter}>
                <SheetClose asChild>
                  <a href="/rss.xml">
                    RSS feed
                    <ArrowUpRight size={14} strokeWidth={1.6} aria-hidden="true" />
                  </a>
                </SheetClose>
                <span>© 2026 WOOJIN CHOI</span>
              </SheetFooter>
            </SheetContent>
          </Sheet>
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
