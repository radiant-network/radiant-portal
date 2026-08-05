import{j as t}from"./iframe-BzMpq4Hc.js";import{E as e}from"./403-e4xwTdy_.js";import{B as i}from"./button-G_7WvFjb.js";import{a as s}from"./story-section-DVNANUlR.js";import"./preload-helper-PPVm8Dsz.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-CiniFUrW.js";import"./main-navbar-lang-switcher-CcQBAGiE.js";import"./i18n-DgcYhEYb.js";import"./index-DsnHWkyF.js";import"./action-button-f97mKVJz.js";import"./dropdown-menu-dmEKL98B.js";import"./index-BG0WSpn-.js";import"./index-Cc45Ah96.js";import"./check-BBp2wSs8.js";import"./circle-Cikc3-Oi.js";import"./separator-BoZNDwc5.js";const h={title:"Layout/Page Error/403",component:e,parameters:{layout:"fullscreen",docs:{description:{component:"Authenticated but lacks tenant access"}}}},r={render:()=>t.jsx(s,{title:"Forbidden - error 403",children:t.jsx(e,{})})},o={render:()=>t.jsx(s,{title:"With custom props",children:t.jsx(e,{title:"Custom title",message:"Custom message",extra:t.jsx(i,{variant:"outline",className:"w-full",children:"Custom button"})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
