import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';
import { Badge } from '../badge';
import { useState } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Car, 
  Users, 
  BarChart3, 
  MapPin, 
  Calendar,
  CreditCard,
  Shield
} from 'lucide-react';

const meta: Meta<typeof Tabs> = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'pills', 'underline', 'cards'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
    fullWidth: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems = [
  {
    id: 'tab1',
    label: 'Tab 1',
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Tab 1 Content</h3>
        <p>This is the content for the first tab.</p>
      </div>
    ),
  },
  {
    id: 'tab2',
    label: 'Tab 2',
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Tab 2 Content</h3>
        <p>This is the content for the second tab.</p>
      </div>
    ),
  },
  {
    id: 'tab3',
    label: 'Tab 3',
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Tab 3 Content</h3>
        <p>This is the content for the third tab.</p>
      </div>
    ),
  },
];

const tabsWithIcons = [
  {
    id: 'profile',
    label: 'Profile',
    icon: <User className="h-4 w-4" />,
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Profile Settings</h3>
        <p>Manage your profile information and preferences.</p>
      </div>
    ),
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <Bell className="h-4 w-4" />,
    badge: <Badge variant="destructive" size="sm">3</Badge>,
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Notification Settings</h3>
        <p>Configure how you receive notifications.</p>
      </div>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="h-4 w-4" />,
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">General Settings</h3>
        <p>Adjust your application settings.</p>
      </div>
    ),
  },
  {
    id: 'disabled',
    label: 'Disabled',
    icon: <Shield className="h-4 w-4" />,
    disabled: true,
    content: (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">Disabled Tab</h3>
        <p>This tab is disabled.</p>
      </div>
    ),
  },
];

const taxiParkTabs = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <BarChart3 className="h-4 w-4" />,
    content: (
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Dashboard Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900">Active Vehicles</h4>
            <p className="text-2xl font-bold text-blue-600">24</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900">Available Drivers</h4>
            <p className="text-2xl font-bold text-green-600">18</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'fleet',
    label: 'Fleet',
    icon: <Car className="h-4 w-4" />,
    badge: <Badge variant="success" size="sm">24</Badge>,
    content: (
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Fleet Management</h3>
        <p className="mb-4">Manage your vehicle fleet, maintenance schedules, and assignments.</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>Toyota Camry - ABC123</span>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>Honda Civic - XYZ789</span>
            <Badge variant="warning">Maintenance</Badge>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'drivers',
    label: 'Drivers',
    icon: <Users className="h-4 w-4" />,
    content: (
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Driver Management</h3>
        <p className="mb-4">View and manage driver information, schedules, and performance.</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>John Doe</span>
            <Badge variant="success">Online</Badge>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>Jane Smith</span>
            <Badge variant="secondary">Offline</Badge>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'bookings',
    label: 'Bookings',
    icon: <Calendar className="h-4 w-4" />,
    badge: <Badge variant="warning" size="sm">5</Badge>,
    content: (
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Booking Management</h3>
        <p className="mb-4">Track current bookings and manage ride requests.</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>Booking #12345 - Downtown to Airport</span>
            <Badge variant="warning">In Progress</Badge>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <span>Booking #12346 - Mall to Hotel</span>
            <Badge variant="success">Completed</Badge>
          </div>
        </div>
      </div>
    ),
  },
];

export const Default: Story = {
  args: {
    items: basicItems,
  },
};

export const Pills: Story = {
  args: {
    items: basicItems,
    variant: 'pills',
  },
};

export const Underline: Story = {
  args: {
    items: basicItems,
    variant: 'underline',
  },
};

export const Cards: Story = {
  args: {
    items: basicItems,
    variant: 'cards',
  },
};

export const WithIcons: Story = {
  args: {
    items: tabsWithIcons,
  },
};

export const WithIconsPills: Story = {
  args: {
    items: tabsWithIcons,
    variant: 'pills',
  },
};

export const Small: Story = {
  args: {
    items: basicItems,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    items: basicItems,
    size: 'lg',
  },
};

export const FullWidth: Story = {
  args: {
    items: basicItems,
    fullWidth: true,
  },
};

export const Vertical: Story = {
  args: {
    items: tabsWithIcons,
    orientation: 'vertical',
    variant: 'pills',
  },
};

export const TaxiParkDashboard: Story = {
  args: {
    items: taxiParkTabs,
    variant: 'default',
    defaultActiveTab: 'overview',
  },
};

const ControlledTabsDemo = () => {
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('tab1')}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded"
        >
          Go to Tab 1
        </button>
        <button
          onClick={() => setActiveTab('tab2')}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded"
        >
          Go to Tab 2
        </button>
        <button
          onClick={() => setActiveTab('tab3')}
          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded"
        >
          Go to Tab 3
        </button>
      </div>
      
      <Tabs
        items={basicItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="pills"
      />
      
      <p className="text-sm text-gray-600">
        Current active tab: <strong>{activeTab}</strong>
      </p>
    </div>
  );
};

export const ControlledTabs: Story = {
  render: () => <ControlledTabsDemo />,
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 w-full max-w-4xl">
      <div>
        <h3 className="text-lg font-semibold mb-3">Default</h3>
        <Tabs items={basicItems} variant="default" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Pills</h3>
        <Tabs items={basicItems} variant="pills" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Underline</h3>
        <Tabs items={basicItems} variant="underline" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Cards</h3>
        <Tabs items={basicItems} variant="cards" />
      </div>
    </div>
  ),
};