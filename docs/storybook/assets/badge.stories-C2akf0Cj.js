import{j as e}from"./iframe-fZ1JU2dD.js";import{B as i}from"./badge-_ehbmyEb.js";import{b as t}from"./utils-D76j_Oop.js";import{U as g}from"./user-Ewg3HKc5.js";import"./preload-helper-PPVm8Dsz.js";import"./separator-Bt15M7Wt.js";import"./index-BuixPVmM.js";import"./x-DMxNaVrf.js";const{fn:p}=__STORYBOOK_MODULE_TEST__,N={title:"Badges/Badge",component:i,args:{}},n={args:{},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsx(i,{variant:a,...r,children:a},s))})},d={args:{children:"Badge",onClose:p()},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsx(i,{variant:a,...r,children:a},s))})},c={args:{children:"Badge",onClick:p()},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsx(i,{variant:a,...r,children:a},s))})},o={args:{children:"Badge"},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsxs(i,{variant:a,...r,children:[a," ",e.jsx(g,{})]},s))})},l={args:{children:"Badge",iconOnly:!0},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsx(i,{variant:a,...r,children:e.jsx(g,{})},s))})},m={args:{children:"Badge",count:10},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:t.map((a,s)=>e.jsx(i,{variant:a,...r,children:a},s))})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {},
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...n.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClose: fn()
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClick: fn()
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Badge'
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          {variant} <User />
        </Badge>)}
    </div>
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    iconOnly: true
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          <User />
        </Badge>)}
    </div>
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    count: 10
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
          {variant}
        </Badge>)}
    </div>
}`,...m.parameters?.docs?.source}}};const k=["Variants","Closable","Clickable","WithIcon","IconOnly","WithCount"];export{c as Clickable,d as Closable,l as IconOnly,n as Variants,m as WithCount,o as WithIcon,k as __namedExportsOrder,N as default};
