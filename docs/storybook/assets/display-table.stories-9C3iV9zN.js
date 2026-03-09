import{j as s}from"./iframe-CRmG1E1u.js";import{D as a}from"./display-table-DRlNSa-8.js";import{C as D,A as o}from"./applications-config-B1xFEUsP.js";import{e as T}from"./table-mock-B-hmPZ8q.js";import{c as V}from"./data-table-CKEruY0Z.js";import{B as S}from"./chunk-EPOLDU6W-Dna0tUck.js";import"./preload-helper-Dp1pzeXC.js";import"./i18n-dwvsPJxH.js";import"./empty-BdH3jVO2.js";import"./search-ChUEeiob.js";import"./isEqual-BBEjPE9i.js";import"./toString-CGCQEjPj.js";import"./empty-cell-Bs6bm7W-.js";import"./number-format-CewO45R2.js";import"./api-DOe_ijyX.js";import"./button-D2jS-zSn.js";import"./index-DhdxrJLf.js";import"./action-button-DcFxYZQE.js";import"./dropdown-menu-D4imu8Of.js";import"./index-Ds6oQQfn.js";import"./circle-D9oEVpsC.js";import"./check-BAfwWVDb.js";import"./separator-BYxkVBpx.js";import"./checkbox-DCyuJ9lJ.js";import"./index-BuBZ8RvE.js";import"./settings-D6HO8gVF.js";import"./skeleton-x0_kmL3l.js";import"./card-CSme-WfH.js";import"./pagination-BcKwP7hh.js";import"./select-CQM8oHHj.js";import"./chevron-down-B9HlXCeX.js";import"./chevron-up-CGwU9O-4.js";import"./ellipsis-CucmCirm.js";import"./index-DM4kI-0R.js";import"./badge-D9D3dMds.js";import"./x-DjWDdZER.js";import"./chevron-right-D3DOgPEU.js";const e=V(),P={variant_entity:{app_id:o.variant_entity},snv_occurrence:{app_id:o.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:o.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:o.admin},portal:{name:"",navigation:{}}},ur={title:"Tables/Display Table",component:a,args:{data:T,columns:[e.accessor("firstName",{cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"First Name"})}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>s.jsx("i",{children:r.getValue()}),header:()=>s.jsx("span",{children:"Last Name"})}),e.accessor("age",{header:()=>"Age",cell:r=>r.renderValue()}),e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]},decorators:[r=>s.jsx(S,{children:s.jsx(D,{config:P,children:s.jsx(r,{})})})]},n={args:{},render:r=>s.jsx(a,{...r})},t={args:{variant:"borderless"},render:r=>s.jsx(a,{...r})},c={args:{variant:"border"},render:r=>s.jsx(a,{...r})},p={args:{variant:"border",columns:[e.group({id:"group_1",header:()=>s.jsx("span",{children:"Group 1"}),columns:[e.accessor("firstName",{cell:r=>r.getValue(),footer:r=>r.column.id}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"Last Name"}),footer:r=>r.column.id})]}),e.group({header:"group_2",columns:[e.accessor("age",{header:()=>"Age",footer:r=>r.column.id}),e.group({header:"More Info",columns:[e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]})]},render:r=>s.jsx(a,{...r})},i={args:{data:[]},render:r=>s.jsx(a,{...r})};var m,l,d;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {},
  render: args => <DisplayTable {...args} />
}`,...(d=(l=n.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var u,g,h;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    variant: 'borderless'
  },
  render: args => <DisplayTable {...args} />
}`,...(h=(g=t.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var f,x,j;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    variant: 'border'
  },
  render: args => <DisplayTable {...args} />
}`,...(j=(x=c.parameters)==null?void 0:x.docs)==null?void 0:j.source}}};var v,_,b;p.parameters={...p.parameters,docs:{...(v=p.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(b=(_=p.parameters)==null?void 0:_.docs)==null?void 0:b.source}}};var H,N,y;i.parameters={...i.parameters,docs:{...(H=i.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    data: []
  },
  render: args => <DisplayTable {...args} />
}`,...(y=(N=i.parameters)==null?void 0:N.docs)==null?void 0:y.source}}};const gr=["Default","Borderless","Border","WithHeaderGroups","Empty"];export{c as Border,t as Borderless,n as Default,i as Empty,p as WithHeaderGroups,gr as __namedExportsOrder,ur as default};
