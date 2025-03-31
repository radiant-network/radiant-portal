import{j as r}from"./jsx-runtime-Cf8x2fCZ.js";import{f as u}from"./index-BZkcKs8Z.js";import{B as o}from"./button-8ZB15y1Y.js";import{b as d,a as x}from"./utils-DXcs_An2.js";import"./index-yBjzXJbu.js";import"./index-tvICUrOf.js";import"./index-Dq5VjjLd.js";import"./index-_r67kdfS.js";import"./index-fNjTmf9T.js";import"./ActionButton-BJjHF_QO.js";import"./dropdown-menu-waw6TUZR.js";import"./Combination-DL__bl4O.js";import"./index-y2NRHbXQ.js";import"./check-DKX_pDN6.js";import"./createLucideIcon-DKFpjrVJ.js";import"./utils-BNf5BS2b.js";import"./button.variants-DG8R81Cn.js";import"./index-C66Dxnp2.js";import"./IconButton-DL58Pmf8.js";const O={title:"Base/Buttons/Button",component:o,tags:["autodocs"],args:{onClick:u(),size:"default"}},t={args:{},render:()=>r.jsx("div",{className:"flex flex-col gap-2",children:d.map(c=>r.jsx("div",{className:"flex gap-2",children:x.map(n=>r.jsx(o,{color:c,variant:n,children:n}))}))})},a={args:{},render:()=>r.jsxs("div",{className:"flex gap-2",children:[r.jsx(o,{size:"default",color:"primary",children:"Default"}),r.jsx(o,{size:"xs",color:"primary",children:"Extra Small"}),r.jsx(o,{size:"sm",color:"primary",children:"Small"}),r.jsx(o,{size:"md",color:"primary",children:"Medium"}),r.jsx(o,{size:"lg",color:"primary",children:"Large"})]})};var e,s,i;t.parameters={...t.parameters,docs:{...(e=t.parameters)==null?void 0:e.docs,source:{originalSource:`{
  args: {},
  render: () => {
    return <div className="flex flex-col gap-2">
        {buttonColors.map(color => {
        return <div className="flex gap-2">
              {buttonVariants.map(variant => <Button color={color} variant={variant}>
                  {variant}
                </Button>)}
            </div>;
      })}
      </div>;
  }
}`,...(i=(s=t.parameters)==null?void 0:s.docs)==null?void 0:i.source}}};var m,l,p;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {},
  render: () => {
    return <div className="flex gap-2">
        <Button size="default" color="primary">
          Default
        </Button>
        <Button size="xs" color="primary">
          Extra Small
        </Button>
        <Button size="sm" color="primary">
          Small
        </Button>
        <Button size="md" color="primary">
          Medium
        </Button>
        <Button size="lg" color="primary">
          Large
        </Button>
      </div>;
  }
}`,...(p=(l=a.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};const R=["Variants","Sizes"];export{a as Sizes,t as Variants,R as __namedExportsOrder,O as default};
