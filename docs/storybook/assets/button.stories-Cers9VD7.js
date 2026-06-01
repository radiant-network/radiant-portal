import{j as a}from"./iframe-fZ1JU2dD.js";import{B as n}from"./button-CeuGaa2_.js";import{S as o}from"./separator-Bt15M7Wt.js";import{a as i,b as r}from"./utils-C8QHPIem.js";import{C as l}from"./circle-DE-7MMSe.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BuixPVmM.js";import"./action-button-DH7rTm7W.js";import"./dropdown-menu-WdkrS53z.js";import"./index-Cuzu6qxP.js";import"./index-Bt1gSSe9.js";import"./check-BCrtbgAX.js";import"./i18n-Cu2AZSyu.js";import"./index-BsMQ4rV8.js";const{fn:c}=__STORYBOOK_MODULE_TEST__,O={title:"Buttons/Button",component:n,argTypes:{size:{options:i,control:{type:"select"}}},args:{onClick:c(),loading:!1,disabled:!1,iconOnly:!1}},s={args:{},render:()=>a.jsx("div",{className:"flex flex-col gap-8",children:a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Text Only"}),r.map(e=>a.jsx("div",{className:"flex gap-2",children:i.map(t=>a.jsxs(n,{size:t,variant:e,children:["Button ",t]},t))},e)),a.jsx(o,{}),a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Icon Only"}),r.map(e=>a.jsx("div",{className:"flex gap-2",children:i.map(t=>a.jsx(n,{size:t,variant:e,iconOnly:!0,children:a.jsx(l,{})},t))},e))]}),a.jsx(o,{}),a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Icon + Text"}),r.map(e=>a.jsx("div",{className:"flex gap-2",children:i.map(t=>a.jsxs(n,{size:t,variant:e,children:[a.jsx(l,{}),"Button ",t]},t))},e))]})]})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
