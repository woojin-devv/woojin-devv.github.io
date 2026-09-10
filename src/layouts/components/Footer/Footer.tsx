import { ExternalLink } from 'lucide-react'

import * as styles from './Footer.module.scss'

export const Footer = () => (
  <footer className={styles.footer}>
    <span className={styles.footerMark}>W/DEV</span>
    <span className={styles.copyRight}>© {new Date().getFullYear()} WOOJIN CHOI</span>
    <a href="mailto:dnwls0723@sookmyung.ac.kr">
      GET IN TOUCH
      <ExternalLink size={13} strokeWidth={1.8} aria-hidden="true" />
    </a>
  </footer>
)
