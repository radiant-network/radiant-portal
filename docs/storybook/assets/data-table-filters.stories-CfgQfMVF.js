import{j as t}from"./iframe-DeENhpj3.js";import{h as o}from"./index-BvaKqaQf.js";import{h as b}from"./api-Bs_y-PxM.js";import{F as u}from"./case-exploration-table-filters-BEVu-fiq.js";import{Y as h,d as n,W as f,c as S}from"./table-mock-Bci1xYyE.js";import{C,A as a}from"./applications-config-BQUbp24P.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-_9tenF3l.js";import{B as R}from"./chunk-UVKPFVEO-BkFm6zil.js";import"./preload-helper-Dp1pzeXC.js";import"./api-C7CiEJth.js";import"./index-CgNcgPkP.js";import"./filter-button-D0Dqlde9.js";import"./badge-vXXG5nS1.js";import"./separator-C8pgrcu4.js";import"./index-liVuYvd_.js";import"./x-DzPdeYpW.js";import"./button-BwLNUtrw.js";import"./action-button-CEuUK9Kv.js";import"./dropdown-menu-omAR5gxl.js";import"./index-BuDD1aRJ.js";import"./circle-ChnPvBa0.js";import"./check-DsCd6nqT.js";import"./i18n-03jszPOH.js";import"./checkbox-C7z2Wbqq.js";import"./index-DGj2VtE3.js";import"./command-BzzjxYhX.js";import"./dialog-NtX3xKAK.js";import"./popover-CXqlfpGv.js";import"./search-DsQc_i_X.js";import"./skeleton-Can_aXr6.js";import"./test-tube-diagonal-mDVGcD4X.js";import"./user-0xJHaQTV.js";import"./priority-indicator-B6jVmqd3.js";import"./indicator-DV-OsY24.js";import"./shape-triangle-up-icon-hMVECpzp.js";import"./refresh-ccw-DmeBkhDy.js";import"./pen-Zvxr_EEn.js";import"./empty-cell-YotDlUlY.js";import"./number-format-f9CX69Nl.js";import"./settings-CmW7jVsh.js";import"./card-BzTKdP3m.js";import"./pagination-HSYNYzap.js";import"./select-CiwzD5pg.js";import"./chevron-down-ClU3QIo5.js";import"./chevron-up-BnNIRBqW.js";import"./ellipsis-CmwRihJm.js";import"./empty-Beu4YHhO.js";import"./chevron-right-I1pMpeVX.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ae={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
