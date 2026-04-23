import{j as t}from"./iframe-Dj1EhdxY.js";import{h as o}from"./index-CBUqKQoo.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-C75w9FzN.js";import{i as n,j as f,c as S}from"./data-table-DXQUFxor.js";import{C,A as a}from"./applications-config-BSgPevUl.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-C8lAev7J.js";import{e as h}from"./table-mock-DxhJ9iJ-.js";import{B as R}from"./chunk-UVKPFVEO-Bu3VX8oU.js";import"./preload-helper-Dp1pzeXC.js";import"./index-B_OU5C-b.js";import"./index-ItvYXoZP.js";import"./filter-button-DJQwRMwm.js";import"./badge-C8UIOan9.js";import"./separator-DCn6vp2V.js";import"./index-CA0VxJ_x.js";import"./x-LoDyUutm.js";import"./button-CnNl6qUT.js";import"./action-button-W9kIQkAi.js";import"./dropdown-menu-DOUrW6wp.js";import"./index-BYyS-IfE.js";import"./circle-CJJoUJA_.js";import"./check-iUNrf-Yk.js";import"./i18n-CuX3LWdj.js";import"./checkbox-B2VlGtNW.js";import"./index-89h3-bE2.js";import"./command-758VF0G2.js";import"./dialog-C2VnnG7v.js";import"./popover-Bk2kmw63.js";import"./search-BBQN4qgj.js";import"./skeleton-Bbny_jNe.js";import"./test-tube-diagonal-DbFoFut3.js";import"./user-BhcSfJ6T.js";import"./priority-indicator-d3ga9kk9.js";import"./indicator-BSg9NmXZ.js";import"./shape-triangle-up-icon-Bq3ezzIe.js";import"./refresh-ccw-Tm2IAmdP.js";import"./pen-Cm3TDx7b.js";import"./isEqual-B9Uj3Hdl.js";import"./settings-DQAzHTys.js";import"./number-format-BBwJjRQS.js";import"./card-CXNuFJHU.js";import"./pagination-B7hcyVeo.js";import"./select-DNar49F8.js";import"./chevron-down--xyvwk3k.js";import"./chevron-up-DSOn4OUP.js";import"./ellipsis-BZo8DTBV.js";import"./empty-CKwXIWvc.js";import"./chevron-right-9lu0_3aD.js";import"./toString-V51CU_bS.js";import"./empty-cell-B1l4hUmJ.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
