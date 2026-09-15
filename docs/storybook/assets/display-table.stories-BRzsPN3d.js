import{j as r,r as h,S as c}from"./iframe-iq8cIiFW.js";import{R as S}from"./row-selection-cell-DfPTxXah.js";import{c as _}from"./data-table-DLQxWh_Z.js";import{D as a}from"./display-table-BtaEJpOr.js";import{R as f}from"./table-row-selection-header-CH3nL_qF.js";import{C as x,A as s}from"./applications-config-ic1eUZQg.js";import{a as t}from"./story-section-B8E7zijV.js";import{d as y}from"./table-mock-DIrZtAVD.js";import{B as w}from"./chunk-BV7QT456-DVWa4Q_8.js";import"./preload-helper-PPVm8Dsz.js";import"./checkbox-C8_xnVe3.js";import"./index-DZSl8OPB.js";import"./with-selector-C0JoEFUh.js";import"./isEqual-BvpxiEAB.js";import"./grip-vertical-CxZCOS-n.js";import"./settings-Cydlg7_h.js";import"./arrow-down-WlWHxK9q.js";import"./skeleton-BgxuYm9_.js";import"./number-format-DD-As31c.js";import"./card-APirdkki.js";import"./pagination-CpdTrf8U.js";import"./select-CEGjxQi2.js";import"./chevron-down-Pq5xxRUk.js";import"./chevron-up-CMDKiQsk.js";import"./ellipsis-DLqYNs2Q.js";import"./empty-DJHEJkkF.js";import"./index-CU5Gs7U5.js";import"./badge-CAgd1iWD.js";import"./x--JQCAyyF.js";import"./search-CNxiQ9EZ.js";import"./chevron-right-DCOX7BaA.js";import"./_baseUniq-D-CaPd3K.js";import"./empty-cell-cott4mgG.js";const o=_(),N={variant_entity:{app_id:s.variant_entity},germline_snv_occurrence:{app_id:s.germline_snv_occurrence,aggregations:[],saved_filter_type:c.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:s.germline_cnv_occurrence,aggregations:[],saved_filter_type:c.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:s.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:c.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:s.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:c.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:s.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:c.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:"admin",app_id:s.admin},portal:{name:"",navigation:{}}},oe={title:"Features/Display Table",component:a,args:{data:y,columns:[o.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),o.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),o.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),o.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),o.accessor("status",{header:"Status"}),o.accessor("progress",{header:"Profile Progress"})]},decorators:[e=>r.jsx(w,{children:r.jsx(x,{config:N,children:r.jsx(e,{})})})]},n={args:{},render:e=>r.jsx(t,{title:"Default",children:r.jsx(a,{...e})})},i={args:{variant:"borderless"},render:e=>r.jsx(t,{title:"Borderless",children:r.jsx(a,{...e})})},l={args:{variant:"border"},render:e=>r.jsx(t,{title:"Border",children:r.jsx(a,{...e})})},p={args:{variant:"border",columns:[o.group({id:"group_1",header:()=>r.jsx("span",{children:"Group 1"}),columns:o.columns([o.accessor("firstName",{cell:e=>e.getValue(),footer:e=>e.column.id}),o.accessor(e=>e.lastName,{id:"lastName",cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"Last Name"}),footer:e=>e.column.id})])}),o.group({header:"group_2",columns:o.columns([o.accessor("age",{header:()=>"Age",footer:e=>e.column.id}),o.group({header:"More Info",columns:o.columns([o.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),o.accessor("status",{header:"Status"}),o.accessor("progress",{header:"Profile Progress"})])})])})]},render:e=>r.jsx(t,{title:"With header groups",children:r.jsx(a,{...e})})},d={args:{data:[]},render:e=>r.jsx(t,{title:"Empty",children:r.jsx(a,{...e})})},m={args:{columns:[{id:"rowSelection",size:48,maxSize:48,header:e=>r.jsx(f,{table:e.table}),cell:e=>r.jsx(S,{row:e.row})},o.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),o.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),o.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),o.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"})}),o.accessor("status",{header:"Status"}),o.accessor("progress",{header:"Profile Progress"})]},render:e=>{const[u,g]=h.useState({});return r.jsx(t,{title:"With row selection",description:"Click a row's checkbox to select it, or use the header checkbox to toggle all rows on the page.",children:r.jsx(a,{...e,rowSelection:u,onRowSelectionChange:g})})}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {},
  render: args => <StorySection title="Default">
      <DisplayTable {...args} />
    </StorySection>
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'borderless'
  },
  render: args => <StorySection title="Borderless">
      <DisplayTable {...args} />
    </StorySection>
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
      columns: columnHelper.columns([columnHelper.accessor('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id
      }), columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id
      })])
    }), columnHelper.group({
      header: 'group_2',
      columns: columnHelper.columns([columnHelper.accessor('age', {
        header: () => 'Age',
        footer: props => props.column.id
      }), columnHelper.group({
        header: 'More Info',
        columns: columnHelper.columns([columnHelper.accessor('visits', {
          header: () => <span>Visits</span>
        }), columnHelper.accessor('status', {
          header: 'Status'
        }), columnHelper.accessor('progress', {
          header: 'Profile Progress'
        })])
      })])
    })] as TableColumnDef<TableMockData, any>[]
  },
  render: args => <StorySection title="With header groups">
      <DisplayTable {...args} />
    </StorySection>
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    data: []
  },
  render: args => <StorySection title="Empty">
      <DisplayTable {...args} />
    </StorySection>
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    columns: [{
      id: 'rowSelection',
      size: 48,
      maxSize: 48,
      header: (header: HeaderContext<AppFeatures, any, unknown>) => <RowSelectionHeader table={header.table} />,
      cell: (info: CellContext<AppFeatures, any, unknown>) => <RowSelectionCell row={info.row} />
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    return <StorySection title="With row selection" description="Click a row's checkbox to select it, or use the header checkbox to toggle all rows on the page.">
        <DisplayTable {...args} rowSelection={rowSelection} onRowSelectionChange={setRowSelection} />
      </StorySection>;
  }
}`,...m.parameters?.docs?.source}}};const se=["Default","Borderless","Border","WithHeaderGroups","Empty","WithRowSelection"];export{l as Border,i as Borderless,n as Default,d as Empty,p as WithHeaderGroups,m as WithRowSelection,se as __namedExportsOrder,oe as default};
