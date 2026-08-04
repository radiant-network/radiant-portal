import{j as t}from"./iframe-C1PXzlQr.js";import{h as o}from"./index-DZjg1TSV.js";import{a as c}from"./api-DmeYhNec.js";import{F as n}from"./case-exploration-table-filters-B3Y_ahAS.js";import{j as l,k as d,c as g}from"./data-table-BjVSeCTw.js";import{C as u,A as a}from"./applications-config-C9JK8qgY.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-DViyjr3J.js";import{a as p}from"./story-section-DU0BBdYN.js";import{h as m}from"./table-mock-Dg8cFLct.js";import{B as F}from"./chunk-QUQL4437-CC8OhIAa.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CPCGe-J3.js";import"./i18n-DyD82Oox.js";import"./index-CFbB05VZ.js";import"./filter-button-Cv4G0sAz.js";import"./checkbox-filter-DExcg3nW.js";import"./checkbox-Dtjn0jYO.js";import"./index-DGMQ7ab9.js";import"./check-BkiSwNoP.js";import"./label-BmHZ1dl2.js";import"./number-format-DejVNmR6.js";import"./badge-i53o9UYt.js";import"./separator-Crx5b7zS.js";import"./x-DrrIs9A1.js";import"./button-D_iE8cRH.js";import"./action-button-DcJ-KAIJ.js";import"./dropdown-menu-C9oF-YYO.js";import"./index-7dqFgjTR.js";import"./index-Dr-u9fEo.js";import"./circle-BFYtYw3N.js";import"./command-Ddik57rW.js";import"./dialog-B_x3Ol73.js";import"./popover-jheXUdeV.js";import"./search-Ch-Gcx9v.js";import"./skeleton-BQGjVSS1.js";import"./test-tube-diagonal-B65t2vUn.js";import"./user-CoWXXUyi.js";import"./priority-indicator-DEhuOle1.js";import"./indicator-BTSPiVNJ.js";import"./shape-triangle-up-icon-DBnK8dkg.js";import"./refresh-ccw-VrN79NFr.js";import"./pen-cBwH2H8Z.js";import"./use-tenant-D8azKnqJ.js";import"./api-D8acGGK4.js";import"./403-BdAStAuy.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-Bk-ZlSN3.js";import"./main-navbar-lang-switcher-DiX6UWOM.js";import"./isEqual-DaPEjDm6.js";import"./grip-vertical-BdHGbOgx.js";import"./settings-BgJEB54p.js";import"./arrow-down-CBf5v93j.js";import"./card-B-V8boT4.js";import"./pagination-Dbx77XF8.js";import"./select-B1_T-y24.js";import"./chevron-down-CCZ6xxZo.js";import"./chevron-up-CGf5ozpm.js";import"./ellipsis-CzcjYPKR.js";import"./empty-BfRYYi4v.js";import"./chevron-right-9AOV73l1.js";import"./_baseUniq-CY1FLAgg.js";import"./empty-cell-DX6aA5zo.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},De={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const Oe=["Loading","Default"];export{s as Default,i as Loading,Oe as __namedExportsOrder,De as default};
