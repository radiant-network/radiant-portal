import{j as e}from"./iframe-fZ1JU2dD.js";import{a as i,B as c}from"./toggle-C2vg-OoT.js";import"./preload-helper-PPVm8Dsz.js";const l=["xxs","xs","sm","default","lg"],o=["default","outline"],p={title:"Toggle/Toggle",component:i,argTypes:{size:{options:l,control:{type:"select"}},variant:{options:o,control:{type:"select"}}},args:{disabled:!1}},t={render:()=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:o.map(a=>e.jsx("div",{className:"flex gap-2 items-center",children:l.map(s=>e.jsxs(i,{size:s,variant:a,children:[e.jsx(c,{}),"Text"]},s))},a))})},r={render:()=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:o.map(a=>e.jsx("div",{className:"flex gap-2 items-center",children:l.map(s=>e.jsx(i,{size:s,variant:a,children:e.jsx(c,{})},s))},a))})},n={render:()=>e.jsx("div",{className:"flex flex-col items-start gap-2",children:o.map(a=>e.jsx("div",{className:"flex gap-2 items-center",children:l.map(s=>e.jsx(i,{size:s,variant:a,children:"Text"},s))},a))})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-start gap-2">
      {toggleVariantOptions.map(variant => <div key={variant} className="flex gap-2 items-center">
          {toggleSizes.map(size => <Toggle key={size} size={size} variant={variant}>
              <Bold />
              Text
            </Toggle>)}
        </div>)}
    </div>
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-start gap-2">
      {toggleVariantOptions.map(variant => <div key={variant} className="flex gap-2 items-center">
          {toggleSizes.map(size => <Toggle key={size} size={size} variant={variant}>
              <Bold />
            </Toggle>)}
        </div>)}
    </div>
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-start gap-2">
      {toggleVariantOptions.map(variant => <div key={variant} className="flex gap-2 items-center">
          {toggleSizes.map(size => <Toggle key={size} size={size} variant={variant}>
              Text
            </Toggle>)}
        </div>)}
    </div>
}`,...n.parameters?.docs?.source}}};const x=["Variants","IconOnly","TextOnly"];export{r as IconOnly,n as TextOnly,t as Variants,x as __namedExportsOrder,p as default};
