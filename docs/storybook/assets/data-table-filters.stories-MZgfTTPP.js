import{j as t}from"./iframe-DaM1YiRn.js";import{h as o}from"./index-BFZNQKGY.js";import{h as b}from"./api-8Q83AOwn.js";import{F as u}from"./case-exploration-table-filters-BNjrYjwc.js";import{Y as h,d as n,W as f,c as S}from"./table-mock-CWr0AU3S.js";import{C,A as a}from"./applications-config-DRrffRKc.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-GTodpViJ.js";import{B as R}from"./chunk-UVKPFVEO-pQwV6dyp.js";import"./preload-helper-Dp1pzeXC.js";import"./api-BPMps200.js";import"./index-CbTAE3zM.js";import"./filter-button-DrPDa-iD.js";import"./badge-WGDW4p-Z.js";import"./separator-skiKsUbH.js";import"./index-WnNzYmWl.js";import"./x-B0GwocEO.js";import"./button-cIo4kTDu.js";import"./action-button-DhgUXwlC.js";import"./dropdown-menu-CG6n5PUn.js";import"./index-Btmr2mec.js";import"./index-D9vHrUxW.js";import"./check-uVsp9yS3.js";import"./circle-BSdxmdQU.js";import"./i18n-DNukmF0K.js";import"./checkbox-BUGrcaMg.js";import"./index-BcAjjZR6.js";import"./command-D2s5EQND.js";import"./dialog-DbOn7ec4.js";import"./popover-DIKkgbHT.js";import"./search-Bpd_ZskP.js";import"./skeleton-CHYfzFrS.js";import"./test-tube-diagonal-w9ezBljv.js";import"./user-CzDNXS9c.js";import"./priority-indicator-Cgkf8y8Y.js";import"./indicator-yneNOfse.js";import"./shape-triangle-up-icon-ossf0v_s.js";import"./refresh-ccw-DnBehzaq.js";import"./pen-CNSYEtce.js";import"./empty-cell-D4SxpiGV.js";import"./number-format-C4jvmGui.js";import"./settings-CoQbnCc3.js";import"./card-DFhfTnzo.js";import"./pagination-Bu7qLe6c.js";import"./select-CAxhZKY6.js";import"./chevron-down-ChV0DVVz.js";import"./chevron-up-BN1tssgg.js";import"./ellipsis-BvsdTg7T.js";import"./empty-B60GnSRF.js";import"./chevron-right-wrw3a5Ou.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
