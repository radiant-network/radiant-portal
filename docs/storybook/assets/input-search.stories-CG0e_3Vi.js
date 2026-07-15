import{j as e}from"./iframe-kLaNX2HI.js";import{I as c}from"./input-search-12c6Kpii.js";import{a as i,b as n}from"./story-section-YShHgFMq.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-lcKTI4HU.js";import"./action-button-D3l4bIzZ.js";import"./dropdown-menu-85xmnBFd.js";import"./index-fXaV-lio.js";import"./index-B2vLf8-Q.js";import"./check-NiNg2u4X.js";import"./circle-yHcXqLnR.js";import"./separator-BTZwSWvT.js";import"./i18n-ZHel4DsP.js";import"./index-BCXviJZk.js";import"./input-BgVb13VO.js";import"./search-DqOCya6u.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:s}=__STORYBOOK_MODULE_TEST__,P={title:"Components/Inputs/Input Search",component:c,args:{value:"Search value",onSearch:s(),onChange:s(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>e.jsx(i,{title:"Sizes",children:p.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(c,{size:r,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
