import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{f as B}from"./index-DtL3pAzF.js";import{B as i}from"./button-zz6RklMM.js";import{C as z}from"./dropdown-menu-CgwMUYBh.js";import"./index-COcwYKbe.js";import"./index-CGj_12n1.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./action-button-CiOB9jQw.js";import"./utils-D-KgF5mV.js";import"./separator-6xmuS_PL.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./createLucideIcon-8Lr1oLzj.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-CU4v6KP8.js";import"./index-CcLUv2_A.js";import"./index-CphM_NEg.js";import"./index-CIckazZy.js";import"./index-ButkbYdn.js";import"./index-A6VgBoaw.js";import"./index-BOEjv1S3.js";import"./index-BGxt8iJ2.js";import"./i18n-BaapSkCg.js";import"./iframe-kyflwCWk.js";import"./i18next-DOi7g2fS.js";import"./check-DRc1RmCY.js";import"./index-Dmw9mmVb.js";import"./Combination-Bb6GvI2f.js";const m=["default","secondary","destructive","outline","ghost","link"],o=["default","xxs","xs","sm","lg"],X={title:"Buttons/Button",component:i,argTypes:{size:{options:o,control:{type:"select"}}},args:{onClick:B(),loading:!1,disabled:!1,iconOnly:!1}},s={args:{},render:()=>t.jsx("div",{className:"flex flex-col items-start gap-2",children:m.map(r=>t.jsx("div",{className:"flex gap-2 items-center",children:o.map(e=>t.jsxs(i,{size:e,variant:r,children:["Button ",e]},e))},r))})},a={args:{iconOnly:!0},render:r=>t.jsx("div",{className:"flex flex-col items-start gap-2",children:m.map(e=>t.jsx("div",{className:"flex gap-2 items-center",children:o.map(c=>t.jsx(i,{size:c,variant:e,...r,children:t.jsx(z,{})},c))},e))})},n={args:{},render:()=>t.jsx("div",{className:"flex flex-col items-start gap-2",children:m.map(r=>t.jsx("div",{className:"flex gap-2 items-center",children:o.map(e=>t.jsxs(i,{size:e,variant:r,children:[t.jsx(z,{}),"Button ",e]},e))},r))})};var p,l,d;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="flex flex-col items-start gap-2">
      {buttonVariants.map(variant => <div key={variant} className="flex gap-2 items-center">
          {buttonSizes.map(size => <Button key={size} size={size} variant={variant}>
              Button {size}
            </Button>)}
        </div>)}
    </div>
}`,...(d=(l=s.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var u,x,f;a.parameters={...a.parameters,docs:{...(u=a.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
}`,...(f=(x=a.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var g,v,y;n.parameters={...n.parameters,docs:{...(g=n.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="flex flex-col items-start gap-2">
      {buttonVariants.map(variant => <div key={variant} className="flex gap-2 items-center">
          {buttonSizes.map(size => <Button key={size} size={size} variant={variant}>
              <Circle />
              Button {size}
            </Button>)}
        </div>)}
    </div>
}`,...(y=(v=n.parameters)==null?void 0:v.docs)==null?void 0:y.source}}};const Y=["Variants","IconOnly","IconAndText"];export{n as IconAndText,a as IconOnly,s as Variants,Y as __namedExportsOrder,X as default};
