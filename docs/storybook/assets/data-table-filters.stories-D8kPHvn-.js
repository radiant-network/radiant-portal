import{j as t}from"./iframe-Dr9x6mQx.js";import{h as o}from"./index-Db5hD_hb.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-B7VYMGcl.js";import{i as n,j as f,c as S}from"./data-table-DX8Hgug4.js";import{C,A as a}from"./applications-config-CTgO1qkW.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-CAkxApPJ.js";import{e as h}from"./table-mock-CfwpVnyn.js";import{B as R}from"./chunk-UVKPFVEO-DXEUQynV.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BBnjLdF2.js";import"./index-Du8NBqAe.js";import"./filter-button-DXMfmXzA.js";import"./badge-yLQX7s-w.js";import"./separator-D3otn-XU.js";import"./index-BHKU5Ijs.js";import"./x-DmpMu-yl.js";import"./button-HmsxO3Ae.js";import"./action-button-bDe2qQpJ.js";import"./dropdown-menu-DAPRerj4.js";import"./index-yA5mLXh0.js";import"./circle-t1HCDkOk.js";import"./check-BWuTIYYw.js";import"./i18n-CT3iXY35.js";import"./checkbox-Hp_05HUH.js";import"./index-CPQp7VrW.js";import"./command-BDJiW7JB.js";import"./dialog-BgoSfCND.js";import"./popover-DWvrI5Vv.js";import"./search-ssNcSdPW.js";import"./skeleton-BHzGGIW7.js";import"./test-tube-diagonal-C5gSELMJ.js";import"./user-BeVhE33J.js";import"./priority-indicator-F-3yBuq6.js";import"./indicator-Cj06oRq-.js";import"./shape-triangle-up-icon-D7-F0i9Z.js";import"./refresh-ccw-C_Il2q9h.js";import"./pen-DXYIl0VJ.js";import"./isEqual-D3-jNiM-.js";import"./settings-DfkQAjeT.js";import"./number-format-6t6umLhu.js";import"./card-D0Dd0E8d.js";import"./pagination-DFqrquAk.js";import"./select-DOaPCUxo.js";import"./chevron-down-DALl7_ih.js";import"./chevron-up-DdTzK6hq.js";import"./ellipsis-DOZQbjMh.js";import"./empty-m8WgPg4L.js";import"./chevron-right-CykjIAw5.js";import"./toString-B-dfQU8X.js";import"./empty-cell-s07l-OG0.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
