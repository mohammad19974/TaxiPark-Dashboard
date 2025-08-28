import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Panel, PanelHeader, PanelBody, PanelFooter } from './Panel';
import { Button } from '../button';
import { Settings, Download, Edit, Trash2, Plus } from 'lucide-react';

const meta: Meta<typeof Panel> = {
  title: 'UI/Panel',
  component: Panel,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible panel component with header, body, and footer sections. Supports different variants, collapsible functionality, and customizable styling.'
      }
    }
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'filled'],
      description: 'Visual variant of the panel'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size variant of the panel'
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Panel>;

// Basic Panel
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'md'
  },
  render: (args) => (
    <Panel {...args}>
      <PanelHeader title="Default Panel" subtitle="This is a basic panel example" />
      <PanelBody>
        <p className="text-gray-600">
          This is the panel body content. You can put any content here including text, forms, tables, or other components.
        </p>
      </PanelBody>
      <PanelFooter>
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm" className="ml-2">Save</Button>
      </PanelFooter>
    </Panel>
  )
};

// Panel Variants
export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <Panel variant="default">
        <PanelHeader title="Default Variant" />
        <PanelBody>
          <p className="text-gray-600">Default panel with shadow styling.</p>
        </PanelBody>
      </Panel>
      
      <Panel variant="bordered">
        <PanelHeader title="Bordered Variant" />
        <PanelBody>
          <p className="text-gray-600">Panel with border styling.</p>
        </PanelBody>
      </Panel>
      
      <Panel variant="filled">
        <PanelHeader title="Filled Variant" />
        <PanelBody>
          <p className="text-gray-600">Panel with filled background styling.</p>
        </PanelBody>
      </Panel>
    </div>
  )
};

// Collapsible Panel
export const Collapsible: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    
    return (
      <Panel variant="bordered">
        <PanelHeader 
          title="Collapsible Panel" 
          subtitle="Click to toggle content"
          collapsible
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
        {!collapsed && (
          <>
            <PanelBody>
              <p className="text-gray-600">
                This panel can be collapsed and expanded. The content is hidden when collapsed.
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Additional Content</h4>
                <p className="text-blue-700 text-sm mt-1">
                  This content will be hidden when the panel is collapsed.
                </p>
              </div>
            </PanelBody>
            <PanelFooter>
              <Button variant="outline" size="sm">Action</Button>
            </PanelFooter>
          </>
        )}
      </Panel>
    );
  }
};

// Panel with Actions
export const WithActions: Story = {
  render: () => (
    <Panel variant="bordered">
      <PanelHeader 
        title="User Settings" 
        subtitle="Manage your account preferences"
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        }
      />
      <PanelBody>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="john@example.com"
            />
          </div>
        </div>
      </PanelBody>
      <PanelFooter align="between">
        <Button variant="ghost" size="sm">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </Button>
        <div className="space-x-2">
          <Button variant="outline" size="sm">Cancel</Button>
          <Button size="sm">Save Changes</Button>
        </div>
      </PanelFooter>
    </Panel>
  )
};

// Panel Sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <Panel variant="bordered" size="sm">
        <PanelHeader title="Small Panel" />
        <PanelBody padding="sm">
          <p className="text-sm text-gray-600">Small panel with reduced padding.</p>
        </PanelBody>
      </Panel>
      
      <Panel variant="bordered" size="md">
        <PanelHeader title="Medium Panel" />
        <PanelBody padding="md">
          <p className="text-gray-600">Medium panel with standard padding.</p>
        </PanelBody>
      </Panel>
      
      <Panel variant="bordered" size="lg">
        <PanelHeader title="Large Panel" />
        <PanelBody padding="lg">
          <p className="text-gray-600">Large panel with increased padding.</p>
        </PanelBody>
      </Panel>
    </div>
  )
};

// Complex Panel Example
export const ComplexExample: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('overview');
    
    return (
      <Panel variant="bordered" className="max-w-4xl">
        <PanelHeader 
          title="Project Dashboard" 
          subtitle="Monitor your project progress and metrics"
          actions={
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>
          }
        />
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-4">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'tasks', label: 'Tasks' },
              { id: 'team', label: 'Team' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <PanelBody>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900">Total Tasks</h3>
                <p className="text-2xl font-bold text-blue-600 mt-1">24</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900">Completed</h3>
                <p className="text-2xl font-bold text-green-600 mt-1">18</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-900">In Progress</h3>
                <p className="text-2xl font-bold text-yellow-600 mt-1">6</p>
              </div>
            </div>
          )}
          
          {activeTab === 'tasks' && (
            <div className="space-y-3">
              {['Design new homepage', 'Implement user authentication', 'Write API documentation'].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{task}</span>
                  <span className="text-sm text-gray-500">In Progress</span>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'team' && (
            <div className="text-center py-8">
              <p className="text-gray-500">Team management content would go here.</p>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="text-center py-8">
              <p className="text-gray-500">Project settings would go here.</p>
            </div>
          )}
        </PanelBody>
        
        <PanelFooter align="between">
          <span className="text-sm text-gray-500">Last updated: 2 minutes ago</span>
          <Button variant="outline" size="sm">Refresh</Button>
        </PanelFooter>
      </Panel>
    );
  }
};

// Panel without Header or Footer
export const BodyOnly: Story = {
  render: () => (
    <Panel variant="bordered">
      <PanelBody>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Simple Content Panel</h3>
        <p className="text-gray-600">
          This panel only contains body content without a header or footer. 
          Perfect for simple content display or when you need maximum content space.
        </p>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            You can still include structured content within the body.
          </p>
        </div>
      </PanelBody>
    </Panel>
  )
};

// Interactive Panel
export const Interactive: Story = {
  render: () => {
    const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
    const [newItem, setNewItem] = useState('');
    
    const addItem = () => {
      if (newItem.trim()) {
        setItems([...items, newItem]);
        setNewItem('');
      }
    };
    
    const removeItem = (index: number) => {
      setItems(items.filter((_, i) => i !== index));
    };
    
    return (
      <Panel variant="bordered">
        <PanelHeader title="Interactive List" subtitle="Add and remove items dynamically" />
        <PanelBody>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>{item}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                placeholder="Enter new item..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button onClick={addItem} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </PanelBody>
        <PanelFooter>
          <span className="text-sm text-gray-500">{items.length} items total</span>
        </PanelFooter>
      </Panel>
    );
  }
};