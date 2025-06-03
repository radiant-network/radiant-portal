import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as t,a as o}from"./clinvar-badge-B_kQWbb0.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./badge-eNPbaZw4.js";import"./utils-CytzSlOG.js";import"./index-C66Dxnp2.js";import"./x-CjbLemEF.js";import"./createLucideIcon-j2ULFFRy.js";import"./index-CTzypqlY.js";import"./tooltip-Cs6E2UgH.js";import"./index-DSqg7KUl.js";import"./index-8Ey6BpB7.js";import"./index-X_f_OX5J.js";import"./index-CqHHZPb-.js";import"./index-BFdFQidM.js";import"./index-Y7TeOx8d.js";import"./index-BEp8L1N2.js";import"./index-DGfkHXcP.js";import"./i18n-Dpg5tE_X.js";import"./iframe-D3g85CjP.js";const D={title:"Feature/Variant/ClinVar Badge",component:t,args:{value:"other",variant:"slate"}},r={render:()=>e.jsx("div",{className:"flex flex-col gap-2 items-start",children:Object.keys(o).map(a=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(t,{value:a}),e.jsx(t,{value:a,abbreviated:!0})]},a))})};var i,s,m;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => {
    return <div className="flex flex-col gap-2 items-start">
        {Object.keys(ClinVarValueMap).map(key => <div className="flex items-center gap-2" key={key}>
            <ClinVarBadge value={key} />
            <ClinVarBadge value={key} abbreviated />
          </div>)}
      </div>;
  }
}`,...(m=(s=r.parameters)==null?void 0:s.docs)==null?void 0:m.source}}};const E=["Default"];export{r as Default,E as __namedExportsOrder,D as default};
