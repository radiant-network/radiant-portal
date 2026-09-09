import{A as e,j as o}from"./iframe-CgZaKe5d.js";import{a as c}from"./story-section-Cd-IQlgl.js";import{b as r,a as l}from"./utils-C8QHPIem.js";import"./preload-helper-PPVm8Dsz.js";const{fn:n}=__STORYBOOK_MODULE_TEST__,f={title:"Components/Buttons/Action Button",component:e,args:{onClick:n(),size:"default",disabled:!1,actions:[],onDefaultAction:n()}},a={args:{children:"Button",actions:[{id:"action_1",label:"action 1",onClick:()=>{}},{id:"action_2",label:"action 2",onClick:()=>{}},{id:"action_3",label:"action 3",onClick:()=>{}}]},render:s=>o.jsx(c,{title:"Color and size",children:o.jsx("div",{className:"flex flex-col gap-6",children:r.map(t=>o.jsx("div",{className:"flex gap-2",children:l.map(i=>o.jsxs(e,{...s,variant:t,size:i,children:[t,"-",i]},`${t}-${i}`))},t))})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};const x=["ColorAndSize"];export{a as ColorAndSize,x as __namedExportsOrder,f as default};
