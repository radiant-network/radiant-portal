import{j as e}from"./iframe-D5nbMH0Z.js";import{I as i}from"./input-search-wfwecx3Z.js";import{a as c,b as n}from"./story-section-DfWRQdTn.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CivLk_fn.js";import"./index-Cc9ovpm8.js";import"./action-button-CRlVI-Q0.js";import"./dropdown-menu-DXt4HdYg.js";import"./index-Coy-0tiE.js";import"./index-C8YmK8nx.js";import"./check-DI_qTPcP.js";import"./circle-C9-1AW9v.js";import"./separator-DOf7FV04.js";import"./i18n-Bdg0oCKu.js";import"./index-inuiUwi3.js";import"./index-CJ_W4xqL.js";import"./input-BhuweRUC.js";import"./search-CEYrUhrQ.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:s}=__STORYBOOK_MODULE_TEST__,E={title:"Components/Inputs/Input Search",component:i,args:{value:"Search value",onSearch:s(),onChange:s(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>e.jsx(c,{title:"Sizes",children:p.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(i,{size:r,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
