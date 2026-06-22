import * as styles from './Pagination.module.scss'

type PaginationProps = {
  currentPage: number
  totalPages: number
  changePage: (page: number) => void
}

export const Pagination = ({ currentPage, totalPages, changePage }: PaginationProps) => {
  if (totalPages <= 1) return null

  return (
    <nav className={styles.pagination} aria-label="Post pagination">
      <button type="button" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1}>
        Prev
      </button>
      <ol>
        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1

          return (
            <li key={page}>
              <button
                type="button"
                className={currentPage === page ? styles.active : undefined}
                onClick={() => changePage(page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {String(page).padStart(2, '0')}
              </button>
            </li>
          )
        })}
      </ol>
      <button type="button" onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </nav>
  )
}
