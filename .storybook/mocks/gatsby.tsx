import type { AnchorHTMLAttributes, PropsWithChildren } from 'react'

type LinkProps = PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }>

export const Link = ({ to, children, ...props }: LinkProps) => (
  <a href={to} {...props}>
    {children}
  </a>
)

export const graphql = () => null
export const useStaticQuery = () => ({})
