import{j as e}from"./iframe-pCkdMSW4.js";import{S as o}from"./api-C5s-SBNp.js";import{D as i}from"./description-CWZv08I3.js";import{C as c,A as r}from"./applications-config-zQZqX64T.js";import{a as s}from"./story-section-BWCYvdHs.js";import{B as _}from"./chunk-QUQL4437-dDoHRhre.js";import"./preload-helper-PPVm8Dsz.js";import"./i18n-Cv0t7e2j.js";import"./index-DyQxDMRQ.js";import"./index-wBlvzvCM.js";const p={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:o.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:o.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},y={title:"Components/Preview/Description",component:i,args:{title:"Title",children:e.jsx("span",{children:"Children"})},decorators:[t=>e.jsx(_,{children:e.jsx(c,{config:p,children:e.jsx(t,{})})})]},n={args:{},render:t=>e.jsx(s,{title:"Default",children:e.jsx(i,{...t})})},a={args:{values:[]},render:t=>e.jsx(s,{title:"Empty",children:e.jsx(i,{...t})})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {},
  render: args => <StorySection title="Default">
      <DescriptionSection {...args} />
    </StorySection>
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    values: []
  },
  render: args => <StorySection title="Empty">
      <DescriptionSection {...args} />
    </StorySection>
}`,...a.parameters?.docs?.source}}};const R=["Default","Empty"];export{n as Default,a as Empty,R as __namedExportsOrder,y as default};
