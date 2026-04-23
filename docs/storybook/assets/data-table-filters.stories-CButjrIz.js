import{j as t}from"./iframe-BuR-W-fa.js";import{h as o}from"./index-DJWTt6mK.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-C429rkPT.js";import{i as n,j as f,c as S}from"./data-table-BOFmZySC.js";import{C,A as a}from"./applications-config-DAAdteLW.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-Dc986Qek.js";import{e as h}from"./table-mock-tOvm653D.js";import{B as R}from"./chunk-UVKPFVEO-CWTtRohr.js";import"./preload-helper-Dp1pzeXC.js";import"./index-D4IyjWvQ.js";import"./index-C0yII3yz.js";import"./filter-button-DArKkgzw.js";import"./badge-Bfg8_q5o.js";import"./separator-CSEOEm28.js";import"./index-CZAnjjFi.js";import"./x-CeyyTm0e.js";import"./button-B_s0ElI6.js";import"./action-button-Dm4He-6n.js";import"./dropdown-menu-Czk3TyM-.js";import"./index-C9FNewnO.js";import"./circle-B5f2v5kv.js";import"./check-EeIATi7d.js";import"./i18n-nq_DVSk4.js";import"./checkbox-B7cqKBWz.js";import"./index-DVLOV72x.js";import"./command-CMelPBZ8.js";import"./dialog-DXd3dp6m.js";import"./popover-BRSjdxBE.js";import"./search-B3ZMu57v.js";import"./skeleton-h-NkMw4e.js";import"./test-tube-diagonal-DlI2PlD8.js";import"./user-BsOrb2mq.js";import"./priority-indicator-j5wG4b6Y.js";import"./indicator-Dt9FEtdu.js";import"./shape-triangle-up-icon-DFV5vd1z.js";import"./refresh-ccw-BCRhYRXs.js";import"./pen-D_fdFMP9.js";import"./isEqual-Cx_WGx-j.js";import"./settings-Cuv0e25N.js";import"./number-format-D6jwcHcv.js";import"./card-D0dHTGsy.js";import"./pagination-B99B1ppo.js";import"./select-BhqZOijg.js";import"./chevron-down-DGeAVz8p.js";import"./chevron-up-B6mEp1uY.js";import"./ellipsis-Ceor0CEA.js";import"./empty-DGMID6pI.js";import"./chevron-right-CpVBySyw.js";import"./toString-CORSkEnp.js";import"./empty-cell-Bv-3_xS5.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
