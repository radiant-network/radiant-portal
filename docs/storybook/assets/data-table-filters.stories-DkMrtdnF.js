import{j as t}from"./iframe-8oJ5Bgb6.js";import{h as o}from"./index-OTV_qfG9.js";import{i as b}from"./api-z4CtOsxY.js";import{F as u}from"./case-exploration-table-filters-DXVWkSGP.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-A7gt8PGM.js";import{C,A as a}from"./applications-config-DXnM4GfU.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-BcpkedXA.js";import{B as R}from"./chunk-UVKPFVEO-07MDkUHM.js";import"./preload-helper-Dp1pzeXC.js";import"./api-B8LeNhSf.js";import"./index-C1qHQxBp.js";import"./filter-button-CVMB3fdZ.js";import"./checkbox-filter-DdTILElM.js";import"./checkbox-CZEuzKXP.js";import"./index-ChRUWtUN.js";import"./check-CLsWVnhq.js";import"./label-q4eFVfi7.js";import"./index-DViiVEq-.js";import"./number-format-BhSrr_F9.js";import"./i18n-BUvQZllC.js";import"./badge-BNQh3XGV.js";import"./separator-DpObONvW.js";import"./x-D0roLtfc.js";import"./button-B-Vd7I7W.js";import"./action-button-CdU_izQK.js";import"./dropdown-menu-BT9qsx5b.js";import"./index-BeRE-8C-.js";import"./index-B7DGIYRL.js";import"./circle-CKypI8aC.js";import"./command-CwDSf9Le.js";import"./dialog-CmoIQ25K.js";import"./popover--t-0pc3_.js";import"./search-BsZbX4DC.js";import"./skeleton-DPHeHnr4.js";import"./test-tube-diagonal-CxLsUk0N.js";import"./user-DeXDa6Fl.js";import"./priority-indicator-sC1uyMSe.js";import"./indicator-CJVkYg06.js";import"./shape-triangle-up-icon-CU3lFUHh.js";import"./refresh-ccw-Dj4wDmOF.js";import"./pen-CyjW6ZWK.js";import"./empty-cell-CRGy7gUz.js";import"./settings-BBfc7Ko4.js";import"./card-BNqcGH8k.js";import"./pagination-xTxx8tQN.js";import"./select-BRCTKYPy.js";import"./chevron-down-BoFKDd_7.js";import"./chevron-up-B_nYX5Sx.js";import"./ellipsis-XJ8oGhIU.js";import"./empty-CSSx0ABu.js";import"./chevron-right-3Zq6KX9j.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
