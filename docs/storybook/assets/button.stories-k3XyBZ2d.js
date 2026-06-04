import{j as a}from"./iframe-C_PWKKnV.js";import{B as s}from"./button-4T5xrZWi.js";import{S as l}from"./separator-C7JFg-YV.js";import{a as m,b as i}from"./story-section-CfmadKEP.js";import{a as r,b as o}from"./utils-C8QHPIem.js";import{C as c}from"./circle-D7Nufxf-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-uHTs5ds7.js";import"./action-button-BwT2quuH.js";import"./dropdown-menu-CrzQycMh.js";import"./index-DYLnjilj.js";import"./index-DRcjtbHr.js";import"./check-clqCtUO9.js";import"./i18n-4DRFLHh0.js";import"./index-pWOEJb2O.js";const{fn:p}=__STORYBOOK_MODULE_TEST__,O={title:"Components/Buttons/Button",component:s,argTypes:{size:{options:r,control:{type:"select"}}},args:{onClick:p(),loading:!1,disabled:!1,iconOnly:!1}},e={args:{},render:()=>a.jsxs(m,{title:"Variants",children:[a.jsxs("div",{className:"space-y-2",children:[a.jsx(i,{children:"Text only"}),o.map(n=>a.jsx("div",{className:"flex gap-2",children:r.map(t=>a.jsxs(s,{size:t,variant:n,children:["Button ",t]},t))},n))]}),a.jsx(l,{}),a.jsxs("div",{className:"space-y-2",children:[a.jsx(i,{children:"Icon only"}),o.map(n=>a.jsx("div",{className:"flex gap-2",children:r.map(t=>a.jsx(s,{size:t,variant:n,iconOnly:!0,children:a.jsx(c,{})},t))},n))]}),a.jsx(l,{}),a.jsxs("div",{className:"space-y-2",children:[a.jsx(i,{children:"Icon + text"}),o.map(n=>a.jsx("div",{className:"flex gap-2",children:r.map(t=>a.jsxs(s,{size:t,variant:n,children:[a.jsx(c,{}),"Button ",t]},t))},n))]})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...e.parameters?.docs?.source}}};const V=["Variants"];export{e as Variants,V as __namedExportsOrder,O as default};
