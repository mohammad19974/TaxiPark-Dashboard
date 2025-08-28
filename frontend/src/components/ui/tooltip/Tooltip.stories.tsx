import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from '../button';
import { Info, HelpCircle, Settings, User } from 'lucide-react';

const meta: Meta<typeof Tooltip> = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right'],
    },
    delay: {
      control: { type: 'number' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    content: {
      control: { type: 'text' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    children: <Button>Hover me</Button>,
  },
};

export const Top: Story = {
  args: {
    content: 'Tooltip on top',
    position: 'top',
    children: <Button>Top tooltip</Button>,
  },
};

export const Bottom: Story = {
  args: {
    content: 'Tooltip on bottom',
    position: 'bottom',
    children: <Button>Bottom tooltip</Button>,
  },
};

export const Left: Story = {
  args: {
    content: 'Tooltip on left',
    position: 'left',
    children: <Button>Left tooltip</Button>,
  },
};

export const Right: Story = {
  args: {
    content: 'Tooltip on right',
    position: 'right',
    children: <Button>Right tooltip</Button>,
  },
};

export const WithIcon: Story = {
  args: {
    content: 'This is helpful information',
    children: (
      <button className="p-2 text-gray-500 hover:text-gray-700">
        <Info className="h-4 w-4" />
      </button>
    ),
  },
};

export const LongContent: Story = {
  args: {
    content: 'This is a very long tooltip content that might wrap to multiple lines in some cases',
    children: <Button>Long tooltip</Button>,
  },
};

export const WithDelay: Story = {
  args: {
    content: 'This tooltip has a 1 second delay',
    delay: 1000,
    children: <Button>Delayed tooltip</Button>,
  },
};

export const Disabled: Story = {
  args: {
    content: 'This tooltip is disabled',
    disabled: true,
    children: <Button>Disabled tooltip</Button>,
  },
};

export const AllPositions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-8">
      <div className="flex justify-center">
        <Tooltip content="Top tooltip" position="top">
          <Button>Top</Button>
        </Tooltip>
      </div>
      <div className="flex justify-center">
        <Tooltip content="Bottom tooltip" position="bottom">
          <Button>Bottom</Button>
        </Tooltip>
      </div>
      <div className="flex justify-center">
        <Tooltip content="Left tooltip" position="left">
          <Button>Left</Button>
        </Tooltip>
      </div>
      <div className="flex justify-center">
        <Tooltip content="Right tooltip" position="right">
          <Button>Right</Button>
        </Tooltip>
      </div>
    </div>
  ),
};

export const WithDifferentTriggers: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Tooltip content="Button tooltip">
        <Button>Button</Button>
      </Tooltip>
      
      <Tooltip content="Icon tooltip">
        <button className="p-2 text-gray-500 hover:text-gray-700 rounded">
          <Settings className="h-5 w-5" />
        </button>
      </Tooltip>
      
      <Tooltip content="Text tooltip">
        <span className="text-blue-600 underline cursor-help">
          Hover over this text
        </span>
      </Tooltip>
      
      <Tooltip content="User profile">
        <div className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer">
          <User className="h-4 w-4" />
          <span>User</span>
        </div>
      </Tooltip>
    </div>
  ),
};