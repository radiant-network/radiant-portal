import{j as t}from"./iframe-C_dP7gnO.js";import{E as e}from"./403-C0H6pQo-.js";import{B as i}from"./button-BlI6yvoB.js";import{a as s}from"./story-section-J70NlQOA.js";import"./preload-helper-PPVm8Dsz.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-f8Hia41T.js";import"./main-navbar-lang-switcher-Br2HJpPu.js";import"./i18n-3IdnC225.js";import"./index-BeB-c5z7.js";import"./action-button-DmaA9Ug6.js";import"./dropdown-menu-CkkqqYnf.js";import"./index-BiuKl8gy.js";import"./index-B6yDnkAE.js";import"./check-CtmdECFN.js";import"./circle-Cag81XI_.js";import"./separator-D3keCDl2.js";const h={title:"Layout/Page Error/403",component:e,parameters:{layout:"fullscreen",docs:{description:{component:"Authenticated but lacks tenant access"}}}},r={render:()=>t.jsx(s,{title:"Forbidden - error 403",children:t.jsx(e,{})})},o={render:()=>t.jsx(s,{title:"With custom props",children:t.jsx(e,{title:"Custom title",message:"Custom message",extra:t.jsx(i,{variant:"outline",className:"w-full",children:"Custom button"})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
