import{j as i}from"./iframe-g_rM03WD.js";import{A as c}from"./action-button-firnxveF.js";import{b as m,a as d}from"./utils-C8QHPIem.js";import"./preload-helper-Dp1pzeXC.js";import"./dropdown-menu-C8dl2V8Q.js";import"./index-B4C9r0pW.js";import"./index-CiJ_Won9.js";import"./check-Cn-MPm-h.js";import"./circle-CWj6cztr.js";import"./separator-0OwIr9F3.js";import"./index-C5nHNu5V.js";const{fn:o}=__STORYBOOK_MODULE_TEST__,z={title:"Buttons/Action Button",component:c,args:{onClick:o(),size:"default",disabled:!1,actions:[],onDefaultAction:o()}},t={args:{children:"Button",actions:[{id:"action_1",label:"action 1",onClick:()=>{}},{id:"action_2",label:"action 2",onClick:()=>{}},{id:"action_3",label:"action 3",onClick:()=>{}}]},render:l=>i.jsx("div",{className:"flex flex-col gap-6",children:m.map(n=>i.jsx("div",{className:"flex gap-2",children:d.map(a=>i.jsxs(c,{...l,variant:n,size:a,children:[n,"-",a]},`${n}-${a}`))},n))})};var e,s,r;t.parameters={...t.parameters,docs:{...(e=t.parameters)==null?void 0:e.docs,source:{originalSource:`{
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
}`,...(r=(s=t.parameters)==null?void 0:s.docs)==null?void 0:r.source}}};const A=["Variants"];export{t as Variants,A as __namedExportsOrder,z as default};
