import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{f as i}from"./index-DtL3pAzF.js";import{A as l}from"./action-button-BiAXKMq7.js";import"./utils-D-KgF5mV.js";import"./dropdown-menu-CFPCuvYI.js";import"./index-CGj_12n1.js";import"./index-CcLUv2_A.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./index-CphM_NEg.js";import"./Combination-Bb6GvI2f.js";import"./index-ButkbYdn.js";import"./index-A6VgBoaw.js";import"./index-BOEjv1S3.js";import"./index-CIckazZy.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";import"./separator-6xmuS_PL.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";const _={title:"Buttons/Action Button",component:l,args:{onClick:i(),size:"default",disabled:!1,actions:[],onDefaultAction:i()}},n={args:{children:"Button",actions:[{label:"action 1",onClick:()=>{}},{label:"action 2",onClick:()=>{}},{label:"action 3",onClick:()=>{}}]},render:c=>a.jsx("div",{className:"flex flex-col gap-6",children:["default","outline","secondary","destructive"].map(t=>a.jsx("div",{className:"flex gap-2",children:["xxs","xs","sm","default","lg"].map(o=>a.jsxs(l,{...c,variant:t,size:o,children:[t,"-",o]},`${t}-${o}`))},t))})};var e,r,s;n.parameters={...n.parameters,docs:{...(e=n.parameters)==null?void 0:e.docs,source:{originalSource:`{
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
}`,...(s=(r=n.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};const D=["Variants"];export{n as Variants,D as __namedExportsOrder,_ as default};
