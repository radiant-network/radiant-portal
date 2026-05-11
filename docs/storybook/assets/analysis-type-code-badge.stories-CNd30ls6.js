import{j as e}from"./iframe-CdetP1X0.js";import{A as t}from"./analysis-type-code-badge-BoBXBtNI.js";import{C as d,A as r}from"./applications-config-DvyfV6tQ.js";import{B as p}from"./chunk-UVKPFVEO-BC8YNRtx.js";import"./preload-helper-Dp1pzeXC.js";import"./badge-DiTV7c-v.js";import"./separator-DWpVdauv.js";import"./index-BbVp5V_G.js";import"./x-Coq7ggOF.js";import"./i18n-Cg4CY2fo.js";import"./users-CZqlHEfX.js";import"./user-Bh0Vuqik.js";const g={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},h={title:"Badges/Analysis Type Code Badge",component:t,args:{},decorators:[i=>e.jsx(p,{children:e.jsx(d,{config:g,children:e.jsx(i,{})})})]},a={args:{code:"somatic"},render:i=>e.jsx("div",{className:"flex gap-2",children:["somatic","germline","germline_family"].map((m,c)=>e.jsx(t,{code:m},c))})};var o,s,n;a.parameters={...a.parameters,docs:{...(o=a.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    code: 'somatic' as AnalysisTypeCode
  },
  render: _args => <div className="flex gap-2">
      {['somatic', 'germline', 'germline_family'].map((code, index) => <AnalysisTypeCodeBadge key={index} code={code as AnalysisTypeCode} />)}
    </div>
}`,...(n=(s=a.parameters)==null?void 0:s.docs)==null?void 0:n.source}}};const D=["Default"];export{a as Default,D as __namedExportsOrder,h as default};
