import * as styles from './Footer.module.scss'

export const Footer = () => (
  <footer className={styles.footer}>
    <span className={styles.footerMark}>W/DEV</span>
    <span className={styles.copyRight}>© {new Date().getFullYear()} WOOJIN CHOI</span>
    <a href="mailto:dnwls0723@sookmyung.ac.kr">GET IN TOUCH ↗</a>
  </footer>
)
