import{j as e}from"./iframe-BOYB6VZu.js";import{A as r}from"./action-button-4NKFE7w1.js";import"./preload-helper-Dp1pzeXC.js";import"./dropdown-menu-JfwOliNj.js";import"./index-IJOQfWhe.js";import"./circle-d3EpmDag.js";import"./check-Duw61Hy0.js";import"./separator-BUqn_ALp.js";import"./index-CIMqbMyN.js";const{fn:o}=__STORYBOOK_MODULE_TEST__,B={title:"Buttons/Action Button",component:r,args:{onClick:o(),size:"default",disabled:!1,actions:[],onDefaultAction:o()}},a={args:{children:"Button",actions:[{label:"action 1",onClick:()=>{}},{label:"action 2",onClick:()=>{}},{label:"action 3",onClick:()=>{}}]},render:c=>e.jsx("div",{className:"flex flex-col gap-6",children:["default","outline","secondary","destructive"].map(n=>e.jsx("div",{className:"flex gap-2",children:["xxs","xs","sm","default","lg"].map(t=>e.jsxs(r,{...c,variant:n,size:t,children:[n,"-",t]},`${n}-${t}`))},n))})};var i,s,l;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`{
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
}`,...(l=(s=a.parameters)==null?void 0:s.docs)==null?void 0:l.source}}};const _=["Variants"];export{a as Variants,_ as __namedExportsOrder,B as default};
