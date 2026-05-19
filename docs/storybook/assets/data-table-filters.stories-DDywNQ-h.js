import{j as t}from"./iframe-BHfqIMzt.js";import{h as o}from"./index-D9Oo4RIl.js";import{h as b}from"./api-CyFX6UkQ.js";import{F as u}from"./case-exploration-table-filters-BxQtrM0t.js";import{Y as h,d as n,W as f,c as S}from"./table-mock-DQzpd8R6.js";import{C,A as a}from"./applications-config-C7w-V47M.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-rIwtmf1e.js";import{B as R}from"./chunk-UVKPFVEO-BdZzg4Ed.js";import"./preload-helper-Dp1pzeXC.js";import"./api-B0qKpffM.js";import"./index-Cz41nXzz.js";import"./filter-button-ByEu1h_4.js";import"./badge-Clz7x7xN.js";import"./separator-kpnGY0Sp.js";import"./index-Ivg0BASX.js";import"./x-BF5vTZ3R.js";import"./button-DT6SeUbn.js";import"./action-button-DRFMZGea.js";import"./dropdown-menu-rcpHAa0A.js";import"./index-BTPV-258.js";import"./index-CQhfjdm1.js";import"./check-C0u0WUKH.js";import"./circle-DGplIKvp.js";import"./i18n-DJqZGQS-.js";import"./checkbox-CNQBp01B.js";import"./index-3LkGnVHf.js";import"./command-DZF7ytcH.js";import"./dialog-Bn1MS73X.js";import"./popover-BewSVhXe.js";import"./search-DtUF8EkM.js";import"./skeleton-D18Wmj17.js";import"./test-tube-diagonal-CuEV9Av_.js";import"./user-Dc35guHj.js";import"./priority-indicator-CVfl1WJl.js";import"./indicator-BwCl0kGr.js";import"./shape-triangle-up-icon-CSUsYJp3.js";import"./refresh-ccw-2umspjJu.js";import"./pen-BN0eLD4q.js";import"./empty-cell-BgjfRQ-p.js";import"./number-format-BPv4h-GA.js";import"./settings-BgWpnnNf.js";import"./card-lyi8kvAE.js";import"./pagination-fh_-rV6h.js";import"./select-BetQHEcH.js";import"./chevron-down-BXH6ZcSp.js";import"./chevron-up-BpmzS9PL.js";import"./ellipsis-CSHtRJJv.js";import"./empty-kgZW5G2j.js";import"./chevron-right-7Nx57Tb3.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
