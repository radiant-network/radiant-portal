import{j as r}from"./iframe-DUYxWSE4.js";import{S as t}from"./api-D36EIwoJ.js";import{P as a}from"./priority-indicator-CrsQedR9.js";import{C as c,A as e}from"./applications-config-Q6r4cHCd.js";import{a as s}from"./story-section-BP93x530.js";import{B as n}from"./chunk-QUQL4437-B7OJzLlm.js";import"./preload-helper-PPVm8Dsz.js";import"./indicator-B1KHN1mc.js";import"./shape-triangle-up-icon-DBhba8qV.js";import"./i18n-DhdwcvPn.js";import"./index-0l6j4kdI.js";const _={variant_entity:{app_id:e.variant_entity},germline_snv_occurrence:{app_id:e.germline_snv_occurrence,aggregations:[],saved_filter_type:t.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:e.germline_cnv_occurrence,aggregations:[],saved_filter_type:t.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:e.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:e.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:e.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:e.admin},portal:{name:"",navigation:{}}},E={title:"Features/Indicators/Priority Indicator",component:a,args:{},decorators:[i=>r.jsx(n,{children:r.jsx(c,{config:_,children:r.jsx(i,{})})})]},o={args:{code:"asap"},render:()=>r.jsx(s,{title:"Priority indicator",children:r.jsx("div",{className:"flex flex-col gap-2",children:["asap","routine","stat","urgent"].map(i=>r.jsxs("div",{children:[r.jsx(a,{code:i}),r.jsx(a,{code:i,size:"sm"})]},i))})})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    code: 'asap'
  },
  render: () => <StorySection title="Priority indicator">
      <div className="flex flex-col gap-2">
        {['asap', 'routine', 'stat', 'urgent'].map(code => <div key={code}>
            <PriorityIndicator code={code as PriorityIndicatorCode} />
            <PriorityIndicator code={code as PriorityIndicatorCode} size="sm" />
          </div>)}
      </div>
    </StorySection>
}`,...o.parameters?.docs?.source}}};const S=["Default"];export{o as Default,S as __namedExportsOrder,E as default};
