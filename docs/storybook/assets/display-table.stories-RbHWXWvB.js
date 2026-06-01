import{j as a}from"./iframe-CgYzld9M.js";import{S as n}from"./api-CNFUPySA.js";import{D as o}from"./display-table-7qGXcZ4H.js";import{C as l,A as s}from"./applications-config-DSaueCPj.js";import{Z as d,c as u}from"./table-mock-Dd7zRXJY.js";import{B as g}from"./chunk-QUQL4437-Blla3tfU.js";import"./preload-helper-PPVm8Dsz.js";import"./i18n-BhtfqN2W.js";import"./index-BJLMTLPT.js";import"./empty-ZJqYNLCs.js";import"./search-DCeVs4Xh.js";import"./empty-cell-2N75mUCa.js";import"./number-format-Bqham5ER.js";import"./button-BB6JTV7B.js";import"./index-0Ui6iiVS.js";import"./action-button-Dd50ZnSl.js";import"./dropdown-menu-CCEHsgQp.js";import"./index-D5qyD-5a.js";import"./index-CPRKa62s.js";import"./check-DrnC7o8K.js";import"./circle-BJPs1Iry.js";import"./separator-BXAAQkGD.js";import"./checkbox-BvKqV_TL.js";import"./index-BU8vtByU.js";import"./settings-DclE_eXf.js";import"./skeleton-BS9ObOBk.js";import"./card-Do_-gjxR.js";import"./pagination-CiWoFTft.js";import"./select-D7zvT7zR.js";import"./chevron-down-DkVYE_eZ.js";import"./chevron-up-DLwOfrjd.js";import"./ellipsis-DSqnSFWf.js";import"./api-C1_4ex4N.js";import"./badge-BPmjaafO.js";import"./x-B30BiZwY.js";import"./chevron-right-DtnNy1M1.js";const e=u(),_={variant_entity:{app_id:s.variant_entity},germline_snv_occurrence:{app_id:s.germline_snv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:s.germline_cnv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:s.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:s.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:s.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:s.admin},portal:{name:"",navigation:{}}},Y={title:"Tables/Display Table",component:o,args:{data:d,columns:[e.accessor("firstName",{cell:r=>r.getValue(),header:()=>a.jsx("span",{children:"First Name"})}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>a.jsx("i",{children:r.getValue()}),header:()=>a.jsx("span",{children:"Last Name"})}),e.accessor("age",{header:()=>"Age",cell:r=>r.renderValue()}),e.accessor("visits",{header:()=>a.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]},decorators:[r=>a.jsx(g,{children:a.jsx(l,{config:_,children:a.jsx(r,{})})})]},t={args:{},render:r=>a.jsx(o,{...r})},c={args:{variant:"borderless"},render:r=>a.jsx(o,{...r})},i={args:{variant:"border"},render:r=>a.jsx(o,{...r})},p={args:{variant:"border",columns:[e.group({id:"group_1",header:()=>a.jsx("span",{children:"Group 1"}),columns:[e.accessor("firstName",{cell:r=>r.getValue(),footer:r=>r.column.id}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>r.getValue(),header:()=>a.jsx("span",{children:"Last Name"}),footer:r=>r.column.id})]}),e.group({header:"group_2",columns:[e.accessor("age",{header:()=>"Age",footer:r=>r.column.id}),e.group({header:"More Info",columns:[e.accessor("visits",{header:()=>a.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]})]},render:r=>a.jsx(o,{...r})},m={args:{data:[]},render:r=>a.jsx(o,{...r})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {},
  render: args => <DisplayTable {...args} />
}`,...t.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'borderless'
  },
  render: args => <DisplayTable {...args} />
}`,...c.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'border'
  },
  render: args => <DisplayTable {...args} />
}`,...i.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
  render: args => <DisplayTable {...args} />
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    data: []
  },
  render: args => <DisplayTable {...args} />
}`,...m.parameters?.docs?.source}}};const $=["Default","Borderless","Border","WithHeaderGroups","Empty"];export{i as Border,c as Borderless,t as Default,m as Empty,p as WithHeaderGroups,$ as __namedExportsOrder,Y as default};
