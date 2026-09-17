import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{i as n,n as r,t as i}from"./data-table-DijQxe4P.js";import{n as a,t as o}from"./case-exploration-table-filters-4Os35HdR.js";import{_ as s,w as c}from"./api-DXv3C38A.js";import{i as l,n as u}from"./story-section-DVTm6cGm.js";import{r as d,t as f}from"./lib-CZRp1gG1.js";import{i as p,n as m,t as h}from"./applications-config-D877dlRU.js";import{n as g,s as _,t as v}from"./card-lDj02HnZ.js";import{c as y,l as b,n as x,o as S}from"./table-mock-Dwn64BAX.js";function C({args:e,title:t,description:n}){return(0,w.jsx)(u,{title:t,description:n,children:(0,w.jsx)(`div`,{className:`bg-muted w-full size-auto h-screen overflow-auto p-3`,children:(0,w.jsx)(v,{className:`h-auto size-max w-full`,children:(0,w.jsx)(g,{children:(0,w.jsx)(i,{...e})})})})})}var w,T,E,D,O,k,A,j,M,N,P,F,I,L,R,z;function B(){return(B=e((()=>{d(),c(),a(),n(),_(),p(),l(),S(),w=t(),T=r(),E={variant_entity:{app_id:h.variant_entity},germline_snv_occurrence:{app_id:h.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:h.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:`admin`,app_id:h.admin},portal:{name:``,navigation:{}}},D={title:`Features/Data Table`,component:i,args:{id:`storybook`,columns:y,data:x,serverOptions:{defaultSorting:[{field:`germline_pf_wgs`,order:s.Asc}],onSortingChange:e=>{}},defaultColumnSettings:b,loadingStates:{total:!1,list:!1},pagination:{type:`server`,state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>(0,w.jsx)(f,{children:(0,w.jsx)(m,{config:E,children:(0,w.jsx)(e,{})})})]},O={args:{loadingStates:{list:!0,total:!0}},render:e=>(0,w.jsx)(C,{args:e,title:`Loading`})},k={args:{loadingStates:{list:!1,total:!1},data:[]},render:e=>(0,w.jsx)(C,{args:e,title:`Empty`})},A={args:{loadingStates:{list:!1,total:!1},data:[],hasError:!0},render:e=>(0,w.jsx)(C,{args:e,title:`Error`})},j={args:{data:x.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0},render:e=>(0,w.jsx)(C,{args:e,title:`Default`})},M={args:{enableFullscreen:!0},render:e=>(0,w.jsx)(C,{args:e,title:`Fullscreen`,description:`Use the “Open in new canvas” button at the top right of the screen for a better preview.`})},N={args:{data:x.slice(0,1),total:1,enableFullscreen:!0,enableColumnOrdering:!0},render:e=>(0,w.jsx)(C,{args:e,title:`Less than 10 results`})},P={args:{data:x.slice(0,1),total:1,TableFilters:()=>(0,w.jsx)(o,{loading:!1,setSearchCriteria:()=>{}}),enableFullscreen:!0,enableColumnOrdering:!0,tableIndexResultPosition:`bottom`},render:e=>(0,w.jsx)(C,{args:e,title:`Filters + less than 10 results`})},F={args:{pagination:{type:`hidden`}},render:e=>(0,w.jsx)(C,{args:e,title:`Pagination hidden`})},I={args:{pagination:{type:`locale`,state:{pageIndex:0,pageSize:5}}},render:e=>(0,w.jsx)(C,{args:e,title:`Pagination locale`})},L={args:{data:x.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[T.accessor(`firstName`,{id:`firstName`,cell:e=>e.getValue(),header:()=>(0,w.jsx)(`span`,{children:`First Name`})}),T.accessor(e=>e.lastName,{id:`lastName`,cell:e=>(0,w.jsx)(`i`,{children:e.getValue()}),header:()=>(0,w.jsx)(`span`,{children:`Last Name`})}),T.accessor(`age`,{id:`age`,header:()=>`Age`,cell:e=>e.renderValue(),aggregatedCell:({getValue:e})=>(0,w.jsx)(w.Fragment,{children:`[${e()[0]}-${e()[1]}]`}),aggregationFn:`extent`,enableGrouping:!0}),T.accessor(`visits`,{id:`visits`,header:()=>(0,w.jsx)(`span`,{children:`Visits`}),aggregationFn:`sum`}),T.accessor(`status`,{id:`status`,header:`Status`,getGroupingValue:e=>`Group By ${e.status}`,enableGrouping:!0}),T.accessor(`progress`,{id:`progress`,header:`Profile Progress`,cell:({getValue:e})=>`${Math.round(e()*100)/100}%`,aggregationFn:`mean`,aggregatedCell:({getValue:e})=>`~${Math.round(e()*100)/100}%`})]},render:e=>(0,w.jsx)(C,{args:e,title:`Group by`,description:`You can group by status.`})},R={args:{columns:[T.accessor(`firstName`,{cell:e=>e.getValue(),header:()=>(0,w.jsx)(`span`,{children:`First Name`}),footer:()=>(0,w.jsx)(`span`,{children:`First Name`})}),T.accessor(e=>e.lastName,{id:`lastName`,cell:e=>(0,w.jsx)(`i`,{children:e.getValue()}),header:()=>(0,w.jsx)(`span`,{children:`Last Name`}),footer:()=>(0,w.jsx)(`span`,{children:`Last Name`})}),T.accessor(`age`,{header:()=>`Age`,cell:e=>e.renderValue(),footer:()=>(0,w.jsx)(`span`,{children:`Age`})}),T.accessor(`visits`,{header:()=>(0,w.jsx)(`span`,{children:`Visits`}),footer:()=>(0,w.jsx)(`span`,{children:`First Name`})}),T.accessor(`status`,{header:`Status`,footer:()=>(0,w.jsx)(`span`,{children:`Status`})}),T.accessor(`progress`,{header:`Profile Progress`,footer:()=>(0,w.jsx)(`span`,{children:`Profile Progress`})})]},render:e=>(0,w.jsx)(C,{args:e,title:`Footer`})},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: true,
      total: true
    }
  },
  render: args => <DataTableStory args={args} title="Loading" />
}`,...O.parameters?.docs?.source}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data: []
  },
  render: args => <DataTableStory args={args} title="Empty" />
}`,...k.parameters?.docs?.source}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data: [],
    hasError: true
  },
  render: args => <DataTableStory args={args} title="Error" />
}`,...A.parameters?.docs?.source}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true
  },
  render: args => <DataTableStory args={args} title="Default" />
}`,...j.parameters?.docs?.source}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  args: {
    enableFullscreen: true
  },
  render: args => <DataTableStory args={args} title="Fullscreen" description="Use the “Open in new canvas” button at the top right of the screen for a better preview." />
}`,...M.parameters?.docs?.source}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 1),
    total: 1,
    enableFullscreen: true,
    enableColumnOrdering: true
  },
  render: args => <DataTableStory args={args} title="Less than 10 results" />
}`,...N.parameters?.docs?.source}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 1),
    total: 1,
    TableFilters: () => <TableFilters loading={false} setSearchCriteria={() => {}} />,
    enableFullscreen: true,
    enableColumnOrdering: true,
    tableIndexResultPosition: 'bottom'
  },
  render: args => <DataTableStory args={args} title="Filters + less than 10 results" />
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    pagination: {
      type: 'hidden'
    }
  },
  render: args => <DataTableStory args={args} title="Pagination hidden" />
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    pagination: {
      type: 'locale',
      state: {
        pageIndex: 0,
        pageSize: 5
      }
    }
  },
  render: args => <DataTableStory args={args} title="Pagination locale" />
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true,
    columns: [columnHelper.accessor('firstName', {
      id: 'firstName',
      cell: info => info.getValue(),
      header: () => <span>First Name</span>
    }), columnHelper.accessor(row => row.lastName, {
      id: 'lastName',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Last Name</span>
    }), columnHelper.accessor('age', {
      id: 'age',
      header: () => 'Age',
      cell: info => info.renderValue(),
      aggregatedCell: ({
        getValue
      }) => <>{\`[\${getValue()[0]}-\${getValue()[1]}]\`}</>,
      aggregationFn: 'extent',
      enableGrouping: true
    }), columnHelper.accessor('visits', {
      id: 'visits',
      header: () => <span>Visits</span>,
      aggregationFn: 'sum'
    }), columnHelper.accessor('status', {
      id: 'status',
      header: 'Status',
      getGroupingValue: row => \`Group By \${row.status}\`,
      enableGrouping: true
    }), columnHelper.accessor('progress', {
      id: 'progress',
      header: 'Profile Progress',
      cell: ({
        getValue
      }) => \`\${Math.round(getValue<number>() * 100) / 100}%\`,
      aggregationFn: 'mean',
      aggregatedCell: ({
        getValue
      }) => \`~\${Math.round(getValue<number>() * 100) / 100}%\`
    })] as TableColumnDef<TableMockData, any>[]
  },
  render: args => <DataTableStory args={args} title="Group by" description="You can group by status." />
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    columns: [columnHelper.accessor('firstName', {
      cell: info => info.getValue(),
      header: () => <span>First Name</span>,
      footer: () => <span>First Name</span>
    }), columnHelper.accessor(row => row.lastName, {
      id: 'lastName',
      cell: info => <i>{info.getValue()}</i>,
      header: () => <span>Last Name</span>,
      footer: () => <span>Last Name</span>
    }), columnHelper.accessor('age', {
      header: () => 'Age',
      cell: info => info.renderValue(),
      footer: () => <span>Age</span>
    }), columnHelper.accessor('visits', {
      header: () => <span>Visits</span>,
      footer: () => <span>First Name</span>
    }), columnHelper.accessor('status', {
      header: 'Status',
      footer: () => <span>Status</span>
    }), columnHelper.accessor('progress', {
      header: 'Profile Progress',
      footer: () => <span>Profile Progress</span>
    })]
  },
  render: args => <DataTableStory args={args} title="Footer" />
}`,...R.parameters?.docs?.source}}},z=[`Loading`,`Empty`,`Error`,`Default`,`Fullscreen`,`LessThan10Results`,`DataTableFiltersAndLessThan10Results`,`PaginationHidden`,`PaginationLocale`,`GroupBy`,`Footer`]})))()}B();export{P as DataTableFiltersAndLessThan10Results,j as Default,k as Empty,A as Error,R as Footer,M as Fullscreen,L as GroupBy,N as LessThan10Results,O as Loading,F as PaginationHidden,I as PaginationLocale,z as __namedExportsOrder,D as default};