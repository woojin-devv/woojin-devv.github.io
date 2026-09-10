import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Pagination } from './Pagination'

const PaginationDemo = ({ initialPage = 1 }: { initialPage?: number }) => {
  const [currentPage, setCurrentPage] = useState(initialPage)
  return <Pagination currentPage={currentPage} totalPages={7} changePage={setCurrentPage} />
}

const meta = {
  title: 'Home/Pagination',
  component: Pagination,
  decorators: [
    (Story) => (
      <div style={{ padding: 40 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const FirstPage: Story = {
  args: { currentPage: 1, totalPages: 7, changePage: () => undefined },
  render: () => <PaginationDemo />,
}

export const MiddlePage: Story = {
  args: { currentPage: 4, totalPages: 7, changePage: () => undefined },
  render: () => <PaginationDemo initialPage={4} />,
}
