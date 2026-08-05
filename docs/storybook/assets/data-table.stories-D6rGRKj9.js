import{j as r}from"./iframe-DDMqSXul.js";import{a as F}from"./api-BfM8e3Pz.js";import{F as j}from"./case-exploration-table-filters-7pIRoNVv.js";import{j as b,c as y}from"./data-table-C_I-5rgf.js";import{C as N,d as C}from"./card-BG5e7YNP.js";import{C as T,A as n}from"./applications-config-B1eYkv48.js";import{a as P}from"./story-section-29Pt7KkT.js";import{f as V,h as t,m as D}from"./table-mock-CAWj4rRj.js";import{B as v}from"./chunk-QUQL4437-DcErLfhO.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CNpPUBIV.js";import"./i18n-C88g_mn6.js";import"./index-Ch5te5Xr.js";import"./filter-button-B72a3zFN.js";import"./checkbox-filter-BiKxwyNN.js";import"./checkbox-CkndReWd.js";import"./index-DnBA83kq.js";import"./check-Dl2pt11_.js";import"./label-Dz3Q6mWi.js";import"./number-format-CCXTwo6m.js";import"./badge-Cyqq1gQt.js";import"./separator-Cc_T2enW.js";import"./x-nQNHfXDX.js";import"./button-C-NfkkWm.js";import"./action-button-WewT5ZPN.js";import"./dropdown-menu-DIoiAg_I.js";import"./index-BwmN7QES.js";import"./index-BwIDj-Vk.js";import"./circle-CRiw5vp4.js";import"./command-bkOiyAtZ.js";import"./dialog-DVjYiVtc.js";import"./popover-Bo7l4s79.js";import"./search-D-KC_9H5.js";import"./skeleton-A3CPn29A.js";import"./test-tube-diagonal-Cdz31orp.js";import"./user-djJBTxBq.js";import"./priority-indicator-CGQdH1Y5.js";import"./indicator-DeFY6cgK.js";import"./shape-triangle-up-icon-DBVzRDP1.js";import"./refresh-ccw-DHHGEOkV.js";import"./pen-I1a55QIa.js";import"./use-tenant-C4l0ESIZ.js";import"./api-UqouLJ-_.js";import"./403-CHk4pSFa.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-CxL2kY3o.js";import"./main-navbar-lang-switcher-CgOjp1XZ.js";import"./isEqual-C_YVBVA2.js";import"./grip-vertical-BwuNdNtw.js";import"./settings-BAY1q9qi.js";import"./arrow-down-BKV-ORLv.js";import"./pagination-BU3HxK6m.js";import"./select-ClU_116e.js";import"./chevron-down-DbzF3TOo.js";import"./chevron-up-CPJ4Ailv.js";import"./ellipsis-Wj91kEsi.js";import"./empty-w5t4fiMK.js";import"./chevron-right-JXstpTlK.js";import"./_baseUniq-BHW2OfBe.js";import"./empty-cell-Fiy2V04S.js";const a=y(),_={variant_entity:{app_id:n.variant_entity},germline_snv_occurrence:{app_id:n.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:n.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:n.admin},portal:{name:"",navigation:{}}},Ae={title:"Features/Data Table",component:b,args:{id:"storybook",columns:D,data:t,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:F.Asc}],onSortingChange:e=>{}},defaultColumnSettings:V,loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>r.jsx(v,{children:r.jsx(T,{config:_,children:r.jsx(e,{})})})]};function s({args:e,title:S,description:x}){return r.jsx(P,{title:S,description:x,children:r.jsx("div",{className:"bg-muted w-full size-auto h-screen overflow-auto p-3",children:r.jsx(N,{className:"h-auto size-max w-full",children:r.jsx(C,{children:r.jsx(b,{...e})})})})})}const o={args:{loadingStates:{list:!0,total:!0}},render:e=>r.jsx(s,{args:e,title:"Loading"})},i={args:{loadingStates:{list:!1,total:!1},data:[]},render:e=>r.jsx(s,{args:e,title:"Empty"})},l={args:{loadingStates:{list:!1,total:!1},data:[],hasError:!0},render:e=>r.jsx(s,{args:e,title:"Error"})},c={args:{data:t.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0},render:e=>r.jsx(s,{args:e,title:"Default"})},p={args:{enableFullscreen:!0},render:e=>r.jsx(s,{args:e,title:"Fullscreen",description:"Use the “Open in new canvas” button at the top right of the screen for a better preview."})},d={args:{data:t.slice(0,1),total:1,enableFullscreen:!0,enableColumnOrdering:!0},render:e=>r.jsx(s,{args:e,title:"Less than 10 results"})},g={args:{data:t.slice(0,1),total:1,TableFilters:()=>r.jsx(j,{loading:!1,setSearchCriteria:()=>{}}),enableFullscreen:!0,enableColumnOrdering:!0,tableIndexResultPosition:"bottom"},render:e=>r.jsx(s,{args:e,title:"Filters + less than 10 results"})},m={args:{pagination:{type:"hidden"}},render:e=>r.jsx(s,{args:e,title:"Pagination hidden"})},u={args:{pagination:{type:"locale",state:{pageIndex:0,pageSize:5}}},render:e=>r.jsx(s,{args:e,title:"Pagination locale"})},f={args:{data:t.slice(0,10),enableFullscreen:!0,enableColumnOrdering:!0,columns:[a.accessor("firstName",{id:"firstName",cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"})}),a.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"})}),a.accessor("age",{id:"age",header:()=>"Age",cell:e=>e.renderValue(),aggregatedCell:({getValue:e})=>r.jsx(r.Fragment,{children:`[${e()[0]}-${e()[1]}]`}),aggregationFn:"extent",enableGrouping:!0}),a.accessor("visits",{id:"visits",header:()=>r.jsx("span",{children:"Visits"}),aggregationFn:"sum"}),a.accessor("status",{id:"status",header:"Status",getGroupingValue:e=>`Group By ${e.status}`,enableGrouping:!0}),a.accessor("progress",{id:"progress",header:"Profile Progress",cell:({getValue:e})=>`${Math.round(e()*100)/100}%`,aggregationFn:"mean",aggregatedCell:({getValue:e})=>`~${Math.round(e()*100)/100}%`})]},render:e=>r.jsx(s,{args:e,title:"Group by",description:"You can group by status."})},h={args:{columns:[a.accessor("firstName",{cell:e=>e.getValue(),header:()=>r.jsx("span",{children:"First Name"}),footer:()=>r.jsx("span",{children:"First Name"})}),a.accessor(e=>e.lastName,{id:"lastName",cell:e=>r.jsx("i",{children:e.getValue()}),header:()=>r.jsx("span",{children:"Last Name"}),footer:()=>r.jsx("span",{children:"Last Name"})}),a.accessor("age",{header:()=>"Age",cell:e=>e.renderValue(),footer:()=>r.jsx("span",{children:"Age"})}),a.accessor("visits",{header:()=>r.jsx("span",{children:"Visits"}),footer:()=>r.jsx("span",{children:"First Name"})}),a.accessor("status",{header:"Status",footer:()=>r.jsx("span",{children:"Status"})}),a.accessor("progress",{header:"Profile Progress",footer:()=>r.jsx("span",{children:"Profile Progress"})})]},render:e=>r.jsx(s,{args:e,title:"Footer"})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    enableFullscreen: true
  },
  render: args => <DataTableStory args={args} title="Fullscreen" description="Use the “Open in new canvas” button at the top right of the screen for a better preview." />
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 1),
    total: 1,
    enableFullscreen: true,
    enableColumnOrdering: true
  },
  render: args => <DataTableStory args={args} title="Less than 10 results" />
}`,...d.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    data: data.slice(0, 1),
    total: 1,
    TableFilters: () => <TableFilters loading={false} setSearchCriteria={() => {}} />,
    enableFullscreen: true,
    enableColumnOrdering: true,
    tableIndexResultPosition: 'bottom'
  },
  render: args => <DataTableStory args={args} title="Filters + less than 10 results" />
}`,...g.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    pagination: {
      type: 'hidden'
    }
  },
  render: args => <DataTableStory args={args} title="Pagination hidden" />
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}};const $e=["Loading","Empty","Error","Default","Fullscreen","LessThan10Results","DataTableFiltersAndLessThan10Results","PaginationHidden","PaginationLocale","GroupBy","Footer"];export{g as DataTableFiltersAndLessThan10Results,c as Default,i as Empty,l as Error,h as Footer,p as Fullscreen,f as GroupBy,d as LessThan10Results,o as Loading,m as PaginationHidden,u as PaginationLocale,$e as __namedExportsOrder,Ae as default};
