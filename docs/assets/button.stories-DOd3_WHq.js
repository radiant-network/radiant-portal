import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{f as u}from"./index-DhvbgntC.js";import{B as t}from"./button-BV5FW__W.js";import{b as d,a as x}from"./utils-DXcs_An2.js";import"./index-DUAV1Q2A.js";import"./index-CpwtQhPK.js";import"./index-CSO_qfi8.js";import"./index-CqVsPxxY.js";import"./ActionButton-DL6MvGoj.js";import"./dropdown-menu-BD7M8eM3.js";import"./Combination-BychJT1d.js";import"./index-D74gQ3ji.js";import"./index-DgC28C5k.js";import"./utils-BNf5BS2b.js";import"./createLucideIcon-DirO1-NP.js";import"./check-D0WsHlur.js";import"./button.variants-8qSqwKCP.js";import"./index-C66Dxnp2.js";import"./IconButton-BLHdRjzm.js";const q={title:"Base/Buttons/Button",component:t,tags:["autodocs"],args:{onClick:u(),size:"default"}},o={args:{},render:()=>r.jsx("div",{className:"flex flex-col gap-2",children:d.map(c=>r.jsx("div",{className:"flex gap-2",children:x.map(s=>r.jsx(t,{color:c,variant:s,children:s}))}))})},n={args:{},render:()=>r.jsxs("div",{className:"flex gap-2",children:[r.jsx(t,{size:"default",color:"primary",children:"Default"}),r.jsx(t,{size:"xs",color:"primary",children:"Button xs"}),r.jsx(t,{size:"sm",color:"primary",children:"Button sm"}),r.jsx(t,{size:"md",color:"primary",children:"Button md"}),r.jsx(t,{size:"lg",color:"primary",children:"Button lg"})]})};var a,e,i;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="flex flex-col gap-2">
      {buttonColors.map(color => {
      return <div className="flex gap-2">
            {buttonVariants.map(variant => <Button color={color} variant={variant}>
                {variant}
              </Button>)}
          </div>;
    })}
    </div>
}`,...(i=(e=o.parameters)==null?void 0:e.docs)==null?void 0:i.source}}};var m,l,p;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {},
  render: () => <div className="flex gap-2">
      <Button size="default" color="primary">
        Default
      </Button>
      <Button size="xs" color="primary">
        Button xs
      </Button>
      <Button size="sm" color="primary">
        Button sm
      </Button>
      <Button size="md" color="primary">
        Button md
      </Button>
      <Button size="lg" color="primary">
        Button lg
      </Button>
    </div>
}`,...(p=(l=n.parameters)==null?void 0:l.docs)==null?void 0:p.source}}};const w=["Variants","Sizes"];export{n as Sizes,o as Variants,w as __namedExportsOrder,q as default};
