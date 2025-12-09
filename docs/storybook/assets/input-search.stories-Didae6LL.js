import{j as o}from"./jsx-runtime-D_zvdyIk.js";import{a as s}from"./index-B-lxVbXh.js";import{f as n}from"./index-DtL3pAzF.js";import{I as p}from"./input-search-tQ5mZpi8.js";import{s as d}from"./utils-Be9R-1lk.js";import"./v4-CtRu48qb.js";import"./index-CBYaBgW8.js";import"./button-J0tNcHDR.js";import"./index-Dut9wsGU.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./action-button-KkvxmIWD.js";import"./utils-D-KgF5mV.js";import"./dropdown-menu-BJyjb2OL.js";import"./index-Ba5mf8A5.js";import"./index-C6lL4ijz.js";import"./index-CJAxgcjH.js";import"./Combination-B-dCT06H.js";import"./index-DrGCp3O6.js";import"./index-BtWW-1ow.js";import"./index-BZEiv_1o.js";import"./index-ycEarWk3.js";import"./check-DSe_yRo5.js";import"./createLucideIcon-B119WVF5.js";import"./separator-B36Ht569.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./spinner-CKwzofCp.js";import"./tooltip-BjBxR1Ac.js";import"./index-BiH9rn-5.js";import"./i18n-ByrszOZh.js";import"./iframe-CcDRaQeA.js";import"./i18next-CYn7LYXT.js";import"./input-Dm5winle.js";import"./search-DKmUqS9g.js";const X={title:"Inputs/Input Search",component:p,args:{value:"Search value",onSearch:n(),onChange:n(),placeholder:"Placeholder",searchButtonProps:{}}},a={render:()=>o.jsx("div",{className:"flex flex-col gap-2",children:d.map(r=>o.jsxs("div",{children:[o.jsx("span",{children:r}),o.jsx(p,{size:r,onChange:e=>s("onChange")(e),onSearch:e=>{s("onSearch")(e)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})},t={render:()=>o.jsx(p,{onChange:r=>s("onChange")(r),onSearch:r=>(s("onSearch")(r),new Promise(e=>setTimeout(()=>e(),1e3))),className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})};var c,i,m;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
