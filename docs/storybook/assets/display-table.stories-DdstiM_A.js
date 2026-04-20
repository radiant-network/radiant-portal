import{j as s}from"./iframe-Cjvt2qOF.js";import{D as a}from"./display-table-eIzogrn6.js";import{C as D,A as o}from"./applications-config-CvuYNe9c.js";import{e as T}from"./table-mock-Xj0mpb8v.js";import{B as V}from"./chunk-UVKPFVEO-BFJGVNwp.js";import{c as S}from"./data-table-Bmr4mTlj.js";import"./preload-helper-Dp1pzeXC.js";import"./i18n-Dnv80NNE.js";import"./empty-BNG_VSjH.js";import"./search-BcSXsJmI.js";import"./isEqual-BcHLWw8Y.js";import"./toString-9ZbBhwMv.js";import"./empty-cell-DHKixtua.js";import"./number-format-BJRPyNdw.js";import"./api-B3xiDz_1.js";import"./button-31A3H1QR.js";import"./index-hYefdW70.js";import"./action-button-DpQP58Hu.js";import"./dropdown-menu-0dsgiVyr.js";import"./index-lwMICRJh.js";import"./circle-DLZqJxqN.js";import"./check-C-jOFTXU.js";import"./separator-xFgR_GDd.js";import"./checkbox-BrGrWv1I.js";import"./index-B-sno1ut.js";import"./settings-uqxxwG47.js";import"./skeleton-DUy6XORO.js";import"./card-BLrU0CRn.js";import"./pagination-DbyVNnMF.js";import"./select-Dng3NesG.js";import"./chevron-down-D2AYFlej.js";import"./chevron-up-CN4iex_Q.js";import"./ellipsis-tgK2STS6.js";import"./index-BTgHPM2l.js";import"./index-Bhn0BmqL.js";import"./badge-CvTkURNM.js";import"./x-DnYZPIfo.js";import"./chevron-right-nvtyH8D1.js";const e=S(),P={variant_entity:{app_id:o.variant_entity},germline_snv_occurrence:{app_id:o.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:o.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:o.admin},portal:{name:"",navigation:{}}},gr={title:"Tables/Display Table",component:a,args:{data:T,columns:[e.accessor("firstName",{cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"First Name"})}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>s.jsx("i",{children:r.getValue()}),header:()=>s.jsx("span",{children:"Last Name"})}),e.accessor("age",{header:()=>"Age",cell:r=>r.renderValue()}),e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]},decorators:[r=>s.jsx(V,{children:s.jsx(D,{config:P,children:s.jsx(r,{})})})]},n={args:{},render:r=>s.jsx(a,{...r})},t={args:{variant:"borderless"},render:r=>s.jsx(a,{...r})},c={args:{variant:"border"},render:r=>s.jsx(a,{...r})},i={args:{variant:"border",columns:[e.group({id:"group_1",header:()=>s.jsx("span",{children:"Group 1"}),columns:[e.accessor("firstName",{cell:r=>r.getValue(),footer:r=>r.column.id}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"Last Name"}),footer:r=>r.column.id})]}),e.group({header:"group_2",columns:[e.accessor("age",{header:()=>"Age",footer:r=>r.column.id}),e.group({header:"More Info",columns:[e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]})]},render:r=>s.jsx(a,{...r})},p={args:{data:[]},render:r=>s.jsx(a,{...r})};var m,l,d;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(y=(N=p.parameters)==null?void 0:N.docs)==null?void 0:y.source}}};const hr=["Default","Borderless","Border","WithHeaderGroups","Empty"];export{c as Border,t as Borderless,n as Default,p as Empty,i as WithHeaderGroups,hr as __namedExportsOrder,gr as default};
