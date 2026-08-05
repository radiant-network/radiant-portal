import{j as t}from"./iframe-BzMpq4Hc.js";import{h as o}from"./index-Dm7V6hb3.js";import{a as c}from"./api-vC-PrVf7.js";import{F as n}from"./case-exploration-table-filters-CgXBBeBa.js";import{j as l,k as d,c as g}from"./data-table-CRn3vC6j.js";import{C as u,A as a}from"./applications-config-rcqX5GIb.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-CxzK-VqL.js";import{a as p}from"./story-section-DVNANUlR.js";import{h as m}from"./table-mock-CU6FYKfQ.js";import{B as F}from"./chunk-QUQL4437-D-PGPLAV.js";import"./preload-helper-PPVm8Dsz.js";import"./index-oZlYwCv4.js";import"./i18n-DgcYhEYb.js";import"./index-DsnHWkyF.js";import"./filter-button-Cxgn_B6R.js";import"./checkbox-filter-DK5aQVbG.js";import"./checkbox-BoWOZ9fs.js";import"./index-BeQDYjR0.js";import"./check-BBp2wSs8.js";import"./label-CSyXSd-r.js";import"./number-format-DcTtnAdJ.js";import"./badge-Dj1wZvtm.js";import"./separator-BoZNDwc5.js";import"./x-CT18IQ0f.js";import"./button-G_7WvFjb.js";import"./action-button-f97mKVJz.js";import"./dropdown-menu-dmEKL98B.js";import"./index-BG0WSpn-.js";import"./index-Cc45Ah96.js";import"./circle-Cikc3-Oi.js";import"./command-DV4KiiGt.js";import"./dialog-ENQOLaaJ.js";import"./popover-CzuN8fzY.js";import"./search-BxK9DBCk.js";import"./skeleton-liXsRL7_.js";import"./test-tube-diagonal-DOKtguay.js";import"./user-D6vt_au_.js";import"./priority-indicator-sNZAn53y.js";import"./indicator-agFcUQq1.js";import"./shape-triangle-up-icon-C52mOrfh.js";import"./refresh-ccw-o2hB1afi.js";import"./pen-DHm1NQPK.js";import"./use-tenant-D2mTa-W_.js";import"./api-CoLy23bT.js";import"./403-e4xwTdy_.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-CiniFUrW.js";import"./main-navbar-lang-switcher-CcQBAGiE.js";import"./isEqual-BGRuE7nF.js";import"./grip-vertical-Bnw66yX2.js";import"./settings-CsQO6Mba.js";import"./arrow-down-BKWUvn9u.js";import"./card-wl1kvrDv.js";import"./pagination-CPD4MHo2.js";import"./select-CmLkOLtt.js";import"./chevron-down-B8akvHUj.js";import"./chevron-up-jG6DRC2G.js";import"./ellipsis-ijfHwPbJ.js";import"./empty-DMW8tPLE.js";import"./chevron-right-C09pDLix.js";import"./_baseUniq-BUofzM0y.js";import"./empty-cell-DycoYvNT.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},De={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
