import{j as e}from"./iframe-C3tvUR1J.js";import{I as i}from"./input-search-C0baNqBT.js";import{a as c,b as n}from"./story-section-Cml820jU.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-DBxIrY1M.js";import"./index-wNbfclQ1.js";import"./action-button-BNzMztdM.js";import"./dropdown-menu-6SkrUZiL.js";import"./index-B_di4gWb.js";import"./index-BQlRfD1v.js";import"./check-Cewv9fI2.js";import"./circle-B5BEDuQC.js";import"./separator-DYKEDePW.js";import"./i18n-sXy_IXHd.js";import"./index-COGJCRuB.js";import"./index-t1n2C8Aq.js";import"./input-CaIta0Ot.js";import"./search-rOHXVfJt.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:s}=__STORYBOOK_MODULE_TEST__,E={title:"Components/Inputs/Input Search",component:i,args:{value:"Search value",onSearch:s(),onChange:s(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>e.jsx(c,{title:"Sizes",children:p.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(i,{size:r,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};const L=["Sizes"];export{o as Sizes,L as __namedExportsOrder,E as default};
