import{j as t}from"./iframe-C5ghdKPC.js";import{h as o}from"./index-Sy_ni6Cx.js";import{a as c}from"./api-DxXkaL5r.js";import{F as n}from"./case-exploration-table-filters-CTLFIpoV.js";import{k as l,X as d,c as g}from"./data-table-Dny96Bli.js";import{C as u,A as a}from"./applications-config-DFulkYeq.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-DQulVjn2.js";import{a as p}from"./story-section-CLlhZcHq.js";import{i as m}from"./table-mock-CUMixpNI.js";import{B as F}from"./chunk-QUQL4437-C3I5PKxO.js";import"./preload-helper-PPVm8Dsz.js";import"./index-V3egl2xV.js";import"./i18n-BPASaW18.js";import"./index-BhpGQa6j.js";import"./filter-button-D1uJcLMQ.js";import"./checkbox-filter-DRojAgd6.js";import"./checkbox-Dtwaa5CB.js";import"./index-DCPPE30T.js";import"./check-CWaWZXj3.js";import"./label-Babr-5Nq.js";import"./number-format-CoM616Hw.js";import"./badge-BDQfaujd.js";import"./separator-Pm6qs9Vj.js";import"./x-DLnpHguX.js";import"./button-Bv6IhCvK.js";import"./action-button-DJGIFk-q.js";import"./dropdown-menu-DoOCM-LE.js";import"./index-B--nswC9.js";import"./index-ARASfFZ8.js";import"./circle-IiyuoDyT.js";import"./command-BKortVcf.js";import"./dialog-BahdJJOU.js";import"./popover-kheK7n3c.js";import"./search-tzLq7WKF.js";import"./skeleton-B-iZZ6gN.js";import"./test-tube-diagonal-DATWb4GO.js";import"./user-CuruaCF-.js";import"./priority-indicator-DpRS71wN.js";import"./indicator-C2tt9oKk.js";import"./shape-triangle-up-icon-2dVWrRQZ.js";import"./refresh-ccw-CnGZupCL.js";import"./pen-B6Ce8GMz.js";import"./use-tenant-CO_xBvZf.js";import"./api-BjHhlcVm.js";import"./grip-vertical-CVjYSjIs.js";import"./settings-C2oA9txg.js";import"./card-C8RPW6UK.js";import"./pagination-DnB5o2vE.js";import"./select-Dqb_nOpn.js";import"./chevron-down-sgOnpycO.js";import"./chevron-up-BbeeFWqI.js";import"./ellipsis-BVt6ZMGd.js";import"./empty-CiKCHuuk.js";import"./chevron-right-CcxH684S.js";import"./empty-cell-Zk0reiXF.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ve={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
