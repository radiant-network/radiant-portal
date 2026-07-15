import{j as r,r as h}from"./iframe-CuWpm1qa.js";import{S as c}from"./api-DxXkaL5r.js";import{R as S}from"./row-selection-cell-Dj5qxkOV.js";import{D as a}from"./display-table-B4GU6vQE.js";import{R as _}from"./table-row-selection-header-wW7w8vVl.js";import{C as f,A as s}from"./applications-config-bsVpSCPZ.js";import{a as t}from"./story-section-w3-NF7Xp.js";import{i as x}from"./table-mock-u1nRL7AE.js";import{B as y}from"./chunk-QUQL4437-CXAMCr7o.js";import{c as N}from"./data-table-BwkoD08z.js";import"./preload-helper-PPVm8Dsz.js";import"./checkbox-D1IGK36Y.js";import"./index-BO3dUORY.js";import"./check-j36eKSHy.js";import"./i18n-Dk4pliQz.js";import"./index-8BZx1Yb8.js";import"./empty-DecxtquU.js";import"./search-DJbsJVWb.js";import"./empty-cell-C8CmKkxm.js";import"./number-format-CPaf5g4o.js";import"./button-CSz6EV4E.js";import"./action-button-lN5zPVbm.js";import"./dropdown-menu-BOERjw4c.js";import"./index-Dmb4mQ0b.js";import"./index-CJQJWHRc.js";import"./circle-Dfldtqa6.js";import"./separator-BEF1T6M0.js";import"./grip-vertical-CAdv7Q8c.js";import"./settings-DBIlpOVO.js";import"./skeleton-BQ5jhFqg.js";import"./card-DjuS4vUs.js";import"./pagination-uTr5Y2hx.js";import"./select-CxLEk9oM.js";import"./chevron-down-CDh4_9lO.js";import"./chevron-up-V9reyzVa.js";import"./ellipsis-BpQDtzBQ.js";import"./index-DSNW0WvP.js";import"./api-BjHhlcVm.js";import"./badge-Dco37cMT.js";import"./x-BvFgF3db.js";import"./chevron-right-U83oTN6o.js";const o=N(),w={variant_entity:{app_id:s.variant_entity},germline_snv_occurrence:{app_id:s.germline_snv_occurrence,aggregations:[],saved_filter_type:c.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:s.germline_cnv_occurrence,aggregations:[],saved_filter_type:c.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:s.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:c.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:s.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:c.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:s.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:c.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:s.admin},portal:{name:"",navigation:{}}},pe={title:"Features/Display Table",component:a,args:{data:x,columns:[o.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),o.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),o.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),o.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),o.accessor("status",{header:"Status"}),o.accessor("progress",{header:"Profile Progress"})]},decorators:[e=>r.jsx(y,{children:r.jsx(f,{config:w,children:r.jsx(e,{})})})]},i={args:{},render:e=>r.jsx(t,{title:"Default",children:r.jsx(a,{...e})})},n={args:{variant:"borderless"},render:e=>r.jsx(t,{title:"Borderless",children:r.jsx(a,{...e})})},l={args:{variant:"border"},render:e=>r.jsx(t,{title:"Border",children:r.jsx(a,{...e})})},p={args:{variant:"border",columns:[o.group({id:"group_1",header:()=>r.jsx("span",{children:"Group 1"}),columns:[o.accessor("firstName",{cell:e=>e.getValue(),footer:e=>e.column.id}),o.accessor(e=>e.lastName,{id:"lastName",cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"Last Name"}),footer:e=>e.column.id})]}),o.group({header:"group_2",columns:[o.accessor("age",{header:()=>"Age",footer:e=>e.column.id}),o.group({header:"More Info",columns:[o.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),o.accessor("status",{header:"Status"}),o.accessor("progress",{header:"Profile Progress"})]})]})]},render:e=>r.jsx(t,{title:"With header groups",children:r.jsx(a,{...e})})},m={args:{data:[]},render:e=>r.jsx(t,{title:"Empty",children:r.jsx(a,{...e})})},d={args:{columns:[{id:"rowSelection",size:48,maxSize:48,header:e=>r.jsx(_,{table:e.table}),cell:e=>r.jsx(S,{row:e.row})},o.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),o.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),o.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),o.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),o.accessor("status",{header:"Status"}),o.accessor("progress",{header:"Profile Progress"})]},render:e=>{const[u,g]=h.useState({});return r.jsx(t,{title:"With row selection",description:"Click a row's checkbox to select it, or use the header checkbox to toggle all rows on the page.",children:r.jsx(a,{...e,rowSelection:u,onRowSelectionChange:g})})}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};const me=["Default","Borderless","Border","WithHeaderGroups","Empty","WithRowSelection"];export{l as Border,n as Borderless,i as Default,m as Empty,p as WithHeaderGroups,d as WithRowSelection,me as __namedExportsOrder,pe as default};
