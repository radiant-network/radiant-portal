import{j as e}from"./iframe-C5ghdKPC.js";import{I as c}from"./input-search-TjpqOqdp.js";import{a as i,b as n}from"./story-section-CLlhZcHq.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-Bv6IhCvK.js";import"./action-button-DJGIFk-q.js";import"./dropdown-menu-DoOCM-LE.js";import"./index-B--nswC9.js";import"./index-ARASfFZ8.js";import"./check-CWaWZXj3.js";import"./circle-IiyuoDyT.js";import"./separator-Pm6qs9Vj.js";import"./i18n-BPASaW18.js";import"./index-BhpGQa6j.js";import"./input-CEOktzmf.js";import"./search-tzLq7WKF.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:s}=__STORYBOOK_MODULE_TEST__,P={title:"Components/Inputs/Input Search",component:c,args:{value:"Search value",onSearch:s(),onChange:s(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>e.jsx(i,{title:"Sizes",children:p.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(c,{size:r,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
