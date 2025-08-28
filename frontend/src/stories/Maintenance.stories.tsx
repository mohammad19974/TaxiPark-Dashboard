import type { Meta, StoryObj } from '@storybook/react';
import Maintenance from '../pages/Maintenance';

const meta: Meta<typeof Maintenance> = {
  title: 'Pages/Maintenance',
  component: Maintenance,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A maintenance page component with countdown timer and status information.'
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Main title of the maintenance page'
    },
    message: {
      control: 'text',
      description: 'Descriptive message about the maintenance'
    },
    estimatedTime: {
      control: 'text',
      description: 'Estimated duration of maintenance'
    },
    contactEmail: {
      control: 'text',
      description: 'Support contact email'
    },
    showRefreshButton: {
      control: 'boolean',
      description: 'Show the refresh/check again button'
    },
    showContactButton: {
      control: 'boolean',
      description: 'Show the contact support button'
    },
    maintenanceStartTime: {
      control: 'date',
      description: 'When maintenance started'
    },
    estimatedEndTime: {
      control: 'date',
      description: 'Estimated completion time'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Maintenance>;

// Default maintenance page
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'The default maintenance page with standard messaging and options.'
      }
    }
  }
};

// Scheduled maintenance
export const ScheduledMaintenance: Story = {
  args: {
    title: "Scheduled System Maintenance",
    message: "We're performing scheduled maintenance to improve system performance and add new features. Thank you for your patience.",
    estimatedTime: "4 hours",
    maintenanceStartTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
    estimatedEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000) // Ends in 2 hours
  },
  parameters: {
    docs: {
      description: {
        story: 'A maintenance page for scheduled maintenance with start and end times.'
      }
    }
  }
};

// Emergency maintenance
export const EmergencyMaintenance: Story = {
  args: {
    title: "Emergency Maintenance",
    message: "We're addressing a critical issue to ensure system stability and security. We apologize for the unexpected downtime.",
    estimatedTime: "1-2 hours",
    contactEmail: "emergency@taxipark.com",
    maintenanceStartTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 minutes ago
    estimatedEndTime: new Date(Date.now() + 90 * 60 * 1000) // Ends in 90 minutes
  },
  parameters: {
    docs: {
      description: {
        story: 'A maintenance page for emergency maintenance scenarios.'
      }
    }
  }
};

// Database upgrade
export const DatabaseUpgrade: Story = {
  args: {
    title: "Database Upgrade in Progress",
    message: "We're upgrading our database infrastructure to provide better performance and reliability. All your data is safe and will be available once the upgrade is complete.",
    estimatedTime: "6-8 hours",
    maintenanceStartTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // Started 3 hours ago
    estimatedEndTime: new Date(Date.now() + 4 * 60 * 60 * 1000) // Ends in 4 hours
  },
  parameters: {
    docs: {
      description: {
        story: 'A maintenance page specifically for database upgrades.'
      }
    }
  }
};

// Short maintenance
export const ShortMaintenance: Story = {
  args: {
    title: "Quick System Update",
    message: "We're applying a quick security update. This should only take a few minutes.",
    estimatedTime: "15-30 minutes",
    maintenanceStartTime: new Date(Date.now() - 10 * 60 * 1000), // Started 10 minutes ago
    estimatedEndTime: new Date(Date.now() + 20 * 60 * 1000) // Ends in 20 minutes
  },
  parameters: {
    docs: {
      description: {
        story: 'A maintenance page for short-duration updates.'
      }
    }
  }
};

// Minimal version
export const Minimal: Story = {
  args: {
    title: "Service Unavailable",
    message: "The service is temporarily unavailable.",
    showRefreshButton: false,
    showContactButton: false,
    estimatedTime: undefined
  },
  parameters: {
    docs: {
      description: {
        story: 'A minimal maintenance page with basic information only.'
      }
    }
  }
};

// Extended maintenance
export const ExtendedMaintenance: Story = {
  args: {
    title: "Major System Upgrade",
    message: "We're performing a major system upgrade that includes new features, performance improvements, and security enhancements. This is a significant update that will greatly improve your experience.",
    estimatedTime: "12-16 hours",
    contactEmail: "support@taxipark.com",
    maintenanceStartTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // Started 6 hours ago
    estimatedEndTime: new Date(Date.now() + 8 * 60 * 60 * 1000) // Ends in 8 hours
  },
  parameters: {
    docs: {
      description: {
        story: 'A maintenance page for extended maintenance periods with detailed information.'
      }
    }
  }
};

// Maintenance completed soon
export const CompletingSoon: Story = {
  args: {
    title: "Maintenance Completing Soon",
    message: "We're in the final stages of our maintenance work. The system should be available shortly.",
    estimatedTime: "5-10 minutes",
    maintenanceStartTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // Started 4 hours ago
    estimatedEndTime: new Date(Date.now() + 5 * 60 * 1000) // Ends in 5 minutes
  },
  parameters: {
    docs: {
      description: {
        story: 'A maintenance page when maintenance is almost complete.'
      }
    }
  }
};