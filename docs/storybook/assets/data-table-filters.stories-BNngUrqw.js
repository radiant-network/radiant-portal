import{j as t}from"./iframe-DfgdpvDy.js";import{h as o}from"./index-DuH6oA2J.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-Dnslm8nn.js";import{i as n,j as f,c as S}from"./data-table-BGULJnGh.js";import{C,A as a}from"./applications-config-CeMNs4ZM.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-D-IQiWqA.js";import{e as h}from"./table-mock-i1wRk1F2.js";import{B as R}from"./chunk-UVKPFVEO-C-4Z6PJ7.js";import"./preload-helper-Dp1pzeXC.js";import"./index-LrEBtdA4.js";import"./index-C4cG6e1X.js";import"./filter-button-AqKmvn1G.js";import"./badge-px502uIo.js";import"./separator-DWAdfc4r.js";import"./index-3TtbwYEr.js";import"./x-_83Eiiaz.js";import"./button-S29konld.js";import"./action-button-D_Te2GbG.js";import"./dropdown-menu-BaKt79Rv.js";import"./index-CNrO1tSM.js";import"./circle-9qwTVLq_.js";import"./check-BIfSfgN8.js";import"./i18n-C0orBQKY.js";import"./checkbox-BoiZXyQg.js";import"./index-tqbNY4rp.js";import"./command-BNmp1EJ4.js";import"./dialog-90SqhC9u.js";import"./popover-ByIGnS3p.js";import"./search-Dco21Zxy.js";import"./skeleton-Did1HZ8j.js";import"./test-tube-diagonal-DziOFgKa.js";import"./user-OVK5zYY2.js";import"./priority-indicator-Dxt3Fipn.js";import"./indicator-w5aGzWET.js";import"./shape-triangle-up-icon-C-4P1rKn.js";import"./refresh-ccw-DTlutZp0.js";import"./pen-pqIuQRCB.js";import"./isEqual-DMfivKSS.js";import"./settings-C6a2-Sx8.js";import"./number-format-CaUf2af4.js";import"./card-De--ZgCO.js";import"./pagination-B1DbOwXZ.js";import"./select-DBdiB-zF.js";import"./chevron-down-DuT4jepO.js";import"./chevron-up-DuSbCUYF.js";import"./ellipsis-BfXu_YcV.js";import"./empty-BOuHnNii.js";import"./chevron-right-Ct1mOK22.js";import"./toString-BRgz1vM1.js";import"./empty-cell-Ai9hlnX8.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
