import{j as t}from"./iframe-LZxw1Sce.js";import{h as o}from"./index-CHYznW0Y.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-BEhntcpE.js";import{i as n,j as f,c as S}from"./data-table-BX5QWNuo.js";import{C,A as a}from"./applications-config-Zu7qPbrL.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-DSFP2p-M.js";import{e as h}from"./table-mock-m7nl1qZV.js";import{B as R}from"./chunk-UVKPFVEO-BvRXkSDK.js";import"./preload-helper-Dp1pzeXC.js";import"./index-HkE2UHPC.js";import"./index-6y6Ym7X3.js";import"./filter-button-Cn4S4j-J.js";import"./badge-D8ve5RSA.js";import"./separator-Ct7RDAuq.js";import"./index-B3nxzM2N.js";import"./x-1qnFNbOG.js";import"./button-ZEO7G-oa.js";import"./action-button-tVl7N9pb.js";import"./dropdown-menu-BIZOSzOL.js";import"./index-CmwpAufl.js";import"./circle-BIuD_Wmh.js";import"./check-ChiQQ04F.js";import"./i18n-CRH4VMgz.js";import"./checkbox-Cgjvb9bm.js";import"./index-Dm9NEt_e.js";import"./command-tqDIrj3H.js";import"./dialog-D7YNLKQG.js";import"./popover-DQK09wUC.js";import"./search-DTpeyaE4.js";import"./skeleton-DLU4Cg_5.js";import"./test-tube-diagonal-Dwu3jYPC.js";import"./user-DkrodwpU.js";import"./priority-indicator-36NKvd4f.js";import"./indicator-DkHoGjqa.js";import"./shape-triangle-up-icon-DUptY-Le.js";import"./refresh-ccw-DVpCKmlM.js";import"./pen-j33wBU4S.js";import"./isEqual-B9KAl9c8.js";import"./settings-BtP8J9F5.js";import"./number-format-BJZKZoT9.js";import"./card-CxXW6MDp.js";import"./pagination-BK77VcGJ.js";import"./select-BUn2oRXc.js";import"./chevron-down-DV60CN8z.js";import"./chevron-up-DSdgVOwr.js";import"./ellipsis-dOTsTrbz.js";import"./empty-D_SC1or2.js";import"./chevron-right-CdMH13ua.js";import"./toString-w47_9wBl.js";import"./empty-cell-Db3zdR-G.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
