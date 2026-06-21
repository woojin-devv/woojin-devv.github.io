import { StaticImage } from 'gatsby-plugin-image'
import { match } from 'ts-pattern'

import { Description, Heading, IconList } from './components'
import * as styles from './ProfileCard.module.scss'

type ProfileCardProps = {
  pathname: string
}

export const ProfileCard = ({ pathname }: ProfileCardProps) => {
  const isPost = pathname.includes('/posts/')

  return match(isPost)
    .with(true, () => (
      <div className={styles.wrapper}>
        <StaticImage
          src="../../images/profile.png"
          alt="최우진 프로필"
          objectFit="fill"
          className={styles.postProfileImage}
          width={100}
          height={100}
        ></StaticImage>
        <div>
          <Heading text="Woojin" />
          <Description className={styles.postDescription} />
          <div className={styles.iconWrapper}>
            <IconList />
          </div>
        </div>
      </div>
    ))
    .with(false, () => (
      <div className={styles.card}>
        <Heading text="Woojin Devlog" />
        <Description />
        <div className={styles.info}>
          <StaticImage
            src="../../images/profile.png"
            alt="최우진 프로필"
            className={styles.profileImage}
            width={100}
            height={100}
          ></StaticImage>
          <IconList />
        </div>
      </div>
    ))
    .exhaustive()
}
