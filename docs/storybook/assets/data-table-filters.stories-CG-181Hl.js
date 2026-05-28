import{j as t}from"./iframe-BrSeghhN.js";import{h as o}from"./index-B06i79tT.js";import{j as b}from"./api-ok7Ado9G.js";import{F as u}from"./case-exploration-table-filters-C8H575lJ.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-DJVfjVJS.js";import{C,A as a}from"./applications-config-D8cwIrPo.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-dbWPaHHx.js";import{B as R}from"./chunk-UVKPFVEO-DtMjr8N3.js";import"./preload-helper-Dp1pzeXC.js";import"./api-iZoFxMmC.js";import"./index-DhKdHgJ5.js";import"./filter-button-BGEFXxtk.js";import"./badge-BZxLRLil.js";import"./separator-DE6Q_3-9.js";import"./index-BT6s_ZVo.js";import"./x-CE4q4d5i.js";import"./button-mWGiavLc.js";import"./action-button-C9neH2i_.js";import"./dropdown-menu-BfTwRjwo.js";import"./index-B0vLzOZN.js";import"./index-BWpW7zLN.js";import"./check-DLxMbB_1.js";import"./circle-DUWUDPO6.js";import"./i18n-yI98UA-9.js";import"./checkbox-BB13NpGW.js";import"./index-ByQtzKMF.js";import"./command-BSxjPbsM.js";import"./dialog-8LOhkW9B.js";import"./popover-D02s2f4R.js";import"./search-0ugrdeb1.js";import"./skeleton-B_gOsObQ.js";import"./test-tube-diagonal-DO06DGJ_.js";import"./user-B4AAcShr.js";import"./priority-indicator-C4ek7VgT.js";import"./indicator-8y5THVoI.js";import"./shape-triangle-up-icon-D7TVZX8w.js";import"./refresh-ccw-h-L2G7E9.js";import"./pen-DwAfx6fY.js";import"./empty-cell-DTBfhWcG.js";import"./number-format-QjK4Y_0O.js";import"./settings-D9nlXrev.js";import"./card-0CWO2Ow7.js";import"./pagination-CqAZkMSk.js";import"./select-DGlKuTwB.js";import"./chevron-down-CDqKfKrM.js";import"./chevron-up-CL1nyclP.js";import"./ellipsis-DnKZUxvw.js";import"./empty-C1bsmLgj.js";import"./chevron-right-BW3H-qcO.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
