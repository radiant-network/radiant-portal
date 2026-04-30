import{j as t}from"./iframe-gmiDgu1c.js";import{h as o}from"./index-CdbfSU4P.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-DLLun-2U.js";import{i as n,j as f,c as S}from"./data-table-CBEjiTW5.js";import{C,A as a}from"./applications-config-BcCM8Oqm.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-U5DhuWoB.js";import{e as h}from"./table-mock-C69w2-__.js";import{B as R}from"./chunk-UVKPFVEO-DJVFJ1pE.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BMcbbzoS.js";import"./index-CaNvVg1r.js";import"./filter-button-yoOy7ZvK.js";import"./badge-D9bEfFcc.js";import"./separator-DalGvlbi.js";import"./index-3Olvjq6T.js";import"./x-B-mOHMEI.js";import"./button-BX2ZKidd.js";import"./action-button-CKZPd9kW.js";import"./dropdown-menu-PjMB9ssW.js";import"./index-BeMHaXtW.js";import"./circle-BTv5cleQ.js";import"./check-7YBwiBas.js";import"./i18n-DeUng5Jc.js";import"./checkbox-Dyfn8YRI.js";import"./index-BQctarfo.js";import"./command-Bpk5SHng.js";import"./dialog-BGdW-hxV.js";import"./popover-Dq2Ao6bK.js";import"./search-BhXZkdXK.js";import"./skeleton-DsOhK4wx.js";import"./test-tube-diagonal-CC_uenHz.js";import"./user-CAkAv2dj.js";import"./priority-indicator-C-nZyFA6.js";import"./indicator-CCIlQyRG.js";import"./shape-triangle-up-icon-CmG2mhCX.js";import"./refresh-ccw-C1yj8vVX.js";import"./pen-sQcPSUdR.js";import"./isEqual-C_7MZ38L.js";import"./settings-kesnw6tx.js";import"./number-format-BypcUwgO.js";import"./card-D4DOzcyY.js";import"./pagination-BtBMiM5J.js";import"./select-DR9J-cxU.js";import"./chevron-down-DjcNFFu6.js";import"./chevron-up-DGSsySyr.js";import"./ellipsis-Cy_dMc7I.js";import"./empty-B1h-kI8j.js";import"./chevron-right-CKN7ix52.js";import"./toString-C1Kdv1FI.js";import"./empty-cell-D1VbUyvH.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
