import{j as r}from"./iframe-CgYzld9M.js";import{S as t}from"./api-CNFUPySA.js";import{I as a}from"./information-field-C5YMZ_2K.js";import{C as d,A as o}from"./applications-config-DSaueCPj.js";import{B as p}from"./chunk-QUQL4437-Blla3tfU.js";import"./preload-helper-PPVm8Dsz.js";import"./empty-field-Bbb4m5H-.js";const m={variant_entity:{app_id:o.variant_entity},germline_snv_occurrence:{app_id:o.germline_snv_occurrence,aggregations:[],saved_filter_type:t.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:o.germline_cnv_occurrence,aggregations:[],saved_filter_type:t.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:o.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:o.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:o.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:o.admin},portal:{name:"",navigation:{}}},I={title:"Informations/InformationField",component:a,args:{},decorators:[e=>r.jsx(p,{children:r.jsx(d,{config:m,children:r.jsx(e,{})})})]},n={args:{label:"Label"},render:e=>r.jsx(a,{...e,children:"InformationField"})},i={args:{label:"Label",labelTooltipText:"Label Tooltip"},render:e=>r.jsx(a,{...e,children:"InformationField"})},s={args:{label:"Label",tooltipText:"Tooltip Text"},render:e=>r.jsx(a,{...e,children:"InformationField"})},l={args:{label:"Label",labelTooltipText:"Label Tooltip",tooltipText:"Tooltip Text"},render:e=>r.jsx(a,{...e,children:"InformationField"})},c={args:{label:"Label"},render:e=>r.jsx(a,{...e,children:void 0})};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Label'
  },
  render: args => <InformationField {...args}>InformationField</InformationField>
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Label',
    labelTooltipText: 'Label Tooltip'
  },
  render: args => <InformationField {...args}>InformationField</InformationField>
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Label',
    tooltipText: 'Tooltip Text'
  },
  render: args => <InformationField {...args}>InformationField</InformationField>
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Label',
    labelTooltipText: 'Label Tooltip',
    tooltipText: 'Tooltip Text'
  },
  render: args => <InformationField {...args}>InformationField</InformationField>
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Label'
  },
  render: args => <InformationField {...args}>{undefined}</InformationField>
}`,...c.parameters?.docs?.source}}};const C=["Default","WithLabelTooltip","WithTooltipText","WithLabelAndTooltipText","Empty"];export{n as Default,c as Empty,l as WithLabelAndTooltipText,i as WithLabelTooltip,s as WithTooltipText,C as __namedExportsOrder,I as default};
