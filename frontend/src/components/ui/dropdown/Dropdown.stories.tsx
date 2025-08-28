import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';
import { Button } from '../button';
import { Avatar } from '../avatar';
import { Badge } from '../badge';
import { useState } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  Edit, 
  Trash2, 
  Plus, 
  Download,
  Share,
  Copy,
  Car,
  Users,
  MoreVertical,
  ChevronDown
} from 'lucide-react';

const meta: Meta<typeof Dropdown> = {
  title: 'UI/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: { type: 'select' },
      options: ['bottom-left', 'bottom-right', 'top-left', 'top-right'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
    closeOnSelect: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const basicItems = [
  { id: '1', label: 'Option 1', value: 'option1' },
  { id: '2', label: 'Option 2', value: 'option2' },
  { id: '3', label: 'Option 3', value: 'option3' },
  { id: '4', label: 'Disabled Option', value: 'disabled', disabled: true },
];

const menuItems = [
  { id: 'edit', label: 'Edit', icon: <Edit className="h-4 w-4" /> },
  { id: 'copy', label: 'Copy', icon: <Copy className="h-4 w-4" /> },
  { id: 'share', label: 'Share', icon: <Share className="h-4 w-4" /> },
  { id: 'separator1', label: '', separator: true },
  { id: 'download', label: 'Download', icon: <Download className="h-4 w-4" /> },
  { id: 'separator2', label: '', separator: true },
  { id: 'delete', label: 'Delete', icon: <Trash2 className="h-4 w-4" />, danger: true },
];

const userMenuItems = [
  { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  { id: 'separator', label: '', separator: true },
  { id: 'logout', label: 'Log out', icon: <LogOut className="h-4 w-4" />, danger: true },
];

const vehicleStatusItems = [
  { id: 'active', label: 'Active', value: 'active' },
  { id: 'maintenance', label: 'Maintenance', value: 'maintenance' },
  { id: 'inactive', label: 'Inactive', value: 'inactive' },
  { id: 'retired', label: 'Retired', value: 'retired' },
];

const driverItems = [
  { id: 'john', label: 'John Doe', value: 'john', icon: <User className="h-4 w-4" /> },
  { id: 'jane', label: 'Jane Smith', value: 'jane', icon: <User className="h-4 w-4" /> },
  { id: 'mike', label: 'Mike Johnson', value: 'mike', icon: <User className="h-4 w-4" /> },
  { id: 'sarah', label: 'Sarah Wilson', value: 'sarah', icon: <User className="h-4 w-4" /> },
];

export const Default: Story = {
  args: {
    items: basicItems,
    trigger: 'Select Option',
    placeholder: 'Choose an option',
  },
};

export const WithIcons: Story = {
  args: {
    items: menuItems,
    trigger: (
      <Button variant="outline">
        <MoreVertical className="h-4 w-4" />
      </Button>
    ),
  },
};

export const UserMenu: Story = {
  args: {
    items: userMenuItems,
    trigger: (
      <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
        <Avatar size="sm" name="John Doe" />
        <span className="text-sm font-medium">John Doe</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    ),
  },
};

export const WithSelection: Story = {
  args: {
    items: vehicleStatusItems,
    trigger: 'Vehicle Status',
    selectedValue: 'active',
    placeholder: 'Select status',
  },
};

export const Disabled: Story = {
  args: {
    items: basicItems,
    trigger: 'Disabled Dropdown',
    disabled: true,
  },
};

export const BottomRight: Story = {
  args: {
    items: menuItems,
    trigger: (
      <Button variant="outline">
        Actions <ChevronDown className="h-4 w-4 ml-1" />
      </Button>
    ),
    position: 'bottom-right',
  },
};

export const TopLeft: Story = {
  args: {
    items: menuItems,
    trigger: (
      <Button variant="outline">
        Actions <ChevronDown className="h-4 w-4 ml-1" />
      </Button>
    ),
    position: 'top-left',
  },
};

const ControlledDropdownDemo = () => {
  const [selectedDriver, setSelectedDriver] = useState('john');
  const [selectedStatus, setSelectedStatus] = useState('active');

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Assign Driver:</label>
        <Dropdown
          items={driverItems}
          selectedValue={selectedDriver}
          onSelect={(item) => setSelectedDriver(item.value)}
          placeholder="Select a driver"
        />
        <p className="text-sm text-gray-600 mt-1">
          Selected: {driverItems.find(d => d.value === selectedDriver)?.label}
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Vehicle Status:</label>
        <Dropdown
          items={vehicleStatusItems}
          selectedValue={selectedStatus}
          onSelect={(item) => setSelectedStatus(item.value)}
          placeholder="Select status"
        />
        <p className="text-sm text-gray-600 mt-1">
          Selected: {vehicleStatusItems.find(s => s.value === selectedStatus)?.label}
        </p>
      </div>
    </div>
  );
};

export const ControlledDropdown: Story = {
  render: () => <ControlledDropdownDemo />,
};

export const TaxiParkActions: Story = {
  render: () => (
    <div className="flex gap-4">
      <Dropdown
        items={[
          { id: 'add-vehicle', label: 'Add Vehicle', icon: <Plus className="h-4 w-4" /> },
          { id: 'add-driver', label: 'Add Driver', icon: <Users className="h-4 w-4" /> },
          { id: 'separator', label: '', separator: true },
          { id: 'export', label: 'Export Data', icon: <Download className="h-4 w-4" /> },
        ]}
        trigger={(
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        )}
      />
      
      <Dropdown
        items={[
          { id: 'view', label: 'View Details', icon: <User className="h-4 w-4" /> },
          { id: 'edit', label: 'Edit Vehicle', icon: <Edit className="h-4 w-4" /> },
          { id: 'assign', label: 'Assign Driver', icon: <Users className="h-4 w-4" /> },
          { id: 'separator', label: '', separator: true },
          { id: 'maintenance', label: 'Schedule Maintenance', icon: <Settings className="h-4 w-4" /> },
          { id: 'separator2', label: '', separator: true },
          { id: 'retire', label: 'Retire Vehicle', icon: <Trash2 className="h-4 w-4" />, danger: true },
        ]}
        trigger={(
          <Button variant="outline">
            <Car className="h-4 w-4 mr-2" />
            Vehicle Actions
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        )}
      />
    </div>
  ),
};

export const FilterDropdowns: Story = {
  render: () => (
    <div className="flex gap-4">
      <Dropdown
        items={[
          { id: 'all', label: 'All Vehicles', value: 'all' },
          { id: 'active', label: 'Active Only', value: 'active' },
          { id: 'maintenance', label: 'In Maintenance', value: 'maintenance' },
          { id: 'inactive', label: 'Inactive', value: 'inactive' },
        ]}
        selectedValue="all"
        placeholder="Filter by status"
        triggerClassName="w-40"
      />
      
      <Dropdown
        items={[
          { id: 'all-drivers', label: 'All Drivers', value: 'all' },
          { id: 'online', label: 'Online', value: 'online' },
          { id: 'offline', label: 'Offline', value: 'offline' },
          { id: 'busy', label: 'Busy', value: 'busy' },
        ]}
        selectedValue="all"
        placeholder="Filter by driver status"
        triggerClassName="w-40"
      />
      
      <Dropdown
        items={[
          { id: 'today', label: 'Today', value: 'today' },
          { id: 'week', label: 'This Week', value: 'week' },
          { id: 'month', label: 'This Month', value: 'month' },
          { id: 'custom', label: 'Custom Range', value: 'custom' },
        ]}
        selectedValue="today"
        placeholder="Select time range"
        triggerClassName="w-40"
      />
    </div>
  ),
};

export const AllPositions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-8 p-8">
      <div className="space-y-4">
        <h3 className="font-medium">Bottom Positions</h3>
        <div className="flex gap-4">
          <Dropdown
            items={menuItems}
            trigger={<Button variant="outline">Bottom Left</Button>}
            position="bottom-left"
          />
          <Dropdown
            items={menuItems}
            trigger={<Button variant="outline">Bottom Right</Button>}
            position="bottom-right"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Top Positions</h3>
        <div className="flex gap-4">
          <Dropdown
            items={menuItems}
            trigger={<Button variant="outline">Top Left</Button>}
            position="top-left"
          />
          <Dropdown
            items={menuItems}
            trigger={<Button variant="outline">Top Right</Button>}
            position="top-right"
          />
        </div>
      </div>
    </div>
  ),
};