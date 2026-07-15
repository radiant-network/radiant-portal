import{j as t}from"./iframe-kLaNX2HI.js";import{h as o}from"./index-Dr-4_ABD.js";import{a as c}from"./api-DxXkaL5r.js";import{F as n}from"./case-exploration-table-filters-DxqP79mV.js";import{k as l,X as d,c as g}from"./data-table-ox3jGWb6.js";import{C as u,A as a}from"./applications-config-QE1Yvf_R.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-CGujrJtP.js";import{a as p}from"./story-section-YShHgFMq.js";import{i as m}from"./table-mock-9pPlBAUj.js";import{B as F}from"./chunk-QUQL4437-7Vep-gW3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DzylGbwD.js";import"./i18n-ZHel4DsP.js";import"./index-BCXviJZk.js";import"./filter-button-C7jebHcE.js";import"./checkbox-filter-Bqnr6zBX.js";import"./checkbox-BvGeGKrx.js";import"./index-B8pi8AaO.js";import"./check-NiNg2u4X.js";import"./label-CIxLnqGb.js";import"./number-format-DKrGVdgV.js";import"./badge-BBff1bAs.js";import"./separator-BTZwSWvT.js";import"./x-AVvb3cMA.js";import"./button-lcKTI4HU.js";import"./action-button-D3l4bIzZ.js";import"./dropdown-menu-85xmnBFd.js";import"./index-fXaV-lio.js";import"./index-B2vLf8-Q.js";import"./circle-yHcXqLnR.js";import"./command-9_KFPD2M.js";import"./dialog-DBq4pjD_.js";import"./popover-BLERJ09U.js";import"./search-DqOCya6u.js";import"./skeleton-DmgM1E7r.js";import"./test-tube-diagonal-ButuQAWT.js";import"./user-iih5RIk4.js";import"./priority-indicator-Cfxop7BO.js";import"./indicator-DhKHXBoB.js";import"./shape-triangle-up-icon-DG-y_J0I.js";import"./refresh-ccw-CXGKIe3b.js";import"./pen-CdpY8PRK.js";import"./use-tenant-CbAux0Jt.js";import"./api-BjHhlcVm.js";import"./grip-vertical-JbYT_SuC.js";import"./settings-PgAY7o9X.js";import"./card-DM-En_BO.js";import"./pagination-8emWnzaC.js";import"./select-Bu1ZUjJP.js";import"./chevron-down-C1GODzbu.js";import"./chevron-up-BVlPH512.js";import"./ellipsis-CRGKMU5M.js";import"./empty-CyiqjP3j.js";import"./chevron-right-Bm_tRRwQ.js";import"./empty-cell-Du5cE5bq.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ve={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
