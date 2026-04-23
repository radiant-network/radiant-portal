import{j as r}from"./iframe-Dj1EhdxY.js";import{P as o}from"./priority-indicator-d3ga9kk9.js";import{C as c,A as a}from"./applications-config-BSgPevUl.js";import{B as d}from"./chunk-UVKPFVEO-Bu3VX8oU.js";import"./preload-helper-Dp1pzeXC.js";import"./indicator-BSg9NmXZ.js";import"./shape-triangle-up-icon-Bq3ezzIe.js";import"./i18n-CuX3LWdj.js";const m={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},j={title:"Indicators/PriorityIndicator",component:o,args:{},decorators:[e=>r.jsx(d,{children:r.jsx(c,{config:m,children:r.jsx(e,{})})})]},i={args:{code:"asap"},render:()=>r.jsx("div",{className:"flex flex-col gap-2",children:["asap","routine","stat","urgent"].map(e=>r.jsxs("div",{children:[r.jsx(o,{code:e}),r.jsx(o,{code:e,size:"sm"})]},e))})};var t,s,n;i.parameters={...i.parameters,docs:{...(t=i.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    code: 'asap'
  },
  render: () => <div className="flex flex-col gap-2">
      {['asap', 'routine', 'stat', 'urgent'].map(code => <div key={code}>
          <PriorityIndicator code={code as PriorityIndicatorCode} />
          <PriorityIndicator code={code as PriorityIndicatorCode} size="sm" />
        </div>)}
    </div>
}`,...(n=(s=i.parameters)==null?void 0:s.docs)==null?void 0:n.source}}};const y=["Default"];export{i as Default,y as __namedExportsOrder,j as default};
