import{j as o}from"./jsx-runtime-D_zvdyIk.js";import{a as s}from"./index-B-lxVbXh.js";import{f as i}from"./index-FPNDRHs_.js";import{I as p}from"./input-search-BWXZFmZo.js";import{s as d}from"./utils-Be9R-1lk.js";import"./v4-CtRu48qb.js";import"./index-CBYaBgW8.js";import"./button-B-v8Gzli.js";import"./index-C-d7IIsQ.js";import"./index-Dy6y0jaD.js";import"./action-button-BssP5rd1.js";import"./dropdown-menu-DPm_FhUX.js";import"./index-D9mtqW9-.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./index-BCzuw4Jg.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./Combination-CrkgvPnV.js";import"./index-iyInEJkZ.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfgEC-S9.js";import"./createLucideIcon-B119WVF5.js";import"./index-DnEzm5An.js";import"./utils-CDN07tui.js";import"./check-DSe_yRo5.js";import"./separator-ChZWIdMg.js";import"./tooltip-W7g5_Dow.js";import"./index-CfXWnpL9.js";import"./button.variants-Du9eY_ux.js";import"./index-C66Dxnp2.js";import"./spinner-DMuui_2m.js";import"./i18n-xmjcbfpT.js";import"./iframe-CmfCMdQ8.js";import"./i18next-CYn7LYXT.js";import"./input-Bj-MPxry.js";import"./search-DKmUqS9g.js";const $={title:"Inputs/Input Search",component:p,args:{value:"Search value",onSearch:i(),onChange:i(),placeholder:"Placeholder",searchButtonProps:{}}},a={render:()=>o.jsx("div",{className:"flex flex-col gap-2",children:d.map(r=>o.jsxs("div",{children:[o.jsx("span",{children:r}),o.jsx(p,{size:r,onChange:e=>s("onChange")(e),onSearch:e=>{s("onSearch")(e)},className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})]},r))})},t={render:()=>o.jsx(p,{onChange:r=>s("onChange")(r),onSearch:r=>(s("onSearch")(r),new Promise(e=>setTimeout(()=>e(),1e3))),className:"max-w-[300px]",placeholder:"Placeholder",autoFocus:!0,searchButtonProps:{color:"primary",variant:"default"}})};var m,n,c;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(c=(n=a.parameters)==null?void 0:n.docs)==null?void 0:c.source}}};var l,u,h;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => <InputSearch onChange={e => action('onChange')(e)} onSearch={value => {
    action('onSearch')(value);
    return new Promise(resolve => setTimeout(() => resolve(), 1000));
  }} className="max-w-[300px]" placeholder="Placeholder" autoFocus searchButtonProps={{
    color: 'primary',
    variant: 'default'
  }} />
}`,...(h=(u=t.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};const rr=["Default","Async"];export{t as Async,a as Default,rr as __namedExportsOrder,$ as default};
