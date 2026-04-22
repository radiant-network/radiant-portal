import{j as t}from"./iframe-wQ3-hBIM.js";import{h as o}from"./index-DDWG9vJi.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-Bcf15PrL.js";import{i as n,j as f,c as S}from"./data-table-8fWwJY6S.js";import{C,A as a}from"./applications-config-DvUMgcKR.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-CyhrMSfB.js";import{e as h}from"./table-mock-DC5QF3ox.js";import{B as R}from"./chunk-UVKPFVEO-3nshXwu1.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DRI0-15e.js";import"./index-oqEa9vOT.js";import"./filter-button-BeMAa9ZI.js";import"./badge-C9Z5KNy9.js";import"./separator-Bh0CWtfy.js";import"./index-BdVk7Sny.js";import"./x-DnmVtlj1.js";import"./button-Bj2KR2dc.js";import"./action-button-Txs2q945.js";import"./dropdown-menu-6JkKY-VA.js";import"./index-DAyLWoxP.js";import"./circle-Bq7GqULo.js";import"./check-BTt_u77A.js";import"./i18n-CWvWXk2X.js";import"./checkbox-B2Mb8doK.js";import"./index-CBc7m1Ky.js";import"./command-Dl6lWDIe.js";import"./dialog-BAEcAps4.js";import"./popover-B0a12XyL.js";import"./search-BmUvyBxu.js";import"./skeleton-DtNikeOp.js";import"./test-tube-diagonal-DQDKd50f.js";import"./user-BkHu3YRk.js";import"./priority-indicator-DR6t3jWX.js";import"./indicator-8F57xbFT.js";import"./shape-triangle-up-icon-CWyB0FMk.js";import"./refresh-ccw-osz4JXjc.js";import"./pen-DMpoNcRX.js";import"./isEqual-D1OjgE1l.js";import"./settings-Cb10c28M.js";import"./number-format-CUOT9fQQ.js";import"./card-BF-JLdQu.js";import"./pagination-ajk9cjVe.js";import"./select-CZKYRKe1.js";import"./chevron-down-Dysn-rlS.js";import"./chevron-up-qX2GRJo-.js";import"./ellipsis-_yJolYRV.js";import"./empty-D8d3Ou8U.js";import"./chevron-right-DgafNYh1.js";import"./toString-CdbWFnF5.js";import"./empty-cell-BHUOurw7.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
