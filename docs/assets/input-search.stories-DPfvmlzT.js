import{j as u}from"./jsx-runtime-D_zvdyIk.js";import{f as n}from"./index-DtL3pAzF.js";import{a}from"./index-B-lxVbXh.js";import{I as t}from"./input-search-C59TS7Ax.js";import"./v4-CtRu48qb.js";import"./utils-D-KgF5mV.js";import"./button-BzIGdeaI.js";import"./index-COcwYKbe.js";import"./index-CGj_12n1.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./action-button-RO42ldpG.js";import"./dropdown-menu-Bb-Cj6Tn.js";import"./index-CcLUv2_A.js";import"./index-CphM_NEg.js";import"./Combination-Bb6GvI2f.js";import"./index-ButkbYdn.js";import"./index-A6VgBoaw.js";import"./index-BOEjv1S3.js";import"./index-CIckazZy.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-eZCTYbea.js";import"./i18n-gP8jxa47.js";import"./iframe-DrVsasjC.js";import"./context-DkqwYzW-.js";import"./input-CUZJ9Qyj.js";import"./search-DqA1hdnz.js";const M={title:"Inputs/Input Search",component:t,args:{value:"Search value",onSearch:n(),onChange:n(),placeholder:"Placeholder",searchButtonProps:{}}},e={render:()=>u.jsx(t,{onChange:r=>a("onChange")(r),onSearch:r=>{a("onSearch")(r)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"filled"}})},o={render:()=>u.jsx(t,{onChange:r=>a("onChange")(r),onSearch:r=>(a("onSearch")(r),new Promise(h=>setTimeout(()=>h(),1e3))),className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"filled"}})};var p,c,s;e.parameters={...e.parameters,docs:{...(p=e.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => {
    return <InputSearch onChange={e => action('onChange')(e)} onSearch={value => {
      action('onSearch')(value);
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
      color: 'primary',
      variant: 'filled'
    }} />;
  }
}`,...(s=(c=e.parameters)==null?void 0:c.docs)==null?void 0:s.source}}};var m,i,l;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => {
    return <InputSearch onChange={e => action('onChange')(e)} onSearch={value => {
      action('onSearch')(value);
      return new Promise(resolve => setTimeout(() => resolve(), 1000));
    }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
      color: 'primary',
      variant: 'filled'
    }} />;
  }
}`,...(l=(i=o.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const Q=["Default","Async"];export{o as Async,e as Default,Q as __namedExportsOrder,M as default};
