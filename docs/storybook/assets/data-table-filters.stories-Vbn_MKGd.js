import{j as t}from"./iframe-DPCX_vyO.js";import{h as o}from"./index-DpNATUyD.js";import{h as b}from"./api-8Q83AOwn.js";import{F as u}from"./case-exploration-table-filters-DQfJ8Dil.js";import{Y as h,d as n,W as f,c as S}from"./table-mock-8QfHwlu6.js";import{C,A as a}from"./applications-config-D3m0Bzir.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-DQPo-ARR.js";import{B as R}from"./chunk-UVKPFVEO-B3d5HzQh.js";import"./preload-helper-Dp1pzeXC.js";import"./api-CLexyRe_.js";import"./index-DWJAa04P.js";import"./filter-button-BqOdy_D4.js";import"./badge-BlW6JO2A.js";import"./separator-DG3bXgVX.js";import"./index-DBmHguou.js";import"./x-DQKG1W33.js";import"./button-DGbd45qr.js";import"./action-button-B2f6sewW.js";import"./dropdown-menu-Do2hewv7.js";import"./index-Bz-Twzm4.js";import"./index-4f4sMJQ-.js";import"./check-Cva_u8Wi.js";import"./circle-_vVbOuMs.js";import"./i18n-B5rlBJwG.js";import"./checkbox-BDYjf83J.js";import"./index-Ca3k538o.js";import"./command-B3zvLt5U.js";import"./dialog-BSwAM0iu.js";import"./popover-Bm69QTgr.js";import"./search-BcomuqnQ.js";import"./skeleton-DOKN9Rap.js";import"./test-tube-diagonal-BO1A8_y9.js";import"./user-Dyw3SNkK.js";import"./priority-indicator-DHckGUqT.js";import"./indicator-B5V5nDIS.js";import"./shape-triangle-up-icon-BYvOAFRR.js";import"./refresh-ccw-BKRBmyn6.js";import"./pen-C2L4BvBc.js";import"./empty-cell-BnZarn9U.js";import"./number-format-CZvtHjrp.js";import"./settings--MZiHVZp.js";import"./card-lSPRXl_P.js";import"./pagination-CgXNp5bv.js";import"./select-D_IT3zhC.js";import"./chevron-down-rIfxR2Nl.js";import"./chevron-up-2Qehir97.js";import"./ellipsis-Cb19tbMV.js";import"./empty-BKVgNOVx.js";import"./chevron-right-BpWIc8ry.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
