import{j as r}from"./jsx-runtime-Cf8x2fCZ.js";import{f as s}from"./index-BZkcKs8Z.js";import{A as o}from"./ActionButton-BJjHF_QO.js";import{b as x,a as f}from"./utils-DXcs_An2.js";import"./index-yBjzXJbu.js";import"./dropdown-menu-waw6TUZR.js";import"./index-tvICUrOf.js";import"./index-Dq5VjjLd.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./Combination-DL__bl4O.js";import"./index-y2NRHbXQ.js";import"./check-DKX_pDN6.js";import"./createLucideIcon-DKFpjrVJ.js";import"./utils-BNf5BS2b.js";import"./button.variants-DG8R81Cn.js";import"./index-C66Dxnp2.js";const _={title:"Base/Buttons/Action Button",component:o,tags:["autodocs"],args:{onClick:s(),size:"default",actions:[],onDefaultAction:s()}},a={args:{children:"Button"},render:t=>r.jsx("div",{className:"flex flex-col gap-2",children:x.map(d=>r.jsx("div",{className:"flex gap-2",children:f.map(i=>r.jsx(o,{size:"default",color:d,variant:i,...t,children:i}))}))})},e={args:{children:"Button"},render:t=>r.jsxs("div",{className:"flex gap-2",children:[r.jsx(o,{...t,size:"default",color:"primary",children:"Default"}),r.jsx(o,{...t,size:"xs",color:"primary",children:"Extra Small"}),r.jsx(o,{...t,size:"sm",color:"primary",children:"Small"}),r.jsx(o,{...t,size:"md",color:"primary",children:"Medium"}),r.jsx(o,{...t,size:"lg",color:"primary",children:"Large"})]})};var n,c,l;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: args => {
    return <div className="flex flex-col gap-2">
        {buttonColors.map(color => {
        return <div className="flex gap-2">
              {buttonVariants.map(variant => <ActionButton size="default" color={color} variant={variant} {...args}>
                  {variant}
                </ActionButton>)}
            </div>;
      })}
      </div>;
  }
}`,...(l=(c=a.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var m,p,u;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  },
  render: args => {
    return <div className="flex gap-2">
        <ActionButton {...args} size="default" color="primary">
          Default
        </ActionButton>
        <ActionButton {...args} size="xs" color="primary">
          Extra Small
        </ActionButton>
        <ActionButton {...args} size="sm" color="primary">
          Small
        </ActionButton>
        <ActionButton {...args} size="md" color="primary">
          Medium
        </ActionButton>
        <ActionButton {...args} size="lg" color="primary">
          Large
        </ActionButton>
      </div>;
  }
}`,...(u=(p=e.parameters)==null?void 0:p.docs)==null?void 0:u.source}}};const k=["Variants","Sizes"];export{e as Sizes,a as Variants,k as __namedExportsOrder,_ as default};
