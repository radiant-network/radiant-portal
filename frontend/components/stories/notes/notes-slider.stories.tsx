import { BrowserRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { delay, http, HttpResponse } from 'msw';

import NotesSlider from '@/components/base/notes/notes-slider';
import { ApplicationId, ConfigProvider, PortalConfig } from '@/components/cores/applications-config';
import { LoginContext } from '@/components/hooks/use-login';

import { getHTTPMockNotesList, notesListApi } from '../api/api-notes';

const config: PortalConfig = {
  variant_entity: {
    app_id: ApplicationId.variant_entity,
  },
  snv_occurrence: {
    app_id: ApplicationId.snv_occurrence,
    aggregations: [] as any,
  },
  cnv_occurrence: {
    app_id: ApplicationId.cnv_occurrence,
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
  title: 'Notes/NotesSlider',
  component: NotesSlider,
  args: {
    type: 'variant',
    caseId: '1',
    seqId: '1',
    taskId: '1',
    locusId: '1',
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
} satisfies Meta<typeof NotesSlider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(notesListApi, async () => {
          await delay(1100);
          return getHTTPMockNotesList();
        }),
      ],
    },
  },
  render: args => <NotesSlider {...args} />,
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(notesListApi, async () => {
          await delay(10000);
          return getHTTPMockNotesList();
        }),
      ],
    },
  },
  args: {
    seqId: '3',
  },
  render: args => <NotesSlider {...args} />,
};

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post(notesListApi, async () => {
          await delay(1000);
          return HttpResponse.json([]);
        }),
      ],
    },
  },
  args: {
    seqId: '4',
  },
  render: args => <NotesSlider {...args} />,
};
