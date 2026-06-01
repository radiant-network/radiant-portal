import{j as a}from"./iframe-Dazgu-xC.js";import{B as n}from"./button-8J658wd4.js";import{S as o}from"./separator-uwq_OMO5.js";import{a as i,b as r}from"./utils-C8QHPIem.js";import{C as l}from"./circle-CZgbCMc1.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Aj7YrDzF.js";import"./action-button-BfMVkXo8.js";import"./dropdown-menu-CUwMNzYL.js";import"./index-DQ2PnqWf.js";import"./index-6Lx37dYF.js";import"./check-CzryUxBS.js";import"./i18n-CWqrHIWh.js";const{fn:x}=__STORYBOOK_MODULE_TEST__,b={title:"Buttons/Button",component:n,argTypes:{size:{options:i,control:{type:"select"}}},args:{onClick:x(),loading:!1,disabled:!1,iconOnly:!1}},s={args:{},render:()=>a.jsx("div",{className:"flex flex-col gap-8",children:a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Text Only"}),r.map(t=>a.jsx("div",{className:"flex gap-2",children:i.map(e=>a.jsxs(n,{size:e,variant:t,children:["Button ",e]},e))},t)),a.jsx(o,{}),a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Icon Only"}),r.map(t=>a.jsx("div",{className:"flex gap-2",children:i.map(e=>a.jsx(n,{size:e,variant:t,iconOnly:!0,children:a.jsx(l,{})},e))},t))]}),a.jsx(o,{}),a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Icon + Text"}),r.map(t=>a.jsx("div",{className:"flex gap-2",children:i.map(e=>a.jsxs(n,{size:e,variant:t,children:[a.jsx(l,{}),"Button ",e]},e))},t))]})]})})};var c,m,p;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(p=(m=s.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};const T=["Variants"];export{s as Variants,T as __namedExportsOrder,b as default};
