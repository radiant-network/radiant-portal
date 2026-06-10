import{j as r}from"./iframe-iTti_pyP.js";import{S as t}from"./api-C5s-SBNp.js";import{D as a}from"./display-table-D-S6V5VP.js";import{C as d,A as o}from"./applications-config-BBqjq0IL.js";import{a as c}from"./story-section-j7yPxqOK.js";import{Y as u,c as g}from"./table-mock-Jiz-cEDY.js";import{B as _}from"./chunk-QUQL4437-B96YQiWD.js";import"./preload-helper-PPVm8Dsz.js";import"./i18n-D7u3QZ6s.js";import"./index-DDx7eZJ9.js";import"./empty-BQPDZ8Cc.js";import"./search-D0c-W1hF.js";import"./empty-cell-DdIXBgLo.js";import"./number-format-CWowT-wl.js";import"./button-cGiv4dYx.js";import"./index-Da66sVI7.js";import"./action-button-DqTAdIxg.js";import"./dropdown-menu-DjOLwECI.js";import"./index-DWvOSxA9.js";import"./index-gWb2WLOK.js";import"./check-6NEOXGRc.js";import"./circle-S0Ha6SNG.js";import"./separator-C80gP3l5.js";import"./checkbox-18c2Zthj.js";import"./index-BkDmPPzg.js";import"./settings-By_EuqJv.js";import"./skeleton-jP3ldIdQ.js";import"./card-B0SNbqfY.js";import"./pagination-BQnhME3s.js";import"./select-BxW2dOwj.js";import"./chevron-down-D-qbVmgo.js";import"./chevron-up-Bg3y9tqj.js";import"./ellipsis-HOhACFoB.js";import"./api-DuAKrHCm.js";import"./badge-BVLQD79v.js";import"./x-CnmNbzCA.js";import"./chevron-right-Ml8Z0kgq.js";const s=g(),h={variant_entity:{app_id:o.variant_entity},germline_snv_occurrence:{app_id:o.germline_snv_occurrence,aggregations:[],saved_filter_type:t.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:o.germline_cnv_occurrence,aggregations:[],saved_filter_type:t.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:o.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:o.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:o.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:o.admin},portal:{name:"",navigation:{}}},ee={title:"Features/Display Table",component:a,args:{data:u,columns:[s.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),s.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),s.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),s.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),s.accessor("status",{header:"Status"}),s.accessor("progress",{header:"Profile Progress"})]},decorators:[e=>r.jsx(_,{children:r.jsx(d,{config:h,children:r.jsx(e,{})})})]},i={args:{},render:e=>r.jsx(c,{title:"Default",children:r.jsx(a,{...e})})},n={args:{variant:"borderless"},render:e=>r.jsx(c,{title:"Borderless",children:r.jsx(a,{...e})})},p={args:{variant:"border"},render:e=>r.jsx(c,{title:"Border",children:r.jsx(a,{...e})})},l={args:{variant:"border",columns:[s.group({id:"group_1",header:()=>r.jsx("span",{children:"Group 1"}),columns:[s.accessor("firstName",{cell:e=>e.getValue(),footer:e=>e.column.id}),s.accessor(e=>e.lastName,{id:"lastName",cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"Last Name"}),footer:e=>e.column.id})]}),s.group({header:"group_2",columns:[s.accessor("age",{header:()=>"Age",footer:e=>e.column.id}),s.group({header:"More Info",columns:[s.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),s.accessor("status",{header:"Status"}),s.accessor("progress",{header:"Profile Progress"})]})]})]},render:e=>r.jsx(c,{title:"With header groups",children:r.jsx(a,{...e})})},m={args:{data:[]},render:e=>r.jsx(c,{title:"Empty",children:r.jsx(a,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {},
  render: args => <StorySection title="Default">
      <DisplayTable {...args} />
    </StorySection>
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'borderless'
  },
  render: args => <StorySection title="Borderless">
      <DisplayTable {...args} />
    </StorySection>
}`,...n.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'border'
  },
  render: args => <StorySection title="Border">
      <DisplayTable {...args} />
    </StorySection>
}`,...p.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
  render: args => <StorySection title="With header groups">
      <DisplayTable {...args} />
    </StorySection>
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    data: []
  },
  render: args => <StorySection title="Empty">
      <DisplayTable {...args} />
    </StorySection>
}`,...m.parameters?.docs?.source}}};const re=["Default","Borderless","Border","WithHeaderGroups","Empty"];export{p as Border,n as Borderless,i as Default,m as Empty,l as WithHeaderGroups,re as __namedExportsOrder,ee as default};
