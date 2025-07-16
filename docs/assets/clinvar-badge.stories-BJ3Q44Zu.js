import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as t,a as o}from"./clinvar-badge-B-8PnL9B.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./badge-D_UfbDzk.js";import"./utils-D-KgF5mV.js";import"./index-C66Dxnp2.js";import"./x-ClsbQ_rO.js";import"./createLucideIcon-BMP5cxO1.js";import"./index-DQLiH3RP.js";import"./tooltip-2a7OmUZw.js";import"./index-b4Krvw3J.js";import"./index-CECE1b4A.js";import"./index-CJPVTaBz.js";import"./index-DZeBqZZX.js";import"./index-CS2et-gJ.js";import"./index-BlJj-Uol.js";import"./i18n-D-P4Fd2b.js";import"./iframe-C32Di235.js";const h={title:"Feature/Variant/ClinVar Badge",component:t,args:{value:"other",variant:"neutral"}},r={render:()=>e.jsx("div",{className:"flex flex-col gap-2 items-start",children:Object.keys(o).map(a=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(t,{value:a}),e.jsx(t,{value:a,abbreviated:!0})]},a))})};var i,s,m;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => {
    return <div className="flex flex-col gap-2 items-start">
        {Object.keys(ClinVarValueMap).map(key => <div className="flex items-center gap-2" key={key}>
            <ClinVarBadge value={key} />
            <ClinVarBadge value={key} abbreviated />
          </div>)}
      </div>;
  }
}`,...(m=(s=r.parameters)==null?void 0:s.docs)==null?void 0:m.source}}};const O=["Default"];export{r as Default,O as __namedExportsOrder,h as default};
