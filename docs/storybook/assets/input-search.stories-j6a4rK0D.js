import{j as e}from"./iframe-BlZH41kV.js";import{I as c}from"./input-search-R93d4Czw.js";import{a as i,b as n}from"./story-section-B_UFTDX5.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CqF4mGFC.js";import"./index-DwsKsEj-.js";import"./action-button-Cf_N4wCi.js";import"./dropdown-menu-DY3d4vy_.js";import"./index-Dbpq7NXz.js";import"./index-D1tyQsCC.js";import"./check-D4JmoqeB.js";import"./circle-C5iPYBJL.js";import"./separator-D9vn1ACq.js";import"./i18n-CwekqNtM.js";import"./index-C23weHmj.js";import"./input-BJvy2A5M.js";import"./search-C1QKPUnG.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:s}=__STORYBOOK_MODULE_TEST__,B={title:"Components/Inputs/Input Search",component:c,args:{value:"Search value",onSearch:s(),onChange:s(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>e.jsx(i,{title:"Sizes",children:p.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(c,{size:r,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
