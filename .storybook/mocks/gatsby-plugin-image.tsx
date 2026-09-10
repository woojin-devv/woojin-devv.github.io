import type { CSSProperties, ImgHTMLAttributes } from 'react'

type StaticImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string
  objectFit?: CSSProperties['objectFit']
}

export const StaticImage = ({ src, objectFit, ...props }: StaticImageProps) => (
  <img
    src={src.includes('profile') ? '/assets/img/bio_avatar.png' : src}
    style={{ objectFit }}
    {...props}
  />
)

type GatsbyImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  image: { images?: { fallback?: { src?: string } } }
  objectFit?: CSSProperties['objectFit']
}

export const GatsbyImage = ({ image, objectFit, ...props }: GatsbyImageProps) => (
  <img src={image.images?.fallback?.src ?? ''} style={{ objectFit }} {...props} />
)

export const getSrc = (image: GatsbyImageProps['image']) => image.images?.fallback?.src
