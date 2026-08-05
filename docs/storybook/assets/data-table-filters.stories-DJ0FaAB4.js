import{j as t}from"./iframe-DDMqSXul.js";import{h as o}from"./index-DEuhYeM3.js";import{a as c}from"./api-BfM8e3Pz.js";import{F as n}from"./case-exploration-table-filters-7pIRoNVv.js";import{j as l,k as d,c as g}from"./data-table-C_I-5rgf.js";import{C as u,A as a}from"./applications-config-B1eYkv48.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-9TvO83IA.js";import{a as p}from"./story-section-29Pt7KkT.js";import{h as m}from"./table-mock-CAWj4rRj.js";import{B as F}from"./chunk-QUQL4437-DcErLfhO.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CNpPUBIV.js";import"./i18n-C88g_mn6.js";import"./index-Ch5te5Xr.js";import"./filter-button-B72a3zFN.js";import"./checkbox-filter-BiKxwyNN.js";import"./checkbox-CkndReWd.js";import"./index-DnBA83kq.js";import"./check-Dl2pt11_.js";import"./label-Dz3Q6mWi.js";import"./number-format-CCXTwo6m.js";import"./badge-Cyqq1gQt.js";import"./separator-Cc_T2enW.js";import"./x-nQNHfXDX.js";import"./button-C-NfkkWm.js";import"./action-button-WewT5ZPN.js";import"./dropdown-menu-DIoiAg_I.js";import"./index-BwmN7QES.js";import"./index-BwIDj-Vk.js";import"./circle-CRiw5vp4.js";import"./command-bkOiyAtZ.js";import"./dialog-DVjYiVtc.js";import"./popover-Bo7l4s79.js";import"./search-D-KC_9H5.js";import"./skeleton-A3CPn29A.js";import"./test-tube-diagonal-Cdz31orp.js";import"./user-djJBTxBq.js";import"./priority-indicator-CGQdH1Y5.js";import"./indicator-DeFY6cgK.js";import"./shape-triangle-up-icon-DBVzRDP1.js";import"./refresh-ccw-DHHGEOkV.js";import"./pen-I1a55QIa.js";import"./use-tenant-C4l0ESIZ.js";import"./api-UqouLJ-_.js";import"./403-CHk4pSFa.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-CxL2kY3o.js";import"./main-navbar-lang-switcher-CgOjp1XZ.js";import"./isEqual-C_YVBVA2.js";import"./grip-vertical-BwuNdNtw.js";import"./settings-BAY1q9qi.js";import"./arrow-down-BKV-ORLv.js";import"./card-BG5e7YNP.js";import"./pagination-BU3HxK6m.js";import"./select-ClU_116e.js";import"./chevron-down-DbzF3TOo.js";import"./chevron-up-CPJ4Ailv.js";import"./ellipsis-Wj91kEsi.js";import"./empty-w5t4fiMK.js";import"./chevron-right-JXstpTlK.js";import"./_baseUniq-BHW2OfBe.js";import"./empty-cell-Fiy2V04S.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},De={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
