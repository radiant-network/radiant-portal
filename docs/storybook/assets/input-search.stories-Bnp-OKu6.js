import{j as r}from"./iframe-DwZVKEmc.js";import{I as n}from"./input-search-yQLBQAN0.js";import{s as d}from"./utils-Be9R-1lk.js";import"./preload-helper-Dp1pzeXC.js";import"./button-B4bE3_Fh.js";import"./index-C1UQ77wj.js";import"./action-button-uSHsiLgL.js";import"./dropdown-menu-DCNbL4UQ.js";import"./index-Chf9uvwf.js";import"./index-D_qo1p9J.js";import"./check-adWPXh5W.js";import"./circle-BC_dxGpQ.js";import"./separator-CxLyQWCL.js";import"./i18n-P_eepega.js";import"./input-mscWoBWY.js";import"./search-CuQKvYxe.js";const{action:t}=__STORYBOOK_MODULE_ACTIONS__,{fn:c}=__STORYBOOK_MODULE_TEST__,z={title:"Inputs/Input Search",component:n,args:{value:"Search value",onSearch:c(),onChange:c(),placeholder:"Placeholder",searchButtonProps:{}}},o={render:()=>r.jsx("div",{className:"flex flex-col gap-2",children:d.map(e=>r.jsxs("div",{children:[r.jsx("span",{children:e}),r.jsx(n,{size:e,onChange:a=>t("onChange")(a),onSearch:a=>{t("onSearch")(a)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},e))})},s={render:()=>r.jsx(n,{onChange:e=>t("onChange")(e),onSearch:e=>(t("onSearch")(e),new Promise(a=>setTimeout(()=>a(),1e3))),className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})};var p,l,i;o.parameters={...o.parameters,docs:{...(p=o.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
}`,...(i=(l=o.parameters)==null?void 0:l.docs)==null?void 0:i.source}}};var m,u,h;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => <InputSearch onChange={e => action('onChange')(e)} onSearch={value => {
    action('onSearch')(value);
    return new Promise(resolve => setTimeout(() => resolve(), 1000));
  }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
    color: 'primary',
    variant: 'default'
  }} />
}`,...(h=(u=s.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};const E=["Default","Async"];export{s as Async,o as Default,E as __namedExportsOrder,z as default};
