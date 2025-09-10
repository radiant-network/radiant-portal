import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{D as s}from"./display-table-B59oSlw9.js";import{C as y}from"./applications-config-q4OA8PiL.js";import{d as D}from"./table-mock-DUtY5NyB.js";import{h as V}from"./data-table-DfOEuyQJ.js";import{B as T}from"./chunk-PVWAREVJ-C1taxNkX.js";import"./i18n-BFHEyab9.js";import"./iframe-C4VhdHbY.js";import"./context-DkqwYzW-.js";import"./index-CGj_12n1.js";import"./utils-D-KgF5mV.js";import"./empty-BYYXI_d-.js";import"./index-C66Dxnp2.js";import"./chart-scatter-5c2GQdAf.js";import"./createLucideIcon-8Lr1oLzj.js";import"./search-DqA1hdnz.js";import"./api-BYPCWrIS.js";import"./index-D8dqFcAi.js";import"./index-BBPXtLXU.js";import"./button-DIHLtoGM.js";import"./index-COcwYKbe.js";import"./action-button-DDdwU0ca.js";import"./dropdown-menu-CFPCuvYI.js";import"./index-CcLUv2_A.js";import"./index-CphM_NEg.js";import"./Combination-Bb6GvI2f.js";import"./index-ButkbYdn.js";import"./index-A6VgBoaw.js";import"./index-BOEjv1S3.js";import"./index-CIckazZy.js";import"./check-DRc1RmCY.js";import"./button.variants-Du9eY_ux.js";import"./spinner-BMSZ66Eg.js";import"./tooltip-eZCTYbea.js";import"./checkbox-B0xIRynn.js";import"./index-qxuqJ0RB.js";import"./skeleton-Shk8p_SP.js";import"./settings-DYVxWNf4.js";import"./number-format-D03oK8BY.js";import"./pagination-BD-zXBg1.js";import"./select-CvMCtLHe.js";import"./chevron-down-BLzVWgYU.js";import"./chevron-up-BzG59QGX.js";import"./ellipsis-BM4jpslE.js";import"./card-BdbO89L0.js";import"./separator-6xmuS_PL.js";import"./badge-aQXnmXeU.js";import"./x-CubKniSv.js";import"./circle-alert-DsWOU-5F.js";import"./chevron-right-CKDh57Sc.js";const e=V(),S={variant_entity:{app_id:"variant_entity"},variant_exploration:{app_id:"variant_exploration_multi_select_filter",aggregations:[]},admin:{admin_code:"admin",app_id:"admin"},portal:{name:"",navigation:{}}},Dr={title:"Tables/Display Table",component:s,args:{data:D,columns:[e.accessor("firstName",{cell:r=>r.getValue(),header:()=>a.jsx("span",{children:"First Name"})}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>a.jsx("i",{children:r.getValue()}),header:()=>a.jsx("span",{children:"Last Name"})}),e.accessor("age",{header:()=>"Age",cell:r=>r.renderValue()}),e.accessor("visits",{header:()=>a.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]},decorators:[r=>a.jsx(T,{children:a.jsx(y,{config:S,children:a.jsx(r,{})})})]},o={args:{},render:r=>a.jsx(s,{...r})},t={args:{variant:"borderless"},render:r=>a.jsx(s,{...r})},n={args:{variant:"border"},render:r=>a.jsx(s,{...r})},i={args:{variant:"border",columns:[e.group({id:"group_1",header:()=>a.jsx("span",{children:"Group 1"}),columns:[e.accessor("firstName",{cell:r=>r.getValue(),footer:r=>r.column.id}),e.accessor(r=>r.lastName,{id:"lastName",cell:r=>r.getValue(),header:()=>a.jsx("span",{children:"Last Name"}),footer:r=>r.column.id})]}),e.group({header:"group_2",columns:[e.accessor("age",{header:()=>"Age",footer:r=>r.column.id}),e.group({header:"More Info",columns:[e.accessor("visits",{header:()=>a.jsx("span",{children:"Visits"})}),e.accessor("status",{header:"Status"}),e.accessor("progress",{header:"Profile Progress"})]})]})]},render:r=>a.jsx(s,{...r})},p={args:{data:[]},render:r=>a.jsx(s,{...r})};var m,c,l;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {},
  render: args => <DisplayTable {...args} />
}`,...(l=(c=o.parameters)==null?void 0:c.docs)==null?void 0:l.source}}};var d,u,g;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    variant: 'borderless'
  },
  render: args => <DisplayTable {...args} />
}`,...(g=(u=t.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};var h,f,x;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    variant: 'border'
  },
  render: args => <DisplayTable {...args} />
}`,...(x=(f=n.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};var j,_,b;i.parameters={...i.parameters,docs:{...(j=i.parameters)==null?void 0:j.docs,source:{originalSource:`{
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
}`,...(b=(_=i.parameters)==null?void 0:_.docs)==null?void 0:b.source}}};var v,H,N;p.parameters={...p.parameters,docs:{...(v=p.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    data: []
  },
  render: args => <DisplayTable {...args} />
}`,...(N=(H=p.parameters)==null?void 0:H.docs)==null?void 0:N.source}}};const Vr=["Default","Borderless","Border","WithHeaderGroups","Empty"];export{n as Border,t as Borderless,o as Default,p as Empty,i as WithHeaderGroups,Vr as __namedExportsOrder,Dr as default};
