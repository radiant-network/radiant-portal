import{j as a,S as r}from"./iframe-iq8cIiFW.js";import{A as t}from"./analysis-type-code-badge-CuvdWqfL.js";import{C as c,A as e}from"./applications-config-ic1eUZQg.js";import{a as _}from"./story-section-B8E7zijV.js";import{B as m}from"./chunk-BV7QT456-DVWa4Q_8.js";import"./preload-helper-PPVm8Dsz.js";import"./badge-CAgd1iWD.js";import"./x--JQCAyyF.js";import"./users-BJy_T8cs.js";import"./user-C4IQS-nm.js";const d={variant_entity:{app_id:e.variant_entity},germline_snv_occurrence:{app_id:e.germline_snv_occurrence,aggregations:[],saved_filter_type:r.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:e.germline_cnv_occurrence,aggregations:[],saved_filter_type:r.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:e.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:r.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:e.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:r.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:e.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:r.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:e.admin},portal:{name:"",navigation:{}}},x={title:"Components/Badges/Analysis Type Code Badge",component:t,args:{},decorators:[i=>a.jsx(m,{children:a.jsx(c,{config:d,children:a.jsx(i,{})})})]},o={args:{code:"somatic"},render:i=>a.jsx(_,{title:"Default",children:a.jsx("div",{className:"flex gap-2",children:["somatic","germline","germline_family"].map((s,n)=>a.jsx(t,{code:s},n))})})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    code: 'somatic' as AnalysisTypeCode
  },
  render: _args => <StorySection title="Default">
      <div className="flex gap-2">
        {['somatic', 'germline', 'germline_family'].map((code, index) => <AnalysisTypeCodeBadge key={index} code={code as AnalysisTypeCode} />)}
      </div>
    </StorySection>
}`,...o.parameters?.docs?.source}}};const N=["Default"];export{o as Default,N as __namedExportsOrder,x as default};
