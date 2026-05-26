import{j as t}from"./iframe-BMmvtocU.js";import{h as o}from"./index-DZrBA7M6.js";import{j as b}from"./api-ok7Ado9G.js";import{F as u}from"./case-exploration-table-filters-BObyDah1.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-CutbkTZR.js";import{C,A as a}from"./applications-config-BeMSSwup.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-DAICUhpH.js";import{B as R}from"./chunk-UVKPFVEO-DGZ2lJlk.js";import"./preload-helper-Dp1pzeXC.js";import"./api-B57KDXZZ.js";import"./index-BnWb3yN2.js";import"./filter-button-BU7wRqJ_.js";import"./badge-BZLTWEUC.js";import"./separator-BAKSPgpP.js";import"./index-BAUOvQzI.js";import"./x-DyklLSqf.js";import"./button-BgN65zCs.js";import"./action-button-CnEND6xO.js";import"./dropdown-menu-Dzp6mXEX.js";import"./index-CQojPjL1.js";import"./index-BBNMNgiS.js";import"./check-B-1euD6L.js";import"./circle-B83bx6JB.js";import"./i18n-BJ1E6iAL.js";import"./checkbox-CfXpz3Yx.js";import"./index-Cc1uA-gH.js";import"./command-DCkgrES2.js";import"./dialog-D1Nm2JZm.js";import"./popover-DSj-VifV.js";import"./search-D8tEz4kI.js";import"./skeleton-BhUZz6Mt.js";import"./test-tube-diagonal-C-mBChmZ.js";import"./user-3PL_DmGz.js";import"./priority-indicator-DUazjG4h.js";import"./indicator-Do22wB7t.js";import"./shape-triangle-up-icon-DFq78rsE.js";import"./refresh-ccw-f2cFU5R-.js";import"./pen-CJoVc2Zn.js";import"./empty-cell-BRAF1f3k.js";import"./number-format-BQa7IEPp.js";import"./settings-BkPQkS4z.js";import"./card-DoOMl9FY.js";import"./pagination-BrwMbosF.js";import"./select-BZ7Jsnta.js";import"./chevron-down-D2FjjRIn.js";import"./chevron-up-CXk4qng_.js";import"./ellipsis-CKgLMGm8.js";import"./empty-nN4UwaPN.js";import"./chevron-right-JL_BTzSe.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
