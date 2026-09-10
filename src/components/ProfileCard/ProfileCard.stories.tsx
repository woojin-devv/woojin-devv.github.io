import type { Meta, StoryObj } from '@storybook/react-vite'

import { ProfileCard } from './ProfileCard'

const meta = {
  title: 'Post/ProfileCard',
  component: ProfileCard,
  decorators: [
    (Story) => (
      <div style={{ padding: 40 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProfileCard>

export default meta
type Story = StoryObj<typeof meta>

export const PostAuthor: Story = {
  args: { pathname: '/posts/storybook-preview/' },
}

export const DefaultCard: Story = {
  args: { pathname: '/' },
}
