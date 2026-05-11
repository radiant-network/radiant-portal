import{j as t}from"./iframe-BWVweZ6L.js";import{h as o}from"./index-5O4_qTUd.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-DDEQo09S.js";import{i as n,j as f,c as S}from"./data-table-C1G5Cskx.js";import{C,A as a}from"./applications-config-C0XzbuzL.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-DNuTx2Zz.js";import{e as h}from"./table-mock-BcyMW2xy.js";import{B as R}from"./chunk-UVKPFVEO-6nJnNXpM.js";import"./preload-helper-Dp1pzeXC.js";import"./index-D6_rDfcV.js";import"./index-CKUIM1sH.js";import"./filter-button-BslxB7C8.js";import"./badge-flx1eVI1.js";import"./separator-BeoHuMME.js";import"./index-D5uXdybh.js";import"./x-D4hBKM-j.js";import"./button-CyO2GiBa.js";import"./action-button-B1cMf3Og.js";import"./dropdown-menu-CdJShM6V.js";import"./index-D3WmDdxv.js";import"./circle-D7KzJ1gO.js";import"./check-CL3HXxiZ.js";import"./i18n-B38pq5Fo.js";import"./checkbox-CquB1Dir.js";import"./index-s-Zir4Bc.js";import"./command-Ds2b5yrc.js";import"./dialog-BljwHRuB.js";import"./popover-CMoreRhn.js";import"./search-HRA4IS6Z.js";import"./skeleton-BsnggfWB.js";import"./test-tube-diagonal-BgsEc0ml.js";import"./user-C8RvanN7.js";import"./priority-indicator-BB0xvvmB.js";import"./indicator-y--FLflZ.js";import"./shape-triangle-up-icon-CLLNnQ1S.js";import"./refresh-ccw-Bys2bzoX.js";import"./pen-Dz7hsAkM.js";import"./isEqual-CiEynZlp.js";import"./settings-B3OmGyT_.js";import"./number-format-D5uzKorE.js";import"./card-DC0dP_cy.js";import"./pagination-ucvNkAG5.js";import"./select-IJakBg7D.js";import"./chevron-down-B5745paG.js";import"./chevron-up-r0O5XX6N.js";import"./ellipsis-lJJ3Eqh1.js";import"./empty-D3KPt-CD.js";import"./chevron-right-D5DMlxEW.js";import"./toString-B4z926-1.js";import"./empty-cell-BwpmuH4J.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
