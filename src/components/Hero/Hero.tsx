import * as styles from './Hero.module.scss'

export const Hero = () => (
  <section className={styles.hero} aria-label="Woojin Devlog hero">
    <div className={styles.imageFrame}>
      <img src="/assets/woojin-dachshund.png" alt="초록 잎 장식과 데님 멜빵바지를 입은 갈색 닥스훈트" />
    </div>
  </section>
)
