import{j as t}from"./iframe-C3lqtK7e.js";import{h as o}from"./index-BmxUvt3T.js";import{a as c}from"./api-BIv-E9PX.js";import{F as n}from"./case-exploration-table-filters-CmipyJBF.js";import{k as l,X as d,c as g}from"./data-table-zqCquuO_.js";import{C as u,A as a}from"./applications-config-C-nASJ9y.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-GK4R5R4R.js";import{a as p}from"./story-section-D0dJtQQI.js";import{i as m}from"./table-mock-DjiJIPYS.js";import{B as F}from"./chunk-QUQL4437-B_Zgs8qF.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CVQi8D0f.js";import"./i18n-C-yF7uB7.js";import"./index-IdUrPHK1.js";import"./filter-button-9j6QMHQI.js";import"./checkbox-filter-BBiKON77.js";import"./checkbox-BpASaXlN.js";import"./index-CbhEa8BS.js";import"./check-BRJQ9cv8.js";import"./label-CZdJaqCy.js";import"./number-format-r8nhHsQO.js";import"./badge-BJlmgBao.js";import"./separator-BKwaqk6V.js";import"./x-561tnh8w.js";import"./button-C8Vp7O6w.js";import"./action-button-CE80NZKJ.js";import"./dropdown-menu-Bpvq-6ng.js";import"./index-CH0eao47.js";import"./index-CAl0gmco.js";import"./circle-CfQ2AHwq.js";import"./command-D9lXeYTG.js";import"./dialog-CPZWJlF7.js";import"./popover-DbCrnPTB.js";import"./search-cRlMhHeB.js";import"./skeleton-CBSxM5zK.js";import"./test-tube-diagonal-DvO2kVZ5.js";import"./user-B4ehE0Gg.js";import"./priority-indicator-CSr1nXm6.js";import"./indicator-CbdN4-qL.js";import"./shape-triangle-up-icon-C6q1vhE_.js";import"./refresh-ccw-GCBemTvz.js";import"./pen-Ke4b0L3N.js";import"./use-tenant-CnX9eyC8.js";import"./api-BgVePoRM.js";import"./403-DrklEced.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-6QTMFxzQ.js";import"./main-navbar-lang-switcher-DwxyejR1.js";import"./grip-vertical-KRsb4Avz.js";import"./settings-CVDQAfjw.js";import"./arrow-down-CPGqFnG1.js";import"./card-CCX_u81E.js";import"./pagination-CwIsP0go.js";import"./select-DqZRxZqq.js";import"./chevron-down-Cl0NCAdN.js";import"./chevron-up-veA74fho.js";import"./ellipsis-DtgqYEaH.js";import"./empty-C9oONBqW.js";import"./chevron-right-DVgiABP5.js";import"./empty-cell-BoChltnQ.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Pe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
