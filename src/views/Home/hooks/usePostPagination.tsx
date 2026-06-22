import { useEffect, useMemo, useRef, useState } from 'react'

import { TAGS } from '../constants'

const POSTS_PER_PAGE = 8

const getPageFromSearch = (search: string) => {
  const page = Number(new URLSearchParams(search).get('page'))
  return Number.isInteger(page) && page > 0 ? page : 1
}

export const usePostPagination = (
  allPosts: Queries.HomeQuery['allMarkdownRemark']['nodes'],
  selectedTag: string,
  pathname: string,
  search: string
) => {
  const posts = useMemo(
    () => allPosts.filter(({ frontmatter: { tags } }) => selectedTag === TAGS.ALL || tags.includes(selectedTag)),
    [allPosts, selectedTag]
  )
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))
  const [currentPage, setCurrentPage] = useState(() => Math.min(getPageFromSearch(search), totalPages))
  const previousTag = useRef(selectedTag)

  useEffect(() => {
    if (previousTag.current !== selectedTag) {
      previousTag.current = selectedTag
      setCurrentPage(1)
    }
  }, [selectedTag])

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  useEffect(() => {
    const url = currentPage === 1 ? pathname : `${pathname}?page=${currentPage}`
    window.history.replaceState({}, '', url)
  }, [currentPage, pathname])

  const visiblePosts = posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

  const changePage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages)
    setCurrentPage(nextPage)

    requestAnimationFrame(() => {
      document.querySelector('[data-post-list]')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return { visiblePosts, currentPage, totalPages, changePage }
}
