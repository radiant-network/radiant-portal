import{j as t}from"./iframe-CDEQG5Fm.js";import{h as o}from"./index-DZyA-Aqz.js";import{h as b}from"./api-CyFX6UkQ.js";import{F as u}from"./case-exploration-table-filters-COh__-u2.js";import{Y as h,d as n,W as f,c as S}from"./table-mock-DZu8d72i.js";import{C,A as a}from"./applications-config-Dr-Uyo5B.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-CcHTNkYF.js";import{B as R}from"./chunk-UVKPFVEO-Cgjsae7h.js";import"./preload-helper-Dp1pzeXC.js";import"./api-CgPEoEKu.js";import"./index-CI53Q_5X.js";import"./filter-button-IMx4JQHj.js";import"./badge-B5MgBNxE.js";import"./separator-uj9S4p4y.js";import"./index-C8xu4Cyg.js";import"./x-CtYnryvp.js";import"./button-DF7fu547.js";import"./action-button-NEINex3-.js";import"./dropdown-menu-CbP8MDIw.js";import"./index-yycurVCY.js";import"./index-DPietwaT.js";import"./check-D48Ebu-n.js";import"./circle-BqtF_CMq.js";import"./i18n-D3vdfF7Y.js";import"./checkbox-BZlr3bol.js";import"./index-D3gZvzlJ.js";import"./command-CA39MvgS.js";import"./dialog-BXr-U2Mp.js";import"./popover-G0rl-BsD.js";import"./search-IPlUHrZx.js";import"./skeleton-v2y80y7B.js";import"./test-tube-diagonal-DXRlMc-9.js";import"./user-CtjPe9-Y.js";import"./priority-indicator-DxSrv97u.js";import"./indicator-BhxBmEUL.js";import"./shape-triangle-up-icon-CqCisHvF.js";import"./refresh-ccw-BZDj_n9G.js";import"./pen-BXVN01yl.js";import"./empty-cell--gNLSpUO.js";import"./number-format-tjJHE8q9.js";import"./settings-Cz9a97RP.js";import"./card-vQ9ylZj9.js";import"./pagination-DGkie8j4.js";import"./select-CVZ03YM8.js";import"./chevron-down-CV7JSjaa.js";import"./chevron-up-BB2PFrkw.js";import"./ellipsis-BMVr38Zb.js";import"./empty-C6fGKB6v.js";import"./chevron-right-DfIHelcE.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
