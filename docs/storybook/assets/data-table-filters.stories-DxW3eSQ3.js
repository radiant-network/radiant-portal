import{j as t}from"./iframe-Cbdknb1k.js";import{h as o}from"./index-Cbsos1Om.js";import{i as c}from"./api-CNFUPySA.js";import{F as n}from"./case-exploration-table-filters-W4k4njVA.js";import{Y as p,d as l,_ as d,c as g}from"./table-mock-D_tPdkzy.js";import{C as u,A as a}from"./applications-config-CNEk6IF6.js";import{b as h,d as f,e as b,f as S,g as x,i as C}from"./api-case-CqxBMjHu.js";import{a as m}from"./story-section-BVaUEtis.js";import{B as F}from"./chunk-QUQL4437-CorQw_Pn.js";import"./preload-helper-PPVm8Dsz.js";import"./api-DwaRmgHt.js";import"./index-C6yqdqIH.js";import"./filter-button-DCKhu9mx.js";import"./checkbox-filter-DO5Qk9IE.js";import"./checkbox-Cm2gcTSr.js";import"./index-BvjQePSx.js";import"./check-DPpRClnn.js";import"./label-BQwkdKDu.js";import"./index-87WvwnWY.js";import"./number-format-BzeaowGi.js";import"./i18n-D-yzr8ya.js";import"./badge-_YExI8CG.js";import"./separator-Bq5mxrnm.js";import"./x-jGcVnGJc.js";import"./button-B2dwLL0F.js";import"./action-button-vyGBaIAJ.js";import"./dropdown-menu-BHyRkyrg.js";import"./index-Cz_krX8a.js";import"./index-vbxHKvSM.js";import"./circle-CJX0r14w.js";import"./command-D1WuXSN-.js";import"./dialog-CYMshr3s.js";import"./popover-FM2MpKK-.js";import"./search-3rpL8Jgy.js";import"./skeleton-BLK-BKPp.js";import"./test-tube-diagonal-UXgTm2pX.js";import"./user-DORyoML8.js";import"./priority-indicator-CQsrE8Cj.js";import"./indicator-CUYz0-EW.js";import"./shape-triangle-up-icon-DeQMugtU.js";import"./refresh-ccw-DHv1Pomh.js";import"./pen-3NSTc-9N.js";import"./empty-cell-DdjAXFjj.js";import"./settings-Dndv4EjP.js";import"./card-CzR5b8lH.js";import"./pagination-MwvVOPd6.js";import"./select-BQxJOfuf.js";import"./chevron-down-DCv20u1_.js";import"./chevron-up-A2kT9Jev.js";import"./ellipsis-BB-K1AXt.js";import"./empty-B_V4M-yy.js";import"./chevron-right-BDWQhCWb.js";const r=g(),_={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Fe={title:"Features/Data Table/Filters",component:l,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:c.Asc}],onSortingChange:e=>{}},defaultColumnSettings:d([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(F,{children:t.jsx(u,{config:_,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Loading",children:t.jsx(l,{...e})})},i={parameters:{msw:{handlers:[o.post(h,f),o.post(b,S),o.get(x,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(n,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(m,{title:"Default",children:t.jsx(l,{...e})})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
