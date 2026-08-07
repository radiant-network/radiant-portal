import{j as t}from"./iframe-DiGfbfp3.js";import{h as o}from"./index-3-hNE-RT.js";import{a as c}from"./api-43ChDoPP.js";import{F as n}from"./case-exploration-table-filters-CFBINw4h.js";import{j as l,k as d,c as g}from"./data-table-DYdD8lIh.js";import{C as u,A as a}from"./applications-config-3zgw8Mk1.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case--qhtsAgS.js";import{a as p}from"./story-section-DME95Whn.js";import{h as m}from"./table-mock-BnnBvY6J.js";import{B as F}from"./chunk-QUQL4437-Deci752E.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CmFihODA.js";import"./i18n-uvvEETAD.js";import"./index-Cn_qWDha.js";import"./filter-button-g1UBPmlU.js";import"./checkbox-filter-DO-WT9u-.js";import"./checkbox-C8NM_MjZ.js";import"./index-U5GxrvjR.js";import"./check-IkDt6mIM.js";import"./label-CtMxYPGJ.js";import"./number-format-CIqC7-U3.js";import"./badge-CTuyL4eW.js";import"./separator-Dj9939qF.js";import"./x-J1a-oCAV.js";import"./button-Bo0DQutg.js";import"./action-button-De4ur-7I.js";import"./dropdown-menu-CNdkncgA.js";import"./index-D8Osr2Vx.js";import"./index-BZGt5Ho_.js";import"./circle-BTr0m0BF.js";import"./command-BtZwaeaK.js";import"./dialog-CxCMuna4.js";import"./popover-CYLzFWNX.js";import"./search-D5fh8e5-.js";import"./skeleton-CSZoEeGy.js";import"./test-tube-diagonal-BO48jsTg.js";import"./user-CV5r7bOK.js";import"./priority-indicator-BI6ce0TP.js";import"./indicator-BKPziv4H.js";import"./shape-triangle-up-icon-Dzw-M2Gx.js";import"./refresh-ccw-DWX4bUA_.js";import"./pen-CsThAqHV.js";import"./use-tenant-CibSZkCI.js";import"./api-3AJ9fHfo.js";import"./403-EYJulvnc.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-Dl_2Bzuf.js";import"./main-navbar-lang-switcher-PvotzuLX.js";import"./isEqual-Bm9lDmy_.js";import"./grip-vertical-BKHBFke0.js";import"./settings-HVyRBUWF.js";import"./arrow-down-C4aRpq4y.js";import"./card-CQA_Fkis.js";import"./pagination-wdVqM3xD.js";import"./select-ClH4xsq2.js";import"./chevron-down-CoYX_ZbH.js";import"./chevron-up-D-cHkvN5.js";import"./ellipsis-4PmcMr5u.js";import"./empty-DJe4oXs4.js";import"./chevron-right-EH5J6fxE.js";import"./_baseUniq-C7FUlYN0.js";import"./empty-cell-KMFILKND.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},De={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
