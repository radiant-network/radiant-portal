import{j as e}from"./iframe-Dt4dd9_L.js";import{a as s,B as l}from"./toggle-BdeDLJU1.js";import{S as c,a as r}from"./story-section-Ba8l4DMz.js";import"./preload-helper-PPVm8Dsz.js";const o=["xxs","xs","sm","default","lg"],i=["default","outline"],x={title:"Components/Toggles/Toggle",component:s,argTypes:{size:{options:o,control:{type:"select"}},variant:{options:i,control:{type:"select"}}},args:{disabled:!1}},a={render:()=>e.jsxs(c,{children:[e.jsx(r,{title:"Icon + text",children:i.map(t=>e.jsx("div",{className:"flex gap-2 items-center",children:o.map(n=>e.jsxs(s,{size:n,variant:t,children:[e.jsx(l,{}),"Text"]},n))},t))}),e.jsx(r,{title:"Icon only",children:i.map(t=>e.jsx("div",{className:"flex gap-2 items-center",children:o.map(n=>e.jsx(s,{size:n,variant:t,children:e.jsx(l,{})},n))},t))}),e.jsx(r,{title:"Text only",children:i.map(t=>e.jsx("div",{className:"flex gap-2 items-center",children:o.map(n=>e.jsx(s,{size:n,variant:t,children:"Text"},n))},t))})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};const S=["AllVariants"];export{a as AllVariants,S as __namedExportsOrder,x as default};
