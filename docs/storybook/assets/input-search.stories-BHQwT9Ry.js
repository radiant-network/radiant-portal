import{j as e}from"./iframe-5hjCxaQ_.js";import{I as c}from"./input-search-xS7Q13dN.js";import{a as i,b as n}from"./story-section-Dz-VNK5b.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-BFdsQ3Kp.js";import"./index-526z61a1.js";import"./action-button-Cl-iR9-B.js";import"./dropdown-menu-BxaMWWIo.js";import"./index-NgiKxE6c.js";import"./index-DJkBUnxK.js";import"./check-DQDqWsNZ.js";import"./circle-D6MwNdjA.js";import"./separator-CdreFVRa.js";import"./i18n-BCVPTX9O.js";import"./index-DwABPnsI.js";import"./input-CmvY_rcH.js";import"./search-C96zcjqv.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:s}=__STORYBOOK_MODULE_TEST__,B={title:"Components/Inputs/Input Search",component:c,args:{value:"Search value",onSearch:s(),onChange:s(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>e.jsx(i,{title:"Sizes",children:p.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(c,{size:r,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
