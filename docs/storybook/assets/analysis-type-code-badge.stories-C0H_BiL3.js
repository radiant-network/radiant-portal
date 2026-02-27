import{j as e}from"./iframe-DQ1t6oJB.js";import{A as t}from"./analysis-type-code-badge-D51dVd-I.js";import{C as d,A as a}from"./applications-config-CSk71pEA.js";import{B as p}from"./chunk-EPOLDU6W-5guO-eFT.js";import"./preload-helper-Dp1pzeXC.js";import"./badge-jNZs0a3S.js";import"./separator-DgpYhT7H.js";import"./index-BxNbdRnE.js";import"./x-ChjgsgCE.js";import"./i18n-CxZaJApP.js";import"./users-B1HTaVS8.js";import"./user-DkizaDAL.js";const g={variant_entity:{app_id:a.variant_entity},snv_occurrence:{app_id:a.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:a.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},h={title:"Badges/Analysis Type Code Badge",component:t,args:{},decorators:[o=>e.jsx(p,{children:e.jsx(d,{config:g,children:e.jsx(o,{})})})]},r={args:{code:"somatic"},render:o=>e.jsx("div",{className:"flex gap-2",children:["somatic","germline","germline_family"].map((c,m)=>e.jsx(t,{code:c},m))})};var i,s,n;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    code: 'somatic' as AnalysisTypeCode
  },
  render: _args => <div className="flex gap-2">
      {['somatic', 'germline', 'germline_family'].map((code, index) => <AnalysisTypeCodeBadge key={index} code={code as AnalysisTypeCode} />)}
    </div>
}`,...(n=(s=r.parameters)==null?void 0:s.docs)==null?void 0:n.source}}};const D=["Default"];export{r as Default,D as __namedExportsOrder,h as default};
