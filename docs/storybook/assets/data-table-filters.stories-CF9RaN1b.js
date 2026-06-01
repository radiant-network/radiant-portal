import{j as t}from"./iframe-fZ1JU2dD.js";import{h as o}from"./index-CLIGaZJs.js";import{i as m}from"./api-CNFUPySA.js";import{F as l}from"./case-exploration-table-filters-C3mtdMKK.js";import{Z as p,d as n,X as c,c as d}from"./table-mock-Ch5XLyGC.js";import{C as g,A as a}from"./applications-config-CTshcaaR.js";import{b as u,d as h,e as b,f,g as S,i as C}from"./api-case-BBRVxKZP.js";import{B as x}from"./chunk-QUQL4437-Dibaqxmg.js";import"./preload-helper-PPVm8Dsz.js";import"./api-Du39gQtF.js";import"./index-BsMQ4rV8.js";import"./filter-button-8jL0fwBd.js";import"./checkbox-filter-C63oI0sE.js";import"./checkbox-CmUQOKcS.js";import"./index-oBed2HXp.js";import"./check-BCrtbgAX.js";import"./label-Bgg9wXxM.js";import"./index-BuixPVmM.js";import"./number-format-DT99JFg6.js";import"./i18n-Cu2AZSyu.js";import"./badge-_ehbmyEb.js";import"./separator-Bt15M7Wt.js";import"./x-DMxNaVrf.js";import"./button-CeuGaa2_.js";import"./action-button-DH7rTm7W.js";import"./dropdown-menu-WdkrS53z.js";import"./index-Cuzu6qxP.js";import"./index-Bt1gSSe9.js";import"./circle-DE-7MMSe.js";import"./command-CVOpzYX-.js";import"./dialog-1epGVCQo.js";import"./popover-CMm7zbXK.js";import"./search-d017ibSl.js";import"./skeleton-BjkBYmoC.js";import"./test-tube-diagonal-lAURo-GJ.js";import"./user-Ewg3HKc5.js";import"./priority-indicator-DU9L_GJp.js";import"./indicator-DzLj0xlf.js";import"./shape-triangle-up-icon-Dv1IW1Tt.js";import"./refresh-ccw-C8XLoHr4.js";import"./pen-BzR0p4iZ.js";import"./empty-cell-BRcpJNX1.js";import"./settings-BTmxg9pP.js";import"./card-DPbh96Ku.js";import"./pagination-DeqrpJul.js";import"./select-Jwcxjzfa.js";import"./chevron-down-BJrZ8buA.js";import"./chevron-up-Upi9_tzO.js";import"./ellipsis-HTfBaHDt.js";import"./empty-CWXoq-fl.js";import"./chevron-right-DJXhYw6H.js";const r=d(),F={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ce={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:m.Asc}],onSortingChange:e=>{}},defaultColumnSettings:c([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(x,{children:t.jsx(g,{config:F,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(l,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(u,h),o.post(b,f),o.get(S,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(l,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
