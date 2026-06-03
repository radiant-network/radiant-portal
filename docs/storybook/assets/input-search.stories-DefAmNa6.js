import{j as e}from"./iframe-KxDQxQDs.js";import{I as c}from"./input-search-as6mDKJ_.js";import{a as i,b as n}from"./story-section-B6HdLg4-.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-DcEb2QoR.js";import"./index-DL5skkIA.js";import"./action-button-zarxO1Cp.js";import"./dropdown-menu-BKe34Zcm.js";import"./index-Obe_1VFm.js";import"./index-C9Hzv6Cn.js";import"./check-OcLjUnTR.js";import"./circle-YicaXG0V.js";import"./separator-RpiEdedA.js";import"./i18n-BnCxB2cP.js";import"./index-CPmIy41W.js";import"./input-BTQft5GN.js";import"./search-DZXdKyod.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:s}=__STORYBOOK_MODULE_TEST__,B={title:"Components/Inputs/Input Search",component:c,args:{value:"Search value",onSearch:s(),onChange:s(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>e.jsx(i,{title:"Sizes",children:p.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(c,{size:r,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
