import{j as e}from"./iframe-Bl6A8JHh.js";import{E as t}from"./empty-0gPqykEM.js";import{a as c}from"./story-section-Buu6OzgL.js";import{D as d}from"./dna-C90stF_-.js";import"./preload-helper-PPVm8Dsz.js";const g={title:"Components/Empty State",component:t,args:{showIcon:!0,bordered:!1},argTypes:{size:{control:{type:"select"},options:["mini","default"]},iconType:{control:{type:"select"},options:["chartRow","chartGrid","custom"]}}},a={args:{title:"Optional Header",description:"No data message",size:"default",iconType:"chartRow"},render:r=>e.jsx(c,{title:"Chart row",children:e.jsx("div",{className:"w-full",children:e.jsx(t,{...r})})})},s={args:{title:"Optional Header",description:"No data message",size:"default",iconType:"chartGrid"},render:r=>e.jsx(c,{title:"Chart grid",children:e.jsx("div",{className:"w-full",children:e.jsx(t,{...r})})})},o={args:{title:"Optional Header",description:"No data message",size:"default",iconType:"custom",icon:d},render:r=>e.jsx(c,{title:"Custom icon",children:e.jsx("div",{className:"w-full",children:e.jsx(t,{...r})})})},i={args:{title:"Optional Header",description:"No data message",size:"default",iconType:"custom",icon:d,bordered:!0},render:r=>e.jsx(c,{title:"With border",children:e.jsx("div",{className:"w-full",children:e.jsx(t,{...r})})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'chartRow'
  },
  render: args => <StorySection title="Chart row">
      <div className="w-full">
        <Empty {...args} />
      </div>
    </StorySection>
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'chartGrid'
  },
  render: args => <StorySection title="Chart grid">
      <div className="w-full">
        <Empty {...args} />
      </div>
    </StorySection>
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'custom',
    icon: Dna
  },
  render: args => <StorySection title="Custom icon">
      <div className="w-full">
        <Empty {...args} />
      </div>
    </StorySection>
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'custom',
    icon: Dna,
    bordered: true
  },
  render: args => <StorySection title="With border">
      <div className="w-full">
        <Empty {...args} />
      </div>
    </StorySection>
}`,...i.parameters?.docs?.source}}};const h=["ChartRow","ChartGrid","CustomIcon","WithBorder"];export{s as ChartGrid,a as ChartRow,o as CustomIcon,i as WithBorder,h as __namedExportsOrder,g as default};
