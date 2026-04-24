import{j as t}from"./iframe-D3ZKxHJs.js";import{h as o}from"./index-Ce95vn82.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-Bd_AVkVl.js";import{i as n,j as f,c as S}from"./data-table-o6ZrVj69.js";import{C,A as a}from"./applications-config-CnAvkj2A.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case--ZJpeYf6.js";import{e as h}from"./table-mock-Cba-FIJV.js";import{B as R}from"./chunk-UVKPFVEO-Dc_nYDMB.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BJn1dIC3.js";import"./index-bdw0Ay8b.js";import"./filter-button-DxqcthDN.js";import"./badge-FY6gz-P2.js";import"./separator-5kXAEUjm.js";import"./index-DXpu_Qjs.js";import"./x-BlNvAiBq.js";import"./button-TDDuwAB5.js";import"./action-button-CnqmYrVW.js";import"./dropdown-menu-BCl5ZxF0.js";import"./index-BTMjI7dZ.js";import"./circle-Df4PbKtE.js";import"./check-2f44aGvh.js";import"./i18n-DCaXKU__.js";import"./checkbox-DsUNXZoW.js";import"./index-B0Wo0B32.js";import"./command-D4S7aJd9.js";import"./dialog-D5rQYTKl.js";import"./popover-DCmUcCTR.js";import"./search-DXcx1W-5.js";import"./skeleton-CxygE45k.js";import"./test-tube-diagonal-2ECcBCHa.js";import"./user-BACJU_HK.js";import"./priority-indicator-BoFqshNK.js";import"./indicator-BLzgcl1m.js";import"./shape-triangle-up-icon-BCJpckO2.js";import"./refresh-ccw-CS8nrhKr.js";import"./pen-CtstnYVJ.js";import"./isEqual-CSCvef68.js";import"./settings-I3PCxPAB.js";import"./number-format-DH2x4rdq.js";import"./card-CUzutd-c.js";import"./pagination-CfZtLIGm.js";import"./select--NjW1Olf.js";import"./chevron-down-sWF2RyMY.js";import"./chevron-up-Brqqzerk.js";import"./ellipsis-CFR7y5Ek.js";import"./empty-DIy24cVR.js";import"./chevron-right-DzHAzrGW.js";import"./toString-CJHq6rZ2.js";import"./empty-cell-CYlOYx9J.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
