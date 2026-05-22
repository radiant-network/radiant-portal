import{j as t}from"./iframe-DZxGQyD0.js";import{h as o}from"./index-DvOG8Qo-.js";import{i as b}from"./api-QmR3WP_i.js";import{F as u}from"./case-exploration-table-filters-m44LF55K.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-BXAJ5GsZ.js";import{C,A as a}from"./applications-config-Dm8iSn42.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-DRCjokLp.js";import{B as R}from"./chunk-UVKPFVEO-DevS1Rzl.js";import"./preload-helper-Dp1pzeXC.js";import"./api-wIXIxrPs.js";import"./index-CtOZwwKW.js";import"./filter-button-lbQLE1xg.js";import"./badge-9kw-3hki.js";import"./separator-DW3ZXT-L.js";import"./index-Busr1vTm.js";import"./x-BOWcXDh5.js";import"./button-1W1d7xAn.js";import"./action-button-tMYSlpGq.js";import"./dropdown-menu-LRGitqO-.js";import"./index-Do7m-0ZR.js";import"./index-B5XFpENV.js";import"./check-CYxpBnf-.js";import"./circle-CNziIkuH.js";import"./i18n-C2h1o0aw.js";import"./checkbox-CSAJDOvZ.js";import"./index-DRBuaod2.js";import"./command-BKLanKXe.js";import"./dialog-DPXBSo8n.js";import"./popover-DmAQc1Td.js";import"./search-B_sO8YeO.js";import"./skeleton-DyLF_-eO.js";import"./test-tube-diagonal-C46Iejs0.js";import"./user-D_dcLgD1.js";import"./priority-indicator-BdpP1oQE.js";import"./indicator-C5E8mVMz.js";import"./shape-triangle-up-icon-BTQc4Qgb.js";import"./refresh-ccw-Ceth3HIu.js";import"./pen-DLSGecHj.js";import"./empty-cell-Dp9ic5Hh.js";import"./number-format-R5BAOpEr.js";import"./settings-BTB5NsGu.js";import"./card-Dui-VUUm.js";import"./pagination-qv8elK7g.js";import"./select-4JYIN6an.js";import"./chevron-down-DjUkaEXt.js";import"./chevron-up-B0RMPqcs.js";import"./ellipsis-b3ua6s_J.js";import"./empty-COWQ_uUf.js";import"./chevron-right-E4cYKMBA.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(m=(p=s.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var c,d,g;i.parameters={...i.parameters,docs:{...(c=i.parameters)==null?void 0:c.docs,source:{originalSource:`{
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
}`,...(g=(d=i.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};const ve=["Loading","Default"];export{i as Default,s as Loading,ve as __namedExportsOrder,_e as default};
