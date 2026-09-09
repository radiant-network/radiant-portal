import{j as e,B as i,S as a}from"./iframe-CEIjD8md.js";import{a as o,b as s,C as l}from"./collapsible-DmnxBQZj.js";import{C as c,A as r}from"./applications-config-CNrpF8an.js";import{a as _}from"./story-section-akNb6BHm.js";import{B as p}from"./chunk-QUQL4437-CMT0E8nl.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DFwv7R5L.js";const C={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},E={title:"Components/Collapsibles/Collapsible",component:o,args:{},decorators:[n=>e.jsx(p,{children:e.jsx(c,{config:C,children:e.jsx(n,{})})})]},t={args:{},render:n=>e.jsx(_,{title:"Default",children:e.jsxs(o,{...n,children:[e.jsx(s,{asChild:!0,children:e.jsx(i,{variant:"outline",children:"Trigger"})}),e.jsx(l,{className:"flex flex-col gap-2",children:"Content"})]})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {},
  render: args => <StorySection title="Default">
      <Collapsible {...args}>
        <CollapsibleTrigger asChild>
          <Button variant="outline">Trigger</Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col gap-2">Content</CollapsibleContent>
      </Collapsible>
    </StorySection>
}`,...t.parameters?.docs?.source}}};const S=["Default"];export{t as Default,S as __namedExportsOrder,E as default};
