import{j as e}from"./iframe-CfiqPze7.js";import{I as c}from"./input-search-BaPjE_vL.js";import{a as i,b as n}from"./story-section-DuGdZxO-.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-BoXZHvQI.js";import"./index-BZH6fmNO.js";import"./action-button-CCiT5Wq2.js";import"./dropdown-menu-DNmiLd3x.js";import"./index-B4wmxKez.js";import"./index-DPFDfypm.js";import"./check-Dmg2ouYX.js";import"./circle-BQIUCCgT.js";import"./separator-BFc4bAvf.js";import"./i18n-reUsGHBL.js";import"./index-iRVpXJFQ.js";import"./input-FhjqvJ12.js";import"./search-QkENTqpl.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:s}=__STORYBOOK_MODULE_TEST__,B={title:"Components/Inputs/Input Search",component:c,args:{value:"Search value",onSearch:s(),onChange:s(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>e.jsx(i,{title:"Sizes",children:p.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(c,{size:r,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <StorySection title="Sizes">
      {sizes.map(size => <div key={size} className="flex flex-col gap-2">
          <StoryLabel>{size}</StoryLabel>
          <InputSearch size={size} onChange={e => action('onChange')(e)} onSearch={value => {
        action('onSearch')(value);
      }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
        color: 'primary',
        variant: 'default'
      }} />
        </div>)}
    </StorySection>
}`,...o.parameters?.docs?.source}}};const E=["Sizes"];export{o as Sizes,E as __namedExportsOrder,B as default};
