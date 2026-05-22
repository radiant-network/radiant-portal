import{j as t}from"./iframe-Qm3M9fYv.js";import{h as o}from"./index-dLs2gNF6.js";import{i as b}from"./api-QmR3WP_i.js";import{F as u}from"./case-exploration-table-filters-BZEl8bMv.js";import{Z as h,d as n,X as f,c as S}from"./table-mock-Ww4djDep.js";import{C,A as a}from"./applications-config-BzyJuUak.js";import{b as x,d as F,e as A,f as _,g as v,i as j}from"./api-case-BrNCtE-H.js";import{B as R}from"./chunk-UVKPFVEO-C7xGb2HA.js";import"./preload-helper-Dp1pzeXC.js";import"./api-DFE_l_2S.js";import"./index-tRC785VS.js";import"./filter-button-PLEpHlVU.js";import"./badge-DIBotu1D.js";import"./separator-rxJGBRR6.js";import"./index-Uln5Z1CG.js";import"./x-BLOADziH.js";import"./button-BNjULfsN.js";import"./action-button-CAa3sK_K.js";import"./dropdown-menu-gm3NzM5r.js";import"./index-D0f4O7bL.js";import"./index-BQHUTV5s.js";import"./check-C9ikh__7.js";import"./circle-BbcGUewd.js";import"./i18n-DtVzpPj7.js";import"./checkbox-DQrShM3c.js";import"./index-DaOEFwzL.js";import"./command-BPHPZT7w.js";import"./dialog-Ckfjhd8t.js";import"./popover-BDlEwyUl.js";import"./search-vuyHuR_W.js";import"./skeleton-DIsUFmAv.js";import"./test-tube-diagonal-BMpIK2uH.js";import"./user-DLr8VNSA.js";import"./priority-indicator-Dv5LJBAa.js";import"./indicator-RdkLNeEw.js";import"./shape-triangle-up-icon-Dq2gKNFl.js";import"./refresh-ccw-BNnEVfcc.js";import"./pen-C0ThUCuN.js";import"./empty-cell-DX4pTmxI.js";import"./number-format-Dn0HDydC.js";import"./settings-DtWfdnJg.js";import"./card-mVdZeqDq.js";import"./pagination-V7s34Dqc.js";import"./select-DxMjtF_T.js";import"./chevron-down-D_blkYRC.js";import"./chevron-up-DC2vAsAe.js";import"./ellipsis-CWE7XNWM.js";import"./empty-Bl2dvnMG.js";import"./chevron-right-Daegi5j6.js";const r=S(),T={variant_entity:{app_id:a.variant_entity},germline_snv_occurrence:{app_id:a.germline_snv_occurrence,aggregations:[]},germline_cnv_occurrence:{app_id:a.germline_cnv_occurrence,aggregations:[]},admin:{admin_code:"admin",app_id:a.admin},portal:{name:"",navigation:{}}},_e={title:"Tables/Data Table/Filters",component:n,args:{id:"storybook",columns:[r.accessor("firstName",{cell:e=>e.getValue(),header:()=>t.jsx("span",{children:"First Name"})}),r.accessor(e=>e.lastName,{id:"lastName",cell:e=>t.jsx("i",{children:e.getValue()}),header:()=>t.jsx("span",{children:"Last Name"})}),r.accessor("age",{header:()=>"Age",cell:e=>e.renderValue()}),r.accessor("visits",{header:()=>t.jsx("span",{children:"Visits"})}),r.accessor("status",{header:"Status"}),r.accessor("progress",{header:"Profile Progress"})],data:h,serverOptions:{defaultSorting:[{field:"germline_pf_wgs",order:b.Asc}],onSortingChange:e=>{}},defaultColumnSettings:f([{id:"firstName",visible:!0,label:"First Name"},{id:"lastName",visible:!0,label:"Last Name"},{id:"age",visible:!0,label:"Age"},{id:"visits",visible:!0,label:"firstName"},{id:"status",visible:!0,label:"Status"},{id:"progress",visible:!0,label:"Profile Progress"}]),loadingStates:{total:!1,list:!1},pagination:{type:"server",state:{pageIndex:0,pageSize:10},onPaginationChange:()=>{}},total:10},decorators:[e=>t.jsx(R,{children:t.jsx(C,{config:T,children:t.jsx(e,{})})})]},s={args:{loadingStates:{list:!0,total:!0},enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!0,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})},i={parameters:{msw:{handlers:[o.post(x,F),o.post(A,_),o.get(v,j)]}},args:{loadingStates:{list:!1,total:!1},data:h,enableColumnOrdering:!1,enableFullscreen:!0,tableIndexResultPosition:"hidden",TableFilters:t.jsx(u,{loading:!1,setSearchCriteria:()=>{}})},render:e=>t.jsx(n,{...e})};var l,p,m;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
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
