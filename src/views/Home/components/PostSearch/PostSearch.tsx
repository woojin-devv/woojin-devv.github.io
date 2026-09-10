import { Search, X } from 'lucide-react'
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
      <Search className={styles.searchIcon} size={15} strokeWidth={1.8} aria-hidden="true" />
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
          <X size={15} strokeWidth={1.8} aria-hidden="true" />
        </button>
      )}
    </div>
  </div>
)
