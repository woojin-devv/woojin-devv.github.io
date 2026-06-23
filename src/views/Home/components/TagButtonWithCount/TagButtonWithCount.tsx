import clsx from 'clsx'

import * as styles from './TagButtonWithCount.module.scss'

type TagButtonWithCountProps = {
  name: string
  count: number
  onClick?: () => void
  isSelected: boolean
}

export const TagButtonWithCount = ({ name, count, isSelected, onClick }: TagButtonWithCountProps) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(styles.tagButton, { [styles.active]: isSelected })}
    aria-pressed={isSelected}
  >
    <span>
      {name} ({count})
    </span>
  </button>
)
