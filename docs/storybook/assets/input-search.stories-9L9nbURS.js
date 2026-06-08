import{j as e}from"./iframe-Dt4dd9_L.js";import{I as c}from"./input-search-BFHLx7rq.js";import{a as i,b as n}from"./story-section-Ba8l4DMz.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-BHpOt1n5.js";import"./index--YEVJleu.js";import"./action-button-CUVXthKf.js";import"./dropdown-menu-Db1zsnSb.js";import"./index-B3Y_IRPe.js";import"./index-DydgcOJb.js";import"./check-BkrZypcC.js";import"./circle-CQ2dwaF5.js";import"./separator-CHrX4g91.js";import"./i18n-Buhp04UG.js";import"./index-t9s_g_zt.js";import"./input-CK8eo80s.js";import"./search-D_XRA3OL.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:s}=__STORYBOOK_MODULE_TEST__,B={title:"Components/Inputs/Input Search",component:c,args:{value:"Search value",onSearch:s(),onChange:s(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>e.jsx(i,{title:"Sizes",children:p.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(c,{size:r,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
