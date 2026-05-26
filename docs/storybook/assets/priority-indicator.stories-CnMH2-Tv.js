import{j as e}from"./iframe-CoEcbA0Q.js";import{S as o}from"./api-ok7Ado9G.js";import{P as t}from"./priority-indicator-BclrwGr5.js";import{C as _,A as r}from"./applications-config-04phLGWC.js";import{B as d}from"./chunk-UVKPFVEO-pvdJNT1A.js";import"./preload-helper-Dp1pzeXC.js";import"./indicator-x44BEX8q.js";import"./shape-triangle-up-icon-MHvetKtu.js";import"./i18n-BOQJC4x0.js";const p={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},y={title:"Indicators/PriorityIndicator",component:t,args:{},decorators:[a=>e.jsx(d,{children:e.jsx(_,{config:p,children:e.jsx(a,{})})})]},i={args:{code:"asap"},render:()=>e.jsx("div",{className:"flex flex-col gap-2",children:["asap","routine","stat","urgent"].map(a=>e.jsxs("div",{children:[e.jsx(t,{code:a}),e.jsx(t,{code:a,size:"sm"})]},a))})};var c,s,n;i.parameters={...i.parameters,docs:{...(c=i.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    code: 'asap'
  },
  render: () => <div className="flex flex-col gap-2">
      {['asap', 'routine', 'stat', 'urgent'].map(code => <div key={code}>
          <PriorityIndicator code={code as PriorityIndicatorCode} />
          <PriorityIndicator code={code as PriorityIndicatorCode} size="sm" />
        </div>)}
    </div>
}`,...(n=(s=i.parameters)==null?void 0:s.docs)==null?void 0:n.source}}};const N=["Default"];export{i as Default,N as __namedExportsOrder,y as default};
