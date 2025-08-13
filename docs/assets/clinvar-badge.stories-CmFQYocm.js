import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{C as a,a as d}from"./clinvar-badge-CQFiqWUv.js";import"./conditional-wrapper-BBX8pIPQ.js";import"./badge-aQXnmXeU.js";import"./utils-D-KgF5mV.js";import"./index-C66Dxnp2.js";import"./separator-6xmuS_PL.js";import"./index-CGj_12n1.js";import"./index-COcwYKbe.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./x-CubKniSv.js";import"./createLucideIcon-8Lr1oLzj.js";import"./tooltip-Bh6uXa7k.js";import"./index-CcLUv2_A.js";import"./index-CphM_NEg.js";import"./index-CIckazZy.js";import"./index-CbbSLEvm.js";import"./index-A6VgBoaw.js";import"./index-CKNrATXZ.js";import"./i18n-CjMoR66Y.js";import"./iframe-CWLgbHqd.js";import"./context-DkqwYzW-.js";const w={title:"Badges/ClinVar Badge",component:a,args:{value:"other",variant:"neutral"}},r={render:()=>e.jsx("div",{className:"flex flex-col gap-2 items-start",children:Object.keys(d).map(s=>e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:s}),e.jsx(a,{value:s,abbreviated:!0})]},s))})},t={render:()=>e.jsx("div",{className:"flex flex-col gap-2 items-start",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(a,{value:""}),e.jsx(a,{value:"",abbreviated:!0})]})})};var i,m,o;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => {
    return <div className="flex flex-col gap-2 items-start">
        {Object.keys(ClinVarValueMap).map(key => <div className="flex items-center gap-2" key={key}>
            <ClinVarBadge value={key} />
            <ClinVarBadge value={key} abbreviated />
          </div>)}
      </div>;
  }
}`,...(o=(m=r.parameters)==null?void 0:m.docs)==null?void 0:o.source}}};var l,n,p;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => {
    return <div className="flex flex-col gap-2 items-start">
        <div className="flex items-center gap-2">
          <ClinVarBadge value="" />
          <ClinVarBadge value="" abbreviated />
        </div>
      </div>;
  }
}`,...(p=(n=t.parameters)==null?void 0:n.docs)==null?void 0:p.source}}};const z=["Default","NoData"];export{r as Default,t as NoData,z as __namedExportsOrder,w as default};
