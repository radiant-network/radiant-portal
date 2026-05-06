import{j as s}from"./iframe-PdtJhSXY.js";import{D as a}from"./display-table-DS6xzTqp.js";import{C as D,A as o}from"./applications-config-CJ1DK-wz.js";import{e as T}from"./table-mock-Db_LAKKr.js";import{B as V}from"./chunk-UVKPFVEO-DN79eKzK.js";import{c as S}from"./data-table-X9DTzoe0.js";import"./preload-helper-Dp1pzeXC.js";import"./i18n-1P2ubQ09.js";import"./empty-Cdd1Ry0d.js";import"./search-DrltmfoI.js";import"./isEqual-C8swkUYZ.js";import"./toString-y4AQKRcK.js";import"./empty-cell-w5zUDFDg.js";import"./number-format-Dk1AAcKf.js";import"./api-B3xiDz_1.js";import"./button-mzy4JvA7.js";import"./index-D1R2TbJu.js";import"./action-button-HY7J-v7x.js";import"./dropdown-menu-DVYpbnhw.js";import"./index-ButXuduN.js";import"./circle-DKUFOuM1.js";import"./check-i2EeU5-5.js";import"./separator-C4sHZkfj.js";import"./checkbox-UaJTbSTF.js";import"./index-B0rgona2.js";import"./settings-Ba8f3jVA.js";import"./skeleton-BQv8XS9j.js";import"./card-1k2fw3Nz.js";import"./pagination-CTvcirmG.js";import"./select-BjSSH1c9.js";import"./chevron-down-DOJ-3plI.js";import"./chevron-up-BSw-tMxl.js";import"./ellipsis-CPFYNO1N.js";import"./index-CmYLI9eS.js";import"./index-I36YDAnJ.js";import"./badge-0uamsIEp.js";import"./x-9VAtjxyk.js";import"./chevron-right-jA3r4Vx6.js";const e=S(),P={variant_entity:{app_id:o.variant_entity},germline_snv_occurrence:{app_id:o.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:o.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:o.admin},portal:{name:"",navigation:{}}},gr={title:"Tables/Display Table",component:a,args:{data:T,columns:[e.accessor("firstName",{cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"First Name"})}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>s.jsx("i",{children:r.getValue()}),header:()=>s.jsx("span",{children:"Last Name"})}),e.accessor("age",{header:()=>"Age",cell:r=>r.renderValue()}),e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]},decorators:[r=>s.jsx(V,{children:s.jsx(D,{config:P,children:s.jsx(r,{})})})]},n={args:{},render:r=>s.jsx(a,{...r})},t={args:{variant:"borderless"},render:r=>s.jsx(a,{...r})},c={args:{variant:"border"},render:r=>s.jsx(a,{...r})},i={args:{variant:"border",columns:[e.group({id:"group_1",header:()=>s.jsx("span",{children:"Group 1"}),columns:[e.accessor("firstName",{cell:r=>r.getValue(),footer:r=>r.column.id}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"Last Name"}),footer:r=>r.column.id})]}),e.group({header:"group_2",columns:[e.accessor("age",{header:()=>"Age",footer:r=>r.column.id}),e.group({header:"More Info",columns:[e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]})]},render:r=>s.jsx(a,{...r})},p={args:{data:[]},render:r=>s.jsx(a,{...r})};var m,l,d;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
