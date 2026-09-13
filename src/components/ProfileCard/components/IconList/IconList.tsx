import { Aperture, GitFork, Mail } from 'lucide-react'

import { IconWrapper } from '../IconWrapper'

export const IconList = () => (
  <>
    <IconWrapper href="mailto:dnwls0723@sookmyung.ac.kr" label="Send email">
      <Mail size={15} strokeWidth={1.8} aria-hidden="true" />
    </IconWrapper>
    <IconWrapper href="https://github.com/woojin-devv" label="Visit GitHub profile">
      <GitFork size={15} strokeWidth={1.8} aria-hidden="true" />
    </IconWrapper>
    <IconWrapper href="https://vsco.co/woojin-choi/gallery" label="Visit VSCO gallery">
      <Aperture size={15} strokeWidth={1.8} aria-hidden="true" />
    </IconWrapper>
  </>
)
