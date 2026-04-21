import{j as t}from"./iframe-BWqcvn2Z.js";import{h as o}from"./index-CFFCyKfv.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-lcHXd4AM.js";import{i as n,j as f,c as S}from"./data-table-C7MinJsY.js";import{C,A as a}from"./applications-config-DR2_gbFI.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-DUc-i9OL.js";import{e as h}from"./table-mock-CjFboGro.js";import{B as R}from"./chunk-UVKPFVEO-DCwcs8tx.js";import"./preload-helper-Dp1pzeXC.js";import"./index-B_N018L2.js";import"./index-CBbFBGvb.js";import"./filter-button-DL8wSmA2.js";import"./badge-CvHzOJ4d.js";import"./separator-DUmh9lQt.js";import"./index-ph_9GgMk.js";import"./x-COCFdEgO.js";import"./button-D3sGKX_Z.js";import"./action-button-C1JStQtU.js";import"./dropdown-menu-MPz4kaiX.js";import"./index-C7kLeKX6.js";import"./circle-DAVwx1vN.js";import"./check-C60yrJGB.js";import"./i18n-BsR9IM21.js";import"./checkbox-BzcorjKR.js";import"./index-DaxPPz1N.js";import"./command-BSuI7zr6.js";import"./dialog-CM5CAHjK.js";import"./popover-DOIBY2uj.js";import"./search-D5kbuJbm.js";import"./skeleton-BbKpZDAf.js";import"./test-tube-diagonal-C5oag9wb.js";import"./user-BtTyRffv.js";import"./priority-indicator-DEPtRkAF.js";import"./indicator-CHuyLRrh.js";import"./shape-triangle-up-icon-Ckw_qTkz.js";import"./refresh-ccw-CMmseaHk.js";import"./pen-CTwnA6oe.js";import"./isEqual-B4IjXvKn.js";import"./settings-D2vFTLIH.js";import"./number-format-BazyHUMc.js";import"./card-DW9tq7Zw.js";import"./pagination-DfC8mL6Q.js";import"./select-Cm0VM8x9.js";import"./chevron-down-Dxg-0kmc.js";import"./chevron-up-DqW5euSo.js";import"./ellipsis-CJ_MhJ5e.js";import"./empty-CVKmdMcK.js";import"./chevron-right-b1fhOrjG.js";import"./toString-A8xd51ga.js";import"./empty-cell-BH1b2x6w.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
