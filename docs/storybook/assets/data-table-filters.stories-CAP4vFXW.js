import{j as t}from"./iframe-Db3o0LSj.js";import{h as o}from"./index-jvyZU23r.js";import{a as c}from"./api-DxXkaL5r.js";import{F as n}from"./case-exploration-table-filters-sIBPdY4T.js";import{k as l,X as d,c as g}from"./data-table-CMW2kLq2.js";import{C as u,A as a}from"./applications-config-yWal7jqS.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-nlF1bGvE.js";import{a as p}from"./story-section-Fx7Lxy_f.js";import{i as m}from"./table-mock-1P7ilsR5.js";import{B as F}from"./chunk-QUQL4437-B0jLa5Sb.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BAjxIrlq.js";import"./i18n-GmxgkmV0.js";import"./index-Bik4dCkf.js";import"./filter-button-CNjYufgG.js";import"./checkbox-filter-cgRxHyvn.js";import"./checkbox-Cifj4ju-.js";import"./index-D9JxMnWj.js";import"./check-Lhm-1YCq.js";import"./label-H8u0zyu0.js";import"./number-format-Q13xheXO.js";import"./badge-hyZWCyru.js";import"./separator-BlWkC-It.js";import"./x-7deDFknf.js";import"./button-DnRKu5DY.js";import"./action-button-DxWVTeY0.js";import"./dropdown-menu-BCBXWB-L.js";import"./index-U9TelM_w.js";import"./index-COcKmsT0.js";import"./circle-Cd5P2_hB.js";import"./command-2QiOLxjF.js";import"./dialog-BC3nig8f.js";import"./popover-bK8khcvk.js";import"./search-BbqhEECD.js";import"./skeleton-D8FzGnhh.js";import"./test-tube-diagonal-BJJCr4VC.js";import"./user-DQ38cO6g.js";import"./priority-indicator-C4OUDc2W.js";import"./indicator-BsYppUY-.js";import"./shape-triangle-up-icon-DVimyTPt.js";import"./refresh-ccw-CpdjLLRX.js";import"./pen-D_CIJENR.js";import"./use-tenant-Drdmbs9d.js";import"./api-BjHhlcVm.js";import"./grip-vertical-BrEQVLcf.js";import"./settings-CEP0agpk.js";import"./card-uA_ra_sv.js";import"./pagination-ClTvflBF.js";import"./select-DGMUbIjD.js";import"./chevron-down-G1cYZsX_.js";import"./chevron-up-BJ-Q3tJi.js";import"./ellipsis-DBHavbXw.js";import"./empty-C82FBLMC.js";import"./chevron-right-Bubm_Zby.js";import"./empty-cell-8b9ZTivT.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ve={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
