import{j as r}from"./iframe-C3tvUR1J.js";import{S as t}from"./api-C5s-SBNp.js";import{D as a}from"./display-table-Ypv9gLs3.js";import{C as d,A as o}from"./applications-config-CES-ACJK.js";import{a as c}from"./story-section-Cml820jU.js";import{Y as u,c as g}from"./table-mock-BkMN8jgx.js";import{B as _}from"./chunk-QUQL4437-CRphbiH_.js";import"./preload-helper-PPVm8Dsz.js";import"./i18n-sXy_IXHd.js";import"./index-COGJCRuB.js";import"./index-t1n2C8Aq.js";import"./empty-qeSGvgeB.js";import"./search-rOHXVfJt.js";import"./empty-cell-Be5Gg78Y.js";import"./number-format-DBZQhhow.js";import"./button-DBxIrY1M.js";import"./index-wNbfclQ1.js";import"./action-button-BNzMztdM.js";import"./dropdown-menu-6SkrUZiL.js";import"./index-B_di4gWb.js";import"./index-BQlRfD1v.js";import"./check-Cewv9fI2.js";import"./circle-B5BEDuQC.js";import"./separator-DYKEDePW.js";import"./checkbox-Zxibie3O.js";import"./index-BnzHzloH.js";import"./settings-Deq55io9.js";import"./skeleton-B0doAO5A.js";import"./card-COsSMpki.js";import"./pagination-DNdJcIek.js";import"./select-CexQazZ-.js";import"./chevron-down-D-F92SRE.js";import"./chevron-up-8kpNgi0N.js";import"./ellipsis-BomfqWnr.js";import"./api-BzF852Vm.js";import"./badge-D4PZM7uY.js";import"./x-QdJ2UURP.js";import"./chevron-right-IdYogoK_.js";const s=g(),h={variant_entity:{app_id:o.variant_entity},germline_snv_occurrence:{app_id:o.germline_snv_occurrence,aggregations:[],saved_filter_type:t.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:o.germline_cnv_occurrence,aggregations:[],saved_filter_type:t.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:o.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:o.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:o.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:o.admin},portal:{name:"",navigation:{}}},re={title:"Features/Display Table",component:a,args:{data:u,columns:[s.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),s.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),s.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),s.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),s.accessor("status",{header:"Status"}),s.accessor("progress",{header:"Profile Progress"})]},decorators:[e=>r.jsx(_,{children:r.jsx(d,{config:h,children:r.jsx(e,{})})})]},i={args:{},render:e=>r.jsx(c,{title:"Default",children:r.jsx(a,{...e})})},n={args:{variant:"borderless"},render:e=>r.jsx(c,{title:"Borderless",children:r.jsx(a,{...e})})},p={args:{variant:"border"},render:e=>r.jsx(c,{title:"Border",children:r.jsx(a,{...e})})},l={args:{variant:"border",columns:[s.group({id:"group_1",header:()=>r.jsx("span",{children:"Group 1"}),columns:[s.accessor("firstName",{cell:e=>e.getValue(),footer:e=>e.column.id}),s.accessor(e=>e.lastName,{id:"lastName",cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"Last Name"}),footer:e=>e.column.id})]}),s.group({header:"group_2",columns:[s.accessor("age",{header:()=>"Age",footer:e=>e.column.id}),s.group({header:"More Info",columns:[s.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),s.accessor("status",{header:"Status"}),s.accessor("progress",{header:"Profile Progress"})]})]})]},render:e=>r.jsx(c,{title:"With header groups",children:r.jsx(a,{...e})})},m={args:{data:[]},render:e=>r.jsx(c,{title:"Empty",children:r.jsx(a,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};const se=["Default","Borderless","Border","WithHeaderGroups","Empty"];export{p as Border,n as Borderless,i as Default,m as Empty,l as WithHeaderGroups,se as __namedExportsOrder,re as default};
