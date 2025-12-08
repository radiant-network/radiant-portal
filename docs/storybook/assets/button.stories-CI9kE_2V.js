import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{f as j}from"./index-DtL3pAzF.js";import{B as i}from"./button-pZqGUNdw.js";import{b as o,a as m}from"./utils-DT0TDhH2.js";import{C as B}from"./dropdown-menu-BJyjb2OL.js";import"./index-Dut9wsGU.js";import"./index-CBYaBgW8.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./action-button-KkvxmIWD.js";import"./utils-D-KgF5mV.js";import"./separator-B36Ht569.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./createLucideIcon-B119WVF5.js";import"./spinner-CKwzofCp.js";import"./tooltip-BjBxR1Ac.js";import"./index-Ba5mf8A5.js";import"./index-CJAxgcjH.js";import"./index-ycEarWk3.js";import"./index-DrGCp3O6.js";import"./index-BtWW-1ow.js";import"./index-BZEiv_1o.js";import"./index-BiH9rn-5.js";import"./i18n-B3P2cwPv.js";import"./iframe-jZbGSBiH.js";import"./i18next-CYn7LYXT.js";import"./check-DSe_yRo5.js";import"./index-C6lL4ijz.js";import"./Combination-B-dCT06H.js";const Y={title:"Buttons/Button",component:i,argTypes:{size:{options:o,control:{type:"select"}}},args:{onClick:j(),loading:!1,disabled:!1,iconOnly:!1}},a={args:{},render:()=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:m.map(r=>e.jsx("div",{className:"flex gap-2 items-center",children:o.map(t=>e.jsxs(i,{size:t,variant:r,children:["Button ",t]},t))},r))})},s={args:{iconOnly:!0},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:m.map(t=>e.jsx("div",{className:"flex gap-2 items-center",children:o.map(p=>e.jsx(i,{size:p,variant:t,...r,children:e.jsx(B,{})},p))},t))})},n={args:{},render:()=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:m.map(r=>e.jsx("div",{className:"flex gap-2 items-center",children:o.map(t=>e.jsxs(i,{size:t,variant:r,children:[e.jsx(B,{}),"Button ",t]},t))},r))})};var c,l,d;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="flex flex-col items-start gap-2">
      {buttonVariants.map(variant => <div key={variant} className="flex gap-2 items-center">
          {buttonSizes.map(size => <Button key={size} size={size} variant={variant}>
              Button {size}
            </Button>)}
        </div>)}
    </div>
}`,...(d=(l=a.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var x,u,f;s.parameters={...s.parameters,docs:{...(x=s.parameters)==null?void 0:x.docs,source:{originalSource:`{
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
}`,...(f=(u=s.parameters)==null?void 0:u.docs)==null?void 0:f.source}}};var v,g,z;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="flex flex-col items-start gap-2">
      {buttonVariants.map(variant => <div key={variant} className="flex gap-2 items-center">
          {buttonSizes.map(size => <Button key={size} size={size} variant={variant}>
              <Circle />
              Button {size}
            </Button>)}
        </div>)}
    </div>
}`,...(z=(g=n.parameters)==null?void 0:g.docs)==null?void 0:z.source}}};const Z=["Variants","IconOnly","IconAndText"];export{n as IconAndText,s as IconOnly,a as Variants,Z as __namedExportsOrder,Y as default};
