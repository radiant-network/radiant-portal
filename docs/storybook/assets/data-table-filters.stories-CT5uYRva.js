import{j as t}from"./iframe-CoEcbA0Q.js";import{h as o}from"./index-6kR7fU3j.js";import{j as b}from"./api-ok7Ado9G.js";import{F as u}from"./case-exploration-table-filters-CN9-0_S6.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-BK-CVkPR.js";import{C,A as a}from"./applications-config-04phLGWC.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-DDM_GnZx.js";import{B as R}from"./chunk-UVKPFVEO-pvdJNT1A.js";import"./preload-helper-Dp1pzeXC.js";import"./api-rC05Zo1-.js";import"./index-D_cpkjZT.js";import"./filter-button-CiC4Yumj.js";import"./badge-BSS6HvE5.js";import"./separator-DjdzzDam.js";import"./index-BiAuQahW.js";import"./x-C8SyGHwj.js";import"./button-D9HtrZJg.js";import"./action-button-lIohNrhc.js";import"./dropdown-menu-CBuFLUqm.js";import"./index-Dlfzbc-H.js";import"./index-BEcaC1MX.js";import"./check-DGlyanKq.js";import"./circle-CUypZ47c.js";import"./i18n-BOQJC4x0.js";import"./checkbox-B_PPLoZ0.js";import"./index-BGnRsrYH.js";import"./command-BEZig0OQ.js";import"./dialog-WoHb15is.js";import"./popover-0eNC2MXR.js";import"./search-C9FEf-be.js";import"./skeleton-BpGAGHGh.js";import"./test-tube-diagonal-Q-TmAVfw.js";import"./user-CMP3aoMC.js";import"./priority-indicator-BclrwGr5.js";import"./indicator-x44BEX8q.js";import"./shape-triangle-up-icon-MHvetKtu.js";import"./refresh-ccw-CYjbwTev.js";import"./pen-fvc4OX-7.js";import"./empty-cell-DtgMIj8f.js";import"./number-format-BRP4cvo-.js";import"./settings-DqU5WYFH.js";import"./card-CWlg6TgY.js";import"./pagination-wMgDnhla.js";import"./select-BGZ25BOn.js";import"./chevron-down-BtUktuc-.js";import"./chevron-up-DcCvxWq6.js";import"./ellipsis-Bx2_XSS6.js";import"./empty-D8nNGaaJ.js";import"./chevron-right-Brdp88Vm.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
