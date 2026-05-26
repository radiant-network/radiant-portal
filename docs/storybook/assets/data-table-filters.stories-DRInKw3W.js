import{j as t}from"./iframe-UzZZM96I.js";import{h as o}from"./index-D3PW6uPH.js";import{j as b}from"./api-ok7Ado9G.js";import{F as u}from"./case-exploration-table-filters-Cjt9hpnZ.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-BOmSJ00e.js";import{C,A as a}from"./applications-config-C04VUxYV.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-juTLbNEV.js";import{B as R}from"./chunk-UVKPFVEO-DM0BTXi2.js";import"./preload-helper-Dp1pzeXC.js";import"./api-tdfUFFl-.js";import"./index-DIXd3_X8.js";import"./filter-button-Ul6i8l6L.js";import"./badge-BHY_ufMS.js";import"./separator-D16OPgLn.js";import"./index-BRUfjbBU.js";import"./x-BqTFwZaJ.js";import"./button-BWuJ3ILY.js";import"./action-button-ZppnzVQS.js";import"./dropdown-menu-C5x8kC1L.js";import"./index-CvKgbFy1.js";import"./index-BhlzdYk0.js";import"./check-Dbn9Sbvo.js";import"./circle-CnVfFRjs.js";import"./i18n-DIReciWC.js";import"./checkbox-CXZ6xFxp.js";import"./index-CMyafHE2.js";import"./command-Do9G5h5W.js";import"./dialog-BuV9d9yK.js";import"./popover-apmwcABE.js";import"./search-CaRV1uQX.js";import"./skeleton-CBlVKJ-V.js";import"./test-tube-diagonal-B_fGaLc4.js";import"./user-Rm6c68SJ.js";import"./priority-indicator-C8xWew6K.js";import"./indicator-D3CiRuAQ.js";import"./shape-triangle-up-icon-DwtjbIDI.js";import"./refresh-ccw-BUWghYYz.js";import"./pen-BeIBslzY.js";import"./empty-cell-DPmuwc1V.js";import"./number-format-DnR-PBlP.js";import"./settings-BmUJIs7y.js";import"./card-B7ZyAxgQ.js";import"./pagination-CccTI-1d.js";import"./select-B7EYEows.js";import"./chevron-down-DP4NW5m7.js";import"./chevron-up-BYi7J0Uo.js";import"./ellipsis-B-XtpIyw.js";import"./empty-DXEJuM0t.js";import"./chevron-right-D2LPDMuX.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
