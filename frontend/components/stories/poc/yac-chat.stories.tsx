import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
// `UDIPalette` itself is not re-exported from the package barrel, so the palette
// shape has to be reached through the config type.
import type { DataPackage, UDIChatConfig } from 'udi-yac';
import { UDIChat } from 'udi-yac';
// The library ships its stylesheet as a separate export — `import 'udi-yac'`
// does not inject it. Pulling it in as a string lets us mount and unmount it on
// demand, which is the whole point of the StylesheetImpact story below.
import yacStylesheet from 'udi-yac/style.css?inline';

import { Badge } from '@/components/base/shadcn/badge';
import { Button } from '@/components/base/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/shadcn/card';
import { Checkbox } from '@/components/base/shadcn/checkbox';
import { Input } from '@/components/base/shadcn/input';
import { Switch } from '@/components/base/shadcn/switch';

import { StorySection, StoryShowcase } from '../story-section';

/**
 * Throwaway spike — evaluating whether the HMS-DBMI `udi-yac` chat component
 * can be embedded in RADIANT. Not part of the design system; delete once the
 * compatibility report is sent.
 *
 * `udi-yac` is declared in package.json on this branch only, so a plain
 * `npm install` is enough to run it. This branch must never be merged.
 */

/** Adds YAC's stylesheet to <head> while `enabled`, and removes it after. */
function useYacStylesheet(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const el = document.createElement('style');
    el.dataset.yacPoc = 'true';
    el.textContent = yacStylesheet;
    document.head.append(el);
    return () => el.remove();
  }, [enabled]);
}

const dataPackage: DataPackage = {
  'udi:path': 'https://yac-poc.invalid/data/',
  resources: [
    {
      name: 'patients',
      path: 'patients.csv',
      'udi:row_count': 6,
      schema: {
        fields: [
          { name: 'patient_id', type: 'string' },
          { name: 'age_at_encounter', type: 'integer' },
          { name: 'sex', type: 'string' },
          { name: 'diagnosis', type: 'string' },
        ],
        primaryKey: ['patient_id'],
      },
    },
  ],
};

const patientsCsv = [
  'patient_id,age_at_encounter,sex,diagnosis',
  'P001,7,F,Leukemia',
  'P002,12,M,Leukemia',
  'P003,3,F,Neuroblastoma',
  'P004,15,M,Sarcoma',
  'P005,9,F,Sarcoma',
  'P006,11,M,Neuroblastoma',
].join('\n');

const handlers = [
  http.get(
    'https://yac-poc.invalid/data/patients.csv',
    () => new HttpResponse(patientsCsv, { headers: { 'Content-Type': 'text/csv' } }),
  ),
  // `apiBaseUrl` below is '/api/yac', and the chat calls GET {apiBaseUrl}/v1/yac/examples
  // on mount. Stubbed to an empty list so the spike produces no stray 404.
  http.get('/api/yac/v1/yac/examples', () => HttpResponse.json([])),
];

/**
 * A UDI grammar spec, the format YAC's agent emits and its Vue renderer consumes.
 * Shape taken from their own `dashboardStore.test.ts` fixture: a source, plus a
 * representation with a mark and one mapping per visual encoding.
 */
const udiGrammarSpec = {
  source: { name: 'patients', source: 'patients.csv' },
  representation: {
    mark: 'point',
    mapping: [
      { encoding: 'x', field: 'age_at_encounter', type: 'quantitative' },
      { encoding: 'y', field: 'diagnosis', type: 'nominal' },
      { encoding: 'color', field: 'sex', type: 'nominal' },
    ],
  },
};

/**
 * `POST /v1/yac/completions` is a plain JSON request/response — no streaming —
 * returning a list of tool calls. `RenderVisualization` carries the grammar spec
 * as a JSON *string*, which their ToolCallRenderer parses and hands to the Vue
 * custom element. Stubbing it is what lets us prove the Vue bridge renders a real
 * chart inside our Storybook, with no agent and no LLM key.
 */
const completionsHandler = http.post('/api/yac/v1/yac/completions', () =>
  HttpResponse.json([
    {
      name: 'RenderVisualization',
      arguments: {
        title: 'Age at encounter by diagnosis',
        spec: JSON.stringify(udiGrammarSpec),
      },
    },
  ]),
);

