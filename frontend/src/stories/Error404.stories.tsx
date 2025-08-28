import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import Error404 from '../pages/Error404';

const meta: Meta<typeof Error404> = {
  title: 'Pages/Error404',
  component: Error404,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A 404 error page component with navigation options and customizable messaging.'
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
    message: {
      control: 'text',
      description: 'Custom error message to display'
    },
    showBackButton: {
      control: 'boolean',
      description: 'Show the back navigation button'
    },
    showHomeButton: {
      control: 'boolean',
      description: 'Show the home navigation button'
    },
    showSearchSuggestion: {
      control: 'boolean',
      description: 'Show the search suggestion button'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Error404>;

// Default 404 page
export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'The default 404 error page with all navigation options enabled.'
      }
    }
  }
};

// Custom message
export const CustomMessage: Story = {
  args: {
    message: "Oops! The taxi route you're looking for seems to have taken a detour."
  },
  parameters: {
    docs: {
      description: {
        story: 'A 404 page with a custom, themed error message.'
      }
    }
  }
};

// Minimal version
export const Minimal: Story = {
  args: {
    showBackButton: false,
    showSearchSuggestion: false,
    message: "Page not found."
  },
  parameters: {
    docs: {
      description: {
        story: 'A minimal 404 page with only the home button enabled.'
      }
    }
  }
};

// No navigation
export const NoNavigation: Story = {
  args: {
    showBackButton: false,
    showHomeButton: false,
    showSearchSuggestion: false,
    message: "This page is temporarily unavailable."
  },
  parameters: {
    docs: {
      description: {
        story: 'A 404 page with no navigation options, useful for maintenance scenarios.'
      }
    }
  }
};

// Full featured
export const FullFeatured: Story = {
  args: {
    message: "The page you requested could not be found. This might be because the URL is incorrect, the page has been moved, or you don't have permission to access it.",
    showBackButton: true,
    showHomeButton: true,
    showSearchSuggestion: true
  },
  parameters: {
    docs: {
      description: {
        story: 'A comprehensive 404 page with detailed messaging and all navigation options.'
      }
    }
  }
};