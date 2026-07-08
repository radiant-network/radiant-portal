import{j as e}from"./iframe-AvqL8SKE.js";import{S as n}from"./api-5e3Wi7_0.js";import{D as i}from"./description-C8HwR1Iw.js";import{C as c,A as r}from"./applications-config-DZiFBhTt.js";import{a as s}from"./story-section-SMd-_iOc.js";import{B as _}from"./chunk-QUQL4437-ChXxCCdB.js";import"./preload-helper-PPVm8Dsz.js";import"./i18n-DBGkWSYQ.js";import"./index-R0HakiSX.js";const p={variant_entity:{app_id:r.variant_entity},germline_snv_occurrence:{app_id:r.germline_snv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:r.germline_cnv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:r.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:r.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:r.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:r.admin},portal:{name:"",navigation:{}}},f={title:"Components/Preview/Description",component:i,args:{title:"Title",children:e.jsx("span",{children:"Children"})},decorators:[t=>e.jsx(_,{children:e.jsx(c,{config:p,children:e.jsx(t,{})})})]},o={args:{},render:t=>e.jsx(s,{title:"Default",children:e.jsx(i,{...t})})},a={args:{values:[]},render:t=>e.jsx(s,{title:"Empty",children:e.jsx(i,{...t})})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {},
  render: args => <StorySection title="Default">
      <DescriptionSection {...args} />
    </StorySection>
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    values: []
  },
  render: args => <StorySection title="Empty">
      <DescriptionSection {...args} />
    </StorySection>
}`,...a.parameters?.docs?.source}}};const y=["Default","Empty"];export{o as Default,a as Empty,y as __namedExportsOrder,f as default};
