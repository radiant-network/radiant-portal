import{j as t}from"./iframe-CgYzld9M.js";import{h as o}from"./index-DjF2ghAa.js";import{i as m}from"./api-CNFUPySA.js";import{F as l}from"./case-exploration-table-filters-DL1ePbtR.js";import{Z as p,d as n,X as c,c as d}from"./table-mock-Dd7zRXJY.js";import{C as g,A as a}from"./applications-config-DSaueCPj.js";import{b as u,d as h,e as b,f,g as S,i as C}from"./api-case-BbLevQcc.js";import{B as x}from"./chunk-QUQL4437-Blla3tfU.js";import"./preload-helper-PPVm8Dsz.js";import"./api-C1_4ex4N.js";import"./index-BJLMTLPT.js";import"./filter-button-nJIhOuaD.js";import"./checkbox-filter-ssHDeGG0.js";import"./checkbox-BvKqV_TL.js";import"./index-BU8vtByU.js";import"./check-DrnC7o8K.js";import"./label-DmVEf26Q.js";import"./index-0Ui6iiVS.js";import"./number-format-Bqham5ER.js";import"./i18n-BhtfqN2W.js";import"./badge-BPmjaafO.js";import"./separator-BXAAQkGD.js";import"./x-B30BiZwY.js";import"./button-BB6JTV7B.js";import"./action-button-Dd50ZnSl.js";import"./dropdown-menu-CCEHsgQp.js";import"./index-D5qyD-5a.js";import"./index-CPRKa62s.js";import"./circle-BJPs1Iry.js";import"./command-IE-J2bk3.js";import"./dialog-BuCU-_-p.js";import"./popover-CgcTZUAv.js";import"./search-DCeVs4Xh.js";import"./skeleton-BS9ObOBk.js";import"./test-tube-diagonal-DO-gbRgs.js";import"./user-itrKI4oa.js";import"./priority-indicator-hisstVef.js";import"./indicator-jYc-ulSh.js";import"./shape-triangle-up-icon-CEoXfZW4.js";import"./refresh-ccw-CDEUSFcd.js";import"./pen-Mmyn6fpH.js";import"./empty-cell-2N75mUCa.js";import"./settings-DclE_eXf.js";import"./card-Do_-gjxR.js";import"./pagination-CiWoFTft.js";import"./select-D7zvT7zR.js";import"./chevron-down-DkVYE_eZ.js";import"./chevron-up-DLwOfrjd.js";import"./ellipsis-DSqnSFWf.js";import"./empty-ZJqYNLCs.js";import"./chevron-right-DtnNy1M1.js";const r=d(),F={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ce={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:p,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:m.Asc}],onSortingChange:e=>{}},defaultColumnSettings:c([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(x,{children:t.jsx(g,{config:F,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(l,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(u,h),o.post(b,f),o.get(S,C)]}},args:{loadingStates:{list:!1,total:!1},data:p,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(l,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
