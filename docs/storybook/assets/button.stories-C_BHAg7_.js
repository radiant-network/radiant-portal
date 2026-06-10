import{j as a}from"./iframe-iTti_pyP.js";import{B as s}from"./button-cGiv4dYx.js";import{S as l}from"./separator-C80gP3l5.js";import{a as m,b as i}from"./story-section-j7yPxqOK.js";import{a as r,b as o}from"./utils-C8QHPIem.js";import{C as c}from"./circle-S0Ha6SNG.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Da66sVI7.js";import"./action-button-DqTAdIxg.js";import"./dropdown-menu-DjOLwECI.js";import"./index-DWvOSxA9.js";import"./index-gWb2WLOK.js";import"./check-6NEOXGRc.js";import"./i18n-D7u3QZ6s.js";import"./index-DDx7eZJ9.js";const{fn:p}=__STORYBOOK_MODULE_TEST__,O={title:"Components/Buttons/Button",component:s,argTypes:{size:{options:r,control:{type:"select"}}},args:{onClick:p(),loading:!1,disabled:!1,iconOnly:!1}},e={args:{},render:()=>a.jsxs(m,{title:"Variants",children:[a.jsxs("div",{className:"space-y-2",children:[a.jsx(i,{children:"Text only"}),o.map(n=>a.jsx("div",{className:"flex gap-2",children:r.map(t=>a.jsxs(s,{size:t,variant:n,children:["Button ",t]},t))},n))]}),a.jsx(l,{}),a.jsxs("div",{className:"space-y-2",children:[a.jsx(i,{children:"Icon only"}),o.map(n=>a.jsx("div",{className:"flex gap-2",children:r.map(t=>a.jsx(s,{size:t,variant:n,iconOnly:!0,children:a.jsx(c,{})},t))},n))]}),a.jsx(l,{}),a.jsxs("div",{className:"space-y-2",children:[a.jsx(i,{children:"Icon + text"}),o.map(n=>a.jsx("div",{className:"flex gap-2",children:r.map(t=>a.jsxs(s,{size:t,variant:n,children:[a.jsx(c,{}),"Button ",t]},t))},n))]})]})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
