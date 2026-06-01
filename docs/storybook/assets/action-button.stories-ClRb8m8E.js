import{j as i}from"./iframe-CgYzld9M.js";import{A as e}from"./action-button-Dd50ZnSl.js";import{b as r,a as c}from"./utils-C8QHPIem.js";import"./preload-helper-PPVm8Dsz.js";import"./dropdown-menu-CCEHsgQp.js";import"./index-D5qyD-5a.js";import"./index-CPRKa62s.js";import"./check-DrnC7o8K.js";import"./circle-BJPs1Iry.js";import"./separator-BXAAQkGD.js";import"./index-0Ui6iiVS.js";const{fn:o}=__STORYBOOK_MODULE_TEST__,v={title:"Buttons/Action Button",component:e,args:{onClick:o(),size:"default",disabled:!1,actions:[],onDefaultAction:o()}},t={args:{children:"Button",actions:[{id:"action_1",label:"action 1",onClick:()=>{}},{id:"action_2",label:"action 2",onClick:()=>{}},{id:"action_3",label:"action 3",onClick:()=>{}}]},render:s=>i.jsx("div",{className:"flex flex-col gap-6",children:r.map(n=>i.jsx("div",{className:"flex gap-2",children:c.map(a=>i.jsxs(e,{...s,variant:n,size:a,children:[n,"-",a]},`${n}-${a}`))},n))})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button',
    actions: [{
      id: 'action_1',
      label: 'action 1',
      onClick: () => {}
    }, {
      id: 'action_2',
      label: 'action 2',
      onClick: () => {}
    }, {
      id: 'action_3',
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
}`,...t.parameters?.docs?.source}}};const B=["Variants"];export{t as Variants,B as __namedExportsOrder,v as default};
