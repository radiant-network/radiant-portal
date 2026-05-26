import{j as t}from"./iframe-Bfhefzsx.js";import{h as o}from"./index-CEnRqh40.js";import{j as b}from"./api-ok7Ado9G.js";import{F as u}from"./case-exploration-table-filters-SBB09Eu4.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-Bm9fsCdC.js";import{C,A as a}from"./applications-config-B6Tg5d9b.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-DNeVroYQ.js";import{B as R}from"./chunk-UVKPFVEO-CzR9cwZI.js";import"./preload-helper-Dp1pzeXC.js";import"./api-6clcAXtN.js";import"./index-DKzYbM40.js";import"./filter-button-DHbmcDSQ.js";import"./badge-CQIHpEAI.js";import"./separator-DTG1lmI1.js";import"./index-ySC5M_j1.js";import"./x-FhvHWdbH.js";import"./button-CWzl1mbJ.js";import"./action-button-DXGv7O3g.js";import"./dropdown-menu-z1WTEfQX.js";import"./index-DtXaOCN_.js";import"./index-WNoVkAv8.js";import"./check-BHnUMkz2.js";import"./circle-E9FFs9t_.js";import"./i18n-B6khZ_Hp.js";import"./checkbox-41USKaCi.js";import"./index-BwXHzWuF.js";import"./command-CjRJHe-3.js";import"./dialog-imW6R8gx.js";import"./popover-Cl8hT8Oi.js";import"./search-mNacfnGw.js";import"./skeleton-6BlzxHy1.js";import"./test-tube-diagonal-C41VSFKy.js";import"./user-CaYeOAb5.js";import"./priority-indicator-CoQZ1--o.js";import"./indicator-Cyo9IWB3.js";import"./shape-triangle-up-icon-pH2az8mP.js";import"./refresh-ccw-Cy35rEv_.js";import"./pen-DZ_rziOX.js";import"./empty-cell-DI2UiCFb.js";import"./number-format-ChZCceCq.js";import"./settings-C2haqwbP.js";import"./card-Dam813KC.js";import"./pagination-oyZma6VB.js";import"./select-Dn4TBRUM.js";import"./chevron-down-D2QiPj0z.js";import"./chevron-up-DyrHWNlW.js";import"./ellipsis-BBKGj6IN.js";import"./empty-BEJkq_uW.js";import"./chevron-right-BhnYX9y8.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
