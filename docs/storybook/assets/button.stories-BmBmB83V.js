import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./separator-BSWu3sd9.js";import{n as i,t as a}from"./circle-Cb6FT6Jx.js";import{n as o,t as s}from"./button-Cn480Lud.js";import{i as c,n as l,t as u}from"./story-section-DVTm6cGm.js";import{n as d,r as f,t as p}from"./utils-BnDNM57u.js";var m,h,g,_,v;function y(){return(y=e((()=>{i(),o(),n(),c(),f(),m=t(),{fn:h}=__STORYBOOK_MODULE_TEST__,g={title:`Components/Buttons/Button`,component:s,argTypes:{size:{options:p,control:{type:`select`}}},args:{onClick:h(),loading:!1,disabled:!1,iconOnly:!1}},_={args:{},render:()=>(0,m.jsxs)(l,{title:`Variants`,children:[(0,m.jsxs)(`div`,{className:`space-y-2`,children:[(0,m.jsx)(u,{children:`Text only`}),d.map(e=>(0,m.jsx)(`div`,{className:`flex gap-2`,children:p.map(t=>(0,m.jsxs)(s,{size:t,variant:e,children:[`Button `,t]},t))},e))]}),(0,m.jsx)(r,{}),(0,m.jsxs)(`div`,{className:`space-y-2`,children:[(0,m.jsx)(u,{children:`Icon only`}),d.map(e=>(0,m.jsx)(`div`,{className:`flex gap-2`,children:p.map(t=>(0,m.jsx)(s,{size:t,variant:e,iconOnly:!0,children:(0,m.jsx)(a,{})},t))},e))]}),(0,m.jsx)(r,{}),(0,m.jsxs)(`div`,{className:`space-y-2`,children:[(0,m.jsx)(u,{children:`Icon + text`}),d.map(e=>(0,m.jsx)(`div`,{className:`flex gap-2`,children:p.map(t=>(0,m.jsxs)(s,{size:t,variant:e,children:[(0,m.jsx)(a,{}),`Button `,t]},t))},e))]})]})},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <StorySection title="Variants">
      <div className="space-y-2">
        <StoryLabel>Text only</StoryLabel>
        {buttonVariants.map(variant => <div key={variant} className="flex gap-2">
            {buttonSizes.map(size => <Button key={size} size={size} variant={variant}>
                Button {size}
              </Button>)}
          </div>)}
      </div>

      <Separator />

      <div className="space-y-2">
        <StoryLabel>Icon only</StoryLabel>
        {buttonVariants.map(variant => <div key={variant} className="flex gap-2">
            {buttonSizes.map(size => <Button key={size} size={size} variant={variant} iconOnly>
                <Circle />
              </Button>)}
          </div>)}
      </div>

      <Separator />

      <div className="space-y-2">
        <StoryLabel>Icon + text</StoryLabel>
        {buttonVariants.map(variant => <div key={variant} className="flex gap-2">
            {buttonSizes.map(size => <Button key={size} size={size} variant={variant}>
                <Circle />
                Button {size}
              </Button>)}
          </div>)}
      </div>
    </StorySection>
}`,..._.parameters?.docs?.source}}},v=[`Variants`]})))()}y();export{_ as Variants,v as __namedExportsOrder,g as default};