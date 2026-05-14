import{j as t}from"./iframe-z7Dw2yEo.js";import{h as o}from"./index-ZIkd-1PY.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-6JFOmHsp.js";import{i as n,j as f,c as S}from"./data-table-CkW45UN_.js";import{C,A as a}from"./applications-config-BpEObiuq.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-DWQzel2G.js";import{e as h}from"./table-mock-BjE7itll.js";import{B as R}from"./chunk-UVKPFVEO-BDyoUWDx.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DB_m_YK-.js";import"./index-inViOMC8.js";import"./filter-button-CFsEfnW1.js";import"./badge-CfNsdHaZ.js";import"./separator-Jx5y4MFq.js";import"./index-B8fyt2Zd.js";import"./x-CULrwAJu.js";import"./button-ClIBoGCL.js";import"./action-button-BAA5flkr.js";import"./dropdown-menu-D34uHAw7.js";import"./index-fQ2QfZk9.js";import"./circle-uKaMswnP.js";import"./check-BZIAGfC8.js";import"./i18n-Dbq9q9wy.js";import"./checkbox-5xAUsME2.js";import"./index-Cw5Guy9n.js";import"./command-Dk9INyNq.js";import"./dialog-Cj4g1KdP.js";import"./popover-COtOkM8z.js";import"./search-xOnS6iZ5.js";import"./skeleton-iVXHrWWd.js";import"./test-tube-diagonal-V1kyw2p_.js";import"./user-DNhgmhmI.js";import"./priority-indicator-OWOs5Iuu.js";import"./indicator-BTKbsiac.js";import"./shape-triangle-up-icon-C7Tk6cbV.js";import"./refresh-ccw-C-jadMhQ.js";import"./pen-CmTsZ0BL.js";import"./isEqual-CS5JVLYL.js";import"./settings-UmCYifpX.js";import"./number-format-2p5LQ5Zs.js";import"./card-DGZFswvS.js";import"./pagination-D3ficgix.js";import"./select-CQjguRJc.js";import"./chevron-down-D820UlJJ.js";import"./chevron-up-D9bCQPrZ.js";import"./ellipsis-CPnoIuNM.js";import"./empty-osDOC6G_.js";import"./chevron-right-BLcTE6xC.js";import"./toString-qSxR946B.js";import"./empty-cell-Dr4VX0TE.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
