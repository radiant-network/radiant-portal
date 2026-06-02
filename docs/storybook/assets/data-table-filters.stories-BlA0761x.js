import{j as t}from"./iframe-X1FdiBKE.js";import{h as o}from"./index-DnTwByf3.js";import{i as m}from"./api-CNFUPySA.js";import{F as l}from"./case-exploration-table-filters-2d8ce0sV.js";import{Z as p,d as n,X as c,c as d}from"./table-mock-CdEpFWmZ.js";import{C as g,A as a}from"./applications-config-1HIrnDDl.js";import{b as u,d as h,e as b,f,g as S,i as C}from"./api-case-BMt88mZ_.js";import{B as x}from"./chunk-QUQL4437-BfEK6Nzn.js";import"./preload-helper-PPVm8Dsz.js";import"./api-DxzlR9wx.js";import"./index-BoMd93ow.js";import"./filter-button-BpwzOayZ.js";import"./checkbox-filter-DSFXXszS.js";import"./checkbox-DHqhLv6e.js";import"./index-BjLlGfE7.js";import"./check-CpvZoXR-.js";import"./label-ATUx-zoR.js";import"./index-BerhZw8G.js";import"./number-format-BYqEMlb4.js";import"./i18n-DsLlobA0.js";import"./badge-B50hIUkw.js";import"./separator-BcF0hBxw.js";import"./x-CT6RiXhO.js";import"./button-C1dmQasv.js";import"./action-button-D2HkTc1A.js";import"./dropdown-menu-B8dOc9pX.js";import"./index-DnCxSPBU.js";import"./index-DfO9iG95.js";import"./circle-C0x1jrVb.js";import"./command-ChuZoNNZ.js";import"./dialog-h83xAsXy.js";import"./popover-DItXSvlx.js";import"./search-CrDJxrOj.js";import"./skeleton-UMhyrLm4.js";import"./test-tube-diagonal-BHWbQCV7.js";import"./user-RwGclDvQ.js";import"./priority-indicator-Dytenf-Q.js";import"./indicator-3BGP2TW_.js";import"./shape-triangle-up-icon-BGO3sI6b.js";import"./refresh-ccw-CDHx4Pjq.js";import"./pen-DQhXGoQd.js";import"./empty-cell-DAHU-YIA.js";import"./settings-CScvYx19.js";import"./card-CCNNB3a7.js";import"./pagination-CkUgD19v.js";import"./select-Hfj1BJ4_.js";import"./chevron-down-_LLWsBcL.js";import"./chevron-up-DKo4zVKH.js";import"./ellipsis-DMXZu9Bl.js";import"./empty-I6YlgEOm.js";import"./chevron-right-BzPqLc4n.js";const r=d(),F={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ce={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:m.Asc}],onSortingChange:e=>{}},defaultColumnSettings:c([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(x,{children:t.jsx(g,{config:F,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(l,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(u,h),o.post(b,f),o.get(S,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(l,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    loadingStates: {
      list: true,
      total: true
    },
    enableColumnOrdering: false,
    enableFullscreen: true,
    tableIndexResultPosition: 'hidden',
    TableFilters: <TableFilters loading={true} setSearchCriteria={() => {}} />
  },
  render: args => <DataTable {...args} />
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  parameters: {
    msw: {
      handlers: [http.post(caseSearchApi, httpCaseSearchApiResponse), http.post(caseFiltersApi, httpCaseFiltersApiResponse), http.get(caseAutocompleteApi, httpCaseAutocompleteResponse)]
    }
  },
  args: {
    loadingStates: {
      list: false,
      total: false
    },
    data,
    enableColumnOrdering: false,
    enableFullscreen: true,
    tableIndexResultPosition: 'hidden',
    TableFilters: <TableFilters loading={false} setSearchCriteria={() => {}} />
  },
  render: args => <DataTable {...args} />
}`,...i.parameters?.docs?.source}}};const xe=["Loading","Default"];export{i as Default,s as Loading,xe as __namedExportsOrder,Ce as default};
