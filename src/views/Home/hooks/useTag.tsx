import { useCallback, useMemo, useState } from 'react'

import { TAGS } from '../constants'

export const useTag = (totalCount: number, group: Queries.HomeQuery['allMarkdownRemark']['group']) => {
  const tags = useMemo(
    () => [{ fieldValue: TAGS.ALL, totalCount }, ...group].sort((a, b) => b.totalCount - a.totalCount),
    [group, totalCount]
  )
  const [selectedTag, setSelectedTag] = useState<string>(TAGS.ALL)
  const clickTag = useCallback((tag: string) => setSelectedTag(tag), [])

  return { tags, selectedTag, clickTag }
}
