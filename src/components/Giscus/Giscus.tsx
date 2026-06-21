import { useEffect, useRef } from 'react'

import { Theme, useTheme } from '@/contexts'

export const Giscus = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (containerRef.current === null) return

    const repoId = process.env.GATSBY_GISCUS_REPO_ID
    const categoryId = process.env.GATSBY_GISCUS_CATEGORY_ID
    if (!repoId || !categoryId) return

    const $div = containerRef.current

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'woojin-devv/woojin-devv.github.io')
    script.setAttribute('data-repo-id', repoId)
    script.setAttribute('data-category', 'Comments')
    script.setAttribute('data-category-id', categoryId)
    script.setAttribute('data-mapping', 'og:title')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute(
      'data-theme',
      theme === Theme.LIGHT
        ? 'light'
        : 'https://cdn.jsdelivr.net/gh/woojin-devv/woojin-devv.github.io@master/src/components/Giscus/custom-giscus-theme.css'
    )
    script.setAttribute('data-lang', 'ko')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true
    $div.appendChild(script)

    return () => {
      if ($div === null) return
      $div.removeChild(script)
    }
  }, [theme])

  return <div id="comment" ref={containerRef} />
}
