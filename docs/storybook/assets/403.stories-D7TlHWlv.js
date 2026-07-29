import{j as t}from"./iframe-BwgnBgbs.js";import{E as e}from"./403-DTdwoXGJ.js";import{B as i}from"./button-CVRshTFc.js";import{a as s}from"./story-section-CUmPhl8T.js";import"./preload-helper-PPVm8Dsz.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-Cz1IxsL7.js";import"./main-navbar-lang-switcher-CfCiSgPt.js";import"./i18n-q3nsv9wg.js";import"./index-9G14H1gK.js";import"./action-button-DfTzlCGI.js";import"./dropdown-menu-CUFPYByL.js";import"./index-E0yEPtnq.js";import"./index-BbLf2bTU.js";import"./check-BmfiAxZ2.js";import"./circle-C8kpohc-.js";import"./separator-B4ksv8En.js";const h={title:"Layout/Page Error/403",component:e,parameters:{layout:"fullscreen",docs:{description:{component:"Authenticated but lacks tenant access"}}}},r={render:()=>t.jsx(s,{title:"Forbidden - error 403",children:t.jsx(e,{})})},o={render:()=>t.jsx(s,{title:"With custom props",children:t.jsx(e,{title:"Custom title",message:"Custom message",extra:t.jsx(i,{variant:"outline",className:"w-full",children:"Custom button"})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
