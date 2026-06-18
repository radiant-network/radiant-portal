import{d as n,j as e}from"./iframe-pCkdMSW4.js";import{E as r}from"./empty-BGry0-Ov.js";import{a as c}from"./story-section-BWCYvdHs.js";import"./preload-helper-PPVm8Dsz.js";const l=[["path",{d:"m10 16 1.5 1.5",key:"11lckj"}],["path",{d:"m14 8-1.5-1.5",key:"1ohn8i"}],["path",{d:"M15 2c-1.798 1.998-2.518 3.995-2.807 5.993",key:"80uv8i"}],["path",{d:"m16.5 10.5 1 1",key:"696xn5"}],["path",{d:"m17 6-2.891-2.891",key:"xu6p2f"}],["path",{d:"M2 15c6.667-6 13.333 0 20-6",key:"1pyr53"}],["path",{d:"m20 9 .891.891",key:"3xwk7g"}],["path",{d:"M3.109 14.109 4 15",key:"q76aoh"}],["path",{d:"m6.5 12.5 1 1",key:"cs35ky"}],["path",{d:"m7 18 2.891 2.891",key:"1sisit"}],["path",{d:"M9 22c1.798-1.998 2.518-3.995 2.807-5.993",key:"q3hbxp"}]],d=n("dna",l),y={title:"Components/Empty State",component:r,args:{showIcon:!0,bordered:!1},argTypes:{size:{control:{type:"select"},options:["mini","default"]},iconType:{control:{type:"select"},options:["chartRow","chartGrid","custom"]}}},a={args:{title:"Optional Header",description:"No data message",size:"default",iconType:"chartRow"},render:t=>e.jsx(c,{title:"Chart row",children:e.jsx("div",{className:"w-full",children:e.jsx(r,{...t})})})},s={args:{title:"Optional Header",description:"No data message",size:"default",iconType:"chartGrid"},render:t=>e.jsx(c,{title:"Chart grid",children:e.jsx("div",{className:"w-full",children:e.jsx(r,{...t})})})},o={args:{title:"Optional Header",description:"No data message",size:"default",iconType:"custom",icon:d},render:t=>e.jsx(c,{title:"Custom icon",children:e.jsx("div",{className:"w-full",children:e.jsx(r,{...t})})})},i={args:{title:"Optional Header",description:"No data message",size:"default",iconType:"custom",icon:d,bordered:!0},render:t=>e.jsx(c,{title:"With border",children:e.jsx("div",{className:"w-full",children:e.jsx(r,{...t})})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const g=["ChartRow","ChartGrid","CustomIcon","WithBorder"];export{s as ChartGrid,a as ChartRow,o as CustomIcon,i as WithBorder,g as __namedExportsOrder,y as default};
