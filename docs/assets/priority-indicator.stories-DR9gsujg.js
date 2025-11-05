import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{P as e}from"./priority-indicator-Ccqz5Ffv.js";import{C as n,A as a}from"./applications-config-DwuB3Ut-.js";import{B as d}from"./chunk-PVWAREVJ-CX-3hWew.js";import"./indicator-BmYDS5D0.js";import"./index-C66Dxnp2.js";import"./utils-D-KgF5mV.js";import"./shape-triangle-up-icon-CLEWE8Su.js";import"./i18n-CbvocMFw.js";import"./iframe-4i3Wl_LT.js";import"./i18next-DOi7g2fS.js";import"./index-CGj_12n1.js";const p={variant_entity:{app_id:a.variant_entity},snv_occurrence:{app_id:a.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:a.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},h={title:"Indicators/PriorityIndicator",component:e,args:{},decorators:[o=>r.jsx(d,{children:r.jsx(n,{config:p,children:r.jsx(o,{})})})]},i={args:{code:"asap"},render:()=>r.jsx("div",{className:"flex flex-col gap-2",children:["asap","routine","stat","urgent"].map(o=>r.jsxs("div",{children:[r.jsx(e,{code:o}),r.jsx(e,{code:o,size:"sm"})]},o))})};var t,s,c;i.parameters={...i.parameters,docs:{...(t=i.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    code: 'asap'
  },
  render: () => <div className="flex flex-col gap-2">
      {['asap', 'routine', 'stat', 'urgent'].map(code => <div key={code}>
          <PriorityIndicator code={code as PriorityIndicatorCode} />
          <PriorityIndicator code={code as PriorityIndicatorCode} size="sm" />
        </div>)}
    </div>
}`,...(c=(s=i.parameters)==null?void 0:s.docs)==null?void 0:c.source}}};const C=["Default"];export{i as Default,C as __namedExportsOrder,h as default};
