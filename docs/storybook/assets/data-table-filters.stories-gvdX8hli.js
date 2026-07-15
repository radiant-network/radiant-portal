import{j as t}from"./iframe-B5m_r5t1.js";import{h as o}from"./index-BX8vut0h.js";import{a as c}from"./api-DxXkaL5r.js";import{F as n}from"./case-exploration-table-filters-W-kv_1DM.js";import{k as l,X as d,c as g}from"./data-table-C5_x3jwv.js";import{C as u,A as a}from"./applications-config-Dz2YnBWk.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-CtfanlZG.js";import{a as p}from"./story-section-pH31KqSy.js";import{i as m}from"./table-mock-7XS6hi3x.js";import{B as F}from"./chunk-QUQL4437-K3W6dNsk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BPtrRWzB.js";import"./i18n-BHXPh8AP.js";import"./index-5c2p_uqG.js";import"./filter-button-BrD2M0YN.js";import"./checkbox-filter--kSpsPZj.js";import"./checkbox-76TxYc5i.js";import"./index-BP1aJor8.js";import"./check-sbLhD5de.js";import"./label-B10Cb-6A.js";import"./number-format-BlE_ZFLv.js";import"./badge-gOCwvYvX.js";import"./separator-Dk_QM_ol.js";import"./x-B3bKcLJ1.js";import"./button-DqX3TAag.js";import"./action-button-BOac_c5S.js";import"./dropdown-menu-r5w4W6fH.js";import"./index-D-iXBiuO.js";import"./index-BQW_qE22.js";import"./circle-C4wI0UCh.js";import"./command-C35ektKw.js";import"./dialog-Jhth-i6o.js";import"./popover-CxAyEJyA.js";import"./search-DIRYpg1v.js";import"./skeleton-COSmEOST.js";import"./test-tube-diagonal-DNiUPJBa.js";import"./user-W2KBBQtC.js";import"./priority-indicator-BTP6IuZr.js";import"./indicator-CFdKYrIQ.js";import"./shape-triangle-up-icon-Ds6d1zUf.js";import"./refresh-ccw-ChlnLsQH.js";import"./pen-DrqGQqXo.js";import"./use-tenant-D_E7f3mM.js";import"./api-BjHhlcVm.js";import"./grip-vertical-D4CTxCqt.js";import"./settings-AmmIVTE8.js";import"./card-BsUbws6s.js";import"./pagination-CEO-umpn.js";import"./select-_HDkSeXW.js";import"./chevron-down-CKPIwVQc.js";import"./chevron-up-CcjPFDSh.js";import"./ellipsis-DmbcHXF3.js";import"./empty-BxAzRshH.js";import"./chevron-right-BE3WOnwb.js";import"./empty-cell-D6yEf27o.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ve={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const je=["Loading","Default"];export{i as Default,s as Loading,je as __namedExportsOrder,ve as default};
