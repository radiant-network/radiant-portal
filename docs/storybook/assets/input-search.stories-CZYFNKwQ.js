import{j as e}from"./iframe-Bmo5s0S7.js";import{I as c}from"./input-search-NCPE0lKq.js";import{a as i,b as n}from"./story-section-DK9Ca-WM.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button---ZJYA-K.js";import"./index-fUmLsCzv.js";import"./action-button-BsC9knCl.js";import"./dropdown-menu-RHvipy6t.js";import"./index-CYQD8SjJ.js";import"./index-D_ub_t65.js";import"./check-32E8HpGv.js";import"./circle-C1aHhR8R.js";import"./separator-CQaINmcN.js";import"./i18n-Dk7NL_SC.js";import"./index-Ral5BcRB.js";import"./input-DKMllPhg.js";import"./search-BqR8-Sy9.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:s}=__STORYBOOK_MODULE_TEST__,B={title:"Components/Inputs/Input Search",component:c,args:{value:"Search value",onSearch:s(),onChange:s(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>e.jsx(i,{title:"Sizes",children:p.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(c,{size:r,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
