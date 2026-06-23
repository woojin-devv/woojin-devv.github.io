import { Link } from 'gatsby'

import packageImage from '../../../assets/package_img.png'
import h1Image from '../../../assets/h1img.png'
import * as styles from './Hero.module.scss'

type HeroProps = {
  posts: Queries.HomeQuery['allMarkdownRemark']['nodes']
}

export const Hero = ({ posts }: HeroProps) => {
  const latestPosts = posts.slice(0, 3)

  return (
    <section className={styles.hero} aria-label="Woojin Devlog hero section">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>WOOJIN&apos;S ENGINEERING JOURNAL</p>

        <img src={h1Image} alt="title img"></img>

        <p className={styles.heroDescription}>
          개발 과정에서 마주한 문제, 해결 방법, 학습 기록을 차분하게 정리하는 개인 개발 블로그입니다. Spring, React,
          Python, JavaScript를 중심으로 작은 실험과 회고를 쌓아갑니다.
        </p>

        <div className={styles.heroActions}>
          <a className={styles.button} href="https://github.com/woojin-devv" target="_blank" rel="noreferrer">
            <span aria-hidden="true">⌘</span>
            GitHub ↗
          </a>
          <a className={styles.button} href="mailto:dnwls0723@sookmyung.ac.kr">
            <span aria-hidden="true">✉</span>
            Email ↗
          </a>
        </div>

        {latestPosts.length > 0 && (
          <aside className={styles.latest} aria-label="Latest writing preview">
            <p className={styles.latestLabel}>LATEST WRITING</p>
            <ul className={styles.latestList}>
              {latestPosts.map(({ frontmatter: { title, slug }, id }, index) => (
                <li key={id}>
                  <Link to={`/posts${slug}`}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{title}</strong>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>

      <div className={styles.visualWrap}>
        <div className={styles.visualGlow} aria-hidden="true" />
        <figure className={styles.packageCard}>
          <img
            src={packageImage}
            alt="Developer starter kit package with Spring, React, Python, JavaScript and computer science objects"
          />
        </figure>
        <p className={styles.caption}>Developer Starter Kit - Spring · React · Python · JavaScript</p>

        <div className={styles.statusNote} aria-hidden="true">
          <strong>Currently studying</strong>
          Spring Boot · Security · UI
        </div>
      </div>
    </section>
  )
}
