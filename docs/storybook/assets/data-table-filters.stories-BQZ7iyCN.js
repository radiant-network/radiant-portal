import{j as t}from"./iframe-C1u-2gre.js";import{h as o}from"./index-BMbtyhKV.js";import{g as b}from"./api-By65wdtu.js";import{F as u}from"./case-exploration-table-filters-DMItZOkl.js";import{D as n,i as f,c as S}from"./data-table-BRhe4IKl.js";import{C,A as a}from"./applications-config-BKh7m2Bg.js";import{a as x,b as F,d as A,e as _,f as v,g as j}from"./api-case-BeCOazyM.js";import{e as h}from"./table-mock-CUVBpG6o.js";import{B as R}from"./chunk-UVKPFVEO-BmobS7kn.js";import"./preload-helper-Dp1pzeXC.js";import"./index-CKlqh2ii.js";import"./index-C-FXf0Bx.js";import"./filter-button-BAx2SidP.js";import"./badge-CM7StMV8.js";import"./separator-DPfAxmJm.js";import"./index-CgNm27zw.js";import"./x-HH5bc7V-.js";import"./button-Dktn9BJ3.js";import"./action-button-DWTia4a9.js";import"./dropdown-menu-BcCUxFHU.js";import"./index-CYGMwLzI.js";import"./circle-BACuEz9j.js";import"./check-BYmYiSGN.js";import"./i18n-D_VZFZgc.js";import"./checkbox-QAgHfHh1.js";import"./index-gLF2yGWG.js";import"./command-BvFDKf_h.js";import"./dialog-Cm870SRn.js";import"./popover-Dp5uCyjd.js";import"./search-CKKo9Lpp.js";import"./skeleton-COf7A7wa.js";import"./test-tube-diagonal-tL_7NSif.js";import"./user-BDIeBIGB.js";import"./priority-indicator-vjdZZBlQ.js";import"./indicator-BMNbXXdZ.js";import"./shape-triangle-up-icon-3FeZhYPF.js";import"./refresh-ccw-B9FFBwep.js";import"./pen-B3xXg7H_.js";import"./isEqual-B7aA0S11.js";import"./isArray-BTogDwF8.js";import"./settings-BqG6Hkd-.js";import"./number-format-CWBLyO08.js";import"./card-BUjFUQhm.js";import"./pagination-DOhKP_O-.js";import"./select-BWA98a3m.js";import"./chevron-down-CokM-a8l.js";import"./chevron-up-LVA7krxR.js";import"./ellipsis-DMxpYWEo.js";import"./empty--Bqn0gz5.js";import"./use-data-table-DtV3Dg2y.js";import"./chevron-right--cKnTOOV.js";import"./toString-BJaFKlYo.js";import"./empty-cell-T98HuDHJ.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Te={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
