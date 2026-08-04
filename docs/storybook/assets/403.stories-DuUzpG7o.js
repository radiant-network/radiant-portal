import{j as t}from"./iframe-BXBRzL1c.js";import{E as e}from"./403-BrxSxOJS.js";import{B as i}from"./button-CnDkH2FJ.js";import{a as s}from"./story-section-G0DD0yKl.js";import"./preload-helper-PPVm8Dsz.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-8PmMV6BK.js";import"./main-navbar-lang-switcher-C-18y_9g.js";import"./i18n-DUK-WuJ6.js";import"./index-DYAaY2Yf.js";import"./action-button-CiX5XSNN.js";import"./dropdown-menu-Dj2Zjq4n.js";import"./index-Buei5AJu.js";import"./index-C0UyXbDn.js";import"./check-BOVnNvmn.js";import"./circle-ZGZFIAr_.js";import"./separator-D6E9NYhF.js";const h={title:"Layout/Page Error/403",component:e,parameters:{layout:"fullscreen",docs:{description:{component:"Authenticated but lacks tenant access"}}}},r={render:()=>t.jsx(s,{title:"Forbidden - error 403",children:t.jsx(e,{})})},o={render:()=>t.jsx(s,{title:"With custom props",children:t.jsx(e,{title:"Custom title",message:"Custom message",extra:t.jsx(i,{variant:"outline",className:"w-full",children:"Custom button"})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Forbidden - error 403">
      <Error403 />
    </StorySection>
}`,...r.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="With custom props">
      <Error403 title="Custom title" message="Custom message" extra={<Button variant="outline" className="w-full">
            Custom button
          </Button>} />
    </StorySection>
}`,...o.parameters?.docs?.source}}};const F=["Forbidden403","Forbidden403CustomProps"];export{r as Forbidden403,o as Forbidden403CustomProps,F as __namedExportsOrder,h as default};
