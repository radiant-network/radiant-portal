import{j as s}from"./iframe-DWjgVUMq.js";import{D as a}from"./display-table-CHmsVma7.js";import{C as D,A as o}from"./applications-config-zISIMikj.js";import{Y as T,c as V}from"./table-mock-D5X3O8Zx.js";import{B as S}from"./chunk-UVKPFVEO-D1hSeZDO.js";import"./preload-helper-Dp1pzeXC.js";import"./i18n-Cvdk8XAK.js";import"./empty-4Pi42WKm.js";import"./search-CEgEPqUJ.js";import"./empty-cell-BdFfRvsI.js";import"./number-format-BK-BrFNU.js";import"./api-Bs_y-PxM.js";import"./button-AKfI-ujp.js";import"./index-DX1RJuPt.js";import"./action-button-uBBNzLjE.js";import"./dropdown-menu-BvruUYIF.js";import"./index-VEESf9AA.js";import"./circle-DuBuILkt.js";import"./check-BmPo_W3p.js";import"./separator-C6P9C4bz.js";import"./checkbox-CLIgmPlC.js";import"./index-BThQvWly.js";import"./settings-Dq46ytSq.js";import"./skeleton-Dh-FCSHj.js";import"./card-D-SnxPv7.js";import"./pagination-CvFBGy1g.js";import"./select-CxzDtqrO.js";import"./chevron-down-D4Zvbvn9.js";import"./chevron-up-CRHdCI3s.js";import"./ellipsis-BuO6QR6N.js";import"./api-DeSFnYYz.js";import"./index-C1hiBCVo.js";import"./badge-BMQprMrV.js";import"./x-C7x8Bac6.js";import"./chevron-right-F-JC_ZoX.js";const e=V(),P={variant_entity:{app_id:o.variant_entity},germline_snv_occurrence:{app_id:o.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:o.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:o.admin},portal:{name:"",navigation:{}}},lr={title:"Tables/Display Table",component:a,args:{data:T,columns:[e.accessor("firstName",{cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"First Name"})}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>s.jsx("i",{children:r.getValue()}),header:()=>s.jsx("span",{children:"Last Name"})}),e.accessor("age",{header:()=>"Age",cell:r=>r.renderValue()}),e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]},decorators:[r=>s.jsx(S,{children:s.jsx(D,{config:P,children:s.jsx(r,{})})})]},n={args:{},render:r=>s.jsx(a,{...r})},t={args:{variant:"borderless"},render:r=>s.jsx(a,{...r})},c={args:{variant:"border"},render:r=>s.jsx(a,{...r})},i={args:{variant:"border",columns:[e.group({id:"group_1",header:()=>s.jsx("span",{children:"Group 1"}),columns:[e.accessor("firstName",{cell:r=>r.getValue(),footer:r=>r.column.id}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"Last Name"}),footer:r=>r.column.id})]}),e.group({header:"group_2",columns:[e.accessor("age",{header:()=>"Age",footer:r=>r.column.id}),e.group({header:"More Info",columns:[e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]})]},render:r=>s.jsx(a,{...r})},p={args:{data:[]},render:r=>s.jsx(a,{...r})};var m,l,d;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {},
  render: args => <DisplayTable {...args} />
}`,...(d=(l=n.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var u,g,h;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    variant: 'borderless'
  },
  render: args => <DisplayTable {...args} />
}`,...(h=(g=t.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var f,_,x;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    variant: 'border'
  },
  render: args => <DisplayTable {...args} />
}`,...(x=(_=c.parameters)==null?void 0:_.docs)==null?void 0:x.source}}};var j,v,b;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
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
}`,...(b=(v=i.parameters)==null?void 0:v.docs)==null?void 0:b.source}}};var H,N,y;p.parameters={...p.parameters,docs:{...(H=p.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    data: []
  },
  render: args => <DisplayTable {...args} />
}`,...(y=(N=p.parameters)==null?void 0:N.docs)==null?void 0:y.source}}};const dr=["Default","Borderless","Border","WithHeaderGroups","Empty"];export{c as Border,t as Borderless,n as Default,p as Empty,i as WithHeaderGroups,dr as __namedExportsOrder,lr as default};
