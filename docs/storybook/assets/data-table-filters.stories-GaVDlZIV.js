import{j as t}from"./iframe-BnhjNFOh.js";import{h as o}from"./index-DCYfCeTI.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-D_YShiIW.js";import{i as n,j as f,c as S}from"./data-table-ChI_XURV.js";import{C,A as a}from"./applications-config-DJ0L5svg.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-eaPhQ98I.js";import{e as h}from"./table-mock-CXPNotW2.js";import{B as R}from"./chunk-UVKPFVEO-5LvaRrcg.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BneP6Gfp.js";import"./index-DPU7ePy0.js";import"./filter-button-DpnP9yIJ.js";import"./badge-BOGoVxh5.js";import"./separator-B7WHZjk7.js";import"./index-B_TnZ6Np.js";import"./x-D7ocP_V2.js";import"./button-Bf___iVz.js";import"./action-button-9l21L4qf.js";import"./dropdown-menu-BpLbmaEh.js";import"./index-BiPK5MjX.js";import"./circle-DLWsm5xp.js";import"./check-CDufVTAT.js";import"./i18n-DXfzEXk-.js";import"./checkbox-aadGeNmD.js";import"./index-Bz-sYuA0.js";import"./command-Ct-Bmsd7.js";import"./dialog-CbPt-ZG6.js";import"./popover-BEtRfJW2.js";import"./search-DbWrFe_D.js";import"./skeleton-9d3sL9uE.js";import"./test-tube-diagonal-DiH00POC.js";import"./user-bgENJesE.js";import"./priority-indicator-C1z1k51O.js";import"./indicator-BSnIJApz.js";import"./shape-triangle-up-icon-71X-q1wO.js";import"./refresh-ccw-ChdMM2Re.js";import"./pen-DsDY3BCF.js";import"./isEqual-OYVNUOxD.js";import"./settings-Zw4BGvs4.js";import"./number-format-J48eD_y1.js";import"./card-B0kICtlZ.js";import"./pagination-DiwJGHmb.js";import"./select-CdmAcWEM.js";import"./chevron-down-CCjGC3b_.js";import"./chevron-up-tzZV-v_B.js";import"./ellipsis-bHeeho-9.js";import"./empty-uy_Bu8mk.js";import"./chevron-right-Cie91Wzz.js";import"./toString-Bi1OzHtA.js";import"./empty-cell-DTEGHTQI.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
