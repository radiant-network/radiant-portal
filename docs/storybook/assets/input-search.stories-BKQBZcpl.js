import{j as a}from"./iframe-BH3MSqWK.js";import{I as n}from"./input-search-BorcmlOM.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-BxP9PPaa.js";import"./index-CfauPKxk.js";import"./action-button-DjPcyzdS.js";import"./dropdown-menu-DwRYTMWI.js";import"./index-B6DCGoSV.js";import"./index-Cipz7JOz.js";import"./check-Bk5l44Qw.js";import"./circle-Cyir8aSn.js";import"./separator-DyfWTagX.js";import"./i18n-MpjanH8G.js";import"./index-BSwCZ4xH.js";import"./input-h6d6rGg7.js";import"./search-CWjPsGv_.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:c}=__STORYBOOK_MODULE_TEST__,B={title:"Inputs/Input Search",component:n,args:{value:"Search value",onSearch:c(),onChange:c(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>a.jsx("div",{className:"flex flex-col gap-2",children:p.map(e=>a.jsxs("div",{children:[a.jsx("span",{children:e}),a.jsx(n,{size:e,onChange:r=>t("onChange")(r),onSearch:r=>{t("onSearch")(r)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},e))})},s={render:()=>a.jsx(n,{onChange:e=>t("onChange")(e),onSearch:e=>(t("onSearch")(e),new Promise(r=>setTimeout(()=>r(),1e3))),className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-2">
      {sizes.map(size => <div key={size}>
          <span>{size}</span>
          <InputSearch size={size} onChange={e => action('onChange')(e)} onSearch={value => {
        action('onSearch')(value);
      }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
        color: 'primary',
        variant: 'default'
      }} />
        </div>)}
    </div>
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <InputSearch onChange={e => action('onChange')(e)} onSearch={value => {
    action('onSearch')(value);
    return new Promise(resolve => setTimeout(() => resolve(), 1000));
  }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
    color: 'primary',
    variant: 'default'
  }} />
}`,...s.parameters?.docs?.source}}};const I=["Default","Async"];export{s as Async,o as Default,I as __namedExportsOrder,B as default};
