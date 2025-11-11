import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{f as j}from"./index-DtL3pAzF.js";import{B as i}from"./button-C2TlSKsA.js";import{b as o,a as m}from"./utils-DT0TDhH2.js";import{C as B}from"./dropdown-menu-CxUCUeqn.js";import"./index-B7CJuYpG.js";import"./index-CGj_12n1.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./action-button-DglMD9AQ.js";import"./utils-D-KgF5mV.js";import"./separator-IJKoE26K.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./createLucideIcon-8Lr1oLzj.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-anNhU4TT.js";import"./index-CcLUv2_A.js";import"./index-Ch7hUksi.js";import"./index-CIckazZy.js";import"./index-DceihmLw.js";import"./index-A6VgBoaw.js";import"./index-CRLeYu_h.js";import"./index-BDsjCN7N.js";import"./i18n-kCPFj7LC.js";import"./iframe-BbKbUzYq.js";import"./i18next-DOi7g2fS.js";import"./check-DRc1RmCY.js";import"./index-C8qycyLa.js";import"./Combination-DwMjbv-J.js";const Y={title:"Buttons/Button",component:i,argTypes:{size:{options:o,control:{type:"select"}}},args:{onClick:j(),loading:!1,disabled:!1,iconOnly:!1}},a={args:{},render:()=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:m.map(r=>e.jsx("div",{className:"flex gap-2 items-center",children:o.map(t=>e.jsxs(i,{size:t,variant:r,children:["Button ",t]},t))},r))})},s={args:{iconOnly:!0},render:r=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:m.map(t=>e.jsx("div",{className:"flex gap-2 items-center",children:o.map(p=>e.jsx(i,{size:p,variant:t,...r,children:e.jsx(B,{})},p))},t))})},n={args:{},render:()=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:m.map(r=>e.jsx("div",{className:"flex gap-2 items-center",children:o.map(t=>e.jsxs(i,{size:t,variant:r,children:[e.jsx(B,{}),"Button ",t]},t))},r))})};var c,l,d;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
