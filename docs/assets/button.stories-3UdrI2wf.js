import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{f as v}from"./index-60NixA5P.js";import{B as i}from"./button-DOcMwHed.js";import{b as g,a as h}from"./utils-DCfAwncM.js";import{c as y}from"./createLucideIcon-j2ULFFRy.js";import"./index-DSqg7KUl.js";import"./index-CTzypqlY.js";import"./index-8Ey6BpB7.js";import"./index-X_f_OX5J.js";import"./ActionButton-DzNjlVbA.js";import"./dropdown-menu-DBzaXDUq.js";import"./index-CqHHZPb-.js";import"./Combination-3tVHk2hX.js";import"./index-BFdFQidM.js";import"./index-Y7TeOx8d.js";import"./index-BEp8L1N2.js";import"./utils-CytzSlOG.js";import"./check-BwCYBAs1.js";import"./button.variants-B79LQKoe.js";import"./index-C66Dxnp2.js";import"./ellipsis-ClICah0q.js";import"./spinner-gjpK1L3h.js";/**
 * @license lucide-react v0.482.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=[["path",{d:"M16 10h2",key:"8sgtl7"}],["path",{d:"M16 14h2",key:"epxaof"}],["path",{d:"M6.17 15a3 3 0 0 1 5.66 0",key:"n6f512"}],["circle",{cx:"9",cy:"11",r:"2",key:"yxgjnd"}],["rect",{x:"2",y:"5",width:"20",height:"14",rx:"2",key:"qneu4z"}]],B=y("IdCard",z),K={title:"Buttons/Button",component:i,args:{onClick:v(),loading:!1,disabled:!1,iconOnly:!1}},e={args:{size:"default"},render:a=>t.jsx("div",{className:"flex flex-col items-start gap-2",children:g.map(r=>t.jsx(i,{variant:r,...a,children:r}))})},s={args:{size:"default",iconOnly:!0},render:a=>t.jsx("div",{className:"flex flex-col items-start gap-2",children:g.map(r=>t.jsx(i,{variant:r,...a,children:t.jsx(B,{})}))})},o={args:{variant:"default"},render:a=>t.jsx("div",{className:"flex flex-col items-start gap-2",children:h.map(r=>t.jsxs(i,{size:r,...a,children:["Button ",r]}))})};var n,c,m;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
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
}`,...(m=(c=e.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var d,l,p;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(p=(l=s.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};var u,f,x;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
}`,...(x=(f=o.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};const P=["Variants","IconOnly","Sizes"];export{s as IconOnly,o as Sizes,e as Variants,P as __namedExportsOrder,K as default};
