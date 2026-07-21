import{j as t}from"./iframe-BOkj70l8.js";import{E as e}from"./403-DkKXtwq_.js";import{B as i}from"./button-tn5oIYKb.js";import{a as s}from"./story-section-DQYgi0mB.js";import"./preload-helper-PPVm8Dsz.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-KTxQKqZ0.js";import"./main-navbar-lang-switcher-U0BgklKh.js";import"./i18n-C0VA3Pzj.js";import"./index-BiVUSCho.js";import"./action-button-CeXyayKt.js";import"./dropdown-menu-CQVY1paU.js";import"./index-CTJyEr6n.js";import"./index-fVILgqWX.js";import"./check-DI71rXD4.js";import"./circle-BIlPbk8H.js";import"./separator-MMk7clR0.js";const h={title:"Layout/Page Error/403",component:e,parameters:{layout:"fullscreen",docs:{description:{component:"Authenticated but lacks tenant access"}}}},r={render:()=>t.jsx(s,{title:"Forbidden - error 403",children:t.jsx(e,{})})},o={render:()=>t.jsx(s,{title:"With custom props",children:t.jsx(e,{title:"Custom title",message:"Custom message",extra:t.jsx(i,{variant:"outline",className:"w-full",children:"Custom button"})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
