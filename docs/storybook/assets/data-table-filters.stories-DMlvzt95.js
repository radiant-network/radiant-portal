import{j as t}from"./iframe-s7mzBcxe.js";import{h as o}from"./index-CkkCN1wB.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-ByL1hezF.js";import{i as n,j as f,c as S}from"./data-table-DXDzwj51.js";import{C,A as a}from"./applications-config-Bhq8uM1T.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-CeFQqEk_.js";import{e as h}from"./table-mock-DgmGosYZ.js";import{B as R}from"./chunk-UVKPFVEO-DFffaY1n.js";import"./preload-helper-Dp1pzeXC.js";import"./index-EvTuZ_Ib.js";import"./index-D-HoTjHf.js";import"./filter-button-DFhtZaUI.js";import"./badge-C1I_PDJ7.js";import"./separator-1u5V84K1.js";import"./index-ZuuZi8tL.js";import"./x-ChbQ_swm.js";import"./button-a42Jp6lR.js";import"./action-button-qhDSyRDc.js";import"./dropdown-menu-C-WUw0Uv.js";import"./index-C0VM317R.js";import"./circle-DoraGt89.js";import"./check-BtaDGT8a.js";import"./i18n-WfuZEDOA.js";import"./checkbox-B5EFcts9.js";import"./index-C69x7x2t.js";import"./command-BTmK76oF.js";import"./dialog-B8D0oqEE.js";import"./popover-DJgS2eGO.js";import"./search-uwBUq053.js";import"./skeleton-CUB1xmkD.js";import"./test-tube-diagonal-Drb36RaO.js";import"./user-Bsf-7vNd.js";import"./priority-indicator-DoKemgnk.js";import"./indicator-CMJYP1uY.js";import"./shape-triangle-up-icon-Clz2hzXm.js";import"./refresh-ccw-CWQ1MkV7.js";import"./pen-BNiuOqa5.js";import"./isEqual-CWy0rffC.js";import"./settings-xqpC2tDk.js";import"./number-format-D1tFvMCF.js";import"./card-BcgpFHEU.js";import"./pagination-C4XtiR7l.js";import"./select-C7l1FhbC.js";import"./chevron-down-8GNft0lb.js";import"./chevron-up-DDHH-nSm.js";import"./ellipsis-bAWftV_O.js";import"./empty-xzYwkMYl.js";import"./chevron-right-DvH6gpvf.js";import"./toString-B96BqFnc.js";import"./empty-cell-C42kNwG9.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
