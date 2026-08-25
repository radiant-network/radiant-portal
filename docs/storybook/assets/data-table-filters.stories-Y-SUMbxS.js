import{j as t}from"./iframe-CeWulF4T.js";import{h as o}from"./index-zWKvIigW.js";import{a as c}from"./api-ChpJqhV9.js";import{F as n}from"./case-exploration-table-filters-rutoCkWJ.js";import{D as l,j as d,c as g}from"./data-table-BOV48Q-M.js";import{C as u,A as a}from"./applications-config-BE8xLZLI.js";import{c as h,h as f,a as b,b as S,d as x,e as C}from"./api-case-DeRFSKjG.js";import{a as p}from"./story-section-H6_Fle6z.js";import{d as m}from"./table-mock-CMaTwIoO.js";import{B as F}from"./chunk-QUQL4437-BDdlCdpn.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CXQKkJn0.js";import"./i18n-Cey8cEyU.js";import"./index-Dqf5nBEg.js";import"./filter-button-B2U1lWeG.js";import"./checkbox-filter-CqJ1R7-l.js";import"./checkbox-CI-w0ilu.js";import"./index-BI3vdd7S.js";import"./check-HHIYmnL4.js";import"./label-D1HwKpbR.js";import"./number-format-o06dUT9o.js";import"./badge-Cf9ELFrF.js";import"./separator-CfpQj-nU.js";import"./x-D_1RLYu7.js";import"./button-C683gQgD.js";import"./action-button-fSpfUlMg.js";import"./dropdown-menu-KIY2RxO3.js";import"./index-Derf9KHZ.js";import"./index-R0RQN4yR.js";import"./circle-DXv1Vmv4.js";import"./command-TNjUVSiC.js";import"./dialog-qzysEzfw.js";import"./popover-Bk7RKWY1.js";import"./search-D14NulpE.js";import"./skeleton-CROhWoqt.js";import"./test-tube-diagonal-D-bPPhM5.js";import"./user-JFBAsbsX.js";import"./priority-indicator-CWkYQmdM.js";import"./indicator-B3z76MWc.js";import"./shape-triangle-up-icon-lVyZCkUS.js";import"./refresh-ccw-DphSaK7y.js";import"./pen-CuaxAdxB.js";import"./use-tenant-3LE2_ShP.js";import"./api-GWblJYZ_.js";import"./403-DSGzOC_g.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-CgTKKqMj.js";import"./main-navbar-lang-switcher-CHdPPl3m.js";import"./isEqual-hmc1D9mf.js";import"./grip-vertical-cOAJSS_6.js";import"./settings-DLO_43hu.js";import"./arrow-down-BdGmTlUu.js";import"./card-Braeiz0n.js";import"./pagination-CUU4GxAC.js";import"./select-DV1QP7gJ.js";import"./chevron-down-Pc83nuGJ.js";import"./chevron-up-DtD0oyHz.js";import"./ellipsis-EQkjItzf.js";import"./empty-B-b5BYwY.js";import"./chevron-right-002aMVjp.js";import"./_baseUniq-Y-H9IXfo.js";import"./empty-cell-CtT-rX1i.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},De={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
