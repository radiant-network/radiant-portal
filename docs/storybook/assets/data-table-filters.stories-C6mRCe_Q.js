import{j as t}from"./iframe-CC3okCGT.js";import{h as o}from"./index-BOeHozge.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-PpRd9A55.js";import{i as n,j as f,c as S}from"./data-table-C2iyZQmQ.js";import{C,A as a}from"./applications-config-nl_AZLln.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-QK8bbnzA.js";import{e as h}from"./table-mock-Dup4h0qq.js";import{B as R}from"./chunk-UVKPFVEO-lZ6Bhn0Z.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CCvzafUf.js";import"./index-BujmIhY5.js";import"./filter-button-BXwqd0ZJ.js";import"./badge-DUzyFGs-.js";import"./separator-CVrfIWXe.js";import"./index-CI2EdHUh.js";import"./x-D7KHn17J.js";import"./button-CR90hCpk.js";import"./action-button-C8uRw4WS.js";import"./dropdown-menu-6lmR3GsJ.js";import"./index-DZ795Gl-.js";import"./circle-wakmw5sg.js";import"./check-C9Wpo2F7.js";import"./i18n-D-9Z-LDF.js";import"./checkbox-DvHhDjw8.js";import"./index-CvfbPFIh.js";import"./command-DEmcUZyj.js";import"./dialog-Ddwv5O9G.js";import"./popover-COWe-quM.js";import"./search-D6SXPaga.js";import"./skeleton-Cj0b9RZ1.js";import"./test-tube-diagonal-CVfGoing.js";import"./user-CBY1wowu.js";import"./priority-indicator-Dc8ZNYdk.js";import"./indicator-DIFHwSQa.js";import"./shape-triangle-up-icon-D7L9OPVX.js";import"./refresh-ccw-B6iVtL95.js";import"./pen-YYVVEVH2.js";import"./isEqual-Dag9qg48.js";import"./settings-BRKuuNmz.js";import"./number-format-Cx4oShtt.js";import"./card-NQZEYPji.js";import"./pagination-MUO2cnia.js";import"./select-Bg4JaDbr.js";import"./chevron-down-CyZo-mep.js";import"./chevron-up-B4-pzzqt.js";import"./ellipsis--FTe7yNc.js";import"./empty-Hmgd-U3H.js";import"./chevron-right-CVeLgRKX.js";import"./toString-CtXg2abA.js";import"./empty-cell-BFgzikxB.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
