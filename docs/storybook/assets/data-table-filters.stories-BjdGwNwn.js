import{j as t}from"./iframe-BC4RzbTe.js";import{h as o}from"./index-DSqJTBTz.js";import{a as c}from"./api-C26xm_xg.js";import{F as n}from"./case-exploration-table-filters-yRwYtLBb.js";import{D as l,j as d,c as g}from"./data-table-BDfR6TI_.js";import{C as u,A as a}from"./applications-config-CH_4GAIJ.js";import{c as h,h as f,a as b,b as S,d as x,e as C}from"./api-case-C-j6JlwX.js";import{a as p}from"./story-section-DPrmmWzN.js";import{d as m}from"./table-mock-YQLHc0c1.js";import{B as F}from"./chunk-QUQL4437-TVZeIKqt.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CnFZJuWy.js";import"./i18n-B_9vMIaN.js";import"./index-nJ2VJ9o6.js";import"./filter-button-C10jOoKV.js";import"./checkbox-filter-CgYZUBzq.js";import"./checkbox-6QADwITq.js";import"./index-DErrjSEm.js";import"./check-CdGhgW-U.js";import"./label-IdXerJGz.js";import"./number-format-CXCu04it.js";import"./badge-BNfFzSqn.js";import"./separator-C1ujT8UF.js";import"./x-CE8BJu81.js";import"./button-LUczZP4-.js";import"./action-button-CC0bpEam.js";import"./dropdown-menu-Baq_OXPj.js";import"./index-CbsMyLW-.js";import"./index-D1ZMpyoR.js";import"./circle-Ck_AokSU.js";import"./command-BfraPepx.js";import"./dialog-CFl_3Pne.js";import"./popover-DvqIF_Pg.js";import"./search-C5_iZ188.js";import"./skeleton-B5ieX502.js";import"./test-tube-diagonal-DHBQryNO.js";import"./user-Ca5Ylnaw.js";import"./priority-indicator-CVR2ioIc.js";import"./indicator-CWqQc2iJ.js";import"./shape-triangle-up-icon-CQE-wshs.js";import"./status-badge-CBEh1j9d.js";import"./rotate-ccw-C6jKgZcB.js";import"./use-tenant-CqvrZUVK.js";import"./api-C26LFTI9.js";import"./403-B2iaeOIn.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-L2aTJfGZ.js";import"./main-navbar-lang-switcher-BcKQCTah.js";import"./isEqual-Dw1E7X96.js";import"./grip-vertical-Cas0SwO0.js";import"./settings-B4wGHX5g.js";import"./arrow-down-C1YBlF6d.js";import"./card-C7yc9JdD.js";import"./pagination-BGk3cKFI.js";import"./select-CmABkJuf.js";import"./chevron-down-AFn_zw6L.js";import"./chevron-up-C6Pnwhi7.js";import"./ellipsis-DBwc2z1G.js";import"./empty-C5wkE1DM.js";import"./chevron-right-kN7rqsRx.js";import"./_baseUniq-8w4WH8LD.js";import"./empty-cell-DbOYT73S.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},De={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
