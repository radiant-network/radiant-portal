import{j as t}from"./iframe-ikmO-G8w.js";import{h as o}from"./index-B1zcIUZJ.js";import{a as c}from"./api-D36EIwoJ.js";import{F as n}from"./case-exploration-table-filters-BPQDVTe_.js";import{k as l,X as d,c as g}from"./data-table-MEk8v_xj.js";import{C as u,A as a}from"./applications-config-T5aOb8IG.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-B_anjoB7.js";import{a as p}from"./story-section-Do19LCYz.js";import{i as m}from"./table-mock-C7NkoJs4.js";import{B as F}from"./chunk-QUQL4437-C1BHFs88.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Ctxs9dV7.js";import"./i18n--cYKJdvf.js";import"./index-TBEFmxjP.js";import"./filter-button-ZDXeWhJ6.js";import"./checkbox-filter-BBLFZ8VU.js";import"./checkbox-Cb2IM37r.js";import"./index-DVAb1bQs.js";import"./check-DFIBGLZn.js";import"./label-CsLLmXOT.js";import"./number-format-CfnI2rJh.js";import"./badge-CqwSpyND.js";import"./separator-DvGIa4AD.js";import"./x-leFJ26lF.js";import"./button-f2BnibuH.js";import"./action-button-DslSGgMW.js";import"./dropdown-menu-Djo0E1ip.js";import"./index-DLIPavft.js";import"./index-LNYO5vkT.js";import"./circle-HHVicZ3t.js";import"./command-ClIJDxA0.js";import"./dialog-BhVHT_xJ.js";import"./popover-B5JBIamW.js";import"./search-BBHqMNdV.js";import"./skeleton-DBzD6UYr.js";import"./test-tube-diagonal-D9G13A5f.js";import"./user-Btxh8wJx.js";import"./priority-indicator-Dl_K04dM.js";import"./indicator-BXxqAUk-.js";import"./shape-triangle-up-icon-D5N9CCub.js";import"./refresh-ccw-Zwqriu2I.js";import"./pen-Dm6bUmOM.js";import"./use-tenant-IjUrKsi0.js";import"./api-BKer6Fgf.js";import"./403-C-N4niER.js";import"./header-full-white-BYvDCc_r.js";import"./center-layout-YtrE2F-n.js";import"./main-navbar-lang-switcher-CaKzGhRi.js";import"./grip-vertical-OGfHhEzn.js";import"./settings-BuaF0aCU.js";import"./arrow-down-Bil6GwQF.js";import"./card-B2Khm5nL.js";import"./pagination-CmY1PmiQ.js";import"./select-CGdBgzys.js";import"./chevron-down-QWRYA15J.js";import"./chevron-up-Bxwg3eVU.js";import"./ellipsis-B-gFwLMW.js";import"./empty-C_DCpSlB.js";import"./chevron-right-DbjSEN72.js";import"./empty-cell-DdNYxqzM.js";const r=g(),A={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Pe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:m,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:A,children:t.jsx(e,{})})})]},i={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Loading",children:t.jsx(l,{...e})})},s={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:m,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(p,{title:"Default",children:t.jsx(l,{...e})})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};const Te=["Loading","Default"];export{s as Default,i as Loading,Te as __namedExportsOrder,Pe as default};
