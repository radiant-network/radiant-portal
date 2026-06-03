import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar, Database, FileText, Filter, Settings, Users } from 'lucide-react';

import FilterButton, { IFilterButtonItem, PopoverSize } from '@/components/base/buttons/filter-button';
import PriorityIndicator, { PriorityIndicatorCode } from '@/components/base/indicators/priority-indicator';

import { StorySection, StoryShowcase } from '../story-section';

const meta: Meta<typeof FilterButton> = {
  title: 'Components/Buttons/Filter Button',
  component: FilterButton,
  args: {
    label: 'Filter',
    selected: [],
    options: [],
    onSelect: () => {},
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// Mock data for checkbox list
const basicOptions: IFilterButtonItem[] = [
  { key: 'option1', label: 'Option 1', count: 42 },
  { key: 'option2', label: 'Option 2', count: 28 },
  { key: 'option3', label: 'Option 3', count: 15 },
  { key: 'option4', label: 'Option 4', count: 7 },
  { key: 'option5', label: 'Option 5', count: 3 },
];

// Mock data for long text with tooltips
const longTextOptions: IFilterButtonItem[] = [
  {
    key: 'cardiovascular_disease',
    label: 'Cardiovascular Disease and Related Conditions Including Hypertension',
    tooltip:
      'This includes all forms of cardiovascular disease including coronary artery disease, heart failure, arrhythmias, and hypertension-related conditions.',
    count: 156,
    icon: Users,
  },
  {
    key: 'diabetes_complications',
    label: 'Diabetes Mellitus Type 2 with Complications and Comorbidities',
    tooltip:
      'Type 2 diabetes with various complications such as diabetic nephropathy, retinopathy, neuropathy, and associated cardiovascular risks.',
    count: 89,
    icon: Database,
  },
  {
    key: 'respiratory_conditions',
    label: 'Chronic Respiratory Conditions Including COPD and Asthma',
    tooltip:
      'Chronic obstructive pulmonary disease, asthma, and other long-term respiratory conditions requiring ongoing management.',
    count: 67,
    icon: FileText,
  },
  {
    key: 'neurological_disorders',
    label: 'Neurological Disorders and Neurodegenerative Conditions',
    tooltip:
      "Includes Alzheimer's disease, Parkinson's disease, multiple sclerosis, and other neurological conditions.",
    count: 34,
    icon: Settings,
  },
];

// Mock data for a standard checkbox list with a per-item icon
const iconOptions: IFilterButtonItem[] = [
  { key: 'users', label: 'Users', count: 42, icon: Users },
  { key: 'database', label: 'Database', count: 28, icon: Database },
  { key: 'files', label: 'Files', count: 15, icon: FileText },
  { key: 'calendar', label: 'Calendar', count: 7, icon: Calendar },
];

// Mock data without counts
const noCountOptions: IFilterButtonItem[] = [
  { key: 'option1', label: 'Option 1' },
  { key: 'option2', label: 'Option 2' },
  { key: 'option3', label: 'Option 3' },
];

// Mock data with React node labels (e.g. a PriorityIndicator instead of a plain string)
const priorityOptions: IFilterButtonItem[] = (['routine', 'urgent', 'asap', 'stat'] as PriorityIndicatorCode[]).map(
  (code, index) => ({
    key: code,
    label: <PriorityIndicator size="sm" code={code} />,
    count: [42, 28, 15, 7][index],
  }),
);

// Mock data for a code-based filter (key shown in front of the label + tooltip)
const labCodeOptions: IFilterButtonItem[] = [
  { key: 'EXTUM', label: 'Tumoral Analysis', tooltip: 'External Tumoral Analysis', count: 234 },
  { key: 'CHUSJ', label: 'CHU Sainte-Justine Laboratory', count: 156 },
  { key: 'LSPQ', label: 'Laboratoire de santé publique du Québec', count: 89 },
  { key: 'MUHC', label: 'McGill University Health Centre', count: 42 },
];

// Mock data for action mode
const actionOptions: IFilterButtonItem[] = [
  { key: 'download', label: 'Download Report', icon: FileText },
  { key: 'export', label: 'Export Data', icon: Database },
  { key: 'schedule', label: 'Schedule Analysis', icon: Calendar },
  { key: 'share', label: 'Share Results', icon: Users },
];

// Interactive wrapper component for state management
const InteractiveFilterButton = ({ initialSelected = [], ...props }: any) => {
  const [selected, setSelected] = useState<string[]>(initialSelected);

  return <FilterButton {...props} selected={selected} onSelect={setSelected} />;
};

export const PopOverSize: Story = {
  render: () => (
    <StorySection title="Popover sizes">
      <div className="flex gap-2">
        {['xs', 'sm', 'md', 'lg'].map(size => (
          <FilterButton
            key={size}
            popoverSize={size as PopoverSize}
            label={`size ${size}`}
            options={basicOptions}
            selected={[]}
            onSelect={function (_selected: string[]): void {
              throw new Error('Function not implemented.');
            }}
          />
        ))}
      </div>
    </StorySection>
  ),
};

export const WithCheckboxList: Story = {
  render: () => (
    <StorySection title="Basic filter with checkboxes">
      <InteractiveFilterButton
        label="Status"
        options={basicOptions}
        placeholder="Search status..."
        icon={<Filter className="size-4" />}
      />
    </StorySection>
  ),
};

export const WithLongTextAndTooltips: Story = {
  render: () => (
    <StorySection title="Long text with tooltips">
      <InteractiveFilterButton
        label="Medical Conditions"
        options={longTextOptions}
        placeholder="Search conditions..."
        withTooltip={true}
        icon={<Users className="size-4" />}
      />
    </StorySection>
  ),
};

export const WithItemIcons: Story = {
  render: () => (
    <StorySection title="Checkbox list with per-item icons">
      <InteractiveFilterButton
        label="Type"
        options={iconOptions}
        placeholder="Search type..."
        icon={<Filter className="size-4" />}
      />
    </StorySection>
  ),
};

export const WithoutCounts: Story = {
  render: () => (
    <StorySection title="Options without counts">
      <InteractiveFilterButton
        label="Status"
        options={noCountOptions}
        placeholder="Search status..."
        icon={<Filter className="size-4" />}
      />
    </StorySection>
  ),
};

export const WithReactNodeLabels: Story = {
  render: () => (
    <StorySection title="React node labels (PriorityIndicator)">
      <InteractiveFilterButton
        label="Priority"
        options={priorityOptions}
        placeholder="Search priority..."
        icon={<Filter className="size-4" />}
      />
    </StorySection>
  ),
};

export const WithKeyOnly: Story = {
  render: () => (
    <StorySection title="Key display only (no tooltip)">
      <InteractiveFilterButton
        label="Lab"
        options={labCodeOptions}
        popoverSize="md"
        placeholder="Search lab..."
        showKey
        icon={<Filter className="size-4" />}
      />
    </StorySection>
  ),
};

export const WithKeyAndTooltip: Story = {
  render: () => (
    <StorySection title="Key display + tooltip (code-based filter)">
      <InteractiveFilterButton
        label="Lab"
        options={labCodeOptions}
        popoverSize="lg"
        placeholder="Search lab..."
        showKey
        withTooltip
        icon={<Filter className="size-4" />}
      />
    </StorySection>
  ),
};

export const ActionMode: Story = {
  render: () => (
    <StorySection title="Action mode (no checkboxes)">
      <InteractiveFilterButton
        label="Actions"
        options={actionOptions}
        actionMode={true}
        closeOnSelect={true}
        placeholder="Search actions..."
        icon={<Settings className="size-4" />}
      />
    </StorySection>
  ),
};

export const WithPreselectedItems: Story = {
  render: () => (
    <StorySection title="With preselected items">
      <InteractiveFilterButton
        label="Status"
        options={basicOptions}
        initialSelected={['option1', 'option3']}
        placeholder="Search status..."
        icon={<Filter className="size-4" />}
      />
    </StorySection>
  ),
};

export const OpenOnAppear: Story = {
  render: () => (
    <StorySection title="Open on appear">
      <InteractiveFilterButton
        label="Auto Open"
        options={basicOptions}
        isOpen={true}
        placeholder="Search..."
        icon={<Filter className="size-4" />}
      />
    </StorySection>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <StoryShowcase>
      <StorySection title="Basic filter with checkboxes">
        <InteractiveFilterButton
          label="Status"
          options={basicOptions}
          placeholder="Search status..."
          icon={<Filter className="size-4" />}
        />
      </StorySection>

      <StorySection title="Long text with tooltips">
        <InteractiveFilterButton
          label="Medical Conditions"
          options={longTextOptions}
          placeholder="Search conditions..."
          withTooltip={true}
          icon={<Users className="size-4" />}
        />
      </StorySection>

      <StorySection title="Key display only (no tooltip)">
        <InteractiveFilterButton
          label="Lab"
          options={labCodeOptions}
          popoverSize="md"
          placeholder="Search lab..."
          showKey
          icon={<Filter className="size-4" />}
        />
      </StorySection>

      <StorySection title="Key display + tooltip (code-based filter)">
        <InteractiveFilterButton
          label="Lab"
          options={labCodeOptions}
          popoverSize="lg"
          placeholder="Search lab..."
          showKey
          withTooltip
          icon={<Filter className="size-4" />}
        />
      </StorySection>

      <StorySection title="Checkbox list with per-item icons">
        <InteractiveFilterButton
          label="Type"
          options={iconOptions}
          placeholder="Search type..."
          icon={<Filter className="size-4" />}
        />
      </StorySection>

      <StorySection title="Options without counts">
        <InteractiveFilterButton
          label="Status"
          options={noCountOptions}
          placeholder="Search status..."
          icon={<Filter className="size-4" />}
        />
      </StorySection>

      <StorySection title="React node labels (PriorityIndicator)">
        <InteractiveFilterButton
          label="Priority"
          options={priorityOptions}
          placeholder="Search priority..."
          icon={<Filter className="size-4" />}
        />
      </StorySection>

      <StorySection title="Action mode">
        <InteractiveFilterButton
          label="Actions"
          options={actionOptions}
          actionMode={true}
          closeOnSelect={true}
          placeholder="Search actions..."
          icon={<Settings className="size-4" />}
        />
      </StorySection>
    </StoryShowcase>
  ),
};
