import{j as s}from"./jsx-runtime-D_zvdyIk.js";import{D as a}from"./display-table-D7e1CfPj.js";import{C as D,A as o}from"./applications-config-3OOAo44D.js";import{d as V}from"./table-mock-DUtY5NyB.js";import{i as T}from"./data-table-Bd05QtRf.js";import{B as S}from"./chunk-PVWAREVJ-ZXULl1h5.js";import"./i18n-ByrszOZh.js";import"./iframe-CcDRaQeA.js";import"./i18next-CYn7LYXT.js";import"./index-CBYaBgW8.js";import"./utils-D-KgF5mV.js";import"./empty-n-BsCUQA.js";import"./index-C66Dxnp2.js";import"./chart-scatter-DVTaxjlK.js";import"./createLucideIcon-B119WVF5.js";import"./search-DKmUqS9g.js";import"./api-DSP0ZUQ6.js";import"./index-sTUCEGFJ.js";import"./index-BWnBDfn-.js";import"./button-J0tNcHDR.js";import"./index-Dut9wsGU.js";import"./action-button-KkvxmIWD.js";import"./dropdown-menu-BJyjb2OL.js";import"./index-Ba5mf8A5.js";import"./index-C6lL4ijz.js";import"./index-CJAxgcjH.js";import"./Combination-B-dCT06H.js";import"./index-DrGCp3O6.js";import"./index-BtWW-1ow.js";import"./index-BZEiv_1o.js";import"./index-ycEarWk3.js";import"./check-DSe_yRo5.js";import"./separator-B36Ht569.js";import"./button.variants-Du9eY_ux.js";import"./spinner-CKwzofCp.js";import"./tooltip-BjBxR1Ac.js";import"./index-BiH9rn-5.js";import"./checkbox-B4fiCiBj.js";import"./index-SF2qmtPV.js";import"./skeleton-Shk8p_SP.js";import"./settings-Dw4TSVKU.js";import"./number-format-DxX1Gy7s.js";import"./pagination-BQgBg4qP.js";import"./select-DMB6Vi4A.js";import"./chevron-down-DOuPo75j.js";import"./chevron-up-C0Hb7JXF.js";import"./ellipsis-RxOQoOKc.js";import"./card-CV4HB3NY.js";import"./badge-B5hMF8F4.js";import"./x-4HkHZ1eq.js";import"./circle-alert-DTyzftz0.js";import"./chevron-right-BONyyZTy.js";const e=T(),P={variant_entity:{app_id:o.variant_entity},snv_occurrence:{app_id:o.snv_occurrence,aggregations:[]},cnv_occurrence:{app_id:o.cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:o.admin},portal:{name:"",navigation:{}}},Sr={title:"Tables/Display Table",component:a,args:{data:V,columns:[e.accessor("firstName",{cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"First Name"})}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>s.jsx("i",{children:r.getValue()}),header:()=>s.jsx("span",{children:"Last Name"})}),e.accessor("age",{header:()=>"Age",cell:r=>r.renderValue()}),e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]},decorators:[r=>s.jsx(S,{children:s.jsx(D,{config:P,children:s.jsx(r,{})})})]},n={args:{},render:r=>s.jsx(a,{...r})},t={args:{variant:"borderless"},render:r=>s.jsx(a,{...r})},p={args:{variant:"border"},render:r=>s.jsx(a,{...r})},i={args:{variant:"border",columns:[e.group({id:"group_1",header:()=>s.jsx("span",{children:"Group 1"}),columns:[e.accessor("firstName",{cell:r=>r.getValue(),footer:r=>r.column.id}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>r.getValue(),header:()=>s.jsx("span",{children:"Last Name"}),footer:r=>r.column.id})]}),e.group({header:"group_2",columns:[e.accessor("age",{header:()=>"Age",footer:r=>r.column.id}),e.group({header:"More Info",columns:[e.accessor("visits",{header:()=>s.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]})]},render:r=>s.jsx(a,{...r})},c={args:{data:[]},render:r=>s.jsx(a,{...r})};var m,l,d;n.parameters={...n.parameters,docs:{...(m=n.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {},
  render: args => <DisplayTable {...args} />
}`,...(d=(l=n.parameters)==null?void 0:l.docs)==null?void 0:d.source}}};var u,g,h;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    variant: 'borderless'
  },
  render: args => <DisplayTable {...args} />
}`,...(h=(g=t.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var f,x,j;p.parameters={...p.parameters,docs:{...(f=p.parameters)==null?void 0:f.docs,source:{originalSource:`{
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
}`,...(y=(N=c.parameters)==null?void 0:N.docs)==null?void 0:y.source}}};const Pr=["Default","Borderless","Border","WithHeaderGroups","Empty"];export{p as Border,t as Borderless,n as Default,c as Empty,i as WithHeaderGroups,Pr as __namedExportsOrder,Sr as default};
