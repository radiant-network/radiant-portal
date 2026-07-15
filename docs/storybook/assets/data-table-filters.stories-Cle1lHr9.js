import{j as t}from"./iframe-BJ0KBJU7.js";import{h as o}from"./index-Cdyp0lg5.js";import{a as c}from"./api-DxXkaL5r.js";import{F as n}from"./case-exploration-table-filters-BXyrXQwW.js";import{k as l,X as d,c as g}from"./data-table-DD3g-tkl.js";import{C as u,A as a}from"./applications-config-jLjJTtO3.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-B5qNKIDI.js";import{a as p}from"./story-section-BU2eJCi3.js";import{i as m}from"./table-mock-CNCvWXxW.js";import{B as F}from"./chunk-QUQL4437-BuLqhNDi.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C_ELw9K6.js";import"./i18n-DmjSHWrQ.js";import"./index-B78TygC3.js";import"./filter-button-DM0e14uk.js";import"./checkbox-filter-B9iDcwAr.js";import"./checkbox-Ho9kG9Wm.js";import"./index-CaZkY5dK.js";import"./check-Dg29415_.js";import"./label-DRF3oeBn.js";import"./number-format-Dvedlrg0.js";import"./badge-BNA_Ry1w.js";import"./separator-CKp5KkZQ.js";import"./x-D8ravScC.js";import"./button-DFGR7V5l.js";import"./action-button-C928MkJM.js";import"./dropdown-menu-D5WDI4zP.js";import"./index-DfueDfU3.js";import"./index-DjBvZjcf.js";import"./circle-B1ny9b-U.js";import"./command-VWv_IH4K.js";import"./dialog-BJPmv9T7.js";import"./popover-Bt4cgKoE.js";import"./search-Bp6NDV8R.js";import"./skeleton-B1dmiM7_.js";import"./test-tube-diagonal-4gzczcy-.js";import"./user-Drqd36_M.js";import"./priority-indicator-29lwJT1B.js";import"./indicator-UyoCKW6T.js";import"./shape-triangle-up-icon-xrwNlb5m.js";import"./refresh-ccw-BuxcXlsu.js";import"./pen-D1QIlovu.js";import"./use-tenant-CzIHPu-A.js";import"./api-BjHhlcVm.js";import"./grip-vertical-SlLZbaRS.js";import"./settings-wKA66jUh.js";import"./card-DYy5Xp3_.js";import"./pagination-QDjWRvJo.js";import"./select-DBbNWz04.js";import"./chevron-down-qfXDwytH.js";import"./chevron-up-fZE14ZCf.js";import"./ellipsis-6isKPnt5.js";import"./empty-C9fWip7f.js";import"./chevron-right-DfhtADuO.js";import"./empty-cell-CASTKcF7.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ve={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
