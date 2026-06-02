import{j as t}from"./iframe-DaN5ePGy.js";import{h as o}from"./index-DyN6-iYz.js";import{i as m}from"./api-CNFUPySA.js";import{F as l}from"./case-exploration-table-filters-B_qk0IoL.js";import{Z as p,d as n,Y as c,c as d}from"./table-mock-5piySsvV.js";import{C as g,A as a}from"./applications-config-DfTGuYYT.js";import{b as u,d as h,e as b,f,g as S,i as C}from"./api-case-BV8rT0zW.js";import{B as x}from"./chunk-QUQL4437-tiDeZvge.js";import"./preload-helper-PPVm8Dsz.js";import"./api-Bl_JvKfP.js";import"./index-FwWjbq00.js";import"./filter-button-CTOFW-AP.js";import"./checkbox-filter-Bzi9GM0Q.js";import"./checkbox-R3ES-PDx.js";import"./index-Bxzg_Qkc.js";import"./check-B-s7SQrr.js";import"./label-DFc0ADpw.js";import"./index-buk7i43K.js";import"./number-format-B8g0amHX.js";import"./i18n-M9kOJp22.js";import"./badge-BE-JumNl.js";import"./separator-Dw2V0eT4.js";import"./x-BX9lxs28.js";import"./button-C2HSnRiu.js";import"./action-button-BHK2YR4r.js";import"./dropdown-menu-CPO56L4e.js";import"./index-DeH_VHOF.js";import"./index-CZCzdGEw.js";import"./circle-ZjFAsy7t.js";import"./command-Cbufo2GG.js";import"./dialog-DbhL1w5X.js";import"./popover-uHeYVtc4.js";import"./search-D7P8tn3e.js";import"./skeleton-ddFZC1OR.js";import"./test-tube-diagonal-RZ_CplWh.js";import"./user-3d638KM8.js";import"./priority-indicator-CSFSM49O.js";import"./indicator-1NKfoFaj.js";import"./shape-triangle-up-icon-DMU5cBZn.js";import"./refresh-ccw-CGaFhuNt.js";import"./pen-D7oK-b_h.js";import"./empty-cell-DlxL0xHw.js";import"./settings-CpwpifTX.js";import"./card-Cjd0uC8i.js";import"./pagination-w_8nXQz_.js";import"./select-BoZlEhHZ.js";import"./chevron-down-DEKrCgi_.js";import"./chevron-up-DB5AtR6w.js";import"./ellipsis-B4gkA1F2.js";import"./empty-BDHFu0Ce.js";import"./chevron-right-Blm-Av0L.js";const r=d(),F={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ce={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:m.Asc}],onSortingChange:e=>{}},defaultColumnSettings:c([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(x,{children:t.jsx(g,{config:F,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(l,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(u,h),o.post(b,f),o.get(S,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(l,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
  render: args => <DataTable {...args} />
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
  render: args => <DataTable {...args} />
}`,...i.parameters?.docs?.source}}};const xe=["Loading","Default"];export{i as Default,s as Loading,xe as __namedExportsOrder,Ce as default};
