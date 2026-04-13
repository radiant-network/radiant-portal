import{j as r}from"./iframe-yUfF9TIc.js";import{P as i}from"./priority-indicator-DZhIzYo6.js";import{C as n,A as o}from"./applications-config-CyRBT9P8.js";import{B as d}from"./chunk-UVKPFVEO-B5y1qpRp.js";import"./preload-helper-Dp1pzeXC.js";import"./indicator-C2GrAVdF.js";import"./shape-triangle-up-icon-DiYIGr8U.js";import"./i18n-D5-yTOs2.js";const p={variant_entity:{app_id:o.variant_entity},snv_occurrence:{app_id:o.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:o.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:o.admin},portal:{name:"",navigation:{}}},j={title:"Indicators/PriorityIndicator",component:i,args:{},decorators:[a=>r.jsx(d,{children:r.jsx(n,{config:p,children:r.jsx(a,{})})})]},e={args:{code:"asap"},render:()=>r.jsx("div",{className:"flex flex-col gap-2",children:["asap","routine","stat","urgent"].map(a=>r.jsxs("div",{children:[r.jsx(i,{code:a}),r.jsx(i,{code:a,size:"sm"})]},a))})};var t,s,c;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    code: 'asap'
  },
  render: () => <div className="flex flex-col gap-2">
      {['asap', 'routine', 'stat', 'urgent'].map(code => <div key={code}>
          <PriorityIndicator code={code as PriorityIndicatorCode} />
          <PriorityIndicator code={code as PriorityIndicatorCode} size="sm" />
        </div>)}
    </div>
}`,...(c=(s=e.parameters)==null?void 0:s.docs)==null?void 0:c.source}}};const y=["Default"];export{e as Default,y as __namedExportsOrder,j as default};
