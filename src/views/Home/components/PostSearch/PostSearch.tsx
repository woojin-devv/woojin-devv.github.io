import type { ChangeEvent } from 'react'

import * as styles from './PostSearch.module.scss'

type PostSearchProps = {
  value: string
  onChange: (value: string) => void
}

export const PostSearch = ({ value, onChange }: PostSearchProps) => (
  <div className={styles.search} role="search">
    <label htmlFor="post-search">Search writing</label>
    <div className={styles.inputWrapper}>
      <span className={styles.searchIcon} aria-hidden="true">
        ⌕
      </span>
      <input
        id="post-search"
        type="search"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        placeholder="Search by title, tag, or content"
        autoComplete="off"
      />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="Clear search">
          Clear
        </button>
      )}
    </div>
  </div>
)
