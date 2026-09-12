import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { Select, type SelectOption } from './Select'

const options: SelectOption[] = [
  { label: 'All', value: 'All' },
  { label: '1회독', value: '1' },
  { label: '2회독', value: '2' },
  { label: '3회독 이상', value: '3+' },
]

const InteractiveSelect = () => {
  const [value, setValue] = useState('1')

  return (
    <div style={{ width: 220 }}>
      <Select value={value} onValueChange={setValue} options={options} ariaLabelledBy="storybook-select-label" />
    </div>
  )
}

const meta = {
  title: 'UI/Select',
  component: Select,
  decorators: [
    (Story) => (
      <div style={{ minHeight: 280, padding: 40 }}>
        <p id="storybook-select-label" style={{ margin: '0 0 10px', fontSize: 12 }}>Review</p>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  args: {
    onValueChange: () => undefined,
    options,
    value: '1',
  },
  render: () => <InteractiveSelect />,
}
