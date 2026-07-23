import{j as t}from"./iframe-DUYxWSE4.js";import{h as o}from"./index-BftQByyn.js";import{a as c}from"./api-D36EIwoJ.js";import{F as n}from"./case-exploration-table-filters-D11Mb5EO.js";import{k as l,X as d,c as g}from"./data-table-CPTW3PLH.js";import{C as u,A as a}from"./applications-config-Q6r4cHCd.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-DddQp4Z6.js";import{a as p}from"./story-section-BP93x530.js";import{i as m}from"./table-mock-DEkwVl5a.js";import{B as F}from"./chunk-QUQL4437-B7OJzLlm.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C3HhZF5z.js";import"./i18n-DhdwcvPn.js";import"./index-0l6j4kdI.js";import"./filter-button-DgAIl898.js";import"./checkbox-filter-HTON-P80.js";import"./checkbox-BoDyICsg.js";import"./index-viTvDaxJ.js";import"./check-CXWDQykU.js";import"./label-BLKEaCQs.js";import"./number-format-B33gFSdc.js";import"./badge-DIWCvFL-.js";import"./separator-BLzsWlgt.js";import"./x-CPRp0o__.js";import"./button-BoxscECB.js";import"./action-button-BfqUh_3H.js";import"./dropdown-menu-Dw6dDXhx.js";import"./index-d-V1lAha.js";import"./index-CIzFjBAZ.js";import"./circle-CnzHj9YT.js";import"./command-5F9FdMp0.js";import"./dialog-_BiLt4UJ.js";import"./popover-D9w6bh6M.js";import"./search-Cc5kyO6r.js";import"./skeleton-DZxfzVQv.js";import"./test-tube-diagonal-CwT5mNGO.js";import"./user-BTtjWrUh.js";import"./priority-indicator-CrsQedR9.js";import"./indicator-B1KHN1mc.js";import"./shape-triangle-up-icon-DBhba8qV.js";import"./refresh-ccw-CpsZHLwg.js";import"./pen-C27JG5K9.js";import"./use-tenant-k8UKazYJ.js";import"./api-BKer6Fgf.js";import"./403-BeP5wQyt.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-D2BC-JFJ.js";import"./main-navbar-lang-switcher-BYUG0V5q.js";import"./grip-vertical-Dg5UUSqY.js";import"./settings-Cg7AC6ru.js";import"./arrow-down-Bknwek5C.js";import"./card-f7-9-HA-.js";import"./pagination-DM_TO91W.js";import"./select-CG6Vhant.js";import"./chevron-down-C4IbcMac.js";import"./chevron-up-Bhp_XPqH.js";import"./ellipsis-2bI1zpoe.js";import"./empty-DSq9dsAh.js";import"./chevron-right-6OvOA_tb.js";import"./empty-cell-BqBS0KV5.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Pe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
  render: args => <StorySection title="Loading">
      <DataTable {...args} />
    </StorySection>
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
  render: args => <StorySection title="Default">
      <DataTable {...args} />
    </StorySection>
}`,...s.parameters?.docs?.source}}};const Te=["Loading","Default"];export{s as Default,i as Loading,Te as __namedExportsOrder,Pe as default};
