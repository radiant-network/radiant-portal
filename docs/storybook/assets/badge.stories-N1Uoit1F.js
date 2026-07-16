import{j as e}from"./iframe-CZw1qZGW.js";import{B as t}from"./badge-B_C94BCV.js";import{a as i}from"./story-section-YSzHW9zx.js";import{b as n}from"./utils-D76j_Oop.js";import{U as p}from"./user-CLS0pshj.js";import"./preload-helper-PPVm8Dsz.js";import"./separator-imWwe0EG.js";import"./x-B7FhkScA.js";const{fn:x}=__STORYBOOK_MODULE_TEST__,b={title:"Components/Badges/Badge",component:t,args:{}},o={args:{},render:r=>e.jsx(i,{title:"Variants",children:e.jsx("div",{className:"flex flex-col items-start gap-2",children:n.map((a,s)=>e.jsx(t,{variant:a,...r,children:a},s))})})},c={args:{children:"Badge",onClose:x()},render:r=>e.jsx(i,{title:"Closable",children:e.jsx("div",{className:"flex flex-col items-start gap-2",children:n.map((a,s)=>e.jsx(t,{variant:a,...r,children:a},s))})})},d={args:{children:"Badge",onClick:x()},render:r=>e.jsx(i,{title:"Clickable",children:e.jsx("div",{className:"flex flex-col items-start gap-2",children:n.map((a,s)=>e.jsx(t,{variant:a,...r,children:a},s))})})},l={args:{children:"Badge"},render:r=>e.jsx(i,{title:"With icon",children:e.jsx("div",{className:"flex flex-col items-start gap-2",children:n.map((a,s)=>e.jsxs(t,{variant:a,...r,children:[a," ",e.jsx(p,{})]},s))})})},m={args:{children:"Badge",iconOnly:!0},render:r=>e.jsx(i,{title:"Icon only",children:e.jsx("div",{className:"flex flex-col items-start gap-2",children:n.map((a,s)=>e.jsx(t,{variant:a,...r,children:e.jsx(p,{})},s))})})},g={args:{children:"Badge",count:10},render:r=>e.jsx(i,{title:"With count",children:e.jsx("div",{className:"flex flex-col items-start gap-2",children:n.map((a,s)=>e.jsx(t,{variant:a,...r,children:a},s))})})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {},
  render: args => <StorySection title="Variants">
      <div className="flex flex-col items-start gap-2">
        {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
            {variant}
          </Badge>)}
      </div>
    </StorySection>
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClose: fn()
  },
  render: args => <StorySection title="Closable">
      <div className="flex flex-col items-start gap-2">
        {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
            {variant}
          </Badge>)}
      </div>
    </StorySection>
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    onClick: fn()
  },
  render: args => <StorySection title="Clickable">
      <div className="flex flex-col items-start gap-2">
        {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
            {variant}
          </Badge>)}
      </div>
    </StorySection>
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Badge'
  },
  render: args => <StorySection title="With icon">
      <div className="flex flex-col items-start gap-2">
        {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
            {variant} <User />
          </Badge>)}
      </div>
    </StorySection>
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    iconOnly: true
  },
  render: args => <StorySection title="Icon only">
      <div className="flex flex-col items-start gap-2">
        {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
            <User />
          </Badge>)}
      </div>
    </StorySection>
}`,...m.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Badge',
    count: 10
  },
  render: args => <StorySection title="With count">
      <div className="flex flex-col items-start gap-2">
        {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
            {variant}
          </Badge>)}
      </div>
    </StorySection>
}`,...g.parameters?.docs?.source}}};const C=["Variants","Closable","Clickable","WithIcon","IconOnly","WithCount"];export{d as Clickable,c as Closable,m as IconOnly,o as Variants,g as WithCount,l as WithIcon,C as __namedExportsOrder,b as default};
