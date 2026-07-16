import{j as t}from"./iframe-CjjKcyRz.js";import{h as o}from"./index-Dvkqzho8.js";import{a as c}from"./api-DxXkaL5r.js";import{F as n}from"./case-exploration-table-filters-B2n-d1tq.js";import{k as l,X as d,c as g}from"./data-table-DE9t4Iz2.js";import{C as u,A as a}from"./applications-config-BeY8ydCl.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-B6YRjp0h.js";import{a as p}from"./story-section-CsOmwK7S.js";import{i as m}from"./table-mock-DA-606F1.js";import{B as F}from"./chunk-QUQL4437-CTy4a7fL.js";import"./preload-helper-PPVm8Dsz.js";import"./index-qeNfCT1D.js";import"./i18n-BuVXszO5.js";import"./index-BqIV9asx.js";import"./filter-button-DZ1dztbG.js";import"./checkbox-filter-B6hz6xw2.js";import"./checkbox-DDjFWVO8.js";import"./index-CbI53LD9.js";import"./check-C4P_JRtZ.js";import"./label-CfT3_fei.js";import"./number-format-CVy43Z0j.js";import"./badge-CofHwtqx.js";import"./separator-2VSHccwH.js";import"./x-CtWOxN3V.js";import"./button-Dvk1HNzZ.js";import"./action-button-BwDlSnhC.js";import"./dropdown-menu-844EsJQI.js";import"./index-ClBgjtxQ.js";import"./index-xQrGmB3K.js";import"./circle-BpRQY5cb.js";import"./command-BuAEu4hF.js";import"./dialog-DBbwXpZa.js";import"./popover-1f47Y7VJ.js";import"./search-Ds3VbSSF.js";import"./skeleton-CsI0WSbR.js";import"./test-tube-diagonal-BT7APyJ2.js";import"./user-CWLxDIul.js";import"./priority-indicator-DWV_vH3-.js";import"./indicator-DRQNHriC.js";import"./shape-triangle-up-icon-Q4_Wt3_F.js";import"./refresh-ccw-htHekEz1.js";import"./pen-D3oE_dVW.js";import"./use-tenant-D9bGYSBx.js";import"./api-BjHhlcVm.js";import"./grip-vertical-D12WNvUt.js";import"./settings-BH7LMM9R.js";import"./card-BaaeCCxW.js";import"./pagination-BYTNUggw.js";import"./select-DrGvsqqG.js";import"./chevron-down-Btgt0YVi.js";import"./chevron-up-D2sJhVbG.js";import"./ellipsis-ChfjXRhn.js";import"./empty-CXNOyqY8.js";import"./chevron-right-B7C5OKJf.js";import"./empty-cell-BNPhynAA.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ve={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
