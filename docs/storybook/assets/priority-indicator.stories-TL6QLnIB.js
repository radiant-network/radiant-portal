import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{m as n,w as r}from"./api-DXv3C38A.js";import{i,n as a}from"./story-section-DVTm6cGm.js";import{o,t as s}from"./chunk-BV7QT456-CSdDc4Ui.js";import{i as c,n as l,t as u}from"./applications-config-D877dlRU.js";import{n as d,t as f}from"./priority-indicator-DrTqOtm2.js";var p,m,h,g,_;function v(){return(v=e((()=>{o(),r(),d(),c(),i(),p=t(),m={variant_entity:{app_id:u.variant_entity},germline_snv_occurrence:{app_id:u.germline_snv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:u.germline_cnv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:u.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:u.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:u.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:`admin`,app_id:u.admin},portal:{name:``,navigation:{}}},h={title:`Features/Indicators/Priority Indicator`,component:f,args:{},decorators:[e=>(0,p.jsx)(s,{children:(0,p.jsx)(l,{config:m,children:(0,p.jsx)(e,{})})})]},g={args:{code:`asap`},render:()=>(0,p.jsx)(a,{title:`Priority indicator`,children:(0,p.jsx)(`div`,{className:`flex flex-col gap-2`,children:[`asap`,`routine`,`stat`,`urgent`].map(e=>(0,p.jsxs)(`div`,{children:[(0,p.jsx)(f,{code:e}),(0,p.jsx)(f,{code:e,size:`sm`})]},e))})})},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}},_=[`Default`]})))()}v();export{g as Default,_ as __namedExportsOrder,h as default};