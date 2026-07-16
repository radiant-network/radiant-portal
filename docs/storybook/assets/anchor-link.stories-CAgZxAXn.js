import{j as n}from"./iframe-D78160ma.js";import{A as r}from"./anchor-link-B1xlnlRW.js";import{S as o,a as e}from"./story-section-CJRHUJpZ.js";import"./preload-helper-PPVm8Dsz.js";const i=["primary","secondary","white"],a=["default","xs","sm","lg"],d={title:"Components/Links/Anchor Link",component:r,argTypes:{size:{options:a,control:{type:"select"}},variant:{options:i,control:{type:"select"}}},args:{external:!0,size:"default",variant:"primary",mono:!1}},t={render:()=>n.jsxs(o,{children:[n.jsx(e,{title:"Default",children:n.jsx(r,{external:!0,children:"Anchor Link"})}),n.jsx(e,{title:"Secondary",children:n.jsx(r,{external:!0,variant:"secondary",children:"Anchor Link"})}),n.jsx(e,{title:"White (on a dark surface)",children:n.jsx("div",{className:"rounded-md bg-slate-900 p-4",children:n.jsx(r,{external:!0,variant:"white",children:"Anchor Link"})})}),n.jsx(e,{title:"Mono",children:n.jsx(r,{external:!0,mono:!0,children:"Anchor Link"})})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StorySection title="Default">
        <AnchorLink external>Anchor Link</AnchorLink>
      </StorySection>

      <StorySection title="Secondary">
        <AnchorLink external variant="secondary">
          Anchor Link
        </AnchorLink>
      </StorySection>

      <StorySection title="White (on a dark surface)">
        <div className="rounded-md bg-slate-900 p-4">
          <AnchorLink external variant="white">
            Anchor Link
          </AnchorLink>
        </div>
      </StorySection>

      <StorySection title="Mono">
        <AnchorLink external mono>
          Anchor Link
        </AnchorLink>
      </StorySection>
    </StoryShowcase>
}`,...t.parameters?.docs?.source}}};const S=["AllVariants"];export{t as AllVariants,S as __namedExportsOrder,d as default};
