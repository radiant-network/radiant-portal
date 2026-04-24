import{j as t}from"./iframe-DuLG7CzE.js";import{h as o}from"./index-BZMh0cGY.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-BwNpL9Re.js";import{i as n,j as f,c as S}from"./data-table-XdEvuHhK.js";import{C,A as a}from"./applications-config-CsOtMLIq.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-CE8gAWQE.js";import{e as h}from"./table-mock-V4d-fNEq.js";import{B as R}from"./chunk-UVKPFVEO-By4fVI7q.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DcpGw4_y.js";import"./index-DcfDzLtM.js";import"./filter-button-DhEEdfDi.js";import"./badge-DEsup7aB.js";import"./separator-B9AcXafd.js";import"./index-Bx95i1qM.js";import"./x-BZVkhNqM.js";import"./button-CUsPlIo2.js";import"./action-button-CSEEgQHQ.js";import"./dropdown-menu-Cs2vU4HI.js";import"./index-BLyKH7C8.js";import"./circle-Ae1tqnjS.js";import"./check-BcUof3b6.js";import"./i18n-D2xdIxoW.js";import"./checkbox-cUwQosfl.js";import"./index-DF4eZRqh.js";import"./command-Dq2EPqSO.js";import"./dialog-BeOR5QbE.js";import"./popover-A1QAMwA2.js";import"./search-Dkvj4fFl.js";import"./skeleton-BaOZ8ww4.js";import"./test-tube-diagonal-0T54ntf-.js";import"./user-BwtCdIw5.js";import"./priority-indicator-D3lROzFO.js";import"./indicator-C27sAhSS.js";import"./shape-triangle-up-icon-BNnjkU-t.js";import"./refresh-ccw-CtGDAXpo.js";import"./pen-CMQI-z2f.js";import"./isEqual-BvrlOa81.js";import"./settings-eZ-Kp_uG.js";import"./number-format-BcrzLvmH.js";import"./card-CwRkWl-A.js";import"./pagination-DgG9kurb.js";import"./select-DbmdtNxm.js";import"./chevron-down-B3vol4Uq.js";import"./chevron-up-DUHKBHXy.js";import"./ellipsis-hZ1sAd3r.js";import"./empty-B9qz0cQN.js";import"./chevron-right-B8mHUlst.js";import"./toString-CFK_c3J8.js";import"./empty-cell-CeQ_lo5Z.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
