import{j as t}from"./iframe-C3tcij1x.js";import{h as o}from"./index-DNuHDUQw.js";import{a as c}from"./api-DxXkaL5r.js";import{F as n}from"./case-exploration-table-filters-BU57lZgG.js";import{k as l,X as d,c as g}from"./data-table-xGFTHHSr.js";import{C as u,A as a}from"./applications-config-CZU46Nat.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-Da87boA1.js";import{a as p}from"./story-section-B3q-8Mn1.js";import{i as m}from"./table-mock-CUgb6GoJ.js";import{B as F}from"./chunk-QUQL4437-arySQgr0.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DBVMqmR5.js";import"./i18n-D8kK_uUj.js";import"./index-Bdx6gjHI.js";import"./filter-button-BpvBP5nQ.js";import"./checkbox-filter-DaHkmdjG.js";import"./checkbox-hJVEavWC.js";import"./index-D_L9kYpj.js";import"./check-DQGIiX85.js";import"./label-C5Yersku.js";import"./number-format-DUGa0KXz.js";import"./badge-Br80AXZa.js";import"./separator-C91uL2Ph.js";import"./x-CvlhwQHx.js";import"./button-BKk6krlU.js";import"./action-button-BAh27q8n.js";import"./dropdown-menu-Dn-15FK6.js";import"./index-BAzJp_H4.js";import"./index-Bcsurlbo.js";import"./circle-0K0XQElZ.js";import"./command-zhP8LTbQ.js";import"./dialog-BGPohL35.js";import"./popover-BKSntI8l.js";import"./search-BJdfHsF5.js";import"./skeleton-Ci4Bhp0c.js";import"./test-tube-diagonal-HzL1vFfw.js";import"./user-CxnUlhLq.js";import"./priority-indicator-DWbwMk4S.js";import"./indicator-DC3y9x5J.js";import"./shape-triangle-up-icon-ClibFr0r.js";import"./refresh-ccw-BA72ZhYc.js";import"./pen-CJNiWyFs.js";import"./use-tenant-D5zezOTX.js";import"./api-BjHhlcVm.js";import"./grip-vertical-fjjnTuJm.js";import"./settings-cjxeEbv8.js";import"./card-B0zfQcea.js";import"./pagination-BMddMb0n.js";import"./select-us7bhzSi.js";import"./chevron-down-CnGyztj3.js";import"./chevron-up-eBTnjmxw.js";import"./ellipsis-D288IUOj.js";import"./empty-DhlVfyeb.js";import"./chevron-right-BFSKNuKL.js";import"./empty-cell-nf8G7Ddc.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},ve={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
