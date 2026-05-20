import{j as s}from"./iframe-DwBDIzNo.js";import{D as a}from"./display-table-DXLJZ5Bf.js";import{C as D,A as o}from"./applications-config-c33McvLf.js";import{Y as T,c as V}from"./table-mock-bBMs6J3d.js";import{B as S}from"./chunk-UVKPFVEO-BQiUtWgB.js";import"./preload-helper-Dp1pzeXC.js";import"./i18n-AhKDWTeX.js";import"./empty-1r9g5i8K.js";import"./search-BwGU4pDt.js";import"./empty-cell-CdEBzngK.js";import"./number-format-CMeARC6T.js";import"./api-CyFX6UkQ.js";import"./button-D8_cBhjA.js";import"./index--JuLG_uA.js";import"./action-button-p5oF4E2x.js";import"./dropdown-menu-Qvqm4pBL.js";import"./index-By-2qDH7.js";import"./index-BsWtmlzq.js";import"./check-vpPvOghz.js";import"./circle-DO0wv0WI.js";import"./separator-CYssvToX.js";import"./checkbox-CGcW-Q72.js";import"./index-BKKj0RbE.js";import"./settings-DViriZkp.js";import"./skeleton-C-sfkqjl.js";import"./card-DWk7v_0w.js";import"./pagination-BTYkbCQb.js";import"./select-xTDUAIos.js";import"./chevron-down-CvP1Z2dh.js";import"./chevron-up-CBZgGEw2.js";import"./ellipsis-DzsUCMkJ.js";import"./api-C0caDa3U.js";import"./index-DdT76R05.js";import"./badge-B2cL7xLE.js";import"./x-BsZp4wzX.js";import"./chevron-right-DRuuYjSd.js";const e=V(),P={variant_entity:{app_id:o.variant_entity},germline_snv_occurrence:{app_id:o.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:o.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:o.admin},portal:{name:"",navigation:{}}},dr={title:"Tables/Display Table",component:a,args:{data:T,columns:[e.accessor("firstName",{cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"First Name"})}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>s.jsx("i",{children:r.getValue()}),header:()=>s.jsx("span",{children:"Last Name"})}),e.accessor("age",{header:()=>"Age",cell:r=>r.renderValue()}),e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]},decorators:[r=>s.jsx(S,{children:s.jsx(D,{config:P,children:s.jsx(r,{})})})]},n={args:{},render:r=>s.jsx(a,{...r})},t={args:{variant:"borderless"},render:r=>s.jsx(a,{...r})},c={args:{variant:"border"},render:r=>s.jsx(a,{...r})},i={args:{variant:"border",columns:[e.group({id:"group_1",header:()=>s.jsx("span",{children:"Group 1"}),columns:[e.accessor("firstName",{cell:r=>r.getValue(),footer:r=>r.column.id}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"Last Name"}),footer:r=>r.column.id})]}),e.group({header:"group_2",columns:[e.accessor("age",{header:()=>"Age",footer:r=>r.column.id}),e.group({header:"More Info",columns:[e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]})]},render:r=>s.jsx(a,{...r})},p={args:{data:[]},render:r=>s.jsx(a,{...r})};var m,l,d;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(y=(N=p.parameters)==null?void 0:N.docs)==null?void 0:y.source}}};const ur=["Default","Borderless","Border","WithHeaderGroups","Empty"];export{c as Border,t as Borderless,n as Default,p as Empty,i as WithHeaderGroups,ur as __namedExportsOrder,dr as default};
