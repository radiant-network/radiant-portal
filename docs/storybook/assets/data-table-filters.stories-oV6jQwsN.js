import{j as t}from"./iframe-BdVkGBhb.js";import{h as o}from"./index-DchZLEkY.js";import{j as b}from"./api-ok7Ado9G.js";import{F as u}from"./case-exploration-table-filters-D-EL5F7P.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-CxBJ_f6v.js";import{C,A as a}from"./applications-config-D4csJ2eF.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-B_N7qL28.js";import{B as R}from"./chunk-UVKPFVEO-tWcB6apz.js";import"./preload-helper-Dp1pzeXC.js";import"./api-0xi9nZz_.js";import"./index-9hkzsdBx.js";import"./filter-button-Lh1XS74h.js";import"./badge-YMPnDvZL.js";import"./separator-BYsloDMD.js";import"./index-BTAukcSu.js";import"./x-B7iw8ws4.js";import"./button-zA7C4LoZ.js";import"./action-button-CpRjOizG.js";import"./dropdown-menu-CzBsT1en.js";import"./index-xQ2ojJvx.js";import"./index-CNw0ArEG.js";import"./check-BIdY2e8D.js";import"./circle-B2j6O8ci.js";import"./i18n-C6QGtJ6I.js";import"./checkbox-PyaxhgVf.js";import"./index-OMV1b2KL.js";import"./command-NFjwagQp.js";import"./dialog-BSzskB7l.js";import"./popover-BNySdI4P.js";import"./search-DwesaQnS.js";import"./skeleton-DTOrDwyo.js";import"./test-tube-diagonal-f35jy7qM.js";import"./user-DHSAX0cr.js";import"./priority-indicator--_hnls2n.js";import"./indicator-DUvuE5Ed.js";import"./shape-triangle-up-icon-Bhg8LfWa.js";import"./refresh-ccw-C2EzedyZ.js";import"./pen-Cb9QfUqr.js";import"./empty-cell-BU5uggiA.js";import"./number-format-Bc5XstMk.js";import"./settings-CZtGiW8k.js";import"./card-DQvGPNS_.js";import"./pagination-DStwn0J2.js";import"./select-D5AO-1T1.js";import"./chevron-down-f1b2N7oj.js";import"./chevron-up-M5FQZrth.js";import"./ellipsis-NlPPM9j6.js";import"./empty-f16slOhT.js";import"./chevron-right-DW31Zhwv.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
