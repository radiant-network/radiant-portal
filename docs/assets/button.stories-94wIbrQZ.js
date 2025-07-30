import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{f as y}from"./index-B7YJKKKT.js";import{B as i}from"./button-Lb4z2BrY.js";import{a as g,b as v}from"./utils-DCfAwncM.js";import{c as h}from"./createLucideIcon-BMP5cxO1.js";import"./index-Dw-eQTPP.js";import"./index-DQLiH3RP.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./ActionButton-BqVcLudk.js";import"./dropdown-menu-Begym49V.js";import"./index-DTwDs4x6.js";import"./index-BkhUCz-k.js";import"./index-Buy_jb7k.js";import"./index-BsCFIxoT.js";import"./index-uZc0PFVk.js";import"./utils-D-KgF5mV.js";import"./check-DSCf8CVO.js";import"./button.variants-BQkt_1YJ.js";import"./index-C66Dxnp2.js";import"./ellipsis-BtlAG3ey.js";import"./spinner-DHVcj7-u.js";import"./tooltip-DogpHjiW.js";import"./i18n-C0c3TCKd.js";import"./iframe-Luliyu6-.js";import"./context-DNAkM4o1.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=[["path",{d:"M16 10h2",key:"8sgtl7"}],["path",{d:"M16 14h2",key:"epxaof"}],["path",{d:"M6.17 15a3 3 0 0 1 5.66 0",key:"n6f512"}],["circle",{cx:"9",cy:"11",r:"2",key:"yxgjnd"}],["rect",{x:"2",y:"5",width:"20",height:"14",rx:"2",key:"qneu4z"}]],B=h("IdCard",z),U={title:"Buttons/Button",component:i,argTypes:{size:{options:g,control:{type:"select"}}},args:{onClick:y(),loading:!1,disabled:!1,iconOnly:!1}},a={args:{size:"default"},render:e=>t.jsx("div",{className:"flex flex-col items-start gap-2",children:v.map(r=>t.jsx(i,{variant:r,...e,children:r}))})},s={args:{size:"default",iconOnly:!0},render:e=>t.jsx("div",{className:"flex flex-col items-start gap-2",children:v.map(r=>t.jsx(i,{variant:r,...e,children:t.jsx(B,{})}))})},o={args:{variant:"default"},render:e=>t.jsx("div",{className:"flex flex-col items-start gap-2",children:g.map(r=>t.jsxs(i,{size:r,...e,children:["Button ",r]}))})};var n,m,c;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    size: 'default'
  },
  render: args => {
    return <div className="flex flex-col items-start gap-2">
        {buttonVariants.map(variant => <Button variant={variant} {...args}>
            {variant}
          </Button>)}
      </div>;
  }
}`,...(c=(m=a.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};var p,l,d;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    size: 'default',
    iconOnly: true
  },
  render: args => {
    return <div className="flex flex-col items-start gap-2">
        {buttonVariants.map(variant => <Button variant={variant} {...args}>
            <IdCardIcon />
          </Button>)}
      </div>;
  }
}`,...(d=(l=s.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var u,f,x;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    variant: 'default'
  },
  render: args => {
    return <div className="flex flex-col items-start gap-2">
        {buttonSizes.map(size => <Button size={size} {...args}>
            Button {size}
          </Button>)}
      </div>;
  }
}`,...(x=(f=o.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};const W=["Variants","IconOnly","Sizes"];export{s as IconOnly,o as Sizes,a as Variants,W as __namedExportsOrder,U as default};