const meta: Meta = {
  title: 'POC/YAC Chat',
  parameters: {
    layout: 'fullscreen',
    msw: { handlers },
  },
};

export default meta;

/**
 * Does the component mount at all inside our Storybook, and what does it look
 * like next to our design system?
 *
 * The height is an inline style, not `h-[600px]`: `themes/tailwind.base.css`
 * does not scan `components/stories/`, so an arbitrary utility would never be
 * generated and the chat would silently collapse to zero height.
 */
function MountedDemo({ palette }: { palette?: NonNullable<UDIChatConfig['palette']> }) {
  useYacStylesheet(true);
  return (
    <div style={{ height: 600 }}>
      <UDIChat apiBaseUrl="/api/yac" dataPackage={dataPackage} requireApiKey={false} palette={palette} />
    </div>
  );
}

/**
 * Feeds our own `--chart-*` tokens into YAC's `palette` prop.
 *
 * The values must be *resolved* strings: Vega writes them straight onto SVG
 * attributes, where a `var(--chart-1)` reference would not resolve (the same
 * constraint our Plotly charts already live with). Re-reads on every class
 * change of <html> so switching the Storybook theme repaints the chart with
 * radiant's dark-mode chart colors.
 */
function useRadiantChartPalette(): NonNullable<UDIChatConfig['palette']> {
  const [category, setCategory] = useState<string[]>([]);

  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      setCategory([1, 2, 3, 4, 5].map(i => cs.getPropertyValue(`--chart-${i}`).trim()).filter(Boolean));
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return { category, mark: category[0] };
}

export const Mounted: StoryObj = {
  render: () => <MountedDemo />,
};

/**
 * The question that decides the integration: YAC's utility classes are not
 * prefixed and its Tailwind preflight is global, so loading its stylesheet may
 * restyle *our* components. Toggle `yacStylesheetLoaded` and diff the two
 * states — anything that moves is a regression to report upstream.
 */
function StylesheetImpactDemo({ yacStylesheetLoaded }: { yacStylesheetLoaded: boolean }) {
  useYacStylesheet(yacStylesheetLoaded);
  return (
    <div className="p-6">
      <StoryShowcase>
        <StorySection
          title={yacStylesheetLoaded ? 'With the YAC stylesheet' : 'Baseline (no YAC stylesheet)'}
          description="Our components only. Any difference between the two states is caused by YAC's global CSS."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Badge>Badge</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Input placeholder="Input" className="w-48" />
            <label className="flex items-center gap-2">
              <Checkbox defaultChecked /> Checkbox
            </label>
            <label className="flex items-center gap-2">
              <Switch defaultChecked /> Switch
            </label>
          </div>
          <Card className="w-80">
            <CardHeader>
              <CardTitle>Card</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Spacing, borders and typography — this is where a global preflight shows up.
            </CardContent>
          </Card>
        </StorySection>
      </StoryShowcase>
    </div>
  );
}

export const StylesheetImpact: StoryObj<{ yacStylesheetLoaded: boolean }> = {
  args: { yacStylesheetLoaded: false },
  argTypes: { yacStylesheetLoaded: { control: 'boolean' } },
  render: ({ yacStylesheetLoaded }) => <StylesheetImpactDemo yacStylesheetLoaded={yacStylesheetLoaded} />,
};

/**
 * The structural question: does YAC's Vue-based renderer actually paint a chart
 * inside a React tree in our app? Ask anything in the input — the stubbed agent
 * always answers with the same visualization — and a Vega chart should appear,
 * rendered by the `<udi-vis>` Vue custom element.
 */
export const ChartFromStubbedAgent: StoryObj = {
  parameters: { msw: { handlers: [...handlers, completionsHandler] } },
  render: () => <MountedDemo />,
};

/**
 * Same stubbed chart, but painted with radiant's `--chart-*` tokens instead of
 * YAC's default orange/teal — and re-read on theme change. Ask anything, then
 * flip the Storybook theme toolbar to check both the palette and how YAC's own
 * chrome (axes, legend, card) holds up in dark mode.
 */
function ThemedPaletteDemo() {
  const palette = useRadiantChartPalette();
  return <MountedDemo palette={palette} />;
}

export const ThemedPalette: StoryObj = {
  parameters: { msw: { handlers: [...handlers, completionsHandler] } },
  render: () => <ThemedPaletteDemo />,
};
