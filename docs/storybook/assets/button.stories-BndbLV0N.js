import{j as a}from"./iframe-PdtJhSXY.js";import{B as n}from"./button-mzy4JvA7.js";import{S as l}from"./separator-C4sHZkfj.js";import{a as i,b as r}from"./utils-C8QHPIem.js";import{C as o}from"./circle-DKUFOuM1.js";import"./preload-helper-Dp1pzeXC.js";import"./index-D1R2TbJu.js";import"./action-button-HY7J-v7x.js";import"./dropdown-menu-DVYpbnhw.js";import"./index-ButXuduN.js";import"./check-i2EeU5-5.js";import"./i18n-1P2ubQ09.js";const{fn:x}=__STORYBOOK_MODULE_TEST__,S={title:"Buttons/Button",component:n,argTypes:{size:{options:i,control:{type:"select"}}},args:{onClick:x(),loading:!1,disabled:!1,iconOnly:!1}},t={args:{},render:()=>a.jsx("div",{className:"flex flex-col gap-8",children:a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Text Only"}),r.map(s=>a.jsx("div",{className:"flex gap-2",children:i.map(e=>a.jsxs(n,{size:e,variant:s,children:["Button ",e]},e))},s)),a.jsx(l,{}),a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Icon Only"}),r.map(s=>a.jsx("div",{className:"flex gap-2",children:i.map(e=>a.jsx(n,{size:e,variant:s,iconOnly:!0,children:a.jsx(o,{})},e))},s))]}),a.jsx(l,{}),a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Icon + Text"}),r.map(s=>a.jsx("div",{className:"flex gap-2",children:i.map(e=>a.jsxs(n,{size:e,variant:s,children:[a.jsx(o,{}),"Button ",e]},e))},s))]})]})})};var c,m,p;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(p=(m=t.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};const b=["Variants"];export{t as Variants,b as __namedExportsOrder,S as default};
