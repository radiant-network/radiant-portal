import{j as t}from"./iframe-BzPXB4sC.js";import{h as o}from"./index-qKxtdwF4.js";import{g as b}from"./api-B3xiDz_1.js";import{F as u}from"./case-exploration-table-filters-B94OeKOQ.js";import{i as n,j as f,c as S}from"./data-table-CchmGWs3.js";import{C,A as a}from"./applications-config-zHvcd1fT.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-9t4qZpbf.js";import{e as h}from"./table-mock-CuzIPJ4A.js";import{B as R}from"./chunk-UVKPFVEO-CHJNbMil.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BskDNR1m.js";import"./index-CTLVmK5z.js";import"./filter-button-_nUmHL46.js";import"./badge-Bkyg6NYQ.js";import"./separator-CrPHIJDG.js";import"./index-95tL82tM.js";import"./x-GpHZLcX6.js";import"./button-Bvx243Ne.js";import"./action-button-Db1BdDYf.js";import"./dropdown-menu-BdVey5jx.js";import"./index-ONVb-Tgn.js";import"./circle-BreiCpB9.js";import"./check-N4EqZ0NE.js";import"./i18n-BfGFGaNE.js";import"./checkbox-CTcufNLQ.js";import"./index-BxlgodF6.js";import"./command-BvXjL45y.js";import"./dialog-AYh26kwc.js";import"./popover-BjWp8qaV.js";import"./search-Cp75uWkt.js";import"./skeleton-BsdIzALQ.js";import"./test-tube-diagonal-B7gyj8nO.js";import"./user-DAsc809h.js";import"./priority-indicator-DM8BuXoe.js";import"./indicator-CwVkVPZm.js";import"./shape-triangle-up-icon-BDUY4_Lx.js";import"./refresh-ccw-CUhn_hkm.js";import"./pen-DWzqgAkV.js";import"./isEqual-CCVAfmws.js";import"./settings-CHm_Eutf.js";import"./number-format-BJOxyGGC.js";import"./card-CioA5ZEF.js";import"./pagination-CBGhQn7L.js";import"./select-EiJn-Q6R.js";import"./chevron-down-B-B5r3MA.js";import"./chevron-up-C3Zmt_5h.js";import"./ellipsis-DaW-PY1N.js";import"./empty-BbLMO6Ub.js";import"./chevron-right-CY0d7xDB.js";import"./toString-CYx6vjA8.js";import"./empty-cell-D7bJh_D3.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},je={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
