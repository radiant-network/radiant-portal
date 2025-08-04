import type { Meta, StoryObj } from '@storybook/react';

import ElementOperatorIcon from '@/components/base/icons/element-operator-icon';
import EqualOperatorIcon from '@/components/base/icons/equal-operator-icon';
import GreaterThanOperatorIcon from '@/components/base/icons/greater-than-operator-icon';
import GreaterThanOrEqualOperatorIcon from '@/components/base/icons/greater-than-or-equal-operator-icon';
import LessThanOperatorIcon from '@/components/base/icons/less-than-operator-icon';
import LessThanOrEqualOperatorIcon from '@/components/base/icons/less-than-or-equal-operator-icon';
import NotInOperatorIcon from '@/components/base/icons/not-in-operator-icon';

import { IconType } from '@/components/base/icons/types';
import TranscriptCanonicalIcon from '@/components/base/icons/transcript-canonical-icon';
import TranscriptManePlusIcon from '@/components/base/icons/transcript-mane-plus-icon';
import TranscriptManeSelectIcon from '@/components/base/icons/transcript-mane-select-icon';
import ShapeTriangleUpIcon from '@/components/base/icons/shape-triangle-up-icon';
import ShapeTriangleDownIcon from '@/components/base/icons/shape-triangle-down-icon';
import ShapeCircleIcon from '@/components/base/icons/shape-circle-icon';
import ShapeDonutIcon from '@/components/base/icons/shape-donut-icon';
import ShapeSquareIcon from '@/components/base/icons/shape-square-icon';
import PedigreeMaleAffectedIcon from '@/components/base/icons/pedigree-male-affected-icon';
import PedigreeMaleCarrierIcon from '@/components/base/icons/pedigree-male-carrier-icon';
import PedigreeMaleDeceasedIcon from '@/components/base/icons/pedigree-male-deceased-icon';
import PedigreeMaleNotAffectedIcon from '@/components/base/icons/pedigree-male-not-affected-icon';
import PedigreeMaleProbandIcon from '@/components/base/icons/pedigree-male-proband-icon';
import PedigreeUnknownAffectedIcon from '@/components/base/icons/pedigree-unknown-affected-icon';
import PedigreeUnknownCarrierIcon from '@/components/base/icons/pedigree-unknown-carrier-icon';
import PedigreeUnknownDeceasedIcon from '@/components/base/icons/pedigree-unknown-deceased-icon';
import PedigreeUnknownNotAffectedIcon from '@/components/base/icons/pedigree-unknown-not-affected-icon';
import PedigreeUnknownProbandIcon from '@/components/base/icons/pedigree-unknown-proband-icon';
import PedigreeFemaleAffectedIcon from '@/components/base/icons/pedigree-female-affected-icon';
import PedigreeFemaleCarrierIcon from '@/components/base/icons/pedigree-female-carrier-icon';
import PedigreeFemaleDeceasedIcon from '@/components/base/icons/pedigree-female-deceased-icon';
import PedigreeFemaleNotAffectedIcon from '@/components/base/icons/pedigree-female-not-affected-icon';
import PedigreeFemaleProbandIcon from '@/components/base/icons/pedigree-female-proband-icon';

const meta = {
  title: 'Icons/Lucide',
  component: ElementOperatorIcon,
  args: {
    size: 24,
    fill: 'currentColor',
    className: 'shrink-0',
  },
} satisfies Meta<typeof ElementOperatorIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: args => (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-xl">Icons:</h1>
        <div>
          We use Lucide Icons:{' '}
          <a href="https://lucide.dev/icons/" target="_blank" className="text-primary underline hover:no-underline">
            https://lucide.dev/icons/
          </a>
        </div>
      </div>
      <h1 className="font-bold text-xl">Operators:</h1>
      <div className="grid grid-cols-12 gap-2">
        <IconDisplay icon={ElementOperatorIcon} title="Element" args={args} />
        <IconDisplay icon={EqualOperatorIcon} title="Equal" args={args} />
        <IconDisplay icon={GreaterThanOperatorIcon} title="Greater Than" args={args} />
        <IconDisplay icon={GreaterThanOrEqualOperatorIcon} title="Grater Than Or Equal" args={args} />
        <IconDisplay icon={LessThanOperatorIcon} title="Less Than" args={args} />
        <IconDisplay icon={LessThanOrEqualOperatorIcon} title="Less Than Or Equal" args={args} />
        <IconDisplay icon={NotInOperatorIcon} title="Not In" args={args} />
      </div>
      <h1 className="font-bold text-xl">Shapes:</h1>
      <div className="grid grid-cols-12 gap-2">
        <IconDisplay icon={ShapeTriangleUpIcon} title="Triangle Up" args={args} />
        <IconDisplay icon={ShapeTriangleDownIcon} title="Triangle Down" args={args} />
        <IconDisplay icon={ShapeCircleIcon} title="Circle" args={args} />
        <IconDisplay icon={ShapeDonutIcon} title="Donut" args={args} />
        <IconDisplay icon={ShapeSquareIcon} title="Square" args={args} />
      </div>
      <h1 className="font-bold text-xl">Transcript:</h1>
      <div className="grid grid-cols-12 gap-2">
        <IconDisplay icon={TranscriptCanonicalIcon} title="Canonical" args={args} />
        <IconDisplay icon={TranscriptManePlusIcon} title="Mane Plus" args={args} />
        <IconDisplay icon={TranscriptManeSelectIcon} title="Mane Select" args={args} />
      </div>
      <h1 className="font-bold text-xl">Pedigree:</h1>
      <div className="grid grid-cols-12 gap-2">
        <IconDisplay icon={PedigreeMaleAffectedIcon} title="Male Affected" args={args} />
        <IconDisplay icon={PedigreeMaleNotAffectedIcon} title="Male Not Affected" args={args} />
        <IconDisplay icon={PedigreeMaleCarrierIcon} title="Male Carrier" args={args} />
        <IconDisplay icon={PedigreeMaleDeceasedIcon} title="Male Deceased" args={args} />
        <IconDisplay icon={PedigreeMaleProbandIcon} title="Male Proband" args={args} />
      </div>
      <div className="grid grid-cols-12 gap-2">
        <IconDisplay icon={PedigreeFemaleAffectedIcon} title="Female Affected" args={args} />
        <IconDisplay icon={PedigreeFemaleNotAffectedIcon} title="Female Not Affected" args={args} />
        <IconDisplay icon={PedigreeFemaleCarrierIcon} title="Female Carrier" args={args} />
        <IconDisplay icon={PedigreeFemaleDeceasedIcon} title="Female Deceased" args={args} />
        <IconDisplay icon={PedigreeFemaleProbandIcon} title="Female Proband" args={args} />
      </div>
      <div className="grid grid-cols-12 gap-2">
        <IconDisplay icon={PedigreeUnknownAffectedIcon} title="Unknown Affected" args={args} />
        <IconDisplay icon={PedigreeUnknownNotAffectedIcon} title="Unknown Not Affected" args={args} />
        <IconDisplay icon={PedigreeUnknownCarrierIcon} title="Unknown Carrier" args={args} />
        <IconDisplay icon={PedigreeUnknownDeceasedIcon} title="Unknown Deceased" args={args} />
        <IconDisplay icon={PedigreeUnknownProbandIcon} title="Unknown Proband" args={args} />
      </div>
    </div>
  ),
};

const IconDisplay = ({ icon: Icon, title, args }: { icon: any; title: string; args: IconType }) => {
  return (
    <div className="flex flex-col gap-1 items-center">
      <Icon {...args} />
      <div className="text-xs text-center">{title}</div>
    </div>
  );
};
