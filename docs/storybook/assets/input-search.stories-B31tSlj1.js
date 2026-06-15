import{j as e}from"./iframe-B_cUq_Z_.js";import{I as c}from"./input-search-BUfaHAaQ.js";import{a as i,b as n}from"./story-section-ClDCqoX4.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-D0XB-Gvv.js";import"./index-Bd4j15Rn.js";import"./action-button-B_DYhR_Z.js";import"./dropdown-menu-DW18XKtK.js";import"./index--VPkyeI8.js";import"./index-Bs7sbtKD.js";import"./check-Co9nfzYN.js";import"./circle-D2PEC1dM.js";import"./separator-BpM3i5JH.js";import"./i18n-y5n1cA5u.js";import"./index-CRHX0MN7.js";import"./input-DXai4oDK.js";import"./search-DZaGjqce.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:s}=__STORYBOOK_MODULE_TEST__,B={title:"Components/Inputs/Input Search",component:c,args:{value:"Search value",onSearch:s(),onChange:s(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>e.jsx(i,{title:"Sizes",children:p.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(c,{size:r,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
