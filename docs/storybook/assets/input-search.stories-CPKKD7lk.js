import{j as e}from"./iframe-GYMnz-7x.js";import{I as c}from"./input-search-CdtmMBxV.js";import{a as i,b as n}from"./story-section-B8hLDL9V.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-BW7uYpsZ.js";import"./action-button-C5yNblEX.js";import"./dropdown-menu-D8RNBs8V.js";import"./index-DWsE9wOP.js";import"./index-OS3JsfxU.js";import"./check-BxNDYKk2.js";import"./circle-q-mOcdtX.js";import"./separator-CxIJlsta.js";import"./i18n-LMd9zC7u.js";import"./index-CtN1RmEe.js";import"./input-D7Dfp8eO.js";import"./search-CYtZcpyb.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:s}=__STORYBOOK_MODULE_TEST__,P={title:"Components/Inputs/Input Search",component:c,args:{value:"Search value",onSearch:s(),onChange:s(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>e.jsx(i,{title:"Sizes",children:p.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(c,{size:r,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};const B=["Sizes"];export{o as Sizes,B as __namedExportsOrder,P as default};
