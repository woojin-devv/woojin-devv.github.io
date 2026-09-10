import { type ReactNode } from 'react'

import * as styles from './IconWrapper.module.scss'

type IconWrapperProps = {
  href: string
  label: string
  children: ReactNode
}

export const IconWrapper = ({ href, label, children }: IconWrapperProps) => (
  <a href={href} target="_blank" className={styles.profileIcon} rel="noreferrer" aria-label={label}>
    {children}
  </a>
)
