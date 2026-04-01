import{j as e}from"./iframe-BW_zLFd2.js";import{A as t}from"./analysis-type-code-badge-CZqC-kOj.js";import{C as d,A as a}from"./applications-config-Clk9B8t1.js";import{B as p}from"./chunk-UVKPFVEO-Ddb-auhH.js";import"./preload-helper-Dp1pzeXC.js";import"./badge-MImvfrTS.js";import"./separator-Dhjz-6If.js";import"./index-CG5xR1wJ.js";import"./x-CCdhgK-q.js";import"./i18n-BJbxNnVp.js";import"./users-B49PXDek.js";import"./user--ejAsGSh.js";const g={variant_entity:{app_id:a.variant_entity},snv_occurrence:{app_id:a.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:a.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},h={title:"Badges/Analysis Type Code Badge",component:t,args:{},decorators:[o=>e.jsx(p,{children:e.jsx(d,{config:g,children:e.jsx(o,{})})})]},r={args:{code:"somatic"},render:o=>e.jsx("div",{className:"flex gap-2",children:["somatic","germline","germline_family"].map((c,m)=>e.jsx(t,{code:c},m))})};var i,s,n;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    code: 'somatic' as AnalysisTypeCode
  },
  render: _args => <div className="flex gap-2">
      {['somatic', 'germline', 'germline_family'].map((code, index) => <AnalysisTypeCodeBadge key={index} code={code as AnalysisTypeCode} />)}
    </div>
}`,...(n=(s=r.parameters)==null?void 0:s.docs)==null?void 0:n.source}}};const D=["Default"];export{r as Default,D as __namedExportsOrder,h as default};
