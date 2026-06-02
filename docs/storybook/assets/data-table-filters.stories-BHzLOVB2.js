import{j as t}from"./iframe-BH3MSqWK.js";import{h as o}from"./index-CJX5yBN4.js";import{i as m}from"./api-CNFUPySA.js";import{F as l}from"./case-exploration-table-filters-B_cSPS3-.js";import{Z as p,d as n,X as c,c as d}from"./table-mock-BzZrPlAu.js";import{C as g,A as a}from"./applications-config-BSntMn92.js";import{b as u,d as h,e as b,f,g as S,i as C}from"./api-case-jo62859B.js";import{B as x}from"./chunk-QUQL4437-DecpjHsp.js";import"./preload-helper-PPVm8Dsz.js";import"./api-CW7YpE16.js";import"./index-BSwCZ4xH.js";import"./filter-button-CYIUfMYG.js";import"./checkbox-filter-BwjYbjBN.js";import"./checkbox-RO2VME1A.js";import"./index-CUICGVdn.js";import"./check-Bk5l44Qw.js";import"./label-CbaNIhYw.js";import"./index-CfauPKxk.js";import"./number-format-CruRQC6f.js";import"./i18n-MpjanH8G.js";import"./badge-C7uCJ6qM.js";import"./separator-DyfWTagX.js";import"./x-D_WMbL1s.js";import"./button-BxP9PPaa.js";import"./action-button-DjPcyzdS.js";import"./dropdown-menu-DwRYTMWI.js";import"./index-B6DCGoSV.js";import"./index-Cipz7JOz.js";import"./circle-Cyir8aSn.js";import"./command-DNHAicEN.js";import"./dialog-DIsx6x1x.js";import"./popover-BMngGd2f.js";import"./search-CWjPsGv_.js";import"./skeleton-D3nQRcXW.js";import"./test-tube-diagonal-CBzEzcjJ.js";import"./user-CJ5Zlocr.js";import"./priority-indicator-BaF7dWvY.js";import"./indicator-DAo0P4-_.js";import"./shape-triangle-up-icon-BIU-3xog.js";import"./refresh-ccw-TfUhERwz.js";import"./pen-J7JL1d-w.js";import"./empty-cell-CYpXxOKu.js";import"./settings-Rag-UZTm.js";import"./card-tra_P6sC.js";import"./pagination-Mz08GopV.js";import"./select-BK-WfEuj.js";import"./chevron-down-NE6jLGu9.js";import"./chevron-up-DPZMdaEM.js";import"./ellipsis-Cnvd6r69.js";import"./empty-VjGjYjlP.js";import"./chevron-right-CEY6iZOw.js";const r=d(),F={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ce={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:m.Asc}],onSortingChange:e=>{}},defaultColumnSettings:c([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(x,{children:t.jsx(g,{config:F,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(l,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(u,h),o.post(b,f),o.get(S,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(l,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
