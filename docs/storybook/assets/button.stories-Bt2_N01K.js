import{j as a}from"./iframe-C3tvUR1J.js";import{B as s}from"./button-DBxIrY1M.js";import{S as l}from"./separator-DYKEDePW.js";import{a as m,b as i}from"./story-section-Cml820jU.js";import{a as r,b as o}from"./utils-C8QHPIem.js";import{C as c}from"./circle-B5BEDuQC.js";import"./preload-helper-PPVm8Dsz.js";import"./index-wNbfclQ1.js";import"./action-button-BNzMztdM.js";import"./dropdown-menu-6SkrUZiL.js";import"./index-B_di4gWb.js";import"./index-BQlRfD1v.js";import"./check-Cewv9fI2.js";import"./i18n-sXy_IXHd.js";import"./index-COGJCRuB.js";import"./index-t1n2C8Aq.js";const{fn:p}=__STORYBOOK_MODULE_TEST__,V={title:"Components/Buttons/Button",component:s,argTypes:{size:{options:r,control:{type:"select"}}},args:{onClick:p(),loading:!1,disabled:!1,iconOnly:!1}},e={args:{},render:()=>a.jsxs(m,{title:"Variants",children:[a.jsxs("div",{className:"space-y-2",children:[a.jsx(i,{children:"Text only"}),o.map(n=>a.jsx("div",{className:"flex gap-2",children:r.map(t=>a.jsxs(s,{size:t,variant:n,children:["Button ",t]},t))},n))]}),a.jsx(l,{}),a.jsxs("div",{className:"space-y-2",children:[a.jsx(i,{children:"Icon only"}),o.map(n=>a.jsx("div",{className:"flex gap-2",children:r.map(t=>a.jsx(s,{size:t,variant:n,iconOnly:!0,children:a.jsx(c,{})},t))},n))]}),a.jsx(l,{}),a.jsxs("div",{className:"space-y-2",children:[a.jsx(i,{children:"Icon + text"}),o.map(n=>a.jsx("div",{className:"flex gap-2",children:r.map(t=>a.jsxs(s,{size:t,variant:n,children:[a.jsx(c,{}),"Button ",t]},t))},n))]})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...e.parameters?.docs?.source}}};const _=["Variants"];export{e as Variants,_ as __namedExportsOrder,V as default};
