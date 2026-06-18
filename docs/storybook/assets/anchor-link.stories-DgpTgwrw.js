import{j as n}from"./iframe-C3tvUR1J.js";import{A as e}from"./anchor-link-BjDrLmdm.js";import{S as t,a as o}from"./story-section-Cml820jU.js";import"./preload-helper-PPVm8Dsz.js";const i=["primary","secondary"],a=["default","xs","sm","lg"],S={title:"Components/Links/Anchor Link",component:e,argTypes:{size:{options:a,control:{type:"select"}},variant:{options:i,control:{type:"select"}}},args:{external:!0,size:"default",variant:"primary",mono:!1}},r={render:()=>n.jsxs(t,{children:[n.jsx(o,{title:"Default",children:n.jsx(e,{external:!0,children:"Anchor Link"})}),n.jsx(o,{title:"Secondary",children:n.jsx(e,{external:!0,variant:"secondary",children:"Anchor Link"})}),n.jsx(o,{title:"Mono",children:n.jsx(e,{external:!0,mono:!0,children:"Anchor Link"})})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <StoryShowcase>
      <StorySection title="Default">
        <AnchorLink external>Anchor Link</AnchorLink>
      </StorySection>

      <StorySection title="Secondary">
        <AnchorLink external variant="secondary">
          Anchor Link
        </AnchorLink>
      </StorySection>

      <StorySection title="Mono">
        <AnchorLink external mono>
          Anchor Link
        </AnchorLink>
      </StorySection>
    </StoryShowcase>
}`,...r.parameters?.docs?.source}}};const d=["AllVariants"];export{r as AllVariants,d as __namedExportsOrder,S as default};
