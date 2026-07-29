import{j as t}from"./iframe-BCdw1Zpv.js";import{h as o}from"./index-DBNMvnS4.js";import{a as c}from"./api-LxSE38Xs.js";import{F as n}from"./case-exploration-table-filters-DwHUeDQ3.js";import{k as l,X as d,c as g}from"./data-table-4TJawKib.js";import{C as u,A as a}from"./applications-config-Bkpf8T2V.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-CFKRVzzA.js";import{a as p}from"./story-section-DgtXw29J.js";import{i as m}from"./table-mock-DyaNtozD.js";import{B as F}from"./chunk-QUQL4437-BYT-TXVN.js";import"./preload-helper-PPVm8Dsz.js";import"./index-FltF3-ml.js";import"./i18n-BerkWO00.js";import"./index-mpFtsMNW.js";import"./filter-button-I6zXX6lW.js";import"./checkbox-filter-uqrcmAwQ.js";import"./checkbox-DMX3BjE_.js";import"./index-NqJJUEGy.js";import"./check-DAngudb0.js";import"./label-l8FzOQVN.js";import"./number-format-CspzGEtb.js";import"./badge-BhM3_JBV.js";import"./separator-CxLC1eka.js";import"./x-DwSUWTV9.js";import"./button-CCDrrqA6.js";import"./action-button-C_F8twkk.js";import"./dropdown-menu-HBuGdxYI.js";import"./index-BS8cZKMG.js";import"./index-COD-M8Go.js";import"./circle-DY_U8LIw.js";import"./command-X8YkT2zv.js";import"./dialog-BKVQKwDn.js";import"./popover-C-rOVDDe.js";import"./search-6AjRlL70.js";import"./skeleton-BC0oTTyA.js";import"./test-tube-diagonal-PN4EY7_t.js";import"./user-ycd2evT1.js";import"./priority-indicator-CCffDR1B.js";import"./indicator-CnnC2DIy.js";import"./shape-triangle-up-icon-mf8JsMdq.js";import"./refresh-ccw--ecAft-O.js";import"./pen-CofiU8dO.js";import"./use-tenant-D8ccltDD.js";import"./api-CwOGLQEC.js";import"./403-BpbSm9dO.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-BaR1FEqz.js";import"./main-navbar-lang-switcher-DZu3K9fR.js";import"./grip-vertical-B1WuA7ju.js";import"./settings-3QPqFavc.js";import"./arrow-down-CTMzjIj4.js";import"./card-BvCES59z.js";import"./pagination-BRpmQ0sy.js";import"./select-BGD2GkyP.js";import"./chevron-down-BuDp3DNA.js";import"./chevron-up-C32KL_Uh.js";import"./ellipsis-DPbm2pJv.js";import"./empty-BncHzLht.js";import"./chevron-right-CSMwTD_R.js";import"./empty-cell-BgpmDp8f.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Pe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
