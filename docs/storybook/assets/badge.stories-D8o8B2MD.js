import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./user-kCV1wli6.js";import{i,n as a}from"./story-section-DVTm6cGm.js";import{n as o,t as s}from"./badge-BnbeGwIF.js";import{r as c,t as l}from"./utils-YvdnXddI.js";var u,d,f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{n(),o(),i(),c(),u=t(),{fn:d}=__STORYBOOK_MODULE_TEST__,f={title:`Components/Badges/Badge`,component:s,args:{}},p={args:{},render:e=>(0,u.jsx)(a,{title:`Variants`,children:(0,u.jsx)(`div`,{className:`flex flex-col items-start gap-2`,children:l.map((t,n)=>(0,u.jsx)(s,{variant:t,...e,children:t},n))})})},m={args:{children:`Badge`,onClose:d()},render:e=>(0,u.jsx)(a,{title:`Closable`,children:(0,u.jsx)(`div`,{className:`flex flex-col items-start gap-2`,children:l.map((t,n)=>(0,u.jsx)(s,{variant:t,...e,children:t},n))})})},h={args:{children:`Badge`,onClick:d()},render:e=>(0,u.jsx)(a,{title:`Clickable`,children:(0,u.jsx)(`div`,{className:`flex flex-col items-start gap-2`,children:l.map((t,n)=>(0,u.jsx)(s,{variant:t,...e,children:t},n))})})},g={args:{children:`Badge`},render:e=>(0,u.jsx)(a,{title:`With icon`,children:(0,u.jsx)(`div`,{className:`flex flex-col items-start gap-2`,children:l.map((t,n)=>(0,u.jsxs)(s,{variant:t,...e,children:[t,` `,(0,u.jsx)(r,{})]},n))})})},_={args:{children:`Badge`,iconOnly:!0},render:e=>(0,u.jsx)(a,{title:`Icon only`,children:(0,u.jsx)(`div`,{className:`flex flex-col items-start gap-2`,children:l.map((t,n)=>(0,u.jsx)(s,{variant:t,...e,children:(0,u.jsx)(r,{})},n))})})},v={args:{children:`Badge`,count:10},render:e=>(0,u.jsx)(a,{title:`With count`,children:(0,u.jsx)(`div`,{className:`flex flex-col items-start gap-2`,children:l.map((t,n)=>(0,u.jsx)(s,{variant:t,...e,children:t},n))})})},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {},
  render: args => <StorySection title="Variants">
      <div className="flex flex-col items-start gap-2">
        {badgeVariants.map((variant, index) => <Badge key={index} variant={variant} {...args}>
            {variant}
          </Badge>)}
      </div>
    </StorySection>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
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
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
}`,...v.parameters?.docs?.source}}},y=[`Variants`,`Closable`,`Clickable`,`WithIcon`,`IconOnly`,`WithCount`]})))()}b();export{h as Clickable,m as Closable,_ as IconOnly,p as Variants,v as WithCount,g as WithIcon,y as __namedExportsOrder,f as default};