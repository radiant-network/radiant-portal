import{bC as o,j as t,B as n}from"./iframe-CEIjD8md.js";import{a as s}from"./story-section-akNb6BHm.js";import"./preload-helper-PPVm8Dsz.js";const m={title:"Layout/Page Error/403",component:o,parameters:{layout:"fullscreen",docs:{description:{component:"Authenticated but lacks tenant access"}}}},e={render:()=>t.jsx(s,{title:"Forbidden - error 403",children:t.jsx(o,{})})},r={render:()=>t.jsx(s,{title:"With custom props",children:t.jsx(o,{title:"Custom title",message:"Custom message",extra:t.jsx(n,{variant:"outline",className:"w-full",children:"Custom button"})})})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Forbidden - error 403">
      <Error403 />
    </StorySection>
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="With custom props">
      <Error403 title="Custom title" message="Custom message" extra={<Button variant="outline" className="w-full">
            Custom button
          </Button>} />
    </StorySection>
}`,...r.parameters?.docs?.source}}};const u=["Forbidden403","Forbidden403CustomProps"];export{e as Forbidden403,r as Forbidden403CustomProps,u as __namedExportsOrder,m as default};
