import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{n,t as r}from"./action-button-DIpHBY-k.js";import{i,n as a}from"./story-section-DVTm6cGm.js";import{n as o,r as s,t as c}from"./utils-BnDNM57u.js";var l,u,d,f,p;function m(){return(m=e((()=>{n(),i(),s(),l=t(),{fn:u}=__STORYBOOK_MODULE_TEST__,d={title:`Components/Buttons/Action Button`,component:r,args:{onClick:u(),size:`default`,disabled:!1,actions:[],onDefaultAction:u()}},f={args:{children:`Button`,actions:[{id:`action_1`,label:`action 1`,onClick:()=>{}},{id:`action_2`,label:`action 2`,onClick:()=>{}},{id:`action_3`,label:`action 3`,onClick:()=>{}}]},render:e=>(0,l.jsx)(a,{title:`Color and size`,children:(0,l.jsx)(`div`,{className:`flex flex-col gap-6`,children:o.map(t=>(0,l.jsx)(`div`,{className:`flex gap-2`,children:c.map(n=>(0,l.jsxs)(r,{...e,variant:t,size:n,children:[t,`-`,n]},`${t}-${n}`))},t))})})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
  render: args => <StorySection title="Color and size">
      <div className="flex flex-col gap-6">
        {buttonVariants.map(variant => <div key={variant} className="flex gap-2">
            {buttonSizes.map(size => <ActionButton key={\`\${variant}-\${size}\`} {...args} variant={variant} size={size}>
                {variant}-{size}
              </ActionButton>)}
          </div>)}
      </div>
    </StorySection>
}`,...f.parameters?.docs?.source}}},p=[`ColorAndSize`]})))()}m();export{f as ColorAndSize,p as __namedExportsOrder,d as default};