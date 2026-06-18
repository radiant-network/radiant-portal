import{j as e}from"./iframe-pCkdMSW4.js";import{I as i}from"./input-search-Cbf-uxPH.js";import{a as c,b as n}from"./story-section-BWCYvdHs.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-CvjWkbHj.js";import"./index-C-yKeQSQ.js";import"./action-button-CgBxcC7H.js";import"./dropdown-menu-pFkWlMk4.js";import"./index-BCDqYVKf.js";import"./index-B5hhSGrZ.js";import"./check-CHUKpJ0A.js";import"./circle-DE6Uhsos.js";import"./separator-BG0cX3CB.js";import"./i18n-Cv0t7e2j.js";import"./index-DyQxDMRQ.js";import"./index-wBlvzvCM.js";import"./input-Casv7tlD.js";import"./search-C7jbxdpk.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:s}=__STORYBOOK_MODULE_TEST__,E={title:"Components/Inputs/Input Search",component:i,args:{value:"Search value",onSearch:s(),onChange:s(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>e.jsx(c,{title:"Sizes",children:p.map(r=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(n,{children:r}),e.jsx(i,{size:r,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
