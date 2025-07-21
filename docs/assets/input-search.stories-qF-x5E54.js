import{j as u}from"./jsx-runtime-D_zvdyIk.js";import{f as n}from"./index-B7YJKKKT.js";import{a}from"./index-B-lxVbXh.js";import{I as t}from"./input-search-BDDam_Ks.js";import"./v4-CtRu48qb.js";import"./utils-D-KgF5mV.js";import"./button-Dab86akK.js";import"./index-Dw-eQTPP.js";import"./index-DQLiH3RP.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./ActionButton-BqVcLudk.js";import"./dropdown-menu-Begym49V.js";import"./index-DTwDs4x6.js";import"./index-BkhUCz-k.js";import"./index-Buy_jb7k.js";import"./index-BsCFIxoT.js";import"./index-uZc0PFVk.js";import"./check-DSCf8CVO.js";import"./createLucideIcon-BMP5cxO1.js";import"./button.variants-BQkt_1YJ.js";import"./index-C66Dxnp2.js";import"./ellipsis-BtlAG3ey.js";import"./spinner-DHVcj7-u.js";import"./tooltip-CqCjg2e9.js";import"./i18n-Bu8UxWvx.js";import"./iframe-DZ8au31n.js";import"./input-DyY2UfVx.js";import"./search-DYa5HqpW.js";const K={title:"Data Entry/Inputs/Input Search",component:t,args:{value:"Search value",onSearch:n(),onChange:n(),placeholder:"Placeholder",searchButtonProps:{}}},e={render:()=>u.jsx(t,{onChange:r=>a("onChange")(r),onSearch:r=>{a("onSearch")(r)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"filled"}})},o={render:()=>u.jsx(t,{onChange:r=>a("onChange")(r),onSearch:r=>(a("onSearch")(r),new Promise(h=>setTimeout(()=>h(),1e3))),className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"filled"}})};var c,p,s;e.parameters={...e.parameters,docs:{...(c=e.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => {
    return <InputSearch onChange={e => action('onChange')(e)} onSearch={value => {
      action('onSearch')(value);
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
      color: 'primary',
      variant: 'filled'
    }} />;
  }
}`,...(s=(p=e.parameters)==null?void 0:p.docs)==null?void 0:s.source}}};var m,i,l;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => {
    return <InputSearch onChange={e => action('onChange')(e)} onSearch={value => {
      action('onSearch')(value);
      return new Promise(resolve => setTimeout(() => resolve(), 1000));
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
      color: 'primary',
      variant: 'filled'
    }} />;
  }
}`,...(l=(i=o.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const L=["Default","Async"];export{o as Async,e as Default,L as __namedExportsOrder,K as default};
