import { HeadProps, PageProps } from 'gatsby'

import { FloatingButton, Giscus, Seo } from '@/components'
import Layout from '@/layouts'
import { getRefinedStringValue } from '@/utils'

import * as styles from './GuestBook.module.scss'

const GuestBook = ({ location: { pathname } }: PageProps) => {
  return (
    <Layout pathname={pathname}>
      <main className={styles.wrapper}>
        <p className={styles.eyebrow}>Open conversation</p>
        <h1 className={styles.title}>Guestbook</h1>
        <p className={styles.description}>
          안녕하세요, 우진입니다. 제 블로그에 방문해주셔서 감사합니다. {'\n'}
          자유롭게 의견이나 인사를 남겨주세요.
        </p>
        <div className={styles.commentArea}>
          <Giscus />
        </div>
        <FloatingButton />
      </main>
    </Layout>
  )
}

export const Head = ({ location: { pathname }, data: { file } }: HeadProps<Queries.GuestBookQuery>) => {
  const seo = {
    title: 'GuestBook | Woojin Devlog',
    description: 'Woojin Devlog의 방명록 페이지입니다.',
    heroImage: getRefinedStringValue(file?.publicURL),
  }

  return <Seo title={seo.title} description={seo.description} heroImage={seo.heroImage} pathname={pathname} />
}

export default GuestBook
