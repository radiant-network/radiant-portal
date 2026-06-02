import{j as i}from"./iframe-Cmiex3IG.js";import{A as e}from"./action-button-bPFBQAma.js";import{b as r,a as c}from"./utils-C8QHPIem.js";import"./preload-helper-PPVm8Dsz.js";import"./dropdown-menu-BUNcBeqG.js";import"./index-OjUxLgF4.js";import"./index-nnPp2JKR.js";import"./check-BHUZAyPW.js";import"./circle-CZF_B4Vk.js";import"./separator-VLxmM7Q3.js";import"./index-bnaEmcFS.js";const{fn:o}=__STORYBOOK_MODULE_TEST__,v={title:"Buttons/Action Button",component:e,args:{onClick:o(),size:"default",disabled:!1,actions:[],onDefaultAction:o()}},t={args:{children:"Button",actions:[{id:"action_1",label:"action 1",onClick:()=>{}},{id:"action_2",label:"action 2",onClick:()=>{}},{id:"action_3",label:"action 3",onClick:()=>{}}]},render:s=>i.jsx("div",{className:"flex flex-col gap-6",children:r.map(n=>i.jsx("div",{className:"flex gap-2",children:c.map(a=>i.jsxs(e,{...s,variant:n,size:a,children:[n,"-",a]},`${n}-${a}`))},n))})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
