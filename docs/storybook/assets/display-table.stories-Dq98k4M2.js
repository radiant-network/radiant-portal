import{j as a}from"./iframe-DwMH2dBW.js";import{S as n}from"./api-QmR3WP_i.js";import{D as o}from"./display-table-CD6KgxRn.js";import{C as S,A as s}from"./applications-config-DXE5ztiN.js";import{Z as V,c as R}from"./table-mock-BqkZddUK.js";import{B as T}from"./chunk-UVKPFVEO-Cd7z_Nhh.js";import"./preload-helper-Dp1pzeXC.js";import"./i18n-ziG4I6eV.js";import"./empty-CtfyZH_a.js";import"./search-Cr9gy5WT.js";import"./empty-cell-B_Acito6.js";import"./number-format-CRCoifE2.js";import"./button-BsRPaght.js";import"./index-BbiblE0o.js";import"./action-button-tnoOk29P.js";import"./dropdown-menu-Bw4U7-Nx.js";import"./index-DA6RFYoh.js";import"./index-Btc-yfq6.js";import"./check-B1gfskih.js";import"./circle-HRTk5Xw0.js";import"./separator-Cnq8OFvq.js";import"./checkbox-D8UCmAfF.js";import"./index-0WCYYc0R.js";import"./settings-C7QEJlkA.js";import"./skeleton-C0wf1kFt.js";import"./card-CGuIhlMF.js";import"./pagination-CgsuPXOS.js";import"./select-BBekSMML.js";import"./chevron-down-iZoV5io0.js";import"./chevron-up-DRLcC0QF.js";import"./ellipsis-BEiHnqT_.js";import"./api-DL6-wyT5.js";import"./index-CegZ8DV4.js";import"./badge-C2V39wxB.js";import"./x-6aua8ShS.js";import"./chevron-right-B-TDkjIK.js";const e=R(),H={variant_entity:{app_id:s.variant_entity},germline_snv_occurrence:{app_id:s.germline_snv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:s.germline_cnv_occurrence,aggregations:[],saved_filter_type:n.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:s.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:s.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:s.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:n.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:s.admin},portal:{name:"",navigation:{}}},ur={title:"Tables/Display Table",component:o,args:{data:V,columns:[e.accessor("firstName",{cell:r=>r.getValue(),header:()=>a.jsx("span",{children:"First Name"})}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>a.jsx("i",{children:r.getValue()}),header:()=>a.jsx("span",{children:"Last Name"})}),e.accessor("age",{header:()=>"Age",cell:r=>r.renderValue()}),e.accessor("visits",{header:()=>a.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]},decorators:[r=>a.jsx(T,{children:a.jsx(S,{config:H,children:a.jsx(r,{})})})]},t={args:{},render:r=>a.jsx(o,{...r})},c={args:{variant:"borderless"},render:r=>a.jsx(o,{...r})},i={args:{variant:"border"},render:r=>a.jsx(o,{...r})},p={args:{variant:"border",columns:[e.group({id:"group_1",header:()=>a.jsx("span",{children:"Group 1"}),columns:[e.accessor("firstName",{cell:r=>r.getValue(),footer:r=>r.column.id}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>r.getValue(),header:()=>a.jsx("span",{children:"Last Name"}),footer:r=>r.column.id})]}),e.group({header:"group_2",columns:[e.accessor("age",{header:()=>"Age",footer:r=>r.column.id}),e.group({header:"More Info",columns:[e.accessor("visits",{header:()=>a.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]})]},render:r=>a.jsx(o,{...r})},m={args:{data:[]},render:r=>a.jsx(o,{...r})};var l,d,u;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
