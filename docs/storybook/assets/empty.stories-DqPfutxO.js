import{g as d,j as o}from"./iframe-BH3MSqWK.js";import{E as r}from"./empty-VjGjYjlP.js";import"./preload-helper-PPVm8Dsz.js";const c=[["path",{d:"m10 16 1.5 1.5",key:"11lckj"}],["path",{d:"m14 8-1.5-1.5",key:"1ohn8i"}],["path",{d:"M15 2c-1.798 1.998-2.518 3.995-2.807 5.993",key:"80uv8i"}],["path",{d:"m16.5 10.5 1 1",key:"696xn5"}],["path",{d:"m17 6-2.891-2.891",key:"xu6p2f"}],["path",{d:"M2 15c6.667-6 13.333 0 20-6",key:"1pyr53"}],["path",{d:"m20 9 .891.891",key:"3xwk7g"}],["path",{d:"M3.109 14.109 4 15",key:"q76aoh"}],["path",{d:"m6.5 12.5 1 1",key:"cs35ky"}],["path",{d:"m7 18 2.891 2.891",key:"1sisit"}],["path",{d:"M9 22c1.798-1.998 2.518-3.995 2.807-5.993",key:"q3hbxp"}]],i=d("dna",c),l={title:"Empty/Default",component:r,args:{showIcon:!0,bordered:!1},argTypes:{size:{control:{type:"select"},options:["mini","default"]},iconType:{control:{type:"select"},options:["chartRow","chartGrid","custom"]}}},t={args:{title:"Optional Header",description:"No data message",size:"default",iconType:"chartRow"},render:e=>o.jsx(r,{...e})},a={args:{title:"Optional Header",description:"No data message",size:"default",iconType:"chartGrid"},render:e=>o.jsx(r,{...e})},s={args:{title:"Optional Header",description:"No data message",size:"default",iconType:"custom",icon:i},render:e=>o.jsx(r,{...e})},n={args:{title:"Optional Header",description:"No data message",size:"default",iconType:"custom",icon:i,bordered:!0},render:e=>o.jsx(r,{...e})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'chartRow'
  },
  render: args => {
    return <Empty {...args} />;
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'chartGrid'
  },
  render: args => {
    return <Empty {...args} />;
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'custom',
    icon: Dna
  },
  render: args => {
    return <Empty {...args} />;
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Optional Header',
    description: 'No data message',
    size: 'default',
    iconType: 'custom',
    icon: Dna,
    bordered: true
  },
  render: args => {
    return <Empty {...args} />;
  }
}`,...n.parameters?.docs?.source}}};const g=["ChartRow","ChartGrid","CustomIcon","WithBorder"];export{a as ChartGrid,t as ChartRow,s as CustomIcon,n as WithBorder,g as __namedExportsOrder,l as default};
