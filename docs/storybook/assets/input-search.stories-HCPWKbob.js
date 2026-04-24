import{j as r}from"./iframe-CMnhLHOf.js";import{I as n}from"./input-search-D-JlET6k.js";import{s as d}from"./utils-Be9R-1lk.js";import"./preload-helper-Dp1pzeXC.js";import"./button-CwgxGnP_.js";import"./index-BUtUgFZQ.js";import"./action-button-C6O-ZiMa.js";import"./dropdown-menu-DuT_GNFJ.js";import"./index-EMqEdC3c.js";import"./circle-BEBmorTE.js";import"./check-DMtyfd-6.js";import"./separator-DKyTZOMp.js";import"./i18n-D_gPNxag.js";import"./input-D1H6aqHJ.js";import"./search-DKlY15b7.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:c}=__STORYBOOK_MODULE_TEST__,w={title:"Inputs/Input Search",component:n,args:{value:"Search value",onSearch:c(),onChange:c(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>r.jsx("div",{className:"flex flex-col gap-2",children:d.map(e=>r.jsxs("div",{children:[r.jsx("span",{children:e}),r.jsx(n,{size:e,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},e))})},s={render:()=>r.jsx(n,{onChange:e=>t("onChange")(e),onSearch:e=>(t("onSearch")(e),new Promise(a=>setTimeout(()=>a(),1e3))),className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})};var l,p,i;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
