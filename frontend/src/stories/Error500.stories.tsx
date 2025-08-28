import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import Error500 from '../pages/Error500';
import { fn } from '@storybook/test';

const meta: Meta<typeof Error500> = {
  title: 'Pages/Error500',
  component: Error500,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A 500 server error page component with retry functionality and error details.'
      }
    }
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  argTypes: {
    error: {
      control: 'object',
      description: 'Error object with message and stack trace'
    },
    onRetry: {
      action: 'retry',
      description: 'Callback function for retry action'
    },
    showRetryButton: {
      control: 'boolean',
      description: 'Show the retry button'
    },
    showHomeButton: {
      control: 'boolean',
      description: 'Show the home navigation button'
    },
    showContactSupport: {
      control: 'boolean',
      description: 'Show the contact support button'
    },
    customMessage: {
      control: 'text',
      description: 'Custom error message to display'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Error500>;

// Default 500 page
export const Default: Story = {
  args: {
    onRetry: fn()
  },
  parameters: {
    docs: {
      description: {
        story: 'The default 500 error page with all options enabled.'
      }
    }
  }
};

// With error details
export const WithErrorDetails: Story = {
  args: {
    error: new Error('Database connection failed: Unable to connect to PostgreSQL server'),
    onRetry: fn()
  },
  parameters: {
    docs: {
      description: {
        story: 'A 500 error page displaying specific error details (visible in development mode).'
      }
    }
  }
};

// Custom message
export const CustomMessage: Story = {
  args: {
    customMessage: "Our taxi dispatch system is experiencing technical difficulties. Please try again in a few minutes.",
    onRetry: fn()
  },
  parameters: {
    docs: {
      description: {
        story: 'A 500 error page with a custom, user-friendly error message.'
      }
    }
  }
};

// Minimal version
export const Minimal: Story = {
  args: {
    showRetryButton: false,
    showContactSupport: false,
    customMessage: "Service temporarily unavailable.",
    onRetry: fn()
  },
  parameters: {
    docs: {
      description: {
        story: 'A minimal 500 error page with only the home button.'
      }
    }
  }
};

// No retry option
export const NoRetry: Story = {
  args: {
    showRetryButton: false,
    customMessage: "The server is undergoing maintenance. Please try again later.",
    onRetry: undefined
  },
  parameters: {
    docs: {
      description: {
        story: 'A 500 error page without retry functionality, suitable for planned maintenance.'
      }
    }
  }
};

// Network error
export const NetworkError: Story = {
  args: {
    error: new Error('Network Error: Failed to fetch data from API endpoint'),
    customMessage: "Unable to connect to our servers. Please check your internet connection and try again.",
    onRetry: fn()
  },
  parameters: {
    docs: {
      description: {
        story: 'A 500 error page specifically for network-related errors.'
      }
    }
  }
};

// API timeout
export const APITimeout: Story = {
  args: {
    error: new Error('Request timeout: API call exceeded 30 second limit'),
    customMessage: "The request is taking longer than expected. This might be due to high server load.",
    onRetry: fn()
  },
  parameters: {
    docs: {
      description: {
        story: 'A 500 error page for API timeout scenarios.'
      }
    }
  }
};