import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{D as o}from"./display-table-D49wBNjb.js";import{C as D,A as a}from"./applications-config-3OOAo44D.js";import{d as V}from"./table-mock-DUtY5NyB.js";import{i as T}from"./data-table-BRsp1gKw.js";import{B as S}from"./chunk-WWGJGFF6-0IpzJ_3T.js";import"./i18n-CRBBOSmd.js";import"./iframe-Bl7tlAti.js";import"./i18next-CYn7LYXT.js";import"./index-CBYaBgW8.js";import"./utils-CDN07tui.js";import"./empty-LncwPSrD.js";import"./index-C66Dxnp2.js";import"./chart-scatter-DVTaxjlK.js";import"./createLucideIcon-B119WVF5.js";import"./search-DKmUqS9g.js";import"./api-CXUGxQj_.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./button-KqHaQCat.js";import"./index-C-d7IIsQ.js";import"./index-Dy6y0jaD.js";import"./action-button-9r-08jXC.js";import"./dropdown-menu-DPm_FhUX.js";import"./index-D9mtqW9-.js";import"./index-BCzuw4Jg.js";import"./index-C8BBKGwP.js";import"./index-BL8Z-moU.js";import"./Combination-CrkgvPnV.js";import"./index-iyInEJkZ.js";import"./index-C2iKAgIe.js";import"./index-CWHKeK-O.js";import"./index-CfgEC-S9.js";import"./index-DnEzm5An.js";import"./check-DSe_yRo5.js";import"./separator-ChZWIdMg.js";import"./button.variants-Du9eY_ux.js";import"./spinner-D7tBPZCQ.js";import"./tooltip-0vX-MTK3.js";import"./index-CfXWnpL9.js";import"./checkbox-BUFo-vqr.js";import"./index-SF2qmtPV.js";import"./skeleton-_T1otFf0.js";import"./settings-Dw4TSVKU.js";import"./number-format-DxX1Gy7s.js";import"./card-Cyh3E19J.js";import"./pagination-DAUqxOsK.js";import"./select-DnbErV3f.js";import"./chevron-down-DOuPo75j.js";import"./chevron-up-C0Hb7JXF.js";import"./ellipsis-RxOQoOKc.js";import"./badge-DXI8q3e3.js";import"./x-4HkHZ1eq.js";import"./circle-alert-DTyzftz0.js";import"./chevron-right-BONyyZTy.js";const e=T(),P={variant_entity:{app_id:a.variant_entity},snv_occurrence:{app_id:a.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:a.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ar={title:"Tables/Display Table",component:o,args:{data:V,columns:[e.accessor("firstName",{cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"First Name"})}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>s.jsx("i",{children:r.getValue()}),header:()=>s.jsx("span",{children:"Last Name"})}),e.accessor("age",{header:()=>"Age",cell:r=>r.renderValue()}),e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]},decorators:[r=>s.jsx(S,{children:s.jsx(D,{config:P,children:s.jsx(r,{})})})]},t={args:{},render:r=>s.jsx(o,{...r})},n={args:{variant:"borderless"},render:r=>s.jsx(o,{...r})},p={args:{variant:"border"},render:r=>s.jsx(o,{...r})},i={args:{variant:"border",columns:[e.group({id:"group_1",header:()=>s.jsx("span",{children:"Group 1"}),columns:[e.accessor("firstName",{cell:r=>r.getValue(),footer:r=>r.column.id}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"Last Name"}),footer:r=>r.column.id})]}),e.group({header:"group_2",columns:[e.accessor("age",{header:()=>"Age",footer:r=>r.column.id}),e.group({header:"More Info",columns:[e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]})]},render:r=>s.jsx(o,{...r})},c={args:{data:[]},render:r=>s.jsx(o,{...r})};var m,l,d;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {},
  render: args => <DisplayTable {...args} />
}`,...(d=(l=t.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var u,g,h;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    variant: 'borderless'
  },
  render: args => <DisplayTable {...args} />
}`,...(h=(g=n.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var f,x,j;p.parameters={...p.parameters,docs:{...(f=p.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    variant: 'border'
  },
  render: args => <DisplayTable {...args} />
}`,...(j=(x=p.parameters)==null?void 0:x.docs)==null?void 0:j.source}}};var v,_,b;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
    })] as TableColumnDef<MockData, any>[]
  },
  render: args => <DisplayTable {...args} />
}`,...(b=(_=i.parameters)==null?void 0:_.docs)==null?void 0:b.source}}};var H,N,y;c.parameters={...c.parameters,docs:{...(H=c.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    data: []
  },
  render: args => <DisplayTable {...args} />
}`,...(y=(N=c.parameters)==null?void 0:N.docs)==null?void 0:y.source}}};const Cr=["Default","Borderless","Border","WithHeaderGroups","Empty"];export{p as Border,n as Borderless,t as Default,c as Empty,i as WithHeaderGroups,Cr as __namedExportsOrder,Ar as default};
