import type { Meta, StoryObj } from '@storybook/react-vite';

import Timeline from '@/components/base/timeline/timeline';

const meta = {
  title: 'Components/Timeline',
  component: Timeline,
} satisfies Meta<typeof Timeline>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[720px]">
      <Timeline
        title="Clinical Timeline"
        description="Disease events, surgeries, radiation and medical therapy by age in days since birth."
        events={[
          {
            type: 'Initial',
            cnsIntegratedDiagnosis: 'ATRT-MYC',
            description: [
              { label: 'Tumor locations', value: 'Frontal lobe' },
              { label: 'Metastasis', value: 'No' },
            ],
            evidenceHref: '#',
            startDay: 819,
            years: 2.2,
          },
          {
            type: 'Recurrence',
            cnsIntegratedDiagnosis: 'ATRT, NOS or NEC',
            description: [
              { label: 'Tumor locations', value: 'Posterior fossa' },
              { label: 'Metastasis', value: 'Yes' },
            ],
            evidenceHref: '#',
            startDay: 1135,
            years: 3.1,
          },
          { type: 'Deceased', cnsIntegratedDiagnosis: 'ATRT, NOS or NEC', startDay: 1343, years: 3.7 },
        ]}
        surgeries={[
          {
            extentOfTumorResection: 'Gross/Near total resection',
            description: 'Treatment follows a protocol but subject is not enrolled',
            isInitialTreatment: true,
            evidenceHref: '#',
            startDay: 820,
            years: 2.2,
          },
          { extentOfTumorResection: 'Biopsy only', startDay: 1140, years: 3.1 },
        ]}
        chemotherapies={[
          {
            protocolNameAndArm: 'DCFI Modified RS-II',
            type: 'Initial treatment',
            agents: ['cisplatin', 'cyclophosphamide', 'vincristine', 'etoposide', 'methotrexate'],
            isInitialTreatment: true,
            evidenceHref: '#',
            startDay: 830,
            endDay: 1050,
            years: 2.3,
          },
          {
            protocolNameAndArm: 'Chemotherapy',
            type: 'Treatment follows other standard of care',
            agents: ['thalidomide', 'etoposide', 'cyclophosphamide', 'fenofibrate', 'celebrex'],
            evidenceHref: '#',
            startDay: 1208,
            endDay: 1298,
            years: 3.3,
          },
        ]}
        radiations={[
          {
            site: 'Focal/Tumor bed',
            type: 'Protons',
            description: [{ label: 'Dose', value: '5400 cGy' }],
            evidenceHref: '#',
            startDay: 991,
            endDay: 1023,
            years: 2.3,
          },
        ]}
      />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="w-[720px]">
      <Timeline
        title="Clinical Timeline"
        description="Disease events, surgeries, radiation and medical therapy by age in days since birth."
      />
    </div>
  ),
};

export const WithOneEmptyResult: Story = {
  render: () => (
    <div className="w-[720px]">
      <Timeline
        title="Clinical Timeline"
        description="Disease events, surgeries, radiation and medical therapy by age in days since birth."
        events={[
          {
            type: 'Initial',
            cnsIntegratedDiagnosis: 'ATRT-MYC',
            description: [
              { label: 'Tumor locations', value: 'Frontal lobe' },
              { label: 'Metastasis', value: 'No' },
            ],
            evidenceHref: '#',
            startDay: 819,
            years: 2.2,
          },
          {
            type: 'Recurrence',
            cnsIntegratedDiagnosis: 'ATRT, NOS or NEC',
            description: [
              { label: 'Tumor locations', value: 'Posterior fossa' },
              { label: 'Metastasis', value: 'Yes' },
            ],
            evidenceHref: '#',
            startDay: 1135,
            years: 3.1,
          },
          { type: 'Deceased', cnsIntegratedDiagnosis: 'ATRT, NOS or NEC', startDay: 1343, years: 3.7 },
        ]}
        chemotherapies={[
          {
            protocolNameAndArm: 'DCFI Modified RS-II',
            type: 'Initial treatment',
            agents: ['cisplatin', 'cyclophosphamide', 'vincristine', 'etoposide', 'methotrexate'],
            isInitialTreatment: true,
            evidenceHref: '#',
            startDay: 830,
            endDay: 1050,
            years: 2.3,
          },
        ]}
        radiations={[
          {
            site: 'Focal/Tumor bed',
            type: 'Protons',
            description: [{ label: 'Dose', value: '5400 cGy' }],
            evidenceHref: '#',
            startDay: 991,
            endDay: 1023,
            years: 2.3,
          },
        ]}
      />
    </div>
  ),
};

export const Long: Story = {
  render: () => (
    <div className="h-[500px] w-[720px] overflow-y-auto rounded-md border px-4 pb-4">
      <Timeline
        title="Clinical Timeline"
        description="Scroll down — the filter bar stays pinned at the top."
        events={Array.from({ length: 10 }, (_, i) => ({
          type: ['Initial', 'Progressive', 'Recurrence'][i % 3],
          cnsIntegratedDiagnosis: 'ATRT-MYC',
          description: [
            { label: 'Tumor locations', value: 'Frontal lobe' },
            { label: 'Metastasis', value: i % 2 === 0 ? 'No' : 'Yes' },
          ],
          startDay: 500 + i * 120,
          years: (500 + i * 120) / 365.25,
        }))}
        surgeries={Array.from({ length: 5 }, (_, i) => ({
          extentOfTumorResection: i % 2 === 0 ? 'Gross/Near total resection' : 'Biopsy only',
          isInitialTreatment: i === 0,
          startDay: 550 + i * 250,
          years: (550 + i * 250) / 365.25,
        }))}
        chemotherapies={Array.from({ length: 6 }, (_, i) => ({
          protocolNameAndArm: `Protocol ${i + 1}`,
          type: 'Standard of care',
          agents: ['cisplatin', 'etoposide', 'vincristine'],
          startDay: 600 + i * 180,
          endDay: 700 + i * 180,
          years: (600 + i * 180) / 365.25,
        }))}
        radiations={Array.from({ length: 3 }, (_, i) => ({
          site: i === 0 ? 'Focal/Tumor bed' : 'Craniospinal',
          type: 'Protons',
          description: [{ label: 'Dose', value: `${3600 + i * 200} cGy` }],
          startDay: 800 + i * 400,
          endDay: 830 + i * 400,
          years: (800 + i * 400) / 365.25,
        }))}
      />
    </div>
  ),
};
