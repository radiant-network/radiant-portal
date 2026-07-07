import{j as r}from"./iframe--Wr8akaj.js";import{S as t}from"./api-5e3Wi7_0.js";import{D as a}from"./display-table-DQt8Nmls.js";import{C as d,A as o}from"./applications-config-Bam6cSsz.js";import{a as c}from"./story-section-mf2KVIsr.js";import{Y as u,c as g}from"./table-mock-BzAkxg5H.js";import{B as _}from"./chunk-QUQL4437-csEiRURN.js";import"./preload-helper-PPVm8Dsz.js";import"./i18n-Bg6Ec5jw.js";import"./index-C36_LE4b.js";import"./empty-vIPglIxh.js";import"./search-Ce1cbsgH.js";import"./empty-cell-DoBGr32L.js";import"./number-format-DCAWNaQq.js";import"./button-AGQ9gLKF.js";import"./action-button-B8HAWUkq.js";import"./dropdown-menu-D__ES2m4.js";import"./index-D5QIG_v-.js";import"./index-CHj75zQJ.js";import"./check-DN_rAFtv.js";import"./circle-kD5s09G8.js";import"./separator-DW3W07XT.js";import"./checkbox-0TbOjt2k.js";import"./index-BbAU48IZ.js";import"./grip-vertical-Btz0fMlK.js";import"./settings-BfSrJSYN.js";import"./skeleton-BMw6N2bI.js";import"./card-D1L_a8Ku.js";import"./pagination-BD816UGq.js";import"./select-C4YeHwvI.js";import"./chevron-down-DuUsgp_1.js";import"./chevron-up-DPnOSZh7.js";import"./ellipsis-DuI-Gu5X.js";import"./index-CKFT6Hhx.js";import"./api-CRUcq8iX.js";import"./badge-BFlBkB0h.js";import"./x-D_rtmg3q.js";import"./chevron-right-BQ29uH9H.js";const s=g(),h={variant_entity:{app_id:o.variant_entity},germline_snv_occurrence:{app_id:o.germline_snv_occurrence,aggregations:[],saved_filter_type:t.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:o.germline_cnv_occurrence,aggregations:[],saved_filter_type:t.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:o.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:o.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:o.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:o.admin},portal:{name:"",navigation:{}}},re={title:"Features/Display Table",component:a,args:{data:u,columns:[s.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),s.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),s.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),s.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),s.accessor("status",{header:"Status"}),s.accessor("progress",{header:"Profile Progress"})]},decorators:[e=>r.jsx(_,{children:r.jsx(d,{config:h,children:r.jsx(e,{})})})]},i={args:{},render:e=>r.jsx(c,{title:"Default",children:r.jsx(a,{...e})})},n={args:{variant:"borderless"},render:e=>r.jsx(c,{title:"Borderless",children:r.jsx(a,{...e})})},p={args:{variant:"border"},render:e=>r.jsx(c,{title:"Border",children:r.jsx(a,{...e})})},l={args:{variant:"border",columns:[s.group({id:"group_1",header:()=>r.jsx("span",{children:"Group 1"}),columns:[s.accessor("firstName",{cell:e=>e.getValue(),footer:e=>e.column.id}),s.accessor(e=>e.lastName,{id:"lastName",cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"Last Name"}),footer:e=>e.column.id})]}),s.group({header:"group_2",columns:[s.accessor("age",{header:()=>"Age",footer:e=>e.column.id}),s.group({header:"More Info",columns:[s.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),s.accessor("status",{header:"Status"}),s.accessor("progress",{header:"Profile Progress"})]})]})]},render:e=>r.jsx(c,{title:"With header groups",children:r.jsx(a,{...e})})},m={args:{data:[]},render:e=>r.jsx(c,{title:"Empty",children:r.jsx(a,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {},
  render: args => <StorySection title="Default">
      <DisplayTable {...args} />
    </StorySection>
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'borderless'
  },
  render: args => <StorySection title="Borderless">
      <DisplayTable {...args} />
    </StorySection>
}`,...n.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'border'
  },
  render: args => <StorySection title="Border">
      <DisplayTable {...args} />
    </StorySection>
}`,...p.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'border',
    columns: [columnHelper.group({
      id: 'group_1',
      header: () => <span>Group 1</span>,
      columns: [columnHelper.accessor('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id
      }), columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id
      })]
    }), columnHelper.group({
      header: 'group_2',
      columns: [columnHelper.accessor('age', {
        header: () => 'Age',
        footer: props => props.column.id
      }), columnHelper.group({
        header: 'More Info',
        columns: [columnHelper.accessor('visits', {
          header: () => <span>Visits</span>
        }), columnHelper.accessor('status', {
          header: 'Status'
        }), columnHelper.accessor('progress', {
          header: 'Profile Progress'
        })]
      })]
    })] as TableColumnDef<TableMockData, any>[]
  },
  render: args => <StorySection title="With header groups">
      <DisplayTable {...args} />
    </StorySection>
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    data: []
  },
  render: args => <StorySection title="Empty">
      <DisplayTable {...args} />
    </StorySection>
}`,...m.parameters?.docs?.source}}};const se=["Default","Borderless","Border","WithHeaderGroups","Empty"];export{p as Border,n as Borderless,i as Default,m as Empty,l as WithHeaderGroups,se as __namedExportsOrder,re as default};
