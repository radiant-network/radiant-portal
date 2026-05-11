import{j as r}from"./iframe-BWVweZ6L.js";import{I as n}from"./input-search-BgS9ZZHm.js";import{s as d}from"./utils-Be9R-1lk.js";import"./preload-helper-Dp1pzeXC.js";import"./button-CyO2GiBa.js";import"./index-D5uXdybh.js";import"./action-button-B1cMf3Og.js";import"./dropdown-menu-CdJShM6V.js";import"./index-D3WmDdxv.js";import"./circle-D7KzJ1gO.js";import"./check-CL3HXxiZ.js";import"./separator-BeoHuMME.js";import"./i18n-B38pq5Fo.js";import"./input-u3uSLMMa.js";import"./search-HRA4IS6Z.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:c}=__STORYBOOK_MODULE_TEST__,w={title:"Inputs/Input Search",component:n,args:{value:"Search value",onSearch:c(),onChange:c(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>r.jsx("div",{className:"flex flex-col gap-2",children:d.map(e=>r.jsxs("div",{children:[r.jsx("span",{children:e}),r.jsx(n,{size:e,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},e))})},s={render:()=>r.jsx(n,{onChange:e=>t("onChange")(e),onSearch:e=>(t("onSearch")(e),new Promise(a=>setTimeout(()=>a(),1e3))),className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})};var l,p,i;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(i=(p=o.parameters)==null?void 0:p.docs)==null?void 0:i.source}}};var m,u,h;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <InputSearch onChange={e => action('onChange')(e)} onSearch={value => {
    action('onSearch')(value);
    return new Promise(resolve => setTimeout(() => resolve(), 1000));
  }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
    color: 'primary',
    variant: 'default'
  }} />
}`,...(h=(u=s.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};const z=["Default","Async"];export{s as Async,o as Default,z as __namedExportsOrder,w as default};
