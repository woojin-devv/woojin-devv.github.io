import type { Meta, StoryObj } from '@storybook/react-vite'

import { TableOfContents } from './TableOfContents'

const html = `
  <ul>
    <li><a href="#overview">구현 개요</a></li>
    <li>
      <a href="#details">상세 구성</a>
      <ul>
        <li><a href="#code-example">코드 예시</a></li>
        <li><a href="#table-example">표 스타일</a></li>
      </ul>
    </li>
    <li><a href="#summary">마무리</a></li>
  </ul>
`

const meta = {
  title: 'Post/TableOfContents',
  component: TableOfContents,
  decorators: [
    (Story) => (
      <div style={{ minHeight: 480, padding: 40 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TableOfContents>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { html },
}
