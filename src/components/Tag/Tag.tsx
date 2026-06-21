import clsx from 'clsx'

import * as styles from './Tag.module.scss'

type TagProps = {
  name: string
  className?: string
}

export const Tag = ({ name, className }: TagProps) => (
  <li className={clsx(styles.tag, className)}>
    <span>{name}</span>
  </li>
)
