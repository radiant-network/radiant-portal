import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{f as i}from"./index-DtL3pAzF.js";import{A as l}from"./action-button-KkvxmIWD.js";import"./utils-D-KgF5mV.js";import"./dropdown-menu-BJyjb2OL.js";import"./index-CBYaBgW8.js";import"./index-Ba5mf8A5.js";import"./index-Dut9wsGU.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-C6lL4ijz.js";import"./index-CJAxgcjH.js";import"./Combination-B-dCT06H.js";import"./index-DrGCp3O6.js";import"./index-BtWW-1ow.js";import"./index-BZEiv_1o.js";import"./index-ycEarWk3.js";import"./check-DSe_yRo5.js";import"./createLucideIcon-B119WVF5.js";import"./separator-B36Ht569.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";const D={title:"Buttons/Action Button",component:l,args:{onClick:i(),size:"default",disabled:!1,actions:[],onDefaultAction:i()}},n={args:{children:"Button",actions:[{label:"action 1",onClick:()=>{}},{label:"action 2",onClick:()=>{}},{label:"action 3",onClick:()=>{}}]},render:c=>a.jsx("div",{className:"flex flex-col gap-6",children:["default","outline","secondary","destructive"].map(t=>a.jsx("div",{className:"flex gap-2",children:["xxs","xs","sm","default","lg"].map(o=>a.jsxs(l,{...c,variant:t,size:o,children:[t,"-",o]},`${t}-${o}`))},t))})};var e,r,s;n.parameters={...n.parameters,docs:{...(e=n.parameters)==null?void 0:e.docs,source:{originalSource:`{
  args: {
    children: 'Button',
    actions: [{
      label: 'action 1',
      onClick: () => {}
    }, {
      label: 'action 2',
      onClick: () => {}
    }, {
      label: 'action 3',
      onClick: () => {}
    }]
  },
  render: args => <div className="flex flex-col gap-6">
      {['default', 'outline', 'secondary', 'destructive'].map(variant => <div key={variant} className="flex gap-2">
          {['xxs', 'xs', 'sm', 'default', 'lg'].map(size => <ActionButton key={\`\${variant}-\${size}\`} {...args} variant={variant} size={size}>
              {variant}-{size}
            </ActionButton>)}
        </div>)}
    </div>
}`,...(s=(r=n.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};const O=["Variants"];export{n as Variants,O as __namedExportsOrder,D as default};
