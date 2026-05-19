import{j as o}from"./iframe-CDEQG5Fm.js";import{A as c}from"./action-button-NEINex3-.js";import{b as m,a as p}from"./utils-C8QHPIem.js";import"./preload-helper-Dp1pzeXC.js";import"./dropdown-menu-CbP8MDIw.js";import"./index-yycurVCY.js";import"./index-DPietwaT.js";import"./check-D48Ebu-n.js";import"./circle-BqtF_CMq.js";import"./separator-uj9S4p4y.js";import"./index-C8xu4Cyg.js";const{fn:i}=__STORYBOOK_MODULE_TEST__,z={title:"Buttons/Action Button",component:c,args:{onClick:i(),size:"default",disabled:!1,actions:[],onDefaultAction:i()}},t={args:{children:"Button",actions:[{label:"action 1",onClick:()=>{}},{label:"action 2",onClick:()=>{}},{label:"action 3",onClick:()=>{}}]},render:l=>o.jsx("div",{className:"flex flex-col gap-6",children:m.map(n=>o.jsx("div",{className:"flex gap-2",children:p.map(a=>o.jsxs(c,{...l,variant:n,size:a,children:[n,"-",a]},`${n}-${a}`))},n))})};var e,s,r;t.parameters={...t.parameters,docs:{...(e=t.parameters)==null?void 0:e.docs,source:{originalSource:`{
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
      {buttonVariants.map(variant => <div key={variant} className="flex gap-2">
          {buttonSizes.map(size => <ActionButton key={\`\${variant}-\${size}\`} {...args} variant={variant} size={size}>
              {variant}-{size}
            </ActionButton>)}
        </div>)}
    </div>
}`,...(r=(s=t.parameters)==null?void 0:s.docs)==null?void 0:r.source}}};const A=["Variants"];export{t as Variants,A as __namedExportsOrder,z as default};
