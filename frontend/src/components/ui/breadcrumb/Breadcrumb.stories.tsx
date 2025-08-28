import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb, SimpleBreadcrumb } from './Breadcrumb';
import { Button } from '../button';
import { Home, Folder, File, Users, Settings, Car, MapPin } from 'lucide-react';

const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showHomeIcon: {
      control: { type: 'boolean' },
    },
    maxItems: {
      control: { type: 'number' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Settings', current: true },
];

const longItems = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Fleet Management', href: '/dashboard/fleet' },
  { label: 'Vehicles', href: '/dashboard/fleet/vehicles' },
  { label: 'Vehicle Details', href: '/dashboard/fleet/vehicles/123' },
  { label: 'Maintenance', current: true },
];

const itemsWithIcons = [
  { label: 'Home', href: '/', icon: <Home className="h-4 w-4" /> },
  { label: 'Users', href: '/users', icon: <Users className="h-4 w-4" /> },
  { label: 'Settings', icon: <Settings className="h-4 w-4" />, current: true },
];

export const Default: Story = {
  args: {
    items: basicItems,
  },
};

export const WithHomeIcon: Story = {
  args: {
    items: basicItems,
    showHomeIcon: true,
  },
};

export const WithCustomIcons: Story = {
  args: {
    items: itemsWithIcons,
  },
};

export const LongPath: Story = {
  args: {
    items: longItems,
  },
};

export const TruncatedPath: Story = {
  args: {
    items: longItems,
    maxItems: 4,
  },
};

export const MinimalTruncation: Story = {
  args: {
    items: longItems,
    maxItems: 2,
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ label: 'Current Page', current: true }],
  },
};

export const NoLinks: Story = {
  args: {
    items: [
      { label: 'Step 1' },
      { label: 'Step 2' },
      { label: 'Step 3', current: true },
    ],
  },
};

export const TaxiParkExample: Story = {
  args: {
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <Home className="h-4 w-4" /> },
      { label: 'Fleet', href: '/dashboard/fleet', icon: <Car className="h-4 w-4" /> },
      { label: 'Vehicles', href: '/dashboard/fleet/vehicles' },
      { label: 'Toyota Camry - ABC123', current: true },
    ],
  },
};

export const DriverManagementExample: Story = {
  args: {
    items: [
      { label: 'Home', href: '/', icon: <Home className="h-4 w-4" /> },
      { label: 'Drivers', href: '/drivers', icon: <Users className="h-4 w-4" /> },
      { label: 'Active Drivers', href: '/drivers/active' },
      { label: 'John Doe', href: '/drivers/active/john-doe' },
      { label: 'Trip History', current: true },
    ],
  },
};

export const BookingDetailsExample: Story = {
  args: {
    items: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Bookings', href: '/bookings' },
      { label: 'Today', href: '/bookings/today' },
      { label: 'Booking #12345', href: '/bookings/12345' },
      { label: 'Route Details', current: true, icon: <MapPin className="h-4 w-4" /> },
    ],
    maxItems: 4,
  },
};

const SimpleBreadcrumbDemo = () => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Simple paths:</h3>
        <SimpleBreadcrumb paths={['Home', 'Dashboard', 'Settings']} />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">File system style:</h3>
        <SimpleBreadcrumb 
          paths={['Documents', 'Projects', 'taxi-park', 'src', 'components']} 
          baseHref="/files/"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Single item:</h3>
        <SimpleBreadcrumb paths={['Current Page']} />
      </div>
    </div>
  );
};

export const SimpleBreadcrumbExample: Story = {
  render: () => <SimpleBreadcrumbDemo />,
};

export const CustomStyling: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'Electronics', href: '/products/electronics' },
      { label: 'Smartphones', current: true },
    ],
    className: 'bg-gray-50 p-3 rounded-lg',
    linkClassName: 'text-blue-600 hover:text-blue-800',
    currentClassName: 'text-gray-900 font-semibold',
    separatorClassName: 'text-gray-300',
  },
};

export const AllExamples: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-4xl">
      <div>
        <h3 className="text-lg font-semibold mb-3">Basic Breadcrumb</h3>
        <Breadcrumb items={basicItems} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">With Icons</h3>
        <Breadcrumb items={itemsWithIcons} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Long Path (Truncated)</h3>
        <Breadcrumb items={longItems} maxItems={4} />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Taxi Park Example</h3>
        <Breadcrumb 
          items={[
            { label: 'Dashboard', href: '/dashboard', icon: <Home className="h-4 w-4" /> },
            { label: 'Fleet Management', href: '/fleet' },
            { label: 'Vehicle ABC-123', current: true, icon: <Car className="h-4 w-4" /> },
          ]}
        />
      </div>
    </div>
  ),
};