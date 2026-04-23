import{j as t}from"./iframe-DS1Fm7X-.js";import{h as o}from"./index-D2NCd5sN.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-Cc9z7Hfl.js";import{i as n,j as f,c as S}from"./data-table-CSn1Y-Kz.js";import{C,A as a}from"./applications-config-CAvQMD8t.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-B76yC_cT.js";import{e as h}from"./table-mock-BmBc4I8d.js";import{B as R}from"./chunk-UVKPFVEO-BOun_a4c.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BDQe4weP.js";import"./index-G9VYMG24.js";import"./filter-button-v-S3cUfS.js";import"./badge-CYXaLEwc.js";import"./separator-Du257jra.js";import"./index-BrVm3R5S.js";import"./x-DaBH8kTC.js";import"./button-BalFLK94.js";import"./action-button-h14xGsDw.js";import"./dropdown-menu-srrablED.js";import"./index-C_P4DlMj.js";import"./circle-BEjJTeaZ.js";import"./check-BaEquuuu.js";import"./i18n-D1vs1B9V.js";import"./checkbox-UMrVhe44.js";import"./index-6pVpfOYW.js";import"./command-DgL1_b_0.js";import"./dialog-DBmzyPfe.js";import"./popover-CLv6CZ_z.js";import"./search-DU1bMOy3.js";import"./skeleton-CI8ZB7Zg.js";import"./test-tube-diagonal-BFCO_EAA.js";import"./user-Dv-PNCDD.js";import"./priority-indicator-B9zopJyF.js";import"./indicator-CLV0831n.js";import"./shape-triangle-up-icon-CA38QVDq.js";import"./refresh-ccw-DKtj9xuF.js";import"./pen-D__UYlOl.js";import"./isEqual-EzALIiH5.js";import"./settings-CxtP-Q5i.js";import"./number-format-CY3KywcB.js";import"./card-BiPxMpjW.js";import"./pagination-CgzvAW_j.js";import"./select-Cl_J1rqV.js";import"./chevron-down-KFRs5tB2.js";import"./chevron-up-DPZVBEYh.js";import"./ellipsis-DjvH-Xit.js";import"./empty-CeFbJJRw.js";import"./chevron-right-RCHjtAy6.js";import"./toString-BnzgJPxf.js";import"./empty-cell-CSILAUBF.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
