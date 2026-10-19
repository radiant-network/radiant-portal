import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{t}from"./jsx-runtime-BdxMnOeJ.js";import{i as n,n as r,t as i}from"./data-table-BAXQsqa1.js";import{n as a,t as o}from"./empty-DbbZAuK_.js";import{n as s,t as c}from"./button-Cjk_fNaQ.js";import{n as l,t as u}from"./case-exploration-table-filters-AKHihPUN.js";import{n as d,t as f}from"./search-CmqwqpRU.js";import{O as p,x as m}from"./api-BU8w6aJC.js";import{r as h,t as g}from"./lib-DQSoxJmH.js";import{i as _,n as v}from"./story-section-DVTm6cGm.js";import{i as y,n as b,t as x}from"./applications-config-D877dlRU.js";import{n as S,s as C,t as w}from"./card-lDj02HnZ.js";import{c as T,l as E,n as D,o as O}from"./table-mock-DGtLle0_.js";function k({args:e,title:t,description:n}){return(0,A.jsx)(v,{title:t,description:n,children:(0,A.jsx)(`div`,{className:`bg-muted w-full size-auto h-screen overflow-auto p-3`,children:(0,A.jsx)(w,{className:`h-auto size-max w-full`,children:(0,A.jsx)(S,{children:(0,A.jsx)(i,{...e})})})})})}var A,j,M,N,P,F,I,L,R,z,B,V,H,U,W,G,K,q;function J(){return(J=e((()=>{h(),d(),p(),l(),n(),a(),s(),C(),y(),_(),O(),A=t(),j=r(),M={variant_entity:{app_id:x.variant_entity},germline_snv_occurrence:{app_id:x.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:x.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:`admin`,app_id:x.admin},portal:{name:``,navigation:{}}},N={title:`Features/Data Table`,component:i,args:{id:`storybook`,columns:T,data:D,serverOptions:{defaultSorting:[{field:`germline_pf_wgs`,order:m.Asc}],onSortingChange:e=>{}},defaultColumnSettings:E,loadingStates:{total:!1,list:!1},pagination:{type:`server`,state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>(0,A.jsx)(g,{children:(0,A.jsx)(b,{config:M,children:(0,A.jsx)(e,{})})})]},P={args:{loadingStates:{list:!0,total:!0}},render:e=>(0,A.jsx)(k,{args:e,title:`Loading`})},F={args:{data:[...D].sort((e,t)=>t.age-e.age).slice(0,10),serverOptions:{defaultSorting:[{field:`age`,order:m.Desc}],onSortingChange:()=>{}}},render:e=>(0,A.jsx)(k,{args:e,title:`Default sorting`,description:`The sort icon shows on the default-sorted column on load, and comes back when another column's sort is cleared.`})},I={args:{loadingStates:{list:!1,total:!1},data:[]},render:e=>(0,A.jsx)(k,{args:e,title:`Empty`})},L={args:{loadingStates:{list:!1,total:!1},data:[],emptyState:(0,A.jsx)(o,{title:`Custom empty state`,description:`Replaces the default empty state`,iconType:`custom`,icon:f,size:`mini`,children:(0,A.jsx)(c,{size:`sm`,variant:`outline`,children:`Action`})})},render:e=>(0,A.jsx)(k,{args:e,title:`Custom empty state`})},R={args:{loadingStates:{list:!1,total:!1},data:[],hasError:!0},render:e=>(0,A.jsx)(k,{args:e,title:`Error`})},z={args:{data:D.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0},render:e=>(0,A.jsx)(k,{args:e,title:`Default`})},B={args:{enableFullscreen:!0},render:e=>(0,A.jsx)(k,{args:e,title:`Fullscreen`,description:`Use the “Open in new canvas” button at the top right of the screen for a better preview.`})},V={args:{data:D.slice(0,1),total:1,enableFullscreen:!0,enableColumnOrdering:!0},render:e=>(0,A.jsx)(k,{args:e,title:`Less than 10 results`})},H={args:{data:D.slice(0,1),total:1,TableFilters:()=>(0,A.jsx)(u,{loading:!1,setSearchCriteria:()=>{}}),enableFullscreen:!0,enableColumnOrdering:!0,tableIndexResultPosition:`bottom`},render:e=>(0,A.jsx)(k,{args:e,title:`Filters + less than 10 results`})},U={args:{pagination:{type:`hidden`}},render:e=>(0,A.jsx)(k,{args:e,title:`Pagination hidden`})},W={args:{pagination:{type:`locale`,state:{pageIndex:0,pageSize:5}}},render:e=>(0,A.jsx)(k,{args:e,title:`Pagination locale`})},G={args:{data:D.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[j.accessor(`firstName`,{id:`firstName`,cell:e=>e.getValue(),header:()=>(0,A.jsx)(`span`,{children:`First Name`})}),j.accessor(e=>e.lastName,{id:`lastName`,cell:e=>(0,A.jsx)(`i`,{children:e.getValue()}),header:()=>(0,A.jsx)(`span`,{children:`Last Name`})}),j.accessor(`age`,{id:`age`,header:()=>`Age`,cell:e=>e.renderValue(),aggregatedCell:({getValue:e})=>(0,A.jsx)(A.Fragment,{children:`[${e()[0]}-${e()[1]}]`}),aggregationFn:`extent`,enableGrouping:!0}),j.accessor(`visits`,{id:`visits`,header:()=>(0,A.jsx)(`span`,{children:`Visits`}),aggregationFn:`sum`}),j.accessor(`status`,{id:`status`,header:`Status`,getGroupingValue:e=>`Group By ${e.status}`,enableGrouping:!0}),j.accessor(`progress`,{id:`progress`,header:`Profile Progress`,cell:({getValue:e})=>`${Math.round(e()*100)/100}%`,aggregationFn:`mean`,aggregatedCell:({getValue:e})=>`~${Math.round(e()*100)/100}%`})]},render:e=>(0,A.jsx)(k,{args:e,title:`Group by`,description:`You can group by status.`})},K={args:{columns:[j.accessor(`firstName`,{cell:e=>e.getValue(),header:()=>(0,A.jsx)(`span`,{children:`First Name`}),footer:()=>(0,A.jsx)(`span`,{children:`First Name`})}),j.accessor(e=>e.lastName,{id:`lastName`,cell:e=>(0,A.jsx)(`i`,{children:e.getValue()}),header:()=>(0,A.jsx)(`span`,{children:`Last Name`}),footer:()=>(0,A.jsx)(`span`,{children:`Last Name`})}),j.accessor(`age`,{header:()=>`Age`,cell:e=>e.renderValue(),footer:()=>(0,A.jsx)(`span`,{children:`Age`})}),j.accessor(`visits`,{header:()=>(0,A.jsx)(`span`,{children:`Visits`}),footer:()=>(0,A.jsx)(`span`,{children:`First Name`})}),j.accessor(`status`,{header:`Status`,footer:()=>(0,A.jsx)(`span`,{children:`Status`})}),j.accessor(`progress`,{header:`Profile Progress`,footer:()=>(0,A.jsx)(`span`,{children:`Profile Progress`})})]},render:e=>(0,A.jsx)(k,{args:e,title:`Footer`})},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: true,
      total: true
    }
  },
  render: args => <DataTableStory args={args} title="Loading" />
}`,...P.parameters?.docs?.source}}},F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  args: {
    data: [...data].sort((a, b) => b.age - a.age).slice(0, 10),
    serverOptions: {
      defaultSorting: [{
        field: 'age',
        order: SortBodyOrderEnum.Desc
      }],
      onSortingChange: () => {}
    }
  },
  render: args => <DataTableStory args={args} title="Default sorting" description="The sort icon shows on the default-sorted column on load, and comes back when another column's sort is cleared." />
}`,...F.parameters?.docs?.source}}},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data: []
  },
  render: args => <DataTableStory args={args} title="Empty" />
}`,...I.parameters?.docs?.source}}},L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data: [],
    emptyState: <EmptyState title="Custom empty state" description="Replaces the default empty state" iconType="custom" icon={SearchIcon} size="mini">
        <Button size="sm" variant="outline">
          Action
        </Button>
      </EmptyState>
  },
  render: args => <DataTableStory args={args} title="Custom empty state" />
}`,...L.parameters?.docs?.source}}},R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data: [],
    hasError: true
  },
  render: args => <DataTableStory args={args} title="Error" />
}`,...R.parameters?.docs?.source}}},z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true
  },
  render: args => <DataTableStory args={args} title="Default" />
}`,...z.parameters?.docs?.source}}},B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  args: {
    enableFullscreen: true
  },
  render: args => <DataTableStory args={args} title="Fullscreen" description="Use the “Open in new canvas” button at the top right of the screen for a better preview." />
}`,...B.parameters?.docs?.source}}},V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 1),
    total: 1,
    enableFullscreen: true,
    enableColumnOrdering: true
  },
  render: args => <DataTableStory args={args} title="Less than 10 results" />
}`,...V.parameters?.docs?.source}}},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 1),
    total: 1,
    TableFilters: () => <TableFilters loading={false} setSearchCriteria={() => {}} />,
    enableFullscreen: true,
    enableColumnOrdering: true,
    tableIndexResultPosition: 'bottom'
  },
  render: args => <DataTableStory args={args} title="Filters + less than 10 results" />
}`,...H.parameters?.docs?.source}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  args: {
    pagination: {
      type: 'hidden'
    }
  },
  render: args => <DataTableStory args={args} title="Pagination hidden" />
}`,...U.parameters?.docs?.source}}},W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
}`,...W.parameters?.docs?.source}}},G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
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
}`,...G.parameters?.docs?.source}}},K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
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
}`,...K.parameters?.docs?.source}}},q=[`Loading`,`DefaultSorting`,`Empty`,`CustomEmptyState`,`Error`,`Default`,`Fullscreen`,`LessThan10Results`,`DataTableFiltersAndLessThan10Results`,`PaginationHidden`,`PaginationLocale`,`GroupBy`,`Footer`]})))()}J();export{L as CustomEmptyState,H as DataTableFiltersAndLessThan10Results,z as Default,F as DefaultSorting,I as Empty,R as Error,K as Footer,B as Fullscreen,G as GroupBy,V as LessThan10Results,P as Loading,U as PaginationHidden,W as PaginationLocale,q as __namedExportsOrder,N as default};