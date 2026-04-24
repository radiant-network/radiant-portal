import{j as t}from"./iframe-Cl_us0Ef.js";import{h as o}from"./index-CF0woTph.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-anmXO0IG.js";import{i as n,j as f,c as S}from"./data-table-Bzf8GcNt.js";import{C,A as a}from"./applications-config-Ctn1-MGc.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-Cy_L_RGL.js";import{e as h}from"./table-mock-B9lwL7R0.js";import{B as R}from"./chunk-UVKPFVEO-Cchu1OLp.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BDkdQZy6.js";import"./index-H2O2sYf7.js";import"./filter-button-DsX4G8MB.js";import"./badge-fUfnZc9R.js";import"./separator-CNhVfHxM.js";import"./index-1z3gKZ3X.js";import"./x-BBolOUoW.js";import"./button-CcL9vRdB.js";import"./action-button-DtCedlrk.js";import"./dropdown-menu-DdbrZPUp.js";import"./index-B6rZWH80.js";import"./circle-BnOaCZ5x.js";import"./check-DjGEQf1v.js";import"./i18n-Cilb11M3.js";import"./checkbox-BX93_oIc.js";import"./index-CLZc1hCR.js";import"./command-DwoAgaXb.js";import"./dialog-BokZr39f.js";import"./popover-DL05YwWD.js";import"./search-BnZN7Y34.js";import"./skeleton-BcJ5rh2z.js";import"./test-tube-diagonal-K_uV9MKL.js";import"./user-DeETQK9Q.js";import"./priority-indicator-DRVNgnPO.js";import"./indicator-BQR-3LLl.js";import"./shape-triangle-up-icon-CPKngPZl.js";import"./refresh-ccw-BQu_nGPM.js";import"./pen-Da_q4ZcW.js";import"./isEqual-CIwcs3En.js";import"./settings-Dk1yDyH1.js";import"./number-format-CSOqHdeH.js";import"./card-TWGnUbCh.js";import"./pagination-BkaKKaLT.js";import"./select-DcNi7x-A.js";import"./chevron-down-BvOMOC6S.js";import"./chevron-up-BVRGflWO.js";import"./ellipsis-Bx_-WdQ-.js";import"./empty-K5kX0fyq.js";import"./chevron-right-BKIWVrIy.js";import"./toString-lTdUKnlg.js";import"./empty-cell--0QoktO8.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
