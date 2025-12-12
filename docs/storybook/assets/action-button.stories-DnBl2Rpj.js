import{j as n}from"./jsx-runtime-D_zvdyIk.js";import{f as a}from"./index-FPNDRHs_.js";import{A as l}from"./action-button-9r-08jXC.js";import"./dropdown-menu-DPm_FhUX.js";import"./index-CBYaBgW8.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-Dy6y0jaD.js";import"./index-BCzuw4Jg.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./Combination-CrkgvPnV.js";import"./index-iyInEJkZ.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfgEC-S9.js";import"./createLucideIcon-B119WVF5.js";import"./index-DnEzm5An.js";import"./utils-CDN07tui.js";import"./check-DSe_yRo5.js";import"./separator-ChZWIdMg.js";import"./index-C-d7IIsQ.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";const S={title:"Buttons/Action Button",component:l,args:{onClick:a(),size:"default",disabled:!1,actions:[],onDefaultAction:a()}},o={args:{children:"Button",actions:[{label:"action 1",onClick:()=>{}},{label:"action 2",onClick:()=>{}},{label:"action 3",onClick:()=>{}}]},render:c=>n.jsx("div",{className:"flex flex-col gap-6",children:["default","outline","secondary","destructive"].map(t=>n.jsx("div",{className:"flex gap-2",children:["xxs","xs","sm","default","lg"].map(i=>n.jsxs(l,{...c,variant:t,size:i,children:[t,"-",i]},`${t}-${i}`))},t))})};var r,e,s;o.parameters={...o.parameters,docs:{...(r=o.parameters)==null?void 0:r.docs,source:{originalSource:`{
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
}`,...(s=(e=o.parameters)==null?void 0:e.docs)==null?void 0:s.source}}};const q=["Variants"];export{o as Variants,q as __namedExportsOrder,S as default};
