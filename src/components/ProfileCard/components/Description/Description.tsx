import clsx from 'clsx'

import * as styles from './Description.module.scss'

type DescriptionProps = {
  className?: string
}

export const Description = ({ className }: DescriptionProps) => (
  <p className={clsx(styles.description, className)}>
    구조적으로 사고하고, 근거 있게 구현하기 위해 기록합니다.
  </p>
)
