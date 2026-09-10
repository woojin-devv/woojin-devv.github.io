import type { Meta, StoryObj } from '@storybook/react-vite'

import { CalendarView } from './CalendarView'

const meta = {
  title: 'Pages/Calendar',
  component: CalendarView,
  parameters: { layout: 'fullscreen' },
  argTypes: {
    loadingState: {
      control: 'inline-radio',
      options: ['auto', 'loading', 'loaded'],
    },
  },
} satisfies Meta<typeof CalendarView>

export default meta
type Story = StoryObj<typeof meta>

export const LiveCalendar: Story = {
  args: { loadingState: 'auto' },
}

export const LoadingSkeleton: Story = {
  args: {
    calendarUrl: 'about:blank',
    loadingState: 'loading',
  },
}
