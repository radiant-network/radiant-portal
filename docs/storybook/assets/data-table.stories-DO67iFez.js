import{j as r}from"./iframe-CfiqPze7.js";import{i as F}from"./api-CNFUPySA.js";import{F as j}from"./case-exploration-table-filters-CwLL7BP1.js";import{X as y,Y as t,m as N,d as b,c as C}from"./table-mock-CTXQEB8f.js";import{C as T,d as P}from"./card-C0gTtj6y.js";import{C as V,A as n}from"./applications-config-Bx7MPM2S.js";import{a as D}from"./story-section-DuGdZxO-.js";import{B as v}from"./chunk-QUQL4437-Yjnghqnv.js";import"./preload-helper-PPVm8Dsz.js";import"./api-D38bPMZm.js";import"./index-iRVpXJFQ.js";import"./filter-button-DW6Yimnn.js";import"./checkbox-filter-B-MEVpw4.js";import"./checkbox-CT7uF9fh.js";import"./index-DKoyCSRK.js";import"./check-Dmg2ouYX.js";import"./label-CBt7DksO.js";import"./index-BZH6fmNO.js";import"./number-format-DX3fNYLr.js";import"./i18n-reUsGHBL.js";import"./badge-wvl-xvPg.js";import"./separator-BFc4bAvf.js";import"./x-GrAZnGbc.js";import"./button-BoXZHvQI.js";import"./action-button-CCiT5Wq2.js";import"./dropdown-menu-DNmiLd3x.js";import"./index-B4wmxKez.js";import"./index-DPFDfypm.js";import"./circle-BQIUCCgT.js";import"./command-TwBurZ0E.js";import"./dialog-P09oXsSD.js";import"./popover-BYAZrS1b.js";import"./search-QkENTqpl.js";import"./skeleton-BuR14rB-.js";import"./test-tube-diagonal-CiO7TsaC.js";import"./user-C5x9aOtw.js";import"./priority-indicator-BTVdyEBL.js";import"./indicator-B9wqiCg6.js";import"./shape-triangle-up-icon-B-mb_gXt.js";import"./refresh-ccw-xqPjVPnd.js";import"./pen-CiTSTYfv.js";import"./empty-cell-DwOhPz73.js";import"./settings-71EeQZBU.js";import"./pagination-DcuwnP76.js";import"./select-BZ8TWqMm.js";import"./chevron-down-CMInQ2Ju.js";import"./chevron-up-E4JaajWk.js";import"./ellipsis--rCYpjyK.js";import"./empty-C3rK9E7Y.js";import"./chevron-right-BJjd_zCk.js";const a=C(),_={variant_entity:{app_id:n.variant_entity},germline_snv_occurrence:{app_id:n.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:n.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:n.admin},portal:{name:"",navigation:{}}},Ve={title:"Features/Data Table",component:b,args:{id:"storybook",columns:N,data:t,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:F.Asc}],onSortingChange:e=>{}},defaultColumnSettings:y,loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>r.jsx(v,{children:r.jsx(V,{config:_,children:r.jsx(e,{})})})]};function s({args:e,title:S,description:x}){return r.jsx(D,{title:S,description:x,children:r.jsx("div",{className:"bg-muted w-full size-auto h-screen overflow-auto p-3",children:r.jsx(T,{className:"h-auto size-max w-full",children:r.jsx(P,{children:r.jsx(b,{...e})})})})})}const o={args:{loadingStates:{list:!0,total:!0}},render:e=>r.jsx(s,{args:e,title:"Loading"})},i={args:{loadingStates:{list:!1,total:!1},data:[]},render:e=>r.jsx(s,{args:e,title:"Empty"})},l={args:{loadingStates:{list:!1,total:!1},data:[],hasError:!0},render:e=>r.jsx(s,{args:e,title:"Error"})},c={args:{data:t.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0},render:e=>r.jsx(s,{args:e,title:"Default"})},d={args:{enableFullscreen:!0},render:e=>r.jsx(s,{args:e,title:"Fullscreen",description:"Use the “Open in new canvas” button at the top right of the screen for a better preview."})},p={args:{data:t.slice(0,1),total:1,enableFullscreen:!0,enableColumnOrdering:!0},render:e=>r.jsx(s,{args:e,title:"Less than 10 results"})},g={args:{data:t.slice(0,1),total:1,TableFilters:()=>r.jsx(j,{loading:!1,setSearchCriteria:()=>{}}),enableFullscreen:!0,enableColumnOrdering:!0,tableIndexResultPosition:"bottom"},render:e=>r.jsx(s,{args:e,title:"Filters + less than 10 results"})},u={args:{pagination:{type:"hidden"}},render:e=>r.jsx(s,{args:e,title:"Pagination hidden"})},m={args:{pagination:{type:"locale",state:{pageIndex:0,pageSize:5}}},render:e=>r.jsx(s,{args:e,title:"Pagination locale"})},f={args:{data:t.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[a.accessor("firstName",{id:"firstName",cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),a.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),a.accessor("age",{id:"age",header:()=>"Age",cell:e=>e.renderValue(),aggregatedCell:({getValue:e})=>r.jsx(r.Fragment,{children:`[${e()[0]}-${e()[1]}]`}),aggregationFn:"extent",enableGrouping:!0}),a.accessor("visits",{id:"visits",header:()=>r.jsx("span",{children:"Visits"}),aggregationFn:"sum"}),a.accessor("status",{id:"status",header:"Status",getGroupingValue:e=>`Group By ${e.status}`,enableGrouping:!0}),a.accessor("progress",{id:"progress",header:"Profile Progress",cell:({getValue:e})=>`${Math.round(e()*100)/100}%`,aggregationFn:"mean",aggregatedCell:({getValue:e})=>`~${Math.round(e()*100)/100}%`})]},render:e=>r.jsx(s,{args:e,title:"Group by",description:"You can group by status."})},h={args:{columns:[a.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"}),footer:()=>r.jsx("span",{children:"First Name"})}),a.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"}),footer:()=>r.jsx("span",{children:"Last Name"})}),a.accessor("age",{header:()=>"Age",cell:e=>e.renderValue(),footer:()=>r.jsx("span",{children:"Age"})}),a.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"}),footer:()=>r.jsx("span",{children:"First Name"})}),a.accessor("status",{header:"Status",footer:()=>r.jsx("span",{children:"Status"})}),a.accessor("progress",{header:"Profile Progress",footer:()=>r.jsx("span",{children:"Profile Progress"})})]},render:e=>r.jsx(s,{args:e,title:"Footer"})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: true,
      total: true
    }
  },
  render: args => <DataTableStory args={args} title="Loading" />
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data: []
  },
  render: args => <DataTableStory args={args} title="Empty" />
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data: [],
    hasError: true
  },
  render: args => <DataTableStory args={args} title="Error" />
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 10),
    enableFullscreen: true,
    enableColumnOrdering: true
  },
  render: args => <DataTableStory args={args} title="Default" />
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    enableFullscreen: true
  },
  render: args => <DataTableStory args={args} title="Fullscreen" description="Use the “Open in new canvas” button at the top right of the screen for a better preview." />
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 1),
    total: 1,
    enableFullscreen: true,
    enableColumnOrdering: true
  },
  render: args => <DataTableStory args={args} title="Less than 10 results" />
}`,...p.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 1),
    total: 1,
    TableFilters: () => <TableFilters loading={false} setSearchCriteria={() => {}} />,
    enableFullscreen: true,
    enableColumnOrdering: true,
    tableIndexResultPosition: 'bottom'
  },
  render: args => <DataTableStory args={args} title="Filters + less than 10 results" />
}`,...g.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    pagination: {
      type: 'hidden'
    }
  },
  render: args => <DataTableStory args={args} title="Pagination hidden" />
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}};const De=["Loading","Empty","Error","Default","Fullscreen","LessThan10Results","DataTableFiltersAndLessThan10Results","PaginationHidden","PaginationLocale","GroupBy","Footer"];export{g as DataTableFiltersAndLessThan10Results,c as Default,i as Empty,l as Error,h as Footer,d as Fullscreen,f as GroupBy,p as LessThan10Results,o as Loading,u as PaginationHidden,m as PaginationLocale,De as __namedExportsOrder,Ve as default};
