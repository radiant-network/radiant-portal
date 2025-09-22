import{j as r}from"./jsx-runtime-D_zvdyIk.js";import{P as o}from"./priority-indicator-C_NhXfDm.js";import{C as n}from"./applications-config-q4OA8PiL.js";import{B as d}from"./chunk-PVWAREVJ-C1taxNkX.js";import"./indicator-GIQKVNBl.js";import"./index-C66Dxnp2.js";import"./utils-D-KgF5mV.js";import"./shape-circle-icon-BxJCNapB.js";import"./i18n-Dwlvl9Yt.js";import"./iframe-D8saG-or.js";import"./context-DkqwYzW-.js";import"./index-CGj_12n1.js";const p={variant_entity:{app_id:"variant_entity"},variant_exploration:{app_id:"variant_exploration_multi_select_filter",aggregations:[]},admin:{admin_code:"admin",app_id:"admin"},portal:{name:"",navigation:{}}},I={title:"Indicators/PriorityIndicator",component:o,args:{},decorators:[a=>r.jsx(d,{children:r.jsx(n,{config:p,children:r.jsx(a,{})})})]},i={args:{code:"asap"},render:()=>r.jsx("div",{className:"flex flex-col gap-2",children:["asap","routine","stat","urgent"].map(a=>r.jsxs("div",{children:[r.jsx(o,{code:a}),r.jsx(o,{code:a,size:"sm"})]},a))})};var t,e,s;i.parameters={...i.parameters,docs:{...(t=i.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    code: 'asap'
  },
  render: () => <div className="flex flex-col gap-2">
      {['asap', 'routine', 'stat', 'urgent'].map(code => <div key={code}>
          <PriorityIndicator code={code as PriorityIndicatorCode} />
          <PriorityIndicator code={code as PriorityIndicatorCode} size="sm" />
        </div>)}
    </div>
}`,...(s=(e=i.parameters)==null?void 0:e.docs)==null?void 0:s.source}}};const h=["Default"];export{i as Default,h as __namedExportsOrder,I as default};
