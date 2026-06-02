import{j as a}from"./iframe-Cmiex3IG.js";import{B as n}from"./button-DRstk-W3.js";import{S as o}from"./separator-VLxmM7Q3.js";import{a as i,b as r}from"./utils-C8QHPIem.js";import{C as l}from"./circle-CZF_B4Vk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-bnaEmcFS.js";import"./action-button-bPFBQAma.js";import"./dropdown-menu-BUNcBeqG.js";import"./index-OjUxLgF4.js";import"./index-nnPp2JKR.js";import"./check-BHUZAyPW.js";import"./i18n-BtP9BP9x.js";import"./index-QN_ZCD1V.js";const{fn:c}=__STORYBOOK_MODULE_TEST__,O={title:"Buttons/Button",component:n,argTypes:{size:{options:i,control:{type:"select"}}},args:{onClick:c(),loading:!1,disabled:!1,iconOnly:!1}},s={args:{},render:()=>a.jsx("div",{className:"flex flex-col gap-8",children:a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Text Only"}),r.map(e=>a.jsx("div",{className:"flex gap-2",children:i.map(t=>a.jsxs(n,{size:t,variant:e,children:["Button ",t]},t))},e)),a.jsx(o,{}),a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Icon Only"}),r.map(e=>a.jsx("div",{className:"flex gap-2",children:i.map(t=>a.jsx(n,{size:t,variant:e,iconOnly:!0,children:a.jsx(l,{})},t))},e))]}),a.jsx(o,{}),a.jsxs("div",{className:"flex flex-col items-start gap-2",children:[a.jsx("h2",{children:"Icon + Text"}),r.map(e=>a.jsx("div",{className:"flex gap-2",children:i.map(t=>a.jsxs(n,{size:t,variant:e,children:[a.jsx(l,{}),"Button ",t]},t))},e))]})]})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
