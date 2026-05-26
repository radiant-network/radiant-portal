import{j as t}from"./iframe-BIVZNcDx.js";import{h as o}from"./index-DHrLodiX.js";import{j as b}from"./api-ok7Ado9G.js";import{F as u}from"./case-exploration-table-filters-DEP5Ka4n.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-DnfDrSnh.js";import{C,A as a}from"./applications-config-Bfz_Xc4S.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-Cx4f7HE0.js";import{B as R}from"./chunk-UVKPFVEO-DkEhpWYP.js";import"./preload-helper-Dp1pzeXC.js";import"./api-BNnkDz4h.js";import"./index-BMZKsHUR.js";import"./filter-button-BL61VqcX.js";import"./badge-B3gnhmOj.js";import"./separator-Dwai73g_.js";import"./index-D37jQc6A.js";import"./x-CM_jdjpH.js";import"./button-6N62lUpo.js";import"./action-button-Dp1yU_WD.js";import"./dropdown-menu-DPDJlzat.js";import"./index-DQWZ93FF.js";import"./index-D5OUmr5s.js";import"./check-oh_5MiUz.js";import"./circle-Bz-lEpPj.js";import"./i18n-BkDRdn4X.js";import"./checkbox-CHCcThK3.js";import"./index-L5EIAPnE.js";import"./command-DEfX_Shg.js";import"./dialog-D3kht_4h.js";import"./popover-Cy4LFm9B.js";import"./search-CNED4Mq8.js";import"./skeleton-BGpQmToc.js";import"./test-tube-diagonal-D3jkiGL3.js";import"./user-CenWJyEP.js";import"./priority-indicator-BTgHppn0.js";import"./indicator-DJ5cn4Gs.js";import"./shape-triangle-up-icon-D7H3BvL2.js";import"./refresh-ccw-C9wT5pGt.js";import"./pen-Bjc3-ukD.js";import"./empty-cell-BFhX8C0W.js";import"./number-format-Bn-RSeJt.js";import"./settings-C50wnRUr.js";import"./card-DevkVBEp.js";import"./pagination-DzTSJMfB.js";import"./select-Egv6S-dN.js";import"./chevron-down-tI-shpgh.js";import"./chevron-up-Ca9h7NI1.js";import"./ellipsis-C3R7X6P8.js";import"./empty-B1SEcUJs.js";import"./chevron-right-Bwe1LSs6.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
