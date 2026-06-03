import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleAlert } from 'lucide-react';

import {
  Alert,
  AlertActions,
  AlertClosableIcon,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/base/shadcn/alert';
import { Button } from '@/components/base/shadcn/button';

import { StorySection } from '../story-section';

const meta = {
  title: 'Components/Alerts/Alert',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorySection title="Default">
      <div className="flex w-full flex-col gap-3">
        <Alert variant="default" bordered>
          <AlertIcon>
            <CircleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>This is a default alert message.</AlertDescription>
            <AlertActions>
              <Button variant="default" size="sm" onClick={() => alert('Main action clicked')}>
                Main Action
              </Button>
              <Button variant="ghost" size="sm" onClick={() => alert('Other action clicked')}>
                Action
              </Button>
            </AlertActions>
          </AlertContent>
          <AlertClosableIcon onClick={() => alert('Alert closed')} />
        </Alert>
        <Alert variant="default">
          <AlertContent>
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>This is a default alert message.</AlertDescription>
          </AlertContent>
        </Alert>
        <Alert variant="default">
          <AlertIcon>
            <CircleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertDescription>This is a default alert message.</AlertDescription>
          </AlertContent>
          <AlertClosableIcon onClick={() => alert('Alert closed')} />
        </Alert>
      </div>
    </StorySection>
  ),
};

export const Info: Story = {
  render: () => (
    <StorySection title="Info">
      <div className="flex w-full flex-col gap-3">
        <Alert variant="info" bordered>
          <AlertIcon>
            <CircleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Info Alert</AlertTitle>
            <AlertDescription>This is an informational alert message.</AlertDescription>
            <AlertActions>
              <Button variant="default" size="sm" onClick={() => alert('Main action clicked')}>
                Main Action
              </Button>
              <Button variant="ghost" size="sm" onClick={() => alert('Other action clicked')}>
                Action
              </Button>
            </AlertActions>
          </AlertContent>
          <AlertClosableIcon onClick={() => alert('Alert closed')} />
        </Alert>
        <Alert variant="info">
          <AlertContent>
            <AlertTitle>Info Alert</AlertTitle>
            <AlertDescription>This is an informational alert message.</AlertDescription>
          </AlertContent>
        </Alert>
        <Alert variant="info">
          <AlertIcon>
            <CircleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertDescription>This is an informational alert message.</AlertDescription>
          </AlertContent>
          <AlertClosableIcon onClick={() => alert('Alert closed')} />
        </Alert>
      </div>
    </StorySection>
  ),
};

export const Warning: Story = {
  render: () => (
    <StorySection title="Warning">
      <div className="flex w-full flex-col gap-3">
        <Alert variant="warning" bordered>
          <AlertIcon>
            <CircleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Warning Alert</AlertTitle>
            <AlertDescription>This is a warning alert message.</AlertDescription>
            <AlertActions>
              <Button variant="default" size="sm" onClick={() => alert('Main action clicked')}>
                Main Action
              </Button>
              <Button variant="ghost" size="sm" onClick={() => alert('Other action clicked')}>
                Action
              </Button>
            </AlertActions>
          </AlertContent>
          <AlertClosableIcon onClick={() => alert('Alert closed')} />
        </Alert>
        <Alert variant="warning">
          <AlertContent>
            <AlertTitle>Warning Alert</AlertTitle>
            <AlertDescription>This is a warning alert message.</AlertDescription>
          </AlertContent>
        </Alert>
        <Alert variant="warning">
          <AlertIcon>
            <CircleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertDescription>This is a warning alert message.</AlertDescription>
          </AlertContent>
          <AlertClosableIcon onClick={() => alert('Alert closed')} />
        </Alert>
      </div>
    </StorySection>
  ),
};

export const Error: Story = {
  render: () => (
    <StorySection title="Error">
      <div className="flex w-full flex-col gap-3">
        <Alert variant="error" bordered>
          <AlertIcon>
            <CircleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Error Alert</AlertTitle>
            <AlertDescription>This is an error alert message.</AlertDescription>
            <AlertActions>
              <Button variant="default" size="sm" onClick={() => alert('Main action clicked')}>
                Main Action
              </Button>
              <Button variant="ghost" size="sm" onClick={() => alert('Other action clicked')}>
                Action
              </Button>
            </AlertActions>
          </AlertContent>
          <AlertClosableIcon onClick={() => alert('Alert closed')} />
        </Alert>
        <Alert variant="error">
          <AlertContent>
            <AlertTitle>Error Alert</AlertTitle>
            <AlertDescription>This is an error alert message.</AlertDescription>
          </AlertContent>
        </Alert>
        <Alert variant="error">
          <AlertIcon>
            <CircleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertDescription>This is an error alert message.</AlertDescription>
          </AlertContent>
          <AlertClosableIcon onClick={() => alert('Alert closed')} />
        </Alert>
      </div>
    </StorySection>
  ),
};

export const Success: Story = {
  render: () => (
    <StorySection title="Success">
      <div className="flex w-full flex-col gap-3">
        <Alert variant="success" bordered>
          <AlertIcon>
            <CircleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Success Alert</AlertTitle>
            <AlertDescription>This is a success alert message.</AlertDescription>
            <AlertActions>
              <Button variant="default" size="sm" onClick={() => alert('Main action clicked')}>
                Main Action
              </Button>
              <Button variant="ghost" size="sm" onClick={() => alert('Other action clicked')}>
                Action
              </Button>
            </AlertActions>
          </AlertContent>
          <AlertClosableIcon onClick={() => alert('Alert closed')} />
        </Alert>
        <Alert variant="success">
          <AlertContent>
            <AlertTitle>Success Alert</AlertTitle>
            <AlertDescription>This is a success alert message.</AlertDescription>
          </AlertContent>
        </Alert>
        <Alert variant="success">
          <AlertIcon>
            <CircleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertDescription>This is a success alert message.</AlertDescription>
          </AlertContent>
          <AlertClosableIcon onClick={() => alert('Alert closed')} />
        </Alert>
      </div>
    </StorySection>
  ),
};
