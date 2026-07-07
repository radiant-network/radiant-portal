import{j as r}from"./iframe-BmQaEKqD.js";import{S as t}from"./api-5e3Wi7_0.js";import{D as a}from"./display-table-MfsnRNBf.js";import{C as d,A as o}from"./applications-config-C53CzKOB.js";import{a as c}from"./story-section-DmKrQ7pL.js";import{Y as u,c as g}from"./table-mock-C24STsTu.js";import{B as _}from"./chunk-QUQL4437-B9eNMz9d.js";import"./preload-helper-PPVm8Dsz.js";import"./i18n-DASwuS_h.js";import"./index-DPphhh4w.js";import"./empty-q2s5NkmM.js";import"./search-CM7h0a_W.js";import"./empty-cell-Dlymd-iS.js";import"./number-format-DqIvUXWF.js";import"./button-Cwn9pdSz.js";import"./action-button-NcZ7v7jd.js";import"./dropdown-menu-D8OFOKsF.js";import"./index-0v-EdXCc.js";import"./index-DQAP5Woc.js";import"./check-ZuEG5tzj.js";import"./circle-BTNlC0Y1.js";import"./separator-lVIRd7xC.js";import"./checkbox-C8Vc3L9N.js";import"./index-Bbf4jtZY.js";import"./grip-vertical-ec0n5JJN.js";import"./settings-Cl-p_k82.js";import"./skeleton-BFvQNEDz.js";import"./card-avuAW3-U.js";import"./pagination-B5c-vHfZ.js";import"./select-DLZ1Sv2a.js";import"./chevron-down-NDT5Ii8g.js";import"./chevron-up-BjRyBtL4.js";import"./ellipsis-BrY7vD_v.js";import"./index-CF26VfEE.js";import"./api-CRUcq8iX.js";import"./badge--SA6aVcv.js";import"./x-DzXSs4iU.js";import"./chevron-right-1PyhWTuz.js";const s=g(),h={variant_entity:{app_id:o.variant_entity},germline_snv_occurrence:{app_id:o.germline_snv_occurrence,aggregations:[],saved_filter_type:t.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:o.germline_cnv_occurrence,aggregations:[],saved_filter_type:t.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:o.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:o.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:o.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:t.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:o.admin},portal:{name:"",navigation:{}}},re={title:"Features/Display Table",component:a,args:{data:u,columns:[s.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),s.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),s.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),s.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),s.accessor("status",{header:"Status"}),s.accessor("progress",{header:"Profile Progress"})]},decorators:[e=>r.jsx(_,{children:r.jsx(d,{config:h,children:r.jsx(e,{})})})]},i={args:{},render:e=>r.jsx(c,{title:"Default",children:r.jsx(a,{...e})})},n={args:{variant:"borderless"},render:e=>r.jsx(c,{title:"Borderless",children:r.jsx(a,{...e})})},p={args:{variant:"border"},render:e=>r.jsx(c,{title:"Border",children:r.jsx(a,{...e})})},l={args:{variant:"border",columns:[s.group({id:"group_1",header:()=>r.jsx("span",{children:"Group 1"}),columns:[s.accessor("firstName",{cell:e=>e.getValue(),footer:e=>e.column.id}),s.accessor(e=>e.lastName,{id:"lastName",cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"Last Name"}),footer:e=>e.column.id})]}),s.group({header:"group_2",columns:[s.accessor("age",{header:()=>"Age",footer:e=>e.column.id}),s.group({header:"More Info",columns:[s.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),s.accessor("status",{header:"Status"}),s.accessor("progress",{header:"Profile Progress"})]})]})]},render:e=>r.jsx(c,{title:"With header groups",children:r.jsx(a,{...e})})},m={args:{data:[]},render:e=>r.jsx(c,{title:"Empty",children:r.jsx(a,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
