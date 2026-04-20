import{j as t}from"./iframe-Cjvt2qOF.js";import{h as o}from"./index-DGq_8iqW.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-B_CWQByo.js";import{i as n,j as f,c as S}from"./data-table-Bmr4mTlj.js";import{C,A as a}from"./applications-config-CvuYNe9c.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-BnUenIan.js";import{e as h}from"./table-mock-Xj0mpb8v.js";import{B as R}from"./chunk-UVKPFVEO-BFJGVNwp.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BTgHPM2l.js";import"./index-Bhn0BmqL.js";import"./filter-button-CXaTOSim.js";import"./badge-CvTkURNM.js";import"./separator-xFgR_GDd.js";import"./index-hYefdW70.js";import"./x-DnYZPIfo.js";import"./button-31A3H1QR.js";import"./action-button-DpQP58Hu.js";import"./dropdown-menu-0dsgiVyr.js";import"./index-lwMICRJh.js";import"./circle-DLZqJxqN.js";import"./check-C-jOFTXU.js";import"./i18n-Dnv80NNE.js";import"./checkbox-BrGrWv1I.js";import"./index-B-sno1ut.js";import"./command-C0KyE4Or.js";import"./dialog-Be7bRCSp.js";import"./popover-DqMbjwaV.js";import"./search-BcSXsJmI.js";import"./skeleton-DUy6XORO.js";import"./test-tube-diagonal-Cs-H5WLs.js";import"./user-DGo0BCPU.js";import"./priority-indicator-CuyIhMfl.js";import"./indicator-CnGPMHac.js";import"./shape-triangle-up-icon-D2jun7zk.js";import"./refresh-ccw-Dg-ttG1A.js";import"./pen-DTGapAb1.js";import"./isEqual-BcHLWw8Y.js";import"./settings-uqxxwG47.js";import"./number-format-BJRPyNdw.js";import"./card-BLrU0CRn.js";import"./pagination-DbyVNnMF.js";import"./select-Dng3NesG.js";import"./chevron-down-D2AYFlej.js";import"./chevron-up-CN4iex_Q.js";import"./ellipsis-tgK2STS6.js";import"./empty-BNG_VSjH.js";import"./chevron-right-nvtyH8D1.js";import"./toString-9ZbBhwMv.js";import"./empty-cell-DHKixtua.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
