import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';
import { User } from 'lucide-react';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    src: {
      control: { type: 'text' },
    },
    name: {
      control: { type: 'text' },
    },
    alt: {
      control: { type: 'text' },
    },
    showFallback: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'John Doe',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    alt: 'Profile picture',
    name: 'John Doe',
  },
};

export const WithInitials: Story = {
  args: {
    name: 'Sarah Johnson',
    showFallback: true,
  },
};

export const WithCustomFallback: Story = {
  args: {
    name: 'Admin User',
    fallback: <User className="h-1/2 w-1/2" />,
    showFallback: true,
  },
};

export const BrokenImage: Story = {
  args: {
    src: 'https://broken-image-url.jpg',
    name: 'Broken Image',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="xs" name="XS" />
      <Avatar size="sm" name="SM" />
      <Avatar size="md" name="MD" />
      <Avatar size="lg" name="LG" />
      <Avatar size="xl" name="XL" />
      <Avatar size="2xl" name="2XL" />
    </div>
  ),
};

export const WithImages: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar 
        size="sm" 
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" 
        name="John Doe" 
      />
      <Avatar 
        size="md" 
        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" 
        name="Jane Smith" 
      />
      <Avatar 
        size="lg" 
        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
        name="Mike Johnson" 
      />
    </div>
  ),
};

export const WithInitialsOnly: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar name="John Doe" showFallback />
      <Avatar name="Sarah Johnson" showFallback />
      <Avatar name="Mike Wilson" showFallback />
      <Avatar name="A" showFallback />
    </div>
  ),
};