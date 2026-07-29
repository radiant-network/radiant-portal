import{j as t}from"./iframe-Ba5Iybcr.js";import{E as e}from"./403-CedN9Usd.js";import{B as i}from"./button-Pc7aOWRa.js";import{a as s}from"./story-section-5UYrVqPJ.js";import"./preload-helper-PPVm8Dsz.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-reRDKzjJ.js";import"./main-navbar-lang-switcher-CldiV7B3.js";import"./i18n-Cy0oM3Ki.js";import"./index-FDvGsyLv.js";import"./action-button-BrZzZe-c.js";import"./dropdown-menu-58R_cXZJ.js";import"./index-DB383bCH.js";import"./index-E7Q1ks-D.js";import"./check-C9wVWpMx.js";import"./circle-DwJaPj0_.js";import"./separator-D1idYbj8.js";const h={title:"Layout/Page Error/403",component:e,parameters:{layout:"fullscreen",docs:{description:{component:"Authenticated but lacks tenant access"}}}},r={render:()=>t.jsx(s,{title:"Forbidden - error 403",children:t.jsx(e,{})})},o={render:()=>t.jsx(s,{title:"With custom props",children:t.jsx(e,{title:"Custom title",message:"Custom message",extra:t.jsx(i,{variant:"outline",className:"w-full",children:"Custom button"})})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
