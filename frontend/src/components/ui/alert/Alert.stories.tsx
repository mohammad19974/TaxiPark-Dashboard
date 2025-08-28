import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';
import { Button } from '../button';
import { Heart, Star, Zap } from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'error', 'info'],
    },
    title: {
      control: { type: 'text' },
    },
    description: {
      control: { type: 'text' },
    },
    dismissible: {
      control: { type: 'boolean' },
    },
    showIcon: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Default Alert',
    description: 'This is a default alert message.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success!',
    description: 'Your changes have been saved successfully.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    description: 'Please review your input before proceeding.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Error',
    description: 'Something went wrong. Please try again.',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    description: 'Here is some important information for you.',
  },
};

export const Dismissible: Story = {
  args: {
    variant: 'info',
    title: 'Dismissible Alert',
    description: 'You can close this alert by clicking the X button.',
    dismissible: true,
  },
};

export const WithoutIcon: Story = {
  args: {
    variant: 'success',
    title: 'No Icon Alert',
    description: 'This alert does not show an icon.',
    showIcon: false,
  },
};

export const WithCustomIcon: Story = {
  args: {
    variant: 'info',
    title: 'Custom Icon',
    description: 'This alert uses a custom icon.',
    icon: <Star className="h-5 w-5 text-yellow-500" />,
  },
};

export const TitleOnly: Story = {
  args: {
    variant: 'warning',
    title: 'Title Only Alert',
  },
};

export const DescriptionOnly: Story = {
  args: {
    variant: 'error',
    description: 'This alert only has a description without a title.',
  },
};

export const WithChildren: Story = {
  args: {
    variant: 'info',
    title: 'Alert with Custom Content',
    children: (
      <div className="mt-2">
        <p className="mb-2">This alert contains custom content:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Custom bullet points</li>
          <li>Multiple lines of content</li>
          <li>Rich formatting options</li>
        </ul>
      </div>
    ),
  },
};

export const WithActions: Story = {
  args: {
    variant: 'warning',
    title: 'Confirm Action',
    description: 'Are you sure you want to delete this item? This action cannot be undone.',
    children: (
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="outline">
          Cancel
        </Button>
        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </div>
    ),
  },
};

const DismissibleDemo = () => {
  const [alerts, setAlerts] = useState([
    { id: 1, variant: 'success' as const, title: 'Success Alert', description: 'This can be dismissed.' },
    { id: 2, variant: 'warning' as const, title: 'Warning Alert', description: 'This can also be dismissed.' },
    { id: 3, variant: 'error' as const, title: 'Error Alert', description: 'And this one too.' },
  ]);

  const handleDismiss = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const resetAlerts = () => {
    setAlerts([
      { id: 1, variant: 'success' as const, title: 'Success Alert', description: 'This can be dismissed.' },
      { id: 2, variant: 'warning' as const, title: 'Warning Alert', description: 'This can also be dismissed.' },
      { id: 3, variant: 'error' as const, title: 'Error Alert', description: 'And this one too.' },
    ]);
  };

  return (
    <div className="space-y-4 w-96">
      {alerts.map(alert => (
        <Alert
          key={alert.id}
          variant={alert.variant}
          title={alert.title}
          description={alert.description}
          dismissible
          onDismiss={() => handleDismiss(alert.id)}
        />
      ))}
      {alerts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">All alerts dismissed!</p>
          <Button onClick={resetAlerts}>Reset Alerts</Button>
        </div>
      )}
    </div>
  );
};

export const DismissibleExample: Story = {
  render: () => <DismissibleDemo />,
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Alert variant="default" title="Default" description="Default alert message." />
      <Alert variant="success" title="Success" description="Success alert message." />
      <Alert variant="warning" title="Warning" description="Warning alert message." />
      <Alert variant="error" title="Error" description="Error alert message." />
      <Alert variant="info" title="Info" description="Info alert message." />
    </div>
  ),
};

export const CustomIcons: Story = {
  render: () => (
    <div className="space-y-4 w-96">
      <Alert 
        variant="success" 
        title="Custom Heart Icon" 
        description="Using a heart icon instead of default."
        icon={<Heart className="h-5 w-5 text-red-500" />}
      />
      <Alert 
        variant="warning" 
        title="Custom Zap Icon" 
        description="Using a lightning bolt icon."
        icon={<Zap className="h-5 w-5 text-yellow-500" />}
      />
      <Alert 
        variant="info" 
        title="Custom Star Icon" 
        description="Using a star icon for information."
        icon={<Star className="h-5 w-5 text-blue-500" />}
      />
    </div>
  ),
};