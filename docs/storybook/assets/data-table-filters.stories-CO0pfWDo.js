import{j as t}from"./iframe-BX_H28US.js";import{h as o}from"./index-CJCFJm6D.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-Cs9EWjKg.js";import{i as n,j as f,c as S}from"./data-table-BJ57zbmG.js";import{C,A as a}from"./applications-config-B4Mvk4_D.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-o6RrVUcN.js";import{e as h}from"./table-mock-CeGPUglG.js";import{B as R}from"./chunk-UVKPFVEO-rIM1Ocg2.js";import"./preload-helper-Dp1pzeXC.js";import"./index--qBWpLOj.js";import"./index-Ux9EvqIQ.js";import"./filter-button-0KleIIK8.js";import"./badge-Do-ReEmL.js";import"./separator-CcmEc_rg.js";import"./index-PQmHE6kT.js";import"./x-D37TTrg9.js";import"./button-CTEmQRZS.js";import"./action-button-BhEgzh5t.js";import"./dropdown-menu-D6VQIUJt.js";import"./index-DqhBjzfn.js";import"./circle-3EwZHy2z.js";import"./check-CIDnGo8R.js";import"./i18n-B3rA_Oxh.js";import"./checkbox-BZFSJasx.js";import"./index-B8JZUSl0.js";import"./command-B755Jxv5.js";import"./dialog-D0VoF7Wf.js";import"./popover-BJ0MhH-8.js";import"./search-OIbBVKiP.js";import"./skeleton-XjBTqXjC.js";import"./test-tube-diagonal-BCr9K5mf.js";import"./user-ow0h1WVM.js";import"./priority-indicator-BPsqt44v.js";import"./indicator-DErWKSvS.js";import"./shape-triangle-up-icon-CDuAJDl3.js";import"./refresh-ccw-Cr7hqKRL.js";import"./pen-3u0OkgeS.js";import"./isEqual-BvQO9eZa.js";import"./settings-ikscTWis.js";import"./number-format-B3NyS0FC.js";import"./card-DQnfvA1z.js";import"./pagination-C6tccZKZ.js";import"./select-BJDMT2ho.js";import"./chevron-down-Bh0mNI1e.js";import"./chevron-up-DH0zaYm8.js";import"./ellipsis-xhAL65Of.js";import"./empty-VHdi5W9b.js";import"./chevron-right-C5heAJ1q.js";import"./toString-Cj1dWR4W.js";import"./empty-cell-BlAiuEUZ.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
