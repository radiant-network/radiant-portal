import{j as s}from"./iframe-DM8RWDl8.js";import{D as a}from"./display-table-COe40alR.js";import{C as D,A as o}from"./applications-config-3WNo6FZr.js";import{e as T}from"./table-mock-DKyaWe_e.js";import{B as V}from"./chunk-UVKPFVEO-vI7r9BMn.js";import{c as S}from"./data-table-jo_0nZJA.js";import"./preload-helper-Dp1pzeXC.js";import"./i18n-B-79avnn.js";import"./empty-CYJxr52f.js";import"./search-BxFk2SYY.js";import"./isEqual-S37-IE1G.js";import"./toString-a_fW85yz.js";import"./empty-cell-hbxq2zyB.js";import"./number-format-Dcd7YOgh.js";import"./api-DA-7dRzo.js";import"./button-C2DbAmSn.js";import"./index-Bon90g0q.js";import"./action-button-DN6fhMXW.js";import"./dropdown-menu-DxatbfOI.js";import"./index-HRycHZzQ.js";import"./circle-BbAi-DAd.js";import"./check-7b7-k0zD.js";import"./separator-DkqYGj_0.js";import"./checkbox-C3Ej1lI4.js";import"./index-CEx7hr3m.js";import"./settings-Ci70DnLT.js";import"./skeleton-rtX3UF_C.js";import"./card-IQDBcww5.js";import"./pagination-gm7q10HD.js";import"./select-BvGnnc6Z.js";import"./chevron-down-D8yYij3T.js";import"./chevron-up-Cjgw8Zqn.js";import"./ellipsis-BBt3FM-8.js";import"./index-C2LWFt_8.js";import"./index-ClvCpUvZ.js";import"./badge-DnbjS5c0.js";import"./x-CFVz_7Lt.js";import"./chevron-right-B614_u4l.js";const e=S(),P={variant_entity:{app_id:o.variant_entity},snv_occurrence:{app_id:o.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:o.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:o.admin},portal:{name:"",navigation:{}}},gr={title:"Tables/Display Table",component:a,args:{data:T,columns:[e.accessor("firstName",{cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"First Name"})}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>s.jsx("i",{children:r.getValue()}),header:()=>s.jsx("span",{children:"Last Name"})}),e.accessor("age",{header:()=>"Age",cell:r=>r.renderValue()}),e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]},decorators:[r=>s.jsx(V,{children:s.jsx(D,{config:P,children:s.jsx(r,{})})})]},n={args:{},render:r=>s.jsx(a,{...r})},t={args:{variant:"borderless"},render:r=>s.jsx(a,{...r})},c={args:{variant:"border"},render:r=>s.jsx(a,{...r})},p={args:{variant:"border",columns:[e.group({id:"group_1",header:()=>s.jsx("span",{children:"Group 1"}),columns:[e.accessor("firstName",{cell:r=>r.getValue(),footer:r=>r.column.id}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"Last Name"}),footer:r=>r.column.id})]}),e.group({header:"group_2",columns:[e.accessor("age",{header:()=>"Age",footer:r=>r.column.id}),e.group({header:"More Info",columns:[e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]})]},render:r=>s.jsx(a,{...r})},i={args:{data:[]},render:r=>s.jsx(a,{...r})};var m,l,d;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(y=(N=i.parameters)==null?void 0:N.docs)==null?void 0:y.source}}};const hr=["Default","Borderless","Border","WithHeaderGroups","Empty"];export{c as Border,t as Borderless,n as Default,i as Empty,p as WithHeaderGroups,hr as __namedExportsOrder,gr as default};
