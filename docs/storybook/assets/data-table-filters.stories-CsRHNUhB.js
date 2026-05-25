import{j as t}from"./iframe-C0iLOhhN.js";import{h as o}from"./index-rSYZwri4.js";import{i as b}from"./api-QmR3WP_i.js";import{F as u}from"./case-exploration-table-filters-IKmrnbsB.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-FKqgV1_K.js";import{C,A as a}from"./applications-config-DgxAA6zS.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-Ck0Ai6Aq.js";import{B as R}from"./chunk-UVKPFVEO-DRsH6O0b.js";import"./preload-helper-Dp1pzeXC.js";import"./api-uUDyMK4x.js";import"./index-BlYLXJEb.js";import"./filter-button-Bn4FxxZB.js";import"./badge-CWR_bMGP.js";import"./separator-LozKfEm5.js";import"./index-kyNJ1CnW.js";import"./x-RVTHyxVY.js";import"./button-CNjl8yW6.js";import"./action-button-8mTLY66a.js";import"./dropdown-menu-BGUmaoIM.js";import"./index-Df3PTcw5.js";import"./index-DkANzGOx.js";import"./check-svrqvj4s.js";import"./circle-BLSR2qOI.js";import"./i18n-D8IvajwH.js";import"./checkbox-BqqSB64o.js";import"./index-DiDABfS8.js";import"./command-GCFyXgFy.js";import"./dialog-B41cyKg7.js";import"./popover-CYozt4Pw.js";import"./search-CIj10gK-.js";import"./skeleton-BMSmKVtD.js";import"./test-tube-diagonal-BuEVDUlv.js";import"./user-CSOF1f3r.js";import"./priority-indicator-B-Az4F2J.js";import"./indicator-B-lofVDy.js";import"./shape-triangle-up-icon-DV5qbeSu.js";import"./refresh-ccw-Cx4YtWOg.js";import"./pen-WySKXGjB.js";import"./empty-cell-DOWHPlVV.js";import"./number-format-B28r6xup.js";import"./settings-mqFXPUIH.js";import"./card-CFGgxiZd.js";import"./pagination-D7DhoZF7.js";import"./select-CYcUzMD_.js";import"./chevron-down-Dy5ufkBh.js";import"./chevron-up-DtNTBrz5.js";import"./ellipsis-fs2VMDZT.js";import"./empty-BYrxmQB6.js";import"./chevron-right-CRElnX3n.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
