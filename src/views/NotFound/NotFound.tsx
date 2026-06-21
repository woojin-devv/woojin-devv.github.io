import { Link } from 'gatsby'

import * as styles from './NotFound.module.scss'

const NotFoundPage = () => {
  return (
    <main className={styles.page}>
      <p className={styles.index}>404 / LOST</p>
      <h1 className={styles.heading}>This page<br />doesn't exist.</h1>
      <p className={styles.paragraph}>
        We couldn't find what you were looking for.
        <br />
        {process.env.NODE_ENV === 'development' ? (
          <>
            <br />
            Try creating a page in <code className={styles.code}>src/pages/</code>.
            <br />
          </>
        ) : null}
        <br />
        <Link to="/">Return home ↗</Link>
      </p>
    </main>
  )
}

export default NotFoundPage

export const Head = () => <title>Not found</title>
