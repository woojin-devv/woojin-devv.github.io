import clsx from 'clsx'
import { ChevronDown, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { getRefinedStringValue } from '@/utils'

import { TagButtonWithCount } from '../TagButtonWithCount'
import * as styles from './TagList.module.scss'

type TagListProps = {
  tags: { fieldValue: string | null; totalCount: number }[]
  selectedTag: string
  clickTag: (tag: string) => void
  className?: string
}

const DEFAULT_VISIBLE_TAG_COUNT = 7

export const TagList = ({ tags, selectedTag, clickTag, className }: TagListProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const moreButtonRef = useRef<HTMLButtonElement>(null)
  const normalizedTags = useMemo(
    () => tags.map(({ fieldValue, totalCount }) => ({ value: getRefinedStringValue(fieldValue), totalCount })),
    [tags]
  )
  const visibleTags = useMemo(() => {
    const defaults = normalizedTags.slice(0, DEFAULT_VISIBLE_TAG_COUNT)
    const selected = normalizedTags.find(({ value }) => value === selectedTag)

    if (!selected || defaults.some(({ value }) => value === selectedTag)) return defaults
    return [...defaults.slice(0, -1), selected]
  }, [normalizedTags, selectedTag])
  const selectableTags = normalizedTags.slice(1)

  useEffect(() => {
    if (!isOpen) return

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !pickerRef.current?.contains(event.target)) setIsOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsOpen(false)
      moreButtonRef.current?.focus()
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  const selectTag = (tag: string, returnFocus = false) => {
    clickTag(tag)
    setIsOpen(false)
    if (returnFocus) requestAnimationFrame(() => moreButtonRef.current?.focus())
  }

  const renderTag = ({ value, totalCount }: (typeof normalizedTags)[number], fromPanel = false) => (
    <li
      key={value}
      className={clsx(styles.tagItem, { [styles.selectedTagItem]: selectedTag === value })}
    >
      <TagButtonWithCount
        name={value}
        count={totalCount}
        isSelected={selectedTag === value}
        onClick={() => selectTag(value, fromPanel)}
      />
    </li>
  )

  return (
    <div className={clsx(styles.tagPicker, className)} ref={pickerRef}>
      <div className={styles.tagBar}>
        <ul className={clsx(styles.tagList, styles.visibleTagList)}>{visibleTags.map((tag) => renderTag(tag))}</ul>
        <button
          ref={moreButtonRef}
          type="button"
          className={styles.moreButton}
          aria-expanded={isOpen}
          aria-controls="all-tag-filters"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span>More ({selectableTags.length})</span>
          <ChevronDown className={styles.chevron} size={14} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div id="all-tag-filters" className={styles.tagPanel} aria-label="All writing tags">
          <div className={styles.panelHeader}>
            <div>
              <strong>All tags</strong>
              <span>{selectableTags.length} filters</span>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close tag filters">
              <X size={15} strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>
          <ul className={styles.panelTagList}>
            {selectableTags.map((tag) => renderTag(tag, true))}
          </ul>
        </div>
      )}
    </div>
  )
}
