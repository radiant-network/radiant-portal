import{j as o}from"./jsx-runtime-D_zvdyIk.js";import{a as s}from"./index-B-lxVbXh.js";import{f as n}from"./index-DtL3pAzF.js";import{I as p}from"./input-search-FoSnIjhW.js";import{s as d}from"./utils-Be9R-1lk.js";import"./v4-CtRu48qb.js";import"./index-CGj_12n1.js";import"./button-BDzUyvby.js";import"./index-B7CJuYpG.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./action-button-DglMD9AQ.js";import"./utils-D-KgF5mV.js";import"./dropdown-menu-CxUCUeqn.js";import"./index-CcLUv2_A.js";import"./index-C8qycyLa.js";import"./index-Ch7hUksi.js";import"./Combination-DwMjbv-J.js";import"./index-DceihmLw.js";import"./index-A6VgBoaw.js";import"./index-CRLeYu_h.js";import"./index-CIckazZy.js";import"./check-DRc1RmCY.js";import"./createLucideIcon-8Lr1oLzj.js";import"./separator-IJKoE26K.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-anNhU4TT.js";import"./index-BDsjCN7N.js";import"./i18n-9lkLPkgi.js";import"./iframe-CxA8_9go.js";import"./i18next-DOi7g2fS.js";import"./input-Dm5winle.js";import"./search-DqA1hdnz.js";const X={title:"Inputs/Input Search",component:p,args:{value:"Search value",onSearch:n(),onChange:n(),placeholder:"Placeholder",searchButtonProps:{}}},a={render:()=>o.jsx("div",{className:"flex flex-col gap-2",children:d.map(r=>o.jsxs("div",{children:[o.jsx("span",{children:r}),o.jsx(p,{size:r,onChange:e=>s("onChange")(e),onSearch:e=>{s("onSearch")(e)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})},t={render:()=>o.jsx(p,{onChange:r=>s("onChange")(r),onSearch:r=>(s("onSearch")(r),new Promise(e=>setTimeout(()=>e(),1e3))),className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})};var c,i,m;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(m=(i=a.parameters)==null?void 0:i.docs)==null?void 0:m.source}}};var l,u,h;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => <InputSearch onChange={e => action('onChange')(e)} onSearch={value => {
    action('onSearch')(value);
    return new Promise(resolve => setTimeout(() => resolve(), 1000));
  }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
    color: 'primary',
    variant: 'default'
  }} />
}`,...(h=(u=t.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};const Y=["Default","Async"];export{t as Async,a as Default,Y as __namedExportsOrder,X as default};
