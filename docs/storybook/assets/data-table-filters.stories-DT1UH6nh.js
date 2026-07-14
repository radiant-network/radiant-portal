import{j as t}from"./iframe-Dz8_RTnr.js";import{h as o}from"./index-C_oGDOgw.js";import{a as c}from"./api-DxXkaL5r.js";import{F as n}from"./case-exploration-table-filters-BLU2BRTD.js";import{k as l,X as d,c as g}from"./data-table-D8NGfuct.js";import{C as u,A as a}from"./applications-config-BlM_19rH.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-Dnn8yq2A.js";import{a as p}from"./story-section-D91u7BO8.js";import{i as m}from"./table-mock-C7_8YjvD.js";import{B as F}from"./chunk-QUQL4437-BOWQmQxI.js";import"./preload-helper-PPVm8Dsz.js";import"./index-H0NcAaDM.js";import"./i18n-DET2zMxp.js";import"./index-DvkhtlNS.js";import"./filter-button-CYlgDvFr.js";import"./checkbox-filter-CQFu6Jza.js";import"./checkbox-CYwT1e8k.js";import"./index-7TmCDpfe.js";import"./check-BHMYym5j.js";import"./label-6CE_thim.js";import"./number-format-DJkFAKJF.js";import"./badge-CUeufY1L.js";import"./separator-CwwChQ-7.js";import"./x-Dsdioaxj.js";import"./button-BoQ-FEGa.js";import"./action-button-Dfe_PX_5.js";import"./dropdown-menu-CVXrsCd5.js";import"./index-DJVrsfBV.js";import"./index-DR0W2HG6.js";import"./circle-CTXBJzqY.js";import"./command-B2I-xLg5.js";import"./dialog-BlPs7s80.js";import"./popover-DHywJIdv.js";import"./search-VZqhl12k.js";import"./skeleton-XISvpJaa.js";import"./test-tube-diagonal-DoZitFDh.js";import"./user-C70sy_0w.js";import"./priority-indicator-E_Ny4ocn.js";import"./indicator-DHSkpysa.js";import"./shape-triangle-up-icon-Bp-WR4UY.js";import"./refresh-ccw-DGZJhNxT.js";import"./pen-Do2dbhce.js";import"./use-tenant-BFdHxTVz.js";import"./api-BjHhlcVm.js";import"./grip-vertical-Db1P32Sr.js";import"./settings-Cj_LTQR6.js";import"./card-CQVAmNCe.js";import"./pagination-qiplOhTx.js";import"./select-CcsazgsY.js";import"./chevron-down-C_3HIRje.js";import"./chevron-up-C0gkfDUM.js";import"./ellipsis-BrEyBY3t.js";import"./empty-DQEyOVyS.js";import"./chevron-right-D10LCUJP.js";import"./empty-cell-C82R0BDh.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ve={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
