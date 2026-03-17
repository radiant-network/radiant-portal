import{j as s}from"./iframe-fuMeGN55.js";import{D as a}from"./display-table-lxRDPTXX.js";import{C as D,A as o}from"./applications-config-BpCe7aBJ.js";import{e as T}from"./table-mock-t2F2C3tP.js";import{c as V}from"./data-table-D4Ic3NJT.js";import{B as S}from"./chunk-EPOLDU6W-DRaBYFCa.js";import"./preload-helper-Dp1pzeXC.js";import"./i18n-Cn9hqjYo.js";import"./empty-Dky7KzRE.js";import"./search-ChAK_YYo.js";import"./isEqual-B11CO0E2.js";import"./toString-gmzxEJNG.js";import"./empty-cell-fZARQKRk.js";import"./number-format-D2EqLugV.js";import"./api-D1Ry_Ajg.js";import"./index-D-Epa_If.js";import"./button-Bxfmps2v.js";import"./index-xXWWjBr5.js";import"./action-button-CNAnyKFq.js";import"./dropdown-menu-BWOWLXa_.js";import"./index-BcsYj1sj.js";import"./circle-Dx5yjyGq.js";import"./check-BpVxTnN5.js";import"./separator-C8lzm_Mx.js";import"./checkbox-Bx6WekYY.js";import"./index-DjgIQjmx.js";import"./settings-C7rlt2oM.js";import"./skeleton-DT8uST8g.js";import"./card-dzknaivw.js";import"./pagination-DESz_q3Y.js";import"./select-C84aEJgH.js";import"./chevron-down-Bkx4zkbn.js";import"./chevron-up-ChnCxzkN.js";import"./ellipsis-hsH_jro1.js";import"./index-D9AoZZ8d.js";import"./index-DFYN2R7l.js";import"./badge-MAGeI3OO.js";import"./x-BEXx6cPD.js";import"./chevron-right-BZxUF79M.js";const e=V(),P={variant_entity:{app_id:o.variant_entity},snv_occurrence:{app_id:o.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:o.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:o.admin},portal:{name:"",navigation:{}}},hr={title:"Tables/Display Table",component:a,args:{data:T,columns:[e.accessor("firstName",{cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"First Name"})}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>s.jsx("i",{children:r.getValue()}),header:()=>s.jsx("span",{children:"Last Name"})}),e.accessor("age",{header:()=>"Age",cell:r=>r.renderValue()}),e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]},decorators:[r=>s.jsx(S,{children:s.jsx(D,{config:P,children:s.jsx(r,{})})})]},n={args:{},render:r=>s.jsx(a,{...r})},t={args:{variant:"borderless"},render:r=>s.jsx(a,{...r})},c={args:{variant:"border"},render:r=>s.jsx(a,{...r})},p={args:{variant:"border",columns:[e.group({id:"group_1",header:()=>s.jsx("span",{children:"Group 1"}),columns:[e.accessor("firstName",{cell:r=>r.getValue(),footer:r=>r.column.id}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"Last Name"}),footer:r=>r.column.id})]}),e.group({header:"group_2",columns:[e.accessor("age",{header:()=>"Age",footer:r=>r.column.id}),e.group({header:"More Info",columns:[e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]})]},render:r=>s.jsx(a,{...r})},i={args:{data:[]},render:r=>s.jsx(a,{...r})};var m,l,d;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(y=(N=i.parameters)==null?void 0:N.docs)==null?void 0:y.source}}};const fr=["Default","Borderless","Border","WithHeaderGroups","Empty"];export{c as Border,t as Borderless,n as Default,i as Empty,p as WithHeaderGroups,fr as __namedExportsOrder,hr as default};
