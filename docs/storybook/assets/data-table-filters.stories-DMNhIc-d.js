import{j as t}from"./iframe-g_rM03WD.js";import{h as o}from"./index-D76JSZ7j.js";import{i as b}from"./api-Bvp-Hr8F.js";import{F as u}from"./case-exploration-table-filters-MdAYNrrj.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-e5g9Lrts.js";import{C,A as a}from"./applications-config-CxBrIv9L.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-Bn76uG6B.js";import{B as R}from"./chunk-UVKPFVEO-DHXqeU7Z.js";import"./preload-helper-Dp1pzeXC.js";import"./api-CKdnRKzk.js";import"./index-HzBRMg_2.js";import"./filter-button-vck4cmPT.js";import"./badge-DbXSw4or.js";import"./separator-0OwIr9F3.js";import"./index-C5nHNu5V.js";import"./x-Dkdgqspm.js";import"./button-DyjUiMpD.js";import"./action-button-firnxveF.js";import"./dropdown-menu-C8dl2V8Q.js";import"./index-B4C9r0pW.js";import"./index-CiJ_Won9.js";import"./check-Cn-MPm-h.js";import"./circle-CWj6cztr.js";import"./i18n-A89o1_Ry.js";import"./checkbox-CVRLYX1z.js";import"./index-BFdcfXZc.js";import"./command-DNINWfRl.js";import"./dialog-B7CFIBSW.js";import"./popover-BIf4FZKu.js";import"./search-DpO6Ey1t.js";import"./skeleton-DtYRL2lA.js";import"./test-tube-diagonal-CG8WOqhD.js";import"./user-tgAlfidK.js";import"./priority-indicator-Bn0_qT2M.js";import"./indicator-C5km8UkL.js";import"./shape-triangle-up-icon-o1mFrbr3.js";import"./refresh-ccw-BSKUqism.js";import"./pen-BjFRRIfC.js";import"./empty-cell-Cgygmkbl.js";import"./number-format-xTNeIOJX.js";import"./settings-6wjMJryh.js";import"./card-f1mkc5wR.js";import"./pagination-BHby77tL.js";import"./select-Bvz1jMCZ.js";import"./chevron-down-BVdbVXtR.js";import"./chevron-up-KfOk2Dl2.js";import"./ellipsis-QJcYxC88.js";import"./empty-CSmQI8YY.js";import"./chevron-right-DBk9npQS.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
