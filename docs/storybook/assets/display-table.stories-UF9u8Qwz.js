import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./react-BRh_h4kc.js";import{t as n}from"./jsx-runtime-BdxMnOeJ.js";import{i as r,n as i}from"./data-table-DijQxe4P.js";import{m as a,w as o}from"./api-DXv3C38A.js";import{i as s,n as c}from"./story-section-DVTm6cGm.js";import{r as l,t as u}from"./lib-CZRp1gG1.js";import{i as d,n as f,t as p}from"./applications-config-D877dlRU.js";import{n as m,t as h}from"./display-table-Cgsb8XhT.js";import{n as g,o as _}from"./table-mock-Dwn64BAX.js";import{n as v,t as y}from"./row-selection-cell-zsCIGFDL.js";import{n as b,t as x}from"./table-row-selection-header-DZxMin4Y.js";var S,C,w,T,E,D,O,k,A,j,M,N;function P(){return(P=e((()=>{S=t(),l(),o(),v(),r(),m(),b(),d(),s(),_(),C=n(),w=i(),T={variant_entity:{app_id:p.variant_entity},germline_snv_occurrence:{app_id:p.germline_snv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_SNV_OCCURRENCE},germline_cnv_occurrence:{app_id:p.germline_cnv_occurrence,aggregations:[],saved_filter_type:a.GERMLINE_CNV_OCCURRENCE},somatic_snv_to_occurrence:{app_id:p.somatic_snv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_snv_tn_occurrence:{app_id:p.somatic_snv_tn_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_SNV_OCCURRENCE},somatic_cnv_to_occurrence:{app_id:p.somatic_cnv_to_occurrence,aggregations:[],saved_filter_type:a.SOMATIC_CNV_OCCURRENCE},admin:{admin_code:`admin`,app_id:p.admin},portal:{name:``,navigation:{}}},E={title:`Features/Display Table`,component:h,args:{data:g,columns:[w.accessor(`firstName`,{cell:e=>e.getValue(),header:()=>(0,C.jsx)(`span`,{children:`First Name`})}),w.accessor(e=>e.lastName,{id:`lastName`,cell:e=>(0,C.jsx)(`i`,{children:e.getValue()}),header:()=>(0,C.jsx)(`span`,{children:`Last Name`})}),w.accessor(`age`,{header:()=>`Age`,cell:e=>e.renderValue()}),w.accessor(`visits`,{header:()=>(0,C.jsx)(`span`,{children:`Visits`})}),w.accessor(`status`,{header:`Status`}),w.accessor(`progress`,{header:`Profile Progress`})]},decorators:[e=>(0,C.jsx)(u,{children:(0,C.jsx)(f,{config:T,children:(0,C.jsx)(e,{})})})]},D={args:{},render:e=>(0,C.jsx)(c,{title:`Default`,children:(0,C.jsx)(h,{...e})})},O={args:{variant:`borderless`},render:e=>(0,C.jsx)(c,{title:`Borderless`,children:(0,C.jsx)(h,{...e})})},k={args:{variant:`border`},render:e=>(0,C.jsx)(c,{title:`Border`,children:(0,C.jsx)(h,{...e})})},A={args:{variant:`border`,columns:[w.group({id:`group_1`,header:()=>(0,C.jsx)(`span`,{children:`Group 1`}),columns:w.columns([w.accessor(`firstName`,{cell:e=>e.getValue(),footer:e=>e.column.id}),w.accessor(e=>e.lastName,{id:`lastName`,cell:e=>e.getValue(),header:()=>(0,C.jsx)(`span`,{children:`Last Name`}),footer:e=>e.column.id})])}),w.group({header:`group_2`,columns:w.columns([w.accessor(`age`,{header:()=>`Age`,footer:e=>e.column.id}),w.group({header:`More Info`,columns:w.columns([w.accessor(`visits`,{header:()=>(0,C.jsx)(`span`,{children:`Visits`})}),w.accessor(`status`,{header:`Status`}),w.accessor(`progress`,{header:`Profile Progress`})])})])})]},render:e=>(0,C.jsx)(c,{title:`With header groups`,children:(0,C.jsx)(h,{...e})})},j={args:{data:[]},render:e=>(0,C.jsx)(c,{title:`Empty`,children:(0,C.jsx)(h,{...e})})},M={args:{columns:[{id:`rowSelection`,size:48,maxSize:48,header:e=>(0,C.jsx)(x,{table:e.table}),cell:e=>(0,C.jsx)(y,{row:e.row})},w.accessor(`firstName`,{cell:e=>e.getValue(),header:()=>(0,C.jsx)(`span`,{children:`First Name`})}),w.accessor(e=>e.lastName,{id:`lastName`,cell:e=>(0,C.jsx)(`i`,{children:e.getValue()}),header:()=>(0,C.jsx)(`span`,{children:`Last Name`})}),w.accessor(`age`,{header:()=>`Age`,cell:e=>e.renderValue()}),w.accessor(`visits`,{header:()=>(0,C.jsx)(`span`,{children:`Visits`})}),w.accessor(`status`,{header:`Status`}),w.accessor(`progress`,{header:`Profile Progress`})]},render:e=>{let[t,n]=(0,S.useState)({});return(0,C.jsx)(c,{title:`With row selection`,description:`Click a row's checkbox to select it, or use the header checkbox to toggle all rows on the page.`,children:(0,C.jsx)(h,{...e,rowSelection:t,onRowSelectionChange:n})})}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {},
  render: args => <StorySection title="Default">
      <DisplayTable {...args} />
    </StorySection>
}`,...D.parameters?.docs?.source}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'borderless'
  },
  render: args => <StorySection title="Borderless">
      <DisplayTable {...args} />
    </StorySection>
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'border'
  },
  render: args => <StorySection title="Border">
      <DisplayTable {...args} />
    </StorySection>
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    data: []
  },
  render: args => <StorySection title="Empty">
      <DisplayTable {...args} />
    </StorySection>
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
}`,...M.parameters?.docs?.source}}},N=[`Default`,`Borderless`,`Border`,`WithHeaderGroups`,`Empty`,`WithRowSelection`]})))()}P();export{k as Border,O as Borderless,D as Default,j as Empty,A as WithHeaderGroups,M as WithRowSelection,N as __namedExportsOrder,E as default};