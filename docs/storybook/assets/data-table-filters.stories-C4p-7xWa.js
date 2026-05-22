import{j as t}from"./iframe-GdxnesVn.js";import{h as o}from"./index-Hy8dHOKY.js";import{i as b}from"./api-QmR3WP_i.js";import{F as u}from"./case-exploration-table-filters-EKf5HFQB.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-BFa4Ln4L.js";import{C,A as a}from"./applications-config-BKnXAE14.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-l7ZZTp_X.js";import{B as R}from"./chunk-UVKPFVEO-DmnjYX4q.js";import"./preload-helper-Dp1pzeXC.js";import"./api-Dv-D8lFH.js";import"./index-BtVIboGS.js";import"./filter-button-sATzHNfA.js";import"./badge-DmU_tqDG.js";import"./separator-BeWp1rgn.js";import"./index-CCfaDUsQ.js";import"./x-BiI2aFGl.js";import"./button-ClPsGv-5.js";import"./action-button-DdwRbbYb.js";import"./dropdown-menu-Bt4yU2yO.js";import"./index-lbgyfsZT.js";import"./index-CohetcGb.js";import"./check-83bVRx4O.js";import"./circle-vuLCNpQ4.js";import"./i18n-DzmMPxCa.js";import"./checkbox-CusuEkYx.js";import"./index-U0EGY5Le.js";import"./command-BhVoWoVF.js";import"./dialog-QsUEKZgT.js";import"./popover-CPeYGo9v.js";import"./search-BA5v6Cm8.js";import"./skeleton-C9LrNl4S.js";import"./test-tube-diagonal-Bxzomowa.js";import"./user-BnMWyPTT.js";import"./priority-indicator-DcZjz0G7.js";import"./indicator-DSxU0EuU.js";import"./shape-triangle-up-icon-DDLS4bWf.js";import"./refresh-ccw-BZkMI7-N.js";import"./pen-Djm9w0CK.js";import"./empty-cell-BHc70oPk.js";import"./number-format-DczF55a4.js";import"./settings-RAFfFrYm.js";import"./card-BrRT-4gb.js";import"./pagination-CZjvHBK6.js";import"./select---Hctovk.js";import"./chevron-down-CPjZXSDk.js";import"./chevron-up-BV7Ckg0a.js";import"./ellipsis-DZO8rZ4c.js";import"./empty-UnIynl4g.js";import"./chevron-right-CVLNm2ce.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
