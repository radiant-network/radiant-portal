import{j as t}from"./iframe-BmGXa3-X.js";import{h as o}from"./index-DK66HcqW.js";import{i as b}from"./api-QmR3WP_i.js";import{F as u}from"./case-exploration-table-filters-_II7ubtF.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-DZvP8Y_P.js";import{C,A as a}from"./applications-config-BqpPbBAn.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-DBT6ia4A.js";import{B as R}from"./chunk-UVKPFVEO-DyoJ0mNg.js";import"./preload-helper-Dp1pzeXC.js";import"./api-CaapTjG0.js";import"./index-BzxUydVe.js";import"./filter-button-CWHwKqD0.js";import"./badge-DS_iAC-n.js";import"./separator-ACzPuug0.js";import"./index-D50K9r0m.js";import"./x-CxdibXDu.js";import"./button-D3gglFwF.js";import"./action-button-CpjBn32O.js";import"./dropdown-menu-C7jK4Cbw.js";import"./index-DHPhzIhz.js";import"./index-Dr9b5RjJ.js";import"./check-CGXxJ1mv.js";import"./circle-DlZirWGW.js";import"./i18n-CIi-bBZn.js";import"./checkbox-De4vPX4r.js";import"./index-1J2BZuBE.js";import"./command-0dW-P-D6.js";import"./dialog-CtuW4eYT.js";import"./popover-CqPtME_M.js";import"./search-Bis8MSxL.js";import"./skeleton-DfNQFgFp.js";import"./test-tube-diagonal-Dm5MGSh6.js";import"./user-C027W5G4.js";import"./priority-indicator-ORnms_5d.js";import"./indicator-DJMtwFtS.js";import"./shape-triangle-up-icon-rWbawJcF.js";import"./refresh-ccw-DJOBhYkl.js";import"./pen-BvscX-IR.js";import"./empty-cell-B0DStQ6v.js";import"./number-format-WxhZyVJ9.js";import"./settings-DZMr4a6m.js";import"./card-BMli6MHa.js";import"./pagination-Co2hYUf9.js";import"./select-BHzIaUBT.js";import"./chevron-down-CfnLQuyB.js";import"./chevron-up-BrBje4Fj.js";import"./ellipsis-Bucc8VKM.js";import"./empty-DWgQB_Lf.js";import"./chevron-right-zfJrLzO6.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
