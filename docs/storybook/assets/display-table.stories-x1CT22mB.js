import{j as a}from"./iframe-BMmvtocU.js";import{S as n}from"./api-ok7Ado9G.js";import{D as o}from"./display-table-_eAnYYK-.js";import{C as S,A as s}from"./applications-config-BeMSSwup.js";import{Z as V,c as R}from"./table-mock-CutbkTZR.js";import{B as T}from"./chunk-UVKPFVEO-DGZ2lJlk.js";import"./preload-helper-Dp1pzeXC.js";import"./i18n-BJ1E6iAL.js";import"./empty-nN4UwaPN.js";import"./search-D8tEz4kI.js";import"./empty-cell-BRAF1f3k.js";import"./number-format-BQa7IEPp.js";import"./button-BgN65zCs.js";import"./index-BAUOvQzI.js";import"./action-button-CnEND6xO.js";import"./dropdown-menu-Dzp6mXEX.js";import"./index-CQojPjL1.js";import"./index-BBNMNgiS.js";import"./check-B-1euD6L.js";import"./circle-B83bx6JB.js";import"./separator-BAKSPgpP.js";import"./checkbox-CfXpz3Yx.js";import"./index-Cc1uA-gH.js";import"./settings-BkPQkS4z.js";import"./skeleton-BhUZz6Mt.js";import"./card-DoOMl9FY.js";import"./pagination-BrwMbosF.js";import"./select-BZ7Jsnta.js";import"./chevron-down-D2FjjRIn.js";import"./chevron-up-CXk4qng_.js";import"./ellipsis-CKgLMGm8.js";import"./api-B57KDXZZ.js";import"./index-BnWb3yN2.js";import"./badge-BZLTWEUC.js";import"./x-DyklLSqf.js";import"./chevron-right-JL_BTzSe.js";const e=R(),H={variant_entity:{app_id:s.variant_entity},germline_snv_occurrence:{app_id:s.germline_snv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:s.germline_cnv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:s.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:s.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:s.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:s.admin},portal:{name:"",navigation:{}}},ur={title:"Tables/Display Table",component:o,args:{data:V,columns:[e.accessor("firstName",{cell:r=>r.getValue(),header:()=>a.jsx("span",{children:"First Name"})}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>a.jsx("i",{children:r.getValue()}),header:()=>a.jsx("span",{children:"Last Name"})}),e.accessor("age",{header:()=>"Age",cell:r=>r.renderValue()}),e.accessor("visits",{header:()=>a.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]},decorators:[r=>a.jsx(T,{children:a.jsx(S,{config:H,children:a.jsx(r,{})})})]},t={args:{},render:r=>a.jsx(o,{...r})},c={args:{variant:"borderless"},render:r=>a.jsx(o,{...r})},i={args:{variant:"border"},render:r=>a.jsx(o,{...r})},p={args:{variant:"border",columns:[e.group({id:"group_1",header:()=>a.jsx("span",{children:"Group 1"}),columns:[e.accessor("firstName",{cell:r=>r.getValue(),footer:r=>r.column.id}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>r.getValue(),header:()=>a.jsx("span",{children:"Last Name"}),footer:r=>r.column.id})]}),e.group({header:"group_2",columns:[e.accessor("age",{header:()=>"Age",footer:r=>r.column.id}),e.group({header:"More Info",columns:[e.accessor("visits",{header:()=>a.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]})]},render:r=>a.jsx(o,{...r})},m={args:{data:[]},render:r=>a.jsx(o,{...r})};var l,d,u;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
