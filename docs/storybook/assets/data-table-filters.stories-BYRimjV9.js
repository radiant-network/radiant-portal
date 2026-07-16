import{j as t}from"./iframe-D78160ma.js";import{h as o}from"./index-yNrGp-cp.js";import{a as c}from"./api-DxXkaL5r.js";import{F as n}from"./case-exploration-table-filters-BrYMJoTe.js";import{k as l,X as d,c as g}from"./data-table-GSz_iOPh.js";import{C as u,A as a}from"./applications-config-BZa-gdOF.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-DBW9XrI_.js";import{a as p}from"./story-section-CJRHUJpZ.js";import{i as m}from"./table-mock-CWlWMJzc.js";import{B as F}from"./chunk-QUQL4437-7e4i9lPk.js";import"./preload-helper-PPVm8Dsz.js";import"./index-8VL-PFaF.js";import"./i18n-BrjiU_bT.js";import"./index-BSsmB6Hv.js";import"./filter-button-BX2IbqSb.js";import"./checkbox-filter-DV0ZCc8d.js";import"./checkbox-BefjuAw_.js";import"./index-CHDJoLbi.js";import"./check-Dz-4uiGV.js";import"./label-Li_1t0cO.js";import"./number-format-Ccb5-Apa.js";import"./badge-qrZaBCbe.js";import"./separator-C2Q6CsId.js";import"./x-cypWjlnE.js";import"./button-D31B_Gsf.js";import"./action-button-CXmwuvNv.js";import"./dropdown-menu-CFr9nLu7.js";import"./index-E6EEG8_q.js";import"./index-BJO3_Py_.js";import"./circle-DO4DQqF4.js";import"./command-DV4Ppzm1.js";import"./dialog-DwWwyAF4.js";import"./popover-BrOVyTY-.js";import"./search-Dn0yDLiG.js";import"./skeleton-jhTyhUD-.js";import"./test-tube-diagonal-BxTKZ6TU.js";import"./user-yUFEDbxg.js";import"./priority-indicator-Bf9NioOc.js";import"./indicator-DyUP0zFO.js";import"./shape-triangle-up-icon-DNxfhw8-.js";import"./refresh-ccw-m1E78Sgk.js";import"./pen-DDY_HITG.js";import"./use-tenant-BXFQcKPS.js";import"./api-BjHhlcVm.js";import"./grip-vertical-DXVXhwzo.js";import"./settings-D8cM3BRU.js";import"./card-C-K4ns8X.js";import"./pagination-Bl-cIY5Y.js";import"./select-XTpFega2.js";import"./chevron-down-w59Cf0Xn.js";import"./chevron-up-DOrLK14z.js";import"./ellipsis-DtE-aq2p.js";import"./empty-u_E6C8s8.js";import"./chevron-right-DgQFzB-x.js";import"./empty-cell-BPJxo1IY.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ve={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
