import{j as t}from"./iframe-CRRv_ibS.js";import{h as o}from"./index-Ded7NQSS.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-CodL99y1.js";import{i as n,j as f,c as S}from"./data-table-EM6nDCnX.js";import{C,A as a}from"./applications-config-DHEF0ajK.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-BPjfWEg6.js";import{e as h}from"./table-mock-CCr-9Prs.js";import{B as R}from"./chunk-UVKPFVEO-Co8HoQJe.js";import"./preload-helper-Dp1pzeXC.js";import"./index-Be5NAWPT.js";import"./index-CBwMcGuW.js";import"./filter-button-CgD0zZzR.js";import"./badge-TF2JowPM.js";import"./separator-B2H8WKeE.js";import"./index-BEmc1KKo.js";import"./x-DFGLtELr.js";import"./button-CGUfaMs5.js";import"./action-button-DixJPHxK.js";import"./dropdown-menu-PTnS0g7N.js";import"./index-D5YiG8wC.js";import"./circle-DN0KfahX.js";import"./check-BvdvHDVF.js";import"./i18n-Cl__0Jt0.js";import"./checkbox-SOljwkmV.js";import"./index-CrVtDQV2.js";import"./command-CXNXrQ9s.js";import"./dialog-vr4KyEqW.js";import"./popover-Bilrz9hE.js";import"./search-B7OGPVpG.js";import"./skeleton-Cbw-sO5o.js";import"./test-tube-diagonal-Cz--wdy9.js";import"./user-HyJ9X171.js";import"./priority-indicator-DwxsMMrM.js";import"./indicator-OZsics0d.js";import"./shape-triangle-up-icon-CLE2g7wG.js";import"./refresh-ccw-D2c_fVcE.js";import"./pen-BrWdMv5U.js";import"./isEqual-1GquTfVk.js";import"./settings-Dihx8XRZ.js";import"./number-format-trRUkKGt.js";import"./card-BOL-hO6h.js";import"./pagination-CcDT2Y3P.js";import"./select-DeE-xsAF.js";import"./chevron-down-Ci1-mXqK.js";import"./chevron-up-DdNvcvAs.js";import"./ellipsis-zUfGhbgr.js";import"./empty-z8a03P5s.js";import"./chevron-right-CCGWm5Fy.js";import"./toString-DN6v_uzh.js";import"./empty-cell-Bc1WZ8Es.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(g=(d=i.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};const Re=["Loading","Default"];export{i as Default,s as Loading,Re as __namedExportsOrder,je as default};
