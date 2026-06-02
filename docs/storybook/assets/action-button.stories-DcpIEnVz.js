import{j as i}from"./iframe-DaN5ePGy.js";import{A as e}from"./action-button-BHK2YR4r.js";import{b as r,a as c}from"./utils-C8QHPIem.js";import"./preload-helper-PPVm8Dsz.js";import"./dropdown-menu-CPO56L4e.js";import"./index-DeH_VHOF.js";import"./index-CZCzdGEw.js";import"./check-B-s7SQrr.js";import"./circle-ZjFAsy7t.js";import"./separator-Dw2V0eT4.js";import"./index-buk7i43K.js";const{fn:o}=__STORYBOOK_MODULE_TEST__,v={title:"Buttons/Action Button",component:e,args:{onClick:o(),size:"default",disabled:!1,actions:[],onDefaultAction:o()}},t={args:{children:"Button",actions:[{id:"action_1",label:"action 1",onClick:()=>{}},{id:"action_2",label:"action 2",onClick:()=>{}},{id:"action_3",label:"action 3",onClick:()=>{}}]},render:s=>i.jsx("div",{className:"flex flex-col gap-6",children:r.map(n=>i.jsx("div",{className:"flex gap-2",children:c.map(a=>i.jsxs(e,{...s,variant:n,size:a,children:[n,"-",a]},`${n}-${a}`))},n))})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
