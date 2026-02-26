import{j as e}from"./iframe-CxSY7Paf.js";import{B as i}from"./button-CQwjPxub.js";import{b as o,a as c}from"./utils-DT0TDhH2.js";import{C as z}from"./circle-BRvajDZy.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Cw83H7Iw.js";import"./action-button-C6pJwfjO.js";import"./dropdown-menu-7KW9uYmU.js";import"./index-w7TOK4tZ.js";import"./check-DpHxaibB.js";import"./separator-Co05gwko.js";import"./i18n-BFt0O6_s.js";const{fn:j}=__STORYBOOK_MODULE_TEST__,I={title:"Buttons/Button",component:i,argTypes:{size:{options:o,control:{type:"select"}}},args:{onClick:j(),loading:!1,disabled:!1,iconOnly:!1}},t={args:{},render:()=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:c.map(s=>e.jsx("div",{className:"flex gap-2 items-center",children:o.map(a=>e.jsxs(i,{size:a,variant:s,children:["Button ",a]},a))},s))})},r={args:{iconOnly:!0},render:s=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:c.map(a=>e.jsx("div",{className:"flex gap-2 items-center",children:o.map(m=>e.jsx(i,{size:m,variant:a,...s,children:e.jsx(z,{})},m))},a))})},n={args:{},render:()=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:c.map(s=>e.jsx("div",{className:"flex gap-2 items-center",children:o.map(a=>e.jsxs(i,{size:a,variant:s,children:[e.jsx(z,{}),"Button ",a]},a))},s))})};var l,p,d;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="flex flex-col items-start gap-2">
      {buttonVariants.map(variant => <div key={variant} className="flex gap-2 items-center">
          {buttonSizes.map(size => <Button key={size} size={size} variant={variant}>
              Button {size}
            </Button>)}
        </div>)}
    </div>
}`,...(d=(p=t.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var x,u,f;r.parameters={...r.parameters,docs:{...(x=r.parameters)==null?void 0:x.docs,source:{originalSource:`{
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
}`,...(f=(u=r.parameters)==null?void 0:u.docs)==null?void 0:f.source}}};var v,g,B;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="flex flex-col items-start gap-2">
      {buttonVariants.map(variant => <div key={variant} className="flex gap-2 items-center">
          {buttonSizes.map(size => <Button key={size} size={size} variant={variant}>
              <Circle />
              Button {size}
            </Button>)}
        </div>)}
    </div>
}`,...(B=(g=n.parameters)==null?void 0:g.docs)==null?void 0:B.source}}};const A=["Variants","IconOnly","IconAndText"];export{n as IconAndText,r as IconOnly,t as Variants,A as __namedExportsOrder,I as default};
