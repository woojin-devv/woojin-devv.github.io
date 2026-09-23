import clsx from 'clsx'

import * as styles from './Date.module.scss'

type DateProps = {
  date: string
  className?: string
}

export const Date = ({ date, className }: DateProps) => <time className={clsx(styles.date, className)}>{date}</time>
