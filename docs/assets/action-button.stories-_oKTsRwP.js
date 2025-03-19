import{j as t}from"./jsx-runtime-D_zvdyIk.js";import{f as i}from"./index-DhvbgntC.js";import{A as r}from"./ActionButton-Ta3-7M67.js";import{b as B,a as x}from"./utils-DXcs_An2.js";import"./dropdown-menu-BD7M8eM3.js";import"./index-DUAV1Q2A.js";import"./index-CpwtQhPK.js";import"./index-CSO_qfi8.js";import"./index-CqVsPxxY.js";import"./Combination-BychJT1d.js";import"./index-D74gQ3ji.js";import"./index-DgC28C5k.js";import"./utils-BNf5BS2b.js";import"./createLucideIcon-DirO1-NP.js";import"./check-D0WsHlur.js";import"./button.variants-C_VBJA_Y.js";import"./index-C66Dxnp2.js";const O={title:"Base/Buttons/Action Button",component:r,tags:["autodocs"],args:{onClick:i(),size:"default",actions:[],onDefaultAction:i()}},n={args:{children:"Button"},render:o=>t.jsx("div",{className:"flex flex-col gap-2",children:B.map(d=>t.jsx("div",{className:"flex gap-2",children:x.map(a=>t.jsx(r,{size:"default",color:d,variant:a,...o,children:a}))}))})},s={args:{children:"Button"},render:o=>t.jsxs("div",{className:"flex gap-2",children:[t.jsx(r,{...o,size:"default",color:"primary",children:"Default"}),t.jsx(r,{...o,size:"xs",color:"primary",children:"AButton xs"}),t.jsx(r,{...o,size:"sm",color:"primary",children:"AButton sm"}),t.jsx(r,{...o,size:"md",color:"primary",children:"AButton md"}),t.jsx(r,{...o,size:"lg",color:"primary",children:"AButton lg"})]})};var e,c,l;n.parameters={...n.parameters,docs:{...(e=n.parameters)==null?void 0:e.docs,source:{originalSource:`{
  args: {
    children: "Button"
  },
  render: args => <div className="flex flex-col gap-2">
      {buttonColors.map(color => {
      return <div className="flex gap-2">
            {buttonVariants.map(variant => <ActionButton size="default" color={color} variant={variant} {...args}>
                {variant}
              </ActionButton>)}
          </div>;
    })}
    </div>
}`,...(l=(c=n.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var m,u,p;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    children: "Button"
  },
  render: args => <div className="flex gap-2">
      <ActionButton {...args} size="default" color="primary">
        Default
      </ActionButton>
      <ActionButton {...args} size="xs" color="primary">
        AButton xs
      </ActionButton>
      <ActionButton {...args} size="sm" color="primary">
        AButton sm
      </ActionButton>
      <ActionButton {...args} size="md" color="primary">
        AButton md
      </ActionButton>
      <ActionButton {...args} size="lg" color="primary">
        AButton lg
      </ActionButton>
    </div>
}`,...(p=(u=s.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};const R=["Variants","Sizes"];export{s as Sizes,n as Variants,R as __namedExportsOrder,O as default};
