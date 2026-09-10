import clsx from 'clsx'
import { useCallback, useState } from 'react'

import * as styles from './Hero.module.scss'

export type HeroLoadingState = 'auto' | 'loading' | 'loaded'

type HeroProps = {
  loadingState?: HeroLoadingState
}

export const Hero = ({ loadingState = 'auto' }: HeroProps) => {
  const [isImageReady, setIsImageReady] = useState(false)
  const isReady = loadingState === 'loaded' || (loadingState === 'auto' && isImageReady)
  const handleImageRef = useCallback((image: HTMLImageElement | null) => {
    if (image?.complete) setIsImageReady(true)
  }, [])

  return (
    <section className={styles.hero} aria-label="Woojin Devlog hero">
      <div className={styles.imageFrame} aria-busy={!isReady}>
        <div className={clsx(styles.imagePlaceholder, { [styles.hidden]: isReady })} aria-hidden="true" />
        <img
          ref={handleImageRef}
          src="/assets/woojin-dachshund.png"
          alt="초록 잎 장식과 데님 멜빵바지를 입은 갈색 닥스훈트"
          className={clsx(styles.image, { [styles.loaded]: isReady })}
          width={1080}
          height={1080}
          loading="eager"
          decoding="async"
          onLoad={() => setIsImageReady(true)}
          onError={() => setIsImageReady(true)}
        />
      </div>
    </section>
  )
}
