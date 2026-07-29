import{j as t}from"./iframe-BCdw1Zpv.js";import{E as e}from"./403-BpbSm9dO.js";import{B as i}from"./button-CCDrrqA6.js";import{a as s}from"./story-section-DgtXw29J.js";import"./preload-helper-PPVm8Dsz.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-BaR1FEqz.js";import"./main-navbar-lang-switcher-DZu3K9fR.js";import"./i18n-BerkWO00.js";import"./index-mpFtsMNW.js";import"./action-button-C_F8twkk.js";import"./dropdown-menu-HBuGdxYI.js";import"./index-BS8cZKMG.js";import"./index-COD-M8Go.js";import"./check-DAngudb0.js";import"./circle-DY_U8LIw.js";import"./separator-CxLC1eka.js";const h={title:"Layout/Page Error/403",component:e,parameters:{layout:"fullscreen",docs:{description:{component:"Authenticated but lacks tenant access"}}}},r={render:()=>t.jsx(s,{title:"Forbidden - error 403",children:t.jsx(e,{})})},o={render:()=>t.jsx(s,{title:"With custom props",children:t.jsx(e,{title:"Custom title",message:"Custom message",extra:t.jsx(i,{variant:"outline",className:"w-full",children:"Custom button"})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
