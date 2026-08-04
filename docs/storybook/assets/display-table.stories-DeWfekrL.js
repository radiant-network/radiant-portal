import{j as r,r as h}from"./iframe-BXBRzL1c.js";import{S as c}from"./api-IE258HGD.js";import{R as S}from"./row-selection-cell-B9gAAVc3.js";import{D as a}from"./display-table-DXagrJVs.js";import{R as _}from"./table-row-selection-header-BKOAsgFg.js";import{C as f,A as s}from"./applications-config-CmUEdNAO.js";import{a as t}from"./story-section-G0DD0yKl.js";import{h as x}from"./table-mock-B_xweJHl.js";import{B as y}from"./chunk-QUQL4437-DGUZn1R2.js";import{c as N}from"./data-table-Bi8pCVP_.js";import"./preload-helper-PPVm8Dsz.js";import"./checkbox-HEb-Wb1J.js";import"./index-ChzukvM0.js";import"./check-BOVnNvmn.js";import"./i18n-DUK-WuJ6.js";import"./index-DYAaY2Yf.js";import"./empty-B56OsfWm.js";import"./search-gCbpG9f6.js";import"./isEqual-BBRRvwdU.js";import"./_baseUniq-D-Db-n5w.js";import"./empty-cell-D7ri16-A.js";import"./number-format-DV0GfiRa.js";import"./button-CnDkH2FJ.js";import"./action-button-CiX5XSNN.js";import"./dropdown-menu-Dj2Zjq4n.js";import"./index-Buei5AJu.js";import"./index-C0UyXbDn.js";import"./circle-ZGZFIAr_.js";import"./separator-D6E9NYhF.js";import"./grip-vertical-BV5xekP0.js";import"./settings-DUBx0e6I.js";import"./arrow-down-o8nxA9L0.js";import"./skeleton-L9n2tz6Q.js";import"./card-Bc_90yu4.js";import"./pagination-BJIak5OX.js";import"./select-BHB1WtC1.js";import"./chevron-down-CD3dAkbA.js";import"./chevron-up-krr3_aDU.js";import"./ellipsis-B9ghaZcz.js";import"./index-DkrYVHRy.js";import"./api-CRj7GcIN.js";import"./badge-DNbRLMhx.js";import"./x-Ccdq7o_U.js";import"./chevron-right-Dsr2JqKi.js";const o=N(),w={variant_entity:{app_id:s.variant_entity},germline_snv_occurrence:{app_id:s.germline_snv_occurrence,aggregations:[],saved_filter_type:c.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:s.germline_cnv_occurrence,aggregations:[],saved_filter_type:c.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:s.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:c.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:s.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:c.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:s.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:c.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:s.admin},portal:{name:"",navigation:{}}},ue={title:"Features/Display Table",component:a,args:{data:x,columns:[o.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),o.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),o.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),o.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),o.accessor("status",{header:"Status"}),o.accessor("progress",{header:"Profile Progress"})]},decorators:[e=>r.jsx(y,{children:r.jsx(f,{config:w,children:r.jsx(e,{})})})]},i={args:{},render:e=>r.jsx(t,{title:"Default",children:r.jsx(a,{...e})})},n={args:{variant:"borderless"},render:e=>r.jsx(t,{title:"Borderless",children:r.jsx(a,{...e})})},l={args:{variant:"border"},render:e=>r.jsx(t,{title:"Border",children:r.jsx(a,{...e})})},p={args:{variant:"border",columns:[o.group({id:"group_1",header:()=>r.jsx("span",{children:"Group 1"}),columns:[o.accessor("firstName",{cell:e=>e.getValue(),footer:e=>e.column.id}),o.accessor(e=>e.lastName,{id:"lastName",cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"Last Name"}),footer:e=>e.column.id})]}),o.group({header:"group_2",columns:[o.accessor("age",{header:()=>"Age",footer:e=>e.column.id}),o.group({header:"More Info",columns:[o.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),o.accessor("status",{header:"Status"}),o.accessor("progress",{header:"Profile Progress"})]})]})]},render:e=>r.jsx(t,{title:"With header groups",children:r.jsx(a,{...e})})},m={args:{data:[]},render:e=>r.jsx(t,{title:"Empty",children:r.jsx(a,{...e})})},d={args:{columns:[{id:"rowSelection",size:48,maxSize:48,header:e=>r.jsx(_,{table:e.table}),cell:e=>r.jsx(S,{row:e.row})},o.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),o.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),o.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),o.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),o.accessor("status",{header:"Status"}),o.accessor("progress",{header:"Profile Progress"})]},render:e=>{const[u,g]=h.useState({});return r.jsx(t,{title:"With row selection",description:"Click a row's checkbox to select it, or use the header checkbox to toggle all rows on the page.",children:r.jsx(a,{...e,rowSelection:u,onRowSelectionChange:g})})}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'border'
  },
  render: args => <StorySection title="Border">
      <DisplayTable {...args} />
    </StorySection>
}`,...l.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    data: []
  },
  render: args => <StorySection title="Empty">
      <DisplayTable {...args} />
    </StorySection>
}`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    columns: [{
      id: 'rowSelection',
      size: 48,
      maxSize: 48,
      header: (header: HeaderContext<TableMockData, unknown>) => <RowSelectionHeader table={header.table} />,
      cell: info => <RowSelectionCell row={info.row} />
    }, columnHelper.accessor('firstName', {
      cell: info => info.getValue(),
      header: () => <span>First Name</span>
    }), columnHelper.accessor(row => row.lastName, {
      id: 'lastName',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Last Name</span>
    }), columnHelper.accessor('age', {
      header: () => 'Age',
      cell: info => info.renderValue()
    }), columnHelper.accessor('visits', {
      header: () => <span>Visits</span>
    }), columnHelper.accessor('status', {
      header: 'Status'
    }), columnHelper.accessor('progress', {
      header: 'Profile Progress'
    })] as TableColumnDef<TableMockData, any>[]
  },
  render: args => {
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    return <StorySection title="With row selection" description="Click a row's checkbox to select it, or use the header checkbox to toggle all rows on the page.">
        <DisplayTable {...args} rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />
      </StorySection>;
  }
}`,...d.parameters?.docs?.source}}};const ge=["Default","Borderless","Border","WithHeaderGroups","Empty","WithRowSelection"];export{l as Border,n as Borderless,i as Default,m as Empty,p as WithHeaderGroups,d as WithRowSelection,ge as __namedExportsOrder,ue as default};
