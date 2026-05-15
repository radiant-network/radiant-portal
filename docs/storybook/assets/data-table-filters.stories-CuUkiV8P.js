import{j as t}from"./iframe-C32u87gm.js";import{h as o}from"./index-D7lGDHaR.js";import{h as b}from"./api-Bs_y-PxM.js";import{F as u}from"./case-exploration-table-filters-psJoyko0.js";import{Y as h,d as n,W as f,c as S}from"./table-mock-hQbahACt.js";import{C,A as a}from"./applications-config-N7CrK8vK.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-B1wUCpEz.js";import{B as R}from"./chunk-UVKPFVEO-CjU8cBCq.js";import"./preload-helper-Dp1pzeXC.js";import"./api-DuUXA6qw.js";import"./index-CFkO8CRi.js";import"./filter-button-DYFGL7P3.js";import"./badge-CauS9ao2.js";import"./separator-D_yl5Knm.js";import"./index-JkrvEebA.js";import"./x-VdsbSUnV.js";import"./button-CHdvMUM2.js";import"./action-button-C_0K-UsD.js";import"./dropdown-menu-BEKZzVwz.js";import"./index-Dxv0bq83.js";import"./circle-B_eMDar9.js";import"./check-Yi-N49Um.js";import"./i18n-CRB74Ovx.js";import"./checkbox-Dn8drLKu.js";import"./index-Z9UhENVQ.js";import"./command-CF_TENHl.js";import"./dialog-DENAIDOW.js";import"./popover-nlhTv1_z.js";import"./search-C442SBsB.js";import"./skeleton-DoJyjFU2.js";import"./test-tube-diagonal--mJMhQLn.js";import"./user-C2sf73Gq.js";import"./priority-indicator-UWYnSQhS.js";import"./indicator-CYUtqgjC.js";import"./shape-triangle-up-icon-CnkTPuqV.js";import"./refresh-ccw-DfKS8SPu.js";import"./pen-CzoAxyqb.js";import"./empty-cell-CUhm0egJ.js";import"./number-format-gL0oMKYl.js";import"./settings-DJqx22X6.js";import"./card-DdkC75ZM.js";import"./pagination-jPYoOTjs.js";import"./select-DfaP7D5T.js";import"./chevron-down-BXk5WD09.js";import"./chevron-up-PisxXSr2.js";import"./ellipsis-D0J4mZJl.js";import"./empty-DxeHE4eU.js";import"./chevron-right-Dl89HSx6.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ae={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(g=(d=i.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};const _e=["Loading","Default"];export{i as Default,s as Loading,_e as __namedExportsOrder,Ae as default};
