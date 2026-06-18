import{j as e}from"./iframe-B_jnDYRw.js";import{I as i}from"./input-search-DnEM9Mz9.js";import{a as c,b as n}from"./story-section-4RqDghQR.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CspqOU_f.js";import"./index-DfeYIiAg.js";import"./action-button-sxXzUOnj.js";import"./dropdown-menu-DdhXS6nr.js";import"./index-3VdlNnLx.js";import"./index-J2Zi4jnN.js";import"./check-DnHgWdHC.js";import"./circle-DM65GupB.js";import"./separator-C2WPDGRO.js";import"./i18n-Dc-D14XP.js";import"./index-BnQ-eqKb.js";import"./index-BLQqHNw6.js";import"./input-DPMEKcCK.js";import"./search-BxDf4MKB.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:s}=__STORYBOOK_MODULE_TEST__,E={title:"Components/Inputs/Input Search",component:i,args:{value:"Search value",onSearch:s(),onChange:s(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>e.jsx(c,{title:"Sizes",children:p.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(i,{size:r,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
