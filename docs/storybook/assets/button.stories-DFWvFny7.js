import{j as a}from"./iframe-X1FdiBKE.js";import{B as n}from"./button-C1dmQasv.js";import{S as o}from"./separator-BcF0hBxw.js";import{a as i,b as r}from"./utils-C8QHPIem.js";import{C as l}from"./circle-C0x1jrVb.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BerhZw8G.js";import"./action-button-D2HkTc1A.js";import"./dropdown-menu-B8dOc9pX.js";import"./index-DnCxSPBU.js";import"./index-DfO9iG95.js";import"./check-CpvZoXR-.js";import"./i18n-DsLlobA0.js";import"./index-BoMd93ow.js";const{fn:c}=__STORYBOOK_MODULE_TEST__,O={title:"Buttons/Button",component:n,argTypes:{size:{options:i,control:{type:"select"}}},args:{onClick:c(),loading:!1,disabled:!1,iconOnly:!1}},s={args:{},render:()=>a.jsx("div",{className:"flex flex-col gap-8",children:a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Text Only"}),r.map(e=>a.jsx("div",{className:"flex gap-2",children:i.map(t=>a.jsxs(n,{size:t,variant:e,children:["Button ",t]},t))},e)),a.jsx(o,{}),a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Icon Only"}),r.map(e=>a.jsx("div",{className:"flex gap-2",children:i.map(t=>a.jsx(n,{size:t,variant:e,iconOnly:!0,children:a.jsx(l,{})},t))},e))]}),a.jsx(o,{}),a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Icon + Text"}),r.map(e=>a.jsx("div",{className:"flex gap-2",children:i.map(t=>a.jsxs(n,{size:t,variant:e,children:[a.jsx(l,{}),"Button ",t]},t))},e))]})]})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="flex flex-col gap-8">
      <div className="flex flex-col items-start gap-2">
        <h2>Text Only</h2>
        {buttonVariants.map(variant => <div key={variant} className="flex gap-2">
            {buttonSizes.map(size => <Button key={size} size={size} variant={variant}>
                Button {size}
              </Button>)}
          </div>)}

        <Separator />
        <div className="flex flex-col items-start gap-2">
          <h2>Icon Only</h2>
          {buttonVariants.map(variant => <div key={variant} className="flex gap-2">
              {buttonSizes.map(size => <Button key={size} size={size} variant={variant} iconOnly>
                  <Circle />
                </Button>)}
            </div>)}
        </div>

        <Separator />
        <div className="flex flex-col items-start gap-2">
          <h2>Icon + Text</h2>
          {buttonVariants.map(variant => <div key={variant} className="flex gap-2">
              {buttonSizes.map(size => <Button key={size} size={size} variant={variant}>
                  <Circle />
                  Button {size}
                </Button>)}
            </div>)}
        </div>
      </div>
    </div>
}`,...s.parameters?.docs?.source}}};const S=["Variants"];export{s as Variants,S as __namedExportsOrder,O as default};
