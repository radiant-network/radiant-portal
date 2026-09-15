import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{m as n,w as r}from"./api-DXv3C38A.js";import{i,n as a,t as o}from"./story-section-DVTm6cGm.js";import{o as s,t as c}from"./chunk-BV7QT456-CSdDc4Ui.js";import{i as l,n as u,t as d}from"./applications-config-D877dlRU.js";import{n as f,t as p}from"./empty-field-BzibZCMP.js";function m({condition:e,children:t}){return e?(0,h.jsx)(h.Fragment,{children:t}):(0,h.jsx)(p,{})}var h;function g(){return(g=e((()=>{f(),h=t(),m.__docgenInfo={description:``,methods:[],displayName:`ConditionalField`,props:{condition:{required:!0,tsType:{name:`boolean`},description:``},children:{required:!1,tsType:{name:`any`},description:``}}}})))()}var _,v,y,b,x;function S(){return(S=e((()=>{s(),r(),g(),l(),i(),_=t(),v={variant_entity:{app_id:d.variant_entity},germline_snv_occurrence:{app_id:d.germline_snv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:d.germline_cnv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:d.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:d.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:d.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:`admin`,app_id:d.admin},portal:{name:``,navigation:{}}},y={title:`Features/Informations/Conditional Field`,component:m,args:{},decorators:[e=>(0,_.jsx)(c,{children:(0,_.jsx)(u,{config:v,children:(0,_.jsx)(e,{})})})]},b={args:{condition:!0,children:(0,_.jsx)(_.Fragment,{children:`This Condition is True`})},render:e=>(0,_.jsxs)(a,{title:`Conditional field`,description:`Renders its children only when the condition is true; otherwise it shows a placeholder dash.`,children:[(0,_.jsxs)(`div`,{className:`flex gap-4`,children:[(0,_.jsxs)(o,{children:[`condition = `,String(e.condition)]}),(0,_.jsx)(m,{condition:e.condition,children:e.children})]}),(0,_.jsxs)(`div`,{className:`flex  gap-4`,children:[(0,_.jsx)(o,{children:`condition = false`}),(0,_.jsx)(m,{condition:!1,children:e.children})]})]})},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    condition: true,
    children: <>This Condition is True</>
  },
  render: args => <StorySection title="Conditional field" description="Renders its children only when the condition is true; otherwise it shows a placeholder dash.">
      <div className="flex gap-4">
        <StoryLabel>condition = {String(args.condition)}</StoryLabel>
        <ConditionalField condition={args.condition}>{args.children}</ConditionalField>
      </div>

      <div className="flex  gap-4">
        <StoryLabel>condition = false</StoryLabel>
        <ConditionalField condition={false}>{args.children}</ConditionalField>
      </div>
    </StorySection>
}`,...b.parameters?.docs?.source}}},x=[`Default`]})))()}S();export{b as Default,x as __namedExportsOrder,y as default};