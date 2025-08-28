import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{f as B}from"./index-B7YJKKKT.js";import{B as i}from"./button-BdUPlXBS.js";import{C as z}from"./dropdown-menu-DBxohyDb.js";import"./index-COcwYKbe.js";import"./index-CGj_12n1.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./action-button-DPhYCDfY.js";import"./utils-D-KgF5mV.js";import"./button.variants-BBQofJia.js";import"./index-C66Dxnp2.js";import"./createLucideIcon-8Lr1oLzj.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-Bh6uXa7k.js";import"./index-CcLUv2_A.js";import"./index-CphM_NEg.js";import"./index-CIckazZy.js";import"./index-CbbSLEvm.js";import"./index-A6VgBoaw.js";import"./index-CKNrATXZ.js";import"./i18n-D85ERcVV.js";import"./iframe-Cqw132xj.js";import"./context-DkqwYzW-.js";import"./check-DRc1RmCY.js";import"./Combination-Bb6GvI2f.js";const m=["default","secondary","destructive","outline","ghost","link"],o=["default","xxs","xs","sm","lg"],Q={title:"Buttons/Button",component:i,argTypes:{size:{options:o,control:{type:"select"}}},args:{onClick:B(),loading:!1,disabled:!1,iconOnly:!1}},a={args:{},render:()=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:m.map(s=>e.jsx("div",{className:"flex gap-2 items-center",children:o.map(t=>e.jsxs(i,{size:t,variant:s,children:["Button ",t]},t))},s))})},r={args:{iconOnly:!0},render:s=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:m.map(t=>e.jsx("div",{className:"flex gap-2 items-center",children:o.map(c=>e.jsx(i,{size:c,variant:t,...s,children:e.jsx(z,{})},c))},t))})},n={args:{},render:()=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:m.map(s=>e.jsx("div",{className:"flex gap-2 items-center",children:o.map(t=>e.jsxs(i,{size:t,variant:s,children:[e.jsx(z,{}),"Button ",t]},t))},s))})};var l,p,d;a.parameters={...a.parameters,docs:{...(l=a.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="flex flex-col items-start gap-2">
      {buttonVariants.map(variant => <div key={variant} className="flex gap-2 items-center">
          {buttonSizes.map(size => <Button key={size} size={size} variant={variant}>
              Button {size}
            </Button>)}
        </div>)}
    </div>
}`,...(d=(p=a.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var u,x,f;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    iconOnly: true
  },
  render: args => <div className="flex flex-col items-start gap-2">
      {buttonVariants.map(variant => <div key={variant} className="flex gap-2 items-center">
          {buttonSizes.map(size => <Button key={size} size={size} variant={variant} {...args}>
              <Circle />
            </Button>)}
        </div>)}
    </div>
}`,...(f=(x=r.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var g,v,y;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="flex flex-col items-start gap-2">
      {buttonVariants.map(variant => <div key={variant} className="flex gap-2 items-center">
          {buttonSizes.map(size => <Button key={size} size={size} variant={variant}>
              <Circle />
              Button {size}
            </Button>)}
        </div>)}
    </div>
}`,...(y=(v=n.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};const U=["Variants","IconOnly","IconAndText"];export{n as IconAndText,r as IconOnly,a as Variants,U as __namedExportsOrder,Q as default};
