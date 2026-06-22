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
  searchQuery: string,
  pathname: string,
  search: string
) => {
  const posts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase()

    return allPosts.filter(({ frontmatter: { tags, title, description }, rawMarkdownBody }) => {
      const matchesTag = selectedTag === TAGS.ALL || tags.includes(selectedTag)
      const searchableText = `${title} ${description} ${rawMarkdownBody}`.toLocaleLowerCase()
      const matchesQuery = normalizedQuery.length === 0 || searchableText.includes(normalizedQuery)

      return matchesTag && matchesQuery
    })
  }, [allPosts, searchQuery, selectedTag])
  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE))
  const [currentPage, setCurrentPage] = useState(() => Math.min(getPageFromSearch(search), totalPages))
  const previousFilter = useRef({ selectedTag, searchQuery })

  useEffect(() => {
    if (previousFilter.current.selectedTag !== selectedTag || previousFilter.current.searchQuery !== searchQuery) {
      previousFilter.current = { selectedTag, searchQuery }
      setCurrentPage(1)
    }
  }, [searchQuery, selectedTag])

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('q', searchQuery.trim())
    if (currentPage > 1) params.set('page', String(currentPage))
    const queryString = params.toString()
    window.history.replaceState({}, '', queryString ? `${pathname}?${queryString}` : pathname)
  }, [currentPage, pathname, searchQuery])

  const visiblePosts = posts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

  const changePage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages)
    setCurrentPage(nextPage)

    requestAnimationFrame(() => {
      document.querySelector('[data-post-list]')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return { visiblePosts, resultCount: posts.length, currentPage, totalPages, changePage }
}
