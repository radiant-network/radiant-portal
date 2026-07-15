import{j as t}from"./iframe-CJwTE_QO.js";import{A as e}from"./action-button-CQ4pQYUu.js";import{a as s}from"./story-section-CeCnabVr.js";import{b as c,a as l}from"./utils-C8QHPIem.js";import"./preload-helper-PPVm8Dsz.js";import"./dropdown-menu-B8L4Z_RM.js";import"./index-B21IwPkO.js";import"./index-BwqD7REl.js";import"./check-yhgl2byu.js";import"./circle-Do5ahLCh.js";import"./separator-Bp1EgoNF.js";const{fn:n}=__STORYBOOK_MODULE_TEST__,z={title:"Components/Buttons/Action Button",component:e,args:{onClick:n(),size:"default",disabled:!1,actions:[],onDefaultAction:n()}},i={args:{children:"Button",actions:[{id:"action_1",label:"action 1",onClick:()=>{}},{id:"action_2",label:"action 2",onClick:()=>{}},{id:"action_3",label:"action 3",onClick:()=>{}}]},render:r=>t.jsx(s,{title:"Color and size",children:t.jsx("div",{className:"flex flex-col gap-6",children:c.map(o=>t.jsx("div",{className:"flex gap-2",children:l.map(a=>t.jsxs(e,{...r,variant:o,size:a,children:[o,"-",a]},`${o}-${a}`))},o))})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const k=["ColorAndSize"];export{i as ColorAndSize,k as __namedExportsOrder,z as default};
