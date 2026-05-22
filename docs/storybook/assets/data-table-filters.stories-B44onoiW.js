import{j as t}from"./iframe-Dzwv78Bp.js";import{h as o}from"./index-DEILsLBg.js";import{i as b}from"./api-QmR3WP_i.js";import{F as u}from"./case-exploration-table-filters-o9EH4mAC.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-Bqqi6brW.js";import{C,A as a}from"./applications-config-QWYOaqQq.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-D9DW11ap.js";import{B as R}from"./chunk-UVKPFVEO-jqB1vfaj.js";import"./preload-helper-Dp1pzeXC.js";import"./api-D7SqW33s.js";import"./index-WGxN0cRA.js";import"./filter-button-Dl5J7HzA.js";import"./badge-GGvCLCoa.js";import"./separator-Djq5tUIi.js";import"./index-Suri5pS-.js";import"./x-EMA4gmcI.js";import"./button-DIhskbJm.js";import"./action-button-BaF3hCn4.js";import"./dropdown-menu-B4YXM0X2.js";import"./index-D04D1SM5.js";import"./index-3KXOzHs5.js";import"./check-CHkQSgYo.js";import"./circle-BgwRz-U6.js";import"./i18n-DoiwY1e4.js";import"./checkbox-B6OiTMKH.js";import"./index-eqoZ2X6v.js";import"./command-BEPf_H5S.js";import"./dialog-BDpKshSv.js";import"./popover-C9A8TShE.js";import"./search-BiUM9Yok.js";import"./skeleton-DS8wH2sb.js";import"./test-tube-diagonal-qpY9QYcv.js";import"./user-8hY7iZf1.js";import"./priority-indicator-KXTNJnNp.js";import"./indicator-HsgbJzus.js";import"./shape-triangle-up-icon-BfDhwO44.js";import"./refresh-ccw-DYBr2B2r.js";import"./pen-BlGi3WlT.js";import"./empty-cell-Cp0J_4gc.js";import"./number-format-jhEsWPbj.js";import"./settings-Bu6GAXPI.js";import"./card-1P5gRuJ3.js";import"./pagination-BMyX_2ZS.js";import"./select-AmwDwDE5.js";import"./chevron-down-CUKBwDiW.js";import"./chevron-up-vZdltCfQ.js";import"./ellipsis-Dp0Q223J.js";import"./empty-CT-alUyL.js";import"./chevron-right-FRk7Ee5p.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
