import{j as a}from"./iframe-X1FdiBKE.js";import{I as n}from"./input-search-dgDWS3P8.js";import{s as p}from"./utils-Be9R-1lk.js";import"./preload-helper-PPVm8Dsz.js";import"./button-C1dmQasv.js";import"./index-BerhZw8G.js";import"./action-button-D2HkTc1A.js";import"./dropdown-menu-B8dOc9pX.js";import"./index-DnCxSPBU.js";import"./index-DfO9iG95.js";import"./check-CpvZoXR-.js";import"./circle-C0x1jrVb.js";import"./separator-BcF0hBxw.js";import"./i18n-DsLlobA0.js";import"./index-BoMd93ow.js";import"./input-DnrAC2PS.js";import"./search-CrDJxrOj.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:c}=__STORYBOOK_MODULE_TEST__,B={title:"Inputs/Input Search",component:n,args:{value:"Search value",onSearch:c(),onChange:c(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>a.jsx("div",{className:"flex flex-col gap-2",children:p.map(e=>a.jsxs("div",{children:[a.jsx("span",{children:e}),a.jsx(n,{size:e,onChange:r=>t("onChange")(r),onSearch:r=>{t("onSearch")(r)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},e))})},s={render:()=>a.jsx(n,{onChange:e=>t("onChange")(e),onSearch:e=>(t("onSearch")(e),new Promise(r=>setTimeout(()=>r(),1e3))),className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
