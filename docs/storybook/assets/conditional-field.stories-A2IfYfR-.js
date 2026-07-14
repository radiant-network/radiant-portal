import{j as e}from"./iframe-C3tcij1x.js";import{S as o}from"./api-DxXkaL5r.js";import{E as d}from"./empty-field-C3jF5_kI.js";import{C as c,A as n}from"./applications-config-CZU46Nat.js";import{a as l,b as a}from"./story-section-B3q-8Mn1.js";import{B as _}from"./chunk-QUQL4437-arySQgr0.js";import"./preload-helper-PPVm8Dsz.js";function t({condition:i,children:s}){return i?e.jsx(e.Fragment,{children:s}):e.jsx(d,{})}t.__docgenInfo={description:"",methods:[],displayName:"ConditionalField",props:{condition:{required:!0,tsType:{name:"boolean"},description:""},children:{required:!1,tsType:{name:"any"},description:""}}};const p={variant_entity:{app_id:n.variant_entity},germline_snv_occurrence:{app_id:n.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:n.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:n.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:n.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:n.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:n.admin},portal:{name:"",navigation:{}}},y={title:"Features/Informations/Conditional Field",component:t,args:{},decorators:[i=>e.jsx(_,{children:e.jsx(c,{config:p,children:e.jsx(i,{})})})]},r={args:{condition:!0,children:e.jsx(e.Fragment,{children:"This Condition is True"})},render:i=>e.jsxs(l,{title:"Conditional field",description:"Renders its children only when the condition is true; otherwise it shows a placeholder dash.",children:[e.jsxs("div",{className:"flex gap-4",children:[e.jsxs(a,{children:["condition = ",String(i.condition)]}),e.jsx(t,{condition:i.condition,children:i.children})]}),e.jsxs("div",{className:"flex  gap-4",children:[e.jsx(a,{children:"condition = false"}),e.jsx(t,{condition:!1,children:i.children})]})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
}`,...r.parameters?.docs?.source}}};const S=["Default"];export{r as Default,S as __namedExportsOrder,y as default};
