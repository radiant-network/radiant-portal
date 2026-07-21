import{j as e}from"./iframe-BOkj70l8.js";import{I as c}from"./input-search-RPAIAlxi.js";import{a as i,b as n}from"./story-section-DQYgi0mB.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-tn5oIYKb.js";import"./action-button-CeXyayKt.js";import"./dropdown-menu-CQVY1paU.js";import"./index-CTJyEr6n.js";import"./index-fVILgqWX.js";import"./check-DI71rXD4.js";import"./circle-BIlPbk8H.js";import"./separator-MMk7clR0.js";import"./i18n-C0VA3Pzj.js";import"./index-BiVUSCho.js";import"./input-NnRsrRSq.js";import"./search-BIVXZrsJ.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:s}=__STORYBOOK_MODULE_TEST__,P={title:"Components/Inputs/Input Search",component:c,args:{value:"Search value",onSearch:s(),onChange:s(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>e.jsx(i,{title:"Sizes",children:p.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(c,{size:r,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
