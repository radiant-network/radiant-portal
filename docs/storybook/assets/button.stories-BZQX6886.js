import{j as a}from"./iframe-DwZVKEmc.js";import{B as n}from"./button-B4bE3_Fh.js";import{S as o}from"./separator-CxLyQWCL.js";import{a as i,b as r}from"./utils-C8QHPIem.js";import{C as l}from"./circle-BC_dxGpQ.js";import"./preload-helper-Dp1pzeXC.js";import"./index-C1UQ77wj.js";import"./action-button-uSHsiLgL.js";import"./dropdown-menu-DCNbL4UQ.js";import"./index-Chf9uvwf.js";import"./index-D_qo1p9J.js";import"./check-adWPXh5W.js";import"./i18n-P_eepega.js";const{fn:x}=__STORYBOOK_MODULE_TEST__,b={title:"Buttons/Button",component:n,argTypes:{size:{options:i,control:{type:"select"}}},args:{onClick:x(),loading:!1,disabled:!1,iconOnly:!1}},s={args:{},render:()=>a.jsx("div",{className:"flex flex-col gap-8",children:a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Text Only"}),r.map(t=>a.jsx("div",{className:"flex gap-2",children:i.map(e=>a.jsxs(n,{size:e,variant:t,children:["Button ",e]},e))},t)),a.jsx(o,{}),a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Icon Only"}),r.map(t=>a.jsx("div",{className:"flex gap-2",children:i.map(e=>a.jsx(n,{size:e,variant:t,iconOnly:!0,children:a.jsx(l,{})},e))},t))]}),a.jsx(o,{}),a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Icon + Text"}),r.map(t=>a.jsx("div",{className:"flex gap-2",children:i.map(e=>a.jsxs(n,{size:e,variant:t,children:[a.jsx(l,{}),"Button ",e]},e))},t))]})]})})};var c,m,p;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
