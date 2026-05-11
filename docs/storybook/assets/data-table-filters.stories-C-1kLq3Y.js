import{j as t}from"./iframe-CdetP1X0.js";import{h as o}from"./index-D1jy76XM.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-CLA3ajPo.js";import{i as n,j as f,c as S}from"./data-table-Z5L-vTv_.js";import{C,A as a}from"./applications-config-DvyfV6tQ.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-MkW2IQrD.js";import{e as h}from"./table-mock-nOilPTzv.js";import{B as R}from"./chunk-UVKPFVEO-BC8YNRtx.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BJmkyz_i.js";import"./index-D56yV3Gg.js";import"./filter-button-DoelFBML.js";import"./badge-DiTV7c-v.js";import"./separator-DWpVdauv.js";import"./index-BbVp5V_G.js";import"./x-Coq7ggOF.js";import"./button-BbJzX6I1.js";import"./action-button-CR1ASOMi.js";import"./dropdown-menu-FRQNa6wC.js";import"./index-Y-WAq52a.js";import"./circle-CGfH005V.js";import"./check-CJ0hc2Z8.js";import"./i18n-Cg4CY2fo.js";import"./checkbox-CxT81BhA.js";import"./index-C4qGYBYK.js";import"./command-D3xjVurs.js";import"./dialog-BdxzA1vH.js";import"./popover-Ck4ottfO.js";import"./search-LgeU1f5x.js";import"./skeleton-CXyg18dM.js";import"./test-tube-diagonal-DFXB9yKn.js";import"./user-Bh0Vuqik.js";import"./priority-indicator-D_ybsauL.js";import"./indicator-Cip8c_Yg.js";import"./shape-triangle-up-icon-C57Ece3o.js";import"./refresh-ccw-BEfKTAZ2.js";import"./pen-BxDhj5Hb.js";import"./isEqual-BxJmMFUh.js";import"./settings-Bo96-P6_.js";import"./number-format-D76GnYsu.js";import"./card-CrmyLaG1.js";import"./pagination-CoV5ruLF.js";import"./select-7K9dkw_q.js";import"./chevron-down-hB7PYlfF.js";import"./chevron-up-PEAKnR3I.js";import"./ellipsis-B2dLt_Hp.js";import"./empty-B5yfI_y3.js";import"./chevron-right-CR5OpHkL.js";import"./toString-EPEqpjRo.js";import"./empty-cell-DJZteX_Y.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
