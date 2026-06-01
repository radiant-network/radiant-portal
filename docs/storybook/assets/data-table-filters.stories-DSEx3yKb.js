import{j as t}from"./iframe-Dazgu-xC.js";import{h as o}from"./index-_V58G7Gw.js";import{i as b}from"./api-Bvp-Hr8F.js";import{F as u}from"./case-exploration-table-filters-BMe43iQA.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-YO63hiLF.js";import{C,A as a}from"./applications-config-BtxFDTb-.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-BN7NSHhg.js";import{B as R}from"./chunk-UVKPFVEO-CBqCeUQh.js";import"./preload-helper-Dp1pzeXC.js";import"./api-BVEA3X-S.js";import"./index-B3HPNJL0.js";import"./filter-button-kwJA0vuv.js";import"./checkbox-filter-BdrkQbN6.js";import"./checkbox-DwIg2Wk7.js";import"./index-CwEq_5Lw.js";import"./check-CzryUxBS.js";import"./label-5Mi_LwNg.js";import"./index-Aj7YrDzF.js";import"./number-format-CuvLnv2_.js";import"./i18n-CWqrHIWh.js";import"./badge-6FQg4oHf.js";import"./separator-uwq_OMO5.js";import"./x-CKsu-GPn.js";import"./button-8J658wd4.js";import"./action-button-BfMVkXo8.js";import"./dropdown-menu-CUwMNzYL.js";import"./index-DQ2PnqWf.js";import"./index-6Lx37dYF.js";import"./circle-CZgbCMc1.js";import"./command-DYkhM0KC.js";import"./dialog-Di7D3E91.js";import"./popover-BjOmwFyM.js";import"./search-C2nzWrMS.js";import"./skeleton-1JU-3uDe.js";import"./test-tube-diagonal-DfPL4NDn.js";import"./user-CmX3iciL.js";import"./priority-indicator-fIoHsidJ.js";import"./indicator-rsOiEHH1.js";import"./shape-triangle-up-icon-KxFOEey-.js";import"./refresh-ccw-9y2K60Hi.js";import"./pen-DC3gG1fB.js";import"./empty-cell-efEp--Jk.js";import"./settings-I3W2N82n.js";import"./card-CTJd6gdd.js";import"./pagination-CJ1BvT5p.js";import"./select-Dp9aO5c8.js";import"./chevron-down-D7GBntPE.js";import"./chevron-up-B11Buq__.js";import"./ellipsis-Csr7zLxu.js";import"./empty-CJuvPiGU.js";import"./chevron-right-qRQ5vx2N.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
