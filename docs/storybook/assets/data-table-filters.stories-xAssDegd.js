import{j as t}from"./iframe-C6MOWQMA.js";import{h as o}from"./index-D1EkXOif.js";import{a as c}from"./api-D36EIwoJ.js";import{F as n}from"./case-exploration-table-filters-C6ME5n0C.js";import{k as l,X as d,c as g}from"./data-table-BdEhpcqM.js";import{C as u,A as a}from"./applications-config-C8uqiM5P.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-BtxeYte9.js";import{a as p}from"./story-section-_wEsjD86.js";import{i as m}from"./table-mock-BbNeP0JF.js";import{B as F}from"./chunk-QUQL4437-BVXGlzM1.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Ba4bosxv.js";import"./i18n-CnXb1qax.js";import"./index-DP9hQ_sa.js";import"./filter-button-DWbog2PR.js";import"./checkbox-filter-BhuRpYLo.js";import"./checkbox-B6AIHIBP.js";import"./index-DWzx1LIm.js";import"./check-BS5Edn5_.js";import"./label-QQ_bs6T_.js";import"./number-format-EC3-zezy.js";import"./badge-B78r8HM9.js";import"./separator-ChOm_zYy.js";import"./x-CsidU9Vl.js";import"./button-D9gCVoS4.js";import"./action-button-CZKHrL7b.js";import"./dropdown-menu-DhbUdTSy.js";import"./index-B2qiHt1l.js";import"./index-BrSS3xdM.js";import"./circle-C3Ir_esd.js";import"./command-sW4sbvEM.js";import"./dialog-B3Fofjtq.js";import"./popover-B1mDzErw.js";import"./search-DIfaHVxs.js";import"./skeleton-CruioE2S.js";import"./test-tube-diagonal-zvifPKmh.js";import"./user-AJyL3ytM.js";import"./priority-indicator-XfOE3UXi.js";import"./indicator-BNF2LM2a.js";import"./shape-triangle-up-icon-BKu57a1y.js";import"./refresh-ccw-BrWLScPV.js";import"./pen-BkyG11zM.js";import"./use-tenant-BIsIlcOh.js";import"./api-BKer6Fgf.js";import"./403-DL1LiQpn.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-B5jTAEeT.js";import"./main-navbar-lang-switcher-BiAkk-2Y.js";import"./grip-vertical-vZ2dmWcA.js";import"./settings-BXG5xVNk.js";import"./arrow-down-8OVmmVGb.js";import"./card-BrEhw1co.js";import"./pagination-BA6t0Ymy.js";import"./select-batvf-pJ.js";import"./chevron-down-BRYLLc0e.js";import"./chevron-up-CWqOXLFU.js";import"./ellipsis-CSPy2haK.js";import"./empty-C6rxcjP_.js";import"./chevron-right-CfnupuGW.js";import"./empty-cell-Dpd7QnoN.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Pe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
