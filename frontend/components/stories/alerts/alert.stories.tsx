import type { Meta, StoryObj } from '@storybook/react';
import { CircleAlert } from 'lucide-react';

import {
  Alert,
  AlertActions,
  AlertClosableIcon,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/base/ui/alert';
import { Button } from '@/components/base/ui/button';

const meta = {
  title: 'Alerts/Alert',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
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
  ),
};

export const Warning: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
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
  ),
};

export const Error: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
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
  ),
};

export const Success: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
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
  ),
};
