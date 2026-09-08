import{j as t}from"./iframe-BC4RzbTe.js";import{E as e}from"./403-B2iaeOIn.js";import{B as i}from"./button-LUczZP4-.js";import{a as s}from"./story-section-DPrmmWzN.js";import"./preload-helper-PPVm8Dsz.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-L2aTJfGZ.js";import"./main-navbar-lang-switcher-BcKQCTah.js";import"./i18n-B_9vMIaN.js";import"./index-nJ2VJ9o6.js";import"./action-button-CC0bpEam.js";import"./dropdown-menu-Baq_OXPj.js";import"./index-CbsMyLW-.js";import"./index-D1ZMpyoR.js";import"./check-CdGhgW-U.js";import"./circle-Ck_AokSU.js";import"./separator-C1ujT8UF.js";const h={title:"Layout/Page Error/403",component:e,parameters:{layout:"fullscreen",docs:{description:{component:"Authenticated but lacks tenant access"}}}},r={render:()=>t.jsx(s,{title:"Forbidden - error 403",children:t.jsx(e,{})})},o={render:()=>t.jsx(s,{title:"With custom props",children:t.jsx(e,{title:"Custom title",message:"Custom message",extra:t.jsx(i,{variant:"outline",className:"w-full",children:"Custom button"})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
