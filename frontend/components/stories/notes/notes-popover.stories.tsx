import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { delay, http, HttpResponse } from 'msw';

import NotesPopover from '@/components/base/notes/notes-popover';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/cores/applications-config';
import { LoginContext } from '@/components/hooks/use-login';

import { getHTTPMockNotesList, notesListApi } from '../api/api-notes';

const config: PortalConfig = {
  variant_entity: {
    app_id: ApplicationId.variant_entity,
  },
  germline_snv_occurrence: {
    app_id: ApplicationId.germline_snv_occurrence,
    aggregations: [] as any,
  },
  germline_cnv_occurrence: {
    app_id: ApplicationId.germline_cnv_occurrence,
    aggregations: [] as any,
  },
  admin: {
    admin_code: 'admin',
    app_id: ApplicationId.admin,
  },
  portal: {
    name: '',
    navigation: {},
  },
};

const meta = {
  title: 'Notes/Popover',
  component: NotesPopover,
  args: {
    hasNotes: true,
    caseId: 1,
    seqId: 1,
    taskId: 1,
    occurenceId: '1',
  },
  decorators: [
    Story => (
      <BrowserRouter>
        <ConfigProvider config={config}>
          <LoginContext value={{ sub: '1', email: 'johndoe@email.com', name: 'John Doe' }}>
            <Story />
          </LoginContext>
        </ConfigProvider>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof NotesPopover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(notesListApi, async () => {
          await delay(500);
          return getHTTPMockNotesList();
        }),
      ],
    },
  },
  render: args => <NotesPopover {...args} />,
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(notesListApi, async () => {
          await delay(10000);
          return getHTTPMockNotesList();
        }),
      ],
    },
  },
  args: {
    seqId: 2,
  },
  render: args => <NotesPopover {...args} />,
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(notesListApi, async () => {
          await delay(1000);
          return HttpResponse.json([]);
        }),
      ],
    },
  },
  args: {
    hasNotes: false,
    seqId: 3,
  },
  render: args => <NotesPopover {...args} />,
};
