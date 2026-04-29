import{j as o}from"./iframe-BX_H28US.js";import{A as c}from"./action-button-BhEgzh5t.js";import{b as m,a as p}from"./utils-C8QHPIem.js";import"./preload-helper-Dp1pzeXC.js";import"./dropdown-menu-D6VQIUJt.js";import"./index-DqhBjzfn.js";import"./circle-3EwZHy2z.js";import"./check-CIDnGo8R.js";import"./separator-CcmEc_rg.js";import"./index-PQmHE6kT.js";const{fn:i}=__STORYBOOK_MODULE_TEST__,C={title:"Buttons/Action Button",component:c,args:{onClick:i(),size:"default",disabled:!1,actions:[],onDefaultAction:i()}},a={args:{children:"Button",actions:[{label:"action 1",onClick:()=>{}},{label:"action 2",onClick:()=>{}},{label:"action 3",onClick:()=>{}}]},render:l=>o.jsx("div",{className:"flex flex-col gap-6",children:m.map(n=>o.jsx("div",{className:"flex gap-2",children:p.map(t=>o.jsxs(c,{...l,variant:n,size:t,children:[n,"-",t]},`${n}-${t}`))},n))})};var e,s,r;a.parameters={...a.parameters,docs:{...(e=a.parameters)==null?void 0:e.docs,source:{originalSource:`{
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
}`,...(r=(s=a.parameters)==null?void 0:s.docs)==null?void 0:r.source}}};const z=["Variants"];export{a as Variants,z as __namedExportsOrder,C as default};
