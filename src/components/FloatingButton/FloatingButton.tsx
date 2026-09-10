import clsx from 'clsx'
import { ArrowUp } from 'lucide-react'

import * as styles from './FloatingButton.module.scss'
import { useFloatingButton } from './hooks'

export const FloatingButton = () => {
  const { isVisible, scrollToTop } = useFloatingButton()

  return (
    <button
      className={clsx(styles.floatingButton, { [styles.visible]: isVisible })}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowUp size={18} strokeWidth={1.8} aria-hidden="true" />
    </button>
  )
}
