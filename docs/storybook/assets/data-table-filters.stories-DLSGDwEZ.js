import{j as t}from"./iframe-Ba5Iybcr.js";import{h as o}from"./index-BCplTPHn.js";import{a as c}from"./api-C40SyScH.js";import{F as n}from"./case-exploration-table-filters-DcMAYX0D.js";import{k as l,X as d,c as g}from"./data-table-DSKkUxoc.js";import{C as u,A as a}from"./applications-config-Dr5Y5jyF.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-CTBzXNmi.js";import{a as p}from"./story-section-5UYrVqPJ.js";import{i as m}from"./table-mock-Cn0-sgZN.js";import{B as F}from"./chunk-QUQL4437-D51zFiot.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CSFIdw_x.js";import"./i18n-Cy0oM3Ki.js";import"./index-FDvGsyLv.js";import"./filter-button-CYILnbvU.js";import"./checkbox-filter-CqU65Uo7.js";import"./checkbox-vH5nwXQs.js";import"./index-DmuAEkKK.js";import"./check-C9wVWpMx.js";import"./label-B7UtrO04.js";import"./number-format-25wf_bNo.js";import"./badge-DOdy_6wT.js";import"./separator-D1idYbj8.js";import"./x-_znAeN6V.js";import"./button-Pc7aOWRa.js";import"./action-button-BrZzZe-c.js";import"./dropdown-menu-58R_cXZJ.js";import"./index-DB383bCH.js";import"./index-E7Q1ks-D.js";import"./circle-DwJaPj0_.js";import"./command-BI8kmwIu.js";import"./dialog-9KLRuuyd.js";import"./popover-v89jKE_n.js";import"./search-CxyLer3V.js";import"./skeleton-Bcw6SOMK.js";import"./test-tube-diagonal-CaFTq-RG.js";import"./user-Bib9xX0J.js";import"./priority-indicator-D_Q3oO9C.js";import"./indicator-CF70os-o.js";import"./shape-triangle-up-icon-Ber_RhJB.js";import"./refresh-ccw-DKdqsdrW.js";import"./pen-BVfIJwxc.js";import"./use-tenant-WZX5s9Of.js";import"./api-CWZDGZT1.js";import"./403-CedN9Usd.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-reRDKzjJ.js";import"./main-navbar-lang-switcher-CldiV7B3.js";import"./grip-vertical-BK3ile5S.js";import"./settings-0QZ6SD0U.js";import"./arrow-down-vkSAuIip.js";import"./card-DPZTiAav.js";import"./pagination-A0cGOVPz.js";import"./select-BdvgWz9Z.js";import"./chevron-down-CBgMnpwl.js";import"./chevron-up-ykTz0sMK.js";import"./ellipsis-CApEMYs6.js";import"./empty-BgL89Whh.js";import"./chevron-right-BLkB0_iY.js";import"./empty-cell-BkPgIXMP.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Pe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
