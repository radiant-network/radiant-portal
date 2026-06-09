import{j as e}from"./iframe-CKiE6Nsl.js";import{I as c}from"./input-search-F_PdS4LD.js";import{a as i,b as n}from"./story-section-CH_OnjTD.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-Cy6cW3zr.js";import"./index-9FrZzKeW.js";import"./action-button-skYf-9FP.js";import"./dropdown-menu-DVEsqO9M.js";import"./index-CpQDBSVi.js";import"./index-CZWpuSYx.js";import"./check-CQNASh0O.js";import"./circle-B0UttFdb.js";import"./separator-D0Yo1ak_.js";import"./i18n-ZTG9nugd.js";import"./index-CAH79BqJ.js";import"./input-CsDYrOFL.js";import"./search-DE8MvPT1.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:s}=__STORYBOOK_MODULE_TEST__,B={title:"Components/Inputs/Input Search",component:c,args:{value:"Search value",onSearch:s(),onChange:s(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>e.jsx(i,{title:"Sizes",children:p.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(c,{size:r,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
