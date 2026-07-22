import{j as e}from"./iframe-BZB1EZgz.js";import{I as c}from"./input-search-Dg9P208G.js";import{a as i,b as n}from"./story-section-BDrkXYOE.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-D8HFhMXd.js";import"./action-button-DqxIOjdS.js";import"./dropdown-menu-C1MQh_QQ.js";import"./index-CA8vCrAG.js";import"./index-DjZJgZTe.js";import"./check-HFbzKaow.js";import"./circle-Dh8DU7_a.js";import"./separator-CcqX_m5t.js";import"./i18n-CQ0WOrKs.js";import"./index-B0w-Ttvh.js";import"./input-n9l0LaJt.js";import"./search-D_3yD3tJ.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:s}=__STORYBOOK_MODULE_TEST__,P={title:"Components/Inputs/Input Search",component:c,args:{value:"Search value",onSearch:s(),onChange:s(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>e.jsx(i,{title:"Sizes",children:p.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(c,{size:r,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
