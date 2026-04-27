import{j as t}from"./iframe-DwV05S1p.js";import{h as o}from"./index-667wyI37.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-tI8MCnlq.js";import{i as n,j as f,c as S}from"./data-table-DvBY7uhr.js";import{C,A as a}from"./applications-config-DqS3dtua.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-COtKfw0X.js";import{e as h}from"./table-mock-C0yyegy7.js";import{B as R}from"./chunk-UVKPFVEO-DFWAGR3r.js";import"./preload-helper-Dp1pzeXC.js";import"./index-t_PxXkqr.js";import"./index-BYBWrGsO.js";import"./filter-button-BqRtk_Iz.js";import"./badge-9GuH5Vee.js";import"./separator-2D9OjNsS.js";import"./index-DkT9bF_G.js";import"./x-9Wg0hLG2.js";import"./button-B7S8DAML.js";import"./action-button-rf34Jql5.js";import"./dropdown-menu-Do4rV8AK.js";import"./index-COwLubOi.js";import"./circle-CvSlO3OY.js";import"./check-DgSxBg-m.js";import"./i18n-BPwBx0U0.js";import"./checkbox-DejODIrw.js";import"./index-PaAAW_wt.js";import"./command-Bk9J3ZuN.js";import"./dialog-7cqMFS96.js";import"./popover-CA4OlOtt.js";import"./search-qJHFhVM_.js";import"./skeleton-BYBETL6I.js";import"./test-tube-diagonal-nNhrzZJ2.js";import"./user-DiktSTzs.js";import"./priority-indicator-Bsy0zD1z.js";import"./indicator-BGJmM0j9.js";import"./shape-triangle-up-icon-9rU1ymmi.js";import"./refresh-ccw-4DMYe0iH.js";import"./pen-DaCWKjVj.js";import"./isEqual-Cd1zjVRI.js";import"./settings-DZPrn2yI.js";import"./number-format--56ZN705.js";import"./card-DzSlTt4l.js";import"./pagination-DiZgPiC1.js";import"./select-DNciDb34.js";import"./chevron-down-BISPHTgS.js";import"./chevron-up-Ei7J-OVg.js";import"./ellipsis-BVDcT6kP.js";import"./empty-DFE9yhqE.js";import"./chevron-right-19xhmeLp.js";import"./toString-DqSdIFq_.js";import"./empty-cell-ENseGoN3.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
