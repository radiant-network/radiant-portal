import{j as t}from"./iframe-BZB1EZgz.js";import{E as e}from"./403-DSnqBtKP.js";import{B as i}from"./button-D8HFhMXd.js";import{a as s}from"./story-section-BDrkXYOE.js";import"./preload-helper-PPVm8Dsz.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-CxU2bW_8.js";import"./main-navbar-lang-switcher-BG69NrFp.js";import"./i18n-CQ0WOrKs.js";import"./index-B0w-Ttvh.js";import"./action-button-DqxIOjdS.js";import"./dropdown-menu-C1MQh_QQ.js";import"./index-CA8vCrAG.js";import"./index-DjZJgZTe.js";import"./check-HFbzKaow.js";import"./circle-Dh8DU7_a.js";import"./separator-CcqX_m5t.js";const h={title:"Layout/Page Error/403",component:e,parameters:{layout:"fullscreen",docs:{description:{component:"Authenticated but lacks tenant access"}}}},r={render:()=>t.jsx(s,{title:"Forbidden - error 403",children:t.jsx(e,{})})},o={render:()=>t.jsx(s,{title:"With custom props",children:t.jsx(e,{title:"Custom title",message:"Custom message",extra:t.jsx(i,{variant:"outline",className:"w-full",children:"Custom button"})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
