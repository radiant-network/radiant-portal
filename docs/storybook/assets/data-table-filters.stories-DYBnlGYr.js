import{j as t}from"./iframe-w_-n8Mse.js";import{h as o}from"./index-BdGKLXPp.js";import{g as b}from"./api-By65wdtu.js";import{F as u}from"./case-exploration-table-filters-TfvE8fI9.js";import{D as n,i as f,c as S}from"./data-table-h1w8CGzx.js";import{C,A as a}from"./applications-config-Beijd3sM.js";import{a as x,b as F,d as A,e as _,f as v,g as j}from"./api-case-CFyHIWiS.js";import{e as h}from"./table-mock-CzWC8-bZ.js";import{B as R}from"./chunk-UVKPFVEO-B7mRh0hx.js";import"./preload-helper-Dp1pzeXC.js";import"./index-ubZcqKdS.js";import"./index-CX5fg-SU.js";import"./filter-button-C2ICBLBU.js";import"./badge-F7dL1aM5.js";import"./separator-_t-sRdkq.js";import"./index-CgRbIQdG.js";import"./x-hyDMfLN2.js";import"./button-BwQvD6u9.js";import"./action-button-lST57tav.js";import"./dropdown-menu-9y_mbS5r.js";import"./index-O5sh9deS.js";import"./circle-BFupXhCr.js";import"./check-C9r4UgAI.js";import"./i18n-BQVoti6G.js";import"./checkbox-BFr7kgOH.js";import"./index-DmfFdEQL.js";import"./command-D4dz2Xxl.js";import"./dialog-3fUagDak.js";import"./popover-gWtnCgzO.js";import"./search-DMW-7ZJG.js";import"./skeleton-CKmewt_d.js";import"./test-tube-diagonal-C-NGL42W.js";import"./user-D8tJuzoL.js";import"./priority-indicator-Vrmtw7gH.js";import"./indicator-CufYamVb.js";import"./shape-triangle-up-icon-DNCgNbeE.js";import"./refresh-ccw-tOaKkBII.js";import"./pen-CPrMk_k8.js";import"./isEqual-DxavrBX1.js";import"./isArray-BCGg6NbA.js";import"./settings-ihqnnXN0.js";import"./number-format-B3BLXm2v.js";import"./card-JQJ6hO51.js";import"./pagination-QlmwBkS4.js";import"./select-DlVVUDfR.js";import"./chevron-down-S0y0w5tU.js";import"./chevron-up-B0xNnr65.js";import"./ellipsis-DilRjIjc.js";import"./empty-D-0gfO0j.js";import"./use-data-table-jHrNdyVr.js";import"./chevron-right-C0wvdWTg.js";import"./toString-CHpmVuLr.js";import"./empty-cell-D4foaSEn.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Te={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(g=(d=i.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};const Ne=["Loading","Default"];export{i as Default,s as Loading,Ne as __namedExportsOrder,Te as default};
