import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{a as n,i as r,n as i,t as a}from"./toggle-BypjQF-J.js";import{i as o,n as s,r as c}from"./story-section-DVTm6cGm.js";var l,u,d,f,p,m;function h(){return(h=e((()=>{n(),i(),o(),l=t(),u=[`xxs`,`xs`,`sm`,`default`,`lg`],d=[`default`,`outline`],f={title:`Components/Toggles/Toggle`,component:a,argTypes:{size:{options:u,control:{type:`select`}},variant:{options:d,control:{type:`select`}}},args:{disabled:!1}},p={render:()=>(0,l.jsxs)(c,{children:[(0,l.jsx)(s,{title:`Icon + text`,children:d.map(e=>(0,l.jsx)(`div`,{className:`flex gap-2 items-center`,children:u.map(t=>(0,l.jsxs)(a,{size:t,variant:e,children:[(0,l.jsx)(r,{}),`Text`]},t))},e))}),(0,l.jsx)(s,{title:`Icon only`,children:d.map(e=>(0,l.jsx)(`div`,{className:`flex gap-2 items-center`,children:u.map(t=>(0,l.jsx)(a,{size:t,variant:e,children:(0,l.jsx)(r,{})},t))},e))}),(0,l.jsx)(s,{title:`Text only`,children:d.map(e=>(0,l.jsx)(`div`,{className:`flex gap-2 items-center`,children:u.map(t=>(0,l.jsx)(a,{size:t,variant:e,children:`Text`},t))},e))})]})},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StorySection title="Icon + text">
        {toggleVariantOptions.map(variant => <div key={variant} className="flex gap-2 items-center">
            {toggleSizes.map(size => <Toggle key={size} size={size} variant={variant}>
                <Bold />
                Text
              </Toggle>)}
          </div>)}
      </StorySection>

      <StorySection title="Icon only">
        {toggleVariantOptions.map(variant => <div key={variant} className="flex gap-2 items-center">
            {toggleSizes.map(size => <Toggle key={size} size={size} variant={variant}>
                <Bold />
              </Toggle>)}
          </div>)}
      </StorySection>

      <StorySection title="Text only">
        {toggleVariantOptions.map(variant => <div key={variant} className="flex gap-2 items-center">
            {toggleSizes.map(size => <Toggle key={size} size={size} variant={variant}>
                Text
              </Toggle>)}
          </div>)}
      </StorySection>
    </StoryShowcase>
}`,...p.parameters?.docs?.source}}},m=[`AllVariants`]})))()}h();export{p as AllVariants,m as __namedExportsOrder,f as default};