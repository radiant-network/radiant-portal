import{j as t}from"./iframe-DeKw-nIV.js";import{h as o}from"./index-CPL9Zhg-.js";import{h as b}from"./api-Bs_y-PxM.js";import{F as u}from"./case-exploration-table-filters-BSPw2p2a.js";import{Y as h,d as n,W as f,c as S}from"./table-mock-BMQ8ypLN.js";import{C,A as a}from"./applications-config-CKb0_Frd.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-DW0bHu35.js";import{B as R}from"./chunk-UVKPFVEO-FCwFwGHF.js";import"./preload-helper-Dp1pzeXC.js";import"./api-CtnQogXC.js";import"./index-BrEhmrN0.js";import"./filter-button-CaUYE_Pd.js";import"./badge-BF0vV3Vu.js";import"./separator-DZ_gh3Vb.js";import"./index-DNch3_Hw.js";import"./x-IkYcDYKN.js";import"./button-DmYWs-9e.js";import"./action-button-Bn69vsYA.js";import"./dropdown-menu-DP_hibKV.js";import"./index-CwBVuKgx.js";import"./circle-DgmccrFP.js";import"./check-_EMQkN7K.js";import"./i18n-CuS2SDu1.js";import"./checkbox-DBro4v5F.js";import"./index-BALSeR0o.js";import"./command-DhoN83lY.js";import"./dialog-DaZpONs0.js";import"./popover-C5RqIImu.js";import"./search-DADZIBT9.js";import"./skeleton-CcA8ksMV.js";import"./test-tube-diagonal-CzZZutkX.js";import"./user-CxeHCYjE.js";import"./priority-indicator-DgZnD2vL.js";import"./indicator-B0Dbn2Ca.js";import"./shape-triangle-up-icon-CfX3Us2W.js";import"./refresh-ccw-ouSFBgRJ.js";import"./pen-ncoH6map.js";import"./empty-cell-02_KHxFX.js";import"./number-format-C_-4JMxc.js";import"./settings-eyMl47NJ.js";import"./card-CpJxp-Yf.js";import"./pagination-xAbm2QH7.js";import"./select-Dy5dQfxO.js";import"./chevron-down-krB8B959.js";import"./chevron-up-B4pVUVLw.js";import"./ellipsis-DZ8UqAOu.js";import"./empty-C2IFbwIg.js";import"./chevron-right-DAgmgBMs.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},Ae={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
}`,...(g=(d=i.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};const _e=["Loading","Default"];export{i as Default,s as Loading,_e as __namedExportsOrder,Ae as default};
