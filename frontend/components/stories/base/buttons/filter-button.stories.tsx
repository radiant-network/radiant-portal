import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Filter, Users, Settings, Database, FileText, Calendar } from 'lucide-react';

import FilterButton, { IFilterButtonItem } from '@/components/base/buttons/filter-button';

const meta: Meta<typeof FilterButton> = {
  title: 'Base/Buttons/Filter Button',
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
    tooltip: 'This includes all forms of cardiovascular disease including coronary artery disease, heart failure, arrhythmias, and hypertension-related conditions.',
    count: 156,
    icon: Users
  },
  { 
    key: 'diabetes_complications', 
    label: 'Diabetes Mellitus Type 2 with Complications and Comorbidities',
    tooltip: 'Type 2 diabetes with various complications such as diabetic nephropathy, retinopathy, neuropathy, and associated cardiovascular risks.',
    count: 89,
    icon: Database
  },
  { 
    key: 'respiratory_conditions', 
    label: 'Chronic Respiratory Conditions Including COPD and Asthma',
    tooltip: 'Chronic obstructive pulmonary disease, asthma, and other long-term respiratory conditions requiring ongoing management.',
    count: 67,
    icon: FileText
  },
  { 
    key: 'neurological_disorders', 
    label: 'Neurological Disorders and Neurodegenerative Conditions',
    tooltip: 'Includes Alzheimer\'s disease, Parkinson\'s disease, multiple sclerosis, and other neurological conditions.',
    count: 34,
    icon: Settings
  },
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
  
  return (
    <FilterButton
      {...props}
      selected={selected}
      onSelect={setSelected}
    />
  );
};

export const WithCheckboxList: Story = {
  render: () => (
    <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Basic Filter with Checkboxes</h3>
      <InteractiveFilterButton
        label="Status"
        options={basicOptions}
        placeholder="Search status..."
        icon={<Filter className="w-4 h-4" />}
      />
    </div>
  ),
};

export const WithLongTextAndTooltips: Story = {
  render: () => (
    <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Long Text with Tooltips</h3>
      <InteractiveFilterButton
        label="Medical Conditions"
        options={longTextOptions}
        placeholder="Search conditions..."
        withTooltip={true}
        icon={<Users className="w-4 h-4" />}
      />
    </div>
  ),
};

export const ActionMode: Story = {
  render: () => (
    <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Action Mode (No Checkboxes)</h3>
      <InteractiveFilterButton
        label="Actions"
        options={actionOptions}
        actionMode={true}
        closeOnSelect={true}
        placeholder="Search actions..."
        icon={<Settings className="w-4 h-4" />}
      />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="p-4 space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Basic Filter with Checkboxes</h3>
        <InteractiveFilterButton
          label="Status"
          options={basicOptions}
          placeholder="Search status..."
          icon={<Filter className="w-4 h-4" />}
        />
      </div>
      
      <div>
        <h3 className="mb-4 text-lg font-semibold">Long Text with Tooltips</h3>
        <InteractiveFilterButton
          label="Medical Conditions"
          options={longTextOptions}
          placeholder="Search conditions..."
          withTooltip={true}
          icon={<Users className="w-4 h-4" />}
        />
      </div>
      
      <div>
        <h3 className="mb-4 text-lg font-semibold">Action Mode</h3>
        <InteractiveFilterButton
          label="Actions"
          options={actionOptions}
          actionMode={true}
          closeOnSelect={true}
          placeholder="Search actions..."
          icon={<Settings className="w-4 h-4" />}
        />
      </div>
    </div>
  ),
};

export const WithPreselectedItems: Story = {
  render: () => (
    <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">With Preselected Items</h3>
      <InteractiveFilterButton
        label="Status"
        options={basicOptions}
        initialSelected={['option1', 'option3']}
        placeholder="Search status..."
        icon={<Filter className="w-4 h-4" />}
      />
    </div>
  ),
};

export const OpenOnAppear: Story = {
  render: () => (
    <div className="p-4">
      <h3 className="mb-4 text-lg font-semibold">Open on Appear</h3>
      <InteractiveFilterButton
        label="Auto Open"
        options={basicOptions}
        isOpen={true}
        placeholder="Search..."
        icon={<Filter className="w-4 h-4" />}
      />
    </div>
  ),
}; 