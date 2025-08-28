import type { Meta, StoryObj } from '@storybook/react';
import { Spinner, InlineSpinner, LoadingOverlay } from './Spinner';
import { Button } from '../button';
import { useState } from 'react';

const meta: Meta<typeof Spinner> = {
  title: 'UI/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'secondary', 'white'],
    },
    label: {
      control: { type: 'text' },
    },
    showLabel: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: 'Loading data...',
    showLabel: true,
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'lg',
  },
};

export const White: Story = {
  args: {
    variant: 'white',
    size: 'lg',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="xs" />
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner variant="default" size="lg" />
      <Spinner variant="primary" size="lg" />
      <Spinner variant="secondary" size="lg" />
    </div>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Spinner size="sm" label="Loading..." showLabel />
      <Spinner size="md" label="Processing..." showLabel variant="primary" />
      <Spinner size="lg" label="Please wait..." showLabel variant="secondary" />
    </div>
  ),
};

export const InlineSpinnerExample: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="flex items-center gap-2">
        Loading data <InlineSpinner size="sm" variant="primary" />
      </p>
      <p className="flex items-center gap-2">
        Processing request <InlineSpinner size="xs" />
      </p>
      <Button disabled className="flex items-center gap-2">
        <InlineSpinner size="sm" variant="white" />
        Saving...
      </Button>
    </div>
  ),
};

const LoadingOverlayDemo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <LoadingOverlay isLoading={isLoading}>
      <div className="p-8 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Content Area</h3>
        <p className="mb-4">
          This is some content that will be overlaid with a loading spinner.
        </p>
        <Button onClick={handleToggleLoading} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Start Loading'}
        </Button>
      </div>
    </LoadingOverlay>
  );
};

export const LoadingOverlayExample: Story = {
  render: () => <LoadingOverlayDemo />,
};

export const InButtons: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button disabled className="flex items-center gap-2">
        <InlineSpinner size="sm" variant="white" />
        Loading
      </Button>
      <Button variant="outline" disabled className="flex items-center gap-2">
        <InlineSpinner size="sm" variant="primary" />
        Processing
      </Button>
      <Button variant="secondary" disabled className="flex items-center gap-2">
        <InlineSpinner size="sm" />
        Saving
      </Button>
    </div>
  ),
};