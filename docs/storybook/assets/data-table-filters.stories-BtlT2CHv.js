import{j as t}from"./iframe-BlZH41kV.js";import{h as o}from"./index-Cp_2wG8W.js";import{i as c}from"./api-C5s-SBNp.js";import{F as n}from"./case-exploration-table-filters-xRDV_rW_.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-COZ0TAnr.js";import{C as u,A as a}from"./applications-config-DaJ9d0xW.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-BL0fAU7x.js";import{a as m}from"./story-section-B_UFTDX5.js";import{B as F}from"./chunk-QUQL4437-D32aNXP8.js";import"./preload-helper-PPVm8Dsz.js";import"./api-BqlfMO08.js";import"./index-C23weHmj.js";import"./filter-button-CcbaLrrM.js";import"./checkbox-filter-l0itEEkJ.js";import"./checkbox-rmkbDpR4.js";import"./index-B8DLH7Ly.js";import"./check-D4JmoqeB.js";import"./label-DhLG2huY.js";import"./index-DwsKsEj-.js";import"./number-format-BL_EvRB7.js";import"./i18n-CwekqNtM.js";import"./badge-CCN80cf0.js";import"./separator-D9vn1ACq.js";import"./x-BL4BZFhT.js";import"./button-CqF4mGFC.js";import"./action-button-Cf_N4wCi.js";import"./dropdown-menu-DY3d4vy_.js";import"./index-Dbpq7NXz.js";import"./index-D1tyQsCC.js";import"./circle-C5iPYBJL.js";import"./command-XkhkjwWv.js";import"./dialog-JwFJ8pvc.js";import"./popover-B4_Qcqg0.js";import"./search-C1QKPUnG.js";import"./skeleton-CkIhl-Ul.js";import"./test-tube-diagonal-CwYzftGv.js";import"./user-CFZgvnJZ.js";import"./priority-indicator-CXq3GB3p.js";import"./indicator-E52kSZOh.js";import"./shape-triangle-up-icon-Dyeo49W1.js";import"./refresh-ccw-CjDyKg8G.js";import"./pen-h_kHi6DX.js";import"./empty-cell-noez1kKL.js";import"./settings-C9oLpYM5.js";import"./card-BapZCbhp.js";import"./pagination-CjyCERmz.js";import"./select-BpSXKC6n.js";import"./chevron-down-BP-8meoI.js";import"./chevron-up-Djgfs_-A.js";import"./ellipsis-DQnWYDoL.js";import"./empty-AyWGxJNf.js";import"./chevron-right-EmgDfj3S.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Fe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const _e=["Loading","Default"];export{i as Default,s as Loading,_e as __namedExportsOrder,Fe as default};
