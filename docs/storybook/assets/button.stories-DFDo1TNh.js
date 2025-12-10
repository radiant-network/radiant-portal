import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{f as j}from"./index-DPYJpPba.js";import{B as i}from"./button-DlQhM6NA.js";import{b as o,a as m}from"./utils-DT0TDhH2.js";import{C as B}from"./dropdown-menu-CvT4td-4.js";import"./index-C-d7IIsQ.js";import"./index-CBYaBgW8.js";import"./index-Dy6y0jaD.js";import"./action-button-B61IoBol.js";import"./separator-ChZWIdMg.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./utils-CDN07tui.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./createLucideIcon-B119WVF5.js";import"./spinner-D7tBPZCQ.js";import"./tooltip-B_PdrVRJ.js";import"./index-D9mtqW9-.js";import"./index-BdYz8WOz.js";import"./index-DnEzm5An.js";import"./index-D6ay35fe.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfXWnpL9.js";import"./i18n-BYhOn5Ro.js";import"./iframe-CTdhkTz1.js";import"./i18next-CYn7LYXT.js";import"./check-DSe_yRo5.js";import"./index-BCzuw4Jg.js";import"./Combination-DPhcPU0m.js";const Z={title:"Buttons/Button",component:i,argTypes:{size:{options:o,control:{type:"select"}}},args:{onClick:j(),loading:!1,disabled:!1,iconOnly:!1}},a={args:{},render:()=>t.jsx("div",{className:"flex flex-col items-start gap-2",children:m.map(r=>t.jsx("div",{className:"flex gap-2 items-center",children:o.map(e=>t.jsxs(i,{size:e,variant:r,children:["Button ",e]},e))},r))})},s={args:{iconOnly:!0},render:r=>t.jsx("div",{className:"flex flex-col items-start gap-2",children:m.map(e=>t.jsx("div",{className:"flex gap-2 items-center",children:o.map(p=>t.jsx(i,{size:p,variant:e,...r,children:t.jsx(B,{})},p))},e))})},n={args:{},render:()=>t.jsx("div",{className:"flex flex-col items-start gap-2",children:m.map(r=>t.jsx("div",{className:"flex gap-2 items-center",children:o.map(e=>t.jsxs(i,{size:e,variant:r,children:[t.jsx(B,{}),"Button ",e]},e))},r))})};var c,l,d;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(z=(g=n.parameters)==null?void 0:g.docs)==null?void 0:z.source}}};const $=["Variants","IconOnly","IconAndText"];export{n as IconAndText,s as IconOnly,a as Variants,$ as __namedExportsOrder,Z as default};
