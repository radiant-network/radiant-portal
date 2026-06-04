import{j as t}from"./iframe-Bmo5s0S7.js";import{h as o}from"./index-tSv9C1wR.js";import{i as c}from"./api-CNFUPySA.js";import{F as n}from"./case-exploration-table-filters-Crd85VnN.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-rC3tLy4u.js";import{C as u,A as a}from"./applications-config-C3v4Kx5f.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-UW57oWAv.js";import{a as m}from"./story-section-DK9Ca-WM.js";import{B as F}from"./chunk-QUQL4437-4eTQW-oi.js";import"./preload-helper-PPVm8Dsz.js";import"./api-DZSw6L4j.js";import"./index-Ral5BcRB.js";import"./filter-button-BENuROu2.js";import"./checkbox-filter-B7Wfsih_.js";import"./checkbox-DRiJfq4E.js";import"./index-CcCn0YIb.js";import"./check-32E8HpGv.js";import"./label-C6nsYxZ0.js";import"./index-fUmLsCzv.js";import"./number-format-bPjj0FVx.js";import"./i18n-Dk7NL_SC.js";import"./badge-Y5rnRIaQ.js";import"./separator-CQaINmcN.js";import"./x-CGJbRyc9.js";import"./button---ZJYA-K.js";import"./action-button-BsC9knCl.js";import"./dropdown-menu-RHvipy6t.js";import"./index-CYQD8SjJ.js";import"./index-D_ub_t65.js";import"./circle-C1aHhR8R.js";import"./command-BVpWSASa.js";import"./dialog-iNmgQAM6.js";import"./popover-sD03Vi3k.js";import"./search-BqR8-Sy9.js";import"./skeleton-BcBjI8oP.js";import"./test-tube-diagonal-Bf1jK0cW.js";import"./user-BpL53lq8.js";import"./priority-indicator-DS1ARjH1.js";import"./indicator-Drx2n72B.js";import"./shape-triangle-up-icon-DlWC9dMw.js";import"./refresh-ccw-D5pI4CI8.js";import"./pen-D-uMR61f.js";import"./empty-cell-DwkhFlv2.js";import"./settings-CvyjuPb0.js";import"./card-DmF8P1n9.js";import"./pagination-BJBzlZUr.js";import"./select-Bc6BYSLy.js";import"./chevron-down-B1waX0iQ.js";import"./chevron-up-CNEJWDjq.js";import"./ellipsis-BTsbXi2m.js";import"./empty-C-jvc1nq.js";import"./chevron-right-DlfG1Kfe.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Fe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
