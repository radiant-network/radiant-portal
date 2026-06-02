import{j as a}from"./iframe-DaN5ePGy.js";import{S as n}from"./api-CNFUPySA.js";import{D as o}from"./display-table-CnI4AdBL.js";import{C as l,A as s}from"./applications-config-DfTGuYYT.js";import{Z as d,c as u}from"./table-mock-5piySsvV.js";import{B as g}from"./chunk-QUQL4437-tiDeZvge.js";import"./preload-helper-PPVm8Dsz.js";import"./i18n-M9kOJp22.js";import"./index-FwWjbq00.js";import"./empty-BDHFu0Ce.js";import"./search-D7P8tn3e.js";import"./empty-cell-DlxL0xHw.js";import"./number-format-B8g0amHX.js";import"./button-C2HSnRiu.js";import"./index-buk7i43K.js";import"./action-button-BHK2YR4r.js";import"./dropdown-menu-CPO56L4e.js";import"./index-DeH_VHOF.js";import"./index-CZCzdGEw.js";import"./check-B-s7SQrr.js";import"./circle-ZjFAsy7t.js";import"./separator-Dw2V0eT4.js";import"./checkbox-R3ES-PDx.js";import"./index-Bxzg_Qkc.js";import"./settings-CpwpifTX.js";import"./skeleton-ddFZC1OR.js";import"./card-Cjd0uC8i.js";import"./pagination-w_8nXQz_.js";import"./select-BoZlEhHZ.js";import"./chevron-down-DEKrCgi_.js";import"./chevron-up-DB5AtR6w.js";import"./ellipsis-B4gkA1F2.js";import"./api-Bl_JvKfP.js";import"./badge-BE-JumNl.js";import"./x-BX9lxs28.js";import"./chevron-right-Blm-Av0L.js";const e=u(),_={variant_entity:{app_id:s.variant_entity},germline_snv_occurrence:{app_id:s.germline_snv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:s.germline_cnv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:s.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:s.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:s.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:s.admin},portal:{name:"",navigation:{}}},Y={title:"Tables/Display Table",component:o,args:{data:d,columns:[e.accessor("firstName",{cell:r=>r.getValue(),header:()=>a.jsx("span",{children:"First Name"})}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>a.jsx("i",{children:r.getValue()}),header:()=>a.jsx("span",{children:"Last Name"})}),e.accessor("age",{header:()=>"Age",cell:r=>r.renderValue()}),e.accessor("visits",{header:()=>a.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]},decorators:[r=>a.jsx(g,{children:a.jsx(l,{config:_,children:a.jsx(r,{})})})]},t={args:{},render:r=>a.jsx(o,{...r})},c={args:{variant:"borderless"},render:r=>a.jsx(o,{...r})},i={args:{variant:"border"},render:r=>a.jsx(o,{...r})},p={args:{variant:"border",columns:[e.group({id:"group_1",header:()=>a.jsx("span",{children:"Group 1"}),columns:[e.accessor("firstName",{cell:r=>r.getValue(),footer:r=>r.column.id}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>r.getValue(),header:()=>a.jsx("span",{children:"Last Name"}),footer:r=>r.column.id})]}),e.group({header:"group_2",columns:[e.accessor("age",{header:()=>"Age",footer:r=>r.column.id}),e.group({header:"More Info",columns:[e.accessor("visits",{header:()=>a.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]})]},render:r=>a.jsx(o,{...r})},m={args:{data:[]},render:r=>a.jsx(o,{...r})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
