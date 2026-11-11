import type { Meta, StoryObj } from '@storybook/react-vite';
import { House, ShoppingBag, Truck } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/base/shadcn/accordion';
import { Badge } from '@/components/base/shadcn/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/base/shadcn/card';

import { StoryLabel, StorySection, StoryShowcase } from '../story-section';

const items = [
  { value: 'accessible', question: 'Is it accessible?', answer: 'Yes. It adheres to the WAI-ARIA design pattern.' },
  { value: 'styled', question: 'Is it styled?', answer: 'Yes. It comes with default styles from our design system.' },
  {
    value: 'animated',
    question: 'Is it animated?',
    answer: 'Yes. It uses the accordion-up / accordion-down keyframes.',
  },
];

const faq = [
  {
    value: 'plans',
    question: 'What subscription plans do you offer?',
    answer:
      'We offer three subscription tiers: Starter ($9/month), Professional ($29/month), and Enterprise ($99/month). Each plan includes increasing storage limits, API access, priority support, and team collaboration features.',
  },
  {
    value: 'billing',
    question: 'How does billing work?',
    answer: 'Plans are billed monthly on the day you subscribed. Annual billing is available with a 20% discount.',
  },
  {
    value: 'cancel',
    question: 'How do I cancel my subscription?',
    answer: 'Cancel any time from your account settings. Your plan stays active until the end of the current period.',
  },
];

const steps = [
  {
    value: 'order',
    label: 'Order Complete',
    icon: ShoppingBag,
    detail: 'Order confirmed on July 5th at 9:12am.',
  },
  {
    value: 'delivery',
    label: 'Out for delivery',
    icon: Truck,
    badge: 'Free',
    detail: 'Handed to the carrier on July 7th at 6:40am.',
  },
  {
    value: 'delivered',
    label: 'Delivered',
    icon: House,
    detail: 'Signed by Adam on July 8th at 2:25pm.',
  },
];

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  args: {
    type: 'single',
    collapsible: true,
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StoryShowcase>
      <StoryShowcase direction="row">
        <StorySection title="Chevron left" description="Default placement — one item open at a time.">
          <Accordion type="single" collapsible defaultValue="accessible" style={{ width: 420 }}>
            {items.map(item => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger>
                  <span className="font-medium">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent style={{ paddingLeft: 24 }}>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </StorySection>
        <StorySection title="Chevron right" description="Chevron pushed to the far right of the trigger.">
          <Accordion type="single" collapsible defaultValue="accessible" style={{ width: 420 }}>
            {items.map(item => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger chevronPlacement="right">
                  <span className="font-medium">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </StorySection>
      </StoryShowcase>
      <StoryShowcase direction="row">
        <StorySection title="Bordered" description="Wrap the accordion in a border and pad the items for a card look.">
          <Accordion
            type="single"
            collapsible
            defaultValue="accessible"
            className="rounded-md border"
            style={{ width: 420 }}
          >
            {items.map(item => (
              <AccordionItem key={item.value} value={item.value} className="px-4 last:border-b-0">
                <AccordionTrigger chevronPlacement="right">
                  <span className="font-medium">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </StorySection>
        <StorySection title="Multiple" description="Several items can stay open at the same time.">
          <Accordion type="multiple" defaultValue={['accessible', 'styled']} style={{ width: 420 }}>
            {items.map(item => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger chevronPlacement="right">
                  <span className="font-medium">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </StorySection>
      </StoryShowcase>
    </StoryShowcase>
  ),
};

export const States: Story = {
  render: () => (
    <StorySection title="States" description="Press Tab to reveal the focus ring — it wraps the whole trigger row.">
      <div className="flex flex-col gap-6" style={{ width: 480 }}>
        <div className="flex flex-col gap-2">
          <StoryLabel>Closed</StoryLabel>
          <Accordion type="single" collapsible>
            <AccordionItem value="trigger">
              <AccordionTrigger chevronPlacement="right">
                <span className="font-medium">Trigger Text</span>
              </AccordionTrigger>
              <AccordionContent>This is an accordion content.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex flex-col gap-2">
          <StoryLabel>Open</StoryLabel>
          <Accordion type="single" collapsible defaultValue="trigger">
            <AccordionItem value="trigger">
              <AccordionTrigger chevronPlacement="right">
                <span className="font-medium">Trigger Text</span>
              </AccordionTrigger>
              <AccordionContent>This is an accordion content.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex flex-col gap-2">
          <StoryLabel>Disabled — closed</StoryLabel>
          <Accordion type="single" collapsible>
            <AccordionItem value="trigger" disabled>
              <AccordionTrigger chevronPlacement="right">
                <span className="font-medium">Trigger Text</span>
              </AccordionTrigger>
              <AccordionContent>This is an accordion content.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex flex-col gap-2">
          <StoryLabel>Disabled — open</StoryLabel>
          <Accordion type="single" collapsible defaultValue="trigger">
            <AccordionItem value="trigger" disabled>
              <AccordionTrigger chevronPlacement="right">
                <span className="font-medium">Trigger Text</span>
              </AccordionTrigger>
              <AccordionContent>This is an accordion content.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </StorySection>
  ),
};

export const Examples: Story = {
  render: () => (
    <StoryShowcase direction="row">
      <StorySection title="In a card" description="FAQ block — the card provides the border, the items only separate.">
        <Card style={{ width: 440 }}>
          <CardHeader>
            <CardTitle>Subscription &amp; Billing</CardTitle>
            <CardDescription>Common questions about your account, plans, payments and cancellations.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue={faq[0].value}>
              {faq.map(item => (
                <AccordionItem key={item.value} value={item.value} className="last:border-b-0">
                  <AccordionTrigger chevronPlacement="right">
                    <span className="font-medium">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pr-8 text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </StorySection>
      <StoryShowcase>
        <StorySection
          title="Custom content"
          description="An icon and a badge next to the label — any node can go in the trigger."
        >
          <Accordion type="single" collapsible defaultValue={steps[2].value} style={{ width: 440 }}>
            {steps.map(step => (
              <AccordionItem key={step.value} value={step.value} className="last:border-b-0">
                <AccordionTrigger>
                  <span className="flex items-center gap-2">
                    <step.icon className="size-4 text-muted-foreground" />
                    <span className="font-medium">{step.label}</span>
                    {step.badge && <Badge variant="green">{step.badge}</Badge>}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground" style={{ paddingLeft: 48 }}>
                  {step.detail}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </StorySection>
        <StorySection
          title="Custom content bordered"
          description="Same items, chevron on the right, inside a bordered container."
        >
          <Accordion
            type="single"
            collapsible
            defaultValue={steps[2].value}
            className="rounded-md border"
            style={{ width: 440 }}
          >
            {steps.map(step => (
              <AccordionItem key={step.value} value={step.value} className="px-4 last:border-b-0">
                <AccordionTrigger chevronPlacement="right" className="py-3">
                  <span className="flex items-center gap-2">
                    <step.icon className="size-4 text-muted-foreground" />
                    <span className="font-medium">{step.label}</span>
                    {step.badge && <Badge variant="green">{step.badge}</Badge>}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-3 text-muted-foreground">{step.detail}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </StorySection>
      </StoryShowcase>
    </StoryShowcase>
  ),
};
