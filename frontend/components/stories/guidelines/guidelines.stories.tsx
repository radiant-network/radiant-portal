import type { ReactNode } from 'react';
import type { StoryObj } from '@storybook/react-vite';
import { CheckIcon, TriangleAlert, XIcon } from 'lucide-react';

import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/components/base/shadcn/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/base/shadcn/tooltip';

import { StorySection, StoryShowcase } from '../story-section';

type GuidelineExample = {
  kind: 'do' | 'dont';
  content: ReactNode;
};

type Guideline = {
  rule: string;
  description?: string;
  examples?: GuidelineExample[];
};

type GuidelineCategory = {
  title: string;
  description?: string;
  guidelines: Guideline[];
};

const NUMBERS = ['0.500', '12.00', '1,820,627'];

/**
 * Guidelines shown on this page, grouped by category.
 *
 * To add a rule, copy an entry into the `guidelines` list of a category:
 *
 *   {
 *     rule: 'The rule, in one sentence.',
 *     description: 'Optional explanation.',
 *     examples: [
 *       { kind: 'do', content: 'What to write' },
 *       { kind: 'dont', content: 'What to avoid' },
 *     ],
 *   },
 *
 * `description` and `examples` are optional, and an example can be a "do" alone.
 * For a live tooltip example, use `content: <TooltipExample label="MRN" tooltip="Medical record number" />`.
 * To add a category, copy a whole `{ title, description, guidelines }` block.
 * Remove the "Placeholder" descriptions once the real content is in.
 */
const GUIDELINES: GuidelineCategory[] = [
  {
    title: 'Text & capitalization',
    description: 'Placeholder — to be provided by the design and analysis teams.',
    guidelines: [
      {
        rule: 'Capitalize each word of a column header in English, not in French.',
        examples: [
          { kind: 'do', content: 'Created On · Créé le' },
          { kind: 'dont', content: 'Created on · Créé Le' },
        ],
      },
      {
        rule: 'A tooltip never ends with a period.',
        description: 'For longer content (several sentences, links or actions), use a hover card instead.',
        examples: [
          { kind: 'do', content: <TooltipExample label="MRN" tooltip="Medical record number" /> },
          { kind: 'dont', content: <TooltipExample label="MRN" tooltip="Medical record number." /> },
        ],
      },
    ],
  },
  {
    title: 'Abbreviations & acronyms',
    description: 'Placeholder — to be provided by the design and analysis teams.',
    guidelines: [
      {
        rule: 'An abbreviation or an acronym always has a tooltip with its full form.',
        examples: [
          {
            kind: 'do',
            content: <TooltipExample label="MRN" tooltip="Medical record number" />,
          },
          { kind: 'dont', content: 'MRN' },
        ],
      },
    ],
  },
  {
    title: 'Numbers & data',
    description: 'Placeholder — to be provided by the design and analysis teams.',
    guidelines: [
      {
        rule: 'Numbers use a monospaced font in table columns, so digits line up.',
        examples: [
          { kind: 'do', content: <NumberColumn className="font-mono" /> },
          { kind: 'dont', content: <NumberColumn /> },
        ],
      },
    ],
  },
];

const meta = {
  title: 'Foundations/Guidelines',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Guidelines: Story = {
  render: () => (
    <StoryShowcase>
      <Alert variant="warning" className="w-full">
        <AlertIcon>
          <TriangleAlert />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Draft</AlertTitle>
          <AlertDescription>
            These guidelines are placeholders. Their content will be provided by the design and analysis teams.
          </AlertDescription>
        </AlertContent>
      </Alert>
      {GUIDELINES.map(category => (
        <StorySection key={category.title} title={category.title} description={category.description}>
          <div className="flex flex-col gap-4 w-full">
            {category.guidelines.map(guideline => (
              <GuidelineCard key={guideline.rule} guideline={guideline} />
            ))}
          </div>
        </StorySection>
      ))}
    </StoryShowcase>
  ),
};

function GuidelineCard({ guideline }: { guideline: Guideline }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{guideline.rule}</CardTitle>
        {guideline.description && <CardDescription>{guideline.description}</CardDescription>}
      </CardHeader>
      {guideline.examples && (
        <CardContent className="grid grid-cols-2 gap-4">
          {guideline.examples.map(example => (
            <GuidelineExampleBlock key={example.kind} example={example} />
          ))}
        </CardContent>
      )}
    </Card>
  );
}

function GuidelineExampleBlock({ example }: { example: GuidelineExample }) {
  const isDo = example.kind === 'do';
  return (
    <div className="flex flex-col gap-2 rounded-md border p-3">
      <span
        className={`flex items-center gap-1 text-sm font-medium ${isDo ? 'text-alert-success-foreground' : 'text-destructive'}`}
      >
        {isDo ? <CheckIcon size={16} /> : <XIcon size={16} />}
        {isDo ? 'Do' : "Don't"}
      </span>
      <div className="text-sm">{example.content}</div>
    </div>
  );
}

function TooltipExample({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="underline decoration-dotted underline-offset-4">{label}</span>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

function NumberColumn({ className }: { className?: string }) {
  return (
    <div className={`flex flex-col items-end w-24 ${className ?? ''}`}>
      {NUMBERS.map(value => (
        <span key={value}>{value}</span>
      ))}
    </div>
  );
}
