import{j as a}from"./iframe-BdVkGBhb.js";import{S as n}from"./api-ok7Ado9G.js";import{D as o}from"./display-table-BcG7x3Ir.js";import{C as S,A as s}from"./applications-config-D4csJ2eF.js";import{Z as V,c as R}from"./table-mock-CxBJ_f6v.js";import{B as T}from"./chunk-UVKPFVEO-tWcB6apz.js";import"./preload-helper-Dp1pzeXC.js";import"./i18n-C6QGtJ6I.js";import"./empty-f16slOhT.js";import"./search-DwesaQnS.js";import"./empty-cell-BU5uggiA.js";import"./number-format-Bc5XstMk.js";import"./button-zA7C4LoZ.js";import"./index-BTAukcSu.js";import"./action-button-CpRjOizG.js";import"./dropdown-menu-CzBsT1en.js";import"./index-xQ2ojJvx.js";import"./index-CNw0ArEG.js";import"./check-BIdY2e8D.js";import"./circle-B2j6O8ci.js";import"./separator-BYsloDMD.js";import"./checkbox-PyaxhgVf.js";import"./index-OMV1b2KL.js";import"./settings-CZtGiW8k.js";import"./skeleton-DTOrDwyo.js";import"./card-DQvGPNS_.js";import"./pagination-DStwn0J2.js";import"./select-D5AO-1T1.js";import"./chevron-down-f1b2N7oj.js";import"./chevron-up-M5FQZrth.js";import"./ellipsis-NlPPM9j6.js";import"./api-0xi9nZz_.js";import"./index-9hkzsdBx.js";import"./badge-YMPnDvZL.js";import"./x-B7iw8ws4.js";import"./chevron-right-DW31Zhwv.js";const e=R(),H={variant_entity:{app_id:s.variant_entity},germline_snv_occurrence:{app_id:s.germline_snv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:s.germline_cnv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:s.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:s.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:s.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:s.admin},portal:{name:"",navigation:{}}},ur={title:"Tables/Display Table",component:o,args:{data:V,columns:[e.accessor("firstName",{cell:r=>r.getValue(),header:()=>a.jsx("span",{children:"First Name"})}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>a.jsx("i",{children:r.getValue()}),header:()=>a.jsx("span",{children:"Last Name"})}),e.accessor("age",{header:()=>"Age",cell:r=>r.renderValue()}),e.accessor("visits",{header:()=>a.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]},decorators:[r=>a.jsx(T,{children:a.jsx(S,{config:H,children:a.jsx(r,{})})})]},t={args:{},render:r=>a.jsx(o,{...r})},c={args:{variant:"borderless"},render:r=>a.jsx(o,{...r})},i={args:{variant:"border"},render:r=>a.jsx(o,{...r})},p={args:{variant:"border",columns:[e.group({id:"group_1",header:()=>a.jsx("span",{children:"Group 1"}),columns:[e.accessor("firstName",{cell:r=>r.getValue(),footer:r=>r.column.id}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>r.getValue(),header:()=>a.jsx("span",{children:"Last Name"}),footer:r=>r.column.id})]}),e.group({header:"group_2",columns:[e.accessor("age",{header:()=>"Age",footer:r=>r.column.id}),e.group({header:"More Info",columns:[e.accessor("visits",{header:()=>a.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]})]},render:r=>a.jsx(o,{...r})},m={args:{data:[]},render:r=>a.jsx(o,{...r})};var l,d,u;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {},
  render: args => <DisplayTable {...args} />
}`,...(u=(d=t.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var g,_,f;c.parameters={...c.parameters,docs:{...(g=c.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    variant: 'borderless'
  },
  render: args => <DisplayTable {...args} />
}`,...(f=(_=c.parameters)==null?void 0:_.docs)==null?void 0:f.source}}};var h,v,N;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    variant: 'border'
  },
  render: args => <DisplayTable {...args} />
}`,...(N=(v=i.parameters)==null?void 0:v.docs)==null?void 0:N.source}}};var C,x,y;p.parameters={...p.parameters,docs:{...(C=p.parameters)==null?void 0:C.docs,source:{originalSource:`{
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
}`,...(y=(x=p.parameters)==null?void 0:x.docs)==null?void 0:y.source}}};var E,j,b;m.parameters={...m.parameters,docs:{...(E=m.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    data: []
  },
  render: args => <DisplayTable {...args} />
}`,...(b=(j=m.parameters)==null?void 0:j.docs)==null?void 0:b.source}}};const gr=["Default","Borderless","Border","WithHeaderGroups","Empty"];export{i as Border,c as Borderless,t as Default,m as Empty,p as WithHeaderGroups,gr as __namedExportsOrder,ur as default};
