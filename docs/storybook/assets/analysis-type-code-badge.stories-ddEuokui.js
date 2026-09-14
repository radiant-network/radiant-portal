import{j as a,S as r}from"./iframe-DY5-UQdi.js";import{A as t}from"./analysis-type-code-badge-BNtnLXPe.js";import{C as c,A as e}from"./applications-config-JXvOJz-U.js";import{a as _}from"./story-section-BfGxLv6g.js";import{B as m}from"./chunk-BV7QT456-BXYyrak3.js";import"./preload-helper-PPVm8Dsz.js";import"./badge-ihkBqefc.js";import"./x-CLuQ0dgg.js";import"./users-Cw9Bi7ei.js";import"./user-DicrVcQZ.js";const d={variant_entity:{app_id:e.variant_entity},germline_snv_occurrence:{app_id:e.germline_snv_occurrence,aggregations:[],saved_filter_type:r.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:e.germline_cnv_occurrence,aggregations:[],saved_filter_type:r.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:e.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:r.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:e.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:r.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:e.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:r.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:e.admin},portal:{name:"",navigation:{}}},x={title:"Components/Badges/Analysis Type Code Badge",component:t,args:{},decorators:[i=>a.jsx(m,{children:a.jsx(c,{config:d,children:a.jsx(i,{})})})]},o={args:{code:"somatic"},render:i=>a.jsx(_,{title:"Default",children:a.jsx("div",{className:"flex gap-2",children:["somatic","germline","germline_family"].map((s,n)=>a.jsx(t,{code:s},n))})})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    code: 'somatic' as AnalysisTypeCode
  },
  render: _args => <StorySection title="Default">
      <div className="flex gap-2">
        {['somatic', 'germline', 'germline_family'].map((code, index) => <AnalysisTypeCodeBadge key={index} code={code as AnalysisTypeCode} />)}
      </div>
    </StorySection>
}`,...o.parameters?.docs?.source}}};const N=["Default"];export{o as Default,N as __namedExportsOrder,x as default};
