import{j as e}from"./iframe-Cmiex3IG.js";import{S as o}from"./api-CNFUPySA.js";import{P as t}from"./priority-indicator-CBULYU2T.js";import{C as c,A as r}from"./applications-config-BEWoMBeD.js";import{B as s}from"./chunk-QUQL4437-s57FPwL9.js";import"./preload-helper-PPVm8Dsz.js";import"./indicator-4zldxxKP.js";import"./shape-triangle-up-icon-lQj4Oujb.js";import"./i18n-BtP9BP9x.js";import"./index-QN_ZCD1V.js";const n={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},E={title:"Indicators/PriorityIndicator",component:t,args:{},decorators:[a=>e.jsx(s,{children:e.jsx(c,{config:n,children:e.jsx(a,{})})})]},i={args:{code:"asap"},render:()=>e.jsx("div",{className:"flex flex-col gap-2",children:["asap","routine","stat","urgent"].map(a=>e.jsxs("div",{children:[e.jsx(t,{code:a}),e.jsx(t,{code:a,size:"sm"})]},a))})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    code: 'asap'
  },
  render: () => <div className="flex flex-col gap-2">
      {['asap', 'routine', 'stat', 'urgent'].map(code => <div key={code}>
          <PriorityIndicator code={code as PriorityIndicatorCode} />
          <PriorityIndicator code={code as PriorityIndicatorCode} size="sm" />
        </div>)}
    </div>
}`,...i.parameters?.docs?.source}}};const x=["Default"];export{i as Default,x as __namedExportsOrder,E as default};
